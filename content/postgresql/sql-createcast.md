---
title: "CREATE CAST (cast အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Data types နှစ်ခုကြားရှိ conversion (ပြောင်းလဲခြင်း) တစ်ခုကို သတ်မှတ်ပေးသည့် cast အသစ်တစ်ခု ဖန်တီးခြင်း — WITH FUNCTION၊ WITHOUT FUNCTION (binary-coercible types များအတွက်) နှင့် WITH INOUT (I/O conversion cast) ပုံစံ သုံးမျိုး၊ AS ASSIGNMENT / AS IMPLICIT ဖြင့် implicit ခေါ်ယူနိုင်မှု၊ cast implementation function များ၏ arguments များနှင့် လိုအပ်သော ခွင့်ပြုချက်များ အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 313
source: "https://www.postgresql.org/docs/current/sql-createcast.html"
status: translated
updated: 2026-09-04
---

## CREATE CAST (cast အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE CAST — cast အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE CAST (source_type AS target_type)
    WITH FUNCTION function_name [ (argument_type [, ...]) ]
    [ AS ASSIGNMENT | AS IMPLICIT ]

CREATE CAST (source_type AS target_type)
    WITHOUT FUNCTION
    [ AS ASSIGNMENT | AS IMPLICIT ]

CREATE CAST (source_type AS target_type)
    WITH INOUT
    [ AS ASSIGNMENT | AS IMPLICIT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE CAST` က — cast အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Cast တစ်ခုက — data types နှစ်ခုကြားမှာ conversion (ပြောင်းလဲခြင်း) တစ်ခုကို ဘယ်လို လုပ်ဆောင်ရမယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်။ ဥပမာ —

```sql
SELECT CAST(42 AS float8);
```

ဒီ query က — ကြိုတင် သတ်မှတ်ထားတဲ့ function တစ်ခု ဖြစ်တဲ့ `float8(int4)` ကို ခေါ်ယူခြင်းအားဖြင့် — integer constant 42 ကို `float8` type အဖြစ် ပြောင်းလဲပေးပါတယ်။ (သင့်လျော်တဲ့ cast တစ်ခုကို သတ်မှတ်ထားခြင်း မရှိဘူးဆိုရင် — conversion က မအောင်မြင်ပါဘူး။)

Data types နှစ်ခုက *binary coercible* (binary ပုံစံဖြင့် တိုက်ရိုက် ပြောင်းလဲနိုင်သော) ဖြစ်နိုင်ပါတယ် — ဆိုလိုတာက — ဒီလို ပြောင်းလဲမှုကို function တစ်ခုခုကို မခေါ်ယူဘဲ — “အခမဲ့” လုပ်ဆောင်လို့ ရပါတယ်။ ဒါအတွက် — သက်ဆိုင်တဲ့ တန်ဖိုးတွေက တူညီတဲ့ internal representation (အတွင်းပိုင်း ကိုယ်စားပြုပုံ) ကို သုံးစွဲဖို့ လိုအပ်ပါတယ်။ ဥပမာ — `text` နဲ့ `varchar` types တွေက နှစ်ဖက်စလုံး binary coercible ဖြစ်ပါတယ်။ Binary coercibility က — အမြဲတမ်းတော့ symmetric (အပြန်အလှန် ညီမျှသော) ဆက်စပ်မှုတစ်ခု မဟုတ်ပါဘူး။ ဥပမာ — `xml` ကနေ `text` ဆီ cast လုပ်တာက — လက်ရှိ implementation မှာ အခမဲ့ လုပ်ဆောင်လို့ ရပေမယ့် — ပြောင်းပြန် ဦးတည်ချက်ကတော့ — အနည်းဆုံး syntax check (စာကြောင်း ဖွဲ့စည်းပုံ စစ်ဆေးခြင်း) တစ်ခု လုပ်ဆောင်ပေးတဲ့ function တစ်ခု လိုအပ်ပါတယ်။ (နှစ်ဖက်စလုံး binary coercible ဖြစ်တဲ့ types နှစ်ခုကို — binary compatible (binary လိုက်ဖက်ညီသော) လို့လည်း ရည်ညွှန်း ခေါ်ဆိုပါတယ်။)

`WITH INOUT` syntax ကို သုံးပြီး — cast တစ်ခုကို *I/O conversion cast* (I/O ပြောင်းလဲမှု cast) အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ I/O conversion cast တစ်ခုကို — source data type ရဲ့ output function ကို ခေါ်ယူပြီး — ရလာတဲ့ string ကို target data type ရဲ့ input function ဆီ ပေးပို့ခြင်းအားဖြင့် လုပ်ဆောင်ပါတယ်။ အသုံးများတဲ့ ကိစ္စ အများအပြားမှာ — ဒီ feature က — conversion အတွက် သီးခြား cast function တစ်ခု ရေးသားစရာ မလိုအောင် ရှောင်ရှားပေးပါတယ်။ I/O conversion cast တစ်ခုက — ပုံမှန် function-based cast တစ်ခုလိုပဲ ပြုမူပါတယ်; implementation ပဲ ကွဲပြားပါတယ်။

Default အနေနဲ့ — cast တစ်ခုကို — explicit cast request (ထင်ရှားစွာ cast တောင်းဆိုမှု) ကသာ ခေါ်ယူနိုင်ပါတယ် — ဆိုလိုတာက — `CAST(x AS typename)` သို့မဟုတ် `x::typename` ဆိုတဲ့ construct ပုံစံမျိုး ဖြစ်ပါတယ်။

Cast က `AS ASSIGNMENT` လို့ အမှတ်အသား လုပ်ထားရင် — target data type ရဲ့ column တစ်ခုဆီ တန်ဖိုးတစ်ခု assign (သတ်မှတ် ပေးအပ်) လုပ်တဲ့အခါ — သူ့ကို implicit (သွယ်ဝိုက်သော — အလိုအလျောက်) ခေါ်ယူလို့ ရပါတယ်။ ဥပမာ — `foo.f1` က `text` type ရဲ့ column တစ်ခု ဖြစ်တယ်ဆိုပါစို့ — အဲဒါဆိုရင်:

```sql
INSERT INTO foo (f1) VALUES (42);
```

ဒီ query က — `integer` type ကနေ `text` type ဆီ cast က `AS ASSIGNMENT` လို့ အမှတ်အသား လုပ်ထားမယ်ဆိုရင် — ခွင့်ပြုခံရမှာ ဖြစ်ပြီး — မဟုတ်ရင် ခွင့်မပြုပါဘူး။ (ဒီလို cast မျိုးကို ဖော်ပြဖို့ — *assignment cast* (assign လုပ်ချိန် ခေါ်ယူသော cast) ဆိုတဲ့ အသုံးအနှုန်းကို ယေဘုယျအားဖြင့် သုံးပါတယ်။)

Cast က `AS IMPLICIT` လို့ အမှတ်အသား လုပ်ထားရင် — assignment ဖြစ်စေ — expression တစ်ခုအတွင်းမှာ ဖြစ်စေ — ဘယ် context မှာမဆို implicit ခေါ်ယူလို့ ရပါတယ်။ (ဒီလို cast မျိုးကို ဖော်ပြဖို့ — *implicit cast* ဆိုတဲ့ အသုံးအနှုန်းကို ယေဘုယျအားဖြင့် သုံးပါတယ်။) ဥပမာ — ဒီ query ကို ကြည့်ပါ:

```sql
SELECT 2 + 4.0;
```

Parser က — အစပိုင်းမှာ constants တွေကို `integer` နဲ့ `numeric` types တွေအနေနဲ့ — အသီးသီး အမှတ်အသား လုပ်ပါတယ်။ System catalogs တွေထဲမှာ `integer` `+` `numeric` operator မရှိပေမယ့် — `numeric` `+` `numeric` operator တော့ ရှိပါတယ်။ ဒါကြောင့် — `integer` ကနေ `numeric` ဆီ cast တစ်ခု ရနိုင်ပြီး — `AS IMPLICIT` လို့ အမှတ်အသား လုပ်ထားမယ်ဆိုရင် — query က အောင်မြင်ပါလိမ့်မယ် — တကယ်တော့ အဲဒီ cast က အဲဒီလို အမှတ်အသား ရှိပါတယ်။ Parser က implicit cast ကို အသုံးပြုပြီး — query ကို — ဒီအတိုင်း ရေးထားသလိုမျိုး ဖြေရှင်းပါလိမ့်မယ်:

```sql
SELECT CAST ( 2 AS numeric ) + 4.0;
```

အခုဆိုရင် — catalogs တွေက `numeric` ကနေ `integer` ဆီ cast တစ်ခုကိုလည်း ပံ့ပိုးပေးထားပါတယ်။ အဲဒီ cast က `AS IMPLICIT` လို့ အမှတ်အသား လုပ်ထားမယ်ဆိုရင် — (တကယ်တော့ မလုပ်ထားပါဘူး) — parser က — အပေါ်က အဓိပ္ပာယ်ဖွင့်ဆိုချက် ဒါမှမဟုတ် — `numeric` constant ကို `integer` အဖြစ် cast လုပ်ပြီး — `integer` `+` `integer` operator ကို အသုံးပြုတဲ့ — အစားထိုး ရွေးချယ်စရာကြားမှာ ရွေးချယ်ရတဲ့ အခြေအနေနဲ့ ရင်ဆိုင်ရပါလိမ့်မယ်။ ဘယ်ရွေးချယ်မှုကို ဦးစားပေးရမယ်ဆိုတဲ့ အသိပညာ တစ်စုံတစ်ရာ မရှိတာကြောင့် — သူက လက်လျှော့ပြီး — query ကို ambiguous (မရေမရာ) လို့ ကြေညာပါလိမ့်မယ်။ Cast နှစ်ခုထဲက တစ်ခုတည်းသာ implicit ဖြစ်တယ်ဆိုတဲ့ အချက်က — `numeric` နဲ့ `integer` ရောထွေးနေတဲ့ expression တစ်ခုကို `numeric` အဖြစ် ဖြေရှင်းတာကို — parser က ဦးစားပေးစေဖို့ သင်ကြားပေးထားတဲ့ နည်းလမ်း ဖြစ်ပါတယ်; အဲဒါနဲ့ ပတ်သက်တဲ့ built-in အသိပညာ ဆိုတာ မရှိပါဘူး။

Casts တွေကို implicit အဖြစ် အမှတ်အသား လုပ်ရာမှာ — ရှေးရိုးစွဲ (conservative) သဘောထား ထားတာ ပညာရှိရာရောက်ပါတယ်။ Implicit casting paths (implicit ပြောင်းလဲမှု လမ်းကြောင်းများ) တွေ အလွန်အကျွံ များနေရင် — PostgreSQL က commands တွေရဲ့ မမျှော်လင့်တဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုမှုတွေကို ရွေးချယ်မိနိုင်သလို — အဓိပ္ပာယ်ဖွင့်ဆိုနိုင်စရာ အများအပြား ရှိနေလို့ — commands တွေကို လုံးဝ ဖြေရှင်းနိုင်စွမ်း မရှိတော့တာမျိုးလည်း ဖြစ်နိုင်ပါတယ်။ လက်တွေ့ကျတဲ့ စည်းမျဉ်းကောင်းတစ်ခုကတော့ — type category (type အမျိုးအစား အုပ်စု) တစ်ခုတည်းအတွင်းက types တွေကြားမှာ — information-preserving (အချက်အလက် ထိန်းသိမ်းပေးသော) ပြောင်းလဲမှုတွေအတွက်သာ — cast ကို implicit ခေါ်ယူနိုင်အောင် ပြုလုပ်ဖို့ ဖြစ်ပါတယ်။ ဥပမာ — `int2` ကနေ `int4` ဆီ cast က ကျိုးကြောင်းဆီလျော်စွာ implicit ဖြစ်နိုင်ပေမယ့် — `float8` ကနေ `int4` ဆီ cast ကတော့ assignment-only (assign လုပ်ချိန်မှသာ) ဖြစ်သင့်ပါတယ်။ `text` ကနေ `int4` ဆီလို — type category ဖြတ်ကူးတဲ့ casts တွေကတော့ — explicit-only (ထင်ရှားစွာ သတ်မှတ်မှသာ) အဖြစ် ပြုလုပ်တာ အကောင်းဆုံး ဖြစ်ပါတယ်။

> **မှတ်ချက်:** တချို့သော အခြေအနေတွေမှာ — usability (အသုံးပြုရ လွယ်ကူမှု) သို့မဟုတ် standards-compliance (စံနှုန်း လိုက်နာမှု) အကြောင်းပြချက်တွေကြောင့် — types အစုတစ်ခုကြားမှာ implicit casts အများအပြားကို ပေးထားဖို့ လိုအပ်တတ်ပြီး — အပေါ်မှာ ဖော်ပြခဲ့သလို ရှောင်လို့ မရတဲ့ ambiguity (မရေမရာ ဖြစ်မှု) မျိုး ဖြစ်ပေါ်တတ်ပါတယ်။ Parser မှာ — *type categories* (type အမျိုးအစား အုပ်စုများ) နဲ့ *preferred types* (ဦးစားပေး types များ) တွေကို အခြေခံတဲ့ fallback heuristic (နောက်ကောက် ခန့်မှန်းနည်း) တစ်ခု ရှိပြီး — ဒီလို ကိစ္စမျိုးတွေမှာ လိုချင်တဲ့ အပြုအမူကို ရရှိအောင် ကူညီပေးနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [CREATE TYPE](/docs/postgresql/sql-createtype) ကို ကြည့်ပါ။

Cast တစ်ခုကို ဖန်တီးနိုင်ဖို့ — သင်ဟာ source သို့မဟုတ် target data type ကို ပိုင်ဆိုင်ရပြီး — ကျန်တဲ့ type ပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။ Binary-coercible cast တစ်ခုကို ဖန်တီးဖို့ဆိုရင် — သင်ဟာ superuser ဖြစ်ရပါမယ်။ (မှားယွင်းနေတဲ့ binary-coercible cast conversion တစ်ခုက server ကို အလွယ်တကူ crash ဖြစ်စေနိုင်တာကြောင့် — ဒီ ကန့်သတ်ချက်ကို ပြုလုပ်ထားတာ ဖြစ်ပါတယ်။)

## Parameters (parameter များ)

- **source_type** — Cast ရဲ့ source data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **target_type** — Cast ရဲ့ target data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **function_name[(argument_type [, ...])]** — Cast ကို လုပ်ဆောင်ဖို့ သုံးတဲ့ function ဖြစ်ပါတယ်။ Function ရဲ့ နာမည်ကို schema-qualified (schema ပါဝင်သော) ပုံစံနဲ့ ရေးလို့ ရပါတယ်။ Schema-qualified မဟုတ်ဘူးဆိုရင် — function ကို schema search path ထဲမှာ ရှာဖွေပါလိမ့်မယ်။ Function ရဲ့ result data type က — cast ရဲ့ target type နဲ့ ကိုက်ညီရပါမယ်။ ၎င်းရဲ့ arguments တွေကို အောက်မှာ ဆွေးနွေးထားပါတယ်။ Argument list ကို သတ်မှတ်မထားဘူးဆိုရင် — function နာမည်က သူ့ရဲ့ schema ထဲမှာ သီးခြား (unique) ဖြစ်ရပါမယ်။
- **WITHOUT FUNCTION** — Source type က target type ဆီ binary-coercible ဖြစ်လို့ — cast ကို လုပ်ဆောင်ဖို့ function တစ်ခုမျှ မလိုအပ်ဘူးလို့ ညွှန်ပြပါတယ်။
- **WITH INOUT** — Cast က I/O conversion cast တစ်ခု ဖြစ်ပြီး — source data type ရဲ့ output function ကို ခေါ်ယူပြီး — ရလာတဲ့ string ကို target data type ရဲ့ input function ဆီ ပေးပို့ခြင်းအားဖြင့် လုပ်ဆောင်တယ်လို့ ညွှန်ပြပါတယ်။
- **AS ASSIGNMENT** — Cast ကို assignment contexts (assign လုပ်သည့် နေရာများ) တွေမှာ implicit ခေါ်ယူလို့ ရတယ်လို့ ညွှန်ပြပါတယ်။
- **AS IMPLICIT** — Cast ကို ဘယ် context မှာမဆို implicit ခေါ်ယူလို့ ရတယ်လို့ ညွှန်ပြပါတယ်။

Cast implementation functions တွေမှာ arguments တစ်ခုကနေ သုံးခုအထိ ရှိနိုင်ပါတယ်။ ပထမ argument ရဲ့ type က — cast ရဲ့ source type နဲ့ တူညီရပါမယ် သို့မဟုတ် source type ကနေ binary-coercible ဖြစ်ရပါမယ်။ ဒုတိယ argument ရှိမယ်ဆိုရင် — `integer` type ဖြစ်ရပြီး — destination type နဲ့ ဆက်စပ်နေတဲ့ type modifier ကို လက်ခံရယူပါတယ် — modifier မရှိဘူးဆိုရင် `-1` ကို လက်ခံရယူပါတယ်။ တတိယ argument ရှိမယ်ဆိုရင် — `boolean` type ဖြစ်ရပြီး — cast က explicit cast ဖြစ်ရင် `true` ကို လက်ခံရယူပြီး — မဟုတ်ရင် `false` ကို လက်ခံရယူပါတယ်။ (ထူးဆန်းစွာပဲ — SQL standard က တချို့ ကိစ္စတွေမှာ explicit နဲ့ implicit casts တွေအတွက် မတူညီတဲ့ အပြုအမူတွေကို တောင်းဆိုပါတယ်။ ဒီ argument က — ဒီလို casts တွေကို implement လုပ်ရမယ့် functions တွေအတွက် ပံ့ပိုးပေးထားတာ ဖြစ်ပါတယ်။ ဒါက အရေးပါလာအောင် ကိုယ်ပိုင် data types တွေကို ဒီဇိုင်းဆွဲဖို့တော့ အကြံပြုလိုတာ မဟုတ်ပါဘူး။)

Cast function တစ်ခုရဲ့ return type က — cast ရဲ့ target type နဲ့ တူညီရပါမယ် သို့မဟုတ် target type ဆီ binary-coercible ဖြစ်ရပါမယ်။

ပုံမှန်အားဖြင့် — cast တစ်ခုမှာ source နဲ့ target data types တွေ မတူညီဘဲ ကွဲပြားရပါမယ်။ ဒါပေမယ့် — cast implementation function တစ်ခုမှာ argument တစ်ခုထက်ပို ပါဝင်နေမယ်ဆိုရင် — source နဲ့ target types တွေ တူညီတဲ့ cast တစ်ခုကို ကြေညာဖို့တော့ ခွင့်ပြုပါတယ်။ ဒါကို — system catalogs တွေထဲမှာ type-specific length coercion functions (type အလိုက် အလျား ညှိယူခြင်း functions) တွေကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ အမည်ပေးထားတဲ့ function ကို — type ရဲ့ တန်ဖိုးတစ်ခုကို — သူ့ရဲ့ ဒုတိယ argument က ပေးတဲ့ type modifier တန်ဖိုးဆီ ညှိယူ (coerce) ဖို့ သုံးပါတယ်။

Cast တစ်ခုမှာ source နဲ့ target types တွေ ကွဲပြားပြီး — argument တစ်ခုထက်ပို ယူတဲ့ function တစ်ခု ရှိနေရင် — သူက type တစ်ခုကနေ နောက်တစ်ခုဆီ ပြောင်းလဲခြင်းနဲ့ length coercion (အလျား ညှိယူခြင်း) ကို ကျင့်သုံးခြင်း နှစ်ခုလုံးကို — တစ်ဆင့်တည်းနဲ့ ထောက်ပံ့ပေးပါတယ်။ ဒီလို entry တစ်ခု မရနိုင်ဘူးဆိုရင် — type modifier တစ်ခုကို သုံးတဲ့ type တစ်ခုဆီ ညှိယူခြင်းက — cast အဆင့် နှစ်ဆင့် ပါဝင်ပါတယ် — တစ်ဆင့်က data types ကြား ပြောင်းလဲဖို့ ဖြစ်ပြီး — ဒုတိယတစ်ဆင့်က modifier ကို ကျင့်သုံးဖို့ ဖြစ်ပါတယ်။

Domain type တစ်ခုဆီ သို့မဟုတ် domain type တစ်ခုကနေ cast လုပ်တာက — လက်ရှိမှာ သက်ရောက်မှု မရှိပါဘူး။ Domain တစ်ခုဆီ သို့မဟုတ် domain တစ်ခုကနေ cast လုပ်တာက — သူ့ရဲ့ အောက်ခံ type (underlying type) နဲ့ ဆက်စပ်နေတဲ့ casts တွေကို သုံးပါတယ်။

## Notes (မှတ်စုများ)

User-defined casts တွေကို ဖယ်ရှားဖို့ [`DROP CAST`](/docs/postgresql/sql-dropcast) ကို သုံးပါ။

Types တွေကို နှစ်ဖက်စလုံး ပြောင်းလဲနိုင်စေချင်ရင် — casts တွေကို နှစ်ဖက်စလုံးအတွက် — ထင်ရှားစွာ (explicitly) ကြေညာထားဖို့ လိုတယ်ဆိုတာ သတိရပါ။

User-defined types တွေနဲ့ standard string types (`text`, `varchar`, `char(n)` နဲ့ — string category (string အမျိုးအစား အုပ်စု) ထဲမှာ ရှိဖို့ သတ်မှတ်ထားတဲ့ user-defined types) တွေကြားမှာ casts တွေ ဖန်တီးဖို့ကတော့ — ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။ PostgreSQL က အဲဒါအတွက် automatic I/O conversion casts တွေကို ပံ့ပိုးပေးပါတယ်။ String types တွေဆီ automatic casts တွေကို assignment casts အဖြစ် သဘောထားပြီး — string types တွေကနေ automatic casts တွေကတော့ explicit-only ဖြစ်ပါတယ်။ ကိုယ်ပိုင် cast တစ်ခုကို ကြေညာပြီး automatic cast တစ်ခုကို အစားထိုးခြင်းအားဖြင့် ဒီ အပြုအမူကို override (ကျော်လွန် သတ်မှတ်) လုပ်လို့ ရပေမယ့် — အဲဒီလို လုပ်ရတဲ့ တစ်ခုတည်းသော အကြောင်းပြချက်ကတော့ — ပုံမှန် assignment-only သို့မဟုတ် explicit-only setting တွေထက် — conversion ကို ပိုလွယ်ကူစွာ ခေါ်ယူနိုင်စေချင်တာမျိုးသာ ဖြစ်ပါတယ်။ နောက် ဖြစ်နိုင်တဲ့ အကြောင်းပြချက်တစ်ခုကတော့ — type ရဲ့ I/O function နဲ့ မတူညီတဲ့ အပြုအမူမျိုး ရှိစေချင်တာ ဖြစ်ပါတယ်; ဒါပေမယ့် — အဲဒါက တော်တော်လေး အံ့အားသင့်စရာ ကောင်းတဲ့အတွက် — ဒါဟာ ကောင်းတဲ့ အကြံတစ်ခုလားဆိုတာ နှစ်ခါလောက် ပြန်စဉ်းစားသင့်ပါတယ်။ (Built-in types တွေထဲက အနည်းငယ်ကတော့ — အများစုက SQL standard ရဲ့ လိုအပ်ချက်တွေကြောင့် — conversion တွေအတွက် မတူညီတဲ့ အပြုအမူတွေ တကယ်ပဲ ရှိပါတယ်။)

ဖြစ်ရန် မလိုအပ်ပေမယ့် — cast implementation functions တွေကို target data type ရဲ့ နာမည်နဲ့ အမည်ပေးတဲ့ — ဒီ ရိုးရာ convention ကို ဆက်လိုက်နာဖို့ အကြံပြုပါတယ်။ အသုံးပြုသူ အများအပြားက — function-style notation နဲ့ — ဆိုလိုတာက `typename`(`x`) ပုံစံနဲ့ — data types တွေကို cast လုပ်လို့ ရတာကို ကျင့်သားရနေပါတယ်။ ဒီ notation က တကယ်တော့ — cast implementation function ကို ခေါ်ယူတာနဲ့ အတိအကျ မခြားနားပါဘူး; သူ့ကို cast တစ်ခုအနေနဲ့ အထူး သဘောထား ဆက်ဆံခြင်း မရှိပါဘူး။ ဒီ convention ကို ထောက်ပံ့နိုင်ဖို့ — သင့်ရဲ့ conversion functions တွေကို အမည် မပေးထားဘူးဆိုရင် — အသုံးပြုသူတွေ အံ့အားသင့်စရာ ဖြစ်ပါလိမ့်မယ်။ PostgreSQL က — function နာမည်တစ်ခုတည်းကို — argument types အမျိုးမျိုးနဲ့ overload လုပ်တာကို ခွင့်ပြုတာကြောင့် — target type ရဲ့ နာမည်ကို အားလုံး သုံးထားတဲ့ — types အမျိုးမျိုးကနေ conversion functions အများအပြား ရှိဖို့ဆိုတာ — ပြဿနာ တစ်စုံတစ်ရာ မရှိပါဘူး။

> **မှတ်ချက်:** တကယ်တော့ အပေါ်က စာပိုဒ်က အလွန်ရိုးရှင်းအောင် ရှင်းပြထားတာ ဖြစ်ပါတယ်: function-call construct တစ်ခုက — တကယ့် function တစ်ခုနဲ့ မကိုက်ညီဘဲနဲ့တောင် — cast request တစ်ခုအနေနဲ့ သဘောထားခံရတဲ့ ကိစ္စ နှစ်မျိုး ရှိပါတယ်။ Function call `name`(`x`) တစ်ခုက — ရှိပြီးသား function တစ်ခုခုနဲ့ အတိအကျ မကိုက်ညီဘူး၊ ဒါပေမယ့် — `name` က data type တစ်ခုရဲ့ နာမည် ဖြစ်ပြီး — `pg_cast` က `x` ရဲ့ type ကနေ ဒီ type ဆီ binary-coercible cast တစ်ခုကို ပံ့ပိုးပေးထားမယ်ဆိုရင် — အဲဒီ call ကို binary-coercible cast တစ်ခုအနေနဲ့ အဓိပ္ပာယ် ကောက်ယူပါလိမ့်မယ်။ ဒီ exception ကို — binary-coercible casts တွေမှာ function တစ်ခုမျှ မရှိဘဲနဲ့တောင် — functional syntax သုံးပြီး ခေါ်ယူလို့ ရနိုင်အောင် — ပြုလုပ်ထားတာ ဖြစ်ပါတယ်။ အလားတူပဲ — `pg_cast` entry မရှိဘူး၊ ဒါပေမယ့် — cast က string type တစ်ခုဆီ သို့မဟုတ် string type တစ်ခုကနေ ဖြစ်နေမယ်ဆိုရင် — အဲဒီ call ကို I/O conversion cast တစ်ခုအနေနဲ့ အဓိပ္ပာယ် ကောက်ယူပါလိမ့်မယ်။ ဒီ exception က — I/O conversion casts တွေကို functional syntax သုံးပြီး ခေါ်ယူနိုင်အောင် ခွင့်ပြုပေးပါတယ်။

> **မှတ်ချက်:** Exception ရဲ့ exception တစ်ခုလည်း ရှိပါသေးတယ်: composite types တွေကနေ string types တွေဆီ I/O conversion casts တွေကို — functional syntax နဲ့ ခေါ်ယူလို့ မရဘဲ — explicit cast syntax (ဖြစ်စေ `CAST` ဖြစ်စေ — `::` notation) နဲ့ပဲ ရေးရပါတယ်။ ဒီ exception ကို — အလိုအလျောက် ပံ့ပိုးပေးတဲ့ I/O conversion casts တွေ စတင် မိတ်ဆက်ပြီးနောက်မှာ — function သို့မဟုတ် column reference တစ်ခုကို ရည်ရွယ်ထားတဲ့အခါ — ဒီလို cast တစ်ခုကို မတော်တဆ ခေါ်ယူမိတာ လွန်စွာ လွယ်ကူနေတာကို တွေ့ရှိခဲ့လို့ — ထည့်သွင်းခဲ့တာ ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`int4(bigint)` function ကို သုံးပြီး — `bigint` type ကနေ `int4` type ဆီ assignment cast တစ်ခု ဖန်တီးဖို့:

```sql
CREATE CAST (bigint AS int4) WITH FUNCTION int4(bigint) AS ASSIGNMENT;
```

(ဒီ cast က system ထဲမှာ ကြိုတင် သတ်မှတ်ပြီးသား ဖြစ်ပါတယ်။)

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE CAST` command က SQL standard နဲ့ ကိုက်ညီပါတယ် — ဒါပေမယ့် — SQL က binary-coercible types တွေ သို့မဟုတ် implementation functions တွေအတွက် အပိုဆောင်း arguments တွေကိုတော့ ပြဋ္ဌာန်းချက် (provisions) မပေးထားပါဘူး။ `AS IMPLICIT` ကလည်း PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FUNCTION](/docs/postgresql/sql-createfunction), [CREATE TYPE](/docs/postgresql/sql-createtype), [DROP CAST](/docs/postgresql/sql-dropcast)
