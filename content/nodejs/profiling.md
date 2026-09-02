---
title: "Node.js Application တွေကို Profiling လုပ်ခြင်း"
description: "Node.js ရဲ့ built-in profiler (`--prof` / `--prof-process`) သုံးပြီး application performance ကို တိုင်းတာ ဆန်းစစ်ခြင်း — bottleneck ရှာပုံ၊ sync → async ပြောင်းပြီး latency မြှင့်တင်ပုံ"
order: 41
source: "https://nodejs.org/learn/getting-started/profiling"
status: translated
updated: 2026-09-02
---

Node.js application တစ်ခုကို profiling လုပ်တယ်ဆိုတာ — application run နေတုန်း CPU, memory နဲ့ တခြား runtime metric တွေကို ဆန်းစစ်ပြီး သူ့ရဲ့ performance ကို တိုင်းတာတာပါ။ ဒါက application ရဲ့ ထိရောက်မှု (efficiency), တုံ့ပြန်မှု မြန်ဆန်မှု (responsiveness) နဲ့ scalability ကို ထိခိုက်စေနိုင်တဲ့ — bottleneck တွေ၊ CPU သုံးစွဲမှု မြင့်မားတာတွေ၊ memory leak တွေ ဒါမှမဟုတ် နှေးကွေးတဲ့ function call တွေကို ဖော်ထုတ်ဖို့ ကူညီပေးပါတယ်။

Node.js application တွေကို profiling လုပ်ဖို့ third-party tool တွေ အများကြီး ရှိပေမယ့် — အများစုသော အခြေအနေတွေမှာ အလွယ်ဆုံး ရွေးချယ်စရာကတော့ Node.js ရဲ့ built-in profiler ကို သုံးတာပါပဲ။ Built-in profiler က [V8 ရဲ့ အတွင်းပိုင်း profiler](https://v8.dev/docs/profile) ကို သုံးပြီး — program run နေစဉ် stack ကို ပုံမှန် interval တွေမှာ sample လုပ်ပါတယ်။ ဒီ sample တွေရဲ့ ရလဒ်တွေကို jit compile လိုမျိုး အရေးကြီးတဲ့ optimization event တွေနဲ့အတူ — **tick** တွေရဲ့ အစီအစဉ်တစ်ခုအနေနဲ့ မှတ်တမ်းတင်ပါတယ်:

```text
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```

အရင်တုန်းကဆိုရင် ဒီ tick တွေကို အနက်ဖော်ဖို့ V8 source code ကို လိုအပ်ခဲ့ပါတယ်။ ကံကောင်းချင်တော့ Node.js 4.4.0 ကစပြီး — V8 ကို source ကနေ သပ်သပ် ပြန်ဆောက်စရာ မလိုဘဲ ဒီအချက်အလက်တွေကို စားသုံးလို့ရအောင် လုပ်ပေးတဲ့ tool တွေ မိတ်ဆက်ပေးခဲ့ပါတယ်။ Built-in profiler က application ရဲ့ performance အကြောင်း ထိုးထွင်းသိမြင်မှု (insight) တွေ ဘယ်လို ပေးနိုင်လဲ ကြည့်ရအောင်။

Tick profiler သုံးပုံကို သရုပ်ပြဖို့ — Express application အသေးစားတစ်ခုနဲ့ လုပ်ကြည့်ပါမယ်။ ကျွန်တော်တို့ application မှာ handler နှစ်ခု ပါမယ်။ တစ်ခုက system ထဲ user အသစ်တွေ ထည့်ဖို့ပါ:

```js
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';

  username = username.replace(/[^a-zA-Z0-9]/g, '');

  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }

  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  users[username] = { salt, hash };

  res.sendStatus(200);
});
```

နောက်တစ်ခုကတော့ user တစ်ယောက်ရဲ့ authentication ကြိုးစားမှုတွေကို အတည်ပြုဖို့ပါ:

```js
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';

  username = username.replace(/[^a-zA-Z0-9]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

သတိပြုရမှာ — ဒါတွေက Node.js application တွေမှာ user authentication လုပ်ဖို့ အကြံပြုထားတဲ့ handler တွေ မဟုတ်ဘဲ — သရုပ်ပြရန်အတွက်သာ သုံးထားတာပါ။ ယေဘုယျအားဖြင့် ကိုယ်ပိုင် cryptographic authentication mechanism တွေကို ကိုယ်တိုင် ဒီဇိုင်းဆွဲဖို့ မကြိုးစားသင့်ပါဘူး။ ရှိပြီးသား၊ သက်သေပြပြီးသား authentication solution တွေကို သုံးတာက ပိုကောင်းပါတယ်။

အခု ကျွန်တော်တို့ application ကို deploy လုပ်ပြီးပြီလို့ ယူဆကြည့်ပါစို့ — user တွေက request တွေရဲ့ latency မြင့်တယ်လို့ complaint လုပ်နေပါတယ်။ Application ကို built-in profiler နဲ့ အလွယ်တကူ run လို့ရပါတယ်:

```bash
NODE_ENV=production node --prof app.js
```

ပြီးတော့ `ab` (ApacheBench) နဲ့ server ပေါ်ကို load အနည်းငယ် သက်ရောက်ကြည့်ပါ:

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

ab ရဲ့ output က ဒီလိုရပါတယ်:

```text
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received

...

Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

ဒီ output ကနေ ကြည့်ရင် — ကျွန်တော်တို့ app က တစ်စက္ကန့်ကို request ၅ ခုလောက်ပဲ ဆောင်ရွက်ပေးနိုင်ပြီး — request တစ်ခုရဲ့ ပျမ်းမျှ round trip က ၄ စက္ကန့် မပြည့်ခင် နည်းနည်းလေး ရှိနေတာကို တွေ့ရပါတယ်။ Real-world ဥပမာမှာ user request တစ်ခုအတွက် function တွေ အများကြီးထဲမှာ အလုပ်တွေ အများကြီး လုပ်နေနိုင်ပေမယ့် — ဒီရိုးရှင်းတဲ့ ဥပမာထဲမှာတောင် regular expression တွေ compile လုပ်တာ၊ random salt တွေ ထုတ်တာ၊ user password တွေကနေ unique hash တွေ ထုတ်တာ ဒါမှမဟုတ် Express framework ကိုယ်တိုင်ထဲမှာတောင် အချိန်တွေ ဆုံးရှုံးနေနိုင်ပါတယ်။

Application ကို `--prof` option နဲ့ run ခဲ့လို့ — application ကို run ခဲ့တဲ့ directory ထဲမှာ tick file တစ်ခု ထွက်လာပါလိမ့်မယ်။ File ရဲ့ နာမည်က `isolate-0xnnnnnnnnnnnn-v8.log` (ဒီမှာ `n` တွေက digit တွေပါ) ပုံစံမျိုး ဖြစ်ပါတယ်။

ဒီ file ကို အနက်ဖော်ဖို့ — Node.js binary နဲ့အတူ ပါလာတဲ့ tick processor ကို သုံးဖို့ လိုပါတယ်။ Processor ကို run ဖို့ `--prof-process` flag ကို သုံးပါ:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

`processed.txt` ကို ကိုယ်ကြိုက်တဲ့ text editor နဲ့ ဖွင့်ကြည့်ရင် — အချက်အလက် အမျိုးမျိုး တွေ့ရပါမယ်။ File ကို section တွေ ခွဲထားပြီး — section တစ်ခုချင်းစီကို language အလိုက် ထပ်ပြီး ခွဲထားပါတယ်။ ပထမဆုံး summary section ကို ကြည့်ရအောင်:

```text
 [Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

ဒါက စုဆောင်းမိတဲ့ sample အားလုံးရဲ့ 97% က C++ code ထဲမှာ ဖြစ်ပွားတယ်လို့ ပြောပြတာဖြစ်ပြီး — processed output ရဲ့ တခြား section တွေကို ကြည့်တဲ့အခါ JavaScript ထက် C++ ထဲမှာ လုပ်နေတဲ့ အလုပ်တွေကို အဓိက အာရုံစိုက်သင့်တယ်ဆိုတာ ညွှန်ပြပါတယ်။ ဒါကို စိတ်ထဲမှာ ထားပြီး — C++ function တွေထဲက ဘယ်ဟာတွေက CPU အချိန် အများဆုံး ယူနေလဲဆိုတဲ့ အချက်အလက် ပါဝင်တဲ့ [C++] section ကို ဆက်ကြည့်ရအောင်:

```text
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

ထိပ်ဆုံး entry ၃ ခုက program ရဲ့ CPU အချိန် 72.1% ကို နေရာယူထားတာ တွေ့ရပါတယ်။ ဒီ output ကနေ — user ရဲ့ password ကနေ hash ထုတ်တာနဲ့ ကိုက်ညီတဲ့ PBKDF2 ဆိုတဲ့ function က CPU အချိန်ရဲ့ အနည်းဆုံး 51.8% ကို ယူနေတာ ချက်ချင်း မြင်ရပါတယ်။ ဒါပေမယ့် အောက်က entry နှစ်ခုက ကျွန်တော်တို့ application ထဲမှာ ဘယ်လို ပါဝင်ပတ်သက်နေလဲဆိုတာ ချက်ချင်းတော့ ထင်ရှားချင်မှ ထင်ရှားပါလိမ့်မယ် (မထင်ရှားဘူးဆိုပြီး ဥပမာအလို့ငှာ ဟန်ဆောင်ထားပါမယ်)။ ဒီ function တွေကြားက ဆက်စပ်မှုကို ပိုကောင်းကောင်း နားလည်ဖို့ — function တစ်ခုချင်းစီရဲ့ အဓိက caller တွေအကြောင်း အချက်အလက် ပေးတဲ့ [Bottom up (heavy) profile] section ကို နောက်တစ်ဆင့်မှာ ကြည့်ပါမယ်။ ဒီ section ကို စစ်ဆေးကြည့်ရင်:

```text
   ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16

   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30

   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

ဒီ section ကို အနက်ဖော်တာက အပေါ်က raw tick count တွေထက် နည်းနည်း ပိုကြိုးစားရပါတယ်။ အပေါ်က "call stack" တစ်ခုချင်းစီထဲမှာ — parent column ထဲက ရာခိုင်နှုန်းက အပေါ်က row ထဲက function ကို လက်ရှိ row ထဲက function က ခေါ်ခဲ့တဲ့ sample တွေရဲ့ ရာခိုင်နှုန်းကို ပြောပြပါတယ်။ ဥပမာ — အလယ်က `_sha1_block_data_order` အတွက် "call stack" မှာ `_sha1_block_data_order` က sample တွေရဲ့ 11.9% မှာ ပေါ်ခဲ့တာကို မြင်ရပြီး — အဲဒါကို အပေါ်က raw count တွေကနေ သိပြီးသားပါ။ ဒါပေမယ့် ဒီနေရာမှာ သူ့ကို Node.js crypto module ထဲက pbkdf2 function ကပဲ အမြဲ ခေါ်ခဲ့တာကိုလည်း ထပ်ပြီး ပြောပြပါတယ်။ အလားတူပဲ `_malloc_zone_malloc` ကိုလည်း pbkdf2 function ကပဲ နီးပါး ခေါ်ခဲ့တာ တွေ့ရပါတယ်။ ဒါကြောင့် ဒီ view ထဲက အချက်အလက်တွေကို သုံးပြီး — user ရဲ့ password ကနေ ကျွန်တော်တို့ တွက်ထုတ်တဲ့ hash က အပေါ်က 51.8% အတွက်သာမက — `_sha1_block_data_order` နဲ့ `_malloc_zone_malloc` တို့ဆီက call တွေကို pbkdf2 function ကိုယ်စား လုပ်ထားတာမို့ — sample အများဆုံး ခံရတဲ့ function ၃ ခုထဲက CPU အချိန် အားလုံးအတွက်ပါ တာဝန်ရှိတယ်လို့ ပြောနိုင်ပါတယ်။

ဒီအချိန်မှာ password အခြေပြု hash ထုတ်လုပ်ခြင်းကို optimization ပစ်မှတ်ထားသင့်တာ အရမ်း ရှင်းနေပါပြီ။ ကံကောင်းချင်တော့ — [asynchronous programming ရဲ့ အကျိုးကျေးဇူးတွေ](https://nodesource.com/blog/why-asynchronous)ကို သင်ကောင်းကောင်း နားလည်ထားပြီးမို့ — user ရဲ့ password ကနေ hash ထုတ်တဲ့ အလုပ်ကို synchronous နည်းနဲ့ လုပ်နေပြီး [event loop](/docs/nodejs/event-loop) ကို ပိတ်ဆို့ထားတယ်ဆိုတာ သင်သဘောပေါက်ပါတယ်။ ဒါက hash တစ်ခု တွက်နေတုန်း တခြား ဝင်လာတဲ့ request တွေကို ဆက်ပြီး လုပ်ကိုင်နိုင်စွမ်းကို တားဆီးထားပါတယ်။

ဒီပြဿနာကို ဖြေရှင်းဖို့ — pbkdf2 function ရဲ့ asynchronous version ကို သုံးအောင် အပေါ်က handler တွေကို ပြင်ဆင်ချက် အနည်းငယ် လုပ်လိုက်ပါ:

```js
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';

  username = username.replace(/[^a-zA-Z0-9]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

အပေါ်က ab benchmark ကို app ရဲ့ asynchronous version နဲ့ ထပ်ပြီး run ကြည့်ရင် ဒီလို ရပါတယ်:

```text
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received

...

Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

ရပါပြီ! သင့် app က အခု တစ်စက္ကန့်ကို request ၂၀ လောက် ဆောင်ရွက်ပေးနေပါပြီ — synchronous hash ထုတ်တုန်းကထက် ၄ ဆ လောက် ပိုပါတယ်။ ဒါ့အပြင် ပျမ်းမျှ latency ကလည်း အရင် ၄ စက္ကန့်ကနေ ၁ စက္ကန့်ကျော်လောက်အထိ ကျဆင်းသွားပါတယ်။

ဒီ (တမင်တကာ ရိုးရှင်းအောင် ဖန်တီးထားတဲ့) ဥပမာရဲ့ performance စုံစမ်းစစ်ဆေးမှုကနေတစ်ဆင့် — V8 tick processor က Node.js application တွေရဲ့ performance အကြောင်း ပိုကောင်းတဲ့ နားလည်မှု ရရှိအောင် ဘယ်လို ကူညီပေးနိုင်လဲ သင်မြင်ခဲ့ပြီးပြီလို့ မျှော်လင့်ပါတယ်။

[flame graph ဖန်တီးနည်း](https://nodejs.org/en/learn/diagnostics/flame-graphs) ကလည်း သင့်အတွက် အထောက်အကူ ဖြစ်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Event Loop](/docs/nodejs/event-loop) — Node.js ရဲ့ event-driven architecture အခြေခံ
- [Event Loop ကို မပိတ်ဆို့ပါနဲ့](/docs/nodejs/dont-block-the-event-loop) — synchronous heavy work တွေနဲ့ event loop ပိတ်ဆို့ခြင်း
- [Asynchronous Flow Control](/docs/nodejs/asynchronous-flow-control) — callback, promise, async/await ပုံစံများ
