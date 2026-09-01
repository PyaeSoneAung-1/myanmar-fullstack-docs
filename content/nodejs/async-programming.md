---
title: "Async Programming"
description: "ဘာလို့ async programming က အရေးကြီးသလဲ၊ callback pattern၊ callback hell၊ Promise (then/catch, Promise.all) နဲ့ async/await သုံးနည်း"
order: 4
source: "https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks"
status: translated
updated: 2026-09-01
---

## Async Programming ဆိုတာ ဘာလဲ

Computer တွေက သဘာဝအလျောက် asynchronous ဖြစ်ပါတယ် — program တစ်ခုက အလုပ်တစ်ခု လုပ်နေတုန်း တခြားအရာတွေ ဆက်ဖြစ်နေနိုင်ပါတယ်။ JavaScript ကတော့ ပုံမှန်အားဖြင့် **synchronous** ဖြစ်ပြီး single-threaded ပါ — code တွေက အပေါ်ကနေ အောက်ကို တစ်ကြောင်းပြီးတစ်ကြောင်း run ပါတယ်။

ဒါပေမယ့် server programming မှာ အဓိက အလုပ်တွေက **I/O operations** — file ဖတ်တာ၊ network request လုပ်တာ၊ database query လုပ်တာတွေပါ။ ဒါတွေက မီလီစက္ကန့်တွေ၊ စက္ကန့်တွေ ကြာနိုင်ပြီး — synchronous ဆိုရင် အဲဒီအလုပ် ပြီးတဲ့အထိ program တစ်ခုလုံး ရပ်နေရပါမယ်။ **Non-blocking async** မှာတော့ အလုပ်ကို စလိုက်ပြီး ရလဒ်ကို စောင့်နေတုန်း တခြား code တွေ ဆက်ပြေးလို့ရပါတယ်။ ဒါကို ဘယ်လို လုပ်ပေးသလဲဆိုတာ [Event Loop](/docs/nodejs/event-loop) မှာ ကြည့်နိုင်ပါတယ်။

## Callback Pattern

Async ရဲ့ အခြေခံအကျဆုံး ပုံစံက **callback** ပါ — function တစ်ခုကို argument အနေနဲ့ တခြား function ဆီ ပို့ပြီး အလုပ်ပြီးတဲ့အခါ အဲဒီ callback ကို run ပေးတာပါ။ Node.js မှာ **error-first callback** ဆိုတဲ့ စံနှုန်း ရှိပါတယ် — callback ရဲ့ ပထမဆုံး argument က error object ဖြစ်ပြီး error မရှိရင် `null` ပါ:

```js
const fs = require('node:fs');

fs.readFile('/file.json', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(data);
});
```

`fs.readFile` က file ဖတ်တဲ့ အလုပ်ကို စပြီး — ပြီးတဲ့အခါ callback ကို run ပေးပါတယ်။ Error ဖြစ်ရင် `err` ထဲမှာ ပါလာလို့ `if (err)` နဲ့ စစ်ပြီး handle လုပ်ရပါတယ်။

## Callback Hell — callback တွေ အသိုက်အမြုံ ဖြစ်ခြင်း

Callback က ရိုးရှင်းတဲ့ အလုပ်တွေအတွက် ကောင်းပါတယ်။ ဒါပေမယ့် callback တစ်ခုချင်းစီက nesting တစ်ဆင့် ထပ်ဖြည့်ပေးလို့ — callback တွေ များလာတာနဲ့ code က ရှုပ်ထွေး သွားပါတယ်:

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // your code here
      });
    }, 2000);
  });
});
```

ဒါက nesting ၄ ဆင့်ပဲ ရှိပါသေးတယ် — ဒီထက်ပိုပြီး နက်တဲ့အခါ "callback hell" လို့ ခေါ်တဲ့ အခြေအနေ ဖြစ်လာပြီး ဖတ်ရတာ၊ ပြင်ရတာ အရမ်း ခက်ခဲပါတယ်။

## Promises — then နဲ့ catch

ES6 ကစပြီး JavaScript က **Promise** ကို မိတ်ဆက်ပေးခဲ့ပါတယ် — callback ရဲ့ nesting ပြဿနာကို ဖြေရှင်းဖို့ပါ။ Promise က အောင်မြင်ရင် `then` နဲ့၊ မအောင်မြင်ရင် `catch` နဲ့ ကိုင်တွယ်ပါတယ်:

```js
const fs = require('node:fs/promises');

// then/catch နဲ့ promise ကို သုံးခြင်း
fs.readFile('/file.json', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Promise.all — promise တွေကို တစ်ပြိုင်တည်း run ပြီး အားလုံးပြီးမှ ဆက်လုပ်ခြင်း
Promise.all([
  fs.readFile('/a.json', 'utf8'),
  fs.readFile('/b.json', 'utf8')
]).then(results => console.log(results));
```

`Promise.all` က promise တွေ အားလုံး အောင်မြင်မှ results array ကို ပြန်ပေးပြီး — တစ်ခုခု မအောင်မြင်ရင် `catch` ထဲ ရောက်သွားပါတယ်။

## Async/Await

ES2017 မှာ **`async`/`await`** syntax ရောက်လာပါတယ် — promise code ကို synchronous code လိုမျိုး ဖတ်ရလွယ်အောင် ရေးလို့ရတာပါ။ `async` function က promise ကို return ပေးပြီး — ထဲမှာ `await` နဲ့ promise ရဲ့ ရလဒ်ကို စောင့်ပါတယ်:

```js
const fs = require('node:fs/promises');

async function readConfig() {
  try {
    const data = await fs.readFile('/config.json', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

readConfig();
```

Async code ထဲမှာ error handle လုပ်ဖို့ — callback pattern မှာ `if (err)` သုံးသလိုမျိုး **`try/catch`** ကို သုံးပါတယ်။ `await` က promise reject ဖြစ်ရင် `catch` block ထဲကို ရောက်သွားပြီး — callback hell မရှိတော့ဘဲ code က ဖတ်ရ အရမ်း ရှင်းပါတယ်။

## ဆက်ဖတ်ရန်

- [Event Loop](/docs/nodejs/event-loop) — async code တွေကို ဘယ်လို စီစဉ် run ပေးသလဲ
- [File System](/docs/nodejs/file-system) — fs module နဲ့ file operations တွေ
- [Modules အခြေခံ](/docs/nodejs/modules) — code ကို module အဖြစ် စုစည်းခြင်း
