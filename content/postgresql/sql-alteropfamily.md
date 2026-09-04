---
title: "ALTER OPERATOR FAMILY (operator family တစ်ခုထဲက operator နဲ့ support function တွေကို ထည့်ခြင်း/ဖယ်ခြင်း)"
description: "Operator family တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — family ထဲသို့ operators နဲ့ support functions များ ထည့်သွင်းခြင်း (ADD OPERATOR/FUNCTION) နှင့် ဖယ်ရှားခြင်း (DROP OPERATOR/FUNCTION) — strategy/support numbers နှင့် operand data types များဖြင့် သတ်မှတ်ရခြင်း၊ RENAME TO/OWNER TO/SET SCHEMA ပုံစံများလည်း ပါဝင်ခြင်း၊ superuser ဖြစ်ရန် လိုအပ်ခြင်း"
order: 309
source: "https://www.postgresql.org/docs/current/sql-alteropfamily.html"
status: translated
updated: 2026-09-04
---

## ALTER OPERATOR FAMILY (operator family တစ်ခုထဲက operator နဲ့ support function တွေကို ထည့်ခြင်း/ဖယ်ခြင်း)

ALTER OPERATOR FAMILY — operator family တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER OPERATOR FAMILY name USING index_method ADD
  {  OPERATOR strategy_number operator_name ( op_type, op_type )
              [ FOR SEARCH | FOR ORDER BY sort_family_name ]
   | FUNCTION support_number [ ( op_type [ , op_type ] ) ]
              function_name [ ( argument_type [, ...] ) ]
  } [, ... ]

ALTER OPERATOR FAMILY name USING index_method DROP
  {  OPERATOR strategy_number ( op_type [ , op_type ] )
   | FUNCTION support_number ( op_type [ , op_type ] )
  } [, ... ]

ALTER OPERATOR FAMILY name USING index_method
    RENAME TO new_name

ALTER OPERATOR FAMILY name USING index_method
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }

ALTER OPERATOR FAMILY name USING index_method
    SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER OPERATOR FAMILY` က operator family တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။ Family ထဲကို operators နဲ့ support functions တွေ ထည့်သွင်းနိုင်သလို — family ထဲကနေ ဖယ်ရှားနိုင်ပြီး — family ရဲ့ နာမည် ဒါမှမဟုတ် owner ကိုလည်း ပြောင်းလဲနိုင်ပါတယ်။

`ALTER OPERATOR FAMILY` သုံးပြီး family တစ်ခုထဲကို operators နဲ့ support functions တွေ ထည့်သွင်းတဲ့အခါ — သူတို့က family ထဲက ဘယ် operator class တစ်ခုခုရဲ့မှ အစိတ်အပိုင်း မဟုတ်ဘဲ — family ထဲမှာ “loose” (သီးခြား လွတ်လပ်) အနေနဲ့ပဲ ရှိနေပါတယ်။ ဒါက ဆိုလိုတာက — ဒီ operators နဲ့ functions တွေက family ရဲ့ semantics (အဓိပ္ပာယ် သတ်မှတ်ချက်များ) နဲ့ လိုက်ဖက်ညီပေမယ့် — ဘယ် index တစ်ခုခုရဲ့ မှန်ကန်စွာ လုပ်ဆောင်မှုအတွက်တော့ မလိုအပ်ပါဘူး။ (ဒီလို လိုအပ်တဲ့ operators နဲ့ functions တွေကိုတော့ operator class တစ်ခုရဲ့ အစိတ်အပိုင်းအဖြစ် ကြေညာသင့်ပါတယ်; [CREATE OPERATOR CLASS](/docs/postgresql/sql-createopclass) ကို ကြည့်ပါ။) PostgreSQL က family တစ်ခုရဲ့ loose members တွေကို — ဘယ်အချိန်မဆို — family ကနေ drop လုပ်ခွင့် ပြုပေမယ့် — operator class တစ်ခုရဲ့ members တွေကတော့ — class တစ်ခုလုံးနဲ့ ၎င်းကို မှီခိုနေတဲ့ indexes တွေ အားလုံးကို drop မလုပ်ဘဲ — ဖယ်ရှားလို့ မရပါဘူး။ ပုံမှန်အားဖြင့် — data type တစ်ခုတည်း ပါဝင်တဲ့ operators နဲ့ functions တွေက — အဲဒီ data type တစ်ခုတည်းပေါ်က index တစ်ခုကို ထောက်ပံ့ဖို့ လိုအပ်တာကြောင့် — operator classes တွေရဲ့ အစိတ်အပိုင်းတွေ ဖြစ်နေတတ်ပြီး — data type အမျိုးမျိုး ကူးသန်း (cross-data-type) လုပ်တဲ့ operators နဲ့ functions တွေကတော့ — family ရဲ့ loose members တွေအနေနဲ့ ပြုလုပ်လေ့ ရှိပါတယ်။

`ALTER OPERATOR FAMILY` ကို သုံးဖို့ — သင်ဟာ superuser ဖြစ်ရပါမယ်။ (ဒီ ကန့်သတ်ချက်ကို — မှားယွင်းတဲ့ operator family definition တစ်ခုက server ကို ရှုပ်ထွေးစေနိုင်လို့ ဒါမှမဟုတ် crash ဖြစ်စေနိုင်လို့ — ပြုလုပ်ထားတာပါ။)

`ALTER OPERATOR FAMILY` က — လောလောဆယ် — operator family definition ထဲမှာ index method က လိုအပ်တဲ့ operators နဲ့ functions တွေ အားလုံး ပါဝင်မဝင်၊ ဒါမှမဟုတ် operators နဲ့ functions တွေက တစ်ခုနဲ့တစ်ခု ညီညွတ်တဲ့ (self-consistent) set တစ်ခု ဖြစ်မဖြစ်ကို စစ်ဆေးပေးခြင်း မရှိပါဘူး။ Valid operator family တစ်ခုကို သတ်မှတ်တာက user ရဲ့ တာဝန် ဖြစ်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 36.16](https://www.postgresql.org/docs/current/xindex.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ရှိပြီးသား operator family တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **index_method** — ဒီ operator family က ရည်ရွယ်ထားတဲ့ index method ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **strategy_number** — Operator family နဲ့ ဆက်စပ်နေတဲ့ operator တစ်ခုအတွက် — index method ရဲ့ strategy number ဖြစ်ပါတယ်။
- **operator_name** — Operator family နဲ့ ဆက်စပ်နေတဲ့ operator တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **op_type** — `OPERATOR` clause တစ်ခုထဲမှာဆိုရင် — operator ရဲ့ operand data type(s) တွေ ဖြစ်ပြီး — prefix operator တစ်ခုကို ညွှန်ပြဖို့ NONE လို့ သုံးပါတယ်။ `CREATE OPERATOR CLASS` ထဲက ဆင်တူတဲ့ syntax နဲ့ မတူဘဲ — ဒီနေရာမှာ operand data types တွေကို အမြဲတမ်း သတ်မှတ်ပေးရပါတယ်။
`ADD FUNCTION` clause တစ်ခုထဲမှာဆိုရင် — function ရဲ့ input data type(s) တွေနဲ့ မတူညီတဲ့အခါ — function က ထောက်ပံ့ဖို့ ရည်ရွယ်ထားတဲ့ operand data type(s) တွေ ဖြစ်ပါတယ်။ B-tree comparison functions နဲ့ hash functions တွေအတွက်တော့ — function ရဲ့ input data type(s) တွေက အမြဲတမ်း သုံးသင့်တဲ့ အရာတွေ ဖြစ်လို့ — op_type ကို သတ်မှတ်ဖို့ မလိုအပ်ပါဘူး။ B-tree sort support functions, B-tree equal image functions နဲ့ GiST, SP-GiST နဲ့ GIN operator classes တွေထဲက functions အားလုံးအတွက်တော့ — function ကို ဘယ် operand data type(s) တွေနဲ့ သုံးမလဲဆိုတာ သတ်မှတ်ပေးဖို့ လိုအပ်ပါတယ်။
`DROP FUNCTION` clause တစ်ခုထဲမှာဆိုရင် — function က ထောက်ပံ့ဖို့ ရည်ရွယ်ထားတဲ့ operand data type(s) တွေကို သတ်မှတ်ပေးရပါမယ်။
- **sort_family_name** — Ordering operator တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ sort ordering ကို ဖော်ပြတဲ့ — ရှိပြီးသား btree operator family တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
`FOR SEARCH` ရော `FOR ORDER BY` ရော နှစ်ခုလုံး မသတ်မှတ်ထားရင် — `FOR SEARCH` က default ဖြစ်ပါတယ်။
- **support_number** — Operator family နဲ့ ဆက်စပ်နေတဲ့ function တစ်ခုအတွက် — index method ရဲ့ support function number ဖြစ်ပါတယ်။
- **function_name** — Operator family အတွက် index method support function တစ်ခု ဖြစ်တဲ့ function တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။ Argument list တစ်ခုကို မသတ်မှတ်ထားရင် — နာမည်က ၎င်းရဲ့ schema ထဲမှာ ထူးခြား (unique) ဖြစ်ရပါမယ်။
- **argument_type** — Function ရဲ့ parameter data type(s) တွေ ဖြစ်ပါတယ်။
- **new_name** — Operator family ရဲ့ နာမည် အသစ် ဖြစ်ပါတယ်။
- **new_owner** — Operator family ရဲ့ ပိုင်ရှင် အသစ် ဖြစ်ပါတယ်။
- **new_schema** — Operator family အတွက် schema အသစ် ဖြစ်ပါတယ်။

`OPERATOR` နဲ့ `FUNCTION` clauses တွေကို — ဘယ် order နဲ့မဆို ပေါ်လာနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

`DROP` syntax က operator family ထဲက “slot” (နေရာ) ကိုပဲ — strategy ဒါမှမဟုတ် support number နဲ့ input data type(s) တွေအားဖြင့် — သတ်မှတ်ပေးတာ သတိပြုပါ။ Slot ကို သိမ်းပိုက်ထားတဲ့ operator ဒါမှမဟုတ် function ရဲ့ နာမည်ကိုတော့ ဖော်ပြမထားပါဘူး။ ဒါ့အပြင် — `DROP FUNCTION` အတွက် — သတ်မှတ်ရမယ့် type(s) တွေက function က ထောက်ပံ့ဖို့ ရည်ရွယ်ထားတဲ့ input data type(s) တွေ ဖြစ်ပါတယ်; GiST, SP-GiST နဲ့ GIN indexes တွေအတွက်တော့ — ဒါက function ရဲ့ တကယ့် input argument types တွေနဲ့ ဘာမှ ဆက်စပ်မှု မရှိနိုင်ပါဘူး။

Index machinery (index ယန္တရား) က functions တွေကို မသုံးခင် access permissions တွေကို စစ်ဆေးမှု မရှိတာကြောင့် — function တစ်ခု သို့မဟုတ် operator တစ်ခုကို operator family တစ်ခုထဲမှာ ထည့်သွင်းတာက — ၎င်းအပေါ်မှာ public execute permission ပေးလိုက်တာနဲ့ တူညီပါတယ်။ Operator family တစ်ခုထဲမှာ အသုံးဝင်လေ့ ရှိတဲ့ function မျိုးတွေအတွက်တော့ ဒါက ပုံမှန်အားဖြင့် ပြဿနာ မဟုတ်ပါဘူး။

Operators တွေကို SQL functions တွေနဲ့ သတ်မှတ်ထားခြင်း မဖြစ်သင့်ပါဘူး။ SQL function တစ်ခုက calling query ထဲမှာ inline (တိုက်ရိုက် ထည့်သွင်း) လုပ်ခံရနိုင်ခြေ များပြီး — အဲဒါက optimizer က — query က index တစ်ခုနဲ့ ကိုက်ညီတယ်ဆိုတာကို — မှတ်မိခြင်းကနေ တားဆီးပါလိမ့်မယ်။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာ command က — `int4` နဲ့ `int2` data types တွေအတွက် B-tree operator classes တွေ ပါဝင်ပြီးသား operator family တစ်ခုဆီ — cross-data-type (data type အမျိုးမျိုး ကူးသန်း) operators နဲ့ support functions တွေကို ထည့်သွင်းပါတယ်။

```sql
ALTER OPERATOR FAMILY integer_ops USING btree ADD

  -- int4 vs int2
  OPERATOR 1 < (int4, int2) ,
  OPERATOR 2 <= (int4, int2) ,
  OPERATOR 3 = (int4, int2) ,
  OPERATOR 4 >= (int4, int2) ,
  OPERATOR 5 > (int4, int2) ,
  FUNCTION 1 btint42cmp(int4, int2) ,

  -- int2 vs int4
  OPERATOR 1 < (int2, int4) ,
  OPERATOR 2 <= (int2, int4) ,
  OPERATOR 3 = (int2, int4) ,
  OPERATOR 4 >= (int2, int4) ,
  OPERATOR 5 > (int2, int4) ,
  FUNCTION 1 btint24cmp(int2, int4) ;
```

ဒီ entries တွေကို ပြန်လည် ဖယ်ရှားဖို့:

```sql
ALTER OPERATOR FAMILY integer_ops USING btree DROP

  -- int4 vs int2
  OPERATOR 1 (int4, int2) ,
  OPERATOR 2 (int4, int2) ,
  OPERATOR 3 (int4, int2) ,
  OPERATOR 4 (int4, int2) ,
  OPERATOR 5 (int4, int2) ,
  FUNCTION 1 (int4, int2) ,

  -- int2 vs int4
  OPERATOR 1 (int2, int4) ,
  OPERATOR 2 (int2, int4) ,
  OPERATOR 3 (int2, int4) ,
  OPERATOR 4 (int2, int4) ,
  OPERATOR 5 (int2, int4) ,
  FUNCTION 1 (int2, int4) ;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER OPERATOR FAMILY` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE OPERATOR FAMILY](/docs/postgresql/sql-createopfamily), [DROP OPERATOR FAMILY](/docs/postgresql/sql-dropopfamily), [CREATE OPERATOR CLASS](/docs/postgresql/sql-createopclass), [ALTER OPERATOR CLASS](/docs/postgresql/sql-alteropclass), [DROP OPERATOR CLASS](/docs/postgresql/sql-dropopclass)
