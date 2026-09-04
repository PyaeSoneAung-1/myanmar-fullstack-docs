---
title: "DROP VIEW (view တစ်ခုကို ဖျက်ခြင်း)"
description: "view တစ်ခုကို ဖယ်ရှား (drop) ပေးတဲ့ command — IF EXISTS option နဲ့ view ပေါ်မှာ မှီခိုနေတဲ့ (dependent) objects များကို ကိုင်တွယ်သည့် CASCADE နှင့် RESTRICT အပြုအမူများ"
order: 147
source: "https://www.postgresql.org/docs/current/sql-dropview.html"
status: translated
updated: 2026-09-04
---

## DROP VIEW (view တစ်ခုကို ဖျက်ခြင်း)

DROP VIEW — view တစ်ခုကို ဖယ်ရှားခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP VIEW [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP VIEW` က ရှိပြီးသား view တစ်ခုကို ဖျက်ပစ်ပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — သင်က view ရဲ့ ပိုင်ရှင် ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — View မရှိရင် error တစ်ခု မထုတ်ပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် view ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။
- **CASCADE** — View ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — တခြား view တွေ) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလိုအလျောက် ဖျက်ပစ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — View ပေါ်မှာ မှီခိုနေတဲ့ objects တစ်ခုခု ရှိနေရင် — view ကို ဖျက်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

ဒီ command က `kinds` လို့ ခေါ်တဲ့ view ကို ဖယ်ရှားပါလိမ့်မယ်:

```sql
DROP VIEW kinds;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — ဒါပေမယ့် — standard က command တစ်ခုနဲ့ view တစ်ခုကိုပဲ ဖျက်ခွင့် ပြုပြီး — PostgreSQL extension တစ်ခု ဖြစ်တဲ့ `IF EXISTS` option ကတော့ ခြွင်းချက် ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER VIEW](/docs/postgresql/sql-alterview), [CREATE VIEW](/docs/postgresql/sql-createview)
