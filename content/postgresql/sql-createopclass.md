---
title: "CREATE OPERATOR CLASS (operator class အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Index method တစ်ခုအတွက် operator class အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးသည့် command — data type တစ်ခုကို index တစ်ခုနဲ့ ဘယ်လို သုံးနိုင်မလဲဆိုတာ သတ်မှတ်ပေးပြီး OPERATOR (strategy number အလိုက်)၊ FUNCTION (support number အလိုက်) နှင့် STORAGE entries များ ပါဝင်ခြင်း — DEFAULT (data type အတွက် default operator class အဖြစ် သတ်မှတ်ခြင်း)၊ FOR SEARCH/FOR ORDER BY နှင့် FAMILY (operator family အတွင်းသို့ ထည့်သွင်းခြင်း) options များလည်း ပါဝင်ခြင်း"
order: 317
source: "https://www.postgresql.org/docs/current/sql-createopclass.html"
status: translated
updated: 2026-09-04
---

## CREATE OPERATOR CLASS (operator class အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE OPERATOR CLASS — operator class အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE OPERATOR CLASS name [ DEFAULT ] FOR TYPE data_type
  USING index_method [ FAMILY family_name ] AS
  {  OPERATOR strategy_number operator_name [ ( op_type, op_type ) ] [ FOR SEARCH | FOR ORDER BY sort_family_name ]
   | FUNCTION support_number [ ( op_type [ , op_type ] ) ] function_name ( argument_type [, ...] )
   | STORAGE storage_type
  } [, ... ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE OPERATOR CLASS` က operator class အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Operator class တစ်ခုက — data type တစ်ခုကို index တစ်ခုနဲ့ ဘယ်လို သုံးနိုင်တယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်။ Operator class က — ဒီ data type နဲ့ ဒီ index method အတွက် — သတ်မှတ်ထားတဲ့ operators တချို့က ဘယ်လို သီးခြား roles တွေ ဒါမှမဟုတ် “strategies” တွေကို ဖြည့်ဆည်းပေးမယ်ဆိုတာ သတ်မှတ်ပေးပါတယ်။ Operator class က — index column တစ်ခုအတွက် operator class ကို ရွေးချယ်လိုက်တဲ့အခါ — index method က သုံးရမယ့် support functions တွေကိုလည်း သတ်မှတ်ပေးပါတယ်။ Operator class တစ်ခုက သုံးတဲ့ operators နဲ့ functions တွေ အားလုံးကို — operator class ကို မဖန်တီးခင် — အရင်ဆုံး သတ်မှတ်ထားရပါမယ်။

Schema နာမည် တစ်ခု ပေးထားရင် — operator class ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ Schema တစ်ခုတည်းထဲက operator classes နှစ်ခုက — index methods မတူညီတဲ့အတွက်သာ ဖြစ်ရင် — နာမည် တူညိနိုင်ပါတယ်။

Operator class တစ်ခုကို သတ်မှတ်တဲ့ user က ၎င်းရဲ့ owner ဖြစ်လာပါတယ်။ လောလောဆယ် — ဖန်တီးတဲ့ user က superuser ဖြစ်ရပါမယ်။ (ဒီ ကန့်သတ်ချက်ကို — မှားယွင်းတဲ့ operator class definition တစ်ခုက server ကို ရှုပ်ထွေးစေနိုင်လို့ ဒါမှမဟုတ် crash ဖြစ်စေနိုင်လို့ — ပြုလုပ်ထားတာပါ။)

`CREATE OPERATOR CLASS` က — လောလောဆယ် — operator class definition ထဲမှာ index method က လိုအပ်တဲ့ operators နဲ့ functions တွေ အားလုံး ပါဝင်မဝင်၊ ဒါမှမဟုတ် operators နဲ့ functions တွေက တစ်ခုနဲ့တစ်ခု ညီညွတ်တဲ့ (self-consistent) set တစ်ခု ဖြစ်မဖြစ်ကို စစ်ဆေးပေးခြင်း မရှိပါဘူး။ Valid operator class တစ်ခုကို သတ်မှတ်တာက user ရဲ့ တာဝန် ဖြစ်ပါတယ်။

ဆက်စပ်နေတဲ့ operator classes တွေကို *operator families* (operator family များ) အဖြစ် အုပ်စုဖွဲ့ နိုင်ပါတယ်။ ရှိပြီးသား family တစ်ခုဆီ operator class အသစ်တစ်ခု ထည့်သွင်းဖို့ — `CREATE OPERATOR CLASS` ထဲမှာ `FAMILY` option ကို သတ်မှတ်ပါ။ ဒီ option မပါဘဲ — class အသစ်ကို class အသစ်ရဲ့ နာမည်နဲ့ပဲ နာမည်တူတဲ့ family တစ်ခုထဲမှာ နေရာချပါတယ် (အဲဒီ family မရှိသေးရင် ဖန်တီးပေးပါတယ်)။

နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 36.16](https://www.postgresql.org/docs/current/xindex.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် operator class ရဲ့ နာမည် ဖြစ်ပါတယ်။ နာမည်က schema-qualified (schema ပါဝင်သော) ဖြစ်နိုင်ပါတယ်။
- **DEFAULT** — ပါဝင်နေရင် — operator class က ၎င်းရဲ့ data type အတွက် default operator class ဖြစ်လာပါလိမ့်မယ်။ Data type တစ်ခုနဲ့ index method တစ်ခုအတွက် — operator class တစ်ခုတည်းကသာ default ဖြစ်နိုင်ပါတယ်။
- **data_type** — ဒီ operator class က ရည်ရွယ်ထားတဲ့ column data type ဖြစ်ပါတယ်။
- **index_method** — ဒီ operator class က ရည်ရွယ်ထားတဲ့ index method ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **family_name** — ဒီ operator class ကို ထည့်သွင်းရမယ့် ရှိပြီးသား operator family ရဲ့ နာမည် ဖြစ်ပါတယ်။ မသတ်မှတ်ထားရင် — operator class ရဲ့ နာမည်နဲ့ပဲ နာမည်တူတဲ့ family တစ်ခုကို သုံးပါတယ် (မရှိသေးရင် ဖန်တီးပေးပါတယ်)။
- **strategy_number** — Operator class နဲ့ ဆက်စပ်နေတဲ့ operator တစ်ခုအတွက် — index method ရဲ့ strategy number ဖြစ်ပါတယ်။
- **operator_name** — Operator class နဲ့ ဆက်စပ်နေတဲ့ operator တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **op_type** — `OPERATOR` clause တစ်ခုထဲမှာဆိုရင် — operator ရဲ့ operand data type(s) တွေ ဖြစ်ပြီး — prefix operator တစ်ခုကို ညွှန်ပြဖို့ NONE လို့ သုံးပါတယ်။ Operand data types တွေက operator class ရဲ့ data type နဲ့ တူညီတဲ့ သာမန် အခြေအနေမှာဆိုရင် — ချန်လိုက်လို့ ရပါတယ်။
`FUNCTION` clause တစ်ခုထဲမှာဆိုရင် — function ရဲ့ input data type(s) တွေ (B-tree comparison functions နဲ့ hash functions တွေအတွက်) ဒါမှမဟုတ် class ရဲ့ data type (B-tree sort support functions, B-tree equal image functions နဲ့ GiST, SP-GiST, GIN နဲ့ BRIN operator classes တွေထဲက functions အားလုံးအတွက်) တွေနဲ့ မတူညီတဲ့အခါ — function က ထောက်ပံ့ဖို့ ရည်ရွယ်ထားတဲ့ operand data type(s) တွေ ဖြစ်ပါတယ်။ ဒီ defaults တွေက မှန်ကန်တာမို့ — cross-data-type (data type အမျိုးမျိုး ကူးသန်း) comparisons တွေကို ထောက်ပံ့ဖို့ ရည်ရွယ်ထားတဲ့ B-tree sort support function တစ်ခုရဲ့ ကိစ္စကလွဲရင် — `FUNCTION` clauses တွေမှာ op_type ကို သတ်မှတ်ဖို့ မလိုအပ်ပါဘူး။
- **sort_family_name** — Ordering operator တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ sort ordering ကို ဖော်ပြတဲ့ — ရှိပြီးသား btree operator family တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
`FOR SEARCH` ရော `FOR ORDER BY` ရော နှစ်ခုလုံး မသတ်မှတ်ထားရင် — `FOR SEARCH` က default ဖြစ်ပါတယ်။
- **support_number** — Operator class နဲ့ ဆက်စပ်နေတဲ့ function တစ်ခုအတွက် — index method ရဲ့ support function number ဖြစ်ပါတယ်။
- **function_name** — Operator class အတွက် index method support function တစ်ခု ဖြစ်တဲ့ function တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **argument_type** — Function ရဲ့ parameter data type(s) တွေ ဖြစ်ပါတယ်။
- **storage_type** — Index ထဲမှာ တကယ် သိုလှောင်မယ့် (stored) data type ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — ဒါက column data type နဲ့ တူညီပေမယ့် — index methods တချို့ (လောလောဆယ် GiST, GIN, SP-GiST နဲ့ BRIN) ကတော့ မတူညီတဲ့ type တစ်ခုကို ခွင့်ပြုပါတယ်။ Index method က မတူညီတဲ့ type တစ်ခုကို သုံးခွင့် ပြုမှသာ — `STORAGE` clause ကို ထည့်သွင်းလို့ ရပါတယ်; မဟုတ်ရင် ချန်လိုက်ရပါမယ်။ Column ရဲ့ data_type ကို anyarray အဖြစ် သတ်မှတ်ထားရင် — storage_type ကို anyelement အဖြစ် ကြေညာနိုင်ပြီး — ဒါက index entries တွေဟာ — index တစ်ခုချင်းစီ အတွက် ဖန်တီးထားတဲ့ — တကယ့် array type ရဲ့ element type ထဲက အဖွဲ့ဝင်တွေ ဖြစ်တယ်ဆိုတာကို ညွှန်ပြပါတယ်။

`OPERATOR`, `FUNCTION` နဲ့ `STORAGE` clauses တွေကို — ဘယ် order နဲ့မဆို ပေါ်လာနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

Index machinery (index ယန္တရား) က functions တွေကို မသုံးခင် access permissions တွေကို စစ်ဆေးမှု မရှိတာကြောင့် — function တစ်ခု သို့မဟုတ် operator တစ်ခုကို operator class တစ်ခုထဲမှာ ထည့်သွင်းတာက — ၎င်းအပေါ်မှာ public execute permission ပေးလိုက်တာနဲ့ တူညီပါတယ်။ Operator class တစ်ခုထဲမှာ အသုံးဝင်လေ့ ရှိတဲ့ function မျိုးတွေအတွက်တော့ ဒါက ပုံမှန်အားဖြင့် ပြဿနာ မဟုတ်ပါဘူး။

Operators တွေကို SQL functions တွေနဲ့ သတ်မှတ်ထားခြင်း မဖြစ်သင့်ပါဘူး။ SQL function တစ်ခုက calling query ထဲမှာ inline (တိုက်ရိုက် ထည့်သွင်း) လုပ်ခံရနိုင်ခြေ များပြီး — အဲဒါက optimizer က — query က index တစ်ခုနဲ့ ကိုက်ညီတယ်ဆိုတာကို — မှတ်မိခြင်းကနေ တားဆီးပါလိမ့်မယ်။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာ command က — `_int4` (int4 ရဲ့ array) data type အတွက် GiST index operator class တစ်ခုကို သတ်မှတ်ပါတယ်။ ပြည့်စုံတဲ့ ဥပမာအတွက် [intarray](https://www.postgresql.org/docs/current/intarray.html) module ကို ကြည့်ပါ။

```sql
CREATE OPERATOR CLASS gist__int_ops
    DEFAULT FOR TYPE _int4 USING gist AS
        OPERATOR        3       &&,
        OPERATOR        6       = (anyarray, anyarray),
        OPERATOR        7       @>,
        OPERATOR        8       <@,
        OPERATOR        20      @@ (_int4, query_int),
        FUNCTION        1       g_int_consistent (internal, _int4, smallint, oid, internal),
        FUNCTION        2       g_int_union (internal, internal),
        FUNCTION        3       g_int_compress (internal),
        FUNCTION        4       g_int_decompress (internal),
        FUNCTION        5       g_int_penalty (internal, internal, internal),
        FUNCTION        6       g_int_picksplit (internal, internal),
        FUNCTION        7       g_int_same (_int4, _int4, internal);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE OPERATOR CLASS` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ထဲမှာ `CREATE OPERATOR CLASS` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER OPERATOR CLASS](/docs/postgresql/sql-alteropclass), [DROP OPERATOR CLASS](/docs/postgresql/sql-dropopclass), [CREATE OPERATOR FAMILY](/docs/postgresql/sql-createopfamily), [ALTER OPERATOR FAMILY](/docs/postgresql/sql-alteropfamily)
