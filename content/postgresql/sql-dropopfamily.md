---
title: "DROP OPERATOR FAMILY (operator family တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား operator family တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option၊ family အတွင်းရှိ operator classes များ တစ်ပါတည်း ဖယ်ရှားခံရခြင်း သို့သော် family က ရည်ညွှန်းထားသော operators/functions များ မပါဝင်ခြင်း၊ indexes များ မှီခိုနေပါက CASCADE လိုအပ်ချက်"
order: 294
source: "https://www.postgresql.org/docs/current/sql-dropopfamily.html"
status: translated
updated: 2026-09-04
---

## DROP OPERATOR FAMILY (operator family တစ်ခုကို ဖယ်ရှားခြင်း)

DROP OPERATOR FAMILY — operator family တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP OPERATOR FAMILY [ IF EXISTS ] name USING index_method [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP OPERATOR FAMILY` က ရှိပြီးသား operator family တစ်ခုကို drop (ဖျက်သိမ်း) လုပ်ပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — သင်က operator family ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

`DROP OPERATOR FAMILY` က — family အတွင်းမှာ ပါဝင်တဲ့ operator classes တွေ အားလုံးကို drop လုပ်တာ အပါအဝင် ဖြစ်ပေမယ့် — family က ရည်ညွှန်းထားတဲ့ operators ဒါမှမဟုတ် functions တွေထဲက ဘယ်ဟာကိုမှ drop မလုပ်ပါဘူး။ Family အတွင်းက operator classes တွေကို မှီခိုနေတဲ့ indexes တွေ ရှိနေရင် — drop လုပ်ငန်းစဉ် ပြီးမြောက်ဖို့ — `CASCADE` ကို သတ်မှတ်ပေးရပါလိမ့်မယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Operator family မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ရှိပြီးသား operator family တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **index_method** — ဒီ operator family က ရည်ရွယ်ထားတဲ့ index access method ရဲ့ နာမည်။
- **CASCADE** — Operator family ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Operator family ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — operator family ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

B-tree operator family `float_ops` ကို ဖယ်ရှားဖို့:

```sql
DROP OPERATOR FAMILY float_ops USING btree;
```

Family အတွင်းက operator classes တွေကို သုံးထားတဲ့ indexes တွေ ရှိပြီးသား ဖြစ်နေရင် — ဒီ command က အောင်မြင်မှာ မဟုတ်ပါဘူး။ ဒီလို indexes တွေကို operator family နဲ့အတူ drop လုပ်ဖို့ `CASCADE` ကို ထပ်ပေါင်းပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP OPERATOR FAMILY` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER OPERATOR FAMILY](https://www.postgresql.org/docs/current/sql-alteropfamily.html), [CREATE OPERATOR FAMILY](/docs/postgresql/sql-createopfamily), [ALTER OPERATOR CLASS](/docs/postgresql/sql-alteropclass), [CREATE OPERATOR CLASS](https://www.postgresql.org/docs/current/sql-createopclass.html), [DROP OPERATOR CLASS](/docs/postgresql/sql-dropopclass)
