---
title: "ALTER PROCEDURE (procedure တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Procedure တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — RENAME TO, OWNER TO, SET SCHEMA, DEPENDS ON EXTENSION (NO အပါအဝင်), SECURITY INVOKER/DEFINER နှင့် configuration parameters (SET/RESET/RESET ALL/SET FROM CURRENT) ပြောင်းလဲခြင်း ပုံစံများ ပါဝင်ပြီး — procedure ကို ပိုင်ဆိုင်ရန် လိုအပ်ချက်များနှင့် SQL standard နှင့် တစ်စိတ်တစ်ပိုင်း လိုက်ဖက်ညီမှုအကြောင်း ဖော်ပြထားသည်"
order: 223
source: "https://www.postgresql.org/docs/current/sql-alterprocedure.html"
status: translated
updated: 2026-09-04
---

## ALTER PROCEDURE (procedure တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER PROCEDURE — procedure တစ်ခုရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက် (definition) ကို ပြောင်းလဲပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER PROCEDURE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    action [ ... ] [ RESTRICT ]
ALTER PROCEDURE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    RENAME TO new_name
ALTER PROCEDURE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER PROCEDURE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    SET SCHEMA new_schema
ALTER PROCEDURE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    [ NO ] DEPENDS ON EXTENSION extension_name

where action is one of:

    [ EXTERNAL ] SECURITY INVOKER | [ EXTERNAL ] SECURITY DEFINER
    SET configuration_parameter { TO | = } { value | DEFAULT }
    SET configuration_parameter FROM CURRENT
    RESET configuration_parameter
    RESET ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER PROCEDURE` က procedure တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER PROCEDURE` ကို သုံးဖို့ — procedure ကို ကိုယ်တိုင် ပိုင်ဆိုင်ထားရပါမယ်။ Procedure တစ်ခုရဲ့ schema ကို ပြောင်းဖို့ — schema အသစ်အပေါ်မှာ `CREATE` privilege လည်း ရှိရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ဆိုရင် — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပါမယ် — ပြီးတော့ — အဲဒီ role က procedure ရဲ့ schema အပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ကို ပြောင်းလဲတာက — procedure ကို drop လုပ်ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် မလုပ်နိုင်တဲ့ အရာတစ်စုံတစ်ရာကို မလုပ်မိစေဖို့ အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် procedure ရဲ့ ownership ကိုမဆို ပြောင်းလဲလို့ ရပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား procedure တစ်ခုရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။ Argument list တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — နာမည်က ၎င်းရဲ့ schema ထဲမှာ ထူးခြား (unique) ဖြစ်ရပါမယ်။
- **argmode** — Argument တစ်ခုရဲ့ mode: IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ခဲ့ရင် — default ကတော့ IN ဖြစ်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ `ALTER PROCEDURE` က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — procedure ရဲ့ identity (တည်မှတ်) ကို ဆုံးဖြတ်ရာမှာ argument data types တွေကိုပဲ သုံးလို့ပါ။
- **argtype** — Procedure ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်ထားနိုင်သည်) — ရှိရင် ဖြစ်ပါတယ်။ Argument data type(s) တွေကို သုံးပြီး procedure ကို ဘယ်လို ရှာဖွေလဲဆိုတဲ့ အသေးစိတ်အတွက် DROP PROCEDURE ကို ကြည့်ပါ။
- **new_name** — Procedure ရဲ့ နာမည် အသစ်။
- **new_owner** — Procedure ရဲ့ owner အသစ်။ Procedure ကို SECURITY DEFINER အဖြစ် အမှတ်အသား လုပ်ထားရင် — ၎င်းက နောက်ပိုင်းမှာ owner အသစ်အနေနဲ့ execute လုပ်မယ်ဆိုတာ သတိပြုပါ။
- **new_schema** — Procedure အတွက် schema အသစ်။
- **extension_name** — ဒီပုံစံက — procedure ကို extension အပေါ် dependent ဖြစ်စေပြီး — NO ကို သတ်မှတ်ထားရင် extension အပေါ် dependent မဖြစ်တော့အောင် အမှတ်အသား လုပ်ပါတယ်။ Extension အပေါ် dependent အဖြစ် အမှတ်အသား လုပ်ထားတဲ့ procedure တစ်ခုကို — cascade သတ်မှတ်မထားဘဲနဲ့တောင် — extension ကို drop လုပ်တဲ့အခါ — drop လုပ်ပါတယ်။ Procedure တစ်ခုက extensions အများအပြားအပေါ် dependent ဖြစ်နိုင်ပြီး — အဲဒီ extensions တွေထဲက ဘယ်ဟာကို drop လုပ်လုပ်နဲ့ — procedure ကို drop လုပ်မှာ ဖြစ်ပါတယ်။
- **[ EXTERNAL ] SECURITY INVOKER** / **[ EXTERNAL ] SECURITY DEFINER** — Procedure က security definer တစ်ခု ဟုတ်မဟုတ် ပြောင်းလဲပါတယ်။ EXTERNAL ဆိုတဲ့ key word ကို SQL conformance အတွက် လျစ်လျူရှုပါတယ်။ ဒီ capability အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် CREATE PROCEDURE ကို ကြည့်ပါ။
- **configuration_parameter** / **value** — Procedure ကို ခေါ်ယူတဲ့အခါ configuration parameter တစ်ခုဆီ လုပ်ပေးရမယ့် assignment (တာဝန်ပေး သတ်မှတ်မှု) ကို ထပ်ပေါင်းပါတယ် သို့မဟုတ် ပြောင်းလဲပါတယ်။ value က DEFAULT ဖြစ်ရင် ဒါမှမဟုတ် — ညီမျှစွာ — RESET ကို သုံးထားရင် — procedure-local setting ကို ဖယ်ရှားလိုက်လို့ — procedure က ၎င်းရဲ့ environment ထဲမှာ ရှိနေတဲ့ တန်ဖိုးနဲ့ execute လုပ်ပါတယ်။ Procedure-local settings တွေ အားလုံးကို ရှင်းလင်းဖို့ RESET ALL ကို သုံးပါ။ SET FROM CURRENT က — `ALTER PROCEDURE` ကို execute လုပ်နေချိန်မှာ လက်ရှိ ရှိနေတဲ့ parameter ရဲ့ တန်ဖိုးကို — procedure ထဲကို ဝင်ရောက်တဲ့အခါ သုံးစွဲရမယ့် တန်ဖိုးအဖြစ် သိမ်းဆည်းပေးပါတယ်။
ခွင့်ပြုထားတဲ့ parameter names နဲ့ values တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် SET နဲ့ အခန်း 19 ကို ကြည့်ပါ။
- **RESTRICT** — SQL standard နဲ့ လိုက်ဖက်ညီမှုအတွက် လျစ်လျူရှုပါတယ်။

## Examples (ဥပမာများ)

`integer` type ရှိတဲ့ argument နှစ်ခု ပါတဲ့ `insert_data` procedure ကို `insert_record` လို့ နာမည်ပြောင်းဖို့:

```sql
ALTER PROCEDURE insert_data(integer, integer) RENAME TO insert_record;
```

`integer` type ရှိတဲ့ argument နှစ်ခု ပါတဲ့ `insert_data` procedure ရဲ့ owner ကို `joe` အဖြစ် ပြောင်းဖို့:

```sql
ALTER PROCEDURE insert_data(integer, integer) OWNER TO joe;
```

`integer` type ရှိတဲ့ argument နှစ်ခု ပါတဲ့ `insert_data` procedure ရဲ့ schema ကို `accounting` အဖြစ် ပြောင်းဖို့:

```sql
ALTER PROCEDURE insert_data(integer, integer) SET SCHEMA accounting;
```

`insert_data(integer, integer)` procedure ကို `myext` extension အပေါ် dependent အဖြစ် အမှတ်အသား လုပ်ဖို့:

```sql
ALTER PROCEDURE insert_data(integer, integer) DEPENDS ON EXTENSION myext;
```

Procedure တစ်ခုအတွက် အလိုအလျောက် သတ်မှတ်ပေးတဲ့ search path ကို ချိန်ညှိဖို့:

```sql
ALTER PROCEDURE check_password(text) SET search_path = admin, pg_temp;
```

Procedure တစ်ခုအတွက် `search_path` ရဲ့ အလိုအလျောက် သတ်မှတ်မှုကို disable လုပ်ဖို့:

```sql
ALTER PROCEDURE check_password(text) RESET search_path;
```

အဲဒီ procedure က — ၎င်းကို ခေါ်ယူတဲ့သူ (caller) သုံးနေတဲ့ search path ဘယ်လိုပဲ ဖြစ်ဖြစ် — အခုကစပြီး အဲဒီ search path နဲ့ပဲ execute လုပ်မှာ ဖြစ်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ statement က SQL standard ထဲက `ALTER PROCEDURE` statement နဲ့ တစ်စိတ်တစ်ပိုင်း လိုက်ဖက်ညီပါတယ်။ Standard က procedure တစ်ခုရဲ့ properties တွေ ပိုများများကို ပြုပြင်မွမ်းမံဖို့ ခွင့်ပြုပေမယ့် — procedure တစ်ခုကို နာမည်ပြောင်းခြင်း၊ procedure တစ်ခုကို security definer ဖြစ်စေခြင်း၊ procedure တစ်ခုဆီ configuration parameter values တွေ ချိတ်တွဲခြင်း သို့မဟုတ် procedure တစ်ခုရဲ့ owner, schema ဒါမှမဟုတ် volatility ကို ပြောင်းလဲခြင်း စွမ်းရည်တွေကိုတော့ မပေးပါဘူး။ Standard က `RESTRICT` key word ကိုလည်း လိုအပ်ပါတယ် — PostgreSQL မှာတော့ ၎င်းက optional ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE PROCEDURE](/docs/postgresql/sql-createprocedure), [DROP PROCEDURE](/docs/postgresql/sql-dropprocedure), [ALTER FUNCTION](/docs/postgresql/sql-alterfunction), [ALTER ROUTINE](/docs/postgresql/sql-alterroutine)
