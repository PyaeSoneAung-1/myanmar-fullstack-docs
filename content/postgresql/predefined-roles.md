---
title: "Predefined Roles (ကြိုတင် သတ်မှတ်ထားသော roles)"
description: "PostgreSQL က ကမ်းလှမ်းထားသော ကြိုတင် သတ်မှတ်ထားသည့် roles များနှင့် ၎င်းတို့၏ လုပ်ဆောင်နိုင်စွမ်းများ — pg_checkpoint, pg_database_owner, pg_maintain, pg_monitor အဖွဲ့, pg_read_all_data, pg_execute_server_program, pg_signal_backend စသည်"
order: 194
source: "https://www.postgresql.org/docs/current/predefined-roles.html"
status: translated
updated: 2026-09-06
---

## 21.5. Predefined Roles (ကြိုတင် သတ်မှတ်ထားသော roles)

PostgreSQL က — မကြာခဏ လိုအပ်လေ့ ရှိတဲ့ — အခွင့်ထူးခံ (privileged) လုပ်ဆောင်နိုင်စွမ်းတွေနဲ့ အချက်အလက်တွေဆီ ဝင်ရောက်ခွင့် ပေးတဲ့ — ကြိုတင် သတ်မှတ်ထားတဲ့ roles (predefined roles) အစုတစ်စုကို ထောက်ပံ့ ပေးထားပါတယ်။ Administrators တွေက (`CREATEROLE` privilege ရှိတဲ့ roles တွေ အပါအဝင်) ဒီ roles တွေကို — သူတို့ရဲ့ environment ထဲက users နဲ့/သို့မဟုတ် တခြား roles တွေဆီ `GRANT` လုပ်နိုင်ပြီး — အဲဒီ users တွေကို သတ်မှတ်ထားတဲ့ လုပ်ဆောင်နိုင်စွမ်းတွေနဲ့ အချက်အလက်တွေဆီ ဝင်ရောက်ခွင့် ရှိစေပါတယ်။ ဥပမာ:

```sql
GRANT pg_signal_backend TO admin_user;
```

> **သတိပေးချက်:** ဒီ roles တွေကို ပေးအပ်တဲ့အခါ — လိုအပ်တဲ့ နေရာမှာပဲ သုံးတာ သေချာစေဖို့ — ပြီးတော့ ဒီ roles တွေက အခွင့်ထူးခံ အချက်အလက်တွေဆီ ဝင်ရောက်ခွင့် ပေးတယ်ဆိုတာ နားလည်ထားပြီးမှသာ ပေးအပ်ဖို့ — ဂရုတစိုက် ရှိရပါမယ်။

Predefined roles တွေကို အောက်မှာ ဖော်ပြထားပါတယ်။ Role တစ်ခုချင်းစီအတွက် တိကျတဲ့ permissions တွေက — နောင်မှာ လုပ်ဆောင်နိုင်စွမ်းတွေ ထပ်ဖြည့်လာတာနဲ့အမျှ — ပြောင်းလဲနိုင်တယ်ဆိုတာ သတိပြုပါ။ Administrators တွေက ပြောင်းလဲမှုတွေအတွက် release notes (ထုတ်ဝေမှု မှတ်စုများ) တွေကို စောင့်ကြည့်သင့်ပါတယ်။

- **pg_checkpoint** — pg_checkpoint က CHECKPOINT command ကို execute လုပ်ခွင့် ပေးပါတယ်။
- **pg_create_subscription** — pg_create_subscription က — database အပေါ်မှာ CREATE permission ရှိတဲ့ users တွေကို CREATE SUBSCRIPTION ထုတ်ပြန်ခွင့် ပေးပါတယ်။
- **pg_database_owner** — pg_database_owner မှာ — implicit (သွယ်ဝိုက်သော) အဖွဲ့ဝင် အတိအကျ တစ်ဦးတည်းကို အမြဲတမ်း ရှိပါတယ်: လက်ရှိ database owner ပါ။ ဒီ role ကို ဘယ် role ထဲမှာမှ membership ပေးအပ်လို့ မရသလို — ဘယ် role ကိုမှလည်း pg_database_owner ထဲမှာ membership ပေးအပ်လို့ မရပါဘူး။ ဒါပေမယ့် — တခြား role တွေလိုပဲ — ဒီ role က objects တွေကို ပိုင်ဆိုင်နိုင်ပြီး — access privileges တွေ ပေးအပ်ခံရတာတွေကိုလည်း လက်ခံနိုင်ပါတယ်။ ဒါကြောင့် — pg_database_owner မှာ template database တစ်ခုအတွင်းမှာ အခွင့်အရေးတွေ (rights) ရှိနေတာနဲ့ — အဲဒီ template ကနေ ဖန်တီးလိုက်တဲ့ database တစ်ခုချင်းစီရဲ့ owner တိုင်းက အဲဒီ အခွင့်အရေးတွေကို ရရှိပါလိမ့်မယ်။ ကနဦးမှာ — ဒီ role က public schema ကို ပိုင်ဆိုင်ထားတာမို့ — database owner တစ်ဦးချင်းစီက အဲဒီ schema ရဲ့ local အသုံးပြုမှုကို အုပ်ချုပ်ပါတယ်။
- **pg_maintain** — pg_maintain က — relations တွေ အားလုံးအပေါ်မှာ — အဲဒီ objects တွေအပေါ် MAINTAIN rights တွေ ရှိနေသလိုမျိုး — VACUUM, ANALYZE, CLUSTER, REFRESH MATERIALIZED VIEW, REINDEX နဲ့ LOCK TABLE တွေကို execute လုပ်ခွင့် ပေးပါတယ်။
- **pg_monitor**, **pg_read_all_settings**, **pg_read_all_stats**, **pg_stat_scan_tables** — ဒီ roles တွေက — administrators တွေ အနေနဲ့ — database server ကို စောင့်ကြည့်ခြင်း (monitoring) ရည်ရွယ်ချက်အတွက် role တစ်ခုကို လွယ်ကူစွာ ပြင်ဆင် သတ်မှတ်နိုင်ဖို့ ရည်ရွယ် ထားတာ ဖြစ်ပါတယ်။ ၎င်းတို့က — superusers တွေအတွက်သာ ပုံမှန်အားဖြင့် ကန့်သတ်ထားတဲ့ — အသုံးဝင်တဲ့ configuration settings, statistics နဲ့ အခြား system အချက်အလက် အမျိုးမျိုးကို ဖတ်ခွင့် ပေးတဲ့ — ဘုံ privileges အစုတစ်စုကို ပေးအပ်ပါတယ်။
pg_monitor က — monitoring ဆိုင်ရာ views နဲ့ functions အမျိုးမျိုးကို ဖတ်ခြင်း/execute လုပ်ခြင်း ခွင့်ပြုပါတယ်။ ဒီ role က pg_read_all_settings, pg_read_all_stats နဲ့ pg_stat_scan_tables တွေရဲ့ အဖွဲ့ဝင် တစ်ခု ဖြစ်ပါတယ်။
pg_read_all_settings က — superusers တွေအတွက်သာ ပုံမှန်အားဖြင့် မြင်ရတဲ့ configuration variables တွေ အပါအဝင် — configuration variables အားလုံးကို ဖတ်ခွင့် ပြုပါတယ်။
pg_read_all_stats က — pg_stat_* views တွေ အားလုံးကို ဖတ်ပြီး — superusers တွေအတွက်သာ ပုံမှန်အားဖြင့် မြင်ရတဲ့ — statistics ဆိုင်ရာ extensions အမျိုးမျိုးကို သုံးခွင့် ပြုပါတယ်။
pg_stat_scan_tables က — tables တွေအပေါ်မှာ ACCESS SHARE locks တွေကို — အချိန်အတော်ကြာ ကိုင်ထားနိုင်တဲ့ — monitoring functions တွေ (ဥပမာ — pgrowlocks extension ထဲက pgrowlocks(text)) ကို execute လုပ်ခွင့် ပြုပါတယ်။
- **pg_read_all_data**, **pg_write_all_data** — pg_read_all_data က — အဲဒီ objects တွေအပေါ် SELECT rights တွေနဲ့ schemas တွေ အားလုံးအပေါ် USAGE rights တွေ ရှိနေသလိုမျိုး — data အားလုံး (tables, views, sequences) ကို ဖတ်ခွင့် ပြုပါတယ်။ ဒီ role က row-level security (RLS) policies တွေကို ကျော်လွှား (bypass) မလုပ်ပါဘူး။ RLS သုံးနေတယ်ဆိုရင် — administrator တစ်ယောက်က — ဒီ role ကို ပေးအပ်ထားတဲ့ roles တွေအပေါ်မှာ BYPASSRLS ကို သတ်မှတ်ချင် ပေမည်။
pg_write_all_data က — အဲဒီ objects တွေအပေါ် INSERT, UPDATE နဲ့ DELETE rights တွေနဲ့ schemas တွေ အားလုံးအပေါ် USAGE rights တွေ ရှိနေသလိုမျိုး — data အားလုံး (tables, views, sequences) ကို ရေးသားခွင့် ပြုပါတယ်။ ဒီ role က row-level security (RLS) policies တွေကို ကျော်လွှား (bypass) မလုပ်ပါဘူး။ RLS သုံးနေတယ်ဆိုရင် — administrator တစ်ယောက်က — ဒီ role ကို ပေးအပ်ထားတဲ့ roles တွေအပေါ်မှာ BYPASSRLS ကို သတ်မှတ်ချင် ပေမည်။
- **pg_read_server_files**, **pg_write_server_files**, **pg_execute_server_program** — ဒီ roles တွေက — database server ပေါ်မှာ — database က run နေတဲ့ user အနေနဲ့ — files တွေဆီ ဝင်ရောက်ပြီး programs တွေ run လုပ်နိုင်တဲ့ — ယုံကြည်စိတ်ချရတဲ့ (trusted) ဒါပေမယ့် superuser မဟုတ်တဲ့ roles တွေ ရှိစေဖို့ administrators တွေအတွက် ရည်ရွယ် ထားတာ ဖြစ်ပါတယ်။ ၎င်းတို့က files တွေကို တိုက်ရိုက် ဝင်ရောက်တဲ့အခါ — database-level permission checks တွေ အားလုံးကို ကျော်လွှားပြီး — superuser-level access ရဖို့ သုံးနိုင်ချေ ရှိပါတယ်။ ဒါကြောင့် — ဒီ roles တွေကို users တွေဆီ ပေးအပ်တဲ့အခါ အလွန် ဂရုတစိုက် ရှိရပါမယ်။
pg_read_server_files က — server ပေါ်မှာ database က ဝင်ရောက်နိုင်တဲ့ နေရာ ဘယ်ကနေမဆို — COPY နဲ့ အခြား file-access functions တွေကို သုံးပြီး — files တွေ ဖတ်ခွင့် ပြုပါတယ်။
pg_write_server_files က — server ပေါ်မှာ database က ဝင်ရောက်နိုင်တဲ့ နေရာ ဘယ်ကနေမဆို — COPY နဲ့ အခြား file-access functions တွေကို သုံးပြီး — files တွေထဲကို ရေးသားခွင့် ပြုပါတယ်။
pg_execute_server_program က — database server ပေါ်မှာ — database က run နေတဲ့ user အနေနဲ့ — COPY နဲ့ server-side program တစ်ခု run လုပ်ခွင့် ပေးတဲ့ အခြား functions တွေကို သုံးပြီး — programs တွေ run လုပ်ခွင့် ပြုပါတယ်။
- **pg_signal_autovacuum_worker** — pg_signal_autovacuum_worker က — autovacuum workers တွေကို signal ပေးပြီး — လက်ရှိ table ရဲ့ vacuum ကို ပယ်ဖျက်စေတာ ဒါမှမဟုတ် — သူတို့ရဲ့ session ကို အဆုံးသတ်စေတာ လုပ်ခွင့် ပြုပါတယ်။ အပိုင်း 9.28.2 ကို ကြည့်ပါ။
- **pg_signal_backend** — pg_signal_backend က — တခြား backend တစ်ခုကို signal ပေးပြီး — query တစ်ခုကို ပယ်ဖျက်စေတာ ဒါမှမဟုတ် — သူ့ရဲ့ session ကို အဆုံးသတ်စေတာ လုပ်ခွင့် ပြုပါတယ်။ ဒီ role က superuser တစ်ဦး ပိုင်ဆိုင်တဲ့ backends တွေကို signal ပေးတာကိုတော့ ခွင့်မပြုဘူးဆိုတာ သတိပြုပါ။ အပိုင်း 9.28.2 ကို ကြည့်ပါ။
- **pg_use_reserved_connections** — pg_use_reserved_connections က — reserved_connections ကနေတစ်ဆင့် သီးသန့် ထားရှိထားတဲ့ (reserved) connection slots တွေကို သုံးခွင့် ပြုပါတယ်။
