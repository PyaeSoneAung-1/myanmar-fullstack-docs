---
title: "Progress Reporting (လုပ်ဆောင်မှု တိုးတက်မှု အစီရင်ခံခြင်း)"
description: "PostgreSQL command များ လုပ်ဆောင်နေစဉ်အတွင်း ၎င်းတို့၏ တိုးတက်မှု (progress) ကို အစီရင်ခံပေးသည့် ယန္တရားအကြောင်း — ANALYZE (pg_stat_progress_analyze view ၏ columns များနှင့် ANALYZE phases), CLUSTER နှင့် VACUUM FULL (pg_stat_progress_cluster), COPY (pg_stat_progress_copy), CREATE INDEX/REINDEX (pg_stat_progress_create_index), VACUUM (pg_stat_progress_vacuum) နှင့် Base Backup (pg_stat_progress_basebackup) တို့၏ progress reporting — view တစ်ခုချင်းစီ၏ column များ၊ type များနှင့် အဓိပ္ပာယ် ဖော်ဆောင်ပုံ၊ phase တစ်ခုချင်းစီ၏ ဖော်ပြချက်"
order: 218
source: "https://www.postgresql.org/docs/current/progress-reporting.html"
status: translated
updated: 2026-09-06
---

## 27.4. Progress Reporting (လုပ်ဆောင်မှု တိုးတက်မှု အစီရင်ခံခြင်း)

- **27.4.1. ANALYZE Progress Reporting (ANALYZE ၏ progress အစီရင်ခံခြင်း)**
- **27.4.2. CLUSTER Progress Reporting (CLUSTER ၏ progress အစီရင်ခံခြင်း)**
- **27.4.3. COPY Progress Reporting (COPY ၏ progress အစီရင်ခံခြင်း)**
- **27.4.4. CREATE INDEX Progress Reporting (CREATE INDEX ၏ progress အစီရင်ခံခြင်း)**
- **27.4.5. VACUUM Progress Reporting (VACUUM ၏ progress အစီရင်ခံခြင်း)**
- **27.4.6. Base Backup Progress Reporting (base backup ၏ progress အစီရင်ခံခြင်း)**

PostgreSQL မှာ — command တချို့ လုပ်ဆောင်နေတဲ့ အတောအတွင်းမှာ — ၎င်းတို့ရဲ့ တိုးတက်မှု (progress) ကို အစီရင်ခံနိုင်တဲ့ စွမ်းရည် တစ်ခု ရှိပါတယ်။ လက်ရှိမှာ progress reporting ကို ထောက်ပံ့ပေးတဲ့ command တွေကတော့ `ANALYZE`, `CLUSTER`, `CREATE INDEX`, `VACUUM`, `COPY` နဲ့ [BASE_BACKUP](https://www.postgresql.org/docs/current/protocol-replication.html#PROTOCOL-REPLICATION-BASE-BACKUP) (ဆိုလိုတာက — base backup (အခြေခံ backup) တစ်ခု ယူဖို့ [pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html) က ထုတ်ပြန်တဲ့ replication command) တို့ပဲ ဖြစ်ပါတယ်။ ဒါက အနာဂတ်မှာ ထပ်မံ တိုးချဲ့နိုင်ခြေ ရှိပါတယ်။

### 27.4.1. ANALYZE Progress Reporting (ANALYZE ၏ progress အစီရင်ခံခြင်း)

`ANALYZE` run လုပ်နေချိန်တိုင်း — `pg_stat_progress_analyze` view ထဲမှာ — အဲဒီ command ကို လက်ရှိ run နေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါဝင်ပါလိမ့်မယ်။ အောက်က ဇယားတွေက — အစီရင်ခံမယ့် အချက်အလက်တွေကို ဖော်ပြပြီး — အဲဒါတွေကို ဘယ်လို အဓိပ္ပာယ် ဖော်ဆောင်ရမလဲဆိုတာနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေကိုလည်း ပေးပါတယ်။

**ဇယား 27.38. pg_stat_progress_analyze View**

| Column Type ဖော်ပြချက် |
| --- |
| pid integer Backend ၏ process ID ။ |
| datid oid ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ OID ။ |
| datname name ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ နာမည် ။ |
| relid oid Analyze လုပ်နေတဲ့ table ရဲ့ OID ။ |
| phase text လက်ရှိ ဆောင်ရွက်နေတဲ့ phase ။ Table 27.39 ကို ကြည့်ပါ။ |
| sample_blks_total bigint Sample လုပ်မယ့် heap blocks စုစုပေါင်း အရေအတွက် ။ |
| sample_blks_scanned bigint Scan လုပ်ပြီးသား heap blocks အရေအတွက် ။ |
| ext_stats_total bigint Extended statistics (တိုးချဲ့ စာရင်းအင်းများ) အရေအတွက် ။ |
| ext_stats_computed bigint တွက်ချက်ပြီးသား extended statistics အရေအတွက် ။ ဒီ counter က — phase က computing extended statistics ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| child_tables_total bigint Child tables (ကလေး table များ) အရေအတွက် ။ |
| child_tables_done bigint Scan လုပ်ပြီးသား child tables အရေအတွက် ။ ဒီ counter က — phase က acquiring inherited sample rows ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| current_child_table_relid oid လက်ရှိ scan လုပ်နေတဲ့ child table ရဲ့ OID ။ ဒီ field က — phase က acquiring inherited sample rows ဖြစ်နေချိန်မှာပဲ — တရားဝင် (valid) ပါတယ်။ |
| delay_time double precision Cost-based delay (ကုန်ကျစရိတ် အခြေခံ နှောင့်နှေးမှု) ကြောင့် အိပ်စက် (sleep) လုပ်ရတဲ့ စုစုပေါင်း အချိန် (အပိုင်း 19.10.2 ကို ကြည့်ပါ) — milliseconds နဲ့ (track_cost_delay_timing ကို enable လုပ်ထားရင်; မဟုတ်ရင် သုည)။ |

**ဇယား 27.39. ANALYZE Phases (ANALYZE ၏ phase များ)**

| Phase | ဖော်ပြချက် |
| --- | --- |
| `initializing` | Command က heap ကို scan လုပ်ဖို့ စတင် ပြင်ဆင်နေပါတယ်။ ဒီ phase က အလွန် တိုတောင်းမယ်လို့ မျှော်လင့်ရပါတယ်။ |
| `acquiring sample rows` | Command က sample rows (နမူနာ rows) တွေ ရယူဖို့ — `relid` က ပေးတဲ့ table ကို လက်ရှိ scan လုပ်နေပါတယ်။ |
| `acquiring inherited sample rows` | Command က sample rows တွေ ရယူဖို့ — child tables တွေကို လက်ရှိ scan လုပ်နေပါတယ်။ `child_tables_total`, `child_tables_done` နဲ့ `current_child_table_relid` columns တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `computing statistics` | Command က — table scan အတွင်း ရယူထားတဲ့ sample rows တွေကနေ — statistics တွေကို လက်ရှိ တွက်ချက်နေပါတယ်။ |
| `computing extended statistics` | Command က — table scan အတွင်း ရယူထားတဲ့ sample rows တွေကနေ — extended statistics တွေကို လက်ရှိ တွက်ချက်နေပါတယ်။ |
| `finalizing analyze` | Command က `pg_class` ကို update လုပ်နေပါတယ်။ ဒီ phase ပြီးဆုံးတာနဲ့ — `ANALYZE` က အဆုံးသတ်ပါလိမ့်မယ်။ |

> **မှတ်ချက်:** `ANALYZE` ကို `ONLY` keyword မပါဘဲ partitioned table (partition ခွဲထားသော table) တစ်ခုပေါ်မှာ run လုပ်တဲ့အခါ — ၎င်းရဲ့ partitions တွေ အားလုံးကိုလည်း ထပ်ဆင့် (recursively) analyze လုပ်ပါတယ်။ အဲဒီကိစ္စမှာ — `ANALYZE` ရဲ့ progress ကို — အရင်ဆုံး parent table အတွက် အစီရင်ခံပြီး — အဲဒီမှာ ၎င်းရဲ့ inheritance statistics တွေကို စုဆောင်းပါတယ် — နောက်မှ partition တစ်ခုချင်းစီအတွက် ဆက်ပြီး အစီရင်ခံပါတယ်။

### 27.4.2. CLUSTER Progress Reporting (CLUSTER ၏ progress အစီရင်ခံခြင်း)

`CLUSTER` ဒါမှမဟုတ် `VACUUM FULL` run လုပ်နေချိန်တိုင်း — `pg_stat_progress_cluster` view ထဲမှာ — command နှစ်ခုထဲက တစ်ခုခုကို လက်ရှိ run နေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါဝင်ပါလိမ့်မယ်။ အောက်က ဇယားတွေက — အစီရင်ခံမယ့် အချက်အလက်တွေကို ဖော်ပြပြီး — အဲဒါတွေကို ဘယ်လို အဓိပ္ပာယ် ဖော်ဆောင်ရမလဲဆိုတာနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေကိုလည်း ပေးပါတယ်။

**ဇယား 27.40. pg_stat_progress_cluster View**

| Column Type ဖော်ပြချက် |
| --- |
| pid integer Backend ၏ process ID ။ |
| datid oid ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ OID ။ |
| datname name ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ နာမည် ။ |
| relid oid Cluster လုပ်နေတဲ့ table ရဲ့ OID ။ |
| command text Run လုပ်နေတဲ့ command ။ CLUSTER ဒါမှမဟုတ် VACUUM FULL ဖြစ်ပါတယ်။ |
| phase text လက်ရှိ ဆောင်ရွက်နေတဲ့ phase ။ Table 27.41 ကို ကြည့်ပါ။ |
| cluster_index_relid oid Table ကို index တစ်ခု သုံးပြီး scan လုပ်နေတယ်ဆိုရင် — ဒါက အသုံးပြုနေတဲ့ index ရဲ့ OID ဖြစ်ပြီး — မဟုတ်ရင် သုည ဖြစ်ပါတယ်။ |
| heap_tuples_scanned bigint Scan လုပ်ပြီးသား heap tuples အရေအတွက် ။ ဒီ counter က — phase က seq scanning heap, index scanning heap ဒါမှမဟုတ် writing new heap ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| heap_tuples_written bigint ရေးသားပြီးသား heap tuples အရေအတွက် ။ ဒီ counter က — phase က seq scanning heap, index scanning heap ဒါမှမဟုတ် writing new heap ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| heap_blks_total bigint Table ထဲက heap blocks စုစုပေါင်း အရေအတွက် ။ ဒီဂဏန်းကို seq scanning heap ရဲ့ အစမှာ အစီရင်ခံပါတယ်။ |
| heap_blks_scanned bigint Scan လုပ်ပြီးသား heap blocks အရေအတွက် ။ ဒီ counter က — phase က seq scanning heap ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| index_rebuild_count bigint ပြန်လည် တည်ဆောက်ပြီးသား indexes အရေအတွက် ။ ဒီ counter က — phase က rebuilding index ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |

**ဇယား 27.41. CLUSTER and VACUUM FULL Phases (CLUSTER နှင့် VACUUM FULL ၏ phase များ)**

| Phase | ဖော်ပြချက် |
| --- | --- |
| `initializing` | Command က heap ကို scan လုပ်ဖို့ စတင် ပြင်ဆင်နေပါတယ်။ ဒီ phase က အလွန် တိုတောင်းမယ်လို့ မျှော်လင့်ရပါတယ်။ |
| `seq scanning heap` | Command က sequential scan (အစဉ်လိုက် scan) သုံးပြီး table ကို လက်ရှိ scan လုပ်နေပါတယ်။ |
| `index scanning heap` | `CLUSTER` က index scan သုံးပြီး table ကို လက်ရှိ scan လုပ်နေပါတယ်။ |
| `sorting tuples` | `CLUSTER` က tuples တွေကို လက်ရှိ စီခွဲ (sort) နေပါတယ်။ |
| `writing new heap` | `CLUSTER` က new heap (heap အသစ်) ကို လက်ရှိ ရေးသားနေပါတယ်။ |
| `swapping relation files` | Command က အသစ် တည်ဆောက်ထားတဲ့ ဖိုင်တွေကို နေရာချ (swap into place) လုပ်နေပါတယ်။ |
| `rebuilding index` | Command က index တစ်ခုကို လက်ရှိ ပြန်လည် တည်ဆောက်နေပါတယ်။ |
| `performing final cleanup` | Command က နောက်ဆုံး သန့်ရှင်းရေး (final cleanup) ကို လုပ်ဆောင်နေပါတယ်။ ဒီ phase ပြီးဆုံးတာနဲ့ — `CLUSTER` ဒါမှမဟုတ် `VACUUM FULL` က အဆုံးသတ်ပါလိမ့်မယ်။ |

### 27.4.3. COPY Progress Reporting (COPY ၏ progress အစီရင်ခံခြင်း)

`COPY` run လုပ်နေချိန်တိုင်း — `pg_stat_progress_copy` view ထဲမှာ — `COPY` command တစ်ခုကို လက်ရှိ run နေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါဝင်ပါလိမ့်မယ်။ အောက်က ဇယားက — အစီရင်ခံမယ့် အချက်အလက်တွေကို ဖော်ပြပြီး — အဲဒါတွေကို ဘယ်လို အဓိပ္ပာယ် ဖော်ဆောင်ရမလဲဆိုတာနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေကိုလည်း ပေးပါတယ်။

**ဇယား 27.42. pg_stat_progress_copy View**

| Column Type ဖော်ပြချက် |
| --- |
| pid integer Backend ၏ process ID ။ |
| datid oid ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ OID ။ |
| datname name ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ နာမည် ။ |
| relid oid COPY command ကို execute လုပ်နေတဲ့ table ရဲ့ OID ။ SELECT query တစ်ခုကနေ ကူးယူ (copy) နေတယ်ဆိုရင် 0 လို့ သတ်မှတ်ထားပါတယ်။ |
| command text Run လုပ်နေတဲ့ command: COPY FROM ဒါမှမဟုတ် COPY TO ။ |
| type text Data တွေကို ဖတ်တဲ့/ရေးတဲ့ I/O type: FILE, PROGRAM, PIPE (COPY FROM STDIN နဲ့ COPY TO STDOUT အတွက်) ဒါမှမဟုတ် CALLBACK (ဥပမာ — logical replication (logical ပုံတူပွားမှု) ထဲမှာ ကနဦး table synchronization (table ထပ်တူပြု ညှိယူခြင်း) လုပ်နေစဉ် သုံးပါတယ်)။ |
| bytes_processed bigint COPY command က လုပ်ဆောင်ပြီးသား bytes အရေအတွက် ။ |
| bytes_total bigint COPY FROM command အတွက် source ဖိုင် ရဲ့ အရွယ်အစား — bytes နဲ့ ။ မရနိုင်ဘူးဆိုရင် 0 လို့ သတ်မှတ်ထားပါတယ်။ |
| tuples_processed bigint COPY command က လုပ်ဆောင်ပြီးသား tuples အရေအတွက် ။ |
| tuples_excluded bigint COPY command ရဲ့ WHERE clause က ဖယ်ထုတ်လိုက်လို့ လုပ်ဆောင်မှု မပြုလုပ်ရတဲ့ tuples အရေအတွက် ။ |
| tuples_skipped bigint Malformed data (ပုံမမှန် ဒေတာ) တွေ ပါဝင်လို့ skip လုပ်လိုက်ရတဲ့ tuples အရေအတွက် ။ ဒီ counter က — ON_ERROR option မှာ stop ကလွဲပြီး တခြား တန်ဖိုး တစ်ခုခု သတ်မှတ်ထားမှသာ — တိုးတက်ပါတယ်။ |

### 27.4.4. CREATE INDEX Progress Reporting (CREATE INDEX ၏ progress အစီရင်ခံခြင်း)

`CREATE INDEX` ဒါမှမဟုတ် `REINDEX` run လုပ်နေချိန်တိုင်း — `pg_stat_progress_create_index` view ထဲမှာ — လက်ရှိ indexes တွေ ဖန်တီးနေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါဝင်ပါလိမ့်မယ်။ အောက်က ဇယားတွေက — အစီရင်ခံမယ့် အချက်အလက်တွေကို ဖော်ပြပြီး — အဲဒါတွေကို ဘယ်လို အဓိပ္ပာယ် ဖော်ဆောင်ရမလဲဆိုတာနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေကိုလည်း ပေးပါတယ်။

**ဇယား 27.43. pg_stat_progress_create_index View**

| Column Type ဖော်ပြချက် |
| --- |
| pid integer Indexes တွေ ဖန်တီးနေတဲ့ backend ရဲ့ process ID ။ |
| datid oid ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ OID ။ |
| datname name ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ နာမည် ။ |
| relid oid Index ကို ဖန်တီးနေတဲ့ table ရဲ့ OID ။ |
| index_relid oid ဖန်တီးနေတဲ့ ဒါမှမဟုတ် reindex လုပ်နေတဲ့ index ရဲ့ OID ။ Non-concurrent CREATE INDEX လုပ်နေစဉ်မှာတော့ ဒါက 0 ဖြစ်ပါတယ်။ |
| command text တိကျတဲ့ command type: CREATE INDEX, CREATE INDEX CONCURRENTLY, REINDEX ဒါမှမဟုတ် REINDEX CONCURRENTLY ။ |
| phase text Index ဖန်တီးမှုရဲ့ လက်ရှိ ဆောင်ရွက်နေတဲ့ phase ။ Table 27.44 ကို ကြည့်ပါ။ |
| lockers_total bigint သက်ဆိုင်ရင် — စောင့်ဆိုင်းရမယ့် lockers (lock ကိုင်ထားသူများ) စုစုပေါင်း အရေအတွက် ။ |
| lockers_done bigint စောင့်ဆိုင်းပြီးသား lockers အရေအတွက် ။ |
| current_locker_pid bigint လက်ရှိ စောင့်ဆိုင်းနေတဲ့ locker ရဲ့ process ID ။ |
| blocks_total bigint လက်ရှိ phase မှာ လုပ်ဆောင်ရမယ့် blocks စုစုပေါင်း အရေအတွက် ။ |
| blocks_done bigint လက်ရှိ phase မှာ လုပ်ဆောင်ပြီးသား blocks အရေအတွက် ။ |
| tuples_total bigint လက်ရှိ phase မှာ လုပ်ဆောင်ရမယ့် tuples စုစုပေါင်း အရေအတွက် ။ |
| tuples_done bigint လက်ရှိ phase မှာ လုပ်ဆောင်ပြီးသား tuples အရေအတွက် ။ |
| partitions_total bigint Index ကို ဖန်တီးမယ့် ဒါမှမဟုတ် attach (တွဲချိတ်) လုပ်မယ့် partitions စုစုပေါင်း အရေအတွက် — direct နဲ့ indirect partitions နှစ်မျိုးလုံး အပါအဝင် ။ REINDEX လုပ်နေစဉ် ဒါမှမဟုတ် index က partitioned မဟုတ်တဲ့အခါ 0 ဖြစ်ပါတယ်။ |
| partitions_done bigint Index ကို ဖန်တီးပြီးသား ဒါမှမဟုတ် attach လုပ်ပြီးသား partitions အရေအတွက် — direct နဲ့ indirect partitions နှစ်မျိုးလုံး အပါအဝင် ။ REINDEX လုပ်နေစဉ် ဒါမှမဟုတ် index က partitioned မဟုတ်တဲ့အခါ 0 ဖြစ်ပါတယ်။ |

**ဇယား 27.44. CREATE INDEX Phases (CREATE INDEX ၏ phase များ)**

| Phase | ဖော်ပြချက် |
| --- | --- |
| `initializing` | `CREATE INDEX` ဒါမှမဟုတ် `REINDEX` က index ဖန်တီးဖို့ ပြင်ဆင်နေပါတယ်။ ဒီ phase က အလွန် တိုတောင်းမယ်လို့ မျှော်လင့်ရပါတယ်။ |
| `waiting for writers before build` | `CREATE INDEX CONCURRENTLY` ဒါမှမဟုတ် `REINDEX CONCURRENTLY` က — table ကို မြင်နိုင်ခြေ ရှိတဲ့ write locks တွေ ကိုင်ထားတဲ့ transactions တွေ ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `lockers_total`, `lockers_done` နဲ့ `current_locker_pid` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `building index` | Index ကို access method-specific code (access method နဲ့ သက်ဆိုင်တဲ့ code) က တည်ဆောက်နေပါတယ်။ ဒီ phase မှာ — progress reporting ကို ထောက်ပံ့တဲ့ access methods တွေက သူတို့ရဲ့ ကိုယ်ပိုင် progress data တွေကို ဖြည့်ပေးပြီး — subphase (အဆင့်ခွဲ) ကို ဒီ column မှာ ဖော်ပြပါတယ်။ ပုံမှန်အားဖြင့် — `blocks_total` နဲ့ `blocks_done` တွေမှာ progress data တွေ ပါဝင်ပြီး — `tuples_total` နဲ့ `tuples_done` တွေမှာလည်း ပါဝင်နိုင်ပါတယ်။ |
| `waiting for writers before validation` | `CREATE INDEX CONCURRENTLY` ဒါမှမဟုတ် `REINDEX CONCURRENTLY` က — table ထဲကို ရေးသားနိုင်ခြေ ရှိတဲ့ write locks တွေ ကိုင်ထားတဲ့ transactions တွေ ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `lockers_total`, `lockers_done` နဲ့ `current_locker_pid` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `index validation: scanning index` | `CREATE INDEX CONCURRENTLY` က — validation (စစ်ဆေး အတည်ပြု) လုပ်ရမယ့် tuples တွေကို ရှာဖွေဖို့ index ကို scan လုပ်နေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `blocks_total` (index ရဲ့ စုစုပေါင်း အရွယ်အစား လို့ သတ်မှတ်ထားပြီး) နဲ့ `blocks_done` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `index validation: sorting tuples` | `CREATE INDEX CONCURRENTLY` က index scanning phase ရဲ့ output ကို စီခွဲနေပါတယ်။ |
| `index validation: scanning table` | `CREATE INDEX CONCURRENTLY` က — အရင် phase နှစ်ခုမှာ စုဆောင်းထားတဲ့ index tuples တွေကို validation လုပ်ဖို့ — table ကို scan လုပ်နေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `blocks_total` (table ရဲ့ စုစုပေါင်း အရွယ်အစား လို့ သတ်မှတ်ထားပြီး) နဲ့ `blocks_done` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `waiting for old snapshots` | `CREATE INDEX CONCURRENTLY` ဒါမှမဟုတ် `REINDEX CONCURRENTLY` က — table ကို မြင်နိုင်ခြေ ရှိတဲ့ transactions တွေ သူတို့ရဲ့ snapshots တွေကို လွှတ်ပေးဖို့ စောင့်ဆိုင်းနေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `lockers_total`, `lockers_done` နဲ့ `current_locker_pid` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `waiting for readers before marking dead` | `REINDEX CONCURRENTLY` က — old index (index အဟောင်း) ကို dead အဖြစ် အမှတ်အသား မလုပ်ခင် — table ပေါ်မှာ read locks ကိုင်ထားတဲ့ transactions တွေ ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `lockers_total`, `lockers_done` နဲ့ `current_locker_pid` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |
| `waiting for readers before dropping` | `REINDEX CONCURRENTLY` က — old index ကို drop (ဖျက်) မလုပ်ခင် — table ပေါ်မှာ read locks ကိုင်ထားတဲ့ transactions တွေ ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေပါတယ်။ Concurrent mode မဟုတ်တဲ့အခါ ဒီ phase ကို ကျော်သွားပါတယ်။ Columns `lockers_total`, `lockers_done` နဲ့ `current_locker_pid` တွေမှာ ဒီ phase ရဲ့ progress အချက်အလက်တွေ ပါဝင်ပါတယ်။ |

### 27.4.5. VACUUM Progress Reporting (VACUUM ၏ progress အစီရင်ခံခြင်း)

`VACUUM` run လုပ်နေချိန်တိုင်း — `pg_stat_progress_vacuum` view ထဲမှာ — လက်ရှိ vacuum လုပ်နေတဲ့ backend (autovacuum worker processes တွေ အပါအဝင်) တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါဝင်ပါလိမ့်မယ်။ အောက်က ဇယားတွေက — အစီရင်ခံမယ့် အချက်အလက်တွေကို ဖော်ပြပြီး — အဲဒါတွေကို ဘယ်လို အဓိပ္ပာယ် ဖော်ဆောင်ရမလဲဆိုတာနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေကိုလည်း ပေးပါတယ်။ `VACUUM FULL` commands တွေရဲ့ progress ကိုတော့ `pg_stat_progress_cluster` ကနေ အစီရင်ခံပါတယ် — အကြောင်းကတော့ `VACUUM FULL` ရော `CLUSTER` ပါ table ကို ပြန်လည် ရေးသား (rewrite) လုပ်ကြပြီး — ပုံမှန် `VACUUM` ကတော့ table ကို နေရာတွင် သက်သက် (in place) ပြုပြင်မှုသာ လုပ်လို့ပါ။ [အပိုင်း 27.4.2](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING) ကို ကြည့်ပါ။

**ဇယား 27.45. pg_stat_progress_vacuum View**

| Column Type ဖော်ပြချက် |
| --- |
| pid integer Backend ၏ process ID ။ |
| datid oid ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ OID ။ |
| datname name ဒီ backend က connect လုပ်ထားတဲ့ database ရဲ့ နာမည် ။ |
| relid oid Vacuum လုပ်နေတဲ့ table ရဲ့ OID ။ |
| phase text Vacuum ရဲ့ လက်ရှိ ဆောင်ရွက်နေတဲ့ phase ။ Table 27.46 ကို ကြည့်ပါ။ |
| heap_blks_total bigint Table ထဲက heap blocks စုစုပေါင်း အရေအတွက် ။ ဒီဂဏန်းကို scan ရဲ့ အစမှာ အစီရင်ခံပါတယ်; နောက်မှ ထည့်သွင်းလာတဲ့ blocks တွေကို ဒီ VACUUM က လည်ပတ် (visit) လုပ်မှာ မဟုတ်ပါဘူး (လုပ်ဖို့လည်း မလိုပါဘူး)။ |
| heap_blks_scanned bigint Scan လုပ်ပြီးသား heap blocks အရေအတွက် ။ Visibility map (မြင်နိုင်မှု မြေပုံ) ကို scans တွေ အကောင်းဆုံး ဖြစ်အောင် သုံးတာမို့ — block တချို့ကို စစ်ဆေးမှု မရှိဘဲ ကျော်သွားပါလိမ့်မယ်; ကျော်သွားတဲ့ blocks တွေကိုလည်း ဒီ စုစုပေါင်းထဲမှာ ထည့်သွင်းထားတာမို့ — vacuum ပြီးဆုံးတဲ့အခါ ဒီဂဏန်းက heap_blks_total နဲ့ နောက်ဆုံး တူညီသွားပါလိမ့်မယ်။ ဒီ counter က — phase က scanning heap ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| heap_blks_vacuumed bigint Vacuum လုပ်ပြီးသား heap blocks အရေအတွက် ။ Table မှာ indexes မရှိဘူးဆိုရင် လွဲပြီး — ဒီ counter က — phase က vacuuming heap ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ Dead tuples (သေနေသော tuples) တွေ မပါဝင်တဲ့ blocks တွေကို skip လုပ်တာမို့ — counter က တစ်ခါတစ်ရံ ကြီးမားတဲ့ ပမာဏနဲ့ ရှေ့ကို ခုန်ကျော်သွားနိုင်ပါတယ်။ |
| index_vacuum_count bigint ပြီးဆုံးသွားတဲ့ index vacuum cycles အရေအတွက် ။ |
| max_dead_tuple_bytes bigint Index vacuum cycle (index vacuum လည်ပတ်မှု) တစ်ခု လုပ်ဆောင်ဖို့ မလိုအပ်ခင် သိမ်းဆည်းထားလို့ ရတဲ့ dead tuple data ပမာဏ — maintenance_work_mem ကို အခြေခံပါတယ်။ |
| dead_tuple_bytes bigint နောက်ဆုံး index vacuum cycle ကတည်းက စုဆောင်းထားတဲ့ dead tuple data ပမာဏ ။ |
| num_dead_item_ids bigint နောက်ဆုံး index vacuum cycle ကတည်းက စုဆောင်းထားတဲ့ dead item identifiers အရေအတွက် ။ |
| indexes_total bigint Vacuum လုပ်မယ့် ဒါမှမဟုတ် သန့်ရှင်းရေး လုပ်မယ့် indexes စုစုပေါင်း အရေအတွက် ။ ဒီဂဏန်းကို vacuuming indexes phase ဒါမှမဟုတ် cleaning up indexes phase ရဲ့ အစမှာ အစီရင်ခံပါတယ်။ |
| indexes_processed bigint လုပ်ဆောင်ပြီးသား indexes အရေအတွက် ။ ဒီ counter က — phase က vacuuming indexes ဒါမှမဟုတ် cleaning up indexes ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| delay_time double precision Cost-based delay ကြောင့် အိပ်စက် လုပ်ရတဲ့ စုစုပေါင်း အချိန် (အပိုင်း 19.10.2 ကို ကြည့်ပါ) — milliseconds နဲ့ (track_cost_delay_timing ကို enable လုပ်ထားရင်; မဟုတ်ရင် သုည)။ ဒါမှာ — ဆက်စပ် parallel workers (အပြိုင် လုပ်ဆောင်သူများ) တွေ အိပ်စက်ခဲ့တဲ့ အချိန်တွေလည်း ပါဝင်ပါတယ်။ ဒါပေမယ့် — parallel workers တွေက သူတို့ရဲ့ အိပ်စက်မှု အချိန်ကို တစ်စက္ကန့်ကို တစ်ကြိမ်ထက် မပိုတဲ့ ကြိမ်နှုန်းနဲ့ပဲ အစီရင်ခံတာမို့ — အစီရင်ခံတဲ့ တန်ဖိုးက အနည်းငယ် နောက်ကျနေနိုင်ပါတယ်။ |

**ဇယား 27.46. VACUUM Phases (VACUUM ၏ phase များ)**

| Phase | ဖော်ပြချက် |
| --- | --- |
| `initializing` | `VACUUM` က heap ကို scan လုပ်ဖို့ စတင် ပြင်ဆင်နေပါတယ်။ ဒီ phase က အလွန် တိုတောင်းမယ်လို့ မျှော်လင့်ရပါတယ်။ |
| `scanning heap` | `VACUUM` က heap ကို လက်ရှိ scan လုပ်နေပါတယ်။ လိုအပ်ရင် page တစ်ခုချင်းစီကို prune (ခုတ်ထစ် ရှင်းလင်း) လုပ်ပြီး defragment (အပိုင်းအစများ ပြန်စုစည်း) လုပ်ကာ — freezing လုပ်ဆောင်မှုတွေလည်း လုပ်နိုင်ပါတယ်။ `heap_blks_scanned` column ကို scan ရဲ့ progress ကို စောင့်ကြည့်ဖို့ သုံးနိုင်ပါတယ်။ |
| `vacuuming indexes` | `VACUUM` က indexes တွေကို လက်ရှိ vacuum လုပ်နေပါတယ်။ Table မှာ indexes တစ်ခုခု ရှိရင် — heap ကို လုံးဝ scan လုပ်ပြီးတဲ့နောက်မှာ — vacuum တစ်ကြိမ်မှာ အနည်းဆုံး တစ်ခါ ဒါ ဖြစ်ပါတယ်။ တွေ့ရှိတဲ့ dead tuples အရေအတွက်ကို သိမ်းဆည်းဖို့ [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) (ဒါမှမဟုတ် — autovacuum ရဲ့ ကိစ္စမှာဆိုရင် — သတ်မှတ်ထားရင် [autovacuum_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-AUTOVACUUM-WORK-MEM)) မလုံလောက်ဘူးဆိုရင် — vacuum တစ်ကြိမ်အတွင်းမှာ အကြိမ် များစွာ ဖြစ်နိုင်ပါတယ်။ |
| `vacuuming heap` | `VACUUM` က heap ကို လက်ရှိ vacuum လုပ်နေပါတယ်။ Heap ကို vacuum လုပ်တာက heap ကို scan လုပ်တာနဲ့ မတူညီပါဘူး — ဒါက vacuuming indexes လုပ်ဆောင်မှု တစ်ကြိမ်စီ ပြီးတိုင်းမှာ ဖြစ်ပေါ်ပါတယ်။ `heap_blks_scanned` က `heap_blks_total` ထက် နည်းနေသေးရင် — ဒီ phase ပြီးတာနဲ့ system က heap ကို scan လုပ်တာဆီ ပြန်သွားပါလိမ့်မယ်; မဟုတ်ရင် — ဒီ phase ပြီးတာနဲ့ indexes တွေကို သန့်ရှင်းရေး လုပ်တာကို စတင်ပါလိမ့်မယ်။ |
| `cleaning up indexes` | `VACUUM` က indexes တွေကို လက်ရှိ သန့်ရှင်းရေး လုပ်နေပါတယ်။ Heap ကို လုံးဝ scan လုပ်ပြီး — indexes တွေရော heap ရဲ့ vacuuming တွေ အားလုံး ပြီးမြောက်ပြီးတဲ့နောက်မှာ ဒါ ဖြစ်ပေါ်ပါတယ်။ |
| `truncating heap` | `VACUUM` က heap ကို လက်ရှိ truncate (ဖြတ်တောက်) လုပ်နေပါတယ် — ဒါက relation ရဲ့ အဆုံးမှာ ရှိတဲ့ ဗလာ pages တွေကို operating system ဆီ ပြန်ပေးဖို့ ဖြစ်ပါတယ်။ Indexes တွေကို သန့်ရှင်းရေး လုပ်ပြီးတဲ့နောက်မှာ ဒါ ဖြစ်ပေါ်ပါတယ်။ |
| `performing final cleanup` | `VACUUM` က နောက်ဆုံး သန့်ရှင်းရေး ကို လုပ်ဆောင်နေပါတယ်။ ဒီ phase အတွင်းမှာ — `VACUUM` က free space map ကို vacuum လုပ်ပြီး — `pg_class` ထဲက statistics တွေကို update လုပ်ကာ — cumulative statistics system ဆီ statistics တွေကို အစီရင်ခံပါတယ်။ ဒီ phase ပြီးဆုံးတာနဲ့ — `VACUUM` က အဆုံးသတ်ပါလိမ့်မယ်။ |

### 27.4.6. Base Backup Progress Reporting (base backup ၏ progress အစီရင်ခံခြင်း)

pg_basebackup လို application တစ်ခုက base backup (အခြေခံ backup) တစ်ခု ယူနေချိန်တိုင်း — `pg_stat_progress_basebackup` view ထဲမှာ — `BASE_BACKUP` replication command ကို လက်ရှိ run ပြီး backup ကို stream (စီးဆင်း ပို့လွှတ်) လုပ်နေတဲ့ WAL sender process တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပါဝင်ပါလိမ့်မယ်။ အောက်က ဇယားတွေက — အစီရင်ခံမယ့် အချက်အလက်တွေကို ဖော်ပြပြီး — အဲဒါတွေကို ဘယ်လို အဓိပ္ပာယ် ဖော်ဆောင်ရမလဲဆိုတာနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေကိုလည်း ပေးပါတယ်။

**ဇယား 27.47. pg_stat_progress_basebackup View**

| Column Type ဖော်ပြချက် |
| --- |
| pid integer WAL sender process တစ်ခုရဲ့ process ID ။ |
| phase text လက်ရှိ ဆောင်ရွက်နေတဲ့ phase ။ Table 27.48 ကို ကြည့်ပါ။ |
| backup_total bigint Stream လုပ်မယ့် data စုစုပေါင်း ပမာဏ ။ ဒါကို streaming database files phase ရဲ့ အစမှာ ခန့်မှန်းပြီး အစီရင်ခံပါတယ်။ Database က streaming database files phase အတွင်းမှာ ပြောင်းလဲနိုင်ပြီး — WAL log တွေကို backup ထဲ နောက်မှ ထည့်သွင်းနိုင်တာမို့ — ဒါက ခန့်မှန်းချက် (approximation) တစ်ခုသာ ဖြစ်တာ သတိပြုပါ။ Stream လုပ်ပြီးသား data ပမာဏက ခန့်မှန်း စုစုပေါင်း အရွယ်အစားကို ကျော်လွန်သွားတာနဲ့ — ဒါက backup_streamed နဲ့ အမြဲတမ်း တူညီတဲ့ တန်ဖိုး ဖြစ်ပါတယ်။ pg_basebackup ထဲမှာ ခန့်မှန်းချက်ကို disable လုပ်ထားရင် (ဆိုလိုတာက — --no-estimate-size option သတ်မှတ်ထားရင်) — ဒါက NULL ဖြစ်ပါတယ်။ |
| backup_streamed bigint Stream လုပ်ပြီးသား data ပမာဏ ။ ဒီ counter က — phase က streaming database files ဒါမှမဟုတ် transferring wal files ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |
| tablespaces_total bigint Stream လုပ်မယ့် tablespaces စုစုပေါင်း အရေအတွက် ။ |
| tablespaces_streamed bigint Stream လုပ်ပြီးသား tablespaces အရေအတွက် ။ ဒီ counter က — phase က streaming database files ဖြစ်နေချိန်မှာပဲ — တိုးတက်ပါတယ်။ |

**ဇယား 27.48. Base Backup Phases (base backup ၏ phase များ)**

| Phase | ဖော်ပြချက် |
| --- | --- |
| `initializing` | WAL sender process က backup စတင်ဖို့ ပြင်ဆင်နေပါတယ်။ ဒီ phase က အလွန် တိုတောင်းမယ်လို့ မျှော်လင့်ရပါတယ်။ |
| `waiting for checkpoint to finish` | WAL sender process က — base backup တစ်ခု ယူဖို့ ပြင်ဆင်တဲ့ အနေနဲ့ `pg_backup_start` ကို လက်ရှိ လုပ်ဆောင်နေပြီး — start-of-backup checkpoint (backup အစ checkpoint) ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေပါတယ်။ |
| `estimating backup size` | WAL sender process က — base backup တစ်ခုအနေနဲ့ stream လုပ်မယ့် database ဖိုင်တွေရဲ့ စုစုပေါင်း ပမာဏကို လက်ရှိ ခန့်မှန်းနေပါတယ်။ |
| `streaming database files` | WAL sender process က base backup တစ်ခုအနေနဲ့ database ဖိုင်တွေကို လက်ရှိ stream လုပ်နေပါတယ်။ |
| `waiting for wal archiving to finish` | WAL sender process က — backup ကို အဆုံးသတ်ဖို့ `pg_backup_stop` ကို လက်ရှိ လုပ်ဆောင်နေပြီး — base backup အတွက် လိုအပ်တဲ့ WAL ဖိုင်တွေ အားလုံး အောင်မြင်စွာ archived (မှတ်တမ်း သိမ်းဆည်း) ဖြစ်ဖို့ စောင့်ဆိုင်းနေပါတယ်။ pg_basebackup ထဲမှာ `--wal-method=none` ဒါမှမဟုတ် `--wal-method=stream` တစ်ခုခု သတ်မှတ်ထားရင် — ဒီ phase ပြီးဆုံးတာနဲ့ backup က အဆုံးသတ်ပါလိမ့်မယ်။ |
| `transferring wal files` | WAL sender process က — backup အတွင်း ထုတ်လုပ်ခဲ့တဲ့ WAL logs တွေ အားလုံးကို လက်ရှိ လွှဲပြောင်း (transfer) လုပ်နေပါတယ်။ pg_basebackup ထဲမှာ `--wal-method=fetch` သတ်မှတ်ထားရင် — ဒီ phase က `waiting for wal archiving to finish` phase ပြီးတဲ့နောက်မှာ ဖြစ်ပေါ်ပါတယ်။ ဒီ phase ပြီးဆုံးတာနဲ့ backup က အဆုံးသတ်ပါလိမ့်မယ်။ |
