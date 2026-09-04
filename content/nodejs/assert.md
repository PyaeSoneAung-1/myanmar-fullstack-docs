---
title: "Assert"
description: "node:assert module — invariants (အမြဲ မှန်ကန်နေရမည့် အခြေအနေများ) ကို စစ်ဆေးရန် assertion functions အစုအဝေး (strict/legacy modes, AssertionError, deep equality, throws/rejects အပါအဝင်)။"
order: 105
source: "https://nodejs.org/api/assert.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:assert` module က invariants (ဘယ်အချိန်မှာမဆို မှန်ကန်နေရမယ့် အခြေအနေများ) တွေကို စစ်ဆေး အတည်ပြုဖို့ assertion functions အစုတစ်ခုကို ပံ့ပိုးပေးပါတယ်။

## Strict assertion mode (တင်းကျပ်သော assertion mode)

Strict assertion mode မှာ non-strict methods တွေက သူတို့နဲ့ သက်ဆိုင်တဲ့ strict methods တွေလိုပဲ ပြုမူပါတယ်။ ဥပမာ — [`assert.deepEqual()`][] က [`assert.deepStrictEqual()`][] လိုပဲ ပြုမူပါလိမ့်မယ်။

Strict assertion mode မှာ objects တွေအတွက် error messages တွေက diff ကို ပြသပါတယ်။ Legacy assertion mode မှာတော့ objects တွေကိုပဲ ပြသပြီး — မကြာခဏဆိုသလို ဖြတ်တောက်ထားတာ ဖြစ်တတ်ပါတယ်။

### Message parameter semantics (message parameter ၏ အဓိပ္ပာယ် သတ်မှတ်ချက်များ)

Optional ဖြစ်တဲ့ `message` parameter ကို လက်ခံတဲ့ assertion methods တွေမှာ message ကို အောက်ပါ ပုံစံတွေထဲက တစ်ခုအနေနဲ့ ပေးနိုင်ပါတယ်:

* **string**: မူလအတိုင်း သုံးပါတယ်။ `message` string နောက်မှာ ထပ်ဆောင်း arguments တွေ ထည့်ပေးထားရင် သူတို့ကို printf-ပုံစံ substitutions (အစားထိုးမှုများ) လို သဘောထားပါတယ် ([`util.format()`][] ကို ကြည့်ပါ)။
* **Error**: `message` အနေနဲ့ `Error` instance တစ်ခု ပေးထားရင် `AssertionError` အစား အဲဒီ error ကိုပဲ တိုက်ရိုက် throw လုပ်ပါတယ်။
* **function**: `(actual, expected) => string` ပုံစံ function တစ်ခုပါ။ Assertion မအောင်မြင်တဲ့အခါမှသာ ခေါ်ပြီး — error message အဖြစ် သုံးမယ့် string တစ်ခုကို ပြန်ပေးရပါတယ်။ String မဟုတ်တဲ့ ပြန်ပေးတန်ဖိုးတွေကို လျစ်လျူရှုပြီး default message ကိုပဲ သုံးပါတယ်။

`Error` (သို့) function တစ်ခုကို `message` အနေနဲ့ ပေးတဲ့အခါ ထပ်ဆောင်း arguments တွေပါ ပါသွားရင် — ဒီ call ကို `ERR_AMBIGUOUS_ARGUMENT` နဲ့ ငြင်းပယ်လိုက်ပါတယ်။

ပထမ item က string, `Error`, function သုံးမျိုးလုံးထဲက တစ်ခုမှ မဟုတ်ဘူးဆိုရင် `ERR_INVALID_ARG_TYPE` ကို throw လုပ်ပါတယ်။

Strict assertion mode ကို သုံးဖို့:
```mjs
import { strict as assert } from 'node:assert';
```

```
const assert = require('node:assert').strict;
```

```
import assert from 'node:assert/strict';
```

```
const assert = require('node:assert/strict');
```
Error diff ဥပမာ:
```mjs
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
အရောင်တွေကို ပိတ်ချင်ရင် `NO_COLOR` (သို့) `NODE_DISABLE_COLORS` environment variables တွေကို သုံးပါ။ ဒါက REPL ထဲမှာပါ အရောင်တွေကို ပိတ်ပေးပါလိမ့်မယ်။ Terminal environments တွေမှာ color support အကြောင်း ပိုသိချင်ရင် tty ရဲ့ [`getColorDepth()`][] documentation ကို ဖတ်ပါ။

## Legacy assertion mode (ရှေးဟောင်း assertion mode)

Legacy assertion mode က [`==` operator][] ကို အောက်ပါနေရာတွေမှာ သုံးပါတယ်:

* [`assert.deepEqual()`][]
* [`assert.equal()`][]
* [`assert.notDeepEqual()`][]
* [`assert.notEqual()`][]

Legacy assertion mode ကို သုံးဖို့:
```mjs
import assert from 'node:assert';
```

```
const assert = require('node:assert');
```
Legacy assertion mode က မမျှော်လင့်တဲ့ ရလဒ်တွေ ထွက်စေနိုင်ပါတယ် — အထူးသဖြင့် [`assert.deepEqual()`][] ကို သုံးတဲ့အခါမှာပါ:
```cjs
// WARNING: This does not throw an AssertionError in legacy assertion mode!
assert.deepEqual(/a/gi, new Date());
```
## Class: `assert.AssertionError`

* Extends: {errors.Error}

Assertion တစ်ခု မအောင်မြင်တာကို ညွှန်ပြပါတယ်။ `node:assert` module က throw လုပ်တဲ့ errors တွေ အားလုံးက `AssertionError` class ရဲ့ instances တွေ ဖြစ်ပါလိမ့်မယ်။

### `new assert.AssertionError(options)`

* `options` {Object}
  * `message` {string} ပေးထားရင် error message ကို ဒီတန်ဖိုးအဖြစ် သတ်မှတ်ပေးပါတယ်။
  * `actual` {any} Error instance ပေါ်က `actual` property ပါ။
  * `expected` {any} Error instance ပေါ်က `expected` property ပါ။
  * `operator` {string} Error instance ပေါ်က `operator` property ပါ။
  * `stackStartFn` {Function} ပေးထားရင် ထုတ်လုပ်လိုက်တဲ့ stack trace က ဒီ function မတိုင်ခင်က frames တွေကို ချန်လှပ်လိုက်ပါတယ်။
  * `diff` {string} `'full'` လို့ သတ်မှတ်ထားရင် assertion errors တွေမှာ diff အပြည့်အစုံ ပြသပါတယ်။ **Default:** `'simple'` ဖြစ်သည်။
    လက်ခံနိုင်သော တန်ဖိုးများ: `'simple'`, `'full'`။

{Error} ရဲ့ subclass တစ်ခု ဖြစ်ပြီး assertion တစ်ခု မအောင်မြင်တာကို ညွှန်ပြပါတယ်။

Instance တိုင်းမှာ built-in `Error` properties တွေ (`message` နဲ့ `name`) ပါဝင်ပြီး အောက်ပါတို့လည်း ပါဝင်ပါတယ်:

* `actual` {any} [`assert.strictEqual()`][] လိုမျိုး methods တွေအတွက် `actual` argument ကို သတ်မှတ်ပေးထားပါတယ်။
* `expected` {any} [`assert.strictEqual()`][] လိုမျိုး methods တွေအတွက် `expected` တန်ဖိုးကို သတ်မှတ်ပေးထားပါတယ်။
* `generatedMessage` {boolean} Message က auto-generated (`true`) ဟုတ် မဟုတ် ညွှန်ပြပါတယ်။
* `code` {string} Error က assertion error တစ်ခုဆိုတာ ပြသဖို့ တန်ဖိုးက အမြဲတမ်း `ERR_ASSERTION` ဖြစ်ပါတယ်။
* `operator` {string} ထည့်ပေးလိုက်တဲ့ operator တန်ဖိုးကို သတ်မှတ်ပေးထားပါတယ်။
```mjs
import assert from 'node:assert';

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```
const assert = require('node:assert');

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
## Class: `assert.Assert`

`Assert` class က စိတ်ကြိုက် options တွေနဲ့ သီးခြား လွတ်လပ်တဲ့ assertion instances တွေကို ဖန်တီးနိုင်အောင် ခွင့်ပြုပေးပါတယ်။

### `new assert.Assert([options])`

* `options` {Object}
  * `diff` {string} `'full'` လို့ သတ်မှတ်ထားရင် assertion errors တွေမှာ diff အပြည့်အစုံ ပြသပါတယ်။ **Default:** `'simple'` ဖြစ်သည်။
    လက်ခံနိုင်သော တန်ဖိုးများ: `'simple'`, `'full'`။
  * `strict` {boolean} `true` လို့ သတ်မှတ်ထားရင် non-strict methods တွေက သူတို့နဲ့ သက်ဆိုင်တဲ့ strict methods တွေလိုပဲ ပြုမူပါတယ်။ **Default:** `true` ဖြစ်သည်။
  * `skipPrototype` {boolean} `true` လို့ သတ်မှတ်ထားရင် deep equality စစ်ဆေးမှုတွေမှာ prototype နဲ့ constructor နှိုင်းယှဉ်မှုကို ကျော်လိုက်ပါတယ်။ **Default:** `false` ဖြစ်သည်။

Assertion instance အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ `diff` option က assertion error messages တွေထဲက diffs တွေရဲ့ အသေးစိတ် ပမာဏ (verbosity) ကို ထိန်းချုပ်ပါတယ်။
```js
const { Assert } = require('node:assert');
const assertInstance = new Assert({ diff: 'full' });
assertInstance.deepStrictEqual({ a: 1 }, { a: 2 });
// Shows a full diff in the error message.
```
**အရေးကြီး**: `Assert` instance တစ်ခုကနေ assertion methods တွေကို destructure လုပ်လိုက်တဲ့အခါ — ဒီ methods တွေက instance ရဲ့ configuration options တွေ (`diff`, `strict`, `skipPrototype` settings လိုမျိုး) နဲ့ ဆက်သွယ်မှု ပျောက်ဆုံးသွားပါတယ်။ Destructure လုပ်ထားတဲ့ methods တွေက အဲဒီအစား default အပြုအမူဆီကို ပြန်ကျသွားပါလိမ့်မယ်။
```js
const myAssert = new Assert({ diff: 'full' });

// This works as expected - uses 'full' diff
myAssert.strictEqual({ a: 1 }, { b: { c: 1 } });

// This loses the 'full' diff setting - falls back to default 'simple' diff
const { strictEqual } = myAssert;
strictEqual({ a: 1 }, { b: { c: 1 } });
```
`skipPrototype` option က deep equality methods အားလုံးကို သက်ရောက်မှု ရှိပါတယ်:
```js
class Foo {
  constructor(a) {
    this.a = a;
  }
}

class Bar {
  constructor(a) {
    this.a = a;
  }
}

const foo = new Foo(1);
const bar = new Bar(1);

// Default behavior - fails due to different constructors
const assert1 = new Assert();
assert1.deepStrictEqual(foo, bar); // AssertionError

// Skip prototype comparison - passes if properties are equal
const assert2 = new Assert({ skipPrototype: true });
assert2.deepStrictEqual(foo, bar); // OK
```
Destructure လုပ်လိုက်တဲ့အခါ methods တွေက instance ရဲ့ `this` context ကို ဝင်ရောက်ခွင့် ပျောက်ဆုံးပြီး — default assertion အပြုအမူ (diff: 'simple', non-strict mode) ဆီကို ပြန်ရောက်သွားပါတယ်။ Destructured methods တွေ သုံးတဲ့အခါ custom options တွေ ဆက်ထိန်းထားချင်ရင် destructuring ကို ရှောင်ပြီး methods တွေကို instance ပေါ်မှာ တိုက်ရိုက် ခေါ်ပါ။

## `assert(value[, message])`

* `value` {any} Truthy ဟုတ်မဟုတ် စစ်ဆေးခံရမယ့် input ပါ။
* `message` {string|Error|Function}

[`assert.ok()`][] ရဲ့ alias (အစားထိုးအမည်) တစ်ခု ဖြစ်ပါတယ်။

## `assert.deepEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

**Strict assertion mode**

[`assert.deepStrictEqual()`][] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

**Legacy assertion mode**

> Stability: 3 - Legacy: Use [`assert.deepStrictEqual()`][] instead.

`actual` နဲ့ `expected` parameter တွေကြား deep equality ရှိမရှိ စစ်ဆေးပါတယ်။ [`assert.deepStrictEqual()`][] ကို သုံးဖို့ စဉ်းစားပါ — [`assert.deepEqual()`][] က မမျှော်လင့်တဲ့ ရလဒ်တွေ ထွက်စေနိုင်ပါတယ်။

_Deep equality_ ဆိုတာ — child objects တွေရဲ့ enumerable "own" properties တွေကို အောက်ပါ စည်းမျဉ်းတွေနဲ့အညီ recursive အလိုက် ထပ်ဆင့် အကဲဖြတ်သွားတာကိုလည်း ဆိုလိုပါတယ်။

### Comparison details (နှိုင်းယှဉ်မှု အသေးစိတ်များ)

* Primitive values တွေကို [`==` operator][] နဲ့ နှိုင်းယှဉ်ပြီး — {NaN} ကတော့ နှစ်ဖက်လုံး {NaN} ဖြစ်နေရင် တူညီတယ်လို့ သတ်မှတ်ပါတယ်။
* Objects တွေရဲ့ [Type tags][Object.prototype.toString()] က တူညီရပါမယ်။
* [enumerable "own" properties][] တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။
* Object constructors တွေကို ရနိုင်ရင် နှိုင်းယှဉ်ပါတယ်။
* {Error} ရဲ့ names, messages, causes, နဲ့ errors တွေကို enumerable properties တွေ မဟုတ်ရင်တောင် အမြဲတမ်း နှိုင်းယှဉ်ပါတယ်။
* [Object wrappers][] တွေကို object အဖြစ်ရော unwrapped values အဖြစ်ပါ နှိုင်းယှဉ်ပါတယ်။
* `Object` properties တွေကို အစီအစဉ် မလိုက်ဘဲ နှိုင်းယှဉ်ပါတယ်။
* {Map} keys တွေနဲ့ {Set} items တွေကို အစီအစဉ် မလိုက်ဘဲ နှိုင်းယှဉ်ပါတယ်။
* နှစ်ဖက် ကွဲပြားသွားတဲ့အခါ (သို့) တစ်ဖက်ဖက်က circular reference (သံသရာလည် ရည်ညွှန်းမှု) ကို ကြုံတွေ့တဲ့အခါ recursion က ရပ်တန့်ပါတယ်။
* ဒီ implementation က objects တွေရဲ့ [`[[Prototype]]`][prototype-spec] ကို စမ်းသပ်မှု မလုပ်ပါဘူး။
* {Symbol} properties တွေကို နှိုင်းယှဉ်မှာ မဟုတ်ပါဘူး။
* {WeakMap}, {WeakSet} နဲ့ {Promise} instances တွေကို structural အရ **မနှိုင်းယှဉ်**ပါဘူး။ သူတို့က object တစ်ခုတည်းကိုပဲ ရည်ညွှန်းနေမှသာ တူညီပါတယ်။ မတူညီတဲ့ `WeakMap`, `WeakSet`, (သို့) `Promise` instances တွေ ကြားက နှိုင်းယှဉ်မှုတိုင်းက — content တွေ တူညီနေရင်တောင် မညီမျှမှုအဖြစ်ပဲ ရလဒ်ထွက်ပါတယ်။
* {RegExp} ရဲ့ lastIndex, flags, နဲ့ source တွေကို enumerable properties တွေ မဟုတ်ရင်တောင် အမြဲတမ်း နှိုင်းယှဉ်ပါတယ်။

အောက်က ဥပမာက [`AssertionError`][] တစ်ခုကို throw မလုပ်ပါဘူး — ဘာလို့လဲဆိုတော့ primitives တွေကို [`==` operator][] နဲ့ နှိုင်းယှဉ်လို့ပါ။
```mjs
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
"Deep" equality ဆိုတာ — child objects တွေရဲ့ enumerable "own" properties တွေကိုပါ အကဲဖြတ်တာကို ဆိုလိုပါတယ်:
```mjs
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
တန်ဖိုးတွေ မညီမျှဘူးဆိုရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ [`AssertionError`][] အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.deepStrictEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

`actual` နဲ့ `expected` parameter တွေကြား deep equality ရှိမရှိ စစ်ဆေးပါတယ်။ "Deep" equality ဆိုတာ — child objects တွေရဲ့ enumerable "own" properties တွေကို အောက်ပါ စည်းမျဉ်းတွေနဲ့အညီ recursive အလိုက် ထပ်ဆင့် အကဲဖြတ်သွားတာကိုလည်း ဆိုလိုပါတယ်။

### Comparison details (နှိုင်းယှဉ်မှု အသေးစိတ်များ)

* Primitive values တွေကို [`Object.is()`][] သုံးပြီး နှိုင်းယှဉ်ပါတယ်။
* Objects တွေရဲ့ [Type tags][Object.prototype.toString()] က တူညီရပါမယ်။
* Objects တွေရဲ့ [`[[Prototype]]`][prototype-spec] တွေကို [`===` operator][] သုံးပြီး နှိုင်းယှဉ်ပါတယ်။
* [enumerable "own" properties][] တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။
* Object constructors တွေကို ရနိုင်ရင် နှိုင်းယှဉ်ပါတယ်။
* {Error} ရဲ့ names, messages, causes, နဲ့ errors တွေကို enumerable properties တွေ မဟုတ်ရင်တောင် အမြဲတမ်း နှိုင်းယှဉ်ပါတယ်။
  `errors` ကိုလည်း နှိုင်းယှဉ်ပါတယ်။
* Enumerable ဖြစ်တဲ့ own {Symbol} properties တွေကိုလည်း နှိုင်းယှဉ်ပါတယ်။
* [Object wrappers][] တွေကို object အဖြစ်ရော unwrapped values အဖြစ်ပါ နှိုင်းယှဉ်ပါတယ်။
* `Object` properties တွေကို အစီအစဉ် မလိုက်ဘဲ နှိုင်းယှဉ်ပါတယ်။
* {Map} keys တွေနဲ့ {Set} items တွေကို အစီအစဉ် မလိုက်ဘဲ နှိုင်းယှဉ်ပါတယ်။
* နှစ်ဖက် ကွဲပြားသွားတဲ့အခါ (သို့) တစ်ဖက်ဖက်က circular reference ကို ကြုံတွေ့တဲ့အခါ recursion က ရပ်တန့်ပါတယ်။
* {WeakMap}, {WeakSet} နဲ့ {Promise} instances တွေကို structural အရ **မနှိုင်းယှဉ်**ပါဘူး။ သူတို့က object တစ်ခုတည်းကိုပဲ ရည်ညွှန်းနေမှသာ တူညီပါတယ်။ မတူညီတဲ့ `WeakMap`, `WeakSet`, (သို့) `Promise` instances တွေ ကြားက နှိုင်းယှဉ်မှုတိုင်းက — content တွေ တူညီနေရင်တောင် မညီမျှမှုအဖြစ်ပဲ ရလဒ်ထွက်ပါတယ်။
* {RegExp} ရဲ့ lastIndex, flags, နဲ့ source တွေကို enumerable properties တွေ မဟုတ်ရင်တောင် အမြဲတမ်း နှိုင်းယှဉ်ပါတယ်။
```mjs
import assert from 'node:assert/strict';

// This fails because 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// The following objects don't have own properties
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Different [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Different type tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK because Object.is(NaN, NaN) is true.

// Different unwrapped numbers:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK because the object and the string are identical when unwrapped.

assert.deepStrictEqual(-0, -0);
// OK

// Different zeros:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, because it is the same symbol on both objects.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   Symbol(): 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap();
const obj = {};

weakMap1.set(obj, 'value');
weakMap2.set(obj, 'value');

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakMap1, weakMap2);
// AssertionError: Values have same structure but are not reference-equal:
//
// WeakMap {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakMap1, weakMap1);
// OK

const weakSet1 = new WeakSet();
const weakSet2 = new WeakSet();
weakSet1.add(obj);
weakSet2.add(obj);

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakSet1, weakSet2);
// AssertionError: Values have same structure but are not reference-equal:
// + actual - expected
//
// WeakSet {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakSet1, weakSet1);
// OK
```

```
const assert = require('node:assert/strict');

// This fails because 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// The following objects don't have own properties
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Different [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Different type tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK because Object.is(NaN, NaN) is true.

// Different unwrapped numbers:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK because the object and the string are identical when unwrapped.

assert.deepStrictEqual(-0, -0);
// OK

// Different zeros:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, because it is the same symbol on both objects.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   Symbol(): 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap();
const obj = {};

weakMap1.set(obj, 'value');
weakMap2.set(obj, 'value');

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakMap1, weakMap2);
// AssertionError: Values have same structure but are not reference-equal:
//
// WeakMap {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakMap1, weakMap1);
// OK

const weakSet1 = new WeakSet();
const weakSet2 = new WeakSet();
weakSet1.add(obj);
weakSet2.add(obj);

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakSet1, weakSet2);
// AssertionError: Values have same structure but are not reference-equal:
// + actual - expected
//
// WeakSet {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakSet1, weakSet1);
// OK
```
တန်ဖိုးတွေ မညီမျှဘူးဆိုရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.doesNotMatch(string, regexp[, message])`

* `string` {string}
* `regexp` {RegExp}
* `message` {string|Error|Function}

`string` input က regular expression နဲ့ မကိုက်ညီဘူးလို့ မျှော်လင့်ပါတယ်။
```mjs
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```
တန်ဖိုးတွေ ကိုက်ညီနေရင် (သို့) `string` argument က `string` မဟုတ်တဲ့ တခြား type တစ်ခု ဖြစ်နေရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ [`AssertionError`][] အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.doesNotReject(asyncFn[, error][, message])`

* `asyncFn` {Function|Promise}
* `error` {RegExp|Function}
* `message` {string}
* Returns: {Promise}

`asyncFn` promise ကို စောင့်ဆိုင်းပြီး — `asyncFn` က function တစ်ခု ဖြစ်နေရင်တော့ function ကို ချက်ချင်း ခေါ်ပြီး ပြန်ပေးလိုက်တဲ့ promise ပြီးဆုံးတာကို စောင့်ပါတယ်။ ပြီးရင် promise က rejected မဖြစ်ဘူးဆိုတာကို စစ်ဆေးပါတယ်။

`asyncFn` က function တစ်ခု ဖြစ်ပြီး synchronous အနေနဲ့ error တစ်ခု throw လုပ်မိရင် `assert.doesNotReject()` က အဲဒီ error ပါတဲ့ rejected `Promise` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ Function က promise တစ်ခု ပြန်မပေးဘူးဆိုရင် `assert.doesNotReject()` က [`ERR_INVALID_RETURN_VALUE`][] error ပါတဲ့ rejected `Promise` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ကိစ္စ နှစ်ခုစလုံးမှာ error handler ကို ကျော်လိုက်ပါတယ်။

`assert.doesNotReject()` ကို သုံးတာက တကယ်တော့ အသုံးမဝင်လှပါဘူး — rejection တစ်ခုကို ဖမ်းပြီး နောက်တစ်ကြိမ် ပြန် reject လုပ်တာက အကျိုးကျေးဇူး နည်းလို့ပါ။ အဲဒီအစား — reject မဖြစ်သင့်တဲ့ သီးခြား code path တစ်ခုချင်းစီရဲ့ ဘေးမှာ comment တစ်ခု ထည့်ပေးပြီး error messages တွေကို တတ်နိုင်သမျှ ရှင်းလင်းပြတ်သားအောင် ထားဖို့ စဉ်းစားပါ။

သတ်မှတ်ပေးထားရင် `error` က [`Class`][], {RegExp} (သို့) validation function တစ်ခု ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်ကို [`assert.throws()`][] မှာ ကြည့်ပါ။

Completion ကို asynchronous အနေနဲ့ စောင့်ဆိုင်းတာကလွဲလို့ — [`assert.doesNotThrow()`][] နဲ့ အတူတူပဲ ပြုမူပါတယ်။
```mjs
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
```

```
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```

```
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```
## `assert.doesNotThrow(fn[, error][, message])`

* `fn` {Function}
* `error` {RegExp|Function}
* `message` {string}

`fn` function က error တစ်ခုမှ မပစ်ဘူးဆိုတာကို အတည်ပြုပါတယ်။

`assert.doesNotThrow()` ကို သုံးတာက တကယ်တော့ အသုံးမဝင်လှပါဘူး — error တစ်ခုကို ဖမ်းပြီး ပြန် rethrow လုပ်တာက အကျိုး မရှိလို့ပါ။ အဲဒီအစား — throw မဖြစ်သင့်တဲ့ သီးခြား code path တစ်ခုချင်းစီရဲ့ ဘေးမှာ comment တစ်ခု ထည့်ပေးပြီး error messages တွေကို တတ်နိုင်သမျှ ရှင်းလင်းပြတ်သားအောင် ထားဖို့ စဉ်းစားပါ။

`assert.doesNotThrow()` ကို ခေါ်လိုက်တဲ့အခါ `fn` function ကို ချက်ချင်း ခေါ်ပါလိမ့်မယ်။

Error တစ်ခု throw ခံရပြီး အဲဒါက `error` parameter နဲ့ သတ်မှတ်ထားတဲ့ type နဲ့ တူညီနေရင် [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ Error က မတူညီတဲ့ type တစ်ခု ဖြစ်နေရင် (သို့) `error` parameter က undefined ဖြစ်နေရင် — error ကို caller ဆီကို ပြန်ပို့လိုက်ပါတယ်။

သတ်မှတ်ပေးထားရင် `error` က [`Class`][], {RegExp} (သို့) validation function တစ်ခု ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်ကို [`assert.throws()`][] မှာ ကြည့်ပါ။

ဥပမာ — အောက်က ဥပမာက {TypeError} ကို throw လုပ်ပါလိမ့်မယ်။ ဘာလို့လဲဆိုတော့ assertion ထဲမှာ ကိုက်ညီမယ့် error type မရှိလို့ပါ:
```mjs
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```
ဒါပေမယ့် အောက်ကတော့ 'Got unwanted exception...' ဆိုတဲ့ message နဲ့ [`AssertionError`][] တစ်ခုကို ရလဒ်အဖြစ် ထုတ်ပေးပါလိမ့်မယ်:
```mjs
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```

```
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```
[`AssertionError`][] တစ်ခု throw ခံရပြီး `message` parameter အတွက် တန်ဖိုးတစ်ခု ပေးထားရင် — `message` ရဲ့ တန်ဖိုးကို [`AssertionError`][] message ရဲ့ နောက်မှာ ထပ်ဆင့် ထည့်ပေးပါလိမ့်မယ်:
```mjs
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```

```
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```
## `assert.equal(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

**Strict assertion mode**

[`assert.strictEqual()`][] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

**Legacy assertion mode**

> Stability: 3 - Legacy: Use [`assert.strictEqual()`][] instead.

`actual` နဲ့ `expected` parameter တွေကြား shallow, coercive equality (အပေါ်ယံ အဆင့် type ပြောင်းပြီး တူညီမှု) ကို [`==` operator][] သုံးပြီး စစ်ဆေးပါတယ်။ `NaN` ကို အထူး ကိုင်တွယ်ပြီး — နှစ်ဖက်လုံး `NaN` ဖြစ်နေရင် တူညီတယ်လို့ သတ်မှတ်ပါတယ်။
```mjs
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
တန်ဖိုးတွေ မညီမျှဘူးဆိုရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.fail([message])`

* `message` {string|Error} **Default:** `'Failed'`

ပေးထားတဲ့ error message (သို့) default error message တစ်ခုနဲ့အတူ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ [`AssertionError`][] အစား အဲဒီ error ကိုပဲ throw လုပ်ပါလိမ့်မယ်။
```mjs
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
## `assert.ifError(value)`

* `value` {any}

`value` က `undefined` (သို့) `null` မဟုတ်ဘူးဆိုရင် `value` ကို throw လုပ်ပါတယ်။ Callbacks တွေထဲက `error` argument ကို စမ်းသပ်နေတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ Stack trace ထဲမှာ `ifError()` ဆီကို ပေးလိုက်တဲ့ error ကနေ frames အားလုံး ပါဝင်ပြီး — `ifError()` ကိုယ်တိုင်အတွက် ဖြစ်နိုင်ခြေရှိတဲ့ frames အသစ်တွေပါ ပါဝင်ပါတယ်။
```mjs
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```

```
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```
## `assert.match(string, regexp[, message])`

* `string` {string}
* `regexp` {RegExp}
* `message` {string|Error|Function}

`string` input က regular expression နဲ့ ကိုက်ညီမယ်လို့ မျှော်လင့်ပါတယ်။
```mjs
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
တန်ဖိုးတွေ မကိုက်ညီဘူးဆိုရင် (သို့) `string` argument က `string` မဟုတ်တဲ့ တခြား type တစ်ခု ဖြစ်နေရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ [`AssertionError`][] အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.notDeepEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

**Strict assertion mode**

[`assert.notDeepStrictEqual()`][] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

**Legacy assertion mode**

> Stability: 3 - Legacy: Use [`assert.notDeepStrictEqual()`][] instead.

Deep inequality (နက်ရှိုင်းစွာ မညီမျှမှု) တစ်ခုခု ရှိမရှိ စစ်ဆေးပါတယ်။ [`assert.deepEqual()`][] ရဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။
```mjs
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
တန်ဖိုးတွေ deeply equal ဖြစ်နေရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.notDeepStrictEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

Deep strict inequality ရှိမရှိ စစ်ဆေးပါတယ်။ [`assert.deepStrictEqual()`][] ရဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။
```mjs
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
တန်ဖိုးတွေ deeply ရော strictly ပါ equal ဖြစ်နေရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.notEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

**Strict assertion mode**

[`assert.notStrictEqual()`][] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

**Legacy assertion mode**

> Stability: 3 - Legacy: Use [`assert.notStrictEqual()`][] instead.

`actual` နဲ့ `expected` parameter တွေကြား shallow, coercive inequality ကို [`!=` operator][] နဲ့ စစ်ဆေးပါတယ်။ `NaN` ကို အထူး ကိုင်တွယ်ပြီး — နှစ်ဖက်လုံး `NaN` ဖြစ်နေရင် တူညီတယ်လို့ သတ်မှတ်ပါတယ်။
```mjs
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
တန်ဖိုးတွေ တူညီနေရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.notStrictEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

`actual` နဲ့ `expected` parameter တွေကြား strict inequality ကို — [`Object.is()`][] က ဆုံးဖြတ်တဲ့အတိုင်း — စစ်ဆေးပါတယ်။
```mjs
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```

```
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
တန်ဖိုးတွေ strictly equal ဖြစ်နေရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.ok(value[, message])`

* `value` {any}
* `message` {string|Error|Function}

`value` က truthy ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။ ဒါက `assert.equal(!!value, true, message)` နဲ့ ညီမျှပါတယ်။

`value` က truthy မဟုတ်ဘူးဆိုရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က `undefined` ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ `AssertionError` အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။
Argument တွေ လုံးဝ မထည့်ဘူးဆိုရင် `message` ကို အောက်ပါ string အဖြစ် သတ်မှတ်ပါလိမ့်မယ်:
``'No value argument passed to `assert.ok()`'``။

`repl` ထဲမှာ error message က file တစ်ခုထဲမှာ throw လုပ်တဲ့အခါနဲ့ ကွဲပြားမယ်ဆိုတာ သတိပြုပါ။ အသေးစိတ်ကို အောက်မှာ ကြည့်ပါ။
```mjs
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```

```
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```

```
import assert from 'node:assert/strict';

// Using `assert()` works the same:
assert(2 + 2 > 5);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(2 + 2 > 5)
```

```
const assert = require('node:assert');

// Using `assert()` works the same:
assert(2 + 2 > 5);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(2 + 2 > 5)
```
## `assert.rejects(asyncFn[, error][, message])`

* `asyncFn` {Function|Promise}
* `error` {RegExp|Function|Object|Error}
* `message` {string}
* Returns: {Promise}

`asyncFn` promise ကို စောင့်ဆိုင်းပြီး — `asyncFn` က function တစ်ခု ဖြစ်နေရင်တော့ function ကို ချက်ချင်း ခေါ်ပြီး ပြန်ပေးလိုက်တဲ့ promise ပြီးဆုံးတာကို စောင့်ပါတယ်။ ပြီးရင် promise က rejected ဖြစ်မဖြစ် စစ်ဆေးပါတယ်။

`asyncFn` က function တစ်ခု ဖြစ်ပြီး synchronous အနေနဲ့ error တစ်ခု throw လုပ်မိရင် `assert.rejects()` က အဲဒီ error ပါတဲ့ rejected `Promise` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ Function က promise တစ်ခု ပြန်မပေးဘူးဆိုရင် `assert.rejects()` က [`ERR_INVALID_RETURN_VALUE`][] error ပါတဲ့ rejected `Promise` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ကိစ္စ နှစ်ခုစလုံးမှာ error handler ကို ကျော်လိုက်ပါတယ်။

Completion ကို စောင့်ဆိုင်းရတဲ့ async သဘောသဘာဝကလွဲလို့ — [`assert.throws()`][] နဲ့ အတူတူပဲ ပြုမူပါတယ်။

သတ်မှတ်ပေးထားရင် `error` က [`Class`][], {RegExp}, validation function တစ်ခု၊ property တစ်ခုချင်းစီကို စစ်ဆေးမယ့် object တစ်ခု (သို့) property တစ်ခုချင်းစီကို စစ်ဆေးမယ့် error instance တစ်ခု ဖြစ်နိုင်ပြီး — enumerable မဟုတ်တဲ့ `message` နဲ့ `name` properties တွေပါ ပါဝင်ပါတယ်။

သတ်မှတ်ပေးထားရင် `message` က — `asyncFn` က reject လုပ်ဖို့ ပျက်ကွက်ခဲ့ရင် [`AssertionError`][] က ပေးမယ့် message ဖြစ်ပါလိမ့်မယ်။
```mjs
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
  },
);
```

```
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
```

```
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Wrong value');
    return true;
  },
);
```

```
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
```

```
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```

```
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```
`error` က string ဖြစ်လို့ မရပါဘူး။ ဒုတိယ argument အနေနဲ့ string တစ်ခု ပေးလိုက်ရင် — `error` ကို ချန်လှပ်လိုက်တယ်လို့ ယူဆပြီး အဲဒီ string ကို `message` နေရာမှာ သုံးပါလိမ့်မယ်။ ဒါက လွယ်လွယ်နဲ့ သတိလက်လွတ် ဖြစ်စေနိုင်တဲ့ အမှားတွေကို ဖြစ်စေနိုင်ပါတယ်။ ဒုတိယ argument အနေနဲ့ string သုံးဖို့ စဉ်းစားနေတယ်ဆိုရင် [`assert.throws()`][] ထဲက ဥပမာကို သေချာ ဖတ်ပါ။

## `assert.strictEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function} Format string အဖြစ် သုံးမယ်ဆိုရင် postfix (နောက်ဆက်တွဲ) `printf`-like arguments တွေ ဖြစ်ပါတယ်။
  Message က function တစ်ခု ဖြစ်နေရင် — နှိုင်းယှဉ်မှု မအောင်မြင်တဲ့အခါ ခေါ်ပါတယ်။ Function က `actual` နဲ့ `expected` arguments တွေကို လက်ခံရရှိပြီး error message အဖြစ် သုံးမယ့် string တစ်ခုကို ပြန်ပေးရပါတယ်။
  Arguments တွေကို ဆက်ပို့ပေးနေတဲ့ ကိစ္စတွေမှာ `printf`-like format strings နဲ့ functions တွေက performance ရှုထောင့်ကနေ အကျိုးရှိပါတယ်။ ဒါ့အပြင် လှပပြေပြစ်တဲ့ formatting ကိုပါ လွယ်ကူစွာ ရရှိစေပါတယ်။

`actual` နဲ့ `expected` parameter တွေကြား strict equality ကို — [`Object.is()`][] က ဆုံးဖြတ်တဲ့အတိုင်း — စစ်ဆေးပါတယ်။
```mjs
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(apples, oranges, 'apples %s !== oranges %s', apples, oranges);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical

assert.strictEqual(apples, oranges, (actual, expected) => {
  // Do 'heavy' computations
  return `I expected ${expected} but I got ${actual}`;
});
// AssertionError [ERR_ASSERTION]: I expected oranges but I got apples
```

```
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(apples, oranges, 'apples %s !== oranges %s', apples, oranges);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical

assert.strictEqual(apples, oranges, (actual, expected) => {
  // Do 'heavy' computations
  return `I expected ${expected} but I got ${actual}`;
});
// AssertionError [ERR_ASSERTION]: I expected oranges but I got apples
```
တန်ဖိုးတွေ strictly equal မဟုတ်ဘူးဆိုရင် — `message` parameter ရဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ `message` property ပါတဲ့ [`AssertionError`][] တစ်ခုကို throw လုပ်ပါတယ်။ `message` parameter က undefined ဖြစ်နေရင် default error message ကို သတ်မှတ်ပေးပါတယ်။ `message` parameter က {Error} instance တစ်ခု ဖြစ်နေရင်တော့ [`AssertionError`][] အစား အဲဒီ error ကိုပဲ throw လုပ်ပါတယ်။

## `assert.throws(fn[, error][, message])`

* `fn` {Function}
* `error` {RegExp|Function|Object|Error}
* `message` {string}

`fn` function က error တစ်ခု throw လုပ်မယ်လို့ မျှော်လင့်ပါတယ်။

သတ်မှတ်ပေးထားရင် `error` က [`Class`][], {RegExp}, validation function တစ်ခု၊ property တစ်ခုချင်းစီကို strict deep equality အတွက် စစ်ဆေးမယ့် validation object တစ်ခု (သို့) property တစ်ခုချင်းစီကို strict deep equality အတွက် စစ်ဆေးမယ့် error instance တစ်ခု ဖြစ်နိုင်ပြီး — enumerable မဟုတ်တဲ့ `message` နဲ့ `name` properties တွေပါ ပါဝင်ပါတယ်။ Object တစ်ခုကို သုံးတဲ့အခါ string property တစ်ခုကို validate လုပ်ရာမှာ regular expression တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။ ဥပမာတွေကို အောက်မှာ ကြည့်ပါ။

သတ်မှတ်ပေးထားရင် `message` ကို — `fn` call က throw လုပ်ဖို့ ပျက်ကွက်ခဲ့ရင် (သို့) error validation မအောင်မြင်ခဲ့ရင် — `AssertionError` က ပေးတဲ့ message ရဲ့ နောက်မှာ ထပ်ဆင့် ထည့်ပေးပါလိမ့်မယ်။

စိတ်ကြိုက် validation object/error instance:
```mjs
import assert from 'node:assert/strict';

const err = new TypeError('Wrong value');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // Only properties on the validation object will be tested for.
    // Using nested objects requires all properties to be present. Otherwise
    // the validation is going to fail.
  },
);

// Using regular expressions to validate error properties:
assert.throws(
  () => {
    throw err;
  },
  {
    // The `name` and `message` properties are strings and using regular
    // expressions on those will match against the string. If they fail, an
    // error is thrown.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // It is not possible to use regular expressions for nested properties!
      baz: 'text',
    },
    // The `reg` property contains a regular expression and only if the
    // validation object contains an identical regular expression, it is going
    // to pass.
    reg: /abc/i,
  },
);

// Fails due to the different `message` and `name` properties:
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // Copy all enumerable properties from `err` to `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // The error's `message` and `name` properties will also be checked when using
  // an error as validation object.
  err,
);
```

```
const assert = require('node:assert/strict');

const err = new TypeError('Wrong value');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // Only properties on the validation object will be tested for.
    // Using nested objects requires all properties to be present. Otherwise
    // the validation is going to fail.
  },
);

// Using regular expressions to validate error properties:
assert.throws(
  () => {
    throw err;
  },
  {
    // The `name` and `message` properties are strings and using regular
    // expressions on those will match against the string. If they fail, an
    // error is thrown.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // It is not possible to use regular expressions for nested properties!
      baz: 'text',
    },
    // The `reg` property contains a regular expression and only if the
    // validation object contains an identical regular expression, it is going
    // to pass.
    reg: /abc/i,
  },
);

// Fails due to the different `message` and `name` properties:
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // Copy all enumerable properties from `err` to `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // The error's `message` and `name` properties will also be checked when using
  // an error as validation object.
  err,
);
```
Constructor သုံးပြီး instanceof ကို စစ်ဆေးခြင်း:
```mjs
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
```

```
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
```
Error message ကို {RegExp} သုံးပြီး စစ်ဆေးခြင်း:

Regular expression တစ်ခုကို သုံးတဲ့အခါ error object ပေါ်မှာ `.toString` ကို run လုပ်တာမို့ — error name ကိုပါ ထည့်သွင်း ပါဝင်စေပါလိမ့်မယ်။
```mjs
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```

```
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```
စိတ်ကြိုက် error validation:

Function က internal validations တွေ အားလုံး အောင်မြင်ကြောင်း ညွှန်ပြဖို့ `true` ကို ပြန်ပေးရပါမယ်။ မဟုတ်ရင် [`AssertionError`][] တစ်ခုနဲ့ မအောင်မြင်ပါဘူး။
```mjs
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Avoid returning anything from validation functions besides `true`.
    // Otherwise, it's not clear what part of the validation failed. Instead,
    // throw an error about the specific validation that failed (as done in this
    // example) and add as much helpful debugging information to that error as
    // possible.
    return true;
  },
  'unexpected error',
);
```

```
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Avoid returning anything from validation functions besides `true`.
    // Otherwise, it's not clear what part of the validation failed. Instead,
    // throw an error about the specific validation that failed (as done in this
    // example) and add as much helpful debugging information to that error as
    // possible.
    return true;
  },
  'unexpected error',
);
```
`error` က string ဖြစ်လို့ မရပါဘူး။ ဒုတိယ argument အနေနဲ့ string တစ်ခု ပေးလိုက်ရင် — `error` ကို ချန်လှပ်လိုက်တယ်လို့ ယူဆပြီး အဲဒီ string ကို `message` နေရာမှာ သုံးပါလိမ့်မယ်။ ဒါက လွယ်လွယ်နဲ့ သတိလက်လွတ် ဖြစ်စေနိုင်တဲ့ အမှားတွေကို ဖြစ်စေနိုင်ပါတယ်။ Throw လုပ်ခံရတဲ့ error message နဲ့ message တူညီနေမယ်ဆိုရင် `ERR_AMBIGUOUS_ARGUMENT` error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။ ဒုတိယ argument အနေနဲ့ string သုံးဖို့ စဉ်းစားနေတယ်ဆိုရင် အောက်က ဥပမာကို သေချာ ဖတ်ပါ:
```mjs
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// The second argument is a string and the input function threw an Error.
// The first case will not throw as it does not match for the error message
// thrown by the input function!
assert.throws(throwingFirst, 'Second');
// In the next example the message has no benefit over the message from the
// error and since it is not clear if the user intended to actually match
// against the error message, Node.js throws an `ERR_AMBIGUOUS_ARGUMENT` error.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// The string is only used (as message) in case the function does not throw:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// If it was intended to match for the error message do this instead:
// It does not throw because the error messages match.
assert.throws(throwingSecond, /Second$/);

// If the error message does not match, an AssertionError is thrown.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// The second argument is a string and the input function threw an Error.
// The first case will not throw as it does not match for the error message
// thrown by the input function!
assert.throws(throwingFirst, 'Second');
// In the next example the message has no benefit over the message from the
// error and since it is not clear if the user intended to actually match
// against the error message, Node.js throws an `ERR_AMBIGUOUS_ARGUMENT` error.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// The string is only used (as message) in case the function does not throw:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// If it was intended to match for the error message do this instead:
// It does not throw because the error messages match.
assert.throws(throwingSecond, /Second$/);

// If the error message does not match, an AssertionError is thrown.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
ဒီလို ရှုပ်ထွေးပြီး error ဖြစ်စေနိုင်တဲ့ အရေးအသား ပုံစံကြောင့် — ဒုတိယ argument အနေနဲ့ string ကို ရှောင်ကြဉ်ပါ။

## `assert.partialDeepStrictEqual(actual, expected[, message])`

* `actual` {any}
* `expected` {any}
* `message` {string|Error|Function}

`actual` နဲ့ `expected` parameter တွေကြား partial deep equality (တစ်စိတ်တစ်ပိုင်း နက်ရှိုင်းစွာ တူညီမှု) ရှိမရှိ စစ်ဆေးပါတယ်။ "Deep" equality ဆိုတာ — child objects တွေရဲ့ enumerable "own" properties တွေကို အောက်ပါ စည်းမျဉ်းတွေနဲ့အညီ recursive အလိုက် ထပ်ဆင့် အကဲဖြတ်သွားတာကိုလည်း ဆိုလိုပါတယ်။ "Partial" equality ဆိုတာ — `expected` parameter ပေါ်မှာ ရှိနေတဲ့ properties တွေကိုပဲ နှိုင်းယှဉ်မယ်ဆိုတာကို ဆိုလိုပါတယ်။

ဒီ method က [`assert.deepStrictEqual()`][] အတွက် အောင်မြင်တဲ့ test cases တွေကို အမြဲတမ်း အောင်မြင်စေပြီး — အဲဒါရဲ့ super set (ပိုကျယ်ပြန့်သော အစုအဝေး) အနေနဲ့ ပြုမူပါတယ်။

### Comparison details (နှိုင်းယှဉ်မှု အသေးစိတ်များ)

* Primitive values တွေကို [`Object.is()`][] သုံးပြီး နှိုင်းယှဉ်ပါတယ်။
* Objects တွေရဲ့ [Type tags][Object.prototype.toString()] က တူညီရပါမယ်။
* Objects တွေရဲ့ [`[[Prototype]]`][prototype-spec] တွေကို နှိုင်းယှဉ်မှာ မဟုတ်ပါဘူး။
* [enumerable "own" properties][] တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။
* {Error} ရဲ့ names, messages, causes, နဲ့ errors တွေကို enumerable properties တွေ မဟုတ်ရင်တောင် အမြဲတမ်း နှိုင်းယှဉ်ပါတယ်။
  `errors` ကိုလည်း နှိုင်းယှဉ်ပါတယ်။
* Enumerable ဖြစ်တဲ့ own {Symbol} properties တွေကိုလည်း နှိုင်းယှဉ်ပါတယ်။
* [Object wrappers][] တွေကို object အဖြစ်ရော unwrapped values အဖြစ်ပါ နှိုင်းယှဉ်ပါတယ်။
* `Object` properties တွေကို အစီအစဉ် မလိုက်ဘဲ နှိုင်းယှဉ်ပါတယ်။
* {Map} keys တွေနဲ့ {Set} items တွေကို အစီအစဉ် မလိုက်ဘဲ နှိုင်းယှဉ်ပါတယ်။
* နှစ်ဖက် ကွဲပြားသွားတဲ့အခါ (သို့) နှစ်ဖက်လုံး circular reference ကို ကြုံတွေ့တဲ့အခါ recursion က ရပ်တန့်ပါတယ်။
* {WeakMap}, {WeakSet} နဲ့ {Promise} instances တွေကို structural အရ **မနှိုင်းယှဉ်**ပါဘူး။ သူတို့က object တစ်ခုတည်းကိုပဲ ရည်ညွှန်းနေမှသာ တူညီပါတယ်။ မတူညီတဲ့ `WeakMap`, `WeakSet`, (သို့) `Promise` instances တွေ ကြားက နှိုင်းယှဉ်မှုတိုင်းက — content တွေ တူညီနေရင်တောင် မညီမျှမှုအဖြစ်ပဲ ရလဒ်ထွက်ပါတယ်။
* {RegExp} ရဲ့ lastIndex, flags, နဲ့ source တွေကို enumerable properties တွေ မဟုတ်ရင်တောင် အမြဲတမ်း နှိုင်းယှဉ်ပါတယ်။
* Sparse arrays တွေထဲက holes တွေကို လျစ်လျူရှုပါတယ်။
```mjs
import assert from 'node:assert';

assert.partialDeepStrictEqual(
  { a: { b: { c: 1 } } },
  { a: { b: { c: 1 } } },
);
// OK

assert.partialDeepStrictEqual(
  { a: 1, b: 2, c: 3 },
  { b: 2 },
);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 8],
);
// OK

assert.partialDeepStrictEqual(
  new Set([{ a: 1 }, { b: 1 }]),
  new Set([{ a: 1 }]),
);
// OK

assert.partialDeepStrictEqual(
  new Map([['key1', 'value1'], ['key2', 'value2']]),
  new Map([['key2', 'value2']]),
);
// OK

assert.partialDeepStrictEqual(123n, 123n);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [5, 4, 8],
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: 1 },
  { a: 1, b: 2 },
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: { b: 2 } },
  { a: { b: '2' } },
);
// AssertionError
```

```
const assert = require('node:assert');

assert.partialDeepStrictEqual(
  { a: { b: { c: 1 } } },
  { a: { b: { c: 1 } } },
);
// OK

assert.partialDeepStrictEqual(
  { a: 1, b: 2, c: 3 },
  { b: 2 },
);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 8],
);
// OK

assert.partialDeepStrictEqual(
  new Set([{ a: 1 }, { b: 1 }]),
  new Set([{ a: 1 }]),
);
// OK

assert.partialDeepStrictEqual(
  new Map([['key1', 'value1'], ['key2', 'value2']]),
  new Map([['key2', 'value2']]),
);
// OK

assert.partialDeepStrictEqual(123n, 123n);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [5, 4, 8],
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: 1 },
  { a: 1, b: 2 },
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: { b: 2 } },
  { a: { b: '2' } },
);
// AssertionError
```
[Object wrappers]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures#primitive_values
[Object.prototype.toString()]: https://tc39.github.io/ecma262/#sec-object.prototype.tostring
[`!=` operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality
[`===` operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality
[`==` operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality
[`AssertionError`]: #class-assertassertionerror
[`Class`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[`ERR_INVALID_RETURN_VALUE`]: errors.md#err_invalid_return_value
[`Object.is()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
[`assert.deepEqual()`]: #assertdeepequalactual-expected-message
[`assert.deepStrictEqual()`]: #assertdeepstrictequalactual-expected-message
[`assert.doesNotThrow()`]: #assertdoesnotthrowfn-error-message
[`assert.equal()`]: #assertequalactual-expected-message
[`assert.notDeepEqual()`]: #assertnotdeepequalactual-expected-message
[`assert.notDeepStrictEqual()`]: #assertnotdeepstrictequalactual-expected-message
[`assert.notEqual()`]: #assertnotequalactual-expected-message
[`assert.notStrictEqual()`]: #assertnotstrictequalactual-expected-message
[`assert.ok()`]: #assertokvalue-message
[`assert.strictEqual()`]: #assertstrictequalactual-expected-message
[`assert.throws()`]: #assertthrowsfn-error-message
[`getColorDepth()`]: tty.md#writestreamgetcolordepthenv
[`util.format()`]: util.md#utilformatformat-args
[enumerable "own" properties]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Enumerability_and_ownership_of_properties
[prototype-spec]: https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
