---
title: "Populating a Database (database တစ်ခုကို data ဖြည့်သွင်းခြင်း)"
description: "Database တစ်ခုကို data အမြောက်အများ ထိရောက်စွာ ဖြည့်သွင်းနည်း — autocommit ပိတ်ခြင်း၊ COPY သုံးခြင်း၊ index/FK များ ဖယ်ရှားခြင်း၊ maintenance_work_mem နှင့် max_wal_size မြှင့်တင်ခြင်း၊ WAL archival ပိတ်ခြင်း၊ ANALYZE နှင့် pg_dump မှတ်စုများ"
order: 138
source: "https://www.postgresql.org/docs/current/populate.html"
status: translated
updated: 2026-09-03
---

## 14.4. Populating a Database (database တစ်ခုကို data ဖြည့်သွင်းခြင်း)

- **14.4.1. Disable Autocommit (autocommit ပိတ်ထားခြင်း)**
- **14.4.2. Use `COPY` (COPY သုံးခြင်း)**
- **14.4.3. Remove Indexes (index များ ဖယ်ရှားခြင်း)**
- **14.4.4. Remove Foreign Key Constraints (foreign key constraint များ ဖယ်ရှားခြင်း)**
- **14.4.5. Increase `maintenance_work_mem` (maintenance_work_mem မြှင့်တင်ခြင်း)**
- **14.4.6. Increase `max_wal_size` (max_wal_size မြှင့်တင်ခြင်း)**
- **14.4.7. Disable WAL Archival and Streaming Replication (WAL archival နှင့် streaming replication ပိတ်ထားခြင်း)**
- **14.4.8. Run `ANALYZE` Afterwards (ပြီးတဲ့နောက် ANALYZE လုပ်ခြင်း)**
- **14.4.9. Some Notes about pg_dump (pg_dump အကြောင်း မှတ်စုအချို့)**

Database တစ်ခုကို ပထမဆုံး data ဖြည့်တဲ့အခါ — data အမြောက်အများ ထည့်သွင်းဖို့ လိုအပ်လာနိုင်ပါတယ်။ ဒီ section မှာ — ဒီလုပ်ငန်းစဉ်ကို တတ်နိုင်သမျှ ထိရောက်အောင် လုပ်နိုင်ဖို့ အကြံပြုချက် တချို့ ဖော်ပြထားပါတယ်။

### 14.4.1. Disable Autocommit (autocommit ပိတ်ထားခြင်း)

`INSERT` တွေ အများကြီး သုံးတဲ့အခါ — autocommit ကို ပိတ်ထားပြီး — အကုန်လုံးကို နောက်ဆုံးမှ တစ်ခါတည်း commit လုပ်ပါ။ (Plain SQL မှာဆိုရင် — အစမှာ `BEGIN` ထုတ်ပြီး — အဆုံးမှာ `COMMIT` ထုတ်တာ ဖြစ်ပါတယ်။ Client library တချို့က ဒါကို သင်မသိလိုက်ဘဲ နောက်ကွယ်ကနေ လုပ်ပေးတတ်ပါတယ် — အဲဒီလိုဆိုရင် — သင်လိုချင်တဲ့ အချိန်မှာ library က အဲဒါကို လုပ်ပေးဖို့ သေချာအောင် လုပ်ထားဖို့ လိုပါတယ်။) Insert တစ်ခုချင်းစီကို သီးခြားစီ commit လုပ်ခွင့် ပေးထားရင် — row တစ်ခုချင်းစီ ထည့်လိုက်တိုင်း — PostgreSQL က အလုပ် အများကြီး လုပ်ရပါတယ်။ Insert တွေ အားလုံးကို transaction တစ်ခုတည်းနဲ့ လုပ်တာရဲ့ နောက်ထပ် အကျိုးကျေးဇူး တစ်ခုက — row တစ်ခုရဲ့ insertion မအောင်မြင်ခဲ့ရင် — အဲဒီအထိ ထည့်ပြီးသမျှ row တွေ အားလုံးရဲ့ insertion ကိုပါ roll back ဖြစ်သွားမှာ မို့လို့ — data တစ်ဝက်တစ်ပျက် ဝင်နေတဲ့ အခြေအနေမျိုးနဲ့ ရှုပ်ပွနေစရာ မလိုတော့ပါဘူး။

### 14.4.2. Use `COPY` (COPY သုံးခြင်း)

Row တွေ အားလုံးကို command တစ်ခုတည်းနဲ့ တင်ဖို့ — `INSERT` command တွေ အများကြီး ဆက်တိုက် သုံးမယ့်အစား — [`COPY`](https://www.postgresql.org/docs/current/sql-copy.html) ကို သုံးပါ။ `COPY` command က row အများကြီး တင်ဖို့အတွက် optimize (ပုံစံချွေတာ ပြင်ဆင်) လုပ်ထားတာ ဖြစ်ပါတယ် — `INSERT` လောက် ပြောင်းလွယ်ပြင်လွယ် မရှိပေမယ့် — data အမြောက်အများ တင်တဲ့အခါ overhead (ထပ်ဆောင်း စရိတ်) က သိသိသာသာ သက်သာပါတယ်။ `COPY` က command တစ်ခုတည်း ဖြစ်တာမို့ — ဒီနည်းနဲ့ table တစ်ခုကို data ဖြည့်မယ်ဆိုရင် — autocommit ပိတ်စရာ မလိုပါဘူး။

`COPY` ကို မသုံးနိုင်ဘူးဆိုရင် — [`PREPARE`](https://www.postgresql.org/docs/current/sql-prepare.html) ကို သုံးပြီး prepared `INSERT` statement (ကြိုတင် ပြင်ဆင်ထားသော INSERT statement) တစ်ခု ဖန်တီးကာ — လိုအပ်သလောက် အကြိမ်ကြိမ် `EXECUTE` လုပ်တာ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ ဒါက `INSERT` ကို ထပ်ခါထပ်ခါ parse (ခွဲခြမ်းစိတ်ဖြာ) လုပ်ပြီး plan လုပ်ရတဲ့ overhead တချို့ကို ရှောင်ရှားနိုင်ပါတယ်။ Interface (ကြားခံ ဆက်သွယ်ရေး စနစ်) အမျိုးမျိုးက ဒီစွမ်းဆောင်နိုင်မှုကို နည်း အမျိုးမျိုးနဲ့ ပေးပါတယ် — interface documentation ထဲမှာ “prepared statements” လို့ ရှာကြည့်ပါ။

`COPY` နဲ့ row အများကြီး တင်တာက — `PREPARE` သုံးထားပြီး insert တွေ အများကြီးကို transaction တစ်ခုတည်းထဲ စုပြီး batch (တစ်စုတည်း လုပ်ခြင်း) လုပ်ထားရင်တောင် — `INSERT` သုံးတာထက် နီးပါးမပျက် ပိုမြန်ပါတယ်။

`COPY` က — အရင်က ထုတ်ခဲ့တဲ့ `CREATE TABLE` ဒါမှမဟုတ် `TRUNCATE` command နဲ့ transaction တစ်ခုတည်း အတွင်းမှာ သုံးတဲ့အခါ အမြန်ဆုံး ဖြစ်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ WAL (write-ahead log) ရေးစရာ မလိုပါဘူး — အကြောင်းကတော့ error ဖြစ်ခဲ့ရင် — အသစ် တင်ထားတဲ့ data ပါဝင်တဲ့ file တွေက ဘယ်လိုပဲဖြစ်ဖြစ် ဖယ်ရှားခံရမှာ မို့လို့ပါ။ ဒါပေမယ့် — ဒီအချက်က [wal_level](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL) က `minimal` ဖြစ်နေတဲ့အခါမှပဲ သက်ရောက်ပါတယ် — မဟုတ်ရင် command တွေ အားလုံး WAL ရေးရမှာ ဖြစ်လို့ပါ။

### 14.4.3. Remove Indexes (index များ ဖယ်ရှားခြင်း)

အသစ် ဖန်တီးထားတဲ့ table တစ်ခုကို data တင်နေတယ်ဆိုရင် — အမြန်ဆုံး နည်းလမ်းကတော့ — table ကို ဖန်တီး၊ `COPY` သုံးပြီး table ရဲ့ data တွေကို တစ်ခါတည်း bulk load (အမြောက်အများ တင်ခြင်း) လုပ်၊ ပြီးမှ table အတွက် လိုအပ်တဲ့ index တွေကို ဖန်တီးတာ ဖြစ်ပါတယ်။ Data အရင် ရှိနေတဲ့အပေါ်မှာ index တစ်ခု ဖန်တီးတာက — row တစ်ခုချင်း load လုပ်နေတုန်း index ကို တစ်ဆင့်ချင်း (incrementally) update လုပ်နေတာထက် ပိုမြန်ပါတယ်။

ရှိပြီးသား table တစ်ခုထဲကို data အမြောက်အများ ထပ်ထည့်နေတယ်ဆိုရင် — index တွေကို drop လုပ်ပြီး — table ကို load လုပ်ကာ — နောက်မှ index တွေကို ပြန်ဖန်တီးတာက အကျိုးရှိနိုင်ပါတယ်။ ဒါပေမယ့် — index တွေ မရှိတဲ့ ကာလအတွင်းမှာ — တခြား user တွေအတွက် database performance က ထိခိုက်နိုင်တာ သေချာပါတယ်။ Unique index တစ်ခုကို drop လုပ်ခါနီးမှာလည်း နှစ်ခါလောက် စဉ်းစားသင့်ပါတယ် — အကြောင်းကတော့ index မရှိတဲ့ ကာလအတွင်းမှာ — unique constraint က ပေးတဲ့ error checking (error စစ်ဆေးခြင်း) ကို ဆုံးရှုံးသွားလို့ပါ။

### 14.4.4. Remove Foreign Key Constraints (foreign key constraint များ ဖယ်ရှားခြင်း)

Index တွေလိုပဲ — foreign key constraint တစ်ခုကိုလည်း — row တစ်ခုချင်း စစ်တာထက် — “တစ်ခါတည်း အစုလိုက်” (in bulk) စစ်တာက ပိုထိရောက်ပါတယ်။ ဒါကြောင့် — foreign key constraint တွေကို drop လုပ်ပြီး — data တွေ load လုပ်ကာ — constraint တွေကို ပြန်ဖန်တီးတာ အသုံးဝင်နိုင်ပါတယ်။ ဒီမှာလည်း — data load မြန်နှုန်းနဲ့ — constraint မရှိတဲ့ ကာလအတွင်း error checking ဆုံးရှုံးမှုကြားက အပေးအယူ (trade-off) ရှိတာ သတိပြုပါ။

ဒါ့အပြင် — ရှိပြီးသား foreign key constraint တွေ ရှိတဲ့ table တစ်ခုထဲ data တင်တဲ့အခါ — row အသစ် တစ်ခုချင်းစီတိုင်းအတွက် — server ရဲ့ pending trigger events (ဆောင်ရွက်ဆဲ trigger အဖြစ်အပျက်များ) စာရင်းထဲမှာ entry တစ်ခု လိုပါတယ် (row ရဲ့ foreign key constraint ကို စစ်ဆေးတာက trigger တစ်ခု ပစ်ခတ် (fire) လို့ ဖြစ်တာမို့ပါ)။ Row သန်းနဲ့ချီ များပြားတာကို load လုပ်ရင် — trigger event queue (တန်းစီ) က ရနိုင်တဲ့ memory ကို ပြည့်လျှံ (overflow) သွားစေနိုင်ပြီး — သည်းမခံနိုင်လောက်တဲ့ swapping (disk နဲ့ လဲလှယ်မှု) ဒါမှမဟုတ် — command ကိုယ်တိုင် လုံးဝ မအောင်မြင် ဖြစ်သွားတာမျိုးတောင် ဖြစ်စေနိုင်ပါတယ်။ ဒါကြောင့် — data အမြောက်အများ တင်တဲ့အခါ — foreign key တွေကို drop ပြီး ပြန်တပ်တာက လိုလားစရာ သက်သက် မဟုတ်ဘဲ — မဖြစ်မနေ လိုအပ်လာနိုင်ပါတယ်။ Constraint ကို ယာယီ ဖယ်ထားတာ လက်ခံနိုင်စရာ မဟုတ်ဘူးဆိုရင် — ကျန်တဲ့ တစ်ခုတည်းသော နည်းလမ်းက — load လုပ်ငန်းကို transaction ငယ်တွေ အဖြစ် ခွဲလုပ်တာပဲ ဖြစ်ပါတယ်။

### 14.4.5. Increase `maintenance_work_mem` (maintenance_work_mem မြှင့်တင်ခြင်း)

Data အမြောက်အများ တင်တဲ့အခါ — [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) configuration variable (ပြင်ဆင်သတ်မှတ်နိုင်သော variable) ကို ယာယီ မြှင့်တင်ထားတာက — performance ပိုကောင်းလာစေနိုင်ပါတယ်။ ဒါက `CREATE INDEX` command တွေနဲ့ `ALTER TABLE ADD FOREIGN KEY` command တွေကို မြန်ဆန်စေဖို့ အထောက်အကူ ပြုပါတယ်။ `COPY` ကိုယ်တိုင်အတွက်တော့ သိပ်မထူးခြားပါဘူး — ဒါကြောင့် — ဒီအကြံပြုချက်က အပေါ်က နည်းစနစ် တစ်ခုခု (သို့) နှစ်ခုလုံးကို သုံးနေမှသာ အကျိုးရှိပါတယ်။

### 14.4.6. Increase `max_wal_size` (max_wal_size မြှင့်တင်ခြင်း)

[max_wal_size](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-MAX-WAL-SIZE) configuration variable ကို ယာယီ မြှင့်တင်တာကလည်း — data အမြောက်အများ တင်တာကို ပိုမြန်စေနိုင်ပါတယ်။ အကြောင်းကတော့ — PostgreSQL ထဲ data အမြောက်အများ တင်လိုက်ရင် — checkpoint (ထိန်းသိမ်းမှတ်တိုင်) တွေက — ပုံမှန် checkpoint ကြိမ်နှုန်း (`checkpoint_timeout` configuration variable က သတ်မှတ်တဲ့အတိုင်း) ထက် ပိုပြီး မကြာခဏ ဖြစ်ပေါ်လို့ပါ။ Checkpoint တစ်ခု ဖြစ်ပေါ်တိုင်း — dirty pages (ပြောင်းလဲပြီး ပြန်မရေးရသေးတဲ့ စာမျက်နှာများ) အားလုံးကို disk ပေါ် flush (သွင်းရေး) လုပ်ရပါတယ်။ Bulk data load လုပ်နေစဉ် `max_wal_size` ကို ယာယီ မြှင့်ထားခြင်းအားဖြင့် — လိုအပ်တဲ့ checkpoint အရေအတွက်ကို လျှော့ချနိုင်ပါတယ်။

### 14.4.7. Disable WAL Archival and Streaming Replication (WAL archival နှင့် streaming replication ပိတ်ထားခြင်း)

WAL archiving (WAL မှတ်တမ်း သိမ်းဆည်းခြင်း) ဒါမှမဟုတ် streaming replication (စီးဆင်းမှု ပုံတူပွားခြင်း) သုံးထားတဲ့ installation တစ်ခုထဲ data အမြောက်အများ တင်တဲ့အခါ — incremental WAL data (အပိုင်းလိုက် ထပ်ဆောင်း WAL data) အများကြီးကို process လုပ်တာထက် — load ပြီးသွားတဲ့နောက် base backup (အခြေခံ အရန်ကူး) အသစ် တစ်ခု ယူလိုက်တာက ပိုမြန်နိုင်ပါတယ်။ Load လုပ်နေစဉ် incremental WAL logging မဖြစ်ပေါ်အောင် — archiving နဲ့ streaming replication ကို ပိတ်ထားပါ — [wal_level](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL) ကို `minimal`၊ [archive_mode](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-ARCHIVE-MODE) ကို `off`၊ ပြီးတော့ [max_wal_senders](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS) ကို သုည လို့ သတ်မှတ်ပါ။ ဒါပေမယ့် — ဒီ setting တွေ ပြောင်းတာက server restart (ဆာဗာ ပြန်စတင်ခြင်း) လိုအပ်ပြီး — အရင်က ယူထားတဲ့ base backup တွေကို archive recovery နဲ့ standby server အတွက် အသုံးမပြုနိုင်တော့ဘဲ — data ဆုံးရှုံးမှုတွေ ဖြစ်စေနိုင်တာ သတိပြုပါ။

ဒီလိုလုပ်တာက — archiver ဒါမှမဟုတ် WAL sender က WAL data တွေကို process လုပ်ရတဲ့ အချိန်ကို ရှောင်ရှားပေးတာအပြင် — command တချို့ကို တကယ်ပဲ ပိုမြန်စေပါတယ် — `wal_level` က `minimal` ဖြစ်ပြီး — လက်ရှိ subtransaction (သို့) အဆင့်မြင့်ဆုံး (top-level) transaction က — သူတို့ ပြောင်းလဲနေတဲ့ table ဒါမှမဟုတ် index ကို ဖန်တီးထားခဲ့တာ ဒါမှမဟုတ် truncate လုပ်ထားခဲ့တာ ဖြစ်ရင် — အဲဒီ command တွေက WAL ကို လုံးဝ ရေးစရာ မလိုတာမို့ပါ။ (WAL ရေးတာထက် — အဆုံးမှာ `fsync` တစ်ချက် လုပ်ခြင်းအားဖြင့် — crash safety (ပျက်ကျမှု ဘေးကင်းလုံခြုံမှု) ကို ပိုသက်သာတဲ့ နည်းနဲ့ အာမခံနိုင်လို့ပါ။)

### 14.4.8. Run `ANALYZE` Afterwards (ပြီးတဲ့နောက် ANALYZE လုပ်ခြင်း)

Table တစ်ခုအတွင်းက data တွေရဲ့ ဖြန့်ဖြူးမှု (distribution) ကို သိသိသာသာ ပြောင်းလဲစေတဲ့ အခါတိုင်း — [`ANALYZE`](https://www.postgresql.org/docs/current/sql-analyze.html) လုပ်ဖို့ ပြင်းပြင်းထန်ထန် အကြံပြုပါတယ်။ ဒီထဲမှာ — table ထဲ data အမြောက်အများ bulk load လုပ်တာတွေလည်း ပါဝင်ပါတယ်။ `ANALYZE` (ဒါမှမဟုတ် `VACUUM ANALYZE`) လုပ်ခြင်းက — planner မှာ table အကြောင်း နောက်ဆုံးပေါ် statistics (စာရင်းအင်း အချက်အလက်များ) ရှိစေဖို့ အာမခံပါတယ်။ Statistics မရှိရင် ဒါမှမဟုတ် ခေတ်မမီတော့တဲ့ statistics တွေ ရှိနေရင် — planner က query planning လုပ်နေစဉ် မကောင်းတဲ့ ဆုံးဖြတ်ချက်တွေ ချမိနိုင်ပြီး — မှားယွင်းတဲ့ ဒါမှမဟုတ် မရှိတဲ့ statistics တွေ ရှိတဲ့ table တွေမှာ performance ညံ့ဖျင်းမှုကို ဖြစ်စေနိုင်ပါတယ်။ Autovacuum daemon (နောက်ခံ လုပ်ငန်းစဉ်) ကို ဖွင့်ထားရင် — `ANALYZE` ကို အလိုအလျောက် လုပ်ပေးနိုင်တာ သတိပြုပါ — နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 24.1.3](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-STATISTICS) နဲ့ [အပိုင်း 24.1.6](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) ကို ကြည့်ပါ။

### 14.4.9. Some Notes about pg_dump (pg_dump အကြောင်း မှတ်စုအချို့)

pg_dump က ထုတ်လုပ်ပေးတဲ့ dump scripts တွေက — အပေါ်က လမ်းညွှန်ချက် (guideline) တွေထဲက အတော်များများကို အလိုအလျောက် ကျင့်သုံးပေးပါတယ် — ဒါပေမယ့် အားလုံးတော့ မဟုတ်ပါဘူး။ pg_dump dump တစ်ခုကို တတ်နိုင်သမျှ မြန်မြန် restore (ပြန်သွင်း) လုပ်ဖို့ — နောက်ထပ် အချက် အနည်းငယ်ကို ကိုယ်တိုင် လုပ်ပေးဖို့ လိုပါတယ်။ (ဒီအချက်တွေက dump ဖန်တီးနေစဉ် မဟုတ်ဘဲ — dump တစ်ခုကို restore လုပ်နေစဉ်မှာ သက်ရောက်တယ်ဆိုတာ သတိပြုပါ။ Text dump တစ်ခုကို psql နဲ့ ဖတ်တာပဲ ဖြစ်ဖြစ် — pg_restore သုံးပြီး pg_dump archive file ကနေ ပြန်သွင်းတာပဲ ဖြစ်ဖြစ် — အချက်တွေက အတူတူပဲ သက်ရောက်ပါတယ်။)

ပုံမှန်အားဖြင့် — pg_dump က `COPY` ကို သုံးပြီး — schema ရော data ပါ အပြည့်အစုံ ပါတဲ့ dump တစ်ခုကို ထုတ်တဲ့အခါ — index နဲ့ foreign key တွေကို မဖန်တီးခင် — data တွေကို အရင် load လုပ်ဖို့ ဂရုစိုက်ပါတယ်။ ဒါကြောင့် — ဒီကိစ္စမှာ လမ်းညွှန်ချက် အတော်များများကို အလိုအလျောက် ကိုင်တွယ်ပြီးသား ဖြစ်ပါတယ်။ သင်လုပ်ဖို့ ကျန်နေတာတွေကတော့ —

- `maintenance_work_mem` နဲ့ `max_wal_size` အတွက် သင့်လျော်တဲ့ (ဆိုလိုတာက ပုံမှန်ထက် ပိုကြီးတဲ့) တန်ဖိုးတွေ သတ်မှတ်ပါ။
- WAL archiving ဒါမှမဟုတ် streaming replication သုံးနေရင် — restore လုပ်နေစဉ် သူတို့ကို ပိတ်ထားဖို့ စဉ်းစားပါ။ အဲဒါ လုပ်ဖို့ — dump မတင်ခင် `archive_mode` ကို `off`၊ `wal_level` ကို `minimal`၊ `max_wal_senders` ကို သုည လို့ သတ်မှတ်ပါ။ ပြီးရင် — မှန်ကန်တဲ့ တန်ဖိုးတွေ ပြန်သတ်မှတ်ပြီး — base backup အသစ် တစ်ခု ယူပါ။
- pg_dump ရော pg_restore ရဲ့ parallel (အပြိုင်) dump နဲ့ restore mode တွေကို စမ်းသပ်ပြီး — သုံးသင့်တဲ့ concurrent jobs (တစ်ပြိုင်နက် လုပ်ငန်းစဉ်) အရေအတွက် အကောင်းဆုံးကို ရှာပါ။ `-j` option နဲ့ parallel dump/restore လုပ်တာက — serial (တစ်ခုပြီးတစ်ခု) mode ထက် သိသိသာသာ ပိုကောင်းတဲ့ performance ကို ပေးသင့်ပါတယ်။
- Dump တစ်ခုလုံးကို transaction တစ်ခုတည်းအနေနဲ့ restore လုပ်သင့်သလား စဉ်းစားပါ။ အဲဒါ လုပ်ဖို့ — psql ဒါမှမဟုတ် pg_restore ကို `-1` ဒါမှမဟုတ် `--single-transaction` command-line option နဲ့ ခေါ်ပါ။ ဒီ mode သုံးတဲ့အခါ — အသေးငယ်ဆုံး error တစ်ခုတောင် restore တစ်ခုလုံးကို rollback ဖြစ်စေပြီး — နာရီပေါင်းများစွာ လုပ်ဆောင်ခဲ့ရတာတွေကို ပစ်ပယ်လိုက်နိုင်ပါတယ်။ Data တွေ တစ်ခုနဲ့တစ်ခု ဘယ်လောက် ဆက်စပ်နေလဲပေါ် မူတည်ပြီး — ဒါက ကိုယ်တိုင် ရှင်းလင်းရတာထက် ပိုကောင်းတယ်လို့ ထင်ရနိုင်သလို — မထင်ရတာလည်း ဖြစ်နိုင်ပါတယ်။ Transaction တစ်ခုတည်း သုံးပြီး WAL archiving ပိတ်ထားရင် — `COPY` command တွေက အမြန်ဆုံး လည်ပတ်ပါလိမ့်မယ်။
- Database server မှာ CPU အများအပြား ရနိုင်ရင် — pg_restore ရဲ့ `--jobs` option ကို သုံးဖို့ စဉ်းစားပါ။ ဒါက data တွေကို တစ်ပြိုင်နက် load လုပ်ခြင်းနဲ့ index ဖန်တီးခြင်းကို ခွင့်ပြုပါတယ်။
- ပြီးတဲ့နောက် `ANALYZE` လုပ်ပါ။

Data သက်သက် (data-only) dump တစ်ခုကတော့ `COPY` ကို ဆက်သုံးပါသေးတယ် — ဒါပေမယ့် index တွေကို drop ဖြစ်စေ ပြန်ဖန်တီးဖြစ်စေ မလုပ်ဘဲ — foreign key တွေကိုလည်း ပုံမှန်အားဖြင့် မထိပါဘူး။ [14] ဒါကြောင့် — data-only dump တစ်ခုကို တင်တဲ့အခါ — ဒီနည်းစနစ်တွေကို သုံးချင်ရင် — index နဲ့ foreign key တွေကို drop လုပ်ပြီး ပြန်ဖန်တီးတာဟာ သင့်တာဝန် ဖြစ်ပါတယ်။ Data တွေ တင်နေစဉ် `max_wal_size` ကို မြှင့်ထားတာက အသုံးဝင်နေဆဲ ဖြစ်ပေမယ့် — `maintenance_work_mem` မြှင့်ဖို့တော့ မလိုပါဘူး — အဲဒါကို နောက်မှ index နဲ့ foreign key တွေကို ကိုယ်တိုင် ပြန်ဖန်တီးနေစဉ်မှာ မြှင့်သင့်ပါတယ်။ ပြီးသွားရင် `ANALYZE` လုပ်ဖို့လည်း မမေ့ပါနဲ့ — နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 24.1.3](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-STATISTICS) နဲ့ [အပိုင်း 24.1.6](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) ကို ကြည့်ပါ။

---

[14] `--disable-triggers` option ကို သုံးပြီး — foreign key တွေ disable လုပ်တာနဲ့ ညီမျှတဲ့ အကျိုးသက်ရောက်မှုကို ရနိုင်ပါတယ် — ဒါပေမယ့် အဲဒါက foreign key validation ကို ရွှေ့ဆိုင်းထားရုံ သက်သက် မဟုတ်ဘဲ — လုံးဝ ဖယ်ရှားပစ်တာ ဖြစ်လို့ — သုံးမိရင် data မှားယွင်းတွေ ထည့်မိဖို့ ဖြစ်နိုင်တယ်ဆိုတာ သတိထားပါ။
