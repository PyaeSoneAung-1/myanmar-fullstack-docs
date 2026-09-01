---
title: "Debugging"
description: "Express app တွေကို debug လုပ်နည်း — DEBUG environment variable နဲ့ internal log တွေ ကြည့်ခြင်း၊ debug namespace တွေ၊ Node.js inspector (--inspect, --inspect-brk) နဲ့ nodemon အကြောင်း"
order: 8
source: "https://expressjs.com/en/guide/debugging.html"
status: translated
updated: 2026-09-01
---

## DEBUG Environment Variable

Express ထဲမှာ သုံးထားတဲ့ **internal log တွေအားလုံးကို** ကြည့်ချင်ရင် — app ကို run လုပ်တဲ့အခါ `DEBUG` environment variable ကို သတ်မှတ်ပေးရပါတယ်:

```bash
DEBUG=express:*,router,router:* node index.js
```

`express:*` က Express app ရဲ့ namespace တွေကို ဖွင့်ပေးပြီး — routing ကို သီးခြား `router` package က ကိုင်တွယ်တာမို့ အဲဒီ log တွေက `router` namespace အောက်မှာ ရှိပါတယ်။ `DEBUG=express:*` လို့ပဲ သတ်မှတ်ရင် Express ရဲ့ log တွေကို မြင်ရမှာဖြစ်ပြီး — `DEBUG=express:router` (သို့) `DEBUG=router,router:*` ဆိုရင် router ရဲ့ log တွေကို သီးသန့် ကြည့်လို့ရပါတယ်။ Windows PowerShell မှာတော့ `$env:DEBUG = "express:*,router,router:*"; node index.js` လို ရေးပါတယ်။

## Debug Namespace တွေက ဘာတွေ ပြသလဲ

`express:application` namespace က app ရဲ့ setting တွေ — env, etag, trust proxy စတာတွေ သတ်မှတ်နေတာကို ပြပြီး — `router` namespace က route တွေ ဘယ်လို မှတ်ပုံတင်နေလဲ (route အသစ် ထည့်တာ၊ layer တွေ ဖန်တီးတာ) ကို ပြပါတယ်။ Request တစ်ခု ဝင်လာရင်လည်း — ဘယ် route ကို dispatch လုပ်နေလဲဆိုတာကို ဒီလို log တွေနဲ့ မြင်ရပါတယ်:

```bash
router dispatching GET /users
router jsonParser  : /users
router trim prefix (/users) from url /users
router router /users : /users
router dispatching GET /
```

ဒီလို log တွေက — route တစ်ခု match မဖြစ်တာ (သို့) middleware တစ်ခုမှာ ပြဿနာရှိတာမျိုးကို ဘယ်နေရာမှာ ဖြစ်နေလဲ ရှာရတာ အများကြီး လွယ်ကူစေပါတယ်။

## Node.js Inspector နဲ့ Breakpoint

Debug log က app က ဘာတွေ လုပ်ခဲ့လဲဆိုတာကို ပြတာပါ — **code တစ်ကြောင်းချင်း step လုပ်ပြီး** ကြည့်ချင်ရင်တော့ Node.js ရဲ့ built-in inspector ကို သုံးပါတယ်:

```bash
node --inspect index.js
node --inspect-brk index.js
```

ပထမ command နဲ့ run လုပ်ပြီး — Chrome DevTools (`chrome://inspect`) ဒါမှမဟုတ် VS Code လို debugging client ကနေ attach လုပ်ကာ route handler နဲ့ middleware တွေထဲမှာ breakpoint ချပြီး step through လုပ်နိုင်ပါတယ်။ App **စတင်တဲ့အချိန်က** ဖြစ်တဲ့ အရာတွေကို debug ချင်ရင်တော့ — `--inspect-brk` ကို သုံးပါတယ်။ ဒါက debugger attach မလုပ်မချင်း ပထမဆုံး line မှာ execution ကို ရပ်ထားပေးပါတယ်။

## Nodemon နဲ့ Development Workflow

Development လုပ်နေစဉ် — code ပြောင်းတိုင်း `node index.js` ကို ကိုယ်တိုင် ပြန်ဖွင့်ရတာ ငြီးငွေ့စရာပါ။ **nodemon** လို tool က file တွေရဲ့ ပြောင်းလဲမှုကို watch လုပ်ပြီး — app ကို အလိုအလျောက် restart လုပ်ပေးပါတယ်:

```bash
npm install --save-dev nodemon
npx nodemon index.js
```

Manual restart မလိုဘဲ ပြောင်းလဲမှုတိုင်းကို ချက်ချင်း စမ်းသပ်နိုင်တာမို့ — debug လုပ်ရတာ ပိုမြန်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Error Handling](/docs/express/error-handling) — error တွေကို ဘယ်လို ကိုင်တွယ်မလဲ
- [Production Best Practices](/docs/express/best-practices) — production မှာ logging နဲ့ exception handling
- [Middleware ရေးနည်း](/docs/express/writing-middleware) — ကိုယ်ပိုင် middleware ရေးခြင်း
