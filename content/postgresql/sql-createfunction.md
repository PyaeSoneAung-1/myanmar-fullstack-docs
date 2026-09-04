---
title: "CREATE FUNCTION (function အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Function အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးတဲ့ သို့မဟုတ် ရှိပြီးသား function တစ်ခုရဲ့ definition ကို CREATE OR REPLACE ဖြင့် အစားထိုးပေးတဲ့ command — argmode (IN/OUT/INOUT/VARIADIC), argname, argtype, default_expr, RETURNS/RETURNS TABLE, lang_name, TRANSFORM, WINDOW, IMMUTABLE/STABLE/VOLATILE, LEAKPROOF, CALLED ON NULL INPUT/RETURNS NULL ON NULL INPUT/STRICT, SECURITY INVOKER/DEFINER, PARALLEL, COST, ROWS, SUPPORT, SET clause, AS definition, AS obj_file/link_symbol နှင့် sql_body (RETURN expression / BEGIN ATOMIC block) စသည့် attributes များအပြင် — overloading၊ SECURITY DEFINER functions များကို လုံခြုံစွာ ရေးသားခြင်းနှင့် SQL standard နဲ့ လိုက်ဖက်ညီမှု အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 219
source: "https://www.postgresql.org/docs/current/sql-createfunction.html"
status: translated
updated: 2026-09-04
---

## CREATE FUNCTION (function အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE FUNCTION — function အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] FUNCTION
    name ( [ [ argmode ] [ argname ] argtype [ { DEFAULT | = } default_expr ] [, ...] ] )
    [ RETURNS rettype
      | RETURNS TABLE ( column_name column_type [, ...] ) ]
  { LANGUAGE lang_name
    | TRANSFORM { FOR TYPE type_name } [, ... ]
    | WINDOW
    | { IMMUTABLE | STABLE | VOLATILE }
    | [ NOT ] LEAKPROOF
    | { CALLED ON NULL INPUT | RETURNS NULL ON NULL INPUT | STRICT }
    | { [ EXTERNAL ] SECURITY INVOKER | [ EXTERNAL ] SECURITY DEFINER }
    | PARALLEL { UNSAFE | RESTRICTED | SAFE }
    | COST execution_cost
    | ROWS result_rows
    | SUPPORT support_function
    | SET configuration_parameter { TO value | = value | FROM CURRENT }
    | AS 'definition'
    | AS 'obj_file', 'link_symbol'
    | sql_body
  } ...
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE FUNCTION` က function အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်။ `CREATE OR REPLACE FUNCTION` ကတော့ function အသစ်တစ်ခုကို ဖန်တီးပေးတာ ဒါမှမဟုတ် ရှိပြီးသား definition တစ်ခုကို replace (အစားထိုး) လုပ်ပေးပါလိမ့်မယ်။ Function တစ်ခုကို define လုပ်နိုင်ဖို့ — user က language အပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

Schema name တစ်ခု ပါဝင်နေရင် — function ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပါဝင်ဘူးဆိုရင်တော့ — current schema ထဲမှာ ဖန်တီးပါတယ်။ Function အသစ်ရဲ့ နာမည်က — တူညီတဲ့ schema ထဲမှာ — input argument types တူညီတဲ့ — ရှိပြီးသား function သို့မဟုတ် procedure တစ်ခုခုရဲ့ နာမည်နဲ့ မတိုက်မိရပါဘူး။ ဒါပေမယ့် — argument types မတူညီတဲ့ functions နဲ့ procedures တွေကတော့ နာမည်တစ်ခုတည်းကို မျှဝေသုံးနိုင်ပါတယ် (ဒါကို *overloading* (နာမည်တူ function အများအပြားကို argument type မျိုးစုံနဲ့ သတ်မှတ်ခြင်း) လို့ ခေါ်ပါတယ်)။

ရှိပြီးသား function တစ်ခုရဲ့ လက်ရှိ definition ကို replace လုပ်ဖို့ဆိုရင် `CREATE OR REPLACE FUNCTION` ကို သုံးပါ။ ဒီနည်းနဲ့ function တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် argument types တွေကို ပြောင်းလဲလို့ မရပါဘူး (ပြောင်းလဲဖို့ ကြိုးစားမိရင် — တကယ်တော့ သီးခြား function အသစ်တစ်ခုကို ဖန်တီးနေတာ ဖြစ်သွားပါလိမ့်မယ်)။ ဒါ့အပြင် — `CREATE OR REPLACE FUNCTION` က ရှိပြီးသား function တစ်ခုရဲ့ return type ကို ပြောင်းလဲခွင့် ပေးမှာ မဟုတ်ပါဘူး။ အဲဒါလုပ်ဖို့ဆိုရင် — function ကို drop လုပ်ပြီး ပြန်လည် ဖန်တီးရပါမယ်။ (`OUT` parameters တွေ သုံးထားတဲ့အခါ — ဆိုလိုတာက — function ကို drop လုပ်တာကလွဲပြီး — ဘယ် `OUT` parameter ရဲ့ type ကိုမှ ပြောင်းလဲလို့ မရဘူး ဆိုတာပါ။)

`CREATE OR REPLACE FUNCTION` ကို ရှိပြီးသား function တစ်ခုကို replace လုပ်ဖို့ သုံးတဲ့အခါ — function ရဲ့ ownership (ပိုင်ဆိုင်မှု) နဲ့ permissions တွေကတော့ ပြောင်းလဲခြင်း မရှိပါဘူး။ တခြား function properties တွေ အားလုံးကိုတော့ — command ထဲမှာ သတ်မှတ်ထားတဲ့ သို့မဟုတ် သွယ်ဝိုက် ညွှန်ပြထားတဲ့ (implied) တန်ဖိုးတွေနဲ့ သတ်မှတ်ပေးပါတယ်။ Function တစ်ခုကို replace လုပ်ဖို့ — အဲဒီ function ကို ကိုယ်တိုင် ပိုင်ဆိုင်ထားရပါမယ် (ပိုင်ဆိုင်တဲ့ role ရဲ့ member (အဖွဲ့ဝင်) ဖြစ်နေတာ အပါအဝင်)။

Function တစ်ခုကို drop လုပ်ပြီး ပြန်လည် ဖန်တီးလိုက်မယ်ဆိုရင် — function အသစ်က — အဟောင်းနဲ့ entity (အရာဝတ္ထု) တစ်ခုတည်း မဟုတ်တော့ပါဘူး; ဒါကြောင့် — function အဟောင်းကို ရည်ညွှန်းနေတဲ့ — ရှိပြီးသား rules, views, triggers စတာတွေကို — drop လုပ်ရပါလိမ့်မယ်။ Function တစ်ခုရဲ့ definition ကို — အဲဒီ function ကို ရည်ညွှန်းနေတဲ့ objects တွေ မပျက်စီးဘဲ — ပြောင်းလဲဖို့ဆိုရင် `CREATE OR REPLACE FUNCTION` ကို သုံးပါ။ ဒါ့အပြင် — ရှိပြီးသား function တစ်ခုရဲ့ auxiliary properties (အရန် ဂုဏ်သတ္တိများ) အများစုကို ပြောင်းလဲဖို့ — `ALTER FUNCTION` ကိုလည်း သုံးနိုင်ပါတယ်။

Function ကို ဖန်တီးတဲ့ user ကပဲ — function ရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

Function တစ်ခု ဖန်တီးနိုင်ဖို့ — argument types တွေနဲ့ return type အပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

Functions တွေ ရေးသားခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 36.3](https://www.postgresql.org/docs/current/xfunc.html) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် function ရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။
- **argmode** — Argument တစ်ခုရဲ့ mode — IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ရင် default ကတော့ IN ဖြစ်ပါတယ်။ OUT arguments တွေကသာ — VARIADIC argument တစ်ခုရဲ့ နောက်မှာ လိုက်နိုင်ပါတယ်။ ဒါ့အပြင် — OUT နဲ့ INOUT arguments တွေကို — `RETURNS TABLE` notation နဲ့အတူ — တွဲသုံးလို့ မရပါဘူး။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ Language အချို့ (SQL နဲ့ PL/pgSQL အပါအဝင်) က — function body ထဲမှာ ဒီ နာမည်ကို သုံးခွင့် ပြုပါတယ်။ တခြား language တွေအတွက်ကတော့ — input argument တစ်ခုရဲ့ နာမည်က — function ကိုယ်၌နဲ့ ပတ်သက်လို့ — အပို documentation (မှတ်တမ်း) တစ်ခုလောက်သာ ဖြစ်ပါတယ်; ဒါပေမယ့် — function တစ်ခုကို ခေါ်ယူတဲ့အခါ — ဖတ်ရှုရလွယ်ကူမှု (readability) ကောင်းမွန်စေဖို့ — input argument names တွေကို သုံးနိုင်ပါတယ် (အပိုင်း 4.3 ကို ကြည့်ပါ)။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — output argument တစ်ခုရဲ့ နာမည်ကတော့ အဓိပ္ပာယ် ရှိပါတယ် — ဘာလို့လဲဆိုတော့ ၎င်းက — result row type ထဲက column name ကို သတ်မှတ်ပေးလို့ပါ။ (Output argument တစ်ခုအတွက် နာမည် ချန်လိုက်ရင် — system က default column name တစ်ခုကို ရွေးချယ်ပေးပါလိမ့်မယ်။)
- **argtype** — Function ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်ထားနိုင်သည်) — ရှိရင် ဖြစ်ပါတယ်။ Argument types တွေက base, composite သို့မဟုတ် domain types တွေ ဖြစ်နိုင်သလို — table column တစ်ခုရဲ့ type ကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။
Implement လုပ်တဲ့ language ပေါ် မူတည်ပြီး — cstring လို “pseudo-types” (အစစ်အမှန် type မဟုတ်သော type များ) တွေကို သတ်မှတ်ခွင့်လည်း ရှိနိုင်ပါတယ်။ Pseudo-types ဆိုတာ — တကယ့် argument type ကို မပြည့်စုံဘဲ သတ်မှတ်ထားတာ ဒါမှမဟုတ် သာမန် SQL data types တွေရဲ့ အစုအဝေးရဲ့ အပြင်ဘက်မှာ ရှိနေတာမျိုးကို ညွှန်ပြတာပါ။
Column တစ်ခုရဲ့ type ကို — `table_name.column_name%TYPE` လို့ ရေးခြင်းအားဖြင့် ရည်ညွှန်းပါတယ်။ ဒီ feature ကို သုံးတာက — table တစ်ခုရဲ့ definition ထဲက ပြောင်းလဲမှုတွေနဲ့ မသက်ဆိုင်ဘဲ function တစ်ခု ဖြစ်နေအောင် တခါတရံမှာ အထောက်အကူ ပြုနိုင်ပါတယ်။
- **default_expr** — Parameter ကို သတ်မှတ်မပေးထားဘူးဆိုရင် — default value အဖြစ် သုံးရမယ့် expression တစ်ခု။ Expression က — parameter ရဲ့ argument type အဖြစ် coercion (type ပြောင်းလဲခြင်း) လုပ်လို့ ရနိုင်ရပါမယ်။ Input (INOUT အပါအဝင်) parameters တွေကသာ default value ရှိနိုင်ပါတယ်။ Default value ရှိတဲ့ parameter တစ်ခုနောက်က input parameters တွေ အားလုံးမှာလည်း default values တွေ ရှိရပါမယ်။
- **rettype** — Return data type (option အရ schema-qualified လုပ်ထားနိုင်သည်)။ Return type က base, composite သို့မဟုတ် domain type ဖြစ်နိုင်သလို — table column တစ်ခုရဲ့ type ကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။ Implement လုပ်တဲ့ language ပေါ် မူတည်ပြီး — cstring လို “pseudo-types” တွေကို သတ်မှတ်ခွင့်လည်း ရှိနိုင်ပါတယ်။ Function က တန်ဖိုးတစ်ခု ပြန်ပေးဖို့ မရည်ရွယ်ဘူးဆိုရင် — return type အဖြစ် void ကို သတ်မှတ်ပါ။
`OUT` သို့မဟုတ် `INOUT` parameters တွေ ရှိနေတဲ့အခါ — `RETURNS` clause ကို ချန်လိုက်လို့ ရပါတယ်။ ပါဝင်နေမယ်ဆိုရင် — output parameters တွေကနေ ရည်ညွှန်းလိုက်တဲ့ result type နဲ့ ကိုက်ညီရပါမယ်: output parameters အများအပြား ရှိရင် `RECORD` — ဒါမှမဟုတ် — output parameter တစ်ခုတည်း ရှိရင် — အဲဒီ parameter ရဲ့ type နဲ့ အတူတူ ဖြစ်ရပါတယ်။
`SETOF` modifier ကတော့ — function က item တစ်ခုတည်း မဟုတ်ဘဲ — items အစုတစ်ခု (set) ကို ပြန်ပေးမယ်ဆိုတာကို ညွှန်ပြပါတယ်။
Column တစ်ခုရဲ့ type ကို — `table_name.column_name%TYPE` လို့ ရေးခြင်းအားဖြင့် ရည်ညွှန်းပါတယ်။
- **column_name** — `RETURNS TABLE` syntax ထဲက output column တစ်ခုရဲ့ နာမည်။ ဒါက — named `OUT` parameter တစ်ခုကို ကြေညာတဲ့ နောက်ထပ် နည်းလမ်းတစ်ခု ဖြစ်ပြီး — `RETURNS TABLE` က `RETURNS SETOF` ကိုပါ ရည်ညွှန်းတယ်ဆိုတာ ကလွဲလို့ — ကျန်တာတွေ အတူတူပါပဲ။
- **column_type** — `RETURNS TABLE` syntax ထဲက output column တစ်ခုရဲ့ data type။
- **lang_name** — Function ကို implement လုပ်ထားတဲ့ language ရဲ့ နာမည်။ ၎င်းက sql, c, internal သို့မဟုတ် user-defined procedural language တစ်ခုရဲ့ နာမည် — ဥပမာ plpgsql — ဖြစ်နိုင်ပါတယ်။ `sql_body` ကို သတ်မှတ်ထားရင် default ကတော့ sql ဖြစ်ပါတယ်။ နာမည်ကို single quotes တွေနဲ့ ကာရံပြီး ရေးတာကတော့ deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) ဖြစ်ပြီး — case (စာလုံး အကြီး/အသေး) တိတိကျကျ ကိုက်ညီမှု လိုအပ်ပါတယ်။
- **TRANSFORM { FOR TYPE type_name } [, ... ] }** — Function တစ်ခုဆီ ခေါ်ယူတဲ့အခါ ဘယ် transforms တွေကို အသုံးပြုသင့်လဲဆိုတာကို စာရင်းပြုပါတယ်။ Transforms တွေက SQL types နဲ့ language-specific data types တွေကြားမှာ ပြောင်းလဲပေးပါတယ်; `CREATE TRANSFORM` ကို ကြည့်ပါ။ Procedural language implementations တွေမှာ ပုံမှန်အားဖြင့် built-in types တွေအကြောင်း hardcoded (ကုတ်ထဲ အတိအကျ ထည့်သွင်းထားသော) သိရှိမှု ရှိတာကြောင့် — အဲဒါတွေကို ဒီမှာ စာရင်းပြုစရာ မလိုပါဘူး။ Procedural language implementation တစ်ခုက type တစ်ခုကို ဘယ်လို ကိုင်တွယ်ရမယ်ဆိုတာ မသိဘဲ — transform တစ်ခုမှ မပေးထားဘူးဆိုရင် — data types တွေ ပြောင်းလဲခြင်းအတွက် default အပြုအမူတစ်ခုဆီ ပြန်ကျသွားပါတယ် — ဒါပေမယ့် — ဒါက implementation အပေါ် မူတည်ပါတယ်။
- **WINDOW** — WINDOW က — function က သာမန် function တစ်ခု မဟုတ်ဘဲ — window function တစ်ခု ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ လောလောဆယ် ဒါက C နဲ့ ရေးထားတဲ့ functions တွေအတွက်ပဲ အသုံးဝင်ပါတယ်။ ရှိပြီးသား function definition တစ်ခုကို အစားထိုးတဲ့အခါ — `WINDOW` attribute ကို ပြောင်းလဲလို့ မရပါဘူး။
- **IMMUTABLE** / **STABLE** / **VOLATILE** — ဒီ attributes တွေက — function ရဲ့ အပြုအမူအကြောင်း query optimizer ကို အသိပေးပါတယ်။ ရွေးချယ်မှု တစ်ခုတည်းကိုသာ သတ်မှတ်နိုင်ပါတယ်။ ဒါတွေ ဘာတစ်ခုမှ မပါဝင်ရင် — `VOLATILE` က default assumption (မူလ ယူဆချက်) ဖြစ်ပါတယ်။
`IMMUTABLE` က — function က database ကို ပြုပြင်မွမ်းမံလို့ မရဘူး — ပြီးတော့ — argument values တွေ တူညီနေသရွေ့ — တူညီတဲ့ ရလဒ်ကိုပဲ အမြဲ ပြန်ပေးတယ်ဆိုတာ ညွှန်ပြပါတယ်; ဆိုလိုတာက — database lookups တွေ လုပ်တာ သို့မဟုတ် — သူ့ရဲ့ argument list ထဲမှာ တိုက်ရိုက် မပါဝင်တဲ့ အချက်အလက်တွေကို တခြားနည်းနဲ့ သုံးတာမျိုး — မလုပ်ဘူးဆိုတာပါ။ ဒီ option ကို ပေးထားရင် — all-constant arguments တွေနဲ့ function ကို ခေါ်တာတိုင်းကို — function ရဲ့ တန်ဖိုးနဲ့ ချက်ချင်း အစားထိုးလို့ ရပါတယ်။
`STABLE` က — function က database ကို မပြုပြင်နိုင်ဘူး — ပြီးတော့ — table scan တစ်ခုတည်း အတွင်းမှာ — argument values တူညီတဲ့အတွက် — တူညီတဲ့ ရလဒ်ကို တစ်သမတ်တည်း ပြန်ပေးပေမယ့် — သူ့ရဲ့ ရလဒ်က SQL statements တွေကြားမှာတော့ ပြောင်းလဲနိုင်တယ်ဆိုတာ ညွှန်ပြပါတယ်။ ဒါက — ရလဒ်တွေက database lookups, parameter variables (လက်ရှိ time zone လို) စတာတွေပေါ်မှာ မှီခိုနေတဲ့ functions တွေအတွက် — သင့်လျော်တဲ့ ရွေးချယ်မှု ဖြစ်ပါတယ်။ (လက်ရှိ command က ပြုပြင်လိုက်တဲ့ rows တွေကို query လုပ်ချင်တဲ့ `AFTER` triggers တွေအတွက်တော့ မသင့်လျော်ပါဘူး။) ဒါ့အပြင် — current_timestamp family ထဲက functions တွေက — သူတို့ရဲ့ တန်ဖိုးတွေက transaction တစ်ခု အတွင်းမှာ မပြောင်းလဲတာကြောင့် — stable အဖြစ် သတ်မှတ်လိုက်တာ ဖြစ်တယ်ဆိုတာလည်း သတိပြုပါ။
`VOLATILE` က — function ရဲ့ တန်ဖိုးက table scan တစ်ခုတည်း အတွင်းမှာတောင် ပြောင်းလဲနိုင်တာကြောင့် — optimizations တစ်စုံတစ်ရာ မပြုလုပ်နိုင်ဘူးဆိုတာ ညွှန်ပြပါတယ်။ ဒီ သဘောအရ volatile ဖြစ်တဲ့ database functions တွေက အတော် နည်းပါတယ်; ဥပမာအချို့ကတော့ random(), currval(), timeofday() တို့ ဖြစ်ပါတယ်။ ဒါပေမယ့် — side-effects (ဘေးထွက် သက်ရောက်မှုများ) ရှိတဲ့ function တစ်ခုခုကို — သူ့ရဲ့ ရလဒ်က အတော်လေး ခန့်မှန်းလို့ ရနေရင်တောင် — calls တွေကို optimize လုပ်ပြီး ဖယ်ရှားပစ်ခြင်းကနေ ကာကွယ်ဖို့ — volatile အဖြစ် သတ်မှတ် ပေးရပါမယ်ဆိုတာ သတိပြုပါ; ဥပမာ setval() ဖြစ်ပါတယ်။
နောက်ထပ် အသေးစိတ်တွေအတွက် အပိုင်း 36.7 ကို ကြည့်ပါ။
- **LEAKPROOF** — `LEAKPROOF` က — function မှာ side effects တွေ မရှိဘူးဆိုတာ ညွှန်ပြပါတယ်။ ၎င်းက သူ့ရဲ့ arguments တွေအကြောင်း — return value ကလွဲပြီး — ဘာ သတင်းအချက်အလက်ကိုမှ မဖော်ပြပါဘူး။ ဥပမာ — argument values တချို့အတွက် error message ပစ်ချပြီး တချို့အတွက် မပစ်ချတဲ့ — သို့မဟုတ် — error message တွေထဲမှာ argument values တွေ ထည့်သွင်းတဲ့ — function တစ်ခုက leakproof မဟုတ်ပါဘူး။ ဒါက — security_barrier option နဲ့ ဖန်တီးထားတဲ့ views တွေ သို့မဟုတ် — row level security enable လုပ်ထားတဲ့ tables တွေကို — system က queries တွေ ဘယ်လို execute လုပ်တယ်ဆိုတာကို သက်ရောက်မှု ရှိပါတယ်။ System က — query ကိုယ်၌ကနေ လာတဲ့ — non-leakproof functions တွေ ပါဝင်တဲ့ — user-supplied conditions တွေ မတိုင်ခင် — security policies နဲ့ security barrier views တွေဆီက conditions တွေကို — ဦးစားပေး အတင်းအကျပ် လုပ်ဆောင်ပြီး — data တွေ မရည်ရွယ်ဘဲ ပေါက်ကြားတာကို ကာကွယ်ပါတယ်။ Leakproof အဖြစ် အမှတ်အသား လုပ်ထားတဲ့ functions နဲ့ operators တွေကို — ယုံကြည်စိတ်ချရတယ်လို့ ယူဆပြီး — security policies နဲ့ security barrier views တွေဆီက conditions တွေရဲ့ ရှေ့မှာတောင် — execute လုပ်နိုင်ပါတယ်။ ဒါ့အပြင် — arguments တွေ မယူတဲ့ သို့မဟုတ် — security barrier view သို့မဟုတ် table ကနေ arguments တွေ ဘာမှ မလွှဲပြောင်းပေးတဲ့ functions တွေကတော့ — security conditions တွေရဲ့ ရှေ့မှာ execute လုပ်ဖို့ — leakproof အဖြစ် အမှတ်အသား လုပ်ထားစရာ မလိုပါဘူး။ `CREATE VIEW` နဲ့ အပိုင်း 39.5 ကို ကြည့်ပါ။ ဒီ option ကို superuser ကသာ သတ်မှတ်နိုင်ပါတယ်။
- **CALLED ON NULL INPUT** / **RETURNS NULL ON NULL INPUT** / **STRICT** — `CALLED ON NULL INPUT` (default ဖြစ်သည်) က — function ရဲ့ arguments တချို့ null ဖြစ်နေတဲ့အခါ — function ကို ပုံမှန်အတိုင်း ခေါ်ယူမယ်ဆိုတာ ညွှန်ပြပါတယ်။ ဒီအခါ — null values တွေအတွက် — လိုအပ်ရင် စစ်ဆေးပြီး — သင့်လျော်စွာ တုံ့ပြန်ဖို့က — function ရေးသားသူရဲ့ တာဝန် ဖြစ်ပါတယ်။
`RETURNS NULL ON NULL INPUT` သို့မဟုတ် `STRICT` က — function ရဲ့ arguments တစ်ခုခု null ဖြစ်တိုင်း — function က null ကိုပဲ အမြဲ ပြန်ပေးမယ်ဆိုတာ ညွှန်ပြပါတယ်။ ဒီ parameter ကို သတ်မှတ်ထားရင် — null arguments တွေ ရှိနေတဲ့အခါ — function ကို execute လုပ်မှာ မဟုတ်ဘဲ — null ရလဒ်တစ်ခုကို အလိုအလျောက် ယူဆလိုက်ပါတယ်။
- **[EXTERNAL] SECURITY INVOKER** / **[EXTERNAL] SECURITY DEFINER** — `SECURITY INVOKER` ဆိုတာက — function ကို ၎င်းကို ခေါ်ယူတဲ့ (call) user ရဲ့ privileges တွေနဲ့ execute လုပ်ရမယ်လို့ ညွှန်ပြတာပါ။ ဒါကတော့ default ဖြစ်ပါတယ်။ `SECURITY DEFINER` ကတော့ — function ကို ပိုင်ဆိုင်တဲ့ (own) user ရဲ့ privileges တွေနဲ့ execute လုပ်ရမယ်လို့ သတ်မှတ်ပါတယ်။ `SECURITY DEFINER` functions တွေကို လုံခြုံစွာ ဘယ်လို ရေးသားရမယ်ဆိုတဲ့ အချက်အလက်အတွက် — အောက်မှာ ကြည့်ပါ။
`EXTERNAL` ဆိုတဲ့ key word ကို — SQL conformance (SQL စံနှုန်းနဲ့ ကိုက်ညီမှု) အတွက် ခွင့်ပြုထားပေမယ့် — SQL မှာလို မဟုတ်ဘဲ — ဒီ feature က external functions တွေတင်မက functions အားလုံးနဲ့ သက်ဆိုင်တာကြောင့် — ၎င်းက optional ဖြစ်ပါတယ်။
- **PARALLEL** — `PARALLEL UNSAFE` က — function ကို parallel mode မှာ execute လုပ်လို့ မရဘူးဆိုတာ ညွှန်ပြပါတယ်; SQL statement တစ်ခုထဲမှာ ဒီလို function တစ်ခု ရှိနေရင် — serial execution plan တစ်ခုကို အတင်းအကျပ် ဖြစ်စေပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။ `PARALLEL RESTRICTED` က — function ကို parallel mode မှာ execute လုပ်လို့ ရပေမယ့် — parallel group leader process ထဲမှာသာ ရတယ်ဆိုတာ ညွှန်ပြပါတယ်။ `PARALLEL SAFE` ကတော့ — function က — parallel worker processes တွေ အပါအဝင် — ကန့်သတ်ချက် မရှိဘဲ parallel mode မှာ run ဖို့ လုံခြုံတယ်ဆိုတာ ညွှန်ပြပါတယ်။
Functions တွေကို — သူတို့က database state တစ်ခုခုကို ပြုပြင်မွမ်းမံတာ၊ transaction state ကို ပြောင်းလဲတာ (error recovery အတွက် subtransaction သုံးတာ ကလွဲပြီး)၊ sequences တွေကို ဝင်ရောက်တာ (ဥပမာ — currval ကို ခေါ်ခြင်း) သို့မဟုတ် — settings တွေကို persistent (မပြောင်းလဲနိုင်သော) ပြောင်းလဲမှုတွေ လုပ်တာမျိုး ဖြစ်မယ်ဆိုရင် — parallel unsafe လို့ အမှတ်အသား လုပ်သင့်ပါတယ်။ သူတို့က temporary tables, client connection state, cursors, prepared statements သို့မဟုတ် — system က parallel mode မှာ synchronize (တစ်ပြိုင်တည်း ညှိနှိုင်း) လုပ်လို့ မရတဲ့ — တခြား backend-local state တွေကို ဝင်ရောက်မယ်ဆိုရင်တော့ — parallel restricted လို့ အမှတ်အသား လုပ်သင့်ပါတယ် (ဥပမာ — setseed ကို — တခြား process တစ်ခုက ပြောင်းလဲလိုက်တာက leader ထဲမှာ ထင်ဟပ်မှာ မဟုတ်တာကြောင့် — group leader ကသာ execute လုပ်နိုင်ပါတယ်)။ ယေဘုယျအားဖြင့် — function တစ်ခုက restricted သို့မဟုတ် unsafe ဖြစ်နေတဲ့အခါ safe လို့ အမှတ်အသား လုပ်ထားရင် သို့မဟုတ် — တကယ်က unsafe ဖြစ်နေတဲ့အခါ restricted လို့ အမှတ်အသား လုပ်ထားရင် — parallel query တစ်ခုမှာ သုံးတဲ့အခါ — errors တွေ ပစ်ချတာ သို့မဟုတ် — မမှန်ကန်တဲ့ အဖြေတွေ ထုတ်ပေးတာ ဖြစ်နိုင်ပါတယ်။ C-language functions တွေကတော့ — system က arbitrary C code တွေကို သူ့ဘာသာ ကာကွယ်ဖို့ နည်းလမ်း မရှိတာကြောင့် — မှားယွင်းစွာ အမှတ်အသား လုပ်ထားရင် — သီအိုရီအရတော့ လုံးဝ undefined အပြုအမူတွေ ပြသနိုင်ပေမယ့် — ဖြစ်နိုင်ခြေ အများဆုံး ကိစ္စတွေမှာတော့ — ရလဒ်က တခြား function တစ်ခုခုထက် ပိုဆိုးမှာ မဟုတ်ပါဘူး။ မသေချာရင် — functions တွေကို `UNSAFE` လို့ အမှတ်အသား လုပ်သင့်ပါတယ် — ဒါကလည်း default ဖြစ်ပါတယ်။
- **COST execution_cost** — Function အတွက် ခန့်မှန်း execution cost ကို — cpu_operator_cost ရဲ့ unit တွေနဲ့ — ပေးတဲ့ positive (အပေါင်းကိန်း) တစ်ခု။ Function က set တစ်ခု ပြန်ပေးရင် — ဒါက ပြန်ပေးတဲ့ row တစ်ခုချင်းစီအတွက် cost ဖြစ်ပါတယ်။ Cost ကို သတ်မှတ်မထားရင် — C-language နဲ့ internal functions တွေအတွက် unit 1 ခု ယူဆပြီး — တခြား language တွေ အားလုံးက functions တွေအတွက် unit 100 ခု ယူဆပါတယ်။ တန်ဖိုး ပိုကြီးလေ — planner က function ကို လိုအပ်တာထက် ပိုပြီး မကြာခဏ evaluate လုပ်တာကို ရှောင်ရှားဖို့ ကြိုးစားလေလေ ဖြစ်ပါတယ်။
- **ROWS result_rows** — Planner က function က ပြန်ပေးလိမ့်မယ်လို့ မျှော်လင့်သင့်တဲ့ rows အရေအတွက် ခန့်မှန်းချက်ကို ပေးတဲ့ positive ကိန်း တစ်ခု။ Function က set တစ်ခု ပြန်ပေးမယ်လို့ ကြေညာထားမှသာ ဒါကို ခွင့်ပြုပါတယ်။ Default ယူဆချက်ကတော့ rows 1000 ဖြစ်ပါတယ်။
- **SUPPORT support_function** — ဒီ function အတွက် သုံးရမယ့် planner support function တစ်ခုရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။ အသေးစိတ်အတွက် အပိုင်း 36.11 ကို ကြည့်ပါ။ ဒီ option ကို သုံးဖို့ superuser ဖြစ်ရပါမယ်။
- **configuration_parameter** / **value** — `SET` clause က — function ထဲကို ဝင်ရောက်တဲ့အခါ — သတ်မှတ်ထားတဲ့ configuration parameter ကို သတ်မှတ်ထားတဲ့ တန်ဖိုးအဖြစ် set လုပ်ပြီး — function ကနေ ထွက်သွားတဲ့အခါ — အရင် တန်ဖိုးဆီ ပြန်လည် သတ်မှတ်ပေးပါတယ်။ `SET FROM CURRENT` ကတော့ — `CREATE FUNCTION` ကို execute လုပ်နေချိန်မှာ လက်ရှိ ရှိနေတဲ့ parameter ရဲ့ တန်ဖိုးကို — function ထဲကို ဝင်ရောက်တဲ့အခါ သုံးစွဲရမယ့် တန်ဖိုးအဖြစ် သိမ်းဆည်းပေးပါတယ်။
Function တစ်ခုမှာ `SET` clause ချိတ်တွဲထားရင် — function ထဲမှာ အဲဒီ variable အတွက်ပဲ execute လုပ်တဲ့ `SET LOCAL` command ရဲ့ သက်ရောက်မှုတွေက function ထဲမှာပဲ ကန့်သတ်ခံရပါတယ်: configuration parameter ရဲ့ အရင် တန်ဖိုးကို — function ထွက်ချိန်မှာ — ပြန်လည် သတ်မှတ်ပေးဆဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — သာမန် (LOCAL မပါတဲ့) `SET` command တစ်ခုကတော့ — အရင် `SET LOCAL` command တစ်ခုကို ကျော်လွန်ပြီး လုပ်သလိုမျိုး — `SET` clause ကို override (ကျော်လွန်) လုပ်ပါတယ်: ဒီလို command တစ်ခုရဲ့ သက်ရောက်မှုတွေက — current transaction ကို roll back လုပ်လိုက်တာ မဟုတ်ရင် — function ထွက်ပြီးတဲ့ နောက်မှာပါ ဆက်လက် တည်ရှိနေပါလိမ့်မယ်။
ခွင့်ပြုထားတဲ့ parameter names နဲ့ values တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် `SET` နဲ့ အခန်း 19 ကို ကြည့်ပါ။
- **definition** — Function ကို define လုပ်ပေးတဲ့ string constant တစ်ခု; ၎င်းရဲ့ အဓိပ္ပာယ်က language အပေါ် မူတည်ပါတယ်။ ၎င်းက internal function name တစ်ခု၊ object file တစ်ခုရဲ့ path၊ SQL command တစ်ခု သို့မဟုတ် procedural language တစ်ခုထဲက text တစ်ခု ဖြစ်နိုင်ပါတယ်။
Function definition string ကို ရေးဖို့ — သာမန် single quote syntax အစား — dollar quoting (အပိုင်း 4.1.2.4 ကို ကြည့်ပါ) ကို သုံးတာက မကြာခဏ အထောက်အကူ ဖြစ်ပါတယ်။ Dollar quoting မသုံးဘူးဆိုရင် — function definition ထဲက single quotes သို့မဟုတ် backslashes တွေ အားလုံးကို — နှစ်ဆ ထပ်ရေးပြီး escape လုပ်ရပါမယ်။
- **obj_file, link_symbol** — ဒီ `AS` clause ပုံစံကို — C language source code ထဲက function နာမည်က SQL function ရဲ့ နာမည်နဲ့ မတူညီတဲ့အခါ — dynamically loadable (အချိန်မရွေး ဖွင့်တင်နိုင်သော) C language functions တွေအတွက် သုံးပါတယ်။ obj_file ဆိုတဲ့ string က — compiled C function ပါဝင်တဲ့ shared library file ရဲ့ နာမည် ဖြစ်ပြီး — `LOAD` command အတွက်လိုပဲ အဓိပ္ပာယ် ကောက်ယူပါတယ်။ link_symbol ဆိုတဲ့ string က function ရဲ့ link symbol — တနည်းအားဖြင့် — C language source code ထဲက function ရဲ့ နာမည် — ဖြစ်ပါတယ်။ Link symbol ကို ချန်လိုက်ခဲ့ရင် — သတ်မှတ်နေတဲ့ SQL function ရဲ့ နာမည်နဲ့ပဲ တူညီတယ်လို့ ယူဆပါတယ်။ Functions တွေ အားလုံးရဲ့ C names တွေက မတူညီဘဲ ဖြစ်ရမှာ မို့လို့ — overloaded C functions တွေကို — မတူညီတဲ့ C names တွေ ပေးရပါမယ် (ဥပမာ — argument types တွေကို C names တွေရဲ့ အစိတ်အပိုင်းအဖြစ် သုံးပါ)။
`CREATE FUNCTION` calls တွေ ထပ်ခါထပ်ခါ လုပ်တာက object file တစ်ခုတည်းကိုပဲ ရည်ညွှန်းနေတဲ့အခါ — အဲဒီ file ကို session တစ်ခုမှာ တစ်ကြိမ်ပဲ load လုပ်ပါတယ်။ File ကို unload ပြီး ပြန် load လုပ်ဖို့ (development လုပ်နေစဉ်မှာ ဖြစ်နိုင်တယ်) — session အသစ်တစ်ခု စတင်ပါ။
- **sql_body** — `LANGUAGE SQL` function တစ်ခုရဲ့ body။ ဒါက statement တစ်ခုတည်း —

    RETURN expression

— သို့မဟုတ် — block တစ်ခု —

    BEGIN ATOMIC
      statement;
      statement;
      ...
      statement;
    END

ဒါက — function body ရဲ့ text ကို string constant တစ်ခုအနေနဲ့ ရေးတာ (အပေါ်က definition ကို ကြည့်ပါ) နဲ့ ဆင်တူပေမယ့် — ကွဲပြားချက်တချို့ ရှိပါတယ်: ဒီပုံစံက `LANGUAGE SQL` အတွက်ပဲ အလုပ်လုပ်ပါတယ် — string constant ပုံစံကတော့ languages အားလုံးအတွက် အလုပ်လုပ်ပါတယ်။ ဒီပုံစံကို function definition အချိန်မှာ parse လုပ်ပါတယ် — string constant ပုံစံကိုတော့ execution အချိန်မှာ parse လုပ်ပါတယ်; ဒါကြောင့် — ဒီပုံစံက polymorphic argument types တွေနဲ့ — function definition အချိန်မှာ ဖြေရှင်းလို့ မရတဲ့ — တခြား constructs တွေကို ထောက်ပံ့ပေးနိုင်မှာ မဟုတ်ပါဘူး။ ဒီပုံစံက function နဲ့ function body ထဲမှာ သုံးထားတဲ့ objects တွေကြားက dependencies တွေကို ခြေရာခံပါတယ် — ဒါကြောင့် — `DROP ... CASCADE` က မှန်ကန်စွာ အလုပ်လုပ်ပါလိမ့်မယ် — string literals တွေ သုံးတဲ့ ပုံစံကတော့ dangling (ချိတ်ဆွဲထားရုံသက်သက် ဖြစ်နေတဲ့) functions တွေကို ကျန်ရစ်စေနိုင်ပါတယ်။ နောက်ဆုံးအနေနဲ့ — ဒီပုံစံက SQL standard နဲ့ တခြား SQL implementations တွေနဲ့ ပိုပြီး လိုက်ဖက်ညီပါတယ်။

## Overloading (function overload လုပ်ခြင်း)

PostgreSQL က function *overloading* ကို ခွင့်ပြုပါတယ်; ဆိုလိုတာက — function တွေမှာ input argument types မတူညီသရွေ့ — နာမည်တစ်ခုတည်းကို function အများအပြားအတွက် သုံးနိုင်ပါတယ်။ သုံးသည်ဖြစ်စေ မသုံးသည်ဖြစ်စေ — ဒီ စွမ်းရည်က — users တချို့က တခြား users တွေကို မယုံကြည်ကြတဲ့ (mistrust) databases တွေမှာ — functions တွေကို ခေါ်ယူတဲ့အခါ — security ဆိုင်ရာ ကြိုတင် သတိပြုမှုတွေ လိုအပ်ပါတယ်; [အပိုင်း 10.3](/docs/postgresql/typeconv-func) ကို ကြည့်ပါ။

Function နှစ်ခုက — `OUT` parameters တွေကို လျစ်လျူရှုပြီး — နာမည်တူညီပြီး input argument types တူညီနေရင် — တစ်ခုနဲ့တစ်ခု အတူတူပဲလို့ ယူဆပါတယ်။ ဒါကြောင့် ဥပမာ — ဒီ declarations တွေက conflict ဖြစ်နေပါတယ်:

```sql
CREATE FUNCTION foo(int) ...
CREATE FUNCTION foo(int, out text) ...
```

Argument type lists မတူညီတဲ့ functions တွေကတော့ — ဖန်တီးချိန်မှာ conflict ဖြစ်တယ်လို့ ယူဆမှာ မဟုတ်ပါဘူး — ဒါပေမယ့် — defaults တွေ ပေးထားရင်တော့ — အသုံးပြုရာမှာ conflict ဖြစ်နိုင်ပါတယ်။ ဥပမာ သုံးသပ်ကြည့်ပါ —

```sql
CREATE FUNCTION foo(int) ...
CREATE FUNCTION foo(int, int default 42) ...
```

`foo(10)` ဆိုတဲ့ call တစ်ခုကတော့ — ဘယ် function ကို ခေါ်သင့်လဲဆိုတဲ့ မရှင်းလင်းမှု (ambiguity) ကြောင့် — မအောင်မြင်ပါဘူး။

## Notes (မှတ်စုများ)

Function တစ်ခုရဲ့ arguments တွေနဲ့ return value ကို ကြေညာဖို့ — SQL type syntax အပြည့်အစုံကို ခွင့်ပြုပါတယ်။ ဒါပေမယ့် — parentheses နဲ့ ကာရံထားတဲ့ type modifiers တွေ (ဥပမာ — type `numeric` ရဲ့ precision field) ကို `CREATE FUNCTION` က ပယ်ဖျက်လိုက်ပါတယ်။ ဒါကြောင့် ဥပမာ — `CREATE FUNCTION foo (varchar(10)) ...` ဆိုတာက `CREATE FUNCTION foo (varchar) ...` နဲ့ လုံးဝ အတူတူပဲ ဖြစ်ပါတယ်။

ရှိပြီးသား function တစ်ခုကို `CREATE OR REPLACE FUNCTION` နဲ့ အစားထိုးတဲ့အခါ — parameter names တွေ ပြောင်းလဲခြင်းအပေါ် ကန့်သတ်ချက်တွေ ရှိပါတယ်။ ဘယ် input parameter ကိုမဆို — အရင်က သတ်မှတ်ပြီးသား နာမည်ကို ပြောင်းလဲလို့ မရပါဘူး (နာမည် မရှိခဲ့တဲ့ parameters တွေကိုတော့ နာမည်တွေ ထပ်ဖြည့်ပေးနိုင်ပါတယ်)။ Output parameters တစ်ခုထက်ပို ရှိနေရင် — output parameters တွေရဲ့ နာမည်တွေကို ပြောင်းလဲလို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ — အဲဒါက — function ရဲ့ ရလဒ်ကို ဖော်ပြတဲ့ — anonymous composite type ရဲ့ column names တွေကို ပြောင်းလဲပစ်လိုက်တာနဲ့ တူနေလို့ပါ။ ဒီ ကန့်သတ်ချက်တွေကို — function ကို အစားထိုးလိုက်တဲ့အခါ — function ရဲ့ ရှိပြီးသား calls တွေ အလုပ်မလုပ်တော့တာမျိုး မဖြစ်အောင် သေချာစေဖို့ ပြုလုပ်ထားတာ ဖြစ်ပါတယ်။

Function တစ်ခုကို `VARIADIC` argument တစ်ခုနဲ့ `STRICT` လို့ ကြေညာထားရင် — strictness check က — variadic array တစ်ခုလုံး အနေနဲ့ non-null ဟုတ်မဟုတ်ကိုသာ စစ်ဆေးပါတယ်။ Array ထဲမှာ null elements တွေ ရှိနေရင်တောင် — function ကို ခေါ်ယူဆဲ ဖြစ်ပါလိမ့်မယ်။

## Examples (ဥပမာများ)

Integer နှစ်ခုကို SQL function တစ်ခုနဲ့ ပေါင်းရန်:

```sql
CREATE FUNCTION add(integer, integer) RETURNS integer
    AS 'select $1 + $2;'
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT;
```

အဲဒီ function ကိုပဲ — argument names တွေနဲ့ quote မလုပ်ထားတဲ့ body တစ်ခုကို သုံးပြီး — SQL standard နဲ့ ပိုလိုက်ဖက်ညီတဲ့ ပုံစံနဲ့ ရေးထားတာ:

```sql
CREATE FUNCTION add(a integer, b integer) RETURNS integer
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT
    RETURN a + b;
```

Integer တစ်ခုကို — argument name တစ်ခုကို အသုံးပြုပြီး — PL/pgSQL နဲ့ တိုးမြှင့်ရန်:

```
CREATE OR REPLACE FUNCTION increment(i integer) RETURNS integer AS $$
        BEGIN
                RETURN i + 1;
        END;
$$ LANGUAGE plpgsql;
```

Output parameters အများအပြား ပါဝင်တဲ့ record တစ်ခုကို ပြန်ရန်:

```sql
CREATE FUNCTION dup(in int, out f1 int, out f2 text)
    AS $$ SELECT $1, CAST($1 AS text) || ' is text' $$
    LANGUAGE SQL;

SELECT * FROM dup(42);
```

အဲဒီအတိုင်းပဲ — နာမည်အတိအကျ ပေးထားတဲ့ composite type တစ်ခုနဲ့ — ပိုပြီး စကားပြောစရာ (verbose) ပုံစံနဲ့ လုပ်နိုင်ပါတယ်:

```sql
CREATE TYPE dup_result AS (f1 int, f2 text);

CREATE FUNCTION dup(int) RETURNS dup_result
    AS $$ SELECT $1, CAST($1 AS text) || ' is text' $$
    LANGUAGE SQL;

SELECT * FROM dup(42);
```

Column အများအပြား ပြန်ဖို့ နောက်ထပ် နည်းလမ်းတစ်ခုကတော့ `TABLE` function တစ်ခုကို သုံးတာ ဖြစ်ပါတယ်:

```sql
CREATE FUNCTION dup(int) RETURNS TABLE(f1 int, f2 text)
    AS $$ SELECT $1, CAST($1 AS text) || ' is text' $$
    LANGUAGE SQL;

SELECT * FROM dup(42);
```

ဒါပေမယ့် — `TABLE` function တစ်ခုက အရှေ့က ဥပမာတွေနဲ့ ကွဲပြားပါတယ် — ဘာလို့လဲဆိုတော့ ၎င်းက record တစ်ခုတည်း မဟုတ်ဘဲ — records အစုတစ်ခု (set) ကို တကယ် ပြန်ပေးလို့ပါ။

## Writing `SECURITY DEFINER` Functions Safely (`SECURITY DEFINER` functions များကို လုံခြုံစွာ ရေးသားခြင်း)

`SECURITY DEFINER` function တစ်ခုကို — ၎င်းကို ပိုင်ဆိုင်ထားတဲ့ user ရဲ့ privileges တွေနဲ့ execute လုပ်တာကြောင့် — function ကို အလွဲသုံးစား လုပ်လို့ မရအောင် သေချာ ဂရုစိုက်ဖို့ လိုအပ်ပါတယ်။ လုံခြုံရေးအတွက် — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို — မယုံကြည်ရတဲ့ (untrusted) users တွေ ရေးလို့ရတဲ့ (writable) schemas တွေ အားလုံး ချန်လှပ်ထားမယ့် ပုံစံမျိုး — set လုပ်ထားသင့်ပါတယ်။ ဒါက — function က သုံးဖို့ ရည်ရွယ်ထားတဲ့ objects တွေကို ဖုံးကွယ်ထားမယ့် objects တွေ (ဥပမာ — tables, functions နဲ့ operators) ကို — မကောင်းရည်ရွယ်တဲ့ users တွေ ဖန်တီးခြင်းကနေ ကာကွယ်ပေးပါတယ်။ ဒီကိစ္စမှာ အထူး အရေးကြီးတာကတော့ — temporary-table schema ဖြစ်ပါတယ် — ၎င်းကို default အနေနဲ့ အရင်ဆုံး ရှာဖွေပြီး — သာမန်အားဖြင့် လူတိုင်း ရေးလို့ရတဲ့ (writable) နေရာ ဖြစ်လို့ပါ။ Temporary schema ကို နောက်ဆုံးမှသာ ရှာဖွေမယ့် အနေအထား ဖြစ်အောင် အတင်းအကျပ် လုပ်ခြင်းအားဖြင့် — လုံခြုံတဲ့ အစီအစဉ် (arrangement) တစ်ခုကို ရရှိနိုင်ပါတယ်။ အဲဒါလုပ်ဖို့ — `pg_temp` ကို `search_path` ရဲ့ နောက်ဆုံး entry အနေနဲ့ ရေးပါ။ ဒီ function က လုံခြုံတဲ့ အသုံးပြုမှုကို သရုပ်ဖော်ပါတယ်:

```
CREATE FUNCTION check_password(uname TEXT, pass TEXT)
RETURNS BOOLEAN AS $$
DECLARE passed BOOLEAN;
BEGIN
        SELECT  (pwd = $2) INTO passed
        FROM    pwds
        WHERE   username = $1;

        RETURN passed;
END;
$$  LANGUAGE plpgsql
    SECURITY DEFINER
    -- Set a secure search_path: trusted schema(s), then 'pg_temp'.
    SET search_path = admin, pg_temp;
```

ဒီ function ရဲ့ ရည်ရွယ်ချက်က `admin.pwds` table ကို ဝင်ရောက်ဖို့ ဖြစ်ပါတယ်။ ဒါပေမယ့် — `SET` clause မပါဘဲနဲ့ သို့မဟုတ် — `admin` တစ်ခုတည်းကိုပဲ ဖော်ပြတဲ့ `SET` clause တစ်ခုနဲ့ဆိုရင် — `pwds` လို့ နာမည်ပေးထားတဲ့ temporary table တစ်ခုကို ဖန်တီးခြင်းအားဖြင့် — function ကို ဖျက်ဆီး (subvert) လုပ်နိုင်ပါလိမ့်မယ်။

Security definer function က roles တွေ ဖန်တီးဖို့ ရည်ရွယ်ပြီး — non-superuser အနေနဲ့ run နေတယ်ဆိုရင် — `createrole_self_grant` ကိုလည်း — `SET` clause ကို သုံးပြီး — သိထားတဲ့ (known) တန်ဖိုးတစ်ခုဆီ set လုပ်ထားသင့်ပါတယ်။

နောက်ထပ် သတိထားရမယ့် အချက်တစ်ခုကတော့ — default အနေနဲ့ — အသစ် ဖန်တီးလိုက်တဲ့ functions တွေအတွက် — execute privilege ကို `PUBLIC` ဆီ grant လုပ်ထားပါတယ် (နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 5.8](/docs/postgresql/ddl-priv) ကို ကြည့်ပါ)။ Security definer function တစ်ခုရဲ့ အသုံးပြုမှုကို — users တချို့အတွက်သာ ကန့်သတ်ချင်လေ့ ရှိပါတယ်။ အဲဒါလုပ်ဖို့ — default `PUBLIC` privileges တွေကို revoke လုပ်ပြီး — execute privilege ကို ရွေးချယ်ပြီး grant လုပ်ရပါမယ်။ Function အသစ်က လူတိုင်း ဝင်ရောက်နိုင်မယ့် ကာလတစ်ခု (window) ရှိမသွားအောင် — function ကို ဖန်တီးပြီး — privileges တွေကို transaction တစ်ခုတည်း အတွင်းမှာ သတ်မှတ်ပါ။ ဥပမာ:

```sql
BEGIN;
CREATE FUNCTION check_password(uname TEXT, pass TEXT) ... SECURITY DEFINER;
REVOKE ALL ON FUNCTION check_password(uname TEXT, pass TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION check_password(uname TEXT, pass TEXT) TO admins;
COMMIT;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE FUNCTION` command ကို SQL standard မှာ သတ်မှတ်ထားပါတယ်။ PostgreSQL ရဲ့ implementation ကိုတော့ — compatible ဖြစ်တဲ့ နည်းလမ်းနဲ့ သုံးလို့ ရနိုင်ပေမယ့် — extensions တွေ အများအပြား ပါဝင်ပါတယ်။ အပြန်အလှန်အားဖြင့် — SQL standard က — PostgreSQL မှာ implement မလုပ်ထားတဲ့ optional features တချို့ကိုလည်း သတ်မှတ်ထားပါတယ်။

အောက်ပါတို့က အရေးကြီးတဲ့ compatibility ကိစ္စရပ်တွေ ဖြစ်ပါတယ်:

- `OR REPLACE` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။
- တခြား database systems တချို့နဲ့ လိုက်ဖက်ညီမှုအတွက် — argmode ကို argname ရဲ့ ရှေ့မှာ ဒါမှမဟုတ် နောက်မှာ — ရေးလို့ ရပါတယ်။ ဒါပေမယ့် — ပထမ နည်းလမ်းကသာ standard-compliant (စံနှုန်းနဲ့ ကိုက်ညီသော) ဖြစ်ပါတယ်။
- Parameter defaults တွေအတွက် — SQL standard က `DEFAULT` key word ပါတဲ့ syntax ကိုပဲ သတ်မှတ်ပါတယ်။ `=` ပါတဲ့ syntax ကိုတော့ T-SQL နဲ့ Firebird တွေမှာ သုံးပါတယ်။
- `SETOF` modifier က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။
- Language တစ်ခုအနေနဲ့ SQL ကိုပဲ standard လုပ်ထားပါတယ်။
- `CALLED ON NULL INPUT` နဲ့ `RETURNS NULL ON NULL INPUT` ကလွဲပြီး — တခြား attributes တွေ အားလုံးက standard လုပ်ထားခြင်း မရှိပါဘူး။
- `LANGUAGE SQL` functions တွေရဲ့ body အတွက် — SQL standard က sql_body ပုံစံကိုပဲ သတ်မှတ်ပါတယ်။

ရိုးရှင်းတဲ့ `LANGUAGE SQL` functions တွေကို — standard-conforming ဖြစ်ပြီး — တခြား implementations တွေဆီလည်း သယ်ဆောင်သုံးလို့ရတဲ့ (portable) ပုံစံမျိုးနဲ့ ရေးလို့ ရပါတယ်။ Advanced features, optimization attributes သို့မဟုတ် တခြား languages တွေကို သုံးထားတဲ့ ပိုရှုပ်ထွေးတဲ့ functions တွေကတော့ — သိသာတဲ့ အတိုင်းအတာအထိ — PostgreSQL အတွက်ပဲ သီးသန့် ဖြစ်နေမှာ သေချာပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER FUNCTION](/docs/postgresql/sql-alterfunction), [DROP FUNCTION](/docs/postgresql/sql-dropfunction), [GRANT](/docs/postgresql/sql-grant), [LOAD](/docs/postgresql/sql-load), [REVOKE](/docs/postgresql/sql-revoke)
