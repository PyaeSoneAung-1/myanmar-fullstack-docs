---
title: "Express ဥပမာများ"
description: "Express ကို သုံးထားတဲ့ application examples တွေရဲ့ စာရင်း — auth, cookies, sessions, MVC, routing, static files စတဲ့ use case အမျိုးမျိုးကို လေ့လာဖို့"
order: 17
source: "https://expressjs.com/en/starter/examples.html"
status: translated
updated: 2026-09-01
---

## Express ဥပမာများ

ဒီ page မှာ Express ကို သုံးထားတဲ့ examples တွေရဲ့ စာရင်းကို တွေ့ရမှာပါ။

- [auth](https://github.com/expressjs/express/tree/master/examples/auth) — login နဲ့ password သုံးတဲ့ authentication (အထောက်အထား စစ်ဆေးခြင်း)
- [content-negotiation](https://github.com/expressjs/express/tree/master/examples/content-negotiation) — HTTP content negotiation (client ရဲ့ လိုအပ်ချက်အလိုက် response အမျိုးအစား ရွေးပေးခြင်း)
- [cookie-sessions](https://github.com/expressjs/express/tree/master/examples/cookie-sessions) — cookie အခြေပြု session တွေနဲ့ အလုပ်လုပ်ခြင်း
- [cookies](https://github.com/expressjs/express/tree/master/examples/cookies) — cookie တွေနဲ့ အလုပ်လုပ်ခြင်း
- [downloads](https://github.com/expressjs/express/tree/master/examples/downloads) — file တွေကို client ဆီ transfer လုပ်ခြင်း
- [ejs](https://github.com/expressjs/express/tree/master/examples/ejs) — Embedded JavaScript templating (ejs) နဲ့ အလုပ်လုပ်ခြင်း
- [error-pages](https://github.com/expressjs/express/tree/master/examples/error-pages) — error page တွေ ဖန်တီးခြင်း
- [error](https://github.com/expressjs/express/tree/master/examples/error) — error middleware နဲ့ အလုပ်လုပ်ခြင်း
- [hello-world](https://github.com/expressjs/express/tree/master/examples/hello-world) — ရိုးရှင်းတဲ့ request handler
- [markdown](https://github.com/expressjs/express/tree/master/examples/markdown) — Markdown ကို template engine အဖြစ် သုံးခြင်း
- [multi-router](https://github.com/expressjs/express/tree/master/examples/multi-router) — Express router အများအပြားနဲ့ အလုပ်လုပ်ခြင်း
- [mvc](https://github.com/expressjs/express/tree/master/examples/mvc) — MVC ပုံစံ controller တွေ
- [online](https://github.com/expressjs/express/tree/master/examples/online) — `online` နဲ့ `redis` package တွေသုံးပြီး online ရှိနေတဲ့ user တွေရဲ့ လှုပ်ရှားမှုကို ခြေရာခံခြင်း
- [params](https://github.com/expressjs/express/tree/master/examples/params) — route parameters တွေနဲ့ အလုပ်လုပ်ခြင်း
- [resource](https://github.com/expressjs/express/tree/master/examples/resource) — resource တစ်ခုတည်းပေါ်မှာ HTTP operation အမျိုးမျိုး လုပ်ခြင်း
- [route-map](https://github.com/expressjs/express/tree/master/examples/route-map) — map တစ်ခုသုံးပြီး routes တွေကို စီစဉ်ခြင်း
- [route-middleware](https://github.com/expressjs/express/tree/master/examples/route-middleware) — route middleware နဲ့ အလုပ်လုပ်ခြင်း
- [route-separation](https://github.com/expressjs/express/tree/master/examples/route-separation) — resource တစ်ခုစီအလိုက် routes တွေကို ခွဲခြားစီစဉ်ခြင်း
- [search](https://github.com/expressjs/express/tree/master/examples/search) — Search API
- [session](https://github.com/expressjs/express/tree/master/examples/session) — user session တွေ
- [static-files](https://github.com/expressjs/express/tree/master/examples/static-files) — static files တွေကို serve လုပ်ခြင်း
- [vhost](https://github.com/expressjs/express/tree/master/examples/vhost) — virtual hosts တွေနဲ့ အလုပ်လုပ်ခြင်း
- [view-constructor](https://github.com/expressjs/express/tree/master/examples/view-constructor) — views တွေကို dynamically render လုပ်ခြင်း
- [view-locals](https://github.com/expressjs/express/tree/master/examples/view-locals) — middleware calls ကြားမှာ request object ထဲ data တွေ သိမ်းခြင်း
- [web-service](https://github.com/expressjs/express/tree/master/examples/web-service) — ရိုးရှင်းတဲ့ API service

## နောက်ထပ် examples များ

ဒါတွေကတော့ ပိုကျယ်ပြန့်တဲ့ integrations တွေ ပါဝင်တဲ့ နောက်ထပ် examples တွေပါ။

> **သတိပြုရန်:** ဒီအချက်အလက်တွေက Expressjs team က ထိန်းသိမ်းမထားတဲ့ third-party site တွေ၊ product တွေ၊ module တွေအကြောင်း ဖြစ်ပါတယ်။ ဒီနေရာမှာ စာရင်းသွင်းထားတာက Expressjs project team ရဲ့ endorsement (ထောက်ခံချက်) သို့မဟုတ် recommendation (အကြံပြုချက်) မဟုတ်ပါဘူး။

- [prisma-rest-api-ts](https://github.com/prisma/prisma-examples/tree/latest/orm/express) — [Prisma](https://www.npmjs.com/package/prisma) ကို ORM အဖြစ်သုံးပြီး TypeScript နဲ့ ရေးထားတဲ့ Express REST API
