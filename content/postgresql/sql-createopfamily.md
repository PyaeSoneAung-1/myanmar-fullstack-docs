---
title: "CREATE OPERATOR FAMILY (operator family အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Operator family အသစ်တစ်ခုကို ဖန်တီး (define) ပေးသည့် command — operator family သည် ဆက်စပ်နေသော operator classes များနှင့် cross-data-type operators/support functions များ စုစည်းရာ နေရာ ဖြစ်ခြင်း — USING index_method ဖြင့် ရည်ရွယ်ထားသော index method အတွက် ဖန်တီးရခြင်း၊ လောလောဆယ် superusers များသာ ဖန်တီးနိုင်ခြင်း"
order: 293
source: "https://www.postgresql.org/docs/current/sql-createopfamily.html"
status: translated
updated: 2026-09-04
---

## CREATE OPERATOR FAMILY (operator family အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE OPERATOR FAMILY — operator family အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE OPERATOR FAMILY name USING index_method
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE OPERATOR FAMILY` က operator family အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Operator family တစ်ခုက — ဆက်စပ်နေတဲ့ operator classes တွေရဲ့ အစုအဝေး တစ်ခုကို သတ်မှတ်ပေးပြီး — ဖြစ်နိုင်ရင် — ဒီ operator classes တွေနဲ့ လိုက်ဖက်ညီပေမယ့် — index တစ်ခုချင်းစီရဲ့ လုပ်ဆောင်မှု အတွက် မရှိမဖြစ် မဟုတ်တဲ့ — operators နဲ့ support functions အပိုတချို့လည်း ပါဝင်နိုင်ပါတယ်။ (Indexes တွေအတွက် မရှိမဖြစ် ဖြစ်တဲ့ operators နဲ့ functions တွေကို — operator family ထဲမှာ "loose" (သီးခြား လျှော့ထား) အနေနဲ့ ရှိနေစေမယ့်အစား — သက်ဆိုင်ရာ operator class အတွင်းမှာ အုပ်စုဖွဲ့ ထားသင့်ပါတယ်။ ပုံမှန်အားဖြင့် — data type တစ်ခုတည်း ပါဝင်တဲ့ operators တွေက operator classes တွေဆီ ချိတ်ဆွဲထားပြီး — data type အမျိုးမျိုး ကူးသန်း (cross-data-type) လုပ်တဲ့ operators တွေကတော့ — data types နှစ်ခုလုံးအတွက် operator classes တွေ ပါဝင်တဲ့ operator family တစ်ခုထဲမှာ loose အနေနဲ့ ရှိနေနိုင်ပါတယ်။)

Operator family အသစ်က အစပိုင်းမှာ အလွတ် (empty) ဖြစ်ပါတယ်။ ၎င်းကို — နောက်ဆက်တွဲ `CREATE OPERATOR CLASS` commands တွေ ထုတ်ပြန်ပြီး operator classes ပါဝင်စေရန် ထည့်သွင်းခြင်း၊ ရွေးချယ်နိုင်တဲ့ အနေနဲ့ — `ALTER OPERATOR FAMILY` commands တွေ ထုတ်ပြန်ပြီး "loose" operators နဲ့ သူတို့ရဲ့ သက်ဆိုင်ရာ support functions တွေ ထည့်သွင်းခြင်းအားဖြင့် — ဖြည့်တင်းသင့်ပါတယ်။

Schema နာမည် တစ်ခု ပေးထားရင် — operator family ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ Schema တစ်ခုတည်းထဲက operator families နှစ်ခုက — index methods မတူညီတဲ့အတွက်သာ ဖြစ်ရင် — နာမည် တူညီနိုင်ပါတယ်။

Operator family တစ်ခုကို သတ်မှတ်တဲ့ (define) user က ၎င်းရဲ့ owner ဖြစ်လာပါတယ်။ လောလောဆယ် — ဖန်တီးတဲ့ user က superuser ဖြစ်ရပါမယ်။ (ဒီ ကန့်သတ်ချက်ကို — မှားယွင်းတဲ့ operator family definition တစ်ခုက server ကို ရှုပ်ထွေးစေနိုင်လို့ ဒါမှမဟုတ် crash ဖြစ်စေနိုင်လို့ — ပြုလုပ်ထားတာပါ။)

နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 36.16](https://www.postgresql.org/docs/current/xindex.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် operator family ရဲ့ နာမည်။ နာမည်က schema-qualified (schema ပါဝင်သော) လည်း ဖြစ်နိုင်ပါတယ်။
- **index_method** — ဒီ operator family က ရည်ရွယ်ထားတဲ့ index method ရဲ့ နာမည်။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE OPERATOR FAMILY` က PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။ SQL standard ထဲမှာ `CREATE OPERATOR FAMILY` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER OPERATOR FAMILY](https://www.postgresql.org/docs/current/sql-alteropfamily.html), [DROP OPERATOR FAMILY](/docs/postgresql/sql-dropopfamily), [CREATE OPERATOR CLASS](https://www.postgresql.org/docs/current/sql-createopclass.html), [ALTER OPERATOR CLASS](/docs/postgresql/sql-alteropclass), [DROP OPERATOR CLASS](/docs/postgresql/sql-dropopclass)
