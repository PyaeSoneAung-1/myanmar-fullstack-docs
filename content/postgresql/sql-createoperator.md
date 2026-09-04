---
title: "CREATE OPERATOR (operator အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Operator အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးသည့် command — operator ကို အကောင်အထည်ဖော်မည့် function (FUNCTION/PROCEDURE clause)၊ operand data types (LEFTARG/RIGHTARG)၊ COMMUTATOR/NEGATOR (commutator/negator operators)၊ restriction/join selectivity estimator functions (RESTRICT/JOIN) နှင့် hash join/merge join အတွက် ထောက်ပံ့မှု (HASHES/MERGES) စသည့် optimization attributes များ သတ်မှတ်နိုင်ခြင်း"
order: 316
source: "https://www.postgresql.org/docs/current/sql-createoperator.html"
status: translated
updated: 2026-09-04
---

## CREATE OPERATOR (operator အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE OPERATOR — operator အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE OPERATOR name (
    {FUNCTION|PROCEDURE} = function_name
    [, LEFTARG = left_type ] [, RIGHTARG = right_type ]
    [, COMMUTATOR = com_op ] [, NEGATOR = neg_op ]
    [, RESTRICT = res_proc ] [, JOIN = join_proc ]
    [, HASHES ] [, MERGES ]
)
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE OPERATOR` က operator အသစ် `name` တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Operator ကို သတ်မှတ်တဲ့ user က ၎င်းရဲ့ owner ဖြစ်လာပါတယ်။ Schema နာမည် တစ်ခု ပေးထားရင် — operator ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။

Operator နာမည်ဆိုတာ — အောက်ပါ list ထဲက character တွေနဲ့ ဖွဲ့စည်းထားတဲ့ — `NAMEDATALEN`-1 (default အားဖြင့် 63) အထိ ရှည်လျားနိုင်တဲ့ character sequence တစ်ခု ဖြစ်ပါတယ်:

+ - * / < > = ~ ! @ # % ^ & | ` ?

နာမည် ရွေးချယ်မှုအတွက် ကန့်သတ်ချက် အနည်းငယ် ရှိပါတယ်:

- `--` နဲ့ `/*` တွေက — comment တစ်ခုရဲ့ အစအဖြစ် မှတ်ယူခံရမှာ ဖြစ်လို့ — operator နာမည်တစ်ခုထဲမှာ ဘယ်နေရာမှာမဆို ပေါ်လို့ မရပါဘူး။
- Multicharacter operator နာမည်တစ်ခုက — အောက်ပါ character တွေထဲက အနည်းဆုံး တစ်ခုကိုလည်း နာမည်ထဲမှာ ပါဝင်စေမှသာ — `+` ဒါမှမဟုတ် `-` နဲ့ အဆုံးသတ်လို့ ရပါတယ်:
  
  
              ~ ! @ # % ^ & | ` ?
  
  ဥပမာ — `@-` က ခွင့်ပြုထားတဲ့ operator နာမည်တစ်ခု ဖြစ်ပေမယ့် — `*-` ကတော့ မဟုတ်ပါဘူး။ ဒီ ကန့်သတ်ချက်က PostgreSQL ကို — token တွေကြားမှာ space တွေ မလိုအပ်ဘဲ — SQL-compliant commands တွေကို parse လုပ်နိုင်စေပါတယ်။
- `=>` သင်္ကေတကို SQL grammar က သီးသန့် သိမ်းဆည်းထားလို့ — operator နာမည်အဖြစ် သုံးလို့ မရပါဘူး။

`!=` operator က input မှာ `<>` အဖြစ် ပြောင်းလဲ (map) ခံရလို့ — ဒီ နာမည်နှစ်ခုက အမြဲတမ်း ညီမျှပါတယ်။

Binary operators (operand နှစ်ခု လက်ခံတဲ့ operators) တွေအတွက် — `LEFTARG` ရော `RIGHTARG` ရော နှစ်ခုလုံး သတ်မှတ်ရပါမယ်။ Prefix operators (ရှေ့ဆက် operators) တွေအတွက်ကတော့ — `RIGHTARG` တစ်ခုတည်းပဲ သတ်မှတ်သင့်ပါတယ်။ `function_name` function ကို — `CREATE FUNCTION` သုံးပြီး အရင်ကတည်းက သတ်မှတ်ထားရမှာ ဖြစ်ပြီး — ညွှန်ပြထားတဲ့ type တွေရဲ့ argument အရေအတွက် မှန်ကန်စွာ (တစ်ခု သို့မဟုတ် နှစ်ခု) လက်ခံအောင် သတ်မှတ်ထားရပါမယ်။

`CREATE OPERATOR` ရဲ့ syntax ထဲမှာ — `FUNCTION` နဲ့ `PROCEDURE` keywords တွေက ညီမျှပေမယ့် — ရည်ညွှန်းထားတဲ့ အရာက ဘယ်လိုပဲ ဖြစ်ဖြစ် function တစ်ခု ဖြစ်ရပါမယ် — procedure မဟုတ်ပါဘူး။ ဒီနေရာမှာ `PROCEDURE` keyword ကို သုံးတာက သမိုင်း အရ ကျန်ရစ်ခဲ့တဲ့ (historical) အလေ့အထ ဖြစ်ပြီး — deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသည်) လည်း ဖြစ်ပါတယ်။

ကျန် clauses တွေက optional operator optimization attributes တွေကို သတ်မှတ်ပါတယ်။ သူတို့ရဲ့ အဓိပ္ပာယ်ကို [အပိုင်း 36.15](https://www.postgresql.org/docs/current/xoper-optimization.html) မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

Operator တစ်ခု ဖန်တီးနိုင်ဖို့ — argument types နဲ့ return type ပေါ်မှာ `USAGE` privilege ရှိရပြီး — အောက်ခံ function ပေါ်မှာ `EXECUTE` privilege လည်း ရှိရပါမယ်။ Commutator သို့မဟုတ် negator operator တစ်ခုကို သတ်မှတ်ထားရင် — အဲဒီ operators တွေကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။

## Parameters (parameter များ)

- **name** — သတ်မှတ်ရမယ့် operator ရဲ့ နာမည် ဖြစ်ပါတယ်။ ခွင့်ပြုထားတဲ့ character တွေအတွက် အပေါ်မှာ ကြည့်ပါ။ နာမည်က schema-qualified (schema ပါဝင်သော) ဖြစ်နိုင်ပါတယ် — ဥပမာ `CREATE OPERATOR myschema.+ (...)` လိုမျိုးပါ။ မဟုတ်ရင် — operator ကို လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ Schema တစ်ခုတည်းထဲက operator နှစ်ခုက — data types မတူညီတဲ့အပေါ်မှာ လုပ်ဆောင်မယ်ဆိုရင် — နာမည် တူညိနိုင်ပါတယ်။ ဒါကို overloading (နာမည်တစ်ခုတည်းကို data types အမျိုးမျိုးအတွက် ပြန်လည် အသုံးပြုခြင်း) လို့ ခေါ်ပါတယ်။
- **function_name** — ဒီ operator ကို အကောင်အထည် ဖော်ဖို့ သုံးတဲ့ function ဖြစ်ပါတယ်။
- **left_type** — Operator ရဲ့ ဘယ်ဘက် operand ရဲ့ data type (ရှိရင်) ဖြစ်ပါတယ်။ Prefix operator တစ်ခုအတွက်ဆိုရင် — ဒီ option ကို ချန်လိုက်ပါတယ်။
- **right_type** — Operator ရဲ့ ညာဘက် operand ရဲ့ data type ဖြစ်ပါတယ်။
- **com_op** — ဒီ operator ရဲ့ commutator ဖြစ်ပါတယ်။
- **neg_op** — ဒီ operator ရဲ့ negator ဖြစ်ပါတယ်။
- **res_proc** — ဒီ operator အတွက် restriction selectivity estimator function (restriction အတွက် selectivity ခန့်မှန်း function) ဖြစ်ပါတယ်။
- **join_proc** — ဒီ operator အတွက် join selectivity estimator function (join အတွက် selectivity ခန့်မှန်း function) ဖြစ်ပါတယ်။
- **HASHES** — ဒီ operator က hash join တစ်ခုကို ထောက်ပံ့ (support) နိုင်တယ်ဆိုတာကို ညွှန်ပြပါတယ်။
- **MERGES** — ဒီ operator က merge join တစ်ခုကို ထောက်ပံ့နိုင်တယ်ဆိုတာကို ညွှန်ပြပါတယ်။

`com_op` ဒါမှမဟုတ် တခြား optional arguments တွေထဲမှာ schema-qualified operator နာမည်တစ်ခု ပေးဖို့ဆိုရင် — `OPERATOR()` syntax ကို သုံးပါ၊ ဥပမာ:

```sql
COMMUTATOR = OPERATOR(myschema.===) ,
```

## Notes (မှတ်စုများ)

နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 36.14](https://www.postgresql.org/docs/current/xoper.html) နဲ့ [အပိုင်း 36.15](https://www.postgresql.org/docs/current/xoper-optimization.html) ကို ကိုးကားကြည့်ပါ။

Self-commutative operator (မိမိနဲ့မိမိ commutative ဖြစ်တဲ့ operator) တစ်ခုကို သတ်မှတ်တဲ့အခါ — ရိုးရိုးလေး သတ်မှတ်လိုက်ရုံပါပဲ။ Commutative operators အတွဲတစ်တွဲကို သတ်မှတ်တဲ့အခါကျတော့ — နည်းနည်း ပိုပြီး သတိထားစရာ ဖြစ်ပါတယ်: အရင်ဆုံး သတ်မှတ်ရမယ့် operator တစ်ခုက — သင်မသတ်မှတ်ရသေးတဲ့ — နောက်တစ်ခုကို ဘယ်လို ရည်ညွှန်းနိုင်မှာလဲ? ဒီ ပြဿနာအတွက် အဖြေ သုံးခု ရှိပါတယ်:

- နည်းလမ်း တစ်ခုကတော့ — သင်သတ်မှတ်တဲ့ ပထမ operator ထဲမှာ `COMMUTATOR` clause ကို ချန်လိုက်ပြီး — ဒုတိယ operator ရဲ့ definition ထဲမှာတော့ ထည့်သွင်းပေးတာ ဖြစ်ပါတယ်။ Commutative operators တွေက အတွဲလိုက် လာတယ်ဆိုတာ PostgreSQL က သိတာမို့ — ဒုတိယ definition ကို မြင်တာနဲ့ — ပထမ definition ထဲက ပျောက်နေတဲ့ `COMMUTATOR` clause ကို အလိုအလျောက် ပြန်သွားပြီး ဖြည့်ပေးပါလိမ့်မယ်။
- နောက်ထပ် ပိုရိုးရှင်းတဲ့ နည်းလမ်းတစ်ခုကတော့ — definition နှစ်ခုလုံးမှာ `COMMUTATOR` clauses တွေ ထည့်သွင်းလိုက်ရုံပါပဲ။ PostgreSQL က ပထမ definition ကို process လုပ်ပြီး — `COMMUTATOR` က မရှိသေးတဲ့ operator တစ်ခုကို ရည်ညွှန်းနေတာကို သိလိုက်တဲ့အခါ — system က အဲဒီ operator အတွက် system catalog ထဲမှာ dummy entry (ယာယီ နေရာခံ entry) တစ်ခု ဖန်တီးပါလိမ့်မယ်။ ဒီ dummy entry ထဲမှာ — operator နာမည်၊ left နဲ့ right operand types တွေနဲ့ owner တို့အတွက်ပဲ — တရားဝင် (valid) data ရှိပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ အဲဒီအချိန်မှာ PostgreSQL က ဒီလောက်ပဲ မှန်းဆ (deduce) လို့ ရလို့ပါ။ ပထမ operator ရဲ့ catalog entry က ဒီ dummy entry ဆီ ချိတ်ဆက် (link) လုပ်ထားပါလိမ့်မယ်။ နောက်ပိုင်း — ဒုတိယ operator ကို သင်သတ်မှတ်တဲ့အခါ — system က dummy entry ကို — ဒုတိယ definition ကရတဲ့ — နောက်ထပ် အချက်အလက်တွေနဲ့ update လုပ်ပါတယ်။ Dummy operator ကို — ဖြည့်စွက်မပြီးသေးခင် — သုံးဖို့ ကြိုးစားရင် — error message တစ်ခုပဲ ရပါလိမ့်မယ်။
- ဒါမှမဟုတ် — operator နှစ်ခုလုံးကို `COMMUTATOR` clauses တွေ မပါဘဲ သတ်မှတ်ပြီး — နောက်မှ [`ALTER OPERATOR`](/docs/postgresql/sql-alteroperator) ကို သုံးပြီး သူတို့ရဲ့ commutator links တွေကို သတ်မှတ်နိုင်ပါတယ်။ အတွဲထဲက တစ်ခုကို `ALTER` လုပ်ရုံနဲ့ လုံလောက်ပါတယ်။

ဒီ ကိစ္စ သုံးမျိုးလုံးမှာ — operator နှစ်ခုကို commutators အဖြစ် အမှတ်အသား လုပ်ဖို့ — သင်ဟာ operator နှစ်ခုလုံးကို ပိုင်ဆိုင်ရပါမယ်။

Negator operators အတွဲတွေကိုလည်း — commutator အတွဲတွေအတွက် သုံးခဲ့တဲ့ နည်းလမ်းတွေအတိုင်းပဲ — သတ်မှတ်နိုင်ပါတယ်။

`CREATE OPERATOR` မှာ operator တစ်ခုရဲ့ lexical precedence (syntax အရ ဦးစားပေး အနေအထား) ကို သတ်မှတ်ဖို့ မဖြစ်နိုင်ပါဘူး — parser ရဲ့ precedence အပြုအမူက hard-wired (ကြိုတင် ပုံသေ သတ်မှတ်ထားသည်) ဖြစ်လို့ပါ။ Precedence အသေးစိတ်တွေအတွက် [အပိုင်း 4.1.6](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။

အသုံးမရတော့တဲ့ (obsolete) options တွေဖြစ်တဲ့ `SORT1`, `SORT2`, `LTCMP` နဲ့ `GTCMP` တွေကို — အရင်တုန်းက merge-joinable operator တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ sort operators တွေရဲ့ နာမည်တွေကို သတ်မှတ်ဖို့ သုံးခဲ့ပါတယ်။ ဒါတွေ လိုအပ်တော့ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ ဆက်စပ်နေတဲ့ operators တွေရဲ့ အချက်အလက်ကို B-tree operator families တွေကို ကြည့်ခြင်းအားဖြင့် ရှာတွေ့နိုင်လို့ပါ။ ဒီ options တွေထဲက တစ်ခုကို ပေးထားရင် — `MERGES` ကို implicitly true ဖြစ်အောင် သတ်မှတ်ပေးတာကလွဲရင် — ၎င်းကို လျစ်လျူရှုပါတယ်။

User-defined operators တွေကို database တစ်ခုကနေ ဖျက်ပစ်ဖို့ [`DROP OPERATOR`](/docs/postgresql/sql-dropoperator) ကို သုံးပါ။ Database ထဲက operators တွေကို ပြုပြင်ဖို့ [`ALTER OPERATOR`](/docs/postgresql/sql-alteroperator) ကို သုံးပါ။

## Examples (ဥပမာများ)

အောက်ပါ command က — `box` data type အတွက် — area-equality ဆိုတဲ့ operator အသစ်တစ်ခုကို သတ်မှတ်ပါတယ်:

```sql
CREATE OPERATOR === (
    LEFTARG = box,
    RIGHTARG = box,
    FUNCTION = area_equal_function,
    COMMUTATOR = ===,
    NEGATOR = !==,
    RESTRICT = area_restriction_function,
    JOIN = area_join_function,
    HASHES, MERGES
);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE OPERATOR` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ထဲမှာ user-defined operators တွေအတွက် ပြဋ္ဌာန်းချက် (provisions) တွေ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER OPERATOR](/docs/postgresql/sql-alteroperator), [CREATE OPERATOR CLASS](/docs/postgresql/sql-createopclass), [DROP OPERATOR](/docs/postgresql/sql-dropoperator)
