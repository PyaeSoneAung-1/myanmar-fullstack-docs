---
title: "File System"
description: "fs module နဲ့ file ဖတ်/ရေး/ထည့်ရေးနည်း၊ fs/promises API၊ folder စီမံခန့်ခွဲမှု၊ file watch နဲ့ path module"
order: 6
source: "https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs"
status: translated
updated: 2026-09-01
---

## fs Module ဆိုတာ

**`fs`** (file system) က Node.js ရဲ့ core module တစ်ခုပါ — file ဖတ်တာ၊ ရေးတာ၊ folder စီမံတာတွေ အားလုံး ဒီ module ကနေ လုပ်ပါတယ်။ Core module ဖြစ်လို့ install လုပ်စရာ မလိုဘဲ `require('node:fs')` လုပ်တာနဲ့ ချက်ချင်း သုံးလို့ရပါတယ် (module အကြောင်း [Modules အခြေခံ](/docs/nodejs/modules) မှာ ကြည့်နိုင်ပါတယ်)။ Method တိုင်းလိုလိုမှာ ပုံစံ သုံးမျိုး ရှိပါတယ်:

- **Async (callback)** — `fs.readFile` — non-blocking, I/O ပြီးတဲ့အခါ callback run
- **Sync** — `fs.readFileSync` — blocking, ပြီးတဲ့အထိ စောင့် (`try/catch` လိုအပ်)
- **Promises** — `fs/promises` module ကနေ — `await` နဲ့ သုံးလို့ရတဲ့ promise version

## File ဖတ်ခြင်း

File ဖတ်ဖို့ အရိုးရှင်းဆုံးက `fs.readFile()` ပါ — file path, encoding, callback ကို ပေးရပါတယ်:

```js
const fs = require('node:fs');

// async — callback နဲ့ ဖတ်ခြင်း
fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// sync — blocking version, try/catch လိုအပ်
try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

Async version က thread ကို မပိတ်ဆို့တာမို့ server မှာ သုံးသင့်ပြီး — sync version က startup မှာ config ဖတ်တာလိုမျိုး နေရာမျိုးမှာ အဆင်ပြေပါတယ်။ `'utf8'` encoding ပေးရင် string ရပြီး — မပေးရင် **Buffer** (byte array) ရပါတယ်။

## fs/promises API

`fs/promises` module ကနေ promise version တွေကို `await` နဲ့ သုံးလို့ရပြီး — `async` function နဲ့ `try/catch` တွဲသုံးတာ အခုခေတ်မှာ အသုံးအများဆုံး ပုံစံပါ:

```js
const fs = require('node:fs/promises');

async function example() {
  try {
    await fs.writeFile('/Users/joe/test.txt', 'Some content!');
    await fs.appendFile('/Users/joe/test.txt', ' more content');
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

example();
```

`fs.writeFile()` က file ကို ရေးပေးပြီး file ရှိပြီးသားဆိုရင် **အကြောင်းအရာကို အစားထိုး** ပါတယ်။ `fs.appendFile()` ကတော့ file ရဲ့ **အဆုံးမှာ ထပ်ဖြည့်** ပေးပါတယ် — log file လိုမျိုးတွေအတွက် အဆင်ပြေပါတယ်။ Write လုပ်တဲ့အခါ flag ပြောင်းချင်ရင် `{ flag: 'a+' }` လိုမျိုး ထည့်ပေးနိုင်ပြီး — file မရှိရင် ဖန်တီးပေးပြီး အဆုံးကနေ စရေးပါတယ်။

## Folder တွေနဲ့ အလုပ်လုပ်ခြင်း

Folder အသစ် ဖန်တီးတာ၊ folder ထဲက အကြောင်းအရာတွေ ဖတ်တာကိုလည်း `fs` ကနေပဲ လုပ်လို့ရပါတယ်:

```js
const fs = require('node:fs');

const folderName = '/Users/joe/test';

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

// readdir — folder ထဲက file/subfolder တွေရဲ့ အမည်တွေကို ရယူခြင်း
fs.readdirSync(folderName).forEach(fileName => {
  console.log(fileName);
});

// watch — file/folder အပြောင်းအလဲကို စောင့်ကြည့်ခြင်း
fs.watch(folderName, (eventType, filename) => {
  console.log(`event: ${eventType}, file: ${filename}`);
});
```

`fs.mkdir()` က folder အသစ် ဖန်တီးပေးပြီး `fs.readdir()` က folder ထဲက အရာတွေရဲ့ အမည်စာရင်း ပြန်ပေးပါတယ်။ **`fs.watch()`** ကတော့ file ဒါမှမဟုတ် folder ပြောင်းလဲတာကို စောင့်ကြည့်ပေးပါတယ် — ဒါပေမယ့် platform အလိုက် အပြုအမူ ကွဲပြားနိုင်လို့ production မှာ ပိုစိတ်ချရတဲ့ library (ဥပမာ chokidar) သုံးတာ ပိုကောင်းပါတယ်။

## path Module

File path တွေက platform အလိုက် ကွဲပြားပါတယ် — Linux/macOS မှာ `/users/joe/file.txt`, Windows မှာ `C:\users\joe\file.txt` ပုံစံပါ။ **`path`** module က path တွေကို platform မရွေး တစ်ပြေးညီ ကိုင်တွယ်ပေးပါတယ်:

```js
const path = require('node:path');

const notes = '/users/joe/notes.txt';

path.dirname(notes); // /users/joe
path.basename(notes); // notes.txt
path.extname(notes); // .txt
path.join('/', 'users', 'joe', 'notes.txt'); // /users/joe/notes.txt
path.resolve('joe.txt'); // cwd + joe.txt (absolute path)
```

- **`path.join()`** — path အပိုင်းတွေကို ဆက်စပ်ပေးတယ် (separator တွေကို အလိုအလျောက် စီမံပေးတယ်)
- **`path.resolve()`** — relative path ကနေ absolute path တွက်ပေးတယ်
- **`path.basename()`** — file name အပိုင်း ထုတ်ပေးတယ်

သတိထားရမှာ — `join` ရော `resolve` ရော **path ရှိမရှိ စစ်ပေးတာ မဟုတ်ပါဘူး**။ သူတို့က ရှိပြီးသား အချက်အလက်ပေါ်မူတည်ပြီး path ကို တွက်ချက်ပေးရုံပဲ ဖြစ်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Async Programming](/docs/nodejs/async-programming) — callback/promise/async-await ကွာခြားပုံ
- [Event Loop](/docs/nodejs/event-loop) — I/O operation တွေကို ဘယ်လို စီမံပေးသလဲ
- [Modules အခြေခံ](/docs/nodejs/modules) — fs ကို module အနေနဲ့ import လုပ်ခြင်း
