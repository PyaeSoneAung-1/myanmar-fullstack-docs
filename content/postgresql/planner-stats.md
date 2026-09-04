---
title: "Statistics Used by the Planner (planner အသုံးပြုသော statistics များ)"
description: "Planner က query plan ရွေးချယ်ရာမှာ အသုံးပြုတဲ့ statistics များအကြောင်း — single-column statistics (column တစ်ခုချင်းစီအလိုက်) နဲ့ extended statistics (column မျိုးစုံ ခြုံငုံသော) နှစ်မျိုးလုံးကို ရှင်းလင်းချက်"
order: 136
source: "https://www.postgresql.org/docs/current/planner-stats.html"
status: translated
updated: 2026-09-03
---

## 14.2. Statistics Used by the Planner (planner အသုံးပြုသော statistics များ)

- **14.2.1. Single-Column Statistics (column တစ်ခုတည်းအတွက် statistics)**
- **14.2.2. Extended Statistics (column မျိုးစုံ ပါဝင်သော statistics)**

### 14.2.1. Single-Column Statistics (column တစ်ခုတည်းအတွက် statistics)

အရင် section မှာ မြင်ခဲ့ရတဲ့အတိုင်း — query planner က query plan ကောင်းကောင်း ရွေးချယ်နိုင်ဖို့အတွက် — query တစ်ခုက ပြန်ပေးမယ့် row အရေအတွက်ကို ခန့်မှန်းဖို့ လိုအပ်ပါတယ်။ ဒီ section မှာတော့ — ဒီခန့်မှန်းချက်တွေအတွက် system က အသုံးပြုတဲ့ statistics (စာရင်းအင်း အချက်အလက်များ) တွေကို အကြမ်းဖျင်း ကြည့်ရမှာ ဖြစ်ပါတယ်။

Statistics တွေရဲ့ အစိတ်အပိုင်း တစ်ခုကတော့ — table နဲ့ index တစ်ခုချင်းစီထဲမှာ ရှိတဲ့ entry စုစုပေါင်း အရေအတွက်၊ ပြီးတော့ table နဲ့ index တစ်ခုချင်းစီက သိမ်းပိုက်ထားတဲ့ disk block အရေအတွက် ဖြစ်ပါတယ်။ ဒီအချက်အလက်တွေကို [`pg_class`](https://www.postgresql.org/docs/current/catalog-pg-class.html) table ထဲက `reltuples` နဲ့ `relpages` column တွေထဲမှာ သိမ်းထားပါတယ်။ အောက်ပါအတိုင်း ဆင်တူတဲ့ query တွေနဲ့ ကြည့်လို့ရပါတယ် —

```sql
SELECT relname, relkind, reltuples, relpages
FROM pg_class
WHERE relname LIKE 'tenk1%';

       relname        | relkind | reltuples | relpages
----------------------+---------+-----------+----------
 tenk1                | r       |     10000 |      345
 tenk1_hundred        | i       |     10000 |       11
 tenk1_thous_tenthous | i       |     10000 |       30
 tenk1_unique1        | i       |     10000 |       30
 tenk1_unique2        | i       |     10000 |       30
(5 rows)
```

ဒီမှာ တွေ့ရတာက — `tenk1` ထဲမှာ row 10000 ပါဝင်ပြီး — သူ့ရဲ့ index တွေထဲမှာလည်း row 10000 စီ ပါဝင်ပါတယ်။ ဒါပေမယ့် index တွေကတော့ — (အံ့သြစရာ မဟုတ်ဘဲ) — table ထက် အများကြီး သေးငယ်ပါတယ်။

စွမ်းဆောင်ရည် (efficiency) အကြောင်းပြချက်တွေကြောင့် — `reltuples` နဲ့ `relpages` တွေကို အချိန်နဲ့ တစ်ပြေးညီ (on-the-fly) update မလုပ်ပဲ ထားတာမို့ — ပုံမှန်အားဖြင့် ဒီတန်ဖိုးတွေက အတန်ငယ် နောက်ကျနေတဲ့ (out-of-date) တန်ဖိုးတွေ ဖြစ်နေတတ်ပါတယ်။ ဒါတွေကို `VACUUM`၊ `ANALYZE` နဲ့ `CREATE INDEX` လို DDL command အနည်းငယ်က update လုပ်ပေးပါတယ်။ Table တစ်ခုလုံးကို scan မလုပ်တဲ့ `VACUUM` ဒါမှမဟုတ် `ANALYZE` operation တစ်ခု (အများအားဖြင့် ဒီလိုပဲ ဖြစ်တတ်ပါတယ်) က — သူ scan လုပ်ခဲ့တဲ့ table အပိုင်းကို အခြေခံပြီး — `reltuples` count ကို တစ်ဆင့်ချင်း (incrementally) update လုပ်တာမို့ — ရလာတဲ့တန်ဖိုးက အကြမ်းဖျင်း (approximate) သာ ဖြစ်ပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — planner က `pg_class` ထဲမှာ တွေ့ရတဲ့ တန်ဖိုးတွေကို — လက်ရှိ table ရဲ့ တကယ့် physical size နဲ့ ကိုက်ညီအောင် — scale (အချိုးကျ ချိန်ညှိ) လုပ်လိုက်လို့ — ပိုပြီး အနီးစပ်ဆုံး ခန့်မှန်းချက် တစ်ခုကို ရရှိပါတယ်။

Query အများစုက table ထဲက row တွေရဲ့ အစိတ်အပိုင်း တစ်ခုကိုပဲ ပြန်လည် ရယူပါတယ် — စစ်ဆေးရမယ့် row တွေကို ကန့်သတ်ပေးတဲ့ `WHERE` clause တွေ ရှိနေလို့ပါ။ ဒါကြောင့် planner က `WHERE` clause တွေရဲ့ *selectivity* — ဆိုလိုတာက `WHERE` clause ထဲက condition တစ်ခုချင်းစီနဲ့ ကိုက်ညီတဲ့ row အချိုးအစား — ကို ခန့်မှန်းဖို့ လိုအပ်ပါတယ်။ ဒီလုပ်ငန်းအတွက် အသုံးပြုတဲ့ အချက်အလက်တွေကို [`pg_statistic`](https://www.postgresql.org/docs/current/catalog-pg-statistic.html) system catalog (PostgreSQL ရဲ့ internal metadata တွေကို သိမ်းဆည်းတဲ့ catalog) ထဲမှာ သိမ်းထားပါတယ်။ `pg_statistic` ထဲက entry တွေကို `ANALYZE` နဲ့ `VACUUM ANALYZE` command တွေက update လုပ်ပေးပြီး — အသစ် update လုပ်ပြီးချိန်မှာတောင် — အမြဲတမ်း အကြမ်းဖျင်း တန်ဖိုးတွေသာ ဖြစ်ပါတယ်။

`pg_statistic` ကို တိုက်ရိုက် ကြည့်မယ့်အစား — statistics တွေကို လူကိုယ်တိုင် စစ်ဆေးကြည့်တဲ့အခါ — သူ့ရဲ့ view ဖြစ်တဲ့ [`pg_stats`](https://www.postgresql.org/docs/current/view-pg-stats.html) ကို ကြည့်တာက ပိုကောင်းပါတယ်။ `pg_stats` က ပိုပြီး လွယ်ကူစွာ ဖတ်လို့ရအောင် ဒီဇိုင်း လုပ်ထားပါတယ်။ ဒါ့အပြင် — `pg_stats` ကို လူတိုင်း ဖတ်လို့ရပြီး — `pg_statistic` ကိုတော့ superuser တစ်ယောက်တည်းသာ ဖတ်လို့ရပါတယ်။ (ဒါက — privilege မရှိတဲ့ user တွေက တခြားသူတွေရဲ့ table တွေရဲ့ အကြောင်းအရာတွေကို statistics ကနေ တစ်ဆင့် မသိအောင် ကာကွယ်ပေးပါတယ်။ `pg_stats` view ကတော့ — လက်ရှိ user ဖတ်လို့ရတဲ့ table တွေရဲ့ row တွေကိုပဲ ပြသဖို့ ကန့်သတ်ထားပါတယ်။) ဥပမာအနေနဲ့ — အောက်ပါအတိုင်း လုပ်နိုင်ပါတယ် —

```sql
SELECT attname, inherited, n_distinct,
       array_to_string(most_common_vals, E'\n') as most_common_vals
FROM pg_stats
WHERE tablename = 'road';

 attname | inherited | n_distinct |          most_common_vals
---------+-----------+------------+------------------------------------
 name    | f         | -0.5681108 | I- 580                        Ramp+
         |           |            | I- 880                        Ramp+
         |           |            | Sp Railroad                       +
         |           |            | I- 580                            +
         |           |            | I- 680                        Ramp+
         |           |            | I- 80                         Ramp+
         |           |            | 14th                          St  +
         |           |            | I- 880                            +
         |           |            | Mac Arthur                    Blvd+
         |           |            | Mission                       Blvd+
...
 name    | t         |    -0.5125 | I- 580                        Ramp+
         |           |            | I- 880                        Ramp+
         |           |            | I- 580                            +
         |           |            | I- 680                        Ramp+
         |           |            | I- 80                         Ramp+
         |           |            | Sp Railroad                       +
         |           |            | I- 880                            +
         |           |            | State Hwy 13                  Ramp+
         |           |            | I- 80                             +
         |           |            | State Hwy 24                  Ramp+
...
 thepath | f         |          0 |
 thepath | t         |          0 |
(4 rows)
```

Column တစ်ခုတည်းအတွက်ကို row နှစ်တန်း ပြထားတာကို သတိပြုပါ — တစ်ခုက `road` table ကနေ စတင်တဲ့ inheritance hierarchy (အမွေဆက်ခံမှု အဆင့်ဆင့်) တစ်ခုလုံးနဲ့ သက်ဆိုင်တာ (`inherited`=`t`) ဖြစ်ပြီး — နောက်တစ်ခုက `road` table ကိုယ်တိုင်တည်းကိုပဲ ထည့်သွင်းထားတာ (`inherited`=`f`) ဖြစ်ပါတယ်။ (အတိုချုံးဖို့အတွက် — `name` column ရဲ့ အဖြစ်အများဆုံး တန်ဖိုး ဆယ်ခုကိုပဲ ဒီမှာ ပြထားပါတယ်။)

`ANALYZE` က `pg_statistic` ထဲမှာ သိမ်းဆည်းတဲ့ အချက်အလက် ပမာဏ — အထူးသဖြင့် column တစ်ခုချင်းစီအတွက် `most_common_vals` နဲ့ `histogram_bounds` array တွေထဲက entry အများဆုံး အရေအတွက် — ကို `ALTER TABLE SET STATISTICS` command သုံးပြီး column အလိုက် သတ်မှတ်လို့ရသလို — [default_statistics_target](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET) configuration variable ကို သတ်မှတ်ပြီး — တစ်ကမ္ဘာလုံး အတိုင်းအတာနဲ့လည်း သတ်မှတ်လို့ရပါတယ်။ လက်ရှိ default limit က entry 100 ဖြစ်ပါတယ်။ Limit ကို မြှင့်လိုက်ရင် — အထူးသဖြင့် ပုံမှန် မဟုတ်တဲ့ (irregular) data distribution တွေ ရှိတဲ့ column တွေအတွက် — planner ရဲ့ ခန့်မှန်းချက် တွေ ပိုတိကျလာနိုင်ပေမယ့် — `pg_statistic` ထဲမှာ နေရာ ပိုယူပြီး — ခန့်မှန်းချက်တွေ တွက်ချက်ဖို့ အချိန် အနည်းငယ် ပိုကြာစေပါတယ်။ အပြန်အလှန်အားဖြင့် — ရိုးရှင်းတဲ့ data distribution တွေ ရှိတဲ့ column တွေအတွက်တော့ — limit နိမ့်နိမ့် လုံလောက်နိုင်ပါတယ်။

Planner က statistics တွေကို အသုံးပြုပုံရဲ့ နောက်ထပ် အသေးစိတ် အချက်အလက်တွေကို [အခန်း 69](https://www.postgresql.org/docs/current/planner-stats-details.html) မှာ တွေ့နိုင်ပါတယ်။

### 14.2.2. Extended Statistics (column မျိုးစုံ ပါဝင်သော statistics)

Query clause တွေမှာ အသုံးပြုထားတဲ့ column တွေ အများအပြားက တစ်ခုနဲ့တစ်ခု ဆက်စပ်နေ (correlated) တာကြောင့် — ညံ့ဖျင်းတဲ့ execution plan တွေနဲ့ run နေတဲ့ နှေးကွေးတဲ့ query တွေကို တွေ့ရတာ သာမန်ပါ။ Planner က ပုံမှန်အားဖြင့် — condition တွေ အများအပြားက တစ်ခုနဲ့တစ်ခု အမှီအခိုကင်း (independent) တယ်လို့ ယူဆပါတယ် — column တန်ဖိုးတွေ ဆက်စပ်နေတဲ့အခါမှာတော့ ဒီယူဆချက်က မမှန်တော့ပါဘူး။ သာမန် (regular) statistics တွေက — column တစ်ခုချင်းစီအလိုက် သဘောသဘာဝ ရှိတာကြောင့် — column ဖြတ်ကူး ဆက်စပ်မှု (cross-column correlation) အကြောင်းကို ဘာမှ ဖမ်းယူနိုင်ခြင်း မရှိပါဘူး။ ဒါပေမယ့် — PostgreSQL မှာ ဒီလို အချက်အလက်တွေကို ဖမ်းယူနိုင်တဲ့ *multivariate statistics* (column များစွာ ပါဝင်တဲ့ ပေါင်းစပ်မှုကို ခြုံငုံ တွက်ချက်တဲ့ statistics) တွေကို တွက်ချက်နိုင်တဲ့ စွမ်းရည် ရှိပါတယ်။

ဖြစ်နိုင်ခြေ ရှိတဲ့ column ပေါင်းစပ်မှု (combination) အရေအတွက်က အလွန် များပြားတာကြောင့် — multivariate statistics တွေကို အလိုအလျောက် တွက်ချက်တာက လက်တွေ့ မဖြစ်နိုင်ပါဘူး။ အဲဒီအစား — *extended statistics objects* (တိုးချဲ့ထားသော statistics object များ — များသောအားဖြင့် *statistics objects* လို့ပဲ အတိုခေါ်လေ့ ရှိပါတယ်) တွေကို ဖန်တီးပြီး — စိတ်ဝင်စားစရာ column အစုတွေရဲ့ statistics တွေကို ရယူဖို့ server ကို ညွှန်ကြားနိုင်ပါတယ်။

Statistics objects တွေကို [`CREATE STATISTICS`](https://www.postgresql.org/docs/current/sql-createstatistics.html) command နဲ့ ဖန်တီးပါတယ်။ ဒီလို object တစ်ခု ဖန်တီးလိုက်တာက — ဒီ statistics တွေကို စိတ်ဝင်စားကြောင်း ဖော်ပြတဲ့ catalog entry တစ်ခုကို ဖန်တီးလိုက်တာမျှသာ ဖြစ်ပါတယ်။ တကယ့် data စုဆောင်းမှုကိုတော့ `ANALYZE` (လူကိုယ်တိုင် run တဲ့ command ဖြစ်စေ — background က auto-analyze ဖြစ်စေ) က လုပ်ဆောင်ပါတယ်။ စုဆောင်းလို့ရတဲ့ တန်ဖိုးတွေကို [`pg_statistic_ext_data`](https://www.postgresql.org/docs/current/catalog-pg-statistic-ext-data.html) catalog ထဲမှာ စစ်ဆေး ကြည့်ရှုနိုင်ပါတယ်။

`ANALYZE` က — သာမန် single-column statistics တွေကို တွက်ချက်ဖို့ ယူတဲ့ table row နမူနာ (sample) ကိုပဲ — extended statistics တွေကို တွက်ချက်တဲ့အခါမှာလည်း အသုံးပြုပါတယ်။ Sample size ကို — table ဒါမှမဟုတ် သူ့ရဲ့ column တစ်ခုခုအတွက် statistics target ကို မြှင့်လိုက်ရင် (အရင် section မှာ ဖော်ပြခဲ့တဲ့အတိုင်း) — ပိုများလာတာမို့ — statistics target ပိုကြီးလေလေ — extended statistics တွေ ပိုတိကျလေလေ ဖြစ်သလို — သူတို့ကို တွက်ချက်ဖို့ အချိန်လည်း ပိုကြာလေလေ ဖြစ်ပါတယ်။

အောက်ပါ subsection တွေမှာ — လက်ရှိ ထောက်ပံ့ထားတဲ့ extended statistics အမျိုးအစားတွေကို ဖော်ပြထားပါတယ်။

#### 14.2.2.1. Functional Dependencies (column များအကြား မှီခိုမှု ဆက်စပ်ချက်များ)

အရိုးရှင်းဆုံး extended statistics အမျိုးအစားကတော့ — *functional dependencies* (functional dependency — database normal form (ပုံမှန် ပုံစံ) တွေရဲ့ အဓိပ္ပာယ် ဖွင့်ဆိုချက်တွေမှာ အသုံးပြုတဲ့ အယူအဆ) တွေကို ခြေရာခံပါတယ်။ Column `a` ရဲ့ တန်ဖိုးကို သိရှိရုံနဲ့ column `b` ရဲ့ တန်ဖိုးကို ဆုံးဖြတ်ဖို့ လုံလောက်မယ်ဆိုရင် — ဆိုလိုတာက — `a` တန်ဖိုး တူညီပြီး `b` တန်ဖိုး မတူညီတဲ့ row နှစ်တန်း မရှိဘူးဆိုရင် — column `b` က column `a` အပေါ်မှာ functionally dependent (လုပ်ဆောင်ချက်အရ မှီခို) တယ်လို့ ဆိုပါတယ်။ အပြည့်အဝ normalized ဖြစ်တဲ့ database တစ်ခုမှာ functional dependencies တွေက primary key တွေနဲ့ superkey (record တစ်ခုကို သီးသန့် သတ်မှတ်နိုင်တဲ့ column အစု) တွေပေါ်မှာသာ တည်ရှိသင့်ပါတယ်။ ဒါပေမယ့် — လက်တွေ့မှာတော့ data set အများအပြားက အကြောင်းအမျိုးမျိုးကြောင့် အပြည့်အဝ normalized မဟုတ်ပါဘူး; performance အတွက် ရည်ရွယ်ချက်ရှိရှိ denormalize လုပ်တာက သာမန် ဥပမာတစ်ခုပါ။ အပြည့်အဝ normalized database တစ်ခုမှာတောင် — column တချို့ကြားမှာ တစ်စိတ်တစ်ပိုင်း ဆက်စပ်မှု (partial correlation) ရှိနေနိုင်ပြီး — အဲဒါကို partial functional dependency (တစ်စိတ်တစ်ပိုင်း functional dependency) အနေနဲ့ ဖော်ပြနိုင်ပါတယ်။

Functional dependencies တွေ တည်ရှိနေခြင်းက — query တချို့မှာ ခန့်မှန်းချက်တွေရဲ့ တိကျမှုကို တိုက်ရိုက် သက်ရောက်မှု ရှိပါတယ်။ Query တစ်ခုမှာ အမှီအခိုကင်းတဲ့ column နဲ့ မှီခိုနေတဲ့ column (များ) နှစ်ခုလုံးအပေါ်မှာ condition တွေ ပါဝင်နေရင် — မှီခိုနေတဲ့ column တွေအပေါ်က condition တွေက result size ကို ထပ်ပြီး လျှော့ချပေးခြင်း မရှိတော့ပါဘူး; ဒါပေမယ့် — functional dependency အကြောင်း မသိရဘူးဆိုရင် — query planner က condition တွေ အားလုံးက အမှီအခိုကင်းတယ်လို့ ယူဆပြီး — result size ကို လျှော့တွက် (underestimate) လုပ်မိမှာ ဖြစ်ပါတယ်။

Planner ကို functional dependencies အကြောင်း အသိပေးဖို့အတွက် — `ANALYZE` က column ဖြတ်ကူး မှီခိုမှုရဲ့ တိုင်းတာမှု (measurement) တွေကို စုဆောင်းနိုင်ပါတယ်။ Column အစုတိုင်းကြားက မှီခိုမှုရဲ့ အတိုင်းအတာကို အကဲဖြတ်တာက မခံမရပ်နိုင်လောက်အောင် ဈေးကြီးတာမို့ — data စုဆောင်းမှုကို `dependencies` option နဲ့ သတ်မှတ်ထားတဲ့ statistics object တစ်ခုထဲမှာ အတူတကွ ပါဝင်နေတဲ့ column အစုတွေအတွက်သာ ကန့်သတ်ထားပါတယ်။ ပြင်းပြင်းထန်ထန် ဆက်စပ်နေတဲ့ column အစုတွေအတွက်သာ `dependencies` statistics ကို ဖန်တီးတာ သင့်လျော်ပါတယ် — `ANALYZE` ရော နောက်ပိုင်း query planning မှာပါ မလိုအပ်တဲ့ overhead (အပိုဝန်ထုပ်) တွေ မဖြစ်စေဖို့အတွက်ပါ။

ဒီမှာ functional-dependency statistics တွေ စုဆောင်းတဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ် —

```sql
CREATE STATISTICS stts (dependencies) ON city, zip FROM zipcodes;

ANALYZE zipcodes;

SELECT stxname, stxkeys, stxddependencies
  FROM pg_statistic_ext join pg_statistic_ext_data on (oid = stxoid)
  WHERE stxname = 'stts';
 stxname | stxkeys |             stxddependencies
---------+---------+------------------------------------------
 stts    | 1 5     | {"1 => 5": 1.000000, "5 => 1": 0.423130}
(1 row)
```

ဒီမှာ မြင်ရတာက — column 1 (zip code) က column 5 (city) ကို အပြည့်အဝ ဆုံးဖြတ်ပေးလို့ coefficient က 1.0 ဖြစ်ပြီး — city ကတော့ zip code ကို အကြိမ် 42% ခန့်မှာသာ ဆုံးဖြတ်ပေးပါတယ်။ ဆိုလိုတာက — ZIP code တစ်ခုထက်ပိုပြီး ကိုယ်စားပြုခံရတဲ့ city တွေ အများအပြား (58%) ရှိနေပါတယ်။

Functional dependent ဖြစ်တဲ့ column တွေ ပါဝင်တဲ့ query တစ်ခုအတွက် selectivity ကို တွက်ချက်တဲ့အခါ — planner က dependency coefficients တွေကို အသုံးပြုပြီး — condition တစ်ခုချင်းစီရဲ့ selectivity ခန့်မှန်းချက်တွေကို ချိန်ညှိပေးတာမို့ — လျှော့တွက် ဖြစ်မသွားအောင် ကာကွယ်ပါတယ်။

##### 14.2.2.1.1. Limitations of Functional Dependencies (functional dependency များ၏ ကန့်သတ်ချက်များ)

Functional dependencies တွေကို လက်ရှိမှာ — column တွေကို ကိန်းသေတန်ဖိုး (constant value) တွေနဲ့ ယှဉ်ပြတဲ့ ရိုးရှင်းတဲ့ equality condition တွေနဲ့ — ကိန်းသေတန်ဖိုးတွေ ပါဝင်တဲ့ `IN` clause တွေမှာသာ အသုံးပြုပါတယ်။ Column နှစ်ခုကို အချင်းချင်း ယှဉ်တဲ့ equality condition ဒါမှမဟုတ် column တစ်ခုကို expression တစ်ခုနဲ့ ယှဉ်တဲ့ equality condition တွေရဲ့ ခန့်မှန်းချက်တွေကို တိုးတက်စေဖို့လည်း မဟုတ်သလို — range clause တွေ၊ `LIKE` ဒါမှမဟုတ် တခြား condition အမျိုးအစား ဘယ်ဟာအတွက်မှလည်း အသုံးမပြုပါဘူး။

Functional dependencies တွေနဲ့ ခန့်မှန်းတဲ့အခါ — planner က ပါဝင်တဲ့ column တွေအပေါ်က condition တွေက တစ်ခုနဲ့တစ်ခု လိုက်ဖက်ညီပြီး — ဒါကြောင့် ထပ်နေ (redundant) တယ်လို့ ယူဆပါတယ်။ သူတို့က လိုက်ဖက်မှု မရှိဘူးဆိုရင် — မှန်ကန်တဲ့ ခန့်မှန်းချက်က row သုည ဖြစ်သင့်ပေမယ့် — အဲဒီဖြစ်နိုင်ခြေကိုတော့ ထည့်သွင်း စဉ်းစားမထားပါဘူး။ ဥပမာ — အောက်ပါအတိုင်း query တစ်ခု ပေးထားတယ်ဆိုပါစို့ —

```sql
SELECT * FROM zipcodes WHERE city = 'San Francisco' AND zip = '94105';
```

ဒီ query အတွက်ဆိုရင် — planner က `city` clause ကို selectivity ကို ပြောင်းလဲစေတဲ့အရာ မဟုတ်ဘူးလို့ ယူဆပြီး — ထည့်တွက်မခံတော့တာက မှန်ကန်ပါတယ်။ ဒါပေမယ့် — အောက်ပါ query အတွက်လည်း ဒီအတိုင်းပဲ ယူဆပါလိမ့်မယ် —

```sql
SELECT * FROM zipcodes WHERE city = 'San Francisco' AND zip = '90210';
```

တကယ်တော့ ဒီ query ကို ကျေနပ်စေမယ့် row က သုညပဲ ရှိပါတယ်။ ဒါပေမယ့် — functional dependency statistics တွေက အဲဒီလို ကောက်ချက်ချနိုင်လောက်အောင် လုံလောက်တဲ့ အချက်အလက်တွေတော့ မပေးပါဘူး။

လက်တွေ့ အခြေအနေ အများအပြားမှာ — ဒီယူဆချက်က များသောအားဖြင့် ပြည့်စုံပါတယ်; ဥပမာ — application ထဲမှာ query တွေမှာ အသုံးပြုဖို့ လိုက်ဖက်ညီတဲ့ city နဲ့ ZIP code တန်ဖိုးတွေကိုပဲ ရွေးချယ်ခွင့် ပြုတဲ့ GUI တစ်ခု ရှိနေတာမျိုးပါ။ ဒါပေမယ့် — အဲဒီလို မဟုတ်ဘူးဆိုရင် — functional dependencies တွေက အလားအလာ ကောင်းတဲ့ ရွေးချယ်မှု မဟုတ်နိုင်ပါဘူး။

#### 14.2.2.2. Multivariate N-Distinct Counts (multivariate n-distinct အရေအတွက်များ)

Single-column statistics တွေက column တစ်ခုချင်းစီထဲမှာ ရှိတဲ့ distinct value အရေအတွက်ကို သိမ်းဆည်းပါတယ်။ Column တစ်ခုထက်ပိုပြီး ပေါင်းစပ်လိုက်တဲ့အခါ (ဥပမာ — `GROUP BY a, b` အတွက်) distinct value အရေအတွက်ရဲ့ ခန့်မှန်းချက်တွေက — planner မှာ single-column statistical data တွေပဲ ရှိနေတဲ့အခါ — မကြာခဏဆိုသလို မှားယွင်းတတ်ပြီး — ညံ့ဖျင်းတဲ့ plan တွေကို ရွေးချယ်မိစေပါတယ်။

ဒီလို ခန့်မှန်းချက်တွေ တိုးတက်စေဖို့အတွက် — `ANALYZE` က column အစုတွေအတွက် n-distinct statistics (column ပေါင်းစပ်မှုတစ်ခုအတွင်း distinct value အရေအတွက်ဆိုင်ရာ statistics) တွေကို စုဆောင်းနိုင်ပါတယ်။ အရင်ကလိုပဲ — ဖြစ်နိုင်ခြေ ရှိတဲ့ column အုပ်စု (grouping) တိုင်းအတွက် ဒါကို လုပ်ဆောင်တာက လက်တွေ့ မဖြစ်နိုင်လို့ — `ndistinct` option နဲ့ သတ်မှတ်ထားတဲ့ statistics object တစ်ခုထဲမှာ အတူတကွ ပါဝင်နေတဲ့ column အစုတွေအတွက်သာ data စုဆောင်းပါတယ်။ စာရင်းပြုထားတဲ့ column အစုကနေ — column နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုပြီး ပါဝင်တဲ့ ဖြစ်နိုင်ခြေ ရှိတဲ့ ပေါင်းစပ်မှု (combination) တိုင်းအတွက် data စုဆောင်းမှာ ဖြစ်ပါတယ်။

အရင် ဥပမာကို ဆက်ပြီး — ZIP code တွေရဲ့ table တစ်ခုထဲက n-distinct counts တွေက အောက်ပါအတိုင်း ဖြစ်နိုင်ပါတယ် —

```sql
CREATE STATISTICS stts2 (ndistinct) ON city, state, zip FROM zipcodes;

ANALYZE zipcodes;

SELECT stxkeys AS k, stxdndistinct AS nd
  FROM pg_statistic_ext join pg_statistic_ext_data on (oid = stxoid)
  WHERE stxname = 'stts2';
-[ RECORD 1 ]------------------------------------------------------​--
k  | 1 2 5
nd | {"1, 2": 33178, "1, 5": 33178, "2, 5": 27435, "1, 2, 5": 33178}
(1 row)
```

ဒါက ဖော်ပြတာက — distinct value 33178 စီ ရှိတဲ့ column ပေါင်းစပ်မှု သုံးခု ရှိပါတယ်: ZIP code နဲ့ state; ZIP code နဲ့ city; ပြီးတော့ ZIP code, city နဲ့ state (ဒီ table ထဲမှာ ZIP code တစ်ခုတည်းက သူ့ဘာသာ unique ဖြစ်နေတာကြောင့် — ဒီသုံးခုလုံး တူညီနေတာက မျှော်လင့်ထားတဲ့အတိုင်းပဲ ဖြစ်ပါတယ်)။ တစ်ဖက်မှာ — city နဲ့ state ရဲ့ ပေါင်းစပ်မှုကတော့ distinct value 27435 ပဲ ရှိပါတယ်။

တကယ်တမ်း grouping အတွက် အသုံးပြုနေတဲ့ — ပြီးတော့ group အရေအတွက်ကို လွဲမှားစွာ ခန့်မှန်းမှုက ညံ့ဖျင်းတဲ့ plan တွေ ဖြစ်ပေါ်စေနေတဲ့ — column ပေါင်းစပ်မှုတွေပေါ်မှာသာ `ndistinct` statistics objects တွေကို ဖန်တီးတာ သင့်လျော်ပါတယ်။ မဟုတ်ရင် — `ANALYZE` ရဲ့ cycle တွေက အလဟသ ကုန်ဆုံးရုံပဲ ဖြစ်ပါတယ်။

#### 14.2.2.3. Multivariate MCV Lists (multivariate MCV list များ)

Column တစ်ခုချင်းစီအတွက် သိမ်းဆည်းထားတဲ့ နောက်ထပ် statistics အမျိုးအစားတစ်ခုကတော့ most-common value list (MCV — အဖြစ်အများဆုံး တန်ဖိုးစာရင်း) တွေပါ။ ဒါတွေက column တစ်ခုချင်းစီအတွက် အလွန် တိကျတဲ့ ခန့်မှန်းချက်တွေ ပေးနိုင်ပေမယ့် — column အများအပြားအပေါ်မှာ condition တွေ ပါဝင်တဲ့ query တွေအတွက်တော့ သိသိသာသာ လွဲမှားတဲ့ ခန့်မှန်းချက်တွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။

ဒီလို ခန့်မှန်းချက်တွေ တိုးတက်စေဖို့အတွက် — `ANALYZE` က column ပေါင်းစပ်မှုတွေပေါ်မှာ MCV list တွေကို စုဆောင်းနိုင်ပါတယ်။ Functional dependencies နဲ့ n-distinct coefficients တွေလိုပဲ — ဖြစ်နိုင်ခြေ ရှိတဲ့ column အုပ်စုတိုင်းအတွက် ဒါကို လုပ်ဆောင်တာက လက်တွေ့ မဖြစ်နိုင်ပါဘူး။ ဒီနေရာမှာတော့ ပိုတောင် ဆိုးပါတယ် — MCV list က (functional dependencies နဲ့ n-distinct coefficients တွေနဲ့ မတူဘဲ) column ရဲ့ အဖြစ်များတဲ့ တန်ဖိုးတွေကိုပါ သိမ်းဆည်းထားလို့ပါ။ ဒါကြောင့် — `mcv` option နဲ့ သတ်မှတ်ထားတဲ့ statistics object တစ်ခုထဲမှာ အတူတကွ ပါဝင်နေတဲ့ column အစုတွေအတွက်သာ data စုဆောင်းပါတယ်။

အရင် ဥပမာကို ဆက်ပြီး — ZIP code တွေရဲ့ table တစ်ခုအတွက် MCV list က အောက်ပါအတိုင်း ဖြစ်နိုင်ပါတယ် (ပိုရိုးရှင်းတဲ့ statistics အမျိုးအစားတွေနဲ့ မတူဘဲ — MCV အကြောင်းအရာတွေကို စစ်ဆေးဖို့ function တစ်ခု လိုအပ်ပါတယ်) —

```sql
CREATE STATISTICS stts3 (mcv) ON city, state FROM zipcodes;

ANALYZE zipcodes;

SELECT m.* FROM pg_statistic_ext join pg_statistic_ext_data on (oid = stxoid),
                pg_mcv_list_items(stxdmcv) m WHERE stxname = 'stts3';

 index |         values         | nulls | frequency | base_frequency
-------+------------------------+-------+-----------+----------------
     0 | {Washington, DC}       | {f,f} |  0.003467 |        2.7e-05
     1 | {Apo, AE}              | {f,f} |  0.003067 |        1.9e-05
     2 | {Houston, TX}          | {f,f} |  0.002167 |       0.000133
     3 | {El Paso, TX}          | {f,f} |     0.002 |       0.000113
     4 | {New York, NY}         | {f,f} |  0.001967 |       0.000114
     5 | {Atlanta, GA}          | {f,f} |  0.001633 |        3.3e-05
     6 | {Sacramento, CA}       | {f,f} |  0.001433 |        7.8e-05
     7 | {Miami, FL}            | {f,f} |    0.0014 |          6e-05
     8 | {Dallas, TX}           | {f,f} |  0.001367 |        8.8e-05
     9 | {Chicago, IL}          | {f,f} |  0.001333 |        5.1e-05
   ...
(99 rows)
```

ဒါက ဖော်ပြတာက — city နဲ့ state ရဲ့ အဖြစ်အများဆုံး ပေါင်းစပ်မှုက Washington, DC ဖြစ်ပြီး — (နမူနာထဲမှာ) တကယ့် frequency က 0.35% ဝန်းကျင် ရှိပါတယ်။ ဒီပေါင်းစပ်မှုရဲ့ base frequency (ရိုးရှင်းတဲ့ column တစ်ခုချင်းစီရဲ့ frequency တွေကနေ တွက်ချက်ထားတာ) က 0.0027% ပဲ ရှိတာမို့ — ပမာဏ အတိုင်းအတာ (order of magnitude) နှစ်ဆင့်အထိ လျှော့တွက် ဖြစ်နေတာကို တွေ့ရပါတယ်။

တကယ်တမ်း condition တွေထဲမှာ အတူတကွ အသုံးပြုနေတဲ့ — ပြီးတော့ group အရေအတွက်ကို လွဲမှားစွာ ခန့်မှန်းမှုက ညံ့ဖျင်းတဲ့ plan တွေ ဖြစ်ပေါ်စေနေတဲ့ — column ပေါင်းစပ်မှုတွေပေါ်မှာသာ MCV statistics objects တွေကို ဖန်တီးတာ သင့်လျော်ပါတယ်။ မဟုတ်ရင် — `ANALYZE` နဲ့ planning ရဲ့ cycle တွေက အလဟသ ကုန်ဆုံးရုံပဲ ဖြစ်ပါတယ်။
