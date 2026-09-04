---
title: "DROP CONVERSION (conversion တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "အရင် သတ်မှတ်ခဲ့ဖူးတဲ့ conversion တစ်ခုကို ဖယ်ရှားပေးတဲ့ command — IF EXISTS option၊ CASCADE/RESTRICT key words များက conversions များပေါ်တွင် မှီခိုမှု မရှိသောကြောင့် အကျိုးသက်ရောက်မှု မရှိခြင်း — conversion ၏ owner ဖြစ်ရန် လိုအပ်သော command"
order: 250
source: "https://www.postgresql.org/docs/current/sql-dropconversion.html"
status: translated
updated: 2026-09-04
---

## DROP CONVERSION (conversion တစ်ခုကို ဖယ်ရှားခြင်း)

DROP CONVERSION — conversion တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP CONVERSION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP CONVERSION` က အရင်က သတ်မှတ်ခဲ့ဖူးတဲ့ conversion တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ Conversion တစ်ခုကို drop လုပ်နိုင်ဖို့ဆိုရင် — သင်က conversion ကို ပိုင်ဆိုင်ထားရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Conversion မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — Conversion ရဲ့ နာမည် ဖြစ်ပါတယ်။ Conversion နာမည်ကို schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) လုပ်လို့ ရပါတယ်။
- **CASCADE** / **RESTRICT** — Conversions တွေပေါ်မှာ မှီခိုမှု (dependencies) တွေ မရှိတာမို့ — ဒီ key words နှစ်ခုလုံးက ဘယ် အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Examples (ဥပမာများ)

`myname` ဆိုတဲ့ conversion ကို drop လုပ်ရန်:

```sql
DROP CONVERSION myname;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP CONVERSION` statement ဆိုတာ မရှိပါဘူး — ဒါပေမယ့် — PostgreSQL ရဲ့ `CREATE CONVERSION` statement နဲ့ ဆင်တူတဲ့ `CREATE TRANSLATION` statement နဲ့ တွဲပါလာတဲ့ `DROP TRANSLATION` statement တစ်ခုကတော့ ရှိပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER CONVERSION](/docs/postgresql/sql-alterconversion), [CREATE CONVERSION](/docs/postgresql/sql-createconversion)
