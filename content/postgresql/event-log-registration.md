---
title: "Registering Event Log on Windows (Windows ပေါ်တွင် Event Log မှတ်ပုံတင်ခြင်း)"
description: "Windows event log library (pgevent.dll) ကို regsvr32 ဖြင့် operating system ထဲ မှတ်ပုံတင်ခြင်း/မှတ်ပုံတင် ဖျက်သိမ်းခြင်း — default event source `PostgreSQL`, မတူညီသော event source name အတွက် /n နှင့် /i options, database server တွင် event logging ဖွင့်ရန် `log_destination` ၌ `eventlog` ထည့်သွင်းခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 155
source: "https://www.postgresql.org/docs/current/event-log-registration.html"
status: translated
updated: 2026-09-06
---

## 18.12. Registering Event Log on Windows (Windows ပေါ်တွင် Event Log မှတ်ပုံတင်ခြင်း)

Windows event log library (Windows event log စာကြည့်တိုက်) တစ်ခုကို operating system ထဲမှာ မှတ်ပုံတင် (register) လုပ်ဖို့ဆိုရင် — ဒီ command ကို ထုတ်ပြန်ပါ:

```sql
regsvr32 pgsql_library_directory/pgevent.dll
```

ဒါက — `PostgreSQL` လို့ နာမည်ပေးထားတဲ့ default event source (event အရင်းအမြစ်) အောက်မှာ — event viewer (event ကြည့်ရှုသည့် ကိရိယာ) က အသုံးပြုမယ့် registry entries (registry မှတ်တမ်းများ) တွေကို ဖန်တီးပါတယ်။

မတူညီတဲ့ event source name တစ်ခုကို သတ်မှတ်ချင်ရင် ([event_source](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-EVENT-SOURCE) ကို ကြည့်ပါ) — `/n` နဲ့ `/i` options တွေကို သုံးပါ:

```sql
regsvr32 /n /i:event_source_name pgsql_library_directory/pgevent.dll
```

Event log library ကို operating system ကနေ မှတ်ပုံတင် ဖျက်သိမ်း (unregister) လုပ်ဖို့ဆိုရင် — ဒီ command ကို ထုတ်ပြန်ပါ:

```sql
regsvr32 /u [/i:event_source_name] pgsql_library_directory/pgevent.dll
```

> **မှတ်ချက်:** Database server ထဲမှာ event logging ကို enable (ဖွင့်) လုပ်ဖို့ဆိုရင် — `postgresql.conf` ထဲက [log_destination](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DESTINATION) မှာ `eventlog` ပါဝင်အောင် ပြုပြင် မွမ်းမံပါ။
