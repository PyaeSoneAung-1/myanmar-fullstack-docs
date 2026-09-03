---
title: "Using EXPLAIN (EXPLAIN အသုံးပြုခြင်း)"
description: "PostgreSQL က query တစ်ခုစီအတွက် ရေးဆွဲတဲ့ query plan ကို EXPLAIN command နဲ့ ကြည့်ရှုနည်း — EXPLAIN အခြေခံ၊ cost/rows ခန့်မှန်းချက် ဖတ်နည်း၊ EXPLAIN ANALYZE ဖြင့် တကယ့် execution အချက်အလက် စစ်ဆေးခြင်း၊ သတိပြုရန် အချက်များ"
order: 93
source: "https://www.postgresql.org/docs/current/using-explain.html"
status: translated
updated: 2026-09-03
---

## 14.1. Using EXPLAIN (EXPLAIN အသုံးပြုခြင်း)

PostgreSQL က ရရှိတဲ့ query တစ်ခုစီအတွက် *query plan* (query ကို ဘယ်လို လုပ်ဆောင်မယ်ဆိုတဲ့ အစီအစဉ်) တစ်ခုကို ရေးဆွဲပါတယ်။ Query ရဲ့ ဖွဲ့စည်းပုံနဲ့ data ရဲ့ ဂုဏ်သတ္တိတွေနဲ့ လိုက်ဖက်မယ့် မှန်ကန်တဲ့ plan ကို ရွေးချယ်တာက ကောင်းမွန်တဲ့ performance အတွက် အလွန် အရေးကြီးတဲ့အတွက် — system ထဲမှာ ကောင်းမွန်တဲ့ plan တွေကို ရွေးချယ်ဖို့ ကြိုးစားတဲ့ ရှုပ်ထွေးတဲ့ *planner* (plan ရေးဆွဲပေးတဲ့ အစိတ်အပိုင်း) တစ်ခု ပါဝင်ပါတယ်။ Planner က ဘယ် query အတွက်မဆို ဖန်တီးပေးတဲ့ query plan ကို [`EXPLAIN`](https://www.postgresql.org/docs/current/sql-explain.html) command နဲ့ ကြည့်လို့ရပါတယ်။ Plan ဖတ်တာက ကျွမ်းကျင်မှု ရဖို့ အတွေ့အကြုံ တစ်ချို့ လိုအပ်တဲ့ အတတ်ပညာတစ်ခုပါ — ဒါပေမယ့် ဒီ section မှာတော့ အခြေခံတွေကို ဖော်ပြဖို့ ကြိုးစားထားပါတယ်။

ဒီ section ထဲက ဥပမာတွေကို — v18 development source တွေကို သုံးပြီး `VACUUM ANALYZE` လုပ်ပြီးတဲ့ regression test database ကနေ ယူထားပါတယ်။ ဥပမာတွေကို ကိုယ်တိုင် စမ်းကြည့်မယ်ဆိုရင်လည်း အလားတူ ရလဒ်မျိုး ရနိုင်ပေမယ့် — `ANALYZE` ရဲ့ statistics တွေက တိကျတဲ့ တန်ဖိုးတွေ မဟုတ်ဘဲ random sample တွေ ဖြစ်ပြီး — cost တွေက သဘာဝအရ platform ပေါ်မှာ တစ်စိတ်တစ်ပိုင်း မူတည်နေတာကြောင့် — estimated cost နဲ့ row count တွေက နည်းနည်း ကွဲပြားနိုင်ပါတယ်။

ဥပမာတွေမှာ `EXPLAIN` ရဲ့ default ဖြစ်တဲ့ “text” output format ကို သုံးထားပါတယ် — ဒါက ကျစ်လျစ်ပြီး လူတွေ ဖတ်ဖို့ အဆင်ပြေပါတယ်။ `EXPLAIN` ရဲ့ output ကို နောက်ထပ် analysis အတွက် program တစ်ခုထဲ ထည့်သွင်းချင်ရင်တော့ — machine-readable output format တွေထဲက တစ်ခု (XML, JSON, ဒါမှမဟုတ် YAML) ကို အသုံးပြုသင့်ပါတယ်။

### 14.1.1. EXPLAIN Basics (EXPLAIN အခြေခံ)

Query plan ရဲ့ ဖွဲ့စည်းပုံက *plan node* တွေရဲ့ tree (သစ်ပင်ပုံစံ အဆင့်ဆင့်) တစ်ခု ဖြစ်ပါတယ်။ Tree ရဲ့ အောက်ဆုံး အဆင့်က node တွေက scan node တွေ ဖြစ်ပြီး — table ကနေ မူရင်း row တွေကို ပြန်ပေးပါတယ်။ Table access method အမျိုးမျိုးအတွက် scan node အမျိုးအစား အမျိုးမျိုး ရှိပါတယ်: sequential scan, index scan နဲ့ bitmap index scan တို့ ဖြစ်ပါတယ်။ Table မဟုတ်တဲ့ row source တွေလည်း ရှိပါသေးတယ် — ဥပမာ `FROM` ထဲက `VALUES` clause တွေနဲ့ set-returning function တွေပါ — သူတို့မှာ ကိုယ်ပိုင် scan node type တွေ ရှိပါတယ်။ Query က joining, aggregation, sorting ဒါမှမဟုတ် မူရင်း row တွေပေါ်က တခြား operation တွေ လိုအပ်ရင် — အဲဒီ operation တွေကို လုပ်ဆောင်ဖို့ scan node တွေရဲ့ အပေါ်မှာ node တွေ ထပ်ထည့်ပါလိမ့်မယ်။ ဒီ operation တွေကို လုပ်ဆောင်ဖို့ နည်းလမ်း တစ်ခုထက်ပို ရှိတတ်တာမို့ — ဒီနေရာမှာလည်း node type အမျိုးမျိုး ပေါ်လာနိုင်ပါတယ်။ `EXPLAIN` ရဲ့ output မှာ plan tree ထဲက node တစ်ခုစီအတွက် စာကြောင်း တစ်ကြောင်းစီ ပါဝင်ပြီး — အခြေခံ node type နဲ့အတူ planner က အဲဒီ plan node ရဲ့ execution အတွက် ပြုလုပ်ထားတဲ့ cost estimate တွေကို ပြသပါတယ်။ Node ရဲ့ summary line ကနေ indent (ဘယ်ဘက်ကို ရှုံ့ထား) လုပ်ထားတဲ့ နောက်ထပ် စာကြောင်းတွေ ပေါ်လာနိုင်ပြီး — node ရဲ့ နောက်ထပ် ဂုဏ်သတ္တိတွေကို ပြသပါတယ်။ ပထမဆုံး စာကြောင်း (အပေါ်ဆုံး node ရဲ့ summary line) မှာ plan အတွက် estimated total execution cost ပါဝင်ပါတယ် — planner က လျှော့ချဖို့ ကြိုးစားတာက ဒီကိန်းဂဏန်းပဲ ဖြစ်ပါတယ်။

Output က ဘယ်လိုပုံ ရှိလဲဆိုတာ ပြဖို့ ရိုးရှင်းတဲ့ ဥပမာ တစ်ခု ကြည့်ကြရအောင်:

```sql
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)
```

ဒီ query မှာ `WHERE` clause မရှိတဲ့အတွက် — table ထဲက row အားလုံးကို scan လုပ်ရမှာ ဖြစ်လို့ — planner က ရိုးရှင်းတဲ့ sequential scan plan ကို ရွေးချယ်ထားပါတယ်။ Parentheses ထဲမှာ ဖော်ပြထားတဲ့ ကိန်းဂဏန်းတွေက (ဘယ်ကနေ ညာကို):

- Estimated start-up cost (စတင်လည်ပတ်မှု ခန့်မှန်း cost)။ ဒါက output phase မစတင်ခင် ကုန်ဆုံးတဲ့ အချိန်ဖြစ်ပြီး — ဥပမာ — sort node တစ်ခုထဲမှာ sorting လုပ်ဖို့ လိုအပ်တဲ့ အချိန်မျိုးပါ။
- Estimated total cost (စုစုပေါင်း ခန့်မှန်း cost)။ ဒါက plan node ကို အဆုံးထိ run လိုက်မယ် — ဆိုလိုတာက — ရနိုင်တဲ့ row အားလုံးကို ယူလိုက်မယ်လို့ ယူဆပြီး ဖော်ပြတာပါ။ လက်တွေ့မှာတော့ node တစ်ခုရဲ့ parent node က row အားလုံး မဖတ်ဘဲ ရပ်တန့်သွားနိုင်ပါတယ် (အောက်က LIMIT ဥပမာကို ကြည့်ပါ)။
- Estimated number of rows output by this plan node (ဒီ plan node က ထုတ်ပေးမယ့် row အရေအတွက် ခန့်မှန်းချက်)။ ဒီမှာလည်း node ကို အဆုံးထိ run မယ်လို့ ယူဆထားပါတယ်။
- Estimated average width of rows output by this plan node (ဒီ plan node က ထုတ်ပေးတဲ့ row တွေရဲ့ ပျမ်းမျှ width — bytes နဲ့)။

Cost တွေကို planner ရဲ့ cost parameter တွေနဲ့ သတ်မှတ်တဲ့ arbitrary unit (စံသတ်မှတ်ထားခြင်း မရှိတဲ့ ယူနစ်) တွေနဲ့ တိုင်းတာပါတယ် ([အပိုင်း 19.7.2](https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS))။ အစဉ်အလာအားဖြင့် cost တွေကို disk page fetch ယူနစ်နဲ့ တိုင်းတာပါတယ် — ဆိုလိုတာက — [seq_page_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-SEQ-PAGE-COST) ကို သမားရိုးကျ `1.0` လို့ သတ်မှတ်ပြီး — ကျန် cost parameter တွေကို အဲဒါနဲ့ ယှဉ်ပြီး သတ်မှတ်ပါတယ်။ ဒီ section ထဲက ဥပမာတွေကို default cost parameter တွေနဲ့ပဲ run ထားပါတယ်။

အပေါ်အဆင့် node တစ်ခုရဲ့ cost ထဲမှာ သူ့ရဲ့ child node တွေ အားလုံးရဲ့ cost တွေ ပါဝင်တယ်ဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်။ နောက်ထပ် သိထားသင့်တာက — cost က planner အတွက် အရေးပါတဲ့ အရာတွေကိုပဲ ထင်ဟပ်ပါတယ်။ အထူးသဖြင့် — output value တွေကို text ပုံစံအဖြစ် ပြောင်းဖို့ ဒါမှမဟုတ် client ဆီ ပို့ဖို့ ကုန်တဲ့ အချိန်ကို cost ထဲမှာ ထည့်မတွက်ပါဘူး — ဒါတွေက တကယ့် elapsed time မှာ အရေးပါတဲ့ အချက်တွေ ဖြစ်နိုင်ပေမယ့် — planner က ဒီ cost တွေကို ဂရုမစိုက်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ — plan ကို ပြောင်းလဲခြင်းအားဖြင့် သူတို့ကို ပြောင်းလဲလို့ မရလို့ပါ။ (မှန်ကန်တဲ့ plan တိုင်းက row set တစ်ခုတည်းကိုပဲ ထုတ်ပေးမယ်လို့ ယုံကြည်ရပါတယ်။)

`rows` value က နည်းနည်း ရှုပ်ထွေးပါတယ် — ဘာကြောင့်လဲဆိုတော့ — ဒါက plan node က process လုပ်တဲ့ ဒါမှမဟုတ် scan လုပ်တဲ့ row အရေအတွက် မဟုတ်ဘဲ — node က ထုတ်လွှတ်လိုက်တဲ့ (emitted) row အရေအတွက် ဖြစ်လို့ပါ။ Node မှာ သက်ရောက်နေတဲ့ `WHERE`-clause condition တွေကြောင့် filtering လုပ်တာရဲ့ ရလဒ်အဖြစ် — ဒါက scan လုပ်တဲ့ အရေအတွက်ထက် မကြာခဏ နည်းနေတတ်ပါတယ်။ အကောင်းဆုံးကတော့ — အပေါ်ဆုံးအဆင့်က rows estimate က query က တကယ် ပြန်ပေးတဲ့၊ update လုပ်တဲ့ ဒါမှမဟုတ် delete လုပ်တဲ့ row အရေအတွက်နဲ့ အနီးစပ်ဆုံး ကိုက်ညီနေမှာ ဖြစ်ပါတယ်။

ဥပမာဆီ ပြန်သွားကြည့်ရအောင်:

```sql
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)
```

ဒီ ကိန်းဂဏန်းတွေက အရမ်း ရှင်းရှင်းလင်းလင်း ဆင်းသက်လာတာပါ။ ဒီလို လုပ်ကြည့်ရင်:

```sql
SELECT relpages, reltuples FROM pg_class WHERE relname = 'tenk1';
```

`tenk1` မှာ disk page 345 ခုနဲ့ row 10000 ခု ရှိတာကို တွေ့ရပါလိမ့်မယ်။ Estimated cost ကို (ဖတ်လိုက်တဲ့ disk pages * [seq_page_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-SEQ-PAGE-COST)) + (scan လုပ်တဲ့ rows * [cpu_tuple_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CPU-TUPLE-COST)) လို့ တွက်ချက်ပါတယ်။ Default အနေနဲ့ `seq_page_cost` က 1.0 ဖြစ်ပြီး `cpu_tuple_cost` က 0.01 ဖြစ်လို့ — estimated cost က (345 * 1.0) + (10000 * 0.01) = 445 ဖြစ်ပါတယ်။

အခု `WHERE` condition တစ်ခု ထပ်ထည့်ဖို့ query ကို ပြုပြင်ကြည့်ရအောင်:

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 7000;

                         QUERY PLAN
------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..470.00 rows=7000 width=244)
   Filter: (unique1 < 7000)
```

`EXPLAIN` output မှာ `WHERE` clause ကို Seq Scan plan node မှာ ကပ်ထားတဲ့ “filter” condition အနေနဲ့ သက်ရောက်နေတာကို သတိပြုပါ။ ဆိုလိုတာက — plan node က scan လုပ်တဲ့ row တစ်ခုချင်းစီမှာ condition ကို စစ်ပြီး — condition ကို ကျော်လွန်တဲ့ row တွေကိုပဲ ထုတ်ပေးပါတယ်။ `WHERE` clause ကြောင့် output row တွေရဲ့ estimate က လျှော့ချခံရပါတယ်။ ဒါပေမယ့် — scan က row 10000 ခုလုံးကို လည်ပတ်ရဦးမှာ ဖြစ်လို့ — cost က မကျပါဘူး; တကယ်တော့ — `WHERE` condition ကို စစ်ဆေးဖို့ ကုန်တဲ့ အပို CPU အချိန်ကို ထင်ဟပ်ဖို့ — cost က နည်းနည်း တက်သွားပါတယ် (အတိအကျ ဆိုရင် 10000 * [cpu_operator_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CPU-OPERATOR-COST) လောက်)။

ဒီ query က တကယ် ရွေးထုတ်မယ့် row အရေအတွက်က 7000 ဖြစ်ပေမယ့် — `rows` estimate က အနီးစပ်ဆုံး ခန့်မှန်းချက်ပဲ ဖြစ်ပါတယ်။ ဒီ စမ်းသပ်ချက်ကို ကိုယ်တိုင် ထပ်လုပ်ကြည့်မယ်ဆိုရင် — နည်းနည်း ကွဲပြားတဲ့ estimate မျိုး ရနိုင်ပါတယ်; ဒါ့အပြင် — `ANALYZE` command တစ်ခုစီ ပြီးတိုင်း အဲဒါ ပြောင်းလဲနိုင်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ — `ANALYZE` က ထုတ်လုပ်တဲ့ statistics တွေက table ရဲ့ randomized sample ကနေ ယူလို့ပါ။

အခု condition ကို ပိုပြီး တင်းကျပ်အောင် လုပ်ကြည့်ရအောင်:

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100;

                                  QUERY PLAN
-------------------------------------------------------------------​-----------
 Bitmap Heap Scan on tenk1  (cost=5.06..224.98 rows=100 width=244)
   Recheck Cond: (unique1 < 100)
   ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0)
         Index Cond: (unique1 < 100)
```

ဒီမှာ planner က အဆင့်နှစ်ဆင့် (two-step) plan တစ်ခုကို သုံးဖို့ ဆုံးဖြတ်ထားပါတယ်: child plan node က index condition နဲ့ ကိုက်ညီတဲ့ row တွေရဲ့ တည်နေရာတွေကို ရှာဖို့ index ကို လည်ပတ်ပြီး — အပေါ်က plan node က အဲဒီ row တွေကို table ကနေ တကယ် ဆွဲယူပါတယ်။ Row တွေကို သီးခြားစီ ဆွဲယူတာက အစဉ်လိုက် ဖတ်တာထက် အများကြီး ပိုစျေးကြီးပေမယ့် — table ရဲ့ page တွေ အားလုံးကို လည်ပတ်စရာ မလိုတဲ့အတွက် — sequential scan ထက်တော့ ပိုသက်သာပါသေးတယ်။ (Plan အဆင့် နှစ်ခု သုံးရတဲ့ အကြောင်းရင်းက — အပေါ်က plan node က index က ဖော်ထုတ်လိုက်တဲ့ row တည်နေရာတွေကို မဖတ်ခင် physical order နဲ့ sort လုပ်ပြီးမှ ဖတ်လို့ — သီးခြား fetch တွေရဲ့ cost ကို အနည်းဆုံးဖြစ်အောင် လုပ်တာပါ။ Node နာမည်တွေထဲမှာ ဖော်ပြထားတဲ့ “bitmap” က ဒီ sort လုပ်ပေးတဲ့ ယန္တရားပဲ ဖြစ်ပါတယ်။)

အခု `WHERE` clause ထဲကို condition တစ်ခု ထပ်ထည့်ကြည့်ရအောင်:

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND stringu1 = 'xxx';

                                  QUERY PLAN
-------------------------------------------------------------------​-----------
 Bitmap Heap Scan on tenk1  (cost=5.04..225.20 rows=1 width=244)
   Recheck Cond: (unique1 < 100)
   Filter: (stringu1 = 'xxx'::name)
   ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0)
         Index Cond: (unique1 < 100)
```

ထပ်ထည့်လိုက်တဲ့ `stringu1 = 'xxx'` condition က output row count estimate ကို လျှော့ချပေးပေမယ့် — cost ကိုတော့ မလျှော့ပါဘူး — ဘာကြောင့်လဲဆိုတော့ — row set တစ်ခုတည်းကိုပဲ လည်ပတ်ရဦးမှာ ဖြစ်လို့ပါ။ အကြောင်းကတော့ — ဒီ index က `unique1` column ပေါ်မှာပဲ ရှိတာမို့ — `stringu1` clause ကို index condition အနေနဲ့ သုံးလို့ မရလို့ပါ။ အဲဒီအစား — index ကို သုံးပြီး ယူလိုက်တဲ့ row တွေပေါ်မှာ filter အနေနဲ့ သက်ရောက်ပါတယ်။ ဒါကြောင့် — ဒီအပို စစ်ဆေးမှုကို ထင်ဟပ်ဖို့ cost က တကယ်တော့ နည်းနည်း တက်သွားပါတယ်။

တချို့ အခြေအနေတွေမှာ planner က “simple” index scan plan ကို ပိုနှစ်သက်ပါလိမ့်မယ်:

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 = 42;

                                 QUERY PLAN
-------------------------------------------------------------------​----------
 Index Scan using tenk1_unique1 on tenk1  (cost=0.29..8.30 rows=1 width=244)
   Index Cond: (unique1 = 42)
```

ဒီ plan အမျိုးအစားမှာ table row တွေကို index order နဲ့ ဆွဲယူပါတယ် — အဲဒါက ဖတ်ရတာ ပိုစျေးကြီးစေပေမယ့် — row အရေအတွက်က သိပ်နည်းတဲ့အတွက် — row တည်နေရာတွေကို sort လုပ်တဲ့ အပို cost က မတန်ပါဘူး။ ဒီ plan အမျိုးအစားကို row တစ်ခုတည်း ဆွဲယူတဲ့ query တွေမှာ အများဆုံး တွေ့ရပါလိမ့်မယ်။ Index order နဲ့ ကိုက်ညီတဲ့ `ORDER BY` condition ပါတဲ့ query တွေမှာလည်း မကြာခဏ သုံးပါတယ် — ဘာကြောင့်လဲဆိုတော့ — အဲဒီအခါ `ORDER BY` ကို ဖြည့်ဆည်းဖို့ sort လုပ်တဲ့ အဆင့် ထပ်မလိုတော့လို့ပါ။ ဒီ ဥပမာမှာ — `ORDER BY unique1` ကို ထပ်ထည့်ရင်လည်း — index က တောင်းဆိုထားတဲ့ ordering ကို သွယ်ဝိုက်၍ (implicitly) ထောက်ပံ့ပြီးသား ဖြစ်လို့ — plan တစ်ခုတည်းကိုပဲ သုံးမှာ ဖြစ်ပါတယ်။

Planner က `ORDER BY` clause ကို နည်းလမ်း အမျိုးမျိုးနဲ့ implement လုပ်နိုင်ပါတယ်။ အပေါ်က ဥပမာက ဒီလို ordering clause မျိုးကို သွယ်ဝိုက်၍ implement လုပ်နိုင်တာကို ပြပါတယ်။ Planner က ရှင်းလင်းတဲ့ (explicit) `Sort` step တစ်ခုကိုလည်း ထပ်ထည့်နိုင်ပါတယ်:

```sql
EXPLAIN SELECT * FROM tenk1 ORDER BY unique1;

                            QUERY PLAN
-------------------------------------------------------------------
 Sort  (cost=1109.39..1134.39 rows=10000 width=244)
   Sort Key: unique1
   ->  Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)
```

Plan ရဲ့ အစိတ်အပိုင်းတစ်ခုက လိုအပ်တဲ့ sort key တွေရဲ့ prefix (ရှေ့ဆုံး အစိတ်အပိုင်း) တစ်ခုအပေါ်မှာ ordering တစ်ခုကို အာမခံပေးနိုင်ရင် — planner က `Incremental Sort` step တစ်ခုကို သုံးဖို့ ဆုံးဖြတ်နိုင်ပါတယ်:

```sql
EXPLAIN SELECT * FROM tenk1 ORDER BY hundred, ten LIMIT 100;

                                              QUERY PLAN
-------------------------------------------------------------------​-----------------------------
 Limit  (cost=19.35..39.49 rows=100 width=244)
   ->  Incremental Sort  (cost=19.35..2033.39 rows=10000 width=244)
         Sort Key: hundred, ten
         Presorted Key: hundred
         ->  Index Scan using tenk1_hundred on tenk1  (cost=0.29..1574.20 rows=10000 width=244)
```

ပုံမှန် sort တွေနဲ့ ယှဉ်ရင် — incrementally sort လုပ်တာက — result set တစ်ခုလုံး sort ပြီးမြောက်ခင် tuple တွေကို ပြန်ပေးနိုင်စေပြီး — အထူးသဖြင့် `LIMIT` query တွေမှာ optimization တွေ လုပ်နိုင်စေပါတယ်။ Memory အသုံးပြုမှုနဲ့ sort တွေ disk ပေါ် လျှံကျ (spill) ဖြစ်နိုင်ခြေကိုလည်း လျှော့ချပေးနိုင်ပေမယ့် — result set ကို sorting batch အများအပြားအဖြစ် ခွဲထားရတဲ့ overhead တိုးလာတဲ့ cost တော့ ရှိပါတယ်။

`WHERE` ထဲမှာ ရည်ညွှန်းထားတဲ့ column တော်တော်များများပေါ်မှာ သီးခြား index တွေ ရှိနေရင် — planner က index တွေရဲ့ AND ဒါမှမဟုတ် OR ပေါင်းစပ်မှုကို ရွေးချယ်နိုင်ပါတယ်:

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000;

                                     QUERY PLAN
-------------------------------------------------------------------​------------------
 Bitmap Heap Scan on tenk1  (cost=25.07..60.11 rows=10 width=244)
   Recheck Cond: ((unique1 < 100) AND (unique2 > 9000))
   ->  BitmapAnd  (cost=25.07..25.07 rows=10 width=0)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0)
               Index Cond: (unique1 < 100)
         ->  Bitmap Index Scan on tenk1_unique2  (cost=0.00..19.78 rows=999 width=0)
               Index Cond: (unique2 > 9000)
```

ဒါပေမယ့် — ဒါက index နှစ်ခုလုံးကို လည်ပတ်ဖို့ လိုတဲ့အတွက် — index တစ်ခုတည်းကို သုံးပြီး ကျန် condition ကို filter အနေနဲ့ သဘောထားတာထက် အမြဲတမ်း သာချင်မှ သာပါလိမ့်မယ်။ ပါဝင်တဲ့ range တွေကို ပြောင်းကြည့်ရင် plan ကလည်း အလိုက်သင့် ပြောင်းသွားတာ တွေ့ရပါလိမ့်မယ်။

`LIMIT` ရဲ့ အကျိုးသက်ရောက်မှုကို ပြတဲ့ ဥပမာ တစ်ခု ဒီမှာ ကြည့်ရအောင်:

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2;

                                     QUERY PLAN
-------------------------------------------------------------------​------------------
 Limit  (cost=0.29..14.28 rows=2 width=244)
   ->  Index Scan using tenk1_unique2 on tenk1  (cost=0.29..70.27 rows=10 width=244)
         Index Cond: (unique2 > 9000)
         Filter: (unique1 < 100)
```

ဒါက အပေါ်က query နဲ့ အတူတူပါပဲ — ဒါပေမယ့် — row တွေ အားလုံး ယူစရာ မလိုအောင် `LIMIT` ထည့်လိုက်တာကြောင့် — planner က ဘာလုပ်ရမလဲဆိုတာနဲ့ ပတ်သက်ပြီး စိတ်ပြောင်းသွားပါတယ်။ Index Scan node ရဲ့ total cost နဲ့ row count ကို အဆုံးထိ run မယ့်ပုံစံနဲ့ ပြထားတာ သတိပြုပါ။ ဒါပေမယ့် — Limit node က အဲဒီ row တွေရဲ့ ငါးပုံတစ်ပုံကို ယူပြီးတာနဲ့ ရပ်တန့်ဖို့ မျှော်လင့်ရတဲ့အတွက် — သူ့ရဲ့ total cost က ငါးပုံတစ်ပုံလောက်ပဲ ရှိပြီး — အဲဒါက query ရဲ့ တကယ့် estimated cost ဖြစ်ပါတယ်။ ဒီ plan က အရင် plan ထဲကို Limit node ထည့်တာထက် ပိုနှစ်သက်စရာ ကောင်းပါတယ် — ဘာကြောင့်လဲဆိုတော့ — Limit က bitmap scan ရဲ့ startup cost ကို ရှောင်လွှဲလို့ မရတဲ့အတွက် — အဲဒီနည်းနဲ့ဆို total cost က 25 unit ကျော်လောက် ရှိမှာ ဖြစ်လို့ပါ။

ဆွေးနွေးခဲ့တဲ့ column တွေကို သုံးပြီး table နှစ်ခု join လုပ်ကြည့်ရအောင်:

```sql
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2;

                                      QUERY PLAN
-------------------------------------------------------------------​-------------------
 Nested Loop  (cost=4.65..118.50 rows=10 width=488)
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.38 rows=10 width=244)
         Recheck Cond: (unique1 < 10)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0)
               Index Cond: (unique1 < 10)
   ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..7.90 rows=1 width=244)
         Index Cond: (unique2 = t1.unique2)
```

ဒီ plan မှာ — input (သို့မဟုတ် children) အနေနဲ့ table scan နှစ်ခု ပါတဲ့ nested-loop join node တစ်ခု ရှိပါတယ်။ Node summary line တွေရဲ့ indentation က plan tree ရဲ့ ဖွဲ့စည်းပုံကို ထင်ဟပ်ပါတယ်။ Join ရဲ့ ပထမ ဒါမှမဟုတ် “outer” child က အရင်က မြင်ခဲ့တဲ့ bitmap scan တွေနဲ့ ဆင်တူတဲ့ bitmap scan တစ်ခုပါ။ သူ့ရဲ့ cost နဲ့ row count က `SELECT ... WHERE unique1 < 10` ကနေ ရမယ့်ပုံစံအတိုင်းပဲ — ဘာကြောင့်လဲဆိုတော့ — `WHERE` clause ဖြစ်တဲ့ `unique1 < 10` ကို အဲဒီ node မှာ သက်ရောက်နေလို့ပါ။ `t1.unique2 = t2.unique2` clause က ဒီအချိန်မှာ မသက်ဆိုင်သေးတဲ့အတွက် — outer scan ရဲ့ row count ကို မထိခိုက်ပါဘူး။ Nested-loop join node က သူ့ရဲ့ ဒုတိယ ဒါမှမဟုတ် “inner” child ကို — outer child ကနေ ရတဲ့ row တစ်ခုစီအတွက် တစ်ကြိမ်စီ run ပါလိမ့်မယ်။ လက်ရှိ outer row ရဲ့ column value တွေကို inner scan ထဲကို ထည့်သွင်းလို့ရပါတယ်; ဒီမှာ — outer row ကန့် `t1.unique2` value က ရနေတဲ့အတွက် — အပေါ်မှာ မြင်ခဲ့တဲ့ ရိုးရှင်းတဲ့ `SELECT ... WHERE t2.unique2 = constant` အခြေအနေနဲ့ ဆင်တဲ့ plan နဲ့ cost တစ်ခု ရပါတယ်။ (တကယ့် estimated cost က `t2` ပေါ်မှာ index scan တွေ ထပ်ခါထပ်ခါ လုပ်နေစဉ် ဖြစ်လာဖို့ မျှော်လင့်ရတဲ့ caching ရဲ့ ရလဒ်ကြောင့် အပေါ်မှာ မြင်ခဲ့တာထက် နည်းနည်း နိမ့်ပါတယ်။) Loop node ရဲ့ cost တွေကို — outer scan ရဲ့ cost၊ ပြီးတော့ outer row တစ်ခုစီအတွက် inner scan တစ်ကြိမ်စီ (ဒီမှာ 10 * 7.90) နဲ့ join process လုပ်ဖို့ CPU အချိန် နည်းနည်းတို့ကို အခြေခံပြီး သတ်မှတ်ပါတယ်။

ဒီ ဥပမာမှာ join ရဲ့ output row count က scan နှစ်ခုရဲ့ row count တွေ မြှောက်လဒ်နဲ့ အတူတူပဲ ဖြစ်ပေမယ့် — အဲဒါက အမြဲတမ်းတော့ မမှန်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ — table နှစ်ခုလုံးကို ရည်ညွှန်းပြီး input scan တစ်ခုခုမှာ မဟုတ်ဘဲ join point မှာပဲ သက်ရောက်လို့ရတဲ့ `WHERE` clause တွေ ထပ်ရှိနိုင်လို့ပါ။ ဥပမာ:

```sql
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t2.unique2 < 10 AND t1.hundred < t2.hundred;

                                         QUERY PLAN
-------------------------------------------------------------------​--------------------------
 Nested Loop  (cost=4.65..49.36 rows=33 width=488)
   Join Filter: (t1.hundred < t2.hundred)
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.38 rows=10 width=244)
         Recheck Cond: (unique1 < 10)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0)
               Index Cond: (unique1 < 10)
   ->  Materialize  (cost=0.29..8.51 rows=10 width=244)
         ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..8.46 rows=10 width=244)
               Index Cond: (unique2 < 10)
```

`t1.hundred < t2.hundred` condition ကို `tenk2_unique2` index ထဲမှာ စစ်လို့ မရတဲ့အတွက် — join node မှာ သက်ရောက်ပါတယ်။ ဒါက join node ရဲ့ estimated output row count ကို လျှော့ချပေးပေမယ့် — input scan တစ်ခုခုကိုတော့ မပြောင်းလဲပါဘူး။

ဒီမှာ planner က join ရဲ့ inner relation ကို “materialize” လုပ်ဖို့ ရွေးချယ်ထားတာ သတိပြုပါ — သူ့အပေါ်မှာ Materialize plan node တစ်ခု တင်ထားခြင်းအားဖြင့်ပါ။ ဆိုလိုတာက — nested-loop join node က အဲဒီ data ကို outer relation ကန့် row တစ်ခုစီအတွက် တစ်ကြိမ်နှုန်း ဆယ်ကြိမ် ဖတ်ဖို့ လိုအပ်ပေမယ့် — `t2` index scan ကိုတော့ တစ်ခါပဲ လုပ်ရတော့မယ်လို့ ဆိုလိုပါတယ်။ Materialize node က ဖတ်လိုက်တဲ့ data ကို memory ထဲမှာ သိမ်းပြီး — နောက် pass တစ်ခုစီမှာ data ကို memory ကနေ ပြန်ပေးပါတယ်။

Outer join တွေကို ကိုင်တွယ်တဲ့အခါ — “Join Filter” ရော သာမန် “Filter” condition ရော နှစ်မျိုးလုံး ကပ်ထားတဲ့ join plan node တွေကို မြင်ရနိုင်ပါတယ်။ Join Filter condition တွေက outer join ရဲ့ `ON` clause ကနေ လာတာ ဖြစ်လို့ — Join Filter condition ကို ကျော်လွန်ဖို့ ပျက်ကွက်တဲ့ row တစ်ခုက null-extended row အနေနဲ့ ထုတ်လွှတ်ခံရဆဲ ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် — သာမန် Filter condition ကို outer-join စည်းမျဉ်းတွေ ပြီးမှ သက်ရောက်တာမို့ — row တွေကို ခြွင်းချက်မရှိ ဖယ်ရှားဖို့ လုပ်ဆောင်ပါတယ်။ Inner join တစ်ခုမှာတော့ — ဒီ filter အမျိုးအစား နှစ်ခုကြားမှာ semantic ကွာခြားချက် မရှိပါဘူး။

Query ရဲ့ selectivity ကို နည်းနည်း ပြောင်းကြည့်ရင် — လုံးဝ ကွဲပြားတဲ့ join plan တစ်ခု ရနိုင်ပါတယ်:

```sql
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
-------------------------------------------------------------------​-----------------------
 Hash Join  (cost=226.23..709.73 rows=100 width=488)
   Hash Cond: (t2.unique2 = t1.unique2)
   ->  Seq Scan on tenk2 t2  (cost=0.00..445.00 rows=10000 width=244)
   ->  Hash  (cost=224.98..224.98 rows=100 width=244)
         ->  Bitmap Heap Scan on tenk1 t1  (cost=5.06..224.98 rows=100 width=244)
               Recheck Cond: (unique1 < 100)
               ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0)
                     Index Cond: (unique1 < 100)
```

ဒီမှာ planner က hash join ကို သုံးဖို့ ရွေးချယ်ထားပါတယ် — အဲဒီမှာ table တစ်ခုရဲ့ row တွေကို in-memory hash table ထဲ ထည့်ပြီး — နောက်မှ ကျန် table ကို scan လုပ်ကာ — row တစ်ခုစီအတွက် ကိုက်ညီမှု ရှိမရှိ hash table ထဲမှာ ရှာဖွေပါတယ်။ Indentation က plan ဖွဲ့စည်းပုံကို ဘယ်လို ထင်ဟပ်လဲဆိုတာ ထပ်မှတ်သားပါ: `tenk1` ပေါ်က bitmap scan က Hash node ရဲ့ input ဖြစ်ပြီး — အဲဒီ node က hash table ကို တည်ဆောက်ပါတယ်။ အဲဒါကို Hash Join node ဆီ ပြန်ပေးလိုက်ပြီး — node က သူ့ရဲ့ outer child plan ကနေ row တွေ ဖတ်ပြီး — row တစ်ခုစီအတွက် hash table ထဲမှာ ရှာဖွေပါတယ်။

နောက်ထပ် ဖြစ်နိုင်တဲ့ join အမျိုးအစားတစ်ခုက merge join ပါ — ဒီမှာ ဥပမာ ပြထားပါတယ်:

```sql
EXPLAIN SELECT *
FROM tenk1 t1, onek t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
-------------------------------------------------------------------​-----------------------
 Merge Join  (cost=0.56..233.49 rows=10 width=488)
   Merge Cond: (t1.unique2 = t2.unique2)
   ->  Index Scan using tenk1_unique2 on tenk1 t1  (cost=0.29..643.28 rows=100 width=244)
         Filter: (unique1 < 100)
   ->  Index Scan using onek_unique2 on onek t2  (cost=0.28..166.28 rows=1000 width=244)
```

Merge join က သူ့ရဲ့ input data တွေကို join key တွေအလိုက် sort လုပ်ပြီးသား ဖြစ်ဖို့ လိုအပ်ပါတယ်။ ဒီ ဥပမာမှာ input တစ်ခုစီကို — row တွေကို မှန်ကန်တဲ့ order နဲ့ လည်ပတ်ဖို့ index scan ကို သုံးပြီး sort လုပ်ထားပါတယ်; ဒါပေမယ့် — sequential scan နဲ့ sort ကိုလည်း သုံးလို့ရပါတယ်။ (Row အများအပြားကို sort လုပ်တဲ့အခါ — sequential-scan-and-sort က index scan ကို မကြာခဏ အနိုင်ရပါတယ် — ဘာကြောင့်လဲဆိုတော့ — index scan က sequential မဟုတ်တဲ့ disk access တွေ လိုအပ်လို့ပါ။)

Plan အမျိုးမျိုးကို လေ့လာဖို့ နည်းလမ်းတစ်ခုက — [အပိုင်း 19.7.1](https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE) မှာ ဖော်ပြထားတဲ့ enable/disable flag တွေကို သုံးပြီး — planner က အသက်သာဆုံးလို့ ထင်ထားတဲ့ strategy ဘယ်ဟာကိုမဆို ဂရုမစိုက်ဖို့ အတင်းလုပ်တာပါ။ (ဒါက ကြမ်းတမ်းတဲ့ tool တစ်ခုပါ — ဒါပေမယ့် အသုံးဝင်ပါတယ်။ [အပိုင်း 14.3](/docs/postgresql/explicit-joins) ကိုလည်း ကြည့်ပါ။) ဥပမာ — အရင် ဥပမာအတွက် merge join က အကောင်းဆုံး join type ဖြစ်တယ်ဆိုတာကို မယုံကြည်ဘူးဆိုရင် — ဒီလို စမ်းကြည့်လို့ရပါတယ်:

```sql
SET enable_mergejoin = off;

EXPLAIN SELECT *
FROM tenk1 t1, onek t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
-------------------------------------------------------------------​-----------------------
 Hash Join  (cost=226.23..344.08 rows=10 width=488)
   Hash Cond: (t2.unique2 = t1.unique2)
   ->  Seq Scan on onek t2  (cost=0.00..114.00 rows=1000 width=244)
   ->  Hash  (cost=224.98..224.98 rows=100 width=244)
         ->  Bitmap Heap Scan on tenk1 t1  (cost=5.06..224.98 rows=100 width=244)
               Recheck Cond: (unique1 < 100)
               ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0)
                     Index Cond: (unique1 < 100)
```

ဒါက — ဒီအခြေအနေအတွက် planner က hash join က merge join ထက် 50% နီးပါး ပိုစျေးကြီးမယ်လို့ ထင်နေတာကို ပြပါတယ်။ ဟုတ်ပါတယ် — နောက် မေးခွန်းက သူ့ရဲ့ ထင်မြင်ချက် မှန်သလားဆိုတာပါ။ ဒါကို အောက်မှာ ဆွေးနွေးထားတဲ့အတိုင်း `EXPLAIN ANALYZE` ကို သုံးပြီး စုံစမ်းနိုင်ပါတယ်။

Enable/disable flag တွေကို သုံးပြီး plan node type တွေကို disable လုပ်တဲ့အခါ — flag အများစုက သက်ဆိုင်ရာ plan node ကို သုံးတာကို အားပေးမှု လျှော့ချပေးရုံပဲ ဖြစ်ပြီး — planner ရဲ့ အဲဒီ plan node type ကို သုံးနိုင်စွမ်းကို လုံးဝ တားမြစ်တာ မဟုတ်ပါဘူး။ ဒါက ရည်ရွယ်ချက်ရှိရှိ ဒီဇိုင်းလုပ်ထားတာပါ — planner က ပေးထားတဲ့ query တစ်ခုအတွက် plan တစ်ခု ဖွဲ့နိုင်စွမ်း ထိန်းသိမ်းထားနိုင်ဖို့ ဖြစ်ပါတယ်။ ရလာတဲ့ plan ထဲမှာ disabled node တစ်ခု ပါနေရင် — `EXPLAIN` output က အဲဒီအချက်ကို ညွှန်ပြပါလိမ့်မယ်။

```sql
SET enable_seqscan = off;
EXPLAIN SELECT * FROM unit;

                       QUERY PLAN
---------------------------------------------------------
 Seq Scan on unit  (cost=0.00..21.30 rows=1130 width=44)
   Disabled: true
```

`unit` table မှာ index မရှိတာကြောင့် — table data ကို ဖတ်ဖို့ တခြား နည်းလမ်း မရှိဘဲ — query planner အတွက် ရနိုင်တဲ့ တစ်ခုတည်းသော option က sequential scan ပဲ ဖြစ်ပါတယ်။

တချို့ query plan တွေမှာ *subplan* တွေ ပါဝင်ပါတယ် — ဒါတွေက မူရင်း query ထဲက sub-`SELECT` တွေကနေ ပေါ်ပေါက်လာတာပါ။ ဒီလို query တွေကို တခါတရံ သာမန် join plan တွေအဖြစ် ပြောင်းလဲလို့ရပေမယ့် — မရတဲ့အခါမှာတော့ — ဒီလို plan တွေ ရပါတယ်:

```sql
EXPLAIN VERBOSE SELECT unique1
FROM tenk1 t
WHERE t.ten < ALL (SELECT o.ten FROM onek o WHERE o.four = t.four);

                               QUERY PLAN
-------------------------------------------------------------------​------
 Seq Scan on public.tenk1 t  (cost=0.00..586095.00 rows=5000 width=4)
   Output: t.unique1
   Filter: (ALL (t.ten < (SubPlan 1).col1))
   SubPlan 1
     ->  Seq Scan on public.onek o  (cost=0.00..116.50 rows=250 width=4)
           Output: o.ten
           Filter: (o.four = t.four)
```

ဒီ အတုအယောင် (artificial) ဥပမာက အချက် နှစ်ချက် သရုပ်ဖော်ဖို့ အသုံးဝင်ပါတယ်: outer plan အဆင့်ကန့် တန်ဖိုးတွေကို subplan ထဲကို အောက်သို့ ပို့ပေးလို့ရပြီး (ဒီမှာ `t.four` ကို အောက်သို့ ပို့ပေးထားပါတယ်) — sub-select ရဲ့ ရလဒ်တွေကို outer plan မှာ ရနိုင်ပါတယ်။ အဲဒီ ရလဒ်တန်ဖိုးတွေကို `EXPLAIN` က `(subplan_name).colN` လို သင်္ကေတတွေနဲ့ ပြပါတယ် — ဒါက sub-`SELECT` ရဲ့ `N` မြောက် output column ကို ရည်ညွှန်းပါတယ်။

အပေါ်က ဥပမာမှာ — `ALL` operator က outer query ရဲ့ row တစ်ခုစီအတွက် subplan ကို ထပ်ခါထပ်ခါ run ပါတယ် (ဒါကြောင့် estimated cost မြင့်နေတာပါ)။ တချို့ query တွေက အဲဒါကို ရှောင်ဖို့ *hashed subplan* ကို သုံးနိုင်ပါတယ်:

```sql
EXPLAIN SELECT *
FROM tenk1 t
WHERE t.unique1 NOT IN (SELECT o.unique1 FROM onek o);

                                         QUERY PLAN
-------------------------------------------------------------------​-------------------------
 Seq Scan on tenk1 t  (cost=61.77..531.77 rows=5000 width=244)
   Filter: (NOT (ANY (unique1 = (hashed SubPlan 1).col1)))
   SubPlan 1
     ->  Index Only Scan using onek_unique1 on onek o  (cost=0.28..59.27 rows=1000 width=4)
(4 rows)
```

ဒီမှာ subplan ကို တစ်ခါတည်းနဲ့ run ပြီး — သူ့ရဲ့ output ကို in-memory hash table ထဲ ထည့်ပါတယ် — အဲဒီနောက် outer `ANY` operator က အဲဒီ hash table ထဲမှာ ရှာဖွေပါတယ်။ ဒါအတွက် — sub-`SELECT` က outer query ရဲ့ variable တွေကို ရည်ညွှန်းမှု မရှိရဘဲ — `ANY` ရဲ့ comparison operator က hash လုပ်လို့ရတဲ့ အမျိုးအစား ဖြစ်ရပါတယ်။

Outer query ရဲ့ variable တွေကို မရည်ညွှန်းတာတွေအပြင် — sub-`SELECT` က row တစ်ခုထက်ပို ပြန်မပေးနိုင်ဘူးဆိုရင် — *initplan* အနေနဲ့ implement လုပ်နိုင်ပါတယ်:

```sql
EXPLAIN VERBOSE SELECT unique1
FROM tenk1 t1 WHERE t1.ten = (SELECT (random() * 10)::integer);

                             QUERY PLAN
------------------------------------------------------------​--------
 Seq Scan on public.tenk1 t1  (cost=0.02..470.02 rows=1000 width=4)
   Output: t1.unique1
   Filter: (t1.ten = (InitPlan 1).col1)
   InitPlan 1
     ->  Result  (cost=0.00..0.02 rows=1 width=4)
           Output: ((random() * '10'::double precision))::integer
```

Initplan ကို outer plan ရဲ့ execution တစ်ကြိမ်မှာ တစ်ခါပဲ run ပြီး — သူ့ရဲ့ ရလဒ်တွေကို outer plan ရဲ့ နောက်ပိုင်း row တွေမှာ ပြန်သုံးဖို့ သိမ်းထားပါတယ်။ ဒါကြောင့် ဒီ ဥပမာမှာ `random()` ကို တစ်ခါပဲ evaluate လုပ်ပြီး — `t1.ten` ရဲ့ တန်ဖိုး အားလုံးကို ကျပန်း ရွေးချယ်လိုက်တဲ့ integer တစ်ခုတည်းနဲ့ပဲ ယှဉ်ပါတယ်။ အဲဒါက sub-`SELECT` တည်ဆောက်မှု မပါဘဲ ဖြစ်မယ့်ပုံနဲ့ ဆိုရင် သိသိသာသာ ကွဲပြားပါတယ်။

### 14.1.2. EXPLAIN ANALYZE (EXPLAIN ANALYZE ဖြင့် စစ်ဆေးခြင်း)

Planner ရဲ့ ခန့်မှန်းချက်တွေရဲ့ တိကျမှုကို `EXPLAIN` ရဲ့ `ANALYZE` option ကို သုံးပြီး စစ်ဆေးလို့ရပါတယ်။ ဒီ option နဲ့ဆို `EXPLAIN` က query ကို တကယ် execute လုပ်ပြီး — plan node တစ်ခုချင်းစီအတွင်း စုမိတဲ့ တကယ့် row count တွေနဲ့ တကယ့် run time ကို — သာမန် `EXPLAIN` ပြတဲ့ estimate တွေနဲ့အတူ ပြသပါတယ်။ ဥပမာ — ဒီလို ရလဒ်မျိုး ရနိုင်ပါတယ်:

```sql
EXPLAIN ANALYZE SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2;

                                                           QUERY PLAN
-------------------------------------------------------------------​--------------------------------------------------------------
 Nested Loop  (cost=4.65..118.50 rows=10 width=488) (actual time=0.017..0.051 rows=10.00 loops=1)
   Buffers: shared hit=36 read=6
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.38 rows=10 width=244) (actual time=0.009..0.017 rows=10.00 loops=1)
         Recheck Cond: (unique1 < 10)
         Heap Blocks: exact=10
         Buffers: shared hit=3 read=5 written=4
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0) (actual time=0.004..0.004 rows=10.00 loops=1)
               Index Cond: (unique1 < 10)
               Index Searches: 1
               Buffers: shared hit=2
   ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..7.90 rows=1 width=244) (actual time=0.003..0.003 rows=1.00 loops=10)
         Index Cond: (unique2 = t1.unique2)
         Index Searches: 10
         Buffers: shared hit=24 read=6
 Planning:
   Buffers: shared hit=15 dirtied=9
 Planning Time: 0.485 ms
 Execution Time: 0.073 ms
```

“actual time” တန်ဖိုးတွေက တကယ့် အချိန်ရဲ့ millisecond တွေ ဖြစ်ပြီး — `cost` estimate တွေကိုတော့ arbitrary unit တွေနဲ့ ဖော်ပြတာကြောင့် — သူတို့ နှစ်ခု ကိုက်ညီဖို့ မဖြစ်နိုင်လောက်ဘူးဆိုတာ သတိပြုပါ။ အများအားဖြင့် အရေးအကြီးဆုံး ကြည့်ရမယ့် အရာက — estimated row count တွေက လက်တွေ့နဲ့ ကျိုးကြောင်းဆီလျော်လောက်အောင် နီးစပ်မှု ရှိမရှိပါ။ ဒီ ဥပမာမှာ estimate တွေ အားလုံး အတိအကျ မှန်ပေမယ့် — လက်တွေ့မှာတော့ အဲဒါက တော်တော် ရှားပါတယ်။

တချို့ query plan တွေမှာ subplan node တစ်ခုကို တစ်ကြိမ်ထက်ပိုပြီး execute လုပ်နိုင်ပါတယ်။ ဥပမာ — အပေါ်က nested-loop plan မှာ inner index scan ကို outer row တစ်ခုစီအတွက် တစ်ကြိမ်စီ execute လုပ်ပါလိမ့်မယ်။ ဒီလို အခြေအနေတွေမှာ `loops` တန်ဖိုးက node ရဲ့ execution စုစုပေါင်း အကြိမ်အရေအတွက်ကို ဖော်ပြပြီး — ပြထားတဲ့ actual time နဲ့ rows တန်ဖိုးတွေက execution တစ်ကြိမ်စီရဲ့ ပျမ်းမျှ ဖြစ်ပါတယ်။ ဒါက ကိန်းဂဏန်းတွေကို cost estimate တွေ ပြတဲ့နည်းနဲ့ ယှဉ်လို့ရအောင် လုပ်ထားတာပါ။ Node ထဲမှာ တကယ် ကုန်တဲ့ စုစုပေါင်း အချိန်ကို ရဖို့ `loops` တန်ဖိုးနဲ့ မြှောက်ပါ။ အပေါ်က ဥပမာမှာ `tenk2` ပေါ်က index scan တွေ execute လုပ်ဖို့ စုစုပေါင်း 0.030 millisecond ကုန်ပါတယ်။

တချို့ အခြေအနေတွေမှာ `EXPLAIN ANALYZE` က plan node ရဲ့ execution time တွေနဲ့ row count တွေအပြင် — နောက်ထပ် execution statistics တွေကိုပါ ပြပါတယ်။ ဥပမာ — Sort နဲ့ Hash node တွေက နောက်ထပ် အချက်အလက်တွေ ပေးပါတယ်:

```sql
EXPLAIN ANALYZE SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2 ORDER BY t1.fivethous;

                                                                 QUERY PLAN
-------------------------------------------------------------------​-------------------------------------------------------------------​------
 Sort  (cost=713.05..713.30 rows=100 width=488) (actual time=2.995..3.002 rows=100.00 loops=1)
   Sort Key: t1.fivethous
   Sort Method: quicksort  Memory: 74kB
   Buffers: shared hit=440
   ->  Hash Join  (cost=226.23..709.73 rows=100 width=488) (actual time=0.515..2.920 rows=100.00 loops=1)
         Hash Cond: (t2.unique2 = t1.unique2)
         Buffers: shared hit=437
         ->  Seq Scan on tenk2 t2  (cost=0.00..445.00 rows=10000 width=244) (actual time=0.026..1.790 rows=10000.00 loops=1)
               Buffers: shared hit=345
         ->  Hash  (cost=224.98..224.98 rows=100 width=244) (actual time=0.476..0.477 rows=100.00 loops=1)
               Buckets: 1024  Batches: 1  Memory Usage: 35kB
               Buffers: shared hit=92
               ->  Bitmap Heap Scan on tenk1 t1  (cost=5.06..224.98 rows=100 width=244) (actual time=0.030..0.450 rows=100.00 loops=1)
                     Recheck Cond: (unique1 < 100)
                     Heap Blocks: exact=90
                     Buffers: shared hit=92
                     ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0) (actual time=0.013..0.013 rows=100.00 loops=1)
                           Index Cond: (unique1 < 100)
                           Index Searches: 1
                           Buffers: shared hit=2
 Planning:
   Buffers: shared hit=12
 Planning Time: 0.187 ms
 Execution Time: 3.036 ms
```

Sort node က သုံးထားတဲ့ sort method (အထူးသဖြင့် sort က in-memory လား on-disk လား) နဲ့ လိုအပ်တဲ့ memory ဒါမှမဟုတ် disk space ပမာဏကို ပြပါတယ်။ Hash node က hash bucket နဲ့ batch အရေအတွက်၊ hash table အတွက် သုံးခဲ့တဲ့ အမြင့်ဆုံး memory ပမာဏတို့ကို ပြပါတယ်။ (Batch အရေအတွက်က တစ်ခုထက် ပိုရင် — disk space သုံးစွဲမှုလည်း ပါဝင်ပေမယ့် — အဲဒါကို မပြပါဘူး။)

Index Scan node တွေ (Bitmap Index Scan နဲ့ Index-Only Scan node တွေအပြင်) က node execution/`loops` အားလုံး တစ်လျှောက် စုစုပေါင်း search အကြိမ်အရေအတွက်ကို ဖော်ပြတဲ့ “Index Searches” line တစ်ကြောင်း ပြပါတယ်:

```sql
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE thousand IN (1, 500, 700, 999);
                                                            QUERY PLAN
-------------------------------------------------------------------​---------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=9.45..73.44 rows=40 width=244) (actual time=0.012..0.028 rows=40.00 loops=1)
   Recheck Cond: (thousand = ANY ('{1,500,700,999}'::integer[]))
   Heap Blocks: exact=39
   Buffers: shared hit=47
   ->  Bitmap Index Scan on tenk1_thous_tenthous  (cost=0.00..9.44 rows=40 width=0) (actual time=0.009..0.009 rows=40.00 loops=1)
         Index Cond: (thousand = ANY ('{1,500,700,999}'::integer[]))
         Index Searches: 4
         Buffers: shared hit=8
 Planning Time: 0.029 ms
 Execution Time: 0.034 ms
```

ဒီမှာ index search သီးခြား 4 ကြိမ် လိုအပ်ခဲ့တဲ့ Bitmap Index Scan node တစ်ခုကို တွေ့ရပါတယ်။ predicate ရဲ့ `IN` construct ထဲက `integer` တန်ဖိုးတစ်ခုစီအတွက် — scan က `tenk1_thous_tenthous` index ရဲ့ root page ကနေ index ကို တစ်ကြိမ်စီ ရှာရပါတယ်။ ဒါပေမယ့် — index search အရေအတွက်က query predicate နဲ့ ဒီလောက် ရိုးရှင်းတဲ့ ဆက်စပ်မှုမျိုး မရှိတတ်ပါဘူး:

```sql
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE thousand IN (1, 2, 3, 4);
                                                            QUERY PLAN
-------------------------------------------------------------------​---------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=9.45..73.44 rows=40 width=244) (actual time=0.009..0.019 rows=40.00 loops=1)
   Recheck Cond: (thousand = ANY ('{1,2,3,4}'::integer[]))
   Heap Blocks: exact=38
   Buffers: shared hit=40
   ->  Bitmap Index Scan on tenk1_thous_tenthous  (cost=0.00..9.44 rows=40 width=0) (actual time=0.005..0.005 rows=40.00 loops=1)
         Index Cond: (thousand = ANY ('{1,2,3,4}'::integer[]))
         Index Searches: 1
         Buffers: shared hit=2
 Planning Time: 0.029 ms
 Execution Time: 0.026 ms
```

ငါတို့ သုံးခဲ့တဲ့ `IN` query ရဲ့ ဒီ variant က index search 1 ကြိမ်ပဲ လုပ်ဆောင်ခဲ့ပါတယ်။ (မူရင်း query နဲ့ ယှဉ်ရင်) index ထဲ ဖြတ်သန်းဖို့ အချိန် ပိုနည်းပါတယ် — ဘာကြောင့်လဲဆိုတော့ — သူ့ရဲ့ `IN` construct က — `tenk1_thous_tenthous` index ရဲ့ leaf page တစ်ခုတည်းပေါ်မှာ ကပ်လျက် သိမ်းထားတဲ့ index tuple တွေနဲ့ ကိုက်ညီတဲ့ တန်ဖိုးတွေကို သုံးလို့ပါ။

“Index Searches” line က — index တစ်ခုကို ပိုထိရောက်စွာ ဖြတ်သန်းဖို့ *skip scan* optimization ကို သက်ရောက်တဲ့ B-tree index scan တွေမှာလည်း အသုံးဝင်ပါတယ်:

```sql
EXPLAIN ANALYZE SELECT four, unique1 FROM tenk1 WHERE four BETWEEN 1 AND 3 AND unique1 = 42;
                                                              QUERY PLAN
-------------------------------------------------------------------​---------------------------------------------------------------
 Index Only Scan using tenk1_four_unique1_idx on tenk1  (cost=0.29..6.90 rows=1 width=8) (actual time=0.006..0.007 rows=1.00 loops=1)
   Index Cond: ((four >= 1) AND (four <= 3) AND (unique1 = 42))
   Heap Fetches: 0
   Index Searches: 3
   Buffers: shared hit=7
 Planning Time: 0.029 ms
 Execution Time: 0.012 ms
```

ဒီမှာ `tenk1` table ရဲ့ `four` နဲ့ `unique1` column တွေပေါ်က multi-column index တစ်ခုဖြစ်တဲ့ `tenk1_four_unique1_idx` ကို သုံးထားတဲ့ Index-Only Scan node တစ်ခုကို တွေ့ရပါတယ်။ Scan က search 3 ကြိမ် လုပ်ပြီး — search တစ်ကြိမ်ချင်းစီက index leaf page တစ်ခုတည်းကို ဖတ်ပါတယ်: “four = 1 AND unique1 = 42”, “four = 2 AND unique1 = 42” နဲ့ “four = 3 AND unique1 = 42” တို့ ဖြစ်ပါတယ်။ ဒီ index က ယေဘုယျအားဖြင့် skip scan အတွက် ကောင်းတဲ့ ပစ်မှတ်တစ်ခုပါ — [အပိုင်း 11.3](/docs/postgresql/indexes-multicolumn) မှာ ဆွေးနွေးထားသလို — သူ့ရဲ့ ဦးဆောင် column (ဖြစ်တဲ့ `four` column) မှာ distinct value 4 ခုပဲ ပါဝင်ပြီး — ဒုတိယ/နောက်ဆုံး column (ဖြစ်တဲ့ `unique1` column) မှာတော့ distinct value အများကြီး ပါဝင်လို့ပါ။

နောက်ထပ် အချက်အလက် အမျိုးအစားတစ်ခုက filter condition တစ်ခုကြောင့် ဖယ်ရှားခံရတဲ့ row အရေအတွက်ပါ:

```sql
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE ten < 7;

                                               QUERY PLAN
-------------------------------------------------------------------​--------------------------------------
 Seq Scan on tenk1  (cost=0.00..470.00 rows=7000 width=244) (actual time=0.030..1.995 rows=7000.00 loops=1)
   Filter: (ten < 7)
   Rows Removed by Filter: 3000
   Buffers: shared hit=345
 Planning Time: 0.102 ms
 Execution Time: 2.145 ms
```

ဒီ count တွေက join node တွေမှာ သက်ရောက်တဲ့ filter condition တွေအတွက် အထူး အဖိုးတန်ပါတယ်။ “Rows Removed” line က scan လုပ်လိုက်တဲ့ row တစ်ခုခု ဒါမှမဟုတ် (join node ရဲ့ ကိစ္စမှာဆို) ဖြစ်နိုင်တဲ့ join pair တစ်ခုခုကို filter condition က ပယ်ချလိုက်မှသာ ပေါ်ပါတယ်။

Filter condition တွေနဲ့ ဆင်တူတဲ့ ကိစ္စတစ်ခုက “lossy” index scan တွေမှာ ဖြစ်ပါတယ်။ ဥပမာ — သတ်မှတ်ထားတဲ့ point တစ်ခု ပါဝင်တဲ့ polygon တွေကို ရှာတဲ့ ဒီ search ကို ကြည့်ပါ:

```sql
EXPLAIN ANALYZE SELECT * FROM polygon_tbl WHERE f1 @> polygon '(0.5,2.0)';

                                              QUERY PLAN
-------------------------------------------------------------------​-----------------------------------
 Seq Scan on polygon_tbl  (cost=0.00..1.09 rows=1 width=85) (actual time=0.023..0.023 rows=0.00 loops=1)
   Filter: (f1 @> '((0.5,2))'::polygon)
   Rows Removed by Filter: 7
   Buffers: shared hit=1
 Planning Time: 0.039 ms
 Execution Time: 0.033 ms
```

ဒီ sample table က index scan လုပ်ဖို့ မလိုလောက်အောင် သေးတယ်လို့ planner က (မှန်မှန်ကန်ကန်ပဲ) ထင်တဲ့အတွက် — row အားလုံး filter condition ကြောင့် ပယ်ချခံရတဲ့ သာမန် sequential scan တစ်ခုကိုပဲ ရပါတယ်။ ဒါပေမယ့် — index scan ကို အတင်းသုံးဖို့ လုပ်ကြည့်ရင်:

```sql
SET enable_seqscan TO off;

EXPLAIN ANALYZE SELECT * FROM polygon_tbl WHERE f1 @> polygon '(0.5,2.0)';

                                                        QUERY PLAN
-------------------------------------------------------------------​-------------------------------------------------------
 Index Scan using gpolygonind on polygon_tbl  (cost=0.13..8.15 rows=1 width=85) (actual time=0.074..0.074 rows=0.00 loops=1)
   Index Cond: (f1 @> '((0.5,2))'::polygon)
   Rows Removed by Index Recheck: 1
   Index Searches: 1
   Buffers: shared hit=1
 Planning Time: 0.039 ms
 Execution Time: 0.098 ms
```

ဒီမှာ index က candidate row တစ်ခု ပြန်ပေးပြီး — index condition ရဲ့ recheck ကြောင့် ပယ်ချခံရတာကို တွေ့နိုင်ပါတယ်။ GiST index က polygon containment test တွေအတွက် “lossy” ဖြစ်လို့ ဒီလို ဖြစ်တာပါ: သူက target နဲ့ ထပ်နေတဲ့ (overlap) polygon တွေပါတဲ့ row တွေကို တကယ် ပြန်ပေးပြီး — အဲဒီ row တွေပေါ်မှာ တိကျတဲ့ containment test ကို ထပ်လုပ်ရပါတယ်။

`EXPLAIN` မှာ `BUFFERS` option တစ်ခု ရှိပြီး — ပေးထားတဲ့ query ရဲ့ planning နဲ့ execution အတွင်း လုပ်ဆောင်ခဲ့တဲ့ I/O operation တွေအကြောင်း နောက်ထပ် အသေးစိတ် ပေးပါတယ်။ ပြသထားတဲ့ buffer ကိန်းဂဏန်းတွေက — ပေးထားတဲ့ node နဲ့ သူ့ရဲ့ child node တွေ အားလုံးအတွက် — hit, read, dirtied နဲ့ written ဖြစ်ခဲ့တဲ့ non-distinct buffer တွေရဲ့ အရေအတွက်ကို ပြပါတယ်။ `ANALYZE` option က `BUFFERS` option ကို သွယ်ဝိုက်၍ (implicitly) enable လုပ်ပေးပါတယ်။ အဲဒါ မလိုချင်ဘူးဆိုရင် — `BUFFERS` ကို အတိအကျ (explicitly) disable လုပ်နိုင်ပါတယ်:

```sql
EXPLAIN (ANALYZE, BUFFERS OFF) SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000;

                                                           QUERY PLAN
-------------------------------------------------------------------​--------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=25.07..60.11 rows=10 width=244) (actual time=0.105..0.114 rows=10.00 loops=1)
   Recheck Cond: ((unique1 < 100) AND (unique2 > 9000))
   Heap Blocks: exact=10
   ->  BitmapAnd  (cost=25.07..25.07 rows=10 width=0) (actual time=0.100..0.101 rows=0.00 loops=1)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0) (actual time=0.027..0.027 rows=100.00 loops=1)
               Index Cond: (unique1 < 100)
               Index Searches: 1
         ->  Bitmap Index Scan on tenk1_unique2  (cost=0.00..19.78 rows=999 width=0) (actual time=0.070..0.070 rows=999.00 loops=1)
               Index Cond: (unique2 > 9000)
               Index Searches: 1
 Planning Time: 0.162 ms
 Execution Time: 0.143 ms
```

`EXPLAIN ANALYZE` က query ကို တကယ် run တာကြောင့် — query က ထုတ်လုပ်နိုင်တဲ့ ရလဒ်တွေ ဘယ်လိုပဲ ဖြစ်ဖြစ် — `EXPLAIN` data ကို ပုံနှိပ်တာကို ဦးစားပေးလို့ ပစ်ပယ်ခံရပေမယ့် — side-effect တွေကတော့ ပုံမှန်အတိုင်း ဖြစ်ပျက်မယ်ဆိုတာ သတိရထားပါ။ Table တွေကို မပြောင်းလဲစေဘဲ data-modifying query တစ်ခုကို analyze လုပ်ချင်ရင် — နောက်မှ command ကို roll back လုပ်လို့ရပါတယ် — ဥပမာ:

```sql
BEGIN;

EXPLAIN ANALYZE UPDATE tenk1 SET hundred = hundred + 1 WHERE unique1 < 100;

                                                           QUERY PLAN
-------------------------------------------------------------------​-------------------------------------------------------------
 Update on tenk1  (cost=5.06..225.23 rows=0 width=0) (actual time=1.634..1.635 rows=0.00 loops=1)
   ->  Bitmap Heap Scan on tenk1  (cost=5.06..225.23 rows=100 width=10) (actual time=0.065..0.141 rows=100.00 loops=1)
         Recheck Cond: (unique1 < 100)
         Heap Blocks: exact=90
         Buffers: shared hit=4 read=2
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=100 width=0) (actual time=0.031..0.031 rows=100.00 loops=1)
               Index Cond: (unique1 < 100)
               Index Searches: 1
               Buffers: shared read=2
 Planning Time: 0.151 ms
 Execution Time: 1.856 ms

ROLLBACK;
```

ဒီ ဥပမာမှာ မြင်ရသလို — query က `INSERT`, `UPDATE`, `DELETE` ဒါမှမဟုတ် `MERGE` command ဖြစ်တဲ့အခါ — table ပြောင်းလဲမှုတွေကို သက်ရောက်စေတဲ့ တကယ့် အလုပ်ကို အပေါ်ဆုံးအဆင့်က Insert, Update, Delete ဒါမှမဟုတ် Merge plan node က လုပ်ပါတယ်။ ဒီ node ရဲ့ အောက်က plan node တွေက — မူရင်း row တွေကို ရှာဖွေတဲ့ ဒါမှမဟုတ်/နဲ့ data အသစ်တွေကို တွက်ချက်တဲ့ အလုပ်ကို လုပ်ပါတယ်။ ဒါကြောင့် အပေါ်မှာ — အရင်က မြင်ဖူးတဲ့ bitmap table scan အမျိုးအစားကိုပဲ တွေ့ရပြီး — သူ့ရဲ့ output ကို update လုပ်ထားတဲ့ row တွေကို သိမ်းတဲ့ Update node ထဲကို ထည့်သွင်းပါတယ်။ Data-modifying node က run time အများကြီး ယူနိုင်ပေမယ့် (ဒီမှာ — အချိန်ရဲ့ ခြင်္သေ့ဝေစုကို သူက စားသုံးနေပါတယ်) — planner က လက်ရှိမှာ အဲဒီအလုပ်အတွက် cost estimate တွေထဲကို ဘာမှ ထပ်မထည့်ဘူးဆိုတာ မှတ်သားစရာပါ။ အကြောင်းကတော့ — လုပ်ရမယ့် အလုပ်က မှန်ကန်တဲ့ query plan တိုင်းအတွက် အတူတူပဲ ဖြစ်လို့ — planning ဆုံးဖြတ်ချက်တွေကို မထိခိုက်စေလို့ပါ။

`UPDATE`, `DELETE` ဒါမှမဟုတ် `MERGE` command တစ်ခုက partitioned table ဒါမှမဟုတ် inheritance hierarchy တစ်ခုကို သက်ရောက်တဲ့အခါ — output က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```sql
EXPLAIN UPDATE gtest_parent SET f1 = CURRENT_DATE WHERE f2 = 101;

                                       QUERY PLAN
-------------------------------------------------------------------​---------------------
 Update on gtest_parent  (cost=0.00..3.06 rows=0 width=0)
   Update on gtest_child gtest_parent_1
   Update on gtest_child2 gtest_parent_2
   Update on gtest_child3 gtest_parent_3
   ->  Append  (cost=0.00..3.06 rows=3 width=14)
         ->  Seq Scan on gtest_child gtest_parent_1  (cost=0.00..1.01 rows=1 width=14)
               Filter: (f2 = 101)
         ->  Seq Scan on gtest_child2 gtest_parent_2  (cost=0.00..1.01 rows=1 width=14)
               Filter: (f2 = 101)
         ->  Seq Scan on gtest_child3 gtest_parent_3  (cost=0.00..1.01 rows=1 width=14)
               Filter: (f2 = 101)
```

ဒီ ဥပမာမှာ Update node က child table သုံးခုကို ထည့်သွင်း စဉ်းစားဖို့ လိုပေမယ့် — မူလ ဖော်ပြခဲ့တဲ့ partitioned table ကိုတော့ မလိုပါဘူး (ဘာကြောင့်လဲဆိုတော့ — အဲဒီ table က data ဘယ်တော့မှ မသိမ်းလို့ပါ)။ ဒါကြောင့် — table တစ်ခုစီအတွက် တစ်ခုနှုန်းနဲ့ — input scanning subplan သုံးခု ရှိပါတယ်။ ရှင်းလင်းမှု ရှိစေဖို့ — Update node ကို — သက်ဆိုင်တဲ့ subplan တွေရဲ့ အစီအစဉ်အတိုင်း — update လုပ်မယ့် တိကျတဲ့ target table တွေကို ပြဖို့ annotate (မှတ်စာကပ်) လုပ်ထားပါတယ်။

`EXPLAIN ANALYZE` က ပြတဲ့ `Planning time` က — parse လုပ်ပြီးသား query ကနေ query plan ကို ထုတ်လုပ်ပြီး optimize လုပ်ဖို့ ကုန်တဲ့ အချိန်ပါ။ Parsing ဒါမှမဟုတ် rewriting အချိန်တွေ မပါဝင်ပါဘူး။

`EXPLAIN ANALYZE` က ပြတဲ့ `Execution time` ထဲမှာ executor ရဲ့ start-up နဲ့ shut-down အချိန်၊ ပစ်ခတ်ခံရတဲ့ (fired) trigger တွေ run ဖို့ အချိန်တွေ ပါဝင်ပေမယ့် — parsing, rewriting ဒါမှမဟုတ် planning time တွေ မပါဝင်ပါဘူး။ `BEFORE` trigger တွေ run ဖို့ ကုန်တဲ့ အချိန်က — သက်ဆိုင်တဲ့ Insert, Update ဒါမှမဟုတ် Delete node ရဲ့ အချိန်ထဲမှာ ပါဝင်ပါတယ်; ဒါပေမယ့် `AFTER` trigger တွေ run ဖို့ ကုန်တဲ့ အချိန်ကိုတော့ — `AFTER` trigger တွေက plan တစ်ခုလုံး ပြီးမှ ပစ်ခတ်တာမို့ — အဲဒီနေရာမှာ မရေတွက်ပါဘူး။ Trigger တစ်ခုချင်းစီမှာ (`BEFORE` ပဲ ဖြစ်ဖြစ် `AFTER` ပဲ ဖြစ်ဖြစ်) ကုန်တဲ့ စုစုပေါင်း အချိန်ကိုလည်း သီးခြားစီ ပြပါတယ်။ Deferred constraint trigger တွေက transaction အဆုံးအထိ execute မလုပ်ရတဲ့အတွက် — `EXPLAIN ANALYZE` က သူတို့ကို လုံးဝ ထည့်မတွက်ဘူးဆိုတာ သတိပြုပါ။

အပေါ်ဆုံး အဆင့် node အတွက် ပြထားတဲ့ အချိန်ထဲမှာ — query ရဲ့ output data ကို ပြသလို့ရတဲ့ ပုံစံအဖြစ် ပြောင်းဖို့ ဒါမှမဟုတ် client ဆီ ပို့ဖို့ လိုအပ်တဲ့ အချိန် မပါဝင်ပါဘူး။ `EXPLAIN ANALYZE` က data ကို client ဆီ ဘယ်တော့မှ မပို့ပေမယ့် — `SERIALIZE` option ကို သတ်မှတ်ပေးခြင်းအားဖြင့် — query ရဲ့ output data ကို ပြသလို့ရတဲ့ ပုံစံအဖြစ် ပြောင်းပြီး — အဲဒါအတွက် လိုအပ်တဲ့ အချိန်ကို တိုင်းတာဖို့ ပြောလို့ရပါတယ်။ အဲဒီ အချိန်ကို သီးခြားစီ ပြမှာ ဖြစ်ပြီး — စုစုပေါင်း `Execution time` ထဲမှာလည်း ပါဝင်ပါတယ်။

### 14.1.3. Caveats (သတိပြုရန် အချက်များ)

`EXPLAIN ANALYZE` နဲ့ တိုင်းတာတဲ့ run time တွေက — query တစ်ခုတည်းရဲ့ ပုံမှန် execution ကနေ သွေဖည်နိုင်တဲ့ နည်းလမ်း အရေးပါတဲ့ နှစ်မျိုး ရှိပါတယ်။ ပထမ — client ဆီ output row တွေ မပို့တဲ့အတွက် — network transmission cost တွေ မပါဝင်ပါဘူး။ `SERIALIZE` ကို သတ်မှတ်ထားရင်မှလွဲပြီး — I/O conversion cost တွေလည်း မပါဝင်ပါဘူး။ ဒုတိယ — `EXPLAIN ANALYZE` က ပေါင်းထည့်လိုက်တဲ့ measurement overhead က သိသာနိုင်ပါတယ် — အထူးသဖြင့် `gettimeofday()` operating-system call တွေ နှေးကွေးတဲ့ machine တွေမှာပါ။ သင့် system ပေါ်မှာ timing ရဲ့ overhead ကို တိုင်းတာဖို့ [pg_test_timing](https://www.postgresql.org/docs/current/pgtesttiming.html) tool ကို သုံးနိုင်ပါတယ်။

`EXPLAIN` ရလဒ်တွေကို — သင်တကယ် စမ်းသပ်နေတဲ့ အခြေအနေနဲ့ အများကြီး ကွဲပြားတဲ့ အခြေအနေတွေဆီ ချဲ့ထွက် (extrapolate) လုပ်လို့ မရပါဘူး; ဥပမာ — အရုပ်-အရွယ်အစား table တစ်ခုပေါ်က ရလဒ်တွေကို ကြီးမားတဲ့ table တွေမှာလည်း အလားတူ ဖြစ်မယ်လို့ ယူဆလို့ မရပါဘူး။ Planner ရဲ့ cost estimate တွေက linear မဟုတ်တဲ့အတွက် — ပိုကြီးတဲ့ ဒါမှမဟုတ် ပိုသေးတဲ့ table အတွက် plan တစ်မျိုး ရွေးချယ်နိုင်ပါတယ်။ လွန်ကဲတဲ့ ဥပမာတစ်ခုက — disk page တစ်ခုတည်းကိုပဲ ယူတဲ့ table တစ်ခုပေါ်မှာ — index တွေ ရှိတာ မရှိတာ ဘယ်လိုပဲ ဖြစ်ဖြစ် — sequential scan plan ကို အမြဲလိုလို ရပါလိမ့်မယ်။ Table ကို process လုပ်ဖို့ disk page read တစ်ခုပဲ ယူမယ်ဆိုတာကို planner က နားလည်ထားလို့ — index ကို ကြည့်ဖို့ page read တွေ ထပ်လုပ်ရတဲ့ တန်ဖိုး မရှိပါဘူး။ (ဒါက အပေါ်က `polygon_tbl` ဥပမာမှာ ဖြစ်ပျက်နေတာကို မြင်ခဲ့ရပါတယ်။)

Actual နဲ့ estimated တန်ဖိုးတွေ ကောင်းကောင်း မကိုက်ညီတဲ့ အခြေအနေတွေ ရှိပါတယ် — ဒါပေမယ့် တကယ်တော့ ဘာမှ မမှားပါဘူး။ ဒီလို ကိစ္စတစ်မျိုးက plan node ရဲ့ execution ကို `LIMIT` ဒါမှမဟုတ် အလားတူ အကျိုးသက်ရောက်မှုတစ်ခုကြောင့် plan node ရဲ့ execution က အဆုံးမသွားဘဲ ရပ်တန့်သွားတဲ့အခါ ဖြစ်ပါတယ်။ ဥပမာ — အရင်က သုံးခဲ့တဲ့ `LIMIT` query မှာ:

```sql
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2;

                                                          QUERY PLAN
-------------------------------------------------------------------​------------------------------------------------------------
 Limit  (cost=0.29..14.33 rows=2 width=244) (actual time=0.051..0.071 rows=2.00 loops=1)
   Buffers: shared hit=16
   ->  Index Scan using tenk1_unique2 on tenk1  (cost=0.29..70.50 rows=10 width=244) (actual time=0.051..0.070 rows=2.00 loops=1)
         Index Cond: (unique2 > 9000)
         Filter: (unique1 < 100)
         Rows Removed by Filter: 287
         Index Searches: 1
         Buffers: shared hit=16
 Planning Time: 0.077 ms
 Execution Time: 0.086 ms
```

Index Scan node အတွက် estimated cost နဲ့ row count ကို — အဆုံးထိ run မယ့်ပုံစံနဲ့ ပြထားပါတယ်။ ဒါပေမယ့် — လက်တွေ့မှာ Limit node က row နှစ်ခု ရတာနဲ့ row တွေ တောင်းဆိုတာကို ရပ်လိုက်လို့ — actual row count က 2 ပဲ ရှိပြီး — run time က cost estimate ညွှန်ပြတာထက် နည်းပါတယ်။ ဒါက estimation error မဟုတ်ပါဘူး — estimate တွေနဲ့ တကယ့် တန်ဖိုးတွေကို ပြသတဲ့ နည်းလမ်းရဲ့ ကွာဟချက် တစ်ခုပဲ ဖြစ်ပါတယ်။

Merge join တွေမှာလည်း — သတိမထားတတ်တဲ့သူကို ရှုပ်ထွေးစေနိုင်တဲ့ measurement artifact တွေ ရှိပါတယ်။ Merge join တစ်ခုက — input တစ်ခု ကုန်ဆုံးသွားပြီး ကျန် input တစ်ခုထဲက နောက် key value က အခြား input ရဲ့ နောက်ဆုံး key value ထက် ကြီးနေရင် — input တစ်ခုကို ဖတ်တာ ရပ်လိုက်ပါလိမ့်မယ်; ဒီလို အခြေအနေမှာ နောက်ထပ် ကိုက်ညီမှုတွေ မရှိနိုင်တော့လို့ — ပထမ input ရဲ့ ကျန်တဲ့ အပိုင်းကို scan လုပ်စရာ မလိုတော့ပါဘူး။ ဒါက child တစ်ခုကို အပြည့်အဝ မဖတ်ရတဲ့ ရလဒ်ကို ဖြစ်စေပြီး — `LIMIT` အတွက် ဖော်ပြခဲ့တဲ့ ရလဒ်မျိုးတွေ ဖြစ်ပါတယ်။ ဒါ့အပြင် — outer (ပထမ) child ထဲမှာ duplicate key value တွေပါတဲ့ row တွေ ရှိနေရင် — inner (ဒုတိယ) child ကို နောက်ပြန် ဆုတ်ပြီး — အဲဒီ key value နဲ့ ကိုက်ညီတဲ့ row အပိုင်းအတွက် ပြန် scan လုပ်ပါတယ်။ `EXPLAIN ANALYZE` က ဒီလို ထပ်ခါထပ်ခါ ထုတ်လွှတ်မှုတွေကို — တကယ့် row အပိုတွေလိုပဲ ရေတွက်ပါတယ်။ Outer duplicate တွေ အများကြီး ရှိနေရင် — inner child plan node ရဲ့ ဖော်ပြထားတဲ့ actual row count က — inner relation ထဲမှာ တကယ်ရှိတဲ့ row အရေအတွက်ထက် သိသိသာသာ ကြီးနေနိုင်ပါတယ်။

BitmapAnd နဲ့ BitmapOr node တွေက — implementation ရဲ့ ကန့်သတ်ချက်တွေကြောင့် — သူတို့ရဲ့ actual row count တွေကို zero အဖြစ် အမြဲ ဖော်ပြပါတယ်။

ပုံမှန်အားဖြင့် `EXPLAIN` က planner ဖန်တီးတဲ့ plan node တိုင်းကို ပြသပါတယ်။ ဒါပေမယ့် — planning time မှာ မရနိုင်သေးတဲ့ parameter တန်ဖိုးတွေအပေါ် အခြေခံပြီး — တချို့ node တွေက row တစ်ခုမှ မထုတ်နိုင်တာကြောင့် execute လုပ်စရာ မလိုဘူးလို့ executor က ဆုံးဖြတ်နိုင်တဲ့ အခြေအနေတွေ ရှိပါတယ်။ (လက်ရှိမှာ ဒါက partitioned table တစ်ခုကို scan လုပ်နေတဲ့ Append ဒါမှမဟုတ် MergeAppend node ရဲ့ child node တွေမှာပဲ ဖြစ်နိုင်ပါတယ်။) ဒီလိုဖြစ်တဲ့အခါ — အဲဒီ plan node တွေကို `EXPLAIN` output ကနေ ချန်လှပ်ပြီး — `Subplans Removed: N` ဆိုတဲ့ annotation တစ်ခုနဲ့ အစားထိုး ဖော်ပြပါတယ်။
