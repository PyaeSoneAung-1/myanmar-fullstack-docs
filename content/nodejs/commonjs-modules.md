---
title: "Modules: CommonJS modules"
description: "CommonJS modules စနစ် အပြည့်အစုံ — module wrapper, module.exports/require(), resolution algorithm, folders as modules, module caching, __dirname/__filename, circular dependencies စသည်"
order: 143
source: "https://nodejs.org/api/modules.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

CommonJS modules တွေက Node.js အတွက် JavaScript code တွေကို ထုပ်ပိုးဖို့ (package) မူရင်း နည်းလမ်း ဖြစ်ပါတယ်။ Node.js က browser တွေနဲ့ တခြား JavaScript runtimes တွေမှာ သုံးတဲ့ [ECMAScript modules][] standard ကိုလည်း ပံ့ပိုးပေးပါတယ်။

Node.js မှာ file တိုင်းကို သီးခြား module တစ်ခုအနေနဲ့ သတ်မှတ်ပါတယ်။ ဥပမာ — `foo.js` ဆိုတဲ့ file တစ်ခုကို စဉ်းစားကြည့်ရအောင်:

```js
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
```

ပထမဆုံး စာကြောင်းမှာ `foo.js` က `foo.js` နဲ့ directory တစ်ခုတည်းမှာ ရှိနေတဲ့ `circle.js` module ကို load လုပ်ပါတယ်။

`circle.js` ရဲ့ အကြောင်းအရာတွေကတော့ အောက်မှာ ပြထားပါတယ်:

```js
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

`circle.js` module က `area()` နဲ့ `circumference()` function တွေကို export လုပ်ထားပါတယ်။ Functions တွေနဲ့ objects တွေကို module ရဲ့ root မှာ ထည့်သွင်းဖို့အတွက် အထူး `exports` object ပေါ်မှာ properties အပိုတွေကို သတ်မှတ်ပေးရပါတယ်။

Module ထဲမှာပဲ ရှိတဲ့ variables တွေက private ဖြစ်ပါတယ် — Node.js က module ကို function တစ်ခုထဲမှာ wrap လုပ်ထားလို့ပါ ([module wrapper](#the-module-wrapper) ကို ကြည့်ပါ)။ ဒီဥပမာမှာ `PI` variable က `circle.js` အတွက်သာ private ဖြစ်ပါတယ်။

`module.exports` property ကို တန်ဖိုးအသစ် (function တစ်ခု သို့မဟုတ် object တစ်ခုလိုမျိုး) နဲ့ assign လုပ်လို့ ရပါတယ်။

အောက်က code မှာ `bar.js` က Square class တစ်ခုကို export လုပ်တဲ့ `square` module ကို အသုံးပြုပါတယ်:

```js
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`The area of mySquare is ${mySquare.area()}`);
```

`square` module ကို `square.js` မှာ သတ်မှတ်ထားပါတယ်:

```js
// Assigning to exports will not modify module, must use module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```

CommonJS module system ကို [`module` core module][] မှာ implement လုပ်ထားပါတယ်။

## Enable လုပ်ခြင်း (Enabling)

Node.js မှာ module system နှစ်မျိုး ရှိပါတယ်: CommonJS modules နဲ့ [ECMAScript modules][] တို့ပဲ ဖြစ်ပါတယ်။

Default အနေနဲ့ Node.js က အောက်ပါတို့ကို CommonJS modules အဖြစ် သတ်မှတ်ပါတယ်:

* `.cjs` extension ရှိတဲ့ files တွေ။

* `.js` extension ရှိတဲ့ သို့မဟုတ် extension မရှိတဲ့ files တွေ — အနီးဆုံး parent `package.json` file မှာ top-level field [`"type"`][] ရဲ့ တန်ဖိုး `"commonjs"` နဲ့ ပါဝင်နေရင်။

* `.js` extension ရှိတဲ့ သို့မဟုတ် extension မရှိတဲ့ files တွေ — အနီးဆုံး parent `package.json` file မှာ top-level field [`"type"`][] မပါရင် ဒါမှမဟုတ် parent folder တွေထဲမှာ `package.json` လုံးဝ မရှိရင်; ဒါပေမယ့် အဲဒီ file ရဲ့ syntax က ES module အနေနဲ့သာ evaluate လုပ်လို့ရတဲ့ syntax ဖြစ်နေရင်တော့ မဟုတ်ပါဘူး။ Package authors တွေက source တွေ အားလုံး CommonJS ဖြစ်တဲ့ packages တွေမှာတောင် [`"type"`][] field ကို ထည့်သွင်းသင့်ပါတယ်။ Package ရဲ့ `type` ကို တိတိကျကျ ဖော်ပြထားခြင်းက build tools တွေနဲ့ loaders တွေအတွက် package ထဲက files တွေကို ဘယ်လို အနက်ပြန်ရမလဲ ဆုံးဖြတ်ရတာ ပိုလွယ်ကူစေပါတယ်။

* `.mjs`, `.cjs`, `.json`, `.node` (သို့) `.js` မဟုတ်တဲ့ extension တစ်ခုခု ရှိတဲ့ files တွေ — အနီးဆုံး parent `package.json` file မှာ top-level field [`"type"`][] ရဲ့ တန်ဖိုး `"module"` နဲ့ ပါဝင်နေရင်။

အသေးစိတ် အချက်အလက်တွေအတွက် [Determining module system][] ကို ကြည့်ပါ။

`require()` ကို ခေါ်တာက CommonJS module loader ကို အမြဲတမ်း အသုံးပြုပါတယ်။ `import()` ကို ခေါ်တာကလည်း ECMAScript module loader ကို အမြဲတမ်း အသုံးပြုပါတယ်။

## Main module ကို ဝင်ရောက်ခြင်း (Accessing the main module)

File တစ်ခုကို Node.js ကနေ တိုက်ရိုက် run လုပ်တဲ့အခါ `require.main` ကို အဲဒီ file ရဲ့ `module` နဲ့ သတ်မှတ်ပေးပါတယ်။ ဒါကြောင့် — `require.main === module` ဆိုတာ စစ်ဆေးကြည့်ခြင်းအားဖြင့် file တစ်ခုကို တိုက်ရိုက် run လုပ်ထားလားဆိုတာ ဆုံးဖြတ်နိုင်ပါတယ်။

`foo.js` file အတွက်ဆိုရင် — `node foo.js` နဲ့ run လုပ်ရင် `true` ဖြစ်ပြီး — `require('./foo')` ကနေ run လုပ်ရင်တော့ `false` ဖြစ်ပါတယ်။

Entry point က CommonJS module မဟုတ်တဲ့အခါ `require.main` က `undefined` ဖြစ်ပြီး — main module ကို လက်လှမ်း မမှီနိုင်တော့ပါဘူး။

## Package manager များအတွက် အကြံပြုချက်များ (Package manager tips)

Node.js ရဲ့ `require()` function ရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက်တွေ (semantics) ကို သင့်တင့်လျောက်ပတ်တဲ့ directory structures တွေကို ထောက်ပံ့နိုင်လောက်အောင် ယေဘုယျကျတဲ့ ပုံစံနဲ့ ဒီဇိုင်းထုတ်ထားပါတယ်။ `dpkg`, `rpm`, `npm` လိုမျိုး package manager program တွေက Node.js modules တွေကနေ ပြုပြင်မွမ်းမံစရာ မလိုပဲ native packages တွေ တည်ဆောက်နိုင်ဖို့ မျှော်လင့်ရပါတယ်။

အောက်မှာ အလုပ်ဖြစ်နိုင်တဲ့ directory structure တစ်ခုကို အကြံပြုပေးထားပါတယ်:

`/usr/lib/node//` ဆိုတဲ့ folder ထဲမှာ package တစ်ခုရဲ့ version တစ်ခုရဲ့ အကြောင်းအရာတွေ ထားရှိချင်တယ်ဆိုပါစို့။

Packages တွေက တစ်ခုနဲ့ တစ်ခု မှီခိုနိုင်ပါတယ်။ `foo` package ကို install လုပ်ဖို့ `bar` package ရဲ့ version တစ်ခုကို install လုပ်ရန် လိုအပ်နိုင်ပါတယ်။ `bar` package ကိုယ်တိုင်မှာလည်း dependencies တွေ ရှိနိုင်ပြီး — တချို့ကိစ္စတွေမှာ ဒါတွေက ပဋိပက္ခ ဖြစ်နိုင်သလို cyclic dependencies တွေတောင် ဖြစ်သွားနိုင်ပါတယ်။

Node.js က load လုပ်တဲ့ modules တိုင်းရဲ့ `realpath` ကို ရှာဖွေပြီး (ဆိုလိုတာက symlinks တွေကို resolve လုပ်တာပါ) — နောက် [`node_modules` folders တွေထဲမှာ သူတို့ရဲ့ dependencies တွေကို ရှာတယ်](#loading-from-node_modules-folders) — ဒါကြောင့် ဒီအခြေအနေကို အောက်ပါ architecture နဲ့ ဖြေရှင်းနိုင်ပါတယ်:

* `/usr/lib/node/foo/1.2.3/`: `foo` package (version 1.2.3) ရဲ့ အကြောင်းအရာများ။
* `/usr/lib/node/bar/4.3.2/`: `foo` က မှီခိုနေတဲ့ `bar` package ရဲ့ အကြောင်းအရာများ။
* `/usr/lib/node/foo/1.2.3/node_modules/bar`: `/usr/lib/node/bar/4.3.2/` ကို ညွှန်တဲ့ symbolic link တစ်ခု။
* `/usr/lib/node/bar/4.3.2/node_modules/*`: `bar` က မှီခိုနေတဲ့ packages တွေကို ညွှန်တဲ့ symbolic links များ။

ဒါကြောင့် — cycle တစ်ခုကို ကြုံရတာပဲ ဖြစ်ဖြစ်၊ dependency conflicts တွေ ရှိနေတာပဲ ဖြစ်ဖြစ် — module တိုင်းက သူ့ရဲ့ သုံးလို့ရတဲ့ dependency version တစ်ခုကို ရရှိမှာ ဖြစ်ပါတယ်။

`foo` package ထဲက code က `require('bar')` လုပ်တဲ့အခါ — `/usr/lib/node/foo/1.2.3/node_modules/bar` ထဲကို symlink လုပ်ထားတဲ့ version ကို ရရှိပါတယ်။ ပြီးတော့ `bar` package ထဲက code က `require('quux')` ကို ခေါ်တဲ့အခါ — `/usr/lib/node/bar/4.3.2/node_modules/quux` ထဲကို symlink လုပ်ထားတဲ့ version ကို ရရှိပါတယ်။

ဒါ့အပြင် module lookup process ကို ပိုပြီး အကောင်းဆုံး ဖြစ်စေဖို့ — packages တွေကို `/usr/lib/node` ထဲမှာ တိုက်ရိုက် မထားပဲ `/usr/lib/node_modules/<name>/<version>` ထဲမှာ ထားနိုင်ပါတယ်။ ဒါဆိုရင် Node.js က `/usr/node_modules` ဒါမှမဟုတ် `/node_modules` ထဲမှာ ပျောက်နေတဲ့ dependencies တွေကို ရှာဖို့ မလိုတော့ပါဘူး။

Modules တွေကို Node.js REPL မှာလည်း ရရှိနိုင်စေဖို့ `/usr/lib/node_modules` folder ကို `$NODE_PATH` environment variable ထဲကို ထပ်ထည့်တာက အသုံးဝင်ပါလိမ့်မယ်။ `node_modules` folders တွေကို သုံးတဲ့ module lookups တွေက အားလုံး relative ဖြစ်ပြီး — `require()` ကို ခေါ်တဲ့ files တွေရဲ့ real path ကို အခြေခံတာမို့ — packages တွေကိုယ်တိုင်ကတော့ ဘယ်နေရာမှာမဆို ရှိနေနိုင်ပါတယ်။

## Loading ECMAScript modules using `require()`

`.mjs` extension က [ECMAScript Modules][] အတွက် သီးသန့် သတ်မှတ်ထားပါတယ်။ ဘယ် files တွေကို ECMAScript modules အဖြစ် parse လုပ်လဲဆိုတဲ့ အသေးစိတ်အတွက် [Determining module system][] section ကို ကြည့်ပါ။

`require()` က အောက်ပါ အချက်တွေနဲ့ ကိုက်ညီတဲ့ ECMAScript modules တွေကိုသာ load လုပ်ဖို့ ပံ့ပိုးပေးပါတယ်:

* Module က အပြည့်အဝ synchronous ဖြစ်ရမယ် (top-level `await` မပါဝင်ရဘူး); ပြီးတော့
* အောက်ပါ အခြေအနေတွေထဲက တစ်ခု ကိုက်ညီရမယ်:
  1. File မှာ `.mjs` extension ရှိရမယ်။
  2. File မှာ `.js` extension ရှိပြီး အနီးဆုံး `package.json` မှာ `"type": "module"` ပါဝင်နေရမယ်။
  3. File မှာ `.js` extension ရှိပြီး အနီးဆုံး `package.json` မှာ `"type": "commonjs"` မပါဝင်ဘဲ — module ထဲမှာ ES module syntax ပါဝင်နေရမယ်။

Load လုပ်နေတဲ့ ES Module က အဲဒီ အချက်တွေနဲ့ ကိုက်ညီမယ်ဆိုရင် — `require()` က အဲဒါကို load လုပ်ပြီး [module namespace object][] ကို ပြန်ပေးနိုင်ပါတယ်။ ဒီကိစ္စမှာ ဒါက dynamic `import()` နဲ့ ဆင်တူပေမယ့် — synchronously run လုပ်ပြီး namespace object ကို တိုက်ရိုက် ပြန်ပေးပါတယ်။

အောက်ပါ ES Modules တွေနဲ့ ဆိုရင်:

```mjs
// distance.mjs
export function distance(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }
```

```mjs
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```

CommonJS module တစ်ခုက သူတို့ကို `require()` နဲ့ load လုပ်နိုင်ပါတယ်:

```cjs
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```

ES Modules တွေကို CommonJS အဖြစ် ပြောင်းပေးတဲ့ ရှိပြီးသား tools တွေနဲ့ အပြန်အလှန် လိုက်ဖက်ညီမှု အတွက် — အဲဒီ tools တွေက နောက်ပိုင်းမှာ တကယ့် ES Modules တွေကို `require()` ကတစ်ဆင့် load လုပ်နိုင်တယ် — ပြန်ပေးတဲ့ namespace မှာ `default` export ရှိရင် `__esModule: true` property ပါဝင်မှာ ဖြစ်ပါတယ်။ ဒါမှ tools တွေက ထုတ်လုပ်ထားတဲ့ consuming code တွေက တကယ့် ES Modules တွေထဲက default exports တွေကို မှတ်မိနိုင်မှာပါ။ Namespace ထဲမှာ `__esModule` အရင်ကတည်းက ရှိနေရင်တော့ ထပ်ဖြည့်ပေးမှာ မဟုတ်ပါဘူး။ ဒီ property က experimental ဖြစ်ပြီး နောင်မှာ ပြောင်းလဲနိုင်ပါတယ်။ ဒါကို ရှိပြီးသား ecosystem conventions တွေအတိုင်း — ES modules တွေကို CommonJS modules အဖြစ် ပြောင်းတဲ့ tools တွေကသာ သုံးသင့်ပါတယ်။ CommonJS နဲ့ တိုက်ရိုက် ရေးထားတဲ့ code တွေက ဒါအပေါ် မှီခိုတာကို ရှောင်ရှားသင့်ပါတယ်။

`require()` က ပြန်ပေးတဲ့ ရလဒ်က [module namespace object][] ဖြစ်ပြီး — `import()` က ပြန်ပေးတဲ့ ရလဒ်တွေလိုပဲ default export ကို `.default` property ထဲမှာ နေရာချပေးပါတယ်။ `require(esm)` က ဘာကို ပြန်ပေးမလဲဆိုတာကို တိုက်ရိုက် စိတ်ကြိုက် ပြင်ဆင်ချင်ရင် — ES Module က လိုချင်တဲ့ တန်ဖိုးကို `"module.exports"` ဆိုတဲ့ string နာမည်နဲ့ export လုပ်နိုင်ပါတယ်။

```mjs
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` is lost to CommonJS consumers of this module, unless it's
// added to `Point` as a static property.
export function distance(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }
export { Point as 'module.exports' };
```

```cjs
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Named exports are lost when 'module.exports' is used
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```

အထက်က ဥပမာမှာ သတိထားစရာ — `module.exports` export နာမည်ကို သုံးလိုက်တဲ့အခါ named exports တွေက CommonJS consumers တွေအတွက် ပျောက်ဆုံးသွားပါတယ်။ CommonJS consumers တွေ named exports တွေကို ဆက်လက် ဝင်ရောက်သုံးနိုင်စေဖို့ — module က default export ကို named exports တွေ properties အဖြစ် တွဲထားတဲ့ object တစ်ခု ဖြစ်အောင် သေချာစေနိုင်ပါတယ်။ ဥပမာ အထက်က ဥပမာမှာ `distance` ကို default export ဖြစ်တဲ့ `Point` class ရဲ့ static method တစ်ခုအနေနဲ့ တွဲထည့်နိုင်ပါတယ်။

```mjs
export function distance(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' };
```

```cjs
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```

`require()` လုပ်ခံရတဲ့ module ထဲမှာ top-level `await` ပါနေရင် ဒါမှမဟုတ် အဲဒါက `import` လုပ်တဲ့ module graph ထဲမှာ top-level `await` ပါနေရင် — [`ERR_REQUIRE_ASYNC_MODULE`][] ကို throw လုပ်ပါလိမ့်မယ်။ ဒီလိုကိစ္စမျိုးမှာ user တွေက asynchronous module ကို [`import()`][] နဲ့ load လုပ်သင့်ပါတယ်။

`--experimental-print-required-tla` ကို enable လုပ်ထားပြီး error ကို ဖမ်းယူမထားဘူးဆိုရင် — Node.js က `require()` လုပ်ခံရတဲ့ module graph ထဲက top-level `await` တွေကို ရှာဖွေပြီး အဲဒီ နေရာတွေကို stderr မှာ ပုံနှိပ်ထုတ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

`require()` ကို သုံးပြီး ES modules load လုပ်တာကို ပံ့ပိုးပေးခြင်းက မမျှော်လင့်ထားတဲ့ ပျက်စီးမှုတွေ ဖြစ်စေရင် — `--no-require-module` ကို သုံးပြီး ဒီ feature ကို disable လုပ်နိုင်ပါတယ်။ ဒီ feature ကို ဘယ်နေရာတွေမှာ သုံးနေလဲ ပုံနှိပ်ဖို့ [`--trace-require-module`][] ကို သုံးပါ။

ဒီ feature ရှိမရှိကို [`process.features.require_module`][] က `true` ဟုတ်မဟုတ် စစ်ဆေးခြင်းအားဖြင့် သိရှိနိုင်ပါတယ်။

## အားလုံး ပေါင်းစပ်ကြည့်ခြင်း (All together)

`require()` ကို ခေါ်တဲ့အခါ load လုပ်မယ့် တိကျတဲ့ filename ကို ရယူဖို့ `require.resolve()` function ကို သုံးပါ။

အထက်ပါ အချက်အားလုံးကို ပေါင်းစပ်လိုက်ရင် — `require()` က ဘာတွေ လုပ်ဆောင်လဲဆိုတဲ့ high-level algorithm ကို pseudocode နဲ့ အောက်မှာ ဖော်ပြထားပါတယ်:

```text
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with '/'
   a. set Y to the file system root
3. If X is equal to '.', or X begins with './', '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. THROW "not found"
4. If X begins with '#'
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. If a package map PACKAGE_MAP exists,
   a. Find the package ID for the package owning Y
        1. Let PARENT_PACKAGE_ID be FIND_PACKAGE_ID(dirname(Y), PACKAGE_MAP)
   b. LOAD_PACKAGE_MAP(X, PARENT_PACKAGE_ID, PACKAGE_MAP)
7. LOAD_NODE_MODULES(X, dirname(Y))
8. THROW "not found"

MAYBE_DETECT_AND_LOAD(X)
1. If X parses as a CommonJS module, load X as a CommonJS module. STOP.
2. Else, if the source code of X can be parsed as ECMAScript module using
  DETECT_MODULE_SYNTAX defined in the ESM resolver,
  a. Load X as an ECMAScript module. STOP.
3. THROW the SyntaxError from attempting to parse X as CommonJS in 1. STOP.

LOAD_AS_FILE(X)
1. If X is a file, load X as its file extension format. STOP
2. If X.js is a file,
    a. Find the closest package scope SCOPE to X.
    b. If no scope was found
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. If the SCOPE/package.json contains "type" field,
      1. If the "type" field is "module", load X.js as an ECMAScript module. STOP.
      2. If the "type" field is "commonjs", load X.js as a CommonJS module. STOP.
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. If X.json is a file, load X.json to a JavaScript Object. STOP
4. If X.node is a file, load X.node as binary addon. STOP

LOAD_INDEX(X)
1. If X/index.js is a file
    a. Find the closest package scope SCOPE to X.
    b. If no scope was found, load X/index.js as a CommonJS module. STOP.
    c. If the SCOPE/package.json contains "type" field,
      1. If the "type" field is "module", load X/index.js as an ECMAScript module. STOP.
      2. Else, load X/index.js as a CommonJS module. STOP.
2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
3. If X/index.node is a file, load X/index.node as binary addon. STOP

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. If "main" is a falsy value, GOTO 2.
   c. let M = X + (json main field)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) DEPRECATED
   g. THROW "not found"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. Try to interpret X as a combination of NAME and SUBPATH where the name
   may have a @scope/ prefix and the subpath begins with a slash (`/`).
2. let DIRS = NODE_MODULES_PATHS(START)
3. for each DIR in DIRS:
   a. LOAD_PACKAGE_EXPORTS(SUBPATH, DIR/NAME)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules", GOTO d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS + GLOBAL_FOLDERS

FIND_PACKAGE_ID(PATH, PACKAGE_MAP)
1. Find the PACKAGE_ID for the entry whose "path" is a parent directory of PATH
2. If multiple entries are found, THROW "ambiguous resolution"
3. If no entry was found, THROW "external file".
4. return PACKAGE_ID

LOAD_PACKAGE_MAP(X, PARENT_PACKAGE_ID, PACKAGE_MAP)
1. Try to interpret X as a combination of NAME and SUBPATH where the name
   may have a @scope/ prefix and the subpath begins with a slash (`/`).
2. Find the package map entry for key PARENT_PACKAGE_ID
3. Look up NAME in the entry's "dependencies" map.
4. If NAME is not found, THROW "not found".
5. Let TARGET be PACKAGE_MAP.packages[dependencies[name]]
6. Let PACKAGE_PATH be the resolved path of TARGET.
7. LOAD_PACKAGE_EXPORTS(SUBPATH, PACKAGE_PATH)
8. LOAD_AS_FILE(PACKAGE_PATH/SUBPATH)
9. LOAD_AS_DIRECTORY(PACKAGE_PATH/SUBPATH)
10. THROW "not found"

LOAD_PACKAGE_IMPORTS(X, DIR)
1. Find the closest package scope SCOPE to DIR.
2. If no scope was found, return.
3. If the SCOPE/package.json "imports" is null or undefined, return.
4. If `--no-require-module` is not enabled
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. Else, let CONDITIONS = ["node", "require"]
5. let MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) defined in the ESM resolver.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(SUBPATH, PACKAGE_DIR)
1. Parse PACKAGE_DIR/package.json, and look for "exports" field.
2. If "exports" is null or undefined, return.
3. If `--no-require-module` is not enabled
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. Else, let CONDITIONS = ["node", "require"]
4. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(PACKAGE_DIR), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) defined in the ESM resolver.
5. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. Find the closest package scope SCOPE to DIR.
2. If no scope was found, return.
3. If the SCOPE/package.json "exports" is null or undefined, return.
4. If the SCOPE/package.json "name" is not the first segment of X, return.
5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   defined in the ESM resolver.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. let RESOLVED_PATH = fileURLToPath(MATCH)
2. If the file at RESOLVED_PATH exists, load RESOLVED_PATH as its extension
   format. STOP
3. THROW "not found"
```

"ESM resolver" ကို [ESM documentation](https://nodejs.org/api/esm.html#resolution-and-loading-algorithm) ထဲမှာ သတ်မှတ်ဖော်ပြထားပါတယ်။

## Cache လုပ်ခြင်း (Caching)

Modules တွေကို ပထမဆုံး အကြိမ် load ပြီးချိန်မှာ cache လုပ်ပါတယ်။ ဒါက (တခြား အချက်တွေကြားမှာ) — `require('foo')` ကို ခေါ်တိုင်း file တစ်ခုတည်းဆီ resolve ဖြစ်မယ်ဆိုရင် object အတိအကျ တစ်ခုတည်းကိုပဲ ပြန်ရမယ်ဆိုတာကို ဆိုလိုပါတယ်။

`require.cache` ကို ပြုပြင်မွမ်းမံမထားဘူးဆိုရင် — `require('foo')` ကို အကြိမ်များစွာ ခေါ်တာတောင် module code ကို အကြိမ်များစွာ run ဖြစ်စေမှာ မဟုတ်ပါဘူး။ ဒါက အရေးကြီးတဲ့ feature တစ်ခုပါ။ ဒါနဲ့အတူ — "partially done" (တစ်စိတ်တစ်ပိုင်း ပြီးစီးနေတဲ့) objects တွေကို ပြန်ပေးနိုင်တာမို့ cycles တွေ ဖြစ်စေမယ့်အခါမှာတောင် transitive dependencies တွေကို load လုပ်နိုင်ပါတယ်။

Module တစ်ခုရဲ့ code ကို အကြိမ်များစွာ run စေချင်ရင် — function တစ်ခုကို export လုပ်ပြီး အဲဒီ function ကို ခေါ်ပါ။

### Module caching ၏ သတိထားစရာများ (Module caching caveats)

Modules တွေကို သူတို့ရဲ့ resolved filename ပေါ် အခြေခံပြီး cache လုပ်ပါတယ်။ Modules တွေက ခေါ်တဲ့ module ရဲ့ တည်နေရာပေါ် မူတည်ပြီး filename မတူတာတွေဆီ resolve ဖြစ်နိုင်တာမို့ (`node_modules` folders တွေကနေ loading လုပ်တာမျိုး) — files မတူတာတွေဆီ resolve ဖြစ်သွားရင် `require('foo')` က object အတိအကျ တူတူကိုပဲ အမြဲတမ်း ပြန်ပေးမယ်ဆိုတဲ့ _guarantee_ (အာမခံချက်) မရှိပါဘူး။

ဒါ့အပြင် — case-insensitive (စာလုံးအကြီးအငယ် ခွဲခြားမှု မရှိတဲ့) file systems (သို့) operating systems တွေမှာ resolve လုပ်ပြီးသား filenames မတူညီတာတွေက file တစ်ခုတည်းကို ညွှန်နိုင်ပေမယ့် — cache ကတော့ အဲဒါတွေကို modules မတူညီတာတွေလို သတ်မှတ်ပြီး file ကို အကြိမ်များစွာ reload လုပ်ပါလိမ့်မယ်။ ဥပမာ — `require('./foo')` နဲ့ `require('./FOO')` တို့က `./foo` နဲ့ `./FOO` က file တစ်ခုတည်း ဟုတ်သည်ဖြစ်စေ မဟုတ်သည်ဖြစ်စေ — object နှစ်ခု မတူညီတာကို ပြန်ပေးပါတယ်။

## Built-in modules များ (Built-in modules)

Node.js မှာ binary ထဲကို compile လုပ်ပြီးသား modules များစွာ ပါဝင်ပါတယ်။ ဒီ modules တွေကို ဒီ documentation ရဲ့ အခြားနေရာတွေမှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

Built-in modules တွေကို Node.js source ထဲမှာ သတ်မှတ်ထားပြီး `lib/` folder ထဲမှာ တည်ရှိပါတယ်။

Built-in modules တွေကို `node:` prefix နဲ့ ခွဲခြားသတ်မှတ်နိုင်ပြီး — အဲဒီလိုဆိုရင် `require` cache ကို ကျော်လွှားသွားပါတယ်။ ဥပမာ — `require('node:http')` က အဲဒီနာမည်နဲ့ `require.cache` entry ရှိနေရင်တောင် built-in HTTP module ကိုပဲ အမြဲတမ်း ပြန်ပေးပါတယ်။

တချို့ built-in modules တွေက — သူတို့ရဲ့ identifier ကို `require()` ဆီ ပို့လိုက်ရင် အမြဲတမ်း ဦးစားပေး load လုပ်ခံရပါတယ်။ ဥပမာ — `require('http')` က အဲဒီနာမည်နဲ့ file ရှိနေရင်တောင် built-in HTTP module ကိုပဲ အမြဲတမ်း ပြန်ပေးပါတယ်။

Built-in modules အားလုံးရဲ့ စာရင်းကို [`module.builtinModules`][] ကနေ ရယူနိုင်ပါတယ်။ Modules အားလုံးကို `node:` prefix မပါပဲ စာရင်းပြုစားထားပေမယ့် — အဲဒီလို prefix ကို မဖြစ်မနေ လိုအပ်တဲ့ modules တွေကတော့ ချွင်းချက်ပါ (နောက် section မှာ ရှင်းပြထားပါတယ်)။

### Built-in modules with mandatory `node:` prefix

`require()` နဲ့ load လုပ်တဲ့အခါ တချို့ built-in modules တွေကို `node:` prefix နဲ့တင် တောင်းဆိုရပါတယ်။ ဒီလိုလိုအပ်ချက် ထားရတာက — အသစ် မိတ်ဆက်လာတဲ့ built-in modules တွေက အဲဒီနာမည်ကို အရင်ကတည်းက သိမ်းထားပြီးသား user land packages တွေနဲ့ ပဋိပက္ခ မဖြစ်အောင် ကာကွယ်ဖို့ပါ။ လက်ရှိမှာ `node:` prefix မဖြစ်မနေ လိုအပ်တဲ့ built-in modules တွေကတော့:

* [`node:ffi`][]
* [`node:sea`][]
* [`node:sqlite`][]
* [`node:test`][]
* [`node:test/reporters`][]

ဒီ modules တွေရဲ့ စာရင်းကို prefix အပါအဝင် [`module.builtinModules`][] မှာ ဖော်ပြထားပါတယ်။

## သံသရာလည်နေသော require() ခေါ်ဆိုမှုများ (Cycles)

Circular (သံသရာလည်နေတဲ့) `require()` ခေါ်ဆိုမှုတွေ ရှိနေတဲ့အခါ — module တစ်ခုကို ပြန်ပေးလိုက်ချိန်မှာ အဲဒီ module က လုပ်ဆောင်မှု မပြီးသေးတာ ဖြစ်နိုင်ပါတယ်။

ဒီအခြေအနေကို စဉ်းစားကြည့်ပါ:

`a.js`:

```js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

`b.js`:

```js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

`main.js`:

```js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

`main.js` က `a.js` ကို load လုပ်တဲ့အခါ — `a.js` က နောက်တစ်ဆင့်မှာ `b.js` ကို load လုပ်ပါတယ်။ အဲဒီအချိန်မှာ `b.js` က `a.js` ကို load လုပ်ဖို့ ကြိုးစားပါတယ်။ အဆုံးမရှိ loop (infinite loop) မဖြစ်အောင် — `a.js` ရဲ့ exports object ရဲ့ **unfinished copy (မပြီးပြတ်သေးတဲ့ မိတ္တူ)** တစ်ခုကို `b.js` module ဆီ ပြန်ပေးပါတယ်။ အဲဒီနောက် `b.js` က load လုပ်တာ ပြီးဆုံးသွားပြီး — သူ့ရဲ့ `exports` object ကို `a.js` module ဆီ ပေးအပ်ပါတယ်။

`main.js` က module နှစ်ခုလုံးကို load လုပ်ပြီးတဲ့အချိန်မှာ နှစ်ခုလုံးက ပြီးဆုံးနေပါပြီ။ ဒီ program ရဲ့ output ကတော့ အောက်ပါအတိုင်း ဖြစ်ပါလိမ့်မယ်:

```console
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

Application တစ်ခုအတွင်းမှာ cyclic module dependencies တွေ မှန်ကန်စွာ အလုပ်လုပ်ဖို့ဆိုရင် သေချာစွာ စီစဉ်ထားဖို့ လိုအပ်ပါတယ်။

## File modules များ (File modules)

တိကျတဲ့ filename ကို ရှာမတွေ့ရင် — Node.js က extension တွေ ထပ်ဖြည့်ပြီး လိုအပ်တဲ့ filename ကို load လုပ်ဖို့ ကြိုးစားပါတယ်: `.js`, `.json`, ပြီးတော့ နောက်ဆုံးမှာ `.node` တို့ ဖြစ်ပါတယ်။ အခြား extension တစ်ခုခု (ဥပမာ `.cjs`) ရှိတဲ့ file တစ်ခုကို load လုပ်တဲ့အခါ — သူ့ရဲ့ နာမည် အပြည့်အစုံကို file extension အပါအဝင် `require()` ဆီ ပေးရပါမယ် (ဥပမာ `require('./file.cjs')`)။

`.json` files တွေကို JSON text files အဖြစ် parse လုပ်ပြီး — `.node` files တွေကို `process.dlopen()` နဲ့ load လုပ်တဲ့ compiled addon modules အဖြစ် အနက်ပြန်ပါတယ်။ အခြား extension မှန်သမျှ (သို့) extension လုံးဝ မရှိတဲ့ files တွေကိုတော့ JavaScript text files အဖြစ် parse လုပ်ပါတယ်။ ဘယ် parse goal ကို သုံးမလဲဆိုတာ နားလည်ဖို့ [Determining module system][] section ကို ကိုးကားပါ။

`'/'` prefix နဲ့ စတင်တဲ့ required module က file ဆီကို ညွှန်တဲ့ absolute path တစ်ခုပါ။ ဥပမာ — `require('/home/marco/foo.js')` က `/home/marco/foo.js` မှာရှိတဲ့ file ကို load လုပ်ပါလိမ့်မယ်။

`'./'` prefix နဲ့ စတင်တဲ့ required module က `require()` ကို ခေါ်နေတဲ့ file နဲ့ နှိုင်းယှဉ်တဲ့ (relative) နေရာ ဖြစ်ပါတယ်။ ဆိုလိုတာက — `require('./circle')` က `circle.js` ကို ရှာတွေ့ဖို့ အဲဒီ file က `foo.js` နဲ့ directory တစ်ခုတည်းမှာ ရှိနေရပါမယ်။

File တစ်ခုကို ညွှန်ပြတဲ့ ရှေ့ဆုံး `'/'`, `'./'`, (သို့) `'../'` မပါပဲ ဆိုရင် — module က core module တစ်ခု ဖြစ်ရမယ် ဒါမှမဟုတ် `node_modules` folder တစ်ခုကနေ load လုပ်ရပါတယ်။

ပေးထားတဲ့ path မရှိရင် `require()` က [`MODULE_NOT_FOUND`][] error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

## Folders များကို modules အဖြစ် အသုံးပြုခြင်း (Folders as modules)

> Stability: 3 - Legacy: Use [subpath exports][] or [subpath imports][] instead.

Folder တစ်ခုကို `require()` ရဲ့ argument အနေနဲ့ ပေးနိုင်တဲ့ နည်းလမ်း သုံးမျိုး ရှိပါတယ်။

ပထမနည်းက — folder ရဲ့ root မှာ `main` module တစ်ခုကို သတ်မှတ်ပေးတဲ့ [`package.json`][] file တစ်ခု ဖန်တီးခြင်းပါ။ [`package.json`][] file ဥပမာ တစ်ခုကတော့ အောက်မှာ ပြထားတဲ့ပုံစံ ဖြစ်နိုင်ပါတယ်:

```json
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```

ဒါက `./some-library` ဆိုတဲ့ folder တစ်ခုမှာ ရှိနေရင် — `require('./some-library')` က `./some-library/lib/some-library.js` ကို load လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

Directory ထဲမှာ [`package.json`][] file မရှိဘူးဆိုရင် ဒါမှမဟုတ် [`"main"`][] entry ပျောက်နေတာ ဒါမှမဟုတ် resolve မလုပ်နိုင်တာမျိုး ဆိုရင် — Node.js က အဲဒီ directory ထဲက `index.js` (သို့) `index.node` file တစ်ခုကို load လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ ဥပမာ — အထက်က ဥပမာမှာ [`package.json`][] file မရှိဘူးဆိုရင် — `require('./some-library')` က အောက်ပါတို့ကို load လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်:

* `./some-library/index.js`
* `./some-library/index.node`

ဒီကြိုးစားမှုတွေ အားလုံး မအောင်မြင်ရင် — Node.js က module တစ်ခုလုံးကို ပျောက်ဆုံးနေတယ်လို့ default error နဲ့ အစီရင်ခံပါလိမ့်မယ်:

```console
Error: Cannot find module 'some-library'
```

အထက်မှာ ဖော်ပြခဲ့တဲ့ ကိစ္စ သုံးမျိုးစလုံးမှာ — `import('./some-library')` ဆိုတဲ့ ခေါ်ဆိုမှုက [`ERR_UNSUPPORTED_DIR_IMPORT`][] error ကို ဖြစ်စေပါလိမ့်မယ်။ Package ရဲ့ [subpath exports][] (သို့) [subpath imports][] ကို သုံးခြင်းက folders as modules လိုပဲ ဖွဲ့စည်းမှု သီးခြားခွဲထားခြင်းရဲ့ အကျိုးကျေးဇူးတွေကို ပေးစွမ်းနိုင်ပြီး — `require` ရော `import` အတွက်ပါ အလုပ်လုပ်ပါတယ်။

## Loading from `node_modules` folders

`require()` ဆီ ပေးလိုက်တဲ့ module identifier က [built-in](#built-in-modules) module တစ်ခု မဟုတ်ဘဲ — `'/'`, `'../'`, (သို့) `'./'` နဲ့လည်း မစတင်ဘူးဆိုရင် — Node.js က လက်ရှိ module ရဲ့ directory ကနေ စတင်ပြီး `/node_modules` ကို ပေါင်းထည့်ကာ အဲဒီနေရာကနေ module ကို load လုပ်ဖို့ ကြိုးစားပါတယ်။ `node_modules` နဲ့ အဆုံးသတ်နေပြီးသား path တစ်ခုကိုတော့ Node.js က နောက်ထပ် `node_modules` ထပ်ဖြည့်ပေးမှာ မဟုတ်ပါဘူး။

အဲဒီနေရာမှာ မတွေ့ရင် parent directory ဆီ ရွှေ့ပြီး — file system ရဲ့ root အထိ ဒီအတိုင်း ဆက်ရှာပါတယ်။

ဥပမာ — `'/home/ry/projects/foo.js'` မှာရှိတဲ့ file က `require('bar.js')` လို့ ခေါ်ရင် — Node.js က အောက်ပါ နေရာတွေမှာ ဒီအစဉ်အတိုင်း ရှာဖွေပါလိမ့်မယ်:

* `/home/ry/projects/node_modules/bar.js`
* `/home/ry/node_modules/bar.js`
* `/home/node_modules/bar.js`
* `/node_modules/bar.js`

ဒါက program တွေကို သူတို့ရဲ့ dependencies တွေကို သီးသန့် နေရာချထားနိုင်စေပြီး — ပဋိပက္ခ မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။

Module နာမည်ပြီးနောက် path suffix တစ်ခု ထည့်ပေးခြင်းအားဖြင့် module တစ်ခုနဲ့အတူ ဖြန့်ဝေထားတဲ့ သီးခြား files (သို့) sub modules တွေကို require လုပ်နိုင်ပါတယ်။ ဥပမာ — `require('example-module/path/to/file')` က `path/to/file` ကို `example-module` တည်ရှိတဲ့ နေရာနဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ပါလိမ့်မယ်။ Suffix တပ်ထားတဲ့ path က module resolution ရဲ့ semantics အတိုင်းပဲ လိုက်နာပါတယ်။

## Global folders များမှ loading လုပ်ခြင်း (Loading from the global folders)

`NODE_PATH` environment variable ကို colon တွေနဲ့ ပိုင်းခြားထားတဲ့ absolute paths စာရင်းတစ်ခုအနေနဲ့ သတ်မှတ်ထားရင် — Node.js က modules တွေကို အခြားနေရာတွေမှာ မတွေ့ရင် အဲဒီ paths တွေမှာ ရှာဖွေပါလိမ့်မယ်။

Windows မှာ `NODE_PATH` ကို colon တွေအစား semicolons (`;`) တွေနဲ့ ပိုင်းခြားပါတယ်။

`NODE_PATH` ကို လက်ရှိ [module resolution][] algorithm မသတ်မှတ်ရသေးခင် — paths အမျိုးမျိုးကနေ modules တွေ load လုပ်တာကို ပံ့ပိုးဖို့ မူလက ဖန်တီးခဲ့တာပါ။

`NODE_PATH` ကို အခုထိ ပံ့ပိုးပေးနေဆဲ ဖြစ်ပေမယ့် — Node.js ecosystem က dependent modules တွေကို ရှာဖွေဖို့ convention တစ်ခုပေါ် သဘောတူညီမှု ရသွားပြီမို့ အခုတော့ သိပ်မလိုအပ်တော့ပါဘူး။ `NODE_PATH` ကို အားထားနေတဲ့ deployments တချို့မှာ — လူတွေက `NODE_PATH` ကို သတ်မှတ်ပေးရမယ်ဆိုတာ မသိကြတဲ့အခါ မမျှော်လင့်တဲ့ အပြုအမူတွေ ဖြစ်တတ်ပါတယ်။ တခါတရံ module တစ်ခုရဲ့ dependencies တွေ ပြောင်းသွားတတ်ပြီး — `NODE_PATH` ကို ရှာဖွေတဲ့အခါ version မတူတာ (ဒါမှမဟုတ် module အခြားတစ်ခုတောင်) load ဖြစ်သွားတတ်ပါတယ်။

ဒါ့အပြင် Node.js က အောက်ပါ GLOBAL\_FOLDERS စာရင်းထဲမှာလည်း ရှာဖွေပါလိမ့်မယ်:

* 1: `$HOME/.node_modules`
* 2: `$HOME/.node_libraries`
* 3: `$PREFIX/lib/node`

ဒီနေရာမှာ `$HOME` က user ရဲ့ home directory ဖြစ်ပြီး — `$PREFIX` က Node.js မှာ configure လုပ်ထားတဲ့ `node_prefix` ဖြစ်ပါတယ်။

ဒါတွေက အများအားဖြင့် သမိုင်းဝင် အကြောင်းပြချက်တွေအတွက်ပါ။

Dependencies တွေကို local `node_modules` folder ထဲမှာ ထားဖို့ အခိုင်အမာ တိုက်တွန်းပါတယ်။ အဲဒီကနေ load လုပ်ရင် ပိုမြန်ပြီး — ပိုစိတ်ချရပါတယ်။

## Module wrapper (The module wrapper)

Module တစ်ခုရဲ့ code ကို execute မလုပ်ခင် Node.js က အဲဒါကို အောက်ပါပုံစံ function wrapper တစ်ခုနဲ့ wrap လုပ်ပါတယ်:

```js
(function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
```

ဒီလိုလုပ်ခြင်းအားဖြင့် Node.js က အချက်အနည်းငယ်ကို ပြီးမြောက်စေပါတယ်:

* Top-level variables တွေ (`var`, `const`, (သို့) `let` နဲ့ သတ်မှတ်ထားတဲ့) ကို global object ပေါ်မှာ မဟုတ်ပဲ module ရဲ့ scope ထဲမှာပဲ ရှိနေစေပါတယ်။
* Global နဲ့ တူပေမယ့် တကယ်တော့ module တစ်ခုချင်းစီအတွက်သာ သီးသန့်ဖြစ်တဲ့ variables တချို့ကို ထောက်ပံ့ပေးပါတယ် — ဥပမာ:
  * Module ထဲက တန်ဖိုးတွေကို export လုပ်ဖို့ implementor က သုံးနိုင်တဲ့ `module` နဲ့ `exports` objects တွေ။
  * Module ရဲ့ absolute filename နဲ့ directory path ပါဝင်တဲ့ အဆင်ပြေတဲ့ variables `__filename` နဲ့ `__dirname` တို့။

## Module ၏ scope (The module scope)

### `__dirname`

* Type: {string}

လက်ရှိ module ရဲ့ directory name ပါ။ ဒါက [`__filename`][] ရဲ့ [`path.dirname()`][] နဲ့ အတူတူပါ။

ဥပမာ: `/Users/mjr` ကနေ `node example.js` ကို run လုပ်တဲ့အခါ

```js
console.log(__dirname);
// Prints: /Users/mjr
console.log(path.dirname(__filename));
// Prints: /Users/mjr
```

### `__filename`

* Type: {string}

လက်ရှိ module ရဲ့ file name ပါ။ ဒါက symlinks တွေ resolve လုပ်ပြီးသား လက်ရှိ module file ရဲ့ absolute path ဖြစ်ပါတယ်။

Main program တစ်ခုအတွက်ဆိုရင် ဒါက command line မှာ သုံးထားတဲ့ file name နဲ့ တူချင်မှ တူပါလိမ့်မယ်။

လက်ရှိ module ရဲ့ directory name အတွက် [`__dirname`][] ကို ကြည့်ပါ။

ဥပမာများ:

`/Users/mjr` ကနေ `node example.js` ကို run လုပ်တဲ့အခါ

```js
console.log(__filename);
// Prints: /Users/mjr/example.js
console.log(__dirname);
// Prints: /Users/mjr
```

Module နှစ်ခု — `a` နဲ့ `b` — ရှိတယ်ဆိုပါစို့။ `b` က `a` ရဲ့ dependency တစ်ခု ဖြစ်ပြီး directory structure က အောက်ပါအတိုင်း ဆိုရင်:

* `/Users/mjr/app/a.js`
* `/Users/mjr/app/node_modules/b/b.js`

`b.js` ထဲက `__filename` ကိုးကားချက်တွေက `/Users/mjr/app/node_modules/b/b.js` ကို ပြန်ပေးပြီး — `a.js` ထဲက `__filename` ကိုးကားချက်တွေကတော့ `/Users/mjr/app/a.js` ကို ပြန်ပေးပါလိမ့်မယ်။

### `exports`

* Type: {Object}

`module.exports` ကို ရည်ညွှန်းပြီး ရိုက်ရတာ ပိုတိုတောင်းတဲ့ ပုံစံတစ်ခုပါ။ ဘယ်အချိန် `exports` ကို သုံးရမလဲ၊ ဘယ်အချိန် `module.exports` ကို သုံးရမလဲဆိုတဲ့ အသေးစိတ်အတွက် [exports shortcut][] အကြောင်း section ကို ကြည့်ပါ။

### `module`

* Type: {module}

လက်ရှိ module ကို ရည်ညွှန်းတာပါ — [`module` object][] အကြောင်း section ကို ကြည့်ပါ။ အထူးသဖြင့် module တစ်ခုက ဘာတွေ export လုပ်ပြီး `require()` ကတစ်ဆင့် ရရှိနိုင်အောင် လုပ်မလဲ သတ်မှတ်ဖို့ `module.exports` ကို သုံးပါတယ်။

### `require(id)`

* `id` {string} module နာမည် သို့မဟုတ် path ဖြစ်ပါတယ်။
* Returns: {any} export လုပ်ထားတဲ့ module content ဖြစ်ပါတယ်။

Modules တွေ၊ `JSON` တွေနဲ့ local files တွေကို import လုပ်ဖို့ သုံးပါတယ်။ Modules တွေကို `node_modules` ကနေ import လုပ်နိုင်ပါတယ်။ Local modules နဲ့ JSON files တွေကို relative path တစ်ခု (ဥပမာ `./`, `./foo`, `./bar/baz`, `../foo`) သုံးပြီး import လုပ်နိုင်ပါတယ် — အဲဒီ path ကို [`__dirname`][] (သတ်မှတ်ထားရင်) ဒါမှမဟုတ် လက်ရှိ working directory နဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ပါလိမ့်မယ်။ POSIX ပုံစံ relative paths တွေကို OS ပေါ် မမူတည်တဲ့ ပုံစံနဲ့ resolve လုပ်ပါတယ် — ဆိုလိုတာက အထက်က ဥပမာတွေက Unix systems တွေမှာ အလုပ်လုပ်သလို Windows မှာလည်း အလုပ်လုပ်မှာ ဖြစ်ပါတယ်။

```js
// Importing a local module with a path relative to the `__dirname` or current
// working directory. (On Windows, this would resolve to .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Importing a JSON file:
const jsonData = require('./path/filename.json');

// Importing a module from node_modules or Node.js built-in module:
const crypto = require('node:crypto');
```

#### `require.cache`

* Type: {Object}

Modules တွေကို require လုပ်တဲ့အခါ ဒီ object ထဲမှာ cache လုပ်ပါတယ်။ ဒီ object ကနေ key value တစ်ခုကို ဖျက်လိုက်ရင် — နောက် `require` က module ကို ပြန် load လုပ်ပါလိမ့်မယ်။ ဒါက [native addons][] တွေအတွက်တော့ အကျုံးမဝင်ပါဘူး — အဲဒါတွေကို ပြန် load လုပ်ရင် error ဖြစ်ပါလိမ့်မယ်။

Entries တွေကို ထပ်ထည့်တာ (သို့) အစားထိုးတာလည်း လုပ်နိုင်ပါတယ်။ ဒီ cache ကို built-in modules တွေထက် အရင်စစ်ဆေးပြီး — built-in module တစ်ခုနဲ့ နာမည်တူတဲ့ entry ကို cache ထဲ ထည့်လိုက်ရင် `node:`-prefix ပါတဲ့ require calls တွေကသာ built-in module ကို ရရှိမှာ ဖြစ်ပါတယ်။ သတိထားပြီးမှ သုံးပါ!

```js
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions`

> Stability: 0 - Deprecated

* Type: {Object}

သီးခြား file extensions တွေကို ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာကို `require` ကို ညွှန်ကြားပါတယ်။

`.sjs` extension ရှိတဲ့ files တွေကို `.js` အဖြစ် လုပ်ဆောင်ဖို့:

```js
require.extensions['.sjs'] = require.extensions['.js'];
```

**Deprecated.** အရင်က ဒီစာရင်းကို non-JavaScript modules တွေကို on-demand compile လုပ်ပြီး Node.js ထဲကို load လုပ်ဖို့ သုံးခဲ့ပါတယ်။ ဒါပေမယ့် လက်တွေ့မှာတော့ — modules တွေကို တခြား Node.js program တစ်ခုကတစ်ဆင့် load လုပ်တာ ဒါမှမဟုတ် အဲဒါတွေကို ကြိုတင်ပြီး JavaScript အဖြစ် compile လုပ်ထားတာလိုမျိုး — ဒါထက် အများကြီး ပိုကောင်းတဲ့ နည်းလမ်းတွေ ရှိပါတယ်။

`require.extensions` ကို သုံးတာ ရှောင်ကြဉ်ပါ။ သုံးမိရင် သိမ်မွေ့တဲ့ bugs တွေ ဖြစ်စေနိုင်ပြီး — extension တစ်ခုချင်းစီ register လုပ်ထားတိုင်း extensions resolve လုပ်တာ ပိုနှေးကွေးလာပါတယ်။

#### `require.main`

* Type: {module | undefined}

Node.js process စတင်တဲ့အခါ load လုပ်ခဲ့တဲ့ entry script ကို ကိုယ်စားပြုတဲ့ `Module` object ပါ — ဒါမှမဟုတ် program ရဲ့ entry point က CommonJS module မဟုတ်ရင် `undefined` ဖြစ်ပါတယ်။ ["Accessing the main module"](#accessing-the-main-module) ကို ကြည့်ပါ။

`entry.js` script ထဲမှာ:

```js
console.log(require.main);
```

```bash
node entry.js
```

```js
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```

#### `require.resolve(request[, options])`

* `request` {string} resolve လုပ်ရမယ့် module path ပါ။
* `options` {Object}
  * `paths` {string\[]} Module ရဲ့ တည်နေရာကို resolve လုပ်ဖို့အတွက် paths တွေပါ။ ပေးထားရင် ဒီ paths တွေကို default resolution paths တွေအစား သုံးပါတယ် — ဒါပေမယ့် `$HOME/.node_modules` လိုမျိုး အမြဲတမ်း ထည့်သွင်းခံရတဲ့ [GLOBAL\_FOLDERS][GLOBAL_FOLDERS] တွေကတော့ ချွင်းချက်ပါ။ ဒီ paths တစ်ခုချင်းစီကို module resolution algorithm ရဲ့ စမှတ် (starting point) တစ်ခုအနေနဲ့ သုံးပါတယ် — ဆိုလိုတာက `node_modules` hierarchy ကို ဒီနေရာကနေ စတင် စစ်ဆေးပါတယ်။
* Returns: {string}

Module တစ်ခုရဲ့ တည်နေရာကို ရှာဖွေဖို့ internal `require()` ယန္တရားကို သုံးပေမယ့် — module ကို load လုပ်တာအစား resolve ပြီးသား filename ကိုပဲ ပြန်ပေးပါတယ်။

Module ကို ရှာမတွေ့ရင် `MODULE_NOT_FOUND` error တစ်ခု ဖြစ်ပေါ်ပါတယ်။

##### `require.resolve.paths(request)`

* `request` {string} lookup paths တွေကို ရယူနေတဲ့ module path ပါ။
* Returns: {string\[]|null}

`request` ကို resolve လုပ်စဉ်မှာ ရှာဖွေခဲ့တဲ့ paths တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ် — `request` string က core module တစ်ခု (ဥပမာ `http` (သို့) `fs`) ကို ရည်ညွှန်းနေရင်တော့ `null` ပြန်ပေးပါတယ်။

## The `module` object

* Type: {Object}

Module တိုင်းထဲမှာ `module` free variable က လက်ရှိ module ကို ကိုယ်စားပြုတဲ့ object ရဲ့ reference တစ်ခုပါ။ အဆင်ပြေစေဖို့ `module.exports` ကို `exports` ဆိုတဲ့ module-global ကတစ်ဆင့်လည်း ဝင်ရောက်နိုင်ပါတယ်။ `module` က တကယ်တော့ global မဟုတ်ပဲ — module တစ်ခုချင်းစီအတွက်သာ local ဖြစ်ပါတယ်။

### `module.children`

* Type: {module\[]}

ဒီ module က ပထမဆုံး အကြိမ် require လုပ်ထားတဲ့ module objects တွေပါ။

### `module.exports`

* Type: {Object}

`module.exports` object ကို `Module` system က ဖန်တီးပေးပါတယ်။ တခါတရံမှာ ဒါက လက်ခံနိုင်စရာ မဟုတ်ပါဘူး — လူအများစုက သူတို့ရဲ့ module က class တစ်ခုရဲ့ instance တစ်ခု ဖြစ်စေချင်ကြပါတယ်။ ဒါလုပ်ဖို့ လိုချင်တဲ့ export object ကို `module.exports` ဆီ assign လုပ်ပါ။ လိုချင်တဲ့ object ကို `exports` ဆီ assign လုပ်တာက local `exports` variable ကို ပြန်ချိတ်ပေးရုံသက်သက်ပါ — ဒါက လိုချင်တဲ့အရာ မဟုတ်နိုင်ပါဘူး။

ဥပမာ — `a.js` ဆိုတဲ့ module တစ်ခု ဖန်တီးနေတယ်ဆိုပါစို့:

```js
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```

နောက် တခြား file တစ်ခုမှာ ဒီလိုလုပ်နိုင်ပါတယ်:

```js
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```

`module.exports` ဆီ assign လုပ်တာကို ချက်ချင်း လုပ်ရပါမယ်။ Callbacks တွေထဲမှာ လုပ်လို့ မရပါဘူး။ ဒါက အလုပ်မဖြစ်ပါ:

`x.js`:

```js
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```

`y.js`:

```js
const x = require('./x');
console.log(x.a);
```

#### `exports` shortcut

`exports` variable က module ရဲ့ file-level scope ထဲမှာ ရနိုင်ပြီး — module ကို evaluate မလုပ်ခင် `module.exports` ရဲ့ တန်ဖိုးကို assign လုပ်ပေးထားပါတယ်။

ဒါက shortcut တစ်ခု ဖြစ်စေပါတယ် — `module.exports.f = ...` ဆိုတာကို `exports.f = ...` လို့ ပိုပြီး တိုတိုနဲ့ ရေးနိုင်ပါတယ်။ ဒါပေမယ့် variable တစ်ခုလိုပဲ — `exports` ဆီ တန်ဖိုးအသစ် assign လုပ်လိုက်ရင် သူက `module.exports` နဲ့ ဆက်မချိတ်ဆက်တော့ဘူးဆိုတာ သတိထားပါ:

```js
module.exports.hello = true; // Exported from require of module
exports = { hello: false };  // Not exported, only available in the module
```

`module.exports` property ကို object အသစ်တစ်ခုနဲ့ လုံးဝ အစားထိုးလိုက်တဲ့အခါ — `exports` ကိုပါ ပြန် assign လုပ်တာ ပုံမှန် ဖြစ်ပါတယ်:

```js
module.exports = exports = function Constructor() {
  // ... etc.
};
```

ဒီအပြုအမူကို ရှင်းပြဖို့ — `require()` ရဲ့ စိတ်ကူးယဉ် (hypothetical) implementation တစ်ခုကို စဉ်းစားကြည့်ပါ။ ဒါက `require()` တကယ် လုပ်တာနဲ့ အတော်လေး ဆင်တူပါတယ်:

```js
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Module code here. In this example, define a function.
    function someFunc() {}
    exports = someFunc;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = someFunc;
    // At this point, the module will now export someFunc, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
```

### `module.filename`

* Type: {string}

Module ရဲ့ အပြည့်အဝ resolve လုပ်ထားတဲ့ filename ပါ။

### `module.id`

* Type: {string}

Module အတွက် identifier ပါ။ ပုံမှန်အားဖြင့် ဒါက အပြည့်အဝ resolve လုပ်ထားတဲ့ filename ဖြစ်ပါတယ်။

### `module.isPreloading`

* Type: {boolean} Module က Node.js ရဲ့ preload phase အတွင်းမှာ run နေတယ်ဆိုရင် `true` ဖြစ်ပါတယ်။

### `module.loaded`

* Type: {boolean}

Module က load လုပ်တာ ပြီးဆုံးသွားပြီလား ဒါမှမဟုတ် load လုပ်နေဆဲ ဖြစ်လားဆိုတာကို ဖော်ပြပါတယ်။

### `module.parent`

> Stability: 0 - Deprecated: Please use [`require.main`][] and
> [`module.children`][] instead.

* Type: {module | null | undefined}

ဒီ module ကို ပထမဆုံး require လုပ်ခဲ့တဲ့ module ပါ — ဒါမှမဟုတ် လက်ရှိ module က လက်ရှိ process ရဲ့ entry point ဆိုရင် `null` — ဒါမှမဟုတ် module ကို CommonJS module မဟုတ်တဲ့အရာတစ်ခုခု (ဥပမာ: REPL (သို့) `import`) က load လုပ်ခဲ့ရင် `undefined` ဖြစ်ပါတယ်။

### `module.path`

* Type: {string}

Module ရဲ့ directory name ပါ။ ပုံမှန်အားဖြင့် ဒါက [`module.id`][] ရဲ့ [`path.dirname()`][] နဲ့ အတူတူပါ။

### `module.paths`

* Type: {string\[]}

Module အတွက် ရှာဖွေရေး paths တွေပါ။

### `module.require(id)`

* `id` {string}
* Returns: {any} export လုပ်ထားတဲ့ module content ဖြစ်ပါတယ်။

`module.require()` method က — `require()` ကို မူရင်း module ကနေ ခေါ်သလိုမျိုး module တစ်ခုကို load လုပ်ဖို့ နည်းလမ်း ပေးပါတယ်။

ဒါလုပ်ဖို့ `module` object ရဲ့ reference တစ်ခုကို ရယူဖို့ လိုအပ်ပါတယ်။ `require()` က `module.exports` ကို ပြန်ပေးပြီး `module` က ပုံမှန်အားဖြင့် module တစ်ခုချင်းစီရဲ့ code ထဲမှာသာ _only_ (သာလျှင်) ရနိုင်တာမို့ — အသုံးပြုဖို့ဆိုရင် သူ့ကို ရှင်းလင်းစွာ export လုပ်ထားရပါမယ်။

## The `Module` object

ဒီ section ကို [Modules: `module` core module](https://nodejs.org/api/module.html#the-module-object) ဆီ ရွှေ့ပြောင်းထားပါတယ်။

* <a id="modules_module_builtinmodules" href="module.html#modulebuiltinmodules">`module.builtinModules`</a>
* <a id="modules_module_createrequire_filename" href="module.html#modulecreaterequirefilename">`module.createRequire(filename)`</a>
* <a id="modules_module_syncbuiltinesmexports" href="module.html#modulesyncbuiltinesmexports">`module.syncBuiltinESMExports()`</a>

## Source map v3 ပံ့ပိုးမှု (Source map v3 support)

ဒီ section ကို [Modules: `module` core module](https://nodejs.org/api/module.html#source-map-support) ဆီ ရွှေ့ပြောင်းထားပါတယ်။

* <a id="modules_module_findsourcemap_path_error" href="module.html#modulefindsourcemappath">`module.findSourceMap(path)`</a>
* <a id="modules_class_module_sourcemap" href="module.html#class-modulesourcemap">Class: `module.SourceMap`</a>
  * <a id="modules_new_sourcemap_payload" href="module.html#new-sourcemappayload--linelengths-">`new SourceMap(payload)`</a>
  * <a id="modules_sourcemap_payload" href="module.html#sourcemappayload">`sourceMap.payload`</a>
  * <a id="modules_sourcemap_findentry_linenumber_columnnumber" href="module.html#sourcemapfindentrylineoffset-columnoffset">`sourceMap.findEntry(lineNumber, columnNumber)`</a>

[Determining module system]: packages.md#determining-module-system
[ECMAScript Modules]: esm.md
[GLOBAL_FOLDERS]: #loading-from-the-global-folders
[`"main"`]: packages.md#main
[`"type"`]: packages.md#type
[`--trace-require-module`]: cli.md#--trace-require-modulemode
[`ERR_REQUIRE_ASYNC_MODULE`]: errors.md#err_require_async_module
[`ERR_UNSUPPORTED_DIR_IMPORT`]: errors.md#err_unsupported_dir_import
[`MODULE_NOT_FOUND`]: errors.md#module_not_found
[`__dirname`]: #__dirname
[`__filename`]: #__filename
[`import()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[`module.builtinModules`]: module.md#modulebuiltinmodules
[`module.children`]: #modulechildren
[`module.id`]: #moduleid
[`module` core module]: module.md
[`module` object]: #the-module-object
[`node:ffi`]: ffi.md
[`node:sea`]: single-executable-applications.md#single-executable-application-api
[`node:sqlite`]: sqlite.md
[`node:test/reporters`]: test.md#test-reporters
[`node:test`]: test.md
[`package.json`]: packages.md#nodejs-packagejson-field-definitions
[`path.dirname()`]: path.md#pathdirnamepath
[`process.features.require_module`]: process.md#processfeaturesrequire_module
[`require.main`]: #requiremain
[exports shortcut]: #exports-shortcut
[module namespace object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#module_namespace_object
[module resolution]: #all-together
[native addons]: addons.md
[subpath exports]: packages.md#subpath-exports
[subpath imports]: packages.md#subpath-imports
