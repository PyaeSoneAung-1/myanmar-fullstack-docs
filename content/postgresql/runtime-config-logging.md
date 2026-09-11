---
title: "Error Reporting and Logging (error အစီရင်ခံခြင်းနှင့် logging)"
description: "PostgreSQL ၏ error အစီရင်ခံခြင်းနှင့် logging configuration parameter များ — log destination များ၊ log လုပ်သည့်အချိန်၊ log ထည့်မည့် အကြောင်းအရာ၊ CSV/JSON format log output နှင့် process title သတ်မှတ်ခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 163
source: "https://www.postgresql.org/docs/current/runtime-config-logging.html"
status: translated
updated: 2026-09-11
---

## 19.8. Error Reporting and Logging (error အစီရင်ခံခြင်းနှင့် logging)

- **19.8.1. Where to Log (log ကို ဘယ်မှာ သိမ်းမလဲ)**
- **19.8.2. When to Log (log ကို ဘယ်အချိန် သိမ်းမလဲ)**
- **19.8.3. What to Log (log မှာ ဘာ သိမ်းမလဲ)**
- **19.8.4. Using CSV-Format Log Output (CSV format log output ကို အသုံးပြုခြင်း)**
- **19.8.5. Using JSON-Format Log Output (JSON format log output ကို အသုံးပြုခြင်း)**
- **19.8.6. Process Title (process ခေါင်းစဉ်)**

### 19.8.1. Where to Log (log ကို ဘယ်မှာ သိမ်းမလဲ)

- **log_destination (string)** — PostgreSQL က server message တွေကို log လုပ်ဖို့ နည်းလမ်း အများအပြားကို ထောက်ပံ့ပါတယ် — ၎င်းတို့မှာ stderr, csvlog, jsonlog နဲ့ syslog တို့ ပါဝင်ပြီး Windows မှာတော့ eventlog ကိုလည်း ထောက်ပံ့ပါတယ်။ ဒီ parameter ကို comma နဲ့ ခွဲထားတဲ့ လိုချင်တဲ့ log destination စာရင်းတစ်ခုအဖြစ် သတ်မှတ်ပါ။ Default ကတော့ stderr တစ်ခုတည်းကို log လုပ်တာပါ။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
`csvlog` ကို `log_destination` ထဲမှာ ထည့်ထားရင် — log entry တွေကို “comma-separated value” (CSV) format နဲ့ ထုတ်ပေးပြီး — log တွေကို program တွေထဲ load လုပ်ရာမှာ အဆင်ပြေစေပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 19.8.4](/docs/postgresql/runtime-config-logging) ကို ကြည့်ပါ။ CSV-format log output ရဖို့ `logging_collector` ကို enable လုပ်ထားရပါမယ်။
`jsonlog` ကို `log_destination` ထဲမှာ ထည့်ထားရင် — log entry တွေကို JSON format နဲ့ ထုတ်ပေးပြီး — log တွေကို program တွေထဲ load လုပ်ရာမှာ အဆင်ပြေစေပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 19.8.5](/docs/postgresql/runtime-config-logging) ကို ကြည့်ပါ။ JSON-format log output ရဖို့ `logging_collector` ကို enable လုပ်ထားရပါမယ်။
stderr, csvlog ဒါမှမဟုတ် jsonlog တစ်ခုခု ပါဝင်တဲ့အခါ — `current_logfiles` file ကို ဖန်တီးပြီး — logging collector က လက်ရှိ အသုံးပြုနေတဲ့ log file(s) ရဲ့ တည်နေရာနဲ့ ဆက်စပ်နေတဲ့ logging destination ကို မှတ်တမ်းတင်ပါတယ်။ ဒါက instance က လက်ရှိ အသုံးပြုနေတဲ့ log တွေကို ရှာဖွေဖို့ အဆင်ပြေတဲ့ နည်းလမ်း တစ်ခု ပေးပါတယ်။ ဒီ file ရဲ့ အကြောင်းအရာ ဥပမာက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

stderr log/postgresql.log
csvlog log/postgresql.csv
jsonlog log/postgresql.json

`current_logfiles` ကို — rotation ရဲ့ အကျိုးဆက်အနေနဲ့ log file အသစ် ဖန်တီးတဲ့အခါနဲ့ — `log_destination` ကို reload လုပ်တဲ့အခါ — ပြန်လည် ဖန်တီးပါတယ်။ stderr, csvlog ဒါမှမဟုတ် jsonlog တစ်ခုမှ `log_destination` ထဲ မပါဝင်တဲ့အခါနဲ့ — logging collector ကို disable လုပ်တဲ့အခါ — ဒါကို ဖျက်ပစ်ပါတယ်။

> **မှတ်ချက်:** Unix system အများစုမှာ — `log_destination` အတွက် syslog option ကို အသုံးပြုနိုင်ဖို့ — သင့် system ရဲ့ syslog daemon configuration ကို ပြင်ဆင်ရန် လိုအပ်ပါလိမ့်မယ်။ PostgreSQL က syslog facility တွေဖြစ်တဲ့ LOCAL0 ကနေ LOCAL7 အထိ log လုပ်နိုင်ပါတယ် (`syslog_facility` ကို ကြည့်ပါ) — ဒါပေမယ့် platform အများစုမှာ default syslog configuration က အဲဒီလို message အားလုံးကို စွန့်ပစ်ပါတယ်။ အောက်ပါကဲ့သို့ တစ်ခုခု ထည့်ရန် လိုအပ်ပါလိမ့်မယ်:
>
> local0.*    /var/log/postgresql
>
> syslog daemon ရဲ့ configuration file ထဲကို ဒါကို ထည့်မှ အလုပ်လုပ်ပါလိမ့်မယ်။
> Windows မှာ — `log_destination` အတွက် eventlog option ကို သုံးတဲ့အခါ — Windows Event Viewer က event log message တွေကို သန့်ရှင်းစွာ ပြနိုင်ဖို့ — event source တစ်ခုနဲ့ သူ့ library ကို operating system နဲ့ register လုပ်သင့်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 18.12](/docs/postgresql/event-log-registration) ကို ကြည့်ပါ။

- **logging_collector (boolean)** — ဒီ parameter က logging collector ကို enable လုပ်ပါတယ် — ၎င်းက stderr ဆီ ပို့တဲ့ log message တွေကို ဖမ်းယူပြီး log file တွေထဲ ပြန်လည် လမ်းကြောင်းလွှဲ (redirect) ပေးတဲ့ background process တစ်ခု ဖြစ်ပါတယ်။ ဒီနည်းလမ်းက syslog ဆီ log လုပ်တာထက် များသောအားဖြင့် ပိုအသုံးဝင်ပါတယ် — အကြောင်းကတော့ message အမျိုးအစား တချို့က syslog output မှာ ပေါ်မလာနိုင်လို့ပါ။ (အသုံးများတဲ့ ဥပမာ တစ်ခုက dynamic-linker failure message တွေဖြစ်ပြီး၊ နောက်တစ်ခုက `archive_command` ကဲ့သို့သော script တွေက ထုတ်တဲ့ error message တွေ ဖြစ်ပါတယ်။) ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။

> **မှတ်ချက်:** logging collector ကို မသုံးဘဲ stderr ဆီ log လုပ်နိုင်ပါသေးတယ်; log message တွေက server ရဲ့ stderr လမ်းကြောင်းလွှဲထားတဲ့ နေရာကို ရောက်သွားမှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် ဒီနည်းလမ်းက log ပမာဏ နည်းတဲ့ အခြေအနေမျိုးအတွက်သာ သင့်လျော်ပါတယ် — အကြောင်းကတော့ log file တွေကို rotate လုပ်ဖို့ အဆင်ပြေတဲ့ နည်းလမ်း မပေးလို့ပါ။ ထို့အပြင် platform တချို့မှာ logging collector ကို မသုံးခြင်းက log output ဆုံးရှုံးတာ ဒါမှမဟုတ် ပျက်စီးတာ (garbled) ဖြစ်စေနိုင်ပါတယ် — အကြောင်းကတော့ တစ်ပြိုင်နက် တူညီတဲ့ log file ဆီ ရေးနေတဲ့ process အများအပြားက တစ်ခုနဲ့တစ်ခု output ကို ဖျက်မိနိုင်လို့ပါ။

> **မှတ်ချက်:** logging collector ကို message တစ်ခုမှ မဆုံးရှုံးစေရန် ဒီဇိုင်းလုပ်ထားပါတယ်။ ဆိုလိုတာက — အလွန်များပြားတဲ့ load ရှိချိန်မှာ — collector က နောက်ကျကျန်နေချိန် နောက်ထပ် log message တွေ ပို့ဖို့ ကြိုးစားတဲ့အခါ server process တွေ ပိတ်ဆို့ (blocked) သွားနိုင်ပါတယ်။ ဆန့်ကျင်ဘက်အားဖြင့် syslog ကတော့ message တွေကို ရေးလို့ မရရင် စွန့်ပစ်ဖို့ ရွေးချယ်ပြီး — ဆိုလိုတာက ဒီလို အခြေအနေမျိုးမှာ message တချို့ log မမိဘဲ ဖြစ်နိုင်ပေမယ့် — ကျန်တဲ့ system ကို ပိတ်ဆို့စေမှာ မဟုတ်ပါဘူး။

- **log_directory (string)** — `logging_collector` enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က log file တွေ ဖန်တီးမည့် directory ကို ဆုံးဖြတ်ပါတယ်။ ဒါကို absolute path အဖြစ် ဖြစ်စေ — cluster data directory နဲ့ ဆက်စပ်တဲ့ (relative) path အဖြစ် ဖြစ်စေ သတ်မှတ်နိုင်ပါတယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။ Default က log ဖြစ်ပါတယ်။
- **log_filename (string)** — `logging_collector` enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က ဖန်တီးတဲ့ log file တွေရဲ့ file name ကို သတ်မှတ်ပါတယ်။ တန်ဖိုးကို strftime pattern အဖြစ် သတ်မှတ်ပါတယ် — ဒါကြောင့် အချိန်ပြောင်းလဲမှုအလိုက် file name သတ်မှတ်ဖို့ %-escape တွေကို သုံးနိုင်ပါတယ်။ (time-zone ပေါ် မူတည်တဲ့ %-escape တွေ ရှိရင် — တွက်ချက်မှုကို `log_timezone` က သတ်မှတ်တဲ့ zone မှာ လုပ်ဆောင်ပါတယ် ဆိုတာ သတိပြုပါ။) ထောက်ပံ့တဲ့ %-escape တွေက Open Group ရဲ့ strftime specification မှာ ဖော်ပြထားတာတွေနဲ့ ဆင်တူပါတယ်။ System ရဲ့ strftime ကို တိုက်ရိုက် မသုံးဘူးဆိုတာ သတိပြုပါ — ဒါကြောင့် platform အလိုက် (nonstandard) extension တွေ အလုပ်မလုပ်ပါဘူး။ Default က `postgresql-%Y-%m-%d_%H%M%S.log` ဖြစ်ပါတယ်။
escape မပါတဲ့ file name တစ်ခုကို သတ်မှတ်ရင် — နောက်ဆုံးမှာ disk တစ်ခုလုံး ပြည့်သွားတာကို ရှောင်ရှားဖို့ log rotation utility တစ်ခု သုံးဖို့ စီစဉ်ထားသင့်ပါတယ်။ 8.4 မတိုင်မီ release တွေမှာ — % escape မပါရင် — PostgreSQL က log file အသစ်ရဲ့ ဖန်တီးချိန် epoch ကို ထည့်ပေးခဲ့ပေမယ့် — အခုတော့ အဲဒီလို မဟုတ်တော့ပါဘူး။
`log_destination` မှာ CSV-format output enable ဖြစ်နေရင် — timestamp ပါတဲ့ log file name နောက်မှာ `.csv` ကို ထည့်ပြီး CSV-format output အတွက် file name ကို ဖန်တီးပါတယ်။ (`log_filename` က `.log` နဲ့ ဆုံးရင် — suffix ကို အစားထိုးလိုက်ပါတယ်။)
`log_destination` မှာ JSON-format output enable ဖြစ်နေရင် — timestamp ပါတဲ့ log file name နောက်မှာ `.json` ကို ထည့်ပြီး JSON-format output အတွက် file name ကို ဖန်တီးပါတယ်။ (`log_filename` က `.log` နဲ့ ဆုံးရင် — suffix ကို အစားထိုးလိုက်ပါတယ်။)
ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **log_file_mode (integer)** — Unix system တွေမှာ ဒီ parameter က `logging_collector` enable ဖြစ်နေတဲ့အခါ log file တွေအတွက် permission တွေကို သတ်မှတ်ပါတယ်။ (Microsoft Windows မှာတော့ ဒီ parameter ကို လျစ်လျူရှုပါတယ်။) Parameter တန်ဖိုးက chmod နဲ့ umask system call တွေ လက်ခံတဲ့ format နဲ့ သတ်မှတ်ထားတဲ့ numeric mode တစ်ခု ဖြစ်ရမယ် လို့ မျှော်လင့်ပါတယ်။ (ပုံမှန် octal format သုံးဖို့ — နံပါတ်က 0 (သုည) နဲ့ စရပါမယ်။)
Default permission တွေက 0600 ဖြစ်ပြီး — ဆိုလိုတာက server owner တစ်ဦးတည်းသာ log file တွေကို ဖတ် ဒါမှမဟုတ် ရေးနိုင်တာပါ။ နောက် အသုံးဝင်တဲ့ setting တစ်ခုက 0640 ဖြစ်ပြီး — owner ရဲ့ group member တွေကို file တွေ ဖတ်ခွင့် ပေးပါတယ်။ ဒါပေမယ့် ဒီလို setting ကို အသုံးပြုဖို့ — file တွေကို cluster data directory အပြင်ဘက် တစ်နေရာမှာ သိမ်းဖို့ `log_directory` ကို ပြင်ဆင်ရန် လိုအပ်ပါလိမ့်မယ် ဆိုတာ သတိပြုပါ။ ဘယ်လိုဖြစ်ဖြစ် — log file တွေက sensitive data တွေ ပါဝင်နိုင်တာကြောင့် — ၎င်းတို့ကို world-readable ဖြစ်အောင် လုပ်တာက မဆင်ခြင်တဲ့ လုပ်ရပ် ဖြစ်ပါတယ်။
ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **log_rotation_age (integer)** — `logging_collector` enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က log file တစ်ခုကို အသုံးပြုမည့် အများဆုံး အချိန်ကို ဆုံးဖြတ်ပြီး — အဲဒီနောက် log file အသစ် ဖန်တီးပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — မိနစ် (minutes) အဖြစ် ယူပါတယ်။ Default က 24 hours ဖြစ်ပါတယ်။ အချိန် အခြေခံ log file အသစ် ဖန်တီးတာကို ပိတ်ဖို့ သုည (zero) သတ်မှတ်ပါ။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **log_rotation_size (integer)** — `logging_collector` enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က log file တစ်ခုရဲ့ အများဆုံး size ကို ဆုံးဖြတ်ပါတယ်။ ဒီပမာဏ data ကို log file တစ်ခုထဲ ထုတ်ပြီးနောက် — log file အသစ် ဖန်တီးပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — kilobyte အဖြစ် ယူပါတယ်။ Default က 10 megabytes ဖြစ်ပါတယ်။ Size အခြေခံ log file အသစ် ဖန်တီးတာကို ပိတ်ဖို့ သုည (zero) သတ်မှတ်ပါ။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **log_truncate_on_rotation (boolean)** — `logging_collector` enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က တူညီတဲ့ နာမည်ရှိ ရှိပြီးသား log file တစ်ခုကို append လုပ်မယ့်အစား truncate (overwrite) လုပ်စေပါတယ်။ ဒါပေမယ့် — truncation က အချိန် အခြေခံ rotation ကြောင့် file အသစ် ဖွင့်ချိန်မှာသာ ဖြစ်ပြီး — server startup ဒါမှမဟုတ် size အခြေခံ rotation အတွင်းမှာ ဖြစ်မှာ မဟုတ်ပါဘူး။ off ဖြစ်နေရင် — ရှိပြီးသား file တွေကို အခြေအနေ အားလုံးမှာ append လုပ်ပါတယ်။ ဥပမာ — ဒီ setting ကို `postgresql-%H.log` ကဲ့သို့သော `log_filename` နဲ့ တွဲသုံးရင် — နာရီအလိုက် log file ၂၄ ခု ဖန်တီးပြီး — အဲဒီနောက် အလှည့်ကျ ပြန် overwrite လုပ်တဲ့ ရလဒ် ရပါလိမ့်မယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
ဥပမာ — log ၇ ရက် သိမ်းထားချင်ပြီး — တစ်ရက်လျှင် log file တစ်ခု server_log.Mon, server_log.Tue စသဖြင့် နာမည်ပေးကာ — ပြီးခဲ့တဲ့ အပတ်ရဲ့ log ကို ဒီအပတ်ရဲ့ log နဲ့ အလိုအလျောက် overwrite လုပ်ချင်ရင် — `log_filename` ကို `server_log.%a`, `log_truncate_on_rotation` ကို on နဲ့ `log_rotation_age` ကို 1440 သတ်မှတ်ပါ။
ဥပမာ — log ၂၄ နာရီ သိမ်းထားချင်ပြီး — တစ်နာရီလျှင် log file တစ်ခု ထားကာ — log file size က 1GB ကျော်ရင်လည်း စော၍ rotate လုပ်ချင်ရင် — `log_filename` ကို `server_log.%H%M`, `log_truncate_on_rotation` ကို on, `log_rotation_age` ကို 60 နဲ့ `log_rotation_size` ကို 1000000 သတ်မှတ်ပါ။ `log_filename` ထဲ %M ကို ထည့်ခြင်းက — ဖြစ်ပေါ်နိုင်တဲ့ size ကြောင့် ဖြစ်တဲ့ rotation တွေက — အဲဒီနာရီရဲ့ ကနဦး file name နဲ့ မတူတဲ့ file name တစ်ခုကို ရွေးနိုင်စေပါတယ်။
- **syslog_facility (enum)** — syslog ဆီ log လုပ်တာ enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က အသုံးပြုမည့် syslog “facility” ကို ဆုံးဖြတ်ပါတယ်။ LOCAL0, LOCAL1, LOCAL2, LOCAL3, LOCAL4, LOCAL5, LOCAL6, LOCAL7 ထဲက ရွေးနိုင်ပြီး — default က LOCAL0 ဖြစ်ပါတယ်။ သင့် system ရဲ့ syslog daemon documentation ကိုလည်း ကြည့်ပါ။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **syslog_ident (string)** — syslog ဆီ log လုပ်တာ enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က syslog log တွေထဲမှာ PostgreSQL message တွေကို ခွဲခြားဖော်ပြဖို့ သုံးတဲ့ program name ကို ဆုံးဖြတ်ပါတယ်။ Default က postgres ဖြစ်ပါတယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **syslog_sequence_numbers (boolean)** — syslog ဆီ log လုပ်နေပြီး ဒါက on (default) ဖြစ်တဲ့အခါ — message တစ်ခုချင်းစီကို တိုးလာတဲ့ sequence number (ဥပမာ [2]) နဲ့ prefix လုပ်ပါတယ်။ ဒါက syslog implementation အများအပြား default အားဖြင့် လုပ်ဆောင်တဲ့ “--- last message repeated N times ---” suppression ကို ကျော်လွှားပေးပါတယ်။ ပိုခေတ်သစ်တဲ့ syslog implementation တွေမှာ — repeated message suppression ကို configure လုပ်နိုင်တာကြောင့် (ဥပမာ rsyslog ထဲက $RepeatedMsgReduction) — ဒါက မလိုအပ်တာ ဖြစ်နိုင်ပါတယ်။ ဒါ့အပြင် — repeated message တွေကို တကယ် suppress လုပ်ချင်ရင် — ဒါကို off လုပ်နိုင်ပါတယ်။
ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **syslog_split_messages (boolean)** — syslog ဆီ log လုပ်တာ enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က message တွေကို syslog ဆီ ဘယ်လို ပို့ဆောင်မလဲ ဆိုတာ ဆုံးဖြတ်ပါတယ်။ on (default) ဖြစ်တဲ့အခါ — message တွေကို line အလိုက် ခွဲပြီး — ရှည်တဲ့ line တွေကို 1024 byte ထဲ ဆံ့အောင် ခွဲပါတယ် — ၎င်းက ရိုးရာ syslog implementation တွေအတွက် ပုံမှန် size limit ဖြစ်ပါတယ်။ off ဖြစ်တဲ့အခါ — PostgreSQL server log message တွေကို syslog service ဆီ အတိုင်း ပို့ပြီး — ကြီးမားနိုင်တဲ့ message တွေကို ကိုင်တွယ်ဖို့ syslog service အပေါ်မှာ မူတည်ပါတယ်။
syslog က နောက်ဆုံးမှာ text file တစ်ခုဆီ log လုပ်နေရင် — အကျိုးသက်ရောက်မှုက နှစ်မျိုးလုံး တူညီပြီး — setting ကို on အတိုင်း ထားတာက အကောင်းဆုံး ဖြစ်ပါတယ် — အကြောင်းကတော့ syslog implementation အများစုက ကြီးမားတဲ့ message တွေကို ကိုင်တွယ်နိုင်တာ မဟုတ်သလို — ၎င်းတို့ကို ကိုင်တွယ်ဖို့ အထူး configure လုပ်ရန် လိုအပ်နိုင်လို့ပါ။ ဒါပေမယ့် syslog က နောက်ဆုံးမှာ အခြား medium တစ်ခုထဲ ရေးနေရင် — message တွေကို ယုတ္တိအရ အတူတကွ ထားရှိဖို့ — လိုအပ်နိုင် ဒါမှမဟုတ် ပိုအသုံးဝင်နိုင်ပါတယ်။
ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **event_source (string)** — event log ဆီ log လုပ်တာ enable ဖြစ်နေတဲ့အခါ — ဒီ parameter က log ထဲမှာ PostgreSQL message တွေကို ခွဲခြားဖော်ပြဖို့ သုံးတဲ့ program name ကို ဆုံးဖြတ်ပါတယ်။ Default က PostgreSQL ဖြစ်ပါတယ်။ ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။

### 19.8.2. When to Log (log ကို ဘယ်အချိန် သိမ်းမလဲ)

- **log_min_messages (enum)** — server log ဆီ ဘယ် message level များ ရေးသားမလဲ ဆိုတာ ထိန်းချုပ်ပါတယ်။ ခွင့်ပြုတဲ့ တန်ဖိုးများက DEBUG5၊ DEBUG4၊ DEBUG3၊ DEBUG2၊ DEBUG1၊ INFO၊ NOTICE၊ WARNING၊ ERROR၊ LOG၊ FATAL နဲ့ PANIC ဖြစ်ပါတယ်။ Level တစ်ခုချင်းစီမှာ သူ့နောက် လိုက်လာတဲ့ level အားလုံး ပါဝင်ပါတယ်။ Level ပိုနောက်ကျလေလေ — log ဆီ ပို့တဲ့ message ပိုနည်းလေလေ ဖြစ်ပါတယ်။ Default က WARNING ဖြစ်ပါတယ်။ LOG က client_min_messages မှာထက် ဒီနေရာမှာ အဆင့် (rank) ကွာခြားတယ်ဆိုတာ သတိပြုပါ။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_min_error_statement (enum)** — error အခြေအနေ တစ်ခု ဖြစ်စေတဲ့ SQL statement များထဲက ဘယ်ဟာတွေကို server log မှာ မှတ်တမ်းတင်မလဲ ဆိုတာ ထိန်းချုပ်ပါတယ်။ သတ်မှတ်ထားတဲ့ severity ဒါမှမဟုတ် ထိုထက် မြင့်တဲ့ message တစ်ခုခုအတွက် log entry ထဲမှာ လက်ရှိ SQL statement ပါဝင်ပါတယ်။ ခွင့်ပြုတဲ့ တန်ဖိုးများက DEBUG5၊ DEBUG4၊ DEBUG3၊ DEBUG2၊ DEBUG1၊ INFO၊ NOTICE၊ WARNING၊ ERROR၊ LOG၊ FATAL နဲ့ PANIC ဖြစ်ပါတယ်။ Default က ERROR ဖြစ်ပြီး — ဆိုလိုတာက error များ၊ log message များ၊ fatal error များ ဒါမှမဟုတ် panic များ ဖြစ်စေတဲ့ statement များကို မှတ်တမ်းတင်ပါလိမ့်မယ်။ ကျရှုံးတဲ့ statement များ မှတ်တမ်းတင်ခြင်းကို ထိရောက်စွာ ပိတ်ဖို့ — ဒီ parameter ကို PANIC သတ်မှတ်ပါ။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_min_duration_statement (integer)** — Statement တစ်ခုက သတ်မှတ်ထားတဲ့ အချိန်ပမာဏ အနည်းဆုံး run ခဲ့ရင် — ပြီးစီးသွားတဲ့ statement တစ်ခုချင်းစီရဲ့ ကြာချိန် (duration) ကို မှတ်တမ်းတင်စေပါတယ်။ ဥပမာ — 250ms သတ်မှတ်ရင် — 250ms ဒါမှမဟုတ် ထိုထက်ကြာတဲ့ SQL statement အားလုံးကို မှတ်တမ်းတင်ပါလိမ့်မယ်။ ဒီ parameter ကို enable လုပ်ခြင်းက — သင့် application များထဲက optimize မလုပ်ထားတဲ့ query များကို ရှာဖွေဖို့ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — milliseconds အဖြစ် ယူပါတယ်။ ဒါကို သုည သတ်မှတ်ရင် statement duration အားလုံးကို print ပါတယ်။ -1 (default) က statement duration များ မှတ်တမ်းတင်ခြင်းကို disable လုပ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
ဒါက log_min_duration_sample ကို ကျော်လွန်စေပြီး — ဆိုလိုတာက ဒီ setting ထက် ကြာချိန် ကျော်လွန်တဲ့ query များက sampling မခံရဘဲ အမြဲတမ်း မှတ်တမ်းတင်ခံရပါတယ်။
Extended query protocol ကို အသုံးပြုတဲ့ client များအတွက် — Parse၊ Bind နဲ့ Execute အဆင့်များရဲ့ ကြာချိန်များကို သီးခြားစီ မှတ်တမ်းတင်ပါတယ်။

> **မှတ်ချက်:** ဒီ option ကို `log_statement` နဲ့ တွဲသုံးတဲ့အခါ — `log_statement` ကြောင့် မှတ်တမ်းတင်ခံရတဲ့ statement များရဲ့ စာသားကို duration log message မှာ ထပ်မံ ဖော်ပြမှာ မဟုတ်ပါဘူး။ syslog ကို မသုံးရင် — statement message ကို နောက်ပိုင်း duration message နဲ့ process ID ဒါမှမဟုတ် session ID သုံးပြီး ချိတ်ဆက်နိုင်ဖို့ — `log_line_prefix` သုံးပြီး PID ဒါမှမဟုတ် session ID ကို မှတ်တမ်းတင်ဖို့ အကြံပြုပါတယ်။

- **log_min_duration_sample (integer)** — သတ်မှတ်ထားတဲ့ အချိန်ပမာဏ အနည်းဆုံး run ခဲ့တဲ့ ပြီးစီးသွား statement များရဲ့ ကြာချိန်ကို sampling လုပ်ခွင့်ပြုပါတယ်။ ဒါက log_min_duration_statement နဲ့ တူညီတဲ့ အမျိုးအစား log entry များကို ထုတ်ပေမယ့် — run ခဲ့တဲ့ statement များရဲ့ အစုအဖွဲ့ (subset) အတွက်သာ ဖြစ်ပြီး — sample rate ကို log_statement_sample_rate က ထိန်းချုပ်ပါတယ်။ ဥပမာ — 100ms သတ်မှတ်ရင် — 100ms ဒါမှမဟုတ် ထိုထက်ကြာတဲ့ SQL statement အားလုံးကို sampling အတွက် စဉ်းစားပါလိမ့်မယ်။ Query အားလုံးကို မှတ်တမ်းတင်ဖို့ traffic အလွန်များနေတဲ့အခါ ဒီ parameter ကို enable လုပ်တာ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — milliseconds အဖြစ် ယူပါတယ်။ ဒါကို သုည သတ်မှတ်ရင် statement duration အားလုံးကို sample လုပ်ပါတယ်။ -1 (default) က statement duration များ sampling လုပ်ခြင်းကို disable လုပ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
ဒီ setting က log_min_duration_statement ထက် ဦးစားပေး နည်းပါတယ် — ဆိုလိုတာက log_min_duration_statement ထက် ကြာချိန် ကျော်လွန်တဲ့ statement များက sampling မခံရဘဲ အမြဲတမ်း မှတ်တမ်းတင်ခံရပါတယ်။
log_min_duration_statement အတွက် အခြား မှတ်ချက်များက ဒီ setting အတွက်လည်း သက်ဆိုင်ပါတယ်။

- **log_statement_sample_rate (floating point)** — log_min_duration_sample ထက် ကြာချိန် ကျော်လွန်တဲ့ statement များထဲက — မှတ်တမ်းတင်ခံရမယ့် အပိုင်းကိန်း (fraction) ကို ဆုံးဖြတ်ပါတယ်။ Sampling က stochastic ဖြစ်ပြီး — ဥပမာ — 0.5 ဆိုတာက ပေးထားတဲ့ statement တစ်ခုခု မှတ်တမ်းတင်ခံရဖို့ စာရင်းအင်းအရ နှစ်ခုထဲ တစ်ခု အခွင့်အလမ်းရှိတယ်လို့ ဆိုလိုပါတယ်။ Default က 1.0 ဖြစ်ပြီး — sample လုပ်ထားတဲ့ statement အားလုံးကို မှတ်တမ်းတင်တာကို ဆိုလိုပါတယ်။ ဒါကို သုည သတ်မှတ်ခြင်းက — log_min_duration_sample ကို -1 သတ်မှတ်သလိုပဲ — sampled statement-duration logging ကို disable လုပ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။

- **log_transaction_sample_rate (floating point)** — အခြား အကြောင်းရင်းများအတွက် မှတ်တမ်းတင်တဲ့ statement များအပြင် — statement အားလုံး မှတ်တမ်းတင်ခံရမယ့် transaction များရဲ့ အပိုင်းကိန်းကို သတ်မှတ်ပါတယ်။ ဒါက — statement များရဲ့ ကြာချိန်များနဲ့ မသက်ဆိုင်ဘဲ — transaction အသစ် တစ်ခုချင်းစီအတွက် သက်ဆိုင်ပါတယ်။ Sampling က stochastic ဖြစ်ပြီး — ဥပမာ — 0.1 ဆိုတာက ပေးထားတဲ့ transaction တစ်ခုခု မှတ်တမ်းတင်ခံရဖို့ စာရင်းအင်းအရ ဆယ်ခုထဲ တစ်ခု အခွင့်အလမ်းရှိတယ်လို့ ဆိုလိုပါတယ်။ log_transaction_sample_rate က transaction များရဲ့ sample တစ်ခု တည်ဆောက်ဖို့ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ Default က 0 ဖြစ်ပြီး — အပိုဆောင်း transaction များထဲက statement များကို မှတ်တမ်းမတင်တာကို ဆိုလိုပါတယ်။ ဒါကို 1 သတ်မှတ်ရင် — transaction အားလုံးရဲ့ statement အားလုံးကို မှတ်တမ်းတင်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။

> **မှတ်ချက်:** statement-logging option အားလုံးလိုပဲ — ဒီ option က သိသာတဲ့ overhead ကို ထပ်တိုးစေနိုင်ပါတယ်။

- **log_startup_progress_interval (integer)** — လုပ်ဆောင်ချက် အချိန်ကြာနေဆဲ လုပ်ငန်းစဉ် (long-running operation) တစ်ခုအကြောင်း — startup process က message တစ်ခု မှတ်တမ်းတင်မယ့် အချိန်ပမာဏနဲ့ — အဲဒီ operation အတွက် နောက်ထပ် progress message များကြားထဲက interval ကို သတ်မှတ်ပါတယ်။ Default က 10 seconds ဖြစ်ပါတယ်။ 0 သတ်မှတ်ရင် ဒီ feature ကို disable လုပ်ပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — milliseconds အဖြစ် ယူပါတယ်။ ဒီ setting က operation တစ်ခုချင်းစီအတွက် သီးခြားစီ သက်ရောက်ပါတယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
ဥပမာ — data directory ကို sync လုပ်တာ 25 seconds ကြာပြီး — ထို့နောက် unlogged relation များကို reset လုပ်တာ 8 seconds ကြာတယ်ဆိုပါစို့; ဒီ setting က default 10 seconds ဖြစ်ရင် — data directory sync လုပ်တာ 10 seconds ကြာပြီးနောက် message တစ်ခု မှတ်တမ်းတင်ခံရပြီး — 20 seconds ကြာပြီးနောက် ထပ်တစ်ခု မှတ်တမ်းတင်ခံရမှာ ဖြစ်ပေမယ့် — unlogged relation များ reset လုပ်တာအတွက် ဘာမှ မှတ်တမ်းတင်ခံရမှာ မဟုတ်ပါဘူး။

ဇယား 19.2 က PostgreSQL အသုံးပြုတဲ့ message severity level များကို ရှင်းပြပါတယ်။ Logging output ကို syslog ဒါမှမဟုတ် Windows ရဲ့ eventlog ဆီ ပို့ရင် — severity level များကို ဇယားထဲမှာ ပြထားသလို ပြောင်းလဲ သတ်မှတ်ပါတယ်။

**Table 19.2. Message Severity Levels (message severity အဆင့်များ)**

| Severity (ပြင်းထန်မှု အဆင့်) | Usage (အသုံးပြုမှု) | syslog | eventlog |
| --- | --- | --- | --- |
| `DEBUG1 .. DEBUG5` | developer များ အသုံးပြုဖို့ — ဆက်တိုက် ပိုအသေးစိတ်တဲ့ အချက်အလက်များကို ပေးပါတယ်။ | `DEBUG` | `INFORMATION` |
| `INFO` | user က သွယ်ဝိုက်၍ တောင်းဆိုတဲ့ အချက်အလက်များကို ပေးပါတယ် — ဥပမာ — `VACUUM VERBOSE` ရဲ့ output။ | `INFO` | `INFORMATION` |
| `NOTICE` | user များအတွက် အထောက်အကူ ဖြစ်နိုင်တဲ့ အချက်အလက်များကို ပေးပါတယ် — ဥပမာ — ရှည်လျားတဲ့ identifier များ ဖြတ်တောက်ခံရကြောင်း အသိပေးချက်။ | `NOTICE` | `INFORMATION` |
| `WARNING` | ဖြစ်နိုင်ခြေရှိတဲ့ ပြဿနာများအတွက် သတိပေးချက်များကို ပေးပါတယ် — ဥပမာ — transaction block အပြင်ဘက်မှာ `COMMIT` လုပ်ခြင်း။ | `NOTICE` | `WARNING` |
| `ERROR` | လက်ရှိ command ကို abort ဖြစ်စေတဲ့ error တစ်ခုကို အစီရင်ခံပါတယ်။ | `WARNING` | `ERROR` |
| `LOG` | administrator များ စိတ်ဝင်စားတဲ့ အချက်အလက်များကို အစီရင်ခံပါတယ် — ဥပမာ — checkpoint လုပ်ဆောင်ချက်။ | `INFO` | `INFORMATION` |
| `FATAL` | လက်ရှိ session ကို abort ဖြစ်စေတဲ့ error တစ်ခုကို အစီရင်ခံပါတယ်။ | `ERR` | `ERROR` |
| `PANIC` | database session အားလုံးကို abort ဖြစ်စေတဲ့ error တစ်ခုကို အစီရင်ခံပါတယ်။ | `CRIT` | `ERROR` |

### 19.8.3. What to Log (log မှာ ဘာ သိမ်းမလဲ)

> **မှတ်ချက်:** သင်မှတ်တမ်းတင်ဖို့ ရွေးချယ်တဲ့ အကြောင်းအရာများက security ဆိုင်ရာ သက်ရောက်မှုများ ရှိနိုင်ပါတယ်; [အပိုင်း 24.3](/docs/postgresql/logfile-maintenance) ကို ကြည့်ပါ။

- **application_name (string)** — application_name သည် NAMEDATALEN စာလုံးအရေအတွက်ထက် နည်းတဲ့ string တစ်ခု ဖြစ်နိုင်ပါတယ် (standard build တစ်ခုမှာ စာလုံး 64 လုံး)။ ဒါကို ပုံမှန်အားဖြင့် application တစ်ခုက server ဆီ ချိတ်ဆက်တဲ့အခါ သတ်မှတ်ပါတယ်။ အမည်ကို pg_stat_activity view မှာ ဖော်ပြပြီး CSV log entry များထဲမှာ ထည့်သွင်းပါတယ်။ log_line_prefix parameter ကတစ်ဆင့် regular log entry များထဲမှာလည်း ထည့်သွင်းနိုင်ပါတယ်။ application_name တန်ဖိုးမှာ printable ASCII စာလုံးများကိုသာ အသုံးပြုနိုင်ပါတယ်။ အခြား စာလုံးများကို C-style hexadecimal escape များနဲ့ အစားထိုးပါတယ်။
- **debug_print_parse (boolean), debug_print_rewritten (boolean), debug_print_plan (boolean)** — ဒီ parameter များက debugging output အမျိုးမျိုး ထုတ်ပေးတာကို enable လုပ်ပါတယ်။ သတ်မှတ်ထားရင် — run လုပ်တဲ့ query တစ်ခုချင်းစီအတွက် ရလဒ် parse tree၊ query rewriter output ဒါမှမဟုတ် execution plan ကို print ပါတယ်။ ဒီ message များကို LOG message level နဲ့ ထုတ်ပေးတာမို့ — default အားဖြင့် server log မှာ ပေါ်မယ်ဆိုပေမယ့် client ဆီ ပို့မှာ မဟုတ်ပါဘူး။ client_min_messages နဲ့/ဒါမှမဟုတ် log_min_messages ကို ချိန်ညှိပြီး ဒါကို ပြောင်းနိုင်ပါတယ်။ ဒီ parameter များက default အားဖြင့် off ဖြစ်ပါတယ်။
- **debug_pretty_print (boolean)** — သတ်မှတ်ထားရင် — debug_pretty_print က debug_print_parse၊ debug_print_rewritten ဒါမှမဟုတ် debug_print_plan က ထုတ်တဲ့ message များကို indent လုပ်ပါတယ်။ ဒါက off ဖြစ်နေချိန် အသုံးပြုတဲ့ “compact” format ထက် ဖတ်ရ ပိုလွယ်ပေမယ့် အများကြီး ပိုရှည်တဲ့ output ကို ဖြစ်စေပါတယ်။ ဒါက default အားဖြင့် on ဖြစ်ပါတယ်။
- **log_autovacuum_min_duration (integer)** — autovacuum က လုပ်ဆောင်တဲ့ action တစ်ခုချင်းစီက သတ်မှတ်ထားတဲ့ အချိန်ပမာဏ အနည်းဆုံး run ခဲ့ရင် မှတ်တမ်းတင်စေပါတယ်။ ဒါကို သုည သတ်မှတ်ရင် autovacuum action အားလုံးကို မှတ်တမ်းတင်ပါတယ်။ -1 က autovacuum action များ မှတ်တမ်းတင်ခြင်းကို disable လုပ်ပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — milliseconds အဖြစ် ယူပါတယ်။ ဥပမာ — ဒါကို 250ms သတ်မှတ်ရင် — 250ms ဒါမှမဟုတ် ထိုထက်ကြာတဲ့ automatic vacuum နဲ့ analyze အားလုံးကို မှတ်တမ်းတင်ပါလိမ့်မယ်။ ထို့အပြင် — ဒီ parameter ကို -1 မဟုတ်တဲ့ ဘယ်တန်ဖိုးမဆို သတ်မှတ်ထားရင် — conflicting lock တစ်ခု ဒါမှမဟုတ် တစ်ပြိုင်နက် drop လုပ်လိုက်တဲ့ relation တစ်ခုကြောင့် autovacuum action တစ်ခု ကျော်လွန်ခံရရင် message တစ်ခု မှတ်တမ်းတင်ပါလိမ့်မယ်။ Default က 10min ဖြစ်ပါတယ်။ ဒီ parameter ကို enable လုပ်ခြင်းက autovacuum လုပ်ဆောင်ချက်ကို ခြေရာခံရာမှာ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်; ဒါပေမယ့် table storage parameter များကို ပြောင်းခြင်းဖြင့် table တစ်ခုချင်းစီအတွက် ဒီ setting ကို override လုပ်နိုင်ပါတယ်။
- **log_checkpoints (boolean)** — checkpoint များနဲ့ restartpoint များကို server log မှာ မှတ်တမ်းတင်စေပါတယ်။ ရေးသားလိုက်တဲ့ buffer အရေအတွက်နဲ့ ၎င်းတို့ကို ရေးသားရာမှာ ကုန်ဆုံးတဲ့ အချိန် အပါအဝင် — စာရင်းအင်း အချက်အလက် တချို့ကို log message များထဲမှာ ထည့်သွင်းပါတယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။ Default က on ဖြစ်ပါတယ်။
- **log_connections (string)** — server ဆီ ချိတ်ဆက်မှု တစ်ခုချင်းစီရဲ့ အသွင်အပြင်များကို မှတ်တမ်းတင်စေပါတယ်။ Default က empty string ဖြစ်တဲ့ '' ဖြစ်ပြီး — connection logging အားလုံးကို disable လုပ်ပါတယ်။ အောက်ပါ option များကို တစ်ခုတည်း ဒါမှမဟုတ် comma နဲ့ ခွဲထားတဲ့ စာရင်းတစ်ခုအဖြစ် သတ်မှတ်နိုင်ပါတယ်:

**Table 19.3. Log Connection Options (log connection option များ)**

| Name (အမည်) | Description (ဖော်ပြချက်) |
| --- | --- |
| `receipt` | connection တစ်ခု လက်ခံရရှိမှုကို မှတ်တမ်းတင်ပါတယ်။ |
| `authentication` | user တစ်ယောက်ကို ဖော်ထုတ်ဖို့ authentication method တစ်ခုက အသုံးပြုတဲ့ မူရင်း identity ကို မှတ်တမ်းတင်ပါတယ်။ အများအားဖြင့် — identity string က PostgreSQL username နဲ့ ကိုက်ညီပါတယ်; ဒါပေမယ့် third-party authentication method တချို့က server က မသိမ်းဆည်းမီ မူရင်း user identifier ကို ပြောင်းလဲနိုင်ပါတယ်။ ဒီ setting ရဲ့ တန်ဖိုး ဘယ်လိုဖြစ်ပါစေ — ကျရှုံးတဲ့ authentication ကို အမြဲတမ်း မှတ်တမ်းတင်ပါတယ်။ |
| `authorization` | authorization အောင်မြင်စွာ ပြီးစီးမှုကို မှတ်တမ်းတင်ပါတယ်။ ဒီအချိန်မှာ connection ကို တည်ထောင်ပြီး ဖြစ်ပေမယ့် backend ကို အပြည့်အဝ မသတ်မှတ်ရသေးပါဘူး။ Log message မှာ ခွင့်ပြုခံရတဲ့ username အပြင် — သက်ဆိုင်ရာရင် — database name နဲ့ application name ကိုလည်း ထည့်သွင်းပါတယ်။ |
| `setup_durations` | connection တည်ထောင်ခြင်းနဲ့ backend ကို သတ်မှတ်ခြင်းအတွက် — ပထမဆုံး query ကို execute လုပ်ဖို့ အသင့်ဖြစ်တဲ့အထိ — ကုန်ဆုံးတဲ့ အချိန်ကို မှတ်တမ်းတင်ပါတယ်။ Log message မှာ ကြာချိန် သုံးခု ပါဝင်ပါတယ်: စုစုပေါင်း setup ကြာချိန် (postmaster က ဝင်လာတဲ့ connection ကို လက်ခံတဲ့ အချိန်မှ စပြီး connection က query အတွက် အသင့်ဖြစ်တဲ့အခါ အဆုံးသတ်တဲ့ အထိ)၊ backend အသစ်ကို fork လုပ်ရာမှာ ကြာချိန်၊ နဲ့ user ကို authenticate လုပ်ရာမှာ ကြာချိန် တို့ ဖြစ်ပါတယ်။ |
| `all` | option အားလုံးကို သတ်မှတ်ခြင်းနဲ့ ညီမျှတဲ့ အဆင်ပြေတဲ့ alias တစ်ခု ဖြစ်ပါတယ်။ အခြား option များရဲ့ စာရင်းတစ်ခုထဲမှာ all ကို သတ်မှတ်ရင် — connection အသွင်အပြင် အားလုံးကို မှတ်တမ်းတင်ပါလိမ့်မယ်။ |

Disconnection logging ကို log_disconnections က သီးခြားစီ ထိန်းချုပ်ပါတယ်။
Backwards compatibility ရည်ရွယ်ချက်များအတွက် — on, off, true, false, yes, no, 1 နဲ့ 0 တို့ကို ဆက်လက် ထောက်ပံ့ထားဆဲ ဖြစ်ပါတယ်။ အပေါင်းလက္ခဏာ တန်ဖိုးများက receipt၊ authentication နဲ့ authorization option များကို သတ်မှတ်ခြင်းနဲ့ ညီမျှပါတယ်။
သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ parameter ကို session start မှာ ပြောင်းနိုင်ပြီး — session တစ်ခုအတွင်းမှာတော့ လုံးဝ ပြောင်းလို့ မရပါဘူး။

> **မှတ်ချက်:** psql လို client program တချို့က စကားဝှက် လိုအပ်မလား ဆုံးဖြတ်နေစဉ်မှာ နှစ်ကြိမ် ချိတ်ဆက်ဖို့ ကြိုးစားတာမို့ — duplicate “connection received” message များက ပြဿနာတစ်ခု ရှိတယ်လို့ သေချာပေါက် မဆိုလိုပါဘူး။

- **log_disconnections (boolean)** — session ပြီးဆုံးမှုများကို မှတ်တမ်းတင်စေပါတယ်။ Log output က log_connections နဲ့ ဆင်တူတဲ့ အချက်အလက်များအပြင် — session ရဲ့ ကြာချိန်ကိုပါ ပေးပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ parameter ကို session start မှာ ပြောင်းနိုင်ပြီး — session တစ်ခုအတွင်းမှာတော့ လုံးဝ ပြောင်းလို့ မရပါဘူး။ Default က off ဖြစ်ပါတယ်။
- **log_duration (boolean)** — ပြီးစီးသွားတဲ့ statement တစ်ခုချင်းစီရဲ့ ကြာချိန်ကို မှတ်တမ်းတင်စေပါတယ်။ Default က off ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
Extended query protocol ကို အသုံးပြုတဲ့ client များအတွက် — Parse၊ Bind နဲ့ Execute အဆင့်များရဲ့ ကြာချိန်များကို သီးခြားစီ မှတ်တမ်းတင်ပါတယ်။

> **မှတ်ချက်:** log_duration ကို enable လုပ်ခြင်းနဲ့ log_min_duration_statement ကို သုည သတ်မှတ်ခြင်းကြား ခြားနားချက်က — log_min_duration_statement ကို ကျော်လွန်ခြင်းက query ရဲ့ စာသားကို မှတ်တမ်းတင်ဖို့ အတင်းအကြပ် ဖြစ်စေပေမယ့် — ဒီ option ကတော့ မလုပ်ပါဘူး။ ဒါကြောင့် — log_duration က on ဖြစ်ပြီး log_min_duration_statement မှာ အပေါင်းလက္ခဏာ တန်ဖိုးတစ်ခု ရှိနေရင် — ကြာချိန် အားလုံးကို မှတ်တမ်းတင်ပေမယ့် — query စာသားကိုတော့ threshold ကျော်လွန်တဲ့ statement များအတွက်သာ ထည့်သွင်းပါတယ်။ ဒီအပြုအမူက high-load installation များမှာ စာရင်းအင်း အချက်အလက်များ စုဆောင်းရာမှာ အသုံးဝင်နိုင်ပါတယ်။

- **log_error_verbosity (enum)** — မှတ်တမ်းတင်တဲ့ message တစ်ခုချင်းစီအတွက် server log မှာ ရေးသားတဲ့ အသေးစိတ် ပမာဏကို ထိန်းချုပ်ပါတယ်။ ခွင့်ပြုတဲ့ တန်ဖိုးများက TERSE၊ DEFAULT နဲ့ VERBOSE ဖြစ်ပြီး — တစ်ခုချင်းစီက ဖော်ပြတဲ့ message များထဲကို field များ ပိုထည့်ပါတယ်။ TERSE က DETAIL၊ HINT၊ QUERY နဲ့ CONTEXT error အချက်အလက်များ မှတ်တမ်းတင်ခြင်းကို ဖယ်ထုတ်ပါတယ်။ VERBOSE output မှာ SQLSTATE error code ([နောက်ဆက်တွဲ A](https://www.postgresql.org/docs/current/errcodes-appendix.html) ကိုလည်း ကြည့်ပါ) နဲ့ error ကို ဖြစ်စေတဲ့ source code file name၊ function name နဲ့ line number တို့ ပါဝင်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_hostname (boolean)** — Default အားဖြင့် — connection log message များက ချိတ်ဆက်လာတဲ့ host ရဲ့ IP address ကိုသာ ပြပါတယ်။ ဒီ parameter ကို on လုပ်ခြင်းက host name ကိုပါ မှတ်တမ်းတင်စေပါတယ်။ သင့် host name resolution setup အပေါ် မူတည်ပြီး — ဒါက လျစ်လျူရှုလို့မရတဲ့ performance ဆုတ်ယုတ်မှုကို ဖြစ်စေနိုင်တယ်ဆိုတာ သတိပြုပါ။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။

- **log_line_prefix (string)** — ဒါက log line တစ်ခုချင်းစီရဲ့ အစမှာ ထုတ်ပေးတဲ့ printf-style string တစ်ခု ဖြစ်ပါတယ်။ % စာလုံးများက — အောက်မှာ ဖော်ပြထားသလို — status အချက်အလက်များနဲ့ အစားထိုးခံရတဲ့ “escape sequence” များကို စတင်ပါတယ်။ မမှတ်မိတဲ့ escape များကို လျစ်လျူရှုပါတယ်။ အခြား စာလုံးများကို log line ဆီ တိုက်ရိုက် ကူးယူပါတယ်။ Escape တချို့ကို session process များက သာ မှတ်မိပြီး — main server process လို background process များကတော့ empty အဖြစ် သဘောထားပါတယ်။ Status အချက်အလက်များကို — % နောက်မှာ၊ option ရှေ့မှာ — numeric literal တစ်ခု သတ်မှတ်ခြင်းဖြင့် ဘယ်ဘက် ဒါမှမဟုတ် ညာဘက် ချိန်ညှိနိုင်ပါတယ်။ အနုတ် တန်ဖိုးတစ်ခုက status အချက်အလက်ကို အနည်းဆုံး အလျားတစ်ခု ရရှိဖို့ ညာဘက်မှာ space များနဲ့ pad လုပ်ပါလိမ့်မယ်; အပေါင်း တန်ဖိုးတစ်ခုကတော့ ဘယ်ဘက်မှာ pad လုပ်ပါလိမ့်မယ်။ Log file များထဲမှာ လူက ဖတ်ရလွယ်စေဖို့ padding က အသုံးဝင်နိုင်ပါတယ်။
ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။ Default က '%m [%p] ' ဖြစ်ပြီး — time stamp နဲ့ process ID ကို မှတ်တမ်းတင်ပါတယ်။

| Escape | Effect (အကျိုးသက်ရောက်မှု) | Session only (session အတွက်သာ) |
| --- | --- | --- |
| `%a` | Application name (application အမည်) | ဟုတ် |
| `%u` | User name (user အမည်) | ဟုတ် |
| `%d` | Database name (database အမည်) | ဟုတ် |
| `%r` | Remote host name ဒါမှမဟုတ် IP address နဲ့ remote port | ဟုတ် |
| `%h` | Remote host name ဒါမှမဟုတ် IP address | ဟုတ် |
| `%L` | Local address (client ချိတ်ဆက်ခဲ့တဲ့ server ပေါ်က IP address) | ဟုတ် |
| `%b` | Backend type (backend အမျိုးအစား) | မဟုတ် |
| `%p` | Process ID | မဟုတ် |
| `%P` | ဒီ process က parallel query worker ဖြစ်ရင် — parallel group leader ရဲ့ Process ID | မဟုတ် |
| `%t` | Time stamp (milliseconds မပါ) | မဟုတ် |
| `%m` | Time stamp (milliseconds ပါ) | မဟုတ် |
| `%n` | Time stamp (milliseconds ပါ၊ Unix epoch အနေနဲ့) | မဟုတ် |
| `%i` | Command tag: session ရဲ့ လက်ရှိ command အမျိုးအစား | ဟုတ် |
| `%e` | SQLSTATE error code | မဟုတ် |
| `%c` | Session ID: အောက်မှာ ကြည့်ပါ | မဟုတ် |
| `%l` | session ဒါမှမဟုတ် process တစ်ခုချင်းစီအတွက် log line အမှတ် (1 မှ စတင်) | မဟုတ် |
| `%s` | Process စတင်တဲ့ time stamp | မဟုတ် |
| `%v` | Virtual transaction ID (procNumber/localXID); [အပိုင်း 67.1](https://www.postgresql.org/docs/current/transaction-id.html) ကို ကြည့်ပါ | မဟုတ် |
| `%x` | Transaction ID (မသတ်မှတ်ရင် 0); [အပိုင်း 67.1](https://www.postgresql.org/docs/current/transaction-id.html) ကို ကြည့်ပါ | မဟုတ် |
| `%q` | output ဘာမှ မထုတ်ပေမယ့် — non-session process များကို string ထဲက ဒီနေရာမှာ ရပ်ဖို့ ပြောပါတယ်; session process များက လျစ်လျူရှုပါတယ် | မဟုတ် |
| `%Q` | လက်ရှိ query ရဲ့ Query identifier။ Query identifier များကို default အားဖြင့် တွက်ချက်မထားတာမို့ — compute_query_id parameter ကို enable လုပ်ထားခြင်း ဒါမှမဟုတ် query identifier များကို တွက်ချက်တဲ့ third-party module တစ်ခု configure လုပ်ထားခြင်း မရှိရင် — ဒီ field က သုည ဖြစ်ပါလိမ့်မယ်။ | ဟုတ် |
| `%%` | Literal % (တိုက်ရိုက် % စာလုံး) | မဟုတ် |

Backend type က pg_stat_activity view ထဲက backend_type column နဲ့ ကိုက်ညီပါတယ်; ဒါပေမယ့် အဲဒီ view မှာ မပေါ်တဲ့ အမျိုးအစား အပိုများက log ထဲမှာ ပေါ်နိုင်ပါတယ်။
%c escape က — dot တစ်ခုနဲ့ ခွဲထားတဲ့ 4-byte hexadecimal number နှစ်ခု (ရှေ့ဆုံး သုညများ မပါ) နဲ့ ဖွဲ့စည်းထားတဲ့ — quasi-unique session identifier တစ်ခုကို print ပါတယ်။ အဲဒီ ဂဏန်းများက process စတင်တဲ့ အချိန်နဲ့ process ID ဖြစ်တာမို့ — %c ကို အဲဒီ အရာများကို နေရာ ချွေတာပြီး print လုပ်တဲ့ နည်းလမ်းအဖြစ်လည်း သုံးနိုင်ပါတယ်။ ဥပမာ — pg_stat_activity မှ session identifier ကို ထုတ်ယူဖို့ ဒီ query ကို သုံးပါ:

SELECT to_hex(trunc(EXTRACT(EPOCH FROM backend_start))::integer) || '.' ||
       to_hex(pid)
FROM pg_stat_activity;

> **အကြံပြုချက်:** log_line_prefix အတွက် empty မဟုတ်တဲ့ တန်ဖိုးတစ်ခု သတ်မှတ်ရင် — log line ရဲ့ ကျန်တဲ့ အပိုင်းနဲ့ အမြင်အာရုံအရ ခွဲခြားနိုင်ဖို့ — ပုံမှန်အားဖြင့် ၎င်းရဲ့ နောက်ဆုံး စာလုံးကို space တစ်ခု ဖြစ်စေသင့်ပါတယ်။ punctuation စာလုံးတစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။

> **အကြံပြုချက်:** Syslog က သူ့ကိုယ်ပိုင် time stamp နဲ့ process ID အချက်အလက်ကို ထုတ်ပေးတာမို့ — syslog ဆီ log လုပ်နေရင် — အဲဒီ escape များကို ထည့်သွင်းချင်မှာ မဟုတ်ပါဘူး။

> **အကြံပြုချက်:** %q escape က user ဒါမှမဟုတ် database name လို session (backend) context မှာသာ ရရှိနိုင်တဲ့ အချက်အလက်များ ထည့်သွင်းတဲ့အခါ အသုံးဝင်ပါတယ်။ ဥပမာ:
>
> log_line_prefix = '%m [%p] %q%u@%d/%a '

> **မှတ်ချက်:** %Q escape က log_statement က ထုတ်တဲ့ line များအတွက် အမြဲတမ်း သုည identifier ကို အစီရင်ခံပါတယ် — အကြောင်းကတော့ log_statement က identifier တစ်ခု တွက်ချက်မရနိုင်မီ output ကို ထုတ်ပေးလို့ပါ; identifier တွက်ချက်လို့မရတဲ့ invalid statement များလည်း ပါဝင်ပါတယ်။

- **log_lock_waits (boolean)** — session တစ်ခုက lock တစ်ခု ရယူဖို့ deadlock_timeout ထက် ကြာကြာ စောင့်တဲ့အခါ log message တစ်ခု ထုတ်လား မထုတ်လား ထိန်းချုပ်ပါတယ်။ Lock စောင့်ဆိုင်းမှုများက performance ကျဆင်းမှုကို ဖြစ်စေနေသလား ဆုံးဖြတ်ရာမှာ ဒါက အသုံးဝင်ပါတယ်။ Default က off ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_lock_failures (boolean)** — lock တစ်ခု ရယူခြင်း ကျရှုံးတဲ့အခါ အသေးစိတ် log message တစ်ခု ထုတ်လား မထုတ်လား ထိန်းချုပ်ပါတယ်။ Lock ကျရှုံးမှုများရဲ့ အကြောင်းရင်းများကို ခွဲခြမ်းစိတ်ဖြာရာမှာ ဒါက အသုံးဝင်ပါတယ်။ လောလောဆယ် — SELECT NOWAIT ကြောင့် ဖြစ်တဲ့ lock ကျရှုံးမှုများကိုသာ ထောက်ပံ့ပါတယ်။ Default က off ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_recovery_conflict_waits (boolean)** — startup process က recovery conflict များအတွက် deadlock_timeout ထက် ကြာကြာ စောင့်တဲ့အခါ log message တစ်ခု ထုတ်လား မထုတ်လား ထိန်းချုပ်ပါတယ်။ Recovery conflict များက recovery ကို WAL ကို apply လုပ်ခြင်းမှ တားဆီးနေသလား ဆုံးဖြတ်ရာမှာ ဒါက အသုံးဝင်ပါတယ်။
Default က off ဖြစ်ပါတယ်။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **log_parameter_max_length (integer)** — သုညထက် ကြီးရင် — error မဟုတ်တဲ့ statement-logging message တစ်ခုနဲ့အတူ မှတ်တမ်းတင်တဲ့ bind parameter တန်ဖိုး တစ်ခုချင်းစီကို ဒီ byte အရေအတွက်အထိ ဖြတ်တောက်ပါတယ်။ သုည က error မဟုတ်တဲ့ statement log များအတွက် bind parameter များ မှတ်တမ်းတင်ခြင်းကို disable လုပ်ပါတယ်။ -1 (default) က bind parameter များကို အပြည့်အဝ မှတ်တမ်းတင်ခွင့် ပြုပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — bytes အဖြစ် ယူပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
ဒီ setting က log_statement၊ log_min_duration_statement နဲ့ ဆက်စပ် setting များကြောင့် print ဖြစ်တဲ့ log message များကိုသာ သက်ရောက်ပါတယ်။ ဒီ setting ရဲ့ သုညမဟုတ်တဲ့ တန်ဖိုးများက overhead တချို့ ထပ်တိုးစေပါတယ် — အထူးသဖြင့် parameter များကို binary ပုံစံနဲ့ ပို့တဲ့အခါ ဖြစ်ပြီး — အဲဒီအခါ text သို့ ပြောင်းလဲခြင်း လိုအပ်လို့ပါ။
- **log_parameter_max_length_on_error (integer)** — သုညထက် ကြီးရင် — error message များထဲမှာ အစီရင်ခံတဲ့ bind parameter တန်ဖိုး တစ်ခုချင်းစီကို ဒီ byte အရေအတွက်အထိ ဖြတ်တောက်ပါတယ်။ သုည (default) က error message များထဲမှာ bind parameter များ ထည့်သွင်းခြင်းကို disable လုပ်ပါတယ်။ -1 က bind parameter များကို အပြည့်အဝ print ခွင့်ပြုပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — bytes အဖြစ် ယူပါတယ်။
ဒီ setting ရဲ့ သုညမဟုတ်တဲ့ တန်ဖိုးများက overhead ထပ်တိုးစေပါတယ် — အကြောင်းကတော့ error တစ်ခု နောက်ဆုံးမှာ ဖြစ်ဖြစ် မဖြစ်ဖြစ် — statement တစ်ခုချင်းစီရဲ့ အစမှာ parameter တန်ဖိုးများရဲ့ textual ကိုယ်စားပြုမှုများကို PostgreSQL က memory ထဲမှာ သိမ်းထားရမှာ ဖြစ်လို့ပါ။ Bind parameter များကို binary ပုံစံနဲ့ ပို့တဲ့အခါ — text အဖြစ် ပို့တာထက် — overhead ပိုကြီးပါတယ် — အကြောင်းကတော့ ပထမ အခြေအနေမှာ data ပြောင်းလဲခြင်း လိုအပ်ပြီး — ဒုတိယ အခြေအနေမှာတော့ string ကို ကူးယူရုံသာ လိုအပ်လို့ပါ။
- **log_statement (enum)** — ဘယ် SQL statement များကို မှတ်တမ်းတင်မလဲ ထိန်းချုပ်ပါတယ်။ ခွင့်ပြုတဲ့ တန်ဖိုးများက none (off)၊ ddl၊ mod နဲ့ all (statement အားလုံး) ဖြစ်ပါတယ်။ ddl က CREATE၊ ALTER နဲ့ DROP statement များလို data definition statement အားလုံးကို မှတ်တမ်းတင်ပါတယ်။ mod က ddl statement များအားလုံးအပြင် — INSERT၊ UPDATE၊ DELETE၊ TRUNCATE နဲ့ COPY FROM တို့လို data-modifying statement များကိုပါ မှတ်တမ်းတင်ပါတယ်။ PREPARE၊ EXECUTE နဲ့ EXPLAIN ANALYZE statement များကိုလည်း — ၎င်းတို့ ပါဝင်တဲ့ command က သင့်လျော်တဲ့ အမျိုးအစား ဖြစ်ရင် — မှတ်တမ်းတင်ပါတယ်။ Extended query protocol ကို အသုံးပြုတဲ့ client များအတွက် — Execute message တစ်ခု လက်ခံရရှိတဲ့အခါ မှတ်တမ်းတင်ပြီး — Bind parameter များရဲ့ တန်ဖိုးများကိုပါ ထည့်သွင်းပါတယ် (ပါဝင်တဲ့ single-quote အမှတ်အသားများကို နှစ်ဆ ဖြစ်စေခြင်းဖြင့်)။
Default က none ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။

> **မှတ်ချက်:** ရိုးရှင်းတဲ့ syntax error များ ပါဝင်တဲ့ statement များကို log_statement = all setting နဲ့တောင် မှတ်တမ်းမတင်ပါဘူး — အကြောင်းကတော့ statement အမျိုးအစား ဆုံးဖြတ်ဖို့ basic parsing လုပ်ပြီးမှသာ log message ကို ထုတ်ပေးလို့ပါ။ Extended query protocol ကိစ္စမှာလည်း — Execute အဆင့်မတိုင်မီ (ဆိုလိုတာက parse analysis ဒါမှမဟုတ် planning အတွင်း) ကျရှုံးတဲ့ statement များကို ဒီ setting က မှတ်တမ်းမတင်ပါဘူး။ အဲဒီလို statement များကို မှတ်တမ်းတင်ဖို့ log_min_error_statement ကို ERROR (ဒါမှမဟုတ် ထိုထက်နည်း) သတ်မှတ်ပါ။
> မှတ်တမ်းတင်ထားတဲ့ statement များက sensitive data နဲ့ plaintext စကားဝှက်များကိုပင် ဖော်ထုတ်နိုင်ပါတယ်။

- **log_replication_commands (boolean)** — replication command တစ်ခုချင်းစီနဲ့ walsender process ရဲ့ replication slot ရယူခြင်း/လွှတ်ခြင်းကို server log မှာ မှတ်တမ်းတင်စေပါတယ်။ Replication command အကြောင်း အသေးစိတ်အတွက် [အပိုင်း 54.4](https://www.postgresql.org/docs/current/protocol-replication.html) ကို ကြည့်ပါ။ Default တန်ဖိုးက off ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_temp_files (integer)** — temporary file အမည်များနဲ့ အရွယ်အစားများ မှတ်တမ်းတင်ခြင်းကို ထိန်းချုပ်ပါတယ်။ Temporary file များကို sorts၊ hashes နဲ့ temporary query ရလဒ်များအတွက် ဖန်တီးနိုင်ပါတယ်။ ဒီ setting က enable လုပ်ထားရင် — temporary file တစ်ခုချင်းစီကို ဖျက်တဲ့အခါ — အရွယ်အစားကို bytes နဲ့ ဖော်ပြထားတဲ့ log entry တစ်ခု ထုတ်ပေးပါတယ်။ သုည တန်ဖိုးက temporary file အချက်အလက် အားလုံးကို မှတ်တမ်းတင်ပြီး — အပေါင်းလက္ခဏာ တန်ဖိုးများကတော့ သတ်မှတ်ထားတဲ့ data ပမာဏနဲ့ ညီ ဒါမှမဟုတ် ထိုထက်ကြီးတဲ့ file များကိုသာ မှတ်တမ်းတင်ပါတယ်။ ဒီတန်ဖိုးကို unit မပါဘဲ သတ်မှတ်ရင် — kilobytes အဖြစ် ယူပါတယ်။ Default setting က -1 ဖြစ်ပြီး — အဲဒီလို မှတ်တမ်းတင်ခြင်းကို disable လုပ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
- **log_timezone (string)** — server log မှာ ရေးသားတဲ့ timestamp များအတွက် အသုံးပြုတဲ့ time zone ကို သတ်မှတ်ပါတယ်။ TimeZone နဲ့ မတူဘဲ — ဒီတန်ဖိုးက cluster-wide ဖြစ်တာမို့ — session အားလုံးက timestamp များကို တစ်ပြေးညီ အစီရင်ခံပါလိမ့်မယ်။ Built-in default က GMT ဖြစ်ပေမယ့် — ဒါကို ပုံမှန်အားဖြင့် postgresql.conf မှာ override လုပ်ပါတယ်; initdb က သူ့ system environment နဲ့ ကိုက်ညီတဲ့ setting တစ်ခုကို အဲဒီမှာ install လုပ်ပါလိမ့်မယ်။ အသေးစိတ်အတွက် [အပိုင်း 8.5.3](/docs/postgresql/datatype-datetime) ကို ကြည့်ပါ။ ဒီ parameter ကို postgresql.conf file ထဲမှာ ဒါမှမဟုတ် server command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။

### 19.8.4. Using CSV-Format Log Output (CSV format log output ကို အသုံးပြုခြင်း)

`log_destination` စာရင်းထဲမှာ `csvlog` ကို ထည့်သွင်းခြင်းက log file များကို database table တစ်ခုထဲ import လုပ်ရာမှာ အဆင်ပြေတဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။ ဒီ option က log line များကို comma-separated-values (CSV) format နဲ့ ထုတ်ပေးပြီး — အောက်ပါ column များ ပါဝင်ပါတယ်: milliseconds ပါတဲ့ time stamp၊ user အမည်၊ database အမည်၊ process ID၊ client host:port နံပါတ်၊ session ID၊ session တစ်ခုချင်းစီအတွက် line အမှတ်၊ command tag၊ session စတင်ချိန်၊ virtual transaction ID၊ regular transaction ID၊ error severity၊ SQLSTATE code၊ error message၊ error message အသေးစိတ်၊ hint၊ error ကို ဖြစ်စေတဲ့ internal query (ရှိရင်)၊ ၎င်းထဲက error တည်နေရာရဲ့ character အရေအတွက်၊ error context၊ error ကို ဖြစ်စေတဲ့ user query (ရှိပြီး `log_min_error_statement` က enable လုပ်ထားရင်)၊ ၎င်းထဲက error တည်နေရာရဲ့ character အရေအတွက်၊ PostgreSQL source code ထဲက error တည်နေရာ (`log_error_verbosity` ကို `verbose` သတ်မှတ်ထားရင်)၊ application အမည်၊ backend အမျိုးအစား၊ parallel group leader ရဲ့ process ID နဲ့ query id တို့ ဖြစ်ပါတယ်။ CSV-format log output သိမ်းဆည်းဖို့ နမူနာ table definition တစ်ခုက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```sql
CREATE TABLE postgres_log
(
  log_time timestamp(3) with time zone,
  user_name text,
  database_name text,
  process_id integer,
  connection_from text,
  session_id text,
  session_line_num bigint,
  command_tag text,
  session_start_time timestamp with time zone,
  virtual_transaction_id text,
  transaction_id bigint,
  error_severity text,
  sql_state_code text,
  message text,
  detail text,
  hint text,
  internal_query text,
  internal_query_pos integer,
  context text,
  query text,
  query_pos integer,
  location text,
  application_name text,
  backend_type text,
  leader_pid integer,
  query_id bigint,
  PRIMARY KEY (session_id, session_line_num)
);
```

ဒီ table ထဲ log file တစ်ခု import လုပ်ဖို့ `COPY FROM` command ကို သုံးပါ:

```sql
COPY postgres_log FROM '/full/path/to/logfile.csv' WITH csv;
```

ပေးထားတဲ့ [file_fdw](https://www.postgresql.org/docs/current/file-fdw.html) module ကို အသုံးပြုပြီး — file ကို foreign table တစ်ခုအဖြစ်လည်း access လုပ်နိုင်ပါတယ်။

CSV log file များ import လုပ်တာကို ရိုးရှင်းစေဖို့ လုပ်ဆောင်ရမယ့် အချက် အနည်းငယ် ရှိပါတယ်:

1. log file များအတွက် တစ်သမတ်တည်း ဖြစ်ပြီး ကြိုတင်ခန့်မှန်းနိုင်တဲ့ အမည်ပေးစနစ် (naming scheme) ရရှိဖို့ log_filename နဲ့ log_rotation_age ကို သတ်မှတ်ပါ။ ဒါက file အမည် ဘာဖြစ်မလဲ ကြိုတင်ခန့်မှန်းနိုင်စေပြီး — log file တစ်ခုချင်း ပြီးဆုံးပြီး import လုပ်ဖို့ အသင့်ဖြစ်တဲ့ အချိန်ကို သိနိုင်စေပါတယ်။
2. size အခြေခံ log rotation ကို disable လုပ်ဖို့ log_rotation_size ကို 0 သတ်မှတ်ပါ — အကြောင်းကတော့ ၎င်းက log file အမည်ကို ခန့်မှန်းရ ခက်စေလို့ပါ။
3. log data အဟောင်းများက file တစ်ခုတည်းထဲမှာ အသစ်များနဲ့ ရောမသွားစေဖို့ log_truncate_on_rotation ကို on သတ်မှတ်ပါ။
4. အထက်က table definition မှာ primary key သတ်မှတ်ချက် ပါဝင်ပါတယ်။ ဒါက တူညီတဲ့ အချက်အလက်ကို မတော်တဆ နှစ်ကြိမ် import လုပ်မိခြင်းမှ ကာကွယ်ဖို့ အသုံးဝင်ပါတယ်။ COPY command က သူ import လုပ်တဲ့ data အားလုံးကို တစ်ကြိမ်တည်း commit လုပ်တာမို့ — error တစ်ခုခုက import တစ်ခုလုံး ကျရှုံးစေပါလိမ့်မယ်။ log file တစ်စိတ်တစ်ပိုင်းကို import လုပ်ပြီး နောက်ပိုင်း file ပြည့်စုံတဲ့အခါ ထပ်မံ import လုပ်ရင် — primary key ချိုးဖောက်မှုက import ကို ကျရှုံးစေပါလိမ့်မယ်။ Import မလုပ်မီ log ပြည့်စုံပြီး ပိတ်သွားတဲ့အထိ စောင့်ပါ။ ဒီ လုပ်ထုံးလုပ်နည်းက — အပြည့်အဝ မရေးရသေးတဲ့ line တစ်စိတ်တစ်ပိုင်းကို မတော်တဆ import လုပ်မိခြင်းမှလည်း ကာကွယ်ပေးပြီး — ၎င်းကလည်း COPY ကို ကျရုံးစေမှာ ဖြစ်ပါတယ်။

### 19.8.5. Using JSON-Format Log Output (JSON format log output ကို အသုံးပြုခြင်း)

`log_destination` စာရင်းထဲမှာ `jsonlog` ကို ထည့်သွင်းခြင်းက log file များကို program အမျိုးမျိုးထဲ import လုပ်ရာမှာ အဆင်ပြေတဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။ ဒီ option က log line များကို JSON format နဲ့ ထုတ်ပေးပါတယ်။

null တန်ဖိုးရှိတဲ့ string field များကို output မှ ဖယ်ထုတ်ပါတယ်။ နောက်ပိုင်းမှာ field အပိုများ ထည့်သွင်းနိုင်ပါတယ်။ `jsonlog` output ကို process လုပ်တဲ့ user application များက မသိရတဲ့ field များကို လျစ်လျူရှုသင့်ပါတယ်။

log line တစ်ခုချင်းစီကို — [Table 19.4](/docs/postgresql/runtime-config-logging) မှာ ပြထားတဲ့ key အစုအဖွဲ့နဲ့ ၎င်းတို့နဲ့ ဆက်စပ်နေတဲ့ တန်ဖိုးများ ပါဝင်တဲ့ — JSON object တစ်ခုအဖြစ် serialize လုပ်ပါတယ်။

**Table 19.4. Keys and Values of JSON Log Entries (JSON log entry များ၏ key နှင့် တန်ဖိုးများ)**

| Key name (key အမည်) | Type (အမျိုးအစား) | Description (ဖော်ပြချက်) |
| --- | --- | --- |
| `timestamp` | string | milliseconds ပါတဲ့ time stamp |
| `user` | string | User အမည် |
| `dbname` | string | Database အမည် |
| `pid` | number | Process ID |
| `remote_host` | string | Client host |
| `remote_port` | number | Client port |
| `session_id` | string | Session ID |
| `line_num` | number | Session တစ်ခုချင်းစီအတွက် line အမှတ် |
| `ps` | string | လက်ရှိ ps display |
| `session_start` | string | Session စတင်ချိန် |
| `vxid` | string | Virtual transaction ID |
| `txid` | string | Regular transaction ID |
| `error_severity` | string | Error severity |
| `state_code` | string | SQLSTATE code |
| `message` | string | Error message |
| `detail` | string | Error message အသေးစိတ် |
| `hint` | string | Error message hint |
| `internal_query` | string | Error ကို ဖြစ်စေတဲ့ internal query |
| `internal_position` | number | Internal query ထဲကို cursor index |
| `context` | string | Error context |
| `statement` | string | Client က ပေးပို့တဲ့ query string |
| `cursor_position` | number | Query string ထဲကို cursor index |
| `func_name` | string | Error တည်နေရာရဲ့ function အမည် |
| `file_name` | string | Error တည်နေရာရဲ့ file အမည် |
| `file_line_num` | number | Error တည်နေရာရဲ့ file line နံပါတ် |
| `application_name` | string | Client application အမည် |
| `backend_type` | string | Backend အမျိုးအစား |
| `leader_pid` | number | အလုပ်လုပ်နေတဲ့ parallel worker များအတွက် leader ရဲ့ process ID |
| `query_id` | number | Query ID |

### 19.8.6. Process Title (process ခေါင်းစဉ်)

ဒီ setting များက server process များရဲ့ process ခေါင်းစဉ်များကို ဘယ်လို ပြင်ဆင်မလဲ ဆိုတာ ထိန်းချုပ်ပါတယ်။ Process ခေါင်းစဉ်များကို ပုံမှန်အားဖြင့် ps လို program များ ဒါမှမဟုတ် Windows မှာဆိုရင် Process Explorer ကို သုံးပြီး ကြည့်ရှုပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.1](/docs/postgresql/monitoring-ps) ကို ကြည့်ပါ။

- **cluster_name (string)** — ဒီ database cluster (instance) ကို ရည်ရွယ်ချက် အမျိုးမျိုးအတွက် ခွဲခြားဖော်ပြတဲ့ အမည်တစ်ခုကို သတ်မှတ်ပါတယ်။ Cluster အမည်က ဒီ cluster ထဲက server process အားလုံးရဲ့ process ခေါင်းစဉ်မှာ ပေါ်ပါတယ်။ ထို့အပြင် — ၎င်းက standby connection တစ်ခုအတွက် default application အမည် ဖြစ်ပါတယ် (synchronous_standby_names ကို ကြည့်ပါ)။
အမည်က NAMEDATALEN စာလုံးအရေအတွက်ထက် နည်းတဲ့ string တစ်ခု ဖြစ်နိုင်ပါတယ် (standard build တစ်ခုမှာ စာလုံး 64 လုံး)။ cluster_name တန်ဖိုးမှာ printable ASCII စာလုံးများကိုသာ အသုံးပြုနိုင်ပါတယ်။ အခြား စာလုံးများကို C-style hexadecimal escape များနဲ့ အစားထိုးပါတယ်။ ဒီ parameter ကို empty string '' (default) သတ်မှတ်ရင် အမည် ဘာမှ မပြပါဘူး။ ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **update_process_title (boolean)** — server က SQL command အသစ်တစ်ခု လက်ခံရရှိတိုင်း process ခေါင်းစဉ်ကို update လုပ်တာကို enable လုပ်ပါတယ်။ ဒီ setting က platform အများစုမှာ default အားဖြင့် on ဖြစ်ပေမယ့် — Windows မှာတော့ process ခေါင်းစဉ် update လုပ်ရာမှာ အဲဒီ platform ရဲ့ overhead ပိုကြီးတာကြောင့် default အားဖြင့် off ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ SET privilege ရှိတဲ့ superuser များနဲ့ user များသာ ဒီ setting ကို ပြောင်းနိုင်ပါတယ်။
