---
title: "Parallel Plans (parallel plan များ)"
description: "PostgreSQL ရဲ့ parallel plan များအကြောင်း — parallel scan, parallel join, parallel aggregation, parallel append နှင့် query အတွက် parallel plan ရရှိစေရန် အကြံပြုချက်များ"
order: 142
source: "https://www.postgresql.org/docs/current/parallel-plans.html"
status: translated
updated: 2026-09-11
---

## 15.3. Parallel Plans (parallel plan များ)

- **15.3.1. Parallel Scans (parallel scan များ)**
- **15.3.2. Parallel Joins (parallel join များ)**
- **15.3.3. Parallel Aggregation (parallel aggregation / စုစည်း တွက်ချက်မှု)**
- **15.3.4. Parallel Append (parallel append)**
- **15.3.5. Parallel Plan Tips (parallel plan အတွက် အကြံပြုချက်များ)**

Worker (လုပ်ဆောင်သူ process) တစ်ခုချင်းစီက plan ရဲ့ parallel အပိုင်းကို အဆုံးထိ အပြည့်အဝ လုပ်ဆောင်တာဖြစ်လို့ — သာမန် query plan တစ်ခုကို ယူပြီး worker အများအပြားနဲ့ run လိုက်ရုံနဲ့ ရနိုင်မှာ မဟုတ်ပါဘူး။ Worker တစ်ခုချင်းစီက output result set ရဲ့ မိတ္တူ အပြည့်အစုံကို ထုတ်ပေးမှာဖြစ်လို့ — query က ပုံမှန်ထက် ပိုမြန်လာမှာ မဟုတ်တဲ့အပြင် ရလဒ်လည်း မှားယွင်းနေပါလိမ့်မယ်။ ဒါကြောင့် — plan ရဲ့ parallel အပိုင်းက — query optimizer က internal အနေနဲ့ *partial plan* (တစ်စိတ်တစ်ပိုင်း plan) လို့ သိကြတဲ့ ပုံစံ ဖြစ်ရပါမယ်။ ဆိုလိုတာက — plan ကို လုပ်ဆောင်တဲ့ process တစ်ခုချင်းစီက output row အုပ်စုခွဲ (subset) တစ်ခုကိုသာ ထုတ်ပေးမယ့် ပုံစံမျိုးနဲ့ တည်ဆောက်ထားရမှာဖြစ်ပြီး — လိုအပ်တဲ့ output row တစ်ခုချင်းစီကို ပူးပေါင်း လုပ်ဆောင်တဲ့ process တွေထဲက တစ်ခုတည်းကသာ ထုတ်ပေးမယ်ဆိုတာ အာမခံထားရပါမယ်။ ယေဘုယျအားဖြင့် — query ရဲ့ driving table ပေါ်က scan က parallel-aware scan (parallel ကို သိသော scan) ဖြစ်ရပါမယ်။

### 15.3.1. Parallel Scans (parallel scan များ)

လက်ရှိ support လုပ်ထားတဲ့ parallel-aware table scan အမျိုးအစားတွေက အောက်ပါအတိုင်း ဖြစ်ပါတယ်။

- Parallel sequential scan တစ်ခုမှာ — table ရဲ့ block တွေကို အပိုင်းအခြား (range) တွေအဖြစ် ခွဲပြီး ပူးပေါင်း လုပ်ဆောင်တဲ့ process တွေကြားမှာ မျှဝေပါတယ်။ Worker process တစ်ခုချင်းစီက — သူ့ကို ပေးထားတဲ့ block အပိုင်းအခြားကို scan လုပ်ပြီးမှသာ — နောက်ထပ် block အပိုင်းအခြား တစ်ခုကို တောင်းဆိုပါတယ်။
- Parallel bitmap heap scan မှာ — process တစ်ခုကို leader (ခေါင်းဆောင်) အဖြစ် ရွေးချယ်ပါတယ်။ အဲဒီ process က index တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ index တွေကို scan လုပ်ပြီး — ဘယ် table block တွေကို သွားရောက် ကြည့်ရှုဖို့ လိုသလဲဆိုတာ ညွှန်ပြတဲ့ bitmap (ဘစ်မြေပုံ) တစ်ခုကို တည်ဆောက်ပါတယ်။ ပြီးရင် ဒီ block တွေကို — parallel sequential scan မှာလိုပဲ — ပူးပေါင်း လုပ်ဆောင်တဲ့ process တွေကြားမှာ ခွဲဝေပါတယ်။ တနည်းအားဖြင့် — heap scan ကို parallel အနေနဲ့ လုပ်ဆောင်ပေမယ့် — အောက်ခံ index scan ကတော့ parallel မဟုတ်ပါဘူး။
- Parallel index scan ဒါမှမဟုတ် parallel index-only scan မှာ — ပူးပေါင်း လုပ်ဆောင်တဲ့ process တွေက index ကနေ data ကို အလှည့်ကျ ဖတ်ပါတယ်။ လက်ရှိမှာတော့ parallel index scan ကို btree index တွေအတွက်ပဲ support လုပ်ပါတယ်။ Process တစ်ခုချင်းစီက index block တစ်ခုတည်းကို claim (တောင်းခံ သိမ်းပိုက်) ပြီး — အဲဒီ block က ညွှန်ပြတဲ့ tuple အားလုံးကို scan လုပ်ပြီး ပြန်ပေးပါတယ်; တခြား process တွေကတော့ တစ်ချိန်တည်းမှာပဲ မတူတဲ့ index block တစ်ခုကနေ tuple တွေကို ပြန်ပေးနေနိုင်ပါတယ်။ Parallel btree scan ရဲ့ ရလဒ်တွေကို worker process တစ်ခုချင်းစီအတွင်း sorted (စီစဉ်ပြီး) order အနေနဲ့ ပြန်ပေးပါတယ်။

Non-btree index တွေရဲ့ scan ကဲ့သို့သော တခြား scan အမျိုးအစားတွေကလည်း — အနာဂတ်မှာ parallel scan တွေကို support လုပ်လာနိုင်ပါတယ်။

### 15.3.2. Parallel Joins (parallel join များ)

Non-parallel plan မှာလိုပဲ — driving table ကို nested loop, hash join, ဒါမှမဟုတ် merge join သုံးပြီး — တခြား table တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ table တွေနဲ့ join လုပ်နိုင်ပါတယ်။ Join ရဲ့ inner side က — parallel worker တစ်ခုအတွင်း run လုပ်ဖို့ ဘေးကင်းသရွေ့ — planner က support လုပ်တဲ့ non-parallel plan မျိုး ဖြစ်နိုင်ပါတယ်။ Join အမျိုးအစားပေါ် မူတည်ပြီး — inner side က parallel plan တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။

- Nested loop join တစ်ခုမှာ — inner side က အမြဲတမ်း non-parallel ဖြစ်ပါတယ်။ အပြည့်အစုံ execute လုပ်ပေမယ့် — inner side က index scan ဖြစ်ရင် ဒါက ထိရောက်ပါတယ် — အကြောင်းက outer tuple တွေ (ဒါကြောင့် index ထဲမှာ တန်ဖိုး ရှာတဲ့ loop တွေ) ကို ပူးပေါင်း process တွေကြားမှာ ခွဲဝေထားလို့ပါ။
- Merge join တစ်ခုမှာ — inner side က အမြဲတမ်း non-parallel plan ဖြစ်ပြီး ဒါကြောင့် အပြည့်အစုံ execute လုပ်ပါတယ်။ ဒါက ထိရောက်မှု နည်းနိုင်ပါတယ် — အထူးသဖြင့် sort တစ်ခု လုပ်ရရင်ပါ — အကြောင်းက အလုပ်နဲ့ ရလာတဲ့ data က process တစ်ခုချင်းစီမှာ ထပ်တူပွား (duplicate) ဖြစ်နေလို့ပါ။
- Hash join တစ်ခုမှာ ("parallel" prefix မပါတဲ့) — inner side ကို process တစ်ခုချင်းစီက အပြည့်အစုံ execute လုပ်ပြီး hash table ရဲ့ ထပ်တူ မိတ္တူတွေ တည်ဆောက်ပါတယ်။ Hash table ကြီးရင် ဒါမှမဟုတ် plan က ကုန်ကျစရိတ် များရင် ဒါက ထိရောက်မှု နည်းနိုင်ပါတယ်။ Parallel hash join တစ်ခုမှာတော့ — inner side က parallel hash ဖြစ်ပြီး shared hash table တည်ဆောက်တဲ့ အလုပ်ကို ပူးပေါင်း process တွေကြားမှာ ခွဲဝေပါတယ်။

### 15.3.3. Parallel Aggregation (parallel aggregation / စုစည်း တွက်ချက်မှု)

PostgreSQL က parallel aggregation ကို အဆင့် နှစ်ဆင့်နဲ့ aggregate လုပ်ခြင်းအားဖြင့် support လုပ်ပါတယ်။ ပထမအဆင့်မှာ — query ရဲ့ parallel အပိုင်းမှာ ပါဝင်တဲ့ process တစ်ခုချင်းစီက aggregation အဆင့်တစ်ခုကို လုပ်ဆောင်ပြီး — အဲဒီ process သိတဲ့ group တစ်ခုချင်းစီအတွက် partial result (တစ်စိတ်တစ်ပိုင်း ရလဒ်) တစ်ခု ထုတ်ပါတယ်။ ဒါကို plan ထဲမှာ `Partial Aggregate` node အနေနဲ့ ထင်ဟပ်ပါတယ်။ ဒုတိယအဆင့်မှာ — partial result တွေကို `Gather` ဒါမှမဟုတ် `Gather Merge` ကတစ်ဆင့် leader ဆီ လွှဲပြောင်းပါတယ်။ နောက်ဆုံးမှာ — leader က worker အားလုံးဆီက ရလဒ်တွေကို ပြန်လည် aggregate လုပ်ပြီး နောက်ဆုံး ရလဒ်ကို ထုတ်ပါတယ်။ ဒါကို plan ထဲမှာ `Finalize Aggregate` node အနေနဲ့ ထင်ဟပ်ပါတယ်။

`Finalize Aggregate` node က leader process ပေါ်မှာ run လုပ်တာဖြစ်လို့ — input row အရေအတွက်နဲ့ နှိုင်းယှဉ်ရင် group အရေအတွက် အတော်များများ ထုတ်ပေးတဲ့ query တွေကို — query planner က အဆင်မပြေလှဘူးလို့ ရှုမြင်ပါလိမ့်မယ်။ ဥပမာ — အဆိုးဆုံး အခြေအနေမှာ `Finalize Aggregate` node မြင်ရတဲ့ group အရေအတွက်က — `Partial Aggregate` အဆင့်မှာ worker process အားလုံး မြင်ခဲ့ရတဲ့ input row အရေအတွက်အထိ ဖြစ်နိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ parallel aggregation သုံးလို့ performance အကျိုးအမြတ် ရမှာ မဟုတ်တာ ထင်ရှားပါတယ်။ Query planner က planning လုပ်ငန်းစဉ်အတွင်း ဒါကို ထည့်သွင်း စဉ်းစားပြီး — ဒီအခြေအနေမျိုးမှာ parallel aggregate ကို ရွေးချယ်ဖို့ များသောအားဖြင့် မလုပ်ပါဘူး။

Parallel aggregation ကို အခြေအနေ အားလုံးမှာ support လုပ်တာ မဟုတ်ပါဘူး။ Aggregate တစ်ခုချင်းစီက parallelism အတွက် [safe](/docs/postgresql/parallel-safety) ဖြစ်ရပြီး combine function တစ်ခု ရှိရပါမယ်။ Aggregate ရဲ့ transition state အမျိုးအစားက `internal` ဖြစ်ရင် — serialization နဲ့ deserialization function တွေ ရှိရပါမယ်။ အသေးစိတ်ကို [CREATE AGGREGATE](/docs/postgresql/sql-createaggregate) မှာ ကြည့်ပါ။ Aggregate function call တစ်ခုမှာ `DISTINCT` ဒါမှမဟုတ် `ORDER BY` clause ပါဝင်ရင် parallel aggregation ကို support မလုပ်ပါဘူး — ordered set aggregate တွေအတွက်လည်း support မလုပ်သလို — query မှာ `GROUPING SETS` ပါဝင်ရင်လည်း support မလုပ်ပါဘူး။ Query မှာ ပါဝင်တဲ့ join အားလုံးကလည်း plan ရဲ့ parallel အပိုင်းမှာ ပါဝင်မှသာ ဒါကို သုံးနိုင်ပါတယ်။

### 15.3.4. Parallel Append (parallel append)

PostgreSQL က source မျိုးစုံကနေ row တွေကို result set တစ်ခုတည်းအဖြစ် ပေါင်းစည်းဖို့ လိုတဲ့အခါတိုင်း `Append` ဒါမှမဟုတ် `MergeAppend` plan node ကို သုံးပါတယ်။ ဒါက `UNION ALL` ကို အကောင်အထည်ဖော်တဲ့အခါ ဒါမှမဟုတ် partitioned table တစ်ခုကို scan လုပ်တဲ့အခါ များသောအားဖြင့် ဖြစ်တတ်ပါတယ်။ ဒီလို node တွေကို တခြား plan တွေမှာလိုပဲ parallel plan တွေမှာ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် parallel plan တစ်ခုမှာတော့ planner က အဲဒီအစား `Parallel Append` node တစ်ခုကို သုံးနိုင်ပါတယ်။

`Append` node တစ်ခုကို parallel plan တစ်ခုမှာ သုံးတဲ့အခါ — process တစ်ခုချင်းစီက child plan တွေကို သူတို့ ပေါ်လာတဲ့ အစီအစဉ်အတိုင်း execute လုပ်ပါတယ်။ ဒါကြောင့် ပါဝင်တဲ့ process အားလုံးက ပူးပေါင်းပြီး ပထမ child plan ကို အပြီးသတ်သည်အထိ execute လုပ်ကြပြီး — ပြီးရင် ခန့်မှန်းတူ အချိန်တစ်ခုမှာ ဒုတိယ plan ဆီ ရွှေ့ကြပါတယ်။ အဲဒီအစား `Parallel Append` သုံးတဲ့အခါ — executor က ပါဝင်တဲ့ process တွေကို child plan တွေကြားမှာ တတ်နိုင်သမျှ ညီမျှအောင် ဖြန့်ခွဲပေးပါတယ်။ ဒါကြောင့် child plan အများအပြားကို တစ်ပြိုင်နက်တည်း execute လုပ်ပါတယ်။ ဒါက contention (အပြိုင်အဆိုင် ထိပါးမှု) ကို ရှောင်ရှားပေးပြီး — ဘယ်တုန်းမှ မလုပ်ဆောင်တဲ့ process တွေမှာ child plan တစ်ခုရဲ့ startup cost ကို ပေးဆပ်ရတာကိုလည်း ရှောင်ရှားပေးပါတယ်။

ဒါ့အပြင် — parallel plan တစ်ခုအတွင်းမှာ သုံးတဲ့အခါ partial child တွေသာ ရှိနိုင်တဲ့ သာမန် `Append` node နဲ့ မတူဘဲ — `Parallel Append` node တစ်ခုမှာတော့ partial child plan တွေရော non-partial child plan တွေပါ ရှိနိုင်ပါတယ်။ Non-partial child တွေကို process တစ်ခုတည်းကသာ scan လုပ်ပါတယ် — တစ်ကြိမ်ထက် ပိုပြီး scan လုပ်ရင် ရလဒ်တွေ ထပ်တူပွား (duplicate) ဖြစ်လာမှာမို့ပါ။ ဒါကြောင့် result set မျိုးစုံကို append လုပ်တဲ့ plan တွေက — ထိရောက်တဲ့ partial plan တွေ မရနိုင်တဲ့အခါမှာတောင် — coarse-grained parallelism (အကြမ်းစား parallel လုပ်ဆောင်မှု) ကို ရရှိနိုင်ပါတယ်။ ဥပမာ — parallel scan တွေကို support မလုပ်တဲ့ index တစ်ခုကို သုံးမှသာ ထိရောက်စွာ အကောင်အထည်ဖော်နိုင်တဲ့ partitioned table တစ်ခုအပေါ် query တစ်ခုကို စဉ်းစားကြည့်ပါ။ Planner က သာမန် `Index Scan` plan တွေရဲ့ `Parallel Append` တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်; index scan တစ်ခုချင်းစီကို process တစ်ခုတည်းက အပြီးသတ် execute လုပ်ရမှာဖြစ်ပေမယ့် — မတူတဲ့ scan တွေကို မတူတဲ့ process တွေက တစ်ချိန်တည်းမှာ လုပ်ဆောင်နိုင်ပါတယ်။

[enable_parallel_append](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-PARALLEL-APPEND) ကို သုံးပြီး ဒီ feature ကို disable လုပ်နိုင်ပါတယ်။

### 15.3.5. Parallel Plan Tips (parallel plan အတွက် အကြံပြုချက်များ)

Parallel plan ထုတ်ပေးမယ်လို့ မျှော်လင့်ရတဲ့ query တစ်ခုက မထုတ်ပေးရင် — [parallel_setup_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-PARALLEL-SETUP-COST) ဒါမှမဟုတ် [parallel_tuple_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-PARALLEL-TUPLE-COST) ကို လျှော့ချ ကြည့်နိုင်ပါတယ်။ တကယ်တော့ — ဒီ plan က planner ပိုနှစ်သက်ခဲ့တဲ့ serial plan ထက် နှေးသွားနိုင်ပါတယ် — ဒါပေမယ့် အမြဲတမ်းတော့ ဒီလို ဖြစ်မှာ မဟုတ်ပါဘူး။ ဒီ setting တွေကို အလွန်သေးငယ်တဲ့ တန်ဖိုးတွေ သတ်မှတ်ပေမယ့် (ဥပမာ — နှစ်ခုလုံးကို သုည သတ်မှတ်ပြီးတာပင်) parallel plan မရဘူးဆိုရင် — query planner က သင့် query အတွက် parallel plan မထုတ်နိုင်တဲ့ အကြောင်းရင်း တစ်ခုခု ရှိနိုင်ပါတယ်။ ဘာကြောင့် ဒီလို ဖြစ်နိုင်တယ်ဆိုတဲ့ အချက်အလက်အတွက် [အပိုင်း 15.2](/docs/postgresql/when-can-parallel-query-be-used) နဲ့ [အပိုင်း 15.4](/docs/postgresql/parallel-safety) ကို ကြည့်ပါ။

Parallel plan တစ်ခုကို execute လုပ်တဲ့အခါ — `EXPLAIN (ANALYZE, VERBOSE)` ကို သုံးပြီး plan node တစ်ခုချင်းစီအတွက် per-worker statistics တွေကို ပြသနိုင်ပါတယ်။ ဒါက — အလုပ်တွေက plan node အားလုံးကြားမှာ ညီမျှစွာ ခွဲဝေနေခြင်း ရှိမရှိ ဆုံးဖြတ်ရာမှာ အသုံးဝင်နိုင်ပြီး — ယေဘုယျအားဖြင့်လည်း plan ရဲ့ performance လက္ခဏာတွေကို နားလည်ရာမှာ အထောက်အကူ ဖြစ်ပါတယ်။
