---
title: "File ဖတ်ခြင်း (Reading Files)"
description: "fs.readFile(), fs.readFileSync() နဲ့ fsPromises.readFile() သုံးပြီး file ဖတ်နည်း — callback/sync/promise ပုံစံများ၊ file အကြီးကြီးတွေကို memory သက်သာအောင် stream နဲ့ ဖတ်ခြင်း"
order: 25
source: "https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs"
status: translated
updated: 2026-09-02
---

## File တစ်ခုကို ဖတ်ခြင်း

Node.js မှာ file ဖတ်ဖို့ အရိုးရှင်းဆုံး နည်းကတော့ **`fs.readFile()`** method ကို သုံးတာပါ — file path, encoding နဲ့ callback function ကို ထည့်ပေးရပါတယ်။ File ဖတ်ပြီးတဲ့အခါ callback ကို error (`err`) နဲ့ file data (`data`) တို့နဲ့အတူ ခေါ်ပေးပါတယ်:

```cjs
const fs = require('node:fs');

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

```mjs
import fs from 'node:fs';

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

## Synchronously ဖတ်ခြင်း — fs.readFileSync

တစ်နည်းအားဖြင့် synchronous version ဖြစ်တဲ့ `fs.readFileSync()` ကိုလည်း သုံးနိုင်ပါတယ်။ ဒီ method က data ပြန်မရခင် စောင့်ဆိုင်းထားတာမို့ — error ဖြစ်ရင် throw လုပ်တဲ့အတွက် `try/catch` နဲ့ ဖမ်းဖို့ လိုပါတယ်:

```cjs
const fs = require('node:fs');

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

```mjs
import fs from 'node:fs';

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

## Promise-based ဖတ်ခြင်း — fsPromises.readFile

`fs/promises` module က ပေးတဲ့ promise-based `fsPromises.readFile()` method ကိုလည်း သုံးနိုင်ပါတယ်။ `async` function ထဲမှာ `await` လုပ်ပြီး `try/catch` နဲ့ error ကို ကိုင်တွယ်တဲ့ ပုံစံ — ခေတ်အရဆုံး အရေးအသားလည်း ဖြစ်ပါတယ်:

```cjs
const fs = require('node:fs/promises');

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
example();
```

```mjs
import fs from 'node:fs/promises';

try {
  const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
  console.log(data);
} catch (err) {
  console.error(err);
}
```

## File အကြီးကြီးတွေကို Stream နဲ့ ဖတ်ခြင်း

အပေါ်က method သုံးခုစလုံး — `fs.readFile()`, `fs.readFileSync()` နဲ့ `fsPromises.readFile()` — က data ပြန်မပို့ခင် file တစ်ခုလုံးရဲ့ အကြောင်းအရာကို memory ထဲ အရင်ဖတ်သိမ်းပါတယ်။

ဆိုလိုတာက file ကြီးကြီးတွေ ဆိုရင် program ရဲ့ **memory သုံးစွဲမှု** နဲ့ **execution မြန်နှုန်း** ကို သိသိသာသာ ထိခိုက်စေနိုင်ပါတယ်။

ဒီလိုအခါမျိုးမှာ ပိုကောင်းတဲ့ ရွေးချယ်မှုကတော့ file content ကို **stream** နဲ့ ဖတ်တာပါ — chunk တွေ အလိုက် ဖတ်လို့ memory ပိုသက်သာပါတယ်။ အောက်က ဥပမာကို ကြည့်ပါ — ဒီ script က ဝတ္ထုကြီးတစ်ပုဒ် (Moby Dick) ကို internet ကနေ ဒေါင်းလုဒ်ဆွဲပြီး file ထဲ သိမ်းကာ နောက်ဆုံးမှာ chunk လိုက် ပြန်ဖတ်ပြသပါတယ်:

```mjs
import fs from 'fs';
import { pipeline } from 'node:stream/promises';
import path from 'path';

const fileUrl = 'https://www.gutenberg.org/files/2701/2701-0.txt';
const outputFilePath = path.join(process.cwd(), 'moby.md');

async function downloadFile(url, outputPath) {
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    // consuming the response body is mandatory: https://undici.nodejs.org/#/?id=garbage-collection
    await response.body?.cancel();
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  console.log(`Downloading file from ${url} to ${outputPath}`);

  await pipeline(response.body, fileStream);
  console.log('File downloaded successfully');
}

async function readFile(filePath) {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

  try {
    for await (const chunk of readStream) {
      console.log('--- File chunk start ---');
      console.log(chunk);
      console.log('--- File chunk end ---');
    }
    console.log('Finished reading the file.');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
}

try {
  await downloadFile(fileUrl, outputFilePath);
  await readFile(outputFilePath);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
```

ဒီဥပမာမှာ `fetch` ရဲ့ response body ကို `pipeline` နဲ့ file ထဲ တိုက်ရိုက်ရေးပြီး — ဖတ်တဲ့အခါမှာလည်း `for await...of` loop နဲ့ chunk တစ်ခုချင်းစီ လက်ခံပါတယ်။ File တစ်ခုလုံးကို memory ထဲ တစ်ခါတည်း မထည့်တာမို့ file ဘယ်လောက်ကြီးကြီး ကိုင်တွယ်လို့ရပါတယ်။ Streams အကြောင်း အသေးစိတ်ကို [Streams အသုံးပြုခြင်း](/docs/nodejs/how-to-use-streams) နဲ့ [Backpressure သဘောတရား](/docs/nodejs/backpressuring-in-streams) မှာ ဆက်ဖတ်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Node.js နဲ့ file ရေးသားခြင်း](/docs/nodejs/writing-files) — file တွေ ရေးသားခြင်းနဲ့ append လုပ်ခြင်း
- [Node.js မှာ Folders တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/nodejs/working-with-folders) — folder အကြောင်းအရာတွေ ဖတ်ခြင်း
- [File System](/docs/nodejs/file-system) — fs module အသေးစိတ်
- [Streams အသုံးပြုခြင်း](/docs/nodejs/how-to-use-streams) — data အမြောက်အများကို chunk လိုက် ကိုင်တွယ်ခြင်း
