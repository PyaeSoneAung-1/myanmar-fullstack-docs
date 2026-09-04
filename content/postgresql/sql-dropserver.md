---
title: "DROP SERVER (foreign server descriptor တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Foreign server descriptor တစ်ခုကို ဖယ်ရှားပေးသော command — IF EXISTS option ဖြင့် server မရှိပါက error မပစ်ဘဲ ရှောင်ကွင်းနိုင်ပြီး — CASCADE ဖြင့် မှီခိုနေသော objects (ဥပမာ — user mappings) များကိုပါ အလိုအလျောက် ဖယ်ရှားနိုင်သော command"
order: 275
source: "https://www.postgresql.org/docs/current/sql-dropserver.html"
status: translated
updated: 2026-09-04
---

## DROP SERVER (foreign server descriptor တစ်ခုကို ဖယ်ရှားခြင်း)

DROP SERVER — foreign server descriptor တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP SERVER [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP SERVER` က ရှိပြီးသား foreign server descriptor တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — လက်ရှိ user က server ရဲ့ owner ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Server မရှိဘူးဆိုရင် error တစ်ခု ပစ်ချခြင်း မပြုပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား server တစ်ခုရဲ့ နာမည်။
- **CASCADE** — Server ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — user mappings) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Server ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် ဖယ်ရှားဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`foo` server တစ်ခုကို — ရှိခဲ့ရင် — ဖယ်ရှားဖို့:

```sql
DROP SERVER IF EXISTS foo;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP SERVER` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။ `IF EXISTS` clause ကတော့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SERVER](/docs/postgresql/sql-createserver), [ALTER SERVER](/docs/postgresql/sql-alterserver)
