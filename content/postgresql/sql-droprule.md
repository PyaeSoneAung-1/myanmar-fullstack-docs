---
title: "DROP RULE (rewrite rule တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Rewrite rule (query ပြန်ရေးသားမှု စည်းမျဉ်း) တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS, CASCADE/RESTRICT options များ ပါဝင်ပြီး query rewrite system တစ်ခုလုံးကဲ့သို့ PostgreSQL language extension တစ်ခုဖြစ်သည်"
order: 296
source: "https://www.postgresql.org/docs/current/sql-droprule.html"
status: translated
updated: 2026-09-04
---

## DROP RULE (rewrite rule တစ်ခုကို ဖယ်ရှားခြင်း)

DROP RULE — rewrite rule (query ပြန်ရေးသားမှု စည်းမျဉ်း) တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP RULE [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP RULE` က rewrite rule တစ်ခုကို drop (ဖျက်သိမ်း) လုပ်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Rule မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — drop လုပ်ရမယ့် rule ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **table_name** — rule သက်ရောက်တဲ့ table ဒါမှမဟုတ် view ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **CASCADE** — Rule ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Rule ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — rule ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`newrule` ဆိုတဲ့ rewrite rule ကို ဖယ်ရှားဖို့:

```sql
DROP RULE newrule ON mytable;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP RULE` က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ် — query rewrite system (query ပြန်ရေးသားမှု စနစ်) တစ်ခုလုံးလိုပါပဲ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE RULE](https://www.postgresql.org/docs/current/sql-createrule.html), [ALTER RULE](/docs/postgresql/sql-alterrule)
