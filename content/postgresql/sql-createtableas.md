---
title: "CREATE TABLE AS (query ၏ ရလဒ်များမှ table အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "SELECT command တစ်ခု၏ ရလဒ်များဖြင့် table အသစ်တစ်ခုကို ဖန်တီး ဖြည့်သွင်းပေးသော command — GLOBAL/LOCAL, TEMPORARY/TEMP, UNLOGGED, IF NOT EXISTS, USING method, WITH storage parameters, ON COMMIT, TABLESPACE, WITH [NO] DATA option များ၏ အသေးစိတ် ရှင်းလင်းချက်နှင့် view နှင့် ကွာခြားချက်"
order: 217
source: "https://www.postgresql.org/docs/current/sql-createtableas.html"
status: translated
updated: 2026-09-04
---

## CREATE TABLE AS (query ၏ ရလဒ်များမှ table အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE TABLE AS — query တစ်ခုရဲ့ ရလဒ်တွေကနေ table အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ [ GLOBAL | LOCAL ] { TEMPORARY | TEMP } | UNLOGGED ] TABLE [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) | WITHOUT OIDS ]
    [ ON COMMIT { PRESERVE ROWS | DELETE ROWS | DROP } ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TABLE AS` က table တစ်ခုကို ဖန်တီးပြီး — `SELECT` command တစ်ခုက တွက်ချက်ပေးတဲ့ data တွေနဲ့ ဖြည့်သွင်းပေးပါတယ်။ Table ရဲ့ columns တွေမှာ — `SELECT` ရဲ့ output columns တွေနဲ့ ဆက်စပ်နေတဲ့ နာမည်တွေနဲ့ data types တွေ ရှိပါတယ် (column နာမည်အသစ်တွေရဲ့ explicit list တစ်ခု ပေးခြင်းအားဖြင့် column နာမည်တွေကို override (အစားထိုး) လုပ်နိုင်တာကတော့ ခြွင်းချက်ပါ)။

`CREATE TABLE AS` က view တစ်ခု ဖန်တီးတာနဲ့ အတော်လေး ဆင်တူပါတယ် — ဒါပေမယ့် — တကယ်တော့ အတော်ကို ကွဲပြားပါတယ်: ၎င်းက table အသစ်တစ်ခုကို ဖန်တီးပြီး — table အသစ်ကို ကနဦး ဖြည့်သွင်းဖို့ query ကို တစ်ကြိမ်ပဲ အကဲဖြတ်ပါတယ်။ Table အသစ်က — query ရဲ့ source tables တွေမှာ နောက်ပိုင်း ဖြစ်ပေါ်လာတဲ့ ပြောင်းလဲမှုတွေကို ခြေရာခံမှာ မဟုတ်ပါဘူး။ ဆန့်ကျင်ဘက်အနေနဲ့ — view တစ်ခုက — query လုပ်ခံရတိုင်း — သူ့ရဲ့ defining `SELECT` statement ကို ပြန်လည် အကဲဖြတ်ပါတယ်။

`CREATE TABLE AS` က — table အတွက် သုံးမယ့် schema ပေါ်မှာ `CREATE` privilege လိုအပ်ပါတယ်။

## Parameters (parameter များ)

- **GLOBAL or LOCAL** — Compatibility အတွက် လျစ်လျူရှုထားပါတယ်။ ဒီ keywords တွေကို သုံးတာက deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထား) ဖြစ်ပါတယ်; အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။

- **TEMPORARY or TEMP** — သတ်မှတ်ထားရင် — table ကို temporary table (ယာယီ table) တစ်ခုအနေနဲ့ ဖန်တီးပါတယ်။ အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။
- **UNLOGGED** — သတ်မှတ်ထားရင် — table ကို unlogged table (write-ahead log မှတ်တမ်းမသွင်းတဲ့ table) တစ်ခုအနေနဲ့ ဖန်တီးပါတယ်။ အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။
- **IF NOT EXISTS** — နာမည်တူ relation တစ်ခု ရှိပြီးသားဆိုရင် error တစ်ခု မထုတ်ဘဲ — notice တစ်ခုကိုပဲ ထုတ်ပေးပြီး — table ကို ပြုပြင်မွမ်းမံမပြုလုပ်ဘဲ ထားလိုက်ပါတယ်။
- **table_name** — ဖန်တီးရမယ့် table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **column_name** — Table အသစ်ထဲက column တစ်ခုရဲ့ နာမည်။ Column နာမည်တွေ မပေးထားဘူးဆိုရင် — query ရဲ့ output column နာမည်တွေကနေ ယူပါတယ်။
- **USING method** — ဒီ optional clause က — table အသစ်ရဲ့ အကြောင်းအရာတွေကို သိမ်းဆည်းဖို့ သုံးမယ့် table access method ကို သတ်မှတ်ပေးပါတယ်; method က TABLE အမျိုးအစားရဲ့ access method တစ်ခု ဖြစ်ရပါမယ်။ နောက်ထပ် အချက်အလက်အတွက် အခန်း 62 ကို ကြည့်ပါ။ ဒီ option ကို မသတ်မှတ်ထားဘူးဆိုရင် — table အသစ်အတွက် default table access method ကို ရွေးချယ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် default_table_access_method ကို ကြည့်ပါ။
- **WITH ( storage_parameter [= value] [, ... ] )** — ဒီ clause က table အသစ်အတွက် optional storage parameters တွေကို သတ်မှတ်ပေးပါတယ်; နောက်ထပ် အချက်အလက်အတွက် CREATE TABLE documentation ထဲက Storage Parameters ကို ကြည့်ပါ။ Backward-compatibility (နောက်ပြန် လိုက်ဖက်မှု) အတွက် — table တစ်ခုရဲ့ WITH clause ထဲမှာ — table အသစ်ရဲ့ rows တွေမှာ OIDs (object identifiers) တွေ မပါဝင်စေဖို့ သတ်မှတ်ပေးတဲ့ OIDS=FALSE ကိုလည်း ထည့်သွင်းနိုင်ပါတယ်; OIDS=TRUE ကိုတော့ နောက်ထပ် ထောက်ပံ့တော့ မဟုတ်ပါဘူး။
- **WITHOUT OIDS** — ဒါက — table တစ်ခုကို OIDs မပါဘဲ ကြေညာဖို့ backward-compatible syntax တစ်ခု ဖြစ်ပါတယ်; OIDs ပါတဲ့ table တစ်ခု ဖန်တီးတာကိုတော့ နောက်ထပ် ထောက်ပံ့တော့ မဟုတ်ပါဘူး။
- **ON COMMIT** — Transaction block တစ်ခုရဲ့ အဆုံးမှာ temporary tables တွေရဲ့ အပြုအမူကို ON COMMIT သုံးပြီး ထိန်းချုပ်နိုင်ပါတယ်။ Option သုံးခု ရှိပါတယ်:

PRESERVE ROWS

Transactions တွေရဲ့ အဆုံးတွေမှာ အထူး လုပ်ဆောင်ချက် တစ်ခုမှ မရှိပါဘူး။ ဒါက default အပြုအမူ ဖြစ်ပါတယ်။

DELETE ROWS

Transaction block တစ်ခုစီရဲ့ အဆုံးမှာ — temporary table ထဲက rows တွေ အားလုံးကို ဖျက်ပစ်ပါလိမ့်မယ်။ အခြေခံအားဖြင့် — commit တစ်ခုစီမှာ TRUNCATE တစ်ခုကို အလိုအလျောက် လုပ်ဆောင်ပေးတာ ဖြစ်ပါတယ်။

DROP

Temporary table ကို — လက်ရှိ transaction block ရဲ့ အဆုံးမှာ drop လုပ်ပါလိမ့်မယ်။
- **TABLESPACE tablespace_name** — tablespace_name ဆိုတာ — table အသစ်ကို ဖန်တီးရမယ့် tablespace ရဲ့ နာမည် ဖြစ်ပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — default_tablespace ကို ထည့်သွင်း စဉ်းစားပြီး — table က temporary ဖြစ်နေရင်တော့ — temp_tablespaces ကို ထည့်သွင်း စဉ်းစားပါတယ်။
- **query** — `SELECT`၊ `TABLE` ဒါမှမဟုတ် `VALUES` command တစ်ခု၊ ဒါမှမဟုတ် — prepared `SELECT`၊ `TABLE` ဒါမှမဟုတ် `VALUES` query တစ်ခုကို run ပေးတဲ့ `EXECUTE` command တစ်ခု။
- **WITH [ NO ] DATA** — ဒီ clause က — query က ထုတ်လုပ်တဲ့ data ကို table အသစ်ထဲကို ကူးယူ ထည့်သွင်းမလား မထည့်သွင်းဘူးလားဆိုတာ သတ်မှတ်ပေးပါတယ်။ မထည့်သွင်းဘူးဆိုရင် — table ရဲ့ structure ကိုပဲ ကူးယူပါတယ်။ Default ကတော့ data တွေကို ကူးယူပါတယ်။

## Notes (မှတ်စုများ)

ဒီ command က [SELECT INTO](/docs/postgresql/sql-selectinto) နဲ့ လုပ်ဆောင်ချက်အရ ဆင်တူပါတယ် — ဒါပေမယ့် — `SELECT INTO` syntax ရဲ့ တခြား အသုံးပြုမှုတွေနဲ့ ရောထွေးသွားနိုင်ခြေ နည်းတာမို့ — ဒါကို ပိုနှစ်သက်ပါတယ်။ ထို့ပြင် — `CREATE TABLE AS` က `SELECT INTO` ပေးတဲ့ လုပ်ဆောင်ချက်တွေရဲ့ superset (ပိုကျယ်ပြန့်တဲ့ အစုအဝေး) တစ်ခုကို ပေးပါတယ်။

## Examples (ဥပမာများ)

`films` table ထဲက မကြာသေးတဲ့ (recent) entries တွေပဲ ပါဝင်တဲ့ `films_recent` table အသစ်တစ်ခုကို ဖန်တီးခြင်း:

```sql
CREATE TABLE films_recent AS
  SELECT * FROM films WHERE date_prod >= '2002-01-01';
```

Table တစ်ခုကို လုံးလုံး ကူးယူဖို့ဆိုရင် — `TABLE` command ကို သုံးတဲ့ short form ကိုလည်း သုံးနိုင်ပါတယ်:

```sql
CREATE TABLE films2 AS
  TABLE films;
```

Prepared statement တစ်ခုကို သုံးပြီး — `films` table ထဲက မကြာသေးတဲ့ entries တွေပဲ ပါဝင်တဲ့ `films_recent` temporary table အသစ်တစ်ခုကို ဖန်တီးခြင်း။ Table အသစ်ကို commit မှာ drop လုပ်ပါလိမ့်မယ်:

```sql
PREPARE recentfilms(date) AS
  SELECT * FROM films WHERE date_prod > $1;
CREATE TEMP TABLE films_recent ON COMMIT DROP AS
  EXECUTE recentfilms('2002-01-01');
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE TABLE AS` က SQL standard နဲ့ ကိုက်ညီပါတယ်။ အောက်ပါတို့ကတော့ standard မဟုတ်တဲ့ extensions တွေ ဖြစ်ပါတယ်:

- Standard က subquery clause ပတ်လည်မှာ parentheses တွေ လိုအပ်ပါတယ်; PostgreSQL မှာတော့ ဒီ parentheses တွေက optional ပါ။
- Standard မှာ WITH [ NO ] DATA clause က လိုအပ် (required) ပါတယ်; PostgreSQL မှာတော့ optional ပါ။
- PostgreSQL က temporary tables တွေကို standard နဲ့ အတော်လေး ကွဲပြားတဲ့ နည်းလမ်းနဲ့ ကိုင်တွယ်ပါတယ်; အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။
- WITH clause က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်; storage parameters တွေက standard ထဲမှာ မပါပါဘူး။
- Tablespaces တွေရဲ့ PostgreSQL concept က standard ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး။ ဒါကြောင့် — TABLESPACE clause က extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE MATERIALIZED VIEW](/docs/postgresql/sql-creatematerializedview), [CREATE TABLE](/docs/postgresql/sql-createtable), [EXECUTE](/docs/postgresql/sql-execute), [SELECT](/docs/postgresql/sql-select), [SELECT INTO](/docs/postgresql/sql-selectinto), [VALUES](/docs/postgresql/sql-values)
