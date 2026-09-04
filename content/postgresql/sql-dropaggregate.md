---
title: "DROP AGGREGATE (aggregate function တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား aggregate function တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option၊ zero-argument နှင့် ordered-set aggregates များအတွက် aggregate_signature ရေးပုံ (VARIADIC \"any\" အပါအဝင်)၊ CASCADE/RESTRICT အပြုအမူများနှင့် command တစ်ခုတည်းဖြင့် aggregate အများအပြား ဖယ်ရှားခြင်း"
order: 288
source: "https://www.postgresql.org/docs/current/sql-dropaggregate.html"
status: translated
updated: 2026-09-04
---

## DROP AGGREGATE (aggregate function တစ်ခုကို ဖယ်ရှားခြင်း)

DROP AGGREGATE — aggregate function တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP AGGREGATE [ IF EXISTS ] name ( aggregate_signature ) [, ...] [ CASCADE | RESTRICT ]

where aggregate_signature is:

* |
[ argmode ] [ argname ] argtype [ , ... ] |
[ [ argmode ] [ argname ] argtype [ , ... ] ] ORDER BY [ argmode ] [ argname ] argtype [ , ... ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP AGGREGATE` က ရှိပြီးသား aggregate function တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — လက်ရှိ user က aggregate function ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Aggregate မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ရှိပြီးသား aggregate function တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **argmode** — Argument တစ်ခုရဲ့ mode — IN သို့မဟုတ် VARIADIC။ ချန်လိုက်ရင် default က IN ဖြစ်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ `DROP AGGREGATE` က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — aggregate function ရဲ့ ဝိသေသ (identity) ကို ဆုံးဖြတ်ဖို့ argument data types တွေပဲ လိုအပ်လို့ပါ။
- **argtype** — Aggregate function က လည်ပတ် (operate) လုပ်တဲ့ input data type တစ်ခု။ Argument specifications စာရင်းရဲ့ နေရာမှာ `*` ကို ရေးပြီး — argument မပါတဲ့ (zero-argument) aggregate function တစ်ခုကို ရည်ညွှန်းနိုင်ပါတယ်။ Ordered-set aggregate function တစ်ခုကို ရည်ညွှန်းဖို့ — direct နဲ့ aggregated argument specifications တွေကြားမှာ `ORDER BY` ကို ရေးပါ။
- **CASCADE** — Aggregate function ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Aggregate function ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — aggregate function ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

Ordered-set aggregates တွေကို ရည်ညွှန်းဖို့ ရွေးချယ်စရာ (alternative) syntaxes တွေကို [ALTER AGGREGATE](/docs/postgresql/sql-alteraggregate) အောက်မှာ ဖော်ပြထားပါတယ်။

## Examples (ဥပမာများ)

`integer` type အတွက် `myavg` ဆိုတဲ့ aggregate function ကို ဖယ်ရှားဖို့:

```sql
DROP AGGREGATE myavg(integer);
```

Ordering columns တွေရဲ့ ကြိုက်ရာ (arbitrary) စာရင်း တစ်ခုနဲ့ ကိုက်ညီတဲ့ direct arguments စာရင်း တစ်ခုကို လက်ခံတဲ့ `myrank` ဆိုတဲ့ hypothetical-set aggregate function ကို ဖယ်ရှားဖို့:

```sql
DROP AGGREGATE myrank(VARIADIC "any" ORDER BY VARIADIC "any");
```

Command တစ်ခုတည်းနဲ့ aggregate functions အများအပြားကို ဖယ်ရှားဖို့:

```sql
DROP AGGREGATE myavg(integer), myavg(bigint);
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP AGGREGATE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER AGGREGATE](/docs/postgresql/sql-alteraggregate), [CREATE AGGREGATE](https://www.postgresql.org/docs/current/sql-createaggregate.html)
