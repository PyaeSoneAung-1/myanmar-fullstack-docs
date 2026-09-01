---
title: "Production Best Practices"
description: "Express app ကို production မှာ run ဖို့ အကောင်းဆုံး အလေ့အကျင့်များ — NODE_ENV=production၊ gzip compression၊ synchronous function ရှောင်ခြင်း၊ logging နဲ့ exception handling၊ process.env.PORT နဲ့ trust proxy"
order: 9
source: "https://expressjs.com/en/advanced/best-practice-performance.html"
status: translated
updated: 2026-09-01
---

## NODE_ENV=production

Performance အတွက် အလွယ်ကူဆုံးနဲ့ အရေးအကြီးဆုံး အချက်တစ်ခုက — `NODE_ENV` environment variable ကို `production` လို့ သတ်မှတ်ထားဖို့ပါ:

```bash
NODE_ENV=production node app.js
```

ဒါလုပ်လိုက်ရင် Express က — view template တွေကို cache လုပ်တယ်၊ error message တွေ ပိုတိုတောင်းအောင် ထုတ်ပေးတယ် (stack trace မပါတော့ဘူး)။ ဒါတစ်ခုတည်းနဲ့တင် app ရဲ့ performance က သိသိသာသာ တိုးတက်တယ်လို့ မှတ်တမ်းတွေက ဆိုပါတယ်။ Production server တွေမှာတော့ shell ထဲမှာ export လုပ်တာထက် — OS ရဲ့ init system (systemd လို) ကနေ သတ်မှတ်တာ ပိုကောင်းပါတယ်။

## Gzip Compression သုံးခြင်း

Response body ကို **gzip** နဲ့ ချုံ့လိုက်ရင် — network ပေါ် ပို့လွှတ်ရတဲ့ data ပမာဏ သိသိသာသာ လျော့ကျပြီး web app ရဲ့ speed တက်ပါတယ်။ Express မှာ `compression` middleware ကို သုံးပါတယ်:

```js
const compression = require('compression')
const express = require('express')
const app = express()

app.use(compression())
```

Traffic များတဲ့ production site တွေမှာတော့ — reverse proxy (Nginx လို) ရဲ့ အဆင့်မှာ gzip လုပ်တာ အကောင်းဆုံးပါ။

## Synchronous Function တွေကို ရှောင်ကြဉ်ခြင်း

Synchronous function တွေက — ပြီးဆုံးတဲ့အထိ process တစ်ခုလုံးကို ပိတ်ထားတာမို့ traffic များတဲ့အခါ performance ကျစေပါတယ်။ Node မှာ function အများစုက synchronous ရော asynchronous ပါ ဗားရှင်းနှစ်မျိုး ရှိတာမို့ — production မှာ **asynchronous ဗားရှင်းကိုပဲ** သုံးပါ။ ကိုယ့် code ထဲ synchronous API သုံးမိနေလားဆိုတာ သိချင်ရင် `node --trace-sync-io app.js` နဲ့ run ကြည့်နိုင်ပါတယ် — သုံးမိတိုင်း warning နဲ့ stack trace ပြပါတယ်။

## Logging မှန်ကန်စွာ လုပ်ခြင်း

`console.log()` နဲ့ `console.error()` တွေက — output destination က terminal (သို့) file ဆိုရင် **synchronous** ဖြစ်တာမို့ production အတွက် မသင့်တော်ပါဘူး။ ဘယ်ဟာကို သုံးမလဲဆိုတာ ရည်ရွယ်ချက်ပေါ်မူတည်ပါတယ်:

- **Debugging အတွက်** — `debug` module ကို သုံးပါ။ `DEBUG` environment variable နဲ့ ဘယ် namespace တွေ ထုတ်ပြမလဲ ထိန်းချုပ်လို့ရပါတယ် (အသေးစိတ်ကို [Debugging](/docs/express/debugging) မှာ ဖတ်ပါ)
- **App activity အတွက်** (traffic, API call စာရင်း) — Pino လို logging library ကို သုံးပါ
- Development မှာတော့ morgan လို HTTP request logger middleware ကို သုံးပြီး — request တိုင်းရဲ့ method, path, status စတာတွေကို လွယ်လွယ်ကူကူ log လုပ်လို့ရပါတယ်

## Exception တွေကို စနစ်တကျ ကိုင်တွယ်ခြင်း

Node app တွေက uncaught exception ဖြစ်ရင် crash ဖြစ်ပါတယ် — အဲဒါကို ကိုင်တွယ်မှု မရှိရင် app က offline ဖြစ်သွားပါလိမ့်မယ်။ Exception တွေကို ဖမ်းဖို့ — synchronous code အတွက် `try/catch`၊ asynchronous code အတွက် promise တွေ (ဒါမှမဟုတ်) `async` function တွေကို သုံးပါတယ်။ Express 5 မှာ async handler က reject ဖြစ်ရင် error က error handler ဆီ အလိုအလျောက် ရောက်သွားပါတယ်:

```js
app.get('/', async (req, res, next) => {
  const data = await userData() // If this promise fails, it will automatically call `next(err)`
  res.send(data)
})

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).send({ error: err.message })
})
```

**`uncaughtException` event ကို listen လုပ်တာမျိုး မလုပ်ပါနဲ့** — process က ဆက်လည်ပတ်နေပေမယ့် state က မယုံကြည်ရတော့တာမို့ crash ပြီး restart လုပ်တာကပဲ ပိုစိတ်ချရပါတယ်။ Exception handling အသေးစိတ်ကို [Error Handling](/docs/express/error-handling) မှာ ဖတ်ပါ။

## process.env.PORT နဲ့ Listen လုပ်ခြင်း

Hosting platform အများစုက — app အတွက် port ကို `process.env.PORT` ဆိုတဲ့ environment variable အနေနဲ့ ပေးပါတယ်။ App ကို ဘယ်နေရာမှာမဆို run လို့ရအောင် — port ကို environment ကနေ ဖတ်ပြီး fallback နဲ့ listen လုပ်ပါ:

```js
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
```

## Reverse Proxy နဲ့ trust proxy

Production မှာ Express ကို Nginx (သို့) HAProxy လို **reverse proxy နောက်မှာ** ထားတာ အကောင်းဆုံးပါ — compression, caching, static file, load balancing စတဲ့ အလုပ်တွေကို proxy က ယူလုပ်ပေးလို့ပါ။ ဒီလိုနေရာမျိုးမှာ — `req.ip` နဲ့ `req.protocol` တွေက proxy ရဲ့ အချက်အလက်တွေ ဖြစ်နေတာမို့ **trust proxy** setting ကို သတ်မှတ်ပေးဖို့ လိုပါတယ် — ဥပမာ `app.set('trust proxy', 1)` (ပထမ proxy တစ်ခုကို ယုံကြည်တာ)။ ဒါဆိုရင် `req.ip` က client ရဲ့ တကယ့် IP ကို ပြန်ပေးပါတယ်။ Proxy အရေအတွက်ပေါ်မူတည်ပြီး တန်ဖိုးကို ချိန်ညှိဖို့ လိုတာမို့ — [Behind Proxies guide](https://expressjs.com/en/guide/behind-proxies.html) မှာ အသေးစိတ် ဖတ်နိုင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Error Handling](/docs/express/error-handling) — exception တွေကို ဘယ်လို ကိုင်တွယ်မလဲ
- [Debugging](/docs/express/debugging) — debug log တွေနဲ့ inspector သုံးနည်း
- [Static Files ပို့ခြင်း](/docs/express/static-files) — static file တွေ ပို့နည်း
