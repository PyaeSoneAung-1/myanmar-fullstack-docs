---
title: "Node.js Concurrency Models တွေကို နှိုင်းယှဉ်ခြင်း"
description: "Node.js ရဲ့ concurrency models သုံးမျိုး — child_process, worker_threads နဲ့ cluster — ကို ဘေးချင်းယှဉ်ပြီး ဘယ်အခြေအနေမှာ ဘယ်ဟာ သုံးသင့်လဲ ဆုံးဖြတ်နည်း"
order: 46
source: "https://nodejs.org/learn/concurrency/comparing-nodejs-concurrency-models"
status: translated
updated: 2026-09-02
---

## Node.js Concurrency Models တွေကို နှိုင်းယှဉ်ခြင်း

Node.js က ကိုယ့်ရဲ့ JavaScript ကို thread တစ်ခုတည်းပေါ်မှာ — event loop က မောင်းနှင်ပြီး run ပါတယ်။ ဒီ model က I/O-bound (file ဖတ်ခြင်း၊ database query လုပ်ခြင်း၊ HTTP requests ကိုင်တွယ်ခြင်း) အလုပ်တွေအတွက် အလွန် ကောင်းပါတယ် — အကြောင်းကတော့ Node က စောင့်ဆိုင်းရတဲ့ အလုပ်ကို operating system ဆီ လွှဲပေးပြီး thread ကို လွတ်လပ်စွာ ထားလို့ပါ။

ဒါပေမယ့် တခြား အခြေအနေနှစ်မျိုးအတွက်တော့ ဒီ model က မသင့်တော်ပါဘူး:

- **CPU-bound အလုပ်တွေ** (image resize လုပ်ခြင်း၊ hashing လုပ်ခြင်း၊ ကြီးမားတဲ့ payload တွေ parse လုပ်ခြင်း) က thread တစ်ခုတည်းကို သိမ်းပိုက်ထားလို့ — run နေတုန်း application တစ်ခုလုံး မတုံ့ပြန်နိုင်တော့ပါဘူး။
- **CPU cores တွေပေါ် ပြန့်ကျဲခြင်း (scaling)** — Node.js process တစ်ခုတည်းက machine မှာ core ဘယ်လောက်ပဲ ရှိရှိ — JavaScript အတွက် core တစ်ခုကိုပဲ အမြဲ သုံးပါတယ်။

ဒီပြဿနာတွေကို ဖြေရှင်းဖို့ Node.js မှာ built-in modules သုံးခု ပါဝင်ပါတယ် — `node:child_process`, `node:worker_threads` နဲ့ `node:cluster`။ ဒါတွေက တစ်ခုနဲ့တစ်ခု ထပ်နေတဲ့ ပြဿနာတွေကို နည်းလမ်းမတူဘဲ ဖြေရှင်းတာမို့ — တစ်ခါတစ်ရံ မှားတဲ့ဟာကို လှမ်းကိုင်မိတတ်ပါတယ်။ ဒီ guide က ဒီ module သုံးခုကို ဘေးချင်းယှဉ်ပြပြီး — ဘယ်အချိန်မှာ ဘယ်ဟာကို သုံးရမလဲဆိုတာ ရှင်းပြပေးမှာ ဖြစ်ပါတယ်။

## Option သုံးခုကို တစ်ချက်တည်း ခြုံကြည့်ခြင်း

| Module | ဘယ်မှာ run လဲ | Memory | ဆက်သွယ်ပုံ | ဘာအတွက် အကောင်းဆုံးလဲ |
| --- | --- | --- | --- | --- |
| `child_process` | သီးခြား process | Isolated (သီးခြား) | stdio, ဒါမှမဟုတ် IPC (`fork()`) | External programs တွေ run ခြင်း |
| `worker_threads` | သီးခြား thread | Share လုပ်လို့ရတယ် | `postMessage()` | CPU-bound JS အလုပ်များ |
| `cluster` | process အများအပြား | Isolated (သီးခြား) | IPC | Server တစ်ခုကို cores တွေပေါ် ပြန့်ကျဲစေခြင်း |

ဒါတွေကို ခွဲခြားသိဖို့ အသုံးဝင်တဲ့ နည်းတစ်ခုကတော့ — `cluster` က "server ကို cores တွေပေါ် scale လုပ်ခြင်း" ဆိုတဲ့ ပြဿနာကို ဖြေရှင်းဖို့ `child_process` ပေါ်မှာ တည်ဆောက်ထားတာပါ။ `worker_threads` ကတော့ process အသစ်တစ်ခုလုံးရဲ့ ကုန်ကျစရိတ်ကို မပေးဆောင်ဘဲ — "CPU-heavy code တွေကို မပိတ်ဆို့ဘဲ run ခြင်း" ဆိုတဲ့ ပြဿနာကို ဖြေရှင်းဖို့ ဖြစ်တည်လာတာပါ။

## Child Process

Shell command, binary, တခြားဘာသာစကားနဲ့ ရေးထားတဲ့ script လိုမျိုး — တခြား program တစ်ခုကို Node.js ကနေ run ဖို့လို၊ ဒါမှမဟုတ် stdio/IPC ကနေတစ်ဆင့် မောင်းနှင်ချင်တဲ့ အပြည့်အဝ သီးခြား Node.js process တစ်ခု လိုချင်ရင် `child_process` ကို သုံးပါ။

### `spawn`, `exec`, `execFile` နဲ့ `fork`

| Method | ဘာလုပ်လဲ | ဘယ်အခါ သုံးမလဲ |
| --- | --- | --- |
| `spawn()` | stdout/stderr တွေကို stream လုပ်ပေးတယ် | Long-running, output ကြီးတဲ့ အလုပ်များ |
| `exec()` | Shell တစ်ခုကနေတစ်ဆင့် output တစ်ခုလုံးကို buffer လုပ်တယ် | Command တိုတို, output သေးတဲ့ အလုပ်များ |
| `execFile()` | `exec()` နဲ့ တူပေမယ့် shell မပါဘူး | သိပြီးသား binary တစ်ခုကို လုံခြုံစွာ run ခြင်း |
| `fork()` | Node.js modules တွေအတွက် built-in IPC ပါတဲ့ `spawn()` | Parent/child Node.js messaging |

`exec()` က child ရဲ့ stdout/stderr တစ်ခုလုံးကို memory ထဲ buffer လုပ်ပြီး — process က exit ဖြစ်မှသာ callback ကို ခေါ်ပါတယ်။ ရလဒ်က default အနေနဲ့ 1 MiB (`maxBuffer`) မှာ ကန့်သတ်ထားလို့ — output ကြီးတာ (ဒါမှမဟုတ်) အကန့်အသတ်မရှိတာကို ဒီနည်းနဲ့ ဖမ်းယူဖို့ ကြိုးစားရင် output က ဖြတ်တောက်ခံရပြီး child ကိုပါ terminate လုပ်ပစ်ပါလိမ့်မယ်။ `execFile()` က shell တစ်ခုလုံးကို spawn လုပ်တာ ရှောင်လိုက်လို့ — command ရဲ့ အစိတ်အပိုင်း တချို့က user input ကနေ လာတဲ့အခါ shell-injection အန္တရာယ်ကိုလည်း ရှောင်ရှားနိုင်ပါတယ်။

### ဥပမာ — long-running command တစ်ခုကို `spawn()` နဲ့ stream လုပ်ခြင်း

```js
const { spawn } = require('node:child_process');

const child = spawn('ffmpeg', ['-i', 'input.mp4', 'output.mp3']);

child.stdout.on('data', data => console.log(`stdout: ${data}`));
child.stderr.on('data', data => console.error(`stderr: ${data}`));
child.on('close', code => console.log(`Process exited with code ${code}`));
```

`spawn()` က output တွေကို buffer လုပ်မယ့်အစား — ထွက်လာတာနဲ့အမျှ stream လုပ်ပေးပါတယ်။ ဒါကြောင့် long-running ဖြစ်တဲ့ (ဒါမှမဟုတ်) output ရဲ့ အရွယ်အစား ခန့်မှန်းလို့မရတဲ့ အလုပ်တွေအတွက် မှန်ကန်တဲ့ ရွေးချယ်မှုပါ။

### ဥပမာ — `fork()` နဲ့ တခြား Node.js process ကို စကားပြောခြင်း

```js
const { fork } = require('node:child_process');

const child = fork('./child.js');
child.send({ task: 'start', data: 42 });
child.on('message', result => console.log('Result from child:', result));
```

`fork()` က ready-made ဖြစ်ပြီး structured-clone အခြေခံတဲ့ IPC channel တစ်ခု (`.send()` / `'message'`) ကို ပေးပါတယ် — ဒါကြောင့် `spawn()` လိုမျိုး stdout ကို ကိုယ်တိုင် parse လုပ်စရာ မလိုတော့ပါဘူး။

### သတိထားရမည့် အချက်များ

- Output ကြီးထွားလာနိုင်တဲ့ အလုပ်တွေအတွက် `exec()` ကို ရှောင်ပါ — `spawn()` သုံးပြီး stream လုပ်ပါ။
- `'exit'` နဲ့ `'close'` events တွေကို အမြဲ ကိုင်တွယ်ပါ — ဒါမှ failure တွေကို သတိပြုမိပြီး resources တွေ (ဖွင့်ထားတဲ့ file descriptors, temporary files) ကို leak မဖြစ်အောင် ရှင်းလင်းနိုင်မှာပါ။
- Command ရဲ့ အစိတ်အပိုင်း တစ်ခုခုက user input ကနေ လာရင် — `exec()` အစား `execFile()`/`spawn()` ကို argument array နဲ့ သုံးပါ။ `exec()` က shell တစ်ခုကနေတစ်ဆင့် run လို့ arguments တွေကို sanitize မလုပ်ထားရင် shell injection ရဲ့ အန္တရာယ် ရှိပါတယ်။

## Worker Threads

`worker_threads` ကို JavaScript တွေကို *တစ်ခုတည်းသော* process အတွင်းက threads တွေမှာ — အပြိုင် (parallel) run နိုင်အောင် ထည့်ပေးထားတာပါ။ ရည်ရွယ်ချက်က CPU-bound အလုပ်တွေကို main thread ကနေ ဖယ်ထုတ်ပြီး — main thread မပိတ်ဆို့အောင် လုပ်ဖို့ပါ။ `child_process` နဲ့ မတူတာက — workers တွေက process တစ်ခုတည်းကို share လုပ်တာမို့ OS-level process အသစ် စတင်စရာ မလိုသလို memory နေရာလည်း လုံးဝ သီးခြား မဟုတ်ပါဘူး။

|  | Worker Threads | Child Process |
| --- | --- | --- |
| Context | Process တစ်ခုတည်း | သီးခြား process |
| Memory | `SharedArrayBuffer` ကနေတစ်ဆင့် share လို့ရတယ် | Isolated (သီးခြား) |
| Startup overhead | နည်းတယ် | ပိုများတယ် |
| ဆက်သွယ်ပုံ | `postMessage()` (မြန်တယ်) | stdio ဒါမှမဟုတ် IPC (နှေးတယ်) |

### ဥပမာ — CPU-bound အလုပ်ကို offload လုပ်ခြင်း

```js
const { Worker } = require('node:worker_threads');

const worker = new Worker('./hash-worker.js', {
  workerData: 'user-password',
});
worker.on('message', hash => console.log('Computed hash:', hash));
worker.on('error', err => console.error('Worker failed:', err));
```

Password hashing, image/video transforms, encryption နဲ့ in-memory ထဲက ကြီးမားတဲ့ payload တွေ parse လုပ်တာတွေက classic ဥပမာတွေပါ — ဒါတွေက pure CPU အလုပ်တွေဖြစ်ပြီး — main thread ပေါ်မှာ run ရင် Node.js က ကိုင်တွယ်နေတဲ့ တခြား request တွေ အားလုံး ရပ်တန့်သွားမှာမို့ပါ။

### Memory ကို မျှဝေခြင်း

Workers တွေက `SharedArrayBuffer` ကို `Atomics` API နဲ့တွဲပြီး — ဘေးကင်းတဲ့ concurrent access အတွက် သုံးကာ — `postMessage()` နဲ့ ဒေတာတွေကို ကူးယူနေစရာ မလိုဘဲ memory ကို တိုက်ရိုက် မျှဝေနိုင်ပါတယ်။ ဒါက large buffers တွေအတွက် serialization overhead ကို ရှောင်ပေးပေမယ့် — access တွေကို ကိုယ်တိုင် ညှိနှိုင်းရတော့မှာမို့ traditional multi-threaded programming တွေမှာ ရှိတတ်တဲ့ race-condition မျိုး bug တွေ ဝင်လာနိုင်တဲ့ အန္တရာယ်လည်း ရှိပါတယ်။

### သတိထားရမည့် အချက်များ

- Worker threads တွေက CPU-bound အလုပ်အတွက်ပါ — I/O အတွက် မဟုတ်ပါဘူး။ Worker တစ်ခုကလည်း main thread လိုပဲ I/O ပေါ်မှာ စောင့်ရပါသေးတယ် — ဒါကြောင့် database call (သို့) network request တစ်ခုအတွက် worker တစ်ခု စတင်တာက အကျိုးမရှိဘဲ overhead ပဲ တိုးစေပါတယ်။
- Worker တစ်ခု စတင်တာက ကုန်ကျစရိတ် ရှိပါတယ်။ သေးငယ်ပြီး မကြာခဏ လုပ်ရတဲ့ အလုပ်တွေအတွက်ဆိုရင် — setup overhead က အကျိုးကျေးဇူးထက် ကြီးနေနိုင်ပါတယ်။ အလုပ်တစ်ခုကို worker တစ်ခုစီ ဆောက်မယ့်အစား — long-lived workers တစ်စု (pool) ကို စဉ်းစားပါ ([workerpool](https://www.npmjs.com/package/workerpool) package ကို ကြည့်ပါ)။

## Cluster

`cluster` က မတူတဲ့ ပြဿနာတစ်ခုကို ဖြေရှင်းပါတယ် — Node.js process တစ်ခုတည်းက CPU core တစ်ခုကိုပဲ သုံးပါတယ်။ Multi-core machine တစ်လုံးကို network server အတွက် အခွင့်ကောင်းယူဖို့ဆိုရင် — `cluster` က process တစ်ခုလုံးရဲ့ copy အများအပြားကို fork လုပ်ပါတယ် (တစ်ခုချင်းစီက အောက်ခြေမှာ `child_process` တစ်ခုပါ)။ ဒီ workers တွေ အားလုံးက port တစ်ခုတည်းကိုပဲ နားထောင်ပါတယ်။

### ဥပမာ — HTTP server တစ်ခုကို cores တွေပေါ် scale လုပ်ခြင်း

```js
const cluster = require('node:cluster');
const http = require('node:http');
const { availableParallelism } = require('node:os');

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    if (worker.exitedAfterDisconnect) {
      // Voluntary exit (ဥပမာ worker.disconnect() သို့မဟုတ် cluster.disconnect())
      // — ပြန်စတင်စရာ မလိုပါဘူး။
      return;
    }

    console.log(`Worker ${worker.process.pid} died, restarting`);
    cluster.fork();
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end('handled by worker ' + process.pid);
    })
    .listen(3000);
}
```

Primary process (`cluster.isPrimary`) က core တစ်ခုချင်းစီအတွက် worker တစ်ခုစီ fork လုပ်ပြီး — မမျှော်လင့်ဘဲ exit ဖြစ်သွားတဲ့ worker တိုင်းကို ပြန်စတင်ပေးပါတယ်။ Worker တစ်ခုချင်းစီ (`cluster.isWorker`) ကတော့ ကိုယ့်ရဲ့ သာမန် server code ကို run ပြီး — သူက အများကြီးထဲက တစ်ခုဆိုတာ သတိမထားမိပါဘူး။ `worker.exitedAfterDisconnect` flag က voluntary exit (ဥပမာ graceful shutdown တစ်ခုအတွင်း `worker.disconnect()` ဒါမှမဟုတ် `cluster.disconnect()` ခေါ်တာ) ကို crash တစ်ခုနဲ့ ခွဲခြားပြတာပါ — ဒါကို မစစ်ဆေးဘူးဆိုရင် တမင်လုပ်လိုက်တဲ့ shutdown က workers အသစ်တွေ မရပ်မနား ဆက်ပွားနေစေမှာပါ။

### Workers တွေ port တစ်ခုကို ဘယ်လို မျှဝေကြလဲ

OS-level mechanism ကို အားမကိုးဘဲ — primary process ကိုယ်တိုင်က ဝင်လာတဲ့ connections တွေကို သူ့ရဲ့ workers တွေဆီ ဖြန့်ဝေပေးပါတယ် — default အနေနဲ့ round-robin ပုံစံ (`cluster.SCHED_RR`) နဲ့ပါ (Windows ကလွဲလို့ platform တိုင်းမှာ default ဖြစ်ပါတယ်)။ ဒါကို `cluster.schedulingPolicy` ကနေတစ်ဆင့် configure လုပ်လို့ရပါတယ်။ (ဒါကို `SO_REUSEPORT` နဲ့ လုပ်တာလို့ ပြောထားတဲ့ အဟောင်းစာတွေ တွေ့ရင်တော့ — Node ရဲ့ cluster module က default အနေနဲ့ အဲဒီလို မလုပ်ဘူးဆိုတာ သိထားပါ။)

### `isPrimary` / `isWorker`

`cluster.isPrimary` က workers တွေကို fork လုပ်တဲ့ process မှာ `true` ဖြစ်ပြီး — `cluster.isWorker` က fork လုပ်လိုက်တဲ့ workers တွေကိုယ်တိုင်မှာ `true` ဖြစ်ပါတယ်။ (Code အဟောင်းတွေမှာ `cluster.isMaster` ကိုလည်း တွေ့နိုင်ပါသေးတယ် — အလုပ်လုပ်နိုင်ပေမယ့် `isPrimary` ရဲ့ deprecated alias တစ်ခုပါ။)

### သတိထားရမည့် အချက်များ

- Workers တွေက သီးခြား process တွေမို့ **memory တွေ share မလုပ်ကြပါဘူး**။ In-memory sessions, caches ဒါမှမဟုတ် rate limiters တွေက workers တွေကြားမှာ မြင်ရမှာ မဟုတ်ဘူး — share လုပ်ရမယ့် ဘာမဆိုအတွက် Redis လိုမျိုး external store ကို သုံးပါ။
- Worker တစ်ခုရဲ့ `'exit'` event ကို အမြဲ ကိုင်တွယ်ပြီး ပြန်စဖို့ မစဖို့ ဆုံးဖြတ်ပါ — handle မလုပ်ထားတဲ့ crash တစ်ခုက server ရဲ့ capacity ကို တိတ်တဆိတ် လျှော့ချပစ်လို့ပါ။ Graceful shutdown ကို crash လို့ သတ်မှတ်ပြီး workers တွေ အဆုံးမဲ့ ပြန်ပွားနေတာမျိုး မဖြစ်အောင် `worker.exitedAfterDisconnect` ကို စစ်ဆေးပါ။
- Production မှာတော့ အသင်းအများစုက `cluster` ကို သုံးပြီး restart/reload logic တွေကို ကိုယ်တိုင် ရေးတာထက် — process manager (PM2, systemd ဒါမှမဟုတ် container orchestrator) တစ်ခုကို သုံးလေ့ ရှိကြပါတယ်။

## ဘယ်အချိန်မှာ ဘယ်ဟာကို ရွေးမလဲ

အမြန် ဆုံးဖြတ်နိုင်ဖို့ လမ်းညွှန်ချက်:

- **External program တစ်ခု (ဒါမှမဟုတ်) တခြားဘာသာစကားနဲ့ ရေးထားတဲ့ script တစ်ခုကို run ချင်လား?** → `child_process` (`spawn`/`execFile`)။
- **တခြား Node.js script တစ်ခုကို structured messaging နဲ့ သီးခြား process အနေနဲ့ run ချင်လား?** → `child_process.fork()`။
- **CPU-bound JavaScript တွေက event loop ကို ပိတ်ဆို့နေလား (hashing, image processing, တွက်ချက်မှုကြီးတွေ)?** → `worker_threads`။
- **Server ဆီ ဝင်လာတဲ့ traffic တွေကို ပိုကိုင်တွယ်နိုင်ဖို့ CPU cores အားလုံးကို သုံးချင်လား?** → `cluster` (ဒါမှမဟုတ် infrastructure အဆင့်မှာ အလားတူ လုပ်ပေးတဲ့ process manager/orchestrator)။

ဒါတွေက တစ်ခုနဲ့တစ်ခု သီးသန့် မဟုတ်ပါဘူး။ Image-upload service လိုမျိုး အတွက် ပုံမှန် pattern တစ်ခုက သုံးခုလုံးကို ပေါင်းသုံးတာပါ — `cluster` နဲ့ ဝင်လာတဲ့ requests တွေကို cores တွေပေါ် ပြန့်ကျဲစေပြီး — worker တစ်ခုချင်းစီအတွင်းမှာ `worker_threads` (ဒါမှမဟုတ် `child_process`) ကို သုံးပြီး အဲဒီ worker ရဲ့ event loop ကို မပိတ်ဆို့ဘဲ image processing အလုပ်ကို လုပ်တာမျိုးပါ။

## ဆက်ဖတ်ရန်

- [child_process API reference](https://nodejs.org/api/child_process.html)
- [worker_threads API reference](https://nodejs.org/api/worker_threads.html)
- [cluster API reference](https://nodejs.org/api/cluster.html)
- [Event Loop](/docs/nodejs/event-loop) — Node.js ရဲ့ event-driven architecture အခြေခံ
- [Event Loop ကို မပိတ်ဆို့ပါနဲ့](/docs/nodejs/dont-block-the-event-loop) — synchronous heavy work တွေနဲ့ event loop ပိတ်ဆို့ခြင်း
