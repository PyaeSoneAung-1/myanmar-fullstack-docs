---
title: "DROP TABLE (table တစ်ခုကို ဖျက်ခြင်း)"
description: "Table များကို database မှ ဖယ်ရှားပေးသော command — IF EXISTS, CASCADE, RESTRICT option များ၏ အသေးစိတ် ရှင်းလင်းချက်၊ table နှင့်အတူ indexes/rules/triggers/constraints များပါ ဖယ်ရှားခံရခြင်းနှင့် view သို့မဟုတ် တခြား table ၏ foreign-key constraint က ရည်ညွှန်းထားသော table များအတွက် CASCADE လိုအပ်ပုံ"
order: 214
source: "https://www.postgresql.org/docs/current/sql-droptable.html"
status: translated
updated: 2026-09-04
---

## DROP TABLE (table တစ်ခုကို ဖျက်ခြင်း)

DROP TABLE — table တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TABLE` က tables တွေကို database ကနေ ဖယ်ရှားပေးပါတယ်။ Table တစ်ခုကို drop လုပ်နိုင်တာ — table ရဲ့ owner၊ schema ရဲ့ owner နဲ့ superuser တို့ပဲ ဖြစ်ပါတယ်။ Table ကို မဖျက်ဘဲ rows တွေပဲ ရှင်းလင်းချင်ရင်တော့ — [DELETE](/docs/postgresql/sql-delete) ဒါမှမဟုတ် [TRUNCATE](/docs/postgresql/sql-truncate) ကို သုံးပါ။

`DROP TABLE` က target table အတွက် ရှိနေတဲ့ indexes တွေ၊ rules တွေ၊ triggers တွေနဲ့ constraints တွေ အားလုံးကို အမြဲတမ်း ဖယ်ရှားပေးပါတယ်။ ဒါပေမယ့် — view တစ်ခု ဒါမှမဟုတ် တခြား table တစ်ခုရဲ့ foreign-key constraint က ရည်ညွှန်းထားတဲ့ table တစ်ခုကို drop လုပ်ဖို့ဆိုရင် — `CASCADE` ကို သတ်မှတ်ပေးရပါမယ်။ (`CASCADE` က မှီခိုနေတဲ့ view တစ်ခုကို လုံးဝ ဖယ်ရှားပေမယ့် — foreign-key ကိစ္စမှာတော့ — foreign-key constraint ကိုပဲ ဖယ်ရှားပြီး — တခြား table ကို တစ်ခုလုံး မဖယ်ရှားပါဘူး။)

## Parameters (parameter များ)

- **IF EXISTS** — Table မရှိဘူးဆိုရင် error တစ်ခု မထုတ်ပါဘူး။ ဒီလိုအခြေအနေမျိုးမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — Drop လုပ်ရမယ့် table ရဲ့ နာမည် (schema-qualified (schema နာမည်နဲ့ ရှေ့ဆွဲထား) လည်း ဖြစ်နိုင်သည်)။
- **CASCADE** — Table ကို မှီခိုနေတဲ့ objects တွေ (ဥပမာ — views) နဲ့ — သူတို့ကို ပြန်ပြီး မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Table ကို မှီခိုနေတဲ့ objects တွေ ရှိနေရင် — table ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`films` နဲ့ `distributors` ဆိုတဲ့ tables နှစ်ခုကို ဖျက်ဆီးရန်:

```sql
DROP TABLE films, distributors;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — ဒါပေမယ့် — standard က command တစ်ခုမှာ table တစ်ခုကိုပဲ drop လုပ်ဖို့ ခွင့်ပြုတာနဲ့ — PostgreSQL extension (PostgreSQL မှာပဲ ပါဝင်တဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်တဲ့ `IF EXISTS` option တို့ကတော့ ခြွင်းချက်ပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TABLE](/docs/postgresql/sql-altertable), [CREATE TABLE](/docs/postgresql/sql-createtable)
