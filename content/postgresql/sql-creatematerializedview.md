---
title: "CREATE MATERIALIZED VIEW (materialized view အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Query တစ်ခုရဲ့ materialized view ကို သတ်မှတ် ဖန်တီးပေးတဲ့ command — IF NOT EXISTS, column name list, USING method, WITH (storage parameters), TABLESPACE, AS query နှင့် WITH [NO] DATA options များအကြောင်း — view ကို ဖန်တီးချိန်မှာ data ဖြည့်တင်းပြီး နောက်ပိုင်းတွင် REFRESH MATERIALIZED VIEW ဖြင့် ပြန်လည် ဖြည့်တင်နိုင်ခြင်း၊ temporary materialized views များကို ထောက်ပံ့မထားခြင်းတို့ ပါဝင်သည်"
order: 203
source: "https://www.postgresql.org/docs/current/sql-creatematerializedview.html"
status: translated
updated: 2026-09-04
---

## CREATE MATERIALIZED VIEW (materialized view အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE MATERIALIZED VIEW — materialized view အသစ်တစ်ခုကို သတ်မှတ်ပေးတဲ့ command ဖြစ်ပါတယ်။

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE MATERIALIZED VIEW` က query တစ်ခုရဲ့ materialized view ကို သတ်မှတ်ပေးပါတယ်။ Command ကို ထုတ်ပြန်တဲ့အချိန်မှာ — query ကို execute လုပ်ပြီး — view ကို data ဖြည့်တင်ဖို့ သုံးပါတယ် (`WITH NO DATA` ကို သုံးထားရင်ကလွဲလို့) — ပြီးတော့ နောက်ပိုင်းမှာ `REFRESH MATERIALIZED VIEW` ကို သုံးပြီး ပြန်လည် ဖြည့်တင်လို့ ရပါတယ်။

`CREATE MATERIALIZED VIEW` က `CREATE TABLE AS` နဲ့ ဆင်တူပါတယ် — ဒါပေမယ့် — view ကို စတင် ဖြည့်တင်းဖို့ သုံးခဲ့တဲ့ query ကိုပါ မှတ်မိထားတာမို့ — လိုအပ်တဲ့အခါ နောက်ပိုင်းမှာ ပြန်လည် ဖြည့်တင်နိုင်ပါတယ်။ Materialized view တစ်ခုမှာ table တစ်ခုရဲ့ ဂုဏ်သတ္တိတွေနဲ့ တူညီတာတွေ အများအပြား ရှိပါတယ် — ဒါပေမယ့် — temporary materialized views တွေကိုတော့ ထောက်ပံ့မထားပါဘူး။

`CREATE MATERIALIZED VIEW` ကို execute လုပ်ဖို့ — materialized view အတွက် သုံးမယ့် schema ပေါ်မှာ `CREATE` privilege လိုအပ်ပါတယ်။

## Parameters (parameter များ)

- **IF NOT EXISTS** — နာမည်တူ materialized view တစ်ခု ရှိပြီးသားဆိုရင် — error တစ်ခု မထုတ်ပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။ ရှိပြီးသား materialized view က ဖန်တီးလိုက်မယ့်ဟာနဲ့ ဆင်တူဖို့တော့ အာမခံချက် မရှိဘူးဆိုတာ သတိပြုပါ။
- **table_name** — ဖန်တီးရမယ့် materialized view ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။ နာမည်က — schema တစ်ခုတည်းထဲက တခြား relation (table, sequence, index, view, materialized view ဒါမှမဟုတ် foreign table) တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။
- **column_name** — Materialized view အသစ်ထဲက column တစ်ခုရဲ့ နာမည်။ Column နာမည်တွေ မပေးထားရင် — query ရဲ့ output column နာမည်တွေကနေ ယူပါတယ်။
- **USING method** — ဒီ optional clause က — materialized view အသစ်ရဲ့ အကြောင်းအရာတွေကို သိမ်းဆည်းဖို့ သုံးမယ့် — table access method ကို သတ်မှတ်ပေးပါတယ်; method က TABLE type ရဲ့ access method တစ်ခု ဖြစ်ရပါမယ်။ နောက်ထပ် အချက်အလက်အတွက် Chapter 62 ကို ကြည့်ပါ။ ဒီ option ကို မသတ်မှတ်ထားရင် — materialized view အသစ်အတွက် default table access method ကို ရွေးချယ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် default_table_access_method ကို ကြည့်ပါ။
- **WITH ( storage_parameter [= value] [, ... ] )** — ဒီ clause က — materialized view အသစ်အတွက် optional storage parameters တွေကို သတ်မှတ်ပေးပါတယ်; နောက်ထပ် အချက်အလက်အတွက် CREATE TABLE documentation ထဲက Storage Parameters ကို ကြည့်ပါ။ CREATE TABLE အတွက် ထောက်ပံ့ထားတဲ့ parameters တွေ အားလုံးကို CREATE MATERIALIZED VIEW အတွက်လည်း ထောက်ပံ့ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် CREATE TABLE ကို ကြည့်ပါ။
- **TABLESPACE tablespace_name** — tablespace_name ဆိုတာ — materialized view အသစ်ကို ဖန်တီးရမယ့် tablespace ရဲ့ နာမည် ဖြစ်ပါတယ်။ မသတ်မှတ်ထားရင် — default_tablespace ကို ထည့်သွင်း စဉ်းစားပါတယ်။
- **query** — SELECT, TABLE ဒါမှမဟုတ် VALUES command တစ်ခု ဖြစ်ပါတယ်။ ဒီ query က security-restricted operation (လုံခြုံရေး ကန့်သတ်ထားသော လုပ်ဆောင်ချက်) တစ်ခုအနေနဲ့ run လုပ်ပါလိမ့်မယ်; အထူးသဖြင့် — ကိုယ်တိုင် temporary tables တွေ ဖန်တီးတတ်တဲ့ functions တွေကို ခေါ်ဆိုတာတွေကတော့ fail ဖြစ်ပါလိမ့်မယ်။ ဒါ့အပြင် — query run လုပ်နေတဲ့အချိန်အတွင်း — search_path ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။
- **WITH [ NO ] DATA** — ဒီ clause က — materialized view ကို ဖန်တီးချိန်မှာ data ဖြည့်တင်းသင့်လား မဖြည့်တင်းသင့်လားဆိုတာ သတ်မှတ်ပေးပါတယ်။ မဖြည့်တင်းဘူးဆိုရင် — materialized view ကို unscannable (scan လုပ်လို့ မရ) အဖြစ် flag တပ်ထားပြီး — `REFRESH MATERIALIZED VIEW` ကို သုံးတဲ့အထိ — query လုပ်လို့ မရပါဘူး။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE MATERIALIZED VIEW` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER MATERIALIZED VIEW](/docs/postgresql/sql-altermaterializedview), [CREATE TABLE AS](https://www.postgresql.org/docs/current/sql-createtableas.html), [CREATE VIEW](/docs/postgresql/sql-createview), [DROP MATERIALIZED VIEW](/docs/postgresql/sql-dropmaterializedview), [REFRESH MATERIALIZED VIEW](/docs/postgresql/sql-refreshmaterializedview)
