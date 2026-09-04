---
title: "DROP FOREIGN TABLE (foreign table တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Foreign table တစ်ခုကို ဖယ်ရှား (drop) ပေးသည့် command — IF EXISTS ၊ CASCADE နှင့် RESTRICT option များအကြောင်း — command ကို execute လုပ်ရန် foreign table ၏ ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သည်"
order: 279
source: "https://www.postgresql.org/docs/current/sql-dropforeigntable.html"
status: translated
updated: 2026-09-04
---

## DROP FOREIGN TABLE (foreign table တစ်ခုကို ဖယ်ရှားခြင်း)

DROP FOREIGN TABLE — foreign table တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP FOREIGN TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP FOREIGN TABLE` က foreign table တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ Foreign table တစ်ခုကို ၎င်းရဲ့ ပိုင်ရှင်ကပဲ ဖယ်ရှားနိုင်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Foreign table မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် foreign table ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။
- **CASCADE** — Foreign table ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — views) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Foreign table ပေါ်မှာ မှီခိုနေတဲ့ objects တစ်ခုခု ရှိနေရင် — foreign table ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

Foreign tables နှစ်ခုဖြစ်တဲ့ `films` နဲ့ `distributors` တို့ကို ဖျက်ဆီးရန်:

```sql
DROP FOREIGN TABLE films, distributors;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ် — ခြွင်းချက်ကတော့ — standard က command တစ်ခုနဲ့ foreign table တစ်ခုတည်းကိုပဲ drop လုပ်ခွင့် ပြုပြီး — PostgreSQL extension တစ်ခု ဖြစ်တဲ့ `IF EXISTS` option ကတော့ ခြွင်းချက် ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-alterforeigntable.html), [CREATE FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-createforeigntable.html)
