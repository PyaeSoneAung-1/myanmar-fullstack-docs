---
title: "ALTER TEXT SEARCH TEMPLATE (text search template တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)"
description: "Text search template တစ်ခု၏ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း — RENAME TO ဖြင့် template နာမည် ပြောင်းလဲခြင်းနှင့် SET SCHEMA ဖြင့် schema ပြောင်းရွှေ့ခြင်း — superuser သာ အသုံးပြုနိုင်သော command"
order: 267
source: "https://www.postgresql.org/docs/current/sql-altertstemplate.html"
status: translated
updated: 2026-09-04
---

## ALTER TEXT SEARCH TEMPLATE (text search template တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)

ALTER TEXT SEARCH TEMPLATE — text search template တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TEXT SEARCH TEMPLATE name RENAME TO new_name
ALTER TEXT SEARCH TEMPLATE name SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER TEXT SEARCH TEMPLATE` က text search template တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်။ လက်ရှိမှာ — ပံ့ပိုးထားတဲ့ လုပ်ဆောင်ချက်က template ရဲ့ နာမည်ကို ပြောင်းလဲတာပဲ ဖြစ်ပါတယ်။

`ALTER TEXT SEARCH TEMPLATE` ကို သုံးဖို့ — superuser ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **name** — ရှိပြီးသား text search template တစ်ခုရဲ့ နာမည် (လိုအပ်ရင် schema-qualified)။
- **new_name** — Text search template ရဲ့ နာမည် အသစ်။
- **new_schema** — Text search template အတွက် schema အသစ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER TEXT SEARCH TEMPLATE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TEXT SEARCH TEMPLATE](/docs/postgresql/sql-createtstemplate), [DROP TEXT SEARCH TEMPLATE](/docs/postgresql/sql-droptstemplate)
