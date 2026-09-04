---
title: "ALTER EXTENSION (extension တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Install လုပ်ထားပြီးသား extension တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း — version အသစ်သို့ update (UPDATE)၊ schema ရွှေ့ပြောင်း (SET SCHEMA)၊ member object များ ပေါင်းထည့်ခြင်း/ဖယ်ရှားခြင်း (ADD/DROP member_object) စသည့် subforms များ — extension ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သော command"
order: 251
source: "https://www.postgresql.org/docs/current/sql-alterextension.html"
status: translated
updated: 2026-09-04
---

## ALTER EXTENSION (extension တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER EXTENSION — extension တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER EXTENSION name UPDATE [ TO new_version ]
ALTER EXTENSION name SET SCHEMA new_schema
ALTER EXTENSION name ADD member_object
ALTER EXTENSION name DROP member_object

where member_object is:

  ACCESS METHOD object_name |
  AGGREGATE aggregate_name ( aggregate_signature ) |
  CAST (source_type AS target_type) |
  COLLATION object_name |
  CONVERSION object_name |
  DOMAIN object_name |
  EVENT TRIGGER object_name |
  FOREIGN DATA WRAPPER object_name |
  FOREIGN TABLE object_name |
  FUNCTION function_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  MATERIALIZED VIEW object_name |
  OPERATOR operator_name (left_type, right_type) |
  OPERATOR CLASS object_name USING index_method |
  OPERATOR FAMILY object_name USING index_method |
  [ PROCEDURAL ] LANGUAGE object_name |
  PROCEDURE procedure_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  ROUTINE routine_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  SCHEMA object_name |
  SEQUENCE object_name |
  SERVER object_name |
  TABLE object_name |
  TEXT SEARCH CONFIGURATION object_name |
  TEXT SEARCH DICTIONARY object_name |
  TEXT SEARCH PARSER object_name |
  TEXT SEARCH TEMPLATE object_name |
  TRANSFORM FOR type_name LANGUAGE lang_name |
  TYPE object_name |
  VIEW object_name

and aggregate_signature is:

* |
[ argmode ] [ argname ] argtype [ , ... ] |
[ [ argmode ] [ argname ] argtype [ , ... ] ] ORDER BY [ argmode ] [ argname ] argtype [ , ... ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER EXTENSION` က install လုပ်ထားပြီးသား extension တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။ Subforms အများအပြား ရှိပါတယ်:

- **UPDATE** — ဒီ form က extension ကို version အသစ်တစ်ခုဆီ update လုပ်ပေးပါတယ်။ လောလောဆယ် install လုပ်ထားတဲ့ version ကို လိုချင်တဲ့ version အဖြစ် ပြုပြင်ပေးနိုင်တဲ့ — သင့်လျော်တဲ့ update script (သို့မဟုတ် script အစီအရီ) တစ်ခုကို extension က ထောက်ပံ့ပေးရပါမယ်။
- **SET SCHEMA** — ဒီ form က extension ရဲ့ objects တွေကို တခြား schema တစ်ခုဆီ ရွှေ့ပြောင်းပေးပါတယ်။ ဒီ command အောင်မြင်ဖို့အတွက် — extension က relocatable (နေရာရွှေ့ပြောင်းနိုင်သော) ဖြစ်ရပါမယ်။
- **ADD member_object** — ဒီ form က ရှိပြီးသား object တစ်ခုကို extension ထဲသို့ ပေါင်းထည့်ပေးပါတယ်။ ဒါက extension update scripts တွေမှာ အဓိက အသုံးဝင်ပါတယ်။ နောက်ပိုင်းမှာ object ကို extension ရဲ့ member တစ်ခုအနေနဲ့ သဘောထားပါလိမ့်မယ်; အထူးသဖြင့် — ၎င်းကို extension ကို drop လုပ်ခြင်းဖြင့်သာ drop လုပ်လို့ ရပါတော့မယ်။
- **DROP member_object** — ဒီ form က member object တစ်ခုကို extension ကနေ ဖယ်ရှားပေးပါတယ်။ ဒါက extension update scripts တွေမှာ အဓိက အသုံးဝင်ပါတယ်။ Object ကို drop လုပ်တာ မဟုတ်ဘဲ — extension နဲ့ ဆက်စပ်မှု ပြတ်တောက်စေရုံသာ ဖြစ်ပါတယ်။

ဒီ operations တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 36.17](https://www.postgresql.org/docs/current/extend-extensions.html) ကို ကြည့်ပါ။

`ALTER EXTENSION` ကို သုံးဖို့ — extension ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ `ADD`/`DROP` forms တွေမှာ — ပေါင်းထည့်တဲ့/ဖယ်ရှားတဲ့ object ရဲ့ ပိုင်ဆိုင်မှုလည်း လိုအပ်ပါတယ်။

## Parameters (parameter များ)

- **name** — Install လုပ်ထားတဲ့ extension တစ်ခုရဲ့ နာမည်။
- **new_version** — Extension ရဲ့ လိုချင်တဲ့ version အသစ်။ ဒါကို identifier တစ်ခု ဒါမှမဟုတ် string literal တစ်ခုအနေနဲ့ ရေးနိုင်ပါတယ်။ သတ်မှတ်မထားဘူးဆိုရင် — ALTER EXTENSION UPDATE က extension ရဲ့ control file ထဲမှာ default version အဖြစ် ပြသထားတဲ့ version ဆီ update လုပ်ဖို့ ကြိုးစားပါတယ်။
- **new_schema** — Extension အတွက် schema အသစ်။
- **object_name** / **aggregate_name** / **function_name** / **operator_name** / **procedure_name** / **routine_name** — Extension ထဲသို့ ပေါင်းထည့်ရမယ့် သို့မဟုတ် extension ကနေ ဖယ်ရှားရမယ့် object တစ်ခုရဲ့ နာမည်။ Tables, aggregates, domains, foreign tables, functions, operators, operator classes, operator families, procedures, routines, sequences, text search objects, types နဲ့ views တွေရဲ့ နာမည်တွေကို schema-qualified လုပ်နိုင်ပါတယ်။
- **source_type** — Cast ရဲ့ source data type ရဲ့ နာမည်။
- **target_type** — Cast ရဲ့ target data type ရဲ့ နာမည်။
- **argmode** — Function, procedure သို့မဟုတ် aggregate argument တစ်ခုရဲ့ mode — IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ရင် default က IN ဖြစ်ပါတယ်။ ALTER EXTENSION က OUT arguments တွေကို တကယ်တော့ ဂရုမစိုက်ကြောင်း သတိပြုပါ — function ရဲ့ ဝိသေသလက္ခဏာ (identity) ကို ဆုံးဖြတ်ဖို့ input arguments တွေသာ လိုအပ်လို့ပါ။ ဒါကြောင့် IN, INOUT နဲ့ VARIADIC arguments တွေကိုသာ စာရင်းပြုစုရင် လုံလောက်ပါတယ်။
- **argname** — Function, procedure သို့မဟုတ် aggregate argument တစ်ခုရဲ့ နာမည်။ ALTER EXTENSION က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ကြောင်း သတိပြုပါ — function ရဲ့ identity ကို ဆုံးဖြတ်ဖို့ argument data types တွေသာ လိုအပ်လို့ပါ။
- **argtype** — Function, procedure သို့မဟုတ် aggregate argument တစ်ခုရဲ့ data type။
- **left_type** / **right_type** — Operator ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်နိုင်သည်)။ Prefix operator တစ်ခုရဲ့ ပျောက်ဆုံးနေတဲ့ argument အတွက် NONE လို့ ရေးပါ။
- **PROCEDURAL** — ဒါက noise word (အဓိပ္ပာယ် မဆောင်သော စကားလုံး) တစ်ခု ဖြစ်ပါတယ်။
- **type_name** — Transform ရဲ့ data type ရဲ့ နာမည်။
- **lang_name** — Transform ရဲ့ language ရဲ့ နာမည်။

## Examples (ဥပမာများ)

`hstore` extension ကို version 2.0 ဆီ update လုပ်ဖို့:

```sql
ALTER EXTENSION hstore UPDATE TO '2.0';
```

`hstore` extension ရဲ့ schema ကို `utils` အဖြစ် ပြောင်းလဲဖို့:

```sql
ALTER EXTENSION hstore SET SCHEMA utils;
```

ရှိပြီးသား function တစ်ခုကို `hstore` extension ထဲသို့ ပေါင်းထည့်ဖို့:

```sql
ALTER EXTENSION hstore ADD FUNCTION populate_record(anyelement, hstore);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER EXTENSION` က PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html), [DROP EXTENSION](/docs/postgresql/sql-dropextension)
