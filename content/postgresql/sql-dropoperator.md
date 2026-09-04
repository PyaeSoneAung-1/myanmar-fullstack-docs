---
title: "DROP OPERATOR (operator တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Database system မှ ရှိပြီးသား operator တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option၊ left_type/right_type (unary operators များအတွက် NONE အပါအဝင်) ဖြင့် operator ရည်ညွှန်းပုံ၊ CASCADE/RESTRICT အပြုအမူများနှင့် command တစ်ခုတည်းဖြင့် operator အများအပြား ဖယ်ရှားခြင်း"
order: 290
source: "https://www.postgresql.org/docs/current/sql-dropoperator.html"
status: translated
updated: 2026-09-04
---

## DROP OPERATOR (operator တစ်ခုကို ဖယ်ရှားခြင်း)

DROP OPERATOR — operator တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP OPERATOR [ IF EXISTS ] name ( { left_type | NONE } , right_type ) [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP OPERATOR` က database system ထဲက ရှိပြီးသား operator တစ်ခုကို drop (ဖျက်သိမ်း) လုပ်ပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — သင်က operator ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Operator မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ရှိပြီးသား operator တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **left_type** — Operator ရဲ့ left operand (ဘယ်ဘက် ကိန်းရှင်) ရဲ့ data type; operator မှာ left operand မရှိဘူးဆိုရင် NONE လို့ ရေးပါ။
- **right_type** — Operator ရဲ့ right operand (ညာဘက် ကိန်းရှင်) ရဲ့ data type။
- **CASCADE** — Operator ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Operator ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — operator ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`integer` type အတွက် power operator `a^b` ကို ဖယ်ရှားဖို့:

```sql
DROP OPERATOR ^ (integer, integer);
```

`bit` type အတွက် bitwise-complement prefix operator `~b` ကို ဖယ်ရှားဖို့:

```sql
DROP OPERATOR ~ (none, bit);
```

Command တစ်ခုတည်းနဲ့ operators အများအပြားကို ဖယ်ရှားဖို့:

```sql
DROP OPERATOR ~ (none, bit), ^ (integer, integer);
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP OPERATOR` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE OPERATOR](https://www.postgresql.org/docs/current/sql-createoperator.html), [ALTER OPERATOR](/docs/postgresql/sql-alteroperator)
