---
title: "DROP TABLESPACE (tablespace တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "System ထဲကနေ tablespace တစ်ခုကို ဖယ်ရှားခြင်း — IF EXISTS option ၊ ပိုင်ရှင် သို့မဟုတ် superuser လိုအပ်ချက် ၊ tablespace ဗလာ ဖြစ်ရန် သတ်မှတ်ချက်နှင့် temp_tablespaces setting နှင့် ဆက်စပ်မှု အကြောင်း — PostgreSQL extension command"
order: 282
source: "https://www.postgresql.org/docs/current/sql-droptablespace.html"
status: translated
updated: 2026-09-04
---

## DROP TABLESPACE (tablespace တစ်ခုကို ဖယ်ရှားခြင်း)

DROP TABLESPACE — tablespace တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TABLESPACE [ IF EXISTS ] name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TABLESPACE` က tablespace တစ်ခုကို system ထဲကနေ ဖယ်ရှားပေးပါတယ်။

Tablespace တစ်ခုကို ၎င်းရဲ့ ပိုင်ရှင် ဒါမှမဟုတ် superuser တစ်ဦးကပဲ drop လုပ်နိုင်ပါတယ်။ Tablespace ကို drop မလုပ်ခင် — database objects တွေ အားလုံး ကင်းစင်ပြီး ဗလာ ဖြစ်နေရပါမယ်။ Current database ထဲက objects တွေ ဘယ်တစ်ခုမှ tablespace ကို သုံးနေတာ မရှိဘူးဆိုရင်တောင် — တခြား databases တွေထဲက objects တွေက အဲဒီ tablespace ထဲမှာ ကျန်ရှိနေနိုင်တာ ဖြစ်နိုင်ပါတယ်။ ဒါ့အပြင် — tablespace က [temp_tablespaces](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TEMP-TABLESPACES) setting ရဲ့ — လက်ရှိ active ဖြစ်နေတဲ့ session တစ်ခုခုရဲ့ — စာရင်းထဲမှာ ပါနေရင်လည်း — tablespace ထဲမှာ temporary files တွေ ရှိနေတာကြောင့် — `DROP` က မအောင်မြင်ဘဲ ဖြစ်နိုင်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Tablespace မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — Tablespace တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`DROP TABLESPACE` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

## Examples (ဥပမာများ)

`mystuff` tablespace ကို system ထဲကနေ ဖယ်ရှားရန်:

```sql
DROP TABLESPACE mystuff;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP TABLESPACE` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TABLESPACE](/docs/postgresql/sql-createtablespace), [ALTER TABLESPACE](/docs/postgresql/sql-altertablespace)
