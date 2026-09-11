---
title: "The pg_hba.conf File (pg_hba.conf ဖိုင်)"
description: "pg_hba.conf ဖိုင် — PostgreSQL ရဲ့ client authentication ကို ထိန်းချုပ်တဲ့ configuration ဖိုင် — ရဲ့ record ပုံစံများ၊ field တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ် (local, host, database, user, address, auth-method စသည်တို့) ၊ include directives များ၊ @ constructs များနှင့် ဥပမာ entries များအကြောင်း ရှင်းလင်းချက်"
order: 174
source: "https://www.postgresql.org/docs/current/auth-pg-hba-conf.html"
status: translated
updated: 2026-09-06
---

## 20.1. The `pg_hba.conf` File (pg_hba.conf ဖိုင်)

Client authentication (client စစ်မှန်ကြောင်း စိစစ်ခြင်း) ကို configuration ဖိုင် တစ်ခုက ထိန်းချုပ်ပါတယ် — အဲဒီဖိုင်ကို အစဉ်အလာအရ `pg_hba.conf` လို့ နာမည်ပေးပြီး — database cluster ရဲ့ data directory ထဲမှာ သိမ်းဆည်းထားပါတယ်။ (HBA ဆိုတာ host-based authentication — host အခြေပြု authentication — ရဲ့ အတိုကောက် ဖြစ်ပါတယ်။) [initdb](https://www.postgresql.org/docs/current/app-initdb.html) နဲ့ data directory ကို initialize (ကနဦး ပြင်ဆင်) လုပ်တဲ့အခါ — default `pg_hba.conf` ဖိုင် တစ်ခုကို တပ်ဆင်ပေးပါတယ်။ ဒါပေမယ့် — authentication configuration ဖိုင်ကို တခြား နေရာမှာလည်း ထားလို့ ရပါတယ်; [hba_file](https://www.postgresql.org/docs/current/runtime-config-file-locations.html#GUC-HBA-FILE) configuration parameter ကို ကြည့်ပါ။

`pg_hba.conf` ဖိုင်ကို — server စတင်ချိန်မှာ ရော — main server process က SIGHUP signal တစ်ခု လက်ခံရရှိတဲ့အခါမှာပါ ဖတ်ပါတယ်။ လည်ပတ်နေတဲ့ system တစ်ခုမှာ ဒီဖိုင်ကို တည်းဖြတ်မယ်ဆိုရင် — ဖိုင်ကို ပြန်ဖတ်စေဖို့ postmaster ကို signal ပို့ဖို့ လိုအပ်ပါတယ် (`pg_ctl reload` သုံးပြီး ဖြစ်ဖြစ် — `pg_reload_conf()` ဆိုတဲ့ SQL function ကို ခေါ်ပြီး ဖြစ်ဖြစ် — `kill -HUP` သုံးပြီး ဖြစ်ဖြစ်)။

> **မှတ်ချက်:** အပေါ်က ဖော်ပြချက်က Microsoft Windows မှာတော့ မမှန်ပါဘူး: အဲဒီမှာ — `pg_hba.conf` ဖိုင်ထဲက ပြောင်းလဲမှုတွေကို — နောက်ပိုင်း connection အသစ်တွေက ချက်ချင်း အသုံးပြုပါတယ်။

[`pg_hba_file_rules`](https://www.postgresql.org/docs/current/view-pg-hba-file-rules.html) system view က — `pg_hba.conf` ဖိုင်ဆီ ပြောင်းလဲမှုတွေကို ကြိုတင် စမ်းသပ်ဖို့ ဒါမှမဟုတ် — ဖိုင် load လုပ်တာက လိုချင်တဲ့ ရလဒ်တွေ မဖြစ်ထွန်းခဲ့ရင် ပြဿနာတွေကို စစ်ဆေး ဖော်ထုတ်ဖို့ အသုံးဝင်ပါတယ်။ View ထဲမှာ `error` field တွေ null မဟုတ်တဲ့ row တွေက — ဖိုင်ထဲက သက်ဆိုင်ရာ line တွေမှာ ပြဿနာတွေ ရှိနေတာကို ညွှန်ပြပါတယ်။

`pg_hba.conf` ဖိုင်ရဲ့ ယေဘုယျ ပုံစံကတော့ — တစ်ကြောင်းလျှင် record တစ်ခုနှုန်းနဲ့ — records တွေ အစုတစ်ခု ဖြစ်ပါတယ်။ ဗလာ line တွေကို လျစ်လျူရှုပြီး — `#` comment character နောက်မှာ ရှိတဲ့ စာသား တွေကိုလည်း လျစ်လျူရှုပါတယ်။ Record တစ်ခုကို — line ရဲ့ အဆုံးမှာ backslash နဲ့ အဆုံးသတ်ခြင်းအားဖြင့် — နောက် line ပေါ်ကို ဆက်လို့ ရပါတယ်။ (Backslash တွေက line တစ်ခုရဲ့ အဆုံးမှာကလွဲရင် အထူး အဓိပ္ပာယ် မရှိပါဘူး။) Record တစ်ခုကို — spaces နဲ့/သို့မဟုတ် tabs တွေနဲ့ ပိုင်းခြားထားတဲ့ — field ပေါင်းများစွာနဲ့ ဖွဲ့စည်းထားပါတယ်။ Field value ကို double-quote လုပ်ထားရင် — field တွေထဲမှာ white space (နေရာလွတ်) တွေ ပါဝင်နိုင်ပါတယ်။ Database, user ဒါမှမဟုတ် address field ထဲက keyword တွေထဲက တစ်ခုကို (ဥပမာ — `all` ဒါမှမဟုတ် `replication`) quote လုပ်လိုက်ရင် — အဲဒီ စကားလုံးက သူ့ရဲ့ အထူး အဓိပ္ပာယ်ကို ဆုံးရှုံးပြီး — အဲဒီ နာမည်နဲ့ database, user ဒါမှမဟုတ် host တစ်ခုကိုပဲ ကိုက်ညီစေပါတယ်။ Backslash နဲ့ line continuation လုပ်ခြင်းက — quote လုပ်ထားတဲ့ စာသားတွေ ဒါမှမဟုတ် comments တွေ အတွင်းမှာတောင် အကျုံးဝင်ပါတယ်။

Authentication record တစ်ခုချင်းစီက — connection type တစ်ခု၊ client IP address range (client ရဲ့ IP address အကွာအဝေး — connection type အတွက် သက်ဆိုင်ရင်)၊ database name တစ်ခု၊ user name တစ်ခု နဲ့ — ဒီ parameters တွေနဲ့ ကိုက်ညီတဲ့ connections တွေအတွက် သုံးရမယ့် authentication method တစ်ခုကို သတ်မှတ်ပါတယ်။ Connection type၊ client address၊ တောင်းဆိုထားတဲ့ database နဲ့ user name တွေ ကိုက်ညီတဲ့ — ပထမဆုံး record ကို authentication လုပ်ဆောင်ဖို့ သုံးပါတယ်။ “Fall-through” (ဆက်လက် ကျော်လွှားခြင်း) ဒါမှမဟုတ် “backup” (အရန်) ဆိုတာ မရှိပါဘူး: record တစ်ခု ရွေးချယ်ခံရပြီး authentication မအောင်မြင်ခဲ့ရင် — နောက် records တွေကို ထည့်သွင်း စဉ်းစားမှာ မဟုတ်ပါဘူး။ Record တစ်ခုမှ မကိုက်ညီခဲ့ရင် — access (ဝင်ရောက်ခွင့်) ကို ငြင်းပယ်ပါတယ်။

Record တစ်ခုစီက include directive (ဖိုင်ထည့်သွင်းမှု ညွှန်ကြားချက်) တစ်ခု ဒါမှမဟုတ် authentication record တစ်ခု ဖြစ်နိုင်ပါတယ်။ Include directives တွေက — ထပ်ဆောင်း records တွေ ပါဝင်တဲ့ — ထည့်သွင်းနိုင်တဲ့ ဖိုင်တွေကို သတ်မှတ်ပါတယ်။ အဲဒီ records တွေကို include directives တွေ ရှိတဲ့ နေရာမှာ အစားထိုး ထည့်သွင်းမှာ ဖြစ်ပါတယ်။ Include directives တွေမှာ field နှစ်ခုပဲ ပါပါတယ်: `include`, `include_if_exists` ဒါမှမဟုတ် `include_dir` directive တစ်ခု နဲ့ — ထည့်သွင်းရမယ့် ဖိုင် ဒါမှမဟုတ် directory တစ်ခုပါ။ ဖိုင် ဒါမှမဟုတ် directory က relative (နှိုင်းယှဉ်) ဒါမှမဟုတ် absolute (အကြွင်းမဲ့) path တစ်ခု ဖြစ်နိုင်ပြီး — double-quote လုပ်လို့လည်း ရပါတယ်။ `include_dir` ပုံစံအတွက်ဆိုရင် — `.` နဲ့ မစတင်ဘဲ `.conf` နဲ့ အဆုံးသတ်တဲ့ ဖိုင်တွေ အားလုံးကို ထည့်သွင်းပါတယ်။ Include directory အတွင်းက ဖိုင် အများအပြားကို — ဖိုင် နာမည် အစီအစဉ်အတိုင်း (C locale စည်းမျဉ်းတွေအရ — ဆိုလိုတာက ဂဏန်းတွေက စာလုံးတွေ ရှေ့မှာ လာပြီး — စာလုံးအကြီးတွေက စာလုံးအသေးတွေ ရှေ့မှာ လာပါတယ်) လုပ်ဆောင်ပါတယ်။

Record တစ်ခုက ပုံစံ အမျိုးမျိုး ရှိနိုင်ပါတယ်:

```sql
local               database  user  auth-method [auth-options]
host                database  user  address     auth-method  [auth-options]
hostssl             database  user  address     auth-method  [auth-options]
hostnossl           database  user  address     auth-method  [auth-options]
hostgssenc          database  user  address     auth-method  [auth-options]
hostnogssenc        database  user  address     auth-method  [auth-options]
host                database  user  IP-address  IP-mask      auth-method  [auth-options]
hostssl             database  user  IP-address  IP-mask      auth-method  [auth-options]
hostnossl           database  user  IP-address  IP-mask      auth-method  [auth-options]
hostgssenc          database  user  IP-address  IP-mask      auth-method  [auth-options]
hostnogssenc        database  user  IP-address  IP-mask      auth-method  [auth-options]
include             file
include_if_exists   file
include_dir         directory
```

Field တွေရဲ့ အဓိပ္ပာယ်က အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

- **local** — ဒီ record က Unix-domain sockets တွေကို သုံးပြီး ပြုလုပ်တဲ့ connection ကြိုးစားမှုတွေနဲ့ ကိုက်ညီပါတယ်။ ဒီ type ရဲ့ record တစ်ခု မရှိဘူးဆိုရင် — Unix-domain socket connections တွေကို ခွင့်မပြုပါဘူး။
- **host** — ဒီ record က TCP/IP သုံးပြီး ပြုလုပ်တဲ့ connection ကြိုးစားမှုတွေနဲ့ ကိုက်ညီပါတယ်။ host records တွေက SSL သုံးတဲ့ ဒါမှမဟုတ် မသုံးတဲ့ connection ကြိုးစားမှုတွေကိုရော — GSSAPI နဲ့ encrypt (ကုဒ်ဝှက်) လုပ်ထားတဲ့ ဒါမှမဟုတ် မလုပ်ထားတဲ့ connection ကြိုးစားမှုတွေကိုပါ ကိုက်ညီပါတယ်။

> **မှတ်ချက်:** Remote TCP/IP connections တွေက — server ကို listen_addresses configuration parameter အတွက် သင့်လျော်တဲ့ တန်ဖိုးတစ်ခုနဲ့ မစတင်ထားရင် — မဖြစ်နိုင်ပါဘူး — အကြောင်းကတော့ TCP/IP connections တွေအတွက် — local loopback address ဖြစ်တဲ့ localhost ပေါ်မှာပဲ listen လုပ်တာက default အပြုအမူ ဖြစ်လို့ပါ။

- **hostssl** — ဒီ record က TCP/IP သုံးပြီး ပြုလုပ်တဲ့ connection ကြိုးစားမှုတွေနဲ့ — SSL encryption နဲ့ ပြုလုပ်ထားတဲ့ connections တွေမှာပဲ — ကိုက်ညီပါတယ်။ ဒီ option ကို သုံးနိုင်ဖို့ — server ကို SSL support နဲ့ တည်ဆောက်ထားရပါမယ်။ ထို့အပြင် — ssl configuration parameter ကို သတ်မှတ်ပြီး SSL ကို enable (ဖွင့်) ထားရပါမယ် (အသေးစိတ်အတွက် အပိုင်း 18.9 ကို ကြည့်ပါ)။ မဟုတ်ရင် — hostssl record ကို — ဘယ် connections တွေနဲ့မှ မကိုက်ညီနိုင်ဘူးဆိုတဲ့ warning (သတိပေးချက်) တစ်ခုကို log လုပ်တာကလွဲလို့ — လျစ်လျူရှုပါတယ်။
- **hostnossl** — ဒီ record type က hostssl ရဲ့ ဆန့်ကျင်ဘက် အပြုအမူ ရှိပါတယ်; SSL မသုံးဘဲ TCP/IP ပေါ်မှာ ပြုလုပ်တဲ့ connection ကြိုးစားမှုတွေနဲ့ပဲ ကိုက်ညီပါတယ်။
- **hostgssenc** — ဒီ record က TCP/IP သုံးပြီး ပြုလုပ်တဲ့ connection ကြိုးစားမှုတွေနဲ့ — GSSAPI encryption နဲ့ ပြုလုပ်ထားတဲ့ connections တွေမှာပဲ — ကိုက်ညီပါတယ်။ ဒီ option ကို သုံးနိုင်ဖို့ — server ကို GSSAPI support နဲ့ တည်ဆောက်ထားရပါမယ်။ မဟုတ်ရင် — hostgssenc record ကို — ဘယ် connections တွေနဲ့မှ မကိုက်ညီနိုင်ဘူးဆိုတဲ့ warning တစ်ခုကို log လုပ်တာကလွဲလို့ — လျစ်လျူရှုပါတယ်။
- **hostnogssenc** — ဒီ record type က hostgssenc ရဲ့ ဆန့်ကျင်ဘက် အပြုအမူ ရှိပါတယ်; GSSAPI encryption မသုံးဘဲ TCP/IP ပေါ်မှာ ပြုလုပ်တဲ့ connection ကြိုးစားမှုတွေနဲ့ပဲ ကိုက်ညီပါတယ်။
- **database** — ဒီ record က ဘယ် database name (တွေ) နဲ့ ကိုက်ညီလဲ သတ်မှတ်ပါတယ်။ `all` ဆိုတဲ့ တန်ဖိုးက databases အားလုံးနဲ့ ကိုက်ညီတယ်လို့ သတ်မှတ်ပြီး — `sameuser` ဆိုတဲ့ တန်ဖိုးက — တောင်းဆိုထားတဲ့ database ရဲ့ နာမည်က တောင်းဆိုထားတဲ့ user ရဲ့ နာမည်နဲ့ တူညီနေရင် — record က ကိုက်ညီတယ်လို့ သတ်မှတ်ပါတယ်။ `samerole` ဆိုတဲ့ တန်ဖိုးက — တောင်းဆိုထားတဲ့ user က — တောင်းဆိုထားတဲ့ database နဲ့ နာမည်တူတဲ့ role ရဲ့ အဖွဲ့ဝင် (member) တစ်ယောက် ဖြစ်ရမယ်လို့ သတ်မှတ်ပါတယ်။ (samegroup က samerole ရဲ့ — အသုံးမပြုတော့ပေမယ့် လက်ခံနေဆဲ — စာလုံးပေါင်း တစ်မျိုး ဖြစ်ပါတယ်။) Superusers တွေကို — samerole ရည်ရွယ်ချက်တွေအတွက် — သူတို့က အဲဒီ role ရဲ့ အဖွဲ့ဝင်တွေ အနေနဲ့ တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက်၍ ထင်ရှားစွာ (explicitly) ပါဝင်နေမှသာ — role တစ်ခုရဲ့ အဖွဲ့ဝင်တွေအဖြစ် မှတ်ယူပြီး — superuser ဖြစ်ရုံ တစ်ခုတည်းနဲ့တော့ မှတ်ယူလို့ မရပါဘူး။ `replication` ဆိုတဲ့ တန်ဖိုးက — physical replication connection တစ်ခုကို တောင်းဆိုထားရင် record က ကိုက်ညီတယ်လို့ သတ်မှတ်ပေမယ့် — logical replication connections တွေနဲ့တော့ မကိုက်ညီပါဘူး။ Physical replication connections တွေက ဘယ် database တစ်ခုကိုမှ သတ်မှတ်မပေးဘူး ဆိုတာ သတိပြုပါ — logical replication connections တွေကတော့ သတ်မှတ်ပေးပါတယ်။ ကျန်တဲ့ ကိစ္စတွေမှာ — ဒါက တိကျတဲ့ PostgreSQL database တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် regular expression (စာသားပုံစံ ကိုက်ညီမှု စကားရပ်) တစ်ခု ဖြစ်ပါတယ်။ Database name အများအပြားနဲ့/သို့မဟုတ် regular expressions တွေကို — comma တွေနဲ့ ခွဲခြားပြီး ထောက်ပံ့ပေးနိုင်ပါတယ်။ Database name က slash (/) တစ်ခုနဲ့ စတင်ရင် — name ရဲ့ ကျန် အပိုင်းကို regular expression အဖြစ် သဘောထားပါတယ်။ (PostgreSQL ရဲ့ regular expression syntax အသေးစိတ်အတွက် အပိုင်း 9.7.3.1 ကို ကြည့်ပါ။) Database names နဲ့/သို့မဟုတ် regular expressions တွေ ပါဝင်တဲ့ သီးခြား ဖိုင် တစ်ခုကို — ဖိုင် နာမည်ရဲ့ ရှေ့မှာ @ ထည့်ပြီး သတ်မှတ်နိုင်ပါတယ်။
- **user** — ဒီ record က ဘယ် database user name (တွေ) နဲ့ ကိုက်ညီလဲ သတ်မှတ်ပါတယ်။ `all` ဆိုတဲ့ တန်ဖိုးက users အားလုံးနဲ့ ကိုက်ညီတယ်လို့ သတ်မှတ်ပါတယ်။ ကျန်တဲ့ ကိစ္စတွေမှာ — ဒါက တိကျတဲ့ database user တစ်ယောက်ရဲ့ နာမည်၊ (slash (/) နဲ့ စတင်ရင်) regular expression တစ်ခု ဒါမှမဟုတ် + နဲ့ ရှေ့ဆွဲထားတဲ့ group name တစ်ခု ဖြစ်ပါတယ်။ (PostgreSQL မှာ users နဲ့ groups တွေကြားမှာ တကယ့် ခြားနားချက် မရှိတာ သတိရပါ; + အမှတ်အသားက တကယ်တော့ “ဒီ role ရဲ့ တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက် အဖွဲ့ဝင် ဖြစ်နေတဲ့ roles တွေထဲက တစ်ခုခုကို ကိုက်ညီစေ” လို့ ဆိုလိုပြီး — + မပါတဲ့ နာမည်တစ်ခုကတော့ အဲဒီ တိကျတဲ့ role တစ်ခုတည်းကိုပဲ ကိုက်ညီပါတယ်။) ဒီရည်ရွယ်ချက်အတွက် — superuser တစ်ယောက်ကို — သူက အဲဒီ role ရဲ့ အဖွဲ့ဝင် တစ်ယောက်အနေနဲ့ တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက်၍ ထင်ရှားစွာ ပါဝင်နေမှသာ — အဖွဲ့ဝင် တစ်ယောက်အဖြစ် မှတ်ယူပြီး — superuser ဖြစ်ရုံ တစ်ခုတည်းနဲ့တော့ မှတ်ယူလို့ မရပါဘူး။ User name အများအပြားနဲ့/သို့မဟုတ် regular expressions တွေကို — comma တွေနဲ့ ခွဲခြားပြီး ထောက်ပံ့ပေးနိုင်ပါတယ်။ User name က slash (/) တစ်ခုနဲ့ စတင်ရင် — name ရဲ့ ကျန် အပိုင်းကို regular expression အဖြစ် သဘောထားပါတယ်။ (PostgreSQL ရဲ့ regular expression syntax အသေးစိတ်အတွက် အပိုင်း 9.7.3.1 ကို ကြည့်ပါ။) User names နဲ့/သို့မဟုတ် regular expressions တွေ ပါဝင်တဲ့ သီးခြား ဖိုင် တစ်ခုကို — ဖိုင် နာမည်ရဲ့ ရှေ့မှာ @ ထည့်ပြီး သတ်မှတ်နိုင်ပါတယ်။
- **address** — ဒီ record က ကိုက်ညီမယ့် client machine address (တွေ) ကို သတ်မှတ်ပါတယ်။ ဒီ field မှာ host name တစ်ခု၊ IP address range (IP address အကွာအဝေး) တစ်ခု ဒါမှမဟုတ် အောက်မှာ ဖော်ပြထားတဲ့ အထူး key words တွေထဲက တစ်ခုကို ပါဝင်စေနိုင်ပါတယ်။ IP address range တစ်ခုကို — range ရဲ့ စတင်တဲ့ address ကို standard ဂဏန်း သင်္ကေတ (standard numeric notation) နဲ့ ရေးပြီး — နောက်မှာ slash (/) နဲ့ CIDR mask length (CIDR mask အလျား) တစ်ခု ထည့်ပြီး သတ်မှတ်ပါတယ်။ Mask length က client IP address ရဲ့ — ကိုက်ညီရမယ့် — high-order bits (ဘယ်ဘက်စွန်း bit များ) အရေအတွက်ကို ညွှန်ပြပါတယ်။ ဒီထက်ညာဘက် ကျန်တဲ့ bits တွေက — ပေးထားတဲ့ IP address ထဲမှာ zero ဖြစ်ရပါမယ်။ IP address၊ / နဲ့ CIDR mask length တို့ကြားမှာ white space မရှိရပါဘူး။ ဒီနည်းနဲ့ သတ်မှတ်ထားတဲ့ IPv4 address range တစ်ခုရဲ့ ပုံမှန် ဥပမာတွေကတော့ — host တစ်ခုတည်းအတွက် 172.20.143.89/32၊ network ငယ်တစ်ခုအတွက် 172.20.143.0/24 ဒါမှမဟုတ် ပိုကြီးတဲ့ network တစ်ခုအတွက် 10.6.0.0/16 တို့ ဖြစ်ပါတယ်။ IPv6 address range တစ်ခုကတော့ — host တစ်ခုတည်းအတွက် (ဒီကိစ္စမှာ IPv6 loopback address ဖြစ်တဲ့) ::1/128 ဒါမှမဟုတ် network ငယ်တစ်ခုအတွက် fe80::7a31:c1ff:0000:0000/96 လို ပုံ ရှိနိုင်ပါတယ်။ 0.0.0.0/0 က IPv4 addresses အားလုံးကို ကိုယ်စားပြုပြီး — ::0/0 က IPv6 addresses အားလုံးကို ကိုယ်စားပြုပါတယ်။ Host တစ်ခုတည်း သတ်မှတ်ဖို့ — IPv4 အတွက် mask length 32 ကို သုံးပြီး — IPv6 အတွက် 128 ကို သုံးပါ။ Network address တစ်ခုမှာ — နောက်ဆုံးက zero တွေကို ချန်လှပ်မထားပါနဲ့။ IPv4 format နဲ့ ပေးထားတဲ့ entry တစ်ခုက IPv4 connections တွေနဲ့ပဲ ကိုက်ညီပြီး — IPv6 format နဲ့ ပေးထားတဲ့ entry တစ်ခုက IPv6 connections တွေနဲ့ပဲ ကိုက်ညီပါတယ် — ကိုယ်စားပြုထားတဲ့ address က IPv4-in-IPv6 range ထဲမှာ ရှိနေရင်တောင် ဖြစ်ပါတယ်။ ဘယ် IP address နဲ့မဆို ကိုက်ညီဖို့ all ကိုလည်း ရေးနိုင်ပြီး — server ရဲ့ ကိုယ်ပိုင် IP addresses တွေထဲက တစ်ခုခုနဲ့ ကိုက်ညီဖို့ samehost၊ ဒါမှမဟုတ် server က တိုက်ရိုက် ချိတ်ဆက်ထားတဲ့ subnet တစ်ခုခုထဲက address တစ်ခုခုနဲ့ ကိုက်ညီဖို့ samenet ဆိုပြီး ရေးနိုင်ပါတယ်။ Host name တစ်ခု သတ်မှတ်ထားရင် (IP address range ဒါမှမဟုတ် အထူး key word မဟုတ်တဲ့ ဘာမဆို host name အဖြစ် သဘောထားပါတယ်) — အဲဒီ name ကို client ရဲ့ IP address ရဲ့ reverse name resolution (ပြောင်းပြန် name ဖြေရှင်းမှု — ဥပမာ DNS သုံးရင် reverse DNS lookup) ရဲ့ ရလဒ်နဲ့ နှိုင်းယှဉ်ပါတယ်။ Host name နှိုင်းယှဉ်မှုတွေက case sensitive (စာလုံး အကြီး/အသေး ခွဲခြားမှု) မဟုတ်ပါဘူး။ ကိုက်ညီမှု ရှိရင် — host name ပေါ်မှာ forward name resolution (ရှေ့သို့ name ဖြေရှင်းမှု — ဥပမာ forward DNS lookup) တစ်ခုကို လုပ်ပြီး — အဲဒါက ဖြေရှင်းပေးတဲ့ addresses တွေထဲက တစ်ခုခုက client ရဲ့ IP address နဲ့ တူမတူ စစ်ဆေးပါတယ်။ ဦးတည်ချက် နှစ်ခုလုံး ကိုက်ညီရင် — entry က ကိုက်ညီတယ်လို့ မှတ်ယူပါတယ်။ (pg_hba.conf ထဲမှာ သုံးတဲ့ host name က — client ရဲ့ IP address ရဲ့ address-to-name resolution က ပြန်ပေးတဲ့ host name ဖြစ်သင့်ပါတယ် — မဟုတ်ရင် အဲဒီ line က ကိုက်ညီမှာ မဟုတ်ပါဘူး။ Host name databases တချို့က IP address တစ်ခုကို host name အများအပြားနဲ့ ဆက်စပ်ခွင့် ပြုပေမယ့် — IP address တစ်ခုကို ဖြေရှင်းဖို့ တောင်းဆိုတဲ့အခါ operating system က host name တစ်ခုကိုပဲ ပြန်ပေးပါလိမ့်မယ်။) Dot (.) တစ်ခုနဲ့ စတင်တဲ့ host name specification တစ်ခုက — တကယ့် host name ရဲ့ နောက်ဆုံး အပိုင်း (suffix) တစ်ခုနဲ့ ကိုက်ညီပါတယ်။ ဒါကြောင့် .example.com က foo.example.com နဲ့ ကိုက်ညီပါလိမ့်မယ် (example.com ကိုယ်တိုင်နဲ့တော့ မကိုက်ညီပါဘူး)။ pg_hba.conf ထဲမှာ host names တွေ သတ်မှတ်ထားတဲ့အခါ — name resolution က ကျိုးကြောင်းဆီလျော်လောက်အောင် မြန်နေအောင် သေချာ လုပ်သင့်ပါတယ်။ nscd လို local name resolution cache (ပြည်တွင်း name ဖြေရှင်းမှု ကက်ရှ်) တစ်ခု တပ်ဆင်ထားတာက အကျိုးရှိနိုင်ပါတယ်။ ထို့အပြင် — log ထဲမှာ IP address အစား client ရဲ့ host name ကို မြင်ချင်ရင် — log_hostname configuration parameter ကို enable လုပ်ချင်နိုင်ပါတယ်။ ဒီ field တွေက local records တွေနဲ့တော့ မသက်ဆိုင်ပါဘူး။

> **မှတ်ချက်:** Host names တွေကို — client ရဲ့ IP address ကို reverse lookup လုပ်တာ အပါအဝင် — name resolution နှစ်ခုပါတဲ့ — ဒီလို ရှုပ်ထွေးပုံ ရတဲ့ နည်းလမ်းနဲ့ ဘာကြောင့် ကိုင်တွယ်သလဲဆိုတာကို users တွေ တခါတရံ အံ့သြမိပါတယ်။ Client ရဲ့ reverse DNS entry ကို တပ်ဆင်မထားဘူး ဒါမှမဟုတ် မလိုလားအပ်တဲ့ host name တစ်ခုကို ပြန်ပေးနေတဲ့ အခြေအနေမျိုးမှာ — ဒါက ဒီ feature ရဲ့ အသုံးပြုမှုကို ရှုပ်ထွေးစေပါတယ်။ ဒါကို အဓိကအားဖြင့် ထိရောက်မှု (efficiency) အတွက် လုပ်ထားတာပါ: ဒီနည်းနဲ့ — connection ကြိုးစားမှု တစ်ခုက — resolver lookups အများဆုံး နှစ်ခုပဲ လိုပါတယ် — reverse တစ်ခုနဲ့ forward တစ်ခုပါ။ Address တစ်ခုခုမှာ resolver ပြဿနာ ရှိနေရင် — အဲဒါက အဲဒီ client တစ်ယောက်တည်းရဲ့ ပြဿနာ ဖြစ်သွားပါတယ်။ Forward lookups တွေပဲ လုပ်တဲ့ — စိတ်ကူးယဉ် အခြားနည်းလမ်း (hypothetical alternative implementation) တစ်ခုဆိုရင် — connection ကြိုးစားမှု တစ်ခုချင်းစီအတွင်း — pg_hba.conf ထဲမှာ ဖော်ပြထားတဲ့ host name တိုင်းကို resolve လုပ်ဖို့ လိုပါလိမ့်မယ်။ Name အများကြီး စာရင်းပြုထားရင် ဒါက အတော် နှေးကွေးစေနိုင်ပါတယ်။ ပြီးတော့ — host names တွေထဲက တစ်ခုမှာ resolver ပြဿနာ ရှိနေရင် — အဲဒါက လူတိုင်းရဲ့ ပြဿနာ ဖြစ်သွားပါတယ်။
>
> ထို့အပြင် — suffix matching (နောက်ဆုံး အပိုင်း ကိုက်ညီမှု) feature ကို အကောင်အထည် ဖော်ဖို့ reverse lookup တစ်ခု လိုအပ်ပါတယ် — အကြောင်းကတော့ pattern နဲ့ နှိုင်းယှဉ်ဖို့ တကယ့် client host name ကို သိထားဖို့ လိုလို့ပါ။
>
> ဒီအပြုအမူက — host name အခြေပြု access control တွေရဲ့ တခြား လူကြိုက်များတဲ့ implementations တွေ — ဥပမာ Apache HTTP Server နဲ့ TCP Wrappers — နဲ့ ကိုက်ညီတယ်ဆိုတာ သတိပြုပါ။

- **IP-address IP-mask** — ဒီ field နှစ်ခုကို — IP-address/mask-length notation ရဲ့ အစားထိုး တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။ Mask length ကို သတ်မှတ်မည့်အစား — တကယ့် mask ကို သီးခြား column တစ်ခုမှာ သတ်မှတ်ပါတယ်။ ဥပမာ — 255.0.0.0 က IPv4 CIDR mask length 8 ကို ကိုယ်စားပြုပြီး — 255.255.255.255 က CIDR mask length 32 ကို ကိုယ်စားပြုပါတယ်။ ဒီ field တွေက local records တွေနဲ့တော့ မသက်ဆိုင်ပါဘူး။
- **auth-method** — connection တစ်ခုက ဒီ record နဲ့ ကိုက်ညီတဲ့အခါ သုံးရမယ့် authentication method ကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ ရွေးချယ်စရာတွေကို ဒီမှာ အကျဉ်းချုပ် ဖော်ပြထားပြီး — အသေးစိတ်ကို အပိုင်း 20.3 မှာ ကြည့်ပါ။ Options တွေ အားလုံးက lowercase ဖြစ်ပြီး — case sensitive (စာလုံး အကြီး/အသေး ခွဲခြားမှု) ရှိတဲ့အနေနဲ့ သဘောထားပါတယ် — ဒါကြောင့် ldap လို acronym တွေတောင် lowercase နဲ့ပဲ သတ်မှတ်ရပါမယ်။

- **trust** — connection ကို ခြွင်းချက် မရှိ ခွင့်ပြုပါတယ်။ ဒီ method က — PostgreSQL database server ဆီ connect လုပ်နိုင်တဲ့ ဘယ်သူမဆို — စကားဝှက် ဒါမှမဟုတ် တခြား authentication တစ်ခုခု မလိုအပ်ဘဲ — သူတို့ လိုချင်တဲ့ PostgreSQL user ဘယ်သူ့အဖြစ်နဲ့မဆို log in လုပ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.4 ကို ကြည့်ပါ။
- **reject** — connection ကို ခြွင်းချက် မရှိ ငြင်းပယ်ပါတယ်။ ဒါက — group တစ်ခုထဲကနေ host တချို့ကို “စစ်ထုတ် ဖယ်ရှားဖို့” အသုံးဝင်ပါတယ် — ဥပမာ — reject line တစ်ခုက တိကျတဲ့ host တစ်ခုကို connect မလုပ်နိုင်အောင် ပိတ်ဆို့နိုင်ပြီး — နောက် line တစ်ခုကတော့ — ကျန် hosts တွေကို network တစ်ခု အတွင်းမှာ connect ခွင့် ပြုနိုင်ပါတယ်။
- **scram-sha-256** — user ရဲ့ စကားဝှက်ကို စစ်ဆေးဖို့ SCRAM-SHA-256 authentication ကို လုပ်ဆောင်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.5 ကို ကြည့်ပါ။
- **md5** — user ရဲ့ စကားဝှက်ကို စစ်ဆေးဖို့ SCRAM-SHA-256 ဒါမှမဟုတ် MD5 authentication ကို လုပ်ဆောင်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.5 ကို ကြည့်ပါ။

> **သတိပေးချက်:** MD5 နဲ့ encrypt လုပ်ထားတဲ့ စကားဝှက်တွေအတွက် ထောက်ပံ့မှုက deprecated (ရပ်ဆိုင်းရန် စီစဉ်ထားသော) ဖြစ်ပြီး — PostgreSQL ရဲ့ အနာဂတ် release တစ်ခုမှာ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။ တခြား စကားဝှက် type တစ်ခုဆီ ပြောင်းရွှေ့ခြင်းအကြောင်း အသေးစိတ်အတွက် အပိုင်း 20.5 ကို ကိုးကားပါ။

- **password** — authentication အတွက် client က encrypt မလုပ်ထားတဲ့ (unencrypted) စကားဝှက် တစ်ခု ပေးပို့ဖို့ လိုအပ်ပါတယ်။ စကားဝှက်ကို network ပေါ်မှာ ရှင်းလင်းတဲ့ စာသား (clear text) အနေနဲ့ ပို့လွှတ်တာမို့ — ယုံကြည်စိတ်ချရမှု မရှိတဲ့ (untrusted) networks တွေပေါ်မှာ ဒါကို မသုံးသင့်ပါဘူး။ အသေးစိတ်အတွက် အပိုင်း 20.5 ကို ကြည့်ပါ။
- **gss** — user ကို authenticate လုပ်ဖို့ GSSAPI ကို သုံးပါတယ်။ ဒါက TCP/IP connections တွေအတွက်ပဲ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.6 ကို ကြည့်ပါ။ GSSAPI encryption နဲ့ တွဲဖက် သုံးနိုင်ပါတယ်။
- **sspi** — user ကို authenticate လုပ်ဖို့ SSPI ကို သုံးပါတယ်။ ဒါက Windows ပေါ်မှာပဲ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.7 ကို ကြည့်ပါ။
- **ident** — client ပေါ်က ident server ကို ဆက်သွယ်ပြီး — client ရဲ့ operating system user name ကို ရယူကာ — အဲဒါက တောင်းဆိုထားတဲ့ database user name နဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါတယ်။ Ident authentication ကို TCP/IP connections တွေပေါ်မှာပဲ သုံးနိုင်ပါတယ်။ Local connections တွေအတွက် သတ်မှတ်ထားရင် — အဲဒီအစား peer authentication ကို သုံးပါလိမ့်မယ်။ အသေးစိတ်အတွက် အပိုင်း 20.8 ကို ကြည့်ပါ။
- **peer** — operating system ကနေ client ရဲ့ operating system user name ကို ရယူပြီး — အဲဒါက တောင်းဆိုထားတဲ့ database user name နဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါတယ်။ ဒါက local connections တွေအတွက်ပဲ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.9 ကို ကြည့်ပါ။
- **ldap** — LDAP server တစ်ခုကို သုံးပြီး authenticate လုပ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.10 ကို ကြည့်ပါ။
- **radius** — RADIUS server တစ်ခုကို သုံးပြီး authenticate လုပ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.11 ကို ကြည့်ပါ။
- **cert** — SSL client certificates တွေကို သုံးပြီး authenticate လုပ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.12 ကို ကြည့်ပါ။
- **pam** — operating system က ထောက်ပံ့တဲ့ Pluggable Authentication Modules (PAM) service ကို သုံးပြီး authenticate လုပ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.13 ကို ကြည့်ပါ။
- **bsd** — operating system က ထောက်ပံ့တဲ့ BSD Authentication service ကို သုံးပြီး authenticate လုပ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.14 ကို ကြည့်ပါ။
- **oauth** — third-party OAuth 2.0 identity provider (ပြင်ပ OAuth 2.0 မည်သူမည်ဝါ ဖြစ်ကြောင်း ထောက်ခံပေးသူ) တစ်ခုကို သုံးပြီး — authorize (ခွင့်ပြု) လုပ်ပြီး — option အဖြစ် authenticate လည်း လုပ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.15 ကို ကြည့်ပါ။
- **auth-options** — auth-method field ပြီးနောက်မှာ — authentication method အတွက် options တွေကို သတ်မှတ်ပေးတဲ့ — name=value ပုံစံ field (တွေ) ရှိနိုင်ပါတယ်။ Authentication method တစ်ခုချင်းစီအတွက် ဘယ် options တွေ ရနိုင်လဲဆိုတဲ့ အသေးစိတ်ကို အောက်မှာ ဖော်ပြထားပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့ method-specific options တွေအပြင် — method နဲ့ မသက်ဆိုင်တဲ့ authentication option တစ်ခုဖြစ်တဲ့ clientcert လည်း ရှိပါတယ် — ဒါကို hostssl record ဘယ်ခုမှာမဆို သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို verify-ca ဒါမှမဟုတ် verify-full ဆိုပြီး သတ်မှတ်နိုင်ပါတယ်။ Option နှစ်ခုလုံးက client က valid (ယုံကြည်စိတ်ချရသော — trusted) SSL certificate တစ်ခု တင်ပြဖို့ လိုအပ်ပြီး — verify-full က ထပ်ဆောင်းပြီး — certificate ထဲက cn (Common Name) က username ဒါမှမဟုတ် သင့်လျော်တဲ့ mapping တစ်ခုနဲ့ ကိုက်ညီတယ်လို့ အတင်းအကျပ် စစ်ဆေးပါတယ်။ ဒီအပြုအမူက cert authentication method နဲ့ ဆင်တူပေမယ့် (အပိုင်း 20.12 ကို ကြည့်ပါ) — client certificates တွေရဲ့ စစ်ဆေးမှုကို — hostssl entries တွေကို ထောက်ပံ့တဲ့ authentication method ဘယ်ခုနဲ့မဆို တွဲဖက် သုံးနိုင်စေပါတယ်။ Client certificate authentication သုံးတဲ့ record ဘယ်ခုမှာမဆို (ဆိုလိုတာက cert authentication method သုံးတဲ့ record ဒါမှမဟုတ် clientcert option သုံးတဲ့ record တစ်ခုမှာ) — client certificate credentials တွေရဲ့ ဘယ် အစိတ်အပိုင်းနဲ့ ကိုက်ညီအောင် စစ်ဆေးမလဲဆိုတာကို — clientname option နဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option က တန်ဖိုး နှစ်မျိုးထဲက တစ်ခု ရှိနိုင်ပါတယ်။ clientname=CN လို့ သတ်မှတ်ရင် (ဒါက default ပါ) — username ကို certificate ရဲ့ Common Name (CN) နဲ့ နှိုင်းယှဉ် စစ်ဆေးပါတယ်။ clientname=DN လို့ သတ်မှတ်ရင်တော့ — username ကို certificate ရဲ့ Distinguished Name (DN) တစ်ခုလုံးနဲ့ နှိုင်းယှဉ် စစ်ဆေးပါတယ်။ ဒီ option ကို username map တစ်ခုနဲ့ တွဲဖက် သုံးတာ အကောင်းဆုံး ဖြစ်နိုင်ပါတယ်။ နှိုင်းယှဉ်မှုကို DN ကို RFC 2253 format နဲ့ လုပ်ပါတယ်။ Client certificate တစ်ခုရဲ့ DN ကို ဒီ format နဲ့ ကြည့်ဖို့ဆိုရင် ဒီလို လုပ်ပါ:

openssl x509 -in myclient.crt -noout -subject -nameopt RFC2253 | sed "s/^subject=//"

ဒီ option ကို သုံးတဲ့အခါ — အထူးသဖြင့် DN ကို ဆန့်ကျင်ပြီး regular expression ကိုက်ညီမှု စစ်ဆေးတဲ့အခါ — သတိထား ဆောင်ရွက်ဖို့ လိုပါတယ်။
- **include** — ဒီ line ကို — ပေးထားတဲ့ ဖိုင်ရဲ့ ပါဝင်စရာတွေနဲ့ အစားထိုးမှာ ဖြစ်ပါတယ်။
- **include_if_exists** — ဒီ line ကို — ပေးထားတဲ့ ဖိုင် တည်ရှိနေရင် — အဲဒီ ဖိုင်ရဲ့ ပါဝင်စရာတွေနဲ့ အစားထိုးမှာ ဖြစ်ပါတယ်။ မဟုတ်ရင် — ဖိုင်ကို ကျော်လိုက်ကြောင်း ညွှန်ပြတဲ့ message တစ်ခုကို log လုပ်ပါတယ်။
- **include_dir** — ဒီ line ကို — directory ထဲမှာ တွေ့ရတဲ့ — `.` နဲ့ မစတင်ဘဲ `.conf` နဲ့ အဆုံးသတ်တဲ့ — ဖိုင်တွေ အားလုံးရဲ့ ပါဝင်စရာတွေနဲ့ အစားထိုးမှာ ဖြစ်ပြီး — ဖိုင် နာမည် အစီအစဉ်အတိုင်း (C locale စည်းမျဉ်းတွေအရ — ဆိုလိုတာက ဂဏန်းတွေက စာလုံးတွေ ရှေ့မှာ လာပြီး — စာလုံးအကြီးတွေက စာလုံးအသေးတွေ ရှေ့မှာ လာပါတယ်) လုပ်ဆောင်ပါတယ်။

`@` constructs တွေနဲ့ ထည့်သွင်းထားတဲ့ ဖိုင်တွေကို — whitespace ဒါမှမဟုတ် commas တစ်ခုခုနဲ့ ခွဲခြားနိုင်တဲ့ — name တွေရဲ့ စာရင်း (list) တွေအနေနဲ့ ဖတ်ပါတယ်။ `pg_hba.conf` မှာလိုပဲ `#` က comments တွေကို မိတ်ဆက်ပေးပြီး — nested (အထပ်လိုက်) `@` constructs တွေကိုလည်း ခွင့်ပြုပါတယ်။ `@` နောက်က ဖိုင် နာမည်က absolute path မဟုတ်ဘူးဆိုရင် — ၎င်းကို — ရည်ညွှန်းနေတဲ့ ဖိုင် ပါဝင်တဲ့ directory နဲ့ ဆက်စပ်တဲ့ (relative) နေရာ အဖြစ် မှတ်ယူပါတယ်။

Connection ကြိုးစားမှု တစ်ခုချင်းစီအတွက် `pg_hba.conf` records တွေကို အစဉ်လိုက် စစ်ဆေးတာမို့ — records တွေရဲ့ အစီအစဉ်က အရေးကြီးပါတယ်။ ပုံမှန်အားဖြင့် — ရှေ့ဆုံး records တွေက တင်းကျပ်တဲ့ connection match parameters တွေနဲ့ အားနည်းတဲ့ authentication methods တွေ ရှိပြီး — နောက်ပိုင်း records တွေက လျော့ရဲတဲ့ match parameters တွေနဲ့ ပိုခိုင်မာတဲ့ authentication methods တွေ ရှိပါလိမ့်မယ်။ ဥပမာ — local TCP/IP connections တွေအတွက် `trust` authentication ကို သုံးပြီး — remote TCP/IP connections တွေအတွက်တော့ စကားဝှက် လိုအပ်ချင်နိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ — 127.0.0.1 ကနေ လာတဲ့ connections တွေအတွက် `trust` authentication သတ်မှတ်တဲ့ record က — ပိုကျယ်ပြန့်တဲ့ ခွင့်ပြု client IP addresses အကွာအဝေးအတွက် password authentication သတ်မှတ်တဲ့ record ရဲ့ ရှေ့မှာ ပေါ်နေရပါမယ်။

> **အကြံပြုချက်:** Database တစ်ခုကို connect လုပ်ဖို့ — user တစ်ယောက်က `pg_hba.conf` စစ်ဆေးမှုတွေကို ကျော်ဖြတ်ရုံတင် မကဘဲ — အဲဒီ database အတွက် `CONNECT` privilege လည်း ရှိရပါမယ်။ ဘယ် users တွေ ဘယ် databases တွေကို connect လုပ်နိုင်လဲ ကန့်သတ်ချင်ရင် — စည်းမျဉ်းတွေကို `pg_hba.conf` entries တွေထဲ ထည့်တာထက် — `CONNECT` privilege ကို grant/revoke လုပ်ပြီး ထိန်းချုပ်တာက များသောအားဖြင့် ပိုလွယ်ကူပါတယ်။

`pg_hba.conf` entries တချို့ရဲ့ ဥပမာတွေကို [ဥပမာ 20.1](/docs/postgresql/auth-pg-hba-conf) မှာ ပြထားပါတယ်။ Authentication method အမျိုးမျိုးရဲ့ အသေးစိတ်အတွက် နောက် section ကို ကြည့်ပါ။

**ဥပမာ 20.1. pg_hba.conf Entries များ၏ ဥပမာ**

```sql
# Allow any user on the local system to connect to any database with
# any database user name using Unix-domain sockets (the default for local
# connections).
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust

# The same using local loopback TCP/IP connections.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             127.0.0.1/32            trust

# The same as the previous line, but using a separate netmask column
#
# TYPE  DATABASE        USER            IP-ADDRESS      IP-MASK             METHOD
host    all             all             127.0.0.1       255.255.255.255     trust

# The same over IPv6.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             ::1/128                 trust

# The same using a host name (would typically cover both IPv4 and IPv6).
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             localhost               trust

# The same using a regular expression for DATABASE, that allows connection
# to any databases with a name beginning with "db" and finishing with a
# number using two to four digits (like "db1234" or "db12").
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    "/^db\d{2,4}$"  all             localhost               trust

# Allow any user from any host with IP address 192.168.93.x to connect
# to database "postgres" as the same user name that ident reports for
# the connection (typically the operating system user name).
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    postgres        all             192.168.93.0/24         ident

# Allow any user from host 192.168.12.10 to connect to database
# "postgres" if the user's password is correctly supplied.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    postgres        all             192.168.12.10/32        scram-sha-256

# Allow any user from hosts in the example.com domain to connect to
# any database if the user's password is correctly supplied.
#
# Require SCRAM authentication for most users, but make an exception
# for user 'mike', who uses an older client that doesn't support SCRAM
# authentication.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             mike            .example.com            md5
host    all             all             .example.com            scram-sha-256

# In the absence of preceding "host" lines, these three lines will
# reject all connections from 192.168.54.1 (since that entry will be
# matched first), but allow GSSAPI-encrypted connections from anywhere else
# on the Internet.  The zero mask causes no bits of the host IP address to
# be considered, so it matches any host.  Unencrypted GSSAPI connections
# (which "fall through" to the third line since "hostgssenc" only matches
# encrypted GSSAPI connections) are allowed, but only from 192.168.12.10.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             192.168.54.1/32         reject
hostgssenc all          all             0.0.0.0/0               gss
host    all             all             192.168.12.10/32        gss

# Allow users from 192.168.x.x hosts to connect to any database, if
# they pass the ident check.  If, for example, ident says the user is
# "bryanh" and he requests to connect as PostgreSQL user "guest1", the
# connection is allowed if there is an entry in pg_ident.conf for map
# "omicron" that says "bryanh" is allowed to connect as "guest1".
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             192.168.0.0/16          ident map=omicron

# If these are the only four lines for local connections, they will
# allow local users to connect only to their own databases (databases
# with the same name as their database user name) except for users whose
# name end with "helpdesk", administrators and members of role "support",
# who can connect to all databases.  The file $PGDATA/admins contains a
# list of names of administrators.  Passwords are required in all cases.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   sameuser        all                                     scram-sha-256
local   all             /^.*helpdesk$                           scram-sha-256
local   all             @admins                                 scram-sha-256
local   all             +support                                scram-sha-256

# The last two lines above can be combined into a single line:
local   all             @admins,+support                        scram-sha-256

# The database column can also use lists and file names:
local   db1,db2,@demodbs  all                                   scram-sha-256
```
