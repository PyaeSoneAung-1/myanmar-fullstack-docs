---
title: "Error Handling"
description: "Express မှာ error တွေကို ဘယ်လို ဖမ်းယူ ကိုင်တွယ်မလဲ — error-handling middleware (err, req, res, next)၊ default error handler၊ 404 handler နဲ့ custom error handler ရေးနည်း"
order: 4
source: "https://expressjs.com/en/guide/error-handling.html"
status: translated
updated: 2026-09-01
---

## Error Handling ဆိုတာ ဘာလဲ

**Error handling** ဆိုတာ — Express က synchronous ရော asynchronous ပါ ဖြစ်ပေါ်တဲ့ error တွေကို ဖမ်းယူပြီး စနစ်တကျ ကိုင်တွယ်တဲ့ လုပ်ငန်းစဉ်ပါ။ Express မှာ **default error handler** ပါပြီးသားဖြစ်လို့ — ကိုယ်ပိုင် error handler မရေးရသေးရင်တောင် app က error တွေကို ဆက်လုပ်ဆောင်နိုင်ပါတယ်။ Route handler နဲ့ middleware တွေ run နေစဉ်မှာ ဖြစ်တဲ့ error တွေကို Express က ဖမ်းမိဖို့က အရေးကြီးပါတယ်။

## Synchronous Code ထဲက Error တွေ

Route handler ဒါမှမဟုတ် middleware ရဲ့ **synchronous code** ထဲမှာ ဖြစ်တဲ့ error တွေအတွက်တော့ အထူးတစ်ခုခု လုပ်စရာမလိုပါဘူး — code က throw လုပ်လိုက်ရင် Express က သူ့ဘာသာသူ ဖမ်းပြီး error handler ဆီ ပို့ပေးပါတယ်:

```js
app.get('/', (req, res) => {
  throw new Error('BROKEN') // Express က ဒါကို သူ့ဘာသာသူ ဖမ်းယူပါတယ်
})
```

## Asynchronous Code ထဲက Error တွေ

**Express 5** မှာ `async` function သုံးထားတဲ့ route handler နဲ့ middleware တွေက — promise reject ဖြစ်တဲ့အခါ error ကို Express ဆီ **အလိုအလျောက်** ပို့ပေးပါတယ်။ `async` function တိုင်းက promise ကို return လုပ်တာမို့ error တွေက Express ဆီ ရောက်သွားပါတယ်:

```js
app.get('/user/:id', async (req, res) => {
  const user = await getUserById(req.params.id)
  res.send(user)
})
```

`getUserById` က error throw လုပ်ရင် (သို့) reject ဖြစ်ရင် — Express က `next` ကို အဲဒီ error နဲ့အတူ အလိုအလျောက် ခေါ်ပေးပါလိမ့်မယ်။

**Express 4** မှာတော့ ဒီလို အလိုအလျောက် မလုပ်ပေးပါဘူး — async code ထဲက error တွေကို `try/catch` နဲ့ ကိုယ်တိုင်ဖမ်းပြီး `next(err)` နဲ့ Express ဆီ ပို့ပေးရပါတယ်။ `next()` ကို error တစ်ခုခုနဲ့ ခေါ်လိုက်ရင် (string `'route'` ကလွဲရင်) — Express က အဲဒီ request ကို error ဖြစ်နေတယ်လို့ မှတ်ပြီး ကျန်တဲ့ non-error middleware တွေကို ကျော်သွားပါတယ်။

## Default Error Handler

Express မှာ built-in default error handler ပါပြီးသားဖြစ်ပြီး — middleware stack ရဲ့ **အဆုံးမှာ** ထားပေးထားပါတယ်။ `next(err)` နဲ့ error ပို့လိုက်ပြီး custom error handler မရှိရင် — ဒီ default handler က error ကို stack trace နဲ့အတူ client ဆီ ပြန်ပို့ပါတယ်။ **Production** environment မှာတော့ stack trace မပါဝင်တာမို့ — `NODE_ENV` ကို `production` လို့ သတ်မှတ်ထားဖို့ အရေးကြီးပါတယ်။

## 404 Handler — Route မတွေ့တဲ့အခါ

Express မှာ **404 response က error မဟုတ်ပါဘူး** — middleware နဲ့ route အားလုံးကို run ပြီးမှ ဘယ်သူမှ response မပြန်တာကိုပဲ ဆိုလိုတာပါ။ ဒါကြောင့် error-handling middleware က 404 ကို ဖမ်းမိမှာ မဟုတ်ဘဲ — middleware တွေအားလုံးရဲ့ **အောက်ဆုံးမှာ** သာမန် middleware တစ်ခုအနေနဲ့ ထားပေးရပါတယ်:

```js
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})
```

## Custom Error Handler ရေးနည်း

Error-handling middleware က သာမန် middleware နဲ့ တူပေမယ့် argument **လေးခု** ရှိပါတယ် — `(err, req, res, next)` ။ Argument လေးခုဖြစ်နေတာကိုပဲ Express က error handler လို့ ခွဲခြားသိပါတယ်။ Error handler တွေကို တခြား `app.use()` တွေနဲ့ route တွေအားလုံးရဲ့ **နောက်မှာ** ထားရပါတယ်။ Status code ကို error ပေါ်မူတည်ပြီး ပြောင်းချင်ရင် `err.status` ကို သုံးပါတယ် — `??` က `err.status` မရှိရင် 500 ကို သုံးမယ်လို့ ဆိုလိုပါတယ်:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status ?? 500).send({ error: err.message })
})
```

သတိထားစရာတစ်ခုက — response ကို စပို့ပြီးသားဖြစ်နေရင် (`res.headersSent`) default error handler ကို ပြန်လွှဲပေးဖို့ပါ။ အဲဒီအခါမျိုးမှာ ကိုယ်တိုင် response ထပ်မပို့ဘဲ `next(err)` ကို ခေါ်ပေးရပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Middleware ရေးနည်း](/docs/express/writing-middleware) — ကိုယ်ပိုင် middleware တွေ ဘယ်လို ရေးမလဲ
- [Debugging](/docs/express/debugging) — app ထဲက error တွေကို ဘယ်လို ရှာဖွေမလဲ
- [Production Best Practices](/docs/express/best-practices) — exception တွေကို production မှာ ဘယ်လို ကိုင်တွယ်မလဲ
