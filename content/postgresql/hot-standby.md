---
title: "Hot Standby (hot standby mode — recovery/standby mode အတွင်း read-only queries များ run လုပ်နိုင်မှု)"
description: "Hot standby mode — archive recovery/standby mode အတွင်း server ဆီ connect လုပ်ပြီး read-only queries များ run လုပ်နိုင်မှု — အကြောင်း ရှင်းလင်းချက်: user များအတွက် ခြုံငုံ သုံးသပ်ချက် (read-only connections များ, ခွင့်ပြုထားသော/တားမြစ်ထားသော commands စာရင်းများ), query conflicts များ ကိုင်တွယ်ခြင်း (WAL replay နှင့် ထိပ်တိုက်မှုများ, conflict ဖြစ်သော queries များကို cancel လုပ်ခြင်း, max_standby_archive_delay/max_standby_streaming_delay, hot_standby_feedback, pg_stat_database_conflicts view), administrator များအတွက် ခြုံငုံ သုံးသပ်ချက် (hot standby ဖွင့်သတ်မှတ်ပုံ, startup log messages များ, shared memory သက်ဆိုင်သော parameter များ, recovery mode အတွင်း လက်မခံသော administration commands များ), hot standby parameter ရည်ညွှန်း စာရင်း (primary/standby ပေါ်တွင် သုံးနိုင်သော parameters) နှင့် caveats (ကန့်သတ်ချက်များ) အကြောင်း အသေးစိတ်"
order: 192
source: "https://www.postgresql.org/docs/current/hot-standby.html"
status: translated
updated: 2026-09-06
---

## 26.4. Hot Standby (hot standby mode — recovery/standby mode အတွင်း read-only queries များ run လုပ်နိုင်မှု)

- **26.4.1. User's Overview (User များအတွက် ခြုံငုံ သုံးသပ်ချက်)**
- **26.4.2. Handling Query Conflicts (Query conflicts များကို ကိုင်တွယ် ဖြေရှင်းခြင်း)**
- **26.4.3. Administrator's Overview (Administrator များအတွက် ခြုံငုံ သုံးသပ်ချက်)**
- **26.4.4. Hot Standby Parameter Reference (Hot Standby parameter ရည်ညွှန်း စာရင်း)**
- **26.4.5. Caveats (သတိပြုရန် အချက်များ)**

Hot standby ဆိုတဲ့ အသုံးအနှုန်းက — server က archive recovery (archive မှ ပြန်လည် ထူထောင်ခြင်း) ဒါမှမဟုတ် standby mode (အရန် mode) ထဲမှာ ရှိနေတဲ့ အချိန်မှာ — server ဆီ connect လုပ်ပြီး read-only (ဖတ်ရုံသက်သက်) queries တွေကို run လုပ်နိုင်တဲ့ စွမ်းရည်ကို ဖော်ပြဖို့ သုံးတဲ့ အသုံးအနှုန်း ဖြစ်ပါတယ်။ ဒါက replication (ပုံတူပွား ကူးယူမှု) ရည်ရွယ်ချက်တွေအတွက်ရော — backup တစ်ခုကို လိုချင်တဲ့ state (အခြေအနေ) တစ်ခုဆီ အလွန် တိကျစွာ ပြန်လည် ထူထောင်ဖို့အတွက်ပါ အသုံးဝင်ပါတယ်။ Hot standby ဆိုတဲ့ အသုံးအနှုန်းက — users တွေ queries တွေ run လုပ်နေတဲ့/သူတို့ရဲ့ connections တွေကို ဖွင့်ထားဆဲ ဖြစ်တဲ့ — အချိန်အတောအတွင်းမှာ server က recovery ကနေတစ်ဆင့် ပုံမှန် လည်ပတ်မှုဆီ ကူးပြောင်းနိုင်တဲ့ စွမ်းရည်ကိုလည်း ရည်ညွှန်းပါတယ်။

Hot standby mode ထဲမှာ queries တွေ run လုပ်တာက သာမန် query လုပ်ဆောင်မှုနဲ့ ဆင်တူပါတယ် — ဒါပေမယ့် အောက်မှာ ရှင်းပြထားတဲ့ အသုံးပြုမှုနဲ့ စီမံခန့်ခွဲမှုဆိုင်ရာ (administrative) ကွာခြားချက် အတော်များများ ရှိပါတယ်။

### 26.4.1. User's Overview (User များအတွက် ခြုံငုံ သုံးသပ်ချက်)

[hot_standby](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-HOT-STANDBY) parameter ကို standby server တစ်ခုပေါ်မှာ true လို့ သတ်မှတ်ထားရင် — recovery က system ကို consistent state (တစ်သမတ်တည်း အခြေအနေ) တစ်ခုဆီ ရောက်အောင် ဆောင်ကျဉ်းပြီး hot standby အတွက် အသင့် ဖြစ်လာတာနဲ့ — connections တွေကို လက်ခံ စတင်ပါလိမ့်မယ်။ အဲဒီ connections တွေ အားလုံးက တင်းကြပ်စွာ read-only ဖြစ်ပါတယ်; temporary tables (ယာယီ ဇယားများ) တွေကိုတောင် ရေးသားလို့ မရပါဘူး။

Standby ပေါ်က data က primary server ကနေ ရောက်ရှိဖို့ အချိန် အနည်းငယ် ယူရလို့ — primary နဲ့ standby ကြားမှာ တိုင်းတာလို့ ရတဲ့ နှောင့်နှေးချိန် (measurable delay) တစ်ခု ရှိပါလိမ့်မယ်။ ဒါကြောင့် — primary နဲ့ standby နှစ်ခုလုံးပေါ်မှာ တူညီတဲ့ query တစ်ခုကို တစ်ချိန်နီးပါး run လုပ်ရင် — မတူညီတဲ့ ရလဒ်တွေ ပြန်ပေးနိုင်ပါတယ်။ Standby ပေါ်က data က primary နဲ့ *eventually consistent* (နောက်ဆုံးမှာ တစ်သမတ်တည်း ဖြစ်လာသော) ဖြစ်တယ်လို့ ဆိုပါတယ်။ Transaction တစ်ခုရဲ့ commit record (commit မှတ်တမ်း) ကို standby ပေါ်မှာ replay (ပြန်လည် လုပ်ဆောင်) လုပ်ပြီးတာနဲ့ — အဲဒီ transaction က ပြုလုပ်တဲ့ ပြောင်းလဲမှုတွေက — standby ပေါ်မှာ နောက်ပိုင်း ယူလိုက်တဲ့ snapshots (ထိုအခိုက် မြင်ရသော ပုံရိပ်များ) အသစ်တွေ အားလုံးအတွက် မြင်နိုင်ပါလိမ့်မယ်။ Snapshots တွေကို — လက်ရှိ transaction isolation level (transaction သီးခြားထားမှု အဆင့်) ပေါ် မူတည်ပြီး — query တစ်ခုချင်းစီရဲ့ အစမှာ ဒါမှမဟုတ် transaction တစ်ခုချင်းစီရဲ့ အစမှာ ယူနိုင်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 13.2](https://www.postgresql.org/docs/current/transaction-iso.html) ကို ကြည့်ပါ။

Hot standby အတွင်း စတင်တဲ့ transactions တွေက အောက်ပါ commands တွေကို ထုတ်ပေးနိုင်ပါတယ်:

- Query access (query ဝင်ရောက် လုပ်ဆောင်မှု): SELECT, COPY TO
- Cursor commands (cursor ဆိုင်ရာ commands): DECLARE, FETCH, CLOSE
- Settings (ဆက်တင်များ): SHOW, SET, RESET
- Transaction management commands (transaction စီမံခန့်ခွဲမှု commands):
  
  
  
  BEGIN, END, ABORT, START TRANSACTION
  
  
  SAVEPOINT, RELEASE, ROLLBACK TO SAVEPOINT
  
  
  EXCEPTION blocks (ခြွင်းချက် ဖမ်းယူသည့် blocks) နဲ့ အခြား internal subtransactions (အတွင်းပိုင်း subtransaction များ)
- LOCK TABLE — ဒါပေမယ့် အောက်ပါ mode များထဲက တစ်ခုကို ထင်ရှားစွာ (explicitly) သုံးထားမှသာ: ACCESS SHARE, ROW SHARE ဒါမှမဟုတ် ROW EXCLUSIVE
- Plans and resources (plan များနဲ့ resource များ): PREPARE, EXECUTE, DEALLOCATE, DISCARD
- Plugins and extensions (plugin များနဲ့ extension များ): LOAD
- UNLISTEN

Hot standby အတွင်း စတင်တဲ့ transactions တွေကို transaction ID (transaction မှတ်ပုံတင် နံပါတ်) တစ်ခု ဘယ်တော့မှ သတ်မှတ်ပေးမှာ မဟုတ်ဘဲ — system ရဲ့ write-ahead log (WAL) ထဲကိုလည်း ရေးသားလို့ မရပါဘူး။ ဒါကြောင့် — အောက်ပါ လုပ်ဆောင်ချက်တွေက error messages (အမှား message များ) တွေကို ထုတ်ပေးပါလိမ့်မယ်:

- Data Manipulation Language (DML) (ဒေတာ ပြုပြင်မွမ်းမံမှု ဘာသာစကား): INSERT, UPDATE, DELETE, MERGE, COPY FROM, TRUNCATE ။ Recovery အတွင်း trigger တစ်ခုကို execute (လုပ်ဆောင်) လုပ်စေတဲ့ ခွင့်ပြုထားတဲ့ လုပ်ဆောင်ချက် တစ်ခုမှ မရှိဘူးဆိုတာ သတိပြုပါ။ ဒီကန့်သတ်ချက်က temporary tables တွေအတွက်တောင် သက်ဆိုင်ပါတယ် — အကြောင်းကတော့ table rows တွေကို — transaction ID တစ်ခု သတ်မှတ်ပေးခြင်း မရှိဘဲ — ဖတ်လို့ရော ရေးလို့ရော မရဘဲ — အဲဒါက hot standby environment (hot standby ပတ်ဝန်းကျင်) ထဲမှာ လက်ရှိ မဖြစ်နိုင်လို့ပါ။
- Data Definition Language (DDL) (ဒေတာ သတ်မှတ်ချက် ဘာသာစကား): CREATE, DROP, ALTER, COMMENT ။ ဒီကန့်သတ်ချက်က temporary tables တွေအတွက်တောင် သက်ဆိုင်ပါတယ် — အကြောင်းကတော့ ဒီလို လုပ်ဆောင်ချက်တွေ ဆောင်ရွက်ဖို့ဆိုရင် — system catalog tables (system catalog ဇယားများ) တွေကို update လုပ်ဖို့ လိုအပ်လို့ပါ။
- SELECT ... FOR SHARE | UPDATE — အကြောင်းကတော့ row locks (row lock များ) တွေကို — အောက်ခံ data files တွေကို update မလုပ်ဘဲ — ယူလို့ မရလို့ပါ။
- SELECT statements တွေပေါ်မှာ DML commands တွေ ထုတ်ပေးတဲ့ Rules (စည်းမျဉ်းများ)။
- ROW EXCLUSIVE MODE ထက် ပိုမြင့်တဲ့ mode တစ်ခုကို ထင်ရှားစွာ တောင်းဆိုတဲ့ LOCK ။
- ACCESS EXCLUSIVE MODE ကို တောင်းဆိုလို့ — တိုတောင်းတဲ့ default ပုံစံနဲ့ LOCK ။
- Non-read-only state (read-only မဟုတ်တဲ့ အခြေအနေ) တစ်ခုကို ထင်ရှားစွာ သတ်မှတ်ပေးတဲ့ transaction management commands:
  
  
  
  BEGIN READ WRITE, START TRANSACTION READ WRITE
  
  
  SET TRANSACTION READ WRITE, SET SESSION CHARACTERISTICS AS TRANSACTION READ WRITE
  
  
  SET transaction_read_only = off
- Two-phase commit commands (အဆင့်နှစ်ဆင့် commit ဆိုင်ရာ commands): PREPARE TRANSACTION, COMMIT PREPARED, ROLLBACK PREPARED — အကြောင်းကတော့ read-only transactions တွေတောင် — prepare phase (two-phase commit ရဲ့ ပထမ အဆင့်) မှာ WAL ကို ရေးသားဖို့ လိုအပ်လို့ပါ။
- Sequence updates (sequence update များ): nextval(), setval()
- LISTEN, NOTIFY

ပုံမှန် လည်ပတ်မှုမှာ "read-only" transactions တွေက `LISTEN` နဲ့ `NOTIFY` တို့ကို သုံးခွင့် ရှိတာမို့ — hot standby sessions တွေက သာမန် read-only sessions တွေထက် အနည်းငယ် ပိုတင်းကျပ်တဲ့ ကန့်သတ်ချက်တွေ အောက်မှာ လည်ပတ်နေတာ ဖြစ်ပါတယ်။ ဒီကန့်သတ်ချက်တချို့ကို အနာဂတ် release တစ်ခုမှာ ဖြေလျှော့ပေးနိုင်ဖို့ ဖြစ်နိုင်ပါတယ်။

Hot standby အတွင်း — `transaction_read_only` parameter က အမြဲ true ဖြစ်ပြီး — ပြောင်းလဲလို့ မရပါဘူး။ ဒါပေမယ့် — database ကို ပြုပြင်မွမ်းမံဖို့ ကြိုးစားမှု တစ်ခုခု မလုပ်သရွေ့ — hot standby အတွင်း connections တွေက တခြား database connection တွေလိုပဲ ပြုမူ လုပ်ဆောင်ပါလိမ့်မယ်။ Failover (ကျရှုံးမှု လွှဲပြောင်းမှု) ဒါမှမဟုတ် switchover (ပြောင်းလဲ လွှဲပြောင်းမှု) ဖြစ်ပေါ်ခဲ့ရင် — database က ပုံမှန် processing mode (ပုံမှန် လုပ်ဆောင်မှု mode) ဆီ ပြောင်းသွားပါလိမ့်မယ်။ Server က mode ပြောင်းနေတဲ့ အချိန်အတွင်းမှာတော့ sessions တွေက connect ဖြစ်နေဆဲ ဖြစ်ပါလိမ့်မယ်။ Hot standby ပြီးဆုံးသွားတာနဲ့ — read-write transactions တွေကို စတင်ဖို့ ဖြစ်နိုင်လာပါလိမ့်မယ် (hot standby အတွင်း စတင်ခဲ့တဲ့ session တစ်ခုကနေတောင် ဖြစ်ပါတယ်)။

Users တွေက — `SHOW in_hot_standby` ကို ထုတ်ပေးခြင်းအားဖြင့် — သူတို့ရဲ့ session အတွက် hot standby လက်ရှိ သက်ဝင် နေလား ဆုံးဖြတ်နိုင်ပါတယ်။ (Server version 14 မတိုင်ခင် — `in_hot_standby` parameter က မရှိခဲ့ပါဘူး; server အဟောင်းတွေအတွက် အလုပ်ဖြစ်တဲ့ အစားထိုး နည်းလမ်းကတော့ `SHOW transaction_read_only` ဖြစ်ပါတယ်။) ထို့အပြင် — function အစုတစ်ခု ([ဇယား 9.98](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-RECOVERY-INFO-TABLE)) က users တွေကို standby server အကြောင်း အချက်အလက်တွေ ဝင်ရောက် ရယူခွင့် ပေးပါတယ်။ ဒါတွေက သင့်ကို — database ရဲ့ လက်ရှိ state (အခြေအနေ) ကို သိရှိနေတဲ့ programs တွေ ရေးသားနိုင်စေပါတယ်။ ဒါတွေကို — recovery ရဲ့ တိုးတက်မှုကို စောင့်ကြည့်ဖို့ ဒါမှမဟုတ် — database ကို တိကျတဲ့ state တွေဆီ ပြန်လည် ထူထောင်ပေးတဲ့ — ရှုပ်ထွေးတဲ့ programs တွေ ရေးသားဖို့ သုံးနိုင်ပါတယ်။

### 26.4.2. Handling Query Conflicts (Query conflicts များကို ကိုင်တွယ် ဖြေရှင်းခြင်း)

Primary နဲ့ standby servers တွေက နည်းလမ်း များစွာနဲ့ လျော့ရဲရဲ ချိတ်ဆက်ထားပါတယ်။ Primary ပေါ်က လုပ်ဆောင်ချက်တွေက standby ပေါ်မှာ သက်ရောက်မှု ရှိပါလိမ့်မယ်။ ရလဒ်အနေနဲ့ — သူတို့ နှစ်ခုကြားမှာ ဆိုးရွားတဲ့ အပြန်အလှန် သက်ရောက်မှုတွေ ဒါမှမဟုတ် conflicts (ကွဲလွဲမှုများ) တွေ ဖြစ်ပွားနိုင်ခြေ ရှိပါတယ်။ နားလည်ဖို့ အလွယ်ဆုံး conflict ကတော့ performance (စွမ်းဆောင်ရည်) ပဲ ဖြစ်ပါတယ်: primary ပေါ်မှာ ကြီးမားတဲ့ data load တစ်ခု ဖြစ်ပွားနေရင် — အဲဒါက standby ပေါ်မှာ WAL records တွေရဲ့ ဆင်တူတဲ့ stream (စီးကြောင်း) တစ်ခုကို ထုတ်ပေးမှာ ဖြစ်လို့ — standby queries တွေက I/O လို system resources တွေအတွက် ပြိုင်ဆိုင် ရနိုင်ပါတယ်။

Hot standby နဲ့အတူ ဖြစ်ပွားနိုင်တဲ့ နောက်ထပ် conflict အမျိုးအစားတွေလည်း ရှိပါသေးတယ်။ ဒီ conflicts တွေက hard conflicts (ပြင်းထန်သော ကွဲလွဲမှုများ) တွေ ဖြစ်ပါတယ် — queries တွေကို cancel (ရပ်စဲ) လုပ်ဖို့ လိုအပ်နိုင်ပြီး — တချို့ အခြေအနေတွေမှာ — သူတို့ကို ဖြေရှင်းဖို့ sessions တွေကို ချိတ်ဆက် ဖြုတ်ပစ်ဖို့ (disconnect) လိုအပ်နိုင်လို့ပါ။ ဒီ conflicts တွေကို ကိုင်တွယ်ဖို့ နည်းလမ်း အများအပြားကို user တွေကို ပေးထားပါတယ်။ Conflict ဖြစ်ပွားနိုင်တဲ့ အခြေအနေတွေကတော့:

- Primary server ပေါ်မှာ ယူထားတဲ့ Access Exclusive locks (သီးသန့် access lock များ) တွေ — explicit LOCK commands တွေရော DDL လုပ်ဆောင်ချက် အမျိုးမျိုးပါ အပါအဝင် — standby queries တွေထဲက table ဝင်ရောက် လုပ်ဆောင်မှုတွေနဲ့ conflict ဖြစ်ပါတယ်။
- Primary ပေါ်မှာ tablespace တစ်ခုကို drop (ဖျက်) လုပ်တာက — အဲဒီ tablespace ကို temporary work files (ယာယီ အလုပ် ဖိုင်များ) အတွက် သုံးနေတဲ့ standby queries တွေနဲ့ conflict ဖြစ်ပါတယ်။
- Primary ပေါ်မှာ database တစ်ခုကို drop လုပ်တာက — standby ပေါ်မှာ အဲဒီ database ဆီ connect လုပ်ထားတဲ့ sessions တွေနဲ့ conflict ဖြစ်ပါတယ်။
- WAL ကနေ vacuum cleanup record (vacuum သန့်ရှင်းရေး မှတ်တမ်း) တစ်ခုကို apply (အသုံးချ) လုပ်တာက — သူတို့ရဲ့ snapshots တွေက ဖယ်ရှားခံရမယ့် rows တွေထဲက ဘယ်ဟာကိုမဆို "မြင်နိုင်" သေးတဲ့ standby transactions တွေနဲ့ conflict ဖြစ်ပါတယ်။
- WAL ကနေ vacuum cleanup record တစ်ခုကို apply လုပ်တာက — ဖယ်ရှားခံရမယ့် data က မြင်နိုင်သည် ဖြစ်စေ မမြင်နိုင်သည် ဖြစ်စေ — standby ပေါ်မှာ ပစ်မှတ် page ကို ဝင်ရောက် လုပ်ဆောင်နေတဲ့ queries တွေနဲ့ conflict ဖြစ်ပါတယ်။

Primary server ပေါ်မှာတော့ — ဒီအခြေအနေတွေက စောင့်ဆိုင်းရုံပဲ ဖြစ်ပြီး — user က conflict ဖြစ်နေတဲ့ လုပ်ဆောင်ချက် နှစ်ခုထဲက တစ်ခုကို cancel လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။ ဒါပေမယ့် — standby ပေါ်မှာတော့ ရွေးချယ်စရာ မရှိပါဘူး: WAL-logged (WAL ထဲ မှတ်တမ်းတင်ထားသော) လုပ်ဆောင်ချက်က primary ပေါ်မှာ ဖြစ်ပျက်ပြီးသား ဖြစ်လို့ — standby က အဲဒါကို apply လုပ်ဖို့ မပျက်ကွက်ရပါဘူး။ ထို့အပြင် — WAL ကို apply လုပ်တာကို အကန့်အသတ်မရှိ စောင့်ဆိုင်းခွင့် ပြုတာက အလွန် မလိုလားအပ်ပါဘူး — အကြောင်းကတော့ standby ရဲ့ state က primary ရဲ့ နောက်မှာ ပိုပိုပြီး နောက်ကျ ကျန်ခဲ့နိုင်လို့ပါ။ ဒါကြောင့် — apply လုပ်ရမယ့် WAL records တွေနဲ့ conflict ဖြစ်နေတဲ့ standby queries တွေကို အတင်းအကျပ် cancel လုပ်ပေးတဲ့ ယန္တရား တစ်ခုကို ထောက်ပံ့ပေးထားပါတယ်။

ဒီပြဿနာ အခြေအနေရဲ့ ဥပမာ တစ်ခုကတော့ — primary server ပေါ်က administrator တစ်ယောက်က — standby server ပေါ်မှာ လက်ရှိ query လုပ်နေတဲ့ table တစ်ခုပေါ်မှာ `DROP TABLE` ကို run လုပ်နေတာ ဖြစ်ပါတယ်။ `DROP TABLE` ကို standby ပေါ်မှာ apply လုပ်လိုက်ရင် — standby query က ဆက်လက် လုပ်ဆောင်လို့ မရနိုင်တာ ထင်ရှားပါတယ်။ ဒီအခြေအနေ primary ပေါ်မှာ ဖြစ်ခဲ့မယ်ဆိုရင် — `DROP TABLE` က တခြား query ပြီးဆုံးသည်အထိ စောင့်ဆိုင်းပါလိမ့်မယ်။ ဒါပေမယ့် — `DROP TABLE` ကို primary ပေါ်မှာ run လုပ်တဲ့အခါ — primary မှာ standby ပေါ်မှာ ဘယ် queries တွေ run နေလဲဆိုတဲ့ အချက်အလက် မရှိလို့ — အဲဒီလို standby queries တွေအတွက် စောင့်ဆိုင်းမှာ မဟုတ်ပါဘူး။ Standby query run နေတုန်းမှာပဲ WAL change records တွေက standby ဆီ ရောက်ရှိလာပြီး — conflict ဖြစ်ပေါ်စေပါတယ်။ Standby server က — WAL records တွေကို apply လုပ်တာကို (သူတို့ နောက်မှာ ရှိတဲ့ အရာ အားလုံးကိုပါ) နှောင့်နှေးစေရမယ် ဒါမှမဟုတ် — `DROP TABLE` ကို apply လုပ်နိုင်စေဖို့ — conflict ဖြစ်နေတဲ့ query ကို cancel လုပ်ရပါမယ်။

Conflict ဖြစ်နေတဲ့ query က တိုတောင်းတဲ့အခါ — WAL ကို apply လုပ်တာကို ခဏလေး နှောင့်နှေးစေပြီး အဲဒီ query ကို ပြီးဆုံးအောင် ခွင့်ပြုတာက ပုံမှန်အားဖြင့် နှစ်လိုဖွယ် ကောင်းပါတယ်; ဒါပေမယ့် WAL apply လုပ်မှုမှာ ကြာမြင့်စွာ နှောင့်နှေးတာကတော့ ပုံမှန်အားဖြင့် မနှစ်လိုဖွယ် ဖြစ်ပါတယ်။ ဒါကြောင့် — cancel ယန္တရားမှာ WAL apply လုပ်မှုအတွက် ခွင့်ပြုထားတဲ့ အများဆုံး နှောင့်နှေးချိန်ကို သတ်မှတ်ပေးတဲ့ parameters နှစ်ခု — [max_standby_archive_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY) နဲ့ [max_standby_streaming_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY) — ရှိပါတယ်။ ဆက်စပ်တဲ့ delay setting ထက် ပိုကြာအောင် — လက်ခံရရှိတဲ့ WAL data အသစ် တစ်ခုခုကို apply လုပ်ဖို့ အချိန် ယူလိုက်ရတာနဲ့ — conflict ဖြစ်နေတဲ့ queries တွေကို cancel လုပ်ပါလိမ့်မယ်။ Parameters နှစ်ခု ရှိတာက — WAL data တွေကို archive တစ်ခုကနေ ဖတ်တဲ့ ကိစ္စ (ဆိုလိုတာက — base backup တစ်ခုကနေ ကနဦး recovery ဒါမှမဟုတ် — အတော် နောက်ကျ ကျန်ခဲ့တဲ့ — standby server တစ်ခုကို "အမီလိုက်ခြင်း") နဲ့ — streaming replication (streaming replication — တိုက်ရိုက် စီးဆင်း ပုံတူပွားမှု) ကတစ်ဆင့် WAL data တွေကို ဖတ်တဲ့ ကိစ္စအတွက် — မတူညီတဲ့ delay values တွေကို သတ်မှတ်နိုင်စေဖို့ ဖြစ်ပါတယ်။

အဓိကအားဖြင့် high availability (မြင့်မားသော ရရှိနိုင်မှု) အတွက် တည်ရှိနေတဲ့ standby server တစ်ခုမှာ — delay parameters တွေကို အတော်လေး တိုတောင်းအောင် သတ်မှတ်တာ အကောင်းဆုံး ဖြစ်ပါတယ် — ဒါမှ server က — standby queries တွေကြောင့် ဖြစ်ပေါ်တဲ့ နှောင့်နှေးမှုတွေကြောင့် — primary ရဲ့ နောက်မှာ အများကြီး မကျန်ခဲ့နိုင်လို့ပါ။ ဒါပေမယ့် — standby server ကို ကြာမြင့်စွာ run လုပ်တဲ့ queries တွေ လုပ်ဆောင်ဖို့ ရည်ရွယ်ထားရင်တော့ — မြင့်မားတဲ့ ဒါမှမဟုတ် အကန့်အသတ်မရှိ (infinite) နှောင့်နှေးချိန် တန်ဖိုးတစ်ခုက ပိုနှစ်သက်ဖွယ် ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် — WAL records တွေကို apply လုပ်တာကို နှောင့်နှေးစေနိုင်တာမို့ — ကြာမြင့်စွာ run လုပ်တဲ့ query တစ်ခုက — standby server ပေါ်က တခြား sessions တွေကို — primary ပေါ်က မကြာသေးတဲ့ ပြောင်းလဲမှုတွေကို မမြင်ရအောင် ဖြစ်စေနိုင်တာကို သတိရပါ။

`max_standby_archive_delay` ဒါမှမဟုတ် `max_standby_streaming_delay` တို့က သတ်မှတ်တဲ့ နှောင့်နှေးချိန်ကို ကျော်လွန်သွားတာနဲ့ — conflict ဖြစ်နေတဲ့ queries တွေကို cancel လုပ်ပါလိမ့်မယ်။ ဒါက များသောအားဖြင့် cancellation error (ရပ်စဲမှု error) တစ်ခုကိုပဲ ဖြစ်ပေါ်စေပြီး — `DROP DATABASE` တစ်ခုကို replay လုပ်တဲ့ ကိစ္စမှာတော့ — conflict ဖြစ်နေတဲ့ session တစ်ခုလုံးကို အဆုံးသတ်ပစ်မှာ ဖြစ်ပါတယ်။ ထို့အပြင် — conflict က idle transaction (မလှုပ်ရှားသော transaction) တစ်ခုက ကိုင်ထားတဲ့ lock တစ်ခုအပေါ်မှာ ဖြစ်နေရင် — conflict ဖြစ်နေတဲ့ session ကို အဆုံးသတ်ပစ်ပါတယ် (ဒီအပြုအမူက အနာဂတ်မှာ ပြောင်းလဲနိုင်ပါတယ်)။

Cancel လုပ်ခံထားရတဲ့ queries တွေကို ချက်ချင်း ပြန်လည် ကြိုးစားလို့ ရပါတယ် (transaction အသစ်တစ်ခု စတင်ပြီးနောက်မှာ ဖြစ်ပါတယ်)။ Query cancellation က — replay လုပ်နေတဲ့ WAL records တွေရဲ့ သဘောသဘာဝပေါ်မှာ မူတည်လို့ — cancel လုပ်ခံရတဲ့ query တစ်ခုက — နောက်တစ်ကြိမ် ထပ်ပြီး execute (လုပ်ဆောင်) လုပ်ရင် အောင်မြင်ဖို့ များပါတယ်။

Delay parameters တွေကို — standby server က WAL data ကို လက်ခံရရှိချိန်ကစပြီး ကုန်လွန်သွားတဲ့ အချိန်နဲ့ နှိုင်းယှဉ်တယ်ဆိုတာ သတိရပါ။ ဒါကြောင့် — standby ပေါ်က query တစ်ခုခုကို ခွင့်ပြုထားတဲ့ ကရုဏာ ကာလ (grace period) က — delay parameter ထက် ဘယ်တော့မှ မပိုနိုင်ဘဲ — အရင် queries တွေ ပြီးဆုံးဖို့ စောင့်ဆိုင်းခဲ့လို့ standby က နောက်ကျ ကျန်ခဲ့ပြီးသား ဆိုရင် ဒါမှမဟုတ် — လေးလံတဲ့ update load (update ဝန်အား) တစ်ခုကို မမီနိုင်ဘူးဆိုရင် — သိသိသာသာ ပိုတိုနိုင်ပါတယ်။

Standby queries တွေနဲ့ WAL replay တို့ကြား conflict ဖြစ်ရတဲ့ အဖြစ်အများဆုံး အကြောင်းရင်းကတော့ "early cleanup" (စောစော သန့်ရှင်းရေး) ပဲ ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — PostgreSQL က MVCC rules (MVCC စည်းမျဉ်းများ) အရ data ရဲ့ မှန်ကန်တဲ့ မြင်နိုင်မှု (visibility) ကို သေချာစေဖို့ — အဲဒီ row versions (row ဗားရှင်းများ) တွေကို မြင်ဖို့ လိုအပ်တဲ့ transactions တွေ မရှိတော့တဲ့အခါ — row versions အဟောင်းတွေကို cleanup (သန့်ရှင်းရေး) လုပ်ခွင့် ပြုပါတယ်။ ဒါပေမယ့် — ဒီစည်းမျဉ်းကို primary ပေါ်မှာ execute (လုပ်ဆောင်) နေတဲ့ transactions တွေအတွက်ပဲ သုံးနိုင်ပါတယ်။ ဒါကြောင့် — primary ပေါ်မှာ cleanup လုပ်တာက — standby ပေါ်က transaction တစ်ခုအတွက် မြင်နေဆဲ ဖြစ်တဲ့ row versions တွေကို ဖယ်ရှားပစ်နိုင်ပါတယ်။

Row version cleanup က standby queries တွေနဲ့ conflict ဖြစ်စေနိုင်တဲ့ တစ်ခုတည်းသော အကြောင်းရင်း မဟုတ်ပါဘူး။ Index-only scans (index သက်သက်ဖြင့် စကင်ဖတ်မှုများ) တွေ အားလုံး (standbys ပေါ်မှာ run လုပ်တာတွေ အပါအဝင်) က visibility map (မြင်နိုင်မှု မြေပုံ) နဲ့ "ကိုက်ညီတဲ့" MVCC snapshot တစ်ခုကို သုံးရပါတယ်။ ဒါကြောင့် — `VACUUM` က [visibility map ထဲမှာ page တစ်ခုကို all-visible အဖြစ် သတ်မှတ်တဲ့အခါ](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-VISIBILITY-MAP) — အဲဒီ page ထဲမှာ standby queries တွေ အားလုံးအတွက် မမြင်ရတဲ့ rows တစ်ခု ဒါမှမဟုတ် တစ်ခုထက် ပိုပြီး ပါဝင်နေရင် — conflicts တွေ လိုအပ်လာပါတယ်။ ဒါကြောင့် — cleanup လုပ်ဖို့ လိုအပ်တဲ့ updated ဒါမှမဟုတ် deleted rows တွေ မရှိတဲ့ table တစ်ခုပေါ်မှာ `VACUUM` run လုပ်တာတောင် conflicts တွေဆီ ဦးတည်သွားနိုင်ပါတယ်။

Primary server ပေါ်မှာ ပုံမှန် ပြင်းပြင်းထန်ထန် update လုပ်ခံနေရတဲ့ tables တွေက — standby ပေါ်မှာ run နေတဲ့ ကြာမြင့်တဲ့ queries တွေကို မြန်မြန် cancel ဖြစ်စေလိမ့်မယ်ဆိုတာ users တွေ ရှင်းရှင်းလင်းလင်း သိထားသင့်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — `max_standby_archive_delay` ဒါမှမဟုတ် `max_standby_streaming_delay` တို့အတွက် အကန့်အသတ် ရှိတဲ့ (finite) တန်ဖိုးတစ်ခု သတ်မှတ်တာကို — `statement_timeout` သတ်မှတ်တာနဲ့ ဆင်တူတယ်လို့ မှတ်ယူနိုင်ပါတယ်။

Standby-query cancellations အရေအတွက်က လက်ခံနိုင်လောက်စရာ မဟုတ်ဘူးလို့ တွေ့ရှိရရင် — ပြုပြင်ရေး (remedial) ဖြစ်နိုင်ခြေတွေ ရှိပါတယ်။ ပထမ option ကတော့ — `hot_standby_feedback` parameter ကို သတ်မှတ်တာ ဖြစ်ပြီး — ဒါက `VACUUM` က မကြာသေးဘဲ dead ဖြစ်သွားတဲ့ (နောက်ထပ် သုံးစွဲလို့ မရတော့သော) rows တွေကို ဖယ်ရှားတာကို တားဆီးပေးလို့ — cleanup conflicts တွေ မဖြစ်ပွားတော့ပါဘူး။ ဒါလုပ်မယ်ဆိုရင် — ဒါက primary ပေါ်မှာ dead rows တွေရဲ့ cleanup ကို နှောင့်နှေးစေပြီး — မလိုလားအပ်တဲ့ table bloat (ဇယား ဖောင်းပွမှု) ကို ဖြစ်ပေါ်စေနိုင်တာ သတိပြုသင့်ပါတယ်။ ဒါပေမယ့် — cleanup အခြေအနေက — standby queries တွေကို primary server ပေါ်မှာ တိုက်ရိုက် run လုပ်နေတာထက် — ပိုဆိုးမှာ မဟုတ်ဘဲ — execution (လုပ်ဆောင်မှု) ကို standby ပေါ်ကို ရွှေ့ထုတ်လိုက်တဲ့ အကျိုးခံစားမှုကိုတော့ ရရှိနေဆဲပဲ ဖြစ်ပါတယ်။ Standby servers တွေက မကြာခဏ connect လုပ်ပြီး disconnect လုပ်နေရင် — `hot_standby_feedback` feedback ကို မပေးအပ်တဲ့ ကာလကို ကိုင်တွယ်ဖို့ ပြုပြင်ပြောင်းလဲမှုတွေ လုပ်ချင်နိုင်ပါတယ်။ ဥပမာ — disconnected ကာလတွေအတွင်း WAL archive ဖိုင်တွေထဲက conflicts တွေကြောင့် queries တွေ အမြန် cancel မဖြစ်စေဖို့ — `max_standby_archive_delay` ကို တိုးမြှင့်ဖို့ စဉ်းစားပါ။ ပြန်လည် connect လုပ်ပြီးနောက် အသစ် ရောက်ရှိလာတဲ့ streaming WAL entries တွေကြောင့် မြန်မြန် cancel ဖြစ်တာကို ရှောင်ဖို့ — `max_standby_streaming_delay` ကိုလည်း တိုးမြှင့်ဖို့ စဉ်းစားသင့်ပါတယ်။

Query cancels တွေရဲ့ အရေအတွက်နဲ့ အကြောင်းရင်းတွေကို — standby server ပေါ်မှာ `pg_stat_database_conflicts` system view (system view — စနစ် မြင်ကွင်း) ကို သုံးပြီး ကြည့်ရှုနိုင်ပါတယ်။ `pg_stat_database` system view မှာလည်း အကျဉ်းချုပ် အချက်အလက်တွေ ပါဝင်ပါတယ်။

WAL replay က conflicts တွေအတွက် `deadlock_timeout` ထက် ပိုကြာအောင် စောင့်ဆိုင်းနေတဲ့အခါ — log message (log မှတ်တမ်း message) တစ်ခု ထုတ်လုပ်သင့်လားဆိုတာကို users တွေ ထိန်းချုပ်နိုင်ပါတယ်။ ဒါကို [log_recovery_conflict_waits](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-RECOVERY-CONFLICT-WAITS) parameter က ထိန်းချုပ်ပါတယ်။

### 26.4.3. Administrator's Overview (Administrator များအတွက် ခြုံငုံ သုံးသပ်ချက်)

`postgresql.conf` ထဲမှာ `hot_standby` က `on` ဖြစ်ပြီး (ဒါက default တန်ဖိုးပါ) — [`standby.signal`](https://www.postgresql.org/docs/current/warm-standby.html#FILE-STANDBY-SIGNAL)[]() ဖိုင် တစ်ခု ရှိနေရင် — server က hot standby mode ထဲမှာ run လုပ်ပါလိမ့်မယ်။ ဒါပေမယ့် — hot standby connections တွေကို ခွင့်ပြုဖို့ အချိန် အနည်းငယ် ကြာနိုင်ပါတယ် — အကြောင်းကတော့ server က — queries တွေ run လုပ်နိုင်တဲ့ consistent state (တစ်သမတ်တည်း အခြေအနေ) တစ်ခုကို ထောက်ပံ့ဖို့ လုံလောက်တဲ့ recovery ကို ပြီးမြောက်သည်အထိ — connections တွေကို လက်ခံမှာ မဟုတ်လို့ပါ။ ဒီကာလအတွင်း — connect လုပ်ဖို့ ကြိုးစားတဲ့ clients တွေကို error message တစ်ခုနဲ့ ငြင်းပယ်ခံရပါလိမ့်မယ်။ Server တက်လာပြီဆိုတာ အတည်ပြုဖို့ — application ကနေ connect လုပ်ဖို့ ကြိုးစားတာကို loop (ထပ်ခါထပ်ခါ) လုပ်ပါ ဒါမှမဟုတ် — server logs တွေထဲမှာ ဒီ messages တွေကို ရှာကြည့်ပါ:

```sql
LOG:  entering standby mode

... then some time later ...

LOG:  consistent recovery state reached
LOG:  database system is ready to accept read-only connections
```

Consistency (တစ်သမတ်တည်း ဖြစ်မှု) အချက်အလက်တွေကို primary ပေါ်မှာ checkpoint တစ်ခုချင်းစီမှာ တစ်ကြိမ် မှတ်တမ်းတင်ပါတယ်။ Primary ပေါ်မှာ `wal_level` ကို `replica` ဒါမှမဟုတ် `logical` အဖြစ် သတ်မှတ်မထားခဲ့တဲ့ ကာလတစ်ခုအတွင်း ရေးသားခဲ့တဲ့ WAL ကို ဖတ်နေတဲ့အခါ — hot standby ကို enable (ဖွင့်) လုပ်လို့ မရပါဘူး။ Consistent state ဆီ ရောက်ရှိပြီးတာတောင် — အောက်ပါ အခြေအနေ နှစ်ခုလုံး ကိုက်ညီနေရင် — recovery snapshot က hot standby အတွက် အသင့် မဖြစ်သေးဘဲ — read-only connections တွေကို လက်ခံတာကို နှောင့်နှေးစေနိုင်ပါတယ်။ Hot standby ကို enable လုပ်နိုင်ဖို့ — subtransactions 64 ခုထက် ပိုပါဝင်တဲ့ — ကြာမြင့်စွာ သက်တမ်းရှိတဲ့ write transactions (ရေးသားမှု transactions) တွေကို primary ပေါ်မှာ ပိတ်သိမ်းဖို့ လိုအပ်ပါတယ်။

- Write transaction တစ်ခုမှာ subtransactions 64 ခုထက် ပိုများနေတာ
- အလွန် ကြာမြင့်စွာ သက်တမ်းရှိတဲ့ write transactions

File-based log shipping ("warm standby") run လုပ်နေတယ်ဆိုရင် — နောက် WAL ဖိုင် ရောက်ရှိလာသည်အထိ စောင့်ဆိုင်းဖို့ လိုအပ်နိုင်ပြီး — အဲဒါက primary ပေါ်က `archive_timeout` setting လောက်အထိ ကြာမြင့်နိုင်ပါတယ်။

Parameters တချို့ရဲ့ settings တွေက — transaction IDs တွေ၊ locks တွေနဲ့ prepared transactions (ကြိုတင် ပြင်ဆင်ထားသော transactions) တွေကို ခြေရာခံဖို့ — shared memory (မျှဝေသုံး memory) ရဲ့ အရွယ်အစားကို ဆုံးဖြတ်ပေးပါတယ်။ Recovery အတွင်း standby က shared memory ကုန်သွားတာ မဖြစ်စေဖို့ — ဒီ shared memory structures တွေက standby ပေါ်မှာ primary ပေါ်ကထက် မငယ်ရပါဘူး။ ဥပမာ — primary က prepared transaction တစ်ခုကို သုံးခဲ့ပေမယ့် — standby က prepared transactions တွေကို ခြေရာခံဖို့ shared memory ကို လုံးဝ ခွဲဝေမထားခဲ့ဘူးဆိုရင် — standby ရဲ့ configuration ကို မပြောင်းမချင်း — recovery က ဆက်လက် မလုပ်နိုင်တော့ပါဘူး။ သက်ရောက်မှု ရှိတဲ့ parameters တွေကတော့:

- max_connections
- max_prepared_transactions
- max_locks_per_transaction
- max_wal_senders
- max_worker_processes

ဒါက ပြဿနာ မဖြစ်အောင် သေချာစေဖို့ အလွယ်ဆုံး နည်းလမ်းကတော့ — standbys တွေပေါ်မှာ ဒီ parameters တွေကို primary ပေါ်က တန်ဖိုးတွေနဲ့ တူညီတဲ့ ဒါမှမဟုတ် ပိုမြင့်တဲ့ တန်ဖိုးတွေနဲ့ သတ်မှတ်ထားဖို့ ဖြစ်ပါတယ်။ ဒါကြောင့် — ဒီတန်ဖိုးတွေကို တိုးမြှင့်ချင်ရင် — primary server ပေါ်မှာ ပြောင်းလဲမှုတွေ မလုပ်ခင် — ပထမဆုံး standby servers တွေ အားလုံးပေါ်မှာ လုပ်သင့်ပါတယ်။ ပြောင်းပြန်အနေနဲ့ — ဒီတန်ဖိုးတွေကို လျှော့ချချင်ရင် — standby servers တွေ အားလုံးပေါ်မှာ မလုပ်ခင် — primary server ပေါ်မှာ ဦးစွာ လုပ်သင့်ပါတယ်။ Standby တစ်ခုကို promote (primary အဖြစ် မြှင့်တင်) လုပ်လိုက်တဲ့အခါ — အဲဒါက သူ့နောက်ကို လိုက်လာတဲ့ standbys တွေအတွက် လိုအပ်တဲ့ parameter settings တွေရဲ့ စံသတ်မှတ်ချက် (reference) အသစ် ဖြစ်သွားတာ သတိရပါ။ ဒါကြောင့် — switchover ဒါမှမဟုတ် failover အတွင်း ဒါက ပြဿနာ မဖြစ်အောင် — standby servers တွေ အားလုံးပေါ်မှာ ဒီ settings တွေကို တူညီအောင် ထားဖို့ အကြံပြုပါတယ်။

WAL က ဒီ parameters တွေဆီ primary ပေါ်မှာ ဖြစ်ပေါ်တဲ့ ပြောင်းလဲမှုတွေကို ခြေရာခံပါတယ်။ Hot standby တစ်ခုက — primary ပေါ်က လက်ရှိ တန်ဖိုးက ကိုယ့်ရဲ့ တန်ဖိုးထက် ပိုမြင့်တယ်လို့ ညွှန်ပြတဲ့ WAL ကို process လုပ်တဲ့အခါ — warning (သတိပေးချက်) တစ်ခုကို log လုပ်ပြီး — recovery ကို ခေတ္တ ရပ်နားပါလိမ့်မယ် — ဥပမာ:

```sql
WARNING:  hot standby is not possible because of insufficient parameter settings
DETAIL:  max_connections = 80 is a lower setting than on the primary server, where its value was 100.
LOG:  recovery has paused
DETAIL:  If recovery is unpaused, the server will shut down.
HINT:  You can then restart the server after making the necessary configuration changes.
```

အဲဒီအချိန်မှာ — recovery က ဆက်လက် လုပ်ဆောင်နိုင်ဖို့ — standby ပေါ်က settings တွေကို update လုပ်ပြီး — instance ကို restart (ပြန်လည် စတင်) လုပ်ရပါလိမ့်မယ်။ Standby က hot standby မဟုတ်ဘူးဆိုရင် — မလိုက်ဖက်တဲ့ (incompatible) parameter ပြောင်းလဲမှုကို ကြုံတွေ့တဲ့အခါ — ခေတ္တ ရပ်နားထားစရာ အကျိုးတန်ဖိုး (value) မရှိလို့ — ချက်ချင်း shut down (ပိတ်ပစ်) ပါလိမ့်မယ်။

Administrator က [max_standby_archive_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY) နဲ့ [max_standby_streaming_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY) တို့အတွက် သင့်လျော်တဲ့ settings တွေ ရွေးချယ်ဖို့ အရေးကြီးပါတယ်။ အကောင်းဆုံး ရွေးချယ်မှုတွေက business ရဲ့ ဦးစားပေးချက်တွေပေါ်မှာ မူတည်ပြီး ကွဲပြားပါတယ်။ ဥပမာ — server ကို အဓိကအားဖြင့် High Availability server (မြင့်မားသော ရရှိနိုင်မှု server) အဖြစ် တာဝန်ပေးထားရင် — low delay settings တွေကို လိုချင်မှာ ဖြစ်ပြီး — သုညတောင် ဖြစ်နိုင်ပါတယ် — ဒါက အလွန် ပြင်းထန်တဲ့ setting တစ်ခု ဖြစ်ပေမယ့်ပါ။ Standby server ကို decision support queries (ဆုံးဖြတ်ချက် ထောက်ပံ့မှု queries) တွေအတွက် ထပ်ဆောင်း server အဖြစ် တာဝန်ပေးထားရင်တော့ — maximum delay values တွေကို နာရီ များစွာ အထိ ဒါမှမဟုတ် — queries တွေ ပြီးဆုံးတာအတွက် ထာဝရ စောင့်ဆိုင်းတာကို ဆိုလိုတဲ့ -1 အထိတောင် သတ်မှတ်တာ လက်ခံနိုင်ပါတယ်။

Primary ပေါ်မှာ ရေးသားတဲ့ transaction status "hint bits" (အချက်ပြ bit များ) တွေက WAL-logged (WAL ထဲ မှတ်တမ်းတင်ထားသော) မဟုတ်လို့ — standby ပေါ်က data က standby ပေါ်မှာ အဲဒီ hints တွေကို ပြန်လည် ရေးသားဖို့ များပါတယ်။ ဒါကြောင့် — users တွေ အားလုံး read-only ဖြစ်နေတာတောင် — standby server က disk writes (disk ရေးသားမှုများ) တွေ လုပ်ဆောင်နေဆဲ ဖြစ်ပါလိမ့်မယ်; data values တွေကိုယ်တိုင်မှာတော့ ပြောင်းလဲမှု မရှိပါဘူး။ Users တွေက ကြီးမားတဲ့ sort temporary files (sort လုပ်ရန် ယာယီ ဖိုင်များ) တွေကို ရေးသားနေဆဲ ဖြစ်ပြီး — relcache info files (relcache အချက်အလက် ဖိုင်များ) တွေကိုလည်း ပြန်လည် ထုတ်လုပ်နေဦးမှာ မို့လို့ — hot standby mode အတွင်း database ရဲ့ ဘယ် အစိတ်အပိုင်းကမှ တကယ့် read-only (စင်စစ် ဖတ်ရုံသက်သက်) မဟုတ်ပါဘူး။ dblink module ကို သုံးပြီး remote databases တွေဆီ ရေးသားတာတွေနဲ့ — PL functions တွေကို သုံးပြီး database ပြင်ပမှာ လုပ်ဆောင်တဲ့ တခြား operations တွေက — transaction က locally read-only ဖြစ်နေတာတောင် — ဖြစ်နိုင်ဦးမှာ ဖြစ်ကြောင်းလည်း သတိပြုပါ။

Recovery mode အတွင်း — အောက်ပါ စီမံခန့်ခွဲမှု (administration) command အမျိုးအစားတွေကို လက်ခံမှာ မဟုတ်ပါဘူး:

- Data Definition Language (DDL): ဥပမာ — CREATE INDEX
- Privilege and Ownership (အခွင့်ထူးနဲ့ ပိုင်ဆိုင်မှု): GRANT, REVOKE, REASSIGN
- Maintenance commands (ပြုပြင်ထိန်းသိမ်းမှု commands): ANALYZE, VACUUM, CLUSTER, REINDEX

ဒီ commands တချို့က primary ပေါ်မှာ "read only" mode transactions အတွင်းမှာ တကယ်တော့ ခွင့်ပြုထားတယ်ဆိုတာ နောက်တစ်ကြိမ် သတိပြုပါ။

ရလဒ်အနေနဲ့ — standby ပေါ်မှာပဲ သီးသန့် တည်ရှိတဲ့ ထပ်ဆောင်း indexes တွေ ဒါမှမဟုတ် — standby ပေါ်မှာပဲ တည်ရှိတဲ့ statistics (စာရင်းအင်းများ) တွေကို ဖန်တီးလို့ မရပါဘူး။ ဒီ administration commands တွေ လိုအပ်ရင် — primary ပေါ်မှာ လုပ်ဆောင်သင့်ပြီး — နောက်ဆုံးမှာတော့ အဲဒီ ပြောင်းလဲမှုတွေက standby ဆီ ပျံ့နှံ့ ရောက်ရှိသွားပါလိမ့်မယ်။

`pg_cancel_backend()` နဲ့ `pg_terminate_backend()` တို့က user backends (user backend များ) တွေပေါ်မှာတော့ အလုပ်လုပ်ပါလိမ့်မယ် — ဒါပေမယ့် — recovery ကို လုပ်ဆောင်တဲ့ startup process (စတင်ခြင်း process) ပေါ်မှာတော့ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။ `pg_stat_activity` က recovery လုပ်နေတဲ့ transactions တွေကို active အဖြစ် ပြသမှာ မဟုတ်ပါဘူး။ ရလဒ်အနေနဲ့ — recovery အတွင်း `pg_prepared_xacts` က အမြဲတမ်း ဗလာ ဖြစ်နေပါတယ်။ သံသယဖြစ်ဖွယ် (in-doubt) prepared transactions တွေကို ဖြေရှင်းချင်ရင် — primary ပေါ်မှာ `pg_prepared_xacts` ကို ကြည့်ပြီး — အဲဒီမှာ transactions တွေကို ဖြေရှင်းဖို့ commands တွေ ထုတ်ပေးပါ ဒါမှမဟုတ် — recovery ပြီးဆုံးပြီးနောက်မှာ ဖြေရှင်းပါ။

`pg_locks` က — ပုံမှန်အတိုင်း — backends တွေ ကိုင်ထားတဲ့ locks တွေကို ပြသပါလိမ့်မယ်။ `pg_locks` က — recovery က replay လုပ်နေတဲ့ transactions တွေ ကိုင်ထားတဲ့ `AccessExclusiveLocks` တွေ အားလုံးကို ပိုင်ဆိုင်တဲ့ — startup process က စီမံခန့်ခွဲတဲ့ virtual transaction (virtual transaction — စိတ်ကူးယဉ် transaction) တစ်ခုကိုလည်း ပြသပါတယ်။ Startup process က database ပြောင်းလဲမှုတွေ လုပ်ဖို့ locks တွေကို ရယူတာ မဟုတ်လို့ — `AccessExclusiveLocks` ကလွဲပြီး တခြား locks တွေက Startup process အတွက် `pg_locks` ထဲမှာ ပေါ်မလာဘူးဆိုတာ သတိပြုပါ; အဲဒါတွေက တည်ရှိတယ်လို့ ယူဆထားရုံပဲ ဖြစ်ပါတယ်။

Nagios plugin check_pgsql က အလုပ်လုပ်ပါလိမ့်မယ် — အကြောင်းကတော့ သူ စစ်ဆေးတဲ့ ရိုးရှင်းတဲ့ အချက်အလက်တွေက တည်ရှိနေလို့ပါ။ check_postgres monitoring script ကလည်း အလုပ်လုပ်ပါလိမ့်မယ် — သတင်းပို့တဲ့ တန်ဖိုးတချို့က မတူညီတဲ့ ဒါမှမဟုတ် ရှုပ်ထွေးစေတဲ့ ရလဒ်တွေကို ပေးနိုင်ပေမယ့်ပါ။ ဥပမာ — standby ပေါ်မှာ vacuum လုပ်တာ မရှိတာမို့ — နောက်ဆုံး vacuum လုပ်ချိန် (last vacuum time) ကို ထိန်းသိမ်းထားမှာ မဟုတ်ပါဘူး။ Primary ပေါ်မှာ run လုပ်နေတဲ့ vacuums တွေက သူတို့ရဲ့ ပြောင်းလဲမှုတွေကို standby ဆီ ပို့ပေးနေဆဲ ဖြစ်ပါတယ်။

WAL file control commands တွေက recovery အတွင်း အလုပ်လုပ်မှာ မဟုတ်ပါဘူး — ဥပမာ — `pg_backup_start`, `pg_switch_wal` စသဖြင့်။

Dynamically loadable modules (ရွေ့လျား တင်သွင်းနိုင်သော modules) တွေက `pg_stat_statements` အပါအဝင် အလုပ်လုပ်ပါတယ်။

Advisory locks (အကြံပေး locks) တွေက deadlock detection (deadlock ရှာဖွေ စစ်ဆေးမှု) အပါအဝင် — recovery မှာ ပုံမှန်အတိုင်း အလုပ်လုပ်ပါတယ်။ Advisory locks တွေက ဘယ်တော့မှ WAL-logged မဟုတ်လို့ — primary ဒါမှမဟုတ် standby ပေါ်က advisory lock တစ်ခုက WAL replay နဲ့ conflict ဖြစ်ဖို့ မဖြစ်နိုင်ဘူးဆိုတာ သတိပြုပါ။ Primary ပေါ်မှာ advisory lock တစ်ခု ရယူပြီး — standby ပေါ်မှာ အလားတူ advisory lock တစ်ခုကို စတင်ပေးဖို့လည်း မဖြစ်နိုင်ပါဘူး။ Advisory locks တွေက — သူတို့ကို ရယူထားတဲ့ server နဲ့ပဲ ဆက်စပ်ပါတယ်။

Slony, Londiste နဲ့ Bucardo လို trigger-based replication systems (trigger အခြေပြု replication စနစ်များ) တွေက standby ပေါ်မှာ လုံးဝ run လို့ မရပါဘူး — ပြောင်းလဲမှုတွေကို apply လုပ်ဖို့ standby servers တွေဆီ မပို့သရွေ့ — primary server ပေါ်မှာတော့ သူတို့ ပျော်ရွှင်စွာ run လုပ်နိုင်ပါတယ်။ WAL replay က trigger-based မဟုတ်လို့ — ထပ်ဆောင်း database writes တွေ လိုအပ်တဲ့ ဒါမှမဟုတ် — triggers တွေရဲ့ အသုံးပြုမှုပေါ်မှာ မှီခိုနေတဲ့ — ဘယ် system ဆီမှပဲ ဖြစ်ဖြစ် — standby ကနေ relay (ထပ်ဆင့် ပို့ဆောင်) လုပ်လို့ မရပါဘူး။

OIDs အသစ်တွေကို သတ်မှတ်ပေးလို့ မရပါဘူး — database ဆီ status အသစ် ရေးသားတာပေါ်မှာ မှီခိုမှု မရှိသရွေ့ — UUID generators (UUID ထုတ်လုပ်သူများ) တချို့ကတော့ အလုပ်လုပ်နေနိုင်ပါသေးတယ်။

လက်ရှိမှာ — read-only transactions အတွင်း temporary table (ယာယီ ဇယား) ဖန်တီးမှုကို ခွင့်မပြုသေးလို့ — တချို့ အခြေအနေတွေမှာ ရှိပြီးသား scripts တွေ မှန်ကန်စွာ run လို့ မရနိုင်ပါဘူး။ ဒီကန့်သတ်ချက်ကို နောက်ပိုင်း release တစ်ခုမှာ ဖြေလျှော့ပေးနိုင်ပါတယ်။ ဒါက SQL standard နဲ့ လိုက်လျောညီထွေမှု ဆိုင်ရာ ကိစ္စတစ်ခုရော — နည်းပညာဆိုင်ရာ ကိစ္စတစ်ခုပါ ဖြစ်ပါတယ်။

`DROP TABLESPACE` က tablespace က ဗလာ ဖြစ်နေမှသာ အောင်မြင်နိုင်ပါတယ်။ Standby users တချို့က သူတို့ရဲ့ `temp_tablespaces` parameter ကတစ်ဆင့် အဲဒီ tablespace ကို တက်ကြွစွာ သုံးနေနိုင်ပါတယ်။ Tablespace ထဲမှာ temporary files တွေ ရှိနေရင် — temporary files တွေ ဖယ်ရှားခံရတာ သေချာစေဖို့ — active queries တွေ အားလုံးကို cancel လုပ်ပါတယ် — ဒါမှ tablespace ကို ဖယ်ရှားလို့ ရပြီး — WAL replay က ဆက်လက် လုပ်ဆောင်နိုင်မှာ ဖြစ်ပါတယ်။

Primary ပေါ်မှာ `DROP DATABASE` ဒါမှမဟုတ် `ALTER DATABASE ... SET TABLESPACE` run လုပ်တာက — standby ပေါ်မှာ အဲဒီ database ဆီ connect လုပ်ထားတဲ့ users တွေ အားလုံးကို အတင်းအကျပ် ချိတ်ဆက် ဖြုတ်ပစ်စေမယ့် WAL entry တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။ ဒီလုပ်ဆောင်ချက်က — `max_standby_streaming_delay` ရဲ့ setting ဘာပဲ ဖြစ်ဖြစ် — ချက်ချင်း ဖြစ်ပေါ်ပါတယ်။ `ALTER DATABASE ... RENAME` ကတော့ users တွေကို ချိတ်ဆက် ဖြုတ်မပေးဘူးဆိုတာ သတိပြုပါ — အဲဒါက အများစုမှာ သတိမထားမိနိုင်ပေမယ့် — တချို့ အခြေအနေတွေမှာ program တစ်ခုက database name ပေါ်မှာ တစ်နည်းနည်းနဲ့ မှီခိုနေရင် — confusion (ရှုပ်ထွေးမှု) ဖြစ်စေနိုင်ပါတယ်။

ပုံမှန် (recovery မဟုတ်တဲ့) mode မှာ — login လုပ်နိုင်စွမ်း ရှိတဲ့ role တစ်ခုအတွက် `DROP USER` ဒါမှမဟုတ် `DROP ROLE` ကို — အဲဒီ user connect လုပ်ထားဆဲ အချိန်မှာ ထုတ်ပေးရင် — connect လုပ်ထားတဲ့ user ကို ဘာမှ မဖြစ်ပါဘူး — သူတို့ connect ဖြစ်နေဆဲပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — user က ပြန်လည် connect လုပ်လို့တော့ မရပါဘူး။ ဒီအပြုအမူက recovery မှာလည်း သက်ဆိုင်လို့ — primary ပေါ်က `DROP USER` တစ်ခုက standby ပေါ်က အဲဒီ user ကို ချိတ်ဆက် ဖြုတ်ပစ်မှာ မဟုတ်ပါဘူး။

Cumulative statistics system (စုပေါင်း statistics စနစ်) က recovery အတွင်း သက်ဝင် နေပါတယ်။ Scans တွေ၊ reads တွေ၊ blocks တွေ၊ index usage (index အသုံးပြုမှု) စတာတွေ အားလုံးကို standby ပေါ်မှာ ပုံမှန်အတိုင်း မှတ်တမ်းတင်ပါလိမ့်မယ်။ ဒါပေမယ့် — WAL replay က relation နဲ့ database သီးခြား counters တွေကိုတော့ တိုးမြှင့်ပေးမှာ မဟုတ်ပါဘူး။ ဆိုလိုတာက — replay က `pg_stat_all_tables` ရဲ့ columns တွေကို (`n_tup_ins` လိုမျိုး) တိုးမြှင့်ပေးမှာ မဟုတ်သလို — startup process က လုပ်ဆောင်တဲ့ reads ဒါမှမဟုတ် writes တွေကို `pg_statio_` views တွေထဲမှာ ခြေရာခံမှာ မဟုတ်ဘဲ — ဆက်စပ်တဲ့ `pg_stat_database` columns တွေလည်း တိုးမြှင့်ခံရမှာ မဟုတ်ပါဘူး။

Autovacuum က recovery အတွင်း သက်ဝင် မနေပါဘူး။ Recovery ပြီးဆုံးချိန်မှာ ပုံမှန်အတိုင်း စတင်ပါလိမ့်မယ်။

Checkpointer process နဲ့ background writer process တွေက recovery အတွင်း သက်ဝင် နေပါတယ်။ Checkpointer process က restartpoints (restartpoint — primary ပေါ်က checkpoints တွေနဲ့ ဆင်တူသော အမှတ်များ) တွေကို လုပ်ဆောင်ပြီး — background writer process က ပုံမှန် block cleaning (block သန့်ရှင်းရေး) လုပ်ဆောင်ချက်တွေကို လုပ်ဆောင်ပါလိမ့်မယ်။ ဒါက standby server ပေါ်မှာ သိမ်းဆည်းထားတဲ့ hint bit အချက်အလက်တွေရဲ့ updates တွေ ပါဝင်နိုင်ပါတယ်။ `CHECKPOINT` command ကို recovery အတွင်း လက်ခံပါတယ် — ဒါပေမယ့် — checkpoint အသစ် တစ်ခုထက် — restartpoint တစ်ခုကိုပဲ လုပ်ဆောင်ပါတယ်။

### 26.4.4. Hot Standby Parameter Reference (Hot Standby parameter ရည်ညွှန်း စာရင်း)

Parameters အမျိုးမျိုးကို အပေါ်မှာ [အပိုင်း 26.4.2](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-CONFLICT) နဲ့ [အပိုင်း 26.4.3](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN) တို့မှာ ဖော်ပြခဲ့ပြီး ဖြစ်ပါတယ်။

Primary ပေါ်မှာ [wal_level](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL) parameter ကို သုံးနိုင်ပါတယ်။ [max_standby_archive_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY) နဲ့ [max_standby_streaming_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY) တို့က primary ပေါ်မှာ သတ်မှတ်ထားရင် ဘာ သက်ရောက်မှုမှ မရှိပါဘူး။

Standby ပေါ်မှာ [hot_standby](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-HOT-STANDBY)၊ [max_standby_archive_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY) နဲ့ [max_standby_streaming_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY) parameters တွေကို သုံးနိုင်ပါတယ်။

### 26.4.5. Caveats (သတိပြုရန် အချက်များ)

Hot standby မှာ ကန့်သတ်ချက် အများအပြား ရှိပါတယ်။ ဒါတွေကို အနာဂတ် releases တွေမှာ ပြုပြင်နိုင်ပြီး — ပြုပြင်ဖို့ ဖြစ်နိုင်ခြေ များပါတယ်:

- Snapshots တွေ မယူခင် — run လုပ်နေတဲ့ transactions တွေရဲ့ အပြည့်အဝ အသိပညာ လိုအပ်ပါတယ်။ Subtransactions အများအပြား (လက်ရှိတွင် 64 ထက် ပိုတဲ့) သုံးတဲ့ transactions တွေက — အကြာဆုံး run နေတဲ့ write transaction ပြီးဆုံးသည်အထိ — read-only connections တွေရဲ့ စတင်မှုကို နှောင့်နှေးစေပါလိမ့်မယ်။ ဒီအခြေအနေ ဖြစ်ပေါ်ခဲ့ရင် — ရှင်းပြချက် messages တွေကို server log ဆီ ပို့ပေးပါလိမ့်မယ်။
- Standby queries တွေအတွက် valid (အသုံးပြုနိုင်သော) starting points (စတင်မှတ်များ) တွေကို primary ပေါ်မှာ checkpoint တစ်ခုချင်းစီမှာ ထုတ်ပေးပါတယ်။ Primary က shutdown (ပိတ်ထား) အခြေအနေမှာ ရှိနေတုန်း — standby ကို shut down လုပ်လိုက်ရင် — primary က WAL logs ထဲမှာ နောက်ထပ် starting points တွေ ထုတ်ပေးတဲ့အထိ — primary ကို ပြန်စတင်ပြီးမှသာ — hot standby ကို ပြန်လည် ဝင်ရောက်နိုင်ဖို့ ဖြစ်နိုင်မှာ မဟုတ်ပါဘူး။ ဒီအခြေအနေက ဖြစ်ပွားနိုင်တဲ့ အဖြစ်အများဆုံး အခြေအနေတွေမှာ ပြဿနာ မဟုတ်ပါဘူး။ ယေဘုယျအားဖြင့် — primary ကို shut down လုပ်ပြီး နောက်ထပ် မရနိုင်တော့ဘူးဆိုရင် — အဲဒါက ဖွယ်ရှု — standby ကို primary အသစ် အဖြစ် လည်ပတ်ဖို့ ပြောင်းလဲဖို့ လိုအပ်စေမယ့် — ပြင်းထန်တဲ့ failure (ကျရှုံးမှု) တစ်ခုကြောင့် ဖြစ်နိုင်ခြေ များပါတယ်။ Primary ကို ရည်ရွယ်ချက်ရှိရှိ ဖြုတ်ချနေတဲ့ အခြေအနေတွေမှာလည်း — standby က primary အသစ် ဖြစ်လာအောင် ချောမွေ့စွာ သေချာစေဖို့ ညှိနှိုင်း ဆောင်ရွက်တာက စံလုပ်ထုံးလုပ်နည်း (standard procedure) တစ်ခုလည်း ဖြစ်ပါတယ်။
- Recovery ရဲ့ အဆုံးမှာ — prepared transactions တွေ ကိုင်ထားတဲ့ AccessExclusiveLocks တွေက — lock table entries (lock ဇယား ထည့်သွင်းမှုများ) ရဲ့ ပုံမှန် အရေအတွက်ရဲ့ နှစ်ဆ လိုအပ်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် AccessExclusiveLocks တွေ ယူလေ့ ရှိတဲ့ — concurrent prepared transactions အများအပြား run လုပ်ဖို့ စီစဉ်ထားရင် ဒါမှမဟုတ် — AccessExclusiveLocks အများအပြား ယူတဲ့ transaction ကြီးတစ်ခု ထားရှိဖို့ စီစဉ်ထားရင် — `max_locks_per_transaction` ရဲ့ တန်ဖိုး ပိုကြီးတစ်ခု — primary server ပေါ်က parameter ရဲ့ တန်ဖိုးရဲ့ နှစ်ဆလောက်အထိ — ရွေးချယ်ဖို့ အကြံပြုပါတယ်။ သင့်ရဲ့ `max_prepared_transactions` setting က 0 ဆိုရင်တော့ — ဒါကို လုံးဝ စဉ်းစားဖို့ မလိုပါဘူး။
- Serializable transaction isolation level (transaction သီးခြားထားမှု အဆင့်) က hot standby မှာ အခုချိန်အထိ မရရှိနိုင်သေးပါဘူး။ (အသေးစိတ်အတွက် Section 13.2.3 နဲ့ Section 13.4.1 ကို ကြည့်ပါ။) Hot standby mode မှာ transaction တစ်ခုကို serializable isolation level ဆီ သတ်မှတ်ဖို့ ကြိုးစားရင် error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။
