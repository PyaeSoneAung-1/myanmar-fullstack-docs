---
title: "DROP COLLATION (collation တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "အရင် define လုပ်ထားပြီးသား collation တစ်ခုကို ဖယ်ရှားခြင်း — IF EXISTS, CASCADE/RESTRICT option များ ပါဝင်ပြီး — collation ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သော command"
order: 247
source: "https://www.postgresql.org/docs/current/sql-dropcollation.html"
status: translated
updated: 2026-09-04
---

## DROP COLLATION (collation တစ်ခုကို ဖယ်ရှားခြင်း)

DROP COLLATION — collation တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP COLLATION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP COLLATION` က အရင် define လုပ်ထားပြီးသား collation တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ Collation တစ်ခုကို drop လုပ်နိုင်ဖို့ — collation ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Collation မရှိရင် error တစ်ခု မပစ်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — Collation ရဲ့ နာမည်။ Collation နာမည်ကို schema-qualified လုပ်နိုင်ပါတယ်။
- **CASCADE** — Collation ပေါ် မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ် မှီခိုနေတဲ့ objects တွေအားလုံးကိုလည်း အလှည့်ကျ drop လုပ်ပေးပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Objects တစ်ခုခုက collation ပေါ် မှီခိုနေရင် — collation ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`german` လို့ နာမည်ရှိတဲ့ collation ကို drop လုပ်ဖို့:

```sql
DROP COLLATION german;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP COLLATION` command က — PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်တဲ့ — `IF EXISTS` option ကလွဲလို့ — SQL standard နဲ့ လိုက်ဖက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER COLLATION](/docs/postgresql/sql-altercollation), [CREATE COLLATION](/docs/postgresql/sql-createcollation)
