---
title: "SELECT INTO (query ၏ ရလဒ်များမှ table အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Query တစ်ခု၏ ရလဒ်များဖြင့် table အသစ်တစ်ခုကို ဖန်တီး ဖြည့်သွင်းပေးသော command — TEMPORARY/TEMP, UNLOGGED option များနှင့် new_table parameter အကြောင်း၊ CREATE TABLE AS နှင့် နှိုင်းယှဉ်ချက်၊ ECPG/PL/pgSQL တွင် SELECT INTO ၏ အသုံးပြုပုံ လိုက်ဖက်ညီမှု ဆွေးနွေးချက်"
order: 216
source: "https://www.postgresql.org/docs/current/sql-selectinto.html"
status: translated
updated: 2026-09-04
---

## SELECT INTO (query ၏ ရလဒ်များမှ table အသစ်တစ်ခု ဖန်တီးခြင်း)

SELECT INTO — query တစ်ခုရဲ့ ရလဒ်တွေကနေ table အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
[ WITH [ RECURSIVE ] with_query [, ...] ]
SELECT [ ALL | DISTINCT [ ON ( expression [, ...] ) ] ]
    [ { * | expression [ [ AS ] output_name ] } [, ...] ]
    INTO [ TEMPORARY | TEMP | UNLOGGED ] [ TABLE ] new_table
    [ FROM from_item [, ...] ]
    [ WHERE condition ]
    [ GROUP BY expression [, ...] ]
    [ HAVING condition ]
    [ WINDOW window_name AS ( window_definition ) [, ...] ]
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] select ]
    [ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
    [ LIMIT { count | ALL } ]
    [ OFFSET start [ ROW | ROWS ] ]
    [ FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } ONLY ]
    [ FOR { UPDATE | SHARE } [ OF table_name [, ...] ] [ NOWAIT ] [...] ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SELECT INTO` က table အသစ်တစ်ခုကို ဖန်တီးပြီး — query တစ်ခုက တွက်ချက်ပေးတဲ့ data တွေနဲ့ ဖြည့်သွင်းပေးပါတယ်။ သာမန် `SELECT` တစ်ခုမှာ ဖြစ်သလို — data ကို client ဆီ ပြန်ပို့ပေးတာ မဟုတ်ပါဘူး။ Table အသစ်ရဲ့ columns တွေမှာ — `SELECT` ရဲ့ output columns တွေနဲ့ ဆက်စပ်နေတဲ့ နာမည်တွေနဲ့ data types တွေ ရှိပါတယ်။

## Parameters (parameter များ)

- **TEMPORARY or TEMP** — သတ်မှတ်ထားရင် — table ကို temporary table (ယာယီ table) တစ်ခုအနေနဲ့ ဖန်တီးပါတယ်။ အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။
- **UNLOGGED** — သတ်မှတ်ထားရင် — table ကို unlogged table (write-ahead log မှတ်တမ်းမသွင်းတဲ့ table) တစ်ခုအနေနဲ့ ဖန်တီးပါတယ်။ အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။
- **new_table** — ဖန်တီးရမယ့် table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။

ကျန် parameters တွေ အားလုံးကို [SELECT](/docs/postgresql/sql-select) အောက်မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

## Notes (မှတ်စုများ)

[`CREATE TABLE AS`](/docs/postgresql/sql-createtableas) က `SELECT INTO` နဲ့ လုပ်ဆောင်ချက်အရ ဆင်တူပါတယ်။ `CREATE TABLE AS` က အကြံပြုထားတဲ့ syntax ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ — `SELECT INTO` ရဲ့ ဒီပုံစံက ECPG ဒါမှမဟုတ် PL/pgSQL မှာ မရနိုင်လို့ပါ — သူတို့က `INTO` clause ကို ကွဲပြားတဲ့ အဓိပ္ပါယ်နဲ့ အနက်ဖွင့်လို့ပါ။ ထို့ပြင် — `CREATE TABLE AS` က `SELECT INTO` ပေးတဲ့ လုပ်ဆောင်ချက်တွေရဲ့ superset (ပိုကျယ်ပြန့်တဲ့ အစုအဝေး) တစ်ခုကို ပေးပါတယ်။

`CREATE TABLE AS` နဲ့ ဆန့်ကျင်ဘက်အနေနဲ့ — `SELECT INTO` က — table တစ်ခုရဲ့ access method လိုမျိုး properties တွေကို [`USING method`](/docs/postgresql/sql-createtable) နဲ့ ဖြစ်စေ၊ table ရဲ့ tablespace ကို [`TABLESPACE tablespace_name`](/docs/postgresql/sql-createtable) နဲ့ ဖြစ်စေ — သတ်မှတ်ခွင့် မပြုပါဘူး။ လိုအပ်ရင် `CREATE TABLE AS` ကို သုံးပါ။ ဒါကြောင့် — table အသစ်အတွက် default table access method ကို ရွေးချယ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [default_table_access_method](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TABLE-ACCESS-METHOD) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`films` table ထဲက မကြာသေးတဲ့ (recent) entries တွေပဲ ပါဝင်တဲ့ `films_recent` table အသစ်တစ်ခုကို ဖန်တီးခြင်း:

```sql
SELECT * INTO films_recent FROM films WHERE date_prod >= '2002-01-01';
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က `SELECT INTO` ကို — table အသစ်တစ်ခု ဖန်တီးဖို့ မဟုတ်ဘဲ — host program တစ်ခုရဲ့ scalar variables တွေထဲကို values တွေ ရွေးချယ် ထည့်သွင်းခြင်းကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ ဒါဟာ တကယ်တော့ ECPG ([အခန်း 34](https://www.postgresql.org/docs/current/ecpg.html) ကို ကြည့်ပါ) နဲ့ PL/pgSQL ([အခန်း 41](https://www.postgresql.org/docs/current/plpgsql.html) ကို ကြည့်ပါ) တို့မှာ တွေ့ရတဲ့ အသုံးပြုမှုပဲ ဖြစ်ပါတယ်။ Table ဖန်တီးမှုကို ကိုယ်စားပြုဖို့ `SELECT INTO` ကို PostgreSQL က သုံးတာကတော့ သမိုင်းကြောင်းဆိုင်ရာ ဖြစ်ပါတယ်။ တခြား SQL implementations တချို့ကလည်း `SELECT INTO` ကို ဒီနည်းနဲ့ပဲ သုံးကြပါတယ် (ဒါပေမယ့် SQL implementations အများစုကတော့ `CREATE TABLE AS` ကိုပဲ ထောက်ပံ့ကြပါတယ်)။ ဒီလို compatibility ထည့်သွင်း စဉ်းစားမှုတွေ ကလွဲရင် — code အသစ်တွေမှာ ဒီရည်ရွယ်ချက်အတွက် `CREATE TABLE AS` ကို သုံးတာ အကောင်းဆုံး ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TABLE AS](/docs/postgresql/sql-createtableas)
