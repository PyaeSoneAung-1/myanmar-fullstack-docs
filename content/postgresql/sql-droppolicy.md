---
title: "DROP POLICY (table တစ်ခုမှ row-level security policy တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Table တစ်ခုမှ သတ်မှတ်ထားသော row-level security policy (row အဆင့် လုံခြုံရေး မူဝါဒ) ကို ဖယ်ရှားပေးသည့် command — နောက်ဆုံး policy ကို ဖယ်ရှားပြီးနောက် table တွင် row-level security enable ဖြစ်နေသေးလျှင် default-deny policy ကို အသုံးပြုခြင်းအကြောင်း ပါဝင်သည်; PostgreSQL extension တစ်ခုဖြစ်သည်"
order: 298
source: "https://www.postgresql.org/docs/current/sql-droppolicy.html"
status: translated
updated: 2026-09-04
---

## DROP POLICY (table တစ်ခုမှ row-level security policy တစ်ခုကို ဖယ်ရှားခြင်း)

DROP POLICY — table တစ်ခုကနေ row-level security policy တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP POLICY [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP POLICY` က — သတ်မှတ်ထားတဲ့ policy ကို table ကနေ ဖယ်ရှားပေးပါတယ်။ Table တစ်ခုအတွက် နောက်ဆုံး policy ကို ဖယ်ရှားလိုက်ပြီး — `ALTER TABLE` ကနေ row-level security ကို enable လုပ်ထားတုန်း ဆိုရင် — default-deny policy (ပုံမှန်အားဖြင့် ငြင်းပယ်တဲ့ policy) ကို သုံးပါလိမ့်မယ် ဆိုတာ သတိပြုပါ။ Table အတွက် policies တွေ ရှိနေသည်ဖြစ်စေ မရှိသည်ဖြစ်စေ — `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` ကို table တစ်ခုအတွက် row-level security ကို disable လုပ်ဖို့ သုံးနိုင်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Policy မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — drop လုပ်ရမယ့် policy ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **table_name** — policy ရှိနေတဲ့ table ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **CASCADE** / **RESTRICT** — Policies တွေပေါ်မှာ မှီခိုနေတဲ့ (dependent) objects တွေ မရှိတာမို့ — ဒီ key words တွေက ဘာ အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Examples (ဥပမာများ)

`my_table` လို့ နာမည်ရတဲ့ table ပေါ်က `p1` လို့ ခေါ်တဲ့ policy ကို ဖယ်ရှားဖို့:

```sql
DROP POLICY p1 ON my_table;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP POLICY` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html), [ALTER POLICY](/docs/postgresql/sql-alterpolicy)
