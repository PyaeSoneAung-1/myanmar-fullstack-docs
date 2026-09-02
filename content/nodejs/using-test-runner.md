---
title: "Node.js Test Runner အသုံးပြုခြင်း (Using Node.js's Test Runner)"
description: "Node.js test runner နဲ့ test suites တည်ဆောက်ခြင်း — setup files, dynamic test cases ထုတ်ခြင်း, ServiceWorker/snapshot/unit/UI tests အတွက် real-world ပုံစံများ"
order: 62
source: "https://nodejs.org/learn/test-runner/using-test-runner"
status: translated
updated: 2026-09-02
---

Node.js မှာ လိုက်လျောညီထွေ ရှိပြီး ခိုင်မာတဲ့ **built-in test runner** ပါဝင်ပါတယ်။ ဒီ guide က အဲဒါကို ဘယ်လို setup လုပ်ပြီး သုံးမလဲ ဆိုတာ ပြသပါမယ်။

Architecture အကြမ်းဖျင်းက ဒီလိုမျိုး ရှိပါတယ် — package.json ထဲမှာ npm script တွေ သတ်မှတ်ထားပြီး test files တွေက `test/` folder အောက်မှာ ရှိပါတယ်:

```
example/
  ├ …
  ├ src/
    ├ app/…
    └ sw/…
  └ test/
    ├ globals/
      ├ …
      ├ IndexedDb.js
      └ ServiceWorkerGlobalScope.js
    ├ setup.mjs
    ├ setup.units.mjs
    └ setup.ui.mjs
```

**မှတ်ချက်**: globs တွေက node v21+ မှာ လိုအပ်ပြီး — globs တွေကို quotes နဲ့ ပတ်ထားရပါတယ် (quotes မပါရင် မျှော်လင့်ထားတာနဲ့ မတူတဲ့ အပြုအမူ ရလာနိုင်ပြီး — အစပိုင်းမှာ အလုပ်ဖြစ်နေသလို ထင်ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး)။

ဘယ် test မှာမဆို အမြဲ လိုချင်တဲ့ အရာတွေ ရှိတာမို့ — အဲဒါတွေကို base setup file တစ်ခုထဲ ထည့်ထားပါတယ်။ ဒီ file ကို တခြား ပိုသီးသန့်ဖြစ်တဲ့ setup files တွေက ပြန် import လုပ်ပါတယ်။

## General Setup (အခြေခံ Setup)

`test/setup.mjs` — TypeScript loader လိုမျိုး အရာတွေကို `node:module` ကနေ register လုပ်တဲ့ base file ပါ:

```js
import { register } from 'node:module';

register('some-typescript-loader');
// ဒီကစပြီး TypeScript ကို support လုပ်ပါပြီ
// ဒါပေမယ့် တခြား test/setup.*.mjs files တွေကတော့ plain JavaScript ဖြစ်နေရပါမယ်!
```

ပြီးရင် — setup တစ်ခုချင်းစီအတွက် သီးသန့် `setup` file တစ်ခုစီ ဖန်တီးပါ (setup တိုင်းထဲမှာ base `setup.mjs` ကို import လုပ်ထားဖို့ သေချာပါစေ)။ Setups တွေကို သီးခြားခွဲထားရတဲ့ အကြောင်းရင်း အများကြီး ရှိပေမယ့် — အထင်ရှားဆုံးက [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) + performance ပါ: setup လုပ်နေတဲ့ အများစုက environment-specific mocks/stubs တွေ ဖြစ်ပြီး — ဒါတွေက အတော်လေး ဈေးကြီးပြီး test run တွေကို နှေးကွေးစေနိုင်ပါတယ်။ မလိုအပ်တဲ့အခါ အဲဒီ cost တွေ (CI မှာ ပေးရတဲ့ ငွေ၊ tests ပြီးဖို့ စောင့်ရတဲ့ အချိန် စသဖြင့်) ကို ရှောင်ချင်ပါတယ်။ အောက်က ဥပမာတစ်ခုချင်းစီကို real-world project တွေကနေ ယူထားတာပါ — ကိုယ့် project နဲ့ မတိုက်ဆိုင်နိုင်ပေမယ့် — တစ်ခုချင်းစီက ကျယ်ပြန့်စွာ အသုံးချနိုင်တဲ့ ယေဘုယျ concept တွေကို ပြသပါတယ်။

## Test cases တွေကို Dynamic ထုတ်ခြင်း

တခါတရံမှာ test-cases တွေကို dynamic အနေနဲ့ ထုတ်ချင်တတ်ပါတယ် — ဥပမာ file တစ်စုံတစ်ခုကို ဖြတ်ပြီး တူညီတဲ့ အချက်ကို test လုပ်ချင်တာမျိုးပါ။ ဒါ ဖြစ်နိုင်ပေမယ့် — နည်းနည်း လျှို့ဝှက်ဆန်းကြယ်ပါတယ်: `test` ကို သုံးရပါမယ် (`describe` ကို မသုံးရဘူး) + `testContext.test` ကို သုံးရပါမယ်:

### ရိုးရှင်းတဲ့ ဥပမာ

User-agent string တွေ အများကြီးကနေ OS ကို detect လုပ်တဲ့ function တစ်ခုကို — data list တစ်ခုကို loop ပတ်ပြီး test case တစ်ခုချင်းစီ ထုတ်ပါတယ်:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { detectOsInUserAgent } from '…';

const userAgents = [
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.3',
    os: 'WIN',
  },
  // …
];

test('Detect OS via user-agent', { concurrency: true }, t => {
  for (const { os, ua } of userAgents) {
    t.test(ua, () => assert.equal(detectOsInUserAgent(ua), os));
  }
});
```

### ပိုဆန်းတဲ့ ဥပမာ

Workspace တစ်ခုလုံးက package.json files တွေကို စုပြီး — file တစ်ခုချင်းစီအတွက် test case ထုတ်ခြင်းပါ:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getWorkspacePJSONs } from './getWorkspacePJSONs.mjs';

const requiredKeywords = ['node.js', 'sliced bread'];

test('Check package.jsons', { concurrency: true }, async t => {
  const pjsons = await getWorkspacePJSONs();

  for (const pjson of pjsons) {
    // ⚠️ `t.test` ကို သုံးပါ — `test` ကို မသုံးပါနဲ့
    t.test(`Ensure fields are properly set: ${pjson.name}`, () => {
      assert.partialDeepStrictEqual(pjson.keywords, requiredKeywords);
    });
  }
});
```

**မှတ်ချက်**: Node.js 23.8.0 မတိုင်ခင်မှာ — `testContext.test` ကို အလိုအလျောက် await မလုပ်ပေးတာမို့ setup က အတော်လေး ကွဲပြားခဲ့ပါတယ်။

## ServiceWorker tests

`ServiceWorkerGlobalScope` မှာ တခြား environment တွေမှာ မရှိတဲ့ အလွန် သီးသန့် APIs တွေ ပါဝင်ပြီး — တချို့ APIs တွေက (`fetch` လိုမျိုး) နီးစပ်ပုံရပေမယ့် ပိုချဲ့ထွင်ထားတဲ့ အပြုအမူ (augmented behaviour) ရှိပါတယ်။ ဒါတွေက မဆိုင်တဲ့ test တွေထဲကို ရောက်မသွားစေချင်ပါဘူး။

`test/setup.sw.mjs` — test တစ်ခုစီမတိုင်ခင် `globalThis.self` ကို ServiceWorkerGlobalScope instance အသစ်နဲ့ အစားထိုးပေးတဲ့ setup ပါ:

```js
import { beforeEach } from 'node:test';

import { ServiceWorkerGlobalScope } from './globals/ServiceWorkerGlobalScope.js';

import './setup.mjs'; // 💡 base setup ကို import လုပ်ထားခြင်း

beforeEach(globalSWBeforeEach);
function globalSWBeforeEach() {
  globalThis.self = new ServiceWorkerGlobalScope();
}
```

`onActivate` လိုမျိုး ServiceWorker ရဲ့ event handler တစ်ခုကို test လုပ်တဲ့ ဥပမာပါ — `clients.claim()` နဲ့ `clients.matchAll()` တို့ကို `mock.fn()` နဲ့ mock လုပ်ထားပြီး ခေါ်ဆိုမှု အရေအတွက်ကို စစ်ဆေးပါတယ်:

```js
import assert from 'node:assert/strict';
import { describe, mock, it } from 'node:test';

import { onActivate } from './onActivate.js';

describe('ServiceWorker::onActivate()', () => {
  const globalSelf = globalThis.self;
  const claim = mock.fn(async function mock__claim() {});
  const matchAll = mock.fn(async function mock__matchAll() {});

  class ActivateEvent extends Event {
    constructor(...args) {
      super('activate', ...args);
    }
  }

  before(() => {
    globalThis.self = {
      clients: { claim, matchAll },
    };
  });
  after(() => {
    global.self = globalSelf;
  });

  it('should claim all clients', async () => {
    await onActivate(new ActivateEvent());

    assert.equal(claim.mock.callCount(), 1);
    assert.equal(matchAll.mock.callCount(), 1);
  });
});
```

## Snapshot tests

Snapshot tests တွေကို Jest က လူကြိုက်များအောင် လုပ်ခဲ့ပြီး — အခုတော့ Node.js (v22.3.0 ကစပြီး) အပါအဝင် library တွေ အများကြီးမှာ ဒီလို လုပ်ဆောင်ချက် ရှိပါတယ်။ Component တစ်ခုရဲ့ rendering output ကို စစ်ဆေးခြင်း၊ Infrastructure as Code config တွေကို စစ်ဆေးခြင်း စတဲ့ use-case တွေ ရှိပါတယ် — use-case ဘာပဲ ဖြစ်ဖြစ် concept ကတော့ အတူတူပါပဲ။

`--experimental-test-snapshots` flag နဲ့ feature ကို enable လုပ်ရတာကလွဲလို့ — **မဖြစ်မနေ လိုအပ်တဲ့ configuration မရှိပါဘူး**။ ဒါပေမယ့် optional configuration ကို ပြသဖို့အတွက် — ရှိပြီးသား test config file တစ်ခုထဲမှာ အောက်ပါအတိုင်း ထည့်လေ့ ရှိပါတယ်။

Node.js က default အနေနဲ့ syntax highlighting နဲ့ မကိုက်တဲ့ `.js.snapshot` ဆိုတဲ့ filename ကို generate လုပ်ပါတယ်။ Generate ဖြစ်တဲ့ file က တကယ်တော့ CJS file ဖြစ်လို့ — `.snapshot.cjs` (အတိုချုံးပြီး `.snap.cjs`) နဲ့ အဆုံးသတ်တဲ့ နာမည်က ပိုသင့်လျော်ပါတယ် (ESM project တွေမှာလည်း ပိုအဆင်ပြေပါတယ်):

```js
import { basename, dirname, extname, join } from 'node:path';
import { snapshot } from 'node:test';

snapshot.setResolveSnapshotPath(generateSnapshotPath);
/**
 * @param {string} testFilePath '/tmp/foo.test.js'
 * @returns {string} '/tmp/foo.test.snap.cjs'
 */
function generateSnapshotPath(testFilePath) {
  const ext = extname(testFilePath);
  const filename = basename(testFilePath, ext);
  const base = dirname(testFilePath);

  return join(base, `${filename}.snap.cjs`);
}
```

အောက်က ဥပမာက UI components တွေအတွက် testing library နဲ့ snapshot testing လုပ်ပုံကို ပြသပါတယ် — `assert.snapshot` ကို ဝင်ကြည့်တဲ့ နည်းနှစ်မျိုး သတိပြုပါ:

```jsx
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // ဘယ် framework မဆို ရတယ် (ဥပမာ svelte)

import { SomeComponent } from './SomeComponent.jsx';

describe('<SomeComponent>', () => {
  // "fat-arrow" syntax ကြိုက်သူတွေအတွက် အောက်ကပုံစံက ပိုညီညွတ်တယ်
  it('should render defaults when no props are provided', t => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function () {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` က "fat arrow" မဟုတ်ဘဲ `function` သုံးမှပဲ အလုပ်လုပ်တယ်။
  });
});
```

⚠️ `assert.snapshot` က test ရဲ့ context (`t` သို့မဟုတ် `this`) ကနေ လာတာပါ — **`node:assert` ကနေ လာတာ မဟုတ်ပါဘူး**။ ဒါက မဖြစ်မနေ လိုအပ်တာပါ — ဘာလို့လဲဆိုရင် test context မှာ `node:assert` အတွက် မဖြစ်နိုင်တဲ့ scope တွေ ဝင်ရောက်နိုင်လို့ပါ (`assert.snapshot` သုံးတိုင်း `snapshot(this, value)` လိုမျိုး manual ပေးရမှာ ဖြစ်လို့ — အတော် ပင်ပန်းစရာပါ)။

## Unit tests

Unit tests တွေက အရိုးရှင်းဆုံး tests တွေဖြစ်ပြီး — ယေဘုယျအားဖြင့် အထူး တစ်ခုခု မလိုအပ်ပါဘူး။ ကိုယ့် test တွေရဲ့ အများစုက unit tests ဖြစ်လိမ့်မယ်လို့ ခန့်မှန်းလို့ရတာမို့ — setup ကို minimal ဖြစ်အောင် ထားဖို့ အရေးကြီးပါတယ် (setup performance နည်းနည်းလေး ကျသွားရင်တောင် ကြီးကြီးမားမား သက်ရောက်မှု ဖြစ်လို့ပါ)။

`test/setup.units.mjs` — unit tests အတွက် base setup ကို ပြန်သုံးပြီး plain-text loader တစ်ခု ထပ်ထည့်ထားပါတယ်:

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡 base setup ကို import လုပ်ထားခြင်း

register('some-plaintext-loader');
// graphql လိုမျိုး plain-text files တွေကို အခု import လုပ်လို့ရပါပြီ:
// import GET_ME from 'get-me.gql'; GET_ME = '
```

Unit test ဥပမာ — `Cat` class က fish ကို စားနိုင်ပြီး plastic ကို မစားရဘူးဆိုတာကို စစ်ဆေးတာပါ:

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Cat } from './Cat.js';
import { Fish } from './Fish.js';
import { Plastic } from './Plastic.js';

describe('Cat', () => {
  it('should eat fish', () => {
    const cat = new Cat();
    const fish = new Fish();

    assert.doesNotThrow(() => cat.eat(fish));
  });

  it('should NOT eat plastic', () => {
    const cat = new Cat();
    const plastic = new Plastic();

    assert.throws(() => cat.eat(plastic));
  });
});
```

## User Interface tests (UI tests)

UI tests တွေက ယေဘုယျအားဖြင့် DOM တစ်ခု လိုအပ်ပြီး — (အောက်မှာ သုံးထားတဲ့ `IndexedDb` လိုမျိုး) browser-specific APIs တချို့လည်း လိုနိုင်ပါတယ်။ ဒါတွေက setup လုပ်ရတာ အတော်လေး ရှုပ်ထွေးပြီး ဈေးကြီးတတ်ပါတယ်။

`test/setup.ui.mjs` — UI tests တွေအတွက် JSDOM instance တစ်ခုတည်း တည်ဆောက်ပြီး — global တွေကို အလှဆင်ပေးတဲ့ setup ပါ:

```js
import { register } from 'node:module';

// ⚠️ JSDom instance တစ်ခုတည်းပဲ ဖန်တီးပါ — အများကြီး ဆိုရင် ပြဿနာ အများကြီး ဖြစ်စေပါတယ်
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡 unit setup ကို import လုပ်ထားခြင်း

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ ဒါ သတ်မှတ်မထားရင် ပြဿနာ အများကြီး ဖြစ်တတ်ပါတယ်
});

// Global တစ်ခုကို decorate လုပ်တဲ့ ဥပမာ။
// JSDOM ရဲ့ `history` က navigation ကို မကိုင်တွယ်ပါဘူး — အောက်ကဟာက case အများစုကို ဖြေရှင်းပေးတယ်။
const pushState = globalThis.history.pushState.bind(globalThis.history);
globalThis.history.pushState = function mock_pushState(data, unused, url) {
  pushState(data, unused, url);
  globalThis.location.assign(url);
};

beforeEach(globalUIBeforeEach);
function globalUIBeforeEach() {
  globalThis.indexedDb = new IndexedDb();
}
```

`IndexedDb` လိုမျိုး API တစ်ခုကို သုံးပေမယ့် အလွန် သီးခြားနေရာမှာပဲ သုံးတယ်ဆိုရင် — ဒီလို global mock တစ်ခုထက် — `IndexedDb` ကို ဝင်ရောက်မယ့် သီးခြား test ထဲကိုပဲ ဒီ `beforeEach` ကို ရွှေ့ထည့်တာ ပိုကောင်းနိုင်ပါတယ်။ `IndexedDb` (ဒါမှမဟုတ် ဘာပဲဖြစ်ဖြစ်) ကို ဝင်ရောက်တဲ့ module ကိုယ်တိုင်က နေရာတိုင်းမှာ သုံးနေတယ်ဆိုရင်တော့ — အဲဒီ module ကိုပဲ mock လုပ်တာ (ပိုကောင်းတဲ့ option ပါ) ဒါမှမဟုတ် ဒီနေရာမှာပဲ ထားလိုက်ပါ။

UI tests တွေမှာ အဆင့် နှစ်မျိုး ရှိနိုင်ပါတယ် — **unit-like** (externals နဲ့ dependencies တွေကို mock လုပ်ထားတဲ့ ပုံစံ) နဲ့ **end-to-end နီးစပ်တဲ့** ပုံစံ (`IndexedDb` လို externals တွေကိုပဲ mock လုပ်ပြီး ကျန်တဲ့ chain တစ်ခုလုံး real ဖြစ်တဲ့ ပုံစံ) တို့ပါ။ ရှေ့ကဟာက ယေဘုယျအားဖြင့် ပိုစင်ကြယ်တဲ့ option ဖြစ်ပြီး — နောက်ကဟာကိုတော့ Playwright ဒါမှမဟုတ် Puppeteer လိုမျိုး tool တွေနဲ့ fully end-to-end automated usability test အဖြစ် ရွှေ့ဆိုင်းလေ့ ရှိပါတယ်။ အောက်က ဥပမာက ရှေ့က ပုံစံ (unit-like) ပါ:

```jsx
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // ဘယ် framework မဆို ရတယ် (ဥပမာ svelte)

// ⚠️ SomeOtherComponent က static import မဟုတ်ဘူးဆိုတာ သတိပြုပါ;
// ဒါက သူ့ရဲ့ကိုယ်ပိုင် imports တွေကို mock လုပ်ရလွယ်ကူအောင် မဖြစ်မနေ လိုအပ်တာပါ။

describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ အစီအစဉ် အရေးကြီးတယ်: mock ကို consumer ကို import မလုပ်ခင် အရင်ဆုံး setup လုပ်ရပါတယ်။

    // `--experimental-test-module-mocks` flag လိုအပ်ပါတယ်။
    calcSomeValue = mock.module('./calcSomeValue.js', {
      calcSomeValue: mock.fn(),
    });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // ဒါကို snapshot နဲ့ ကိုင်တွယ်ချင်မှာ မဟုတ်ဘူး — ဘာလို့လဲဆိုတော့ brittle ဖြစ်လို့ပါ:
    // error message ထဲမှာ အရေးမပါတဲ့ ပြောင်းလဲမှုတွေ ဖြစ်တိုင်း
    // snapshot test က မှားပြီး fail ဖြစ်တတ်လို့ပါ
    // (ပြီးတော့ snapshot ကို အကျိုးမရှိဘဲ update လုပ်နေရမှာမို့ပါ)။

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() {
        return null;
      });

      render(<SomeOtherComponent />);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
