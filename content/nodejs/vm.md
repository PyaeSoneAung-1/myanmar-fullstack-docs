---
title: "VM (executing JavaScript)"
description: "node:vm module — V8 virtual machine contexts တွေမှာ JavaScript code compile/run လုပ်ဖို့ — vm.Script, vm.runInContext, vm.Module family, contextify, timeout စသည်"
order: 140
source: "https://nodejs.org/api/vm.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:vm` module က V8 Virtual Machine contexts တွေထဲမှာ code တွေကို compile လုပ်ပြီး run လုပ်နိုင်စေဖို့ ပံ့ပိုးပေးပါတယ်။

`node:vm` module က security (လုံခြုံရေး) ယန္တရား တစ်ခု မဟုတ်ပါဘူး။ မယုံကြည်ရထိုက်တဲ့ (untrusted) code တွေကို run လုပ်ဖို့ ဒါကို မသုံးပါနဲ့။

JavaScript code တွေကို ချက်ချင်း compile ပြီး run လုပ်နိုင်သလို — compile လုပ်ပြီး သိမ်းဆည်းကာ နောက်မှ run လုပ်တာမျိုးလည်း လုပ်နိုင်ပါတယ်။

အသုံးများတဲ့ ကိစ္စတစ်ခုကတော့ — code ကို မတူညီတဲ့ V8 Context တစ်ခုထဲမှာ run လုပ်တာပါ။ ဆိုလိုတာက run လုပ်လိုက်တဲ့ code မှာ run လုပ်ပေးတဲ့ code ရဲ့ global object နဲ့ မတူညီတဲ့ global object တစ်ခု ရှိပါတယ်။

[_contextifying_][contextified] လုပ်ထားတဲ့ object တစ်ခုကို ပေးခြင်းအားဖြင့် context တစ်ခုကို ပံ့ပိုးပေးနိုင်ပါတယ်။ Run လုပ်လိုက်တဲ့ code က context ထဲက property တိုင်းကို global variable တစ်ခုလိုပဲ သဘောထားပါတယ်။ Run လုပ်လိုက်တဲ့ code ကြောင့် global variables တွေမှာ ဖြစ်ပေါ်လာတဲ့ ပြောင်းလဲမှုတွေ အားလုံးက context object ထဲမှာ ထင်ဟပ်နေပါတယ်။

```mjs
import { createContext, runInContext } from 'node:vm';

const x = 1;

const context = { x: 2 };
createContext(context); // Contextify the object.

const code = 'x += 40; var y = 17;';
// `x` and `y` are global variables in the context.
// Initially, x has the value 2 because that is the value of context.x.
runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y is not defined
```

```cjs
const { createContext, runInContext } = require('node:vm');

const x = 1;

const context = { x: 2 };
createContext(context); // Contextify the object.

const code = 'x += 40; var y = 17;';
// `x` and `y` are global variables in the context.
// Initially, x has the value 2 because that is the value of context.x.
runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y is not defined
```

## Class: `vm.Script`

`vm.Script` class ရဲ့ instances တွေမှာ — သတ်မှတ်ထားတဲ့ contexts တွေထဲမှာ လုပ်ဆောင်နိုင်တဲ့ — ကြိုတင် compile လုပ်ထားပြီးသား scripts တွေ ပါဝင်ပါတယ်။

### `new vm.Script(code[, options])`

* `code` {string} Compile လုပ်ရမယ့် JavaScript code ပါ။
* `options` {Object|string}
  * `filename` {string} ဒီ script က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ သုံးမယ့် filename ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `'evalmachine.<anonymous>'`။
  * `lineOffset` {number} ဒီ script က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ ပြသမယ့် line number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `columnOffset` {number} ဒီ script က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ ပြသမယ့် ပထမ line ရဲ့ column number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `cachedData` {Buffer|TypedArray|DataView} ပေးထားတဲ့ source အတွက် V8 ရဲ့ code cache data ပါဝင်တဲ့ optional `Buffer` (သို့) `TypedArray`, (သို့) `DataView` တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ပေးထားရင် — `cachedDataRejected` တန်ဖိုးကို V8 က data ကို လက်ခံမလက်ခံပေါ် မူတည်ပြီး `true` (သို့) `false` အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။
  * `produceCachedData` {boolean} `true` ဖြစ်ပြီး `cachedData` မရှိဘူးဆိုရင် — V8 က `code` အတွက် code cache data ကို ထုတ်လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ အောင်မြင်ခဲ့ရင် — V8 ရဲ့ code cache data ပါတဲ့ `Buffer` တစ်ခုကို ထုတ်လုပ်ပြီး ပြန်ပေးလိုက်တဲ့ `vm.Script` instance ရဲ့ `cachedData` property ထဲမှာ သိမ်းဆည်းပေးပါလိမ့်မယ်။ Code cache data ကို အောင်မြင်စွာ ထုတ်လုပ်နိုင်ခဲ့လားပေါ် မူတည်ပြီး `cachedDataProduced` တန်ဖိုးကို `true` (သို့) `false` အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။ ဒီ option က `script.createCachedData()` ကို ဦးစားပေးတာမို့ **deprecated** (အသုံးမပြုတော့ရန် ရပ်ဆိုင်း) လုပ်ထားပါတယ်။ **Default:** `false`။
  * `importModuleDynamically` {Function|vm.constants.USE\_MAIN\_CONTEXT\_DEFAULT\_LOADER} ဒီ script ကို evaluate လုပ်နေစဉ် `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမလဲ သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment တစ်ခုထဲမှာ ဒါကို သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် — [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။

`options` က string တစ်ခုဆိုရင် — အဲဒါက filename ကို သတ်မှတ်ပေးပါတယ်။

`vm.Script` object အသစ်တစ်ခုကို ဖန်တီးလိုက်တာက `code` ကို compile လုပ်ပေးပေမယ့် run မလုပ်ပါဘူး။ Compile လုပ်ထားတဲ့ `vm.Script` ကို နောက်ပိုင်းမှာ အကြိမ်များစွာ run လုပ်နိုင်ပါတယ်။ `code` က ဘယ် global object နဲ့မှ bind (ချိတ်ဆက်) ထားတာ မဟုတ်ပါဘူး; ဒါအစား — run တစ်ကြိမ်စီမှာ အဲဒီ run အတွက်သာ bind လုပ်ပေးပါတယ်။

### `script.cachedDataRejected`

* Type: {boolean|undefined}

`vm.Script` ကို ဖန်တီးဖို့ `cachedData` ကို ပေးထားတဲ့အခါ — ဒီတန်ဖိုးကို V8 က data ကို လက်ခံမလက်ခံပေါ် မူတည်ပြီး `true` (သို့) `false` အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။ မဟုတ်ရင်တော့ တန်ဖိုးက `undefined` ဖြစ်ပါတယ်။

### `script.createCachedData()`

* Returns: {Buffer}

`Script` constructor ရဲ့ `cachedData` option နဲ့ သုံးလို့ရမယ့် code cache တစ်ခုကို ဖန်တီးပါတယ်။ `Buffer` တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ method ကို ဘယ်အချိန်မဆို — အကြိမ်အရေအတွက် ဘယ်လောက်ပဲ ဖြစ်ဖြစ် — ခေါ်လို့ရပါတယ်။

`Script` ရဲ့ code cache ထဲမှာ JavaScript ကနေ ကြည့်လို့ရတဲ့ (observable) states တွေ ဘာမှ မပါဝင်ပါဘူး။ Code cache ကို script source နဲ့အတူ သိမ်းဆည်းထားပြီး — `Script` instance အသစ်တွေကို အကြိမ်များစွာ တည်ဆောက်ဖို့ သုံးတာက လုံခြုံပါတယ်။

`Script` source ထဲက functions တွေကို lazily compiled (ပထမဆုံးအကြိမ် ခေါ်လိုက်ချိန်မှသာ compile လုပ်ရန် မှတ်သားထားသော) အဖြစ် မှတ်သားထားနိုင်ပြီး — `Script` ကို တည်ဆောက်တဲ့အချိန်မှာ compile လုပ်ထားတာ မဟုတ်ပါဘူး။ ဒီ functions တွေကို ပထမဆုံးအကြိမ် ခေါ်လိုက်တဲ့အခါမှသာ compile လုပ်ပါလိမ့်မယ်။ Code cache က V8 က `Script` အကြောင်း လက်ရှိ သိထားတဲ့ — နောင်ကာလ compilations တွေကို မြန်ဆန်စေဖို့ သုံးနိုင်တဲ့ — metadata တွေကို serialize လုပ်ပေးပါတယ်။

```js
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// In `cacheWithoutAdd` the function `add()` is marked for full compilation
// upon invocation.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` contains fully compiled function `add()`.
```

### `script.runInContext(contextifiedObject[, options])`

* `contextifiedObject` {Object} `vm.createContext()` method က ပြန်ပေးတဲ့ [contextified][] object တစ်ခုပါ။
* `options` {Object}
  * `displayErrors` {boolean} `true` ဆိုရင် — `code` ကို compile လုပ်နေစဉ် [`Error`][] တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — error ကို ဖြစ်စေတဲ့ code ရဲ့ line ကို stack trace ထဲကို ထည့်သွင်းပေးပါတယ်။ **Default:** `true`။
  * `timeout` {integer} `code` ကို execute လုပ်တာ ရပ်တန့်လိုက်ခင် စောင့်ဆိုင်းရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို ရပ်တန့်လိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive ဖြစ်တဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာက execution ကို ရပ်တန့်စေပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား handlers တွေက script လုပ်ဆောင်နေစဉ်မှာ disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်ပြီး အလုပ်လုပ်နေပါတယ်။ **Default:** `false`။
* Returns: {any} script ထဲမှာ နောက်ဆုံး လုပ်ဆောင်လိုက်တဲ့ statement ရဲ့ ရလဒ်ပါ။

`vm.Script` object ထဲမှာ ပါဝင်တဲ့ compile လုပ်ထားတဲ့ code ကို ပေးထားတဲ့ `contextifiedObject` ထဲမှာ run လုပ်ပြီး ရလဒ်ကို ပြန်ပေးပါတယ်။ Run လုပ်နေတဲ့ code က local scope ကို ဝင်ရောက် သုံးစွဲနိုင်မှာ မဟုတ်ပါဘူး။

အောက်ပါ ဥပမာက global variable တစ်ခုကို တိုးမြှင့်ပြီး — နောက် global variable တစ်ခုရဲ့ တန်ဖိုးကို သတ်မှတ်ပေးတဲ့ code ကို compile လုပ်ကာ — အဲဒီ code ကို အကြိမ်များစွာ run လုပ်ပါတယ်။ Global variables တွေက `context` object ထဲမှာ ပါဝင်ပါတယ်။

```mjs
import { createContext, Script } from 'node:vm';

const context = {
  animal: 'cat',
  count: 2,
};

const script = new Script('count += 1; name = "kitty";');

createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Prints: { animal: 'cat', count: 12, name: 'kitty' }
```

```cjs
const { createContext, Script } = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new Script('count += 1; name = "kitty";');

createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Prints: { animal: 'cat', count: 12, name: 'kitty' }
```

`timeout` (သို့) `breakOnSigint` options တွေကို သုံးလိုက်တာက — event loops အသစ်တွေနဲ့ ၎င်းတို့နဲ့ သက်ဆိုင်တဲ့ threads တွေကို စတင်စေတာမို့ — သုည မဟုတ်တဲ့ performance overhead (စွမ်းဆောင်ရည် ကုန်ကျစရိတ်) တစ်ခု ရှိပါတယ်။

### `script.runInNewContext([contextObject[, options]])`

* `contextObject` {Object|vm.constants.DONT\_CONTEXTIFY|undefined} [`vm.constants.DONT_CONTEXTIFY`][] (သို့) [contextified][] လုပ်မယ့် object တစ်ခု — နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ `undefined` ဆိုရင် — backward compatibility (နောက်ကြောင်း သဟဇာတဖြစ်မှု) အတွက် — contextified လုပ်ထားတဲ့ ဗလာ object တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။
* `options` {Object}
  * `displayErrors` {boolean} `true` ဆိုရင် — `code` ကို compile လုပ်နေစဉ် [`Error`][] တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — error ကို ဖြစ်စေတဲ့ code ရဲ့ line ကို stack trace ထဲကို ထည့်သွင်းပေးပါတယ်။ **Default:** `true`။
  * `timeout` {integer} `code` ကို execute လုပ်တာ ရပ်တန့်လိုက်ခင် စောင့်ဆိုင်းရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို ရပ်တန့်လိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive ဖြစ်တဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာက execution ကို ရပ်တန့်စေပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား handlers တွေက script လုပ်ဆောင်နေစဉ်မှာ disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်ပြီး အလုပ်လုပ်နေပါတယ်။ **Default:** `false`။
  * `contextName` {string} အသစ်ဖန်တီးလိုက်တဲ့ context ရဲ့ လူဖတ်လို့ရတဲ့ (human-readable) နာမည်ပါ။ **Default:** `'VM Context i'` — ဒီမှာ `i` က ဖန်တီးလိုက်တဲ့ context တွေရဲ့ ကြီးစဉ်ငယ်လိုက် ဂဏန်း အညွှန်း (ascending numerical index) တစ်ခု ဖြစ်ပါတယ်။
  * `contextOrigin` {string} ပြသမှု ရည်ရွယ်ချက်တွေအတွက် အသစ်ဖန်တီးလိုက်တဲ့ context နဲ့ သက်ဆိုင်တဲ့ [Origin][origin] ပါ။ Origin ကို URL တစ်ခုလို format လုပ်သင့်ပေမယ့် — scheme, host နဲ့ port (လိုအပ်ရင်) တို့သာ ပါဝင်ပြီး — [`URL`][] object တစ်ခုရဲ့ [`url.origin`][] property ရဲ့ တန်ဖိုးနဲ့ တူညီရပါမယ်။ အထူးခြားဆုံးက — ဒီ string ထဲမှာ နောက်ဆုံး slash ကို ချန်လှပ်ထားရပါမယ်; ဘာလို့လဲဆိုတော့ အဲဒါက path တစ်ခုကို ညွှန်းပြတာ ဖြစ်လို့ပါ။ **Default:** `''`။
  * `contextCodeGeneration` {Object}
    * `strings` {boolean} false အဖြစ် သတ်မှတ်ထားရင် — `eval` (သို့) function constructors (`Function`, `GeneratorFunction`, စသည်) တွေဆီကို ခေါ်ဆိုမှုတွေ အားလုံးက `EvalError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
    * `wasm` {boolean} false အဖြစ် သတ်မှတ်ထားရင် — WebAssembly module တစ်ခုကို compile လုပ်ဖို့ ကြိုးစားမှုတိုင်းက `WebAssembly.CompileError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
  * `microtaskMode` {string} `afterEvaluate` အဖြစ် သတ်မှတ်ထားရင် — microtasks တွေ (`Promise`s နဲ့ `async function`s တွေကနေတစ်ဆင့် စီစဉ်ထားတဲ့ tasks တွေ) ကို script run ပြီးတာနဲ့ ချက်ချင်း run လုပ်ပေးပါလိမ့်မယ်။ အဲဒီအခြေအနေမျိုးမှာ ၎င်းတို့ကို `timeout` နဲ့ `breakOnSigint` တို့ရဲ့ scope တွေထဲမှာ ထည့်သွင်း တွက်ချက်ပါတယ်။
* Returns: {any} script ထဲမှာ နောက်ဆုံး လုပ်ဆောင်လိုက်တဲ့ statement ရဲ့ ရလဒ်ပါ။

ဒီ method က `script.runInContext(vm.createContext(options), options)` ရဲ့ shortcut (တိုတောင်းသော နည်းလမ်း) တစ်ခုပါ။ ၎င်းက အချက်များစွာကို တစ်ပြိုင်နက် လုပ်ဆောင်ပေးပါတယ်:

1. Context အသစ်တစ်ခုကို ဖန်တီးပါတယ်။
2. `contextObject` က object တစ်ခုဆိုရင် — အဲဒါကို context အသစ်နဲ့ [contextifies][contextified] လုပ်ပါတယ်။ `contextObject` က undefined ဆိုရင် — object အသစ်တစ်ခုကို ဖန်တီးပြီး [contextifies][contextified] လုပ်ပါတယ်။ `contextObject` က [`vm.constants.DONT_CONTEXTIFY`][] ဆိုရင် — ဘာကိုမှ [contextify][contextified] မလုပ်ပါဘူး။
3. ဖန်တီးထားတဲ့ context ထဲမှာ `vm.Script` object ထဲ ပါဝင်တဲ့ compile လုပ်ထားတဲ့ code ကို run လုပ်ပါတယ်။ Code က ဒီ method ကို ခေါ်ထားတဲ့ scope ကို ဝင်ရောက် သုံးစွဲနိုင်မှာ မဟုတ်ပါဘူး။
4. ရလဒ်ကို ပြန်ပေးပါတယ်။

အောက်ပါ ဥပမာက global variable တစ်ခုကို သတ်မှတ်ပေးတဲ့ code ကို compile လုပ်ပြီး — အဲဒီ code ကို မတူညီတဲ့ contexts တွေထဲမှာ အကြိမ်များစွာ run လုပ်ပါတယ်။ Global variables တွေက `context` တစ်ခုချင်းစီအပေါ်မှာ သတ်မှတ်ပြီး အဲဒီထဲမှာပဲ ပါဝင်နေပါတယ်။

```mjs
import { constants, Script } from 'node:vm';

const script = new Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// This would throw if the context is created from a contextified object.
// constants.DONT_CONTEXTIFY allows creating contexts with ordinary
// global objects that can be frozen.
const freezeScript = new Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(constants.DONT_CONTEXTIFY);
```

```cjs
const { constants, Script } = require('node:vm');

const script = new Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// This would throw if the context is created from a contextified object.
// constants.DONT_CONTEXTIFY allows creating contexts with ordinary
// global objects that can be frozen.
const freezeScript = new Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])`

* `options` {Object}
  * `displayErrors` {boolean} `true` ဆိုရင် — `code` ကို compile လုပ်နေစဉ် [`Error`][] တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — error ကို ဖြစ်စေတဲ့ code ရဲ့ line ကို stack trace ထဲကို ထည့်သွင်းပေးပါတယ်။ **Default:** `true`။
  * `timeout` {integer} `code` ကို execute လုပ်တာ ရပ်တန့်လိုက်ခင် စောင့်ဆိုင်းရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို ရပ်တန့်လိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive ဖြစ်တဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာက execution ကို ရပ်တန့်စေပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား handlers တွေက script လုပ်ဆောင်နေစဉ်မှာ disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်ပြီး အလုပ်လုပ်နေပါတယ်။ **Default:** `false`။
* Returns: {any} script ထဲမှာ နောက်ဆုံး လုပ်ဆောင်လိုက်တဲ့ statement ရဲ့ ရလဒ်ပါ။

`vm.Script` ထဲမှာ ပါဝင်တဲ့ compile လုပ်ထားတဲ့ code ကို လက်ရှိ `global` object ရဲ့ context ထဲမှာ run လုပ်ပါတယ်။ Run လုပ်နေတဲ့ code က local scope ကို ဝင်ရောက် သုံးစွဲနိုင်မှာ မဟုတ်ပေမယ့် — လက်ရှိ `global` object ကိုတော့ _ရရှိနိုင်ပါတယ်_။

အောက်ပါ ဥပမာက `global` variable တစ်ခုကို တိုးမြှင့်တဲ့ code ကို compile လုပ်ပြီး — အဲဒီ code ကို အကြိမ်များစွာ run လုပ်ပါတယ်:

```mjs
import { Script } from 'node:vm';

global.globalVar = 0;

const script = new Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

```cjs
const { Script } = require('node:vm');

global.globalVar = 0;

const script = new Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL`

* Type: {string|undefined}

Script ကို source map magic comment ပါဝင်တဲ့ source တစ်ခုကနေ compile လုပ်တဲ့အခါ — ဒီ property ကို source map ရဲ့ URL အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။

```mjs
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```cjs
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

## Class: `vm.Module`

> Stability: 1 - Experimental

ဒီ feature က `--experimental-vm-modules` command flag ကို ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`vm.Module` class က VM contexts တွေထဲမှာ ECMAScript modules တွေကို သုံးစွဲဖို့ low-level interface (နိမ့်ကျသော အဆင့် မျက်နှာပြင်) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ၎င်းက ECMAScript specification ထဲမှာ သတ်မှတ်ထားတဲ့ [Module Record][]s တွေကို အနီးကပ် ထင်ဟပ်စေတဲ့ `vm.Script` class ရဲ့ အဖော် (counterpart) တစ်ခု ဖြစ်ပါတယ်။

ဒါပေမယ့် `vm.Script` နဲ့ မတူတာက — `vm.Module` object တိုင်းက ၎င်းကို ဖန်တီးကတည်းက context တစ်ခုနဲ့ bind (ချိတ်ဆက်) လုပ်ထားပါတယ်။

`vm.Module` object တစ်ခုကို သုံးဖို့ ခြားနားတဲ့ အဆင့်သုံးဆင့် လိုအပ်ပါတယ်: creation/parsing (ဖန်တီးခြင်း/ခွဲခြမ်း စိတ်ဖြာခြင်း), linking (ချိတ်ဆက်ခြင်း) နဲ့ evaluation (လုပ်ဆောင် အကဲဖြတ်ခြင်း) တို့ ဖြစ်ပါတယ်။ ဒီအဆင့်သုံးဆင့်ကို အောက်ပါ ဥပမာမှာ သရုပ်ဖော်ထားပါတယ်။

ဒီ implementation က [ECMAScript Module loader][] ထက် နိမ့်ကျတဲ့ အဆင့်တစ်ခုမှာ တည်ရှိပါတယ်။ Loader နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ နည်းလမ်း မရှိသေးပေမယ့် — support လုပ်ဖို့တော့ စီစဉ်ထားပါတယ်။

```mjs
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// Create a Module by constructing a new `vm.SourceTextModule` object. This
// parses the provided source text, throwing a `SyntaxError` if anything goes
// wrong. By default, a Module is created in the top context. But here, we
// specify `contextifiedObject` as the context this Module belongs to.
//
// Here, we attempt to obtain the default export from the module "foo", and
// put it into local binding "secret".

const rootModule = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// "Link" the imported dependencies of this Module to it.
//
// Obtain the requested dependencies of a SourceTextModule by
// `sourceTextModule.moduleRequests` and resolve them.
//
// Even top-level Modules without dependencies must be explicitly linked. The
// array passed to `sourceTextModule.linkRequests(modules)` can be
// empty, however.
//
// Note: This is a contrived example in that the resolveAndLinkDependencies
// creates a new "foo" module every time it is called. In a full-fledged
// module system, a cache would probably be used to avoid duplicated modules.

const moduleMap = new Map([
  ['root', rootModule],
]);

function resolveAndLinkDependencies(module) {
  const requestedModules = module.moduleRequests.map((request) => {
    // In a full-fledged module system, the resolveAndLinkDependencies would
    // resolve the module with the module cache key `[specifier, attributes]`.
    // In this example, we just use the specifier as the key.
    const specifier = request.specifier;

    let requestedModule = moduleMap.get(specifier);
    if (requestedModule === undefined) {
      requestedModule = new vm.SourceTextModule(`
        // The "secret" variable refers to the global variable we added to
        // "contextifiedObject" when creating the context.
        export default secret;
      `, { context: module.context });
      moduleMap.set(specifier, requestedModule);
      // Resolve the dependencies of the new module as well.
      resolveAndLinkDependencies(requestedModule);
    }

    return requestedModule;
  });

  module.linkRequests(requestedModules);
}

resolveAndLinkDependencies(rootModule);
rootModule.instantiate();

// Step 3
//
// Evaluate the Module. The evaluate() method returns a promise which will
// resolve after the module has finished evaluating.

// Prints 42.
await rootModule.evaluate();
```

```cjs
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // Create a Module by constructing a new `vm.SourceTextModule` object. This
  // parses the provided source text, throwing a `SyntaxError` if anything goes
  // wrong. By default, a Module is created in the top context. But here, we
  // specify `contextifiedObject` as the context this Module belongs to.
  //
  // Here, we attempt to obtain the default export from the module "foo", and
  // put it into local binding "secret".

  const rootModule = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // "Link" the imported dependencies of this Module to it.
  //
  // Obtain the requested dependencies of a SourceTextModule by
  // `sourceTextModule.moduleRequests` and resolve them.
  //
  // Even top-level Modules without dependencies must be explicitly linked. The
  // array passed to `sourceTextModule.linkRequests(modules)` can be
  // empty, however.
  //
  // Note: This is a contrived example in that the resolveAndLinkDependencies
  // creates a new "foo" module every time it is called. In a full-fledged
  // module system, a cache would probably be used to avoid duplicated modules.

  const moduleMap = new Map([
    ['root', rootModule],
  ]);

  function resolveAndLinkDependencies(module) {
    const requestedModules = module.moduleRequests.map((request) => {
      // In a full-fledged module system, the resolveAndLinkDependencies would
      // resolve the module with the module cache key `[specifier, attributes]`.
      // In this example, we just use the specifier as the key.
      const specifier = request.specifier;

      let requestedModule = moduleMap.get(specifier);
      if (requestedModule === undefined) {
        requestedModule = new vm.SourceTextModule(`
          // The "secret" variable refers to the global variable we added to
          // "contextifiedObject" when creating the context.
          export default secret;
        `, { context: module.context });
        moduleMap.set(specifier, requestedModule);
        // Resolve the dependencies of the new module as well.
        resolveAndLinkDependencies(requestedModule);
      }

      return requestedModule;
    });

    module.linkRequests(requestedModules);
  }

  resolveAndLinkDependencies(rootModule);
  rootModule.instantiate();

  // Step 3
  //
  // Evaluate the Module. The evaluate() method returns a promise which will
  // resolve after the module has finished evaluating.

  // Prints 42.
  await rootModule.evaluate();
})();
```

### `module.error`

* Type: {any}

`module.status` က `'errored'` ဖြစ်နေရင် — ဒီ property ထဲမှာ module က evaluation လုပ်နေစဉ် throw လုပ်လိုက်တဲ့ exception ပါဝင်ပါတယ်။ Status က တခြားဟာတစ်ခုခု ဖြစ်နေရင် — ဒီ property ကို ဝင်ရောက် သုံးစွဲတာက exception တစ်ခုကို throw လုပ်စေပါလိမ့်မယ်။

`throw undefined;` နဲ့ ရှုပ်ထွေးမှု (ambiguity) ဖြစ်နိုင်လို့ — exception မရှိတဲ့ အခြေအနေတွေအတွက် `undefined` တန်ဖိုးကို သုံးလို့ မရပါဘူး။

ECMAScript specification ထဲက [Cyclic Module Record][]s တွေရဲ့ `[[EvaluationError]]` field နဲ့ ကိုက်ညီပါတယ်။

### `module.evaluate([options])`

* `options` {Object}
  * `timeout` {integer} Execute လုပ်တာ ရပ်တန့်လိုက်ခင် evaluate လုပ်ဖို့ စောင့်ဆိုင်းရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို အနှောင့်အယှက် ဖြစ်စေလိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive ဖြစ်တဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာက execution ကို ရပ်တန့်စေပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား handlers တွေက script လုပ်ဆောင်နေစဉ်မှာ disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်ပြီး အလုပ်လုပ်နေပါတယ်။ **Default:** `false`။
* Returns: {Promise} အောင်မြင်ခဲ့ရင် `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Module နဲ့ ၎င်းရဲ့ dependencies တွေကို evaluate လုပ်ပါတယ်။ ECMAScript specification ထဲက [Cyclic Module Record][]s တွေရဲ့ [Evaluate() concrete method][] field နဲ့ ကိုက်ညီပါတယ်။

Module က `vm.SourceTextModule` တစ်ခုဆိုရင် — `evaluate()` ကို module instantiate လုပ်ပြီးမှသာ ခေါ်ရပါမယ်; မဟုတ်ရင် `evaluate()` က rejected promise တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

`vm.SourceTextModule` တစ်ခုအတွက်ဆိုရင် — `evaluate()` က ပြန်ပေးတဲ့ promise က synchronously ဖြစ်စေ asynchronously ဖြစ်စေ fulfill ဖြစ်နိုင်ပါတယ်:

1. `vm.SourceTextModule` ကိုယ်တိုင် သို့မဟုတ် ၎င်းရဲ့ dependencies တွေထဲမှာ top-level `await` မရှိဘူးဆိုရင် — module နဲ့ ၎င်းရဲ့ dependencies အားလုံး evaluate လုပ်ပြီးသွားတာနဲ့ promise က _synchronously_ fulfill ဖြစ်ပါလိမ့်မယ်။
   1. Evaluation အောင်မြင်ခဲ့ရင် — promise က _synchronously_ `undefined` အဖြစ် resolve ဖြစ်ပါလိမ့်မယ်။
   2. Evaluation ရဲ့ ရလဒ်က exception တစ်ခုဆိုရင် — promise က evaluation ကို မအောင်မြင်စေတဲ့ — `module.error` နဲ့ အတူတူဖြစ်တဲ့ — exception နဲ့ _synchronously_ rejected ဖြစ်ပါလိမ့်မယ်။
2. `vm.SourceTextModule` ကိုယ်တိုင် သို့မဟုတ် ၎င်းရဲ့ dependencies တွေထဲမှာ top-level `await` ရှိနေရင် — module နဲ့ ၎င်းရဲ့ dependencies အားလုံး evaluate လုပ်ပြီးသွားတာနဲ့ promise က _asynchronously_ fulfill ဖြစ်ပါလိမ့်မယ်။
   1. Evaluation အောင်မြင်ခဲ့ရင် — promise က _asynchronously_ `undefined` အဖြစ် resolve ဖြစ်ပါလိမ့်မယ်။
   2. Evaluation ရဲ့ ရလဒ်က exception တစ်ခုဆိုရင် — promise က evaluation ကို မအောင်မြင်စေတဲ့ exception နဲ့ _asynchronously_ rejected ဖြစ်ပါလိမ့်မယ်။

Module က `vm.SyntheticModule` တစ်ခုဆိုရင် — `evaluate()` က synchronously fulfill ဖြစ်တဲ့ promise တစ်ခုကို အမြဲတမ်း ပြန်ပေးပါတယ်; [Evaluate() of a Synthetic Module Record][] ရဲ့ specification ကို ကြည့်ပါ:

1. ၎င်းရဲ့ constructor ဆီကို ပေးပို့ထားတဲ့ `evaluateCallback` က exception တစ်ခုကို synchronously throw လုပ်ခဲ့ရင် — `evaluate()` က အဲဒီ exception နဲ့ synchronously rejected ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။
2. `evaluateCallback` က exception မရှိဘဲ ပြီးသွားရင် — `evaluate()` က `undefined` အဖြစ် synchronously resolve ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

`vm.SyntheticModule` တစ်ခုရဲ့ `evaluateCallback` ကို `evaluate()` call အတွင်းမှာ synchronously လုပ်ဆောင်ပြီး — ၎င်းရဲ့ ပြန်ပေးတဲ့ တန်ဖိုးကို စွန့်ပစ်ပါတယ်။ ဆိုလိုတာက — `evaluateCallback` က asynchronous function တစ်ခုဆိုရင် — `evaluate()` က ပြန်ပေးတဲ့ promise က ၎င်းရဲ့ asynchronous အပြုအမူကို ထင်ဟပ်စေမှာ မဟုတ်ဘဲ — asynchronous `evaluateCallback` တစ်ခုကနေ လာတဲ့ rejections တွေ အားလုံး ဆုံးရှုံးသွားပါလိမ့်မယ်။

Module က evaluate လုပ်ပြီးသွားပြီးနောက်မှာလည်း `evaluate()` ကို နောက်တစ်ကြိမ် ထပ်ခေါ်နိုင်ပါတယ် — အဲဒီအခါမှာ:

1. ကနဦး evaluation က အောင်မြင်မှုနဲ့ အဆုံးသတ်ခဲ့ရင် (`module.status` က `'evaluated'`) — ဘာမှ မလုပ်ဘဲ `undefined` အဖြစ် resolve ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။
2. ကနဦး evaluation ရဲ့ ရလဒ်က exception တစ်ခုဆိုရင် (`module.status` က `'errored'`) — ကနဦး evaluation က ဖြစ်ပေါ်စေခဲ့တဲ့ exception နဲ့ပဲ ပြန်ပြီး reject လုပ်ပါလိမ့်မယ်။

Module ကို evaluate လုပ်နေဆဲ (`module.status` က `'evaluating'`) အချိန်မှာ ဒီ method ကို ခေါ်လို့ မရပါဘူး။

### `module.identifier`

* Type: {string}

Constructor ထဲမှာ သတ်မှတ်ထားတဲ့အတိုင်း လက်ရှိ module ရဲ့ identifier ပါ။

### `module.link(linker)`

* `linker` {Function}
  * `specifier` {string} တောင်းဆိုထားတဲ့ module ရဲ့ specifier ပါ:

    ```mjs
    import foo from 'foo';
    //              ^^^^^ the module specifier
    ```

  * `referencingModule` {vm.Module} `link()` ကို ခေါ်ထားတဲ့ `Module` object ပါ။

  * `extra` {Object}
    * `attributes` {Object} Attribute ကနေ လာတဲ့ data ပါ:

      ```mjs
      import foo from 'foo' with { name: 'value' };
      //                         ^^^^^^^^^^^^^^^^^ the attribute
      ```

      ECMA-262 အရ — hosts တွေက မပံ့ပိုးထားတဲ့ (unsupported) attribute တစ်ခု ရှိနေရင် error တစ်ခုကို ဖြစ်ပေါ်စေဖို့ မျှော်လင့်ပါတယ်။
    * `assert` {Object} `extra.attributes` ရဲ့ alias တစ်ခုပါ။

  * Returns: {vm.Module|Promise}

* Returns: {Promise}

Module ရဲ့ dependencies တွေကို link လုပ်ပါတယ်။ ဒီ method ကို evaluation မလုပ်ခင် ခေါ်ရပြီး — module တစ်ခုအတွက် တစ်ကြိမ်သာ ခေါ်လို့ရပါတယ်။

Modules တွေကို synchronously ဖြစ်စေ asynchronously ဖြစ်စေ link လုပ်ဖို့ [`sourceTextModule.linkRequests(modules)`][] နဲ့ [`sourceTextModule.instantiate()`][] ကို သုံးပါ။

Function က `Module` object တစ်ခု သို့မဟုတ် နောက်ဆုံးမှာ `Module` object တစ်ခုအဖြစ် resolve ဖြစ်တဲ့ `Promise` တစ်ခုကို ပြန်ပေးဖို့ မျှော်လင့်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ `Module` က အောက်ပါ မပြောင်းလဲနိုင်တဲ့ သတ်မှတ်ချက် (invariants) နှစ်ခုကို ကျေနပ်စေရပါမယ်:

* Parent `Module` နဲ့ context တစ်ခုတည်း ဖြစ်ရပါမယ်။
* ၎င်းရဲ့ `status` က `'errored'` မဖြစ်ရပါဘူး။

ပြန်ပေးလိုက်တဲ့ `Module` ရဲ့ `status` က `'unlinked'` ဆိုရင် — ဒီ method ကို ပေးထားတဲ့ `linker` function နဲ့ပဲ ပြန်ပေးလိုက်တဲ့ `Module` အပေါ်မှာ ထပ်ခါထပ်ခါ (recursively) ခေါ်ပါလိမ့်မယ်။

`link()` က `Promise` တစ်ခုကို ပြန်ပေးပါတယ် — linking instances တွေ အားလုံး valid `Module` တစ်ခုအဖြစ် resolve ဖြစ်သွားရင် resolve ဖြစ်ပြီး — linker function က exception တစ်ခု throw လုပ်တာ သို့မဟုတ် invalid `Module` တစ်ခုကို ပြန်ပေးတာမျိုး ဖြစ်ခဲ့ရင်တော့ rejected ဖြစ်ပါလိမ့်မယ်။

Linker function က ECMAScript specification ထဲက implementation-defined (အကောင်အထည်ဖော်မှုအလိုက် သတ်မှတ်သော) [HostResolveImportedModule][] abstract operation နဲ့ အကြမ်းဖျင်း ကိုက်ညီပြီး — အဓိက ကွာခြားချက် အနည်းငယ် ရှိပါတယ်:

* [HostResolveImportedModule][] က synchronous ဖြစ်ချိန်မှာ linker function က asynchronous ဖြစ်ခွင့် ရှိပါတယ်။

Module linking လုပ်နေစဉ် သုံးတဲ့ တကယ့် [HostResolveImportedModule][] implementation က — linking လုပ်နေစဉ်အတွင်း link လုပ်လိုက်တဲ့ modules တွေကို ပြန်ပေးတဲ့ ဟာတစ်ခု ဖြစ်ပါတယ်။ အဲဒီအချိန်မှာ modules တွေ အားလုံး အပြည့်အဝ link လုပ်ပြီးသား ဖြစ်နေမှာမို့ — [HostResolveImportedModule][] implementation က specification အရ အပြည့်အဝ synchronous ဖြစ်ပါတယ်။

ECMAScript specification ထဲက [Cyclic Module Record][]s တွေရဲ့ [Link() concrete method][] field နဲ့ ကိုက်ညီပါတယ်။

### `module.namespace`

* Type: {Object}

Module ရဲ့ namespace object ပါ။ Linking (`module.link()`) ပြီးဆုံးသွားမှသာ ဒါကို ရနိုင်ပါတယ်။

ECMAScript specification ထဲက [GetModuleNamespace][] abstract operation နဲ့ ကိုက်ညီပါတယ်။

### `module.status`

* Type: {string}

Module ရဲ့ လက်ရှိ အခြေအနေပါ။ အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်:

* `'unlinked'`: `module.link()` ကို မခေါ်ရသေးပါဘူး။

* `'linking'`: `module.link()` ကို ခေါ်ထားပြီးသားပေမယ့် — linker function က ပြန်ပေးထားတဲ့ Promises တွေ အားလုံး resolve ဖြစ်သေးတာ မဟုတ်ပါဘူး။

* `'linked'`: Module ကို အောင်မြင်စွာ link လုပ်ပြီးပြီ — ၎င်းရဲ့ dependencies တွေ အားလုံးလည်း link ဖြစ်နေပါပြီ — ဒါပေမယ့် `module.evaluate()` ကို မခေါ်ရသေးပါဘူး။

* `'evaluating'`: Module ကို ၎င်းကိုယ်တိုင် သို့မဟုတ် parent module တစ်ခုပေါ်က `module.evaluate()` ကနေတစ်ဆင့် evaluate လုပ်နေပါတယ်။

* `'evaluated'`: Module ကို အောင်မြင်စွာ evaluate လုပ်ပြီးပါပြီ။

* `'errored'`: Module ကို evaluate လုပ်ပြီးပေမယ့် — exception တစ်ခု throw လုပ်ခဲ့ပါတယ်။

`'errored'` ကလွဲလို့ — ဒီ status string က specification ထဲက [Cyclic Module Record][] ရဲ့ `[[Status]]` field နဲ့ ကိုက်ညီပါတယ်။ `'errored'` က specification ထဲက `'evaluated'` နဲ့ ကိုက်ညီပေမယ့် — `[[EvaluationError]]` ကို `undefined` မဟုတ်တဲ့ တန်ဖိုးတစ်ခုနဲ့ သတ်မှတ်ထားပါတယ်။

## Class: `vm.SourceTextModule`

> Stability: 1 - Experimental

ဒီ feature က `--experimental-vm-modules` command flag ကို ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

* Extends: {vm.Module}

`vm.SourceTextModule` class က ECMAScript specification ထဲမှာ သတ်မှတ်ထားတဲ့ [Source Text Module Record][] ကို ပံ့ပိုးပေးပါတယ်။

### `new vm.SourceTextModule(code[, options])`

* `code` {string} Parse လုပ်ရမယ့် JavaScript Module code ပါ
* `options`
  * `identifier` {string} Stack traces တွေထဲမှာ သုံးတဲ့ string ပါ။ **Default:** `'vm:module(i)'` — ဒီမှာ `i` က context-specific ဖြစ်တဲ့ ကြီးစဉ်ငယ်လိုက် index တစ်ခု ဖြစ်ပါတယ်။
  * `cachedData` {Buffer|TypedArray|DataView} ပေးထားတဲ့ source အတွက် V8 ရဲ့ code cache data ပါဝင်တဲ့ optional `Buffer` (သို့) `TypedArray`, (သို့) `DataView` တစ်ခုပါ။ `code` က ဒီ `cachedData` ကို ဖန်တီးခဲ့တဲ့ module ရဲ့ code နဲ့ အတူတူပဲ ဖြစ်ရပါမယ်။
  * `context` {Object} ဒီ `Module` ကို compile လုပ်ပြီး evaluate လုပ်ရမယ့် — `vm.createContext()` method က ပြန်ပေးတဲ့ — [contextified][] object ပါ။ Context ကို မသတ်မှတ်ထားရင် — module ကို လက်ရှိ execution context ထဲမှာ evaluate လုပ်ပါတယ်။
  * `lineOffset` {integer} ဒီ `Module` က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ ပြသမယ့် line number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `columnOffset` {integer} ဒီ `Module` က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ ပြသမယ့် ပထမ line ရဲ့ column number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `initializeImportMeta` {Function} ဒီ `Module` ကို evaluate လုပ်နေစဉ် `import.meta` ကို initialize လုပ်ဖို့ ခေါ်ပါတယ်။
    * `meta` {import.meta}
    * `module` {vm.SourceTextModule}
  * `importModuleDynamically` {Function} ဒီ module ကို evaluate လုပ်နေစဉ် `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမလဲ သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment တစ်ခုထဲမှာ ဒါကို သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် — [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။

`SourceTextModule` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

`import.meta` object ပေါ်မှာ objects တွေအနေနဲ့ သတ်မှတ်ပေးထားတဲ့ properties တွေက — module ကို သတ်မှတ်ထားတဲ့ `context` ရဲ့ အပြင်ဘက်က အချက်အလက်တွေဆီ ဝင်ရောက်ခွင့် ပေးနိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ context တစ်ခုထဲမှာ objects တွေကို ဖန်တီးဖို့ `vm.runInContext()` ကို သုံးပါ။

```mjs
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    context: contextifiedObject,
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// The module has an empty `moduleRequests` array.
module.linkRequests([]);
module.instantiate();
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('({})', contextifiedObject);
```

```cjs
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      context: contextifiedObject,
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // The module has an empty `moduleRequests` array.
  module.linkRequests([]);
  module.instantiate();
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('({})', contextifiedObject);
})();
```

### `sourceTextModule.createCachedData()`

* Returns: {Buffer}

`SourceTextModule` constructor ရဲ့ `cachedData` option နဲ့ သုံးလို့ရမယ့် code cache တစ်ခုကို ဖန်တီးပါတယ်။ `Buffer` တစ်ခုကို ပြန်ပေးပါတယ်။ Module ကို evaluate မလုပ်ရသေးခင်အထိ ဒီ method ကို အကြိမ်အရေအတွက် ဘယ်လောက်ပဲ ဖြစ်ဖြစ် ခေါ်လို့ရပါတယ်။

`SourceTextModule` ရဲ့ code cache ထဲမှာ JavaScript ကနေ ကြည့်လို့ရတဲ့ (observable) states တွေ ဘာမှ မပါဝင်ပါဘူး။ Code cache ကို script source နဲ့အတူ သိမ်းဆည်းထားပြီး — `SourceTextModule` instance အသစ်တွေကို အကြိမ်များစွာ တည်ဆောက်ဖို့ သုံးတာက လုံခြုံပါတယ်။

`SourceTextModule` source ထဲက functions တွေကို lazily compiled အဖြစ် မှတ်သားထားနိုင်ပြီး — `SourceTextModule` ကို တည်ဆောက်တဲ့အချိန်မှာ compile လုပ်ထားတာ မဟုတ်ပါဘူး။ ဒီ functions တွေကို ပထမဆုံးအကြိမ် ခေါ်လိုက်တဲ့အခါမှသာ compile လုပ်ပါလိမ့်မယ်။ Code cache က V8 က `SourceTextModule` အကြောင်း လက်ရှိ သိထားတဲ့ — နောင်ကာလ compilations တွေကို မြန်ဆန်စေဖို့ သုံးနိုင်တဲ့ — metadata တွေကို serialize လုပ်ပေးပါတယ်။

```js
// Create an initial module
const module = new vm.SourceTextModule('const a = 1;');

// Create cached data from this module
const cachedData = module.createCachedData();

// Create a new module using the cached data. The code must be the same.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```

### `sourceTextModule.dependencySpecifiers`

> Stability: 0 - Deprecated: Use [`sourceTextModule.moduleRequests`][] instead.

* Type: {string\[]}

ဒီ module ရဲ့ dependencies အားလုံးရဲ့ specifiers တွေပါ။ ပြန်ပေးလိုက်တဲ့ array က frozen (ပြုပြင် ပြောင်းလဲလို့ မရအောင် ပိတ်ထား) ဖြစ်ပြီး — ၎င်းကို ပြောင်းလဲမှုတွေ ဘာမှ မလုပ်နိုင်ပါဘူး။

ECMAScript specification ထဲက [Cyclic Module Record][]s တွေရဲ့ `[[RequestedModules]]` field နဲ့ ကိုက်ညီပါတယ်။

### `sourceTextModule.hasAsyncGraph()`

* Returns: {boolean}

Dependency graph တစ်ခုလုံးကို ဖြတ်သန်း စစ်ဆေးပြီး — ၎င်းရဲ့ dependencies တွေထဲက module တစ်ခုခု သို့မဟုတ် ဒီ module ကိုယ်တိုင်မှာ top-level `await` expressions တွေ ပါဝင်နေရင် `true` ကို — မပါဝင်ရင်တော့ `false` ကို ပြန်ပေးပါတယ်။

Graph က လုံလောက်အောင် ကြီးနေရင် ဒီရှာဖွေမှုက နှေးနိုင်ပါတယ်။

ဒါက module ကို အရင်ဆုံး instantiate လုပ်ထားဖို့ လိုအပ်ပါတယ်။ Module ကို instantiate မလုပ်ရသေးဘူးဆိုရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### `sourceTextModule.hasTopLevelAwait()`

* Returns: {boolean}

Module ကိုယ်တိုင်မှာ top-level `await` expressions တွေ ပါဝင်မပါဝင်ကို ပြန်ပေးပါတယ်။

ဒါက ECMAScript specification ထဲက [Cyclic Module Record][] ရဲ့ `[[HasTLA]]` field နဲ့ ကိုက်ညီပါတယ်။

### `sourceTextModule.instantiate()`

* Returns: {undefined}

Link လုပ်ထားတဲ့ requested modules တွေနဲ့အတူ module ကို instantiate လုပ်ပါတယ်။

ဒါက module ရဲ့ imported bindings တွေကို — re-exported binding names တွေ အပါအဝင် — resolve လုပ်ပေးပါတယ်။ Resolve လုပ်လို့ မရတဲ့ bindings တွေ ရှိနေရင် — error တစ်ခုကို synchronously throw လုပ်ပါလိမ့်မယ်။

Requested modules တွေထဲမှာ cyclic dependencies တွေ ပါဝင်နေရင် — ဒီ method ကို မခေါ်ခင် cycle ထဲက modules တွေ အားလုံးအပေါ်မှာ [`sourceTextModule.linkRequests(modules)`][] method ကို ခေါ်ထားရပါမယ်။

### `sourceTextModule.linkRequests(modules)`

* `modules` {vm.Module\[]} ဒီ module က မှီခိုနေတဲ့ `vm.Module` objects တွေရဲ့ array ပါ။ Array ထဲက modules တွေရဲ့ အစဉ်လိုက်မှုက [`sourceTextModule.moduleRequests`][] ရဲ့ အစဉ်လိုက်မှုပါ။
* Returns: {undefined}

Module ရဲ့ dependencies တွေကို link လုပ်ပါတယ်။ ဒီ method ကို evaluation မလုပ်ခင် ခေါ်ရပြီး — module တစ်ခုအတွက် တစ်ကြိမ်သာ ခေါ်လို့ရပါတယ်။

`modules` array ထဲက module instances တွေရဲ့ အစဉ်လိုက်မှုက [`sourceTextModule.moduleRequests`][] ကို resolve လုပ်တဲ့ အစဉ်လိုက်မှုနဲ့ ကိုက်ညီသင့်ပါတယ်။ Module requests နှစ်ခုမှာ specifier နဲ့ import attributes တွေ အတူတူဖြစ်နေရင် — ၎င်းတို့ကို module instance တစ်ခုတည်းနဲ့ resolve လုပ်ရပါမယ် — မဟုတ်ရင် `ERR_MODULE_LINK_MISMATCH` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဥပမာ — ဒီ module အတွက် requests တွေကို link လုပ်တဲ့အခါ:

```mjs
import foo from 'foo';
import source Foo from 'foo';
```

Module requests နှစ်ခုက တူညီပေမယ့် phase နှစ်ခုမှာ ရှိနေတာမို့ — `modules` array ထဲမှာ instance တစ်ခုတည်းဆီကို ရည်ညွှန်းချက် (references) နှစ်ခု ပါဝင်ရပါမယ်။

Module မှာ dependencies မရှိဘူးဆိုရင် — `modules` array က ဗလာ ဖြစ်နိုင်ပါတယ်။

Users တွေက `sourceTextModule.moduleRequests` ကို သုံးပြီး ECMAScript specification ထဲက host-defined [HostLoadImportedModule][] abstract operation ကို အကောင်အထည်ဖော်နိုင်သလို — `sourceTextModule.linkRequests()` ကို သုံးပြီး specification က သတ်မှတ်ထားတဲ့ [FinishLoadingImportedModule][] ကို — dependencies တွေ အားလုံးကို တစ်ပြိုင်နက် (batch) အနေနဲ့ — module အပေါ်မှာ ခေါ်ယူနိုင်ပါတယ်။

Dependencies တွေရဲ့ resolution က synchronous လား asynchronous လားဆိုတာကို `SourceTextModule` ကို ဖန်တီးသူက ဆုံးဖြတ်ရပါတယ်။

`modules` array ထဲက module တစ်ခုချင်းစီကို link လုပ်ပြီးတိုင်း — [`sourceTextModule.instantiate()`][] ကို ခေါ်ပါ။

### `sourceTextModule.moduleRequests`

* Type: {ModuleRequest\[]} ဒီ module ရဲ့ dependencies တွေပါ။

ဒီ module ရဲ့ requested import dependencies တွေပါ။ ပြန်ပေးလိုက်တဲ့ array က frozen ဖြစ်ပြီး — ၎င်းကို ပြောင်းလဲမှုတွေ ဘာမှ မလုပ်နိုင်ပါဘူး။

ဥပမာ — အောက်ပါ source text ကို ပေးထားတယ်ဆိုရင်:

```mjs
import foo from 'foo';
import fooAlias from 'foo';
import bar from './bar.js';
import withAttrs from '../with-attrs.ts' with { arbitraryAttr: 'attr-val' };
import source Module from 'wasm-mod.wasm';
```

`sourceTextModule.moduleRequests` ရဲ့ တန်ဖိုးက အောက်ပါအတိုင်း ဖြစ်ပါလိမ့်မယ်:

```js
[
  {
    specifier: 'foo',
    attributes: {},
    phase: 'evaluation',
  },
  {
    specifier: 'foo',
    attributes: {},
    phase: 'evaluation',
  },
  {
    specifier: './bar.js',
    attributes: {},
    phase: 'evaluation',
  },
  {
    specifier: '../with-attrs.ts',
    attributes: { arbitraryAttr: 'attr-val' },
    phase: 'evaluation',
  },
  {
    specifier: 'wasm-mod.wasm',
    attributes: {},
    phase: 'source',
  },
];
```

## Class: `vm.SyntheticModule`

> Stability: 1 - Experimental

ဒီ feature က `--experimental-vm-modules` command flag ကို ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

* Extends: {vm.Module}

`vm.SyntheticModule` class က WebIDL specification ထဲမှာ သတ်မှတ်ထားတဲ့ [Synthetic Module Record][] ကို ပံ့ပိုးပေးပါတယ်။ Synthetic modules တွေရဲ့ ရည်ရွယ်ချက်က — JavaScript မဟုတ်တဲ့ (non-JavaScript) sources တွေကို ECMAScript module graphs တွေဆီ ထုတ်ဖော်ပြသဖို့ generic interface တစ်ခု ပံ့ပိုးပေးဖို့ ဖြစ်ပါတယ်။

```mjs
import { SyntheticModule } from 'node:vm';

const source = '{ "a": 1 }';
const syntheticModule = new SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Use `syntheticModule` in linking
(async () => {
  await syntheticModule.link(() => {});
  await syntheticModule.evaluate();

  console.log('Default export:', syntheticModule.namespace.default);
})();
```

```cjs
const { SyntheticModule } = require('node:vm');

const source = '{ "a": 1 }';
const syntheticModule = new SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Use `syntheticModule` in linking
(async () => {
  await syntheticModule.link(() => {});
  await syntheticModule.evaluate();

  console.log('Default export:', syntheticModule.namespace.default);
})();
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])`

* `exportNames` {string\[]} Module ကနေ export လုပ်မယ့် names တွေရဲ့ array ပါ။
* `evaluateCallback` {Function} Module ကို evaluate လုပ်တဲ့အခါ ခေါ်ယူပါတယ်။
* `options`
  * `identifier` {string} Stack traces တွေထဲမှာ သုံးတဲ့ string ပါ။ **Default:** `'vm:module(i)'` — ဒီမှာ `i` က context-specific ဖြစ်တဲ့ ကြီးစဉ်ငယ်လိုက် index တစ်ခု ဖြစ်ပါတယ်။
  * `context` {Object} ဒီ `Module` ကို compile လုပ်ပြီး evaluate လုပ်ရမယ့် — `vm.createContext()` method က ပြန်ပေးတဲ့ — [contextified][] object ပါ။

`SyntheticModule` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

ဒီ instance ရဲ့ exports တွေဆီ သတ်မှတ်ပေးထားတဲ့ objects တွေက — module ကို import လုပ်သူတွေကို သတ်မှတ်ထားတဲ့ `context` ရဲ့ အပြင်ဘက်က အချက်အလက်တွေဆီ ဝင်ရောက်ခွင့် ပေးနိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ context တစ်ခုထဲမှာ objects တွေကို ဖန်တီးဖို့ `vm.runInContext()` ကို သုံးပါ။

### `syntheticModule.setExport(name, value)`

* `name` {string} သတ်မှတ်ရမယ့် export ရဲ့ နာမည်ပါ။
* `value` {any} Export ကို သတ်မှတ်ပေးရမယ့် တန်ဖိုးပါ။

ဒီ method က module ရဲ့ export binding slots တွေကို ပေးထားတဲ့ တန်ဖိုးနဲ့ သတ်မှတ်ပေးပါတယ်။

```mjs
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```cjs
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```

## Type: `ModuleRequest`

* Type: {Object}
  * `specifier` {string} တောင်းဆိုထားတဲ့ module ရဲ့ specifier ပါ။
  * `attributes` {Object} [ImportDeclaration][] ထဲက [WithClause][] ဆီကို ဖြတ်သန်းပေးတဲ့ `"with"` တန်ဖိုးပါ — တန်ဖိုး မပေးထားဘူးဆိုရင်တော့ ဗလာ object တစ်ခု ဖြစ်ပါတယ်။
  * `phase` {string} တောင်းဆိုထားတဲ့ module ရဲ့ phase (`"source"` (သို့) `"evaluation"`) ပါ။

`ModuleRequest` တစ်ခုက — သတ်မှတ်ထားတဲ့ import attributes နဲ့ phase တစ်ခုနဲ့အတူ module တစ်ခုကို import လုပ်ဖို့ တောင်းဆိုချက်ကို ကိုယ်စားပြုပါတယ်။

## `vm.compileFunction(code[, params[, options]])`

* `code` {string} Compile လုပ်ရမယ့် function ရဲ့ body (ကိုယ်ထည်) ပါ။
* `params` {string\[]} Function အတွက် parameter တွေ အားလုံး ပါဝင်တဲ့ strings တွေရဲ့ array ပါ။
* `options` {Object}
  * `filename` {string} ဒီ script က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ သုံးမယ့် filename ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `''`။
  * `lineOffset` {number} ဒီ script က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ ပြသမယ့် line number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `columnOffset` {number} ဒီ script က ထုတ်လုပ်တဲ့ stack traces တွေထဲမှာ ပြသမယ့် ပထမ line ရဲ့ column number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `cachedData` {Buffer|TypedArray|DataView} ပေးထားတဲ့ source အတွက် V8 ရဲ့ code cache data ပါဝင်တဲ့ optional `Buffer` (သို့) `TypedArray`, (သို့) `DataView` တစ်ခုပါ။ ဒါက `code` နဲ့ `params` တူညီတဲ့ [`vm.compileFunction()`][] ဆီကို အရင်က ခေါ်ထားမှုတစ်ခုကနေ ထုတ်လုပ်ထားတာ ဖြစ်ရပါမယ်။
  * `produceCachedData` {boolean} Cache data အသစ်ကို ထုတ်လုပ်မလား မထုတ်လုပ်ဘူးလား သတ်မှတ်ပေးပါတယ်။ **Default:** `false`။
  * `parsingContext` {Object} ပြောထားတဲ့ function ကို compile လုပ်သင့်တဲ့ [contextified][] object ပါ။
  * `contextExtensions` {Object\[]} Compile လုပ်နေစဉ် အသုံးချရမယ့် context extensions တွေ (လက်ရှိ scope ကို wrap လုပ်ထားတဲ့ objects တွေ) ပါဝင်တဲ့ array တစ်ခုပါ။ **Default:** `[]`။
  * `importModuleDynamically` {Function|vm.constants.USE\_MAIN\_CONTEXT\_DEFAULT\_LOADER} ဒီ function ကို evaluate လုပ်နေစဉ် `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမလဲ သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment တစ်ခုထဲမှာ ဒါကို သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် — [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။
* Returns: {Function}

ပေးထားတဲ့ code ကို ပံ့ပိုးပေးထားတဲ့ context ထဲမှာ compile လုပ်ပြီး (context မပေးထားဘူးဆိုရင် — လက်ရှိ context ကို သုံးပါတယ်) — ပေးထားတဲ့ `params` တွေနဲ့အတူ function တစ်ခုအတွင်းမှာ wrap လုပ်ထားတဲ့ ပုံစံနဲ့ ၎င်းကို ပြန်ပေးပါတယ်။

## `vm.constants`

* Type: {Object}

VM လုပ်ဆောင်ချက်တွေအတွက် အသုံးများတဲ့ constants တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`

> Stability: 1.1 - Active development

`vm.Script` နဲ့ `vm.compileFunction()` တို့ဆီက `importModuleDynamically` option အနေနဲ့ သုံးလို့ရတဲ့ constant တစ်ခုပါ — ဒါဆိုရင် Node.js က တောင်းဆိုထားတဲ့ module ကို load လုပ်ဖို့ main context ကနေ default ESM loader ကို သုံးပါလိမ့်မယ်။

အသေးစိတ် အချက်အလက်တွေအတွက် — [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။

## `vm.createContext([contextObject[, options]])`

* `contextObject` {Object|vm.constants.DONT\_CONTEXTIFY|undefined} [`vm.constants.DONT_CONTEXTIFY`][] (သို့) [contextified][] လုပ်မယ့် object တစ်ခု — နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ `undefined` ဆိုရင် — backward compatibility (နောက်ကြောင်း သဟဇာတဖြစ်မှု) အတွက် — contextified လုပ်ထားတဲ့ ဗလာ object တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။
* `options` {Object}
  * `name` {string} အသစ်ဖန်တီးလိုက်တဲ့ context ရဲ့ လူဖတ်လို့ရတဲ့ (human-readable) နာမည်ပါ။ **Default:** `'VM Context i'` — ဒီမှာ `i` က ဖန်တီးလိုက်တဲ့ context တွေရဲ့ ကြီးစဉ်ငယ်လိုက် ဂဏန်း အညွှန်း (ascending numerical index) တစ်ခု ဖြစ်ပါတယ်။
  * `origin` {string} ပြသမှု ရည်ရွယ်ချက်တွေအတွက် အသစ်ဖန်တီးလိုက်တဲ့ context နဲ့ သက်ဆိုင်တဲ့ [Origin][origin] ပါ။ Origin ကို URL တစ်ခုလို format လုပ်သင့်ပေမယ့် — scheme, host နဲ့ port (လိုအပ်ရင်) တို့သာ ပါဝင်ပြီး — [`URL`][] object တစ်ခုရဲ့ [`url.origin`][] property ရဲ့ တန်ဖိုးနဲ့ တူညီရပါမယ်။ အထူးခြားဆုံးက — ဒီ string ထဲမှာ နောက်ဆုံး slash ကို ချန်လှပ်ထားရပါမယ်; ဘာလို့လဲဆိုတော့ အဲဒါက path တစ်ခုကို ညွှန်းပြတာ ဖြစ်လို့ပါ။ **Default:** `''`။
  * `codeGeneration` {Object}
    * `strings` {boolean} false အဖြစ် သတ်မှတ်ထားရင် — `eval` (သို့) function constructors (`Function`, `GeneratorFunction`, စသည်) တွေဆီကို ခေါ်ဆိုမှုတွေ အားလုံးက `EvalError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
    * `wasm` {boolean} false အဖြစ် သတ်မှတ်ထားရင် — WebAssembly module တစ်ခုကို compile လုပ်ဖို့ ကြိုးစားမှုတိုင်းက `WebAssembly.CompileError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
  * `microtaskMode` {string} `afterEvaluate` အဖြစ် သတ်မှတ်ထားရင် — microtasks တွေ (`Promise`s နဲ့ `async function`s တွေကနေတစ်ဆင့် စီစဉ်ထားတဲ့ tasks တွေ) ကို script တစ်ခု [`script.runInContext()`][] ကနေတစ်ဆင့် run လုပ်ပြီးတာနဲ့ ချက်ချင်း run လုပ်ပေးပါလိမ့်မယ်။ အဲဒီအခြေအနေမျိုးမှာ ၎င်းတို့ကို `timeout` နဲ့ `breakOnSigint` တို့ရဲ့ scope တွေထဲမှာ ထည့်သွင်း တွက်ချက်ပါတယ်။
  * `importModuleDynamically` {Function|vm.constants.USE\_MAIN\_CONTEXT\_DEFAULT\_LOADER} ဒီ context ထဲမှာ referrer script (သို့) module တစ်ခု မရှိဘဲ `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမလဲ သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment တစ်ခုထဲမှာ ဒါကို သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် — [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။
* Returns: {Object} contextified object ပါ။

ပေးထားတဲ့ `contextObject` က object တစ်ခုဆိုရင် — `vm.createContext()` method က အဲဒီ object ကို [prepare that object][contextified] — [`vm.runInContext()`][] (သို့) [`script.runInContext()`][] တို့ဆီကို ခေါ်တဲ့အခါတွေမှာ သုံးနိုင်အောင် — ၎င်းဆီကို reference တစ်ခု ပြန်ပေးပါတယ်။ အဲဒီလို scripts တွေရဲ့ အတွင်းမှာ — global object ကို `contextObject` နဲ့ wrap လုပ်ထားပြီး — ၎င်းရဲ့ ရှိပြီးသား properties တွေ အားလုံး ထိန်းသိမ်းထားတဲ့အပြင် — စံ [global object][] တစ်ခုမှာ ရှိတဲ့ built-in objects နဲ့ functions တွေလည်း ပါဝင်ပါတယ်။ Vm module က run လုပ်တဲ့ scripts တွေရဲ့ အပြင်ဘက်မှာတော့ — global variables တွေက မပြောင်းလဲဘဲ ရှိနေပါလိမ့်မယ်။

```mjs
import { createContext, runInContext } from 'node:vm';

global.globalVar = 3;

const context = { globalVar: 1 };
createContext(context);

runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```

```cjs
const { createContext, runInContext } = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
createContext(context);

runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```

`contextObject` ကို ချန်လှပ်ထားရင် (သို့မဟုတ် `undefined` အဖြစ် တိုက်ရိုက် ပေးထားရင်) — [contextified][] လုပ်ထားတဲ့ ဗလာ object အသစ်တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

အသစ်ဖန်တီးလိုက်တဲ့ context ထဲက global object ကို [contextified][] လုပ်လိုက်တဲ့အခါ — သာမန် global objects တွေနဲ့ ယှဉ်ရင် ထူးခြားချက် (quirks) တစ်ချို့ ရှိပါတယ်။ ဥပမာ — ၎င်းကို freeze လုပ်လို့ မရပါဘူး။ Contextifying ရဲ့ ထူးခြားချက်တွေ မပါဘဲ context တစ်ခုကို ဖန်တီးချင်ရင် — `contextObject` argument အနေနဲ့ [`vm.constants.DONT_CONTEXTIFY`][] ကို ပေးပါ။ အသေးစိတ်အတွက် [`vm.constants.DONT_CONTEXTIFY`][] ရဲ့ documentation ကို ကြည့်ပါ။

`vm.createContext()` method က scripts အများအပြားကို run လုပ်ဖို့ သုံးနိုင်မယ့် context တစ်ခုတည်းကို ဖန်တီးရာမှာ အဓိက အသုံးဝင်ပါတယ်။ ဥပမာ — web browser တစ်ခုကို အတုယူ (emulate) လုပ်နေတယ်ဆိုရင် — ဒီ method ကို သုံးပြီး window တစ်ခုရဲ့ global object ကို ကိုယ်စားပြုတဲ့ context တစ်ခုတည်းကို ဖန်တီးပြီး — `` tags တွေ အားလုံးကို အဲဒီ context ထဲမှာ အတူတကွ run လုပ်နိုင်ပါတယ်။

Context ရဲ့ ပေးထားတဲ့ `name` နဲ့ `origin` တို့ကို Inspector API ကနေတစ်ဆင့် မြင်နိုင်အောင် လုပ်ပေးပါတယ်။

## `vm.isContext(object)`

* `object` {Object}
* Returns: {boolean}

ပေးထားတဲ့ `object` ကို [`vm.createContext()`][] သုံးပြီး [contextified][] လုပ်ထားရင် — (သို့) ၎င်းက [`vm.constants.DONT_CONTEXTIFY`][] သုံးပြီး ဖန်တီးထားတဲ့ context တစ်ခုရဲ့ global object ဖြစ်နေရင် — `true` ကို ပြန်ပေးပါတယ်။

## `vm.measureMemory([options])`

> Stability: 1 - Experimental

လက်ရှိ V8 isolate ရဲ့ contexts တွေ အားလုံး (သို့မဟုတ် main context) က အသုံးပြုနေပြီး — V8 က သိထားတဲ့ — memory ကို တိုင်းတာပါတယ်။

* `options` {Object} Optional ပါ။
  * `mode` {string} `'summary'` (သို့) `'detailed'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ Summary mode မှာ — main context အတွက် တိုင်းတာထားတဲ့ memory ကိုသာ ပြန်ပေးပါတယ်။ Detailed mode မှာ — လက်ရှိ V8 isolate ရဲ့ contexts တွေ အားလုံးအတွက် တိုင်းတာထားတဲ့ memory ကို ပြန်ပေးပါတယ်။ **Default:** `'summary'`
  * `execution` {string} `'default'` (သို့) `'eager'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ Default execution နဲ့ဆိုရင် — promise က နောက် စီစဉ်ထားတဲ့ (scheduled) garbage collection စတင်ပြီးမှသာ resolve ဖြစ်ပါလိမ့်မယ် — အဲဒါက အချိန်အနည်းငယ် ကြာနိုင်သလို (နောက် GC မတိုင်ခင် program က ထွက်သွားရင် ဘယ်တော့မှလည်း မဖြစ်နိုင်ပါဘူး)။ Eager execution နဲ့ဆိုရင် — memory ကို တိုင်းတာဖို့ GC ကို ချက်ချင်း စတင်ပါလိမ့်မယ်။ **Default:** `'default'`
* Returns: {Promise} Memory ကို အောင်မြင်စွာ တိုင်းတာနိုင်ခဲ့ရင် — memory အသုံးပြုမှု အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။ မဟုတ်ရင်တော့ `ERR_CONTEXT_NOT_INITIALIZED` error တစ်ခုနဲ့ rejected ဖြစ်ပါလိမ့်မယ်။

ပြန်ပေးလိုက်တဲ့ Promise က resolve ဖြစ်နိုင်တဲ့ object ရဲ့ format က V8 engine နဲ့ သက်ဆိုင်တဲ့ (specific) ဟာတစ်ခု ဖြစ်ပြီး — V8 ရဲ့ version တစ်ခုကနေ နောက်တစ်ခုကို ပြောင်းတဲ့အခါ ပြောင်းလဲသွားနိုင်ပါတယ်။

ပြန်ပေးလိုက်တဲ့ ရလဒ်က `v8.getHeapSpaceStatistics()` က ပြန်ပေးတဲ့ statistics တွေနဲ့ ကွဲပြားပါတယ် — `vm.measureMemory()` က လက်ရှိ V8 engine instance ထဲက V8-specific contexts တစ်ခုချင်းစီ လက်လှမ်းမီနိုင်တဲ့ (reachable) memory ကို တိုင်းတာပေမယ့် — `v8.getHeapSpaceStatistics()` ရဲ့ ရလဒ်ကတော့ လက်ရှိ V8 instance ထဲက heap space တစ်ခုချင်းစီ သိမ်းပိုက်ထားတဲ့ memory ကို တိုင်းတာလို့ပါ။

```mjs
import { createContext, measureMemory } from 'node:vm';
// Measure the memory used by the main context.
measureMemory({ mode: 'summary' })
  // This is the same as vm.measureMemory()
  .then((result) => {
    // The current format is:
    // {
    //   total: { jsMemoryEstimate: 1601828, jsMemoryRange: [1601828, 5275288] },
    //   WebAssembly: { code: 0, metadata: 33962 },
    // }
    console.log(result);
  });

const context = createContext({ a: 1 });
measureMemory({ mode: 'detailed', execution: 'eager' }).then((result) => {
  // Reference the context here so that it won't be GC'ed
  // until the measurement is complete.
  console.log('Context:', context.a);
  // {
  //   total: { jsMemoryEstimate: 1767100, jsMemoryRange: [1767100, 5440560] },
  //   WebAssembly: { code: 0, metadata: 33962 },
  //   current: { jsMemoryEstimate: 1601828, jsMemoryRange: [1601828, 5275288] },
  //   other: [{ jsMemoryEstimate: 165272, jsMemoryRange: [Array] }],
  // }
  console.log(result);
});
```

```cjs
const { createContext, measureMemory } = require('node:vm');
// Measure the memory used by the main context.
measureMemory({ mode: 'summary' })
  // This is the same as vm.measureMemory()
  .then((result) => {
    // The current format is:
    // {
    //   total: { jsMemoryEstimate: 1601828, jsMemoryRange: [1601828, 5275288] },
    //   WebAssembly: { code: 0, metadata: 33962 },
    // }
    console.log(result);
  });

const context = createContext({ a: 1 });
measureMemory({ mode: 'detailed', execution: 'eager' }).then((result) => {
  // Reference the context here so that it won't be GC'ed
  // until the measurement is complete.
  console.log('Context:', context.a);
  // {
  //   total: { jsMemoryEstimate: 1767100, jsMemoryRange: [1767100, 5440560] },
  //   WebAssembly: { code: 0, metadata: 33962 },
  //   current: { jsMemoryEstimate: 1601828, jsMemoryRange: [1601828, 5275288] },
  //   other: [{ jsMemoryEstimate: 165272, jsMemoryRange: [Array] }],
  // }
  console.log(result);
});
```


## `vm.runInContext(code, contextifiedObject[, options])`

* `code` {string} Compile လုပ်ပြီး run လုပ်ရမယ့် JavaScript code ပါ။
* `contextifiedObject` {Object} `code` ကို compile လုပ်ပြီး run လုပ်တဲ့အခါ `global` အဖြစ် သုံးမယ့် [contextified][] object ပါ။
* `options` {Object|string}
  * `filename` {string} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ သုံးမယ့် filename ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `'evalmachine.<anonymous>'`။
  * `lineOffset` {number} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ ပြသမယ့် line number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `columnOffset` {number} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ ပြသမယ့် ပထမဆုံး line ရဲ့ column number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `displayErrors` {boolean} `true` ဖြစ်နေရင် — `code` ကို compile လုပ်နေစဉ် [`Error`][] တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — error ကို ဖြစ်စေတဲ့ code line ကို stack trace နဲ့ တွဲပြီး ထည့်ပေးပါတယ်။ **Default:** `true`။
  * `timeout` {integer} Execution ကို ရပ်တန့်စေခင် `code` ကို run လုပ်ရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို ရပ်တန့်လိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာနဲ့ execution ကို ရပ်တန့်ပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား event handlers တွေကို script execution အတောအတွင်း disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်လက် အလုပ်လုပ်ပါတယ်။ **Default:** `false`။
  * `cachedData` {Buffer|TypedArray|DataView} ပေးထားတဲ့ source အတွက် V8 ရဲ့ code cache data ပါတဲ့ optional `Buffer` (သို့) `TypedArray` (သို့) `DataView` တစ်ခုကို ပေးပါတယ်။
  * `importModuleDynamically` {Function|vm.constants.USE\_MAIN\_CONTEXT\_DEFAULT\_LOADER} ဒီ script ကို evaluate လုပ်နေစဉ် `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမယ်ဆိုတာကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment မှာ သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။

`vm.runInContext()` method က `code` ကို compile လုပ်ပြီး — `contextifiedObject` ရဲ့ context အတွင်းမှာ run လုပ်ကာ — ရလဒ်ကို ပြန်ပေးပါတယ်။ Run လုပ်နေတဲ့ code က local scope ကို လက်လှမ်းမီနိုင်မှာ မဟုတ်ပါဘူး။ `contextifiedObject` object က [`vm.createContext()`][] method ကို သုံးပြီး အရင်ကတည်းက [contextified][] လုပ်ထားပြီးသား ဖြစ်_ရပါမယ်_။

`options` က string တစ်ခုဆိုရင် — အဲဒါက filename ကို သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်။

အောက်ပါ ဥပမာက [contextified][] object တစ်ခုတည်းကို သုံးပြီး script အမျိုးမျိုးကို compile လုပ်ပြီး execute လုပ်တာကို ဖော်ပြပါတယ်:

```mjs
import { createContext, runInContext } from 'node:vm';

const contextObject = { globalVar: 1 };
createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

```cjs
const { createContext, runInContext } = require('node:vm');

const contextObject = { globalVar: 1 };
createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])`

* `code` {string} Compile လုပ်ပြီး run လုပ်ရမယ့် JavaScript code ပါ။
* `contextObject` {Object|vm.constants.DONT\_CONTEXTIFY|undefined} [`vm.constants.DONT_CONTEXTIFY`][] ဖြစ်စေ — [contextified][] လုပ်မယ့် object တစ်ခု ဖြစ်စေ ဖြစ်ပါတယ်။ `undefined` ဆိုရင် — backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် ဗလာ contextified object တစ်ခုကို ဖန်တီးပေးပါတယ်။
* `options` {Object|string}
  * `filename` {string} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ သုံးမယ့် filename ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `'evalmachine.<anonymous>'`။
  * `lineOffset` {number} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ ပြသမယ့် line number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `columnOffset` {number} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ ပြသမယ့် ပထမဆုံး line ရဲ့ column number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `displayErrors` {boolean} `true` ဖြစ်နေရင် — `code` ကို compile လုပ်နေစဉ် [`Error`][] တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — error ကို ဖြစ်စေတဲ့ code line ကို stack trace နဲ့ တွဲပြီး ထည့်ပေးပါတယ်။ **Default:** `true`။
  * `timeout` {integer} Execution ကို ရပ်တန့်စေခင် `code` ကို run လုပ်ရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို ရပ်တန့်လိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာနဲ့ execution ကို ရပ်တန့်ပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား event handlers တွေကို script execution အတောအတွင်း disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်လက် အလုပ်လုပ်ပါတယ်။ **Default:** `false`။
  * `contextName` {string} အသစ်ဖန်တီးလိုက်တဲ့ context ရဲ့ လူဖတ်လို့ရတဲ့ (human-readable) နာမည်ပါ။ **Default:** `'VM Context i'` — ဒီမှာ `i` က ဖန်တီးလိုက်တဲ့ context ရဲ့ စဉ်ဆက်မပြတ် တက်လာတဲ့ ဂဏန်း index ဖြစ်ပါတယ်။
  * `contextOrigin` {string} ပြသမှု ရည်ရွယ်ချက်တွေအတွက် အသစ်ဖန်တီးလိုက်တဲ့ context နဲ့ သက်ဆိုင်တဲ့ [Origin][origin] ပါ။ Origin က URL တစ်ခုလိုပဲ ပုံစံချရပြီး — scheme, host နဲ့ port (လိုအပ်ရင်) တို့ပဲ ပါဝင်ရပါမယ် — [`URL`][] object တစ်ခုရဲ့ [`url.origin`][] property ရဲ့ တန်ဖိုးလိုမျိုးပါ။ အထူးသဖြင့် — ဒီ string မှာ နောက်ဆုံးက trailing slash ကို ချန်လှပ်ထားရပါမယ် — ၎င်းက path တစ်ခုကို ရည်ညွှန်းနေလို့ပါ။ **Default:** `''`။
  * `contextCodeGeneration` {Object}
    * `strings` {boolean} `false` လို့ သတ်မှတ်ထားရင် — `eval` သို့မဟုတ် function constructors (`Function`, `GeneratorFunction`, စသည်) တွေဆီကို ခေါ်မှု အားလုံးက `EvalError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
    * `wasm` {boolean} `false` လို့ သတ်မှတ်ထားရင် — WebAssembly module တစ်ခုကို compile လုပ်ဖို့ ကြိုးစားမှု အားလုံးက `WebAssembly.CompileError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
  * `cachedData` {Buffer|TypedArray|DataView} ပေးထားတဲ့ source အတွက် V8 ရဲ့ code cache data ပါတဲ့ optional `Buffer` (သို့) `TypedArray` (သို့) `DataView` တစ်ခုကို ပေးပါတယ်။
  * `importModuleDynamically` {Function|vm.constants.USE\_MAIN\_CONTEXT\_DEFAULT\_LOADER} ဒီ script ကို evaluate လုပ်နေစဉ် `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမယ်ဆိုတာကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment မှာ သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။
  * `microtaskMode` {string} `afterEvaluate` လို့ သတ်မှတ်ထားရင် — microtasks တွေ (`Promise`s နဲ့ `async function`s တွေကနေတစ်ဆင့် schedule လုပ်ထားတဲ့ tasks တွေ) ကို script run ပြီးတာနဲ့ ချက်ချင်း run လုပ်ပါလိမ့်မယ်။ အဲဒီအခါမျိုးမှာ ၎င်းတို့က `timeout` နဲ့ `breakOnSigint` ရဲ့ scope တွေထဲမှာ ပါဝင်ပါတယ်။
* Returns: {any} Script ထဲမှာ လုပ်ဆောင်ခဲ့တဲ့ နောက်ဆုံး statement ရဲ့ ရလဒ်ပါ။

ဒီ method က `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)` ရဲ့ shortcut တစ်ခု ဖြစ်ပါတယ်။ `options` က string တစ်ခုဆိုရင် — အဲဒါက filename ကို သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်။

ဒါက တစ်ပြိုင်နက် အလုပ်များစွာကို လုပ်ဆောင်ပါတယ်:

1. Context အသစ်တစ်ခုကို ဖန်တီးပါတယ်။
2. `contextObject` က object တစ်ခုဆိုရင် — ၎င်းကို context အသစ်တစ်ခုနဲ့အတူ [contextifies][contextified] လုပ်ပါတယ်။ `contextObject` က undefined ဆိုရင် — object အသစ်တစ်ခုကို ဖန်တီးပြီး [contextifies][contextified] လုပ်ပါတယ်။ `contextObject` က [`vm.constants.DONT_CONTEXTIFY`][] ဆိုရင်တော့ — ဘာကိုမှ [contextify][contextified] လုပ်မှာ မဟုတ်ပါဘူး။
3. Code ကို `vm.Script` တစ်ခုအနေနဲ့ compile လုပ်ပါတယ်။
4. Compile လုပ်ထားတဲ့ code ကို ဖန်တီးထားတဲ့ context အတွင်းမှာ run လုပ်ပါတယ်။ ဒီ method ကို ခေါ်ထားတဲ့ scope ကို code က လက်လှမ်းမီနိုင်မှာ မဟုတ်ပါဘူး။
5. ရလဒ်ကို ပြန်ပေးပါတယ်။

အောက်ပါ ဥပမာက global variable တစ်ခုကို တိုးစေပြီး — variable အသစ်တစ်ခုကို သတ်မှတ်ပေးတဲ့ code ကို compile လုပ်ပြီး execute လုပ်ပါတယ်။ ဒီ globals တွေက `contextObject` ထဲမှာ ပါဝင်ပါတယ်။

```mjs
import { runInNewContext, constants } from 'node:vm';

const contextObject = {
  animal: 'cat',
  count: 2,
};

runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// This would throw if the context is created from a contextified object.
// vm.constants.DONT_CONTEXTIFY allows creating contexts with ordinary global objects that
// can be frozen.
const frozenContext = runInNewContext(
  'Object.freeze(globalThis); globalThis;',
  constants.DONT_CONTEXTIFY,
);
```

```cjs
const { runInNewContext, constants } = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// This would throw if the context is created from a contextified object.
// vm.constants.DONT_CONTEXTIFY allows creating contexts with ordinary global objects that
// can be frozen.
const frozenContext = runInNewContext(
  'Object.freeze(globalThis); globalThis;',
  constants.DONT_CONTEXTIFY,
);
```

## `vm.runInThisContext(code[, options])`

* `code` {string} Compile လုပ်ပြီး run လုပ်ရမယ့် JavaScript code ပါ။
* `options` {Object|string}
  * `filename` {string} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ သုံးမယ့် filename ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `'evalmachine.<anonymous>'`။
  * `lineOffset` {number} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ ပြသမယ့် line number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `columnOffset` {number} ဒီ script ကနေ ထုတ်လုပ်တဲ့ stack traces တွေမှာ ပြသမယ့် ပထမဆုံး line ရဲ့ column number offset ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `displayErrors` {boolean} `true` ဖြစ်နေရင် — `code` ကို compile လုပ်နေစဉ် [`Error`][] တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — error ကို ဖြစ်စေတဲ့ code line ကို stack trace နဲ့ တွဲပြီး ထည့်ပေးပါတယ်။ **Default:** `true`။
  * `timeout` {integer} Execution ကို ရပ်တန့်စေခင် `code` ကို run လုပ်ရမယ့် milliseconds အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Execution ကို ရပ်တန့်လိုက်ရင် — [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီတန်ဖိုးက strictly positive integer တစ်ခု ဖြစ်ရပါမယ်။
  * `breakOnSigint` {boolean} `true` ဆိုရင် — `SIGINT` (`Ctrl`+`C`) ကို လက်ခံရရှိတာနဲ့ execution ကို ရပ်တန့်ပြီး [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `process.on('SIGINT')` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ ရှိပြီးသား event handlers တွေကို script execution အတောအတွင်း disable လုပ်ထားပေမယ့် — အဲဒီနောက်မှာတော့ ဆက်လက် အလုပ်လုပ်ပါတယ်။ **Default:** `false`။
  * `cachedData` {Buffer|TypedArray|DataView} ပေးထားတဲ့ source အတွက် V8 ရဲ့ code cache data ပါတဲ့ optional `Buffer` (သို့) `TypedArray` (သို့) `DataView` တစ်ခုကို ပေးပါတယ်။
  * `importModuleDynamically` {Function|vm.constants.USE\_MAIN\_CONTEXT\_DEFAULT\_LOADER} ဒီ script ကို evaluate လုပ်နေစဉ် `import()` ကို ခေါ်လိုက်တဲ့အခါ modules တွေကို ဘယ်လို load လုပ်ရမယ်ဆိုတာကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Production environment မှာ သုံးဖို့ အကြံပြုလို့ မရပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် [Support of dynamic `import()` in compilation APIs][] ကို ကြည့်ပါ။
* Returns: {any} Script ထဲမှာ လုပ်ဆောင်ခဲ့တဲ့ နောက်ဆုံး statement ရဲ့ ရလဒ်ပါ။

`vm.runInThisContext()` က `code` ကို compile လုပ်ပြီး — လက်ရှိ `global` ရဲ့ context အတွင်းမှာ run လုပ်ကာ — ရလဒ်ကို ပြန်ပေးပါတယ်။ Run လုပ်နေတဲ့ code က local scope ကို လက်လှမ်းမီနိုင်မှာ မဟုတ်ဘူးဆိုပေမယ့် — လက်ရှိ `global` object ကိုတော့ လက်လှမ်းမီနိုင်ပါတယ်။

`options` က string တစ်ခုဆိုရင် — အဲဒါက filename ကို သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်။

အောက်ပါ ဥပမာက code တစ်ခုတည်းကို run လုပ်ဖို့ `vm.runInThisContext()` ရော JavaScript ရဲ့ [`eval()`][] function ရောကို သုံးတာကို သရုပ်ဖော်ပြပါတယ်:

```mjs
import { runInThisContext } from 'node:vm';
let localVar = 'initial value';

const vmResult = runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```

```cjs
const { runInThisContext } = require('node:vm');
let localVar = 'initial value';

const vmResult = runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```

`vm.runInThisContext()` က local scope ကို လက်လှမ်းမီနိုင်တာ မဟုတ်တာကြောင့် — `localVar` က မပြောင်းလဲဘဲ ရှိနေပါတယ်။ ဒါနဲ့ ဆန့်ကျင်ဘက်အနေနဲ့ — တိုက်ရိုက် `eval()` call တစ်ခုက local scope ကို လက်လှမ်းမီနိုင်_တာကြောင့်_ — `localVar` ရဲ့ တန်ဖိုးက ပြောင်းလဲသွားပါတယ်။ ဒီနည်းနဲ့ဆိုရင် `vm.runInThisContext()` က [indirect `eval()` call][] တစ်ခုနဲ့ အတော်လေး ဆင်တူပါတယ် — ဥပမာ `(0,eval)('code')` လိုမျိုးပါ။

## ဥပမာ — VM တစ်ခုအတွင်းမှာ HTTP server တစ်ခု လည်ပတ်ခြင်း (Example: Running an HTTP server within a VM)

[`script.runInThisContext()`][] ကိုပဲ သုံးသုံး — [`vm.runInThisContext()`][] ကိုပဲ သုံးသုံး — code ကို လက်ရှိ V8 global context အတွင်းမှာ execute လုပ်ပါတယ်။ ဒီ VM context ဆီကို ပေးပို့လိုက်တဲ့ code က ၎င်းရဲ့ ကိုယ်ပိုင် သီးခြား (isolated) scope တစ်ခု ရှိပါလိမ့်မယ်။

`node:http` module ကို သုံးပြီး web server အသေးစား တစ်ခုကို run လုပ်ဖို့ဆိုရင် — context ဆီကို ပေးပို့လိုက်တဲ့ code က `require('node:http')` ကို ကိုယ်တိုင် ခေါ်ရမယ် — ဒါမှမဟုတ် `node:http` module ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုကို ၎င်းဆီကို ဖြတ်သန်းပေးထားရပါမယ်။ ဥပမာ:

```mjs
import { runInThisContext } from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const code = `
((require) => {
  const { createServer } = require('node:http');

  createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

runInThisContext(code)(require);
```

```cjs
const { runInThisContext } = require('node:vm');

const code = `
((require) => {
  const { createServer } = require('node:http');

  createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

runInThisContext(code)(require);
```

အပေါ်က ဥပမာထဲက `require()` က ၎င်းကို ဖြတ်သန်းပေးခဲ့တဲ့ context ရဲ့ state ကို မျှဝေသုံးပါတယ်။ ဒါက ယုံကြည်စိတ်ချရမှု မရှိတဲ့ (untrusted) code ကို execute လုပ်တဲ့အခါ — ဥပမာ context ထဲက objects တွေကို မလိုလားအပ်တဲ့ နည်းလမ်းတွေနဲ့ ပြောင်းလဲခြင်းလိုမျိုး — အန္တရာယ်တွေ ဖြစ်ပေါ်လာစေနိုင်ပါတယ်။

## Object တစ်ခုကို "contextify" လုပ်တယ်ဆိုတာ ဘာကို ဆိုလိုတာလဲ (What does it mean to "contextify" an object?)

Node.js အတွင်းမှာ execute လုပ်တဲ့ JavaScript အားလုံးက "context" တစ်ခုရဲ့ scope အတွင်းမှာ run ပါတယ်။ [V8 Embedder's Guide][] အရ ဆိုရင်:

> V8 မှာ context ဆိုတာ execution environment တစ်ခု ဖြစ်ပြီး — သီးခြား၊ မသက်ဆိုင်တဲ့ JavaScript applications တွေကို V8 instance တစ်ခုတည်းထဲမှာ run လုပ်နိုင်စေပါတယ်။ JavaScript code ဘယ်ဟာကိုမဆို run စေချင်ရင် — ဘယ် context ထဲမှာ run စေချင်တယ်ဆိုတာကို သင်က တိကျစွာ (explicitly) သတ်မှတ်ပေးရပါမယ်။

`vm.createContext()` method ကို object တစ်ခုနဲ့ ခေါ်လိုက်တဲ့အခါ — `contextObject` argument ကို V8 Context instance အသစ်တစ်ခုရဲ့ global object ကို wrap (ပတ်ရစ်) လုပ်ဖို့ သုံးပါလိမ့်မယ် (`contextObject` က `undefined` ဆိုရင် — ၎င်းကို contextified မလုပ်ခင် လက်ရှိ context ကနေ object အသစ်တစ်ခုကို ဖန်တီးပါလိမ့်မယ်)။ ဒီ V8 Context က `node:vm` module ရဲ့ methods တွေကို သုံးပြီး run လုပ်တဲ့ `code` အတွက် — ၎င်း လည်ပတ်နိုင်တဲ့ သီးခြား global environment တစ်ခုကို ပေးပါတယ်။ V8 Context ကို ဖန်တီးပြီး ၎င်းကို outer context ထဲက `contextObject` နဲ့ ဆက်စပ်ပေးတဲ့ လုပ်ငန်းစဉ်ကိုပဲ ဒီ document မှာ object ကို "contextifying" လုပ်တယ်လို့ ရည်ညွှန်းပါတယ်။

Contextifying လုပ်တာက context ထဲက `globalThis` တန်ဖိုးမှာ ထူးဆန်းမှု (quirks) တချို့ကို ဖြစ်ပေါ်စေပါတယ်။ ဥပမာ — ၎င်းကို freeze လုပ်လို့ မရပါဘူး — ပြီးတော့ ၎င်းက outer context ထဲက `contextObject` နဲ့ reference အရ ညီမျှမှု မရှိပါဘူး။

```mjs
import { createContext, runInContext } from 'node:vm';

// An undefined `contextObject` option makes the global object contextified.
const context = createContext();
console.log(runInContext('globalThis', context) === context);  // false
// A contextified global object cannot be frozen.
try {
  runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`); // TypeError: Cannot freeze
}
console.log(runInContext('globalThis.foo = 1; foo;', context));  // 1
```

```cjs
const { createContext, runInContext } = require('node:vm');

// An undefined `contextObject` option makes the global object contextified.
const context = createContext();
console.log(runInContext('globalThis', context) === context);  // false
// A contextified global object cannot be frozen.
try {
  runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`); // TypeError: Cannot freeze
}
console.log(runInContext('globalThis.foo = 1; foo;', context));  // 1
```

သာမန် global object တစ်ခုနဲ့ context တစ်ခုကို ဖန်တီးပြီး — quirks တွေ နည်းပါးတဲ့အနေနဲ့ outer context ထဲမှာ global proxy တစ်ခုကို လက်လှမ်းမီချင်ရင် — `contextObject` argument အနေနဲ့ `vm.constants.DONT_CONTEXTIFY` ကို သတ်မှတ်ပေးပါ။

### `vm.constants.DONT_CONTEXTIFY`

ဒီ constant ကို vm APIs တွေထဲမှာ `contextObject` argument အနေနဲ့ သုံးလိုက်တဲ့အခါ — ၎င်းရဲ့ global object ကို Node.js-specific ပုံစံနဲ့ တခြား object တစ်ခုနဲ့ မပတ်ရစ်ပဲ context တစ်ခုကို ဖန်တီးဖို့ Node.js ကို ညွှန်ကြားပါတယ်။ ရလဒ်အနေနဲ့ — context အသစ်ထဲက `globalThis` တန်ဖိုးက သာမန် `globalThis` တစ်ခုနဲ့ ပိုနီးစပ်တဲ့ ပုံစံနဲ့ ပြုမူပါလိမ့်မယ်။

```mjs
import { createContext, runInContext, constants } from 'node:vm';

// Use vm.constants.DONT_CONTEXTIFY to freeze the global object.
const context = createContext(constants.DONT_CONTEXTIFY);
runInContext('Object.freeze(globalThis);', context);
try {
  runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`); // ReferenceError: bar is not defined
}
```

```cjs
const { createContext, runInContext, constants } = require('node:vm');

// Use vm.constants.DONT_CONTEXTIFY to freeze the global object.
const context = createContext(constants.DONT_CONTEXTIFY);
runInContext('Object.freeze(globalThis);', context);
try {
  runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`); // ReferenceError: bar is not defined
}
```

[`vm.createContext()`][] ဆီကို `contextObject` argument အနေနဲ့ `vm.constants.DONT_CONTEXTIFY` ကို သုံးလိုက်တဲ့အခါ — ပြန်ပေးလိုက်တဲ့ object က အသစ်ဖန်တီးထားတဲ့ context ထဲက global object ဆီကို — Node.js-specific quirks တွေ နည်းပါးစွာနဲ့ — proxy ပုံစံမျိုး ဆက်သွယ်ပေးတဲ့ object တစ်ခု ဖြစ်ပါတယ်။ ၎င်းက context အသစ်ထဲက `globalThis` တန်ဖိုးနဲ့ reference အရ ညီမျှပြီး — context ရဲ့ အပြင်ဘက်ကနေလည်း ပြုပြင်နိုင်ကာ — context အသစ်ထဲက built-ins တွေကို တိုက်ရိုက် လက်လှမ်းမီဖို့လည်း သုံးနိုင်ပါတယ်။

```mjs
import { createContext, runInContext, constants } from 'node:vm';

const context = createContext(constants.DONT_CONTEXTIFY);

// Returned object is reference equal to globalThis in the new context.
console.log(runInContext('globalThis', context) === context);  // true

// Can be used to access globals in the new context directly.
console.log(context.Array);  // [Function: Array]
runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(runInContext('bar;', context));  // 1

// Can be frozen and it affects the inner context.
Object.freeze(context);
try {
  runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`); // ReferenceError: baz is not defined
}
```

```cjs
const { createContext, runInContext, constants } = require('node:vm');

const context = createContext(constants.DONT_CONTEXTIFY);

// Returned object is reference equal to globalThis in the new context.
console.log(runInContext('globalThis', context) === context);  // true

// Can be used to access globals in the new context directly.
console.log(context.Array);  // [Function: Array]
runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(runInContext('bar;', context));  // 1

// Can be frozen and it affects the inner context.
Object.freeze(context);
try {
  runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`); // ReferenceError: baz is not defined
}
```

## Asynchronous tasks နဲ့ Promises တွေနဲ့ timeout ၏ အပြန်အလှန် သက်ရောက်မှုများ (Timeout interactions with asynchronous tasks and Promises)

`Promise`s တွေနဲ့ `async function`s တွေက JavaScript engine က run လုပ်တဲ့ tasks တွေကို asynchronously schedule လုပ်နိုင်ပါတယ်။ Default အနေနဲ့ — ဒီ tasks တွေကို လက်ရှိ stack ပေါ်က JavaScript functions တွေ အားလုံး execute လုပ်ပြီးသွားမှ run လုပ်ပါတယ်။ ဒါက `timeout` နဲ့ `breakOnSigint` options တွေရဲ့ လုပ်ဆောင်ချက်ကနေ လွတ်မြောက်ဖို့ (escape) ဖြစ်စေပါတယ်။

ဥပမာ — timeout 5 milliseconds နဲ့ `vm.runInNewContext()` ကနေ execute လုပ်လိုက်တဲ့ အောက်ပါ code က promise တစ်ခု resolve ဖြစ်ပြီးနောက်မှာ infinite loop (အဆုံးမဲ့ loop) တစ်ခုကို run လုပ်ဖို့ schedule လုပ်ပါတယ်။ Schedule လုပ်ထားတဲ့ loop ကို timeout က ဘယ်တော့မှ ရပ်တန့်ပေးမှာ မဟုတ်ပါဘူး:

```mjs
import { runInNewContext } from 'node:vm';

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// This is printed *before* 'entering infinite loop' (!)
console.log('done executing');
```

```cjs
const { runInNewContext } = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// This is printed *before* 'entering infinite loop' (!)
console.log('done executing');
```

ဒါကို `Context` ကို ဖန်တီးပေးတဲ့ code ဆီကို `microtaskMode: 'afterEvaluate'` ကို ဖြတ်သန်းပေးခြင်းအားဖြင့် ဖြေရှင်းနိုင်ပါတယ်:

```mjs
import { runInNewContext } from 'node:vm';

function loop() {
  while (1) console.log(Date.now());
}

runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```

```cjs
const { runInNewContext } = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```

ဒီကိစ္စမှာ — `promise.then()` ကနေတစ်ဆင့် schedule လုပ်ထားတဲ့ microtask ကို `vm.runInNewContext()` ကနေ ပြန်မလာခင် run လုပ်ပြီး — `timeout` လုပ်ဆောင်ချက်က ၎င်းကို ရပ်တန့်စေပါလိမ့်မယ်။ ဒါက `vm.Context` တစ်ခုထဲမှာ run လုပ်နေတဲ့ code တွေမှာသာ သက်ရောက်ပါတယ် — ဒါကြောင့် ဥပမာ [`vm.runInThisContext()`][] ကတော့ ဒီ option ကို လက်ခံမှာ မဟုတ်ပါဘူး။

Promise callbacks တွေကို ၎င်းတို့ ဖန်တီးခဲ့တဲ့ context ရဲ့ microtask queue ထဲကို ထည့်သွင်းပါတယ်။ ဥပမာ — အပေါ်က ဥပမာမှာ `() => loop()` အစား `loop` ကိုပဲ ထည့်လိုက်ရင် — `loop` က outer (main) context ကနေ လာတဲ့ function တစ်ခုမို့ — global microtask queue ထဲကို ရောက်သွားပြီး — timeout ကနေလည်း လွတ်မြောက်နိုင်ပါလိမ့်မယ်။

`process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()` စတဲ့ asynchronous scheduling functions တွေကို `vm.Context` တစ်ခုရဲ့ အတွင်းမှာ ရရှိနိုင်အောင် လုပ်ထားရင် — ၎င်းတို့ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ functions တွေကို contexts တွေ အားလုံးက မျှဝေသုံးတဲ့ global queues တွေထဲကို ထည့်သွင်းပါလိမ့်မယ်။ ဒါကြောင့် — အဲဒီ functions တွေဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ callbacks တွေကိုလည်း timeout ကနေတစ်ဆင့် ထိန်းချုပ်လို့ မရပါဘူး။

### `microtaskMode` က `'afterEvaluate'` ဖြစ်နေတဲ့အခါ — Contexts များကြားမှာ Promises တွေ မျှဝေခြင်းကို သတိထားပါ (When `microtaskMode` is `'afterEvaluate'`, beware sharing Promises between Contexts)

`'afterEvaluate'` mode မှာ — `Context` က ၎င်းရဲ့ ကိုယ်ပိုင် microtask queue တစ်ခု ရှိပြီး — outer (main) context က သုံးတဲ့ global microtask queue နဲ့ သီးခြား ဖြစ်ပါတယ်။ Asynchronous tasks တွေနဲ့အတူ `timeout` ကို ပြဋ္ဌာန်းဖို့ (enforce) နဲ့ `breakOnSigint` ကို ဖွင့်ပေးဖို့ ဒီ mode က လိုအပ်ပေမယ့် — contexts များကြားမှာ promises တွေ မျှဝေတာကိုတော့ စိန်ခေါ်မှု တစ်ခု ဖြစ်စေပါတယ်။

အောက်က ဥပမာမှာ — promise တစ်ခုကို inner context ထဲမှာ ဖန်တီးပြီး outer context နဲ့ မျှဝေထားပါတယ်။ Outer context က promise ပေါ်မှာ `await` လုပ်လိုက်တဲ့အခါ — outer context ရဲ့ execution flow က မမျှော်လင့်တဲ့ နည်းလမ်းနဲ့ အနှောင့်အယှက် ဖြစ်သွားပါတယ်: log statement ကို ဘယ်တော့မှ execute လုပ်မှာ မဟုတ်ပါဘူး။

```mjs
import { createContext, runInContext } from 'node:vm';

const inner_context = createContext({}, { microtaskMode: 'afterEvaluate' });

// runInContext() returns a Promise created in the inner context.
const inner_promise = runInContext('Promise.resolve()', inner_context);

// As part of performing `await`, the JavaScript runtime must enqueue a task
// on the microtask queue of the context where `inner_promise` was created.
// A task is added on the inner microtask queue, but **it will not be run
// automatically**: this task will remain pending indefinitely.
//
// Since the outer microtask queue is empty, execution in the outer module
// falls through, and the log statement below is never executed.
await inner_promise;

console.log('this will NOT be printed');
```

```cjs
const { createContext, runInContext } = require('node:vm');

// runInContext() returns a Promise created in the inner context.
const inner_context = createContext({}, { microtaskMode: 'afterEvaluate' });

(async () => {
  const inner_promise = runInContext('Promise.resolve()', inner_context);

  // As part of performing `await`, the JavaScript runtime must enqueue a task
  // on the microtask queue of the context where `inner_promise` was created.
  // A task is added on the inner microtask queue, but **it will not be run
  // automatically**: this task will remain pending indefinitely.
  //
  // Since the outer microtask queue is empty, execution in the outer module
  // falls through, and the log statement below is never executed.
  await inner_promise;

  console.log('this will NOT be printed');
})();
```

Microtask queues မတူညီတဲ့ contexts တွေကြားမှာ promises တွေကို အောင်မြင်စွာ မျှဝေနိုင်ဖို့ဆိုရင် — outer context က inner microtask queue ပေါ်မှာ task တစ်ခု enqueue လုပ်တိုင်း — inner microtask queue ပေါ်က tasks တွေကို run လုပ်မယ်ဆိုတာ သေချာအောင် လုပ်ဖို့ လိုအပ်ပါတယ်။

Context တစ်ခုရဲ့ microtask queue ပေါ်က tasks တွေကို — ဒီ context ကို သုံးတဲ့ script တစ်ခု သို့မဟုတ် module တစ်ခုပေါ်မှာ `runInContext()` သို့မဟုတ် `SourceTextModule.evaluate()` တို့ကို ခေါ်လိုက်တိုင်း run လုပ်ပါတယ်။ ကျွန်ုပ်တို့ရဲ့ ဥပမာမှာ — `await inner_promise` ရဲ့ _ရှေ့မှာ_ `runInContext()` ကို ဒုတိယအကြိမ် တစ်ခု schedule လုပ်ခြင်းအားဖြင့် ပုံမှန် execution flow ကို ပြန်လည် တည်ဆောက်နိုင်ပါတယ်။

```mjs
// Schedule `runInContext()` to manually drain the inner context microtask
// queue; it will run after the `await` statement below.
setImmediate(() => {
  vm.runInContext('', context);
});

await inner_promise;

console.log('OK');
```

**Note:** တိကျစွာ ပြောရရင် — ဒီ mode မှာ `node:vm` က [enqueuing jobs][] နဲ့ ပတ်သက်တဲ့ ECMAScript specification ရဲ့ စာသားအတိုင်း (letter) ကနေ သွေဖည်သွားပါတယ် — ၎င်းက contexts အမျိုးမျိုးကနေ လာတဲ့ asynchronous tasks တွေကို enqueue လုပ်ခဲ့တဲ့ အစီအစဉ်နဲ့ မတူတဲ့ အစီအစဉ်နဲ့ run လုပ်ခွင့် ပြုလို့ပါ။

## Compilation APIs တွေမှာ dynamic `import()` ၏ ပံ့ပိုးမှု (Support of dynamic `import()` in compilation APIs)

အောက်ပါ APIs တွေက — vm module ကနေ compile လုပ်လိုက်တဲ့ code ထဲမှာ dynamic `import()` ကို ဖွင့်ပေးဖို့ `importModuleDynamically` option တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

* `new vm.Script`
* `vm.compileFunction()`
* `new vm.SourceTextModule`
* `vm.runInThisContext()`
* `vm.runInContext()`
* `vm.runInNewContext()`
* `vm.createContext()`

ဒီ option က experimental modules API ရဲ့ အစိတ်အပိုင်း တစ်ခု ဖြစ်နေဆဲပါ။ Production environment မှာ သုံးဖို့ အကြံပြုလို့ မရပါဘူး။

### `importModuleDynamically` option ကို သတ်မှတ်မထားရင် သို့မဟုတ် undefined ဖြစ်နေရင် (When the `importModuleDynamically` option is not specified or undefined)

ဒီ option ကို သတ်မှတ်မထားရင် သို့မဟုတ် `undefined` ဖြစ်နေရင် — `import()` ပါဝင်တဲ့ code ကို vm APIs တွေကနေတစ်ဆင့် compile လုပ်လို့ ရနေဆဲပါ — ဒါပေမယ့် compile လုပ်ထားတဲ့ code ကို execute လုပ်ပြီး ၎င်းက `import()` ကို တကယ် ခေါ်လိုက်တဲ့အခါ — ရလဒ်က [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`][] နဲ့ reject ဖြစ်ပါလိမ့်မယ်။

### `importModuleDynamically` က `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` ဖြစ်နေတဲ့အခါ (When `importModuleDynamically` is `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`)

ဒီ option ကို `vm.SourceTextModule` အတွက် လောလောဆယ် ပံ့ပိုးမထားပါဘူး။

ဒီ option နဲ့ဆိုရင် — compile လုပ်ထားတဲ့ code ထဲမှာ `import()` တစ်ခု စတင်လိုက်တဲ့အခါ — Node.js က တောင်းဆိုထားတဲ့ module ကို load လုပ်ဖို့ main context ကနေ လာတဲ့ default ESM loader ကို သုံးပြီး — ၎င်းကို execute လုပ်နေတဲ့ code ဆီကို ပြန်ပေးပါလိမ့်မယ်။

ဒါက compile လုပ်နေတဲ့ code ကို `fs` သို့မဟုတ် `http` လိုမျိုး Node.js built-in modules တွေဆီကို လက်လှမ်းမီခွင့် ပေးပါတယ်။ Code ကို မတူညီတဲ့ context တစ်ခုထဲမှာ execute လုပ်မယ်ဆိုရင် — main context ကနေ load လုပ်ထားတဲ့ modules တွေ ဖန်တီးလိုက်တဲ့ objects တွေက main context ကနေ လာတုန်း ဖြစ်ပြီး — context အသစ်ထဲက built-in classes တွေရဲ့ `instanceof` မဟုတ်ဘူးဆိုတာ သတိပြုပါ။

```cjs
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL loaded from the main context is not an instance of the Function
// class in the new context.
script.runInNewContext().then(console.log);
```

```mjs
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL loaded from the main context is not an instance of the Function
// class in the new context.
script.runInNewContext().then(console.log);
```

ဒီ option က script သို့မဟုတ် function ကို user modules တွေ load လုပ်ခွင့်လည်း ပေးပါတယ်:

```mjs
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Write test.js and test.txt to the directory where the current script
// being run is located.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compile a script that loads test.mjs and then test.json
// as if the script is placed in the same directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```cjs
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Write test.js and test.txt to the directory where the current script
// being run is located.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compile a script that loads test.mjs and then test.json
// as if the script is placed in the same directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

Main context ကနေ default loader ကို သုံးပြီး user modules တွေ load လုပ်တာမှာ သတိထားစရာ အချက်အနည်းငယ် ရှိပါတယ်:

1. `vm.Script` သို့မဟုတ် `vm.compileFunction()` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ `filename` option နဲ့ ဆက်စပ်ပြီး module ကို resolve လုပ်ပါလိမ့်မယ်။ `filename` က absolute path တစ်ခုဖြစ်ဖြစ် — URL string တစ်ခုဖြစ်ဖြစ်ဆိုရင် resolve လုပ်တာ အလုပ်လုပ်ပါတယ်။ `filename` က absolute path လည်း မဟုတ် — URL လည်း မဟုတ်တဲ့ string တစ်ခု ဖြစ်နေရင် သို့မဟုတ် undefined ဖြစ်နေရင် — resolve လုပ်တာက process ရဲ့ လက်ရှိ working directory နဲ့ ဆက်စပ်ပါလိမ့်မယ်။ `vm.createContext()` ရဲ့ ကိစ္စမှာတော့ — referrer script သို့မဟုတ် module မရှိတဲ့အခါမှသာ ဒီ option ကို သုံးတာမို့ — resolve လုပ်တာက အမြဲတမ်း လက်ရှိ working directory နဲ့ ဆက်စပ်ပါတယ်။
2. သတ်မှတ်ထားတဲ့ path တစ်ခုဆီ resolve လုပ်တဲ့ `filename` တစ်ခုခုအတွက် — process က အဲဒီ path ကနေ module တစ်ခုကို load လုပ်နိုင်ခဲ့တာနဲ့ — ရလဒ်က cache လုပ်ခံရနိုင်ပြီး — path တစ်ခုတည်းကနေ တူညီတဲ့ module ကို နောက်တစ်ကြိမ် load လုပ်ရင် အတူတူပဲ ပြန်ရပါလိမ့်မယ်။ `filename` က URL string တစ်ခုဆိုရင် — search parameters တွေ မတူညီရင် cache ကို hit ဖြစ်မှာ မဟုတ်ပါဘူး။ URL string မဟုတ်တဲ့ `filename`s တွေအတွက်တော့ — caching အပြုအမူကို ရှောင်ကွင်းဖို့ နည်းလမ်း လောလောဆယ် မရှိပါဘူး။

### `importModuleDynamically` က function တစ်ခု ဖြစ်နေတဲ့အခါ (When `importModuleDynamically` is a function)

`importModuleDynamically` က function တစ်ခု ဖြစ်နေရင် — compile လုပ်ထားတဲ့ code ထဲမှာ `import()` ကို ခေါ်လိုက်တဲ့အခါ ၎င်းကို invoke လုပ်ပြီး — users တွေက တောင်းဆိုထားတဲ့ module ကို ဘယ်လို compile လုပ်ပြီး evaluate လုပ်ရမယ်ဆိုတာကို customize လုပ်နိုင်ပါတယ်။ လောလောဆယ်မှာ — ဒီ option အလုပ်လုပ်ဖို့ Node.js instance ကို `--experimental-vm-modules` flag နဲ့ စတင်ထားရပါမယ်။ Flag ကို မသတ်မှတ်ထားရင် — ဒီ callback ကို လျစ်လျူရှုပါလိမ့်မယ်။ Evaluate လုပ်လိုက်တဲ့ code က `import()` ကို တကယ် ခေါ်လိုက်ရင် — ရလဒ်က [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`][] နဲ့ reject ဖြစ်ပါလိမ့်မယ်။

Callback `importModuleDynamically(specifier, referrer, importAttributes)` က အောက်ပါ signature ရှိပါတယ်:

* `specifier` {string} `import()` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ specifier ပါ။
* `referrer` {vm.Script|Function|vm.SourceTextModule|Object} `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` နဲ့ `vm.runInNewContext` တွေအတွက်ဆိုရင် referrer က compile လုပ်ထားတဲ့ `vm.Script` ဖြစ်ပါတယ်။ `vm.compileFunction` အတွက် — compile လုပ်ထားတဲ့ `Function` — `new vm.SourceTextModule` အတွက် — compile လုပ်ထားတဲ့ `vm.SourceTextModule` — ပြီးတော့ `vm.createContext()` အတွက် — context `Object` ဖြစ်ပါတယ်။
* `importAttributes` {Object} [`optionsExpression`][] optional parameter ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ `"with"` တန်ဖိုးပါ — တန်ဖိုး ဘာမှ မပေးထားရင်တော့ ဗလာ object တစ်ခု ဖြစ်ပါတယ်။
* `phase` {string} Dynamic import ရဲ့ phase ပါ (`"source"` (သို့) `"evaluation"`)။
* Returns: {Module Namespace Object|vm.Module} Error tracking (error ခြေရာခံခြင်း) ရဲ့ အကျိုးကျေးဇူးကို ရယူနိုင်ဖို့ နဲ့ — `then` function exports တွေ ပါဝင်တဲ့ namespaces တွေနဲ့ ဖြစ်တတ်တဲ့ ပြဿနာတွေကို ရှောင်ရှားဖို့ — `vm.Module` တစ်ခုကို ပြန်ပေးဖို့ အကြံပြုပါတယ်။

```mjs
// This script must be run with --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // The compiled script
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```cjs
// This script must be run with --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // The compiled script
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```

[Cyclic Module Record]: https://tc39.es/ecma262/#sec-cyclic-module-records
[ECMAScript Module Loader]: esm.md#modules-ecmascript-modules
[Evaluate() concrete method]: https://tc39.es/ecma262/#sec-moduleevaluation
[Evaluate() of a Synthetic Module Record]: https://tc39.es/ecma262/#sec-smr-Evaluate
[FinishLoadingImportedModule]: https://tc39.es/ecma262/#sec-FinishLoadingImportedModule
[GetModuleNamespace]: https://tc39.es/ecma262/#sec-getmodulenamespace
[HostLoadImportedModule]: https://tc39.es/ecma262/#sec-HostLoadImportedModule
[HostResolveImportedModule]: https://tc39.es/ecma262/#sec-hostresolveimportedmodule
[ImportDeclaration]: https://tc39.es/ecma262/#prod-ImportDeclaration
[Link() concrete method]: https://tc39.es/ecma262/#sec-moduledeclarationlinking
[Module Record]: https://tc39.es/ecma262/#sec-abstract-module-records
[Source Text Module Record]: https://tc39.es/ecma262/#sec-source-text-module-records
[Support of dynamic `import()` in compilation APIs]: #support-of-dynamic-import-in-compilation-apis
[Synthetic Module Record]: https://tc39.es/ecma262/#sec-synthetic-module-records
[V8 Embedder's Guide]: https://v8.dev/docs/embed#contexts
[WithClause]: https://tc39.es/ecma262/#prod-WithClause
[`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`]: errors.md#err_vm_dynamic_import_callback_missing_flag
[`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`]: errors.md#err_vm_dynamic_import_callback_missing
[`Error`]: errors.md#class-error
[`URL`]: url.md#class-url
[`eval()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
[`optionsExpression`]: https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call
[`script.runInContext()`]: #scriptrunincontextcontextifiedobject-options
[`script.runInThisContext()`]: #scriptruninthiscontextoptions
[`sourceTextModule.instantiate()`]: #sourcetextmoduleinstantiate
[`sourceTextModule.linkRequests(modules)`]: #sourcetextmodulelinkrequestsmodules
[`sourceTextModule.moduleRequests`]: #sourcetextmodulemodulerequests
[`url.origin`]: url.md#urlorigin
[`vm.compileFunction()`]: #vmcompilefunctioncode-params-options
[`vm.constants.DONT_CONTEXTIFY`]: #vmconstantsdont_contextify
[`vm.createContext()`]: #vmcreatecontextcontextobject-options
[`vm.runInContext()`]: #vmrunincontextcode-contextifiedobject-options
[`vm.runInThisContext()`]: #vmruninthiscontextcode-options
[contextified]: #what-does-it-mean-to-contextify-an-object
[enqueuing jobs]: https://tc39.es/ecma262/#sec-hostenqueuepromisejob
[global object]: https://tc39.es/ecma262/#sec-global-object
[indirect `eval()` call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#direct_and_indirect_eval
[origin]: https://developer.mozilla.org/en-US/docs/Glossary/Origin
