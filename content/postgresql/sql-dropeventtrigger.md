---
title: "DROP EVENT TRIGGER (event trigger တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား event trigger တစ်ခုကို ဖယ်ရှားပေးသော command — IF EXISTS option ၏ အပြုအမူ နှင့် CASCADE/RESTRICT ဆိုင်ရာ မှီခို objects များ ကိုင်တွယ်ပုံ အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 232
source: "https://www.postgresql.org/docs/current/sql-dropeventtrigger.html"
status: translated
updated: 2026-09-04
---

## DROP EVENT TRIGGER (event trigger တစ်ခုကို ဖယ်ရှားခြင်း)

DROP EVENT TRIGGER — event trigger တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP EVENT TRIGGER [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP EVENT TRIGGER` က ရှိပြီးသား event trigger တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့အတွက် — လက်ရှိ user က event trigger ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Event trigger မရှိဘူးဆိုရင် — error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် event trigger ရဲ့ နာမည်။
- **CASCADE** — Trigger အပေါ် မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေအပေါ် မှီခိုနေတဲ့ objects တွေကိုပါ အလှည့်ကျ ဆက်ပြီး drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Trigger အပေါ် မှီခိုနေတဲ့ objects တွေ ရှိနေရင် — trigger ကို drop လုပ်တာကို ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`snitch` trigger ကို ဖျက်ဆီးဖို့:

```sql
DROP EVENT TRIGGER snitch;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP EVENT TRIGGER` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE EVENT TRIGGER](/docs/postgresql/sql-createeventtrigger), [ALTER EVENT TRIGGER](/docs/postgresql/sql-altereventtrigger)
