---
title: "Calling Functions (function များကို ခေါ်ယူခြင်း)"
description: "Function ခေါ်ရာတွင် positional / named / mixed notation သုံးနည်း — argument များကို အစဉ်လိုက် သို့မဟုတ် နာမည်ဖြင့် သတ်မှတ်ခြင်း၊ default value ရှိသော parameter များ ချန်လိုက်ခြင်း စသည်တို့ကို ဥပမာများဖြင့် ရှင်းပြထားသည်"
order: 21
source: "https://www.postgresql.org/docs/current/sql-syntax-calling-funcs.html"
status: translated
updated: 2026-09-03
---

## 4.3. Calling Functions (function များကို ခေါ်ယူခြင်း)

- **4.3.1. Using Positional Notation (positional notation သုံးပြီး ခေါ်ယူခြင်း)**
- **4.3.2. Using Named Notation (named notation သုံးပြီး ခေါ်ယူခြင်း)**
- **4.3.3. Using Mixed Notation (mixed notation သုံးပြီး ခေါ်ယူခြင်း)**

PostgreSQL က — နာမည်ပေးထားတဲ့ (named) parameter တွေ ပါဝင်တဲ့ function တွေကို *positional notation* (argument များကို နေရာအလိုက် သတ်မှတ်သည့် ပုံစံ) ဒါမှမဟုတ် *named notation* (argument များကို နာမည်ဖြင့် သတ်မှတ်သည့် ပုံစံ) — နှစ်မျိုးလုံးနဲ့ ခေါ်ယူလို့ရပါတယ်။ Named notation က parameter အများကြီး ရှိတဲ့ function တွေအတွက် အထူးသဖြင့် အသုံးဝင်ပါတယ် — အကြောင်းကတော့ ၎င်းက parameter တွေနဲ့ တကယ့် argument တွေကြားက ဆက်စပ်မှုတွေကို ပိုရှင်းလင်းပြီး ပိုစိတ်ချရအောင် လုပ်ပေးလို့ပါ။ Positional notation မှာ — function call တစ်ခုကို function declaration (function ကြေညာချက်) ထဲမှာ သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း — argument တန်ဖိုးတွေနဲ့ ရေးသားပါတယ်။ Named notation မှာတော့ — argument တွေကို function ရဲ့ parameter တွေနဲ့ နာမည်အလိုက် ကိုက်ညီစေပြီး — ဘယ်အစဉ်လိုက်မဆို ရေးနိုင်ပါတယ်။ ဒါ့အပြင် — notation တစ်ခုချင်းစီအတွက် — function argument type တွေရဲ့ သက်ရောက်မှုကိုလည်း ထည့်သွင်း စဉ်းစားပါ။ အဲဒီအကြောင်းကို [အပိုင်း 10.3](https://www.postgresql.org/docs/current/typeconv-func.html) မှာ မှတ်တမ်းတင်ထားပါတယ်။

Notation နှစ်မျိုးလုံးမှာ — function declaration ထဲမှာ default value (ပုံသေတန်ဖိုး) တွေ သတ်မှတ်ပေးထားတဲ့ parameter တွေကို call ထဲမှာ လုံးဝ မရေးဘဲ ထားလို့ရပါတယ်။ ဒါပေမယ့် ဒါက named notation မှာ အထူးသဖြင့် အသုံးဝင်ပါတယ် — အကြောင်းကတော့ parameter တွေရဲ့ ဘယ်ပေါင်းစပ်မှု (combination) ကိုမဆို ချန်လိုက်လို့ရပြီး — positional notation မှာတော့ parameter တွေကို ညာဘက်ကနေ ဘယ်ဘက်ကို အစဉ်လိုက်ပဲ ချန်လိုက်လို့ရလို့ပါ။

PostgreSQL က positional နဲ့ named notation နှစ်ခုလုံးကို ပေါင်းစပ်ထားတဲ့ *mixed notation* (ရောနှောထားသည့် ပုံစံ) ကိုလည်း ထောက်ပံ့ပါတယ်။ ဒီအခြေအနေမှာ — positional parameter တွေကို အရင်ဆုံး ရေးပြီး — named parameter တွေက ၎င်းတို့ နောက်မှာ လိုက်ပါတယ်။

အောက်က ဥပမာတွေက — အောက်ဖော်ပြပါ function definition ကို သုံးပြီး — notation သုံးမျိုးစလုံးရဲ့ အသုံးပြုပုံကို သရုပ်ပြပေးပါလိမ့်မယ်:

```
CREATE FUNCTION concat_lower_or_upper(a text, b text, uppercase boolean DEFAULT false)
RETURNS text
AS
$$
 SELECT CASE
        WHEN $3 THEN UPPER($1 || ' ' || $2)
        ELSE LOWER($1 || ' ' || $2)
        END;
$$
LANGUAGE SQL IMMUTABLE STRICT;
```

`concat_lower_or_upper` function မှာ မဖြစ်မနေ လိုအပ်တဲ့ parameter နှစ်ခု — `a` နဲ့ `b` — ရှိပါတယ်။ ဒါ့အပြင် `false` ကို default အနေနဲ့ ထားတဲ့ — optional parameter (ချန်လိုက်လို့ရတဲ့ parameter) တစ်ခုဖြစ်တဲ့ `uppercase` လည်း ရှိပါသေးတယ်။ `a` နဲ့ `b` input တွေကို ပေါင်းစပ် (concatenate) လုပ်ပြီး — `uppercase` parameter ပေါ် မူတည်ကာ — စာလုံးကြီး (upper case) ဒါမှမဟုတ် စာလုံးသေး (lower case) ဖြစ်အောင် ပြောင်းပေးပါတယ်။ ဒီ function definition ရဲ့ ကျန်တဲ့ အသေးစိတ်တွေက ဒီနေရာမှာ အရေးမကြီးပါဘူး (အသေးစိတ်အတွက် [အခန်း 36](https://www.postgresql.org/docs/current/extend.html) ကို ကြည့်ပါ)။

### 4.3.1. Using Positional Notation (positional notation သုံးပြီး ခေါ်ယူခြင်း)

Positional notation က PostgreSQL မှာ function တွေဆီ argument တွေ ပေးပို့ခြင်းရဲ့ ရိုးရာ ယန္တရား (mechanism) ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT concat_lower_or_upper('Hello', 'World', true);
 concat_lower_or_upper
-----------------------
 HELLO WORLD
(1 row)
```

Argument တွေ အားလုံးကို အစဉ်လိုက် သတ်မှတ်ထားပါတယ်။ `uppercase` ကို `true` အနေနဲ့ သတ်မှတ်ထားလို့ — ရလဒ်က စာလုံးကြီးတွေ ဖြစ်နေပါတယ်။ နောက်ထပ် ဥပမာ တစ်ခုကတော့:

```sql
SELECT concat_lower_or_upper('Hello', 'World');
 concat_lower_or_upper
-----------------------
 hello world
(1 row)
```

ဒီမှာတော့ `uppercase` parameter ကို ချန်လိုက်လို့ — ၎င်းက သူ့ရဲ့ default value ဖြစ်တဲ့ `false` ကို ရရှိပြီး — ရလဒ်က စာလုံးသေးတွေနဲ့ ထွက်ပါတယ်။ Positional notation မှာ — argument တွေမှာ default value ရှိနေသရွေ့ — ၎င်းတို့ကို ညာဘက်ကနေ ဘယ်ဘက်ကို အစဉ်လိုက် ချန်လိုက်လို့ရပါတယ်။

### 4.3.2. Using Named Notation (named notation သုံးပြီး ခေါ်ယူခြင်း)

Named notation မှာ — argument တစ်ခုချင်းစီရဲ့ နာမည်ကို ၎င်းရဲ့ argument expression ကနေ ခွဲခြားဖို့ `=>` ကို သုံးပြီး သတ်မှတ်ပါတယ်။ ဥပမာ:

```sql
SELECT concat_lower_or_upper(a => 'Hello', b => 'World');
 concat_lower_or_upper
-----------------------
 hello world
(1 row)
```

ဒီမှာလည်း `uppercase` argument ကို ချန်လိုက်လို့ — ၎င်းကို `false` အနေနဲ့ သွယ်ဝိုက်အားဖြင့် (implicitly) သတ်မှတ်ခံရပါတယ်။ Named notation ရဲ့ အားသာချက် တစ်ခုက — argument တွေကို ဘယ်အစဉ်လိုက်မဆို သတ်မှတ်နိုင်တာပါ။ ဥပမာ:

```sql
SELECT concat_lower_or_upper(a => 'Hello', b => 'World', uppercase => true);
 concat_lower_or_upper
-----------------------
 HELLO WORLD
(1 row)

SELECT concat_lower_or_upper(a => 'Hello', uppercase => true, b => 'World');
 concat_lower_or_upper
-----------------------
 HELLO WORLD
(1 row)
```

နောက်ကြောင်း ပြန် လိုက်ဖက်မှု (backward compatibility) အတွက် `:=` ကို အခြေခံတဲ့ syntax အဟောင်း တစ်ခုကိုလည်း ထောက်ပံ့ပေးပါတယ်:

```sql
SELECT concat_lower_or_upper(a := 'Hello', uppercase := true, b := 'World');
 concat_lower_or_upper
-----------------------
 HELLO WORLD
(1 row)
```

### 4.3.3. Using Mixed Notation (mixed notation သုံးပြီး ခေါ်ယူခြင်း)

Mixed notation က positional နဲ့ named notation နှစ်ခုလုံးကို ပေါင်းစပ်ပါတယ်။ ဒါပေမယ့် — အထက်မှာ ဖော်ပြခဲ့ပြီးသားအတိုင်း — positional argument တွေရဲ့ ရှေ့မှာ named argument တွေ ထားလို့ မရပါဘူး။ ဥပမာ:

```sql
SELECT concat_lower_or_upper('Hello', 'World', uppercase => true);
 concat_lower_or_upper
-----------------------
 HELLO WORLD
(1 row)
```

အပေါ်က query မှာ — `a` နဲ့ `b` argument တွေကို positional အနေနဲ့ သတ်မှတ်ပြီး — `uppercase` ကိုတော့ နာမည်နဲ့ သတ်မှတ်ထားပါတယ်။ ဒီဥပမာမှာတော့ ဒါက documentation (ရှင်းလင်းဖော်ပြချက်) အနေနဲ့ကလွဲလို့ ဘာမှ ပိုမထည့်ဝင်ပါဘူး။ Default value တွေ ရှိတဲ့ parameter အများကြီး ပါဝင်တဲ့ ပိုရှုပ်ထွေးတဲ့ function တစ်ခုမှာဆိုရင် — named ဒါမှမဟုတ် mixed notation က ရေးသားစရာ ပမာဏ အများကြီးကို သက်သာစေပြီး — အမှားဖြစ်နိုင်ခြေကိုလည်း လျော့ကျစေနိုင်ပါတယ်။

> **မှတ်ချက်:** Named နဲ့ mixed call notation တွေကို လက်ရှိအချိန်မှာ aggregate function တစ်ခုကို ခေါ်ယူတဲ့အခါ သုံးလို့ မရပါဘူး (ဒါပေမယ့် aggregate function ကို window function အနေနဲ့ သုံးတဲ့အခါမှာတော့ အလုပ်လုပ်ပါတယ်)။
