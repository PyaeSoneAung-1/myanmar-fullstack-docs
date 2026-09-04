---
title: "CREATE PROCEDURE (procedure အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Procedure အသစ်တစ်ခုကို သတ်မှတ်ခြင်း သို့မဟုတ် ရှိပြီးသား definition ကို CREATE OR REPLACE ဖြင့် အစားထိုးခြင်း — argument modes (IN/OUT/INOUT/VARIADIC), argument types (%TYPE ရည်ညွှန်းမှု အပါအဝင်), default_expr, lang_name, TRANSFORM, SECURITY INVOKER/DEFINER, SET clause, AS definition နှင့် sql_body (BEGIN ATOMIC block) စသည့် parameters များအကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 222
source: "https://www.postgresql.org/docs/current/sql-createprocedure.html"
status: translated
updated: 2026-09-04
---

## CREATE PROCEDURE (procedure အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE PROCEDURE — procedure အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] PROCEDURE
    name ( [ [ argmode ] [ argname ] argtype [ { DEFAULT | = } default_expr ] [, ...] ] )
  { LANGUAGE lang_name
    | TRANSFORM { FOR TYPE type_name } [, ... ]
    | [ EXTERNAL ] SECURITY INVOKER | [ EXTERNAL ] SECURITY DEFINER
    | SET configuration_parameter { TO value | = value | FROM CURRENT }
    | AS 'definition'
    | AS 'obj_file', 'link_symbol'
    | sql_body
  } ...
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE PROCEDURE` က procedure အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်။ `CREATE OR REPLACE PROCEDURE` ကတော့ procedure အသစ်တစ်ခုကို ဖန်တီးပေးတာ ဒါမှမဟုတ် ရှိပြီးသား definition တစ်ခုကို replace (အစားထိုး) လုပ်ပေးပါလိမ့်မယ်။ Procedure တစ်ခုကို define လုပ်နိုင်ဖို့ — user က language အပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

Schema name တစ်ခု ပါဝင်နေရင် — procedure ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပါဝင်ဘူးဆိုရင်တော့ — current schema ထဲမှာ ဖန်တီးပါတယ်။ Procedure အသစ်ရဲ့ နာမည်က — တူညီတဲ့ schema ထဲမှာ — input argument types တူညီတဲ့ — ရှိပြီးသား procedure သို့မဟုတ် function တစ်ခုခုရဲ့ နာမည်နဲ့ မတိုက်မိရပါဘူး။ ဒါပေမယ့် — argument types မတူညီတဲ့ procedures နဲ့ functions တွေကတော့ နာမည်တစ်ခုတည်းကို မျှဝေသုံးနိုင်ပါတယ် (ဒါကို *overloading* (နာမည်တူ ထပ်ဆင့် သတ်မှတ်ခြင်း) လို့ ခေါ်ပါတယ်)။

ရှိပြီးသား procedure တစ်ခုရဲ့ လက်ရှိ definition ကို replace လုပ်ဖို့ဆိုရင် `CREATE OR REPLACE PROCEDURE` ကို သုံးပါ။ ဒီနည်းနဲ့ procedure တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် argument types တွေကို ပြောင်းလဲလို့ မရပါဘူး (ပြောင်းလဲဖို့ ကြိုးစားမိရင် — တကယ်တော့ သီးခြား procedure အသစ်တစ်ခုကို ဖန်တီးနေတာ ဖြစ်ပါတယ်)။

`CREATE OR REPLACE PROCEDURE` ကို ရှိပြီးသား procedure တစ်ခုကို replace လုပ်ဖို့ သုံးတဲ့အခါ — procedure ရဲ့ ownership (ပိုင်ဆိုင်မှု) နဲ့ permissions တွေကတော့ ပြောင်းလဲခြင်း မရှိပါဘူး။ တခြား procedure properties တွေ အားလုံးကိုတော့ — command ထဲမှာ သတ်မှတ်ထားတဲ့ သို့မဟုတ် သွယ်ဝိုက် ညွှန်ပြထားတဲ့ (implied) တန်ဖိုးတွေနဲ့ သတ်မှတ်ပေးပါတယ်။ Procedure တစ်ခုကို replace လုပ်ဖို့ — အဲဒီ procedure ကို ကိုယ်တိုင် ပိုင်ဆိုင်ထားရပါမယ် (ပိုင်ဆိုင်တဲ့ role ရဲ့ member (အဖွဲ့ဝင်) ဖြစ်နေတာ အပါအဝင်)။

Procedure ကို ဖန်တီးတဲ့ user ကပဲ — procedure ရဲ့ owner ဖြစ်လာပါတယ်။

Procedure တစ်ခု ဖန်တီးနိုင်ဖို့ — argument types တွေအပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

Procedures တွေ ရေးသားခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 36.4](https://www.postgresql.org/docs/current/xproc.html) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် procedure ရဲ့ နာမည် (option အရ schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **argmode** — Argument တစ်ခုရဲ့ mode: IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ခဲ့ရင် — default ကတော့ IN ဖြစ်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။
- **argtype** — Procedure ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်ထားနိုင်သည်) — ရှိရင် ဖြစ်ပါတယ်။ Argument types တွေက base, composite သို့မဟုတ် domain types တွေ ဖြစ်နိုင်သလို — table column တစ်ခုရဲ့ type ကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။
Implement လုပ်တဲ့ language ပေါ် မူတည်ပြီး — cstring လို “pseudo-types” (အစစ်အမှန် type မဟုတ်သော type များ) တွေကို သတ်မှတ်ခွင့်လည်း ရှိနိုင်ပါတယ်။ Pseudo-types ဆိုတာ — တကယ့် argument type ကို မပြည့်စုံဘဲ သတ်မှတ်ထားတာ ဒါမှမဟုတ် သာမန် SQL data types တွေရဲ့ အစုအဝေးရဲ့ အပြင်ဘက်မှာ ရှိနေတာမျိုးကို ညွှန်ပြတာပါ။
Column တစ်ခုရဲ့ type ကို — `table_name.column_name%TYPE` လို့ ရေးခြင်းအားဖြင့် ရည်ညွှန်းပါတယ်။ ဒီ feature ကို သုံးတာက — table တစ်ခုရဲ့ definition ထဲက ပြောင်းလဲမှုတွေနဲ့ မသက်ဆိုင်ဘဲ procedure တစ်ခု ဖြစ်နေအောင် တခါတရံမှာ အထောက်အကူ ပြုနိုင်ပါတယ်။
- **default_expr** — Parameter ကို သတ်မှတ်မထားဘူးဆိုရင် — default value အဖြစ် သုံးရမယ့် expression တစ်ခု။ Expression က — parameter ရဲ့ argument type အဖြစ် coercion (type ပြောင်းလဲခြင်း) လုပ်လို့ ရနိုင်ရပါမယ်။ Default value ရှိတဲ့ parameter တစ်ခုနောက်က input parameters တွေ အားလုံးမှာလည်း default values တွေ ရှိရပါမယ်။
- **lang_name** — Procedure ကို implement လုပ်ထားတဲ့ language ရဲ့ နာမည်။ ၎င်းက sql, c, internal သို့မဟုတ် user-defined procedural language တစ်ခုရဲ့ နာမည် — ဥပမာ plpgsql — ဖြစ်နိုင်ပါတယ်။ sql_body ကို သတ်မှတ်ထားရင် default ကတော့ sql ဖြစ်ပါတယ်။ နာမည်ကို single quotes တွေနဲ့ ကာရံပြီး ရေးတာကတော့ deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) ဖြစ်ပြီး — case (စာလုံး အကြီး/အသေး) တိတိကျကျ ကိုက်ညီမှု လိုအပ်ပါတယ်။
- **TRANSFORM { FOR TYPE type_name } [, ... ]** — Procedure တစ်ခုဆီ ခေါ်ယူတဲ့အခါ ဘယ် transforms တွေကို အသုံးပြုသင့်လဲဆိုတာကို စာရင်းပြုပါတယ်။ Transforms တွေက SQL types နဲ့ language-specific data types တွေကြားမှာ ပြောင်းလဲပေးပါတယ်; CREATE TRANSFORM ကို ကြည့်ပါ။ Procedural language implementations တွေမှာ ပုံမှန်အားဖြင့် built-in types တွေအကြောင်း hardcoded (ကုတ်ထဲ အတိအကျ ထည့်သွင်းထားသော) သိရှိမှု ရှိတာကြောင့် — အဲဒါတွေကို ဒီမှာ စာရင်းပြုစရာ မလိုပါဘူး။ Procedural language implementation တစ်ခုက type တစ်ခုကို ဘယ်လို ကိုင်တွယ်ရမယ်ဆိုတာ မသိဘဲ — transform တစ်ခုမှ မပေးထားဘူးဆိုရင် — data types တွေ ပြောင်းလဲခြင်းအတွက် default အပြုအမူတစ်ခုဆီ ပြန်ကျသွားပါတယ် — ဒါပေမယ့် — ဒါက implementation အပေါ် မူတည်ပါတယ်။
- **[ EXTERNAL ] SECURITY INVOKER** / **[ EXTERNAL ] SECURITY DEFINER** — SECURITY INVOKER ဆိုတာ — procedure ကို ခေါ်ယူတဲ့ (call) user ရဲ့ privileges တွေနဲ့ execute လုပ်ရမယ်လို့ ညွှန်ပြတာပါ။ ဒါကတော့ default ဖြစ်ပါတယ်။ SECURITY DEFINER ကတော့ — procedure ကို ပိုင်ဆိုင်တဲ့ (own) user ရဲ့ privileges တွေနဲ့ execute လုပ်ရမယ်လို့ သတ်မှတ်ပါတယ်။
EXTERNAL ဆိုတဲ့ key word ကို — SQL conformance (SQL စံနှုန်းနဲ့ ကိုက်ညီမှု) အတွက် ခွင့်ပြုထားပေမယ့် — SQL မှာလို မဟုတ်ဘဲ — ဒီ feature က external procedures တွေတင်မက procedures အားလုံးနဲ့ သက်ဆိုင်တာကြောင့် — ၎င်းက optional ဖြစ်ပါတယ်။
SECURITY DEFINER procedure တစ်ခုက — transaction control statements တွေ (ဥပမာ — language ပေါ် မူတည်ပြီး COMMIT နဲ့ ROLLBACK) ကို execute လုပ်လို့ မရပါဘူး။
- **configuration_parameter** / **value** — SET clause က — procedure ထဲကို ဝင်ရောက်တဲ့အခါ သတ်မှတ်ထားတဲ့ configuration parameter ကို သတ်မှတ်ထားတဲ့ တန်ဖိုးအဖြစ် သတ်မှတ်ပေးပြီး — procedure ကနေ ထွက်သွားတဲ့အခါ အရင် တန်ဖိုးဆီ ပြန်လည် သတ်မှတ်ပေးပါတယ်။ SET FROM CURRENT က — `CREATE PROCEDURE` ကို execute လုပ်နေချိန်မှာ လက်ရှိ ရှိနေတဲ့ parameter ရဲ့ တန်ဖိုးကို — procedure ထဲကို ဝင်ရောက်တဲ့အခါ သုံးစွဲရမယ့် တန်ဖိုးအဖြစ် သိမ်းဆည်းပေးပါတယ်။
Procedure တစ်ခုမှာ SET clause ချိတ်တွဲထားရင် — procedure ထဲမှာ အဲဒီ variable အတွက်ပဲ execute လုပ်တဲ့ `SET LOCAL` command ရဲ့ သက်ရောက်မှုတွေက procedure ထဲမှာပဲ ကန့်သတ်ခံရပါတယ်: configuration parameter ရဲ့ အရင် တန်ဖိုးကို — procedure ထွက်ချိန်မှာ — ပြန်လည် သတ်မှတ်ပေးဆဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — သာမန် (LOCAL မပါတဲ့) `SET` command တစ်ခုကတော့ — အရင် `SET LOCAL` command တစ်ခုကို ကျော်လွန်ပြီး လုပ်သလိုမျိုး — SET clause ကို override (ကျော်လွန်) လုပ်ပါတယ်: ဒီလို command တစ်ခုရဲ့ သက်ရောက်မှုတွေက — current transaction ကို roll back မလုပ်ရင် — procedure ထွက်ပြီးတဲ့ နောက်မှာပါ ဆက်လက် တည်ရှိနေပါလိမ့်မယ်။
Procedure တစ်ခုမှာ SET clause ချိတ်တွဲထားရင် — အဲဒီ procedure က transaction control statements တွေ (ဥပမာ — language ပေါ် မူတည်ပြီး COMMIT နဲ့ ROLLBACK) ကို execute လုပ်လို့ မရပါဘူး။
ခွင့်ပြုထားတဲ့ parameter names နဲ့ values တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် SET နဲ့ အခန်း 19 ကို ကြည့်ပါ။
- **definition** — Procedure ကို define လုပ်ပေးတဲ့ string constant တစ်ခု; ၎င်းရဲ့ အဓိပ္ပာယ်က language အပေါ် မူတည်ပါတယ်။ ၎င်းက internal procedure name တစ်ခု၊ object file တစ်ခုရဲ့ path၊ SQL command တစ်ခု သို့မဟုတ် procedural language တစ်ခုထဲက text တစ်ခု ဖြစ်နိုင်ပါတယ်။
Procedure definition string ကို ရေးဖို့ — သာမန် single quote syntax အစား — dollar quoting (အပိုင်း 4.1.2.4 ကို ကြည့်ပါ) ကို သုံးတာက မကြာခဏ အထောက်အကူ ဖြစ်ပါတယ်။ Dollar quoting မသုံးဘူးဆိုရင် — procedure definition ထဲက single quotes သို့မဟုတ် backslashes တွေ အားလုံးကို — နှစ်ဆ ထပ်ရေးပြီး escape လုပ်ရပါမယ်။
- **obj_file, link_symbol** — ဒီ AS clause ပုံစံကို — C language source code ထဲက procedure name က SQL procedure ရဲ့ နာမည်နဲ့ မတူညီတဲ့အခါ — dynamically loadable ဖြစ်တဲ့ C language procedures တွေအတွက် သုံးပါတယ်။ obj_file ဆိုတဲ့ string က — compiled C procedure ပါဝင်တဲ့ shared library file ရဲ့ နာမည် ဖြစ်ပြီး — `LOAD` command အတွက်လိုပဲ အဓိပ္ပာယ် ကောက်ယူပါတယ်။ link_symbol ဆိုတဲ့ string က procedure ရဲ့ link symbol — တနည်းအားဖြင့် — C language source code ထဲက procedure ရဲ့ နာမည် — ဖြစ်ပါတယ်။ Link symbol ကို ချန်လိုက်ခဲ့ရင် — သတ်မှတ်နေတဲ့ SQL procedure ရဲ့ နာမည်နဲ့ပဲ တူညီတယ်လို့ ယူဆပါတယ်။
`CREATE PROCEDURE` calls တွေ ထပ်ခါထပ်ခါ လုပ်တာက object file တစ်ခုတည်းကိုပဲ ရည်ညွှန်းနေတဲ့အခါ — အဲဒီ file ကို session တစ်ခုမှာ တစ်ကြိမ်ပဲ load လုပ်ပါတယ်။ File ကို unload ပြီး ပြန် load လုပ်ဖို့ (development လုပ်နေစဉ်မှာ ဖြစ်နိုင်တယ်) — session အသစ်တစ်ခု စတင်ပါ။
- **sql_body** — LANGUAGE SQL procedure တစ်ခုရဲ့ body။ ၎င်းက block တစ်ခု ဖြစ်သင့်ပါတယ်:

    BEGIN ATOMIC
      statement;
      statement;
      ...
      statement;
    END

ဒါက — procedure body ရဲ့ text ကို string constant တစ်ခုအနေနဲ့ ရေးတာ (အပေါ်က definition ကို ကြည့်ပါ) နဲ့ ဆင်တူပေမယ့် — ကွဲပြားချက်တချို့ ရှိပါတယ်: ဒီပုံစံက LANGUAGE SQL အတွက်ပဲ အလုပ်လုပ်ပါတယ် — string constant ပုံစံကတော့ languages အားလုံးအတွက် အလုပ်လုပ်ပါတယ်။ ဒီပုံစံကို procedure definition အချိန်မှာ parse လုပ်ပါတယ် — string constant ပုံစံကိုတော့ execution အချိန်မှာ parse လုပ်ပါတယ်; ဒါကြောင့် — ဒီပုံစံက polymorphic argument types တွေနဲ့ — procedure definition အချိန်မှာ ဖြေရှင်းလို့ မရတဲ့ — တခြား constructs တွေကို ထောက်ပံ့ပေးနိုင်မှာ မဟုတ်ပါဘူး။ ဒီပုံစံက procedure နဲ့ procedure body ထဲမှာ သုံးထားတဲ့ objects တွေကြားက dependencies တွေကို ခြေရာခံပါတယ် — ဒါကြောင့် — `DROP ... CASCADE` က မှန်ကန်စွာ အလုပ်လုပ်ပါလိမ့်မယ် — string literals တွေသုံးတဲ့ ပုံစံကတော့ dangling (ချိတ်ဆွဲထားရုံသက်သက် ဖြစ်နေတဲ့) procedures တွေကို ကျန်ရစ်စေနိုင်ပါတယ်။ နောက်ဆုံးအနေနဲ့ — ဒီပုံစံက SQL standard နဲ့ တခြား SQL implementations တွေနဲ့ ပိုပြီး လိုက်ဖက်ညီပါတယ်။

## Notes (မှတ်စုများ)

Function creation အကြောင်း — procedures တွေနဲ့လည်း သက်ဆိုင်တဲ့ — နောက်ထပ် အသေးစိတ် အချက်အလက်တွေအတွက် [CREATE FUNCTION](/docs/postgresql/sql-createfunction) ကို ကြည့်ပါ။

Procedure တစ်ခုကို execute လုပ်ဖို့ [CALL](/docs/postgresql/sql-call) ကို သုံးပါ။

## Examples (ဥပမာများ)

```
CREATE PROCEDURE insert_data(a integer, b integer)
LANGUAGE SQL
AS $$
INSERT INTO tbl VALUES (a);
INSERT INTO tbl VALUES (b);
$$;
```

သို့မဟုတ်

```sql
CREATE PROCEDURE insert_data(a integer, b integer)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO tbl VALUES (a);
  INSERT INTO tbl VALUES (b);
END;
```

ပြီးတော့ — ဒီလိုမျိုး ခေါ်ယူပါ:

```sql
CALL insert_data(1, 2);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE PROCEDURE` command ကို SQL standard မှာ သတ်မှတ်ထားပါတယ်။ PostgreSQL ရဲ့ implementation ကိုတော့ — compatible ဖြစ်တဲ့ နည်းလမ်းနဲ့ သုံးလို့ ရနိုင်ပေမယ့် — extensions တွေ အများအပြား ပါဝင်ပါတယ်။ အသေးစိတ်အတွက် [CREATE FUNCTION](/docs/postgresql/sql-createfunction) ကိုလည်း ကြည့်ပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER PROCEDURE](/docs/postgresql/sql-alterprocedure), [DROP PROCEDURE](/docs/postgresql/sql-dropprocedure), [CALL](/docs/postgresql/sql-call), [CREATE FUNCTION](/docs/postgresql/sql-createfunction)
