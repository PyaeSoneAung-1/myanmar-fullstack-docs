---
title: "Node.js File Paths (Node.js မှာ file paths တွေနဲ့ အလုပ်လုပ်ခြင်း)"
description: "path module သုံးပြီး dirname/basename/extname ဖြင့် path အချက်အလက် ထုတ်ယူနည်း၊ join/resolve/normalize ဖြင့် path များ တွက်ချက်နည်း"
order: 13
source: "https://nodejs.org/en/learn/manipulating-files/nodejs-file-paths"
status: translated
updated: 2026-09-01
---

## Path ဆိုတာ

System ထဲက file တိုင်းမှာ path တစ်ခု ရှိပါတယ်။ Linux နဲ့ macOS မှာ path တစ်ခုက `/users/joe/file.txt` လိုမျိုး ဖြစ်နိုင်ပြီး Windows ကွန်ပျူတာတွေကတော့ မတူဘဲ `C:\users\joe\file.txt` ဆိုတဲ့ ဖွဲ့စည်းပုံ ရှိပါတယ်။

ဒီ ကွာခြားချက်ကို ထည့်သွင်း စဉ်းစားရမှာမို့ — application တွေထဲမှာ path တွေ သုံးတဲ့အခါ သတိထားဖို့ လိုပါတယ်။

ဒီ module ကို သင့် files တွေထဲမှာ `const path = require('node:path');` ဆိုပြီး ထည့်သွင်းလိုက်တာနဲ့ — သူ့ရဲ့ methods တွေကို စတင် သုံးနိုင်ပါတယ်။

## Path တစ်ခုကနေ အချက်အလက် ထုတ်ယူခြင်း

Path တစ်ခု ရှိရင် — ဒီ methods တွေနဲ့ သူ့ထဲက အချက်အလက်တွေကို ထုတ်ယူနိုင်ပါတယ်:

- `dirname`: file ရဲ့ parent folder ကို ရယူပေးပါတယ်
- `basename`: filename အပိုင်းကို ရယူပေးပါတယ်
- `extname`: file extension ကို ရယူပေးပါတယ်

### ဥပမာ

```cjs
const path = require('node:path');

const notes = '/users/joe/notes.txt';

path.dirname(notes); // /users/joe
path.basename(notes); // notes.txt
path.extname(notes); // .txt
```

`basename` ကို ဒုတိယ argument တစ်ခု ပေးပြီး — extension မပါတဲ့ file name ကိုလည်း ရယူနိုင်ပါတယ်:

```js
path.basename(notes, path.extname(notes)); // notes
```

## Path တွေနဲ့ အလုပ်လုပ်ခြင်း

`path.join()` ကို သုံးပြီး path တစ်ခုရဲ့ အပိုင်း နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုတာကို ပေါင်းစပ်နိုင်ပါတယ်:

```js
const name = 'joe';
path.join('/', 'users', name, 'notes.txt'); // '/users/joe/notes.txt'
```

`path.resolve()` ကို သုံးပြီး relative path တစ်ခုရဲ့ absolute path တွက်ချက်မှုကို ရယူနိုင်ပါတယ်:

```js
path.resolve('joe.txt'); // '/Users/joe/joe.txt' if run from my home folder
```

ဒီကိစ္စမှာ Node.js က current working directory ပေါ်မှာ `/joe.txt` ကို ရိုးရိုး append လုပ်ပေးပါလိမ့်မယ်။ ဒုတိယ parameter အနေနဲ့ folder တစ်ခု သတ်မှတ်ရင် — `resolve` က ပထမတစ်ခုကို ဒုတိယတစ်ခုအတွက် base အဖြစ် သုံးပါလိမ့်မယ်:

```js
path.resolve('tmp', 'joe.txt'); // '/Users/joe/tmp/joe.txt' if run from my home folder
```

ပထမ parameter က slash နဲ့ စရင် — ဒါက absolute path ဖြစ်တယ်လို့ ဆိုလိုပါတယ်:

```js
path.resolve('/etc', 'joe.txt'); // '/etc/joe.txt'
```

`path.normalize()` ကတော့ နောက်ထပ် အသုံးဝင်တဲ့ function တစ်ခုပါ — path ထဲမှာ `.` ဒါမှမဟုတ် `..` လို relative specifiers တွေ ဒါမှမဟုတ် double slashes တွေ ပါနေရင် — တကယ့် path ကို တွက်ချက်ဖို့ ကြိုးစားပေးပါတယ်:

```js
path.normalize('/users/joe/..//test.txt'); // '/users/test.txt'
```

**resolve ရော normalize ရော path ရှိမရှိကို စစ်ဆေးပေးတာ မဟုတ်ပါဘူး**။ သူတို့ ရရှိထားတဲ့ အချက်အလက်တွေကို အခြေခံပြီး path တစ်ခုကို တွက်ချက်ပေးရုံပဲ ဖြစ်ပါတယ်။

## ဆက်ဖတ်ရန်

- [File System](/docs/nodejs/file-system) — fs module နဲ့ file operations တွေ
- [File Stats](/docs/nodejs/file-stats) — file အချက်အလက်များ (size, permissions စသည်) ရယူနည်း
