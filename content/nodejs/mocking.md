---
title: "Testing တွင် Mocking (Mocking in Tests)"
description: "Test တွေမှာ mocking လုပ်နည်း — ဘယ်အခါ mock လုပ်ရမလဲ (own code / external code / external system), mock.fn()/mock.module(), undici နဲ့ fetch mocking, mock.timers နဲ့ အချိန်ကို ထိန်းချုပ်ခြင်း"
order: 63
source: "https://nodejs.org/learn/test-runner/mocking"
status: translated
updated: 2026-09-02
---

**Mocking** ဆိုတာ — တကယ့်အရာရဲ့ အစားထိုး ပုံတူ (facsimile)၊ ရုပ်သေး (puppet) တစ်ခုကို ဖန်တီးတဲ့ နည်းလမ်းပါ။ ယေဘုယျအားဖြင့် — "when 'a', do 'b'" ('a' ဆိုရင် 'b' လုပ်ပါ) ဆိုတဲ့ ပုံစံမျိုးနဲ့ ရုပ်သေးဆွဲခြင်းပါ။ ရည်ရွယ်ချက်က — လှုပ်ရှားနေတဲ့ အစိတ်အပိုင်း (moving pieces) အရေအတွက်ကို ကန့်သတ်ပြီး "အရေးမကြီးတဲ့" အရာတွေကို ထိန်းချုပ်ဖို့ပါ။ နည်းပညာအရဆိုရင် "mocks" နဲ့ "stubs" တွေက "test doubles" ရဲ့ မတူညီတဲ့ အမျိုးအစားတွေပါ — stub က ဘာမှ မလုပ်တဲ့ (no-op) အစားထိုးတစ်ခုဖြစ်ပြီး သူ့ကို ခေါ်လိုက်တယ်ဆိုတာကိုပဲ မှတ်တမ်းတင်ပါတယ်။ Mock ကတော့ — fake implementation (when 'a', do 'b' အပိုင်း) ပါတဲ့ stub တစ်မျိုးပါ။ ဒီ document ထဲမှာတော့ ဒီကွာခြားချက်က အရေးမကြီးတာမို့ — stubs တွေကိုပါ mocks လို့ပဲ ခေါ်သွားပါမယ်။

Tests တွေက **deterministic** ဖြစ်သင့်ပါတယ် — ဘယ်လို order နဲ့ပဲ run လုပ် run၊ အကြိမ်ဘယ်လောက်ပဲ run လုပ် run — တူညီတဲ့ ရလဒ်ကိုပဲ အမြဲ ထုတ်ပေးရပါတယ်။ မှန်ကန်တဲ့ setup နဲ့ mocking က ဒါကို ဖြစ်နိုင်စေပါတယ်။ Node.js က code အပိုင်းအစ အမျိုးမျိုးကို mock လုပ်ဖို့ နည်းလမ်း အများကြီး ထောက်ပံ့ပေးထားပါတယ်။

ဒီ article က အောက်ပါ test အမျိုးအစားတွေနဲ့ ပတ်သက်ပါတယ်:

| Test type | ဖော်ပြချက် | ဥပမာ | Mock လုပ်ရမယ့် အရာများ |
|---|---|---|---|
| unit | သီးခြား ခွဲထုတ်လို့ရတဲ့ အသေးငယ်ဆုံး code အပိုင်း | `const sum = (a, b) => a + b` | own code, external code, external system |
| component | unit + dependencies | `const arithmetic = (op = sum, a, b) => ops[op](a, b)` | external code, external system |
| integration | components တွေ တစ်ခုနဲ့တစ်ခု ဆက်မိပုံ | — | external code, external system |
| end-to-end (e2e) | app + external data stores, delivery စသည် | Fake user တစ်ယောက် (ဥပမာ Playwright agent) က real external systems တွေနဲ့ ချိတ်ထားတဲ့ app ကို တကယ်သုံးခြင်း | none (mock မလုပ်ရ) |

ဘယ်အချိန်မှာ mock လုပ်ရမလဲ၊ ဘယ်အချိန်မှာ မလုပ်ရဘူးလဲ ဆိုတာနဲ့ ပတ်သက်ပြီး — အတွေးအခေါ် ကျောင်းများစွာ ရှိပါတယ်။ အကြမ်းဖျင်း အောက်မှာ ဖော်ပြထားပါတယ်။

## ဘယ်အခါ mock လုပ်ရမလဲ၊ ဘယ်အခါ မလုပ်ရဘူးလဲ

Mock လုပ်ဖို့ စဉ်းစားလေ့ရှိတဲ့ အဓိက အရာ ၃ မျိုး ရှိပါတယ်:

1. Own code (ကိုယ့် project က ထိန်းချုပ်ထားတဲ့ code)
2. External code (project က မထိန်းချုပ်တဲ့ code — npm dependency တွေလို)
3. External system (database, browser/OS environment, file system, memory store စသည်)

### Own code

ဒါက ကိုယ့် project က ထိန်းချုပ်ထားတဲ့ code ပါ:

```js
import foo from './foo.mjs';

export function main() {
  const f = foo();
}
```

ဒီမှာ `foo` က `main` ရဲ့ "own code" dependency ပါ။

**ဘာကြောင့် mock လုပ်သလဲ** — `main` ကို တကယ့် unit test လုပ်ဖို့ဆိုရင် `foo` ကို mock လုပ်သင့်ပါတယ်: ကိုယ်က `main` အလုပ်လုပ်လား ဆိုတာကို စစ်နေတာပါ — `main` + `foo` ပေါင်းပြီး အလုပ်လုပ်လားဆိုတာ မဟုတ်ပါဘူး (အဲဒါက တခြား test တစ်ခုပါ)။

**ဘာကြောင့် မလုပ်သင့်ဘူးလဲ** — `foo` ကို mock လုပ်တာက ရကျိုးနပ်မှု ထက်မက ပင်ပန်းနိုင်ပါတယ် — အထူးသဖြင့် `foo` က ရိုးရှင်းပြီး ကောင်းကောင်း test လုပ်ထားပြီးသား၊ ခဏခဏ မပြောင်းတဲ့ function ဆိုရင်ပါ။ `foo` ကို mock မလုပ်တာက ပိုကောင်းနိုင်တယ် — ဘာလို့လဲဆိုရင် ပိုစစ်မှန်ပြီး (`main` ရဲ့ tests တွေက `foo` ကိုပါ အတည်ပြုပေးလို့) `foo` ရဲ့ coverage ကို တိုးစေလို့ပါ။ ဒါပေမယ့် — ဒါက noise တွေ ဖန်တီးနိုင်ပါတယ်: `foo` မှားသွားရင် တခြား test တစ်စုကြီးပါ မှားသွားတတ်လို့ — ပြဿနာရင်းကို ရှာရ ပိုပင်ပန်းပါတယ်။ ပြဿနာ တကယ့်ရင်းမြစ်ဖြစ်တဲ့ အရာအတွက် test တစ်ခုတည်းပဲ fail နေရင် — အလွန် လွယ်လွယ်နဲ့ မြင်ရပေမယ့် — test ၁၀၀ fail နေရင်တော့ ကောက်ရိုးပုံထဲက အပ်ရှာရသလို ဖြစ်သွားပါတယ်။

### External code

ဒါက ကိုယ့် project က မထိန်းချုပ်တဲ့ code ပါ:

```js
import bar from 'bar';

export function main() {
  const f = bar();
}
```

ဒီမှာ `bar` က external package — ဥပမာ npm dependency တစ်ခုပါ။

**ဘာကြောင့် mock လုပ်သလဲ** — unit tests တွေအတွက်ဆိုရင် ဒါကို အမြဲ mock လုပ်သင့်ပါတယ် (အငြင်းပွားစရာ မရှိပါဘူး)။ ကိုယ့် project က ထိန်းသိမ်းမထားတဲ့ code အလုပ်လုပ်လားဆိုတာ စစ်ဆေးတာက unit test ရဲ့ ရည်ရွယ်ချက် မဟုတ်ပါဘူး (အဲဒီ code က သူ့ကိုယ်ပိုင် tests တွေ ရှိသင့်ပါတယ်)။ Component နဲ့ integration tests တွေမှာတော့ — အဲဒါ ဘာလဲဆိုပေါ်မူတည်ပြီး mock လုပ်မလုပ် ဆုံးဖြတ်ပါတယ်။

**ဘာကြောင့် မလုပ်သင့်ဘူးလဲ** — တခါတရံမှာ mock လုပ်တာက လက်တွေ့ မဖြစ်နိုင်ပါဘူး။ ဥပမာ — react ဒါမှမဟုတ် angular လို framework ကြီးတွေကို mock လုပ်တာမျိုး ဘယ်တော့မှ မလုပ်သင့်ပါဘူး (ဆေးက ရောဂါထက် ပိုဆိုးသွားမှာမို့ပါ)။

### External system

ဒါတွေက database၊ environment (web app အတွက် Chromium/Firefox၊ node app အတွက် operating system စသဖြင့်)၊ file system၊ memory store စတာတွေပါ။

အကောင်းဆုံးကတော့ — ဒါတွေကို mock လုပ်စရာ မလိုအောင် ဖြစ်အောင် လုပ်နိုင်ရင် အကောင်းဆုံးပါ။ Case တစ်ခုချင်းစီအတွက် သီးခြား copy တွေ ဖန်တီးပေးတာက (cost များလွန်းလို့၊ execution time တိုးလို့ စသည်ဖြင့်) လက်တွေ့ မဖြစ်နိုင်တာမို့ — နောက်အကောင်းဆုံး နည်းက mock လုပ်တာပါပဲ။ Mock မလုပ်ရင် — tests တွေက တစ်ခုကိုတစ်ခု ဖျက်ဆီးနိုင်ပါတယ်:

`storage.mjs` — database ထဲကို ဖတ်/သိမ်းတဲ့ module တစ်ခုပါ:

```js
import { db } from 'db';

export function read(key, all = false) {
  validate(key);

  if (all) {
    return db.getAll(key);
  }

  return db.getOne(key);
}

export function save(key, val) {
  validate(key, val);

  return db.upsert(key, val);
}
```

အပေါ်က ဥပမာမှာ — test file ထဲက ပထမ နဲ့ ဒုတိယ `it()` blocks တွေက concurrency နဲ့ run လုပ်ခံရပြီး store တစ်ခုတည်းကို mutate လုပ်နေတာမို့ — တစ်ခုကိုတစ်ခု ဖျက်ဆီးနိုင်ပါတယ် (race condition): `save()` ရဲ့ insert လုပ်မှုက တကယ်တော့ အဆင်ပြေနေတဲ့ `read()` ရဲ့ test ကို တွေ့ရှိတဲ့ items အပေါ် assertion fail ဖြစ်စေနိုင်ပြီး — `read()` ရဲ့ test ကလည်း `save()` ကို အလားတူ လုပ်နိုင်ပါတယ်။

## ဘာတွေကို mock လုပ်မလဲ

### Modules + units (Module တွေနဲ့ unit အပိုင်းတွေ)

ဒါက Node.js test runner ရဲ့ `mock` ကို အသုံးချပါတယ် — `mock.fn()` နဲ့ function တစ်ခုကို mock ဖန်တီးပြီး `mock.module()` နဲ့ module တစ်ခုကို mock လုပ်ပါတယ်:

```js
import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

describe('foo', { concurrency: true }, () => {
  const barMock = mock.fn();
  let foo;

  before(async () => {
    const barNamedExports = await import('./bar.mjs')
      // မူရင်း default export ကို ဖယ်ထုတ်လိုက်တယ်
      .then(({ default: _, ...rest }) => rest);

    // test တစ်ခုပြီးတိုင်း restore() ကို manual ခေါ်ဖို့ မလိုအပ်ဘူး
    // (node က သူ့ဘာသာသူ အလိုအလျောက် လုပ်ပေးတယ်)။
    mock.module('./bar.mjs', {
      defaultExport: barMock,
      // Mock မလုပ်ချင်တဲ့ တခြား exports တွေကို ထိန်းထားဖို့။
      namedExports: barNamedExports,
    });

    // ဒါက dynamic import ဖြစ်ရပါမယ် — mock setup ပြီးမှ
    // import စတင်တာ သေချာစေဖို့ တစ်ခုတည်းသော နည်းလမ်းဖြစ်လို့ပါ။
    ({ foo } = await import('./foo.mjs'));
  });

  it('should do the thing', () => {
    barMock.mock.mockImplementationOnce(function bar_mock() {
      /* … */
    });

    assert.equal(foo(), 42);
  });
});
```

### APIs (API တွေ)

လူသိနည်းတဲ့ အချက်တစ်ခုက — `fetch` ကို mock လုပ်ဖို့ built-in နည်းလမ်း ရှိပါတယ်။ `undici` က Node.js ရဲ့ `fetch` implementation ဖြစ်ပြီး — `node` နဲ့အတူ ပါလာပေမယ့် `node` ကိုယ်တိုင်ကနေ တိုက်ရိုက် expose မလုပ်ထားလို့ — သီးခြား install လုပ်ရပါတယ် (ဥပမာ `npm install undici`)။

အောက်က ဥပမာမှာ — `MockAgent` နဲ့ `setGlobalDispatcher` ကို သုံးပြီး HTTP requests တွေ လုပ်တဲ့ `endpoints` module ရဲ့ GET/PUT responses တွေကို intercept လုပ်ပြီး mock လုပ်ထားပါတယ်:

```js
import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { MockAgent, setGlobalDispatcher } from 'undici';

import endpoints from './endpoints.mjs';

describe('endpoints', { concurrency: true }, () => {
  let agent;
  beforeEach(() => {
    agent = new MockAgent();
    setGlobalDispatcher(agent);
  });

  it('should retrieve data', async () => {
    const endpoint = 'foo';
    const code = 200;
    const data = {
      key: 'good',
      val: 'item',
    };

    agent
      .get('https://example.com')
      .intercept({
        path: endpoint,
        method: 'GET',
      })
      .reply(code, data);

    assert.deepEqual(await endpoints.get(endpoint), {
      code,
      data,
    });
  });

  it('should save data', async () => {
    const endpoint = 'foo/1';
    const code = 201;
    const data = {
      key: 'good',
      val: 'item',
    };

    agent
      .get('https://example.com')
      .intercept({
        path: endpoint,
        method: 'PUT',
      })
      .reply(code, data);

    assert.deepEqual(await endpoints.save(endpoint), {
      code,
      data,
    });
  });
});
```

### Time (အချိန်)

Doctor Strange လိုပဲ — ကိုယ်လည်း အချိန်ကို ထိန်းချုပ်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် ဒါကို လုပ်တာက — အချိန်အတုအယောင် ရှည်ကြာနေတဲ့ test runs တွေကို ရှောင်ဖို့ သက်သက် ဖြစ်ပါတယ် (`setTimeout()` တစ်ခု fire ဖြစ်ဖို့ ၃ မိနစ် စောင့်ချင်ပါသလား)။ ဒါ့အပြင် — အချိန်ကို ဖြတ်ကျော် ခရီးသွားလိုလည်း ရပါတယ်။ ဒါက Node.js test runner ရဲ့ `mock.timers` ကို အသုံးချပါတယ်:

```js
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import ago from './ago.mjs';

describe('whatever', { concurrency: true }, () => {
  it('should choose "minutes" when that\'s the closet unit', () => {
    mock.timers.enable({ now: new Date('2000-01-01T00:02:02Z') });

    const t = ago('1999-12-01T23:59:59Z');

    assert.equal(t, '2 minutes ago');
  });
});
```

ဒီမှာ time-stamps တွေထဲက time-zone (`Z`) ကို သတိပြုပါ — ညီညွတ်တဲ့ time-zone မပါရင် မမျှော်လင့်တဲ့ ရလဒ်တွေ ရနိုင်ပါတယ်။ ဒီနည်းက — repo ထဲ check in လုပ်ထားတဲ့ static fixture တစ်ခုနဲ့ နှိုင်းယှဉ်စရာ ရှိတဲ့အခါ (snapshot testing လိုမျိုး) အထူး အသုံးဝင်ပါတယ်။
