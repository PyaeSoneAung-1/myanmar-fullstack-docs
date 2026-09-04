---
title: "ALTER ROUTINE (routine တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Routine (aggregate function, သာမန် function သို့မဟုတ် procedure) တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — ALTER AGGREGATE, ALTER FUNCTION နှင့် ALTER PROCEDURE တို့အတွက် အထွေထွေ (generic) ပုံစံတစ်ခု ဖြစ်ပြီး — routine names များကို aggregate functions တွေကို ရည်ညွှန်းခွင့်ပြုခြင်းသည် PostgreSQL extension တစ်ခု ဖြစ်ကြောင်း ဖော်ပြထားသည်"
order: 225
source: "https://www.postgresql.org/docs/current/sql-alterroutine.html"
status: translated
updated: 2026-09-04
---

## ALTER ROUTINE (routine တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER ROUTINE — routine (လုပ်ဆောင်ချက် စနစ်) တစ်ခုရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက် (definition) ကို ပြောင်းလဲပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    action [ ... ] [ RESTRICT ]
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    RENAME TO new_name
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    SET SCHEMA new_schema
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    [ NO ] DEPENDS ON EXTENSION extension_name

where action is one of:

    IMMUTABLE | STABLE | VOLATILE
    [ NOT ] LEAKPROOF
    [ EXTERNAL ] SECURITY INVOKER | [ EXTERNAL ] SECURITY DEFINER
    PARALLEL { UNSAFE | RESTRICTED | SAFE }
    COST execution_cost
    ROWS result_rows
    SET configuration_parameter { TO | = } { value | DEFAULT }
    SET configuration_parameter FROM CURRENT
    RESET configuration_parameter
    RESET ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER ROUTINE` က routine တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ် — routine ဆိုတာက aggregate function တစ်ခု၊ သာမန် function တစ်ခု သို့မဟုတ် procedure တစ်ခု ဖြစ်နိုင်ပါတယ်။ Parameters တွေရဲ့ ဖော်ပြချက်၊ ဥပမာတွေ ပိုများဖို့နဲ့ နောက်ထပ် အသေးစိတ်အချက်အလက်တွေအတွက် [ALTER AGGREGATE](https://www.postgresql.org/docs/current/sql-alteraggregate.html), [ALTER FUNCTION](/docs/postgresql/sql-alterfunction) နဲ့ [ALTER PROCEDURE](/docs/postgresql/sql-alterprocedure) အောက်မှာ ကြည့်ပါ။

## Examples (ဥပမာများ)

`integer` type အတွက် `foo` ဆိုတဲ့ routine ကို `foobar` လို့ နာမည်ပြောင်းဖို့:

```sql
ALTER ROUTINE foo(integer) RENAME TO foobar;
```

ဒီ command က — `foo` က aggregate တစ်ခု၊ function တစ်ခု ဒါမှမဟုတ် procedure တစ်ခု ဖြစ်ဖြစ် — ဘာဖြစ်ဖြစ် အလုပ်လုပ်ပါလိမ့်မယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ statement က SQL standard ထဲက `ALTER ROUTINE` statement နဲ့ တစ်စိတ်တစ်ပိုင်း လိုက်ဖက်ညီပါတယ်။ အသေးစိတ် နောက်ထပ်အတွက် [ALTER FUNCTION](/docs/postgresql/sql-alterfunction) နဲ့ [ALTER PROCEDURE](/docs/postgresql/sql-alterprocedure) အောက်မှာ ကြည့်ပါ။ Routine names တွေကို aggregate functions တွေကို ရည်ညွှန်းခွင့် ပြုတာကတော့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER AGGREGATE](https://www.postgresql.org/docs/current/sql-alteraggregate.html), [ALTER FUNCTION](/docs/postgresql/sql-alterfunction), [ALTER PROCEDURE](/docs/postgresql/sql-alterprocedure), [DROP ROUTINE](/docs/postgresql/sql-droproutine)

`CREATE ROUTINE` command ဆိုတာ မရှိဘူးဆိုတာ သတိပြုပါ။
