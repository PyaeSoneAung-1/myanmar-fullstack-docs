---
title: "Hello World ဥပမာ"
description: "'Hello World' application ဆိုတဲ့ အရိုးရှင်းဆုံး Express app ကို တည်ဆောက်ကြည့်ခြင်း — server တစ်ခု ဖန်တီးပြီး port 3000 မှာ run လုပ်နည်း (beginner တွေအတွက်)"
order: 18
source: "https://expressjs.com/en/starter/hello-world.html"
status: translated
updated: 2026-09-01
---

> **သတိပြုရန်:** အောက်မှာ ဖော်ပြထားတာက Express နဲ့ ဖန်တီးနိုင်တဲ့ အရိုးရှင်းဆုံး app ပါ — file တစ်ခုတည်းနဲ့ ဖွဲ့စည်းထားတဲ့ app ဖြစ်ပြီး၊ JavaScript file တွေ အများကြီး၊ Jade templates တွေ၊ ရည်ရွယ်ချက်အမျိုးမျိုးအတွက် sub-directory တွေပါတဲ့ full app တစ်ခုလုံးရဲ့ scaffolding ကို ဖန်တီးပေးတဲ့ [Express generator](/docs/express/generator) က ထုတ်ပေးတာနဲ့ မတူပါဘူး။

CommonJS (`.cjs`) file အနေနဲ့:

```cjs
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

ES modules (`.mjs`) file အနေနဲ့:

```mjs
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

TypeScript (`.ts`) file အနေနဲ့:

```ts
import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

ဒီ app က server တစ်ခုကို စတင်ပြီး port 3000 မှာ connections တွေကို နားထောင်ပါတယ်။ Root URL (`/`) — တစ်နည်းအားဖြင့် *route* — ကို request လုပ်လာရင် "Hello World!" လို့ response ပြန်ပါတယ်။ ကျန်တဲ့ path တွေအတွက်ကတော့ **404 Not Found** ကို response ပြန်ပါလိမ့်မယ်။

## Local မှာ run လုပ်ခြင်း

ပထမဆုံး `myapp` ဆိုတဲ့ directory တစ်ခုကို ဖန်တီးပြီး အဲဒီထဲကို ဝင်ကာ `npm init` ကို run လုပ်ပါ။ ပြီးရင် [installation guide](/docs/express/installing) မှာ ပြထားတဲ့အတိုင်း `express` ကို dependency အဖြစ် install လုပ်ပါ။

`myapp` directory ထဲမှာ `app.js` ဆိုတဲ့ file တစ်ခုကို ဖန်တီးပြီး အပေါ်က example ထဲက code ကို ကူးထည့်ပါ။

> **သတိပြုရန်:** `req` (request) နဲ့ `res` (response) တွေက Node က ပေးတဲ့ object တွေနဲ့ အတိအကျ တူညီတဲ့ object တွေပါ — ဒါကြောင့် Express မပါဘဲ Node တည်းနဲ့ လုပ်နိုင်တဲ့ `req.pipe()`၊ `req.on('data', callback)` စတဲ့အရာတွေကိုပါ ခေါ်သုံးလို့ရပါတယ်။

အောက်ပါ command နဲ့ app ကို run လုပ်ပါ:

```bash
$ node app.js
```

ပြီးရင် browser မှာ `http://localhost:3000/` ကို ဖွင့်ကြည့်ပါ — output ကို တွေ့ရမှာပါ။
