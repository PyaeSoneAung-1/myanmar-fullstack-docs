---
title: "DROP OPERATOR CLASS (operator class တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား operator class တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option၊ USING index_method ဖြင့် operator class ရည်ညွှန်းပုံ၊ class ကို မှီခိုနေသော indexes များအတွက် CASCADE လိုအပ်ချက်နှင့် operator family အပေါ် သက်ရောက်မှု မရှိခြင်း"
order: 292
source: "https://www.postgresql.org/docs/current/sql-dropopclass.html"
status: translated
updated: 2026-09-04
---

## DROP OPERATOR CLASS (operator class တစ်ခုကို ဖယ်ရှားခြင်း)

DROP OPERATOR CLASS — operator class တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP OPERATOR CLASS [ IF EXISTS ] name USING index_method [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP OPERATOR CLASS` က ရှိပြီးသား operator class တစ်ခုကို drop (ဖျက်သိမ်း) လုပ်ပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — သင်က operator class ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

`DROP OPERATOR CLASS` က — class က ရည်ညွှန်းထားတဲ့ operators ဒါမှမဟုတ် functions တွေထဲက ဘယ်ဟာကိုမှ drop မလုပ်ပါဘူး။ Operator class ကို မှီခိုနေတဲ့ indexes တွေ ရှိနေရင် — drop လုပ်ငန်းစဉ် ပြီးမြောက်ဖို့ — `CASCADE` ကို သတ်မှတ်ပေးရပါလိမ့်မယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Operator class မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ရှိပြီးသား operator class တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **index_method** — ဒီ operator class က ရည်ရွယ်ထားတဲ့ index access method ရဲ့ နာမည်။
- **CASCADE** — Operator class ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — indexes) ကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Operator class ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — operator class ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`DROP OPERATOR CLASS` က — class ပါဝင်နေတဲ့ operator family ကို drop လုပ်မှာ မဟုတ်ပါဘူး — family ထဲမှာ တခြား ဘာမှ မကျန်တော့ဘူးဆိုရင်တောင် မလုပ်ပါဘူး (အထူးသဖြင့် — family ကို `CREATE OPERATOR CLASS` က သွယ်ဝိုက်၍ (implicitly) ဖန်တီးခဲ့တဲ့ ကိစ္စမျိုးမှာပါ)။ Operator family အလွတ် (empty) တစ်ခုက အန္တရာယ် မရှိပါဘူး — ဒါပေမယ့် — သပ်ရပ်မှု အတွက်ဆိုရင် — family ကို `DROP OPERATOR FAMILY` နဲ့ ဖယ်ရှားချင်လာနိုင်ပါတယ်; ဒါမှမဟုတ် — ပိုကောင်းတာက — အစကတည်းက `DROP OPERATOR FAMILY` ကို သုံးတာ ဖြစ်နိုင်ပါတယ်။

## Examples (ဥပမာများ)

B-tree operator class `widget_ops` ကို ဖယ်ရှားဖို့:

```sql
DROP OPERATOR CLASS widget_ops USING btree;
```

Operator class ကို သုံးထားတဲ့ indexes တွေ ရှိပြီးသား ဖြစ်နေရင် — ဒီ command က အောင်မြင်မှာ မဟုတ်ပါဘူး။ ဒီလို indexes တွေကို operator class နဲ့အတူ drop လုပ်ဖို့ `CASCADE` ကို ထပ်ပေါင်းပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP OPERATOR CLASS` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER OPERATOR CLASS](/docs/postgresql/sql-alteropclass), [CREATE OPERATOR CLASS](https://www.postgresql.org/docs/current/sql-createopclass.html), [DROP OPERATOR FAMILY](/docs/postgresql/sql-dropopfamily)
