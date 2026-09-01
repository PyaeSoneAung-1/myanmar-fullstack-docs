---
title: "Express နဲ့ template engine သုံးခြင်း"
description: "Pug, Handlebars-compatible engines, EJS စတဲ့ template engines တွေကို Express.js နဲ့ ဘယ်လို ပေါင်းသုံးပြီး dynamic HTML page တွေကို ထိရောက်စွာ render လုပ်မလဲ"
order: 14
source: "https://expressjs.com/en/guide/using-template-engines.html"
status: translated
updated: 2026-09-01
---

**Template engine** ဆိုတာ — ကိုယ့် application ထဲမှာ static template file တွေကို သုံးနိုင်အောင် လုပ်ပေးတဲ့ အရာပါ။ Runtime မှာ template engine က template file ထဲက variable တွေကို တကယ့် တန်ဖိုးတွေနဲ့ အစားထိုးပြီး — template ကို client ဆီ ပို့မယ့် HTML file အဖြစ် ပြောင်းလဲပေးပါတယ်။ ဒီနည်းလမ်းက HTML page တစ်ခုကို ဒီဇိုင်းလုပ်ရတာ ပိုလွယ်ကူစေပါတယ်။

[Express application generator](/docs/express/generator) က [Pug](https://pugjs.org/api/getting-started.html) ကို default အနေနဲ့ သုံးပါတယ် — ဒါပေမယ့် [hbs](https://www.npmjs.com/package/hbs) လိုမျိုး Handlebars-compatible engine တွေ၊ [EJS](https://www.npmjs.com/package/ejs) အစရှိတာတွေနဲ့ configure လုပ်ထားတဲ့ app တွေကိုလည်း generate လုပ်နိုင်ပါတယ်။

Generator နဲ့ ဖန်တီးထားတဲ့ app တွေအတွက်ဆိုရင် — ဒီ setting တွေကို generate လုပ်ထားတဲ့ `app.js` ထဲမှာ ထည့်ပေးပြီးသား ဖြစ်ပါတယ်။ Generator မသုံးဘဲ ကိုယ်တိုင် ဖန်တီးတဲ့ app တွေအတွက်တော့ အောက်ပါ [application setting properties](https://expressjs.com/en/api.html#app.set) တွေကို ကိုယ်တိုင် သတ်မှတ်ရပါမယ်:

- `views` — template file တွေ ရှိတဲ့ directory ပါ။ ဥပမာ: `app.set('views', './views')` ။ Default အနေနဲ့ application root directory ထဲက `views` directory ကို သုံးပါတယ်။
- `view engine` — သုံးမယ့် template engine ပါ။ ဥပမာ Pug template engine ကို သုံးဖို့: `app.set('view engine', 'pug')` ။

ပြီးရင် Express-compatible ဖြစ်တဲ့ သက်ဆိုင်ရာ template engine npm package ကို install လုပ်ပါ; ဥပမာ Pug ကို install လုပ်ဖို့:

```bash
npm install pug --save
```

> **သတိပြုရန်:** Pug လိုမျိုး Express-compliant template engines တွေက `__express(filePath, options, callback)` ဆိုတဲ့ function တစ်ခုကို export လုပ်ပြီး — `res.render()` က template code ကို render လုပ်ဖို့ အဲဒီ function ကို ခေါ်ပါတယ်။
>
> Template engine တချို့က ဒီ convention အတိုင်း မလိုက်နာပါဘူး။ [@ladjs/consolidate](https://www.npmjs.com/package/@ladjs/consolidate) library ကတော့ — နာမည်ကြီး Node.js template engine တွေ အားလုံးကို မြေပုံဆွဲပြီး ဒီ convention ကို လိုက်နာတာမို့ Express ထဲမှာ ချောမွေ့စွာ (seamlessly) အလုပ်လုပ်ပါတယ်။ ဥပမာ — `handlebars` package အစိမ်းကို တစ်ခုတည်း သုံးမယ့်အစား [hbs](https://www.npmjs.com/package/hbs) ဒါမှမဟုတ် Express-compatible ဖြစ်တဲ့ တခြား Handlebars view engine တစ်ခုခုကို install လုပ်ပါ။

View engine ကို သတ်မှတ်ပြီးတာနဲ့ — app ထဲမှာ engine ကို ထပ်သတ်မှတ်စရာ ဒါမှမဟုတ် template engine module ကို ထပ် load လုပ်စရာ မလိုတော့ပါဘူး; Express က module ကို အတွင်းပိုင်းကနေ ကိုယ်တိုင် load လုပ်ပါတယ်။ ဥပမာ:

```js
app.set('view engine', 'pug');
```

ပြီးရင် `views` directory ထဲမှာ `index.pug` ဆိုတဲ့ Pug template file တစ်ခုကို အောက်ပါ content တွေနဲ့ ဖန်တီးပါ:

```pug
html
  head
    title= title
  body
    h1= message
```

`index.pug` file ကို render လုပ်ဖို့ route တစ်ခု ဖန်တီးပါ။ `view engine` property ကို သတ်မှတ်မထားဘူးဆိုရင် — `view` file ရဲ့ extension ကို အတိအကျ သတ်မှတ်ပေးရပါမယ်။ သတ်မှတ်ထားရင်တော့ ချန်လိုက်လို့ ရပါတယ်:

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});
```

```ts
import { type Request, type Response } from 'express';

app.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});
```

Home page ကို request လုပ်လိုက်တဲ့အခါ — `index.pug` file က HTML အနေနဲ့ render ဖြစ်သွားပါလိမ့်မယ်။

View engine cache က template ရဲ့ output content တွေကို cache မလုပ်ဘဲ — အရင်းခံ template ကိုယ်နှိုက်ကိုသာ cache လုပ်ပါတယ်။ ဒါကြောင့် cache ဖွင့်ထားရင်တောင် view ကို request တိုင်းမှာ ပြန်ပြီး re-render လုပ်နေဦးမှာ ဖြစ်ပါတယ်။
