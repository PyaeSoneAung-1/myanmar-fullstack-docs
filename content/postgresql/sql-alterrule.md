---
title: "ALTER RULE (rule တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား rule (query ပြန်ရေးသားမှု စည်းမျဉ်း) တစ်ခု၏ သတ်မှတ်ချက်များကို ပြောင်းလဲပေးသည့် command — လက်ရှိတွင် rule ၏ နာမည်ကို ပြောင်းလဲခြင်းကိုသာ ထောက်ပံ့ပြီး rule သက်ရောက်သည့် table သို့မဟုတ် view ၏ owner ဖြစ်ရန် လိုအပ်သည်; query rewrite system တစ်ခုလုံးကဲ့သို့ PostgreSQL language extension တစ်ခုဖြစ်သည်"
order: 295
source: "https://www.postgresql.org/docs/current/sql-alterrule.html"
status: translated
updated: 2026-09-04
---

## ALTER RULE (rule တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER RULE — rule (query ပြန်ရေးသားမှု စည်းမျဉ်း) တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER RULE name ON table_name RENAME TO new_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER RULE` က — တည်ရှိပြီးသား rule တစ်ခုရဲ့ properties (ဂုဏ်သတ္တိများ) တွေကို ပြောင်းလဲပေးပါတယ်။ လောလောဆယ် — ရနိုင်တဲ့ တစ်ခုတည်းသော လုပ်ဆောင်ချက်က rule ရဲ့ နာမည်ကို ပြောင်းလဲခြင်းပဲ ဖြစ်ပါတယ်။

`ALTER RULE` ကို သုံးဖို့ — သင်ဟာ rule သက်ရောက်တဲ့ table ဒါမှမဟုတ် view ကို ပိုင်ဆိုင်ရပါမယ်။

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် တည်ရှိပြီးသား rule တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **table_name** — rule သက်ရောက်တဲ့ table ဒါမှမဟုတ် view ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **new_name** — rule အတွက် နာမည်အသစ် ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

တည်ရှိပြီးသား rule တစ်ခုကို နာမည် ပြောင်းလဲဖို့:

```sql
ALTER RULE notify_all ON emp RENAME TO notify_me;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER RULE` က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ် — query rewrite system (query ပြန်ရေးသားမှု စနစ်) တစ်ခုလုံးလိုပါပဲ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE RULE](https://www.postgresql.org/docs/current/sql-createrule.html), [DROP RULE](/docs/postgresql/sql-droprule)
