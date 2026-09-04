---
title: "COMMENT (object တစ်ခုရဲ့ comment ကို သတ်မှတ်ခြင်း သို့မဟုတ် ပြောင်းလဲခြင်း)"
description: "Database object တစ်ခုရဲ့ comment ကို သိမ်းဆည်းခြင်း/အစားထိုးခြင်း/ဖယ်ရှားခြင်း — object အမျိုးအစားအားလုံးအတွက် COMMENT ON syntax နှင့် parameter အသေးစိတ်များ"
order: 151
source: "https://www.postgresql.org/docs/current/sql-comment.html"
status: translated
updated: 2026-09-04
---

## COMMENT (object တစ်ခုရဲ့ comment ကို သတ်မှတ်ခြင်း သို့မဟုတ် ပြောင်းလဲခြင်း)

COMMENT — database object တစ်ခုရဲ့ comment ကို သတ်မှတ်ခြင်း သို့မဟုတ် ပြောင်းလဲခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
COMMENT ON
{
  ACCESS METHOD object_name |
  AGGREGATE aggregate_name ( aggregate_signature ) |
  CAST (source_type AS target_type) |
  COLLATION object_name |
  COLUMN relation_name.column_name |
  CONSTRAINT constraint_name ON table_name |
  CONSTRAINT constraint_name ON DOMAIN domain_name |
  CONVERSION object_name |
  DATABASE object_name |
  DOMAIN object_name |
  EXTENSION object_name |
  EVENT TRIGGER object_name |
  FOREIGN DATA WRAPPER object_name |
  FOREIGN TABLE object_name |
  FUNCTION function_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  INDEX object_name |
  LARGE OBJECT large_object_oid |
  MATERIALIZED VIEW object_name |
  OPERATOR operator_name (left_type, right_type) |
  OPERATOR CLASS object_name USING index_method |
  OPERATOR FAMILY object_name USING index_method |
  POLICY policy_name ON table_name |
  [ PROCEDURAL ] LANGUAGE object_name |
  PROCEDURE procedure_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  PUBLICATION object_name |
  ROLE object_name |
  ROUTINE routine_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  RULE rule_name ON table_name |
  SCHEMA object_name |
  SEQUENCE object_name |
  SERVER object_name |
  STATISTICS object_name |
  SUBSCRIPTION object_name |
  TABLE object_name |
  TABLESPACE object_name |
  TEXT SEARCH CONFIGURATION object_name |
  TEXT SEARCH DICTIONARY object_name |
  TEXT SEARCH PARSER object_name |
  TEXT SEARCH TEMPLATE object_name |
  TRANSFORM FOR type_name LANGUAGE lang_name |
  TRIGGER trigger_name ON table_name |
  TYPE object_name |
  VIEW object_name
} IS { string_literal | NULL }

where aggregate_signature is:

* |
[ argmode ] [ argname ] argtype [ , ... ] |
[ [ argmode ] [ argname ] argtype [ , ... ] ] ORDER BY [ argmode ] [ argname ] argtype [ , ... ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`COMMENT` က database object တစ်ခုရဲ့ comment ကို သိမ်းဆည်းခြင်း၊ အစားထိုးခြင်း ဒါမှမဟုတ် ဖယ်ရှားခြင်း လုပ်ပေးပါတယ်။

Object တစ်ခုချင်းစီအတွက် comment string တစ်ခုတည်းကိုပဲ သိမ်းဆည်းပါတယ်။ Object တစ်ခုတည်းအတွက်ပဲ `COMMENT` command အသစ်တစ်ခု ထုတ်ပေးရင် — ရှိပြီးသား comment ကို အစားထိုးပါတယ်။ `NULL` ဒါမှမဟုတ် empty string (`''`) တစ်ခုကို သတ်မှတ်ရင် — comment ကို ဖယ်ရှားပါတယ်။ Comment တွေက ၎င်းတို့ရဲ့ object ကို ဖယ်ရှားလိုက်တဲ့အခါ အလိုအလျောက် ဖယ်ရှားခံရပါတယ်။

Comment လုပ်ရမယ့် object ပေါ်မှာ `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။

Object အမျိုးအစား အများစုအတွက် — object ရဲ့ ပိုင်ရှင်ကပဲ comment သတ်မှတ်နိုင်ပါတယ်။ Role တွေမှာ ပိုင်ရှင် မရှိပါဘူး — ဒါကြောင့် `COMMENT ON ROLE` အတွက် စည်းမျဉ်းက — superuser role တစ်ခုကို comment လုပ်ဖို့ superuser ဖြစ်ရမယ်၊ ဒါမှမဟုတ် `CREATEROLE` privilege ရှိပြီး ပစ်မှတ် role ပေါ်မှာ `ADMIN OPTION` ပေးအပ်ခံထားရမယ် — ဆိုတာပါ။ အလားတူပဲ — access method တွေမှာလည်း ပိုင်ရှင် မရှိပါဘူး; access method တစ်ခုကို comment လုပ်ဖို့ superuser ဖြစ်ရပါမယ်။ superuser တစ်ယောက်ကတော့ ဘာကိုမဆို comment လုပ်နိုင်တာ သေချာပါတယ်။

Comment တွေကို psql ရဲ့ `\d` command မိသားစုတွေနဲ့ ကြည့်ရှုနိုင်ပါတယ်။ Comment တွေကို ပြန်ထုတ်ယူဖို့ တခြား user interface တွေကိုလည်း — psql က သုံးတဲ့ built-in functions တွေဖြစ်တဲ့ `obj_description`၊ `col_description` နဲ့ `shobj_description` တို့အပေါ် အခြေခံပြီး တည်ဆောက်နိုင်ပါတယ် ([ဇယား 9.82](/docs/postgresql/functions-info) ကို ကြည့်ပါ)။

## Parameters (parameter များ)

- **object_name**, **relation_name.column_name**, **aggregate_name**, **constraint_name**, **function_name**, **operator_name**, **policy_name**, **procedure_name**, **routine_name**, **rule_name**, **trigger_name** — comment လုပ်ရမယ့် object ရဲ့ နာမည် ဖြစ်ပါတယ်။ Schema တွေထဲမှာ နေထိုင်တဲ့ object တွေရဲ့ (table တွေ၊ function တွေ စသဖြင့်) နာမည်တွေကို schema-qualified (schema နာမည်နဲ့ ရှေ့ဆက် သတ်မှတ်ထားသော) လုပ်နိုင်ပါတယ်။ Column တစ်ခုကို comment လုပ်တဲ့အခါ — relation_name က table တစ်ခု၊ view တစ်ခု၊ composite type တစ်ခု ဒါမှမဟုတ် foreign table တစ်ခုကို ရည်ညွှန်းရပါမယ်။
- **table_name**, **domain_name** — Constraint တစ်ခု၊ trigger တစ်ခု၊ rule တစ်ခု ဒါမှမဟုတ် policy တစ်ခုကို comment ဖန်တီးတဲ့အခါ — ဒီ parameter တွေက အဲဒီ object ကို သတ်မှတ်ထားတဲ့ table ဒါမှမဟုတ် domain ရဲ့ နာမည်ကို သတ်မှတ်ပေးပါတယ်။
- **source_type** — Cast ရဲ့ source data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **target_type** — Cast ရဲ့ target data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **argmode** — Function တစ်ခု၊ procedure တစ်ခု ဒါမှမဟုတ် aggregate တစ်ခုရဲ့ argument တစ်ခုရဲ့ mode ဖြစ်ပါတယ်: IN, OUT, INOUT ဒါမှမဟုတ် VARIADIC။ ချန်လိုက်ရင် — မူရင်း default က IN ပါ။ COMMENT က OUT arguments တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ မည်သူမည်ဝါ ဖြစ်ကြောင်း (identity) ကို ဆုံးဖြတ်ဖို့ input arguments တွေပဲ လိုအပ်လို့ပါ။ ဒါကြောင့် IN, INOUT နဲ့ VARIADIC arguments တွေကိုပဲ စာရင်းပြုစုရင် လုံလောက်ပါတယ်။
- **argname** — Function တစ်ခု၊ procedure တစ်ခု ဒါမှမဟုတ် aggregate တစ်ခုရဲ့ argument တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ COMMENT က argument နာမည်တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ မည်သူမည်ဝါ ဖြစ်ကြောင်း ဆုံးဖြတ်ဖို့ argument ရဲ့ data type တွေပဲ လိုအပ်လို့ပါ။
- **argtype** — Function တစ်ခု၊ procedure တစ်ခု ဒါမှမဟုတ် aggregate တစ်ခုရဲ့ argument တစ်ခုရဲ့ data type ဖြစ်ပါတယ်။
- **large_object_oid** — Large object ရဲ့ OID ဖြစ်ပါတယ်။
- **left_type**, **right_type** — Operator ရဲ့ arguments တွေရဲ့ data type(s) တွေ ဖြစ်ပါတယ် (schema-qualified လုပ်ထားလည်း ရပါတယ်)။ Prefix operator တစ်ခုရဲ့ ပျောက်နေတဲ့ argument အတွက် NONE လို့ ရေးပါ။
- **PROCEDURAL** — ဒါက noise word (အဓိပ္ပာယ် မရှိဘဲ သဒ္ဒါအရ ထည့်ထားတဲ့ စကားလုံး) တစ်ခုပါ။
- **type_name** — Transform ရဲ့ data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **lang_name** — Transform ရဲ့ language ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **string_literal** — Comment အသစ်ရဲ့ အကြောင်းအရာ ဖြစ်ပြီး — string literal တစ်ခုအနေနဲ့ ရေးပါတယ်။ Empty string ('') တစ်ခုက comment ကို ဖယ်ရှားပါတယ်။
- **NULL** — Comment ကို ဖယ်ရှားဖို့ NULL လို့ ရေးပါ။

## Notes (မှတ်စုများ)

လောလောဆယ် — comment တွေကို ကြည့်ရှုခြင်းအတွက် လုံခြုံရေး ယန္တရား (security mechanism) တစ်ခုမျှ မရှိပါဘူး: database တစ်ခုဆီ ချိတ်ဆက်ထားတဲ့ user ဘယ်သူမဆို — အဲဒီ database ထဲက object တွေရဲ့ comment တွေ အားလုံးကို မြင်နိုင်ပါတယ်။ Database တွေ၊ role တွေနဲ့ tablespace တွေလို shared object တွေအတွက်ကတော့ — comment တွေကို cluster တစ်ခုလုံးအတွက် ကမ္ဘာလုံးဆိုင်ရာ (globally) အနေနဲ့ သိမ်းဆည်းထားလို့ — cluster ထဲက database ဘယ်ခုကိုပဲ ချိတ်ဆက်ထားတဲ့ user ဖြစ်ဖြစ် shared object တွေရဲ့ comment တွေ အားလုံးကို မြင်နိုင်ပါတယ်။ ဒါကြောင့် — security နဲ့ ပတ်သက်ပြီး အရေးကြီးတဲ့ (security-critical) အချက်အလက်တွေကို comment တွေထဲမှာ မထည့်ပါနဲ့။

## Examples (ဥပမာများ)

`mytable` table ကို comment တစ်ခု တွဲပေးတာက:

```sql
COMMENT ON TABLE mytable IS 'This is my table.';
```

အဲဒါကို ပြန်ဖယ်ရှားတာက:

```sql
COMMENT ON TABLE mytable IS NULL;
```

နောက်ထပ် ဥပမာတချို့:

```sql
COMMENT ON ACCESS METHOD gin IS 'GIN index access method';
COMMENT ON AGGREGATE my_aggregate (double precision) IS 'Computes sample variance';
COMMENT ON CAST (text AS int4) IS 'Allow casts from text to int4';
COMMENT ON COLLATION "fr_CA" IS 'Canadian French';
COMMENT ON COLUMN my_table.my_column IS 'Employee ID number';
COMMENT ON CONVERSION my_conv IS 'Conversion to UTF8';
COMMENT ON CONSTRAINT bar_col_cons ON bar IS 'Constrains column col';
COMMENT ON CONSTRAINT dom_col_constr ON DOMAIN dom IS 'Constrains col of domain';
COMMENT ON DATABASE my_database IS 'Development Database';
COMMENT ON DOMAIN my_domain IS 'Email Address Domain';
COMMENT ON EVENT TRIGGER abort_ddl IS 'Aborts all DDL commands';
COMMENT ON EXTENSION hstore IS 'implements the hstore data type';
COMMENT ON FOREIGN DATA WRAPPER mywrapper IS 'my foreign data wrapper';
COMMENT ON FOREIGN TABLE my_foreign_table IS 'Employee Information in other database';
COMMENT ON FUNCTION my_function (timestamp) IS 'Returns Roman Numeral';
COMMENT ON INDEX my_index IS 'Enforces uniqueness on employee ID';
COMMENT ON LANGUAGE plpython IS 'Python support for stored procedures';
COMMENT ON LARGE OBJECT 346344 IS 'Planning document';
COMMENT ON MATERIALIZED VIEW my_matview IS 'Summary of order history';
COMMENT ON OPERATOR ^ (text, text) IS 'Performs intersection of two texts';
COMMENT ON OPERATOR - (NONE, integer) IS 'Unary minus';
COMMENT ON OPERATOR CLASS int4ops USING btree IS '4 byte integer operators for btrees';
COMMENT ON OPERATOR FAMILY integer_ops USING btree IS 'all integer operators for btrees';
COMMENT ON POLICY my_policy ON mytable IS 'Filter rows by users';
COMMENT ON PROCEDURE my_proc (integer, integer) IS 'Runs a report';
COMMENT ON PUBLICATION alltables IS 'Publishes all operations on all tables';
COMMENT ON ROLE my_role IS 'Administration group for finance tables';
COMMENT ON ROUTINE my_routine (integer, integer) IS 'Runs a routine (which is a function or procedure)';
COMMENT ON RULE my_rule ON my_table IS 'Logs updates of employee records';
COMMENT ON SCHEMA my_schema IS 'Departmental data';
COMMENT ON SEQUENCE my_sequence IS 'Used to generate primary keys';
COMMENT ON SERVER myserver IS 'my foreign server';
COMMENT ON STATISTICS my_statistics IS 'Improves planner row estimations';
COMMENT ON SUBSCRIPTION alltables IS 'Subscription for all operations on all tables';
COMMENT ON TABLE my_schema.my_table IS 'Employee Information';
COMMENT ON TABLESPACE my_tablespace IS 'Tablespace for indexes';
COMMENT ON TEXT SEARCH CONFIGURATION my_config IS 'Special word filtering';
COMMENT ON TEXT SEARCH DICTIONARY swedish IS 'Snowball stemmer for Swedish language';
COMMENT ON TEXT SEARCH PARSER my_parser IS 'Splits text into words';
COMMENT ON TEXT SEARCH TEMPLATE snowball IS 'Snowball stemmer';
COMMENT ON TRANSFORM FOR hstore LANGUAGE plpython3u IS 'Transform between hstore and Python dict';
COMMENT ON TRIGGER my_trigger ON my_table IS 'Used for RI';
COMMENT ON TYPE complex IS 'Complex number data type';
COMMENT ON VIEW my_view IS 'View of departmental costs';
COMMENT ON VIEW my_view IS NULL;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `COMMENT` command ဆိုတာ မရှိပါဘူး။
