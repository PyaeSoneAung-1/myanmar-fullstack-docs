---
title: "DROP MATERIALIZED VIEW (materialized view တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Materialized view တစ်ခုကို ဖယ်ရှား (drop) ပေးတဲ့ command — IF EXISTS option နဲ့ materialized view ပေါ်မှာ မှီခိုနေတဲ့ (dependent) objects များကို ကိုင်တွယ်သည့် CASCADE နှင့် RESTRICT အပြုအမူများ — command ကို execute လုပ်ရန် materialized view ၏ ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သည်"
order: 205
source: "https://www.postgresql.org/docs/current/sql-dropmaterializedview.html"
status: translated
updated: 2026-09-04
---

## DROP MATERIALIZED VIEW (materialized view တစ်ခုကို ဖယ်ရှားခြင်း)

DROP MATERIALIZED VIEW — materialized view တစ်ခုကို ဖယ်ရှားခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP MATERIALIZED VIEW [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP MATERIALIZED VIEW` က ရှိပြီးသား materialized view တစ်ခုကို ဖျက်ပစ်ပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — သင်က materialized view ရဲ့ ပိုင်ရှင် ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Materialized view မရှိရင် error တစ်ခု မထုတ်ပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် materialized view ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။
- **CASCADE** — Materialized view ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — တခြား materialized views တွေ ဒါမှမဟုတ် သာမန် views တွေ) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလိုအလျောက် ဖျက်ပစ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Materialized view ပေါ်မှာ မှီခိုနေတဲ့ objects တစ်ခုခု ရှိနေရင် — materialized view ကို ဖျက်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

ဒီ command က `order_summary` လို့ ခေါ်တဲ့ materialized view ကို ဖယ်ရှားပါလိမ့်မယ်:

```sql
DROP MATERIALIZED VIEW order_summary;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP MATERIALIZED VIEW` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE MATERIALIZED VIEW](/docs/postgresql/sql-creatematerializedview), [ALTER MATERIALIZED VIEW](/docs/postgresql/sql-altermaterializedview), [REFRESH MATERIALIZED VIEW](/docs/postgresql/sql-refreshmaterializedview)
