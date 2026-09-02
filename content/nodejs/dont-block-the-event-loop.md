---
title: "Event Loop ကို မပိတ်ဆို့ပါနဲ့"
description: "Event Loop ရော Worker Pool ရော ဘာကြောင့် မပိတ်ဆို့သင့်လဲ — CPU-heavy အလုပ်တွေ ဘယ်လို ဖြတ်တောက်/လွှဲပြောင်းရမလဲ (partitioning, offloading), REDOS, JSON DOS, sync APIs အန္တရာယ်များ"
order: 30
source: "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop"
status: translated
updated: 2026-09-02
---

## ဒီ guide ကို ဖတ်သင့်လား

Command-line script အတိုလေးတွေထက် ပိုရှုပ်ထွေးတာတွေ ရေးနေတယ်ဆိုရင် — ဒီ guide ကို ဖတ်ထားတာက performance ပိုကောင်းပြီး ပိုလုံခြုံတဲ့ application တွေ ရေးဖို့ ကူညီပေးပါလိမ့်မယ်။ ဒီစာတမ်းကို Node.js server တွေကို ရည်ရွယ်ပြီး ရေးထားပေမယ့် — concepts တွေက ရှုပ်ထွေးတဲ့ Node.js application တိုင်းနဲ့လည်း သက်ဆိုင်ပါတယ်။ OS-specific အသေးစိတ်တွေ ကွာတဲ့နေရာမှာ Linux ကို အခြေခံပြီး ရှင်းပြထားပါတယ်။

## အကျဉ်းချုပ်

Node.js က JavaScript code တွေကို **Event Loop** (initialization နဲ့ callbacks) ပေါ်မှာ run ပြီး — file I/O လိုမျိုး အကုန်အကျများတဲ့ အလုပ်တွေအတွက် **Worker Pool** တစ်ခု ထောက်ပံ့ပေးပါတယ်။ Node.js က thread အနည်းငယ်နဲ့ client အများကြီးကို ကိုင်တွယ်လို့ — Apache လိုမျိုး thread-per-client စနစ်တွေထက်တောင် ကောင်းကောင်း scale လုပ်နိုင်ပါတယ်။ Thread နည်းလေ — system ရဲ့ time နဲ့ memory ကို client တွေအတွက် ပိုသုံးနိုင်လေပါပဲ (thread overhead — memory, context-switching — သက်သာလို့)။ ဒါပေမယ့် thread နည်းတာကြောင့်ပဲ — ဒီ thread တွေကို ပညာရှိရှိ သုံးအောင် application ကို စနစ်တကျ ဖွဲ့စည်းရပါတယ်။

Server မြန်အောင် ထားဖို့ စည်းမျဉ်းတစ်ခုက:

_Node.js က client တစ်ယောက်ချင်းစီအတွက် တစ်ချိန်တည်းမှာ လုပ်ရတဲ့ အလုပ်က "သေးသေးလေး" ဖြစ်နေရင် မြန်ပါတယ်။_

ဒါက Event Loop ပေါ်က callbacks တွေနဲ့ Worker Pool ပေါ်က tasks တွေ နှစ်မျိုးလုံးအတွက် သက်ဆိုင်ပါတယ်။

## Event Loop နဲ့ Worker Pool ကို ဘာကြောင့် မပိတ်ဆို့သင့်လဲ

Node.js မှာ thread အမျိုးအစား နှစ်မျိုး ရှိပါတယ် — Event Loop တစ်ခု (main loop, main thread, event thread လို့လည်း ခေါ်ပါတယ်) နဲ့ Worker Pool ထဲက Worker `k` ခု (threadpool လို့လည်း ခေါ်ပါတယ်)။

Thread တစ်ခုက callback (Event Loop ပေါ်မှာ) ဒါမှမဟုတ် task (Worker ပေါ်မှာ) တစ်ခုကို ကြာကြာ execute လုပ်နေရင် အဲဒီ thread ကို "blocked" လို့ ခေါ်ပါတယ်။ Thread တစ်ခု client တစ်ယောက်အတွက် အလုပ်လုပ်နေတုန်း blocked ဖြစ်နေရင် — တခြား client တွေရဲ့ request တွေကို မကိုင်တွယ်နိုင်တော့ပါဘူး။ ဒါကြောင့် Event Loop ရော Worker Pool ရော မပိတ်ဆို့ဖို့ အကြောင်းရင်း နှစ်ခု ရှိပါတယ်:

1. **Performance** — thread နှစ်မျိုးလုံးပေါ်မှာ အလေးလံတဲ့ အလုပ်တွေကို ပုံမှန် လုပ်နေရင် server ရဲ့ _throughput_ (requests/second) ကျဆင်းပါတယ်။
2. **Security** — input တစ်ခုခုကြောင့် thread တွေ block ဖြစ်နိုင်တယ်ဆိုရင် — malicious client က ဒီ "evil input" ကို ပို့ပြီး thread တွေကို block လုပ်ကာ တခြား client တွေဆီက အလုပ်တွေ မလုပ်နိုင်အောင် လုပ်နိုင်ပါတယ်။ ဒါက [Denial of Service](https://en.wikipedia.org/wiki/Denial-of-service_attack) (DoS) attack ပါ။

## Node.js ရဲ့ အလုပ်လုပ်ပုံ ပြန်လည်သုံးသပ်ချက်

Node.js က Event-Driven Architecture ကို သုံးပါတယ် — orchestration အတွက် Event Loop ရှိပြီး — အကုန်အကျများတဲ့ အလုပ်တွေအတွက် Worker Pool ရှိပါတယ်။

### Event Loop ပေါ်မှာ ဘယ် code တွေ run သလဲ

Node.js application တွေက စတင်တဲ့အခါ ပထမဆုံး initialization phase ကို ပြီးအောင် လုပ်ပါတယ် — module တွေ `require` လုပ်ပြီး event တွေအတွက် callbacks တွေ register လုပ်ပါတယ်။ ပြီးရင် Event Loop ထဲ ဝင်ကာ — client request တွေကို သင့်လျော်တဲ့ callback ကို execute လုပ်ပြီး ဖြေကြားပါတယ်။ ဒီ callback က synchronously run ပြီး — သူပြီးမှ ဆက်လုပ်ဖို့ asynchronous request တွေကို register လုပ်နိုင်ပါတယ်။ အဲဒီ asynchronous request တွေရဲ့ callbacks တွေကိုလည်း Event Loop ပေါ်မှာပဲ execute လုပ်ပါတယ် — Event Loop က ဒီ callbacks တွေ လုပ်လိုက်တဲ့ non-blocking asynchronous requests (ဥပမာ network I/O) တွေကိုပါ ဖြည့်ဆည်းပေးပါတယ်။

### Worker Pool ပေါ်မှာ ဘယ် code တွေ run သလဲ

Node.js ရဲ့ Worker Pool ကို **libuv** ([docs](http://docs.libuv.org/en/v1.x/threadpool.html)) မှာ အကောင်အထည်ဖော်ထားပြီး — task submission အတွက် ယေဘုယျ API တစ်ခု ထောက်ပံ့ပေးပါတယ်။ Node.js က "အကုန်အကျများ" တဲ့ အလုပ်တွေကို ကိုင်တွယ်ဖို့ Worker Pool ကို သုံးပါတယ် — OS က non-blocking version မပေးတဲ့ I/O တွေရော CPU-intensive task တွေရော ပါဝင်ပါတယ်။

ဒီ Node.js module APIs တွေက Worker Pool ကို သုံးပါတယ်:

1. I/O-intensive
   1. [DNS](https://nodejs.org/api/dns.html): `dns.lookup()`, `dns.lookupService()`။
   2. [File System](https://nodejs.org/api/fs.html#fs_threadpool_usage): `fs.FSWatcher()` နဲ့ explicitly synchronous တွေကလွဲပြီး — file system API အားလုံးက libuv ရဲ့ threadpool ကို သုံးပါတယ်။
2. CPU-intensive
   1. [Crypto](https://nodejs.org/api/crypto.html): `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`။
   2. [Zlib](https://nodejs.org/api/zlib.html#zlib_threadpool_usage): explicitly synchronous တွေကလွဲပြီး zlib API အားလုံးက libuv ရဲ့ threadpool ကို သုံးပါတယ်။

Node.js application အများစုမှာ ဒီ APIs တွေကပဲ Worker Pool အတွက် task တွေရဲ့ အရင်းအမြစ် ဖြစ်ပါတယ်။ [C++ add-on](https://nodejs.org/api/addons.html) သုံးတဲ့ application/module တွေကတော့ တခြား task တွေကိုပါ Worker Pool ဆီ ပို့နိုင်ပါတယ်။

Event Loop ပေါ်က callback ကနေ ဒီ API တစ်ခုခုကို ခေါ်တဲ့အခါ — Node.js C++ bindings တွေထဲ ဝင်ပြီး task ကို Worker Pool ဆီ ပို့ဖို့ setup cost အနည်းငယ် ကျခံရပါတယ်။ ဒီ cost တွေက task တစ်ခုလုံးရဲ့ cost နဲ့ယှဉ်ရင် မထင်မရှားပါ — ဒါကြောင့်လည်း Event Loop က အလုပ်ကို လွှဲပေးတာ ဖြစ်ပါတယ်။

### Node.js က နောက်ထပ် ဘယ် code ကို run မလဲ ဘယ်လို ဆုံးဖြတ်လဲ

Abstract အရကြည့်ရင် Event Loop နဲ့ Worker Pool က pending events / pending tasks တွေအတွက် queue တွေ ထားရှိပါတယ်။

တကယ်တမ်းတော့ Event Loop က queue တကယ် မထားပါဘူး — သူ့မှာ file descriptors တွေရဲ့ collection ရှိပြီး OS ကို monitor လုပ်ခိုင်းပါတယ် — [epoll](http://man7.org/linux/man-pages/man7/epoll.7.html) (Linux), [kqueue](https://developer.apple.com/library/content/documentation/Darwin/Conceptual/FSEvents_ProgGuide/KernelQueues/KernelQueues.html) (OSX), event ports (Solaris), ဒါမှမဟုတ် [IOCP](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365198.aspx) (Windows) လိုမျိုး mechanism တွေနဲ့ပါ။ ဒီ file descriptors တွေက network sockets, watch လုပ်နေတဲ့ file တွေ စသဖြင့် ကိုယ်စားပြုပါတယ်။ OS က descriptor တစ်ခု ready ဖြစ်ကြောင်း ပြောတဲ့အခါ — Event Loop က အဲဒါကို သင့်လျော်တဲ့ event အဖြစ် ပြောင်းပြီး ဆက်စပ်နေတဲ့ callbacks တွေကို ခေါ်ပါတယ် ([ဒီမှာ](https://www.youtube.com/watch?v=P9csgxBgaZ8) ပိုလေ့လာနိုင်ပါတယ်)။

Worker Pool ကတော့ ဖြစ်ရမယ့် tasks တွေကို သိမ်းထားတဲ့ queue အစစ်ကို သုံးပါတယ် — Worker တစ်ယောက်က queue ကနေ task ဆွဲထုတ်ပြီး အလုပ်လုပ်ကာ — ပြီးတဲ့အခါ Event Loop အတွက် "At least one task is finished" event ကို မြှောက်ပေးပါတယ်။

### Application design အတွက် ဘာအဓိပ္ပာယ်လဲ

Apache လို one-thread-per-client စနစ်မှာ pending client တိုင်းကို ကိုယ်ပိုင် thread နဲ့ တွဲပေးထားပြီး — thread တစ်ခု block ဖြစ်ရင် OS က သူ့ကို ရပ်ပြီး တခြား client ကို အလှည့်ပေးပါတယ်။ Node.js မှာတော့ client အများကြီးကို thread အနည်းငယ်နဲ့ ကိုင်တွယ်တာမို့ — thread တစ်ခု client တစ်ယောက်ရဲ့ request ကြောင့် block ဖြစ်ရင် — callback/task ပြီးတဲ့အထိ pending client request တွေ အလှည့် မရနိုင်ပါဘူး။ _ဒါကြောင့် client တွေကို တရားမျှတစွာ ဆက်ဆံဖို့က application ရဲ့ တာဝန်ပါ။_ Client တစ်ယောက်အတွက် callback/task တစ်ခုထဲမှာ အလုပ်များများ မလုပ်သင့်ပါဘူး။

## Event Loop ကို မပိတ်ဆို့ပါနဲ့

Event Loop က client connection အသစ်တိုင်းကို သတိပြုမိပြီး — response ဖန်တီးမှုကို စီစဉ်ပေးပါတယ်။ Request တွေအားလုံး၊ response တွေအားလုံး Event Loop ကို ဖြတ်သွားတာမို့ — Event Loop က တစ်နေရာရာမှာ ကြာကြာ အချိန်ယူရင် — client အားလုံး (အသစ်ရော အဟောင်းရော) အလှည့် မရနိုင်တော့ပါဘူး။

Event Loop ကို ဘယ်တော့မှ မပိတ်ဆို့ပါနဲ့ — တစ်နည်းပြောရရင် JavaScript callback တိုင်းက မြန်မြန် ပြီးအောင် လုပ်ပါ။ ဒါက `await` တွေ၊ `Promise.then` တွေအတွက်လည်း သက်ဆိုင်ပါတယ်။

ဒါသေချာအောင် နည်းကောင်းတစ်ခုက callback တွေရဲ့ ["computational complexity"](https://en.wikipedia.org/wiki/Time_complexity) ကို စဉ်းစားတာပါ — callback က argument ဘယ်လိုပဲ ဖြစ်ဖြစ် step အရေအတွက် ပုံသေဆိုရင် pending client တိုင်းကို အလှည့်ကျ ပေးနိုင်ပါတယ်။ Argument အလိုက် step အရေအတွက် ပြောင်းရင် — argument တွေ ဘယ်လောက်ရှည်နိုင်လဲ စဉ်းစားဖို့ လိုပါတယ်။

ဥပမာ ၁ — constant-time callback:

```js
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});
```

ဥပမာ ၂ — `O(n)` callback — `n` ငယ်ရင် မြန်၊ `n` ကြီးရင် နှေးပါတယ်:

```js
app.get('/countToN', (req, res) => {
  const n = req.query.n;

  // n iterations before giving someone else a turn
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }

  res.sendStatus(200);
});
```

ဥပမာ ၃ — `O(n^2)` callback — `n` ကြီးလာတာနဲ့ `O(n)` ထက် အများကြီး ပိုနှေးပါတယ်:

```js
app.get('/countToN2', (req, res) => {
  const n = req.query.n;

  // n^2 iterations before giving someone else a turn
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }

  res.sendStatus(200);
});
```

### ဘယ်လောက် သတိထားရမလဲ

Node.js က Google **V8** engine ကို သုံးပြီး — common operation တွေအတွက် အတော်မြန်ပါတယ်။ ချွင်းချက်တွေကတော့ regexps နဲ့ JSON operations တွေပါ (အောက်မှာ ကြည့်ပါ)။

ရှုပ်ထွေးတဲ့ အလုပ်တွေအတွက်တော့ — input ကို ကန့်သတ်ထားဖို့ (bounding) စဉ်းစားပါ — input အရမ်းရှည်တာတွေကို ငြင်းပါ။ ဒါဆိုရင် callback ရဲ့ complexity ကြီးနေရင်တောင် — အရှည်ဆုံး acceptable input ပေါ်မှာ worst-case time ထက် မကျော်နိုင်အောင် သေချာစေနိုင်ပါတယ်။

### Event Loop ပိတ်ဆို့ခြင်း — REDOS

Event Loop ကို ဆိုးဆိုးရွားရွား ပိတ်ဆို့နိုင်တဲ့ နည်းတစ်ခုက "vulnerable" [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) (regexp) သုံးတာပါ။

#### Vulnerable regex တွေကို ရှောင်ခြင်း

Regexp က input string ကို pattern တစ်ခုနဲ့ တိုက်စစ်ပါတယ်။ ပုံမှန်ဆို regexp match က input string ကို တစ်ခါပဲ ဖြတ်ရတဲ့ — `O(n)` အချိန် (n က input string ရဲ့ အရှည်) လို့ ထင်ရပါတယ်။ ဒါပေမယ့် တချို့နေရာတွေမှာ match က input string ကို exponential အကြိမ်အရေအတွက် ဖြတ်ဖို့ လိုနိုင်ပါတယ် — `O(2^n)` အချိန်ပါ။ Exponential ဆိုတာ — input string မှာ character တစ်လုံးပဲ ထပ်ထည့်လိုက်ရင် engine က match ဆုံးဖြတ်ဖို့ `x` trip လိုရင် `2*x` trip လိုသွားတာမျိုးပါ။ Trip အရေအတွက်က အချိန်နဲ့ တစ်ပြေးညီ ဆက်စပ်နေတာမို့ — Event Loop ကို ပိတ်ဆို့သွားစေနိုင်ပါတယ်။

_Vulnerable regular expression_ ဆိုတာ regexp engine က exponential အချိန် ယူနိုင်ပြီး — "evil input" ပေါ်မှာ [REDOS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) ကို ခံနိုင်ရည် ရှိစေတဲ့ regexp ပါ။ ကိုယ့် regexp က vulnerable လားဆိုတာ ဖြေရခက်တဲ့ မေးခွန်းဖြစ်ပြီး — Perl, Python, Ruby, Java, JavaScript စသဖြင့် ဘယ် language သုံးလဲပေါ်မူတည်ပြီး ကွဲပြားပါတယ် — ဒါပေမယ့် အားလုံးနဲ့ သက်ဆိုင်တဲ့ စည်းမျဉ်းတချို့ ရှိပါတယ်:

1. `(a+)*` လိုမျိုး nested quantifiers တွေကို ရှောင်ပါ — V8 ရဲ့ engine က တချို့ကို မြန်မြန် ကိုင်တွယ်နိုင်ပေမယ့် တချို့က vulnerable ပါ။
2. `(a|a)*` လိုမျိုး overlapping clauses ပါတဲ့ OR တွေကို ရှောင်ပါ — ဒါတွေလည်း တစ်ခါတစ်ရံမှာ မြန်ပါတယ်။
3. `(a.*) \1` လိုမျိုး backreferences တွေကို ရှောင်ပါ — ဘယ် regexp engine မှ linear time နဲ့ evaluate လုပ်ဖို့ အာမမခံနိုင်ပါဘူး။
4. ရိုးရိုး string match ဆိုရင် `indexOf` (သို့) local equivalent သုံးပါ — ပိုသက်သာပြီး `O(n)` ထက် ဘယ်တော့မှ မကျော်ပါဘူး။

Regexp က vulnerable လားဆိုတာ မသေချာရင် မှတ်ထားပါ — Node.js က vulnerable regexp နဲ့ input string ရှည်ရှည်တောင်မှ _match_ ဖြစ်တာကို ပြောဖို့ မခက်ပါဘူး။ Exponential behavior က **mismatch** ဖြစ်နေပေမယ့် Node.js က path အများကြီး စမ်းကြည့်ပြီးမှ သေချာနိုင်တဲ့အခါမှာ ဖြစ်ပေါ်တာပါ။

#### REDOS ဥပမာ

ဒီမှာ server ကို REDOS ခံနိုင်အောင် လုပ်ပေးတဲ့ vulnerable regexp ဥပမာပါ:

```js
app.get('/redos-me', (req, res) => {
  const filePath = req.query.filePath;

  // REDOS
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }

  res.sendStatus(200);
});
```

ဒီဥပမာထဲက vulnerable regexp က Linux မှာ valid path စစ်ဖို့ သုံးထားတဲ့ (မကောင်းတဲ့) နည်းပါ — "/"-နဲ့ ပိုင်းထားတဲ့ နာမည်တွေရဲ့ sequence ("/a/b/c" လိုမျိုး) ကို match လုပ်ပါတယ်။ သူက စည်းမျဉ်း ၁ ကို ချိုးဖောက်လို့ အန္တရာယ်ရှိပါတယ် — doubly-nested quantifier ပါနေလို့ပါ။

Client က filePath `///.../\n` (slash ၁၀၀ နဲ့ regexp ရဲ့ "." က match မလုပ်နိုင်တဲ့ newline character) နဲ့ query လုပ်ရင် — Event Loop က ထာဝရလောက် အချိန်ယူပြီး block ဖြစ်သွားပါမယ်။ ဒီ REDOS attack ကြောင့် regexp match ပြီးတဲ့အထိ တခြား client တွေ အားလုံး အလှည့် မရတော့ပါဘူး။ ဒါကြောင့် user input ကို validate လုပ်ဖို့ ရှုပ်ထွေးတဲ့ regex တွေသုံးတာ သတိထားသင့်ပါတယ်။

#### Anti-REDOS ကိရိယာများ

Regexp တွေ အန္တရာယ်ကင်းမကင်း စစ်ပေးတဲ့ ကိရိယာတွေ ရှိပါတယ် — [safe-regex](https://github.com/davisjam/safe-regex) နဲ့ [rxxr2](https://github.com/superhuman/rxxr2) လိုမျိုးပါ။ ဒါပေမယ့် ဒီနှစ်ခုလုံးက vulnerable regexp တွေ အားလုံးကိုတော့ ဖမ်းမိမှာ မဟုတ်ပါဘူး။

နောက်နည်းတစ်ခုက regexp engine တစ်မျိုးစီ သုံးတာပါ — Google ရဲ့ မြန်ဆန်တဲ့ [RE2](https://github.com/google/re2) engine ကို သုံးထားတဲ့ [node-re2](https://github.com/uhop/node-re2) module လိုမျိုးပါ။ ဒါပေမယ့် RE2 က V8 ရဲ့ regexps တွေနဲ့ 100% compatible မဟုတ်လို့ — swap လုပ်ရင် regression ရှိမရှိ သေချာ စစ်ပါ။ အထူးသဖြင့် ရှုပ်ထွေးလွန်းတဲ့ regexps တွေက node-re2 မှာ support မလုပ်ပါဘူး။

URL ဒါမှမဟုတ် file path လိုမျိုး "ထင်သာမြင်သာရှိတဲ့" အရာတွေကို match လုပ်ချင်ရင် — [regexp library](http://www.regexlib.com) ထဲက ဥပမာတစ်ခု ရှာပါ ဒါမှမဟုတ် [ip-regex](https://www.npmjs.com/package/ip-regex) လို npm module သုံးပါ။

### Event Loop ပိတ်ဆို့ခြင်း — Node.js core modules

Node.js core modules တော်တော်များများမှာ synchronous ဖြစ်ပြီး အကုန်အကျများတဲ့ APIs တွေ ရှိပါတယ်:

- [Encryption](https://nodejs.org/api/crypto.html)
- [Compression](https://nodejs.org/api/zlib.html)
- [File system](https://nodejs.org/api/fs.html)
- [Child process](https://nodejs.org/api/child_process.html)

ဒီ APIs တွေက encryption/compression လို တွက်ချက်မှု ကြီးကြီးမားမား လိုတာ၊ file I/O လို I/O လိုတာ၊ ဒါမှမဟုတ် နှစ်မျိုးလုံး (child process) လိုတာတွေကြောင့် အကုန်အကျများပါတယ်။ ဒီ APIs တွေက scripting အတွက် အဆင်ပြေဖို့ ရည်ရွယ်ထားတာမို့ — **server context မှာ သုံးဖို့ မသင့်ပါဘူး**။ Event Loop ပေါ်မှာ run ရင် — သာမန် JavaScript instruction တွေထက် အချိန်အများကြီး ပိုကြာပြီး Event Loop ကို ပိတ်ဆို့ပါတယ်။

Server တစ်ခုမှာ အောက်ပါ synchronous APIs တွေကို **မသုံးသင့်ပါဘူး**:

- Encryption:
  - `crypto.randomBytes` (synchronous version)
  - `crypto.randomFillSync`
  - `crypto.pbkdf2Sync`
  - encryption/decryption routines တွေဆီ ထည့်တဲ့ input အကြီးကြီးတွေကိုလည်း သတိထားပါ။
- Compression:
  - `zlib.inflateSync`
  - `zlib.deflateSync`
- File system:
  - Synchronous file system APIs တွေ မသုံးပါနဲ့ — ဥပမာ [NFS](https://en.wikipedia.org/wiki/Network_File_System) လို [distributed file system](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) ထဲက file ကို သုံးရင် access time အမျိုးမျိုး ကွာနိုင်ပါတယ်။
- Child process:
  - `child_process.spawnSync`
  - `child_process.execSync`
  - `child_process.execFileSync`

ဒီစာရင်းက Node.js v9 အထိ အတော်လေး ပြည့်စုံပါတယ်။

### Event Loop ပိတ်ဆို့ခြင်း — JSON DOS

`JSON.parse` နဲ့ `JSON.stringify` တွေက နောက်ထပ် အကုန်အကျများနိုင်တဲ့ operations တွေပါ — input ရဲ့ အရှည်အတွက် `O(n)` ဖြစ်ပေမယ့် — `n` ကြီးလာရင် အံ့သြလောက်အောင် ကြာနိုင်ပါတယ်။

Server က JSON objects တွေကို ကိုင်တွယ်နေရင် — အထူးသဖြင့် client ဆီကရတာတွေဆိုရင် — Event Loop ပေါ်မှာ ကိုင်တွယ်နေတဲ့ object/string တွေရဲ့ အရွယ်အစားကို သတိထားပါ။

ဥပမာ — JSON blocking: object `obj` (size 2^21) ကို `JSON.stringify` လုပ်ပြီး — ရလာတဲ့ string ပေါ်မှာ `indexOf` run ကာ — နောက် JSON.parse လုပ်ပါတယ်။ Stringify လုပ်ထားတဲ့ string က 50MB ရှိပြီး — stringify ဖို့ 0.7 စက္ကန့်၊ 50MB string ပေါ်မှာ indexOf ဖို့ 0.03 စက္ကန့်၊ parse ဖို့ 1.3 စက္ကန့် ကြာပါတယ်:

```js
let obj = { a: 1 };
const iterations = 20;

// Expand the object exponentially by nesting it
for (let i = 0; i < iterations; i++) {
  obj = { obj1: obj, obj2: obj };
}

// Measure time to stringify the object
let start = process.hrtime();
const jsonString = JSON.stringify(obj);
let duration = process.hrtime(start);
console.log('JSON.stringify took', duration);

// Measure time to search a string within the JSON
start = process.hrtime();
const index = jsonString.indexOf('nomatch'); // Always -1
duration = process.hrtime(start);
console.log('String.indexOf took', duration);

// Measure time to parse the JSON back to an object
start = process.hrtime();
const parsed = JSON.parse(jsonString);
duration = process.hrtime(start);
console.log('JSON.parse took', duration);
```

Asynchronous JSON APIs ပေးတဲ့ npm modules တွေ ရှိပါတယ် — ဥပမာ:

- [JSONStream](https://www.npmjs.com/package/JSONStream) — stream APIs ပါတယ်။
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj) — stream APIs တင်မက — standard JSON APIs တွေရဲ့ asynchronous version တွေပါ ပါဝင်ပါတယ် (Event Loop ပေါ်မှာ partitioning လုပ်တဲ့ နည်းစနစ်နဲ့)။

### Event Loop မပိတ်ဆို့ဘဲ ရှုပ်ထွေးတဲ့ တွက်ချက်မှုများ

Event Loop မပိတ်ဆို့ဘဲ JavaScript နဲ့ ရှုပ်ထွေးတဲ့ တွက်ချက်မှုတွေ လုပ်ချင်ရင် ရွေးစရာ နှစ်ခု ရှိပါတယ် — **partitioning** နဲ့ **offloading**။

#### Partitioning

Partitioning က တွက်ချက်မှုတွေကို အပိုင်းပိုင်း ခွဲပြီး — တစ်ပိုင်းချင်းစီက Event Loop ပေါ်မှာ run ပေမယ့် — ကြားထဲမှာ ပုံမှန် yield (တခြား pending events တွေကို အလှည့်ပေး) လုပ်ပါတယ်။ JavaScript မှာ closure ထဲမှာ လက်ရှိ task ရဲ့ state ကို သိမ်းထားရတာ လွယ်ပါတယ် — အောက်က ဥပမာ ၂ မှာ ပြထားပါတယ်။

ရိုးရှင်းတဲ့ ဥပမာအနေနဲ့ — `1` ကနေ `n` အထိ ဂဏန်းတွေရဲ့ average တွက်ချင်တယ် ဆိုပါစို့။

ဥပမာ ၁ — partitioning မလုပ်ထားတဲ့ average — cost `O(n)`:

```js
for (let i = 0; i < n; i++) {
  sum += i;
}

const avg = sum / n;
console.log('avg: ' + avg);
```

ဥပမာ ၂ — partitioned average — asynchronous step တစ်ခုချင်းစီရဲ့ cost `O(1)`:

```js
function asyncAvg(n, avgCB) {
  // Save ongoing sum in JS closure.
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }

    // "Asynchronous recursion".
    // Schedule next operation asynchronously.
    setImmediate(help.bind(null, i + 1, cb));
  }

  // Start the helper, with CB to call avgCB.
  help(1, function (sum) {
    const avg = sum / n;
    avgCB(avg);
  });
}

asyncAvg(n, function (avg) {
  console.log('avg of 1-n: ' + avg);
});
```

ဒီနိယာမကို array iteration တွေစတာတွေမှာလည်း သုံးနိုင်ပါတယ်။

#### Offloading

ပိုရှုပ်ထွေးတဲ့ အလုပ်ဆိုရင် partitioning က ရွေးချယ်မှုကောင်း မဟုတ်ပါဘူး — partitioning က Event Loop တစ်ခုတည်းပဲ သုံးလို့ — machine ပေါ်က multiple cores တွေရဲ့ အကျိုးကို မခံစားရလို့ပါ။ _Event Loop က client requests တွေကို orchestrate လုပ်သင့်တာပဲ — ကိုယ်တိုင် ဖြည့်ဆည်းတာ မဟုတ်ပါဘူး။_ ရှုပ်ထွေးတဲ့ task ဆိုရင် အလုပ်ကို Event Loop ပေါ်ကနေ Worker Pool ဆီ **လွှဲပြောင်း** (offload) လုပ်ပါ။

##### ဘယ်လို offload လုပ်မလဲ

Offload လုပ်ဖို့ destination Worker Pool အတွက် ရွေးစရာ နှစ်ခု ရှိပါတယ်:

1. Node.js ရဲ့ built-in Worker Pool ကို [C++ addon](https://nodejs.org/api/addons.html) တစ်ခု ရေးပြီး သုံးနိုင်ပါတယ် — Node.js version အဟောင်းတွေမှာ [NAN](https://github.com/nodejs/nan) နဲ့ ဆောက်ပြီး — version အသစ်တွေမှာ [N-API](https://nodejs.org/api/n-api.html) သုံးပါ။ [node-webworker-threads](https://www.npmjs.com/package/webworker-threads) ကတော့ JavaScript သက်သက်နဲ့ Node.js Worker Pool ကို သုံးနိုင်တဲ့ နည်းပေးပါတယ်။
2. I/O အတွက်သုံးတဲ့ Node.js Worker Pool အစား — တွက်ချက်မှုအတွက် သီးသန့် Worker Pool ကို ဖန်တီးစီမံနိုင်ပါတယ် — အရိုးရှင်းဆုံးက [Child Process](https://nodejs.org/api/child_process.html) ဒါမှမဟုတ် [Cluster](https://nodejs.org/api/cluster.html) သုံးတာပါ။

Client တိုင်းအတွက် [Child Process](https://nodejs.org/api/child_process.html) အသစ် ဖန်တီးနေဖို့တော့ _မလိုပါဘူး_ — client request တွေက child process တွေ ဖန်တီးစီမံနိုင်တာထက် မြန်မြန် ရောက်လာနိုင်လို့ server က [fork bomb](https://en.wikipedia.org/wiki/Fork_bomb) ဖြစ်သွားနိုင်ပါတယ်။

##### Offloading ရဲ့ အားနည်းချက်

Offloading က _communication costs_ ဆိုတဲ့ overhead ပုံစံနဲ့ ပါလာပါတယ် — Event Loop ကပဲ application ရဲ့ "namespace" (JavaScript state) ကို မြင်ခွင့်ရှိပြီး — Worker တစ်ခုကနေ Event Loop ရဲ့ namespace ထဲက JavaScript object တွေကို ကိုင်တွယ်လို့ မရပါဘူး။ မျှဝေချင်တဲ့ object တွေကို serialize/deserialize လုပ်ပြီးမှ — Worker က သူ့ကိုယ်ပိုင် copy ပေါ်မှာ အလုပ်လုပ်ကာ — ပြုပြင်ပြီးတဲ့ object (ဒါမှမဟုတ် "patch") ကို Event Loop ဆီ ပြန်ပို့ရပါတယ်။ (Serialization အတွက် JSON DOS အပိုင်းကို ကြည့်ပါ။)

##### Offloading အတွက် အကြံပြုချက်များ

CPU-intensive နဲ့ I/O-intensive task တွေက သဘောသဘာဝ ခြားနားလို့ ခွဲခြား စဉ်းစားသင့်ပါတယ် — CPU-intensive task က သူ့ရဲ့ Worker ကို machine ရဲ့ [logical cores](https://nodejs.org/api/os.html#os_os_cpus) တစ်ခုပေါ်မှာ schedule လုပ်ခံရမှပဲ တိုးတက်ပါတယ်။ Core ၄ ခုနဲ့ Worker ၅ ခုဆိုရင် — Worker တစ်ယောက်က ဘယ်တော့မှ တိုးတက်လို့ မရပါဘူး — overhead (memory နဲ့ scheduling cost) ပဲ ကုန်ခံနေရပါတယ်။ I/O-intensive task တွေကတော့ external service (DNS, file system စသည်) ကို မေးပြီး response စောင့်တာမို့ — စောင့်နေတုန်း Worker ကို OS က de-schedule လုပ်ပြီး တခြား Worker ကို အခွင့်ပေးနိုင်ပါတယ်။ ဒါကြောင့် _I/O-intensive tasks တွေက thread မပြေးနေတောင်မှ တိုးတက်နေနိုင်ပါတယ်။_

Worker Pool တစ်ခုတည်း (Node.js Worker Pool) ပေါ်ပဲ မှီခိုနေရင် — CPU-bound နဲ့ I/O-bound အလုပ်တွေရဲ့ မတူညီတဲ့ သဘောလက္ခဏာတွေကြောင့် application ရဲ့ performance ထိခိုက်နိုင်ပါတယ် — ဒါကြောင့် သီးသန့် Computation Worker Pool တစ်ခု ထားဖို့ စဉ်းစားသင့်ပါတယ်။

##### Offloading — နိဂုံး

အရှည်ကြီး array တစ်ခုကို iterate လုပ်တာလို ရိုးရှင်းတဲ့ အလုပ်တွေအတွက် partitioning က ရွေးချယ်မှုကောင်းပါတယ်။ ပိုရှုပ်ထွေးရင်တော့ offloading က ပိုကောင်းပါတယ် — communication cost (serialized objects တွေ Event Loop နဲ့ Worker Pool ကြား ဖြတ်သန်းရတဲ့ overhead) တွေက multiple cores သုံးလို့ရတဲ့ အကျိုးနဲ့ လျော်ကြေး ပေးလို့ပါ။

ဒါပေမယ့် server က ရှုပ်ထွေးတဲ့ တွက်ချက်မှုတွေကို အဓိက မှီခိုနေရင် — Node.js က တကယ် သင့်တော်ရဲ့လားဆိုတာ ပြန်စဉ်းစားသင့်ပါတယ် — Node.js က I/O-bound အလုပ်တွေမှာ ထူးချွန်ပြီး — အကုန်အကျများတဲ့ တွက်ချက်မှုတွေအတွက်တော့ အကောင်းဆုံး ရွေးချယ်မှု မဟုတ်နိုင်ပါဘူး။ Offloading သုံးမယ်ဆိုရင် — အောက်က Worker Pool မပိတ်ဆို့ဖို့ အပိုင်းကို ဆက်ဖတ်ပါ။

## Worker Pool ကို မပိတ်ဆို့ပါနဲ့

Node.js မှာ Worker `k` ယောက်ပါတဲ့ Worker Pool ရှိပါတယ် (offloading paradigm သုံးရင် သီးခြား Computational Worker Pool ရှိနိုင်ပြီး — အခြေခံစည်းမျဉ်းတွေ အတူတူပါ)။ နှစ်မျိုးလုံးမှာ `k` က တစ်ပြိုင်နက် ကိုင်တွယ်နေတဲ့ client အရေအတွက်ထက် အများကြီး ငယ်တယ်လို့ ယူဆပါတယ်။

အပေါ်မှာ ဆွေးနွေးခဲ့သလို — Worker တစ်ယောက်ချင်းစီက လက်ရှိ Task ပြီးမှ နောက် Task ကို ဆက်လုပ်ပါတယ်။ Client တွေရဲ့ request တွေကို ကိုင်တွယ်ဖို့ လိုအပ်တဲ့ Tasks တွေရဲ့ cost က အတူတူ မဟုတ်ပါဘူး — တချို့က မြန်မြန် ပြီးပြီး (ဥပမာ file အတို/ cached file ဖတ်တာ၊ random bytes အနည်းငယ် ထုတ်တာ) — တချို့က ပိုကြာပါတယ် (file အကြီး/uncached file ဖတ်တာ၊ random bytes အများကြီး ထုတ်တာ)။ ရည်မှန်းချက်က _Task အချိန်တွေရဲ့ ကွာခြားမှု (variation) ကို အနည်းဆုံး ဖြစ်အောင်_ လုပ်ပြီး — အဲဒါအတွက် _Task partitioning_ ကို သုံးပါ။

### Task အချိန် ကွာခြားမှုကို လျှော့ချခြင်း

Worker တစ်ယောက်ရဲ့ လက်ရှိ Task က တခြား Task တွေထက် အများကြီး ပိုအကုန်အကျများရင် — သူက တခြား pending Tasks တွေကို မလုပ်နိုင်တော့ပါဘူး။ တစ်နည်းပြောရရင် _Task တစ်ခုချင်းစီ ကြာနေသမျှ — Worker Pool ရဲ့ အရွယ်အစားကို တစ်ယောက်စီ လျှော့ချလိုက်သလိုပါပဲ။_ Worker Pool ထဲ Worker များလေ throughput (tasks/second) များလေမို့ — Task တစ်ခုက ကြာနေရင် Worker Pool ရဲ့ throughput ကျပြီး — server ရဲ့ throughput ပါ ဆက်ကျပါတယ်။

ဒါကိုရှောင်ဖို့ — Worker Pool ဆီ ပို့တဲ့ Tasks တွေရဲ့ အချိန်ကွာခြားမှုကို အနည်းဆုံး ဖြစ်အောင် ကြိုးစားပါ။ I/O requests တွေက ဝင်ရောက်တဲ့ external system တွေ (DB, FS စသည်) ကို black box သဘောမျိုး သဘောထားလို့ ရပေမယ့် — ဒီ I/O requests တွေရဲ့ နှိုင်းရ cost ကို သတိထားပြီး — အထူးသဖြင့် ကြာနိုင်မယ်လို့ မျှော်လင့်ရတဲ့ request တွေကို ရှောင်ရှားပါ။

#### ကွာခြားမှု ဥပမာ — အချိန်ကြာမြင့်တဲ့ file system reads

Server က client request တချို့အတွက် file ဖတ်ရတယ် ဆိုပါစို့ — အဆင်ပြေလို့ `fs.readFile()` သုံးထားပါတယ်။ ဒါပေမယ့် v10 မတိုင်ခင် `fs.readFile()` က partitioned မဟုတ်ပါဘူး — file တစ်ခုလုံးအတွက် `fs.read()` Task တစ်ခုတည်း ပို့လိုက်တာပါ။ User တချို့အတွက် file အတို၊ user တချို့အတွက် file အရှည်ဆိုရင် — `fs.readFile()` က Task အချိန် ကွာခြားမှု ကြီးကြီးမားမား ဖြစ်စေပြီး — Worker Pool throughput ကို ထိခိုက်စေပါတယ်။

အဆိုးဆုံး ဖြစ်ရပ်ကို မြင်ကြည့်ရအောင် — attacker က server ကို _ဘယ် file မဆို_ ဖတ်ခိုင်းနိုင်တယ် ဆိုပါစို့ ([directory traversal vulnerability](https://www.owasp.org/index.php/Path_Traversal))။ Server က Linux ဆိုရင် attacker က အရမ်းနှေးတဲ့ file တစ်ခုကို ညွှန်းနိုင်ပါတယ် — [`/dev/random`](http://man7.org/linux/man-pages/man4/random.4.html) ပါ။ လက်တွေ့အရ `/dev/random` က ထာဝရ နှေးတယ်လို့ ဆိုရမယ့် အခြေအနေမို့ — `/dev/random` ဖတ်ဖို့ တောင်းခံလိုက်တဲ့ Worker တိုင်းက အဲဒီ Task ကို ဘယ်တော့မှ ပြီးအောင် မလုပ်နိုင်ပါဘူး။ Attacker က Worker တစ်ယောက်စီအတွက် request `k` ခု ပို့လိုက်ရင် — Worker Pool သုံးတဲ့ တခြား client request တွေ အားလုံး ရပ်တန့်သွားပါတယ်။

#### ကွာခြားမှု ဥပမာ — အချိန်ကြာမြင့်တဲ့ crypto operations

Server က [`crypto.randomBytes()`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback) နဲ့ cryptographically secure random bytes တွေ ထုတ်တယ် ဆိုပါစို့ — သူက partitioned မဟုတ်ပဲ — တောင်းထားတဲ့ byte အရေအတွက် အတွက် `randomBytes()` Task တစ်ခုတည်း ဖန်တီးပါတယ်။ User တချို့အတွက် byte နည်း၊ user တချို့အတွက် byte များဆိုရင် — ဒါလည်း Task အချိန် ကွာခြားမှုရဲ့ ရင်းမြစ်တစ်ခုပါ။

### Task partitioning

အချိန် ကွာခြားနိုင်တဲ့ Tasks တွေက Worker Pool ရဲ့ throughput ကို ထိခိုက်စေနိုင်ပါတယ်။ ဒါကြောင့် — Task တစ်ခုချင်းစီကို cost တူလုနီးပါး sub-Tasks တွေအဖြစ် _partition_ လုပ်ပါ။ Sub-task တစ်ခုစီ ပြီးတိုင်း နောက် sub-task ကို ဆက်တင်ပြီး — နောက်ဆုံး sub-task ပြီးတဲ့အခါ submit လုပ်ခဲ့သူကို အကြောင်းကြားပါ။

`fs.readFile()` ဥပမာကို ဆက်ရရင် — `fs.read()` (manual partitioning) ဒါမှမဟုတ် `ReadStream` (automatic partitioning) ကို သုံးသင့်ပါတယ်။ CPU-bound tasks တွေအတွက်လည်း ဒီနိယာမ သက်ဆိုင်ပါတယ် — အပေါ်က `asyncAvg` ဥပမာက Event Loop အတွက် မသင့်တော်ပေမယ့် — Worker Pool အတွက်တော့ သင့်တော်ပါတယ်။

Task တစ်ခုကို sub-Tasks တွေ ခွဲလိုက်တဲ့အခါ — Task အတိုတွေက sub-task အနည်းငယ် ဖြစ်ပြီး — Task အရှည်တွေက sub-task အများကြီး ဖြစ်ပါတယ်။ Task အရှည်ရဲ့ sub-task တစ်ခုစီကြားမှာ — အဲဒီ Worker က တခြား Task အတိုတစ်ခုရဲ့ sub-task ကို လုပ်နိုင်လို့ Worker Pool တစ်ခုလုံးရဲ့ Task throughput တိုးပါတယ်။ (မှတ်ချက် — ပြီးသွားတဲ့ sub-task အရေအတွက်က throughput ရဲ့ အသုံးဝင်တဲ့ တိုင်းတာမှု မဟုတ်ပါဘူး — _Task_ ပြီးတဲ့ အရေအတွက်ကိုပဲ ကြည့်ပါ။)

### Task partitioning ကို ရှောင်ခြင်း

Task partitioning ရဲ့ ရည်ရွယ်ချက်က Task အချိန် ကွာခြားမှုကို လျှော့ချဖို့ပါ — Task အတိုနဲ့ Task အရှည် (ဥပမာ array ပေါင်းတာ vs array sort လုပ်တာ) ကို ခွဲခြားနိုင်ရင် — Task class တစ်ခုစီအတွက် Worker Pool တစ်ခုစီ ဖန်တီးနိုင်ပါတယ်။ ဒီနည်းက partition လုပ်ခြင်းရဲ့ overhead (Worker Pool Task representation ဖန်တီးစရိတ်၊ queue ကိုင်တွယ်စရိတ်) တွေကို သက်သာစေပြီး — partition မှားတာ ရှောင်နိုင်ပါတယ်။

အားနည်းချက်ကတော့ — Pool တွေ အားလုံးက space/time overhead တွေ ကျခံရပြီး CPU time အတွက် အချင်းချင်း ပြိုင်ရပါတယ်။ CPU-bound Task တိုင်းက schedule လုပ်ခံရမှပဲ တိုးတက်တာကို သတိရပါ — ဒါကြောင့် သေချာ ခွဲခြမ်းစိတ်ဖြာပြီးမှသာ ဒီနည်းကို စဉ်းစားပါ။

### Worker Pool — နိဂုံး

Node.js Worker Pool တစ်ခုတည်းပဲ သုံးဖြစ်ဖြစ် — သီးခြား Pool တွေ ထားဖြစ်ဖြစ် — Pool (များ) ရဲ့ Task throughput ကို optimize လုပ်ပါ — Task partitioning နဲ့ Task အချိန် ကွာခြားမှုကို လျှော့ချခြင်းအားဖြင့်ပါ။

## npm modules တွေရဲ့ အန္တရာယ်များ

Node.js core modules တွေက application အမျိုးမျိုးအတွက် အခြေခံအုတ်မြစ် ပေးပေမယ့် — တစ်ခါတစ်ရံ ပိုလိုအပ်ပါတယ်။ Node.js developers တွေက [npm ecosystem](https://www.npmjs.com/) ကနေ အကျိုးအမြတ် အများကြီး ရပါတယ် — development မြန်ဆန်စေမယ့် module သိန်းချီ ရှိပါတယ်။

ဒါပေမယ့် မှတ်ထားပါ — ဒီ modules အများစုက third-party developers တွေ ရေးထားတာဖြစ်ပြီး — best-effort guarantee နဲ့ပဲ ထုတ်ဝေလေ့ ရှိပါတယ်။ npm module သုံးတဲ့ developer က နှစ်ချက် သတိထားသင့်ပါတယ်:

1. သူ့ရဲ့ APIs တွေက ကတိအတိုင်း အလုပ်လုပ်လား။
2. သူ့ရဲ့ APIs တွေက Event Loop ဒါမှမဟုတ် Worker တစ်ခုခုကို ပိတ်ဆို့နိုင်လား။ (ဒီအချက်က မကြာခဏ မေ့နေတတ်ပါတယ် — module တော်တော်များများက သူတို့ API တွေရဲ့ cost ကို ဖော်ပြဖို့ ကြိုးစားမှု မရှိပါဘူး။)

_အကုန်အကျများနိုင်တဲ့ API တစ်ခုခုကို ခေါ်နေတယ်ဆိုရင် — cost ကို နှစ်ခါစစ်ပါ။ Developers တွေကို document လုပ်ဖို့ တောင်းဆိုပါ၊ ဒါမှမဟုတ် source code ကို ကိုယ်တိုင် စစ်ဆေးပါ (ပြီးရင် cost ဖော်ပြတဲ့ PR တစ်ခု ပို့ပေးပါ)။_

API က asynchronous ဖြစ်နေရင်တောင် — partition တစ်ခုချင်းစီမှာ Worker ဒါမှမဟုတ် Event Loop ပေါ်မှာ အချိန်ဘယ်လောက် ကုန်မလဲ မသိနိုင်ပါဘူး။ ဥပမာ — အပေါ်က `asyncAvg` မှာ helper function ခေါ်တိုင်း ဂဏန်း _တစ်ဝက်_ ပေါင်းတယ်ဆိုရင် — function က asynchronous ဖြစ်နေတုန်းပဲ ဖြစ်ပေမယ့် — partition တစ်ခုချင်းစီရဲ့ cost က `O(1)` မဟုတ်တော့ဘဲ `O(n)` ဖြစ်ပြီး — `n` တန်ဖိုး မရွေး သုံးဖို့ မလုံခြုံတော့ပါဘူး။

## နိဂုံး

Node.js မှာ thread နှစ်မျိုး ရှိပါတယ် — Event Loop တစ်ခုနဲ့ Worker `k` ယောက်ပါ။ Event Loop က JavaScript callbacks တွေနဲ့ non-blocking I/O တွေအတွက် တာဝန်ရှိပြီး — Worker တွေက blocking I/O နဲ့ CPU-intensive အလုပ်တွေ အပါအဝင် — asynchronous request တစ်ခုကို ပြီးမြောက်စေတဲ့ C++ code တွေနဲ့ ကိုက်ညီတဲ့ tasks တွေကို execute လုပ်ပါတယ်။ Thread နှစ်မျိုးလုံးက တစ်ချိန်မှာ အလုပ်တစ်ခုထက် ပိုမလုပ်ပါဘူး။ Callback ဒါမှမဟုတ် task တစ်ခုခုက အချိန်ကြာနေရင် — အဲဒါကို run နေတဲ့ thread က _blocked_ ဖြစ်ပါတယ်။ Blocking callbacks/tasks တွေ ရှိနေရင် — အကောင်းဆုံးအခြေအနေမှာ throughput (clients/second) ကျဆင်းပြီး — အဆိုးဆုံးမှာ denial of service အပြည့်အဝ ဖြစ်နိုင်ပါတယ်။

High-throughput ဖြစ်ပြီး DoS ခံနိုင်ရည် ပိုရှိတဲ့ web server ရေးဖို့ဆိုရင် — benign input ပေါ်မှာရော malicious input ပေါ်မှာရော — Event Loop ရော Workers တွေရော block မဖြစ်အောင် သေချာစေရပါမယ်။

## ဆက်ဖတ်ရန်

- [Node.js Event Loop](/docs/nodejs/event-loop) — Event Loop phases နဲ့ callback စီမံပုံ
- [Overview of Blocking vs Non-Blocking](/docs/nodejs/overview-of-blocking-vs-non-blocking) — blocking နဲ့ non-blocking အခြေခံ
- [Async Programming](/docs/nodejs/async-programming) — async pattern တွေ အသေးစိတ်
