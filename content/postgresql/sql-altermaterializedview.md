---
title: "ALTER MATERIALIZED VIEW (materialized view တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Materialized view တစ်ခုရဲ့ အရန် (auxiliary) ဂုဏ်သတ္တိများကို ပြောင်းလဲပေးတဲ့ command — column statistics/storage/compression သတ်မှတ်ခြင်းနှင့် ပြန်သတ်ခြင်း (SET/RESET), CLUSTER ဆိုင်ရာ actions များ, SET ACCESS METHOD, SET TABLESPACE, OWNER TO, RENAME, SET SCHEMA, DEPENDS ON EXTENSION စသည့် subforms နှင့် actions များအကြောင်း — ALTER TABLE ၏ အောက်ခံပုံစံများ နှင့် ပိုင်ဆိုင်မှု (ownership) လိုအပ်ချက်များ ပါဝင်သည်"
order: 204
source: "https://www.postgresql.org/docs/current/sql-altermaterializedview.html"
status: translated
updated: 2026-09-04
---

## ALTER MATERIALIZED VIEW (materialized view တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER MATERIALIZED VIEW — materialized view တစ်ခုရဲ့ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER MATERIALIZED VIEW [ IF EXISTS ] name
    action [, ... ]
ALTER MATERIALIZED VIEW name
    [ NO ] DEPENDS ON EXTENSION extension_name
ALTER MATERIALIZED VIEW [ IF EXISTS ] name
    RENAME [ COLUMN ] column_name TO new_column_name
ALTER MATERIALIZED VIEW [ IF EXISTS ] name
    RENAME TO new_name
ALTER MATERIALIZED VIEW [ IF EXISTS ] name
    SET SCHEMA new_schema
ALTER MATERIALIZED VIEW ALL IN TABLESPACE name [ OWNED BY role_name [, ... ] ]
    SET TABLESPACE new_tablespace [ NOWAIT ]

where action is one of:

    ALTER [ COLUMN ] column_name SET STATISTICS integer
    ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
    ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
    ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN | DEFAULT }
    ALTER [ COLUMN ] column_name SET COMPRESSION compression_method
    CLUSTER ON index_name
    SET WITHOUT CLUSTER
    SET ACCESS METHOD new_access_method
    SET TABLESPACE new_tablespace
    SET ( storage_parameter [= value] [, ... ] )
    RESET ( storage_parameter [, ... ] )
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER MATERIALIZED VIEW` က — ရှိပြီးသား materialized view တစ်ခုရဲ့ အရန် (auxiliary) ဂုဏ်သတ္တိ အမျိုးမျိုးကို ပြောင်းလဲပေးပါတယ်။

`ALTER MATERIALIZED VIEW` ကို သုံးဖို့ — သင်က materialized view ကို ပိုင်ဆိုင်ရပါမယ်။ Materialized view ရဲ့ schema ကို ပြောင်းဖို့ဆိုရင် — schema အသစ်ပေါ်မှာလည်း `CREATE` ထူးခွင့် ရှိရပါမယ်။ Owner ကို ပြောင်းဖို့ဆိုရင် — သင်က `SET ROLE` ကို သုံးပြီး owner role အသစ်ဆီ ပြောင်းနိုင်ရမယ် — ပြီးတော့ အဲဒီ role က materialized view ရဲ့ schema ပေါ်မှာ `CREATE` ထူးခွင့် ရှိရပါမယ်။ (ဒီကန့်သတ်ချက်တွေက — owner ကို ပြောင်းတာက materialized view ကို drop ပြီး ပြန် create လုပ်ရင် လုပ်လို့ ရနိုင်တာထက် ပိုပြီး ဘာမှ မလုပ်နိုင်အောင် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် materialized view ရဲ့ ownership ကိုမဆို ဘာပဲ ဖြစ်ဖြစ် ပြောင်းလဲနိုင်ပါတယ်။)

`ALTER MATERIALIZED VIEW` အတွက် ရနိုင်တဲ့ statement subforms (ပုံစံကွဲများ) နဲ့ actions တွေက — `ALTER TABLE` အတွက် ရနိုင်တာတွေရဲ့ subset (အစိတ်အပိုင်း) တစ်ခု ဖြစ်ပြီး — materialized views တွေမှာ သုံးတဲ့အခါ အဓိပ္ပာယ် အတူတူပဲ ရှိပါတယ်။ အသေးစိတ်အတွက် [`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) ရဲ့ ဖော်ပြချက်တွေကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ရှိပြီးသား materialized view တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။
- **column_name** — ရှိပြီးသား column တစ်ခုရဲ့ နာမည်။
- **extension_name** — Materialized view က မှီခိုရမယ့် (NO ကို သတ်မှတ်ထားရင် မမှီခိုတော့မယ့်) extension ရဲ့ နာမည်။ Extension တစ်ခုပေါ်မှာ မှီခိုတယ်လို့ အမှတ်အသား လုပ်ထားတဲ့ materialized view တစ်ခုကို — အဲဒီ extension ကို drop လုပ်တဲ့အခါ — အလိုအလျောက် drop လုပ်ပါတယ်။
- **new_column_name** — ရှိပြီးသား column တစ်ခုအတွက် နာမည် အသစ်။
- **new_owner** — Materialized view ရဲ့ ပိုင်ရှင် အသစ်ရဲ့ user name။
- **new_name** — Materialized view အတွက် နာမည် အသစ်။
- **new_schema** — Materialized view အတွက် schema အသစ်။

## Examples (ဥပမာများ)

`foo` materialized view ကို `bar` လို့ နာမည်ပြောင်းဖို့:

```sql
ALTER MATERIALIZED VIEW foo RENAME TO bar;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER MATERIALIZED VIEW` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE MATERIALIZED VIEW](/docs/postgresql/sql-creatematerializedview), [DROP MATERIALIZED VIEW](/docs/postgresql/sql-dropmaterializedview), [REFRESH MATERIALIZED VIEW](/docs/postgresql/sql-refreshmaterializedview)
