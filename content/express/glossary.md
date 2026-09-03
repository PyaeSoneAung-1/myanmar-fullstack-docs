---
title: "Glossary (အသုံးအနှုန်း အဘိဓာန်)"
description: "Express.js, Node.js, middleware, routing စတဲ့ အဓိက သဘောတရားတွေနဲ့ ဆိုင်တဲ့ အသုံးအနှုန်းတွေကို ရှင်းပြထားတဲ့ glossary — Express ကို ထိရောက်စွာ နားလည်ပြီး အသုံးပြုနိုင်ဖို့ ကူညီပေးပါတယ်"
order: 24
source: "https://expressjs.com/en/resources/glossary.html"
status: translated
updated: 2026-09-03
---

## application

ယေဘုယျအားဖြင့် — ရည်ရွယ်ချက် တစ်ခုခုအတွက် လုပ်ငန်းဆောင်တာတွေ လုပ်ဆောင်ဖို့ ဒီဇိုင်းထုတ်ထားတဲ့ program တစ်ခု (သို့) program တစ်ခုထက်ပိုတဲ့ အစုအဝေးပါ။ Express ရဲ့ context မှာတော့ — Node.js platform ပေါ်မှာ Express API ကို သုံးပြီး run နေတဲ့ program တစ်ခုကို ဆိုလိုပါတယ်။ [app object](https://expressjs.com/api/express) ကိုလည်း ရည်ညွှန်းတာ ဖြစ်နိုင်ပါတယ်။

## API

Application programming interface ပါ။ ဒီအတိုကောက်ကို ပထမဆုံးအကြိမ် သုံးတဲ့အခါ အပြည့်အစုံ ရေးသားပါ။

## Express

Node.js application တွေအတွက် မြန်ဆန်ပြီး၊ un-opinionated (ကိုယ်ပိုင် ပုံစံကို ကြိုမသတ်မှတ်ထားတဲ့)၊ minimalist ဖြစ်တဲ့ web framework တစ်ခုပါ။ ယေဘုယျအားဖြင့် "Express" လို့ ခေါ်တာကို "Express.js" ထက် ပိုနှစ်သက်ပေမယ့် — နောက်တစ်ခုကလည်း လက်ခံနိုင်ပါတယ်။

## libuv

Asynchronous I/O ကို အဓိက အာရုံစိုက်တဲ့ multi-platform support library တစ်ခုဖြစ်ပြီး — Node.js မှာ အသုံးပြုဖို့ အဓိက တီထွင်ထားတာပါ။

## middleware

Express ရဲ့ routing layer က နောက်ဆုံး request handler မတိုင်ခင် invoke လုပ်ပေးတဲ့ function တစ်ခုဖြစ်ပြီး — raw request တစ်ခုနဲ့ နောက်ဆုံး ရည်ရွယ်ထားတဲ့ route ကြားထဲ (middle မှာ) တည်ရှိပါတယ်။ Middleware နဲ့ ပတ်သက်တဲ့ ဝေါဟာရ အသေးစိတ် အနည်းငယ်:

- `var foo = require('middleware')` ဆိုတာက Node.js module တစ်ခုကို _requiring_ (သို့) _using_ လုပ်တာလို့ ခေါ်ပါတယ်။ နောက်ပြီး `var mw = foo()` ဆိုတဲ့ statement က ပုံမှန်အားဖြင့် middleware ကို ပြန်ပေးပါတယ်။
- `app.use(mw)` ဆိုတာက middleware ကို _global processing stack ထဲထည့်ခြင်း_ လို့ ခေါ်ပါတယ်။
- `app.get('/foo', mw, (req, res) => { /* ... */ })` ဆိုတာက middleware ကို _"GET /foo" processing stack ထဲထည့်ခြင်း_ လို့ ခေါ်ပါတယ်။

## Node.js

Scalable network application တွေ တည်ဆောက်ဖို့ သုံးတဲ့ software platform တစ်ခုပါ။ Node.js က JavaScript ကို scripting language အဖြစ် သုံးပြီး — non-blocking I/O နဲ့ single-threaded event loop ကြောင့် throughput မြင့်မားပါတယ်။ [nodejs.org](https://nodejs.org/en/) မှာ ကြည့်နိုင်ပါတယ်။ **အသုံးပြုပုံ မှတ်ချက်**: အစပိုင်းမှာ "Node.js" လို့ သုံးပြီး — နောက်ပိုင်းမှာ "Node" လို့ သုံးပါ။

## open-source, open source

Adjective အနေနဲ့ သုံးတဲ့အခါ hyphen ခံပါ — ဥပမာ: "This is open-source software." ဆိုတာမျိုးပါ။ [Wikipedia ပေါ်က Open-source software](https://en.wikipedia.org/wiki/Open-source_software) ကို ကြည့်ပါ။

> **မှတ်ချက်:** ဒီအသုံးအနှုန်းကို hyphen မခံဘဲ ရေးလေ့ ရှိကြပေမယ့် — compound adjective (ပေါင်းစပ်နာမဝိသေသန) တစ်ခုအတွက် စံအင်္ဂလိပ် စည်းမျဉ်းတွေကို ဒီမှာ လိုက်နာ သုံးထားပါတယ်။

## request

HTTP request တစ်ခုပါ။ Client တစ်ခုက HTTP request message ကို server ဆီ ပို့လိုက်ပြီး — server က response ပြန်ပေးပါတယ်။ Request က GET, POST စတဲ့ [request methods](https://en.wikipedia.org/wiki/HTTP#Request_methods) တွေထဲက တစ်ခုကို သုံးရပါတယ်။

## response

HTTP response တစ်ခုပါ။ Server က HTTP response message ကို client ဆီ ပြန်ပို့ပါတယ်။ Response ထဲမှာ request ရဲ့ ပြီးဆုံးမှု အခြေအနေ အချက်အလက်တွေ ပါဝင်ပြီး — message body ထဲမှာ တောင်းဆိုထားတဲ့ content တွေလည်း ပါနိုင်ပါတယ်။

## route

Resource တစ်ခုကို ခွဲခြား သတ်မှတ်ပေးတဲ့ URL ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ ဥပမာ — `http://foo.com/products/id` ထဲမှာ "/products/id" က route ဖြစ်ပါတယ်။

## router

API reference ထဲက [router](https://expressjs.com/api/router) ကို ကြည့်ပါ။
