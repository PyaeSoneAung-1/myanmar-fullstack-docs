---
title: "IMPORT FOREIGN SCHEMA (foreign server မှ table definitions များကို တင်သွင်းခြင်း)"
description: "Foreign server တစ်ခုပေါ်တွင် ရှိသော tables များကို ကိုယ်စားပြုသည့် foreign tables များ ဖန်တီးပေးသော command — LIMIT TO ဖြင့် subset ကိုသာ တင်သွင်းနိုင်ပြီး EXCEPT ဖြင့် သတ်မှတ်ထားသော tables များကို ချန်လှပ်နိုင်ကာ — OPTIONS clause ဖြင့် import options များ သတ်မှတ်နိုင်သော command"
order: 272
source: "https://www.postgresql.org/docs/current/sql-importforeignschema.html"
status: translated
updated: 2026-09-04
---

## IMPORT FOREIGN SCHEMA (foreign server မှ table definitions များကို တင်သွင်းခြင်း)

IMPORT FOREIGN SCHEMA — foreign server တစ်ခုကနေ table definitions တွေကို တင်သွင်း (import) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
IMPORT FOREIGN SCHEMA remote_schema
    [ { LIMIT TO | EXCEPT } ( table_name [, ...] ) ]
    FROM SERVER server_name
    INTO local_schema
    [ OPTIONS ( option 'value' [, ... ] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`IMPORT FOREIGN SCHEMA` က — foreign server တစ်ခုပေါ်မှာ ရှိပြီးသား tables တွေကို ကိုယ်စားပြုတဲ့ — foreign tables တွေကို ဖန်တီးပေးပါတယ်။ Foreign tables အသစ်တွေရဲ့ owner က command ကို ထုတ်ပေးလိုက်တဲ့ user ဖြစ်ပြီး — remote tables တွေနဲ့ ကိုက်ညီဖို့ — မှန်ကန်တဲ့ column definitions တွေနဲ့ options တွေနဲ့အတူ ဖန်တီးပါတယ်။

Default အနေနဲ့ — foreign server ပေါ်က schema တစ်ခုမှာ ရှိတဲ့ tables နဲ့ views တွေ အားလုံးကို တင်သွင်းပါတယ်။ Optional အနေနဲ့ — tables တွေရဲ့ စာရင်းကို သတ်မှတ်ထားတဲ့ subset တစ်ခုအထိ ကန့်သတ်နိုင်သလို — သီးခြား tables တွေကိုလည်း ချန်လှပ်ထားနိုင်ပါတယ်။ Foreign tables အသစ်တွေ အားလုံးကို — ရှိပြီးသား ဖြစ်ရမယ့် — target schema ထဲမှာ ဖန်တီးပါတယ်။

`IMPORT FOREIGN SCHEMA` ကို သုံးဖို့ဆိုရင် — user က foreign server ပေါ်မှာ `USAGE` privilege ရော — target schema ပေါ်မှာ `CREATE` privilege ပါ ရှိရပါမယ်။

## Parameters (parameter များ)

- **remote_schema** — ကနေ တင်သွင်းရမယ့် remote schema။ Remote schema တစ်ခုရဲ့ အတိအကျ အဓိပ္ပာယ်က သုံးနေတဲ့ foreign data wrapper အပေါ်မှာ မူတည်ပါတယ်။
- **LIMIT TO ( table_name [, ...] )** — ပေးထားတဲ့ table names တွေထဲက တစ်ခုနဲ့ ကိုက်ညီတဲ့ foreign tables တွေကိုပဲ တင်သွင်းပါတယ်။ Foreign schema ထဲမှာ ရှိတဲ့ တခြား tables တွေကိုတော့ လျစ်လျူရှုပါလိမ့်မယ်။
- **EXCEPT ( table_name [, ...] )** — သတ်မှတ်ထားတဲ့ foreign tables တွေကို တင်သွင်းမှုကနေ ချန်လှပ်ပါတယ်။ Foreign schema ထဲမှာ ရှိတဲ့ tables တွေ အားလုံးကို — ဒီမှာ စာရင်းပြုထားတဲ့ဟာတွေ ကလွဲလို့ — တင်သွင်းပါလိမ့်မယ်။
- **server_name** — ကနေ တင်သွင်းရမယ့် foreign server။
- **local_schema** — တင်သွင်းလာတဲ့ foreign tables တွေကို ဖန်တီးမယ့် schema။
- **OPTIONS ( option 'value' [, ...] )** — တင်သွင်းစဉ်အတွင်း သုံးရမယ့် options တွေ။ ခွင့်ပြုထားတဲ့ option names နဲ့ values တွေက foreign data wrapper တစ်ခုချင်းစီနဲ့ သက်ဆိုင်ပါတယ်။

## Examples (ဥပမာများ)

`film_server` server ပေါ်က `foreign_films` ဆိုတဲ့ remote schema ကနေ — local schema `films` ထဲမှာ foreign tables တွေ ဖန်တီးပြီး — table definitions တွေကို တင်သွင်းဖို့:

```sql
IMPORT FOREIGN SCHEMA foreign_films
    FROM SERVER film_server INTO films;
```

အပေါ်အတိုင်းပဲ — ဒါပေမယ့် — tables နှစ်ခု ဖြစ်တဲ့ `actors` နဲ့ `directors` ကိုပဲ (ရှိခဲ့ရင်) တင်သွင်းဖို့:

```sql
IMPORT FOREIGN SCHEMA foreign_films LIMIT TO (actors, directors)
    FROM SERVER film_server INTO films;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`IMPORT FOREIGN SCHEMA` command က SQL standard နဲ့ ကိုက်ညီပါတယ် — ခြွင်းချက်ကတော့ `OPTIONS` clause က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-createforeigntable.html), [CREATE SERVER](/docs/postgresql/sql-createserver)
