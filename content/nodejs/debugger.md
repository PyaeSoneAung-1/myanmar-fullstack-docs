---
title: "Debugger"
description: "Node.js ရဲ့ command-line debugger — node inspect (interactive mode) နဲ့ --probe ကို သုံးတဲ့ non-interactive probe mode (printf-style debugging နဲ့ structured JSON output) အပြင် V8 inspector integration အကြောင်း။"
order: 116
source: "https://nodejs.org/api/debugger.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

Node.js မှာ command-line debugging utility တစ်ခု ပါဝင်ပါတယ်။ Node.js debugger client က အင်္ဂါရပ်အပြည့်အစုံ ပါတဲ့ debugger တစ်ခု မဟုတ်ပေမယ့် — ရိုးရှင်းတဲ့ stepping (တစ်ကြောင်းချင်း လှမ်းခြင်း) နဲ့ inspection (စစ်ဆေးကြည့်ရှုခြင်း) တွေကိုတော့ လုပ်ဆောင်နိုင်ပါတယ်။

Debugger က လည်ပတ်မှု mode နှစ်မျိုးကို support လုပ်ပါတယ်: [interactive mode][] နဲ့ [non-interactive probe mode][] တို့ပါ။

## Interactive mode (အပြန်အလှန် ဆက်သွယ်သည့် mode)

```console
$ node inspect [--port=<port>] [<node-option> ...] [<script> [<script-args>] | <host>:<port> | -p <pid>]
```

အသုံးပြုဖို့ — debug လုပ်ချင်တဲ့ script ရဲ့ path နောက်မှာ `inspect` argument ကို ထည့်ပြီး Node.js ကို စတင်ပါ။

```console
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< For help, see: https://nodejs.org/learn/getting-started/debugging
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```

Debugger က ပထမဆုံး executable line ပေါ်မှာ အလိုအလျောက် break လုပ်ပါတယ်။ ပထမဆုံး breakpoint (ဒီ [`debugger`][] statement နဲ့ သတ်မှတ်ထားတဲ့) အထိ run ချင်ရင်တော့ — `NODE_INSPECT_RESUME_ON_START` environment variable ကို `1` လို့ သတ်မှတ်ပါ။

```console
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< For help, see: https://nodejs.org/learn/getting-started/debugging
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```

`repl` command က code တွေကို အဝေးကနေ (remotely) evaluate လုပ်နိုင်စေပါတယ်။ `next` command က နောက် line ဆီကို လှမ်းပေးပါတယ်။ တခြား ဘယ် commands တွေ ရနိုင်လဲဆိုတာကို ကြည့်ဖို့ `help` လို့ ရိုက်ပါ။

Command တစ်ခုမှ မရိုက်ဘဲ `enter` နှိပ်လိုက်ရင် — အရင် debugger command ကို ထပ်လုပ်ဆောင်ပါလိမ့်မယ်။

### Watchers (စောင့်ကြည့်ရန် expressions များ)

Debugging လုပ်နေစဉ်မှာ expression နဲ့ variable တန်ဖိုးတွေကို စောင့်ကြည့်ဖို့ ဖြစ်နိုင်ပါတယ်။ Breakpoint တိုင်းမှာ — watchers list ထဲက expression တစ်ခုချင်းစီကို လက်ရှိ context ထဲမှာ evaluate လုပ်ပြီး breakpoint ရဲ့ source code listing မတိုင်ခင် ချက်ချင်း ဖော်ပြပါလိမ့်မယ်။

Expression တစ်ခုကို စောင့်ကြည့်ဖို့ စတင်ဖို့ — `watch('my_expression')` လို့ ရိုက်ပါ။ `watchers` command က active ဖြစ်နေတဲ့ watchers တွေကို ပုံနှိပ်ပြပါလိမ့်မယ်။ Watcher တစ်ခုကို ဖယ်ရှားဖို့ — `unwatch('my_expression')` လို့ ရိုက်ပါ။

## Command ကိုးကားချက် (Command reference)

### Stepping (တစ်ဆင့်ချင်း လှမ်းခြင်း)

* `cont`, `c`: Execution ကို ဆက်လုပ်ပါ
* `next`, `n`: နောက် line ကို လှမ်းပါ (step next)
* `step`, `s`: Function ထဲကို ဝင်ပါ (step in)
* `out`, `o`: Function ကနေ ထွက်ပါ (step out)
* `pause`: Run နေတဲ့ code ကို ခေတ္တရပ်ပါ (Developer Tools ထဲက pause ခလုတ်လိုပါ)

#### Breakpoints (breakpoint များ)

* `setBreakpoint()`, `sb()`: လက်ရှိ line ပေါ်မှာ breakpoint သတ်မှတ်ပါ
* `setBreakpoint(line)`, `sb(line)`: သတ်မှတ်ထားတဲ့ line တစ်ခုပေါ်မှာ breakpoint သတ်မှတ်ပါ
* `setBreakpoint('fn()')`, `sb(...)`: Function ရဲ့ body ထဲက ပထမဆုံး statement ပေါ်မှာ breakpoint သတ်မှတ်ပါ
* `setBreakpoint('script.js', 1)`, `sb(...)`: `script.js` ရဲ့ ပထမဆုံး line ပေါ်မှာ breakpoint သတ်မှတ်ပါ
* `setBreakpoint('script.js', 1, 'num < 4')`, `sb(...)`: `script.js` ရဲ့ ပထမဆုံး line ပေါ်မှာ — `num < 4` က `true` လို့ အကဲဖြတ်တဲ့အခါမှသာ break လုပ်မယ့် conditional breakpoint သတ်မှတ်ပါ
* `clearBreakpoint('script.js', 1)`, `cb(...)`: `script.js` ထဲက line 1 ပေါ်မှာရှိတဲ့ breakpoint ကို ရှင်းလင်းပါ

Load မဖြစ်သေးတဲ့ file (module) တစ်ခုထဲမှာလည်း breakpoint သတ်မှတ်လို့ ရပါတယ်:

```console
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/learn/getting-started/debugging
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```

ပေးထားတဲ့ expression တစ်ခုက `true` လို့ အကဲဖြတ်တဲ့အခါမှသာ break လုပ်မယ့် conditional breakpoint တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်:

```console
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/learn/getting-started/debugging
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

#### Information (အချက်အလက်များ)

* `backtrace`, `bt`: လက်ရှိ execution frame ရဲ့ backtrace ကို ပုံနှိပ်ပါ
* `list(5)`: Script ရဲ့ source code ကို line context ၅ ကြောင်း (ရှေ့ ၅ ကြောင်းနဲ့ နောက် ၅ ကြောင်း) နဲ့ စာရင်းပြပါ
* `watch(expr)`: Expression တစ်ခုကို watch list ထဲ ထည့်ပါ
* `unwatch(expr)`: Watch list ထဲက expression တစ်ခုကို ဖယ်ရှားပါ
* `unwatch(index)`: Watch list ထဲက သတ်မှတ်ထားတဲ့ index မှာရှိတဲ့ expression ကို ဖယ်ရှားပါ
* `watchers`: Watchers တွေ အားလုံးနဲ့ သူတို့ရဲ့ တန်ဖိုးတွေကို စာရင်းပြပါ (breakpoint တိုင်းမှာ အလိုအလျောက် ဖော်ပြပါတယ်)
* `repl`: Debugging လုပ်နေတဲ့ script ရဲ့ context ထဲမှာ evaluation လုပ်ဖို့ debugger ရဲ့ repl ကို ဖွင့်ပါ
* `exec expr`, `p expr`: Debugging လုပ်နေတဲ့ script ရဲ့ context ထဲမှာ expression တစ်ခုကို execute လုပ်ပြီး ၎င်းရဲ့ တန်ဖိုးကို ပုံနှိပ်ပါ
* `profile`: CPU profiling session တစ်ခု စတင်ပါ
* `profileEnd`: လက်ရှိ CPU profiling session ကို ရပ်တန့်ပါ
* `profiles`: ပြီးစီးသွားတဲ့ CPU profiling sessions တွေ အားလုံးကို စာရင်းပြပါ
* `profiles[n].save(filepath = 'node.cpuprofile')`: CPU profiling session တစ်ခုကို disk ပေါ်မှာ JSON အနေနဲ့ သိမ်းဆည်းပါ
* `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: Heap snapshot တစ်ခု ယူပြီး disk ပေါ်မှာ JSON အနေနဲ့ သိမ်းဆည်းပါ

#### Execution control (လုပ်ဆောင်မှု ထိန်းချုပ်ခြင်း)

* `run`: Script ကို run ပါ (debugger စတင်ချိန်မှာ အလိုအလျောက် run ပါတယ်)
* `restart`: Script ကို ပြန်လည် စတင်ပါ
* `kill`: Script ကို ရပ်တန့်ပါ (kill)

#### Various (အထွေထွေ)

* `scripts`: Load လုပ်ထားတဲ့ scripts တွေ အားလုံးကို စာရင်းပြပါ
* `version`: V8 ရဲ့ version ကို ပြသပါ

## Probe mode (စစ်ဆေးကြည့်ရှုသည့် mode)

> Stability: 1 - Experimental

`node inspect` က — `--probe` flag ကနေတစ်ဆင့် — application တစ်ခုထဲမှာ runtime တန်ဖိုးတွေကို စစ်ဆေးကြည့်ရှုဖို့ non-interactive probe mode ကို support လုပ်ပါတယ်။

လောလောဆယ် — probe mode က command line မှာ သတ်မှတ်ထားတဲ့ entry point script ကနေ process အသစ်တစ်ခုကို launch လုပ်တာကိုပဲ support လုပ်ပါတယ်။

Probe mode က source breakpoints တစ်ခု (သို့) တစ်ခုထက်ပိုပြီး သတ်မှတ်ပေးပြီး — execution က breakpoint တစ်ခုဆီ ရောက်တိုင်း သတ်မှတ်ထားတဲ့ expressions တွေကို evaluate လုပ်ပြီး — session ပြီးဆုံးတဲ့အခါ (ပုံမှန် ပြီးဆုံးခြင်း, error, (သို့) timeout ဘယ်ဟာ ဖြစ်ဖြစ်) evaluate လုပ်ခဲ့တဲ့ expressions တွေ အားလုံးရဲ့ နောက်ဆုံး report တစ်ခုကို ပုံနှိပ်ပေးပါတယ်။ ဒါက developers တွေကို — application code ကို ပြုပြင်စရာ (နဲ့ နောက်ပိုင်း ရှင်းလင်းစရာ) မလိုဘဲ — printf-style debugging လုပ်နိုင်စေပါတယ်။ Tools တွေ အသုံးပြုဖို့ structured JSON output ကိုလည်း support လုပ်ပါတယ်။

```console
$ node inspect --probe <file>:<line>[:<col>] --expr <expr> [--cond <expr>] [--max-hit <n>]
              [--probe <file>:<line>[:<col>] --expr <expr> [--cond <expr>] [--max-hit <n>] ...]
              [--json] [--preview] [--timeout=<ms>] [--port=<port>]
              [--] [<node-option> ...] <script> [<script-args> ...]
```

* `--probe <file>:<line>[:<col>]`: Probe ရဲ့ source location ပါ။ Execution က ဒီ location ဆီ ရောက်တဲ့အခါ — ပေးထားတဲ့ expressions တွေကို evaluate လုပ်ပြီး output ထဲမှာ ပုံနှိပ်ပေးပါတယ်။ `<file>` က probe လုပ်မယ့် script ရဲ့ URL suffix နဲ့ ကိုက်ညီပါတယ်။ `<line>` နဲ့ `<col>` နံပါတ်တွေက 1-based ဖြစ်ပါတယ်။ `<col>` ကို ချန်လှပ်ထားရင် — probe က line ပေါ်က ပထမဆုံး executable column ကို ချိတ်ပေးပါတယ်။
* `--expr <expr>`: Execution က ရှေ့က `--probe` မှာ သတ်မှတ်ထားတဲ့ location ဆီ ရောက်တိုင်း evaluate လုပ်ရမယ့် JavaScript expression ပါ။ သူနဲ့ သက်ဆိုင်တဲ့ `--probe` ရဲ့ နောက်မှာ ချက်ချင်း လိုက်ရပါမယ်။
* `--cond <expr>`: Probe location အတွက် optional condition ပါ။ `<expr>` က location မှာ truthy ဖြစ်မှသာ probe က hit ဖြစ်ကြောင်း မှတ်တမ်းတင်ပါတယ်။ Throw ဖြစ်သွားတဲ့ condition တစ်ခုကို false အနေနဲ့ သဘောထားပါတယ်။
* `--max-hit <n>`: Probe ကို hit ဖြစ်နိုင်တဲ့ အကြိမ်အရေအတွက်အတွက် probe တစ်ခုချင်းစီအလိုက် optional ကန့်သတ်ချက်ပါ။ သတ်မှတ်မထားရင် — hit ကန့်သတ်ချက် မရှိပါဘူး။ Probe တစ်ခုခုက သူ့ရဲ့ hit limit ကို ရောက်တဲ့အခါ — probing process က detach ဖြစ်ပြီး ရလဒ်တွေကို သတင်းပို့ပါတယ်။ Probe ခံနေရတဲ့ process ကတော့ ဆက်ပြီး run ပါလိမ့်မယ်။ Session ပြီးဆုံးချိန်အထိ တခြား probe တစ်ခုခုကို ဘယ်တော့မှ မရောက်ခဲ့ဘူးဆိုရင် — ၎င်းကို missed probe အဖြစ် သတင်းပို့ပါလိမ့်မယ်။
* `--timeout=<ms>`: Probe session တစ်ခုလုံးအတွက် global wall-clock deadline ပါ။ Default က `30000` ပါ။ ဒါကို ပြင်ပကနေ terminate လုပ်နိုင်တဲ့ ကြာမြင့်စွာ run နေတဲ့ application တစ်ခုကို probe လုပ်ဖို့ သုံးနိုင်ပါတယ်။
* `--json`: သုံးလိုက်ရင် — default text report အစား structured JSON report တစ်ခုကို ပုံနှိပ်ပေးပါတယ်။
* `--preview`: သုံးလိုက်ရင် — non-primitive values တွေမှာ object ပုံစံ JSON probe values တွေအတွက် CDP property previews တွေ ပါဝင်ပါလိမ့်မယ်။
* `--port=<port>`: Probing session က listen လုပ်မယ့် local inspector port ကို ရွေးချယ်ပေးပါတယ်။ Default က `0` ဖြစ်ပြီး — random port တစ်ခုကို တောင်းဆိုပါတယ်။
* `--` က child က ကိုယ်ပိုင် Node.js flags တွေ လိုအပ်တယ်ဆိုရင် မှလွဲပြီး optional ပါ။

Options တွေရဲ့ ဖွဲ့စည်းမှုနဲ့ ပတ်သက်တဲ့ ထပ်ဆောင်း စည်းမျဉ်းတွေကတော့:

* `--probe <file>:<line>[:<col>]` နဲ့ `--expr <expr>` တို့က တင်းကျပ်တဲ့ အတွဲတွေပါ။ `--probe` တစ်ခုချင်းစီရဲ့ နောက်မှာ `--expr` တစ်ခု ချက်ချင်း လိုက်ရပါမယ်။
* `--cond <expr>` နဲ့ `--max-hit <n>` တို့က သူတို့ သက်ဆိုင်တဲ့ `--probe`/`--expr` အတွဲရဲ့ နောက်မှာ ရေးရတဲ့ optional modifiers တွေပါ — အတွဲတစ်ခုစီအတွက် အများဆုံး တစ်ကြိမ်စီပါ။ ပထမဆုံး `--probe` ရဲ့ ရှေ့မှာ ဖြစ်စေ၊ `--probe` တစ်ခုနဲ့ သူ့ရဲ့ တွဲဖက် `--expr` ကြားမှာ ဖြစ်စေ ပေါ်လို့ မရပါဘူး။
* `--max-hit` က သူ နောက်ကလိုက်တဲ့ `--probe`/`--expr` အတွဲကိုပဲ scope လုပ်တာမို့ — location တစ်ခုတည်းကို မျှဝေသုံးတဲ့ အတွဲတွေက မတူညီတဲ့ limits တွေ သတ်မှတ်နိုင်ပါတယ်။ `--cond` ကတော့ location တစ်ခုလုံးကို scope လုပ်ပြီး — location တစ်ခုတည်းကို မျှဝေတဲ့ probes တွေက condition တစ်ခုတည်း (သို့) တစ်ခုမှ မရှိတာကို မျှဝေရပါမယ်။
* `--timeout`, `--json`, `--preview`, နဲ့ `--port` တို့က probe session တစ်ခုလုံးအတွက် global probe options တွေပါ။ Probe အတွဲတွေရဲ့ ရှေ့မှာ ဖြစ်စေ၊ ကြားမှာ ဖြစ်စေ ပေါ်နိုင်ပေမယ့် — `--probe` တစ်ခုနဲ့ သူ့ရဲ့ တွဲဖက် `--expr` ကြားမှာတော့ မရပါဘူး။
* Child script ဆီကို ထပ်ဆောင်း Node.js execution arguments တွေ ပို့ပေးဖို့ လိုရင် — probe options တွေနဲ့ child script အတွက် Node.js options တွေကို ခွဲခြားဖို့ `--` ကို သုံးရပါမယ်။

ဥပမာ:

```console
$ node inspect --probe app.js:10 --expr "user"
               --probe src/utils.js:5:15 --expr "config.options"
               --json --preview -- --no-warnings app.js --arg-for-app=foo
```

### Probe output ပုံစံ (Probe output format)

Probe session ပြီးဆုံးတဲ့အခါ — probing process က probe hits တွေနဲ့ ရလဒ်တွေ အားလုံးရဲ့ နောက်ဆုံး report တစ်ခုကို ပုံနှိပ်ပေးပါတယ်။

ဒီ script ကို ကြည့်ပါ:

```js
// cli.js
let maxRSS = 0;
for (let i = 0; i < 2; i++) {
  const { rss } = process.memoryUsage();
  maxRSS = Math.max(maxRSS, rss);
}
```

`--json` မပါဘဲ — default အနေနဲ့ output ကို လူတွေ ဖတ်လို့ရတဲ့ text format နဲ့ ပုံနှိပ်ပါတယ်:

```console
$ node inspect --probe cli.js:5 --expr 'rss' cli.js
Hit 1 at file:///path/to/cli.js:5:3
  rss = 54935552
Hit 2 at file:///path/to/cli.js:5:3
  rss = 55083008
Completed
```

`--probe` ဆီကို ပေးလိုက်တဲ့ မူရင်း `<file>:<line>[:<col>]` က — pausable ဖြစ်အောင် သေချာစေဖို့ တခြား location တစ်ခုဆီကို resolve လုပ်သွားနိုင်သလို — loaded scripts အများအပြားနဲ့လည်း ကိုက်ညီနိုင်တာမို့ — တကယ် evaluation လုပ်တဲ့ location က ရလဒ်တွေကို ခွဲခြားသိဖို့ အထောက်အကူ ပြုပါတယ်။

Primitive ရလဒ်တွေကို တိုက်ရိုက် ပုံနှိပ်ပေးပြီး — objects နဲ့ arrays တွေကတော့ ရနိုင်ရင် Chrome DevTools Protocol preview data ကို အသုံးပြုပါတယ်။ တခြား non-primitive တန်ဖိုးတွေကတော့ Chrome DevTools Protocol ရဲ့ `description` string ဆီကို ပြန်ကျပါတယ်။ Expression failures တွေကို `[error] ...` lines တွေအနေနဲ့ မှတ်တမ်းတင်ပြီး — session တစ်ခုလုံးကိုတော့ မအောင်မြင်စေပါဘူး။ ပိုကြွယ်ဝတဲ့ text formatting လိုအပ်ရင် — expression ကို `JSON.stringify(...)` (သို့) `util.inspect(...)` ထဲမှာ ထုပ်ပေးပါ။

`--json` ကို သုံးတဲ့အခါ — output ပုံစံက ဒီလိုမျိုး ဖြစ်ပါတယ်:

```console
$ node inspect --json --probe cli.js:5 --expr 'rss' cli.js
{"v":2,"probes":[{"expr":"rss","target":{"suffix":"cli.js","line":5}}],"results":[{"probe":0,"event":"hit","hit":1,"location":{"url":"file:///path/to/cli.js","line":5,"column":3},"result":{"type":"number","value":55443456,"description":"55443456"}},{"probe":0,"event":"hit","hit":2,"location":{"url":"file:///path/to/cli.js","line":5,"column":3},"result":{"type":"number","value":55574528,"description":"55574528"}},{"event":"completed"}]}
```

```json
{
  "v": 2, // Probe JSON schema version.
  "probes": [
    {
      "expr": "rss", // The expression paired with --probe.
      "target": {
        // The user's probe specification. `suffix` is the raw <file> passed
        // to --probe and is matched as a path-separator-anchored suffix
        // against every loaded script's URL. `column` is present only if the
        // user supplied `:col`. The actual evaluation location may differ
        // from the target and will be reported in each hit's `location` field.
        "suffix": "cli.js",
        "line": 5
      }
      // `condition` is present only when the probe was given a --cond expression.
      // `maxHit` is present only when the probe was given a --max-hit limit.
    }
  ],
  "results": [
    {
      "probe": 0, // Index into probes[].
      "event": "hit", // Hit events are recorded in observation order.
      "hit": 1, // 1-based hit count for this probe.
      "location": {
        // The actual location where the execution is paused to evaluate
        // the expression of the probe. This may differ from the probe's
        // target due to pausability adjustments or multiple matches.
        "url": "file:///path/to/cli.js",
        "line": 5,
        "column": 3
      },
      "result": {
        "type": "number",
        "value": 55443456,
        "description": "55443456"
      }
      // If the probe expression throws, fails, or never completes, the entry
      // carries an `error` field instead of `result` with the shape
      // `{ message: string, details?: object }`. The `message` and `details`
      // content is informational only and may change between releases.
    },
    {
      "probe": 0,
      "event": "hit",
      "hit": 2,
      "location": { "url": "file:///path/to/cli.js", "line": 5, "column": 3 },
      "result": {
        "type": "number",
        "value": 55574528,
        "description": "55574528"
      }
    },
    {
      "event": "completed"
      // The final entry is always a terminal event, for example:
      // 1. { "event": "completed" }
      // 2. { "event": "miss", "pending": [0, 1] }
      // 3. {
      //      "event": "timeout",
      //      "pending": [0],
      //      "error": {
      //       "code": "probe_timeout",
      //       "message": "Timed out after 30000ms waiting for probes: app.js:10"
      //      }
      //    }
      // 4. {
      //      "event": "error",
      //      "pending": [0],
      //      "error": {
      //       "code": "probe_target_exit",
      //       "exitCode": 1,
      //       "stderr": "Error: boom",
      //       "message": "Target exited with code 1 before probes: app.js:10"
      //      }
      //    }
      // 5. {
      //      "event": "error",
      //      "pending": [1],
      //      "error": {
      //       "code": "probe_failure",
      //       "probe": 0,
      //       "stderr": "...",
      //       "message": "Target process exited during probe evaluation before probes: app.js:12. If the failure repeats, review the probe expression.",
      //       "details": { "lastCdpMethod": "Debugger.evaluateOnCallFrame" }
      //      }
      //    }
    }
  ]
}
```

### Output များနဲ့ exit codes (Output and exit codes)

Probe mode က probe ရဲ့ နောက်ဆုံး report ကိုပဲ stdout ဆီကို ပုံနှိပ်ပြီး — child process ရဲ့ stdout/stderr ကိုတော့ တိတ်ဆိတ်စေပါတယ်။ Probing session ပြီးဆုံးတဲ့အခါ — probing process က ပုံမှန်အားဖြင့် code `0` နဲ့ ထွက်ပြီး stdout ဆီကို နောက်ဆုံး report တစ်ခု ပုံနှိပ်ပါတယ်။ Child process က probe session မပြီးဆုံးခင် non-zero code နဲ့ ထွက်သွားခဲ့ရင် (သို့) probe session က တခြား အကြောင်းကြောင့် ပြီးမြောက်အောင် မလုပ်နိုင်ဘူးဆိုရင် — နောက်ဆုံး report ထဲမှာ terminal `error` event တစ်ခုကို မှတ်တမ်းတင်ပါတယ်။

`error.code` က `'probe_failure'` (သို့) `'probe_timeout'` ဖြစ်နေရင် — probing process က non-zero code နဲ့ ထွက်ပြီး — မှတ်တမ်းတင်ထားတဲ့ hits တွေ မပြည့်စုံနိုင်တယ်ဆိုတာကို ညွှန်ပြပါတယ်။ ဒီအခါမှာ `error.message` ထဲမှာ ပြန်လည် ကိုင်တွယ်ဖို့ အကြံပြုချက်တွေ ပါဝင်ပြီး — `error.probe` က (ပါရင်) report ရဲ့ `probes` array ထဲက index တစ်ခု ဖြစ်ပြီး — debugging ကို လမ်းညွှန်ဖို့ ဖြစ်နိုင်ခြေ အများဆုံး တရားခံ probe ကို အကောင်းဆုံး ကြိုးစားမှု အဆင့်နဲ့ ခွဲခြားဖော်ပြပါတယ်။

Invalid arguments တွေနဲ့ launch (သို့) connect လုပ်ရာမှာ ဆိုးဝါးတဲ့ (fatal) မအောင်မြင်မှုတွေက — probing process ကို non-zero code နဲ့ ထွက်စေပြီး — နောက်ဆုံး probe report မပါဘဲ stderr ဆီကို error message တစ်ခု ပုံနှိပ်စေနိုင်ပါတယ်။

### Execution point တစ်ခုတည်းမှာ expressions အများအပြားကို probe လုပ်ခြင်း (Probing multiple expressions at the same execution point)

`--probe`/`--expr` အတွဲ အများအပြားက `--probe` တစ်ခုတည်းကို မျှဝေသုံးတဲ့အခါ — expressions တွေကို pause တစ်ခုတည်းမှာ command line ပေါ်မှာ ပေါ်လာတဲ့ အစီအစဉ်အတိုင်း evaluate လုပ်ပါတယ်။

Location တစ်ခုစီအတွက် — `--cond` တစ်ခုထက် ပိုလို့ မရပါဘူး (သို့) တစ်ခုမှ မရှိနိုင်ပါဘူး။ Location တစ်ခုတည်းမှာ ဆန့်ကျင်နေတဲ့ conditions တွေ ပါတဲ့ `--probe`/`--expr` အတွဲ အများအပြားကို — launch လုပ်ချိန်မှာ ငြင်းပယ်ပါလိမ့်မယ်။

```js
// app.js
const x = { x: 42 };       // line 2
const y = { y: 35 };       // line 3
const z = { ...x, ...y };  // line 4
```

```console
$ node inspect --probe app.js:4 --expr 'x' --probe app.js:4 --expr 'y' -- app.js
```

ပုံနှိပ်ပေးတာက

```text
Hit 1 at file:///path/to/app.js:4:1
  x = {x: 42}
Hit 1 at file:///path/to/app.js:4:1
  y = {y: 35}
Completed
```

```console
$ node inspect --probe app.js:4 --expr 'x' --probe app.js:4 --expr 'y' --json --preview -- app.js
```

ပုံနှိပ်ပေးတာက

```json
{"v":2,"probes":[{"expr":"x","target":{"suffix":"app.js","line":4}},{"expr":"y","target":{"suffix":"app.js","line":4}}],"results":[{"probe":0,"event":"hit","hit":1,"location":{"url":"file:///path/to/app.js","line":4,"column":1},"result":{"type":"object","description":"Object","preview":{"type":"object","description":"Object","overflow":false,"properties":[{"name":"x","type":"number","value":"42"}]}}},{"probe":1,"event":"hit","hit":1,"location":{"url":"file:///path/to/app.js","line":4,"column":1},"result":{"type":"object","description":"Object","preview":{"type":"object","description":"Object","overflow":false,"properties":[{"name":"y","type":"number","value":"35"}]}}},{"event":"completed"}]}
```

### Probe location ရွေးချယ်ခြင်း (Selecting the probe location)

Expressions တွေကို — execution က probe location ဆီ ရောက်တဲ့အခါ — အဲဒီ location ရဲ့ lexical scope ထဲမှာ evaluate လုပ်ပါတယ်။ `let` (သို့) `const` နဲ့ ကြေညာထားတဲ့ variable တစ်ခုကို သူ့ရဲ့ ကြေညာတဲ့ နေရာ (declaration site) မှာ probe လုပ်တာကို ရှောင်ပါ — ဘာလို့လဲဆိုတော့ အဲဒါက temporal dead zone (TDZ) ထဲမှာ variable ကို ဝင်ရောက်လို့ ဖြစ်ပေါ်လာတဲ့ `ReferenceError` တစ်ခုဆီကို ဦးတည်စေလို့ပါ။

```js
// app.js
const x = 42;        // line 2
console.log(x);      // line 3
```

```console
$ node inspect --probe app.js:1 --expr 'x' app.js
Hit 1 at file:///path/to/app.js:1:1
  [error] x = ReferenceError: Cannot access 'x' from debugger
  ...
Completed
```

ဒီအစား — variable ကို စတင် initialize လုပ်ပြီးသွားပြီ ဖြစ်တဲ့ location တစ်ခုမှာ probe လုပ်ပါ:

```console
$ node inspect --probe app.js:3 --expr 'x' app.js
Hit 1 at file:///path/to/app.js:3:1
  x = 42
Completed
```

`<file>` argument ကို — loaded script တိုင်းရဲ့ URL ရဲ့ path suffix အနေနဲ့ — path separator မှာ မှီခိုပြီး (anchored) ကိုက်ညီစေပါတယ်။ Basename တစ်ခုတည်းပဲ ပေးလိုက်ရင် — အဲဒီ basename ရှိတဲ့ loaded script တိုင်းနဲ့ ကိုက်ညီပြီး — native debuggers တွေက breakpoints တွေကို ပုံမှန် ကိုက်ညီစေတာနဲ့ ဆင်တူပါတယ်။ Partial path တစ်ခု ပေးလိုက်ရင်တော့ ကိုက်ညီမှုကို ကျဉ်းမြောင်းစေပါတယ်။ ပေးထားတာက:

```text
project/
  - src/utils.js
  - lib/utils.js
```

`--probe utils.js:10` က files နှစ်ခုလုံးကို ချိတ်ပြီး — match တစ်ခုစီအတွက် hit တစ်ခုစီ ထုတ်ပေးပါတယ်။ Hit တစ်ခုချင်းစီမှာ — expression ကို တကယ် execute လုပ်ခဲ့တဲ့ နေရာကို ဖော်ပြတဲ့ ကိုယ်ပိုင် `location` field ပါတာမို့ — consumer တွေက ရလဒ်ကို files နှစ်ခုထဲက ဘယ်ဟာကလဲဆိုတာ တိကျစွာ သတ်မှတ်နိုင်ပါတယ်။ Bind လုပ်ချိန်မှာ ခွဲခြားသိချင်ရင် — ရည်ရွယ်ထားတဲ့ file တစ်ခုတည်းနဲ့ပဲ ကိုက်ညီမယ့် ပိုပြည့်စုံတဲ့ path တစ်ခုကို သတ်မှတ်ပါ:

```console
$ node inspect --probe src/utils.js:10 --expr 'x' main.js   # matches only src/utils.js
```

### Probe ဥပမာများ (Probe examples)

#### Variable တစ်ခုကို အခြေအနေနဲ့တကွ probe လုပ်ခြင်း (Probing a variable conditionally)

```js
// app.js
let total = 0;
for (let i = 0; i < 10; i++) {
  total += i;  // line 4
}
```

```console
$ out/Release/node inspect --probe app.js:4 --expr 'total' \
                           --cond 'i % 3 === 0' app.js
```

```text
Hit 1 at file:///path/to/app.js:3:3
  total = 0
Hit 2 at file:///path/to/app.js:3:3
  total = 3
Hit 3 at file:///path/to/app.js:3:3
  total = 15
Hit 4 at file:///path/to/app.js:3:3
  total = 36
Completed
```

## Advanced usage (အဆင့်မြင့် အသုံးပြုမှုများ)

### V8 inspector ကို Node.js နဲ့ ပေါင်းစပ်ခြင်း (V8 inspector integration for Node.js)

V8 Inspector integration က debugging နဲ့ profiling အတွက် Chrome DevTools တွေကို Node.js instances တွေနဲ့ ချိတ်ဆက်နိုင်စေပါတယ်။ ၎င်းက [Chrome DevTools Protocol][] ကို အသုံးပြုပါတယ်။

V8 Inspector ကို — Node.js application တစ်ခုကို စတင်တဲ့အခါ `--inspect` flag ကို ပေးပြီး enable လုပ်နိုင်ပါတယ်။ အဲဒီ flag နဲ့ ကိုယ်ပိုင် port တစ်ခုကိုလည်း ပေးနိုင်ပါတယ် — ဥပမာ `--inspect=9222` ဆိုရင် port 9222 ပေါ်မှာ DevTools connections တွေကို လက်ခံပါလိမ့်မယ်။

`--inspect` flag ကို သုံးတာက — debugger မချိတ်ဆက်ခင်ကတည်း code ကို ချက်ချင်း execute လုပ်ပါတယ်။ ဆိုလိုတာက — code က debugging မစတင်ခင်ကတည်း run စပြီးသား ဖြစ်နေနိုင်ပြီး — အစကတည်းက debug လုပ်ချင်တယ်ဆိုရင် ဒါက စံပြ မဟုတ်နိုင်ပါဘူး။

ဒီလို အခြေအနေမျိုးမှာ — အခြားရွေးချယ်စရာ နှစ်ခု ရှိပါတယ်:

1. `--inspect-wait` flag: ဒီ flag က code ကို execute မလုပ်ခင် debugger ကို ချိတ်ဆက်တာအထိ စောင့်ပါတယ်။ ဒါက execution ရဲ့ အစကတည်းက debugging စတင်နိုင်စေပါတယ်။
2. `--inspect-brk` flag: `--inspect` နဲ့ မတူဘဲ — ဒီ flag က debugger ချိတ်ဆက်ပြီးတာနဲ့ code ရဲ့ ပထမဆုံး line ပေါ်မှာ break လုပ်ပါတယ်။ Debugging မတိုင်ခင် code ဘာမှ မလုပ်ရသေးဘဲ — အစကတည်းက code ကို တစ်ဆင့်ချင်း debug လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

ဒါကြောင့် — `--inspect`, `--inspect-wait`, နဲ့ `--inspect-brk` ကြားမှာ ရွေးချယ်တဲ့အခါ — code ကို ချက်ချင်း execute စေချင်လား၊ debugger မချိတ်ဆက်ခင် စောင့်စေချင်လား၊ (သို့) တစ်ဆင့်ချင်း debugging အတွက် ပထမဆုံး line မှာ break လုပ်စေချင်လားဆိုတာကို စဉ်းစားပါ။

```console
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/learn/getting-started/debugging
```

(အပေါ်က ဥပမာမှာ — URL ရဲ့ အဆုံးမှာရှိတဲ့ UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 ကို ချက်ချင်း ထုတ်လုပ်လိုက်တာဖြစ်ပြီး — debugging sessions တစ်ခုနဲ့တစ်ခု ကွဲပြားပါတယ်။)

[Chrome DevTools Protocol]: https://chromedevtools.github.io/devtools-protocol/
[`debugger`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger
[interactive mode]: #interactive-mode
[non-interactive probe mode]: #probe-mode
