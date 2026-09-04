---
title: "Set Returning Functions (row အစု ပြန်ပေးသော လုပ်ဆောင်ချက်များ)"
description: "Row တစ်ခုထက်ပိုပြီး ပြန်ပေးနိုင်သော functions များ — generate_series နှင့် generate_subscripts စဉ်ထုတ်လုပ်သည့် လုပ်ဆောင်ချက်များ၊ FROM clause တွင် WITH ORDINALITY အသုံးပြုပုံ"
order: 93
source: "https://www.postgresql.org/docs/current/functions-srf.html"
status: translated
updated: 2026-09-04
---

## 9.26. Set Returning Functions (row အစု ပြန်ပေးသော လုပ်ဆောင်ချက်များ)

ဒီ section က row တစ်ခုထက်ပိုပြီး ပြန်ပေးနိုင်တဲ့ functions တွေကို ဖော်ပြပါတယ်။ ဒီအမျိုးအစားထဲမှာ အသုံးအများဆုံး functions တွေကတော့ series generating functions (တန်ဖိုးစဉ်များ ထုတ်ပေးသည့် လုပ်ဆောင်ချက်များ) တွေ ဖြစ်ပြီး — ဇယား 9.69 နဲ့ ဇယား 9.70 မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။ Set-returning functions (row အစုများ ပြန်ပေးသည့် လုပ်ဆောင်ချက်များ) ထဲက — ပိုပြီး အထူးပြုထားတဲ့ — အခြားဟာတွေကိုတော့ ဒီလက်စွဲ (manual) ရဲ့ တခြားနေရာတွေမှာ ဖော်ပြထားပါတယ်။ Set-returning functions အများအပြားကို ပေါင်းစပ် အသုံးပြုနိုင်တဲ့ နည်းလမ်းတွေအတွက် [အပိုင်း 7.2.1.4](/docs/postgresql/queries-table-expressions) ကို ကြည့်ရှုပါ။

**ဇယား 9.69. Series Generating Functions (တန်ဖိုးစဉ်များ ထုတ်ပေးသည့် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| generate_series ( start integer, stop integer [, step integer ] ) → setof integer generate_series ( start bigint, stop bigint [, step bigint ] ) → setof bigint generate_series ( start numeric, stop numeric [, step numeric ] ) → setof numeric start ကနေ stop အထိ — step size ဖြစ်တဲ့ step နဲ့ — တန်ဖိုးစဉ် (series) တစ်ခုကို ထုတ်ပေးပါတယ်။ step ကို မသတ်မှတ်ရင် 1 လို့ မှတ်ယူပါတယ်။ |
| generate_series ( start timestamp, stop timestamp, step interval ) → setof timestamp generate_series ( start timestamp with time zone, stop timestamp with time zone, step interval [, timezone text ] ) → setof timestamp with time zone start ကနေ stop အထိ — step size ဖြစ်တဲ့ step နဲ့ — တန်ဖိုးစဉ် (series) တစ်ခုကို ထုတ်ပေးပါတယ်။ Timezone-aware ပုံစံမှာ — နေ့အချိန်တွေနဲ့ daylight-savings ပြုပြင်ပြောင်းလဲမှုတွေကို — timezone argument က နာမည်ပေးထားတဲ့ time zone အရ ဖြစ်စေ၊ ချန်လိုက်ရင် လက်ရှိ TimeZone setting အရ ဖြစ်စေ — တွက်ချက်ပါတယ်။ |

`step` က positive ဖြစ်နေတဲ့အခါ — `start` က `stop` ထက် ကြီးနေရင် row သုညခု ပြန်ပေးပါတယ်။ ပြောင်းပြန်အနေနဲ့ — `step` က negative ဖြစ်နေတဲ့အခါ — `start` က `stop` ထက် ငယ်နေရင် row သုညခု ပြန်ပေးပါတယ်။ Input တစ်ခုခု `NULL` ဖြစ်နေရင်လည်း row သုညခု ပြန်ပေးပါတယ်။ `step` က သုည ဖြစ်နေရင်တော့ error ဖြစ်ပါတယ်။ ဥပမာအချို့ကို အောက်မှာ ဖော်ပြထားပါတယ်:

```sql
SELECT * FROM generate_series(2,4);
 generate_series
-----------------
               2
               3
               4
(3 rows)

SELECT * FROM generate_series(5,1,-2);
 generate_series
-----------------
               5
               3
               1
(3 rows)

SELECT * FROM generate_series(4,3);
 generate_series
-----------------
(0 rows)

SELECT generate_series(1.1, 4, 1.3);
 generate_series
-----------------
             1.1
             2.4
             3.7
(3 rows)

-- this example relies on the date-plus-integer operator:
SELECT current_date + s.a AS dates FROM generate_series(0,14,7) AS s(a);
   dates
------------
 2004-02-05
 2004-02-12
 2004-02-19
(3 rows)

SELECT * FROM generate_series('2008-03-01 00:00'::timestamp,
                              '2008-03-04 12:00', '10 hours');
   generate_series
---------------------
 2008-03-01 00:00:00
 2008-03-01 10:00:00
 2008-03-01 20:00:00
 2008-03-02 06:00:00
 2008-03-02 16:00:00
 2008-03-03 02:00:00
 2008-03-03 12:00:00
 2008-03-03 22:00:00
 2008-03-04 08:00:00
(9 rows)

-- this example assumes that TimeZone is set to UTC; note the DST transition:
SELECT * FROM generate_series('2001-10-22 00:00 -04:00'::timestamptz,
                              '2001-11-01 00:00 -05:00'::timestamptz,
                              '1 day'::interval, 'America/New_York');
    generate_series
------------------------
 2001-10-22 04:00:00+00
 2001-10-23 04:00:00+00
 2001-10-24 04:00:00+00
 2001-10-25 04:00:00+00
 2001-10-26 04:00:00+00
 2001-10-27 04:00:00+00
 2001-10-28 04:00:00+00
 2001-10-29 05:00:00+00
 2001-10-30 05:00:00+00
 2001-10-31 05:00:00+00
 2001-11-01 05:00:00+00
(11 rows)
```

**ဇယား 9.70. Subscript Generating Functions (subscript စဉ်တန်ဖိုးများ ထုတ်ပေးသည့် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| generate_subscripts ( array anyarray, dim integer ) → setof integer ပေးထားတဲ့ array ရဲ့ dim မြောက် dimension အတွက် တရားဝင် (valid) subscripts တွေ ပါဝင်တဲ့ စဉ် (series) တစ်ခုကို ထုတ်ပေးပါတယ်။ |
| generate_subscripts ( array anyarray, dim integer, reverse boolean ) → setof integer ပေးထားတဲ့ array ရဲ့ dim မြောက် dimension အတွက် တရားဝင် (valid) subscripts တွေ ပါဝင်တဲ့ စဉ် (series) တစ်ခုကို ထုတ်ပေးပါတယ်။ reverse က true ဖြစ်ရင် — စဉ်ကို ပြောင်းပြန် အစဉ်နဲ့ ပြန်ပေးပါတယ်။ |

`generate_subscripts` က ပေးထားတဲ့ array ရဲ့ သတ်မှတ်ထားတဲ့ dimension အတွက် တရားဝင် subscripts အစုကို ထုတ်ပေးတဲ့ convenience function (အဆင်ပြေ လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။ တောင်းဆိုထားတဲ့ dimension မရှိတဲ့ arrays တွေအတွက် — ဒါမှမဟုတ် input တစ်ခုခု `NULL` ဖြစ်နေရင် — row သုညခု ပြန်ပေးပါတယ်။ ဥပမာအချို့ကို အောက်မှာ ဖော်ပြထားပါတယ်:

```
-- basic usage:
SELECT generate_subscripts('{NULL,1,NULL,2}'::int[], 1) AS s;
 s
---
 1
 2
 3
 4
(4 rows)

-- presenting an array, the subscript and the subscripted
-- value requires a subquery:
SELECT * FROM arrays;
         a
--------------------
 {-1,-2}
 {100,200,300}
(2 rows)

SELECT a AS array, s AS subscript, a[s] AS value
FROM (SELECT generate_subscripts(a, 1) AS s, a FROM arrays) foo;
     array     | subscript | value
---------------+-----------+-------
 {-1,-2}       |         1 |    -1
 {-1,-2}       |         2 |    -2
 {100,200,300} |         1 |   100
 {100,200,300} |         2 |   200
 {100,200,300} |         3 |   300
(5 rows)

-- unnest a 2D array:
CREATE OR REPLACE FUNCTION unnest2(anyarray)
RETURNS SETOF anyelement AS $$
select $1[i][j]
   from generate_subscripts($1,1) g1(i),
        generate_subscripts($1,2) g2(j);
$$ LANGUAGE sql IMMUTABLE;
CREATE FUNCTION
SELECT * FROM unnest2(ARRAY[[1,2],[3,4]]);
 unnest2
---------
       1
       2
       3
       4
(4 rows)
```

`FROM` clause ထဲက function တစ်ခုကို `WITH ORDINALITY` နဲ့ နောက်ဆက်တွဲ သတ်မှတ် (suffix) လုပ်ထားရင် — function ရဲ့ output column(များ) ရဲ့ နောက်မှာ `bigint` column တစ်ခု ထပ်ပေါင်းပါလိမ့်မယ် — အဲဒီ column က function ရဲ့ output row တစ်ခုချင်းစီအတွက် 1 ကနေ စပြီး — 1 စီ တိုးသွားပါတယ်။ ဒါက `unnest()` လိုမျိုး set-returning functions တွေရဲ့ ကိစ္စမှာ အသုံးဝင်ဆုံး ဖြစ်ပါတယ်။

```sql
-- set returning function WITH ORDINALITY:
SELECT * FROM pg_ls_dir('.') WITH ORDINALITY AS t(ls,n);
       ls        | n
-----------------+----
 pg_serial       |  1
 pg_twophase     |  2
 postmaster.opts |  3
 pg_notify       |  4
 postgresql.conf |  5
 pg_tblspc       |  6
 logfile         |  7
 base            |  8
 postmaster.pid  |  9
 pg_ident.conf   | 10
 global          | 11
 pg_xact         | 12
 pg_snapshots    | 13
 pg_multixact    | 14
 PG_VERSION      | 15
 pg_wal          | 16
 pg_hba.conf     | 17
 pg_stat_tmp     | 18
 pg_subtrans     | 19
(19 rows)
```
