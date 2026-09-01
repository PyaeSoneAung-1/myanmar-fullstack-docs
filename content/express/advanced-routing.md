---
title: "Advanced Routing"
description: "Route path အမျိုးအစားများ — string path နဲ့ regular expression path၊ route parameters ပုံစံများ၊ app.route() chain လုပ်ခြင်း နဲ့ express.Router() နဲ့ modular route တွေ ရေးနည်း"
order: 7
source: "https://expressjs.com/en/guide/routing.html"
status: translated
updated: 2026-09-01
---

## Route Path အမျိုးအစားများ

[Routing အခြေခံ](/docs/express/routing) မှာ route တွေရဲ့ အခြေခံကို ဖတ်ပြီးပြီဆိုရင် — ဒီမှာ ပိုပြီး ပြောင်းလွယ်ပြင်လွယ်ရှိတဲ့ route path တွေကို ဆက်ကြည့်ရအောင်။ Route path က **string** အနေနဲ့လည်း ရေးလို့ရသလို — **regular expression** အနေနဲ့လည်း ရေးလို့ရပါတယ်။ String path တွေမှာ dot (`.`) နဲ့ hyphen (`-`) ကို **literal (အက္ခရာအမှန်)** အနေနဲ့ပဲ မှတ်ပါတယ် — ဥပမာ `/random.text` က `random.text` ဆိုတဲ့ path နဲ့ပဲ တိုက်ဆိုင်ပါတယ်။ Query string တွေက route path ရဲ့ အစိတ်အပိုင်း မဟုတ်တာကိုလည်း သတိပြုပါ။

## String Path နဲ့ Regular Expression Path

ပိုရှုပ်ထွေးတဲ့ matching logic လိုအပ်တဲ့အခါ — route path ကို regular expression အနေနဲ့ ရေးလို့ရပါတယ်:

```js
app.get('/about', (req, res) => {
  res.send('about')
})

app.get('/random.text', (req, res) => {
  res.send('random.text')
})

// Matches any path containing "a"
app.get(/a/, (req, res) => {
  res.send('/a/')
})

// Matches paths ending with "fly" (butterfly, dragonfly, etc.)
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})
```

ပထမ route နှစ်ခုက string path — `/about` နဲ့ `/random.text` ကိုပဲ တိုက်ရိုက် match လုပ်ပါတယ်။ ဒုတိယနှစ်ခုက regular expression — `a` ပါတဲ့ path အားလုံး၊ ပြီးတော့ `fly` နဲ့ အဆုံးသတ်တဲ့ path တွေ (`butterfly`, `dragonfly` စသဖြင့်) ကို match လုပ်ပါတယ်။

## Route Parameters ပုံစံများ

Route parameters တွေက URL ထဲက တန်ဖိုးတွေကို ဖမ်းယူပြီး — `req.params` ထဲမှာ ရပါတယ်။ Hyphen နဲ့ dot က literal ဖြစ်တာမို့ — parameter တွေနဲ့ တွဲပြီး အသုံးဝင်တဲ့ ပုံစံတွေ ဖန်တီးလို့ရပါတယ်:

```js
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
```

`/users/34/books/8989` လို URL ကို request လုပ်ရင် — `req.params` က `{ "userId": "34", "bookId": "8989" }` ကို ပြန်ပေးပါတယ်။ ဒီလိုပဲ `/flights/:from-:to` က `/flights/LAX-SFO` ကို match လုပ်ပြီး — `{ "from": "LAX", "to": "SFO" }` ကို ရစေပါတယ်။

## app.route() — Chain Route Handlers

Path တစ်ခုတည်းအတွက် handler အမျိုးမျိုးကို `app.route()` နဲ့ **တစ်နေရာတည်းမှာ chain လုပ်လို့** ရပါတယ် — path ကို နေရာတစ်ခုတည်းမှာ ရေးထားတာမို့ modular ဖြစ်ပြီး ထပ်နေတာတွေ၊ အမှားတွေ နည်းပါတယ်:

```js
app
  .route('/book')
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

## express.Router() — Modular Route တွေ

App တစ်ခုလုံးကို မကြီးအောင်လို့ — route တွေကို file တွေခွဲပြီး ရေးဖို့ **`express.Router`** ကို သုံးပါတယ်။ Router instance တစ်ခုက middleware ရော routing ပါ ပါဝင်တဲ့ စနစ်တစ်ခုလုံးမို့ — **"mini-app"** လို့လည်း ခေါ်လေ့ရှိပါတယ်။ ဥပမာ — `birds.js` ဆိုတဲ့ router file တစ်ခု ဖန်တီးပြီး router ရဲ့ ကိုယ်ပိုင် middleware နဲ့ route တွေ သတ်မှတ်ပါတယ်:

```js
const express = require('express')
const router = express.Router()

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}

router.use(timeLog)

// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router
```

ပြီးရင် main app ထဲမှာ `const birds = require('./birds')` နဲ့ ယူပြီး — `app.use('/birds', birds)` လို့ mount လုပ်ပါတယ်။ အခုဆိုရင် `/birds` နဲ့ `/birds/about` ဆိုတဲ့ request တွေကို app က ကိုင်တွယ်နိုင်ပြီး — router ရဲ့ `timeLog` middleware လည်း အလိုအလျောက် run ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Routing အခြေခံ](/docs/express/routing) — route အခြေခံသဘောတရားများ
- [Middleware ရေးနည်း](/docs/express/writing-middleware) — middleware တွေကို ဘယ်လို ရေးမလဲ
- [Error Handling](/docs/express/error-handling) — route ထဲက error တွေကို ကိုင်တွယ်ခြင်း
