---
title: "Other Database Objects (အခြား database object များ)"
description: "Table မဟုတ်ဘဲ database ထဲမှာ ဖန်တီးလို့ရတဲ့ အခြား object အမျိုးအစားများ — views, functions/procedures/operators, data types/domains, triggers — ရဲ့ အကျဉ်းချုပ် စာရင်း"
order: 32
source: "https://www.postgresql.org/docs/current/ddl-others.html"
status: translated
updated: 2026-09-03
---

## 5.14. Other Database Objects (အခြား database object များ)

Table တွေက relational database တည်ဆောက်ပုံရဲ့ အဓိက object တွေ ဖြစ်ပါတယ် — အကြောင်းကတော့ သင့် data တွေကို သူတို့ကမှ ကိုင်ထားလို့ပါ။ ဒါပေမယ့် database တစ်ခုထဲမှာ ရှိနေတဲ့ object တွေက table တွေတင် မဟုတ်ပါဘူး။ Data တွေကို သုံးစွဲရတာ နဲ့ စီမံခန့်ခွဲရတာ ပိုမို ထိရောက် ဒါမှမဟုတ် အဆင်ပြေစေဖို့ — တခြား object အမျိုးအစား များစွာကိုလည်း ဖန်တီးနိုင်ပါတယ်။ ဒီ object တွေကို ဒီ chapter ထဲမှာ ဆွေးနွေးမှာ မဟုတ်ပေမယ့် — ဘာတွေ ဖြစ်နိုင်လဲဆိုတာ သတိပြုမိစေဖို့ ဒီမှာ စာရင်း ပေးထားပါတယ်:

- Views
- Functions, procedures, and operators
- Data types and domains
- Triggers and rewrite rules

ဒီ topic တွေရဲ့ အသေးစိတ် အချက်အလက်တွေကို [အပိုင်း V](https://www.postgresql.org/docs/current/server-programming.html) မှာ တွေ့ရှိနိုင်ပါတယ်။
