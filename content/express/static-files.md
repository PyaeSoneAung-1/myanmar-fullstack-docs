---
title: "Static Files ပို့ခြင်း"
description: "express.static() built-in middleware နဲ့ image, CSS, JavaScript စတဲ့ static file တွေကို ပို့နည်း — public folder၊ static directory အများအပြား၊ virtual path prefix နဲ့ absolute path သုံးနည်း"
order: 6
source: "https://expressjs.com/en/starter/static-files.html"
status: translated
updated: 2026-09-01
---

## Static Files ဆိုတာ ဘာလဲ

**Static file** တွေဆိုတာ — server မှာ ကြိုတင်ရှိနေတဲ့ image, CSS, JavaScript လို file တွေပါ။ Express မှာ ဒီလို file တွေကို ပို့ဖို့ **`express.static`** ဆိုတဲ့ built-in middleware ကို သုံးပါတယ်။ Function signature က ဒီလိုပါ:

`express.static(root, [options])`

`root` argument က static file တွေကို ဘယ် directory ကနေ ပို့မလဲဆိုတာ သတ်မှတ်ပေးပြီး — `options` ကတော့ ချိန်ညှိစရာတွေပါ။ (`express.static` အကြောင်း [Middleware အခြေခံ](/docs/express/middleware) မှာလည်း ဖတ်နိုင်ပါတယ်။)

## Public Folder ကို ပို့ခြင်း

`public` ဆိုတဲ့ folder ထဲက image, CSS, JavaScript file တွေကို ပို့ချင်ရင် — အောက်ပါအတိုင်း mount လုပ်ပါတယ်:

```js
app.use(express.static('public'))
```

အခုဆိုရင် `public` folder ထဲက file တွေကို `http://localhost:3000/images/kitten.jpg`, `http://localhost:3000/css/style.css`, `http://localhost:3000/js/app.js`, `http://localhost:3000/hello.html` လို URL တွေနဲ့ ရနိုင်ပါပြီ။ သတိထားစရာက — Express က static directory ကို အခြေခံပြီး file တွေကို ရှာတာမို့ **static directory ရဲ့ နာမည်က URL ထဲမှာ မပါပါဘူး**။

## Static Directory အများအပြား

Static directory တစ်ခုထက်ပိုပြီး သုံးချင်ရင် — `express.static` ကို အကြိမ်များစွာ ခေါ်ပါတယ်:

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

Express က directory တွေကို `express.static` သတ်မှတ်ထားတဲ့ **အစဉ်လိုက်အတိုင်း** ရှာပါတယ်။ ဒါ့အပြင် middleware အားလုံးလိုပဲ order က အရေးကြီးတာမို့ — static file တွေကို route တွေရဲ့ **ရှေ့မှာ** ထားတာ အကောင်းဆုံးပါ။ ဒါဆိုရင် file request တွေက route တွေဆီ မရောက်ခင် static middleware နဲ့ပဲ ဖြေရှင်းခံရလို့ပါ။ Production မှာ static file ပို့တဲ့ performance ပိုကောင်းချင်ရင် reverse proxy cache နဲ့ တွဲသုံးတာ အကောင်းဆုံးပါ။

## Virtual Path Prefix

Static file တွေကို URL မှာ မတူတဲ့ path တစ်ခုကနေ ပို့ချင်ရင် — `app.use()` မှာ mount path (virtual path prefix) သတ်မှတ်ပေးပါတယ်:

```js
app.use('/static', express.static('public'))
```

အခုဆိုရင် `public` folder ထဲက file တွေကို `/static` prefix ကနေ ရနိုင်ပါပြီ — ဥပမာ `http://localhost:3000/static/images/kitten.jpg` ။ `/static` က file system ထဲမှာ တကယ်မရှိတဲ့ **virtual path** ဖြစ်တာကို သတိပြုပါ။

## Absolute Path သုံးခြင်း

`express.static('public')` လို relative path ရေးထားရင် — **node process ကို ဘယ် directory ကနေ run လုပ်လဲဆိုတာပေါ်မူတည်ပြီး** folder ရှာတဲ့နေရာ ပြောင်းနိုင်ပါတယ်။ App ကို တခြား directory ကနေ run လုပ်ရင်လည်း အမြဲ အလုပ်လုပ်ဖို့ — `path.join(__dirname, ...)` နဲ့ absolute path သုံးတာ ပိုစိတ်ချရပါတယ်:

```js
const path = require('path')

app.use('/static', express.static(path.join(__dirname, 'public')))
```

`__dirname` က လက်ရှိ file ရှိနေတဲ့ directory ကို ပြတာမို့ — app ကို ဘယ်ကနေ run လုပ်လုပ်တည်ငြိမ်စွာ အလုပ်လုပ်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Middleware အခြေခံ](/docs/express/middleware) — app.use() နဲ့ middleware mount လုပ်ခြင်း
- [Express စတင်ခြင်း](/docs/express/getting-started) — Express app တစ်ခု စတင်ခြင်း
- [Production Best Practices](/docs/express/best-practices) — production မှာ app ကို ဘယ်လို ပြင်ဆင်မလဲ
