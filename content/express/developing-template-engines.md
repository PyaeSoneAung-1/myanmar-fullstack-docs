---
title: "Express အတွက် template engine တီထွင်ဖန်တီးခြင်း"
description: "app.engine() ကို သုံးပြီး Express.js အတွက် ကိုယ်ပိုင် template engine တွေ ဘယ်လို တီထွင်ဖန်တီးမလဲ — ကိုယ်ပိုင် template rendering logic ရေးပြီး ပေါင်းစည်းခြင်း ဥပမာများ"
order: 16
source: "https://expressjs.com/en/advanced/developing-template-engines.html"
status: translated
updated: 2026-09-01
---

`app.engine(ext, callback)` method ကို သုံးပြီး ကိုယ်ပိုင် template engine တစ်ခု ဖန်တီးနိုင်ပါတယ်။ `ext` က file extension ကို ရည်ညွှန်းပြီး — `callback` ကတော့ template engine function ဖြစ်ပါတယ်။ ဒီ function က အောက်ပါအရာတွေကို parameter အနေနဲ့ လက်ခံပါတယ်: file ရဲ့ တည်နေရာ (location), options object, နဲ့ callback function တို့ ဖြစ်ပါတယ်။

အောက်ပါ code က `.ntl` file တွေကို render လုပ်ဖို့အတွက် ရိုးရှင်းတဲ့ template engine တစ်ခုကို implement လုပ်ထားတဲ့ ဥပမာပါ:

```js
const fs = require('fs'); // this engine requires the fs module
app.engine('ntl', (filePath, options, callback) => {
  // define the template engine
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    // this is an extremely simple template engine
    const rendered = content
      .toString()
      .replace('#title#', `<title>${options.title}</title>`)
      .replace('#message#', `<h1>${options.message}</h1>`);
    return callback(null, rendered);
  });
});
app.set('views', './views'); // specify the views directory
app.set('view engine', 'ntl'); // register the template engine
```

```ts
import fs from 'fs'; // this engine requires the fs module
app.engine(
  'ntl',
  (
    filePath: string,
    options: Record<string, any>,
    callback: (e: any, rendered?: string) => void
  ) => {
    // define the template engine
    fs.readFile(filePath, (err, content) => {
      if (err) return callback(err);
      // this is an extremely simple template engine
      const rendered = content
        .toString()
        .replace('#title#', `<title>${options.title}</title>`)
        .replace('#message#', `<h1>${options.message}</h1>`);
      return callback(null, rendered);
    });
  }
);
app.set('views', './views'); // specify the views directory
app.set('view engine', 'ntl'); // register the template engine
```

အခုဆိုရင် ကိုယ့် app က `.ntl` file တွေကို render လုပ်နိုင်ပါပြီ။ `views` directory ထဲမှာ `index.ntl` ဆိုတဲ့ file တစ်ခုကို အောက်ပါ content တွေနဲ့ ဖန်တီးပါ:

```pug
#title#
#message#
```

ပြီးရင် app ထဲမှာ အောက်ပါ route ကို ဖန်တီးပါ:

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});
```

Home page ကို request လုပ်လိုက်တဲ့အခါ — `index.ntl` က HTML အနေနဲ့ render ဖြစ်သွားပါလိမ့်မယ်။
