---
title: "Modules: node:module API"
description: "node:module module — `Module` object ၏ utility methods များဖြစ်သော builtinModules, createRequire, isBuiltin, register နှင့် module compile cache ဆိုင်ရာ APIs အကြောင်း"
order: 134
source: "https://nodejs.org/api/module.html"
status: translated
updated: 2026-09-04
---

## The `Module` object

* Type: {Object}

`Module` instances တွေနဲ့ အပြန်အလှန် ဆက်သွယ်ရာမှာ သုံးတဲ့ general utility methods တွေကို ပံ့ပိုးပေးပါတယ်။ [`module`][] ဆိုတာက [CommonJS][] modules တွေထဲမှာ မကြာခဏ တွေ့ရတတ်တဲ့ variable ဖြစ်ပြီး — `import 'node:module'` သို့မဟုတ် `require('node:module')` ကနေ ဝင်ရောက်သုံးနိုင်ပါတယ်။

### `module.builtinModules`

* Type: {string\[]}

Node.js က ပံ့ပိုးပေးထားတဲ့ modules အားလုံးရဲ့ နာမည်တွေ ပါဝင်တဲ့ စာရင်း တစ်ခုပါ။ Module တစ်ခုကို third party က ထိန်းသိမ်းထားတာလား မဟုတ်ဘူးလားဆိုတာ စစ်ဆေးဖို့ သုံးနိုင်ပါတယ်။

ဒီ context ထဲက `module` က [module wrapper][] က ပံ့ပိုးပေးတဲ့ object နဲ့တော့ အတူတူ မဟုတ်ပါဘူး။ အဲဒါကို ဝင်ရောက်သုံးဖို့ `Module` module ကို require လုပ်ရပါတယ်:
```mjs
// module.mjs
// In an ECMAScript module
import { builtinModules as builtin } from 'node:module';
```
```cjs
// module.cjs
// In a CommonJS module
const builtin = require('node:module').builtinModules;
```
### `module.createRequire(filename)`

* `filename` {string|URL} `require` function ကို တည်ဆောက်ရာမှာ သုံးမယ့် filename ပါ။ file URL object တစ်ခု၊ file URL string တစ်ခု သို့မဟုတ် absolute path string တစ်ခု ဖြစ်ရပါမယ်။
* Returns: {require} Require function

```mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])`

> Stability: 1.1 - Active Development

* `specifier` {string|URL} `package.json` ကို ရယူချင်တဲ့ module ရဲ့ specifier ပါ။ _bare specifier_ (package name သက်သက်) တစ်ခု ဖြတ်သန်းပေးလိုက်ရင် package ရဲ့ root မှာ ရှိတဲ့ `package.json` ကို ပြန်ပေးပါတယ်။ _relative specifier_ သို့မဟုတ် _absolute specifier_ တစ်ခု ဖြတ်သန်းပေးလိုက်ရင်တော့ အနီးဆုံး parent `package.json` ကို ပြန်ပေးပါတယ်။
* `base` {string|URL} Module ပါဝင်ရာ နေရာရဲ့ absolute location (`file:` URL string သို့မဟုတ် FS path) ပါ။ CJS အတွက် `__filename` ကို သုံးပါ (`__dirname` မဟုတ်ဘူးနော်!); ESM အတွက်ကတော့ `import.meta.url` ကို သုံးပါ။ `specifier` က absolute specifier တစ်ခု ဆိုရင် ဒါကို ဖြတ်သန်းပေးစရာ မလိုပါဘူး။
* Returns: {string|undefined} `package.json` ကို တွေ့ရှိရင် path တစ်ခုကို ပြန်ပေးပါတယ်။ `specifier` က package တစ်ခု ဆိုရင် package ရဲ့ root `package.json` ကို ပြန်ပေးပြီး — relative (သို့) resolve မလုပ်နိုင်တဲ့ specifier တစ်ခု ဆိုရင်တော့ `specifier` နဲ့ အနီးဆုံး `package.json` ကို ပြန်ပေးပါတယ်။

> **Caveat**: Module format ကို ဆုံးဖြတ်ဖို့ ဒါကို မသုံးပါနဲ့။ အဲဒီ ဆုံးဖြတ်ချက်ကို သက်ရောက်စေတဲ့ အချက်တွေ အများကြီး ရှိပါတယ်; `package.json` ရဲ့ `type` field က အဲဒီထဲမှာ _least definitive_ (အဆုံးအဖြတ် အနည်းဆုံး ပေးနိုင်တဲ့အချက်) ပါ — ဥပမာ file extension က အဲဒါထက် သာလွန်ပြီး loader hook ကတော့ အဲဒါထက်ပါ သာလွန်ပါတယ်။

> **Caveat**: လက်ရှိမှာတော့ built-in default resolver ကိုပဲ အသုံးပြုပါတယ်; [`resolve` customization hooks][resolve hook] တွေ register လုပ်ထားရင်လည်း အဲဒါတွေက resolution ကို သက်ရောက်မှု ရှိမှာ မဟုတ်ပါဘူး။ ဒါက နောင်မှာ ပြောင်းလဲနိုင်ပါတယ်။

```text
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```
```mjs
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Same result when passing an absolute specifier instead:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// When passing an absolute specifier, you might get a different result if the
// resolved module is inside a subfolder that has nested `package.json`.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```
```cjs
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Same result when passing an absolute specifier instead:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// When passing an absolute specifier, you might get a different result if the
// resolved module is inside a subfolder that has nested `package.json`.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
### `module.isBuiltin(moduleName)`

* `moduleName` {string} module ရဲ့ နာမည်ပါ။
* Returns: {boolean} module က builtin ဆိုရင် `true` ပြန်ပေးပြီး — မဟုတ်ရင် `false` ပြန်ပေးပါတယ်။

```mjs
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])`

> Stability: 0 - Deprecated: Use [`module.registerHooks()`][] instead.

* `specifier` {string|URL} Register လုပ်ရမယ့် customization hooks တွေပါ။ `import()` ဆီကို ဖြတ်သန်းပေးမယ့် string နဲ့ အတူတူ ဖြစ်သင့်ပြီး — relative ဖြစ်နေရင်တော့ `parentURL` နဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ပါတယ်။
* `parentURL` {string|URL} `specifier` ကို base URL တစ်ခု (ဥပမာ `import.meta.url`) နဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ချင်ရင် အဲဒီ URL ကို ဒီနေရာမှာ ဖြတ်သန်းပေးနိုင်ပါတယ်။ **Default:** `'data:'`
* `options` {Object}
  * `parentURL` {string|URL} `specifier` ကို base URL တစ်ခု (ဥပမာ `import.meta.url`) နဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ချင်ရင် အဲဒီ URL ကို ဒီနေရာမှာ ဖြတ်သန်းပေးနိုင်ပါတယ်။ `parentURL` ကို second argument အနေနဲ့ ပေးထားရင် ဒီ property ကို လျစ်လျူရှုပါတယ်။ **Default:** `'data:'`
  * `data` {any} [`initialize`][] hook ဆီကို ဖြတ်သန်းပေးမယ့် cloneable ဖြစ်တဲ့ arbitrary JavaScript value တစ်ခုခုပါ။
  * `transferList` {Object\[]} `initialize` hook ဆီကို ဖြတ်သန်းပေးမယ့် [transferable objects][] တွေပါ။

Node.js ရဲ့ module resolution နဲ့ loading အပြုအမူတွေကို စိတ်ကြိုက် ပြင်ဆင်ပေးတဲ့ [hooks][] တွေကို export လုပ်ထားတဲ့ module တစ်ခုကို register လုပ်ပါတယ်။ [Customization hooks][] ကို ကြည့်ပါ။

ဒီ feature ကို [Permission Model][] နဲ့ တွဲသုံးမယ်ဆိုရင် `--allow-worker` လိုအပ်ပါတယ်။

### `module.registerHooks(options)`

> Stability: 1.2 - Release candidate

* `options` {Object}
  * `load` {Function|undefined} [load hook][] ကို ကြည့်ပါ။ **Default:** `undefined`။
  * `resolve` {Function|undefined} [resolve hook][] ကို ကြည့်ပါ။ **Default:** `undefined`။
* Returns: {Object} အောက်ပါ property တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်:
  * `deregister()` {Function} Register လုပ်ထားတဲ့ hooks တွေကို ဖယ်ရှားပြီး — နောက်ထပ် ခေါ်ယူတော့မှာ မဟုတ်အောင် လုပ်ပေးပါတယ်။ Hooks တွေကို တခြားနည်းနဲ့ဆိုရင် run နေတဲ့ process ရဲ့ သက်တမ်းတစ်လျှောက်လုံး ထိန်းသိမ်းထားပါတယ်။
  * `[Symbol.dispose]` {Function} `deregister` နဲ့ အတူတူပါ။

Node.js ရဲ့ module resolution နဲ့ loading အပြုအမူတွေကို စိတ်ကြိုက် ပြင်ဆင်ပေးတဲ့ [hooks][] တွေကို register လုပ်ပါတယ်။ [Customization hooks][] ကို ကြည့်ပါ။ ပြန်ပေးလိုက်တဲ့ object ကို [deregister the hooks][deregistration of synchronous customization hooks] အတွက် သုံးနိုင်ပါတယ်။

### `module.stripTypeScriptTypes(code[, options])`

> Stability: 1.2 - Release candidate

* `code` {string} type annotations တွေ ဖယ်ထုတ်ရမယ့် code ပါ။
* `options` {Object}
  * `mode` {string} **Default:** `'strip'`။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့:
    * `'strip'` TypeScript features တွေရဲ့ transformation ကို မလုပ်ဆောင်ပဲ type annotations တွေကိုပဲ ဖယ်ထုတ်ပါတယ်။
  * `sourceUrl` {string} Source map ထဲမှာ သုံးတဲ့ source url ကို သတ်မှတ်ပေးပါတယ်။
* Returns: {string} type annotations တွေ ဖယ်ထုတ်ပြီးသား code ကို ပြန်ပေးပါတယ်။

`module.stripTypeScriptTypes()` က TypeScript code ထဲက type annotations တွေကို ဖယ်ထုတ်ပေးပါတယ်။ TypeScript code တွေကို `vm.runInContext()` သို့မဟုတ် `vm.compileFunction()` နဲ့ run လုပ်ခင် type annotations တွေကို ဖယ်ထုတ်ဖို့ သုံးနိုင်ပါတယ်။

Default အနေနဲ့ကတော့ code ထဲမှာ transformation လိုအပ်တဲ့ TypeScript features တွေ (ဥပမာ `enum` တွေ) ပါနေရင် error တစ်ခုကို throw လုပ်ပါတယ်။ ထပ်ဆောင်း အချက်အလက်တွေအတွက် [type-stripping][] ကို ကြည့်ပါ။

_WARNING_: ဒီ function ရဲ့ output က Node.js versions တွေကြားမှာ တည်ငြိမ်တယ်လို့ မယူဆသင့်ပါဘူး — TypeScript parser ထဲမှာ အပြောင်းအလဲတွေ ရှိတာမို့ပါ။

```mjs
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
```cjs
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
`sourceUrl` ကို ပေးထားရင် output ရဲ့ အဆုံးမှာ comment အနေနဲ့ ထည့်ပေါင်းပြီး သုံးပါလိမ့်မယ်:

```mjs
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
```cjs
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
### `module.syncBuiltinESMExports()`

`module.syncBuiltinESMExports()` method က builtin [ES Modules][] တွေရဲ့ live bindings တွေ အားလုံးကို [CommonJS][] exports ရဲ့ properties တွေနဲ့ ကိုက်ညီအောင် update လုပ်ပါတယ်။ [ES Modules][] ကနေ export လုပ်ထားတဲ့ နာမည်တွေကို ထပ်ထည့်ခြင်း သို့မဟုတ် ဖယ်ရှားခြင်းတော့ မလုပ်ပါဘူး။

```js
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // It syncs the existing readFile property with the new value
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync has been deleted from the required fs
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() does not remove readFileSync from esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() does not add names
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Module compile cache

Module compile cache ကို [`module.enableCompileCache()`][] method ဒါမှမဟုတ် [`NODE_COMPILE_CACHE=dir`][] environment variable ကို သုံးပြီး enable လုပ်နိုင်ပါတယ်။ Enable လုပ်ပြီးတာနဲ့ — Node.js က CommonJS, ECMAScript Module (သို့) TypeScript module တစ်ခုကို compile လုပ်တိုင်း သတ်မှတ်ထားတဲ့ directory ထဲမှာ သိမ်းထားတဲ့ on-disk [V8 code cache][] ကို သုံးပြီး compilation ကို မြန်ဆန်စေပါတယ်။ ဒါက module graph တစ်ခုရဲ့ ပထမဆုံး load ကို နှေးစေနိုင်ပေမယ့် — modules တွေရဲ့ contents တွေ မပြောင်းဘူးဆိုရင် အဲဒီ module graph ကို နောက်ပိုင်း load လုပ်ချိန်တွေမှာ သိသိသာသာ မြန်ဆန်လာနိုင်ပါတယ်။

Disk ပေါ်မှာ generate လုပ်ထားတဲ့ compile cache ကို ရှင်းလင်းဖို့ဆိုရင် cache directory ကို ဖျက်လိုက်ရုံပါပဲ။ Cache directory ကို compile cache storage အနေနဲ့ နောက်တစ်ခါ ပြန်သုံးတဲ့အခါ ပြန်လည် ဖန်တီးပေးပါလိမ့်မယ်။ Stale cache တွေနဲ့ disk ပြည့်မသွားအောင်ဆိုရင် [`os.tmpdir()`][] အောက်က directory တစ်ခုကို သုံးဖို့ အကြံပြုပါတယ်။ `directory` ကို မသတ်မှတ်ပဲ [`module.enableCompileCache()`][] ကို ခေါ်ပြီး compile cache enable လုပ်ထားရင် — Node.js က [`NODE_COMPILE_CACHE=dir`][] environment variable သတ်မှတ်ထားရင် အဲဒါကို သုံးမှာဖြစ်ပြီး မဟုတ်ရင် `path.join(os.tmpdir(), 'node-compile-cache')` ကို default အနေနဲ့ သုံးပါတယ်။ Run နေတဲ့ Node.js instance တစ်ခု သုံးနေတဲ့ compile cache directory ကို ရှာဖွေဖို့ [`module.getCompileCacheDir()`][] ကို သုံးပါ။

Enable လုပ်ထားတဲ့ module compile cache ကို [`NODE_DISABLE_COMPILE_CACHE=1`][] environment variable နဲ့ disable လုပ်နိုင်ပါတယ်။ Compile cache က မမျှော်လင့်ထားတဲ့ သို့မဟုတ် မလိုလားအပ်တဲ့ အပြုအမူတွေ ဖြစ်စေတဲ့အခါ (ဥပမာ — တိကျမှု ပိုနည်းတဲ့ test coverage) ဒါက အသုံးဝင်နိုင်ပါတယ်။

လက်ရှိမှာ compile cache ကို enable လုပ်ထားပြီး module တစ်ခုကို အသစ်စက်စက် load လုပ်တဲ့အခါ — code cache ကို compile လုပ်ထားတဲ့ code ကနေ ချက်ချင်း generate လုပ်ပေမယ့် Node.js instance က ထွက်တော့မယ့် အချိန်ကျမှသာ disk ပေါ်ကို ရေးပေးပါတယ်။ ဒါက နောင်မှာ ပြောင်းလဲနိုင်ပါတယ်။ Application တစ်ခုက တခြား Node.js instances တွေကို spawn လုပ်ပြီး — parent မထွက်ခင် အချိန်အတော်ကြာကတည်းက cache ကို မျှဝေသုံးစွဲစေချင်ရင် [`module.flushCompileCache()`][] method နဲ့ စုဆောင်းထားတဲ့ code cache ကို disk ပေါ်ကို သေချာ ရေးချနိုင်ပါတယ်။

Disk ပေါ်မှာရှိတဲ့ compile cache ရဲ့ layout က implementation detail တစ်ခုဖြစ်ပြီး အဲဒါအပေါ် အားကိုးမနေသင့်ပါဘူး။ Generate လုပ်ထားတဲ့ compile cache က ပုံမှန်အားဖြင့် Node.js version တစ်ခုတည်းမှာပဲ ပြန်သုံးလို့ ရပြီး — Node.js versions အမျိုးမျိုးကြားမှာ ကိုက်ညီမှု ရှိမယ်လို့ မယူဆသင့်ပါဘူး။

### Compile cache ၏ portability (Portability of the compile cache)

Default အနေနဲ့ကတော့ cache လုပ်ထားတဲ့ modules တွေရဲ့ absolute paths တွေ ပြောင်းသွားတဲ့အခါ caches တွေကို invalidate (အလုပ်မဖြစ်တော့အောင် လုပ်ခြင်း) လုပ်ပါတယ်။ Project directory ကို ရွှေ့ပြီးနောက်မှာလည်း cache အလုပ်လုပ်နေစေချင်ရင် portable compile cache ကို enable လုပ်ပါ။ ဒါဆိုရင် cache directory နဲ့ နှိုင်းယှဉ်တဲ့ layout (ဖွဲ့စည်းပုံ) အတူတူ ရှိနေသရွေ့ — အရင်က compile လုပ်ထားတဲ့ modules တွေကို directory နေရာ အမျိုးမျိုးမှာ ပြန်လည် အသုံးပြုနိုင်ပါတယ်။ ဒါကို best-effort သဘောနဲ့ပဲ လုပ်ဆောင်ပေးတာပါ။ Cache directory နဲ့ နှိုင်းယှဉ်ပြီး module တစ်ခုရဲ့ တည်နေရာကို Node.js က တွက်ချက်လို့ မရဘူးဆိုရင် အဲဒီ module ကို cache လုပ်မှာ မဟုတ်ပါဘူး။

Portable cache က user အလိုက် ခွဲခြားထားတာလည်း မဟုတ်ပါဘူး: uids ရှိတဲ့ platforms တွေမှာ non-portable cache ရဲ့ cache subdirectory ကို အဲဒါကို ဖန်တီးခဲ့တဲ့ user ရဲ့ uid နဲ့ suffix တပ်ထားတာမို့ အဲဒီ user ကပဲ ရှာတွေ့နိုင်ပါတယ် — portable cache ကတော့ user တိုင်းအတွက် subdirectory အတူတူကိုပဲ သုံးပါတယ်။ ဒါကြောင့် တစ်ခါ generate လုပ်ထားတဲ့ cache (ဥပမာ — build လုပ်ချိန်မှာ generate လုပ်ပြီး application တစ်ခုနဲ့အတူ read-only အနေနဲ့ ပို့ဆောင်တာ) ကို code ကို run လုပ်တဲ့သူ ဘယ်သူမဆို ဖတ်နိုင်ပါတယ်; directory ထဲကို မရေးနိုင်တဲ့ user တစ်ယောက်ကတောင် ဖတ်လို့ ရပြီး — ရေးဖို့ မအောင်မြင်ခဲ့ရင် module ကို နောက်တစ်ခါ ပြန် compile လုပ်ရုံပါပဲ။

Portable mode ကို enable လုပ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

1. [`module.enableCompileCache()`][] ထဲက portable option ကို သုံးခြင်း:

   ```js
   // Non-portable cache (default): cache breaks if project is moved
   module.enableCompileCache({ directory: '/path/to/cache/storage/dir' });

   // Portable cache: cache works after the project is moved
   module.enableCompileCache({ directory: '/path/to/cache/storage/dir', portable: true });
   ```
2. Environment variable ကို သတ်မှတ်ခြင်း: [`NODE_COMPILE_CACHE_PORTABLE=1`][]

### Read-only compile cache (ဖတ်ရန်သာ ဖြစ်သော compile cache)

ကြိုတင် generate လုပ်ထားတဲ့ cache (ဥပမာ — build လုပ်ချိန်မှာ generate လုပ်ပြီး application package တစ်ခုထဲ ထည့်ပို့မယ့် cache) ကို `readOnly: true` (သို့) [`NODE_COMPILE_CACHE_READONLY=1`][] နဲ့ enable လုပ်နိုင်ပါတယ်။ ဒါဆိုရင် Node.js က directory ထဲမှာ ရှိတဲ့ entries တွေကို load လုပ်ပြီး အဲဒီထဲကို ဘယ်တော့မှ မရေးပါဘူး: အသုံးပြုလို့ရတဲ့ entry မရှိတဲ့ modules တွေကို ပုံမှန်အတိုင်း compile လုပ်ပေမယ့် မသိမ်းဆည်းပါဘူး၊ [`module.flushCompileCache()`][] က no-op (ဘာမှ မလုပ်ခြင်း) ဖြစ်ပြီး — directory မရှိဘူးဆိုရင်လည်း ဖန်တီးမပေးပါဘူး။

### Compile cache ၏ ကန့်သတ်ချက်များ (Limitations of the compile cache)

လက်ရှိမှာ compile cache ကို [V8 JavaScript code coverage][] နဲ့ တွဲသုံးတဲ့အခါ — code cache ကနေ deserialize လုပ်ထားတဲ့ functions တွေထဲမှာ V8 က စုဆောင်းတဲ့ coverage က တိကျမှု နည်းနိုင်ပါတယ်။ တိကျတဲ့ coverage ရဖို့ tests တွေ run လုပ်တဲ့အခါ ဒါကို ပိတ်ထားဖို့ အကြံပြုပါတယ်။

Node.js version တစ်ခုက generate လုပ်ထားတဲ့ compilation cache ကို မတူညီတဲ့ version တစ်ခုက ပြန်သုံးလို့ မရပါဘူး။ Node.js versions အမျိုးမျိုးက generate လုပ်တဲ့ caches တွေကို သိမ်းဆည်းဖို့ base directory အတူတူကိုပဲ သုံးထားရင်တောင် သီးခြားစီ သိမ်းဆည်းမှာ ဖြစ်လို့ — ၎င်းတို့ အတူတကွ ရှိနေနိုင်ပါတယ်။

### `module.constants.compileCacheStatus`

အောက်ပါ constants တွေကို [module compile cache][] ကို enable လုပ်ဖို့ ကြိုးစားမှုရဲ့ ရလဒ်ကို ညွှန်ပြဖို့ [`module.enableCompileCache()`][] က ပြန်ပေးတဲ့ object ထဲက `status` field အနေနဲ့ ပြန်ပေးပါတယ်။

| Constant | Description |
| --- | --- |
| `ENABLED` | Node.js က compile cache ကို အောင်မြင်စွာ enable လုပ်လိုက်ပါပြီ။ Compile cache ကို သိမ်းဆည်းဖို့ သုံးတဲ့ directory ကို ပြန်ပေးတဲ့ object ရဲ့ `directory` field ထဲမှာ ပြန်ပေးပါလိမ့်မယ်။ |
| `ALREADY_ENABLED` | Compile cache ကို အရင်ကတည်းက enable လုပ်ပြီးသား ဖြစ်ပါတယ် — `module.enableCompileCache()` ကို အရင်က ခေါ်ထားလို့ ဖြစ်စေ၊ `NODE_COMPILE_CACHE=dir` environment variable ကြောင့် ဖြစ်စေပါ။ Compile cache ကို သိမ်းဆည်းဖို့ သုံးတဲ့ directory ကို ပြန်ပေးတဲ့ object ရဲ့ `directory` field ထဲမှာ ပြန်ပေးပါလိမ့်မယ်။ |
| `FAILED` | Node.js က compile cache ကို enable လုပ်ဖို့ မအောင်မြင်ပါဘူး။ သတ်မှတ်ထားတဲ့ directory ကို သုံးဖို့ permission မရှိတာကြောင့် ဖြစ်စေ၊ file system error အမျိုးမျိုးကြောင့် ဖြစ်စေ ရှိနိုင်ပါတယ်။ မအောင်မြင်မှုရဲ့ အသေးစိတ်ကို ပြန်ပေးတဲ့ object ရဲ့ `message` field ထဲမှာ ပြန်ပေးပါလိမ့်မယ်။ |
| `DISABLED` | `NODE_DISABLE_COMPILE_CACHE=1` environment variable သတ်မှတ်ထားလို့ Node.js က compile cache ကို enable လုပ်လို့ မရပါဘူး။ |

### `module.enableCompileCache([options])`

* `options` {string|Object} Optional ပါ။ String တစ်ခု ဖြတ်သန်းပေးရင် အဲဒါကို `options.directory` အနေနဲ့ သတ်မှတ်ပါတယ်။
  * `directory` {string} Optional ပါ။ Compile cache ကို သိမ်းဆည်းမယ့် directory ပါ။ မသတ်မှတ်ထားရင် [`NODE_COMPILE_CACHE=dir`][] environment variable သတ်မှတ်ထားရင် အဲဒါကို သုံးပြီး — မဟုတ်ရင် `path.join(os.tmpdir(), 'node-compile-cache')` ကို သုံးပါတယ်။
  * `portable` {boolean} Optional ပါ။ `true` ဆိုရင် project directory ရွှေ့ပြောင်းသွားရင်တောင် ပြန်သုံးလို့ရတဲ့ portable compile cache ကို enable လုပ်ပါတယ်။ ဒါက best-effort feature တစ်ခုပါ။ မသတ်မှတ်ထားရင် [`NODE_COMPILE_CACHE_PORTABLE=1`][] environment variable သတ်မှတ်ထားလားပေါ် မူတည်ပါတယ်။
  * `readOnly` {boolean} Optional ပါ။ `true` ဆိုရင် `directory` ထဲက ရှိပြီးသား cache entries တွေကို သုံးပေမယ့် အဲဒီထဲကို ဘယ်တော့မှ မရေးပါဘူး — ပြီးတော့ directory မရှိဘူးဆိုရင်လည်း ဖန်တီးမပေးပါဘူး (ဒါဆိုရင် enable လုပ်တာ မအောင်မြင်ပါဘူး)။ Application တစ်ခုနဲ့အတူ ကြိုတင် generate လုပ်ပြီး ပို့ဆောင်လိုက်တဲ့ caches တွေအတွက် ရည်ရွယ်ပါတယ်။ မသတ်မှတ်ထားရင် [`NODE_COMPILE_CACHE_READONLY=1`][] environment variable သတ်မှတ်ထားလားပေါ် မူတည်ပါတယ်။
* Returns: {Object}
  * `status` {integer} [`module.constants.compileCacheStatus`][] တန်ဖိုးတွေထဲက တစ်ခု
  * `message` {string|undefined} Node.js က compile cache ကို enable မလုပ်နိုင်ရင် error message ကို ဒီထဲမှာ ထည့်ပေးပါတယ်။ `status` က `module.constants.compileCacheStatus.FAILED` ဖြစ်တဲ့အခါမှသာ သတ်မှတ်ပါတယ်။
  * `directory` {string|undefined} Compile cache ကို enable လုပ်နိုင်ခဲ့ရင် compile cache သိမ်းဆည်းထားတဲ့ directory ကို ဒီထဲမှာ ထည့်ပေးပါတယ်။ `status` က `module.constants.compileCacheStatus.ENABLED` သို့မဟုတ် `module.constants.compileCacheStatus.ALREADY_ENABLED` ဖြစ်တဲ့အခါမှသာ သတ်မှတ်ပါတယ်။

လက်ရှိ Node.js instance ထဲမှာ [module compile cache][] ကို enable လုပ်ပါတယ်။

သာမန် use cases တွေအတွက်တော့ `options.directory` ကို မသတ်မှတ်ပဲ `module.enableCompileCache()` ကို ခေါ်ဖို့ အကြံပြုပါတယ် — ဒါဆိုရင် လိုအပ်တဲ့အခါ `NODE_COMPILE_CACHE` environment variable နဲ့ directory ကို override လုပ်လို့ ရပါတယ်။

Compile cache က mission-critical မဟုတ်တဲ့ optimization တစ်ခု ဖြစ်ဖို့ ရည်ရွယ်ထားတာမို့ — ဒီ method က compile cache ကို enable မလုပ်နိုင်တဲ့အခါ exception တစ်ခုကို throw မလုပ်အောင် ဒီဇိုင်းထုတ်ထားပါတယ်။ အဲဒီအစား `message` field ထဲမှာ error message ပါတဲ့ object တစ်ခုကို ပြန်ပေးပြီး debugging လုပ်ရာမှာ အထောက်အကူ ဖြစ်စေပါတယ်။ Compile cache ကို အောင်မြင်စွာ enable လုပ်နိုင်ခဲ့ရင် ပြန်ပေးတဲ့ object ရဲ့ `directory` field မှာ compile cache သိမ်းဆည်းတဲ့ directory ရဲ့ path ပါဝင်ပါတယ်။ ပြန်ပေးတဲ့ object ထဲက `status` field ကတော့ [module compile cache][] ကို enable လုပ်ဖို့ ကြိုးစားမှုရဲ့ ရလဒ်ကို ညွှန်ပြတဲ့ `module.constants.compileCacheStatus` တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်။

ဒီ method က လက်ရှိ Node.js instance ကိုပဲ သက်ရောက်မှု ရှိပါတယ်။ Child worker threads တွေထဲမှာပါ enable လုပ်စေချင်ရင် — ဒီ method ကို child worker threads တွေထဲမှာပါ ခေါ်ပေးရပါမယ်၊ ဒါမှမဟုတ် `process.env.NODE_COMPILE_CACHE` တန်ဖိုးကို compile cache directory အဖြစ် သတ်မှတ်ပေးထားရင် အဲဒီအပြုအမူက child workers တွေဆီကို အမွေဆက်ခံ ရောက်ရှိသွားပါတယ်။ Directory ကို ဒီ method က ပြန်ပေးတဲ့ `directory` field ကနေ ဖြစ်စေ၊ [`module.getCompileCacheDir()`][] နဲ့ ဖြစ်စေ ရယူနိုင်ပါတယ်။

### `module.flushCompileCache()`

လက်ရှိ Node.js instance ထဲမှာ load လုပ်ပြီးသား modules တွေကနေ စုဆောင်းထားတဲ့ [module compile cache][] ကို disk ဆီကို flush (ရေးချ) လုပ်ပါတယ်။ Flushing လုပ်တဲ့ file system operations တွေ အားလုံး ပြီးဆုံးသွားမှ ဒီ method က ပြန်လာပါတယ် — အောင်မြင်သည်ဖြစ်စေ၊ မအောင်မြင်သည်ဖြစ်စေပါ။ Error တွေ ရှိခဲ့ရင်လည်း တိတ်တဆိတ် လွှဲပြောင်း (fail silently) လုပ်ပါတယ် — compile cache misses တွေက application ရဲ့ တကယ့် လုပ်ဆောင်မှုကို မနှောင့်ယှက်သင့်လို့ပါ။

### `module.getCompileCacheDir()`

* Returns: {string|undefined} [module compile cache][] ကို enable လုပ်ထားရင် အဲဒီ directory ရဲ့ path ကို ပြန်ပေးပြီး — မဟုတ်ရင် `undefined` ပြန်ပေးပါတယ်။

## စိတ်ကြိုက် ပြင်ဆင်ခြင်း hooks (Customization Hooks)

Node.js က module customization hooks အမျိုးအစား နှစ်မျိုးကို လက်ရှိမှာ ပံ့ပိုးပေးပါတယ်:

1. [`module.registerHooks(options)`][`module.registerHooks()`]: modules တွေကို load လုပ်တဲ့
   thread ပေါ်မှာ တိုက်ရိုက် run လုပ်တဲ့ synchronous hook functions တွေကို လက်ခံပါတယ်။
2. [`module.register(specifier[, parentURL][, options])`][`register`]: asynchronous hook
   functions တွေကို export လုပ်တဲ့ module တစ်ခုဆီကို ညွှန်တဲ့ specifier ကို လက်ခံပါတယ်။
   အဲဒီ functions တွေကို သီးခြား loader thread တစ်ခုပေါ်မှာ run လုပ်ပါတယ်။

Asynchronous hooks တွေကတော့ inter-thread communication ကြောင့် အပို overhead ဖြစ်ပေါ်စေပြီး —
အထူးသဖြင့် module graph ထဲမှာ CommonJS modules တွေကို customize လုပ်တဲ့အခါ
[several caveats][caveats of asynchronous customization hooks] တွေ ရှိပါတယ်။ ကိစ္စအများစုမှာတော့
ရိုးရှင်းစေဖို့ `module.registerHooks()` ကတစ်ဆင့် synchronous hooks တွေကို သုံးဖို့ အကြံပြုပါတယ်။

### Synchronous customization hooks (တစ်ပြိုင်တည်း လုပ်ဆောင်သော customization hooks)

> Stability: 1.2 - Release candidate

#### Registration of synchronous customization hooks (synchronous customization hooks များ register လုပ်ခြင်း)

Synchronous customization hooks တွေကို register လုပ်ဖို့ — [synchronous hook functions][] တွေကို
တိုက်ရိုက် in-line အနေနဲ့ လက်ခံတဲ့ [`module.registerHooks()`][] ကို သုံးပါတယ်။

```mjs
// register-hooks.js
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```

```cjs
// register-hooks.js
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```

##### Registering hooks before application code runs with flags (application code မစတင်မီ flags နဲ့ hooks register လုပ်ခြင်း)

Application code ကို run မလုပ်ခင် — [`--import`][] သို့မဟုတ် [`--require`][] flag တွေကို သုံးပြီး
hooks တွေကို register လုပ်နိုင်ပါတယ်:

```bash
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

`--import` သို့မဟုတ် `--require` ဆီ ပို့တဲ့ specifier က package တစ်ခုကနေ လာတာလည်း ဖြစ်နိုင်ပါတယ်:

```bash
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```

`some-package` မှာ `/register` export ကို — အထက်က `register-hooks.js` ဥပမာတွေလိုပဲ
`registerHooks()` ကို ခေါ်တဲ့ file တစ်ခုဆီ map လုပ်ပေးတဲ့ — [`"exports"`][] field ရှိရင်
ဒီလိုမျိုး သုံးလို့ ရပါတယ်။

`--import` သို့မဟုတ် `--require` ကို သုံးခြင်းက — application ရဲ့ entry point အပါအဝင် ဘယ်
application code ကိုမဆို load မလုပ်ခင် — ပြီးတော့ default အနေနဲ့ worker threads တွေအတွက်ပါ —
hooks တွေကို register ပြီးသား ဖြစ်စေပါတယ်။

##### Registering hooks before application code runs programmatically (application code မစတင်မီ programmatically နည်းနဲ့ hooks register လုပ်ခြင်း)

တစ်နည်းအားဖြင့် `registerHooks()` ကို entry point ကနေ ခေါ်လို့လည်း ရပါတယ်။

Entry point က တခြား modules တွေကို load လုပ်ဖို့ လိုပြီး အဲဒီ loading process ကို customize
လုပ်ဖို့ လိုအပ်ရင် — hooks တွေ register လုပ်ပြီးမှ သူတို့ကို `require()` သို့မဟုတ် dynamic
`import()` သုံးပြီး load လုပ်ပါ။ Hooks တွေကို register လုပ်တဲ့ module ထဲမှာပဲ customize လုပ်ရမယ့်
modules တွေကို load လုပ်ဖို့ static `import` statements တွေကို မသုံးပါနဲ့ — ဘာလို့လဲဆိုတော့
static `import` statements တွေက importer module ထဲက ဘယ်နေရာမှာ ပေါ်နေပါစေ — `registerHooks()`
ခေါ်တာကို အပါအဝင် — importer module ရဲ့ code တွေ မလုပ်ဆောင်မခင် ကတည်းက အရင်ဆုံး evaluate
လုပ်ခံရလို့ပါ။

```mjs
import { registerHooks } from 'node:module';

registerHooks({ /* implementation of synchronous hooks */ });

// If loaded using static import, the hooks would not be applied when loading
// my-app.mjs, because statically imported modules are all executed before its
// importer regardless of where the static import appears.
// import './my-app.mjs';

// my-app.mjs must be loaded dynamically to ensure the hooks are applied.
await import('./my-app.mjs');
```

```cjs
const { registerHooks } = require('node:module');

registerHooks({ /* implementation of synchronous hooks */ });

import('./my-app.mjs');
// Or, if my-app.mjs does not have top-level await or it's a CommonJS module,
// require() can also be used:
// require('./my-app.mjs');
```

##### Registering hooks before application code runs with a `data:` URL (application code မစတင်မီ `data:` URL နဲ့ hooks register လုပ်ခြင်း)

တစ်နည်းအားဖြင့် — application code မစတင်မီ hooks တွေကို register လုပ်ဖို့ inline JavaScript
code တွေကို `data:` URLs တွေထဲမှာ ထည့်သွင်းနိုင်ပါတယ်။ ဥပမာ —

```bash
node --import 'data:text/javascript,import {registerHooks} from "node:module"; registerHooks(/* hooks code */);' ./my-app.js
```

#### Convention of hooks and chaining (hooks များနဲ့ chaining ၏ စည်းမျဉ်း)

Hooks တွေက chain တစ်ခုရဲ့ အစိတ်အပိုင်းတွေပါ — အဲဒီ chain မှာ user က ပေးတဲ့ custom hook တစ်ခုတည်းနဲ့
အမြဲတမ်း ရှိနေတဲ့ default hook ပဲ ပါတယ်ဆိုရင်တောင် ဖြစ်ပါတယ်။

Hook functions တွေက nested (အထပ်လိုက်) ဖြစ်ပါတယ်: တစ်ခုချင်းစီက ပုံမှန် (plain) object တစ်ခုကို
အမြဲ ပြန်ပေးရပြီး — function တစ်ခုချင်းစီက နောက် loader ရဲ့ hook ကို ညွှန်တဲ့ (LIFO order နဲ့)
`next<hookName>()` ကို ခေါ်တာကနေတစ်ဆင့် chaining ဖြစ်ပေါ်လာပါတယ်။

`registerHooks()` ကို တစ်ကြိမ်ထက် ပိုပြီး ခေါ်လို့ ရပါတယ်:

```mjs
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 runs before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```cjs
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 runs before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

ဒီဥပမာထဲမှာ register လုပ်ထားတဲ့ hooks တွေက chains တွေ ဖွဲ့စည်းသွားပါလိမ့်မယ်။ ဒီ chains တွေက
last-in, first-out (LIFO) အတိုင်း run ပါတယ်။ `hook1` နဲ့ `hook2` နှစ်ခုလုံးမှာ `resolve` hook
သတ်မှတ်ထားရင် — အောက်ပါအတိုင်း ခေါ်ခံရပါလိမ့်မယ် (ညာကနေ ဘယ်ဘက်သို့ ဖြစ်ပြီး — `hook2.resolve`
ကနေ စပြီး — နောက် `hook1.resolve` — ပြီးမှ Node.js default):

Node.js default `resolve` ← `hook1.resolve` ← `hook2.resolve`

ကျန်တဲ့ hooks တွေ အားလုံးအတွက်လည်း အလားတူပါပဲ။

လိုအပ်တဲ့ property မပါတဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးတဲ့ hook က exception တစ်ခုကို ဖြစ်စေပါတယ်။
`next<hookName>()` ကို မခေါ်ပဲ နဲ့ `shortCircuit: true` ကိုလည်း မပြန်ပဲ ပြန်လာတဲ့ hook ကလည်း
exception တစ်ခုကို ဖြစ်စေပါတယ်။ ဒီ errors တွေက chain ထဲမှာ မရည်ရွယ်ဘဲ ပြတ်တောက်မှုတွေ မဖြစ်အောင်
ကာကွယ်ဖို့ ကူညီပေးတာပါ။ Chain ကို သင့် hook မှာ ရည်ရွယ်ချက်ရှိရှိ အဆုံးသတ်စေချင်ရင် hook ကနေ
`shortCircuit: true` ကို ပြန်ပေးလိုက်ပါ။

တခြား hook modules တွေကို load လုပ်တဲ့အခါ hook တစ်ခုကို အသုံးချချင်တယ်ဆိုရင် — အဲဒီ တခြား
hook modules တွေကို hook register လုပ်ပြီးမှ ပဲ load လုပ်သင့်ပါတယ်။

#### Deregistration of synchronous customization hooks (synchronous customization hooks များ deregister လုပ်ခြင်း)

`registerHooks()` က ပြန်ပေးတဲ့ object မှာ — hooks တွေကို chain ကနေ ဖယ်ရှားဖို့ သုံးနိုင်တဲ့
`deregister()` method ပါရှိပါတယ်။ `deregister()` ကို ခေါ်လိုက်တာနဲ့ — module resolution သို့မဟုတ်
loading လုပ်နေစဉ် ဒီ hooks တွေကို နောက်ထပ် ခေါ်တော့မှာ မဟုတ်ပါဘူး။

ဒါက လက်ရှိမှာ `registerHooks()` ကတစ်ဆင့် register လုပ်ထားတဲ့ synchronous hooks တွေအတွက်သာ
ရနိုင်ပြီး — `module.register()` ကတစ်ဆင့် register လုပ်တဲ့ asynchronous hooks တွေအတွက်တော့
မရပါဘူး။

```mjs
import { registerHooks } from 'node:module';

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    console.log('resolve hook called for', specifier);
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    return nextLoad(url, context);
  },
});

// At this point, the hooks are active and will be called for
// any subsequent import() or require() calls.
await import('./my-module.mjs');

// Later, remove the hooks from the chain.
hooks.deregister();

// Subsequent loads will no longer trigger the hooks.
await import('./another-module.mjs');
```

```cjs
const { registerHooks } = require('node:module');

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    console.log('resolve hook called for', specifier);
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    return nextLoad(url, context);
  },
});

// At this point, the hooks are active and will be called for
// any subsequent require() calls.
require('./my-module.cjs');

// Later, remove the hooks from the chain.
hooks.deregister();

// Subsequent loads will no longer trigger the hooks.
require('./another-module.cjs');
```

#### Hook functions accepted by `module.registerHooks()` (`module.registerHooks()` က လက်ခံသော hook functions များ)

`module.registerHooks()` method က အောက်ပါ synchronous hook functions တွေကို လက်ခံပါတယ်။

```mjs
function resolve(specifier, context, nextResolve) {
  // Take an `import` or `require` specifier and resolve it to a URL.
}

function load(url, context, nextLoad) {
  // Take a resolved URL and return the source code to be evaluated.
}
```

Synchronous hooks တွေကို modules တွေ load လုပ်တဲ့ thread နဲ့ [realm][] တစ်ခုတည်းပေါ်မှာပဲ run
လုပ်တာမို့ — hook function ထဲက code က global variables တွေ သို့မဟုတ် တခြား shared states တွေကတစ်ဆင့်
ရည်ညွှန်းထားတဲ့ modules တွေဆီ တန်ဖိုးတွေကို တိုက်ရိုက် ပေးပို့နိုင်ပါတယ်။

Asynchronous hooks တွေနဲ့ မတူဘဲ — synchronous hooks တွေက default အနေနဲ့ child worker threads
တွေဆီ အမွေဆက်ခံ မရောက်ပါဘူး။ ဒါပေမယ့် hooks တွေကို [`--import`][] သို့မဟုတ် [`--require`][]
နဲ့ preload လုပ်ထားတဲ့ file တစ်ခုကနေ register လုပ်ထားရင်တော့ — child worker threads တွေက
`process.execArgv` အမွေဆက်ခံမှုကတစ်ဆင့် preloaded scripts တွေကို အမွေဆက်ခံ ရနိုင်ပါတယ်။
အသေးစိတ်ကို [the documentation of `Worker`][] မှာ ကြည့်ပါ။

#### Synchronous `resolve(specifier, context, nextResolve)`

* `specifier` {string}
* `context` {Object}
  * `conditions` {string\[]} သက်ဆိုင်ရာ `package.json` ရဲ့ export conditions များ
  * `importAttributes` {Object} Module ကို import လုပ်ရာမှာ သုံးမယ့် attributes တွေကို
    key-value pairs အနေနဲ့ ကိုယ်စားပြုတဲ့ object တစ်ခု
  * `parentURL` {string|undefined} ဒီ module ကို import လုပ်နေတဲ့ module ရဲ့ URL ပါ။ ဒါက
    Node.js entry point ဆိုရင်တော့ undefined ဖြစ်ပါတယ်
* `nextResolve` {Function} Chain ထဲက နောက် `resolve` hook ဖြစ်ပြီး — နောက်ဆုံး user-supplied
  `resolve` hook ပြီးရင် Node.js ရဲ့ default `resolve` hook ကို ညွှန်ပါတယ်
  * `specifier` {string}
  * `context` {Object|undefined} ဖြုတ်လိုက်ရင် (omitted) defaults တွေကို ထောက်ပံ့ပေးပါတယ်။
    ပေးလိုက်ရင် defaults တွေကို ပေးလိုက်တဲ့ properties တွေကို ဦးစားပေးပြီး ပေါင်းစည်းပါတယ်။
* Returns: {Object}
  * `format` {string|null|undefined} `load` hook အတွက် hint တစ်ခုပါ (လျစ်လျူရှုခံရနိုင်ပါတယ်)။
    Module format (ဥပမာ `'commonjs'` သို့မဟုတ် `'module'`) ဖြစ်နိုင်သလို — `'css'` သို့မဟုတ်
    `'yaml'` လို စိတ်ကြိုက် တန်ဖိုးတစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။
  * `importAttributes` {Object|undefined} Module ကို cache လုပ်တဲ့အခါ သုံးမယ့် import attributes
    တွေပါ (optional; ဖယ်ထားရင် input ကို သုံးမှာပါ)
  * `shortCircuit` {undefined|boolean} ဒီ hook က `resolve` hooks ရဲ့ chain ကို အဆုံးသတ်ဖို့
    ရည်ရွယ်ကြောင်း အချက်ပြတဲ့ signal တစ်ခုပါ။ **Default:** `false`
  * `url` {string} ဒီ input က resolve ဖြစ်သွားတဲ့ absolute URL ပါ

`resolve` hook chain က — `import` statement (သို့) expression တစ်ခု သို့မဟုတ် `require` call
တစ်ခုကို ဘယ်နေရာမှာ ရှာရမယ်၊ ဘယ်လို cache လုပ်ရမယ်ဆိုတာကို Node.js ကို ပြောပြဖို့ တာဝန်ရှိပါတယ်။
ဒါက `load` hook အတွက် hint တစ်ခုအနေနဲ့ format (ဥပမာ `'module'`) ကို ရွေးချယ် ပြန်ပေးနိုင်ပါတယ်။
Format သတ်မှတ်ပေးထားရင် — နောက်ဆုံး `format` တန်ဖိုးကို ထောက်ပံ့ပေးဖို့ တာဝန်က `load` hook မှာပဲ
ရှိပါတယ် (ပြီးတော့ `resolve` က ပေးတဲ့ hint ကို လျစ်လျူရှုဖို့လည်း လွတ်လပ်ခွင့် ရှိပါတယ်);
`resolve` က `format` ပေးထားရင် — Node.js ရဲ့ default `load` hook ဆီ တန်ဖိုးကို ပို့ပေးရုံသက်သက်ပဲ
ဖြစ်ဖြစ် — custom `load` hook တစ်ခု မဖြစ်မနေ လိုအပ်ပါတယ်။

Import type attributes တွေက load လုပ်ပြီးသား modules တွေကို internal module cache ထဲ သိမ်းတဲ့အခါ
cache key ရဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်ပါတယ်။ Module ကို source code ထဲမှာ ပါတဲ့ attributes တွေနဲ့
မတူတဲ့ attributes တွေနဲ့ cache လုပ်သင့်ရင် — `importAttributes` object တစ်ခုကို ပြန်ပေးဖို့
`resolve` hook မှာ တာဝန်ရှိပါတယ်။

`context` ထဲက `conditions` property က — ဒီ resolution request အတွက် [package exports
conditions][Conditional exports] တွေနဲ့ ကိုက်ညီအောင် သုံးမယ့် conditions တွေရဲ့ array တစ်ခုပါ။
Conditional mappings တွေကို တခြားနေရာမှာ ရှာဖွေဖို့ ဒါမှမဟုတ် default resolution logic ကို ခေါ်တဲ့အခါ
စာရင်းကို ပြုပြင်ဖို့ သုံးနိုင်ပါတယ်။

လက်ရှိ [package exports conditions][Conditional exports] တွေက hook ဆီ ပို့လိုက်တဲ့
`context.conditions` array ထဲမှာ အမြဲ ပါဝင်ပါတယ်။ `defaultResolve` ကို ခေါ်တဲ့အခါ
_default Node.js module specifier resolution behavior_ ကို အာမခံဖို့ဆိုရင် — အဲဒီဆီ ပို့လိုက်တဲ့
`context.conditions` array မှာ `resolve` hook ဆီ မူလ ပို့လိုက်တဲ့ `context.conditions` array ရဲ့
elements တွေ အားလုံး ပါဝင်ဖို့ လိုပါတယ်။

```mjs
import { registerHooks } from 'node:module';

function resolve(specifier, context, nextResolve) {
  // When calling `defaultResolve`, the arguments can be modified. For example,
  // to change the specifier or to add applicable export conditions.
  if (specifier.includes('foo')) {
    specifier = specifier.replace('foo', 'bar');
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // The hook can also skip default resolution and provide a custom URL.
  if (specifier === 'special-module') {
    return {
      url: 'file:///path/to/special-module.mjs',
      format: 'module',
      shortCircuit: true,  // This is mandatory if nextResolve() is not called.
    };
  }

  // If no customization is needed, defer to the next hook in the chain which would be the
  // Node.js default resolve if this is the last user-specified loader.
  return nextResolve(specifier);
}

registerHooks({ resolve });
```

#### Synchronous `load(url, context, nextLoad)`

* `url` {string} `resolve` chain က ပြန်ပေးတဲ့ URL ပါ
* `context` {Object}
  * `conditions` {string\[]} သက်ဆိုင်ရာ `package.json` ရဲ့ export conditions များ
  * `format` {string|null|undefined} `resolve` hook chain က ရွေးချယ် ထောက်ပံ့ပေးတဲ့ format ပါ။
    ဒါက input အနေနဲ့ ဘယ် string တန်ဖိုးမဆို ဖြစ်နိုင်ပြီး — input တန်ဖိုးတွေက အောက်မှာ ဖော်ပြထားတဲ့
    လက်ခံနိုင်တဲ့ return values စာရင်းနဲ့ ကိုက်ညီစရာ မလိုပါဘူး။
  * `importAttributes` {Object}
* `nextLoad` {Function} Chain ထဲက နောက် `load` hook ဖြစ်ပြီး — နောက်ဆုံး user-supplied `load` hook
  ပြီးရင် Node.js ရဲ့ default `load` hook ကို ညွှန်ပါတယ်
  * `url` {string}
  * `context` {Object|undefined} ဖြုတ်လိုက်ရင် defaults တွေကို ထောက်ပံ့ပေးပါတယ်။ ပေးလိုက်ရင်
    defaults တွေကို ပေးလိုက်တဲ့ properties တွေကို ဦးစားပေးပြီး ပေါင်းစည်းပါတယ်။ Default
    `nextLoad` မှာတော့ — `url` က ညွှန်တဲ့ module မှာ ရှင်းလင်းတဲ့ module type အချက်အလက် မရှိဘူးဆိုရင်
    `context.format` က မဖြစ်မနေ လိုအပ်ပါတယ်။

* Returns: {Object}
  * `format` {string} `load` က ပြန်ပေးလို့ ရတဲ့ လက်ခံနိုင်တဲ့ module formats တွေထဲက တစ်ခုပါ —
    [below][accepted final formats] မှာ ဖော်ပြထားပါတယ်။
  * `shortCircuit` {undefined|boolean} ဒီ hook က `load` hooks ရဲ့ chain ကို အဆုံးသတ်ဖို့
    ရည်ရွယ်ကြောင်း အချက်ပြတဲ့ signal တစ်ခုပါ။ **Default:** `false`
  * `source` {string|ArrayBuffer|TypedArray} Node.js က evaluate လုပ်ဖို့ အတွက် source ပါ

`load` hook က resolve ဖြစ်ပြီးသား URL တစ်ခုရဲ့ source code ကို ပြန်ယူဖို့ custom method တစ်ခုကို
သတ်မှတ်ဖို့ နည်းလမ်း ပေးပါတယ်။ ဒါက loader တစ်ခုအနေနဲ့ disk ကနေ files တွေ ဖတ်တာကို ရှောင်လွှဲနိုင်စေပါတယ်။
မမှတ်မိတဲ့ (unrecognized) format တစ်ခုကို ပံ့ပိုးထားတဲ့ format တစ်ခုဆီ map လုပ်ဖို့လည်း သုံးနိုင်ပါတယ် —
ဥပမာ `yaml` ကနေ `module` ဆီပါ။

```mjs
import { registerHooks } from 'node:module';
import { Buffer } from 'node:buffer';

function load(url, context, nextLoad) {
  // The hook can skip default loading and provide a custom source code.
  if (url === 'special-module') {
    return {
      source: 'export const special = 42;',
      format: 'module',
      shortCircuit: true,  // This is mandatory if nextLoad() is not called.
    };
  }

  // It's possible to modify the source code loaded by the next - possibly default - step,
  // for example, replacing 'foo' with 'bar' in the source code of the module.
  const result = nextLoad(url, context);
  const source = typeof result.source === 'string' ?
    result.source : Buffer.from(result.source).toString('utf8');
  return {
    source: source.replace(/foo/g, 'bar'),
    ...result,
  };
}

registerHooks({ load });
```

ပိုပြီး အဆင့်မြင့်တဲ့ အခြေအနေတွေမှာ — မပံ့ပိုးထားတဲ့ source တစ်ခုကို ပံ့ပိုးထားတဲ့ source အဖြစ်
ပြောင်းလဲဖို့လည်း သုံးနိုင်ပါတယ် (အောက်က [Examples](#examples) မှာ ကြည့်ပါ)။

##### Accepted final formats returned by `load` (`load` က ပြန်ပေးသော လက်ခံနိုင်သည့် final formats များ)

`format` ရဲ့ နောက်ဆုံး တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

| `format`                | Description                                           | Acceptable types for `source` returned by `load`   |
| ----------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| `'addon'`               | Node.js addon တစ်ခုကို load လုပ်ခြင်း                  | {null}                                             |
| `'builtin'`             | Node.js builtin module တစ်ခုကို load လုပ်ခြင်း        | {null}                                             |
| `'commonjs-typescript'` | TypeScript syntax ပါတဲ့ Node.js CommonJS module တစ်ခုကို load လုပ်ခြင်း | {string\|ArrayBuffer\|TypedArray\|null\|undefined} |
| `'commonjs'`            | Node.js CommonJS module တစ်ခုကို load လုပ်ခြင်း       | {string\|ArrayBuffer\|TypedArray\|null\|undefined} |
| `'json'`                | JSON file တစ်ခုကို load လုပ်ခြင်း                     | {string\|ArrayBuffer\|TypedArray}                  |
| `'module-typescript'`   | TypeScript syntax ပါတဲ့ ES module တစ်ခုကို load လုပ်ခြင်း | {string\|ArrayBuffer\|TypedArray}              |
| `'module'`              | ES module တစ်ခုကို load လုပ်ခြင်း                     | {string\|ArrayBuffer\|TypedArray}                  |
| `'wasm'`                | WebAssembly module တစ်ခုကို load လုပ်ခြင်း            | {ArrayBuffer\|TypedArray}                          |

`source` ရဲ့ တန်ဖိုးက format `'builtin'` အတွက်တော့ လျစ်လျူရှုခံရပါတယ် — ဘာလို့လဲဆိုတော့ Node.js
builtin (core) module တစ်ခုရဲ့ တန်ဖိုးကို အစားထိုးဖို့က လက်ရှိမှာ မဖြစ်နိုင်သေးလို့ပါ။

> ဒီ types တွေအားလုံးက ECMAScript မှာ သတ်မှတ်ထားတဲ့ classes တွေနဲ့ ကိုက်ညီပါတယ်။

* ဒီနေရာမှာ ရည်ညွှန်းတဲ့ {ArrayBuffer} object က {SharedArrayBuffer} တစ်ခု ဖြစ်ပါတယ်။
* ဒီနေရာမှာ ရည်ညွှန်းတဲ့ {TypedArray} object က {Uint8Array} တစ်ခု ဖြစ်ပါတယ်။

Text-based format (ဆိုလိုတာက `'json'`, `'module'`) တစ်ခုရဲ့ source တန်ဖိုးက string မဟုတ်ဘူးဆိုရင် —
[`util.TextDecoder`][] ကို သုံးပြီး string အဖြစ် ပြောင်းလဲပေးပါတယ်။
### Asynchronous customization hooks (တစ်ပြိုင်တည်း မဟုတ်သော customization hooks)

> Stability: 1.1 - Active Development

#### Caveats of asynchronous customization hooks (asynchronous customization hooks များ၏ caveats များ)

Asynchronous customization hooks တွေမှာ caveats များစွာ ရှိပြီး — သူတို့ရဲ့ ပြဿနာတွေကို
ဖြေရှင်းနိုင်မလားဆိုတာ မသေချာပါဘူး။ ဒီ caveats တွေကို ရှောင်ရှားဖို့ `module.registerHooks()`
ကတစ်ဆင့် synchronous customization hooks တွေကို သုံးဖို့ user တွေကို တိုက်တွန်းပါတယ်။

* Asynchronous hooks တွေက သီးခြား thread တစ်ခုပေါ်မှာ run လုပ်တာမို့ — hook functions တွေက
  customize လုပ်နေတဲ့ modules တွေရဲ့ global state ကို တိုက်ရိုက် ပြောင်းလဲလို့ မရပါဘူး။
  နှစ်ခုကြားမှာ data တွေ ပေးပို့ဖို့ ဒါမှမဟုတ် control flows တွေကို သက်ရောက်ဖို့ message channels
  နဲ့ atomics တွေကို သုံးတာက ပုံမှန် ဖြစ်ပါတယ်။
  [Communication with asynchronous module customization hooks](#communication-with-asynchronous-module-customization-hooks)
  မှာ ကြည့်ပါ။
* Asynchronous hooks တွေက module graph ထဲက `require()` calls တွေ အားလုံးကို သက်ရောက်မှု မရှိပါဘူး။
  * `module.createRequire()` နဲ့ ဖန်တီးထားတဲ့ custom `require` functions တွေကို သက်ရောက်မှု မရှိပါဘူး။
  * Asynchronous `load` hook က သူ့ကတစ်ဆင့် ဖြတ်သွားတဲ့ CommonJS modules တွေအတွက် `source` ကို
    override မလုပ်ဘူးဆိုရင် — အဲဒီ CommonJS modules တွေက built-in `require()` ကတစ်ဆင့် load လုပ်တဲ့
    child modules တွေကိုလည်း asynchronous hooks တွေက သက်ရောက်မှာ မဟုတ်ပါဘူး။
* CommonJS modules တွေကို customize လုပ်တဲ့အခါ asynchronous hooks တွေက ကိုင်တွယ်ရမယ့် caveats
  တချို့ ရှိပါတယ်။ အသေးစိတ်ကို [asynchronous `resolve` hook][] နဲ့ [asynchronous `load` hook][]
  မှာ ကြည့်ပါ။
* CommonJS modules တွေထဲက `require()` calls တွေကို asynchronous hooks တွေက customize လုပ်တဲ့အခါ —
  Node.js က လက်ရှိ CommonJS monkey-patching တွေနဲ့ လိုက်ဖက်မှု ရှိစေဖို့ CommonJS module ရဲ့
  source code ကို အကြိမ်များစွာ load လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။ Load လုပ်မှုတွေကြားမှာ module code
  ပြောင်းသွားရင် — မမျှော်လင့်တဲ့ အပြုအမူတွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။
  * ဘေးထွက် ဆိုးကျိုးအနေနဲ့ — asynchronous hooks ရော synchronous hooks ရော နှစ်မျိုးလုံး register
    လုပ်ထားပြီး asynchronous hooks တွေက CommonJS module ကို customize လုပ်ဖို့ ရွေးချယ်ရင် —
    အဲဒီ CommonJS module ထဲက `require()` calls တွေအတွက် synchronous hooks တွေကို အကြိမ်များစွာ
    ခေါ်ခံရနိုင်ပါတယ်။

#### Registration of asynchronous customization hooks (asynchronous customization hooks များ register လုပ်ခြင်း)

Asynchronous customization hooks တွေကို [asynchronous hook functions][] တွေကို export လုပ်တဲ့
တခြား module တစ်ခုဆီကို ညွှန်တဲ့ path (သို့) URL တစ်ခုကို လက်ခံတဲ့
[`module.register()`][`register`] ကို သုံးပြီး register လုပ်ပါတယ်။

`registerHooks()` နဲ့ ဆင်တူပြီး — `register()` ကို `--import` သို့မဟုတ် `--require` နဲ့ preload
လုပ်ထားတဲ့ module တစ်ခုထဲကနေ ဒါမှမဟုတ် entry point ထဲမှာ တိုက်ရိုက် ခေါ်လို့ ရပါတယ်။

```mjs
// Use module.register() to register asynchronous hooks in a dedicated thread.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);

// If my-app.mjs is loaded statically here as `import './my-app.mjs'`, since ESM
// dependencies are evaluated before the module that imports them,
// it's loaded _before_ the hooks are registered above and won't be affected.
// To ensure the hooks are applied, dynamic import() must be used to load ESM
// after the hooks are registered.
import('./my-app.mjs');
```

```cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Use module.register() to register asynchronous hooks in a dedicated thread.
register('./hooks.mjs', pathToFileURL(__filename));

import('./my-app.mjs');
```

`hooks.mjs` ထဲမှာ:

```mjs
// hooks.mjs
export async function resolve(specifier, context, nextResolve) {
  /* implementation */
}
export async function load(url, context, nextLoad) {
  /* implementation */
}
```

Synchronous hooks တွေနဲ့ မတူဘဲ — asynchronous hooks တွေက `register()` ကို ခေါ်တဲ့ file ထဲမှာ
load လုပ်တဲ့ ဒီ modules တွေအတွက် run လုပ်မှာ မဟုတ်ပါဘူး:

```mjs
// register-hooks.js
import { register, createRequire } from 'node:module';
register('./hooks.mjs', import.meta.url);

// Asynchronous hooks does not affect modules loaded via custom require()
// functions created by module.createRequire().
const userRequire = createRequire(import.meta.filename);
userRequire('./my-app-2.cjs');  // Hooks won't affect this
```

```cjs
// register-hooks.js
const { register, createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');
register('./hooks.mjs', pathToFileURL(__filename));

// Asynchronous hooks does not affect modules loaded via built-in require()
// in the module calling `register()`
require('./my-app-2.cjs');  // Hooks won't affect this
// .. or custom require() functions created by module.createRequire().
const userRequire = createRequire(__filename);
userRequire('./my-app-3.cjs');  // Hooks won't affect this
```

Asynchronous hooks တွေကို `--import` flag နဲ့ `data:` URL ကို သုံးပြီးလည်း register လုပ်နိုင်ပါတယ်:

```bash
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("my-instrumentation", pathToFileURL("./"));' ./my-app.js
```

#### Chaining of asynchronous customization hooks (asynchronous customization hooks များ၏ chaining)

`register()` ရဲ့ chaining က `registerHooks()` နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ်။ Synchronous ရော
asynchronous ရော hooks နှစ်မျိုး ရောနှော သုံးထားရင် — asynchronous hooks တွေ စတင် run မလုပ်ခင်
synchronous hooks တွေက အမြဲတမ်း အရင်ဆုံး run ပါတယ်။ ဆိုလိုတာက — run လုပ်နေတဲ့ နောက်ဆုံး
synchronous hook ထဲမှာ — သူ့ရဲ့ next hook က asynchronous hooks တွေရဲ့ ခေါ်ဆိုမှုကို ပါဝင်စေပါတယ်။

```mjs
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```cjs
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```

`foo.mjs` နဲ့ `bar.mjs` နှစ်ခုလုံးမှာ `resolve` hook သတ်မှတ်ထားရင် — အောက်ပါအတိုင်း ခေါ်ခံရပါလိမ့်မယ်
(ညာကနေ ဘယ်ဘက်သို့ ဖြစ်ပြီး — `./bar.mjs` ကနေ စပြီး — နောက် `./foo.mjs` — ပြီးမှ Node.js default):

Node.js default ← `./foo.mjs` ← `./bar.mjs`

Asynchronous hooks တွေကို သုံးတဲ့အခါ — register လုပ်ထားတဲ့ hooks တွေက hook modules တွေကို load
လုပ်တာကို ဂရုစိုက်တဲ့ နောက်ဆက်တွဲ `register` calls တွေကိုပါ သက်ရောက်မှု ရှိပါတယ်။ အထက်က ဥပမာမှာ —
`bar.mjs` ကို `foo.mjs` က register လုပ်ထားတဲ့ hooks တွေကတစ်ဆင့် resolve လုပ်ပြီး load လုပ်ခံရပါလိမ့်မယ်
(`foo` ရဲ့ hooks တွေက chain ထဲကို အရင်ကတည်းက ထည့်ပြီးသား ဖြစ်လို့ပါ)။ ဒါက — အစောပိုင်း register
လုပ်ထားတဲ့ hooks တွေက JavaScript အဖြစ် transpile လုပ်ပေးနိုင်သရွေ့ — non-JavaScript ဘာသာစကားတွေနဲ့
hooks တွေကို ရေးတာမျိုး လုပ်နိုင်စေပါတယ်။

`register()` method ကို asynchronous hooks တွေကို export လုပ်တဲ့ hook module (သို့) သူ့ရဲ့
dependencies တွေကို run နေတဲ့ thread ကနေ ခေါ်လို့ မရပါဘူး။

#### Communication with asynchronous module customization hooks (asynchronous module customization hooks များနဲ့ ဆက်သွယ်ခြင်း)

Asynchronous hooks တွေက application code တွေ run နေတဲ့ main thread ကနေ သီးခြား — သီးသန့်
thread တစ်ခုပေါ်မှာ run ပါတယ်။ ဆိုလိုတာက global variables တွေကို ပြောင်းလဲရင် တခြား thread(s)
တွေကို သက်ရောက်မှာ မဟုတ်ဘူး — ပြီးတော့ threads တွေကြားမှာ ဆက်သွယ်ဖို့ message channels တွေကို
မဖြစ်မနေ သုံးရပါမယ်။

`register` method ကို [`initialize`][] hook ဆီ data တွေ ပို့ဖို့ သုံးနိုင်ပါတယ်။ Hook ဆီ ပို့တဲ့
data ထဲမှာ ports တွေလို transferable objects တွေ ပါဝင်နိုင်ပါတယ်။

```mjs
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// This example demonstrates how a message channel can be used to
// communicate with the hooks, by sending `port2` to the hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// This example showcases how a message channel can be used to
// communicate with the hooks, by sending `port2` to the hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

#### Asynchronous hooks accepted by `module.register()` (`module.register()` က လက်ခံသော asynchronous hooks များ)

[`register`][] method ကို hooks အစုတစ်စု export လုပ်တဲ့ module တစ်ခုကို register လုပ်ဖို့ သုံးနိုင်ပါတယ်။
Hooks တွေဆိုတာ — module resolution နဲ့ loading process ကို customize လုပ်ဖို့ Node.js က ခေါ်တဲ့
functions တွေပါ။ Export လုပ်ထားတဲ့ functions တွေမှာ သတ်သတ်မှတ်မှတ် နာမည်တွေနဲ့ signatures တွေ
ရှိရမှာ ဖြစ်ပြီး — named exports အနေနဲ့ export လုပ်ထားရပါမယ်။

```mjs
export async function initialize({ number, port }) {
  // Receives data from `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Take an `import` or `require` specifier and resolve it to a URL.
}

export async function load(url, context, nextLoad) {
  // Take a resolved URL and return the source code to be evaluated.
}
```

Asynchronous hooks တွေက application code တွေ run နေတဲ့ main thread ကနေ သီးခြားခွဲထားတဲ့ သီးခြား
thread တစ်ခုပေါ်မှာ run ပါတယ်။ ဆိုလိုတာက မတူညီတဲ့ [realm][] တစ်ခု ဖြစ်ပါတယ်။ Hooks thread ကို
main thread က ဘယ်အချိန်မဆို အဆုံးသတ်နိုင်တာမို့ — asynchronous operations (ဥပမာ `console.log`)
တွေ ပြီးဆုံးတာကို မမှီခိုပါနဲ့။ ဒါတွေက default အနေနဲ့ child workers တွေဆီ အမွေဆက်ခံ ရောက်ရှိပါတယ်။

#### `initialize()`

* `data` {any} `register(loader, import.meta.url, { data })` ကနေ လာတဲ့ data ပါ။

`initialize` hook ကို [`register`][] ကပဲ လက်ခံပါတယ်။ Synchronous hooks တွေအတွက် လိုအပ်တဲ့
initialization ကို `registerHooks()` ခေါ်တာရဲ့ ရှေ့မှာ တိုက်ရိုက် run လို့ ရတာမို့ —
`registerHooks()` က ဒါကို မပံ့ပိုးသလို မလိုအပ်လည်း ဖြစ်ပါတယ်။

`initialize` hook က — hooks module ကို initialize လုပ်တဲ့အခါ hooks thread ထဲမှာ run လုပ်မယ့်
custom function တစ်ခုကို သတ်မှတ်ဖို့ နည်းလမ်း ပေးပါတယ်။ Initialization က hooks module ကို
[`register`][] ကတစ်ဆင့် register လုပ်တဲ့အခါ ဖြစ်ပေါ်ပါတယ်။

ဒီ hook က [`register`][] ခေါ်ဆိုမှုတစ်ခုကနေ data တွေကို လက်ခံနိုင်ပြီး — ports နဲ့ တခြား
transferable objects တွေ ပါဝင်နိုင်ပါတယ်။ `initialize` ရဲ့ return value က {Promise} တစ်ခု
ဖြစ်နိုင်ပြီး — အဲဒီလိုဆိုရင် main application thread ရဲ့ execution ပြန်လည် မစတင်မခင် အဲဒါကို
စောင့်ဆိုင်း (await) လုပ်ပါတယ်။

Module customization အတွက် code:

```mjs
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```

Caller (ခေါ်ယူသူ) ဘက်က code:

```mjs
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```cjs
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

#### Asynchronous `resolve(specifier, context, nextResolve)`

* `specifier` {string}
* `context` {Object}
  * `conditions` {string\[]} သက်ဆိုင်ရာ `package.json` ရဲ့ export conditions များ
  * `importAttributes` {Object} Module ကို import လုပ်ရာမှာ သုံးမယ့် attributes တွေကို
    key-value pairs အနေနဲ့ ကိုယ်စားပြုတဲ့ object တစ်ခု
  * `parentURL` {string|undefined} ဒီ module ကို import လုပ်နေတဲ့ module ရဲ့ URL ပါ။ ဒါက
    Node.js entry point ဆိုရင်တော့ undefined ဖြစ်ပါတယ်
* `nextResolve` {Function} Chain ထဲက နောက် `resolve` hook ဖြစ်ပြီး — နောက်ဆုံး user-supplied
  `resolve` hook ပြီးရင် Node.js ရဲ့ default `resolve` hook ကို ညွှန်ပါတယ်
  * `specifier` {string}
  * `context` {Object|undefined} ဖြုတ်လိုက်ရင် (omitted) defaults တွေကို ထောက်ပံ့ပေးပါတယ်။
    ပေးလိုက်ရင် defaults တွေကို ပေးလိုက်တဲ့ properties တွေကို ဦးစားပေးပြီး ပေါင်းစည်းပါတယ်။
* Returns: {Object|Promise} Asynchronous ဗားရှင်းက အောက်ပါ properties တွေ ပါဝင်တဲ့ object
  တစ်ခုကို ဖြစ်စေ — အဲဒီလို object အဖြစ် resolve ဖြစ်မယ့် `Promise` တစ်ခုကို ဖြစ်စေ လက်ခံပါတယ်။
  * `format` {string|null|undefined} `load` hook အတွက် hint တစ်ခုပါ (လျစ်လျူရှုခံရနိုင်ပါတယ်)။
    Module format (ဥပမာ `'commonjs'` သို့မဟုတ် `'module'`) ဖြစ်နိုင်သလို — `'css'` သို့မဟုတ်
    `'yaml'` လို စိတ်ကြိုက် တန်ဖိုးတစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။
  * `importAttributes` {Object|undefined} Module ကို cache လုပ်တဲ့အခါ သုံးမယ့် import attributes
    တွေပါ (optional; ဖယ်ထားရင် input ကို သုံးမှာပါ)
  * `shortCircuit` {undefined|boolean} ဒီ hook က `resolve` hooks ရဲ့ chain ကို အဆုံးသတ်ဖို့
    ရည်ရွယ်ကြောင်း အချက်ပြတဲ့ signal တစ်ခုပါ။ **Default:** `false`
  * `url` {string} ဒီ input က resolve ဖြစ်သွားတဲ့ absolute URL ပါ

Asynchronous ဗားရှင်းက synchronous ဗားရှင်းနဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ကွာတာက `nextResolve`
function က `Promise` တစ်ခုကို ပြန်ပေးပြီး `resolve` hook ကိုယ်တိုင်ကလည်း `Promise` တစ်ခုကို
ပြန်နိုင်တာပါ။

> **Warning** Asynchronous ဗားရှင်းမှာ — promises နဲ့ async functions တွေကို ပြန်ပေးတာကို
> ပံ့ပိုးထားပေမယ့် — `resolve` ကို ခေါ်တာတွေက main thread ကို ပိတ်ဆို့ (block) နိုင်သေးပြီး
> ဒါက performance ကို ထိခိုက်စေနိုင်ပါတယ်။

> **Warning** Asynchronous hooks တွေက customize လုပ်ထားတဲ့ CommonJS modules တွေထဲက `require()`
> calls တွေအတွက် ခေါ်ခံရတဲ့ `resolve` hook က `require()` ဆီ ပို့လိုက်တဲ့ မူရင်း specifier ကို
> လက်ခံရရှိမှာ မဟုတ်ပါဘူး။ အဲဒီအစား — default CommonJS resolution ကို သုံးပြီး အပြည့်အဝ resolve
> လုပ်ပြီးသား URL တစ်ခုကို လက်ခံရရှိပါတယ်။

> **Warning** Asynchronous customization hooks တွေက customize လုပ်ထားတဲ့ CommonJS modules တွေထဲမှာ —
> `require.resolve()` နဲ့ `require()` တို့က `"require"` အစား `"import"` export condition ကို သုံးမှာ
> ဖြစ်လို့ — dual packages တွေကို load လုပ်တဲ့အခါ မမျှော်လင့်တဲ့ အပြုအမူတွေ ဖြစ်စေနိုင်ပါတယ်။

```mjs
export async function resolve(specifier, context, nextResolve) {
  // When calling `defaultResolve`, the arguments can be modified. For example,
  // to change the specifier or add conditions.
  if (specifier.includes('foo')) {
    specifier = specifier.replace('foo', 'bar');
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // The hook can also skips default resolution and provide a custom URL.
  if (specifier === 'special-module') {
    return {
      url: 'file:///path/to/special-module.mjs',
      format: 'module',
      shortCircuit: true,  // This is mandatory if not calling nextResolve().
    };
  }

  // If no customization is needed, defer to the next hook in the chain which would be the
  // Node.js default resolve if this is the last user-specified loader.
  return nextResolve(specifier);
}
```

#### Asynchronous `load(url, context, nextLoad)`

* `url` {string} `resolve` chain က ပြန်ပေးတဲ့ URL ပါ
* `context` {Object}
  * `conditions` {string\[]} သက်ဆိုင်ရာ `package.json` ရဲ့ export conditions များ
  * `format` {string|null|undefined} `resolve` hook chain က ရွေးချယ် ထောက်ပံ့ပေးတဲ့ format ပါ။
    ဒါက input အနေနဲ့ ဘယ် string တန်ဖိုးမဆို ဖြစ်နိုင်ပြီး — input တန်ဖိုးတွေက အောက်မှာ ဖော်ပြထားတဲ့
    လက်ခံနိုင်တဲ့ return values စာရင်းနဲ့ ကိုက်ညီစရာ မလိုပါဘူး။
  * `importAttributes` {Object}
* `nextLoad` {Function} Chain ထဲက နောက် `load` hook ဖြစ်ပြီး — နောက်ဆုံး user-supplied `load` hook
  ပြီးရင် Node.js ရဲ့ default `load` hook ကို ညွှန်ပါတယ်
  * `url` {string}
  * `context` {Object|undefined} ဖြုတ်လိုက်ရင် defaults တွေကို ထောက်ပံ့ပေးပါတယ်။ ပေးလိုက်ရင်
    defaults တွေကို ပေးလိုက်တဲ့ properties တွေကို ဦးစားပေးပြီး ပေါင်းစည်းပါတယ်။ Default
    `nextLoad` မှာတော့ — `url` က ညွှန်တဲ့ module မှာ ရှင်းလင်းတဲ့ module type အချက်အလက် မရှိဘူးဆိုရင်
    `context.format` က မဖြစ်မနေ လိုအပ်ပါတယ်။

* Returns: {Promise} Asynchronous ဗားရှင်းက အောက်ပါ properties တွေ ပါဝင်တဲ့ object တစ်ခုကို
  ဖြစ်စေ — အဲဒီလို object အဖြစ် resolve ဖြစ်မယ့် `Promise` တစ်ခုကို ဖြစ်စေ လက်ခံပါတယ်။
  * `format` {string}
  * `shortCircuit` {undefined|boolean} ဒီ hook က `load` hooks ရဲ့ chain ကို အဆုံးသတ်ဖို့
    ရည်ရွယ်ကြောင်း အချက်ပြတဲ့ signal တစ်ခုပါ။ **Default:** `false`
  * `source` {string|ArrayBuffer|TypedArray} Node.js က evaluate လုပ်ဖို့ အတွက် source ပါ

> **Warning**: Asynchronous `load` hook နဲ့ CommonJS modules တွေကနေ လာတဲ့ namespaced exports တွေက
> သဟဇာတ မဖြစ်ပါဘူး။ သူတို့ကို အတူတူ သုံးဖို့ ကြိုးစားရင် import ကနေ empty object တစ်ခု ရလာပါလိမ့်မယ်။
> ဒါက နောက်ပိုင်းမှာ ဖြေရှင်းပေးနိုင်ပါတယ်။ ဒါက synchronous `load` hook အတွက်တော့ အကျုံးမဝင်ပါဘူး —
> အဲဒီကိစ္စမှာ exports တွေကို ပုံမှန်အတိုင်း သုံးနိုင်ပါတယ်။

Asynchronous ဗားရှင်းက synchronous ဗားရှင်းနဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် asynchronous
`load` hook ကို သုံးတဲ့အခါ `'commonjs'` အတွက် `source` ပေးတာနဲ့ မပေးဘဲ ဖြုတ်ထားတာက သိသိသာသာ
ကွဲပြားတဲ့ သက်ရောက်မှုတွေ ရှိပါတယ်:

* `source` ပေးထားတဲ့အခါ — ဒီ module ကနေ လာတဲ့ `require` calls တွေ အားလုံးကို register လုပ်ထားတဲ့
  `resolve` နဲ့ `load` hooks တွေနဲ့အတူ ESM loader က လုပ်ဆောင်ပေးပါတယ်; ဒီ module ကနေ လာတဲ့
  `require.resolve` calls တွေ အားလုံးကိုလည်း register လုပ်ထားတဲ့ `resolve` hooks တွေနဲ့အတူ ESM loader
  က လုပ်ဆောင်ပေးပါတယ်; CommonJS API ရဲ့ အစိတ်အပိုင်း တစိတ်တပိုင်းပဲ ရနိုင်ပါတယ် (ဥပမာ
  `require.extensions` မရှိ၊ `require.cache` မရှိ၊ `require.resolve.paths` မရှိ) — ပြီးတော့ CommonJS
  module loader ပေါ်မှာ monkey-patching လုပ်တာတွေကလည်း အကျိုးသက်ရောက်မှာ မဟုတ်ပါဘူး။
* `source` က undefined သို့မဟုတ် `null` ဖြစ်နေရင် — ဒါကို CommonJS module loader က ကိုင်တွယ်ပြီး
  `require`/`require.resolve` calls တွေက register လုပ်ထားတဲ့ hooks တွေကတစ်ဆင့် မသွားပါဘူး။ Nullish
  `source` အတွက် ဒီအပြုအမူက ယာယီပါ — နောက်ပိုင်းမှာ nullish `source` ကို ပံ့ပိုးတော့မှာ မဟုတ်ပါဘူး။

ဒီ caveats တွေက synchronous `load` hook အတွက်တော့ အကျုံးမဝင်ပါဘူး — အဲဒီကိစ္စမှာ customize
လုပ်ထားတဲ့ CommonJS modules တွေအတွက် CommonJS APIs အစုံအလင် ရနိုင်ပြီး `require`/`require.resolve`
တို့က register လုပ်ထားတဲ့ hooks တွေကတစ်ဆင့် အမြဲတမ်း သွားပါတယ်။

Node.js ရဲ့ internal asynchronous `load` implementation — ဆိုလိုတာက `load` chain ထဲက နောက်ဆုံး
hook အတွက် `next` တန်ဖိုး ဖြစ်တဲ့အရာ — က backward compatibility အတွက် `format` က `'commonjs'`
ဖြစ်တဲ့အခါ `source` အတွက် `null` ကို ပြန်ပေးပါတယ်။ ဒီမှာ non-default အပြုအမူကို opt-in လုပ်တဲ့
ဥပမာ hook တစ်ခု ဖြစ်ပါတယ်:

```mjs
import { readFile } from 'node:fs/promises';

// Asynchronous version accepted by module.register(). This fix is not needed
// for the synchronous version accepted by module.registerHooks().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```

ဒါက synchronous `load` hook အတွက်လည်း အကျုံးမဝင်ပါဘူး — အဲဒီကိစ္စမှာ ပြန်ပေးတဲ့ `source` မှာ
module format ဘာပဲဖြစ်ဖြစ် — next hook က load လုပ်ထားတဲ့ source code ပါဝင်ပါတယ်။

### Examples (ဥပမာများ)

ဒီ module customization hooks အမျိုးမျိုးကို အတူတကွ သုံးပြီး — Node.js ရဲ့ code loading နဲ့
evaluation အပြုအမူတွေကို ကျယ်ပြန့်စွာ customize လုပ်နိုင်ပါတယ်။

#### Import from HTTPS (HTTPS ကနေ import လုပ်ခြင်း)

အောက်က hook က အဲဒီလို specifiers တွေအတွက် အခြေခံအဆင့် ပံ့ပိုးမှု ရရှိစေဖို့ hooks တွေကို
register လုပ်ပါတယ်။ ဒါက Node.js core ရဲ့ လုပ်ဆောင်ချက်တွေကို သိသိသာသာ တိုးတက်စေတာလို
ထင်ရပေမယ့် — ဒီ hooks တွေကို တကယ် သုံးခြင်းမှာ သိသာတဲ့ အားနည်းချက်တွေ ရှိပါတယ်: disk ကနေ
files တွေ load လုပ်တာထက် performance က အများကြီး နှေးကွေးပြီး — caching မရှိသလို — security
လည်း မရှိပါဘူး။

```mjs
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // For JavaScript to be loaded over the network, we need to fetch and
  // return it.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // This example assumes all network-provided JavaScript is ES module
          // code.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url);
}
```

```mjs
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```

အထက်က hooks module နဲ့အတူ —
`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs`
ဆိုပြီး run လုပ်ရင် — `main.mjs` ထဲက URL မှာ ရှိတဲ့ module ရဲ့အလိုအရ CoffeeScript ရဲ့ လက်ရှိ
version ကို ပုံနှိပ်ထုတ်ပေးပါတယ်။

#### Transpilation (source code အသွင်ပြောင်းခြင်း)

Node.js က နားမလည်တဲ့ formats တွေနဲ့ ရှိနေတဲ့ sources တွေကို [`load` hook][load hook] ကို သုံးပြီး
JavaScript အဖြစ် ပြောင်းလဲနိုင်ပါတယ်။

ဒါက Node.js ကို run မလုပ်ခင် source files တွေကို ကြိုတင် transpile လုပ်ထားတာထက် performance
ပိုညံ့ပါတယ်; transpiler hooks တွေကို development နဲ့ testing ရည်ရွယ်ချက်တွေအတွက်ပဲ သုံးသင့်ပါတယ်။

##### Asynchronous version (asynchronous ဗားရှင်း)

```mjs
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { findPackageJSON } from 'node:module';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // CoffeeScript files can be either CommonJS or ES modules. Use a custom format
    // to tell Node.js not to detect its module type.
    const { source: rawSource } = await nextLoad(url, { ...context, format: 'coffee' });
    // This hook converts CoffeeScript source code into JavaScript source code
    // for all imported CoffeeScript files.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    // To determine how Node.js would interpret the transpilation result,
    // search up the file system for the nearest parent package.json file
    // and read its "type" field.
    return {
      format: await getPackageType(url),
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url, context);
}

async function getPackageType(url) {
  // `url` is only a file path during the first iteration when passed the
  // resolved url from the load() hook
  // an actual file path from load() will contain a file extension as it's
  // required by the spec
  // this simple truthy check for whether `url` contains a file extension will
  // work for most projects but does not cover some edge-cases (such as
  // extensionless files or a url ending in a trailing space)
  const pJson = findPackageJSON(url);

  return readFile(pJson, 'utf8')
    .then(JSON.parse)
    .then((json) => json?.type)
    .catch(() => undefined);
}
```

##### Synchronous version (synchronous ဗားရှင်း)

```mjs
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs';
import { registerHooks, findPackageJSON } from 'node:module';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const { source: rawSource } = nextLoad(url, { ...context, format: 'coffee' });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format: getPackageType(url),
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url, context);
}

function getPackageType(url) {
  const pJson = findPackageJSON(url);
  if (!pJson) {
    return undefined;
  }
  try {
    const file = readFileSync(pJson, 'utf-8');
    return JSON.parse(file)?.type;
  } catch {
    return undefined;
  }
}

registerHooks({ load });
```

#### Running hooks (hooks များ run လုပ်ခြင်း)

```coffee
# main.coffee
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```

```coffee
# scream.coffee
export scream = (str) -> str.toUpperCase()
```

ဥပမာကို run လုပ်နိုင်ဖို့ — CoffeeScript files တွေရဲ့ module type ပါဝင်တဲ့ `package.json` file
တစ်ခုကို ထည့်ပေးပါ။

```json
{
  "type": "module"
}
```

ဒါက ဥပမာကို run လုပ်ဖို့အတွက်သာ ဖြစ်ပါတယ်။ Real world loaders တွေမှာ — `getPackageType()` က
`package.json` ထဲမှာ ရှင်းလင်းတဲ့ type မပါရင်တောင် Node.js က သိတဲ့ format တစ်ခုကို ပြန်ပေးနိုင်ဖို့
လိုပါတယ် — မဟုတ်ရင် `nextLoad` call က `ERR_UNKNOWN_FILE_EXTENSION` (undefined ဖြစ်ရင်) သို့မဟုတ်
`ERR_UNKNOWN_MODULE_FORMAT` ([load hook][] documentation မှာ စာရင်းပြုထားတဲ့ သိထားတဲ့ format တစ်ခု
မဟုတ်ရင်) ကို throw လုပ်ပါလိမ့်မယ်။

အထက်က hooks modules တွေနဲ့အတူ —
`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee`
သို့မဟုတ် `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` ဆိုပြီး run လုပ်ရင် —
`main.coffee` ရဲ့ source code ကို disk ကနေ load လုပ်ပြီးနောက် Node.js က မလုပ်ဆောင်မခင် JavaScript
အဖြစ် ပြောင်းလဲသွားပါတယ်; load လုပ်ပြီးသား ဘယ် file ကမဆို `import` statements တွေကတစ်ဆင့်
ရည်ညွှန်းထားတဲ့ `.coffee`, `.litcoffee` (သို့) `.coffee.md` files တွေ အားလုံးအတွက်လည်း
အလားတူပဲ ဖြစ်ပါတယ်။

#### Import maps (import map များ)

အထက်က ဥပမာနှစ်ခုက `load` hooks တွေကို သတ်မှတ်ထားတာပါ။ ဒါကတော့ `resolve` hook ရဲ့ ဥပမာတစ်ခုပါ။
ဒီ hooks module က — ဘယ် specifiers တွေကို တခြား URLs တွေဆီ override လုပ်ရမယ်ဆိုတာ သတ်မှတ်ပေးထားတဲ့
`import-map.json` file တစ်ခုကို ဖတ်ပါတယ် (ဒါက "import maps" specification ရဲ့ အစိတ်အပိုင်း
ငယ်တစ်ခုရဲ့ အလွန် ရိုးရှင်းတဲ့ implementation တစ်ခုပါ)။

##### Asynchronous version (asynchronous ဗားရှင်း)

```mjs
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```

##### Synchronous version (synchronous ဗားရှင်း)

```mjs
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```

##### Using the hooks (hooks များ အသုံးပြုခြင်း)

ဒီ files တွေနဲ့ဆိုရင်:

```mjs
// main.js
import 'a-module';
```

```json
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```

```mjs
// some-module.js
console.log('some module!');
```

`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js`
သို့မဟုတ် `node --import ./import-map-sync-hooks.js main.js` ဆိုပြီး run လုပ်ရင် `some module!`
ဆိုတာကို ပုံနှိပ်ထုတ်သင့်ပါတယ်။

## Source Map Support (Source map ပံ့ပိုးမှု)

> Stability: 1 - Experimental

Node.js က TC39 ECMA-426 [Source Map][] format ကို ပံ့ပိုးပေးပါတယ် (ဒါကို အရင်က Source map
revision 3 format လို့ ခေါ်ပါတယ်)။

ဒီ section ထဲက APIs တွေက source map cache နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့အတွက် helper တွေပါ။ ဒီ cache
ကို — source map parsing ကို enable လုပ်ထားပြီး module တစ်ခုရဲ့ footer ထဲမှာ [source map include
directives][] တွေ တွေ့ရတဲ့အခါ ဖြည့်တင်းပါတယ်။

Source map parsing ကို enable လုပ်ဖို့ — Node.js ကို [`--enable-source-maps`][] flag နဲ့ run
ရပါမယ်။ ဒါမှမဟုတ် [`NODE_V8_COVERAGE=dir`][] ကို သတ်မှတ်ပြီး code coverage ကို enable လုပ်ထားရပါမယ်။
ဒါမှမဟုတ် [`module.setSourceMapsSupport()`][] ကတစ်ဆင့် programmatically နည်းနဲ့ enable လုပ်နိုင်ပါတယ်။

```mjs
// module.mjs
// In an ECMAScript module
import { findSourceMap, SourceMap } from 'node:module';
```

```cjs
// module.cjs
// In a CommonJS module
const { findSourceMap, SourceMap } = require('node:module');
```

### `module.getSourceMapsSupport()`

* Returns: {Object}
  * `enabled` {boolean} Source maps support ကို enable လုပ်ထားလားဆိုတာ
  * `nodeModules` {boolean} `node_modules` ထဲက files တွေအတွက် support ကို enable လုပ်ထားလားဆိုတာ
  * `generatedCode` {boolean} `eval` သို့မဟုတ် `new Function` ကနေ ထွက်လာတဲ့ generated code အတွက်
    support ကို enable လုပ်ထားလားဆိုတာ

ဒီ method က stack traces တွေအတွက် [Source Map v3][Source Map] support ကို enable လုပ်ထားလားဆိုတာကို
ပြန်ပေးပါတယ်။

### `module.findSourceMap(path)`

* `path` {string}
* Returns: {module.SourceMap|undefined} Source map တစ်ခု တွေ့ရင် `module.SourceMap` ကို ပြန်ပေးပြီး —
  မတွေ့ရင် `undefined` ပြန်ပေးပါတယ်။

`path` ဆိုတာ — သက်ဆိုင်ရာ source map တစ်ခုကို ရယူသင့်တဲ့ file ရဲ့ resolved path ပါ။

### `module.setSourceMapsSupport(enabled[, options])`

* `enabled` {boolean} Source map support ကို enable လုပ်ပါတယ်။
* `options` {Object} Optional (ထည့်စရာ မလို)
  * `nodeModules` {boolean} `node_modules` ထဲက files တွေအတွက် support ကို enable လုပ်ခြင်း။
    **Default:** `false`။
  * `generatedCode` {boolean} `eval` သို့မဟုတ် `new Function` ကနေ ထွက်လာတဲ့ generated code အတွက်
    support ကို enable လုပ်ခြင်း။ **Default:** `false`။

ဒီ function က stack traces တွေအတွက် [Source Map v3][Source Map] support ကို enable သို့မဟုတ်
disable လုပ်ပါတယ်။

ဒါက Node.js process ကို `--enable-source-maps` commandline option နဲ့ စတင်ခြင်းနဲ့ တူညီတဲ့
features တွေကို ပေးစွမ်းပြီး — `node_modules` ထဲက files တွေ သို့မဟုတ် generated codes တွေအတွက်
support ကို ပြောင်းလဲဖို့ အပိုဆောင်း options တွေ ပါဝင်ပါတယ်။

Source maps ကို enable လုပ်ပြီးမှ load လုပ်လိုက်တဲ့ JavaScript files တွေထဲက source maps တွေကိုသာ
parse လုပ်ပြီး load လုပ်မှာ ဖြစ်ပါတယ်။ ဒီ API call မတိုင်ခင် load လုပ်ပြီးသား modules တွေရဲ့
source maps တွေကို လက်လွတ်မခံမိစေဖို့ — `--enable-source-maps` commandline option ကို သုံးတာက
ပိုကောင်းပါတယ်။

### Class: `module.SourceMap`

#### `new SourceMap(payload[, { lineLengths }])`

* `payload` {Object}
* `lineLengths` {number\[]}

`sourceMap` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

`payload` ဆိုတာ — [Source map format][] နဲ့ ကိုက်ညီတဲ့ keys တွေ ပါဝင်တဲ့ object တစ်ခုပါ:

* `file` {string}
* `version` {number}
* `sources` {string\[]}
* `sourcesContent` {string\[]}
* `names` {string\[]}
* `mappings` {string}
* `sourceRoot` {string}

`lineLengths` ဆိုတာ — generated code ထဲက စာကြောင်းတစ်ကြောင်းချင်းစီရဲ့ အလျားတွေ ပါဝင်တဲ့ optional
array တစ်ခုပါ။

#### `sourceMap.payload`

* Returns: {Object}

[`SourceMap`][] instance ကို တည်ဆောက်ရာမှာ သုံးခဲ့တဲ့ payload အတွက် getter ပါ။

#### `sourceMap.findEntry(lineOffset, columnOffset)`

* `lineOffset` {number} Generated source ထဲမှာ zero-indexed ဖြစ်တဲ့ line number offset ပါ
* `columnOffset` {number} Generated source ထဲမှာ zero-indexed ဖြစ်တဲ့ column number offset ပါ
* Returns: {Object}

Generated source file ထဲမှာ line offset နဲ့ column offset တစ်ခု ပေးလိုက်ရင် — တွေ့ရင် မူရင်း
file ထဲက SourceMap range ကို ကိုယ်စားပြုတဲ့ object တစ်ခုကို ပြန်ပေးပြီး — မတွေ့ရင် empty object
တစ်ခုကို ပြန်ပေးပါတယ်။

ပြန်ပေးတဲ့ object မှာ အောက်ပါ keys တွေ ပါဝင်ပါတယ်:

* `generatedLine` {number} Generated source ထဲမှာ range ရဲ့ အစပိုင်း line offset ပါ
* `generatedColumn` {number} Generated source ထဲမှာ range ရဲ့ အစပိုင်း column offset ပါ
* `originalSource` {string} SourceMap ထဲမှာ ဖော်ပြထားတဲ့အတိုင်း မူရင်း source ရဲ့ file name ပါ
* `originalLine` {number} မူရင်း source ထဲမှာ range ရဲ့ အစပိုင်း line offset ပါ
* `originalColumn` {number} မူရင်း source ထဲမှာ range ရဲ့ အစပိုင်း column offset ပါ
* `name` {string}

ပြန်ပေးတဲ့ တန်ဖိုးက SourceMap ထဲမှာ ပေါ်နေတဲ့အတိုင်း raw range ကို ကိုယ်စားပြုပြီး — Error messages နဲ့ CallSite objects တွေထဲမှာ
ပေါ်နေတဲ့ 1-indexed line နဲ့ column numbers တွေ မဟုတ်ပဲ — zero-indexed offsets တွေကို
အခြေခံပါတယ်။

Error stacks နဲ့ CallSite objects တွေက ဖော်ပြတဲ့ lineNumber နဲ့ columnNumber ကနေ သက်ဆိုင်တဲ့
1-indexed line နဲ့ column numbers တွေကို ရဖို့ — `sourceMap.findOrigin(lineNumber, columnNumber)`
ကို သုံးပါ

#### `sourceMap.findOrigin(lineNumber, columnNumber)`

* `lineNumber` {number} Generated source ထဲမှာ call site ရဲ့ 1-indexed line number ပါ
* `columnNumber` {number} Generated source ထဲမှာ call site ရဲ့ 1-indexed column number ပါ
* Returns: {Object}

Generated source ထဲက call site တစ်ခုရဲ့ 1-indexed `lineNumber` နဲ့ `columnNumber` ကို ပေးလိုက်ရင် —
မူရင်း source ထဲမှာ သက်ဆိုင်တဲ့ call site location ကို ရှာဖွေပေးပါတယ်။

ပေးလိုက်တဲ့ `lineNumber` နဲ့ `columnNumber` ကို ဘယ် source map ထဲမှာမှ မတွေ့ရင် — empty object
တစ်ခုကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် ပြန်ပေးတဲ့ object မှာ အောက်ပါ keys တွေ ပါဝင်ပါတယ်:

* `name` {string|undefined} Source map ထဲမှာ range ရဲ့ နာမည်ပါ (ပေးထားရင်)
* `fileName` {string} SourceMap ထဲမှာ ဖော်ပြထားတဲ့အတိုင်း မူရင်း source ရဲ့ file name ပါ
* `lineNumber` {number} မူရင်း source ထဲမှာ သက်ဆိုင်တဲ့ call site ရဲ့ 1-indexed lineNumber ပါ
* `columnNumber` {number} မူရင်း source ထဲမှာ သက်ဆိုင်တဲ့ call site ရဲ့ 1-indexed columnNumber ပါ

[CommonJS]: modules.md
[Conditional exports]: packages.md#conditional-exports
[Customization hooks]: #customization-hooks
[ES Modules]: esm.md
[Permission Model]: permissions.md#permission-model
[Source Map]: https://tc39.es/ecma426/
[Source map format]: https://tc39.es/ecma426/#sec-source-map-format
[V8 JavaScript code coverage]: https://v8project.blogspot.com/2017/12/javascript-code-coverage.html
[V8 code cache]: https://v8.dev/blog/code-caching-for-devs
[`"exports"`]: packages.md#exports
[`--enable-source-maps`]: cli.md#--enable-source-maps
[`--import`]: cli.md#--importmodule
[`--require`]: cli.md#-r---require-module
[`NODE_COMPILE_CACHE=dir`]: cli.md#node_compile_cachedir
[`NODE_COMPILE_CACHE_PORTABLE=1`]: cli.md#node_compile_cache_portable1
[`NODE_COMPILE_CACHE_READONLY=1`]: cli.md#node_compile_cache_readonly1
[`NODE_DISABLE_COMPILE_CACHE=1`]: cli.md#node_disable_compile_cache1
[`NODE_V8_COVERAGE=dir`]: cli.md#node_v8_coveragedir
[`SourceMap`]: #class-modulesourcemap
[`initialize`]: #initialize
[`module.constants.compileCacheStatus`]: #moduleconstantscompilecachestatus
[`module.enableCompileCache()`]: #moduleenablecompilecacheoptions
[`module.flushCompileCache()`]: #moduleflushcompilecache
[`module.getCompileCacheDir()`]: #modulegetcompilecachedir
[`module.registerHooks()`]: #moduleregisterhooksoptions
[`module.setSourceMapsSupport()`]: #modulesetsourcemapssupportenabled-options
[`module`]: #the-module-object
[`os.tmpdir()`]: os.md#ostmpdir
[`register`]: #moduleregisterspecifier-parenturl-options
[`util.TextDecoder`]: util.md#class-utiltextdecoder
[accepted final formats]: #accepted-final-formats-returned-by-load
[asynchronous `load` hook]: #asynchronous-loadurl-context-nextload
[asynchronous `resolve` hook]: #asynchronous-resolvespecifier-context-nextresolve
[asynchronous hook functions]: #asynchronous-hooks-accepted-by-moduleregister
[caveats of asynchronous customization hooks]: #caveats-of-asynchronous-customization-hooks
[deregistration of synchronous customization hooks]: #deregistration-of-synchronous-customization-hooks
[hooks]: #customization-hooks
[load hook]: #synchronous-loadurl-context-nextload
[module compile cache]: #module-compile-cache
[module wrapper]: modules.md#the-module-wrapper
[realm]: https://tc39.es/ecma262/#realm
[resolve hook]: #synchronous-resolvespecifier-context-nextresolve
[source map include directives]: https://tc39.es/ecma426/#sec-linking-generated-code
[synchronous hook functions]: #hook-functions-accepted-by-moduleregisterhooks
[the documentation of `Worker`]: worker_threads.md#new-workerfilename-options
[transferable objects]: worker_threads.md#portpostmessagevalue-transferlist
[type-stripping]: typescript.md#type-stripping
