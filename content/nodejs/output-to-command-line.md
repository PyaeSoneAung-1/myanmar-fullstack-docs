---
title: "Node.js နဲ့ Command Line ဆီ Output ထုတ်ခြင်း"
description: "console.log ဖြင့် အခြေခံ output ထုတ်ခြင်း၊ format specifiers (%s, %d, %i, %o)၊ console.clear()/count()/countReset()/trace()/time() နဲ့ timeEnd()၊ stdout/stderr ကွာခြားပုံ၊ node:util ရဲ့ styleText ဖြင့် text အရောင်ခြယ်ခြင်း"
order: 16
source: "https://nodejs.org/en/learn/command-line/output-to-the-command-line-using-nodejs"
status: translated
updated: 2026-09-01
---

## Console Module နဲ့ အခြေခံ Output

Node.js မှာ command line နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ အသုံးဝင်တဲ့ နည်းလမ်းတွေ အများကြီး ပေးတဲ့ `console` module တစ်ခု ပါဝင်ပါတယ်။

ဒါက browser ထဲမှာ တွေ့ရတဲ့ `console` object နဲ့ အခြေခံအားဖြင့် အတူတူပါပဲ။

အခြေခံအကျဆုံး နဲ့ အသုံးအများဆုံး method ကတော့ — သင်ပေးလိုက်တဲ့ string ကို console ဆီ print လုပ်ပေးတဲ့ `console.log()` ပါ။

Object တစ်ခု ပေးရင် — သူ့ကို string အနေနဲ့ ဖော်ပြပေးပါတယ်။

`console.log` ဆီ variable အများကြီးကိုလည်း ပေးနိုင်ပါတယ်။ ဥပမာ:

```js
const x = 'x';
const y = 'y';

console.log(x, y);
```

ဒါဆိုရင် Node.js က နှစ်ခုလုံးကို print လုပ်ပေးပါလိမ့်မယ်။

Variables တွေနဲ့ format specifier တစ်ခုကို ပေးပြီး — လှပတဲ့ phrases တွေကိုလည်း format လုပ်နိုင်ပါတယ်။

ဥပမာ:

```js
console.log('My %s has %d ears', 'cat', 2);
```

- `%s` က variable တစ်ခုကို string အနေနဲ့ format လုပ်ပေးပါတယ်
- `%d` က variable တစ်ခုကို number အနေနဲ့ format လုပ်ပေးပါတယ်
- `%i` က variable တစ်ခုကို သူ့ရဲ့ integer အပိုင်းတစ်ခုတည်း အနေနဲ့ format လုပ်ပေးပါတယ်
- `%o` က variable တစ်ခုကို object အနေနဲ့ format လုပ်ပေးပါတယ်

ဥပမာ:

```js
console.log('%o', Number);
```

## Console ကို ရှင်းလင်းခြင်း

`console.clear()` က console ကို ရှင်းလင်းပေးပါတယ် (ဒီအပြုအမူက သုံးနေတဲ့ console ပေါ် မူတည်နိုင်ပါတယ်)

## Element တွေ ရေတွက်ခြင်း

`console.count()` က အဆင်ပြေတဲ့ method တစ်ခုပါ။

ဒီ code ကို ကြည့်ပါ:

```js
const x = 1;
const y = 2;
const z = 3;

console.count(
  'The value of x is ' + x + ' and has been checked .. how many times?'
);

console.count(
  'The value of x is ' + x + ' and has been checked .. how many times?'
);

console.count(
  'The value of y is ' + y + ' and has been checked .. how many times?'
);
```

ဖြစ်ပျက်တာက — `console.count()` က string တစ်ခု ဘယ်နှစ်ကြိမ် print ဖြစ်ခဲ့လဲ ရေတွက်ပြီး — count ကို သူ့ဘေးမှာ print လုပ်ပေးပါတယ်:

Oranges နဲ့ apples တွေကိုလည်း ရေတွက်ကြည့်နိုင်ပါတယ်:

```js
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];

oranges.forEach(fruit => {
  console.count(fruit);
});
apples.forEach(fruit => {
  console.count(fruit);
});
```

## ရေတွက်မှု ပြန်စခြင်း

`console.countReset()` method က `console.count()` နဲ့ သုံးထားတဲ့ counter ကို ပြန်စ (reset) ပေးပါတယ်။

ဒါကို ပြသဖို့ apples နဲ့ oranges ဥပမာကို သုံးပါမယ်။

```js
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];

oranges.forEach(fruit => {
  console.count(fruit);
});
apples.forEach(fruit => {
  console.count(fruit);
});

console.countReset('orange');

oranges.forEach(fruit => {
  console.count(fruit);
});
```

`console.countReset('orange')` ခေါ်လိုက်တာက value counter ကို သုညအထိ ပြန်စပေးတာကို သတိပြုပါ။

## Stack Trace Print လုပ်ခြင်း

Function တစ်ခုရဲ့ call stack trace ကို print လုပ်ချင်တဲ့ အခြေအနေတွေ ရှိနိုင်ပါတယ် — ဥပမာ *ဒီ code အပိုင်းကို ဘယ်လို ရောက်လာတာလဲ?* ဆိုတဲ့ မေးခွန်းကို ဖြေဖို့ ဆိုရင် ဖြစ်ပါတယ်။

ဒါကို `console.trace()` သုံးပြီး လုပ်နိုင်ပါတယ်:

```js
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

ဒါက stack trace ကို print လုပ်ပေးပါလိမ့်မယ်။ ဒါက Node.js REPL ထဲမှာ စမ်းကြည့်ရင် print ဖြစ်ထွက်လာမယ့်အရာပါ:

```
Trace
    at function2 (repl:1:33)
    at function1 (repl:1:25)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:44:33)
    at REPLServer.defaultEval (repl.js:239:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:440:10)
    at emitOne (events.js:120:20)
    at REPLServer.emit (events.js:210:7)
```

## အချိန် ကုန်ဆုံးမှု တွက်ချက်ခြင်း

Function တစ်ခု run ဖို့ အချိန်ဘယ်လောက် ကြာလဲ — `time()` နဲ့ `timeEnd()` သုံးပြီး လွယ်လွယ်ကူကူ တွက်ချက်နိုင်ပါတယ်

```js
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
  console.time('doSomething()');
  // do something, and measure the time it takes
  doSomething();
  console.timeEnd('doSomething()');
};
measureDoingSomething();
```

## Stdout နဲ့ Stderr

အပေါ်မှာ မြင်ခဲ့သလို — console.log က Console ထဲမှာ messages တွေ print လုပ်ဖို့ အကောင်းဆုံးပါ။ ဒါကို standard output ဒါမှမဟုတ် `stdout` လို့ ခေါ်ပါတယ်။

`console.error` ကတော့ `stderr` stream ဆီ print လုပ်ပေးပါတယ်။

ဒါက console ထဲမှာ ပေါ်လာမှာ ဖြစ်ပေမယ့် — ပုံမှန် output ကနေ သီးခြားစီ ကိုင်တွယ်နိုင်ပါတယ်။

## Output ကို အရောင်ခြယ်ခြင်း

**NOTE**
ဒီအပိုင်းကို version 22.11 ကို ရည်ရွယ်ပြီး ရေးထားတာဖြစ်ပြီး — `styleText` ကို 'Active development' အဆင့်မှာ ရှိကြောင်း မှတ်သားထားပါတယ်။

အများစုမှာ — terminal မှာ လှပတဲ့ output ရဖို့ text တချို့ကို paste လုပ်ချင်စိတ် ဖြစ်တတ်ပါတယ်။

`node:util` module က ပေးတဲ့ `styleText` function ဆိုတာ ရှိပါတယ်။ ဘယ်လို သုံးရမလဲ ရှာဖွေကြည့်ရအောင်။

ပထမဆုံး — `node:util` module ကနေ `styleText` function ကို import လုပ်ရပါတယ်:

```js
import { styleText } from 'node:util';
```

ပြီးတော့ သင့် text ကို style လုပ်ဖို့ ဒီလို သုံးနိုင်ပါတယ်:

```js
console.log(
  styleText(['red'], 'This is red text ') +
    styleText(['green', 'bold'], 'and this is green bold text ') +
    'this is normal text'
);
```

ပထမ argument က styles တွေရဲ့ array တစ်ခုဖြစ်ပြီး ဒုတိယ argument က style လုပ်ချင်တဲ့ text ပါ။ နောက်ထပ် အသေးစိတ်တွေကို [docs](https://nodejs.org/api/util.html#util_styletext_color_format_args) မှာ ဖတ်ဖို့ ဖိတ်ခေါ်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Accept Input from the Command Line](/docs/nodejs/accept-input-from-command-line) — readline နဲ့ command line input လက်ခံခြင်း
- [Run Node.js Scripts](/docs/nodejs/run-nodejs-scripts) — command line ကနေ Node.js scripts run လုပ်ခြင်း
