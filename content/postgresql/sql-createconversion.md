---
title: "CREATE CONVERSION (encoding conversion အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "Character set encodings (စာလုံးအစု ကုဒ်ပြောင်းစနစ်များ) နှစ်ခုကြားမှာ conversion အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးတဲ့ command — DEFAULT အမှတ်အသားပါသော conversion ကို client-server အလိုအလျောက် encoding conversion အတွက် သုံးနိုင်ခြင်း၊ function ၏ EXECUTE privilege နှင့် destination schema ၏ CREATE privilege လိုအပ်ခြင်း၊ SQL_ASCII encoding အတွက် conversion သတ်မှတ်၍ မရခြင်း အကြောင်း ဖော်ပြထားသည်"
order: 248
source: "https://www.postgresql.org/docs/current/sql-createconversion.html"
status: translated
updated: 2026-09-04
---

## CREATE CONVERSION (encoding conversion အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE CONVERSION — encoding conversion အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ DEFAULT ] CONVERSION name
    FOR source_encoding TO dest_encoding FROM function_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE CONVERSION` က character set encodings (စာလုံးအစု ကုဒ်ပြောင်းစနစ်များ) နှစ်ခုကြားမှာ conversion (ပြောင်းလဲခြင်း) အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်။

`DEFAULT` အဖြစ် အမှတ်အသား လုပ်ထားတဲ့ conversions တွေကို — client နဲ့ server ကြားမှာ အလိုအလျောက် encoding conversion အတွက် သုံးနိုင်ပါတယ်။ အဲဒီလို အသုံးပြုမှုကို ထောက်ပံ့ဖို့ — encoding A ကနေ B ကို ပြောင်းတဲ့ conversion နဲ့ — encoding B ကနေ A ကို ပြောင်းတဲ့ conversion — နှစ်ခုလုံး သတ်မှတ်ထားရပါမယ်။

Conversion တစ်ခု ဖန်တီးနိုင်ဖို့ — သင်က function ပေါ်မှာ `EXECUTE` privilege (ခွင့်ပြုချက်) နဲ့ — destination schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **DEFAULT** — DEFAULT clause က — ဒီ conversion က ဒီ source-to-destination encoding အတွက် default conversion ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ Encoding pair တစ်ခုအတွက် — schema တစ်ခုထဲမှာ default encoding တစ်ခုတည်းသာ ရှိသင့်ပါတယ်။
- **name** — Conversion ရဲ့ နာမည် ဖြစ်ပါတယ်။ Conversion နာမည်ကို schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) လုပ်လို့ ရပါတယ်။ မလုပ်ထားဘူးဆိုရင် — conversion ကို လက်ရှိ schema ထဲမှာ သတ်မှတ်ပါတယ်။ Conversion နာမည်က schema တစ်ခုအတွင်းမှာ တမူထူးခြားတဲ့ (unique) နာမည် ဖြစ်ရပါမယ်။
- **source_encoding** — Source encoding ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **dest_encoding** — Destination encoding ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **function_name** — Conversion ကို ဆောင်ရွက်ဖို့ သုံးတဲ့ function ဖြစ်ပါတယ်။ Function နာမည်ကို schema-qualified လုပ်လို့ ရပါတယ်။ မလုပ်ထားဘူးဆိုရင် — function ကို path ထဲမှာ ရှာဖွေပါလိမ့်မယ်။

Function မှာ အောက်ပါ signature (parameter ပုံစံ သတ်မှတ်ချက်) ရှိရပါမယ်:

    conv_proc(
        integer,  -- source encoding ID
        integer,  -- destination encoding ID
        cstring,  -- source string (null terminated C string)
        internal, -- destination (fill with a null terminated C string)
        integer,  -- source string length
        boolean   -- if true, don't throw an error if conversion fails
    ) RETURNS integer;

Return value (ပြန်ပေးတန်ဖိုး) က — အောင်မြင်စွာ ပြောင်းလဲနိုင်ခဲ့တဲ့ source bytes အရေအတွက် ဖြစ်ပါတယ်။ နောက်ဆုံး argument က false ဖြစ်နေရင် — function က invalid input (မမှန်ကန်သော input) ပေါ်မှာ error တစ်ခု ပစ်ရမှာ ဖြစ်ပြီး — return value က source string ရဲ့ အလျားနဲ့ အမြဲတမ်း ညီမျှနေပါလိမ့်မယ်။

## Notes (မှတ်စုများ)

Source encoding ရော destination encoding ရော — နှစ်ခုလုံးက `SQL_ASCII` ဖြစ်လို့ မရပါဘူး — ဘာကြောင့်လဲဆိုတော့ `SQL_ASCII` ဆိုတဲ့ “encoding” ပါဝင်တဲ့ ကိစ္စရပ်တွေအတွက် server ရဲ့ အပြုအမူက hard-wired (ပုံသေ ချိတ်ဆက်ထားသော) ဖြစ်နေလို့ပါ။

User-defined conversions တွေကို ဖယ်ရှားဖို့ — `DROP CONVERSION` ကို သုံးပါ။

Conversion တစ်ခု ဖန်တီးဖို့ လိုအပ်တဲ့ privileges တွေကို — အနာဂတ် release တစ်ခုမှာ ပြောင်းလဲသွားနိုင်ပါတယ်။

## Examples (ဥပမာများ)

`myfunc` ကို သုံးပြီး — `UTF8` encoding ကနေ `LATIN1` encoding ဆီကို ပြောင်းတဲ့ conversion တစ်ခု ဖန်တီးရန်:

```sql
CREATE CONVERSION myconv FOR 'UTF8' TO 'LATIN1' FROM myfunc;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE CONVERSION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ထဲမှာ `CREATE CONVERSION` statement ဆိုတာ မရှိဘူးဆိုပေမယ့် — ရည်ရွယ်ချက်နဲ့ syntax အရ အလွန် ဆင်တူတဲ့ `CREATE TRANSLATION` statement တစ်ခုကတော့ ရှိပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER CONVERSION](/docs/postgresql/sql-alterconversion), [CREATE FUNCTION](/docs/postgresql/sql-createfunction), [DROP CONVERSION](/docs/postgresql/sql-dropconversion)
