---
title: "Domain Types (domain type များ)"
description: "Domain type များ — base type ပေါ်တွင် constraint ထပ်ထားသော type; CHECK ဖြင့် တန်ဖိုးကန့်သတ်ခြင်း, down-cast အပြုအမူ, ALTER/DROP အသုံးပြုပုံ"
order: 65
source: "https://www.postgresql.org/docs/current/domains.html"
status: translated
updated: 2026-09-03
---

## 8.18. Domain Types (domain type များ)

*Domain* ဆိုတာ — တခြား *underlying type* (အခြေခံ type) တစ်ခုအပေါ်မှာ အခြေခံထားတဲ့ user-defined data type (အသုံးပြုသူ သတ်မှတ်သည့် data type) တစ်ခု ဖြစ်ပါတယ်။ Optional အနေနဲ့ — ၎င်းရဲ့ တရားဝင် (valid) value တွေကို underlying type က ခွင့်ပြုမယ့်အရာရဲ့ အစိတ်အပိုင်း (subset) တစ်ခုအထိပဲ ကန့်သတ်ပေးတဲ့ constraints တွေ ပါဝင်နိုင်ပါတယ်။ ဒါမှမဟုတ်ရင် — ၎င်းက underlying type လိုပဲ ပြုမူပါတယ် — ဥပမာ — underlying type မှာ သုံးလို့ရတဲ့ operator ဒါမှမဟုတ် function မှန်သမျှဟာ domain type မှာလည်း အလုပ်လုပ်ပါတယ်။ Underlying type က built-in ဒါမှမဟုတ် user-defined base type, enum type, array type, composite type, range type ဒါမှမဟုတ် တခြား domain တစ်ခု — ဘာမဆို ဖြစ်နိုင်ပါတယ်။

ဥပမာ — positive integer (အပေါင်း ကိန်းပြည့်) တွေကိုပဲ လက်ခံတဲ့ domain တစ်ခုကို integer တွေပေါ်မှာ ဖန်တီးနိုင်ပါတယ်:

```sql
CREATE DOMAIN posint AS integer CHECK (VALUE > 0);
CREATE TABLE mytable (id posint);
INSERT INTO mytable VALUES(1);   -- works
INSERT INTO mytable VALUES(-1);  -- fails
```

Domain value တစ်ခုပေါ်မှာ underlying type ရဲ့ operator ဒါမှမဟုတ် function တစ်ခုကို သုံးတဲ့အခါ — domain ကို underlying type အဖြစ် အလိုအလျောက် down-cast (အောက်သို့ cast လုပ်ခြင်း) လုပ်လိုက်ပါတယ်။ ဒါကြောင့် — ဥပမာ — `mytable.id - 1` ရဲ့ ရလဒ်ကို `posint` မဟုတ်ဘဲ `integer` type လို့ သတ်မှတ်ပါတယ်။ `(mytable.id - 1)::posint` လို့ ရေးပြီး ရလဒ်ကို `posint` အဖြစ် ပြန် cast လုပ်နိုင်ပြီး — အဲဒါဆိုရင် domain ရဲ့ constraints တွေကို ပြန်လည် စစ်ဆေးစေပါလိမ့်မယ်။ ဒီကိစ္စမှာ — အဲဒီ expression ကို 1 ဆိုတဲ့ `id` value ပေါ်မှာ သုံးခဲ့မယ်ဆိုရင် — error ဖြစ်စေပါလိမ့်မယ်။ Underlying type ရဲ့ value တစ်ခုကို domain type ရဲ့ field ဒါမှမဟုတ် variable တစ်ခုထဲကို သတ်မှတ်ပေးတာက — explicit cast မရေးသားပဲ ခွင့်ပြုပါတယ် — ဒါပေမယ့် domain ရဲ့ constraints တွေကိုတော့ စစ်ဆေးသွားမှာ ဖြစ်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [CREATE DOMAIN](https://www.postgresql.org/docs/current/sql-createdomain.html) ကို ကြည့်ပါ။
