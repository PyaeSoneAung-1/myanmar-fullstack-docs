---
title: "Domain"
description: "node:domain module (deprecated) — uncaught errors တွေကို domain object တွေနဲ့ စုပြီး ကိုင်တွယ်ခြင်း။"
order: 93
source: "https://nodejs.org/api/domain.html"
status: translated
updated: 2026-09-04
---

> Stability: 0 - Deprecated

**ဒီ module ကို deprecate (အသုံးပြုမှု ရပ်ဆိုင်းရန်) လုပ်ဖို့ စီစဉ်ဆဲ ဖြစ်ပါတယ်။** Replacement API တစ်ခု အပြီးသတ် ဖြစ်လာတာနဲ့ ဒီ module ကို အပြည့်အဝ deprecated လုပ်ပါလိမ့်မယ်။ Developer အများစုအတွက် ဒီ module ကို သုံးရတဲ့ အကြောင်းပြချက် မရှိသင့်ပါဘူး။ Domains တွေ ပေးတဲ့ လုပ်ဆောင်ချက်တွေကို မဖြစ်မနေ လိုအပ်နေတဲ့ သုံးစွဲသူတွေကတော့ ဒီအချိန်မှာ အားကိုးလို့ ရနိုင်ပေမယ့် — အနာဂတ်မှာ တစ်ခြား solution တစ်ခုဆီ ပြောင်းရွှေ့ရမယ်ဆိုတာကိုတော့ မျှော်လင့်ထားသင့်ပါတယ်။

Domains တွေက IO operation အမျိုးမျိုးကို group တစ်ခုတည်းအနေနဲ့ ကိုင်တွယ်နိုင်တဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။ Domain တစ်ခုမှာ register လုပ်ထားတဲ့ event emitters (သို့) callbacks တစ်ခုခုက `'error'` event တစ်ခုကို emit လုပ်တာ (သို့) error တစ်ခုကို throw လုပ်တာ ဖြစ်ခဲ့ရင် — error ရဲ့ context ကို `process.on('uncaughtException')` handler ထဲမှာ ပျောက်ဆုံးသွားတာမျိုး (သို့) program က error code တစ်ခုနဲ့ ချက်ချင်း exit ဖြစ်တာမျိုး မဖြစ်စေဘဲ — domain object ကို အကြောင်းကြားပေးပါလိမ့်မယ်။

## သတိပေးချက် — error တွေကို လျစ်လျူရှုမထားပါနဲ့ (Warning: Don't ignore errors!)

Domain error handlers တွေက error ဖြစ်တဲ့အခါ process တစ်ခုကို ပိတ်ပစ်တာရဲ့ အစားထိုး တစ်ခု မဟုတ်ပါဘူး။

[`throw`][] က JavaScript ထဲမှာ အလုပ်လုပ်ပုံရဲ့ သဘောသဘာဝအရပဲ — ပြတ်တောက်သွားတဲ့ နေရာကနေ ပြန်ဆက်လုပ်လို့ ဘေးကင်းစွာ ရနိုင်တဲ့ နည်းလမ်းဆိုတာ — references တွေ ယိုစိမ့်မှု (သို့) တစ်ခြား မသေချာတဲ့ brittle state မျိုး ဖန်တီးမှု မရှိဘဲနဲ့ — လုံးဝနီးပါး မရှိပါဘူး။

Throw လုပ်ခံရတဲ့ error တစ်ခုကို တုံ့ပြန်ဖို့ အလုံခြုံဆုံး နည်းကတော့ process ကို ပိတ်ပစ်လိုက်တာပါ။ ပုံမှန် web server တစ်ခုမှာတော့ connection ပွင့်နေတာ အများကြီး ရှိနိုင်ပြီး — တစ်ခြားသူတစ်ယောက်ကြောင့် ဖြစ်ပေါ်လာတဲ့ error တစ်ခုကြောင့် အဲဒါတွေကို ရုတ်တရက် ဖြတ်တောက်ပစ်တာက ကျိုးကြောင်းဆီလျော်မှု မရှိပါဘူး။

ပိုကောင်းတဲ့ နည်းလမ်းကတော့ — error ကို ဖြစ်စေတဲ့ request ဆီကို error response တစ်ခု ပို့ပြီး၊ တစ်ခြား request တွေကို သူတို့ရဲ့ ပုံမှန် အချိန်အတွင်းမှာ အပြီးသတ်ခွင့် ပြုထားကာ၊ အဲဒီ worker ထဲမှာ request အသစ်တွေကို နားထောင်တာ ရပ်လိုက်တာပါ။

ဒီနည်းနဲ့ `domain` အသုံးပြုမှုက cluster module နဲ့ လက်တွဲ ဖြစ်သွားပါတယ် — worker တစ်ခုမှာ error ဖြစ်တဲ့အခါ primary process က worker အသစ်တစ်ခုကို fork လုပ်နိုင်လို့ပါ။ Machine အများကြီးပေါ်မှာ scale လုပ်တဲ့ Node.js programs တွေအတွက်ဆိုရင် terminating proxy (သို့) service registry က အဲဒီ failure ကို မှတ်သားပြီး သင့်လျော်စွာ တုံ့ပြန်နိုင်ပါတယ်။

ဥပမာ — ဒါက မကောင်းတဲ့ idea တစ်ခုပါ:

```js
// XXX WARNING! BAD IDEA!

const d = require('node:domain').create();
d.on('error', (er) => {
  // The error won't crash the process, but what it does is worse!
  // Though we've prevented abrupt process restarting, we are leaking
  // a lot of resources if this ever happens.
  // This is no better than process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```

Domain တစ်ခုရဲ့ context နဲ့ program ကို worker processes အများကြီးအဖြစ် ခွဲထားခြင်းရဲ့ ခံနိုင်ရည်ကို သုံးပြီး — ပိုပြီး သင့်လျော်စွာ တုံ့ပြန်နိုင်ပြီး error တွေကို ပိုပြီး ဘေးကင်းစွာ ကိုင်တွယ်နိုင်ပါတယ်။

```js
// Much better!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // A more realistic scenario would have more than 2 workers,
  // and perhaps not put the primary and worker in the same file.
  //
  // It is also possible to get a bit fancier about logging, and
  // implement whatever custom logic is needed to prevent DoS
  // attacks and other bad behavior.
  //
  // See the options in the cluster documentation.
  //
  // The important thing is that the primary does very little,
  // increasing our resilience to unexpected errors.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // the worker
  //
  // This is where we put our bugs!

  const domain = require('node:domain');

  // See the cluster documentation for more details about using
  // worker processes to serve requests. How it works, caveats, etc.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // We're in dangerous territory!
      // By definition, something unexpected occurred,
      // which we probably didn't want.
      // Anything can happen now! Be very careful!

      try {
        // Make sure we close down within 30 seconds
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // But don't keep the process open just for that!
        killtimer.unref();

        // Stop taking new requests.
        server.close();

        // Let the primary know we're dead. This will trigger a
        // 'disconnect' in the cluster primary, and then it will fork
        // a new worker.
        cluster.worker.disconnect();

        // Try to send an error to the request that triggered the problem
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // Oh well, not much we can do at this point.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // Because req and res were created before this domain existed,
    // we need to explicitly add them.
    // See the explanation of implicit vs explicit binding below.
    d.add(req);
    d.add(res);

    // Now run the handler function in the domain.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// This part is not important. Just an example routing thing.
// Put fancy application logic here.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // We do some async stuff, and then...
      setTimeout(() => {
        // Whoops!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## `Error` objects တွေမှာ ထပ်ပေါင်းပါဝင်လာတဲ့အရာများ (Additions to `Error` objects)

`Error` object တစ်ခုက domain တစ်ခုကို ဖြတ်သန်းသွားတိုင်း — field အနည်းငယ် ထပ်ပေါင်း ပါဝင်လာပါတယ်။

* `error.domain` Error ကို ပထမဆုံး ကိုင်တွယ်ခဲ့တဲ့ domain။
* `error.domainEmitter` Error object နဲ့အတူ `'error'` event တစ်ခုကို emit လုပ်ခဲ့တဲ့ event emitter။
* `error.domainBound` Domain ကို bind လုပ်ထားပြီး error တစ်ခုကို သူ့ရဲ့ ပထမဆုံး argument အဖြစ် လက်ခံရရှိတဲ့ callback function။
* `error.domainThrown` Error ကို throw လုပ်ခဲ့တာလား၊ emit လုပ်ခဲ့တာလား (သို့) bound callback function တစ်ခုဆီ ပေးပို့ခဲ့တာလားဆိုတာ ဖော်ပြတဲ့ boolean တစ်ခု။

## အလိုအလျောက် binding လုပ်ခြင်း (Implicit binding)

Domains တွေ အသုံးပြုနေရရင် **အသစ်ဖန်တီးလိုက်တဲ့** `EventEmitter` object တွေ အားလုံး (Stream objects, requests, responses စတာတွေ အပါအဝင်) ကို ဖန်တီးချိန်မှာ ရှိနေတဲ့ active domain ဆီ implicit (အလိုအလျောက်) bind လုပ်ပေးပါလိမ့်မယ်။

ဒါ့အပြင် low-level event loop requests တွေဆီ ပေးပို့လိုက်တဲ့ callbacks တွေ (`fs.open()` လို callback လက်ခံတဲ့ method တွေဆီ ပေးတာတွေ) ကိုလည်း active domain ဆီ အလိုအလျောက် bind လုပ်ပေးပါတယ်။ အဲဒါတွေ throw လုပ်ခဲ့ရင် domain က error ကို ဖမ်းပါလိမ့်မယ်။

Memory အလွန်အကျွံ သုံးစွဲမှုကို ကာကွယ်ဖို့အတွက် `Domain` object တွေကိုယ်တိုင်ကို active domain ရဲ့ children အဖြစ် implicit ထည့်မပေးပါဘူး။ ထည့်ပေးမိခဲ့ရင် request နဲ့ response objects တွေကို စနစ်တကျ garbage collected မဖြစ်အောင် တားဆီးဖို့ လွယ်ကူလွန်းသွားမှာမို့ပါ။

`Domain` objects တွေကို parent `Domain` တစ်ခုရဲ့ children အဖြစ် nest လုပ်ချင်ရင်တော့ — သူတို့ကို explicitly (ကိုယ်တိုင်) ထည့်ပေးရပါမယ်။

Implicit binding က throw လုပ်ခံရတဲ့ errors တွေနဲ့ `'error'` events တွေကို `Domain` ရဲ့ `'error'` event ဆီ လမ်းကြောင်းပေးပေမယ့် — `EventEmitter` ကို `Domain` ပေါ်မှာ register မလုပ်ပါဘူး။ Implicit binding က throw လုပ်ခံရတဲ့ errors တွေနဲ့ `'error'` events တွေကိုပဲ ကိုင်တွယ်ပေးပါတယ်။

## ကိုယ်တိုင် binding လုပ်ခြင်း (Explicit binding)

တခါတရံ အသုံးပြုနေတဲ့ domain က specific event emitter တစ်ခုအတွက် သုံးသင့်တဲ့ domain မဟုတ်တာမျိုး ရှိပါတယ်။ ဒါမှမဟုတ် event emitter ကို domain တစ်ခုရဲ့ context ထဲမှာ ဖန်တီးခဲ့ပေမယ့် — တစ်ခြား domain တစ်ခုဆီ bind လုပ်သင့်တာမျိုး ရှိနိုင်ပါတယ်။

ဥပမာ — HTTP server တစ်ခုအတွက် domain တစ်ခုကို အသုံးပြုနေပေမယ့် request တစ်ခုချင်းစီအတွက် သီးခြား domain တစ်ခုစီ သုံးချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။

ဒါက explicit binding နဲ့ ဖြစ်နိုင်ပါတယ်။

```js
// Create a top-level domain for the server
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // Server is created in the scope of serverDomain
  http.createServer((req, res) => {
    // Req and res are also created in the scope of serverDomain
    // however, we'd prefer to have a separate domain for each request.
    // create it first thing, and add req and res to it.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()`

* Returns: {Domain}

## Class: `Domain`

* Extends: {EventEmitter}

`Domain` class က errors တွေနဲ့ uncaught exceptions တွေကို active `Domain` object ဆီ လမ်းကြောင်းပေးတဲ့ လုပ်ဆောင်ချက်တွေကို စုစည်းထားပါတယ်။

သူ ဖမ်းမိတဲ့ errors တွေကို ကိုင်တွယ်ဖို့ သူ့ရဲ့ `'error'` event ကို နားထောင်ပါ။

### `domain.members`

* Type: {Array}

Domain ထဲကို explicitly ထည့်ထားတဲ့ event emitters တွေရဲ့ array တစ်ခုပါ။

### `domain.add(emitter)`

* `emitter` {EventEmitter} Domain ထဲကို ထည့်မယ့် emitter

Emitter တစ်ခုကို domain ထဲကို explicitly ထည့်ပေးပါတယ်။ Emitter က ခေါ်လိုက်တဲ့ event handlers တစ်ခုခုက error ကို throw လုပ်ခဲ့ရင် (သို့) emitter က `'error'` event တစ်ခုကို emit လုပ်ခဲ့ရင် — implicit binding မှာ ဖြစ်သလိုပဲ domain ရဲ့ `'error'` event ဆီ လမ်းကြောင်းပေးပါလိမ့်မယ်။

`EventEmitter` က domain တစ်ခုကို bind လုပ်ပြီးသား ဖြစ်နေရင် အဲဒီ domain ကနေ ဖယ်ထုတ်ပြီး — ဒီ domain ဆီ bind လုပ်လိုက်ပါတယ်။

### `domain.bind(callback)`

* `callback` {Function} Callback function
* Returns: {Function} Bind လုပ်ပြီးသား function

ပြန်ပေးလိုက်တဲ့ function က ပေးလိုက်တဲ့ callback function ကို wrap လုပ်ထားတဲ့ function တစ်ခု ဖြစ်ပါလိမ့်မယ်။ ပြန်ပေးလိုက်တဲ့ function ကို ခေါ်တဲ့အခါ throw လုပ်ခံရတဲ့ error တွေ အားလုံးကို domain ရဲ့ `'error'` event ဆီ လမ်းကြောင်းပေးပါလိမ့်မယ်။

```js
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // If this throws, it will also be passed to the domain.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

### `domain.enter()`

`enter()` method က active domain ကို သတ်မှတ်ဖို့ `run()`, `bind()` နဲ့ `intercept()` methods တွေ သုံးတဲ့ plumbing (အတွင်းပိုင်း ယန္တရား) တစ်ခုပါ။ သူက `domain.active` နဲ့ `process.domain` ကို ဒီ domain အဖြစ် သတ်မှတ်ပြီး — domain module က စီမံခန့်ခွဲတဲ့ domain stack ပေါ်ကို domain ကို implicitly push လုပ်ပါတယ် (domain stack အကြောင်း အသေးစိတ်ကို [`domain.exit()`][] မှာ ကြည့်ပါ)။ `enter()` ကို ခေါ်လိုက်တာက domain တစ်ခုနဲ့ bind လုပ်ထားတဲ့ asynchronous calls နဲ့ I/O operations တစ်ခုရဲ့ chain တစ်ခုရဲ့ အစကို မှတ်သားပေးပါတယ်။

`enter()` ကို ခေါ်လိုက်တာက active domain ကိုပဲ ပြောင်းလဲစေပြီး — domain ကိုယ်တိုင်ကို ပြောင်းလဲမှု မရှိပါဘူး။ Domain တစ်ခုတည်းပေါ်မှာ `enter()` နဲ့ `exit()` ကို အကြိမ်ရေ မည်မျှမဆို ခေါ်နိုင်ပါတယ်။

### `domain.exit()`

`exit()` method က လက်ရှိ domain ကနေ ထွက်ပြီး — domain stack ပေါ်ကနေ ဖယ်ထုတ်လိုက်ပါတယ်။ Execution က တစ်ခြား asynchronous calls တစ်ခုရဲ့ chain တစ်ခုရဲ့ context ဆီ ပြောင်းတော့မယ့် အချိန်တိုင်းမှာ လက်ရှိ domain ကို exit လုပ်ထားဖို့ အရေးကြီးပါတယ်။ `exit()` ကို ခေါ်လိုက်တာက domain တစ်ခုနဲ့ bind လုပ်ထားတဲ့ asynchronous calls နဲ့ I/O operations တစ်ခုရဲ့ chain တစ်ခုရဲ့ အဆုံး (သို့) ပြတ်တောက်မှုကို မှတ်သားပေးပါတယ်။

လက်ရှိ execution context ထဲမှာ nested domains အများကြီး bind လုပ်ထားရင် `exit()` က ဒီ domain အတွင်းမှာ nested ဖြစ်နေတဲ့ domains တွေကိုပါ အကုန်လုံး exit လုပ်ပေးပါလိမ့်မယ်။

`exit()` ကို ခေါ်လိုက်တာက active domain ကိုပဲ ပြောင်းလဲစေပြီး — domain ကိုယ်တိုင်ကို ပြောင်းလဲမှု မရှိပါဘူး။ Domain တစ်ခုတည်းပေါ်မှာ `enter()` နဲ့ `exit()` ကို အကြိမ်ရေ မည်မျှမဆို ခေါ်နိုင်ပါတယ်။

### `domain.intercept(callback)`

* `callback` {Function} Callback function
* Returns: {Function} Intercept လုပ်ပြီးသား function

ဒီ method က [`domain.bind(callback)`][] နဲ့ ဆင်တူလုနီးပါးပါ။ ဒါပေမယ့် throw လုပ်တဲ့ errors တွေကို ဖမ်းတာအပြင် — function ဆီ ပထမဆုံး argument အဖြစ် ပေးပို့လိုက်တဲ့ [`Error`][] objects တွေကိုပါ intercept လုပ်ပါတယ်။

ဒီနည်းနဲ့ နေရာတိုင်းမှာ ထပ်တလဲလဲ ရေးနေရတတ်တဲ့ `if (err) return callback(err);` pattern ကို — နေရာတစ်ခုတည်းမှာ error handler တစ်ခုတည်းနဲ့ အစားထိုးနိုင်ပါတယ်။

```js
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Note, the first argument is never passed to the
    // callback since it is assumed to be the 'Error' argument
    // and thus intercepted by the domain.

    // If this throws, it will also be passed to the domain
    // so the error-handling logic can be moved to the 'error'
    // event on the domain instead of being repeated throughout
    // the program.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

### `domain.remove(emitter)`

* `emitter` {EventEmitter} Domain ကနေ ဖယ်ထုတ်မယ့် emitter

[`domain.add(emitter)`][] ရဲ့ ဆန့်ကျင်ဘက်ပါ။ သတ်မှတ်ထားတဲ့ emitter ကနေ domain ရဲ့ ကိုင်တွယ်မှုကို ဖယ်ရှားပေးပါတယ်။

### `domain.run(fn[, ...args])`

* `fn` {Function}
* `...args` {any}

ပေးထားတဲ့ function ကို domain ရဲ့ context ထဲမှာ run လုပ်ပြီး — အဲဒီ context ထဲမှာ ဖန်တီးလိုက်တဲ့ event emitters, timers နဲ့ low-level requests တွေ အားလုံးကို implicitly bind လုပ်ပေးပါတယ်။ လိုအပ်ရင် function ဆီ argument တွေကိုလည်း ပေးပို့လို့ ရပါတယ်။

ဒါက domain တစ်ခုကို သုံးဖို့ အခြေခံအကျဆုံး နည်းလမ်းပါ။

```js
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulating some various async stuff
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // proceed...
      });
    }, 100);
  });
});
```

ဒီဥပမာထဲမှာ program က crash မဖြစ်ဘဲ — `d.on('error')` handler က trigger ဖြစ်ပါလိမ့်မယ်။

## Domains နဲ့ promises

Node.js 8.0.0 ကစပြီး promises တွေရဲ့ handlers တွေကို `.then()` (သို့) `.catch()` ကို ခေါ်လိုက်တဲ့ domain ထဲမှာပဲ run လုပ်ပါတယ်:

```js
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // running in d2
  });
});
```

Callback တစ်ခုကို [`domain.bind(callback)`][] သုံးပြီး specific domain တစ်ခုဆီ bind လုပ်နိုင်ပါတယ်:

```js
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // running in d1
  }));
});
```

Domains တွေက promises တွေရဲ့ error handling mechanisms တွေကို ဝင်ရောက် စွက်ဖက်မှာ မဟုတ်ပါဘူး။ တစ်နည်းပြောရရင် — unhandled `Promise` rejections တွေအတွက် `'error'` event တစ်ခုကို emit လုပ်မှာ မဟုတ်ပါဘူး။

[`Error`]: errors.md#class-error
[`domain.add(emitter)`]: #domainaddemitter
[`domain.bind(callback)`]: #domainbindcallback
[`domain.exit()`]: #domainexit
[`throw`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw
