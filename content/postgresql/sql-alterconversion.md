---
title: "ALTER CONVERSION (conversion တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Conversion တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးတဲ့ command — RENAME TO ဖြင့် နာမည်ပြောင်းလဲခြင်း၊ OWNER TO ဖြင့် ပိုင်ရှင်ပြောင်းလဲခြင်း (owner အသစ်ဆီသို့ SET ROLE လုပ်နိုင်ပြီး ၎င်း၏ schema တွင် CREATE privilege ရှိရန် လိုအပ်ခြင်း၊ superuser အတွက် ခြွင်းချက်) နှင့် SET SCHEMA ဖြင့် schema ပြောင်းလဲခြင်း — conversion ၏ owner ဖြစ်ရန် လိုအပ်သော command"
order: 249
source: "https://www.postgresql.org/docs/current/sql-alterconversion.html"
status: translated
updated: 2026-09-04
---

## ALTER CONVERSION (conversion တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER CONVERSION — conversion တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER CONVERSION name RENAME TO new_name
ALTER CONVERSION name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER CONVERSION name SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER CONVERSION` က conversion တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER CONVERSION` ကို သုံးဖို့ — သင်က conversion ကို ပိုင်ဆိုင်ထားရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ဆိုရင် — သင်က owner role အသစ်ဆီကို `SET ROLE` လုပ်နိုင်ရမှာ ဖြစ်ပြီး — အဲဒီ role မှာ conversion ရဲ့ schema ပေါ်မှာ `CREATE` privilege (ခွင့်ပြုချက်) ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲခြင်းအားဖြင့် — conversion ကို drop ပြီး ပြန်ဖန်တီးခြင်းဖြင့် သင်လုပ်နိုင်တာထက် ပိုတဲ့ ဘာမှ မလုပ်နိုင်အောင် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် conversion ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား conversion တစ်ခုရဲ့ နာမည် (schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) ပုံစံလည်း ဖြစ်နိုင်) ဖြစ်ပါတယ်။
- **new_name** — Conversion ရဲ့ နာမည် အသစ် ဖြစ်ပါတယ်။
- **new_owner** — Conversion ရဲ့ owner အသစ် ဖြစ်ပါတယ်။
- **new_schema** — Conversion အတွက် schema အသစ် ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`iso_8859_1_to_utf8` ဆိုတဲ့ conversion ကို `latin1_to_unicode` အဖြစ် နာမည် ပြောင်းရန်:

```sql
ALTER CONVERSION iso_8859_1_to_utf8 RENAME TO latin1_to_unicode;
```

`iso_8859_1_to_utf8` ဆိုတဲ့ conversion ရဲ့ owner ကို `joe` အဖြစ် ပြောင်းရန်:

```sql
ALTER CONVERSION iso_8859_1_to_utf8 OWNER TO joe;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER CONVERSION` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE CONVERSION](/docs/postgresql/sql-createconversion), [DROP CONVERSION](/docs/postgresql/sql-dropconversion)
