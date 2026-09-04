---
title: "Functions (function များ)"
description: "Function call တစ်ခုက ရည်ညွှန်းတဲ့ function ကို ရွေးချယ်သည့် function type resolution လုပ်ထုံးလုပ်နည်း — pg_proc catalog မှ ရွေးချယ်ခြင်း၊ variadic/default parameter စည်းမျဉ်းများ၊ exact match နှင့် best match ရှာဖွေခြင်း၊ CAST specification သဘောတရား — ဥပမာများနှင့်တကွ"
order: 101
source: "https://www.postgresql.org/docs/current/typeconv-func.html"
status: translated
updated: 2026-09-03
---

## 10.3. Functions (function များ)

Function call တစ်ခုက ရည်ညွှန်းတဲ့ တိကျတဲ့ function ကို အောက်ပါ လုပ်ထုံးလုပ်နည်း (procedure) အတိုင်း ဆုံးဖြတ်ပါတယ်။

**Function Type Resolution (function type ဖြေရှင်းခြင်း)**

1. `pg_proc` system catalog ကနေ ထည့်သွင်း စဉ်းစားရမယ့် function တွေကို ရွေးပါ။ Schema နဲ့ qualify (ရှေ့ဆွဲ) မလုပ်ထားတဲ့ function နာမည် သုံးထားရင် — ထည့်သွင်း စဉ်းစားတဲ့ function တွေက နာမည်နဲ့ argument အရေအတွက် ကိုက်ညီပြီး လက်ရှိ search path (ရှာဖွေရေး လမ်းကြောင်း) ထဲမှာ မြင်ရတဲ့ သူတွေ ဖြစ်ပါတယ် (အပိုင်း 5.10.3 ကို ကြည့်ပါ)။ Qualified function နာမည် ပေးထားရင်တော့ — သတ်မှတ်ထားတဲ့ schema ထဲက function တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။

  1. Search path ထဲမှာ argument type အတိအကျ တူညီတဲ့ function အများအပြား တွေ့ရင် — path ထဲမှာ အစောဆုံး ပေါ်တဲ့ တစ်ခုကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။ Argument type မတူညီတဲ့ function တွေကတော့ — search path ထဲမှာ ဘယ်နေရာမှာ ရှိနေပါစေ — တန်းတူ အဆင့်အနေနဲ့ ထည့်သွင်း စဉ်းစားပါတယ်။
  2. Function တစ်ခုကို VARIADIC array parameter နဲ့ ကြေညာထားပြီး — call က VARIADIC keyword ကို မသုံးဘူးဆိုရင် — ခေါ်ဆိုမှုနဲ့ ကိုက်ညီဖို့ လိုသလို — အဲဒီ array parameter ကို ၎င်းရဲ့ element type ရဲ့ ဖြစ်ပျက်မှု (occurrence) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး နဲ့ အစားထိုးလိုက်သလို သဘောထားပါတယ်။ အဲဒီလို ချဲ့ထွင်ပြီးတဲ့ နောက်မှာ — function ရဲ့ ထိရောက်တဲ့ (effective) argument type တွေက variadic မဟုတ်တဲ့ function တစ်ခုခုရဲ့ နဲ့ အတိအကျ တူညီနေနိုင်ပါတယ်။ အဲဒီကိစ္စမှာ search path ထဲမှာ စောစော ပေါ်တဲ့ function ကို သုံးပါတယ် — ဒါမှမဟုတ် function နှစ်ခုလုံး schema တစ်ခုတည်းထဲမှာ ဆိုရင် — variadic မဟုတ်တဲ့ တစ်ခုကို ဦးစားပေးပါတယ်။
    ဒါက — မယုံကြည်ရတဲ့ (untrusted) user တွေ object ဖန်တီးခွင့် ရှိတဲ့ schema တစ်ခုထဲမှာ တွေ့ရတဲ့ variadic function ကို qualified name [10] နဲ့ ခေါ်တဲ့အခါ — security hazard (လုံခြုံရေး အန္တရာယ်) တစ်ခုကို ဖန်တီးပါတယ်။ မသမာတဲ့ (malicious) user တစ်ယောက်က — သင်ကိုယ်တိုင် execute လုပ်ခဲ့သလိုမျိုး — ကြိုက်ရာ SQL function တွေကို execute လုပ်ပြီး ထိန်းချုပ်မှု ယူနိုင်ပါတယ်။ VARIADIC keyword ပါတဲ့ call တစ်ခုနဲ့ အစားထိုးပါ — အဲဒါက ဒီအန္တရာယ်ကို ကျော်လွှားပေးပါတယ်။ VARIADIC "any" parameter တွေကို ဖြည့်ပေးတဲ့ call တွေမှာ — VARIADIC keyword ပါတဲ့ ညီမျှတဲ့ ပုံစံ (formulation) မရှိတတ်ပါဘူး။ အဲဒီလို call တွေကို ဘေးကင်းစွာ ထုတ်ပြန်နိုင်ဖို့ — function ရဲ့ schema မှာ ယုံကြည်ရတဲ့ (trusted) user တွေပဲ object ဖန်တီးခွင့် ရှိရပါမယ်။
  3. Parameter တွေအတွက် default value ရှိတဲ့ function တွေကို — defaultable parameter နေရာ (position) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ချန်လှပ်ထားတဲ့ ဘယ် call နဲ့မဆို ကိုက်ညီတယ်လို့ သတ်မှတ်ပါတယ်။ အဲဒီလို function တစ်ခုထက်ပိုပြီး call တစ်ခုနဲ့ ကိုက်ညီနေရင် — search path ထဲမှာ အစောဆုံး ပေါ်တဲ့ တစ်ခုကို သုံးပါတယ်။ Default မလုပ်ထားတဲ့ (non-defaulted) နေရာတွေမှာ parameter type အတိအကျ တူညီတဲ့ function နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုပြီး schema တစ်ခုတည်းထဲမှာ ရှိနေရင် (defaultable parameter အစုတွေ မတူညီလို့ ဒါ ဖြစ်နိုင်ပါတယ်) — ဘယ်ဟာကို ဦးစားပေးရမယ်ဆိုတာ system က ဆုံးဖြတ်နိုင်မှာ မဟုတ်ဘဲ — call အတွက် ပိုကောင်းတဲ့ match ရှာမတွေ့ရင် “ambiguous function call” error တစ်ခု ဖြစ်ပေါ်လာပါလိမ့်မယ်။
    ဒါက — မယုံကြည်ရတဲ့ user တွေ object ဖန်တီးခွင့် ရှိတဲ့ schema တစ်ခုထဲမှာ တွေ့ရတဲ့ function ကို qualified name [10] နဲ့ ခေါ်တဲ့အခါ — availability hazard (ရရှိနိုင်မှု အန္တရာယ်) တစ်ခုကို ဖန်တီးပါတယ်။ မသမာတဲ့ user တစ်ယောက်က — ရှိပြီးသား function တစ်ခုရဲ့ နာမည်နဲ့ — အဲဒီ function ရဲ့ parameter တွေကို ပုံတူကူးပြီး — default value တွေ ရှိတဲ့ parameter အသစ်တွေ ထပ်ဖြည့်ထားတဲ့ — function တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ ဒါက မူရင်း function ဆီကို call အသစ်တွေ သွားလို့မရအောင် တားဆီးပါတယ်။ ဒီအန္တရာယ်ကို ကြိုတင် ကာကွယ်ဖို့ — function တွေကို ယုံကြည်ရတဲ့ user တွေပဲ object ဖန်တီးခွင့် ရှိတဲ့ schema တွေထဲမှာ ထားပါ။

2. Input argument type တွေကို အတိအကျ လက်ခံတဲ့ function ရှိမရှိ စစ်ဆေးပါ။ ရှိနေရင် (ထည့်သွင်း စဉ်းစားထားတဲ့ function အစုထဲမှာ exact match က တစ်ခုတည်းပဲ ရှိနိုင်ပါတယ်) — အဲဒါကို သုံးပါ။ Exact match မရှိတာက — မယုံကြည်ရတဲ့ user တွေ object ဖန်တီးခွင့် ရှိတဲ့ schema တစ်ခုထဲမှာ တွေ့ရတဲ့ function ကို qualified name [10] နဲ့ ခေါ်တဲ့အခါ — security hazard တစ်ခုကို ဖန်တီးပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — exact match ရအောင် argument တွေကို cast လုပ်ပါ။ (`unknown` ပါဝင်တဲ့ ကိစ္စတွေက ဒီအဆင့်မှာ ဘယ်တော့မှ match ရှာတွေ့မှာ မဟုတ်ပါဘူး။)

3. Exact match မရှိဘူးဆိုရင် — function call က အထူး type conversion တောင်းဆိုချက် (special type conversion request) တစ်ခုလား ဆိုတာ ကြည့်ပါ။ ဒါက — function call မှာ argument တစ်ခုတည်းပဲ ပါပြီး function နာမည်က data type တစ်ခုခုရဲ့ (internal) နာမည်နဲ့ အတူတူ ဖြစ်ရင် ဖြစ်ပါတယ်။ ထို့ပြင် — function ရဲ့ argument က `unknown`-type literal တစ်ခု ဖြစ်ရမယ်၊ ဒါမှမဟုတ် နာမည်ပေးထားတဲ့ data type ဆီ binary-coercible (binary ပုံစံဖြင့် ပြောင်းလဲနိုင်သော) type တစ်ခု ဖြစ်ရမယ်၊ ဒါမှမဟုတ် အဲဒီ type ရဲ့ I/O function တွေကို အသုံးချပြီး နာမည်ပေးထားတဲ့ data type ဆီ ပြောင်းလဲလို့ရတဲ့ type တစ်ခု ဖြစ်ရမယ် (ဆိုလိုတာက — conversion က standard string type တစ်ခုခုဆီ ဖြစ်စေ၊ standard string type တစ်ခုခုကနေ ဖြစ်စေ ပြောင်းလဲမှု ဖြစ်ရမယ်)။ ဒီအခြေအနေတွေ ပြည့်မီတဲ့အခါ — function call ကို CAST specification ပုံစံတစ်မျိုးအဖြစ် သဘောထားပါတယ်။ [11]

4. အကောင်းဆုံး (best) match ကို ရှာပါ။

  1. Input type တွေ မကိုက်ညီဘဲ — (implicit conversion သုံးပြီး) ကိုက်ညီအောင် ပြောင်းလဲလို့လည်း မရတဲ့ — candidate function တွေကို ဖယ်ထုတ်ပါ။ ဒီရည်ရွယ်ချက်အတွက် `unknown` literal တွေကို ဘယ်အရာနဲ့မဆို ပြောင်းလဲလို့ရတယ်လို့ ယူဆပါတယ်။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  2. Input argument တစ်ခုခုက domain type (base type တစ်ခုပေါ်တွင် constraint များ ထပ်တင်ထားသော type) ဖြစ်နေရင် — နောက်ဆက်တွဲ အဆင့်တွေ အားလုံးအတွက် domain ရဲ့ base type ဖြစ်နေသလို သဘောထားပါ။ ဒါက ambiguous-function ဖြေရှင်းမှု ရည်ရွယ်ချက်တွေအတွက် domain တွေက သူတို့ရဲ့ base type တွေလိုပဲ ပြုမူကြောင်း သေချာစေပါတယ်။
  3. Candidate တွေ အားလုံးကို လျှောက်ကြည့်ပြီး — input type တွေပေါ်မှာ exact match အများဆုံး ရှိတဲ့ သူတွေကို သိမ်းထားပါ။ တစ်ယောက်မှ exact match မရှိရင် candidate အားလုံးကို သိမ်းထားပါ။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  4. Candidate တွေ အားလုံးကို လျှောက်ကြည့်ပြီး — type conversion လိုအပ်မယ့် နေရာ အများဆုံးမှာ (input data type ရဲ့ type category ထဲက) preferred type တွေကို လက်ခံတဲ့ သူတွေကို သိမ်းထားပါ။ တစ်ယောက်မှ preferred type ကို လက်မခံရင် candidate အားလုံးကို သိမ်းထားပါ။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  5. Input argument တွေထဲမှာ `unknown` တွေ ရှိနေရင် — ကျန်ရစ်တဲ့ candidate တွေက အဲဒီ argument နေရာတွေမှာ လက်ခံတဲ့ type category တွေကို စစ်ဆေးပါ။ နေရာတစ်ခုစီမှာ — candidate တစ်ယောက်ယောက်က string category ကို လက်ခံရင် အဲဒီ category ကို ရွေးပါ။ (ဒီ string ဘက်ကို ဦးစားပေးတာက သင့်လျော်ပါတယ် — `unknown`-type literal က string တစ်ခုလိုပဲ ပုံရတာမို့ပါ။) မဟုတ်ရင် — ကျန်ရစ်တဲ့ candidate တွေ အားလုံး type category တစ်ခုတည်းကို လက်ခံနေရင် အဲဒီ category ကို ရွေးပါ; မဟုတ်ရင် — နောက်ထပ် သဲလွန်စ (clue) တွေ မရှိဘဲ မှန်ကန်တဲ့ ရွေးချယ်မှုကို ကောက်ချက် ချလို့မရတာမို့ — ရှုံးနိမ့် (fail) ပါ။ အခု — ရွေးထားတဲ့ type category ကို လက်မခံတဲ့ candidate တွေကို ဖယ်ထုတ်ပါ။ ထို့ပြင် — candidate တစ်ယောက်ယောက်က အဲဒီ category ထဲက preferred type တစ်ခုကို လက်ခံရင် — အဲဒီ argument အတွက် non-preferred type တွေကို လက်ခံတဲ့ candidate တွေကိုပါ ဖယ်ထုတ်ပါ။ ဒီစစ်ဆေးမှုတွေကနေ တစ်ယောက်မှ အသက်ရှင် မကျန်ရစ်ရင် candidate အားလုံးကို သိမ်းထားပါ။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  6. `unknown` နဲ့ သိပြီးသား (known) type argument တွေ နှစ်မျိုးလုံး ရှိနေပြီး — known-type argument တွေ အားလုံးက type တစ်ခုတည်း ဖြစ်နေရင် — `unknown` argument တွေလည်း အဲဒီ type ပဲလို့ ယူဆပြီး — ဘယ် candidate တွေက unknown-argument နေရာတွေမှာ အဲဒီ type ကို လက်ခံနိုင်လဲ စစ်ဆေးပါ။ Candidate တစ်ခုတည်း အတိအကျ ဒီစစ်ဆေးမှုကို ကျော်ဖြတ်ရင် အဲဒါကို သုံးပါ။ မဟုတ်ရင် — ရှုံးနိမ့်ပါ။

သတိပြုရမှာက — “best match” စည်းမျဉ်းတွေက operator ရော function type resolution အတွက်ပါ အတူတူပဲ ဖြစ်ပါတယ်။ ဥပမာ တချို့ကို အောက်မှာ ဖော်ပြလိုက်ပါတယ်။

**ဥပမာ 10.6. Rounding Function Argument Type Resolution (rounding function ရဲ့ argument type ဖြေရှင်းခြင်း)**

Argument နှစ်ခု ယူတဲ့ `round` function တစ်ခုတည်းပဲ ရှိပြီး — အဲဒါက ပထမ argument ကို `numeric` type နဲ့ ဒုတိယ argument ကို `integer` type နဲ့ လက်ခံပါတယ်။ ဒါကြောင့် အောက်ပါ query က `integer` type ဖြစ်တဲ့ ပထမ argument ကို `numeric` အဖြစ် အလိုအလျောက် ပြောင်းလဲပေးပါတယ်:

```sql
SELECT round(4, 4);

 round
--------
 4.0000
(1 row)
```

အဲဒီ query ကို parser က တကယ်တော့ အောက်ပါအတိုင်း ပြောင်းလဲပါတယ်:

```sql
SELECT round(CAST (4 AS numeric), 4);
```

Decimal point (ဒသမ ကိန်းစက်) ပါတဲ့ numeric constant တွေကို ကနဦးမှာ `numeric` type နဲ့ သတ်မှတ်တာမို့ — အောက်ပါ query က type conversion မလိုအပ်ဘဲ — ဒါကြောင့် နည်းနည်း ပိုထိရောက် (efficient) နိုင်ပါတယ်:

```sql
SELECT round(4.0, 4);
```

**ဥပမာ 10.7. Variadic Function Resolution (variadic function ဖြေရှင်းခြင်း)**

```sql
CREATE FUNCTION public.variadic_example(VARIADIC numeric[]) RETURNS int
  LANGUAGE sql AS 'SELECT 1';
CREATE FUNCTION
```

ဒီ function က VARIADIC keyword ကို လက်ခံပေမယ့် — မဖြစ်မနေ မလိုအပ်ပါဘူး။ Integer ရော numeric argument တွေကိုပါ သည်းခံနိုင်ပါတယ်:

```sql
SELECT public.variadic_example(0),
       public.variadic_example(0.0),
       public.variadic_example(VARIADIC array[0.0]);
 variadic_example | variadic_example | variadic_example
------------------+------------------+------------------
                1 |                1 |                1
(1 row)
```

သို့သော် — ပထမ နဲ့ ဒုတိယ call တွေက — ရရှိနိုင်မယ်ဆိုရင် — ပိုပြီး တိကျတဲ့ (specific) function တွေကို ဦးစားပေးပါလိမ့်မယ်:

```sql
CREATE FUNCTION public.variadic_example(numeric) RETURNS int
  LANGUAGE sql AS 'SELECT 2';
CREATE FUNCTION

CREATE FUNCTION public.variadic_example(int) RETURNS int
  LANGUAGE sql AS 'SELECT 3';
CREATE FUNCTION

SELECT public.variadic_example(0),
       public.variadic_example(0.0),
       public.variadic_example(VARIADIC array[0.0]);
 variadic_example | variadic_example | variadic_example
------------------+------------------+------------------
                3 |                2 |                1
(1 row)
```

Default configuration နဲ့ function ပထမတစ်ခုတည်းပဲ ရှိနေတဲ့အခါ — ပထမ နဲ့ ဒုတိယ call တွေက လုံခြုံမှု မရှိပါဘူး။ ဘယ် user မဆို — ဒုတိယ ဒါမှမဟုတ် တတိယ function ကို ဖန်တီးပြီး အဲဒီ call တွေကို ကြားဖြတ် (intercept) လုပ်နိုင်ပါတယ်။ Argument type ကို အတိအကျ ကိုက်ညီအောင် လုပ်ပြီး `VARIADIC` keyword ကို သုံးထားလို့ — တတိယ call ကတော့ လုံခြုံပါတယ်။

**ဥပမာ 10.8. Substring Function Type Resolution (substring function type ဖြေရှင်းခြင်း)**

`substr` function အများအပြား ရှိပြီး — အဲဒီထဲက တစ်ခုက `text` နဲ့ `integer` type တွေကို လက်ခံပါတယ်။ Type မသတ်မှတ်ထားတဲ့ string constant တစ်ခုနဲ့ ခေါ်လိုက်ရင် — system က preferred category ဖြစ်တဲ့ `string` (အတိအကျဆိုရင် `text` type) ရဲ့ argument တစ်ခုကို လက်ခံတဲ့ candidate function ကို ရွေးပါတယ်။

```sql
SELECT substr('1234', 3);

 substr
--------
     34
(1 row)
```

String ကို — table တစ်ခုကနေ လာတာမျိုးလို — `varchar` type လို့ ကြေညာထားရင် — parser က အဲဒါကို `text` အဖြစ် ပြောင်းလဲဖို့ ကြိုးစားပါလိမ့်မယ်:

```sql
SELECT substr(varchar '1234', 3);

 substr
--------
     34
(1 row)
```

ဒါကို parser က ထိရောက်စွာ အောက်ပါအတိုင်း ပြောင်းလဲပါတယ်:

```sql
SELECT substr(CAST (varchar '1234' AS text), 3);
```

> **မှတ်ချက်:** Parser က `pg_cast` catalog ကနေ — `text` နဲ့ `varchar` က binary-compatible (binary ပုံစံနှင့် သဟဇာတ ဖြစ်သော) တယ်ဆိုတာ သိပါတယ် — ဆိုလိုတာက — physical conversion (ရုပ်ပိုင်း ပြောင်းလဲမှု) တစ်စုံတစ်ရာ မလုပ်ဘဲ — တစ်ခုကို နောက်တစ်ခုကို လက်ခံတဲ့ function ဆီ ပို့လို့ရတယ်ဆိုတာပါ။ ဒါကြောင့် ဒီကိစ္စမှာ type conversion call တစ်ခုကို တကယ်တော့ ထည့်မသွင်းပါဘူး။

ပြီးတော့ — function ကို `integer` type argument တစ်ခုနဲ့ ခေါ်လိုက်ရင် — parser က အဲဒါကို `text` အဖြစ် ပြောင်းလဲဖို့ ကြိုးစားပါလိမ့်မယ်:

```sql
SELECT substr(1234, 3);
ERROR:  function substr(integer, integer) does not exist
HINT:  No function matches the given name and argument types. You might need
to add explicit type casts.
```

ဒါ အလုပ်မဖြစ်ပါဘူး — ဘာလို့လဲဆိုတော့ `integer` က `text` ဆီ implicit cast (သွယ်ဝိုက် cast) မရှိလို့ပါ။ Explicit cast တစ်ခုကတော့ အလုပ်ဖြစ်ပါလိမ့်မယ်:

```sql
SELECT substr(CAST (1234 AS text), 3);

 substr
--------
     34
(1 row)
```

---

[10] ဒီအန္တရာယ်က non-schema-qualified နာမည်နဲ့ ခေါ်ရင် မဖြစ်ပေါ်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ — မယုံကြည်ရတဲ့ user တွေ object ဖန်တီးခွင့် ရှိတဲ့ schema တွေ ပါဝင်တဲ့ search path တစ်ခုက [secure schema usage pattern (လုံခြုံသော schema အသုံးပြုမှု ပုံစံ)](/docs/postgresql/ddl-schemas) မဟုတ်လို့ပါ။

[11] ဒီအဆင့် ထည့်သွင်းထားရတဲ့ အကြောင်းရင်းက — တကယ့် cast function တစ်ခု မရှိတဲ့ ကိစ္စတွေမှာ function-style cast specification (function ပုံစံ cast သတ်မှတ်ချက်) တွေကို ထောက်ပံ့ဖို့ ဖြစ်ပါတယ်။ Cast function တစ်ခု ရှိရင် — ၎င်းကို သမားရိုးကျ (convention) အားဖြင့် ၎င်းရဲ့ output type ရဲ့ နာမည်နဲ့ ခေါ်ဝေါ်လေ့ ရှိလို့ — special case (အထူး ကိစ္စ) တစ်ခု လိုအပ်မှု မရှိပါဘူး။ ထပ်ဆင့် ရှင်းလင်းချက်အတွက် [CREATE CAST](https://www.postgresql.org/docs/current/sql-createcast.html) ကို ကြည့်ပါ။
