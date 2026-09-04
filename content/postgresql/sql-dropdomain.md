---
title: "DROP DOMAIN (domain တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Domain တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option နှင့် dependent objects (ဥပမာ — table columns) များအတွက် CASCADE/RESTRICT အပြုအမူများ၊ ဥပမာများနှင့် SQL standard လိုက်ဖက်ညီမှု ပါဝင်သည်"
order: 238
source: "https://www.postgresql.org/docs/current/sql-dropdomain.html"
status: translated
updated: 2026-09-04
---

## DROP DOMAIN (domain တစ်ခုကို ဖယ်ရှားခြင်း)

DROP DOMAIN — domain တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP DOMAIN [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP DOMAIN` က domain တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ Domain တစ်ခုရဲ့ owner (ပိုင်ရှင်) ကသာလျှင် — အဲဒီ domain ကို ဖယ်ရှားလို့ ရပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Domain မရှိဘူးဆိုရင် error ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေးမှတ်ချက်) တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား domain တစ်ခုရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **CASCADE** — Domain ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — table columns) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Domain ပေါ်မှာ မှီခိုနေတဲ့ objects တစ်ခုခု ရှိနေရင် domain ကို drop လုပ်တာကို ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`box` ဆိုတဲ့ domain ကို ဖယ်ရှားဖို့:

```sql
DROP DOMAIN box;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က — PostgreSQL extension တစ်ခု ဖြစ်တဲ့ `IF EXISTS` option ကလွဲလို့ — SQL standard နဲ့ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE DOMAIN](/docs/postgresql/sql-createdomain), [ALTER DOMAIN](/docs/postgresql/sql-alterdomain)
