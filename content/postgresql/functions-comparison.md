---
title: "Comparison Functions and Operators (Comparison လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ comparison (နှိုင်းယှဉ်ခြင်း) functions နှင့် operators များ — comparison operator ဇယား၊ BETWEEN နှင့် IS [ NOT ] DISTINCT FROM ကဲ့သို့သော comparison predicates များ၊ null စစ်ဆေးခြင်း နှင့် num_nonnulls / num_nulls ကဲ့သို့သော comparison functions များ"
order: 69
source: "https://www.postgresql.org/docs/current/functions-comparison.html"
status: translated
updated: 2026-09-04
---

## 9.2. Comparison Functions and Operators (Comparison လုပ်ဆောင်ချက်များနှင့် operator များ)

ပုံမှန် comparison operators (နှိုင်းယှဉ်ခြင်း operator များ) တွေကို သုံးနိုင်ပါတယ် — ဇယား 9.1 မှာ ပြထားသလိုပါ။

**ဇယား 9.1. Comparison Operators (နှိုင်းယှဉ်ခြင်း operators များ)**

| Operator | ဖော်ပြချက် |
| --- | --- |
| `datatype` `<` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand ထက် ငယ်နေသလား? |
| `datatype` `>` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand ထက် ကြီးနေသလား? |
| `datatype` `<=` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand ထက် ငယ်သည် သို့မဟုတ် ညီမျှနေသလား? |
| `datatype` `>=` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand ထက် ကြီးသည် သို့မဟုတ် ညီမျှနေသလား? |
| `datatype` `=` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand နဲ့ ညီမျှနေသလား? |
| `datatype` `<>` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand နဲ့ မညီမျှဘူးလား? |
| `datatype` `!=` `datatype` → `boolean` | ဘယ်ဘက် operand က ညာဘက် operand နဲ့ မညီမျှဘူးလား? |

> **မှတ်ချက်:** `<>` က “not equal (မညီမျှခြင်း)” အတွက် standard SQL notation ဖြစ်ပါတယ်။ `!=` ကတော့ alias တစ်ခု ဖြစ်ပြီး — parsing ရဲ့ အစောပိုင်း အဆင့်တစ်ခုမှာတင် `<>` အဖြစ် ပြောင်းလဲ ခံရပါတယ်။ ဒါကြောင့် — မတူညီတဲ့ အလုပ်တွေကို လုပ်ဆောင်တဲ့ `!=` နဲ့ `<>` operators တွေကို implement လုပ်ဖို့ မဖြစ်နိုင်ပါဘူး။

ဒီ comparison operators တွေက — natural ordering (သဘာဝကျသော အစီအစဉ်) ရှိတဲ့ built-in data types တွေ အားလုံးအတွက် ရနိုင်ပါတယ်။ ဒီထဲမှာ numeric, string နဲ့ date/time types တွေ ပါဝင်ပါတယ်။ ဒါ့အပြင် — arrays, composite types နဲ့ ranges တွေကလည်း — သူတို့ရဲ့ component data types တွေ နှိုင်းယှဉ်လို့ ရနိုင်တယ်ဆိုရင် — နှိုင်းယှဉ်လို့ ရပါတယ်။

ဆက်စပ်နေတဲ့ (related) data types တွေရဲ့ values တွေကိုလည်း ယေဘုယျအားဖြင့် နှိုင်းယှဉ်လို့ ရပါတယ်; ဥပမာ — `integer` `>` `bigint` ဆိုတာမျိုး အလုပ်လုပ်ပါတယ်။ ဒီလို ကိစ္စ အချို့ကို “cross-type” comparison operators တွေနဲ့ တိုက်ရိုက် implement လုပ်ထားပါတယ် — ဒါပေမယ့် — အဲဒီလို operator တစ်ခု မရရှိနိုင်ဘူးဆိုရင် — parser က less-general type ကနေ more-general type ဆီသို့ coerce (ပြောင်းလဲ) လုပ်ပြီး — အဲဒီ more-general type ရဲ့ comparison operator ကို အသုံးချပါတယ်။

အထက်မှာ ပြထားသလို — comparison operators တွေ အားလုံးက `boolean` type ရဲ့ values တွေကို ပြန်ပေးတဲ့ binary operators တွေ ဖြစ်ပါတယ်။ ဒါကြောင့် — `1 < 2 < 3` လို expressions တွေက valid မဟုတ်ပါဘူး (ဘာလို့လဲဆိုတော့ — Boolean value တစ်ခုကို `3` နဲ့ နှိုင်းယှဉ်ဖို့ `<` operator မရှိလို့ပါ)။ Range tests တွေ လုပ်ဆောင်ဖို့အတွက် အောက်မှာ ပြထားတဲ့ `BETWEEN` predicates တွေကို သုံးပါ။

ဇယား 9.2 မှာ ပြထားသလို — comparison predicates (နှိုင်းယှဉ်ခြင်း predicate များ) တချို့လည်း ရှိပါသေးတယ်။ ဒါတွေက operators တွေလိုပဲ အပြုအမူ ရှိပေမယ့် — SQL standard က သတ်မှတ်ထားတဲ့ အထူး syntax တွေ ရှိပါတယ်။

**ဇယား 9.2. Comparison Predicates (နှိုင်းယှဉ်ခြင်း predicates များ)**

| Predicate ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| datatype BETWEEN datatype AND datatype → boolean between — range ၏ endpoint (အဆုံးမှတ်) နှစ်ဖက်စလုံး အပါအဝင် ဖြစ်ခြင်း။ 2 BETWEEN 1 AND 3 → t 2 BETWEEN 3 AND 1 → f |
| datatype NOT BETWEEN datatype AND datatype → boolean not between — BETWEEN ၏ ဆန့်ကျင်ဘက် (negation) ဖြစ်ခြင်း။ 2 NOT BETWEEN 1 AND 3 → f |
| datatype BETWEEN SYMMETRIC datatype AND datatype → boolean between — endpoint တန်ဖိုး နှစ်ခုကို အစီအစဉ်တကျ စီပြီးမှ စစ်ဆေးခြင်း။ 2 BETWEEN SYMMETRIC 3 AND 1 → t |
| datatype NOT BETWEEN SYMMETRIC datatype AND datatype → boolean not between — endpoint တန်ဖိုး နှစ်ခုကို အစီအစဉ်တကျ စီပြီးမှ စစ်ဆေးခြင်း။ 2 NOT BETWEEN SYMMETRIC 3 AND 1 → f |
| datatype IS DISTINCT FROM datatype → boolean not equal — null ကို နှိုင်းယှဉ်လို့ ရတဲ့ တန်ဖိုးတစ်ခုအနေနဲ့ သတ်မှတ်ပြီး မညီမျှမှုကို စစ်ဆေးခြင်း။ 1 IS DISTINCT FROM NULL → t (rather than NULL) NULL IS DISTINCT FROM NULL → f (rather than NULL) |
| datatype IS NOT DISTINCT FROM datatype → boolean equal — null ကို နှိုင်းယှဉ်လို့ ရတဲ့ တန်ဖိုးတစ်ခုအနေနဲ့ သတ်မှတ်ပြီး ညီမျှမှုကို စစ်ဆေးခြင်း။ 1 IS NOT DISTINCT FROM NULL → f (rather than NULL) NULL IS NOT DISTINCT FROM NULL → t (rather than NULL) |
| datatype IS NULL → boolean တန်ဖိုးက null ဟုတ်မဟုတ် စစ်ဆေးခြင်း။ 1.5 IS NULL → f |
| datatype IS NOT NULL → boolean တန်ဖိုးက null မဟုတ်ဘူးလား စစ်ဆေးခြင်း။ 'null' IS NOT NULL → t |
| datatype ISNULL → boolean တန်ဖိုးက null ဟုတ်မဟုတ် စစ်ဆေးခြင်း (nonstandard syntax)။ |
| datatype NOTNULL → boolean တန်ဖိုးက null မဟုတ်ခြင်း ရှိမရှိ စစ်ဆေးခြင်း (nonstandard syntax)။ |
| boolean IS TRUE → boolean boolean expression က true ရလဒ် ထွက်မထွက် စစ်ဆေးခြင်း။ true IS TRUE → t NULL::boolean IS TRUE → f (rather than NULL) |
| boolean IS NOT TRUE → boolean boolean expression က false သို့မဟုတ် unknown ရလဒ် ထွက်မထွက် စစ်ဆေးခြင်း။ true IS NOT TRUE → f NULL::boolean IS NOT TRUE → t (rather than NULL) |
| boolean IS FALSE → boolean boolean expression က false ရလဒ် ထွက်မထွက် စစ်ဆေးခြင်း။ true IS FALSE → f NULL::boolean IS FALSE → f (rather than NULL) |
| boolean IS NOT FALSE → boolean boolean expression က true သို့မဟုတ် unknown ရလဒ် ထွက်မထွက် စစ်ဆေးခြင်း။ true IS NOT FALSE → t NULL::boolean IS NOT FALSE → t (rather than NULL) |
| boolean IS UNKNOWN → boolean boolean expression က unknown ရလဒ် ထွက်မထွက် စစ်ဆေးခြင်း။ true IS UNKNOWN → f NULL::boolean IS UNKNOWN → t (rather than NULL) |
| boolean IS NOT UNKNOWN → boolean boolean expression က true သို့မဟုတ် false ရလဒ် ထွက်မထွက် စစ်ဆေးခြင်း။ true IS NOT UNKNOWN → t NULL::boolean IS NOT UNKNOWN → f (rather than NULL) |

`BETWEEN` predicate က range tests တွေကို ရိုးရှင်းအောင် လုပ်ပေးပါတယ်:

```sql
a BETWEEN x AND y
```

အောက်ပါနဲ့ ညီမျှပါတယ်:

```sql
a >= x AND a <= y
```

`BETWEEN` က endpoint တန်ဖိုးတွေကို range ထဲမှာ အပါအဝင် (included) အနေနဲ့ သတ်မှတ်တာ သတိပြုပါ။ `BETWEEN SYMMETRIC` ကတော့ — `AND` ရဲ့ ဘယ်ဘက်မှာ ရှိတဲ့ argument က ညာဘက်မှာ ရှိတဲ့ argument ထက် ငယ်သည် သို့မဟုတ် ညီမျှနေဖို့ မလိုအပ်တာကလွဲရင် — `BETWEEN` နဲ့ အတူတူပါ။ ဒီလို မဟုတ်ဘူးဆိုရင် — arguments နှစ်ခုကို အလိုအလျောက် နေရာချင်း လဲလှယ်လိုက်ပြီး — ဒါကြောင့် empty မဟုတ်တဲ့ range တစ်ခုရှိသည်ဟု အမြဲတမ်း ဆိုလိုခြင်း ဖြစ်ပါတယ်။

`BETWEEN` ရဲ့ ပုံစံကွဲ (variant) တွေ အားလုံးကို သာမန် comparison operators တွေကို အခြေခံပြီး implement လုပ်ထားတာမို့ — နှိုင်းယှဉ်လို့ ရနိုင်တဲ့ data type (များ) အားလုံးအတွက် အလုပ်လုပ်ပါလိမ့်မယ်။

> **မှတ်ချက်:** `BETWEEN` syntax ထဲမှာ `AND` ကို သုံးထားတာက — `AND` ကို logical operator အနေနဲ့ သုံးတာနဲ့ ရှုပ်ထွေးမှု (ambiguity) ဖြစ်စေနိုင်ပါတယ်။ ဒါကို ဖြေရှင်းဖို့အတွက် — `BETWEEN` clause တစ်ခုရဲ့ ဒုတိယ argument အနေနဲ့ — expression types အကန့်အသတ် ရှိတဲ့ အုပ်စုတစ်စုကိုပဲ ခွင့်ပြုထားပါတယ်။ `BETWEEN` ထဲမှာ ပိုရှုပ်ထွေးတဲ့ sub-expression တစ်ခုကို ရေးဖို့ လိုအပ်ရင် — sub-expression ကို parentheses ထဲမှာ ထည့်ပြီး ရေးပါ။

ပုံမှန် comparison operators တွေက — input တစ်ခုခု null ဖြစ်နေရင် — true သို့မဟုတ် false မဟုတ်ဘဲ null (“unknown” ကို ဆိုလိုတဲ့) ကို ထွက်ပေးပါတယ်။ ဥပမာ — `7 = NULL` က null ကို ထွက်ပေးသလို — `7 <> NULL` ကလည်း null ကိုပဲ ထွက်ပေးပါတယ်။ ဒီအပြုအမူ မသင့်လျော်တဲ့အခါ — `IS [ NOT ] DISTINCT FROM` predicates တွေကို သုံးပါ:

```sql
a IS DISTINCT FROM b
a IS NOT DISTINCT FROM b
```

Null မဟုတ်တဲ့ inputs တွေအတွက် — `IS DISTINCT FROM` က `<>` operator နဲ့ အတူတူပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — inputs နှစ်ခုလုံး null ဆိုရင် false ကို ပြန်ပေးပြီး — input တစ်ခုတည်းပဲ null ဆိုရင်တော့ true ကို ပြန်ပေးပါတယ်။ အလားတူပဲ — `IS NOT DISTINCT FROM` က null မဟုတ်တဲ့ inputs တွေအတွက် `=` နဲ့ တူညီပေမယ့် — inputs နှစ်ခုလုံး null ဆိုရင် true ကို ပြန်ပေးပြီး — input တစ်ခုတည်းပဲ null ဆိုရင်တော့ false ကို ပြန်ပေးပါတယ်။ ဒါကြောင့် — ဒီ predicates တွေက null ကို “unknown” တစ်ခုအနေနဲ့ မဟုတ်ဘဲ — သာမန် data value တစ်ခုအနေနဲ့ သဘောထားသလို ထိရောက်စွာ ပြုမူပါတယ်။

တန်ဖိုးတစ်ခုက null ဟုတ်မဟုတ် စစ်ဆေးဖို့အတွက် — အောက်ပါ predicates တွေကို သုံးပါ:

```sql
expression IS NULL
expression IS NOT NULL
```

ဒါမှမဟုတ် — ညီမျှပေမယ့် nonstandard ဖြစ်တဲ့ — အောက်ပါ predicates တွေကို သုံးပါ:

```sql
expression ISNULL
expression NOTNULL
```

`expression = NULL` လို့ မရေးပါနဲ့ — အကြောင်းကတော့ `NULL` က `NULL` နဲ့ “equal to” (ညီမျှသည်) မဟုတ်လို့ပါ။ (Null value က unknown value တစ်ခုကို ကိုယ်စားပြုပြီး — unknown values နှစ်ခု ညီမျှလား ဆိုတာကို မသိနိုင်လို့ပါ။)

> **အကြံပြုချက်:** application တချို့က — `expression` က null value ကို အကဲဖြတ်ပေးတဲ့အခါ — `expression = NULL` က true ကို ပြန်ပေးမယ်လို့ မျှော်လင့်မိနိုင်ပါတယ်။ ဒီလို application တွေကို SQL standard နဲ့ ကိုက်ညီအောင် ပြုပြင်မွမ်းမံဖို့ အထူး အကြံပြုပါတယ်။ ဒါပေမယ့် — အဲဒါ မလုပ်နိုင်ဘူးဆိုရင်တော့ [transform_null_equals](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-TRANSFORM-NULL-EQUALS) configuration variable ကို ရနိုင်ပါတယ်။ အဲဒါကို enable လုပ်ထားရင် — PostgreSQL က `x = NULL` clauses တွေကို `x IS NULL` အဖြစ် ပြောင်းပေးပါလိမ့်မယ်။

`expression` က row-valued (row တန်ဖိုး သဘောရှိသော) ဖြစ်နေရင် — `IS NULL` က — row expression ကိုယ်တိုင် null ဖြစ်နေချိန် သို့မဟုတ် row ရဲ့ fields တွေ အားလုံး null ဖြစ်နေချိန်မှာ true ဖြစ်ပြီး — `IS NOT NULL` ကတော့ — row expression ကိုယ်တိုင် null မဟုတ်ဘဲ row ရဲ့ fields တွေ အားလုံးလည်း null မဟုတ်တဲ့အခါ true ဖြစ်ပါတယ်။ ဒီအပြုအမူကြောင့် — `IS NULL` နဲ့ `IS NOT NULL` တို့က row-valued expressions တွေအတွက် အမြဲတမ်း ပြောင်းပြန် (inverse) ရလဒ်တွေကို ပြန်ပေးတာ မဟုတ်ပါဘူး; အထူးသဖြင့် — null နဲ့ non-null fields တွေ ရောနှော ပါဝင်နေတဲ့ row-valued expression တစ်ခုက test နှစ်ခုလုံးအတွက် false ကို ပြန်ပေးပါလိမ့်မယ်။ ဥပမာ:

```sql
SELECT ROW(1,2.5,'this is a test') = ROW(1, 3, 'not the same');

SELECT ROW(table.*) IS NULL FROM table;  -- detect all-null rows

SELECT ROW(table.*) IS NOT NULL FROM table;  -- detect all-non-null rows

SELECT NOT(ROW(table.*) IS NOT NULL) FROM TABLE; -- detect at least one null in rows
```

ကိစ္စတချို့မှာ — `row` `IS DISTINCT FROM NULL` သို့မဟုတ် `row` `IS NOT DISTINCT FROM NULL` လို့ ရေးတာ ပိုကောင်းနိုင်ပါတယ် — ဒါတွေက row fields တွေကို ထပ်ဆောင်း စစ်ဆေးမှုတွေ မရှိဘဲ — row value တစ်ခုလုံး null ဟုတ်/မဟုတ်ကိုပဲ ရိုးရိုးရှင်းရှင်း စစ်ဆေးပေးပါလိမ့်မယ်။

Boolean values တွေကိုလည်း အောက်ပါ predicates တွေနဲ့ စစ်ဆေးနိုင်ပါတယ်:

```sql
boolean_expression IS TRUE
boolean_expression IS NOT TRUE
boolean_expression IS FALSE
boolean_expression IS NOT FALSE
boolean_expression IS UNKNOWN
boolean_expression IS NOT UNKNOWN
```

ဒါတွေက — operand က null ဖြစ်နေရင်တောင် — null value ကို ဘယ်တော့မှ မပြန်ဘဲ — အမြဲတမ်း true သို့မဟုတ် false ကိုပဲ ပြန်ပေးပါတယ်။ Null input တစ်ခုကို logical value “unknown” အဖြစ် သတ်မှတ်ပါတယ်။ `IS UNKNOWN` နဲ့ `IS NOT UNKNOWN` တို့က — input expression က Boolean type ဖြစ်ရမယ်ဆိုတာကလွဲရင် — `IS NULL` နဲ့ `IS NOT NULL` တို့နဲ့ အသီးသီး ထိရောက်စွာ အတူတူပဲ ဖြစ်တာ သတိပြုပါ။

ဇယား 9.3 မှာ ပြထားသလို — comparison နဲ့ ဆက်စပ်တဲ့ functions တချို့လည်း ရနိုင်ပါသေးတယ်။

**ဇယား 9.3. Comparison Functions (နှိုင်းယှဉ်ခြင်း လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| num_nonnulls ( VARIADIC "any" ) → integer null မဟုတ်တဲ့ arguments အရေအတွက်ကို ပြန်ပေးပါတယ်။ num_nonnulls(1, NULL, 2) → 2 |
| num_nulls ( VARIADIC "any" ) → integer null ဖြစ်နေတဲ့ arguments အရေအတွက်ကို ပြန်ပေးပါတယ်။ num_nulls(1, NULL, 2) → 1 |
