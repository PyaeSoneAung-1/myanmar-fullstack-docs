---
title: "Operators (operator များ)"
description: "Operator expression ထဲမှာ သုံးမည့် operator ကို ရွေးချယ်သည့် operator type resolution လုပ်ထုံးလုပ်နည်း — pg_operator catalog မှ ရွေးချယ်ခြင်း၊ exact match ရှာခြင်း၊ best match စည်းမျဉ်းများ — ဥပမာများနှင့်တကွ"
order: 69
source: "https://www.postgresql.org/docs/current/typeconv-oper.html"
status: translated
updated: 2026-09-03
---

## 10.2. Operators (operator များ)

Operator expression တစ်ခုက ရည်ညွှန်းတဲ့ တိကျတဲ့ operator ကို အောက်ပါ လုပ်ထုံးလုပ်နည်း (procedure) အတိုင်း ဆုံးဖြတ်ပါတယ်။ ဒီလုပ်ထုံးလုပ်နည်းက ပါဝင်ပတ်သက်တဲ့ operator တွေရဲ့ precedence (ဦးစားပေး အစဉ်) ရဲ့ သွယ်ဝိုက် သက်ရောက်မှုကို ခံရတယ်ဆိုတာ သတိပြုပါ — အကြောင်းကတော့ precedence က ဘယ် sub-expression တွေကို ဘယ် operator ရဲ့ input အဖြစ် ယူမလဲဆိုတာကို ဆုံးဖြတ်ပေးလို့ပါ။ အသေးစိတ်အတွက် [အပိုင်း 4.1.6](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။

**Operator Type Resolution (operator type ဖြေရှင်းခြင်း)**

1. `pg_operator` system catalog ကနေ ထည့်သွင်း စဉ်းစားရမယ့် operator တွေကို ရွေးပါ။ Schema နဲ့ qualify (ရှေ့ဆွဲ) မလုပ်ထားတဲ့ operator နာမည် (ပုံမှန် အသုံးပြုမှု) ကို သုံးထားရင် — ထည့်သွင်း စဉ်းစားတဲ့ operator တွေက နာမည်နဲ့ argument အရေအတွက် ကိုက်ညီပြီး လက်ရှိ search path (ရှာဖွေရေး လမ်းကြောင်း) ထဲမှာ မြင်ရတဲ့ သူတွေ ဖြစ်ပါတယ် (အပိုင်း 5.10.3 ကို ကြည့်ပါ)။ Qualified operator နာမည် ပေးထားရင်တော့ — သတ်မှတ်ထားတဲ့ schema ထဲက operator တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။

  1. Search path ထဲမှာ argument type အတိအကျ တူညီတဲ့ operator အများအပြား တွေ့ရင် — path ထဲမှာ အစောဆုံး ပေါ်တဲ့ တစ်ခုကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။ Argument type မတူညီတဲ့ operator တွေကတော့ — search path ထဲမှာ ဘယ်နေရာမှာ ရှိနေပါစေ — တန်းတူ အဆင့်အနေနဲ့ ထည့်သွင်း စဉ်းစားပါတယ်။

2. Input argument type တွေကို အတိအကျ လက်ခံတဲ့ operator ရှိမရှိ စစ်ဆေးပါ။ ရှိနေရင် (ထည့်သွင်း စဉ်းစားထားတဲ့ operator အစုထဲမှာ exact match က တစ်ခုတည်းပဲ ရှိနိုင်ပါတယ်) — အဲဒါကို သုံးပါ။ Exact match မရှိတာက — မယုံကြည်ရတဲ့ (untrusted) user တွေ object ဖန်တီးခွင့် ရှိတဲ့ schema တစ်ခုထဲမှာ တွေ့ရတဲ့ operator ကို qualified name [9] (ပုံမှန် မဟုတ်တဲ့ အခြေအနေ) နဲ့ ခေါ်တဲ့အခါ — security hazard (လုံခြုံရေး အန္တရာယ်) တစ်ခုကို ဖန်တီးပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — exact match ရအောင် argument တွေကို cast လုပ်ပါ။

  1. Binary operator တစ်ခုရဲ့ argument တစ်ခုက `unknown` type ဖြစ်နေရင် — ဒီစစ်ဆေးမှုအတွက် တခြား argument ရဲ့ type နဲ့ အတူတူပဲလို့ ယူဆပါတယ်။ Unknown input နှစ်ခု ပါတဲ့ invocation (ခေါ်ဆိုမှု) တွေ၊ ဒါမှမဟုတ် unknown input တစ်ခု ပါတဲ့ prefix operator ရဲ့ invocation တွေကတော့ — ဒီအဆင့်မှာ ဘယ်တော့မှ match ရှာတွေ့မှာ မဟုတ်ပါဘူး။
  2. Binary operator တစ်ခုရဲ့ argument တစ်ခုက `unknown` type ဖြစ်ပြီး နောက်တစ်ခုက domain type (base type တစ်ခုပေါ်တွင် constraint များ ထပ်တင်ထားသော type) ဖြစ်နေရင် — နောက်တစ်ဆင့်အနေနဲ့ — domain ရဲ့ base type ကို နှစ်ဖက်စလုံးမှာ အတိအကျ လက်ခံတဲ့ operator ရှိမရှိ စစ်ဆေးပါ; ရှိရင် အဲဒါကို သုံးပါ။

3. အကောင်းဆုံး (best) match ကို ရှာပါ။

  1. Input type တွေ မကိုက်ညီဘဲ — (implicit conversion သုံးပြီး) ကိုက်ညီအောင် ပြောင်းလဲလို့လည်း မရတဲ့ — candidate operator တွေကို ဖယ်ထုတ်ပါ။ ဒီရည်ရွယ်ချက်အတွက် `unknown` literal တွေကို ဘယ်အရာနဲ့မဆို ပြောင်းလဲလို့ရတယ်လို့ ယူဆပါတယ်။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  2. Input argument တစ်ခုခုက domain type ဖြစ်နေရင် — နောက်ဆက်တွဲ အဆင့်တွေ အားလုံးအတွက် domain ရဲ့ base type ဖြစ်နေသလို သဘောထားပါ။ ဒါက ambiguous-operator ဖြေရှင်းမှု ရည်ရွယ်ချက်တွေအတွက် domain တွေက သူတို့ရဲ့ base type တွေလိုပဲ ပြုမူကြောင်း သေချာစေပါတယ်။
  3. Candidate တွေ အားလုံးကို လျှောက်ကြည့်ပြီး — input type တွေပေါ်မှာ exact match အများဆုံး ရှိတဲ့ သူတွေကို သိမ်းထားပါ။ တစ်ယောက်မှ exact match မရှိရင် candidate အားလုံးကို သိမ်းထားပါ။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  4. Candidate တွေ အားလုံးကို လျှောက်ကြည့်ပြီး — type conversion လိုအပ်မယ့် နေရာ အများဆုံးမှာ (input data type ရဲ့ type category ထဲက) preferred type တွေကို လက်ခံတဲ့ သူတွေကို သိမ်းထားပါ။ တစ်ယောက်မှ preferred type ကို လက်မခံရင် candidate အားလုံးကို သိမ်းထားပါ။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  5. Input argument တွေထဲမှာ `unknown` တွေ ရှိနေရင် — ကျန်ရစ်တဲ့ candidate တွေက အဲဒီ argument နေရာတွေမှာ လက်ခံတဲ့ type category တွေကို စစ်ဆေးပါ။ နေရာတစ်ခုစီမှာ — candidate တစ်ယောက်ယောက်က string category ကို လက်ခံရင် အဲဒီ category ကို ရွေးပါ။ (ဒီ string ဘက်ကို ဦးစားပေးတာက သင့်လျော်ပါတယ် — `unknown`-type literal က string တစ်ခုလိုပဲ ပုံရတာမို့ပါ။) မဟုတ်ရင် — ကျန်ရစ်တဲ့ candidate တွေ အားလုံး type category တစ်ခုတည်းကို လက်ခံနေရင် အဲဒီ category ကို ရွေးပါ; မဟုတ်ရင် — နောက်ထပ် သဲလွန်စ (clue) တွေ မရှိဘဲ မှန်ကန်တဲ့ ရွေးချယ်မှုကို ကောက်ချက် ချလို့မရတာမို့ — ရှုံးနိမ့် (fail) ပါ။ အခု — ရွေးထားတဲ့ type category ကို လက်မခံတဲ့ candidate တွေကို ဖယ်ထုတ်ပါ။ ထို့ပြင် — candidate တစ်ယောက်ယောက်က အဲဒီ category ထဲက preferred type တစ်ခုကို လက်ခံရင် — အဲဒီ argument အတွက် non-preferred type တွေကို လက်ခံတဲ့ candidate တွေကိုပါ ဖယ်ထုတ်ပါ။ ဒီစစ်ဆေးမှုတွေကနေ တစ်ယောက်မှ အသက်ရှင် မကျန်ရစ်ရင် candidate အားလုံးကို သိမ်းထားပါ။ Candidate တစ်ခုတည်း ကျန်ရစ်ရင် အဲဒါကို သုံးပါ; မဟုတ်ရင် နောက်အဆင့်ကို ဆက်လုပ်ပါ။
  6. `unknown` နဲ့ သိပြီးသား (known) type argument တွေ နှစ်မျိုးလုံး ရှိနေပြီး — known-type argument တွေ အားလုံးက type တစ်ခုတည်း ဖြစ်နေရင် — `unknown` argument တွေလည်း အဲဒီ type ပဲလို့ ယူဆပြီး — ဘယ် candidate တွေက unknown-argument နေရာတွေမှာ အဲဒီ type ကို လက်ခံနိုင်လဲ စစ်ဆေးပါ။ Candidate တစ်ခုတည်း အတိအကျ ဒီစစ်ဆေးမှုကို ကျော်ဖြတ်ရင် အဲဒါကို သုံးပါ။ မဟုတ်ရင် — ရှုံးနိမ့်ပါ။

ဥပမာ တချို့ကို အောက်မှာ ဖော်ပြလိုက်ပါတယ်။

**ဥပမာ 10.1. Square Root Operator Type Resolution (square root operator type ဖြေရှင်းခြင်း)**

Standard catalog ထဲမှာ square root operator (prefix `|/`) တစ်ခုတည်းပဲ သတ်မှတ်ထားပြီး — အဲဒါက `double precision` type ရဲ့ argument တစ်ခုကို လက်ခံပါတယ်။ ဒီ query expression ထဲမှာ scanner က argument ကို `integer` ဆိုတဲ့ ကနဦး type နဲ့ သတ်မှတ်ပေးပါတယ်:

```sql
SELECT |/ 40 AS "square root of 40";
 square root of 40
-------------------
 6.324555320336759
(1 row)
```

ဒါကြောင့် parser က operand ပေါ်မှာ type conversion လုပ်လိုက်ပြီး — query က အောက်ပါနဲ့ ညီမျှသွားပါတယ်:

```sql
SELECT |/ CAST(40 AS double precision) AS "square root of 40";
```

**ဥပမာ 10.2. String Concatenation Operator Type Resolution (string concatenation operator type ဖြေရှင်းခြင်း)**

String type တွေနဲ့ အလုပ်လုပ်ဖို့ရော — ရှုပ်ထွေးတဲ့ extension type တွေနဲ့ အလုပ်လုပ်ဖို့ရော — string နဲ့ တူတဲ့ syntax ကို သုံးပါတယ်။ Type မသတ်မှတ်ထားတဲ့ string တွေကို ဖြစ်နိုင်ခြေ ရှိတဲ့ operator candidate တွေနဲ့ ကိုက်ညီအောင် လုပ်ပါတယ်။

Type မသတ်မှတ်ထားတဲ့ argument တစ်ခု ပါတဲ့ ဥပမာ တစ်ခုကို ကြည့်ရအောင်:

```sql
SELECT text 'abc' || 'def' AS "text and unknown";

 text and unknown
------------------
 abcdef
(1 row)
```

ဒီကိစ္စမှာ parser က argument နှစ်ခုလုံးအတွက် `text` ကို လက်ခံတဲ့ operator ရှိမရှိ ကြည့်ပါတယ်။ ရှိတာမို့ — ဒုတိယ argument ကို `text` type အဖြစ် အဓိပ္ပာယ် ကောက်ယူသင့်တယ်လို့ ယူဆပါတယ်။

ဒီနေရာမှာ type မသတ်မှတ်ထားတဲ့ တန်ဖိုး နှစ်ခုရဲ့ concatenation တစ်ခု ရှိပါတယ်:

```sql
SELECT 'abc' || 'def' AS "unspecified";

 unspecified
-------------
 abcdef
(1 row)
```

ဒီကိစ္စမှာ — query ထဲမှာ type တစ်ခုမှ သတ်မှတ်မထားတာမို့ — ဘယ် type သုံးရမယ်ဆိုတဲ့ ကနဦး အရိပ်အမြွက် (hint) မရှိပါဘူး။ ဒါကြောင့် parser က candidate operator တွေ အားလုံးကို ရှာကြည့်ပြီး — string-category ရော bit-string-category input တွေကိုပါ လက်ခံတဲ့ candidate တွေ ရှိနေတာ တွေ့ပါတယ်။ String category က ရရှိနိုင်တဲ့အခါ ဦးစားပေးတာမို့ — အဲဒီ category ကို ရွေးလိုက်ပြီး — string တွေအတွက် preferred type ဖြစ်တဲ့ `text` ကို `unknown`-type literal တွေကို ဖြေရှင်းရမယ့် တိကျတဲ့ type အဖြစ် သုံးပါတယ်။

**ဥပမာ 10.3. Absolute-Value and Negation Operator Type Resolution (absolute-value နဲ့ negation operator type ဖြေရှင်းခြင်း)**

PostgreSQL ရဲ့ operator catalog ထဲမှာ prefix operator `@` အတွက် entry အများအပြား ရှိပြီး — အားလုံးက numeric data type အမျိုးမျိုးအတွက် absolute-value (ပကတိ တန်ဖိုး) operation တွေကို အကောင်အထည်ဖော်ပါတယ်။ အဲဒီ entry တွေထဲက တစ်ခုက `float8` type အတွက် ဖြစ်ပြီး — `float8` က numeric category ထဲမှာ preferred type ပါ။ ဒါကြောင့် — `unknown` input တစ်ခုနဲ့ ရင်ဆိုင်ရတဲ့အခါ PostgreSQL က အဲဒီ entry ကို သုံးပါလိမ့်မယ်:

```sql
SELECT @ '-4.5' AS "abs";
 abs
-----
 4.5
(1 row)
```

ဒီနေရာမှာ system က ရွေးလိုက်တဲ့ operator ကို အသုံးမပြုခင် — `unknown`-type literal ကို `float8` type အဖြစ် သွယ်ဝိုက်၍ (implicitly) ဖြေရှင်းလိုက်ပါတယ်။ `float8` ကိုပဲ သုံးတယ်ဆိုတာ — တခြား type တစ်ခုခု မဟုတ်ဘူးဆိုတာ — ဒီလိုမျိုး စစ်ဆေး အတည်ပြုနိုင်ပါတယ်:

```sql
SELECT @ '-4.5e500' AS "abs";

ERROR:  "-4.5e500" is out of range for type double precision
```

တစ်ဖက်မှာလည်း — prefix operator `~` (bitwise negation — bit အလိုက် ပြောင်းပြန် လှန်ခြင်း) က integer data type တွေအတွက်ပဲ သတ်မှတ်ထားပြီး — `float8` အတွက် မဟုတ်ပါဘူး။ ဒါကြောင့် `~` နဲ့ အလားတူ ကိစ္စမျိုး စမ်းကြည့်ရင် — အောက်ပါအတိုင်း ရပါတယ်:

```sql
SELECT ~ '20' AS "negation";

ERROR:  operator is not unique: ~ "unknown"
HINT:  Could not choose a best candidate operator. You might need to add
explicit type casts.
```

ဒါ ဖြစ်ရတာက — ဖြစ်နိုင်တဲ့ `~` operator တွေထဲက ဘယ်ဟာကို ဦးစားပေးသင့်လဲဆိုတာ system က ဆုံးဖြတ်နိုင်လို့ မရလို့ပါ။ Explicit cast (ရှင်းလင်းစွာ သတ်မှတ်သော cast) တစ်ခုနဲ့ ကူညီပေးလို့ ရပါတယ်:

```sql
SELECT ~ CAST('20' AS int8) AS "negation";

 negation
----------
      -21
(1 row)
```

**ဥပမာ 10.4. Array Inclusion Operator Type Resolution (array inclusion operator type ဖြေရှင်းခြင်း)**

ဒီနေရာမှာ — input တစ်ခု သိပြီးသား (known) ဖြစ်ပြီး နောက်တစ်ခု `unknown` ဖြစ်တဲ့ operator တစ်ခုကို ဖြေရှင်းတဲ့ နောက်ထပ် ဥပမာ တစ်ခု ရှိပါတယ်:

```sql
SELECT array[1,2] <@ '{1,2,3}' as "is subset";

 is subset
-----------
 t
(1 row)
```

PostgreSQL ရဲ့ operator catalog ထဲမှာ infix operator `<@` အတွက် entry အများအပြား ရှိပေမယ့် — ဘယ်ဘက် (left-hand side) မှာ integer array တစ်ခုကို လက်ခံနိုင်တာ ဖြစ်နိုင်တဲ့ သူ နှစ်ခုပဲ ရှိပါတယ်: array inclusion (`anyarray` `<@` `anyarray`) နဲ့ range inclusion (`anyelement` `<@` `anyrange`) တို့ပါ။ ဒီ polymorphic pseudo-type တွေ ([အပိုင်း 8.21](/docs/postgresql/datatype-pseudo) ကို ကြည့်ပါ) ထဲက ဘယ်ဟာမှ preferred လို့ သတ်မှတ်မထားတာမို့ — parser က အဲဒီအခြေခံပေါ်မှာ မရှင်းလင်းမှုကို ဖြေရှင်းလို့ မရပါဘူး။ သို့သော် — အဆင့် 3.f အရ — `unknown`-type literal ကို တခြား input ရဲ့ type (ဒီကိစ္စမှာဆိုရင် integer array) အတိုင်းပဲ ယူဆရပါတယ်။ အခု operator နှစ်ခုထဲက တစ်ခုပဲ match လုပ်နိုင်တော့တာမို့ — array inclusion ကို ရွေးချယ်လိုက်ပါတယ်။ (Range inclusion ကို ရွေးချယ်ခဲ့မယ်ဆိုရင် — string က range literal တစ်ခု ဖြစ်ဖို့ လိုအပ်တဲ့ ပုံစံ မှန်ကန်မှု မရှိလို့ — error တစ်ခု ရလိမ့်မယ်။)

**ဥပမာ 10.5. Custom Operator on a Domain Type (domain type ပေါ်မှာ custom operator)**

User တွေက တခါတရံ — domain type တစ်ခုအတွက်ပဲ သက်ရောက်တဲ့ operator တွေကို ကြေညာဖို့ ကြိုးစားတတ်ပါတယ်။ ဒါ ဖြစ်နိုင်ပေမယ့် — operator resolution စည်းမျဉ်းတွေက domain ရဲ့ base type ကို သက်ရောက်တဲ့ operator တွေကို ရွေးချယ်ဖို့ ဒီဇိုင်းလုပ်ထားလို့ — ထင်ရသလောက်တော့ အသုံးမဝင်ပါဘူး။ ဥပမာအနေနဲ့ အောက်ပါတို့ကို သုံးသပ်ကြည့်ပါ:

```sql
CREATE DOMAIN mytext AS text CHECK(...);
CREATE FUNCTION mytext_eq_text (mytext, text) RETURNS boolean AS ...;
CREATE OPERATOR = (procedure=mytext_eq_text, leftarg=mytext, rightarg=text);
CREATE TABLE mytable (val mytext);

SELECT * FROM mytable WHERE val = 'foo';
```

ဒီ query က custom operator ကို သုံးမှာ မဟုတ်ပါဘူး။ Parser က ပထမဆုံး `mytext` `=` `mytext` operator (အဆင့် 2.a) ရှိမရှိ ကြည့်ပါတယ် — မရှိပါဘူး; ပြီးတော့ domain ရဲ့ base type ဖြစ်တဲ့ `text` ကို ထည့်သွင်း စဉ်းစားပြီး — `text` `=` `text` operator (အဆင့် 2.b) ရှိမရှိ ကြည့်ပါတယ် — ရှိပါတယ်; ဒါကြောင့် `unknown`-type literal ကို `text` အဖြစ် ဖြေရှင်းပြီး — `text` `=` `text` operator ကို သုံးပါတယ်။ Custom operator ကို သုံးစေချင်ရင် တစ်ခုတည်းသော နည်းလမ်းက — literal ကို အတိအကျ cast လုပ်ဖို့ပါ:

```sql
SELECT * FROM mytable WHERE val = text 'foo';
```

ဒါဆိုရင် — exact-match စည်းမျဉ်းအရ `mytext` `=` `text` operator ကို ချက်ချင်း တွေ့ပါလိမ့်မယ်။ Best-match စည်းမျဉ်းတွေ ဆီ ရောက်သွားခဲ့ရင်တော့ — အဲဒီစည်းမျဉ်းတွေက domain type ပေါ်က operator တွေကို တက်တက်ကြွကြွ ခွဲခြား ဖယ်ထုတ် (discriminate) ပါတယ်။ အဲဒီလို မခွဲခြားဘူးဆိုရင် — casting စည်းမျဉ်းတွေက domain တစ်ခုကို ၎င်းရဲ့ base type ဆီ cast လုပ်လို့ရသလို base type ကနေ domain ဆီလည်း cast လုပ်လို့ရတယ်လို့ အမြဲတမ်း ယူဆလို့ — အဲဒီ domain operator ကို base type ပေါ်က နာမည်တူ operator တစ်ခုလိုပဲ ကိစ္စတိုင်းမှာ အသုံးပြုနိုင်တယ်လို့ ယူဆခံရမှာ ဖြစ်လို့ — အဲဒီလို operator တစ်ခုက ambiguous-operator failure (မရှင်းလင်းတဲ့ operator အမှားများ) တွေ အများကြီး ဖန်တီးပေးပါလိမ့်မယ်။

---

[9] ဒီအန္တရာယ်က non-schema-qualified နာမည်နဲ့ ခေါ်ရင် မဖြစ်ပေါ်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ — မယုံကြည်ရတဲ့ user တွေ object ဖန်တီးခွင့် ရှိတဲ့ schema တွေ ပါဝင်တဲ့ search path တစ်ခုက [secure schema usage pattern (လုံခြုံသော schema အသုံးပြုမှု ပုံစံ)](/docs/postgresql/ddl-schemas) မဟုတ်လို့ပါ။
