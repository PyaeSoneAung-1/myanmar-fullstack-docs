---
title: "Arrays (array များ)"
description: "Array type (array data type) အကြောင်း — array type ကြေညာခြင်း၊ array တန်ဖိုး input/output လုပ်ခြင်း၊ subscript/slice ဖြင့် element များကို ဝင်ရောက်ခြင်း၊ array ပြုပြင်ခြင်း၊ ရှာဖွေခြင်းနှင့် array operator/function များ"
order: 62
source: "https://www.postgresql.org/docs/current/arrays.html"
status: translated
updated: 2026-09-03
---

## 8.15. Arrays (array များ)

- **8.15.1. Declaration of Array Types (array type ကြေညာခြင်း)**
- **8.15.2. Array Value Input (array တန်ဖိုး ထည့်သွင်းခြင်း)**
- **8.15.3. Accessing Arrays (array များကို ဝင်ရောက်ကြည့်ရှုခြင်း)**
- **8.15.4. Modifying Arrays (array များကို ပြုပြင်ခြင်း)**
- **8.15.5. Searching in Arrays (array များတွင် ရှာဖွေခြင်း)**
- **8.15.6. Array Input and Output Syntax (array input/output syntax)**

PostgreSQL က table တစ်ခုရဲ့ column တွေကို variable-length (အလျား ပြောင်းလဲနိုင်သော) multidimensional array (အတိုင်းအတာ မျိုးစုံရှိသော array) များအဖြစ် သတ်မှတ်ခွင့် ပြုပါတယ်။ Built-in (ကြိုတင် သတ်မှတ်ပြီးသား) သို့မဟုတ် user-defined (အသုံးပြုသူ သတ်မှတ်ထားသော) base type, enum type, composite type, range type သို့မဟုတ် domain တစ်ခုခုရဲ့ array တွေကိုလည်း ဖန်တီးနိုင်ပါတယ်။

### 8.15.1. Declaration of Array Types (array type ကြေညာခြင်း)

Array type တွေရဲ့ အသုံးပြုပုံကို သရုပ်ပြဖို့ — ဒီ table ကို ဖန်တီးကြည့်ရအောင်:

```sql
CREATE TABLE sal_emp (
    name            text,
    pay_by_quarter  integer[],
    schedule        text[][]
);
```
အထက်မှာ မြင်ရတဲ့အတိုင်း — array data type တစ်ခုကို array element တွေရဲ့ data type နာမည်ရဲ့ နောက်မှာ square bracket (`[]`) တွေ ဆက်ထည့်ပြီး နာမည်ပေးပါတယ်။ အထက်က command က `sal_emp` ဆိုတဲ့ table တစ်ခုကို ဖန်တီးပေးပါလိမ့်မယ် — အဲဒီ table မှာ `text` type ရှိတဲ့ column တစ်ခု (`name`), employee ရဲ့ သုံးလတစ်ကြိမ် (quarter) လစာကို ကိုယ်စားပြုတဲ့ `integer` type ရဲ့ one-dimensional array (`pay_by_quarter`), ပြီးတော့ employee ရဲ့ အပတ်စဉ် အချိန်ဇယားကို ကိုယ်စားပြုတဲ့ `text` ရဲ့ two-dimensional array (`schedule`) တို့ ပါဝင်ပါတယ်။

`CREATE TABLE` ရဲ့ syntax က array တွေရဲ့ တိကျတဲ့ အရွယ်အစားကို သတ်မှတ်ခွင့် ပြုပါတယ်။ ဥပမာ:

```sql
CREATE TABLE tictactoe (
    squares   integer[3][3]
);
```
ဒါပေမယ့် — လက်ရှိ implementation က ပေးထားတဲ့ array size ကန့်သတ်ချက်တွေကို လျစ်လျူရှုပါတယ် — ဆိုလိုတာက အလျား အတိအကျ သတ်မှတ်မထားတဲ့ array တွေနဲ့ အပြုအမူ အတူတူပါပဲ။

လက်ရှိ implementation က ကြေညာထားတဲ့ dimension အရေအတွက်ကိုလည်း ပြဋ္ဌာန်း (enforce) မလုပ်ပါဘူး။ Element type တစ်ခုတည်းရဲ့ array တွေ အားလုံးကို — အရွယ်အစား ဒါမှမဟုတ် dimension အရေအတွက် ဘယ်လိုပဲ ကွဲကွဲ — type တစ်မျိုးတည်းပဲ လို့ သတ်မှတ်ပါတယ်။ ဒါကြောင့် `CREATE TABLE` ထဲမှာ array ရဲ့ အရွယ်အစား သို့မဟုတ် dimension အရေအတွက်ကို ကြေညာတာက documentation (မှတ်တမ်း) သက်သက်ပါ — run-time အပြုအမူကို သက်ရောက်မှု မရှိပါဘူး။

SQL standard နဲ့ ကိုက်ညီတဲ့ `ARRAY` key word ကို သုံးတဲ့ — အခြားရွေးချယ်စရာ syntax တစ်ခုကိုလည်း one-dimensional array တွေအတွက် သုံးနိုင်ပါတယ်။ `pay_by_quarter` ကို ဒီလိုလည်း သတ်မှတ်နိုင်ပါတယ်:

```sql
    pay_by_quarter  integer ARRAY[4],
```
ဒါမှမဟုတ် — array size ကို သတ်မှတ်စရာ မလိုဘူးဆိုရင်:

```sql
    pay_by_quarter  integer ARRAY,
```
ဒါပေမယ့် အရင်ကလိုပဲ — PostgreSQL က ဘယ်အခြေအနေမှာမဆို size ကန့်သတ်ချက်ကို ပြဋ္ဌာန်းမှာ မဟုတ်ပါဘူး။

### 8.15.2. Array Value Input (array တန်ဖိုး ထည့်သွင်းခြင်း)

Array value တစ်ခုကို literal constant (စာသားအတိုင်း ကိန်းသေတန်ဖိုး) အနေနဲ့ ရေးဖို့ — element value တွေကို curly brace တွေအတွင်းမှာ ထည့်ပြီး — comma တွေနဲ့ ခြားပါ။ (C language ကို သိရင် — ဒါက structure တွေ initialize (ကနဦး တန်ဖိုး သတ်မှတ်) လုပ်တဲ့ C syntax နဲ့ သိပ်မကွာပါဘူး။) Element value တိုင်းကို double quote တွေနဲ့ ဝန်းရံလို့ ရပြီး — ၎င်းထဲမှာ comma သို့မဟုတ် curly brace ပါဝင်နေရင်တော့ မဖြစ်မနေ ဝန်းရံပေးရပါမယ်။ (အသေးစိတ်ကို အောက်မှာ ဖော်ပြပါမယ်။) ဒါကြောင့် array constant တစ်ခုရဲ့ ယေဘုယျ ပုံစံကတော့ အောက်ပါအတိုင်းပါ:

```sql
'{ val1 delim val2 delim ... }'
```
ဒီမှာ `delim` က — ၎င်းရဲ့ `pg_type` entry ထဲမှာ မှတ်တမ်းတင်ထားတဲ့အတိုင်း — type အလိုက် delimiter character (ခြားပေးသော စာလုံး) ဖြစ်ပါတယ်။ PostgreSQL distribution ထဲမှာ ပါဝင်တဲ့ standard data type တွေအနက် — `box` type က semicolon (`;`) သုံးတာကလွဲလို့ — အားလုံးက comma (`,`) ကို သုံးပါတယ်။ `val` တစ်ခုချင်းစီက array element type ရဲ့ constant တစ်ခု သို့မဟုတ် subarray (အတွင်းပိုင်း array) တစ်ခု ဖြစ်ပါတယ်။ Array constant တစ်ခုရဲ့ ဥပမာက:

```sql
'{{1,2,3},{4,5,6},{7,8,9}}'
```
ဒီ constant က integer subarray သုံးခု ပါဝင်တဲ့ — two-dimensional (အတိုင်းအတာ နှစ်ခု)၊ 3-by-3 array တစ်ခု ဖြစ်ပါတယ်။

Array constant တစ်ခုရဲ့ element တစ်ခုကို NULL ဖြစ်စေချင်ရင် — element value နေရာမှာ `NULL` လို့ ရေးပါ။ (`NULL` ရဲ့ စာလုံးကြီး သို့မဟုတ် စာလုံးသေး ဘယ်ပုံစံမဆို ရပါတယ်။) တကယ့် string တန်ဖိုး “NULL” ကို လိုချင်ရင်တော့ — ၎င်းကို double quote တွေနဲ့ ဝန်းရံပေးရပါမယ်။

(ဒီလို array constant တွေက တကယ်တော့ [အပိုင်း 4.1.2.7](/docs/postgresql/sql-syntax-lexical) မှာ ဆွေးနွေးထားတဲ့ generic type constant (ယေဘုယျ type ကိန်းသေတန်ဖိုး) တွေရဲ့ အထူးကိစ္စ (special case) တစ်ခုပဲ ဖြစ်ပါတယ်။ Constant ကို အစပိုင်းမှာ string တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး — array input conversion routine (ပြောင်းလဲခြင်း လုပ်ရိုးလုပ်စဉ်) ဆီ ပို့ပါတယ်။ Explicit type specification (ရှင်းရှင်းလင်းလင်း type သတ်မှတ်ချက်) တစ်ခု လိုအပ်နိုင်ပါတယ်။)

အခု `INSERT` statement တချို့ကို ပြလို့ ရပါပြီ:

```sql
INSERT INTO sal_emp
    VALUES ('Bill',
    '{10000, 10000, 10000, 10000}',
    '{{"meeting", "lunch"}, {"training", "presentation"}}');

INSERT INTO sal_emp
    VALUES ('Carol',
    '{20000, 25000, 25000, 25000}',
    '{{"breakfast", "consulting"}, {"meeting", "lunch"}}');
```
အထက်က insert နှစ်ခုရဲ့ ရလဒ်က ဒီလိုပါ:

```sql
SELECT * FROM sal_emp;
 name  |      pay_by_quarter       |                 schedule
-------+---------------------------+-------------------------------------------
 Bill  | {10000,10000,10000,10000} | {{meeting,lunch},{training,presentation}}
 Carol | {20000,25000,25000,25000} | {{breakfast,consulting},{meeting,lunch}}
(2 rows)
```
Multidimensional array တွေမှာ dimension တစ်ခုချင်းစီအတွက် extent (အကျယ်အဝန်း) တွေ ကိုက်ညီနေရပါမယ်။ မကိုက်ညီရင် error ဖြစ်ပါတယ်။ ဥပမာ:

```sql
INSERT INTO sal_emp
    VALUES ('Bill',
    '{10000, 10000, 10000, 10000}',
    '{{"meeting", "lunch"}, {"meeting"}}');
ERROR:  malformed array literal: "{{"meeting", "lunch"}, {"meeting"}}"
DETAIL:  Multidimensional arrays must have sub-arrays with matching dimensions.
```
`ARRAY` constructor syntax ကိုလည်း သုံးနိုင်ပါတယ်:

```sql
INSERT INTO sal_emp
    VALUES ('Bill',
    ARRAY[10000, 10000, 10000, 10000],
    ARRAY[['meeting', 'lunch'], ['training', 'presentation']]);

INSERT INTO sal_emp
    VALUES ('Carol',
    ARRAY[20000, 25000, 25000, 25000],
    ARRAY[['breakfast', 'consulting'], ['meeting', 'lunch']]);
```
Array element တွေက သာမန် SQL constant တွေ သို့မဟုတ် expression တွေ ဖြစ်တာကို သတိပြုပါ — ဥပမာ — array literal မှာဆိုရင် double quote တွေနဲ့ ရေးရမှာ ဖြစ်ပေမယ့် — ဒီနေရာမှာ string literal တွေက single quote တွေနဲ့ ရေးထားပါတယ်။ `ARRAY` constructor syntax အကြောင်း အသေးစိတ်ကို [အပိုင်း 4.2.12](/docs/postgresql/sql-expressions) မှာ ဆွေးနွေးထားပါတယ်။

### 8.15.3. Accessing Arrays (array များကို ဝင်ရောက်ကြည့်ရှုခြင်း)

အခု ဒီ table ပေါ်မှာ query တချို့ လုပ်ကြည့်လို့ ရပါပြီ။ အရင်ဆုံး — array တစ်ခုရဲ့ element တစ်ခုတည်းကို ဘယ်လို ဝင်ရောက်ကြည့်ရှုရလဲ ပြပါမယ်။ ဒီ query က ဒုတိယ quarter မှာ လစာ ပြောင်းလဲသွားတဲ့ employee တွေရဲ့ နာမည်တွေကို ထုတ်ယူပါတယ်:

```sql
SELECT name FROM sal_emp WHERE pay_by_quarter[1] <> pay_by_quarter[2];

 name
-------
 Carol
(1 row)
```
Array ရဲ့ subscript (အညွှန်းကိန်း) နံပါတ်တွေကို square bracket တွေအတွင်းမှာ ရေးပါတယ်။ ပုံမှန်အားဖြင့် PostgreSQL က array တွေအတွက် one-based numbering (1 ကနေ စတင်သော ရေတွက်စနစ်) ကို သုံးပါတယ် — ဆိုလိုတာက element `n` ခု ပါတဲ့ array တစ်ခုက `array[1]` ကနေ စပြီး `array[n]` မှာ ဆုံးပါတယ်။

ဒီ query က employee တွေ အားလုံးရဲ့ တတိယ quarter လစာကို ထုတ်ယူပါတယ်:

```sql
SELECT pay_by_quarter[3] FROM sal_emp;

 pay_by_quarter
----------------
          10000
          25000
(2 rows)
```
Array တစ်ခုရဲ့ ထင်သလို ရွေးချယ်ထားတဲ့ စတုဂံပုံ (rectangular) အပိုင်းအစတွေ (slice) သို့မဟုတ် subarray တွေကိုလည်း ဝင်ရောက်ကြည့်ရှုလို့ ရပါတယ်။ Array slice တစ်ခုကို — array dimension တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုအတွက် — `lower-bound:upper-bound` (အောက်-အပေါ် နယ်နိမိတ်) လို့ ရေးပြီး ဖော်ပြပါတယ်။ ဥပမာ — ဒီ query က Bill ရဲ့ အချိန်ဇယားထဲက — အပတ်ရဲ့ ပထမ နှစ်ရက်အတွက် — ပထမဆုံး item တွေကို ထုတ်ယူပါတယ်:

```sql
SELECT schedule[1:2][1:1] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{meeting},{training}}
(1 row)
```
Dimension တစ်ခုခုကို slice အနေနဲ့ ရေးထားရင် — ဆိုလိုတာက colon ပါဝင်နေရင် — dimension တွေ အားလုံးကို slice တွေအဖြစ် သတ်မှတ်ပါတယ်။ နံပါတ်တစ်ခုတည်းပဲ ပါတဲ့ (colon မပါတဲ့) dimension တစ်ခုခုကိုတော့ — 1 ကနေ သတ်မှတ်ထားတဲ့ နံပါတ်အထိ အနေနဲ့ သတ်မှတ်ပါတယ်။ ဥပမာ — ဒီဥပမာမှာ မြင်ရတဲ့အတိုင်း `[2]` ကို `[1:2]` အနေနဲ့ သတ်မှတ်ပါတယ်:

```sql
SELECT schedule[1:2][2] FROM sal_emp WHERE name = 'Bill';

                 schedule
-------------------------------------------
 {{meeting,lunch},{training,presentation}}
(1 row)
```
Slice မဟုတ်တဲ့ ကိစ္စနဲ့ ရှုပ်ထွေးမှု မဖြစ်အောင် — dimension တွေ အားလုံးအတွက် slice syntax ကို သုံးတာ အကောင်းဆုံးပါ — ဥပမာ `[2][1:1]` မဟုတ်ဘဲ `[1:2][1:1]` လို့ ရေးပါ။

Slice specifier တစ်ခုရဲ့ `lower-bound` နဲ့/သို့မဟုတ် `upper-bound` ကို ချန်လိုက်လို့လည်း ရပါတယ်; ချန်လိုက်တဲ့ bound ကို array ရဲ့ subscript တွေရဲ့ အနိမ့်ဆုံး သို့မဟုတ် အမြင့်ဆုံး နယ်နိမိတ်နဲ့ အစားထိုးပါတယ်။ ဥပမာ:

```sql
SELECT schedule[:2][2:] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{lunch},{presentation}}
(1 row)

SELECT schedule[:][1:1] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{meeting},{training}}
(1 row)
```
Array subscript expression တစ်ခုက — array ကိုယ်တိုင် သို့မဟုတ် subscript expression တွေထဲက တစ်ခုခု null ဖြစ်နေရင် — null ကို ပြန်ပေးပါတယ်။ ပြီးတော့ — subscript တစ်ခုက array ရဲ့ နယ်နိမိတ် (bounds) အပြင်ဘက် ရောက်နေရင်လည်း null ကို ပြန်ပေးပါတယ် (ဒီကိစ္စမှာ error မတက်ပါဘူး)။ ဥပမာ — `schedule` မှာ လောလောဆယ် `[1:3][1:2]` ဆိုတဲ့ dimension တွေ ရှိနေရင် — `schedule[3][3]` လို့ ရည်ညွှန်းတာက NULL ကို ထွက်စေပါတယ်။ အလားတူပဲ — subscript အရေအတွက် မှားယွင်းနေတဲ့ array reference တစ်ခုကလည်း error အစား null ကို ထွက်စေပါတယ်။

Array slice expression တစ်ခုကလည်း — array ကိုယ်တိုင် သို့မဟုတ် subscript expression တွေထဲက တစ်ခုခု null ဖြစ်နေရင် — null ကို ထွက်စေပါတယ်။ ဒါပေမယ့် — လက်ရှိ array ရဲ့ နယ်နိမိတ် အပြင်ဘက်ကို လုံးဝ ကျော်လွန်တဲ့ array slice တစ်ခုကို ရွေးချယ်တာလိုမျိုး — တခြား အခြေအနေတွေမှာတော့ slice expression က null အစား empty (zero-dimensional — အတိုင်းအတာ သုည) array တစ်ခုကို ထွက်စေပါတယ်။ (ဒါက non-slice အပြုအမူနဲ့ မကိုက်ညီဘဲ — သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် ဒီလို ပြုလုပ်ထားတာပါ။) တောင်းဆိုထားတဲ့ slice က array ရဲ့ နယ်နိမိတ်နဲ့ တစ်စိတ်တစ်ပိုင်း ထပ်နေရင်တော့ — null ပြန်ပေးမယ့်အစား — ထပ်နေတဲ့ အပိုင်းကိုပဲ တိတ်တဆိတ် လျှော့ချ ရွေးချယ်ပေးပါတယ်။

Array value တစ်ခုခုရဲ့ လက်ရှိ dimension တွေကို `array_dims` function နဲ့ ရယူလို့ ရပါတယ်:

```sql
SELECT array_dims(schedule) FROM sal_emp WHERE name = 'Carol';

 array_dims
------------
 [1:2][1:2]
(1 row)
```
`array_dims` က `text` ရလဒ်ကို ထုတ်ပေးပါတယ် — ဒါက လူတွေ ဖတ်ရှုဖို့တော့ အဆင်ပြေပေမယ့် — program တွေအတွက်တော့ အဆင်မပြေနိုင်ပါဘူး။ Dimension တွေကို `array_upper` နဲ့ `array_lower` တို့နဲ့လည်း ရယူလို့ ရပါတယ် — ဒီ function တွေက သတ်မှတ်ထားတဲ့ array dimension တစ်ခုရဲ့ upper bound (အထက် နယ်နိမိတ်) နဲ့ lower bound (အောက် နယ်နိမိတ်) ကို အသီးသီး ပြန်ပေးပါတယ်:

```sql
SELECT array_upper(schedule, 1) FROM sal_emp WHERE name = 'Carol';

 array_upper
-------------
           2
(1 row)
```
`array_length` ကတော့ သတ်မှတ်ထားတဲ့ array dimension တစ်ခုရဲ့ အလျားကို ပြန်ပေးပါလိမ့်မယ်:

```sql
SELECT array_length(schedule, 1) FROM sal_emp WHERE name = 'Carol';

 array_length
--------------
            2
(1 row)
```
`cardinality` က array တစ်ခုထဲမှာ dimension တွေ အားလုံးပေါင်းလိုက်ရင် ရှိတဲ့ element စုစုပေါင်း အရေအတွက်ကို ပြန်ပေးပါတယ်။ ၎င်းက လက်တွေ့မှာ `unnest` ကို ခေါ်ယူလိုက်ရင် ထွက်လာမယ့် row အရေအတွက်နဲ့ ညီမျှပါတယ်:

```sql
SELECT cardinality(schedule) FROM sal_emp WHERE name = 'Carol';

 cardinality
-------------
           4
(1 row)
```
### 8.15.4. Modifying Arrays (array များကို ပြုပြင်ခြင်း)

Array value တစ်ခုကို လုံးဝ အစားထိုးလို့ ရပါတယ်:

```sql
UPDATE sal_emp SET pay_by_quarter = '{25000,25000,27000,27000}'
    WHERE name = 'Carol';
```
ဒါမှမဟုတ် `ARRAY` expression syntax ကို သုံးပြီး:

```sql
UPDATE sal_emp SET pay_by_quarter = ARRAY[25000,25000,27000,27000]
    WHERE name = 'Carol';
```
Array တစ်ခုကို element တစ်ခုတည်းမှာလည်း update လုပ်လို့ ရပါတယ်:

```sql
UPDATE sal_emp SET pay_by_quarter[4] = 15000
    WHERE name = 'Bill';
```
ဒါမှမဟုတ် slice တစ်ခုထဲမှာ update လုပ်လို့လည်း ရပါတယ်:

```sql
UPDATE sal_emp SET pay_by_quarter[1:2] = '{27000,27000}'
    WHERE name = 'Carol';
```
`lower-bound` နဲ့/သို့မဟုတ် `upper-bound` ချန်လိုက်တဲ့ slice syntax တွေကိုလည်း သုံးလို့ ရပါတယ် — ဒါပေမယ့် NULL မဟုတ်တဲ့ သို့မဟုတ် zero-dimensional မဟုတ်တဲ့ array value တစ်ခုကို update လုပ်နေတဲ့အခါမှပဲ ရပါတယ် (မဟုတ်ရင် — အစားထိုးဖို့ ရှိပြီးသား subscript နယ်နိမိတ် မရှိလို့ပါ)။

သိမ်းဆည်းထားတဲ့ array value တစ်ခုကို — မရှိသေးတဲ့ element တွေဆီ assign (တန်ဖိုး သတ်မှတ်) လုပ်ခြင်းအားဖြင့် — ချဲ့ထွင်လို့ ရပါတယ်။ အရင်က ရှိခဲ့တဲ့ element တွေနဲ့ အသစ် assign လုပ်လိုက်တဲ့ element တွေကြားက နေရာတွေကို null တွေနဲ့ ဖြည့်ပါလိမ့်မယ်။ ဥပမာ — `myarray` ဆိုတဲ့ array မှာ လောလောဆယ် element 4 ခု ရှိနေရင် — `myarray[6]` ကို assign လုပ်တဲ့ update တစ်ခု ပြီးရင် element 6 ခု ဖြစ်သွားပါလိမ့်မယ်; `myarray[5]` ကတော့ null ပါဝင်ပါလိမ့်မယ်။ လောလောဆယ်တော့ — ဒီနည်းနဲ့ ချဲ့ထွင်တာက one-dimensional array တွေအတွက်ပဲ ခွင့်ပြုပြီး — multidimensional array တွေအတွက်တော့ ခွင့်မပြုပါဘူး။

Subscripted assignment (subscript သုံးပြီး တန်ဖိုး သတ်မှတ်ခြင်း) က one-based subscript တွေ မသုံးတဲ့ array တွေကိုပါ ဖန်တီးခွင့် ပြုပါတယ်။ ဥပမာ — subscript တန်ဖိုး -2 ကနေ 7 အထိ ရှိတဲ့ array တစ်ခု ဖန်တီးဖို့ `myarray[-2:7]` ကို assign လုပ်နိုင်ပါတယ်။

Array value အသစ်တွေကို concatenation (ဆက်စပ်ခြင်း) operator ဖြစ်တဲ့ `||` ကို သုံးပြီးလည်း တည်ဆောက်နိုင်ပါတယ်:

```sql
SELECT ARRAY[1,2] || ARRAY[3,4];
 ?column?
-----------
 {1,2,3,4}
(1 row)

SELECT ARRAY[5,6] || ARRAY[[1,2],[3,4]];
      ?column?
---------------------
 {{5,6},{1,2},{3,4}}
(1 row)
```
Concatenation operator က one-dimensional array တစ်ခုရဲ့ အစ သို့မဟုတ် အဆုံးမှာ element တစ်ခုတည်းကို ထပ်ဖြည့်ခွင့် ပြုပါတယ်။ ၎င်းက `N`-dimensional array နှစ်ခု၊ ဒါမှမဟုတ် `N`-dimensional array တစ်ခုနဲ့ `N+1`-dimensional array တစ်ခုကိုလည်း လက်ခံပါတယ်။

One-dimensional array တစ်ခုရဲ့ အစ သို့မဟုတ် အဆုံး ဘယ်ဘက်မှာပဲ element တစ်ခုတည်း ထပ်ဖြည့်ဖြည့် — ရလဒ်က array operand ရဲ့ lower bound subscript အတိုင်း အတူတူရှိတဲ့ array တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT array_dims(1 || '[0:1]={2,3}'::int[]);
 array_dims
------------
 [0:2]
(1 row)

SELECT array_dims(ARRAY[1,2] || 3);
 array_dims
------------
 [1:3]
(1 row)
```
Dimension အရေအတွက် တူညီတဲ့ array နှစ်ခုကို concatenate (ဆက်စပ်) လုပ်တဲ့အခါ — ရလဒ်က ဘယ်ဘက် operand ရဲ့ outer dimension (အပြင်ဘက် အတိုင်းအတာ) ရဲ့ lower bound subscript ကို ဆက်လက် ထိန်းထားပါတယ်။ ရလဒ်က ဘယ်ဘက် operand ရဲ့ element တိုင်းရဲ့ နောက်မှာ ညာဘက် operand ရဲ့ element တိုင်း ဆက်လိုက်တဲ့ — array တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT array_dims(ARRAY[1,2] || ARRAY[3,4,5]);
 array_dims
------------
 [1:5]
(1 row)

SELECT array_dims(ARRAY[[1,2],[3,4]] || ARRAY[[5,6],[7,8],[9,0]]);
 array_dims
------------
 [1:5][1:2]
(1 row)
```
`N`-dimensional array တစ်ခုကို `N+1`-dimensional array တစ်ခုရဲ့ အစ သို့မဟုတ် အဆုံးမှာ ထပ်ဖြည့်လိုက်ရင် — ရလဒ်က အပေါ်က element-array ကိစ္စနဲ့ ဆင်တူပါတယ်။ `N`-dimensional sub-array တစ်ခုချင်းစီက အနှစ်သာရအားဖြင့် `N+1`-dimensional array ရဲ့ outer dimension ရဲ့ element တစ်ခုပဲ ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT array_dims(ARRAY[1,2] || ARRAY[[3,4],[5,6]]);
 array_dims
------------
 [1:3][1:2]
(1 row)
```
Array တစ်ခုကို `array_prepend`, `array_append` သို့မဟုတ် `array_cat` ဆိုတဲ့ function တွေကို သုံးပြီးလည်း တည်ဆောက်နိုင်ပါတယ်။ ပထမ function နှစ်ခုက one-dimensional array တွေကိုပဲ ထောက်ပံ့ပေမယ့် — `array_cat` ကတော့ multidimensional array တွေကိုပါ ထောက်ပံ့ပါတယ်။ ဥပမာ တချို့:

```sql
SELECT array_prepend(1, ARRAY[2,3]);
 array_prepend
---------------
 {1,2,3}
(1 row)

SELECT array_append(ARRAY[1,2], 3);
 array_append
--------------
 {1,2,3}
(1 row)

SELECT array_cat(ARRAY[1,2], ARRAY[3,4]);
 array_cat
-----------
 {1,2,3,4}
(1 row)

SELECT array_cat(ARRAY[[1,2],[3,4]], ARRAY[5,6]);
      array_cat
---------------------
 {{1,2},{3,4},{5,6}}
(1 row)

SELECT array_cat(ARRAY[5,6], ARRAY[[1,2],[3,4]]);
      array_cat
---------------------
 {{5,6},{1,2},{3,4}}
```
ရိုးရှင်းတဲ့ ကိစ္စတွေမှာ — အပေါ်မှာ ဆွေးနွေးခဲ့တဲ့ concatenation operator က ဒီ function တွေကို တိုက်ရိုက် သုံးတာထက် ပိုနှစ်သက်စရာ ကောင်းပါတယ်။ ဒါပေမယ့် — concatenation operator က ကိစ္စ သုံးမျိုးလုံးအတွက် overload (ဝန်ပိုတင်ဆောင်) လုပ်ထားလို့ — မရှင်းလင်းမှု (ambiguity) ကို ရှောင်ရှားဖို့ ဒီ function တွေထဲက တစ်ခုကို သုံးတာ အထောက်အကူ ဖြစ်တဲ့ အခြေအနေတွေ ရှိပါတယ်။ ဥပမာ သုံးသပ်ကြည့်ပါ:

```sql
SELECT ARRAY[1, 2] || '{3, 4}';  -- the untyped literal is taken as an array
 ?column?
-----------
 {1,2,3,4}

SELECT ARRAY[1, 2] || '7';                 -- so is this one
ERROR:  malformed array literal: "7"

SELECT ARRAY[1, 2] || NULL;                -- so is an undecorated NULL
 ?column?
----------
 {1,2}
(1 row)

SELECT array_append(ARRAY[1, 2], NULL);    -- this might have been meant
 array_append
--------------
 {1,2,NULL}
```
အထက်က ဥပမာတွေမှာ — parser က concatenation operator ရဲ့ တစ်ဖက်မှာ integer array တစ်ခုကို မြင်ပြီး — နောက်တစ်ဖက်မှာတော့ type မသတ်မှတ်ရသေးတဲ့ constant တစ်ခုကို မြင်ပါတယ်။ Constant ရဲ့ type ကို ဆုံးဖြတ်ဖို့ ၎င်း သုံးတဲ့ heuristic (ခန့်မှန်း နည်းစနစ်) ကတော့ — operator ရဲ့ တခြား input နဲ့ type တူတယ်လို့ ယူဆတာပါ — ဒီကိစ္စမှာဆိုရင် integer array ပေါ့။ ဒါကြောင့် concatenation operator ကို `array_append` မဟုတ်ဘဲ `array_cat` ကို ကိုယ်စားပြုတယ်လို့ ယူဆပါတယ်။ ဒါက မှားယွင်းတဲ့ ရွေးချယ်မှု ဖြစ်နေတဲ့အခါ — constant ကို array ရဲ့ element type အဖြစ် cast လုပ်ပြီး ပြုပြင်လို့ ရပါတယ်; ဒါပေမယ့် `array_append` ကို ရှင်းရှင်းလင်းလင်း သုံးတာက ပိုနှစ်သက်စရာ ကောင်းတဲ့ အဖြေတစ်ခု ဖြစ်နိုင်ပါတယ်။

### 8.15.5. Searching in Arrays (array များတွင် ရှာဖွေခြင်း)

Array တစ်ခုထဲမှာ တန်ဖိုးတစ်ခုကို ရှာဖွေဖို့ဆိုရင် — တန်ဖိုးတစ်ခုချင်းစီကို စစ်ဆေးရပါမယ်။ Array ရဲ့ အရွယ်အစားကို သိထားရင် — ဒါကို လက်နဲ့လည်း လုပ်လို့ ရပါတယ်။ ဥပမာ:

```sql
SELECT * FROM sal_emp WHERE pay_by_quarter[1] = 10000 OR
                            pay_by_quarter[2] = 10000 OR
                            pay_by_quarter[3] = 10000 OR
                            pay_by_quarter[4] = 10000;
```
ဒါပေမယ့် — array ကြီးတွေအတွက်တော့ ဒါက မကြာခင်မှာ ငြီးငွေ့စရာ ဖြစ်လာပြီး — array ရဲ့ အရွယ်အစားကို မသိရင်လည်း အသုံးမဝင်ပါဘူး။ အခြားရွေးချယ်စရာ နည်းလမ်းတစ်ခုကို [အပိုင်း 9.25](https://www.postgresql.org/docs/current/functions-comparisons.html) မှာ ဖော်ပြထားပါတယ်။ အထက်က query ကို ဒီလိုနဲ့ အစားထိုးနိုင်ပါတယ်:

```sql
SELECT * FROM sal_emp WHERE 10000 = ANY (pay_by_quarter);
```
ဒါ့အပြင် — array ထဲမှာ တန်ဖိုး အားလုံး 10000 နဲ့ ညီမျှတဲ့ row တွေကိုလည်း ဒီလိုနဲ့ ရှာတွေ့နိုင်ပါတယ်:

```sql
SELECT * FROM sal_emp WHERE 10000 = ALL (pay_by_quarter);
```
တနည်းအားဖြင့် — `generate_subscripts` function ကိုလည်း သုံးနိုင်ပါတယ်။ ဥပမာ:

```sql
SELECT * FROM
   (SELECT pay_by_quarter,
           generate_subscripts(pay_by_quarter, 1) AS s
      FROM sal_emp) AS foo
 WHERE pay_by_quarter[s] = 10000;
```
ဒီ function အကြောင်းကို [ဇယား 9.70](https://www.postgresql.org/docs/current/functions-srf.html#FUNCTIONS-SRF-SUBSCRIPTS) မှာ ဖော်ပြထားပါတယ်။

`&&` operator ကို သုံးပြီးလည်း array တစ်ခုကို ရှာဖွေနိုင်ပါတယ် — ဒီ operator က ဘယ်ဘက် operand နဲ့ ညာဘက် operand တို့ ထပ်နေလားဆိုတာ စစ်ဆေးပါတယ်။ ဥပမာ:

```sql
SELECT * FROM sal_emp WHERE pay_by_quarter && ARRAY[10000];
```
ဒီ operator နဲ့ တခြား array operator တွေကို [အပိုင်း 9.19](https://www.postgresql.org/docs/current/functions-array.html) မှာ ထပ်ဆင့် ဖော်ပြထားပါတယ်။ [အပိုင်း 11.2](https://www.postgresql.org/docs/current/indexes-types.html) မှာ ဖော်ပြထားသလို — သင့်လျော်တဲ့ index တစ်ခုနဲ့ ၎င်းကို အရှိန်မြှင့်လို့လည်း ရပါတယ်။

`array_position` နဲ့ `array_positions` function တွေကို သုံးပြီး — array တစ်ခုထဲမှာ တိကျတဲ့ တန်ဖိုးတွေကိုလည်း ရှာဖွေနိုင်ပါတယ်။ ရှေ့ function က array ထဲမှာ တန်ဖိုးတစ်ခု ပထမဆုံး ပေါ်လာတဲ့ နေရာရဲ့ subscript ကို ပြန်ပေးပြီး — နောက် function ကတော့ array ထဲမှာ အဲဒီ တန်ဖိုး ပေါ်ပေါက်တဲ့ နေရာ အားလုံးရဲ့ subscript တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ ဥပမာ:

```sql
SELECT array_position(ARRAY['sun','mon','tue','wed','thu','fri','sat'], 'mon');
 array_position
----------------
              2
(1 row)

SELECT array_positions(ARRAY[1, 4, 3, 1, 3, 4, 2, 1], 1);
 array_positions
-----------------
 {1,4,8}
(1 row)
```
> **အကြံပြုချက်:** Array တွေက set (အစု) တွေ မဟုတ်ပါဘူး; array element တွေကို သီးခြားစီ ရှာဖွေနေရတာက database ဒီဇိုင်း ချွတ်ယွင်းမှုရဲ့ လက္ခဏာ တစ်ခု ဖြစ်နိုင်ပါတယ်။ Array element တစ်ခု ဖြစ်လာမယ့် item တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါတဲ့ — သီးခြား table တစ်ခု သုံးဖို့ စဉ်းစားကြည့်ပါ။ ဒါက ရှာဖွေဖို့ ပိုလွယ်ကူမှာ ဖြစ်ပြီး — element အများအပြားအတွက်လည်း ပိုကောင်းကောင်း scale (ချဲ့ထွင်) နိုင်ဖို့ အလားအလာ ရှိပါတယ်။

### 8.15.6. Array Input and Output Syntax (array input/output syntax)

Array value တစ်ခုရဲ့ အပြင်ပိုင်း text representation (စာသား ကိုယ်စားပြုပုံ) မှာ — array ရဲ့ element type အတွက် I/O conversion စည်းမျဉ်းတွေအရ အဓိပ္ပာယ် ဖွင့်ဆိုတဲ့ item တွေ ပါဝင်ပြီး — array ရဲ့ တည်ဆောက်ပုံကို ညွှန်ပြတဲ့ အလှဆင် သင်္ကေတ (decoration) တွေလည်း ပါဝင်ပါတယ်။ အလှဆင် သင်္ကေတတွေမှာ — array value ကို ဝန်းရံထားတဲ့ curly brace (`{` နဲ့ `}`) တွေနဲ့ — ကပ်လျက် item တွေကြားမှာ ရှိတဲ့ delimiter character တွေ ပါဝင်ပါတယ်။ Delimiter character က ပုံမှန်အားဖြင့် comma (`,`) ဖြစ်ပေမယ့် — တခြားအရာလည်း ဖြစ်နိုင်ပါတယ်: ၎င်းကို array ရဲ့ element type အတွက် `typdelim` setting က သတ်မှတ်ပါတယ်။ PostgreSQL distribution ထဲမှာ ပါဝင်တဲ့ standard data type တွေအနက် — `box` type က semicolon (`;`) သုံးတာကလွဲလို့ — အားလုံးက comma ကို သုံးပါတယ်။ Multidimensional array တစ်ခုမှာ — dimension တစ်ခုချင်းစီ (row, plane, cube စသည်) က ကိုယ်ပိုင် curly brace အဆင့် ရရှိပြီး — အဆင့်တူ ကပ်လျက် curly-brace အုပ်ထားတဲ့ entity တွေကြားမှာ delimiter တွေကို ရေးပေးရပါတယ်။

Array output routine (ရလဒ် ထုတ်ပေးသည့် လုပ်ရိုးလုပ်စဉ်) က element value တွေကို — ၎င်းတို့ဟာ empty string တွေ ဖြစ်နေရင်၊ curly brace တွေ၊ delimiter character တွေ၊ double quote တွေ၊ backslash တွေ သို့မဟုတ် white space တွေ ပါဝင်နေရင်၊ ဒါမှမဟုတ် `NULL` ဆိုတဲ့ စာလုံးနဲ့ တိုက်ဆိုင်နေရင် — double quote တွေနဲ့ ဝန်းရံပါလိမ့်မယ်။ Element value တွေထဲမှာ မြှုပ်နှံ ပါဝင်နေတဲ့ double quote နဲ့ backslash တွေကို backslash-escape (backslash ဖြင့် ရှေ့ဆွဲ) လုပ်ပါလိမ့်မယ်။ Numeric data type တွေအတွက်တော့ double quote ဘယ်တော့မှ ပေါ်မလာဘူးလို့ လုံခြုံစွာ ယူဆနိုင်ပေမယ့် — textual data type တွေအတွက်တော့ quote ပါတာ ဒါမှမဟုတ် မပါတာ နှစ်မျိုးလုံးကို ရင်ဆိုင်ဖို့ ပြင်ဆင်ထားသင့်ပါတယ်။

ပုံမှန်အားဖြင့် — array ရဲ့ dimension တွေရဲ့ lower bound index တန်ဖိုးကို one (1) လို့ သတ်မှတ်ပါတယ်။ တခြား lower bound တွေ ရှိတဲ့ array တွေကို ကိုယ်စားပြုဖို့ဆိုရင် — array ရဲ့ ပါဝင်မှုတွေ (contents) မရေးခင် — array subscript အကွာအဝေး (range) တွေကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်နိုင်ပါတယ်။ ဒီအလှဆင် သင်္ကေတမှာ — array dimension တစ်ခုချင်းစီရဲ့ lower နဲ့ upper bound တွေကို ဝန်းရံထားတဲ့ square bracket (`[]`) တွေ ပါဝင်ပြီး — အလယ်မှာ colon (`:`) delimiter character နဲ့ ခြားထားပါတယ်။ Array dimension အလှဆင် သင်္ကေတရဲ့ နောက်မှာ equal sign (`=`) လိုက်ပါတယ်။ ဥပမာ:

```sql
SELECT f1[1][-2][3] AS e1, f1[1][-1][5] AS e2
 FROM (SELECT '[1:1][-2:-1][3:5]={{{1,2,3},{4,5,6}}}'::int[] AS f1) AS ss;

 e1 | e2
----+----
  1 |  6
(1 row)
```
Array output routine က — one (1) နဲ့ မတူတဲ့ lower bound တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို ရှိနေမှသာ — ၎င်းရဲ့ ရလဒ်ထဲမှာ explicit dimension (ရှင်းလင်းစွာ ဖော်ပြထားသော dimension) တွေကို ထည့်သွင်းပါလိမ့်မယ်။

Element တစ်ခုအတွက် ရေးထားတဲ့ တန်ဖိုးက `NULL` ဆိုရင် (စာလုံးကြီး/သေး ဘယ်ပုံစံမဆို) — အဲဒီ element ကို NULL အနေနဲ့ မှတ်ယူပါတယ်။ Quote သို့မဟုတ် backslash တစ်ခုခု ရှိနေရင်တော့ ဒါကို disable လုပ်ပြီး — “NULL” ဆိုတဲ့ literal string တန်ဖိုးကို ထည့်သွင်းခွင့် ပြုပါတယ်။ ဒါ့အပြင် — PostgreSQL ရဲ့ pre-8.2 ဗားရှင်းတွေနဲ့ နောက်ပြန် လိုက်ဖက်မှု (backward compatibility) ရှိစေဖို့ — [array_nulls](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-ARRAY-NULLS) configuration parameter ကို `off` လှည့်ပြီး — `NULL` ကို NULL အဖြစ် အသိအမှတ်ပြုတာကို ဖိနှိပ် (suppress) လုပ်နိုင်ပါတယ်။

အရင်က ပြခဲ့တဲ့အတိုင်း — array value တစ်ခု ရေးတဲ့အခါ — array element တစ်ခုချင်းစီကို double quote တွေနဲ့ ဝန်းရံနိုင်ပါတယ်။ Element value က array-value parser ကို ရှုပ်ထွေးစေနိုင်မယ်ဆိုရင် မဖြစ်မနေ ဝန်းရံပေးရပါမယ်။ ဥပမာ — curly brace တွေ၊ comma တွေ (သို့မဟုတ် data type ရဲ့ delimiter character)၊ double quote တွေ၊ backslash တွေ၊ ဒါမှမဟုတ် ရှေ့ဆုံး သို့မဟုတ် နောက်ဆုံးက white space တွေ ပါဝင်တဲ့ element တွေကို double-quote လုပ်ပေးရပါမယ်။ Empty string တွေနဲ့ `NULL` ဆိုတဲ့ စာလုံးနဲ့ တိုက်ဆိုင်နေတဲ့ string တွေကိုလည်း quote လုပ်ပေးရပါမယ်။ Quoted array element value တစ်ခုထဲမှာ double quote သို့မဟုတ် backslash ထည့်ဖို့ဆိုရင် — ၎င်းရဲ့ ရှေ့မှာ backslash ထည့်ပေးပါ။ တနည်းအားဖြင့် — quote တွေကို ရှောင်ပြီး — array syntax အနေနဲ့ မှားယွင်း အနက်ဖွင့်ခံရနိုင်တဲ့ data character တွေ အားလုံးကို ကာကွယ်ဖို့ backslash-escaping ကို သုံးနိုင်ပါတယ်။

Left brace တစ်ခုရဲ့ ရှေ့မှာ ဒါမှမဟုတ် right brace တစ်ခုရဲ့ နောက်မှာ whitespace တွေ ထည့်နိုင်ပါတယ်။ Item string တစ်ခုချင်းစီရဲ့ ရှေ့ သို့မဟုတ် နောက်မှာလည်း whitespace ထည့်နိုင်ပါတယ်။ ဒီကိစ္စတွေ အားလုံးမှာ whitespace ကို လျစ်လျူရှုပါလိမ့်မယ်။ ဒါပေမယ့် — double-quote လုပ်ထားတဲ့ element တွေအတွင်းက သို့မဟုတ် element တစ်ခုရဲ့ non-whitespace character တွေနဲ့ နှစ်ဖက်စလုံး ဝန်းရံထားတဲ့ whitespace ကတော့ လျစ်လျူရှုတာ မခံရပါဘူး။

> **အကြံပြုချက်:** SQL command တွေထဲမှာ array value တွေ ရေးတဲ့အခါ — `ARRAY` constructor syntax ([အပိုင်း 4.2.12](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ) က array-literal syntax ထက် မကြာခဏဆိုသလို ပိုအဆင်ပြေပါတယ်။ `ARRAY` ထဲမှာ — element value တစ်ခုချင်းစီကို array ရဲ့ member တစ်ခု မဟုတ်တဲ့အခါ ရေးသလိုမျိုးပဲ ရေးပါတယ်။
