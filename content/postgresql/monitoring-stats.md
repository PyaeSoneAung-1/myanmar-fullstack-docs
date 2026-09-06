---
title: "The Cumulative Statistics System (စုစည်း စာရင်းအင်း စနစ်)"
description: "PostgreSQL ၏ cumulative statistics system (server လုပ်ဆောင်ချက် အကြောင်း အချက်အလက်များကို စုဆောင်း/အစီရင်ခံသည့် စနစ်) အကြောင်း ရှင်းလင်းချက် — statistics collection configuration (postgresql.conf ရှိ track_activities, track_counts, track_functions, track_io_timing, track_wal_io_timing, track_cost_delay_timing စသော configuration parameters များ, SET command, shared memory တွင် စုဆောင်းခြင်းနှင့် pg_stat subdirectory, unclean shutdown များတွင် statistics counters အားလုံး reset ဖြစ်ခြင်း), statistics များကို ကြည့်ရှုခြင်း (Table 27.1 Dynamic Statistics Views နှင့် Table 27.2 Collected Statistics Views ၏ view များစာရင်းနှင့် ဖော်ပြချက်များ, statistics data များ ချက်ချင်း update မဖြစ်ဘဲ PGSTAT_MIN_INTERVAL ကြားကာလဖြင့် flush လုပ်ခြင်း, stats_fetch_consistency (cache/snapshot/none) နှင့် pg_stat_clear_snapshot(), pg_stat_xact_* views များ, dynamic statistics views များ၏ security restriction နှင့် pg_read_all_stats built-in role) — ထို့ပြင် 27.2.3 မှ 27.2.26 အထိ pg_stat_activity, pg_stat_replication, pg_stat_wal_receiver, pg_stat_archiver, pg_stat_io, pg_stat_database, pg_stat_all_tables, pg_statio_* views များနှင့် statistics functions များအကြောင်း အသေးစိတ်"
order: 194
source: "https://www.postgresql.org/docs/current/monitoring-stats.html"
status: translated
updated: 2026-09-06
---

## 27.2. The Cumulative Statistics System (စုစည်း စာရင်းအင်း စနစ်)

- **27.2.1. Statistics Collection Configuration (Statistics စုဆောင်းမှု ပြင်ဆင်သတ်မှတ်ခြင်း)**
- **27.2.2. Viewing Statistics (Statistics များကို ကြည့်ရှုခြင်း)**
- **27.2.3. pg_stat_activity**
- **27.2.4. pg_stat_replication**
- **27.2.5. pg_stat_replication_slots**
- **27.2.6. pg_stat_wal_receiver**
- **27.2.7. pg_stat_recovery_prefetch**
- **27.2.8. pg_stat_subscription**
- **27.2.9. pg_stat_subscription_stats**
- **27.2.10. pg_stat_ssl**
- **27.2.11. pg_stat_gssapi**
- **27.2.12. pg_stat_archiver**
- **27.2.13. pg_stat_io**
- **27.2.14. pg_stat_bgwriter**
- **27.2.15. pg_stat_checkpointer**
- **27.2.16. pg_stat_wal**
- **27.2.17. pg_stat_database**
- **27.2.18. pg_stat_database_conflicts**
- **27.2.19. pg_stat_all_tables**
- **27.2.20. pg_stat_all_indexes**
- **27.2.21. pg_statio_all_tables**
- **27.2.22. pg_statio_all_indexes**
- **27.2.23. pg_statio_all_sequences**
- **27.2.24. pg_stat_user_functions**
- **27.2.25. pg_stat_slru**
- **27.2.26. Statistics Functions (Statistics function များ)**

PostgreSQL ရဲ့ *cumulative statistics system* (စုစည်း စာရင်းအင်း စနစ်) က — server ရဲ့ လုပ်ဆောင်ချက်တွေ အကြောင်း အချက်အလက်တွေကို စုဆောင်းခြင်းနဲ့ အစီရင်ခံခြင်းကို ထောက်ပံ့ပေးပါတယ်။ လက်ရှိမှာ — tables နဲ့ indexes တွေဆီ ဝင်ရောက်မှု (access) တွေကို — disk-block (disk ပေါ်က block) ပုံစံနဲ့ရော သီးခြား row တစ်ခုချင်းစီ ပုံစံနဲ့ပါ ရေတွက်ပါတယ်။ Table တစ်ခုချင်းစီမှာ ရှိတဲ့ rows စုစုပေါင်း အရေအတွက်နဲ့ — table တစ်ခုချင်းစီအတွက် vacuum နဲ့ analyze လုပ်ဆောင်မှုတွေ အကြောင်း အချက်အလက်တွေကိုလည်း ရေတွက်ပါတယ်။ Enable (ဖွင့်) လုပ်ထားရင် — user-defined functions (user သတ်မှတ်သော function များ) တွေကို ခေါ်ယူမှုတွေနဲ့ — function တစ်ခုချင်းစီမှာ ကုန်ဆုံးခဲ့တဲ့ စုစုပေါင်း အချိန်တွေကိုပါ ရေတွက်ပါတယ်။

PostgreSQL က — system ထဲမှာ လက်ရှိ ဘာတွေ ဖြစ်ပျက်နေလဲဆိုတာနဲ့ ပတ်သက်တဲ့ dynamic အချက်အလက်တွေကိုလည်း အစီရင်ခံပေးပါတယ် — ဥပမာ — တခြား server processes တွေက လက်ရှိ execute (လုပ်ဆောင်) လုပ်နေတဲ့ တိကျတဲ့ command နဲ့ — system ထဲမှာ ရှိနေတဲ့ တခြား connections တွေက ဘာတွေလဲ ဆိုတာမျိုးပါ။ ဒီ facility က cumulative statistics system နဲ့ သီးခြား လွတ်လပ်ပါတယ်။

### 27.2.1. Statistics Collection Configuration (Statistics စုဆောင်းမှု ပြင်ဆင်သတ်မှတ်ခြင်း)

Statistics စုဆောင်းမှုက query execution (query လုပ်ဆောင်မှု) အပေါ်မှာ overhead (ထပ်ဆောင်း ဝန်ထုပ်) တစ်ချို့ ထပ်ပေါင်း ပေးတာမို့ — system ကို အချက်အလက်တွေ စုဆောင်းမှု ပြုလုပ်ရန် ဒါမှမဟုတ် မပြုလုပ်ရန် ပြင်ဆင် သတ်မှတ်နိုင်ပါတယ်။ ဒါကို ပုံမှန်အားဖြင့် `postgresql.conf` ထဲမှာ သတ်မှတ်လေ့ ရှိတဲ့ configuration parameters တွေက ထိန်းချုပ်ပါတယ်။ (Configuration parameters တွေ သတ်မှတ်ပုံနဲ့ ပတ်သက်တဲ့ အသေးစိတ်အတွက် [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) ကို ကြည့်ပါ။)

[track_activities](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-ACTIVITIES) parameter က — server process ဘယ်ခုမဆို လက်ရှိ execute လုပ်နေတဲ့ command ကို စောင့်ကြည့်မှု (monitoring) ကို enable လုပ်ပေးပါတယ်။

[track_cost_delay_timing](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-COST-DELAY-TIMING) parameter က — cost-based vacuum delay (ကုန်ကျစရိတ် အခြေခံ vacuum နှောင့်နှေးမှု) ကို စောင့်ကြည့်မှုကို enable လုပ်ပေးပါတယ်။

[track_counts](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-COUNTS) parameter က — table နဲ့ index ဝင်ရောက်မှုတွေ အကြောင်း cumulative statistics တွေကို စုဆောင်းမလား ဆိုတာကို ထိန်းချုပ်ပါတယ်။

[track_functions](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-FUNCTIONS) parameter က — user-defined functions တွေရဲ့ အသုံးပြုမှုကို ခြေရာခံ (track) လုပ်ခြင်းကို enable လုပ်ပေးပါတယ်။

[track_io_timing](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-IO-TIMING) parameter က — block read (block ဖတ်ခြင်း), write (ရေးခြင်း), extend (တိုးချဲ့ခြင်း) နဲ့ fsync အချိန်တွေကို စောင့်ကြည့်မှုကို enable လုပ်ပေးပါတယ်။

[track_wal_io_timing](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-WAL-IO-TIMING) parameter က — WAL read, write နဲ့ fsync အချိန်တွေကို စောင့်ကြည့်မှုကို enable လုပ်ပေးပါတယ်။

ပုံမှန်အားဖြင့် — ဒီ parameters တွေက server processes အားလုံးနဲ့ သက်ဆိုင်စေဖို့ `postgresql.conf` ထဲမှာ သတ်မှတ်ပါတယ် — ဒါပေမယ့် session တစ်ခုချင်းစီမှာ [SET](https://www.postgresql.org/docs/current/sql-set.html) command ကို သုံးပြီး ဒါတွေကို ဖွင့်/ပိတ် လုပ်ဖို့လည်း ဖြစ်နိုင်ပါတယ်။ (သာမန် users တွေ သူတို့ရဲ့ လုပ်ဆောင်ချက်တွေကို administrator ဆီကနေ ဖုံးကွယ်နိုင်တာ မဖြစ်အောင် — `SET` သုံးပြီး ဒီ parameters တွေကို ပြောင်းလဲခွင့်က superusers တွေပဲ ရှိပါတယ်။)

Cumulative statistics တွေကို shared memory (process များကြား မျှဝေသုံးသော memory) ထဲမှာ စုဆောင်းပါတယ်။ PostgreSQL process တိုင်းက statistics တွေကို ဒေသအလိုက် (locally) စုဆောင်းပြီး — သင့်လျော်တဲ့ ကြားကာလတွေမှာ မျှဝေထားတဲ့ data ကို update လုပ်ပါတယ်။ Physical replica တစ်ခု အပါအဝင် — server တစ်ခုက သန့်ရှင်းစွာ (cleanly) ပိတ်သွားတဲ့အခါ — statistics data ရဲ့ အမြဲတမ်း မိတ္တူ (permanent copy) တစ်ခုကို `pg_stat` subdirectory ထဲမှာ သိမ်းဆည်းပြီး — server restarts (server ပြန်လည် စတင်မှုများ) ကြားမှာ statistics တွေ ထိန်းသိမ်းနိုင်ပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — သန့်ရှင်းမှု မရှိတဲ့ shutdown (unclean shutdown) တစ်ခုကနေ စတင်တဲ့အခါ (ဥပမာ — immediate shutdown (ချက်ချင်း ပိတ်ခြင်း) ပြီးနောက်၊ server crash (server ပျက်ကျမှု)၊ base backup (အခြေခံ backup) တစ်ခုကနေ စတင်ခြင်း နဲ့ point-in-time recovery (အချိန် သတ်မှတ်ချက်အရ ပြန်လည် ရယူခြင်း) တို့ ဖြစ်ပါတယ်) — statistics counters (ရေတွက်ကိန်းများ) အားလုံးကို ပြန်လည် သတ်မှတ် (reset) ပါတယ်။

### 27.2.2. Viewing Statistics (Statistics များကို ကြည့်ရှုခြင်း)

System ရဲ့ လက်ရှိ အခြေအနေကို ပြသဖို့ — [ဇယား 27.1](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-DYNAMIC-VIEWS-TABLE) မှာ စာရင်းပြုထားတဲ့ — ကြိုတင် သတ်မှတ်ထားသော (predefined) views အများအပြား ရနိုင်ပါတယ်။ စုဆောင်းထားတဲ့ statistics တွေကို ပြသဖို့ — [ဇယား 27.2](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-VIEWS-TABLE) မှာ စာရင်းပြုထားတဲ့ — view တခြား များစွာလည်း ရှိပါတယ်။ တနည်းအားဖြင့် — [အပိုင်း 27.2.26](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-FUNCTIONS) မှာ ဆွေးနွေးထားတဲ့အတိုင်း — အောက်ခံ cumulative statistics functions တွေကို သုံးပြီး ကိုယ်ပိုင် custom views တွေလည်း တည်ဆောက်နိုင်ပါတယ်။

Cumulative statistics views နဲ့ functions တွေကို သုံးပြီး စုဆောင်းထားတဲ့ data တွေကို စောင့်ကြည့်တဲ့အခါ — အချက်အလက်တွေက ချက်ချင်း (instantaneously) update မဖြစ်ဘူးဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်။ Server process တစ်ခုချင်းစီက စုဆောင်းထားတဲ့ statistics တွေကို — idle (မလှုပ်ရှား) အဖြစ် မပြောင်းခင် — shared memory ဆီ ထုတ်လွှတ် (flush) ပေးပါတယ် — ဒါပေမယ့် `PGSTAT_MIN_INTERVAL` milliseconds (server ကို တည်ဆောက်စဉ် မပြောင်းလဲထားဘူးဆိုရင် 1 စက္ကန့်) တစ်ကြိမ်ထက် မကြာခဏ မပိုပါဘူး။ ဒါကြောင့် — လုပ်ဆောင်နေဆဲ query ဒါမှမဟုတ် transaction တစ်ခုက ပြသထားတဲ့ စုစုပေါင်း (totals) တွေအပေါ် သက်ရောက်မှု မရှိဘဲ — ပြသတဲ့ အချက်အလက်က တကယ့် လုပ်ဆောင်မှုနဲ့ နှိုင်းယှဉ်ရင် နောက်ကျ (lag) နေတတ်ပါတယ်။ ဒါပေမယ့် — `track_activities` က စုဆောင်းတဲ့ current-query အချက်အလက်ကတော့ အမြဲတမ်း နောက်ဆုံး အခြေအနေနဲ့ ကိုက်ညီ (up-to-date) နေပါတယ်။

နောက်ထပ် အရေးကြီးတဲ့ အချက်တစ်ခုကတော့ — server process တစ်ခုကို စုဆောင်းထားတဲ့ statistics တစ်ခုခုကို ပြသဖို့ တောင်းဆိုတဲ့အခါ — default configuration မှာ — access လုပ်လိုက်တဲ့ တန်ဖိုးတွေကို သူ့ရဲ့ လက်ရှိ transaction ရဲ့ အဆုံးအထိ cache (ကက်ရှ် — သိမ်းဆည်း) လုပ်ထားပါတယ်။ ဒါကြောင့် — လက်ရှိ transaction ကို ဆက်ထားသရွေ့ — statistics တွေက ပုံသေ (static) အချက်အလက်တွေကိုပဲ ပြသပါလိမ့်မယ်။ အလားတူပဲ — session အားလုံးရဲ့ current queries တွေအကြောင်း အချက်အလက်ကို transaction တစ်ခုအတွင်းမှာ ပထမဆုံးအကြိမ် တောင်းဆိုလိုက်တဲ့အခါ စုဆောင်းပြီး — transaction တစ်ခုလုံး အတွင်းမှာ အဲဒီ အချက်အလက်တွေကိုပဲ ပြသမှာ ဖြစ်ပါတယ်။ ဒါက bug (ချွတ်ယွင်းချက်) မဟုတ်ဘဲ feature (လုပ်ဆောင်ချက် အသွင်အပြင်) တစ်ခုပါ — အကြောင်းကတော့ ဒါကြောင့် — သင့်အောက်မှာ ဂဏန်းတွေ ပြောင်းလဲနေမှာကို ပူစရာ မလိုဘဲ — statistics တွေအပေါ်မှာ query အများအပြား လုပ်ဆောင်ပြီး ရလဒ်တွေကို ဆက်စပ် (correlate) လုပ်နိုင်လို့ပါ။ Statistics တွေကို interactive (တိုက်ရိုက် မေးမြန်း) အနေနဲ့ ဒါမှမဟုတ် ကုန်ကျစရိတ် ကြီးတဲ့ queries တွေနဲ့ ခွဲခြမ်း စိတ်ဖြာတဲ့အခါ — statistics တစ်ခုချင်းစီကို access လုပ်မှုတွေကြားက အချိန် ကွာဟချက် (time delta) က — cache လုပ်ထားတဲ့ statistics တွေမှာ သိသာတဲ့ skew (ပုံပျက်မှု) ဖြစ်စေနိုင်ပါတယ်။ Skew ကို အနည်းဆုံး ဖြစ်အောင် လုပ်ဖို့ — `stats_fetch_consistency` ကို `snapshot` တန်ဖိုးနဲ့ သတ်မှတ်နိုင်ပါတယ် — ဒါပေမယ့် မလိုအပ်တဲ့ statistics data တွေကို cache လုပ်ထားရတဲ့အတွက် — memory သုံးစွဲမှု ပိုများတဲ့ စျေးနဲ့ပါ။ ဆန့်ကျင်ဘက်အနေနဲ့ — statistics တွေကို တစ်ကြိမ်ပဲ access လုပ်တယ်ဆိုတာ သိရင် — access လုပ်ထားတဲ့ statistics တွေကို cache လုပ်ထားဖို့ မလိုအပ်ဘဲ — `stats_fetch_consistency` ကို `none` လို့ သတ်မှတ်ခြင်းအားဖြင့် ရှောင်ရှားနိုင်ပါတယ်။ လက်ရှိ transaction ရဲ့ statistics snapshot (ထိုအခိုက် ပုံရိပ်) ဒါမှမဟုတ် cache လုပ်ထားတဲ့ တန်ဖိုးတွေ (ရှိရင်) ကို စွန့်ပစ်ဖို့ `pg_stat_clear_snapshot()` ကို ခေါ်နိုင်ပါတယ်။ နောက်တစ်ကြိမ် statistics အချက်အလက်တွေ သုံးတဲ့အခါ — (snapshot mode မှာဆိုရင်) snapshot အသစ် တစ်ခု တည်ဆောက်မှာ ဒါမှမဟုတ် — (cache mode မှာဆိုရင်) access လုပ်တဲ့ statistics တွေကို cache လုပ်မှာ ဖြစ်ပါတယ်။

Transaction တစ်ခုက — `pg_stat_xact_all_tables`, `pg_stat_xact_sys_tables`, `pg_stat_xact_user_tables` နဲ့ `pg_stat_xact_user_functions` views တွေထဲမှာ — သူ့ကိုယ်ပိုင် statistics တွေကို (အထက်မှာ ဖော်ပြခဲ့တဲ့အတိုင်း shared memory statistics ထဲ ထုတ်လွှတ်ပြီးသား မဟုတ်သေးတဲ့) မြင်နိုင်ပါတယ်။ ဒီ ဂဏန်းတွေက အထက်မှာ ဖော်ပြခဲ့တဲ့အတိုင်း ပြုမူတာ မဟုတ်ဘဲ — transaction တစ်ခုလုံး အတွင်းမှာ စဉ်ဆက်မပြတ် update ဖြစ်နေပါတယ်။

[ဇယား 27.1](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-DYNAMIC-VIEWS-TABLE) မှာ ပြထားတဲ့ dynamic statistics views တွေထဲက အချက်အလက် တစ်ချို့ကို security (လုံခြုံရေး) ဆိုင်ရာ ကန့်သတ်ချက်တွေ ရှိပါတယ်။ သာမန် users တွေက — သူတို့ကိုယ်ပိုင် sessions တွေ (သူတို့ အဖွဲ့ဝင် (member) ဖြစ်တဲ့ role တစ်ခုက ပိုင်ဆိုင်တဲ့ sessions) အကြောင်း အချက်အလက် အားလုံးကိုပဲ မြင်နိုင်ပါတယ်။ တခြား sessions တွေအကြောင်း rows တွေမှာတော့ — column အများအပြားက null ဖြစ်ပါလိမ့်မယ်။ ဒါပေမယ့် — session တစ်ခု တည်ရှိနေမှုနဲ့ — session ရဲ့ user နဲ့ database လို — ၎င်းရဲ့ ယေဘုယျ ဂုဏ်သတ္တိတွေကိုတော့ users အားလုံး မြင်နိုင်တာ သတိပြုပါ။ Superusers တွေနဲ့ built-in role (တပ်ဆင်ပါ role) [`pg_read_all_stats`](https://www.postgresql.org/docs/current/predefined-roles.html#PREDEFINED-ROLE-PG-MONITOR) ရဲ့ အခွင့်ထူးတွေ ရှိတဲ့ roles တွေက — sessions အားလုံးအကြောင်း အချက်အလက် အားလုံးကို မြင်နိုင်ပါတယ်။

**ဇယား 27.1. Dynamic Statistics Views (Dynamic statistics views များ)**

| View Name | ဖော်ပြချက် |
| --- | --- |
| `pg_stat_activity` []() | Server process တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ process ရဲ့ လက်ရှိ လုပ်ဆောင်ချက်နဲ့ ဆက်စပ်တဲ့ အချက်အလက်တွေကို ပြသပါတယ် — ဥပမာ state (အခြေအနေ) နဲ့ current query (လက်ရှိ query) လိုမျိုးပါ။ အသေးစိတ်အတွက် [`pg_stat_activity`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_replication`[]() | WAL sender process တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ sender နဲ့ ချိတ်ဆက်ထားတဲ့ standby server ဆီကို ပြုလုပ်တဲ့ replication (ပုံတူပွား ဒေတာ လွှဲပြောင်းမှု) အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_replication`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_wal_receiver`[]() | Row တစ်ခုတည်းသာ — အဲဒီ receiver နဲ့ ချိတ်ဆက်ထားတဲ့ server ဆီကနေ WAL ကို လက်ခံတဲ့ WAL receiver အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_wal_receiver`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_recovery_prefetch`[]() | Row တစ်ခုတည်းသာ — recovery (ပြန်လည် ရယူခြင်း) လုပ်နေစဉ် prefetch (ကြိုတင် ယူဆောင်) လုပ်ခဲ့တဲ့ blocks အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_recovery_prefetch`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH) ကို ကြည့်ပါ။ |
| `pg_stat_subscription`[]() | Subscription တစ်ခုချင်းစီအတွက် အနည်းဆုံး row တစ်ခုနှုန်း — subscription workers တွေအကြောင်း အချက်အလက်တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_subscription`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION) ကို ကြည့်ပါ။ |
| `pg_stat_ssl`[]() | Connection တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း (ပုံမှန် နဲ့ replication နှစ်မျိုးလုံး) — ဒီ connection ပေါ်မှာ သုံးထားတဲ့ SSL အကြောင်း အချက်အလက်တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_ssl`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_gssapi`[]() | Connection တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း (ပုံမှန် နဲ့ replication နှစ်မျိုးလုံး) — ဒီ connection ပေါ်မှာ သုံးထားတဲ့ GSSAPI authentication နဲ့ encryption (ကုဒ်ဝှက်ခြင်း) အကြောင်း အချက်အလက်တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_gssapi`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_progress_analyze`[]() | `ANALYZE` run လုပ်နေတဲ့ backend တစ်ခုချင်းစီအတွက် (autovacuum worker processes တွေ အပါအဝင်) row တစ်ခုနှုန်း — လက်ရှိ တိုးတက်မှု (progress) ကို ပြသပါတယ်။ [အပိုင်း 27.4.1](https://www.postgresql.org/docs/current/progress-reporting.html#ANALYZE-PROGRESS-REPORTING) ကို ကြည့်ပါ။ |
| `pg_stat_progress_create_index`[]() | `CREATE INDEX` ဒါမှမဟုတ် `REINDEX` run လုပ်နေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — လက်ရှိ progress ကို ပြသပါတယ်။ [အပိုင်း 27.4.4](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING) ကို ကြည့်ပါ။ |
| `pg_stat_progress_vacuum`[]() | `VACUUM` run လုပ်နေတဲ့ backend တစ်ခုချင်းစီအတွက် (autovacuum worker processes တွေ အပါအဝင်) row တစ်ခုနှုန်း — လက်ရှိ progress ကို ပြသပါတယ်။ [အပိုင်း 27.4.5](https://www.postgresql.org/docs/current/progress-reporting.html#VACUUM-PROGRESS-REPORTING) ကို ကြည့်ပါ။ |
| `pg_stat_progress_cluster`[]() | `CLUSTER` ဒါမှမဟုတ် `VACUUM FULL` run လုပ်နေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — လက်ရှိ progress ကို ပြသပါတယ်။ [အပိုင်း 27.4.2](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING) ကို ကြည့်ပါ။ |
| `pg_stat_progress_basebackup`[]() | Base backup (အခြေခံ backup) တစ်ခုကို stream (စီးဆင်း ပို့လွှတ်) လုပ်နေတဲ့ WAL sender process တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — လက်ရှိ progress ကို ပြသပါတယ်။ [အပိုင်း 27.4.6](https://www.postgresql.org/docs/current/progress-reporting.html#BASEBACKUP-PROGRESS-REPORTING) ကို ကြည့်ပါ။ |
| `pg_stat_progress_copy`[]() | `COPY` run လုပ်နေတဲ့ backend တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — လက်ရှိ progress ကို ပြသပါတယ်။ [အပိုင်း 27.4.3](https://www.postgresql.org/docs/current/progress-reporting.html#COPY-PROGRESS-REPORTING) ကို ကြည့်ပါ။ |

**ဇယား 27.2. Collected Statistics Views (စုဆောင်းထားသော statistics views များ)**

| View Name | ဖော်ပြချက် |
| --- | --- |
| `pg_stat_archiver`[]() | Row တစ်ခုတည်းသာ — WAL archiver process ရဲ့ လုပ်ဆောင်ချက်တွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_archiver`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_bgwriter`[]() | Row တစ်ခုတည်းသာ — background writer process ရဲ့ လုပ်ဆောင်ချက်တွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_bgwriter`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_checkpointer`[]() | Row တစ်ခုတည်းသာ — checkpointer process ရဲ့ လုပ်ဆောင်ချက်တွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_checkpointer`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-CHECKPOINTER-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_database`[]() | Database တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — database တစ်ခုလုံးနဲ့ ဆိုင်တဲ့ statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_database`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_database_conflicts`[]() | Database တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — standby servers တွေပေါ်မှာ recovery နဲ့ ပဋိပက္ခ (conflict) ဖြစ်လို့ query တွေ cancel (ဖျက်သိမ်း) ခံရမှုနဲ့ ဆိုင်တဲ့ — database တစ်ခုလုံး အတိုင်းအတာ statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_database_conflicts`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_io`[]() | Cluster တစ်ခုလုံးနဲ့ ဆိုင်တဲ့ I/O statistics တွေ ပါဝင်တဲ့ — backend type, context နဲ့ target object ရဲ့ ပေါင်းစပ်မှု (combination) တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_io`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_replication_slots`[]() | Replication slot (ပုံတူပွား ဒေတာ လွှဲပြောင်းမှုအတွက် slot) တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — replication slot ရဲ့ အသုံးပြုမှုအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_replication_slots`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_slru`[]() | SLRU တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — လုပ်ဆောင်ချက်တွေရဲ့ statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_slru`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_subscription_stats`[]() | Subscription တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — errors (အမှားများ) နဲ့ conflicts (ပဋိပက္ခများ) အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_subscription_stats`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS) ကို ကြည့်ပါ။ |
| `pg_stat_wal`[]() | Row တစ်ခုတည်းသာ — WAL လုပ်ဆောင်ချက်တွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_wal`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_all_tables`[]() | လက်ရှိ database ထဲက table တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ တိကျတဲ့ table ဆီ ဝင်ရောက်မှုတွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_all_tables`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_sys_tables`[]() | `pg_stat_all_tables` နဲ့ အတူတူပဲ — ခြားနားချက်က system tables (စနစ် table များ) တွေကိုပဲ ပြသပါတယ်။ |
| `pg_stat_user_tables`[]() | `pg_stat_all_tables` နဲ့ အတူတူပဲ — ခြားနားချက်က user tables (user table များ) တွေကိုပဲ ပြသပါတယ်။ |
| `pg_stat_xact_all_tables`[]() | `pg_stat_all_tables` နဲ့ ဆင်တူပေမယ့် — လက်ရှိ transaction အတွင်းမှာ ဆောင်ရွက်ပြီးသား လုပ်ဆောင်ချက်တွေကိုပဲ ရေတွက်ပါတယ် (အဲဒါတွေက `pg_stat_all_tables` နဲ့ ဆက်စပ် views တွေထဲမှာ မပါသေးပါဘူး)။ Live နဲ့ dead rows တွေရဲ့ အရေအတွက်နဲ့ vacuum နဲ့ analyze လုပ်ဆောင်ချက်တွေအတွက် column တွေကတော့ ဒီ view ထဲမှာ မပါဝင်ပါဘူး။ |
| `pg_stat_xact_sys_tables`[]() | `pg_stat_xact_all_tables` နဲ့ အတူတူပဲ — ခြားနားချက်က system tables တွေကိုပဲ ပြသပါတယ်။ |
| `pg_stat_xact_user_tables`[]() | `pg_stat_xact_all_tables` နဲ့ အတူတူပဲ — ခြားနားချက်က user tables တွေကိုပဲ ပြသပါတယ်။ |
| `pg_stat_all_indexes`[]() | လက်ရှိ database ထဲက index တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ တိကျတဲ့ index ဆီ ဝင်ရောက်မှုတွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_all_indexes`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_sys_indexes`[]() | `pg_stat_all_indexes` နဲ့ အတူတူပဲ — ခြားနားချက်က system tables တွေပေါ်က indexes တွေကိုပဲ ပြသပါတယ်။ |
| `pg_stat_user_indexes`[]() | `pg_stat_all_indexes` နဲ့ အတူတူပဲ — ခြားနားချက်က user tables တွေပေါ်က indexes တွေကိုပဲ ပြသပါတယ်။ |
| `pg_stat_user_functions`[]() | Track (ခြေရာခံ) လုပ်ထားတဲ့ function တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ function ရဲ့ execute လုပ်မှုတွေအကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_stat_user_functions`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW) ကို ကြည့်ပါ။ |
| `pg_stat_xact_user_functions`[]() | `pg_stat_user_functions` နဲ့ ဆင်တူပေမယ့် — လက်ရှိ transaction အတွင်းက ခေါ်ယူမှုတွေကိုပဲ ရေတွက်ပါတယ် (အဲဒါတွေက `pg_stat_user_functions` ထဲမှာ မပါသေးပါဘူး)။ |
| `pg_statio_all_tables`[]() | လက်ရှိ database ထဲက table တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ တိကျတဲ့ table ပေါ်က I/O အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_statio_all_tables`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW) ကို ကြည့်ပါ။ |
| `pg_statio_sys_tables`[]() | `pg_statio_all_tables` နဲ့ အတူတူပဲ — ခြားနားချက်က system tables တွေကိုပဲ ပြသပါတယ်။ |
| `pg_statio_user_tables`[]() | `pg_statio_all_tables` နဲ့ အတူတူပဲ — ခြားနားချက်က user tables တွေကိုပဲ ပြသပါတယ်။ |
| `pg_statio_all_indexes`[]() | လက်ရှိ database ထဲက index တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ တိကျတဲ့ index ပေါ်က I/O အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_statio_all_indexes`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW) ကို ကြည့်ပါ။ |
| `pg_statio_sys_indexes`[]() | `pg_statio_all_indexes` နဲ့ အတူတူပဲ — ခြားနားချက်က system tables တွေပေါ်က indexes တွေကိုပဲ ပြသပါတယ်။ |
| `pg_statio_user_indexes`[]() | `pg_statio_all_indexes` နဲ့ အတူတူပဲ — ခြားနားချက်က user tables တွေပေါ်က indexes တွေကိုပဲ ပြသပါတယ်။ |
| `pg_statio_all_sequences`[]() | လက်ရှိ database ထဲက sequence တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — အဲဒီ တိကျတဲ့ sequence ပေါ်က I/O အကြောင်း statistics တွေကို ပြသပါတယ်။ အသေးစိတ်အတွက် [`pg_statio_all_sequences`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW) ကို ကြည့်ပါ။ |
| `pg_statio_sys_sequences`[]() | `pg_statio_all_sequences` နဲ့ အတူတူပဲ — ခြားနားချက်က system sequences (စနစ် sequence များ) တွေကိုပဲ ပြသပါတယ်။ (လက်ရှိမှာ system sequences တွေ သတ်မှတ်ထားတာ မရှိသေးလို့ — ဒီ view က အမြဲတမ်း ဗလာ ဖြစ်ပါတယ်။) |
| `pg_statio_user_sequences`[]() | `pg_statio_all_sequences` နဲ့ အတူတူပဲ — ခြားနားချက်က user sequences (user sequence များ) တွေကိုပဲ ပြသပါတယ်။ |

Index တစ်ခုချင်းစီအလိုက် (per-index) statistics တွေက — ဘယ် indexes တွေကို အသုံးပြုနေလဲ နဲ့ အဲဒါတွေက ဘယ်လောက် ထိရောက်လဲဆိုတာ ဆုံးဖြတ်ဖို့ အထူး အသုံးဝင်ပါတယ်။

`pg_stat_io` နဲ့ `pg_statio_` views အစုတွေက — buffer cache (buffer သိမ်းဆည်းမှု ကက်ရှ်) ရဲ့ ထိရောက်မှုကို ဆုံးဖြတ်ဖို့ အသုံးဝင်ပါတယ်။ Cache hit ratio (cache ထိမှန်မှု အချိုး) တစ်ခု တွက်ချက်ဖို့ ဒါတွေကို သုံးနိုင်ပါတယ်။ PostgreSQL ရဲ့ I/O statistics တွေက — I/O လုပ်ဆောင်ဖို့ kernel ကို ခေါ်ယူ (invoke) ခဲ့ရတဲ့ ဖြစ်ရပ် အများစုကို ဖမ်းယူနိုင်ပေမယ့် — disk ကနေ ထုတ်ယူ ရယူခဲ့ရတဲ့ data နဲ့ kernel page cache (kernel ၏ page cache) ထဲမှာ ကတည်းက ရှိနှင့်ပြီးသား data တို့ကို ခွဲခြား မပြဘူးဆိုတာ သတိပြုပါ။ Users တွေအနေနဲ့ — သူတို့ database ရဲ့ I/O performance (လုပ်ဆောင်စွမ်းအား) အကြောင်း ပိုပြည့်စုံတဲ့ ပုံရိပ် တစ်ခု ရရှိဖို့ — PostgreSQL statistics views တွေကို operating system utilities (လည်ပတ်မှုစနစ် utility များ) တွေနဲ့ တွဲဖက် အသုံးပြုဖို့ အကြံပြုပါတယ်။

### 27.2.3. `pg_stat_activity` (server process များ၏ လက်ရှိ လုပ်ဆောင်ချက် အခြေအနေကို ပြသသော view)

`pg_stat_activity` view မှာ — server process တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ process ၏ လက်ရှိ လုပ်ဆောင်ချက်နဲ့ ဆက်စပ်တဲ့ အချက်အလက်တွေကို ပြသပါတယ်။

**ဇယား 27.3. pg_stat_activity View (pg_stat_activity view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `datid` | `oid` | ဤ backend ချိတ်ဆက်ထားသော database ၏ OID |
| `datname` | `name` | ဤ backend ချိတ်ဆက်ထားသော database ၏ အမည် |
| `pid` | `integer` | ဤ backend ၏ process ID |
| `leader_pid` | `integer` | ဤ process သည် parallel query worker (အပြိုင် query လုပ်သော worker) ဖြစ်ပါက parallel group leader ၏ process ID ဖြစ်ပြီး — ဤ process သည် parallel apply worker (အပြိုင် apply လုပ်သော worker) ဖြစ်ပါက leader apply worker ၏ process ID ဖြစ်ပါတယ်။ `NULL` ဖြစ်နေခြင်းက — ဤ process သည် parallel group leader သို့မဟုတ် leader apply worker ဖြစ်သည် သို့မဟုတ် မည်သည့် parallel လုပ်ဆောင်မှုတွင်မှ မပါဝင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `usesysid` | `oid` | ဤ backend ထဲသို့ ဝင်ရောက်ထားသော user ၏ OID |
| `usename` | `name` | ဤ backend ထဲသို့ ဝင်ရောက်ထားသော user ၏ အမည် |
| `application_name` | `text` | ဤ backend နှင့် ချိတ်ဆက်ထားသော application ၏ အမည် |
| `client_addr` | `inet` | ဤ backend နှင့် ချိတ်ဆက်ထားသော client ၏ IP address။ ဤ field သည် null ဖြစ်နေပါက — client သည် server machine ပေါ်ရှိ Unix socket မှတစ်ဆင့် ချိတ်ဆက်ထားခြင်း သို့မဟုတ် — ဤ process သည် autovacuum လို internal process (အတွင်းပိုင်း process) တစ်ခု ဖြစ်ခြင်းကို ညွှန်ပြပါတယ်။ |
| `client_hostname` | `text` | client_addr ၏ reverse DNS lookup (ပြောင်းပြန် DNS ရှာဖွေမှု) အရ အစီရင်ခံထားသော — ချိတ်ဆက်ထားသည့် client ၏ host name။ ဤ field သည် IP connections များအတွက်သာ — ထို့ပြင် `log_hostname` ကို enable လုပ်ထားမှသာ — null မဟုတ်ဘဲ ရှိနေမှာ ဖြစ်ပါတယ်။ |
| `client_port` | `integer` | ဤ backend နှင့် ဆက်သွယ်မှုအတွက် client အသုံးပြုနေသော TCP port နံပါတ် — Unix socket ကို သုံးထားပါက -1 ဖြစ်ပါတယ်။ ဤ field သည် null ဖြစ်နေပါက — ဤသည် internal server process (အတွင်းပိုင်း server process) တစ်ခု ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `backend_start` | `timestamp with time zone` | ဤ process စတင်ခဲ့သည့် အချိန်။ Client backends များအတွက်ဆိုရင် — client က server သို့ ချိတ်ဆက်ခဲ့သည့် အချိန် ဖြစ်ပါတယ်။ |
| `xact_start` | `timestamp with time zone` | ဤ process ၏ လက်ရှိ transaction စတင်ခဲ့သည့် အချိန် — transaction တစ်ခုမျှ လုပ်ဆောင်နေမှု မရှိပါက null ဖြစ်ပါတယ်။ လက်ရှိ query သည် ၎င်း transaction ၏ ပထမဆုံး query ဖြစ်ပါက — ဤ column သည် `query_start` column နှင့် တူညီပါတယ်။ |
| `query_start` | `timestamp with time zone` | လက်ရှိ လုပ်ဆောင်နေသော (active) query စတင်ခဲ့သည့် အချိန် — သို့မဟုတ် state က active မဟုတ်ပါက — နောက်ဆုံး query စတင်ခဲ့သည့် အချိန် ဖြစ်ပါတယ် |
| `state_change` | `timestamp with time zone` | state ကို နောက်ဆုံး ပြောင်းလဲခဲ့သည့် အချိန် |
| `wait_event_type` | `text` | backend က စောင့်ဆိုင်းနေသည့် ဖြစ်ရပ်၏ အမျိုးအစား — စောင့်ဆိုင်းနေသည့် ဖြစ်ရပ် ရှိပါက; မရှိပါက `NULL` ဖြစ်ပါတယ်။ ဇယား 27.4 ကို ကြည့်ပါ။ |
| `wait_event` | `text` | backend က လက်ရှိ စောင့်ဆိုင်းနေပါက wait event ၏ အမည် — မဟုတ်ပါက `NULL` ဖြစ်ပါတယ်။ ဇယား 27.5 မှ ဇယား 27.13 အထိ ကြည့်ပါ။ |
| `state` | `text` | ဤ backend ၏ လက်ရှိ ယေဘုယျ state (အခြေအနေ)။ ဖြစ်နိုင်သော တန်ဖိုးများမှာ: `starting` — backend သည် ကနဦး startup အဆင့်တွင် ရှိနေသည်; ဤအဆင့်အတွင်း client authentication (client စစ်မှန်ကြောင်း စိစစ်ခြင်း) ကို ဆောင်ရွက်ပါတယ်။ `active` — backend သည် query တစ်ခုကို execute (လုပ်ဆောင်) လုပ်နေသည်။ `idle` — backend သည် client command အသစ် တစ်ခုကို စောင့်ဆိုင်းနေသည်။ `idle in transaction` — backend သည် transaction တစ်ခုအတွင်းတွင် ရှိနေသော်လည်း — query တစ်ခုကို လက်ရှိ execute လုပ်နေတာ မဟုတ်ပါ။ `idle in transaction (aborted)` — ဤ state သည် `idle in transaction` နှင့် ဆင်တူသော်လည်း — transaction အတွင်းက statement များထဲမှ တစ်ခုက error (အမှား) ဖြစ်စေခဲ့သည်မှ လွဲ၍ ဖြစ်ပါတယ်။ `fastpath function call` — backend သည် fast-path function တစ်ခုကို execute လုပ်နေသည်။ `disabled` — `track_activities` ကို ဤ backend တွင် disable လုပ်ထားပါက ဤ state ကို အစီရင်ခံပါတယ်။ |
| `backend_xid` | `xid` | ရှိပါက — ဤ backend ၏ top-level transaction identifier (ထိပ်ဆုံးအဆင့် transaction သတ်မှတ်ကိန်း); အပိုင်း 67.1 ကို ကြည့်ပါ။ |
| `backend_xmin` | `xid` | ဤ backend ၏ လက်ရှိ xmin horizon (xmin နယ်နိမိတ်) |
| `query_id` | `bigint` | ဤ backend ၏ နောက်ဆုံး query ၏ identifier။ State က active ဖြစ်ပါက ဤ field သည် လက်ရှိ execute လုပ်နေသော query ၏ identifier ကို ပြသပြီး — အခြား state များအားလုံးတွင် — execute လုပ်ပြီးသွားသော နောက်ဆုံး query ၏ identifier ကို ပြသပါတယ်။ Query identifiers တွေကို default အနေနဲ့ တွက်ချက်မထားတာမို့ — `compute_query_id` parameter ကို enable လုပ်ထားသည် သို့မဟုတ် query identifiers တွေကို တွက်ချက်ပေးသော third-party module (တတိယပါတီ module) တစ်ခုကို ပြင်ဆင် သတ်မှတ်ထားခြင်း မရှိပါက — ဤ field သည် null ဖြစ်နေမှာ ဖြစ်ပါတယ်။ |
| `query` | `text` | ဤ backend ၏ နောက်ဆုံး query ၏ text (စာသား)။ State က active ဖြစ်ပါက ဤ field သည် လက်ရှိ execute လုပ်နေသော query ကို ပြသပြီး — အခြား state များအားလုံးတွင် — execute လုပ်ပြီးသွားသော နောက်ဆုံး query ကို ပြသပါတယ်။ Default အနေနဲ့ query text ကို bytes 1024 တွင် ဖြတ်တောက် (truncate) ပါတယ်; ဤ တန်ဖိုးကို `track_activity_query_size` parameter မှတစ်ဆင့် ပြောင်းလဲနိုင်ပါတယ်။ |
| `backend_type` | `text` | လက်ရှိ backend ၏ အမျိုးအစား။ ဖြစ်နိုင်သော အမျိုးအစားများမှာ — autovacuum launcher, autovacuum worker, logical replication launcher, logical replication worker, parallel worker, background writer, client backend, checkpointer, archiver, standalone backend, startup, walreceiver, walsender, walwriter နှင့် walsummarizer တို့ ဖြစ်ပါတယ်။ ထို့အပြင် — extensions များက register လုပ်ထားသော background workers တွေမှာ နောက်ထပ် အမျိုးအစားများ ရှိနိုင်ပါတယ်။ |

> **မှတ်ချက်:** `wait_event` နဲ့ `state` columns တွေက တစ်ခုနဲ့တစ်ခု သီးခြား လွတ်လပ်ပါတယ်။ Backend တစ်ခုက `active` state ထဲမှာ ရှိနေရင် — အဲဒီ backend က ဖြစ်ရပ် (event) တစ်ခုကို `waiting` ဖြစ်နေသည် လည်း ရှိနိုင်သလို — မဖြစ်နေသည်လည်း ရှိနိုင်ပါတယ်။ State က `active` ဖြစ်ပြီး `wait_event` က non-null ဖြစ်နေရင် — query တစ်ခု လုပ်ဆောင်နေပေမယ့် — system ထဲက တစ်နေရာရာမှာ ပိတ်ဆို့ခံထားရတယ်လို့ ဆိုလိုပါတယ်။ Reporting overhead နည်းအောင် ထားဖို့ — system က backend တစ်ခုအတွက် activity data တွေရဲ့ မတူညီတဲ့ သွင်ပြင်တွေကို ထပ်တူပြု (synchronize) လုပ်ဖို့ ကြိုးစားမှု မလုပ်ပါဘူး။ ရလဒ်အနေနဲ့ — view ၏ columns များကြားမှာ ခဏတာ ကွဲလွဲမှု (ephemeral discrepancies) တွေ ရှိနေနိုင်ပါတယ်။

**ဇယား 27.4. Wait Event Types (စောင့်ဆိုင်းရမည့် ဖြစ်ရပ် အမျိုးအစားများ)**
| Wait Event Type | ဖော်ပြချက် |
| --- | --- |
| `Activity` | Server process သည် idle (မလှုပ်ရှား) ဖြစ်နေပါတယ်။ ဤ event type က — process တစ်ခုသည် ၎င်း၏ main processing loop တွင် လှုပ်ရှားမှု (activity) တစ်ခုကို စောင့်ဆိုင်းနေကြောင်း ညွှန်ပြပါတယ်။ `wait_event` က သီးခြား wait point (စောင့်ဆိုင်းရမည့် နေရာ) ကို ဖော်ထုတ်ပါလိမ့်မယ်; [ဇယား 27.5](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-ACTIVITY-TABLE) ကို ကြည့်ပါ။ |
| `BufferPin` | Server process သည် data buffer တစ်ခုဆီ သီးသန့် ဝင်ရောက်ခွင့် (exclusive access) ရရှိရန် စောင့်ဆိုင်းနေပါတယ်။ Buffer pin စောင့်ဆိုင်းမှုများက — အခြား process တစ်ခုက — မေးခွန်းထုတ်ထားသော buffer မှ နောက်ဆုံး ဖတ်ရှုခဲ့သည့် open cursor (ဖွင့်ထားသော cursor) တစ်ခုကို ကိုင်ထားပါက — ကြာရှည်သွားနိုင်ပါတယ်။ [ဇယား 27.6](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-BUFFERPIN-TABLE) ကို ကြည့်ပါ။ |
| `Client` | Server process သည် user application တစ်ခုနှင့် ချိတ်ဆက်ထားသော socket ပေါ်မှာ လှုပ်ရှားမှု (activity) တစ်ခုကို စောင့်ဆိုင်းနေပါတယ်။ ဆိုလိုတာက — server က ၎င်း၏ internal processes တွေနဲ့ သီးခြား လွတ်လပ်သော အရာတစ်ခု ဖြစ်ပျက်လာဖို့ မျှော်လင့်နေတာ ဖြစ်ပါတယ်။ `wait_event` က သီးခြား wait point ကို ဖော်ထုတ်ပါလိမ့်မယ်; [ဇယား 27.7](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-CLIENT-TABLE) ကို ကြည့်ပါ။ |
| `Extension` | Server process သည် extension module တစ်ခုက သတ်မှတ်ထားသော အခြေအနေ (condition) တစ်ခုကို စောင့်ဆိုင်းနေပါတယ်။ [ဇယား 27.8](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-EXTENSION-TABLE) ကို ကြည့်ပါ။ |
| `InjectionPoint` | Server process သည် — test တစ်ခုတွင် သတ်မှတ်ထားသော ရလဒ် တစ်ခုဆီ injection point တစ်ခု ရောက်ရှိဖို့ — စောင့်ဆိုင်းနေပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 36.10.14](https://www.postgresql.org/docs/current/xfunc-c.html#XFUNC-ADDIN-INJECTION-POINTS) ကို ကြည့်ပါ။ ဤ အမျိုးအစားတွင် ကြိုတင် သတ်မှတ်ထားသော wait points များ မရှိပါ။ |
| `IO` | Server process သည် I/O လုပ်ဆောင်မှု တစ်ခု ပြီးမြောက်ရန် စောင့်ဆိုင်းနေပါတယ်။ `wait_event` က သီးခြား wait point ကို ဖော်ထုတ်ပါလိမ့်မယ်; [ဇယား 27.9](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-IO-TABLE) ကို ကြည့်ပါ။ |
| `IPC` | Server process သည် အခြား server process တစ်ခုနှင့် အပြန်အလှန် ဆက်သွယ်မှု (interaction) တစ်ခုကို စောင့်ဆိုင်းနေပါတယ်။ `wait_event` က သီးခြား wait point ကို ဖော်ထုတ်ပါလိမ့်မယ်; [ဇယား 27.10](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-IPC-TABLE) ကို ကြည့်ပါ။ |
| `Lock` | Server process သည် heavyweight lock (လေးလံသော lock) တစ်ခုကို စောင့်ဆိုင်းနေပါတယ်။ Heavyweight locks များ — lock manager locks (lock manager ၏ locks) သို့မဟုတ် ရိုးရိုး locks ဟုလည်း သိကြပြီး — tables ကဲ့သို့ SQL-visible (SQL မှ မြင်နိုင်သော) object များကို အဓိက ကာကွယ်ပေးပါတယ်။ သို့သော် — relation extension (relation တိုးချဲ့ခြင်း) ကဲ့သို့ အချို့သော internal လုပ်ဆောင်မှုများအတွက် အပြန်အလှန် သီးသန့်ခွဲထုတ်မှု (mutual exclusion) ရှိစေရန်လည်း သုံးပါတယ်။ `wait_event` က စောင့်ဆိုင်းနေသော lock ၏ အမျိုးအစားကို ဖော်ထုတ်ပါလိမ့်မယ်; [ဇယား 27.11](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-LOCK-TABLE) ကို ကြည့်ပါ။ |
| `LWLock` | Server process သည် lightweight lock (ပေါ့ပါးသော lock) တစ်ခုကို စောင့်ဆိုင်းနေပါတယ်။ ထိုကဲ့သို့ locks အများစုက shared memory (process များကြား မျှဝေသုံးသော memory) ထဲရှိ သီးခြား data structure တစ်ခုကို ကာကွယ်ပေးပါတယ်။ `wait_event` က lightweight lock ၏ ရည်ရွယ်ချက်ကို ဖော်ပြတဲ့ အမည် တစ်ခု ပါဝင်ပါလိမ့်မယ်။ (Locks အချို့မှာ သီးခြား အမည်များ ရှိပြီး — အချို့က — တစ်ခုချင်းစီ ဆင်တူသော ရည်ရွယ်ချက်ရှိသည့် locks အုပ်စု တစ်ခု၏ အစိတ်အပိုင်း ဖြစ်ပါတယ်။) [ဇယား 27.12](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-LWLOCK-TABLE) ကို ကြည့်ပါ။ |
| `Timeout` | Server process သည် timeout (အချိန် ကုန်ဆုံးမှု) တစ်ခု ကုန်ဆုံးရန် စောင့်ဆိုင်းနေပါတယ်။ `wait_event` က သီးခြား wait point ကို ဖော်ထုတ်ပါလိမ့်မယ်; [ဇယား 27.13](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-TIMEOUT-TABLE) ကို ကြည့်ပါ။ |

**ဇယား 27.5. Wait Events of Type Activity (Activity အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `Activity` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `ArchiverMain` | Archiver process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `AutovacuumMain` | Autovacuum launcher process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `BgwriterHibernate` | Background writer process တွင် hibernating (အိပ်စက်) ဖြစ်နေရင်း စောင့်ဆိုင်းနေသည်။ |
| `BgwriterMain` | Background writer process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `CheckpointerMain` | Checkpointer process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `CheckpointerShutdown` | Checkpointer process အဆုံးသတ်ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `IoWorkerMain` | IO Worker process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `LogicalApplyMain` | Logical replication apply process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `LogicalLauncherMain` | Logical replication launcher process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `LogicalParallelApplyMain` | Logical replication parallel apply process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `RecoveryWalStream` | Streaming recovery (စီးဆင်း ပြန်လည်ရယူမှု) ကာလအတွင်း — startup process ၏ main loop တွင် WAL ရောက်ရှိလာရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotsyncMain` | Slot sync worker ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotsyncShutdown` | Slot sync worker ပိတ်သွားရန် စောင့်ဆိုင်းနေသည်။ |
| `SysloggerMain` | Syslogger process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `WalReceiverMain` | WAL receiver process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `WalSenderMain` | WAL sender process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |
| `WalSummarizerWal` | WAL summarizer တွင် WAL များ ထပ်မံ ထုတ်လုပ်လာရန် စောင့်ဆိုင်းနေသည်။ |
| `WalWriterMain` | WAL writer process ၏ main loop တွင် စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.6. Wait Events of Type Bufferpin (BufferPin အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `BufferPin` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `BufferPin` | Buffer တစ်ခုပေါ်တွင် exclusive pin (သီးသန့် pin) တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.7. Wait Events of Type Client (Client အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `Client` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `ClientRead` | Client ထံမှ data ဖတ်ရှုရန် စောင့်ဆိုင်းနေသည်။ |
| `ClientWrite` | Client ထံသို့ data ရေးသားရန် စောင့်ဆိုင်းနေသည်။ |
| `GssOpenServer` | GSSAPI session တစ်ခု တည်ထောင်နေစဉ် client ထံမှ data ဖတ်ရှုရန် စောင့်ဆိုင်းနေသည်။ |
| `LibpqwalreceiverConnect` | WAL receiver တွင် remote server ဆီ connection တစ်ခု တည်ထောင်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LibpqwalreceiverReceive` | WAL receiver တွင် remote server ထံမှ data လက်ခံရရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `SslOpenServer` | Connection ပြုလုပ်ရန် ကြိုးစားနေစဉ် SSL အတွက် စောင့်ဆိုင်းနေသည်။ |
| `WaitForStandbyConfirmation` | Physical standby က WAL ကို လက်ခံပြီး flush (သိုလှောင်မှုဆီ ရေးချ) လုပ်ပြီးကြောင်း အတည်ပြုချက် (confirmation) ကို စောင့်ဆိုင်းနေသည်။ |
| `WalSenderWaitForWal` | WAL sender process တွင် WAL ကို flush လုပ်ပြီးဖြစ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `WalSenderWriteData` | WAL sender process တွင် WAL receiver ထံမှ တုံ့ပြန်မှုများ (replies) ကို လုပ်ဆောင်နေစဉ် လှုပ်ရှားမှု တစ်ခုခုကို စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.8. Wait Events of Type Extension (Extension အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `Extension` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `Extension` | Extension တစ်ခုအတွင်းတွင် စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.9. Wait Events of Type Io (Io အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `IO` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `AioIoCompletion` | အခြား process တစ်ခု IO ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `AioIoUringExecution` | io_uring မှတစ်ဆင့် IO လုပ်ဆောင်မှုအတွက် စောင့်ဆိုင်းနေသည်။ |
| `AioIoUringSubmit` | io_uring မှတစ်ဆင့် IO တင်သွင်းမှု (submission) အတွက် စောင့်ဆိုင်းနေသည်။ |
| `BasebackupRead` | Base backup က ဖိုင်တစ်ခုမှ ဖတ်ရှုရန် စောင့်ဆိုင်းနေသည်။ |
| `BasebackupSync` | Base backup တစ်ခုက ရေးသားခဲ့သော data သည် durable storage (ကြာရှည်ခံ သိုလှောင်မှု) သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `BasebackupWrite` | Base backup က ဖိုင်တစ်ခုသို့ ရေးသားရန် စောင့်ဆိုင်းနေသည်။ |
| `BuffileRead` | Buffered file (buffer လုပ်ထားသော ဖိုင်) တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `BuffileTruncate` | Buffered file တစ်ခု ဖြတ်တောက်ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `BuffileWrite` | Buffered file တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ControlFileRead` | `pg_control` ဖိုင်မှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ControlFileSync` | `pg_control` ဖိုင် durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `ControlFileSyncUpdate` | `pg_control` ဖိုင်ဆီ update (ပြင်ဆင်မှု) တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `ControlFileWrite` | `pg_control` ဖိုင်သို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ControlFileWriteUpdate` | `pg_control` ဖိုင်ကို update လုပ်ရန် ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `CopyFileCopy` | ဖိုင် ကူးယူမှု (file copy) လုပ်ဆောင်ချက်ကို စောင့်ဆိုင်းနေသည်။ |
| `CopyFileRead` | ဖိုင် ကူးယူမှု လုပ်ဆောင်နေစဉ် ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `CopyFileWrite` | ဖိုင် ကူးယူမှု လုပ်ဆောင်နေစဉ် ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `DataFileExtend` | Relation data file တစ်ခု တိုးချဲ့ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `DataFileFlush` | Relation data file တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `DataFileImmediateSync` | Relation data file တစ်ခုကို durable storage သို့ ချက်ချင်း ထပ်တူပြု (synchronize) လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `DataFilePrefetch` | Relation data file တစ်ခုမှ asynchronous prefetch (ကြိုတင် ယူဆောင်မှု) ကို စောင့်ဆိုင်းနေသည်။ |
| `DataFileRead` | Relation data file တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `DataFileSync` | Relation data file တစ်ခုဆီ ပြောင်းလဲမှုများ durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `DataFileTruncate` | Relation data file တစ်ခု ဖြတ်တောက်ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `DataFileWrite` | Relation data file တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `DsmAllocate` | Dynamic shared memory segment (တက်ကြွစွာ မျှဝေသုံးသော memory အပိုင်း) တစ်ခု ခွဲဝေခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `DsmFillZeroWrite` | Dynamic shared memory ၏ ကျောထောက်နောက်ခံ ဖိုင် (backing file) တစ်ခုကို zeroes (သုညများ) ဖြင့် ဖြည့်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LockFileAddtodatadirRead` | Data directory lock ဖိုင်ဆီ line တစ်ကြောင်း ထည့်သွင်းနေစဉ် ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `LockFileAddtodatadirSync` | Data directory lock ဖိုင်ဆီ line တစ်ကြောင်း ထည့်သွင်းနေစဉ် data durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `LockFileAddtodatadirWrite` | Data directory lock ဖိုင်ဆီ line တစ်ကြောင်း ထည့်သွင်းနေစဉ် ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `LockFileCreateRead` | Data directory lock ဖိုင် ဖန်တီးနေစဉ် ဖတ်ရှုရန် စောင့်ဆိုင်းနေသည်။ |
| `LockFileCreateSync` | Data directory lock ဖိုင် ဖန်တီးနေစဉ် data durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `LockFileCreateWrite` | Data directory lock ဖိုင် ဖန်တီးနေစဉ် ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `LockFileRecheckdatadirRead` | Data directory lock ဖိုင်ကို ပြန်လည် စစ်ဆေးနေစဉ် ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `LogicalRewriteCheckpointSync` | Checkpoint တစ်ခုအတွင်း logical rewrite mappings (ယုတ္တိ ပြန်ရေးမှု မြေပုံဆွဲမှုများ) durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalRewriteMappingSync` | Logical rewrite (ယုတ္တိ ပြန်ရေးမှု) တစ်ခုအတွင်း mapping data durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalRewriteMappingWrite` | Logical rewrite တစ်ခုအတွင်း mapping data ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `LogicalRewriteSync` | Logical rewrite mappings များ durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalRewriteTruncate` | Logical rewrite တစ်ခုအတွင်း mapping data ဖြတ်တောက်မှုကို စောင့်ဆိုင်းနေသည်။ |
| `LogicalRewriteWrite` | Logical rewrite mappings များ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `RelationMapRead` | Relation map ဖိုင်မှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `RelationMapReplace` | Relation map ဖိုင် တစ်ခုကို ကြာရှည်ခံစွာ အစားထိုးရန် စောင့်ဆိုင်းနေသည်။ |
| `RelationMapWrite` | Relation map ဖိုင်သို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ReorderBufferRead` | Reorder buffer စီမံခန့်ခွဲမှုအတွင်း ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ReorderBufferWrite` | Reorder buffer စီမံခန့်ခွဲမှုအတွင်း ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ReorderLogicalMappingRead` | Reorder buffer စီမံခန့်ခွဲမှုအတွင်း logical mapping တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotRead` | Replication slot control ဖိုင် တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotRestoreSync` | Replication slot control ဖိုင် တစ်ခုကို memory ထဲသို့ ပြန်လည် ထည့်သွင်းနေစဉ် durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotSync` | Replication slot control ဖိုင် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotWrite` | Replication slot control ဖိုင် တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `SlruFlushSync` | Checkpoint သို့မဟုတ် database shutdown (database ပိတ်ခြင်း) အတွင်း SLRU data durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `SlruRead` | SLRU page တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `SlruSync` | Page တစ်ခု ရေးသားပြီးနောက် SLRU data durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `SlruWrite` | SLRU page တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `SnapbuildRead` | Serialize (စနစ်တကျ သိမ်းဆည်း) လုပ်ထားသော သမိုင်းဝင် catalog snapshot (historical catalog snapshot) တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `SnapbuildSync` | Serialize လုပ်ထားသော သမိုင်းဝင် catalog snapshot တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `SnapbuildWrite` | Serialize လုပ်ထားသော သမိုင်းဝင် catalog snapshot တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `TimelineHistoryFileSync` | Streaming replication မှတစ်ဆင့် လက်ခံရရှိသော timeline history ဖိုင် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `TimelineHistoryFileWrite` | Streaming replication မှတစ်ဆင့် လက်ခံရရှိသော timeline history ဖိုင် တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `TimelineHistoryRead` | Timeline history ဖိုင် တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `TimelineHistorySync` | အသစ် ဖန်တီးထားသော timeline history ဖိုင် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `TimelineHistoryWrite` | အသစ် ဖန်တီးထားသော timeline history ဖိုင် တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `TwophaseFileRead` | Two phase state ဖိုင် (နှစ်ဆင့် အခြေအနေ ဖိုင်) တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `TwophaseFileSync` | Two phase state ဖိုင် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `TwophaseFileWrite` | Two phase state ဖိုင် တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `VersionFileSync` | Database တစ်ခု ဖန်တီးနေစဉ် version ဖိုင် durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `VersionFileWrite` | Database တစ်ခု ဖန်တီးနေစဉ် version ဖိုင် ရေးသားခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `WalsenderTimelineHistoryRead` | Walsender timeline command တစ်ခုအတွင်း timeline history ဖိုင် တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalBootstrapSync` | Bootstrapping (ကနဦး တည်ဆောက်မှု) ကာလအတွင်း WAL durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `WalBootstrapWrite` | Bootstrapping ကာလအတွင်း WAL page တစ်ခု ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalCopyRead` | ရှိပြီးသား WAL segment တစ်ခုကို ကူးယူပြီး WAL segment အသစ် တစ်ခု ဖန်တီးနေစဉ် ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalCopySync` | ရှိပြီးသား တစ်ခုကို ကူးယူပြီး ဖန်တီးထားသော WAL segment အသစ် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `WalCopyWrite` | ရှိပြီးသား WAL segment တစ်ခုကို ကူးယူပြီး WAL segment အသစ် တစ်ခု ဖန်တီးနေစဉ် ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalInitSync` | အသစ် စတင် သတ်မှတ်ထားသော WAL ဖိုင် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `WalInitWrite` | WAL ဖိုင် အသစ် တစ်ခုကို စတင် သတ်မှတ်နေစဉ် ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalRead` | WAL ဖိုင် တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalSummaryRead` | WAL summary ဖိုင် တစ်ခုမှ ဖတ်ရှုမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalSummaryWrite` | WAL summary ဖိုင် တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `WalSync` | WAL ဖိုင် တစ်ခု durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `WalSyncMethodAssign` | WAL sync method (WAL ထပ်တူပြုနည်းလမ်း) အသစ် တစ်ခုကို သတ်မှတ်ပေးနေစဉ် data durable storage သို့ ရောက်ရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `WalWrite` | WAL ဖိုင် တစ်ခုသို့ ရေးသားမှုကို စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.10. Wait Events of Type Ipc (Ipc အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `IPC` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `AppendReady` | `Append` plan node ၏ subplan nodes များ အသင့်ဖြစ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ArchiveCleanupCommand` | [archive_cleanup_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-ARCHIVE-CLEANUP-COMMAND) ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ArchiveCommand` | [archive_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-ARCHIVE-COMMAND) ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `BackendTermination` | အခြား backend တစ်ခု အဆုံးသတ်ခံရခြင်းကို စောင့်ဆိုင်းနေသည်။ |
| `BackupWaitWalArchive` | Backup တစ်ခုအတွက် လိုအပ်သော WAL ဖိုင်များ အောင်မြင်စွာ archive လုပ်ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `BgworkerShutdown` | Background worker ပိတ်သွားရန် စောင့်ဆိုင်းနေသည်။ |
| `BgworkerStartup` | Background worker စတင်ရန် စောင့်ဆိုင်းနေသည်။ |
| `BtreePage` | Parallel B-tree scan (အပြိုင် B-tree စကင်န်) တစ်ခု ဆက်လုပ်ရန် လိုအပ်သော page နံပါတ် ရနိုင်လာရန် စောင့်ဆိုင်းနေသည်။ |
| `BufferIo` | Buffer I/O ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `CheckpointDelayComplete` | Checkpoint တစ်ခု ပြီးမြောက်ခြင်းကို ပိတ်ဆို့နေသော backend တစ်ခုကို စောင့်ဆိုင်းနေသည်။ |
| `CheckpointDelayStart` | Checkpoint တစ်ခု စတင်ခြင်းကို ပိတ်ဆို့နေသော backend တစ်ခုကို စောင့်ဆိုင်းနေသည်။ |
| `CheckpointDone` | Checkpoint တစ်ခု ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `CheckpointStart` | Checkpoint တစ်ခု စတင်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ExecuteGather` | `Gather` plan node တစ်ခုကို execute လုပ်နေစဉ် child process တစ်ခုထံမှ လှုပ်ရှားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `HashBatchAllocate` | ရွေးချယ်ခံထားရသော Parallel Hash participant တစ်ခု hash table တစ်ခု ခွဲဝေရန် စောင့်ဆိုင်းနေသည်။ |
| `HashBatchElect` | Hash table တစ်ခု ခွဲဝေရန် Parallel Hash participant တစ်ခုကို ရွေးချယ်တင်မြှောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashBatchLoad` | အခြား Parallel Hash participants များ hash table တစ်ခုကို load (ထည့်သွင်း) လုပ်ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashBuildAllocate` | ရွေးချယ်ခံထားရသော Parallel Hash participant တစ်ခု ကနဦး hash table ကို ခွဲဝေရန် စောင့်ဆိုင်းနေသည်။ |
| `HashBuildElect` | ကနဦး hash table ကို ခွဲဝေရန် Parallel Hash participant တစ်ခုကို ရွေးချယ်တင်မြှောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashBuildHashInner` | အခြား Parallel Hash participants များ inner relation ကို hash လုပ်ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashBuildHashOuter` | အခြား Parallel Hash participants များ outer relation ကို partition လုပ်ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBatchesDecide` | နောင်တွင် batches များ တိုးချဲ့မှုအကြောင်း ဆုံးဖြတ်ရန် Parallel Hash participant တစ်ခုကို ရွေးချယ်တင်မြှောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBatchesElect` | Batches များ ထပ်မံ ခွဲဝေရန် Parallel Hash participant တစ်ခုကို ရွေးချယ်တင်မြှောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBatchesFinish` | ရွေးချယ်ခံထားရသော Parallel Hash participant တစ်ခု နောင်တွင် batches တိုးချဲ့မှုအကြောင်း ဆုံးဖြတ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBatchesReallocate` | ရွေးချယ်ခံထားရသော Parallel Hash participant တစ်ခု batches များ ထပ်မံ ခွဲဝေရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBatchesRepartition` | အခြား Parallel Hash participants များ repartition (ပြန်လည် ခွဲဝေ) လုပ်ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBucketsElect` | Buckets များ ထပ်မံ ခွဲဝေရန် Parallel Hash participant တစ်ခုကို ရွေးချယ်တင်မြှောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBucketsReallocate` | ရွေးချယ်ခံထားရသော Parallel Hash participant တစ်ခု buckets များ ခွဲဝေခြင်း ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `HashGrowBucketsReinsert` | အခြား Parallel Hash participants များ tuples များကို buckets အသစ်များထဲ ထည့်သွင်းခြင်း ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalApplySendData` | Logical replication leader apply process တစ်ခု parallel apply process တစ်ခုဆီ data ပို့ရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalParallelApplyStateChange` | Logical replication parallel apply process တစ်ခု state ပြောင်းလဲရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalSyncData` | Logical replication remote server တစ်ခု — ကနဦး table ထပ်တူပြုမှု (initial table synchronization) အတွက် — data ပို့ရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalSyncStateChange` | Logical replication remote server တစ်ခု state ပြောင်းလဲရန် စောင့်ဆိုင်းနေသည်။ |
| `MessageQueueInternal` | အခြား process တစ်ခု shared message queue (မျှဝေသုံး message တန်းစီ) တစ်ခုနှင့် တွဲဆက်ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `MessageQueuePutMessage` | Shared message queue တစ်ခုဆီ protocol message တစ်ခု ရေးသားရန် စောင့်ဆိုင်းနေသည်။ |
| `MessageQueueReceive` | Shared message queue တစ်ခုမှ bytes များ လက်ခံရရှိရန် စောင့်ဆိုင်းနေသည်။ |
| `MessageQueueSend` | Shared message queue တစ်ခုသို့ bytes များ ပို့ရန် စောင့်ဆိုင်းနေသည်။ |
| `MultixactCreation` | Multixact တစ်ခု ဖန်တီးမှု ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelBitmapScan` | Parallel bitmap scan (အပြိုင် bitmap စကင်န်) တစ်ခု စတင် အသင့်ဖြစ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelCreateIndexScan` | Parallel `CREATE INDEX` workers များ heap scan ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelFinish` | Parallel workers များ တွက်ချက်မှု ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ProcarrayGroupUpdate` | Group leader က transaction အဆုံးတွင် transaction ID ကို ရှင်းလင်းရန် စောင့်ဆိုင်းနေသည်။ |
| `ProcSignalBarrier` | Barrier event တစ်ခုကို backends အားလုံးက လုပ်ဆောင်ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `Promote` | Standby promotion (standby ကို primary အဖြစ် မြှင့်တင်ခြင်း) ကို စောင့်ဆိုင်းနေသည်။ |
| `RecoveryConflictSnapshot` | Vacuum cleanup တစ်ခုအတွက် recovery conflict ဖြေရှင်းမှု (recovery conflict resolution) ကို စောင့်ဆိုင်းနေသည်။ |
| `RecoveryConflictTablespace` | Tablespace တစ်ခု ဖျက်သိမ်းခြင်းအတွက် recovery conflict ဖြေရှင်းမှုကို စောင့်ဆိုင်းနေသည်။ |
| `RecoveryEndCommand` | [recovery_end_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-RECOVERY-END-COMMAND) ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `RecoveryPause` | Recovery ကို ပြန်လည် စတင်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationOriginDrop` | Replication origin တစ်ခု — ဖျက်သိမ်းနိုင်ရန် — မလှုပ်ရှား (inactive) ဖြစ်လာဖို့ စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotDrop` | Replication slot တစ်ခု — ဖျက်သိမ်းနိုင်ရန် — မလှုပ်ရှား ဖြစ်လာဖို့ စောင့်ဆိုင်းနေသည်။ |
| `RestoreCommand` | [restore_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-RESTORE-COMMAND) ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SafeSnapshot` | `READ ONLY DEFERRABLE` transaction တစ်ခုအတွက် တရားဝင် (valid) snapshot တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `SyncRep` | Synchronous replication (တစ်ပြိုင်တည်း ပုံတူပွား လွှဲပြောင်းမှု) ကာလအတွင်း remote server တစ်ခုထံမှ confirmation (အတည်ပြုချက်) ကို စောင့်ဆိုင်းနေသည်။ |
| `WalReceiverExit` | WAL receiver ထွက်သွားရန် စောင့်ဆိုင်းနေသည်။ |
| `WalReceiverUpstreamCatchup` | Upstream server ၏ WAL flush နေရာ (position) က တောင်းဆိုထားသော စတင်မှတ် (start point) အထိ လိုက်မီရန် စောင့်ဆိုင်းနေသည်။ |
| `WalReceiverWaitStart` | Streaming replication အတွက် ကနဦး data ကို startup process ပို့ရန် စောင့်ဆိုင်းနေသည်။ |
| `WalSummaryReady` | WAL summary အသစ် တစ်ခု ထုတ်လုပ်ခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `XactGroupUpdate` | Group leader က transaction အဆုံးတွင် transaction status ကို update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.11. Wait Events of Type Lock (Lock အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `Lock` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `advisory` | Advisory user lock (အကြံပေး user lock) တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `applytransaction` | Logical replication subscriber (စာရင်းသွင်း subscriber) တစ်ခုက apply လုပ်နေသော remote transaction တစ်ခုပေါ်တွင် lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `extend` | Relation တစ်ခု တိုးချဲ့ရန် စောင့်ဆိုင်းနေသည်။ |
| `frozenid` | `pg_database`.`datfrozenxid` နှင့် `pg_database`.`datminmxid` တို့ကို update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `object` | Relation မဟုတ်သော database object တစ်ခုပေါ်တွင် lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `page` | Relation တစ်ခု၏ page တစ်ခုပေါ်တွင် lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `relation` | Relation တစ်ခုပေါ်တွင် lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `spectoken` | Speculative insertion lock (ထင်မြင်ချက်အရ ထည့်သွင်းမှုအတွက် lock) တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `transactionid` | Transaction တစ်ခု ပြီးဆုံးရန် စောင့်ဆိုင်းနေသည်။ |
| `tuple` | Tuple တစ်ခုပေါ်တွင် lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `userlock` | User lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `virtualxid` | Virtual transaction ID lock (virtual transaction ID အတွက် lock) တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်; [အပိုင်း 67.1](https://www.postgresql.org/docs/current/transaction-id.html) ကို ကြည့်ပါ။ |

**ဇယား 27.12. Wait Events of Type Lwlock (Lwlock အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `LWLock` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `AddinShmemInit` | Extension တစ်ခု၏ shared memory အတွင်း space ခွဲဝေချထားမှုကို စီမံရန် စောင့်ဆိုင်းနေသည်။ |
| `AioUringCompletion` | အခြား process တစ်ခု io_uring မှတစ်ဆင့် IO ပြီးမြောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `AioWorkerSubmissionQueue` | AIO worker submission queue (AIO worker တင်သွင်းရေး တန်းစီ) ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `AutoFile` | `postgresql.auto.conf` ဖိုင်ကို update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `Autovacuum` | Autovacuum workers များ၏ လက်ရှိ အခြေအနေကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `AutovacuumSchedule` | Autovacuum အတွက် ရွေးချယ်ထားသော table တစ်ခု vacuum လုပ်ရန် လိုအပ်နေသေးကြောင်း သေချာစေရန် စောင့်ဆိုင်းနေသည်။ |
| `BackgroundWorker` | Background worker ၏ အခြေအနေကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `BtreeVacuum` | B-tree index တစ်ခုအတွက် vacuum နှင့် ဆက်စပ်သော အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `BufferContent` | Memory ထဲရှိ data page တစ်ခုကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `BufferMapping` | Data block တစ်ခုကို buffer pool (buffer ကန်) ထဲရှိ buffer တစ်ခုနှင့် တွဲဆက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `CheckpointerComm` | Fsync တောင်းဆိုမှုများ (fsync requests) ကို စီမံရန် စောင့်ဆိုင်းနေသည်။ |
| `CommitTs` | Transaction commit timestamp တစ်ခုအတွက် သတ်မှတ်ထားသော နောက်ဆုံး တန်ဖိုးကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `CommitTsBuffer` | Commit timestamp SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `CommitTsSLRU` | Commit timestamp SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ControlFile` | `pg_control` ဖိုင်ကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် — သို့မဟုတ် WAL ဖိုင် အသစ် တစ်ခု ဖန်တီးရန် စောင့်ဆိုင်းနေသည်။ |
| `DSMRegistry` | Dynamic shared memory registry (တက်ကြွစွာ မျှဝေသုံးသော memory မှတ်ပုံတင်) ကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `DSMRegistryDSA` | Dynamic shared memory registry ၏ dynamic shared memory allocator (ခွဲဝေပေးစက်) ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `DSMRegistryHash` | Dynamic shared memory registry ၏ shared hash table ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `DynamicSharedMemoryControl` | Dynamic shared memory ခွဲဝေချထားမှု အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `InjectionPoint` | Injection points များနှင့် ဆက်စပ်သော အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LockFastPath` | Process တစ်ခု၏ fast-path lock အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LockManager` | “heavyweight” locks များအကြောင်း အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalRepLauncherDSA` | Logical replication launcher ၏ dynamic shared memory allocator ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalRepLauncherHash` | Logical replication launcher ၏ shared hash table ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `LogicalRepWorker` | Logical replication workers များ၏ အခြေအနေကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `MultiXactGen` | Shared multixact state (မျှဝေသုံး multixact အခြေအနေ) ကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `MultiXactMemberBuffer` | Multixact member SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `MultiXactMemberSLRU` | Multixact member SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `MultiXactOffsetBuffer` | Multixact offset SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `MultiXactOffsetSLRU` | Multixact offset SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `MultiXactTruncation` | Multixact အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် ဖြတ်တောက်ရန် စောင့်ဆိုင်းနေသည်။ |
| `NotifyBuffer` | `NOTIFY` message SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `NotifyQueue` | `NOTIFY` messages များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `NotifyQueueTail` | `NOTIFY` message သိုလှောင်မှုပေါ်ရှိ ကန့်သတ်ချက် (limit) ကို update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `NotifySLRU` | `NOTIFY` message SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `OidGen` | OID အသစ် တစ်ခု ခွဲဝေရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelAppend` | Parallel Append plan လုပ်ဆောင်နေစဉ် နောက် subplan တစ်ခုကို ရွေးချယ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelBtreeScan` | Parallel B-tree scan plan လုပ်ဆောင်နေစဉ် workers များကို ထပ်တူပြုရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelHashJoin` | Parallel Hash Join plan လုပ်ဆောင်နေစဉ် workers များကို ထပ်တူပြုရန် စောင့်ဆိုင်းနေသည်။ |
| `ParallelQueryDSA` | Parallel query dynamic shared memory ခွဲဝေချထားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `ParallelVacuumDSA` | Parallel vacuum dynamic shared memory ခွဲဝေချထားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `PerSessionDSA` | Parallel query dynamic shared memory ခွဲဝေချထားမှုကို စောင့်ဆိုင်းနေသည်။ |
| `PerSessionRecordType` | Parallel query တစ်ခု၏ composite types များအကြောင်း အချက်အလက်ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `PerSessionRecordTypmod` | Parallel query တစ်ခု၏ — anonymous record types (အမည်မဖော်ပြသော record အမျိုးအစားများ) ကို ဖော်ထုတ်ပေးသော type modifiers များအကြောင်း အချက်အလက်ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `PerXactPredicateList` | Parallel query တစ်ခုအတွင်း လက်ရှိ serializable transaction က ကိုင်ထားသော predicate locks များ၏ စာရင်းကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `PgStatsData` | Shared memory stats data access အတွက် စောင့်ဆိုင်းနေသည်။ |
| `PgStatsDSA` | Stats dynamic shared memory allocator access အတွက် စောင့်ဆိုင်းနေသည်။ |
| `PgStatsHash` | Stats shared memory hash table access အတွက် စောင့်ဆိုင်းနေသည်။ |
| `PredicateLockManager` | Serializable transactions များ သုံးသော predicate lock အချက်အလက်ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ProcArray` | မျှဝေထားသော per-process data structures (process တစ်ခုချင်းစီဆိုင်ရာ data တည်ဆောက်ပုံများ) ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည် (ပုံမှန်အားဖြင့် — snapshot တစ်ခု ရယူရန် သို့မဟုတ် session တစ်ခု၏ transaction ID ကို အစီရင်ခံရန်)။ |
| `RelationMapping` | `pg_filenode.map` ဖိုင် တစ်ခုကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည် (အချို့သော system catalogs များ၏ filenode သတ်မှတ်ချက်များကို ခြေရာခံရန် သုံးပါတယ်)။ |
| `RelCacheInit` | `pg_internal.init` relation cache စတင် သတ်မှတ်ခြင်း ဖိုင် (relation cache initialization file) တစ်ခုကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationOrigin` | Replication origin တစ်ခုကို ဖန်တီးရန်၊ ဖျက်သိမ်းရန် သို့မဟုတ် အသုံးပြုရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationOriginState` | Replication origin တစ်ခု၏ တိုးတက်မှု (progress) ကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotAllocation` | Replication slot တစ်ခုကို ခွဲဝေရန် သို့မဟုတ် လွတ်ပေးရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotControl` | Replication slot ၏ အခြေအနေကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ReplicationSlotIO` | Replication slot တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `SerialBuffer` | Serializable transaction conflict SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `SerialControl` | Shared `pg_serial` state ကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SerializableFinishedList` | ပြီးဆုံးသွားသော serializable transactions များ၏ စာရင်းကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SerializablePredicateList` | Serializable transactions များ ကိုင်ထားသော predicate locks များ၏ စာရင်းကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SerializableXactHash` | Serializable transactions များအကြောင်း အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SerialSLRU` | Serializable transaction conflict SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SharedTidBitmap` | Parallel bitmap index scan (အပြိုင် bitmap index စကင်န်) တစ်ခုအတွင်း shared TID bitmap ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SharedTupleStore` | Parallel query တစ်ခုအတွင်း shared tuple store ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `ShmemIndex` | Shared memory ထဲတွင် space တစ်ခုကို ရှာရန် သို့မဟုတ် ခွဲဝေရန် စောင့်ဆိုင်းနေသည်။ |
| `SInvalRead` | Shared catalog invalidation queue (မျှဝေသုံး catalog ပျက်ပြယ်စေမှု တန်းစီ) မှ messages များကို ထုတ်ယူရန် စောင့်ဆိုင်းနေသည်။ |
| `SInvalWrite` | Shared catalog invalidation queue ဆီ message တစ်ခု ထည့်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SubtransBuffer` | Sub-transaction SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `SubtransSLRU` | Sub-transaction SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SyncRep` | Synchronous replication ၏ အခြေအနေအကြောင်း အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `SyncScan` | Synchronized table scan (ထပ်တူပြု table စကင်န်) တစ်ခု၏ စတင်မည့် နေရာ (starting location) ကို ရွေးချယ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `TablespaceCreate` | Tablespace တစ်ခုကို ဖန်တီးရန် သို့မဟုတ် ဖျက်သိမ်းရန် စောင့်ဆိုင်းနေသည်။ |
| `TwoPhaseState` | Prepared transactions (ပြင်ဆင်ထားသော transactions) များ၏ အခြေအနေကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `WaitEventCustom` | Custom wait events အချက်အလက်များကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `WALBufMapping` | WAL buffers ထဲရှိ page တစ်ခုကို အစားထိုးရန် စောင့်ဆိုင်းနေသည်။ |
| `WALInsert` | Memory buffer တစ်ခုထဲသို့ WAL data ထည့်သွင်းရန် စောင့်ဆိုင်းနေသည်။ |
| `WALSummarizer` | WAL summarization အခြေအနေကို ဖတ်ရှုရန် သို့မဟုတ် update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `WALWrite` | WAL buffers များ disk ပေါ်သို့ ရေးသားခံရရန် စောင့်ဆိုင်းနေသည်။ |
| `WrapLimitsVacuum` | Transaction id နှင့် multixact သုံးစွဲမှုပေါ်ရှိ ကန့်သတ်ချက်များ (limits) ကို update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `XactBuffer` | Transaction status SLRU buffer တစ်ခုပေါ်တွင် I/O ကို စောင့်ဆိုင်းနေသည်။ |
| `XactSLRU` | Transaction status SLRU cache ကို access လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `XactTruncation` | `pg_xact_status` ကို execute လုပ်ရန် သို့မဟုတ် ၎င်းအတွက် ရနိုင်သော အသက်အကြီးဆုံး (oldest) transaction ID ကို update လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `XidGen` | Transaction ID အသစ် တစ်ခု ခွဲဝေရန် စောင့်ဆိုင်းနေသည်။ |

**ဇယား 27.13. Wait Events of Type Timeout (Timeout အမျိုးအစား စောင့်ဆိုင်းရမည့် ဖြစ်ရပ်များ)**
| `Timeout` Wait Event | ဖော်ပြချက် |
| --- | --- |
| `BaseBackupThrottle` | Base backup လုပ်နေစဉ် throttling (နှေးကွေးစွာ ထိန်းချုပ်) လုပ်နေချိန်တွင် စောင့်ဆိုင်းနေသည်။ |
| `CheckpointWriteDelay` | Checkpoint တစ်ခု လုပ်ဆောင်နေစဉ် ရေးသားမှုများကြားတွင် စောင့်ဆိုင်းနေသည်။ |
| `PgSleep` | `pg_sleep` သို့မဟုတ် ၎င်းနှင့် တူညီသော function (sibling function) တစ်ခုကို ခေါ်ယူမှုကြောင့် စောင့်ဆိုင်းနေသည်။ |
| `RecoveryApplyDelay` | Delay သတ်မှတ်ချက် (delay setting) တစ်ခုကြောင့် recovery လုပ်နေစဉ် WAL ကို apply လုပ်ရန် စောင့်ဆိုင်းနေသည်။ |
| `RecoveryRetrieveRetryInterval` | Recovery လုပ်နေစဉ် — မည်သည့် အရင်းအမြစ် (`pg_wal`, archive သို့မဟုတ် stream) မှမဆို WAL data မရနိုင်သောအခါ — စောင့်ဆိုင်းနေသည်။ |
| `RegisterSyncRequest` | Request queue (တောင်းဆိုမှု တန်းစီ) ပြည့်နေသောကြောင့် — checkpointer ဆီ synchronization requests များ ပို့နေစဉ် — စောင့်ဆိုင်းနေသည်။ |
| `SpinDelay` | ပြိုင်ဆိုင်မှု ရှိနေသော spinlock (contended spinlock) တစ်ခုကို ရယူနေစဉ် စောင့်ဆိုင်းနေသည်။ |
| `VacuumDelay` | Cost-based vacuum delay point (ကုန်ကျစရိတ် အခြေခံ vacuum နှောင့်နှေးမှု အမှတ်) တစ်ခုတွင် စောင့်ဆိုင်းနေသည်။ |
| `VacuumTruncate` | Vacuum လုပ်ပြီးသော table တစ်ခု၏ အဆုံးရှိ ဗလာ pages များကို ဖြတ်တောက်ရန် exclusive lock တစ်ခု ရယူရန် စောင့်ဆိုင်းနေသည်။ |
| `WalSummarizerError` | WAL summarizer error (အမှား) တစ်ခု ဖြစ်ပြီးနောက် စောင့်ဆိုင်းနေသည်။ |

Wait events တွေကို ဘယ်လို ကြည့်ရှုနိုင်လဲဆိုတဲ့ ဥပမာတွေ အောက်မှာ ဖော်ပြထားပါတယ်:

```sql
SELECT pid, wait_event_type, wait_event FROM pg_stat_activity WHERE wait_event is NOT NULL;
 pid  | wait_event_type | wait_event
------+-----------------+------------
 2540 | Lock            | relation
 6644 | LWLock          | ProcArray
(2 rows)
```

```sql
SELECT a.pid, a.wait_event, w.description
  FROM pg_stat_activity a JOIN
       pg_wait_events w ON (a.wait_event_type = w.type AND
                            a.wait_event = w.name)
  WHERE a.wait_event is NOT NULL and a.state = 'active';
-[ RECORD 1 ]------------------------------------------------------​------------
pid         | 686674
wait_event  | WALInitSync
description | Waiting for a newly initialized WAL file to reach durable storage
```

> **မှတ်ချက်:** Extensions တွေက [ဇယား 27.8](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-EXTENSION-TABLE) နဲ့ [ဇယား 27.12](https://www.postgresql.org/docs/current/monitoring-stats.html#WAIT-EVENT-LWLOCK-TABLE) တွေမှာ ပြထားတဲ့ စာရင်းတွေဆီ `Extension`, `InjectionPoint` နဲ့ `LWLock` events တွေကို ထပ်ပေါင်း ထည့်နိုင်ပါတယ်။ အချို့ ကိစ္စများတွင် — extension တစ်ခုက သတ်မှတ်ပေးထားသော `LWLock` တစ်ခု၏ အမည်က server processes အားလုံးတွင် မရနိုင်ပါ။ အဲဒါကို extension က သတ်မှတ်ပေးထားသော အမည် အတိုင်းမဟုတ်ဘဲ — “extension” ဟုသာ အစီရင်ခံနိုင်ပါတယ်။

### 27.2.4. `pg_stat_replication` (WAL sender process များနှင့် replication statistics ကို ပြသသော view)

`pg_stat_replication` view မှာ — WAL sender process တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ sender နဲ့ ချိတ်ဆက်ထားတဲ့ standby server ဆီကို ပြုလုပ်တဲ့ replication (ပုံတူပွား ဒေတာ လွှဲပြောင်းမှု) အကြောင်း statistics တွေကို ပြသပါတယ်။ တိုက်ရိုက် ချိတ်ဆက်ထားသော standbys (တိုက်ရိုက် ချိတ်ဆက်ထားသည့် standby servers) တွေကိုပဲ စာရင်းပြုပြီး — အောက်ဆက်တွဲ (downstream) standby servers တွေအကြောင်း အချက်အလက် မရှိပါ။

**ဇယား 27.14. pg_stat_replication View (pg_stat_replication view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `pid` | `integer` | WAL sender process တစ်ခု၏ process ID |
| `usesysid` | `oid` | ဤ WAL sender process ထဲသို့ ဝင်ရောက်ထားသော user ၏ OID |
| `usename` | `name` | ဤ WAL sender process ထဲသို့ ဝင်ရောက်ထားသော user ၏ အမည် |
| `application_name` | `text` | ဤ WAL sender နှင့် ချိတ်ဆက်ထားသော application ၏ အမည် |
| `client_addr` | `inet` | ဤ WAL sender နှင့် ချိတ်ဆက်ထားသော client ၏ IP address။ ဤ field သည် null ဖြစ်နေပါက — client သည် server machine ပေါ်ရှိ Unix socket မှတစ်ဆင့် ချိတ်ဆက်ထားကြောင်း ညွှန်ပြပါတယ်။ |
| `client_hostname` | `text` | client_addr ၏ reverse DNS lookup (ပြောင်းပြန် DNS ရှာဖွေမှု) အရ အစီရင်ခံထားသော — ချိတ်ဆက်ထားသည့် client ၏ host name။ ဤ field သည် IP connections များအတွက်သာ — ထို့ပြင် `log_hostname` ကို enable လုပ်ထားမှသာ — null မဟုတ်ဘဲ ရှိနေမှာ ဖြစ်ပါတယ်။ |
| `client_port` | `integer` | ဤ WAL sender နှင့် ဆက်သွယ်မှုအတွက် client အသုံးပြုနေသော TCP port နံပါတ် — Unix socket ကို သုံးထားပါက -1 ဖြစ်ပါတယ် |
| `backend_start` | `timestamp with time zone` | ဤ process စတင်ခဲ့သည့် အချိန် — ဆိုလိုသည်မှာ client က ဤ WAL sender နှင့် ချိတ်ဆက်ခဲ့သည့် အချိန် ဖြစ်ပါတယ် |
| `backend_xmin` | `xid` | `hot_standby_feedback` က အစီရင်ခံထားသော ဤ standby ၏ xmin horizon (xmin နယ်နိမိတ်) |
| `state` | `text` | လက်ရှိ WAL sender state။ ဖြစ်နိုင်သော တန်ဖိုးများမှာ: `startup` — ဤ WAL sender သည် စတင် လုပ်ဆောင်နေသည်။ `catchup` — ဤ WAL sender ၏ ချိတ်ဆက်ထားသော standby သည် primary နှင့် လိုက်မီအောင် လုပ်နေသည်။ `streaming` — ဤ WAL sender ၏ ချိတ်ဆက်ထားသော standby server က primary နှင့် လိုက်မီသွားပြီးနောက် — ဤ WAL sender သည် ပြောင်းလဲမှုများကို stream (စီးဆင်း ပို့လွှတ်) လုပ်နေသည်။ `backup` — ဤ WAL sender သည် backup တစ်ခုကို ပို့နေသည်။ `stopping` — ဤ WAL sender သည် ရပ်တန့်နေသည်။ |
| `sent_lsn` | `pg_lsn` | ဤ connection ပေါ်တွင် ပို့လွှတ်ခဲ့သော နောက်ဆုံး write-ahead log နေရာ (write-ahead log location) |
| `write_lsn` | `pg_lsn` | ဤ standby server က disk ပေါ်သို့ ရေးသားခဲ့သော နောက်ဆုံး write-ahead log နေရာ |
| `flush_lsn` | `pg_lsn` | ဤ standby server က disk ပေါ်သို့ flush လုပ်ခဲ့သော နောက်ဆုံး write-ahead log နေရာ |
| `replay_lsn` | `pg_lsn` | ဤ standby server ပေါ်ရှိ database ထဲသို့ replay လုပ်ခဲ့သော နောက်ဆုံး write-ahead log နေရာ |
| `write_lag` | `interval` | မကြာသေးခင်က WAL ကို ဒေသအလိုက် (locally) flush လုပ်ခြင်းနှင့် — ဤ standby server က ၎င်းကို ရေးသားပြီးကြောင်း (သို့သော် flush မလုပ်ရသေးကြောင်း၊ apply မလုပ်ရသေးကြောင်း) အသိပေးချက် လက်ခံရရှိခြင်းကြားတွင် ကုန်ဆုံးသော အချိန်။ ဤ server ကို synchronous standby အဖြစ် ပြင်ဆင် သတ်မှတ်ထားပါက — commit လုပ်နေစဉ် `synchronous_commit` level `remote_write` က ဖြစ်ပေါ်စေသော နှောင့်နှေးမှုကို ချင့်တွက်ရန် ဒါကို သုံးနိုင်ပါတယ်။ |
| `flush_lag` | `interval` | မကြာသေးခင်က WAL ကို ဒေသအလိုက် flush လုပ်ခြင်းနှင့် — ဤ standby server က ၎င်းကို ရေးသားပြီး flush လုပ်ပြီးကြောင်း (သို့သော် apply မလုပ်ရသေးကြောင်း) အသိပေးချက် လက်ခံရရှိခြင်းကြားတွင် ကုန်ဆုံးသော အချိန်။ ဤ server ကို synchronous standby အဖြစ် ပြင်ဆင် သတ်မှတ်ထားပါက — commit လုပ်နေစဉ် `synchronous_commit` level `on` က ဖြစ်ပေါ်စေသော နှောင့်နှေးမှုကို ချင့်တွက်ရန် ဒါကို သုံးနိုင်ပါတယ်။ |
| `replay_lag` | `interval` | မကြာသေးခင်က WAL ကို ဒေသအလိုက် flush လုပ်ခြင်းနှင့် — ဤ standby server က ၎င်းကို ရေးသား၊ flush လုပ်ပြီး apply လုပ်ပြီးကြောင်း အသိပေးချက် လက်ခံရရှိခြင်းကြားတွင် ကုန်ဆုံးသော အချိန်။ ဤ server ကို synchronous standby အဖြစ် ပြင်ဆင် သတ်မှတ်ထားပါက — commit လုပ်နေစဉ် `synchronous_commit` level `remote_apply` က ဖြစ်ပေါ်စေသော နှောင့်နှေးမှုကို ချင့်တွက်ရန် ဒါကို သုံးနိုင်ပါတယ်။ |
| `sync_priority` | `integer` | Priority-based synchronous replication (ဦးစားပေးမှု အခြေခံ တစ်ပြိုင်တည်း ပုံတူပွား လွှဲပြောင်းမှု) တစ်ခုတွင် synchronous standby အဖြစ် ရွေးချယ်ခံရရန် ဤ standby server ၏ priority (ဦးစားပေးမှု)။ Quorum-based synchronous replication (အများဆန္ဒ အခြေခံ တစ်ပြိုင်တည်း ပုံတူပွား လွှဲပြောင်းမှု) တစ်ခုတွင် ဤသည် အကျိုးသက်ရောက်မှု မရှိပါ။ |
| `sync_state` | `text` | ဤ standby server ၏ synchronous state (တစ်ပြိုင်တည်း အခြေအနေ)။ ဖြစ်နိုင်သော တန်ဖိုးများမှာ: `async` — ဤ standby server သည် asynchronous (တစ်ပြိုင်တည်း မဟုတ်သော) ဖြစ်သည်။ `potential` — ဤ standby server သည် ယခုအခါ asynchronous ဖြစ်သော်လည်း — လက်ရှိ synchronous standby များထဲမှ တစ်ခု ပျက်ကွက်ပါက — synchronous ဖြစ်လာနိုင်သည်။ `sync` — ဤ standby server သည် synchronous ဖြစ်သည်။ `quorum` — ဤ standby server ကို quorum standbys များအတွက် ကိုယ်စားလှယ် (candidate) တစ်ခု အဖြစ် သတ်မှတ်ထားသည်။ |
| `reply_time` | `timestamp with time zone` | Standby server ထံမှ လက်ခံရရှိသော နောက်ဆုံး reply message (ပြန်ကြားချက်) ၏ ပို့လွှတ်ချိန် |

`pg_stat_replication` view မှာ အစီရင်ခံထားတဲ့ lag times (နောက်ကျမှု အချိန်များ) တွေက — မကြာသေးခင်က WAL ကို ရေးသားပြီး၊ flush လုပ်ပြီး၊ replay (ပြန်လည် ဖွင့်သွင်း) လုပ်ပြီး — sender က အဲဒါကို သိရှိရန် ကြာခဲ့တဲ့ အချိန်တွေရဲ့ တိုင်းတာမှု ဖြစ်ပါတယ်။ ဒီ အချိန်တွေက — remote server ကို synchronous standby (တစ်ပြိုင်တည်း standby) အဖြစ် ပြင်ဆင် သတ်မှတ်ထားပါက — `synchronous_commit` level (တစ်ပြိုင်တည်း commit အဆင့်) တစ်ခုချင်းစီက commit လုပ်နေစဉ် ဖြစ်ပေါ်စေခဲ့သော (သို့မဟုတ် ဖြစ်ပေါ်စေမည့်) commit delay (commit နှောင့်နှေးမှု) ကို ကိုယ်စားပြုပါတယ်။ Asynchronous standby (တစ်ပြိုင်တည်း မဟုတ်သော standby) တစ်ခုအတွက်ဆိုရင် — `replay_lag` column က — မကြာသေးခင်က transactions တွေ queries များအတွက် မြင်နိုင် (visible) ဖြစ်လာခင် နောက်ကျမှုကို အနီးစပ်ဆုံး (approximately) ဖော်ပြပါတယ်။ Standby server က sending server နဲ့ လုံးလုံး လိုက်မီသွားပြီး WAL လုပ်ဆောင်မှု နောက်ထပ် မရှိတော့ပါက — နောက်ဆုံး တိုင်းတာထားသော lag times များကို အချိန် အတိုလေး ဆက်၍ ပြသနေပြီးနောက် — `NULL` ပြသမှာ ဖြစ်ပါတယ်။

Lag times တွေက physical replication (ရုပ်ပိုင်း ပုံတူပွား လွှဲပြောင်းမှု) အတွက် အလိုအလျောက် အလုပ်လုပ်ပါတယ်။ Logical decoding plugins (ယုတ္တိ ကုဒ်ဖော်ခြင်း plugin များ) တွေက ရွေးချယ်နိုင်သော အနေနဲ့ tracking messages (ခြေရာခံ message များ) ကို ထုတ်လွှတ်နိုင်ပါတယ်; အဲဒါတွေ မထုတ်လွှတ်ပါက — tracking ယန္တရားက lag အတွက် `NULL` ကိုပဲ ရိုးရိုး ပြသမှာ ဖြစ်ပါတယ်။

> **မှတ်ချက်:** အစီရင်ခံထားသော lag times များက — လက်ရှိ replay နှုန်း (rate) ကို အခြေခံ၍ standby က sending server နဲ့ လိုက်မီရန် ဘယ်လောက် ကြာမယ်ဆိုတဲ့ ခန့်မှန်းချက်များ မဟုတ်ပါ။ ထိုသို့သော စနစ်တစ်ခုက WAL အသစ် ထုတ်လုပ်နေချိန်တွင် အလားတူ အချိန်များကို ပြသမှာ ဖြစ်ပေမယ့် — sender က idle (မလှုပ်ရှား) ဖြစ်သွားပါက ကွဲပြားသွားမှာ ဖြစ်ပါတယ်။ အထူးသဖြင့် — standby က လုံးလုံး လိုက်မီသွားပါက — `pg_stat_replication` က — အသုံးပြုသူ အချို့ မျှော်လင့်သလို သုည မဟုတ်ဘဲ — နောက်ဆုံး အစီရင်ခံထားသော WAL နေရာ (location) ကို ရေးသားရန်၊ flush လုပ်ရန်နှင့် replay လုပ်ရန် ကြာခဲ့သော အချိန်ကို ပြသပါတယ်။ ဒါက — မကြာသေးခင်က ရေးသားခဲ့သော transactions များအတွက် synchronous commit နှင့် transaction visibility (transaction မြင်နိုင်မှု) နှောင့်နှေးမှုများကို တိုင်းတာခြင်း ရည်ရွယ်ချက်နဲ့ ကိုက်ညီပါတယ်။ Lag နဲ့ ပတ်သက်ပြီး မတူညီသော ပုံစံတစ်ခုကို မျှော်လင့်နေသော အသုံးပြုသူများ စိတ်ရှုပ်မှု နည်းစေဖို့ — lag columns များက — လုံးလုံး replay ပြီး idle ဖြစ်နေသော စနစ်တစ်ခုပေါ်တွင် အချိန် အတိုလေးအတွင်း `NULL` ဆီ ပြန်လည် ပြောင်းသွားပါတယ်။ Monitoring systems (စောင့်ကြည့်ရေး စနစ်များ) က — ဒါကို data ပျောက်နေခြင်း (missing data) အဖြစ် ကိုယ်စားပြုမလား၊ သုည အဖြစ် ကိုယ်စားပြုမလား၊ သို့မဟုတ် နောက်ဆုံး သိရှိရသော တန်ဖိုးကို ဆက်ပြသမလား ဆိုတာ ရွေးချယ်သင့်ပါတယ်။

### 27.2.5. `pg_stat_replication_slots` (replication slots များ၏ အသုံးပြုမှု statistics view)

`pg_stat_replication_slots` view မှာ — logical replication slot (ယုတ္တိ ပုံတူပွား ဒေတာ လွှဲပြောင်းမှုအတွက် slot) တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — ၎င်း၏ အသုံးပြုမှုအကြောင်း statistics တွေကို ပြသပါတယ်။

**ဇယား 27.15. pg_stat_replication_slots View (pg_stat_replication_slots view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `slot_name` | `text` | Replication slot အတွက် — cluster တစ်ခုလုံးတွင် ထူးခြားသော (unique) identifier |
| `spill_txns` | `bigint` | Logical decoding က WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်ရန် သုံးသော memory က `logical_decoding_work_mem` ထက် ကျော်လွန်သွားသည်နှင့် — disk ပေါ်သို့ spill (ဖိတ်ကျစွာ သိမ်း) လုပ်ခဲ့ရသော transactions အရေအတွက်။ ဤ counter ကို top-level transactions နှင့် subtransactions နှစ်မျိုးလုံးအတွက် တိုးမြှင့်ပါတယ်။ |
| `spill_count` | `bigint` | ဤ slot အတွက် WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်နေစဉ် transactions များ disk ပေါ်သို့ spill လုပ်ခဲ့ရသည့် အကြိမ် အရေအတွက်။ Transaction တစ်ခု spill လုပ်တိုင်း ဤ counter ကို တိုးမြှင့်ပြီး — transaction တစ်ခုတည်းက အကြိမ် များစွာ spill လုပ်ခံရနိုင်ပါတယ်။ |
| `spill_bytes` | `bigint` | ဤ slot အတွက် WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်နေစဉ် disk ပေါ်သို့ spill လုပ်ခဲ့ရသော ကုဒ်ဖော်ပြီးသား (decoded) transaction data ပမာဏ။ ဤ နှင့် အခြား spill counters များကို — logical decoding ကာလအတွင်း ဖြစ်ပွားခဲ့သော I/O ကို ချင့်တွက်ရန် သုံးနိုင်ပြီး — `logical_decoding_work_mem` ကို ညှိယူရန် ခွင့်ပြုပါတယ်။ |
| `stream_txns` | `bigint` | ဤ slot အတွက် WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်ရန် logical decoding သုံးသော memory က `logical_decoding_work_mem` ထက် ကျော်လွန်သွားပြီးနောက် — decoding output plugin ဆီ stream လုပ်ခဲ့သော လုပ်ဆောင်ဆဲ (in-progress) transactions အရေအတွက်။ Streaming သည် top-level transactions များနှင့်သာ အလုပ်လုပ်ပြီး (subtransactions များကို သီးခြား stream မလုပ်နိုင်ပါ) — ထို့ကြောင့် ဤ counter ကို subtransactions များအတွက် တိုးမြှင့်မထားပါ။ |
| `stream_count` | `bigint` | ဤ slot အတွက် WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်နေစဉ် လုပ်ဆောင်ဆဲ transactions များကို decoding output plugin ဆီ stream လုပ်ခဲ့သည့် အကြိမ် အရေအတွက်။ Transaction တစ်ခု stream လုပ်တိုင်း ဤ counter ကို တိုးမြှင့်ပြီး — transaction တစ်ခုတည်းက အကြိမ် များစွာ stream လုပ်ခံရနိုင်ပါတယ်။ |
| `stream_bytes` | `bigint` | ဤ slot အတွက် WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်နေစဉ် — decoding output plugin ဆီ လုပ်ဆောင်ဆဲ transactions များကို stream လုပ်ရန် ကုဒ်ဖော်ခဲ့သော transaction data ပမာဏ။ ဤ slot အတွက် ဤ နှင့် အခြား streaming counters များကို `logical_decoding_work_mem` ကို ညှိယူရန် သုံးနိုင်ပါတယ်။ |
| `total_txns` | `bigint` | ဤ slot အတွက် decoding output plugin ဆီ ပို့လွှတ်ခဲ့သော ကုဒ်ဖော်ပြီးသား transactions အရေအတွက်။ ဤသည် top-level transactions များကိုသာ ရေတွက်ပြီး — subtransactions များအတွက် တိုးမြှင့်မထားပါ။ ဤတွင် stream လုပ်ထားသော နှင့်/သို့မဟုတ် spill လုပ်ထားသော transactions များ ပါဝင်ကြောင်း သတိပြုပါ။ |
| `total_bytes` | `bigint` | ဤ slot အတွက် WAL မှ ပြောင်းလဲမှုများကို ကုဒ်ဖော်နေစဉ် — decoding output plugin ဆီ transactions များ ပို့ရန် ကုဒ်ဖော်ခဲ့သော transaction data ပမာဏ။ ဤတွင် stream လုပ်ထားသော နှင့်/သို့မဟုတ် spill လုပ်ထားသော data များ ပါဝင်ကြောင်း သတိပြုပါ။ |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

### 27.2.6. `pg_stat_wal_receiver` (WAL receiver ၏ statistics view)

`pg_stat_wal_receiver` view မှာ row တစ်ခုတည်းသာ ပါဝင်ပြီး — အဲဒီ receiver နဲ့ ချိတ်ဆက်ထားတဲ့ server ဆီကနေ WAL ကို လက်ခံတဲ့ WAL receiver အကြောင်း statistics တွေကို ပြသပါတယ်။

**ဇယား 27.16. pg_stat_wal_receiver View (pg_stat_wal_receiver view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `pid` | `integer` | WAL receiver process ၏ process ID |
| `status` | `text` | WAL receiver process ၏ လုပ်ဆောင်ချက် အခြေအနေ (activity status) |
| `receive_start_lsn` | `pg_lsn` | WAL receiver စတင်သောအခါ သုံးခဲ့သော ပထမဆုံး write-ahead log နေရာ |
| `receive_start_tli` | `integer` | WAL receiver စတင်သောအခါ သုံးခဲ့သော ပထမဆုံး timeline နံပါတ် |
| `written_lsn` | `pg_lsn` | လက်ခံရရှိပြီး disk ပေါ်သို့ ရေးသားပြီးသော်လည်း flush မလုပ်ရသေးသည့် နောက်ဆုံး write-ahead log နေရာ။ ဤသည် data integrity (ဒေတာ ခိုင်မာမှု) စစ်ဆေးမှုများအတွက် အသုံးမပြုသင့်ပါ။ |
| `flushed_lsn` | `pg_lsn` | လက်ခံရရှိပြီး disk ပေါ်သို့ flush လုပ်ပြီးသော နောက်ဆုံး write-ahead log နေရာ — ဤ field ၏ ကနဦး တန်ဖိုးက WAL receiver စတင်သောအခါ သုံးခဲ့သော ပထမဆုံး log နေရာ ဖြစ်ပါတယ် |
| `received_tli` | `integer` | လက်ခံရရှိပြီး disk ပေါ်သို့ flush လုပ်ပြီးသော နောက်ဆုံး write-ahead log နေရာ၏ timeline နံပါတ် — ဤ field ၏ ကနဦး တန်ဖိုးက WAL receiver စတင်သောအခါ သုံးခဲ့သော ပထမဆုံး log နေရာ၏ timeline နံပါတ် ဖြစ်ပါတယ် |
| `last_msg_send_time` | `timestamp with time zone` | မူရင်း (origin) WAL sender ထံမှ လက်ခံရရှိသော နောက်ဆုံး message ၏ ပို့လွှတ်ချိန် |
| `last_msg_receipt_time` | `timestamp with time zone` | မူရင်း WAL sender ထံမှ လက်ခံရရှိသော နောက်ဆုံး message ၏ လက်ခံရရှိချိန် |
| `latest_end_lsn` | `pg_lsn` | မူရင်း WAL sender ဆီ အစီရင်ခံခဲ့သော နောက်ဆုံး write-ahead log နေရာ |
| `latest_end_time` | `timestamp with time zone` | မူရင်း WAL sender ဆီ အစီရင်ခံခဲ့သော နောက်ဆုံး write-ahead log နေရာ၏ အချိန် |
| `slot_name` | `text` | ဤ WAL receiver က အသုံးပြုသော replication slot ၏ အမည် |
| `sender_host` | `text` | ဤ WAL receiver ချိတ်ဆက်ထားသော PostgreSQL instance ၏ host။ ၎င်းသည် host name တစ်ခု၊ IP address တစ်ခု သို့မဟုတ် — connection က Unix socket မှတစ်ဆင့် ဖြစ်ပါက — directory path (လမ်းညွှန် လမ်းကြောင်း) တစ်ခု ဖြစ်နိုင်ပါတယ်။ (Path ၏ ကိစ္စကို — ၎င်းသည် `/` ဖြင့် အစပြုသော absolute path (ပကတိ လမ်းကြောင်း) တစ်ခု အမြဲ ဖြစ်သောကြောင့် — ခွဲခြား သိရှိနိုင်ပါတယ်။) |
| `sender_port` | `integer` | ဤ WAL receiver ချိတ်ဆက်ထားသော PostgreSQL instance ၏ port နံပါတ် |
| `conninfo` | `text` | ဤ WAL receiver က အသုံးပြုသော connection string — security နှင့် သက်ဆိုင်သော (security-sensitive) fields များကို ဖုံးကွယ်ထားသည် (obfuscated)။ |

### 27.2.7. `pg_stat_recovery_prefetch` (recovery ကာလ prefetch statistics view)

`pg_stat_recovery_prefetch` view မှာ row တစ်ခုတည်းသာ ပါဝင်ပါတယ်။ `wal_distance`, `block_distance` နဲ့ `io_depth` columns တွေက လက်ရှိ တန်ဖိုးများကို ပြသပြီး — ကျန် columns တွေက — `pg_stat_reset_shared` function ဖြင့် ပြန်လည် သတ်မှတ် (reset) လုပ်နိုင်သော — cumulative counters (စုစည်း ရေတွက်ကိန်းများ) များကို ပြသပါတယ်။

**ဇယား 27.17. pg_stat_recovery_prefetch View (pg_stat_recovery_prefetch view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |
| `prefetch` | `bigint` | Buffer pool (buffer ကန်) ထဲတွင် မရှိသောကြောင့် prefetch (ကြိုတင် ယူဆောင်) လုပ်ခဲ့သော blocks အရေအတွက် |
| `hit` | `bigint` | Buffer pool ထဲတွင် ရှိပြီးသား ဖြစ်၍ prefetch မလုပ်ခဲ့သော blocks အရေအတွက် |
| `skip_init` | `bigint` | Zero-initialized (သုည ဖြင့် စတင် သတ်မှတ်) လုပ်မည် ဖြစ်သောကြောင့် prefetch မလုပ်ခဲ့သော blocks အရေအတွက် |
| `skip_new` | `bigint` | မတည်ရှိသေးသောကြောင့် prefetch မလုပ်ခဲ့သော blocks အရေအတွက် |
| `skip_fpw` | `bigint` | WAL တွင် full page image (စာမျက်နှာ အပြည့် ပုံရိပ်) တစ်ခု ပါဝင်သောကြောင့် prefetch မလုပ်ခဲ့သော blocks အရေအတွက် |
| `skip_rep` | `bigint` | မကြာသေးခင်က prefetch လုပ်ပြီးသား ဖြစ်သောကြောင့် prefetch မလုပ်ခဲ့သော blocks အရေအတွက် |
| `wal_distance` | `int` | Prefetcher (ကြိုတင် ယူဆောင်ပေးသူ) က ရှေ့သို့ မျှော်ကြည့်နေသော bytes အရေအတွက် |
| `block_distance` | `int` | Prefetcher က ရှေ့သို့ မျှော်ကြည့်နေသော blocks အရေအတွက် |
| `io_depth` | `int` | စတင် လုပ်ဆောင်ပြီး ဖြစ်သော်လည်း ပြီးမြောက်ကြောင်း မသိရသေးသည့် prefetches အရေအတွက် |

### 27.2.8. `pg_stat_subscription` (subscription workers များ၏ statistics view)

**ဇယား 27.18. pg_stat_subscription View (pg_stat_subscription view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `subid` | `oid` | Subscription ၏ OID |
| `subname` | `name` | Subscription ၏ အမည် |
| `worker_type` | `text` | Subscription worker process ၏ အမျိုးအစား။ ဖြစ်နိုင်သော အမျိုးအစားများမှာ apply, parallel apply နှင့် table synchronization (table ထပ်တူပြုခြင်း) တို့ ဖြစ်ပါတယ်။ |
| `pid` | `integer` | Subscription worker process ၏ process ID |
| `leader_pid` | `integer` | ဤ process သည် parallel apply worker ဖြစ်ပါက leader apply worker ၏ process ID; ဤ process သည် leader apply worker သို့မဟုတ် table synchronization worker ဖြစ်ပါက `NULL` |
| `relid` | `oid` | Worker က ထပ်တူပြု (synchronize) လုပ်နေသော relation ၏ OID; leader apply worker နှင့် parallel apply workers များအတွက် `NULL` |
| `received_lsn` | `pg_lsn` | လက်ခံရရှိခဲ့သော နောက်ဆုံး write-ahead log နေရာ — ဤ field ၏ ကနဦး တန်ဖိုးက 0 ဖြစ်ပါတယ်; parallel apply workers များအတွက် `NULL` |
| `last_msg_send_time` | `timestamp with time zone` | မူရင်း WAL sender ထံမှ လက်ခံရရှိသော နောက်ဆုံး message ၏ ပို့လွှတ်ချိန်; parallel apply workers များအတွက် `NULL` |
| `last_msg_receipt_time` | `timestamp with time zone` | မူရင်း WAL sender ထံမှ လက်ခံရရှိသော နောက်ဆုံး message ၏ လက်ခံရရှိချိန်; parallel apply workers များအတွက် `NULL` |
| `latest_end_lsn` | `pg_lsn` | မူရင်း WAL sender ဆီ အစီရင်ခံခဲ့သော နောက်ဆုံး write-ahead log နေရာ; parallel apply workers များအတွက် `NULL` |
| `latest_end_time` | `timestamp with time zone` | မူရင်း WAL sender ဆီ အစီရင်ခံခဲ့သော နောက်ဆုံး write-ahead log နေရာ၏ အချိန်; parallel apply workers များအတွက် `NULL` |

### 27.2.9. `pg_stat_subscription_stats` (subscription errors/conflicts statistics view)

`pg_stat_subscription_stats` view မှာ — subscription တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — errors (အမှားများ) နဲ့ conflicts (ပဋိပက္ခများ) အကြောင်း statistics တွေကို ပြသပါတယ်။

**ဇယား 27.19. pg_stat_subscription_stats View (pg_stat_subscription_stats view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `subid` | `oid` | Subscription ၏ OID |
| `subname` | `name` | Subscription ၏ အမည် |
| `apply_error_count` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် error (အမှား) တစ်ခု ဖြစ်ပွားခဲ့သည့် အကြိမ် အရေအတွက်။ Apply error တစ်ခု ဖြစ်ပေါ်စေသော မည်သည့် conflict (ပဋိပက္ခ) မဆို — `apply_error_count` နှင့် သက်ဆိုင်ရာ conflict count (ဥပမာ `confl_*`) နှစ်ခုလုံးတွင် ရေတွက်ခံရမည်ကို သတိပြုပါ။ |
| `sync_error_count` | `bigint` | ကနဦး table ထပ်တူပြုမှု (initial table synchronization) ကာလအတွင်း error တစ်ခု ဖြစ်ပွားခဲ့သည့် အကြိမ် အရေအတွက် |
| `confl_insert_exists` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — row ထည့်သွင်းမှု (row insertion) တစ်ခုက `NOT DEFERRABLE` unique constraint (ထူးခြားမှု ကန့်သတ်ချက်) တစ်ခုကို ချိုးဖောက်ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `insert_exists` ကို ကြည့်ပါ။ |
| `confl_update_origin_differs` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — အခြား အရင်းအမြစ်တစ်ခုက ယခင်က ပြုပြင်ထားသော row တစ်ခုဆီ update တစ်ခုကို apply လုပ်ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `update_origin_differs` ကို ကြည့်ပါ။ |
| `confl_update_exists` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — update လုပ်ထားသော row တန်ဖိုး တစ်ခုက `NOT DEFERRABLE` unique constraint တစ်ခုကို ချိုးဖောက်ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `update_exists` ကို ကြည့်ပါ။ |
| `confl_update_missing` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — update လုပ်ရမည့် tuple ကို ရှာမတွေ့ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `update_missing` ကို ကြည့်ပါ။ |
| `confl_delete_origin_differs` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — အခြား အရင်းအမြစ်တစ်ခုက ယခင်က ပြုပြင်ထားသော row တစ်ခုဆီ delete (ဖျက်ခြင်း) လုပ်ဆောင်မှု တစ်ခုကို apply လုပ်ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `delete_origin_differs` ကို ကြည့်ပါ။ |
| `confl_delete_missing` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — ဖျက်ရမည့် tuple ကို ရှာမတွေ့ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `delete_missing` ကို ကြည့်ပါ။ |
| `confl_multiple_unique_conflicts` | `bigint` | ပြောင်းလဲမှုများကို apply လုပ်နေစဉ် — row ထည့်သွင်းမှု တစ်ခု သို့မဟုတ် update လုပ်ထားသော row တန်ဖိုးများက `NOT DEFERRABLE` unique constraints အများအပြားကို ချိုးဖောက်ခဲ့သည့် အကြိမ် အရေအတွက်။ ဤ conflict အကြောင်း အသေးစိတ်အတွက် `multiple_unique_conflicts` ကို ကြည့်ပါ။ |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

### 27.2.10. `pg_stat_ssl` (SSL အသုံးပြုမှု statistics view)

`pg_stat_ssl` view မှာ — backend သို့မဟုတ် WAL sender process တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — ဒီ connection ပေါ်မှာ သုံးထားတဲ့ SSL အကြောင်း statistics တွေကို ပြသပါတယ်။ Connection အကြောင်း နောက်ထပ် အသေးစိတ်တွေ ရဖို့ — `pid` column ပေါ်တွင် `pg_stat_activity` သို့မဟုတ် `pg_stat_replication` နှင့် join (ပေါင်း) လုပ်နိုင်ပါတယ်။

**ဇယား 27.20. pg_stat_ssl View (pg_stat_ssl view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `pid` | `integer` | Backend သို့မဟုတ် WAL sender process တစ်ခု၏ process ID |
| `ssl` | `boolean` | ဤ connection ပေါ်တွင် SSL ကို သုံးထားပါက True |
| `version` | `text` | အသုံးပြုနေသော SSL ၏ version — ဤ connection ပေါ်တွင် SSL မသုံးပါက NULL |
| `cipher` | `text` | အသုံးပြုနေသော SSL cipher ၏ အမည် — ဤ connection ပေါ်တွင် SSL မသုံးပါက NULL |
| `bits` | `integer` | အသုံးပြုနေသော encryption algorithm (ကုဒ်ဝှက်ခြင်း algorithm) အတွင်းရှိ bits အရေအတွက် — ဤ connection ပေါ်တွင် SSL မသုံးပါက NULL |
| `client_dn` | `text` | အသုံးပြုထားသော client certificate မှ Distinguished Name (DN) field — client certificate မပေးခဲ့ပါက သို့မဟုတ် ဤ connection ပေါ်တွင် SSL မသုံးပါက NULL ဖြစ်ပါတယ်။ DN field က NAMEDATALEN (standard build တစ်ခုတွင် စာလုံး 64 လုံး) ထက် ပိုရှည်ပါက — ဤ field ကို ဖြတ်တောက် (truncate) ပါတယ်။ |
| `client_serial` | `numeric` | Client certificate ၏ serial နံပါတ် — client certificate မပေးခဲ့ပါက သို့မဟုတ် ဤ connection ပေါ်တွင် SSL မသုံးပါက NULL ဖြစ်ပါတယ်။ Certificate serial နံပါတ်နှင့် certificate issuer (ထုတ်ပေးသူ) တို့၏ ပေါင်းစပ်မှုက certificate တစ်ခုကို ထူးခြားစွာ ဖော်ထုတ်ပါတယ် (issuer က serial နံပါတ်များကို မှားယွင်းစွာ ပြန်လည် အသုံးပြုနေခြင်း မရှိပါက)။ |
| `issuer_dn` | `text` | Client certificate ၏ issuer ၏ DN — client certificate မပေးခဲ့ပါက သို့မဟုတ် ဤ connection ပေါ်တွင် SSL မသုံးပါက NULL ဖြစ်ပါတယ်။ ဤ field ကို client_dn ကဲ့သို့ပင် ဖြတ်တောက်ပါတယ်။ |

### 27.2.11. `pg_stat_gssapi` (GSSAPI အသုံးပြုမှု statistics view)

`pg_stat_gssapi` view မှာ — backend တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — ဒီ connection ပေါ်မှာ သုံးထားတဲ့ GSSAPI authentication နဲ့ encryption (ကုဒ်ဝှက်ခြင်း) အကြောင်း အချက်အလက်တွေကို ပြသပါတယ်။ Connection အကြောင်း နောက်ထပ် အသေးစိတ်တွေ ရဖို့ — `pid` column ပေါ်တွင် `pg_stat_activity` သို့မဟုတ် `pg_stat_replication` နှင့် join လုပ်နိုင်ပါတယ်။

**ဇယား 27.21. pg_stat_gssapi View (pg_stat_gssapi view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `pid` | `integer` | Backend တစ်ခု၏ process ID |
| `gss_authenticated` | `boolean` | ဤ connection အတွက် GSSAPI authentication ကို သုံးခဲ့ပါက True |
| `principal` | `text` | ဤ connection ကို စစ်မှန်ကြောင်း စိစစ်ရန် သုံးခဲ့သော principal — GSSAPI ကို ဤ connection ကို စစ်မှန်ကြောင်း စိစစ်ရန် မသုံးခဲ့ပါက NULL ဖြစ်ပါတယ်။ Principal က NAMEDATALEN (standard build တစ်ခုတွင် စာလုံး 64 လုံး) ထက် ပိုရှည်ပါက — ဤ field ကို ဖြတ်တောက်ပါတယ်။ |
| `encrypted` | `boolean` | ဤ connection ပေါ်တွင် GSSAPI encryption (ကုဒ်ဝှက်ခြင်း) ကို သုံးနေပါက True |
| `credentials_delegated` | `boolean` | ဤ connection ပေါ်တွင် GSSAPI credentials (အထောက်အထားများ) ကို လွှဲအပ် (delegate) လုပ်ထားပါက True |

### 27.2.12. `pg_stat_archiver` (WAL archiver ၏ statistics view)

`pg_stat_archiver` view မှာ — cluster ၏ archiver process အကြောင်း data များ ပါဝင်သော row တစ်ခုတည်းသာ အမြဲ ရှိပါတယ်။

**ဇယား 27.22. pg_stat_archiver View (pg_stat_archiver view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `archived_count` | `bigint` | အောင်မြင်စွာ archive လုပ်ပြီးသော WAL ဖိုင်များ၏ အရေအတွက် |
| `last_archived_wal` | `text` | မကြာသေးခင်က အောင်မြင်စွာ archive လုပ်ခဲ့သော WAL ဖိုင်၏ အမည် |
| `last_archived_time` | `timestamp with time zone` | မကြာသေးခင်က အောင်မြင်သော archive လုပ်ဆောင်မှု၏ အချိန် |
| `failed_count` | `bigint` | WAL ဖိုင်များကို archive လုပ်ရန် ကြိုးစားမှု မအောင်မြင်ခဲ့သည့် အရေအတွက် |
| `last_failed_wal` | `text` | မကြာသေးခင်က မအောင်မြင်ခဲ့သော archival လုပ်ဆောင်မှု၏ WAL ဖိုင် အမည် |
| `last_failed_time` | `timestamp with time zone` | မကြာသေးခင်က မအောင်မြင်ခဲ့သော archival လုပ်ဆောင်မှု၏ အချိန် |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

ပုံမှန်အားဖြင့် — WAL ဖိုင်များကို အစဉ်လိုက် — အသက်အကြီးဆုံးမှ အသစ်ဆုံးအထိ — archive လုပ်ပါတယ် — သို့သော် ဤသည် အာမခံထားခြင်း မဟုတ်ပါ — ထို့ပြင် standby တစ်ခုကို promote (မြှင့်တင်) လုပ်ခြင်း သို့မဟုတ် crash recovery (ပျက်ကျမှု ပြန်လည်ရယူခြင်း) ပြီးနောက်လို အထူး အခြေအနေများတွင် ဤအစဉ်လိုက် မတည်ရှိပါ။ ထို့ကြောင့် — `last_archived_wal` ထက် အသက်ကြီးသော ဖိုင်အားလုံး အောင်မြင်စွာ archive လုပ်ပြီးပြီလို့ ယူဆရန် မလုံခြုံပါ။

### 27.2.13. `pg_stat_io` (I/O လုပ်ဆောင်မှုများ၏ cluster-wide statistics view)

`pg_stat_io` view မှာ — backend type, target I/O object နှင့် I/O context တို့၏ ပေါင်းစပ်မှု (combination) တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — cluster တစ်ခုလုံးနဲ့ ဆိုင်တဲ့ I/O statistics တွေကို ပြသပါတယ်။ အဓိပ္ပါယ် မရှိသော ပေါင်းစပ်မှုများကို ချန်လှပ်ထားပါတယ်။

လက်ရှိမှာ — relations (ဥပမာ tables, indexes) ပေါ်က I/O နှင့် WAL လုပ်ဆောင်ချက်များကို ခြေရာခံ (track) ပါတယ်။ သို့သော် — shared buffers (မျှဝေသုံး buffers) များကို ကျော်လွှားသွားသော relation I/O (ဥပမာ — table တစ်ခုကို tablespace တစ်ခုမှ အခြားတစ်ခုသို့ ရွှေ့ပြောင်းသည့်အခါ) ကိုတော့ လက်ရှိတွင် ခြေရာခံမထားပါ။

**ဇယား 27.23. pg_stat_io View (pg_stat_io view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `backend_type` | `text` | Backend ၏ အမျိုးအစား (ဥပမာ background worker, autovacuum worker)။ Backend types များအကြောင်း နောက်ထပ် အချက်အလက်အတွက် pg_stat_activity ကို ကြည့်ပါ။ Backend types အချို့က I/O လုပ်ဆောင်မှု statistics များကို စုဆောင်းမထားဘဲ — view ထဲတွင် ပါဝင်မည် မဟုတ်ပါ။ |
| `object` | `text` | I/O လုပ်ဆောင်မှုတစ်ခု၏ target object (ဦးတည်ချက် object)။ ဖြစ်နိုင်သော တန်ဖိုးများမှာ: `relation` — အမြဲတမ်း relations (permanent relations) များ။ `temp relation` — ယာယီ relations (temporary relations) များ။ `wal` — Write Ahead Logs များ။ |
| `context` | `text` | I/O လုပ်ဆောင်မှုတစ်ခု၏ context (အခြေအနေ)။ ဖြစ်နိုင်သော တန်ဖိုးများမှာ: `normal` — I/O လုပ်ဆောင်မှု အမျိုးအစားတစ်ခုအတွက် ပုံမှန် (default သို့မဟုတ် standard) context။ ဥပမာ — ပုံမှန်အားဖြင့် — relation data ကို shared buffers များထဲသို့ ဖတ်ပြီး shared buffers များမှ ရေးထုတ်ပါတယ်။ ထို့ကြောင့် — shared buffers များသို့/မှ relation data ၏ reads နှင့် writes များကို context `normal` တွင် ခြေရာခံပါတယ်။ `init` — WAL segments များ ဖန်တီးနေစဉ် လုပ်ဆောင်သော I/O လုပ်ဆောင်မှုများကို context `init` တွင် ခြေရာခံပါတယ်။ `vacuum` — permanent relations များကို vacuum နှင့် analyze လုပ်နေစဉ် shared buffers များ၏ အပြင်ဘက်တွင် လုပ်ဆောင်သော I/O လုပ်ဆောင်မှုများ။ Temporary table vacuums များက အခြား temporary table I/O လုပ်ဆောင်မှုများနှင့် တူညီသော local buffer pool ကို သုံးပြီး — context `normal` တွင် ခြေရာခံပါတယ်။ `bulkread` — shared buffers များ၏ အပြင်ဘက်တွင် လုပ်ဆောင်သော အချို့သော ကြီးမားသည့် read I/O လုပ်ဆောင်မှုများ — ဥပမာ ကြီးမားသော table တစ်ခု၏ sequential scan (အစဉ်လိုက် စကင်န်)။ `bulkwrite` — shared buffers များ၏ အပြင်ဘက်တွင် လုပ်ဆောင်သော အချို့သော ကြီးမားသည့် write I/O လုပ်ဆောင်မှုများ — ဥပမာ COPY ကဲ့သို့သော။ |
| `reads` | `bigint` | Read (ဖတ်ရှု) လုပ်ဆောင်မှုများ၏ အရေအတွက်။ |
| `read_bytes` | `numeric` | Read လုပ်ဆောင်မှုများ၏ စုစုပေါင်း အရွယ်အစား (bytes ဖြင့်)။ |
| `read_time` | `double precision` | Read လုပ်ဆောင်မှုများကို စောင့်ဆိုင်းရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (object က wal မဟုတ်ပါက `track_io_timing` ကို enable လုပ်ထားလျှင်၊ သို့မဟုတ် object က wal ဖြစ်ပါက `track_wal_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည) |
| `writes` | `bigint` | Write (ရေးသား) လုပ်ဆောင်မှုများ၏ အရေအတွက်။ |
| `write_bytes` | `numeric` | Write လုပ်ဆောင်မှုများ၏ စုစုပေါင်း အရွယ်အစား (bytes ဖြင့်)။ |
| `write_time` | `double precision` | Write လုပ်ဆောင်မှုများကို စောင့်ဆိုင်းရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (object က wal မဟုတ်ပါက `track_io_timing` ကို enable လုပ်ထားလျှင်၊ သို့မဟုတ် object က wal ဖြစ်ပါက `track_wal_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည) |
| `writebacks` | `bigint` | Process က kernel ကို permanent storage ဆီ ရေးထုတ်ရန် တောင်းဆိုခဲ့သော BLCKSZ အရွယ်အစား (ပုံမှန်အားဖြင့် 8kB) ယူနစ်များ၏ အရေအတွက်။ |
| `writeback_time` | `double precision` | Writeback (ပြန်လည် ရေးထုတ်) လုပ်ဆောင်မှုများကို စောင့်ဆိုင်းရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (`track_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည)။ ဤတွင် write-out requests များကို တန်းစီ (queue) လုပ်ရန် ကုန်ဆုံးသော အချိန်နှင့် — ဖြစ်နိုင်လျှင် — dirty data ကို ရေးထုတ်ရန် ကုန်ဆုံးသော အချိန်တို့ ပါဝင်ပါတယ်။ |
| `extends` | `bigint` | Relation extend (တိုးချဲ့) လုပ်ဆောင်မှုများ၏ အရေအတွက်။ |
| `extend_bytes` | `numeric` | Relation extend လုပ်ဆောင်မှုများ၏ စုစုပေါင်း အရွယ်အစား (bytes ဖြင့်)။ |
| `extend_time` | `double precision` | Extend လုပ်ဆောင်မှုများကို စောင့်ဆိုင်းရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်)။ (object က wal မဟုတ်ပါက `track_io_timing` ကို enable လုပ်ထားလျှင်၊ သို့မဟုတ် object က wal ဖြစ်ပါက `track_wal_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည) |
| `hits` | `bigint` | လိုချင်သော block တစ်ခုကို shared buffer တစ်ခုထဲတွင် တွေ့ရှိခဲ့သည့် အကြိမ် အရေအတွက်။ |
| `evictions` | `bigint` | Block တစ်ခုကို — အခြား အသုံးပြုမှုတစ်ခုအတွက် ရနိုင်စေရန် — shared သို့မဟုတ် local buffer တစ်ခုမှ ရေးထုတ်ခဲ့ရသည့် အကြိမ် အရေအတွက်။ Context `normal` တွင် — ဤသည် block တစ်ခုကို buffer တစ်ခုမှ ဖယ်ထုတ်ပြီး အခြား block တစ်ခုဖြင့် အစားထိုးခဲ့သည့် အကြိမ် အရေအတွက်ကို ရေတွက်ပါတယ်။ Contexts `bulkwrite`, `bulkread` နှင့် `vacuum` တွင် — ဤသည် — bulk I/O လုပ်ဆောင်မှုတစ်ခုအတွက် အသုံးပြုရန် — shared buffer တစ်ခုကို သီးခြား၊ အရွယ်အကန့်အသတ်ရှိသော ring buffer (လက်စွပ် ပုံစံ buffer) တစ်ခုထဲသို့ ထည့်ရန် shared buffers များမှ block တစ်ခုကို ဖယ်ထုတ်ခဲ့သည့် အကြိမ် အရေအတွက်ကို ရေတွက်ပါတယ်။ |
| `reuses` | `bigint` | bulkread, bulkwrite သို့မဟုတ် vacuum contexts များတွင် I/O လုပ်ဆောင်မှုတစ်ခု၏ အစိတ်အပိုင်းအဖြစ် — shared buffers များ၏ အပြင်ဘက်ရှိ အရွယ်အကန့်အသတ်ရှိသော ring buffer တစ်ခုအတွင်းရှိ buffer တစ်ခုကို ပြန်လည် အသုံးပြုခဲ့သည့် အကြိမ် အရေအတွက်။ |
| `fsyncs` | `bigint` | Fsync ခေါ်ယူမှုများ၏ အရေအတွက်။ ဤအရာများကို context `normal` တွင်သာ ခြေရာခံပါတယ်။ |
| `fsync_time` | `double precision` | Fsync လုပ်ဆောင်မှုများကို စောင့်ဆိုင်းရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (object က wal မဟုတ်ပါက `track_io_timing` ကို enable လုပ်ထားလျှင်၊ သို့မဟုတ် object က wal ဖြစ်ပါက `track_wal_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည) |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန်။ |

Backend types အချို့က အချို့သော I/O objects များပေါ်တွင် နှင့်/သို့မဟုတ် အချို့သော I/O contexts များတွင် I/O လုပ်ဆောင်မှုများကို ဘယ်တော့မှ မလုပ်ဆောင်ပါ။ ထိုကဲ့သို့ rows များကို view မှ ချန်လှပ်ထားပါတယ်။ ဥပမာ — checkpointer က temporary tables များကို checkpoint မလုပ်ပါ — ထို့ကြောင့် `backend_type` `checkpointer` နှင့် `object` `temp relation` အတွက် rows များ ရှိမည် မဟုတ်ပါ။

ထို့အပြင် — အချို့သော I/O လုပ်ဆောင်မှုများကို အချို့သော backend types များက သို့မဟုတ် အချို့သော I/O objects များပေါ်တွင် နှင့်/သို့မဟုတ် အချို့သော I/O contexts များတွင် ဘယ်တော့မှ လုပ်ဆောင်မည် မဟုတ်ပါ။ ထိုကဲ့သို့ cells များက `NULL` ဖြစ်ပါလိမ့်မယ်။ ဥပမာ — temporary tables များကို `fsync` မလုပ်ပါ — ထို့ကြောင့် `object` `temp relation` အတွက် `fsyncs` က `NULL` ဖြစ်ပါလိမ့်မယ်။ ထို့ပြင် — background writer က reads (ဖတ်ရှုမှုများ) ကို မလုပ်ဆောင်ပါ — ထို့ကြောင့် `backend_type` `background writer` အတွက် rows များတွင် `reads` က `NULL` ဖြစ်ပါလိမ့်မယ်။

`object` `wal` အတွက် — `fsyncs` နှင့် `fsync_time` တို့က `issue_xlog_fsync` တွင် လုပ်ဆောင်သော WAL ဖိုင်များ၏ fsync လုပ်ဆောင်ချက်ကို ခြေရာခံပြီး — `writes` နှင့် `write_time` တို့က `XLogWrite` တွင် လုပ်ဆောင်သော WAL ဖိုင်များ၏ ရေးသားမှု လုပ်ဆောင်ချက်ကို ခြေရာခံပါတယ်။ နောက်ထပ် အချက်အလက်များအတွက် [အပိုင်း 28.5](https://www.postgresql.org/docs/current/wal-configuration.html) ကို ကြည့်ပါ။

`pg_stat_io` ကို database tuning (database ညှိယူမှု) အတွက် အသုံးပြုနိုင်ပါတယ်။ ဥပမာ:

- Evictions (နေရာလွတ် ဖယ်ထုတ်မှု) ရေတွက်မှု မြင့်မားနေပါက — shared buffers များကို တိုးမြှင့်သင့်ကြောင်း ညွှန်ပြနိုင်ပါတယ်။

- Client backends များက data များ permanent storage (အမြဲတမ်း သိုလှောင်မှု) ဆီ ထိန်းသိမ်းခံရစေရန် checkpointer ကို အားကိုးပါတယ်။ Client backends များက ပြုလုပ်သော fsync အရေအတွက် များပြားနေပါက — shared buffers သို့မဟုတ် checkpointer ၏ ပြင်ဆင် သတ်မှတ်မှု မှားယွင်းနေကြောင်း ညွှန်ပြနိုင်ပါတယ်။ Checkpointer ကို ပြင်ဆင် သတ်မှတ်ခြင်းအကြောင်း နောက်ထပ် အချက်အလက်များကို အပိုင်း 28.5 တွင် တွေ့နိုင်ပါတယ်။

- ပုံမှန်အားဖြင့် — client backends များက dirty data (ပြောင်းလဲပြီး မရေးရသေးသော data) များကို တတ်နိုင်သမျှ များများ ရေးထုတ်ရန် — checkpointer နှင့် background writer လို auxiliary processes (အထောက်အကူ process များ) ကို အားကိုးနိုင်သင့်ပါတယ်။ Client backends များက ပြုလုပ်သော writes (ရေးသားမှုများ) အရေအတွက် များပြားနေပါက — shared buffers သို့မဟုတ် checkpointer ၏ ပြင်ဆင် သတ်မှတ်မှု မှားယွင်းနေကြောင်း ညွှန်ပြနိုင်ပါတယ်။ Checkpointer ကို ပြင်ဆင် သတ်မှတ်ခြင်းအကြောင်း နောက်ထပ် အချက်အလက်များကို အပိုင်း 28.5 တွင် တွေ့နိုင်ပါတယ်။

> **မှတ်ချက်:** I/O စောင့်ဆိုင်းချိန် (wait time) ကို ခြေရာခံသော columns များသည် [track_io_timing](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-IO-TIMING) ကို enable လုပ်ထားမှသာ — သုည မဟုတ်ဘဲ ရှိနေမှာ ဖြစ်ပါတယ်။ နောက်ဆုံး stats reset လုပ်ချိန်မှစ၍ တစ်လျှောက်လုံး `track_io_timing` ကို enable မလုပ်ထားခဲ့ပါက — ဒီ columns များကို သူတို့နှင့် သက်ဆိုင်သော I/O လုပ်ဆောင်မှုများနှင့် တွဲ၍ ကိုးကားရာတွင် အသုံးပြုသူသည် သတိထားသင့်ပါတယ်။

### 27.2.14. `pg_stat_bgwriter` (background writer ၏ statistics view)

`pg_stat_bgwriter` view တွင် — cluster ၏ background writer အကြောင်း data များ ပါဝင်သော row တစ်ခုတည်းသာ အမြဲ ရှိပါတယ်။

**ဇယား 27.24. pg_stat_bgwriter View (pg_stat_bgwriter view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `buffers_clean` | `bigint` | Background writer ရေးသားခဲ့သော buffers အရေအတွက် |
| `maxwritten_clean` | `bigint` | Background writer သည် buffers များ အလွန်အကျွံ ရေးသားမိသောကြောင့် cleaning scan (သန့်ရှင်းရေး စကင်န်) တစ်ခုကို ရပ်တန့်ခဲ့သည့် အကြိမ် အရေအတွက် |
| `buffers_alloc` | `bigint` | ခွဲဝေသတ်မှတ် (allocate) လုပ်ခဲ့သော buffers အရေအတွက် |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

### 27.2.15. `pg_stat_checkpointer` (checkpointer process ၏ statistics view)

`pg_stat_checkpointer` view တွင် — cluster ၏ checkpointer process အကြောင်း data များ ပါဝင်သော row တစ်ခုတည်းသာ အမြဲ ရှိပါတယ်။

**ဇယား 27.25. pg_stat_checkpointer View (pg_stat_checkpointer view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `num_timed` | `bigint` | Timeout (အချိန် ကုန်ဆုံးမှု) ကြောင့် စီစဉ်ထားသော checkpoints အရေအတွက် |
| `num_requested` | `bigint` | တောင်းဆိုခံရသော checkpoints အရေအတွက် |
| `num_done` | `bigint` | လုပ်ဆောင်ပြီးစီးခဲ့သော checkpoints အရေအတွက် |
| `restartpoints_timed` | `bigint` | Timeout ကြောင့် သို့မဟုတ် ၎င်းကို လုပ်ဆောင်ရန် ကြိုးစားမှု မအောင်မြင်ပြီးနောက် စီစဉ်ထားသော restartpoints အရေအတွက် |
| `restartpoints_req` | `bigint` | တောင်းဆိုခံရသော restartpoints အရေအတွက် |
| `restartpoints_done` | `bigint` | လုပ်ဆောင်ပြီးစီးခဲ့သော restartpoints အရေအတွက် |
| `write_time` | `double precision` | Checkpoints နှင့် restartpoints များကို လုပ်ဆောင်မှု၏ — ဖိုင်များကို disk ပေါ်သို့ ရေးသားသည့် — အပိုင်းတွင် ကုန်ဆုံးခဲ့သော စုစုပေါင်း အချိန်ပမာဏ (milliseconds ဖြင့်) |
| `sync_time` | `double precision` | Checkpoints နှင့် restartpoints များကို လုပ်ဆောင်မှု၏ — ဖိုင်များကို disk နှင့် ထပ်တူပြု (synchronize) လုပ်သည့် — အပိုင်းတွင် ကုန်ဆုံးခဲ့သော စုစုပေါင်း အချိန်ပမာဏ (milliseconds ဖြင့်) |
| `buffers_written` | `bigint` | Checkpoints နှင့် restartpoints များအတွင်း ရေးသားခဲ့သော shared buffers အရေအတွက် |
| `slru_written` | `bigint` | Checkpoints နှင့် restartpoints များအတွင်း ရေးသားခဲ့သော SLRU buffers အရေအတွက် |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

နောက်ဆုံး checkpoint ပြီးချိန်မှစ၍ server သည် idle (မလှုပ်ရှား) ဖြစ်နေခဲ့ပါက — checkpoints များကို ကျော်လွှား (skip) လုပ်နိုင်ပါတယ်။ `num_timed` နှင့် `num_requested` တို့က ပြီးမြောက်ခဲ့သော နှင့် ကျော်လွှားခဲ့သော checkpoints နှစ်မျိုးလုံးကို ရေတွက်ပြီး — `num_done` ကတော့ ပြီးမြောက်ခဲ့သော checkpoints များကိုသာ ခြေရာခံပါတယ်။ အလားတူပဲ — နောက်ဆုံး replay လုပ်ခဲ့သော checkpoint record သည် နောက်ဆုံး restartpoint ဖြစ်နေပါက — restartpoints များကိုလည်း ကျော်လွှားနိုင်ပါတယ်။ `restartpoints_timed` နှင့် `restartpoints_req` တို့က ပြီးမြောက်ခဲ့သော နှင့် ကျော်လွှားခဲ့သော restartpoints နှစ်မျိုးလုံးကို ရေတွက်ပြီး — `restartpoints_done` ကတော့ ပြီးမြောက်ခဲ့သော restartpoints များကိုသာ ခြေရာခံပါတယ်။

### 27.2.16. `pg_stat_wal` (WAL လုပ်ဆောင်ချက်များ၏ statistics view)

`pg_stat_wal` view တွင် — cluster ၏ WAL လုပ်ဆောင်ချက်များ အကြောင်း data များ ပါဝင်သော row တစ်ခုတည်းသာ အမြဲ ရှိပါတယ်။

**ဇယား 27.26. pg_stat_wal View (pg_stat_wal view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `wal_records` | `bigint` | ထုတ်လုပ်ခဲ့သော WAL records စုစုပေါင်း အရေအတွက် |
| `wal_fpi` | `bigint` | ထုတ်လုပ်ခဲ့သော WAL full page images (WAL ၏ စာမျက်နှာ အပြည့် ပုံရိပ်များ) စုစုပေါင်း အရေအတွက် |
| `wal_bytes` | `numeric` | ထုတ်လုပ်ခဲ့သော WAL ၏ စုစုပေါင်း ပမာဏ (bytes ဖြင့်) |
| `wal_buffers_full` | `bigint` | WAL buffers များ ပြည့်သွားသောကြောင့် WAL data ကို disk ပေါ်သို့ ရေးသားခဲ့ရသည့် အကြိမ် အရေအတွက် |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

### 27.2.17. `pg_stat_database` (database တစ်ခုချင်းစီ၏ statistics view)

`pg_stat_database` view တွင် — cluster ထဲရှိ database တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း — ထို့ပြင် shared objects (မျှဝေသုံး object များ) အတွက် row တစ်ခု ထပ်ဆောင်း ပါဝင်ပြီး — database တစ်ခုလုံး အတိုင်းအတာ (database-wide) statistics များကို ပြသပါတယ်။

**ဇယား 27.27. pg_stat_database View (pg_stat_database view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `datid` | `oid` | ဤ database ၏ OID — shared relation တစ်ခုတွင် ပါဝင်သော objects များအတွက်ဆိုလျှင် 0 ဖြစ်ပါတယ် |
| `datname` | `name` | ဤ database ၏ အမည် — shared objects များအတွက် NULL ဖြစ်ပါတယ် |
| `numbackends` | `integer` | ဤ database ဆီ လက်ရှိ ချိတ်ဆက်ထားသော backends အရေအတွက် — shared objects များအတွက် NULL ဖြစ်ပါတယ်။ ဤသည် လက်ရှိ အခြေအနေကို ရောင်ပြန်ဟပ်သည့် တန်ဖိုး တစ်ခုကို ပြန်ပေးသော ဤ view ထဲရှိ တစ်ခုတည်းသော column ဖြစ်ပြီး — အခြား columns အားလုံးက နောက်ဆုံး reset လုပ်ချိန်မှစ၍ စုဆောင်းထားသော တန်ဖိုးများကို ပြန်ပေးပါတယ် |
| `xact_commit` | `bigint` | ဤ database တွင် commit လုပ်ပြီးသော transactions အရေအတွက် |
| `xact_rollback` | `bigint` | ဤ database တွင် rollback လုပ်ခဲ့သော transactions အရေအတွက် |
| `blks_read` | `bigint` | ဤ database တွင် ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `blks_hit` | `bigint` | Disk blocks များကို buffer cache ထဲတွင် ကတည်းက တွေ့ရှိခဲ့သောကြောင့် ဖတ်ရှုရန် မလိုအပ်ခဲ့သည့် အကြိမ် အရေအတွက် (ဤတွင် PostgreSQL buffer cache ထဲက hits များသာ ပါဝင်ပြီး — operating system ၏ file system cache က မပါဝင်ပါ) |
| `tup_returned` | `bigint` | ဤ database တွင် sequential scans (အစဉ်လိုက် စကင်န်များ) က ရယူခဲ့သော live rows အရေအတွက် နှင့် index scans များက ပြန်ပေးခဲ့သော index entries အရေအတွက် |
| `tup_fetched` | `bigint` | ဤ database တွင် index scans များက ရယူခဲ့သော live rows အရေအတွက် |
| `tup_inserted` | `bigint` | ဤ database တွင် queries များက ထည့်သွင်းခဲ့သော rows အရေအတွက် |
| `tup_updated` | `bigint` | ဤ database တွင် queries များက update လုပ်ခဲ့သော rows အရေအတွက် |
| `tup_deleted` | `bigint` | ဤ database တွင် queries များက ဖျက်ခဲ့သော rows အရေအတွက် |
| `conflicts` | `bigint` | ဤ database တွင် recovery နှင့် ပဋိပက္ခ (conflict) ဖြစ်မှုများကြောင့် cancel (ဖျက်သိမ်း) လုပ်ခဲ့ရသော queries အရေအတွက်။ (Conflicts များသည် standby servers များပေါ်တွင်သာ ဖြစ်ပွားပါတယ်; အသေးစိတ်အတွက် `pg_stat_database_conflicts` ကို ကြည့်ပါ။) |
| `temp_files` | `bigint` | ဤ database တွင် queries များက ဖန်တီးခဲ့သော temporary files (ယာယီ ဖိုင်များ) အရေအတွက်။ Temporary file ကို ဖန်တီးရသည့် အကြောင်းရင်း (ဥပမာ — sorting သို့မဟုတ် hashing) မည်သို့ပင် ဖြစ်စေကာမူ — ထို့ပြင် `log_temp_files` setting မည်သို့ပင် ရှိစေကာမူ — temporary files အားလုံးကို ရေတွက်ပါတယ်။ |
| `temp_bytes` | `bigint` | ဤ database တွင် queries များက temporary files များဆီ ရေးသားခဲ့သော data စုစုပေါင်း ပမာဏ။ Temporary file ကို ဖန်တီးရသည့် အကြောင်းရင်း မည်သို့ပင် ဖြစ်စေကာမူ — ထို့ပြင် `log_temp_files` setting မည်သို့ပင် ရှိစေကာမူ — temporary files အားလုံးကို ရေတွက်ပါတယ်။ |
| `deadlocks` | `bigint` | ဤ database တွင် ထောက်လှမ်း တွေ့ရှိခဲ့သော deadlocks အရေအတွက် |
| `checksum_failures` | `bigint` | ဤ database တွင် (သို့မဟုတ် shared object တစ်ခုပေါ်တွင်) ထောက်လှမ်း တွေ့ရှိခဲ့သော data page checksum failures (data page ၏ checksum စစ်ဆေးမှု မအောင်မြင်မှုများ) အရေအတွက် — data checksums ကို disable လုပ်ထားပါက NULL ဖြစ်ပါတယ်။ |
| `checksum_last_failure` | `timestamp with time zone` | ဤ database တွင် (သို့မဟုတ် shared object တစ်ခုပေါ်တွင်) နောက်ဆုံး data page checksum failure ကို ထောက်လှမ်း တွေ့ရှိခဲ့သည့် အချိန် — data checksums ကို disable လုပ်ထားပါက NULL ဖြစ်ပါတယ်။ |
| `blk_read_time` | `double precision` | ဤ database တွင် backends များက data file blocks များကို ဖတ်ရှုရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (`track_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည) |
| `blk_write_time` | `double precision` | ဤ database တွင် backends များက data file blocks များကို ရေးသားရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (`track_io_timing` ကို enable လုပ်ထားလျှင် — မဟုတ်ပါက သုည) |
| `session_time` | `double precision` | ဤ database တွင် database sessions များ ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (statistics များကို session တစ်ခု၏ state (အခြေအနေ) ပြောင်းလဲသည့်အခါတွင်သာ update လုပ်ကြောင်း သတိပြုပါ — ထို့ကြောင့် sessions များသည် အချိန်ကြာမြင့်စွာ idle ဖြစ်နေခဲ့ပါက — ဤ idle အချိန်သည် မပါဝင်နိုင်ပါ) |
| `active_time` | `double precision` | ဤ database တွင် SQL statements များကို execute (လုပ်ဆောင်) လုပ်ရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (ဤသည် `pg_stat_activity` ရှိ active နှင့် fastpath function call states များနှင့် ကိုက်ညီပါတယ်) |
| `idle_in_transaction_time` | `double precision` | ဤ database တွင် transaction တစ်ခုအတွင်း၌ idle ဖြစ်နေရင်း ကုန်ဆုံးသော အချိန် (milliseconds ဖြင့်) — (ဤသည် `pg_stat_activity` ရှိ idle in transaction နှင့် idle in transaction (aborted) states များနှင့် ကိုက်ညီပါတယ်) |
| `sessions` | `bigint` | ဤ database ဆီ တည်ထောင်ခဲ့သော sessions စုစုပေါင်း အရေအတွက် |
| `sessions_abandoned` | `bigint` | Client ဆီသို့ ချိတ်ဆက်မှု ပျောက်ဆုံးသွားသောကြောင့် အဆုံးသတ်ခဲ့ရသော ဤ database ၏ database sessions အရေအတွက် |
| `sessions_fatal` | `bigint` | Fatal errors (ပြင်းထန်သော အမှားများ) ကြောင့် အဆုံးသတ်ခဲ့ရသော ဤ database ၏ database sessions အရေအတွက် |
| `sessions_killed` | `bigint` | Operator (လည်ပတ်သူ) ၏ ကြားဝင် ဆောင်ရွက်မှုကြောင့် အဆုံးသတ်ခဲ့ရသော ဤ database ၏ database sessions အရေအတွက် |
| `parallel_workers_to_launch` | `bigint` | ဤ database ပေါ်ရှိ queries များက စတင်ရန် (launch) စီစဉ်ထားသော parallel workers အရေအတွက် |
| `parallel_workers_launched` | `bigint` | ဤ database ပေါ်ရှိ queries များက စတင်ခဲ့သော parallel workers အရေအတွက် |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

### 27.2.18. `pg_stat_database_conflicts` (recovery conflicts ကြောင့် query cancel ဖြစ်မှုများ၏ statistics view)

`pg_stat_database_conflicts` view တွင် — database တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — standby servers များပေါ်တွင် recovery နှင့် ပဋိပက္ခ (conflict) ဖြစ်မှုများကြောင့် ဖြစ်ပွားသော query cancels (query ဖျက်သိမ်းမှုများ) နှင့် ဆိုင်သည့် — database တစ်ခုလုံး အတိုင်းအတာ statistics များကို ပြသပါတယ်။ Conflicts များသည် primary servers များပေါ်တွင် မဖြစ်ပွားသောကြောင့် — ဤ view တွင် standby servers များပေါ်က အချက်အလက်များသာ ပါဝင်ပါတယ်။

**ဇယား 27.28. pg_stat_database_conflicts View (pg_stat_database_conflicts view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `datid` | `oid` | Database တစ်ခု၏ OID |
| `datname` | `name` | ဤ database ၏ အမည် |
| `confl_tablespace` | `bigint` | ဤ database တွင် — tablespaces (tablespace များ) ဖျက်သိမ်းခံရမှုများကြောင့် — cancel လုပ်ခဲ့ရသော queries အရေအတွက် |
| `confl_lock` | `bigint` | ဤ database တွင် lock timeouts (lock စောင့်ဆိုင်းချိန် ကုန်ဆုံးမှုများ) ကြောင့် cancel လုပ်ခဲ့ရသော queries အရေအတွက် |
| `confl_snapshot` | `bigint` | ဤ database တွင် snapshots အဟောင်းများ (old snapshots) ကြောင့် cancel လုပ်ခဲ့ရသော queries အရေအတွက် |
| `confl_bufferpin` | `bigint` | ဤ database တွင် pinned buffers (ထိန်းကိုင်ထားသော buffers) များကြောင့် cancel လုပ်ခဲ့ရသော queries အရေအတွက် |
| `confl_deadlock` | `bigint` | ဤ database တွင် deadlocks များကြောင့် cancel လုပ်ခဲ့ရသော queries အရေအတွက် |
| `confl_active_logicalslot` | `bigint` | ဤ database တွင် — snapshots အဟောင်းများ သို့မဟုတ် primary ပေါ်ရှိ wal_level နိမ့်လွန်းမှုကြောင့် — cancel လုပ်ခဲ့ရသော logical slots များ၏ အသုံးပြုမှုများ အရေအတွက် |

### 27.2.19. `pg_stat_all_tables` (table တစ်ခုချင်းစီသို့ ဝင်ရောက်မှုများ၏ statistics view)

`pg_stat_all_tables` view တွင် — လက်ရှိ database ထဲရှိ table တစ်ခုချင်းစီအတွက် (TOAST tables များ အပါအဝင်) row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ တိကျသော table ဆီ ဝင်ရောက်မှုများအကြောင်း statistics များကို ပြသပါတယ်။ `pg_stat_user_tables` နှင့် `pg_stat_sys_tables` views များတွင် — တူညီသော အချက်အလက်များ ပါဝင်သော်လည်း — user tables နှင့် system tables များကိုသာ အသီးသီး ပြသရန် စစ်ထုတ် (filter) ထားပါတယ်။

**ဇယား 27.29. pg_stat_all_tables View (pg_stat_all_tables view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `relid` | `oid` | Table တစ်ခု၏ OID |
| `schemaname` | `name` | ဤ table တည်ရှိရာ schema ၏ အမည် |
| `relname` | `name` | ဤ table ၏ အမည် |
| `seq_scan` | `bigint` | ဤ table ပေါ်တွင် စတင်ခဲ့သော sequential scans အရေအတွက် |
| `last_seq_scan` | `timestamp with time zone` | ဤ table ပေါ်ရှိ နောက်ဆုံး sequential scan ၏ အချိန် — မကြာသေးခင်က transaction ၏ ရပ်တန့်ချိန် (stop time) ကို အခြေခံပါတယ် |
| `seq_tup_read` | `bigint` | Sequential scans များက ရယူခဲ့သော live rows အရေအတွက် |
| `idx_scan` | `bigint` | ဤ table ပေါ်တွင် စတင်ခဲ့သော index scans အရေအတွက် |
| `last_idx_scan` | `timestamp with time zone` | ဤ table ပေါ်ရှိ နောက်ဆုံး index scan ၏ အချိန် — မကြာသေးခင်က transaction ၏ ရပ်တန့်ချိန်ကို အခြေခံပါတယ် |
| `idx_tup_fetch` | `bigint` | Index scans များက ရယူခဲ့သော live rows အရေအတွက် |
| `n_tup_ins` | `bigint` | ထည့်သွင်းခဲ့သော rows စုစုပေါင်း အရေအတွက် |
| `n_tup_upd` | `bigint` | Update လုပ်ခဲ့သော rows စုစုပေါင်း အရေအတွက်။ (ဤတွင် `n_tup_hot_upd` နှင့် `n_tup_newpage_upd` တို့၌ ရေတွက်ထားသော row updates များ နှင့် ကျန် non-HOT updates များ ပါဝင်ပါတယ်။) |
| `n_tup_del` | `bigint` | ဖျက်ခဲ့သော rows စုစုပေါင်း အရေအတွက် |
| `n_tup_hot_upd` | `bigint` | HOT update လုပ်ခဲ့သော rows အရေအတွက်။ ဤရွေ့ — indexes များတွင် successor versions (နေရာဆက်ခံ versions) များ မလိုအပ်သော updates များ ဖြစ်ပါတယ်။ |
| `n_tup_newpage_upd` | `bigint` | Successor version သည် heap page အသစ် တစ်ခုပေါ်သို့ ရောက်ရှိသွားသော update လုပ်ခဲ့သည့် rows အရေအတွက် — မူရင်း version ကို မတူညီသော heap page တစ်ခုဆီ ညွှန်ပြသော `t_ctid` field ဖြင့် ချန်ရစ်ခဲ့ပါတယ်။ ဤရွေ့သည် အမြဲတမ်း non-HOT updates များ ဖြစ်ပါတယ်။ |
| `n_live_tup` | `bigint` | Live rows များ၏ ခန့်မှန်း အရေအတွက် |
| `n_dead_tup` | `bigint` | Dead rows များ၏ ခန့်မှန်း အရေအတွက် |
| `n_mod_since_analyze` | `bigint` | ဤ table ကို နောက်ဆုံး analyze လုပ်ချိန်မှစ၍ ပြုပြင်ခဲ့သော rows များ၏ ခန့်မှန်း အရေအတွက် |
| `n_ins_since_vacuum` | `bigint` | ဤ table ကို နောက်ဆုံး vacuum လုပ်ချိန်မှစ၍ ထည့်သွင်းခဲ့သော rows များ၏ ခန့်မှန်း အရေအတွက် (VACUUM FULL ကို ရေတွက်မထားပါ) |
| `last_vacuum` | `timestamp with time zone` | ဤ table ကို နောက်ဆုံး လက်ဖြင့် (manually) vacuum လုပ်ခဲ့သည့် အချိန် (VACUUM FULL ကို ရေတွက်မထားပါ) |
| `last_autovacuum` | `timestamp with time zone` | Autovacuum daemon က ဤ table ကို နောက်ဆုံး vacuum လုပ်ခဲ့သည့် အချိန် |
| `last_analyze` | `timestamp with time zone` | ဤ table ကို နောက်ဆုံး လက်ဖြင့် analyze လုပ်ခဲ့သည့် အချိန် |
| `last_autoanalyze` | `timestamp with time zone` | Autovacuum daemon က ဤ table ကို နောက်ဆုံး analyze လုပ်ခဲ့သည့် အချိန် |
| `vacuum_count` | `bigint` | ဤ table ကို လက်ဖြင့် vacuum လုပ်ခဲ့သည့် အကြိမ် အရေအတွက် (VACUUM FULL ကို ရေတွက်မထားပါ) |
| `autovacuum_count` | `bigint` | Autovacuum daemon က ဤ table ကို vacuum လုပ်ခဲ့သည့် အကြိမ် အရေအတွက် |
| `analyze_count` | `bigint` | ဤ table ကို လက်ဖြင့် analyze လုပ်ခဲ့သည့် အကြိမ် အရေအတွက် |
| `autoanalyze_count` | `bigint` | Autovacuum daemon က ဤ table ကို analyze လုပ်ခဲ့သည့် အကြိမ် အရေအတွက် |
| `total_vacuum_time` | `double precision` | ဤ table ကို လက်ဖြင့် vacuum လုပ်ရင်း ကုန်ဆုံးသော စုစုပေါင်း အချိန် (milliseconds ဖြင့်) (VACUUM FULL ကို ရေတွက်မထားပါ)။ (cost-based delays (ကုန်ကျစရိတ် အခြေခံ နှောင့်နှေးမှုများ) ကြောင့် အိပ်စက် (sleep) လုပ်ရင်း ကုန်ဆုံးသော အချိန်လည်း ပါဝင်ပါတယ်။) |
| `total_autovacuum_time` | `double precision` | Autovacuum daemon က ဤ table ကို vacuum လုပ်ရင်း ကုန်ဆုံးသော စုစုပေါင်း အချိန် (milliseconds ဖြင့်)။ (cost-based delays ကြောင့် အိပ်စက်ရင်း ကုန်ဆုံးသော အချိန်လည်း ပါဝင်ပါတယ်။) |
| `total_analyze_time` | `double precision` | ဤ table ကို လက်ဖြင့် analyze လုပ်ရင်း ကုန်ဆုံးသော စုစုပေါင်း အချိန် (milliseconds ဖြင့်)။ (cost-based delays ကြောင့် အိပ်စက်ရင်း ကုန်ဆုံးသော အချိန်လည်း ပါဝင်ပါတယ်။) |
| `total_autoanalyze_time` | `double precision` | Autovacuum daemon က ဤ table ကို analyze လုပ်ရင်း ကုန်ဆုံးသော စုစုပေါင်း အချိန် (milliseconds ဖြင့်)။ (cost-based delays ကြောင့် အိပ်စက်ရင်း ကုန်ဆုံးသော အချိန်လည်း ပါဝင်ပါတယ်။) |

### 27.2.20. `pg_stat_all_indexes` (index တစ်ခုချင်းစီသို့ ဝင်ရောက်မှုများ၏ statistics view)

`pg_stat_all_indexes` view တွင် — လက်ရှိ database ထဲရှိ index တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ တိကျသော index ဆီ ဝင်ရောက်မှုများအကြောင်း statistics များကို ပြသပါတယ်။ `pg_stat_user_indexes` နှင့် `pg_stat_sys_indexes` views များတွင် — တူညီသော အချက်အလက်များ ပါဝင်သော်လည်း — user indexes နှင့် system indexes များကိုသာ အသီးသီး ပြသရန် စစ်ထုတ်ထားပါတယ်။

**ဇယား 27.30. pg_stat_all_indexes View (pg_stat_all_indexes view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `relid` | `oid` | ဤ index အတွက် table ၏ OID |
| `indexrelid` | `oid` | ဤ index ၏ OID |
| `schemaname` | `name` | ဤ index တည်ရှိရာ schema ၏ အမည် |
| `relname` | `name` | ဤ index အတွက် table ၏ အမည် |
| `indexrelname` | `name` | ဤ index ၏ အမည် |
| `idx_scan` | `bigint` | ဤ index ပေါ်တွင် စတင်ခဲ့သော index scans အရေအတွက် |
| `last_idx_scan` | `timestamp with time zone` | ဤ index ပေါ်ရှိ နောက်ဆုံး scan ၏ အချိန် — မကြာသေးခင်က transaction ၏ ရပ်တန့်ချိန်ကို အခြေခံပါတယ် |
| `idx_tup_read` | `bigint` | ဤ index ပေါ်ရှိ scans များက ပြန်ပေးခဲ့သော index entries အရေအတွက် |
| `idx_tup_fetch` | `bigint` | ဤ index ကို အသုံးပြုသော ရိုးရိုး index scans (simple index scans) များက ရယူခဲ့သော live table rows အရေအတွက် |

Indexes များကို ရိုးရိုး index scans (simple index scans), “bitmap” index scans နှင့် optimizer တို့က အသုံးပြုနိုင်ပါတယ်။ Bitmap scan တစ်ခုတွင် — indexes အများအပြား၏ ရလဒ်များကို AND သို့မဟုတ် OR စည်းမျဉ်းများဖြင့် ပေါင်းစပ်နိုင်သောကြောင့် — bitmap scan ကို အသုံးပြုသည့်အခါ heap row fetches (heap row ရယူမှုများ) တစ်ခုချင်းစီကို သီးခြား indexes များနှင့် ဆက်စပ် ဖော်ထုတ်ရန် ခက်ခဲပါတယ်။ ထို့ကြောင့် — bitmap scan တစ်ခုက — ၎င်း အသုံးပြုသော index(es) အတွက် `pg_stat_all_indexes`.`idx_tup_read` count(s) ကို တိုးမြှင့်ပြီး — table အတွက် `pg_stat_all_tables`.`idx_tup_fetch` count ကို တိုးမြှင့်ပါတယ် — သို့သော် `pg_stat_all_indexes`.`idx_tup_fetch` ကိုတော့ သက်ရောက်မှု မရှိပါ။ Optimizer ကလည်း — optimizer statistics များ ခေတ်နောက်ကျ (stale) နေနိုင်သောကြောင့် — ထောက်ပံ့ပေးထားသော constants များ၏ တန်ဖိုးများသည် optimizer statistics ၏ မှတ်တမ်းတင်ထားသော အကွာအဝေး (range) အပြင်ဘက်တွင် ရှိမရှိ စစ်ဆေးရန် indexes များကို access လုပ်ပါတယ်။

> **မှတ်ချက်:** Bitmap scans များကို လုံးဝ အသုံးမပြုဘဲနှင့်တောင် — `idx_tup_read` နှင့် `idx_tup_fetch` counts များသည် ကွဲပြားနေနိုင်ပါတယ် — အကြောင်းမှာ `idx_tup_read` က index မှ ထုတ်ယူခဲ့သော index entries များကို ရေတွက်ပြီး — `idx_tup_fetch` က table မှ ရယူခဲ့သော live rows များကို ရေတွက်သောကြောင့် ဖြစ်ပါတယ်။ Index ကို အသုံးပြု၍ dead rows (သေနေသော rows) သို့မဟုတ် commit မလုပ်ရသေးသော rows များကို ရယူခဲ့ပါက — သို့မဟုတ် index-only scan တစ်ခုဖြင့် heap fetches အချို့ကို ရှောင်ရှားနိုင်ခဲ့ပါက — နောက်တစ်ခု (`idx_tup_fetch`) သည် ပိုနည်းပါလိမ့်မယ်။

> **မှတ်ချက်:** Index scans များသည် တစ်ကြိမ် execute (လုပ်ဆောင်) လုပ်မှုတွင် index searches အကြိမ် များစွာ လုပ်ဆောင်နိုင်ပါတယ်။ Index search တစ်ခုချင်းစီတိုင်းက `pg_stat_all_indexes`.`idx_scan` ကို တိုးမြှင့်သောကြောင့် — index scans ၏ အရေအတွက်သည် index scan executor node များ၏ execute လုပ်မှု စုစုပေါင်း အရေအတွက်ထက် သိသိသာသာ များပြားနိုင်ပါတယ်။
>
> ဤအခြေအနေသည် — scalar values (တစ်ခုတည်း တန်ဖိုးများ) အများအပြား ပါဝင်သော list သို့မဟုတ် array တစ်ခုထဲမှ မည်သည့် တန်ဖိုးနှင့်မဆို ကိုက်ညီသော rows များကို ရှာဖွေရန် အချို့သော SQL constructs များကို အသုံးပြုသော queries များတွင် ဖြစ်ပွားနိုင်ပါတယ် ([အပိုင်း 9.25](https://www.postgresql.org/docs/current/functions-comparisons.html) ကို ကြည့်ပါ)။ `column_name = value1 OR column_name = value2 ...` ပုံစံ construct ကို အသုံးပြုသော queries များတွင်လည်း ဖြစ်ပွားနိုင်ပါတယ် — သို့သော် optimizer က construct ကို ညီမျှသော multi-valued array (တန်ဖိုးမျိုးစုံ array) ကိုယ်စားပြုမှု အဖြစ် ပြောင်းလဲသည့်အခါမှသာ ဖြစ်ပါတယ်။ အလားတူပဲ — B-tree index scans များက skip scan optimization (skip scan ပိုမို ကောင်းမွန်အောင် လုပ်ခြင်း) ကို အသုံးပြုသည့်အခါ — ကိုက်ညီသော tuples များ ပါဝင်နိုင်သည့် နောက် index leaf page တစ်ခုဆီ scan ကို နေရာချိန်ညှိ (reposition) လုပ်သည့် အကြိမ်တိုင်းတွင် index search တစ်ခု လုပ်ဆောင်ပါတယ် ([အပိုင်း 11.3](https://www.postgresql.org/docs/current/indexes-multicolumn.html) ကို ကြည့်ပါ)။

> **အကြံပြုချက်:** `EXPLAIN ANALYZE` သည် index scan node တစ်ခုချင်းစီ လုပ်ဆောင်ခဲ့သော index searches စုစုပေါင်း အရေအတွက်ကို ထုတ်ပေးပါတယ်။ ဤသို့ အလုပ်လုပ်ပုံကို သရုပ်ပြသော ဥပမာ တစ်ခုအတွက် [အပိုင်း 14.1.2](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-ANALYZE) ကို ကြည့်ပါ။

### 27.2.21. `pg_statio_all_tables` (table တစ်ခုချင်းစီပေါ်ရှိ I/O ၏ statistics view)

`pg_statio_all_tables` view တွင် — လက်ရှိ database ထဲရှိ table တစ်ခုချင်းစီအတွက် (TOAST tables များ အပါအဝင်) row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ တိကျသော table ပေါ်ရှိ I/O အကြောင်း statistics များကို ပြသပါတယ်။ `pg_statio_user_tables` နှင့် `pg_statio_sys_tables` views များတွင် — တူညီသော အချက်အလက်များ ပါဝင်သော်လည်း — user tables နှင့် system tables များကိုသာ အသီးသီး ပြသရန် စစ်ထုတ်ထားပါတယ်။

**ဇယား 27.31. pg_statio_all_tables View (pg_statio_all_tables view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `relid` | `oid` | Table တစ်ခု၏ OID |
| `schemaname` | `name` | ဤ table တည်ရှိရာ schema ၏ အမည် |
| `relname` | `name` | ဤ table ၏ အမည် |
| `heap_blks_read` | `bigint` | ဤ table မှ ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `heap_blks_hit` | `bigint` | ဤ table ထဲတွင် buffer hits အရေအတွက် |
| `idx_blks_read` | `bigint` | ဤ table ပေါ်ရှိ indexes အားလုံးမှ ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `idx_blks_hit` | `bigint` | ဤ table ပေါ်ရှိ indexes အားလုံးထဲတွင် buffer hits အရေအတွက် |
| `toast_blks_read` | `bigint` | ဤ table ၏ TOAST table (ရှိပါက) မှ ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `toast_blks_hit` | `bigint` | ဤ table ၏ TOAST table (ရှိပါက) ထဲတွင် buffer hits အရေအတွက် |
| `tidx_blks_read` | `bigint` | ဤ table ၏ TOAST table ၏ indexes (ရှိပါက) များမှ ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `tidx_blks_hit` | `bigint` | ဤ table ၏ TOAST table ၏ indexes (ရှိပါက) များထဲတွင် buffer hits အရေအတွက် |

### 27.2.22. `pg_statio_all_indexes` (index တစ်ခုချင်းစီပေါ်ရှိ I/O ၏ statistics view)

`pg_statio_all_indexes` view တွင် — လက်ရှိ database ထဲရှိ index တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ တိကျသော index ပေါ်ရှိ I/O အကြောင်း statistics များကို ပြသပါတယ်။ `pg_statio_user_indexes` နှင့် `pg_statio_sys_indexes` views များတွင် — တူညီသော အချက်အလက်များ ပါဝင်သော်လည်း — user indexes နှင့် system indexes များကိုသာ အသီးသီး ပြသရန် စစ်ထုတ်ထားပါတယ်။

**ဇယား 27.32. pg_statio_all_indexes View (pg_statio_all_indexes view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `relid` | `oid` | ဤ index အတွက် table ၏ OID |
| `indexrelid` | `oid` | ဤ index ၏ OID |
| `schemaname` | `name` | ဤ index တည်ရှိရာ schema ၏ အမည် |
| `relname` | `name` | ဤ index အတွက် table ၏ အမည် |
| `indexrelname` | `name` | ဤ index ၏ အမည် |
| `idx_blks_read` | `bigint` | ဤ index မှ ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `idx_blks_hit` | `bigint` | ဤ index ထဲတွင် buffer hits အရေအတွက် |

### 27.2.23. `pg_statio_all_sequences` (sequence တစ်ခုချင်းစီပေါ်ရှိ I/O ၏ statistics view)

`pg_statio_all_sequences` view တွင် — လက်ရှိ database ထဲရှိ sequence တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ တိကျသော sequence ပေါ်ရှိ I/O အကြောင်း statistics များကို ပြသပါတယ်။

**ဇယား 27.33. pg_statio_all_sequences View (pg_statio_all_sequences view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `relid` | `oid` | Sequence တစ်ခု၏ OID |
| `schemaname` | `name` | ဤ sequence တည်ရှိရာ schema ၏ အမည် |
| `relname` | `name` | ဤ sequence ၏ အမည် |
| `blks_read` | `bigint` | ဤ sequence မှ ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `blks_hit` | `bigint` | ဤ sequence ထဲတွင် buffer hits အရေအတွက် |

### 27.2.24. `pg_stat_user_functions` (function တစ်ခုချင်းစီ၏ execute လုပ်မှုများ statistics view)

`pg_stat_user_functions` view တွင် — track (ခြေရာခံ) လုပ်ထားသော function တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — အဲဒီ function ၏ execute (လုပ်ဆောင်) လုပ်မှုများအကြောင်း statistics များကို ပြသပါတယ်။ ဘယ် functions များကို အတိအကျ track လုပ်မည်ဆိုတာကို [track_functions](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-FUNCTIONS) parameter က ထိန်းချုပ်ပါတယ်။

**ဇယား 27.34. pg_stat_user_functions View (pg_stat_user_functions view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `funcid` | `oid` | Function တစ်ခု၏ OID |
| `schemaname` | `name` | ဤ function တည်ရှိရာ schema ၏ အမည် |
| `funcname` | `name` | ဤ function ၏ အမည် |
| `calls` | `bigint` | ဤ function ကို ခေါ်ယူခဲ့သည့် အကြိမ် အရေအတွက် |
| `total_time` | `double precision` | ဤ function နှင့် ၎င်းက ခေါ်ယူခဲ့သော အခြား functions အားလုံးတွင် ကုန်ဆုံးခဲ့သော စုစုပေါင်း အချိန် (milliseconds ဖြင့်) |
| `self_time` | `double precision` | ဤ function ကိုယ်တိုင်တွင် ကုန်ဆုံးခဲ့သော စုစုပေါင်း အချိန် — ၎င်းက ခေါ်ယူခဲ့သော အခြား functions များ မပါဝင်ပါ (milliseconds ဖြင့်) |

### 27.2.25. `pg_stat_slru` (SLRU caches များ၏ statistics view)

PostgreSQL သည် disk ပေါ်ရှိ အချို့သော အချက်အလက်များကို `SLRU` (*simple least-recently-used* — ရိုးရှင်းသော “အသုံးပြုခဲ့သည်မှ ကြာမြင့်ပြီဖြစ်သော အရာကို ရှေးဦး ဖယ်ရှားသည့်” နည်းစနစ်) caches (ကက်ရှ်များ) မှတစ်ဆင့် access လုပ်ပါတယ်။ `pg_stat_slru` view တွင် — track လုပ်ထားသော SLRU cache တစ်ခုချင်းစီအတွက် row တစ်ခုနှုန်း ပါဝင်ပြီး — cache လုပ်ထားသော pages များဆီ ဝင်ရောက်မှုအကြောင်း statistics များကို ပြသပါတယ်။

Core server ၏ အစိတ်အပိုင်း တစ်ခု ဖြစ်သော `SLRU` cache တစ်ခုချင်းစီအတွက် — ၎င်း၏ အရွယ်အစားကို ထိန်းချုပ်သော — `_buffers` နောက်ဆက်စာလုံးဖြင့် အဆုံးသတ်သည့် configuration parameter တစ်ခု ရှိပါတယ်။

**ဇယား 27.35. pg_stat_slru View (pg_stat_slru view)**
| Column | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `name` | `text` | SLRU ၏ အမည် |
| `blks_zeroed` | `bigint` | စတင် သတ်မှတ်ခြင်း (initialization) များအတွင်း သုည ဖြည့် (zeroed) လုပ်ခဲ့သော blocks အရေအတွက် |
| `blks_hit` | `bigint` | Disk blocks များကို SLRU ထဲတွင် ကတည်းက တွေ့ရှိခဲ့သောကြောင့် ဖတ်ရှုရန် မလိုအပ်ခဲ့သည့် အကြိမ် အရေအတွက် (ဤတွင် SLRU ထဲက hits များသာ ပါဝင်ပြီး — operating system ၏ file system cache က မပါဝင်ပါ) |
| `blks_read` | `bigint` | ဤ SLRU အတွက် ဖတ်ရှုခဲ့သော disk blocks အရေအတွက် |
| `blks_written` | `bigint` | ဤ SLRU အတွက် ရေးသားခဲ့သော disk blocks အရေအတွက် |
| `blks_exists` | `bigint` | ဤ SLRU အတွက် တည်ရှိမှု စစ်ဆေးခဲ့သော (checked for existence) blocks အရေအတွက် |
| `flushes` | `bigint` | ဤ SLRU အတွက် dirty data (ပြောင်းလဲပြီး မရေးရသေးသော data) များ၏ flushes (ထုတ်လွှတ်မှုများ) အရေအတွက် |
| `truncates` | `bigint` | ဤ SLRU အတွက် truncates (ဖြတ်တောက်မှုများ) အရေအတွက် |
| `stats_reset` | `timestamp with time zone` | ဤ statistics များကို နောက်ဆုံး ပြန်လည် သတ်မှတ် (reset) လုပ်ခဲ့သည့် အချိန် |

### 27.2.26. Statistics Functions (Statistics function များ)

အထက်တွင် ပြသထားသော standard views များ အသုံးပြုသည့် — အောက်ခံ statistics access functions (statistics ဝင်ရောက် ရယူသော function များ) ကိုပဲ အသုံးပြုသော queries များ ရေးသားခြင်းအားဖြင့် — statistics များကို ကြည့်ရှုရန် အခြား နည်းလမ်းများကိုလည်း ပြင်ဆင် သတ်မှတ်နိုင်ပါတယ်။ Functions များ၏ အမည်များလို အသေးစိတ် အချက်အလက်များအတွက် — standard views များ၏ အဓိပ္ပါယ် ဖွင့်ဆိုချက်များကို ကိုးကားပါ။ (ဥပမာ — psql တွင် `\d+ pg_stat_activity` ကို ထုတ်ပြနိုင်ပါတယ်။) Database တစ်ခုချင်းစီဆိုင်ရာ (per-database) statistics များအတွက် access functions များက — ဘယ် database အကြောင်း အစီရင်ခံမည်ကို ဖော်ထုတ်ရန် — argument (ငြင်းခုံ တန်ဖိုး) အဖြစ် database OID တစ်ခုကို လက်ခံပါတယ်။ Table နှင့် index တစ်ခုချင်းစီဆိုင်ရာ (per-table နှင့် per-index) functions များက table သို့မဟုတ် index OID တစ်ခုကို လက်ခံပြီး — function တစ်ခုချင်းစီဆိုင်ရာ (per-function) statistics များအတွက် functions များက function OID တစ်ခုကို လက်ခံပါတယ်။ ဤ functions များဖြင့် — လက်ရှိ database ထဲရှိ tables, indexes နှင့် functions များကိုသာ မြင်နိုင်သည်ကို သတိပြုပါ။

Cumulative statistics system နှင့် ဆက်စပ်သော နောက်ထပ် functions များကို [ဇယား 27.36](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-FUNCS-TABLE) တွင် စာရင်းပြုထားပါတယ်။

**ဇယား 27.36. Additional Statistics Functions (နောက်ထပ် statistics function များ)**
| Function | ဖော်ပြချက် |
| --- | --- |
| pg_backend_pid () → integer | လက်ရှိ session နှင့် တွဲဆက်ထားသော server process ၏ process ID ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_io ( integer ) → setof record | သတ်မှတ်ထားသော process ID ရှိသော backend အကြောင်း I/O statistics များကို ပြန်ပေးပါတယ်။ ထုတ်ပေးသော (output) fields များသည် `pg_stat_io` view ထဲရှိ fields များနှင့် အတိအကျ တူညီပါတယ်။ ဤ function သည် — `pg_stat_io` view တွင် မြင်နိုင်ပြီးသား ဖြစ်ပြီး ၎င်းတို့ တစ်ခုစီသည် တစ်ခုတည်းသာ ရှိသောကြောင့် — checkpointer, background writer, startup process နှင့် autovacuum launcher တို့အတွက် I/O statistics များကို ပြန်မပေးပါ။ |
| pg_stat_get_activity ( integer ) → setof record | သတ်မှတ်ထားသော process ID ရှိသော backend အကြောင်း အချက်အလက် record တစ်ခုကို ပြန်ပေးပါတယ် — NULL ကို သတ်မှတ်ပေးထားပါက system ထဲရှိ active backend တစ်ခုချင်းစီအတွက် record တစ်ခုနှုန်း ပြန်ပေးပါတယ်။ ပြန်ပေးသော fields များသည် `pg_stat_activity` view ထဲရှိ fields များ၏ အစိတ်အပိုင်း (subset) တစ်ခု ဖြစ်ပါတယ်။ |
| pg_stat_get_backend_wal ( integer ) → record | သတ်မှတ်ထားသော process ID ရှိသော backend အကြောင်း WAL statistics များကို ပြန်ပေးပါတယ်။ ထုတ်ပေးသော fields များသည် `pg_stat_wal` view ထဲရှိ fields များနှင့် အတိအကျ တူညီပါတယ်။ ဤ function သည် checkpointer, background writer, startup process နှင့် autovacuum launcher တို့အတွက် WAL statistics များကို ပြန်မပေးပါ။ |
| pg_stat_get_snapshot_timestamp () → timestamp with time zone | လက်ရှိ statistics snapshot ၏ timestamp ကို ပြန်ပေးပါတယ် — statistics snapshot တစ်ခုမျှ ရိုက်ကူး (take) မထားသေးပါက NULL ပြန်ပေးပါတယ်။ `stats_fetch_consistency` ကို snapshot အဖြစ် သတ်မှတ်ထားပါက — transaction တစ်ခုတွင် cumulative statistics များကို ပထမဆုံး အကြိမ် access လုပ်သည့်အခါ snapshot တစ်ခုကို ရိုက်ကူးပါတယ် |
| pg_stat_get_xact_blocks_fetched ( oid ) → bigint | လက်ရှိ transaction အတွင်း — table သို့မဟုတ် index အတွက် — block read တောင်းဆိုမှုများ (block read requests) အရေအတွက်ကို ပြန်ပေးပါတယ်။ ဤ အရေအတွက် အနုတ် `pg_stat_get_xact_blocks_hit` သည် kernel `read()` ခေါ်ယူမှုများ၏ အရေအတွက်ကို ပေးပါတယ်; kernel-level buffering (kernel အဆင့် buffer လုပ်ခြင်း) ကြောင့် — တကယ့် ရုပ်ပိုင်း (physical) reads အရေအတွက်ကတော့ ပုံမှန်အားဖြင့် ပိုနည်းပါတယ်။ |
| pg_stat_get_xact_blocks_hit ( oid ) → bigint | လက်ရှိ transaction အတွင်း — table သို့မဟုတ် index အတွက် — block read တောင်းဆိုမှုများထဲမှ cache ထဲတွင် တွေ့ရှိခဲ့သော (kernel `read()` ခေါ်ယူမှုများကို မဖြစ်ပေါ်စေသော) အရေအတွက်ကို ပြန်ပေးပါတယ်။ |
| pg_stat_clear_snapshot () → void | လက်ရှိ statistics snapshot သို့မဟုတ် cache လုပ်ထားသော အချက်အလက်များကို စွန့်ပစ် (discard) ပါတယ်။ |
| pg_stat_reset () → void | လက်ရှိ database အတွက် statistics counters အားလုံးကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_shared ( [ target text DEFAULT NULL ] ) → void | Argument (ငြင်းခုံ တန်ဖိုး) ပေါ် မူတည်၍ — cluster တစ်ခုလုံးနှင့် ဆိုင်သော statistics counters အချို့ကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ `target` သည် အောက်ပါတို့ ဖြစ်နိုင်ပါတယ်: `archiver` — `pg_stat_archiver` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ `bgwriter` — `pg_stat_bgwriter` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ `checkpointer` — `pg_stat_checkpointer` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ `io` — `pg_stat_io` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ `recovery_prefetch` — `pg_stat_recovery_prefetch` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ `slru` — `pg_stat_slru` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ `wal` — `pg_stat_wal` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ NULL သို့မဟုတ် မသတ်မှတ်ပါက — အထက်တွင် စာရင်းပြုထားသော views များမှ counters အားလုံးကို reset လုပ်ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_single_table_counters ( oid ) → void | လက်ရှိ database ထဲရှိ — သို့မဟုတ် cluster အတွင်းရှိ databases အားလုံးတွင် မျှဝေ (share) ထားသော — table သို့မဟုတ် index တစ်ခုတည်း၏ statistics များကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_backend_stats ( integer ) → void | သတ်မှတ်ထားသော process ID ရှိသော backend တစ်ခုတည်း၏ statistics များကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_single_function_counters ( oid ) → void | လက်ရှိ database ထဲရှိ function တစ်ခုတည်း၏ statistics များကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_slru ( [ target text DEFAULT NULL ] ) → void | SLRU cache တစ်ခုတည်း သို့မဟုတ် cluster ထဲရှိ SLRUs အားလုံးအတွက် statistics များကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ `target` သည် NULL ဖြစ်ပါက သို့မဟုတ် မသတ်မှတ်ပါက — SLRU caches အားလုံးအတွက် `pg_stat_slru` view တွင် ပြသထားသော counters အားလုံးကို reset လုပ်ပါတယ်။ Argument သည် `commit_timestamp`, `multixact_member`, `multixact_offset`, `notify`, `serializable`, `subtransaction` သို့မဟုတ် `transaction` များထဲမှ တစ်ခု ဖြစ်နိုင်ပြီး — ထို entry တစ်ခုတည်းအတွက် counters များကိုသာ reset လုပ်ပါတယ်။ Argument သည် `other` (သို့မဟုတ် အမှန်တကယ် မှတ်မိနိုင်သော အမည် မဟုတ်သည့် မည်သည့်အရာမဆို) ဖြစ်ပါက — extension-defined caches (extension က သတ်မှတ်သော caches) ကဲ့သို့သော အခြား SLRU caches အားလုံးအတွက် counters များကို reset လုပ်ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_replication_slot ( text ) → void | Argument ဖြင့် သတ်မှတ်ထားသော replication slot ၏ statistics များကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ Argument သည် NULL ဖြစ်ပါက — replication slots အားလုံးအတွက် statistics များကို reset လုပ်ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |
| pg_stat_reset_subscription_stats ( oid ) → void | `pg_stat_subscription_stats` view တွင် ပြသထားသော subscription တစ်ခုတည်း၏ statistics များကို သုညသို့ ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ Argument သည် NULL ဖြစ်ပါက — subscriptions အားလုံးအတွက် statistics များကို reset လုပ်ပါတယ်။ ဤ function ကို ပုံမှန်အားဖြင့် superusers များသာ သုံးနိုင်သော်လည်း — အခြား users များကို function ကို run လုပ်ရန် EXECUTE အခွင့်ထူး ပေးအပ်နိုင်ပါတယ်။ |

> **သတိပေးချက်:** `pg_stat_reset()` ကို အသုံးပြုခြင်းသည် — autovacuum က vacuum သို့မဟုတ် analyze တစ်ခုကို ဘယ်အချိန် စတင်ရမည် ဆုံးဖြတ်ရန် အသုံးပြုသော counters များကိုပါ reset လုပ်ပါတယ်။ ဤ counters များကို reset လုပ်ခြင်းသည် autovacuum ကို လိုအပ်သော လုပ်ငန်းများ မလုပ်ဆောင်ဖြစ်စေနိုင်ပြီး — table bloat (table ဖောင်းကားမှု) သို့မဟုတ် table statistics များ ခေတ်နောက်ကျ (out-dated) ခြင်းလို ပြဿနာများကို ဖြစ်စေနိုင်ပါတယ်။ Statistics များကို reset လုပ်ပြီးနောက် — database တစ်ခုလုံးအတွက် (database-wide) `ANALYZE` တစ်ခု လုပ်ဆောင်ရန် အကြံပြုပါတယ်။

`pg_stat_activity` view ၏ အောက်ခံ function ဖြစ်သော `pg_stat_get_activity` သည် — backend process တစ်ခုချင်းစီအကြောင်း ရရှိနိုင်သော အချက်အလက် အားလုံး ပါဝင်သော records အစု (set of records) တစ်ခုကို ပြန်ပေးပါတယ်။ တစ်ခါတစ်ရံ — ဤ အချက်အလက်များ၏ အစိတ်အပိုင်း (subset) တစ်ခုကိုသာ ရယူခြင်းသည် ပို၍ အဆင်ပြေနိုင်ပါတယ်။ ထိုကဲ့သို့ အခြေအနေမျိုးတွင် — အခြား per-backend statistics access functions (backend တစ်ခုချင်းစီဆိုင်ရာ statistics ဝင်ရောက် ရယူသော function များ) အစု တစ်ခုကို အသုံးပြုနိုင်ပါတယ်; ယင်းတို့ကို [ဇယား 27.37](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-BACKEND-FUNCS-TABLE) တွင် ပြသထားပါတယ်။ ဤ access functions များသည် session ၏ backend ID နံပါတ်ကို အသုံးပြုပါတယ် — ၎င်းသည် မည်သည့် တစ်ပြိုင်နက် (concurrent) session ၏ backend ID နှင့်မှ မတူညီသော ကိန်းပြည့် ငယ် တစ်ခု (>= 0) ဖြစ်ပြီး — session တစ်ခု ထွက်သွားသည်နှင့် ၎င်း၏ ID ကို ပြန်လည် အသုံးပြုနိုင်ပါတယ်။ Backend ID ကို — အခြား အရာများကြားတွင် — session တွင် temporary schema (ယာယီ schema) တစ်ခု ရှိပါက ၎င်းကို ဖော်ထုတ်ရန်လည်း အသုံးပြုပါတယ်။ `pg_stat_get_backend_idset` function သည် — ဤ functions များကို ခေါ်ယူရန် အတွက် — active backends အားလုံး၏ ID နံပါတ်များကို စာရင်းပြုရန် အဆင်ပြေသော နည်းလမ်း တစ်ခုကို ထောက်ပံ့ပေးပါတယ်။ ဥပမာ — backends အားလုံး၏ PIDs နှင့် လက်ရှိ queries များကို ပြသရန်:

```sql
SELECT pg_stat_get_backend_pid(backendid) AS pid,
       pg_stat_get_backend_activity(backendid) AS query
FROM pg_stat_get_backend_idset() AS backendid;
```

**ဇယား 27.37. Per-Backend Statistics Functions (backend တစ်ခုချင်းစီဆိုင်ရာ statistics function များ)**
| Function | ဖော်ပြချက် |
| --- | --- |
| pg_stat_get_backend_activity ( integer ) → text | ဤ backend ၏ မကြာသေးခင်က (most recent) query ၏ text ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_activity_start ( integer ) → timestamp with time zone | Backend ၏ မကြာသေးခင်က query စတင်ခဲ့သည့် အချိန်ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_client_addr ( integer ) → inet | ဤ backend ဆီ ချိတ်ဆက်ထားသော client ၏ IP address ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_client_port ( integer ) → integer | Client က ဆက်သွယ်မှုအတွက် အသုံးပြုနေသော TCP port နံပါတ်ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_dbid ( integer ) → oid | ဤ backend ချိတ်ဆက်ထားသော database ၏ OID ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_idset () → setof integer | လက်ရှိ active backend ID နံပါတ်များ၏ အစု (set) ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_pid ( integer ) → integer | ဤ backend ၏ process ID ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_start ( integer ) → timestamp with time zone | ဤ process စတင်ခဲ့သည့် အချိန်ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_subxact ( integer ) → record | သတ်မှတ်ထားသော ID ရှိသော backend ၏ subtransactions (လက်အောက်ခံ transactions) များအကြောင်း အချက်အလက် record တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးသော fields များမှာ — backend ၏ subtransaction cache ထဲရှိ subtransactions အရေအတွက် ဖြစ်သော `subxact_count` နှင့် — backend ၏ subtransaction cache သည် overflow (ပြည့်လျှံ) ဖြစ်မဖြစ် ညွှန်ပြသော `subxact_overflow` တို့ ဖြစ်ပါတယ်။ |
| pg_stat_get_backend_userid ( integer ) → oid | ဤ backend ထဲသို့ ဝင်ရောက်ထားသော user ၏ OID ကို ပြန်ပေးပါတယ်။ |
| pg_stat_get_backend_wait_event ( integer ) → text | ဤ backend သည် လက်ရှိ စောင့်ဆိုင်းနေပါက wait event ၏ အမည်ကို ပြန်ပေးပါတယ် — မဟုတ်ပါက NULL ပြန်ပေးပါတယ်။ ဇယား 27.5 မှ ဇယား 27.13 အထိ ကြည့်ပါ။ |
| pg_stat_get_backend_wait_event_type ( integer ) → text | ဤ backend သည် လက်ရှိ စောင့်ဆိုင်းနေပါက wait event type ၏ အမည်ကို ပြန်ပေးပါတယ် — မဟုတ်ပါက NULL ပြန်ပေးပါတယ်။ အသေးစိတ်အတွက် ဇယား 27.4 ကို ကြည့်ပါ။ |
| pg_stat_get_backend_xact_start ( integer ) → timestamp with time zone | Backend ၏ လက်ရှိ transaction စတင်ခဲ့သည့် အချိန်ကို ပြန်ပေးပါတယ်။ |
