---
title: "Cluster"
description: "node:cluster module — Node.js processes တွေကို shared server ports နဲ့ cluster လုပ်ခြင်း (Worker class, events, settings)။"
order: 89
source: "https://nodejs.org/api/cluster.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

Node.js processes တွေရဲ့ clusters တွေကို သုံးပြီး — Node.js instance အများအပြား run နိုင်ပါတယ်။ ဒီ instance တွေက application threads တွေကြားမှာ workloads (လုပ်ငန်းဝန်များ) တွေကို ခွဲဝေပေးနိုင်ပါတယ်။ Process isolation (process သီးခြား ခွဲထားမှု) မလိုအပ်ဘူးဆိုရင်တော့ — Node.js instance တစ်ခုတည်းအတွင်းမှာ application threads အများအပြား run လို့ရတဲ့ [`worker_threads`][] module ကို သုံးပါ။

Cluster module က server ports တွေကို အားလုံး အတူတကွ share လုပ်တဲ့ child processes တွေကို လွယ်ကူစွာ ဖန်တီးနိုင်အောင် ပံ့ပိုးပေးပါတယ်။

```mjs
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

```cjs
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

ဒါဆိုရင် Node.js ကို run လိုက်တဲ့အခါ port 8000 ကို workers တွေကြားမှာ share လုပ်ပါလိမ့်မယ်:

```console
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```

Windows မှာတော့ worker တစ်ခုထဲမှာ named pipe server တစ်ခု တပ်ဆင်ခြင်းက မဖြစ်နိုင်သေးပါဘူး။

## အလုပ်လုပ်ပုံ (How it works)

Worker processes တွေကို [`child_process.fork()`][] method နဲ့ spawn (မွေးထုတ်) လုပ်ပါတယ် — ဒါမှ သူတို့က parent နဲ့ IPC ကနေတစ်ဆင့် ဆက်သွယ်ပြီး server handles တွေကို အပြန်အလှန် ပေးပို့နိုင်မှာပါ။

Cluster module က incoming connections တွေကို ခွဲဝေပေးတဲ့ နည်းလမ်း နှစ်မျိုးကို ပံ့ပိုးပေးပါတယ်။

ပထမနည်းလမ်း (Windows ကလွဲလို့ platform အားလုံးမှာ default ဖြစ်တဲ့ နည်းလမ်း) ကတော့ round-robin နည်းလမ်းပါ — primary process က port တစ်ခုပေါ်မှာ listen လုပ်ပြီး connections အသစ်တွေကို လက်ခံကာ workers တွေဆီ round-robin ပုံစံနဲ့ ခွဲဝေပေးပါတယ်။ Worker process တစ်ခုကို overload မဖြစ်အောင် built-in logic တချို့လည်း ပါပါတယ်။

ဒုတိယနည်းလမ်းကတော့ — primary process က listen socket ကို ဖန်တီးပြီး စိတ်ဝင်စားတဲ့ workers တွေဆီ ပို့ပေးပါတယ်။ အဲဒီနောက် workers တွေက incoming connections တွေကို တိုက်ရိုက် လက်ခံပါတယ်။

ဒုတိယနည်းလမ်းက သီအိုရီအရတော့ အကောင်းဆုံး performance ကို ပေးသင့်ပါတယ်။ ဒါပေမယ့် လက်တွေ့မှာတော့ — operating system ရဲ့ scheduler က မမှန်မကန် ဆုံးဖြတ်တတ်တာမို့ distribution က အရမ်း မညီမျှတတ်ပါဘူး။ စုစုပေါင်း process ရှစ်ခုထဲက connection တွေရဲ့ 70% ကျော်က process နှစ်ခုထဲကိုပဲ ရောက်သွားတာမျိုးတွေကို လေ့လာ တွေ့ရှိရပါတယ်။

`server.listen()` က အလုပ်အများစုကို primary process ဆီ လွှဲပြောင်းပေးတာမို့ — ပုံမှန် Node.js process တစ်ခုနဲ့ cluster worker တစ်ခုကြားမှာ အပြုအမူ ကွဲပြားတဲ့ ကိစ္စ သုံးမျိုး ရှိပါတယ်:

1. `server.listen({fd: 7})` — message ကို primary ဆီ ပို့လိုက်တာမို့ file descriptor 7 ကို **parent process ထဲမှာ** listen လုပ်ပြီး handle ကို worker ဆီ လွှဲပေးလိုက်ပါတယ်။ Worker ရဲ့ အမြင်အရ နံပါတ် 7 file descriptor က ရည်ညွှန်းတာကို listen လုပ်တာ မဟုတ်ပါဘူး။
2. `server.listen(handle)` — handles တွေပေါ်မှာ တိုက်ရိုက် listen လုပ်တာက worker ကို primary process နဲ့ စကားပြောစရာ မလိုဘဲ ပေးလိုက်တဲ့ handle ကိုပဲ သုံးစေပါတယ်။
3. `server.listen(0)` — ပုံမှန်အားဖြင့် ဒါက servers တွေကို random port တစ်ခုပေါ်မှာ listen လုပ်စေပါတယ်။ ဒါပေမယ့် cluster တစ်ခုထဲမှာတော့ — worker တစ်ခုချင်းစီက `listen(0)` လုပ်တိုင်း တူညီတဲ့ "random" port ကိုပဲ ရပါလိမ့်မယ်။ အနှစ်ချုပ်ကတော့ — port က ပထမဆုံး အကြိမ်မှာပဲ random ဖြစ်ပြီး နောက်ပိုင်းမှာ ကြိုတင် ခန့်မှန်းလို့ရတဲ့ တန်ဖိုး ဖြစ်နေပါတယ်။ Unique port တစ်ခုပေါ်မှာ listen လုပ်ချင်ရင် — cluster worker ID ကို အခြေခံပြီး port နံပါတ်တစ်ခုကို ထုတ်လုပ်ပါ။

Node.js က routing logic ကို မပံ့ပိုးပေးပါဘူး။ ဒါကြောင့် — sessions နဲ့ login လိုမျိုး ကိစ္စတွေအတွက် in-memory data objects တွေကို အလွန်အကျွံ မှီခိုမနေအောင် application ကို ဒီဇိုင်းဆွဲထားဖို့ အရေးကြီးပါတယ်။

Workers တွေက အားလုံး သီးခြား processes တွေ ဖြစ်တာမို့ — program ရဲ့ လိုအပ်ချက်ပေါ် မူတည်ပြီး တခြား workers တွေကို မထိခိုက်စေဘဲ သတ်ပစ်တာ (သို့) ပြန် spawn လုပ်တာ လုပ်နိုင်ပါတယ်။ Worker တချို့ အသက်ရှင်နေသရွေ့ server က connections တွေကို ဆက်လက် လက်ခံပါလိမ့်မယ်။ Worker တစ်ယောက်မှ မကျန်တော့ရင်တော့ — တည်ရှိပြီးသား connections တွေကို ဖြတ်တောက်ပြီး connections အသစ်တွေကို ငြင်းပယ်ပါလိမ့်မယ်။ ဒါပေမယ့် Node.js က worker အရေအတွက်ကို အလိုအလျောက် စီမံမပေးပါဘူး။ Worker pool ကို ကိုယ့်လိုအပ်ချက်အလိုက် စီမံခန့်ခွဲတာက application ရဲ့ တာဝန်ပါ။

`node:cluster` module ရဲ့ အဓိက use case က networking ဖြစ်ပေမယ့် — worker processes တွေ လိုအပ်တဲ့ တခြား use cases တွေအတွက်လည်း သုံးနိုင်ပါတယ်။

## Class: `Worker`

* Extends: {EventEmitter}

`Worker` object တစ်ခုမှာ worker တစ်ခုအကြောင်း public information နဲ့ methods အားလုံး ပါဝင်ပါတယ်။ Primary ထဲမှာဆိုရင် `cluster.workers` ကို သုံးပြီး ရယူနိုင်ပြီး — worker တစ်ခုထဲမှာတော့ `cluster.worker` ကို သုံးပြီး ရယူနိုင်ပါတယ်။

### Event: `'disconnect'`

`cluster.on('disconnect')` event နဲ့ ဆင်တူပေမယ့် — ဒီ worker တစ်ခုအတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

```js
cluster.fork().on('disconnect', () => {
  // Worker has disconnected
});
```

### Event: `'error'`

ဒီ event က [`child_process.fork()`][] က ပေးတဲ့ event နဲ့ အတူတူပါပဲ။

Worker တစ်ခုထဲမှာ `process.on('error')` ကိုလည်း သုံးနိုင်ပါတယ်။

### Event: `'exit'`

* `code` {number} ပုံမှန်အတိုင်း ထွက်သွားခဲ့ရင် ရတဲ့ exit code။
* `signal` {string} process ကို သတ်ပစ်စေတဲ့ signal ရဲ့ နာမည် (ဥပမာ `'SIGHUP'`)။

`cluster.on('exit')` event နဲ့ ဆင်တူပေမယ့် — ဒီ worker တစ်ခုအတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

```mjs
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```

```cjs
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```

### Event: `'listening'`

* `address` {Object}

`cluster.on('listening')` event နဲ့ ဆင်တူပေမယ့် — ဒီ worker တစ်ခုအတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

```mjs
cluster.fork().on('listening', (address) => {
  // Worker is listening
});
```

```cjs
cluster.fork().on('listening', (address) => {
  // Worker is listening
});
```

Worker ထဲမှာတော့ ဒီ event ကို emit လုပ်မပေးပါဘူး။

### Event: `'message'`

* `message` {Object}
* `handle` {undefined|Object}

`cluster` ရဲ့ `'message'` event နဲ့ ဆင်တူပေမယ့် — ဒီ worker တစ်ခုအတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

Worker တစ်ခုထဲမှာ `process.on('message')` ကိုလည်း သုံးနိုင်ပါတယ်။

ကြည့်ရန်: [`process` event: `'message'`][]။

အောက်မှာ message system ကို သုံးတဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ်။ Primary process ထဲမှာ workers တွေ လက်ခံရရှိတဲ့ HTTP requests အရေအတွက်ကို ရေတွက်ထားပါတယ်:

```mjs
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

```cjs
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

### Event: `'online'`

`cluster.on('online')` event နဲ့ ဆင်တူပေမယ့် — ဒီ worker တစ်ခုအတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

```js
cluster.fork().on('online', () => {
  // Worker is online
});
```

Worker ထဲမှာတော့ ဒီ event ကို emit လုပ်မပေးပါဘူး။

### `worker.disconnect()`

* Returns: {cluster.Worker} `worker` ကို ရည်ညွှန်းတဲ့ reference ဖြစ်သည်။

Worker တစ်ခုထဲမှာဆိုရင် — ဒီ function က servers အားလုံးကို ပိတ်ပြီး၊ အဲဒီ servers တွေပေါ်က `'close'` event ကို စောင့်ဆိုင်းကာ၊ နောက်ဆုံးမှာ IPC channel ကို disconnect လုပ်ပါတယ်။

Primary ထဲမှာတော့ — worker က ကိုယ့်ကိုယ်ကိုယ် `.disconnect()` ခေါ်ဖို့ internal message တစ်ခုကို worker ဆီ ပို့ပါတယ်။

ဒါက `.exitedAfterDisconnect` ကို set ဖြစ်စေပါတယ်။

Server တစ်ခု ပိတ်သွားပြီးတဲ့နောက် — connections အသစ်တွေကို လက်ခံတော့မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် နားထောင်နေတဲ့ (listening) တခြား worker တစ်ယောက်ကတော့ connections တွေကို လက်ခံနိုင်ပါသေးတယ်။ တည်ရှိပြီးသား connections တွေကတော့ ပုံမှန်အတိုင်း ပိတ်ခွင့် ပြုပါတယ်။ Connections တွေ မရှိတော့တဲ့အခါ — [`server.close()`][] မှာ ကြည့်နိုင်သလို — worker ဆီက IPC channel က ပိတ်သွားပြီး worker ကို ချောမွေ့စွာ (gracefully) သေဆုံးခွင့် ပြုပါတယ်။

အပေါ်က အချက်တွေက server connections တွေကိုပဲ သက်ရောက်ပါတယ် — client connections တွေကို workers တွေက အလိုအလျောက် ပိတ်ပေးတာ မဟုတ်ဘဲ — disconnect က သူတို့ ပိတ်သွားတာကို မစောင့်ဘဲ ထွက်သွားပါတယ်။

Worker တစ်ခုထဲမှာ `process.disconnect` ဆိုတာ ရှိပါတယ် — ဒါပေမယ့် အဲဒါ ဒီ function မဟုတ်ပါဘူး; အဲဒါက [`disconnect()`][] ပါ။

ကြာရှည်ခံတဲ့ server connections တွေက worker တွေကို disconnect မလုပ်နိုင်အောင် ပိတ်ဆို့ထားနိုင်တာမို့ — message တစ်ခု ပို့ပြီး အဲဒီ connections တွေကို ပိတ်ဖို့ application-specific လုပ်ဆောင်ချက်တွေ လုပ်ဆောင်စေတာ အသုံးဝင်နိုင်ပါတယ်။ ဒါ့အပြင် — `'disconnect'` event က အချိန်တစ်ခုကြာတဲ့အထိ emit မဖြစ်ရင် worker ကို သတ်ပစ်မယ့် timeout တစ်ခု အကောင်အထည်ဖော်ထားတာလည်း အသုံးဝင်နိုင်ပါတယ်။

```js
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // Connections never end
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Initiate graceful close of any connections to server
    }
  });
}
```

### `worker.exitedAfterDisconnect`

* Type: {boolean}

Worker က `.disconnect()` ကြောင့် ထွက်သွားခဲ့ရင် ဒီ property က `true` ဖြစ်ပါတယ်။ Worker က တခြား နည်းလမ်းတစ်ခုခုနဲ့ ထွက်သွားခဲ့ရင်တော့ `false` ပါ။ Worker က မထွက်သေးဘူးဆိုရင် `undefined` ဖြစ်ပါတယ်။

Boolean တန်ဖိုး [`worker.exitedAfterDisconnect`][] က voluntary (ဆန္ဒအလျောက်) နဲ့ accidental (မတော်တဆ) exit တွေကို ခွဲခြားသိစေပါတယ် — primary က ဒီတန်ဖိုးကို အခြေခံပြီး worker ကို ပြန် respawn လုပ်မလုပ် ဆုံးဖြတ်နိုင်ပါတယ်။

```js
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, it was just voluntary – no need to worry');
  }
});

// kill worker
worker.kill();
```

### `worker.id`

* Type: {integer}

Worker အသစ်တစ်ခုချင်းစီကို ကိုယ်ပိုင် unique id တစ်ခု ပေးပါတယ် — ဒီ id ကို `id` ထဲမှာ သိမ်းထားပါတယ်။

Worker တစ်ခု အသက်ရှင်နေတုန်းမှာ ဒါက `cluster.workers` ထဲမှာ အဲဒီ worker ကို ညွှန်းဆိုတဲ့ key ဖြစ်ပါတယ်။

### `worker.isConnected()`

ဒီ function က worker တစ်ခုက ၎င်း၏ primary နဲ့ IPC channel ကနေတစ်ဆင့် ချိတ်ဆက်ထားရင် `true` ကို ပြန်ပေးပြီး — မချိတ်ဆက်ထားရင် `false` ကို ပြန်ပေးပါတယ်။ Worker တစ်ခုကို ဖန်တီးပြီးတာနဲ့ ၎င်းက primary နဲ့ ချိတ်ဆက်ပြီးသား ဖြစ်ပါတယ်။ `'disconnect'` event ကို emit လုပ်ပြီးတဲ့နောက်မှာတော့ ချိတ်ဆက်မှု ပြတ်သွားပါတယ်။

### `worker.isDead()`

ဒီ function က worker ရဲ့ process ရပ်တန့်သွားပြီဆိုရင် (exit ဖြစ်လို့ဖြစ်စေ၊ signal ပို့ခံရလို့ဖြစ်စေ) `true` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင်တော့ `false` ကို ပြန်ပေးပါတယ်။

```mjs
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

```cjs
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

### `worker.kill([signal])`

* `signal` {string} worker process ဆီ ပို့မယ့် kill signal ရဲ့ နာမည်။ **Default:** `'SIGTERM'`

ဒီ function က worker ကို သတ်ပစ်ပါတယ်။ Primary ထဲမှာဆိုရင် — `worker.process` ကို disconnect လုပ်ပြီး၊ disconnect ဖြစ်သွားတာနဲ့ `signal` နဲ့ သတ်ပါတယ်။ Worker ထဲမှာတော့ process ကိုယ်တိုင်ကို `signal` နဲ့ သတ်ပစ်တာပါ။

`kill()` function က graceful disconnect ကို မစောင့်ဘဲ worker process ကို ချက်ချင်း သတ်ပစ်တာပါ — `worker.process.kill()` နဲ့ အပြုအမူ တူညီပါတယ်။

ဒီ method ကို backwards compatibility (နောက်ကြောင်း လိုက်ဖက်မှု) အတွက် `worker.destroy()` အဖြစ် alias လုပ်ထားပါတယ်။

Worker တစ်ခုထဲမှာ `process.kill()` ဆိုတာ ရှိပါတယ် — ဒါပေမယ့် အဲဒါ ဒီ function မဟုတ်ပါဘူး; အဲဒါက [`kill()`][] ပါ။

### `worker.process`

* Type: {ChildProcess}

Workers တွေကို [`child_process.fork()`][] နဲ့ ဖန်တီးပြီး — အဲဒီ function က ပြန်ပေးတဲ့ object ကို `.process` အဖြစ် သိမ်းပါတယ်။ Worker တစ်ခုထဲမှာတော့ global `process` ကို သိမ်းပါတယ်။

ကြည့်ရန်: [Child Process module][]။

`process` ပေါ်မှာ `'disconnect'` event ဖြစ်ပြီး `.exitedAfterDisconnect` က `true` မဟုတ်ဘူးဆိုရင် — workers တွေက `process.exit(0)` ကို ခေါ်ပါလိမ့်မယ်။ ဒါက မတော်တဆ disconnect ဖြစ်မှုကနေ ကာကွယ်ပေးပါတယ်။

### `worker.send(message[, sendHandle[, options]][, callback])`

* `message` {Object}
* `sendHandle` {Handle}
* `options` {Object} `options` argument က ရှိမယ်ဆိုရင် — handle အမျိုးအစား တချို့ကို ပို့လွှတ်တာကို သတ်မှတ်ပြင်ဆင်ဖို့ (parameterize) သုံးတဲ့ object တစ်ခုပါ။ `options` မှာ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `keepOpen` {boolean} `net.Socket` instances တွေကို လွှဲပြောင်းပေးတဲ့အခါ သုံးနိုင်တဲ့ တန်ဖိုးတစ်ခုပါ။ `true` ဆိုရင် socket ကို ပို့လိုက်တဲ့ process ထဲမှာ ဖွင့်ထားဆဲ (open) ဖြစ်နေပါတယ်။ **Default:** `false`။
* `callback` {Function}
* Returns: {boolean}

Worker (သို့) primary ဆီ — လိုအပ်ရင် handle တစ်ခုနဲ့အတူ — message တစ်ခု ပို့ပါတယ်။

Primary ထဲမှာတော့ ဒါက သတ်မှတ်ထားတဲ့ worker တစ်ခုဆီ message ပို့တာပါ — [`ChildProcess.send()`][] နဲ့ အတူတူပါပဲ။

Worker ထဲမှာတော့ primary ဆီ message ပို့တာပါ — `process.send()` နဲ့ အတူတူပါပဲ။

အောက်က ဥပမာက primary ဆီကနေ လာတဲ့ messages တွေကို ပြန်ပြီး echo လုပ်ပေးပါတယ်:

```js
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

## Event: `'disconnect'`

* `worker` {cluster.Worker}

Worker ရဲ့ IPC channel က disconnect ဖြစ်သွားပြီးတဲ့နောက်မှာ ဒီ event ကို emit လုပ်ပါတယ်။ ဒါက worker တစ်ခု ချောမွေ့စွာ ထွက်သွားတဲ့အခါ၊ သတ်ခံရတဲ့အခါ၊ (သို့) ကိုယ်တိုင် disconnect လုပ်လိုက်တဲ့အခါမျိုး (ဥပမာ — `worker.disconnect()`) မှာ ဖြစ်နိုင်ပါတယ်။

`'disconnect'` နဲ့ `'exit'` events တွေကြားမှာ ကြန့်ကြာမှု (delay) ရှိနိုင်ပါတယ်။ ဒီ events တွေကို process က cleanup ထဲမှာ ပိတ်မိနေလား (သို့) ကြာရှည်ခံတဲ့ connections တွေ ရှိနေလားဆိုတာ စစ်ဆေးဖို့ သုံးနိုင်ပါတယ်။

```js
cluster.on('disconnect', (worker) => {
  console.log(`The worker #${worker.id} has disconnected`);
});
```

## Event: `'exit'`

* `worker` {cluster.Worker}
* `code` {number} ပုံမှန်အတိုင်း ထွက်သွားခဲ့ရင် ရတဲ့ exit code။
* `signal` {string} process ကို သတ်ပစ်စေတဲ့ signal ရဲ့ နာမည် (ဥပမာ `'SIGHUP'`)။

Worker တစ်ယောက်ယောက် သေဆုံးသွားတဲ့အခါ cluster module က `'exit'` event ကို emit လုပ်ပါတယ်။

ဒါကို [`.fork()`][] ကို ထပ်ခေါ်ပြီး worker ကို ပြန်စတင်ဖို့ သုံးနိုင်ပါတယ်။

```js
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```

ကြည့်ရန်: [`child_process` event: `'exit'`][]။

## Event: `'fork'`

* `worker` {cluster.Worker}

Worker အသစ်တစ်ခုကို fork လုပ်လိုက်တဲ့အခါ cluster module က `'fork'` event ကို emit လုပ်ပါတယ်။ ဒါကို worker ရဲ့ လုပ်ဆောင်ချက်တွေကို log တင်ဖို့နဲ့ custom timeout တစ်ခု ဖန်တီးဖို့ သုံးနိုင်ပါတယ်။

```js
const timeouts = [];
function errorMsg() {
  console.error('Something must be wrong with the connection ...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
```

## Event: `'listening'`

* `worker` {cluster.Worker}
* `address` {Object}

Worker တစ်ခုကနေ `listen()` ကို ခေါ်ပြီး — server ပေါ်မှာ `'listening'` event ကို emit လုပ်တဲ့အခါ — primary ထဲက `cluster` ပေါ်မှာလည်း `'listening'` event တစ်ခုကို emit လုပ်ပါတယ်။

Event handler ကို argument နှစ်ခုနဲ့ run လုပ်ပါတယ် — `worker` ထဲမှာ worker object ပါဝင်ပြီး `address` object ထဲမှာတော့ အောက်ပါ connection properties တွေ ပါဝင်ပါတယ်: `address`, `port`, နဲ့ `addressType`။ Worker တစ်ခုက address တစ်ခုထက် ပိုပြီး listen လုပ်နေတဲ့အခါ ဒါက အရမ်း အသုံးဝင်ပါတယ်။

```js
cluster.on('listening', (worker, address) => {
  console.log(
    `A worker is now connected to ${address.address}:${address.port}`);
});
```

`addressType` က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

* `4` (TCPv4)
* `6` (TCPv6)
* `-1` (Unix domain socket)
* `'udp4'` or `'udp6'` (UDPv4 or UDPv6)

## Event: `'message'`

* `worker` {cluster.Worker}
* `message` {Object}
* `handle` {undefined|Object}

Cluster primary က worker တစ်ယောက်ယောက်ဆီကနေ message တစ်ခု လက်ခံရရှိတဲ့အခါ ဒီ event ကို emit လုပ်ပါတယ်။

ကြည့်ရန်: [`child_process` event: `'message'`][]။

## Event: `'online'`

* `worker` {cluster.Worker}

Worker အသစ်တစ်ခုကို fork လုပ်ပြီးတဲ့နောက် — worker က online message တစ်ခုနဲ့ တုံ့ပြန်သင့်ပါတယ်။ Primary က online message တစ်ခု လက်ခံရရှိတဲ့အခါ ဒီ event ကို emit လုပ်ပါတယ်။ `'fork'` နဲ့ `'online'` ရဲ့ ကွာခြားချက်ကတော့ — fork က primary က worker တစ်ခုကို fork လုပ်လိုက်တဲ့အခါ emit ဖြစ်ပြီး၊ `'online'` က worker အလုပ်လုပ်နေပြီ (running) ဖြစ်တဲ့အခါ emit ဖြစ်ပါတယ်။

```js
cluster.on('online', (worker) => {
  console.log('Yay, the worker responded after it was forked');
});
```

## Event: `'setup'`

* `settings` {Object}

[`.setupPrimary()`][] ကို ခေါ်လိုက်တိုင်း ဒီ event ကို emit လုပ်ပါတယ်။

`settings` object ဆိုတာ [`.setupPrimary()`][] ကို ခေါ်လိုက်ချိန်မှာ ရှိနေတဲ့ `cluster.settings` object ပဲ ဖြစ်ပါတယ် — [`.setupPrimary()`][] ကို tick တစ်ခုတည်းထဲမှာ အကြိမ်များစွာ ခေါ်နိုင်တာမို့ ဒါက အကြံပြုချက် (advisory) သက်သက်ပါ။

တိကျမှု အရေးကြီးရင်တော့ `cluster.settings` ကို သုံးပါ။

## `cluster.disconnect([callback])`

* `callback` {Function} workers အားလုံး disconnected ဖြစ်ပြီး handles တွေ ပိတ်သွားတဲ့အခါ ခေါ်ပါတယ်။

`cluster.workers` ထဲက worker တစ်ခုချင်းစီပေါ်မှာ `.disconnect()` ကို ခေါ်ပါတယ်။

သူတို့ အားလုံး disconnected ဖြစ်သွားတဲ့အခါ — internal handles အားလုံး ပိတ်သွားပြီး၊ တခြား စောင့်ဆိုင်းနေတဲ့ event တစ်ခုမှ မရှိရင် primary process ကို ချောမွေ့စွာ သေဆုံးခွင့် ပြုပါတယ်။

ဒီ method က optional callback argument တစ်ခုကို လက်ခံပြီး — အလုပ်ပြီးဆုံးတဲ့အခါ အဲဒီ callback ကို ခေါ်ပေးပါတယ်။

ဒါကို primary process ကနေပဲ ခေါ်လို့ရပါတယ်။

## `cluster.fork([env])`

* `env` {Object} worker process ရဲ့ environment ထဲ ထည့်ဖို့ key/value အတွဲများ။
* Returns: {cluster.Worker}

Worker process အသစ်တစ်ခုကို spawn လုပ်ပါတယ်။

ဒါကို primary process ကနေပဲ ခေါ်လို့ရပါတယ်။

## `cluster.isMaster`

> Stability: 0 - Deprecated

[`cluster.isPrimary`][] အတွက် deprecated alias (အသုံးမပြုတော့သော နာမည်ပြောင်း) တစ်ခုပါ။

## `cluster.isPrimary`

* Type: {boolean}

Process က primary တစ်ခု ဆိုရင် `true` ဖြစ်ပါတယ်။ ဒါကို `process.env.NODE_UNIQUE_ID` နဲ့ ဆုံးဖြတ်ပါတယ်။ `process.env.NODE_UNIQUE_ID` က undefined ဖြစ်နေရင် `isPrimary` က `true` ပါ။

## `cluster.isWorker`

* Type: {boolean}

Process က primary မဟုတ်ဘူးဆိုရင် `true` ဖြစ်ပါတယ် (`cluster.isPrimary` ရဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်)။

## `cluster.schedulingPolicy`

Scheduling policy ပါ — round-robin အတွက် `cluster.SCHED_RR` (သို့) operating system ကိုပဲ လွှဲထားဖို့ `cluster.SCHED_NONE` ဖြစ်ပါတယ်။ ဒါက global setting တစ်ခု ဖြစ်ပြီး — ပထမဆုံး worker ကို spawn လုပ်လိုက်တာပဲဖြစ်ဖြစ်၊ [`.setupPrimary()`][] ကို ခေါ်လိုက်တာပဲဖြစ်ဖြစ် — ဘယ်ဟာ အရင်ဖြစ်ဖြစ် — အဲဒီနောက်မှာ ထိထိရောက်ရောက် အေးခဲသွားပါတယ် (effectively frozen)။

`SCHED_RR` က Windows ကလွဲလို့ operating system အားလုံးမှာ default ဖြစ်ပါတယ်။ Windows မှာတော့ — libuv က IOCP handles တွေကို performance သိသိသာသာ မထိခိုက်စေဘဲ ထိရောက်စွာ ခွဲဝေပေးနိုင်တာနဲ့ `SCHED_RR` ကို ပြောင်းသွားပါလိမ့်မယ်။

`cluster.schedulingPolicy` ကို `NODE_CLUSTER_SCHED_POLICY` environment variable ကနေတစ်ဆင့်လည်း သတ်မှတ်နိုင်ပါတယ်။ တရားဝင် (valid) တန်ဖိုးတွေကတော့ `'rr'` နဲ့ `'none'` တို့ပါ။

## `cluster.settings`

* Type: {Object}
  * `execArgv` {string\[]} Node.js executable ဆီ ပေးပို့တဲ့ string arguments များစာရင်း။ **Default:** `process.execArgv`။
  * `exec` {string} worker file ရဲ့ file path။ **Default:** `process.argv[1]`။
  * `args` {string\[]} worker ဆီ ပေးပို့တဲ့ string arguments များ။ **Default:** `process.argv.slice(2)`။
  * `cwd` {string} worker process ရဲ့ လက်ရှိ working directory။ **Default:** `undefined` (parent process ကနေ အမွေဆက်ခံသည်)။
  * `serialization` {string} processes တွေကြားမှာ messages ပို့ဖို့ သုံးတဲ့ serialization အမျိုးအစားကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့ `'json'` နဲ့ `'advanced'` တို့ပါ။ အသေးစိတ်အတွက် [Advanced serialization for `child_process`][] ကို ကြည့်ပါ။ **Default:** `false`။
  * `silent` {boolean} Output တွေကို parent ရဲ့ stdio ဆီ ပို့မပို့ သတ်မှတ်ချက်။ **Default:** `false`။
  * `stdio` {Array} Forked processes တွေရဲ့ stdio ကို ပြင်ဆင် သတ်မှတ်ပါတယ်။ Cluster module က အလုပ်လုပ်ဖို့ IPC ကို မှီခိုတာမို့ — ဒီ configuration ထဲမှာ `'ipc'` entry တစ်ခု ပါဝင်ရပါမယ်။ ဒီ option ကို ပေးလိုက်ရင် `silent` ကို override လုပ်ပါတယ်။ [`child_process.spawn()`][] ရဲ့ [`stdio`][] ကို ကြည့်ပါ။
  * `uid` {number} Process ရဲ့ user identity ကို သတ်မှတ်ပါတယ်။ (setuid(2) ကို ကြည့်ပါ။)
  * `gid` {number} Process ရဲ့ group identity ကို သတ်မှတ်ပါတယ်။ (setgid(2) ကို ကြည့်ပါ။)
  * `inspectPort` {number|Function} Worker ရဲ့ inspector port ကို သတ်မှတ်ပါတယ်။ ဒါက နံပါတ်တစ်ခု ဖြစ်နိုင်သလို — argument မယူဘဲ နံပါတ်တစ်ခု ပြန်ပေးတဲ့ function တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ မူလအားဖြင့် worker တစ်ခုချင်းစီက ကိုယ်ပိုင် port ကို ရပါတယ် — primary ရဲ့ `process.debugPort` ကနေ တစ်ခုချင်း တိုးတိုးသွားပါတယ်။
  * `windowsHide` {boolean} Windows systems တွေမှာ ပုံမှန် ဖန်တီးပေးလေ့ ရှိတဲ့ forked processes တွေရဲ့ console window ကို ဖျောက်ပေးပါတယ်။ **Default:** `false`။

[`.setupPrimary()`][] (သို့) [`.fork()`][] ကို ခေါ်လိုက်ပြီးတဲ့နောက်မှာ — ဒီ settings object ထဲမှာ default တန်ဖိုးတွေ အပါအဝင် settings တွေ ပါဝင်နေပါလိမ့်မယ်။

ဒီ object ကို လက်နဲ့ ပြောင်းလဲဖို့ (သို့) သတ်မှတ်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။

## `cluster.setupMaster([settings])`

> Stability: 0 - Deprecated

[`.setupPrimary()`][] အတွက် deprecated alias (အသုံးမပြုတော့သော နာမည်ပြောင်း) တစ်ခုပါ။

## `cluster.setupPrimary([settings])`

* `settings` {Object} [`cluster.settings`][] ကို ကြည့်ပါ။

`setupPrimary` ကို default 'fork' အပြုအမူကို ပြောင်းလဲဖို့ သုံးပါတယ်။ ခေါ်လိုက်တာနဲ့ — settings တွေက `cluster.settings` ထဲမှာ ရှိနေပါလိမ့်မယ်။

Settings တွေရဲ့ ပြောင်းလဲမှုတွေက နောင်မှာ [`.fork()`][] ခေါ်မယ့် အခေါ်တွေကိုပဲ သက်ရောက်ပြီး — run နေပြီးသား workers တွေအပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။

Worker တစ်ခုရဲ့ `.setupPrimary()` ကနေတစ်ဆင့် သတ်မှတ်လို့ မရတဲ့ တစ်ခုတည်းသော attribute ကတော့ [`.fork()`][] ဆီ ပေးလိုက်တဲ့ `env` ပါ။

အပေါ်က defaults တွေက ပထမဆုံး ခေါ်မှုအတွက်ပဲ သက်ရောက်ပါတယ် — နောက်ပိုင်း ခေါ်မှုတွေအတွက်တော့ `cluster.setupPrimary()` ကို ခေါ်လိုက်ချိန်မှာ ရှိနေတဲ့ လက်ရှိ တန်ဖိုးတွေကိုပဲ default အဖြစ် ယူပါတယ်။

```mjs
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```

```cjs
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```

ဒါကို primary process ကနေပဲ ခေါ်လို့ရပါတယ်။

## `cluster.worker`

* Type: {Object}

လက်ရှိ worker object ကို ရည်ညွှန်းတဲ့ reference တစ်ခုပါ။ Primary process ထဲမှာတော့ မရနိုင်ပါဘူး။

```mjs
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```

```cjs
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```

## `cluster.workers`

* Type: {Object}

Active worker objects တွေကို `id` field နဲ့ key လုပ်ပြီး သိမ်းထားတဲ့ hash တစ်ခုပါ။ ဒါက workers အားလုံးကို loop ပတ်ကြည့်ဖို့ လွယ်ကူစေပါတယ်။ Primary process ထဲမှာပဲ ရနိုင်ပါတယ်။

Worker တစ်ခုက disconnected ဖြစ်ပြီး _လည်း_ exited ဖြစ်သွားတဲ့အခါမှသာ `cluster.workers` ကနေ ဖယ်ရှားခံရပါတယ်။ ဒီ event နှစ်ခုကြားက အစီအစဉ်ကိုတော့ ကြိုတင် သတ်မှတ်လို့ မရပါဘူး။ ဒါပေမယ့် — `cluster.workers` စာရင်းကနေ ဖယ်ရှားမှုက နောက်ဆုံး `'disconnect'` (သို့) `'exit'` event ကို emit မလုပ်ခင်မှာ ဖြစ်ပြီးသားဆိုတာတော့ အာမခံပါတယ်။

```mjs
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```

```cjs
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```

[Advanced serialization for `child_process`]: child_process.md#advanced-serialization
[Child Process module]: child_process.md#child_processforkmodulepath-args-options
[`.fork()`]: #clusterforkenv
[`.setupPrimary()`]: #clustersetupprimarysettings
[`ChildProcess.send()`]: child_process.md#subprocesssendmessage-sendhandle-options-callback
[`child_process.fork()`]: child_process.md#child_processforkmodulepath-args-options
[`child_process.spawn()`]: child_process.md#child_processspawncommand-args-options
[`child_process` event: `'exit'`]: child_process.md#event-exit
[`child_process` event: `'message'`]: child_process.md#event-message
[`cluster.isPrimary`]: #clusterisprimary
[`cluster.settings`]: #clustersettings
[`disconnect()`]: child_process.md#subprocessdisconnect
[`kill()`]: process.md#processkillpid-signal
[`process` event: `'message'`]: process.md#event-message
[`server.close()`]: net.md#event-close
[`stdio`]: child_process.md#optionsstdio
[`worker.exitedAfterDisconnect`]: #workerexitedafterdisconnect
[`worker_threads`]: worker_threads.md
