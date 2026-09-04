---
title: "CREATE STATISTICS (extended statistics အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Extended statistics object အသစ်တစ်ခုကို ဖန်တီးပေးသော command — table, foreign table သို့မဟုတ် materialized view တစ်ခုရှိ column(s)/expression(s) များအတွက် ndistinct, dependencies (functional dependency) နှင့် mcv (most-common values list) ကဲ့သို့သော statistics kinds များကို စုဆောင်းပေးသည်; expression တစ်ခုတည်းအတွက် univariate statistics ပုံစံနှင့် columns/expressions အများအပြားအတွက် multivariate statistics ပုံစံ နှစ်မျိုးလုံးကို ထောက်ပံ့သည်"
order: 321
source: "https://www.postgresql.org/docs/current/sql-createstatistics.html"
status: translated
updated: 2026-09-04
---

## CREATE STATISTICS (extended statistics အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE STATISTICS — extended statistics အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE STATISTICS [ [ IF NOT EXISTS ] statistics_name ]
    ON ( expression )
    FROM table_name

CREATE STATISTICS [ [ IF NOT EXISTS ] statistics_name ]
    [ ( statistics_kind [, ... ] ) ]
    ON { column_name | ( expression ) }, { column_name | ( expression ) } [, ...]
    FROM table_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE STATISTICS` က — သတ်မှတ်ထားတဲ့ table, foreign table သို့မဟုတ် materialized view အကြောင်း data တွေကို ခြေရာခံတဲ့ — extended statistics object အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Statistics object ကို လက်ရှိ database ထဲမှာ ဖန်တီးပြီး — command ကို ထုတ်ပြန်တဲ့ user က ပိုင်ဆိုင်ပါတယ်။

`CREATE STATISTICS` command မှာ အခြေခံ ပုံစံ နှစ်မျိုး ရှိပါတယ်။ ပထမ ပုံစံက — expression တစ်ခုတည်းအတွက် univariate statistics တွေကို စုဆောင်းခွင့် ပြုပြီး — index maintenance ရဲ့ overhead မပါဘဲ — expression index တစ်ခုနဲ့ ဆင်တူတဲ့ အကျိုးကျေးဇူးတွေ ပေးပါတယ်။ ဒီ ပုံစံမှာ statistics kind ကို သတ်မှတ်ခွင့် မရှိပါဘူး — ဘာလို့လဲဆိုတော့ statistics kinds အမျိုးမျိုးက multivariate statistics တွေကိုပဲ ရည်ညွှန်းလို့ပါ။ Command ရဲ့ ဒုတိယ ပုံစံက — columns နဲ့/သို့မဟုတ် expressions အများအပြားအပေါ်မှာ multivariate statistics တွေကို စုဆောင်းခွင့် ပြုပြီး — ဘယ် statistics kinds တွေ ထည့်သွင်းရမလဲဆိုတာကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ ပုံစံက — စာရင်းထဲမှာ ပါဝင်တဲ့ expressions တွေအပေါ်မှာ univariate statistics တွေကိုပါ အလိုအလျောက် စုဆောင်းစေပါလိမ့်မယ်။

Schema name တစ်ခု ပေးထားရင် (ဥပမာ `CREATE STATISTICS myschema.mystat ...`) — statistics object ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပေးထားရင်တော့ လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ ပေးထားရင် — statistics object ရဲ့ နာမည်က — schema တစ်ခုတည်းထဲက တခြား statistics object တစ်ခုခုရဲ့ နာမည်နဲ့ သီးခြား (distinct) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF NOT EXISTS** — နာမည် တူညီတဲ့ statistics object တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ပစ်ချမှာ မဟုတ်ပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။ ဒီနေရာမှာ statistics object ရဲ့ နာမည်ကိုပဲ ထည့်သွင်း စဉ်းစားပြီး — သူ့ရဲ့ definition ရဲ့ အသေးစိတ် အချက်အလက်တွေကို မစဉ်းစားဘူးဆိုတာ သတိပြုပါ။ IF NOT EXISTS ကို သတ်မှတ်ထားတဲ့အခါ statistics name က မဖြစ်မနေ လိုအပ်ပါတယ်။
- **statistics_name** — ဖန်တီးရမယ့် statistics object ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။ နာမည် ချန်လိုက်ရင် — PostgreSQL က — parent table ရဲ့ နာမည် နဲ့ သတ်မှတ်ထားတဲ့ column name(s) နဲ့/သို့မဟုတ် expression(s) တွေကို အခြေခံပြီး — သင့်လျော်တဲ့ နာမည်တစ်ခုကို ရွေးချယ်ပေးပါတယ်။
- **statistics_kind** — ဒီ statistics object ထဲမှာ တွက်ချက်ရမယ့် multivariate statistics kind တစ်ခု။ လောလောဆယ် ထောက်ပံ့ထားတဲ့ kinds တွေကတော့ — n-distinct statistics တွေကို enable လုပ်ပေးတဲ့ ndistinct၊ functional dependency statistics တွေကို enable လုပ်ပေးတဲ့ dependencies နဲ့ most-common values lists တွေကို enable လုပ်ပေးတဲ့ mcv တို့ ဖြစ်ပါတယ်။ ဒီ clause ကို ချန်လိုက်ရင် — ထောက်ပံ့ထားတဲ့ statistics kinds တွေ အားလုံးကို statistics object ထဲမှာ ထည့်သွင်းပါတယ်။ Statistics definition ထဲမှာ — ရိုးရှင်းတဲ့ column references တွေ သက်သက် မဟုတ်ဘဲ — complex expressions တစ်ခုခု ပါဝင်နေရင် — univariate expression statistics တွေကို အလိုအလျောက် တည်ဆောက်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် — အပိုင်း 14.2.2 နဲ့ အပိုင်း 69.2 ကို ကြည့်ပါ။
- **column_name** — တွက်ချက်ထားတဲ့ statistics တွေက လွှမ်းခြုံပေးမယ့် table column တစ်ခုရဲ့ နာမည်။ ဒါကို multivariate statistics တွေ တည်ဆောက်တဲ့အခါမှပဲ ခွင့်ပြုပါတယ်။ Column names ဒါမှမဟုတ် expressions အနည်းဆုံး နှစ်ခု သတ်မှတ်ရပြီး — သူတို့ရဲ့ အစဉ်လိုက်ကတော့ အဓိပ္ပာယ် မရှိပါဘူး။
- **expression** — တွက်ချက်ထားတဲ့ statistics တွေက လွှမ်းခြုံပေးမယ့် expression တစ်ခု။ ဒါကို — expression တစ်ခုတည်းအပေါ်မှာ univariate statistics တွေ တည်ဆောက်ဖို့ ဒါမှမဟုတ် — multivariate statistics တွေ တည်ဆောက်ဖို့ — column names နဲ့/သို့မဟုတ် expressions အများအပြားရဲ့ စာရင်းထဲက အစိတ်အပိုင်းတစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။ နောက်ဆုံး ကိစ္စမှာဆိုရင် — စာရင်းထဲက expression တစ်ခုစီအတွက် — သီးခြား univariate statistics တွေကို အလိုအလျောက် တည်ဆောက်ပါတယ်။
- **table_name** — statistics တွေကို တွက်ချက်တဲ့ column(s) တွေ ပါဝင်တဲ့ table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်); inheritance နဲ့ partitions တွေကို ကိုင်တွယ်ပုံရဲ့ ရှင်းလင်းချက်အတွက် ANALYZE ကို ကြည့်ပါ။

## Notes (မှတ်စုများ)

Statistics object တစ်ခုကို ဖတ်ရှုတဲ့ (သူ့ပေါ်မှာ statistics တွေ တွက်ချက်တဲ့) table တစ်ခုရဲ့ owner ဖြစ်မှသာ — statistics object တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ ဒါပေမယ့် — ဖန်တီးပြီးတာနဲ့ — statistics object ရဲ့ ownership က — အောက်ခံ table(s) တွေနဲ့ လွတ်လပ် (independent) ပါတယ်။

Expression statistics တွေက expression တစ်ခုချင်းစီအတွက် ဖြစ်ပြီး — expression ပေါ်မှာ index တစ်ခု ဖန်တီးတာနဲ့ ဆင်တူပေမယ့် — index maintenance ရဲ့ overhead ကိုတော့ ရှောင်ရှားပေးပါတယ်။ Expression statistics တွေကို — statistics object definition ထဲက expression တစ်ခုစီအတွက် — အလိုအလျောက် တည်ဆောက်ပါတယ်။

Extended statistics တွေကို လောလောဆယ် — table joins တွေအတွက် ပြုလုပ်တဲ့ selectivity estimations (ရွေးချယ်နှုန်း ခန့်မှန်းချက်များ) မှာ planner က အသုံးမပြုသေးပါဘူး။ ဒီ ကန့်သတ်ချက်ကို PostgreSQL ရဲ့ အနာဂတ် version တစ်ခုမှာ ဖယ်ရှားဖို့ ဖွယ် ရှိပါတယ်။

## Examples (ဥပမာများ)

`t1` table တစ်ခုကို — functionally dependent (functional dependency ရှိတဲ့) columns နှစ်ခုနဲ့ ဖန်တီးပါ — ဆိုလိုတာက — ပထမ column ထဲက တန်ဖိုးတစ်ခုကို သိရှိခြင်းက — အခြား column ထဲက တန်ဖိုးကို ဆုံးဖြတ်ဖို့ လုံလောက်ပါတယ်။ ပြီးရင် — အဲဒီ columns တွေပေါ်မှာ functional dependency statistics တွေကို တည်ဆောက်ပါ:

```sql
CREATE TABLE t1 (
    a   int,
    b   int
);

INSERT INTO t1 SELECT i/100, i/500
                 FROM generate_series(1,1000000) s(i);

ANALYZE t1;

-- the number of matching rows will be drastically underestimated:
EXPLAIN ANALYZE SELECT * FROM t1 WHERE (a = 1) AND (b = 0);

CREATE STATISTICS s1 (dependencies) ON a, b FROM t1;

ANALYZE t1;

-- now the row count estimate is more accurate:
EXPLAIN ANALYZE SELECT * FROM t1 WHERE (a = 1) AND (b = 0);
```

Functional-dependency statistics မရှိဘဲနဲ့ — planner က — `WHERE` conditions နှစ်ခုက လွတ်လပ် (independent) တယ်လို့ ယူဆပြီး — သူတို့ရဲ့ selectivities တွေကို မြှောက်ခြင်းအားဖြင့် — အလွန် သေးငယ်လွန်းတဲ့ row count estimate တစ်ခုကို ရောက်ရှိမှာ ဖြစ်ပါတယ်။ ဒီလို statistics တွေ ရှိနေရင်တော့ — planner က — `WHERE` conditions တွေက ထပ်နေ (redundant) တယ်ဆိုတာကို သိရှိပြီး — row count ကို လျှော့တွက် (underestimate) မလုပ်တော့ပါဘူး။

`t2` table တစ်ခုကို — လုံးဝ ဆက်စပ်နေတဲ့ (perfectly correlated — identical data ပါဝင်တဲ့) columns နှစ်ခုနဲ့ ဖန်တီးပြီး — အဲဒီ columns တွေပေါ်မှာ MCV list တစ်ခု တည်ဆောက်ပါ:

```sql
CREATE TABLE t2 (
    a   int,
    b   int
);

INSERT INTO t2 SELECT mod(i,100), mod(i,100)
                 FROM generate_series(1,1000000) s(i);

CREATE STATISTICS s2 (mcv) ON a, b FROM t2;

ANALYZE t2;

-- valid combination (found in MCV)
EXPLAIN ANALYZE SELECT * FROM t2 WHERE (a = 1) AND (b = 1);

-- invalid combination (not found in MCV)
EXPLAIN ANALYZE SELECT * FROM t2 WHERE (a = 1) AND (b = 2);
```

MCV list က planner ကို — table ထဲမှာ ပုံမှန် ပေါ်နေတဲ့ တန်ဖိုးတစ်ခုချင်းစီအကြောင်း — ပိုပြီး အသေးစိတ် အချက်အလက်တွေကို ပေးသလို — table ထဲမှာ မပေါ်တဲ့ value combination တွေရဲ့ selectivities တွေအတွက် အထက်ကန့်သတ်ချက် (upper bound) တစ်ခုကိုလည်း ပေးပါတယ် — ဒါက planner ကို ကိစ္စ နှစ်မျိုးလုံးမှာ ပိုကောင်းတဲ့ estimates တွေ ထုတ်လုပ်နိုင်စေပါတယ်။

`t3` table တစ်ခုကို — timestamp column တစ်ခုတည်းနဲ့ ဖန်တီးပြီး — အဲဒီ column ပေါ်မှာ expressions တွေ သုံးထားတဲ့ queries တွေ run လုပ်ပါ။ Extended statistics မရှိဘဲနဲ့ — planner က — expressions တွေအတွက် data distribution အကြောင်း အချက်အလက် ဘာမှ မရှိတာကြောင့် — default estimates တွေကို သုံးပါတယ်။ Planner က — month အထိ ဖြတ်တောက်ထားတဲ့ (truncate လုပ်ထားတဲ့) date ရဲ့ တန်ဖိုးက — day အထိ ဖြတ်တောက်ထားတဲ့ date ရဲ့ တန်ဖိုးကနေ — အပြည့်အဝ ဆုံးဖြတ်နိုင်တယ်ဆိုတာကိုလည်း သဘောပေါက် နားလည်ခြင်း မရှိပါဘူး။ ပြီးရင် — အဲဒီ expressions နှစ်ခုအပေါ်မှာ expression နဲ့ ndistinct statistics တွေကို တည်ဆောက်ပါ:

```sql
CREATE TABLE t3 (
    a   timestamp
);

INSERT INTO t3 SELECT i FROM generate_series('2020-01-01'::timestamp,
                                             '2020-12-31'::timestamp,
                                             '1 minute'::interval) s(i);

ANALYZE t3;

-- the number of matching rows will be drastically underestimated:
EXPLAIN ANALYZE SELECT * FROM t3
  WHERE date_trunc('month', a) = '2020-01-01'::timestamp;

EXPLAIN ANALYZE SELECT * FROM t3
  WHERE date_trunc('day', a) BETWEEN '2020-01-01'::timestamp
                                 AND '2020-06-30'::timestamp;

EXPLAIN ANALYZE SELECT date_trunc('month', a), date_trunc('day', a)
   FROM t3 GROUP BY 1, 2;

-- build ndistinct statistics on the pair of expressions (per-expression
-- statistics are built automatically)
CREATE STATISTICS s3 (ndistinct) ON date_trunc('month', a), date_trunc('day', a) FROM t3;

ANALYZE t3;

-- now the row count estimates are more accurate:
EXPLAIN ANALYZE SELECT * FROM t3
  WHERE date_trunc('month', a) = '2020-01-01'::timestamp;

EXPLAIN ANALYZE SELECT * FROM t3
  WHERE date_trunc('day', a) BETWEEN '2020-01-01'::timestamp
                                 AND '2020-06-30'::timestamp;

EXPLAIN ANALYZE SELECT date_trunc('month', a), date_trunc('day', a)
   FROM t3 GROUP BY 1, 2;
```

Expression နဲ့ ndistinct statistics တွေ မရှိဘဲနဲ့ — planner က — expressions တွေအတွက် distinct values အရေအတွက်အကြောင်း အချက်အလက် ဘာမှ မရှိတာကြောင့် — default estimates တွေကို မှီခိုရပါတယ်။ Equality နဲ့ range conditions တွေကို 0.5% selectivity ရှိတယ်လို့ ယူဆပြီး — expression ထဲက distinct values အရေအတွက်က — column အတွက်လိုပဲ (ဆိုလိုတာက — unique) ဖြစ်တယ်လို့ ယူဆပါတယ်။ ဒါက — query နှစ်ခု ပထမပိုင်းမှာ row count ကို သိသိသာသာ လျှော့တွက်တာ ဖြစ်စေပါတယ်။ ဒါ့အပြင် — planner က expressions တွေကြားက ဆက်စပ်မှုအကြောင်း အချက်အလက် မရှိတာကြောင့် — `WHERE` နဲ့ `GROUP BY` conditions နှစ်ခုက လွတ်လပ်တယ်လို့ ယူဆပြီး — သူတို့ရဲ့ selectivities တွေကို မြှောက်ခြင်းအားဖြင့် — aggregate query ထဲမှာ group count ကို ပြင်းထန်စွာ အလွန်အကျွံ တွက်ချက်မှု (overestimate) ဆီ ရောက်ရှိပါတယ်။ Expressions တွေအတွက် တိကျတဲ့ statistics တွေ မရှိတာက — planner ကို column အတွက် ndistinct ကနေ ဆင်းသက်လာတဲ့ expression အတွက် default ndistinct estimate တစ်ခုကို သုံးစေပြီး — ဒါက ဒီ ပြဿနာကို ပိုဆိုးစေပါတယ်။ ဒီလို statistics တွေ ရှိနေရင်တော့ — planner က conditions တွေက ဆက်စပ် (correlated) နေတယ်ဆိုတာကို သိရှိပြီး — ပိုပြီး တိကျတဲ့ estimates တွေဆီ ရောက်ရှိပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE STATISTICS` command ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER STATISTICS](/docs/postgresql/sql-alterstatistics), [DROP STATISTICS](/docs/postgresql/sql-dropstatistics)
