---
title: "DROP TRIGGER (trigger တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Trigger တစ်ခုရဲ့ definition ကို ဖယ်ရှားပေးသော command — IF EXISTS option နှင့် CASCADE/RESTRICT အပြုအမူများ အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 229
source: "https://www.postgresql.org/docs/current/sql-droptrigger.html"
status: translated
updated: 2026-09-04
---

## DROP TRIGGER (trigger တစ်ခုကို ဖယ်ရှားခြင်း)

DROP TRIGGER — trigger တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TRIGGER [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TRIGGER` က ရှိပြီးသား trigger definition တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့အတွက် — trigger ကို သတ်မှတ်ထားတဲ့ table ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Trigger မရှိဘူးဆိုရင် error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် trigger ရဲ့ နာမည်။
- **table_name** — Trigger ကို သတ်မှတ်ထားတဲ့ table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်ပါတယ်)။
- **CASCADE** — Trigger အပေါ် မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေအပေါ် မှီခိုနေတဲ့ objects တွေကိုပါ အလှည့်ကျ ဆက်ပြီး drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Trigger အပေါ် မှီခိုနေတဲ့ objects တွေ ရှိနေရင် — trigger ကို drop လုပ်တာကို ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`films` table ပေါ်က `if_dist_exists` trigger ကို ဖျက်ဆီးဖို့:

```sql
DROP TRIGGER if_dist_exists ON films;
```

## Compatibility (လိုက်ဖက်ညီမှု)

PostgreSQL ရဲ့ `DROP TRIGGER` statement က SQL standard နဲ့ လိုက်ဖက်မှု မရှိပါဘူး။ SQL standard ထဲမှာ — trigger နာမည်တွေက tables တွေနဲ့ ဒေသဆိုင်ရာ (local) မဟုတ်ဘူးလို့ သတ်မှတ်ထားတာမို့ — command က `DROP TRIGGER name` ဆိုတဲ့ ရိုးရိုး ပုံစံပဲ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TRIGGER](/docs/postgresql/sql-createtrigger)
