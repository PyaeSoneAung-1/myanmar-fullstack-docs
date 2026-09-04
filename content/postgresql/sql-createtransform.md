---
title: "CREATE TRANSFORM (transform အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Data type တစ်ခုကို procedural language တစ်ခုနှင့် လိုက်လျောညီထွေ ဖြစ်အောင် ပြောင်းလဲပေးသော transform အသစ်တစ်ခုကို သတ်မှတ်ပေးသည့် command — OR REPLACE ဖြင့် အစားထိုးခြင်း၊ from SQL / to SQL function နှစ်ခု၏ အခန်းကဏ္ဍ၊ လိုအပ်သော privileges များအကြောင်း"
order: 306
source: "https://www.postgresql.org/docs/current/sql-createtransform.html"
status: translated
updated: 2026-09-04
---

## CREATE TRANSFORM (transform အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE TRANSFORM — transform အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] TRANSFORM FOR type_name LANGUAGE lang_name (
    FROM SQL WITH FUNCTION from_sql_function_name [ (argument_type [, ...]) ],
    TO SQL WITH FUNCTION to_sql_function_name [ (argument_type [, ...]) ]
);
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TRANSFORM` က transform အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ `CREATE OR REPLACE TRANSFORM` က transform အသစ်တစ်ခုကို ဖန်တီးပေးမှာ ဖြစ်သလို — ရှိပြီးသား အဓိပ္ပါယ်ဖွင့်ဆိုချက် တစ်ခုကို အစားထိုးလည်း လုပ်ပေးပါတယ်။

Transform (ပြောင်းလဲပေးသော ယန္တရား) တစ်ခုက — data type တစ်ခုကို procedural language တစ်ခုနဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် ဘယ်လို ပြောင်းလဲမလဲ ဆိုတာကို သတ်မှတ်ပေးပါတယ်။ ဥပမာ — PL/Python ထဲမှာ `hstore` type ကို သုံးပြီး function တစ်ခု ရေးတဲ့အခါ — PL/Python မှာ `hstore` values တွေကို Python environment ထဲမှာ ဘယ်လို တင်ပြရမလဲဆိုတဲ့ ကြိုတင် သိရှိမှု မရှိပါဘူး။ Language implementations တွေက ပုံမှန်အားဖြင့် text representation (စာသား ကိုယ်စားပြုပုံ) ကို သုံးလေ့ ရှိပါတယ် — ဒါပေမယ့် — ဥပမာ — associative array တစ်ခု ဒါမှမဟုတ် list တစ်ခုက ပိုသင့်လျော်မယ့် အခြေအနေမျိုးမှာတော့ — အဲဒါက အဆင်မပြေပါဘူး။

Transform တစ်ခုက function နှစ်ခုကို သတ်မှတ်ပေးပါတယ်:

- Type ကို SQL environment ကနေ language ဆီကို ပြောင်းလဲပေးတဲ့ “from SQL” function တစ်ခု။ ဒီ function ကို — အဲဒီ language နဲ့ ရေးထားတဲ့ function တစ်ခုရဲ့ arguments တွေပေါ်မှာ ခေါ်ယူသုံးစွဲပါလိမ့်မယ်။
- Type ကို language ကနေ SQL environment ဆီကို ပြောင်းလဲပေးတဲ့ “to SQL” function တစ်ခု။ ဒီ function ကို — အဲဒီ language နဲ့ ရေးထားတဲ့ function တစ်ခုရဲ့ return value ပေါ်မှာ ခေါ်ယူသုံးစွဲပါလိမ့်မယ်။

ဒီ function နှစ်ခုလုံးကို ပေးဖို့တော့ မလိုအပ်ပါဘူး။ တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — လိုအပ်တဲ့အခါ — language-specific ဖြစ်တဲ့ default အပြုအမူကို သုံးပါလိမ့်မယ်။ (တစ်စုံတစ်ရာသော ဦးတည်ချက်တစ်ခုဆီကို transformation လုံးဝ မဖြစ်စေချင်ဘူးဆိုရင် — အမြဲတမ်း error ထုတ်ပေးတဲ့ transform function တစ်ခုကိုလည်း ရေးလို့ ရပါတယ်။)

Transform တစ်ခုကို ဖန်တီးနိုင်ဖို့ — သင်ဟာ type ကို ပိုင်ဆိုင်ပြီး ၎င်းပေါ်မှာ `USAGE` privilege ရှိရမှာ ဖြစ်သလို — language ပေါ်မှာ `USAGE` privilege ရှိရမှာ ဖြစ်ပြီး — from-SQL နဲ့ to-SQL functions တွေကို သတ်မှတ်မယ်ဆိုရင် — ၎င်းတို့ကို ပိုင်ဆိုင်ပြီး — ၎င်းတို့ပေါ်မှာ `EXECUTE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **type_name** — Transform ရဲ့ data type နာမည်ပါ။
- **lang_name** — Transform ရဲ့ language နာမည်ပါ။
- **from_sql_function_name[(argument_type [, ...])]** — Type ကို SQL environment ကနေ language ဆီကို ပြောင်းလဲဖို့အတွက် function ရဲ့ နာမည်ပါ။ ၎င်းက `internal` type ရဲ့ argument တစ်ခုကို ယူပြီး — `internal` type ကို return လုပ်ရပါမယ်။ တကယ့် argument က transform ရဲ့ type ဖြစ်မှာ ဖြစ်ပြီး — function ကို အဲဒီလို ဖြစ်သလို မှတ်ယူပြီး code ရေးသင့်ပါတယ်။ (ဒါပေမယ့် — `internal` type ရဲ့ argument အနည်းဆုံး တစ်ခု မပါဘဲ — `internal` type ကို return လုပ်တဲ့ SQL-level function တစ်ခုကို declare လုပ်တာတော့ ခွင့်မပြုပါဘူး။) တကယ့် return value က language implementation နဲ့ သီးသန့် ဆိုင်တဲ့ အရာတစ်ခု ဖြစ်ပါလိမ့်မယ်။ Argument list တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — function နာမည်က ၎င်းရဲ့ schema ထဲမှာ တစ်ခုတည်းသော (unique) ဖြစ်ရပါမယ်။
- **to_sql_function_name[(argument_type [, ...])]** — Type ကို language ကနေ SQL environment ဆီကို ပြောင်းလဲဖို့အတွက် function ရဲ့ နာမည်ပါ။ ၎င်းက `internal` type ရဲ့ argument တစ်ခုကို ယူပြီး — transform ရဲ့ type ဖြစ်တဲ့ type ကို return လုပ်ရပါမယ်။ တကယ့် argument တန်ဖိုးက language implementation နဲ့ သီးသန့် ဆိုင်တဲ့ အရာတစ်ခု ဖြစ်ပါလိမ့်မယ်။ Argument list တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — function နာမည်က ၎င်းရဲ့ schema ထဲမှာ တစ်ခုတည်းသော (unique) ဖြစ်ရပါမယ်။

## Notes (မှတ်စုများ)

Transforms တွေကို ဖယ်ရှားဖို့ [`DROP TRANSFORM`](/docs/postgresql/sql-droptransform) ကို သုံးပါ။

## Examples (ဥပမာများ)

`hstore` type နဲ့ `plpython3u` language အတွက် transform တစ်ခု ဖန်တီးဖို့ — အရင်ဆုံး type နဲ့ language ကို သတ်မှတ်ပါ:

```sql
CREATE TYPE hstore ...;

CREATE EXTENSION plpython3u;
```

ပြီးတော့ — လိုအပ်တဲ့ functions တွေကို ဖန်တီးပါ:

```sql
CREATE FUNCTION hstore_to_plpython(val internal) RETURNS internal
LANGUAGE C STRICT IMMUTABLE
AS ...;

CREATE FUNCTION plpython_to_hstore(val internal) RETURNS hstore
LANGUAGE C STRICT IMMUTABLE
AS ...;
```

ပြီးတော့ — ၎င်းတို့ အားလုံးကို ချိတ်ဆက်ပေးဖို့ transform ကို နောက်ဆုံး ဖန်တီးပါ:

```sql
CREATE TRANSFORM FOR hstore LANGUAGE plpython3u (
    FROM SQL WITH FUNCTION hstore_to_plpython(internal),
    TO SQL WITH FUNCTION plpython_to_hstore(internal)
);
```

လက်တွေ့မှာတော့ — ဒီ commands တွေကို extension တစ်ခုထဲမှာ ထုပ်ပိုးထားလေ့ ရှိပါတယ်။

`contrib` section ထဲမှာ transforms တွေကို ပေးတဲ့ extensions အများအပြား ပါဝင်ပြီး — ၎င်းတို့က လက်တွေ့ ကမ္ဘာ့ ဥပမာများ (real-world examples) အဖြစ် အသုံးပြုနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ ပုံစံဖြစ်တဲ့ `CREATE TRANSFORM` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ထဲမှာလည်း `CREATE TRANSFORM` command တစ်ခု ရှိပါတယ် — ဒါပေမယ့် ၎င်းက data types တွေကို client languages တွေနဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် ပြောင်းလဲဖို့အတွက် ဖြစ်ပါတယ်။ အဲဒီ အသုံးပြုပုံကို PostgreSQL က ထောက်ပံ့မထားပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FUNCTION](/docs/postgresql/sql-createfunction), [CREATE LANGUAGE](/docs/postgresql/sql-createlanguage), [CREATE TYPE](/docs/postgresql/sql-createtype), [DROP TRANSFORM](/docs/postgresql/sql-droptransform)
