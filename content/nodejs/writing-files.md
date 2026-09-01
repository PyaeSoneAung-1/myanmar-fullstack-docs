---
title: "Node.js နဲ့ file ရေးသားခြင်း"
description: "fs.writeFile() နဲ့ file ရေးနည်း — sync/promise versions၊ flags (r+, w+, a, a+) အသုံးပြုပုံ နဲ့ fs.appendFile() နဲ့ content ထပ်ဖြည့်နည်း"
order: 10
source: "https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs"
status: translated
updated: 2026-09-01
---

## File တစ်ခု ရေးသားခြင်း

Node.js မှာ file တွေကို ရေးဖို့ အလွယ်ဆုံး နည်းကတော့ `fs.writeFile()` API ကို သုံးတာပါ။

```cjs
const fs = require('node:fs');

const content = 'Some content!';

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err);
  } else {
    // file ကို အောင်မြင်စွာ ရေးပြီးပါပြီ
  }
});
```

### File ကို synchronously ရေးသားခြင်း

တနည်းအားဖြင့် synchronous version ဖြစ်တဲ့ `fs.writeFileSync()` ကိုလည်း သုံးနိုင်ပါတယ်:

```cjs
const fs = require('node:fs');

const content = 'Some content!';

try {
  fs.writeFileSync('/Users/joe/test.txt', content);
  // file ကို အောင်မြင်စွာ ရေးပြီးပါပြီ
} catch (err) {
  console.error(err);
}
```

`fs/promises` module က ပေးတဲ့ promise-based `fsPromises.writeFile()` method ကိုလည်း သုံးနိုင်ပါတယ်:

```cjs
const fs = require('node:fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.writeFile('/Users/joe/test.txt', content);
  } catch (err) {
    console.log(err);
  }
}

example();
```

ပုံမှန်အားဖြင့် ဒီ API က file ရှိပြီးသားဆိုရင် **file ရဲ့ အကြောင်းအရာကို အစားထိုး** ပါတယ်။

**flag တစ်ခု သတ်မှတ်ပြီး ဒီ default ကို ပြောင်းလဲနိုင်ပါတယ်:**

```js
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {});
```

#### သင်ဖြစ်နိုင်ခြေ အများဆုံး သုံးမယ့် flags တွေက

| Flag | Description | File gets created if it doesn't exist |
| ---- | ----------- | ------------------------------------ |
| `r+` | ဒီ flag က file ကို **ဖတ်ရန်** နဲ့ **ရေးရန်** အတွက် ဖွင့်ပေးပါတယ် | ❌ |
| `w+` | ဒီ flag က file ကို **ဖတ်ရန်** နဲ့ **ရေးရန်** အတွက် ဖွင့်ပေးပြီး stream ကို file ရဲ့ **အစ** မှာ ထားပေးပါတယ် | ✅ |
| `a` | ဒီ flag က file ကို **ရေးရန်** အတွက် ဖွင့်ပေးပြီး stream ကို file ရဲ့ **အဆုံး** မှာ ထားပေးပါတယ် | ✅ |
| `a+` | ဒီ flag က file ကို **ဖတ်ရန်** နဲ့ **ရေးရန်** အတွက် ဖွင့်ပေးပြီး stream ကို file ရဲ့ **အဆုံး** မှာ ထားပေးပါတယ် | ✅ |

- Flags တွေအကြောင်း အသေးစိတ်ကို [fs documentation](https://nodejs.org/api/fs.html#file-system-flags) မှာ ဖတ်နိုင်ပါတယ်။

## File တစ်ခုထဲ content ထပ်ဖြည့်ခြင်း

File တစ်ခုကို content အသစ်နဲ့ အစားထိုးမယ့်အစား — ရှိပြီးသား content ပေါ်မှာ ထပ်ဖြည့်ချင်တဲ့အခါ appending က အသုံးဝင်ပါတယ်။

### ဥပမာများ

File ရဲ့ အဆုံးမှာ content ထပ်ဖြည့်ဖို့ အဆင်ပြေတဲ့ method ကတော့ `fs.appendFile()` (နဲ့ သူ့ရဲ့ `fs.appendFileSync()` counterpart) ပါ:

```cjs
const fs = require('node:fs');

const content = 'Some content!';

fs.appendFile('file.log', content, err => {
  if (err) {
    console.error(err);
  } else {
    // ပြီးပါပြီ!
  }
});
```

#### Promises နဲ့ ဥပမာ

ဒီမှာ `fsPromises.appendFile()` ဥပမာတစ်ခုပါ:

```cjs
const fs = require('node:fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.appendFile('/Users/joe/test.txt', content);
  } catch (err) {
    console.log(err);
  }
}

example();
```

## ဆက်ဖတ်ရန်

- [File System](/docs/nodejs/file-system) — fs module နဲ့ file operations တွေ
- [Async Programming](/docs/nodejs/async-programming) — callback/promise/async-await ကွာခြားပုံ
