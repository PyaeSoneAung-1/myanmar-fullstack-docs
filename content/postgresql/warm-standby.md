---
title: "Log-Shipping Standby Servers (log shipping standby server များ)"
description: "Log shipping standby server များဖြင့် high availability (HA) cluster တစ်ခု တည်ဆောက်ခြင်း — warm standby/log shipping ၏ သဘောတရားနှင့် data ဆုံးရှုံးမှု ကာလ (asynchronous ဖြစ်ခြင်း, archive_timeout, streaming replication), ကြိုတင် စီစဉ်ခြင်း (Planning — hardware/version လိုက်ဖက်ညီမှု), standby server လည်ပတ်ပုံ (standby.signal, restore_command, pg_wal, pg_ctl promote), primary ပြင်ဆင်ခြင်းနှင့် standby server တပ်ဆင်ခြင်း (base backup, pg_hba.conf, primary_conninfo), streaming replication (authentication, monitoring, pg_stat_replication), replication slots, cascading replication, synchronous replication (FIRST/ANY နည်းလမ်းများ, performance နှင့် high availability အတွက် စီစဉ်ခြင်း), standby ပေါ်တွင် continuous archiving (archive_mode ကို on/always သတ်မှတ်ခြင်း) အကြောင်း ရှင်းလင်းချက်"
order: 194
source: "https://www.postgresql.org/docs/current/warm-standby.html"
status: translated
updated: 2026-09-06
---

## 26.2. Log-Shipping Standby Servers (WAL log ပို့ဆောင်ပေးသော standby server များ)

- **26.2.1. Planning (ကြိုတင် စီစဉ်ခြင်း)**
- **26.2.2. Standby Server Operation (standby server လည်ပတ်ပုံ)**
- **26.2.3. Preparing the Primary for Standby Servers (standby server များအတွက် primary ပြင်ဆင်ခြင်း)**
- **26.2.4. Setting Up a Standby Server (standby server တစ်ခု တပ်ဆင် သတ်မှတ်ခြင်း)**
- **26.2.5. Streaming Replication (streaming replication — စီးဆင်းမှု ပုံစံ replication)**
- **26.2.6. Replication Slots (replication slots — replication slot များ)**
- **26.2.7. Cascading Replication (cascading replication — အဆင့်ဆင့် ဆင့်ပွား replication)**
- **26.2.8. Synchronous Replication (synchronous replication — တစ်ပြိုင်နက် ထပ်တူပြု replication)**
- **26.2.9. Continuous Archiving in Standby (standby ပေါ်တွင် စဉ်ဆက်မပြတ် archiving)**

Continuous archiving (စဉ်ဆက်မပြတ် archiving — WAL ဖိုင်များကို စဉ်ဆက်မပြတ် မှတ်တမ်း သိမ်းဆည်းခြင်း) ကို သုံးပြီး — primary server (ပင်မ server) တစ်ခု ကျရှုံးသွားရင် လုပ်ငန်းဆောင်တာတွေကို လွှဲပြောင်း တာဝန်ယူဖို့ အသင့် ရှိနေတဲ့ — *standby server* (အရန် server) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ — *high availability* (HA) (မြင့်မားသော ရရှိနိုင်မှု) cluster configuration တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ ဒီစွမ်းရည်ကို *warm standby* (warm standby — ဘယ်အချိန် မဆို တာဝန် လွှဲယူရန် အသင့်ရှိသော အရန် system) ဒါမှမဟုတ် *log shipping* (log ပို့ဆောင်ခြင်း) လို့ ကျယ်ကျယ်ပြန့်ပြန့် ရည်ညွှန်း ခေါ်ဝေါ်ပါတယ်။

Primary နဲ့ standby server တွေက ဒီစွမ်းရည်ကို ပေးအပ်ဖို့ အတူတကွ အလုပ်လုပ်ကြပေမယ့် — server တွေကြားမှာ ချိတ်ဆက်မှုက လျော့ရဲရဲ (loosely coupled) ပဲ ရှိပါတယ်။ Primary server က continuous archiving mode (စဉ်ဆက်မပြတ် archiving mode) နဲ့ လည်ပတ်နေချိန်မှာ — standby server တစ်ခုချင်းစီက continuous recovery mode (စဉ်ဆက်မပြတ် recovery mode) နဲ့ လည်ပတ်ပြီး — primary ကနေ WAL (write-ahead log — ဒေတာ မရေးသားမီ ကြိုတင် မှတ်တမ်းတင်သော log) ဖိုင်တွေကို ဖတ်ယူပါတယ်။ ဒီစွမ်းရည်ကို ဖွင့်နိုင်ဖို့ database tables တွေကို ပြောင်းလဲစရာ မလိုတာမို့ — တခြား replication (ပုံတူပွားခြင်း) နည်းလမ်း တချို့နဲ့ ယှဉ်ရင် — စီမံခန့်ခွဲမှု ဝန်ထုပ် ဝန်ပိုး (administration overhead) နည်းပါးပါတယ်။ ဒီ configuration က primary server ပေါ်မှာ စွမ်းဆောင်ရည် သက်ရောက်မှု အတော်လည်း နည်းပါးပါတယ်။

WAL records (WAL မှတ်တမ်းများ) တွေကို database server တစ်ခုကနေ နောက်တစ်ခုဆီ တိုက်ရိုက် ရွှေ့ပြောင်းတာကို log shipping လို့ ပုံမှန်အားဖြင့် ဖော်ပြလေ့ ရှိပါတယ်။ PostgreSQL က file-based log shipping (ဖိုင်အခြေပြု log ပို့ဆောင်ခြင်း) ကို — WAL records တွေကို ဖိုင်တစ်ခုစီ (WAL segment — WAL အပိုင်းအစ) နှုန်းနဲ့ လွှဲပြောင်းခြင်းအားဖြင့် အကောင်အထည် ဖော်ပါတယ်။ WAL ဖိုင်တွေ (16MB) ကို — ကပ်လျက် system တစ်ခုဆီ ဖြစ်စေ — နေရာတစ်ခုတည်းမှာ ရှိတဲ့ အခြား system တစ်ခုဆီ ဖြစ်စေ — ကမ္ဘာ့အခြားတစ်ဖက်ခြမ်းက system တစ်ခုဆီ ဖြစ်စေ — ဘယ်အကွာအဝေးကိုမဆို လွယ်ကူပြီး စရိတ် သက်သာစွာ ပို့ဆောင်နိုင်ပါတယ်။ ဒီနည်းလမ်းအတွက် လိုအပ်တဲ့ bandwidth (ဆက်သွယ်မှု စွမ်းရည်) က primary server ရဲ့ transaction rate (transaction နှုန်း) ပေါ်မူတည်ပြီး ကွဲပြားပါတယ်။ Record-based log shipping (record တစ်ခုချင်း အခြေပြု log ပို့ဆောင်ခြင်း) က ပိုမို သေးစိတ်ပြီး — WAL ပြောင်းလဲမှုတွေကို network connection တစ်ခုပေါ်မှာ တဖြည်းဖြည်း (incrementally) stream လုပ်ပါတယ် ([အပိုင်း 26.2.5](https://www.postgresql.org/docs/current/warm-standby.html#STREAMING-REPLICATION) ကို ကြည့်ပါ)။

Log shipping က asynchronous (asynchronous — တစ်ပြိုင်နက်တည်း မဟုတ်သော — နောက်ကျမှ လုပ်ဆောင်သော) ဖြစ်တယ်ဆိုတာ သတိပြုသင့်ပါတယ် — ဆိုလိုတာက WAL records တွေကို transaction commit (transaction အတည်ပြု လုပ်ဆောင်မှု) ပြီးမှသာ ပို့ဆောင်ပါတယ်။ ရလဒ်အနေနဲ့ — primary server က ဆိုးရွားတဲ့ ကျရှုံးမှု (catastrophic failure) တစ်ခု ကြုံတွေ့ခဲ့ရင် — data ဆုံးရှုံးမှု ဖြစ်နိုင်ခြေ ရှိတဲ့ ကာလ (window) တစ်ခု ရှိပြီး — မပို့ဆောင်ရသေးတဲ့ transactions တွေ ဆုံးရှုံးသွားနိုင်ပါတယ်။ File-based log shipping မှာ data ဆုံးရှုံးမှု ကာလရဲ့ အရွယ်အစားကို — စက္ကန့် အနည်းငယ်လောက်အထိ နိမ့်အောင် သတ်မှတ်နိုင်တဲ့ — `archive_timeout` parameter ကို သုံးပြီး ကန့်သတ်နိုင်ပါတယ်။ ဒါပေမယ့် — အဲဒီလို နိမ့်တဲ့ သတ်မှတ်ချက်က ဖိုင် ပို့ဆောင်မှုအတွက် လိုအပ်တဲ့ bandwidth ကို သိသိသာသာ တိုးစေမှာ ဖြစ်ပါတယ်။ Streaming replication (streaming replication — စီးဆင်းမှု ပုံစံ replication) ကတော့ ([အပိုင်း 26.2.5](https://www.postgresql.org/docs/current/warm-standby.html#STREAMING-REPLICATION) ကို ကြည့်ပါ) — ပိုမို သေးငယ်တဲ့ data ဆုံးရှုံးမှု ကာလကို ခွင့်ပြုပါတယ်။

Recovery ရဲ့ စွမ်းဆောင်ရည်က လုံလောက်လောက်အောင် ကောင်းတာမို့ — standby ကို activate (စတင် သက်ဝင်စေ) လုပ်လိုက်တာနဲ့ — ပုံမှန်အားဖြင့် အပြည့်အဝ ရရှိနိုင်မှု (full availability) ဆီ ခဏအတွင်းမှာပဲ ရောက်ရှိနိုင်ပါတယ်။ ရလဒ်အနေနဲ့ — ဒါကို high availability ပေးစွမ်းတဲ့ warm standby configuration လို့ ခေါ်ပါတယ်။ Archived base backup (မှတ်တမ်း သိမ်းထားသော base backup) တစ်ခုကနေ server တစ်ခုကို restore လုပ်ပြီး rollforward (ရှေ့သို့ ပြန်လည် ဆင့်ပွား လုပ်ဆောင်ခြင်း) လုပ်တာကတော့ သိသိသာသာ ပိုကြာမြင့်တာမို့ — အဲဒီနည်းလမ်းက disaster recovery (ဘေးအန္တရာယ် ပြန်လည် ရယူရေး) အတွက်ပဲ အဖြေ ပေးနိုင်ပြီး — high availability အတွက်တော့ မဟုတ်ပါဘူး။ Standby server တစ်ခုကို read-only (ဖတ်ရှုရုံသက်သက်) queries တွေအတွက်လည်း သုံးနိုင်ပြီး — အဲဒီလို အခြေအနေမျိုးမှာ *hot standby* server (hot standby — query များ ဖတ်ရှုနိုင်သော standby) လို့ ခေါ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 26.4](https://www.postgresql.org/docs/current/hot-standby.html) ကို ကြည့်ပါ။

### 26.2.1. Planning (ကြိုတင် စီစဉ်ခြင်း)

Primary နဲ့ standby server တွေကို — အနည်းဆုံး database server ရဲ့ ရှုထောင့်ကနေ ကြည့်ရင် — တတ်နိုင်သမျှ တူညီအောင် ဖန်တီးထားတာက များသောအားဖြင့် ပညာရှိရာ ရောက်ပါတယ်။ အထူးသဖြင့် — tablespaces (tablespace — ဒေတာ သိမ်းဆည်းရန် နေရာများ) တွေနဲ့ ဆက်စပ်နေတဲ့ path names (လမ်းကြောင်း အမည်များ) တွေကို ပြုပြင်မှု မရှိဘဲ ဖြတ်သန်း ပေးပို့တာမို့ — အဲဒီ feature ကို သုံးနေတယ်ဆိုရင် — primary ရော standby server တွေပါ tablespaces တွေအတွက် တူညီတဲ့ mount paths (mount လုပ်ထားသော လမ်းကြောင်းများ) ရှိရပါမယ်။ Primary ပေါ်မှာ [CREATE TABLESPACE](https://www.postgresql.org/docs/current/sql-createtablespace.html) ကို execute လုပ်တယ်ဆိုရင် — အဲဒါအတွက် လိုအပ်တဲ့ mount point အသစ် တစ်ခုခုကို command ကို execute မလုပ်ခင် — primary ပေါ်မှာ ရော standby server တွေ အားလုံးပေါ်မှာပါ ဖန်တီးထားရမယ်ဆိုတာ သတိရပါ။ Hardware တွေ အတိအကျ တူညီနေဖို့တော့ မလိုပါဘူး — ဒါပေမယ့် — application နဲ့ system ရဲ့ သက်တမ်း တစ်လျှောက်မှာ — တူညီတဲ့ system နှစ်ခုကို ထိန်းသိမ်းရတာက — မတူညီတဲ့ system နှစ်ခုကို ထိန်းသိမ်းရတာထက် ပိုလွယ်ကူတယ်ဆိုတာ အတွေ့အကြုံက ပြသပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — hardware architecture (စက်၏ တည်ဆောက်ပုံ) ကတော့ တူညီရပါမယ် — ဥပမာ 32-bit system ကနေ 64-bit system ဆီ log shipping လုပ်တာမျိုးက အလုပ်မလုပ်ပါဘူး။

ယေဘုယျအားဖြင့် — မတူညီတဲ့ major PostgreSQL release levels (အဓိက version အဆင့်များ) တွေကို run နေတဲ့ server တွေကြားမှာ log shipping လုပ်တာက မဖြစ်နိုင်ပါဘူး။ Minor release upgrades (အသေးစား version အဆင့်မြှင့်တင်မှုများ) တွေအတွင်း disk formats တွေကို ပြောင်းလဲမှု မလုပ်ဖို့ဆိုတာ PostgreSQL Global Development Group ရဲ့ မူဝါဒ ဖြစ်တာမို့ — primary နဲ့ standby server တွေပေါ်မှာ မတူညီတဲ့ minor release levels တွေကို run လုပ်ရင် အောင်မြင်စွာ အလုပ်လုပ်နိုင်ဖို့ များပါတယ်။ ဒါပေမယ့် — အဲဒါအတွက် တရားဝင် ထောက်ပံ့မှု (formal support) မရှိဘူးဆိုတာ သိထားပြီး — primary နဲ့ standby server တွေကို တတ်နိုင်သမျှ တူညီတဲ့ release level မှာ ထားဖို့ အကြံပြုလိုပါတယ်။ Minor release အသစ်တစ်ခုဆီ update လုပ်တဲ့အခါ — standby server တွေကို အရင်ဆုံး update လုပ်တာက အလုံခြုံဆုံး မူဝါဒ ဖြစ်ပါတယ် — minor release အသစ်တစ်ခုက ယခင် minor release ကနေ WAL ဖိုင်တွေကို ဖတ်နိုင်ခြေက — အပြန်အလှန် (ယခင် release က အသစ်ကနေ ဖတ်တာ) ထက် ပိုများလို့ပါ။

### 26.2.2. Standby Server Operation (standby server လည်ပတ်ပုံ)

Server တစ်ခု စတင်တဲ့အခါ — data directory (ဒေတာ သိမ်းဆည်းရာ directory) ထဲမှာ `standby.signal` ဖိုင် တစ်ခု ရှိနေရင် — အဲဒီ server က standby mode (standby ပုံစံ) ထဲ ဝင်ရောက်ပါတယ်။

Standby mode မှာ — server က primary server ကနေ လက်ခံရရှိတဲ့ WAL ကို စဉ်ဆက်မပြတ် apply (အသုံးချ — ပြန်လည် သွင်းယူ) လုပ်ပါတယ်။ Standby server က WAL archive (WAL မှတ်တမ်း သိုလှောင်ရာ) တစ်ခုကနေ WAL ကို ဖတ်နိုင်ပါတယ် ([restore_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-RESTORE-COMMAND) ကို ကြည့်ပါ) ဒါမှမဟုတ် — TCP connection တစ်ခုပေါ်မှာ primary ကနေ တိုက်ရိုက် ဖတ်နိုင်ပါတယ် (streaming replication)။ Standby server က standby cluster ရဲ့ `pg_wal` directory ထဲမှာ တွေ့ရတဲ့ WAL ဘယ်ခုကိုမဆို ပြန်လည် ရယူဖို့လည်း ကြိုးစားပါလိမ့်မယ်။ အဲဒါက ပုံမှန်အားဖြင့် server restart (server ပြန်လည် စတင်ခြင်း) တစ်ခု ပြီးတဲ့အခါ — restart မလုပ်ခင် primary ကနေ stream လုပ်ခဲ့တဲ့ WAL ကို standby က နောက်တစ်ကြိမ် replay (ပြန်လည် သွင်းယူ လုပ်ဆောင်) လုပ်တဲ့အခါ ဖြစ်ပေါ်ပေမယ့် — ဘယ်အချိန် မဆို `pg_wal` ဆီ ဖိုင်တွေကို ကိုယ်တိုင် ကူးယူပြီး replay လုပ်စေလည်း ရပါတယ်။

စတင်ချိန်မှာ — standby က archive location ထဲမှာ ရနိုင်တဲ့ WAL အားလုံးကို `restore_command` ကို ခေါ်ပြီး restore (ပြန်လည် ရယူ) လုပ်ခြင်းဖြင့် စတင်ပါတယ်။ အဲဒီမှာ ရနိုင်တဲ့ WAL ရဲ့ အဆုံးကို ရောက်ရှိပြီး `restore_command` ကျရှုံးတာနဲ့ — `pg_wal` directory ထဲမှာ ရနိုင်တဲ့ WAL ဘယ်ခုကိုမဆို restore လုပ်ဖို့ ကြိုးစားပါတယ်။ အဲဒါ ကျရှုံးပြီး — streaming replication ကို configure လုပ်ထားတယ်ဆိုရင် — standby က primary server ဆီ connect လုပ်ဖို့ ကြိုးစားပြီး — archive ဒါမှမဟုတ် `pg_wal` ထဲမှာ တွေ့ရတဲ့ နောက်ဆုံး valid record (မှန်ကန်သော မှတ်တမ်း) ကနေ WAL ကို streaming စတင်ပါတယ်။ အဲဒါ ကျရှုံးခဲ့ရင် ဒါမှမဟုတ် — streaming replication ကို configure မလုပ်ထားဘူးဆိုရင် ဒါမှမဟုတ် — connection က နောက်ပိုင်းမှာ ပြတ်တောက်သွားခဲ့ရင် — standby က အဆင့် 1 ဆီ ပြန်သွားပြီး archive ကနေ ဖိုင်ကို ထပ်မံ restore လုပ်ဖို့ ကြိုးစားပါတယ်။ Archive, `pg_wal` နဲ့ streaming replication ကနေ ထပ်ခါထပ်ခါ ကြိုးစားတဲ့ ဒီ loop (သံသရာ လည်ပတ်မှု) က — server ကို ရပ်တန့်လိုက်တဲ့အထိ ဒါမှမဟုတ် promoted (primary အဖြစ် ရာထူးတိုး ပြောင်းလဲ) လုပ်လိုက်တဲ့အထိ ဆက်လက် ဖြစ်ပေါ်နေပါတယ်။

`pg_ctl promote` ကို run လုပ်တဲ့အခါ ဒါမှမဟုတ် `pg_promote()` ကို ခေါ်ယူတဲ့အခါ — standby mode ကနေ ထွက်ပြီး — server က ပုံမှန် လည်ပတ်မှု (normal operation) ဆီ ပြောင်းလဲပါတယ်။ Failover (primary ပြောင်းလဲ လွှဲပြောင်းမှု) မတိုင်ခင် — archive ဒါမှမဟုတ် `pg_wal` ထဲမှာ ချက်ချင်း ရနိုင်တဲ့ WAL ဘယ်ခုကိုမဆို restore လုပ်မှာ ဖြစ်ပေမယ့် — primary ဆီ connect လုပ်ဖို့တော့ ကြိုးစားမှာ မဟုတ်ပါဘူး။

### 26.2.3. Preparing the Primary for Standby Servers (standby server များအတွက် primary ပြင်ဆင်ခြင်း)

Primary ပေါ်မှာ — standby ကနေ ဝင်ရောက်လို့ ရတဲ့ archive directory တစ်ခုဆီ continuous archiving ကို ပြင်ဆင် သတ်မှတ်ပါ — [အပိုင်း 25.3](https://www.postgresql.org/docs/current/continuous-archiving.html) မှာ ဖော်ပြထားတဲ့အတိုင်းပါ။ Archive location က primary ကျဆင်းနေချိန်မှာတောင် standby ကနေ ဝင်ရောက်လို့ ရနိုင်ရပါမယ် — ဆိုလိုတာက — အဲဒါက primary server ပေါ်မှာ မဟုတ်ဘဲ — standby server ကိုယ်တိုင် ဒါမှမဟုတ် အခြား ယုံကြည်စိတ်ချရတဲ့ (trusted) server တစ်ခုပေါ်မှာ တည်ရှိရပါမယ်။

Streaming replication ကို သုံးချင်တယ်ဆိုရင် — standby server (များ) ကနေ replication connections တွေ ဝင်ရောက်ခွင့် ပြုဖို့ — primary server ပေါ်မှာ authentication (စစ်မှန်ကြောင်း စိစစ်ခြင်း) ကို ပြင်ဆင် သတ်မှတ်ပါ; ဆိုလိုတာက — role တစ်ခု ဖန်တီးပြီး — `pg_hba.conf` ထဲမှာ database field ကို `replication` လို့ သတ်မှတ်ထားတဲ့ သင့်လျော်တဲ့ entry (entries) တွေ ထည့်သွင်းပေးပါ။ ပြီးတော့ — primary server ရဲ့ configuration ဖိုင်ထဲမှာ `max_wal_senders` ကို လုံလောက်လောက်အောင် ကြီးတဲ့ တန်ဖိုးနဲ့ သတ်မှတ်ထားကြောင်းလည်း သေချာစေပါ။ Replication slots (ပုံတူပွား ဒေတာ လွှဲပြောင်းမှုအတွက် slot များ) ကို သုံးမယ်ဆိုရင် — `max_replication_slots` ကိုလည်း လုံလောက်လောက်အောင် မြင့်အောင် သတ်မှတ်ထားကြောင်း သေချာစေပါ။

Standby server ကို bootstrap (စတင် တည်ဆောက်) လုပ်ဖို့ — [အပိုင်း 25.3.2](https://www.postgresql.org/docs/current/continuous-archiving.html#BACKUP-BASE-BACKUP) မှာ ဖော်ပြထားတဲ့အတိုင်း base backup (အခြေခံ အရန်ကူး) တစ်ခု ယူပါ။

### 26.2.4. Setting Up a Standby Server (standby server တစ်ခု တပ်ဆင် သတ်မှတ်ခြင်း)

Standby server ကို တပ်ဆင် သတ်မှတ်ဖို့ဆိုရင် — primary server ကနေ ယူထားတဲ့ base backup ကို restore လုပ်ပါ ([အပိုင်း 25.3.5](https://www.postgresql.org/docs/current/continuous-archiving.html#BACKUP-PITR-RECOVERY) ကို ကြည့်ပါ)။ Standby ရဲ့ cluster data directory ထဲမှာ [`standby.signal`](https://www.postgresql.org/docs/current/warm-standby.html#FILE-STANDBY-SIGNAL) ဖိုင် တစ်ခု ဖန်တီးပါ။ WAL archive ကနေ ဖိုင်တွေကို ကူးယူဖို့ [restore_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-RESTORE-COMMAND) ကို ရိုးရှင်းတဲ့ command တစ်ခုအဖြစ် သတ်မှတ်ပါ။ High availability ရည်ရွယ်ချက်တွေအတွက် standby server အများအပြား ထားဖို့ စီစဉ်နေတယ်ဆိုရင် — standby server က အခြား standby တစ်ခုဆီ failover ဖြစ်ချိန်မှာ ဖြစ်ပေါ်တဲ့ timeline ပြောင်းလဲမှုကို လိုက်နာနိုင်ဖို့ — `recovery_target_timeline` ကို `latest` (default) အဖြစ် သတ်မှတ်ထားကြောင်း သေချာစေပါ။

> **မှတ်ချက်:** ဖိုင် မရှိဘူးဆိုရင် — [restore_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-RESTORE-COMMAND) က ချက်ချင်း return (ပြန်လာ) သင့်ပါတယ်; လိုအပ်ရင် server က command ကို နောက်တစ်ကြိမ် ထပ်ကြိုးစားပါလိမ့်မယ်။

Streaming replication ကို သုံးချင်တယ်ဆိုရင် — [primary_conninfo](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-PRIMARY-CONNINFO) ကို libpq connection string (libpq ဆက်သွယ်မှု စာကြောင်း) တစ်ခုနဲ့ ဖြည့်စွက်ပါ — host name (သို့မဟုတ် IP address) နဲ့ primary server ဆီ connect လုပ်ဖို့ လိုအပ်တဲ့ နောက်ထပ် အသေးစိတ် အချက်အလက်တွေ ပါဝင်အောင်ပါ။ Primary က authentication အတွက် စကားဝှက် လိုအပ်ရင် — စကားဝှက်ကို [primary_conninfo](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-PRIMARY-CONNINFO) ထဲမှာလည်း သတ်မှတ်ပေးရပါမယ်။

High availability ရည်ရွယ်ချက်တွေအတွက် standby server ကို တပ်ဆင်နေတယ်ဆိုရင် — WAL archiving, connections နဲ့ authentication တွေကို primary server လိုပဲ ပြင်ဆင် သတ်မှတ်ပါ — အကြောင်းကတော့ failover ပြီးတဲ့နောက်မှာ standby server က primary server အဖြစ် အလုပ်လုပ်ရမှာ မို့ပါ။

WAL archive ကို သုံးနေတယ်ဆိုရင် — standby server က နောက်ထပ် မလိုအပ်တော့တဲ့ ဖိုင်တွေကို ဖယ်ရှားဖို့ — [archive_cleanup_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-ARCHIVE-CLEANUP-COMMAND) parameter ကို သုံးပြီး — archive ရဲ့ အရွယ်အစားကို အနည်းဆုံး ဖြစ်အောင် လျှော့ချနိုင်ပါတယ်။ pg_archivecleanup utility က ပုံမှန် single-standby configurations တွေမှာ `archive_cleanup_command` နဲ့ တွဲဖက် သုံးဖို့အတွက် အထူး ဒီဇိုင်းထုတ်ထားတာ ဖြစ်ပြီး — [pg_archivecleanup](https://www.postgresql.org/docs/current/pgarchivecleanup.html) ကို ကြည့်ပါ။ ဒါပေမယ့် — archive ကို backup ရည်ရွယ်ချက်တွေအတွက် သုံးနေတယ်ဆိုရင် — standby က မလိုအပ်တော့ဘူးဆိုရင်တောင် — အနည်းဆုံး နောက်ဆုံး base backup ကနေ recovery လုပ်ဖို့ လိုအပ်တဲ့ ဖိုင်တွေကိုတော့ ထိန်းသိမ်းထားရပါမယ်ဆိုတာ သတိပြုပါ။

ရိုးရှင်းတဲ့ configuration ဥပမာ တစ်ခုကတော့:

```sql
primary_conninfo = 'host=192.168.1.50 port=5432 user=foo password=foopass options=''-c wal_sender_timeout=5000'''
restore_command = 'cp /path/to/archive/%f %p'
archive_cleanup_command = 'pg_archivecleanup /path/to/archive %r'
```

Standby server တွေ ဘယ်နှစ်ခုမဆို ထားနိုင်ပေမယ့် — streaming replication သုံးနေတယ်ဆိုရင် — ၎င်းတို့ကို တစ်ပြိုင်နက် connect လုပ်ခွင့် ပြုနိုင်ဖို့ — primary ထဲမှာ `max_wal_senders` ကို လုံလောက်လောက်အောင် မြင့်အောင် သတ်မှတ်ထားကြောင်း သေချာစေပါ။

### 26.2.5. Streaming Replication (streaming replication — စီးဆင်းမှု ပုံစံ replication)

Streaming replication က — file-based log shipping နဲ့ ဖြစ်နိုင်တာထက် — standby server တစ်ခုကို ပိုမို နောက်ဆုံး အခြေအနေ (up-to-date) နဲ့ နီးကပ်နေအောင် ခွင့်ပြုပါတယ်။ Standby က primary ဆီ connect လုပ်ပြီး — primary က WAL records တွေ ထုတ်လုပ်လာတာနဲ့ — WAL ဖိုင် အပြည့် မဖြစ်ဖို့ မစောင့်ဘဲ — standby ဆီ stream လုပ်ပေးပါတယ်။

Streaming replication က default အနေနဲ့ asynchronous ဖြစ်ပါတယ် ([အပိုင်း 26.2.8](https://www.postgresql.org/docs/current/warm-standby.html#SYNCHRONOUS-REPLICATION) ကို ကြည့်ပါ) — အဲဒီအခြေအနေမှာ — primary ပေါ်မှာ transaction တစ်ခု commit လုပ်တာနဲ့ — အပြောင်းအလဲတွေ standby ပေါ်မှာ မြင်နိုင်ဖြစ်လာတာအကြား — နှောင့်နှေးမှု အနည်းငယ် ရှိပါတယ်။ ဒါပေမယ့် — ဒီ နှောင့်နှေးမှုက file-based log shipping ထက် အများကြီး ပိုနည်းပြီး — standby က load (ဝန်အား) နဲ့ ရင်ပေါင်တန်း လိုက်နိုင်လောက်အောင် စွမ်းဆောင်ရည် ရှိတယ်ဆိုရင် — ပုံမှန်အားဖြင့် တစ်စက္ကန့် အောက်မှာ ရှိပါတယ်။ Streaming replication နဲ့ဆိုရင် — data ဆုံးရှုံးမှု ကာလကို လျှော့ချဖို့ `archive_timeout` မလိုအပ်ပါဘူး။

File-based continuous archiving မပါဘဲ streaming replication ကို သုံးနေတယ်ဆိုရင် — server က standby က WAL segments တွေ မလက်ခံရသေးခင်မှာပဲ — WAL segments အဟောင်းတွေကို recycle (ပြန်လည် သုံးစွဲ) လုပ်မိနိုင်ပါတယ်။ အဲဒီလို ဖြစ်ခဲ့ရင် — standby ကို base backup အသစ်တစ်ခုကနေ ပြန်လည် စတင် တည်ဆောက် (reinitialize) ရပါလိမ့်မယ်။ WAL segments တွေ စောလွန်းအောင် recycle မဖြစ်အောင် သေချာစေဖို့ `wal_keep_size` ကို လုံလောက်လောက်အောင် ကြီးတဲ့ တန်ဖိုးတစ်ခုအဖြစ် သတ်မှတ်ခြင်းဖြင့် ဒါမှမဟုတ် — standby အတွက် replication slot တစ်ခု configure လုပ်ခြင်းဖြင့် — ဒီပြဿနာကို ရှောင်ရှားနိုင်ပါတယ်။ Standby ကနေ ဝင်ရောက်လို့ ရတဲ့ WAL archive တစ်ခု ပြင်ဆင် သတ်မှတ်ထားရင်တော့ — ဒီဖြေရှင်းနည်းတွေ မလိုအပ်ပါဘူး — အကြောင်းကတော့ standby က segments လုံလောက်စွာ ထိန်းသိမ်းထားသရွေ့ — archive ကို သုံးပြီး လိုက်မှီ (catch up) နိုင်လို့ပါ။

Streaming replication ကို သုံးဖို့ဆိုရင် — [အပိုင်း 26.2](https://www.postgresql.org/docs/current/warm-standby.html) မှာ ဖော်ပြထားတဲ့အတိုင်း file-based log-shipping standby server တစ်ခု ပြင်ဆင် သတ်မှတ်ပါ။ File-based log-shipping standby တစ်ခုကို streaming replication standby အဖြစ် ပြောင်းလဲပေးတဲ့ အဆင့်ကတော့ — `primary_conninfo` setting ကို primary server ဆီ ညွှန်ပြအောင် သတ်မှတ်ခြင်းပဲ ဖြစ်ပါတယ်။ Standby server က primary server ပေါ်က `replication` pseudo-database (အတုအယောင် database) ဆီ connect လုပ်နိုင်အောင် — primary ပေါ်မှာ [listen_addresses](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-LISTEN-ADDRESSES) နဲ့ authentication options တွေကို သတ်မှတ်ပါ (`pg_hba.conf` ကို ကြည့်ပါ — [အပိုင်း 26.2.5.1](https://www.postgresql.org/docs/current/warm-standby.html#STREAMING-REPLICATION-AUTHENTICATION))။

Keepalive socket option ကို ထောက်ပံ့တဲ့ systems တွေပေါ်မှာ — [tcp_keepalives_idle](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-TCP-KEEPALIVES-IDLE), [tcp_keepalives_interval](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-TCP-KEEPALIVES-INTERVAL) နဲ့ [tcp_keepalives_count](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-TCP-KEEPALIVES-COUNT) တို့ကို သတ်မှတ်တာက — connection တစ်ခု ပြတ်တောက်နေတာကို primary က ချက်ချင်း သတိပြုမိအောင် ကူညီပေးပါတယ်။

Standby servers တွေကနေ တစ်ပြိုင်နက် ဝင်ရောက်မယ့် connections အများဆုံး အရေအတွက်ကို သတ်မှတ်ပါ (အသေးစိတ်အတွက် [max_wal_senders](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS) ကို ကြည့်ပါ)။

Standby ကို စတင်ပြီး `primary_conninfo` ကို မှန်ကန်စွာ သတ်မှတ်ထားတဲ့အခါ — standby က archive ထဲမှာ ရနိုင်တဲ့ WAL ဖိုင်တွေ အားလုံးကို replay လုပ်ပြီးမှ — primary ဆီ connect လုပ်ပါလိမ့်မယ်။ Connection က အောင်မြင်စွာ တည်ဆောက်နိုင်ခဲ့ရင် — standby ပေါ်မှာ `walreceiver` တစ်ခုကို မြင်ရမှာ ဖြစ်ပြီး — primary ပေါ်မှာလည်း သက်ဆိုင်တဲ့ `walsender` process တစ်ခုကို မြင်ရပါလိမ့်မယ်။

#### 26.2.5.1. Authentication (authentication — စစ်မှန်ကြောင်း စိစစ်ခြင်း)

Replication အတွက် access privileges (ဝင်ရောက်ခွင့် အခွင့်ထူးများ) ကို — ယုံကြည်စိတ်ချရတဲ့ users တွေပဲ WAL stream ကို ဖတ်နိုင်အောင် ပြင်ဆင် သတ်မှတ်ထားတာက အလွန် အရေးကြီးပါတယ် — အကြောင်းကတော့ အဲဒီကနေ အခွင့်ထူး ခံစားခွင့် ရှိတဲ့ အချက်အလက်တွေ (privileged information) ကို ထုတ်ယူဖို့ လွယ်ကူလို့ပါ။ Standby server တွေက primary ဆီ — `REPLICATION` privilege ရှိတဲ့ account တစ်ခု ဒါမှမဟုတ် superuser (အကြီးအကဲ user) အနေနဲ့ authenticate လုပ်ရပါမယ်။ Replication အတွက် `REPLICATION` နဲ့ `LOGIN` privileges ရှိတဲ့ — သီးသန့် user account တစ်ခု ဖန်တီးဖို့ အကြံပြုလိုပါတယ်။ `REPLICATION` privilege က အလွန် မြင့်မားတဲ့ permissions တွေ ပေးပေမယ့် — primary system ပေါ်မှာ data ဘယ်ခုကိုမဆို ပြုပြင် ပြောင်းလဲဖို့တော့ ခွင့်မပြုပါဘူး — `SUPERUSER` privilege ကတော့ ခွင့်ပြုပါတယ်။

Replication အတွက် client authentication ကို — `database` field ထဲမှာ `replication` ကို သတ်မှတ်ထားတဲ့ `pg_hba.conf` record တစ်ခုက ထိန်းချုပ်ပါတယ်။ ဥပမာ — standby က host IP `192.168.1.100` ပေါ်မှာ run နေပြီး replication အတွက် account name က `foo` ဆိုရင် — administrator (စီမံခန့်ခွဲသူ) က primary ပေါ်က `pg_hba.conf` ဖိုင်ထဲကို အောက်ပါ line ကို ထည့်သွင်းနိုင်ပါတယ်:

```sql
# Allow the user "foo" from host 192.168.1.100 to connect to the primary
# as a replication standby if the user's password is correctly supplied.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    replication     foo             192.168.1.100/32        scram-sha-256
```

Primary ရဲ့ host name နဲ့ port number, connection user name နဲ့ စကားဝှက်တို့ကို [primary_conninfo](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-PRIMARY-CONNINFO) ထဲမှာ သတ်မှတ်ပါတယ်။ စကားဝှက်ကို standby ပေါ်က `~/.pgpass` ဖိုင်ထဲမှာလည်း သတ်မှတ်နိုင်ပါတယ် (`database` field ထဲမှာ `replication` ကို သတ်မှတ်ပါ)။ ဥပမာ — primary က host IP `192.168.1.50`, port `5432` ပေါ်မှာ run နေပြီး — replication အတွက် account name က `foo` ဖြစ်ပြီး — စကားဝှက်က `foopass` ဆိုရင် — administrator က standby ပေါ်က `postgresql.conf` ဖိုင်ထဲကို အောက်ပါ line ကို ထည့်သွင်းနိုင်ပါတယ်:

```sql
# The standby connects to the primary that is running on host 192.168.1.50
# and port 5432 as the user "foo" whose password is "foopass".
primary_conninfo = 'host=192.168.1.50 port=5432 user=foo password=foopass'
```

#### 26.2.5.2. Monitoring (စောင့်ကြည့် စစ်ဆေးခြင်း)

Streaming replication ရဲ့ အရေးကြီးတဲ့ ကျန်းမာရေး ညွှန်ပြချက် (health indicator) တစ်ခုကတော့ — primary ပေါ်မှာ ထုတ်လုပ်ပြီး — standby ပေါ်မှာ မကျင့်သုံးရသေးတဲ့ (not yet applied) WAL records ပမာဏ ဖြစ်ပါတယ်။ Primary ပေါ်က လက်ရှိ WAL write location (ရေးသားသည့် နေရာ) ကို — standby က လက်ခံရရှိထားတဲ့ နောက်ဆုံး WAL location နဲ့ နှိုင်းယှဉ်ပြီး — ဒီ lag (နောက်ကျမှု) ကို တွက်ချက်နိုင်ပါတယ်။ ဒီ locations တွေကို primary ပေါ်မှာ `pg_current_wal_lsn` နဲ့ standby ပေါ်မှာ `pg_last_wal_receive_lsn` ကို အသီးသီး သုံးပြီး ရယူနိုင်ပါတယ် (အသေးစိတ်အတွက် [ဇယား 9.97](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-BACKUP-TABLE) နဲ့ [ဇယား 9.98](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-RECOVERY-INFO-TABLE) ကို ကြည့်ပါ)။ Standby ထဲက နောက်ဆုံး WAL receive location ကို — `ps` command သုံးပြီး ပြသထားတဲ့ — WAL receiver process ရဲ့ process status ထဲမှာလည်း ဖော်ပြပါတယ် (အသေးစိတ်အတွက် [အပိုင်း 27.1](https://www.postgresql.org/docs/current/monitoring-ps.html) ကို ကြည့်ပါ)။

WAL sender processes တွေရဲ့ စာရင်းကို [`pg_stat_replication`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW) view ကနေ ရယူနိုင်ပါတယ်။ `pg_current_wal_lsn` နဲ့ view ရဲ့ `sent_lsn` field အကြား ခြားနားချက် ကြီးနေရင် — primary server က ဝန်အား ကြီးမားမှုအောက်မှာ ရှိနေတာကို ညွှန်ပြနိုင်ပြီး — `sent_lsn` နဲ့ standby ပေါ်က `pg_last_wal_receive_lsn` အကြား ခြားနားချက်ကတော့ — network နှောင့်နှေးမှု ဒါမှမဟုတ် standby က ဝန်အား ကြီးမားမှုအောက်မှာ ရှိနေတာကို ညွှန်ပြနိုင်ပါတယ်။

Hot standby တစ်ခုပေါ်မှာ — WAL receiver process ရဲ့ status ကို [`pg_stat_wal_receiver`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW) view ကနေ ရယူနိုင်ပါတယ်။ `pg_last_wal_replay_lsn` နဲ့ view ရဲ့ `flushed_lsn` အကြား ခြားနားချက် ကြီးနေတာက — WAL ကို replay လုပ်နိုင်တာထက် ပိုမြန်မြန် လက်ခံရရှိနေတာကို ညွှန်ပြပါတယ်။

### 26.2.6. Replication Slots (replication slots — replication slot များ)

Replication slots တွေက — WAL segments တွေကို standby အားလုံးက လက်ခံရရှိသည်အထိ primary server က မဖယ်ရှားစေဖို့နဲ့ — standby က ချိတ်ဆက်မှု ပြတ်တောက်နေချိန်မှာတောင် — [recovery conflict](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-CONFLICT) (recovery ကွဲလွဲမှု) တစ်ခု ဖြစ်စေနိုင်တဲ့ rows တွေကို primary က မဖယ်ရှားစေဖို့ — အလိုအလျောက် သေချာစေမယ့် နည်းလမ်းတစ်ခုကို ပေးပါတယ်။

Replication slots တွေကို မသုံးဘဲ — [wal_keep_size](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-KEEP-SIZE) ကို သုံးပြီး ဒါမှမဟုတ် — [archive_command](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-ARCHIVE-COMMAND) ဒါမှမဟုတ် [archive_library](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-ARCHIVE-LIBRARY) ကို သုံးပြီး segments တွေကို archive တစ်ခုထဲမှာ သိမ်းဆည်းခြင်းအားဖြင့် — WAL segments အဟောင်းတွေ ဖယ်ရှားခံရတာကို တားဆီးနိုင်ပါတယ်။ ဒီနည်းလမ်းတွေရဲ့ အားနည်းချက်ကတော့ — မကြာခဏဆိုသလို လိုအပ်တာထက် WAL segments တွေ ပိုများများ ထိန်းသိမ်းထားရတာ ဖြစ်ပြီး — replication slots တွေကတော့ လိုအပ်တယ်လို့ သိရတဲ့ segments အရေအတွက်ကိုပဲ ထိန်းသိမ်းပါတယ်။

အလားတူပဲ — replication slot တစ်ခုကိုပါ တွဲဖက် မသုံးဘဲ — [hot_standby_feedback](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-HOT-STANDBY-FEEDBACK) ကို တစ်ခုတည်း သုံးတာက — သက်ဆိုင်တဲ့ rows တွေကို vacuum (အမှိုက် ရှင်းလင်းခြင်း) က ဖယ်ရှားတာကနေ ကာကွယ်ပေးပေမယ့် — standby က ချိတ်ဆက်မထားတဲ့ အချိန် ကာလ အတွင်းမှာတော့ ဘာ ကာကွယ်မှုမှ မပေးပါဘူး။

> **သတိပေးချက်:** Replication slots တွေက server ကို — `pg_wal` အတွက် ခွဲဝေထားတဲ့ နေရာ အပြည့် ဖြစ်သွားလောက်အောင် — WAL segments တွေ အများအပြား ထိန်းသိမ်းထားစေနိုင်တာ သတိထားပါ။ [max_slot_wal_keep_size](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-SLOT-WAL-KEEP-SIZE) ကို replication slots တွေက ထိန်းသိမ်းထားတဲ့ WAL ဖိုင်တွေရဲ့ အရွယ်အစားကို ကန့်သတ်ဖို့ သုံးနိုင်ပါတယ်။

#### 26.2.6.1. Querying and Manipulating Replication Slots (replication slots များကို စုံစမ်းခြင်းနှင့် ကိုင်တွယ် ပြောင်းလဲခြင်း)

Replication slot တစ်ခုစီမှာ နာမည် တစ်ခု ရှိပြီး — အဲဒီနာမည်ထဲမှာ lower-case (စာလုံးအသေး) letters တွေ၊ ဂဏန်းတွေ နဲ့ underscore character (အောက်မျဉ်း စာလုံး) တွေ ပါဝင်နိုင်ပါတယ်။

ရှိပြီးသား replication slots တွေနဲ့ ၎င်းတို့ရဲ့ အခြေအနေကို [`pg_replication_slots`](https://www.postgresql.org/docs/current/view-pg-replication-slots.html) view ထဲမှာ မြင်နိုင်ပါတယ်။

Slots တွေကို — streaming replication protocol (streaming replication ပရိုတိုကော) ကနေတစ်ဆင့် ([အပိုင်း 54.4](https://www.postgresql.org/docs/current/protocol-replication.html) ကို ကြည့်ပါ) ဒါမှမဟုတ် — SQL functions တွေကနေတစ်ဆင့် ([အပိုင်း 9.28.6](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-REPLICATION) ကို ကြည့်ပါ) — ဖန်တီးလို့ ရသလို ဖျက်ပစ်လို့လည်း ရပါတယ်။

#### 26.2.6.2. Configuration Example (configuration ဥပမာ)

Replication slot တစ်ခုကို ဒီလို ဖန်တီးနိုင်ပါတယ်:

```
postgres=# SELECT * FROM pg_create_physical_replication_slot('node_a_slot');
  slot_name  | lsn
-------------+-----
 node_a_slot |

postgres=# SELECT slot_name, slot_type, active FROM pg_replication_slots;
  slot_name  | slot_type | active
-------------+-----------+--------
 node_a_slot | physical  | f
(1 row)
```

ဒီ slot ကို သုံးဖို့ standby ကို configure လုပ်ဖို့ဆိုရင် — `primary_slot_name` ကို standby ပေါ်မှာ configure လုပ်သင့်ပါတယ်။ ရိုးရှင်းတဲ့ ဥပမာ တစ်ခုကတော့:

```sql
primary_conninfo = 'host=192.168.1.50 port=5432 user=foo password=foopass'
primary_slot_name = 'node_a_slot'
```

### 26.2.7. Cascading Replication (cascading replication — အဆင့်ဆင့် ဆင့်ပွား replication)

Cascading replication feature က — standby server တစ်ခုကို — relay (ပြန်လွှင့် ပေးသူ) တစ်ခုအနေနဲ့ ဆောင်ရွက်ပြီး — replication connections တွေကို လက်ခံကာ — WAL records တွေကို အခြား standbys တွေဆီ stream လုပ်ခွင့် ပြုပါတယ်။ ဒါကို primary ဆီ တိုက်ရိုက် connection အရေအတွက်ကို လျှော့ချဖို့ရော — site များအကြား bandwidth ဝန်ပိုး (overhead) တွေကို အနည်းဆုံး ဖြစ်စေဖို့ပါ သုံးနိုင်ပါတယ်။

Receiver (လက်ခံသူ) ရော sender (ပို့လွှတ်သူ) ရော နှစ်မျိုးလုံးအနေနဲ့ ဆောင်ရွက်တဲ့ standby တစ်ခုကို cascading standby လို့ သိကြပါတယ်။ Primary ဆီ ပိုမို တိုက်ရိုက် ချိတ်ဆက်ထားတဲ့ standbys တွေကို upstream servers (အထက်ဆင့် server များ) လို့ ခေါ်ပြီး — ပိုဝေးကွာတဲ့ standby server တွေကတော့ downstream servers (အောက်ဆင့် server များ) တွေ ဖြစ်ပါတယ်။ Cascading replication က downstream servers တွေရဲ့ အရေအတွက် ဒါမှမဟုတ် စီစဉ်ပုံအပေါ် ကန့်သတ်ချက် တစ်ခုမှ မထားပေမယ့် — standby တစ်ခုစီက upstream server တစ်ခုတည်းဆီပဲ connect လုပ်ပြီး — အဲဒီ upstream server က နောက်ဆုံးမှာ primary server တစ်ခုတည်းဆီ ချိတ်ဆက်သွားပါတယ်။

Cascading standby တစ်ခုက primary ကနေ လက်ခံရရှိတဲ့ WAL records တွေကိုသာမက — archive ကနေ restore လုပ်ထားတဲ့ WAL records တွေကိုပါ ပို့လွှတ်ပါတယ်။ ဒါကြောင့် — upstream connection တစ်ချို့ထဲက replication connection ကို အဆုံးသတ်လိုက်ရင်တောင် — WAL records အသစ်တွေ ရနိုင်သရွေ့ — streaming replication က downstream ဆီ ဆက်လက် ဖြစ်ပေါ်နေပါတယ်။

Cascading replication က လက်ရှိမှာ asynchronous ဖြစ်ပါတယ်။ Synchronous replication ([အပိုင်း 26.2.8](https://www.postgresql.org/docs/current/warm-standby.html#SYNCHRONOUS-REPLICATION) ကို ကြည့်ပါ) ရဲ့ settings တွေက လက်ရှိ အချိန်မှာ cascading replication အပေါ် သက်ရောက်မှု မရှိပါဘူး။

Hot standby feedback (hot standby တုံ့ပြန် အချက်ပြမှု) က — cascaded စီစဉ်မှု ဘယ်လိုပဲ ရှိရှိ — upstream ဆီ ပျံ့နှံ့ (propagate) သွားပါတယ်။

Upstream standby server တစ်ခုကို primary အသစ် ဖြစ်လာဖို့ promote လုပ်ခဲ့ရင် — `recovery_target_timeline` ကို `'latest'` (default) အဖြစ် သတ်မှတ်ထားရင် — downstream servers တွေက primary အသစ်ကနေ ဆက်လက် stream လုပ်ပါလိမ့်မယ်။

Cascading replication ကို သုံးဖို့ဆိုရင် — cascading standby က replication connections တွေကို လက်ခံနိုင်အောင် ပြင်ဆင် သတ်မှတ်ပါ (ဆိုလိုတာက — [max_wal_senders](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS) နဲ့ [hot_standby](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-HOT-STANDBY) တို့ကို သတ်မှတ်ပြီး — [host-based authentication](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html) (host အခြေပြု authentication) ကို configure လုပ်ပါ)။ ပြီးတော့ — downstream standby ထဲမှာ `primary_conninfo` ကို cascading standby ဆီ ညွှန်ပြအောင် သတ်မှတ်ဖို့လည်း လိုအပ်ပါလိမ့်မယ်။

### 26.2.8. Synchronous Replication (synchronous replication — တစ်ပြိုင်နက် ထပ်တူပြု replication)

PostgreSQL streaming replication က default အနေနဲ့ asynchronous ဖြစ်ပါတယ်။ Primary server က crash (ပျက်ကျ) သွားခဲ့ရင် — commit လုပ်ပြီးသား transactions တချို့က standby server ဆီ replicate (ပုံတူပွား) လုပ်မထားရသေးတာ ဖြစ်နိုင်ပြီး — data ဆုံးရှုံးမှု ဖြစ်စေနိုင်ပါတယ်။ Data ဆုံးရှုံးမှု ပမာဏက failover ဖြစ်ချိန်မှာ ရှိနေတဲ့ replication နှောင့်နှေးမှုနဲ့ အချိုးကျ ဆက်စပ်နေပါတယ်။

Synchronous replication က — transaction တစ်ခုက လုပ်ဆောင်တဲ့ ပြောင်းလဲမှုတွေ အားလုံးကို synchronous standby server တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ဆီ လွှဲပြောင်းပြီးကြောင်း အတည်ပြုနိုင်စွမ်းကို ပေးပါတယ်။ ဒါက transaction commit တစ်ခုက ပေးတဲ့ ပုံမှန် durability (ဒေတာ တည်မြဲမှု) အဆင့်ကို တိုးချဲ့ပေးပါတယ်။ ဒီ အကာအကွယ် အဆင့်ကို ကွန်ပျူတာ သိပ္ပံ သီအိုရီထဲမှာ 2-safe replication လို့ ရည်ညွှန်းပြီး — `synchronous_commit` ကို `remote_write` အဖြစ် သတ်မှတ်ထားတဲ့အခါ — group-1-safe (group-safe နဲ့ 1-safe) လို့ ရည်ညွှန်းပါတယ်။

Synchronous replication ကို တောင်းဆိုတဲ့အခါ — write transaction တစ်ခုရဲ့ commit တစ်ခုစီက — commit ကို primary ရော standby server ရဲ့ပါ disk ပေါ်က write-ahead log ထဲမှာ ရေးသားပြီးကြောင်း အတည်ပြုချက် (confirmation) လက်ခံရရှိသည်အထိ စောင့်ဆိုင်းပါလိမ့်မယ်။ Data ဆုံးရှုံးနိုင်တဲ့ တစ်ခုတည်းသော ဖြစ်နိုင်ခြေကတော့ — primary ရော standby ပါ တစ်ပြိုင်နက် crash ဖြစ်သွားတာပဲ ဖြစ်ပါတယ်။ ဒါက — sysadmin (system စီမံခန့်ခွဲသူ) က server နှစ်ခုရဲ့ နေရာချထားမှုနဲ့ စီမံခန့်ခွဲမှုကို သတိထား ဆောင်ရွက်မယ်ဆိုရင် — ပိုမို မြင့်မားတဲ့ durability အဆင့်ကို ပေးစွမ်းနိုင်ပါတယ်။ အတည်ပြုချက်ကို စောင့်ဆိုင်းတာက — server crashes တွေ ဖြစ်တဲ့ အခါမျိုးမှာ ပြောင်းလဲမှုတွေ မဆုံးရှုံးနိုင်ဘူးဆိုတဲ့ user ရဲ့ ယုံကြည်စိတ်ကို တိုးစေပေမယ့် — တောင်းဆိုနေတဲ့ transaction ရဲ့ response time (တုံ့ပြန် ချိန်) ကိုလည်း မလွဲမသွေ တိုးစေပါတယ်။ အနည်းဆုံး စောင့်ဆိုင်းချိန်ကတော့ primary နဲ့ standby အကြား round-trip time (သွား-ပြန် အချိန်) ပဲ ဖြစ်ပါတယ်။

Read-only transactions တွေနဲ့ transaction rollbacks (transaction ပြန်ရုပ်သိမ်းမှုများ) တွေက standby servers တွေဆီက ပြန်ကြားချက်တွေကို စောင့်ဆိုင်းစရာ မလိုပါဘူး။ Subtransaction commits (အတွင်းအဆင့် transaction commit များ) တွေက standby servers တွေဆီက တုံ့ပြန်မှုတွေကို မစောင့်ပါဘူး — top-level commits (ထိပ်တန်း အဆင့် commit များ) ကသာ စောင့်ပါတယ်။ Data loading (ဒေတာ တင်ခြင်း) ဒါမှမဟုတ် index building (index တည်ဆောက်ခြင်း) လို ကြာမြင့်တဲ့ လုပ်ဆောင်မှုတွေက နောက်ဆုံး commit message အထိတော့ မစောင့်ပါဘူး။ Two-phase commit လုပ်ဆောင်မှု အားလုံးက commit waits လိုအပ်ပြီး — prepare ရော commit ရော နှစ်ခုလုံး ပါဝင်ပါတယ်။

Synchronous standby တစ်ခုက physical replication standby (ရုပ်ပိုင်း replication standby) တစ်ခု ဒါမှမဟုတ် logical replication subscriber (ယုတ္တိ replication စာရင်းသွင်းသူ) တစ်ခု ဖြစ်နိုင်ပါတယ်။ သင့်လျော်တဲ့ feedback messages (တုံ့ပြန် အချက်ပြ message များ) ပို့နည်းကို သိထားတဲ့ — အခြား physical ဒါမှမဟုတ် logical WAL replication stream consumer (WAL replication stream ကို စားသုံးသူ) ဘယ်ခုမဆိုလည်း ဖြစ်နိုင်ပါတယ်။ Built-in (ထည့်သွင်းပြီးသား) physical နဲ့ logical replication systems တွေအပြင် — ဒီထဲမှာ `pg_receivewal` နဲ့ `pg_recvlogical` လို အထူး programs တွေရော — third-party replication systems (ပြင်ပ replication systems) နဲ့ custom programs (ကိုယ်ပိုင် စိတ်ကြိုက် programs) တချို့ပါ ပါဝင်ပါတယ်။ Synchronous replication support အသေးစိတ်အတွက် သက်ဆိုင်ရာ documentation တွေကို စစ်ဆေးကြည့်ပါ။

#### 26.2.8.1. Basic Configuration (အခြေခံ configuration)

Streaming replication ကို configure လုပ်ပြီးတာနဲ့ — synchronous replication ကို configure လုပ်ဖို့အတွက် ထပ်ဆောင်း configuration အဆင့် တစ်ခုပဲ လိုပါတယ်: [synchronous_standby_names](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-SYNCHRONOUS-STANDBY-NAMES) ကို ဗလာ မဟုတ်တဲ့ (non-empty) တန်ဖိုး တစ်ခုအဖြစ် သတ်မှတ်ရပါမယ်။ `synchronous_commit` ကိုလည်း `on` အဖြစ် သတ်မှတ်ရပါမယ် — ဒါပေမယ့် — ဒါက default တန်ဖိုး ဖြစ်တာမို့ — ပုံမှန်အားဖြင့် ဘာမှ ပြောင်းလဲစရာ မလိုပါဘူး။ ([အပိုင်း 19.5.1](https://www.postgresql.org/docs/current/runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS) နဲ့ [အပိုင်း 19.6.2](https://www.postgresql.org/docs/current/runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-PRIMARY) ကို ကြည့်ပါ။) ဒီ configuration က commit တစ်ခုစီကို — standby က commit record ကို durable storage (တည်မြဲ သိုလှောင်မှု) ထဲ ရေးသားပြီးကြောင်း အတည်ပြုချက်အတွက် စောင့်ဆိုင်းစေမှာ ဖြစ်ပါတယ်။ `synchronous_commit` ကို user တစ်ဦးချင်းစီက သတ်မှတ်နိုင်တာမို့ — durability အာမခံချက်ကို transaction တစ်ခုချင်းစီ အလိုက် ထိန်းချုပ်နိုင်ဖို့ — configuration ဖိုင်ထဲမှာ ဖြစ်စေ — သီးခြား users ဒါမှမဟုတ် databases တွေအတွက် ဖြစ်စေ — applications တွေက dynamically (ပြောင်းလဲနေသော အခြေအနေအလိုက်) ဖြစ်စေ — configure လုပ်နိုင်ပါတယ်။

Primary ပေါ်မှာ commit record တစ်ခု disk ပေါ် ရေးသားပြီးတာနဲ့ — WAL record ကို standby ဆီ ပို့လွှတ်ပါတယ်။ Standby က — standby ပေါ်မှာ `wal_receiver_status_interval` ကို zero အဖြစ် သတ်မှတ်မထားရင် — WAL data အစုအသစ် (batch) တစ်ခုစီ disk ပေါ် ရေးသားတိုင်း reply messages (ပြန်ကြားချက် message များ) ပို့လွှတ်ပါတယ်။ `synchronous_commit` ကို `remote_apply` အဖြစ် သတ်မှတ်ထားတဲ့ အခြေအနေမှာ — standby က commit record ကို replay လုပ်ပြီး — transaction ကို မြင်နိုင်ဖြစ်စေတဲ့အခါ reply messages ပို့ပါတယ်။ Primary ပေါ်က `synchronous_standby_names` ရဲ့ သတ်မှတ်ချက်အရ — standby တစ်ခုကို synchronous standby အဖြစ် ရွေးချယ်ခံရရင် — အဲဒီ standby ဆီက reply messages တွေကို — commit record လက်ခံရရှိကြောင်း အတည်ပြုချက်ကို စောင့်ဆိုင်းနေတဲ့ transactions တွေကို ဘယ်အချိန် လွှတ်ပေးရမလဲ ဆုံးဖြတ်ဖို့ — အခြား synchronous standbys တွေဆီက reply messages တွေနဲ့အတူ ထည့်သွင်း စဉ်းစားပါလိမ့်မယ်။ ဒီ parameters တွေက — ဘယ် standby server တွေက synchronous standbys တွေ ဖြစ်သင့်လဲဆိုတာကို administrator (စီမံခန့်ခွဲသူ) က သတ်မှတ်နိုင်စေပါတယ်။ Synchronous replication ရဲ့ configuration က အဓိကအားဖြင့် primary ပေါ်မှာပဲ ဖြစ်တာ သတိပြုပါ။ နာမည် သတ်မှတ်ထားတဲ့ (named) standbys တွေက primary ဆီ တိုက်ရိုက် ချိတ်ဆက်ထားရပါမယ်; cascaded replication သုံးနေတဲ့ downstream standby servers တွေအကြောင်းကို primary က ဘာမှ မသိပါဘူး။

`synchronous_commit` ကို `remote_write` အဖြစ် သတ်မှတ်တာက — commit တစ်ခုစီကို — standby က commit record ကို လက်ခံရရှိပြီး သူ့ရဲ့ operating system ဆီ ရေးထုတ်ပြီးကြောင်း — ဒါပေမယ့် standby ပေါ်မှာ data ကို disk ပေါ် flush (သွင်းချ) လုပ်ပြီးတဲ့အထိတော့ မဟုတ်ဘဲ — အတည်ပြုချက်အတွက် စောင့်ဆိုင်းစေပါလိမ့်မယ်။ ဒီ setting က `on` ထက် အားနည်းတဲ့ durability အာမခံချက် တစ်ခုကို ပေးပါတယ်: operating system crash တစ်ခု ဖြစ်ရင် standby က data ဆုံးရှုံးနိုင်ပေမယ့် — PostgreSQL crash တစ်ခုကြောင့်တော့ မဆုံးရှုံးပါဘူး။ ဒါပေမယ့် — လက်တွေ့မှာ ဒါက အသုံးဝင်တဲ့ setting တစ်ခုပါ — အကြောင်းကတော့ transaction ရဲ့ response time ကို လျှော့ချပေးနိုင်လို့ပါ။ Data ဆုံးရှုံးမှု ဖြစ်နိုင်တာက — primary ရော standby ရော နှစ်ခုလုံး crash ဖြစ်ပြီး — primary ရဲ့ database ပါ တစ်ပြိုင်နက် corrupt (ပျက်စီး) သွားမှသာ ဖြစ်နိုင်ပါတယ်။

`synchronous_commit` ကို `remote_apply` အဖြစ် သတ်မှတ်တာက — commit တစ်ခုစီကို — လက်ရှိ synchronous standbys တွေက — transaction ကို replay လုပ်ပြီး — user queries တွေအတွက် မြင်နိုင်ဖြစ်အောင် လုပ်ပြီးကြောင်း သတင်းပို့တဲ့အထိ စောင့်ဆိုင်းစေပါလိမ့်မယ်။ ရိုးရှင်းတဲ့ အခြေအနေတွေမှာ — ဒါက causal consistency (အကြောင်းတရား ကိုက်ညီမှု) နဲ့အတူ load balancing (ဝန်အား ခွဲဝေခြင်း) ကို ခွင့်ပြုပါတယ်။

Fast shutdown (လျင်မြန်စွာ ပိတ်သိမ်းခြင်း) တစ်ခုကို တောင်းဆိုရင် — users တွေ စောင့်ဆိုင်းတာ ရပ်သွားပါလိမ့်မယ်။ ဒါပေမယ့် — asynchronous replication သုံးတုန်းကလိုပဲ — ကျန်ရှိနေသေးတဲ့ (outstanding) WAL records တွေ အားလုံးကို လက်ရှိ ချိတ်ဆက်ထားတဲ့ standby servers တွေဆီ လွှဲပြောင်းပြီးသည်အထိ — server က အပြည့်အဝ shutdown ဖြစ်မှာ မဟုတ်ပါဘူး။

#### 26.2.8.2. Multiple Synchronous Standbys (synchronous standby အများအပြား)

Synchronous replication က synchronous standby server တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတာကို ထောက်ပံ့ပါတယ်; transactions တွေက — synchronous အဖြစ် မှတ်ယူထားတဲ့ standby server တွေ အားလုံးက သူတို့ရဲ့ data လက်ခံရရှိကြောင်း confirm (အတည်ပြု) လုပ်သည်အထိ စောင့်ဆိုင်းပါလိမ့်မယ်။ Transactions တွေ ပြန်ကြားချက် စောင့်ဆိုင်းရမယ့် synchronous standbys အရေအတွက်ကို `synchronous_standby_names` ထဲမှာ သတ်မှတ်ပါတယ်။ ဒီ parameter က standby names တွေရဲ့ စာရင်းတစ်ခုနဲ့ — စာရင်းထဲကနေ synchronous standbys တွေကို ရွေးချယ်ဖို့ နည်းလမ်း (`FIRST` နဲ့ `ANY`) ကိုလည်း သတ်မှတ်ပေးပါတယ်။

`FIRST` နည်းလမ်းက priority-based (ဦးစားပေးမှု အခြေပြု) synchronous replication တစ်ခုကို သတ်မှတ်ပြီး — transaction commits တွေကို — သူတို့ရဲ့ WAL records တွေကို ဦးစားပေးမှုတွေအပေါ် အခြေခံပြီး ရွေးချယ်ထားတဲ့ synchronous standbys အရေအတွက် လိုအပ်သလောက်ဆီ replicate လုပ်ပြီးသည်အထိ စောင့်ဆိုင်းစေပါတယ်။ စာရင်းထဲမှာ စောစော ပေါ်နေတဲ့ နာမည်တွေ ရှိတဲ့ standbys တွေကို ဦးစားပေးမှု ပိုမြင့်ပေးပြီး — synchronous အဖြစ် မှတ်ယူပါတယ်။ စာရင်းထဲမှာ နောက်ပိုင်း ပေါ်နေတဲ့ အခြား standby servers တွေကတော့ — အလားအလာ ရှိတဲ့ (potential) synchronous standbys တွေကို ကိုယ်စားပြုပါတယ်။ လက်ရှိ synchronous standbys တွေထဲက တစ်ခုခုက ဘယ်အကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် ချိတ်ဆက်မှု ပြတ်တောက်သွားခဲ့ရင် — နောက် ဦးစားပေးမှု အမြင့်ဆုံး standby နဲ့ ချက်ချင်း အစားထိုးလိုက်ပါလိမ့်မယ်။

Priority-based (ဦးစားပေးမှု အခြေပြု) synchronous standbys အများအပြားအတွက် `synchronous_standby_names` ရဲ့ ဥပမာ တစ်ခုကတော့:

```sql
synchronous_standby_names = 'FIRST 2 (s1, s2, s3)'
```

ဒီဥပမာမှာ — standby server လေးခု `s1`, `s2`, `s3` နဲ့ `s4` run နေတယ်ဆိုရင် — `s1` နဲ့ `s2` ဆိုတဲ့ standby နှစ်ခုကို synchronous standbys အဖြစ် ရွေးချယ်မှာ ဖြစ်ပါတယ် — အကြောင်းကတော့ သူတို့ရဲ့ နာမည်တွေက standby names စာရင်းထဲမှာ စောစော ပေါ်နေလို့ပါ။ `s3` က potential synchronous standby တစ်ခု ဖြစ်ပြီး — `s1` ဒါမှမဟုတ် `s2` ထဲက တစ်ခုခု ကျရှုံးသွားရင် — synchronous standby ရဲ့ အခန်းကဏ္ဍကို လွှဲပြောင်း တာဝန်ယူပါလိမ့်မယ်။ `s4` ကတော့ asynchronous standby တစ်ခု ဖြစ်ပါတယ် — သူ့ရဲ့ နာမည်က စာရင်းထဲမှာ မပါလို့ပါ။

`ANY` နည်းလမ်းက quorum-based (quorum — အနည်းဆုံး လိုအပ်သော အရေအတွက် — အခြေပြု) synchronous replication တစ်ခုကို သတ်မှတ်ပြီး — transaction commits တွေကို — သူတို့ရဲ့ WAL records တွေကို စာရင်းထဲက synchronous standbys လိုအပ်တဲ့ အရေအတွက် အနည်းဆုံးဆီ replicate လုပ်ပြီးသည်အထိ စောင့်ဆိုင်းစေပါတယ်။

Quorum-based (quorum အခြေပြု) synchronous standbys အများအပြားအတွက် `synchronous_standby_names` ရဲ့ ဥပမာ တစ်ခုကတော့:

```sql
synchronous_standby_names = 'ANY 2 (s1, s2, s3)'
```

ဒီဥပမာမှာ — standby server လေးခု `s1`, `s2`, `s3` နဲ့ `s4` run နေတယ်ဆိုရင် — transaction commits တွေက `s1`, `s2` နဲ့ `s3` ထဲက အနည်းဆုံး standby နှစ်ခုထံမှ ပြန်ကြားချက်တွေကို စောင့်ဆိုင်းပါလိမ့်မယ်။ `s4` ကတော့ asynchronous standby တစ်ခု ဖြစ်ပါတယ် — သူ့ရဲ့ နာမည်က စာရင်းထဲမှာ မပါလို့ပါ။

Standby servers တွေရဲ့ synchronous states တွေကို `pg_stat_replication` view ကို သုံးပြီး ကြည့်ရှုနိုင်ပါတယ်။

#### 26.2.8.3. Planning for Performance (စွမ်းဆောင်ရည် အတွက် ကြိုတင် စီစဉ်ခြင်း)

Synchronous replication က ပုံမှန်အားဖြင့် — applications တွေ လက်ခံနိုင်လောက်တဲ့ စွမ်းဆောင်ရည်နဲ့ လည်ပတ်ဖို့ — ဂရုတစိုက် စီစဉ်ပြီး နေရာချထားထားတဲ့ standby servers တွေ လိုအပ်ပါတယ်။ စောင့်ဆိုင်းတာက system resources (system အရင်းအမြစ်များ) တွေကို အသုံးမပြုပေမယ့် — လွှဲပြောင်းမှု အတည်ပြုချက် မပြီးမချင်း — transaction locks (transaction သော့ခတ်မှုများ) တွေကို ဆက်လက် ချုပ်ကိုင်ထားပါတယ်။ ရလဒ်အနေနဲ့ — synchronous replication ကို မဆင်မခြင် သုံးတာက — response times တွေ တိုးလာပြီး contention (ပြိုင်ဆိုင်မှု) မြင့်မားလာလို့ — database applications တွေရဲ့ စွမ်းဆောင်ရည်ကို ကျဆင်းစေပါလိမ့်မယ်။

PostgreSQL က application developer တွေကို replication ကနေတစ်ဆင့် လိုအပ်တဲ့ durability level ကို သတ်မှတ်နိုင်စေပါတယ်။ ဒါကို system တစ်ခုလုံးအတွက် သတ်မှတ်နိုင်ပေမယ့် — တိကျတဲ့ users ဒါမှမဟုတ် connections တွေအတွက် ဒါမှမဟုတ် — transaction တစ်ခုချင်းစီအတွက်တောင် သတ်မှတ်နိုင်ပါတယ်။

ဥပမာ — application workload (application ဝန်အား) တစ်ခုမှာ ပြောင်းလဲမှုရဲ့ 10% က အရေးကြီးတဲ့ customer အချက်အလက်တွေ ဖြစ်ပြီး — 90% ကတော့ — users တွေကြားက chat messages (စကားပြော message များ) လို — ဆုံးရှုံးသွားရင်တောင် လုပ်ငန်းက ပိုလွယ်လွယ်ကူကူ ရှင်သန်နိုင်တဲ့ — အရေးပါမှု နည်းတဲ့ data တွေ ဖြစ်နိုင်ပါတယ်။

Application level (application အဆင့် — primary ပေါ်မှာ) မှာ synchronous replication options တွေကို သတ်မှတ်ထားခြင်းဖြင့် — စုစုပေါင်း workload ရဲ့ အများစုကို နှေးကွေးစေစရာ မလိုဘဲ — အရေးအကြီးဆုံး ပြောင်းလဲမှုတွေအတွက် synchronous replication ကို ပေးစွမ်းနိုင်ပါတယ်။ Application level options တွေက — high performance applications တွေအတွက် synchronous replication ရဲ့ အကျိုးကျေးဇူးတွေကို ရရှိစေဖို့ — အရေးကြီးပြီး လက်တွေ့ကျတဲ့ ကိရိယာ တစ်ခု ဖြစ်ပါတယ်။

Network bandwidth က WAL data ထုတ်လုပ်မှု နှုန်းထက် မြင့်မားရမယ်ဆိုတာကိုလည်း ထည့်သွင်း စဉ်းစားသင့်ပါတယ်။

#### 26.2.8.4. Planning for High Availability (high availability အတွက် ကြိုတင် စီစဉ်ခြင်း)

`synchronous_standby_names` က — `synchronous_commit` ကို `on`, `remote_apply` ဒါမှမဟုတ် `remote_write` အဖြစ် သတ်မှတ်ထားတဲ့အခါ ပြုလုပ်တဲ့ transaction commits တွေ ပြန်ကြားချက် စောင့်ဆိုင်းရမယ့် synchronous standbys တွေရဲ့ အရေအတွက်နဲ့ နာမည်တွေကို သတ်မှတ်ပါတယ်။ Synchronous standbys တွေထဲက တစ်ခုခု crash ဖြစ်သွားခဲ့ရင် — အဲဒီလို transaction commits တွေက ဘယ်တော့မှ ပြီးမြောက်ချင်မှ ပြီးမြောက်ပါလိမ့်မယ်။

High availability အတွက် အကောင်းဆုံး ဖြေရှင်းနည်းကတော့ — တောင်းဆိုထားသလောက် synchronous standbys အများအပြားကို ထိန်းသိမ်းထားနိုင်အောင် သေချာစေတာ ဖြစ်ပါတယ်။ `synchronous_standby_names` ကို သုံးပြီး — potential synchronous standbys အများအပြားကို နာမည်ပေး သတ်မှတ်ခြင်းအားဖြင့် ဒါကို ရရှိနိုင်ပါတယ်။

Priority-based synchronous replication တစ်ခုမှာ — စာရင်းထဲမှာ စောစော ပေါ်နေတဲ့ နာမည်တွေ ရှိတဲ့ standbys တွေကို synchronous standbys အဖြစ် သုံးပါလိမ့်မယ်။ ဒါတွေရဲ့ နောက်မှာ စာရင်းပြုထားတဲ့ standbys တွေက — လက်ရှိ တစ်ခုခု ကျရှုံးခဲ့ရင် — synchronous standby ရဲ့ အခန်းကဏ္ဍကို လွှဲပြောင်း တာဝန်ယူပါလိမ့်မယ်။

Quorum-based synchronous replication တစ်ခုမှာ — စာရင်းထဲမှာ ပေါ်နေတဲ့ standbys တွေ အားလုံးကို synchronous standbys အတွက် ကိုယ်စားလှယ်လောင်း (candidates) တွေအဖြစ် သုံးပါလိမ့်မယ်။ သူတို့ထဲက တစ်ခုခု ကျရှုံးသွားရင်တောင် — အခြား standbys တွေက synchronous standby ရဲ့ ကိုယ်စားလှယ်လောင်း အခန်းကဏ္ဍကို ဆက်လက် ထမ်းဆောင်နေပါလိမ့်မယ်။

Standby တစ်ခုက primary ဆီ ပထမဆုံး ချိတ်ဆက်တဲ့အခါ — သူက စနစ်တကျ sync (ထပ်တူကျအောင် ချိန်ကိုက်) လုပ်ပြီးသား မဖြစ်သေးပါဘူး။ ဒါကို `catchup` (လိုက်မှီခြင်း) mode လို့ ဖော်ပြပါတယ်။ Standby နဲ့ primary အကြား lag က ပထမဆုံးအကြိမ် သုည ဖြစ်သွားတာနဲ့ — real-time (တကယ့်အချိန်နှင့်) `streaming` state ဆီ ရွေ့ပြောင်းပါတယ်။ Catch-up ကြာချိန်က — standby ကို ဖန်တီးပြီးပြီးချင်း ကာလမှာ ကြာမြင့်နိုင်ပါတယ်။ Standby ကို ပိတ်ထားခဲ့မယ်ဆိုရင် — standby ပိတ်ထားခဲ့တဲ့ အချိန်ကာလရဲ့ အလျားအလိုက် — catch-up ကာလ ပိုတိုးလာပါလိမ့်မယ်။ Standby က `streaming` state ကို ရောက်ရှိမှသာ synchronous standby တစ်ခု ဖြစ်လာနိုင်ပါတယ်။ ဒီ state ကို `pg_stat_replication` view ကို သုံးပြီး ကြည့်ရှုနိုင်ပါတယ်။

Commits တွေ အတည်ပြုချက် (acknowledgment) ကို စောင့်ဆိုင်းနေချိန်မှာ primary က restart ဖြစ်သွားခဲ့ရင် — primary database က ပြန်လည် ကောင်းမွန်လာတာနဲ့ — စောင့်ဆိုင်းနေတဲ့ transactions တွေကို အပြည့်အဝ commit လုပ်ပြီးသား (fully committed) အဖြစ် မှတ်သားပါလိမ့်မယ်။ Primary ရဲ့ crash ဖြစ်ချိန်မှာ — standbys တွေ အားလုံး ကျန်ရှိနေတဲ့ WAL data အားလုံးကို လက်ခံရရှိထားကြောင်း သေချာစေဖို့ နည်းလမ်း မရှိပါဘူး။ Transaction တချို့က primary ပေါ်မှာ commit လုပ်ပြီးသား ဖြစ်နေပေမယ့် — standby ပေါ်မှာတော့ commit လုပ်ပြီးသား အနေနဲ့ မပြနိုင်ပါဘူး။ ကျွန်ုပ်တို့ ပေးတဲ့ အာမခံချက်ကတော့ — WAL data ကို synchronous standbys တွေ အားလုံးက လုံခြုံစွာ လက်ခံရရှိကြောင်း သိရသည်အထိ — application က transaction တစ်ခုရဲ့ အောင်မြင်တဲ့ commit အတွက် ထင်ရှားတဲ့ အတည်ပြုချက် (explicit acknowledgment) ကို လက်ခံရရှိမှာ မဟုတ်ဘူးဆိုတာပဲ ဖြစ်ပါတယ်။

တောင်းဆိုထားသလောက် synchronous standbys တွေကို တကယ်ပဲ မထိန်းသိမ်းနိုင်ဘူးဆိုရင် — `synchronous_standby_names` ထဲမှာ transaction commits တွေ ပြန်ကြားချက် စောင့်ဆိုင်းရမယ့် synchronous standbys အရေအတွက်ကို လျှော့ချသင့်ပါတယ် (ဒါမှမဟုတ် disable လုပ်ပါ) — ပြီးတော့ primary server ပေါ်မှာ configuration ဖိုင်ကို reload (ပြန်လည် ဖတ်ယူ) လုပ်ပါ။

Primary က ကျန်ရှိနေတဲ့ standby servers တွေကနေ သီးခြား ဖြစ်နေခဲ့ရင် — အဲဒီကျန် standby servers တွေထဲက အကောင်းဆုံး ကိုယ်စားလှယ်လောင်းဆီ fail over (တာဝန် လွှဲပြောင်း) လုပ်သင့်ပါတယ်။

Transactions တွေ စောင့်ဆိုင်းနေချိန်မှာ standby server တစ်ခုကို ပြန်လည် ဖန်တီးဖို့ လိုအပ်ခဲ့ရင် — `pg_backup_start()` နဲ့ `pg_backup_stop()` ဆိုတဲ့ functions တွေကို — `synchronous_commit` = `off` ဖြစ်တဲ့ session တစ်ခုထဲမှာ run လုပ်ကြောင်း သေချာစေပါ — မဟုတ်ရင် အဲဒီ တောင်းဆိုချက်တွေက standby ပေါ်လာဖို့ ထာဝရ စောင့်ဆိုင်းနေရပါလိမ့်မယ်။

### 26.2.9. Continuous Archiving in Standby (standby ပေါ်တွင် စဉ်ဆက်မပြတ် archiving)

Standby တစ်ခုမှာ continuous WAL archiving (စဉ်ဆက်မပြတ် WAL archiving) ကို သုံးတဲ့အခါ — အခြေအနေ နှစ်မျိုး ရှိပါတယ်: WAL archive ကို primary နဲ့ standby အကြား မျှဝေ (share) သုံးနိုင်သလို — standby က သူ့ကိုယ်ပိုင် WAL archive တစ်ခု ရှိနိုင်ပါတယ်။ Standby မှာ သူ့ကိုယ်ပိုင် WAL archive ရှိတဲ့အခါ — `archive_mode` ကို `always` အဖြစ် သတ်မှတ်ပြီး — standby က — archive ကနေ restore လုပ်တာဖြစ်စေ — streaming replication ကနေ ဖြစ်စေ — လက်ခံရရှိတဲ့ WAL segment တိုင်းအတွက် archive command ကို ခေါ်ယူပါလိမ့်မယ်။ Shared archive ကိုလည်း အလားတူ ကိုင်တွယ်နိုင်ပေမယ့် — `archive_command` ဒါမှမဟုတ် `archive_library` က — archive လုပ်နေတဲ့ ဖိုင်က ရှိပြီးသား ဖြစ်မဖြစ် စစ်ဆေးရပြီး — ရှိပြီးသား ဖိုင်က ပါဝင်စရာ တူညီမှု ရှိမရှိလည်း စစ်ဆေးရပါမယ်။ ဒါက `archive_command` ဒါမှမဟုတ် `archive_library` ထဲမှာ ပိုမို ဂရုစိုက်မှု လိုအပ်ပါတယ် — ပါဝင်စရာ မတူညီတဲ့ ရှိပြီးသား ဖိုင်တစ်ခုကို overwrite (အစားထိုး ရေးသား) မလုပ်မိဖို့ ဂရုစိုက်ရပြီး — အတိအကျ တူညီတဲ့ ဖိုင်ကို နှစ်ကြိမ် archive လုပ်မိရင်တော့ success (အောင်မြင်မှု) ပြန်ပေးရပါမယ်။ ပြီးတော့ — server နှစ်ခုက တစ်ချိန်တည်း ဖိုင်တစ်ခုတည်းကို archive လုပ်ဖို့ ကြိုးစားရင် — အဲဒါတွေ အားလုံးကို race conditions (ပြိုင်ဆိုင် အခြေအနေများ) ကင်းရှင်းစွာ လုပ်ဆောင်ရပါမယ်။

`archive_mode` ကို `on` အဖြစ် သတ်မှတ်ထားရင် — archiver (archive လုပ်သူ) က recovery ဒါမှမဟုတ် standby mode အတွင်းမှာ enable (ဖွင့်) မထားပါဘူး။ Standby server ကို promote လုပ်ခဲ့ရင် — promotion ပြီးတဲ့နောက်မှာ archiving ကို စတင်ပါလိမ့်မယ် — ဒါပေမယ့် — သူကိုယ်တိုင် မထုတ်လုပ်ခဲ့တဲ့ WAL ဒါမှမဟုတ် timeline history (timeline သမိုင်း) ဖိုင်တွေကိုတော့ archive လုပ်မှာ မဟုတ်ပါဘူး။ Archive ထဲမှာ WAL ဖိုင်တွေရဲ့ ပြည့်စုံတဲ့ စီးရီး (series) တစ်ခု ရဖို့ဆိုရင် — WAL အားလုံးကို standby ဆီ မရောက်ရှိခင် — archive လုပ်ပြီးသား ဖြစ်အောင် သေချာစေရပါမယ်။ File-based log shipping မှာတော့ ဒါက သဘာဝအရ မှန်ပါတယ် — standby က archive ထဲမှာ တွေ့ရတဲ့ ဖိုင်တွေကိုပဲ restore လုပ်နိုင်လို့ပါ — ဒါပေမယ့် streaming replication enable လုပ်ထားရင်တော့ မမှန်ပါဘူး။ Server တစ်ခုက recovery mode မှာ မရှိတဲ့အခါ — `on` နဲ့ `always` modes တွေကြားမှာ ခြားနားချက် မရှိပါဘူး။
