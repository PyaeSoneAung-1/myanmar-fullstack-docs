---
title: "System Information Functions and Operators (System အချက်အလက် လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL installation အကြောင်း အချက်အလက် အမျိုးမျိုး ရယူရန် သုံးသော system information လုပ်ဆောင်ချက်များနှင့် operator များ — session, access privilege, schema visibility, system catalog, object addressing, comment, data validity, transaction ID/snapshot, control data, version, WAL summarization စသည့် function များ"
order: 94
source: "https://www.postgresql.org/docs/current/functions-info.html"
status: translated
updated: 2026-09-04
---

## 9.27. System Information Functions and Operators (System အချက်အလက် လုပ်ဆောင်ချက်များနှင့် operator များ)

- **9.27.1. Session Information Functions (session အချက်အလက် လုပ်ဆောင်ချက်များ)**
- **9.27.2. Access Privilege Inquiry Functions (access privilege စုံစမ်း စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)**
- **9.27.3. Schema Visibility Inquiry Functions (schema မြင်နိုင်မှု စုံစမ်း စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)**
- **9.27.4. System Catalog Information Functions (system catalog အချက်အလက် လုပ်ဆောင်ချက်များ)**
- **9.27.5. Object Information and Addressing Functions (object အချက်အလက်နှင့် addressing လုပ်ဆောင်ချက်များ)**
- **9.27.6. Comment Information Functions (comment အချက်အလက် လုပ်ဆောင်ချက်များ)**
- **9.27.7. Data Validity Checking Functions (data တရားဝင်မှု စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)**
- **9.27.8. Transaction ID and Snapshot Information Functions (transaction ID နှင့် snapshot အချက်အလက် လုပ်ဆောင်ချက်များ)**
- **9.27.9. Committed Transaction Information Functions (commit လုပ်ပြီးသား transaction အချက်အလက် လုပ်ဆောင်ချက်များ)**
- **9.27.10. Control Data Functions (control data လုပ်ဆောင်ချက်များ)**
- **9.27.11. Version Information Functions (version အချက်အလက် လုပ်ဆောင်ချက်များ)**
- **9.27.12. WAL Summarization Information Functions (WAL အကျဉ်းချုပ် အချက်အလက် လုပ်ဆောင်ချက်များ)**

ဒီ section မှာ ဖော်ပြထားတဲ့ လုပ်ဆောင်ချက်တွေကို — PostgreSQL installation တစ်ခုအကြောင်း အချက်အလက် အမျိုးမျိုး ရယူဖို့ အသုံးပြုပါတယ်။
### 9.27.1. Session Information Functions (session အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.71 မှာ session နဲ့ system အချက်အလက် အမျိုးမျိုးကို ထုတ်ယူပေးသော လုပ်ဆောင်ချက် များစွာကို ပြသထားပါတယ်။

ဒီ section မှာ စာရင်းပြုစုထားတဲ့ လုပ်ဆောင်ချက်တွေအပြင် — statistics system နဲ့ ဆက်စပ်ပြီး system အချက်အလက်တွေကိုပါ ပေးသော လုပ်ဆောင်ချက် အတော်များများ ရှိပါသေးတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 27.2.26](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-FUNCTIONS) ကို ကြည့်ပါ။

**ဇယား 9.71. Session Information Functions (session အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| current_catalog → name  current_database () → name လက်ရှိ database ၏ အမည်ကို ပြန်ပေးပါတယ်။ (SQL standard မှာ database တွေကို “catalogs” လို့ ခေါ်လို့ — current_catalog က standard ရဲ့ စာလုံးပေါင်း ဖြစ်ပါတယ်။) |
| current_query () → text လက်ရှိ execute လုပ်နေတဲ့ query ရဲ့ text ကို ပြန်ပေးပါတယ် — client က ပေးပို့ခဲ့တဲ့အတိုင်း ဖြစ်ပြီး statement တစ်ခုထက်ပို ပါဝင်နိုင်ပါတယ်။ |
| current_role → name ဒါဟာ current_user နဲ့ ညီမျှပါတယ်။ |
| current_schema → name  current_schema () → name search path (ရှာဖွေရေး လမ်းကြောင်း) ထဲမှာ ပထမဆုံး ဖြစ်တဲ့ schema ရဲ့ အမည်ကို ပြန်ပေးပါတယ် (search path ဗလာဖြစ်နေရင်တော့ null တန်ဖိုး ပြန်ပေးပါတယ်)။ Target schema သတ်မှတ်မပေးဘဲ ဖန်တီးတဲ့ table တွေ ဒါမှမဟုတ် အခြား နာမည်တပ်ထားတဲ့ object တွေ အားလုံးအတွက် အသုံးပြုမယ့် schema ကလည်း ဒါပဲ ဖြစ်ပါတယ်။ |
| current_schemas ( include_implicit boolean ) → name[] လက်ရှိ သက်ရောက်နေတဲ့ (effective) search path ထဲက schema တွေ အားလုံးရဲ့ အမည်တွေကို — သူတို့ရဲ့ ဦးစားပေး အစဉ်လိုက် — ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ (လက်ရှိ search_path setting ထဲမှာ ပါပေမယ့် — ရှိပြီးသား၊ ရှာဖွေလို့ရတဲ့ schema တွေနဲ့ မကိုက်ညီတဲ့ item တွေကို ချန်လှပ်ပါတယ်။) Boolean argument က true ဖြစ်ရင် — pg_catalog လိုမျိုး သွယ်ဝိုက်၍ ရှာဖွေတတ်တဲ့ (implicitly-searched) system schema တွေကို ရလဒ်ထဲမှာ ထည့်သွင်းပါတယ်။ |
| current_user → name လက်ရှိ execution context ရဲ့ user name ကို ပြန်ပေးပါတယ်။ |
| inet_client_addr () → inet လက်ရှိ client ရဲ့ IP address ကို ပြန်ပေးပါတယ် — လက်ရှိ connection က Unix-domain socket ကနေ ဖြစ်နေရင်တော့ NULL ပြန်ပေးပါတယ်။ |
| inet_client_port () → integer လက်ရှိ client ရဲ့ IP port number ကို ပြန်ပေးပါတယ် — လက်ရှိ connection က Unix-domain socket ကနေ ဖြစ်နေရင်တော့ NULL ပြန်ပေးပါတယ်။ |
| inet_server_addr () → inet server က လက်ရှိ connection ကို လက်ခံခဲ့တဲ့ IP address ကို ပြန်ပေးပါတယ် — လက်ရှိ connection က Unix-domain socket ကနေ ဖြစ်နေရင်တော့ NULL ပြန်ပေးပါတယ်။ |
| inet_server_port () → integer server က လက်ရှိ connection ကို လက်ခံခဲ့တဲ့ IP port number ကို ပြန်ပေးပါတယ် — လက်ရှိ connection က Unix-domain socket ကနေ ဖြစ်နေရင်တော့ NULL ပြန်ပေးပါတယ်။ |
| pg_backend_pid () → integer လက်ရှိ session နဲ့ ချိတ်ဆက်ထားတဲ့ server process ရဲ့ process ID ကို ပြန်ပေးပါတယ်။ |
| pg_blocking_pids ( integer ) → integer[] သတ်မှတ်ထားတဲ့ process ID ရှိတဲ့ server process ကို lock တစ်ခု ရယူခြင်းမှ ပိတ်ဆို့နေတဲ့ (blocking) session တွေရဲ့ process ID တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ် — အဲဒီလို server process မရှိဘူး ဒါမှမဟုတ် ပိတ်ဆို့ခံမထားရဘူးဆိုရင် ဗလာ array တစ်ခု ပြန်ပေးပါတယ်။ Server process တစ်ခုက နောက်တစ်ခုကို ပိတ်ဆို့တယ်ဆိုတာ — ၎င်းက ပိတ်ဆို့ခံရတဲ့ process ရဲ့ lock တောင်းဆိုမှုနဲ့ conflict ဖြစ်တဲ့ lock တစ်ခုကို ကိုင်ထားတာ (hard block — ပြင်းထန်စွာ ပိတ်ဆို့ခြင်း) ဒါမှမဟုတ် — ပိတ်ဆို့ခံရတဲ့ process ရဲ့ lock တောင်းဆိုမှုနဲ့ conflict ဖြစ်မယ့် lock တစ်ခုကို စောင့်ဆိုင်းနေပြီး wait queue ထဲမှာ သူ့ထက် ရှေ့မှာ ရှိနေတာ (soft block — ပျော့ပျောင်းစွာ ပိတ်ဆို့ခြင်း) ဖြစ်ပါတယ်။ Parallel query တွေ သုံးတဲ့အခါ — တကယ့် lock ကို child worker process က ကိုင်ထား ဒါမှမဟုတ် စောင့်ဆိုင်းနေရင်တောင် — ရလဒ်က client မြင်ရတဲ့ process ID တွေကိုပဲ (ဆိုလိုတာ pg_backend_pid ရလဒ်တွေကိုပဲ) အမြဲ စာရင်းပြုပါတယ်။ ဒါကြောင့် ရလဒ်ထဲမှာ PID တွေ ထပ်ခါထပ်ခါ ပါလာနိုင်ပါတယ်။ ပြီးတော့ — prepared transaction တစ်ခုက conflict ဖြစ်တဲ့ lock ကို ကိုင်ထားရင် — ၎င်းကို process ID သုည နဲ့ ကိုယ်စားပြုမှာ သတိပြုပါ။ ဒီ function ကို မကြာခဏ ခေါ်ရင် — lock manager ရဲ့ shared state ကို အချိန်တိုလေး တစ်ဦးတည်း ဝင်ရောက်ခွင့် လိုတာကြောင့် — database performance ကို အနည်းငယ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။ |
| pg_conf_load_time () → timestamp with time zone server configuration file တွေကို နောက်ဆုံး load လုပ်ခဲ့တဲ့ အချိန်ကို ပြန်ပေးပါတယ်။ အဲဒီအချိန်တုန်းက လက်ရှိ session ရှိနေခဲ့ရင် — ဒါက session ကိုယ်တိုင် configuration file တွေကို ပြန်ဖတ်ခဲ့တဲ့ အချိန် ဖြစ်မှာ ဖြစ်လို့ (session တစ်ခုနဲ့တစ်ခု အနည်းငယ် ကွာနိုင်ပါတယ်)။ မဟုတ်ရင်တော့ postmaster process က configuration file တွေကို ပြန်ဖတ်ခဲ့တဲ့ အချိန် ဖြစ်ပါတယ်။ |
| pg_current_logfile ( [ text ] ) → text Logging collector က လက်ရှိ သုံးနေတဲ့ log file ရဲ့ path အမည်ကို ပြန်ပေးပါတယ်။ ဒီ path မှာ log_directory directory နဲ့ log file တစ်ခုချင်းစီရဲ့ အမည် ပါဝင်ပါတယ်။ Logging collector ကို disable လုပ်ထားရင် ရလဒ်က NULL ဖြစ်ပါတယ်။ Format မတူတဲ့ log file အများအပြား ရှိနေတဲ့အခါ — argument မပါဘဲ ခေါ်တဲ့ pg_current_logfile က စီထားတဲ့ စာရင်းထဲမှာ ပထမဆုံး တွေ့ရတဲ့ format ရှိတဲ့ file ရဲ့ path ကို ပြန်ပေးပါတယ်: stderr, csvlog, jsonlog။ Format တစ်ခုမှ မရှိရင် NULL ပြန်ပေးပါတယ်။ သတ်မှတ်ထားတဲ့ log file format တစ်ခုအကြောင်း တောင်းဆိုချင်ရင် — optional parameter ရဲ့ တန်ဖိုးအဖြစ် csvlog, jsonlog ဒါမှမဟုတ် stderr တို့ထဲက တစ်ခုကို ပေးပါ။ တောင်းဆိုထားတဲ့ log format က log_destination မှာ configure မလုပ်ထားဘူးဆိုရင် ရလဒ်က NULL ဖြစ်ပါတယ်။ ရလဒ်က current_logfiles file ရဲ့ အကြောင်းအရာကို ထင်ဟပ်ပါတယ်။ ဒီ function ကို default အားဖြင့် superuser တွေနဲ့ pg_monitor role ရဲ့ privilege တွေ ရှိတဲ့ role တွေပဲ သုံးလို့ရပြီး — တခြား user တွေကိုတော့ function ကို run ဖို့ EXECUTE ပေးအပ်လို့ ရပါတယ်။ |
| pg_get_loaded_modules () → setof record ( module_name text, version text, file_name text ) လက်ရှိ server session ထဲကို load လုပ်ထားတဲ့ loadable module တွေရဲ့ စာရင်းကို ပြန်ပေးပါတယ်။ module_name နဲ့ version fields တွေက — module ရေးသူ (author) က PG_MODULE_MAGIC_EXT macro ကို သုံးပြီး တန်ဖိုးတွေ သတ်မှတ်ပေးထားမှသာ — အဲဒီတန်ဖိုးတွေ ရှိမှာ ဖြစ်ပြီး မဟုတ်ရင် NULL ဖြစ်ပါတယ်။ file_name field က module (shared library) ရဲ့ file အမည်ကို ပေးပါတယ်။ |
| pg_my_temp_schema () → oid လက်ရှိ session ရဲ့ temporary schema ရဲ့ OID ကို ပြန်ပေးပါတယ် — (temporary table တွေ မဖန်တီးရသေးလို့) temporary schema မရှိရင်တော့ သုည ပြန်ပေးပါတယ်။ |
| pg_is_other_temp_schema ( oid ) → boolean ပေးထားတဲ့ OID က တခြား session တစ်ခုရဲ့ temporary schema ရဲ့ OID ဆိုရင် true ပြန်ပေးပါတယ်။ (ဥပမာ — catalog display တစ်ခုကနေ တခြား session တွေရဲ့ temporary table တွေကို ဖယ်ထုတ်ဖို့ အသုံးဝင်နိုင်ပါတယ်။) |
| pg_jit_available () → boolean JIT compiler extension တစ်ခု ရနိုင်ရင် (အခန်း 30 ကို ကြည့်ပါ) ပြီး jit configuration parameter က on လို့ သတ်မှတ်ထားရင် true ပြန်ပေးပါတယ်။ |
| pg_numa_available () → boolean Server ကို NUMA support နဲ့ compile လုပ်ထားရင် true ပြန်ပေးပါတယ်။ |
| pg_listening_channels () → setof text လက်ရှိ session က နားထောင်နေတဲ့ (listening) asynchronous notification channel တွေရဲ့ အမည် set ကို ပြန်ပေးပါတယ်။ |
| pg_notification_queue_usage () → double precision Asynchronous notification queue ရဲ့ အများဆုံး အရွယ်အစားထဲက — process လုပ်ဖို့ စောင့်ဆိုင်းနေတဲ့ notification တွေက လက်ရှိ သိမ်းပိုက်ထားတဲ့ အချိုးအစား (0–1) ကို ပြန်ပေးပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် LISTEN နဲ့ NOTIFY ကို ကြည့်ပါ။ |
| pg_postmaster_start_time () → timestamp with time zone Server စတင်ခဲ့တဲ့ အချိန်ကို ပြန်ပေးပါတယ်။ |
| pg_safe_snapshot_blocking_pids ( integer ) → integer[] သတ်မှတ်ထားတဲ့ process ID ရှိတဲ့ server process ကို safe snapshot တစ်ခု ရယူခြင်းမှ ပိတ်ဆို့နေတဲ့ session တွေရဲ့ process ID တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ် — အဲဒီလို server process မရှိဘူး ဒါမှမဟုတ် ပိတ်ဆို့ခံမထားရဘူးဆိုရင် ဗလာ array တစ်ခု ပြန်ပေးပါတယ်။ SERIALIZABLE transaction တစ်ခုကို run နေတဲ့ session တစ်ခုက — SERIALIZABLE READ ONLY DEFERRABLE transaction တစ်ခုကို — နောက်တစ်ခုက predicate lock တွေ ဘာမှ မယူဘဲ နေလို့ ရတယ်လို့ ဆုံးဖြတ်နိုင်တဲ့အထိ — snapshot တစ်ခု ရယူခြင်းမှ ပိတ်ဆို့ပါတယ်။ Serializable နဲ့ deferrable transaction တွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် အပိုင်း 13.2.3 ကို ကြည့်ပါ။ ဒီ function ကို မကြာခဏ ခေါ်ရင် — predicate lock manager ရဲ့ shared state ကို အချိန်တိုလေး ဝင်ရောက်ဖို့ လိုတာကြောင့် — database performance ကို အနည်းငယ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။ |
| pg_trigger_depth () → integer PostgreSQL trigger တွေရဲ့ လက်ရှိ nesting level (အဆင့်) ကို ပြန်ပေးပါတယ် (trigger တစ်ခုရဲ့ အတွင်းကနေ — တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက်၍ — ခေါ်ထားတာ မဟုတ်ရင် 0 ဖြစ်ပါတယ်)။ |
| session_user → name Session user ရဲ့ အမည်ကို ပြန်ပေးပါတယ်။ |
| system_user → text User ကို database role တစ်ခု သတ်မှတ်ပေးလိုက်ခင် — authentication ကာလအတွင်း user က တင်ပြခဲ့တဲ့ authentication method နဲ့ identity (ရှိရင်) ကို ပြန်ပေးပါတယ်။ auth_method:identity ပုံစံနဲ့ ဖြစ်ပြီး — user ကို authentication မလုပ်ရသေးဘူးဆိုရင် (ဥပမာ Trust authentication သုံးထားရင်) NULL ဖြစ်ပါတယ်။ |
| user → name ဒါဟာ current_user နဲ့ ညီမျှပါတယ်။ |

> **မှတ်ချက်:** `current_catalog`, `current_role`, `current_schema`, `current_user`, `session_user`, နဲ့ `user` တို့ဟာ SQL ထဲမှာ အထူး syntactic status ရှိပါတယ်: သူတို့ကို နောက်ဆုံး parentheses မပါဘဲ ခေါ်ရပါတယ်။ PostgreSQL မှာတော့ `current_schema` အတွက် parentheses ကို optional အနေနဲ့ သုံးလို့ရပြီး — ကျန်တဲ့ဟာတွေအတွက်တော့ မရပါဘူး။

`session_user` က ပုံမှန်အားဖြင့် လက်ရှိ database connection ကို စတင်ခဲ့တဲ့ user ဖြစ်ပါတယ်; ဒါပေမယ့် superuser တွေက ဒီ setting ကို [SET SESSION AUTHORIZATION](https://www.postgresql.org/docs/current/sql-set-session-authorization.html) နဲ့ ပြောင်းလဲနိုင်ပါတယ်။ `current_user` ကတော့ permission စစ်ဆေးတဲ့အခါ သက်ဆိုင်တဲ့ user identifier ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် session user နဲ့ တူညီပေမယ့် — [SET ROLE](https://www.postgresql.org/docs/current/sql-set-role.html) နဲ့ ပြောင်းလဲနိုင်ပါတယ်။ `SECURITY DEFINER` attribute ပါတဲ့ function တွေ run နေစဉ်မှာလည်း ပြောင်းလဲပါတယ်။ Unix အသုံးအနှုန်းအရ — session user က “real user” ဖြစ်ပြီး current user က “effective user” ဖြစ်ပါတယ်။ `current_role` နဲ့ `user` တို့က `current_user` ရဲ့ synonym တွေ ဖြစ်ပါတယ်။ (SQL standard က `current_role` နဲ့ `current_user` ကို ခွဲခြားပေမယ့် — PostgreSQL ကတော့ user တွေနဲ့ role တွေကို entity အမျိုးအစား တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ထားလို့ — မခွဲခြားပါဘူး။)
### 9.27.2. Access Privilege Inquiry Functions (access privilege စုံစမ်း စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)

ဇယား 9.72 မှာ object တွေရဲ့ access privilege တွေကို programmatically (ကုဒ်ဖြင့်) စုံစမ်း မေးမြန်းနိုင်တဲ့ လုပ်ဆောင်ချက်တွေကို စာရင်းပြုထားပါတယ်။ (Privilege တွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 5.8](/docs/postgresql/ddl-priv) ကို ကြည့်ပါ။) ဒီ လုပ်ဆောင်ချက်တွေထဲမှာ — ဘယ်သူ့ရဲ့ privilege တွေကို စုံစမ်းနေလဲဆိုတဲ့ user ကို နာမည်နဲ့ ဖြစ်စေ OID (`pg_authid`.`oid`) နဲ့ ဖြစ်စေ သတ်မှတ်နိုင်ပြီး — နာမည်ကို `public` လို့ ပေးထားရင်တော့ PUBLIC pseudo-role ရဲ့ privilege တွေကို စစ်ဆေးပါတယ်။ ပြီးတော့ *user* argument ကို လုံးဝ ချန်လှပ်ထားလည်း ရပြီး — အဲဒီအခါ `current_user` လို့ ယူဆပါတယ်။ စုံစမ်းနေတဲ့ object ကိုလည်း နာမည်နဲ့ ဖြစ်စေ OID နဲ့ ဖြစ်စေ သတ်မှတ်နိုင်ပါတယ်။ နာမည်နဲ့ သတ်မှတ်တဲ့အခါ — သက်ဆိုင်ရင် schema အမည် ထည့်သွင်းနိုင်ပါတယ်။ စိတ်ဝင်စားတဲ့ access privilege ကို text string တစ်ခုနဲ့ သတ်မှတ်ပြီး — အဲဒါက object ရဲ့ type အတွက် သင့်လျော်တဲ့ privilege keyword တွေထဲက တစ်ခု (ဥပမာ `SELECT`) ကို ဖြစ်စေရပါမယ်။ Optional အနေနဲ့ — privilege ကို grant option နဲ့ ကိုင်ထားလားဆိုတာ စမ်းသပ်ဖို့ — privilege type တစ်ခုနောက်မှာ `WITH GRANT OPTION` ထပ်ထည့်နိုင်ပါတယ်။ ပြီးတော့ privilege type အများအပြားကို comma နဲ့ ခြားပြီး စာရင်းပြုလို့လည်း ရပြီး — အဲဒီအခါ စာရင်းထဲက privilege တစ်ခုခုကို ကိုင်ထားရင် ရလဒ်က true ဖြစ်ပါတယ်။ (Privilege string ရဲ့ case က အရေးမပါဘဲ — privilege အမည်တွေကြားမှာ နေရာလွတ် (whitespace) ထပ်ခွင့်ပြုပြီး — အမည်တစ်ခုရဲ့ အတွင်းမှာတော့ မခွင့်ပြုပါဘူး။) ဥပမာအချို့:

```sql
SELECT has_table_privilege('myschema.mytable', 'select');
SELECT has_table_privilege('joe', 'mytable', 'INSERT, SELECT WITH GRANT OPTION');
```

**ဇယား 9.72. Access Privilege Inquiry Functions (access privilege စုံစမ်း စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| has_any_column_privilege ( [ user name or oid, ] table text or oid, privilege text ) → boolean User က table ရဲ့ column တစ်ခုခုအတွက် privilege ရှိပါသလား? Privilege ကို table တစ်ခုလုံးအတွက် ကိုင်ထားရင် ဒါမှမဟုတ် — column တစ်ခုခုအတွက် column-level grant ရှိနေရင် အောင်မြင်ပါတယ်။ ခွင့်ပြုထားတဲ့ privilege type တွေက SELECT, INSERT, UPDATE, နဲ့ REFERENCES တို့ ဖြစ်ပါတယ်။ |
| has_column_privilege ( [ user name or oid, ] table text or oid, column text or smallint, privilege text ) → boolean User က သတ်မှတ်ထားတဲ့ table column အတွက် privilege ရှိပါသလား? Privilege ကို table တစ်ခုလုံးအတွက် ကိုင်ထားရင် ဒါမှမဟုတ် — column အတွက် column-level grant ရှိနေရင် အောင်မြင်ပါတယ်။ Column ကို နာမည်နဲ့ ဖြစ်စေ attribute number (pg_attribute.attnum) နဲ့ ဖြစ်စေ သတ်မှတ်နိုင်ပါတယ်။ ခွင့်ပြုထားတဲ့ privilege type တွေက SELECT, INSERT, UPDATE, နဲ့ REFERENCES တို့ ဖြစ်ပါတယ်။ |
| has_database_privilege ( [ user name or oid, ] database text or oid, privilege text ) → boolean User က database အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ privilege type တွေက CREATE, CONNECT, TEMPORARY, နဲ့ TEMP (TEMPORARY နဲ့ ညီမျှသော) တို့ ဖြစ်ပါတယ်။ |
| has_foreign_data_wrapper_privilege ( [ user name or oid, ] fdw text or oid, privilege text ) → boolean User က foreign-data wrapper အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ တစ်ခုတည်းသော privilege type က USAGE ဖြစ်ပါတယ်။ |
| has_function_privilege ( [ user name or oid, ] function text or oid, privilege text ) → boolean User က function အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ တစ်ခုတည်းသော privilege type က EXECUTE ဖြစ်ပါတယ်။ Function ကို OID နဲ့ မဟုတ်ဘဲ နာမည်နဲ့ သတ်မှတ်တဲ့အခါ — ခွင့်ပြုထားတဲ့ input က regprocedure data type အတွက် အတူတူပဲ ဖြစ်ပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ)။ ဥပမာတစ်ခုက:  SELECT has_function_privilege('joeuser', 'myfunc(int, text)', 'execute'); |
| has_language_privilege ( [ user name or oid, ] language text or oid, privilege text ) → boolean User က language အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ တစ်ခုတည်းသော privilege type က USAGE ဖြစ်ပါတယ်။ |
| has_largeobject_privilege ( [ user name or oid, ] largeobject oid, privilege text ) → boolean User က large object အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ privilege type တွေက SELECT နဲ့ UPDATE တို့ ဖြစ်ပါတယ်။ |
| has_parameter_privilege ( [ user name or oid, ] parameter text, privilege text ) → boolean User က configuration parameter အတွက် privilege ရှိပါသလား? Parameter နာမည်က case-insensitive (စာလုံးကြီး/စာလုံးသေး မခွဲခြား) ဖြစ်ပါတယ်။ ခွင့်ပြုထားတဲ့ privilege type တွေက SET နဲ့ ALTER SYSTEM တို့ ဖြစ်ပါတယ်။ |
| has_schema_privilege ( [ user name or oid, ] schema text or oid, privilege text ) → boolean User က schema အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ privilege type တွေက CREATE နဲ့ USAGE တို့ ဖြစ်ပါတယ်။ |
| has_sequence_privilege ( [ user name or oid, ] sequence text or oid, privilege text ) → boolean User က sequence အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ privilege type တွေက USAGE, SELECT, နဲ့ UPDATE တို့ ဖြစ်ပါတယ်။ |
| has_server_privilege ( [ user name or oid, ] server text or oid, privilege text ) → boolean User က foreign server အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ တစ်ခုတည်းသော privilege type က USAGE ဖြစ်ပါတယ်။ |
| has_table_privilege ( [ user name or oid, ] table text or oid, privilege text ) → boolean User က table အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ privilege type တွေက SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, နဲ့ MAINTAIN တို့ ဖြစ်ပါတယ်။ |
| has_tablespace_privilege ( [ user name or oid, ] tablespace text or oid, privilege text ) → boolean User က tablespace အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ တစ်ခုတည်းသော privilege type က CREATE ဖြစ်ပါတယ်။ |
| has_type_privilege ( [ user name or oid, ] type text or oid, privilege text ) → boolean User က data type အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ တစ်ခုတည်းသော privilege type က USAGE ဖြစ်ပါတယ်။ Type ကို OID နဲ့ မဟုတ်ဘဲ နာမည်နဲ့ သတ်မှတ်တဲ့အခါ — ခွင့်ပြုထားတဲ့ input က regtype data type အတွက် အတူတူပဲ ဖြစ်ပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ)။ |
| pg_has_role ( [ user name or oid, ] role text or oid, privilege text ) → boolean User က role အတွက် privilege ရှိပါသလား? ခွင့်ပြုထားတဲ့ privilege type တွေက MEMBER, USAGE, နဲ့ SET တို့ ဖြစ်ပါတယ်။ MEMBER က — ဘယ်လို သတ်မှတ် privilege တွေ ပေးအပ်နိုင်လဲဆိုတာ မသက်ဆိုင်ဘဲ — role ထဲမှာ တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက်၍ အဖွဲ့ဝင် ဖြစ်ခြင်းကို ဆိုလိုပါတယ်။ USAGE က — SET ROLE မလုပ်ဘဲ role ရဲ့ privilege တွေကို ချက်ချင်း အသုံးပြုလို့ ရမရကို ဆိုလိုပြီး — SET က SET ROLE command သုံးပြီး အဲဒီ role ဆီ ပြောင်းလဲလို့ ရမရကို ဆိုလိုပါတယ်။ ဒီ privilege type တွေထဲက ဘယ်ဟာကိုမဆို — ADMIN privilege ကိုင်ထားလားဆိုတာ စမ်းသပ်ဖို့ WITH ADMIN OPTION ဒါမှမဟုတ် WITH GRANT OPTION ထပ်ထည့်နိုင်ပါတယ် (စာလုံးပေါင်း ခြောက်မျိုးလုံးက အတူတူပဲ စစ်ဆေးပါတယ်)။ ဒီ function မှာ user ကို public လို့ သတ်မှတ်တဲ့ အထူးကိစ္စ မရှိပါဘူး — အကြောင်းကတော့ PUBLIC pseudo-role က တကယ့် role တွေရဲ့ အဖွဲ့ဝင် ဘယ်တော့မှ မဖြစ်နိုင်လို့ပါ။ |
| row_security_active ( table text or oid ) → boolean လက်ရှိ user နဲ့ လက်ရှိ environment ရဲ့ အခြေအနေမှာ — သတ်မှတ်ထားတဲ့ table အတွက် row-level security က active ဖြစ်နေပါသလား? |

ဇယား 9.73 မှာ access privilege တွေရဲ့ catalog ကိုယ်စားပြုမှု ဖြစ်တဲ့ `aclitem` type အတွက် ရနိုင်တဲ့ operator တွေကို ပြသထားပါတယ်။ Access privilege တန်ဖိုးတွေကို ဘယ်လို ဖတ်ရမယ်ဆိုတာကို [အပိုင်း 5.8](/docs/postgresql/ddl-priv) မှာ ကြည့်ပါ။

**ဇယား 9.73. aclitem Operators (aclitem operator များ)**

| Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| aclitem = aclitem → boolean aclitem တွေ တူညီပါသလား? (aclitem type မှာ သာမန် comparison operator အစုအဝေး မပါဘဲ — equality တစ်ခုတည်းပဲ ရှိတာ သတိပြုပါ။ အလှည့်ကျအားဖြင့် aclitem array တွေကိုလည်း equality အတွက်ပဲ နှိုင်းယှဉ်လို့ရပါတယ်။) 'calvin=r*w/hobbes'::aclitem = 'calvin=r*w*/hobbes'::aclitem → f |
| aclitem[] @> aclitem → boolean Array ထဲမှာ သတ်မှတ်ထားတဲ့ privileges တွေ ပါဝင်ပါသလား? (aclitem ရဲ့ grantee နဲ့ grantor နဲ့ ကိုက်ညီပြီး — သတ်မှတ်ထားတဲ့ privilege set အနည်းဆုံး ပါဝင်တဲ့ array entry တစ်ခု ရှိရင် true ဖြစ်ပါတယ်။) '{calvin=r*w/hobbes,hobbes=r*w*/postgres}'::aclitem[] @> 'calvin=r*/hobbes'::aclitem → t |

ဇယား 9.74 မှာ `aclitem` type ကို စီမံခန့်ခွဲဖို့ နောက်ထပ် လုပ်ဆောင်ချက်တချို့ကို ပြသထားပါတယ်။

**ဇယား 9.74. aclitem Functions (aclitem လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| acldefault ( type "char", ownerId oid ) → aclitem[] OID ownerId ရှိတဲ့ role က ပိုင်ဆိုင်တဲ့ — type type ရှိတဲ့ object တစ်ခုအတွက် default access privilege တွေ ပါဝင်တဲ့ aclitem array တစ်ခုကို တည်ဆောက်ပါတယ်။ ဒါက object တစ်ခုရဲ့ ACL entry က null ဖြစ်နေတဲ့အခါ ယူဆရမယ့် access privilege တွေကို ကိုယ်စားပြုပါတယ်။ (Default access privilege တွေကို အပိုင်း 5.8 မှာ ဖော်ပြထားပါတယ်။) type parameter က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်: COLUMN အတွက် 'c', TABLE နဲ့ table နဲ့ ဆင်တူတဲ့ object တွေအတွက် 'r', SEQUENCE အတွက် 's', DATABASE အတွက် 'd', FUNCTION ဒါမှမဟုတ် PROCEDURE အတွက် 'f', LANGUAGE အတွက် 'l', LARGE OBJECT အတွက် 'L', SCHEMA အတွက် 'n', PARAMETER အတွက် 'p', TABLESPACE အတွက် 't', FOREIGN DATA WRAPPER အတွက် 'F', FOREIGN SERVER အတွက် 'S', TYPE ဒါမှမဟုတ် DOMAIN အတွက် 'T'။ |
| aclexplode ( aclitem[] ) → setof record ( grantor oid, grantee oid, privilege_type text, is_grantable boolean ) aclitem array ကို row set တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Grantee က pseudo-role PUBLIC ဖြစ်ရင် — grantee column မှာ သုည နဲ့ ကိုယ်စားပြုပါတယ်။ ပေးအပ်ထားတဲ့ privilege တစ်ခုချင်းစီကို SELECT, INSERT, စသဖြင့် ကိုယ်စားပြုပါတယ် (အပြည့်အစုံ စာရင်းအတွက် ဇယား 5.1 ကို ကြည့်ပါ)။ Privilege တစ်ခုချင်းစီကို သီးခြား row တစ်ခုအနေနဲ့ ခွဲထုတ်လို့ — privilege_type column မှာ keyword တစ်ခုတည်းပဲ ပေါ်လာတာ သတိပြုပါ။ |
| makeaclitem ( grantee oid, grantor oid, privileges text, is_grantable boolean ) → aclitem ပေးထားတဲ့ properties တွေနဲ့ aclitem တစ်ခုကို တည်ဆောက်ပါတယ်။ privileges က SELECT, INSERT, စသဖြင့် privilege အမည်တွေရဲ့ comma နဲ့ ခြားထားတဲ့ စာရင်းတစ်ခု ဖြစ်ပြီး — အားလုံးကို ရလဒ်ထဲမှာ သတ်မှတ်ပါတယ်။ (Privilege string ရဲ့ case က အရေးမပါဘဲ — privilege အမည်တွေကြားမှာ နေရာလွတ် ထပ်ခွင့်ပြုပြီး — အမည်တစ်ခုရဲ့ အတွင်းမှာတော့ မခွင့်ပြုပါဘူး။) |
### 9.27.3. Schema Visibility Inquiry Functions (schema မြင်နိုင်မှု စုံစမ်း စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)

ဇယား 9.75 မှာ — object တစ်ခုက လက်ရှိ schema search path ထဲမှာ *visible* (မြင်နိုင်) လားဆိုတာ ဆုံးဖြတ်ပေးတဲ့ လုပ်ဆောင်ချက်တွေကို ပြသထားပါတယ်။ ဥပမာ — table တစ်ခုက ၎င်းပါဝင်တဲ့ schema က search path ထဲမှာ ရှိပြီး — နာမည်တူ table တစ်ခုမှ search path ထဲမှာ သူ့ထက် ရှေ့မှာ မပေါ်ဘူးဆိုရင် visible လို့ ဆိုပါတယ်။ ဒါက — explicit schema qualification မလိုဘဲ နာမည်နဲ့ပဲ table ကို ရည်ညွှန်းလို့ရတယ်ဆိုတာနဲ့ ညီမျှပါတယ်။ ဒါကြောင့် visible table တွေ အားလုံးရဲ့ အမည်တွေကို စာရင်းပြုဖို့:

```sql
SELECT relname FROM pg_class WHERE pg_table_is_visible(oid);
```

Function တွေနဲ့ operator တွေအတွက်ကျတော့ — search path ထဲမှာ ရှိတဲ့ object တစ်ခုက — နာမည်တူပြီး argument data type တွေလည်း တူတဲ့ object တစ်ခုမှ လမ်းကြောင်းထဲမှာ သူ့ထက် ရှေ့မှာ မရှိဘူးဆိုရင် visible လို့ ဆိုပါတယ်။ Operator class တွေနဲ့ operator family တွေအတွက်တော့ — နာမည် ရော ဆက်စပ်နေတဲ့ index access method ရောကို ထည့်စဉ်းစားပါတယ်။

**ဇယား 9.75. Schema Visibility Inquiry Functions (schema မြင်နိုင်မှု စုံစမ်း စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| pg_collation_is_visible ( collation oid ) → boolean Collation က search path ထဲမှာ visible လား? |
| pg_conversion_is_visible ( conversion oid ) → boolean Conversion က search path ထဲမှာ visible လား? |
| pg_function_is_visible ( function oid ) → boolean Function က search path ထဲမှာ visible လား? (ဒါက procedure တွေနဲ့ aggregate တွေအတွက်လည်း အလုပ်လုပ်ပါတယ်။) |
| pg_opclass_is_visible ( opclass oid ) → boolean Operator class က search path ထဲမှာ visible လား? |
| pg_operator_is_visible ( operator oid ) → boolean Operator က search path ထဲမှာ visible လား? |
| pg_opfamily_is_visible ( opclass oid ) → boolean Operator family က search path ထဲမှာ visible လား? |
| pg_statistics_obj_is_visible ( stat oid ) → boolean Statistics object က search path ထဲမှာ visible လား? |
| pg_table_is_visible ( table oid ) → boolean Table က search path ထဲမှာ visible လား? (ဒါက view, materialized view, index, sequence နဲ့ foreign table အပါအဝင် relation အမျိုးအစား အားလုံးအတွက် အလုပ်လုပ်ပါတယ်။) |
| pg_ts_config_is_visible ( config oid ) → boolean Text search configuration က search path ထဲမှာ visible လား? |
| pg_ts_dict_is_visible ( dict oid ) → boolean Text search dictionary က search path ထဲမှာ visible လား? |
| pg_ts_parser_is_visible ( parser oid ) → boolean Text search parser က search path ထဲမှာ visible လား? |
| pg_ts_template_is_visible ( template oid ) → boolean Text search template က search path ထဲမှာ visible လား? |
| pg_type_is_visible ( type oid ) → boolean Type (ဒါမှမဟုတ် domain) က search path ထဲမှာ visible လား? |

ဒီ လုပ်ဆောင်ချက်တွေ အားလုံးက စစ်ဆေးရမယ့် object ကို ဖော်ထုတ်ဖို့ object OID တွေ လိုအပ်ပါတယ်။ Object တစ်ခုကို နာမည်နဲ့ စမ်းသပ်ချင်ရင် — OID alias types (`regclass`, `regtype`, `regprocedure`, `regoperator`, `regconfig`, ဒါမှမဟုတ် `regdictionary`) တွေကို သုံးတာ အဆင်ပြေပါတယ် — ဥပမာ:

```sql
SELECT pg_type_is_visible('myschema.widget'::regtype);
```

ဒီနည်းနဲ့ schema-qualified မဟုတ်တဲ့ type နာမည်ကို စမ်းသပ်တာက အဓိပ္ပာယ် သိပ်မရှိဘူးဆိုတာ သတိပြုပါ — နာမည်ကို မှတ်မိနိုင်တယ်ဆိုရင် သူ့ဟာသူ visible ဖြစ်နေပြီးသားပဲ ဖြစ်ရမှာမို့ပါ။
### 9.27.4. System Catalog Information Functions (system catalog အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.76 မှာ system catalogs တွေကနေ အချက်အလက် ထုတ်ယူပေးတဲ့ လုပ်ဆောင်ချက်တွေကို စာရင်းပြုထားပါတယ်။

**ဇယား 9.76. System Catalog Information Functions (system catalog အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| format_type ( type oid, typemod integer ) → text ၎င်းရဲ့ type OID နဲ့ — ဖြစ်နိုင်ရင် — type modifier တစ်ခုနဲ့ ဖော်ထုတ်ထားတဲ့ data type တစ်ခုအတွက် SQL အမည်ကို ပြန်ပေးပါတယ်။ သတ်မှတ်ထားတဲ့ modifier မရှိဘူးဆိုရင် type modifier နေရာမှာ NULL ပေးပါ။ |
| pg_basetype ( regtype ) → regtype ၎င်းရဲ့ type OID နဲ့ ဖော်ထုတ်ထားတဲ့ domain တစ်ခုရဲ့ base type ရဲ့ OID ကို ပြန်ပေးပါတယ်။ Argument က domain မဟုတ်တဲ့ type တစ်ခုရဲ့ OID ဆိုရင် — argument ကို မပြောင်းလဲဘဲ ပြန်ပေးပါတယ်။ Argument က valid type OID မဟုတ်ရင် NULL ပြန်ပေးပါတယ်။ Domain dependency ကွင်းဆက် (chain) ရှိနေရင် — base type ကို မတွေ့မချင်း ထပ်ခါထပ်ခါ ဆက်သွားပါတယ်။ CREATE DOMAIN mytext AS text လို့ ယူဆရင်: pg_basetype('mytext'::regtype) → text |
| pg_char_to_encoding ( encoding name ) → integer ပေးထားတဲ့ encoding အမည်ကို — system catalog table တချို့မှာ သုံးတဲ့ အတွင်းပိုင်း identifier ကို ကိုယ်စားပြုတဲ့ integer အဖြစ် ပြောင်းပေးပါတယ်။ အမည်မသိ encoding အမည် ပေးရင် -1 ပြန်ပေးပါတယ်။ |
| pg_encoding_to_char ( encoding integer ) → name System catalog table တချို့မှာ encoding တစ်ခုရဲ့ အတွင်းပိုင်း identifier အဖြစ် သုံးတဲ့ integer ကို လူဖတ်လို့ရတဲ့ string အဖြစ် ပြောင်းပေးပါတယ်။ မမှန်ကန်တဲ့ encoding နံပါတ် ပေးရင် ဗလာ string တစ်ခု ပြန်ပေးပါတယ်။ |
| pg_get_catalog_foreign_keys () → setof record ( fktable regclass, fkcols text[], pktable regclass, pkcols text[], is_array boolean, is_opt boolean ) PostgreSQL system catalog တွေအတွင်းမှာ ရှိနေတဲ့ foreign key ဆက်စပ်မှုတွေကို ဖော်ပြတဲ့ record set တစ်ခုကို ပြန်ပေးပါတယ်။ fktable column က ရည်ညွှန်းနေတဲ့ (referencing) catalog ရဲ့ အမည် ပါဝင်ပြီး — fkcols column က ရည်ညွှန်းနေတဲ့ column တွေရဲ့ အမည်(များ) ပါဝင်ပါတယ်။ အလားတူ — pktable column က ရည်ညွှန်းခံရတဲ့ (referenced) catalog ရဲ့ အမည် ပါဝင်ပြီး — pkcols column က ရည်ညွှန်းခံရတဲ့ column တွေရဲ့ အမည်(များ) ပါဝင်ပါတယ်။ is_array က true ဖြစ်ရင် — နောက်ဆုံး referencing column က array တစ်ခု ဖြစ်ပြီး — ၎င်းရဲ့ element တစ်ခုချင်းစီက referenced catalog ထဲက entry တစ်ခုခုနဲ့ ကိုက်ညီသင့်ပါတယ်။ is_opt က true ဖြစ်ရင် — referencing column တွေမှာ valid reference အစား zero တန်ဖိုးတွေ ထားခွင့်ရှိပါတယ်။ |
| pg_get_constraintdef ( constraint oid [, pretty boolean ] ) → text Constraint တစ်ခုအတွက် ဖန်တီးပေးတဲ့ command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_expr ( expr pg_node_tree, relation oid [, pretty boolean ] ) → text System catalogs တွေထဲမှာ သိမ်းထားတဲ့ expression တစ်ခုရဲ့ အတွင်းပိုင်း ပုံစံကို decompile လုပ်ပါတယ် — ဥပမာ column တစ်ခုရဲ့ default value မျိုးပါ။ Expression ထဲမှာ Vars တွေ ပါနိုင်ရင် — သူတို့ ရည်ညွှန်းတဲ့ relation ရဲ့ OID ကို ဒုတိယ parameter အဖြစ် သတ်မှတ်ပါ; Vars မပါနိုင်ဘူးဆိုရင် — သုည ပေးလိုက်ရင် လုံလောက်ပါတယ်။ |
| pg_get_functiondef ( func oid ) → text Function ဒါမှမဟုတ် procedure တစ်ခုအတွက် ဖန်တီးပေးတဲ့ command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) ရလဒ်က CREATE OR REPLACE FUNCTION ဒါမှမဟုတ် CREATE OR REPLACE PROCEDURE statement အပြည့်အစုံ တစ်ခု ဖြစ်ပါတယ်။ |
| pg_get_function_arguments ( func oid ) → text Function ဒါမှမဟုတ် procedure တစ်ခုရဲ့ argument list ကို — CREATE FUNCTION ထဲမှာ ပေါ်ရမယ့် ပုံစံနဲ့ (default values အပါအဝင်) ပြန်လည် တည်ဆောက်ပါတယ်။ |
| pg_get_function_identity_arguments ( func oid ) → text Function ဒါမှမဟုတ် procedure တစ်ခုကို ဖော်ထုတ်ဖို့ လိုအပ်တဲ့ argument list ကို — ALTER FUNCTION လိုမျိုး command တွေထဲမှာ ပေါ်ရမယ့် ပုံစံနဲ့ ပြန်လည် တည်ဆောက်ပါတယ်။ ဒီပုံစံမှာ default values တွေ ချန်လှပ်ထားပါတယ်။ |
| pg_get_function_result ( func oid ) → text Function တစ်ခုရဲ့ RETURNS clause ကို — CREATE FUNCTION ထဲမှာ ပေါ်ရမယ့် ပုံစံနဲ့ ပြန်လည် တည်ဆောက်ပါတယ်။ Procedure အတွက်တော့ NULL ပြန်ပေးပါတယ်။ |
| pg_get_indexdef ( index oid [, column integer, pretty boolean ] ) → text Index တစ်ခုအတွက် ဖန်တီးပေးတဲ့ command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) column ကို ပေးထားပြီး သုည မဟုတ်ရင် — အဲဒီ column တစ်ခုတည်းရဲ့ definition ကိုပဲ ပြန်လည် တည်ဆောက်ပါတယ်။ |
| pg_get_keywords () → setof record ( word text, catcode "char", barelabel boolean, catdesc text, baredesc text ) Server က မှတ်မိတဲ့ SQL keywords တွေကို ဖော်ပြတဲ့ record set တစ်ခုကို ပြန်ပေးပါတယ်။ word column က keyword ပါဝင်ပါတယ်။ catcode column က အမျိုးအစား code ပါဝင်ပြီး: U က reserved မဟုတ်တဲ့ (unreserved) keyword, C က column name အဖြစ် သုံးလို့ရတဲ့ keyword, T က type ဒါမှမဟုတ် function name အဖြစ် သုံးလို့ရတဲ့ keyword, R က အပြည့်အဝ reserved keyword ဖြစ်ပါတယ်။ barelabel column က — keyword ကို SELECT list တွေထဲမှာ “bare” column label အဖြစ် သုံးလို့ရရင် true — AS နောက်မှာပဲ သုံးလို့ရရင် false ပါဝင်ပါတယ်။ catdesc column က keyword ရဲ့ အမျိုးအစားကို ဖော်ပြတဲ့ — localization လုပ်ထားနိုင်တဲ့ string ပါဝင်ပြီး — baredesc column က keyword ရဲ့ column label အခြေအနေကို ဖော်ပြတဲ့ localization လုပ်ထားနိုင်တဲ့ string ပါဝင်ပါတယ်။ |
| pg_get_partition_constraintdef ( table oid ) → text Partition constraint တစ်ခုရဲ့ definition ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_partkeydef ( table oid ) → text Partitioned table တစ်ခုရဲ့ partition key definition ကို — CREATE TABLE ရဲ့ PARTITION BY clause ထဲမှာ ရှိမယ့် ပုံစံနဲ့ ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_ruledef ( rule oid [, pretty boolean ] ) → text Rule တစ်ခုအတွက် ဖန်တီးပေးတဲ့ command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_serial_sequence ( table text, column text ) → text Column တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ sequence ရဲ့ အမည်ကို ပြန်ပေးပါတယ် — column နဲ့ ဆက်စပ်နေတဲ့ sequence မရှိရင် NULL ပြန်ပေးပါတယ်။ Column က identity column ဖြစ်ရင် — ဆက်စပ်နေတဲ့ sequence က အဲဒီ column အတွက် အတွင်းပိုင်းမှာ ဖန်တီးထားတဲ့ sequence ဖြစ်ပါတယ်။ serial type တွေထဲက တစ်ခု (serial, smallserial, bigserial) နဲ့ ဖန်တီးထားတဲ့ column တွေအတွက်တော့ — အဲဒီ serial column definition အတွက် ဖန်တီးထားတဲ့ sequence ဖြစ်ပါတယ်။ နောက်ဆုံး ကိစ္စမှာ — ဒီဆက်စပ်မှုကို ALTER SEQUENCE OWNED BY နဲ့ ပြုပြင် ဒါမှမဟုတ် ဖယ်ရှားနိုင်ပါတယ်။ (ဒီ function ကို pg_get_owned_sequence လို့ ခေါ်သင့်တာ ဖြစ်နိုင်ပေမယ့် — လက်ရှိ နာမည်က serial-type column တွေနဲ့ သမိုင်းအရ အသုံးပြုခဲ့တာကို ထင်ဟပ်ပါတယ်။) ပထမ parameter က optional schema ပါတဲ့ table အမည် ဖြစ်ပြီး — ဒုတိယ parameter က column အမည် ဖြစ်ပါတယ်။ ပထမ parameter မှာ schema ရော table အမည်ပါ ပါဝင်နိုင်လို့ — သာမန် SQL စည်းမျဉ်းတွေအတိုင်း parse လုပ်ပြီး — ဆိုလိုတာ default အားဖြင့် lowercase ပြောင်းခံရပါတယ်။ ဒုတိယ parameter ကတော့ column အမည် တစ်ခုတည်းသာ ဖြစ်လို့ — စာလုံးအတိုင်း သဘောထားပြီး case ကို ထိန်းသိမ်းပါတယ်။ ရလဒ်က sequence functions တွေဆီ (အပိုင်း 9.17 ကို ကြည့်ပါ) ပေးပို့ဖို့ သင့်လျော်စွာ format လုပ်ထားပါတယ်။ ပုံမှန် အသုံးတစ်ခုက — identity ဒါမှမဟုတ် serial column တစ်ခုရဲ့ sequence ရဲ့ လက်ရှိ တန်ဖိုးကို ဖတ်တာပါ — ဥပမာ:  SELECT currval(pg_get_serial_sequence('sometable', 'id')); |
| pg_get_statisticsobjdef ( statobj oid ) → text Extended statistics object တစ်ခုအတွက် ဖန်တီးပေးတဲ့ command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_triggerdef ( trigger oid [, pretty boolean ] ) → text Trigger တစ်ခုအတွက် ဖန်တီးပေးတဲ့ command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_userbyid ( role oid ) → name OID တစ်ခု ပေးထားရင် role ရဲ့ အမည်ကို ပြန်ပေးပါတယ်။ |
| pg_get_viewdef ( view oid [, pretty boolean ] ) → text View ဒါမှမဟုတ် materialized view တစ်ခုအတွက် အောက်ခံ SELECT command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) |
| pg_get_viewdef ( view oid, wrap_column integer ) → text View ဒါမှမဟုတ် materialized view တစ်ခုအတွက် အောက်ခံ SELECT command ကို ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက decompile လုပ်ပြီး ပြန်တည်ဆောက်တာ ဖြစ်ပြီး — command ရဲ့ မူရင်း text မဟုတ်ပါဘူး။) ဒီ function ပုံစံမှာ pretty-printing က အမြဲ enabled ဖြစ်ပြီး — ရှည်လျားတဲ့ စာကြောင်းတွေကို သတ်မှတ်ထားတဲ့ column အရေအတွက်ထက် တိုအောင် wrap လုပ်ပါတယ်။ |
| pg_get_viewdef ( view text [, pretty boolean ] ) → text View ဒါမှမဟုတ် materialized view တစ်ခုအတွက် အောက်ခံ SELECT command ကို — view ရဲ့ OID အစား စာသား (textual) အမည်ကနေ လုပ်ဆောင်ပြီး ပြန်လည် တည်ဆောက်ပါတယ်။ (ဒါက deprecated (အသုံးမပြုတော့ရန်) ဖြစ်ပါတယ်; OID variant ကို သုံးပါ။) |
| pg_index_column_has_property ( index regclass, column integer, property text ) → boolean Index column တစ်ခုမှာ နာမည်ပေးထားတဲ့ property ရှိမရှိ စမ်းသပ်ပါတယ်။ အသုံးများတဲ့ index column properties တွေကို ဇယား 9.77 မှာ စာရင်းပြုထားပါတယ်။ (Extension access methods တွေက သူတို့ရဲ့ indexes တွေအတွက် property နာမည်တွေ ထပ်ထည့် သတ်မှတ်နိုင်တာ သတိပြုပါ။) Property နာမည် မသိဘူး၊ ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ object နဲ့ မသက်ဆိုင်ဘူး၊ ဒါမှမဟုတ် OID ဒါမှမဟုတ် column နံပါတ်က valid object တစ်ခုကို ဖော်မပြနိုင်ဘူးဆိုရင် NULL ပြန်ပေးပါတယ်။ |
| pg_index_has_property ( index regclass, property text ) → boolean Index တစ်ခုမှာ နာမည်ပေးထားတဲ့ property ရှိမရှိ စမ်းသပ်ပါတယ်။ အသုံးများတဲ့ index properties တွေကို ဇယား 9.78 မှာ စာရင်းပြုထားပါတယ်။ (Extension access methods တွေက သူတို့ရဲ့ indexes တွေအတွက် property နာမည်တွေ ထပ်ထည့် သတ်မှတ်နိုင်တာ သတိပြုပါ။) Property နာမည် မသိဘူး၊ ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ object နဲ့ မသက်ဆိုင်ဘူး၊ ဒါမှမဟုတ် OID က valid object တစ်ခုကို ဖော်မပြနိုင်ဘူးဆိုရင် NULL ပြန်ပေးပါတယ်။ |
| pg_indexam_has_property ( am oid, property text ) → boolean Index access method တစ်ခုမှာ နာမည်ပေးထားတဲ့ property ရှိမရှိ စမ်းသပ်ပါတယ်။ Access method properties တွေကို ဇယား 9.79 မှာ စာရင်းပြုထားပါတယ်။ Property နာမည် မသိဘူး၊ ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ object နဲ့ မသက်ဆိုင်ဘူး၊ ဒါမှမဟုတ် OID က valid object တစ်ခုကို ဖော်မပြနိုင်ဘူးဆိုရင် NULL ပြန်ပေးပါတယ်။ |
| pg_options_to_table ( options_array text[] ) → setof record ( option_name text, option_value text ) pg_class.reloptions ဒါမှမဟုတ် pg_attribute.attoptions က တန်ဖိုးတစ်ခုက ကိုယ်စားပြုတဲ့ storage options set ကို ပြန်ပေးပါတယ်။ |
| pg_settings_get_flags ( guc text ) → text[] ပေးထားတဲ့ GUC နဲ့ ဆက်စပ်နေတဲ့ flags တွေရဲ့ array ကို ပြန်ပေးပါတယ် — GUC မရှိရင် NULL ပြန်ပေးပါတယ်။ GUC ရှိပေမယ့် ပြသစရာ flags မရှိရင် ရလဒ်က ဗလာ array ဖြစ်ပါတယ်။ ဇယား 9.80 မှာ ဖော်ပြထားတဲ့ အသုံးဝင်ဆုံး flags တွေကိုပဲ ထုတ်ဖော်ပါတယ်။ |
| pg_tablespace_databases ( tablespace oid ) → setof oid သတ်မှတ်ထားတဲ့ tablespace ထဲမှာ object တွေ သိမ်းထားတဲ့ database တွေရဲ့ OID set ကို ပြန်ပေးပါတယ်။ ဒီ function က row တွေ ပြန်ပေးရင် — tablespace က ဗလာ မဟုတ်လို့ drop လုပ်လို့ မရပါဘူး။ Tablespace ကို သိမ်းပိုက်ထားတဲ့ တိကျတဲ့ object တွေကို ဖော်ထုတ်ဖို့ — pg_tablespace_databases က ဖော်ပြတဲ့ database တွေဆီ connect လုပ်ပြီး သူတို့ရဲ့ pg_class catalog တွေကို query လုပ်ဖို့ လိုပါတယ်။ |
| pg_tablespace_location ( tablespace oid ) → text ဒီ tablespace ရှိနေတဲ့ file system path ကို ပြန်ပေးပါတယ်။ |
| pg_typeof ( "any" ) → regtype ဒီ function ကို ပေးပို့လိုက်တဲ့ တန်ဖိုးရဲ့ data type ရဲ့ OID ကို ပြန်ပေးပါတယ်။ Troubleshooting (ပြဿနာ ရှာဖွေခြင်း) ဒါမှမဟုတ် SQL query တွေကို dynamically တည်ဆောက်ရာမှာ အသုံးဝင်နိုင်ပါတယ်။ Function က regtype ပြန်ပေးတဲ့အနေနဲ့ ကြေညာထားပြီး — regtype က OID alias type တစ်ခုပါ (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါက နှိုင်းယှဉ်ရာမှာ OID နဲ့ အတူတူပဲ ဆိုပေမယ့် type အမည်အနေနဲ့ display လုပ်ပါတယ်။ pg_typeof(33) → integer |
| COLLATION FOR ( "any" ) → text ဒီ function ကို ပေးပို့လိုက်တဲ့ တန်ဖိုးရဲ့ collation ရဲ့ အမည်ကို ပြန်ပေးပါတယ်။ ရလဒ် အမည်ကို လိုအပ်ရင် quote လုပ်ပြီး schema-qualified လုပ်ပါတယ်။ Argument expression အတွက် collation တစ်ခုကို ဆင်းသက် မရယူနိုင်ဘူးဆိုရင် NULL ပြန်ပေးပါတယ်။ Argument က collatable data type တစ်ခု မဟုတ်ဘူးဆိုရင် error တက်ပါတယ်။ collation for ('foo'::text) → "default" collation for ('foo' COLLATE "de_DE") → "de_DE" |
| to_regclass ( text ) → regclass Textual relation name တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regclass type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regcollation ( text ) → regcollation Textual collation အမည်တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regcollation type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regnamespace ( text ) → regnamespace Textual schema အမည်တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regnamespace type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regoper ( text ) → regoper Textual operator အမည်တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regoper type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် ဒါမှမဟုတ် ambiguous (မရေရာ) ဖြစ်နေရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regoperator ( text ) → regoperator Textual operator အမည် (parameter types တွေနဲ့) တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regoperator type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regproc ( text ) → regproc Textual function ဒါမှမဟုတ် procedure အမည်တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regproc type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် ဒါမှမဟုတ် ambiguous ဖြစ်နေရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regprocedure ( text ) → regprocedure Textual function ဒါမှမဟုတ် procedure အမည် (argument types တွေနဲ့) တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regprocedure type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regrole ( text ) → regrole Textual role အမည်တစ်ခုကို ၎င်းရဲ့ OID အဖြစ် ပြောင်းပါတယ်။ String ကို regrole type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ); ဒါပေမယ့် — ဒီ function ကတော့ အမည် မတွေ့ရင် error မပစ်ဘဲ NULL ပြန်ပေးပါတယ်။ |
| to_regtype ( text ) → regtype Text string တစ်ခုကို parse လုပ်ပြီး — ဖြစ်နိုင်တဲ့ type အမည်ကို ထုတ်ယူကာ — အဲဒီ အမည်ကို type OID အဖြစ် ပြောင်းပါတယ်။ String ထဲမှာ syntax error ရှိရင် error ဖြစ်ပါတယ်; ဒါပေမယ့် — string က syntactically valid type name ဖြစ်ပြီး catalog တွေထဲမှာ မတွေ့ရဘူးဆိုရင် ရလဒ်က NULL ပါ။ String ကို regtype type ဆီ cast လုပ်ခြင်းဖြင့်လည်း အလားတူ ရလဒ် ရပါတယ် (အပိုင်း 8.19 ကို ကြည့်ပါ) — ဒါပေမယ့် အဲဒီနည်းက အမည် မတွေ့ရင် error ပစ်မှာ ဖြစ်ပါတယ်။ |
| to_regtypemod ( text ) → integer Text string တစ်ခုကို parse လုပ်ပြီး — ဖြစ်နိုင်တဲ့ type အမည်ကို ထုတ်ယူကာ — ၎င်းရဲ့ type modifier (ရှိရင်) ကို ပြောင်းပါတယ်။ String ထဲမှာ syntax error ရှိရင် error ဖြစ်ပါတယ်; ဒါပေမယ့် — string က syntactically valid type name ဖြစ်ပြီး catalog တွေထဲမှာ မတွေ့ရဘူးဆိုရင် ရလဒ်က NULL ပါ။ Type modifier မပါဘူးဆိုရင် ရလဒ်က -1 ဖြစ်ပါတယ်။ to_regtypemod ကို to_regtype နဲ့ တွဲသုံးပြီး — format_type အတွက် သင့်လျော်တဲ့ inputs တွေ ထုတ်လုပ်နိုင်ကာ — type အမည်ကို ကိုယ်စားပြုတဲ့ string တစ်ခုကို canonicalize (စံပုံစံချခြင်း) လုပ်နိုင်ပါတယ်။ format_type(to_regtype('varchar(32)'), to_regtypemod('varchar(32)')) → character varying(32) |
Database object တွေကို ပြန်လည် တည်ဆောက် (decompile) လုပ်ပေးတဲ့ လုပ်ဆောင်ချက် အများစုမှာ optional *pretty* flag ပါဝင်ပြီး — `true` ဆိုရင် ရလဒ်ကို “pretty-printed” (လှပစွာ ဖော်ပြခြင်း) လုပ်ပါတယ်။ Pretty-printing က မလိုအပ်တဲ့ parentheses တွေကို ဖယ်ရှားပြီး ဖတ်ရလွယ်အောင် whitespace ထပ်ထည့်ပါတယ်။ Pretty-printed format က ပိုဖတ်ရလွယ်ပေမယ့် — default format ကတော့ နောင်ကာလ PostgreSQL ဗားရှင်းတွေမှာ အဓိပ္ပာယ် တူညီစွာ ပြန်ဆိုခံရဖို့ ပိုများပါတယ်; ဒါကြောင့် dump လုပ်တဲ့ ရည်ရွယ်ချက်တွေအတွက် pretty-printed output သုံးတာ ရှောင်ပါ။ *pretty* parameter အတွက် `false` ပေးတာက parameter မပေးဘဲ ထားတာနဲ့ ရလဒ် အတူတူပဲ ဖြစ်ပါတယ်။

**ဇယား 9.77. Index Column Properties (index column properties များ)**

| နာမည် | ဖော်ပြချက် |
| --- | --- |
| `asc` | Forward scan (ရှေ့သို့ scan) တစ်ခုမှာ column က ascending order နဲ့ sort လုပ်ပါသလား? |
| `desc` | Forward scan တစ်ခုမှာ column က descending order နဲ့ sort လုပ်ပါသလား? |
| `nulls_first` | Forward scan တစ်ခုမှာ column က nulls တွေကို ရှေ့မှာ ထားပြီး sort လုပ်ပါသလား? |
| `nulls_last` | Forward scan တစ်ခုမှာ column က nulls တွေကို နောက်မှာ ထားပြီး sort လုပ်ပါသလား? |
| `orderable` | Column မှာ သတ်မှတ်ထားတဲ့ sort ordering တစ်ခုခု ရှိပါသလား? |
| `distance_orderable` | Column ကို “distance” operator တစ်ခုနဲ့ — ဥပမာ `ORDER BY col <-> constant` — order လိုက် scan လုပ်နိုင်ပါသလား? |
| `returnable` | Column တန်ဖိုးကို index-only scan တစ်ခုက ပြန်ပေးနိုင်ပါသလား? |
| `search_array` | Column က `col = ANY(array)` ရှာဖွေမှုတွေကို မူရင်း (natively) ထောက်ပံ့ပါသလား? |
| `search_nulls` | Column က `IS NULL` နဲ့ `IS NOT NULL` ရှာဖွေမှုတွေကို ထောက်ပံ့ပါသလား? |

**ဇယား 9.78. Index Properties (index properties များ)**

| နာမည် | ဖော်ပြချက် |
| --- | --- |
| `clusterable` | Index ကို `CLUSTER` command တစ်ခုထဲမှာ သုံးလို့ရပါသလား? |
| `index_scan` | Index က သာမန် (bitmap မဟုတ်တဲ့) scan တွေကို ထောက်ပံ့ပါသလား? |
| `bitmap_scan` | Index က bitmap scan တွေကို ထောက်ပံ့ပါသလား? |
| `backward_scan` | Scan တစ်ခုရဲ့ လမ်းကြောင်းကို scan အလယ်မှာ ပြောင်းလဲနိုင်ပါသလား (cursor တစ်ခုပေါ်မှာ `FETCH BACKWARD` ကို materialization မလိုဘဲ ထောက်ပံ့ဖို့)? |

**ဇယား 9.79. Index Access Method Properties (index access method properties များ)**

| နာမည် | ဖော်ပြချက် |
| --- | --- |
| `can_order` | Access method က `CREATE INDEX` ထဲမှာ `ASC`, `DESC` နဲ့ ဆက်စပ်တဲ့ keywords တွေကို ထောက်ပံ့ပါသလား? |
| `can_unique` | Access method က unique indexes တွေကို ထောက်ပံ့ပါသလား? |
| `can_multi_col` | Access method က column အများအပြား ပါတဲ့ indexes တွေကို ထောက်ပံ့ပါသလား? |
| `can_exclude` | Access method က exclusion constraints တွေကို ထောက်ပံ့ပါသလား? |
| `can_include` | Access method က `CREATE INDEX` ရဲ့ `INCLUDE` clause ကို ထောက်ပံ့ပါသလား? |

**ဇယား 9.80. GUC Flags (GUC flags များ)**

| Flag | ဖော်ပြချက် |
| --- | --- |
| `EXPLAIN` | ဒီ flag ပါတဲ့ parameters တွေကို `EXPLAIN (SETTINGS)` command တွေမှာ ထည့်သွင်းပါတယ်။ |
| `NO_SHOW_ALL` | ဒီ flag ပါတဲ့ parameters တွေကို `SHOW ALL` command တွေကနေ ဖယ်ထုတ်ထားပါတယ်။ |
| `NO_RESET` | ဒီ flag ပါတဲ့ parameters တွေက `RESET` command တွေကို မထောက်ပံ့ပါဘူး။ |
| `NO_RESET_ALL` | ဒီ flag ပါတဲ့ parameters တွေကို `RESET ALL` command တွေကနေ ဖယ်ထုတ်ထားပါတယ်။ |
| `NOT_IN_SAMPLE` | ဒီ flag ပါတဲ့ parameters တွေကို default အားဖြင့် `postgresql.conf` ထဲမှာ ထည့်မပါပါဘူး။ |
| `RUNTIME_COMPUTED` | ဒီ flag ပါတဲ့ parameters တွေက runtime မှာ တွက်ချက်တဲ့ (runtime-computed) ဟာတွေ ဖြစ်ပါတယ်။ |
### 9.27.5. Object Information and Addressing Functions (object အချက်အလက်နှင့် addressing လုပ်ဆောင်ချက်များ)

ဇယား 9.81 မှာ database object တွေကို ဖော်ထုတ်ခြင်းနဲ့ လိပ်စာသတ်မှတ်ခြင်း (identification and addressing) နဲ့ ဆက်စပ်တဲ့ လုပ်ဆောင်ချက်တွေကို စာရင်းပြုထားပါတယ်။

**ဇယား 9.81. Object Information and Addressing Functions (object အချက်အလက်နှင့် addressing လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| pg_get_acl ( classid oid, objid oid, objsubid integer ) → aclitem[] Catalog OID, object OID နဲ့ sub-object ID တွေနဲ့ သတ်မှတ်ထားတဲ့ database object တစ်ခုအတွက် ACL ကို ပြန်ပေးပါတယ်။ ဒီ function က undefined object တွေအတွက် NULL တန်ဖိုးတွေ ပြန်ပေးပါတယ်။ |
| pg_describe_object ( classid oid, objid oid, objsubid integer ) → text Catalog OID, object OID နဲ့ sub-object ID (ဥပမာ table တစ်ခုအတွင်းက column နံပါတ်; object တစ်ခုလုံးကို ရည်ညွှန်းတဲ့အခါ sub-object ID က သုည) တွေနဲ့ ဖော်ထုတ်ထားတဲ့ database object တစ်ခုရဲ့ စာသား (textual) ဖော်ပြချက်ကို ပြန်ပေးပါတယ်။ ဒီ ဖော်ပြချက်က လူဖတ်လို့ရအောင် ရည်ရွယ်ထားပြီး — server configuration ပေါ် မူတည်ပြီး ဘာသာပြန်ဆိုခံရနိုင်ပါတယ်။ pg_depend catalog ထဲမှာ ရည်ညွှန်းထားတဲ့ object တစ်ခုရဲ့ ဝိသေသ (identity) ကို ဆုံးဖြတ်ဖို့ အထူး အသုံးဝင်ပါတယ်။ ဒီ function က undefined object တွေအတွက် NULL တန်ဖိုးတွေ ပြန်ပေးပါတယ်။ |
| pg_identify_object ( classid oid, objid oid, objsubid integer ) → record ( type text, schema text, name text, identity text ) Catalog OID, object OID နဲ့ sub-object ID တွေနဲ့ သတ်မှတ်ထားတဲ့ database object တစ်ခုကို ထူးခြားစွာ ဖော်ထုတ်ဖို့ လုံလောက်တဲ့ အချက်အလက်တွေ ပါဝင်တဲ့ row တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ အချက်အလက်က machine-readable (စက်ဖြင့် ဖတ်ရန်) ဖြစ်ဖို့ ရည်ရွယ်ထားပြီး — ဘယ်တော့မှ ဘာသာပြန်ဆိုမခံပါဘူး။ type က database object ရဲ့ အမျိုးအစားကို ဖော်ပြပါတယ်; schema က object ပါဝင်တဲ့ schema ရဲ့ အမည် ဖြစ်ပြီး — schema တွေထဲ မပါဝင်တဲ့ object type တွေအတွက် NULL ဖြစ်ပါတယ်; name က object ရဲ့ အမည် ဖြစ်ပြီး — လိုအပ်ရင် quote လုပ်ထားကာ — (schema အမည် သက်ဆိုင်ရင် အဲဒါနဲ့အတူ) နာမည်တစ်ခုတည်းနဲ့ object ကို ထူးခြားစွာ ဖော်ထုတ်လို့ရရင် အဲဒီ အမည် ဖြစ်ပြီး — မရရင် NULL ဖြစ်ပါတယ်; identity က object ရဲ့ အပြည့်အစုံ ဝိသေသ ဖြစ်ပြီး — တိကျတဲ့ format က object type ပေါ်မှာ မူတည်ကာ — format ထဲက အမည်တစ်ခုချင်းစီကို လိုအပ်သလို schema-qualified ပြီး quote လုပ်ထားပါတယ်။ Undefined object တွေကို NULL တန်ဖိုးတွေနဲ့ ဖော်ထုတ်ပါတယ်။ |
| pg_identify_object_as_address ( classid oid, objid oid, objsubid integer ) → record ( type text, object_names text[], object_args text[] ) Catalog OID, object OID နဲ့ sub-object ID တွေနဲ့ သတ်မှတ်ထားတဲ့ database object တစ်ခုကို ထူးခြားစွာ ဖော်ထုတ်ဖို့ လုံလောက်တဲ့ အချက်အလက်တွေ ပါဝင်တဲ့ row တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ အချက်အလက်က လက်ရှိ server နဲ့ သီးခြား (independent) ဖြစ်ပြီး — ဆိုလိုတာ တခြား server တစ်ခုမှာရှိတဲ့ နာမည်တူ object တစ်ခုကို ဖော်ထုတ်ဖို့ အသုံးပြုနိုင်ပါတယ်။ type က database object ရဲ့ အမျိုးအစားကို ဖော်ပြပြီး — object_names နဲ့ object_args တို့က object တစ်ခုဆီရဲ့ ရည်ညွှန်းချက် (reference) တစ်ခုကို အတူတကွ ဖွဲ့စည်းတဲ့ text array နှစ်ခု ဖြစ်ပါတယ်။ ဒီ တန်ဖိုး သုံးခုကို pg_get_object_address ဆီ ပေးပို့ပြီး — object ရဲ့ အတွင်းပိုင်း လိပ်စာကို ရယူနိုင်ပါတယ်။ |
| pg_get_object_address ( type text, object_names text[], object_args text[] ) → record ( classid oid, objid oid, objsubid integer ) Type code တစ်ခုနဲ့ object အမည်နဲ့ argument array တွေနဲ့ သတ်မှတ်ထားတဲ့ database object တစ်ခုကို ထူးခြားစွာ ဖော်ထုတ်ဖို့ လုံလောက်တဲ့ အချက်အလက်တွေ ပါဝင်တဲ့ row တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ တန်ဖိုးတွေက pg_depend လိုမျိုး system catalog တွေမှာ သုံးမယ့် တန်ဖိုးတွေ ဖြစ်ပြီး — pg_describe_object ဒါမှမဟုတ် pg_identify_object လိုမျိုး တခြား system function တွေဆီ ပေးပို့နိုင်ပါတယ်။ classid က object ပါဝင်တဲ့ system catalog ရဲ့ OID; objid က object ကိုယ်တိုင်၏ OID ဖြစ်ပြီး objsubid က sub-object ID ဖြစ်ကာ — မရှိရင် သုည ဖြစ်ပါတယ်။ ဒီ function က pg_identify_object_as_address ရဲ့ ပြောင်းပြန် (inverse) ဖြစ်ပါတယ်။ Undefined object တွေကို NULL တန်ဖိုးတွေနဲ့ ဖော်ထုတ်ပါတယ်။ |

`pg_get_acl` က — တိကျတဲ့ catalog တွေကို ကြည့်စရာ မလိုဘဲ — database object တွေနဲ့ ဆက်စပ်နေတဲ့ privilege တွေကို ရယူပြီး စစ်ဆေးရာမှာ အသုံးဝင်ပါတယ်။ ဥပမာ — လက်ရှိ database ထဲက object တွေပေါ်မှာ ပေးအပ်ထားတဲ့ privilege တွေ အားလုံးကို ရယူဖို့:

```
postgres=# SELECT
    (pg_identify_object(s.classid,s.objid,s.objsubid)).*,
    pg_catalog.pg_get_acl(s.classid,s.objid,s.objsubid) AS acl
FROM pg_catalog.pg_shdepend AS s
JOIN pg_catalog.pg_database AS d
    ON d.datname = current_database() AND
       d.oid = s.dbid
JOIN pg_catalog.pg_authid AS a
    ON a.oid = s.refobjid AND
       s.refclassid = 'pg_authid'::regclass
WHERE s.deptype = 'a';
-[ RECORD 1 ]-----------------------------------------
type     | table
schema   | public
name     | testtab
identity | public.testtab
acl      | {postgres=arwdDxtm/postgres,foo=r/postgres}
```
### 9.27.6. Comment Information Functions (comment အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.82 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက — [COMMENT](https://www.postgresql.org/docs/current/sql-comment.html) command နဲ့ အရင်က သိမ်းထားခဲ့တဲ့ comment တွေကို ထုတ်ယူပါတယ်။ သတ်မှတ်ထားတဲ့ parameters တွေအတွက် comment မတွေ့ရင် null တန်ဖိုး ပြန်ပေးပါတယ်။

**ဇယား 9.82. Comment Information Functions (comment အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| col_description ( table oid, column integer ) → text Table column တစ်ခုအတွက် comment ကို ပြန်ပေးပါတယ် — column ကို သူ့ရဲ့ table ရဲ့ OID နဲ့ column နံပါတ်နဲ့ သတ်မှတ်ပါတယ်။ (Column တွေမှာ ကိုယ်ပိုင် OID မရှိလို့ — table column တွေအတွက် obj_description ကို သုံးလို့မရပါဘူး။) |
| obj_description ( object oid, catalog name ) → text သူ့ရဲ့ OID နဲ့ ၎င်းပါဝင်တဲ့ system catalog ရဲ့ အမည်နဲ့ သတ်မှတ်ထားတဲ့ database object တစ်ခုအတွက် comment ကို ပြန်ပေးပါတယ်။ ဥပမာ — obj_description(123456, 'pg_class') က OID 123456 ရှိတဲ့ table ရဲ့ comment ကို ရယူပေးမှာ ဖြစ်ပါတယ်။ |
| obj_description ( object oid ) → text OID တစ်ခုတည်းနဲ့ သတ်မှတ်ထားတဲ့ database object တစ်ခုအတွက် comment ကို ပြန်ပေးပါတယ်။ ဒါက deprecated (အသုံးမပြုတော့ရန်) ဖြစ်ပါတယ် — OID တွေက system catalog အမျိုးမျိုးကြားမှာ ထူးခြားမှု ရှိတယ်လို့ အာမခံချက် မရှိလို့ပါ; ဒါကြောင့် မှားယွင်းတဲ့ comment ပြန်ရနိုင်ပါတယ်။ |
| shobj_description ( object oid, catalog name ) → text သူ့ရဲ့ OID နဲ့ ၎င်းပါဝင်တဲ့ system catalog ရဲ့ အမည်နဲ့ သတ်မှတ်ထားတဲ့ shared database object တစ်ခုအတွက် comment ကို ပြန်ပေးပါတယ်။ ဒါက obj_description နဲ့ ဆင်တူပေမယ့် — shared object တွေ (ဆိုလိုတာ database, role နဲ့ tablespace တွေ) ပေါ်က comment တွေကို ရယူဖို့ သုံးပါတယ်။ System catalog တချို့က cluster တစ်ခုစီအတွင်းက database တွေ အားလုံးအတွက် global ဖြစ်ပြီး — သူတို့ထဲက object တွေရဲ့ ဖော်ပြချက်တွေကိုလည်း global အနေနဲ့ သိမ်းဆည်းထားပါတယ်။ |

### 9.27.7. Data Validity Checking Functions (data တရားဝင်မှု စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)

ဇယား 9.83 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက — အဆိုပြုထားတဲ့ (proposed) input data တွေရဲ့ တရားဝင်မှု (validity) ကို စစ်ဆေးရာမှာ အသုံးဝင်နိုင်ပါတယ်။

**ဇယား 9.83. Data Validity Checking Functions (data တရားဝင်မှု စစ်ဆေးသည့် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| pg_input_is_valid ( string text, type text ) → boolean ပေးထားတဲ့ string က သတ်မှတ်ထားတဲ့ data type အတွက် valid input ဟုတ်မဟုတ် စမ်းသပ်ပြီး true ဒါမှမဟုတ် false ပြန်ပေးပါတယ်။ ဒီ function က — data type ရဲ့ input function က invalid input တွေကို “soft” error အဖြစ် သတင်းပို့အောင် update လုပ်ထားမှသာ — လိုချင်တဲ့အတိုင်း အလုပ်လုပ်မှာ ဖြစ်ပါတယ်။ မဟုတ်ရင် — string ကို type ဆီ တိုက်ရိုက် cast လုပ်လိုက်သလိုပဲ — invalid input က transaction ကို abort လုပ်ပစ်မှာ ဖြစ်ပါတယ်။ pg_input_is_valid('42', 'integer') → t pg_input_is_valid('42000000000', 'integer') → f pg_input_is_valid('1234.567', 'numeric(7,4)') → f |
| pg_input_error_info ( string text, type text ) → record ( message text, detail text, hint text, sql_error_code text ) ပေးထားတဲ့ string က သတ်မှတ်ထားတဲ့ data type အတွက် valid input ဟုတ်မဟုတ် စမ်းသပ်ပြီး — မဟုတ်ရင် ပစ်ချမယ့် error ရဲ့ အသေးစိတ် အချက်အလက်တွေကို ပြန်ပေးပါတယ်။ Input က valid ဖြစ်ရင် ရလဒ်တွေက NULL ဖြစ်ပါတယ်။ Inputs တွေက pg_input_is_valid အတွက် အတူတူပဲ ဖြစ်ပါတယ်။ ဒီ function က — data type ရဲ့ input function က invalid input တွေကို “soft” error အဖြစ် သတင်းပို့အောင် update လုပ်ထားမှသာ — လိုချင်တဲ့အတိုင်း အလုပ်လုပ်မှာ ဖြစ်ပါတယ်။ မဟုတ်ရင် — string ကို type ဆီ တိုက်ရိုက် cast လုပ်လိုက်သလိုပဲ — invalid input က transaction ကို abort လုပ်ပစ်မှာ ဖြစ်ပါတယ်။ SELECT * FROM pg_input_error_info('42000000000', 'integer') →                         message                        \| detail \| hint \| sql_error_code ------------------------------------------------------+--------+------+----------------  value "42000000000" is out of range for type integer \|        \|      \| 22003 |
### 9.27.8. Transaction ID and Snapshot Information Functions (transaction ID နှင့် snapshot အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.84 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက — export လုပ်လို့ရတဲ့ (exportable) ပုံစံနဲ့ server transaction အချက်အလက်တွေကို ပေးပါတယ်။ ဒီ လုပ်ဆောင်ချက်တွေရဲ့ အဓိက အသုံးက — snapshot နှစ်ခုကြားမှာ ဘယ် transaction တွေ commit ဖြစ်ခဲ့လဲဆိုတာ ဆုံးဖြတ်ဖို့ ဖြစ်ပါတယ်။

**ဇယား 9.84. Transaction ID and Snapshot Information Functions (transaction ID နှင့် snapshot အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| age ( xid ) → integer ပေးထားတဲ့ transaction id နဲ့ လက်ရှိ transaction counter ကြားက transaction အရေအတွက်ကို ပြန်ပေးပါတယ်။ |
| mxid_age ( xid ) → integer ပေးထားတဲ့ multixact ID နဲ့ လက်ရှိ multixacts counter ကြားက multixacts ID အရေအတွက်ကို ပြန်ပေးပါတယ်။ |
| pg_current_xact_id () → xid8 လက်ရှိ transaction ရဲ့ ID ကို ပြန်ပေးပါတယ်။ လက်ရှိ transaction မှာ ID မရှိသေးရင် (database update တွေ မလုပ်ရသေးလို့) အသစ်တစ်ခု သတ်မှတ်ပေးပါတယ်; အသေးစိတ်အတွက် အပိုင်း 67.1 ကို ကြည့်ပါ။ Subtransaction တစ်ခုထဲမှာ run ရင် top-level transaction ID ကို ပြန်ပေးပါတယ်; အသေးစိတ်အတွက် အပိုင်း 67.3 ကို ကြည့်ပါ။ |
| pg_current_xact_id_if_assigned () → xid8 လက်ရှိ transaction ရဲ့ ID ကို ပြန်ပေးပါတယ် — ID မသတ်မှတ်ရသေးရင် NULL ပြန်ပေးပါတယ်။ (Transaction က မဟုတ်ရင် read-only ဖြစ်နေနိုင်တဲ့ အခြေအနေမျိုးမှာ — XID တစ်ခုကို မလိုအပ်ဘဲ မသုံးမိစေဖို့ — ဒီ variant ကို သုံးတာ အကောင်းဆုံးပါ။) Subtransaction တစ်ခုထဲမှာ run ရင် top-level transaction ID ကို ပြန်ပေးပါတယ်။ |
| pg_xact_status ( xid8 ) → text မကြာသေးတဲ့ transaction တစ်ခုရဲ့ commit status ကို သတင်းပို့ပါတယ်။ ရလဒ်က in progress, committed, ဒါမှမဟုတ် aborted တို့ထဲက တစ်ခု ဖြစ်ပြီး — transaction က system မှာ အဲဒီ transaction ရဲ့ commit status ကို ထိန်းသိမ်းထားလောက်အောင် မကြာသေးမှသာ ဖြစ်ပါတယ်။ Transaction က အတော်ကြာနေပြီး — system ထဲမှာ transaction ကို ရည်ညွှန်းတာတွေ မကျန်ရှိတော့ဘဲ commit status အချက်အလက်တွေ စွန့်ပစ်ခံထားရပြီဆိုရင် ရလဒ်က NULL ဖြစ်ပါတယ်။ Application တွေက ဒီ function ကို — ဥပမာ — application နဲ့ database server ကြား connection ပြတ်သွားချိန်မှာ COMMIT လုပ်နေတုန်း ဖြစ်ခဲ့ရင် — သူတို့ရဲ့ transaction က commit ဖြစ်ခဲ့လား aborted ဖြစ်ခဲ့လားဆိုတာ ဆုံးဖြတ်ဖို့ သုံးနိုင်ပါတယ်။ Prepared transaction တွေကို in progress အဖြစ် သတင်းပို့တာ သတိပြုပါ; transaction ID တစ်ခုက prepared transaction တစ်ခုနဲ့ သက်ဆိုင်လားဆိုတာ သိဖို့ လိုရင် application တွေက pg_prepared_xacts ကို စစ်ဆေးရပါမယ်။ |
| pg_current_snapshot () → pg_snapshot လက်ရှိ snapshot တစ်ခုကို ပြန်ပေးပါတယ် — ဘယ် transaction ID တွေ အခု in-progress ဖြစ်နေလဲ ပြတဲ့ data structure တစ်ခုပါ။ Snapshot ထဲမှာ top-level transaction ID တွေပဲ ပါဝင်ပြီး — subtransaction ID တွေ မပါပါဘူး; အသေးစိတ်အတွက် အပိုင်း 67.3 ကို ကြည့်ပါ။ |
| pg_snapshot_xip ( pg_snapshot ) → setof xid8 Snapshot တစ်ခုထဲမှာ ပါဝင်တဲ့ in-progress transaction ID တွေရဲ့ set ကို ပြန်ပေးပါတယ်။ |
| pg_snapshot_xmax ( pg_snapshot ) → xid8 Snapshot တစ်ခုရဲ့ xmax ကို ပြန်ပေးပါတယ်။ |
| pg_snapshot_xmin ( pg_snapshot ) → xid8 Snapshot တစ်ခုရဲ့ xmin ကို ပြန်ပေးပါတယ်။ |
| pg_visible_in_snapshot ( xid8, pg_snapshot ) → boolean ပေးထားတဲ့ transaction ID က ဒီ snapshot အရ visible လား (ဆိုလိုတာ snapshot မယူခင် ပြီးဆုံးခဲ့သလား)? ဒီ function က subtransaction ID (subxid) တစ်ခုအတွက် အဖြေမှန် ပေးမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ; အသေးစိတ်အတွက် အပိုင်း 67.3 ကို ကြည့်ပါ။ |
| pg_get_multixact_members ( multixid xid ) → setof record ( xid xid, mode text ) သတ်မှတ်ထားတဲ့ multixact ID ရဲ့ member တစ်ခုချင်းစီအတွက် transaction ID နဲ့ lock mode ကို ပြန်ပေးပါတယ်။ forupd, fornokeyupd, sh, နဲ့ keysh ဆိုတဲ့ lock modes တွေက — အပိုင်း 13.3.2 မှာ ဖော်ပြထားသလို — row-level locks ဖြစ်တဲ့ FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, နဲ့ FOR KEY SHARE တို့နဲ့ အသီးသီး ကိုက်ညီပါတယ်။ Multixacts တွေအတွက်ပဲ သီးသန့်ဖြစ်တဲ့ mode နှစ်ခု ထပ်ရှိပါတယ်: nokeyupd — key columns တွေကို မပြုပြင်တဲ့ update တွေက သုံးတာ ဖြစ်ပြီး — upd ကတော့ key columns တွေကို ပြုပြင်တဲ့ update ဒါမှမဟုတ် delete တွေက သုံးတာ ဖြစ်ပါတယ်။ |
အတွင်းပိုင်း transaction ID type ဖြစ်တဲ့ `xid` က 32 bits ကျယ်ဝန်းပြီး — transaction ပေါင်း 4 billion တိုင်း ပတ်လည် (wrap around) ပါတယ်။ ဒါပေမယ့် ဇယား 9.84 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေထဲက — `age`, `mxid_age`, နဲ့ `pg_get_multixact_members` တို့ ကလွဲပြီး — ကျန်တာတွေက installation တစ်ခုရဲ့ သက်တမ်းအတွင်း wrap around မဖြစ်တဲ့ 64-bit type `xid8` ကို သုံးပြီး — လိုအပ်ရင် cast လုပ်ပြီး `xid` အဖြစ် ပြောင်းလဲနိုင်ပါတယ်; အသေးစိတ်အတွက် [အပိုင်း 67.1](https://www.postgresql.org/docs/current/transaction-id.html) ကို ကြည့်ပါ။ `pg_snapshot` data type က အချိန်ကာလ တစ်ခုခုမှာ transaction ID မြင်နိုင်မှု (visibility) အကြောင်း အချက်အလက်ကို သိမ်းဆည်းပါတယ်။ ၎င်းရဲ့ အစိတ်အပိုင်းတွေကို ဇယား 9.85 မှာ ဖော်ပြထားပါတယ်။ `pg_snapshot` ရဲ့ စာသား ကိုယ်စားပြုမှုက `xmin:xmax:xip_list` ဖြစ်ပါတယ်။ ဥပမာ `10:20:10,14,15` ဆိုတာ `xmin=10, xmax=20, xip_list=10, 14, 15` လို့ ဆိုလိုပါတယ်။

**ဇယား 9.85. Snapshot Components (snapshot အစိတ်အပိုင်းများ)**

| နာမည် | ဖော်ပြချက် |
| --- | --- |
| `xmin` | နောက်ဆုံးထိ active ဖြစ်နေသေးတဲ့ အနိမ့်ဆုံး transaction ID။ `xmin` ထက် ငယ်တဲ့ transaction ID တွေ အားလုံးက — commit ဖြစ်ပြီး visible ဖြစ်နေတာ ဒါမှမဟုတ် rollback ဖြစ်ပြီး dead (သေ) ဖြစ်နေတာ နှစ်မျိုးထဲက တစ်မျိုး ဖြစ်ပါတယ်။ |
| `xmax` | ပြီးဆုံးသွားတဲ့ အမြင့်ဆုံး transaction ID ထက် တစ်ခု ကျော်လွန်တဲ့ တန်ဖိုး။ `xmax` ထက် ကြီးတဲ့ ဒါမှမဟုတ် ညီတဲ့ transaction ID တွေ အားလုံးက — snapshot ယူချိန်အထိ မပြီးဆုံးရသေးလို့ — invisible (မမြင်ရ) ဖြစ်ပါတယ်။ |
| `xip_list` | Snapshot ယူချိန်မှာ in progress ဖြစ်နေတဲ့ transactions တွေ။ `xmin <= X < xmax` ဖြစ်ပြီး ဒီ list ထဲမှာ မပါတဲ့ transaction ID တစ်ခုက — snapshot ယူချိန်မှာ ပြီးဆုံးသွားပြီးသား ဖြစ်လို့ — သူ့ရဲ့ commit status အရ visible ဒါမှမဟုတ် dead ဖြစ်ပါတယ်။ ဒီ list မှာ subtransaction (subxid) တွေရဲ့ transaction ID တွေ မပါဝင်ပါဘူး။ |

PostgreSQL 13 မတိုင်ခင် ထုတ်ဝေမှုတွေမှာ `xid8` type မရှိခဲ့လို့ — 64-bit XID ကို ကိုယ်စားပြုဖို့ `bigint` သုံးတဲ့ ဒီ လုပ်ဆောင်ချက်တွေရဲ့ variants တွေကို — သီးခြား snapshot data type `txid_snapshot` နဲ့တကွ — ပေးအပ်ခဲ့ပါတယ်။ ဒီ အဟောင်း လုပ်ဆောင်ချက်တွေရဲ့ နာမည်တွေမှာ `txid` ပါဝင်ပါတယ်။ သူတို့ကို backward compatibility (နောက်ပြန် လိုက်ဖက်မှု) အတွက် အခုထိ ထောက်ပံ့ပေးထားပေမယ့် — နောင်ထွက်မယ့် ဗားရှင်းတစ်ခုမှာ ဖယ်ရှားခံရနိုင်ပါတယ်။ ဇယား 9.86 ကို ကြည့်ပါ။

**ဇယား 9.86. Deprecated Transaction ID and Snapshot Information Functions (deprecated ဖြစ်သော transaction ID နှင့် snapshot အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| txid_current () → bigint pg_current_xact_id() ကို ကြည့်ပါ။ |
| txid_current_if_assigned () → bigint pg_current_xact_id_if_assigned() ကို ကြည့်ပါ။ |
| txid_current_snapshot () → txid_snapshot pg_current_snapshot() ကို ကြည့်ပါ။ |
| txid_snapshot_xip ( txid_snapshot ) → setof bigint pg_snapshot_xip() ကို ကြည့်ပါ။ |
| txid_snapshot_xmax ( txid_snapshot ) → bigint pg_snapshot_xmax() ကို ကြည့်ပါ။ |
| txid_snapshot_xmin ( txid_snapshot ) → bigint pg_snapshot_xmin() ကို ကြည့်ပါ။ |
| txid_visible_in_snapshot ( bigint, txid_snapshot ) → boolean pg_visible_in_snapshot() ကို ကြည့်ပါ။ |
| txid_status ( bigint ) → text pg_xact_status() ကို ကြည့်ပါ။ |
### 9.27.9. Committed Transaction Information Functions (commit လုပ်ပြီးသား transaction အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.87 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက — အတိတ်က transaction တွေ ဘယ်အချိန်မှာ commit ဖြစ်ခဲ့လဲဆိုတဲ့ အချက်အလက်ကို ပေးပါတယ်။ [track_commit_timestamp](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-TRACK-COMMIT-TIMESTAMP) configuration option ကို enable လုပ်ထားမှသာ — သူတို့က အသုံးဝင်တဲ့ data ပေးနိုင်ပြီး — enable လုပ်ပြီးမှ commit ဖြစ်တဲ့ transaction တွေအတွက်ပဲ ပေးနိုင်ပါတယ်။ Commit timestamp အချက်အလက်တွေကို vacuum လုပ်ချိန်မှာ ပုံမှန်အားဖြင့် ဖယ်ရှားပါတယ်။

**ဇယား 9.87. Committed Transaction Information Functions (commit လုပ်ပြီးသား transaction အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| pg_xact_commit_timestamp ( xid ) → timestamp with time zone Transaction တစ်ခုရဲ့ commit timestamp ကို ပြန်ပေးပါတယ်။ |
| pg_xact_commit_timestamp_origin ( xid ) → record ( timestamp timestamp with time zone, roident oid) Transaction တစ်ခုရဲ့ commit timestamp နဲ့ replication origin ကို ပြန်ပေးပါတယ်။ |
| pg_last_committed_xact () → record ( xid xid, timestamp timestamp with time zone, roident oid ) နောက်ဆုံး commit ဖြစ်ခဲ့တဲ့ transaction ရဲ့ transaction ID, commit timestamp နဲ့ replication origin ကို ပြန်ပေးပါတယ်။ |

### 9.27.10. Control Data Functions (control data လုပ်ဆောင်ချက်များ)

ဇယား 9.88 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက — `initdb` လုပ်ချိန်မှာ သတ်မှတ်ခဲ့တဲ့ အချက်အလက်တွေ — ဥပမာ catalog version လိုမျိုး — ကို ပုံနှိပ် ထုတ်ပေးပါတယ်။ သူတို့က write-ahead logging နဲ့ checkpoint processing အကြောင်း အချက်အလက်တွေကိုလည်း ပြပါတယ်။ ဒီ အချက်အလက်က database တစ်ခုချင်းစီအတွက် မဟုတ်ဘဲ — cluster တစ်ခုလုံးအတွက် ဖြစ်ပါတယ်။ ဒီ လုပ်ဆောင်ချက်တွေက [pg_controldata](https://www.postgresql.org/docs/current/app-pgcontroldata.html) application လိုပဲ — အရင်းအမြစ် (source) တစ်ခုတည်းကနေ — အချက်အလက် အများစုကို ပေးပါတယ်။

**ဇယား 9.88. Control Data Functions (control data လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| pg_control_checkpoint () → record လက်ရှိ checkpoint state အကြောင်း အချက်အလက်ကို ဇယား 9.89 မှာ ပြထားတဲ့အတိုင်း ပြန်ပေးပါတယ်။ |
| pg_control_system () → record လက်ရှိ control file state အကြောင်း အချက်အလက်ကို ဇယား 9.90 မှာ ပြထားတဲ့အတိုင်း ပြန်ပေးပါတယ်။ |
| pg_control_init () → record Cluster initialization state အကြောင်း အချက်အလက်ကို ဇယား 9.91 မှာ ပြထားတဲ့အတိုင်း ပြန်ပေးပါတယ်။ |
| pg_control_recovery () → record Recovery state အကြောင်း အချက်အလက်ကို ဇယား 9.92 မှာ ပြထားတဲ့အတိုင်း ပြန်ပေးပါတယ်။ |

**ဇယား 9.89. pg_control_checkpoint Output Columns (pg_control_checkpoint output columns များ)**

| Column နာမည် | Data Type |
| --- | --- |
| `checkpoint_lsn` | `pg_lsn` |
| `redo_lsn` | `pg_lsn` |
| `redo_wal_file` | `text` |
| `timeline_id` | `integer` |
| `prev_timeline_id` | `integer` |
| `full_page_writes` | `boolean` |
| `next_xid` | `text` |
| `next_oid` | `oid` |
| `next_multixact_id` | `xid` |
| `next_multi_offset` | `xid` |
| `oldest_xid` | `xid` |
| `oldest_xid_dbid` | `oid` |
| `oldest_active_xid` | `xid` |
| `oldest_multi_xid` | `xid` |
| `oldest_multi_dbid` | `oid` |
| `oldest_commit_ts_xid` | `xid` |
| `newest_commit_ts_xid` | `xid` |
| `checkpoint_time` | `timestamp with time zone` |

**ဇယား 9.90. pg_control_system Output Columns (pg_control_system output columns များ)**

| Column နာမည် | Data Type |
| --- | --- |
| `pg_control_version` | `integer` |
| `catalog_version_no` | `integer` |
| `system_identifier` | `bigint` |
| `pg_control_last_modified` | `timestamp with time zone` |

**ဇယား 9.91. pg_control_init Output Columns (pg_control_init output columns များ)**

| Column နာမည် | Data Type |
| --- | --- |
| `max_data_alignment` | `integer` |
| `database_block_size` | `integer` |
| `blocks_per_segment` | `integer` |
| `wal_block_size` | `integer` |
| `bytes_per_wal_segment` | `integer` |
| `max_identifier_length` | `integer` |
| `max_index_columns` | `integer` |
| `max_toast_chunk_size` | `integer` |
| `large_object_chunk_size` | `integer` |
| `float8_pass_by_value` | `boolean` |
| `data_page_checksum_version` | `integer` |
| `default_char_signedness` | `boolean` |

**ဇယား 9.92. pg_control_recovery Output Columns (pg_control_recovery output columns များ)**

| Column နာမည် | Data Type |
| --- | --- |
| `min_recovery_end_lsn` | `pg_lsn` |
| `min_recovery_end_timeline` | `integer` |
| `backup_start_lsn` | `pg_lsn` |
| `backup_end_lsn` | `pg_lsn` |
| `end_of_backup_record_required` | `boolean` |
### 9.27.11. Version Information Functions (version အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.93 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက version အချက်အလက်တွေကို ပုံနှိပ် ထုတ်ပေးပါတယ်။

**ဇယား 9.93. Version Information Functions (version အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| version () → text PostgreSQL server ရဲ့ version ကို ဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ အချက်အလက်ကို server_version ကနေလည်း ရနိုင်ပြီး — machine-readable version လိုချင်ရင်တော့ server_version_num ကို သုံးပါ။ Software developer တွေက text version ကို parse လုပ်တာထက် — server_version_num (8.2 ကစပြီး ရနိုင်ပါတယ်) ဒါမှမဟုတ် PQserverVersion ကို သုံးသင့်ပါတယ်။ |
| unicode_version () → text PostgreSQL က သုံးတဲ့ Unicode ရဲ့ version ကို ကိုယ်စားပြုတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။ |
| icu_unicode_version () → text Server ကို ICU support နဲ့ build လုပ်ထားရင် — ICU က သုံးတဲ့ Unicode ရဲ့ version ကို ကိုယ်စားပြုတဲ့ string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင် NULL ပြန်ပေးပါတယ်။ |

### 9.27.12. WAL Summarization Information Functions (WAL အကျဉ်းချုပ် အချက်အလက် လုပ်ဆောင်ချက်များ)

ဇယား 9.94 မှာ ပြထားတဲ့ လုပ်ဆောင်ချက်တွေက WAL summarization ရဲ့ အခြေအနေအကြောင်း အချက်အလက်ကို ပုံနှိပ် ထုတ်ပေးပါတယ်။ [summarize_wal](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-SUMMARIZE-WAL) ကို ကြည့်ပါ။

**ဇယား 9.94. WAL Summarization Information Functions (WAL အကျဉ်းချုပ် အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| pg_available_wal_summaries () → setof record ( tli bigint, start_lsn pg_lsn, end_lsn pg_lsn ) Data directory ထဲက pg_wal/summaries အောက်မှာ ရှိနေတဲ့ WAL summary file တွေအကြောင်း အချက်အလက်ကို ပြန်ပေးပါတယ်။ WAL summary file တစ်ခုစီအတွက် row တစ်ခုစီ ပြန်ပေးပါတယ်။ File တစ်ခုချင်းစီက — သတ်မှတ်ထားတဲ့ LSN range အတွင်းက — သတ်မှတ်ထားတဲ့ TLI ပေါ်က WAL ကို အကျဉ်းချုပ်ပါတယ်။ ဒီ function က — သိထားတဲ့ start LSN ရှိတဲ့ အရင် backup တစ်ခုကို အခြေခံတဲ့ incremental backup တစ်ခု ယူဖို့ — server ပေါ်မှာ WAL summary အလုံအလောက် ရှိမရှိ ဆုံးဖြတ်ဖို့ အသုံးဝင်နိုင်ပါတယ်။ |
| pg_wal_summary_contents ( tli bigint, start_lsn pg_lsn, end_lsn pg_lsn ) → setof record ( relfilenode oid, reltablespace oid, reldatabase oid, relforknumber smallint, relblocknumber bigint, is_limit_block boolean ) TLI နဲ့ စတင်မယ့်/ဆုံးမယ့် LSN တွေနဲ့ ဖော်ထုတ်ထားတဲ့ WAL summary file တစ်ခုတည်းရဲ့ အကြောင်းအရာအကြောင်း အချက်အလက်ကို ပြန်ပေးပါတယ်။ is_limit_block false ရှိတဲ့ row တစ်ခုချင်းစီက — ကျန် output columns တွေနဲ့ ဖော်ထုတ်ထားတဲ့ block ကို — ဒီ file က အကျဉ်းချုပ်ထားတဲ့ record range အတွင်းက WAL record အနည်းဆုံး တစ်ခုက ပြုပြင်ခဲ့တယ်လို့ ညွှန်ပြပါတယ်။ is_limit_block true ရှိတဲ့ row တစ်ခုချင်းစီက — သက်ဆိုင်ရာ WAL record range အတွင်းမှာ (a) relation fork ကို relblocknumber ပေးထားတဲ့ အလျားအထိ truncate လုပ်ခဲ့တာ ဒါမှမဟုတ် (b) relation fork ကို ဖန်တီးခဲ့တာ ဒါမှမဟုတ် drop လုပ်ခဲ့တာ ဖြစ်ကြောင်း ညွှန်ပြပါတယ်; အဲဒီလို ကိစ္စတွေမှာ relblocknumber က သုည ဖြစ်ပါလိမ့်မယ်။ |
| pg_get_wal_summarizer_state () → record ( summarized_tli bigint, summarized_lsn pg_lsn, pending_lsn pg_lsn, summarizer_pid int ) WAL summarizer ရဲ့ တိုးတက်မှု (progress) အကြောင်း အချက်အလက်ကို ပြန်ပေးပါတယ်။ Instance စတင်ကတည်းက WAL summarizer တစ်ခါမှ run မဖူးသေးရင် — summarized_tli နဲ့ summarized_lsn တို့က 0 နဲ့ 0/0 အသီးသီး ဖြစ်ပြီး — မဟုတ်ရင်တော့ disk ပေါ်ကို နောက်ဆုံး ရေးထားတဲ့ WAL summary file ရဲ့ TLI နဲ့ ဆုံးသွားတဲ့ (ending) LSN တွေ ဖြစ်ပါတယ်။ WAL summarizer က လက်ရှိ run နေရင် — pending_lsn က ၎င်း စားသုံးပြီးသွားတဲ့ နောက်ဆုံး record ရဲ့ ending LSN ဖြစ်ပြီး — အဲဒါက summarized_lsn ထက် ကြီးသည် ဒါမှမဟုတ် ညီနေရပါမယ်; WAL summarizer run မနေရင်တော့ summarized_lsn နဲ့ ညီမျှပါတယ်။ summarizer_pid က WAL summarizer process ရဲ့ PID ဖြစ်ပြီး — run နေမှသာ တန်ဖိုး ရှိကာ — မဟုတ်ရင် NULL ဖြစ်ပါတယ်။ အထူး ခြွင်းချက်အနေနဲ့ — WAL summarizer က wal_level=minimal အောက်မှာ ထုတ်ထားတဲ့ WAL ပေါ်မှာ run ရင် WAL summary file တွေ ထုတ်ဖို့ ငြင်းဆန်ပါတယ် — အကြောင်းကတော့ အဲဒီလို summaries တွေက incremental backup တစ်ခုရဲ့ အခြေခံအဖြစ် သုံးဖို့ မလုံခြုံလို့ပါ။ ဒီကိစ္စမှာ — အပေါ်က fields တွေက summaries တွေ ထုတ်နေသလိုပဲ ဆက်တိုးသွားပေမယ့် — disk ပေါ်ကို ဘာမှ ရေးမှာ မဟုတ်ပါဘူး။ Summarizer က wal_level ကို replica ဒါမှမဟုတ် ပိုမြင့်တဲ့ level နဲ့ သတ်မှတ်ထားချိန်မှာ ထုတ်ထားတဲ့ WAL ဆီ ရောက်တာနဲ့ — summaries တွေကို disk ပေါ်မှာ ပြန်ရေးပါတော့မယ်။ |
