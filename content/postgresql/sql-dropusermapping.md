---
title: "DROP USER MAPPING (user mapping တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Foreign server တစ်ခုအတွက် user mapping တစ်ခုကို ဖယ်ရှားခြင်း — IF EXISTS option ၊ user_name ၊ server_name parameter များနှင့် SQL/MED လိုက်ဖက်ညီမှု ပါဝင်သည်"
order: 278
source: "https://www.postgresql.org/docs/current/sql-dropusermapping.html"
status: translated
updated: 2026-09-04
---

## DROP USER MAPPING (user mapping တစ်ခုကို ဖယ်ရှားခြင်း)

DROP USER MAPPING — foreign server တစ်ခုအတွက် user mapping တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP USER MAPPING [ IF EXISTS ] FOR { user_name | USER | CURRENT_ROLE | CURRENT_USER | PUBLIC } SERVER server_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP USER MAPPING` က foreign server တစ်ခုကနေ ရှိပြီးသား user mapping တစ်ခုကို ဖယ်ရှားပေးပါတယ်။

Foreign server တစ်ခုရဲ့ ပိုင်ရှင်က — အဲဒီ server အတွက် user mappings တွေကို user တိုင်းအတွက် ဖယ်ရှားနိုင်ပါတယ်။ ဒါ့အပြင် — server ပေါ်မှာ `USAGE` privilege ကို ပေးအပ်ခံထားရတဲ့ user တစ်ဦးကလည်း — သူ့ကိုယ်ပိုင် user name အတွက် user mapping တစ်ခုကို ဖယ်ရှားနိုင်ပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — User mapping မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **user_name** — Mapping ရဲ့ user name ဖြစ်ပါတယ်။ CURRENT_ROLE, CURRENT_USER နဲ့ USER တို့က လက်ရှိ user ရဲ့ နာမည်နဲ့ ကိုက်ညီပါတယ်။ PUBLIC ကို — system ထဲက လက်ရှိ နဲ့ အနာဂတ် user နာမည်တွေ အားလုံးနဲ့ ကိုက်ညီဖို့ သုံးပါတယ်။
- **server_name** — User mapping ရဲ့ server name ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

User mapping `bob` ကို — server `foo` ပေါ်ကနေ — ၎င်း ရှိနေမယ်ဆိုရင် ဖယ်ရှားရန်:

```sql
DROP USER MAPPING IF EXISTS FOR bob SERVER foo;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP USER MAPPING` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။ `IF EXISTS` clause ကတော့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE USER MAPPING](/docs/postgresql/sql-createusermapping), [ALTER USER MAPPING](/docs/postgresql/sql-alterusermapping)
