---
title: "Node.js မှာ Folders တွေနဲ့ အလုပ်လုပ်ခြင်း"
description: "folder ရှိမရှိ စစ်ဆေးခြင်း (fs.access/existsSync)၊ folder ဖန်တီးခြင်း (fs.mkdir)၊ directory content ဖတ်ခြင်း (fs.readdir)၊ folder rename နဲ့ ဖျက်ခြင်း (fs.rename, fs.rmdir, fs.rm) — sync/promise versions အပါအဝင်"
order: 15
source: "https://nodejs.org/en/learn/manipulating-files/working-with-folders-in-nodejs"
status: translated
updated: 2026-09-01
---

Node.js ရဲ့ `fs` core module မှာ folders တွေနဲ့ အလုပ်လုပ်ဖို့ သုံးလို့ရတဲ့ အဆင်ပြေတဲ့ methods တွေ အများကြီး ပါဝင်ပါတယ်။

## Folder တစ်ခု ရှိမရှိ စစ်ဆေးခြင်း

Folder တစ်ခု ရှိမရှိ နဲ့ Node.js က သူ့ရဲ့ permissions တွေနဲ့ ဝင်ရောက်နိုင်မနိုင် စစ်ဆေးဖို့ — `fs.access()` (နဲ့ သူ့ရဲ့ promise-based counterpart ဖြစ်တဲ့ `fsPromises.access()`) ကို သုံးပါ။

## Folder အသစ် ဖန်တီးခြင်း

Folder အသစ် တစ်ခု ဖန်တီးဖို့ — `fs.mkdir()` ဒါမှမဟုတ် `fs.mkdirSync()` ဒါမှမဟုတ် `fsPromises.mkdir()` ကို သုံးပါ။

```cjs
const fs = require('node:fs');

const folderName = '/Users/joe/test';

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}
```

## Directory တစ်ခုရဲ့ Content ဖတ်ခြင်း

Directory တစ်ခုရဲ့ contents တွေကို ဖတ်ဖို့ — `fs.readdir()` ဒါမှမဟုတ် `fs.readdirSync()` ဒါမှမဟုတ် `fsPromises.readdir()` ကို သုံးပါ။

ဒီ code က folder တစ်ခုရဲ့ content — files ရော subfolders ရော နှစ်ခုလုံးကို ဖတ်ပြီး သူတို့ရဲ့ relative path တွေကို ပြန်ပေးပါတယ်:

```cjs
const fs = require('node:fs');

const folderPath = '/Users/joe';

fs.readdirSync(folderPath);
```

Full path ကိုလည်း ရယူနိုင်ပါတယ်:

```js
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Files တွေကိုပဲ ပြန်ပေးဖို့ — folders တွေကို ဖယ်ထုတ်ပြီး — results တွေကို filter လုပ်နိုင်ပါတယ်:

```cjs
const fs = require('node:fs');

const isFile = fileName => {
  return fs.lstatSync(fileName).isFile();
};

fs.readdirSync(folderPath)
  .map(fileName => {
    return path.join(folderPath, fileName);
  })
  .filter(isFile);
```

## Folder တစ်ခု Rename လုပ်ခြင်း

Folder rename လုပ်ဖို့ — `fs.rename()` ဒါမှမဟုတ် `fs.renameSync()` ဒါမှမဟုတ် `fsPromises.rename()` ကို သုံးပါ။ ပထမ parameter က လက်ရှိ path ဖြစ်ပြီး ဒုတိယ parameter က path အသစ် ဖြစ်ပါတယ်:

```cjs
const fs = require('node:fs');

fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
  // done
});
```

`fs.renameSync()` ကတော့ synchronous version ပါ:

```cjs
const fs = require('node:fs');

try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` ကတော့ promise-based version ပါ:

```cjs
const fs = require('node:fs/promises');

async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```

## Folder တစ်ခု ဖျက်ခြင်း

Folder တစ်ခု ဖျက်ဖို့ — `fs.rmdir()` ဒါမှမဟုတ် `fs.rmdirSync()` ဒါမှမဟုတ် `fsPromises.rmdir()` ကို သုံးပါ။

```cjs
const fs = require('node:fs');

fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }

  console.log(`${dir} is deleted!`);
});
```

Content တွေ ပါနေတဲ့ folder တစ်ခုကို ဖျက်ဖို့ — `fs.rm()` ကို `{ recursive: true }` option နဲ့ သုံးပြီး contents တွေကို recursively ဖျက်နိုင်ပါတယ်။

`{ recursive: true, force: true }` ဆိုရင်တော့ folder မရှိဘူးဆိုရင် exceptions တွေကို လျစ်လျူရှုသွားမှာ ဖြစ်ပါတယ်။

```cjs
const fs = require('node:fs');

fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }

  console.log(`${dir} is deleted!`);
});
```

## ဆက်ဖတ်ရန်

- [File System](/docs/nodejs/file-system) — fs module နဲ့ file operations တွေ
- [Node.js File Paths](/docs/nodejs/nodejs-file-paths) — path တွေနဲ့ အလုပ်လုပ်ခြင်း (join, resolve, normalize)
