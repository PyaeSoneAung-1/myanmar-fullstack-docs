---
title: "DROP STATISTICS (extended statistics object များကို ဖယ်ရှားခြင်း)"
description: "Database မှ statistics object (ကိန်းဂဏန်း အချက်အလက် object) များကို ဖယ်ရှားပေးသည့် command — statistics object ၏ owner, schema ၏ owner သို့မဟုတ် superuser ဖြစ်မှသာ drop လုပ်နိုင်ပြီး IF EXISTS option ပါဝင်သည်; SQL standard တွင် မပါဝင်ပါ"
order: 301
source: "https://www.postgresql.org/docs/current/sql-dropstatistics.html"
status: translated
updated: 2026-09-04
---

## DROP STATISTICS (extended statistics object များကို ဖယ်ရှားခြင်း)

DROP STATISTICS — extended statistics object များကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP STATISTICS [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP STATISTICS` က database ထဲက extended statistics object (တိုးချဲ့ထားသော statistics object) (များ) ကို ဖယ်ရှားပေးပါတယ်။ Statistics object တစ်ခုကို — statistics object ရဲ့ owner (ပိုင်ရှင်)၊ schema ရဲ့ owner ဒါမှမဟုတ် superuser တစ်ယောက်ကသာ drop (ဖျက်သိမ်း) လုပ်လို့ ရပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Statistics object မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် statistics object ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **CASCADE** / **RESTRICT** — Statistics တွေပေါ်မှာ မှီခိုနေတဲ့ (dependent) objects တွေ မရှိတာမို့ — ဒီ key words တွေက ဘာ အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Examples (ဥပမာများ)

မတူညီတဲ့ schemas တွေထဲက statistics object နှစ်ခုကို — သူတို့ မရှိဘူးဆိုရင်တောင် error မဖြစ်ဘဲ — ဖျက်ဆီးဖို့:

```sql
DROP STATISTICS IF EXISTS
    accounting.users_uid_creation,
    public.grants_user_role;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP STATISTICS` command ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER STATISTICS](/docs/postgresql/sql-alterstatistics), [CREATE STATISTICS](https://www.postgresql.org/docs/current/sql-createstatistics.html)
