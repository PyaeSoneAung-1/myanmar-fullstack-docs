---
title: "DROP SCHEMA (schema တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Database ထဲမှ schema တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော schema များကို ဖယ်ရှားခြင်း — IF EXISTS, CASCADE, RESTRICT option များအကြောင်း"
order: 144
source: "https://www.postgresql.org/docs/current/sql-dropschema.html"
status: translated
updated: 2026-09-04
---

## DROP SCHEMA (schema တစ်ခုကို ဖယ်ရှားခြင်း)

DROP SCHEMA — schema တစ်ခုကို ဖယ်ရှားပေးတဲ့ command

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP SCHEMA [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP SCHEMA` က schema တွေကို database ထဲကနေ ဖယ်ရှားပေးပါတယ်။

Schema တစ်ခုကို ၎င်းရဲ့ ပိုင်ရှင် ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ ဖယ်ရှားနိုင်ပါတယ်။ Schema အတွင်းမှာ ရှိတဲ့ object တချို့ကို ပိုင်ဆိုင်မှု မရှိဘူးဆိုရင်တောင် — ပိုင်ရှင်က schema ကို (ပြီးတော့ အဲဒါကြောင့် ပါဝင်သမျှ object တွေကိုပါ) ဖယ်ရှားနိုင်တယ်ဆိုတာ သတိပြုပါ။

## Parameters (parameter များ)

- **IF EXISTS** — Schema မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီလို အခြေအနေမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — Schema တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **CASCADE** — Schema ထဲမှာ ပါဝင်တဲ့ object တွေ (table တွေ၊ function တွေ စသဖြင့်) ကိုရော — အဲဒီ object တွေအပေါ် မှီခိုနေတဲ့ object တွေ အားလုံးကိုပါ အလိုအလျောက် ဖယ်ရှားပေးပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Schema ထဲမှာ object တစ်ခုခု ပါဝင်နေရင် — schema ကို ဖယ်ရှားဖို့ ငြင်းဆန်ပါတယ်။ ဒါက မူရင်း (default) အပြုအမူ ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`CASCADE` option ကို သုံးထားရင် — command က နာမည်ပေးထားတဲ့ schema(s) တွေအပြင် — တခြား schema တွေထဲမှာ ရှိတဲ့ object တွေကိုပါ ဖယ်ရှားပစ်နိုင်ပါတယ်။

## Examples (ဥပမာများ)

Schema `mystuff` ကို — ၎င်းထဲမှာ ပါဝင်သမျှ အားလုံးနဲ့အတူ — database ကနေ ဖယ်ရှားချင်ရင်:

```sql
DROP SCHEMA mystuff CASCADE;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP SCHEMA` က SQL standard နဲ့ အပြည့်အဝ လိုက်လျောညီထွေ ဖြစ်ပါတယ် — ခြွင်းချက်တွေကတော့: standard က command တစ်ခုမှာ schema တစ်ခုတည်းကိုပဲ ဖယ်ရှားခွင့်ပြုတာ၊ ပြီးတော့ PostgreSQL extension တစ်ခု ဖြစ်တဲ့ `IF EXISTS` option ပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER SCHEMA](https://www.postgresql.org/docs/current/sql-alterschema.html), [CREATE SCHEMA](/docs/postgresql/sql-createschema)
