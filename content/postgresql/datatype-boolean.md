---
title: "Boolean Type (boolean type)"
description: "PostgreSQL ရဲ့ boolean type — true/false state များ, input/output နှင့် SQL keyword TRUE/FALSE/NULL တို့ဖြင့် ရေးသားခြင်း"
order: 53
source: "https://www.postgresql.org/docs/current/datatype-boolean.html"
status: translated
updated: 2026-09-03
---

## 8.6. Boolean Type (boolean type)

PostgreSQL က SQL standard ရဲ့ `boolean` type ကို ပံ့ပိုးပေးပါတယ်; [ဇယား 8.19](/docs/postgresql/datatype-boolean) ကို ကြည့်ပါ။ `boolean` type မှာ state (အခြေအနေ) အများအပြား ရှိနိုင်ပါတယ်: “true” (မှန်), “false” (မှား), ပြီးတော့ “unknown” (မသိ) ဆိုတဲ့ တတိယ state — ၎င်းကို SQL ရဲ့ null value နဲ့ ကိုယ်စားပြုပါတယ်။

**ဇယား 8.19. Boolean Data Type (boolean data type)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် |
| --- | --- | --- |
| `boolean` | 1 byte | true သို့မဟုတ် false ဖြစ်သော state |

Boolean constant (boolean ကိန်းသေ တန်ဖိုး) တွေကို SQL query တွေထဲမှာ SQL key words (SQL သော့ချက် စကားလုံးများ) ဖြစ်တဲ့ `TRUE`, `FALSE` နဲ့ `NULL` တို့နဲ့ ကိုယ်စားပြုလို့ ရပါတယ်။

`boolean` type ရဲ့ datatype input function (datatype ထည့်သွင်းမှု function) က “true” state အတွက် ဒီ string representation (string ပုံစံ ကိုယ်စားပြုမှုများ) တွေကို လက်ခံပါတယ်:

| `true` |
| --- |
| `yes` |
| `on` |
| `1` |

ပြီးတော့ “false” state အတွက် ဒီ representation တွေကို လက်ခံပါတယ်:

| `false` |
| --- |
| `no` |
| `off` |
| `0` |

ဒီ string တွေရဲ့ ထူးခြားတဲ့ (unique) ရှေ့ဆက် (prefix) တွေကိုလည်း လက်ခံပါတယ် — ဥပမာ `t` သို့မဟုတ် `n`။ စာကြောင်းရဲ့ ရှေ့ဆုံး သို့မဟုတ် နောက်ဆုံးမှာ ရှိတဲ့ whitespace (နေရာလပ်) တွေကို လျစ်လျူရှုပြီး — စာလုံးကြီး/အသေး (case) ကွာခြားမှုကိုလည်း အရေးမထားပါဘူး။

`boolean` type ရဲ့ datatype output function (datatype ထုတ်ပေးမှု function) ကတော့ — [ဥပမာ 8.2](/docs/postgresql/datatype-boolean) မှာ ပြထားသလို — `t` သို့မဟုတ် `f` ကိုပဲ အမြဲတမ်း ထုတ်ပေးပါတယ်။

**ဥပမာ 8.2. Using the boolean Type (boolean type ကို အသုံးပြုခြင်း)**

```sql
CREATE TABLE test1 (a boolean, b text);
INSERT INTO test1 VALUES (TRUE, 'sic est');
INSERT INTO test1 VALUES (FALSE, 'non est');
SELECT * FROM test1;
 a |    b
---+---------
 t | sic est
 f | non est

SELECT * FROM test1 WHERE a;
 a |    b
---+---------
 t | sic est
```

`TRUE` နဲ့ `FALSE` key words တွေက SQL query တွေထဲမှာ Boolean constants တွေ ရေးသားဖို့ ဦးစားပေး သုံးလေ့ရှိတဲ့ (SQL-compliant) နည်းလမ်း ဖြစ်ပါတယ်။ ဒါပေမယ့် — [အပိုင်း 4.1.2.7](/docs/postgresql/sql-syntax-lexical) မှာ ဖော်ပြထားတဲ့ ယေဘုယျ string-literal constant syntax (string-literal ကိန်းသေ တန်ဖိုး ရေးသားပုံ) အတိုင်း လိုက်နာပြီး — string representation တွေကိုလည်း သုံးလို့ ရပါတယ် — ဥပမာ `'yes'::boolean`။

Parser က `TRUE` နဲ့ `FALSE` တွေကို `boolean` type ဖြစ်တယ်လို့ အလိုအလျောက် နားလည်ပေမယ့် — `NULL` ကတော့ type မရွေး ဖြစ်နိုင်လို့ — အဲဒီလို မဟုတ်ဘူးဆိုတာ သတိပြုပါ။ ဒါကြောင့် context (နေရာ) အချို့မှာ `NULL` ကို `boolean` အဖြစ် ရှင်းရှင်းလင်းလင်း (explicitly) cast လုပ်ဖို့ လိုအပ်နိုင်ပါတယ် — ဥပမာ `NULL::boolean`။ အပြန်အလှန်အားဖြင့် — parser က literal က `boolean` type ဖြစ်ရမယ်လို့ ကောက်ချက် ချနိုင်တဲ့ context တွေမှာတော့ — string-literal Boolean တန်ဖိုး တစ်ခုကနေ cast ကို ချန်လိုက်လို့လည်း ရပါတယ်။
