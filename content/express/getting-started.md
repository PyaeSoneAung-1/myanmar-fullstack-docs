---
title: "Express စတင်ခြင်း"
description: "Express ဆိုတာ ဘာလဲ၊ ဘယ်လို install လုပ်မလဲ — hello world app နဲ့ Node.js web framework ကို စတင်သုံးကြည့်မယ်"
order: 1
source: "https://expressjs.com/en/starter/installing.html"
status: translated
updated: 2026-09-01
---

## Express ဆိုတာ ဘာလဲ

**Express** က **minimal** ပြီး **flexible** ဖြစ်တဲ့ Node.js web application framework တစ်ခုပါ။ Web app နဲ့ mobile app တွေအတွက် လိုအပ်တဲ့ feature တွေကို ပံ့ပိုးပေးပါတယ်။ HTTP utility method တွေနဲ့ middleware တွေ အများကြီးပါတာကြောင့် — robust ဖြစ်တဲ့ API တစ်ခုကို မြန်မြန် လွယ်လွယ် တည်ဆောက်လို့ရပါတယ်။

Express က Node.js ရဲ့ အခြေခံ feature တွေကို မဖုံးကွယ်ဘဲ အပေါ်ကနေ **ပါးပါးလွှာလွှာ (thin layer)** အနေနဲ့ ထပ်ဖြည့်ပေးထားတာပါ။ Node.js မှာ တိုက်ရိုက်လုပ်နိုင်တဲ့ အရာတွေကို Express မှာလည်း ဆက်လုပ်လို့ရတယ်လို့ ဆိုလိုပါတယ်။ Routing, middleware, request/response handling စတဲ့ web app တွေမှာ အသုံးအများဆုံး အလုပ်တွေကို ပိုရိုးရှင်းတဲ့ API နဲ့ ပေးထားတာဖြစ်ပါတယ်။

## Installation

Express ကို မတပ်ဆင်ခင် Node.js ကို အရင်သွင်းထားဖို့ လိုပါတယ်။ (Node.js မရှိသေးရင် [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) မှာ ဆက်ဖတ်ပါ။) Project folder အသစ်တစ်ခု ဖန်တီးပြီး npm init နဲ့ package.json ဖိုင်ကို စတင်ပါ:

```bash
mkdir myapp
cd myapp
npm init -y
```

ပြီးရင် Express ကို project ထဲ install လုပ်ပါ:

```bash
npm install express
```

ဒီ command က express ကို `node_modules` folder ထဲ install လုပ်ပြီး — `package.json` ရဲ့ dependencies စာရင်းထဲကိုလည်း အလိုအလျောက် ထည့်ပေးပါတယ်။

## Hello World App

အရိုးရှင်းဆုံး Express app ကို ရေးကြည့်ရအောင်။ `app.js` ဆိုတဲ့ file တစ်ခု ဖန်တီးပြီး အောက်ပါ code ကို ထည့်သိမ်းပါ:

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

Code ထဲမှာ ဘာတွေ ဖြစ်နေလဲဆိုတာ ကြည့်ရအောင်:

- `app.get('/', ...)` — root URL (`/`) ကို GET request လုပ်လာရင် ဒီ callback ကို run လုပ်မယ်
- `res.send(...)` — response ကို client ဆီ ပြန်ပို့ပေးတယ်
- `app.listen(port, ...)` — server ကို port 3000 မှာ စတင်ဖွင့်ပေးတယ်

## App ကို run လုပ်ခြင်း

Terminal ထဲမှာ အောက်ပါ command နဲ့ app ကို run လုပ်ပါ:

```bash
node app.js
```

ပြီးရင် browser ကနေ `http://localhost:3000/` ကို ဖွင့်ကြည့်ရင် "Hello World!" ကို မြင်ရပါမယ်။ Port 3000 ကို အခြား program က သုံးနေတယ်ဆိုရင် `port` variable ရဲ့ တန်ဖိုးကို ပြောင်းလိုက်ရုံပါပဲ။

## App ၏ အခြေခံဖွဲ့စည်းပုံ

Express app တစ်ခုရဲ့ အဓိက အစိတ်အပိုင်းတွေကတော့:

- **app** — Express instance ။ App တစ်ခုက server တစ်ခုလုံးကို ကိုယ်စားပြုတယ်
- **Route** — HTTP method + URL path + handler (callback) ပေါင်းစပ်ထားတဲ့ အရာ
- **req (request)** — client ဆီကလာတဲ့ request အချက်အလက် (URL, headers, body…)
- **res (response)** — client ဆီ ပြန်ပို့မယ့် response အချက်အလက်
- **Middleware** — request နဲ့ response ကြားမှာ လုပ်ဆောင်တဲ့ function

Root URL (`/`) ကလွဲပြီး တခြား path တွေကို request လုပ်ရင် default အားဖြင့် **404 Not Found** ပြန်ပါလိမ့်မယ်။

## နောက်တစ်ဆင့်တွေ

- [Routing အခြေခံ](/docs/express/routing) — URL တွေနဲ့ HTTP method တွေကို ဘယ်လို စီစဉ်မလဲ
- [Middleware အခြေခံ](/docs/express/middleware) — request/response လမ်းကြောင်းထဲက function တွေ
