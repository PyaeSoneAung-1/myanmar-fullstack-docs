---
title: "Test runner"
description: "node:test module — built-in test runner — test()/describe()/it(), subtests, skipping/TODO/failing tests, only, name filtering, tags, watch mode, reporters & TAP, mock (MockTracker/MockTimers), snapshot testing, test coverage, run() API, specifiers စသည်"
order: 153
source: "https://nodejs.org/api/test.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

`node:test` module က JavaScript tests တွေကို ဖန်တီးခြင်းကို လွယ်ကူချောမွေ့စေပါတယ်။ ၎င်းကို ဝင်ရောက်သုံးစွဲဖို့:

```mjs
import test from 'node:test';
```

```cjs
const test = require('node:test');
```

ဒီ module ကို `node:` scheme အောက်မှာသာ ရရှိနိုင်ပါတယ်။

`test` module ကနေတစ်ဆင့် ဖန်တီးလိုက်တဲ့ tests တွေမှာ function တစ်ခုတည်း ပါဝင်ပြီး — အဲဒီ function ကို အောက်ပါ နည်းလမ်းသုံးမျိုးထဲက တစ်မျိုးနဲ့ process လုပ်ပါတယ်:

1. Exception တစ်ခုကို throw လုပ်ရင် failing (မအောင်မြင်) အဖြစ် သတ်မှတ်ပြီး — မဟုတ်ရင် passing (အောင်မြင်) အဖြစ် သတ်မှတ်ခံရတဲ့ synchronous function တစ်ခုပါ။
2. `Promise` တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုပါ — `Promise` က reject ဖြစ်ရင် failing အဖြစ် သတ်မှတ်ပြီး — fulfill ဖြစ်ရင်တော့ passing အဖြစ် သတ်မှတ်ပါတယ်။
3. Callback function တစ်ခုကို လက်ခံတဲ့ function တစ်ခုပါ။ Callback က ၎င်းရဲ့ ပထမဆုံး argument အနေနဲ့ truthy တန်ဖိုး တစ်ခုခုကို လက်ခံရရှိရင် test ကို failing အဖြစ် သတ်မှတ်ပြီး — falsy တန်ဖိုးတစ်ခုကို လက်ခံရရှိရင်တော့ passing အဖြစ် သတ်မှတ်ပါတယ်။ Test function က callback function တစ်ခုကို လက်ခံပြီး `Promise` တစ်ခုကိုပါ ပြန်ပေးမယ်ဆိုရင်တော့ test က fail ဖြစ်ပါလိမ့်မယ်။

အောက်ပါ ဥပမာက `test` module ကို သုံးပြီး tests တွေကို ဘယ်လို ရေးသားသလဲဆိုတာကို သရုပ်ပြပါတယ်။

```js
test('synchronous passing test', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});

test('synchronous failing test', (t) => {
  // This test fails because it throws an exception.
  assert.strictEqual(1, 2);
});

test('asynchronous passing test', async (t) => {
  // This test passes because the Promise returned by the async
  // function is settled and not rejected.
  assert.strictEqual(1, 1);
});

test('asynchronous failing test', async (t) => {
  // This test fails because the Promise returned by the async
  // function is rejected.
  assert.strictEqual(1, 2);
});

test('failing test using Promises', (t) => {
  // Promises can be used directly as well.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('this will cause the test to fail'));
    });
  });
});

test('callback passing test', (t, done) => {
  // done() is the callback function. When the setImmediate() runs, it invokes
  // done() with no arguments.
  setImmediate(done);
});

test('callback failing test', (t, done) => {
  // When the setImmediate() runs, done() is invoked with an Error object and
  // the test fails.
  setImmediate(() => {
    done(new Error('callback failure'));
  });
});
```

Test တစ်ခုခု fail ဖြစ်ခဲ့ရင် process ရဲ့ exit code ကို `1` အဖြစ် သတ်မှတ်ပါတယ်။

## Subtest များ (Subtests)

Test context ရဲ့ `test()` method က subtests တွေကို ဖန်တီးနိုင်စေပါတယ်။ ဒါက သင့် tests တွေကို — ကြီးမားတဲ့ test တစ်ခုအတွင်းမှာ nested tests တွေ ဖန်တီးနိုင်တဲ့ — အဆင့်ဆင့် (hierarchical) ပုံစံနဲ့ ဖွဲ့စည်းနိုင်စေပါတယ်။ ဒီ method က top level `test()` function နဲ့ ထပ်တူကျတဲ့ အပြုအမူအတိုင်း ပြုမူပါတယ်။ အောက်ပါ ဥပမာက subtests နှစ်ခုပါတဲ့ top level test တစ်ခုကို ဖန်တီးခြင်းကို သရုပ်ပြပါတယ်။

```js
test('top level test', async (t) => {
  await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```

> **Note:** `beforeEach` နဲ့ `afterEach` hooks တွေကို subtest တစ်ခုချင်းစီရဲ့ လုပ်ဆောင်မှုကြားမှာ trigger လုပ်ပါတယ်။

ဒီဥပမာမှာ subtests နှစ်ခုလုံး ပြီးဆုံးသွားကြောင်း သေချာစေဖို့ `await` ကို သုံးထားပါတယ်။ Suites တွေအတွင်းမှာ ဖန်တီးထားတဲ့ tests တွေနဲ့ မတူပဲ — tests တွေက ၎င်းတို့ရဲ့ subtests တွေ ပြီးဆုံးတာကို စောင့်မပေးတာမို့ — ဒါက လိုအပ်ပါတယ်။ ၎င်းတို့ရဲ့ parent ပြီးဆုံးသွားတဲ့အခါ မပြီးပြတ်သေးတဲ့ (outstanding) subtests တွေ မှန်သမျှကို cancel လုပ်ပြီး failures တွေအဖြစ် သတ်မှတ်ပါတယ်။ Subtest failure တစ်ခုခုက parent test ကိုပါ fail ဖြစ်စေပါတယ်။

## Failed tests များကို ပြန်လည် run လုပ်ခြင်း (Rerunning failed tests)

Test runner က run တစ်ခုရဲ့ state ကို file တစ်ခုထဲမှာ သိမ်းဆည်းထားနိုင်ပြီး — test suite တစ်ခုလုံးကို ပြန်လည် run စရာမလိုပဲ — failed tests တွေကို ပြန်လည် run လုပ်နိုင်စေပါတယ်။ Run ရဲ့ state ကို သိမ်းဆည်းမယ့် file path တစ်ခုကို သတ်မှတ်ဖို့ [`--test-rerun-failures`][] command-line option ကို သုံးပါ။ State file မရှိသေးဘူးဆိုရင် test runner က ၎င်းကို ဖန်တီးပေးပါလိမ့်မယ်။

State file က run attempts တွေရဲ့ array တစ်ခု ပါဝင်တဲ့ JSON file တစ်ခုပါ။ Run attempt တစ်ခုချင်းစီဟာ — အောင်မြင်ခဲ့တဲ့ (successful) tests တွေကို ၎င်းတို့ pass ဖြစ်ခဲ့တဲ့ attempt အမှတ်စဉ်နဲ့ ချိတ်ဆက် (map) ပေးထားတဲ့ object တစ်ခုပါ။ ဒီ map ထဲမှာ test တစ်ခုကို ခွဲခြားသတ်မှတ်တဲ့ key ကတော့ — test ကို define လုပ်ထားတဲ့နေရာရဲ့ line နဲ့ column အပါအဝင် — test file ရဲ့ path ဖြစ်ပါတယ်။ သတ်မှတ်ထားတဲ့ နေရာတစ်ခုမှာ define လုပ်ထားတဲ့ test တစ်ခုကို — ဥပမာ function တစ်ခု သို့မဟုတ် loop တစ်ခုအတွင်းမှာ — အကြိမ်ပေါင်းများစွာ run လုပ်တဲ့ အခြေအနေမျိုးမှာ test runs တွေ ရောထွေးမသွားစေဖို့ key ရဲ့ နောက်မှာ counter တစ်ခုကို ထည့်တွဲပေးပါတယ်။

Test တွေရဲ့ လည်ပတ်မှု အစီအစဉ် သို့မဟုတ် test တစ်ခုရဲ့ တည်နေရာကို ပြောင်းလဲလိုက်တာက tests တွေကို ယခင် attempt တစ်ခုမှာ pass ဖြစ်ပြီးသားလို့ test runner က ထင်မှတ်စေနိုင်တာမို့ — `--test-rerun-failures` ကို tests တွေ ပုံသေ (deterministic) အစီအစဉ်နဲ့ run တဲ့အခါမှာသာ သုံးသင့်ပါတယ်။

State file တစ်ခုရဲ့ ဥပမာ:

```json
[
  {
    "test.js:10:5": { "passed_on_attempt": 0, "name": "test 1" }
  },
  {
    "test.js:10:5": { "passed_on_attempt": 0, "name": "test 1" },
    "test.js:20:5": { "passed_on_attempt": 1, "name": "test 2" }
  }
]
```

ဒီဥပမာမှာ run attempts နှစ်ခု ရှိပြီး — `test.js` ထဲမှာ tests နှစ်ခု သတ်မှတ်ထားပါတယ် — ပထမ test က ပထမ attempt မှာ အောင်မြင်ခဲ့ပြီး ဒုတိယ test ကတော့ ဒုတိယ attempt မှာ အောင်မြင်ခဲ့ပါတယ်။

`--test-rerun-failures` option ကို သုံးတဲ့အခါ test runner က pass မဖြစ်သေးတဲ့ tests တွေကိုသာ run လုပ်ပါလိမ့်မယ်။

```bash
node --test-rerun-failures /path/to/state/file
```

## `describe()` and `it()` aliases

Suites နဲ့ tests တွေကို `describe()` နဲ့ `it()` functions တွေကို သုံးပြီးလည်း ရေးသားနိုင်ပါတယ်။ [`describe()`][] က [`suite()`][] ရဲ့ alias (အစားထိုး နာမည်တူ function) တစ်ခု ဖြစ်ပြီး — [`it()`][] ကတော့ [`test()`][] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

```js
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```

`describe()` နဲ့ `it()` တို့ကို `node:test` module ကနေ import လုပ်ပါတယ်။

```mjs
import { describe, it } from 'node:test';
```

```cjs
const { describe, it } = require('node:test');
```

## Tests များကို ကျော်သွားခြင်း (Skipping tests)

Test တစ်ခုချင်းစီကို — test ဆီကို `skip` option ဖြတ်သန်းပေးခြင်း သို့မဟုတ် အောက်ပါ ဥပမာမှာ ပြထားသလို test context ရဲ့ `skip()` method ကို ခေါ်ခြင်းအားဖြင့် — ကျော်သွား (skip) လုပ်နိုင်ပါတယ်။

```js
// The skip option is used, but no message is provided.
test('skip option', { skip: true }, (t) => {
  // This code is never executed.
});

// The skip option is used, and a message is provided.
test('skip option with message', { skip: 'this is skipped' }, (t) => {
  // This code is never executed.
});

test('skip() method', (t) => {
  // Make sure to return here as well if the test contains additional logic.
  t.skip();
});

test('skip() method with message', (t) => {
  // Make sure to return here as well if the test contains additional logic.
  t.skip('this is skipped');
});
```

## Todo အဖြစ် မှတ်သားထားသော tests (TODO tests)

Test တစ်ခုချင်းစီကို — test ဆီကို `todo` option ဖြတ်သန်းပေးခြင်း သို့မဟုတ် အောက်ပါ ဥပမာမှာ ပြထားသလို test context ရဲ့ `todo()` method ကို ခေါ်ခြင်းအားဖြင့် — flaky (မတည်မငြိမ်) သို့မဟုတ် မပြည့်စုံသေး (incomplete) အဖြစ် မှတ်သားနိုင်ပါတယ်။ ဒီလို tests တွေက ပြုပြင်ရန် လိုအပ်နေတဲ့ ဆောင်ရွက်ဆဲ (pending) implementation သို့မဟုတ် bug တစ်ခုကို ကိုယ်စားပြုပါတယ်။ TODO tests တွေကို run လုပ်ပါတယ် — ဒါပေမယ့် test failures တွေအဖြစ် မသတ်မှတ်တာမို့ process ရဲ့ exit code ကိုလည်း သက်ရောက်မှု မရှိပါဘူး။ Test တစ်ခုကို TODO ရော skipped ပါ နှစ်မျိုးလုံး အနေနဲ့ မှတ်သားထားရင်တော့ TODO option ကို လျစ်လျူရှုပါတယ်။

```js
// The todo option is used, but no message is provided.
test('todo option', { todo: true }, (t) => {
  // This code is executed, but not treated as a failure.
  throw new Error('this does not fail the test');
});

// The todo option is used, and a message is provided.
test('todo option with message', { todo: 'this is a todo test' }, (t) => {
  // This code is executed.
});

test('todo() method', (t) => {
  t.todo();
});

test('todo() method with message', (t) => {
  t.todo('this is a todo test and is not treated as a failure');
  throw new Error('this does not fail the test');
});
```

## Tests များ fail ဖြစ်ရန် မျှော်လင့်ခြင်း (Expecting tests to fail)

ဒါက သတ်မှတ်ထားတဲ့ test သို့မဟုတ် suite တစ်ခုအတွက် pass/fail အစီရင်ခံမှုကို ပြောင်းပြန် လှန်လိုက်ပါတယ်: flag တပ်ထားတဲ့ test case တစ်ခုက pass ဖြစ်ဖို့ throw လုပ်ရပြီး — throw မလုပ်တဲ့ flag တပ်ထားတဲ့ test case တစ်ခုကတော့ fail ဖြစ်ပါတယ်။

အောက်ပါ ဥပမာတွေထဲက တစ်ခုချင်းစီမှာ `doTheThing()` က `true` ကို ပြန်မပေးပေမယ့် — tests တွေကို `expectFailure` နဲ့ flag လုပ်ထားတာမို့ — pass ဖြစ်ပါတယ်။

```js
it.expectFailure('should do the thing', () => {
  assert.strictEqual(doTheThing(), true);
});

it('should do the thing', { expectFailure: true }, () => {
  assert.strictEqual(doTheThing(), true);
});

it('should do the thing', { expectFailure: 'feature not implemented' }, () => {
  assert.strictEqual(doTheThing(), true);
});
```

`expectFailure` ရဲ့ တန်ဖိုးက {RegExp|Function|Object|Error} ဖြစ်နေရင် — tests တွေက တူညီတဲ့ (matching) တန်ဖိုးတစ်ခုကို throw မှသာ pass ဖြစ်ပါလိမ့်မယ်။ တန်ဖိုးအမျိုးအစား တစ်ခုချင်းစီကို ဘယ်လို ကိုင်တွယ်သလဲဆိုတာအတွက် [`assert.throws`][] ကို ကြည့်ပါ။

အောက်ပါ test တစ်ခုချင်းစီကတော့ `expectFailure` နဲ့ flag လုပ်ထားပေမယ့် — failure က သတ်မှတ်ထားတဲ့ **မျှော်လင့်ထားသော** (expected) failure နဲ့ မကိုက်ညီလို့ — fail ဖြစ်နေပါတယ်။

```js
it('fails because regex does not match', {
  expectFailure: /expected message/,
}, () => {
  throw new Error('different message');
});

it('fails because object matcher does not match', {
  expectFailure: { code: 'ERR_EXPECTED' },
}, () => {
  const err = new Error('boom');
  err.code = 'ERR_ACTUAL';
  throw err;
});
```

`expectFailure` အတွက် အကြောင်းပြချက် (reason) ရော တိကျတဲ့ error ပါ နှစ်မျိုးလုံး ပေးချင်ရင် `{ label, match }` ကို သုံးပါ။

```js
it('should fail with specific error and reason', {
  expectFailure: {
    label: 'reason for failure',
    match: /error message/,
  },
}, () => {
  assert.strictEqual(doTheThing(), true);
});
```

`skip` နဲ့/သို့မဟုတ် `todo` တို့ဟာ `expectFailure` နဲ့ အပြန်အလှန် သီးသန့် (mutually exclusive) ဖြစ်ပြီး — နှစ်ခုလုံး သုံးထားတဲ့အခါ `skip` (သို့) `todo` က "အနိုင်ရ" (win) ပါတယ် (`skip` က နှစ်ခုလုံးအပေါ် အနိုင်ရပြီး — `todo` က `expectFailure` အပေါ် အနိုင်ရပါတယ်)။

ဒီ tests တွေကို skip လုပ်ပါလိမ့်မယ် (ပြီးတော့ run လုပ်မှာ မဟုတ်ပါ):

```js
it.expectFailure('should do the thing', { skip: true }, () => {
  assert.strictEqual(doTheThing(), true);
});

it.skip('should do the thing', { expectFailure: true }, () => {
  assert.strictEqual(doTheThing(), true);
});
```

ဒီ tests တွေကိုတော့ "todo" အဖြစ် မှတ်သားပါလိမ့်မယ် (errors တွေကို တိတ်ဆိတ်စေခြင်း):

```js
it.expectFailure('should do the thing', { todo: true }, () => {
  assert.strictEqual(doTheThing(), true);
});

it.todo('should do the thing', { expectFailure: true }, () => {
  assert.strictEqual(doTheThing(), true);
});
```

## `only` tests

Node.js ကို [`--test-only`][] command-line option နဲ့ စတင်လိုက်ရင် သို့မဟုတ် test isolation ကို disable လုပ်ထားရင် — run စေချင်တဲ့ tests တွေဆီကို `only` option ဖြတ်သန်းပေးခြင်းအားဖြင့် — ရွေးချယ်ထားတဲ့ subset တစ်ခုကလွဲလို့ tests တွေ အားလုံးကို ကျော်သွားနိုင်ပါတယ်။ `only` option ပါတဲ့ test တစ်ခုကို သတ်မှတ်လိုက်တဲ့အခါ — ၎င်းရဲ့ subtests တွေ အားလုံးကိုပါ run လုပ်ပါတယ်။ Suite တစ်ခုမှာ `only` option သတ်မှတ်ထားရင် — suite ထဲက tests တွေ အားလုံးကို run လုပ်ပြီး — `only` option ပါတဲ့ descendants တွေ ရှိနေရင်တော့ အဲဒီ tests တွေကိုသာ run လုပ်ပါတယ်။

[subtests][] တွေကို `test()`/`it()` အတွင်းမှာ သုံးတဲ့အခါ — ရွေးချယ်ထားတဲ့ tests subset တစ်ခုကိုသာ run လုပ်ဖို့ — ancestor tests တွေ အားလုံးကို `only` option နဲ့ မှတ်သားပေးဖို့ လိုအပ်ပါတယ်။

Test context ရဲ့ `runOnly()` method ကို သုံးပြီး subtest အဆင့်မှာလည်း အလားတူ အပြုအမူကို အကောင်အထည်ဖော်နိုင်ပါတယ်။ Run မလုပ်တဲ့ tests တွေကို test runner ရဲ့ output ကနေ ချန်လှပ်ထားပါတယ်။

```js
// Assume Node.js is run with the --test-only command-line option.
// The suite's 'only' option is set, so these tests are run.
test('this test is run', { only: true }, async (t) => {
  // Within this test, all subtests are run by default.
  await t.test('running subtest');

  // The test context can be updated to run subtests with the 'only' option.
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // Switch the context back to execute all tests.
  t.runOnly(false);
  await t.test('this subtest is now run');

  // Explicitly do not run these tests.
  await t.test('skipped subtest 3', { only: false });
  await t.test('skipped subtest 4', { skip: true });
});

// The 'only' option is not set, so this test is skipped.
test('this test is not run', () => {
  // This code is not run.
  throw new Error('fail');
});

describe('a suite', () => {
  // The 'only' option is set, so this test is run.
  it('this test is run', { only: true }, () => {
    // This code is run.
  });

  it('this test is not run', () => {
    // This code is not run.
    throw new Error('fail');
  });
});

describe.only('a suite', () => {
  // The 'only' option is set, so this test is run.
  it('this test is run', () => {
    // This code is run.
  });

  it('this test is run', () => {
    // This code is run.
  });
});
```

## Test များကို အမည်ဖြင့် စစ်ထုတ်ခြင်း (Filtering tests by name)

[`--test-name-pattern`][] command-line option ကို သုံးပြီး — ပေးထားတဲ့ pattern နဲ့ ကိုက်ညီတဲ့ အမည်ရှိတဲ့ tests တွေကိုသာ run လုပ်နိုင်ပြီး — [`--test-skip-pattern`][] option ကိုတော့ ပေးထားတဲ့ pattern နဲ့ ကိုက်ညီတဲ့ အမည်ရှိတဲ့ tests တွေကို ကျော်သွားဖို့ သုံးနိုင်ပါတယ်။ Test name patterns တွေကို JavaScript regular expressions တွေအနေနဲ့ အနက်ဖွင့်ပါတယ်။ `--test-name-pattern` နဲ့ `--test-skip-pattern` options တွေကို nested tests တွေ run လုပ်နိုင်ဖို့အတွက် အကြိမ်များစွာ သတ်မှတ်နိုင်ပါတယ်။ Run လုပ်တဲ့ test တစ်ခုချင်းစီအတွက် — `beforeEach()` လိုမျိုး သက်ဆိုင်ရာ test hooks တွေကိုပါ run လုပ်ပါတယ်။ Run မလုပ်တဲ့ tests တွေကို test runner ရဲ့ output ကနေ ချန်လှပ်ထားပါတယ်။

အောက်ပါ test file ကို ကြည့်လျှင် — Node.js ကို `--test-name-pattern="test [1-3]"` option နဲ့ စတင်လိုက်ရင် test runner က `test 1`, `test 2`, နဲ့ `test 3` တို့ကို run လုပ်ပါလိမ့်မယ်။ `test 1` က test name pattern နဲ့ မကိုက်ညီခဲ့ရင် — ၎င်းရဲ့ subtests တွေက pattern နဲ့ ကိုက်ညီနေပေမယ့် — run လုပ်မှာ မဟုတ်ပါဘူး။ အလားတူ tests အစုကိုပဲ — `--test-name-pattern` ကို အကြိမ်များစွာ ဖြတ်သန်းခြင်းအားဖြင့်လည်း run လုပ်နိုင်ပါတယ် (ဥပမာ — `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"` စသဖြင့်)။

```js
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```

Test name patterns တွေကို regular expression literals တွေကို သုံးပြီးလည်း သတ်မှတ်နိုင်ပါတယ်။ ဒါက regular expression flags တွေကို သုံးနိုင်စေပါတယ်။ အရင် ဥပမာမှာ — Node.js ကို `--test-name-pattern="/test [4-5]/i"` (သို့မဟုတ် `--test-skip-pattern="/test [4-5]/i"`) နဲ့ စတင်လိုက်ရင် — pattern က case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိ) ဖြစ်တာမို့ — `Test 4` နဲ့ `Test 5` တို့နဲ့ ကိုက်ညီမှာ ဖြစ်ပါတယ်။

Pattern တစ်ခုနဲ့ test တစ်ခုတည်းကိုသာ ကိုက်ညီစေချင်ရင် — ၎င်း၏ ထူးခြားမှုကို သေချာစေရန် — ၎င်းရဲ့ ancestor test names တွေ အားလုံးကို space နဲ့ ခွဲပြီး ရှေ့ကနေ ရှေ့ဆွဲ (prefix) ထည့်ပေးနိုင်ပါတယ်။ ဥပမာ — အောက်ပါ test file ကို ကြည့်ပါ:

```js
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```

Node.js ကို `--test-name-pattern="test 1 some test"` နဲ့ စတင်လိုက်ရင် `test 1` ထဲက `some test` ကိုသာ ကိုက်ညီမှာ ဖြစ်ပါတယ်။

Test name patterns တွေက test runner run လုပ်မယ့် files အစုကို ပြောင်းလဲပေးတာ မဟုတ်ပါဘူး။

`--test-name-pattern` ရော `--test-skip-pattern` ပါ နှစ်ခုလုံး ပေးထားရင် — tests တွေ run လုပ်ဖို့အတွက် သတ်မှတ်ချက် **နှစ်ခုလုံး** (both) ကို ကျေနပ်စေရပါမယ်။

## Test tag များ (Test tags)

> Stability: 1.0 - Early development

Tags တွေက tests နဲ့ suites တွေကို စိတ်ကြိုက် string labels တွေနဲ့ မှတ်သား (annotate) ပေးပါတယ်။ [`--experimental-test-tag-filter`][] CLI flag (သို့မဟုတ် [`run()`][] ပေါ်က `testTagFilters` option) က အဲဒီ labels တွေအပေါ် boolean expression တစ်ခုနဲ့ tests တွေကို ရွေးချယ်ပါတယ်။

Tags တွေက metadata တွေကို test names တွေထဲမှာ ထည့်သွင်း encode လုပ်ခြင်းရဲ့ အခြားရွေးချယ်စရာ (alternative) တစ်ခုပါ။ ၎င်းတို့က subsystem, speed bucket (မြန်နှုန်း အမျိုးအစား), flakiness (မတည်မငြိမ်ဖြစ်မှု) သို့မဟုတ် environment လိုမျိုး — name pattern တစ်ခုက ပျက်စီးလွယ် (brittle) ဖြစ်နိုင်တဲ့ — cross-cutting (ကဏ္ဍပေါင်းစုံ ဖြတ်သန်းသော) axes တွေအတွက် အသုံးဝင်ပါတယ်။

### Tagged tests များ ရေးသားခြင်း (Authoring tagged tests)

`test()`, `it()`, `suite()`, (သို့) `describe()` တွေထဲက ဘယ်ဟာပေါ်မှာမဆို `tags` array တစ်ခုကို ဖြတ်သန်းပေးပါ။ Tags တွေက suite တစ်ခုကနေ ၎င်းရဲ့ child tests တွေဆီကို union (ပေါင်းစည်းမှု) အားဖြင့် အမွေဆက်ခံပါတယ် — `['db']` လို့ tag လုပ်ထားတဲ့ suite တစ်ခုအတွင်းက test တစ်ခုက ကိုယ်ပိုင် `tags: ['integration']` ကို ကြေညာထားရင် — ထိရောက်စွာ ဆိုရရင် tags နှစ်ခုလုံး ရှိပါတယ်။

```mjs
import { describe, it } from 'node:test';

describe('database', { tags: ['db'] }, () => {
  it('reads a row');                                            // tags: ['db']
  it('writes a row', { tags: ['integration'] });                // tags: ['db', 'integration']
  it('reconnects after disconnect', { tags: ['flaky'] });       // tags: ['db', 'flaky']
});
```

```cjs
const { describe, it } = require('node:test');

describe('database', { tags: ['db'] }, () => {
  it('reads a row');                                            // tags: ['db']
  it('writes a row', { tags: ['integration'] });                // tags: ['db', 'integration']
  it('reconnects after disconnect', { tags: ['flaky'] });       // tags: ['db', 'flaky']
});
```

Tag values တွေဟာ — whitespace မပါဝင်၊ operator characters (`& | ! ( ) *`) တွေ မပါဝင်ပြီး — `'and'`, `'or'`, (သို့) `'not'` ဆိုတဲ့ reserved words တွေ (စာလုံးပေါင်း ဘယ်ပုံစံနဲ့မဆို) မဟုတ်တဲ့ — ဗလာမဟုတ်တဲ့ (non-empty) strings တွေ ဖြစ်ရပါမယ်။ Tags တွေကို case-insensitive အနေနဲ့ ကိုက်ညီစစ်ဆေးပြီး — canonical (စံသတ်မှတ်) ပုံစံကတော့ lowercase ပါ။ `tags` array တစ်ခုတည်းအတွင်းက ထပ်နေတဲ့ (duplicate) တန်ဖိုးတွေကို lowercase ပုံစံပေါ် မူတည်ပြီး — ပထမဆုံး မြင်ရတဲ့ ကြေညာမှု အစီအစဉ်ကို ထိန်းသိမ်းကာ — ဖယ်ရှားပေါင်းစည်း (collapse) လုပ်ပါတယ်။

Hooks (`before`, `after`, `beforeEach`, `afterEach`) တွေက ကိုယ်ပိုင် tags တွေကို ကြေညာလေ့ မရှိပါဘူး။ ၎င်းတို့ဟာ suite ရဲ့ tags တွေကို သယ်ဆောင်ထားတဲ့ — ၎င်းတို့ ပိုင်ဆိုင်တဲ့ suite ၏ အစိတ်အပိုင်း အနေနဲ့ run လုပ်ပါတယ်။

### Filter စစ်ထုတ်ခြင်း syntax (Filtering syntax)

Filter expression က အောက်ပါတို့ကို ပံ့ပိုးပေးပါတယ်:

* Identifiers — whitespace မဟုတ်တဲ့၊ operator မဟုတ်တဲ့ စာလုံးတွေ မှန်သမျှ ဖြစ်ပါတယ်။ Literal identifier တစ်ခုက တူညီတဲ့ တန်ဖိုးရှိတဲ့ tag တစ်ခုနဲ့ ကိုက်ညီပါတယ် (case-insensitive)။
* `*` wildcards တွေက identifier တစ်ခုအတွင်းမှာ စာလုံး မည်သည့် sequence နဲ့မဆို ကိုက်ညီပါတယ်။ `*` တစ်ခုတည်း (bare) ကတော့ tagged test မည်သည်နဲ့မဆို ကိုက်ညီပါတယ်။
* Boolean operators တွေမှာ ညီမျှတဲ့ ပုံစံနှစ်မျိုး ရှိပါတယ်:
  * `and` / `&&`
  * `or` / `||`
  * `not` / `!`
* Grouping (အုပ်စုဖွဲ့ခြင်း) အတွက် parentheses တွေပါ။

Word ပုံစံတွေ (`and`, `or`, `not`) က whitespace ခြားပေးဖို့ လိုအပ်ပြီး — punctuation ပုံစံတွေကတော့ မလိုအပ်ပါဘူး။

#### Operator ဦးစားပေးမှု (Operator precedence)

Expression ကို စံ (standard) precedence ဖြစ်တဲ့ `not > and > or` နဲ့ အကဲဖြတ်ပါတယ်။ Binary operators တွေက left-associative (ဘယ်ဘက်မှ စတင် တွဲစပ်သော) ဖြစ်ပါတယ်။

| Expression     | Equivalent grouping |
| -------------- | ------------------- |
| `a or b and c` | `a or (b and c)`    |
| `not a and b`  | `(not a) and b`     |

Override လုပ်ဖို့ parentheses တွေကို သုံးပါ:

| Expression                     | Selects                                    |
| ------------------------------ | ------------------------------------------ |
| `(unit or smoke) and not slow` | slow မဟုတ်တဲ့ unit-or-smoke tests များကို ရွေးချယ်ပါတယ် |
| `db && !flaky`                 | flaky မဟုတ်တဲ့ db tests များကို ရွေးချယ်ပါတယ် |
| `*`                            | tagged test တိုင်းကို ရွေးချယ်ပါတယ် |

#### Tag မပါသော tests (Untagged tests)

Tag မပါတဲ့ tests တွေက tag set အလွတ် (empty tag set) တစ်ခု ရှိနေသလိုမျိုး ပြုမူပါတယ်။ ရလဒ်အနေနဲ့:

| Filter expression        | Untagged test | Why                                              |
| ------------------------ | ------------- | ------------------------------------------------ |
| `db`                     | ဖယ်ထုတ်ခံရ   | Tag set အလွတ်တစ်ခုအပေါ် positive match က false ဖြစ်ပါတယ် |
| `*`                      | ဖယ်ထုတ်ခံရ   | Bare wildcard က tag အနည်းဆုံး တစ်ခု လိုအပ်ပါတယ် |
| `db or unit`             | ဖယ်ထုတ်ခံရ   | Tag set အလွတ်တစ်ခုအပေါ် branch နှစ်ခုလုံး false ဖြစ်ပါတယ် |
| `not flaky`              | ပါဝင်သည်     | Tag set အလွတ်တစ်ခုအပေါ် negation က true ဖြစ်ပါတယ် |
| `not flaky and not slow` | ပါဝင်သည်     | Tag set အလွတ်တစ်ခုအပေါ် negations နှစ်ခုလုံး true ဖြစ်ပါတယ် |
| `db or not flaky`        | ပါဝင်သည်     | Negated branch က true ဖြစ်ပါတယ် |

ဥပမာ — `--experimental-test-tag-filter='not flaky'` က `flaky` လို့ tag မလုပ်ထားတဲ့ test တိုင်းကို run လုပ်ပြီး — tag မပါတဲ့ tests တွေ အားလုံးလည်း ပါဝင်ပါတယ်။

#### Filter များစွာ ပေါင်းစပ်ခြင်း (Composing multiple filters)

[`--experimental-test-tag-filter`][] ကို command line ပေါ်မှာ တစ်ကြိမ်ထက်ပိုပြီး သတ်မှတ်နိုင်ပါတယ်။ Expression အများအပြားကို AND နဲ့ ပေါင်းစပ်ပါတယ် — test တစ်ခု run ဖြစ်ဖို့အတွက် expression တိုင်းကို ကျေနပ်စေရပါမယ်။ [`run()`][] ပေါ်က `testTagFilters` ဆီကို array တစ်ခု ဖြတ်သန်းတာလည်း အလားတူပဲ ဖြစ်ပါတယ်။ Tag filter ကို [`--test-name-pattern`][], [`--test-skip-pattern`][] နဲ့ `.only` filtering တို့နဲ့လည်း AND လုပ်ပါတယ်။

#### Test အတွင်းမှ tags များကို ဖတ်ခြင်း (Reading tags from inside a test)

[`TestContext`][] object က test ရဲ့ tags တွေကို [`context.tags`][] ကနေတစ်ဆင့် frozen array (ပြောင်းလဲ၍မရသော array) တစ်ခုအနေနဲ့ ထုတ်ဖော်ပေးတာမို့ — tests တွေက ၎င်းတို့ရဲ့ ကိုယ်ပိုင် metadata ပေါ်မူတည်ပြီး လမ်းခွဲ (branch) လုပ်နိုင်ပါတယ်။

#### Error များ (Errors)

အပေါ်က validation rules တွေကို ချိုးဖောက်တဲ့ tag value တစ်ခုက — test တစ်ခုခု run မလုပ်ခင် — registration ပြုလုပ်တဲ့ နေရာမှာ `ERR_INVALID_ARG_VALUE` ကို throw လုပ်ပါတယ်။ Array မဟုတ်တဲ့ `tags` value တစ်ခုက `ERR_INVALID_ARG_TYPE` ကို throw လုပ်ပါတယ်။ CLI ပေါ်မှာ ပုံစံမမှန်တဲ့ (malformed) filter expression တစ်ခု ရှိရင် — test file တစ်ခုခု run မလုပ်ခင် — test runner က non-zero status နဲ့ ထွက်သွားစေပါတယ်။

## Test ပြီးဆုံးပြီးနောက် ကျန်ရစ်သော asynchronous လုပ်ဆောင်မှုများ (Extraneous asynchronous activity)

Test function တစ်ခု လုပ်ဆောင်ပြီးဆုံးသွားတာနဲ့ — tests တွေရဲ့ အစီအစဉ်ကို ထိန်းသိမ်းရင်း — ရလဒ်တွေကို တတ်နိုင်သမျှ မြန်မြန် အစီရင်ခံပါတယ်။ သို့သော်လည်း — test function က test ကိုယ်တိုင်ထက် ပိုကြာရှည်နေတဲ့ asynchronous လုပ်ဆောင်မှုတွေကို ထုတ်လုပ်ဖို့ ဖြစ်နိုင်ပါတယ်။ Test runner က ဒီလို လုပ်ဆောင်မှု အမျိုးအစားကို ကိုင်တွယ်ပေးပေမယ့် — ၎င်းကို လိုက်လျောဖို့အတွက် test ရလဒ်တွေရဲ့ အစီရင်ခံမှုကိုတော့ နှောင့်နှေးစေတာ မဟုတ်ပါဘူး။

အောက်ပါ ဥပမာမှာ test တစ်ခုက `setImmediate()` လုပ်ဆောင်မှု နှစ်ခု ဆက်လက် ဆောင်ရွက်ဆဲ (outstanding) ရှိနေတုန်းမှာ ပြီးဆုံးသွားပါတယ်။ ပထမ `setImmediate()` က subtest အသစ်တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Parent test က ပြီးဆုံးပြီး ၎င်းရဲ့ ရလဒ်တွေကို ထုတ်ပြီးသွားလို့ — subtest အသစ်ကို ချက်ချင်း failed အဖြစ် မှတ်သားပြီး — နောက်ပိုင်းမှာ {TestsStream} ဆီကို အစီရင်ခံပါတယ်။

ဒုတိယ `setImmediate()` က `uncaughtException` event တစ်ခုကို ဖန်တီးပါတယ်။ ပြီးဆုံးသွားတဲ့ test တစ်ခုကနေ စတင်ဖြစ်ပေါ်လာတဲ့ `uncaughtException` နဲ့ `unhandledRejection` events တွေကို `test` module က failed အဖြစ် မှတ်သားပြီး — {TestsStream} က top level မှာ diagnostic warnings တွေအနေနဲ့ အစီရင်ခံပါတယ်။

```js
test('a test that creates asynchronous activity', (t) => {
  setImmediate(() => {
    t.test('subtest that is created too late', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // The test finishes after this line.
});
```

## စောင့်ကြည့် mode (Watch mode)

> Stability: 1 - Experimental

Node.js test runner က `--watch` flag ကို ဖြတ်သန်းပေးခြင်းအားဖြင့် watch mode နဲ့ run လုပ်ခြင်းကို ပံ့ပိုးပေးပါတယ်:

```bash
node --test --watch
```

Watch mode မှာ test runner က test files တွေနဲ့ ၎င်းတို့ရဲ့ dependencies တွေမှာ ပြောင်းလဲမှု ရှိမရှိ စောင့်ကြည့်ပါတယ်။ ပြောင်းလဲမှုတစ်ခုကို တွေ့ရှိရတဲ့အခါ — test runner က အဲဒီ ပြောင်းလဲမှုကြောင့် သက်ရောက်မှု ရှိတဲ့ tests တွေကို ပြန်လည် run လုပ်ပါတယ်။ Test runner က process ကို terminate လုပ်လိုက်တဲ့အထိ ဆက်လက် run နေပါလိမ့်မယ်။

## Global setup နှင့် teardown (Global setup and teardown)

> Stability: 1.0 - Early development

Test runner က — tests တွေ အားလုံး run မလုပ်ခင် အကဲဖြတ် (evaluate) လုပ်ခံရမယ့် — module တစ်ခုကို သတ်မှတ်နိုင်စေပြီး — tests တွေအတွက် global state သို့မဟုတ် fixtures တွေကို တည်ဆောက်ဖို့ သုံးနိုင်ပါတယ်။ ဒါက tests အများအပြားမှာ လိုအပ်တဲ့ resources တွေကို ပြင်ဆင်တာ သို့မဟုတ် shared state တစ်ခုကို တည်ဆောက်တာတွေအတွက် အသုံးဝင်ပါတယ်။

ဒီ module က အောက်ပါတို့ထဲက ဘယ်ဟာကိုမဆို export လုပ်နိုင်ပါတယ်:

* Tests တွေ အားလုံး မစတင်ခင် တစ်ကြိမ် run လုပ်တဲ့ `globalSetup` function တစ်ခု
* Tests တွေ အားလုံး ပြီးဆုံးပြီးနောက်မှာ တစ်ကြိမ် run လုပ်တဲ့ `globalTeardown` function တစ်ခု

Module ကို command line ကနေ tests run လုပ်တဲ့အခါ `--test-global-setup` flag ကို သုံးပြီး သတ်မှတ်ပါတယ်။

```cjs
// setup-module.js
async function globalSetup() {
  // Setup shared resources, state, or environment
  console.log('Global setup executed');
  // Run servers, create files, prepare databases, etc.
}

async function globalTeardown() {
  // Clean up resources, state, or environment
  console.log('Global teardown executed');
  // Close servers, remove files, disconnect from databases, etc.
}

module.exports = { globalSetup, globalTeardown };
```

```mjs
// setup-module.mjs
export async function globalSetup() {
  // Setup shared resources, state, or environment
  console.log('Global setup executed');
  // Run servers, create files, prepare databases, etc.
}

export async function globalTeardown() {
  // Clean up resources, state, or environment
  console.log('Global teardown executed');
  // Close servers, remove files, disconnect from databases, etc.
}
```

Global setup function က error တစ်ခုကို throw လုပ်ခဲ့ရင် — tests တွေ ဘာမှ run လုပ်မှာ မဟုတ်ပဲ — process က non-zero exit code နဲ့ ထွက်သွားပါလိမ့်မယ်။ ဒီလို အခြေအနေမျိုးမှာ global teardown function ကို ခေါ်မှာ မဟုတ်ပါဘူး။

## Command line မှ tests များ run လုပ်ခြင်း (Running tests from the command line)

Node.js test runner ကို [`--test`][] flag ကို ဖြတ်သန်းပေးခြင်းအားဖြင့် command line ကနေ ခေါ်ယူ (invoke) နိုင်ပါတယ်:

```bash
node --test
```

Default အနေနဲ့ Node.js က အောက်ပါ patterns တွေနဲ့ ကိုက်ညီတဲ့ files တွေ အားလုံးကို run လုပ်ပါလိမ့်မယ်:

* `**/*.test.{cjs,mjs,js}`
* `**/*-test.{cjs,mjs,js}`
* `**/*_test.{cjs,mjs,js}`
* `**/test-*.{cjs,mjs,js}`
* `**/test.{cjs,mjs,js}`
* `**/test/**/*.{cjs,mjs,js}`

[`--no-strip-types`][] ကို မပေးထားဘူးဆိုရင် အောက်ပါ ထပ်ဆောင်း patterns တွေနဲ့လည်း ကိုက်ညီပါတယ်:

* `**/*.test.{cts,mts,ts}`
* `**/*-test.{cts,mts,ts}`
* `**/*_test.{cts,mts,ts}`
* `**/test-*.{cts,mts,ts}`
* `**/test.{cts,mts,ts}`
* `**/test/**/*.{cts,mts,ts}`

တနည်းအားဖြင့် — glob pattern တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတာကို အောက်မှာ ပြထားသလို — Node.js command ရဲ့ နောက်ဆုံး argument(s) အနေနဲ့ ပေးနိုင်ပါတယ်။ Glob patterns တွေက [`glob(7)`][] ရဲ့ အပြုအမူအတိုင်း လိုက်နာပါတယ်။ Glob patterns တွေကို command line ပေါ်မှာ double quotes တွေနဲ့ ပတ်ထားသင့်ပါတယ် — ဒါက shell expansion ကို တားဆီးပေးပြီး — shell expansion က system အမျိုးမျိုးကြား portability (သယ်ယူသုံးစွဲနိုင်မှု) ကို လျှော့ချနိုင်လို့ပါ။

```bash
node --test "**/*.test.js" "**/*.spec.js"
```

### Tests execution order ကို ကျပန်းလုပ်ခြင်း (Randomizing tests execution order)

> Stability: 1.0 - Early development

Test runner က — order-dependent tests တွေကို ရှာဖွေတွေ့ရှိဖို့ ကူညီရန် — execution order ကို ကျပန်း (randomize) လုပ်နိုင်ပါတယ်။ Enable လုပ်ထားရင် runner က ရှာဖွေတွေ့ရှိထားတဲ့ test files တွေရော file တစ်ခုချင်းစီအတွင်းက queue တင်ထားတဲ့ tests တွေကိုပါ ကျပန်း ပြောင်းလဲပါတယ်။ ဒီ mode ကို enable လုပ်ဖို့ `--test-randomize` ကို သုံးပါ။

```bash
node --test --test-randomize
```

Randomization enable လုပ်ထားတဲ့အခါ test runner က run အတွက် သုံးထားတဲ့ seed ကို diagnostic message တစ်ခုအနေနဲ့ ပုံနှိပ်ထုတ်ပေးပါတယ်:

```text
Randomized test order seed: 12345
```

`--test-random-seed=<number>` ကို သုံးပြီး တူညီတဲ့ randomized order ကို deterministic အနေနဲ့ ပြန်လည် ဖွင့်သုံး (replay) နိုင်ပါတယ်။ `--test-random-seed` ကို ပေးလိုက်တာက randomization ကိုပါ enable လုပ်ပေးတာမို့ — seed တစ်ခု ပေးထားတဲ့အခါ `--test-randomize` က optional ပါ:

```bash
node --test --test-random-seed=12345
```

Test files အများစုမှာ randomization က အလိုအလျောက် အလုပ်လုပ်ပါတယ်။ အရေးကြီးတဲ့ ခြွင်းချက်တစ်ခုကတော့ — subtests တွေကို တစ်ခုပြီးတစ်ခု await လုပ်တဲ့အခါမျိုးပါ။ အဲဒီ pattern မှာ subtest တစ်ခုချင်းစီက ယခင် subtest ပြီးဆုံးမှသာ စတင်တာမို့ — runner က randomization လုပ်မယ့်အစား declaration order ကိုပဲ ထိန်းသိမ်းပါတယ်။

ဥပမာ — ဒါက sequential အနေနဲ့ run ပြီး **randomized မဟုတ်ပါဘူး**။

```mjs
import test from 'node:test';

test('math', async (t) => {
  for (const name of ['adds', 'subtracts', 'multiplies']) {
    // Sequentially awaiting each subtest preserves declaration order.
    await t.test(name, async () => {});
  }
});
```

```cjs
const test = require('node:test');

test('math', async (t) => {
  for (const name of ['adds', 'subtracts', 'multiplies']) {
    // Sequentially awaiting each subtest preserves declaration order.
    await t.test(name, async () => {});
  }
});
```

`describe()`/`it()` သို့မဟုတ် `suite()`/`test()` လိုမျိုး suite-style APIs တွေကို သုံးတာကတော့ — sibling tests တွေကို အတူတကွ enqueue လုပ်တာမို့ — randomization ကို ဆက်လက် ခွင့်ပြုပါတယ်။

ဥပမာ — ဒါက randomization အတွက် အရည်အချင်း ပြည့်မီဆဲပါ။

```mjs
import { describe, it } from 'node:test';

describe('math', () => {
  it('adds', () => {});
  it('subtracts', () => {});
  it('multiplies', () => {});
});
```

```cjs
const { describe, it } = require('node:test');

describe('math', () => {
  it('adds', () => {});
  it('subtracts', () => {});
  it('multiplies', () => {});
});
```

`--test-randomize` နဲ့ `--test-random-seed` တို့ကို `--watch` mode နဲ့ဆို support မလုပ်ပါဘူး။

ကိုက်ညီတဲ့ files တွေကို test files တွေအနေနဲ့ run လုပ်ပါတယ်။ Test file တွေရဲ့ လုပ်ဆောင်မှုနဲ့ ပတ်သက်တဲ့ ထပ်ဆောင်း အချက်အလက်တွေကို [test runner execution model][] section မှာ တွေ့နိုင်ပါတယ်။

### Test runner ၏ execution model (Test runner execution model)

Process-level test isolation ကို enable လုပ်ထားတဲ့အခါ — ကိုက်ညီတဲ့ test file တစ်ခုချင်းစီကို သီးခြား child process တစ်ခုအတွင်းမှာ run လုပ်ပါတယ်။ တစ်ချိန်တည်းမှာ run နေတဲ့ child processes တွေရဲ့ အများဆုံး အရေအတွက်ကို [`--test-concurrency`][] flag က ထိန်းချုပ်ပါတယ်။ Child process က exit code 0 နဲ့ ပြီးဆုံးခဲ့ရင် test ကို passing အဖြစ် သတ်မှတ်ပြီး — မဟုတ်ရင်တော့ failure အဖြစ် သတ်မှတ်ပါတယ်။ Test files တွေက Node.js နဲ့ run လို့ရတဲ့ (executable) files တွေ ဖြစ်ရပါမယ် — ဒါပေမယ့် အတွင်းမှာ `node:test` module ကို သုံးဖို့တော့ မလိုအပ်ပါဘူး။

Test file တစ်ခုချင်းစီကို သာမန် script တစ်ခုလိုမျိုး run လုပ်ပါတယ်။ ဆိုလိုတာက — test file ကိုယ်တိုင်က `node:test` ကို သုံးပြီး tests တွေ သတ်မှတ်ထားရင် — [`test()`][] ရဲ့ `concurrency` option ရဲ့ တန်ဖိုး ဘယ်လိုပဲ ရှိပါစေ — အဲဒီ tests တွေ အားလုံးကို application thread တစ်ခုတည်းအတွင်းမှာ run လုပ်ပါလိမ့်မယ်။

Process-level test isolation ကို disable လုပ်ထားတဲ့အခါ — ကိုက်ညီတဲ့ test file တစ်ခုချင်းစီကို test runner process ထဲကို import လုပ်ပါတယ်။ Test files တွေ အားလုံး load လုပ်ပြီးတာနဲ့ — top level tests တွေကို concurrency တစ်ခုနဲ့ run လုပ်ပါတယ်။ Test files တွေ အားလုံးကို context တစ်ခုတည်းအတွင်းမှာ run လုပ်တာမို့ — tests တွေက isolation enable လုပ်ထားတဲ့အခါမှာ မဖြစ်နိုင်တဲ့ နည်းလမ်းတွေနဲ့ တစ်ခုနဲ့တစ်ခု အပြန်အလှန် သက်ရောက်မှု ရှိနိုင်ပါတယ်။ ဥပမာ — test တစ်ခုက global state ပေါ်ကို မှီခိုနေရင် — အဲဒီ state ကို တခြား file တစ်ခုကနေ လာတဲ့ test တစ်ခုက ပြုပြင်မွမ်းမံဖို့ ဖြစ်နိုင်ပါတယ်။

#### Child process option အမွေဆက်ခံခြင်း (Child process option inheritance)

Process isolation mode (default) နဲ့ tests run လုပ်တဲ့အခါ — spawn လုပ်လိုက်တဲ့ child processes တွေက [configuration files][] ထဲမှာ သတ်မှတ်ထားတာတွေ အပါအဝင် — Node.js options တွေကို parent process ကနေ အမွေဆက်ခံပါတယ်။ သို့သော်လည်း — test runner ရဲ့ လုပ်ဆောင်ချက်တွေ မှန်ကန်စေဖို့အတွက် — flags အချို့ကို စစ်ထုတ် (filter out) လုပ်ထားပါတယ်:

* `--test` — Recursive test execution တွေ မဖြစ်အောင် တားဆီးထားပါတယ်
* `--experimental-test-coverage` — Test runner က စီမံပါတယ်
* `--experimental-test-tag-filter` — Filter expressions တွေကို parent process က validate လုပ်ပြီး child processes တွေဆီကို ပြန်လည် emit လုပ်ပါတယ်
* `--watch` — Watch mode ကို parent level မှာ ကိုင်တွယ်ပါတယ်
* `--experimental-default-config-file` — Config file တင်ခြင်းကို parent က ကိုင်တွယ်ပါတယ်
* `--test-reporter` — Reporting ကို parent process က စီမံပါတယ်
* `--test-reporter-destination` — Output destinations တွေကို parent က ထိန်းချုပ်ပါတယ်
* `--experimental-config-file` — Config file paths တွေကို parent က စီမံပါတယ်
* `--test-randomize` — Randomization ကို parent process က စီမံပြီး child processes တွေဆီကို ဖြန့်ဝေပါတယ်
* `--test-random-seed` — Randomization seed ကို parent process က စီမံပြီး child processes တွေဆီကို ဖြန့်ဝေပါတယ်

Command line arguments, environment variables နဲ့ configuration files တွေကနေ လာတဲ့ — တခြား Node.js options တွေ အားလုံးကိုတော့ child processes တွေက အမွေဆက်ခံပါတယ်။

## Code coverage စုဆောင်းခြင်း (Collecting code coverage)

> Stability: 1 - Experimental

Node.js ကို [`--experimental-test-coverage`][] command-line flag နဲ့ စတင်လိုက်တဲ့အခါ — code coverage ကို စုဆောင်းပြီး — tests တွေ အားလုံး ပြီးဆုံးတာနဲ့ statistics တွေကို အစီရင်ခံပါတယ်။ Code coverage directory တစ်ခုကို သတ်မှတ်ဖို့ [`NODE_V8_COVERAGE`][] environment variable ကို သုံးထားရင် — ထုတ်လုပ်လိုက်တဲ့ V8 coverage files တွေကို အဲဒီ directory ထဲကို ရေးသားပါတယ်။ Node.js core modules တွေနဲ့ `node_modules/` directories တွေအတွင်းက files တွေကို — default အနေနဲ့ — coverage report ထဲမှာ မထည့်သွင်းပါဘူး။ ဒါပေမယ့် ၎င်းတို့ကို [`--test-coverage-include`][] flag ကနေတစ်ဆင့် တိုက်ရိုက် (explicitly) ထည့်သွင်းနိုင်ပါတယ်။ Default အနေနဲ့ ကိုက်ညီတဲ့ test files တွေ အားလုံးကို coverage report ကနေ ဖယ်ထုတ်ထားပါတယ်။ [`--test-coverage-exclude`][] flag ကို သုံးပြီး ဖယ်ထုတ်မှုတွေကို override လုပ်နိုင်ပါတယ်။ Coverage enable လုပ်ထားရင် — coverage report ကို `'test:coverage'` event ကနေတစ်ဆင့် [test reporters][] တွေ မှန်သမျှဆီကို ပို့ပေးပါတယ်။

Coverage ကို အောက်ပါ comment syntax ကို သုံးပြီး line အဆင့်ဆင့်ပေါ်မှာ disable လုပ်နိုင်ပါတယ်:

```js
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // Code in this branch will never be executed, but the lines are ignored for
  // coverage purposes. All lines following the 'disable' comment are ignored
  // until a corresponding 'enable' comment is encountered.
  console.log('this is never executed');
}
/* node:coverage enable */
```

Coverage ကို သတ်မှတ်ထားတဲ့ line အရေအတွက်အတွက်လည်း disable လုပ်နိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ line အရေအတွက် ပြီးသွားရင် coverage ကို အလိုအလျောက် ပြန်လည် enable လုပ်ပါတယ်။ Line အရေအတွက်ကို တိုက်ရိုက် (explicitly) မပေးထားဘူးဆိုရင် line တစ်ကြောင်းတည်းကို လျစ်လျူရှုပါတယ်။

```js
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### Coverage reporter များ (Coverage reporters)

Tap နဲ့ spec reporters တွေက coverage statistics တွေရဲ့ အကျဉ်းချုပ် (summary) တစ်ခုကို ပုံနှိပ်ထုတ်ပေးပါလိမ့်မယ်။ နက်ရှိုင်းတဲ့ (in depth) coverage report တစ်ခုအနေနဲ့ သုံးနိုင်တဲ့ lcov file တစ်ခုကို ထုတ်လုပ်ပေးမယ့် lcov reporter တစ်ခုလည်း ရှိပါတယ်။

```bash
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```

* ဒီ reporter က test ရလဒ်တွေကို ဘာမှ အစီရင်ခံခြင်း မရှိပါဘူး။
* ဒီ reporter ကို တခြား reporter တစ်ခုနဲ့အတူ တွဲသုံးသင့်ပါတယ်။

## Mock ပြုလုပ်ခြင်း (Mocking)

`node:test` module က top-level `mock` object တစ်ခုကနေတစ်ဆင့် testing လုပ်နေစဉ်အတွင်း mocking (အတုအယောင် ပြုလုပ်ခြင်း) ကို ပံ့ပိုးပေးပါတယ်။ အောက်ပါ ဥပမာက ဂဏန်းနှစ်လုံး ပေါင်းပေးတဲ့ function တစ်ခုပေါ်မှာ spy တစ်ခုကို ဖန်တီးပါတယ်။ အဲဒီနောက်မှာ function ကို မျှော်လင့်ထားတဲ့အတိုင်း ခေါ်ယူခဲ့လားဆိုတာကို စစ်ဆေး (assert) ဖို့ spy ကို သုံးပါတယ်။

```mjs
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```

```cjs
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```

အလားတူ mocking လုပ်ဆောင်ချက်တွေကို test တစ်ခုချင်းစီရဲ့ [`TestContext`][] object ပေါ်မှာလည်း ထုတ်ဖော်ထားပါတယ်။ အောက်ပါ ဥပမာက `TestContext` ပေါ်မှာ ထုတ်ဖော်ထားတဲ့ API ကို သုံးပြီး object method တစ်ခုပေါ်မှာ spy တစ်ခုကို ဖန်တီးပါတယ်။ Test context ကနေတစ်ဆင့် mocking လုပ်ခြင်းရဲ့ အကျိုးကျေးဇူးကတော့ — test ပြီးဆုံးသွားတာနဲ့ test runner က mock လုပ်ထားတဲ့ လုပ်ဆောင်ချက်တွေ အားလုံးကို အလိုအလျောက် ပြန်လည် မူလအတိုင်း ထားပေးတာပါ။

```js
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### Timer များ (Timers)

Timers တွေကို mocking လုပ်ခြင်းက — `setInterval` နဲ့ `setTimeout` လိုမျိုး timers တွေရဲ့ အပြုအမူကို — သတ်မှတ်ထားတဲ့ time intervals တွေကို တကယ် စောင့်ဆိုင်းစရာမလိုပဲ — အတုအယောင် ဖန်တီး (simulate) ပြီး ထိန်းချုပ်ဖို့ software testing မှာ အသုံးများတဲ့ နည်းစနစ်တစ်ခုပါ။

Methods နဲ့ features တွေရဲ့ အပြည့်အစုံ စာရင်းအတွက် [`MockTimers`][] class ကို ကြည့်ပါ။

ဒါက developers တွေကို time-dependent (အချိန်ပေါ် မူတည်သော) လုပ်ဆောင်ချက်တွေအတွက် ပိုစိတ်ချရပြီး ကြိုတင်ခန့်မှန်းလို့ရတဲ့ tests တွေကို ရေးသားနိုင်စေပါတယ်။

အောက်ပါ ဥပမာက `setTimeout` ကို ဘယ်လို mock လုပ်သလဲဆိုတာကို ပြပါတယ်။ `.enable({ apis: ['setTimeout'] });` ကို သုံးခြင်းအားဖြင့် — [node:timers](https://nodejs.org/api/timers.html) နဲ့ [node:timers/promises](https://nodejs.org/api/timers.html#timers-promises-api) modules တွေထဲက — Node.js global context ထဲကပါ — `setTimeout` functions တွေကို mock လုပ်ပါလိမ့်မယ်။

**Note:** `import { setTimeout } from 'node:timers'` လိုမျိုး destructuring လုပ်ထားတဲ့ functions တွေကို လက်ရှိမှာ ဒီ API က support မလုပ်သေးပါဘူး။

```mjs
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```

```cjs
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```

အလားတူ mocking လုပ်ဆောင်ချက်တွေကို test တစ်ခုချင်းစီရဲ့ [`TestContext`][] object ပေါ်က mock property ထဲမှာလည်း ထုတ်ဖော်ထားပါတယ်။ Test context ကနေတစ်ဆင့် mocking လုပ်ခြင်းရဲ့ အကျိုးကျေးဇူးကတော့ — test ပြီးဆုံးသွားတာနဲ့ test runner က mock လုပ်ထားတဲ့ timers လုပ်ဆောင်ချက်တွေ အားလုံးကို အလိုအလျောက် ပြန်လည် မူလအတိုင်း ထားပေးတာပါ။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

### Date များ (Dates)

Mock timers API က `Date` object ကိုပါ mocking လုပ်နိုင်စေပါတယ်။ ဒါက time-dependent လုပ်ဆောင်ချက်တွေကို စမ်းသပ်ဖို့ သို့မဟုတ် `Date.now()` လိုမျိုး internal calendar functions တွေကို အတုအယောင် ဖန်တီးဖို့အတွက် အသုံးဝင်တဲ့ feature တစ်ခုပါ။

Dates ရဲ့ implementation ကလည်း [`MockTimers`][] class ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ Methods နဲ့ features တွေရဲ့ အပြည့်အစုံ စာရင်းအတွက် ၎င်းကို ကြည့်ပါ။

**Note:** Dates နဲ့ timers တွေကို အတူတကွ mock လုပ်တဲ့အခါ ၎င်းတို့ဟာ အပြန်အလှန် မှီခိုနေပါတယ်။ ဆိုလိုတာက — `Date` ရော `setTimeout` ပါ နှစ်ခုလုံးကို mock လုပ်ထားရင် — ၎င်းတို့က internal clock တစ်ခုတည်းကို အတုအယောင် ဖန်တီးတာမို့ — အချိန်ကို ရှေ့သို့ ရွှေ့လိုက်တာက mock လုပ်ထားတဲ့ date ကိုပါ ရှေ့သို့ ရွှေ့ပေးပါလိမ့်မယ်။

အောက်ပါ ဥပမာက `Date` object ကို ဘယ်လို mock လုပ်ပြီး — လက်ရှိ `Date.now()` တန်ဖိုးကို ရယူရမလဲဆိုတာ ပြပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

Initial epoch တစ်ခု သတ်မှတ်မထားဘူးဆိုရင် ကနဦး (initial) date က Unix epoch ရဲ့ 0 အပေါ် အခြေခံပါလိမ့်မယ်။ ဒါက January 1st, 1970, 00:00:00 UTC ဖြစ်ပါတယ်။ `.enable()` method ဆီကို `now` property တစ်ခု ဖြတ်သန်းပေးခြင်းအားဖြင့် ကနဦး date တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ ဒီတန်ဖိုးကို mock လုပ်ထားတဲ့ `Date` object အတွက် ကနဦး date အဖြစ် သုံးပါလိမ့်မယ်။ ၎င်းက positive integer တစ်ခု သို့မဟုတ် တခြား Date object တစ်ခု ဖြစ်နိုင်ပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

`.setTime()` method ကို သုံးပြီး mock လုပ်ထားတဲ့ date ကို တခြား အချိန်တစ်ခုဆီကို လက်နဲ့ ကိုယ်တိုင် ရွှေ့ပြောင်းနိုင်ပါတယ်။ ဒီ method က positive integer တစ်ခုကိုသာ လက်ခံပါတယ်။

**Note:** ဒီ method က အချိန်အသစ်ကနေ ကြည့်ရင် အတိတ်မှာ ကျရောက်နေတဲ့ mock timers တွေကို run လုပ်ပေးမှာ **မဟုတ်ပါဘူး**။

အောက်ပါ ဥပမာမှာ mock လုပ်ထားတဲ့ date အတွက် အချိန်အသစ်တစ်ခုကို သတ်မှတ်နေပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

`setTime()` ကို ခေါ်လိုက်တဲ့အခါ — အတိတ်မှာ သတ်မှတ်ထားခဲ့တဲ့ timers တွေက run လုပ်မှာ **မဟုတ်ပါဘူး**။ အဲဒီ timers တွေကို run လုပ်ဖို့အတွက် — အချိန်အသစ်ကနေ ရှေ့သို့ ရွှေ့ဖို့ `.tick()` method ကို သုံးနိုင်ပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('setTime does not execute timers', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is still not executed
  assert.strictEqual(fn.mock.callCount(), 0);
  // Advance in time to execute the timer
  context.mock.timers.tick(0);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime does not execute timers', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is still not executed
  assert.strictEqual(fn.mock.callCount(), 0);
  // Advance in time to execute the timer
  context.mock.timers.tick(0);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

`.runAll()` ကို သုံးလိုက်ရင် လက်ရှိ queue ထဲမှာ ရှိနေတဲ့ timers တွေ အားလုံးကို run လုပ်ပါလိမ့်မယ်။ ဒါက mock လုပ်ထားတဲ့ date ကိုလည်း — အချိန် ဖြတ်သန်းသွားသလိုမျိုး — run လုပ်ခဲ့တဲ့ နောက်ဆုံး timer ရဲ့ အချိန်ဆီကို ရှေ့သို့ ရွှေ့ပေးပါလိမ့်မယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

## Snapshot tests ပြုလုပ်ခြင်း (Snapshot testing)

Snapshot tests တွေက မည်သည့် (arbitrary) values တွေကိုမဆို string values တွေအဖြစ် serialize လုပ်ပြီး — သိထားပြီးသား မှန်ကန်တဲ့ တန်ဖိုးအစုတစ်စုနဲ့ နှိုင်းယှဉ်နိုင်စေပါတယ်။ အဲဒီ သိထားပြီးသား မှန်ကန်တဲ့ တန်ဖိုးတွေကို snapshots လို့ ခေါ်ပြီး — snapshot file တစ်ခုထဲမှာ သိမ်းဆည်းပါတယ်။ Snapshot files တွေကို test runner က စီမံပေမယ့် — debugging ကို အထောက်အကူပြုဖို့အတွက် လူတို့ ဖတ်ရှုနိုင်တဲ့ (human readable) ပုံစံနဲ့ ရေးဆွဲထားပါတယ်။ အကောင်းဆုံး ကျင့်သုံးမှု (best practice) ကတော့ — snapshot files တွေကို သင့် test files တွေနဲ့အတူ source control ထဲမှာ ထည့်သွင်းသိမ်းဆည်းထားဖို့ပါ။

Snapshot files တွေကို Node.js ကို [`--test-update-snapshots`][] command-line flag နဲ့ စတင်ခြင်းအားဖြင့် ထုတ်လုပ်ပါတယ်။ Test file တစ်ခုချင်းစီအတွက် သီးခြား snapshot file တစ်ခုကို ထုတ်လုပ်ပါတယ်။ Default အနေနဲ့ snapshot file က test file ရဲ့ နာမည်အတိုင်း `.snapshot` file extension နဲ့ ဖြစ်ပါတယ်။ ဒီအပြုအမူကို `snapshot.setResolveSnapshotPath()` function ကို သုံးပြီး configure လုပ်နိုင်ပါတယ်။ Snapshot assertion တစ်ခုချင်းစီက snapshot file ထဲက export တစ်ခုနဲ့ ကိုက်ညီပါတယ်။

Snapshot test ဥပမာတစ်ခုကို အောက်မှာ ပြထားပါတယ်။ ဒီ test ကို ပထမဆုံး အကြိမ် run လုပ်တဲ့အခါ — သက်ဆိုင်ရာ snapshot file မရှိသေးတာမို့ — fail ဖြစ်ပါလိမ့်မယ်။

```js
// test.js
suite('suite of snapshot tests', () => {
  test('snapshot test', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```

Test file ကို `--test-update-snapshots` နဲ့ run လုပ်ပြီး snapshot file ကို ထုတ်လုပ်ပါ။ Test က pass ဖြစ်သင့်ပြီး — test file ရှိတဲ့ directory ထဲမှာပဲ `test.js.snapshot` ဆိုတဲ့ file တစ်ခု ဖန်တီးပါလိမ့်မယ်။ Snapshot file ရဲ့ ပါဝင်မှုတွေကို အောက်မှာ ပြထားပါတယ်။ Snapshot တစ်ခုချင်းစီကို test ရဲ့ full name နဲ့ — test တစ်ခုတည်းအတွင်းက snapshots တွေကို ခွဲခြားဖို့ counter တစ်ခုနဲ့ — ခွဲခြားသတ်မှတ်ပါတယ်။

```js
exports[`suite of snapshot tests > snapshot test 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite of snapshot tests > snapshot test 2`] = `
5
`;
```

Snapshot file ဖန်တီးပြီးတာနဲ့ — `--test-update-snapshots` flag မပါပဲ tests တွေကို ပြန်လည် run လုပ်ပါ။ အခုဆိုရင် tests တွေ pass ဖြစ်သင့်ပါတယ်။

## Test reporter များ (Test reporters)

`node:test` module က test runner အတွက် တိကျတဲ့ reporter တစ်ခုကို သုံးဖို့ [`--test-reporter`][] flags တွေကို ဖြတ်သန်းပေးခြင်းကို ပံ့ပိုးပေးပါတယ်။

အောက်ပါ built-in reporters တွေကို ပံ့ပိုးပေးပါတယ်:

* `spec`
  `spec` reporter က test ရလဒ်တွေကို လူတို့ ဖတ်ရှုနိုင်တဲ့ (human-readable) ပုံစံနဲ့ ထုတ်ပေးပါတယ်။ ဒါက default reporter ပါ။

* `tap`
  `tap` reporter က test ရလဒ်တွေကို [TAP][] format နဲ့ ထုတ်ပေးပါတယ်။

* `dot`
  `dot` reporter က test ရလဒ်တွေကို compact (ကျစ်လျစ်သော) ပုံစံနဲ့ ထုတ်ပေးပြီး — pass ဖြစ်တဲ့ test တစ်ခုချင်းစီကို `.` နဲ့ ကိုယ်စားပြုပြီး — fail ဖြစ်တဲ့ test တစ်ခုချင်းစီကို `X` နဲ့ ကိုယ်စားပြုပါတယ်။

* `junit`
  junit reporter က test ရလဒ်တွေကို jUnit XML format နဲ့ ထုတ်ပေးပါတယ်။

* `lcov`
  `lcov` reporter က [`--experimental-test-coverage`][] flag နဲ့ တွဲသုံးတဲ့အခါ test coverage ကို ထုတ်ပေးပါတယ်။

ဒီ reporters တွေရဲ့ တိကျတဲ့ output တွေက Node.js versions အကြားမှာ ပြောင်းလဲနိုင်တာမို့ — programmatically အားကိုးအားထား ပြုလုပ်လို့ မရပါဘူး။ Test runner ရဲ့ output ကို programmatic အနေနဲ့ ဝင်ရောက်သုံးစွဲဖို့ လိုအပ်ရင် — {TestsStream} က emit လုပ်တဲ့ events တွေကို သုံးပါ။

Reporters တွေကို `node:test/reporters` module ကနေတစ်ဆင့် ရရှိနိုင်ပါတယ်:

```mjs
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```cjs
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
### စိတ်ကြိုက် reporters များ (Custom reporters)

Custom reporter တစ်ခုဆီကို ညွှန်တဲ့ path တစ်ခုကို သတ်မှတ်ဖို့ [`--test-reporter`][] ကို သုံးနိုင်ပါတယ်။ Custom reporter ဆိုတာ — [stream.compose][] က လက်ခံနိုင်တဲ့ တန်ဖိုးတစ်ခုကို export လုပ်ပေးတဲ့ module တစ်ခုပါ။ Reporters တွေက {TestsStream} တစ်ခု ထုတ်လွှတ်ပေးတဲ့ events တွေကို transform (ပြောင်းလဲ) လုပ်ပေးသင့်ပါတယ်။

{stream.Transform} ကို သုံးထားတဲ့ custom reporter တစ်ခုရဲ့ ဥပမာ:

```mjs
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:watch:restarted':
        callback(null, 'test watch restarted due to file change');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```cjs
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:watch:restarted':
        callback(null, 'test watch restarted due to file change');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```

Generator function တစ်ခုကို သုံးထားတဲ့ custom reporter တစ်ခုရဲ့ ဥပမာ:

```mjs
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:watch:restarted':
        yield 'test watch restarted due to file change\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```cjs
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:watch:restarted':
        yield 'test watch restarted due to file change\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```

`--test-reporter` ဆီကို ပေးလိုက်တဲ့ တန်ဖိုးက — JavaScript code ထဲက `import()` တစ်ခုမှာ သုံးလေ့ရှိတဲ့ string တစ်ခုလိုမျိုး သို့မဟုတ် [`--import`][] အတွက် ပေးလေ့ရှိတဲ့ တန်ဖိုးမျိုး ဖြစ်သင့်ပါတယ်။

### Reporters အများအပြား (Multiple reporters)

[`--test-reporter`][] flag ကို — test results တွေကို format အမျိုးမျိုးနဲ့ အစီရင်ခံနိုင်ဖို့ — အကြိမ်များစွာ သတ်မှတ်နိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ reporter တစ်ခုချင်းစီအတွက် destination (ဦးတည်ရာ) တစ်ခုကို [`--test-reporter-destination`][] ကို သုံးပြီး သတ်မှတ်ပေးဖို့ လိုအပ်ပါတယ်။ Destination က `stdout`, `stderr` သို့မဟုတ် file path တစ်ခု ဖြစ်နိုင်ပါတယ်။ Reporters နဲ့ destinations တွေကို သတ်မှတ်ခဲ့တဲ့ အစီအစဉ်အတိုင်း တွဲပေးပါတယ်။

အောက်က ဥပမာမှာ — `spec` reporter က `stdout` ဆီကို output လုပ်ပြီး — `dot` reporter က `file.txt` ဆီကို output လုပ်ပါတယ်:

```bash
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```

Reporter တစ်ခုတည်းကိုသာ သတ်မှတ်ထားတဲ့အခါ — destination တစ်ခုကို တိုက်ရိုက် သတ်မှတ်မထားဘူးဆိုရင် — destination က `stdout` ကို default အနေနဲ့ သုံးပါလိမ့်မယ်။

## `run([options])`

* `options` {Object} Tests များ လည်ပတ်ရန်အတွက် configuration options များပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `concurrency` {number|boolean} Number တစ်ခုကို ပေးထားရင် — test file တစ်ခုချင်းစီအတွက် process တစ်ခုနှုန်းနဲ့ — test processes အရေအတွက် အဲဒီလောက်ကို parallel ဖြစ်အောင် run ပါလိမ့်မယ်။ `true` ဆိုရင် — `os.availableParallelism() - 1` ခု test files တွေကို parallel နဲ့ run ပါလိမ့်မယ်။ `false` ဆိုရင် — တစ်ကြိမ်မှာ test file တစ်ခုတည်းကိုသာ run ပါလိမ့်မယ်။ **Default:** `false`.
  * `cwd` {string} Test runner က သုံးမယ့် current working directory ကို သတ်မှတ်ပေးပါတယ်။ အဲဒီ directory ကနေ [running tests from the command line][] လုပ်နေသလိုမျိုး — files တွေကို resolve လုပ်ဖို့ base path အဖြစ် ဆောင်ရွက်ပါတယ်။ **Default:** `process.cwd()`.
  * `files` {Array} Run လုပ်ရမယ့် files တွေရဲ့ စာရင်း ပါဝင်တဲ့ array တစ်ခုပါ။ **Default:** [running tests from the command line][] နဲ့ အတူတူပါ။
  * `forceExit` {boolean} သိထားတဲ့ tests တွေ အားလုံး လုပ်ဆောင်ပြီးသွားတာနဲ့ — event loop က တက်ကြွနေဦးမယ်ဆိုရင်တောင် — process က ထွက်သွားအောင် test runner ကို ပြင်ဆင်ပေးပါတယ်။ **Default:** `false`.
  * `globPatterns` {Array} Test files တွေကို ကိုက်ညီအောင် စစ်ဖို့ glob patterns တွေရဲ့ စာရင်း ပါဝင်တဲ့ array တစ်ခုပါ။ ဒီ option ကို `files` နဲ့အတူတွဲ သုံးလို့ မရပါဘူး။ **Default:** [running tests from the command line][] နဲ့ အတူတူပါ။
  * `inspectPort` {number|Function} Test child process ရဲ့ inspector port ကို သတ်မှတ်ပေးပါတယ်။ ဒါက number တစ်ခု သို့မဟုတ် — arguments တွေ မယူပဲ number တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခု ဖြစ်နိုင်ပါတယ်။ Nullish တန်ဖိုးတစ်ခုကို ပေးထားရင် — process တစ်ခုချင်းစီက primary ရဲ့ `process.debugPort` ကနေ တစ်ခုပြီးတစ်ခု တိုးလာတဲ့ ကိုယ်ပိုင် port တစ်ခုကို ရရှိပါတယ်။ Child processes တွေ spawn လုပ်ခံရမှာ မဟုတ်တာမို့ — `isolation` option ကို `'none'` အဖြစ် သတ်မှတ်ထားရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `undefined`.
  * `isolation` {string} Test isolation ရဲ့ အမျိုးအစားကို ပြင်ဆင်သတ်မှတ်ပေးပါတယ်။ `'process'` လို့ သတ်မှတ်ထားရင် — test file တစ်ခုချင်းစီကို သီးခြား child process တစ်ခုမှာ run ပါတယ်။ `'none'` လို့ သတ်မှတ်ထားရင် — test files တွေ အားလုံးကို လက်ရှိ process ထဲမှာ run ပါတယ်။ **Default:** `'process'`.
  * `only` {boolean} Truthy ဖြစ်နေရင် — test context က `only` option သတ်မှတ်ထားတဲ့ tests တွေကိုသာ run ပါလိမ့်မယ်
  * `setup` {Function} `TestsStream` instance တစ်ခုကို လက်ခံပြီး — tests တွေ မလည်ပတ်ခင် listeners တွေ တပ်ဆင်ဖို့ သုံးနိုင်တဲ့ function တစ်ခုပါ။ **Default:** `undefined`.
  * `execArgv` {Array} Subprocesses တွေကို spawn လုပ်တဲ့အခါ `node` executable ဆီကို ဖြတ်သန်းပေးရမယ့် CLI flags တွေရဲ့ array တစ်ခုပါ။ `isolation` က `'none`' ဖြစ်နေရင် ဒီ option က သက်ရောက်မှု မရှိပါဘူး။ **Default:** `[]`
  * `argv` {Array} Subprocesses တွေကို spawn လုပ်တဲ့အခါ test file တစ်ခုချင်းစီဆီကို ဖြတ်သန်းပေးရမယ့် CLI flags တွေရဲ့ array တစ်ခုပါ။ `isolation` က `'none'` ဖြစ်နေရင် ဒီ option က သက်ရောက်မှု မရှိပါဘူး။ **Default:** `[]`.
  * `signal` {AbortSignal} လုပ်ဆောင်ဆဲ (in-progress) test execution တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။
  * `testNamePatterns` {string|RegExp|Array} ပေးထားတဲ့ pattern နဲ့ ကိုက်ညီတဲ့ နာမည်ရှိတဲ့ tests တွေကိုသာ run ဖို့ သုံးနိုင်တဲ့ String, RegExp သို့မဟုတ် RegExp Array တစ်ခုပါ။ Test name patterns တွေကို JavaScript regular expressions အဖြစ် အနက်ဖွင့်ပါတယ်။ Run လုပ်ခံရတဲ့ test တစ်ခုချင်းစီအတွက် — `beforeEach()` လိုမျိုး — သက်ဆိုင်တဲ့ test hooks တွေကိုလည်း run ပါတယ်။ **Default:** `undefined`.
  * `testSkipPatterns` {string|RegExp|Array} ပေးထားတဲ့ pattern နဲ့ ကိုက်ညီတဲ့ နာမည်ရှိတဲ့ tests တွေကို run လုပ်ခြင်းကနေ ဖယ်ထုတ်ဖို့ သုံးနိုင်တဲ့ String, RegExp သို့မဟုတ် RegExp Array တစ်ခုပါ။ Test name patterns တွေကို JavaScript regular expressions အဖြစ် အနက်ဖွင့်ပါတယ်။ Run လုပ်ခံရတဲ့ test တစ်ခုချင်းစီအတွက် — `beforeEach()` လိုမျိုး — သက်ဆိုင်တဲ့ test hooks တွေကိုလည်း run ပါတယ်။ **Default:** `undefined`.
  * `testTagFilters` {string|string\[]} Tests တွေကို ၎င်းတို့ ကြေညာထားတဲ့ tags တွေနဲ့ filter လုပ်ဖို့ သုံးတဲ့ boolean expression တစ်ခု သို့မဟုတ် boolean expressions တွေရဲ့ array တစ်ခုပါ။ Expressions အများအပြားကို AND နဲ့ ပေါင်းစပ်ပါတယ်။ Command line မှာ [`--experimental-test-tag-filter`][] ကို ဖြတ်သန်းပေးခြင်းနဲ့ ညီမျှပါတယ်။ [Test tags][] ကို ကြည့်ပါ။ **Default:** `undefined`.
  * `timeout` {number} Test execution က အဲဒီအချိန်ပြီးနောက်မှာ fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.
  * `watch` {boolean} Watch mode နဲ့ run မလား မဟုတ်ဘူးလားဆိုတာပါ။ **Default:** `false`.
  * `shard` {Object} သတ်မှတ်ထားတဲ့ shard တစ်ခုထဲမှာ tests တွေကို run လုပ်ခြင်းပါ။ **Default:** `undefined`.
    * `index` {number} Run လုပ်ရမယ့် shard ရဲ့ index ကို သတ်မှတ်ပေးတဲ့ — 1 နဲ့ `<total>` ကြားက positive integer တစ်ခုပါ။ ဒီ option က _required_ (မဖြစ်မနေ လိုအပ်) ပါ။
    * `total` {number} Test files တွေကို ခွဲပေးရမယ့် shards စုစုပေါင်း အရေအတွက်ကို သတ်မှတ်ပေးတဲ့ positive integer တစ်ခုပါ။ ဒီ option က _required_ ပါ။
  * `randomize` {boolean} Test files တွေနဲ့ queue တင်ထားတဲ့ tests တွေအတွက် execution order ကို ကျပန်း (randomize) လုပ်ပါတယ်။ ဒီ option ကို `watch: true` နဲ့တော့ ပံ့ပိုးမထားပါဘူး။ **Default:** `false`.
  * `randomSeed` {number} Execution order ကို ကျပန်းလုပ်တဲ့အခါ သုံးတဲ့ seed ပါ။ ဒီ option ကို သတ်မှတ်ထားရင် — runs တွေက ကျပန်းလုပ်ထားတဲ့ order အတိုင်း တူညီတဲ့ order ကို deterministically (သေချာပေါက်) ပြန်လည် ထုတ်လုပ်နိုင်ပြီး — ဒီ option ကို သတ်မှတ်လိုက်တာက randomization ကိုပါ ဖွင့်ပေးပါတယ်။ တန်ဖိုးက `0` နဲ့ `4294967295` ကြားက integer တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `undefined`.
  * `rerunFailuresFilePath` {string} Test runner က tests တွေရဲ့ state ကို သိမ်းဆည်းပေးမယ့် file path တစ်ခုပါ — နောက် run တစ်ခုမှာ fail ဖြစ်ခဲ့တဲ့ tests တွေကိုသာ ပြန်လည် run နိုင်ဖို့ အတွက်ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် see \[Rerunning failed tests]\[] ကို ကြည့်ပါ။ **Default:** `undefined`.
  * `coverage` {boolean} [code coverage][] collection ကို ဖွင့်ပေးပါတယ်။ **Default:** `false`.
  * `coverageExcludeGlobs` {string|Array} Code coverage ကနေ သီးခြား files တွေကို — absolute ရော relative file paths တွေကိုပါ ကိုက်ညီနိုင်တဲ့ — glob pattern တစ်ခုကို သုံးပြီး ဖယ်ထုတ်ပေးပါတယ်။ ဒီ property က `coverage` ကို `true` အဖြစ် သတ်မှတ်ထားမှသာ အသုံးပြုနိုင်ပါတယ်။ `coverageExcludeGlobs` ရော `coverageIncludeGlobs` ပါ ပေးထားရင် — coverage report ထဲမှာ ပါဝင်ဖို့ files တွေက စံနှုန်း _နှစ်ခုလုံး_ (both) ကို ပြည့်မီရပါမယ်။ **Default:** `undefined`.
  * `coverageIncludeGlobs` {string|Array} Code coverage ထဲမှာ သီးခြား files တွေကို — absolute ရော relative file paths တွေကိုပါ ကိုက်ညီနိုင်တဲ့ — glob pattern တစ်ခုကို သုံးပြီး ထည့်သွင်းပေးပါတယ်။ ဒီ property က `coverage` ကို `true` အဖြစ် သတ်မှတ်ထားမှသာ အသုံးပြုနိုင်ပါတယ်။ `coverageExcludeGlobs` ရော `coverageIncludeGlobs` ပါ ပေးထားရင် — coverage report ထဲမှာ ပါဝင်ဖို့ files တွေက စံနှုန်း _နှစ်ခုလုံး_ (both) ကို ပြည့်မီရပါမယ်။ **Default:** `undefined`.
  * `coverageIncludeAll` {boolean} Test run က ဘယ်တော့မှ load မလုပ်ခဲ့တဲ့ source files တွေကို — zero coverage ရှိတယ်လို့ အစီရင်ခံခံရတဲ့အနေနဲ့ — coverage report ထဲမှာ ထည့်သွင်းပေးပါတယ်။ ကိုယ်စားလှယ် (candidate) files တွေကို `cwd` ထဲမှာ ရှာဖွေပြီး — report ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေလိုပဲ — `coverageIncludeGlobs` နဲ့ `coverageExcludeGlobs` filtering တွေရဲ့ လက်အောက်ခံ ဖြစ်ပါတယ်။ ဒီ property က `coverage` ကို `true` အဖြစ် သတ်မှတ်ထားမှသာ အသုံးပြုနိုင်ပါတယ်။ **Default:** `false`.
  * `lineCoverage` {number} Covered ဖြစ်တဲ့ lines တွေရဲ့ အနည်းဆုံး ရာခိုင်နှုန်းတစ်ခုကို လိုအပ်ပါတယ်။ Code coverage က သတ်မှတ်ထားတဲ့ threshold ကို မရောက်ရှိခဲ့ရင် — process က exit code `1` နဲ့ ထွက်သွားပါလိမ့်မယ်။ **Default:** `0`.
  * `branchCoverage` {number} Covered ဖြစ်တဲ့ branches တွေရဲ့ အနည်းဆုံး ရာခိုင်နှုန်းတစ်ခုကို လိုအပ်ပါတယ်။ Code coverage က သတ်မှတ်ထားတဲ့ threshold ကို မရောက်ရှိခဲ့ရင် — process က exit code `1` နဲ့ ထွက်သွားပါလိမ့်မယ်။ **Default:** `0`.
  * `functionCoverage` {number} Covered ဖြစ်တဲ့ functions တွေရဲ့ အနည်းဆုံး ရာခိုင်နှုန်းတစ်ခုကို လိုအပ်ပါတယ်။ Code coverage က သတ်မှတ်ထားတဲ့ threshold ကို မရောက်ရှိခဲ့ရင် — process က exit code `1` နဲ့ ထွက်သွားပါလိမ့်မယ်။ **Default:** `0`.
  * `env` {Object} Test process ဆီကို ဖြတ်သန်းပေးရမယ့် environment variables တွေကို သတ်မှတ်ပေးပါတယ်။ ဒီ option က `isolation='none'` နဲ့တော့ လိုက်ဖက်မှု မရှိပါဘူး။ ဒီ variables တွေက main process ထဲက variables တွေကို override လုပ်ပြီး — `process.env` နဲ့တော့ ပေါင်းစပ်လို့ မရပါဘူး။ **Default:** `process.env`.
* Returns: {TestsStream}

**Note:** `shard` ကို machines သို့မဟုတ် processes တွေကြားမှာ test running တွေကို horizontally parallelize (အလျားလိုက် မျဉ်းပြိုင် လုပ်ဆောင်) လုပ်ဖို့ သုံးပြီး — environment အမျိုးမျိုးမှာ လုပ်ဆောင်ရတဲ့ ကြီးမားသော executions တွေအတွက် သင့်လျော်ပါတယ်။ ၎င်းက `watch` mode နဲ့တော့ လိုက်ဖက်မှု မရှိပါဘူး — အဲဒီ mode က file တွေ ပြောင်းလဲတာနဲ့ tests တွေကို အလိုအလျောက် ပြန်လည် run ခြင်းအားဖြင့် လျင်မြန်တဲ့ code iteration တွေအတွက် သီးသန့် ချိန်ညှိထားတာပါ။

```mjs
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```cjs
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

## `suite([name][, options][, fn])`

* `name` {string} Suite ရဲ့ နာမည်ပါ — test results တွေကို အစီရင်ခံတဲ့အခါ ပြသပေးပါတယ်။ **Default:** `fn` ရဲ့ `name` property ဖြစ်ပြီး — `fn` မှာ နာမည် မရှိဘူးဆိုရင် `'<anonymous>'` ပါ။
* `options` {Object} Suite အတွက် optional configuration options တွေပါ။ ဒါက `test([name][, options][, fn])` နဲ့ အတူတူ options တွေကို ပံ့ပိုးပေးပါတယ်။
* `fn` {Function|AsyncFunction} Nested tests နဲ့ suites တွေကို ကြေညာပေးတဲ့ suite function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`SuiteContext`][] object တစ်ခုပါ။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* Returns: {Promise} `undefined` နဲ့ ချက်ချင်း fulfilled ဖြစ်ပါတယ်။

`suite()` function ကို `node:test` module ကနေ import လုပ်ပါတယ်။

## `suite.skip([name][, options][, fn])`

Suite တစ်ခုကို ကျော်လိုက်ခြင်းအတွက် shorthand (အတိုကောက် နည်းလမ်း) တစ်ခုပါ။ ဒါက [`suite([name], { skip: true }[, fn])`][suite options] နဲ့ အတူတူပါ။

## `suite.todo([name][, options][, fn])`

Suite တစ်ခုကို `TODO` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ။ ဒါက [`suite([name], { todo: true }[, fn])`][suite options] နဲ့ အတူတူပါ။

## `suite.only([name][, options][, fn])`

Suite တစ်ခုကို `only` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ။ ဒါက [`suite([name], { only: true }[, fn])`][suite options] နဲ့ အတူတူပါ။

## `test([name][, options][, fn])`

* `name` {string} Test ရဲ့ နာမည်ပါ — test results တွေကို အစီရင်ခံတဲ့အခါ ပြသပေးပါတယ်။ **Default:** `fn` ရဲ့ `name` property ဖြစ်ပြီး — `fn` မှာ နာမည် မရှိဘူးဆိုရင် `'<anonymous>'` ပါ။
* `options` {Object} Test အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `concurrency` {number|boolean} Number တစ်ခုကို ပေးထားရင် — tests အရေအတွက် အဲဒီလောက်ကို asynchronously run ပါလိမ့်မယ် (၎င်းတို့ကို single-threaded event loop က စီမံထားဆဲ ဖြစ်ပါတယ်)။ `true` ဆိုရင် — schedule လုပ်ထားတဲ့ asynchronous tests တွေ အားလုံးက thread အတွင်းမှာ တစ်ပြိုင်နက် run ပါတယ်။ `false` ဆိုရင် — တစ်ကြိမ်မှာ test တစ်ခုတည်းသာ run ပါတယ်။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `false`.
  * `expectFailure` {boolean|string|RegExp|Function|Object|Error} Truthy ဆိုရင် — test က fail ဖြစ်ဖို့ မျှော်လင့်ထားပါတယ်။ ဗလာမဟုတ်တဲ့ string တစ်ခုကို ပေးထားရင် — အဲဒီ string ကို test ဘာကြောင့် fail ဖြစ်ဖို့ မျှော်လင့်ထားလဲဆိုတဲ့ အကြောင်းရင်းအဖြစ် test results တွေမှာ ပြသပါတယ်။ {RegExp|Function|Object|Error} တစ်ခုကို (`{ match: … }` နဲ့ မထုပ်ပဲ) တိုက်ရိုက် ပေးထားရင် — throw လုပ်လိုက်တဲ့ error က [`assert.throws`][] ရဲ့ အပြုအမူအတိုင်း ကိုက်ညီမှသာ test က pass ဖြစ်ပါတယ်။ အကြောင်းရင်းရော validation ပါ နှစ်ခုလုံး ပေးချင်ရင် — `label` (string) နဲ့ `match` (RegExp, Function, Object သို့မဟုတ် Error) ပါဝင်တဲ့ object တစ်ခုကို ဖြတ်သန်းပေးပါ။ **Default:** `false`.
  * `only` {boolean} Truthy ဖြစ်ပြီး — test context က `only` tests တွေကို run ဖို့ ပြင်ဆင်သတ်မှတ်ထားရင် — ဒီ test ကို run ပါလိမ့်မယ်။ မဟုတ်ရင်တော့ test ကို ကျော်လိုက်ပါတယ်။ **Default:** `false`.
  * `signal` {AbortSignal} လုပ်ဆောင်ဆဲ (in-progress) test တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။
  * `skip` {boolean|string} Truthy ဆိုရင် — test ကို ကျော်လိုက်ပါတယ်။ String တစ်ခုကို ပေးထားရင် — အဲဒီ string ကို test ကို ကျော်လိုက်တဲ့ အကြောင်းရင်းအဖြစ် test results တွေမှာ ပြသပါတယ်။ **Default:** `false`.
  * `tags` {string\[]} Test နဲ့ ဆက်စပ်ထားတဲ့ string labels တွေရဲ့ array တစ်ခုပါ။ ဘယ် tests တွေ run မယ်ဆိုတာ filter လုပ်ဖို့ [`--experimental-test-tag-filter`][] နဲ့အတူ သုံးပါတယ်။ Tags တွေက suites တွေကနေ nested tests တွေဆီကို union အားဖြင့် အမွေဆက်ခံပါတယ်။ [Test tags][] ကို ကြည့်ပါ။ **Default:** `[]`.
  * `todo` {boolean|string} Truthy ဆိုရင် — test ကို `TODO` အဖြစ် မှတ်သားပါတယ်။ String တစ်ခုကို ပေးထားရင် — အဲဒီ string ကို test ဘာကြောင့် `TODO` ဖြစ်လဲဆိုတဲ့ အကြောင်းရင်းအဖြစ် test results တွေမှာ ပြသပါတယ်။ **Default:** `false`.
  * `timeout` {number} Test က အဲဒီအချိန်ပြီးနောက်မှာ fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.
  * `plan` {number} Test ထဲမှာ run လုပ်ဖို့ မျှော်လင့်ထားတဲ့ assertions နဲ့ subtests အရေအတွက်ပါ။ Test ထဲမှာ run လုပ်ခဲ့တဲ့ assertions အရေအတွက်က plan ထဲမှာ သတ်မှတ်ထားတဲ့ အရေအတွက်နဲ့ မကိုက်ညီဘူးဆိုရင် — test က fail ဖြစ်ပါလိမ့်မယ်။ **Default:** `undefined`.
  * `fn` {Function|AsyncFunction} Test လုပ်ခံနေရတဲ့ function ပါ။ ပေးထားရင် — ၎င်းက `fn` parameter ထက် ဦးစားပေး ယူပါလိမ့်မယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။ ပေးထားရင် — ၎င်းက `name` parameter ထက် ဦးစားပေး ယူပါလိမ့်မယ်။
* `fn` {Function|AsyncFunction} Test လုပ်ခံနေရတဲ့ function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`TestContext`][] object တစ်ခုပါ။ Test က callbacks တွေ သုံးမယ်ဆိုရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* Returns: {Promise} Test ပြီးဆုံးသွားတာနဲ့ `undefined` နဲ့ fulfilled ဖြစ်ပြီး — test က suite တစ်ခုအတွင်းမှာ run ဖြစ်နေရင်တော့ ချက်ချင်း fulfilled ဖြစ်ပါတယ်။

`test()` function က `test` module ကနေ import လုပ်လိုက်တဲ့ တန်ဖိုးပါ။ ဒီ function ကို ခေါ်လိုက်တိုင်း — test ကို {TestsStream} ဆီကို အစီရင်ခံခြင်း ဖြစ်ပေါ်ပါတယ်။

`fn` argument ဆီကို ဖြတ်သန်းပေးတဲ့ `TestContext` object ကို လက်ရှိ test နဲ့ ဆက်စပ်တဲ့ လုပ်ဆောင်မှုတွေ လုပ်ဆောင်ဖို့ သုံးနိုင်ပါတယ်။ ဥပမာတွေကတော့ — test ကို ကျော်လိုက်ခြင်း၊ diagnostic အချက်အလက် ထပ်ဆောင်း ထည့်သွင်းခြင်း သို့မဟုတ် subtests တွေ ဖန်တီးခြင်း တို့ပါ။

`test()` က — test ပြီးဆုံးသွားတာနဲ့ fulfill ဖြစ်တဲ့ — `Promise` တစ်ခုကို ပြန်ပေးပါတယ်။ `test()` ကို suite တစ်ခုအတွင်းမှာ ခေါ်ရင် — ချက်ချင်း fulfill ဖြစ်ပါတယ်။ Top level tests တွေအတွက်ဆိုရင် ပြန်ပေးလိုက်တဲ့ တန်ဖိုးကို ပုံမှန်အားဖြင့် လွှင့်ပစ်လို့ ရပါတယ်။ ဒါပေမယ့် — subtests တွေကနေ ပြန်လာတဲ့ တန်ဖိုးကတော့ — parent test က ဦးဆုံး ပြီးဆုံးပြီး subtest ကို cancel လုပ်မိမှာ မဖြစ်အောင် — အောက်က ဥပမာမှာ ပြထားသလို — သုံးစွဲသင့်ပါတယ်။

```js
test('top level test', async (t) => {
  // The setTimeout() in the following subtest would cause it to outlive its
  // parent test if 'await' is removed on the next line. Once the parent test
  // completes, it will cancel any outstanding subtests.
  await t.test('longer running subtest', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```

`timeout` option ကို — test တစ်ခုက ပြီးဆုံးဖို့ `timeout` milliseconds ထက် ပိုကြာနေရင် — test ကို fail ဖြစ်စေဖို့ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — လည်ပတ်နေတဲ့ test တစ်ခုက application thread ကို block လုပ်ပြီး — စီစဉ်ထားတဲ့ cancellation ကို တားဆီးနိုင်တာမို့ — tests တွေကို cancel လုပ်ဖို့အတွက်တော့ ဒါက ယုံကြည်စိတ်ချရတဲ့ ယန္တရားတစ်ခု မဟုတ်ပါဘူး။

## `test.skip([name][, options][, fn])`

Test တစ်ခုကို ကျော်လိုက်ခြင်းအတွက် shorthand တစ်ခုပါ — [`test([name], { skip: true }[, fn])`][it options] နဲ့ အတူတူပါ။

## `test.todo([name][, options][, fn])`

Test တစ်ခုကို `TODO` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ — [`test([name], { todo: true }[, fn])`][it options] နဲ့ အတူတူပါ။

## `test.only([name][, options][, fn])`

Test တစ်ခုကို `only` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ — [`test([name], { only: true }[, fn])`][it options] နဲ့ အတူတူပါ။

## `describe([name][, options][, fn])`

[`suite()`][] အတွက် alias (အစားထိုး နာမည်) တစ်ခုပါ။

`describe()` function ကို `node:test` module ကနေ import လုပ်ပါတယ်။

## `describe.skip([name][, options][, fn])`

Suite တစ်ခုကို ကျော်လိုက်ခြင်းအတွက် shorthand တစ်ခုပါ။ ဒါက [`describe([name], { skip: true }[, fn])`][describe options] နဲ့ အတူတူပါ။

## `describe.todo([name][, options][, fn])`

Suite တစ်ခုကို `TODO` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ။ ဒါက [`describe([name], { todo: true }[, fn])`][describe options] နဲ့ အတူတူပါ။

## `describe.only([name][, options][, fn])`

Suite တစ်ခုကို `only` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ။ ဒါက [`describe([name], { only: true }[, fn])`][describe options] နဲ့ အတူတူပါ။

## `it([name][, options][, fn])`

[`test()`][] အတွက် alias တစ်ခုပါ။

`it()` function ကို `node:test` module ကနေ import လုပ်ပါတယ်။

## `it.skip([name][, options][, fn])`

Test တစ်ခုကို ကျော်လိုက်ခြင်းအတွက် shorthand တစ်ခုပါ — [`it([name], { skip: true }[, fn])`][it options] နဲ့ အတူတူပါ။

## `it.todo([name][, options][, fn])`

Test တစ်ခုကို `TODO` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ — [`it([name], { todo: true }[, fn])`][it options] နဲ့ အတူတူပါ။

## `it.only([name][, options][, fn])`

Test တစ်ခုကို `only` အဖြစ် မှတ်သားခြင်းအတွက် shorthand တစ်ခုပါ — [`it([name], { only: true }[, fn])`][it options] နဲ့ အတူတူပါ။

## `before([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ Hook က callbacks တွေ သုံးမယ်ဆိုရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်ဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။
  * `timeout` {number} Hook က အဲဒီအချိန်ပြီးနောက်မှာ fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က suite တစ်ခုကို မလည်ပတ်ခင် run မယ့် hook တစ်ခုကို ဖန်တီးပေးပါတယ်။

```js
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    // Some relevant assertions here
  });
});
```

## `after([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ Hook က callbacks တွေ သုံးမယ်ဆိုရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်ဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။
  * `timeout` {number} Hook က အဲဒီအချိန်ပြီးနောက်မှာ fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က suite တစ်ခုကို လည်ပတ်ပြီးနောက်မှာ run မယ့် hook တစ်ခုကို ဖန်တီးပေးပါတယ်။

```js
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    // Some relevant assertion here
  });
});
```

**Note:** `after` hook က suite အတွင်းက tests တွေ fail ဖြစ်ရင်တောင် — လည်ပတ်ဖို့ အာမခံထားပါတယ်။

## `beforeEach([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ Hook က callbacks တွေ သုံးမယ်ဆိုရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်ဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။
  * `timeout` {number} Hook က အဲဒီအချိန်ပြီးနောက်မှာ fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က လက်ရှိ suite ထဲက test တစ်ခုချင်းစီ မလည်ပတ်ခင် run မယ့် hook တစ်ခုကို ဖန်တီးပေးပါတယ်။

```js
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    // Some relevant assertion here
  });
});
```

## `afterEach([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ Hook က callbacks တွေ သုံးမယ်ဆိုရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်ဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။
  * `timeout` {number} Hook က အဲဒီအချိန်ပြီးနောက်မှာ fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားဘူးဆိုရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က လက်ရှိ suite ထဲက test တစ်ခုချင်းစီ လည်ပတ်ပြီးနောက်မှာ run မယ့် hook တစ်ခုကို ဖန်တီးပေးပါတယ်။ Test က fail ဖြစ်ရင်တောင် `afterEach()` hook ကို run ပါတယ်။

```js
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    // Some relevant assertion here
  });
});
```

## `assert`

Method တွေကို လက်ရှိ process ထဲက `TestContext` objects တွေပေါ်မှာ ရရှိနိုင်တဲ့ assertions တွေကို ပြင်ဆင်သတ်မှတ်ဖို့ သုံးတဲ့ object တစ်ခုပါ။ `node:assert` ကနေ လာတဲ့ methods တွေနဲ့ snapshot testing functions တွေကို default အနေနဲ့ ရရှိနိုင်ပါတယ်။

Files တွေ အားလုံးကို တူညီတဲ့ configuration တစ်ခုတည်း အသုံးချစေချင်ရင် — `--require` သို့မဟုတ် `--import` နဲ့ preload လုပ်ထားတဲ့ module တစ်ခုထဲမှာ ဘုံ configuration code တွေကို ထားရှိခြင်းအားဖြင့် ဖြစ်နိုင်ပါတယ်။

### `assert.register(name, fn)`

ပေးထားတဲ့ နာမည်နဲ့ function နဲ့အတူ assertion function အသစ်တစ်ခုကို define လုပ်ပါတယ်။ နာမည်တူ ရှိပြီးသား assertion တစ်ခု ရှိနေရင် — ၎င်းကို overwrite (အစားထိုး) လုပ်ပါတယ်။

## `snapshot`

Method တွေကို လက်ရှိ process ထဲက default snapshot settings တွေကို ပြင်ဆင်သတ်မှတ်ဖို့ သုံးတဲ့ object တစ်ခုပါ။ Files တွေ အားလုံးကို တူညီတဲ့ configuration တစ်ခုတည်း အသုံးချစေချင်ရင် — `--require` သို့မဟုတ် `--import` နဲ့ preload လုပ်ထားတဲ့ module တစ်ခုထဲမှာ ဘုံ configuration code တွေကို ထားရှိခြင်းအားဖြင့် ဖြစ်နိုင်ပါတယ်။

### `snapshot.setDefaultSnapshotSerializers(serializers)`

* `serializers` {Array} Snapshot tests တွေအတွက် default serializers အဖြစ် သုံးတဲ့ synchronous functions တွေရဲ့ array တစ်ခုပါ။

ဒီ function ကို test runner က သုံးတဲ့ default serialization ယန္တရားကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ သုံးပါတယ်။ Default အနေနဲ့ — test runner က ပေးထားတဲ့ တန်ဖိုးပေါ်မှာ `JSON.stringify(value, null, 2)` ကို ခေါ်ပြီး serialization လုပ်ပါတယ်။ `JSON.stringify()` မှာ circular structures တွေနဲ့ ပံ့ပိုးထားတဲ့ data types တွေနဲ့ ပတ်သက်ပြီး ကန့်သတ်ချက်တွေ ရှိပါတယ်။ ပိုခိုင်မာတဲ့ serialization ယန္တရားတစ်ခု လိုအပ်ရင် — ဒီ function ကို သုံးသင့်ပါတယ်။

### `snapshot.setResolveSnapshotPath(fn)`

* `fn` {Function} Snapshot file ရဲ့ တည်နေရာကို တွက်ချက်ဖို့ သုံးတဲ့ function တစ်ခုပါ။ ဒီ function က test file ရဲ့ path ကို ၎င်းရဲ့ argument တစ်ခုတည်းအဖြစ် လက်ခံပါတယ်။ Test က file တစ်ခုနဲ့ ဆက်စပ်မနေဘူးဆိုရင် (ဥပမာ — REPL ထဲမှာ) — input က undefined ဖြစ်ပါတယ်။ `fn()` က snapshot file ရဲ့ တည်နေရာကို သတ်မှတ်ပေးတဲ့ string တစ်ခုကို ပြန်ပေးရပါမယ်။

ဒီ function ကို snapshot testing အတွက် သုံးတဲ့ snapshot file ရဲ့ တည်နေရာကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ သုံးပါတယ်။ Default အနေနဲ့ — snapshot filename က `.snapshot` file extension တစ်ခုနဲ့အတူ entry point filename နဲ့ အတူတူပါ။

## Class: `MockFunctionContext`

`MockFunctionContext` class ကို [`MockTracker`][] APIs တွေကနေတစ်ဆင့် ဖန်တီးထားတဲ့ mocks တွေရဲ့ အပြုအမူကို စစ်ဆေး (inspect) ဖို့ သို့မဟုတ် ကိုင်တွယ် (manipulate) ဖို့ သုံးပါတယ်။

### `ctx.calls`

* Type: {Array}

Mock ဆီကို ခေါ်ယူမှုတွေ (calls) ကို ခြေရာခံဖို့ သုံးတဲ့ internal array ရဲ့ copy တစ်ခုကို ပြန်ပေးတဲ့ getter တစ်ခုပါ။ Array ထဲက entry တစ်ခုချင်းစီက အောက်ပါ properties တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

* `arguments` {Array} Mock function ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ arguments တွေရဲ့ array တစ်ခုပါ။
* `error` {any} Mocked function က throw လုပ်ခဲ့ရင် — ဒီ property ထဲမှာ throw လုပ်လိုက်တဲ့ တန်ဖိုး ပါဝင်ပါတယ်။ **Default:** `undefined`.
* `result` {any} Mocked function က ပြန်ပေးလိုက်တဲ့ တန်ဖိုးပါ။
* `stack` {Error} `Error` object တစ်ခုပါ — ၎င်းရဲ့ stack ကို mocked function invocation ရဲ့ callsite (ခေါ်ယူခဲ့သည့် နေရာ) ကို ဆုံးဖြတ်ဖို့ သုံးနိုင်ပါတယ်။
* `target` {Function|undefined} Mocked function က constructor တစ်ခုဆိုရင် — ဒီ field ထဲမှာ ဆောက်လုပ်ခံနေရတဲ့ class ပါဝင်ပါတယ်။ မဟုတ်ရင်တော့ — `undefined` ဖြစ်ပါလိမ့်မယ်။
* `this` {any} Mocked function ရဲ့ `this` တန်ဖိုးပါ။

### `ctx.callCount()`

* Returns: {integer} ဒီ mock ကို ခေါ်ယူခဲ့တဲ့ အကြိမ်အရေအတွက်ပါ။

ဒီ function က ဒီ mock ကို ခေါ်ယူခဲ့တဲ့ အကြိမ်အရေအတွက်ကို ပြန်ပေးပါတယ်။ `ctx.calls` က internal call tracking array ရဲ့ copy တစ်ခုကို ဖန်တီးပေးတဲ့ getter တစ်ခုမို့ — `ctx.calls.length` ကို စစ်ဆေးတာထက် ဒီ function က ပိုပြီး ထိရောက် (efficient) ပါတယ်။

### `ctx.mockImplementation(implementation)`

* `implementation` {Function|AsyncFunction} Mock ရဲ့ implementation အသစ်အဖြစ် သုံးရမယ့် function ပါ။

ဒီ function ကို ရှိပြီးသား mock တစ်ခုရဲ့ အပြုအမူကို ပြောင်းလဲဖို့ သုံးပါတယ်။

အောက်က ဥပမာက `t.mock.fn()` ကို သုံးပြီး mock function တစ်ခုကို ဖန်တီးကာ — mock function ကို ခေါ်ပြီး — mock implementation ကို တခြား function တစ်ခုဆီကို ပြောင်းလဲပေးပါတယ်။

```js
test('changes a mock behavior', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```

### `ctx.mockImplementationOnce(implementation[, onCall])`

* `implementation` {Function|AsyncFunction} `onCall` က သတ်မှတ်ပေးတဲ့ invocation number အတွက် mock ရဲ့ implementation အဖြစ် သုံးရမယ့် function ပါ။
* `onCall` {integer} `implementation` ကို သုံးမယ့် invocation number ပါ။ သတ်မှတ်ထားတဲ့ invocation က ဖြစ်ပွားပြီးသား ဖြစ်နေရင် — exception တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** နောက်ထပ် invocation ရဲ့ နံပါတ်ပါ။

ဒီ function ကို ရှိပြီးသား mock တစ်ခုရဲ့ အပြုအမူကို invocation တစ်ခုတည်းအတွက် ပြောင်းလဲဖို့ သုံးပါတယ်။ Invocation `onCall` ဖြစ်ပွားသွားတာနဲ့ — `mockImplementationOnce()` ကို မခေါ်ခဲ့ဘူးဆိုရင် mock က သုံးစွဲမိမယ့် အပြုအမူဆီကို ပြန်လည် ရောက်ရှိသွားပါတယ်။

အောက်က ဥပမာက `t.mock.fn()` ကို သုံးပြီး mock function တစ်ခုကို ဖန်တီးကာ — mock function ကို ခေါ်ပြီး — နောက် invocation အတွက် mock implementation ကို တခြား function တစ်ခုဆီကို ပြောင်းလဲပြီး — ၎င်းရဲ့ ယခင် အပြုအမူကို ပြန်လည် စတင်ပါတယ်။

```js
test('changes a mock behavior once', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```

### `ctx.resetCalls()`

Mock function ရဲ့ call history (ခေါ်ယူမှု မှတ်တမ်း) ကို ပြန်လည် သတ်မှတ် (reset) ပေးပါတယ်။

### `ctx.restore()`

Mock function ရဲ့ implementation ကို ၎င်းရဲ့ မူရင်း အပြုအမူဆီကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။ ဒီ function ကို ခေါ်ပြီးနောက်မှာလည်း mock ကို ဆက်လက် သုံးနိုင်ပါသေးတယ်။

## Class: `MockModuleContext`

> Stability: 1.0 - Early development

`MockModuleContext` class ကို [`MockTracker`][] APIs တွေကနေတစ်ဆင့် ဖန်တီးထားတဲ့ module mocks တွေရဲ့ အပြုအမူကို ကိုင်တွယ်ဖို့ သုံးပါတယ်။

### `ctx.restore()`

Mock module ရဲ့ implementation ကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။

## Class: `MockPropertyContext`

`MockPropertyContext` class ကို [`MockTracker`][] APIs တွေကနေတစ်ဆင့် ဖန်တီးထားတဲ့ property mocks တွေရဲ့ အပြုအမူကို စစ်ဆေးဖို့ သို့မဟုတ် ကိုင်တွယ်ဖို့ သုံးပါတယ်။

### `ctx.accesses`

* Type: {Array}

Mocked property ဆီကို ဝင်ရောက်မှုတွေ (get/set) ကို ခြေရာခံဖို့ သုံးတဲ့ internal array ရဲ့ copy တစ်ခုကို ပြန်ပေးတဲ့ getter တစ်ခုပါ။ Array ထဲက entry တစ်ခုချင်းစီက အောက်ပါ properties တွေ ပါဝင်တဲ့ object တစ်ခုပါ:

* `type` {string} `'get'` သို့မဟုတ် `'set'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပြီး — ဝင်ရောက်မှုရဲ့ အမျိုးအစားကို ဖော်ပြပါတယ်။
* `value` {any} ဖတ်လိုက်တဲ့ (`'get'` အတွက်) သို့မဟုတ် ရေးလိုက်တဲ့ (`'set'` အတွက်) တန်ဖိုးပါ။
* `stack` {Error} `Error` object တစ်ခုပါ — ၎င်းရဲ့ stack ကို mocked function invocation ရဲ့ callsite ကို ဆုံးဖြတ်ဖို့ သုံးနိုင်ပါတယ်။

### `ctx.accessCount()`

* Returns: {integer} Property ကို ဝင်ရောက်ခဲ့တဲ့ (ဖတ်ခဲ့သည် သို့မဟုတ် ရေးခဲ့သည်) အကြိမ်အရေအတွက်ပါ။

ဒီ function က property ကို ဝင်ရောက်ခဲ့တဲ့ အကြိမ်အရေအတွက်ကို ပြန်ပေးပါတယ်။ `ctx.accesses` က internal access tracking array ရဲ့ copy တစ်ခုကို ဖန်တီးပေးတဲ့ getter တစ်ခုမို့ — `ctx.accesses.length` ကို စစ်ဆေးတာထက် ဒီ function က ပိုပြီး ထိရောက်ပါတယ်။

### `ctx.mockImplementation(value)`

* `value` {any} Mocked property value အဖြစ် သတ်မှတ်ပေးမယ့် တန်ဖိုးအသစ်ပါ။

ဒီ function ကို mocked property getter က ပြန်ပေးတဲ့ တန်ဖိုးကို ပြောင်းလဲဖို့ သုံးပါတယ်။

### `ctx.mockImplementationOnce(value[, onAccess])`

* `value` {any} `onAccess` က သတ်မှတ်ပေးတဲ့ invocation number အတွက် mock ရဲ့ implementation အဖြစ် သုံးရမယ့် တန်ဖိုးပါ။
* `onAccess` {integer} `value` ကို သုံးမယ့် invocation number ပါ။ သတ်မှတ်ထားတဲ့ invocation က ဖြစ်ပွားပြီးသား ဖြစ်နေရင် — exception တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** နောက်ထပ် invocation ရဲ့ နံပါတ်ပါ။

ဒီ function ကို ရှိပြီးသား mock တစ်ခုရဲ့ အပြုအမူကို invocation တစ်ခုတည်းအတွက် ပြောင်းလဲဖို့ သုံးပါတယ်။ Invocation `onAccess` ဖြစ်ပွားသွားတာနဲ့ — `mockImplementationOnce()` ကို မခေါ်ခဲ့ဘူးဆိုရင် mock က သုံးစွဲမိမယ့် အပြုအမူဆီကို ပြန်လည် ရောက်ရှိသွားပါတယ်။

အောက်က ဥပမာက `t.mock.property()` ကို သုံးပြီး mock function တစ်ခုကို ဖန်တီးကာ — mock property ကို ခေါ်ပြီး — နောက် invocation အတွက် mock implementation ကို တခြား တန်ဖိုးတစ်ခုဆီကို ပြောင်းလဲပြီး — ၎င်းရဲ့ ယခင် အပြုအမူကို ပြန်လည် စတင်ပါတယ်။

```js
test('changes a mock behavior once', (t) => {
  const obj = { foo: 1 };

  const prop = t.mock.property(obj, 'foo', 5);

  assert.strictEqual(obj.foo, 5);
  prop.mock.mockImplementationOnce(25);
  assert.strictEqual(obj.foo, 25);
  assert.strictEqual(obj.foo, 5);
});
```

#### သတိထားစရာ (Caveat)

Mocking API ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေနဲ့ ညီညွတ်မှု ရှိစေဖို့ — ဒီ function က property ရဲ့ get ရော set ရော နှစ်ခုလုံးကိုပါ accesses အဖြစ် သဘောထားပါတယ်။ Access index တစ်ခုတည်းမှာ property set တစ်ခု ဖြစ်ပွားခဲ့ရင် — "once" တန်ဖိုးကို set operation က စားသုံးလိုက်ပြီး — mocked property value ကို "once" တန်ဖိုးဆီကို ပြောင်းလဲသွားပါလိမ့်မယ်။ "once" တန်ဖိုးကို get operation တစ်ခုအတွက်သာ သုံးဖို့ ရည်ရွယ်ထားရင် — ဒါက မမျှော်လင့်ထားတဲ့ အပြုအမူတွေဆီကို ဦးတည်သွားနိုင်ပါတယ်။

### `ctx.resetAccesses()`

Mocked property ရဲ့ access history (ဝင်ရောက်မှု မှတ်တမ်း) ကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။

### `ctx.restore()`

Mock property ရဲ့ implementation ကို ၎င်းရဲ့ မူရင်း အပြုအမူဆီကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။ ဒီ function ကို ခေါ်ပြီးနောက်မှာလည်း mock ကို ဆက်လက် သုံးနိုင်ပါသေးတယ်။

## Class: `MockTracker`

`MockTracker` class ကို mocking လုပ်ဆောင်ချက်တွေကို စီမံခန့်ခွဲဖို့ သုံးပါတယ်။ Test runner module က `MockTracker` instance တစ်ခု ဖြစ်တဲ့ top level `mock` export တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ Test တစ်ခုချင်းစီကလည်း — test context ရဲ့ `mock` property ကနေတစ်ဆင့် — ကိုယ်ပိုင် `MockTracker` instance တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

### `mock.fn([original[, implementation]][, options])`

* `original` {Function|AsyncFunction} Mock တစ်ခုကို ဖန်တီးဖို့ optional function တစ်ခုပါ။ **Default:** ဘာမှ မလုပ်ဆောင်တဲ့ (no-op) function တစ်ခုပါ။
* `implementation` {Function|AsyncFunction} `original` အတွက် mock implementation အဖြစ် သုံးတဲ့ optional function တစ်ခုပါ။ သတ်မှတ်ထားတဲ့ calls အရေအတွက်အတွက် အပြုအမူတစ်မျိုးကို ပြသပြီး — နောက်ပိုင်းမှာ `original` ရဲ့ အပြုအမူကို ပြန်လည် သတ်မှတ်ပေးတဲ့ mocks တွေကို ဖန်တီးဖို့ ဒါက အသုံးဝင်ပါတယ်။ **Default:** `original` က သတ်မှတ်ပေးထားတဲ့ function ပါ။
* `options` {Object} Mock function အတွက် optional configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `times` {integer} Mock က `implementation` ရဲ့ အပြုအမူကို သုံးမယ့် အကြိမ်အရေအတွက်ပါ။ Mock function ကို `times` ကြိမ် ခေါ်လိုက်တာနဲ့ — ၎င်းက `original` ရဲ့ အပြုအမူကို အလိုအလျောက် ပြန်လည် သတ်မှတ်ပေးပါလိမ့်မယ်။ ဒီတန်ဖိုးက သုညထက် ကြီးတဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `Infinity`.
* Returns: {Proxy} Mocked function ပါ။ Mocked function ထဲမှာ [`MockFunctionContext`][] ရဲ့ instance တစ်ခု ဖြစ်တဲ့ အထူး `mock` property တစ်ခု ပါဝင်ပြီး — mocked function ရဲ့ အပြုအမူကို စစ်ဆေးခြင်းနဲ့ ပြောင်းလဲခြင်းအတွက် သုံးနိုင်ပါတယ်။

ဒီ function ကို mock function တစ်ခု ဖန်တီးဖို့ သုံးပါတယ်။

အောက်က ဥပမာက invocation တစ်ခုချင်းစီမှာ counter တစ်ခုကို တစ်နဲ့ တိုးပေးတဲ့ mock function တစ်ခုကို ဖန်တီးပါတယ်။ `times` option ကို — ပထမဆုံး invocations နှစ်ခုက counter ကို တစ် အစား နှစ်နဲ့ ပေါင်းပေးတဲ့ — mock အပြုအမူကို ပြုပြင်ဖို့ သုံးပါတယ်။

```js
test('mocks a counting function', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```

### `mock.getter(object, methodName[, implementation][, options])`

ဒီ function က `options.getter` ကို `true` အဖြစ် သတ်မှတ်ထားတဲ့ [`MockTracker.method`][] အတွက် syntax sugar (ရေးသားရ လွယ်ကူစေသည့် အတိုကောက် နည်းလမ်း) တစ်ခုပါ။

### `mock.method(object, methodName[, implementation][, options])`

* `object` {Object} Method ကို mock လုပ်ခံနေရတဲ့ object ပါ။
* `methodName` {string|symbol} `object` ပေါ်မှာ mock လုပ်ရမယ့် method ရဲ့ identifier ပါ။ `object[methodName]` က function တစ်ခု မဟုတ်ဘူးဆိုရင် — error တစ်ခုကို throw လုပ်ပါတယ်။
* `implementation` {Function|AsyncFunction} `object[methodName]` အတွက် mock implementation အဖြစ် သုံးတဲ့ optional function တစ်ခုပါ။ **Default:** `object[methodName]` က သတ်မှတ်ပေးထားတဲ့ မူရင်း method ပါ။
* `options` {Object} Mock method အတွက် optional configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `getter` {boolean} `true` ဆိုရင် — `object[methodName]` ကို getter တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ ဒီ option ကို `setter` option နဲ့အတူ သုံးလို့ မရပါဘူး။ **Default:** false.
  * `setter` {boolean} `true` ဆိုရင် — `object[methodName]` ကို setter တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ ဒီ option ကို `getter` option နဲ့အတူ သုံးလို့ မရပါဘူး။ **Default:** false.
  * `times` {integer} Mock က `implementation` ရဲ့ အပြုအမူကို သုံးမယ့် အကြိမ်အရေအတွက်ပါ။ Mocked method ကို `times` ကြိမ် ခေါ်လိုက်တာနဲ့ — ၎င်းက မူရင်း အပြုအမူကို အလိုအလျောက် ပြန်လည် သတ်မှတ်ပေးပါလိမ့်မယ်။ ဒီတန်ဖိုးက သုညထက် ကြီးတဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `Infinity`.
* Returns: {Proxy} Mocked method ပါ။ Mocked method ထဲမှာ [`MockFunctionContext`][] ရဲ့ instance တစ်ခု ဖြစ်တဲ့ အထူး `mock` property တစ်ခု ပါဝင်ပြီး — mocked method ရဲ့ အပြုအမူကို စစ်ဆေးခြင်းနဲ့ ပြောင်းလဲခြင်းအတွက် သုံးနိုင်ပါတယ်။

ဒီ function ကို ရှိပြီးသား object method တစ်ခုပေါ်မှာ mock တစ်ခု ဖန်တီးဖို့ သုံးပါတယ်။ အောက်က ဥပမာက ရှိပြီးသား object method တစ်ခုပေါ်မှာ mock တစ်ခုကို ဘယ်လို ဖန်တီးလဲဆိုတာကို သရုပ်ပြပါတယ်။

```js
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### `mock.module(specifier[, options])`

> Stability: 1.0 - Early development

* `specifier` {string|URL} Mock လုပ်ရမယ့် module ကို ခွဲခြားသတ်မှတ်ပေးတဲ့ string တစ်ခုပါ။
* `options` {Object} Mock module အတွက် optional configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `cache` {boolean} `false` ဆိုရင် — `require()` သို့မဟုတ် `import()` ခေါ်တိုင်း — mock module အသစ်တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ `true` ဆိုရင် — နောက်ဆက်တွဲ ခေါ်တွေက mock module တစ်ခုတည်းကိုပဲ ပြန်ပေးပြီး — mock module ကို CommonJS cache ထဲကို ထည့်သွင်းပါတယ်။ **Default:** false.
  * `exports` {Object} Optional mocked exports များပါ။ `default` property ကို ပေးထားရင် — mocked module ရဲ့ default export အဖြစ် သုံးပါတယ်။ တခြား own enumerable properties တွေ အားလုံးကို named exports တွေအဖြစ် သုံးပါတယ်။ **ဒီ option ကို `defaultExport` သို့မဟုတ် `namedExports` တို့နဲ့အတူ သုံးလို့ မရပါဘူး။**
    * Mock က CommonJS သို့မဟုတ် builtin module တစ်ခုဆိုရင် — `exports.default` ကို `module.exports` ရဲ့ တန်ဖိုးအဖြစ် သုံးပါတယ်။
    * CommonJS သို့မဟုတ် builtin mock တစ်ခုအတွက် `exports.default` ကို မပေးထားဘူးဆိုရင် — `module.exports` က empty object တစ်ခုကို default အနေနဲ့ သုံးပါတယ်။
    * Named exports တွေကို non-object default export တစ်ခုနဲ့အတူ ပေးထားရင် — mock ကို CommonJS သို့မဟုတ် builtin module အဖြစ် သုံးတဲ့အခါ — exception တစ်ခုကို throw လုပ်ပါတယ်။
  * `defaultExport` {any} Mocked module ရဲ့ default export အဖြစ် သုံးတဲ့ optional တန်ဖိုးတစ်ခုပါ။ ဒီတန်ဖိုးကို မပေးထားဘူးဆိုရင် — ESM mocks တွေမှာ default export တစ်ခု မပါဝင်ပါဘူး။ Mock က CommonJS သို့မဟုတ် builtin module တစ်ခုဆိုရင် — ဒီ setting ကို `module.exports` ရဲ့ တန်ဖိုးအဖြစ် သုံးပါတယ်။ ဒီတန်ဖိုးကို မပေးထားဘူးဆိုရင် — CJS နဲ့ builtin mocks တွေက `module.exports` ရဲ့ တန်ဖိုးအနေနဲ့ empty object တစ်ခုကို သုံးပါတယ်။ **ဒီ option ကို `options.exports` နဲ့အတူ သုံးလို့ မရပါဘူး။** ဒီ option က deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထား) ဖြစ်ပြီး — နောက်ပိုင်း version တစ်ခုမှာ ဖယ်ရှားပါလိမ့်မယ်။ `options.exports.default` ကို ဦးစားပေး သုံးပါ။
  * `namedExports` {Object} Mock module ရဲ့ named exports တွေကို ဖန်တီးဖို့ keys နဲ့ values တွေကို သုံးတဲ့ optional object တစ်ခုပါ။ Mock က CommonJS သို့မဟုတ် builtin module တစ်ခုဆိုရင် — ဒီ values တွေကို `module.exports` ပေါ်ကို ကူးယူပါတယ်။ ဒါကြောင့် — named exports တွေနဲ့ non-object default export တစ်ခု နှစ်ခုလုံးနဲ့ mock တစ်ခုကို ဖန်တီးထားရင် — mock ကို CJS သို့မဟုတ် builtin module အဖြစ် သုံးတဲ့အခါ — exception တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ **ဒီ option ကို `options.exports` နဲ့အတူ သုံးလို့ မရပါဘူး။** ဒီ option က deprecated ဖြစ်ပြီး — နောက်ပိုင်း version တစ်ခုမှာ ဖယ်ရှားပါလိမ့်မယ်။ `options.exports` ကို ဦးစားပေး သုံးပါ။
* Returns: {MockModuleContext} Mock ကို ကိုင်တွယ်ဖို့ သုံးနိုင်တဲ့ object တစ်ခုပါ။

ဒီ function ကို ECMAScript modules, CommonJS modules, JSON modules နဲ့ Node.js builtin modules တွေရဲ့ exports တွေကို mock လုပ်ဖို့ သုံးပါတယ်။ Mocking မလုပ်ခင် မူရင်း module ဆီကို ထောက်ပြထားတဲ့ references တွေကို သက်ရောက်မှု မရှိပါဘူး။ Module mocking ကို ဖွင့်နိုင်ဖို့အတွက် — Node.js ကို [`--experimental-test-module-mocks`][] command-line flag နဲ့ စတင်ရပါမယ်။

**Note**: [module customization hooks][] တွေကို **synchronous** API ကနေတစ်ဆင့် register လုပ်ထားရင် — `mock.module` ဆီကို ပေးတဲ့ `specifier` ရဲ့ resolution ကို သက်ရောက်မှု ရှိပါတယ်။ **asynchronous** API ကနေတစ်ဆင့် register လုပ်ထားတဲ့ customization hooks တွေကိုတော့ လက်ရှိမှာ လျစ်လျူရှုထားပါတယ် (အကြောင်းကတော့ — test runner ရဲ့ loader က synchronous ဖြစ်ပြီး — node က multi-chain / cross-chain loading ကို မပံ့ပိုးလို့ပါ)။

အောက်က ဥပမာက module တစ်ခုအတွက် mock တစ်ခုကို ဘယ်လို ဖန်တီးလဲဆိုတာကို သရုပ်ပြပါတယ်။

```js
test('mocks a builtin module in both module systems', async (t) => {
  // Create a mock of 'node:readline' with a named export named 'foo', which
  // does not exist in the original 'node:readline' module.
  const mock = t.mock.module('node:readline', {
    exports: { foo: () => 42 },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() is an export of the original 'node:readline' module.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.foo(), 42);
  assert.strictEqual(cjsImpl.foo(), 42);

  mock.restore();

  // The mock is restored, so the original builtin module is returned.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.foo, undefined);
  assert.strictEqual(cjsImpl.foo, undefined);
});
```

### `mock.property(object, propertyName[, value])`

* `object` {Object} တန်ဖိုးကို mock လုပ်ခံနေရတဲ့ object ပါ။
* `propertyName` {string|symbol} `object` ပေါ်မှာ mock လုပ်ရမယ့် property ရဲ့ identifier ပါ။
* `value` {any} `object[propertyName]` အတွက် mock value အဖြစ် သုံးတဲ့ optional တန်ဖိုးတစ်ခုပါ။ **Default:** မူရင်း property value ပါ။
* Returns: {Proxy} Mocked object ဆီကို ညွှန်တဲ့ proxy တစ်ခုပါ။ Mocked object ထဲမှာ [`MockPropertyContext`][] ရဲ့ instance တစ်ခု ဖြစ်တဲ့ အထူး `mock` property တစ်ခု ပါဝင်ပြီး — mocked property ရဲ့ အပြုအမူကို စစ်ဆေးခြင်းနဲ့ ပြောင်းလဲခြင်းအတွက် သုံးနိုင်ပါတယ်။

Object တစ်ခုပေါ်က property value တစ်ခုအတွက် mock တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဒါက — တိကျတဲ့ property တစ်ခုဆီကို ဝင်ရောက်မှုတွေ — ဘယ်နှစ်ကြိမ် ဖတ်ခဲ့သည် (getter) သို့မဟုတ် ရေးခဲ့သည် (setter) အပါအဝင် — ကို ခြေရာခံပြီး ထိန်းချုပ်နိုင်စေကာ — mocking ပြီးနောက် မူရင်း တန်ဖိုးကို ပြန်လည် သတ်မှတ်နိုင်စေပါတယ်။

```js
test('mocks a property value', (t) => {
  const obj = { foo: 42 };
  const prop = t.mock.property(obj, 'foo', 100);

  assert.strictEqual(obj.foo, 100);
  assert.strictEqual(prop.mock.accessCount(), 1);
  assert.strictEqual(prop.mock.accesses[0].type, 'get');
  assert.strictEqual(prop.mock.accesses[0].value, 100);

  obj.foo = 200;
  assert.strictEqual(prop.mock.accessCount(), 2);
  assert.strictEqual(prop.mock.accesses[1].type, 'set');
  assert.strictEqual(prop.mock.accesses[1].value, 200);

  prop.mock.restore();
  assert.strictEqual(obj.foo, 42);
});
```

### `mock.reset()`

ဒီ function က ဒီ `MockTracker` က အရင်က ဖန်တီးခဲ့တဲ့ mocks တွေ အားလုံးရဲ့ default အပြုအမူကို ပြန်လည် သတ်မှတ်ပေးပြီး — mocks တွေကို `MockTracker` instance ကနေ ခွဲထုတ် (disassociate) ပေးပါတယ်။ ခွဲထုတ်လိုက်ပြီးနောက်မှာလည်း mocks တွေကို ဆက်လက် သုံးနိုင်ပါသေးတယ် — ဒါပေမယ့် — `MockTracker` instance ကို ၎င်းတို့ရဲ့ အပြုအမူတွေကို ပြန်လည် သတ်မှတ်ဖို့ သို့မဟုတ် ၎င်းတို့နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

Test တစ်ခုချင်းစီ ပြီးဆုံးပြီးနောက်မှာ — ဒီ function ကို test context ရဲ့ `MockTracker` ပေါ်မှာ ခေါ်ပါတယ်။ Global `MockTracker` ကို အကျယ်တဝင့် သုံးနေတယ်ဆိုရင် — ဒီ function ကို လက်နဲ့ ကိုယ်တိုင် ခေါ်ပေးဖို့ အကြံပြုပါတယ်။

### `mock.restoreAll()`

ဒီ function က ဒီ `MockTracker` က အရင်က ဖန်တီးခဲ့တဲ့ mocks တွေ အားလုံးရဲ့ default အပြုအမူကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။ `mock.reset()` နဲ့ မတူပဲ — `mock.restoreAll()` က mocks တွေကို `MockTracker` instance ကနေ ခွဲထုတ်မပေးပါဘူး။

### `mock.setter(object, methodName[, implementation][, options])`

ဒီ function က `options.setter` ကို `true` အဖြစ် သတ်မှတ်ထားတဲ့ [`MockTracker.method`][] အတွက် syntax sugar တစ်ခုပါ။

## Class: `MockTimers`

Mocking timers (timer များကို အတုအယောင် ပြုလုပ်ခြင်း) က software testing တွေမှာ သာမန်အားဖြင့် သုံးလေ့ရှိတဲ့ နည်းစနစ်တစ်ခု ဖြစ်ပြီး — `setInterval` နဲ့ `setTimeout` လိုမျိုး timers တွေရဲ့ အပြုအမူကို — သတ်မှတ်ထားတဲ့ time intervals တွေကို တကယ် မစောင့်ပဲ — အတုအယောင် ဖန်တီး (simulate) ပြီး ထိန်းချုပ်ဖို့ အတွက်ပါ။

MockTimers က `Date` object ကိုလည်း mock လုပ်နိုင်ပါတယ်။

[`MockTracker`][] က `MockTimers` instance တစ်ခု ဖြစ်တဲ့ top-level `timers` export တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

### `timers.enable([enableOptions])`

သတ်မှတ်ထားတဲ့ timers တွေအတွက် timer mocking ကို ဖွင့်ပေးပါတယ်။

* `enableOptions` {Object} Timer mocking ဖွင့်ခြင်းအတွက် optional configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `apis` {Array} Mock လုပ်ရမယ့် timers တွေ ပါဝင်တဲ့ optional array တစ်ခုပါ။ လက်ရှိ ပံ့ပိုးထားတဲ့ timer values တွေကတော့ `'setInterval'`, `'setTimeout'`, `'setImmediate'` နဲ့ `'Date'` တို့ပါ။ **Default:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`။ Array တစ်ခုမှ မပေးထားဘူးဆိုရင် — အချိန်နဲ့ ဆက်စပ်တဲ့ APIs (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'` နဲ့ `'Date'`) တွေ အားလုံးကို default အနေနဲ့ mock လုပ်ပါလိမ့်မယ်။
  * `now` {number | Date} `Date.now()` အတွက် တန်ဖိုးအဖြစ် သုံးမယ့် ကနဦး အချိန် (milliseconds ဖြင့်) ကို ကိုယ်စားပြုတဲ့ optional number သို့မဟုတ် Date object တစ်ခုပါ။ **Default:** `0`.

**Note:** သတ်မှတ်ထားတဲ့ timer တစ်ခုအတွက် mocking ကို ဖွင့်လိုက်တဲ့အခါ — ၎င်းနဲ့ ဆက်စပ်နေတဲ့ clear function ကိုပါ implicitly (သွယ်ဝိုက်အနေနဲ့) mock လုပ်ပေးပါတယ်။

**Note:** `Date` ကို mock လုပ်တာက — mocked timers တွေက အတွင်းပိုင်း clock တစ်ခုတည်းကို သုံးတာမို့ — ၎င်းတို့ရဲ့ အပြုအမူကိုပါ သက်ရောက်မှု ရှိပါလိမ့်မယ်။

ကနဦး အချိန် မသတ်မှတ်ပဲ သုံးတဲ့ ဥပမာ:

```mjs
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```cjs
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```

အထက်က ဥပမာက `setInterval` timer အတွက် mocking ကို ဖွင့်ပေးပြီး — `clearInterval` function ကိုပါ implicitly mock လုပ်ပါတယ်။ [node:timers](https://nodejs.org/api/timers.html), [node:timers/promises](https://nodejs.org/api/timers.html#timers-promises-api) နဲ့ `globalThis` တို့ကနေ လာတဲ့ `setInterval` နဲ့ `clearInterval` functions တွေကိုသာ mock လုပ်ပါလိမ့်မယ်။

ကနဦး အချိန် သတ်မှတ်ထားပြီး သုံးတဲ့ ဥပမာ

```mjs
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```cjs
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

ကနဦး အချိန်အဖြစ် Date object တစ်ခု သတ်မှတ်ပြီး သုံးတဲ့ ဥပမာ

```mjs
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```cjs
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

တစ်နည်းအားဖြင့် — parameters တွေ မပါပဲ `mock.timers.enable()` ကို ခေါ်မယ်ဆိုရင်:

Timers တွေ အားလုံး (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` နဲ့ `'clearImmediate'`) ကို mock လုပ်ပါလိမ့်မယ်။ `node:timers`, `node:timers/promises` နဲ့ `globalThis` တို့ကနေ လာတဲ့ `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` နဲ့ `clearImmediate` functions တွေကို mock လုပ်ပါလိမ့်မယ်။ Global `Date` object ကိုလည်း ထည့်သွင်း mock လုပ်ပါတယ်။
### `timers.reset()`

ဒီ function က ဒီ `MockTimers` instance က အရင်က ဖန်တီးခဲ့တဲ့ mocks တွေ အားလုံးရဲ့ default behavior ကို ပြန်လည် ထူတည်ပေးပြီး — အဲဒီ mocks တွေကို `MockTracker` instance နဲ့ ဆက်စပ်မှု ဖြုတ်ချ (disassociate) ပေးပါတယ်။

**Note:** Test တစ်ခုစီ ပြီးစီးသွားပြီးနောက်မှာ ဒီ function ကို test context ရဲ့ `MockTracker` ပေါ်မှာ ခေါ်ယူပါတယ်။

```mjs
import { mock } from 'node:test';
mock.timers.reset();
```

```cjs
const { mock } = require('node:test');
mock.timers.reset();
```

### `timers[Symbol.dispose]()`

`timers.reset()` ကို ခေါ်ယူပါတယ်။

### `timers.tick([milliseconds])`

Mocked timers တွေ အားလုံးအတွက် အချိန်ကို ရှေ့သို့ တိုးစေပါတယ်။

* `milliseconds` {number} Timers တွေကို ရှေ့သို့ တိုးမယ့် အချိန်ပမာဏ (milliseconds ဖြင့်) ပါ။ **Default:** `1`.

**Note:** ဒါက Node.js ထဲက `setTimeout` ရဲ့ အပြုအမူနဲ့ ကွဲပြားပြီး — positive numbers တွေကိုသာ လက်ခံပါတယ်။ Node.js မှာတော့ — web compatibility အကြောင်းပြချက်တွေကြောင့်သာ — negative numbers တွေနဲ့ `setTimeout` ကို ပံ့ပိုးပေးထားတာပါ။

အောက်က ဥပမာက `setTimeout` function တစ်ခုကို mock လုပ်ပြီး — `.tick` ကို သုံးကာ အချိန်ကို ရှေ့သို့ တိုးလိုက်တာနဲ့ — pending timers တွေ အားလုံးကို trigger လုပ်ပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

တနည်းအားဖြင့် — `.tick` function ကို အကြိမ်များစွာ ခေါ်ယူနိုင်ပါတယ်

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

`.tick` ကို သုံးပြီး အချိန် တိုးလိုက်တာက — mock ကို enable လုပ်ပြီးနောက်မှာ ဖန်တီးခဲ့တဲ့ `Date` object တွေရဲ့ အချိန်ကိုလည်း တိုးပေးပါလိမ့်မယ် (`Date` ကိုလည်း mock လုပ်ရန် သတ်မှတ်ထားရင် ဖြစ်ပါတယ်)။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

#### Clear functions များကို အသုံးပြုခြင်း (Using clear functions)

အရင်က ဖော်ပြခဲ့သလိုပဲ — timers တွေရဲ့ clear functions အားလုံး (`clearTimeout`, `clearInterval`, နဲ့ `clearImmediate`) ကို implicitly (သွယ်ဝိုက်၍) mock လုပ်ပါတယ်။ `setTimeout` ကို သုံးထားတဲ့ ဒီဥပမာကို ကြည့်ပါ:

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

#### Node.js timers modules များနှင့် အလုပ်လုပ်ခြင်း (Working with Node.js timers modules)

Timers mocking ကို enable လုပ်လိုက်တာနဲ့ — [node:timers](https://nodejs.org/api/timers.html), [node:timers/promises](https://nodejs.org/api/timers.html#timers-promises-api) modules တွေနဲ့ Node.js ရဲ့ global context ကနေ ရတဲ့ timers တွေ အားလုံး enable ဖြစ်သွားပါတယ်:

**Note:** `import { setTimeout } from 'node:timers'` လိုမျိုး destructuring လုပ်တာတွေကိုတော့ ဒီ API က လောလောဆယ် support မလုပ်သေးပါဘူး။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

Node.js မှာတော့ — [node:timers/promises](https://nodejs.org/api/timers.html#timers-promises-api) ကနေ လာတဲ့ `setInterval` က `AsyncGenerator` တစ်ခု ဖြစ်ပြီး — ဒီ API ကလည်း ၎င်းကို ပံ့ပိုးပေးပါတယ်:

```mjs
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

### `timers.runAll()`

Pending mocked timers တွေ အားလုံးကို ချက်ချင်း trigger လုပ်ပါတယ်။ `Date` object ကိုလည်း mock လုပ်ထားရင် — `Date` object ကို အဝေးဆုံး (furthest) timer ရဲ့ အချိန်အထိပါ တိုးပေးပါလိမ့်မယ်။

အောက်က ဥပမာက pending timers တွေ အားလုံးကို ချက်ချင်း trigger လုပ်ပြီး — နှောင့်နှေးမှု မရှိပဲ execute ဖြစ်စေပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```

**Note:** `runAll()` function က timer mocking ရဲ့ context ထဲမှာ timers တွေကို trigger လုပ်ဖို့အတွက် သီးသန့် ဒီဇိုင်းထုတ်ထားတာပါ။ Mocking environment ရဲ့ အပြင်ဘက်က real-time system clocks (သို့) တကယ့် timers တွေအပေါ်မှာတော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

### `timers.setTime(milliseconds)`

Mocked `Date` objects တွေအတွက် reference အဖြစ် သုံးမယ့် လက်ရှိ Unix timestamp ကို သတ်မှတ်ပေးပါတယ်။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime replaces current time', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```

#### Dates နှင့် Timers တို့ တွဲဖက် အလုပ်လုပ်ခြင်း (Dates and Timers working together)

Dates နဲ့ timer objects တွေက တစ်ခုနဲ့တစ်ခု မှီခိုနေပါတယ်။ Mocked `Date` object ဆီကို လက်ရှိအချိန်ကို ဖြတ်သန်းဖို့ `setTime()` ကို သုံးလိုက်ရင် — `setTimeout` နဲ့ `setInterval` နဲ့ သတ်မှတ်ထားတဲ့ timers တွေကတော့ ထိခိုက်မှာ **မဟုတ်ပါဘူး**။

ဒါပေမယ့် — `tick` method ကတော့ mocked `Date` object ကို ရှေ့သို့ တိုးပေးမှာ **ဖြစ်ပါတယ်**။

```mjs
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // The date is advanced but the timers don't tick
  assert.strictEqual(Date.now(), 12000);
});
```

```cjs
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // The date is advanced but the timers don't tick
  assert.strictEqual(Date.now(), 12000);
});
```

## Class: `TestsStream`

* Extends {Readable}

[`run()`][] method ကို အောင်မြင်စွာ ခေါ်လိုက်ရင် — tests တွေရဲ့ execution ကို ကိုယ်စားပြုတဲ့ events အစီအစဉ်တစ်ခုကို stream လုပ်ပေးမယ့် — {TestsStream} object အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ `TestsStream` က events တွေကို tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်

Events တစ်ချို့က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံထားပြီး — ကျန်တဲ့ဟာတွေကတော့ tests တွေ execute လုပ်တဲ့ အစီအစဉ်အတိုင်း emit လုပ်ပါတယ်။

အောက်ပါ tables တွေက events တွေ အားလုံးကို scope အလိုက် အနှစ်ချုပ် ဖော်ပြပါတယ်။

Test-scoped events တွေကို test သို့မဟုတ် suite တစ်ခုစီအတွက် တစ်ကြိမ် emit လုပ်ပါတယ်။ အများစုက အတွဲလိုက် ပါလာပါတယ်: declaration-ordered event တစ်ခု — events တွေကို tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit ဖြစ်အောင် buffer လုပ်ထားတာပါ — ပြီးတော့ tests တွေ execute လုပ်တာနဲ့ ချက်ချင်း emit လုပ်တဲ့ သက်ဆိုင်ရာ execution-ordered events တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပါတယ်။

| Declaration ordered (buffered) | Execution ordered (immediate)                         |
| ------------------------------ | ----------------------------------------------------- |
| [`'test:start'`][]             | [`'test:enqueue'`][] နောက်တွင် [`'test:dequeue'`][] |
| [`'test:pass'`][]              | [`'test:complete'`][] (`details.passed` က `true` ဖြစ်နေချိန်) |
| [`'test:fail'`][]              | [`'test:complete'`][] (`details.passed` က `false` ဖြစ်နေချိန်) |
| [`'test:plan'`][]              |                                                       |
| [`'test:diagnostic'`][]        |                                                       |
|                                | [`'test:log'`][]                                      |

[`'test:log'`][] က ရည်ရွယ်ချက်ရှိရှိနဲ့ execution-ordered သက်သက် ဖြစ်ပါတယ်: ၎င်းက [`'test:diagnostic'`][] ရဲ့ buffered reporting ရဲ့ live (တိုက်ရိုက်) ပုံစံပါ။

File-scoped နဲ့ global events တွေကိုတော့ execution order အတိုင်း အမြဲတမ်း ချက်ချင်း emit လုပ်ပါတယ်။

File-scoped events တွေကို test file တစ်ခုစီအတွက် တစ်ကြိမ် emit လုပ်ပါတယ်:

| Event                | Notes                                          |
| -------------------- | ---------------------------------------------- |
| [`'test:stderr'`][]  | `--test` flag ကို ဖြတ်သန်းပေးထားမှသာ emit လုပ်ပါတယ်။ |
| [`'test:stdout'`][]  | `--test` flag ကို ဖြတ်သန်းပေးထားမှသာ emit လုပ်ပါတယ်။ |
| [`'test:summary'`][] | Process isolation ကို သုံးတဲ့အခါမှသာ file တစ်ခုစီအလိုက် ဖြစ်ပါတယ်။ |

Global events တွေကို test run တစ်ခုစီအတွက် တစ်ကြိမ် emit လုပ်ပါတယ်:

| Event                        | Notes                                |
| ---------------------------- | ------------------------------------ |
| [`'test:summary'`][]         | နောက်ဆုံး စုစည်းထားတဲ့ (cumulative) summary ပါ။ |
| [`'test:coverage'`][]        | Code coverage ကို ဖွင့်ထားတဲ့အခါမှသာ ဖြစ်ပါတယ်။ |
| [`'test:interrupted'`][]     | Run က `SIGINT` ကို လက်ခံရရှိတဲ့အခါမှသာ ဖြစ်ပါတယ်။ |
| [`'test:watch:drained'`][]   | Watch mode မှာသာ ဖြစ်ပါတယ်။ |
| [`'test:watch:restarted'`][] | Watch mode မှာသာ ဖြစ်ပါတယ်။ |

Root test ကလည်း — run ရဲ့ အဆုံးမှာ run-level totals တွေကို သတင်းပို့ဖို့ — [`'test:plan'`][] နဲ့ [`'test:diagnostic'`][] events တွေကို emit လုပ်ပါတယ်။

### Event: `'test:coverage'`

* `data` {Object}
  * `summary` {Object} Coverage report ပါဝင်တဲ့ object တစ်ခုပါ။
    * `files` {Array} File တစ်ခုချင်းစီအတွက် coverage reports တွေရဲ့ array ပါ။ Report တစ်ခုစီဟာ အောက်ပါ schema နဲ့ object တစ်ခု ဖြစ်ပါတယ်:
      * `path` {string} File ရဲ့ absolute path ပါ။
      * `totalLineCount` {number} Line စုစုပေါင်း အရေအတွက်ပါ။
      * `totalBranchCount` {number} Branch စုစုပေါင်း အရေအတွက်ပါ။
      * `totalFunctionCount` {number} Function စုစုပေါင်း အရေအတွက်ပါ။
      * `coveredLineCount` {number} Coverage ရခဲ့တဲ့ lines အရေအတွက်ပါ။
      * `coveredBranchCount` {number} Coverage ရခဲ့တဲ့ branches အရေအတွက်ပါ။
      * `coveredFunctionCount` {number} Coverage ရခဲ့တဲ့ functions အရေအတွက်ပါ။
      * `coveredLinePercent` {number} Coverage ရခဲ့တဲ့ lines ရဲ့ ရာခိုင်နှုန်းပါ။
      * `coveredBranchPercent` {number} Coverage ရခဲ့တဲ့ branches ရဲ့ ရာခိုင်နှုန်းပါ။
      * `coveredFunctionPercent` {number} Coverage ရခဲ့တဲ့ functions ရဲ့ ရာခိုင်နှုန်းပါ။
      * `functions` {Array} Function coverage ကို ကိုယ်စားပြုတဲ့ functions တွေရဲ့ array ပါ။
        * `name` {string} Function ရဲ့ နာမည်ပါ။
        * `line` {number} Function ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ။
        * `count` {number} Function ကို ခေါ်ခဲ့တဲ့ အကြိမ်အရေအတွက်ပါ။
      * `branches` {Array} Branch coverage ကို ကိုယ်စားပြုတဲ့ branches တွေရဲ့ array ပါ။
        * `line` {number} Branch ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ။
        * `count` {number} Branch ကို ဖြတ်သန်းခဲ့တဲ့ အကြိမ်အရေအတွက်ပါ။
      * `lines` {Array} Line နံပါတ်တွေနဲ့ — ၎င်းတို့ coverage ရခဲ့တဲ့ အကြိမ်အရေအတွက်တွေကို ကိုယ်စားပြုတဲ့ — lines တွေရဲ့ array ပါ။
        * `line` {number} Line နံပါတ်ပါ။
        * `count` {number} Line က coverage ရခဲ့တဲ့ အကြိမ်အရေအတွက်ပါ။
    * `thresholds` {Object} Coverage type တစ်ခုစီအတွက် thresholds တွေ ပါဝင်တဲ့ object တစ်ခုပါ။
      * `function` {number} Function coverage အတွက် threshold ပါ။
      * `branch` {number} Branch coverage အတွက် threshold ပါ။
      * `line` {number} Line coverage အတွက် threshold ပါ။
    * `totals` {Object} Files အားလုံးအတွက် coverage ရဲ့ အကျဉ်းချုပ် ပါဝင်တဲ့ object တစ်ခုပါ။
      * `totalLineCount` {number} Line စုစုပေါင်း အရေအတွက်ပါ။
      * `totalBranchCount` {number} Branch စုစုပေါင်း အရေအတွက်ပါ။
      * `totalFunctionCount` {number} Function စုစုပေါင်း အရေအတွက်ပါ။
      * `coveredLineCount` {number} Coverage ရခဲ့တဲ့ lines အရေအတွက်ပါ။
      * `coveredBranchCount` {number} Coverage ရခဲ့တဲ့ branches အရေအတွက်ပါ။
      * `coveredFunctionCount` {number} Coverage ရခဲ့တဲ့ functions အရေအတွက်ပါ။
      * `coveredLinePercent` {number} Coverage ရခဲ့တဲ့ lines ရဲ့ ရာခိုင်နှုန်းပါ။
      * `coveredBranchPercent` {number} Coverage ရခဲ့တဲ့ branches ရဲ့ ရာခိုင်နှုန်းပါ။
      * `coveredFunctionPercent` {number} Coverage ရခဲ့တဲ့ functions ရဲ့ ရာခိုင်နှုန်းပါ။
    * `workingDirectory` {string} Code coverage စတင်ခဲ့ချိန်က working directory ပါ။ Tests တွေက Node.js process ရဲ့ working directory ကို ပြောင်းလဲလိုက်ခဲ့တဲ့ အခြေအနေမျိုးမှာ relative path names တွေကို ဖော်ပြရာမှာ ဒါက အသုံးဝင်ပါတယ်။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။

Code coverage ကို ဖွင့်ထားပြီး tests တွေ အားလုံး ပြီးစီးသွားတဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'test:complete'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `details` {Object} ထပ်ဆောင်း execution metadata တွေပါ။
    * `passed` {boolean} Test အောင်မြင်ခဲ့လား မအောင်မြင်ခဲ့ဘူးလားဆိုတာပါ။
    * `duration_ms` {number} Test ရဲ့ ကြာချိန် (milliseconds) ပါ။
    * `error` {Error|undefined} Test က မအောင်မြင်ခဲ့ရင် — test က throw လုပ်ခဲ့တဲ့ error ကို ပတ်ရစ် (wrap) ထားတဲ့ error တစ်ခုပါ။
      * `cause` {Error} Test က တကယ် throw လုပ်ခဲ့တဲ့ error ပါ။
    * `type` {string|undefined} Test ရဲ့ အမျိုးအစားပါ — ဒါက suite ဟုတ်မဟုတ် ဖော်ပြဖို့ သုံးပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ တူညီတဲ့ nesting level မှာ ရှိနေတဲ့ concurrent siblings တွေ အချင်းချင်း ရောယှက်နေတဲ့အခါ custom reporters တွေက lineage (အစဉ်အတန်း) ကို ခြေရာခံနိုင်စေပါတယ်။
  * `tags` {string\[]} Test နဲ့ ၎င်းရဲ့ ancestor suites တွေပေါ်မှာ ကြေညာထားတဲ့ tags တွေကို flatten လုပ်ပြီး lowercase ပြောင်းထားတဲ့ စာရင်းပါ — declaration order အတိုင်း ဖြစ်ပါတယ်။ Tags မရှိတဲ့ tests တွေအတွက်တော့ ဗလာ ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။
  * `testId` {number} ဒီ test instance အတွက် numeric identifier ပါ — test file ရဲ့ process အတွင်းမှာ ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ပါတယ်။ Test instance တစ်ခုတည်းအတွက် events တွေ အားလုံးမှာ တသမတ်တည်း ရှိတာမို့ — custom reporters တွေမှာ ယုံကြည်စိတ်ချရတဲ့ ဆက်စပ်မှု (correlation) ပြုလုပ်နိုင်စေပါတယ်။
  * `testNumber` {number} Test ရဲ့ အစဉ်လိုက် (ordinal) နံပါတ်ပါ။
  * `todo` {string|boolean|undefined} [`context.todo`][] ကို ခေါ်ထားရင် ပါဝင်ပါတယ်
  * `skip` {string|boolean|undefined} [`context.skip`][] ကို ခေါ်ထားရင် ပါဝင်ပါတယ်

Test တစ်ခုက ၎င်းရဲ့ execution ကို ပြီးမြောက်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ကိုတော့ tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်တာ မဟုတ်ပါဘူး။ သက်ဆိုင်တဲ့ declaration-ordered events တွေကတော့ `'test:pass'` နဲ့ `'test:fail'` တို့ပါ။

### Event: `'test:dequeue'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ တူညီတဲ့ nesting level မှာ ရှိနေတဲ့ concurrent siblings တွေ အချင်းချင်း ရောယှက်နေတဲ့အခါ custom reporters တွေက lineage (အစဉ်အတန်း) ကို ခြေရာခံနိုင်စေပါတယ်။
  * `tags` {string\[]} Test နဲ့ ၎င်းရဲ့ ancestor suites တွေပေါ်မှာ ကြေညာထားတဲ့ tags တွေကို flatten လုပ်ပြီး lowercase ပြောင်းထားတဲ့ စာရင်းပါ — declaration order အတိုင်း ဖြစ်ပါတယ်။ Tags မရှိတဲ့ tests တွေအတွက်တော့ ဗလာ ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။
  * `testId` {number} ဒီ test instance အတွက် numeric identifier ပါ — test file ရဲ့ process အတွင်းမှာ ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ပါတယ်။ Test instance တစ်ခုတည်းအတွက် events တွေ အားလုံးမှာ တသမတ်တည်း ရှိတာမို့ — custom reporters တွေမှာ ယုံကြည်စိတ်ချရတဲ့ ဆက်စပ်မှု (correlation) ပြုလုပ်နိုင်စေပါတယ်။
  * `type` {string} Test ရဲ့ အမျိုးအစားပါ — `'suite'` (သို့) `'test'` ဖြစ်ပါတယ်။

Test တစ်ခုကို — execute မလုပ်ခင် — queue ကနေ dequeue လုပ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံချက် မရှိပါဘူး။ သက်ဆိုင်တဲ့ declaration-ordered event ကတော့ `'test:start'` ပါ။

### Event: `'test:diagnostic'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `message` {string} Diagnostic message ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `level` {string} Diagnostic message ရဲ့ severity (ပြင်းထန်မှု) အဆင့်ပါ။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့:
    * `'info'`: Informational (အချက်အလက်ပေး) messages တွေပါ။
    * `'warn'`: Warning (သတိပေးချက်) messages တွေပါ။
    * `'error'`: Error messages တွေပါ။

[`context.diagnostic`][] ကို ခေါ်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံထားပါတယ်။

### Event: `'test:enqueue'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ တူညီတဲ့ nesting level မှာ ရှိနေတဲ့ concurrent siblings တွေ အချင်းချင်း ရောယှက်နေတဲ့အခါ custom reporters တွေက lineage (အစဉ်အတန်း) ကို ခြေရာခံနိုင်စေပါတယ်။
  * `tags` {string\[]} Test နဲ့ ၎င်းရဲ့ ancestor suites တွေပေါ်မှာ ကြေညာထားတဲ့ tags တွေကို flatten လုပ်ပြီး lowercase ပြောင်းထားတဲ့ စာရင်းပါ — declaration order အတိုင်း ဖြစ်ပါတယ်။ Tags မရှိတဲ့ tests တွေအတွက်တော့ ဗလာ ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။
  * `testId` {number} ဒီ test instance အတွက် numeric identifier ပါ — test file ရဲ့ process အတွင်းမှာ ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ပါတယ်။ Test instance တစ်ခုတည်းအတွက် events တွေ အားလုံးမှာ တသမတ်တည်း ရှိတာမို့ — custom reporters တွေမှာ ယုံကြည်စိတ်ချရတဲ့ ဆက်စပ်မှု (correlation) ပြုလုပ်နိုင်စေပါတယ်။
  * `type` {string} Test ရဲ့ အမျိုးအစားပါ — `'suite'` (သို့) `'test'` ဖြစ်ပါတယ်။

Test တစ်ခုကို execution အတွက် enqueue လုပ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'test:fail'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `details` {Object} ထပ်ဆောင်း execution metadata တွေပါ။
    * `duration_ms` {number} Test ရဲ့ ကြာချိန် (milliseconds) ပါ။
    * `error` {Error} Test က throw လုပ်ခဲ့တဲ့ error ကို ပတ်ရစ် (wrap) ထားတဲ့ error တစ်ခုပါ။
      * `cause` {Error} Test က တကယ် throw လုပ်ခဲ့တဲ့ error ပါ။
    * `type` {string|undefined} Test ရဲ့ အမျိုးအစားပါ — ဒါက suite ဟုတ်မဟုတ် ဖော်ပြဖို့ သုံးပါတယ်။
    * `attempt` {number|undefined} Test run ရဲ့ attempt နံပါတ်ပါ — [`--test-rerun-failures`][] flag ကို သုံးတဲ့အခါမှသာ ပါဝင်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ တူညီတဲ့ nesting level မှာ ရှိနေတဲ့ concurrent siblings တွေ အချင်းချင်း ရောယှက်နေတဲ့အခါ custom reporters တွေက lineage (အစဉ်အတန်း) ကို ခြေရာခံနိုင်စေပါတယ်။
  * `tags` {string\[]} Test နဲ့ ၎င်းရဲ့ ancestor suites တွေပေါ်မှာ ကြေညာထားတဲ့ tags တွေကို flatten လုပ်ပြီး lowercase ပြောင်းထားတဲ့ စာရင်းပါ — declaration order အတိုင်း ဖြစ်ပါတယ်။ Tags မရှိတဲ့ tests တွေအတွက်တော့ ဗလာ ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။
  * `testId` {number} ဒီ test instance အတွက် numeric identifier ပါ — test file ရဲ့ process အတွင်းမှာ ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ပါတယ်။ Test instance တစ်ခုတည်းအတွက် events တွေ အားလုံးမှာ တသမတ်တည်း ရှိတာမို့ — custom reporters တွေမှာ ယုံကြည်စိတ်ချရတဲ့ ဆက်စပ်မှု (correlation) ပြုလုပ်နိုင်စေပါတယ်။
  * `testNumber` {number} Test ရဲ့ အစဉ်လိုက် (ordinal) နံပါတ်ပါ။
  * `todo` {string|boolean|undefined} [`context.todo`][] ကို ခေါ်ထားရင် ပါဝင်ပါတယ်
  * `skip` {string|boolean|undefined} [`context.skip`][] ကို ခေါ်ထားရင် ပါဝင်ပါတယ်

Test တစ်ခု မအောင်မြင်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံထားပါတယ်။ သက်ဆိုင်တဲ့ execution-ordered event ကတော့ `'test:complete'` ပါ။

### Event: `'test:interrupted'`

* `data` {Object}
  * `tests` {Array} ကြားဖြတ် ရပ်တန့်ခံခဲ့ရတဲ့ (interrupted) tests တွေအကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ objects တွေရဲ့ array ပါ။
    * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
    * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
    * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
    * `name` {string} Test ရဲ့ နာမည်ပါ။
    * `nesting` {number} Test ရဲ့ nesting level ပါ။

Test runner ကို `SIGINT` signal တစ်ခုက ကြားဖြတ်လိုက်တဲ့အခါ (ဥပမာ — `Ctrl`+`C` ကို နှိပ်လိုက်တဲ့အခါ) emit လုပ်ပါတယ်။ ဒီ event မှာ ကြားဖြတ်ခံရတဲ့ အချိန်တုန်းက run နေခဲ့တဲ့ tests တွေအကြောင်း အချက်အလက်တွေ ပါဝင်ပါတယ်။

Process isolation (default) ကို သုံးနေတဲ့အခါ — parent runner က file-level tests တွေကိုသာ သိတာမို့ — test name က file path ဖြစ်ပါလိမ့်မယ်။ `--test-isolation=none` ကို သုံးတဲ့အခါမှာတော့ တကယ့် test name ကို ပြသပါတယ်။

### Event: `'test:log'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `data` {any} [`context.log`][] ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ structured payload ပါ — ဘာမှ မပေးထားဘူးဆိုရင် `undefined` ဖြစ်ပါတယ်။ Test runner က ဒီတန်ဖိုးကို အဓိပ္ပာယ်ကောက်ယူ (interpret) လုပ်မှာ မဟုတ်ပါဘူး။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `message` {string} Log message ပါ။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။
  * `testId` {number} Log message ကို emit လုပ်ခဲ့တဲ့ test instance အတွက် numeric identifier ပါ။

[`context.log`][] ကို ခေါ်တဲ့အခါ emit လုပ်ပါတယ်။ [`'test:diagnostic'`][] နဲ့ မတူပဲ — ဒီ event က tests တွေ execute လုပ်တဲ့ အစီအစဉ်အတိုင်း ချက်ချင်း emit လုပ်တာမို့ — test output တွေကို buffering မလုပ်ပဲ render လုပ်တဲ့ reporters တွေအတွက် သင့်လျော်ပါတယ်။

### Event: `'test:pass'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `details` {Object} ထပ်ဆောင်း execution metadata တွေပါ။
    * `duration_ms` {number} Test ရဲ့ ကြာချိန် (milliseconds) ပါ။
    * `type` {string|undefined} Test ရဲ့ အမျိုးအစားပါ — ဒါက suite ဟုတ်မဟုတ် ဖော်ပြဖို့ သုံးပါတယ်။
    * `attempt` {number|undefined} Test run ရဲ့ attempt နံပါတ်ပါ — [`--test-rerun-failures`][] flag ကို သုံးတဲ့အခါမှသာ ပါဝင်ပါတယ်။
    * `passed_on_attempt` {number|undefined} Test က အောင်မြင်ခဲ့တဲ့ attempt နံပါတ်ပါ — [`--test-rerun-failures`][] flag ကို သုံးတဲ့အခါမှသာ ပါဝင်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ တူညီတဲ့ nesting level မှာ ရှိနေတဲ့ concurrent siblings တွေ အချင်းချင်း ရောယှက်နေတဲ့အခါ custom reporters တွေက lineage (အစဉ်အတန်း) ကို ခြေရာခံနိုင်စေပါတယ်။
  * `tags` {string\[]} Test နဲ့ ၎င်းရဲ့ ancestor suites တွေပေါ်မှာ ကြေညာထားတဲ့ tags တွေကို flatten လုပ်ပြီး lowercase ပြောင်းထားတဲ့ စာရင်းပါ — declaration order အတိုင်း ဖြစ်ပါတယ်။ Tags မရှိတဲ့ tests တွေအတွက်တော့ ဗလာ ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။
  * `testId` {number} ဒီ test instance အတွက် numeric identifier ပါ — test file ရဲ့ process အတွင်းမှာ ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ပါတယ်။ Test instance တစ်ခုတည်းအတွက် events တွေ အားလုံးမှာ တသမတ်တည်း ရှိတာမို့ — custom reporters တွေမှာ ယုံကြည်စိတ်ချရတဲ့ ဆက်စပ်မှု (correlation) ပြုလုပ်နိုင်စေပါတယ်။
  * `testNumber` {number} Test ရဲ့ အစဉ်လိုက် (ordinal) နံပါတ်ပါ။
  * `todo` {string|boolean|undefined} [`context.todo`][] ကို ခေါ်ထားရင် ပါဝင်ပါတယ်
  * `skip` {string|boolean|undefined} [`context.skip`][] ကို ခေါ်ထားရင် ပါဝင်ပါတယ်

Test တစ်ခု အောင်မြင်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံထားပါတယ်။ သက်ဆိုင်တဲ့ execution-ordered event ကတော့ `'test:complete'` ပါ။

### Event: `'test:plan'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `count` {number} Run လုပ်ပြီးသွားတဲ့ subtests အရေအတွက်ပါ။

Test တစ်ခုအတွက် subtests တွေ အားလုံး ပြီးစီးသွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံထားပါတယ်။

### Event: `'test:start'`

* `data` {Object}
  * `column` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ column နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။ Test ကို entry file က import လုပ်ထားတဲ့ module တစ်ခုထဲမှာ သတ်မှတ်ထားရင် `file` နဲ့ ကွဲပြားနိုင်ပါတယ်။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `line` {number|undefined} Test ကို သတ်မှတ်ထားတဲ့ line နံပါတ်ပါ — test ကို REPL ကနေ run လုပ်ခဲ့တယ်ဆိုရင် `undefined` ဖြစ်ပါတယ်။
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `parentId` {number|undefined} ပြင်ပ (enclosing) test ရဲ့ `testId` ပါ — top-level tests တွေအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ တူညီတဲ့ nesting level မှာ ရှိနေတဲ့ concurrent siblings တွေ အချင်းချင်း ရောယှက်နေတဲ့အခါ custom reporters တွေက lineage (အစဉ်အတန်း) ကို ခြေရာခံနိုင်စေပါတယ်။
  * `tags` {string\[]} Test နဲ့ ၎င်းရဲ့ ancestor suites တွေပေါ်မှာ ကြေညာထားတဲ့ tags တွေကို flatten လုပ်ပြီး lowercase ပြောင်းထားတဲ့ စာရင်းပါ — declaration order အတိုင်း ဖြစ်ပါတယ်။ Tags မရှိတဲ့ tests တွေအတွက်တော့ ဗလာ ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။
  * `testId` {number} ဒီ test instance အတွက် numeric identifier ပါ — test file ရဲ့ process အတွင်းမှာ ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ပါတယ်။ Test instance တစ်ခုတည်းအတွက် events တွေ အားလုံးမှာ တသမတ်တည်း ရှိတာမို့ — custom reporters တွေမှာ ယုံကြည်စိတ်ချရတဲ့ ဆက်စပ်မှု (correlation) ပြုလုပ်နိုင်စေပါတယ်။

Test တစ်ခုက ၎င်းရဲ့ ကိုယ်ပိုင်နဲ့ ၎င်းရဲ့ subtests တွေရဲ့ status တွေကို စတင် သတင်းပို့တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံထားပါတယ်။ သက်ဆိုင်တဲ့ execution-ordered event ကတော့ `'test:dequeue'` ပါ။

### Event: `'test:stderr'`

* `data` {Object}
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။
  * `file` {string} Test file ရဲ့ path ပါ။
  * `message` {string} `stderr` ဆီကို ရေးသားလိုက်တဲ့ message ပါ။

Run နေတဲ့ test တစ်ခုက `stderr` ဆီကို ရေးသားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ကို `--test` flag ကို ဖြတ်သန်းပေးထားမှသာ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံချက် မရှိပါဘူး။

### Event: `'test:stdout'`

* `data` {Object}
  * `entryFile` {string|undefined} ဒီ event ကို emit လုပ်ခဲ့တဲ့ child process ရဲ့ entry point အဖြစ် execute လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါမှသာ ပါဝင်ပါတယ်။
  * `file` {string} Test file ရဲ့ path ပါ။
  * `message` {string} `stdout` ဆီကို ရေးသားလိုက်တဲ့ message ပါ။

Run နေတဲ့ test တစ်ခုက `stdout` ဆီကို ရေးသားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ကို `--test` flag ကို ဖြတ်သန်းပေးထားမှသာ emit လုပ်ပါတယ်။ ဒီ event က tests တွေ သတ်မှတ်ထားတဲ့ အစီအစဉ်အတိုင်း emit လုပ်မယ်လို့ အာမခံချက် မရှိပါဘူး။

### Event: `'test:summary'`

* `data` {Object}
  * `counts` {Object} အမျိုးမျိုးသော test ရလဒ်တွေရဲ့ အရေအတွက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။
    * `cancelled` {number} ဖျက်သိမ်းခံခဲ့ရတဲ့ (cancelled) tests စုစုပေါင်း အရေအတွက်ပါ။
    * `failed` {number} မအောင်မြင်ခဲ့တဲ့ (failed) tests စုစုပေါင်း အရေအတွက်ပါ။
    * `passed` {number} အောင်မြင်ခဲ့တဲ့ (passed) tests စုစုပေါင်း အရေအတွက်ပါ။
    * `skipped` {number} Skipped လုပ်ထားတဲ့ tests စုစုပေါင်း အရေအတွက်ပါ။
    * `suites` {number} Run လုပ်ခဲ့တဲ့ suites စုစုပေါင်း အရေအတွက်ပါ။
    * `tests` {number} Suites တွေ မပါဝင်ပဲ run လုပ်ခဲ့တဲ့ tests စုစုပေါင်း အရေအတွက်ပါ။
    * `todo` {number} TODO tests စုစုပေါင်း အရေအတွက်ပါ။
    * `topLevel` {number} Top-level tests နဲ့ suites စုစုပေါင်း အရေအတွက်ပါ။
  * `duration_ms` {number} Test run ရဲ့ ကြာချိန် (milliseconds) ပါ။
  * `file` {string|undefined} Summary ကို ထုတ်လုပ်ခဲ့တဲ့ test file ရဲ့ path ပါ။ Summary က files အများအပြားနဲ့ သက်ဆိုင်နေရင်တော့ ဒီတန်ဖိုးက `undefined` ဖြစ်ပါတယ်။
  * `success` {boolean} Test run ကို အောင်မြင်တယ်လို့ မှတ်ယူသင့်လား မမှတ်ယူသင့်ဘူးလားဆိုတာ ဖော်ပြပါတယ်။ Failing test တစ်ခု (သို့) coverage threshold မပြည့်မီတာလိုမျိုး error အခြေအနေတစ်ခုခု ဖြစ်ပေါ်ခဲ့ရင် ဒီတန်ဖိုးကို `false` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။

Test run တစ်ခု ပြီးစီးသွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event မှာ ပြီးစီးသွားတဲ့ test run နဲ့ သက်ဆိုင်တဲ့ metrics တွေ ပါဝင်ပြီး — test run တစ်ခု အောင်မြင်ခဲ့လား မအောင်မြင်ခဲ့ဘူးလားဆိုတာ ဆုံးဖြတ်ဖို့ အသုံးဝင်ပါတယ်။ Process-level test isolation ကို သုံးထားရင် — နောက်ဆုံး စုစည်းထားတဲ့ (cumulative) summary အပြင် — test file တစ်ခုချင်းစီအတွက်ပါ `'test:summary'` event တစ်ခုစီ ထုတ်လုပ်ပေးပါတယ်။

### Event: `'test:watch:drained'`

Watch mode မှာ execute လုပ်ဖို့ tests တွေ queue ထဲမှာ နောက်ထပ် မရှိတော့တဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'test:watch:restarted'`

Watch mode မှာ file တစ်ခု ပြောင်းလဲမှုကြောင့် tests တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတာတွေ restart လုပ်ခံရတဲ့အခါ emit လုပ်ပါတယ်။

## `getTestContext()`

* Returns: {TestContext|SuiteContext|undefined}

[`TestContext`][] သို့မဟုတ် [`SuiteContext`][] — လက်ရှိ execute လုပ်နေတဲ့ test သို့မဟုတ် suite နဲ့ ဆက်စပ်နေတဲ့ — object ကို ပြန်ပေးပါတယ်။ Test သို့မဟုတ် suite ရဲ့ အပြင်ဘက်ကနေ ခေါ်ရင်တော့ `undefined` ကို ပြန်ပေးပါတယ်။ ဒီ function ကို test သို့မဟုတ် suite function တွေရဲ့ အတွင်း (သို့) ၎င်းတို့အတွင်းက async operations တွေထဲကနေ context အချက်အလက်တွေကို ဝင်ရောက်သုံးစွဲဖို့ သုံးနိုင်ပါတယ်။

```mjs
import { getTestContext } from 'node:test';

test('example test', async () => {
  const ctx = getTestContext();
  console.log(`Running test: ${ctx.name}`);
});

describe('example suite', () => {
  const ctx = getTestContext();
  console.log(`Running suite: ${ctx.name}`);
});
```

Test တစ်ခုကနေ ခေါ်ရင် [`TestContext`][] တစ်ခုကို ပြန်ပေးပါတယ်။ Suite တစ်ခုကနေ ခေါ်ရင်တော့ [`SuiteContext`][] တစ်ခုကို ပြန်ပေးပါတယ်။

Test သို့မဟုတ် suite ရဲ့ အပြင်ဘက်ကနေ ခေါ်ရင် (ဥပမာ — module တစ်ခုရဲ့ top level မှာ သို့မဟုတ် execution ပြီးသွားပြီးနောက် setTimeout callback တစ်ခုထဲမှာ) ဒီ function က `undefined` ကို ပြန်ပေးပါတယ်။

Hook (before, beforeEach, after, afterEach) တစ်ခုရဲ့ အတွင်းကနေ ခေါ်ရင် — ဒီ function က hook နဲ့ ဆက်စပ်နေတဲ့ test သို့မဟုတ် suite ရဲ့ context ကို ပြန်ပေးပါတယ်။

## Test instrumentation နှင့် OpenTelemetry (Test instrumentation and OpenTelemetry)

Test runner က test execution events တွေကို Node.js ရဲ့ [`diagnostics_channel`][] module ကနေတစ်ဆင့် ထုတ်ပြန် (publish) ပါတယ် — test runner ကိုယ်တိုင်ကို ပြောင်းလဲစရာ မလိုပဲ — OpenTelemetry လိုမျိုး observability tools တွေနဲ့ ပေါင်းစည်းနိုင်စေပါတယ်။

### Tracing events များ (Tracing events)

Test runner က events တွေကို `'node.test'` tracing channel ဆီကို ထုတ်ပြန်ပါတယ်။ Subscribers တွေက context တွေကို bind လုပ်ဖို့ (သို့) custom instrumentation တွေ လုပ်ဆောင်ဖို့ [`TracingChannel`][] API ကို သုံးနိုင်ပါတယ်။

#### Channel: `'tracing:node.test:start'`

* `data` {Object}
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — REPL မှာ run နေတဲ့အခါ `undefined` ဖြစ်ပါတယ်။
  * `type` {string} Test ရဲ့ အမျိုးအစားပါ — `'test'` (သို့) `'suite'` ဖြစ်ပါတယ်။

Test (သို့) suite တစ်ခု execution စတင်တဲ့အခါ emit လုပ်ပါတယ်။ Test ရဲ့ span မှာ ၎င်းရဲ့ before, beforeEach နဲ့ afterEach hooks တွေ အားလုံး — test body အပါအဝင် — ပါဝင်ပါတယ်။

#### Channel: `'tracing:node.test:end'`

* `data` {Object}
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — REPL မှာ run နေတဲ့အခါ `undefined` ဖြစ်ပါတယ်။
  * `type` {string} Test ရဲ့ အမျိုးအစားပါ — `'test'` (သို့) `'suite'` ဖြစ်ပါတယ်။

Test (သို့) suite တစ်ခု execution ပြီးဆုံးတဲ့အခါ emit လုပ်ပါတယ်။

#### Channel: `'tracing:node.test:error'`

* `data` {Object}
  * `name` {string} Test ရဲ့ နာမည်ပါ။
  * `nesting` {number} Test ရဲ့ nesting level ပါ။
  * `file` {string|undefined} Test file ရဲ့ path ပါ — REPL မှာ run နေတဲ့အခါ `undefined` ဖြစ်ပါတယ်။
  * `type` {string} Test ရဲ့ အမျိုးအစားပါ — `'test'` (သို့) `'suite'` ဖြစ်ပါတယ်။
  * `error` {Error} Throw လုပ်ခံခဲ့ရတဲ့ error ပါ။

Test (သို့) suite တစ်ခုက error တစ်ခုကို throw လုပ်တဲ့အခါ emit လုပ်ပါတယ်။

### Context propagation with `bindStore()`

`AsyncLocalStorage` instance တစ်ခုကို bind လုပ်ခြင်းအားဖြင့် — tracing channel ကို test execution တစ်လျှောက် context တွေ ပြန့်ပွား (propagate) စေဖို့ သုံးနိုင်ပါတယ်။ ဒါက context တွေကို test function နဲ့ test အတွင်းက async operations တွေ အားလုံးမှာ အလိုအလျောက် ရရှိနိုင်စေပါတယ်။

```mjs
import dc from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const testStorage = new AsyncLocalStorage();
const testChannel = dc.tracingChannel('node.test');

// Bind context to test execution — the returned value becomes the store
testChannel.start.bindStore(testStorage, (data) => {
  return { testName: data.name, startTime: Date.now() };
});

// Optionally handle errors and cleanup
testChannel.error.subscribe((data) => {
  const store = testStorage.getStore();
  console.log(`Test "${data.name}" failed after ${Date.now() - store.startTime}ms`);
});

testChannel.end.subscribe((data) => {
  const store = testStorage.getStore();
  console.log(`Test "${data.name}" completed in ${Date.now() - store.startTime}ms`);
});
```

`bindStore()` ကို သုံးတဲ့အခါ — ပေးလိုက်တဲ့ context က test function နဲ့ test အတွင်းက async operations တွေ အားလုံးဆီကို အလိုအလျောက် ပြန့်ပွားစေပါတယ် — test code ထဲမှာ ထပ်ဆောင်း instrumentation တစ်စုံတစ်ရာ မလိုအပ်ပါဘူး။

## Class: `TestContext`

Test runner နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့အတွက် — test function တစ်ခုစီဆီကို `TestContext` instance တစ်ခုကို ဖြတ်သန်းပေးပါတယ်။ ဒါပေမယ့် `TestContext` constructor ကိုတော့ API ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ထုတ်ဖော်မထားပါဘူး။

### `context.before([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`TestContext`][] object တစ်ခုပါ။ Hook က callbacks တွေကို သုံးရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** no-op function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။
  * `timeout` {number} ဒီ millisecond အရေအတွက် ပြည့်သွားရင် hook က fail ဖြစ်ပါလိမ့်မယ်။ သတ်မှတ်မထားဘူးဆိုရင် subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ဆီကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က လက်ရှိ test ရဲ့ subtests တွေ မလုပ်ဆောင်ခင် run လုပ်မယ့် hook တစ်ခုကို register လုပ်ပါတယ်။

### `context.beforeEach([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`TestContext`][] object တစ်ခုပါ။ Hook က callbacks တွေကို သုံးရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** no-op function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။
  * `timeout` {number} ဒီ millisecond အရေအတွက် ပြည့်သွားရင် hook က fail ဖြစ်ပါလိမ့်မယ်။ သတ်မှတ်မထားဘူးဆိုရင် subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ဆီကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က လက်ရှိ test ရဲ့ subtest တစ်ခုစီ မလုပ်ဆောင်ခင် run လုပ်မယ့် hook တစ်ခုကို register လုပ်ပါတယ်။

```js
test('top level test', async (t) => {
  t.beforeEach((t) => t.diagnostic(`about to run ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      // Some relevant assertion here
    },
  );
});
```

### `context.after([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`TestContext`][] object တစ်ခုပါ။ Hook က callbacks တွေကို သုံးရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** no-op function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။
  * `timeout` {number} ဒီ millisecond အရေအတွက် ပြည့်သွားရင် hook က fail ဖြစ်ပါလိမ့်မယ်။ သတ်မှတ်မထားဘူးဆိုရင် subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ဆီကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က လက်ရှိ test ပြီးဆုံးသွားပြီးနောက် run လုပ်မယ့် hook တစ်ခုကို register လုပ်ပါတယ်။

```js
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  // Some relevant assertion here
});
```

### `context.afterEach([fn][, options])`

* `fn` {Function|AsyncFunction} Hook function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`TestContext`][] object တစ်ခုပါ။ Hook က callbacks တွေကို သုံးရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** no-op function တစ်ခုပါ။
* `options` {Object} Hook အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) hook တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။
  * `timeout` {number} ဒီ millisecond အရေအတွက် ပြည့်သွားရင် hook က fail ဖြစ်ပါလိမ့်မယ်။ သတ်မှတ်မထားဘူးဆိုရင် subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ဆီကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.

ဒီ function က လက်ရှိ test ရဲ့ subtest တစ်ခုစီ ပြီးဆုံးသွားပြီးနောက် run လုပ်မယ့် hook တစ်ခုကို register လုပ်ပါတယ်။

```js
test('top level test', async (t) => {
  t.afterEach((t) => t.diagnostic(`finished running ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      // Some relevant assertion here
    },
  );
});
```

### `context.assert`

`context` နဲ့ ချိတ်ဆက်ထားတဲ့ (bound) assertion methods တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ Test plans တွေ ဖန်တီးဖို့အတွက် — `node:assert` module ရဲ့ top-level functions တွေကို ဒီမှာ ထုတ်ဖော်ထားပါတယ်။

```js
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.fileSnapshot(value, path[, options])`

* `value` {any} String တစ်ခုအဖြစ် serialize လုပ်ရမယ့် တန်ဖိုးပါ။ Node.js ကို [`--test-update-snapshots`][] flag နဲ့ စတင်ခဲ့မယ်ဆိုရင် — serialize လုပ်ထားတဲ့ တန်ဖိုးကို `path` ဆီကို ရေးသားပါတယ်။ မဟုတ်ရင်တော့ serialize လုပ်ထားတဲ့ တန်ဖိုးကို ရှိပြီးသား snapshot file ရဲ့ ပါဝင်မှုတွေနဲ့ နှိုင်းယှဉ်ပါတယ်။
* `path` {string} Serialize လုပ်ထားတဲ့ `value` ကို ရေးသားမယ့် file ပါ။
* `options` {Object} Optional ဖြစ်တဲ့ configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `serializers` {Array} `value` ကို string တစ်ခုအဖြစ် serialize လုပ်ဖို့ သုံးတဲ့ synchronous functions တွေရဲ့ array တစ်ခုပါ။ `value` ကို ပထမဆုံး serializer function ဆီကို တစ်ခုတည်းသော argument အနေနဲ့ ဖြတ်သန်းပေးပါတယ်။ Serializer တစ်ခုချင်းစီရဲ့ return value ကို နောက် serializer တစ်ခုရဲ့ input အဖြစ် ဖြတ်သန်းပေးပါတယ်။ Serializers တွေ အားလုံး run လုပ်ပြီးသွားတာနဲ့ — ရလာတဲ့ တန်ဖိုးကို string တစ်ခုအဖြစ် ပြောင်းလဲ (coerce) လုပ်ပါတယ်။ **Default:** Serializers တွေ မပေးထားဘူးဆိုရင် — test runner ရဲ့ default serializers တွေကို သုံးပါတယ်။

ဒီ function က `value` ကို serialize လုပ်ပြီး — `path` နဲ့ သတ်မှတ်ထားတဲ့ file ထဲကို ရေးသားပါတယ်။

```js
test('snapshot test with default serialization', (t) => {
  t.assert.fileSnapshot({ value1: 1, value2: 2 }, './snapshots/snapshot.json');
});
```

ဒီ function က `context.assert.snapshot()` နဲ့ အောက်ပါ နည်းလမ်းတွေမှာ ကွဲပြားပါတယ်:

* Snapshot file ရဲ့ path ကို user က တိုက်ရိုက် (explicitly) ပေးအပ်ရပါတယ်။
* Snapshot file တစ်ခုချင်းစီကို snapshot တန်ဖိုး တစ်ခုတည်းအတွက်သာ ကန့်သတ်ထားပါတယ်။
* Test runner က ထပ်ဆောင်း escaping (escape ပြုလုပ်ခြင်း) တစ်စုံတစ်ရာကို လုပ်ဆောင်ပေးတာ မရှိပါဘူး။

ဒီ ကွဲပြားမှုတွေက snapshot files တွေကို — syntax highlighting (ကုဒ်ကို အရောင်ခြယ် ပြသခြင်း) လိုမျိုး features တွေကို ပိုမိုကောင်းမွန်စွာ ပံ့ပိုးနိုင်စေပါတယ်။

#### `context.assert.snapshot(value[, options])`

* `value` {any} String တစ်ခုအဖြစ် serialize လုပ်ရမယ့် တန်ဖိုးပါ။ Node.js ကို [`--test-update-snapshots`][] flag နဲ့ စတင်ခဲ့မယ်ဆိုရင် — serialize လုပ်ထားတဲ့ တန်ဖိုးကို snapshot file ထဲကို ရေးသားပါတယ်။ မဟုတ်ရင်တော့ serialize လုပ်ထားတဲ့ တန်ဖိုးကို ရှိပြီးသား snapshot file ထဲက သက်ဆိုင်ရာ တန်ဖိုးနဲ့ နှိုင်းယှဉ်ပါတယ်။
* `options` {Object} Optional ဖြစ်တဲ့ configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `serializers` {Array} `value` ကို string တစ်ခုအဖြစ် serialize လုပ်ဖို့ သုံးတဲ့ synchronous functions တွေရဲ့ array တစ်ခုပါ။ `value` ကို ပထမဆုံး serializer function ဆီကို တစ်ခုတည်းသော argument အနေနဲ့ ဖြတ်သန်းပေးပါတယ်။ Serializer တစ်ခုချင်းစီရဲ့ return value ကို နောက် serializer တစ်ခုရဲ့ input အဖြစ် ဖြတ်သန်းပေးပါတယ်။ Serializers တွေ အားလုံး run လုပ်ပြီးသွားတာနဲ့ — ရလာတဲ့ တန်ဖိုးကို string တစ်ခုအဖြစ် ပြောင်းလဲ (coerce) လုပ်ပါတယ်။ **Default:** Serializers တွေ မပေးထားဘူးဆိုရင် — test runner ရဲ့ default serializers တွေကို သုံးပါတယ်။

ဒီ function က snapshot testing အတွက် assertions တွေကို အကောင်အထည်ဖော်ပေးပါတယ်။

```js
test('snapshot test with default serialization', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('snapshot test with custom serialization', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)`

* `message` {string} အစီရင်ခံရမယ့် message ပါ။

ဒီ function ကို output ဆီကို diagnostic messages တွေ ရေးသားဖို့ သုံးပါတယ်။ Diagnostic အချက်အလက်တွေ မှန်သမျှကို test ရဲ့ ရလဒ်တွေရဲ့ အဆုံးမှာ ထည့်သွင်းပါတယ်။ ဒီ function က တန်ဖိုးတစ်ခုကို ပြန်ပေးတာ မဟုတ်ပါဘူး။

```js
test('top level test', (t) => {
  t.diagnostic('A diagnostic message');
});
```

### `context.log(message[, data])`

* `message` {string} အစီရင်ခံရမယ့် message ပါ။
* `data` {any} Optional အနေနဲ့ message နဲ့ တွဲချိတ်ထားတဲ့ structured payload ပါ။ Test runner က ၎င်းကို ပြုပြင်မွမ်းမံမှု မရှိပဲ (untouched) ဖြတ်သန်းပေးပါတယ်။ Tests တွေကို process isolation နဲ့ run လုပ်တဲ့အခါ — ဒီတန်ဖိုးက [HTML structured clone algorithm][] နဲ့ ကိုက်ညီ (compatible) ရပါမယ်။

ဒီ function ကို output ဆီကို log message တစ်ခု ရေးသားဖို့ သုံးပါတယ်။ [`context.diagnostic`][] နဲ့ မတူပဲ — ရလာတဲ့ [`'test:log'`][] event ကို test က ၎င်းရဲ့ ရလဒ်တွေကို အစီရင်ခံတဲ့အထိ buffer လုပ်ထားမယ့်အစား — tests တွေ execute လုပ်တဲ့ အစီအစဉ်အတိုင်း ချက်ချင်း emit လုပ်ပါတယ်။ ဒီ function က တန်ဖိုးတစ်ခုကို ပြန်ပေးတာ မဟုတ်ပါဘူး။

```js
test('top level test', (t) => {
  t.log('fetched user', { userId: 42 });
  t.log('retrying flaky endpoint', { attempt: 3 });
});
```

### `context.filePath`

လက်ရှိ test ကို ဖန်တီးခဲ့တဲ့ test file ရဲ့ absolute path (အကြွင်းမဲ့ လမ်းကြောင်း) ပါ။ Test file တစ်ခုက — tests တွေကို ထုတ်လုပ်ပေးတဲ့ — ထပ်ဆောင်း modules တွေကို import လုပ်ထားရင် — import လုပ်လိုက်တဲ့ tests တွေက root test file ရဲ့ path ကို ပြန်ပေးပါလိမ့်မယ်။

### `context.fullName`

Test ရဲ့ နာမည်နဲ့ ၎င်းရဲ့ ancestors (ရှေ့ဆက်အဆင့်များ) တစ်ခုချင်းစီရဲ့ နာမည်တွေကို `>` နဲ့ ခြားပြထားတဲ့ အမည်ပါ။

### `context.name`

Test ရဲ့ နာမည်ပါ။

### `context.passed`

* Type: {boolean} Test ကို execute မလုပ်ရသေးခင် — ဥပမာ `beforeEach` hook တစ်ခုအတွင်းမှာ — `false` ဖြစ်ပါတယ်။

Test က အောင်မြင်ခဲ့လားဆိုတာကို ဖော်ပြပါတယ်။

### `context.error`

* Type: {Error|null}

Test/case ရဲ့ failure (မအောင်မြင်မှု) အကြောင်းရင်းပါ — `context.error.cause` ကနေတစ်ဆင့် ထုပ်ပိုးထားတဲ့ပုံစံ (wrapped) နဲ့ ရယူနိုင်ပါတယ်။

### `context.attempt`

* Type: {number}

Test ရဲ့ attempt (ကြိုးစားမှု) အမှတ်စဉ်ပါ။ ဒီတန်ဖိုးက zero-based ဖြစ်လို့ ပထမဆုံး attempt က `0`, ဒုတိယ attempt က `1` စသဖြင့် ဖြစ်ပါတယ်။ Test က လက်ရှိ run နေတဲ့ attempt က ဘယ်ဟာလဲဆိုတာ ဆုံးဖြတ်ဖို့အတွက် — ဒီ property က `--test-rerun-failures` option နဲ့ တွဲသုံးတဲ့အခါ အသုံးဝင်ပါတယ်။

### `context.tags`

> Stability: 1.0 - Early development

* Type: {string\[]}

Test ရဲ့ — ancestor suites တွေကနေ အမွေဆက်ခံထားတဲ့ tags တွေ အပါအဝင် — flattened (အဆင့်လိုက် ဖြန့်ချ) လုပ်ထားပြီး lowercase ပြောင်းထားတဲ့ tags တွေကို declaration order နဲ့ ပါဝင်တဲ့ frozen array (ပြောင်းလဲ၍မရသော array) တစ်ခုပါ။ Test မှာ tags တွေ မရှိဘူးဆိုရင် ဗလာ (empty) ဖြစ်ပါတယ်။ [Test tags][] ကို ကြည့်ပါ။

### `context.workerId`

* Type: {number|undefined}

လက်ရှိ test file ကို run နေတဲ့ worker ရဲ့ ထူးခြားတဲ့ identifier (ခွဲခြားသတ်မှတ်ချက်) ပါ။ ဒီတန်ဖိုးကို `NODE_TEST_WORKER_ID` environment variable ကနေ ဆင်းသက် (derive) လုပ်ထားပါတယ်။ Tests တွေကို `--test-isolation=process` (default) နဲ့ run လုပ်တဲ့အခါ — test file တစ်ခုချင်းစီက သီးခြား child process တစ်ခုအတွင်းမှာ run လုပ်ပြီး — N က တစ်ပြိုင်နက် run နေတဲ့ workers အရေအတွက် ဖြစ်တဲ့ — worker ID 1 ကနေ N အထိ သတ်မှတ်ပေးပါတယ်။ `--test-isolation=none` နဲ့ run လုပ်တဲ့အခါမှာတော့ tests တွေ အားလုံးက process တစ်ခုတည်းထဲမှာ run လုပ်ပြီး — worker ID က အမြဲတမ်း 1 ပါ။ Test context တစ်ခုအတွင်းမှာ run မလုပ်တဲ့အခါ ဒီတန်ဖိုးက `undefined` ဖြစ်ပါတယ်။

ဒီ property က — တစ်ပြိုင်နက် run နေတဲ့ test files တွေကြားမှာ resources တွေ (database connections သို့မဟုတ် server ports လိုမျိုး) ကို ခွဲဝေပေးဖို့အတွက် အသုံးဝင်ပါတယ်:

```mjs
import { test } from 'node:test';
import { process } from 'node:process';

test('database operations', async (t) => {
  // Worker ID is available via context
  console.log(`Running in worker ${t.workerId}`);

  // Or via environment variable (available at import time)
  const workerId = process.env.NODE_TEST_WORKER_ID;
  // Use workerId to allocate separate resources per worker
});
```

### `context.plan(count[,options])`

* `count` {number} Run လုပ်ဖို့ မျှော်လင့်ထားတဲ့ assertions နဲ့ subtests အရေအတွက်ပါ။
* `options` {Object} Plan အတွက် ထပ်ဆောင်း options တွေပါ။
  * `wait` {boolean|number} Plan အတွက် စောင့်ဆိုင်းချိန်ပါ:
    * `true` ဆိုရင် — plan က assertions နဲ့ subtests တွေ အားလုံး run ဖြစ်ဖို့အတွက် ကန့်သတ်ချက် မရှိပဲ (indefinitely) စောင့်ဆိုင်းပါတယ်။
    * `false` ဆိုရင် — plan က test function ပြီးဆုံးသွားပြီးနောက်မှာ — ဆိုင်းငံ့ထားတဲ့ (pending) assertions သို့မဟုတ် subtests တွေကို မစောင့်ပဲ — ချက်ချင်း စစ်ဆေးမှုတစ်ခုကို လုပ်ဆောင်ပါတယ်။ ဒီစစ်ဆေးမှု ပြီးမှ ပြီးဆုံးသွားတဲ့ assertions သို့မဟုတ် subtests တွေကိုတော့ plan ဆီမှာ ရေတွက်မှာ မဟုတ်ပါဘူး။
    * နံပါတ် (number) တစ်ခုဆိုရင် — မျှော်လင့်ထားတဲ့ assertions နဲ့ subtests တွေ ကိုက်ညီမှု ရှိမရှိ စောင့်ဆိုင်းရာမှာ — အချိန်ကုန်သွားခင် (timing out) အထိ စောင့်ဆိုင်းနိုင်တဲ့ အများဆုံး အချိန်ကို millisecond နဲ့ သတ်မှတ်ပေးပါတယ်။ Timeout ကို ရောက်ရှိသွားရင် test က fail ဖြစ်ပါလိမ့်မယ်။
      **Default:** `false`.

ဒီ function ကို test အတွင်းမှာ run လုပ်ဖို့ မျှော်လင့်ထားတဲ့ assertions နဲ့ subtests အရေအတွက်ကို သတ်မှတ်ဖို့ သုံးပါတယ်။ Run ဖြစ်တဲ့ assertions နဲ့ subtests အရေအတွက်က မျှော်လင့်ထားတဲ့ အရေအတွက်နဲ့ မကိုက်ညီဘူးဆိုရင် test က fail ဖြစ်ပါလိမ့်မယ်။

> Note: Assertions တွေကို ခြေရာခံနိုင်ဖို့အတွက် — `assert` ကို တိုက်ရိုက် သုံးမယ့်အစား — `t.assert` ကို သုံးရပါမယ်။

```js
test('top level test', (t) => {
  t.plan(2);
  t.assert.ok('some relevant assertion here');
  t.test('subtest', () => {});
});
```

Asynchronous code တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — `plan` function ကို သုံးပြီး မှန်ကန်တဲ့ အရေအတွက်ရှိတဲ့ assertions တွေ run ဖြစ်ကြောင်း သေချာစေနိုင်ပါတယ်:

```js
test('planning with streams', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```

`wait` option ကို သုံးတဲ့အခါ — test က မျှော်လင့်ထားတဲ့ assertions တွေအတွက် ဘယ်လောက်ကြာအောင် စောင့်မယ်ဆိုတာကို ထိန်းချုပ်နိုင်ပါတယ်။ ဥပမာ — အများဆုံး စောင့်ဆိုင်းချိန်တစ်ခု သတ်မှတ်လိုက်တာက — asynchronous assertions တွေ သတ်မှတ်ထားတဲ့ အချိန်ဘောင်အတွင်းမှာ ပြီးဆုံးဖို့အတွက် — test က စောင့်ဆိုင်းပေးကြောင်း သေချာစေပါတယ်:

```js
test('plan with wait: 2000 waits for async assertions', (t) => {
  t.plan(1, { wait: 2000 }); // Waits for up to 2 seconds for the assertion to complete.

  const asyncActivity = () => {
    setTimeout(() => {
      t.assert.ok(true, 'Async assertion completed within the wait time');
    }, 1000); // Completes after 1 second, within the 2-second wait time.
  };

  asyncActivity(); // The test will pass because the assertion is completed in time.
});
```

Note: `wait` timeout တစ်ခု သတ်မှတ်ထားရင် — အဲဒါက test function ကို execute လုပ်ပြီးဆုံးသွားမှသာ နောက်ပြန် ရေတွက်ခြင်း (count down) ကို စတင်ပါတယ်။

### `context.runOnly(shouldRunOnlyTests)`

* `shouldRunOnlyTests` {boolean} `only` tests တွေကို run လုပ်ရမလား မလုပ်ရဘူးလားဆိုတာပါ။

`shouldRunOnlyTests` က truthy ဖြစ်နေရင် — test context က `only` option သတ်မှတ်ထားတဲ့ tests တွေကိုသာ run လုပ်ပါလိမ့်မယ်။ မဟုတ်ရင်တော့ tests တွေ အားလုံးကို run လုပ်ပါတယ်။ Node.js ကို [`--test-only`][] command-line option နဲ့ မစတင်ထားဘူးဆိုရင် — ဒီ function က no-op (ဘာမျှ မလုပ်ပဲ နေခြင်း) ဖြစ်ပါတယ်။

```js
test('top level test', (t) => {
  // The test context can be set to run subtests with the 'only' option.
  t.runOnly(true);
  return Promise.all([
    t.test('this subtest is now skipped'),
    t.test('this subtest is run', { only: true }),
  ]);
});
```

### `context.signal`

* Type: {AbortSignal}

Test ကို abort လုပ်လိုက်တဲ့အခါ — test ရဲ့ subtasks တွေကို abort လုပ်ဖို့အတွက် သုံးနိုင်ပါတယ်။

```js
test('top level test', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```

### `context.skip([message])`

* `message` {string} Optional ဖြစ်တဲ့ skip message ပါ။

ဒီ function က test ရဲ့ output မှာ test ကို skipped (ကျော်လိုက်သည်) အဖြစ် ဖော်ပြစေပါတယ်။ `message` ပေးထားရင် — အဲဒါကို output ထဲမှာ ထည့်သွင်းပါတယ်။ `skip()` ကို ခေါ်လိုက်တာက test function ရဲ့ လုပ်ဆောင်မှုကို အဆုံးသတ်ပေးတာ မဟုတ်ပါဘူး။ ဒီ function က တန်ဖိုးတစ်ခုကို ပြန်ပေးတာ မဟုတ်ပါဘူး။

```js
test('top level test', (t) => {
  // Make sure to return here as well if the test contains additional logic.
  t.skip('this is skipped');
});
```

### `context.todo([message])`

* `message` {string} Optional ဖြစ်တဲ့ `TODO` message ပါ။

ဒီ function က test ရဲ့ output ဆီကို `TODO` directive တစ်ခုကို ထည့်သွင်းပေးပါတယ်။ `message` ပေးထားရင် — အဲဒါကို output ထဲမှာ ထည့်သွင်းပါတယ်။ `todo()` ကို ခေါ်လိုက်တာက test function ရဲ့ လုပ်ဆောင်မှုကို အဆုံးသတ်ပေးတာ မဟုတ်ပါဘူး။ ဒီ function က တန်ဖိုးတစ်ခုကို ပြန်ပေးတာ မဟုတ်ပါဘူး။

```js
test('top level test', (t) => {
  // This test is marked as `TODO`
  t.todo('this is a todo');
});
```

### `context.test([name][, options][, fn])`

* `name` {string} Test ရလဒ်တွေကို အစီရင်ခံတဲ့အခါ ပြသပေးတဲ့ subtest ရဲ့ နာမည်ပါ။ **Default:** `fn` ရဲ့ `name` property ဖြစ်ပြီး — `fn` မှာ နာမည် မရှိဘူးဆိုရင် `'<anonymous>'` ဖြစ်ပါတယ်။
* `options` {Object} Subtest အတွက် configuration options တွေပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `concurrency` {number|boolean|null} နံပါတ်တစ်ခု ပေးထားရင် — အဲဒီအရေအတွက်လောက်ရှိတဲ့ tests တွေက asynchronously run လုပ်ပါလိမ့်မယ် (၎င်းတို့ကို single-threaded event loop က ဆက်လက် စီမံပါသေးတယ်)။ `true` ဆိုရင် — subtests တွေ အားလုံးကို parallel အနေနဲ့ run လုပ်ပါလိမ့်မယ်။ `false` ဆိုရင် — တစ်ကြိမ်မှာ test တစ်ခုတည်းကိုသာ run လုပ်ပါလိမ့်မယ်။ သတ်မှတ်မထားဘူးဆိုရင် subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ဆီကနေ အမွေဆက်ခံပါတယ်။ **Default:** `null`.
  * `only` {boolean} Truthy ဖြစ်ပြီး — test context ကို `only` tests တွေ run လုပ်ဖို့ configure လုပ်ထားရင် — ဒီ test ကို run လုပ်ပါလိမ့်မယ်။ မဟုတ်ရင်တော့ test ကို skip လုပ်ပါတယ်။ **Default:** `false`.
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) test တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။
  * `skip` {boolean|string} Truthy ဖြစ်ရင် test ကို skip လုပ်ပါတယ်။ String တစ်ခု ပေးထားရင် — အဲဒီ string ကို test ကို skip လုပ်ရတဲ့ အကြောင်းရင်းအနေနဲ့ test ရလဒ်တွေမှာ ပြသပါတယ်။ **Default:** `false`.
  * `tags` {string\[]} Subtest နဲ့ ဆက်စပ်နေတဲ့ string labels တွေရဲ့ array တစ်ခုပါ။ ဘယ် tests တွေ run မလဲဆိုတာကို စစ်ထုတ်ဖို့ [`--experimental-test-tag-filter`][] နဲ့ တွဲသုံးပါတယ်။ Tags တွေက parent test သို့မဟုတ် suite ဆီကနေ union (ပေါင်းစည်းမှု) အားဖြင့် အမွေဆက်ခံပါတယ်။ [Test tags][] ကို ကြည့်ပါ။ **Default:** `[]`.
  * `todo` {boolean|string} Truthy ဖြစ်ရင် test ကို `TODO` အဖြစ် မှတ်သားပါတယ်။ String တစ်ခု ပေးထားရင် — အဲဒီ string ကို test က ဘာကြောင့် `TODO` ဖြစ်နေလဲဆိုတဲ့ အကြောင်းရင်းအနေနဲ့ test ရလဒ်တွေမှာ ပြသပါတယ်။ **Default:** `false`.
  * `timeout` {number} ဒီ millisecond အရေအတွက် ပြည့်သွားရင် test က fail ဖြစ်ပါလိမ့်မယ်။ သတ်မှတ်မထားဘူးဆိုရင် subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ဆီကနေ အမွေဆက်ခံပါတယ်။ **Default:** `Infinity`.
  * `plan` {number} Test ထဲမှာ run လုပ်ဖို့ မျှော်လင့်ထားတဲ့ assertions နဲ့ subtests အရေအတွက်ပါ။ Test ထဲမှာ run ဖြစ်တဲ့ assertions အရေအတွက်က plan မှာ သတ်မှတ်ထားတဲ့ အရေအတွက်နဲ့ မကိုက်ညီဘူးဆိုရင် test က fail ဖြစ်ပါလိမ့်မယ်။ **Default:** `undefined`.
* `fn` {Function|AsyncFunction} စမ်းသပ်ခံနေရတဲ့ (under test) function ပါ။ ဒီ function ရဲ့ ပထမဆုံး argument က [`TestContext`][] object တစ်ခုပါ။ Test က callbacks တွေကို သုံးရင် — callback function ကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ **Default:** no-op function တစ်ခုပါ။
* Returns: {Promise} Test ပြီးဆုံးသွားတာနဲ့ `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

ဒီ function ကို လက်ရှိ test ရဲ့ အောက်မှာ subtests တွေကို ဖန်တီးဖို့ သုံးပါတယ်။ ဒီ function က top level [`test()`][] function နဲ့ အတူတူပဲ ပြုမူပါတယ်။

```js
test('top level test', async (t) => {
  await t.test(
    'This is a subtest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('some relevant assertion here');
    },
  );
});
```

### `context.waitFor(condition[, options])`

* `condition` {Function|AsyncFunction} ၎င်း အောင်မြင်စွာ ပြီးဆုံးသွားတဲ့အထိ သို့မဟုတ် သတ်မှတ်ထားတဲ့ polling timeout ကုန်ဆုံးသွားတဲ့အထိ — အခါအားလျော်စွာ ခေါ်ယူခံရတဲ့ assertion function တစ်ခုပါ။ အောင်မြင်စွာ ပြီးဆုံးခြင်းဆိုတာက — throw မလုပ်ခြင်း သို့မဟုတ် reject မလုပ်ခြင်းကို ဆိုလိုပါတယ်။ ဒီ function က arguments တွေကို လက်ခံတာ မဟုတ်ပဲ — မည်သည့် တန်ဖိုးကိုမဆို ပြန်ပေးဖို့ ခွင့်ပြုထားပါတယ်။
* `options` {Object} Polling လုပ်ဆောင်မှုအတွက် optional configuration object တစ်ခုပါ။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `interval` {number} `condition` ကို ခေါ်လို့ မအောင်မြင်ခဲ့ပြီးနောက် — ပြန်လည် ကြိုးစားခင် — စောင့်ဆိုင်းရမယ့် millisecond အရေအတွက်ပါ။ **Default:** `50`.
  * `timeout` {number} Poll လုပ်ချိန် timeout ကို millisecond နဲ့ သတ်မှတ်ပါတယ်။ ဒီအချိန် ကုန်ဆုံးသွားတဲ့အထိ `condition` က မအောင်မြင်ခဲ့ဘူးဆိုရင် error တစ်ခု ဖြစ်ပေါ်ပါတယ်။ **Default:** `1000`.
* Returns: {Promise} `condition` က ပြန်ပေးတဲ့ တန်ဖိုးနဲ့ fulfill ဖြစ်ပါတယ်။

ဒီ method က `condition` function တစ်ခုကို — အဲဒီ function က အောင်မြင်စွာ ပြန်ပေးတဲ့အထိ သို့မဟုတ် လုပ်ဆောင်မှုက အချိန်ကုန်သွားတဲ့အထိ — ထပ်ခါထပ်ခါ စစ်ဆေး (poll) လုပ်ပါတယ်။

## Class: `SuiteContext`

Test runner နဲ့ အပြန်အလှန် ဆက်သွယ်နိုင်ဖို့အတွက် — suite function တစ်ခုချင်းစီဆီကို `SuiteContext` တစ်ခုရဲ့ instance ကို ဖြတ်သန်းပေးပါတယ်။ သို့သော်လည်း — `SuiteContext` constructor ကို API ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ ထုတ်ဖော်ထားတာ မဟုတ်ပါဘူး။

### `context.filePath`

လက်ရှိ suite ကို ဖန်တီးခဲ့တဲ့ test file ရဲ့ absolute path ပါ။ Test file တစ်ခုက — suites တွေကို ထုတ်လုပ်ပေးတဲ့ — ထပ်ဆောင်း modules တွေကို import လုပ်ထားရင် — import လုပ်လိုက်တဲ့ suites တွေက root test file ရဲ့ path ကို ပြန်ပေးပါလိမ့်မယ်။

### `context.fullName`

Suite ရဲ့ နာမည်နဲ့ ၎င်းရဲ့ ancestors တစ်ခုချင်းစီရဲ့ နာမည်တွေကို `>` နဲ့ ခြားပြထားတဲ့ အမည်ပါ။

### `context.name`

Suite ရဲ့ နာမည်ပါ။

### `context.signal`

* Type: {AbortSignal}

Test ကို abort လုပ်လိုက်တဲ့အခါ — test ရဲ့ subtasks တွေကို abort လုပ်ဖို့အတွက် သုံးနိုင်ပါတယ်။

### `context.passed`

* Type: {boolean}

Suite နဲ့ ၎င်းရဲ့ subtests တွေ အားလုံး pass ဖြစ်ခဲ့လားဆိုတာကို ဖော်ပြပါတယ်။

### `context.attempt`

* Type: {number}

Suite ရဲ့ attempt အမှတ်စဉ်ပါ။ ဒီတန်ဖိုးက zero-based ဖြစ်လို့ ပထမဆုံး attempt က `0`, ဒုတိယ attempt က `1` စသဖြင့် ဖြစ်ပါတယ်။ လက်ရှိ run ရဲ့ attempt အမှတ်စဉ်ကို ဆုံးဖြတ်ဖို့အတွက် — ဒီ property က `--test-rerun-failures` option နဲ့ တွဲသုံးတဲ့အခါ အသုံးဝင်ပါတယ်။

### `context.diagnostic(message)`

* `message` {string} Output လုပ်ရမယ့် diagnostic message ပါ။

Diagnostic message တစ်ခုကို output လုပ်ပါတယ်။ ဒါကို ပုံမှန်အားဖြင့် လက်ရှိ suite သို့မဟုတ် ၎င်းရဲ့ tests တွေအကြောင်း အချက်အလက်တွေကို log လုပ်ဖို့အတွက် သုံးပါတယ်။

```js
test.describe('my suite', (suite) => {
  suite.diagnostic('Suite diagnostic message');
});
```

### `context.log(message[, data])`

* `message` {string} အစီရင်ခံရမယ့် message ပါ။
* `data` {any} Optional အနေနဲ့ message နဲ့ တွဲချိတ်ထားတဲ့ structured payload ပါ။ Test runner က ၎င်းကို ပြုပြင်မွမ်းမံမှု မရှိပဲ ဖြတ်သန်းပေးပါတယ်။

Log message တစ်ခုကို output ဆီကို ရေးသားပါတယ်။ ရလာတဲ့ [`'test:log'`][] event ကို tests တွေ execute လုပ်တဲ့ အစီအစဉ်အတိုင်း ချက်ချင်း emit လုပ်ပါတယ်။

```js
test.describe('my suite', (suite) => {
  suite.log('Suite log message');
});
```

[HTML structured clone algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
[TAP]: https://testanything.org/
[Test tags]: #test-tags
[`'test:complete'`]: #event-testcomplete
[`'test:coverage'`]: #event-testcoverage
[`'test:dequeue'`]: #event-testdequeue
[`'test:diagnostic'`]: #event-testdiagnostic
[`'test:enqueue'`]: #event-testenqueue
[`'test:fail'`]: #event-testfail
[`'test:interrupted'`]: #event-testinterrupted
[`'test:log'`]: #event-testlog
[`'test:pass'`]: #event-testpass
[`'test:plan'`]: #event-testplan
[`'test:start'`]: #event-teststart
[`'test:stderr'`]: #event-teststderr
[`'test:stdout'`]: #event-teststdout
[`'test:summary'`]: #event-testsummary
[`'test:watch:drained'`]: #event-testwatchdrained
[`'test:watch:restarted'`]: #event-testwatchrestarted
[`--experimental-test-coverage`]: cli.md#--experimental-test-coverage
[`--experimental-test-module-mocks`]: cli.md#--experimental-test-module-mocks
[`--experimental-test-tag-filter`]: cli.md#--experimental-test-tag-filtertag
[`--import`]: cli.md#--importmodule
[`--no-strip-types`]: cli.md#--no-strip-types
[`--test-concurrency`]: cli.md#--test-concurrency
[`--test-coverage-exclude`]: cli.md#--test-coverage-exclude
[`--test-coverage-include`]: cli.md#--test-coverage-include
[`--test-name-pattern`]: cli.md#--test-name-pattern
[`--test-only`]: cli.md#--test-only
[`--test-reporter-destination`]: cli.md#--test-reporter-destination
[`--test-reporter`]: cli.md#--test-reporter
[`--test-rerun-failures`]: cli.md#--test-rerun-failures
[`--test-skip-pattern`]: cli.md#--test-skip-pattern
[`--test-update-snapshots`]: cli.md#--test-update-snapshots
[`--test`]: cli.md#--test
[`MockFunctionContext`]: #class-mockfunctioncontext
[`MockPropertyContext`]: #class-mockpropertycontext
[`MockTimers`]: #class-mocktimers
[`MockTracker.method`]: #mockmethodobject-methodname-implementation-options
[`MockTracker`]: #class-mocktracker
[`NODE_V8_COVERAGE`]: cli.md#node_v8_coveragedir
[`SuiteContext`]: #class-suitecontext
[`TestContext`]: #class-testcontext
[`TracingChannel`]: diagnostics_channel.md#class-tracingchannel
[`assert.throws`]: assert.md#assertthrowsfn-error-message
[`context.diagnostic`]: #contextdiagnosticmessage
[`context.log`]: #contextlogmessage-data
[`context.skip`]: #contextskipmessage
[`context.tags`]: #contexttags
[`context.todo`]: #contexttodomessage
[`describe()`]: #describename-options-fn
[`diagnostics_channel`]: diagnostics_channel.md
[`glob(7)`]: https://man7.org/linux/man-pages/man7/glob.7.html
[`it()`]: #itname-options-fn
[`run()`]: #runoptions
[`suite()`]: #suitename-options-fn
[`test()`]: #testname-options-fn
[code coverage]: #collecting-code-coverage
[configuration files]: cli.md#--experimental-config-filepath---experimental-config-file
[describe options]: #describename-options-fn
[it options]: #testname-options-fn
[module customization hooks]: module.md#customization-hooks
[running tests from the command line]: #running-tests-from-the-command-line
[stream.compose]: stream.md#streamcomposestreams
[subtests]: #subtests
[suite options]: #suitename-options-fn
[test reporters]: #test-reporters
[test runner execution model]: #test-runner-execution-model
