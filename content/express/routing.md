---
title: "Routing အခြေခံ"
description: "Routing ဆိုတာ ဘာလဲ၊ route method တွေ၊ route parameters (:userId)၊ callback အများအပြားနဲ့ app.route() — Express မှာ URL တွေကို စီစဉ်နည်း"
order: 2
source: "https://expressjs.com/en/starter/basic-routing.html"
status: translated
updated: 2026-09-01
---

## Routing ဆိုတာ ဘာလဲ

**Routing** ဆိုတာ — client က **endpoint (URL path + HTTP method)** တစ်ခုဆီ request လုပ်လာတဲ့အခါ app က ဘယ်လို response ပြန်မလဲ ဆုံးဖြတ်တဲ့ စနစ်ပါ။ Express မှာ route တစ်ခုကို အောက်ပါပုံစံနဲ့ သတ်မှတ်ပါတယ်:

```
app.METHOD(PATH, HANDLER)
```

- `app` — Express instance
- `METHOD` — HTTP request method (GET, POST, PUT, DELETE…)
- `PATH` — server ပေါ်က path (route)
- `HANDLER` — route ကို match ဖြစ်တဲ့အခါ run လုပ်မယ့် function

Route တစ်ခုစီမှာ handler function တစ်ခု (သို့) တစ်ခုထက်ပိုပြီး ထားလို့ရပြီး — route က match ဖြစ်တဲ့အခါ အဲဒီ handler တွေကို အစဉ်လိုက် run လုပ်ပါတယ်။

ဥပမာ — root URL (`/`) ကို GET request လုပ်လာရင် "hello world" လို့ ပြန်ပို့ဖို့:

```js
const express = require('express')
const app = express()

// homepage ကို GET request လုပ်လာရင် ဒီ handler က response ပြန်မယ်
app.get('/', (req, res) => {
  res.send('hello world')
})
```

## Route Method တွေ

Express က GET, POST, PUT, DELETE စတဲ့ HTTP method အားလုံးအတွက် method တစ်ခုစီ ပေးထားပါတယ် — `app.get()`, `app.post()`, `app.put()`, `app.delete()` စသဖြင့်ပါ။ Path တစ်ခုတည်းကိုတောင် method အမျိုးမျိုးနဲ့ response အမျိုးမျိုး ပြန်ဖို့ သုံးလို့ရပါတယ်:

```js
// GET request — data ယူချင်တဲ့အခါ
app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

// POST request — data အသစ် ထည့်ချင်တဲ့အခါ
app.post('/', (req, res) => {
  res.send('POST request to the homepage')
})
```

ဒါကြောင့် REST API တွေမှာ resource တစ်ခုတည်းကို method အလိုက် action အမျိုးမျိုး လုပ်လို့ရပါတယ် — GET က ဖတ်တာ၊ POST က အသစ်ထည့်တာ စသဖြင့်ပါ။

## Route Parameters

URL ထဲက တန်ဖိုးတွေကို ဖမ်းယူဖို့ route path မှာ `:parameterName` ပုံစံနဲ့ ရေးပါတယ်။ Match ဖြစ်တဲ့တန်ဖိုးတွေကို `req.params` ထဲမှာ ရပါတယ်။ ဥပမာ `/users/34/books/8989` လို URL ကို request လုပ်ရင်:

```js
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
```

ဒီအခါ `req.params` က `{ "userId": "34", "bookId": "8989" }` ဆိုတဲ့ object ကို ပြန်ပေးပါလိမ့်မယ်။ Route parameter တွေက URL ထဲက **တန်ဖိုးအစစ် (literal value)** တွေပဲ — `/users/34` နဲ့ `/users/abc` နှစ်ခုလုံးကို match ဖြစ်ပါတယ်။ Parameter တွေက string အနေနဲ့ ရတာဖြစ်လို့ — number အနေနဲ့ သုံးချင်ရင် ကိုယ်တိုင် convert လုပ်ရပါတယ်။

## Callback Function အများအပြား

Route handler ကို callback function တစ်ခုထက်ပိုပြီး ပေးလို့ရပါတယ်။ Callback တွေက **အစဉ်လိုက် run** ပြီး — နောက် callback ကို ဆက်သွားချင်ရင် `next()` ကို ခေါ်ရပါတယ်:

```js
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})
```

ပထမ callback က log တစ်ကြောင်းရိုက်ပြီး `next()` နဲ့ ဒုတိယ callback ကို ဆက်လွှဲပါတယ်။ ဒုတိယ callback ကမှ response ကို ပြန်ပို့တာဖြစ်လို့ client က "Hello from B!" ကို ရပါမယ်။

## app.route() — Chain လုပ်ခြင်း

Path တစ်ခုတည်းအတွက် route handler အမျိုးမျိုးကို `app.route()` နဲ့ **တစ်နေရာတည်းမှာ chain လုပ်ပြီး** ရေးလို့ရပါတယ် — code ပိုတိုပြီး ဖတ်ရလွယ်စေပါတယ်:

```js
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })
```

ဒါက `/book` path တစ်ခုတည်းအတွက် GET, POST, PUT — method သုံးခုလုံးကို စုပြီး သတ်မှတ်တာပါ။ Route တစ်ခုကို နေရာတစ်ခုတည်းမှာ ထားလို့ ပြုပြင်ရတာ လွယ်ကူပြီး အမှားဖြစ်နိုင်ခြေလည်း နည်းပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Express စတင်ခြင်း](/docs/express/getting-started) — Express အခြေခံ မရသေးရင် အရင်ဖတ်ပါ
- [Middleware အခြေခံ](/docs/express/middleware) — request/response ကြားထဲ ဘယ်လို function တွေ ထည့်မလဲ
