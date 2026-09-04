---
title: "DROP PUBLICATION (publication တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Database ထဲက တည်ရှိပြီးသား publication (ထုတ်ပြန်ချက်) တစ်ခုကို ဖယ်ရှားပေးသည့် command — IF EXISTS option ပါဝင်ပြီး publication ၏ owner သို့မဟုတ် superuser ဖြစ်မှသာ drop လုပ်နိုင်သည်; PostgreSQL extension တစ်ခုဖြစ်သည်"
order: 299
source: "https://www.postgresql.org/docs/current/sql-droppublication.html"
status: translated
updated: 2026-09-04
---

## DROP PUBLICATION (publication တစ်ခုကို ဖယ်ရှားခြင်း)

DROP PUBLICATION — publication တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP PUBLICATION [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP PUBLICATION` က database ထဲက တည်ရှိပြီးသား publication (ထုတ်ပြန်ချက်) တစ်ခုကို ဖယ်ရှားပေးပါတယ်။

Publication တစ်ခုကို — သူ့ရဲ့ owner (ပိုင်ရှင်) သို့မဟုတ် superuser တစ်ယောက်ကသာ drop (ဖျက်သိမ်း) လုပ်လို့ ရပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Publication မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — တည်ရှိပြီးသား publication တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **CASCADE** / **RESTRICT** — Publications တွေပေါ်မှာ မှီခိုနေတဲ့ (dependent) objects တွေ မရှိတာမို့ — ဒီ key words တွေက ဘာ အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Examples (ဥပမာများ)

Publication တစ်ခုကို ဖယ်ရှားခြင်း:

```sql
DROP PUBLICATION mypublication;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP PUBLICATION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), [ALTER PUBLICATION](https://www.postgresql.org/docs/current/sql-alterpublication.html)
