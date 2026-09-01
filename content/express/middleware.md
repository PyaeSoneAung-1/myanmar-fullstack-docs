---
title: "Middleware အခြေခံ"
description: "Middleware ဆိုတာ ဘာလဲ၊ request→response pipeline၊ app.use() နဲ့ built-in middleware (express.json, express.static)၊ error-handling middleware"
order: 3
source: "https://expressjs.com/en/guide/using-middleware.html"
status: translated
updated: 2026-09-01
---

## Middleware ဆိုတာ ဘာလဲ

**Middleware** ဆိုတာ — client ဆီက request တစ်ခုကို server က လက်ခံပြီး response ပြန်မပို့ခင်အထိ အဲဒီ **request ရဲ့ lifecycle အတွင်းမှာ run လုပ်တဲ့ function** တွေပါ။ Middleware function တစ်ခုစီမှာ request object (`req`), response object (`res`) နဲ့ `next` function ဆိုတဲ့ argument သုံးခု ရှိပါတယ်။

```js
const express = require('express')
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

ဒီ middleware က request တိုင်းအတွက် လက်ရှိအချိန် (timestamp) ကို log တင်ပြီး `next()` နဲ့ နောက် middleware ကို ဆက်လွှဲပါတယ်။

## Request → Response Pipeline

Express app တစ်ခုမှာ request တစ်ခုက **pipeline (ပိုက်လိုင်း)** လိုမျိုး — middleware function တွေကြားကို အစဉ်လိုက် ဖြတ်သွားပါတယ်။ Middleware တစ်ခုက အလုပ်ပြီးရင် `next()` ခေါ်လိုက်ရင် နောက် middleware ကို ဆက်သွားပြီး — တစ်ခုခုက response ပြန်ပို့လိုက်ရင် အဲဒီမှာ pipeline ပြီးသွားပါတယ်။ ဒါကြောင့် middleware တွေရဲ့ **အစဉ်လိုက် (order)** က အရေးကြီးပါတယ် — request ရောက်တာနဲ့ အပေါ်ဆုံးကစပြီး အစဉ်လိုက် run တာဖြစ်လို့ပါ။

## app.use() နဲ့ app.METHOD()

Middleware တွေကို mount လုပ်ဖို့ `app.use()` ကို သုံးပြီး — route handler တွေအတွက်တော့ `app.get()`, `app.post()` စတဲ့ `app.METHOD()` တွေကို သုံးပါတယ်။

- `app.use()` — path တစ်ခုခုကို match ဖြစ်တဲ့ request တိုင်းမှာ run တယ်
- `app.METHOD()` — HTTP method ရော path ပါ နှစ်ခုလုံး match ဖြစ်မှ run တယ်

`app.use()` မှာ path တစ်ခု သတ်မှတ်လို့လည်း ရပါတယ် — ဥပမာ `/user/:id` path အတွက်တည့်တည့်:

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

ဒီ middleware က `/user/...` ပုံစံ request တွေအတွက်ပဲ run ပြီး request ရဲ့ method (GET, POST…) ကို log တင်ပါတယ်။

## Built-in Middleware

Express မှာ အသုံးအများဆုံး built-in middleware တွေ ပါပြီးသားပါ:

- `express.json()` — request body ထဲက JSON data ကို parse (ဖတ်) ပြီး `req.body` ထဲ ထည့်ပေးတယ်
- `express.static()` — static file တွေ (image, CSS, JavaScript…) ကို server ကနေ တိုက်ရိုက် ပေးပို့တယ်

```js
// JSON body ကို parse လုပ်မယ်
app.use(express.json())

// public folder ထဲက static file တွေကို ပေးမယ်
app.use(express.static('public'))
```

ဒီနှစ်ခုလုံးက `app.use()` နဲ့ mount လုပ်ထားတာမို့ — request တိုင်းအတွက် အလိုအလျောက် အလုပ်လုပ်ပါတယ်။ API တွေမှာ `express.json()` က request body ကို ဖတ်ဖို့ မရှိမဖြစ် လိုအပ်ပါတယ်။

## Custom Middleware ရေးခြင်း

ကိုယ်ပိုင် middleware ရေးတာက ရိုးရှင်းပါတယ် — function တစ်ခုရေးပြီး `req`, `res`, `next` သုံးခုလုံးကို လက်ခံရုံပါပဲ။ အရေးကြီးတာက `next()` နဲ့ ဆက်လွှဲဖို့ပါ — `next()` ကို မခေါ်ရင် request က နောက်တစ်ဆင့်ကို ဘယ်တော့မှ မရောက်ဘဲ ရပ်နေပါလိမ့်မယ်။

## Error-handling Middleware

Error-handling middleware က တခြား middleware တွေနဲ့ မတူဘဲ argument **လေးခု** ရှိပါတယ် — `(err, req, res, next)` ။ Argument လေးခုဖြစ်နေတာကိုပဲ Express က ဒါက error handler ဆိုပြီး မှတ်မိပါတယ်:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

Error handler ကို `app.use()` တွေအားလုံးရဲ့ **နောက်ဆုံးမှာ** ထားဖို့ အကြံပြုပါတယ် — အပေါ်က middleware တွေထဲ တစ်ခုခုမှာ error ဖြစ်ရင် ဒီ error handler ဆီကို ရောက်သွားပြီး **500 Internal Server Error** နဲ့ response ပြန်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Express စတင်ခြင်း](/docs/express/getting-started) — Express app တစ်ခု ဘယ်လို စတင်မလဲ
- [Routing အခြေခံ](/docs/express/routing) — route တွေကို ဘယ်လို သတ်မှတ်မလဲ
