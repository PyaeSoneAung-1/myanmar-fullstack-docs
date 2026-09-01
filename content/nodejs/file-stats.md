---
title: "Node.js file stats"
description: "fs.stat() / fs.statSync() နဲ့ file အချက်အလက်များ ရယူနည်း — isFile()/isDirectory()/isSymbolicLink() နဲ့ stats.size သုံးနည်း"
order: 11
source: "https://nodejs.org/en/learn/manipulating-files/nodejs-file-stats"
status: translated
updated: 2026-09-01
---

## Node.js file stats

File တိုင်းမှာ Node.js သုံးပြီး စစ်ဆေးလို့ရတဲ့ အချက်အလက် အစုံအလင် ပါဝင်ပါတယ် — အထူးသဖြင့် [`fs` module](https://nodejs.org/api/fs.html) က ပေးတဲ့ `stat()` method ကို သုံးပြီး စစ်ဆေးနိုင်ပါတယ်။

File path တစ်ခုကို ပေးပြီး ခေါ်လိုက်ရင် — Node.js က file အချက်အလက်တွေ ရတာနဲ့ သင်ပေးထားတဲ့ callback function ကို parameter ၂ ခုနဲ့ ခေါ်ပါတယ်: error message တစ်ခု၊ နဲ့ file stats တွေပါ:

```cjs
const fs = require('node:fs');

fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err);
  }
  // `stats` ထဲမှာ file stats တွေကို ဝင်ရောက်ကြည့်လို့ရပါတယ်
});
```

Node.js က sync method တစ်ခုလည်း ပေးပါတယ် — file stats အဆင်သင့် မဖြစ်မချင်း thread ကို ပိတ်ဆို့ထားပါတယ်:

```cjs
const fs = require('node:fs');

try {
  const stats = fs.statSync('/Users/joe/test.txt');
} catch (err) {
  console.error(err);
}
```

File အချက်အလက်တွေက stats variable ထဲမှာ ပါဝင်ပါတယ်။ stats ကနေ ဘယ်လို အချက်အလက်တွေ ထုတ်ယူနိုင်သလဲ?

**အများကြီး ရှိပါတယ်၊ ဥပမာ:**

- file လား directory လားဆိုတာ — `stats.isFile()` နဲ့ `stats.isDirectory()` သုံးပြီး စစ်နိုင်ပါတယ်
- symbolic link လားဆိုတာ — `stats.isSymbolicLink()` နဲ့ စစ်နိုင်ပါတယ်
- file ရဲ့ byte အရွယ်အစားကို `stats.size` နဲ့ ရနိုင်ပါတယ်

နောက်ထပ် advanced methods တွေလည်း ရှိပါသေးတယ် — ဒါပေမယ့် နေ့စဉ် programming မှာ သင်အများဆုံး သုံးနေကျကတော့ ဒါတွေပါပဲ။

```cjs
const fs = require('node:fs');

fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  stats.isFile(); // true
  stats.isDirectory(); // false
  stats.isSymbolicLink(); // false
  console.log(stats.size); // 1024000 //= 1MB
});
```

ကြိုက်ရင် `fs/promises` module က ပေးတဲ့ promise-based `fsPromises.stat()` method ကိုလည်း သုံးနိုင်ပါတယ်:

```cjs
const fs = require('node:fs/promises');

async function example() {
  try {
    const stats = await fs.stat('/Users/joe/test.txt');
    stats.isFile(); // true
    stats.isDirectory(); // false
    stats.isSymbolicLink(); // false
    console.log(stats.size); // 1024000 //= 1MB
  } catch (err) {
    console.log(err);
  }
}
example();
```

`fs` module အကြောင်း အသေးစိတ်ကို [official documentation](https://nodejs.org/api/fs.html) မှာ ဖတ်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [File System](/docs/nodejs/file-system) — fs module နဲ့ file operations တွေ
- [Node.js နဲ့ file ရေးသားခြင်း](/docs/nodejs/writing-files) — file ရေးနည်းနဲ့ flags တွေ
