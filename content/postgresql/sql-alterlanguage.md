---
title: "ALTER LANGUAGE (procedural language တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Procedural language တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း — language ကို နာမည်ပြောင်းခြင်း (RENAME TO) သို့မဟုတ် ပိုင်ရှင်အသစ် သတ်မှတ်ခြင်း (OWNER TO) — superuser သို့မဟုတ် language ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သော command"
order: 254
source: "https://www.postgresql.org/docs/current/sql-alterlanguage.html"
status: translated
updated: 2026-09-04
---

## ALTER LANGUAGE (procedural language တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER LANGUAGE — procedural language တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER [ PROCEDURAL ] LANGUAGE name RENAME TO new_name
ALTER [ PROCEDURAL ] LANGUAGE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER LANGUAGE` က procedural language တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။ လုပ်ဆောင်နိုင်တဲ့ လုပ်ဆောင်ချက်က — language ကို နာမည်ပြောင်းခြင်း ဒါမှမဟုတ် ပိုင်ရှင်အသစ် သတ်မှတ်ပေးခြင်းပဲ ဖြစ်ပါတယ်။ `ALTER LANGUAGE` ကို သုံးဖို့ — superuser ဒါမှမဟုတ် language ရဲ့ ပိုင်ရှင် ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **name** — Language တစ်ခုရဲ့ နာမည်
- **new_name** — Language ရဲ့ နာမည် အသစ်
- **new_owner** — Language ရဲ့ ပိုင်ရှင် အသစ်

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER LANGUAGE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE LANGUAGE](/docs/postgresql/sql-createlanguage), [DROP LANGUAGE](/docs/postgresql/sql-droplanguage)
