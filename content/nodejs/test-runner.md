---
title: "Node.js Test Runner မိတ်ဆက် (Discovering Node.js's Test Runner)"
description: "Node.js ရဲ့ built-in test runner မိတ်ဆက် — node:test module, tests run လုပ်ခြင်း (--test flag), describe/it/test နဲ့ assertions အကျဉ်းချုပ်, ဆက်စပ် test runner guides များ"
order: 61
source: "https://nodejs.org/learn/test-runner/introduction"
status: translated
updated: 2026-09-02
---

ဒီ resource series ထဲမှာ — ကိုယ့် code တွေကို test လုပ်ဖို့ Node.js ရဲ့ test runner ကို ဘယ်လို သုံးမလဲ ဆိုတာ လေ့လာသွားမှာ ဖြစ်ပါတယ်။

## Test runner ဆိုတာ ဘာလဲ

**Test runner** ဆိုတာ — ကိုယ့် code အပေါ်မှာ tests တွေ run လုပ်နိုင်အောင် ပေးတဲ့ tool တစ်ခုပါ။ သူက tests တွေကို လုပ်ဆောင်ပြီး — pass လား fail လား ဆိုတဲ့ ရလဒ်ကို ပြန်လည် အစီရင်ခံပေးပါတယ်။ Code coverage လိုမျိုး အပိုအချက်အလက်တွေကိုလည်း ပေးနိုင်ပါတယ်။

Node.js အတွက် test runner တွေ အများကြီး ရှိပါတယ် — ဒါပေမယ့် ဒီမှာတော့ Node.js နဲ့အတူ ပါလာတဲ့ **built-in test runner** ကို အာရုံစိုက်ပါမယ်။ သူ့ရဲ့ ကောင်းတဲ့ အချက်က — **အပို dependency တစ်ခုမှ install လုပ်စရာ မလိုဘဲ သုံးလို့ရတာပါ**။

## ကိုယ့် code တွေကို ဘာကြောင့် test လုပ်သင့်သလဲ

Code တွေကို test လုပ်တာက အရေးကြီးပါတယ် — ဘာကြောင့်လဲဆိုရင် ကိုယ့် code က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်လား ဆိုတာကို စစ်ဆေးအတည်ပြုနိုင်လို့ပါ။ Development ဖြစ်စဉ်ထဲမှာ bug တွေကို စောစောစီးစီး ဖမ်းမိစေပြီး — ကိုယ့် code ကို ယုံကြည်စိတ်ချရပြီး (reliable) ထိန်းသိမ်းပြုပြင်လို့ လွယ်ကူတဲ့ (maintainable) အနေအထားမှာ ရှိစေပါတယ်။

## Node.js test runner ရဲ့ အဓိက လုပ်ဆောင်ချက်များ

Built-in test runner က **`node:test`** module ကနေတစ်ဆင့် ရနိုင်ပြီး — အဓိက လုပ်ဆောင်ချက်တွေက:

- **`test()`** — test case တစ်ခုကို သတ်မှတ်ပါတယ်။ Test case တွေကို အုပ်စုဖွဲ့ချင်ရင် **`describe()`** ကို သုံးနိုင်ပြီး — test case တစ်ခုချင်းစီအတွက် **`it()`** (ဒါမှမဟုတ် `test()`) ကို သုံးပါတယ်။
- **Assertions** — test ရလဒ်တွေကို စစ်ဆေးဖို့ `node:assert` (အထူးသဖြင့် `node:assert/strict`) module ကို သုံးပါတယ်။
- **Subtest** — test case တစ်ခုအတွင်းမှာ ထပ်ဆင့် test တွေကို `t.test()` နဲ့ ထည့်သွင်းနိုင်ပါတယ်။
- **`--test` flag** — command line ကနေ test files တွေကို အလိုအလျောက် ရှာဖွေပြီး run လုပ်ပေးပါတယ်။
- **Mocking နဲ့ code coverage** — ထည့်သွင်းပြီးသား အနေနဲ့ ပါလာတာမို့ — tests တွေထဲမှာ functions/modules/timers တွေကို mock လုပ်နိုင်ပြီး coverage report တွေလည်း ထုတ်နိုင်ပါတယ်။

## Tests run လုပ်ခြင်း

Tests တွေကို run လုပ်ဖို့ — test runner documentation ကို ဖတ်ဖို့ အကြံပြုပါတယ်။ လက်တွေ့မှာ အရိုးရှင်းဆုံးကတော့ project folder ထဲမှာ —

```bash
node --test
```

လို့ run လုပ်ခြင်းပါ — Node.js က default pattern တွေနဲ့ ကိုက်ညီတဲ့ test files တွေ (ဥပမာ `test/` folder အောက်က file တွေ၊ `*.test.js` လိုမျိုး နာမည်တွေ) ကို ရှာဖွေပြီး run လုပ်ပေးပါတယ်။

## ဆက်ဖတ်ရန်

- [Test Runner အသုံးပြုခြင်း](/docs/nodejs/using-test-runner) — test suites တည်ဆောက်ပုံ — setup files, dynamic test cases, snapshot tests, unit/UI tests
- [Testing တွင် Mocking](/docs/nodejs/mocking) — ဘယ်အခါ mock လုပ်ရမလဲ၊ `mock.fn()`/`mock.module()`/`mock.timers` အသုံးပြုပုံ
- [Code Coverage စုဆောင်းခြင်း](/docs/nodejs/collecting-code-coverage) — `--experimental-test-coverage` flag နဲ့ coverage report ထုတ်ခြင်း
- [Test runner API documentation](https://nodejs.org/api/test.html) — `node:test` API အပြည့်အစုံ
