---
title: "Middleware ရေးနည်း"
description: "Express မှာ ကိုယ်ပိုင် middleware ရေးနည်း — middleware function ရဲ့ ပုံစံ (req, res, next)၊ request-time logger ဥပမာ၊ mounted middleware၊ configurable middleware နဲ့ error-first middleware စီစဉ်ခြင်း"
order: 5
source: "https://expressjs.com/en/guide/writing-middleware.html"
status: translated
updated: 2026-09-01
---

## Middleware Function ရဲ့ ပုံစံ

**Middleware function** ဆိုတာ — app ရဲ့ request-response cycle ထဲမှာ request object (`req`), response object (`res`) နဲ့ `next` function ဆိုတဲ့ argument သုံးခုကို လက်ခံတဲ့ function ပါ။ `next` ကို ခေါ်လိုက်ရင် — လက်ရှိ middleware ရဲ့ **နောက်က middleware** ကို ဆက်လုပ်ဆောင်ပါတယ်။ Middleware function တစ်ခုက အောက်ပါ အလုပ်တွေ လုပ်လို့ရပါတယ်:

- ကိုယ်ပိုင် code ဘာမဆို run လုပ်နိုင်တယ်
- `req` နဲ့ `res` object တွေကို ပြုပြင်နိုင်တယ်
- Request-response cycle ကို အဆုံးသတ်နိုင်တယ်
- Stack ထဲက နောက် middleware ကို ခေါ်နိုင်တယ်

လက်ရှိ middleware က cycle ကို မအဆုံးသတ်ဘူးဆိုရင် — `next()` ကို ခေါ်ပေးဖို့ **မဖြစ်မနေ** လိုပါတယ်။ မခေါ်ရင် request က ရပ်နေပြီး နောက် middleware ဆီ ဘယ်တော့မှ မရောက်ပါဘူး။

## ဥပမာ — Request-time Logger

အရိုးရှင်းဆုံး ဥပမာတစ်ခုက — request တိုင်းအတွက် "LOGGED" လို့ log တင်တဲ့ `myLogger` middleware ပါ။ Middleware function ကို variable တစ်ခုထဲ သိမ်းပြီး `app.use()` နဲ့ mount လုပ်ပါတယ်:

```js
const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
```

`myLogger` ကို route တွေရဲ့ **ရှေ့မှာ** mount လုပ်ထားတာမို့ — request တိုင်း အရင်ဆုံး ဒီ middleware က run ပြီးမှ route handler ကို ဆက်သွားပါတယ်။ Middleware တွေရဲ့ **load order** က အရေးကြီးပါတယ် — အရင်ဆုံး mount လုပ်ထားတဲ့ middleware က အရင်ဆုံး run တာဖြစ်လို့ပါ။

## Mounted Middleware

Middleware တစ်ခုကို path တစ်ခုနဲ့တွဲပြီး mount လုပ်ချင်ရင် — `app.use()` မှာ path ကို ရှေ့ဆုံးက ထည့်ပေးရပါတယ်:

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

ဒီ middleware က `/user/...` ပုံစံ request တွေအတွက်ပဲ run ပြီး — request ရဲ့ method (GET, POST…) ကို log တင်ပါတယ်။ (`app.use()` နဲ့ mount လုပ်ခြင်း အသေးစိတ်ကို [Middleware အခြေခံ](/docs/express/middleware) မှာ ဖတ်နိုင်ပါတယ်။)

## Configurable Middleware ရေးနည်း

Middleware ကို **option တွေနဲ့ ပြုပြင်လို့ရအောင်** (configurable) လုပ်ချင်ရင် — options object ကို လက်ခံတဲ့ function ကို export လုပ်ပြီး၊ အဲဒီ function က middleware ကို ပြန်ပေးတဲ့ **factory function** ပုံစံနဲ့ ရေးပါတယ်:

```js
// my-middleware.js
module.exports = function (options) {
  return function (req, res, next) {
    // options object ကို အခြေခံပြီး middleware ရဲ့ အလုပ်ကို အကောင်အထည်ဖော်ပါ
    next()
  }
}

// app.js ထဲမှာ ဒီလို ခေါ်သုံးပါတယ်
const mw = require('./my-middleware')
app.use(mw({ option1: '1', option2: '2' }))
```

`mw(...)` က options အရ middleware အသစ်တစ်ခု ပြန်ထုတ်ပေးတာမို့ — middleware တစ်ခုတည်းကို setting အမျိုးမျိုးနဲ့ ပြန်သုံးလို့ရပါတယ်။

## Error-first Middleware စီစဉ်ခြင်း

Error-handling middleware တွေကိုတော့ တခြား `app.use()` တွေနဲ့ route တွေအားလုံးရဲ့ **နောက်ဆုံးမှာ** ထားရပါတယ် — `next(err)` နဲ့ error ပို့လိုက်ရင် Express က non-error middleware တွေကို ကျော်ပြီး ဒီ error handler ဆီကို တိုက်ရိုက် ပို့ပေးလို့ပါ:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

Error handler ရဲ့ အသေးစိတ်ကို [Error Handling](/docs/express/error-handling) မှာ ဆက်ဖတ်ပါ။

## နောက်တစ်ဆင့်တွေ

- [Error Handling](/docs/express/error-handling) — error handler တွေကို ဘယ်လို ရေးမလဲ
- [Static Files ပို့ခြင်း](/docs/express/static-files) — built-in middleware နဲ့ file တွေ ပို့ခြင်း
- [Advanced Routing](/docs/express/advanced-routing) — modular route တွေ စီစဉ်ခြင်း
