---
title: "ALTER SCHEMA (schema တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)"
description: "Schema တစ်ခု၏ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးသည့် command — schema ကို rename လုပ်ခြင်း သို့မဟုတ် owner ပြောင်းလဲခြင်း — လိုအပ်သော privileges များ၊ new_name တွင် pg_ ရှေ့ဆက် မသုံးနိုင်ခြင်း၊ SQL standard တွင် မပါဝင်ခြင်းအကြောင်း"
order: 244
source: "https://www.postgresql.org/docs/current/sql-alterschema.html"
status: translated
updated: 2026-09-04
---

## ALTER SCHEMA (schema တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)

ALTER SCHEMA — schema တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER SCHEMA name RENAME TO new_name
ALTER SCHEMA name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER SCHEMA` က schema တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်။

`ALTER SCHEMA` ကို သုံးဖို့ — သင်ဟာ schema ကို ပိုင်ဆိုင်ရပါမယ်။ Schema တစ်ခုကို rename လုပ်ဖို့ — database အတွက် `CREATE` privilege လည်း ရှိရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ — သင်ဟာ owner အသစ် ဖြစ်လာမယ့် role ဆီကို `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role မှာ database အတွက် `CREATE` privilege ရှိရပါမယ်။ (Superusers တွေမှာ ဒီ privileges တွေ အားလုံး အလိုအလျောက် ရှိတာ သတိပြုပါ။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား schema တစ်ခုရဲ့ နာမည်ပါ။
- **new_name** — Schema ရဲ့ နာမည်အသစ်ပါ။ နာမည်အသစ်က pg_ နဲ့ စလို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒီလို နာမည်တွေက system schemas တွေအတွက် သီးသန့် သတ်မှတ်ထားလို့ပါ။
- **new_owner** — Schema ရဲ့ owner အသစ်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER SCHEMA` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SCHEMA](/docs/postgresql/sql-createschema), [DROP SCHEMA](/docs/postgresql/sql-dropschema)
