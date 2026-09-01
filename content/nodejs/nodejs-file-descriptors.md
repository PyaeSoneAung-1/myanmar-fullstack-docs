---
title: "Node.js မှာ File Descriptors တွေနဲ့ အလုပ်လုပ်ခြင်း"
description: "file descriptor ဆိုတာ ဘာလဲ၊ fs.open()/fs.openSync()/fsPromises.open() နဲ့ file ဖွင့်နည်း၊ flags (r, r+, w+, a, a+) အသုံးပြုပုံ နဲ့ util.promisify အသုံးပြုပုံ"
order: 14
source: "https://nodejs.org/en/learn/manipulating-files/working-with-file-descriptors-in-nodejs"
status: translated
updated: 2026-09-01
---

## File Descriptor ဆိုတာ ဘာလဲ

သင့် filesystem ထဲမှာ ရှိတဲ့ file တစ်ခုနဲ့ အပြန်အလှန် ဆက်သွယ်နိုင်ဖို့ — ပထမဆုံး file descriptor တစ်ခုကို ရယူရပါတယ်။

File descriptor ဆိုတာ ဖွင့်ထားတဲ့ file တစ်ခုကို ရည်ညွှန်းတဲ့ reference တစ်ခုပါ — `fs` module က ပေးတဲ့ `open()` method နဲ့ file ကို ဖွင့်တဲ့အခါ ပြန်ပေးတဲ့ ဂဏန်း (fd) ဖြစ်ပါတယ်။ ဒီဂဏန်း (`fd`) က operating system ထဲမှာ ဖွင့်ထားတဲ့ file တစ်ခုကို တမူထူးခြားစွာ (uniquely) ခွဲခြားသတ်မှတ်ပေးပါတယ်:

```cjs
const fs = require('node:fs');

fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd က ကျွန်တော်တို့ရဲ့ file descriptor ပါ
});
```

`fs.open()` ခေါ်တဲ့အခါ ဒုတိယ parameter အနေနဲ့ သုံးထားတဲ့ `r` ကို သတိပြုပါ။

ဒီ flag က file ကို ဖတ်ရန် (reading) အတွက် ဖွင့်တယ်လို့ ဆိုလိုပါတယ်။

**သင်ဖြစ်နိုင်ခြေ အများဆုံး သုံးမယ့် တခြား flags တွေက:**

| Flag | Description | File gets created if it doesn't exist |
| ---- | ----------- | ------------------------------------ |
| `r+` | ဒီ flag က file ကို **ဖတ်ရန်** နဲ့ **ရေးရန်** အတွက် ဖွင့်ပေးပါတယ် | ❌ |
| `w+` | ဒီ flag က file ကို **ဖတ်ရန်** နဲ့ **ရေးရန်** အတွက် ဖွင့်ပေးပြီး stream ကို file ရဲ့ **အစ** မှာ ထားပေးပါတယ် | ✅ |
| `a` | ဒီ flag က file ကို **ရေးရန်** အတွက် ဖွင့်ပေးပြီး stream ကို file ရဲ့ **အဆုံး** မှာ ထားပေးပါတယ် | ✅ |
| `a+` | ဒီ flag က file ကို **ဖတ်ရန်** နဲ့ **ရေးရန်** အတွက် ဖွင့်ပေးပြီး stream ကို file ရဲ့ **အဆုံး** မှာ ထားပေးပါတယ် | ✅ |

`fs.openSync` method ကိုလည်း သုံးပြီး file ဖွင့်နိုင်ပါတယ် — ဒါက callback ထဲမှာ ပေးမယ့်အစား file descriptor ကို တိုက်ရိုက် ပြန်ပေးပါတယ်:

```cjs
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

File descriptor ရပြီဆိုတာနဲ့ — ဘယ်နည်းနဲ့ ရရ ရ — `fs.close()` ခေါ်တာလိုမျိုး သူ့ကို လိုအပ်တဲ့ operations တွေကို လုပ်ဆောင်နိုင်ပြီး — filesystem နဲ့ အပြန်အလှန် ဆက်သွယ်တဲ့ အခြား operations တွေ အများကြီးလည်း ရှိပါသေးတယ်။

`fs/promises` module က ပေးတဲ့ promise-based `fsPromises.open` method ကိုလည်း သုံးပြီး file ဖွင့်နိုင်ပါတယ်။

`fs/promises` module က Node.js v14 ကစပြီးမှသာ ရနိုင်ပါတယ်။ v14 မတိုင်ခင် — v10 နောက်ပိုင်းဆိုရင် `require('fs').promises` ကို သုံးနိုင်ပါတယ်။ v10 မတိုင်ခင် — v8 နောက်ပိုင်းဆိုရင် `util.promisify` ကို သုံးပြီး `fs` methods တွေကို promise-based methods တွေ အဖြစ် ပြောင်းလဲနိုင်ပါတယ်။

```cjs
const fs = require('node:fs/promises');
// Or const fs = require('fs').promises before v14.
async function example() {
  let filehandle;
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    if (filehandle) {
      await filehandle.close();
    }
  }
}
example();
```

ဒီမှာ `util.promisify` ရဲ့ ဥပမာတစ်ခုပါ:

```cjs
const fs = require('node:fs');
const util = require('node:util');

async function example() {
  const open = util.promisify(fs.open);
  const fd = await open('/Users/joe/test.txt', 'r');
}
example();
```

`fs/promises` module အကြောင်း အသေးစိတ်ကို [fs/promises API](https://nodejs.org/api/fs.html#promises-api) မှာ ကြည့်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [File System](/docs/nodejs/file-system) — fs module နဲ့ file operations တွေ
- [Writing Files](/docs/nodejs/writing-files) — file တွေ ရေးသားခြင်း နဲ့ content ထပ်ဖြည့်ခြင်း
