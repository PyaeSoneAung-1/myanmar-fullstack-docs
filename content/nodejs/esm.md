---
title: "Modules: ECMAScript modules"
description: "ECMAScript modules (ESM) — enabling, `import` specifiers, `import.meta`, `import()`, JSON/text/wasm modules, CommonJS interoperability နှင့် resolution algorithm အပါအဝင် Node.js ရဲ့ ES module စနစ် အကြောင်း"
order: 109
source: "https://nodejs.org/api/esm.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

## နိဒါန်း (Introduction)

ECMAScript modules ဆိုတာ JavaScript code တွေကို ပြန်လည် အသုံးပြုနိုင်အောင် ထုပ်ပိုး (package) လုပ်ဖို့အတွက် [တရားဝင် စံနှုန်း format][the official standard format] ပါ။ Module တွေကို [`import`][] နဲ့ [`export`][] statement အမျိုးမျိုးကို သုံးပြီး သတ်မှတ်ပါတယ်။

အောက်က ES module ဥပမာက function တစ်ခုကို export လုပ်ပြပါတယ်:

```js
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```

အောက်က ES module ဥပမာက `addTwo.mjs` ကနေ အဲဒီ function ကို import လုပ်ပြပါတယ်:

```js
// app.mjs
import { addTwo } from './addTwo.mjs';

// Prints: 6
console.log(addTwo(4));
```

Node.js က ECMAScript modules တွေကို လက်ရှိ သတ်မှတ်ထားတဲ့အတိုင်း အပြည့်အဝ support လုပ်ပြီး — ၎င်းတို့နဲ့ ၎င်း၏ မူရင်း module format ဖြစ်တဲ့ [CommonJS][] အကြား အပြန်အလှန် လုပ်ဆောင်နိုင်မှု (interoperability) ကိုလည်း ပံ့ပိုးပေးပါတယ်။

## ES module များကို ဖွင့်သုံးခြင်း (Enabling)

Node.js မှာ module system နှစ်မျိုး ရှိပါတယ်: [CommonJS][] modules နဲ့ ECMAScript modules တို့ပါ။

Author တွေက JavaScript ကို ES module အဖြစ် အနက်ဖွင့်စေဖို့ Node.js ကို အောက်ပါ နည်းလမ်းတွေနဲ့ ပြောပြနိုင်ပါတယ် — `.mjs` file extension၊ `"module"` တန်ဖိုးရှိတဲ့ `package.json` ရဲ့ [`"type"`][] field၊ (သို့) `"module"` တန်ဖိုးရှိတဲ့ [`--input-type`][] flag တို့ပါ။ ဒါတွေက code ကို ES module အဖြစ် run ဖို့ ရည်ရွယ်ထားကြောင်း ထင်ရှားစေတဲ့ marker (အမှတ်အသား) တွေပါ။

ပြောင်းပြန်အနေနဲ့ author တွေက JavaScript ကို CommonJS အဖြစ် အနက်ဖွင့်စေဖို့ `.cjs` file extension၊ `"commonjs"` တန်ဖိုးရှိတဲ့ [`"type"`][] field၊ (သို့) `"commonjs"` တန်ဖိုးရှိတဲ့ [`--input-type`][] flag တွေကို သုံးပြီး ရှင်းရှင်းလင်းလင်း ပြောပြနိုင်ပါတယ်။

Code တစ်ခုမှာ module system နှစ်ခုလုံးအတွက် ထင်ရှားတဲ့ marker တွေ မပါဘူးဆိုရင် — Node.js က module တစ်ခုရဲ့ source code ထဲမှာ ES module syntax ရှိမရှိ စစ်ဆေးပါတယ်။ အဲဒီလို syntax တွေ့ရင် Node.js က code ကို ES module အဖြစ် run ပြီး — မတွေ့ရင်တော့ module ကို CommonJS အဖြစ် run ပါတယ်။ အသေးစိတ်အတွက် [Determining module system][] ကို ကြည့်ပါ။

## Package များ (Packages)

ဒီ section ကို [Modules: Packages](packages.md) ဆီ ရွှေ့ထားပါတယ်။

## `import` specifier များ (Import specifiers)

### ဝေါဟာရ အသုံးအနှုန်းများ (Terminology)

`import` statement တစ်ခုရဲ့ _specifier_ ဆိုတာ `from` keyword ရဲ့ နောက်မှာ လာတဲ့ string ပါ — ဥပမာ `import { sep } from 'node:path'` ထဲက `'node:path'` ပေါ့။ Specifier တွေကို `export from` statements တွေမှာရော `import()` expression တစ်ခုရဲ့ argument အဖြစ်ပါ သုံးပါတယ်။

Specifier အမျိုးအစား သုံးမျိုး ရှိပါတယ်:

* _Relative specifiers_ (နှိုင်းယှဉ် specifiers) ဥပမာ `'./startup.js'` (သို့) `'../config.mjs'` — import လုပ်နေတဲ့ file ရဲ့ တည်နေရာနဲ့ နှိုင်းယှဉ်ထားတဲ့ path တစ်ခုကို ရည်ညွှန်းပါတယ်။ _ဒီ specifiers တွေအတွက် file extension က အမြဲတမ်း လိုအပ်ပါတယ်။_

* _Bare specifiers_ (ဗလာ specifiers) ဥပမာ `'some-package'` (သို့) `'some-package/shuffle'` — ဥပမာတွေမှာ အသီးသီး ပြထားသလို package name နဲ့ package ရဲ့ အဓိက entry point ကို ရည်ညွှန်းနိုင်သလို — package name ကို ရှေ့ကနေ ကပ်ထားတဲ့ package ထဲက သီးခြား feature module တစ်ခုကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။ _File extension ထည့်ဖို့က [`"exports"`][] field မပါတဲ့ packages တွေအတွက်ပဲ လိုအပ်ပါတယ်။_

* _Absolute specifiers_ (အကြွင်းမဲ့ specifiers) ဥပမာ `'file:///opt/nodejs/config.js'` — full path တစ်ခုကို တိုက်ရိုက် ရှင်းရှင်းလင်းလင်း ရည်ညွှန်းပါတယ်။

Bare specifier resolutions တွေကို [Node.js module resolution and loading algorithm][] က ကိုင်တွယ်ပါတယ်။ တခြား specifier resolutions တွေ အားလုံးကိုတော့ စံသတ်မှတ်ထားတဲ့ relative [URL][] resolution semantics (နှိုင်းယှဉ် URL ဖြေရှင်းခြင်း စည်းမျဉ်းများ) နဲ့ပဲ အမြဲတမ်း ဖြေရှင်းပါတယ်။

CommonJS မှာလိုပဲ — package တစ်ခုရဲ့ module files တွေကို package name ရဲ့ နောက်မှာ path တစ်ခု ဆက်ထည့်ပြီး ဝင်ရောက်နိုင်ပါတယ်။ ဒါပေမယ့် package ရဲ့ [`package.json`][] ထဲမှာ [`"exports"`][] field ပါနေရင်တော့ — package ထဲက files တွေကို [`"exports"`][] ထဲမှာ သတ်မှတ်ထားတဲ့ paths တွေကနေပဲ ဝင်ရောက်လို့ ရမှာ ဖြစ်ပါတယ်။

Node.js module resolution ထဲမှာ bare specifiers တွေနဲ့ သက်ဆိုင်တဲ့ ဒီ package resolution rules (စည်းမျဉ်းများ) အသေးစိတ်အတွက် [packages documentation](packages.md) ကို ကြည့်ပါ။

### File extension ထည့်သွင်းရန် မဖြစ်မနေ လိုအပ်ခြင်း (Mandatory file extensions)

Relative (သို့) absolute specifiers တွေကို ဖြေရှင်းဖို့ `import` keyword ကို သုံးတဲ့အခါ file extension တစ်ခုကို ထည့်ပေးရပါမယ်။ Directory indexes တွေ (ဥပမာ `'./startup/index.js'`) ကိုလည်း အပြည့်အစုံ သတ်မှတ်ပေးရပါမယ်။

ဒီအပြုအမူက ပုံမှန် configure လုပ်ထားတဲ့ server တစ်ခုရှိတဲ့ browser environments တွေမှာ `import` က ပြုမူပုံနဲ့ ကိုက်ညီပါတယ်။

### URL များ (URLs)

ES modules တွေကို URLs အဖြစ် resolve လုပ်ပြီး cache (ကက်ရှ်) လုပ်ပါတယ်။ ဒါကြောင့် special characters တွေကို [percent-encoded][] လုပ်ပေးရပါမယ် — ဥပမာ `#` ကို `%23` နဲ့ရော `?` ကို `%3F` နဲ့ပါ။

`file:`၊ `node:`၊ နဲ့ `data:` URL schemes တွေကို support လုပ်ပါတယ်။ `'https://example.com/app.js'` လိုမျိုး specifier တစ်ခုကိုတော့ [custom HTTPS loader][custom https loader] ကို သုံးနေတာ မဟုတ်ရင် Node.js ထဲမှာ မူရင်းအတိုင်း (natively) support မလုပ်ပါဘူး။

#### `file:` URL များ (file: URLs)

`import` specifier တစ်ခုမှာ query (သို့) fragment မတူညီရင် modules တွေကို အကြိမ်များစွာ load လုပ်ပါတယ်။

```js
import './foo.mjs?query=1'; // loads ./foo.mjs with query of "?query=1"
import './foo.mjs?query=2'; // loads ./foo.mjs with query of "?query=2"
```

Volume root ကို `/`၊ `//`၊ (သို့) `file:///` တွေနဲ့ ရည်ညွှန်းနိုင်ပါတယ်။ [URL][] နဲ့ path resolution ကြားမှာ ကွာခြားချက်တွေ (percent encoding အသေးစိတ်လိုမျိုး) ရှိတာမို့ — path တစ်ခုကို import လုပ်တဲ့အခါ [url.pathToFileURL][] ကို သုံးဖို့ အကြံပြုပါတယ်။

#### `data:` import များ (data: imports)

[`data:` URLs][] တွေကို အောက်ပါ MIME types တွေနဲ့ import လုပ်ဖို့ support လုပ်ပါတယ်:

* `text/javascript` — ES modules တွေအတွက်
* `application/json` — JSON အတွက်
* `application/wasm` — Wasm အတွက်

```js
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```

`data:` URLs တွေက builtin modules တွေအတွက် [bare specifiers][Terminology] တွေကိုရော [absolute specifiers][Terminology] တွေကိုပဲ ဖြေရှင်းပေးပါတယ်။ [relative specifiers][Terminology] တွေကိုတော့ ဖြေရှင်းလို့ မရပါဘူး — `data:` က [special scheme][] တစ်ခု မဟုတ်လို့ပါ။ ဥပမာ — `data:text/javascript,import "./foo";` ကနေ `./foo` ကို load လုပ်ဖို့ ကြိုးစားရင် — `data:` URLs တွေအတွက် relative resolution ဆိုတဲ့ concept မရှိတာမို့ resolve လုပ်ဖို့ မအောင်မြင်ပါဘူး။

#### `node:` import များ (node: imports)

Node.js builtin modules တွေကို load လုပ်ဖို့ အခြားနည်းလမ်းတစ်ခုအနေနဲ့ `node:` URLs တွေကို support လုပ်ပါတယ်။ ဒီ URL scheme က builtin modules တွေကို တရားဝင်တဲ့ absolute URL strings တွေနဲ့ ရည်ညွှန်းနိုင်အောင် လုပ်ပေးပါတယ်။

```js
import fs from 'node:fs/promises';
```

## Import attribute များ (Import attributes)

[Import attributes][Import Attributes MDN] တွေဆိုတာ module import statements တွေအတွက် — module specifier နဲ့အတူ အပိုအချက်အလက်တွေကို ထပ်ဖြတ်သန်းပေးနိုင်ဖို့ inline syntax တစ်ခုပါ။

```js
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```

Node.js က `type` attribute ကိုပဲ support လုပ်ပြီး — ၎င်းအတွက် အောက်ပါ တန်ဖိုးတွေကို support လုပ်ပါတယ်:

| Attribute `type` | Needed for |
| ---------------- | ---------------- |
| `'json'`         | [JSON modules][] |
| `'text'`         | [Text modules][] |

`type: 'json'` attribute က JSON modules တွေကို import လုပ်တဲ့အခါ မဖြစ်မနေ လိုအပ်ပါတယ်။ `type: 'text'` attribute က text modules တွေကို import လုပ်တဲ့အခါ မဖြစ်မနေ လိုအပ်ပါတယ်။

## Built-in module များ (Built-in modules)

[Built-in modules][] တွေက သူတို့ရဲ့ public API တွေရဲ့ named exports တွေကို ထောက်ပံ့ပေးပါတယ်။ CommonJS exports ရဲ့ တန်ဖိုး ဖြစ်တဲ့ default export တစ်ခုကိုလည်း ပေးပါတယ်။ Default export ကို တခြား အသုံးဝင်မှုတွေကြားထဲမှာ — named exports တွေကို ပြုပြင်မွမ်းမံတာတွေအတွက်ပါ သုံးနိုင်ပါတယ်။ Built-in modules တွေရဲ့ named exports တွေကို [`module.syncBuiltinESMExports()`][] ကို ခေါ်မှသာလျှင် update လုပ်ပါတယ်။

```js
import EventEmitter from 'node:events';
const e = new EventEmitter();
```

```js
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```

```js
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

> Built-in modules တွေကို import လုပ်တဲ့အခါ — named exports အားလုံး (ဆိုလိုတာ module exports object ရဲ့ properties တွေ) ကို တစ်ခုချင်းစီ သီးခြား ဝင်ရောက်အသုံးပြုတာ မဟုတ်ဘဲ အားလုံး populate လုပ်ပါတယ်။ ဒါက built-in modules တွေရဲ့ ကနဦး imports တွေကို — module exports object ကို ချက်ချင်း evaluate လုပ်ပြီး ၎င်းရဲ့ properties အချို့ကို တစ်ခုချင်း ပထမဆုံး ဝင်ရောက်တဲ့အခါမှသာ initialize လုပ်တဲ့ `require()` (သို့) `process.getBuiltinModule()` တွေနဲ့ load လုပ်တာထက် နည်းနည်း ပိုနှေးစေနိုင်ပါတယ်။

## `import()` ဖြင့် dynamic import ပြုလုပ်ခြင်း (import() expressions)

Dynamic [`import()`][] က modules တွေကို import လုပ်ဖို့ asynchronous နည်းလမ်းတစ်ခုကို ထောက်ပံ့ပေးပါတယ်။ CommonJS ရော ES modules တွေမှာပါ support လုပ်ပြီး — CommonJS ရော ES modules တွေကိုပါ load လုပ်ဖို့ သုံးနိုင်ပါတယ်။

## `import.meta`

* Type: {Object}

`import.meta` meta property ဆိုတာ အောက်ပါ properties တွေ ပါဝင်တဲ့ `Object` တစ်ခုပါ။ ES modules တွေထဲမှာပဲ support လုပ်ပါတယ်။

### `import.meta.dirname`

* Type: {string} လက်ရှိ module ရဲ့ directory name။

ဒါက [`import.meta.filename`][] ရဲ့ [`path.dirname()`][] နဲ့ အတူတူပါပဲ။

> **Caveat**: `file:` modules တွေမှာပဲ ရှိပါတယ်။

### `import.meta.filename`

* Type: {string} symlinks တွေကို ဖြေရှင်းပြီးသား လက်ရှိ module ရဲ့ full absolute path နဲ့ filename။

ဒါက [`import.meta.url`][] ကို [`url.fileURLToPath()`][] နဲ့ ပြောင်းထားတာနဲ့ အတူတူပါပဲ။

> **Caveat** — local modules တွေကပဲ ဒီ property ကို ထောက်ပံ့ပေးပါတယ်။ `file:` protocol ကို မသုံးတဲ့ modules တွေက ဒါကို ပေးမှာ မဟုတ်ပါဘူး။

### `import.meta.url`

* Type: {string} module ရဲ့ absolute `file:` URL။

ဒါက browser တွေမှာ လက်ရှိ module file ရဲ့ URL ကို ပေးတာနဲ့ အတိအကျ တူညီပါတယ်။

ဒါက relative file loading လိုမျိုး အသုံးဝင်တဲ့ patterns တွေကို ဖြစ်နိုင်စေပါတယ်:

```js
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```

### `import.meta.main`

> Stability: 1.0 - Early development

* Type: {boolean} လက်ရှိ module က လက်ရှိ process ရဲ့ entry point ဖြစ်နေရင် `true` — မဟုတ်ရင် `false`။

CommonJS ထဲက `require.main === module` နဲ့ ညီမျှပါတယ်။

Python ရဲ့ `__name__ == "__main__"` နဲ့လည်း သဘောတရားအရ တူညီပါတယ်။

```js
export function foo() {
  return 'Hello, world';
}

function main() {
  const message = foo();
  console.log(message);
}

if (import.meta.main) main();
// `foo` can be imported from another module without possible side-effects from `main`
```

### `import.meta.resolve(specifier)`

> Stability: 1.2 - Release candidate

* `specifier` {string} လက်ရှိ module နဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ရမယ့် module specifier။
* Returns: {string} အဲဒီ specifier က resolve ဖြစ်မယ့် absolute URL string။

[`import.meta.resolve`][] ဆိုတာ module တစ်ခုချင်းစီနဲ့ သက်ဆိုင်တဲ့ (module-relative) resolution function တစ်ခုပါ — URL string ကို ပြန်ပေးပါတယ်။

```js
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```

Node.js module resolution ရဲ့ အင်္ဂါရပ်အားလုံးကို support လုပ်ပါတယ်။ Dependency resolutions တွေက package အတွင်းမှာ ခွင့်ပြုထားတဲ့ exports resolutions တွေနဲ့ ကိုက်ညီရပါမယ်။

**Caveats** (သတိပြုရန် အချက်များ):

* ဒါက synchronous file-system operations တွေကို ဖြစ်စေနိုင်ပြီး — `require.resolve` လိုပဲ performance ကို ထိခိုက်စေနိုင်ပါတယ်။
* ဒီ feature က custom loaders တွေထဲမှာ မရနိုင်ပါဘူး (deadlock ဖြစ်စေနိုင်လို့ပါ)။

**Non-standard API** (စံမဟုတ်သော API):

`--experimental-import-meta-resolve` flag ကို သုံးတဲ့အခါ — အဲဒီ function က ဒုတိယ argument တစ်ခုကို လက်ခံပါတယ်:

* `parent` {string|URL} resolve လုပ်ဖို့အတွက် မဖြစ်မနေ မဟုတ်တဲ့ absolute parent module URL။
  **Default:** `import.meta.url`

## CommonJS နဲ့ အပြန်အလှန် လုပ်ဆောင်နိုင်မှု (Interoperability with CommonJS)

### `import` statement များ (import statements)

`import` statement တစ်ခုက ES module တစ်ခုကိုရော CommonJS module တစ်ခုကိုပါ ရည်ညွှန်းနိုင်ပါတယ်။ `import` statements တွေကို ES modules တွေထဲမှာပဲ ခွင့်ပြုပြီး — ES modules တွေကို load လုပ်ဖို့ dynamic [`import()`][] expressions တွေကိုတော့ CommonJS ထဲမှာပါ support လုပ်ပါတယ်။

[CommonJS modules](#commonjs-namespaces) တွေကို import လုပ်တဲ့အခါ — `module.exports` object ကို default export အဖြစ် ထောက်ပံ့ပေးပါတယ်။ Ecosystem နဲ့ ပိုကောင်းတဲ့ လိုက်ဖက်ညီမှု ရှိစေဖို့ အဆင်ပြေမှုတစ်ခုအနေနဲ့ — static analysis ကနေ Named exports တွေကိုလည်း ရရှိနိုင်ပါတယ်။

### `require`

CommonJS module ဖြစ်တဲ့ `require` က လောလောဆယ် synchronous ES modules တွေ (ဆိုလိုတာ top-level `await` မသုံးတဲ့ ES modules တွေ) ကိုပဲ load လုပ်တာကို support လုပ်ပါတယ်။

အသေးစိတ်အတွက် [Loading ECMAScript modules using `require()`][] ကို ကြည့်ပါ။

### CommonJS namespace များ (CommonJS Namespaces)

CommonJS modules တွေမှာ ဘယ်လို type မဆို ဖြစ်နိုင်တဲ့ `module.exports` object တစ်ခု ပါဝင်ပါတယ်။

ဒါကို support လုပ်ဖို့ — ECMAScript module တစ်ခုကနေ CommonJS ကို import လုပ်တဲ့အခါ CommonJS module အတွက် namespace wrapper တစ်ခုကို တည်ဆောက်ပြီး — CommonJS `module.exports` တန်ဖိုးကို ညွှန်ပြတဲ့ `default` export key တစ်ခုကို အမြဲတမ်း ထောက်ပံ့ပေးပါတယ်။

ဒါ့အပြင် — `module.exports` ပေါ်က တန်ဖိုးတွေကနေ namespace ပေါ်မှာ ထောက်ပံ့ဖို့ exports တွေရဲ့ best-effort static စာရင်းတစ်ခု ရနိုင်အောင် CommonJS module ရဲ့ source text ကို heuristic static analysis (ခန့်မှန်း ချဉ်းကပ်သော static ခွဲခြမ်းစိတ်ဖြာမှု) လုပ်ပါတယ်။ ဒီ namespaces တွေကို CJS module ရဲ့ evaluation မလုပ်ခင် တည်ဆောက်ထားရလို့ ဒါ လိုအပ်ပါတယ်။

ဒီ CommonJS namespace objects တွေက — CommonJS ထဲမှာ သူတို့ရဲ့ ကိုယ်စားပြုမှုက ဒီတန်ဖိုးကို သုံးတယ်ဆိုပြီး namespace value မဟုတ်ဘူးဆိုတာ ရှင်းရှင်းလင်းလင်း ညွှန်ပြဖို့ `default` export ကို `'module.exports'` named export အနေနဲ့ပါ ထောက်ပံ့ပေးပါတယ်။ ဒါက [`require(esm)`][] interop support ထဲက `'module.exports'` export name ကို ကိုင်တွယ်တဲ့ semantics ကို ထင်ဟပ်ပါတယ်။

CommonJS module တစ်ခုကို import လုပ်တဲ့အခါ — ES module default import (သို့) ၎င်းနဲ့ သက်ဆိုင်တဲ့ sugar syntax ကို သုံးပြီး ယုံကြည်စိတ်ချစွာ import လုပ်နိုင်ပါတယ်:

```js
import { default as cjs } from 'cjs';
// Identical to the above
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Prints:
//   <module.exports>
//   true
```

ဒီ Module Namespace Exotic Object ကို `import * as m from 'cjs'` ကို သုံးတဲ့အခါမှာရော dynamic import တစ်ခုမှာပါ တိုက်ရိုက် ကြည့်ရှုနိုင်ပါတယ်:

```js
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Prints:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```

JS ecosystem ထဲက လက်ရှိ အသုံးပြုမှုတွေနဲ့ ပိုကောင်းတဲ့ လိုက်ဖက်ညီမှုအတွက် — Node.js က import လုပ်လိုက်တဲ့ CommonJS module တစ်ခုချင်းစီရဲ့ CommonJS named exports တွေကို static analysis လုပ်ငန်းစဉ်တစ်ခုနဲ့ သီးခြား ES module exports တွေအနေနဲ့ ထောက်ပံ့ဖို့ပါ ဆုံးဖြတ်ဖို့ ကြိုးစားပါတယ်။

ဥပမာ — အောက်လို ရေးထားတဲ့ CommonJS module တစ်ခုကို ကြည့်ပါ:

```cjs
// cjs.cjs
exports.name = 'exported';
```

အပေါ်က module က ES modules တွေထဲမှာ named imports တွေကို support လုပ်ပါတယ်:

```js
import { name } from './cjs.cjs';
console.log(name);
// Prints: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Prints: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Prints:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```

Module Namespace Exotic Object ကို log လုပ်ထားတဲ့ နောက်ဆုံး ဥပမာကနေ တွေ့နိုင်သလို — module ကို import လုပ်တဲ့အခါ `name` export ကို `module.exports` object ပေါ်ကနေ ကူးယူပြီး ES module namespace ပေါ်မှာ တိုက်ရိုက် သတ်မှတ်ပါတယ်။

`module.exports` ပေါ်ကို နောက်ပိုင်း ထည့်လိုက်တဲ့ live binding updates (သို့) exports အသစ်တွေကိုတော့ ဒီ named exports တွေအတွက် ထောက်လှမ်းမပေးပါဘူး။

Named exports တွေကို ထောက်လှမ်းတာက အသုံးများတဲ့ syntax patterns တွေကို အခြေခံထားပေမယ့် — named exports တွေကို အမြဲတမ်းတော့ မှန်ကန်စွာ ထောက်လှမ်းနိုင်မှာ မဟုတ်ပါဘူး။ ဒီလိုအခြေအနေမျိုးမှာ အပေါ်မှာ ဖော်ပြခဲ့တဲ့ default import form က ပိုကောင်းတဲ့ ရွေးချယ်မှုတစ်ခု ဖြစ်နိုင်ပါတယ်။

Named exports ထောက်လှမ်းမှုက အသုံးများတဲ့ export patterns တွေ၊ reexport patterns တွေနဲ့ build tools နဲ့ transpilers တွေရဲ့ outputs အများအပြားကို ဖုံးအုပ်ပေးပါတယ်။ အတိအကျ အကောင်အထည်ဖော်ထားတဲ့ semantics တွေအတွက် [merve][] ကို ကြည့်ပါ။

### ES modules နဲ့ CommonJS အကြား ကွာခြားချက်များ (Differences between ES modules and CommonJS)

#### `require`၊ `exports`၊ (သို့) `module.exports` မရှိခြင်း (No require, exports, or module.exports)

ကိစ္စအများစုမှာ ES module ရဲ့ `import` ကို CommonJS modules တွေ load လုပ်ဖို့ သုံးနိုင်ပါတယ်။

လိုအပ်ရင် — ES module တစ်ခုထဲမှာ [`module.createRequire()`][] ကို သုံးပြီး `require` function တစ်ခုကို တည်ဆောက်နိုင်ပါတယ်။

#### `__filename` သို့မဟုတ် `__dirname` မရှိခြင်း (No __filename or __dirname)

ဒီ CommonJS variables တွေက ES modules တွေထဲမှာ မရနိုင်ပါဘူး။

`__filename` နဲ့ `__dirname` ရဲ့ use cases တွေကို [`import.meta.filename`][] နဲ့ [`import.meta.dirname`][] တွေနဲ့ အစားထိုး ဖြည့်ဆည်းနိုင်ပါတယ်။

#### Addon load လုပ်ခြင်း မပံ့ပိုးခြင်း (No Addon Loading)

[Addons][] တွေကို ES module imports တွေနဲ့ လောလောဆယ် support မလုပ်ပါဘူး။

သူတို့ကို [`module.createRequire()`][] (သို့) [`process.dlopen`][] တွေနဲ့တော့ load လုပ်နိုင်ပါတယ်။

#### `require.main` မရှိခြင်း (No require.main)

`require.main === module` ကို အစားထိုးဖို့ — [`import.meta.main`][] API ရှိပါတယ်။

#### `require.resolve` မရှိခြင်း (No require.resolve)

Relative resolution တွေကို `new URL('./local', import.meta.url)` နဲ့ ကိုင်တွယ်နိုင်ပါတယ်။

`require.resolve` အတွက် အပြည့်အစုံ အစားထိုးတစ်ခုအနေနဲ့ [import.meta.resolve][] API ရှိပါတယ်။

တနည်းအားဖြင့် `module.createRequire()` ကိုလည်း သုံးနိုင်ပါတယ်။

#### `NODE_PATH` မရှိခြင်း (No NODE_PATH)

`NODE_PATH` က `import` specifiers တွေကို resolve လုပ်တာမှာ ပါဝင်မှု မရှိပါဘူး။ ဒီအပြုအမူ လိုချင်ရင် symlinks တွေကို သုံးပေးပါ။

#### `require.extensions` မရှိခြင်း (No require.extensions)

`require.extensions` ကို `import` က သုံးမှာ မဟုတ်ပါဘူး။ Module customization hooks တွေက အစားထိုး တစ်ခုကို ထောက်ပံ့ပေးနိုင်ပါတယ်။

#### `require.cache` မရှိခြင်း (No require.cache)

`require.cache` ကို `import` က သုံးမှာ မဟုတ်ပါဘူး — ES module loader မှာ ကိုယ်ပိုင် သီးခြား cache တစ်ခု ရှိလို့ပါ။

## JSON module များ (JSON modules)

JSON files တွေကို `import` နဲ့ ရည်ညွှန်းနိုင်ပါတယ်:

```js
import packageConfig from './package.json' with { type: 'json' };
```

`with { type: 'json' }` syntax က မဖြစ်မနေ လိုအပ်ပါတယ် — [Import Attributes][] ကို ကြည့်ပါ။

Import လုပ်ထားတဲ့ JSON က `default` export တစ်ခုကိုပဲ ထုတ်ဖော်ပေးပါတယ်။ Named exports တွေအတွက် support မရှိပါဘူး။ ထပ်တူမဖြစ်စေဖို့ CommonJS cache ထဲမှာ cache entry တစ်ခုကို ဖန်တီးပါတယ်။ JSON module တစ်ခုကို path တစ်ခုတည်းကနေ အရင်က import လုပ်ပြီးသားဆိုရင် CommonJS ထဲမှာလည်း object တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ်။

## Text module များ (Text modules)

> Stability: 1.0 - Early development

Text modules တွေကို `--experimental-import-text` flag ရဲ့ နောက်ကွယ်မှာ ရရှိနိုင်ပါတယ်။

Text files တွေကို `import` နဲ့ ရည်ညွှန်းနိုင်ပါတယ်:

```js
import message from './message.txt' with { type: 'text' };
```

`with { type: 'text' }` syntax က မဖြစ်မနေ လိုအပ်ပါတယ် — [Import Attributes][] ကို ကြည့်ပါ။

Import လုပ်ထားတဲ့ text က module source ကို string တစ်ခုအနေနဲ့ တန်ဖိုးထားတဲ့ `default` export တစ်ခုကိုပဲ ထုတ်ဖော်ပေးပါတယ်။
## Wasm module များ (Wasm modules)

WebAssembly module instances တွေကိုရော WebAssembly source phase imports တွေကိုပါ import လုပ်တာကို support လုပ်ပါတယ်။

ဒီ integrations နှစ်မျိုးလုံးက [ES Module Integration Proposal for WebAssembly][] နဲ့ ကိုက်ညီပါတယ်။

### Wasm source phase import များ (Wasm Source Phase Imports)

> Stability: 1.2 - Release candidate

[Source Phase Imports][] proposal က `import source` keyword ပေါင်းစပ်မှုကို သုံးပြီး — သူ့ရဲ့ dependencies တွေနဲ့ အတူ instantiate လုပ်ပြီးသား module instance တစ်ခုကို ရယူမယ့်အစား `WebAssembly.Module` object တစ်ခုကို တိုက်ရိုက် import လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။

Wasm တွေအတွက် စိတ်ကြိုက် instantiations တွေ လိုအပ်တဲ့အခါ — ES module integration ကနေတစ်ဆင့် resolve လုပ်ပြီး load လုပ်ဆဲ ဖြစ်ပေမယ့် — ဒါက အသုံးဝင်ပါတယ်။

ဥပမာ — module တစ်ခုရဲ့ instances အများအပြားကို ဖန်တီးချင်တာ (သို့) `library.wasm` ရဲ့ instance အသစ်တစ်ခုဆီကို custom imports တွေ ဖြတ်သန်းချင်တာမျိုးတွေမှာပေါ့:

```js
import source libraryModule from './library.wasm';

const instance1 = await WebAssembly.instantiate(libraryModule, importObject1);

const instance2 = await WebAssembly.instantiate(libraryModule, importObject2);
```

Static source phase အပြင် — `import.source` dynamic phase import syntax ကနေတစ်ဆင့် source phase ရဲ့ dynamic variant တစ်ခုလည်း ရှိပါသေးတယ်:

```js
const dynamicLibrary = await import.source('./library.wasm');

const instance = await WebAssembly.instantiate(dynamicLibrary, importObject);
```

### JavaScript string builtins များ (JavaScript String Builtins)

> Stability: 1.2 - Release candidate

WebAssembly modules တွေကို import လုပ်တဲ့အခါ — [WebAssembly JS String Builtins Proposal][] ကို ESM Integration ကနေတစ်ဆင့် အလိုအလျောက် enable လုပ်ပါတယ်။ ဒါက WebAssembly modules တွေက `wasm:js-string` namespace ကနေ compile-time string builtins (compilation အချိန်မှာ ချိတ်ဆက်တဲ့ string လုပ်ဆောင်ချက်များ) တွေကို တိုက်ရိုက် သုံးနိုင်အောင် လုပ်ပေးပါတယ်။

ဥပမာ — အောက်က Wasm module က `wasm:js-string` ရဲ့ `length` builtin ကို သုံးတဲ့ `getLength` ဆိုတဲ့ string function တစ်ခုကို export လုပ်ပါတယ်:

```text
(module
  ;; Compile-time import of the string length builtin.
  (import "wasm:js-string" "length" (func $string_length (param externref) (result i32)))

  ;; Define getLength, taking a JS value parameter assumed to be a string,
  ;; calling string length on it and returning the result.
  (func $getLength (param $str externref) (result i32)
    local.get $str
    call $string_length
  )

  ;; Export the getLength function.
  (export "getLength" (func $get_length))
)
```

```js
import { getLength } from './string-len.wasm';
getLength('foo'); // Returns 3.
```

Wasm builtins တွေက compile-time imports တွေပါ — instantiation မဟုတ်ဘဲ module compilation အတွင်း link လုပ်ပါတယ်။ သူတို့က ပုံမှန် module graph imports တွေလို ပြုမူမှာ မဟုတ်ဘဲ — `WebAssembly.Module.imports(mod)` နဲ့ စစ်ဆေးလို့လည်း မရပါဘူး။ String builtins တွေကို disable လုပ်ပြီး module ကို တိုက်ရိုက် `WebAssembly.compile` API နဲ့ ပြန် compile မလုပ်ရင် virtualize (အစားထိုး အတုဖန်တီး) လုပ်လို့လည်း မရပါဘူး။

String constants တွေကိုလည်း `wasm:js/string-constants` builtin import URL ကနေ import လုပ်နိုင်ပြီး — static JS string globals တွေကို သတ်မှတ်နိုင်ပါတယ်:

```text
(module
  (import "wasm:js/string-constants" "hello" (global $hello externref))
)
```

Module တစ်ခုကို instantiate မလုပ်ခင် source phase မှာ import လုပ်ရင်လည်း compile-time builtins တွေကို အလိုအလျောက် သုံးပါလိမ့်မယ်:

```js
import source mod from './string-len.wasm';
const { exports: { getLength } } = await WebAssembly.instantiate(mod, {});
getLength('foo'); // Also returns 3.
```

### Wasm instance phase import များ (Wasm Instance Phase Imports)

> Stability: 1.1 - Active development

Instance imports တွေက `.wasm` files တွေကို ပုံမှန် modules တွေလို import လုပ်နိုင်အောင် ခွင့်ပြုပြီး — ၎င်းတို့ရဲ့ module imports တွေကိုပါ အလှည့်ကျ support လုပ်ပါတယ်။

ဥပမာ — အောက်ပါအတိုင်း ပါဝင်တဲ့ `index.js` တစ်ခုကို:

```js
import * as M from './library.wasm';
console.log(M);
```

အောက်ပါအတိုင်း run လုပ်လိုက်ရင်:

```bash
node index.mjs
```

`library.wasm` ရဲ့ instantiation အတွက် exports interface ကို ထောက်ပံ့ပေးပါလိမ့်မယ်။

### သီးသန့် သတ်မှတ်ထားသော Wasm namespace များ (Reserved Wasm Namespaces)

WebAssembly module instances တွေကို import လုပ်တဲ့အခါ — သူတို့က reserved prefixes တွေနဲ့ စတင်တဲ့ module import names (သို့) import/export names တွေကို သုံးလို့ မရပါဘူး:

* `wasm-js:` — module import names တွေ၊ module names တွေနဲ့ export names တွေ အားလုံးမှာ reserved ပါ။
* `wasm:` — module import names နဲ့ export names တွေမှာ reserved ပါ (နောင်မှာ future builtin polyfills တွေကို support လုပ်နိုင်ဖို့ imported module names တွေကတော့ ခွင့်ပြုထားပါတယ်)။

အပေါ်က reserved names တွေကို သုံးပြီး module တစ်ခုကို import လုပ်ရင် `WebAssembly.LinkError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

## ထိပ်ဆုံးအဆင့် `await` အသုံးပြုမှု (Top-level await)

`await` keyword ကို ECMAScript module တစ်ခုရဲ့ ထိပ်ဆုံးအဆင့် (top-level) body ထဲမှာ သုံးနိုင်ပါတယ်။

`a.mjs` တစ်ခုမှာ အောက်ပါအတိုင်း ရှိတယ်ဆိုပါစို့:

```js
export const five = await Promise.resolve(5);
```

ပြီးတော့ `b.mjs` တစ်ခုမှာ အောက်ပါအတိုင်း ရှိတယ်ဆိုပါစို့:

```js
import { five } from './a.mjs';

console.log(five); // Logs `5`
```

```bash
node b.mjs # works
```

Top-level `await` expression တစ်ခုက ဘယ်တော့မှ resolve မဖြစ်ဘူးဆိုရင် — `node` process က `13` ဆိုတဲ့ [status code][] နဲ့ ထွက်သွားပါလိမ့်မယ်။

```js
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Never-resolving Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Logs `13`
});
```

## Loader များ (Loaders)

အရင်က Loaders documentation က အခု [Modules: Customization hooks][Module customization hooks] မှာ ရှိပါတယ်။

## Resolution နှင့် loading algorithm (Resolution and loading algorithm)

### အင်္ဂါရပ်များ (Features)

Default resolver (ပုံမှန် ဖြေရှင်းပေးသူ) မှာ အောက်ပါ အင်္ဂါရပ်တွေ ရှိပါတယ်:

* ES modules တွေမှာ သုံးသလို FileURL-based resolution
* Relative နဲ့ absolute URL resolution
* Default extensions မရှိခြင်း
* Folder mains မရှိခြင်း
* node\_modules ကနေတစ်ဆင့် bare specifier package resolution lookup
* အမည်မသိ extensions (သို့) protocols တွေမှာ fail မလုပ်ခြင်း
* Loading phase ဆီကို format ရဲ့ hint (အရိပ်အမြွက်) တစ်ခုကို ရွေးချယ် ပေးနိုင်ခြင်း

Default loader မှာ အောက်ပါ အင်္ဂါရပ်တွေ ရှိပါတယ်:

* `node:` URLs ကနေတစ်ဆင့် builtin module loading အတွက် support
* `data:` URLs ကနေတစ်ဆင့် "inline" module loading အတွက် support
* `file:` module loading အတွက် support
* တခြား URL protocol တွေမှာ fail လုပ်ခြင်း
* `file:` loading အတွက် အမည်မသိ extensions တွေမှာ fail လုပ်ခြင်း (`.cjs`၊ `.js`၊ နဲ့ `.mjs` တွေကိုပဲ support လုပ်ပါတယ်)

[`--experimental-package-map`][] flag ကို enable လုပ်ထားတဲ့အခါ — bare specifier resolution က package map configuration ကို အရင်ဆုံး စစ်ဆေးပါတယ်။ Import လုပ်နေတဲ့ module က mapped package တစ်ခုထဲမှာ ရှိပြီး specifier က ကြေညာထားတဲ့ dependency တစ်ခုနဲ့ ကိုက်ညီနေရင် — package map resolution က ဦးစားပေး အခွင့်အရေး ရပါတယ်။ အသေးစိတ်အတွက် [Package maps][] ကို ကြည့်ပါ။

### Resolution algorithm (ဖြေရှင်းခြင်း algorithm)

ES module specifier တစ်ခုကို load လုပ်ဖို့ algorithm ကို အောက်မှာ **ESM\_RESOLVE** method အနေနဲ့ ဖော်ပြထားပါတယ်။ ၎င်းက parentURL တစ်ခုနဲ့ နှိုင်းယှဉ်ပြီး module specifier တစ်ခုအတွက် resolved URL ကို ပြန်ပေးပါတယ်။

Resolution algorithm က module load တစ်ခုအတွက် full resolved URL ကို ၎င်းရဲ့ suggested module format (အကြံပြုထားသော module format) နဲ့အတူ ဆုံးဖြတ်ပေးပါတယ်။ Resolution algorithm က resolved URL ရဲ့ protocol ကို load လုပ်လို့ ရမရ၊ file extensions တွေကို ခွင့်ပြုမပြုကိုတော့ ဆုံးဖြတ်မပေးပါဘူး — ဒီ validations တွေကို load phase အတွင်း Node.js က လုပ်ဆောင်ပါတယ် (ဥပမာ — `file:`၊ `data:` (သို့) `node:` မဟုတ်တဲ့ protocol တစ်ခု ရှိတဲ့ URL တစ်ခုကို load လုပ်ဖို့ တောင်းဆိုခံရတာမျိုးမှာပါ)။

ဒီ algorithm က file ရဲ့ format ကို extension အပေါ် အခြေခံပြီး ဆုံးဖြတ်ဖို့လည်း ကြိုးစားပါတယ် (အောက်က `ESM_FILE_FORMAT` algorithm ကို ကြည့်ပါ)။ File extension ကို မှတ်မိမှု မရှိဘူးဆိုရင် (ဥပမာ `.mjs`၊ `.cjs`၊ (သို့) `.json` မဟုတ်ဘူးဆိုရင်) — `undefined` ဆိုတဲ့ format တစ်ခုကို ပြန်ပေးပြီး load phase အတွင်းမှာ throw ဖြစ်ပါလိမ့်မယ်။

Resolved URL တစ်ခုရဲ့ module format ကို ဆုံးဖြတ်တဲ့ algorithm ကို **ESM\_FILE\_FORMAT** အနေနဲ့ ဖော်ပြထားပါတယ် — ဘယ် file အတွက်မဆို တစ်မျိုးတည်းသော (unique) module format ကို ပြန်ပေးပါတယ်။ ECMAScript Module တစ်ခုအတွက် _"module"_ format ကို ပြန်ပေးပြီး — legacy CommonJS loader ကနေတစ်ဆင့် load လုပ်တာကို ညွှန်ပြဖို့ _"commonjs"_ format ကို သုံးပါတယ်။ _"addon"_ လိုမျိုး ထပ်ဆောင်း formats တွေကို နောင်မွမ်းမံမှုတွေမှာ တိုးချဲ့နိုင်ပါတယ်။

အောက်က algorithms တွေမှာ — တခြားနည်းဖြင့် ဖော်ပြထားခြင်း မရှိရင် subroutine errors အားလုံးကို ဒီထိပ်တန်း routines တွေရဲ့ errors တွေအနေနဲ့ ဖြန့်ဝေ (propagate) လုပ်ပါတယ်။

_defaultConditions_ ဆိုတာ conditional environment name array ဖြစ်ပြီး — `["node", "import"]` ပါ။

Resolver က အောက်ပါ errors တွေကို throw လုပ်နိုင်ပါတယ်:

* _Invalid Module Specifier_: Module specifier က URL တစ်ခု (သို့) package name (သို့) package subpath specifier တစ်ခုအနေနဲ့ မမှန်ကန်ခြင်း။
* _Invalid Package Configuration_: package.json configuration က မမှန်ကန်ခြင်း (သို့) မမှန်ကန်တဲ့ configuration တစ်ခု ပါဝင်နေခြင်း။
* _Invalid Package Target_: Package exports (သို့) imports တွေက package အတွက် type (သို့) string target အနေနဲ့ မမှန်ကန်တဲ့ target module တစ်ခုကို သတ်မှတ်ပေးနေခြင်း။
* _Package Path Not Exported_: Package exports တွေက ပေးထားတဲ့ module အတွက် package ထဲက target subpath တစ်ခုကို သတ်မှတ်မပေးခြင်း (သို့) ခွင့်မပြုခြင်း။
* _Package Import Not Defined_: Package imports တွေက specifier ကို သတ်မှတ်မပေးခြင်း။
* _Module Not Found_: တောင်းဆိုထားတဲ့ package (သို့) module က မရှိခြင်း။
* _Unsupported Directory Import_: Resolve လုပ်ထားတဲ့ path က directory တစ်ခုနဲ့ ကိုက်ညီနေပြီး — module imports တွေအတွက် supported target တစ်ခု မဟုတ်ခြင်း။

### Resolution algorithm သတ်မှတ်ချက် (Resolution Algorithm Specification)

**ESM\_RESOLVE**(_specifier_, _parentURL_)

> 1. _resolved_ ကို **undefined** အဖြစ် သတ်မှတ်ပါ။
> 2. _specifier_ က တရားဝင် (valid) URL တစ်ခုဆိုရင် —
>    1. _specifier_ ကို URL တစ်ခုအနေနဲ့ parse လုပ်ပြီး ပြန်လည် serialize လုပ်တဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
> 3. တခြားနည်းအားဖြင့် _specifier_ က _"/"_, _"./"_, (သို့) _"../"_ တွေနဲ့ စတင်ရင် —
>    1. _parentURL_ နဲ့ နှိုင်းယှဉ်ပြီး _specifier_ ရဲ့ URL resolution ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
> 4. တခြားနည်းအားဖြင့် _specifier_ က _"#"_ နဲ့ စတင်ရင် —
>    1. **PACKAGE\_IMPORTS\_RESOLVE**(_specifier_, _parentURL_, _defaultConditions_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
> 5. တခြားနည်းအားဖြင့် —
>    1. မှတ်ချက်: _specifier_ က အခု bare specifier တစ်ခု ဖြစ်ပါတယ်။
>    2. **PACKAGE\_RESOLVE**(_specifier_, _parentURL_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
> 6. _format_ ကို **undefined** အဖြစ် သတ်မှတ်ပါ။
> 7. _resolved_ က _"file:"_ URL တစ်ခုဆိုရင် —
>    1. _resolved_ ထဲမှာ _"/"_ (သို့) _"\\"_ တွေရဲ့ percent encodings တစ်ခုခု (_"%2F"_ နဲ့ _"%5C"_ အသီးသီး) ပါဝင်နေရင် —
>       1. _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
>    2. _resolved_ မှာ ရှိတဲ့ file က directory တစ်ခုဆိုရင် —
>       1. _Unsupported Directory Import_ error တစ်ခုကို throw လုပ်ပါ။
>    3. _resolved_ မှာ ရှိတဲ့ file က မရှိဘူးဆိုရင် —
>       1. _Module Not Found_ error တစ်ခုကို throw လုပ်ပါ။
>    4. URL querystring နဲ့ fragment components တွေကို အတိုင်းအတာ တစ်ခုတည်း ထိန်းသိမ်းပြီး _resolved_ ကို _resolved_ ရဲ့ real path အဖြစ် သတ်မှတ်ပါ။
>    5. _format_ ကို **ESM\_FILE\_FORMAT**(_resolved_) ရဲ့ ရလဒ်အဖြစ် သတ်မှတ်ပါ။
> 8. တခြားနည်းအားဖြင့် —
>    1. URL _resolved_ နဲ့ ဆက်စပ်နေတဲ့ content type ရဲ့ module format ကို _format_ အဖြစ် သတ်မှတ်ပါ။
> 9. _format_ နဲ့ _resolved_ ကို loading phase ဆီကို ပြန်ပေးပါ။

**PACKAGE\_RESOLVE**(_packageSpecifier_, _parentURL_)

> 1. _packageName_ ကို **undefined** အဖြစ် သတ်မှတ်ပါ။
> 2. _packageSpecifier_ က empty string ဆိုရင် —
>    1. _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
> 3. _packageSpecifier_ က Node.js builtin module name တစ်ခုဆိုရင် —
>    1. _packageSpecifier_ နဲ့ ပေါင်းစပ်ထားတဲ့ _"node:"_ string ကို ပြန်ပေးပါ။
> 4. _packageSpecifier_ က _"@"_ နဲ့ မစတင်ဘူးဆိုရင် —
>    1. ပထမဆုံး _"/"_ separator (သို့) string ရဲ့ အဆုံး အထိ ရှိတဲ့ _packageSpecifier_ ရဲ့ substring ကို _packageName_ အဖြစ် သတ်မှတ်ပါ။
> 5. တခြားနည်းအားဖြင့် —
>    1. _packageSpecifier_ ထဲမှာ _"/"_ separator တစ်ခုမှ မပါရင် —
>       1. _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
>    2. ဒုတိယမြောက် _"/"_ separator (သို့) string ရဲ့ အဆုံး အထိ ရှိတဲ့ _packageSpecifier_ ရဲ့ substring ကို _packageName_ အဖြစ် သတ်မှတ်ပါ။
> 6. _packageName_ က _"."_ နဲ့ စတင်တာ (သို့) _"\\"_ (သို့) _"%"_ တွေ ပါဝင်နေရင် —
>    1. _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
> 7. _packageName_ ရဲ့ length အနေအထားကနေ စတင်တဲ့ _packageSpecifier_ ရဲ့ substring နဲ့ _"."_ ကို ပေါင်းစပ်ထားတာကို _packageSubpath_ အဖြစ် သတ်မှတ်ပါ။
> 8. **PACKAGE\_SELF\_RESOLVE**(_packageName_, _packageSubpath_, _parentURL_) ရဲ့ ရလဒ်ကို _selfUrl_ အဖြစ် သတ်မှတ်ပါ။
> 9. _selfUrl_ က **undefined** မဟုတ်ဘူးဆိုရင် _selfUrl_ ကို ပြန်ပေးပါ။
> 10. _parentURL_ က file system root မဟုတ်သေးသရွေ့ —
>     1. _parentURL_ နဲ့ နှိုင်းယှဉ်ပြီး _"node\_modules/"_ နဲ့ _packageName_ ကို ပေါင်းစပ်ထားတာရဲ့ URL resolution ကို _packageURL_ အဖြစ် သတ်မှတ်ပါ။
>     2. _parentURL_ ကို _parentURL_ ရဲ့ parent folder URL အဖြစ် သတ်မှတ်ပါ။
>     3. _packageURL_ မှာ ရှိတဲ့ folder က မရှိဘူးဆိုရင် —
>        1. နောက် loop iteration တစ်ခုကို ဆက်လုပ်ပါ။
>     4. **READ\_PACKAGE\_JSON**(_packageURL_) ရဲ့ ရလဒ်ကို _pjson_ အဖြစ် သတ်မှတ်ပါ။
>     5. _pjson_ က **null** မဟုတ်ဘဲ _pjson_._exports_ က **null** (သို့) **undefined** မဟုတ်ဘူးဆိုရင် —
>        1. **PACKAGE\_EXPORTS\_RESOLVE**(_packageURL_, _packageSubpath_, _pjson.exports_, _defaultConditions_) ရဲ့ ရလဒ်ကို ပြန်ပေးပါ။
>     6. တခြားနည်းအားဖြင့် _packageSubpath_ က _"."_ နဲ့ ညီမျှရင် —
>        1. _pjson.main_ က string တစ်ခုဆိုရင် —
>           1. _packageURL_ ထဲမှာ _main_ ရဲ့ URL resolution ကို ပြန်ပေးပါ။
>     7. တခြားနည်းအားဖြင့် —
>        1. _packageURL_ ထဲမှာ _packageSubpath_ ရဲ့ URL resolution ကို ပြန်ပေးပါ။
> 11. _Module Not Found_ error တစ်ခုကို throw လုပ်ပါ။

**PACKAGE\_SELF\_RESOLVE**(_packageName_, _packageSubpath_, _parentURL_)

> 1. **LOOKUP\_PACKAGE\_SCOPE**(_parentURL_) ရဲ့ ရလဒ်ကို _packageURL_ အဖြစ် သတ်မှတ်ပါ။
> 2. _packageURL_ က **null** ဆိုရင် —
>    1. **undefined** ကို ပြန်ပေးပါ။
> 3. **READ\_PACKAGE\_JSON**(_packageURL_) ရဲ့ ရလဒ်ကို _pjson_ အဖြစ် သတ်မှတ်ပါ။
> 4. _pjson_ က **null** ဖြစ်တာ (သို့) _pjson_._exports_ က **null** (သို့) **undefined** ဖြစ်နေရင် —
>    1. **undefined** ကို ပြန်ပေးပါ။
> 5. _pjson.name_ က _packageName_ နဲ့ ညီမျှရင် —
>    1. **PACKAGE\_EXPORTS\_RESOLVE**(_packageURL_, _packageSubpath_, _pjson.exports_, _defaultConditions_) ရဲ့ ရလဒ်ကို ပြန်ပေးပါ။
> 6. တခြားနည်းအားဖြင့် **undefined** ကို ပြန်ပေးပါ။

**PACKAGE\_EXPORTS\_RESOLVE**(_packageURL_, _subpath_, _exports_, _conditions_)

မှတ်ချက်: ဒီ function ကို CommonJS resolution algorithm ကနေ တိုက်ရိုက် ခေါ်ပါတယ်။

> 1. _exports_ က _"."_ နဲ့ စတင်တဲ့ key တစ်ခုရော _"."_ နဲ့ မစတင်တဲ့ key တစ်ခုပါ ပါဝင်တဲ့ Object တစ်ခုဆိုရင် _Invalid Package Configuration_ error တစ်ခုကို throw လုပ်ပါ။
> 2. _subpath_ က _"."_ နဲ့ ညီမျှရင် —
>    1. _mainExport_ ကို **undefined** အဖြစ် သတ်မှတ်ပါ။
>    2. _exports_ က String (သို့) Array (သို့) _"."_ နဲ့ စတင်တဲ့ key တွေ မပါဝင်တဲ့ Object တစ်ခုဆိုရင် —
>       1. _mainExport_ ကို _exports_ အဖြစ် သတ်မှတ်ပါ။
>    3. တခြားနည်းအားဖြင့် _exports_ က _"."_ property တစ်ခု ပါဝင်တဲ့ Object တစ်ခုဆိုရင် —
>       1. _mainExport_ ကို _exports_\[_"."_] အဖြစ် သတ်မှတ်ပါ။
>    4. _mainExport_ က **undefined** မဟုတ်ဘူးဆိုရင် —
>       1. **PACKAGE\_TARGET\_RESOLVE**(_packageURL_, _mainExport_, **null**, **false**, _conditions_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
>       2. _resolved_ က **null** (သို့) **undefined** မဟုတ်ဘူးဆိုရင် _resolved_ ကို ပြန်ပေးပါ။
> 3. တခြားနည်းအားဖြင့် _exports_ က Object တစ်ခု ဖြစ်ပြီး _exports_ ရဲ့ keys တွေ အားလုံး _"."_ နဲ့ စတင်နေရင် —
>    1. Assert: _subpath_ က _"./"_ နဲ့ စတင်ပါတယ်။
>    2. **PACKAGE\_IMPORTS\_EXPORTS\_RESOLVE**(_subpath_, _exports_, _packageURL_, **false**, _conditions_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
>    3. _resolved_ က **null** (သို့) **undefined** မဟုတ်ဘူးဆိုရင် _resolved_ ကို ပြန်ပေးပါ။
> 4. _Package Path Not Exported_ error တစ်ခုကို throw လုပ်ပါ။

**PACKAGE\_IMPORTS\_RESOLVE**(_specifier_, _parentURL_, _conditions_)

မှတ်ချက်: ဒီ function ကို CommonJS resolution algorithm ကနေ တိုက်ရိုက် ခေါ်ပါတယ်။

> 1. Assert: _specifier_ က _"#"_ နဲ့ စတင်ပါတယ်။
> 2. _specifier_ က _"#"_ နဲ့ အတိအကျ ညီမျှနေရင် —
>    1. _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
> 3. **LOOKUP\_PACKAGE\_SCOPE**(_parentURL_) ရဲ့ ရလဒ်ကို _packageURL_ အဖြစ် သတ်မှတ်ပါ။
> 4. _packageURL_ က **null** မဟုတ်ဘူးဆိုရင် —
>    1. **READ\_PACKAGE\_JSON**(_packageURL_) ရဲ့ ရလဒ်ကို _pjson_ အဖြစ် သတ်မှတ်ပါ။
>    2. _pjson.imports_ က non-null Object တစ်ခုဆိုရင် —
>       1. **PACKAGE\_IMPORTS\_EXPORTS\_RESOLVE**(_specifier_, _pjson.imports_, _packageURL_, **true**, _conditions_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
>       2. _resolved_ က **null** (သို့) **undefined** မဟုတ်ဘူးဆိုရင် _resolved_ ကို ပြန်ပေးပါ။
> 5. _Package Import Not Defined_ error တစ်ခုကို throw လုပ်ပါ။

**PACKAGE\_IMPORTS\_EXPORTS\_RESOLVE**(_matchKey_, _matchObj_, _packageURL_,
_isImports_, _conditions_)

> 1. _matchKey_ က _"/"_ နဲ့ အဆုံးသတ်နေရင် —
>    1. _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
> 2. _matchKey_ က _matchObj_ ရဲ့ key တစ်ခု ဖြစ်ပြီး _"\*"_ မပါဝင်ဘူးဆိုရင် —
>    1. _matchObj_\[_matchKey_] ရဲ့ တန်ဖိုးကို _target_ အဖြစ် သတ်မှတ်ပါ။
>    2. **PACKAGE\_TARGET\_RESOLVE**(_packageURL_, _target_, **null**, _isImports_, _conditions_) ရဲ့ ရလဒ်ကို ပြန်ပေးပါ။
> 3. သီးသန့်မှု (specificity) ၏ သက်ဆင်းစဉ် (descending order) အလိုက် စီပေးတဲ့ **PATTERN\_KEY\_COMPARE** sorting function အရ စီထားတဲ့ — _matchObj_ ထဲက _"\*"_ တစ်ခုတည်းပဲ ပါဝင်တဲ့ keys တွေရဲ့ စာရင်းကို _expansionKeys_ အဖြစ် သတ်မှတ်ပါ။
> 4. _expansionKeys_ ထဲက key _expansionKey_ တစ်ခုချင်းစီအတွက် —
>    1. ပထမဆုံး _"\*"_ character ကို မပါဝင်အောင် ဖယ်ထုတ်ထားတဲ့ _expansionKey_ ရဲ့ substring ကို _patternBase_ အဖြစ် သတ်မှတ်ပါ။
>    2. _matchKey_ က _patternBase_ နဲ့ စတင်ပြီး ၎င်းနဲ့ မညီမျှဘူးဆိုရင် —
>       1. ပထမဆုံး _"\*"_ character ရဲ့ နောက် index ကနေ စတင်တဲ့ _expansionKey_ ရဲ့ substring ကို _patternTrailer_ အဖြစ် သတ်မှတ်ပါ။
>       2. _patternTrailer_ ရဲ့ length က သုည ဖြစ်တာ (သို့) _matchKey_ က _patternTrailer_ နဲ့ အဆုံးသတ်ပြီး _matchKey_ ရဲ့ length က _expansionKey_ ရဲ့ length ထက် ကြီးတာ (သို့) ညီမျှနေရင် —
>          1. _matchObj_\[_expansionKey_] ရဲ့ တန်ဖိုးကို _target_ အဖြစ် သတ်မှတ်ပါ။
>          2. _patternBase_ ရဲ့ length အနေအထားကနေ စတင်ပြီး _matchKey_ ရဲ့ length ကနေ _patternTrailer_ ရဲ့ length ကို နုတ်ထားတဲ့ နေရာအထိ ရှိတဲ့ _matchKey_ ရဲ့ substring ကို _patternMatch_ အဖြစ် သတ်မှတ်ပါ။
>          3. **PACKAGE\_TARGET\_RESOLVE**(_packageURL_, _target_, _patternMatch_, _isImports_, _conditions_) ရဲ့ ရလဒ်ကို ပြန်ပေးပါ။
> 5. **null** ကို ပြန်ပေးပါ။

**PATTERN\_KEY\_COMPARE**(_keyA_, _keyB_)

> 1. Assert: _keyA_ ထဲမှာ _"\*"_ တစ်ခုတည်းပဲ ပါဝင်ပါတယ်။
> 2. Assert: _keyB_ ထဲမှာ _"\*"_ တစ်ခုတည်းပဲ ပါဝင်ပါတယ်။
> 3. _keyA_ ထဲက _"\*"_ ရဲ့ index ကို _baseLengthA_ အဖြစ် သတ်မှတ်ပါ။
> 4. _keyB_ ထဲက _"\*"_ ရဲ့ index ကို _baseLengthB_ အဖြစ် သတ်မှတ်ပါ။
> 5. _baseLengthA_ က _baseLengthB_ ထက် ကြီးရင် -1 ကို ပြန်ပေးပါ။
> 6. _baseLengthB_ က _baseLengthA_ ထက် ကြီးရင် 1 ကို ပြန်ပေးပါ။
> 7. _keyA_ ရဲ့ length က _keyB_ ရဲ့ length ထက် ကြီးရင် -1 ကို ပြန်ပေးပါ။
> 8. _keyB_ ရဲ့ length က _keyA_ ရဲ့ length ထက် ကြီးရင် 1 ကို ပြန်ပေးပါ။
> 9. 0 ကို ပြန်ပေးပါ။

**PACKAGE\_TARGET\_RESOLVE**(_packageURL_, _target_, _patternMatch_,
_isImports_, _conditions_)

> 1. _target_ က String တစ်ခုဆိုရင် —
>    1. _target_ က _"./"_ နဲ့ မစတင်ဘူးဆိုရင် —
>       1. _isImports_ က **false** ဖြစ်တာ (သို့) _target_ က _"../"_ (သို့) _"/"_ တွေနဲ့ စတင်တာ (သို့) _target_ က တရားဝင် (valid) URL တစ်ခု ဖြစ်နေရင် —
>          1. _Invalid Package Target_ error တစ်ခုကို throw လုပ်ပါ။
>       2. _patternMatch_ က String တစ်ခုဆိုရင် —
>          1. _"\*"_ တိုင်းကို _patternMatch_ နဲ့ အစားထိုးထားတဲ့ _target_ ကို _packageURL_ + _"/"_ နဲ့ တွဲပြီး **PACKAGE\_RESOLVE** လုပ်တဲ့ ရလဒ်ကို ပြန်ပေးပါ။
>       3. **PACKAGE\_RESOLVE**(_target_, _packageURL_ + _"/"_) ကို ပြန်ပေးပါ။
>    2. _"/"_ (သို့) _"\\"_ တွေပေါ်မှာ ခွဲထားတဲ့ _target_ ထဲမှာ ပထမဆုံး _"."_ segment ရဲ့ နောက်မှာ _""_, _"."_, _".."_, (သို့) _"node\_modules"_ segments တစ်ခုခု ပါဝင်နေရင် — case insensitive ဖြစ်ပြီး percent encoded variants တွေပါ အပါအဝင် — _Invalid Package Target_ error တစ်ခုကို throw လုပ်ပါ။
>    3. _packageURL_ နဲ့ _target_ ရဲ့ ပေါင်းစပ်မှုရဲ့ URL resolution ကို _resolvedTarget_ အဖြစ် သတ်မှတ်ပါ။
>    4. Assert: _packageURL_ က _resolvedTarget_ ထဲမှာ ပါဝင်ပါတယ်။
>    5. _patternMatch_ က **null** ဆိုရင် —
>       1. _resolvedTarget_ ကို ပြန်ပေးပါ။
>    6. _"/"_ (သို့) _"\\"_ တွေပေါ်မှာ ခွဲထားတဲ့ _patternMatch_ ထဲမှာ _""_, _"."_, _".."_, (သို့) _"node\_modules"_ segments တစ်ခုခု ပါဝင်နေရင် — case insensitive ဖြစ်ပြီး percent encoded variants တွေပါ အပါအဝင် — _Invalid Module Specifier_ error တစ်ခုကို throw လုပ်ပါ။
>    7. _"\*"_ တိုင်းကို _patternMatch_ နဲ့ အစားထိုးထားတဲ့ _resolvedTarget_ ရဲ့ URL resolution ကို ပြန်ပေးပါ။
> 2. တခြားနည်းအားဖြင့် _target_ က non-null Object တစ်ခုဆိုရင် —
>    1. _target_ ထဲမှာ ECMA-262 [6.1.7 Array Index][] မှာ သတ်မှတ်ထားတဲ့ index property keys တစ်ခုခု ပါဝင်နေရင် _Invalid Package Configuration_ error တစ်ခုကို throw လုပ်ပါ။
>    2. _target_ ရဲ့ property _p_ တစ်ခုချင်းစီအတွက် object insertion order အတိုင်း —
>       1. _p_ က _"default"_ နဲ့ ညီမျှတာ (သို့) _conditions_ ထဲမှာ _p_ အတွက် entry တစ်ခု ပါဝင်နေရင် —
>          1. _target_ ထဲက _p_ property ရဲ့ တန်ဖိုးကို _targetValue_ အဖြစ် သတ်မှတ်ပါ။
>          2. **PACKAGE\_TARGET\_RESOLVE**(_packageURL_, _targetValue_, _patternMatch_, _isImports_, _conditions_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
>          3. _resolved_ က **undefined** နဲ့ ညီမျှရင် loop ကို ဆက်လုပ်ပါ။
>          4. _resolved_ ကို ပြန်ပေးပါ။
>    3. **undefined** ကို ပြန်ပေးပါ။
> 3. တခြားနည်းအားဖြင့် _target_ က Array တစ်ခုဆိုရင် —
>    1. _target_ ၏ length က သုည ဆိုရင် **null** ကို ပြန်ပေးပါ။
>    2. _target_ ထဲက item _targetValue_ တစ်ခုချင်းစီအတွက် —
>       1. _Invalid Package Target_ error တစ်ခုခုပေါ်မှာ loop ကို ဆက်လုပ်ရင်း — **PACKAGE\_TARGET\_RESOLVE**(_packageURL_, _targetValue_, _patternMatch_, _isImports_, _conditions_) ရဲ့ ရလဒ်ကို _resolved_ အဖြစ် သတ်မှတ်ပါ။
>       2. _resolved_ က **undefined** ဆိုရင် loop ကို ဆက်လုပ်ပါ။
>       3. _resolved_ ကို ပြန်ပေးပါ။
>    3. နောက်ဆုံး fallback resolution ဖြစ်တဲ့ **null** return (သို့) error ကို ပြန်ပေး (သို့) throw လုပ်ပါ။
> 4. တခြားနည်းအားဖြင့် _target_ က _null_ ဆိုရင် **null** ကို ပြန်ပေးပါ။
> 5. တခြားနည်းအားဖြင့် _Invalid Package Target_ error တစ်ခုကို throw လုပ်ပါ။

**ESM\_FILE\_FORMAT**(_url_)

> 1. Assert: _url_ က တည်ရှိနေတဲ့ file တစ်ခုနဲ့ ကိုက်ညီပါတယ်။
> 2. _url_ က _".mjs"_ နဲ့ အဆုံးသတ်ရင် —
>    1. _"module"_ ကို ပြန်ပေးပါ။
> 3. _url_ က _".cjs"_ နဲ့ အဆုံးသတ်ရင် —
>    1. _"commonjs"_ ကို ပြန်ပေးပါ။
> 4. _url_ က _".json"_ နဲ့ အဆုံးသတ်ရင် —
>    1. _"json"_ ကို ပြန်ပေးပါ။
> 5. _url_ က _".wasm"_ နဲ့ အဆုံးသတ်ရင် —
>    1. _"wasm"_ ကို ပြန်ပေးပါ။
> 6. `--experimental-addon-modules` ကို enable လုပ်ထားပြီး _url_ က _".node"_ နဲ့ အဆုံးသတ်ရင် —
>    1. _"addon"_ ကို ပြန်ပေးပါ။
> 7. **LOOKUP\_PACKAGE\_SCOPE**(_url_) ရဲ့ ရလဒ်ကို _packageURL_ အဖြစ် သတ်မှတ်ပါ။
> 8. **READ\_PACKAGE\_JSON**(_packageURL_) ရဲ့ ရလဒ်ကို _pjson_ အဖြစ် သတ်မှတ်ပါ။
> 9. _packageType_ ကို **null** အဖြစ် သတ်မှတ်ပါ။
> 10. _pjson?.type_ က _"module"_ (သို့) _"commonjs"_ ဖြစ်နေရင် —
>     1. _packageType_ ကို _pjson.type_ အဖြစ် သတ်မှတ်ပါ။
> 11. _url_ က _".js"_ နဲ့ အဆုံးသတ်ရင် —
>     1. _packageType_ က **null** မဟုတ်ဘူးဆိုရင် —
>        1. _packageType_ ကို ပြန်ပေးပါ။
>     2. **DETECT\_MODULE\_SYNTAX**(_source_) ရဲ့ ရလဒ်က true ဆိုရင် —
>        1. _"module"_ ကို ပြန်ပေးပါ။
>     3. _"commonjs"_ ကို ပြန်ပေးပါ။
> 12. _url_ မှာ extension တစ်ခုမှ မရှိဘူးဆိုရင် —
>     1. _packageType_ က _"module"_ ဖြစ်ပြီး _url_ မှာ ရှိတဲ့ file က WebAssembly module တစ်ခုအတွက် "application/wasm" content type header ပါဝင်နေရင် —
>        1. _"wasm"_ ကို ပြန်ပေးပါ။
>     2. _packageType_ က **null** မဟုတ်ဘူးဆိုရင် —
>        1. _packageType_ ကို ပြန်ပေးပါ။
>     3. **DETECT\_MODULE\_SYNTAX**(_source_) ရဲ့ ရလဒ်က true ဆိုရင် —
>        1. _"module"_ ကို ပြန်ပေးပါ။
>     4. _"commonjs"_ ကို ပြန်ပေးပါ။
> 13. **undefined** ကို ပြန်ပေးပါ (load phase အတွင်းမှာ throw ဖြစ်ပါလိမ့်မယ်)။

**LOOKUP\_PACKAGE\_SCOPE**(_url_)

> 1. _scopeURL_ ကို _url_ အဖြစ် သတ်မှတ်ပါ။
> 2. _scopeURL_ က file system root မဟုတ်သေးသရွေ့ —
>    1. _scopeURL_ ကို _scopeURL_ ရဲ့ parent URL အဖြစ် သတ်မှတ်ပါ။
>    2. _scopeURL_ က _"node\_modules"_ path segment တစ်ခုနဲ့ အဆုံးသတ်နေရင် **null** ကို ပြန်ပေးပါ။
>    3. _scopeURL_ အတွင်းမှာ _"package.json"_ ရဲ့ resolution ကို _pjsonURL_ အဖြစ် သတ်မှတ်ပါ။
>    4. _pjsonURL_ မှာ ရှိတဲ့ file က ရှိနေရင် —
>       1. _scopeURL_ ကို ပြန်ပေးပါ။
> 3. **null** ကို ပြန်ပေးပါ။

**READ\_PACKAGE\_JSON**(_packageURL_)

> 1. _packageURL_ အတွင်းမှာ _"package.json"_ ရဲ့ resolution ကို _pjsonURL_ အဖြစ် သတ်မှတ်ပါ။
> 2. _pjsonURL_ မှာ ရှိတဲ့ file က မရှိဘူးဆိုရင် —
>    1. **null** ကို ပြန်ပေးပါ။
> 3. _packageURL_ မှာ ရှိတဲ့ file က valid JSON အဖြစ် parse မလုပ်နိုင်ဘူးဆိုရင် —
>    1. _Invalid Package Configuration_ error တစ်ခုကို throw လုပ်ပါ။
> 4. _pjsonURL_ မှာ ရှိတဲ့ file ရဲ့ parsed JSON source ကို ပြန်ပေးပါ။

**DETECT\_MODULE\_SYNTAX**(_source_)

> 1. _source_ ကို ECMAScript module တစ်ခုအနေနဲ့ parse လုပ်ပါ။
> 2. Parse လုပ်တာ အောင်မြင်ရင် —
>    1. _source_ ထဲမှာ top-level `await`၊ static `import` (သို့) `export` statements တွေ (သို့) `import.meta` ပါဝင်နေရင် **true** ကို ပြန်ပေးပါ။
>    2. _source_ ထဲမှာ CommonJS wrapper variables တွေ (`require`, `exports`, `module`, `__filename`, (သို့) `__dirname`) ထဲက တစ်ခုခုရဲ့ top-level lexical declaration (`const`, `let`, (သို့) `class`) တစ်ခု ပါဝင်နေရင် **true** ကို ပြန်ပေးပါ။
> 3. **false** ကို ပြန်ပေးပါ။

### ESM specifier resolution algorithm ကို စိတ်ကြိုက် ပြင်ဆင်ခြင်း (Customizing ESM specifier resolution algorithm)

[Module customization hooks][] တွေက ESM specifier resolution algorithm ကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ mechanism တစ်ခုကို ထောက်ပံ့ပေးပါတယ်။ ESM specifiers တွေအတွက် CommonJS-style resolution ကို ထောက်ပံ့ပေးတဲ့ ဥပမာတစ်ခုကတော့ [commonjs-extension-resolution-loader][] ပါ။

[6.1.7 Array Index]: https://tc39.es/ecma262/#integer-index
[Addons]: addons.md
[Built-in modules]: modules.md#built-in-modules
[CommonJS]: modules.md
[Determining module system]: packages.md#determining-module-system
[Dynamic `import()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[ES Module Integration Proposal for WebAssembly]: https://github.com/webassembly/esm-integration
[Import Attributes]: #import-attributes
[Import Attributes MDN]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with
[JSON modules]: #json-modules
[Loading ECMAScript modules using `require()`]: modules.md#loading-ecmascript-modules-using-require
[Module customization hooks]: module.md#customization-hooks
[Node.js Module Resolution And Loading Algorithm]: #resolution-algorithm-specification
[Package maps]: packages.md#package-maps
[Source Phase Imports]: https://github.com/tc39/proposal-source-phase-imports
[Terminology]: #terminology
[Text modules]: #text-modules
[URL]: https://url.spec.whatwg.org/
[WebAssembly JS String Builtins Proposal]: https://github.com/WebAssembly/js-string-builtins
[`"exports"`]: packages.md#exports
[`"type"`]: packages.md#type
[`--experimental-package-map`]: cli.md#--experimental-package-mappath
[`--input-type`]: cli.md#--input-typetype
[`data:` URLs]: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
[`export`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
[`import()`]: #import-expressions
[`import.meta.dirname`]: #importmetadirname
[`import.meta.filename`]: #importmetafilename
[`import.meta.main`]: #importmetamain
[`import.meta.resolve`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve
[`import.meta.url`]: #importmetaurl
[`import`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[`module.createRequire()`]: module.md#modulecreaterequirefilename
[`module.syncBuiltinESMExports()`]: module.md#modulesyncbuiltinesmexports
[`package.json`]: packages.md#nodejs-packagejson-field-definitions
[`path.dirname()`]: path.md#pathdirnamepath
[`process.dlopen`]: process.md#processdlopenmodule-filename-flags
[`require(esm)`]: modules.md#loading-ecmascript-modules-using-require
[`url.fileURLToPath()`]: url.md#urlfileurltopathurl-options
[commonjs-extension-resolution-loader]: https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader
[custom https loader]: module.md#import-from-https
[import.meta.resolve]: #importmetaresolvespecifier
[merve]: https://github.com/anonrig/merve/tree/v1.0.0
[percent-encoded]: url.md#percent-encoding-in-urls
[special scheme]: https://url.spec.whatwg.org/#special-scheme
[status code]: process.md#exit-codes
[the official standard format]: https://tc39.github.io/ecma262/#sec-modules
[url.pathToFileURL]: url.md#urlpathtofileurlpath-options
