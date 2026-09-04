---
title: "CREATE FOREIGN TABLE (foreign table အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Foreign server တစ်ခုကို အသုံးပြုပြီး foreign table အသစ်တစ်ခုကို ဖန်တီးပေးသည့် command — column definitions များနှင့် column/table constraints (NOT NULL, NULL, CHECK, DEFAULT, GENERATED ALWAYS AS) များ၊ INHERITS နှင့် LIKE (INCLUDING/EXCLUDING options) clauses များ၊ SERVER နှင့် OPTIONS သတ်မှတ်ချက်များ ပါဝင်ပြီး — PARTITION OF ဖြင့် partitioned table ၏ partition တစ်ခုအနေနဲ့လည်း ဖန်တီးနိုင်သည်"
order: 315
source: "https://www.postgresql.org/docs/current/sql-createforeigntable.html"
status: translated
updated: 2026-09-04
---

## CREATE FOREIGN TABLE (foreign table အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE FOREIGN TABLE — foreign table အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE FOREIGN TABLE [ IF NOT EXISTS ] table_name ( [
  { column_name data_type [ OPTIONS ( option 'value' [, ... ] ) ] [ COLLATE collation ] [ column_constraint [ ... ] ]
    | table_constraint
    | LIKE source_table [ like_option ... ] }
    [, ... ]
] )
[ INHERITS ( parent_table [, ... ] ) ]
  SERVER server_name
[ OPTIONS ( option 'value' [, ... ] ) ]

CREATE FOREIGN TABLE [ IF NOT EXISTS ] table_name
  PARTITION OF parent_table [ (
  { column_name [ WITH OPTIONS ] [ column_constraint [ ... ] ]
    | table_constraint }
    [, ... ]
) ]
{ FOR VALUES partition_bound_spec | DEFAULT }
  SERVER server_name
[ OPTIONS ( option 'value' [, ... ] ) ]

where column_constraint is:

[ CONSTRAINT constraint_name ]
{ NOT NULL [ NO INHERIT ] |
  NULL |
  CHECK ( expression ) [ NO INHERIT ] |
  DEFAULT default_expr |
  GENERATED ALWAYS AS ( generation_expr ) [ STORED | VIRTUAL ] }
[ ENFORCED | NOT ENFORCED ]

and table_constraint is:

[ CONSTRAINT constraint_name ]
{  NOT NULL column_name [ NO INHERIT ] |
   CHECK ( expression ) [ NO INHERIT ] }
[ ENFORCED | NOT ENFORCED ]

and like_option is:

{ INCLUDING | EXCLUDING } { COMMENTS | CONSTRAINTS | DEFAULTS | GENERATED | STATISTICS | ALL }

and partition_bound_spec is:

IN ( partition_bound_expr [, ...] ) |
FROM ( { partition_bound_expr | MINVALUE | MAXVALUE } [, ...] )
  TO ( { partition_bound_expr | MINVALUE | MAXVALUE } [, ...] ) |
WITH ( MODULUS numeric_literal, REMAINDER numeric_literal )
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE FOREIGN TABLE` က လက်ရှိ database ထဲမှာ foreign table အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Table ကို — command ကို ထုတ်ပေးလိုက်တဲ့ user က ပိုင်ဆိုင်ပါလိမ့်မယ်။

Schema နာမည် ပေးထားရင် (ဥပမာ — `CREATE FOREIGN TABLE myschema.mytable ...`) — table ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ Foreign table ရဲ့ နာမည်က — တူညီတဲ့ schema ထဲမှာ ရှိတဲ့ တခြား relation (table, sequence, index, view, materialized view သို့မဟုတ် foreign table) တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။

`CREATE FOREIGN TABLE` က — foreign table ရဲ့ row တစ်ခုနဲ့ ကိုက်ညီတဲ့ composite type ကို ကိုယ်စားပြုတဲ့ — data type တစ်ခုကိုလည်း အလိုအလျောက် ဖန်တီးပေးပါတယ်။ ဒါကြောင့် — foreign tables တွေက — တူညီတဲ့ schema ထဲမှာ ရှိတဲ့ တည်ရှိပြီးသား data type တစ်ခုခုနဲ့ နာမည် တူလို့ မရပါဘူး။

`PARTITION OF` clause ကို သတ်မှတ်ထားရင် — table ကို — သတ်မှတ်ထားတဲ့ bounds တွေနဲ့အတူ — `parent_table` ရဲ့ partition တစ်ခုအနေနဲ့ ဖန်တီးပါတယ်။

Foreign table တစ်ခု ဖန်တီးနိုင်ဖို့ — သင့်မှာ foreign server ပေါ်မှာ `USAGE` privilege ရော — table ထဲမှာ သုံးထားတဲ့ column types တွေ အားလုံးပေါ်မှာပါ `USAGE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **IF NOT EXISTS** — တူညီတဲ့ နာမည်နဲ့ relation တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error မပစ်ပါဘူး။ ဒီလို အခြေအနေမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။ ရှိပြီးသား relation က — ဖန်တီးမယ့်ဟာနဲ့ တစ်စုံတစ်ရာ ဆင်တူမယ်ဆိုတဲ့ အာမခံချက် (guarantee) မရှိဘူးဆိုတာ သတိပြုပါ။
- **table_name** — ဖန်တီးရမယ့် table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်ပါတယ်)။
- **column_name** — Table အသစ်ထဲမှာ ဖန်တီးရမယ့် column တစ်ခုရဲ့ နာမည်။
- **data_type** — Column ရဲ့ data type။ ဒီထဲမှာ array specifiers တွေ ပါဝင်နိုင်ပါတယ်။ PostgreSQL က ထောက်ပံ့တဲ့ data types တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် အခန်း 8 ကို ရည်ညွှန်းပါ။
- **COLLATE collation** — `COLLATE` clause က column ဆီ collation တစ်ခုကို သတ်မှတ်ပေးပါတယ် (column က collatable data type တစ်ခုရဲ့ ဖြစ်ရပါမယ်)။ မသတ်မှတ်ထားရင် — column data type ရဲ့ default collation ကို သုံးပါတယ်။
- **INHERITS ( parent_table [, ... ] )** — Optional ဖြစ်တဲ့ `INHERITS` clause က — foreign table အသစ်က columns တွေ အားလုံးကို အလိုအလျောက် အမွေဆက်ခံရမယ့် — tables တွေရဲ့ စာရင်းကို သတ်မှတ်ပါတယ်။ Parent tables တွေက သာမန် tables တွေ သို့မဟုတ် foreign tables တွေ ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် — `CREATE TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။
- **PARTITION OF parent_table { FOR VALUES partition_bound_spec | DEFAULT }** — ဒီ form ကို — သတ်မှတ်ထားတဲ့ partition bound values တွေနဲ့အတူ — foreign table ကို ပေးထားတဲ့ parent table ရဲ့ partition တစ်ခုအဖြစ် ဖန်တီးဖို့ သုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် — `CREATE TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။ Parent table ပေါ်မှာ `UNIQUE` indexes တွေ ရှိနေရင် — foreign table ကို parent table ရဲ့ partition တစ်ခုအဖြစ် ဖန်တီးတာကို — လောလောဆယ် ခွင့်မပြုဘူးဆိုတာ သတိပြုပါ။ (`ALTER TABLE ... ATTACH PARTITION` ကိုလည်း ကြည့်ပါ။)
- **LIKE source_table [ like_option ... ]** — `LIKE` clause က — table အသစ်က column names တွေ အားလုံး၊ သူတို့ရဲ့ data types တွေနဲ့ not-null constraints တွေကို အလိုအလျောက် ကူးယူရမယ့် — table တစ်ခုကို သတ်မှတ်ပါတယ်။
  `INHERITS` နဲ့ မတူဘဲ — ဖန်တီးမှု ပြီးဆုံးသွားတဲ့ နောက်မှာ — table အသစ်နဲ့ မူရင်း table က လုံးဝ သီးခြား (decoupled) ဖြစ်နေပါတယ်။ မူရင်း table ဆီက ပြောင်းလဲမှုတွေက table အသစ်ဆီ သက်ရောက်မှာ မဟုတ်သလို — table အသစ်ရဲ့ data တွေကို မူရင်း table ရဲ့ scans တွေထဲမှာ ထည့်သွင်းဖို့လည်း မဖြစ်နိုင်ပါဘူး။
  `INHERITS` နဲ့ မတူတဲ့ နောက်ထပ် အချက်ကတော့ — `LIKE` နဲ့ ကူးယူလိုက်တဲ့ columns နဲ့ constraints တွေကို — နာမည် ဆင်တူတဲ့ columns နဲ့ constraints တွေနဲ့ ပေါင်းစည်း (merge) လုပ်တာ မရှိပါဘူး။ နာမည်တစ်ခုကို အတိအကျ သတ်မှတ်ထားတာ သို့မဟုတ် တခြား `LIKE` clause တစ်ခုထဲမှာ ပါနေရင် — error တစ်ခု အချက်ပြပါတယ်။
  Optional ဖြစ်တဲ့ like_option clauses တွေက — မူရင်း table ရဲ့ ဘယ် ထပ်ဆောင်း properties တွေကို ကူးယူမလဲဆိုတာ သတ်မှတ်ပေးပါတယ်။ `INCLUDING` သတ်မှတ်တာက property ကို ကူးယူပြီး — `EXCLUDING` သတ်မှတ်တာက property ကို ချန်လှပ်ပါတယ်။ `EXCLUDING` က default ဖြစ်ပါတယ်။ Object အမျိုးအစား တစ်ခုတည်းအတွက် သတ်မှတ်ချက် အများအပြား လုပ်ထားရင် — နောက်ဆုံး တစ်ခုကို သုံးပါတယ်။ ရနိုင်တဲ့ options တွေကတော့:
  - **INCLUDING COMMENTS** — ကူးယူလိုက်တဲ့ columns တွေ၊ constraints တွေနဲ့ extended statistics တွေရဲ့ comments တွေကို ကူးယူပါလိမ့်မယ်။ Default အပြုအမူကတော့ comments တွေကို ချန်လှပ်တာ ဖြစ်ပြီး — ရလဒ်အနေနဲ့ — table အသစ်ထဲက သက်ဆိုင်ရာ objects တွေမှာ comments တွေ ဘာမှ မရှိစေပါဘူး။
  - **INCLUDING CONSTRAINTS** — `CHECK` constraints တွေကို ကူးယူပါလိမ့်မယ်။ Column constraints နဲ့ table constraints ကြားမှာ ခွဲခြားမှု မလုပ်ပါဘူး။ Not-null constraints တွေကိုတော့ — table အသစ်ဆီ အမြဲတမ်း ကူးယူပါတယ်။
  - **INCLUDING DEFAULTS** — ကူးယူလိုက်တဲ့ column definitions တွေရဲ့ default expressions တွေကို ကူးယူပါလိမ့်မယ်။ မဟုတ်ရင် — default expressions တွေကို မကူးယူဘဲ — ရလဒ်အနေနဲ့ — table အသစ်ထဲက ကူးယူလိုက်တဲ့ columns တွေမှာ null defaults တွေ ရှိစေပါတယ်။ `nextval` လို database-modification functions တွေကို ခေါ်တဲ့ defaults တွေကို ကူးယူတာက — မူရင်း table နဲ့ table အသစ်ကြားမှာ functional linkage (လုပ်ဆောင်မှု ဆက်စပ်မှု) တစ်ခု ဖန်တီးမိနိုင်တယ်ဆိုတာ သတိပြုပါ။
  - **INCLUDING GENERATED** — ကူးယူလိုက်တဲ့ column definitions တွေရဲ့ generation expressions တွေ ဘယ်ဟာကိုမဆို ကူးယူပါလိမ့်မယ်။ Default အနေနဲ့တော့ — columns အသစ်တွေက သာမန် base columns တွေ ဖြစ်ပါလိမ့်မယ်။
  - **INCLUDING STATISTICS** — Extended statistics တွေကို table အသစ်ဆီ ကူးယူပါတယ်။
  - **INCLUDING ALL** — `INCLUDING ALL` က — ရနိုင်တဲ့ individual options တွေ အားလုံးကို ရွေးချယ်တဲ့ အတိုကောက် (abbreviated) ပုံစံ တစ်ခု ဖြစ်ပါတယ်။ (သတ်မှတ်ထားတဲ့ options တချို့ ကလွဲလို့ ကျန် အားလုံးကို ရွေးချယ်ချင်ရင် — `INCLUDING ALL` ရဲ့ နောက်မှာ individual `EXCLUDING` clauses တွေကို ရေးတာ အသုံးဝင်နိုင်ပါတယ်။)
- **CONSTRAINT constraint_name** — Column သို့မဟုတ် table constraint တစ်ခုအတွက် optional နာမည်တစ်ခု။ Constraint ကို ချိုးဖောက်ရင် — constraint ရဲ့ နာမည်က error messages တွေထဲမှာ ပါဝင်တာကြောင့် — `col must be positive` လိုမျိုး constraint names တွေက client applications တွေဆီ အသုံးဝင်တဲ့ constraint အချက်အလက်တွေကို ဆက်သွယ် ပေးပို့ဖို့ သုံးနိုင်ပါတယ်။ (Space တွေ ပါဝင်တဲ့ constraint names တွေကို သတ်မှတ်ဖို့ double-quotes တွေ လိုအပ်ပါတယ်။) Constraint နာမည် မသတ်မှတ်ရင် — system က နာမည်တစ်ခု ထုတ်လုပ်ပေးပါတယ်။
- **NOT NULL [ NO INHERIT ]** — Column ထဲမှာ null values တွေ ပါဝင်ခွင့် မရှိပါဘူး။
  `NO INHERIT` နဲ့ အမှတ်အသား လုပ်ထားတဲ့ constraint တစ်ခုက child tables တွေဆီ ပျံ့နှံ့ (propagate) သွားမှာ မဟုတ်ပါဘူး။
- **NULL** — Column ထဲမှာ null values တွေ ပါဝင်ခွင့် ရှိပါတယ်။ ဒါက default ဖြစ်ပါတယ်။
  ဒီ clause ကို — non-standard SQL databases တွေနဲ့ လိုက်ဖက်ညီမှုအတွက်ပဲ ပေးထားတာ ဖြစ်ပါတယ်။ Application အသစ်တွေမှာ ၎င်းကို သုံးတာကို မထောက်ခံပါဘူး။
- **CHECK ( expression ) [ NO INHERIT ]** — `CHECK` clause က — foreign table ထဲက row တစ်ခုချင်းစီ ကျေနပ်စေရန် မျှော်လင့်ရတဲ့ — Boolean ရလဒ် ထုတ်ပေးတဲ့ expression တစ်ခုကို သတ်မှတ်ပါတယ်; ဆိုလိုတာက — foreign table ထဲက rows တွေ အားလုံးအတွက် — expression က `TRUE` သို့မဟုတ် `UNKNOWN` ကိုပဲ ထုတ်ပေးပြီး — `FALSE` ကို ဘယ်တော့မှ မထုတ်ပေးရပါဘူး။ Column constraint တစ်ခုအနေနဲ့ သတ်မှတ်ထားတဲ့ check constraint တစ်ခုက — အဲဒီ column ရဲ့ တန်ဖိုးကိုပဲ ရည်ညွှန်းသင့်ပြီး — table constraint တစ်ခုထဲမှာ ပေါ်နေတဲ့ expression တစ်ခုကတော့ — column အများအပြားကို ရည်ညွှန်းနိုင်ပါတယ်။
  လောလောဆယ် — `CHECK` expressions တွေက subqueries တွေ မပါဝင်နိုင်သလို — လက်ရှိ row ရဲ့ columns တွေ ကလွဲလို့ တခြား variables တွေကိုလည်း ရည်ညွှန်းလို့ မရပါဘူး။ System column ဖြစ်တဲ့ `tableoid` ကိုတော့ ရည်ညွှန်းနိုင်ပေမယ့် — တခြား system columns တွေကိုတော့ မရည်ညွှန်းနိုင်ပါဘူး။
  `NO INHERIT` နဲ့ အမှတ်အသား လုပ်ထားတဲ့ constraint တစ်ခုက child tables တွေဆီ ပျံ့နှံ့ သွားမှာ မဟုတ်ပါဘူး။
- **DEFAULT default_expr** — `DEFAULT` clause က — ၎င်း ပါဝင်နေတဲ့ column definition ရှိတဲ့ column အတွက် — default data value တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးက variable ကင်းစင်တဲ့ (variable-free) expression တစ်ခု ဖြစ်ရပါမယ် (subqueries တွေနဲ့ လက်ရှိ table ထဲက တခြား columns တွေဆီကို cross-references တွေ ခွင့်မပြုပါဘူး)။ Default expression ရဲ့ data type က column ရဲ့ data type နဲ့ ကိုက်ညီရပါမယ်။
  Default expression ကို — column အတွက် တန်ဖိုးတစ်ခု မသတ်မှတ်ပေးတဲ့ — insert operation တိုင်းမှာ သုံးပါလိမ့်မယ်။ Column တစ်ခုအတွက် default မရှိရင် — default က null ဖြစ်ပါတယ်။
- **GENERATED ALWAYS AS ( generation_expr ) [ STORED | VIRTUAL ]** — ဒီ clause က column ကို generated column (တွက်ချက် ထုတ်လုပ်ထားသော column) အဖြစ် ဖန်တီးပေးပါတယ်။ ဒီ column ဆီ ရေးလို့ (write) မရပါဘူး — ဖတ်တဲ့အခါမှာတော့ — သတ်မှတ်ထားတဲ့ expression ရဲ့ ရလဒ်ကို ပြန်ပေးပါလိမ့်မယ်။
  `VIRTUAL` ကို သတ်မှတ်ထားရင် — column ကို ဖတ်တဲ့အခါ တွက်ချက်ပါတယ်။ (Foreign-data wrapper က ၎င်းကို rows အသစ်တွေထဲမှာ null value တစ်ခုအနေနဲ့ မြင်ရပြီး — null value တစ်ခုအနေနဲ့ သိမ်းဆည်းဖို့ သို့မဟုတ် လုံးဝ လျစ်လျူရှုဖို့ ရွေးချယ်နိုင်ပါတယ်။) `STORED` ကို သတ်မှတ်ထားရင် — column ကို write လုပ်တဲ့အခါ တွက်ချက်ပါတယ်။ (တွက်ချက်ထားတဲ့ တန်ဖိုးကို foreign-data wrapper ဆီ သိမ်းဆည်းဖို့ ပေးအပ်ပြီး — ဖတ်တဲ့အခါ ပြန်ပေးရပါမယ်။) `VIRTUAL` က default ဖြစ်ပါတယ်။
  Generation expression က table ထဲက တခြား columns တွေကို ရည်ညွှန်းနိုင်ပေမယ့် — တခြား generated columns တွေကိုတော့ မရည်ညွှန်းနိုင်ပါဘူး။ သုံးတဲ့ functions နဲ့ operators တွေ အားလုံး immutable (မပြောင်းလဲနိုင်သော) ဖြစ်ရပါမယ်။ တခြား tables တွေဆီကို ရည်ညွှန်းခြင်းတွေကို ခွင့်မပြုပါဘူး။
- **server_name** — Foreign table အတွက် သုံးမယ့် တည်ရှိပြီးသား foreign server တစ်ခုရဲ့ နာမည်။ Server တစ်ခု သတ်မှတ်ခြင်းအကြောင်း အသေးစိတ်အတွက် CREATE SERVER ကို ကြည့်ပါ။
- **OPTIONS ( option 'value' [, ...] )** — Foreign table အသစ် သို့မဟုတ် ၎င်းရဲ့ column တစ်ခုနဲ့ ဆက်စပ်ဖို့ options တွေ။ ခွင့်ပြုထားတဲ့ option names နဲ့ values တွေက foreign data wrapper တစ်ခုချင်းစီနဲ့ သက်ဆိုင်ပြီး — foreign-data wrapper ရဲ့ validator function ကို သုံးပြီး စစ်ဆေးပါတယ်။ Option names တွေ ထပ်နေလို့ မရပါဘူး (table option တစ်ခုနဲ့ column option တစ်ခုမှာ နာမည် တူနေတာကတော့ ရပါတယ်)။

## Notes (မှတ်စုများ)

Foreign tables တွေပေါ်က constraints တွေ (ဥပမာ — `CHECK` သို့မဟုတ် `NOT NULL` clauses) ကို core PostgreSQL system က အတင်းအကျပ် လုပ်ဆောင် (enforce) မပေးပါဘူး — ပြီးတော့ — foreign data wrappers အများစုကလည်း သူတို့ကို အတင်းအကျပ် လုပ်ဆောင်ဖို့ မကြိုးစားပါဘူး; ဆိုလိုတာက — constraint က မှန်ကန်တယ်လို့ ရိုးရိုး ယူဆထားတာ ဖြစ်ပါတယ်။ ဒီလို အတင်းအကျပ် လုပ်ဆောင်မှုက အဓိပ္ပာယ် သိပ်မရှိပါဘူး — ဘာလို့လဲဆိုတော့ ၎င်းက foreign table ကနေတစ်ဆင့် insert သို့မဟုတ် update လုပ်လိုက်တဲ့ rows တွေကိုပဲ သက်ရောက်မှာ ဖြစ်ပြီး — remote server ပေါ်မှာ တိုက်ရိုက် ပြုပြင်လိုက်တာလို — တခြား နည်းလမ်းတွေနဲ့ ပြုပြင်လိုက်တဲ့ rows တွေကိုတော့ မသက်ရောက်လို့ပါ။ အဲဒီအစား — foreign table တစ်ခုဆီ ချိတ်ထားတဲ့ constraint တစ်ခုက — remote server က အတင်းအကျပ် လုပ်ဆောင်နေတဲ့ constraint တစ်ခုကို ကိုယ်စားပြုသင့်ပါတယ်။

အထူး ရည်ရွယ်ချက် (special-purpose) ရှိတဲ့ foreign data wrappers တချို့က — သူတို့ ဝင်ရောက်တဲ့ data တွေအတွက် — တစ်ခုတည်းသော access mechanism ဖြစ်နေနိုင်ပြီး — အဲဒီကိစ္စမှာ — foreign data wrapper ကိုယ်တိုင် constraint enforcement လုပ်တာက သင့်လျော်နိုင်ပါတယ်။ ဒါပေမယ့် — wrapper တစ်ခုက ဒါကို လုပ်တယ်လို့ — ၎င်းရဲ့ documentation က မပြောဘူးဆိုရင် — မယူဆသင့်ပါဘူး။

PostgreSQL က foreign tables တွေပေါ်မှာ constraints တွေကို အတင်းအကျပ် လုပ်ဆောင်ဖို့ မကြိုးစားပေမယ့် — query optimization ရဲ့ ရည်ရွယ်ချက်တွေအတွက်တော့ — သူတို့ မှန်ကန်တယ်လို့ ယူဆပါတယ်။ Foreign table ထဲမှာ ကြေညာထားတဲ့ constraint တစ်ခုကို မကျေနပ်တဲ့ rows တွေ မြင်နေရရင် — table ပေါ်က queries တွေက errors တွေ သို့မဟုတ် မမှန်ကန်တဲ့ အဖြေတွေ ထုတ်ပေးနိုင်ပါတယ်။ Constraint definition က လက်တွေ့နဲ့ ကိုက်ညီကြောင်း သေချာစေဖို့ဆိုတာ user ရဲ့ တာဝန် ဖြစ်ပါတယ်။

> **သတိပြုရန်:** Foreign table တစ်ခုကို partitioned table တစ်ခုရဲ့ partition တစ်ခုအနေနဲ့ သုံးတဲ့အခါ — ၎င်းရဲ့ contents တွေက partitioning rule ကို ကျေနပ်ရမယ်ဆိုတဲ့ — သွယ်ဝိုက်တဲ့ (implicit) constraint တစ်ခု ရှိပါတယ်။ ဒါက မှန်ကန်ကြောင်း သေချာစေဖို့ဆိုတာလည်း user ရဲ့ တာဝန်ပဲ ဖြစ်ပြီး — remote server ပေါ်မှာ ကိုက်ညီတဲ့ constraint တစ်ခု တပ်ဆင်ခြင်းအားဖြင့် အကောင်းဆုံး လုပ်နိုင်ပါတယ်။

Foreign-table partitions တွေ ပါဝင်တဲ့ partitioned table တစ်ခုထဲမှာ — partition key တန်ဖိုးကို ပြောင်းလဲတဲ့ `UPDATE` တစ်ခုက — foreign data wrapper က tuple routing ကို ထောက်ပံ့ပေးတယ်ဆိုရင် — row တစ်ခုကို local partition တစ်ခုကနေ foreign-table partition တစ်ခုဆီ ရွှေ့ပြောင်းစေနိုင်ပါတယ်။ ဒါပေမယ့် — row တစ်ခုကို foreign-table partition တစ်ခုကနေ တခြား partition တစ်ခုဆီ ရွှေ့ပြောင်းတာကတော့ — လောလောဆယ် မဖြစ်နိုင်ပါဘူး။ အဲဒါ လိုအပ်မယ့် `UPDATE` တစ်ခုက — remote server က ၎င်းကို သင့်လျော်စွာ အတင်းအကျပ် လုပ်ဆောင်တယ်လို့ ယူဆရင် — partitioning constraint ကြောင့် မအောင်မြင်ပါဘူး။

Generated columns တွေမှာလည်း အလားတူ ထည့်သွင်း စဉ်းစားစရာတွေ သက်ရောက်ပါတယ်။ Stored generated columns တွေကို local PostgreSQL server ပေါ်မှာ insert သို့မဟုတ် update လုပ်တဲ့အခါ တွက်ချက်ပြီး — foreign data store ဆီ ထုတ်ရေးဖို့ foreign-data wrapper ဆီ လွှဲပြောင်း ပေးအပ်ပါတယ် — ဒါပေမယ့် — foreign table တစ်ခုရဲ့ query တစ်ခုက stored generated columns တွေအတွက် — generation expression နဲ့ ကိုက်ညီတဲ့ တန်ဖိုးတွေကို ပြန်ပေးတယ်ဆိုတာကိုတော့ — အတင်းအကျပ် မလုပ်ဆောင်ပါဘူး။ ဒါကလည်း — မမှန်ကန်တဲ့ query ရလဒ်တွေကို ဖြစ်စေနိုင်ပါတယ်။

## Examples (ဥပမာများ)

`film_server` server ကနေတစ်ဆင့် ဝင်ရောက်မယ့် `films` ဆိုတဲ့ foreign table တစ်ခု ဖန်တီးဖို့:

```sql
CREATE FOREIGN TABLE films (
    code        char(5) NOT NULL,
    title       varchar(40) NOT NULL,
    did         integer NOT NULL,
    date_prod   date,
    kind        varchar(10),
    len         interval hour to minute
)
SERVER film_server;
```

`server_07` server ကနေတစ်ဆင့် ဝင်ရောက်မယ့် `measurement_y2016m07` ဆိုတဲ့ foreign table တစ်ခုကို — range partitioned table `measurement` ရဲ့ partition တစ်ခုအနေနဲ့ ဖန်တီးဖို့:

```sql
CREATE FOREIGN TABLE measurement_y2016m07
    PARTITION OF measurement FOR VALUES FROM ('2016-07-01') TO ('2016-08-01')
    SERVER server_07;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE FOREIGN TABLE` command က SQL standard နဲ့ အတော်များများ ကိုက်ညီပါတယ်; ဒါပေမယ့် — [`CREATE TABLE`](/docs/postgresql/sql-createtable) မှာ ရှိသလိုပဲ — `NULL` constraints တွေနဲ့ zero-column foreign tables တွေကို ခွင့်ပြုပါတယ်။ Column default values တွေ သတ်မှတ်နိုင်တာကလည်း PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ PostgreSQL က သတ်မှတ်ထားတဲ့ ပုံစံအတိုင်း table inheritance ကတော့ standard မဟုတ်ပါဘူး။ ဒီ command မှာ ထောက်ပံ့ထားသလို `LIKE` clause ကလည်း standard မဟုတ်ပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER FOREIGN TABLE](/docs/postgresql/sql-alterforeigntable), [DROP FOREIGN TABLE](/docs/postgresql/sql-dropforeigntable), [CREATE TABLE](/docs/postgresql/sql-createtable), [CREATE SERVER](/docs/postgresql/sql-createserver), [IMPORT FOREIGN SCHEMA](/docs/postgresql/sql-importforeignschema)
