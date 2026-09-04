---
title: "CREATE TABLE (table အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Table အသစ်တစ်ခုကို ဖန်တီးပေးသော command — column definitions များ၊ constraints (NOT NULL, CHECK, DEFAULT, UNIQUE, PRIMARY KEY, EXCLUDE, REFERENCES) များ၊ typed tables (OF)၊ INHERITS၊ partitioning (PARTITION BY / PARTITION OF)၊ LIKE clause၊ storage parameters များ၊ temporary/unlogged tables များနှင့် SQL standard လိုက်ဖက်ညီမှုအကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 212
source: "https://www.postgresql.org/docs/current/sql-createtable.html"
status: translated
updated: 2026-09-04
---

## CREATE TABLE (table အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE TABLE — table အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ [ GLOBAL | LOCAL ] { TEMPORARY | TEMP } | UNLOGGED ] TABLE [ IF NOT EXISTS ] table_name ( [
  { column_name data_type [ STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN | DEFAULT } ] [ COMPRESSION compression_method ] [ COLLATE collation ] [ column_constraint [ ... ] ]
    | table_constraint
    | LIKE source_table [ like_option ... ] }
    [, ... ]
] )
[ INHERITS ( parent_table [, ... ] ) ]
[ PARTITION BY { RANGE | LIST | HASH } ( { column_name | ( expression ) } [ COLLATE collation ] [ opclass ] [, ... ] ) ]
[ USING method ]
[ WITH ( storage_parameter [= value] [, ... ] ) | WITHOUT OIDS ]
[ ON COMMIT { PRESERVE ROWS | DELETE ROWS | DROP } ]
[ TABLESPACE tablespace_name ]

CREATE [ [ GLOBAL | LOCAL ] { TEMPORARY | TEMP } | UNLOGGED ] TABLE [ IF NOT EXISTS ] table_name
    OF type_name [ (
  { column_name [ WITH OPTIONS ] [ column_constraint [ ... ] ]
    | table_constraint }
    [, ... ]
) ]
[ PARTITION BY { RANGE | LIST | HASH } ( { column_name | ( expression ) } [ COLLATE collation ] [ opclass ] [, ... ] ) ]
[ USING method ]
[ WITH ( storage_parameter [= value] [, ... ] ) | WITHOUT OIDS ]
[ ON COMMIT { PRESERVE ROWS | DELETE ROWS | DROP } ]
[ TABLESPACE tablespace_name ]

CREATE [ [ GLOBAL | LOCAL ] { TEMPORARY | TEMP } | UNLOGGED ] TABLE [ IF NOT EXISTS ] table_name
    PARTITION OF parent_table [ (
  { column_name [ WITH OPTIONS ] [ column_constraint [ ... ] ]
    | table_constraint }
    [, ... ]
) ] { FOR VALUES partition_bound_spec | DEFAULT }
[ PARTITION BY { RANGE | LIST | HASH } ( { column_name | ( expression ) } [ COLLATE collation ] [ opclass ] [, ... ] ) ]
[ USING method ]
[ WITH ( storage_parameter [= value] [, ... ] ) | WITHOUT OIDS ]
[ ON COMMIT { PRESERVE ROWS | DELETE ROWS | DROP } ]
[ TABLESPACE tablespace_name ]

where column_constraint is:

[ CONSTRAINT constraint_name ]
{ NOT NULL [ NO INHERIT ]  |
  NULL |
  CHECK ( expression ) [ NO INHERIT ] |
  DEFAULT default_expr |
  GENERATED ALWAYS AS ( generation_expr ) [ STORED | VIRTUAL ] |
  GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [ ( sequence_options ) ] |
  UNIQUE [ NULLS [ NOT ] DISTINCT ] index_parameters |
  PRIMARY KEY index_parameters |
  REFERENCES reftable [ ( refcolumn ) ] [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ]
    [ ON DELETE referential_action ] [ ON UPDATE referential_action ] }
[ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ] [ ENFORCED | NOT ENFORCED ]

and table_constraint is:

[ CONSTRAINT constraint_name ]
{ CHECK ( expression ) [ NO INHERIT ] |
  NOT NULL column_name [ NO INHERIT ] |
  UNIQUE [ NULLS [ NOT ] DISTINCT ] ( column_name [, ... ] [, column_name WITHOUT OVERLAPS ] ) index_parameters |
  PRIMARY KEY ( column_name [, ... ] [, column_name WITHOUT OVERLAPS ] ) index_parameters |
  EXCLUDE [ USING index_method ] ( exclude_element WITH operator [, ... ] ) index_parameters [ WHERE ( predicate ) ] |
  FOREIGN KEY ( column_name [, ... ] [, PERIOD column_name ] ) REFERENCES reftable [ ( refcolumn [, ... ] [, PERIOD refcolumn ] ) ]
    [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ] [ ON DELETE referential_action ] [ ON UPDATE referential_action ] }
[ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ] [ ENFORCED | NOT ENFORCED ]

and like_option is:

{ INCLUDING | EXCLUDING } { COMMENTS | COMPRESSION | CONSTRAINTS | DEFAULTS | GENERATED | IDENTITY | INDEXES | STATISTICS | STORAGE | ALL }

and partition_bound_spec is:

IN ( partition_bound_expr [, ...] ) |
FROM ( { partition_bound_expr | MINVALUE | MAXVALUE } [, ...] )
  TO ( { partition_bound_expr | MINVALUE | MAXVALUE } [, ...] ) |
WITH ( MODULUS numeric_literal, REMAINDER numeric_literal )

index_parameters in UNIQUE, PRIMARY KEY, and EXCLUDE constraints are:

[ INCLUDE ( column_name [, ... ] ) ]
[ WITH ( storage_parameter [= value] [, ... ] ) ]
[ USING INDEX TABLESPACE tablespace_name ]

exclude_element in an EXCLUDE constraint is:

{ column_name | ( expression ) } [ COLLATE collation ] [ opclass [ ( opclass_parameter = value [, ... ] ) ] ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ]

referential_action in a FOREIGN KEY/REFERENCES constraint is:

{ NO ACTION | RESTRICT | CASCADE | SET NULL [ ( column_name [, ... ] ) ] | SET DEFAULT [ ( column_name [, ... ] ) ] }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TABLE` က current database ထဲမှာ ကနဦး အလွတ် (empty) ဖြစ်တဲ့ table အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ အဲဒီ table ကို — command ကို ထုတ်ပေးလိုက်တဲ့ — user က ပိုင်ဆိုင်ပါတယ်။

Schema နာမည် ပေးထားရင် (ဥပမာ — `CREATE TABLE myschema.mytable ...`) — table ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — current schema ထဲမှာ ဖန်တီးပါတယ်။ Temporary tables တွေက အထူး schema တစ်ခုမှာ တည်ရှိတာမို့ — temporary table တစ်ခု ဖန်တီးတဲ့အခါ schema နာမည် ပေးလို့ မရပါဘူး။ Table ရဲ့ နာမည်က — တူညီတဲ့ schema ထဲမှာ ရှိတဲ့ တခြား relation (table, sequence, index, view, materialized view သို့မဟုတ် foreign table) တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။

`CREATE TABLE` က — table ရဲ့ row တစ်ခုနဲ့ ကိုက်ညီတဲ့ composite type ကို ကိုယ်စားပြုတဲ့ data type တစ်ခုကိုလည်း အလိုအလျောက် ဖန်တီးပေးပါတယ်။ ဒါကြောင့် — tables တွေက — တူညီတဲ့ schema ထဲမှာ ရှိပြီးသား data type တစ်ခုခုနဲ့ နာမည် တူလို့ မရပါဘူး။

Optional ဖြစ်တဲ့ constraint clauses တွေက — insert သို့မဟုတ် update operation တစ်ခု အောင်မြင်ဖို့အတွက် — အသစ် ထည့်သွင်းတဲ့ သို့မဟုတ် update လုပ်လိုက်တဲ့ rows တွေ ကျေနပ်စေရမယ့် — constraints (ကန့်သတ်ချက်များ — စစ်ဆေးချက်များ) တွေကို သတ်မှတ်ပေးပါတယ်။ Constraint ဆိုတာ — table ထဲမှာ ရှိနိုင်တဲ့ တန်ဖိုးအစုတွေကို နည်းလမ်း အမျိုးမျိုးနဲ့ သတ်မှတ်ပေးဖို့ ကူညီတဲ့ SQL object တစ်ခု ဖြစ်ပါတယ်။

Constraints တွေကို သတ်မှတ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်: table constraints နဲ့ column constraints။ Column constraint တစ်ခုကို column definition ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ သတ်မှတ်ပါတယ်။ Table constraint definition တစ်ခုက column တစ်ခုနဲ့ ချည်နှောင်ထားတာ မဟုတ်ဘဲ — column တစ်ခုထက်ပိုကို လွှမ်းခြုံနိုင်ပါတယ်။ Column constraint တိုင်းကို table constraint အနေနဲ့လည်း ရေးလို့ ရပါတယ်; column constraint ဆိုတာက — constraint က column တစ်ခုကိုပဲ သက်ရောက်တဲ့အခါ သုံးဖို့ — notational convenience (ရေးသားရာတွင် အဆင်ပြေစေမှု) တစ်ခုသာ ဖြစ်ပါတယ်။

Table တစ်ခု ဖန်တီးနိုင်ဖို့ — column types တွေ အားလုံးပေါ်မှာ ဒါမှမဟုတ် — `OF` clause ထဲက type ပေါ်မှာ — `USAGE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **TEMPORARY or TEMP** — သတ်မှတ်ထားရင် — table ကို temporary table အဖြစ် ဖန်တီးပါတယ်။ Temporary tables တွေကို — session တစ်ခုရဲ့ အဆုံးမှာ ဖြစ်စေ — ရွေးချယ်ထားရင် — လက်ရှိ transaction ရဲ့ အဆုံးမှာ ဖြစ်စေ — အလိုအလျောက် drop လုပ်ပါတယ် (အောက်က ON COMMIT ကို ကြည့်ပါ)။ Default `search_path` ထဲမှာ temporary schema ကို ပထမဆုံး ထည့်သွင်းထားတာမို့ — temporary table တည်ရှိနေသရွေ့ — နာမည် တူညီနေတဲ့ ရှိပြီးသား permanent tables တွေကို — schema-qualified နာမည်တွေနဲ့ ရည်ညွှန်းထားခြင်း မရှိဘူးဆိုရင် — query plans အသစ်တွေအတွက် ရွေးချယ်ခံရမှာ မဟုတ်ပါဘူး။ Temporary table တစ်ခုပေါ်မှာ ဖန်တီးတဲ့ indexes တွေ အားလုံးကလည်း အလိုအလျောက် temporary တွေ ဖြစ်ပါတယ်။

  Autovacuum daemon က temporary tables တွေကို ဝင်ရောက်လို့ မရတာမို့ — သူတို့ကို vacuum ဒါမှမဟုတ် analyze လုပ်လို့လည်း မရပါဘူး။ ဒါကြောင့် — သင့်လျော်တဲ့ vacuum နဲ့ analyze operations တွေကို session SQL commands တွေကနေတစ်ဆင့် လုပ်ဆောင်သင့်ပါတယ်။ ဥပမာ — temporary table တစ်ခုကို ရှုပ်ထွေးတဲ့ queries တွေမှာ သုံးမယ်ဆိုရင် — table ကို data တွေ ဖြည့်ပြီးတာနဲ့ — အဲဒီ table ပေါ်မှာ `ANALYZE` run လုပ်တာက ပညာရှိရာရောက်ပါတယ်။

  Optional အနေနဲ့ — `TEMPORARY` ဒါမှမဟုတ် `TEMP` ရဲ့ ရှေ့မှာ `GLOBAL` ဒါမှမဟုတ် `LOCAL` ကိုလည်း ရေးနိုင်ပါတယ်။ ဒါက လောလောဆယ် PostgreSQL မှာ ဘာ ကွာခြားမှုမှ မဖြစ်စေဘဲ — deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) လည်း ဖြစ်ပါတယ်; အောက်က Compatibility ကို ကြည့်ပါ။

- **UNLOGGED** — သတ်မှတ်ထားရင် — table ကို unlogged table (WAL ထဲမှာ မှတ်တမ်း မတင်သော table) အဖြစ် ဖန်တီးပါတယ်။ Unlogged tables တွေဆီ ရေးလိုက်တဲ့ data တွေကို write-ahead log (ဒေတာ မရေးခင်ကြို မှတ်တမ်းတင်သော log — WAL) ထဲမှာ မရေးတာမို့ (အခန်း 28 ကို ကြည့်ပါ) — သာမန် tables တွေထက် သိသိသာသာ ပိုမြန်ပါတယ်။ ဒါပေမယ့် — သူတို့က crash-safe (crash ဖြစ်မှု ဒဏ်ခံနိုင်မှု) မရှိပါဘူး: crash တစ်ခု သို့မဟုတ် မသန့်ရှင်းတဲ့ (unclean) shutdown တစ်ခု ဖြစ်ပြီးတာနဲ့ — unlogged table တစ်ခုကို အလိုအလျောက် truncate လုပ်ပါတယ်။ Unlogged table တစ်ခုရဲ့ ပါဝင်အကြောင်းအရာတွေကို standby servers (အရံ server များ) တွေဆီလည်း replicate (ပုံတူပွား) မလုပ်ပါဘူး။ Unlogged table တစ်ခုပေါ်မှာ ဖန်တီးတဲ့ indexes တွေ အားလုံးကလည်း အလိုအလျောက် unlogged တွေ ဖြစ်ပါတယ်။

  ဒါကို သတ်မှတ်ထားရင် — unlogged table နဲ့အတူ ဖန်တီးတဲ့ (identity ဒါမှမဟုတ် serial columns တွေအတွက်) sequences တွေ အားလုံးကိုလည်း unlogged အဖြစ် ဖန်တီးပါတယ်။

  ဒီ ပုံစံကို partitioned tables တွေအတွက် ထောက်ပံ့မပေးပါဘူး။

- **IF NOT EXISTS** — တူညီတဲ့ နာမည်နဲ့ relation တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။ ရှိပြီးသား relation က — ဖန်တီးမယ့် relation နဲ့ တစ်စုံတစ်ရာ ဆင်တူမယ်ဆိုတဲ့ အာမခံချက် (guarantee) မရှိဘူးဆိုတာ သတိပြုပါ။

- **table_name** — ဖန်တီးရမယ့် table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။

- **OF type_name** — Typed table တစ်ခုကို ဖန်တီးပေးပါတယ် — ဒါက — သတ်မှတ်ထားတဲ့ stand-alone composite type (ဆိုလိုတာက — `CREATE TYPE` ကို သုံးပြီး ဖန်တီးထားတဲ့ type) ကနေ သူ့ရဲ့ တည်ဆောက်ပုံ (structure) ကို ယူပေမယ့် — composite type အသစ်တစ်ခုကိုလည်း ထုတ်လုပ်ပေးပါသေးတယ်။ Table က — ရည်ညွှန်းထားတဲ့ type အပေါ်မှာ dependency (မှီခိုမှု) တစ်ခု ရှိပြီး — ဆိုလိုတာက — အဲဒီ type ပေါ်မှာ လုပ်တဲ့ cascade alter နဲ့ drop actions တွေက table ဆီပါ ပျံ့နှံ့ (propagate) သွားမယ်လို့ ဆိုလိုပါတယ်။

  Typed table တစ်ခုမှာ — သူ ဆင်းသက်လာတဲ့ (derived) type ရဲ့ column names တွေနဲ့ data types တွေပဲ အမြဲတမ်း ရှိတာမို့ — နောက်ထပ် columns တွေ သတ်မှတ်လို့ မရပါဘူး။ ဒါပေမယ့် — `CREATE TABLE` command က — table ဆီ defaults တွေနဲ့ constraints တွေ ထပ်ပေါင်းပေးနိုင်သလို — storage parameters တွေကိုလည်း သတ်မှတ်ပေးနိုင်ပါတယ်။

- **column_name** — Table အသစ်ထဲမှာ ဖန်တီးရမယ့် column တစ်ခုရဲ့ နာမည်။

- **data_type** — Column ရဲ့ data type။ ဒီထဲမှာ array specifiers တွေ ပါဝင်နိုင်ပါတယ်။ PostgreSQL က ထောက်ပံ့တဲ့ data types တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် အခန်း 8 ကို ရည်ညွှန်းပါ။

- **COLLATE collation** — `COLLATE` clause က column (collatable data type တစ်ခု ဖြစ်ရမယ်) အတွက် collation တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — column ရဲ့ data type ရဲ့ default collation ကို သုံးပါတယ်။

- **STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN | DEFAULT }** — ဒီ ပုံစံက column အတွက် storage mode (သိုလှောင် ပုံစံ) ကို သတ်မှတ်ပေးပါတယ်။ ဒါက — ဒီ column ကို inline (table row ထဲမှာ တိုက်ရိုက်) ထားမလား — secondary TOAST table ထဲမှာ ထားမလား — ပြီးတော့ — data ကို compress လုပ်သင့်လား မလုပ်သင့်ဘူးလားဆိုတာကို ထိန်းချုပ်ပါတယ်။ `PLAIN` ကို integer လို fixed-length (အလျား ပုံသေ) တန်ဖိုးတွေအတွက် သုံးရပြီး — inline, uncompressed ဖြစ်ပါတယ်။ `MAIN` က inline, compressible data အတွက် ဖြစ်ပါတယ်။ `EXTERNAL` က external, uncompressed data အတွက် ဖြစ်ပြီး — `EXTENDED` က external, compressed data အတွက် ဖြစ်ပါတယ်။ `DEFAULT` လို့ ရေးတာက — column ရဲ့ data type အတွက် default storage mode ကို သတ်မှတ်ပေးပါတယ်။ non-PLAIN storage ကို ထောက်ပံ့တဲ့ data types အများစုအတွက် `EXTENDED` က default ဖြစ်ပါတယ်။ `EXTERNAL` ကို သုံးတာက — အလွန် ကြီးမားတဲ့ text နဲ့ bytea တန်ဖိုးတွေပေါ်မှာ substring operations တွေကို ပိုမြန်စေပေမယ့် — storage space ပိုများစေတဲ့ ဆုံးရှုံးမှု (penalty) ရှိပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် Section 66.2 ကို ကြည့်ပါ။

- **COMPRESSION compression_method** — `COMPRESSION` clause က column အတွက် compression method ကို သတ်မှတ်ပေးပါတယ်။ Compression ကို variable-width (အလျား ပြောင်းလဲနိုင်သော) data types တွေအတွက်သာ ထောက်ပံ့ပြီး — column ရဲ့ storage mode က main ဒါမှမဟုတ် extended ဖြစ်နေတဲ့အခါမှသာ သုံးပါတယ်။ (Column storage modes အကြောင်း သိရှိရန် ALTER TABLE ကို ကြည့်ပါ။) Partitioned table တစ်ခုအတွက် ဒီ property ကို သတ်မှတ်တာက တိုက်ရိုက် သက်ရောက်မှု မရှိပါဘူး — ဘာလို့လဲဆိုတော့ — ဒီလို tables တွေမှာ ကိုယ်ပိုင် storage မရှိလို့ပါ — ဒါပေမယ့် — သတ်မှတ်ထားတဲ့ တန်ဖိုးကို အသစ် ဖန်တီးတဲ့ partitions တွေက အမွေဆက်ခံ (inherit) ပါလိမ့်မယ်။ ထောက်ပံ့ထားတဲ့ compression methods တွေကတော့ pglz နဲ့ lz4 ဖြစ်ပါတယ်။ (lz4 က PostgreSQL ကို တည်ဆောက်တဲ့အခါ `--with-lz4` ကို သုံးထားမှသာ ရနိုင်ပါတယ်။) ထို့ပြင် — `compression_method` ကို `default` လို့ ရေးထားနိုင်ပြီး — အဲဒါက default အပြုအမူကို အတိအကျ သတ်မှတ်ပေးပါတယ် — ဆိုလိုတာက — data ထည့်သွင်းတဲ့ (insertion) အချိန်မှာ သုံးရမယ့် method ကို ဆုံးဖြတ်ဖို့ `default_toast_compression` setting ကို တိုင်ပင်တာ ဖြစ်ပါတယ်။

- **INHERITS ( parent_table [, ... ] )** — Optional ဖြစ်တဲ့ `INHERITS` clause က — table အသစ်က columns အားလုံးကို အလိုအလျောက် အမွေဆက်ခံရမယ့် — tables တွေရဲ့ စာရင်းကို သတ်မှတ်ပါတယ်။ Parent tables တွေက သာမန် tables တွေ ဒါမှမဟုတ် foreign tables တွေ ဖြစ်နိုင်ပါတယ်။

  `INHERITS` ကို သုံးတာက — child table အသစ်နဲ့ သူ့ရဲ့ parent table(s) တွေကြားမှာ မပျက်မစီး တည်မြဲတဲ့ (persistent) ဆက်စပ်မှု တစ်ခုကို ဖန်တီးပါတယ်။ Parent(s) တွေပေါ်မှာ လုပ်တဲ့ schema modifications တွေက ပုံမှန်အားဖြင့် children တွေဆီပါ ပျံ့နှံ့ပြီး — default အနေနဲ့ — child table ရဲ့ data တွေကို parent(s) တွေရဲ့ scans တွေထဲမှာ ထည့်သွင်း ပါဝင်စေပါတယ်။

  Column နာမည် တစ်ခုတည်းက parent table တစ်ခုထက်ပိုမှာ ရှိနေရင် — parent tables တစ်ခုချင်းစီထဲက အဲဒီ columns တွေရဲ့ data types တွေ ကိုက်ညီနေမှသာ ရပြီး — မဟုတ်ရင် error တစ်ခု အစီရင်ခံပါတယ်။ Conflict မရှိဘူးဆိုရင် — ထပ်နေတဲ့ columns တွေကို — table အသစ်ထဲမှာ column တစ်ခုတည်း အဖြစ် ပေါင်းစည်း (merge) လိုက်ပါတယ်။ Table အသစ်ရဲ့ column name list ထဲမှာ — အမွေဆက်ခံထားတဲ့ နာမည်တစ်ခုနဲ့ တူညီတဲ့ column name တစ်ခု ပါဝင်နေရင် — data type ကလည်း အမွေဆက်ခံထားတဲ့ column(s) တွေနဲ့ ကိုက်ညီရပြီး — column definitions တွေကို တစ်ခုတည်းအဖြစ် ပေါင်းစည်းလိုက်ပါတယ်။ Table အသစ်က column အတွက် default value တစ်ခုကို အတိအကျ သတ်မှတ်ထားရင် — ဒီ default က — column ရဲ့ အမွေဆက်ခံထားတဲ့ (inherited) declarations တွေထဲက defaults တွေ အားလုံးကို ကျော်လွန် (override) လုပ်ပါတယ်။ မဟုတ်ရင် — column အတွက် default values သတ်မှတ်ပေးထားတဲ့ parents တွေ အားလုံးက default တစ်ခုတည်းကိုပဲ သတ်မှတ်ပေးရပြီး — မဟုတ်ရင် error တစ်ခု အစီရင်ခံပါလိမ့်မယ်။

  `CHECK` constraints တွေကို columns တွေနဲ့ အခြေခံအားဖြင့် ပုံစံတူ ပေါင်းစည်းပါတယ်: parent tables အများအပြားနဲ့/သို့မဟုတ် table အသစ်ရဲ့ definition ထဲမှာ — နာမည် တူညီတဲ့ `CHECK` constraints တွေ ပါဝင်နေရင် — ဒီ constraints တွေ အားလုံးမှာ check expression တစ်ခုတည်း ရှိရပြီး — မဟုတ်ရင် error တစ်ခု အစီရင်ခံပါလိမ့်မယ်။ နာမည် တူညီပြီး expression တူညီတဲ့ constraints တွေကို copy တစ်ခုတည်းအဖြစ် ပေါင်းစည်းလိုက်ပါတယ်။ Parent တစ်ခုမှာ `NO INHERIT` လို့ အမှတ်အသား လုပ်ထားတဲ့ constraint တစ်ခုကိုတော့ ထည့်သွင်း စဉ်းစားမှာ မဟုတ်ပါဘူး။ Table အသစ်ထဲက နာမည် မရှိတဲ့ (unnamed) `CHECK` constraint တစ်ခုကတော့ — သူ့အတွက် ထူးခြားတဲ့ နာမည်တစ်ခုကို အမြဲတမ်း ရွေးချယ်ပေးတာမို့ — ဘယ်တော့မှ ပေါင်းစည်းမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။

  Column `STORAGE` settings တွေကိုလည်း parent tables တွေကနေ ကူးယူပါတယ်။

  Parent table ထဲက column တစ်ခုက identity column ဖြစ်နေရင် — အဲဒီ property ကို အမွေမဆက်ခံပါဘူး။ Child table ထဲက column တစ်ခုကို — လိုအပ်ရင် — identity column အဖြစ် ကြေညာလို့ ရပါတယ်။

- **PARTITION BY { RANGE | LIST | HASH } ( { column_name | ( expression ) } [ opclass ] [, ...] )** — Optional ဖြစ်တဲ့ `PARTITION BY` clause က table ကို partitioning လုပ်မယ့် strategy (နည်းဗျူဟာ) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဒီလို ဖန်တီးလိုက်တဲ့ table ကို partitioned table လို့ ခေါ်ပါတယ်။ Parentheses ထဲမှာ ရှိတဲ့ columns သို့မဟုတ် expressions တွေရဲ့ စာရင်းက table အတွက် partition key ကို ဖွဲ့စည်းပေးပါတယ်။ Range ဒါမှမဟုတ် hash partitioning သုံးတဲ့အခါ — partition key ထဲမှာ columns သို့မဟုတ် expressions အများအပြား ပါဝင်နိုင်ပေမယ့် (32 ခုအထိ — ဒါပေမယ့် ဒီ ကန့်သတ်ချက်ကို PostgreSQL တည်ဆောက်တဲ့အခါ ပြောင်းလဲလို့ ရပါတယ်) — list partitioning အတွက်တော့ — partition key က column တစ်ခုတည်း သို့မဟုတ် expression တစ်ခုတည်းနဲ့ ဖွဲ့စည်းရပါမယ်။

  Range နဲ့ list partitioning တွေက btree operator class တစ်ခု လိုအပ်ပြီး — hash partitioning ကတော့ hash operator class တစ်ခု လိုအပ်ပါတယ်။ Operator class တစ်ခုကို အတိအကျ သတ်မှတ်မထားဘူးဆိုရင် — သင့်လျော်တဲ့ type ရဲ့ default operator class ကို သုံးပါလိမ့်မယ်; default operator class မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။ Hash partitioning သုံးတဲ့အခါ — သုံးတဲ့ operator class က support function 2 ကို အကောင်အထည်ဖော် (implement) ပေးရပါမယ် (အသေးစိတ်အတွက် Section 36.16.3 ကို ကြည့်ပါ)။

  Partitioned table တစ်ခုကို — သီးခြား `CREATE TABLE` commands တွေနဲ့ ဖန်တီးတဲ့ — sub-tables (partitions လို့ ခေါ်ပါတယ်) တွေအဖြစ် ပိုင်းခြားထားပါတယ်။ Partitioned table ကိုယ်တိုင်ကတော့ အလွတ် ဖြစ်ပါတယ်။ Table ထဲကို insert လုပ်လိုက်တဲ့ data row တစ်ခုကို — partition key ထဲက columns သို့မဟုတ် expressions တွေရဲ့ တန်ဖိုးတွေကို အခြေခံပြီး — partition တစ်ခုဆီ လမ်းကြောင်း ပြောင်းပို့ (route) ပေးပါတယ်။ Row အသစ်ထဲက တန်ဖိုးတွေနဲ့ ကိုက်ညီတဲ့ partition တစ်ခု မရှိဘူးဆိုရင် — error တစ်ခု အစီရင်ခံပါလိမ့်မယ်။

  Table partitioning အကြောင်း နောက်ထပ် ဆွေးနွေးချက်တွေအတွက် Section 5.12 ကို ကြည့်ပါ။

- **PARTITION OF parent_table { FOR VALUES partition_bound_spec | DEFAULT }** — Table ကို သတ်မှတ်ထားတဲ့ parent table ရဲ့ partition တစ်ခုအဖြစ် ဖန်တီးပေးပါတယ်။ Table ကို — `FOR VALUES` ကို သုံးပြီး တိကျတဲ့ တန်ဖိုးတွေအတွက် partition တစ်ခုအနေနဲ့ ဖြစ်စေ — `DEFAULT` ကို သုံးပြီး default partition တစ်ခုအနေနဲ့ ဖြစ်စေ — ဖန်တီးနိုင်ပါတယ်။ Parent table ထဲမှာ ရှိတဲ့ indexes တွေ၊ constraints တွေနဲ့ user-defined row-level triggers တွေ အားလုံးကို partition အသစ်ပေါ်မှာ clone (ပုံတူပွား) လုပ်ပါတယ်။

  `partition_bound_spec` က parent table ရဲ့ partitioning method နဲ့ partition key နဲ့ ကိုက်ညီရပြီး — အဲဒီ parent ရဲ့ ရှိပြီးသား partition တစ်ခုခုနဲ့လည်း ထပ်နေ (overlap) လို့ မရပါဘူး။ `IN` ပါတဲ့ ပုံစံကို list partitioning အတွက် သုံးပြီး — `FROM` နဲ့ `TO` ပါတဲ့ ပုံစံကို range partitioning အတွက် သုံးပါတယ် — `WITH` ပါတဲ့ ပုံစံကိုတော့ hash partitioning အတွက် သုံးပါတယ်။

  `partition_bound_expr` ဆိုတာ variable လုံးဝ မပါတဲ့ expression တစ်ခု ဖြစ်ပါတယ် (subqueries တွေ၊ window functions တွေ၊ aggregate functions တွေနဲ့ set-returning functions တွေကို ခွင့်မပြုပါဘူး)။ သူ့ရဲ့ data type က သက်ဆိုင်ရာ partition key column ရဲ့ data type နဲ့ ကိုက်ညီရပါမယ်။ Expression ကို table ဖန်တီးတဲ့ အချိန်မှာ တစ်ကြိမ်တည်း အကဲဖြတ်တာမို့ — `CURRENT_TIMESTAMP` လို volatile expressions တွေတောင် ပါဝင်နိုင်ပါတယ်။

  List partition တစ်ခု ဖန်တီးတဲ့အခါ — partition က partition key column ကို null ဖြစ်ခွင့်ပြုတယ်လို့ ညွှန်ပြဖို့ `NULL` ကို သတ်မှတ်နိုင်ပါတယ်။ ဒါပေမယ့် — ပေးထားတဲ့ parent table တစ်ခုအတွက် — ဒီလို list partition က တစ်ခုထက်ပိုပြီး မရှိနိုင်ပါဘူး။ Range partitions တွေအတွက်တော့ `NULL` ကို သတ်မှတ်လို့ မရပါဘူး။

  Range partition တစ်ခု ဖန်တီးတဲ့အခါ — `FROM` နဲ့ သတ်မှတ်တဲ့ အောက်နယ်နိမိတ် (lower bound) က inclusive (ပါဝင်သော) bound ဖြစ်ပြီး — `TO` နဲ့ သတ်မှတ်တဲ့ အပေါ်နယ်နိမိတ် (upper bound) က exclusive (မပါဝင်သော) bound ဖြစ်ပါတယ်။ ဆိုလိုတာက — `FROM` list ထဲမှာ သတ်မှတ်ထားတဲ့ တန်ဖိုးတွေက ဒီ partition အတွက် သက်ဆိုင်ရာ partition key columns တွေရဲ့ တရားဝင် တန်ဖိုးတွေ ဖြစ်ပြီး — `TO` list ထဲက တန်ဖိုးတွေကတော့ မဟုတ်ပါဘူး။ ဒီ statement ကို row-wise comparison (row အလိုက် နှိုင်းယှဉ်မှု) ရဲ့ စည်းမျဉ်းတွေအတိုင်း (Section 9.25.5) နားလည်ရမယ်ဆိုတာ သတိပြုပါ။ ဥပမာ — `PARTITION BY RANGE (x,y)` ပေးထားတဲ့အခါ — `FROM (1, 2) TO (3, 4)` ဆိုတဲ့ partition bound တစ်ခုက — y >= 2 ဖြစ်တဲ့ x=1 တွေ၊ y က null မဟုတ်တဲ့ x=2 တွေ၊ ပြီးတော့ y < 4 ဖြစ်တဲ့ x=3 တွေကို ခွင့်ပြုပါတယ်။

  Range partition တစ်ခု ဖန်တီးတဲ့အခါ — အထူး တန်ဖိုးတွေဖြစ်တဲ့ `MINVALUE` နဲ့ `MAXVALUE` တွေကို သုံးပြီး — column ရဲ့ တန်ဖိုးအတွက် အောက် ဒါမှမဟုတ် အပေါ် နယ်နိမိတ် မရှိဘူးလို့ ညွှန်ပြနိုင်ပါတယ်။ ဥပမာ — `FROM (MINVALUE) TO (10)` နဲ့ သတ်မှတ်ထားတဲ့ partition တစ်ခုက 10 ထက် ငယ်တဲ့ တန်ဖိုး အားလုံးကို ခွင့်ပြုပြီး — `FROM (10) TO (MAXVALUE)` နဲ့ သတ်မှတ်ထားတဲ့ partition တစ်ခုကတော့ 10 ထက် ကြီးတဲ့ ဒါမှမဟုတ် 10 နဲ့ ညီတဲ့ တန်ဖိုး အားလုံးကို ခွင့်ပြုပါတယ်။

  Column တစ်ခုထက်ပိုပါဝင်တဲ့ range partition တစ်ခု ဖန်တီးတဲ့အခါ — `MAXVALUE` ကို အောက်နယ်နိမိတ်ရဲ့ အစိတ်အပိုင်းအနေနဲ့လည်းကောင်း — `MINVALUE` ကို အပေါ်နယ်နိမိတ်ရဲ့ အစိတ်အပိုင်းအနေနဲ့လည်းကောင်း — သုံးတာက အဓိပ္ပာယ် ရှိနိုင်ပါတယ်။ ဥပမာ — `FROM (0, MAXVALUE) TO (10, MAXVALUE)` နဲ့ သတ်မှတ်ထားတဲ့ partition တစ်ခုက — ပထမ partition key column ရဲ့ တန်ဖိုး 0 ထက် ကြီးပြီး 10 ထက် ငယ်တဲ့ ဒါမှမဟုတ် 10 နဲ့ ညီတဲ့ — rows တွေ အားလုံးကို ခွင့်ပြုပါတယ်။ အလားတူပဲ — `FROM ('a', MINVALUE) TO ('b', MINVALUE)` နဲ့ သတ်မှတ်ထားတဲ့ partition တစ်ခုက — ပထမ partition key column က "a" နဲ့ စတင်တဲ့ rows တွေ အားလုံးကို ခွင့်ပြုပါတယ်။

  Partitioning bound တစ်ခုရဲ့ column တစ်ခုအတွက် `MINVALUE` ဒါမှမဟုတ် `MAXVALUE` ကို သုံးထားရင် — နောက်ဆက်တွဲ column တွေ အားလုံးအတွက်လည်း — တန်ဖိုး တစ်ခုတည်းကိုပဲ သုံးရမယ်ဆိုတာ သတိပြုပါ။ ဥပမာ — `(10, MINVALUE, 0)` က တရားဝင် bound တစ်ခု မဟုတ်ပါဘူး; `(10, MINVALUE, MINVALUE)` လို့ ရေးသင့်ပါတယ်။

  timestamp လို element types တချို့မှာ — သိမ်းဆည်းလို့ရတဲ့ သာမန် တန်ဖိုးတစ်ခုသာ ဖြစ်တဲ့ — "infinity" ဆိုတဲ့ အယူအဆတစ်ခု ရှိတယ်ဆိုတာကိုလည်း သတိပြုပါ။ ဒါက — တကယ် သိမ်းဆည်းလို့ ရတဲ့ တန်ဖိုးတွေ မဟုတ်ဘဲ — တန်ဖိုးက နယ်နိမိတ် မရှိဘူးလို့ ပြောတဲ့ နည်းလမ်းတွေသာ ဖြစ်တဲ့ — `MINVALUE` နဲ့ `MAXVALUE` တို့နဲ့ မတူပါဘူး။ `MAXVALUE` ကို — "infinity" အပါအဝင် — တခြား တန်ဖိုး အားလုံးထက် ကြီးတယ်လို့ မှတ်ယူနိုင်ပြီး — `MINVALUE` ကို — "minus infinity" အပါအဝင် — တခြား တန်ဖိုး အားလုံးထက် ငယ်တယ်လို့ မှတ်ယူနိုင်ပါတယ်။ ဒါကြောင့် — `FROM ('infinity') TO (MAXVALUE)` ဆိုတဲ့ range က အလွတ် range တစ်ခု မဟုတ်ပါဘူး; အဲဒါက "infinity" တန်ဖိုး တစ်ခုတည်းကိုပဲ သိမ်းဆည်းခွင့် ပြုပါတယ်။

  `DEFAULT` ကို သတ်မှတ်ထားရင် — table ကို parent table ရဲ့ default partition အဖြစ် ဖန်တီးပါလိမ့်မယ်။ ဒီ option ကို hash-partitioned tables တွေအတွက် မရနိုင်ပါဘူး။ ပေးထားတဲ့ parent ရဲ့ တခြား partition တစ်ခုခုနဲ့မှ မကိုက်ညီတဲ့ partition key တန်ဖိုးတစ်ခုကို default partition ဆီ လမ်းကြောင်း ပြောင်းပို့ပါလိမ့်မယ်။

  Table တစ်ခုမှာ ရှိပြီးသား `DEFAULT` partition တစ်ခု ရှိနေပြီး — partition အသစ်တစ်ခုကို သူ့ဆီ ထပ်ပေါင်းတဲ့အခါ — default partition ထဲမှာ — partition အသစ်ထဲမှာ သင့်လျော်စွာ ပါဝင်သင့်တဲ့ rows တွေ ပါနေသလားဆိုတာ စစ်ဆေးဖို့ — default partition ကို scan လုပ်ရပါမယ်။ Default partition ထဲမှာ rows အရေအတွက် များနေရင် — ဒါက နှေးကွေးနိုင်ပါတယ်။ Default partition က foreign table တစ်ခု ဖြစ်နေရင် ဒါမှမဟုတ် — partition အသစ်ထဲမှာ ထားသင့်တဲ့ rows တွေ ပါဝင်လို့ မရဘူးဆိုတာကို သက်သေပြနိုင်တဲ့ constraint တစ်ခု သူ့မှာ ရှိနေရင် — scan ကို ကျော်လိုက်ပါလိမ့်မယ်။

  Hash partition တစ်ခု ဖန်တီးတဲ့အခါ — modulus နဲ့ remainder တစ်ခု သတ်မှတ်ရပါမယ်။ Modulus က positive integer ဖြစ်ရပြီး — remainder က modulus ထက် ငယ်တဲ့ non-negative integer ဖြစ်ရပါမယ်။ ပုံမှန်အားဖြင့် — hash-partitioned table တစ်ခုကို ကနဦး စနစ်တကျ ပြင်ဆင်တဲ့အခါ — modulus ကို partition အရေအတွက်နဲ့ ညီမျှအောင် ရွေးချယ်ပြီး — table တိုင်းကို modulus တူညီပြီး remainder မတူညီအောင် သတ်မှတ်သင့်ပါတယ် (အောက်က ဥပမာတွေကို ကြည့်ပါ)။ ဒါပေမယ့် — partition တိုင်းမှာ modulus တူညီဖို့တော့ မလိုအပ်ပါဘူး; hash-partitioned table တစ်ခုရဲ့ partitions တွေထဲမှာ ပေါ်နေတဲ့ modulus တိုင်းက — နောက်ထပ် ပိုကြီးတဲ့ modulus တစ်ခုရဲ့ factor (ဆခွဲကိန်း) ဖြစ်ဖို့သာ လိုအပ်ပါတယ်။ ဒါက — data တွေ အားလုံးကို တစ်ခါတည်း ရွှေ့စရာ မလိုဘဲ — partition အရေအတွက်ကို တဖြည်းဖြည်း (incrementally) တိုးမြှင့်နိုင်စေပါတယ်။ ဥပမာ — partition 8 ခု ပါပြီး တစ်ခုချင်းစီမှာ modulus 8 ရှိတဲ့ hash-partitioned table တစ်ခု ရှိတယ်ဆိုပါစို့ — ဒါပေမယ့် partition အရေအတွက်ကို 16 အထိ တိုးဖို့ လိုအပ်လာတယ်ဆိုရင် — modulus-8 partition တစ်ခုကို detach လုပ်ပြီး — key space ရဲ့ တူညီတဲ့ အပိုင်းကို လွှမ်းခြုံတဲ့ modulus-16 partition အသစ် နှစ်ခုကို ဖန်တီးနိုင်ပါတယ် (တစ်ခုက detach လုပ်ထားတဲ့ partition ရဲ့ remainder နဲ့ ညီတဲ့ remainder နဲ့ — နောက်တစ်ခုက အဲဒီ တန်ဖိုး + 8 နဲ့ ညီတဲ့ remainder နဲ့) — ပြီးတော့ — သူတို့ကို data တွေနဲ့ ပြန်ဖြည့်နိုင်ပါတယ်။ နောက်ပြီး — modulus-8 partition တစ်ခုချင်းစီအတွက် — နောက်မှ ဖြစ်စေ — ဘယ်ဟာမှ မကျန်တော့သည်အထိ — ဒီ လုပ်ငန်းစဉ်ကို ထပ်ခါထပ်ခါ လုပ်နိုင်ပါတယ်။ အဆင့်တိုင်းမှာ data အများအပြား ရွှေ့ရတာ ပါဝင်နေနိုင်ပေမယ့် — table အသစ်တစ်ခုလုံး ဖန်တီးပြီး data အားလုံးကို တစ်ခါတည်း ရွှေ့ရတာထက်တော့ ပိုကောင်းပါသေးတယ်။

  Partition တစ်ခုမှာ — သူ ပိုင်ဆိုင်တဲ့ partitioned table ရဲ့ column names တွေနဲ့ types တွေ အတူတူ ရှိရပါမယ်။ Partitioned table တစ်ခုရဲ့ column names ဒါမှမဟုတ် types တွေကို ပြုပြင်မွမ်းမံတာက partitions တွေ အားလုံးဆီ အလိုအလျောက် ပျံ့နှံ့ပါလိမ့်မယ်။ `CHECK` constraints တွေကို partition တိုင်းက အလိုအလျောက် အမွေဆက်ခံပေမယ့် — partition တစ်ခုချင်းစီက `CHECK` constraints ထပ်ဆောင်းတွေကိုတော့ သတ်မှတ်နိုင်ပါတယ်; parent ထဲမှာ နာမည်တူ ဖြစ်ပြီး condition တူညီတဲ့ ထပ်ဆောင်း constraints တွေကို parent constraint နဲ့ ပေါင်းစည်းလိုက်ပါလိမ့်မယ်။ Defaults တွေကို partition တစ်ခုချင်းစီအတွက် သပ်သပ်စီ သတ်မှတ်နိုင်ပါတယ်။ ဒါပေမယ့် — partition တစ်ခုရဲ့ default value ကို — partitioned table ကနေတစ်ဆင့် tuple တစ်ခုကို insert လုပ်တဲ့အခါ — အသုံးမပြုဘူးဆိုတာ သတိပြုပါ။

  Partitioned table တစ်ခုထဲကို insert လုပ်လိုက်တဲ့ rows တွေကို သင့်လျော်တဲ့ partition ဆီ အလိုအလျောက် လမ်းကြောင်း ပြောင်းပို့ပါလိမ့်မယ်။ သင့်လျော်တဲ့ partition တစ်ခု မရှိဘူးဆိုရင် — error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

  `TRUNCATE` လို — ပုံမှန်အားဖြင့် table တစ်ခုနဲ့ သူ့ရဲ့ inheritance children တွေ အားလုံးကို သက်ရောက်တဲ့ — operations တွေက partitions တွေ အားလုံးဆီ cascade လုပ်ပေမယ့် — partition တစ်ခုချင်းစီပေါ်မှာလည်း သပ်သပ်စီ လုပ်ဆောင်လို့ ရပါတယ်။

  `PARTITION OF` ကို သုံးပြီး partition တစ်ခု ဖန်တီးတာက — parent partitioned table ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခု ယူရန် လိုအပ်တယ်ဆိုတာ သတိပြုပါ။ အလားတူပဲ — `DROP TABLE` နဲ့ partition တစ်ခုကို drop လုပ်တာကလည်း — parent table ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခု ယူရန် လိုအပ်ပါတယ်။ ဒီ operations တွေကို — ပိုအားနည်းတဲ့ lock တစ်ခုနဲ့ လုပ်ဆောင်နိုင်အောင် — partitioned table ပေါ်မှာ တစ်ပြိုင်နက် (concurrent) operations တွေနဲ့ ဝင်ရောက် စွက်ဖက်မှု လျှော့ချဖို့ — `ALTER TABLE ATTACH/DETACH PARTITION` ကို သုံးနိုင်ပါတယ်။

- **LIKE source_table [ like_option ... ]** — `LIKE` clause က — table အသစ်က column names တွေ အားလုံး၊ သူတို့ရဲ့ data types တွေနဲ့ not-null constraints တွေကို အလိုအလျောက် ကူးယူရမယ့် — table တစ်ခုကို သတ်မှတ်ပါတယ်။

  `INHERITS` နဲ့ မတူဘဲ — table အသစ်နဲ့ မူရင်း table က ဖန်တီးပြီးတာနဲ့ လုံးဝ သီးခြား ဖြစ်သွားပါတယ်။ မူရင်း table ကို ပြောင်းလဲတာတွေက table အသစ်ကို သက်ရောက်မှာ မဟုတ်ဘဲ — table အသစ်ရဲ့ data တွေကို မူရင်း table ရဲ့ scans တွေထဲမှာ ထည့်သွင်းဖို့လည်း မဖြစ်နိုင်ပါဘူး။

  ထို့ပြင် — `INHERITS` နဲ့ မတူဘဲ — `LIKE` နဲ့ ကူးယူလိုက်တဲ့ columns တွေနဲ့ constraints တွေကို — နာမည် ဆင်တူတဲ့ columns တွေနဲ့ constraints တွေနဲ့ ပေါင်းစည်းမှု မလုပ်ပါဘူး။ နာမည်တစ်ခုကို အတိအကျ သတ်မှတ်ထားတာ ဒါမှမဟုတ် — တခြား `LIKE` clause တစ်ခုထဲမှာ ပါဝင်နေရင် — error တစ်ခု အချက်ပြပါတယ်။

  Optional ဖြစ်တဲ့ like_option clauses တွေက — မူရင်း table ရဲ့ ဘယ် ထပ်ဆောင်း properties တွေကို ကူးယူမလဲဆိုတာ သတ်မှတ်ပေးပါတယ်။ `INCLUDING` သတ်မှတ်တာက property ကို ကူးယူပြီး — `EXCLUDING` သတ်မှတ်တာက property ကို ချန်လှပ်ပါတယ်။ `EXCLUDING` က default ဖြစ်ပါတယ်။ Object အမျိုးအစား တစ်ခုတည်းအတွက် သတ်မှတ်ချက် အများအပြား လုပ်ထားရင် — နောက်ဆုံး တစ်ခုကို သုံးပါတယ်။ ရနိုင်တဲ့ options တွေကတော့:

    - **INCLUDING COMMENTS** — ကူးယူလိုက်တဲ့ columns တွေ၊ check constraints တွေ၊ not-null constraints တွေ၊ indexes တွေနဲ့ extended statistics တွေရဲ့ comments တွေကို ကူးယူပါလိမ့်မယ်။ Default အပြုအမူကတော့ comments တွေကို ချန်လှပ်တာ ဖြစ်ပြီး — ရလဒ်အနေနဲ့ — table အသစ်ထဲက သက်ဆိုင်ရာ objects တွေမှာ comments တွေ ဘာမှ မရှိစေပါဘူး။

    - **INCLUDING COMPRESSION** — Columns တွေရဲ့ compression methods တွေကို ကူးယူပါလိမ့်မယ်။ Default အပြုအမူကတော့ compression methods တွေကို ချန်လှပ်တာ ဖြစ်ပြီး — ရလဒ်အနေနဲ့ — columns တွေမှာ default compression method ရှိစေပါတယ်။

    - **INCLUDING CONSTRAINTS** — `CHECK` constraints တွေကို ကူးယူပါလိမ့်မယ်။ Column constraints နဲ့ table constraints ကြားမှာ ခွဲခြားမှု မလုပ်ပါဘူး။ Not-null constraints တွေကိုတော့ — table အသစ်ဆီ အမြဲတမ်း ကူးယူပါတယ်။

    - **INCLUDING DEFAULTS** — ကူးယူလိုက်တဲ့ column definitions တွေရဲ့ default expressions တွေကို ကူးယူပါလိမ့်မယ်။ မဟုတ်ရင် — default expressions တွေကို မကူးယူဘဲ — ရလဒ်အနေနဲ့ — table အသစ်ထဲက ကူးယူလိုက်တဲ့ columns တွေမှာ null defaults တွေ ရှိစေပါတယ်။ `nextval` လို database-modification functions တွေကို ခေါ်တဲ့ defaults တွေကို ကူးယူတာက — မူရင်း table နဲ့ table အသစ်ကြားမှာ functional linkage (လုပ်ဆောင်မှု ဆက်စပ်မှု) တစ်ခု ဖန်တီးမိနိုင်တယ်ဆိုတာ သတိပြုပါ။

    - **INCLUDING GENERATED** — ကူးယူလိုက်တဲ့ column definitions တွေရဲ့ generation expressions တွေ နဲ့အတူ — stored/virtual ရွေးချယ်မှုကိုပါ ကူးယူပါလိမ့်မယ်။ Default အနေနဲ့တော့ — columns အသစ်တွေက သာမန် base columns တွေ ဖြစ်ပါလိမ့်မယ်။

    - **INCLUDING IDENTITY** — ကူးယူလိုက်တဲ့ column definitions တွေရဲ့ identity specifications တွေ အားလုံးကို ကူးယူပါလိမ့်မယ်။ Table အသစ်ရဲ့ identity column တစ်ခုချင်းစီအတွက် — table အဟောင်းနဲ့ ဆက်စပ်နေတဲ့ sequences တွေကနေ သီးခြား — sequence အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

    - **INCLUDING INDEXES** — မူရင်း table ပေါ်မှာ ရှိတဲ့ indexes တွေ၊ `PRIMARY KEY` တွေ၊ `UNIQUE` တွေနဲ့ `EXCLUDE` constraints တွေကို table အသစ်ပေါ်မှာ ဖန်တီးပါလိမ့်မယ်။ Indexes နဲ့ constraints အသစ်တွေရဲ့ နာမည်တွေကို — မူရင်း နာမည်တွေ ဘယ်လိုပဲ ပေးထားပါစေ — default စည်းမျဉ်းတွေအတိုင်း ရွေးချယ်ပါတယ်။ (ဒီ အပြုအမူက — indexes အသစ်တွေအတွက် နာမည် ထပ်နေတဲ့ (duplicate-name) failures တွေ ဖြစ်နိုင်ခြေကို ရှောင်ရှားပေးပါတယ်။)

    - **INCLUDING STATISTICS** — Extended statistics တွေကို table အသစ်ဆီ ကူးယူပါတယ်။

    - **INCLUDING STORAGE** — ကူးယူလိုက်တဲ့ column definitions တွေရဲ့ `STORAGE` settings တွေကို ကူးယူပါလိမ့်မယ်။ Default အပြုအမူကတော့ `STORAGE` settings တွေကို ချန်လှပ်တာ ဖြစ်ပြီး — ရလဒ်အနေနဲ့ — table အသစ်ထဲက ကူးယူလိုက်တဲ့ columns တွေမှာ type-specific default settings တွေ ရှိစေပါတယ်။ `STORAGE` settings တွေအကြောင်း နောက်ထပ်အတွက် Section 66.2 ကို ကြည့်ပါ။

    - **INCLUDING ALL** — `INCLUDING ALL` က — ရနိုင်တဲ့ individual options တွေ အားလုံးကို ရွေးချယ်တဲ့ အတိုကောက် (abbreviated) ပုံစံ တစ်ခု ဖြစ်ပါတယ်။ (သတ်မှတ်ထားတဲ့ options တချို့ ကလွဲလို့ ကျန် အားလုံးကို ရွေးချယ်ချင်ရင် — `INCLUDING ALL` ရဲ့ နောက်မှာ individual `EXCLUDING` clauses တွေကို ရေးတာ အသုံးဝင်နိုင်ပါတယ်။)

  `LIKE` clause ကို — views တွေ၊ foreign tables တွေ ဒါမှမဟုတ် composite types တွေကနေ column definitions တွေကို ကူးယူဖို့လည်း သုံးနိုင်ပါတယ်။ သက်ဆိုင်မှု မရှိတဲ့ options တွေ (ဥပမာ — view တစ်ခုကနေ `INCLUDING INDEXES`) ကိုတော့ လျစ်လျူရှုပါတယ်။

- **CONSTRAINT constraint_name** — Column ဒါမှမဟုတ် table constraint တစ်ခုအတွက် optional နာမည် တစ်ခု။ Constraint ကို ချိုးဖောက်လိုက်ရင် — error messages တွေထဲမှာ constraint နာမည် ပါဝင်တာမို့ — `col must be positive` လို constraint နာမည်တွေက client applications တွေဆီ အသုံးဝင်တဲ့ constraint အချက်အလက်တွေကို ဆက်သွယ်ပေးဖို့ သုံးနိုင်ပါတယ်။ (နေရာလွတ် (space) တွေ ပါဝင်တဲ့ constraint နာမည်တွေကို သတ်မှတ်ဖို့ double quotes တွေ လိုအပ်ပါတယ်။) Constraint နာမည် မသတ်မှတ်ထားဘူးဆိုရင် — system က နာမည်တစ်ခုကို ထုတ်ပေးပါတယ်။

- **NOT NULL [ NO INHERIT ]** — Column ထဲမှာ null values တွေ ပါဝင်လို့ မရပါဘူး။

  `NO INHERIT` လို့ အမှတ်အသား လုပ်ထားတဲ့ constraint တစ်ခုက child tables တွေဆီ ပျံ့နှံ့မှာ မဟုတ်ပါဘူး။

- **NULL** — Column ထဲမှာ null values တွေ ပါဝင်ခွင့် ရှိပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

  ဒီ clause ကို non-standard SQL databases တွေနဲ့ လိုက်ဖက်ညီမှု ရှိစေဖို့အတွက်သာ ထောက်ပံ့ပေးထားတာ ဖြစ်ပါတယ်။ Application အသစ်တွေမှာ ဒါကို သုံးဖို့တော့ မထောက်ခံပါဘူး။

- **CHECK ( expression ) [ NO INHERIT ]** — `CHECK` clause က — insert သို့မဟုတ် update operation တစ်ခု အောင်မြင်ဖို့အတွက် — အသစ် ထည့်သွင်းတဲ့ သို့မဟုတ် update လုပ်လိုက်တဲ့ rows တွေ ကျေနပ်စေရမယ့် — Boolean ရလဒ် ထုတ်ပေးတဲ့ expression တစ်ခုကို သတ်မှတ်ပါတယ်။ `TRUE` ဒါမှမဟုတ် `UNKNOWN` လို့ အကဲဖြတ်လို့ ရတဲ့ expressions တွေက အောင်မြင်ပါတယ်။ Insert သို့မဟုတ် update operation တစ်ခုရဲ့ row တစ်ခုခုက `FALSE` ရလဒ် ထုတ်ပေးခဲ့ရင် — error exception တစ်ခု ထုတ်ပေးပြီး — insert ဒါမှမဟုတ် update က database ကို မပြောင်းလဲပါဘူး။ Column constraint အနေနဲ့ သတ်မှတ်ထားတဲ့ check constraint တစ်ခုက အဲဒီ column ရဲ့ တန်ဖိုးကိုပဲ ရည်ညွှန်းသင့်ပြီး — table constraint တစ်ခုထဲမှာ ပေါ်လာတဲ့ expression တစ်ခုကတော့ columns အများအပြားကို ရည်ညွှန်းနိုင်ပါတယ်။

  လောလောဆယ် — `CHECK` expressions တွေထဲမှာ subqueries တွေ ပါဝင်လို့ မရသလို — current row ရဲ့ columns တွေကလွဲလို့ တခြား variables တွေကိုလည်း ရည်ညွှန်းလို့ မရပါဘူး (Section 5.5.1 ကို ကြည့်ပါ)။ System column ဖြစ်တဲ့ tableoid ကိုတော့ ရည်ညွှန်းလို့ ရပေမယ့် — တခြား system columns တွေကိုတော့ မရပါဘူး။

  `NO INHERIT` လို့ အမှတ်အသား လုပ်ထားတဲ့ constraint တစ်ခုက child tables တွေဆီ ပျံ့နှံ့မှာ မဟုတ်ပါဘူး။

  Table တစ်ခုမှာ `CHECK` constraints အများအပြား ရှိနေရင် — `NOT NULL` constraints တွေကို စစ်ဆေးပြီးတဲ့ နောက် — row တစ်ခုချင်းစီအတွက် — နာမည် အက္ခရာစဉ် (alphabetical order) အတိုင်း စမ်းသပ်ပါတယ်။ (PostgreSQL version 9.5 မတိုင်ခင်က — `CHECK` constraints တွေအတွက် တိကျတဲ့ firing order (စစ်ဆေးသည့် အစပျိုး အစဉ်) တစ်ခုကို လေးစားမှု မရှိခဲ့ပါဘူး။)

- **DEFAULT default_expr** — `DEFAULT` clause က — သူ့ရဲ့ column definition ထဲမှာ ပါဝင်နေတဲ့ column အတွက် — default data value တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ အဲဒီ တန်ဖိုးက variable-free (variable မပါတဲ့) expression တစ်ခု ဖြစ်ရပါတယ် (အထူးသဖြင့် — current table ထဲက တခြား columns တွေဆီ ကူးညွှန်းတာတွေ ခွင့်မပြုပါဘူး)။ Subqueries တွေလည်း ခွင့်မပြုပါဘူး။ Default expression ရဲ့ data type က column ရဲ့ data type နဲ့ ကိုက်ညီရပါမယ်။

  Default expression ကို — column အတွက် တန်ဖိုးတစ်ခု သတ်မှတ်မပေးတဲ့ — insert operation တိုင်းမှာ သုံးပါလိမ့်မယ်။ Column တစ်ခုအတွက် default မရှိဘူးဆိုရင် — default က null ဖြစ်ပါတယ်။

- **GENERATED ALWAYS AS ( generation_expr ) [ STORED | VIRTUAL ]** — ဒီ clause က column ကို generated column (တွက်ချက် ထုတ်လုပ်ထားသော column) အဖြစ် ဖန်တီးပေးပါတယ်။ ဒီ column ဆီ ရေးလို့ မရပါဘူး — ဖတ်တဲ့အခါမှာတော့ — သတ်မှတ်ထားတဲ့ expression ရဲ့ ရလဒ်ကို ပြန်ပေးပါလိမ့်မယ်။

  `VIRTUAL` လို့ သတ်မှတ်ထားရင် — column ကို ဖတ်တဲ့အခါ တွက်ချက်ပြီး — storage ကို ဘာမှ မသိမ်းပိုက်ပါဘူး။ `STORED` လို့ သတ်မှတ်ထားရင် — column ကို write လုပ်တဲ့အခါ တွက်ချက်ပြီး — disk ပေါ်မှာ သိမ်းဆည်းပါတယ်။ `VIRTUAL` က default ဖြစ်ပါတယ်။

  Generation expression က table ထဲက တခြား columns တွေကို ရည်ညွှန်းနိုင်ပေမယ့် — တခြား generated columns တွေကိုတော့ မရည်ညွှန်းနိုင်ပါဘူး။ သုံးတဲ့ functions နဲ့ operators တွေ အားလုံးက immutable (မပြောင်းလဲနိုင်သော) ဖြစ်ရပါမယ်။ တခြား tables တွေကို ရည်ညွှန်းတာတွေ ခွင့်မပြုပါဘူး။

  Virtual generated column တစ်ခုမှာ user-defined type ရှိလို့ မရပါဘူး — ပြီးတော့ — virtual generated column တစ်ခုရဲ့ generation expression က user-defined functions ဒါမှမဟုတ် types တွေကို ရည်ညွှန်းလို့ မရပါဘူး — ဆိုလိုတာက — built-in functions ဒါမှမဟုတ် types တွေကိုပဲ သုံးနိုင်ပါတယ်။ ဒါက operators ဒါမှမဟုတ် casts တွေရဲ့ အောက်ခံမှာ ရှိနေတဲ့ functions ဒါမှမဟုတ် types တွေအတွက်ဆိုသလို — သွယ်ဝိုက်၍လည်း သက်ရောက်ပါတယ်။ (Stored generated columns တွေအတွက်တော့ ဒီ ကန့်သတ်ချက် မရှိပါဘူး။)

- **GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [ ( sequence_options ) ]** — ဒီ clause က column ကို identity column အဖြစ် ဖန်တီးပေးပါတယ်။ သူ့မှာ သွယ်ဝိုက် (implicit) sequence တစ်ခု ချိတ်ဆက်ထားပြီး — အသစ် insert လုပ်တဲ့ rows တွေထဲမှာ — column က sequence ကနေ တန်ဖိုးတွေကို အလိုအလျောက် ရရှိပါလိမ့်မယ်။ ဒီလို column မျိုးက implicitly `NOT NULL` ဖြစ်ပါတယ်။

  `ALWAYS` နဲ့ `BY DEFAULT` clauses တွေက — user က အတိအကျ သတ်မှတ်ပေးလိုက်တဲ့ တန်ဖိုးတွေကို `INSERT` နဲ့ `UPDATE` commands တွေထဲမှာ ဘယ်လို ကိုင်တွယ်မလဲဆိုတာ ဆုံးဖြတ်ပေးပါတယ်။

  `INSERT` command တစ်ခုထဲမှာ — `ALWAYS` ကို ရွေးထားရင် — `INSERT` statement က `OVERRIDING SYSTEM VALUE` ကို သတ်မှတ်ထားမှသာ — user သတ်မှတ်တဲ့ တန်ဖိုးကို လက်ခံပါတယ်။ `BY DEFAULT` ကို ရွေးထားရင် — user သတ်မှတ်တဲ့ တန်ဖိုးက ဦးစားပေး ရပါတယ်။ အသေးစိတ်အတွက် INSERT ကို ကြည့်ပါ။ (`COPY` command ထဲမှာတော့ — ဒီ setting ဘယ်လိုပဲ ရှိနေပါစေ — user သတ်မှတ်တဲ့ တန်ဖိုးတွေကို အမြဲတမ်း သုံးပါတယ်။)

  `UPDATE` command တစ်ခုထဲမှာ — `ALWAYS` ကို ရွေးထားရင် — column ကို `DEFAULT` ကလွဲလို့ တခြား တန်ဖိုးတစ်ခုခုဆီ update လုပ်တာကို ငြင်းပယ်ပါလိမ့်မယ်။ `BY DEFAULT` ကို ရွေးထားရင် — column ကို ပုံမှန်အတိုင်း update လုပ်လို့ ရပါတယ်။ (`UPDATE` command အတွက် `OVERRIDING` clause ဆိုတာ မရှိပါဘူး။)

  Optional ဖြစ်တဲ့ sequence_options clause ကို — sequence ရဲ့ parameters တွေကို ကျော်လွန် (override) လုပ်ဖို့ သုံးနိုင်ပါတယ်။ ရနိုင်တဲ့ options တွေထဲမှာ — `CREATE SEQUENCE` အတွက် ပြသထားတဲ့ options တွေ ပါဝင်ပြီး — sequence ရဲ့ နာမည်နဲ့ persistence level (တည်မြဲမှု အဆင့်) ကို ရွေးချယ်ခွင့် ပေးတဲ့ — `SEQUENCE NAME` name, `LOGGED` နဲ့ `UNLOGGED` တွေလည်း ထပ်ပါဝင်ပါတယ်။ `SEQUENCE NAME` မပါဘဲ ဆိုရင် — system က sequence အတွက် အသုံးမပြုရသေးတဲ့ နာမည်တစ်ခုကို ရွေးချယ်ပါတယ်။ `LOGGED` ဒါမှမဟုတ် `UNLOGGED` မပါဘဲ ဆိုရင် — sequence က table နဲ့ တူညီတဲ့ persistence level ရှိပါလိမ့်မယ်။

- **UNIQUE [ NULLS [ NOT ] DISTINCT ]** (column constraint) / **UNIQUE [ NULLS [ NOT ] DISTINCT ] ( column_name [, ... ] [, column_name WITHOUT OVERLAPS ] ) [ INCLUDE ( column_name [, ...]) ]** (table constraint) — `UNIQUE` constraint က — table တစ်ခုရဲ့ column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ columns တစ်စုထဲမှာ — unique (ထူးခြားသော) တန်ဖိုးတွေပဲ ပါဝင်နိုင်တယ်လို့ သတ်မှတ်ပါတယ်။ Unique table constraint တစ်ခုရဲ့ အပြုအမူက unique column constraint တစ်ခုနဲ့ အတူတူပဲ ဖြစ်ပြီး — columns အများအပြားကို လွှမ်းခြုံနိုင်တဲ့ နောက်ထပ် စွမ်းရည် တစ်ခု ထပ်ပါရှိပါတယ်။ ဒါကြောင့် — constraint က — rows ဘယ်နှစ်ခုမဆို — ဒီ columns တွေထဲက အနည်းဆုံး column တစ်ခုမှာ ကွဲပြားရမယ်လို့ အတင်းအကျပ် လုပ်ဆောင်ပါတယ်။

  နောက်ဆုံး column အတွက် `WITHOUT OVERLAPS` option ကို သတ်မှတ်ထားရင် — အဲဒီ column ကို equality (တူညီမှု) အစား — overlaps (ထပ်နေမှု) ရှိမရှိ စစ်ဆေးပါတယ်။ အဲဒီလိုဆိုရင် — constraint ရဲ့ တခြား columns တွေမှာ — `WITHOUT OVERLAPS` column ထဲမှာ မထပ်နေသရွေ့ — duplicates (ထပ်နေသော တန်ဖိုးများ) ခွင့်ပြုပါတယ်။ (Column က dates ဒါမှမဟုတ် timestamps တွေရဲ့ range တစ်ခု ဖြစ်နေရင် — ဒါကို တစ်ခါတစ်ရံ temporal key လို့ ခေါ်ပါတယ် — ဒါပေမယ့် PostgreSQL က base type မည်သည့်အပေါ်မှာမဆို ranges တွေကို ခွင့်ပြုပါတယ်။) လက်တွေ့မှာတော့ — ဒီလို constraint တစ်ခုကို `UNIQUE` constraint တစ်ခုထက် — `EXCLUDE` constraint တစ်ခုနဲ့ အတင်းအကျပ် လုပ်ဆောင်ပါတယ်။ ဒါကြောင့် ဥပမာ — `UNIQUE (id, valid_at WITHOUT OVERLAPS)` က `EXCLUDE USING GIST (id WITH =, valid_at WITH &&)` လိုပဲ ပြုမူပါတယ်။ `WITHOUT OVERLAPS` column က range ဒါမှမဟုတ် multirange type တစ်ခု ဖြစ်ရပါမယ်။ အလွတ် ranges/multiranges တွေကို ခွင့်မပြုပါဘူး။ Constraint ရဲ့ non-`WITHOUT OVERLAPS` columns တွေကတော့ — GiST index တစ်ခုထဲမှာ equality နဲ့ နှိုင်းယှဉ်လို့ရတဲ့ type မည်သည့်မဆို ဖြစ်နိုင်ပါတယ်။ Default အနေနဲ့ — range types တွေကိုပဲ ထောက်ပံ့ပြီး — ဒါပေမယ့် — btree_gist extension ကို ထည့်သွင်းခြင်းအားဖြင့် တခြား types တွေကို သုံးနိုင်ပါတယ် (ဒီ feature ကို သုံးဖို့ မျှော်လင့်ထားတဲ့ နည်းလမ်းကတော့ ဒါပါပဲ)။

  Unique constraint တစ်ခုရဲ့ ရည်ရွယ်ချက်တွေအတွက် — `NULLS NOT DISTINCT` ကို သတ်မှတ်ထားခြင်း မရှိဘူးဆိုရင် — null values တွေကို တစ်ခုနဲ့တစ်ခု တူညီတယ်လို့ မယူဆပါဘူး။

  Unique constraint တစ်ခုချင်းစီက — table အတွက် သတ်မှတ်ထားတဲ့ တခြား unique ဒါမှမဟုတ် primary key constraint တစ်ခုခုက နာမည်ပေးထားတဲ့ column အစုနဲ့ မတူညီတဲ့ — column အစုတစ်ခုကို နာမည်ပေးသင့်ပါတယ်။ (မဟုတ်ရင် — redundant (ထပ်နေသော) unique constraints တွေကို စွန့်ပစ်လိုက်ပါလိမ့်မယ်။)

  အဆင့်ပေါင်းများစွာ (multi-level) partition hierarchy တစ်ခုအတွက် unique constraint တစ်ခု သတ်မှတ်တဲ့အခါ — target partitioned table ရဲ့ partition key ထဲက columns တွေ အားလုံး — သူ့ရဲ့ အောက်ဆင့် (descendant) partitioned tables တွေ အားလုံးရဲ့ partition key columns တွေပါ အပါအဝင် — constraint definition ထဲမှာ ပါဝင်ရပါမယ်။

  Unique constraint တစ်ခု ထပ်ပေါင်းတာက — constraint ထဲမှာ သုံးထားတဲ့ column ဒါမှမဟုတ် column အစုပေါ်မှာ — unique btree index တစ်ခုကို အလိုအလျောက် ဖန်တီးပါလိမ့်မယ်။ ဒါပေမယ့် — constraint ထဲမှာ `WITHOUT OVERLAPS` clause တစ်ခု ပါဝင်နေရင်တော့ — GiST index တစ်ခုကို သုံးပါလိမ့်မယ်။ ဖန်တီးလိုက်တဲ့ index က unique constraint နဲ့ နာမည် တူညီပါတယ်။

  Optional ဖြစ်တဲ့ `INCLUDE` clause က အဲဒီ index ဆီ — "payload" သက်သက် ဖြစ်တဲ့ — column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို ထပ်ပေါင်းပေးပါတယ်: သူတို့အပေါ်မှာ uniqueness ကို အတင်းအကျပ် မလုပ်ဆောင်ဘဲ — အဲဒီ columns တွေကို အခြေခံပြီး index ကို ရှာဖွေလို့လည်း မရပါဘူး။ ဒါပေမယ့် — index-only scan တစ်ခုကနေတော့ သူတို့ကို ပြန်ယူနိုင်ပါတယ်။ Constraint ကို included columns တွေအပေါ်မှာ အတင်းအကျပ် မလုပ်ဆောင်ပေမယ့် — သူတို့အပေါ်မှာတော့ မှီခိုနေသေးတယ်ဆိုတာ သတိပြုပါ။ ဒါကြောင့် — ဒီလို columns တွေပေါ်မှာ လုပ်တဲ့ operations တချို့ (ဥပမာ — `DROP COLUMN`) က — cascade လုပ်တဲ့ constraint နဲ့ index ဖျက်ခြင်းတွေကို ဖြစ်စေနိုင်ပါတယ်။

- **PRIMARY KEY (column constraint)** / **PRIMARY KEY ( column_name [, ... ] [, column_name WITHOUT OVERLAPS ] ) [ INCLUDE ( column_name [, ...]) ]** (table constraint) — `PRIMARY KEY` constraint က — table တစ်ခုရဲ့ column တစ်ခု ဒါမှမဟုတ် columns တစ်စုထဲမှာ — unique (ထပ်နေမှု မရှိသော) ဖြစ်ပြီး nonnull ဖြစ်တဲ့ တန်ဖိုးတွေပဲ ပါဝင်နိုင်တယ်လို့ သတ်မှတ်ပါတယ်။ Table တစ်ခုအတွက် — column constraint အနေနဲ့ ဖြစ်စေ — table constraint အနေနဲ့ ဖြစ်စေ — primary key တစ်ခုတည်းကိုပဲ သတ်မှတ်လို့ ရပါတယ်။

  Primary key constraint က — တူညီတဲ့ table အတွက် သတ်မှတ်ထားတဲ့ unique constraint တစ်ခုခုက နာမည်ပေးထားတဲ့ column အစုနဲ့ မတူညီတဲ့ — column အစုတစ်ခုကို နာမည်ပေးသင့်ပါတယ်။ (မဟုတ်ရင် — unique constraint က redundant ဖြစ်ပြီး — စွန့်ပစ်လိုက်ပါလိမ့်မယ်။)

  `PRIMARY KEY` က — `UNIQUE` နဲ့ `NOT NULL` တို့ရဲ့ ပေါင်းစပ်မှုနဲ့ တူညီတဲ့ data constraints တွေကို အတင်းအကျပ် လုပ်ဆောင်ပါတယ်။ ဒါပေမယ့် — column အစုတစ်ခုကို primary key အဖြစ် သတ်မှတ်တာက — schema ရဲ့ ဒီဇိုင်းအကြောင်း metadata တွေကိုလည်း ပေးပါတယ် — ဘာလို့လဲဆိုတော့ — primary key တစ်ခုက — တခြား tables တွေက rows တွေအတွက် unique identifier (ထူးခြားသော သတ်မှတ်ကိန်း) အဖြစ် ဒီ column အစုကို မှီခိုလို့ ရတယ်ဆိုတဲ့ အဓိပ္ပာယ် သက်ရောက်လို့ပါ။

  Partitioned table တစ်ခုပေါ်မှာ ထားတဲ့အခါ — `PRIMARY KEY` constraints တွေက — `UNIQUE` constraints တွေအတွက် အထက်မှာ ဖော်ပြခဲ့တဲ့ ကန့်သတ်ချက်တွေကိုပဲ မျှဝေခံစားရပါတယ်။

  `PRIMARY KEY` constraint တစ်ခု ထပ်ပေါင်းတာက — constraint ထဲမှာ သုံးထားတဲ့ column ဒါမှမဟုတ် column အစုပေါ်မှာ — unique btree index တစ်ခုကို အလိုအလျောက် ဖန်တီးပါလိမ့်မယ် — ဒါမှမဟုတ် — `WITHOUT OVERLAPS` ကို သတ်မှတ်ထားရင် — GiST index တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။

  Optional ဖြစ်တဲ့ `INCLUDE` clause က အဲဒီ index ဆီ — "payload" သက်သက် ဖြစ်တဲ့ — column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို ထပ်ပေါင်းပေးပါတယ်: သူတို့အပေါ်မှာ uniqueness ကို အတင်းအကျပ် မလုပ်ဆောင်ဘဲ — အဲဒီ columns တွေကို အခြေခံပြီး index ကို ရှာဖွေလို့လည်း မရပါဘူး။ ဒါပေမယ့် — index-only scan တစ်ခုကနေတော့ သူတို့ကို ပြန်ယူနိုင်ပါတယ်။ Constraint ကို included columns တွေအပေါ်မှာ အတင်းအကျပ် မလုပ်ဆောင်ပေမယ့် — သူတို့အပေါ်မှာတော့ မှီခိုနေသေးတယ်ဆိုတာ သတိပြုပါ။ ဒါကြောင့် — ဒီလို columns တွေပေါ်မှာ လုပ်တဲ့ operations တချို့ (ဥပမာ — `DROP COLUMN`) က — cascade လုပ်တဲ့ constraint နဲ့ index ဖျက်ခြင်းတွေကို ဖြစ်စေနိုင်ပါတယ်။

- **EXCLUDE [ USING index_method ] ( exclude_element WITH operator [, ... ] ) index_parameters [ WHERE ( predicate ) ]** — `EXCLUDE` clause က exclusion constraint (ဖယ်ကြဉ် ကန့်သတ်ချက်) တစ်ခုကို သတ်မှတ်ပါတယ် — ဒါက — rows ဘယ်နှစ်ခုကိုမဆို — သတ်မှတ်ထားတဲ့ column(s) ဒါမှမဟုတ် expression(s) တွေပေါ်မှာ — သတ်မှတ်ထားတဲ့ operator(s) တွေနဲ့ နှိုင်းယှဉ်ကြည့်ရင် — ဒီ နှိုင်းယှဉ်ချက်တွေ အားလုံးက `TRUE` ပြန်လာမှာ မဟုတ်ဘူးလို့ အာမခံပါတယ်။ သတ်မှတ်ထားတဲ့ operators တွေ အားလုံးက equality အတွက် စစ်ဆေးတာတွေ ဆိုရင် — ဒါက `UNIQUE` constraint တစ်ခုနဲ့ ညီမျှပေမယ့် — သာမန် unique constraint တစ်ခုက ပိုမြန်ပါလိမ့်မယ်။ ဒါပေမယ့် — exclusion constraints တွေက ရိုးရှင်းတဲ့ equality ထက် ပိုပြီး ယေဘုယျကျတဲ့ constraints တွေကို သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — table ထဲမှာ rows နှစ်ခု ဘယ်နှစ်ခုမှ — ထပ်နေတဲ့ (overlapping) circles တွေ မပါဝင်စေတဲ့ constraint တစ်ခုကို — `&&` operator ကို သုံးပြီး သတ်မှတ်နိုင်ပါတယ် (Section 8.8 ကို ကြည့်ပါ)။ Operator(s) တွေက commutative (အစဉ်လှဲလို့ ရသော) ဖြစ်ရန် လိုအပ်ပါတယ်။

  Exclusion constraints တွေကို — constraint နဲ့ နာမည် တူညီတဲ့ index တစ်ခုကို သုံးပြီး အကောင်အထည်ဖော်ပါတယ် — ဒါကြောင့် — သတ်မှတ်ထားတဲ့ operator တစ်ခုချင်းစီက — index access method ဖြစ်တဲ့ index_method အတွက် — သင့်လျော်တဲ့ operator class တစ်ခုနဲ့ ဆက်စပ်နေရပါမယ် (Section 11.10 ကို ကြည့်ပါ)။ exclude_element တစ်ခုချင်းစီက index ရဲ့ column တစ်ခုကို သတ်မှတ်ပေးတာမို့ — collation တစ်ခု၊ operator class တစ်ခု၊ operator class parameters တွေနဲ့/သို့မဟုတ် ordering options တွေကို ရွေးချယ် သတ်မှတ်နိုင်ပါတယ်; ဒါတွေကို `CREATE INDEX` အောက်မှာ အပြည့်အစုံ ဖော်ပြထားပါတယ်။

  Access method က amgettuple ကို ထောက်ပံ့ပေးရပါမယ် (အခန်း 63 ကို ကြည့်ပါ); လောလောဆယ် ဒါက GIN ကို သုံးလို့ မရဘူးလို့ ဆိုလိုပါတယ်။ ခွင့်ပြုထားပေမယ့် — exclusion constraint တစ်ခုနဲ့အတူ B-tree ဒါမှမဟုတ် hash indexes တွေကို သုံးတာက အဓိပ္ပာယ် သိပ်မရှိပါဘူး — ဘာလို့လဲဆိုတော့ သာမန် unique constraint တစ်ခုက ပိုကောင်းအောင် မလုပ်နိုင်တဲ့ အလုပ်ကို သူတို့ မလုပ်ပေးလို့ပါ။ ဒါကြောင့် — လက်တွေ့မှာ access method က GiST ဒါမှမဟုတ် SP-GiST ပဲ ဖြစ်ပါလိမ့်မယ်။

  Predicate က — table ရဲ့ subset (အခွဲ) တစ်ခုအပေါ်မှာ exclusion constraint တစ်ခုကို သတ်မှတ်နိုင်စေပါတယ်; အတွင်းပိုင်းမှာတော့ ဒါက partial index တစ်ခုကို ဖန်တီးပေးပါတယ်။ Predicate ရဲ့ ပတ်လည်မှာ parentheses တွေ လိုအပ်တယ်ဆိုတာ သတိပြုပါ။

  အဆင့်ပေါင်းများစွာ (multi-level) partition hierarchy တစ်ခုအတွက် exclusion constraint တစ်ခု သတ်မှတ်တဲ့အခါ — target partitioned table ရဲ့ partition key ထဲက columns တွေ အားလုံး — သူ့ရဲ့ အောက်ဆင့် (descendant) partitioned tables တွေ အားလုံးရဲ့ partition key columns တွေပါ အပါအဝင် — constraint definition ထဲမှာ ပါဝင်ရပါမယ်။ ထို့ပြင် — အဲဒီ columns တွေကို equality operator ကို သုံးပြီး နှိုင်းယှဉ်ရပါမယ်။ ဒီ ကန့်သတ်ချက်တွေက — ပဋိပက္ခ ဖြစ်နိုင်ခြေ ရှိတဲ့ rows တွေ partition တစ်ခုတည်းထဲမှာ တည်ရှိမှာ ဖြစ်ကြောင်း သေချာစေပါတယ်။ Constraint က — partition key တစ်ခုခုရဲ့ အစိတ်အပိုင်း မဟုတ်တဲ့ — တခြား columns တွေကိုလည်း ရည်ညွှန်းနိုင်ပြီး — သင့်လျော်တဲ့ operator မည်သည့်ကိုမဆို သုံးပြီး နှိုင်းယှဉ်လို့ ရပါတယ်။

- **REFERENCES reftable [ ( refcolumn ) ] [ MATCH matchtype ] [ ON DELETE referential_action ] [ ON UPDATE referential_action ]** (column constraint) / **FOREIGN KEY ( column_name [, ... ] [, PERIOD column_name ] ) REFERENCES reftable [ ( refcolumn [, ... ] [, PERIOD refcolumn ] ) ] [ MATCH matchtype ] [ ON DELETE referential_action ] [ ON UPDATE referential_action ]** (table constraint) — ဒီ clauses တွေက foreign key constraint တစ်ခုကို သတ်မှတ်ပေးပါတယ် — ဒါက — table အသစ်ရဲ့ column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ columns တစ်စုထဲမှာ — referenced table ရဲ့ row တစ်ခုခုရဲ့ referenced column(s) တွေထဲက တန်ဖိုးတွေနဲ့ ကိုက်ညီတဲ့ တန်ဖိုးတွေပဲ ပါဝင်ရမယ်လို့ လိုအပ်ပါတယ်။ `refcolumn` list ကို ချန်လိုက်ရင် — `reftable` ရဲ့ primary key ကို သုံးပါတယ်။ မဟုတ်ရင် — `refcolumn` list က — non-deferrable unique ဒါမှမဟုတ် primary key constraint တစ်ခုရဲ့ columns တွေကို ရည်ညွှန်းရပါမယ် — ဒါမှမဟုတ် — non-partial unique index တစ်ခုရဲ့ columns တွေ ဖြစ်ရပါမယ်။

  နောက်ဆုံး column ကို `PERIOD` နဲ့ အမှတ်အသား လုပ်ထားရင် — အဲဒီ column ကို အထူး နည်းလမ်းနဲ့ ကိုင်တွယ်ပါတယ်။ non-PERIOD columns တွေကို equality နဲ့ နှိုင်းယှဉ်နေချိန်မှာ (သူတို့ထဲက အနည်းဆုံး တစ်ခု ရှိရမယ်) — PERIOD column ကိုတော့ ဒီလို နှိုင်းယှဉ်မှု မရှိပါဘူး။ အဲဒီအစား — referenced table မှာ — (key ရဲ့ non-PERIOD အစိတ်အပိုင်းတွေကို အခြေခံပြီး) ကိုက်ညီတဲ့ records တွေ ရှိပြီး — သူတို့ရဲ့ ပေါင်းစည်းထားတဲ့ PERIOD တန်ဖိုးတွေက referencing record ရဲ့ PERIOD ကို လုံးလုံး ဖုံးအုပ်ထားမယ်ဆိုရင် — constraint က ကျေနပ်ပြည့်စုံတယ်လို့ ယူဆပါတယ်။ တစ်နည်းပြောရရင် — reference က — သူ့ရဲ့ ကြာချိန် (duration) တစ်လျှောက်လုံးအတွက် referent (ကိုးကားခံ ရည်ညွှန်းခံ object) တစ်ခု ရှိရပါမယ်။ ဒီ column က range ဒါမှမဟုတ် multirange type တစ်ခု ဖြစ်ရပါမယ်။ ထို့ပြင် — referenced table မှာ `WITHOUT OVERLAPS` နဲ့ ကြေညာထားတဲ့ primary key ဒါမှမဟုတ် unique constraint တစ်ခု ရှိရပါမယ်။ နောက်ဆုံးအနေနဲ့ — foreign key မှာ `PERIOD` column_name specification တစ်ခု ပါဝင်နေရင် — သက်ဆိုင်တဲ့ refcolumn က — ရှိခဲ့ရင် — `PERIOD` နဲ့လည်း အမှတ်အသား လုပ်ထားရပါမယ်။ `refcolumn` clause ကို ချန်လိုက်လို့ — ဒါကြောင့် `reftable` ရဲ့ primary key constraint ကို ရွေးချယ်လိုက်တာ ဖြစ်ရင် — primary key ရဲ့ နောက်ဆုံး column က `WITHOUT OVERLAPS` နဲ့ အမှတ်အသား လုပ်ထားရပါမယ်။

  Referencing နဲ့ referenced column တွဲတစ်ခုချင်းစီအတွက် — သူတို့က collatable data type တစ်ခုရဲ့ အမျိုးအစား ဖြစ်နေရင် — collations တွေက နှစ်ခုလုံး deterministic ဖြစ်ရမယ် ဒါမှမဟုတ် နှစ်ခုလုံး တူညီနေရပါမယ်။ ဒါက columns နှစ်ခုလုံးမှာ တစ်သမတ်တည်း ဖြစ်တဲ့ equality အယူအဆတစ်ခု ရှိကြောင်း သေချာစေပါတယ်။

  User က referenced table ပေါ်မှာ `REFERENCES` permission ရှိရပါမယ် (table တစ်ခုလုံးပေါ်မှာ ဖြစ်စေ — သတ်မှတ်ထားတဲ့ referenced columns တွေပေါ်မှာ ဖြစ်စေ)။ Foreign key constraint တစ်ခု ထပ်ပေါင်းတာက referenced table ပေါ်မှာ `SHARE ROW EXCLUSIVE` lock တစ်ခု လိုအပ်ပါတယ်။ Foreign key constraints တွေကို temporary tables တွေနဲ့ permanent tables တွေကြားမှာ သတ်မှတ်လို့ မရဘူးဆိုတာ သတိပြုပါ။

  Referencing column(s) တွေထဲကို insert လုပ်လိုက်တဲ့ တန်ဖိုးတစ်ခုကို — ပေးထားတဲ့ match type ကို သုံးပြီး — referenced table နဲ့ referenced columns တွေရဲ့ တန်ဖိုးတွေနဲ့ ယှဉ်တွဲ စစ်ဆေးပါတယ်။ Match types သုံးမျိုး ရှိပါတယ်: `MATCH FULL`, `MATCH PARTIAL` နဲ့ `MATCH SIMPLE` (ဒါက default ဖြစ်ပါတယ်)။ `MATCH FULL` က — multicolumn foreign key တစ်ခုရဲ့ column တစ်ခုကို — foreign key columns တွေ အားလုံး null ဖြစ်နေမှသာ လွဲလို့ — null ဖြစ်ခွင့် မပြုပါဘူး; သူတို့ အားလုံး null ဖြစ်နေရင် — row က referenced table ထဲမှာ match တစ်ခု ရှိဖို့ မလိုအပ်ပါဘူး။ `MATCH SIMPLE` က foreign key columns တွေထဲက ဘယ်ဟာမဆို null ဖြစ်ခွင့် ပြုပါတယ်; သူတို့ထဲက တစ်ခုခု null ဖြစ်နေရင် — row က referenced table ထဲမှာ match တစ်ခု ရှိဖို့ မလိုအပ်ပါဘူး။ `MATCH PARTIAL` ကတော့ အခုထိ အကောင်အထည် မဖော်ရသေးပါဘူး။ (ဟုတ်ပါတယ် — ဒီလို အခြေအနေတွေ မဖြစ်ပေါ်အောင် referencing column(s) တွေပေါ်မှာ `NOT NULL` constraints တွေ သုံးထားနိုင်ပါတယ်။)

  ထို့ပြင် — referenced columns တွေထဲက data တွေကို ပြောင်းလဲတဲ့အခါ — ဒီ table ရဲ့ columns တွေထဲက data တွေပေါ်မှာ — လုပ်ဆောင်ချက် (action) တချို့ကို လုပ်ဆောင်ပါတယ်။ `ON DELETE` clause က — referenced table ထဲက referenced row တစ်ခုကို ဖျက်တော့မယ့်အခါ လုပ်ဆောင်ရမယ့် action ကို သတ်မှတ်ပါတယ်။ အလားတူပဲ — `ON UPDATE` clause က — referenced table ထဲက referenced column တစ်ခုကို တန်ဖိုးအသစ်တစ်ခုဆီ update လုပ်တော့မယ့်အခါ လုပ်ဆောင်ရမယ့် action ကို သတ်မှတ်ပါတယ်။ Row ကို update လုပ်ပေမယ့် — referenced column ကို တကယ် မပြောင်းလဲဘူးဆိုရင် — ဘာ action မှ မလုပ်ပါဘူး။ Referential actions တွေကို — constraint က deferred ဖြစ်နေရင်တောင် — data ကို ပြောင်းလဲနေတဲ့ command ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — execute လုပ်ပါတယ်။ Clause တစ်ခုချင်းစီအတွက် ဖြစ်နိုင်တဲ့ actions တွေကတော့:

    - **NO ACTION** — Delete ဒါမှမဟုတ် update က foreign key constraint violation (စည်းမျဉ်း ချိုးဖောက်မှု) တစ်ခုကို ဖန်တီးမိမယ်ဆိုရင် — error တစ်ခု ထုတ်ပေးပါတယ်။ Constraint က deferred ဖြစ်နေရင် — ဒီ error ကို — constraint check လုပ်တဲ့ အချိန်မှာ — referencing rows တွေ ရှိနေသေးရင် — ထုတ်ပေးပါလိမ့်မယ်။ ဒါက default action ဖြစ်ပါတယ်။

    - **RESTRICT** — Delete ဒါမှမဟုတ် update လုပ်ရမယ့် row တစ်ခုက referencing table ထဲက row တစ်ခုနဲ့ ကိုက်ညီနေရင် — error တစ်ခု ထုတ်ပေးပါတယ်။ ဒါက — action ပြီးတဲ့ နောက် အခြေအနေက foreign key constraint ကို မချိုးဖောက်ဘူးဆိုရင်တောင် — အဲဒီ action ကို တားဆီးပါတယ်။ အထူးသဖြင့် — referenced rows တွေကို — ကွဲပြားပေမယ့် compare လုပ်တဲ့အခါ တူညီတယ်လို့ ယူဆရတဲ့ (distinct but compare as equal) တန်ဖိုးတွေဆီ update လုပ်တာကို တားဆီးပါတယ်။ (ဒါပေမယ့် — column တစ်ခုကို တန်ဖိုး တူညီတဲ့ နေရာကိုပဲ update လုပ်တဲ့ "no-op" updates တွေကိုတော့ မတားဆီးပါဘူး။)

      Temporal foreign key တစ်ခုမှာတော့ ဒီ option ကို ထောက်ပံ့မပေးပါဘူး။

    - **CASCADE** — Delete လုပ်လိုက်တဲ့ row ကို ရည်ညွှန်းနေတဲ့ rows တွေ အားလုံးကို ဖျက်ပစ်တာ ဒါမှမဟုတ် — referencing column(s) တွေရဲ့ တန်ဖိုးတွေကို referenced columns တွေရဲ့ တန်ဖိုးအသစ်တွေဆီ update လုပ်တာ — အသီးသီး လုပ်ဆောင်ပါတယ်။

      Temporal foreign key တစ်ခုမှာတော့ ဒီ option ကို ထောက်ပံ့မပေးပါဘူး။

    - **SET NULL [ ( column_name [, ... ] ) ]** — Referencing columns တွေ အားလုံး ဒါမှမဟုတ် — သတ်မှတ်ထားတဲ့ referencing columns အစုခွဲ (subset) တစ်ခုကို null လို့ သတ်မှတ်ပါတယ်။ Column တွေရဲ့ အစုခွဲတစ်ခုကို `ON DELETE` actions တွေအတွက်မှသာ သတ်မှတ်လို့ ရပါတယ်။

      Temporal foreign key တစ်ခုမှာတော့ ဒီ option ကို ထောက်ပံ့မပေးပါဘူး။

    - **SET DEFAULT [ ( column_name [, ... ] ) ]** — Referencing columns တွေ အားလုံး ဒါမှမဟုတ် — သတ်မှတ်ထားတဲ့ referencing columns အစုခွဲတစ်ခုကို သူတို့ရဲ့ default values တွေဆီ သတ်မှတ်ပါတယ်။ Column တွေရဲ့ အစုခွဲတစ်ခုကို `ON DELETE` actions တွေအတွက်မှသာ သတ်မှတ်လို့ ရပါတယ်။ (Default values တွေက null မဟုတ်ဘူးဆိုရင် — သူတို့နဲ့ ကိုက်ညီတဲ့ row တစ်ခုက referenced table ထဲမှာ ရှိရပါမယ် — မဟုတ်ရင် operation က မအောင်မြင်ပါဘူး။)

      Temporal foreign key တစ်ခုမှာတော့ ဒီ option ကို ထောက်ပံ့မပေးပါဘူး။

  Referenced column(s) တွေကို မကြာခဏ ပြောင်းလဲနေတယ်ဆိုရင် — foreign key constraint နဲ့ ဆက်စပ်နေတဲ့ referential actions တွေကို ပိုပြီး ထိရောက်စွာ လုပ်ဆောင်နိုင်ဖို့ — referencing column(s) တွေပေါ်မှာ index တစ်ခု ထပ်ပေါင်းတာက ပညာရှိရာရောက်ပါတယ်။

- **DEFERRABLE** / **NOT DEFERRABLE** — ဒါက constraint ကို ရွှေ့ဆိုင်း (defer) လို့ ရလား မရဘူးလားဆိုတာ ထိန်းချုပ်ပါတယ်။ Deferrable မဟုတ်တဲ့ constraint တစ်ခုကို command တိုင်း ပြီးတာနဲ့ ချက်ချင်း စစ်ဆေးပါတယ်။ Deferrable ဖြစ်တဲ့ constraints တွေရဲ့ စစ်ဆေးမှုကိုတော့ — transaction ရဲ့ အဆုံးအထိ ရွှေ့ဆိုင်းထားလို့ ရပါတယ် (`SET CONSTRAINTS` command ကို သုံးပြီး)။ `NOT DEFERRABLE` က default ဖြစ်ပါတယ်။ လောလောဆယ် — `UNIQUE`, `PRIMARY KEY`, `EXCLUDE` နဲ့ `REFERENCES` (foreign key) constraints တွေကပဲ ဒီ clause ကို လက်ခံပါတယ်။ `NOT NULL` နဲ့ `CHECK` constraints တွေကတော့ deferrable မလုပ်နိုင်ပါဘူး။ Deferrable constraints တွေကို `ON CONFLICT` clause တစ်ခု ပါဝင်တဲ့ `INSERT` statement တစ်ခုထဲမှာ conflict arbiter (ပဋိပက္ခ စီရင်ဆုံးဖြတ်ရန် သုံးသော) အဖြစ် သုံးလို့ မရဘူးဆိုတာ သတိပြုပါ။

- **INITIALLY IMMEDIATE** / **INITIALLY DEFERRED** — Constraint တစ်ခု deferrable ဖြစ်နေရင် — ဒီ clause က constraint ကို စစ်ဆေးရမယ့် default အချိန်ကို သတ်မှတ်ပါတယ်။ Constraint က `INITIALLY IMMEDIATE` ဖြစ်နေရင် — statement တစ်ခုစီ ပြီးတိုင်း စစ်ဆေးပါတယ်။ ဒါက default ဖြစ်ပါတယ်။ Constraint က `INITIALLY DEFERRED` ဖြစ်နေရင် — transaction ရဲ့ အဆုံးမှာသာ စစ်ဆေးပါတယ်။ Constraint ရဲ့ စစ်ဆေးချိန်ကို `SET CONSTRAINTS` command နဲ့ ပြောင်းလဲလို့ ရပါတယ်။

- **ENFORCED** / **NOT ENFORCED** — Constraint က `ENFORCED` ဖြစ်နေရင် — database system က — သင့်လျော်တဲ့ အချိန်တွေမှာ (statement တစ်ခုစီ ပြီးတိုင်း ဒါမှမဟုတ် — သင့်လျော်သလို — transaction ရဲ့ အဆုံးမှာ) constraint ကို စစ်ဆေးပြီး — constraint ကျေနပ်ပြည့်စုံကြောင်း သေချာစေပါတယ်။ ဒါက default ဖြစ်ပါတယ်။ Constraint က `NOT ENFORCED` ဖြစ်နေရင် — database system က constraint ကို မစစ်ဆေးပါဘူး။ အဲဒီအခါ — constraints တွေ ကျေနပ်ပြည့်စုံကြောင်း သေချာစေဖို့က application code အပေါ်မှာ မူတည်ပါတယ်။ Database system က — result ရဲ့ မှန်ကန်မှုကို မထိခိုက်စေတဲ့ — optimization ဆုံးဖြတ်ချက်တွေအတွက်တော့ — data တွေက constraint ကို တကယ် ကျေနပ်ပြည့်စုံနေတယ်လို့ ယူဆထားနိုင်ပါသေးတယ်။

  Run time မှာ constraint ကို တကယ် စစ်ဆေးတာက အရမ်း ကုန်ကျစရိတ် ကြီးနေတဲ့အခါ — `NOT ENFORCED` constraints တွေက documentation (မှတ်တမ်း) အနေနဲ့ အသုံးဝင်နိုင်ပါတယ်။

  ဒါကို လောလောဆယ် foreign key နဲ့ `CHECK` constraints တွေအတွက်သာ ထောက်ပံ့ပါတယ်။

- **USING method** — ဒီ optional clause က — table အသစ်ရဲ့ အကြောင်းအရာတွေကို သိမ်းဆည်းဖို့ သုံးရမယ့် — table access method ကို သတ်မှတ်ပါတယ်; method က `TABLE` type ရဲ့ access method တစ်ခု ဖြစ်ရပါမယ်။ နောက်ထပ် အချက်အလက်အတွက် အခန်း 62 ကို ကြည့်ပါ။ ဒီ option ကို မသတ်မှတ်ထားဘူးဆိုရင် — table အသစ်အတွက် default table access method ကို ရွေးချယ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် default_table_access_method ကို ကြည့်ပါ။

  Partition တစ်ခု ဖန်တီးတဲ့အခါ — table access method က — သတ်မှတ်ထားရင် — သူ့ရဲ့ partitioned table ရဲ့ access method ဖြစ်ပါတယ်။

- **WITH ( storage_parameter [= value] [, ... ] )** — ဒီ clause က table ဒါမှမဟုတ် index တစ်ခုအတွက် optional storage parameters တွေကို သတ်မှတ်ပါတယ်; နောက်ထပ် အချက်အလက်အတွက် အောက်က Storage Parameters ကို ကြည့်ပါ။ နောက်ပြန် လိုက်ဖက်ညီမှု (backward-compatibility) အတွက် — table တစ်ခုရဲ့ `WITH` clause ထဲမှာ — table အသစ်ရဲ့ rows တွေမှာ OIDs (object identifiers) တွေ မပါဝင်စေဖို့ သတ်မှတ်တဲ့ — `OIDS=FALSE` ကိုလည်း ထည့်သွင်းနိုင်ပါတယ် — `OIDS=TRUE` ကတော့ အခု ထောက်ပံ့မပေးတော့ပါဘူး။

- **WITHOUT OIDS** — ဒါက — table တစ်ခုကို `WITHOUT OIDS` အဖြစ် ကြေညာဖို့အတွက် — နောက်ပြန် လိုက်ဖက်ညီတဲ့ syntax တစ်ခု ဖြစ်ပါတယ် — `WITH OIDS` နဲ့ table တစ်ခု ဖန်တီးတာကတော့ အခု ထောက်ပံ့မပေးတော့ပါဘူး။

- **ON COMMIT** — Transaction block တစ်ခုရဲ့ အဆုံးမှာ temporary tables တွေရဲ့ အပြုအမူကို `ON COMMIT` နဲ့ ထိန်းချုပ်နိုင်ပါတယ်။ Options သုံးခု ရှိပါတယ်:

    - **PRESERVE ROWS** — Transactions တွေရဲ့ အဆုံးတွေမှာ အထူး လုပ်ဆောင်ချက် ဘာမှ မလုပ်ပါဘူး။ ဒါက default အပြုအမူ ဖြစ်ပါတယ်။

    - **DELETE ROWS** — Transaction block တစ်ခုစီရဲ့ အဆုံးမှာ — temporary table ထဲက rows တွေ အားလုံးကို ဖျက်ပါလိမ့်မယ်။ အခြေခံအားဖြင့် — commit တစ်ခုစီမှာ — အလိုအလျောက် `TRUNCATE` တစ်ခု လုပ်ဆောင်တာ ဖြစ်ပါတယ်။ Partitioned table တစ်ခုပေါ်မှာ သုံးတဲ့အခါ — ဒါက သူ့ရဲ့ partitions တွေဆီ cascade မလုပ်ပါဘူး။

    - **DROP** — Temporary table ကို — လက်ရှိ transaction block ရဲ့ အဆုံးမှာ drop လုပ်ပါလိမ့်မယ်။ Partitioned table တစ်ခုပေါ်မှာ သုံးတဲ့အခါ — ဒီ action က သူ့ရဲ့ partitions တွေကို drop လုပ်ပြီး — inheritance children တွေ ရှိတဲ့ tables တွေပေါ်မှာ သုံးတဲ့အခါ — မှီခိုနေတဲ့ (dependent) children တွေကို drop လုပ်ပါတယ်။

- **TABLESPACE tablespace_name** — tablespace_name က — table အသစ်ကို ဖန်တီးရမယ့် — tablespace ရဲ့ နာမည် ဖြစ်ပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — default_tablespace ကို တိုင်ပင်ပါတယ် — ဒါမှမဟုတ် — table က temporary ဖြစ်နေရင် — temp_tablespaces ကို တိုင်ပင်ပါတယ်။ Partitioned tables တွေအတွက် — table ကိုယ်တိုင်အတွက် storage မလိုအပ်တာမို့ — သတ်မှတ်ထားတဲ့ tablespace က — တခြား tablespace တစ်ခုကို အတိအကျ သတ်မှတ်မထားတဲ့အခါ — အသစ် ဖန်တီးတဲ့ partitions တွေအတွက် သုံးရမယ့် default tablespace အဖြစ် — default_tablespace ကို ကျော်လွန် (override) လုပ်ပါတယ်။

- **USING INDEX TABLESPACE tablespace_name** — ဒီ clause က — `UNIQUE`, `PRIMARY KEY` ဒါမှမဟုတ် `EXCLUDE` constraint တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ index ကို ဖန်တီးမယ့် — tablespace ကို ရွေးချယ်ခွင့် ပေးပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — default_tablespace ကို တိုင်ပင်ပါတယ် — ဒါမှမဟုတ် — table က temporary ဖြစ်နေရင် — temp_tablespaces ကို တိုင်ပင်ပါတယ်။

### Storage Parameters (storage parameters များ)

`WITH` clause က — tables တွေအတွက်ရော — `UNIQUE`, `PRIMARY KEY` သို့မဟုတ် `EXCLUDE` constraint တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ indexes တွေအတွက်ပါ — *storage parameters* (သိုလှောင် parameter များ) တွေကို သတ်မှတ်နိုင်ပါတယ်။ Indexes တွေအတွက် storage parameters တွေကို [CREATE INDEX](/docs/postgresql/sql-createindex) မှာ မှတ်တမ်းတင်ထားပါတယ်။ လောလောဆယ် tables တွေအတွက် ရနိုင်တဲ့ storage parameters တွေကို အောက်မှာ ဖော်ပြထားပါတယ်။ ဒီ parameters တွေ အများအပြားအတွက် — ပြထားသလိုပဲ — နာမည်တူပြီး `toast.` ရှေ့ဆက်စာလုံး (prefix) ပါတဲ့ — နောက်ထပ် parameter တစ်ခုလည်း ရှိပြီး — အဲဒါက — ရှိရင် — table ရဲ့ secondary TOAST table ရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ် (TOAST အကြောင်း နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 66.2](https://www.postgresql.org/docs/current/storage-toast.html) ကို ကြည့်ပါ)။ Table parameter တစ်ခုရဲ့ တန်ဖိုးကို သတ်မှတ်ထားပြီး — ညီမျှတဲ့ `toast.` parameter ကို မသတ်မှတ်ထားဘူးဆိုရင် — TOAST table က table ရဲ့ parameter တန်ဖိုးကို သုံးပါလိမ့်မယ်။ Partitioned tables တွေအတွက်တော့ ဒီ parameters တွေကို သတ်မှတ်တာကို ထောက်ပံ့မပေးပေမယ့် — leaf partition (အနိမ့်ဆုံး အဆင့် partition) တစ်ခုချင်းစီအတွက်တော့ သတ်မှတ်လို့ ရပါတယ်။

- **fillfactor (integer)** — Table တစ်ခုအတွက် fillfactor က 10 ကနေ 100 ကြားက ရာခိုင်နှုန်း (percentage) တစ်ခု ဖြစ်ပါတယ်။ 100 (လုံးဝ ပြည့်အောင် ထုပ်ပိုးခြင်း) က default ဖြစ်ပါတယ်။ Fillfactor ကို ပိုငယ်တဲ့ တန်ဖိုးတစ်ခု သတ်မှတ်ထားတဲ့အခါ — `INSERT` operations တွေက table pages တွေကို သတ်မှတ်ထားတဲ့ ရာခိုင်နှုန်းအတိုင်းပဲ ဖြည့်တာမို့ — page တစ်ခုချင်းစီမှာ ကျန်နေတဲ့ နေရာကို အဲဒီ page ပေါ်က rows တွေကို update လုပ်ဖို့ သီးသန့် ထားပါတယ်။ ဒါက `UPDATE` ကို — row တစ်ခုရဲ့ update လုပ်ထားတဲ့ copy ကို မူရင်း ရှိနေတဲ့ page ပေါ်မှာပဲ ထားနိုင်ခွင့် ပေးပြီး — page တစ်ခုခုကို ပြောင်းထားတာထက် ပိုပြီး ထိရောက်ကာ — heap-only tuple updates တွေ ဖြစ်နိုင်ခြေကိုလည်း မြင့်မားစေပါတယ်။ Entries တွေ ဘယ်တော့မှ update မလုပ်တဲ့ table တစ်ခုအတွက်တော့ — လုံးဝ ပြည့်အောင် ထုပ်ပိုးတာက အကောင်းဆုံး ရွေးချယ်မှု ဖြစ်ပေမယ့် — update များတဲ့ (heavily updated) tables တွေမှာတော့ — fillfactor ပိုငယ်တာတွေက သင့်လျော်ပါတယ်။ ဒီ parameter ကို TOAST tables တွေအတွက် သတ်မှတ်လို့ မရပါဘူး။

- **toast_tuple_target (integer)** — toast_tuple_target က — column တန်ဖိုး ရှည်ကြီးတွေကို TOAST tables တွေထဲကို compress လုပ်ဖို့ ဒါမှမဟုတ် ရွှေ့ဖို့ မကြိုးစားခင် — လိုအပ်တဲ့ — အနည်းဆုံး tuple length ကို သတ်မှတ်ပေးပြီး — toasting စတင်ပြီးတာနဲ့ — length ကို ဘယ်အောက်ထိ လျှော့ချဖို့ ကြိုးစားမလဲဆိုတဲ့ — target length လည်း ဖြစ်ပါတယ်။ ဒါက External (ရွှေ့ရန်)၊ Main (compress လုပ်ရန်) ဒါမှမဟုတ် Extended (နှစ်ခုလုံးအတွက်) လို့ အမှတ်အသား လုပ်ထားတဲ့ columns တွေကို သက်ရောက်ပြီး — tuples အသစ်တွေကိုပဲ သက်ရောက်ပါတယ်။ ရှိပြီးသား rows တွေအပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။ Default အနေနဲ့ — ဒီ parameter ကို — block တစ်ခုမှာ tuples အနည်းဆုံး 4 ခု ဝင်အောင် သတ်မှတ်ထားပြီး — default block size နဲ့ဆိုရင် — အဲဒါက 2040 bytes ဖြစ်ပါတယ်။ တရားဝင် တန်ဖိုးတွေက 128 bytes ကနေ (block size − header) အထိ ဖြစ်ပြီး — default အနေနဲ့ 8160 bytes ဖြစ်ပါတယ်။ ဒီ တန်ဖိုးကို ပြောင်းလဲတာက အရမ်း တို ဒါမှမဟုတ် အရမ်း ရှည်တဲ့ rows တွေအတွက် အသုံးမဝင်နိုင်ပါဘူး။ Default setting က မကြာခဏဆိုသလို optimal နဲ့ နီးစပ်နေပြီး — ဒီ parameter ကို သတ်မှတ်တာက အခြေအနေ တချို့မှာ ဆိုးကျိုး သက်ရောက်မှုတွေ ရှိနိုင်တယ်ဆိုတာ သတိပြုပါ။ ဒီ parameter ကို TOAST tables တွေအတွက် သတ်မှတ်လို့ မရပါဘူး။

- **parallel_workers (integer)** — ဒါက — ဒီ table ရဲ့ parallel scan တစ်ခုကို ကူညီဖို့ သုံးသင့်တဲ့ — workers အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — system က relation ရဲ့ size ကို အခြေခံပြီး တန်ဖိုးတစ်ခုကို ဆုံးဖြတ်ပါလိမ့်မယ်။ Planner ဒါမှမဟုတ် parallel scans တွေ သုံးတဲ့ utility statements တွေက ရွေးချယ်တဲ့ workers အရေအတွက် အမှန်ကတော့ — ဥပမာ — max_worker_processes ရဲ့ setting ကြောင့် — ပိုငယ်နိုင်ပါတယ်။

- **autovacuum_enabled, toast.autovacuum_enabled (boolean)** — Table တစ်ခုအတွက် autovacuum daemon ကို ဖွင့် ဒါမှမဟုတ် ပိတ်ပေးပါတယ်။ True ဖြစ်နေရင် — autovacuum daemon က — Section 24.1.6 မှာ ဆွေးနွေးထားတဲ့ စည်းမျဉ်းတွေအတိုင်း — ဒီ table ပေါ်မှာ အလိုအလျောက် `VACUUM` နဲ့/သို့မဟုတ် `ANALYZE` operations တွေကို လုပ်ဆောင်ပါလိမ့်မယ်။ False ဖြစ်နေရင် — transaction ID wraparound (transaction ID ပြန်ရစ်ခြင်း) ကို ကာကွယ်ဖို့ ကလွဲလို့ — ဒီ table ကို autovacuum လုပ်မှာ မဟုတ်ပါဘူး။ Wraparound ကာကွယ်ရေးအကြောင်း နောက်ထပ်အတွက် Section 24.1.5 ကို ကြည့်ပါ။ Autovacuum parameter က false ဖြစ်နေရင် — autovacuum daemon က (transaction ID wraparound ကို ကာကွယ်ဖို့ ကလွဲလို့) လုံးဝ run မလုပ်ဘူးဆိုတာ သတိပြုပါ; table တစ်ခုချင်းစီရဲ့ storage parameters တွေကို သတ်မှတ်တာက အဲဒါကို ကျော်လွန်လို့ မရပါဘူး။ ဒါကြောင့် — ဒီ storage parameter ကို true လို့ အတိအကျ သတ်မှတ်တာထက် — false လို့ပဲ သတ်မှတ်တာက ပိုပြီး အဓိပ္ပာယ် ရှိခဲတတ်ပါတယ်။

- **vacuum_index_cleanup, toast.vacuum_index_cleanup (enum)** — ဒီ table ပေါ်မှာ `VACUUM` run တဲ့အခါ — index cleanup ကို အတင်းအကျပ် လုပ်ဆောင်တာ ဒါမှမဟုတ် ပိတ်ပေးပါတယ်။ Default တန်ဖိုးက AUTO ဖြစ်ပါတယ်။ OFF နဲ့ဆိုရင် index cleanup ကို ပိတ်ထားပြီး — ON နဲ့ဆိုရင် ဖွင့်ထားပါတယ် — AUTO နဲ့ဆိုရင်တော့ — `VACUUM` run တိုင်း — ဆုံးဖြတ်ချက်ကို ပြောင်းလဲနေတဲ့ (dynamic) ပုံစံနဲ့ ချပါတယ်။ Dynamic အပြုအမူက — dead tuples အရမ်း နည်းတာတွေကို ဖယ်ရှားဖို့ — indexes တွေကို မလိုအပ်ဘဲ scan လုပ်တာကို `VACUUM` ရှောင်နိုင်စေပါတယ်။ Index cleanup အားလုံးကို အတင်းအကျပ် ပိတ်ထားတာက `VACUUM` ကို သိသိသာသာ ပိုမြန်စေနိုင်ပေမယ့် — table modifications တွေ မကြာခဏ ဆိုရင် — indexes တွေကို ပြင်းထန်စွာ ဖောင်းပွ (bloated) စေနိုင်ပါတယ်။ `VACUUM` ရဲ့ `INDEX_CLEANUP` parameter က — သတ်မှတ်ထားရင် — ဒီ option ရဲ့ တန်ဖိုးကို ကျော်လွန် (override) လုပ်ပါတယ်။

- **vacuum_truncate, toast.vacuum_truncate (boolean)** — vacuum_truncate parameter အတွက် per-table တန်ဖိုး။ `VACUUM` ရဲ့ `TRUNCATE` parameter က — သတ်မှတ်ထားရင် — ဒီ option ရဲ့ တန်ဖိုးကို ကျော်လွန် (override) လုပ်ပါတယ်။

- **autovacuum_vacuum_threshold, toast.autovacuum_vacuum_threshold (integer)** — autovacuum_vacuum_threshold parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_vacuum_max_threshold, toast.autovacuum_vacuum_max_threshold (integer)** — autovacuum_vacuum_max_threshold parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_vacuum_scale_factor, toast.autovacuum_vacuum_scale_factor (floating point)** — autovacuum_vacuum_scale_factor parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_vacuum_insert_threshold, toast.autovacuum_vacuum_insert_threshold (integer)** — autovacuum_vacuum_insert_threshold parameter အတွက် per-table တန်ဖိုး။ အထူး တန်ဖိုးဖြစ်တဲ့ −1 ကို — table ပေါ်မှာ insert vacuums တွေကို ပိတ်ဖို့ သုံးနိုင်ပါတယ်။

- **autovacuum_vacuum_insert_scale_factor, toast.autovacuum_vacuum_insert_scale_factor (floating point)** — autovacuum_vacuum_insert_scale_factor parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_analyze_threshold (integer)** — autovacuum_analyze_threshold parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_analyze_scale_factor (floating point)** — autovacuum_analyze_scale_factor parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_vacuum_cost_delay, toast.autovacuum_vacuum_cost_delay (floating point)** — autovacuum_vacuum_cost_delay parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_vacuum_cost_limit, toast.autovacuum_vacuum_cost_limit (integer)** — autovacuum_vacuum_cost_limit parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_freeze_min_age, toast.autovacuum_freeze_min_age (integer)** — vacuum_freeze_min_age parameter အတွက် per-table တန်ဖိုး။ Autovacuum က — system-wide ဖြစ်တဲ့ autovacuum_freeze_max_age setting ရဲ့ တစ်ဝက်ထက် ပိုကြီးတဲ့ — per-table autovacuum_freeze_min_age parameters တွေကို လျစ်လျူရှုမယ်ဆိုတာ သတိပြုပါ။

- **autovacuum_freeze_max_age, toast.autovacuum_freeze_max_age (integer)** — autovacuum_freeze_max_age parameter အတွက် per-table တန်ဖိုး။ Autovacuum က — system-wide setting ထက် ပိုကြီးတဲ့ — per-table autovacuum_freeze_max_age parameters တွေကို လျစ်လျူရှုမယ်ဆိုတာ သတိပြုပါ (အဲဒါကို ပိုငယ်အောင်ပဲ သတ်မှတ်လို့ ရပါတယ်)။

- **autovacuum_freeze_table_age, toast.autovacuum_freeze_table_age (integer)** — vacuum_freeze_table_age parameter အတွက် per-table တန်ဖိုး။

- **autovacuum_multixact_freeze_min_age, toast.autovacuum_multixact_freeze_min_age (integer)** — vacuum_multixact_freeze_min_age parameter အတွက် per-table တန်ဖိုး။ Autovacuum က — system-wide ဖြစ်တဲ့ autovacuum_multixact_freeze_max_age setting ရဲ့ တစ်ဝက်ထက် ပိုကြီးတဲ့ — per-table autovacuum_multixact_freeze_min_age parameters တွေကို လျစ်လျူရှုမယ်ဆိုတာ သတိပြုပါ။

- **autovacuum_multixact_freeze_max_age, toast.autovacuum_multixact_freeze_max_age (integer)** — autovacuum_multixact_freeze_max_age parameter အတွက် per-table တန်ဖိုး။ Autovacuum က — system-wide setting ထက် ပိုကြီးတဲ့ — per-table autovacuum_multixact_freeze_max_age parameters တွေကို လျစ်လျူရှုမယ်ဆိုတာ သတိပြုပါ (အဲဒါကို ပိုငယ်အောင်ပဲ သတ်မှတ်လို့ ရပါတယ်)။

- **autovacuum_multixact_freeze_table_age, toast.autovacuum_multixact_freeze_table_age (integer)** — vacuum_multixact_freeze_table_age parameter အတွက် per-table တန်ဖိုး။

- **log_autovacuum_min_duration, toast.log_autovacuum_min_duration (integer)** — log_autovacuum_min_duration parameter အတွက် per-table တန်ဖိုး။

- **vacuum_max_eager_freeze_failure_rate, toast.vacuum_max_eager_freeze_failure_rate (floating point)** — vacuum_max_eager_freeze_failure_rate parameter အတွက် per-table တန်ဖိုး။

- **user_catalog_table (boolean)** — Table ကို — logical replication ရည်ရွယ်ချက်တွေအတွက် — ထပ်ဆောင်း catalog table တစ်ခုအဖြစ် ကြေညာပါတယ်။ အသေးစိတ်အတွက် Section 47.6.2 ကို ကြည့်ပါ။ ဒီ parameter ကို TOAST tables တွေအတွက် သတ်မှတ်လို့ မရပါဘူး။

## Notes (မှတ်စုများ)

PostgreSQL က — uniqueness ကို အတင်းအကျပ် သေချာစေရန် — unique constraint တစ်ခုချင်းစီနဲ့ primary key constraint တစ်ခုချင်းစီအတွက် — index တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ ဒါကြောင့် — primary key columns တွေအတွက် — index တစ်ခုကို သီးသန့် ထင်ထင်ရှားရှား ဖန်တီးဖို့ — မလိုအပ်ပါဘူး။ (ပိုမို သိရှိလိုပါက [CREATE INDEX](/docs/postgresql/sql-createindex) ကို ကြည့်ပါ။)

လက်ရှိ implementation မှာတော့ — unique constraints တွေနဲ့ primary keys တွေကို — အမွေဆက်ခံခြင်း မရှိပါဘူး။ ဒါကြောင့် — inheritance နဲ့ unique constraints တွေ ပေါင်းစပ်မှုက — ပုံပျက် (dysfunctional) ဖြစ်စေပါတယ်။

Table တစ်ခုမှာ column 1600 ခုထက် ပိုပြီး မထားရှိနိုင်ပါဘူး။ (လက်တွေ့မှာတော့ — tuple-length (row တစ်ကြောင်း၏ သတ်မှတ် အရှည်) ကန့်သတ်ချက်တွေကြောင့် — ထိရောက်သော ကန့်သတ်ချက်က — ပုံမှန်အားဖြင့် — ဒီထက် ပိုနည်းပါတယ်။)

## Examples (ဥပမာများ)

`films` table နဲ့ `distributors` table တွေကို ဖန်တီးဖို့:

```sql
CREATE TABLE films (
    code        char(5) CONSTRAINT firstkey PRIMARY KEY,
    title       varchar(40) NOT NULL,
    did         integer NOT NULL,
    date_prod   date,
    kind        varchar(10),
    len         interval hour to minute
);

CREATE TABLE distributors (
     did    integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
     name   varchar(40) NOT NULL CHECK (name <> '')
);
```

အတိုင်းအတာ နှစ်ခု (2-dimensional) ပါတဲ့ array ရှိတဲ့ table တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE array_int (
    vector  int[][]
);
```

`films` table အတွက် unique table constraint တစ်ခု သတ်မှတ်ဖို့: Unique table constraints တွေကို — table ရဲ့ column တစ်ခုတည်း ဒါမှမဟုတ် — column တစ်ခုထက်ပိုသော columns တွေပေါ်မှာ — သတ်မှတ်နိုင်ပါတယ်:

```sql
CREATE TABLE films (
    code        char(5),
    title       varchar(40),
    did         integer,
    date_prod   date,
    kind        varchar(10),
    len         interval hour to minute,
    CONSTRAINT production UNIQUE(date_prod)
);
```

Column constraint အနေနဲ့ check constraint တစ်ခု သတ်မှတ်ဖို့:

```sql
CREATE TABLE distributors (
    did     integer CHECK (did > 100),
    name    varchar(40)
);
```

Table constraint အနေနဲ့ check constraint တစ်ခု သတ်မှတ်ဖို့:

```sql
CREATE TABLE distributors (
    did     integer,
    name    varchar(40),
    CONSTRAINT con1 CHECK (did > 100 AND name <> '')
);
```

`films` table အတွက် — table constraint အနေနဲ့ — primary key constraint တစ်ခု သတ်မှတ်ဖို့:

```sql
CREATE TABLE films (
    code        char(5),
    title       varchar(40),
    did         integer,
    date_prod   date,
    kind        varchar(10),
    len         interval hour to minute,
    CONSTRAINT code_title PRIMARY KEY(code,title)
);
```

`distributors` table အတွက် primary key constraint တစ်ခု သတ်မှတ်ဖို့: အောက်ပါ ဥပမာ နှစ်ခုက ညီမျှပါတယ် — ပထမတစ်ခုက table constraint syntax ကို သုံးထားပြီး — ဒုတိယတစ်ခုက column constraint syntax ကို သုံးထားပါတယ်:

```sql
CREATE TABLE distributors (
    did     integer,
    name    varchar(40),
    PRIMARY KEY(did)
);

CREATE TABLE distributors (
    did     integer PRIMARY KEY,
    name    varchar(40)
);
```

`name` column အတွက် literal constant (စာသားအတိုင်း သတ်မှတ်ထားသော ကိန်းသေ) default value တစ်ခု သတ်မှတ်ကာ — `did` column ရဲ့ default value ကို — sequence object တစ်ခုရဲ့ နောက်တန်ဖိုး (next value) ကို ရွေးချယ်ခြင်းအားဖြင့် — ထုတ်ပေးစေပြီး — `modtime` ရဲ့ default value ကို — row ကို insert လုပ်တဲ့အချိန် — ဖြစ်စေဖို့:

```sql
CREATE TABLE distributors (
    name      varchar(40) DEFAULT 'Luso Films',
    did       integer DEFAULT nextval('distributors_serial'),
    modtime   timestamp DEFAULT current_timestamp
);
```

`distributors` table ပေါ်မှာ `NOT NULL` column constraints နှစ်ခု သတ်မှတ်ဖို့ — အဲဒီထဲက တစ်ခုကိုတော့ — နာမည် ထင်ထင်ရှားရှား ပေးထားပါတယ်:

```sql
CREATE TABLE distributors (
    did     integer CONSTRAINT no_null NOT NULL,
    name    varchar(40) NOT NULL
);
```

`name` column အတွက် unique constraint တစ်ခု သတ်မှတ်ဖို့:

```sql
CREATE TABLE distributors (
    did     integer,
    name    varchar(40) UNIQUE
);
```

အဲဒီအတိုင်းပဲ — table constraint အနေနဲ့ သတ်မှတ်ဖို့:

```sql
CREATE TABLE distributors (
    did     integer,
    name    varchar(40),
    UNIQUE(name)
);
```

အဲဒီ table ကိုပဲ — table ရော သူ့ရဲ့ unique index ပါ — fill factor 70% သတ်မှတ်ပြီး ဖန်တီးဖို့:

```sql
CREATE TABLE distributors (
    did     integer,
    name    varchar(40),
    UNIQUE(name) WITH (fillfactor=70)
)
WITH (fillfactor=70);
```

စက်ဝိုင်း (circle) နှစ်ခု တစ်ခုနဲ့တစ်ခု ထပ်မကျအောင် တားဆီးပေးမယ့် exclusion constraint တစ်ခု ပါတဲ့ `circles` table ကို ဖန်တီးဖို့:

```sql
CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);
```

`diskvol1` tablespace ထဲမှာ `cinemas` table ကို ဖန်တီးဖို့:

```sql
CREATE TABLE cinemas (
        id serial,
        name text,
        location text
) TABLESPACE diskvol1;
```

Composite type တစ်ခုနဲ့ typed table တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TYPE employee_type AS (name text, salary numeric);

CREATE TABLE employees OF employee_type (
    PRIMARY KEY (name),
    salary WITH OPTIONS DEFAULT 1000
);
```

Range partition လုပ်ထားတဲ့ table တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE measurement (
    logdate         date not null,
    peaktemp        int,
    unitsales       int
) PARTITION BY RANGE (logdate);
```

Partition key ထဲမှာ column အများအပြား ပါဝင်တဲ့ — range partition လုပ်ထားတဲ့ table တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE measurement_year_month (
    logdate         date not null,
    peaktemp        int,
    unitsales       int
) PARTITION BY RANGE (EXTRACT(YEAR FROM logdate), EXTRACT(MONTH FROM logdate));
```

List partition လုပ်ထားတဲ့ table တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE cities (
    city_id      bigserial not null,
    name         text not null,
    population   bigint
) PARTITION BY LIST (left(lower(name), 1));
```

Hash partition လုပ်ထားတဲ့ table တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE orders (
    order_id     bigint not null,
    cust_id      bigint not null,
    status       text
) PARTITION BY HASH (order_id);
```

Range partition လုပ်ထားတဲ့ table တစ်ခုရဲ့ partition တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE measurement_y2016m07
    PARTITION OF measurement (
    unitsales DEFAULT 0
) FOR VALUES FROM ('2016-07-01') TO ('2016-08-01');
```

Partition key ထဲမှာ column အများအပြား ပါဝင်တဲ့ — range partition လုပ်ထားတဲ့ table တစ်ခုရဲ့ partitions အနည်းငယ်ကို ဖန်တီးဖို့:

```sql
CREATE TABLE measurement_ym_older
    PARTITION OF measurement_year_month
    FOR VALUES FROM (MINVALUE, MINVALUE) TO (2016, 11);

CREATE TABLE measurement_ym_y2016m11
    PARTITION OF measurement_year_month
    FOR VALUES FROM (2016, 11) TO (2016, 12);

CREATE TABLE measurement_ym_y2016m12
    PARTITION OF measurement_year_month
    FOR VALUES FROM (2016, 12) TO (2017, 01);

CREATE TABLE measurement_ym_y2017m01
    PARTITION OF measurement_year_month
    FOR VALUES FROM (2017, 01) TO (2017, 02);
```

List partition လုပ်ထားတဲ့ table တစ်ခုရဲ့ partition တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE cities_ab
    PARTITION OF cities (
    CONSTRAINT city_id_nonzero CHECK (city_id != 0)
) FOR VALUES IN ('a', 'b');
```

ကိုယ်တိုင် ထပ်ပြီး partition လုပ်ထားတဲ့ — list partition table တစ်ခုရဲ့ partition တစ်ခုကို ဖန်တီးပြီး — အဲဒီနောက် — အဲဒီထဲကို partition တစ်ခု ထပ်ပေါင်းဖို့:

```sql
CREATE TABLE cities_ab
    PARTITION OF cities (
    CONSTRAINT city_id_nonzero CHECK (city_id != 0)
) FOR VALUES IN ('a', 'b') PARTITION BY RANGE (population);

CREATE TABLE cities_ab_10000_to_100000
    PARTITION OF cities_ab FOR VALUES FROM (10000) TO (100000);
```

Hash partition လုပ်ထားတဲ့ table တစ်ခုရဲ့ partitions တွေကို ဖန်တီးဖို့:

```sql
CREATE TABLE orders_p1 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE orders_p2 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE orders_p3 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE orders_p4 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

Default partition (ပုံသေ partition) တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE TABLE cities_partdef
    PARTITION OF cities DEFAULT;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE TABLE` command က — အောက်မှာ စာရင်းပြုစုထားတဲ့ ခြွင်းချက်တွေနဲ့အတူ — SQL standard နဲ့ ကိုက်ညီပါတယ်။

### Temporary Tables (ယာယီ tables)

`CREATE TEMPORARY TABLE` ရဲ့ syntax က SQL standard ရဲ့ syntax နဲ့ ဆင်တူပေမယ့် — သက်ရောက်မှုကတော့ အတူတူ မဟုတ်ပါဘူး။ Standard အရဆိုရင် — temporary tables တွေကို တစ်ကြိမ်တည်းပဲ သတ်မှတ်ပြီး — သူတို့ လိုအပ်တဲ့ session တိုင်းမှာ — (အကြောင်းအရာ ဗလာ အနေနဲ့) အလိုအလျောက် တည်ရှိနေပါတယ်။ PostgreSQL ကတော့ — သုံးစွဲမယ့် temporary table တစ်ခုချင်းစီအတွက် — session တစ်ခုချင်းစီက — ကိုယ်ပိုင် `CREATE TEMPORARY TABLE` command တစ်ခုကို ထုတ်ပြန်ဖို့ လိုအပ်ပါတယ်။ ဒါကြောင့် — session အမျိုးမျိုးက — temporary table name တစ်ခုတည်းကို — ရည်ရွယ်ချက် အမျိုးမျိုးအတွက် — သုံးနိုင်ပါတယ်; standard ရဲ့ ချဉ်းကပ်မှုကတော့ — ပေးထားတဲ့ temporary table name တစ်ခုရဲ့ instance တိုင်းမှာ — table structure တစ်ခုတည်းပဲ ရှိရမယ်လို့ — ချုပ်ချယ်ထားပါတယ်။

Standard က temporary tables တွေရဲ့ အပြုအမူနဲ့ ပတ်သက်ပြီး သတ်မှတ်ထားတာကို — ကျယ်ကျယ်ပြန့်ပြန့် လျစ်လျူရှုထားကြပါတယ်။ ဒီအချက်မှာ PostgreSQL ရဲ့ အပြုအမူက — SQL databases တခြား အများအပြားရဲ့ အပြုအမူနဲ့ ဆင်တူပါတယ်။

SQL standard က global နဲ့ local temporary tables တွေကိုလည်း ခြားနားစွာ သတ်မှတ်ပါတယ် — အဲဒီထဲမှာ local temporary table တစ်ခုက — session တစ်ခုချင်းစီအတွင်းက SQL module တစ်ခုချင်းစီအတွက် — သီးခြား အကြောင်းအရာ အစုတစ်ခု ရှိပြီး — သူ့ရဲ့ definition ကတော့ — session တွေကြားမှာ မျှဝေထားဆဲ ဖြစ်ပါတယ်။ PostgreSQL က SQL modules တွေကို ထောက်ပံ့မထားတာမို့ — ဒီ ခြားနားမှုက PostgreSQL မှာ သက်ဆိုင်မှု မရှိပါဘူး။

Compatibility အတွက် အနေနဲ့ — PostgreSQL က temporary table declaration တစ်ခုထဲမှာ `GLOBAL` နဲ့ `LOCAL` keywords တွေကို လက်ခံပေမယ့် — လက်ရှိမှာတော့ သူတို့မှာ သက်ရောက်မှု မရှိပါဘူး။ ဒီ keywords တွေကို သုံးတာကို အားမပေးပါဘူး — ဘာလို့လဲဆိုတော့ — PostgreSQL ရဲ့ အနာဂတ် version တွေက — သူတို့ရဲ့ အဓိပ္ပာယ်ကို — standard နဲ့ ပိုကိုက်ညီတဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုမှုတစ်ခုအဖြစ် — လက်ခံကျင့်သုံးလာနိုင်လို့ပါ။

Temporary tables တွေအတွက် `ON COMMIT` clause ကလည်း SQL standard နဲ့ ဆင်တူပေမယ့် — ကွဲပြားချက်တချို့ ရှိပါတယ်။ `ON COMMIT` clause ကို ချန်လိုက်မယ်ဆိုရင် — default အပြုအမူက `ON COMMIT DELETE ROWS` ဖြစ်တယ်လို့ SQL က သတ်မှတ်ပါတယ်။ ဒါပေမယ့် — PostgreSQL မှာတော့ — default အပြုအမူက `ON COMMIT PRESERVE ROWS` ဖြစ်ပါတယ်။ `ON COMMIT DROP` option ကတော့ SQL ထဲမှာ မရှိပါဘူး။

### Non-Deferred Uniqueness Constraints (deferrable မဟုတ်သော uniqueness constraints)

`UNIQUE` ဒါမှမဟုတ် `PRIMARY KEY` constraint တစ်ခုက deferrable မဟုတ်တဲ့အခါ — PostgreSQL က — row တစ်ခုကို insert သို့မဟုတ် modify လုပ်လိုက်တိုင်း — uniqueness ကို ချက်ချင်း စစ်ဆေးပါတယ်။ SQL standard ကတော့ — uniqueness ကို statement ရဲ့ အဆုံးမှာမှသာ အတင်းအကျပ် လုပ်ဆောင်သင့်တယ်လို့ ဆိုပါတယ်; ဒါက — ဥပမာ — command တစ်ခုတည်းက key values အများအပြားကို update လုပ်တဲ့အခါမျိုးမှာ — ကွာခြားမှု ဖြစ်စေပါတယ်။ Standard နဲ့ ကိုက်ညီတဲ့ အပြုအမူ ရဖို့ဆိုရင် — constraint ကို `DEFERRABLE` ဖြစ်ပေမယ့် — deferred မဟုတ်တဲ့အနေနဲ့ (ဆိုလိုတာက `INITIALLY IMMEDIATE`) ကြေညာပါ။ ဒါက — ချက်ချင်း uniqueness စစ်ဆေးမှုထက် — သိသိသာသာ ပိုနှေးစေနိုင်တာ သတိပြုပါ။

### Column Check Constraints (column check constraints)

SQL standard က — `CHECK` column constraints တွေက — သူတို့ သက်ရောက်တဲ့ column ကိုပဲ ရည်ညွှန်းနိုင်ပြီး — columns အများအပြားကို ရည်ညွှန်းနိုင်တာက `CHECK` table constraints တွေပဲ ဖြစ်တယ်လို့ ဆိုပါတယ်။ PostgreSQL က ဒီ ကန့်သတ်ချက်ကို အတင်းအကျပ် မလုပ်ဆောင်ပါဘူး — column နဲ့ table check constraints တွေကို — အတူတူပဲ — သဘောထားပါတယ်။

### `EXCLUDE` Constraint (`EXCLUDE` constraint)

`EXCLUDE` constraint type က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

### Foreign Key Constraints (foreign key constraints)

Foreign key actions တွေဖြစ်တဲ့ `SET DEFAULT` နဲ့ `SET NULL` တွေမှာ column lists (column စာရင်းများ) ကို သတ်မှတ်နိုင်တာက — PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

Foreign key constraint တစ်ခုက — primary key ဒါမှမဟုတ် unique constraint တစ်ခုရဲ့ columns တွေ အစား — unique index တစ်ခုရဲ့ columns တွေကို ရည်ညွှန်းနိုင်တာကလည်း — PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

### `NULL` “Constraint” (`NULL` “constraint”)

`NULL` “constraint” (တကယ်တော့ — constraint မဟုတ်တဲ့အရာ) က — database systems တချို့နဲ့ လိုက်ဖက်ညီမှုရှိစေဖို့ (`NOT NULL` constraint နဲ့ အချိုးကျ ညီမျှမှု အတွက်လည်း ပါ) — SQL standard ပေါ်ကို ထပ်ဆောင်းထားတဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ Column တိုင်းအတွက် default ဖြစ်နေတာမို့ — သူ့ရဲ့ ပါဝင်မှုက ဆူညံမှု (noise) သက်သက်ပဲ ဖြစ်ပါတယ်။

### Constraint Naming (constraint နာမည်ပေးခြင်း)

SQL standard က — table နဲ့ domain constraints တွေရဲ့ နာမည်တွေက — အဲဒီ table ဒါမှမဟုတ် domain ပါဝင်တဲ့ schema တစ်ခုလုံးအတွင်းမှာ — unique ဖြစ်ရမယ်လို့ ဆိုပါတယ်။ PostgreSQL ကတော့ ပိုပြီး လျှော့ပေါ့ပါတယ်: သူက — constraint names တွေကို — သီးခြား table ဒါမှမဟုတ် domain တစ်ခုဆီ ချိတ်ဆွဲထားတဲ့ constraints တွေကြားမှာသာ — unique ဖြစ်ဖို့ လိုအပ်ပါတယ်။ ဒါပေမယ့် — ဒီ ထပ်ဆောင်း လွတ်လပ်မှုက index-based constraints (`UNIQUE`, `PRIMARY KEY`, နဲ့ `EXCLUDE` constraints) တွေအတွက်တော့ မရှိပါဘူး — ဘာလို့လဲဆိုတော့ — ဆက်စပ်နေတဲ့ index ကို — constraint နဲ့ နာမည်တူ — ပေးထားပြီး — index names တွေက — schema တစ်ခုတည်းအတွင်းက relations အားလုံးကြားမှာ — unique ဖြစ်ရမယ်မို့ပါ။

### Inheritance (အမွေဆက်ခံခြင်း)

`INHERITS` clause ကနေတစ်ဆင့် — inheritance အများအပြား (multiple inheritance) ကို ရယူနိုင်တာက — PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ်။ SQL:1999 နဲ့ ၎င်းနောက်ပိုင်း version တွေက — single inheritance (တစ်ခုတည်းသော အမွေဆက်ခံမှု) ကို — syntax နဲ့ semantics ကွဲပြားတဲ့ ပုံစံနဲ့ — သတ်မှတ်ပါတယ်။ SQL:1999 ပုံစံ inheritance ကို PostgreSQL က — မထောက်ပံ့ရသေးပါဘူး။

### Zero-Column Tables (column သုညခု ပါသော tables)

PostgreSQL က — column လုံးဝ မပါဝင်တဲ့ table တစ်ခုကို ဖန်တီးခွင့် ပြုပါတယ် (ဥပမာ — `CREATE TABLE foo();`)။ ဒါက — zero-column tables တွေကို ခွင့်မပြုတဲ့ — SQL standard ကနေ လွဲထွက်တဲ့ extension တစ်ခု ဖြစ်ပါတယ်။ Zero-column tables တွေက သူတို့ဘာသာ သူတို့တော့ သိပ်အသုံးမဝင်ပါဘူး — ဒါပေမယ့် — သူတို့ကို ပိတ်ပင်ထားတာက — `ALTER TABLE DROP COLUMN` အတွက် — ထူးဆန်းတဲ့ special cases (အထူး အခြေအနေများ) တွေ ဖြစ်ပေါ်စေလို့ — ဒီ spec ရဲ့ ကန့်သတ်ချက်ကို လျစ်လျူရှုလိုက်တာက ပိုပြီး သန့်ရှင်းပုံ ရပါတယ်။

### Multiple Identity Columns (identity columns အများအပြား)

PostgreSQL က — table တစ်ခုမှာ identity column တစ်ခုထက်ပို၍ ထားရှိခွင့် ပြုပါတယ်။ Standard ကတော့ — table တစ်ခုမှာ identity column တစ်ခုထက် ပိုမရနိုင်ဘူးလို့ သတ်မှတ်ပါတယ်။ ဒီ စည်းကမ်းကို ဖြေလျှော့ထားတာက — schema changes တွေ ဒါမှမဟုတ် migrations (ဒေတာ ပြောင်းရွှေ့မှုများ) တွေ လုပ်တဲ့အခါ — ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေဖို့ အဓိက ရည်ရွယ်ပါတယ်။ `INSERT` command က — statement တစ်ခုလုံးကို သက်ရောက်တဲ့ — override clause တစ်ခုတည်းကိုပဲ ထောက်ပံ့တာမို့ — အပြုအမူ မတူညီတဲ့ identity columns အများအပြား ရှိနေတာကို — ကောင်းမွန်စွာ ထောက်ပံ့နိုင်မှာ မဟုတ်ကြောင်း သတိပြုပါ။

### Generated Columns (generated columns)

`STORED` နဲ့ `VIRTUAL` options တွေက standard မဟုတ်ပေမယ့် — SQL implementations တခြားဟာတွေမှာလည်း — သုံးစွဲနေပါတယ်။ SQL standard က generated columns တွေရဲ့ storage (သိမ်းဆည်းမှု) အကြောင်းကို — သတ်မှတ်မထားပါဘူး။

### `LIKE` Clause (`LIKE` clause)

`LIKE` clause တစ်ခုက SQL standard ထဲမှာ ပါဝင်ပေမယ့် — PostgreSQL က ၎င်းအတွက် လက်ခံတဲ့ options အများအပြားက — standard ထဲမှာ မပါဝင်ပါဘူး — ပြီးတော့ — standard ရဲ့ options တချို့ကိုလည်း — PostgreSQL က implement (အကောင်အထည်ဖော်) မထားပါဘူး။

### `WITH` Clause (`WITH` clause)

`WITH` clause က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်; storage parameters တွေက standard ထဲမှာ မပါဝင်ပါဘူး။

### Tablespaces (tablespaces)

Tablespaces ဆိုတဲ့ PostgreSQL ရဲ့ အယူအဆဟာ standard ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး။ ဒါကြောင့် — `TABLESPACE` နဲ့ `USING INDEX TABLESPACE` clauses တွေက extensions တွေ ဖြစ်ပါတယ်။

### Typed Tables (typed tables)

Typed tables တွေက SQL standard ရဲ့ — အစိတ်အပိုင်း တစ်စိတ်တစ်ပိုင်းကိုပဲ — implement လုပ်ထားပါတယ်။ Standard အရ — typed table တစ်ခုမှာ — အခြေခံ composite type နဲ့ ကိုက်ညီတဲ့ columns တွေ ရှိပြီး — “self-referencing column” (မိမိကိုယ်ကို ပြန်ညွှန်းသော column) လို့ ခေါ်တဲ့ — နောက်ထပ် column တစ်ခုလည်း ပါရှိပါတယ်။ PostgreSQL ကတော့ — self-referencing columns တွေကို ထင်ထင်ရှားရှား ထောက်ပံ့မထားပါဘူး။

### `PARTITION BY` Clause (`PARTITION BY` clause)

`PARTITION BY` clause က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

### `PARTITION OF` Clause (`PARTITION OF` clause)

`PARTITION OF` clause က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TABLE](/docs/postgresql/sql-altertable), [DROP TABLE](/docs/postgresql/sql-droptable), [CREATE TABLE AS](/docs/postgresql/sql-createtableas), [CREATE TABLESPACE](https://www.postgresql.org/docs/current/sql-createtablespace.html), [CREATE TYPE](https://www.postgresql.org/docs/current/sql-createtype.html)
