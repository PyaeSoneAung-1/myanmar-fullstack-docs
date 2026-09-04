---
title: "REPL"
description: "node:repl module — Read-Eval-Print-Loop (REPLServer class, standalone program အနေနဲ့ပါ)။"
order: 101
source: "https://nodejs.org/api/repl.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:repl` module က Read-Eval-Print-Loop (REPL) implementation တစ်ခုကို ပံ့ပိုးပေးပါတယ် — standalone program (သီးခြား program) အနေနဲ့ ဖြစ်စေ၊ တခြား application တွေထဲမှာ ထည့်သွင်း အသုံးပြုလို့ရတဲ့ အနေနဲ့ ဖြစ်စေ ရရှိနိုင်ပါတယ်။ အောက်ပါအတိုင်း ဝင်ရောက် အသုံးပြုနိုင်ပါတယ်:

```mjs
import repl from 'node:repl';
```

```cjs
const repl = require('node:repl');
```

## ဒီဇိုင်းနှင့် အင်္ဂါရပ်များ (Design and features)

`node:repl` module က [`repl.REPLServer`][] class ကို export လုပ်ပေးပါတယ်။ Run လုပ်နေစဉ်အတွင်း
[`repl.REPLServer`][] instance တွေက user input ရဲ့ line တစ်ကြောင်းချင်းစီကို လက်ခံပြီး —
သုံးစွဲသူ သတ်မှတ်ထားတဲ့ evaluation function အရ အကဲဖြတ်ကာ ရလဒ်ကို output ထုတ်ပေးပါတယ်။
Input နဲ့ output တွေက အသီးသီး `stdin` နဲ့ `stdout` ကနေ ဖြစ်နိုင်သလို — ဘယ် Node.js
[stream][] နဲ့မဆို ချိတ်ဆက်လို့လည်း ရပါတယ်။

[`repl.REPLServer`][] instance တွေက input တွေရဲ့ automatic completion (အလိုအလျောက်
ဖြည့်စွက်ခြင်း)၊ completion preview (ကြိုတင် ပြသခြင်း)၊ ရိုးရှင်းတဲ့ Emacs-style line
editing၊ multi-line inputs (စာကြောင်းပေါင်းများစွာ ထည့်သွင်းခြင်း)၊ [ZSH][] နဲ့ ဆင်တူတဲ့
reverse-i-search၊ [ZSH][] နဲ့ ဆင်တူတဲ့ substring အခြေခံ history ရှာဖွေမှု၊ ANSI-styled
output၊ လက်ရှိ REPL session state ကို သိမ်းဆည်း/ပြန်လည် တည်ဆောက်ခြင်း၊ error recovery နဲ့
စိတ်ကြိုက် ပြင်ဆင်နိုင်တဲ့ evaluation functions တွေကို ပံ့ပိုးပေးပါတယ်။ ANSI styles နဲ့
Emacs-style line editing ကို မပံ့ပိုးတဲ့ terminals တွေမှာတော့ — ကန့်သတ်ထားတဲ့ feature set
တစ်ခုဆီကို အလိုအလျောက် ပြန်ကျသွားပါတယ်။

### Command များနှင့် special keys (Commands and special keys)

အောက်ပါ special commands တွေကို REPL instance အားလုံးက ပံ့ပိုးပေးပါတယ်:

* `.break`: Multi-line expression (စာကြောင်းများစွာ ပါဝင်တဲ့ expression) တစ်ခုကို
  ရိုက်ထည့်နေချိန်မှာ `.break` command (သို့) `Ctrl`+`C` ကို နှိပ်ပြီး — အဲဒီ expression
  ရဲ့ နောက်ထပ် input (သို့) processing ကို ရပ်တန့်နိုင်ပါတယ်။
* `.clear`: REPL ရဲ့ `context` ကို empty object အဖြစ် ပြန်သတ်မှတ်ပြီး — ရိုက်ထည့်နေတဲ့
  multi-line expression တစ်ခုခုကိုလည်း ရှင်းလင်းပစ်ပါတယ်။
* `.exit`: I/O stream ကို ပိတ်လိုက်ပြီး — REPL ကို ထွက်သွားစေပါတယ်။
* `.help`: ဒီ special commands တွေရဲ့ စာရင်းကို ပြသပါတယ်။
* `.save`: လက်ရှိ REPL session ကို file တစ်ခုထဲကို သိမ်းဆည်းပါတယ်:
  `> .save ./file/to/save.js`
* `.load`: File တစ်ခုကို လက်ရှိ REPL session ထဲကို ဖတ်သွင်းပါတယ်:
  `> .load ./file/to/load.js`
* `.editor`: Editor mode (တည်းဖြတ်သည့် မုဒ်) ထဲကို ဝင်ရောက်ပါတယ် — `Ctrl`+`D` နဲ့
  ပြီးဆုံးစေပြီး `Ctrl`+`C` နဲ့ ပယ်ဖျက်နိုင်ပါတယ်။

```console
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```

REPL ထဲမှာ အောက်ပါ key ပေါင်းစပ်မှုတွေက ဒီလို အထူး အကျိုးသက်ရောက်မှုတွေ ရှိပါတယ်:

* `Ctrl`+`C`: တစ်ခါ နှိပ်ရင် `.break` command နဲ့ အတူတူ အကျိုးသက်ရောက်ပါတယ်။
  Blank line (ဗလာ စာကြောင်း) ပေါ်မှာ နှစ်ခါ နှိပ်ရင်တော့ `.exit` command နဲ့ တူညီတဲ့
  အကျိုးသက်ရောက်မှု ရှိပါတယ်။
* `Ctrl`+`D`: `.exit` command နဲ့ တူညီတဲ့ အကျိုးသက်ရောက်မှု ရှိပါတယ်။
* `Tab`: Blank line ပေါ်မှာ နှိပ်ရင် — global နဲ့ local (scope) variable တွေကို
  ပြသပါတယ်။ တခြား input တွေ ရိုက်ထည့်နေစဉ်မှာ နှိပ်ရင်တော့ သက်ဆိုင်ရာ autocompletion
  option တွေကို ပြသပေးပါတယ်။

reverse-i-search နဲ့ ဆက်စပ်တဲ့ key bindings တွေအတွက် [`reverse-i-search`][] ကို
ကြည့်ပါ။ ကျန်တဲ့ key bindings အားလုံးအတွက်တော့ [TTY keybindings][] ကို ကြည့်ပါ။

### ပုံမှန် evaluation ပြုလုပ်ခြင်း (Default evaluation)

ပုံမှန်အားဖြင့် [`repl.REPLServer`][] instance အားလုံးက — JavaScript expressions တွေကို
အကဲဖြတ်ပြီး Node.js built-in modules တွေဆီကို ဝင်ရောက်ခွင့် ပေးတဲ့ evaluation function
တစ်ခုကို အသုံးပြုပါတယ်။ ဒီ default behavior ကို [`repl.REPLServer`][] instance ဖန်တီးတဲ့အခါ
တခြား evaluation function တစ်ခုကို ထည့်ပေးခြင်းဖြင့် ပြောင်းလဲလို့ရပါတယ်။

#### JavaScript expressions (JavaScript expressions များ)

Default evaluator က JavaScript expressions တွေကို တိုက်ရိုက် အကဲဖြတ်ခြင်းကို
ပံ့ပိုးပေးပါတယ်:

```console
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```

Blocks (သို့) functions တွေအတွင်းမှာ သီးသန့် scope လုပ်မထားရင် — implicitly (သွယ်ဝိုက်၍)
ဖြစ်စေ၊ `const`, `let` (သို့) `var` keywords တွေနဲ့ ဖြစ်စေ ကြေညာထားတဲ့ variable တွေကို
global scope မှာ ကြေညာလိုက်တာ ဖြစ်ပါတယ်။

#### Global and local scope (global နှင့် local scope များ)

Default evaluator က global scope ထဲမှာ ရှိတဲ့ variable တွေ အားလုံးကို ဝင်ရောက်ခွင့်
ပေးပါတယ်။ Variable တစ်ခုကို REPL ထဲမှာ တိုက်ရိုက် ထုတ်ဖော်ပြချင်ရင် — `REPLServer`
တစ်ခုချင်းစီနဲ့ ဆက်စပ်နေတဲ့ `context` object ထဲကို assign လုပ်ပေးနိုင်ပါတယ်:

```mjs
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```cjs
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```

`context` object ထဲက properties တွေက REPL အတွင်းမှာ local variable တွေအနေနဲ့ ပေါ်လာပါတယ်:

```console
$ node repl_test.js
> m
'message'
```

Context properties တွေက ပုံမှန်အားဖြင့် read-only မဟုတ်ပါဘူး။ Read-only globals တွေ
သတ်မှတ်ချင်ရင်တော့ context properties တွေကို `Object.defineProperty()` သုံးပြီး
define လုပ်ပေးရပါမယ်:

```mjs
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```cjs
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

#### Accessing core Node.js modules (Node.js core modules များကို ဝင်ရောက် အသုံးပြုခြင်း)

Default evaluator က အသုံးပြုတဲ့အခါ Node.js core modules တွေကို REPL environment ထဲကို
အလိုအလျောက် load လုပ်ပေးပါတယ်။ ဥပမာ — global (သို့) scoped variable အဖြစ် တခြားနည်းနဲ့
ကြေညာထားခြင်း မရှိဘူးဆိုရင် — `fs` ဆိုတဲ့ input ကို လိုအပ်သလို
`global.fs = require('node:fs')` အနေနဲ့ အကဲဖြတ်ပေးမှာ ဖြစ်ပါတယ်။

```console
> fs.createReadStream('./some/file');
```

#### Global uncaught exceptions (ဖမ်းဆီးမမိသော global exceptions များ)

REPL က အဲဒီ REPL session အတွက် uncaught exceptions (ဖမ်းဆီး၍ မရသော exceptions)
အားလုံးကို ဖမ်းယူဖို့ [`domain`][] module ကို အသုံးပြုပါတယ်။

REPL ထဲမှာ [`domain`][] module ကို ဒီလို အသုံးပြုတာက အောက်ပါ side effects တွေ ရှိပါတယ်:

* Uncaught exceptions တွေက standalone REPL မှာသာ [`'uncaughtException'`][] event ကို
  emit လုပ်ပါတယ်။ တခြား Node.js program တစ်ခုအတွင်းက REPL မှာ ဒီ event အတွက်
  listener တစ်ခု ထပ်ထည့်လိုက်ရင် [`ERR_INVALID_REPL_INPUT`][] error ဖြစ်စေပါတယ်။

  ```js
  const r = repl.start();

  r.write('process.on("uncaughtException", () => console.log("Foobar"));\n');
  // Output stream includes:
  //   TypeError [ERR_INVALID_REPL_INPUT]: Listeners for `uncaughtException`
  //   cannot be used in the REPL

  r.close();
  ```

* [`process.setUncaughtExceptionCaptureCallback()`][] ကို သုံးဖို့ ကြိုးစားရင်
  [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`][] error တစ်ခု throw လုပ်ပါတယ်။

#### Assignment of the `_` (underscore) variable (`_` (underscore) variable ကို တန်ဖိုး သတ်မှတ်ခြင်း)

Default evaluator က ပုံမှန်အားဖြင့် — နောက်ဆုံး အကဲဖြတ်ခဲ့တဲ့ expression ရဲ့ ရလဒ်ကို
`_` (underscore) ဆိုတဲ့ အထူး variable ဆီကို assign လုပ်ပါတယ်။ `_` ကို တန်ဖိုးတစ်ခုနဲ့
တိုက်ရိုက် သတ်မှတ်လိုက်ရင်တော့ ဒီအပြုအမူ ပိတ်သွားပါတယ်။

```console
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```

အလားတူပဲ — `_error` က error တစ်ခုခု ရှိခဲ့ရင် နောက်ဆုံး တွေ့ခဲ့ရတဲ့ error ကို
ရည်ညွှန်းပါလိမ့်မယ်။ `_error` ကို တန်ဖိုးတစ်ခုနဲ့ တိုက်ရိုက် သတ်မှတ်လိုက်ရင်လည်း ဒီအပြုအမူ
ပိတ်သွားပါမယ်။

```console
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```

#### `await` keyword

Top level (ထိပ်ဆုံးအဆင့်) မှာ `await` keyword အတွက် ပံ့ပိုးမှုကို ဖွင့်ပေးထားပါတယ်။

```console
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```

REPL ထဲမှာ `await` keyword သုံးခြင်းရဲ့ သိထားသင့်တဲ့ ကန့်သတ်ချက်တစ်ခုကတော့ — အဲဒါက
`const` keywords တွေရဲ့ lexical scoping ကို မလုံမလဲ ဖြစ်စေပါတယ်။

ဥပမာ:

```console
> const m = await Promise.resolve(123)
undefined
> m
123
> m = await Promise.resolve(234)
234
// redeclaring the constant does error
> const m = await Promise.resolve(345)
Uncaught SyntaxError: Identifier 'm' has already been declared
```

[`--no-experimental-repl-await`][] က REPL ထဲက top-level await ကို ပိတ်ထားနိုင်ပါတယ်။

### Reverse-i-search (နောက်ပြန် ရှာဖွေခြင်း)

REPL က [ZSH][] နဲ့ ဆင်တူတဲ့ bi-directional (လမ်းကြောင်းနှစ်ဖက်) reverse-i-search ကို
ပံ့ပိုးပေးပါတယ်။ နောက်ပြန် ရှာဖွေဖို့ `Ctrl`+`R` နဲ့ — ရှေ့ပြန် ရှာဖွေဖို့ `Ctrl`+`S`
နဲ့ စတင်နိုင်ပါတယ်။

ထပ်ခါထပ်ခါ ပါနေတဲ့ history entries တွေကို ကျော်လိုက်ပါလိမ့်မယ်။

reverse search နဲ့ မသက်ဆိုင်တဲ့ key တစ်ခုခု နှိပ်လိုက်တာနဲ့ — entries တွေကို လက်ခံလိုက်ပါတယ်။
`Esc` (သို့) `Ctrl`+`C` နှိပ်ပြီး ပယ်ဖျက်လို့ရပါတယ်။

လက်ရှိ အနေအထားကနေ မျှော်လင့်ထားတဲ့ ဦးတည်ချက်အတိုင်း — ဦးတည်ချက် ပြောင်းလိုက်တာနဲ့
နောက် entry ကို ချက်ချင်း ရှာဖွေပေးပါတယ်။

### Custom evaluation functions (စိတ်ကြိုက် ပြင်ဆင်နိုင်သော evaluation functions)

[`repl.REPLServer`][] အသစ်တစ်ခု ဖန်တီးတဲ့အခါ — custom evaluation function တစ်ခုကို
ထည့်ပေးနိုင်ပါတယ်။ ဥပမာ — လုံးဝ စိတ်ကြိုက် ပြင်ဆင်ထားတဲ့ REPL application တွေကို
အကောင်အထည်ဖော်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။

Evaluation function တစ်ခုက အောက်ပါ argument လေးခုကို လက်ခံပါတယ်:

* `code` {string} Execute လုပ်ရမယ့် code (ဥပမာ — `1 + 1`)။
* `context` {Object} Code ကို execute လုပ်တဲ့ context ပါ။ `useGlobal` option ပေါ် မူတည်ပြီး
  — JavaScript ရဲ့ `global` context ဖြစ်နိုင်သလို၊ REPL instance အတွက် သီးသန့်ဖြစ်တဲ့
  context တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။
* `replResourceName` {string} လက်ရှိ code evaluation နဲ့ ဆက်စပ်နေတဲ့ REPL resource အတွက်
  identifier တစ်ခုပါ။ Debugging လုပ်ရာမှာ အသုံးဝင်နိုင်ပါတယ်။
* `callback` {Function} Code evaluation ပြီးဆုံးတာနဲ့ ခေါ်ပေးရမယ့် function ပါ။ ဒီ
  callback က parameter နှစ်ခုကို လက်ခံပါတယ်:
  * Evaluation အတွင်း error တစ်ခု ဖြစ်ခဲ့ရင် ပေးရမယ့် error object — error မရှိရင်
    `null`/`undefined` ဖြစ်ပါတယ်။
  * Code evaluation ရဲ့ ရလဒ် (error ပေးထားရင် ဒါက သက်ဆိုင်မှု မရှိပါဘူး)။

အောက်က ဥပမာက ပေးလိုက်တဲ့ ဂဏန်းတစ်လုံးရဲ့ နှစ်ထပ်ကိန်းကို တွက်ပေးတဲ့ REPL တစ်ခုကို
ပြသထားပြီး — ပေးလိုက်တဲ့ input က တကယ့် ဂဏန်း မဟုတ်ဘူးဆိုရင် error တစ်ခုကို အစား
ရိုက်ထုတ်ပေးပါတယ်:

```mjs
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(code, context, replResourceName, callback) {
  if (isNaN(code)) {
    callback(new Error(`${code.trim()} is not a number`));
  } else {
    callback(null, byThePowerOfTwo(code));
  }
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```cjs
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(code, context, replResourceName, callback) {
  if (isNaN(code)) {
    callback(new Error(`${code.trim()} is not a number`));
  } else {
    callback(null, byThePowerOfTwo(code));
  }
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

#### Recoverable errors (ပြန်လည် ပြုပြင်နိုင်သော error များ)

REPL prompt မှာ `Enter` နှိပ်လိုက်ရင် — လက်ရှိ ရိုက်ထည့်ထားတဲ့ input line ကို `eval`
function ဆီကို ပို့ပေးပါတယ်။ Multi-line input တွေကို ပံ့ပိုးနိုင်ဖို့ — `eval` function က
ပေးထားတဲ့ callback function ဆီကို `repl.Recoverable` ရဲ့ instance တစ်ခု ပြန်ပို့နိုင်ပါတယ်:

```js
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Customizing REPL output (REPL output ကို စိတ်ကြိုက် ပြင်ဆင်ခြင်း)

ပုံမှန်အားဖြင့် [`repl.REPLServer`][] instance တွေက output ကို ပေးထားတဲ့ `Writable`
stream (`process.stdout` — ပုံမှန်) ဆီကို မရေးခင် [`util.inspect()`][] method သုံးပြီး
format လုပ်ပါတယ်။ `showProxy` inspection option ကို ပုံမှန် `true` ထားပြီး — `colors`
option ကတော့ REPL ရဲ့ `useColors` option ပေါ် မူတည်ပြီး `true` ဖြစ်ပါတယ်။

`useColors` boolean option ကို တည်ဆောက်ချိန်မှာ သတ်မှတ်နိုင်ပြီး — default writer ကို
[`util.inspect()`][] method ရဲ့ output ကို အရောင်ခြယ်ဖို့ ANSI style codes တွေ သုံးစေနိုင်ပါတယ်။

REPL ကို standalone program အနေနဲ့ run လုပ်ရင် — REPL အတွင်းကနေပဲ REPL ရဲ့
[inspection defaults][`util.inspect()`] ကို ပြောင်းလဲဖို့လည်း ဖြစ်နိုင်ပါတယ် — [`util.inspect()`][]
ရဲ့ `defaultOptions` ကို မှန်ကန်စွာ ထင်ဟပ်ပေးတဲ့ `inspect.replDefaults` property ကို သုံးပြီး
ပြောင်းလဲနိုင်ပါတယ်။

```console
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```

[`repl.REPLServer`][] instance တစ်ခုရဲ့ output ကို အပြည့်အဝ စိတ်ကြိုက် ပြင်ဆင်ချင်ရင် —
တည်ဆောက်ချိန်မှာ `writer` option အတွက် function အသစ်တစ်ခု ထည့်ပေးပါ။ ဥပမာ — အောက်က
ဥပမာက ရိုက်ထည့်လိုက်တဲ့ စာသားတွေကို upper case (စာလုံးကြီး) အဖြစ် ရိုးရိုးရှင်းရှင်း
ပြောင်းပေးတာပါ:

```mjs
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```cjs
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

## Class: `REPLServer`

* `options` {Object|string} See [`repl.start()`][]
* Extends: {readline.Interface}

`repl.REPLServer` instance တွေကို [`repl.start()`][] method နဲ့ ဖြစ်စေ၊ JavaScript ရဲ့
`new` keyword ကို တိုက်ရိုက် သုံးပြီး ဖြစ်စေ ဖန်တီးပါတယ်။

```mjs
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```cjs
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

### Event: `'exit'`

`'exit'` event ကို REPL ထဲကနေ ထွက်လိုက်တဲ့အခါ emit လုပ်ပါတယ် — `.exit` command ကို input
အနေနဲ့ လက်ခံရရှိတာ ဖြစ်စေ၊ သုံးစွဲသူက `Ctrl`+`C` ကို နှစ်ခါ နှိပ်ပြီး `SIGINT` ကို
အချက်ပြတာ ဖြစ်စေ၊ (သို့) `Ctrl`+`D` ကို နှိပ်ပြီး input stream ပေါ်မှာ `'end'` ကို
အချက်ပြတာ ဖြစ်စေ ဖြစ်ပါတယ်။ Listener callback ကို argument ဘာမှ မပါဘဲ ခေါ်ပေးပါတယ်။

```js
replServer.on('exit', () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
```

### Event: `'reset'`

`'reset'` event ကို REPL ရဲ့ context ကို ပြန်သတ်မှတ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `.clear`
command ကို input အနေနဲ့ လက်ခံရရှိတိုင်း ဒီလို ဖြစ်ပေါ်ပါတယ် — REPL က default evaluator ကို
သုံးနေပြီး `repl.REPLServer` instance ကို `useGlobal` option `true` နဲ့ ဖန်တီးထားတယ်ဆိုရင်တော့
ကလွဲပါတယ်။ Listener callback ကို `context` object ရဲ့ reference တစ်ခုတည်းကိုပဲ argument
အနေနဲ့ ယူပြီး ခေါ်ပေးပါတယ်။

ဒါကို အဓိကအားဖြင့် — REPL context ကို ကြိုသတ်မှတ်ထားတဲ့ state တစ်ခုဆီကို ပြန်လည်
initialize လုပ်ဖို့ သုံးနိုင်ပါတယ်:

```mjs
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```cjs
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

ဒီ code ကို run လုပ်တဲ့အခါ — global `'m'` variable ကို ပြောင်းလဲလို့ရပေမယ့် `.clear`
command ကို သုံးပြီး မူလ တန်ဖိုးဆီကို ပြန်သတ်မှတ်လို့ရပါတယ်:

```console
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```

### `replServer.defineCommand(keyword, cmd)`

* `keyword` {string} Command ရဲ့ keyword ပါ (ရှေ့ဆုံးက `.` character _မပါဘဲ_)။
* `cmd` {Object|Function} Command ကို process လုပ်တဲ့အခါ ခေါ်ပေးရမယ့် function ပါ။

`replServer.defineCommand()` method ကို REPL instance ထဲကို `.`-prefixed command အသစ်တွေ
ထပ်ထည့်ဖို့ သုံးပါတယ်။ ဒီလို command တွေကို — `keyword` ရဲ့ ရှေ့မှာ `.` တစ်လုံး ရိုက်ပြီး
ခေါ်ပါတယ်။ `cmd` က `Function` တစ်ခု ဖြစ်နိုင်သလို — အောက်ပါ properties တွေ ပါတဲ့
`Object` တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်:

* `help` {string} `.help` ရိုက်ထည့်တဲ့အခါ ပြသပေးရမယ့် အကူအညီ စာသား (Optional)။
* `action` {Function} Execute လုပ်ရမယ့် function — string argument တစ်ခုတည်းကို
  optional အနေနဲ့ လက်ခံပါတယ်။

အောက်က ဥပမာက REPL instance ထဲကို command အသစ် နှစ်ခု ထပ်ထည့်ထားတာကို ပြသပါတယ်:

```mjs
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```cjs
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

ပြီးရင် ဒီ command အသစ်တွေကို REPL instance အတွင်းကနေ အောက်ပါအတိုင်း သုံးလို့ရပါတယ်:

```console
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])`

* `preserveCursor` {boolean}

`replServer.displayPrompt()` method က REPL instance ကို သုံးစွဲသူဆီက input ရယူဖို့
အသင့်ဖြစ်စေပါတယ် — သတ်မှတ်ထားတဲ့ `prompt` ကို `output` ထဲမှာ စာကြောင်းအသစ်တစ်ကြောင်းအဖြစ်
ရိုက်ထုတ်ပြီး input အသစ်တွေ လက်ခံနိုင်ဖို့ `input` ကို ပြန်စလုပ်ပေးပါတယ်။

Multi-line input တစ်ခု ရိုက်ထည့်နေချိန်မှာတော့ `'prompt'` အစား pipe `'|'` ကို ရိုက်ထုတ်ပေးပါတယ်။

`preserveCursor` က `true` ဆိုရင် — cursor နေရာကို `0` ဆီကို ပြန်မသတ်မှတ်တော့ပါဘူး။

`replServer.displayPrompt` method ကို အဓိကအားဖြင့် — `replServer.defineCommand()` method နဲ့
မှတ်ပုံတင်ထားတဲ့ command တွေရဲ့ action function အတွင်းကနေ ခေါ်ဖို့ ရည်ရွယ်ထားပါတယ်။

### `replServer.clearBufferedCommand()`

`replServer.clearBufferedCommand()` method က buffer လုပ်ထားပြီး မှ execute မလုပ်ရသေးတဲ့
command တစ်ခုခုကို ရှင်းလင်းပစ်ပါတယ်။ ဒီ method ကို အဓိကအားဖြင့် —
`replServer.defineCommand()` method နဲ့ မှတ်ပုံတင်ထားတဲ့ command တွေရဲ့ action function
အတွင်းကနေ ခေါ်ဖို့ ရည်ရွယ်ထားပါတယ်။

### `replServer.setupHistory(historyConfig, callback)`

* `historyConfig` {Object|string} history file ရဲ့ path ပါ။ String တစ်ခုဆိုရင် — အဲဒါက
  history file ရဲ့ path ဖြစ်ပြီး object တစ်ခုဆိုရင် အောက်ပါ properties တွေ ပါနိုင်ပါတယ်:
  * `filePath` {string} History file ရဲ့ path ပါ။
  * `size` {number} သိမ်းဆည်းထားမယ့် history lines အများဆုံး အရေအတွက်ပါ။ History ကို
    ပိတ်ထားချင်ရင် ဒီတန်ဖိုးကို `0` လို့ သတ်မှတ်ပါ။ ဒီ option က `terminal` ကို သုံးစွဲသူက
    ဖြစ်စေ၊ internal `output` စစ်ဆေးမှုကနေ ဖြစ်စေ `true` လို့ သတ်မှတ်ထားမှသာ
    အဓိပ္ပာယ်ရှိပါတယ် — မဟုတ်ရင် history caching ယန္တရားကို လုံးဝ initialize မလုပ်ပါဘူး။
    **Default:** `30`။
  * `removeHistoryDuplicates` {boolean} `true` ဆိုရင် — history list ထဲကို ထည့်လိုက်တဲ့
    input line အသစ်တစ်ခုက အရင် line ဟောင်းတစ်ခုနဲ့ တူနေရင် — ပိုဟောင်းတဲ့ line ကို
    စာရင်းထဲကနေ ဖယ်ရှားပစ်ပါတယ်။ **Default:** `false`။
  * `onHistoryFileLoaded` {Function} History ရေးသားမှုတွေ အသင့်ဖြစ်တဲ့အခါ (သို့) error
    ဖြစ်တဲ့အခါ ခေါ်ပေးပါတယ်။
    * `err` {Error}
    * `repl` {repl.REPLServer}
* `callback` {Function} History ရေးသားမှုတွေ အသင့်ဖြစ်တဲ့အခါ (သို့) error ဖြစ်တဲ့အခါ
  ခေါ်ပေးပါတယ် (`historyConfig` ထဲမှာ `onHistoryFileLoaded` အနေနဲ့ ပေးထားရင် optional)။
  * `err` {Error}
  * `repl` {repl.REPLServer}

REPL instance အတွက် history log file တစ်ခုကို initialize လုပ်ပေးပါတယ်။ Node.js binary ကို
run လုပ်ပြီး command-line REPL ကို သုံးတဲ့အခါ — history file တစ်ခုကို ပုံမှန်အားဖြင့်
initialize လုပ်ပေးပါတယ်။ ဒါပေမယ့် — REPL တစ်ခုကို programmatically (program ကနေ) ဖန်တီးတဲ့အခါမှာတော့
ဒီလို မဟုတ်ပါဘူး။ REPL instance တွေနဲ့ programmatically အလုပ်လုပ်တဲ့အခါ — history log file
တစ်ခုကို initialize လုပ်ဖို့ ဒီ method ကို သုံးပါ။

## `repl.builtinModules`

> Stability: 0 - Deprecated. Use [`module.builtinModules`][] instead.

* Type: {string\[]}

Node.js module တချို့ရဲ့ နာမည်တွေ ပါဝင်တဲ့ စာရင်းတစ်ခုပါ — ဥပမာ `'http'` စသဖြင့် ဖြစ်ပါတယ်။

Automated migration (အလိုအလျောက် ပြောင်းရွှေ့ခြင်း) တစ်ခု ရနိုင်ပါတယ်
([ရင်းမြစ်](https://github.com/nodejs/userland-migrations/tree/main/recipes/repl-builtin-modules)):

```bash
npx codemod@latest @nodejs/repl-builtin-modules
```

## `repl.start([options])`

* `options` {Object|string}
  * `prompt` {string} ပြသပေးရမယ့် input prompt ပါ။ **Default:** `'> '`
    (နောက်မှာ space တစ်ခု ပါပါတယ်)။
  * `input` {stream.Readable} REPL input ကို ဖတ်ယူမယ့် `Readable` stream ပါ။
    **Default:** `process.stdin`။
  * `output` {stream.Writable} REPL output ကို ရေးထုတ်မယ့် `Writable` stream ပါ။
    **Default:** `process.stdout`။
  * `terminal` {boolean} `true` ဆိုရင် — `output` ကို TTY terminal တစ်ခုအနေနဲ့
    သဘောထားသင့်ကြောင်း သတ်မှတ်ပေးပါတယ်။ **Default:** instance ဖန်တီးချိန်မှာ
    `output` stream ပေါ်က `isTTY` property ရဲ့ တန်ဖိုးကို စစ်ဆေးပါတယ်။
  * `eval` {Function} Input line တစ်ကြောင်းချင်းစီကို အကဲဖြတ်တဲ့အခါ သုံးရမယ့်
    function ပါ။ **Default:** JavaScript `eval()` function အတွက် async wrapper တစ်ခုပါ။
    `eval` function က input မပြည့်စုံဘူးဆိုတာ ညွှန်ပြပြီး နောက်ထပ် line တွေ ထပ်မေးမြန်းဖို့
    `repl.Recoverable` နဲ့ error ထုတ်ပေးနိုင်ပါတယ်။ အသေးစိတ်ကို [custom evaluation functions][]
    section မှာ ကြည့်ပါ။
  * `useColors` {boolean} `true` ဆိုရင် — default `writer` function က REPL output မှာ
    ANSI color styling တွေ ထည့်ပေးပါတယ်။ Custom `writer` function တစ်ခု ပေးထားရင် ဒါက
    သက်ရောက်မှု မရှိပါဘူး။ **Default:** REPL instance ရဲ့ `terminal` တန်ဖိုး `true`
    ဆိုရင် `output` stream ပေါ်က color ပံ့ပိုးမှုကို စစ်ဆေးပါတယ်။
  * `useGlobal` {boolean} `true` ဆိုရင် — default evaluation function က REPL instance
    အတွက် context အသစ် တစ်ခု သီးခြား ဖန်တီးမယ့်အစား JavaScript ရဲ့ `global` ကိုပဲ
    context အဖြစ် သုံးပါလိမ့်မယ်။ Node.js CLI REPL က ဒီတန်ဖိုးကို `true` လို့
    သတ်မှတ်ပါတယ်။ **Default:** `false`။
  * `ignoreUndefined` {boolean} `true` ဆိုရင် — default writer က command တစ်ခုရဲ့ ပြန်တန်ဖိုး
    `undefined` ဖြစ်နေရင် အဲဒါကို output ထုတ်ပေးမှာ မဟုတ်ပါဘူး။ **Default:** `false`။
  * `writer` {Function} `output` ဆီကို မရေးခင် command တစ်ခုချင်းစီရဲ့ output ကို
    format လုပ်ဖို့ ခေါ်ပေးရမယ့် function ပါ။ **Default:** [`util.inspect()`][]။
  * `completer` {Function} Custom Tab auto completion အတွက် optional function တစ်ခုပါ။
    ဥပမာတစ်ခုအတွက် [`readline.InterfaceCompleter`][] ကို ကြည့်ပါ။
  * `replMode` {symbol} Default evaluator က JavaScript command တွေ အားလုံးကို strict mode
    မှာ လား၊ default (sloppy) mode မှာ လား execute လုပ်မယ်ဆိုတာ သတ်မှတ်ပေးတဲ့ flag ပါ။
    လက်ခံနိုင်တဲ့ တန်ဖိုးတွေကတော့:
    * Expressions တွေကို sloppy mode မှာ အကဲဖြတ်ဖို့ `repl.REPL_MODE_SLOPPY`။
    * Expressions တွေကို strict mode မှာ အကဲဖြတ်ဖို့ `repl.REPL_MODE_STRICT` — ဒါက
      repl statement တိုင်းရဲ့ ရှေ့မှာ `'use strict'` ထည့်လိုက်တာနဲ့ ညီမျှပါတယ်။
  * `breakEvalOnSigint` {boolean} `SIGINT` လက်ခံရရှိတဲ့အခါ — ဥပမာ `Ctrl`+`C` နှိပ်လိုက်တဲ့အခါ —
    လက်ရှိ run နေတဲ့ code အပိုင်းကို ရပ်တန့်ပစ်ပါတယ်။ Custom `eval` function တစ်ခုနဲ့
    တွဲသုံးလို့ မရပါဘူး။ **Default:** `false`။
  * `preview` {boolean} REPL က autocomplete နဲ့ output preview တွေကို ပြသမလား၊ မပြသဘူးလား
    ဆိုတာ သတ်မှတ်ပေးပါတယ်။ **Default:** default eval function နဲ့ ဆိုရင် `true` ဖြစ်ပြီး —
    custom eval function သုံးထားရင် `false` ဖြစ်ပါတယ်။ `terminal` က falsy ဆိုရင် —
    preview လုံးဝ မရှိဘဲ `preview` ရဲ့ တန်ဖိုးက သက်ရောက်မှု မရှိပါဘူး။
  * `handleError` {Function} ဒီ function က REPL ထဲက error ကိုင်တွယ်မှုကို စိတ်ကြိုက်
    ပြင်ဆင်ပေးပါတယ်။ သူက ပထမဆုံး argument အနေနဲ့ throw လုပ်လိုက်တဲ့ exception ကို
    လက်ခံပြီး — အောက်ပါ တန်ဖိုးတွေထဲက တစ်ခုကို synchronously ပြန်ပေးရပါတယ်:
    * Error ကို output stream ဆီကို ရိုက်ထုတ်ဖို့ `'print'` (ပုံမှန် အပြုအမူ)။
    * ကျန်တဲ့ error ကိုင်တွယ်မှု အားလုံးကို ကျော်သွားဖို့ `'ignore'`။
    * Exception ကို လုံးဝ unhandled အဖြစ် သဘောထားဖို့ `'unhandled'` — ဒီကိစ္စမှာ error ကို
      [`'uncaughtException'`][] event လိုမျိုး process တစ်ခုလုံး အတိုင်းအတာနဲ့ exception
      handlers တွေဆီကို ပို့ပေးပါလိမ့်မယ်။ `REPLServer` instance ကို ပိတ်ပြီးသား ဖြစ်နေတဲ့
      အခြေအနေတွေမှာ `'unhandled'` တန်ဖိုးက use case ပေါ် မူတည်ပြီး နှစ်လိုဖွယ် ဖြစ်ချင်မှ
      ဖြစ်ပါလိမ့်မယ်။
* Returns: {repl.REPLServer}

`repl.start()` method က [`repl.REPLServer`][] instance တစ်ခုကို ဖန်တီးပြီး စတင်ပေးပါတယ်။

`options` က string တစ်ခုဆိုရင် — အဲဒါက input prompt ကို သတ်မှတ်ပေးတာပါ:

```mjs
import repl from 'node:repl';

// a Unix style prompt
repl.start('$ ');
```

```cjs
const repl = require('node:repl');

// a Unix style prompt
repl.start('$ ');
```

## Node.js ရဲ့ REPL (The Node.js REPL)

Node.js ကိုယ်တိုင်က JavaScript တွေ execute လုပ်ဖို့ ကိုယ်ပိုင် interactive interface တစ်ခု
ပေးဖို့ `node:repl` module ကို အသုံးပြုပါတယ်။ Node.js binary ကို argument ဘာမှ မပါဘဲ
(သို့) `-i` argument နဲ့ run လုပ်ခြင်းဖြင့် ဒါကို သုံးနိုင်ပါတယ်:

```console
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```

### Environment variable options (environment variable option များ)

Node.js REPL ရဲ့ အပြုအမူ အမျိုးမျိုးကို အောက်ပါ environment variables တွေနဲ့
စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်:

* `NODE_REPL_HISTORY`: တရားဝင်တဲ့ path တစ်ခု ပေးထားရင် — persistent REPL history ကို
  သုံးစွဲသူရဲ့ home directory ထဲက `.node_repl_history` မှာ သိမ်းမယ့်အစား သတ်မှတ်ထားတဲ့
  file ထဲမှာ သိမ်းဆည်းပါလိမ့်မယ်။ ဒီတန်ဖိုးကို `''` (empty string) လို့ သတ်မှတ်ရင် —
  persistent REPL history ကို ပိတ်လိုက်ပါလိမ့်မယ်။ တန်ဖိုးရဲ့ ရှေ့ဆုံး/နောက်ဆုံးက whitespace
  တွေကို ဖြတ်တောက်ပါလိမ့်မယ်။ Windows platforms တွေမှာ empty value ရှိတဲ့ environment
  variables တွေက တရားဝင် မဟုတ်တာမို့ — persistent REPL history ကို ပိတ်ဖို့ ဒီ variable ကို
  space တစ်လုံး (သို့) အများကြီးနဲ့ သတ်မှတ်ပေးပါ။
* `NODE_REPL_HISTORY_SIZE`: History ရရှိနိုင်ရင် history lines ဘယ်နှစ်ကြောင်း ထိန်းသိမ်း
  သိမ်းဆည်းမလဲ ဆိုတာကို ထိန်းချုပ်ပါတယ်။ Positive number တစ်ခု ဖြစ်ရပါမယ်။
  **Default:** `1000`။
* `NODE_REPL_MODE`: `'sloppy'` (သို့) `'strict'` ဖြစ်နိုင်ပါတယ်။ **Default:**
  `'sloppy'` — non-strict mode code တွေ run ခွင့်ပြုပါတယ်။

### Persistent history (session များကြား ဆက်တည်သော history)

ပုံမှန်အားဖြင့် Node.js REPL က — သုံးစွဲသူရဲ့ home directory ထဲမှာရှိတဲ့
`.node_repl_history` file ထဲကို inputs တွေ သိမ်းဆည်းပြီး `node` REPL session တွေကြားမှာ
history ကို ဆက်တည်စေပါတယ်။ `NODE_REPL_HISTORY=''` ဆိုတဲ့ environment variable ကို
သတ်မှတ်ခြင်းဖြင့် ဒါကို ပိတ်နိုင်ပါတယ်။

### Advanced line-editors တွေနဲ့ Node.js REPL ကို သုံးခြင်း (Using the Node.js REPL with advanced line-editors)

Advanced line-editors တွေအတွက် — Node.js ကို `NODE_NO_READLINE=1` ဆိုတဲ့ environment
variable နဲ့ စတင်ပါ။ ဒါက main နဲ့ debugger REPL ကို canonical terminal settings တွေနဲ့
စတင်စေပြီး — `rlwrap` နဲ့ တွဲသုံးလို့ရအောင် လုပ်ပေးပါတယ်။

ဥပမာ — အောက်ပါတို့ကို `.bashrc` file တစ်ခုထဲမှာ ထည့်နိုင်ပါတယ်:

```bash
alias node="env NODE_NO_READLINE=1 rlwrap node"
```

### Process တစ်ခုထဲမှာ REPL instance အများအပြား စတင်ခြင်း (Starting multiple REPL instances in the same process)

Node.js instance တစ်ခုတည်းကို run နေတုန်း — အဲဒီထဲမှာ REPL instance အများအပြားကို
ဖန်တီး run လုပ်ဖို့ ဖြစ်နိုင်ပါတယ် — `global` object တစ်ခုတည်းကို အားလုံးက မျှဝေသုံးပြီး
(`useGlobal` option ကို `true` လို့ သတ်မှတ်ခြင်းဖြင့်) — I/O interface တွေကတော့ သီးခြားစီ
ရှိပါတယ်။

ဥပမာ — အောက်က ဥပမာက `stdin`၊ Unix socket တစ်ခုနဲ့ TCP socket တစ်ခုပေါ်မှာ REPL တွေကို
သီးခြားစီ ပေးထားပြီး — `global` object တစ်ခုတည်းကိုပဲ အားလုံး မျှဝေသုံးပါတယ်:

```mjs
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';
import fs from 'node:fs';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  useGlobal: true,
  input: process.stdin,
  output: process.stdout,
});

const unixSocketPath = '/tmp/node-repl-sock';

// If the socket file already exists let's remove it
fs.rmSync(unixSocketPath, { force: true });

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    useGlobal: true,
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(unixSocketPath);

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    useGlobal: true,
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```cjs
const net = require('node:net');
const repl = require('node:repl');
const fs = require('node:fs');

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  useGlobal: true,
  input: process.stdin,
  output: process.stdout,
});

const unixSocketPath = '/tmp/node-repl-sock';

// If the socket file already exists let's remove it
fs.rmSync(unixSocketPath, { force: true });

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    useGlobal: true,
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(unixSocketPath);

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    useGlobal: true,
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

ဒီ application ကို command line ကနေ run လုပ်ရင် — stdin ပေါ်မှာ REPL တစ်ခု စတင်ပါလိမ့်မယ်။
တခြား REPL clients တွေက Unix socket (သို့) TCP socket ကနေတစ်ဆင့် ချိတ်ဆက်လို့ရပါတယ်။
ဥပမာ — `telnet` က TCP sockets တွေဆီ ချိတ်ဆက်ဖို့ အသုံးဝင်ပြီး — `socat` ကိုတော့ Unix နဲ့
TCP sockets နှစ်ခုလုံးဆီ ချိတ်ဆက်ဖို့ သုံးနိုင်ပါတယ်။

stdin အစား Unix socket အခြေပြု server တစ်ခုကနေ REPL ကို စတင်ခြင်းဖြင့် — process ကို
ပြန်မစဘဲ ကြာကြာ run နေတဲ့ Node.js process တစ်ခုဆီကို ချိတ်ဆက်ဖို့ ဖြစ်နိုင်ပါတယ်။

### ဥပမာများ (Examples)

#### `net.Server` နဲ့ `net.Socket` ပေါ်မှာ full-featured "terminal" REPL (Full-featured "terminal" REPL over `net.Server` and `net.Socket`)

ဒါက [`net.Server`][] နဲ့ [`net.Socket`][] ကို သုံးပြီး "full-featured" (terminal) REPL
တစ်ခုကို ဘယ်လို run လုပ်မလဲဆိုတဲ့ ဥပမာပါ။

အောက်က script က port `1337` ပေါ်မှာ HTTP server တစ်ခုကို စတင်ပြီး — clients တွေ သူ့ရဲ့
REPL instance ဆီကို socket connection တွေ တည်ဆောက်နိုင်အောင် ခွင့်ပြုပေးပါတယ်။

```mjs
// repl-server.js
import repl from 'node:repl';
import net from 'node:net';

net
  .createServer((socket) => {
    const r = repl.start({
      prompt: `socket ${socket.remoteAddress}:${socket.remotePort}> `,
      input: socket,
      output: socket,
      terminal: true,
      useGlobal: false,
    });
    r.on('exit', () => {
      socket.end();
    });
    r.context.socket = socket;
  })
  .listen(1337);
```

```cjs
// repl-server.js
const repl = require('node:repl');
const net = require('node:net');

net
  .createServer((socket) => {
    const r = repl.start({
      prompt: `socket ${socket.remoteAddress}:${socket.remotePort}> `,
      input: socket,
      output: socket,
      terminal: true,
      useGlobal: false,
    });
    r.on('exit', () => {
      socket.end();
    });
    r.context.socket = socket;
  })
  .listen(1337);
```

အောက်က ဥပမာကတော့ — အပေါ်က သတ်မှတ်ထားတဲ့ server နဲ့ port `1337` ပေါ်ကနေတစ်ဆင့် socket
connection တစ်ခု ဖန်တီးနိုင်တဲ့ client တစ်ခုကို အကောင်အထည်ဖော်ပေးပါတယ်။

```mjs
// repl-client.js
import net from 'node:net';
import process from 'node:process';

const sock = net.connect(1337);

process.stdin.pipe(sock);
sock.pipe(process.stdout);

sock.on('connect', () => {
  process.stdin.resume();
  process.stdin.setRawMode(true);
});

sock.on('close', () => {
  process.stdin.setRawMode(false);
  process.stdin.pause();
  sock.removeListener('close', done);
});

process.stdin.on('end', () => {
  sock.destroy();
  console.log();
});

process.stdin.on('data', (b) => {
  if (b.length === 1 && b[0] === 4) {
    process.stdin.emit('end');
  }
});
```

```cjs
// repl-client.js
const net = require('node:net');

const sock = net.connect(1337);

process.stdin.pipe(sock);
sock.pipe(process.stdout);

sock.on('connect', () => {
  process.stdin.resume();
  process.stdin.setRawMode(true);
});

sock.on('close', () => {
  process.stdin.setRawMode(false);
  process.stdin.pause();
  sock.removeListener('close', done);
});

process.stdin.on('end', () => {
  sock.destroy();
  console.log();
});

process.stdin.on('data', (b) => {
  if (b.length === 1 && b[0] === 4) {
    process.stdin.emit('end');
  }
});
```

ဒီဥပမာကို run ဖို့ — သင့်စက်ပေါ်မှာ terminal နှစ်ခု ဖွင့်ပြီး terminal တစ်ခုမှာ
`node repl-server.js` နဲ့ server ကို စတင်ပြီး နောက်တစ်ခုမှာ `node repl-client.js` ကို run လုပ်ပါ။

မူရင်း code က <https://gist.github.com/TooTallNate/2209310> ကနေ ယူထားတာပါ။

#### `curl` ကနေတစ်ဆင့် REPL (REPL over `curl`)

ဒါက [`curl()`][] ပေါ်မှာ REPL instance တစ်ခုကို ဘယ်လို run လုပ်မလဲဆိုတဲ့ ဥပမာပါ။

အောက်က script က port `8000` ပေါ်မှာ HTTP server တစ်ခုကို စတင်ပြီး — [`curl()`][] ကနေတစ်ဆင့်
တည်ဆောက်တဲ့ connection တစ်ခုကို လက်ခံနိုင်ပါတယ်။

```mjs
import http from 'node:http';
import repl from 'node:repl';

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'multipart/octet-stream');

  repl.start({
    prompt: 'curl repl> ',
    input: req,
    output: res,
    terminal: false,
    useColors: true,
    useGlobal: false,
  });
});

server.listen(8000);
```

```cjs
const http = require('node:http');
const repl = require('node:repl');

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'multipart/octet-stream');

  repl.start({
    prompt: 'curl repl> ',
    input: req,
    output: res,
    terminal: false,
    useColors: true,
    useGlobal: false,
  });
});

server.listen(8000);
```

အပေါ်က script run နေတုန်း `curl --no-progress-meter -sSNT. localhost:8000` ကို run ခြင်းဖြင့်
[`curl()`][] ကို သုံးပြီး server ဆီကို ချိတ်ဆက်ကာ — သူ့ရဲ့ REPL instance နဲ့ ချိတ်ဆက်လို့ရပါတယ်။

**Warning** ဒီဥပမာက Node.js REPLs တွေကို မတူညီတဲ့ I/O streams တွေနဲ့ ဘယ်လို စတင်နိုင်တယ်
ဆိုတာ ပြသဖို့ ပညာရေးဆိုင်ရာ ရည်ရွယ်ချက်အတွက်ပဲ ဖြစ်ပါတယ်။ Production environments
(သို့) လုံခြုံရေး အရေးပါတဲ့ ဘယ် context မှာမဆို — ထပ်ဆောင်း ကာကွယ်မှု အစီအမံတွေ မပါဘဲ
ဒါကို သုံးစွဲခြင်း မပြုသင့်ပါဘူး။ Real-world application တစ်ခုထဲမှာ REPLs တွေ
အကောင်အထည်ဖော်ဖို့ လိုအပ်ရင် — secure input ယန္တရားတွေ သုံးခြင်း၊ open network interfaces
တွေကို ရှောင်ကြဉ်ခြင်း စတဲ့ ဒီအန္တရာယ်တွေကို လျှော့ချပေးနိုင်တဲ့ အခြားနည်းလမ်းတွေကို
ဆင်ခြင်ကြည့်ပါ။

မူရင်း code က <https://gist.github.com/TooTallNate/2053342> ကနေ ယူထားတာပါ။

[TTY keybindings]: readline.md#tty-keybindings
[ZSH]: https://en.wikipedia.org/wiki/Z_shell
[`'uncaughtException'`]: process.md#event-uncaughtexception
[`--no-experimental-repl-await`]: cli.md#--no-experimental-repl-await
[`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`]: errors.md#err_domain_cannot_set_uncaught_exception_capture
[`ERR_INVALID_REPL_INPUT`]: errors.md#err_invalid_repl_input
[`curl()`]: https://curl.haxx.se/docs/manpage.html
[`domain`]: domain.md
[`module.builtinModules`]: module.md#modulebuiltinmodules
[`net.Server`]: net.md#class-netserver
[`net.Socket`]: net.md#class-netsocket
[`process.setUncaughtExceptionCaptureCallback()`]: process.md#processsetuncaughtexceptioncapturecallbackfn
[`readline.InterfaceCompleter`]: readline.md#use-of-the-completer-function
[`repl.ReplServer`]: #class-replserver
[`repl.start()`]: #replstartoptions
[`reverse-i-search`]: #reverse-i-search
[`util.inspect()`]: util.md#utilinspectobject-options
[custom evaluation functions]: #custom-evaluation-functions
[stream]: stream.md
