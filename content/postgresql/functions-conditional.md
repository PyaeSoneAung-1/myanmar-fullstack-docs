---
title: "Conditional Expressions (အခြေအနေအလိုက် ရွေးချယ်သည့် expressions)"
description: "PostgreSQL ရှိ SQL-compliant conditional expressions များ — CASE (general နှင့် simple ပုံစံများ), COALESCE, NULLIF, GREATEST/LEAST — အခြေအနေအလိုက် တန်ဖိုး ရွေးချယ်ခြင်းနှင့် null တန်ဖိုးများ ကိုင်တွယ်ခြင်း"
order: 85
source: "https://www.postgresql.org/docs/current/functions-conditional.html"
status: translated
updated: 2026-09-04
---

## 9.18. Conditional Expressions (အခြေအနေအလိုက် ရွေးချယ်သည့် expressions)

- **9.18.1. CASE (အခြေအနေအလိုက် ရွေးချယ်ခြင်း)**
- **9.18.2. COALESCE (null မဟုတ်သော ပထမဆုံး argument ကို ပြန်ပေးခြင်း)**
- **9.18.3. NULLIF (ညီမျှလျှင် null ပြန်ပေးခြင်း)**
- **9.18.4. GREATEST and LEAST (အကြီးဆုံးနှင့် အငယ်ဆုံး ရွေးချယ်ခြင်း)**

ဒီ section က PostgreSQL မှာ ရနိုင်တဲ့ SQL-compliant conditional expressions (အခြေအနေအလိုက် ရွေးချယ်သည့် expressions) တွေကို ဖော်ပြပါတယ်။

> **အကြံပြုချက်:** သင့်ရဲ့ လိုအပ်ချက်တွေက ဒီ conditional expressions တွေရဲ့ စွမ်းဆောင်နိုင်မှုထက် ကျော်လွန်နေရင် — ပိုပြီး ဖော်ပြနိုင်စွမ်း (more expressive) ရှိတဲ့ programming language တစ်ခုနဲ့ server-side function တစ်ခုကို ရေးသားဖို့ စဉ်းစားကြည့်နိုင်ပါတယ်။

> **မှတ်ချက်:** `COALESCE`, `GREATEST` နဲ့ `LEAST` တွေက function တွေနဲ့ syntax အရ ဆင်တူပေမယ့် — သာမန် function တွေ မဟုတ်တဲ့အတွက် — explicit `VARIADIC` array arguments တွေနဲ့တော့ သုံးလို့ မရပါဘူး။

### 9.18.1. `CASE` (အခြေအနေအလိုက် ရွေးချယ်ခြင်း)

SQL ရဲ့ `CASE` expression က — တခြား programming languages တွေထဲက if/else statements တွေနဲ့ ဆင်တူတဲ့ — ယေဘုယျ (generic) conditional expression တစ်ခု ဖြစ်ပါတယ်:

```sql
CASE WHEN condition THEN result
     [WHEN ...]
     [ELSE result]
END
```

`CASE` clauses တွေကို expression တစ်ခု တရားဝင် ဖြစ်တဲ့ နေရာ ဘယ်မှာမဆို သုံးနိုင်ပါတယ်။ `condition` တစ်ခုချင်းစီက `boolean` ရလဒ် ပြန်ပေးတဲ့ expression တစ်ခု ဖြစ်ပါတယ်။ Condition ရဲ့ ရလဒ်က true ဆိုရင် — `CASE` expression ရဲ့ တန်ဖိုးက ဒီ condition နောက်မှာ လိုက်တဲ့ `result` ဖြစ်ပြီး — ကျန် `CASE` expression အပိုင်းတွေကို ဆက်လက် process မလုပ်တော့ပါဘူး။ Condition ရဲ့ ရလဒ်က true မဟုတ်ဘူးဆိုရင် — နောက်ဆက်တွဲ `WHEN` clauses တွေကို အလားတူ နည်းအတိုင်း ဆက်လက် စစ်ဆေးပါတယ်။ `WHEN` `condition` တစ်ခုမှ true မဖြစ်ခဲ့ဘူးဆိုရင် — `CASE` expression ရဲ့ တန်ဖိုးက `ELSE` clause ရဲ့ `result` ဖြစ်ပါတယ်။ `ELSE` clause ကို ချန်လှပ်ထားပြီး condition တစ်ခုမှ true မဖြစ်ဘူးဆိုရင် — ရလဒ်က null ဖြစ်ပါတယ်။

ဥပမာ တစ်ခု:

```sql
SELECT * FROM test;

 a
---
 1
 2
 3

SELECT a,
       CASE WHEN a=1 THEN 'one'
            WHEN a=2 THEN 'two'
            ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

`result` expressions တွေ အားလုံးရဲ့ data types တွေက — တစ်ခုတည်းသော output type တစ်ခုအဖြစ် ပြောင်းလဲနိုင်ရပါမယ်။ အသေးစိတ်အတွက် [အပိုင်း 10.5](/docs/postgresql/typeconv-union-case) ကို ကြည့်ပါ။

အထက်ပါ ယေဘုယျ ပုံစံရဲ့ မူကွဲ (variant) တစ်ခု ဖြစ်တဲ့ — `CASE` expression ရဲ့ “simple” ပုံစံ တစ်ခုလည်း ရှိပါတယ်:

```sql
CASE expression
    WHEN value THEN result
    [WHEN ...]
    [ELSE result]
END
```

ပထမ `expression` ကို တွက်ချက်ပြီး — ၎င်းနဲ့ ညီမျှတဲ့ တစ်ခုကို မတွေ့မချင်း — `WHEN` clauses တွေထဲက `value` expressions တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်သွားပါတယ်။ ကိုက်ညီမှု (match) တစ်ခုမှ မတွေ့ရဘူးဆိုရင် — `ELSE` clause ရဲ့ `result` (သို့မဟုတ် null တန်ဖိုး) ကို ပြန်ပေးပါတယ်။ ဒါက C ထဲက `switch` statement နဲ့ ဆင်တူပါတယ်။

အထက်က ဥပမာကို simple `CASE` syntax သုံးပြီးလည်း ရေးနိုင်ပါတယ်:

```sql
SELECT a,
       CASE a WHEN 1 THEN 'one'
              WHEN 2 THEN 'two'
              ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

`CASE` expression တစ်ခုက — ရလဒ်ကို ဆုံးဖြတ်ဖို့ မလိုအပ်တဲ့ subexpressions တွေကို — ဘယ်တော့မှ evaluate မလုပ်ပါဘူး။ ဥပမာ — ဒါက သုညနဲ့ စားခြင်း (division-by-zero) မအောင်မြင်မှုကို ရှောင်ရှားနိုင်တဲ့ နည်းလမ်း တစ်ခု ဖြစ်ပါတယ်:

```sql
SELECT ... WHERE CASE WHEN x <> 0 THEN y/x > 1.5 ELSE false END;
```

> **မှတ်ချက်:** [အပိုင်း 4.2.14](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားသလို — expression တစ်ခုရဲ့ subexpressions တွေကို မတူညီတဲ့ အချိန်တွေမှာ evaluate လုပ်တဲ့ အခြေအနေ အမျိုးမျိုး ရှိတာကြောင့် — “CASE က လိုအပ်တဲ့ subexpressions တွေကိုပဲ evaluate လုပ်တယ်” ဆိုတဲ့ မူ (principle) က အကြွင်းမဲ့ (ironclad) မဟုတ်ပါဘူး။ ဥပမာ — constant `1/0` subexpression တစ်ခုက run time မှာ ဘယ်တော့မှ ဝင်ရောက်လာမှာ မဟုတ်တဲ့ `CASE` arm တစ်ခုအတွင်းမှာ ရှိနေရင်တောင် — planning အချိန်မှာ division-by-zero မအောင်မြင်မှုကို ဖြစ်စေလေ့ ရှိပါတယ်။

### 9.18.2. `COALESCE` (null မဟုတ်သော ပထမဆုံး argument ကို ပြန်ပေးခြင်း)

```sql
COALESCE(value [, ...])
```

`COALESCE` function က ၎င်းရဲ့ arguments တွေထဲက null မဟုတ်တဲ့ ပထမဆုံး တစ်ခုကို ပြန်ပေးပါတယ်။ Arguments တွေ အားလုံး null ဖြစ်မှသာ null ကို ပြန်ပေးပါတယ်။ Data တွေကို display (ပြသမှု) အတွက် ရယူတဲ့အခါ null တန်ဖိုးတွေအတွက် default တန်ဖိုး တစ်ခုကို အစားထိုးဖို့ မကြာခဏ သုံးပါတယ် — ဥပမာ:

```sql
SELECT COALESCE(description, short_description, '(none)') ...
```

ဒါက `description` က null မဟုတ်ရင် ၎င်းကို ပြန်ပေးပြီး — မဟုတ်ရင် `short_description` က null မဟုတ်ရင် ၎င်းကို ပြန်ပေးကာ — နှစ်ခုလုံး null ဆိုရင် `(none)` ကို ပြန်ပေးပါတယ်။

Arguments တွေ အားလုံးက — ရလဒ်ရဲ့ type ဖြစ်မယ့် — ဘုံ data type တစ်ခုတည်းအဖြစ် ပြောင်းလဲနိုင်ရပါမယ် (အသေးစိတ်အတွက် [အပိုင်း 10.5](/docs/postgresql/typeconv-union-case) ကို ကြည့်ပါ)။

`CASE` expression တစ်ခုလိုပဲ — `COALESCE` ကလည်း ရလဒ်ကို ဆုံးဖြတ်ဖို့ လိုအပ်တဲ့ arguments တွေကိုပဲ evaluate လုပ်ပါတယ်; ဆိုလိုတာက — ပထမ non-null argument ရဲ့ ညာဘက်ခြမ်းက arguments တွေကို evaluate မလုပ်ပါဘူး။ ဒီ SQL-standard function က — တခြား database systems တချို့မှာ သုံးတဲ့ `NVL` နဲ့ `IFNULL` တို့ရဲ့ စွမ်းဆောင်နိုင်မှုနဲ့ ဆင်တူတဲ့ စွမ်းရည်တွေကို ပေးပါတယ်။

### 9.18.3. `NULLIF` (ညီမျှလျှင် null ပြန်ပေးခြင်း)

```sql
NULLIF(value1, value2)
```

`NULLIF` function က `value1` က `value2` နဲ့ ညီမျှနေရင် null တန်ဖိုး တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင် `value1` ကို ပြန်ပေးပါတယ်။ အထက်က `COALESCE` ဥပမာရဲ့ ပြောင်းပြန် (inverse) လုပ်ဆောင်မှုကို လုပ်ဆောင်ဖို့ ဒါကို သုံးနိုင်ပါတယ်:

```sql
SELECT NULLIF(value, '(none)') ...
```

ဒီဥပမာမှာ — `value` က `(none)` ဆိုရင် null ကို ပြန်ပေးပြီး — မဟုတ်ရင် `value` ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

Argument နှစ်ခုလုံးက နှိုင်းယှဉ်လို့ ရတဲ့ (comparable) types တွေ ဖြစ်ရပါမယ်။ အတိအကျ ဆိုရရင် — `value1 = value2` လို့ ရေးထားသလိုပဲ အတိအကျ နှိုင်းယှဉ်တာဖြစ်လို့ — သင့်လျော်တဲ့ `=` operator တစ်ခု ရနိုင်ရပါမယ်။

ရလဒ်က ပထမ argument နဲ့ type အတူတူ ဖြစ်ပါတယ် — ဒါပေမယ့် သိမ်မွေ့တဲ့ အချက် (subtlety) တစ်ခု ရှိပါတယ်။ တကယ် ပြန်ပေးတာက — implied `=` operator ရဲ့ ပထမ argument ဖြစ်ပြီး — တချို့ ကိစ္စတွေမှာ ၎င်းက ဒုတိယ argument ရဲ့ type နဲ့ ကိုက်ညီဖို့ promote (အဆင့်မြှင့်) လုပ်ခံထားရပြီးသား ဖြစ်နိုင်ပါတယ်။ ဥပမာ — `NULLIF(1, 2.2)` က `numeric` ကို ထွက်ပေးပါတယ် — အကြောင်းကတော့ `integer` `=` `numeric` operator မရှိဘဲ — `numeric` `=` `numeric` ပဲ ရှိလို့ပါ။

### 9.18.4. `GREATEST` and `LEAST` (အကြီးဆုံးနှင့် အငယ်ဆုံး ရွေးချယ်ခြင်း)

```sql
GREATEST(value [, ...])
```

```sql
LEAST(value [, ...])
```

`GREATEST` နဲ့ `LEAST` functions တွေက — expressions အရေအတွက် ဘယ်လောက်ပဲ ရှိရှိ စာရင်း တစ်ခုထဲကနေ — အကြီးဆုံး သို့မဟုတ် အငယ်ဆုံး တန်ဖိုးကို ရွေးချယ်ပါတယ်။ Expressions တွေ အားလုံးက — ရလဒ်ရဲ့ type ဖြစ်မယ့် — ဘုံ data type တစ်ခုတည်းအဖြစ် ပြောင်းလဲနိုင်ရပါမယ် (အသေးစိတ်အတွက် [အပိုင်း 10.5](/docs/postgresql/typeconv-union-case) ကို ကြည့်ပါ)။

Argument list ထဲက NULL တန်ဖိုးတွေကို လျစ်လျူရှု (ignore) လုပ်ပါတယ်။ Expressions တွေ အားလုံး NULL အဖြစ် evaluate လုပ်မှသာ ရလဒ်က NULL ဖြစ်ပါလိမ့်မယ်။ (ဒါက SQL standard ကနေ သွေဖည်မှု (deviation) တစ်ခု ဖြစ်ပါတယ်။ Standard အရဆိုရင် — argument တစ်ခုခု NULL ဆိုရင် return တန်ဖိုးက NULL ဖြစ်ရပါတယ်။ တချို့ တခြား database တွေက ဒီလို ပြုမူကြပါတယ်။)
