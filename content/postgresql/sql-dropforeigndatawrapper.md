---
title: "DROP FOREIGN DATA WRAPPER (foreign-data wrapper တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Foreign-data wrapper တစ်ခုကို ဖယ်ရှားပေးသော command — IF EXISTS option ဖြင့် foreign-data wrapper မရှိပါက error မပစ်ဘဲ ရှောင်ကွင်းနိုင်ပြီး — CASCADE ဖြင့် မှီခိုနေသော objects များကိုပါ အလိုအလျောက် ဖယ်ရှားနိုင်သော command"
order: 271
source: "https://www.postgresql.org/docs/current/sql-dropforeigndatawrapper.html"
status: translated
updated: 2026-09-04
---

## DROP FOREIGN DATA WRAPPER (foreign-data wrapper တစ်ခုကို ဖယ်ရှားခြင်း)

DROP FOREIGN DATA WRAPPER — foreign-data wrapper တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP FOREIGN DATA WRAPPER [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP FOREIGN DATA WRAPPER` က ရှိပြီးသား foreign-data wrapper တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — လက်ရှိ user က foreign-data wrapper ရဲ့ owner ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Foreign-data wrapper မရှိဘူးဆိုရင် error တစ်ခု ပစ်ချခြင်း မပြုပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား foreign-data wrapper တစ်ခုရဲ့ နာမည်။
- **CASCADE** — Foreign-data wrapper ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — foreign tables နဲ့ servers) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Foreign-data wrapper ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် ဖယ်ရှားဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

Foreign-data wrapper `dbi` ကို ဖယ်ရှားဖို့:

```sql
DROP FOREIGN DATA WRAPPER dbi;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP FOREIGN DATA WRAPPER` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။ `IF EXISTS` clause ကတော့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FOREIGN DATA WRAPPER](/docs/postgresql/sql-createforeigndatawrapper), [ALTER FOREIGN DATA WRAPPER](/docs/postgresql/sql-alterforeigndatawrapper)
