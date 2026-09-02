---
title: "Code Coverage စုဆောင်းခြင်း (Collecting Code Coverage in Node.js)"
description: "Node.js test runner နဲ့ code coverage စုဆောင်းခြင်း — --experimental-test-coverage flag, coverage report ဖတ်နည်း, ignore comments နဲ့ CLI include/exclude flags, coverage thresholds"
order: 64
source: "https://nodejs.org/learn/test-runner/collecting-code-coverage"
status: translated
updated: 2026-09-02
---

Node.js က သူ့ရဲ့ test runner ကနေတစ်ဆင့် — **code coverage အတွက် built-in support** ပေးထားပြီး — `--experimental-test-coverage` flag နဲ့ enable လုပ်နိုင်ပါတယ်။

`run()` API ကို သုံးနေတယ်ဆိုရင်တော့ — `coverage` option ကို `true` လို့ သတ်မှတ်ပေးရပါမယ်။ `run()` API အကြောင်း အသေးစိတ်ကို [`node:test` documentation](https://nodejs.org/api/test.html) မှာ ကြည့်ရှုနိုင်ပါတယ်။

## Code coverage ဆိုတာ ဘာလဲ

**Code coverage** ဆိုတာ — test runner တွေအတွက် metric တစ်ခုဖြစ်ပြီး — testing လုပ်နေစဉ်အတွင်း program တစ်ခုရဲ့ source code ဘယ်လောက်ကို execute ဖြစ်ခဲ့လဲ ဆိုတာကို တိုင်းတာပါတယ်။ Codebase ရဲ့ ဘယ်အပိုင်းတွေကို test လုပ်ပြီးပြီလဲ၊ ဘယ်အပိုင်းတွေ မလုပ်ရသေးဘူးလဲ ဆိုတာကို ဖော်ထုတ်ပြပြီး — test suite ထဲက ကွာဟချက်တွေကို ညွှန်ပြပေးပါတယ်။ ဒါက software ကို ပိုပြည့်စုံစွာ စမ်းသပ်ဖြစ်စေပြီး — ရှာမတွေ့နိုင်တဲ့ bug တွေရဲ့ အန္တရာယ်ကို လျှော့ချပေးပါတယ်။ ပုံမှန်အားဖြင့် ရာခိုင်နှုန်းနဲ့ ဖော်ပြလေ့ ရှိပြီး — code coverage ရာခိုင်နှုန်း မြင့်လေလေ test coverage ပိုပြည့်စုံတယ်လို့ ဆိုလိုပါတယ်။ Code coverage အကြောင်း ပိုပြီး အသေးစိတ် ရှင်းလင်းချက်ကို Wikipedia ရဲ့ ["Code coverage"](https://en.wikipedia.org/wiki/Code_coverage) article မှာ ကြည့်နိုင်ပါတယ်။

## အခြေခံ Coverage Report

Node.js မှာ code coverage အလုပ်လုပ်ပုံကို ပြဖို့ ရိုးရှင်းတဲ့ ဥပမာတစ်ခုနဲ့ ကြည့်ရအောင်။

**မှတ်ချက်**: ဒီဥပမာ (နဲ့ ဒီ file ထဲက တခြား ဥပမာတွေအားလုံး) ကို CommonJS နဲ့ ရေးထားပါတယ်။ ဒီ concept နဲ့ မရင်းနှီးရင် — [CommonJS Modules documentation](https://nodejs.org/api/modules.html#modules-commonjs-modules) ကို ဖတ်ပါ။

`main.js` — function သုံးခု ပါတဲ့ module တစ်ခုပါ:

```js
function add(a, b) {
  return a + b;
}

function isEven(num) {
  return num % 2 === 0;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, isEven, multiply };
```

Test file ထဲမှာတော့ — `add()` နဲ့ `isEven()` function တွေကိုပဲ test လုပ်ထားပြီး — `multiply()` function ကို ဘယ် test ကမှ မလွှမ်းခြုံမိဘူးဆိုတာ သတိပြုပါ။

Tests run လုပ်နေစဉ်မှာ code coverage စုဆောင်းဖို့ — အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
node --experimental-test-coverage --test main.test.js
```

Tests တွေ ပြီးသွားရင် — အောက်ပါပုံစံမျိုး report တစ်ခု ရပါလိမ့်မယ်:

```
✔ add() should add two numbers (1.505987ms)
✔ isEven() should report whether a number is even (0.175859ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 59.480373
ℹ start of coverage report
ℹ -------------------------------------------------------------
ℹ file         | line % | branch % | funcs % | uncovered lines
ℹ -------------------------------------------------------------
ℹ main.js      |  76.92 |   100.00 |   66.67 | 9-11
ℹ main.test.js | 100.00 |   100.00 |  100.00 |
ℹ -------------------------------------------------------------
ℹ all files    |  86.96 |   100.00 |   80.00 |
ℹ -------------------------------------------------------------
ℹ end of coverage report
```

Coverage report က ကိုယ့် code ဘယ်လောက်ကို tests တွေက လွှမ်းခြုံထားလဲ ဆိုတာကို အောက်ပါအတိုင်း အပိုင်းခွဲ ဖော်ပြပေးပါတယ်:

- **Line Coverage (လိုင်း လွှမ်းခြုံမှု)** — tests တွေအတွင်း execute ဖြစ်ခဲ့တဲ့ လိုင်းတွေရဲ့ ရာခိုင်နှုန်း
- **Branch Coverage (အကိုင်းခွဲ လွှမ်းခြုံမှု)** — test လုပ်ပြီးသား code branches တွေ (if-else လိုမျိုး) ရဲ့ ရာခိုင်နှုန်း
- **Function Coverage (လုပ်ဆောင်ချက် လွှမ်းခြုံမှု)** — testing အတွင်း ခေါ်ဆိုမှု ဖြစ်ခဲ့တဲ့ functions တွေရဲ့ ရာခိုင်နှုန်း

ဒီဥပမာမှာ:

- `main.js` က line coverage 76.92% နဲ့ function coverage 66.67% ပြနေတာက — `multiply()` function ကို test မလုပ်ထားလို့ပါ။ Uncovered lines (9-11) တွေက အဲဒီ function နဲ့ ကိုက်ညီပါတယ်။
- `main.test.js` က metric အားလုံးမှာ 100% coverage ပြနေတာက — test file ကိုယ်တိုင် အပြည့်အဝ execute ဖြစ်ခဲ့တာကို ဆိုလိုပါတယ်။

## Include နဲ့ Exclude လုပ်ခြင်း

Application တွေ အလုပ်လုပ်တဲ့အခါ — file တချို့ ဒါမှမဟုတ် code လိုင်းတချို့ကို coverage ကနေ ဖယ်ထုတ်ဖို့ လိုအပ်တဲ့ အခြေအနေတွေ ကြုံရတတ်ပါတယ်။ Node.js က ဒါကို ကိုင်တွယ်ဖို့ — code အပိုင်းတချို့ကို လျစ်လျူရှုဖို့ comments တွေနဲ့၊ pattern တစ်ခုလုံးကို ဖယ်ထုတ်ဖို့ CLI တွေ ထောက်ပံ့ပေးပါတယ်။

### Comments သုံးပြီး ဖယ်ထုတ်ခြင်း

`main.js` — `multiply` function အပေါ်မှာ coverage ignore comment တစ်ခု ထည့်ထားတဲ့ ပုံစံပါ:

```js
function add(a, b) {
  return a + b;
}

function isEven(num) {
  return num % 2 === 0;
}

/* node:coverage ignore next 3 */
function multiply(a, b) {
  return a * b;
}

module.exports = { add, isEven, multiply };
```

ဒီလို ပြင်ဆင်ထားတဲ့ `main.js` နဲ့ coverage report ထုတ်ကြည့်ရင် — metric အားလုံးမှာ 100% coverage ပြပါလိမ့်မယ်။ အကြောင်းကတော့ — uncovered lines (9-11) တွေကို လျစ်လျူရှုလိုက်လို့ပါ။

Comments နဲ့ code အပိုင်းတွေကို လျစ်လျူရှုဖို့ နည်းလမ်း အမျိုးမျိုး ရှိပါတယ်:

- `/* node:coverage ignore next */` — နောက်လိုင်း တစ်ကြောင်းတည်းကို လျစ်လျူရှုခြင်း
- `/* node:coverage ignore next N */` — နောက်လိုင်း N ကြောင်းကို လျစ်လျူရှုခြင်း (ဥပမာ အပေါ်က `ignore next 3`)
- `/* node:coverage disable */` … `/* node:coverage enable */` — ဒီနှစ်ခုကြားက လိုင်းတွေအားလုံးကို လျစ်လျူရှုခြင်း

နည်းတစ်ခုချင်းစီက အတူတူပဲ — metric အားလုံးမှာ 100% code coverage ရှိတဲ့ report ကို ထုတ်ပေးပါတယ်။

### CLI သုံးပြီး Include/Exclude လုပ်ခြင်း

Coverage report ထဲက file တွေကို ထည့်သွင်း/ဖယ်ထုတ်ဖို့ Node.js က CLI argument နှစ်ခု ထောက်ပံ့ပေးပါတယ်:

- **`--test-coverage-include`** flag (`run()` API မှာ `coverageIncludeGlobs`) — ပေးထားတဲ့ glob pattern နဲ့ ကိုက်ညီတဲ့ files တွေကိုပဲ coverage ထဲ ထည့်သွင်းပါတယ်။ ပုံမှန်အားဖြင့် `/node_modules/` folder ထဲက files တွေကို ဖယ်ထုတ်ထားပေမယ့် — ဒီ flag နဲ့ ရှင်းရှင်းလင်းလင်း ပြန်ထည့်လို့ ရပါတယ်။
- **`--test-coverage-exclude`** flag (`run()` API မှာ `coverageExcludeGlobs`) — ပေးထားတဲ့ glob pattern နဲ့ ကိုက်ညီတဲ့ files တွေကို coverage report ကနေ ဖယ်ထုတ်ပါတယ်။

ဒီ flags တွေကို အကြိမ်များစွာ သုံးလို့ ရပြီး — နှစ်ခုလုံး တွဲသုံးတဲ့အခါ file တစ်ခုက inclusion rules တွေနဲ့ ကိုက်ညီရပြီး — exclusion rules တွေကိုလည်း ရှောင်ရပါတယ်။

Directory structure တစ်ခုကို ကြည့်ရအောင်:

```
.
├── main.test.js
├── src
│   ├── age.js
│   └── name.js
```

ဒီ report ထဲမှာ `src/age.js` ရဲ့ coverage က မကောင်းတဲ့ အခြေအနေ ရှိတယ်ဆိုပါစို့ — `--test-coverage-exclude` flag (`run()` API မှာ `coverageExcludeGlobs`) နဲ့ report ထဲကနေ လုံးဝ ဖယ်ထုတ်လိုက်လို့ ရပါတယ်:

```bash
node --experimental-test-coverage --test-coverage-exclude=src/age.js --test main.test.js
```

ကိုယ့် test file ကိုယ်တိုင်လည်း ဒီ coverage report ထဲ ပါနေပေမယ့် — `src/` folder ထဲက JavaScript files တွေကိုပဲ လိုချင်တယ်ဆိုရင်တော့ — `--test-coverage-include` flag (`run()` API မှာ `coverageIncludeGlobs`) ကို သုံးနိုင်ပါတယ်:

```bash
node --experimental-test-coverage --test-coverage-include=src/*.js --test main.test.js
```

## Thresholds (သတ်မှတ်ချက် ကန့်သတ်များ)

ပုံမှန်အားဖြင့် — tests တွေ အားလုံး pass ဖြစ်တဲ့အခါ Node.js က exit code `0` နဲ့ ထွက်ပါတယ် (အောင်မြင်စွာ လုပ်ဆောင်ပြီးကြောင်း ပြတဲ့ code ပါ)။ ဒါပေမယ့် — coverage က မအောင်မြင်တဲ့အခါ exit code `1` နဲ့ ထွက်ဖို့ coverage report ကို configure လုပ်နိုင်ပါတယ်။

Node.js က လက်ရှိမှာ coverage အမျိုးအစား သုံးမျိုးစလုံးအတွက် thresholds တွေ ထောက်ပံ့ပေးပါတယ်:

- **`--test-coverage-lines`** (`run()` API မှာ `lineCoverage`) — line coverage အတွက်
- **`--test-coverage-branches`** (`run()` API မှာ `branchCoverage`) — branch coverage အတွက်
- **`--test-coverage-functions`** (`run()` API မှာ `functionCoverage`) — function coverage အတွက်

အပေါ်က ဥပမာမှာ line coverage >= 90% ရှိဖို့ လိုအပ်ချင်တယ်ဆိုရင် — `--test-coverage-lines=90` flag (`run()` API မှာ `lineCoverage: 90`) ကို သုံးနိုင်ပါတယ်:

```bash
node --experimental-test-coverage --test-coverage-lines=90 --test main.test.js
```
