---
title: "ALTER OPERATOR CLASS (operator class တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Operator class တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — RENAME TO (နာမည်ပြောင်းခြင်း)၊ OWNER TO (ပိုင်ရှင် ပြောင်းခြင်း) နှင့် SET SCHEMA (schema ပြောင်းခြင်း) ပုံစံများ — operator class ကို သတ်မှတ်ထားသော index method (USING index_method) ဖြင့် ရည်ညွှန်းရခြင်း"
order: 291
source: "https://www.postgresql.org/docs/current/sql-alteropclass.html"
status: translated
updated: 2026-09-04
---

## ALTER OPERATOR CLASS (operator class တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER OPERATOR CLASS — operator class တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER OPERATOR CLASS name USING index_method
    RENAME TO new_name

ALTER OPERATOR CLASS name USING index_method
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }

ALTER OPERATOR CLASS name USING index_method
    SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER OPERATOR CLASS` က operator class တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER OPERATOR CLASS` ကို သုံးဖို့ — operator class ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Owner ကို ပြောင်းဖို့ဆိုရင် — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role က operator class ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက operator class ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် သင်မလုပ်နိုင်တဲ့ ဘာ action မှ မလုပ်နိုင်ဘူးဆိုတာကို အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser ကတော့ ဘယ် operator class ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား operator class တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **index_method** — ဒီ operator class က ရည်ရွယ်ထားတဲ့ index method ရဲ့ နာမည်။
- **new_name** — Operator class ရဲ့ နာမည် အသစ်။
- **new_owner** — Operator class ရဲ့ ပိုင်ရှင် အသစ်။
- **new_schema** — Operator class အတွက် schema အသစ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER OPERATOR CLASS` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE OPERATOR CLASS](https://www.postgresql.org/docs/current/sql-createopclass.html), [DROP OPERATOR CLASS](/docs/postgresql/sql-dropopclass), [ALTER OPERATOR FAMILY](https://www.postgresql.org/docs/current/sql-alteropfamily.html)
