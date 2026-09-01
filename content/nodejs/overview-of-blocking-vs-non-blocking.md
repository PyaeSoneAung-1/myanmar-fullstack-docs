---
title: "Blocking နဲ့ Non-Blocking ခြုံငုံကြည့်ခြင်း"
description: "blocking နဲ့ non-blocking call တွေရဲ့ ကွာခြားချက်၊ synchronous နဲ့ asynchronous file read နှိုင်းယှဉ်ချက်၊ concurrency/throughput နဲ့ blocking/non-blocking code ရောနှောခြင်းရဲ့ အန္တရာယ်များ"
order: 19
source: "https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking"
status: translated
updated: 2026-09-01
---

## Blocking vs Non-Blocking ခြုံငုံကြည့်ခြင်း

ဒီအကြောင်းအရာက Node.js မှာရှိတဲ့ **blocking** နဲ့ **non-blocking** call တွေရဲ့ ကွာခြားချက်ကို ခြုံငုံဖော်ပြပေးပါတယ်။ ဒီထဲမှာ event loop နဲ့ libuv အကြောင်း ရည်ညွှန်းပါလိမ့်မယ် — ဒါပေမယ့် အဲဒီအကြောင်းအရာတွေကို ကြိုသိထားဖို့ မလိုပါဘူး။ စာဖတ်သူတွေက JavaScript ဘာသာစကားနဲ့ Node.js ရဲ့ [callback pattern](/docs/nodejs/async-programming) ကို အခြေခံအဆင့် နားလည်ထားတယ်လို့ ယူဆပါတယ်။

> "I/O" ဆိုတာ အဓိကအားဖြင့် libuv ရဲ့ အကူအညီနဲ့ လုပ်ဆောင်တဲ့ system ရဲ့ disk နဲ့ network ပေါ်က အပြန်အလှန် ဆက်သွယ်မှုတွေကို ရည်ညွှန်းပါတယ်။

## Blocking

**Blocking** ဆိုတာ Node.js process ထဲမှာ နောက်ထပ် JavaScript တွေ execute လုပ်ဖို့အတွက် — non-JavaScript operation တစ်ခု ပြီးစီးတဲ့အထိ စောင့်နေရတဲ့ အခြေအနေပါ။ ဒါဖြစ်ရတဲ့ အကြောင်းရင်းက — **blocking** operation တစ်ခု ဖြစ်ပေါ်နေစဉ်မှာ event loop က JavaScript တွေကို ဆက်ပြီး run လို့ မရတာကြောင့်ပါ။

Node.js မှာ I/O လိုမျိုး non-JavaScript operation ကို စောင့်နေတာမဟုတ်ဘဲ — CPU intensive ဖြစ်လို့ performance ညံ့တဲ့ JavaScript တွေကိုတော့ ပုံမှန်အားဖြင့် **blocking** လို့ မခေါ်ပါဘူး။ libuv ကို သုံးတဲ့ Node.js standard library ထဲက synchronous methods တွေက အသုံးအများဆုံး **blocking** operations တွေပါ။ Native modules တွေမှာလည်း **blocking** methods တွေ ရှိနိုင်ပါတယ်။

Node.js standard library ထဲက I/O methods တွေအားလုံးက — **non-blocking** ဖြစ်တဲ့ asynchronous versions တွေကို ပေးထားပြီး callback functions တွေကို လက်ခံပါတယ်။ Methods တချို့မှာ **blocking** counterpart တွေလည်း ရှိပြီး — အဲဒါတွေရဲ့ နာမည်တွေက `Sync` နဲ့ အဆုံးသတ်ပါတယ်။

## Code တွေ နှိုင်းယှဉ်ကြည့်ခြင်း

**Blocking** methods တွေက **synchronously** execute လုပ်ပြီး — **non-blocking** methods တွေက **asynchronously** execute လုပ်ပါတယ်။

File System module ကို ဥပမာအနေနဲ့ ကြည့်ရင် — ဒါက **synchronous** file read ပါ:

```js
const fs = require('node:fs');

const data = fs.readFileSync('/file.md'); // blocks here until file is read
```

ပြီးတော့ ဒါက ညီမျှတဲ့ **asynchronous** ဥပမာပါ:

```js
const fs = require('node:fs');

fs.readFile('/file.md', (err, data) => {
  if (err) {
    throw err;
  }
});
```

ပထမ ဥပမာက ဒုတိယထက် ရိုးရှင်းပုံရပေမယ့် — အားနည်းချက်ရှိပါတယ်။ အဲဒါက ဒုတိယ line က file တစ်ခုလုံး ဖတ်ပြီးတဲ့အထိ နောက်ထပ် JavaScript တွေရဲ့ execution ကို **block** လုပ်လိုက်လို့ပါ။ Synchronous version မှာ error တစ်ခု throw ဖြစ်ရင် အဲဒါကို catch လုပ်ဖို့ လိုပြီး — မလုပ်ရင် process က crash ဖြစ်သွားမှာ သတိပြုပါ။ Asynchronous version မှာတော့ error တစ်ခုကို throw လုပ်သင့်လား မလုပ်သင့်လား ဆိုတာက code ရေးသူဆီမှာ မူတည်ပါတယ် (အပေါ်က ဥပမာမှာ ပြထားသလိုပါ)။

ဥပမာကို နည်းနည်း ချဲ့ကြည့်ရအောင်:

```js
const fs = require('node:fs');

const data = fs.readFileSync('/file.md'); // blocks here until file is read
console.log(data);
moreWork(); // will run after console.log
```

ပြီးတော့ ဒါက ဆင်တူပေမယ့် ညီမျှမှု မရှိတဲ့ asynchronous ဥပမာပါ:

```js
const fs = require('node:fs');

fs.readFile('/file.md', (err, data) => {
  if (err) {
    throw err;
  }

  console.log(data);
});
moreWork(); // will run before console.log
```

အပေါ်က ပထမ ဥပမာမှာ `console.log` က `moreWork()` ထက် အရင်ခေါ်ခံရမှာပါ။ ဒုတိယ ဥပမာမှာတော့ `fs.readFile()` က **non-blocking** ဖြစ်လို့ JavaScript execution က ဆက်ပြီး run နိုင်ပြီး — `moreWork()` က အရင် ခေါ်ခံရမှာ ဖြစ်ပါတယ်။ File read ပြီးတာကို မစောင့်ဘဲ `moreWork()` ကို run နိုင်တာက — throughput ပိုမြင့်အောင် လုပ်ပေးနိုင်တဲ့ အဓိက design ရွေးချယ်မှုတစ်ခုပါ။

## Concurrency နဲ့ Throughput

Node.js မှာ JavaScript execution က single threaded ဖြစ်ပါတယ် — ဒါကြောင့် concurrency ဆိုတာက တခြားအလုပ်တွေ ပြီးတဲ့နောက်မှာ — event loop က JavaScript callback functions တွေကို execute လုပ်နိုင်တဲ့ စွမ်းရည်ကို ရည်ညွှန်းပါတယ်။ Concurrent ပုံစံနဲ့ run စေချင်တဲ့ code တိုင်းက — I/O လိုမျိုး non-JavaScript operations တွေ ဖြစ်ပေါ်နေစဉ်မှာလည်း event loop ကို ဆက်ပြီး run ခွင့်ပေးရပါမယ်။

ဥပမာအနေနဲ့ — web server တစ်ခုဆီက request တစ်ခုချင်းစီကို ပြီးဖို့ 50ms ကြာပြီး — အဲဒီ 50ms ထဲက 45ms က asynchronous လုပ်လို့ရတဲ့ database I/O ဖြစ်တယ်ဆိုပါစို့။ **Non-blocking** asynchronous operations တွေကို ရွေးသုံးခြင်းအားဖြင့် — request တစ်ခုချင်းစီရဲ့ 45ms ကို တခြား requests တွေ ကိုင်တွယ်ဖို့ လွတ်သွားစေပါတယ်။ **Blocking** methods တွေအစား **non-blocking** methods တွေကို ရွေးသုံးရုံနဲ့တင် capacity မှာ ဒီလောက် သိသာတဲ့ ကွာခြားချက် ဖြစ်ပေါ်လာတာပါ။

Event loop က concurrency အတွက် နောက်ထပ် threads တွေ ဖန်တီးနိုင်တဲ့ — တခြား language တွေမှာရှိတဲ့ models တွေနဲ့ မတူပါဘူး။

## Blocking နဲ့ Non-Blocking Code ရောနှောခြင်းရဲ့ အန္တရာယ်များ

I/O ကိုင်တွယ်တဲ့အခါ ရှောင်သင့်တဲ့ patterns တချို့ ရှိပါတယ်။ ဥပမာတစ်ခု ကြည့်ရအောင်:

```js
const fs = require('node:fs');

fs.readFile('/file.md', (err, data) => {
  if (err) {
    throw err;
  }

  console.log(data);
});
fs.unlinkSync('/file.md');
```

အပေါ်က ဥပမာမှာ `fs.unlinkSync()` က `fs.readFile()` ထက် အရင် run ဖြစ်နိုင်ခြေ များပါတယ် — ဒါဆိုရင် `file.md` ကို တကယ် မဖတ်ရသေးခင် ဖျက်ပစ်လိုက်တာ ဖြစ်သွားပါလိမ့်မယ်။ ဒါကို ပိုကောင်းတဲ့ နည်းနဲ့ ရေးရင် — လုံးဝ **non-blocking** ဖြစ်ပြီး မှန်ကန်တဲ့ order နဲ့ execute ဖြစ်မှာ အာမခံပါတယ်:

```js
const fs = require('node:fs');

fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) {
    throw readFileErr;
  }

  console.log(data);

  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) {
      throw unlinkErr;
    }
  });
});
```

အပေါ်က ဥပမာက `fs.readFile()` ရဲ့ callback ထဲမှာ `fs.unlink()` ကို **non-blocking** call အဖြစ် နေရာချထားလို့ — operations တွေရဲ့ order မှန်ကန်မှုကို အာမခံပေးပါတယ်။

## နောက်ထပ် အရင်းအမြစ်များ

- [libuv](https://libuv.org/)
