---
title: "DROP TYPE (data type တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "User-defined data type (အသုံးပြုသူ သတ်မှတ်သည့် data type) တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option နှင့် dependent objects များအတွက် CASCADE/RESTRICT အပြုအမူများ၊ ဥပမာများနှင့် SQL standard လိုက်ဖက်ညီမှု ပါဝင်သည်"
order: 235
source: "https://www.postgresql.org/docs/current/sql-droptype.html"
status: translated
updated: 2026-09-04
---

## DROP TYPE (data type တစ်ခုကို ဖယ်ရှားခြင်း)

DROP TYPE — data type (ဒေတာ အမျိုးအစား) တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TYPE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TYPE` က user-defined data type (အသုံးပြုသူ သတ်မှတ်သည့် data type) တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ Type တစ်ခုရဲ့ owner (ပိုင်ရှင်) ကသာလျှင် — အဲဒီ type ကို ဖယ်ရှားလို့ ရပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Type မရှိဘူးဆိုရင် error ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေးမှတ်ချက်) တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် data type ရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **CASCADE** — Type ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — table columns, functions နဲ့ operators) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Type ပေါ်မှာ မှီခိုနေတဲ့ objects တစ်ခုခု ရှိနေရင် type ကို drop လုပ်တာကို ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`box` ဆိုတဲ့ data type ကို ဖယ်ရှားဖို့:

```sql
DROP TYPE box;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က — PostgreSQL extension တစ်ခု ဖြစ်တဲ့ `IF EXISTS` option ကလွဲလို့ — SQL standard ထဲက သက်ဆိုင်ရာ command နဲ့ ဆင်တူပါတယ်။ ဒါပေမယ့် — `CREATE TYPE` command ရဲ့ အများစုနဲ့ PostgreSQL ထဲက data type extension mechanisms (data type တိုးချဲ့မှု ယန္တရားများ) တွေက SQL standard နဲ့ ကွဲပြားတယ်ဆိုတာ သတိပြုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TYPE](/docs/postgresql/sql-altertype), [CREATE TYPE](/docs/postgresql/sql-createtype)
