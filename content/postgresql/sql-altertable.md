---
title: "ALTER TABLE (table တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား table တစ်ခုရဲ့ definition (သတ်မှတ်ချက်) ကို ပြောင်းလဲပေးတဲ့ ALTER TABLE command — column ပေါင်းထည့်ခြင်း/ဖျက်ခြင်း/type ပြောင်းခြင်း၊ default နှင့် NOT NULL သတ်မှတ်ခြင်း၊ generated/identity column စီမံခန့်ခွဲမှု၊ constraints ပေါင်းထည့်ခြင်း/ဖျက်ခြင်း/validate ပြုလုပ်ခြင်း၊ triggers နှင့် rules များ enable/disable လုပ်ခြင်း၊ RENAME, SET SCHEMA, SET TABLESPACE, SET ACCESS METHOD, ATTACH/DETACH PARTITION, INHERIT, OWNER TO, REPLICA IDENTITY အပါအဝင် လုပ်ဆောင်ချက် ပုံစံခွဲများအားလုံး၏ အသေးစိတ် ရှင်းလင်းချက်"
order: 213
source: "https://www.postgresql.org/docs/current/sql-altertable.html"
status: translated
updated: 2026-09-04
---

## ALTER TABLE (table တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)

ALTER TABLE — table တစ်ခုရဲ့ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    action [, ... ]
ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    RENAME [ COLUMN ] column_name TO new_column_name
ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    RENAME CONSTRAINT constraint_name TO new_constraint_name
ALTER TABLE [ IF EXISTS ] name
    RENAME TO new_name
ALTER TABLE [ IF EXISTS ] name
    SET SCHEMA new_schema
ALTER TABLE ALL IN TABLESPACE name [ OWNED BY role_name [, ... ] ]
    SET TABLESPACE new_tablespace [ NOWAIT ]
ALTER TABLE [ IF EXISTS ] name
    ATTACH PARTITION partition_name { FOR VALUES partition_bound_spec | DEFAULT }
ALTER TABLE [ IF EXISTS ] name
    DETACH PARTITION partition_name [ CONCURRENTLY | FINALIZE ]

where action is one of:

    ADD [ COLUMN ] [ IF NOT EXISTS ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
    DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
    ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
    ALTER [ COLUMN ] column_name SET DEFAULT expression
    ALTER [ COLUMN ] column_name DROP DEFAULT
    ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
    ALTER [ COLUMN ] column_name SET EXPRESSION AS ( expression )
    ALTER [ COLUMN ] column_name DROP EXPRESSION [ IF EXISTS ]
    ALTER [ COLUMN ] column_name ADD GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [ ( sequence_options ) ]
    ALTER [ COLUMN ] column_name { SET GENERATED { ALWAYS | BY DEFAULT } | SET sequence_option | RESTART [ [ WITH ] restart ] } [...]
    ALTER [ COLUMN ] column_name DROP IDENTITY [ IF EXISTS ]
    ALTER [ COLUMN ] column_name SET STATISTICS { integer | DEFAULT }
    ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
    ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
    ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN | DEFAULT }
    ALTER [ COLUMN ] column_name SET COMPRESSION compression_method
    ADD table_constraint [ NOT VALID ]
    ADD table_constraint_using_index
    ALTER CONSTRAINT constraint_name [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ] [ ENFORCED | NOT ENFORCED ]
    ALTER CONSTRAINT constraint_name [ INHERIT | NO INHERIT ]
    VALIDATE CONSTRAINT constraint_name
    DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
    DISABLE TRIGGER [ trigger_name | ALL | USER ]
    ENABLE TRIGGER [ trigger_name | ALL | USER ]
    ENABLE REPLICA TRIGGER trigger_name
    ENABLE ALWAYS TRIGGER trigger_name
    DISABLE RULE rewrite_rule_name
    ENABLE RULE rewrite_rule_name
    ENABLE REPLICA RULE rewrite_rule_name
    ENABLE ALWAYS RULE rewrite_rule_name
    DISABLE ROW LEVEL SECURITY
    ENABLE ROW LEVEL SECURITY
    FORCE ROW LEVEL SECURITY
    NO FORCE ROW LEVEL SECURITY
    CLUSTER ON index_name
    SET WITHOUT CLUSTER
    SET WITHOUT OIDS
    SET ACCESS METHOD { new_access_method | DEFAULT }
    SET TABLESPACE new_tablespace
    SET { LOGGED | UNLOGGED }
    SET ( storage_parameter [= value] [, ... ] )
    RESET ( storage_parameter [, ... ] )
    INHERIT parent_table
    NO INHERIT parent_table
    OF type_name
    NOT OF
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
    REPLICA IDENTITY { DEFAULT | USING INDEX index_name | FULL | NOTHING }

and partition_bound_spec is:

IN ( partition_bound_expr [, ...] ) |
FROM ( { partition_bound_expr | MINVALUE | MAXVALUE } [, ...] )
  TO ( { partition_bound_expr | MINVALUE | MAXVALUE } [, ...] ) |
WITH ( MODULUS numeric_literal, REMAINDER numeric_literal )

and column_constraint is:

[ CONSTRAINT constraint_name ]
{ NOT NULL [ NO INHERIT ] |
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
  FOREIGN KEY ( column_name [, ... ] [, PERIOD column_name ] ) REFERENCES reftable [ ( refcolumn [, ... ]  [, PERIOD refcolumn ] ) ]
    [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ] [ ON DELETE referential_action ] [ ON UPDATE referential_action ] }
[ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ] [ ENFORCED | NOT ENFORCED ]

and table_constraint_using_index is:

    [ CONSTRAINT constraint_name ]
    { UNIQUE | PRIMARY KEY } USING INDEX index_name
    [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

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

`ALTER TABLE` က ရှိပြီးသား table တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့ subforms (လုပ်ဆောင်ချက် ပုံစံခွဲများ) အများအပြား ရှိပါတယ်။ Subform တစ်ခုချင်းစီအတွက် လိုအပ်တဲ့ lock level (သော့ခတ် အဆင့်) က ကွဲပြားနိုင်တာ သတိပြုပါ။ အတိအကျ ဖော်ပြထားခြင်း မရှိရင် — `ACCESS EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။ Subcommands အများအပြား ပေးထားတဲ့အခါ — ရယူလိုက်တဲ့ lock က — subcommand တစ်ခုခုက လိုအပ်တဲ့ အကြပ်ဆုံး (strictest) lock ဖြစ်ပါလိမ့်မယ်။

- **ADD [ COLUMN ] [ IF NOT EXISTS ] #** — ဒီ form က — `CREATE TABLE` မှာ သုံးတဲ့ syntax အတိုင်းပဲ — table ထဲသို့ column အသစ်တစ်ခုကို ထည့်သွင်းပါတယ်။ `IF NOT EXISTS` ကို သတ်မှတ်ထားပြီး — ဒီနာမည်နဲ့ column တစ်ခု ရှိပြီးသား ဖြစ်နေရင် — error မပစ်ပါဘူး။
- **DROP [ COLUMN ] [ IF EXISTS ] #** — ဒီ form က table တစ်ခုကနေ column တစ်ခုကို ဖယ်ရှားပါတယ်။ Column ပါဝင်ပတ်သက်နေတဲ့ indexes နဲ့ table constraints တွေကိုလည်း အလိုအလျောက် ဖယ်ရှားပါတယ်။ Column ကို ဖယ်ရှားလိုက်လို့ — statistics တွေမှာ column တစ်ခုတည်းရဲ့ data ပဲ ပါဝင်တော့မယ်ဆိုရင် — အဲဒီ column ကို ရည်ညွှန်းထားတဲ့ multivariate statistics (variable အများအပြား ပါဝင်တဲ့ စာရင်းအင်း အချက်အလက်များ) တွေကိုလည်း ဖယ်ရှားလိုက်ပါတယ်။ Table ရဲ့ အပြင်ဘက်က တစ်ခုခုက ဒီ column ပေါ်မှာ မှီခိုနေရင် — ဥပမာ — foreign key references တွေ သို့မဟုတ် views တွေဆိုရင် — `CASCADE` ကို သုံးဖို့ လိုအပ်ပါလိမ့်မယ်။ `IF EXISTS` ကို သတ်မှတ်ထားပြီး — column မရှိဘူးဆိုရင် — error မပစ်ပါဘူး။ အဲဒီအစား ဒီလိုအခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **SET DATA TYPE #** — ဒီ form က table တစ်ခုရဲ့ column တစ်ခုရဲ့ type ကို ပြောင်းလဲပါတယ်။ Column ပါဝင်ပတ်သက်နေတဲ့ indexes နဲ့ ရိုးရှင်းတဲ့ table constraints တွေကို — မူလ ထောက်ပံ့ပေးခဲ့တဲ့ expression ကို ပြန်လည် parse (syntax ခွဲခြမ်း) လုပ်ပြီး — column type အသစ်ကို သုံးအောင် အလိုအလျောက် ပြောင်းလဲပေးပါတယ်။ Optional ဖြစ်တဲ့ `COLLATE` clause က column အသစ်အတွက် collation တစ်ခုကို သတ်မှတ်ပေးပါတယ်; ချန်လိုက်ရင် — collation က column type အသစ်အတွက် default collation ဖြစ်ပါတယ်။ Optional ဖြစ်တဲ့ `USING` clause က column တန်ဖိုးအသစ်ကို တန်ဖိုးအဟောင်းကနေ ဘယ်လို တွက်ချက်ရမယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်; ချန်လိုက်ရင် — default conversion က data type အဟောင်းကနေ အသစ်ဆီ assignment cast (တန်ဖိုး သတ်မှတ်ပေးမှု cast) နဲ့ အတူတူပါပဲ။ Data type အဟောင်းကနေ အသစ်ဆီ implicit (သွယ်ဝိုက်) ဒါမှမဟုတ် assignment cast မရှိဘူးဆိုရင် — `USING` clause တစ်ခု ပေးရပါမယ်။

  ဒီ form ကို သုံးတဲ့အခါ — column ရဲ့ statistics တွေကို ဖယ်ရှားလိုက်လို့ — နောက်ပိုင်း table ပေါ်မှာ `ANALYZE` run ဖို့ အကြံပြုပါတယ်။ Virtual generated column တစ်ခုအတွက်တော့ — ဒီလို columns တွေမှာ statistics တွေ ဘယ်တော့မှ မရှိတာမို့ — `ANALYZE` မလိုအပ်ပါဘူး။
- **SET/DROP DEFAULT #** — ဒီ forms တွေက column တစ်ခုအတွက် default တန်ဖိုးကို သတ်မှတ်ခြင်း ဒါမှမဟုတ် ဖယ်ရှားခြင်း ပြုလုပ်ပါတယ် (ဖယ်ရှားတာက default တန်ဖိုးကို NULL အဖြစ် သတ်မှတ်တာနဲ့ ညီမျှပါတယ်)။ Default တန်ဖိုး အသစ်က နောက်ပိုင်း `INSERT` ဒါမှမဟုတ် `UPDATE` commands တွေမှာပဲ သက်ရောက်မှု ရှိပါတယ်; table ထဲမှာ ရှိပြီးသား rows တွေကို ပြောင်းလဲစေတာ မဟုတ်ပါဘူး။
- **SET/DROP NOT NULL #** — ဒီ forms တွေက column တစ်ခုကို null တန်ဖိုးတွေ ခွင့်ပြုတဲ့ column အဖြစ် မှတ်သားထားမလား — null တန်ဖိုးတွေ ငြင်းပယ်တဲ့ column အဖြစ် မှတ်သားထားမလားဆိုတာကို ပြောင်းလဲပါတယ်။

  Table ထဲက records တစ်ခုမှ column အတွက် NULL တန်ဖိုး မပါဝင်ဘူးဆိုမှသာ `SET NOT NULL` ကို အသုံးပြုလို့ ရပါတယ်။ သာမန်အားဖြင့် ဒါကို — `NOT VALID` သတ်မှတ်ထားခြင်း မရှိရင် — table တစ်ခုလုံးကို scan လုပ်ပြီး `ALTER TABLE` အတွင်း စစ်ဆေးပါတယ်; ဒါပေမယ့် — NULL တစ်ခုမှ မရှိနိုင်ဘူးဆိုတာကို သက်သေပြနိုင်တဲ့ valid `CHECK` constraint တစ်ခု ရှိနေရင် (ပြီးတော့ အဲဒီ command ထဲမှာပဲ drop မလုပ်ထားရင်) — table scan ကို ကျော်လိုက်ပါတယ်။ Column တစ်ခုမှာ invalid not-null constraint ရှိနေရင် — `SET NOT NULL` က ၎င်းကို validate လုပ်ပါတယ်။

  ဒီ table က partition တစ်ခုဆိုရင် — column ကို parent table ထဲမှာ `NOT NULL` လို့ မှတ်သားထားတယ်ဆိုရင် — အဲဒီ column ပေါ်မှာ `DROP NOT NULL` ကို လုပ်ဆောင်လို့ မရပါဘူး။ Partitions အားလုံးကနေ NOT NULL constraint ကို ဖယ်ရှားချင်ရင် — parent table ပေါ်မှာ `DROP NOT NULL` ကို လုပ်ဆောင်ပါ။ Parent ပေါ်မှာ NOT NULL constraint မရှိဘူးဆိုရင်တောင် — လိုချင်ရင် — partition တစ်ခုချင်းစီပေါ်မှာ ဒီလို constraint တစ်ခုကို ထပ်ထည့်လို့ ရပါတယ်; ဆိုလိုတာက — parent က null တွေ ခွင့်ပြုနေရင်တောင် children တွေက null တွေကို ငြင်းပယ်နိုင်ပါတယ် — ဒါပေမယ့် ပြောင်းပြန်ကတော့ မရပါဘူး။ Parent table တစ်ခုတည်းကိုပဲ (`ONLY`) NOT NULL constraint ကို drop လုပ်ဖို့လည်း ဖြစ်နိုင်ပြီး — အဲဒီလိုလုပ်ရင် children တွေဆီကနေ ဖယ်ရှားပေးခြင်း မရှိပါဘူး။
- **SET EXPRESSION AS #** — ဒီ form က generated column တစ်ခုရဲ့ expression ကို အစားထိုးပါတယ်။ Stored generated column တစ်ခုထဲက ရှိပြီးသား data တွေကို rewrite (ပြန်ရေးသား) လုပ်ပြီး — နောက်ပိုင်း ပြောင်းလဲမှုတွေ အားလုံးမှာ generation expression အသစ်ကို သက်ရောက်ပါလိမ့်မယ်။

  ဒီ form ကို stored generated column တစ်ခုပေါ်မှာ သုံးတဲ့အခါ — ၎င်းရဲ့ statistics တွေကို ဖယ်ရှားလိုက်လို့ — နောက်ပိုင်းမှာ table ပေါ်မှာ `ANALYZE` run ဖို့ အကြံပြုပါတယ်။ Virtual generated column တစ်ခုအတွက်တော့ — ဒီလို columns တွေမှာ statistics တွေ ဘယ်တော့မှ မရှိတာမို့ — `ANALYZE` မလိုအပ်ပါဘူး။
- **DROP EXPRESSION [ IF EXISTS ] #** — ဒီ form က stored generated column တစ်ခုကို သာမန် base column တစ်ခုအဖြစ် ပြောင်းလဲပေးပါတယ်။ Column ထဲက ရှိပြီးသား data တွေကို ထိန်းသိမ်းထားပေမယ့် — နောက်ပိုင်း ပြောင်းလဲမှုတွေမှာ generation expression ကို သက်ရောက်တော့ မဟုတ်ပါဘူး။

  ဒီ form ကို လောလောဆယ် stored generated columns တွေအတွက်ပဲ ထောက်ပံ့ပါတယ် (virtual တွေအတွက် မဟုတ်ပါဘူး)။

  `DROP EXPRESSION IF EXISTS` ကို သတ်မှတ်ထားပြီး — column က generated column တစ်ခု မဟုတ်ဘူးဆိုရင် — error မပစ်ပါဘူး။ အဲဒီအစား ဒီလိုအခြေအနေမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **ADD GENERATED { ALWAYS | BY DEFAULT } AS IDENTITYSET GENERATED { ALWAYS | BY DEFAULT }DROP IDENTITY [ IF EXISTS ] #** — ဒီ forms တွေက column တစ်ခုကို identity column တစ်ခု ဖြစ်မဖြစ် ပြောင်းလဲခြင်း ဒါမှမဟုတ် — ရှိပြီးသား identity column တစ်ခုရဲ့ generation attribute (ALWAYS သို့မဟုတ် BY DEFAULT ဖြစ်မဖြစ်) ကို ပြောင်းလဲခြင်း ပြုလုပ်ပါတယ်။ အသေးစိတ်အတွက် CREATE TABLE ကို ကြည့်ပါ။ `SET DEFAULT` လိုပဲ — ဒီ forms တွေက နောက်ပိုင်း `INSERT` နဲ့ `UPDATE` commands တွေရဲ့ အပြုအမူကိုပဲ သက်ရောက်မှု ရှိပြီး — table ထဲမှာ ရှိပြီးသား rows တွေကို ပြောင်းလဲစေတာ မဟုတ်ပါဘူး။

  `DROP IDENTITY IF EXISTS` ကို သတ်မှတ်ထားပြီး — column က identity column တစ်ခု မဟုတ်ဘူးဆိုရင် — error မပစ်ပါဘူး။ အဲဒီအစား ဒီလိုအခြေအနေမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **SET sequence_optionRESTART #** — ဒီ forms တွေက ရှိပြီးသား identity column တစ်ခုရဲ့ အောက်ခံဖြစ်တဲ့ sequence ကို ပြောင်းလဲပါတယ်။ `sequence_option` ဆိုတာ — `INCREMENT BY` လို — `ALTER SEQUENCE` က ထောက်ပံ့တဲ့ option တစ်ခု ဖြစ်ပါတယ်။
- **SET STATISTICS #** — ဒီ form က နောက်ပိုင်း `ANALYZE` operations တွေအတွက် per-column statistics-gathering target (column တစ်ခုချင်းစီအလိုက် statistics စုဆောင်းမှု ပစ်မှတ်) ကို သတ်မှတ်ပါတယ်။ Target ကို 0 ကနေ 10000 အကွာအဝေးထဲမှာ သတ်မှတ်လို့ ရပါတယ်။ System default statistics target (`default_statistics_target`) ကို ပြန်သုံးဖို့ DEFAULT လို့ သတ်မှတ်ပါ။ (တန်ဖိုး -1 လို့ သတ်မှတ်တာက ဒီအတိုင်း တူညီတဲ့ ရလဒ်ကို ရဖို့ ခေတ်မမီတော့တဲ့ (obsolete) စာလုံးပေါင်း နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။) PostgreSQL query planner က statistics တွေကို အသုံးပြုပုံအကြောင်း နောက်ထပ် အချက်အလက်အတွက် အပိုင်း 14.2 ကို ကိုးကားပါ။

  `SET STATISTICS` က `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။
- **SET ( attribute_option = value [, ... ] )RESET ( attribute_option [, ... ] ) #** — ဒီ form က per-attribute options (attribute တစ်ခုချင်းစီဆိုင်ရာ option များ) တွေကို သတ်မှတ်ခြင်း ဒါမှမဟုတ် ပြန်လည် သတ်မှတ်ခြင်း (reset) ပြုလုပ်ပါတယ်။ လောလောဆယ် — သတ်မှတ်ထားတဲ့ per-attribute options တွေက `n_distinct` နဲ့ `n_distinct_inherited` ပဲ ရှိပြီး — ၎င်းတို့က နောက်ပိုင်း `ANALYZE` operations တွေရဲ့ number-of-distinct-values ခန့်မှန်းချက်တွေကို override (အစားထိုး) လုပ်ပါတယ်။ `n_distinct` က table ကိုယ်တိုင်အတွက် statistics ကို သက်ရောက်မှု ရှိပြီး — `n_distinct_inherited` ကတော့ table နဲ့ သူ့ရဲ့ inheritance children တွေ အတူတကွအတွက် စုဆောင်းတဲ့ statistics တွေကိုရော — partitioned tables တွေအတွက် စုဆောင်းတဲ့ statistics တွေကိုပါ သက်ရောက်မှု ရှိပါတယ်။ သတ်မှတ်ထားတဲ့ တန်ဖိုးက positive တန်ဖိုး ဖြစ်နေရင် — query planner က column ထဲမှာ သတ်မှတ်ထားတဲ့ အရေအတွက်အတိုင်း — အတိအကျ ရှိတဲ့ distinct nonnull values တွေ ပါဝင်တယ်လို့ ယူဆပါလိမ့်မယ်။ 0 အောက် နိမ့်ပြီး -1 နဲ့ ညီမျှခြင်း သို့မဟုတ် အထက်ရှိတဲ့ တန်ဖိုးတွေကို သုံးပြီး fractional values (အပိုင်းကိန်း တန်ဖိုးများ) တွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ ဒါက — query planner ကို — သတ်မှတ်ထားတဲ့ ဂဏန်းရဲ့ absolute value (ပကတိ တန်ဖိုး) ကို table ထဲက ခန့်မှန်း rows အရေအတွက်နဲ့ မြှောက်ပြီး — distinct values အရေအတွက်ကို ခန့်မှန်းစေပါတယ်။ ဥပမာ — တန်ဖိုး -1 ဆိုတာ column ထဲက တန်ဖိုးတွေ အားလုံး distinct ဖြစ်တယ်လို့ ဆိုလိုပြီး — တန်ဖိုး -0.5 ဆိုရင်တော့ တန်ဖိုးတစ်ခုစီက ပျမ်းမျှ နှစ်ကြိမ်စီ ပေါ်တယ်လို့ ဆိုလိုပါတယ်။ Table ရဲ့ အရွယ်အစားက အချိန်နဲ့အမျှ ပြောင်းလဲနေတဲ့အခါ ဒါက အသုံးဝင်နိုင်ပါတယ်။ PostgreSQL query planner က statistics တွေကို အသုံးပြုပုံအကြောင်း နောက်ထပ် အချက်အလက်အတွက် အပိုင်း 14.2 ကို ကိုးကားပါ။

  Per-attribute options တွေ ပြောင်းလဲတာက `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။
- **SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN | DEFAULT } #** — ဒီ form က column တစ်ခုအတွက် storage mode (သိုလှောင်မှု ပုံစံ) ကို သတ်မှတ်ပါတယ်။ ဒါက column ကို inline အနေနဲ့ ထားမလား — secondary TOAST table တစ်ခုထဲမှာ ထားမလား — ပြီးတော့ data ကို compress လုပ်မလား မလုပ်ဘူးလားဆိုတာကို ထိန်းချုပ်ပါတယ်။ `PLAIN` ကို integer လို fixed-length (ပုံသေ အလျား) တန်ဖိုးတွေအတွက် သုံးရပြီး — inline, uncompressed (ချုံ့မထား) ဖြစ်ပါတယ်။ `MAIN` က inline, compressible (ချုံ့လို့ရတဲ့) data အတွက် ဖြစ်ပါတယ်။ `EXTERNAL` က external, uncompressed data အတွက် ဖြစ်ပြီး — `EXTENDED` က external, compressed data အတွက် ဖြစ်ပါတယ်။ `DEFAULT` လို့ ရေးတာက column ရဲ့ data type အတွက် default storage mode ကို သတ်မှတ်ပေးပါတယ်။ `EXTENDED` က non-PLAIN storage ကို ထောက်ပံ့တဲ့ data types အများစုအတွက် default ဖြစ်ပါတယ်။ `EXTERNAL` ကို သုံးတာက — အလွန် ကြီးမားတဲ့ text နဲ့ bytea တန်ဖိုးတွေပေါ်က substring operations တွေကို ပိုမြန်စေပေမယ့် — storage space ပိုများစေတဲ့ အားနည်းချက် ရှိပါတယ်။ `ALTER TABLE ... SET STORAGE` က သူ့ဘာသာသူ table ထဲမှာ ဘာမှ ပြောင်းလဲပေးတာ မဟုတ်ဘဲ — နောက်ပိုင်း table updates တွေမှာ လိုက်နာရမယ့် ဗျူဟာကိုပဲ သတ်မှတ်ပေးတာပါဆိုတာ သတိပြုပါ။ နောက်ထပ် အချက်အလက်အတွက် အပိုင်း 66.2 ကို ကြည့်ပါ။
- **SET COMPRESSION compression_method #** — ဒီ form က column တစ်ခုအတွက် compression method ကို သတ်မှတ်ပြီး — နောက်ပိုင်း ထည့်သွင်းခံရမယ့် တန်ဖိုးတွေကို ဘယ်လို ချုံ့မလဲဆိုတာ ဆုံးဖြတ်ပေးပါတယ် (storage mode က ချုံ့ခြင်းကို ခွင့်ပြုတယ်ဆိုရင်)။ ဒါက table ကို rewrite မလုပ်စေတာမို့ — ရှိပြီးသား data တွေဟာ တခြား compression methods တွေနဲ့ ချုံ့ထားဆဲ ဖြစ်နိုင်ပါတယ်။ Table ကို pg_restore နဲ့ ပြန်လည် တည်ဆောက်မယ်ဆိုရင် — တန်ဖိုးတွေ အားလုံးကို သတ်မှတ်ထားတဲ့ compression method နဲ့ rewrite လုပ်ပါတယ်။ ဒါပေမယ့် — data ကို တခြား relation တစ်ခုကနေ ထည့်သွင်းတဲ့အခါ (ဥပမာ — `INSERT ... SELECT`) — source table ကနေ တန်ဖိုးတွေကို detoast (ဖြန့်ချ) လုပ်ဖို့ မလိုအပ်တာမို့ — အရင် ချုံ့ထားပြီးသား data ဟာ — target column ရဲ့ compression method နဲ့ ပြန်ချုံ့ခံရမယ့်အစား — သူ့ရဲ့ ရှိပြီးသား compression method ကို ဆက်ထိန်းထားနိုင်ပါတယ်။ ထောက်ပံ့ထားတဲ့ compression methods တွေက pglz နဲ့ lz4 ဖြစ်ပါတယ်။ (lz4 က PostgreSQL ကို တည်ဆောက်တဲ့အခါ `--with-lz4` ကို သုံးထားမှသာ ရနိုင်ပါတယ်။) ထို့ပြင် — `compression_method` က `default` လည်း ဖြစ်နိုင်ပြီး — data ထည့်သွင်းချိန်မှာ သုံးရမယ့် method ကို ဆုံးဖြတ်ဖို့ `default_toast_compression` setting ကို တိုင်ပင်တဲ့ default အပြုအမူကို ရွေးချယ်ပါတယ်။
- **ADD table_constraint [ NOT VALID ] #** — ဒီ form က — `CREATE TABLE` မှာ သုံးတဲ့ constraint syntax အတိုင်းပဲ — table ထဲသို့ constraint အသစ်တစ်ခုကို ထပ်ပေါင်းပါတယ် — ပြီးတော့ — လောလောဆယ် foreign-key, CHECK နဲ့ not-null constraints တွေအတွက်ပဲ ခွင့်ပြုထားတဲ့ `NOT VALID` option ပါ ထပ်ဆောင်း ပါဝင်ပါတယ်။

  သာမန်အားဖြင့် ဒီ form က — table ထဲက ရှိပြီးသား rows တွေ အားလုံး constraint အသစ်ကို ကျေနပ်မှု ရှိမရှိ စစ်ဆေးဖို့ — table ကို scan လုပ်ပါတယ်။ ဒါပေမယ့် — `NOT VALID` option ကို သုံးထားရင် — ဒီ ကြာမြင့်နိုင်တဲ့ scan ကို ကျော်လိုက်ပါတယ်။ Constraint က နောက်ပိုင်း inserts ဒါမှမဟုတ် updates တွေအပေါ်မှာတော့ ဆက်ပြီး သက်ရောက်နေဦးမှာ ဖြစ်ပါတယ် (ဆိုလိုတာက — foreign keys တွေရဲ့ ကိစ္စမှာ referenced table ထဲမှာ ကိုက်ညီတဲ့ row မရှိရင် ဒါမှမဟုတ် — row အသစ်က သတ်မှတ်ထားတဲ့ check condition နဲ့ မကိုက်ညီရင် — သူတို့ မအောင်မြင်ပါဘူး)။ ဒါပေမယ့် — `VALIDATE CONSTRAINT` option ကို သုံးပြီး validate လုပ်ချိန်အထိ — database က constraint ကို table ထဲက rows အားလုံးအတွက် ဆက်လက် လိုက်နာမှု ရှိတယ်လို့တော့ ယူဆမှာ မဟုတ်ပါဘူး။ `NOT VALID` option အသုံးပြုမှုအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် အောက်က Notes ကို ကြည့်ပါ။

  `ADD table_constraint` ပုံစံ အများစုက `ACCESS EXCLUSIVE` lock လိုအပ်ပေမယ့် — `ADD FOREIGN KEY` ကတော့ `SHARE ROW EXCLUSIVE` lock တစ်ခုပဲ လိုအပ်ပါတယ်။ `ADD FOREIGN KEY` က — constraint ကို ကြေညာထားတဲ့ table ပေါ်က lock အပြင် — referenced table ပေါ်မှာပါ `SHARE ROW EXCLUSIVE` lock တစ်ခုကို ရယူတာကို သတိပြုပါ။

  Partitioned tables တွေပေါ်မှာ unique ဒါမှမဟုတ် primary key constraints တွေ ထပ်ပေါင်းတဲ့အခါ နောက်ထပ် ကန့်သတ်ချက်တွေ သက်ရောက်ပါတယ်; CREATE TABLE ကို ကြည့်ပါ။
- **ADD table_constraint_using_index #** — ဒီ form က — ရှိပြီးသား unique index တစ်ခုကို အခြေခံပြီး — table ထဲသို့ `PRIMARY KEY` ဒါမှမဟုတ် `UNIQUE` constraint အသစ်တစ်ခုကို ထပ်ပေါင်းပါတယ်။ Index ရဲ့ columns တွေ အားလုံးကို constraint ထဲမှာ ထည့်သွင်းပါလိမ့်မယ်။

  Index မှာ expression columns တွေ ရှိလို့ မရသလို — partial index တစ်ခုလည်း ဖြစ်လို့ မရပါဘူး။ ထို့ပြင် — default sort ordering နဲ့ b-tree index တစ်ခု ဖြစ်ရပါမယ်။ ဒီ ကန့်သတ်ချက်တွေက — index က သာမန် `ADD PRIMARY KEY` ဒါမှမဟုတ် `ADD UNIQUE` command တစ်ခုက တည်ဆောက်ပေးမယ့် index နဲ့ ညီမျှတယ်ဆိုတာ သေချာစေပါတယ်။

  `PRIMARY KEY` ကို သတ်မှတ်ထားပြီး — index ရဲ့ columns တွေ `NOT NULL` အဖြစ် မှတ်သားပြီးသား မဟုတ်ဘူးဆိုရင် — ဒီ command က column တစ်ခုချင်းစီအပေါ်မှာ `ALTER COLUMN SET NOT NULL` ကို လုပ်ဆောင်ဖို့ ကြိုးစားပါလိမ့်မယ်။ အဲဒါက column(s) တွေထဲမှာ null တွေ မရှိဘူးဆိုတာ စစ်ဆေးဖို့ table scan တစ်ခုလုံး လိုအပ်ပါတယ်။ ကျန်တဲ့ အခြေအနေတွေ အားလုံးမှာတော့ ဒါက မြန်ဆန်တဲ့ operation တစ်ခု ဖြစ်ပါတယ်။

  Constraint နာမည် ပေးထားရင် — index ကို constraint နာမည်နဲ့ ကိုက်ညီအောင် rename လုပ်ပါလိမ့်မယ်။ မပေးထားရင် — constraint ကို index နဲ့ နာမည်တူ ပေးပါလိမ့်မယ်။

  ဒီ command ကို execute လုပ်ပြီးတဲ့ နောက်မှာ — index ကို constraint က “ပိုင်ဆိုင်” လိုက်ပြီး — index ကို သာမန် `ADD PRIMARY KEY` ဒါမှမဟုတ် `ADD UNIQUE` command တစ်ခုက တည်ဆောက်ခဲ့သလိုမျိုး ဖြစ်ပါတယ်။ အထူးသဖြင့် — constraint ကို drop လုပ်ရင် index ပါ ပျောက်သွားပါလိမ့်မယ်။

  ဒီ form ကို လောလောဆယ် partitioned tables တွေပေါ်မှာ ထောက်ပံ့မထားပါဘူး။

  **မှတ်ချက်:** ရှိပြီးသား index တစ်ခုကို သုံးပြီး constraint တစ်ခု ထပ်ပေါင်းတာက — table updates တွေကို အချိန်အကြာကြီး ပိတ်ဆို့မှု မရှိဘဲ — constraint အသစ်တစ်ခု ထပ်ပေါင်းဖို့ လိုအပ်တဲ့ အခြေအနေတွေမှာ အသုံးဝင်နိုင်ပါတယ်။ အဲဒါကို လုပ်ဖို့ — `CREATE UNIQUE INDEX CONCURRENTLY` နဲ့ index ကို ဖန်တီးပြီး — ဒီ syntax နဲ့ constraint အဖြစ် ပြောင်းလဲပါ။ အောက်က ဥပမာကို ကြည့်ပါ။
- **ALTER CONSTRAINT #** — ဒီ form က — အရင်က ဖန်တီးထားတဲ့ constraint တစ်ခုရဲ့ attributes (လက္ခဏာရပ်များ) ကို ပြောင်းလဲပါတယ်။ လောလောဆယ် foreign key constraints တွေကိုပဲ ဒီနည်းနဲ့ ပြောင်းလဲလို့ ရပါတယ် — ဒါပေမယ့် အောက်မှာ ကြည့်ပါ။
- **ALTER CONSTRAINT ... INHERITALTER CONSTRAINT ... NO INHERIT #** — ဒီ forms တွေက inheritable (အမွေဆက်ခံနိုင်သော) constraint တစ်ခုကို not inheritable ဖြစ်အောင် ဒါမှမဟုတ် — အပြန်အလှန် — not inheritable ကို inheritable ဖြစ်အောင် ပြုပြင်ပါတယ်။ လောလောဆယ် not-null constraints တွေကိုပဲ ဒီနည်းနဲ့ ပြောင်းလဲလို့ ရပါတယ်။ Constraint ရဲ့ inheritability အခြေအနေ ပြောင်းလဲတာအပြင် — non-inheritable constraint တစ်ခုကို inheritable အဖြစ် မှတ်သားတဲ့ အခြေအနေမှာ — table မှာ children တွေ ရှိနေရင် — ညီမျှတဲ့ constraint တစ်ခုကို သူတို့ဆီမှာပါ ထပ်ပေါင်းပေးပါတယ်။ Children တွေ ရှိတဲ့ table တစ်ခုပေါ်မှာ inheritable constraint တစ်ခုကို non-inheritable အဖြစ် မှတ်သားတယ်ဆိုရင် — children တွေပေါ်က သက်ဆိုင်ရာ constraint ကို — ဆက်လက် အမွေဆက်ခံထားတာ မဟုတ်တော့ဘူးလို့ မှတ်သားပေမယ့် — ဖယ်ရှားပေးတော့ မဟုတ်ပါဘူး။
- **VALIDATE CONSTRAINT #** — ဒီ form က — အရင်က `NOT VALID` အဖြစ် ဖန်တီးထားတဲ့ foreign key, check ဒါမှမဟုတ် not-null constraint တစ်ခုကို — constraint ကို ကျေနပ်မှု မရှိတဲ့ rows တွေ မရှိဘူးဆိုတာ သေချာစေဖို့ — table ကို scan လုပ်ပြီး validate ပြုလုပ်ပါတယ်။ Constraint ကို `NOT ENFORCED` အဖြစ် သတ်မှတ်ထားရင် — error တစ်ခု ပစ်ပါတယ်။ Constraint က valid အဖြစ် မှတ်သားပြီးသား ဖြစ်နေရင် — ဘာမှ မဖြစ်ပါဘူး။ (ဒီ command ရဲ့ အသုံးဝင်ပုံ ရှင်းလင်းချက်အတွက် အောက်က Notes ကို ကြည့်ပါ။)

  ဒီ command က `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။
- **DROP CONSTRAINT [ IF EXISTS ] #** — ဒီ form က table ပေါ်က သတ်မှတ်ထားတဲ့ constraint တစ်ခုကို — constraint ရဲ့ အောက်ခံ index အပါအဝင် — ဖယ်ရှားပါတယ်။ `IF EXISTS` ကို သတ်မှတ်ထားပြီး — constraint မရှိဘူးဆိုရင် — error မပစ်ပါဘူး။ အဲဒီအစား ဒီလိုအခြေအနေမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **DISABLE/ENABLE [ REPLICA | ALWAYS ] TRIGGER #** — ဒီ forms တွေက table နဲ့ သက်ဆိုင်တဲ့ trigger(s) တွေရဲ့ fire (စတင် လုပ်ဆောင်) မှုကို ပြင်ဆင်သတ်မှတ်ပါတယ်။ Disabled trigger တစ်ခုက system အတွက် သိပြီးသား ဖြစ်ပေမယ့် — သူ့ရဲ့ triggering event ဖြစ်ပေါ်တဲ့အခါ execute လုပ်ခြင်း မရှိပါဘူး။ (Deferred trigger တစ်ခုအတွက်ဆိုရင် — enable အခြေအနေကို trigger function တကယ် execute လုပ်ချိန်မှာ မဟုတ်ဘဲ — event ဖြစ်ပေါ်ချိန်မှာ စစ်ဆေးပါတယ်။) နာမည်နဲ့ သတ်မှတ်ထားတဲ့ trigger တစ်ခုတည်းကို ဖြစ်စေ — table ပေါ်က triggers အားလုံးကို ဖြစ်စေ — user triggers တွေကိုပဲ ဖြစ်စေ — disable ဒါမှမဟုတ် enable လုပ်နိုင်ပါတယ် (ဒီ option က — foreign key constraints တွေ ဒါမှမဟုတ် deferrable uniqueness နဲ့ exclusion constraints တွေကို implement လုပ်ဖို့ သုံးတာလို — အတွင်းပိုင်း ထုတ်လုပ်ထားတဲ့ constraint triggers တွေကို ချန်လှပ်ပါတယ်)။ အတွင်းပိုင်း ထုတ်လုပ်ထားတဲ့ constraint triggers တွေကို disable ဒါမှမဟုတ် enable လုပ်ဖို့ — superuser privileges တွေ လိုအပ်ပါတယ်; triggers တွေ execute မလုပ်ခဲ့ရင် constraint ရဲ့ ခိုင်မာမှု (integrity) ကို အာမခံလို့ မရတော့တာမို့ — သတိထားပြီးမှ လုပ်ဆောင်သင့်ပါတယ်။

  Trigger firing ယန္တရားကို `session_replication_role` configuration variable ကလည်း သက်ရောက်မှု ရှိပါတယ်။ ရိုးရိုး enabled triggers တွေ (default) က — replication role က “origin” (default) ဒါမှမဟုတ် “local” ဖြစ်တဲ့အခါ fire ပါတယ်။ `ENABLE REPLICA` အဖြစ် သတ်မှတ်ထားတဲ့ triggers တွေက session က “replica” mode မှာ ရှိနေမှသာ fire ပြီး — `ENABLE ALWAYS` အဖြစ် သတ်မှတ်ထားတဲ့ triggers တွေကတော့ — current replication role ဘာပဲ ဖြစ်ဖြစ် fire ပါတယ်။

  ဒီ ယန္တရားရဲ့ အကျိုးသက်ရောက်မှုက — default configuration မှာ — triggers တွေက replicas တွေပေါ်မှာ fire မလုပ်ပါဘူး။ ဒါက အသုံးဝင်ပါတယ် — ဘာလို့လဲဆိုတော့ — origin ပေါ်မှာ trigger တစ်ခုက tables တွေကြား data ဖြန့်ဝေဖို့ သုံးထားရင် — replication system က ဖြန့်ဝေလိုက်တဲ့ data ကိုပါ replicate လုပ်မှာ ဖြစ်လို့ — trigger က replica ပေါ်မှာ ဒုတိယအကြိမ် fire မလုပ်သင့်ပါဘူး — အဲဒီလိုလုပ်ရင် duplication (ထပ်ပွားမှု) ဖြစ်စေလို့ပါ။ ဒါပေမယ့် — trigger ကို ပြင်ပ alerts တွေ ဖန်တီးတာလို တခြား ရည်ရွယ်ချက်အတွက် သုံးထားရင် — replicas တွေပေါ်မှာပါ fire စေဖို့ — `ENABLE ALWAYS` အဖြစ် သတ်မှတ်ထားတာ သင့်လျော်နိုင်ပါတယ်။

  ဒီ command ကို partitioned table တစ်ခုပေါ်မှာ သက်ရောက်တဲ့အခါ — `ONLY` ကို သတ်မှတ်ထားခြင်း မရှိရင် — partitions တွေထဲက သက်ဆိုင်ရာ clone triggers တွေရဲ့ အခြေအနေတွေကိုပါ update လုပ်ပါတယ်။

  ဒီ command က `SHARE ROW EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။
- **DISABLE/ENABLE [ REPLICA | ALWAYS ] RULE #** — ဒီ forms တွေက table နဲ့ သက်ဆိုင်တဲ့ rewrite rules တွေရဲ့ fire မှုကို ပြင်ဆင်သတ်မှတ်ပါတယ်။ Disabled rule တစ်ခုက system အတွက် သိပြီးသား ဖြစ်ပေမယ့် — query rewriting အတွင်းမှာ သက်ရောက်မှု မရှိပါဘူး။ Semantics (အဓိပ္ပါယ်) တွေက disabled/enabled triggers တွေနဲ့ အတူတူပါပဲ။ `ON SELECT` rules တွေကတော့ — ဒီ configuration ကို လျစ်လျူရှုပြီး — current session က non-default replication role ထဲမှာ ရှိနေရင်တောင် — views တွေ အလုပ်လုပ်နေဖို့ — အမြဲတမ်း သက်ရောက်ပါတယ်။

  Rule firing ယန္တရားကို — အပေါ်မှာ triggers တွေအတွက် ဖော်ပြခဲ့တာနဲ့ တူညီစွာ — `session_replication_role` configuration variable ကလည်း သက်ရောက်မှု ရှိပါတယ်။
- **DISABLE/ENABLE ROW LEVEL SECURITY #** — ဒီ forms တွေက table နဲ့ သက်ဆိုင်တဲ့ row security policies (row လုံခြုံရေး မူဝါဒများ) တွေရဲ့ သက်ရောက်မှုကို ထိန်းချုပ်ပါတယ်။ Enable လုပ်ထားပြီး — table အတွက် policies တွေ မရှိဘူးဆိုရင် — default-deny policy (မူရင်းအားဖြင့် ငြင်းပယ်တဲ့ မူဝါဒ) တစ်ခုကို သက်ရောက်ပါတယ်။ Row-level security ကို disable လုပ်ထားရင်တောင် — table အတွက် policies တွေ ရှိနေနိုင်တာ သတိပြုပါ။ အဲဒီလိုအခြေအနေမှာ — policies တွေကို သက်ရောက်မှာ မဟုတ်ဘဲ — လျစ်လျူရှုခံရပါလိမ့်မယ်။ CREATE POLICY ကိုလည်း ကြည့်ပါ။
- **NO FORCE/FORCE ROW LEVEL SECURITY #** — ဒီ forms တွေက — user က table ရဲ့ owner ဖြစ်နေတဲ့အခါ — table နဲ့ သက်ဆိုင်တဲ့ row security policies တွေရဲ့ သက်ရောက်မှုကို ထိန်းချုပ်ပါတယ်။ Enable လုပ်ထားရင် — user က table owner ဖြစ်နေတဲ့အခါမှာပါ row-level security policies တွေကို သက်ရောက်ပါလိမ့်မယ်။ Disabled (default) ဆိုရင် — user က table owner ဖြစ်နေတဲ့အခါ row-level security ကို သက်ရောက်မှာ မဟုတ်ပါဘူး။ CREATE POLICY ကိုလည်း ကြည့်ပါ။
- **CLUSTER ON #** — ဒီ form က နောက်ပိုင်း `CLUSTER` operations တွေအတွက် default index ကို ရွေးချယ်ပေးပါတယ်။ Table ကို တကယ် ပြန် cluster လုပ်ပေးတာ မဟုတ်ပါဘူး။

  Cluster options တွေ ပြောင်းလဲတာက `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။
- **SET WITHOUT CLUSTER #** — ဒီ form က — နောက်ဆုံး အသုံးပြုခဲ့တဲ့ `CLUSTER` index သတ်မှတ်ချက်ကို table ကနေ ဖယ်ရှားပါတယ်။ ဒါက index မသတ်မှတ်တဲ့ နောက်ပိုင်း cluster operations တွေကို သက်ရောက်မှု ရှိပါတယ်။

  Cluster options တွေ ပြောင်းလဲတာက `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။
- **SET WITHOUT OIDS #** — oid system column ကို ဖယ်ရှားဖို့ backward-compatible (နောက်ပြန် လိုက်ဖက်ညီတဲ့) syntax ပါ။ Oid system columns တွေကို နောက်တော့ ထပ်ထည့်လို့ မရတော့တာမို့ — ဒါက ဘယ်တော့မှ သက်ရောက်မှု မရှိပါဘူး။
- **SET ACCESS METHOD #** — ဒီ form က — သတ်မှတ်ထားတဲ့ access method ကို သုံးပြီး table ကို rewrite လုပ်ခြင်းအားဖြင့် — table ရဲ့ access method ကို ပြောင်းလဲပါတယ်; `DEFAULT` ကို သတ်မှတ်တာက `default_table_access_method` configuration parameter အဖြစ် သတ်မှတ်ထားတဲ့ access method ကို ရွေးချယ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် အခန်း 62 ကို ကြည့်ပါ။

  Partitioned table တစ်ခုပေါ်မှာ သက်ရောက်တဲ့အခါ — rewrite လုပ်ဖို့ data မရှိပေမယ့် — နောက်ပိုင်း ဖန်တီးတဲ့ partitions တွေက `USING` clause တစ်ခုက override မလုပ်ထားရင် — သတ်မှတ်ထားတဲ့ access method ကို default အနေနဲ့ သုံးပါလိမ့်မယ်။ `DEFAULT` ကို သတ်မှတ်တာက အရင် တန်ဖိုးတစ်ခုကို ဖယ်ရှားပြီး — နောက်ပိုင်း partitions တွေကို `default_table_access_method` ဆီ default ပြန်ဖြစ်စေပါတယ်။
- **SET TABLESPACE #** — ဒီ form က table ရဲ့ tablespace ကို သတ်မှတ်ထားတဲ့ tablespace အဖြစ် ပြောင်းပြီး — table နဲ့ သက်ဆိုင်တဲ့ data file(s) တွေကို tablespace အသစ်ဆီ ရွှေ့ပါတယ်။ Table ပေါ်က indexes တွေကိုတော့ (ရှိရင်) ရွှေ့ခြင်း မရှိပါဘူး; ဒါပေမယ့် — သူတို့ကို နောက်ထပ် `SET TABLESPACE` commands တွေနဲ့ သပ်သပ်စီ ရွှေ့လို့ ရပါတယ်။ Partitioned table တစ်ခုပေါ်မှာ သက်ရောက်တဲ့အခါ — ဘာမှ ရွှေ့ခြင်း မရှိပေမယ့် — နောက်ပိုင်း `CREATE TABLE PARTITION OF` နဲ့ ဖန်တီးတဲ့ partitions တွေက `TABLESPACE` clause တစ်ခုက override မလုပ်ထားရင် — အဲဒီ tablespace ကို သုံးပါလိမ့်မယ်။

  Current database ထဲက — tablespace တစ်ခုထဲမှာ ရှိတဲ့ — tables တွေ အားလုံးကို `ALL IN TABLESPACE` form ကို သုံးပြီး ရွှေ့နိုင်ပါတယ် — အဲဒီ form က ရွှေ့ရမယ့် tables တွေ အားလုံးကို အရင်ဆုံး lock ပြီးမှ တစ်ခုချင်းစီကို ရွှေ့ပါတယ်။ ဒီ form က `OWNED BY` ကိုလည်း ထောက်ပံ့ပြီး — အဲဒါက သတ်မှတ်ထားတဲ့ roles တွေ ပိုင်ဆိုင်တဲ့ tables တွေကိုပဲ ရွှေ့ပါတယ်။ `NOWAIT` option ကို သတ်မှတ်ထားရင် — လိုအပ်တဲ့ locks တွေ အားလုံးကို ချက်ချင်း ရယူနိုင်ခြင်း မရှိရင် — command က မအောင်မြင်ပါဘူး။ System catalogs တွေကို ဒီ command က ရွှေ့ခြင်း မရှိဘူးဆိုတာ သတိပြုပါ; လိုချင်ရင် `ALTER DATABASE` ဒါမှမဟုတ် explicit `ALTER TABLE` invocations တွေကို သုံးပါ။ `information_schema` relations တွေကိုတော့ system catalogs ရဲ့ အစိတ်အပိုင်း အဖြစ် မယူဆဘဲ — ရွှေ့ပါလိမ့်မယ်။ CREATE TABLESPACE ကိုလည်း ကြည့်ပါ။
- **SET { LOGGED | UNLOGGED } #** — ဒီ form က table ကို unlogged ကနေ logged သို့ ဒါမှမဟုတ် — အပြန်အလှန် — logged ကနေ unlogged အဖြစ် ပြောင်းလဲပါတယ် (UNLOGGED ကို ကြည့်ပါ)။ Temporary table တစ်ခုပေါ်မှာတော့ သက်ရောက်လို့ မရပါဘူး။

  ဒါက table နဲ့ ချိတ်ဆက်ထားတဲ့ sequences တွေ (identity ဒါမှမဟုတ် serial columns တွေအတွက်) ရဲ့ persistence (အမြဲတမ်း သိမ်းဆည်းမှု) ကိုလည်း ပြောင်းလဲပေးပါတယ်။ ဒါပေမယ့် — ဒီလို sequences တွေရဲ့ persistence ကို သပ်သပ်စီလည်း ပြောင်းလဲလို့ ရပါတယ်။

  ဒီ form ကို partitioned tables တွေအတွက် ထောက်ပံ့မထားပါဘူး။
- **SET ( storage_parameter [= value] [, ... ] ) #** — ဒီ form က table အတွက် storage parameters တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို ပြောင်းလဲပါတယ်။ ရနိုင်တဲ့ parameters တွေရဲ့ အသေးစိတ်အတွက် CREATE TABLE documentation ထဲက Storage Parameters ကို ကြည့်ပါ။ ဒီ command က table ရဲ့ အကြောင်းအရာတွေကို ချက်ချင်း ပြုပြင်မွမ်းမံပေးတာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ; parameter ပေါ် မူတည်ပြီး — လိုချင်တဲ့ သက်ရောက်မှုတွေ ရဖို့ — table ကို rewrite လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။ အဲဒါကို `VACUUM FULL`, `CLUSTER` ဒါမှမဟုတ် — table rewrite ကို အတင်းအကျပ် လုပ်တဲ့ `ALTER TABLE` ပုံစံတစ်ခုခုနဲ့ လုပ်နိုင်ပါတယ်။ Planner နဲ့ ဆိုင်တဲ့ parameters တွေအတွက်တော့ — ပြောင်းလဲမှုတွေက table ကို နောက်တစ်ကြိမ် lock လုပ်ချိန်ကစပြီး သက်ရောက်မှာ ဖြစ်လို့ — လောလောဆယ် execute လုပ်နေတဲ့ queries တွေကို သက်ရောက်မှာ မဟုတ်ပါဘူး။

  `fillfactor`, toast နဲ့ autovacuum storage parameters တွေအတွက်ရော — planner parameter ဖြစ်တဲ့ `parallel_workers` အတွက်ပါ — `SHARE UPDATE EXCLUSIVE` lock ကို ရယူပါလိမ့်မယ်။
- **RESET ( storage_parameter [, ... ] ) #** — ဒီ form က storage parameters တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို သူတို့ရဲ့ default တန်ဖိုးတွေဆီ ပြန်လည် သတ်မှတ်ပါတယ်။ `SET` လိုပဲ — table တစ်ခုလုံးကို update လုပ်ဖို့ table rewrite တစ်ခု လိုအပ်နိုင်ပါတယ်။
- **INHERIT parent_table #** — ဒီ form က target table ကို သတ်မှတ်ထားတဲ့ parent table ရဲ့ child အသစ်တစ်ခု အဖြစ် ထပ်ပေါင်းပါတယ်။ နောက်ပိုင်း parent ပေါ် ပြုလုပ်တဲ့ queries တွေမှာ target table ရဲ့ records တွေပါ ပါဝင်လာပါလိမ့်မယ်။ Child အဖြစ် ထပ်ပေါင်းဖို့ — target table မှာ parent ရဲ့ columns တွေ အားလုံးနဲ့ အတူတူ ပါဝင်ပြီးသား ဖြစ်ရပါမယ် (နောက်ထပ် columns တွေ ပါ ရှိနိုင်ပါတယ်)။ Columns တွေရဲ့ data types တွေက ကိုက်ညီနေရပါမယ်။

  ထို့ပြင် — parent ပေါ်က `CHECK` နဲ့ `NOT NULL` constraints တွေ အားလုံးက child ပေါ်မှာလည်း ရှိရပါမယ် — non-inheritable အဖြစ် မှတ်သားထားတဲ့ (ဆိုလိုတာက — `ALTER TABLE ... ADD CONSTRAINT ... NO INHERIT` နဲ့ ဖန်တီးထားတဲ့) constraint တွေကတော့ လျစ်လျူရှုပါတယ်။ ကိုက်ညီနေတဲ့ child-table constraints တွေ အားလုံးက non-inheritable အဖြစ် မှတ်သားထားခြင်း မရှိရပါဘူး။ လောလောဆယ် `UNIQUE`, `PRIMARY KEY` နဲ့ `FOREIGN KEY` constraints တွေကိုတော့ ထည့်တွက်မှာ မဟုတ်ပေမယ့် — ဒါက နောက်ပိုင်းမှာ ပြောင်းလဲနိုင်ပါတယ်။
- **NO INHERIT parent_table #** — ဒီ form က target table ကို သတ်မှတ်ထားတဲ့ parent table ရဲ့ children စာရင်းကနေ ဖယ်ရှားပါတယ်။ Parent table ပေါ် ပြုလုပ်တဲ့ queries တွေမှာ target table ကနေ ဆွဲထုတ်ထားတဲ့ records တွေ နောက်ထပ် ပါဝင်တော့ မဟုတ်ပါဘူး။
- **OF type_name #** — ဒီ form က table ကို — `CREATE TABLE OF` က ဖန်တီးထားသလိုမျိုး — composite type တစ်ခုနဲ့ ချိတ်ဆက်ပေးပါတယ်။ Table ရဲ့ column names နဲ့ types စာရင်းက composite type ရဲ့အရာနဲ့ အတိအကျ ကိုက်ညီရပါမယ်။ Table က တခြား table တစ်ခုခုကနေ inherit လုပ်ထားလို့ မရပါဘူး။ ဒီ ကန့်သတ်ချက်တွေက — `CREATE TABLE OF` က ညီမျှတဲ့ table definition တစ်ခုကို ခွင့်ပြုကြောင်း သေချာစေပါတယ်။
- **NOT OF #** — ဒီ form က typed table တစ်ခုကို သူ့ရဲ့ type ကနေ ခွဲထုတ်ပေးပါတယ်။
- **OWNER TO #** — ဒီ form က table, sequence, view, materialized view ဒါမှမဟုတ် foreign table ရဲ့ owner ကို သတ်မှတ်ထားတဲ့ user အဖြစ် ပြောင်းလဲပါတယ်။
- **REPLICA IDENTITY #** — ဒီ form က — update ဒါမှမဟုတ် delete လုပ်ခံရတဲ့ rows တွေကို ခွဲခြားသိရှိဖို့ — write-ahead log ထဲသို့ ရေးသွင်းတဲ့ အချက်အလက်ကို ပြောင်းလဲပါတယ်။ အများစုသော အခြေအနေတွေမှာ — column တစ်ခုချင်းစီရဲ့ တန်ဖိုးအဟောင်းကို — တန်ဖိုးအသစ်နဲ့ ကွဲပြားမှသာ log လုပ်ပါတယ်; ဒါပေမယ့် — တန်ဖိုးအဟောင်းကို externally သိမ်းဆည်းထားရင် — ပြောင်းလဲခြင်း ရှိ/မရှိ မသက်ဆိုင်ဘဲ — အမြဲတမ်း log လုပ်ပါတယ်။ ဒီ option က logical replication ကို အသုံးပြုနေမှသာ သက်ရောက်မှု ရှိပါတယ်။

  - **DEFAULT #** — Primary key ရဲ့ columns တွေရဲ့ တန်ဖိုးအဟောင်းတွေကို မှတ်တမ်းတင်ပါတယ်။ ဒါက non-system tables တွေအတွက် default ဖြစ်ပါတယ်။ Primary key မရှိတဲ့အခါ — အပြုအမူက `NOTHING` နဲ့ အတူတူပါပဲ။
  - **USING INDEX index_name #** — နာမည်ပေးထားတဲ့ index က လွှမ်းခြုံထားတဲ့ columns တွေရဲ့ တန်ဖိုးအဟောင်းတွေကို မှတ်တမ်းတင်ပါတယ် — အဲဒီ index က unique, partial မဟုတ်တဲ့, deferrable မဟုတ်တဲ့, `NOT NULL` အဖြစ် မှတ်သားထားတဲ့ columns တွေပဲ ပါဝင်တဲ့ index တစ်ခု ဖြစ်ရပါမယ်။ ဒီ index ကို drop လုပ်လိုက်ရင် — အပြုအမူက `NOTHING` နဲ့ အတူတူပါပဲ။
  - **FULL #** — Row ထဲက columns တွေ အားလုံးရဲ့ တန်ဖိုးအဟောင်းတွေကို မှတ်တမ်းတင်ပါတယ်။
  - **NOTHING #** — Row အဟောင်းအကြောင်း အချက်အလက် ဘာမှ မှတ်တမ်းတင်ခြင်း မရှိပါဘူး။ ဒါက system tables တွေအတွက် default ဖြစ်ပါတယ်။
- **RENAME #** — RENAME forms တွေက table တစ်ခုရဲ့ နာမည် (ဒါမှမဟုတ် — index, sequence, view, materialized view ဒါမှမဟုတ် foreign table ရဲ့ နာမည်)၊ table ထဲက column တစ်ခုချင်းစီရဲ့ နာမည် ဒါမှမဟုတ် — table ရဲ့ constraint တစ်ခုရဲ့ နာမည်ကို ပြောင်းလဲပါတယ်။ အောက်ခံ index ရှိတဲ့ constraint တစ်ခုကို rename လုပ်တဲ့အခါ — index ကိုပါ rename လုပ်ပါတယ်။ သိမ်းထားတဲ့ data အပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။
- **SET SCHEMA #** — ဒီ form က table ကို schema တစ်ခုခုဆီ ရွှေ့ပြောင်းပါတယ်။ Table columns တွေက ပိုင်ဆိုင်တဲ့ သက်ဆိုင်ရာ indexes, constraints နဲ့ sequences တွေကိုပါ အတူ ရွှေ့ပါတယ်။
- **ATTACH PARTITION partition_name { FOR VALUES partition_bound_spec | DEFAULT } #** — ဒီ form က ရှိပြီးသား table တစ်ခုကို (သူ့ဘာသာသူ partitioned လည်း ဖြစ်နိုင်ပါတယ်) target table ရဲ့ partition တစ်ခုအဖြစ် ချိတ်ဆွဲ (attach) ပါတယ်။ Table ကို `FOR VALUES` သုံးပြီး သီးခြား တန်ဖိုးတွေအတွက် partition အဖြစ် ဒါမှမဟုတ် — `DEFAULT` သုံးပြီး default partition အဖြစ် ချိတ်ဆွဲနိုင်ပါတယ်။ Target table ထဲက index တစ်ခုချင်းစီအတွက် — partition ထဲမှာ ညီမျှတဲ့ valid index တစ်ခု ရှိပြီးသား ဖြစ်နေရင် — `ALTER INDEX ATTACH PARTITION` ကို execute လုပ်ထားသလိုမျိုး — target table ရဲ့ index ဆီ ချိတ်ဆွဲပါလိမ့်မယ်; မဟုတ်ရင် — သက်ဆိုင်တဲ့ index အသစ်တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။ Partition ပေါ်က invalid indexes တွေကိုတော့ ကျော်လိုက်ပါတယ်။ ရှိပြီးသား table က foreign table တစ်ခုဆိုရင် — target table ပေါ်မှာ `UNIQUE` indexes တွေ ရှိနေတဲ့အခါ — အဲဒီ table ကို target table ရဲ့ partition အဖြစ် ချိတ်ဆွဲတာကို လောလောဆယ် ခွင့်မပြုဘူးဆိုတာ သတိပြုပါ။ (CREATE FOREIGN TABLE ကိုလည်း ကြည့်ပါ။) Target table ထဲမှာ ရှိနေတဲ့ user-defined row-level trigger တစ်ခုချင်းစီအတွက် — သက်ဆိုင်ရာ trigger တစ်ခုကို ချိတ်ဆွဲလိုက်တဲ့ table ထဲမှာ ဖန်တီးပေးပါတယ်။

  `FOR VALUES` သုံးတဲ့ partition တစ်ခုက — `partition_bound_spec` အတွက် `CREATE TABLE` နဲ့ အတူတူ syntax ကို သုံးပါတယ်။ Partition bound specification က target table ရဲ့ partitioning strategy နဲ့ partition key နဲ့ ကိုက်ညီရပါမယ်။ ချိတ်ဆွဲရမယ့် table မှာ target table ရဲ့ columns တွေ အားလုံး ရှိရပြီး — ပိုလျှံတဲ့ columns တွေ မရှိရပါဘူး; ထို့ပြင် column types တွေကလည်း ကိုက်ညီရပါမယ်။ ပြီးတော့ — target table ရဲ့ `NOT NULL` နဲ့ `CHECK` constraints တွေ အားလုံး ရှိရပြီး — `NO INHERIT` အဖြစ် မှတ်သားထားခြင်း မရှိရပါဘူး။ လောလောဆယ် `FOREIGN KEY` constraints တွေကိုတော့ ထည့်တွက်မှာ မဟုတ်ပါဘူး။ Parent table က `UNIQUE` နဲ့ `PRIMARY KEY` constraints တွေကို — partition ထဲမှာ မရှိသေးဘူးဆိုရင် — partition ထဲမှာ ဖန်တီးပေးပါလိမ့်မယ်။

  Partition အသစ်က သာမန် table တစ်ခုဆိုရင် — table ထဲက ရှိပြီးသား rows တွေ partition constraint ကို မချိုးဖောက်ဘူးဆိုတာ စစ်ဆေးဖို့ — table scan တစ်ခုလုံး လုပ်ဆောင်ပါတယ်။ ဒီ command ကို run မလုပ်ခင် — table ထဲမှာ လိုချင်တဲ့ partition constraint ကို ကျေနပ်တဲ့ rows တွေကိုပဲ ခွင့်ပြုတဲ့ valid `CHECK` constraint တစ်ခုကို table ဆီ ထပ်ပေါင်းထားခြင်းအားဖြင့် — ဒီ scan ကို ရှောင်နိုင်ပါတယ်။ Partition constraint ကို validate လုပ်ဖို့ table ကို scan စရာ မလိုဘူးဆိုတာ ဆုံးဖြတ်ဖို့ `CHECK` constraint ကို အသုံးပြုပါလိမ့်မယ်။ ဒါပေမယ့် — partition keys တွေထဲက တစ်ခုခုက expression တစ်ခု ဖြစ်ပြီး — partition က NULL တန်ဖိုးတွေကို လက်မခံဘူးဆိုရင်တော့ — ဒါက အလုပ်မလုပ်ပါဘူး။ NULL တန်ဖိုးတွေ လက်မခံတဲ့ list partition တစ်ခုကို ချိတ်ဆွဲနေတယ်ဆိုရင် — partition key column ပေါ်မှာ `NOT NULL` constraint တစ်ခုကိုလည်း ထပ်ပေါင်းပါ — column က expression တစ်ခု မဟုတ်ဘူးဆိုရင်။

  Partition အသစ်က foreign table တစ်ခုဆိုရင် — foreign table ထဲက rows တွေ အားလုံး partition constraint ကို လိုက်နာမှု ရှိမရှိ စစ်ဆေးဖို့ ဘာမှ လုပ်ဆောင်ခြင်း မရှိပါဘူး။ (Foreign table ပေါ်က constraints အကြောင်း CREATE FOREIGN TABLE ထဲက ဆွေးနွေးချက်ကို ကြည့်ပါ။)

  Table တစ်ခုမှာ default partition ရှိနေတဲ့အခါ — partition အသစ်တစ်ခု သတ်မှတ်လိုက်တာက default partition ရဲ့ partition constraint ကို ပြောင်းလဲစေပါတယ်။ Default partition ထဲမှာ — partition အသစ်ဆီ ရွှေ့ပြောင်းစရာ လိုမယ့် rows တွေ မပါဝင်ရပါဘူး — ပြီးတော့ — ဘာမှ မရှိဘူးဆိုတာ စစ်ဆေးဖို့ — scan လုပ်ခံရပါလိမ့်မယ်။ Partition အသစ်ရဲ့ scan လိုပဲ — ဒီ scan ကိုလည်း — သင့်လျော်တဲ့ `CHECK` constraint တစ်ခု ရှိနေရင် ရှောင်နိုင်ပါတယ်။ Partition အသစ်ရဲ့ scan လိုပဲ — default partition က foreign table တစ်ခု ဖြစ်နေရင် — ဒီ scan ကို အမြဲတမ်း ကျော်လိုက်ပါတယ်။

  Partition တစ်ခု ချိတ်ဆွဲတာက — ချိတ်ဆွဲခံရတဲ့ table ပေါ်မှာရော default partition (ရှိရင်) ပေါ်မှာပါ `ACCESS EXCLUSIVE` locks တွေအပြင် — parent table ပေါ်မှာ `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကိုပါ ရယူပါတယ်။

  ချိတ်ဆွဲခံရတဲ့ table ကိုယ်တိုင် partitioned table တစ်ခု ဖြစ်နေရင် — sub-partitions တွေ အားလုံးပေါ်မှာလည်း နောက်ထပ် locks တွေ ကိုင်ထားရပါမယ်။ Default partition ကိုယ်တိုင် partitioned table တစ်ခု ဖြစ်နေရင်လည်း အလားတူပါပဲ။ Sub-partitions တွေရဲ့ locking ကို — အပိုင်း 5.12.2.2 မှာ ဖော်ပြထားတဲ့အတိုင်း — `CHECK` constraint တစ်ခု ထပ်ပေါင်းခြင်းအားဖြင့် ရှောင်နိုင်ပါတယ်။
- **DETACH PARTITION partition_name [ CONCURRENTLY | FINALIZE ] #** — ဒီ form က target table ရဲ့ သတ်မှတ်ထားတဲ့ partition ကို ခွဲထုတ် (detach) ပါတယ်။ ခွဲထုတ်လိုက်တဲ့ partition က standalone table တစ်ခုအဖြစ် ဆက်လက် တည်ရှိနေပေမယ့် — ဘယ်ကနေ ခွဲထုတ်ခဲ့တဲ့ table နဲ့ ဘယ်လို ဆက်စပ်မှုမှ မရှိတော့ပါဘူး။ Target table ရဲ့ indexes တွေဆီ ချိတ်ဆွဲထားခဲ့တဲ့ indexes တွေ အားလုံးကို ခွဲထုတ်ပါတယ်။ Target table ထဲက သူတို့ရဲ့ clones အဖြစ် ဖန်တီးထားခဲ့တဲ့ triggers တွေ အားလုံးကို ဖယ်ရှားပါတယ်။ ဒီ partitioned table ကို foreign key constraints တွေထဲမှာ ရည်ညွှန်းထားတဲ့ tables တွေ အားလုံးပေါ်မှာ `SHARE` lock တစ်ခုကို ရယူပါတယ်။

  `CONCURRENTLY` ကို သတ်မှတ်ထားရင် — partitioned table ကို ဝင်ရောက်သုံးစွဲနေနိုင်တဲ့ တခြား sessions တွေကို ပိတ်ဆို့တာကို ရှောင်ဖို့ — လျှော့ချထားတဲ့ lock level နဲ့ run ပါတယ်။ ဒီ mode မှာ — transactions နှစ်ခုကို အတွင်းပိုင်းမှာ သုံးပါတယ်။ ပထမ transaction အတွင်း — parent table ရော partition ပေါ်မှာပါ `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကို ရယူပြီး — partition ကို detach လုပ်ဆဲ အဖြစ် မှတ်သားပါတယ်; အဲဒီအချိန်မှာ transaction ကို commit လုပ်ပြီး — partitioned table ကို သုံးနေတဲ့ transactions တွေ အားလုံး ပြီးဆုံးတာကို စောင့်ဆိုင်းပါတယ်။ အဲဒီ transactions တွေ အားလုံး ပြီးဆုံးသွားတာနဲ့ — ဒုတိယ transaction က partitioned table ပေါ်မှာ `SHARE UPDATE EXCLUSIVE` ကို ရယူပြီး — partition ပေါ်မှာ `ACCESS EXCLUSIVE` ကို ရယူကာ — detach လုပ်ငန်းစဉ် ပြီးမြောက်ပါတယ်။ Partition constraint ကို ပုံတူပွားထားတဲ့ `CHECK` constraint တစ်ခုကို partition ပေါ်မှာ ထပ်ပေါင်းပါတယ်။ `CONCURRENTLY` ကို transaction block တစ်ခုအတွင်းမှာ run လို့ မရသလို — partitioned table ထဲမှာ default partition တစ်ခု ပါဝင်နေရင်လည်း ခွင့်မပြုပါဘူး။

  `FINALIZE` ကို သတ်မှတ်ထားရင် — cancel ဒါမှမဟုတ် အနှောင့်အယှက် ဖြစ်ခဲ့တဲ့ အရင် `DETACH CONCURRENTLY` invocation တစ်ခုကို ပြီးမြောက်စေပါတယ်။ Partitioned table တစ်ခုထဲမှာ တစ်ကြိမ်မှာ pending detach ဖြစ်နေတဲ့ partition တစ်ခုထက် ပို မရှိနိုင်ပါဘူး။

`RENAME`, `SET SCHEMA`, `ATTACH PARTITION` နဲ့ `DETACH PARTITION` တွေ ကလွဲလို့ — table တစ်ခုတည်းအပေါ် သက်ရောက်တဲ့ `ALTER TABLE` ပုံစံတွေ အားလုံးကို — အတူတကွ သက်ရောက်စေဖို့ — ပြောင်းလဲမှု အများအပြားရဲ့ စာရင်းတစ်ခုထဲမှာ ပေါင်းစပ်နိုင်ပါတယ်။ ဥပမာ — command တစ်ခုတည်းထဲမှာ columns အများအပြား ထပ်ပေါင်းတာ ဒါမှမဟုတ် columns အများအပြားရဲ့ type ကို ပြောင်းတာ ဖြစ်နိုင်ပါတယ်။ Table ကြီးတွေအတွက် ဒါက အထူး အသုံးဝင်ပါတယ် — ဘာလို့လဲဆိုတော့ — table ပေါ်ကို တစ်ခါပဲ ဖြတ်သွားဖို့ (one pass) လိုတာမို့ပါ။

`ALTER TABLE` ကို သုံးဖို့ — table ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Table တစ်ခုရဲ့ schema ဒါမှမဟုတ် tablespace ကို ပြောင်းဖို့ — schema အသစ် ဒါမှမဟုတ် tablespace အသစ်ပေါ်မှာ `CREATE` privilege လည်း ရှိရပါမယ်။ Table ကို parent table တစ်ခုရဲ့ child အသစ်အဖြစ် ထပ်ပေါင်းဖို့ — parent table ကိုလည်း ပိုင်ဆိုင်ရပါမယ်။ ထို့ပြင် — table တစ်ခုကို table ရဲ့ partition အသစ်အဖြစ် ချိတ်ဆွဲဖို့ — ချိတ်ဆွဲခံရမယ့် table ကို ပိုင်ဆိုင်ရပါမယ်။ Owner ကို ပြောင်းဖို့ — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပါမယ် — ပြီးတော့ အဲဒီ role က table ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းတာက table ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် လုပ်လို့မရတဲ့ ဘာမှ မလုပ်နိုင်ဘူးဆိုတာကို သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် table ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။) Column တစ်ခု ထပ်ပေါင်းဖို့ ဒါမှမဟုတ် column type တစ်ခု ပြောင်းဖို့ ဒါမှမဟုတ် `OF` clause ကို သုံးဖို့ — data type ပေါ်မှာ `USAGE` privilege လည်း ရှိရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS #** — Table မရှိဘူးဆိုရင် error တစ်ခု ပစ်ချခြင်း မပြုပါနဲ့။ ဒီလိုအခြေအနေမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name #** — ပြောင်းလဲရမယ့် ရှိပြီးသား table တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။ Table နာမည် မတိုင်ခင် `ONLY` ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုကိုပဲ ပြောင်းလဲပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — table နဲ့ သူ့ရဲ့ descendant tables (သားစဉ်မြေးဆက် tables) (ရှိရင်) အားလုံးကို ပြောင်းလဲပါတယ်။ Optional အနေနဲ့ — descendant tables တွေပါ ပါဝင်တယ်ဆိုတာကို အတိအကျ ညွှန်ပြဖို့ — table နာမည်ရဲ့ နောက်မှာ * ကို သတ်မှတ်နိုင်ပါတယ်။
- **column_name #** — Column အသစ် ဒါမှမဟုတ် ရှိပြီးသား column တစ်ခုရဲ့ နာမည်။
- **new_column_name #** — ရှိပြီးသား column တစ်ခုအတွက် နာမည်အသစ်။
- **new_name #** — Table အတွက် နာမည်အသစ်။
- **data_type #** — Column အသစ်ရဲ့ data type ဒါမှမဟုတ် — ရှိပြီးသား column တစ်ခုအတွက် data type အသစ်။
- **table_constraint #** — Table အတွက် table constraint အသစ်။
- **constraint_name #** — Constraint အသစ် ဒါမှမဟုတ် ရှိပြီးသား constraint တစ်ခုရဲ့ နာမည်။
- **CASCADE #** — Drop လုပ်လိုက်တဲ့ column ဒါမှမဟုတ် constraint ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို (ဥပမာ — column ကို ရည်ညွှန်းထားတဲ့ views) — ပြီးတော့ — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT #** — Dependent objects တွေ ရှိနေရင် column ဒါမှမဟုတ် constraint ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default အပြုအမူ ဖြစ်ပါတယ်။
- **trigger_name #** — Disable ဒါမှမဟုတ် enable လုပ်ရမယ့် trigger တစ်ခုတည်းရဲ့ နာမည်။
- **ALL #** — Table နဲ့ သက်ဆိုင်တဲ့ triggers တွေ အားလုံးကို disable ဒါမှမဟုတ် enable လုပ်ပါတယ်။ (Triggers တွေထဲက တစ်ခုခုက — foreign key constraints တွေ ဒါမှမဟုတ် deferrable uniqueness နဲ့ exclusion constraints တွေကို implement လုပ်ဖို့ သုံးတာလို — အတွင်းပိုင်း ထုတ်လုပ်ထားတဲ့ constraint triggers တွေ ဖြစ်နေရင် — superuser privilege လိုအပ်ပါတယ်။)
- **USER #** — Foreign key constraints တွေ ဒါမှမဟုတ် deferrable uniqueness နဲ့ exclusion constraints တွေကို implement လုပ်ဖို့ သုံးတာလို — အတွင်းပိုင်း ထုတ်လုပ်ထားတဲ့ constraint triggers တွေ ကလွဲလို့ — table နဲ့ သက်ဆိုင်တဲ့ triggers တွေ အားလုံးကို disable ဒါမှမဟုတ် enable လုပ်ပါတယ်။
- **index_name #** — ရှိပြီးသား index တစ်ခုရဲ့ နာမည်။
- **storage_parameter #** — Table storage parameter တစ်ခုရဲ့ နာမည်။
- **value #** — Table storage parameter တစ်ခုအတွက် တန်ဖိုးအသစ်။ Parameter ပေါ် မူတည်ပြီး — ဒါက ဂဏန်းတစ်ခု ဒါမှမဟုတ် စကားလုံးတစ်လုံး ဖြစ်နိုင်ပါတယ်။
- **parent_table #** — ဒီ table နဲ့ ချိတ်ဆက်ရန် ဒါမှမဟုတ် ချိတ်ဆက်မှု ဖြုတ်ရန် parent table တစ်ခု။
- **new_owner #** — Table ရဲ့ owner အသစ်ရဲ့ user နာမည်။
- **new_access_method #** — Table ကို ပြောင်းလဲမယ့် access method ရဲ့ နာမည်။
- **new_tablespace #** — Table ကို ရွှေ့ပြောင်းမယ့် tablespace ရဲ့ နာမည်။
- **new_schema #** — Table ကို ရွှေ့ပြောင်းမယ့် schema ရဲ့ နာမည်။
- **partition_name #** — Partition အသစ်တစ်ခုအဖြစ် ချိတ်ဆွဲရန် ဒါမှမဟုတ် ဒီ table ကနေ ခွဲထုတ်ရန် table တစ်ခုရဲ့ နာမည်။
- **partition_bound_spec #** — Partition အသစ်တစ်ခုအတွက် partition bound specification (partition နယ်နိမိတ် သတ်မှတ်ချက်)။ ၎င်းရဲ့ syntax အကြောင်း နောက်ထပ် အသေးစိတ်အတွက် CREATE TABLE ကို ကိုးကားပါ။

## Notes (မှတ်စုများ)

`COLUMN` ဆိုတဲ့ keyword က noise (အလှဆင် စကားလုံး) သက်သက် ဖြစ်ပြီး — ချန်လိုက်လို့ ရပါတယ်။

Column တစ်ခုကို `ADD COLUMN` နဲ့ ထပ်ပေါင်းပြီး — non-volatile (မပြောင်းလဲတဲ့) `DEFAULT` တစ်ခု သတ်မှတ်ထားရင် — default တန်ဖိုးကို statement ရဲ့ အချိန်မှာ အကဲဖြတ်ပြီး — ရလဒ်ကို table ရဲ့ metadata ထဲမှာ သိမ်းဆည်းပါတယ် — ရှိပြီးသား rows တွေကို access လုပ်တဲ့အခါ အဲဒီကနေ ပြန်ပေးပါလိမ့်မယ်။ တန်ဖိုးကို table ကို rewrite လုပ်တဲ့အခါမှသာ သက်ရောက်လို့ — table ကြီးတွေပေါ်မှာတောင် `ALTER TABLE` ကို အလွန် မြန်ဆန်စေပါတယ်။ Column constraints တွေ ဘာမှ သတ်မှတ်မထားရင် — `DEFAULT` အဖြစ် NULL ကို သုံးပါတယ်။ ဘယ်အခြေအနေမှာမှ table ကို rewrite လုပ်ဖို့ မလိုအပ်ပါဘူး။

Volatile (အချိန်အလိုက် ပြောင်းလဲနေတဲ့) `DEFAULT` (ဥပမာ — `clock_timestamp()`) ပါတဲ့ column တစ်ခု၊ stored generated column တစ်ခု၊ identity column တစ်ခု ဒါမှမဟုတ် — constraints တွေ ပါတဲ့ domain data type ရှိတဲ့ column တစ်ခုကို ထပ်ပေါင်းတာက — table တစ်ခုလုံးနဲ့ သူ့ရဲ့ indexes တွေကို rewrite လုပ်စေပါလိမ့်မယ်။ Virtual generated column တစ်ခု ထပ်ပေါင်းတာကတော့ ဘယ်တော့မှ rewrite မလိုအပ်ပါဘူး။

ရှိပြီးသား column တစ်ခုရဲ့ type ကို ပြောင်းတာက — သာမန်အားဖြင့် — table တစ်ခုလုံးနဲ့ သူ့ရဲ့ indexes တွေကို rewrite လုပ်စေပါတယ်။ ခြွင်းချက်အနေနဲ့ — ရှိပြီးသား column တစ်ခုရဲ့ type ကို ပြောင်းတဲ့အခါ — `USING` clause က column ရဲ့ အကြောင်းအရာတွေကို မပြောင်းလဲဘဲ — အဟောင်း type က အသစ် type ဆီ binary coercible (ဒွိစနစ် ပြောင်းလွဲလို့ရ) ဖြစ်တာ ဒါမှမဟုတ် — အသစ် type အပေါ်မှာ ချုပ်ချယ်မှု မရှိတဲ့ domain တစ်ခု ဖြစ်နေရင် — table rewrite မလိုအပ်ပါဘူး။ ဒါပေမယ့် — system က index အသစ်က ရှိပြီးသား index နဲ့ ယုတ္တိအရ ညီမျှတယ်လို့ စစ်ဆေး အတည်ပြုနိုင်မှသာ လွဲလို့ — indexes တွေကို ဆက်ပြီး rebuild လုပ်ပါလိမ့်မယ်။ ဥပမာ — column တစ်ခုရဲ့ collation ကို ပြောင်းလိုက်ရင် — sort order အသစ်က ကွဲပြားနိုင်လို့ — index rebuild တစ်ခု လိုအပ်ပါတယ်။ ဒါပေမယ့် — collation ပြောင်းလဲမှု မရှိဘူးဆိုရင် — ဒီ data types တွေက အတူတူ sort လုပ်လို့ — column တစ်ခုကို indexes တွေ rebuild မလုပ်ဘဲ `text` ကနေ `varchar` ဆီ (ဒါမှမဟုတ် အပြန်အလှန်) ပြောင်းလဲလို့ ရပါတယ်။

Table နဲ့/သို့မဟုတ် index rebuilds တွေက — table ကြီးတစ်ခုအတွက် — အချိန် သိသိသာသာ ကြာနိုင်ပြီး — ယာယီအားဖြင့် disk space နှစ်ဆလောက်အထိ လိုအပ်နိုင်ပါတယ်။

`CHECK` ဒါမှမဟုတ် `NOT NULL` constraint တစ်ခု ထပ်ပေါင်းတာက — ရှိပြီးသား rows တွေ constraint ကို ကျေနပ်မှု ရှိမရှိ စစ်ဆေးဖို့ — table ကို scan လုပ်ဖို့ လိုအပ်ပေမယ့် — table rewrite တော့ မလိုအပ်ပါဘူး။ `CHECK` constraint တစ်ခုကို `NOT ENFORCED` အဖြစ် ထပ်ပေါင်းရင် — ဘာ စစ်ဆေးမှုမှ လုပ်ဆောင်မှာ မဟုတ်ပါဘူး။

အလားတူ — partition အသစ်တစ်ခု ချိတ်ဆွဲတဲ့အခါ — ရှိပြီးသား rows တွေ partition constraint ကို ကျေနပ်မှု ရှိမရှိ စစ်ဆေးဖို့ — scan လုပ်ခံရနိုင်ပါတယ်။

`ALTER TABLE` တစ်ခုတည်းထဲမှာ ပြောင်းလဲမှု အများအပြား သတ်မှတ်နိုင်တဲ့ option ကို ပေးထားရတဲ့ အဓိက အကြောင်းရင်းက — table scans ဒါမှမဟုတ် rewrites အများအပြားကို — table ပေါ်ကို တစ်ခါပဲ ဖြတ်သွားတဲ့ ပုံစံတစ်ခုတည်းထဲမှာ ပေါင်းစပ်နိုင်လို့ ဖြစ်ပါတယ်။

Foreign-key, check ဒါမှမဟုတ် not-null constraints အသစ်တွေကို စစ်ဆေးဖို့ table ကြီးတစ်ခုကို scan လုပ်တာက အချိန် အများကြီး ကြာနိုင်ပြီး — `ALTER TABLE ADD CONSTRAINT` command ကို commit လုပ်တဲ့အထိ — table ပေါ်က တခြား updates တွေ အားလုံး lock ချခံထားရပါတယ်။ `NOT VALID` constraint option ရဲ့ အဓိက ရည်ရွယ်ချက်က — concurrent updates တွေအပေါ် constraint ထပ်ပေါင်းတာရဲ့ သက်ရောက်မှုကို လျှော့ချဖို့ ဖြစ်ပါတယ်။ `NOT VALID` နဲ့ဆိုရင် — `ADD CONSTRAINT` command က table ကို scan မလုပ်ဘဲ — ချက်ချင်း commit လုပ်လို့ ရပါတယ်။ အဲဒီနောက်မှာ — ရှိပြီးသား rows တွေ constraint ကို ကျေနပ်မှု ရှိမရှိ စစ်ဆေးဖို့ — `VALIDATE CONSTRAINT` command တစ်ခုကို ထုတ်ပေးနိုင်ပါတယ်။ Validation အဆင့်က — တခြား transactions တွေက သူတို့ insert ဒါမှမဟုတ် update လုပ်တဲ့ rows တွေအတွက် constraint ကို အတင်းအကျပ် လုပ်ဆောင်နေမှာ ဖြစ်တယ်ဆိုတာ သိတာမို့ — concurrent updates တွေကို lock ချထားဖို့ မလိုပါဘူး; ကြိုတင် ရှိနေတဲ့ rows တွေကိုပဲ စစ်ဆေးဖို့ လိုပါတယ်။ ဒါကြောင့် — validation က ပြောင်းလဲနေတဲ့ table ပေါ်မှာ `SHARE UPDATE EXCLUSIVE` lock တစ်ခုကိုပဲ ရယူပါတယ်။ (Constraint က foreign key တစ်ခုဆိုရင် — constraint က ရည်ညွှန်းထားတဲ့ table ပေါ်မှာ `ROW SHARE` lock တစ်ခုလည်း လိုအပ်ပါတယ်။) Concurrency တိုးတက်စေတာအပြင် — table ထဲမှာ ကြိုတင် ရှိနေတဲ့ violations တွေ ပါဝင်နေတယ်လို့ သိရတဲ့ အခြေအနေတွေမှာလည်း — `NOT VALID` နဲ့ `VALIDATE CONSTRAINT` ကို သုံးတာ အသုံးဝင်နိုင်ပါတယ်။ Constraint စတင် သက်ရောက်သွားတာနဲ့ — violations အသစ်တွေ ထပ်ထည့်လို့ မရတော့ဘဲ — `VALIDATE CONSTRAINT` နောက်ဆုံး အောင်မြင်တဲ့အထိ — ရှိပြီးသား ပြဿနာတွေကို အားလပ်ချိန်မှာ ပြုပြင်နိုင်ပါတယ်။

`DROP COLUMN` form က column ကို ရုပ်ပိုင်းဆိုင်ရာအရ ဖယ်ရှားပေးတာ မဟုတ်ဘဲ — SQL operations တွေအတွက် မမြင်ရအောင် လုပ်ပေးရုံသာ ဖြစ်ပါတယ်။ Table ထဲက နောက်ပိုင်း insert နဲ့ update operations တွေက column အတွက် null တန်ဖိုးတစ်ခုကို သိမ်းဆည်းပါလိမ့်မယ်။ ဒါကြောင့် — column တစ်ခုကို drop လုပ်တာက မြန်ဆန်ပေမယ့် — drop လုပ်လိုက်တဲ့ column က သိမ်းပိုက်ထားတဲ့ space ကို ပြန်လည် ရယူခြင်း မရှိတာမို့ — table ရဲ့ on-disk အရွယ်အစားကို ချက်ချင်း လျှော့ချပေးတာ မဟုတ်ပါဘူး။ ရှိပြီးသား rows တွေ update လုပ်ခံရတာနဲ့အမျှ — space ကို အချိန်ကြာလာတာနဲ့ ပြန်လည် ရယူပါလိမ့်မယ်။

Drop လုပ်လိုက်တဲ့ column က သိမ်းပိုက်ထားတဲ့ space ကို ချက်ချင်း ပြန်လည် ရယူချင်ရင် — table တစ်ခုလုံးရဲ့ rewrite ကို လုပ်ဆောင်ပေးတဲ့ `ALTER TABLE` ပုံစံတစ်ခုခုကို execute လုပ်နိုင်ပါတယ်။ ဒါက — drop လုပ်လိုက်တဲ့ column ကို null တန်ဖိုးနဲ့ အစားထိုးပြီး — row တစ်ခုချင်းစီကို ပြန်လည် တည်ဆောက်စေပါတယ်။

`ALTER TABLE` ရဲ့ rewriting ပုံစံတွေက MVCC-safe (MVCC နဲ့ လုံခြုံမှု ရှိ) မဟုတ်ပါဘူး။ Table rewrite တစ်ခု ပြီးတဲ့ နောက်မှာ — concurrent transactions တွေက rewrite မဖြစ်ပွားခင် ရိုက်ထားတဲ့ snapshot (ရုပ်ပုံ) တစ်ခုကို သုံးနေရင် — table က သူတို့အတွက် အလွတ် ဖြစ်နေသလို ပေါ်ပါလိမ့်မယ်။ နောက်ထပ် အသေးစိတ်အတွက် [အပိုင်း 13.6](/docs/postgresql/mvcc-caveats) ကို ကြည့်ပါ။

`SET DATA TYPE` ရဲ့ `USING` option က — row ရဲ့ တန်ဖိုးအဟောင်းတွေ ပါဝင်တဲ့ ဘယ် expression ကိုမဆို သတ်မှတ်နိုင်ပါတယ်; ဆိုလိုတာက — ပြောင်းလဲနေတဲ့ column တင်မကဘဲ — တခြား columns တွေကိုပါ ရည်ညွှန်းနိုင်ပါတယ်။ ဒါက `SET DATA TYPE` syntax နဲ့ အလွန် ယေဘုယျကျတဲ့ conversions တွေကို လုပ်ဆောင်နိုင်စေပါတယ်။ ဒီ ပြောင်းလွယ်ပြင်လွယ် ရှိတာကြောင့် — `USING` expression ကို column ရဲ့ default တန်ဖိုး (ရှိရင်) ပေါ်မှာ သက်ရောက်ခြင်း မရှိပါဘူး; ရလဒ်က default တစ်ခုအတွက် လိုအပ်သလို constant expression တစ်ခု မဟုတ်နိုင်လို့ပါ။ ဒါက ဆိုလိုတာက — type အဟောင်းကနေ အသစ်ဆီ implicit ဒါမှမဟုတ် assignment cast မရှိတဲ့အခါ — `USING` clause ပေးထားရင်တောင် — `SET DATA TYPE` က default ကို ပြောင်းလဲဖို့ မအောင်မြင်နိုင်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ — `DROP DEFAULT` နဲ့ default ကို ဖယ်ရှားပြီး — `ALTER TYPE` ကို လုပ်ဆောင်ကာ — သင့်လျော်တဲ့ default အသစ်တစ်ခု ထပ်ပေါင်းဖို့ `SET DEFAULT` ကို သုံးပါ။ Column ပါဝင်ပတ်သက်နေတဲ့ indexes နဲ့ constraints တွေအတွက်လည်း အလားတူ ထည့်သွင်း စဉ်းစားမှုတွေ သက်ရောက်ပါတယ်။

Table တစ်ခုမှာ descendant tables တွေ ရှိနေရင် — descendants တွေမှာပါ အလားတူ မလုပ်ဘဲ — parent table ထဲက column တစ်ခုကို ထပ်ပေါင်းခြင်း၊ rename လုပ်ခြင်း ဒါမှမဟုတ် type ပြောင်းခြင်း ပြုလုပ်ဖို့ ခွင့်မပြုပါဘူး။ ဒါက descendants တွေမှာ parent နဲ့ ကိုက်ညီတဲ့ columns တွေ အမြဲတမ်း ရှိနေတာကို သေချာစေပါတယ်။ အလားတူ — `CHECK` constraint တစ်ခုကို — descendants တွေ အားလုံးမှာပါ rename မလုပ်ဘဲ — parent ထဲမှာတော့ rename လုပ်လို့ မရပါဘူး — ဒါမှ `CHECK` constraints တွေက parent နဲ့ သူ့ရဲ့ descendants တွေကြားမှာပါ ကိုက်ညီနေမှာ ဖြစ်ပါတယ်။ (ဒီ ကန့်သတ်ချက်က index-based constraints တွေအတွက်တော့ သက်ရောက်မှု မရှိပါဘူး။) ထို့ပြင် — parent ကနေ select လုပ်တာက သူ့ရဲ့ descendants တွေကနေပါ select လုပ်တာနဲ့ တူလို့ — parent ပေါ်က constraint တစ်ခုကို — အဲဒီ descendants တွေအတွက်ပါ valid အဖြစ် မှတ်သားထားခြင်း မရှိရင် — valid အဖြစ် မှတ်သားလို့ မရပါဘူး။ ဒီ အခြေအနေတွေ အားလုံးမှာ — `ALTER TABLE ONLY` ကို ငြင်းပယ်ပါလိမ့်မယ်။

Recursive (ဆင့်ပွား ဆက်လုပ်) `DROP COLUMN` operation တစ်ခုက — descendant က အဲဒီ column ကို တခြား parents တွေကနေ inherit မလုပ်ထားဘဲ — column ရဲ့ လွတ်လပ်တဲ့ (independent) definition တစ်ခုလည်း ဘယ်တော့မှ မရှိခဲ့ဘူးဆိုမှသာ — descendant table ရဲ့ column ကို ဖယ်ရှားပါတယ်။ Nonrecursive `DROP COLUMN` (ဆိုလိုတာက — `ALTER TABLE ONLY ... DROP COLUMN`) က descendant columns တွေကို ဘယ်တော့မှ မဖယ်ရှားဘဲ — သူတို့ကို inherited မဟုတ်ဘဲ — လွတ်လပ်စွာ သတ်မှတ်ထားတာတွေ အဖြစ် မှတ်သားလိုက်ပါတယ်။ Partitioned table တစ်ခုအတွက် — nonrecursive `DROP COLUMN` command က မအောင်မြင်ပါဘူး — ဘာလို့လဲဆိုတော့ — table တစ်ခုရဲ့ partitions တွေ အားလုံးမှာ partitioning root ရဲ့ columns တွေနဲ့ အတူတူ columns တွေ ရှိရလို့ပါ။

Identity columns တွေအတွက် လုပ်ဆောင်ချက်တွေ (`ADD GENERATED`, `SET` စသဖြင့်, `DROP IDENTITY`) ရော — `CLUSTER`, `OWNER` နဲ့ `TABLESPACE` လုပ်ဆောင်ချက်တွေပါ — descendant tables တွေဆီ ဘယ်တော့မှ recurse မလုပ်ပါဘူး; ဆိုလိုတာက — သူတို့က `ONLY` ကို သတ်မှတ်ထားသလိုမျိုး အမြဲတမ်း ပြုမူပါတယ်။ Trigger အခြေအနေတွေကို သက်ရောက်တဲ့ လုပ်ဆောင်ချက်တွေက partitioned tables တွေရဲ့ partitions တွေဆီ recurse လုပ်ပေမယ့် (`ONLY` ကို သတ်မှတ်ထားခြင်း မရှိရင်) — traditional-inheritance descendants တွေဆီတော့ ဘယ်တော့မှ recurse မလုပ်ပါဘူး။ Constraint တစ်ခု ထပ်ပေါင်းတာက `NO INHERIT` အဖြစ် မှတ်သားမထားတဲ့ `CHECK` constraints တွေအတွက်ပဲ recurse လုပ်ပါတယ်။

System catalog table တစ်ခုရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို ပြောင်းလဲခြင်း ခွင့်မပြုပါဘူး။

Valid parameters တွေရဲ့ နောက်ထပ် ဖော်ပြချက်အတွက် [CREATE TABLE](/docs/postgresql/sql-createtable) ကို ကိုးကားပါ။ Inheritance အကြောင်း နောက်ထပ် အချက်အလက်တွေက [အခန်း 5](https://www.postgresql.org/docs/current/ddl.html) မှာ ရှိပါတယ်။

## Examples (ဥပမာများ)

Table တစ်ခုထဲသို့ `varchar` type ရှိတဲ့ column တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD COLUMN address varchar(30);
```

ဒါက table ထဲက ရှိပြီးသား rows တွေ အားလုံးကို — column အသစ်အတွက် null တန်ဖိုးတွေနဲ့ — ဖြည့်စေပါလိမ့်မယ်။

Non-null default တစ်ခုနဲ့ column တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE measurements
  ADD COLUMN mtime timestamp with time zone DEFAULT now();
```

ရှိပြီးသား rows တွေကို — column အသစ်ရဲ့ တန်ဖိုးအနေနဲ့ — current time (လက်ရှိ အချိန်) နဲ့ ဖြည့်ပြီး — နောက်ပိုင်း rows အသစ်တွေကတော့ — သူတို့ ထည့်သွင်းချိန်ကို ရရှိပါလိမ့်မယ်။

Column တစ်ခုကို ထပ်ပေါင်းပြီး — နောက်ပိုင်း သုံးမယ့် default နဲ့ မတူတဲ့ တန်ဖိုးတစ်ခုနဲ့ ဖြည့်ဖို့:

```sql
ALTER TABLE transactions
  ADD COLUMN status varchar(30) DEFAULT 'old',
  ALTER COLUMN status SET default 'current';
```

ရှိပြီးသား rows တွေကို `old` နဲ့ ဖြည့်ပြီး — နောက်ပိုင်း commands တွေအတွက် default ကတော့ `current` ဖြစ်ပါလိမ့်မယ်။ Sub-commands နှစ်ခုကို `ALTER TABLE` commands သီးခြားစီနဲ့ ထုတ်ပေးထားရင်ရတဲ့ သက်ရောက်မှုနဲ့ အတူတူပါပဲ။

Table တစ်ခုကနေ column တစ်ခုကို ဖယ်ရှားဖို့:

```sql
ALTER TABLE distributors DROP COLUMN address RESTRICT;
```

Operation တစ်ခုတည်းထဲမှာ ရှိပြီးသား columns နှစ်ခုရဲ့ types တွေကို ပြောင်းလဲဖို့:

```sql
ALTER TABLE distributors
    ALTER COLUMN address TYPE varchar(80),
    ALTER COLUMN name TYPE varchar(100);
```

Unix timestamps တွေ ပါဝင်တဲ့ integer column တစ်ခုကို `USING` clause တစ်ခုကနေတစ်ဆင့် `timestamp with time zone` အဖြစ် ပြောင်းလဲဖို့:

```sql
ALTER TABLE foo
    ALTER COLUMN foo_timestamp SET DATA TYPE timestamp with time zone
    USING
        timestamp with time zone 'epoch' + foo_timestamp * interval '1 second';
```

Column မှာ — data type အသစ်ဆီ အလိုအလျောက် cast မဖြစ်တဲ့ default expression တစ်ခု ရှိနေတဲ့အခါ — အထက်ပါအတိုင်း ပြုလုပ်ခြင်း:

```sql
ALTER TABLE foo
    ALTER COLUMN foo_timestamp DROP DEFAULT,
    ALTER COLUMN foo_timestamp TYPE timestamp with time zone
    USING
        timestamp with time zone 'epoch' + foo_timestamp * interval '1 second',
    ALTER COLUMN foo_timestamp SET DEFAULT now();
```

ရှိပြီးသား column တစ်ခုကို rename လုပ်ဖို့:

```sql
ALTER TABLE distributors RENAME COLUMN address TO city;
```

ရှိပြီးသား table တစ်ခုကို rename လုပ်ဖို့:

```sql
ALTER TABLE distributors RENAME TO suppliers;
```

ရှိပြီးသား constraint တစ်ခုကို rename လုပ်ဖို့:

```sql
ALTER TABLE distributors RENAME CONSTRAINT zipchk TO zip_check;
```

Column တစ်ခုပေါ်မှာ not-null constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ALTER COLUMN street SET NOT NULL;
```

Column တစ်ခုကနေ not-null constraint တစ်ခုကို ဖယ်ရှားဖို့:

```sql
ALTER TABLE distributors ALTER COLUMN street DROP NOT NULL;
```

Table တစ်ခုနဲ့ သူ့ရဲ့ children တွေ အားလုံးပေါ်မှာ check constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD CONSTRAINT zipchk CHECK (char_length(zipcode) = 5);
```

Check constraint တစ်ခုကို — children တွေမပါဘဲ — table တစ်ခုပေါ်မှာပဲ ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD CONSTRAINT zipchk CHECK (char_length(zipcode) = 5) NO INHERIT;
```

(ဒီ check constraint ကို နောက်ပိုင်း children တွေကလည်း အမွေဆက်ခံမှာ မဟုတ်ပါဘူး။)

Check constraint တစ်ခုကို — table တစ်ခုနဲ့ သူ့ရဲ့ children တွေ အားလုံးကနေ — ဖယ်ရှားဖို့:

```sql
ALTER TABLE distributors DROP CONSTRAINT zipchk;
```

Check constraint တစ်ခုကို table တစ်ခုတည်းကနေပဲ ဖယ်ရှားဖို့:

```sql
ALTER TABLE ONLY distributors DROP CONSTRAINT zipchk;
```

(Child tables တွေအတွက်တော့ ဒီ check constraint က ဆက်လက် သက်ရောက်နေပါတယ်။)

Table တစ်ခုပေါ်မှာ foreign key constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD CONSTRAINT distfk FOREIGN KEY (address) REFERENCES addresses (address);
```

တခြား အလုပ်တွေကို အနှောင့်အယှက် အနည်းဆုံး ဖြစ်စေတဲ့နည်းနဲ့ table တစ်ခုပေါ်မှာ foreign key constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD CONSTRAINT distfk FOREIGN KEY (address) REFERENCES addresses (address) NOT VALID;
ALTER TABLE distributors VALIDATE CONSTRAINT distfk;
```

Table တစ်ခုပေါ်မှာ (multicolumn) unique constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD CONSTRAINT dist_id_zipcode_key UNIQUE (dist_id, zipcode);
```

Table တစ်ခုက primary key တစ်ခုပဲ ရှိနိုင်တယ်ဆိုတာ သတိပြုပြီး — အလိုအလျောက် နာမည်ပေးတဲ့ primary key constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TABLE distributors ADD PRIMARY KEY (dist_id);
```

Table တစ်ခုကို tablespace တစ်ခုခုဆီ ရွှေ့ဖို့:

```sql
ALTER TABLE distributors SET TABLESPACE fasttablespace;
```

Table တစ်ခုကို schema တစ်ခုခုဆီ ရွှေ့ဖို့:

```sql
ALTER TABLE myschema.distributors SET SCHEMA yourschema;
```

Index ကို rebuild လုပ်နေစဉ် updates တွေ မပိတ်ဆို့ဘဲ — primary key constraint တစ်ခုကို ပြန်လည် ဖန်တီးဖို့:

```sql
CREATE UNIQUE INDEX CONCURRENTLY dist_id_temp_idx ON distributors (dist_id);
ALTER TABLE distributors DROP CONSTRAINT distributors_pkey,
    ADD CONSTRAINT distributors_pkey PRIMARY KEY USING INDEX dist_id_temp_idx;
```

Range-partitioned table တစ်ခုဆီ partition တစ်ခု ချိတ်ဆွဲဖို့:

```sql
ALTER TABLE measurement
    ATTACH PARTITION measurement_y2016m07 FOR VALUES FROM ('2016-07-01') TO ('2016-08-01');
```

List-partitioned table တစ်ခုဆီ partition တစ်ခု ချိတ်ဆွဲဖို့:

```sql
ALTER TABLE cities
    ATTACH PARTITION cities_ab FOR VALUES IN ('a', 'b');
```

Hash-partitioned table တစ်ခုဆီ partition တစ်ခု ချိတ်ဆွဲဖို့:

```sql
ALTER TABLE orders
    ATTACH PARTITION orders_p4 FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

Partitioned table တစ်ခုဆီ default partition တစ်ခု ချိတ်ဆွဲဖို့:

```sql
ALTER TABLE cities
    ATTACH PARTITION cities_partdef DEFAULT;
```

Partitioned table တစ်ခုကနေ partition တစ်ခုကို ခွဲထုတ်ဖို့:

```sql
ALTER TABLE measurement
    DETACH PARTITION measurement_y2015m12;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ADD [COLUMN]`, `DROP [COLUMN]`, `DROP IDENTITY`, `RESTART`, `SET DEFAULT`, `SET DATA TYPE` (`USING` မပါဘဲ), `SET GENERATED` နဲ့ `SET sequence_option` ဆိုတဲ့ forms တွေက SQL standard နဲ့ ကိုက်ညီပါတယ်။ `ADD table_constraint` form က — `USING INDEX` နဲ့ `NOT VALID` clauses တွေကို ချန်လိုက်ပြီး — constraint type က `CHECK`, `UNIQUE`, `PRIMARY KEY` ဒါမှမဟုတ် `REFERENCES` ထဲက တစ်ခုဖြစ်တဲ့အခါ — SQL standard နဲ့ ကိုက်ညီပါတယ်။ ကျန်တဲ့ forms တွေကတော့ SQL standard ရဲ့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။ ထို့ပြင် — `ALTER TABLE` command တစ်ခုတည်းထဲမှာ manipulation တစ်ခုထက်ပို သတ်မှတ်နိုင်တာကလည်း extension တစ်ခု ဖြစ်ပါတယ်။

`ALTER TABLE DROP COLUMN` ကို — column တစ်ခုတည်းပဲ ပါတဲ့ table တစ်ခုရဲ့ column ကို ဖျက်ပစ်ဖို့ သုံးနိုင်ပြီး — column သုညခု ပါတဲ့ table တစ်ခု ကျန်ရစ်စေပါတယ်။ ဒါက — zero-column tables တွေကို ခွင့်မပြုတဲ့ — SQL ရဲ့ extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TABLE](/docs/postgresql/sql-createtable)
