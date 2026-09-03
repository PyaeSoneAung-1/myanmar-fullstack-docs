---
title: "Table Expressions (table expression များ)"
description: "FROM/WHERE/GROUP BY clause တွေနဲ့ table expression တည်ဆောက်ပုံ — joins, aliases, subqueries, table functions, LATERAL, GROUPING SETS/CUBE/ROLLUP နဲ့ window function ဆောင်ရွက်မှု အကြောင်း"
order: 41
source: "https://www.postgresql.org/docs/current/queries-table-expressions.html"
status: translated
updated: 2026-09-03
---

## 7.2. Table Expressions (table expression များ)

- **7.2.1. The FROM Clause (FROM clause)**
- **7.2.2. The WHERE Clause (WHERE clause)**
- **7.2.3. The GROUP BY and HAVING Clauses (GROUP BY နဲ့ HAVING clause များ)**
- **7.2.4. GROUPING SETS, CUBE, and ROLLUP (GROUPING SETS, CUBE နဲ့ ROLLUP)**
- **7.2.5. Window Function Processing (window function ဆောင်ရွက်ခြင်း)**

*Table expression* ဆိုတာ — table တစ်ခုကို တွက်ချက် ထုတ်ပေးတဲ့ expression ပါ။ Table expression တစ်ခုမှာ `FROM` clause ပါဝင်ပြီး — ၎င်းနောက်မှာ `WHERE`, `GROUP BY`, နဲ့ `HAVING` clause တွေကို လိုအပ်သလို (optionally) ထည့်သွင်းနိုင်ပါတယ်။ ရိုးရှင်းတဲ့ table expression တွေက disk ပေါ်မှာ ရှိတဲ့ table တစ်ခုကိုပဲ ရည်ညွှန်းပါတယ် — ဒါမျိုးကို base table (အခြေခံ table) လို့ ခေါ်ပါတယ် — ဒါပေမယ့် ပိုရှုပ်ထွေးတဲ့ expression တွေကိုတော့ base table တွေကို နည်းလမ်းအမျိုးမျိုးနဲ့ ပြုပြင်တာ ဒါမှမဟုတ် ပေါင်းစပ်တာအတွက် သုံးနိုင်ပါတယ်။

Table expression ထဲက လိုအပ်သလို ထည့်သွင်းနိုင်တဲ့ `WHERE`, `GROUP BY`, နဲ့ `HAVING` clause တွေက — `FROM` clause ကနေ ဆင်းသက်လာတဲ့ (derived) table အပေါ်မှာ ဆက်တိုက် လုပ်ဆောင်မယ့် အသွင်ပြောင်း (transformation) အဆင့်ဆင့်ရဲ့ pipeline (ပိုက်လိုင်း) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဒီအသွင်ပြောင်း လုပ်ဆောင်ချက်တွေ အားလုံးက virtual table (disk ပေါ်မှာ သီးခြား မရှိတဲ့ ယာယီ table) တစ်ခုကို ထုတ်ပေးပါတယ် — ဒီ table က select list ဆီ ပို့ပေးတဲ့ row တွေကို ပံ့ပိုးပြီး — select list ကနေ query ရဲ့ output row တွေကို တွက်ချက်ပါတယ်။

### 7.2.1. The `FROM` Clause (FROM clause)

[`FROM`](https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM) clause က — comma နဲ့ ခြားထားတဲ့ table reference (table ရည်ညွှန်းချက်) စာရင်းထဲက table တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ table တွေကနေ table တစ်ခုကို ဆင်းသက် ထုတ်ယူပါတယ်။

```sql
FROM table_reference [, table_reference [, ...]]
```

Table reference တစ်ခုက table ရဲ့ နာမည် (schema နဲ့ qualify လုပ်ထားတာလည်း ဖြစ်နိုင်ပါတယ်) ဖြစ်နိုင်သလို — subquery (အတွင်းခံ query) တစ်ခု၊ `JOIN` တည်ဆောက်ပုံ (construct) တစ်ခု ဒါမှမဟုတ် — ဒါတွေရဲ့ ရှုပ်ထွေးတဲ့ ပေါင်းစပ်မှုတွေ ဖြစ်တဲ့ derived table (ဆင်းသက်လာတဲ့ table) တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ `FROM` clause ထဲမှာ table reference တစ်ခုထက်ပိုပြီး စာရင်းပါရင် — table တွေကို cross join လုပ်ပါတယ် (ဆိုလိုတာက — သူတို့ရဲ့ row တွေရဲ့ Cartesian product (ဖြစ်နိုင်သမျှ row စုံတွဲ အားလုံး) ကို ဖွဲ့ပါတယ်; အောက်မှာ ကြည့်ပါ)။ `FROM` စာရင်းရဲ့ ရလဒ်က intermediate virtual table (ကြားခံ virtual table) တစ်ခု ဖြစ်ပြီး — ၎င်းကို `WHERE`, `GROUP BY`, `HAVING` clause တွေနဲ့ အသွင်ပြောင်းခံရနိုင်ပြီး — နောက်ဆုံးမှာတော့ table expression တစ်ခုလုံးရဲ့ ရလဒ် ဖြစ်လာပါတယ်။

Table reference တစ်ခုက — table inheritance hierarchy (table အမွေဆက်ခံမှု အဆင့်ဆင့်) တစ်ခုရဲ့ parent ဖြစ်နေတဲ့ table တစ်ခုကို နာမည်နဲ့ ရည်ညွှန်းတဲ့အခါ — table နာမည်ရဲ့ ရှေ့မှာ `ONLY` ဆိုတဲ့ key word မလိုက်ဘူးဆိုရင် — အဲဒီ table ရဲ့ row တွေသာမက — သူ့ရဲ့ descendant (သားစဉ်မြေးဆက်) table တွေအားလုံးရဲ့ row တွေကိုပါ ထုတ်ပေးပါတယ်။ ဒါပေမယ့် — reference က နာမည်ပေးထားတဲ့ table ထဲမှာ ရှိတဲ့ column တွေကိုပဲ ထုတ်ပေးပါတယ် — subtable တွေထဲမှာ ထပ်ပေါင်းထည့်ထားတဲ့ column တွေကိုတော့ လျစ်လျူရှုပါတယ်။

Table နာမည်ရဲ့ ရှေ့မှာ `ONLY` ရေးမယ့်အစား — table နာမည်ရဲ့ နောက်မှာ `*` ရေးပြီး — descendant table တွေပါ ထည့်သွင်းထားတယ်ဆိုတာကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်လို့လည်း ရပါတယ်။ ဒီ syntax ကို သုံးစရာ တကယ့် အကြောင်းပြချက် မရှိတော့ပါဘူး — အကြောင်းကတော့ descendant table တွေကို ရှာဖွေတာက အခုဆိုရင် အမြဲတမ်း default အပြုအမူ ဖြစ်နေလို့ပါ။ ဒါပေမယ့် — release အဟောင်းတွေနဲ့ လိုက်ဖက်ညီမှု (compatibility) အတွက်တော့ ဒီ syntax ကို ဆက်လက် ပံ့ပိုးထားပါတယ်။

#### 7.2.1.1. Joined Tables (join လုပ်ထားသော table များ)

Joined table (join လုပ်ထားတဲ့ table) ဆိုတာ — သတ်မှတ်ထားတဲ့ join type (join အမျိုးအစား) တစ်ခုရဲ့ စည်းမျဉ်းတွေအတိုင်း — တခြား table နှစ်ခု (အစစ်အမှန် ဒါမှမဟုတ် derived) ကနေ ဆင်းသက်လာတဲ့ table ပါ။ Inner join, outer join, နဲ့ cross join တွေ ရနိုင်ပါတယ်။ Joined table တစ်ခုရဲ့ ယေဘုယျ syntax ကတော့ —

```sql
T1 join_type T2 [ join_condition ]
```

Join အမျိုးအစားအားလုံးကို တစ်ခုနဲ့တစ်ခု ဆက်တိုက် chain လုပ်လို့ရသလို — nested (အသိုက်အမြုံ စီစဉ်) လုပ်လို့လည်း ရပါတယ်: `T1` နဲ့ `T2` ထဲက တစ်ခုခု ဒါမှမဟုတ် နှစ်ခုလုံးကိုယ်တိုင်က joined table တွေ ဖြစ်နိုင်ပါတယ်။ Join အစဉ်ကို ထိန်းချုပ်ဖို့ `JOIN` clause တွေကို parenthesis နဲ့ ဝိုင်းရံလို့ရပါတယ်။ Parenthesis မရှိတဲ့အခါ — `JOIN` clause တွေက ဘယ်ကနေ ညာကို nested ဖြစ်ပါတယ်။

**Join Types (join အမျိုးအစားများ)**

- **Cross join** — T1 CROSS JOIN T2

`T1` နဲ့ `T2` ရဲ့ row တွေရဲ့ ဖြစ်နိုင်တဲ့ ပေါင်းစပ်မှု (combination) တိုင်းအတွက် (ဆိုလိုတာက — Cartesian product) — joined table ထဲမှာ `T1` ရဲ့ column အားလုံး နောက်မှာ `T2` ရဲ့ column အားလုံး လိုက်တဲ့ row တစ်ခု ပါဝင်ပါတယ်။ Table တွေမှာ row အရေအတွက် N နဲ့ M အသီးသီး ရှိရင် — joined table မှာ row N * M ရှိပါလိမ့်မယ်။ `FROM T1 CROSS JOIN T2` က `FROM T1 INNER JOIN T2 ON TRUE` နဲ့ ညီမျှပါတယ် (အောက်မှာ ကြည့်ပါ)။ ၎င်းက `FROM T1, T2` နဲ့လည်း ညီမျှပါတယ်။

> **မှတ်ချက်:** ဒီညီမျှမှု (equivalence) က table နှစ်ခုထက်ပိုပြီး ပါဝင်တဲ့အခါမှာတော့ တိတိကျကျ မမှန်တော့ပါဘူး — အကြောင်းကတော့ `JOIN` က comma ထက် ပိုတင်းကျပ်စွာ ချိတ်ဆက် (bind) လို့ပါ။ ဥပမာ — `FROM T1 CROSS JOIN T2 INNER JOIN T3 ON condition` က `FROM T1, T2 INNER JOIN T3 ON condition` နဲ့ မတူပါဘူး — အကြောင်းကတော့ ပထမ ကိစ္စမှာ condition က `T1` ကို ရည်ညွှန်းလို့ ရပေမယ့် — ဒုတိယ ကိစ္စမှာတော့ မရလို့ပါ။

- **Qualified joins** — T1 { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2 ON boolean_expression
T1 { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2 USING ( join column list )
T1 NATURAL { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2

ပုံစံအားလုံးမှာ `INNER` နဲ့ `OUTER` ဆိုတဲ့ စကားလုံးတွေက ထည့်လည်း ရ မထည့်လည်း ရပါတယ်။ Default ကတော့ `INNER` ပါ; `LEFT`, `RIGHT`, နဲ့ `FULL` တွေကတော့ outer join ကို ဆိုလိုပါတယ်။ Join condition (join လုပ်ရာမှာ ကိုက်ညီမှု စစ်ဆေးတဲ့ အခြေအနေ) ကို `ON` ဒါမှမဟုတ် `USING` clause ထဲမှာ သတ်မှတ်ပါတယ် — ဒါမှမဟုတ် `NATURAL` ဆိုတဲ့ စကားလုံးနဲ့ သွယ်ဝိုက်ပြီး သတ်မှတ်ပါတယ်။ Join condition က source table နှစ်ခုထဲက ဘယ် row တွေကို “match” (ကိုက်ညီ) တယ်လို့ သတ်မှတ်မလဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ် — အသေးစိတ်ကို အောက်မှာ ရှင်းပြထားပါတယ်။

Qualified join ရဲ့ ဖြစ်နိုင်တဲ့ အမျိုးအစားတွေကတော့:

**INNER JOIN**

`T1` ရဲ့ row `R1` တစ်ခုချင်းစီအတွက် — `T2` ထဲက `R1` နဲ့ join condition ကို ကျေနပ်တဲ့ row တစ်ခုချင်းစီအလိုက် — joined table ထဲမှာ row တစ်ခုစီ ပါဝင်ပါတယ်။

**LEFT OUTER JOIN**

ပထမဆုံး inner join ကို လုပ်ပါတယ်။ ပြီးတော့ — `T2` ထဲက row တစ်ခုခုနဲ့မှ join condition ကို မကျေနပ်တဲ့ `T1` ရဲ့ row တစ်ခုချင်းစီအတွက် — `T2` ရဲ့ column တွေမှာ null value တွေနဲ့ အတူ joined row တစ်ခုကို ထပ်ပေါင်းထည့်ပါတယ်။ ဒါကြောင့် — joined table ထဲမှာ `T1` ရဲ့ row တိုင်းအတွက် အနည်းဆုံး row တစ်ခု အမြဲ ပါဝင်ပါတယ်။

**RIGHT OUTER JOIN**

ပထမဆုံး inner join ကို လုပ်ပါတယ်။ ပြီးတော့ — `T1` ထဲက row တစ်ခုခုနဲ့မှ join condition ကို မကျေနပ်တဲ့ `T2` ရဲ့ row တစ်ခုချင်းစီအတွက် — `T1` ရဲ့ column တွေမှာ null value တွေနဲ့ အတူ joined row တစ်ခုကို ထပ်ပေါင်းထည့်ပါတယ်။ ဒါက left join ရဲ့ ပြောင်းပြန် (converse) ပါ: ရလဒ် table ထဲမှာ `T2` ရဲ့ row တိုင်းအတွက် row တစ်ခု အမြဲ ရှိပါလိမ့်မယ်။

**FULL OUTER JOIN**

ပထမဆုံး inner join ကို လုပ်ပါတယ်။ ပြီးတော့ — `T2` ထဲက row တစ်ခုခုနဲ့မှ join condition ကို မကျေနပ်တဲ့ `T1` ရဲ့ row တစ်ခုချင်းစီအတွက် — `T2` ရဲ့ column တွေမှာ null value တွေနဲ့ အတူ joined row တစ်ခုကို ထပ်ပေါင်းထည့်ပါတယ်။ ဒါ့အပြင် — `T1` ထဲက row တစ်ခုခုနဲ့မှ join condition ကို မကျေနပ်တဲ့ `T2` ရဲ့ row တစ်ခုချင်းစီအတွက်လည်း — `T1` ရဲ့ column တွေမှာ null value တွေပါတဲ့ joined row တစ်ခုကို ထပ်ပေါင်းထည့်ပါတယ်။

`ON` clause က join condition ရဲ့ အသုံးအများဆုံး (အထွေထွေဆုံး) ပုံစံပါ: ၎င်းက `WHERE` clause တစ်ခုထဲမှာ သုံးတဲ့ ပုံစံမျိုးတူ Boolean value expression တစ်ခုကို ယူပါတယ်။ `ON` expression က true လို့ အကဲဖြတ်ရရင် — `T1` နဲ့ `T2` က row အတွဲတစ်ခုဟာ match (ကိုက်ညီ) ပါတယ်။

`USING` clause က အတိုကောက် (shorthand) တစ်ခု ဖြစ်ပြီး — join ရဲ့ ဘက်နှစ်ဖက်စလုံးက join လုပ်မယ့် column (များ) အတွက် နာမည်တူ သုံးထားတဲ့ အခြေအနေကို အခွင့်ကောင်းယူနိုင်အောင် လုပ်ပေးပါတယ်။ ၎င်းက မျှဝေထားတဲ့ (shared) column နာမည်တွေရဲ့ comma ခြားထားတဲ့ စာရင်းကို ယူပြီး — နာမည်တစ်ခုချင်းစီအတွက် တူညီမှု နှိုင်းယှဉ်ချက် (equality comparison) တစ်ခုစီ ပါဝင်တဲ့ join condition တစ်ခုကို ဖွဲ့ပေးပါတယ်။ ဥပမာ — `T1` နဲ့ `T2` ကို `USING (a, b)` နဲ့ join လုပ်ရင် — `ON T1.a = T2.a AND T1.b = T2.b` ဆိုတဲ့ join condition ကို ထုတ်ပေးပါတယ်။

ဒါ့အပြင် — `JOIN USING` ရဲ့ output က ထပ်နေတဲ့ (redundant) column တွေကို ဖိနှိပ် ဖယ်ရှားပါတယ်: match ဖြစ်တဲ့ column နှစ်ခုလုံးကို ပြဖို့ မလိုပါဘူး — အကြောင်းကတော့ သူတို့မှာ တူညီတဲ့ တန်ဖိုးတွေ ရှိရမှာမို့ပါ။ `JOIN ON` က `T1` ရဲ့ column အားလုံး နောက်မှာ `T2` ရဲ့ column အားလုံးကို ထုတ်ပေးပေမယ့် — `JOIN USING` ကတော့ စာရင်းထဲက column အတွဲတစ်ခုချင်းစီအတွက် output column တစ်ခုစီ (စာရင်း အစဉ်အတိုင်း) ထုတ်ပေးပြီး — နောက်မှာ `T1` ထဲက ကျန်ရှိတဲ့ column တွေ၊ ပြီးတော့မှ `T2` ထဲက ကျန်ရှိတဲ့ column တွေကို လိုက်ပါတယ်။

နောက်ဆုံးအနေနဲ့ — `NATURAL` က `USING` ရဲ့ အတိုကောက်ပုံစံ ဖြစ်ပါတယ်: ၎င်းက input table နှစ်ခုလုံးမှာ ပါဝင်နေတဲ့ column နာမည်အားလုံးနဲ့ ဖွဲ့စည်းထားတဲ့ `USING` စာရင်းတစ်ခုကို ဖွဲ့ပါတယ်။ `USING` လိုပဲ — ဒီ column တွေက output table ထဲမှာ တစ်ခါပဲ ပေါ်ပါတယ်။ Column နာမည် တူညီနေတာ တစ်ခုမှ မရှိဘူးဆိုရင် — `NATURAL JOIN` က `CROSS JOIN` လိုပဲ ပြုမူပါတယ်။

> **မှတ်ချက်:** `USING` က — စာရင်းထဲပါတဲ့ column တွေကိုပဲ ပေါင်းစပ်လို့ — join လုပ်ထားတဲ့ relation တွေမှာ column တွေ ပြောင်းလဲသွားရင်တောင် အတော်လေး စိတ်ချရပါတယ်။ `NATURAL` ကတော့ သိသိသာသာ စွန့်စားမှု ပိုများပါတယ် — အကြောင်းကတော့ relation တစ်ခုခုမှာ schema ပြောင်းလဲမှုကြောင့် ကိုက်ညီနေတဲ့ column နာမည်အသစ် တစ်ခု ပေါ်လာရင် — join က အဲဒီ column အသစ်ကိုပါ ပေါင်းစပ်လိုက်လို့ပါ။

ဒါတွေကို စုစည်းကြည့်ဖို့ — `t1` table ရှိတယ်ဆိုပါစို့:

```sql
 num | name
-----+------
   1 | a
   2 | b
   3 | c
```

ပြီးတော့ `t2`:

```sql
 num | value
-----+-------
   1 | xxx
   3 | yyy
   5 | zzz
```

ဒါဆိုရင် join အမျိုးမျိုးအတွက် အောက်ပါ ရလဒ်တွေကို ရပါတယ်:

```
=> SELECT * FROM t1 CROSS JOIN t2;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   1 | a    |   3 | yyy
   1 | a    |   5 | zzz
   2 | b    |   1 | xxx
   2 | b    |   3 | yyy
   2 | b    |   5 | zzz
   3 | c    |   1 | xxx
   3 | c    |   3 | yyy
   3 | c    |   5 | zzz
(9 rows)

=> SELECT * FROM t1 INNER JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   3 | c    |   3 | yyy
(2 rows)

=> SELECT * FROM t1 INNER JOIN t2 USING (num);
 num | name | value
-----+------+-------
   1 | a    | xxx
   3 | c    | yyy
(2 rows)

=> SELECT * FROM t1 NATURAL INNER JOIN t2;
 num | name | value
-----+------+-------
   1 | a    | xxx
   3 | c    | yyy
(2 rows)

=> SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   2 | b    |     |
   3 | c    |   3 | yyy
(3 rows)

=> SELECT * FROM t1 LEFT JOIN t2 USING (num);
 num | name | value
-----+------+-------
   1 | a    | xxx
   2 | b    |
   3 | c    | yyy
(3 rows)

=> SELECT * FROM t1 RIGHT JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   3 | c    |   3 | yyy
     |      |   5 | zzz
(3 rows)

=> SELECT * FROM t1 FULL JOIN t2 ON t1.num = t2.num;
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   2 | b    |     |
   3 | c    |   3 | yyy
     |      |   5 | zzz
(4 rows)
```

`ON` နဲ့ သတ်မှတ်ထားတဲ့ join condition ထဲမှာ — join နဲ့ တိုက်ရိုက် မသက်ဆိုင်တဲ့ condition တွေလည်း ပါဝင်နိုင်ပါတယ်။ ဒါက query တချို့အတွက် အသုံးဝင်နိုင်ပေမယ့် — သေချာ စဉ်းစားဆုံးဖြတ်ဖို့တော့ လိုပါတယ်။ ဥပမာ:

```
=> SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num AND t2.value = 'xxx';
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
   2 | b    |     |
   3 | c    |     |
(3 rows)
```

`WHERE` clause ထဲမှာ ကန့်သတ်ချက်ကို ထည့်လိုက်ရင် မတူညီတဲ့ ရလဒ်တစ်ခုကို ထုတ်ပေးတာ သတိပြုပါ:

```
=> SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num WHERE t2.value = 'xxx';
 num | name | num | value
-----+------+-----+-------
   1 | a    |   1 | xxx
(1 row)
```

အကြောင်းကတော့ — `ON` clause ထဲမှာ ထည့်ထားတဲ့ ကန့်သတ်ချက်ကို join မလုပ်ခင် လုပ်ဆောင်ပြီး — `WHERE` clause ထဲမှာ ထည့်ထားတဲ့ ကန့်သတ်ချက်ကိုတော့ join ပြီးမှ လုပ်ဆောင်လို့ပါ။ Inner join တွေအတွက်တော့ ဒါက ကိစ္စမရှိပေမယ့် — outer join တွေအတွက်တော့ အများကြီး အရေးပါပါတယ်။

#### 7.2.1.2. Table and Column Aliases (table နဲ့ column alias များ)

Table တွေနဲ့ ရှုပ်ထွေးတဲ့ table reference တွေကို — query ရဲ့ ကျန်အပိုင်းတွေမှာ ဆင်းသက်လာတဲ့ table ကို ရည်ညွှန်းဖို့အတွက် — ခေတ္တ နာမည်တစ်ခု ပေးလို့ရပါတယ်။ ဒါကို *table alias* (table ရဲ့ ခေတ္တ နာမည်) လို့ ခေါ်ပါတယ်။

Table alias တစ်ခု ဖန်တီးဖို့ — ဒီလိုရေးပါ:

```sql
FROM table_reference AS alias
```

ဒါမှမဟုတ်

```sql
FROM table_reference alias
```

`AS` ဆိုတဲ့ key word က မထည့်လည်း ရတဲ့ အလှဆင် စကားလုံးပါ။ `alias` ကတော့ identifier ဘာမဆို ဖြစ်နိုင်ပါတယ်။

Table alias တွေရဲ့ ပုံမှန် အသုံးတစ်ခုကတော့ — join clause တွေကို ဖတ်ရလွယ်အောင် — ရှည်လျားတဲ့ table နာမည်တွေကို အတိုကောက် identifier တွေနဲ့ သတ်မှတ်ပေးတာပါ။ ဥပမာ:

```sql
SELECT * FROM some_very_long_table_name s JOIN another_fairly_long_name a ON s.id = a.num;
```

လက်ရှိ query အတွက်ဆိုရင် — alias က table reference ရဲ့ နာမည်အသစ် ဖြစ်သွားပါတယ် — query ထဲက တခြားနေရာတွေမှာ မူလ နာမည်နဲ့ table ကို ပြန်ရည်ညွှန်းလို့ မရတော့ပါဘူး။ ဒါကြောင့် — ဒါက မမှန်ကန်ပါဘူး:

```sql
SELECT * FROM my_table AS m WHERE my_table.a > 5;    -- wrong
```

Table alias တွေက အဓိကအားဖြင့် ရေးသားမှု အဆင်ပြေစေဖို့ ဖြစ်ပေမယ့် — table တစ်ခုကို သူ့ဘာသာသူနဲ့ join လုပ်တဲ့အခါမှာတော့ မဖြစ်မနေ သုံးဖို့ လိုပါတယ်။ ဥပမာ:

```sql
SELECT * FROM people AS mother JOIN people AS child ON mother.id = child.mother_id;
```

မရှင်းလင်းမှု (ambiguity) တွေကို ဖြေရှင်းဖို့ parenthesis တွေကို သုံးပါတယ်။ အောက်က ဥပမာမှာ — ပထမ statement က `my_table` ရဲ့ ဒုတိယ instance ကို alias `b` ပေးပြီး — ဒုတိယ statement ကတော့ join ရဲ့ ရလဒ်ကို alias ပေးပါတယ်:

```sql
SELECT * FROM my_table AS a CROSS JOIN my_table AS b ...
SELECT * FROM (my_table AS a CROSS JOIN my_table) AS b ...
```

Table aliasing ရဲ့ နောက်ထပ် ပုံစံတစ်ခုကတော့ — table ကိုယ်တိုင်သာမက — table ရဲ့ column တွေကိုပါ ခေတ္တ နာမည်တွေ ပေးတာပါ:

```sql
FROM table_reference [AS] alias ( column1 [, column2 [, ...]] )
```

Column alias အရေအတွက်က — table မှာ တကယ်ရှိတဲ့ column အရေအတွက်ထက် နည်းရင် — ကျန်တဲ့ column တွေကိုတော့ နာမည်ပြောင်း မပေးပါဘူး။ ဒီ syntax က self join (table တစ်ခုကို သူ့ဘာသာသူနဲ့ join လုပ်ခြင်း) တွေ ဒါမှမဟုတ် subquery တွေအတွက် အထူး အသုံးဝင်ပါတယ်။

`JOIN` clause တစ်ခုရဲ့ output ကို alias ပေးလိုက်တဲ့အခါ — alias က `JOIN` အတွင်းက မူလ နာမည် (များ) ကို ဖုံးကွယ်လိုက်ပါတယ်။ ဥပမာ:

```sql
SELECT a.* FROM my_table AS a JOIN your_table AS b ON ...
```

ဒါက မှန်ကန်တဲ့ SQL ဖြစ်ပေမယ့်:

```sql
SELECT a.* FROM (my_table AS a JOIN your_table AS b ON ...) AS c
```

ဒါကတော့ မမှန်ကန်ပါဘူး; table alias `a` က alias `c` ရဲ့ အပြင်ဘက်ကနေ မမြင်ရပါဘူး။

#### 7.2.1.3. Subqueries (subquery များ)

Derived table တစ်ခုကို သတ်မှတ်တဲ့ subquery တွေကို parenthesis နဲ့ ဝိုင်းရံထားရပါမယ်။ သူတို့ကို table alias နာမည်တစ်ခု သတ်မှတ်ပေးလို့ရပြီး — လိုအပ်ရင် column alias နာမည်တွေပါ သတ်မှတ်ပေးလို့ရပါတယ် ([အပိုင်း 7.2.1.2](/docs/postgresql/queries-table-expressions) မှာ ပြထားသလို)။ ဥပမာ:

```sql
FROM (SELECT * FROM table1) AS alias_name
```

ဒီဥပမာက `FROM table1 AS alias_name` နဲ့ ညီမျှပါတယ်။ ပိုစိတ်ဝင်စားစရာကောင်းတဲ့ ကိစ္စတွေကတော့ — subquery ထဲမှာ grouping ဒါမှမဟုတ် aggregation (စုစည်း တွက်ချက်မှု) ပါဝင်လာတဲ့အခါ — သာမန် join တစ်ခုအဖြစ် လျှော့ချလို့ မရတော့တဲ့ ကိစ္စတွေပါ။

Subquery တစ်ခုက `VALUES` list တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်:

```sql
FROM (VALUES ('anne', 'smith'), ('bob', 'jones'), ('joe', 'blow'))
     AS names(first, last)
```

ထပ်ပြောရရင် — table alias က မထည့်လည်း ရပါတယ်။ `VALUES` list ရဲ့ column တွေကို alias နာမည်တွေ သတ်မှတ်ပေးတာကလည်း — မထည့်လည်း ရပေမယ့် — ကောင်းတဲ့ အလေ့အကျင့်တစ်ခုပါ။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 7.7](/docs/postgresql/queries-values) ကို ကြည့်ပါ။

SQL standard အရဆိုရင် — subquery တစ်ခုအတွက် table alias နာမည်တစ်ခု ပေးထားရပါတယ်။ PostgreSQL ကတော့ `AS` နဲ့ alias ကို ချန်လိုက်တာကိုပါ ခွင့်ပြုပါတယ် — ဒါပေမယ့် — တခြား system တစ်ခုကို ရွှေ့ပြောင်းသုံးနိုင်တဲ့ SQL code တွေမှာဆိုရင် alias တစ်ခု ရေးထားတာ ကောင်းတဲ့ အလေ့အကျင့်ပါ။

#### 7.2.1.4. Table Functions (table function များ)

Table function တွေဆိုတာ — base data type (scalar type) တွေ ဒါမှမဟုတ် composite data type (table row) တွေနဲ့ ဖွဲ့စည်းထားတဲ့ — row အစုတစ်စု ထုတ်ပေးတဲ့ function တွေပါ။ သူတို့ကို query တစ်ခုရဲ့ `FROM` clause ထဲမှာ table, view (မြင်ကွင်း), ဒါမှမဟုတ် subquery တစ်ခုလို အသုံးပြုပါတယ်။ Table function တွေ ပြန်ပေးတဲ့ column တွေကို — table, view, subquery တစ်ခုရဲ့ column တွေလိုပဲ — `SELECT`, `JOIN`, ဒါမှမဟုတ် `WHERE` clause တွေထဲမှာ ထည့်သုံးလို့ရပါတယ်။

Table function တွေကို `ROWS FROM` syntax သုံးပြီး ပေါင်းစပ်လို့လည်း ရပါတယ် — ရလဒ်တွေကို column တွေ ဘေးတိုက် (parallel) အနေနဲ့ ပြန်ပေးပါတယ်; ဒီကိစ္စမှာ result row အရေအတွက်က — function တွေထဲက အကြီးဆုံး ရလဒ်ရဲ့ အရေအတွက် ဖြစ်ပြီး — သေးငယ်တဲ့ ရလဒ်တွေကို null value တွေနဲ့ ဖြည့်ပေးပြီး ကိုက်ညီအောင် လုပ်ပါတယ်။

```sql
function_call [WITH ORDINALITY] [[AS] table_alias [(column_alias [, ... ])]]
ROWS FROM( function_call [, ... ] ) [WITH ORDINALITY] [[AS] table_alias [(column_alias [, ... ])]]
```

`WITH ORDINALITY` clause ကို သတ်မှတ်ထားရင် — function ရဲ့ result column တွေထဲကို `bigint` type ရှိတဲ့ column ထပ်တစ်ခု ပေါင်းထည့်ပါလိမ့်မယ်။ ဒီ column က function result set ထဲက row တွေကို 1 ကစပြီး နံပါတ်စဉ် သတ်မှတ်ပေးပါတယ်။ (ဒါက SQL standard ရဲ့ `UNNEST ... WITH ORDINALITY` syntax ကို ယေဘုယျ ချဲ့ထွင်ထားတာ ဖြစ်ပါတယ်။) Default အနေနဲ့ — ordinal column ကို `ordinality` လို့ ခေါ်ပြီး — `AS` clause သုံးပြီး တခြား column နာမည် တစ်ခု သတ်မှတ်ပေးလို့လည်း ရပါတယ်။

အထူး table function ဖြစ်တဲ့ `UNNEST` ကို — array parameter အရေအတွက် ဘယ်လောက်နဲ့မဆို ခေါ်လို့ရပြီး — parameter တစ်ခုချင်းစီအပေါ် `UNNEST` ([အပိုင်း 9.19](https://www.postgresql.org/docs/current/functions-array.html)) ကို သီးခြားခေါ်ပြီး `ROWS FROM` တည်ဆောက်ပုံနဲ့ ပေါင်းစပ်ထားသလို — ကိုက်ညီတဲ့ column အရေအတွက်ကို ပြန်ပေးပါတယ်။

```sql
UNNEST( array_expression [, ... ] ) [WITH ORDINALITY] [[AS] table_alias [(column_alias [, ... ])]]
```

`table_alias` မသတ်မှတ်ထားရင် — function ရဲ့ နာမည်ကိုပဲ table နာမည်အနေနဲ့ သုံးပါတယ်; `ROWS FROM()` တည်ဆောက်ပုံ ဖြစ်ရင်တော့ — ပထမဆုံး function ရဲ့ နာမည်ကို သုံးပါတယ်။

Column alias တွေ မပေးထားရင် — base data type ပြန်ပေးတဲ့ function အတွက်ဆိုရင် column နာမည်ကလည်း function ရဲ့ နာမည်နဲ့ပဲ တူပါတယ်။ Composite type ပြန်ပေးတဲ့ function အတွက်ကတော့ — result column တွေက type ထဲက attribute တစ်ခုချင်းစီရဲ့ နာမည်တွေကို ရယူပါတယ်။

ဥပမာအချို့:

```
CREATE TABLE foo (fooid int, foosubid int, fooname text);

CREATE FUNCTION getfoo(int) RETURNS SETOF foo AS $$
    SELECT * FROM foo WHERE fooid = $1;
$$ LANGUAGE SQL;

SELECT * FROM getfoo(1) AS t1;

SELECT * FROM foo
    WHERE foosubid IN (
                        SELECT foosubid
                        FROM getfoo(foo.fooid) z
                        WHERE z.fooid = foo.fooid
                      );

CREATE VIEW vw_getfoo AS SELECT * FROM getfoo(1);

SELECT * FROM vw_getfoo;
```

တချို့ ကိစ္စတွေမှာ — ဘယ်လို ခေါ်လဲဆိုတာပေါ် မူတည်ပြီး — မတူညီတဲ့ column အစုတွေ ပြန်ပေးနိုင်တဲ့ table function တွေ သတ်မှတ်တာ အသုံးဝင်ပါတယ်။ ဒါကို ပံ့ပိုးဖို့ — table function ကို `OUT` parameter တွေ မပါဘဲ — pseudo-type `record` ကို ပြန်ပေးတဲ့ function အဖြစ် ကြေညာနိုင်ပါတယ်။ ဒီလို function တစ်ခုကို query ထဲမှာ သုံးတဲ့အခါ — မျှော်လင့်ထားတဲ့ row တည်ဆောက်ပုံကို query ထဲမှာကိုယ်တိုင် သတ်မှတ်ပေးရပါတယ် — ဒါမှ system က query ကို ဘယ်လို parse လုပ်ပြီး plan လုပ်ရမလဲဆိုတာ သိနိုင်မှာပါ။ ဒီ syntax ကတော့ ဒီလိုပုံစံ ဖြစ်ပါတယ်:

```sql
function_call [AS] alias (column_definition [, ... ])
function_call AS [alias] (column_definition [, ... ])
ROWS FROM( ... function_call AS (column_definition [, ... ]) [, ... ] )
```

`ROWS FROM()` syntax ကို မသုံးတဲ့အခါ — `column_definition` စာရင်းက — `FROM` item တစ်ခုမှာ တွဲထည့်နိုင်မယ့် column alias စာရင်းရဲ့ နေရာကို ယူပါတယ်; column definition တွေထဲက နာမည်တွေက column alias တွေအဖြစ် ဆောင်ရွက်ပါတယ်။ `ROWS FROM()` syntax ကို သုံးတဲ့အခါမှာတော့ — `column_definition` စာရင်းကို member function တစ်ခုချင်းစီမှာ သီးခြားစီ တွဲထည့်လို့ရပါတယ်; ဒါမှမဟုတ် — member function တစ်ခုပဲ ရှိပြီး `WITH ORDINALITY` clause မပါဘူးဆိုရင် — `ROWS FROM()` နောက်မှာ column alias စာရင်း ရေးရမယ့်နေရာမှာ `column_definition` စာရင်း တစ်ခုကို ရေးလို့ရပါတယ်။

ဒီဥပမာကို ကြည့်ပါ:

```sql
SELECT *
    FROM dblink('dbname=mydb', 'SELECT proname, prosrc FROM pg_proc')
      AS t1(proname name, prosrc text)
    WHERE proname LIKE 'bytea%';
```

[dblink](https://www.postgresql.org/docs/current/contrib-dblink-function.html) function က ([dblink](https://www.postgresql.org/docs/current/dblink.html) module ရဲ့ အစိတ်အပိုင်း) — remote (ဝေးလံတဲ့ နေရာမှာ ရှိတဲ့) query တစ်ခုကို လုပ်ဆောင်ပေးပါတယ်။ ၎င်းကို query ဘယ်လိုမျိုးအတွက်မဆို သုံးနိုင်လို့ — `record` ပြန်ပေးတယ်လို့ ကြေညာထားပါတယ်။ တကယ့် column အစုကို ခေါ်ယူတဲ့ query ထဲမှာ သတ်မှတ်ပေးရပါတယ် — ဒါမှ parser က ဥပမာ `*` ကို ဘာအဖြစ် ချဲ့ထွင်ရမလဲဆိုတာ သိနိုင်မှာပါ။

ဒီဥပမာက `ROWS FROM` ကို သုံးထားပါတယ်:

```sql
SELECT *
FROM ROWS FROM
    (
        json_to_recordset('[{"a":40,"b":"foo"},{"a":"100","b":"bar"}]')
            AS (a INTEGER, b TEXT),
        generate_series(1, 3)
    ) AS x (p, q, s)
ORDER BY p;

  p  |  q  | s
-----+-----+---
  40 | foo | 1
 100 | bar | 2
     |     | 3
```

ဒါက function နှစ်ခုကို `FROM` target တစ်ခုတည်းထဲ ပေါင်းစပ်ထားပါတယ်။ `json_to_recordset()` ကို column နှစ်ခု — ပထမက `integer`, ဒုတိယက `text` — ပြန်ပေးဖို့ ညွှန်ကြားထားပါတယ်။ `generate_series()` ရဲ့ ရလဒ်ကိုတော့ တိုက်ရိုက် သုံးပါတယ်။ `ORDER BY` clause က column တန်ဖိုးတွေကို integer တွေအနေနဲ့ စီပေးပါတယ်။

#### 7.2.1.5. `LATERAL` Subqueries (LATERAL subquery များ)

`FROM` ထဲမှာ ပေါ်တဲ့ subquery တွေရဲ့ ရှေ့မှာ `LATERAL` ဆိုတဲ့ key word ကို ထည့်လို့ရပါတယ်။ ဒါက subquery တွေကို — သူတို့ထက် ရှေ့က `FROM` item တွေက ပံ့ပိုးပေးတဲ့ column တွေကို ရည်ညွှန်းခွင့် ပေးပါတယ်။ (`LATERAL` မပါရင် — subquery တစ်ခုချင်းစီကို သီးခြား အကဲဖြတ်ပြီး — တခြား `FROM` item တစ်ခုခုကို ကူးညွှန်း (cross-reference) လုပ်လို့ မရပါဘူး။)

`FROM` ထဲမှာ ပေါ်တဲ့ table function တွေရဲ့ ရှေ့မှာလည်း `LATERAL` key word ကို ထည့်လို့ရပါတယ် — ဒါပေမယ့် function တွေအတွက်ကတော့ ဒီ key word က မထည့်လည်း ရပါတယ်; အကြောင်းကတော့ function ရဲ့ argument တွေထဲမှာ — ဘယ်ကိစ္စမှာမဆို — ရှေ့က `FROM` item တွေက ပံ့ပိုးပေးတဲ့ column တွေကို ရည်ညွှန်းချက်တွေ ထည့်လို့ရလို့ပါ။

`LATERAL` item တစ်ခုက `FROM` list ရဲ့ ထိပ်တန်း (top level) မှာ ဖြစ်စေ — `JOIN` tree တစ်ခုရဲ့ အတွင်းမှာ ဖြစ်စေ — ပေါ်နိုင်ပါတယ်။ နောက်ဆုံး ကိစ္စမှာဆိုရင် ၎င်းက — သူ့ကိုယ်သူ ညာဘက်ခြမ်းမှာ ရှိနေတဲ့ `JOIN` တစ်ခုရဲ့ — ဘယ်ဘက်ခြမ်းမှာ ရှိတဲ့ item တွေကိုပါ ရည်ညွှန်းလို့ ရပါတယ်။

`FROM` item တစ်ခုထဲမှာ `LATERAL` ကူးညွှန်းချက်တွေ ပါနေရင် — အကဲဖြတ်မှုက ဒီလို ဆောင်ရွက်ပါတယ်: ကူးညွှန်းခံရတဲ့ column (များ) ကို ပံ့ပိုးပေးတဲ့ `FROM` item ရဲ့ row တစ်ခုချင်းစီအတွက် — ဒါမှမဟုတ် column တွေကို ပံ့ပိုးပေးတဲ့ `FROM` item အများကြီးရဲ့ row အစုတစ်ခုချင်းစီအတွက် — `LATERAL` item ကို အဲဒီ row ဒါမှမဟုတ် row အစုရဲ့ column တန်ဖိုးတွေနဲ့ အကဲဖြတ်ပါတယ်။ ရလာတဲ့ row (များ) ကို — သူတို့ ဘယ်ကနေ တွက်ချက်ခဲ့တဲ့ row တွေနဲ့ — ပုံမှန်အတိုင်း join လုပ်ပါတယ်။ ဒါက column ရင်းမြစ် table (များ) ကနေ row တစ်ခုစီ ဒါမှမဟုတ် row အစုတစ်ခုစီအတွက် ထပ်ခါထပ်ခါ လုပ်ပါတယ်။

`LATERAL` ရဲ့ ရိုးရှင်းတဲ့ ဥပမာတစ်ခုကတော့ —

```sql
SELECT * FROM foo, LATERAL (SELECT * FROM bar WHERE bar.id = foo.bar_id) ss;
```

ဒါက အထူး အသုံးဝင်တာတော့ မဟုတ်ပါဘူး — အကြောင်းကတော့ ပိုပြီး သမားရိုးကျ ဖြစ်တဲ့ ဒီ query နဲ့ ရလဒ် အတိအကျ တူလို့ပါ:

```sql
SELECT * FROM foo, bar WHERE bar.id = foo.bar_id;
```

`LATERAL` က — ကူးညွှန်းခံရတဲ့ column က join လုပ်ရမယ့် row (များ) ကို တွက်ချက်ဖို့ မရှိမဖြစ် လိုအပ်တဲ့အခါမျိုးမှာ — အဓိက အသုံးဝင်ပါတယ်။ အသုံးများတဲ့ နေရာတစ်ခုကတော့ — set-returning function (row အစု ပြန်ပေးတဲ့ function) တစ်ခုအတွက် argument တန်ဖိုး ထောက်ပံ့ပေးတာပါ။ ဥပမာ — `vertices(polygon)` က polygon တစ်ခုရဲ့ vertex (ထောင့်စွန်း) အစုကို ပြန်ပေးတယ်ဆိုရင် — table ထဲမှာ သိမ်းထားတဲ့ polygon တွေရဲ့ နီးကပ်နေတဲ့ vertex တွေကို ဒီလိုနဲ့ ဖော်ထုတ်နိုင်ပါတယ်:

```sql
SELECT p1.id, p2.id, v1, v2
FROM polygons p1, polygons p2,
     LATERAL vertices(p1.poly) v1,
     LATERAL vertices(p2.poly) v2
WHERE (v1 <-> v2) < 10 AND p1.id != p2.id;
```

ဒီ query ကို ဒီလိုလည်း ရေးလို့ရပါတယ် —

```sql
SELECT p1.id, p2.id, v1, v2
FROM polygons p1 CROSS JOIN LATERAL vertices(p1.poly) v1,
     polygons p2 CROSS JOIN LATERAL vertices(p2.poly) v2
WHERE (v1 <-> v2) < 10 AND p1.id != p2.id;
```

ဒါမှမဟုတ် — ညီမျှတဲ့ တခြား ပုံစံကွဲ (formulation) တွေ အများကြီးနဲ့လည်း ရေးလို့ရပါတယ်။ (အပေါ်မှာ ပြောခဲ့သလို — ဒီဥပမာမှာ `LATERAL` key word က မလိုအပ်ပါဘူး — ဒါပေမယ့် ရှင်းလင်းစေဖို့ သုံးထားတာပါ။)

`LATERAL` subquery တစ်ခုကို `LEFT JOIN` လုပ်တာက မကြာခဏ အထူး အဆင်ပြေပါတယ် — ဒါဆိုရင် `LATERAL` subquery က သူတို့အတွက် row တစ်ခုမှ မထုတ်ပေးဘူးဆိုရင်တောင် — source row တွေက ရလဒ်ထဲမှာ ပေါ်နေမှာမို့ပါ။ ဥပမာ — `get_product_names()` က ထုတ်လုပ်သူ (manufacturer) တစ်ယောက် ထုတ်လုပ်တဲ့ product တွေရဲ့ နာမည်တွေကို ပြန်ပေးပေမယ့် — ကျွန်တော်တို့ရဲ့ table ထဲက manufacturer တချို့က လောလောဆယ် product တစ်ခုမှ မထုတ်လုပ်ရသေးဘူးဆိုရင် — ဘယ်သူတွေ ဖြစ်မလဲဆိုတာကို ဒီလိုမျိုး ရှာဖွေနိုင်ပါတယ်:

```sql
SELECT m.name
FROM manufacturers m LEFT JOIN LATERAL get_product_names(m.id) pname ON true
WHERE pname IS NULL;
```

### 7.2.2. The `WHERE` Clause (WHERE clause)

[`WHERE`](https://www.postgresql.org/docs/current/sql-select.html#SQL-WHERE) clause ရဲ့ syntax ကတော့ —

```sql
WHERE search_condition
```

ဒီမှာ `search_condition` က — `boolean` type ရဲ့ တန်ဖိုးတစ်ခု ပြန်ပေးတဲ့ — value expression တစ်ခုခု ဖြစ်ပါတယ် ([အပိုင်း 4.2](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ)။

`FROM` clause ရဲ့ လုပ်ဆောင်မှု ပြီးသွားတဲ့နောက်မှာ — ဆင်းသက်လာတဲ့ virtual table ရဲ့ row တစ်ခုချင်းစီကို search condition နဲ့ စစ်ဆေးပါတယ်။ Condition ရဲ့ ရလဒ်က true ဖြစ်ရင် — row ကို output table ထဲမှာ ထားပြီး — မဟုတ်ရင် (ဆိုလိုတာက — ရလဒ်က false ဒါမှမဟုတ် null ဖြစ်ရင်) — ဖယ်ပစ်ပါတယ်။ Search condition က ပုံမှန်အားဖြင့် — `FROM` clause ထဲမှာ ထုတ်လုပ်ထားတဲ့ table ရဲ့ column အနည်းဆုံး တစ်ခုကို ရည်ညွှန်းပါတယ်; ဒါ မဖြစ်မနေ လိုအပ်တာတော့ မဟုတ်ပါဘူး — ဒါပေမယ့် ဒီလို မရည်ညွှန်းဘူးဆိုရင် `WHERE` clause က အတော်လေး အသုံးမဝင်တော့ပါဘူး။

> **မှတ်ချက်:** Inner join တစ်ခုရဲ့ join condition ကို — `WHERE` clause ထဲမှာ ဖြစ်စေ `JOIN` clause ထဲမှာ ဖြစ်စေ — ရေးလို့ရပါတယ်။ ဥပမာ — ဒီ table expression တွေက ညီမျှပါတယ်:
> 
> ```sql
> FROM a, b WHERE a.id = b.id AND b.val > 5
> ```
> 
> ပြီးတော့:
> 
> ```sql
> FROM a INNER JOIN b ON (a.id = b.id) WHERE b.val > 5
> ```
> 
> ဒါမှမဟုတ် ဒီလိုတောင် ဖြစ်နိုင်ပါတယ်:
> 
> ```sql
> FROM a NATURAL JOIN b WHERE b.val > 5
> ```
> 
> ဒီထဲက ဘယ်ဟာကို သုံးမလဲဆိုတာက အဓိကအားဖြင့် စိတ်ကြိုက် ပုံစံ (style) ပြဿနာပါ။ `FROM` clause ထဲက `JOIN` syntax က — SQL standard ထဲမှာ ပါဝင်ပေမယ့် — တခြား SQL database management system တွေဆီ ရွှေ့ပြောင်းသုံးဖို့တော့ သိပ်မလွယ်ကူနိုင်ပါဘူး။ Outer join တွေအတွက်ကတော့ ရွေးစရာ မရှိပါဘူး: သူတို့ကို `FROM` clause ထဲမှာပဲ လုပ်ရပါတယ်။ Outer join တစ်ခုရဲ့ `ON` ဒါမှမဟုတ် `USING` clause က `WHERE` condition နဲ့ ညီမျှမှု မရှိပါဘူး — အကြောင်းကတော့ ၎င်းက နောက်ဆုံး ရလဒ်ထဲမှာ row တွေ ဖယ်ရှားခြင်းသာမက — (match မဖြစ်တဲ့ input row တွေအတွက်) row အသစ်တွေ ထပ်ပေါင်းထည့်ခြင်းကိုပါ ဖြစ်စေလို့ပါ။

`WHERE` clause တွေရဲ့ ဥပမာတချို့ ကြည့်ရအောင်:

```sql
SELECT ... FROM fdt WHERE c1 > 5

SELECT ... FROM fdt WHERE c1 IN (1, 2, 3)

SELECT ... FROM fdt WHERE c1 IN (SELECT c1 FROM t2)

SELECT ... FROM fdt WHERE c1 IN (SELECT c3 FROM t2 WHERE c2 = fdt.c1 + 10)

SELECT ... FROM fdt WHERE c1 BETWEEN (SELECT c3 FROM t2 WHERE c2 = fdt.c1 + 10) AND 100

SELECT ... FROM fdt WHERE EXISTS (SELECT c1 FROM t2 WHERE c2 > fdt.c1)
```

`fdt` က `FROM` clause ထဲမှာ ဆင်းသက်ထားတဲ့ table ပါ။ `WHERE` clause ရဲ့ search condition ကို မကျေနပ်တဲ့ row တွေကို `fdt` ကနေ ဖယ်ရှားပါတယ်။ Scalar subquery (တန်ဖိုးတစ်ခုတည်း ပြန်ပေးတဲ့ subquery) တွေကို value expression အဖြစ် သုံးထားတာ သတိပြုပါ။ တခြား query တွေလိုပဲ — subquery တွေထဲမှာလည်း ရှုပ်ထွေးတဲ့ table expression တွေကို သုံးနိုင်ပါတယ်။ `fdt` ကို subquery တွေထဲမှာ ဘယ်လို ရည်ညွှန်းထားလဲဆိုတာကိုလည်း သတိပြုပါ။ `c1` ကို `fdt.c1` လို့ qualify လုပ်ဖို့ လိုအပ်တာက — `c1` က subquery ရဲ့ derived input table ထဲမှာပါ column နာမည်တစ်ခု ဖြစ်နေတဲ့အခါမှသာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — မလိုအပ်တဲ့အခါမှာတောင် column နာမည်ကို qualify လုပ်ထားတာက ရှင်းလင်းမှု ပိုပေးပါတယ်။ ဒီဥပမာက — outer query တစ်ခုရဲ့ column naming scope (column နာမည် သုံးနိုင်တဲ့ နယ်ပယ်) က သူ့ရဲ့ inner query တွေထဲကို ဘယ်လို ကျယ်ပြန့်သွားလဲဆိုတာကို ပြပါတယ်။

### 7.2.3. The `GROUP BY` and `HAVING` Clauses (GROUP BY နဲ့ HAVING clause များ)

`WHERE` filter ကို ဖြတ်ပြီးနောက်မှာ — ဆင်းသက်လာတဲ့ input table ကို — `GROUP BY` clause သုံးပြီး grouping (အုပ်စုဖွဲ့ခြင်း) လုပ်တာ ဒါမှမဟုတ် — `HAVING` clause သုံးပြီး group row တွေ ဖယ်ရှားတာတွေ ပြုလုပ်ခံရနိုင်ပါတယ်။

```sql
SELECT select_list
    FROM ...
    [WHERE ...]
    GROUP BY grouping_column_reference [, grouping_column_reference]...
```

[`GROUP BY`](https://www.postgresql.org/docs/current/sql-select.html#SQL-GROUPBY) clause ကို — table ထဲမှာ စာရင်းပါ column တွေအားလုံးမှာ တူညီတဲ့ တန်ဖိုးတွေ ရှိတဲ့ row တွေကို အတူတူ စုစည်းဖို့ သုံးပါတယ်။ Column တွေကို စာရင်းသွင်းတဲ့ အစဉ်ကတော့ အရေးမကြီးပါဘူး။ ရလဒ်အနေနဲ့ — တူညီတဲ့ တန်ဖိုးတွေ ရှိတဲ့ row အစုတစ်ခုချင်းစီကို — group ထဲက row တွေအားလုံးကို ကိုယ်စားပြုတဲ့ group row တစ်ခုတည်းအဖြစ် ပေါင်းစပ်လိုက်ပါတယ်။ ဒါကို output ထဲက ထပ်နေမှု (redundancy) တွေ ဖယ်ရှားဖို့ ဒါမှမဟုတ် — ဒီ group တွေအပေါ် သက်ရောက်တဲ့ aggregate တွေကို တွက်ချက်ဖို့ (ဒါမှမဟုတ် နှစ်ခုလုံးအတွက်) လုပ်ဆောင်တာပါ။ ဥပမာ:

```
=> SELECT * FROM test1;
 x | y
---+---
 a | 3
 c | 2
 b | 5
 a | 1
(4 rows)

=> SELECT x FROM test1 GROUP BY x;
 x
---
 a
 b
 c
(3 rows)
```

ဒုတိယ query မှာ — `SELECT * FROM test1 GROUP BY x` လို့ ရေးလို့ မရပါဘူး — အကြောင်းကတော့ group တစ်ခုချင်းစီနဲ့ ဆက်စပ်လို့ရမယ့် column `y` ရဲ့ တန်ဖိုးတစ်ခုတည်း မရှိလို့ပါ။ Group လုပ်ထားတဲ့ column တွေကတော့ — group တစ်ခုချင်းစီမှာ တန်ဖိုးတစ်ခုတည်း ရှိတာမို့ — select list ထဲမှာ ရည်ညွှန်းလို့ရပါတယ်။

ယေဘုယျအားဖြင့် — table တစ်ခုကို group လုပ်ထားရင် — `GROUP BY` ထဲမှာ မပါဝင်တဲ့ column တွေကို — aggregate expression တွေထဲမှာ မဟုတ်ရင် — ရည်ညွှန်းလို့ မရပါဘူး။ Aggregate expression တွေ ပါဝင်တဲ့ ဥပမာတစ်ခုကတော့:

```
=> SELECT x, sum(y) FROM test1 GROUP BY x;
 x | sum
---+-----
 a |   4
 b |   5
 c |   2
(3 rows)
```

ဒီမှာ `sum` က — group တစ်ခုလုံးအပေါ်မှာ တန်ဖိုးတစ်ခုတည်း တွက်ချက်ပေးတဲ့ — aggregate function တစ်ခုပါ။ ရနိုင်တဲ့ aggregate function တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အပိုင်း 9.21](https://www.postgresql.org/docs/current/functions-aggregate.html) မှာ တွေ့နိုင်ပါတယ်။

> **အကြံပြုချက်:** Aggregate expression တွေ မပါဘဲ grouping လုပ်တာက — column တစ်ခုထဲက distinct (မထပ်တူ) တန်ဖိုးတွေရဲ့ အစုကို ထိရောက်စွာ တွက်ချက်ပေးပါတယ်။ ဒါကို `DISTINCT` clause သုံးပြီးလည်း ရနိုင်ပါတယ် ([အပိုင်း 7.3.3](/docs/postgresql/queries-select-lists) ကို ကြည့်ပါ)။

နောက်ထပ် ဥပမာတစ်ခုကတော့ — product တစ်ခုချင်းစီအတွက် စုစုပေါင်း ရောင်းရငွေကို တွက်ပါတယ် (product အားလုံးရဲ့ စုစုပေါင်း ရောင်းရငွေကို တွက်တာ မဟုတ်ပါဘူး):

```sql
SELECT product_id, p.name, (sum(s.units) * p.price) AS sales
    FROM products p LEFT JOIN sales s USING (product_id)
    GROUP BY product_id, p.name, p.price;
```

ဒီဥပမာမှာ — column `product_id`, `p.name`, နဲ့ `p.price` တွေကို query ရဲ့ select list ထဲမှာ ရည်ညွှန်းထားလို့ — `GROUP BY` clause ထဲမှာ ပါဝင်ရပါမယ် (ဒါပေမယ့် အောက်မှာ ကြည့်ပါ)။ Column `s.units` ကတော့ — product တစ်ခုရဲ့ ရောင်းရငွေကို ကိုယ်စားပြုတဲ့ aggregate expression (`sum(...)`) ထဲမှာပဲ သုံးလို့ — `GROUP BY` စာရင်းထဲမှာ ပါဝင်စရာ မလိုပါဘူး။ Product တစ်ခုချင်းစီအတွက် — query က အဲဒီ product ရဲ့ ရောင်းချမှုအားလုံးအကြောင်း အကျဉ်းချုပ် row တစ်ခုကို ပြန်ပေးပါတယ်။

ဥပမာ — products table မှာ `product_id` က primary key ဖြစ်အောင် စီစဉ်ထားရင် — အပေါ်က ဥပမာမှာ `product_id` နဲ့ပဲ group လုပ်ရင် လုံလောက်ပါတယ် — အကြောင်းကတော့ `name` နဲ့ `price` တွေက product ID အပေါ်မှာ *functionally dependent* (လုပ်ဆောင်ချက်အရ မှီခို) နေလို့ — product ID group တစ်ခုချင်းစီအတွက် ဘယ် name နဲ့ price တန်ဖိုးကို ပြန်ပေးရမလဲဆိုတာ မရှင်းလင်းမှု ရှိတော့မှာ မဟုတ်ပါဘူး။

တင်းကျပ်တဲ့ SQL မှာ — `GROUP BY` က source table ရဲ့ column တွေနဲ့ပဲ group လုပ်လို့ရပြီး — PostgreSQL ကတော့ ဒါကို ချဲ့ထွင်ပြီး — select list ထဲက column တွေနဲ့ပါ group လုပ်ခွင့် ပေးပါတယ်။ ရိုးရှင်းတဲ့ column နာမည်တွေ အစား — value expression တွေနဲ့လည်း group လုပ်လို့ ရပါတယ်။

Table တစ်ခုကို `GROUP BY` နဲ့ group လုပ်ပြီးပေမယ့် — group တချို့ပဲ စိတ်ဝင်စားတယ်ဆိုရင် — `WHERE` clause လိုပဲ — ရလဒ်ထဲက group တွေကို ဖယ်ရှားဖို့ `HAVING` clause ကို သုံးနိုင်ပါတယ်။ Syntax ကတော့:

```sql
SELECT select_list FROM ... [WHERE ...] GROUP BY ... HAVING boolean_expression
```

`HAVING` clause ထဲက expression တွေက — group လုပ်ထားတဲ့ expression တွေကိုရော — group မလုပ်ထားတဲ့ expression တွေကိုပါ (အဲဒါတွေမှာ aggregate function တစ်ခု မဖြစ်မနေ ပါဝင်ပါတယ်) — ရည်ညွှန်းလို့ရပါတယ်။

ဥပမာ:

```
=> SELECT x, sum(y) FROM test1 GROUP BY x HAVING sum(y) > 3;
 x | sum
---+-----
 a |   4
 b |   5
(2 rows)

=> SELECT x, sum(y) FROM test1 GROUP BY x HAVING x < 'c';
 x | sum
---+-----
 a |   4
 b |   5
(2 rows)
```

ထပ်ပြီးတော့ — ပိုပြီး လက်တွေ့ကျတဲ့ ဥပမာတစ်ခု:

```sql
SELECT product_id, p.name, (sum(s.units) * (p.price - p.cost)) AS profit
    FROM products p LEFT JOIN sales s USING (product_id)
    WHERE s.date > CURRENT_DATE - INTERVAL '4 weeks'
    GROUP BY product_id, p.name, p.price, p.cost
    HAVING sum(p.price * s.units) > 5000;
```

အပေါ်က ဥပမာမှာ — `WHERE` clause က group မလုပ်ထားတဲ့ column တစ်ခုနဲ့ row တွေကို ရွေးထားပြီး (ဒီ expression က ပြီးခဲ့တဲ့ လေးပတ်အတွင်း ရောင်းချမှုတွေအတွက်ပဲ true ဖြစ်ပါတယ်) — `HAVING` clause ကတော့ output ကို — စုစုပေါင်း ရောင်းရငွေ 5000 ကျော်တဲ့ group တွေအထိပဲ ကန့်သတ်ပါတယ်။ Aggregate expression တွေက query ရဲ့ အစိတ်အပိုင်း အားလုံးမှာ အတူတူပဲ ဖြစ်နေစရာ မလိုဘူးဆိုတာ သတိပြုပါ။

Query တစ်ခုမှာ aggregate function call တွေ ပါဝင်ပေမယ့် `GROUP BY` clause မပါဘူးဆိုရင် — grouping က ဖြစ်ပေါ်နေဆဲပါ: ရလဒ်က group row တစ်ခုတည်း ဖြစ်ပါတယ် (ဒါမှမဟုတ် — အဲဒီ row တစ်ခုတည်းကို `HAVING` က ဖယ်ရှားလိုက်ရင် — row လုံးဝ မရှိတာလည်း ဖြစ်နိုင်ပါတယ်)။ Query တစ်ခုထဲမှာ `HAVING` clause ပါဝင်ရင်လည်း — aggregate function call တွေ ဒါမှမဟုတ် `GROUP BY` clause မပါဘဲတောင် — အလားတူပဲ ဖြစ်ပါတယ်။

### 7.2.4. `GROUPING SETS`, `CUBE`, and `ROLLUP` (GROUPING SETS, CUBE နဲ့ ROLLUP)

အပေါ်မှာ ဖော်ပြခဲ့တာတွေထက် ပိုရှုပ်ထွေးတဲ့ grouping လုပ်ဆောင်ချက်တွေကို *grouping sets* (grouping sets — group လုပ်မယ့် column တွေရဲ့ သတ်မှတ်ချက် တစ်ခုချင်း) ဆိုတဲ့ သဘောတရားနဲ့ လုပ်နိုင်ပါတယ်။ `FROM` နဲ့ `WHERE` clause တွေက ရွေးထုတ်ထားတဲ့ data ကို — သတ်မှတ်ထားတဲ့ grouping set တစ်ခုချင်းစီအလိုက် သီးခြားစီ group လုပ်ပြီး — ရိုးရိုး `GROUP BY` clause တွေလိုပဲ group တစ်ခုချင်းစီအတွက် aggregate တွေကို တွက်ချက်ကာ — ရလဒ်တွေကို ပြန်ပေးပါတယ်။ ဥပမာ:

```
=> SELECT * FROM items_sold;
 brand | size | sales
-------+------+-------
 Foo   | L    |  10
 Foo   | M    |  20
 Bar   | M    |  15
 Bar   | L    |  5
(4 rows)

=> SELECT brand, size, sum(sales) FROM items_sold GROUP BY GROUPING SETS ((brand), (size), ());
 brand | size | sum
-------+------+-----
 Foo   |      |  30
 Bar   |      |  20
       | L    |  15
       | M    |  35
       |      |  50
(5 rows)
```

`GROUPING SETS` ရဲ့ sublist တစ်ခုချင်းစီမှာ — column တွေ ဒါမှမဟုတ် expression တွေကို သုည ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး သတ်မှတ်နိုင်ပြီး — `GROUP BY` clause ထဲမှာ တိုက်ရိုက် ရေးထားသလိုပဲ အဓိပ္ပာယ် ဖွင့်ဆိုပါတယ်။ Grouping set အလွတ် (empty) တစ်ခုဆိုရင် — row အားလုံးကို group တစ်ခုတည်းအထိ စုစည်းလိုက်တာကို ဆိုလိုပါတယ် (input row တွေ မရှိခဲ့ရင်တောင် output ထွက်ပါတယ်) — ဒါက အပေါ်မှာ `GROUP BY` clause မပါတဲ့ aggregate function တွေရဲ့ ကိစ္စအတွက် ဖော်ပြခဲ့တာနဲ့ အတူတူပါ။

Grouping column တွေ ဒါမှမဟုတ် expression တွေကို ရည်ညွှန်းတာတွေကို — အဲဒီ column တွေ မပါဝင်တဲ့ grouping set တွေရဲ့ result row တွေထဲမှာ — null value တွေနဲ့ အစားထိုးပါတယ်။ Output row တစ်ခုက ဘယ် grouping ကနေ ဖြစ်ပေါ်လာလဲဆိုတာ ခွဲခြားဖို့ — [ဇယား 9.66](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-GROUPING-TABLE) ကို ကြည့်ပါ။

Grouping set အမျိုးအစား အသုံးများတဲ့ နှစ်မျိုးကို သတ်မှတ်ဖို့ အတိုကောက် notation တစ်ခု ပံ့ပိုးပေးထားပါတယ်။ ဒီပုံစံ clause တစ်ခုက —

```sql
ROLLUP ( e1, e2, e3, ... )
```

ပေးထားတဲ့ expression စာရင်းနဲ့ — empty list အပါအဝင် — စာရင်းရဲ့ prefix (ရှေ့ဆက်) အားလုံးကို ကိုယ်စားပြုပါတယ်; ဒါကြောင့် ၎င်းက အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUPING SETS (
    ( e1, e2, e3, ... ),
    ...
    ( e1, e2 ),
    ( e1 ),
    ( )
)
```

ဒါကို အထက်အောက် အဆင့်ဆင့် (hierarchical) data တွေအပေါ် ခွဲခြမ်းစိတ်ဖြာမှုတွေမှာ အသုံးများပါတယ်; ဥပမာ — ဌာနအလိုက်၊ ဌာနခွဲ (division) အလိုက် လစာ စုစုပေါင်းနဲ့ — ကုမ္ပဏီတစ်ခုလုံး အတိုင်းအတာ စုစုပေါင်း။

ဒီပုံစံ clause တစ်ခုက —

```sql
CUBE ( e1, e2, ... )
```

ပေးထားတဲ့ စာရင်းနဲ့ သူ့ရဲ့ ဖြစ်နိုင်တဲ့ subset (အစုခွဲ) အားလုံး (ဆိုလိုတာက — power set) ကို ကိုယ်စားပြုပါတယ်။ ဒါကြောင့်

```sql
CUBE ( a, b, c )
```

က အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUPING SETS (
    ( a, b, c ),
    ( a, b    ),
    ( a,    c ),
    ( a       ),
    (    b, c ),
    (    b    ),
    (       c ),
    (         )
)
```

`CUBE` ဒါမှမဟုတ် `ROLLUP` clause ရဲ့ element တစ်ခုချင်းစီက — expression တစ်ခုချင်းစီ ဖြစ်နိုင်သလို — parenthesis ထဲက element တွေရဲ့ sublist တွေလည်း ဖြစ်နိုင်ပါတယ်။ နောက်ဆုံး ကိစ္စမှာဆိုရင် — sublist တွေကို grouping set တစ်ခုချင်းစီ ထုတ်လုပ်ရာမှာ — ယူနစ်တစ်ခုတည်း အနေနဲ့ သဘောထားပါတယ်။ ဥပမာ:

```sql
CUBE ( (a, b), (c, d) )
```

က အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUPING SETS (
    ( a, b, c, d ),
    ( a, b       ),
    (       c, d ),
    (            )
)
```

ပြီးတော့

```sql
ROLLUP ( a, (b, c), d )
```

က အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUPING SETS (
    ( a, b, c, d ),
    ( a, b, c    ),
    ( a          ),
    (            )
)
```

`CUBE` နဲ့ `ROLLUP` တည်ဆောက်ပုံတွေကို — `GROUP BY` clause ထဲမှာ တိုက်ရိုက် ဖြစ်စေ — `GROUPING SETS` clause တစ်ခုရဲ့ အတွင်းမှာ nested လုပ်ပြီး ဖြစ်စေ — သုံးနိုင်ပါတယ်။ `GROUPING SETS` clause တစ်ခုကို နောက်တစ်ခုရဲ့ အတွင်းမှာ nested လုပ်ရင် — အတွင်းက clause ရဲ့ element တွေအားလုံးကို အပြင်က clause ထဲမှာ တိုက်ရိုက် ရေးထားသလိုပဲ — ရလဒ် အတူတူ ဖြစ်ပါတယ်။

`GROUP BY` clause တစ်ခုတည်းထဲမှာ grouping item အများကြီး သတ်မှတ်ထားရင် — နောက်ဆုံး grouping set စာရင်းက — item တစ်ခုချင်းစီရဲ့ Cartesian product ဖြစ်ပါတယ်။ ဥပမာ:

```sql
GROUP BY a, CUBE (b, c), GROUPING SETS ((d), (e))
```

က အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUP BY GROUPING SETS (
    (a, b, c, d), (a, b, c, e),
    (a, b, d),    (a, b, e),
    (a, c, d),    (a, c, e),
    (a, d),       (a, e)
)
```

Grouping item အများကြီးကို အတူတကွ သတ်မှတ်တဲ့အခါ — နောက်ဆုံး grouping set အစုထဲမှာ ထပ်နေတဲ့ (duplicate) အရာတွေ ပါလာနိုင်ပါတယ်။ ဥပမာ:

```sql
GROUP BY ROLLUP (a, b), ROLLUP (a, c)
```

က အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUP BY GROUPING SETS (
    (a, b, c),
    (a, b),
    (a, b),
    (a, c),
    (a),
    (a),
    (a, c),
    (a),
    ()
)
```

ဒီထပ်နေတဲ့အရာတွေကို မလိုချင်ဘူးဆိုရင် — `GROUP BY` ပေါ်မှာ တိုက်ရိုက် `DISTINCT` clause သုံးပြီး ဖယ်ရှားနိုင်ပါတယ်။ ဒါကြောင့်:

```sql
GROUP BY DISTINCT ROLLUP (a, b), ROLLUP (a, c)
```

က အောက်ပါတို့နဲ့ ညီမျှပါတယ် —

```sql
GROUP BY GROUPING SETS (
    (a, b, c),
    (a, b),
    (a, c),
    (a),
    ()
)
```

ဒါက `SELECT DISTINCT` သုံးတာနဲ့ မတူပါဘူး — အကြောင်းကတော့ output row တွေထဲမှာ ထပ်နေတဲ့အရာတွေ ရှိနေနိုင်သေးလို့ပါ။ Group မလုပ်ထားတဲ့ column တစ်ခုခုထဲမှာ NULL ပါဝင်နေရင် — အဲဒီ column ကိုယ်တိုင် group လုပ်တဲ့အခါ သုံးတဲ့ NULL နဲ့ ခွဲခြားလို့ မရနိုင်တော့ပါဘူး။

> **မှတ်ချက်:** `(a, b)` ဆိုတဲ့ တည်ဆောက်ပုံကို expression တွေထဲမှာ [row constructor](/docs/postgresql/sql-expressions) (row တည်ဆောက်မှု) အဖြစ် ပုံမှန် အသိအမှတ်ပြုပါတယ်။ `GROUP BY` clause ထဲမှာတော့ — ဒါက expression တွေရဲ့ ထိပ်တန်း (top level) တွေမှာ သက်ရောက်မှု မရှိဘဲ — `(a, b)` ကို အပေါ်မှာ ဖော်ပြခဲ့သလို expression စာရင်းတစ်ခုအနေနဲ့ parse လုပ်ပါတယ်။ တစ်နည်းနည်းနဲ့ grouping expression တစ်ခုထဲမှာ row constructor လိုအပ်နေရင် — `ROW(a, b)` ကို သုံးပါ။

### 7.2.5. Window Function Processing (window function ဆောင်ရွက်ခြင်း)

Query တစ်ခုထဲမှာ window function တွေ ပါဝင်နေရင် ([အပိုင်း 3.5](/docs/postgresql/window-functions), [အပိုင်း 9.22](https://www.postgresql.org/docs/current/functions-window.html) နဲ့ [အပိုင်း 4.2.8](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ) — ဒီ function တွေကို grouping, aggregation နဲ့ `HAVING` filtering တွေ လုပ်ဆောင်ပြီးမှ — အကဲဖြတ်ပါတယ်။ ဆိုလိုတာက — query ထဲမှာ aggregate တွေ၊ `GROUP BY` ဒါမှမဟုတ် `HAVING` သုံးထားရင် — window function တွေ မြင်ရတဲ့ row တွေက — `FROM`/`WHERE` ကနေ လာတဲ့ မူလ table row တွေ မဟုတ်ဘဲ — group row တွေ ဖြစ်ပါတယ်။

Window function အများကြီး သုံးထားတဲ့အခါ — သူတို့ရဲ့ window definition တွေထဲမှာ ညီမျှတဲ့ `PARTITION BY` နဲ့ `ORDER BY` clause တွေ ရှိတဲ့ window function အားလုံးက — `ORDER BY` က အစဉ်ကို သီးသန့် သတ်မှတ်မပေးနိုင်ရင်တောင် — input row တွေရဲ့ အစဉ်အတူတူကိုပဲ မြင်ရမယ်လို့ အာမခံပါတယ်။ ဒါပေမယ့် — မတူညီတဲ့ `PARTITION BY` ဒါမှမဟုတ် `ORDER BY` သတ်မှတ်ချက်တွေ ရှိတဲ့ function တွေရဲ့ အကဲဖြတ်မှုအကြောင်းကိုတော့ အာမခံချက် မပေးပါဘူး။ (ဒီလိုကိစ္စမျိုးမှာ — window function အကဲဖြတ်မှု အဆင့်တွေကြားမှာ sort (စီခြင်း) အဆင့်တစ်ခု ပုံမှန် လိုအပ်ပြီး — အဲဒီ sort က — သူ့ရဲ့ `ORDER BY` က ညီမျှတယ်လို့ မြင်တဲ့ row တွေရဲ့ အစဉ်ကို ထိန်းသိမ်းပေးမယ်လို့တော့ အာမခံချက် မရှိပါဘူး။)

လောလောဆယ်မှာ — window function တွေက presorted (ကြိုတင် စီထားတဲ့) data အမြဲ လိုအပ်ပြီး — ဒါကြောင့် query output က window function တွေရဲ့ `PARTITION BY`/`ORDER BY` clause တစ်ခုခုအတိုင်း စီထားတဲ့ ပုံစံနဲ့ ထွက်လာပါလိမ့်မယ်။ ဒါပေမယ့် — ဒါကို အားကိုးဖို့တော့ အကြံပြုလို့ မရပါဘူး။ ရလဒ်တွေ သတ်မှတ်ထားတဲ့ နည်းလမ်းတစ်ခုအတိုင်း စီထားတာ သေချာချင်ရင် — ထိပ်တန်း (top-level) `ORDER BY` clause တစ်ခုကို ရှင်းရှင်းလင်းလင်း သုံးပါ။
