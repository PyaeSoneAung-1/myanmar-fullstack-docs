---
title: "DROP LANGUAGE (procedural language တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "အရင် register လုပ်ထားပြီးသား procedural language တစ်ခုရဲ့ definition ကို ဖယ်ရှားခြင်း — IF EXISTS, CASCADE/RESTRICT option များ ပါဝင်ပြီး — superuser သို့မဟုတ် language ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သော command"
order: 255
source: "https://www.postgresql.org/docs/current/sql-droplanguage.html"
status: translated
updated: 2026-09-04
---

## DROP LANGUAGE (procedural language တစ်ခုကို ဖယ်ရှားခြင်း)

DROP LANGUAGE — procedural language တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP [ PROCEDURAL ] LANGUAGE [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP LANGUAGE` က အရင် register လုပ်ထားပြီးသား procedural language တစ်ခုရဲ့ definition ကို ဖယ်ရှားပေးပါတယ်။ `DROP LANGUAGE` ကို သုံးဖို့ — superuser ဒါမှမဟုတ် language ရဲ့ ပိုင်ရှင် ဖြစ်ရပါမယ်။

> **မှတ်ချက်:** PostgreSQL 9.1 ကစပြီး — procedural languages အများစုကို “extensions” တွေအဖြစ် ပြုလုပ်ထားလို့ — သူတို့ကို `DROP LANGUAGE` နဲ့ မဟုတ်ဘဲ [`DROP EXTENSION`](/docs/postgresql/sql-dropextension) နဲ့ ဖယ်ရှားသင့်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Language မရှိရင် error တစ်ခု မပစ်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား procedural language တစ်ခုရဲ့ နာမည်။
- **CASCADE** — Language ပေါ် မှီခိုနေတဲ့ objects တွေ (ဥပမာ — ဒီ language နဲ့ ရေးထားတဲ့ functions တွေ) ကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ် မှီခိုနေတဲ့ objects တွေအားလုံးကိုလည်း အလှည့်ကျ drop လုပ်ပေးပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Objects တစ်ခုခုက language ပေါ် မှီခိုနေရင် — language ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

ဒီ command က `plsample` ဆိုတဲ့ procedural language ကို ဖယ်ရှားပေးပါတယ်:

```sql
DROP LANGUAGE plsample;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP LANGUAGE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER LANGUAGE](/docs/postgresql/sql-alterlanguage), [CREATE LANGUAGE](/docs/postgresql/sql-createlanguage)
