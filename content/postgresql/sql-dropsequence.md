---
title: "DROP SEQUENCE (sequence တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Sequence number generator (sequence နံပါတ် ထုတ်လုပ်ပေးသည့် ကိရိယာ) များကို ဖျက်ပစ်သည့် command — IF EXISTS, CASCADE, RESTRICT option များ၏ အလုပ်လုပ်ပုံ၊ ဥပမာများနှင့် SQL standard လိုက်ဖက်ညီမှု"
order: 150
source: "https://www.postgresql.org/docs/current/sql-dropsequence.html"
status: translated
updated: 2026-09-04
---

## DROP SEQUENCE (sequence တစ်ခုကို ဖယ်ရှားခြင်း)

DROP SEQUENCE — sequence တစ်ခုကို ဖယ်ရှားပေးခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP SEQUENCE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP SEQUENCE` က sequence number generators တွေကို ဖယ်ရှားပေးပါတယ်။ Sequence တစ်ခုကို ၎င်းရဲ့ ပိုင်ရှင် (owner) ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ drop လုပ်နိုင်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Sequence မရှိဘူးဆိုရင် error တစ်ခု မထုတ်တော့ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — Sequence တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်သည်)။
- **CASCADE** — Sequence ပေါ်မှာ မှီခိုနေတဲ့ (depend) objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေကိုပါ အဆင့်ဆင့် drop လုပ်သွားပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Sequence ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ ရှိနေရင် — sequence ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`serial` ဆိုတဲ့ sequence ကို ဖယ်ရှားဖို့:

```sql
DROP SEQUENCE serial;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP SEQUENCE` က SQL standard နဲ့ ကိုက်ညီပါတယ် — ခြွင်းချက်ကတော့ — standard က command တစ်ခုနဲ့ sequence တစ်ခုတည်းကိုပဲ drop လုပ်ခွင့် ပြုပြီး — `IF EXISTS` option ကတော့ PostgreSQL extension (PostgreSQL မှာပဲ ပါဝင်သည့် ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SEQUENCE](/docs/postgresql/sql-createsequence), [ALTER SEQUENCE](/docs/postgresql/sql-altersequence)
