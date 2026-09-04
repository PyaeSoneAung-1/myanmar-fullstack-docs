---
title: "CLUSTER (table ကို index အစီအစဉ်အတိုင်း ပြန်လည်စီစဉ်ခြင်း)"
description: "Table တစ်ခုကို index တစ်ခုအပေါ် အခြေခံပြီး ရုပ်ပိုင်းဆိုင်ရာအရ ပြန်လည်စီစဉ်ခြင်း (clustering) ပြုလုပ်ပေးတဲ့ command — table ကို နောက်ပိုင်း update လုပ်ပါက အစီအစဉ်ကို ထိန်းသိမ်းမပေးတော့ခြင်း၊ ACCESS EXCLUSIVE lock ရယူခြင်း၊ parameters များ၊ fillfactor / maintenance_work_mem / ANALYZE ဆိုင်ရာ အကြံပြုချက်များနှင့် partitioned tables အကြောင်း အသေးစိတ် ပါဝင်သည်"
order: 180
source: "https://www.postgresql.org/docs/current/sql-cluster.html"
status: translated
updated: 2026-09-04
---

## CLUSTER (table ကို index အစီအစဉ်အတိုင်း ပြန်လည်စီစဉ်ခြင်း)

CLUSTER — table တစ်ခုကို index တစ်ခုအရ စုစည်း (cluster) ပြုလုပ်ပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CLUSTER [ ( option [, ...] ) ] [ table_name [ USING index_name ] ]

where option can be one of:

    VERBOSE [ boolean ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CLUSTER` က PostgreSQL ကို ညွှန်ကြားပြီး — `index_name` နဲ့ သတ်မှတ်ထားတဲ့ index ကို အခြေခံကာ — `table_name` နဲ့ သတ်မှတ်ထားတဲ့ table ကို စုစည်း (cluster) စေပါတယ်။ Index က `table_name` ပေါ်မှာ ကြိုပြီး သတ်မှတ်ထားပြီးသား ဖြစ်ရပါမယ်။

Table တစ်ခုကို cluster လုပ်လိုက်တဲ့အခါ — index ရဲ့ အချက်အလက်တွေကို အခြေခံပြီး — ၎င်းကို ရုပ်ပိုင်းဆိုင်ရာအရ (physically) ပြန်လည်စီစဉ်ခံရပါတယ်။ Clustering က တစ်ကြိမ်တည်းသာ လုပ်ဆောင်တဲ့ operation တစ်ခုပါ: နောက်ပိုင်း table ကို update လုပ်တဲ့အခါ — အပြောင်းအလဲတွေကိုတော့ cluster လုပ်ပေးမှာ မဟုတ်ပါဘူး။ ဆိုလိုတာက — rows အသစ် သို့မဟုတ် update လုပ်ထားတဲ့ rows တွေကို သူတို့ရဲ့ index အစီအစဉ်အတိုင်း သိမ်းဆည်းဖို့ ကြိုးပမ်းမှု မရှိပါဘူး။ (လိုချင်ရင် — command ကို နောက်တစ်ကြိမ် ထုတ်ပြန်ခြင်းအားဖြင့် — အခါအားလျော်စွာ recluster လုပ်နိုင်ပါတယ်။ ဒါ့အပြင် — table ရဲ့ `fillfactor` storage parameter ကို 100% အောက် သတ်မှတ်ထားခြင်းက — update လုပ်ထားတဲ့ rows တွေကို အဲဒီမှာ နေရာ အလုံအလောက် ရှိနေရင် တူညီတဲ့ page ပေါ်မှာ ထိန်းသိမ်းထားတာမို့ — updates တွေအတွင်း cluster အစီအစဉ်ကို ထိန်းသိမ်းဖို့ အထောက်အကူ ဖြစ်စေနိုင်ပါတယ်။)

Table တစ်ခုကို cluster လုပ်လိုက်တဲ့အခါ — PostgreSQL က ဘယ် index နဲ့ cluster လုပ်ခဲ့လဲဆိုတာကို မှတ်မိထားပါတယ်။ `CLUSTER table_name` ပုံစံက — အရင်က သုံးခဲ့တဲ့ index တစ်ခုတည်းကိုပဲ သုံးပြီး — table ကို recluster လုပ်ပါတယ်။ နောက်ထပ် cluster operations တွေအတွက် သုံးမယ့် index ကို သတ်မှတ်ဖို့ ဒါမှမဟုတ် — အရင်က သတ်မှတ်ချက် တစ်ခုခုကို ရှင်းလင်းဖို့ — [`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) ရဲ့ `CLUSTER` သို့မဟုတ် `SET WITHOUT CLUSTER` ပုံစံတွေကိုလည်း သုံးနိုင်ပါတယ်။

`table_name` မပါတဲ့ `CLUSTER` က — current database ထဲမှာ အရင်က cluster လုပ်ထားဖူးပြီး — ခေါ်ယူသုံးစွဲသူ (calling user) မှာ privileges ရှိတဲ့ — tables တွေ အားလုံးကို recluster လုပ်ပါတယ်။ ဒီ `CLUSTER` ပုံစံကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

Table တစ်ခုကို cluster လုပ်နေတဲ့အခါ — ၎င်းပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။ ဒါက `CLUSTER` ပြီးဆုံးတဲ့အထိ — တခြား database operations တွေ (read ရော write ပါ) ကို — အဲဒီ table ပေါ်မှာ လုပ်ဆောင်ခြင်းကနေ တားဆီးပေးပါတယ်။

## Parameters (parameter များ)

- **table_name** — Table တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်)။
- **index_name** — Index တစ်ခုရဲ့ နာမည်။
- **VERBOSE** — Table တစ်ခုချင်းစီကို cluster လုပ်လိုက်တိုင်း — INFO level မှာ — တိုးတက်မှု အစီရင်ခံစာ (progress report) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **boolean** — ရွေးချယ်ထားတဲ့ option ကို ဖွင့်မလား ပိတ်မလား သတ်မှတ်ပေးပါတယ်။ Option ကို enable လုပ်ဖို့ TRUE, ON သို့မဟုတ် 1 ကို ရေးနိုင်ပြီး — disable လုပ်ဖို့ FALSE, OFF သို့မဟုတ် 0 ကို ရေးနိုင်ပါတယ်။ Boolean တန်ဖိုးကို ချန်လှပ်ထားလို့လည်း ရပြီး — အဲဒီအခါမှာ TRUE လို့ ယူဆပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုကို cluster လုပ်ဖို့အတွက် — အဲဒီ table ပေါ်မှာ `MAINTAIN` privilege ရှိရပါမယ်။

Table တစ်ခုအတွင်းမှာ rows တစ်ခုချင်းစီကို ကျပန်း (randomly) ဝင်ရောက်ကြည့်ရှုနေတဲ့ ကိစ္စတွေမှာ — table ထဲက ဒေတာရဲ့ တကယ့် အစီအစဉ်က အရေးမကြီးပါဘူး။ ဒါပေမယ့် — တခြား ဒေတာတွေထက် အချို့ဒေတာကို ပိုပြီး ဝင်ရောက်ကြည့်ရှုတတ်ပြီး — အဲဒါတွေကို အတူတကွ စုစည်းပေးတဲ့ index တစ်ခု ရှိနေရင် — `CLUSTER` ကို သုံးခြင်းက အကျိုးရှိပါလိမ့်မယ်။ Table တစ်ခုကနေ indexed values တွေရဲ့ range တစ်ခုကို တောင်းဆိုနေတာပဲဖြစ်ဖြစ် — rows အများအပြားနဲ့ ကိုက်ညီတဲ့ single indexed value တစ်ခုကို တောင်းဆိုနေတာပဲဖြစ်ဖြစ် — `CLUSTER` က အထောက်အကူ ဖြစ်ပါလိမ့်မယ်။ အကြောင်းကတော့ — index က ကိုက်ညီတဲ့ ပထမဆုံး row အတွက် table page ကို ဖော်ထုတ်လိုက်တာနဲ့ — ကိုက်ညီတဲ့ တခြား rows တွေ အားလုံးကလည်း — table page တစ်ခုတည်းပေါ်မှာပဲ ရှိနေနိုင်ခြေ များပြီး — အဲဒါကြောင့် disk accesses တွေ သက်သာကာ — query ကို မြန်ဆန်စေပါတယ်။

`CLUSTER` က — သတ်မှတ်ထားတဲ့ index ပေါ်မှာ index scan တစ်ခုကို သုံးပြီးဖြစ်စေ — (index က b-tree တစ်ခုဆိုရင်) sequential scan တစ်ခုနဲ့ ၎င်းနောက် sorting တစ်ခုကို သုံးပြီးဖြစ်စေ — table ကို ပြန်လည် စီစဉ်နိုင်ပါတယ်။ Planner ရဲ့ cost parameters တွေနဲ့ ရရှိနိုင်တဲ့ statistical information တွေကို အခြေခံပြီး — ပိုမြန်ဆန်မယ့် method ကို ရွေးချယ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

`CLUSTER` လုပ်ဆောင်နေစဉ်အတွင်း — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။

Index scan တစ်ခုကို သုံးတဲ့အခါ — index အစီအစဉ်အတိုင်း table data တွေ ပါဝင်တဲ့ — table ရဲ့ ယာယီမိတ္တူ (temporary copy) တစ်ခုကို ဖန်တီးပါတယ်။ Table ပေါ်က index တစ်ခုချင်းစီရဲ့ ယာယီမိတ္တူတွေကိုလည်း ဖန်တီးပါတယ်။ ဒါကြောင့် — table ရဲ့ အရွယ်အစားနဲ့ index တွေရဲ့ အရွယ်အစားတွေ ပေါင်းထားတာနဲ့ အနည်းဆုံး ညီမျှတဲ့ — disk ပေါ်က ဖရီး space (နေရာလွတ်) လိုအပ်ပါတယ်။

Sequential scan နဲ့ sort တစ်ခုကို သုံးတဲ့အခါ — ယာယီ sort file တစ်ခုကိုလည်း ဖန်တီးပါတယ်; ဒါကြောင့် — အမြင့်ဆုံး (peak) ယာယီနေရာ လိုအပ်ချက်က — table အရွယ်အစားရဲ့ နှစ်ဆအထိ ဖြစ်နိုင်ပြီး — index အရွယ်အစားတွေကိုပါ ပေါင်းထည့်ရပါတယ်။ ဒီ method က index scan method ထက် မကြာခဏ ပိုမြန်ပါတယ်; ဒါပေမယ့် — disk space လိုအပ်ချက်က သည်းမခံနိုင်လောက်အောင် ဖြစ်နေရင် — [enable_sort](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-SORT) ကို ယာယီ `off` လို့ သတ်မှတ်ခြင်းအားဖြင့် — ဒီရွေးချယ်မှုကို disable လုပ်နိုင်ပါတယ်။

Cluster မလုပ်ခင် — [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) ကို — ကျိုးကြောင်းဆီလျော်လောက်တဲ့ ကြီးမားတဲ့ တန်ဖိုးတစ်ခု (ဒါပေမယ့် `CLUSTER` operation အတွက် သင်မြှုပ်နှံထားနိုင်တဲ့ RAM ပမာဏထက် မပိုရပါဘူး) အဖြစ် — သတ်မှတ်ထားဖို့ အကြံပြုလိုပါတယ်။

Planner က tables တွေရဲ့ အစီအစဉ် (ordering) နဲ့ ပတ်သက်တဲ့ statistics တွေကို မှတ်တမ်းတင်ထားတာမို့ — cluster လုပ်ပြီးစ table အသစ်ပေါ်မှာ [`ANALYZE`](/docs/postgresql/sql-analyze) ကို run လုပ်ဖို့ အကြံပြုပါတယ်။ မဟုတ်ရင် — planner က query plans တွေအတွက် ညံ့ဖျင်းတဲ့ ရွေးချယ်မှုတွေ ပြုလုပ်မိနိုင်ပါတယ်။

`CLUSTER` က ဘယ် indexes တွေကို cluster လုပ်ထားလဲဆိုတာကို မှတ်မိထားတာမို့ — လိုချင်တဲ့ tables တွေကို ပထမအကြိမ် ကိုယ်တိုင် (manually) cluster လုပ်ပြီး — နောက်ပိုင်းမှာ parameter တွေ ဘာမှ မပါဘဲ `CLUSTER` ကို execute လုပ်တဲ့ — periodic maintenance script တစ်ခုကို တည်ဆောက်ထားနိုင်ပါတယ်; အဲဒါဆိုရင် လိုချင်တဲ့ tables တွေကို အခါအားလျော်စွာ recluster လုပ်ပေးနေမှာ ဖြစ်ပါတယ်။

`CLUSTER` ကို run လုပ်နေတဲ့ backend တစ်ခုချင်းစီကလည်း — သူ့ရဲ့ တိုးတက်မှုကို `pg_stat_progress_cluster` view ထဲမှာ အစီရင်ခံပါလိမ့်မယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.4.2](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING) ကို ကြည့်ပါ။

Partitioned table တစ်ခုကို cluster လုပ်ခြင်းက — သတ်မှတ်ထားတဲ့ partitioned index ရဲ့ partition ကို သုံးပြီး — ၎င်းရဲ့ partitions တစ်ခုချင်းစီကို cluster လုပ်ပေးပါတယ်။ Partitioned table တစ်ခုကို cluster လုပ်တဲ့အခါ — index ကို ချန်လှပ်ထားလို့ မရပါဘူး။ Partitioned table တစ်ခုပေါ်မှာ `CLUSTER` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

## Examples (ဥပမာများ)

`employees` table ကို — ၎င်းရဲ့ `employees_ind` index ကို အခြေခံပြီး — cluster လုပ်ရန်:

```sql
CLUSTER employees USING employees_ind;
```

အရင်က သုံးခဲ့တဲ့ index တစ်ခုတည်းကိုပဲ သုံးပြီး `employees` table ကို cluster လုပ်ရန်:

```sql
CLUSTER employees;
```

Database ထဲမှာ အရင်က cluster လုပ်ထားဖူးတဲ့ tables တွေ အားလုံးကို cluster လုပ်ရန်:

```sql
CLUSTER;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `CLUSTER` statement တစ်ခု မရှိပါဘူး။

PostgreSQL 17 မတိုင်ခင် အသုံးပြုခဲ့တဲ့ အောက်ပါ syntax ကို အခုထိ ထောက်ပံ့ပေးနေဆဲ ဖြစ်ပါတယ်:

```sql
CLUSTER [ VERBOSE ] [ table_name [ USING index_name ] ]
```

PostgreSQL 8.3 မတိုင်ခင် အသုံးပြုခဲ့တဲ့ အောက်ပါ syntax ကို အခုထိ ထောက်ပံ့ပေးနေဆဲ ဖြစ်ပါတယ်:

```sql
CLUSTER index_name ON table_name
```

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[clusterdb](https://www.postgresql.org/docs/current/app-clusterdb.html), [အပိုင်း 27.4.2](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING)
