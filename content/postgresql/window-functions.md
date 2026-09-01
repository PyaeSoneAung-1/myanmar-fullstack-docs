---
title: "Window Functions (ဝင်းဒိုး လုပ်ဆောင်ချက်များ)"
description: "Window function ဆိုတာ ဘာလဲ — OVER, PARTITION BY, ORDER BY, window frame သဘောတရား — row_number, sum ဥပမာများနဲ့ WINDOW clause"
order: 16
source: "https://www.postgresql.org/docs/current/tutorial-window.html"
status: translated
updated: 2026-09-01
---

## Window Functions (ဝင်းဒိုး လုပ်ဆောင်ချက်များ)

*Window function* က လက်ရှိ row နဲ့ တစ်နည်းနည်းနဲ့ ဆက်စပ်နေတဲ့ table row အစုတစ်ခုအပေါ်မှာ တွက်ချက်မှုတစ်ခု လုပ်ဆောင်ပါတယ်။ ဒါက aggregate function နဲ့ လုပ်လို့ရတဲ့ တွက်ချက်မှု အမျိုးအစားနဲ့ နှိုင်းယှဉ်လို့ရပါတယ်။ ဒါပေမယ့် window function တွေက — non-window aggregate call တွေလိုမျိုး — row တွေကို output row တစ်ခုတည်းထဲ စုစည်း (group) မဖြစ်စေပါဘူး။ အဲဒီအစား row တွေက သူတို့ရဲ့ သီးခြား ဝိသေသ (identity) တွေ ထိန်းထားပါတယ်။ နောက်ကွယ်မှာ window function က query result ရဲ့ လက်ရှိ row တစ်ခုတည်းထက်ပိုပြီး ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်။

ဒီမှာ employee တစ်ယောက်ချင်းစီရဲ့ လစာကို သူ့ department ရဲ့ ပျမ်းမျှလစာနဲ့ ဘယ်လို နှိုင်းယှဉ်မလဲ ပြတဲ့ ဥပမာ တစ်ခုပါ:

```sql
SELECT depname, empno, salary, avg(salary) OVER (PARTITION BY depname) FROM empsalary;
```

Output က:

```
  depname  | empno | salary |          avg
-----------+-------+--------+-----------------------
 develop   |    11 |   5200 | 5020.0000000000000000
 develop   |     7 |   4200 | 5020.0000000000000000
 develop   |     9 |   4500 | 5020.0000000000000000
 develop   |     8 |   6000 | 5020.0000000000000000
 develop   |    10 |   5200 | 5020.0000000000000000
 personnel |     5 |   3500 | 3700.0000000000000000
 personnel |     2 |   3900 | 3700.0000000000000000
 sales     |     3 |   4800 | 4866.6666666666666667
 sales     |     1 |   5000 | 4866.6666666666666667
 sales     |     4 |   4800 | 4866.6666666666666667
(10 rows)
```

ပထမ output column သုံးခုက `empsalary` table ကနေ တိုက်ရိုက် လာပြီး — table ထဲက row တစ်ခုချင်းစီအတွက် output row တစ်ခုစီ ရှိပါတယ်။ စတုတ္ထ column ကတော့ လက်ရှိ row နဲ့ `depname` တန်ဖိုး တူညီတဲ့ table row အားလုံးအပေါ် ယူထားတဲ့ ပျမ်းမျှ (average) ကို ကိုယ်စားပြုပါတယ်။ (ဒါက တကယ်တော့ non-window `avg` aggregate နဲ့ အတူတူပါပဲ — ဒါပေမယ့် `OVER` clause က ဒါကို window function အဖြစ် သဘောထားပြီး window frame အပေါ်မှာ တွက်ချက်စေပါတယ်။)

Window function call တစ်ခုမှာ — window function ရဲ့ နာမည်နဲ့ argument(s) တွေရဲ့ နောက်မှာ တိုက်ရိုက် လိုက်တဲ့ `OVER` clause အမြဲ ပါပါတယ်။ ဒါက syntax အရ သာမန် function ဒါမှမဟုတ် non-window aggregate နဲ့ ခွဲခြားပေးတဲ့ အချက်ပါ။ `OVER` clause က query ရဲ့ row တွေကို window function က ဘယ်လို ပိုင်းပြီး ဆောင်ရွက်မလဲ ဆိုတာကို တိကျစွာ သတ်မှတ်ပါတယ်။ `OVER` ထဲက `PARTITION BY` clause က row တွေကို — `PARTITION BY` ရဲ့ expression(များ)ရဲ့ တန်ဖိုး အတူတူ ရှိတဲ့ — group (partition) တွေအဖြစ် ပိုင်းပါတယ်။ Row တစ်ခုချင်းစီအတွက် window function ကို လက်ရှိ row နဲ့ partition တူညီတဲ့ row တွေအပေါ်မှာ တွက်ချက်ပါတယ်။

`OVER` ထဲမှာ `ORDER BY` သုံးပြီး window function တွေက row တွေကို ဆောင်ရွက်တဲ့ အစဉ်ကိုလည်း ထိန်းချုပ်လို့ရပါတယ်။ (Window ရဲ့ `ORDER BY` က row တွေ output ထွက်တဲ့ အစဉ်နဲ့တောင် ကိုက်ညီစရာ မလိုပါဘူး။) ဥပမာ:

```sql
SELECT depname, empno, salary,
       row_number() OVER (PARTITION BY depname ORDER BY salary DESC)
FROM empsalary;
```

Output က:

```
  depname  | empno | salary | row_number
-----------+-------+--------+------------
 develop   |     8 |   6000 |          1
 develop   |    10 |   5200 |          2
 develop   |    11 |   5200 |          3
 develop   |     9 |   4500 |          4
 develop   |     7 |   4200 |          5
 personnel |     2 |   3900 |          1
 personnel |     5 |   3500 |          2
 sales     |     1 |   5000 |          1
 sales     |     4 |   4800 |          2
 sales     |     3 |   4800 |          3
(10 rows)
```

ဒီမှာ မြင်ရတဲ့အတိုင်း `row_number` window function က partition တစ်ခုချင်းစီထဲက row တွေကို — `ORDER BY` clause က သတ်မှတ်တဲ့ အစဉ်အတိုင်း (tie ဖြစ်နေတဲ့ row တွေကတော့ သတ်မှတ်မထားတဲ့ အစဉ်နဲ့) — နံပါတ်စဉ် ဆက်တိုက် သတ်မှတ်ပေးပါတယ်။ `row_number` က explicit parameter မလိုပါဘူး — သူ့ရဲ့ အပြုအမူက `OVER` clause ကနေ လုံးလုံး ဆုံးဖြတ်ခံရလို့ပါ။

Window function တစ်ခုက စဉ်းစားတဲ့ row တွေဆိုတာ — query ရဲ့ `FROM` clause က ထုတ်လုပ်ပြီး `WHERE`, `GROUP BY`, `HAVING` clause တွေနဲ့ စစ်ထားတဲ့ (ရှိရင်) "virtual table" ရဲ့ row တွေပါ။ ဥပမာ — `WHERE` condition နဲ့ မကိုက်လို့ ဖယ်လိုက်ရတဲ့ row တစ်ခုကို ဘယ် window function ကမှ မမြင်ပါဘူး။ Query တစ်ခုမှာ — data တွေကို မတူတဲ့ `OVER` clause တွေနဲ့ မတူညီတဲ့ နည်းလမ်းတွေနဲ့ ပိုင်းဖြတ်တဲ့ — window function အများကြီး ပါဝင်လို့ရပါတယ် — ဒါပေမယ့် အားလုံးက ဒီ virtual table က သတ်မှတ်တဲ့ row အစုတစ်ခုတည်းအပေါ်မှာပဲ ဆောင်ရွက်ပါတယ်။

`ORDER BY` ကို — row တွေရဲ့ အစဉ် အရေးမကြီးရင် — ချန်လိုက်လို့ရတာ အပေါ်မှာ မြင်ပြီးသားပါ။ `PARTITION BY` ကိုလည်း ချန်လိုက်လို့ရပါတယ် — အဲဒီအခါ row အားလုံး ပါဝင်တဲ့ partition တစ်ခုတည်း ရှိပါတယ်။

Window function တွေနဲ့ ဆက်စပ်တဲ့ နောက် အရေးကြီးတဲ့ သဘောတရား တစ်ခု ရှိပါသေးတယ်: row တစ်ခုချင်းစီအတွက် — သူ့ရဲ့ partition ထဲမှာ *window frame* လို့ ခေါ်တဲ့ row အစုတစ်ခု ရှိပါတယ်။ Window function တချို့က partition တစ်ခုလုံးပေါ်မဟုတ်ဘဲ window frame ရဲ့ row တွေအပေါ်မှာပဲ ဆောင်ရွက်ပါတယ်။ Default အနေနဲ့ — `ORDER BY` ပေးထားရင် frame က partition ရဲ့ အစကနေ လက်ရှိ row အထိ row အားလုံး ပါပြီး — `ORDER BY` clause အရ လက်ရှိ row နဲ့ တူညီတဲ့ နောက်က row တွေပါ ထည့်ပါတယ်။ `ORDER BY` ချန်ထားရင် default frame က partition ထဲက row အားလုံး ပါတယ်。[5] `sum` သုံးတဲ့ ဥပမာ ကြည့်ရအောင်:

```sql
SELECT salary, sum(salary) OVER () FROM empsalary;
```

Output က:

```
 salary |  sum
--------+-------
   5200 | 47100
   5000 | 47100
   3500 | 47100
   4800 | 47100
   3900 | 47100
   4200 | 47100
   4500 | 47100
   4800 | 47100
   6000 | 47100
   5200 | 47100
(10 rows)
```

အပေါ်မှာ — `OVER` clause ထဲမှာ `ORDER BY` မရှိလို့ — window frame က partition နဲ့ အတူတူပါပဲ — `PARTITION BY` မရှိတဲ့အတွက် partition က table တစ်ခုလုံး ဖြစ်ပါတယ်။ တနည်းပြောရရင် sum တစ်ခုချင်းစီကို table တစ်ခုလုံးအပေါ် ယူတာမို့ output row တိုင်းအတွက် ရလဒ် အတူတူ ရပါတယ်။ ဒါပေမယ့် `ORDER BY` clause ထည့်လိုက်ရင် ရလဒ်တွေက အရမ်း ကွဲပြားသွားပါတယ်:

```sql
SELECT salary, sum(salary) OVER (ORDER BY salary) FROM empsalary;
```

Output က:

```
 salary |  sum
--------+-------
   3500 |  3500
   3900 |  7400
   4200 | 11600
   4500 | 16100
   4800 | 25700
   4800 | 25700
   5000 | 30700
   5200 | 41100
   5200 | 41100
   6000 | 47100
(10 rows)
```

ဒီမှာ sum ကို ပထမဆုံး (အနိမ့်ဆုံး) လစာကနေ လက်ရှိ လစာအထိ — လက်ရှိရဲ့ ထပ်နေတဲ့ (duplicate) အကုန်လုံး အပါအဝင် — ယူပါတယ် (ထပ်နေတဲ့ လစာတွေရဲ့ ရလဒ်တွေကို သတိပြုပါ)။

Window function တွေကို query ရဲ့ `SELECT` list နဲ့ `ORDER BY` clause ထဲမှာပဲ သုံးခွင့် ရှိပါတယ်။ တခြားနေရာတွေဖြစ်တဲ့ — `GROUP BY`, `HAVING`, `WHERE` clause တွေမှာ — တားမြစ်ပါတယ်။ ဘာလို့လဲဆိုတော့ ဒီ clause တွေရဲ့ ဆောင်ရွက်မှု ပြီးမှ window function တွေက logical အရ ဆောင်ရွက်လို့ပါ။ ဒါ့အပြင် window function တွေက non-window aggregate function တွေ ပြီးမှ ဆောင်ရွက်ပါတယ်။ ဆိုလိုတာက — window function တစ်ခုရဲ့ argument တွေထဲမှာ aggregate function call တစ်ခု ထည့်လို့ရပါတယ် — ဒါပေမယ့် အပြန်အလှန်ကတော့ မရပါဘူး။

Window တွက်ချက်မှုတွေ ပြီးပြီးနောက် row တွေကို စစ်ထုတ်ချင် ဒါမှမဟုတ် group လုပ်ချင်ရင် sub-select သုံးလို့ရပါတယ်။ ဥပမာ:

```sql
SELECT depname, empno, salary, enroll_date
FROM
  (SELECT depname, empno, salary, enroll_date,
     row_number() OVER (PARTITION BY depname ORDER BY salary DESC, empno) AS pos
     FROM empsalary
  ) AS ss
WHERE pos < 3;
```

အပေါ်က query က inner query ထဲက `row_number` ၃ ထက် ငယ်တဲ့ row တွေကိုပဲ ပြပါတယ် (ဆိုလိုတာက department တစ်ခုချင်းစီရဲ့ ပထမ row နှစ်ခု)။

Query တစ်ခုမှာ window function အများကြီး ပါဝင်တဲ့အခါ — တစ်ခုချင်းစီကို သီးခြား `OVER` clause နဲ့ ရေးထုတ်လို့ရပါတယ် — ဒါပေမယ့် window function အများကြီးအတွက် windowing အပြုအမူ အတူတူ လိုချင်ရင် အဲဒါက ထပ်တူကျပြီး အမှား ဖြစ်နိုင်ခြေ များပါတယ်။ အဲဒီအစား windowing အပြုအမူ တစ်ခုချင်းစီကို `WINDOW` clause ထဲမှာ နာမည်ပေးပြီး `OVER` ထဲမှာ ရည်ညွှန်းလို့ရပါတယ်။ ဥပမာ:

```sql
SELECT sum(salary) OVER w, avg(salary) OVER w
  FROM empsalary
  WINDOW w AS (PARTITION BY depname ORDER BY salary DESC);
```

Window function တွေအကြောင်း နောက်ထပ် အသေးစိတ်ကို [Section 4.2.8](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS), [Section 9.22](https://www.postgresql.org/docs/current/functions-window.html), [Section 7.2.5](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-WINDOW) နဲ့ [SELECT](https://www.postgresql.org/docs/current/sql-select.html) reference page တွေမှာ တွေ့နိုင်ပါတယ်။

> **[5] မှတ်စု:** Window frame ကို တခြားနည်းတွေနဲ့ သတ်မှတ်ဖို့ option တွေ ရှိပါတယ် — ဒါပေမယ့် ဒီ tutorial မှာ မဖော်ပြပါဘူး။ အသေးစိတ်အတွက် [Section 4.2.8](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS) ကို ကြည့်ပါ။

## နောက်တစ်ဆင့်တွေ

- [Inheritance (အမွေဆက်ခံခြင်း)](/docs/postgresql/inheritance) — နောက် topic ဖြစ်တဲ့ table inheritance အကြောင်း ဆက်လေ့လာပါ
- [Aggregate Functions များ](/docs/postgresql/aggregate) — window function မဟုတ်တဲ့ ပုံမှန် aggregate တွေကို ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-window.html
