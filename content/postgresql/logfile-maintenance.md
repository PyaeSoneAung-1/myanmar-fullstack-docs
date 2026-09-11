---
title: "Log File Maintenance (log file ထိန်းသိမ်းခြင်း)"
description: "PostgreSQL server log များ ထိန်းသိမ်းခြင်း — log output သိမ်းဆည်းခြင်း၏ အရေးပါမှုနှင့် log file rotation နည်းလမ်းများ (logging_collector, logrotate, rotatelogs, syslog)၊ log ဖိုင်ဟောင်းများ ဖျက်ပစ်ခြင်းနှင့် pgBadger, check_postgres ကဲ့သို့သော log analysis tools များအကြောင်း"
order: 189
source: "https://www.postgresql.org/docs/current/logfile-maintenance.html"
status: translated
updated: 2026-09-06
---

## 24.3. Log File Maintenance (log file ထိန်းသိမ်းခြင်း)

Database server ရဲ့ log output တွေကို `/dev/null` ကနေတစ်ဆင့် စွန့်ပစ်ရုံသက်သက် မလုပ်ဘဲ — နေရာ တစ်နေရာရာမှာ သိမ်းဆည်းထားတာက အကြံကောင်း တစ်ခု ဖြစ်ပါတယ်။ ပြဿနာတွေကို စစ်ဆေး ဖော်ထုတ်ရာမှာ (diagnosing) log output က အလွန် အဖိုးတန်ပါတယ်။

> **မှတ်ချက်:** Server log မှာ sensitive (ထိလွယ်ရှလွယ်) အချက်အလက်တွေ ပါဝင်နိုင်ပြီး — ဘယ်လို ဒါမှမဟုတ် ဘယ်နေရာမှာ သိမ်းဆည်းထားပါစေ — ဘယ် ဦးတည်ရာဆီ လမ်းကြောင်း ပြောင်းပို့ထားပါစေ — အကာအကွယ် ပေးထားဖို့ လိုအပ်ပါတယ်။ ဥပမာ — DDL statements တချို့မှာ plaintext (ရှင်းလင်းသော စာသား) စကားဝှက်တွေ ဒါမှမဟုတ် တခြား authentication အသေးစိတ် အချက်အလက်တွေ ပါဝင်နိုင်ပါတယ်။ `ERROR` level မှာ log လုပ်ထားတဲ့ statements တွေက applications တွေရဲ့ SQL source code တွေကို ပြသနိုင်ပြီး — data rows တွေရဲ့ အစိတ်အပိုင်း တချို့လည်း ပါဝင်နိုင်ပါတယ်။ Data, events နဲ့ ဆက်စပ် အချက်အလက်တွေကို မှတ်တမ်း တင်ခြင်းက ဒီ facility (ဆောင်ရွက်ပေးမှု ယန္တရား) ရဲ့ ရည်ရွယ်ထားတဲ့ လုပ်ဆောင်ချက် ဖြစ်လို့ — ဒါက ပေါက်ကြားမှု (leakage) ဒါမှမဟုတ် bug တစ်ခု မဟုတ်ပါဘူး။ Server logs တွေကို သင့်လျော်စွာ အခွင့်အာဏာ ရှိသူတွေပဲ မြင်နိုင်အောင် သေချာ ဆောင်ရွက်ပါ။

Log output တွေက များပြားလေ့ ရှိပါတယ် (အထူးသဖြင့် debug levels (အမှားရှာ ပြင်ဆင်မှု အဆင့်များ) မြင့်မားတဲ့အခါ) — ဒါကြောင့် — သူတို့ကို အကန့်အသတ် မဲ့ အချိန်ကြာအောင် သိမ်းထားချင်စရာ မလိုပါဘူး။ Log file အသစ်တွေ စတင်ဖို့ နဲ့ — သင့်တင့်တဲ့ အချိန် ကာလတစ်ခု ပြီးနောက် — အဟောင်းတွေကို ဖယ်ရှားဖို့အတွက် — log files တွေကို rotate (လှည့်ပတ် အစားထိုး) လုပ်ဖို့ လိုအပ်ပါတယ်။

`postgres` ရဲ့ stderr ကို ဖိုင် တစ်ဖိုင်ထဲကို ရိုးရှင်းစွာ ညွှန်ကြားလိုက်ရုံနဲ့ — log output ရပါတယ် — ဒါပေမယ့် — log file ကို truncate (ဖြတ်တောက်) လုပ်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက server ကို ရပ်တန့်ပြီး ပြန်စတင်ခြင်းပဲ ဖြစ်ပါတယ်။ Development environment (တီထွင် စမ်းသပ်သည့် ပတ်ဝန်းကျင်) တစ်ခုမှာ PostgreSQL သုံးနေတယ်ဆိုရင် ဒါက လက်ခံနိုင်ပေမယ့် — production servers တွေကတော့ ဒီအပြုအမူကို လက်ခံနိုင်ကြတာ ရှားပါလိမ့်မယ်။

ပိုကောင်းတဲ့ နည်းလမ်းတစ်ခုကတော့ — server ရဲ့ stderr output ကို log rotation program (log ဖိုင် လှည့်ပတ် အစားထိုးသည့် ပရိုဂရမ်) တစ်မျိုးမျိုးဆီ ပို့ပေးတာ ဖြစ်ပါတယ်။ Built-in log rotation facility (ထည့်သွင်း တပ်ဆင်ပြီးသား log rotation ယန္တရား) တစ်ခု ရှိပြီး — `postgresql.conf` ထဲမှာ `logging_collector` configuration parameter ကို `true` လို့ သတ်မှတ်ခြင်းအားဖြင့် သုံးနိုင်ပါတယ်။ ဒီ program ရဲ့ ထိန်းချုပ်မှု parameters တွေကို [အပိုင်း 19.8.1](https://www.postgresql.org/docs/current/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE) မှာ ဖော်ပြထားပါတယ်။ ဒီနည်းလမ်းကို သုံးပြီး — log data တွေကို machine-readable (စက်ဖြင့် ဖတ်နိုင်သော) CSV (comma-separated values) format နဲ့လည်း ဖမ်းယူနိုင်ပါတယ်။

တနည်းအားဖြင့် — တခြား server software တွေနဲ့ သုံးနေပြီးသား external log rotation program (ပြင်ပ log rotation ပရိုဂရမ်) တစ်ခု ရှိရင် — အဲဒါကို သုံးချင်စိတ် ဖြစ်နိုင်ပါတယ်။ ဥပမာ — Apache distribution ထဲမှာ ပါဝင်တဲ့ rotatelogs tool ကို PostgreSQL နဲ့ သုံးနိုင်ပါတယ်။ ဒါကို လုပ်ဖို့ နည်းလမ်း တစ်ခုက — server ရဲ့ stderr output ကို လိုချင်တဲ့ program ဆီ pipe (ပိုက်လိုင်း ဆက်သွယ်) လုပ်ခြင်း ဖြစ်ပါတယ်။ Server ကို `pg_ctl` နဲ့ စတင်မယ်ဆိုရင် — stderr က stdout ဆီ redirect (လမ်းကြောင်း ပြောင်း) လုပ်ပြီးသား ဖြစ်လို့ — pipe command တစ်ခုပဲ လိုပါတယ် — ဥပမာ:

```sql
pg_ctl start | rotatelogs /var/log/pgsql_log 86400
```

ဒီနည်းလမ်းတွေကို ပေါင်းစပ်ဖို့ဆိုရင် — PostgreSQL ရဲ့ built-in logging collector က ထုတ်လုပ်တဲ့ log files တွေကို စုဆောင်းဖို့ logrotate ကို တပ်ဆင် သတ်မှတ်နိုင်ပါတယ်။ ဒီကိစ္စမှာ — logging collector က log files တွေရဲ့ နာမည်တွေနဲ့ တည်နေရာကို သတ်မှတ်ပြီး — logrotate ကတော့ ဒီဖိုင်တွေကို အခါအားလျော်စွာ archive (မော်ကွန်း သိမ်းဆည်း) လုပ်ပေးပါတယ်။ Log rotation ကို စတင်တဲ့အခါ — logrotate က application က နောက်ထပ် output တွေကို ဖိုင်အသစ်ဆီ ပို့ဆောင်ကြောင်း သေချာ စေရပါတယ်။ ဒါကို — application ဆီ `SIGHUP` signal ပို့ပြီး — application က log file ကို ပြန်လည် ဖွင့်ပေးတဲ့ — `postrotate` script တစ်ခုနဲ့ ပုံမှန်အားဖြင့် လုပ်ဆောင်ပါတယ်။ PostgreSQL မှာတော့ — အဲဒီအစား — `pg_ctl` ကို `logrotate` option နဲ့ run နိုင်ပါတယ်။ Server က ဒီ command ကို လက်ခံရရှိတဲ့အခါ — logging configuration ပေါ် မူတည်ပြီး — log file အသစ်တစ်ခုဆီ ပြောင်းတာ ဒါမှမဟုတ် — ရှိပြီးသား ဖိုင်ကို ပြန်လည် ဖွင့်တာ လုပ်ပါတယ် ([အပိုင်း 19.8.1](https://www.postgresql.org/docs/current/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE) ကို ကြည့်ပါ)။

> **မှတ်ချက်:** Static log file names (ပုံသေ log file နာမည်များ) သုံးနေတဲ့အခါ — max open file limit (တစ်ပြိုင်နက် ဖွင့်နိုင်သော ဖိုင် အများဆုံး ကန့်သတ်ချက်) ကို ရောက်ရှိသွားရင် ဒါမှမဟုတ် file table overflow (ဖိုင် ဇယား ပြည့်လျှံမှု) ဖြစ်ရင် — server က log file ကို ပြန်လည် ဖွင့်ဖို့ ပျက်ကွက်နိုင်ပါတယ်။ ဒီအခြေအနေမှာ — log rotation တစ်ခု အောင်မြင်သည်အထိ — log messages တွေကို log file အဟောင်းဆီ ပို့နေပါတယ်။ Logrotate ကို log file ကို compress (ချုံ့) ပြီး ဖျက်ပစ်ဖို့ configure လုပ်ထားရင် — server က ဒီအချိန် ကာလအတွင်း log လုပ်ထားတဲ့ messages တွေ ဆုံးရှုံးသွားနိုင်ပါတယ်။ ဒီပြဿနာကို ရှောင်ဖို့ — logging collector ကို log file နာမည်တွေကို dynamically (ပြောင်းလဲနေတဲ့ ပုံစံနဲ့) သတ်မှတ်ပေးဖို့ configure လုပ်ပြီး — open ဖြစ်နေတဲ့ log files တွေကို လျစ်လျူရှုဖို့ `prerotate` script တစ်ခု သုံးနိုင်ပါတယ်။

Log output ကို စီမံခန့်ခွဲဖို့ နောက်ထပ် production-grade (production အဆင့်) နည်းလမ်း တစ်ခုကတော့ — syslog ဆီ ပို့ပြီး — file rotation ကို syslog ကိုယ်တိုင် ကိုင်တွယ်ဖို့ လုပ်တာ ဖြစ်ပါတယ်။ ဒါကို လုပ်ဖို့ — `postgresql.conf` ထဲမှာ `log_destination` configuration parameter ကို `syslog` လို့ သတ်မှတ်ပါ (syslog ကိုပဲ log လုပ်ဖို့)။ ပြီးရင် — log file အသစ်တစ်ခု စတင် ရေးသားဖို့ အတင်းအကျပ် လုပ်ချင်တဲ့အခါတိုင်း — syslog daemon ဆီ `SIGHUP` signal ပို့နိုင်ပါတယ်။ Log rotation ကို အလိုအလျောက် လုပ်ချင်ရင် — syslog ရဲ့ log files တွေနဲ့ အလုပ်လုပ်ဖို့ logrotate program ကို configure လုပ်နိုင်ပါတယ်။

ဒါပေမယ့် — system အများအပြားမှာ syslog က သိပ် စိတ်ချရတာ မဟုတ်ပါဘူး — အထူးသဖြင့် — log message ကြီးကြီးတွေနဲ့ဆိုရင် ပိုဆိုးပါတယ်; သူတို့ကို အလိုအပ်ဆုံး အချိန်မှာပဲ — messages တွေကို ဖြတ်တောက်ပစ်တာ ဒါမှမဟုတ် လွှင့်ပစ်တာ ဖြစ်နိုင်ပါတယ်။ ထို့ပြင် — Linux ပေါ်မှာ — syslog က message တစ်ခုချင်းစီကို disk ပေါ် flush (သွင်း) လုပ်တာမို့ — performance ညံ့ဖျင်းစေပါတယ်။ (Syslog configuration file ထဲက file name ရဲ့ အစမှာ “-” တစ်ခု သုံးပြီး syncing (ထပ်တူပြု ရေးသားခြင်း) ကို disable လုပ်နိုင်ပါတယ်။)

အပေါ်မှာ ဖော်ပြထားတဲ့ ဖြေရှင်းနည်း အားလုံးက — configurable intervals (သတ်မှတ် ပြင်ဆင်နိုင်တဲ့ ကြားကာလများ) နဲ့ log file အသစ်တွေ စတင်ခြင်းကိုပဲ ဂရုစိုက်ပြီး — အသုံးမလိုတော့တဲ့ log file အဟောင်းတွေကို ဖျက်ပစ်ခြင်းကိုတော့ ကိုင်တွယ် မပေးဘူးဆိုတာ သတိပြုပါ။ Log file အဟောင်းတွေကို အခါအားလျော်စွာ ဖျက်ပစ်ဖို့ batch job (အလိုအလျောက် လုပ်ဆောင်သည့် အလုပ်အစု) တစ်ခု တပ်ဆင်ချင်ဖွယ် ရှိပါတယ်။ နောက်ထပ် ဖြစ်နိုင်ခြေ တစ်ခုကတော့ — log file အဟောင်းတွေကို စက်ဝိုင်းပုံ သံသရာအလိုက် ပြန်လည် မှတ်တမ်းရေး (cyclically overwritten) ဖြစ်အောင် rotation program ကို configure လုပ်တာ ဖြစ်ပါတယ်။

[pgBadger](https://pgbadger.darold.net/) က — ဆန်းပြား နက်ရှိုင်းတဲ့ log file analysis (log ဖိုင် ခွဲခြမ်းစိတ်ဖြာ လေ့လာမှု) တွေ လုပ်ပေးတဲ့ external project (ပြင်ပ ပရောဂျက်) တစ်ခု ဖြစ်ပါတယ်။ [check_postgres](https://bucardo.org/check_postgres/) ကတော့ — log files တွေထဲမှာ အရေးကြီးတဲ့ messages တွေ ပေါ်လာတဲ့အခါ Nagios alerts (Nagios သတိပေးချက်များ) တွေ ပေးပို့ပေးပြီး — တခြား ထူးခြားတဲ့ အခြေအနေ အများအပြားကိုလည်း ရှာဖွေ ဖော်ထုတ်ပေးပါတယ်။
