---
title: "ALTER FUNCTION (function တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Function တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးသည့် command — RENAME TO, OWNER TO, SET SCHEMA, DEPENDS ON EXTENSION (NO အပါအဝင်), volatility (IMMUTABLE/STABLE/VOLATILE), LEAKPROOF, PARALLEL, COST, ROWS, SUPPORT, SECURITY INVOKER/DEFINER နှင့် CALLED ON NULL INPUT/STRICT စသည့် function properties များ ပြောင်းလဲခြင်း ပုံစံများအပြင် configuration parameters (SET/RESET/RESET ALL/SET FROM CURRENT) ချိန်ညှိခြင်းအကြောင်း ဖော်ပြထားသည်"
order: 220
source: "https://www.postgresql.org/docs/current/sql-alterfunction.html"
status: translated
updated: 2026-09-04
---

## ALTER FUNCTION (function တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER FUNCTION — function တစ်ခုရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက် (definition) ကို ပြောင်းလဲပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER FUNCTION name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    action [ ... ] [ RESTRICT ]
ALTER FUNCTION name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    RENAME TO new_name
ALTER FUNCTION name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER FUNCTION name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    SET SCHEMA new_schema
ALTER FUNCTION name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    [ NO ] DEPENDS ON EXTENSION extension_name

where action is one of:

    CALLED ON NULL INPUT | RETURNS NULL ON NULL INPUT | STRICT
    IMMUTABLE | STABLE | VOLATILE
    [ NOT ] LEAKPROOF
    [ EXTERNAL ] SECURITY INVOKER | [ EXTERNAL ] SECURITY DEFINER
    PARALLEL { UNSAFE | RESTRICTED | SAFE }
    COST execution_cost
    ROWS result_rows
    SUPPORT support_function
    SET configuration_parameter { TO | = } { value | DEFAULT }
    SET configuration_parameter FROM CURRENT
    RESET configuration_parameter
    RESET ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER FUNCTION` က function တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER FUNCTION` ကို သုံးဖို့ — function ကို ကိုယ်တိုင် ပိုင်ဆိုင်ထားရပါမယ်။ Function တစ်ခုရဲ့ schema ကို ပြောင်းဖို့ — schema အသစ်အပေါ်မှာ `CREATE` privilege လည်း ရှိရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ဆိုရင် — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပါမယ် — ပြီးတော့ — အဲဒီ role က function ရဲ့ schema အပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ကို ပြောင်းလဲတာက — function ကို drop လုပ်ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် မလုပ်နိုင်တဲ့ အရာတစ်စုံတစ်ရာကို မလုပ်မိစေဖို့ အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် function ရဲ့ ownership ကိုမဆို ပြောင်းလဲလို့ ရပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား function တစ်ခုရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။ Argument list တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — နာမည်က ၎င်းရဲ့ schema ထဲမှာ ထူးခြား (unique) ဖြစ်ရပါမယ်။
- **argmode** — Argument တစ်ခုရဲ့ mode: IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ခဲ့ရင် — default ကတော့ IN ဖြစ်ပါတယ်။ `ALTER FUNCTION` က OUT arguments တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ identity (တည်မှတ်) ကို ဆုံးဖြတ်ဖို့ input arguments တွေကိုပဲ လိုအပ်လို့ပါ။ ဒါကြောင့် — IN, INOUT နဲ့ VARIADIC arguments တွေကိုပဲ စာရင်းပြုစုရင် လုံလောက်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ `ALTER FUNCTION` က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ identity ကို ဆုံးဖြတ်ဖို့ argument data types တွေကိုပဲ လိုအပ်လို့ပါ။
- **argtype** — Function ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်ထားနိုင်သည်) — ရှိရင် ဖြစ်ပါတယ်။
- **new_name** — Function ရဲ့ နာမည် အသစ်။
- **new_owner** — Function ရဲ့ owner အသစ်။ Function ကို SECURITY DEFINER အဖြစ် အမှတ်အသား လုပ်ထားရင် — ၎င်းက နောက်ပိုင်းမှာ owner အသစ်အနေနဲ့ execute လုပ်မယ်ဆိုတာ သတိပြုပါ။
- **new_schema** — Function အတွက် schema အသစ်။
- **DEPENDS ON EXTENSION extension_name** / **NO DEPENDS ON EXTENSION extension_name** — ဒီပုံစံက — function ကို extension အပေါ် dependent ဖြစ်စေပြီး — NO ကို သတ်မှတ်ထားရင် extension အပေါ် dependent မဖြစ်တော့အောင် အမှတ်အသား လုပ်ပါတယ်။ Extension အပေါ် dependent အဖြစ် အမှတ်အသား လုပ်ထားတဲ့ function တစ်ခုကို — CASCADE ကို သတ်မှတ်မထားဘဲနဲ့တောင် — extension ကို drop လုပ်တဲ့အခါ — drop လုပ်ပါတယ်။ Function တစ်ခုက extensions အများအပြားအပေါ် dependent ဖြစ်နိုင်ပြီး — အဲဒီ extensions တွေထဲက ဘယ်ဟာကို drop လုပ်လုပ်နဲ့ — function ကို drop လုပ်မှာ ဖြစ်ပါတယ်။
- **CALLED ON NULL INPUT** / **RETURNS NULL ON NULL INPUT** / **STRICT** — CALLED ON NULL INPUT က — arguments တွေထဲက တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုက null ဖြစ်နေတဲ့အခါမှာလည်း — function ကို invoke (ခေါ်ယူ) မယ့် ပုံစံအဖြစ် ပြောင်းလဲပေးပါတယ်။ RETURNS NULL ON NULL INPUT သို့မဟုတ် STRICT ကတော့ — arguments တွေထဲက တစ်ခုခုက null ဖြစ်နေရင် — function ကို invoke မလုပ်တော့ဘဲ — null result (ရလဒ်) တစ်ခုကို အလိုအလျောက် ယူဆလိုက်တဲ့ ပုံစံအဖြစ် ပြောင်းလဲပေးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **IMMUTABLE** / **STABLE** / **VOLATILE** — Function ရဲ့ volatility (မတည်ငြိမ်မှု အဆင့်) ကို သတ်မှတ်ထားတဲ့ setting ဆီ ပြောင်းလဲပါတယ်။ အသေးစိတ်အတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **[ EXTERNAL ] SECURITY INVOKER** / **[ EXTERNAL ] SECURITY DEFINER** — Function က security definer တစ်ခု ဟုတ်မဟုတ် ပြောင်းလဲပါတယ်။ EXTERNAL ဆိုတဲ့ key word ကို SQL conformance အတွက် လျစ်လျူရှုပါတယ်။ ဒီ capability အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **PARALLEL** — Function က parallelism (အပြိုင် လုပ်ဆောင်မှု) အတွက် လုံခြုံ (safe) လို့ သတ်မှတ်ထားလားဆိုတာ ပြောင်းလဲပါတယ်။ အသေးစိတ်အတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **LEAKPROOF** — Function ကို leakproof (data ပေါက်ကြားမှု မဖြစ်စေသော) လို့ သတ်မှတ်လား မသတ်မှတ်ဘူးလားဆိုတာ ပြောင်းလဲပါတယ်။ ဒီ capability အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **COST execution_cost** — Function ရဲ့ ခန့်မှန်း execution cost (လုပ်ဆောင်မှု ကုန်ကျစရိတ်) ကို ပြောင်းလဲပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **ROWS result_rows** — Set-returning function (set အလိုက် ပြန်ပေးသော function) တစ်ခုက ပြန်ပေးမယ့် ခန့်မှန်း row အရေအတွက်ကို ပြောင်းလဲပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် CREATE FUNCTION ကို ကြည့်ပါ။
- **SUPPORT support_function** — ဒီ function အတွက် သုံးစွဲရမယ့် planner support function (planner ရဲ့ လုပ်ဆောင်မှုကို ကူညီပေးသော function) ကို သတ်မှတ်ပါတယ် သို့မဟုတ် ပြောင်းလဲပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 36.11 ကို ကြည့်ပါ။ ဒီ option ကို သုံးဖို့ — superuser ဖြစ်ရပါမယ်။
ဒီ option က support function အသစ်တစ်ခုကို နာမည်ပေးရမှာ ဖြစ်လို့ — support function ကို လုံးဝ ဖယ်ရှားပစ်ဖို့ ဒီ option ကို သုံးလို့ မရပါဘူး။ အဲဒီလို လုပ်ဖို့ လိုအပ်ရင် CREATE OR REPLACE FUNCTION ကို သုံးပါ။
- **configuration_parameter** / **value** — Function ကို ခေါ်ယူတဲ့အခါ configuration parameter တစ်ခုဆီ လုပ်ပေးရမယ့် assignment (တာဝန်ပေး သတ်မှတ်မှု) ကို ထပ်ပေါင်းပါတယ် သို့မဟုတ် ပြောင်းလဲပါတယ်။ value က DEFAULT ဖြစ်ရင် ဒါမှမဟုတ် — ညီမျှစွာ — RESET ကို သုံးထားရင် — function-local setting ကို ဖယ်ရှားလိုက်လို့ — function က ၎င်းရဲ့ environment ထဲမှာ ရှိနေတဲ့ တန်ဖိုးနဲ့ execute လုပ်ပါတယ်။ Function-local settings တွေ အားလုံးကို ရှင်းလင်းဖို့ RESET ALL ကို သုံးပါ။ SET FROM CURRENT က — `ALTER FUNCTION` ကို execute လုပ်နေချိန်မှာ လက်ရှိ ရှိနေတဲ့ parameter ရဲ့ တန်ဖိုးကို — function ထဲကို ဝင်ရောက်တဲ့အခါ သုံးစွဲရမယ့် တန်ဖိုးအဖြစ် သိမ်းဆည်းပေးပါတယ်။
ခွင့်ပြုထားတဲ့ parameter names နဲ့ values တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် SET နဲ့ အခန်း 19 ကို ကြည့်ပါ။
- **RESTRICT** — SQL standard နဲ့ လိုက်ဖက်ညီမှုအတွက် လျစ်လျူရှုပါတယ်။

## Examples (ဥပမာများ)

`integer` type အတွက် `sqrt` function ကို `square_root` လို့ နာမည်ပြောင်းဖို့:

```sql
ALTER FUNCTION sqrt(integer) RENAME TO square_root;
```

`integer` type အတွက် `sqrt` function ရဲ့ owner ကို `joe` အဖြစ် ပြောင်းဖို့:

```sql
ALTER FUNCTION sqrt(integer) OWNER TO joe;
```

`integer` type အတွက် `sqrt` function ရဲ့ schema ကို `maths` အဖြစ် ပြောင်းဖို့:

```sql
ALTER FUNCTION sqrt(integer) SET SCHEMA maths;
```

`integer` type အတွက် `sqrt` function ကို `mathlib` extension အပေါ် dependent အဖြစ် အမှတ်အသား လုပ်ဖို့:

```sql
ALTER FUNCTION sqrt(integer) DEPENDS ON EXTENSION mathlib;
```

Function တစ်ခုအတွက် အလိုအလျောက် သတ်မှတ်ပေးတဲ့ search path ကို ချိန်ညှိဖို့:

```sql
ALTER FUNCTION check_password(text) SET search_path = admin, pg_temp;
```

Function တစ်ခုအတွက် `search_path` ရဲ့ အလိုအလျောက် သတ်မှတ်မှုကို disable လုပ်ဖို့:

```sql
ALTER FUNCTION check_password(text) RESET search_path;
```

အဲဒီ function က — ၎င်းကို ခေါ်ယူတဲ့သူ (caller) သုံးနေတဲ့ search path ဘယ်လိုပဲ ဖြစ်ဖြစ် — အခုကစပြီး အဲဒီ search path နဲ့ပဲ execute လုပ်မှာ ဖြစ်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ statement က SQL standard ထဲက `ALTER FUNCTION` statement နဲ့ တစ်စိတ်တစ်ပိုင်း လိုက်ဖက်ညီပါတယ်။ Standard က function တစ်ခုရဲ့ properties တွေ ပိုများများကို ပြုပြင်မွမ်းမံဖို့ ခွင့်ပြုပေမယ့် — function တစ်ခုကို နာမည်ပြောင်းခြင်း၊ function တစ်ခုကို security definer ဖြစ်စေခြင်း၊ function တစ်ခုဆီ configuration parameter values တွေ ချိတ်တွဲခြင်း သို့မဟုတ် function တစ်ခုရဲ့ owner, schema ဒါမှမဟုတ် volatility ကို ပြောင်းလဲခြင်း စွမ်းရည်တွေကိုတော့ မပေးပါဘူး။ Standard က `RESTRICT` key word ကိုလည်း လိုအပ်ပါတယ် — PostgreSQL မှာတော့ ၎င်းက optional ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FUNCTION](/docs/postgresql/sql-createfunction), [DROP FUNCTION](/docs/postgresql/sql-dropfunction), [ALTER PROCEDURE](/docs/postgresql/sql-alterprocedure), [ALTER ROUTINE](/docs/postgresql/sql-alterroutine)
