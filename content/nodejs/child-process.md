---
title: "Child process"
description: "`node:child_process` module — subprocess တွေကို spawn လုပ်ခြင်း၊ shell command တွေ လုပ်ဆောင်ခြင်းနဲ့ child process နဲ့ ဆက်သွယ်ခြင်း (spawn, exec, execFile, fork, ChildProcess, stdio options စသည်)"
order: 124
source: "https://nodejs.org/api/child_process.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:child_process` module က popen(3) နဲ့ ဆင်တူပြီး — တစ်ထပ်တည်း တူတာ မဟုတ်တဲ့ — ပုံစံမျိုးနဲ့ subprocess တွေကို spawn လုပ်နိုင်စွမ်းကို ပံ့ပိုးပေးပါတယ်။ ဒီစွမ်းရည်ကို အဓိကအားဖြင့် [`child_process.spawn()`][] function က ပံ့ပိုးပေးပါတယ်:

```cjs
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```mjs
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

const [code] = await once(ls, 'close');
console.log(`child process exited with code ${code}`);
```

ပုံမှန်အားဖြင့် parent Node.js process နဲ့ spawn လုပ်ထားတဲ့ subprocess ကြားမှာ `stdin`, `stdout`, နဲ့ `stderr` တွေအတွက် pipes တွေကို ချိတ်ဆက်ပေးပါတယ်။ ဒီ pipes တွေမှာ ကန့်သတ်ထားတဲ့ (platform အလိုက် ကွဲပြားတဲ့) ပမာဏသာ ထားနိုင်ပါတယ်။ Subprocess က output ကို ဖမ်းယူ (capture) မလုပ်ဘဲ — အဲဒီ ကန့်သတ်ချက်ထက် ကျော်လွန်ပြီး stdout ဆီ ရေးလိုက်ရင် — subprocess က pipe buffer ထဲ နောက်ထပ် data တွေ လက်ခံနိုင်တဲ့အထိ စောင့်ရင်း ပိတ်ဆို့ (block) သွားပါတယ်။ ဒါက shell ထဲက pipes တွေရဲ့ အပြုအမူနဲ့ အတူတူပါပဲ။ Output ကို သုံးစွဲမှာ မဟုတ်ဘူးဆိုရင် `{ stdio: 'ignore' }` option ကို သုံးပါ။

Command ရှာဖွေခြင်း (command lookup) ကို — `options` object ထဲမှာ `env` ပါနေရင် `options.env.PATH` environment variable ကို သုံးပြီး လုပ်ဆောင်ပါတယ်။ မပါဘူးဆိုရင်တော့ `process.env.PATH` ကို သုံးပါတယ်။ `options.env` ကို `PATH` မပါဘဲ သတ်မှတ်ထားရင် — Unix မှာ `/usr/bin:/bin` ဆိုတဲ့ default search path ပေါ်မှာ ရှာဖွေပြီး (execvpe/execvp တို့အတွက် ကိုယ့် operating system ရဲ့ manual ကို ကြည့်ပါ) — Windows မှာတော့ လက်ရှိ process ရဲ့ environment variable `PATH` ကို သုံးပါတယ်။

Windows မှာ environment variables တွေက case-insensitive ဖြစ်ပါတယ်။ Node.js က `env` keys တွေကို lexicographic အစဉ်လိုက် စီပြီး — case-insensitive အနေနဲ့ ကိုက်ညီတဲ့ ပထမဆုံး key ကို သုံးပါတယ်။ (Lexicographic အစဉ်အရ) ပထမဆုံး entry တစ်ခုတည်းကိုသာ subprocess ဆီ ပေးပို့ပါတယ်။ ဒါကြောင့် Windows မှာ `PATH` နဲ့ `Path` လိုမျိုး — key တစ်ခုတည်းရဲ့ မူကွဲ (variant) အများအပြား ပါဝင်တဲ့ object တွေကို `env` option အနေနဲ့ ပေးတဲ့အခါ ပြဿနာ ဖြစ်လာနိုင်ပါတယ်။

[`child_process.spawn()`][] method က child process ကို asynchronous ပုံစံနဲ့ spawn လုပ်ပြီး — Node.js event loop ကို မပိတ်ဆို့ပါဘူး။ [`child_process.spawnSync()`][] function ကတော့ spawn လုပ်ထားတဲ့ process က exit ဖြစ်တာ ဒါမှမဟုတ် terminate ခံရတာအထိ event loop ကို ပိတ်ဆို့ထားတဲ့ — synchronous ပုံစံနဲ့ ညီမျှတဲ့ လုပ်ဆောင်ချက်ကို ပံ့ပိုးပေးပါတယ်။

အဆင်ပြေစေဖို့ `node:child_process` module က [`child_process.spawn()`][] နဲ့ [`child_process.spawnSync()`][] တို့ရဲ့ synchronous နဲ့ asynchronous မူကွဲ (alternatives) တချို့ကိုလည်း ပံ့ပိုးပေးပါတယ်။ ဒီ alternatives တွေ တစ်ခုချင်းစီကို [`child_process.spawn()`][] ဒါမှမဟုတ် [`child_process.spawnSync()`][] ပေါ်မှာ အခြေခံပြီး တည်ဆောက်ထားပါတယ်။

* [`child_process.exec()`][]: shell တစ်ခုကို spawn လုပ်ပြီး — ပြီးဆုံးချိန်မှာ `stdout` နဲ့ `stderr` တွေကို callback function ဆီ ပေးပို့တဲ့အနေနဲ့ — အဲဒီ shell အတွင်းမှာ command တစ်ခုကို run လုပ်ပါတယ်။
* [`child_process.execFile()`][]: [`child_process.exec()`][] နဲ့ ဆင်တူပါတယ်။ ကွာတာက — ပုံမှန်အားဖြင့် shell တစ်ခုကို အရင် spawn မလုပ်ဘဲ command ကို တိုက်ရိုက် spawn လုပ်တာ ဖြစ်ပါတယ်။
* [`child_process.fork()`][]: Node.js process အသစ်တစ်ခုကို spawn လုပ်ပြီး — parent နဲ့ child ကြားမှာ messages တွေ ပို့လို့ရတဲ့ IPC communication channel တစ်ခု တည်ဆောက်ပေးထားတဲ့အနေနဲ့ — သတ်မှတ်ထားတဲ့ module တစ်ခုကို ခေါ်ယူပါတယ်။
* [`child_process.execSync()`][]: Node.js event loop ကို ပိတ်ဆို့စေမယ့် [`child_process.exec()`][] ရဲ့ synchronous ဗားရှင်း ဖြစ်ပါတယ်။
* [`child_process.execFileSync()`][]: Node.js event loop ကို ပိတ်ဆို့စေမယ့် [`child_process.execFile()`][] ရဲ့ synchronous ဗားရှင်း ဖြစ်ပါတယ်။

Shell scripts တွေကို အလိုအလျောက် လုပ်ဆောင်တာလိုမျိုး use cases တချို့အတွက်တော့ [synchronous counterparts][] တွေက ပိုပြီး အဆင်ပြေနိုင်ပါတယ်။ ဒါပေမယ့် အတော်များများသော အခြေအနေတွေမှာ — spawn လုပ်ထားတဲ့ processes တွေ ပြီးဆုံးနေချိန် event loop ကို ရပ်တန့်ထားရလို့ — synchronous methods တွေက performance အပေါ် သိသာတဲ့ သက်ရောက်မှု ရှိနိုင်ပါတယ်။

## Asynchronous ပုံစံဖြင့် process ဖန်တီးခြင်း (Asynchronous process creation)

[`child_process.spawn()`][], [`child_process.fork()`][], [`child_process.exec()`][], နဲ့ [`child_process.execFile()`][] methods တွေ အားလုံးက Node.js API တွေရဲ့ ပုံမှန် idiomatic asynchronous programming ပုံစံအတိုင်း လိုက်နာပါတယ်။

ဒီ methods တွေ တစ်ခုချင်းစီက [`ChildProcess`][] instance တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ object တွေက Node.js ရဲ့ [`EventEmitter`][] API ကို အကောင်အထည်ဖော်ထားလို့ — child process ရဲ့ သက်တမ်း (life cycle) အတွင်းမှာ ဖြစ်ပေါ်တဲ့ events တချို့ ဖြစ်လာတဲ့အခါ ခေါ်ယူခံရမယ့် listener functions တွေကို parent process က register လုပ်နိုင်ပါတယ်။

[`child_process.exec()`][] နဲ့ [`child_process.execFile()`][] methods တွေက child process terminate ဖြစ်တဲ့အခါ ခေါ်ယူခံရမယ့် optional `callback` function တစ်ခုကို ထပ်ဆောင်း သတ်မှတ်ခွင့် ပြုပါတယ်။

### Windows ပေါ်မှာ `.bat` နဲ့ `.cmd` files တွေကို spawn လုပ်ခြင်း (Spawning `.bat` and `.cmd` files on Windows)

[`child_process.exec()`][] နဲ့ [`child_process.execFile()`][] တို့ရဲ့ ကွာခြားချက်ရဲ့ အရေးပါမှုက platform အပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။ Unix လိုမျိုး operating system တွေ (Unix, Linux, macOS) ပေါ်မှာ [`child_process.execFile()`][] က ပိုပြီး ထိရောက်နိုင်ပါတယ် — အကြောင်းက ပုံမှန်အားဖြင့် shell တစ်ခုကို spawn မလုပ်လို့ပါ။ ဒါပေမယ့် Windows ပေါ်မှာတော့ `.bat` နဲ့ `.cmd` files တွေက terminal မပါဘဲ သူတို့ဘာသာ executable မဟုတ်တဲ့အတွက် — [`child_process.execFile()`][] ကို သုံးပြီး launch လုပ်လို့ မရပါဘူး။ Windows ပေါ်မှာ run လုပ်နေစဉ် `.bat` နဲ့ `.cmd` files တွေကို ဒီနည်းတွေနဲ့ ခေါ်ယူနိုင်ပါတယ်:

* `shell` option ကို သတ်မှတ်ထားတဲ့ [`child_process.spawn()`][] ကို သုံးပြီး (အကြံပြုလိုတာ မဟုတ်ပါ၊ [DEP0190][] ကို ကြည့်ပါ)၊ ဒါမှမဟုတ်
* [`child_process.exec()`][] ကို သုံးပြီး၊ ဒါမှမဟုတ်
* `cmd.exe` ကို spawn လုပ်ပြီး `.bat` (သို့) `.cmd` file ကို argument တစ်ခုအနေနဲ့ ပေးပို့ခြင်းဖြင့် ([`child_process.exec()`][] က အတွင်းမှာ ဒီလိုပဲ လုပ်ဆောင်ပါတယ်)။

ဘယ်လိုပဲ ဖြစ်ဖြစ် script filename ထဲမှာ spaces တွေ ပါရင် quote လုပ်ဖို့ လိုအပ်ပါတယ်။

```cjs
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => { /* ... */ });

// Or, spawning cmd.exe directly:
const bat = spawn('cmd.exe', ['/c', 'my.bat']);

// If the script filename contains spaces, it needs to be quoted
exec('"my script.cmd" a b', (err, stdout, stderr) => { /* ... */ });
```

```mjs
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => { /* ... */ });

// Or, spawning cmd.exe directly:
const bat = spawn('cmd.exe', ['/c', 'my.bat']);

// If the script filename contains spaces, it needs to be quoted
exec('"my script.cmd" a b', (err, stdout, stderr) => { /* ... */ });
```

### `child_process.exec(command[, options][, callback])`

* `command` {string} Space တွေနဲ့ ခြားထားတဲ့ arguments တွေပါတဲ့ — run လုပ်ရမယ့် command ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory (current working directory) ပါ။ **Default:** `process.cwd()`။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `encoding` {string} **Default:** `'utf8'`
  * `shell` {string} Command ကို execute လုပ်ဖို့ သုံးမယ့် shell ပါ။ [Shell requirements][] နဲ့ [Default Windows shell][] ကို ကြည့်ပါ။ **Default:** Unix မှာ `'/bin/sh'`၊ Windows မှာ `process.env.ComSpec`။
  * `signal` {AbortSignal} AbortSignal တစ်ခုကို သုံးပြီး child process ကို abort လုပ်ခွင့် ပြုပါတယ်။
  * `timeout` {number} **Default:** `0`
  * `maxBuffer` {number} stdout (သို့) stderr ပေါ်မှာ ခွင့်ပြုထားတဲ့ data ပမာဏ အများဆုံး (bytes နဲ့) ပါ။ ကျော်လွန်သွားရင် child process ကို terminate လုပ်ပြီး — ထွက်လာတဲ့ output တွေကို ဖြတ်တောက် (truncate) လိုက်ပါတယ်။ [`maxBuffer` and Unicode][] မှာ ဖော်ပြထားတဲ့ သတိထားစရာကို ကြည့်ပါ။ **Default:** `1024 * 1024`။
  * `killSignal` {string|integer} **Default:** `'SIGTERM'`
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးခံရမယ့် subprocess console window ကို ဖျောက်ထားပါတယ်။ **Default:** `false`။
* `callback` {Function} Process terminate ဖြစ်တဲ့အခါ — output တွေနဲ့အတူ ခေါ်ယူပါတယ်။
  * `error` {Error}
  * `stdout` {string|Buffer}
  * `stderr` {string|Buffer}
* Returns: {ChildProcess}

Shell တစ်ခုကို spawn လုပ်ပြီး — ထွက်လာတဲ့ output တွေကို buffer လုပ်ထားရင်း — အဲဒီ shell အတွင်းမှာ `command` ကို execute လုပ်ပါတယ်။ Exec function ဆီ ပေးလိုက်တဲ့ `command` string ကို shell က တိုက်ရိုက် ကိုင်တွယ်တာမို့ — special characters တွေ ([shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters) အလိုက် ကွဲပြားတယ်) ကို အလိုက်သင့် ကိုင်တွယ်ဖို့ လိုပါတယ်:

```cjs
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Double quotes are used so that the space in the path is not interpreted as
// a delimiter of multiple arguments.

exec('echo "The \\$HOME variable is $HOME"');
// The $HOME variable is escaped in the first instance, but not in the second.
```

```mjs
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// Double quotes are used so that the space in the path is not interpreted as
// a delimiter of multiple arguments.

exec('echo "The \\$HOME variable is $HOME"');
// The $HOME variable is escaped in the first instance, but not in the second.
```

**ဒီ function ဆီကို သန့်စင်မထားတဲ့ (unsanitized) user input တွေကို ဘယ်တော့မှ မပေးပါနဲ့။ Shell metacharacters တွေ ပါဝင်တဲ့ input မှန်သမျှကို — ကြိုတင် မှန်းဆလို့ မရတဲ့ command execution တွေ စတင်ဖို့ အသုံးချနိုင်ပါတယ်။**

`callback` function တစ်ခု ပေးထားရင် — `(error, stdout, stderr)` ဆိုတဲ့ arguments တွေနဲ့ ခေါ်ယူပါတယ်။ အောင်မြင်ရင် `error` က `null` ဖြစ်ပါတယ်။ Error ဖြစ်ရင်တော့ `error` က [`Error`][] instance တစ်ခု ဖြစ်ပါလိမ့်မယ်။ `error.code` property က process ရဲ့ exit code ဖြစ်ပါတယ်။ သမားရိုးကျ စည်းမျဉ်းအရ `0` ကလွဲပြီး တခြား exit code တိုင်းက error ကို ညွှန်ပြပါတယ်။ `error.signal` ကတော့ process ကို terminate လုပ်ခဲ့တဲ့ signal ဖြစ်ပါလိမ့်မယ်။

Callback ဆီ ပေးလိုက်တဲ့ `stdout` နဲ့ `stderr` arguments တွေမှာ child process ရဲ့ stdout နဲ့ stderr output တွေ ပါဝင်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် Node.js က output ကို UTF-8 အဖြစ် decode လုပ်ပြီး — callback ဆီ strings တွေအနေနဲ့ ပေးပါတယ်။ stdout နဲ့ stderr output တွေကို decode လုပ်ဖို့ သုံးမယ့် character encoding ကို သတ်မှတ်ဖို့ `encoding` option ကို သုံးနိုင်ပါတယ်။ `encoding` က `'buffer'` ဒါမှမဟုတ် မှတ်မိခြင်း မရှိတဲ့ character encoding တစ်ခု ဆိုရင်တော့ — `Buffer` objects တွေကို callback ဆီ ပေးမှာ ဖြစ်ပါတယ်။

```cjs
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```mjs
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

`timeout` က `0` ထက် ကြီးနေရင် — child process က `timeout` milliseconds ထက် ကြာကြာ run နေခဲ့ရင် — parent process က `killSignal` property (ပုံမှန် `'SIGTERM'`) နဲ့ ဖော်ပြထားတဲ့ signal ကို ပို့ပေးပါလိမ့်မယ်။

exec(3) POSIX system call နဲ့ မတူဘဲ — `child_process.exec()` က လက်ရှိ process ကို အစားထိုးမလုပ်ဘဲ command ကို execute လုပ်ဖို့ shell တစ်ခုကို သုံးပါတယ်။

ဒီ method ကို ၎င်းရဲ့ [`util.promisify()`][]ed ဗားရှင်းအနေနဲ့ ခေါ်ယူပါက — `stdout` နဲ့ `stderr` properties တွေ ပါတဲ့ `Object` တစ်ခုအတွက် `Promise` တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်လာတဲ့ `ChildProcess` instance ကို `Promise` ပေါ်မှာ `child` property အနေနဲ့ တွဲပေးထားပါတယ်။ Error ဖြစ်ရင် (0 ကလွဲပြီး တခြား exit code တွေကို ဖြစ်စေတဲ့ error တွေ အပါအဝင်) — callback ထဲမှာ ပေးခဲ့တဲ့ `error` object အတိုင်း ပါဝင်ပေမယ့် — `stdout` နဲ့ `stderr` ဆိုတဲ့ properties နှစ်ခု ထပ်ပါတဲ့ rejected promise တစ်ခုကို ပြန်ပေးပါတယ်။

```cjs
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```mjs
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

`signal` option ကို ဖွင့်ထားရင် — သက်ဆိုင်ရာ `AbortController` ရဲ့ `.abort()` ကို ခေါ်လိုက်တာက child process ပေါ်မှာ `.kill()` ခေါ်တာနဲ့ ဆင်တူပါတယ်။ ကွာတာက — callback ဆီ ပေးမယ့် error က `AbortError` တစ်ခု ဖြစ်မှာပါ:

```cjs
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```mjs
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

### `child_process.execFile(file[, args][, options][, callback])`

* `file` {string} Run လုပ်ရမယ့် executable file ရဲ့ name (သို့) path ပါ။
* `args` {string\[]} String arguments တွေရဲ့ list ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory ပါ။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `encoding` {string} **Default:** `'utf8'`
  * `timeout` {number} **Default:** `0`
  * `maxBuffer` {number} stdout (သို့) stderr ပေါ်မှာ ခွင့်ပြုထားတဲ့ data ပမာဏ အများဆုံး (bytes နဲ့) ပါ။ ကျော်လွန်သွားရင် child process ကို terminate လုပ်ပြီး — ထွက်လာတဲ့ output တွေကို ဖြတ်တောက် (truncate) လိုက်ပါတယ်။ [`maxBuffer` and Unicode][] မှာ ဖော်ပြထားတဲ့ သတိထားစရာကို ကြည့်ပါ။ **Default:** `1024 * 1024`။
  * `killSignal` {string|integer} **Default:** `'SIGTERM'`
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးခံရမယ့် subprocess console window ကို ဖျောက်ထားပါတယ်။ **Default:** `false`။
  * `windowsVerbatimArguments` {boolean} Windows မှာ arguments တွေကို quoting (သို့) escaping လုံးဝ မလုပ်ပါဘူး။ Unix မှာတော့ လျစ်လျူရှုပါတယ်။ **Default:** `false`။
  * `shell` {boolean|string} `true` ဆိုရင် `command` ကို shell တစ်ခုအတွင်းမှာ run လုပ်ပါတယ်။ Unix မှာ `'/bin/sh'` ကို သုံးပြီး Windows မှာ `process.env.ComSpec` ကို သုံးပါတယ်။ တခြား shell တစ်ခုကိုလည်း string အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ [Shell requirements][] နဲ့ [Default Windows shell][] ကို ကြည့်ပါ။ **Default:** `false` (shell မသုံးပါ)။
  * `signal` {AbortSignal} AbortSignal တစ်ခုကို သုံးပြီး child process ကို abort လုပ်ခွင့် ပြုပါတယ်။
* `callback` {Function} Process terminate ဖြစ်တဲ့အခါ — output တွေနဲ့အတူ ခေါ်ယူပါတယ်။
  * `error` {Error}
  * `stdout` {string|Buffer}
  * `stderr` {string|Buffer}
* Returns: {ChildProcess}

[`child_process.exec()`][] နဲ့ ဆင်တူပေမယ့် — `child_process.execFile()` function က ပုံမှန်အားဖြင့် shell တစ်ခုကို spawn မလုပ်ပါဘူး။ ဒီအစား သတ်မှတ်ထားတဲ့ executable `file` ကို process အသစ်တစ်ခုအနေနဲ့ တိုက်ရိုက် spawn လုပ်လို့ — [`child_process.exec()`][] ထက် နည်းနည်း ပိုပြီး ထိရောက်ပါတယ်။

[`child_process.exec()`][] မှာ ပံ့ပိုးထားတဲ့ options တွေအတိုင်းပဲ ဒီမှာလည်း ပံ့ပိုးပါတယ်။ Shell ကို spawn မလုပ်တဲ့အတွက် — I/O redirection နဲ့ file globbing လိုမျိုး အပြုအမူတွေကိုတော့ ပံ့ပိုးမထားပါဘူး။

```cjs
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```mjs
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

Callback ဆီ ပေးလိုက်တဲ့ `stdout` နဲ့ `stderr` arguments တွေမှာ child process ရဲ့ stdout နဲ့ stderr output တွေ ပါဝင်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် Node.js က output ကို UTF-8 အဖြစ် decode လုပ်ပြီး — callback ဆီ strings တွေအနေနဲ့ ပေးပါတယ်။ stdout နဲ့ stderr output တွေကို decode လုပ်ဖို့ သုံးမယ့် character encoding ကို သတ်မှတ်ဖို့ `encoding` option ကို သုံးနိုင်ပါတယ်။ `encoding` က `'buffer'` ဒါမှမဟုတ် မှတ်မိခြင်း မရှိတဲ့ character encoding တစ်ခု ဆိုရင်တော့ — `Buffer` objects တွေကို callback ဆီ ပေးမှာ ဖြစ်ပါတယ်။

ဒီ method ကို ၎င်းရဲ့ [`util.promisify()`][]ed ဗားရှင်းအနေနဲ့ ခေါ်ယူပါက — `stdout` နဲ့ `stderr` properties တွေ ပါတဲ့ `Object` တစ်ခုအတွက် `Promise` တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်လာတဲ့ `ChildProcess` instance ကို `Promise` ပေါ်မှာ `child` property အနေနဲ့ တွဲပေးထားပါတယ်။ Error ဖြစ်ရင် (0 ကလွဲပြီး တခြား exit code တွေကို ဖြစ်စေတဲ့ error တွေ အပါအဝင်) — callback ထဲမှာ ပေးခဲ့တဲ့ `error` object အတိုင်း ပါဝင်ပေမယ့် — `stdout` နဲ့ `stderr` ဆိုတဲ့ properties နှစ်ခု ထပ်ပါတဲ့ rejected promise တစ်ခုကို ပြန်ပေးပါတယ်။

```cjs
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```mjs
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

**`shell` option ကို ဖွင့်ထားရင် ဒီ function ဆီကို သန့်စင်မထားတဲ့ (unsanitized) user input တွေကို မပေးပါနဲ့။ Shell metacharacters တွေ ပါဝင်တဲ့ input မှန်သမျှကို — ကြိုတင် မှန်းဆလို့ မရတဲ့ command execution တွေ စတင်ဖို့ အသုံးချနိုင်ပါတယ်။**

`signal` option ကို ဖွင့်ထားရင် — သက်ဆိုင်ရာ `AbortController` ရဲ့ `.abort()` ကို ခေါ်လိုက်တာက child process ပေါ်မှာ `.kill()` ခေါ်တာနဲ့ ဆင်တူပါတယ်။ ကွာတာက — callback ဆီ ပေးမယ့် error က `AbortError` တစ်ခု ဖြစ်မှာပါ:

```cjs
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```mjs
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

### `child_process.fork(modulePath[, args][, options])`

* `modulePath` {string|URL} Child ထဲမှာ run လုပ်ရမယ့် module ပါ။
* `args` {string\[]} String arguments တွေရဲ့ list ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory ပါ။
  * `detached` {boolean} Child process ကို သူ့ရဲ့ parent process ကနေ သီးခြား run လုပ်ဖို့ ပြင်ဆင်ပေးပါတယ်။ Platform အပေါ် မူတည်ပြီး တိကျတဲ့ အပြုအမူတွေ ကွဲပြားပါတယ် ([`options.detached`][] ကို ကြည့်ပါ)။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `execPath` {string} Child process ကို ဖန်တီးဖို့ သုံးတဲ့ executable ပါ။
  * `execArgv` {string\[]} Executable ဆီ ပေးပို့တဲ့ string arguments တွေရဲ့ list ပါ။ **Default:** `process.execArgv`။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `serialization` {string} Processes တွေကြားမှာ messages ပို့တဲ့အခါ သုံးမယ့် serialization အမျိုးအစားကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `'json'` နဲ့ `'advanced'` ပါ။ အသေးစိတ်ကို [Advanced serialization][] မှာ ကြည့်ပါ။ **Default:** `'json'`။
  * `signal` {AbortSignal} AbortSignal ကို သုံးပြီး child process ကို ပိတ်လို့ ရပါတယ်။
  * `killSignal` {string|integer} Spawn လုပ်ထားတဲ့ process ကို timeout (သို့) abort signal ကြောင့် kill လုပ်တဲ့အခါ သုံးမယ့် signal တန်ဖိုး ပါ။ **Default:** `'SIGTERM'`။
  * `silent` {boolean} `true` ဆိုရင် child process ရဲ့ stdin, stdout, နဲ့ stderr တွေကို parent process ဆီ pipe လုပ်ပြီး — မဟုတ်ရင်တော့ parent process ဆီကနေ အမွေဆက်ခံ (inherit) ပါတယ်။ အသေးစိတ်ကို [`child_process.spawn()`][] ရဲ့ [`stdio`][] အတွက် `'pipe'` နဲ့ `'inherit'` options တွေမှာ ကြည့်ပါ။ **Default:** `false`။
  * `stdio` {Array|string} [`child_process.spawn()`][] ရဲ့ [`stdio`][] ကို ကြည့်ပါ။ ဒီ option ကို ပေးထားရင် `silent` ကို override လုပ်ပါတယ်။ Array မူကွဲ (variant) ကို သုံးမယ်ဆိုရင် — တန်ဖိုး `'ipc'` နဲ့ item တစ်ခုတည်း အတိအကျ ပါရမှာ ဖြစ်ပြီး မဟုတ်ရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ ဥပမာ `[0, 1, 2, 'ipc']` လိုမျိုးပါ။
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `windowsVerbatimArguments` {boolean} Windows မှာ arguments တွေကို quoting (သို့) escaping လုံးဝ မလုပ်ပါဘူး။ Unix မှာတော့ လျစ်လျူရှုပါတယ်။ **Default:** `false`။
  * `timeout` {number} Process ကို run လုပ်ခွင့်ပြုထားတဲ့ အချိန် အများဆုံး ပမာဏ (milliseconds နဲ့) ပါ။ **Default:** `undefined`။
* Returns: {ChildProcess}

`child_process.fork()` method က Node.js processes အသစ်တွေကို spawn လုပ်ဖို့ အထူးသုံးတဲ့ — [`child_process.spawn()`][] ရဲ့ special case တစ်ခု ဖြစ်ပါတယ်။ [`child_process.spawn()`][] လိုပဲ [`ChildProcess`][] object တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်လာတဲ့ [`ChildProcess`][] မှာ — parent နဲ့ child ကြားမှာ messages တွေ နှစ်ဖက် ပို့လို့ရတဲ့ — ထပ်ဆောင်း communication channel တစ်ခုကို အလိုအလျောက် တည်ဆောက်ပေးထားပါတယ်။ အသေးစိတ်ကို [`subprocess.send()`][] မှာ ကြည့်ပါ။

Spawn လုပ်ထားတဲ့ Node.js child processes တွေဟာ — နှစ်ခုကြားမှာ တည်ဆောက်ထားတဲ့ IPC communication channel ကလွဲလို့ — parent နဲ့ လွတ်လပ်တယ် ဆိုတာ သတိပြုပါ။ Process တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် memory နဲ့ ကိုယ်ပိုင် V8 instances တွေ ရှိပါတယ်။ ထပ်ဆောင်း resource တွေ လိုအပ်တာကြောင့် — child Node.js processes တွေကို အများအပြား spawn လုပ်တာကို အကြံပြုလိုတာ မဟုတ်ပါဘူး။

ပုံမှန်အားဖြင့် `child_process.fork()` က parent process ရဲ့ [`process.execPath`][] ကို သုံးပြီး Node.js instances အသစ်တွေကို spawn လုပ်ပါတယ်။ `options` object ထဲက `execPath` property ကတော့ — တခြား execution path တစ်ခုကို သုံးခွင့် ပြုပါတယ်။

Custom `execPath` တစ်ခုနဲ့ launch လုပ်ထားတဲ့ Node.js processes တွေက — child process ပေါ်မှာ `NODE_CHANNEL_FD` ဆိုတဲ့ environment variable နဲ့ ဖော်ထုတ်ထားတဲ့ file descriptor (fd) ကို သုံးပြီး — parent process နဲ့ ဆက်သွယ်ပါတယ်။

fork(2) POSIX system call နဲ့ မတူဘဲ — `child_process.fork()` က လက်ရှိ process ကို clone မလုပ်ပါဘူး။

[`child_process.spawn()`][] မှာ ရနိုင်တဲ့ `shell` option ကို `child_process.fork()` မှာတော့ ပံ့ပိုးမထားဘဲ — သတ်မှတ်ထားရင်လည်း လျစ်လျူရှုပါလိမ့်မယ်။

`signal` option ကို ဖွင့်ထားရင် — သက်ဆိုင်ရာ `AbortController` ရဲ့ `.abort()` ကို ခေါ်လိုက်တာက child process ပေါ်မှာ `.kill()` ခေါ်တာနဲ့ ဆင်တူပါတယ်။ ကွာတာက — callback ဆီ ပေးမယ့် error က `AbortError` တစ်ခု ဖြစ်မှာပါ:

```cjs
const { fork } = require('node:child_process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```mjs
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

### `child_process.spawn(command[, args][, options])`

* `command` {string} Run လုပ်ရမယ့် command ပါ။
* `args` {string\[]} String arguments တွေရဲ့ list ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory ပါ။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `argv0` {string} Child process ဆီ ပို့တဲ့ `argv[0]` ရဲ့ တန်ဖိုးကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပါတယ်။ မသတ်မှတ်ထားရင် `command` ဖြစ်သွားပါလိမ့်မယ်။
  * `stdio` {Array|string} Child ရဲ့ stdio configuration ပါ ([`options.stdio`][`stdio`] ကို ကြည့်ပါ)။
  * `detached` {boolean} Child process ကို သူ့ရဲ့ parent process ကနေ သီးခြား run လုပ်ဖို့ ပြင်ဆင်ပေးပါတယ်။ Platform အပေါ် မူတည်ပြီး တိကျတဲ့ အပြုအမူတွေ ကွဲပြားပါတယ် ([`options.detached`][] ကို ကြည့်ပါ)။
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `serialization` {string} Processes တွေကြားမှာ messages ပို့တဲ့အခါ သုံးမယ့် serialization အမျိုးအစားကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `'json'` နဲ့ `'advanced'` ပါ။ အသေးစိတ်ကို [Advanced serialization][] မှာ ကြည့်ပါ။ **Default:** `'json'`။
  * `shell` {boolean|string} `true` ဆိုရင် `command` ကို shell တစ်ခုအတွင်းမှာ run လုပ်ပါတယ်။ Unix မှာ `'/bin/sh'` ကို သုံးပြီး Windows မှာ `process.env.ComSpec` ကို သုံးပါတယ်။ တခြား shell တစ်ခုကိုလည်း string အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ [Shell requirements][] နဲ့ [Default Windows shell][] ကို ကြည့်ပါ။ **Default:** `false` (shell မသုံးပါ)။
  * `windowsVerbatimArguments` {boolean} Windows မှာ arguments တွေကို quoting (သို့) escaping လုံးဝ မလုပ်ပါဘူး။ Unix မှာတော့ လျစ်လျူရှုပါတယ်။ `shell` ကို CMD နဲ့ သတ်မှတ်ထားရင် ဒါကို `true` အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။ **Default:** `false`။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးခံရမယ့် subprocess console window ကို ဖျောက်ထားပါတယ်။ **Default:** `false`။
  * `signal` {AbortSignal} AbortSignal တစ်ခုကို သုံးပြီး child process ကို abort လုပ်ခွင့် ပြုပါတယ်။
  * `timeout` {number} Process ကို run လုပ်ခွင့်ပြုထားတဲ့ အချိန် အများဆုံး ပမာဏ (milliseconds နဲ့) ပါ။ **Default:** `undefined`။
  * `killSignal` {string|integer} Spawn လုပ်ထားတဲ့ process ကို timeout (သို့) abort signal ကြောင့် kill လုပ်တဲ့အခါ သုံးမယ့် signal တန်ဖိုး ပါ။ **Default:** `'SIGTERM'`။
* Returns: {ChildProcess}

`child_process.spawn()` method က ပေးထားတဲ့ `command` ကို — `args` ထဲက command-line arguments တွေနဲ့အတူ — process အသစ်တစ်ခုအနေနဲ့ spawn လုပ်ပါတယ်။ `args` ကို ချန်လှပ်ထားရင် empty array အဖြစ် default သတ်မှတ်ပါတယ်။

**`shell` option ကို ဖွင့်ထားရင် ဒီ function ဆီကို သန့်စင်မထားတဲ့ (unsanitized) user input တွေကို မပေးပါနဲ့။ Shell metacharacters တွေ ပါဝင်တဲ့ input မှန်သမျှကို — ကြိုတင် မှန်းဆလို့ မရတဲ့ command execution တွေ စတင်ဖို့ အသုံးချနိုင်ပါတယ်။**

တတိယ argument ကို — ဒီ default တွေနဲ့အတူ — ထပ်ဆောင်း options တွေ သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်:

```js
const defaults = {
  cwd: undefined,
  env: process.env,
};
```

Process ကို spawn လုပ်မယ့် working directory ကို သတ်မှတ်ဖို့ `cwd` ကို သုံးပါတယ်။ မပေးထားရင် လက်ရှိ working directory ကို အမွေဆက်ခံတာ ဖြစ်ပါတယ်။ ပေးထားပေမယ့် path မရှိဘူးဆိုရင် — child process က `ENOENT` error တစ်ခု emit လုပ်ပြီး ချက်ချင်း exit ဖြစ်သွားပါတယ်။ Command ကိုယ်တိုင် မရှိရင်လည်း `ENOENT` ကို emit လုပ်ပါတယ်။

Process အသစ်အတွက် မြင်ရမယ့် environment variables တွေ သတ်မှတ်ဖို့ `env` ကို သုံးပါတယ် — default ကတော့ [`process.env`][] ပါ။

`env` ထဲမှာ `undefined` တန်ဖိုးတွေကို လျစ်လျူရှုပါလိမ့်မယ်။

`ls -lh /usr` ကို run လုပ်ပြီး — `stdout`, `stderr`, နဲ့ exit code တွေကို ဖမ်းယူတဲ့ ဥပမာ:

```cjs
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```mjs
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

const [code] = await once(ls, 'close');
console.log(`child process exited with code ${code}`);
```

ဥပမာ: `ps ax | grep ssh` ကို run လုပ်ဖို့ အတော်လေး ရှုပ်ထွေးတဲ့ နည်းလမ်းတစ်ခု

```cjs
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```mjs
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

`spawn` မအောင်မြင်တာကို စစ်ဆေးတဲ့ ဥပမာ:

```cjs
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```mjs
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

Platform တချို့ (macOS, Linux) က `argv[0]` ရဲ့ တန်ဖိုးကို process title အတွက် သုံးပြီး — တခြား platform တွေ (Windows, SunOS) ကတော့ `command` ကို သုံးပါတယ်။

Node.js က startup မှာ `argv[0]` ကို `process.execPath` နဲ့ အစားထိုးလိုက်လို့ — Node.js child process တစ်ခုထဲမှာ `process.argv[0]` က parent ကနေ `spawn` ဆီ ပေးလိုက်တဲ့ `argv0` parameter နဲ့ မကိုက်ညီပါဘူး။ အဲဒါကို ရယူဖို့ `process.argv0` property ကို သုံးပါ။

`signal` option ကို ဖွင့်ထားရင် — သက်ဆိုင်ရာ `AbortController` ရဲ့ `.abort()` ကို ခေါ်လိုက်တာက child process ပေါ်မှာ `.kill()` ခေါ်တာနဲ့ ဆင်တူပါတယ်။ ကွာတာက — callback ဆီ ပေးမယ့် error က `AbortError` တစ်ခု ဖြစ်မှာပါ:

```cjs
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

```mjs
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

#### `options.detached`

Windows ပေါ်မှာ `options.detached` ကို `true` လို့ သတ်မှတ်ထားရင် — parent process exit ဖြစ်ပြီးနောက်မှာလည်း child process က ဆက်ပြီး run နေနိုင်ပါတယ်။ Child process မှာ ကိုယ်ပိုင် console window တစ်ခု ရှိပါလိမ့်မယ်။ Child process တစ်ခုအတွက် ဖွင့်ပြီးသွားရင် နောက်တစ်ခါ ပိတ်လို့ မရတော့ပါဘူး။

Windows မဟုတ်တဲ့ platform တွေပေါ်မှာ `options.detached` ကို `true` လို့ သတ်မှတ်ထားရင် — child process က process group နဲ့ session အသစ်တစ်ခုရဲ့ leader ဖြစ်သွားပါလိမ့်မယ်။ Child processes တွေက detached ဖြစ်ဖြစ် မဖြစ်ဖြစ် — parent exit ဖြစ်ပြီးနောက်မှာလည်း ဆက်ပြီး run နေနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် setsid(2) ကို ကြည့်ပါ။

ပုံမှန်အားဖြင့် parent က detached child process exit ဖြစ်တာကို စောင့်ပါတယ်။ ပေးထားတဲ့ `subprocess` တစ်ခု exit ဖြစ်တာကို parent process က မစောင့်စေချင်ဘူးဆိုရင် `subprocess.unref()` method ကို သုံးပါ။ အဲဒီလို လုပ်လိုက်ရင် — child process နဲ့ parent process ကြားမှာ IPC channel တစ်ခု တည်ဆောက်ထားတာ မရှိဘူးဆိုရင် — parent process ရဲ့ event loop က child process ကို သူ့ရဲ့ reference count ထဲမှာ မထည့်တော့ဘဲ — parent process က child process နဲ့ မသက်ဆိုင်ဘဲ သီးခြား exit ဖြစ်နိုင်ပါတယ်။

ကြာရှည် run မယ့် process တစ်ခုကို စတင်ဖို့ `detached` option ကို သုံးတဲ့အခါ — process ကို parent နဲ့ ချိတ်ဆက်မထားတဲ့ `stdio` configuration တစ်ခု ပေးထားမှသာလျှင် — parent exit ဖြစ်ပြီးနောက်မှာ နောက်ခံ (background) မှာ ဆက်ပြီး run နေမှာ ဖြစ်ပါတယ်။ Parent process ရဲ့ `stdio` ကို အမွေဆက်ခံထားရင် — child process က controlling terminal မှာ ဆက်ပြီး တွဲနေပါလိမ့်မယ်။

ကြာရှည် run မယ့် process ရဲ့ ဥပမာတစ်ခု — parent ရဲ့ terminate ဖြစ်မှုကို လျစ်လျူရှုဖို့ — သူ့ရဲ့ parent `stdio` file descriptors တွေကနေ detach လုပ်ပြီး လျစ်လျူရှုထားတာ ဖြစ်ပါတယ်:

```cjs
const { spawn } = require('node:child_process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```mjs
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

တနည်းအားဖြင့် child process ရဲ့ output တွေကို files တွေထဲကို လမ်းကြောင်းပြောင်း (redirect) လုပ်နိုင်ပါတယ်:

```cjs
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```mjs
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

#### `options.stdio`

`options.stdio` option ကို — parent နဲ့ child process ကြားမှာ ချိတ်ဆက်ပေးမယ့် pipes တွေကို configure လုပ်ဖို့ သုံးပါတယ်။ ပုံမှန်အားဖြင့် child ရဲ့ stdin, stdout, နဲ့ stderr တွေကို [`ChildProcess`][] object ပေါ်က သက်ဆိုင်ရာ [`subprocess.stdin`][], [`subprocess.stdout`][], နဲ့ [`subprocess.stderr`][] streams တွေဆီကို လမ်းကြောင်းပြောင်းပေးပါတယ်။ ဒါက `options.stdio` ကို `['pipe', 'pipe', 'pipe']` လို့ သတ်မှတ်ထားတာနဲ့ ညီမျှပါတယ်။

အဆင်ပြေစေဖို့ `options.stdio` ကို အောက်ပါ strings တွေထဲက တစ်ခုအနေနဲ့ ပေးနိုင်ပါတယ်:

* `'pipe'`: `['pipe', 'pipe', 'pipe']` (default) နဲ့ ညီမျှပါတယ်
* `'overlapped'`: `['overlapped', 'overlapped', 'overlapped']` နဲ့ ညီမျှပါတယ်
* `'ignore'`: `['ignore', 'ignore', 'ignore']` နဲ့ ညီမျှပါတယ်
* `'inherit'`: `['inherit', 'inherit', 'inherit']` (သို့) `[0, 1, 2]` နဲ့ ညီမျှပါတယ်

တခြားနည်းနဲ့ဆိုရင် `options.stdio` ရဲ့ တန်ဖိုးက array တစ်ခု ဖြစ်ပြီး — index တစ်ခုချင်းစီက child ထဲက fd တစ်ခုနဲ့ သက်ဆိုင်ပါတယ်။ fd 0, 1, နဲ့ 2 တွေက stdin, stdout, နဲ့ stderr တို့နဲ့ အသီးသီး သက်ဆိုင်ပါတယ်။ Parent နဲ့ child ကြားမှာ ထပ်ဆောင်း pipes တွေ ဖန်တီးဖို့ fd အပိုတွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

1. `'pipe'`: Child process နဲ့ parent process ကြားမှာ pipe တစ်ခု ဖန်တီးပါတယ်။ Pipe ရဲ့ parent ဘက်စွန်းကို `child_process` object ပေါ်မှာ [`subprocess.stdio[fd]`][`subprocess.stdio`] ဆိုတဲ့ property အနေနဲ့ parent ဆီ ထုတ်ဖော်ပေးပါတယ်။ fd 0, 1, နဲ့ 2 တွေအတွက် ဖန်တီးထားတဲ့ pipes တွေကို [`subprocess.stdin`][], [`subprocess.stdout`][], နဲ့ [`subprocess.stderr`][] တွေအနေနဲ့လည်း အသီးသီး ရယူနိုင်ပါတယ်။ ဒါတွေက တကယ့် Unix pipes တွေ မဟုတ်တဲ့အတွက် — child process က သူတို့ရဲ့ descriptor files တွေ (ဥပမာ `/dev/fd/2` ဒါမှမဟုတ် `/dev/stdout`) ကနေ သုံးလို့ မရပါဘူး။
2. `'overlapped'`: Handle ပေါ်မှာ `FILE_FLAG_OVERLAPPED` flag ကို သတ်မှတ်ပေးတာကလွဲလို့ `'pipe'` နဲ့ အတူတူပါပဲ။ Child process ရဲ့ stdio handles တွေပေါ်မှာ overlapped I/O လုပ်ဖို့ ဒါ လိုအပ်ပါတယ်။ အသေးစိတ်ကို [docs](https://docs.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o) မှာ ကြည့်ပါ။ Non-Windows systems တွေပေါ်မှာတော့ `'pipe'` နဲ့ လုံးဝ အတူတူပါပဲ။
3. `'ipc'`: Parent နဲ့ child ကြားမှာ messages/file descriptors တွေ ပို့ဖို့ IPC channel တစ်ခု ဖန်တီးပါတယ်။ [`ChildProcess`][] တစ်ခုမှာ IPC stdio file descriptor က အများဆုံး တစ်ခုသာ ရှိနိုင်ပါတယ်။ ဒီ option ကို သတ်မှတ်လိုက်တာက [`subprocess.send()`][] method ကို ရနိုင်စေပါတယ်။ Child process က Node.js instance တစ်ခု ဆိုရင် — IPC channel ရှိနေတာက child process အတွင်းမှာ [`process.send()`][] နဲ့ [`process.disconnect()`][] methods တွေအပြင် [`'disconnect'`][] နဲ့ [`'message'`][] events တွေကိုပါ ရနိုင်စေပါတယ်။

   IPC channel fd ကို [`process.send()`][] ကလွဲပြီး တခြား နည်းလမ်းတွေနဲ့ ဝင်ရောက်သုံးစွဲတာ (သို့) Node.js instance မဟုတ်တဲ့ child process တစ်ခုနဲ့ IPC channel ကို သုံးတာတွေကိုတော့ ပံ့ပိုးမထားပါဘူး။
4. `'ignore'`: Child ထဲမှာ fd ကို လျစ်လျူရှုဖို့ Node.js ကို ညွှန်ကြားပါတယ်။ Node.js က သူ spawn လုပ်တဲ့ processes တွေအတွက် fd 0, 1, နဲ့ 2 တွေကို အမြဲ ဖွင့်ပေးပေမယ့် — fd ကို `'ignore'` လို့ သတ်မှတ်ထားရင် Node.js က `/dev/null` ကို ဖွင့်ပြီး child ရဲ့ fd ဆီ ချိတ်ပေးပါလိမ့်မယ်။
5. `'inherit'`: သက်ဆိုင်ရာ stdio stream ကို parent process ဆီကနေ/ဆီကို ဖြတ်သန်းပေးပါတယ်။ ပထမ နေရာသုံးခုမှာ ဒါက `process.stdin`, `process.stdout`, နဲ့ `process.stderr` တို့နဲ့ အသီးသီး ညီမျှပါတယ်။ တခြား နေရာတွေမှာတော့ `'ignore'` နဲ့ ညီမျှပါတယ်။
6. {Stream} object: tty, file, socket, (သို့) pipe တစ်ခုကို ရည်ညွှန်းတဲ့ readable (သို့) writable stream တစ်ခုကို child process နဲ့ မျှဝေပါတယ်။ Stream ရဲ့ အခြေခံ file descriptor ကို child process ထဲမှာ — `stdio` array ထဲက index နဲ့ သက်ဆိုင်တဲ့ fd ဆီကို — ပုံတူပွား (duplicate) လုပ်ပါတယ်။ Stream မှာ အခြေခံ descriptor တစ်ခု ရှိရပါမယ် (file streams တွေက `'open'` event ဖြစ်ပြီးမှသာ စတင်လို့ ရတာမို့ပါ)။
   **NOTE:** `stdin` ကို writable အနေနဲ့ (သို့) `stdout`/`stderr` တွေကို readable အနေနဲ့ ပေးပို့တာက နည်းပညာအရ ဖြစ်နိုင်ပေမယ့် — အကြံပြုလိုတာ မဟုတ်ပါဘူး။
   Readable နဲ့ writable streams တွေက မတူညီတဲ့ အပြုအမူတွေနဲ့ ဒီဇိုင်းထုတ်ထားတာမို့ — သူတို့ကို မမှန်မကန် သုံးမိရင် (ဥပမာ writable stream မျှော်လင့်တဲ့ နေရာမှာ readable stream တစ်ခု ပေးမိတာမျိုး) — မမျှော်လင့်တဲ့ ရလဒ်တွေ (သို့) errors တွေ ဖြစ်လာနိုင်ပါတယ်။ Stream တစ်ခု error ကြုံရတဲ့အခါ undefined behavior (သို့) callbacks တွေ ပျောက်ဆုံးသွားတာတွေ ဖြစ်နိုင်လို့ — ဒီအလေ့အထကို မထောက်ခံပါဘူး။ Parent နဲ့ child processes တွေကြားမှာ ရည်ရွယ်ထားတဲ့ data စီးဆင်းမှုကို ထိန်းသိမ်းဖို့ — `stdin` ကို readable အနေနဲ့၊ `stdout`/`stderr` တွေကို writable အနေနဲ့ပဲ အမြဲ သုံးပါ။
7. Positive integer: ဒီ integer တန်ဖိုးကို — parent process ထဲမှာ ဖွင့်ထားတဲ့ file descriptor တစ်ခုအနေနဲ့ — အဓိပ္ပာယ် ဖော်ဆောင်ပါတယ်။ {Stream} objects တွေကို မျှဝေသလိုပဲ — ဒါကို child process နဲ့ မျှဝေပါတယ်။ Windows မှာတော့ sockets တွေကို ပေးပို့တာကို ပံ့ပိုးမထားပါဘူး။
8. `null`, `undefined`: Default တန်ဖိုးကို သုံးပါတယ်။ stdio fd 0, 1, နဲ့ 2 (ဆိုလိုတာ stdin, stdout, နဲ့ stderr) တွေအတွက်တော့ pipe တစ်ခုကို ဖန်တီးပါတယ်။ fd 3 နဲ့ အထက်အတွက်တော့ default က `'ignore'` ပါ။

```cjs
const { spawn } = require('node:child_process');

// Child will use parent's stdios.
spawn('prg', [], { stdio: 'inherit' });

// Spawn child sharing only stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Open an extra fd=4, to interact with programs presenting a
// startd-style interface.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```mjs
import { spawn } from 'node:child_process';
import process from 'node:process';

// Child will use parent's stdios.
spawn('prg', [], { stdio: 'inherit' });

// Spawn child sharing only stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Open an extra fd=4, to interact with programs presenting a
// startd-style interface.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

_Parent နဲ့ child processes တွေကြားမှာ IPC channel တစ်ခု တည်ဆောက်ထားပြီး child process က Node.js instance တစ်ခု ဖြစ်နေရင် — child process က [`'disconnect'`][] event (သို့) [`'message'`][] event အတွက် event handler တစ်ခု register မလုပ်မချင်း — IPC channel ကို unreference လုပ်ထားတဲ့အနေနဲ့ (`unref()` သုံးပြီး) launch လုပ်တယ် ဆိုတာ မှတ်သားထိုက်ပါတယ်။ ဒါက child process ကို — ဖွင့်ထားတဲ့ IPC channel ကြောင့် process က ဖွင့်ထားခံရပြီး မရပ်တန့်ဘဲ မနေဘဲ — ပုံမှန်အတိုင်း exit ဖြစ်ခွင့် ပြုပါတယ်။_
ဆက်လက်ကြည့်ရှုရန်: [`child_process.exec()`][] နဲ့ [`child_process.fork()`][]။

## Synchronous ပုံစံဖြင့် process ဖန်တီးခြင်း (Synchronous process creation)

[`child_process.spawnSync()`][], [`child_process.execSync()`][], နဲ့ [`child_process.execFileSync()`][] methods တွေက synchronous ဖြစ်ပြီး — spawn လုပ်ထားတဲ့ process က exit မဖြစ်မချင်း — Node.js event loop ကို ပိတ်ဆို့ (block) လုပ်လို့ တခြား code တွေ ထပ်ပြီး run လုပ်တာကို ရပ်နားထားပါတယ်။

ဒီလို blocking ဖြစ်တဲ့ calls တွေက အဓိကအားဖြင့် — ယေဘုယျ ရည်ရွယ်ချက်သုံး (general-purpose) scripting tasks တွေကို ရိုးရှင်းအောင် လုပ်ဖို့နဲ့ — application ရဲ့ configuration တွေကို startup မှာ load လုပ်ခြင်း/process လုပ်ခြင်းကို ရိုးရှင်းအောင် လုပ်ဖို့အတွက် အသုံးဝင်ပါတယ်။

### `child_process.execFileSync(file[, args][, options])`

* `file` {string} Run လုပ်ရမယ့် executable file ရဲ့ name (သို့) path ပါ။
* `args` {string\[]} String arguments တွေရဲ့ list ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory ပါ။
  * `input` {string|Buffer|TypedArray|DataView} Spawn လုပ်ထားတဲ့ process ဆီကို stdin အနေနဲ့ ဖြတ်သန်း ပေးမယ့် တန်ဖိုး ပါ။ `stdio[0]` ကို `'pipe'` လို့ သတ်မှတ်ထားရင် — ဒီ တန်ဖိုးကို ပေးလိုက်တာက `stdio[0]` ကို override လုပ်ပါလိမ့်မယ်။
  * `stdio` {string|Array} Child ရဲ့ stdio configuration ပါ။ [`child_process.spawn()`][] ရဲ့ [`stdio`][] ကို ကြည့်ပါ။ `stdio` ကို သတ်မှတ်မထားရင် — `stderr` ကို default အားဖြင့် parent process ရဲ့ stderr ဆီ output လုပ်ပါလိမ့်မယ်။ **Default:** `'pipe'`။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `timeout` {number} Process ကို run လုပ်ခွင့်ပြုထားတဲ့ အချိန် အများဆုံး ပမာဏ (milliseconds နဲ့) ပါ။ **Default:** `undefined`။
  * `killSignal` {string|integer} Spawn လုပ်ထားတဲ့ process ကို kill လုပ်တဲ့အခါ သုံးမယ့် signal တန်ဖိုး ပါ။ **Default:** `'SIGTERM'`။
  * `maxBuffer` {number} stdout (သို့) stderr ပေါ်မှာ ခွင့်ပြုထားတဲ့ data ပမာဏ အများဆုံး (bytes နဲ့) ပါ။ ကျော်လွန်သွားရင် child process ကို terminate လုပ်လိုက်ပါတယ်။ [`maxBuffer` and Unicode][] မှာ ဖော်ပြထားတဲ့ သတိထားစရာကို ကြည့်ပါ။ **Default:** `1024 * 1024`။
  * `encoding` {string} Stdio inputs/outputs အားလုံးအတွက် သုံးမယ့် encoding ပါ။ **Default:** `'buffer'`။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးခံရမယ့် subprocess console window ကို ဖျောက်ထားပါတယ်။ **Default:** `false`။
  * `shell` {boolean|string} `true` ဆိုရင် `command` ကို shell တစ်ခုအတွင်းမှာ run လုပ်ပါတယ်။ Unix မှာ `'/bin/sh'` ကို သုံးပြီး Windows မှာ `process.env.ComSpec` ကို သုံးပါတယ်။ တခြား shell တစ်ခုကိုလည်း string အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ [Shell requirements][] နဲ့ [Default Windows shell][] ကို ကြည့်ပါ။ **Default:** `false` (shell မသုံးပါ)။
* Returns: {Buffer|string} Command ကနေ ထွက်လာတဲ့ stdout ပါ။

`child_process.execFileSync()` method က [`child_process.execFile()`][] နဲ့ ယေဘုယျအားဖြင့် အတူတူပါပဲ။ ကွာတာက — ဒီ method က child process လုံးဝ ပိတ်သွား (fully closed) တဲ့အထိ ပြန်မလာဘူး ဆိုတာပါ။ Timeout တစ်ခု ကြုံပြီး `killSignal` ကို ပို့လိုက်တဲ့အခါ — process က လုံးဝ exit မဖြစ်မချင်း ဒီ method က ပြန်မလာပါဘူး။

Child process က `SIGTERM` signal ကို ကြားဖြတ် (intercept) လုပ်ပြီး ကိုင်တွယ်ပေမယ့် exit မဖြစ်ဘူးဆိုရင် — parent process က child process exit ဖြစ်တဲ့အထိ ဆက်ပြီး စောင့်နေပါလိမ့်မယ်။

Process က timeout ဖြစ်ခဲ့ရင် (သို့) zero မဟုတ်တဲ့ (non-zero) exit code နဲ့ ဆုံးခဲ့ရင် — ဒီ method က အရင်းခံ [`child_process.spawnSync()`][] ရဲ့ ရလဒ် အပြည့်အစုံ ပါဝင်တဲ့ [`Error`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

**`shell` option ကို ဖွင့်ထားရင် ဒီ function ဆီကို သန့်စင်မထားတဲ့ (unsanitized) user input တွေကို မပေးပါနဲ့။ Shell metacharacters တွေ ပါဝင်တဲ့ input မှန်သမျှကို — ကြိုတင် မှန်းဆလို့ မရတဲ့ command execution တွေ စတင်ဖို့ အသုံးချနိုင်ပါတယ်။**

```cjs
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```mjs
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

### `child_process.execSync(command[, options])`

* `command` {string} Run လုပ်ရမယ့် command ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory ပါ။
  * `input` {string|Buffer|TypedArray|DataView} Spawn လုပ်ထားတဲ့ process ဆီကို stdin အနေနဲ့ ဖြတ်သန်း ပေးမယ့် တန်ဖိုး ပါ။ `stdio[0]` ကို `'pipe'` လို့ သတ်မှတ်ထားရင် — ဒီ တန်ဖိုးကို ပေးလိုက်တာက `stdio[0]` ကို override လုပ်ပါလိမ့်မယ်။
  * `stdio` {string|Array} Child ရဲ့ stdio configuration ပါ။ [`child_process.spawn()`][] ရဲ့ [`stdio`][] ကို ကြည့်ပါ။ `stdio` ကို သတ်မှတ်မထားရင် — `stderr` ကို default အားဖြင့် parent process ရဲ့ stderr ဆီ output လုပ်ပါလိမ့်မယ်။ **Default:** `'pipe'`။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `shell` {string} Command ကို execute လုပ်ဖို့ သုံးမယ့် shell ပါ။ [Shell requirements][] နဲ့ [Default Windows shell][] ကို ကြည့်ပါ။ **Default:** Unix မှာ `'/bin/sh'`၊ Windows မှာ `process.env.ComSpec`။
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `timeout` {number} Process ကို run လုပ်ခွင့်ပြုထားတဲ့ အချိန် အများဆုံး ပမာဏ (milliseconds နဲ့) ပါ။ **Default:** `undefined`။
  * `killSignal` {string|integer} Spawn လုပ်ထားတဲ့ process ကို kill လုပ်တဲ့အခါ သုံးမယ့် signal တန်ဖိုး ပါ။ **Default:** `'SIGTERM'`။
  * `maxBuffer` {number} stdout (သို့) stderr ပေါ်မှာ ခွင့်ပြုထားတဲ့ data ပမာဏ အများဆုံး (bytes နဲ့) ပါ။ ကျော်လွန်သွားရင် child process ကို terminate လုပ်ပြီး — ထွက်လာတဲ့ output တွေကို ဖြတ်တောက် (truncate) လိုက်ပါတယ်။ [`maxBuffer` and Unicode][] မှာ ဖော်ပြထားတဲ့ သတိထားစရာကို ကြည့်ပါ။ **Default:** `1024 * 1024`။
  * `encoding` {string} Stdio inputs/outputs အားလုံးအတွက် သုံးမယ့် encoding ပါ။ **Default:** `'buffer'`။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးခံရမယ့် subprocess console window ကို ဖျောက်ထားပါတယ်။ **Default:** `false`။
* Returns: {Buffer|string} Command ကနေ ထွက်လာတဲ့ stdout ပါ။

`child_process.execSync()` method က [`child_process.exec()`][] နဲ့ ယေဘုယျအားဖြင့် အတူတူပါပဲ။ ကွာတာက — ဒီ method က child process လုံးဝ ပိတ်သွားတဲ့အထိ ပြန်မလာဘူး ဆိုတာပါ။ Timeout တစ်ခု ကြုံပြီး `killSignal` ကို ပို့လိုက်တဲ့အခါ — process က လုံးဝ exit မဖြစ်မချင်း ဒီ method က ပြန်မလာပါဘူး။ Child process က `SIGTERM` signal ကို ကြားဖြတ် ကိုင်တွယ်ပြီး exit မဖြစ်ဘူးဆိုရင် — parent process က child process exit ဖြစ်တဲ့အထိ စောင့်ပါလိမ့်မယ်။

Process က timeout ဖြစ်ခဲ့ရင် (သို့) zero မဟုတ်တဲ့ exit code နဲ့ ဆုံးခဲ့ရင် — ဒီ method က throw လုပ်ပါလိမ့်မယ်။ [`Error`][] object ထဲမှာ [`child_process.spawnSync()`][] ကနေ ထွက်လာတဲ့ ရလဒ် တစ်ခုလုံး ပါဝင်ပါလိမ့်မယ်။

**ဒီ function ဆီကို သန့်စင်မထားတဲ့ (unsanitized) user input တွေကို ဘယ်တော့မှ မပေးပါနဲ့။ Shell metacharacters တွေ ပါဝင်တဲ့ input မှန်သမျှကို — ကြိုတင် မှန်းဆလို့ မရတဲ့ command execution တွေ စတင်ဖို့ အသုံးချနိုင်ပါတယ်။**

### `child_process.spawnSync(command[, args][, options])`

* `command` {string} Run လုပ်ရမယ့် command ပါ။
* `args` {string\[]} String arguments တွေရဲ့ list ပါ။
* `options` {Object}
  * `cwd` {string|URL} Child process ရဲ့ လက်ရှိ အလုပ်လုပ်ရာ directory ပါ။
  * `input` {string|Buffer|TypedArray|DataView} Spawn လုပ်ထားတဲ့ process ဆီကို stdin အနေနဲ့ ဖြတ်သန်း ပေးမယ့် တန်ဖိုး ပါ။ `stdio[0]` ကို `'pipe'` လို့ သတ်မှတ်ထားရင် — ဒီ တန်ဖိုးကို ပေးလိုက်တာက `stdio[0]` ကို override လုပ်ပါလိမ့်မယ်။
  * `argv0` {string} Child process ဆီ ပို့တဲ့ `argv[0]` ရဲ့ တန်ဖိုးကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပါတယ်။ မသတ်မှတ်ထားရင် `command` ဖြစ်သွားပါလိမ့်မယ်။
  * `stdio` {string|Array} Child ရဲ့ stdio configuration ပါ။ [`child_process.spawn()`][] ရဲ့ [`stdio`][] ကို ကြည့်ပါ။ **Default:** `'pipe'`။
  * `env` {Object} Environment key-value pairs တွေပါ။ **Default:** `process.env`။
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပေးပါတယ် (setuid(2) ကို ကြည့်ပါ)။
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပေးပါတယ် (setgid(2) ကို ကြည့်ပါ)။
  * `timeout` {number} Process ကို run လုပ်ခွင့်ပြုထားတဲ့ အချိန် အများဆုံး ပမာဏ (milliseconds နဲ့) ပါ။ **Default:** `undefined`။
  * `killSignal` {string|integer} Spawn လုပ်ထားတဲ့ process ကို kill လုပ်တဲ့အခါ သုံးမယ့် signal တန်ဖိုး ပါ။ **Default:** `'SIGTERM'`။
  * `maxBuffer` {number} stdout (သို့) stderr ပေါ်မှာ ခွင့်ပြုထားတဲ့ data ပမာဏ အများဆုံး (bytes နဲ့) ပါ။ ကျော်လွန်သွားရင် child process ကို terminate လုပ်ပြီး — ထွက်လာတဲ့ output တွေကို ဖြတ်တောက် (truncate) လိုက်ပါတယ်။ [`maxBuffer` and Unicode][] မှာ ဖော်ပြထားတဲ့ သတိထားစရာကို ကြည့်ပါ။ **Default:** `1024 * 1024`။
  * `encoding` {string} Stdio inputs/outputs အားလုံးအတွက် သုံးမယ့် encoding ပါ။ **Default:** `'buffer'`။
  * `shell` {boolean|string} `true` ဆိုရင် `command` ကို shell တစ်ခုအတွင်းမှာ run လုပ်ပါတယ်။ Unix မှာ `'/bin/sh'` ကို သုံးပြီး Windows မှာ `process.env.ComSpec` ကို သုံးပါတယ်။ တခြား shell တစ်ခုကိုလည်း string အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ [Shell requirements][] နဲ့ [Default Windows shell][] ကို ကြည့်ပါ။ **Default:** `false` (shell မသုံးပါ)။
  * `windowsVerbatimArguments` {boolean} Windows မှာ arguments တွေကို quoting (သို့) escaping လုံးဝ မလုပ်ပါဘူး။ Unix မှာတော့ လျစ်လျူရှုပါတယ်။ `shell` ကို CMD နဲ့ သတ်မှတ်ထားရင် ဒါကို `true` အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။ **Default:** `false`။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးခံရမယ့် subprocess console window ကို ဖျောက်ထားပါတယ်။ **Default:** `false`။
* Returns: {Object}
  * `pid` {number} Child process ရဲ့ pid ပါ။
  * `output` {Array} Stdio output ကနေ ထွက်လာတဲ့ ရလဒ်တွေရဲ့ array ပါ။
  * `stdout` {Buffer|string} `output[1]` ရဲ့ ပါဝင်မှု ပါ။
  * `stderr` {Buffer|string} `output[2]` ရဲ့ ပါဝင်မှု ပါ။
  * `status` {number|null} Subprocess ရဲ့ exit code ပါ — subprocess က signal တစ်ခုကြောင့် terminate ဖြစ်ခဲ့ရင်တော့ `null` ပါ။
  * `signal` {string|null} Subprocess ကို kill လုပ်ဖို့ သုံးခဲ့တဲ့ signal ပါ — subprocess က signal ကြောင့် terminate မဖြစ်ခဲ့ဘူးဆိုရင် `null` ပါ။
  * `error` {Error} Child process က failed (သို့) timed out ဖြစ်ခဲ့ရင် error object ပါ။

`child_process.spawnSync()` method က [`child_process.spawn()`][] နဲ့ ယေဘုယျအားဖြင့် အတူတူပါပဲ။ ကွာတာက — ဒီ function က child process လုံးဝ ပိတ်သွားတဲ့အထိ ပြန်မလာဘူး ဆိုတာပါ။ Timeout တစ်ခု ကြုံပြီး `killSignal` ကို ပို့လိုက်တဲ့အခါ — ဒီ method က process လုံးဝ exit မဖြစ်မချင်း ပြန်မလာပါဘူး။ Process က `SIGTERM` signal ကို ကြားဖြတ် ကိုင်တွယ်ပြီး exit မဖြစ်ဘူးဆိုရင် — parent process က child process exit ဖြစ်တဲ့အထိ စောင့်ပါလိမ့်မယ်။

**`shell` option ကို ဖွင့်ထားရင် ဒီ function ဆီကို သန့်စင်မထားတဲ့ (unsanitized) user input တွေကို မပေးပါနဲ့။ Shell metacharacters တွေ ပါဝင်တဲ့ input မှန်သမျှကို — ကြိုတင် မှန်းဆလို့ မရတဲ့ command execution တွေ စတင်ဖို့ အသုံးချနိုင်ပါတယ်။**

## Class: `ChildProcess`

* Extends: {EventEmitter}

`ChildProcess` ရဲ့ instances တွေက spawn လုပ်ထားတဲ့ child processes တွေကို ကိုယ်စားပြုပါတယ်။

`ChildProcess` instances တွေကို တိုက်ရိုက် ဖန်တီးဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ `ChildProcess` instances တွေကို ဖန်တီးဖို့ — [`child_process.spawn()`][], [`child_process.exec()`][], [`child_process.execFile()`][], (သို့) [`child_process.fork()`][] methods တွေကို သုံးပါ။

### Event: `'close'`

* `code` {number} Child process က သူ့ဘာသာ exit ဖြစ်ခဲ့ရင် exit code ပါ — signal တစ်ခုကြောင့် terminate ဖြစ်ခဲ့ရင်တော့ `null` ပါ။
* `signal` {string} Child process ကို terminate လုပ်ခဲ့တဲ့ signal ပါ — child process က signal ကြောင့် terminate မဖြစ်ခဲ့ဘူးဆိုရင် `null` ပါ။

`'close'` event က process တစ်ခု ပြီးဆုံးတာ _နဲ့_ child process ရဲ့ stdio streams တွေ ပိတ်သွားတာ နှစ်ခုလုံး ဖြစ်ပြီးမှသာ emit လုပ်ပါတယ်။ ဒါက [`'exit'`][] event နဲ့ ကွဲပြားပါတယ် — အကြောင်းက process အများအပြားက stdio streams တွေကို အတူတူ မျှဝေသုံးစွဲနိုင်လို့ပါ။ `'close'` event က — [`'exit'`][] ကို အရင် emit လုပ်ပြီးသား ဖြစ်စေ — child process spawn မအောင်မြင်ခဲ့ရင် [`'error'`][] ဖြစ်စေ — ပြီးမှသာ အမြဲတမ်း emit လုပ်ပါတယ်။

Process က exit ဖြစ်ခဲ့ရင် — `code` က process ရဲ့ နောက်ဆုံး exit code ဖြစ်ပြီး — မဟုတ်ရင် `null` ပါ။ Process က signal တစ်ခု လက်ခံရရှိလို့ terminate ဖြစ်ခဲ့ရင် — `signal` က signal ရဲ့ string name ဖြစ်ပြီး — မဟုတ်ရင် `null` ပါ။ ဒီနှစ်ခုထဲက တစ်ခုက အမြဲတမ်း non-`null` ဖြစ်ပါတယ်။

```cjs
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```mjs
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});

const [code] = await once(ls, 'close');
console.log(`child process close all stdio with code ${code}`);
```

### Event: `'disconnect'`

`'disconnect'` event က parent process ထဲမှာ [`subprocess.disconnect()`][] method (သို့) child process ထဲမှာ [`process.disconnect()`][] method ကို ခေါ်ပြီးနောက်မှာ emit လုပ်ပါတယ်။ Disconnect လုပ်ပြီးနောက်မှာ messages တွေ ပို့တာ/လက်ခံတာ နှစ်ခုလုံး မလုပ်နိုင်တော့ဘဲ — [`subprocess.connected`][] property က `false` ဖြစ်ပါတယ်။

### Event: `'error'`

* `err` {Error} Error ပါ။

`'error'` event ကို အောက်ပါ အခြေအနေမျိုးတွေမှာ emit လုပ်ပါတယ်:

* Process ကို spawn လုပ်လို့ မရခဲ့တဲ့အခါ။
* Process ကို kill လုပ်လို့ မရခဲ့တဲ့အခါ။
* Child process ဆီ message ပို့တာ မအောင်မြင်ခဲ့တဲ့အခါ။
* Child process ကို `signal` option ကနေတစ်ဆင့် abort လုပ်ခဲ့တဲ့အခါ။

Error တစ်ခု ဖြစ်ပြီးနောက်မှာ `'exit'` event က fire ဖြစ်ချင်လည်း ဖြစ်နိုင်၊ မဖြစ်လည်း မဖြစ်နိုင်ပါဘူး။ `'exit'` နဲ့ `'error'` events နှစ်ခုလုံးကို listen လုပ်တဲ့အခါ — handler functions တွေကို မတော်တဆ အကြိမ်များစွာ ခေါ်မိတာမျိုး မဖြစ်အောင် ကာကွယ်ထားပါ။

ဆက်လက်ကြည့်ရှုရန်: [`subprocess.kill()`][] နဲ့ [`subprocess.send()`][]။

### Event: `'exit'`

* `code` {number} Child process က သူ့ဘာသာ exit ဖြစ်ခဲ့ရင် exit code ပါ — signal တစ်ခုကြောင့် terminate ဖြစ်ခဲ့ရင်တော့ `null` ပါ။
* `signal` {string} Child process ကို terminate လုပ်ခဲ့တဲ့ signal ပါ — child process က signal ကြောင့် terminate မဖြစ်ခဲ့ဘူးဆိုရင် `null` ပါ။

`'exit'` event က child process ပြီးဆုံးပြီးနောက်မှာ emit လုပ်ပါတယ်။ Process က exit ဖြစ်ခဲ့ရင် — `code` က process ရဲ့ နောက်ဆုံး exit code ဖြစ်ပြီး — မဟုတ်ရင် `null` ပါ။ Process က signal တစ်ခု လက်ခံရရှိလို့ terminate ဖြစ်ခဲ့ရင် — `signal` က signal ရဲ့ string name ဖြစ်ပြီး — မဟုတ်ရင် `null` ပါ။ ဒီနှစ်ခုထဲက တစ်ခုက အမြဲတမ်း non-`null` ဖြစ်ပါတယ်။

`'exit'` event trigger ဖြစ်တဲ့အချိန်မှာ child process ရဲ့ stdio streams တွေ ဖွင့်ထားဆဲ ဖြစ်နိုင်ပါသေးတယ်။

Node.js က `SIGINT` နဲ့ `SIGTERM` တို့အတွက် signal handlers တွေကို တည်ဆောက်ထားလို့ — Node.js processes တွေက အဲဒီ signals တွေ လက်ခံရရှိတာနဲ့ ချက်ချင်း terminate ဖြစ်မှာ မဟုတ်ပါဘူး။ အဲဒီအစား Node.js က cleanup actions တစ်စုကို လုပ်ဆောင်ပြီးမှ — ကိုင်တွယ်ခဲ့တဲ့ signal ကို ပြန်လည် မြှင့်တင် (re-raise) လုပ်ပါလိမ့်မယ်။

waitpid(2) ကို ကြည့်ပါ။

`code` က signal ကြောင့် terminate ဖြစ်လို့ `null` ဖြစ်နေရင် — signal ကို POSIX exit code တစ်ခုအဖြစ် ပြောင်းဖို့ [`util.convertProcessSignalToExitCode()`][] ကို သုံးနိုင်ပါတယ်။

### Event: `'message'`

* `message` {Object} Parse လုပ်ပြီးသား JSON object (သို့) primitive တန်ဖိုး ပါ။
* `sendHandle` {Handle|undefined} `undefined` (သို့) [`net.Socket`][], [`net.Server`][], (သို့) [`dgram.Socket`][] object တစ်ခု ပါ။

`'message'` event က child process တစ်ခုက [`process.send()`][] ကို သုံးပြီး messages ပို့တဲ့အခါ trigger လုပ်ပါတယ်။

Message က serialization နဲ့ parsing ကို ဖြတ်သန်းရပါတယ်။ ရလာတဲ့ message က မူလ ပို့လိုက်တာနဲ့ တူချင်မှ တူပါလိမ့်မယ်။

Child process ကို spawn လုပ်တဲ့အခါ `serialization` option ကို `'advanced'` လို့ သတ်မှတ်ထားခဲ့ရင် — `message` argument ထဲမှာ JSON က ကိုယ်စားပြု မလုပ်နိုင်တဲ့ data တွေ ပါဝင်နိုင်ပါတယ်။ အသေးစိတ်အတွက် [Advanced serialization][] ကို ကြည့်ပါ။

### Event: `'spawn'`

`'spawn'` event က child process အောင်မြင်စွာ spawn ဖြစ်သွားတာနဲ့ emit လုပ်ပါတယ်။ Child process က အောင်မြင်စွာ spawn မဖြစ်ခဲ့ဘူးဆိုရင် — `'spawn'` event ကို emit မလုပ်ဘဲ — အဲဒီအစား `'error'` event ကို emit လုပ်ပါတယ်။

Emit လုပ်ခဲ့ရင် — `'spawn'` event က တခြား events တွေ အားလုံးနဲ့ `stdout` (သို့) `stderr` ကနေ data တစ်စုံတစ်ရာ လက်ခံရရှိတာတွေထက် အရင်က ရောက်လာပါတယ်။

`'spawn'` event က spawn လုပ်ထားတဲ့ process အတွင်းမှာ error တစ်ခု ဖြစ်ပျက်နေရင်တောင် — ဖြစ်ပျက်မှု ရှိမရှိနဲ့ မသက်ဆိုင်ဘဲ fire လုပ်ပါလိမ့်မယ်။ ဥပမာ — `bash some-command` က အောင်မြင်စွာ spawn ဖြစ်ခဲ့ရင် — `bash` က `some-command` ကို spawn လုပ်ဖို့ မအောင်မြင်ခဲ့ဘူးဆိုရင်တောင် — `'spawn'` event က fire ဖြစ်ပါတယ်။ ဒီ caveat က `{ shell: true }` သုံးတဲ့အခါမှာလည်း အကျုံးဝင်ပါတယ်။

### `subprocess.channel`

* Type: {Object} Child process ဆီကို သွားတဲ့ IPC channel ကို ကိုယ်စားပြုတဲ့ pipe တစ်ခု ပါ။

`subprocess.channel` property က child ရဲ့ IPC channel ကို ရည်ညွှန်းတဲ့ reference တစ်ခု ပါ။ IPC channel မရှိဘူးဆိုရင် — ဒီ property က `undefined` ဖြစ်ပါတယ်။

#### `subprocess.channel.ref()`

ဒီ method က — `.unref()` ကို အရင်က ခေါ်ထားခဲ့ဖူးရင် — IPC channel ကို parent process ရဲ့ event loop ဆက်ပြီး run နေစေမယ့် အနေအထား ဖြစ်စေပါတယ်။

#### `subprocess.channel.unref()`

ဒီ method က IPC channel ကို parent process ရဲ့ event loop ဆက်ပြီး run နေအောင် မလုပ်တော့ဘဲ — channel ဖွင့်ထားဆဲ အချိန်မှာတောင် event loop ကို ပြီးဆုံးခွင့် ပြုပါတယ်။

### `subprocess.connected`

* Type: {boolean} `subprocess.disconnect()` ကို ခေါ်ပြီးနောက်မှာ `false` အဖြစ် သတ်မှတ်ပါတယ်။

`subprocess.connected` property က child process ကနေ messages တွေ ပို့တာ/လက်ခံတာ ဆက်လုပ်နိုင်သေးလားဆိုတာကို ညွှန်ပြပါတယ်။ `subprocess.connected` က `false` ဖြစ်နေရင် — messages တွေ ပို့တာ/လက်ခံတာ မလုပ်နိုင်တော့ပါဘူး။

### `subprocess.disconnect()`

Parent နဲ့ child processes တွေကြားက IPC channel ကို ပိတ်လိုက်ပြီး — သူ့ကို ဆက်ထိန်းထားတဲ့ တခြား connections တွေ မရှိတော့တာနဲ့ — child process ကို ချောမွေ့စွာ (gracefully) exit ဖြစ်ခွင့် ပြုပါတယ်။ ဒီ method ကို ခေါ်ပြီးနောက်မှာ — parent ရော child process နှစ်ခုလုံးထဲက (သက်ဆိုင်ရာ) `subprocess.connected` နဲ့ `process.connected` properties တွေက `false` ဖြစ်သွားပြီး — processes တွေကြားမှာ messages တွေ ဖြတ်သန်း ပို့ဆောင်လို့ မရတော့ပါဘူး။

`'disconnect'` event ကို — လက်ခံရယူနေဆဲ messages တွေ မရှိတော့တဲ့အခါ — emit လုပ်ပါလိမ့်မယ်။ ဒါက `subprocess.disconnect()` ကို ခေါ်ပြီး ချက်ချင်းလိုလို အများဆုံး trigger ဖြစ်တတ်ပါတယ်။

Child process က Node.js instance တစ်ခု ဆိုရင် (ဥပမာ [`child_process.fork()`][] ကို သုံးပြီး spawn လုပ်ထားတာ) — IPC channel ကို ပိတ်ဖို့ `process.disconnect()` method ကို child process အတွင်းကနေလည်း ခေါ်နိုင်ပါတယ်။

### `subprocess.exitCode`

* Type: {integer}

`subprocess.exitCode` property က child process ရဲ့ exit code ကို ညွှန်ပြပါတယ်။ Child process က run နေဆဲ ဆိုရင် — ဒီ field က `null` ဖြစ်ပါလိမ့်မယ်။

Child process ကို signal တစ်ခုက terminate လုပ်လိုက်ရင် — `subprocess.exitCode` က `null` ဖြစ်ပြီး — [`subprocess.signalCode`][] ကို သတ်မှတ်ပေးပါလိမ့်မယ်။ သက်ဆိုင်တဲ့ POSIX exit code ကို ရဖို့ [`util.convertProcessSignalToExitCode(subprocess.signalCode)`][`util.convertProcessSignalToExitCode()`] ကို သုံးပါ။

### `subprocess.kill([signal])`

* `signal` {number|string}
* Returns: {boolean}

`subprocess.kill()` method က child process ဆီကို signal တစ်ခု ပို့ပေးပါတယ်။ Argument မပေးထားဘူးဆိုရင် — process ဆီ `'SIGTERM'` signal ကို ပို့ပါလိမ့်မယ်။ ရနိုင်တဲ့ signals တွေရဲ့ list အတွက် signal(7) ကို ကြည့်ပါ။ kill(2) အောင်မြင်ခဲ့ရင် ဒီ function က `true` ကို ပြန်ပေးပြီး — မအောင်မြင်ရင် `false` ကို ပြန်ပေးပါတယ်။

```cjs
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```mjs
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

Signal ကို ပေးပို့လို့ မရခဲ့ရင် [`ChildProcess`][] object က [`'error'`][] event တစ်ခု emit လုပ်နိုင်ပါတယ်။ Exit ဖြစ်ပြီးသား child process တစ်ခုဆီ signal ပို့တာက error မဟုတ်ပေမယ့် — ကြိုတင် မမြင်နိုင်တဲ့ အကျိုးဆက်တွေ ရှိနိုင်ပါတယ်။ အထူးသဖြင့် process identifier (PID) ကို တခြား process တစ်ခုဆီ ပြန်လည် သတ်မှတ်လိုက်ပြီးသား ဖြစ်နေရင် — signal က အဲဒီ process ဆီကို အစားထိုး ပေးပို့ခံရပြီး — မမျှော်လင့်တဲ့ ရလဒ်တွေ ဖြစ်လာနိုင်ပါတယ်။

ဒီ function ကို `kill` လို့ ခေါ်ပေမယ့် — child process ဆီ ပေးပို့တဲ့ signal က တကယ်တော့ process ကို terminate လုပ်တာ မဟုတ်ဘဲ ဖြစ်နိုင်ပါတယ်။

ကိုးကားအတွက် kill(2) ကို ကြည့်ပါ။

POSIX signals တွေ မရှိတဲ့ Windows ပေါ်မှာတော့ — signals တွေကို အောက်ပါအတိုင်း ကိုင်တွယ်ပါတယ်။ `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'`, နဲ့ `'SIGQUIT'` တွေက process ကို အတင်းအဓမ္မ ရုတ်ခြည်း terminate လုပ်ပါတယ် (`'SIGKILL'` နဲ့ ဆင်တူပါတယ်)။ Windows ပေါ်မှာ သိထားတဲ့ name ရှိတဲ့ တခြား signal တွေ (ဥပမာ `'SIGHUP'`) ကလည်း အလားတူပဲ လုပ်ဆောင်ပါတယ်။ `'SIGWINCH'` ကတော့ terminal ဖြစ်စေတဲ့ signal မဟုတ်ဘဲ — အတင်းအကျပ် ပြောင်းလဲ (coerce) လုပ်တာလည်း မခံရပါဘူး: `subprocess.kill()` က `ENOSYS` error တစ်ခု throw လုပ်ပြီး — child က ဆက်ပြီး run နေပါတယ်။ Windows ပေါ်မှာ မရှိတဲ့ signal name တစ်ခု (ဥပမာ `'SIGSTOP'`) ဆိုရင်တော့ `ERR_UNKNOWN_SIGNAL` error တစ်ခု throw လုပ်ပါတယ်။ အသေးစိတ်အတွက် [Signal Events][] ကို ကြည့်ပါ။

Linux ပေါ်မှာ — သူတို့ရဲ့ parent ကို kill လုပ်ဖို့ ကြိုးစားတဲ့အခါ — child processes တွေရဲ့ child processes တွေကို terminate လုပ်မှာ မဟုတ်ပါဘူး။ ဒါက — process အသစ်တစ်ခုကို shell တစ်ခုထဲမှာ run လုပ်တဲ့အခါ (သို့) `ChildProcess` ရဲ့ `shell` option ကို သုံးတဲ့အခါမျိုးမှာ — ဖြစ်နိုင်ခြေ များပါတယ်:

```cjs
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```mjs
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

### `subprocess[Symbol.dispose]()`

[`subprocess.kill()`][] ကို `'SIGTERM'` နဲ့အတူ ခေါ်ယူပါတယ်။

### `subprocess.killed`

* Type: {boolean} `subprocess.kill()` ကို သုံးပြီး child process ဆီ signal တစ်ခု အောင်မြင်စွာ ပို့လိုက်ပြီးနောက်မှာ `true` အဖြစ် သတ်မှတ်ပါတယ်။

`subprocess.killed` property က — `subprocess.kill()` ကနေ child process က signal တစ်ခုကို အောင်မြင်စွာ လက်ခံရရှိခဲ့လားဆိုတာ ညွှန်ပြပါတယ်။ `killed` property က child process terminate ဖြစ်ပြီလားဆိုတာကိုတော့ ညွှန်ပြတာ မဟုတ်ပါဘူး။

### `subprocess.pid`

* Type: {integer|undefined}

Child process ရဲ့ process identifier (PID) ကို ပြန်ပေးပါတယ်။ Child process က errors တွေကြောင့် spawn မအောင်မြင်ခဲ့ဘူးဆိုရင် — တန်ဖိုးက `undefined` ဖြစ်ပြီး `error` ကို emit လုပ်ပါတယ်။

```cjs
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```mjs
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

### `subprocess.ref()`

`subprocess.unref()` ကို ခေါ်ပြီးနောက်မှာ `subprocess.ref()` ကို ခေါ်လိုက်တာက — child process အတွက် ဖယ်ရှားလိုက်တဲ့ reference count ကို ပြန်လည် တည်ဆောက်ပေးပြီး — parent process က သူ့ဘာသာ exit မဖြစ်ခင် child process exit ဖြစ်တာကို စောင့်ဆိုင်းအောင် လုပ်ပါတယ်။

```cjs
const { spawn } = require('node:child_process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```mjs
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

### `subprocess.send(message[, sendHandle[, options]][, callback])`

* `message` {Object}
* `sendHandle` {Handle|undefined} `undefined` (သို့) [`net.Socket`][], [`net.Server`][], (သို့) [`dgram.Socket`][] object တစ်ခု ပါ။
* `options` {Object} `options` argument က — ရှိရင် — handle အမျိုးအစား တချို့ကို ပို့တဲ့အခါ parameterize လုပ်ဖို့ သုံးတဲ့ object တစ်ခု ပါ။ `options` မှာ အောက်ပါ properties တွေကို ပံ့ပိုးပါတယ်:
  * `keepOpen` {boolean} `net.Socket` instances တွေကို ဖြတ်သန်း ပေးပို့တဲ့အခါ သုံးနိုင်တဲ့ တန်ဖိုး ပါ။ `true` ဆိုရင် — socket ကို ပို့နေတဲ့ process ထဲမှာ ဖွင့်ထားဆဲ (open) အနေနဲ့ ထားပါတယ်။ **Default:** `false`။
* `callback` {Function}
* Returns: {boolean}

Parent နဲ့ child processes တွေကြားမှာ IPC channel တစ်ခု တည်ဆောက်ပြီးသား ဖြစ်တဲ့အခါ (ဆိုလိုတာ [`child_process.fork()`][] ကို သုံးထားတဲ့အခါ) — `subprocess.send()` method ကို child process ဆီ messages ပို့ဖို့ သုံးနိုင်ပါတယ်။ Child process က Node.js instance တစ်ခု ဆိုရင် — ဒီ messages တွေကို [`'message'`][] event ကနေတစ်ဆင့် လက်ခံရယူနိုင်ပါတယ်။

Message က serialization နဲ့ parsing ကို ဖြတ်သန်းရပါတယ်။ ရလာတဲ့ message က မူလ ပို့လိုက်တာနဲ့ တူချင်မှ တူပါလိမ့်မယ်။

ဥပမာ — parent script ထဲမှာ:

```cjs
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```mjs
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

ပြီးတော့ child script ဖြစ်တဲ့ `'sub.js'` က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```js
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```

Child Node.js processes တွေမှာ — child process က parent process ဆီ messages တွေ ပြန်ပို့ခွင့် ပြုတဲ့ — ကိုယ်ပိုင် [`process.send()`][] method တစ်ခု ရှိပါလိမ့်မယ်။

`{cmd: 'NODE_foo'}` message တစ်ခု ပို့တဲ့အခါမှာ အထူး အခြေအနေတစ်ခု ရှိပါတယ်။ `cmd` property ထဲမှာ `NODE_` prefix ပါဝင်တဲ့ messages တွေက Node.js core အတွင်းမှာ သုံးဖို့ သီးသန့်ထားပြီး — child ရဲ့ [`'message'`][] event ထဲမှာတော့ emit လုပ်မှာ မဟုတ်ပါဘူး။ အဲဒီအစား ဒီလို messages တွေကို `'internalMessage'` event ကို သုံးပြီး emit လုပ်ပြီး — Node.js က အတွင်းပိုင်းမှာ စားသုံး (consume) ပါတယ်။ Applications တွေအနေနဲ့ — ကြိုမသိဘဲ ပြောင်းလဲနိုင်တာမို့ — ဒီလို messages တွေကို သုံးတာ (သို့) `'internalMessage'` events တွေကို listen လုပ်တာတွေကို ရှောင်ကြဉ်သင့်ပါတယ်။

`subprocess.send()` ဆီ ပေးနိုင်တဲ့ optional `sendHandle` argument က — TCP server (သို့) socket object တစ်ခုကို child process ဆီ ဖြတ်သန်း ပေးပို့ဖို့ အတွက်ပါ။ Child process က object ကို — [`'message'`][] event ပေါ်မှာ register လုပ်ထားတဲ့ callback function ဆီ ပေးတဲ့ ဒုတိယ argument အနေနဲ့ — လက်ခံရရှိပါလိမ့်မယ်။ Socket ထဲမှာ လက်ခံရရှိပြီး buffer လုပ်ထားတဲ့ data တွေကိုတော့ child ဆီ ပို့မှာ မဟုတ်ပါဘူး။ IPC sockets တွေကို ပို့တာကို Windows မှာ ပံ့ပိုးမထားပါဘူး။

Optional `callback` က — message ပို့လိုက်ပြီးနောက်မှာ ဒါပေမယ့် child process က လက်ခံရရှိခင် — ခေါ်ယူခံရတဲ့ function တစ်ခု ပါ။ ဒီ function ကို argument တစ်ခုတည်းနဲ့ ခေါ်ပါတယ်: အောင်မြင်ရင် `null`၊ မအောင်မြင်ရင်တော့ [`Error`][] object တစ်ခု ဖြစ်ပါတယ်။

`callback` function မပေးထားဘဲ message ကို မပို့နိုင်ခဲ့ရင် — [`ChildProcess`][] object က `'error'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ ဥပမာ — child process က exit ဖြစ်ပြီးသား ဆိုရင် ဒီလို ဖြစ်နိုင်ပါတယ်။

Channel ပိတ်သွားပြီးသား ဖြစ်နေရင် (သို့) မပို့ရသေးတဲ့ messages တွေရဲ့ backlog က — ထပ်မပို့သင့်လောက်တဲ့ အဆင့်တစ်ခုကို ကျော်လွန်နေရင် — `subprocess.send()` က `false` ကို ပြန်ပေးပါလိမ့်မယ်။ မဟုတ်ရင်တော့ ဒီ method က `true` ကို ပြန်ပေးပါတယ်။ Flow control ကို အကောင်အထည်ဖော်ဖို့ `callback` function ကို သုံးနိုင်ပါတယ်။

#### ဥပမာ — server object တစ်ခု ပေးပို့ခြင်း (Example: sending a server object)

ဥပမာအားဖြင့် — အောက်ပါ ဥပမာမှာ ပြထားသလို — TCP server object တစ်ခုရဲ့ handle ကို child process ဆီ ဖြတ်သန်း ပေးဖို့ `sendHandle` argument ကို သုံးနိုင်ပါတယ်:

```cjs
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Open up the server object and send the handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```mjs
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Open up the server object and send the handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

ဒါဆိုရင် child process က server object ကို ဒီလိုမျိုး လက်ခံရရှိပါလိမ့်မယ်:

```js
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```

Server ကို parent နဲ့ child ကြားမှာ မျှဝေလိုက်ပြီဆိုရင် — connection တချို့ကို parent က ကိုင်တွယ်နိုင်ပြီး — တချို့ကို child က ကိုင်တွယ်နိုင်ပါတယ်။

အထက်က ဥပမာက `node:net` module နဲ့ ဖန်တီးထားတဲ့ server တစ်ခုကို သုံးထားပေမယ့် — `node:dgram` module ရဲ့ servers တွေကလည်း — `'connection'` အစား `'message'` event ကို listen လုပ်တာနဲ့ `server.listen()` အစား `server.bind()` ကို သုံးတာ ကလွဲလို့ — လုပ်ငန်းစဉ် (workflow) အတိအကျ အတူတူပါပဲ။ ဒါပေမယ့် ဒါက Unix platforms တွေပေါ်မှာပဲ ပံ့ပိုးပါတယ်။

#### ဥပမာ — socket object တစ်ခု ပေးပို့ခြင်း (Example: sending a socket object)

အလားတူပဲ — socket တစ်ခုရဲ့ handle ကို child process ဆီ ဖြတ်သန်း ပေးဖို့ `sendHandle` argument ကို သုံးနိုင်ပါတယ်။ အောက်ပါ ဥပမာက — "normal" (သို့) "special" priority နဲ့ connections တွေကို အသီးသီး ကိုင်တွယ်မယ့် — child နှစ်ခုကို spawn လုပ်ပါတယ်:

```cjs
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Open up the server and send sockets to child. Use pauseOnConnect to prevent
// the sockets from being read before they are sent to the child process.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // If this is special priority...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // This is normal priority.
  normal.send('socket', socket);
});
server.listen(1337);
```

```mjs
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Open up the server and send sockets to child. Use pauseOnConnect to prevent
// the sockets from being read before they are sent to the child process.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // If this is special priority...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // This is normal priority.
  normal.send('socket', socket);
});
server.listen(1337);
```

`subprocess.js` ကတော့ socket handle ကို — event callback function ဆီ ပေးတဲ့ ဒုတိယ argument အနေနဲ့ — လက်ခံရရှိပါလိမ့်မယ်:

```js
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Check that the client socket exists.
      // It is possible for the socket to be closed between the time it is
      // sent and the time it is received in the child process.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```

Subprocess တစ်ခုဆီ ဖြတ်သန်း ပေးပို့ပြီးသား socket တစ်ခုပေါ်မှာ `.maxConnections` ကို မသုံးပါနဲ့။ Socket ကို ဘယ်အချိန်မှာ destroy လုပ်လိုက်လဲဆိုတာကို parent က ခြေရာခံလို့ မရပါဘူး။

Subprocess ထဲက `'message'` handlers တွေက `socket` ရှိမရှိကို စစ်ဆေးသင့်ပါတယ် — အကြောင်းက connection ကို child ဆီ ပို့ဆောင်တဲ့ အချိန်အတောအတွင်းမှာ connection ပိတ်သွားခဲ့တာ ဖြစ်နိုင်လို့ပါ။

### `subprocess.signalCode`

* Type: {string|null}

`subprocess.signalCode` property က — ရှိရင် — child process က လက်ခံရရှိတဲ့ signal ကို ညွှန်ပြပြီး — မရှိရင် `null` ပါ။

Child process ကို signal တစ်ခုက terminate လုပ်လိုက်ရင် — [`subprocess.exitCode`][] က `null` ဖြစ်ပါလိမ့်မယ်။ သက်ဆိုင်တဲ့ POSIX exit code ကို ရဖို့ [`util.convertProcessSignalToExitCode(subprocess.signalCode)`][`util.convertProcessSignalToExitCode()`] ကို သုံးပါ။

### `subprocess.spawnargs`

* Type: {Array}

`subprocess.spawnargs` property က — child process ကို launch လုပ်တုန်းက သုံးခဲ့တဲ့ — command-line arguments တွေရဲ့ စာရင်း အပြည့်အစုံကို ကိုယ်စားပြုပါတယ်။

### `subprocess.spawnfile`

* Type: {string}

`subprocess.spawnfile` property က launch လုပ်ထားတဲ့ child process ရဲ့ executable file name ကို ညွှန်ပြပါတယ်။

[`child_process.fork()`][] အတွက်ဆိုရင် — သူ့ရဲ့ တန်ဖိုးက [`process.execPath`][] နဲ့ တူညီပါလိမ့်မယ်။ [`child_process.spawn()`][] အတွက်ဆိုရင် — သူ့ရဲ့ တန်ဖိုးက executable file ရဲ့ name ဖြစ်ပါလိမ့်မယ်။ [`child_process.exec()`][] အတွက်ဆိုရင် — သူ့ရဲ့ တန်ဖိုးက child process ကို launch လုပ်ထားတဲ့ shell ရဲ့ name ဖြစ်ပါလိမ့်မယ်။

### `subprocess.stderr`

* Type: {stream.Readable|null|undefined}

Child process ရဲ့ `stderr` ကို ကိုယ်စားပြုတဲ့ `Readable Stream` တစ်ခု ပါ။

Child process ကို `stdio[2]` က `'pipe'` ကလွဲပြီး တခြား တန်ဖိုးတစ်ခုခုနဲ့ spawn လုပ်ထားခဲ့ရင် — ဒါက `null` ဖြစ်ပါလိမ့်မယ်။

`subprocess.stderr` က `subprocess.stdio[2]` ရဲ့ alias တစ်ခု ပါ။ Properties နှစ်ခုလုံးက တန်ဖိုးတစ်ခုတည်းကို ရည်ညွှန်းပါလိမ့်မယ်။

Child process ကို အောင်မြင်စွာ spawn မလုပ်နိုင်ခဲ့ဘူးဆိုရင် — `subprocess.stderr` property က `null` (သို့) `undefined` ဖြစ်နိုင်ပါတယ်။

### `subprocess.stdin`

* Type: {stream.Writable|null|undefined}

Child process ရဲ့ `stdin` ကို ကိုယ်စားပြုတဲ့ `Writable Stream` တစ်ခု ပါ။

Child process တစ်ခုက သူ့ရဲ့ input အားလုံးကို ဖတ်ဖို့ စောင့်နေမယ်ဆိုရင် — ဒီ stream ကို `end()` ကနေတစ်ဆင့် ပိတ်မပေးမချင်း — child process က ဆက်ပြီး မလှုပ်ရှားနိုင်ပါဘူး။

Child process ကို `stdio[0]` က `'pipe'` ကလွဲပြီး တခြား တန်ဖိုးတစ်ခုခုနဲ့ spawn လုပ်ထားခဲ့ရင် — ဒါက `null` ဖြစ်ပါလိမ့်မယ်။

`subprocess.stdin` က `subprocess.stdio[0]` ရဲ့ alias တစ်ခု ပါ။ Properties နှစ်ခုလုံးက တန်ဖိုးတစ်ခုတည်းကို ရည်ညွှန်းပါလိမ့်မယ်။

Child process ကို အောင်မြင်စွာ spawn မလုပ်နိုင်ခဲ့ဘူးဆိုရင် — `subprocess.stdin` property က `null` (သို့) `undefined` ဖြစ်နိုင်ပါတယ်။

### `subprocess.stdio`

* Type: {Array}

Child process ဆီ သွားတဲ့ pipes တွေရဲ့ sparse array တစ်ခု ပါ။ [`child_process.spawn()`][] ဆီ ပေးလိုက်တဲ့ [`stdio`][] option ထဲမှာ `'pipe'` တန်ဖိုးအဖြစ် သတ်မှတ်ထားတဲ့ နေရာတွေနဲ့ ကိုက်ညီပါတယ်။ `subprocess.stdio[0]`, `subprocess.stdio[1]`, နဲ့ `subprocess.stdio[2]` တွေကို — အသီးသီး — `subprocess.stdin`, `subprocess.stdout`, နဲ့ `subprocess.stderr` တွေအနေနဲ့လည်း ရယူနိုင်ပါတယ်။

အောက်ပါ ဥပမာမှာ — child ရဲ့ fd `1` (stdout) ကိုပဲ pipe အဖြစ် configure လုပ်ထားလို့ — parent ရဲ့ `subprocess.stdio[1]` ကပဲ stream တစ်ခု ဖြစ်ပြီး — array ထဲက တခြား တန်ဖိုးတွေ အားလုံးက `null` ဖြစ်ပါတယ်။

```cjs
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```mjs
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

Child process ကို အောင်မြင်စွာ spawn မလုပ်နိုင်ခဲ့ဘူးဆိုရင် — `subprocess.stdio` property က `undefined` ဖြစ်နိုင်ပါတယ်။

### `subprocess.stdout`

* Type: {stream.Readable|null|undefined}

Child process ရဲ့ `stdout` ကို ကိုယ်စားပြုတဲ့ `Readable Stream` တစ်ခု ပါ။

Child process ကို `stdio[1]` က `'pipe'` ကလွဲပြီး တခြား တန်ဖိုးတစ်ခုခုနဲ့ spawn လုပ်ထားခဲ့ရင် — ဒါက `null` ဖြစ်ပါလိမ့်မယ်။

`subprocess.stdout` က `subprocess.stdio[1]` ရဲ့ alias တစ်ခု ပါ။ Properties နှစ်ခုလုံးက တန်ဖိုးတစ်ခုတည်းကို ရည်ညွှန်းပါလိမ့်မယ်။

```cjs
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```mjs
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

Child process ကို အောင်မြင်စွာ spawn မလုပ်နိုင်ခဲ့ဘူးဆိုရင် — `subprocess.stdout` property က `null` (သို့) `undefined` ဖြစ်နိုင်ပါတယ်။

### `subprocess.unref()`

ပုံမှန်အားဖြင့် parent process က detached child process exit ဖြစ်တာကို စောင့်ပါတယ်။ ပေးထားတဲ့ `subprocess` တစ်ခု exit ဖြစ်တာကို parent process က မစောင့်စေချင်ဘူးဆိုရင် `subprocess.unref()` method ကို သုံးပါ။ အဲဒီလို လုပ်လိုက်ရင် — child process နဲ့ parent process ကြားမှာ IPC channel တစ်ခု တည်ဆောက်ထားတာ မရှိဘူးဆိုရင် — parent process ရဲ့ event loop က child process ကို သူ့ရဲ့ reference count ထဲမှာ မထည့်တော့ဘဲ — parent process က child process နဲ့ မသက်ဆိုင်ဘဲ သီးခြား exit ဖြစ်နိုင်ပါတယ်။

```cjs
const { spawn } = require('node:child_process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```mjs
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

## `maxBuffer` နဲ့ Unicode (`maxBuffer` and Unicode)

`maxBuffer` option က `stdout` (သို့) `stderr` ပေါ်မှာ ခွင့်ပြုထားတဲ့ bytes အရေအတွက် အများဆုံးကို သတ်မှတ်ပေးပါတယ်။ ဒီ တန်ဖိုးကို ကျော်လွန်သွားရင် — child process ကို terminate လုပ်ပါတယ်။ ဒါက UTF-8 (သို့) UTF-16 လိုမျိုး — multibyte character encodings တွေ ပါဝင်တဲ့ output တွေအပေါ် သက်ရောက်မှု ရှိပါတယ်။ ဥပမာ — `console.log('中文测试')` က character ၄ လုံးပဲ ရှိပေမယ့် — `stdout` ဆီကို UTF-8 encoded bytes ၁၃ ခု ပို့လိုက်ပါတယ်။

## Shell အတွက် လိုအပ်ချက်များ (Shell requirements)

Shell က `-c` switch ကို နားလည်ရပါမယ်။ Shell က `'cmd.exe'` ဆိုရင် — `/d /s /c` switches တွေကို နားလည်ပြီး — command-line parsing က သဟဇာတ (compatible) ဖြစ်ရပါမယ်။

## Windows ၏ ပုံမှန် shell (Default Windows shell)

Microsoft က root environment ထဲမှာ `%COMSPEC%` က `'cmd.exe'` ရဲ့ path ကို ပါဝင်ရမယ်လို့ သတ်မှတ်ထားပေမယ့် — child processes တွေကတော့ အဲဒီ လိုအပ်ချက်ကို အမြဲတမ်း လိုက်နာစရာ မလိုပါဘူး။ ဒါကြောင့် shell တစ်ခုကို spawn လုပ်လို့ရတဲ့ `child_process` functions တွေမှာ — `process.env.ComSpec` မရနိုင်ဘူးဆိုရင် — `'cmd.exe'` ကို fallback အနေနဲ့ သုံးပါတယ်။

## အဆင့်မြင့် serialization (Advanced serialization)

Child processes တွေက — [HTML structured clone algorithm][] ကို အခြေခံထားတဲ့ — [serialization API of the `node:v8` module][v8.serdes] ကို အခြေခံတဲ့ IPC အတွက် serialization mechanism တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဒါက ယေဘုယျအားဖြင့် ပိုပြီး စွမ်းဆောင်နိုင်ပြီး — `BigInt`, `Map` နဲ့ `Set`, `ArrayBuffer` နဲ့ `TypedArray`, `Buffer`, `Error`, `RegExp` စတဲ့ — built-in JavaScript object types တွေ ပိုများများကို ပံ့ပိုးပေးပါတယ်။

ဒါပေမယ့် ဒီ format က JSON ရဲ့ full superset တော့ မဟုတ်ပါဘူး။ ဥပမာ — ဒီလို built-in types တွေရဲ့ objects တွေပေါ်မှာ သတ်မှတ်ထားတဲ့ properties တွေက serialization အဆင့်ကို ဖြတ်သန်းတဲ့အခါ ပါသွားမှာ မဟုတ်ပါဘူး။ နောက်ပြီး — ပေးပို့တဲ့ data ရဲ့ တည်ဆောက်ပုံပေါ် မူတည်ပြီး — performance ကလည်း JSON နဲ့ ညီမျှမှု မရှိနိုင်ပါဘူး။ ဒါကြောင့် ဒီ feature ကို သုံးဖို့ဆိုရင် — [`child_process.spawn()`][] (သို့) [`child_process.fork()`][] ကို ခေါ်တဲ့အခါ — `serialization` option ကို `'advanced'` လို့ သတ်မှတ်ပြီး opt in လုပ်ဖို့ လိုပါတယ်။


[Advanced serialization]: #advanced-serialization
[DEP0190]: deprecations.md#DEP0190
[Default Windows shell]: #default-windows-shell
[HTML structured clone algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
[Shell requirements]: #shell-requirements
[Signal Events]: process.md#signal-events
[`'disconnect'`]: process.md#event-disconnect
[`'error'`]: #event-error
[`'exit'`]: #event-exit
[`'message'`]: process.md#event-message
[`ChildProcess`]: #class-childprocess
[`Error`]: errors.md#class-error
[`EventEmitter`]: events.md#class-eventemitter
[`child_process.exec()`]: #child_processexeccommand-options-callback
[`child_process.execFile()`]: #child_processexecfilefile-args-options-callback
[`child_process.execFileSync()`]: #child_processexecfilesyncfile-args-options
[`child_process.execSync()`]: #child_processexecsynccommand-options
[`child_process.fork()`]: #child_processforkmodulepath-args-options
[`child_process.spawn()`]: #child_processspawncommand-args-options
[`child_process.spawnSync()`]: #child_processspawnsynccommand-args-options
[`dgram.Socket`]: dgram.md#class-dgramsocket
[`maxBuffer` and Unicode]: #maxbuffer-and-unicode
[`net.Server`]: net.md#class-netserver
[`net.Socket`]: net.md#class-netsocket
[`options.detached`]: #optionsdetached
[`process.disconnect()`]: process.md#processdisconnect
[`process.env`]: process.md#processenv
[`process.execPath`]: process.md#processexecpath
[`process.send()`]: process.md#processsendmessage-sendhandle-options-callback
[`stdio`]: #optionsstdio
[`subprocess.connected`]: #subprocessconnected
[`subprocess.disconnect()`]: #subprocessdisconnect
[`subprocess.exitCode`]: #subprocessexitcode
[`subprocess.kill()`]: #subprocesskillsignal
[`subprocess.send()`]: #subprocesssendmessage-sendhandle-options-callback
[`subprocess.signalCode`]: #subprocesssignalcode
[`subprocess.stderr`]: #subprocessstderr
[`subprocess.stdin`]: #subprocessstdin
[`subprocess.stdio`]: #subprocessstdio
[`subprocess.stdout`]: #subprocessstdout
[`util.convertProcessSignalToExitCode()`]: util.md#utilconvertprocesssignaltoexitcodesignal
[`util.promisify()`]: util.md#utilpromisifyoriginal
[synchronous counterparts]: #synchronous-process-creation
[v8.serdes]: v8.md#serialization-api
