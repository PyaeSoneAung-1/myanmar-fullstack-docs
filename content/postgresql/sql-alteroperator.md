---
title: "ALTER OPERATOR (operator တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Operator တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — OWNER TO (ပိုင်ရှင် ပြောင်းခြင်း)၊ SET SCHEMA (schema ပြောင်းခြင်း) နှင့် SET (RESTRICT/JOIN selectivity estimator functions များ၊ COMMUTATOR, NEGATOR, HASHES, MERGES စသည့် optimizer options များ သတ်မှတ်ခြင်း) ပုံစံများ"
order: 289
source: "https://www.postgresql.org/docs/current/sql-alteroperator.html"
status: translated
updated: 2026-09-04
---

## ALTER OPERATOR (operator တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER OPERATOR — operator တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER OPERATOR name ( { left_type | NONE } , right_type )
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }

ALTER OPERATOR name ( { left_type | NONE } , right_type )
    SET SCHEMA new_schema

ALTER OPERATOR name ( { left_type | NONE } , right_type )
    SET ( {  RESTRICT = { res_proc | NONE }
           | JOIN = { join_proc | NONE }
           | COMMUTATOR = com_op
           | NEGATOR = neg_op
           | HASHES
           | MERGES
          } [, ... ] )
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER OPERATOR` က operator တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER OPERATOR` ကို သုံးဖို့ — operator ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Owner ကို ပြောင်းဖို့ဆိုရင် — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role က operator ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက operator ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် သင်မလုပ်နိုင်တဲ့ ဘာ action မှ မလုပ်နိုင်ဘူးဆိုတာကို အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser ကတော့ ဘယ် operator ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား operator တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **left_type** — Operator ရဲ့ left operand (ဘယ်ဘက် ကိန်းရှင်) ရဲ့ data type; operator မှာ left operand မရှိဘူးဆိုရင် NONE လို့ ရေးပါ။
- **right_type** — Operator ရဲ့ right operand (ညာဘက် ကိန်းရှင်) ရဲ့ data type။
- **new_owner** — Operator ရဲ့ ပိုင်ရှင် အသစ်။
- **new_schema** — Operator အတွက် schema အသစ်။
- **res_proc** — ဒီ operator အတွက် restriction selectivity estimator function (ရွေးချယ်မှု ကန့်သတ် ခန့်မှန်း function); ရှိပြီးသား selectivity estimator ကို ဖယ်ရှားဖို့ NONE လို့ ရေးပါ။
- **join_proc** — ဒီ operator အတွက် join selectivity estimator function (join ရွေးချယ်မှု ခန့်မှန်း function); ရှိပြီးသား selectivity estimator ကို ဖယ်ရှားဖို့ NONE လို့ ရေးပါ။
- **com_op** — ဒီ operator ရဲ့ commutator (အစီအစဉ် ပြောင်းပြန် operator)။ Operator မှာ ရှိပြီးသား commutator မရှိမှသာ ပြောင်းလဲလို့ ရပါတယ်။
- **neg_op** — ဒီ operator ရဲ့ negator (ငြင်းပယ် operator)။ Operator မှာ ရှိပြီးသား negator မရှိမှသာ ပြောင်းလဲလို့ ရပါတယ်။
- **HASHES** — ဒီ operator က hash join တစ်ခုကို ထောက်ပံ့နိုင်တယ်ဆိုတာ ညွှန်ပြပါတယ်။ Enable လုပ်လို့သာ ရပြီး — disable လုပ်လို့ မရပါဘူး။
- **MERGES** — ဒီ operator က merge join တစ်ခုကို ထောက်ပံ့နိုင်တယ်ဆိုတာ ညွှန်ပြပါတယ်။ Enable လုပ်လို့သာ ရပြီး — disable လုပ်လို့ မရပါဘူး။

## Notes (မှတ်စုများ)

နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 36.14](https://www.postgresql.org/docs/current/xoper.html) နဲ့ [အပိုင်း 36.15](https://www.postgresql.org/docs/current/xoper-optimization.html) ကို ကိုးကားကြည့်ပါ။

Commutators တွေက — တစ်ခုကိုတစ်ခု commutator ဖြစ်နေတဲ့ — အတွဲလိုက် ရှိတာမို့ — `ALTER OPERATOR SET COMMUTATOR` က `com_op` ရဲ့ commutator ကိုပါ — target operator အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။ အလားတူပဲ — `ALTER OPERATOR SET NEGATOR` ကလည်း — `neg_op` ရဲ့ negator ကို target operator အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။ ဒါကြောင့် — target operator ကို ပိုင်ဆိုင်ရုံမက — commutator ဒါမှမဟုတ် negator operator ကိုပါ သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။

## Examples (ဥပမာများ)

`text` type အတွက် custom operator `a @@ b` တစ်ခုရဲ့ owner ကို ပြောင်းဖို့:

```sql
ALTER OPERATOR @@ (text, text) OWNER TO joe;
```

`int[]` type အတွက် custom operator `a && b` တစ်ခုရဲ့ restriction နဲ့ join selectivity estimator functions တွေကို ပြောင်းဖို့:

```sql
ALTER OPERATOR && (int[], int[]) SET (RESTRICT = _int_contsel, JOIN = _int_contjoinsel);
```

`&&` operator ကို — သူ့ဘာသာသူရဲ့ commutator အဖြစ် — အမှတ်အသား လုပ်ဖို့:

```sql
ALTER OPERATOR && (int[], int[]) SET (COMMUTATOR = &&);
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER OPERATOR` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE OPERATOR](https://www.postgresql.org/docs/current/sql-createoperator.html), [DROP OPERATOR](/docs/postgresql/sql-dropoperator)
