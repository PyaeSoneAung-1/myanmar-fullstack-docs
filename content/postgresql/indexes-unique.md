---
title: "Unique Indexes (unique index များ)"
description: "Unique index တွေက column တန်ဖိုး ဒါမှမဟုတ် column ပေါင်းစုံတန်ဖိုးတွေရဲ့ uniqueness ကို အတင်းအကျပ် လိုက်နာစေပုံ၊ null တန်ဖိုးတွေကို ကိုင်တွယ်ပုံနဲ့ unique constraint / primary key အတွက် အလိုအလျောက် ဖန်တီးခံရပုံ"
order: 79
source: "https://www.postgresql.org/docs/current/indexes-unique.html"
status: translated
updated: 2026-09-03
---

## 11.6. Unique Indexes (unique index များ)

Index တွေကို — column တစ်ခုရဲ့ တန်ဖိုး ဒါမှမဟုတ် column တစ်ခုထက်ပိုရဲ့ ပေါင်းစပ်ထားတဲ့ တန်ဖိုးတွေရဲ့ uniqueness (ထူးခြားမှု) ကို အတင်းအကျပ် လိုက်နာစေဖို့လည်း သုံးနိုင်ပါတယ်။

```sql
CREATE UNIQUE INDEX name ON table (column [, ...]) [ NULLS [ NOT ] DISTINCT ];
```

လောလောဆယ်မှာတော့ B-tree index တွေကိုပဲ unique လို့ ကြေညာလို့ ရပါတယ်။

Index တစ်ခုကို unique လို့ ကြေညာလိုက်ရင် — index လုပ်ထားတဲ့ တန်ဖိုး တူညီတဲ့ table row အများအပြား ရှိနေတာကို ခွင့်မပြုပါဘူး။ ပုံမှန်အားဖြင့် — unique column ထဲက null value တွေကို တူညီတယ်လို့ မသတ်မှတ်တာကြောင့် — column ထဲမှာ null အများအပြား ရှိနေခွင့် ရှိပါတယ်။ `NULLS NOT DISTINCT` option က ဒါကို ပြုပြင်ပြီး — index က null တွေကို တူညီတယ်လို့ သဘောထားစေပါတယ်။ Multicolumn unique index တစ်ခုကတော့ — row အများအပြားမှာ index လုပ်ထားတဲ့ column တွေ အားလုံးရဲ့ တန်ဖိုးတွေ တူညီနေတဲ့ အခြေအနေမျိုးကိုပဲ ငြင်းပယ်ပါတယ်။

Table တစ်ခုအတွက် unique constraint ဒါမှမဟုတ် primary key ကို သတ်မှတ်လိုက်တဲ့အခါ — PostgreSQL က unique index တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ အဲဒီ index က primary key ဒါမှမဟုတ် unique constraint ကို ဖွဲ့စည်းထားတဲ့ column တွေကို လွှမ်းခြုံပြီး — (သင့်လျော်ရင် multicolumn index အနေနဲ့) — အဲဒီ constraint ကို အတင်းအကျပ် လိုက်နာစေတဲ့ ယန္တရား ဖြစ်ပါတယ်။

> **မှတ်ချက်:** Unique column တွေပေါ်မှာ index တွေကို ကိုယ်တိုင် ဖန်တီးစရာ မလိုပါဘူး — အဲဒီလို လုပ်တာက အလိုအလျောက် ဖန်တီးထားတဲ့ index ကို ထပ်ပွားနေရုံပဲ ဖြစ်ပါတယ်။
