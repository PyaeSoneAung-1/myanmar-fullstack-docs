---
title: "ALTER AGGREGATE (aggregate function တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Aggregate function တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — RENAME TO (နာမည်ပြောင်းခြင်း)၊ OWNER TO (ပိုင်ရှင် ပြောင်းခြင်း) နှင့် SET SCHEMA (schema ပြောင်းခြင်း) ပုံစံများ — ordered-set aggregates များကို ရည်ညွှန်းရာတွင် ORDER BY clause အသုံးပြုပုံ အပါအဝင်"
order: 287
source: "https://www.postgresql.org/docs/current/sql-alteraggregate.html"
status: translated
updated: 2026-09-04
---

## ALTER AGGREGATE (aggregate function တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER AGGREGATE — aggregate function တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER AGGREGATE name ( aggregate_signature ) RENAME TO new_name
ALTER AGGREGATE name ( aggregate_signature )
                OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER AGGREGATE name ( aggregate_signature ) SET SCHEMA new_schema

where aggregate_signature is:

* |
[ argmode ] [ argname ] argtype [ , ... ] |
[ [ argmode ] [ argname ] argtype [ , ... ] ] ORDER BY [ argmode ] [ argname ] argtype [ , ... ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER AGGREGATE` က aggregate function တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER AGGREGATE` ကို သုံးဖို့ — aggregate function ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Aggregate function တစ်ခုရဲ့ schema ကို ပြောင်းဖို့ — schema အသစ်ပေါ်မှာလည်း `CREATE` privilege ရှိရပါမယ်။ Owner ကို ပြောင်းဖို့ဆိုရင် — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role က aggregate function ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက aggregate function ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် သင်မလုပ်နိုင်တဲ့ ဘာ action မှ မလုပ်နိုင်ဘူးဆိုတာကို အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser ကတော့ ဘယ် aggregate function ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား aggregate function တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **argmode** — Argument တစ်ခုရဲ့ mode — IN သို့မဟုတ် VARIADIC။ ချန်လိုက်ရင် default က IN ဖြစ်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ `ALTER AGGREGATE` က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — aggregate function ရဲ့ ဝိသေသ (identity) ကို ဆုံးဖြတ်ဖို့ argument data types တွေပဲ လိုအပ်လို့ပါ။
- **argtype** — Aggregate function က လည်ပတ် (operate) လုပ်တဲ့ input data type တစ်ခု။ Argument specifications စာရင်းရဲ့ နေရာမှာ `*` ကို ရေးပြီး — argument မပါတဲ့ (zero-argument) aggregate function တစ်ခုကို ရည်ညွှန်းနိုင်ပါတယ်။ Ordered-set aggregate function တစ်ခုကို ရည်ညွှန်းဖို့ — direct နဲ့ aggregated argument specifications တွေကြားမှာ `ORDER BY` ကို ရေးပါ။
- **new_name** — Aggregate function ရဲ့ နာမည် အသစ်။
- **new_owner** — Aggregate function ရဲ့ ပိုင်ရှင် အသစ်။
- **new_schema** — Aggregate function အတွက် schema အသစ်။

## Notes (မှတ်စုများ)

Ordered-set aggregate တစ်ခုကို ရည်ညွှန်းဖို့ အကြံပြုထားတဲ့ syntax ကတော့ — [CREATE AGGREGATE](https://www.postgresql.org/docs/current/sql-createaggregate.html) မှာ ရှိတဲ့ ပုံစံအတိုင်း — direct နဲ့ aggregated argument specifications တွေကြားမှာ `ORDER BY` ကို ရေးတာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — `ORDER BY` ကို ချန်လိုက်ပြီး — direct နဲ့ aggregated argument specifications တွေကို စာရင်း တစ်ခုတည်းအဖြစ် ရောမွှေရေးတာကလည်း အလုပ်လုပ်ပါတယ်။ ဒီ အတိုကောက် (abbreviated) ပုံစံမှာ — `VARIADIC "any"` ကို direct နဲ့ aggregated argument lists နှစ်ခုလုံးမှာ သုံးထားရင် — `VARIADIC "any"` ကို တစ်ကြိမ်ပဲ ရေးပါ။

## Examples (ဥပမာများ)

`integer` type အတွက် `myavg` ဆိုတဲ့ aggregate function ကို `my_average` အဖြစ် နာမည်ပြောင်းဖို့:

```sql
ALTER AGGREGATE myavg(integer) RENAME TO my_average;
```

`integer` type အတွက် `myavg` ဆိုတဲ့ aggregate function ရဲ့ owner ကို `joe` အဖြစ် ပြောင်းဖို့:

```sql
ALTER AGGREGATE myavg(integer) OWNER TO joe;
```

Direct argument က `float8` type ဖြစ်ပြီး aggregated argument က `integer` type ဖြစ်တဲ့ `mypercentile` ဆိုတဲ့ ordered-set aggregate ကို `myschema` schema ထဲကို ရွှေ့ဖို့:

```sql
ALTER AGGREGATE mypercentile(float8 ORDER BY integer) SET SCHEMA myschema;
```

ဒါကလည်း အလုပ်လုပ်ပါလိမ့်မယ်:

```sql
ALTER AGGREGATE mypercentile(float8, integer) SET SCHEMA myschema;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER AGGREGATE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE AGGREGATE](https://www.postgresql.org/docs/current/sql-createaggregate.html), [DROP AGGREGATE](/docs/postgresql/sql-dropaggregate)
