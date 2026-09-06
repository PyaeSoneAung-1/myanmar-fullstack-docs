---
title: "Upgrading a PostgreSQL Cluster (PostgreSQL cluster တစ်ခုကို အဆင့်မြှင့်တင်ခြင်း)"
description: "PostgreSQL cluster တစ်ခုကို release အသစ်တစ်ခုဆီသို့ အဆင့်မြှင့်တင်ခြင်း — major/minor version နံပါတ်များ၏ သဘောတရားနှင့် minor releases များ၏ compatibility၊ major upgrade မပြုလုပ်မီ ထည့်သွင်း စဉ်းစားရမည့် ပြောင်းလဲမှု ကဏ္ဍများ၊ pg_dumpall ဖြင့် dump/restore နည်းလမ်း (အဆင့်ဆင့် လုပ်ထုံးလုပ်နည်း)၊ pg_upgrade ဖြင့် in-place အဆင့်မြှင့်တင်ခြင်းနှင့် logical replication ဖြင့် standby မှတစ်ဆင့် အဆင့်မြှင့်တင်ခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 145
source: "https://www.postgresql.org/docs/current/upgrading.html"
status: translated
updated: 2026-09-06
---

## 18.6. Upgrading a PostgreSQL Cluster (PostgreSQL cluster တစ်ခုကို အဆင့်မြှင့်တင်ခြင်း)

- **18.6.1. Upgrading Data via pg_dumpall (pg_dumpall ဖြင့် data အဆင့်မြှင့်တင်ခြင်း)**
- **18.6.2. Upgrading Data via pg_upgrade (pg_upgrade ဖြင့် data အဆင့်မြှင့်တင်ခြင်း)**
- **18.6.3. Upgrading Data via Replication (replication ဖြင့် data အဆင့်မြှင့်တင်ခြင်း)**

ဒီ section မှာ — သင့် database data တွေကို PostgreSQL release တစ်ခုကနေ ပိုအသစ်တဲ့ release တစ်ခုဆီကို ဘယ်လို အဆင့်မြှင့်တင်မလဲ ဆိုတာကို ဆွေးနွေးထားပါတယ်။

လက်ရှိ PostgreSQL version နံပါတ်တွေက major version နံပါတ် တစ်ခုနဲ့ minor version နံပါတ် တစ်ခုနဲ့ ဖွဲ့စည်းထားပါတယ်။ ဥပမာ — version နံပါတ် 10.1 မှာ — 10 က major version နံပါတ် ဖြစ်ပြီး — 1 က minor version နံပါတ် ဖြစ်ပါတယ် — ဆိုလိုတာက ဒါဟာ major release 10 ရဲ့ ပထမဆုံး minor release ဖြစ်ပါတယ်။ PostgreSQL version 10.0 မတိုင်ခင် releases တွေမှာတော့ — version နံပါတ်တွေက ဂဏန်း သုံးစု ပါဝင်ပါတယ် — ဥပမာ 9.5.3 ပေါ့။ အဲဒီလို ကိစ္စတွေမှာ — major version က version နံပါတ်ရဲ့ ပထမ ဂဏန်း အုပ်စု နှစ်ခုနဲ့ ဖွဲ့စည်းပြီး — ဥပမာ 9.5 — minor version ကတော့ တတိယ ဂဏန်း ဖြစ်ပါတယ် — ဥပမာ 3 — ဆိုလိုတာက ဒါဟာ major release 9.5 ရဲ့ တတိယမြောက် minor release ဖြစ်ပါတယ်။

Minor releases တွေက internal storage format (အတွင်းပိုင်း သိုလှောင်မှု ပုံစံ) ကို ဘယ်တော့မှ မပြောင်းလဲဘဲ — တူညီတဲ့ major version နံပါတ်ရဲ့ — ရှေ့ပိုင်း နဲ့ နောက်ပိုင်း minor releases တွေနဲ့ အမြဲတမ်း compatible (လိုက်ဖက် တွဲဖက် အသုံးပြုနိုင်မှု) ဖြစ်ပါတယ်။ ဥပမာ — version 10.1 က version 10.0 နဲ့ရော version 10.6 နဲ့ပါ compatible ဖြစ်ပါတယ်။ အလားတူပဲ — ဥပမာ — 9.5.3 က 9.5.0, 9.5.1 နဲ့ 9.5.6 တို့နဲ့ compatible ဖြစ်ပါတယ်။ Compatible version တွေကြားမှာ အဆင့်မြှင့်တင်ဖို့ဆိုရင် — server ရပ်နေချိန်မှာ executables (လုပ်ဆောင်နိုင်သော ဖိုင်များ) တွေကို အစားထိုးပြီး — server ကို ပြန်လည် စတင်ရုံပဲ ဖြစ်ပါတယ်။ Data directory ကတော့ မပြောင်းလဲဘဲ ရှိနေပါတယ် — minor upgrades တွေက အဲဒီလောက်ပဲ ရိုးရှင်းပါတယ်။

PostgreSQL ရဲ့ *major* releases တွေအတွက်တော့ — internal data storage format က ပြောင်းလဲနိုင်တာမို့ — အဆင့်မြှင့်တင်ခြင်းကို ရှုပ်ထွေးစေပါတယ်။ Data တွေကို major version အသစ်တစ်ခုဆီ ရွှေ့ပြောင်းဖို့ ရိုးရာ နည်းလမ်းကတော့ — database ကို dump (ထုတ်ယူ) လုပ်ပြီး restore (ပြန်သွင်း) လုပ်တာပဲ ဖြစ်ပါတယ် — ဒါပေမယ့် ဒါက နှေးကွေးနိုင်ပါတယ်။ ပိုမြန်တဲ့ နည်းလမ်းတစ်ခုကတော့ [pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html) ပဲ ဖြစ်ပါတယ်။ Replication နည်းလမ်းတွေလည်း ရနိုင်ပါတယ် — အောက်မှာ ဆွေးနွေးထားသလိုပါပဲ။ (Pre-packaged PostgreSQL version တစ်ခုကို သုံးနေတယ်ဆိုရင် — အဲဒါက major version အဆင့်မြှင့်တင်မှုတွေအတွက် ကူညီပေးတဲ့ scripts တွေ ပါဝင်နိုင်ပါတယ်။ အသေးစိတ်အတွက် package-level documentation (package အဆင့် မှတ်တမ်း) ကို တိုင်ပင်ကြည့်ပါ။)

Major version အသစ်တွေက ပုံမှန်အားဖြင့် user တွေ မြင်နိုင်တဲ့ incompatibilities (လိုက်ဖက်မှု မရှိမှုများ) အချို့ကိုလည်း မိတ်ဆက်ပေးတတ်လို့ — application programming ပြောင်းလဲမှုတွေ လိုအပ်လာနိုင်ပါတယ်။ User တွေ မြင်နိုင်တဲ့ ပြောင်းလဲမှုတွေ အားလုံးကို release notes တွေမှာ ([နောက်ဆက်တွဲ E](https://www.postgresql.org/docs/current/release.html)) စာရင်းပြုထားပါတယ်; “Migration” လို့ တံဆိပ်ကပ်ထားတဲ့ section ကို အထူး ဂရုပြုပါ။ Major version တစ်ခုကနေ နောက်တစ်ခုကို — ကြားက version တွေကို အရင် အဆင့်မြှင့်စရာ မလိုဘဲ — တိုက်ရိုက် အဆင့်မြှင့်လို့ ရနိုင်ပေမယ့် — ကြားက version တွေ အားလုံးရဲ့ major release notes တွေကိုတော့ ဖတ်သင့်ပါတယ်။

သတိ ကြီးတဲ့ users တွေက — လုံးဝ ပြောင်းရွှေ့ခြင်း မပြုလုပ်ခင် — သူတို့ရဲ့ client applications တွေကို version အသစ်ပေါ်မှာ စမ်းသပ်ချင်ကြပါလိမ့်မယ်; ဒါကြောင့် — version အဟောင်းနဲ့ အသစ်ကို တစ်ပြိုင်နက် (concurrent) တပ်ဆင်ထားဖို့က မကြာခဏ ကောင်းမွန်တဲ့ အကြံတစ်ခု ဖြစ်ပါတယ်။ PostgreSQL major upgrade တစ်ခုကို စမ်းသပ်တဲ့အခါ — ဖြစ်နိုင်ခြေ ရှိတဲ့ ပြောင်းလဲမှု ကဏ္ဍတွေ အောက်ပါအတိုင်း ထည့်သွင်း စဉ်းစားပါ:

- **Administration** — Administrators တွေအတွက် server ကို စောင့်ကြည့်ပြီး ထိန်းချုပ်ဖို့ ရရှိနိုင်တဲ့ စွမ်းဆောင်ချက်တွေက major release တိုင်းမှာ မကြာခဏ ပြောင်းလဲပြီး တိုးတက်လေ့ ရှိပါတယ်။
- **SQL** — ဒါက ပုံမှန်အားဖြင့် SQL command စွမ်းဆောင်ချက် အသစ်တွေ ပါဝင်ပြီး — release notes တွေမှာ အထူး ဖော်ပြထားခြင်း မရှိဘူးဆိုရင် — အပြုအမူ (behavior) ပြောင်းလဲမှုတွေတော့ မပါဝင်ပါဘူး။
- **Library API** — libpq လို libraries တွေက ပုံမှန်အားဖြင့် လုပ်ဆောင်ချက် အသစ်တွေကိုပဲ ထပ်ဖြည့်လေ့ ရှိပါတယ် — release notes တွေမှာ ဖော်ပြထားခြင်း မရှိဘူးဆိုရင် ပေါ့။
- **System Catalogs** — System catalog ပြောင်းလဲမှုတွေက ပုံမှန်အားဖြင့် database management tools တွေကိုပဲ သက်ရောက်ပါတယ်။
- **Server C-language API** — ဒါက C programming language နဲ့ ရေးထားတဲ့ backend function API ထဲက ပြောင်းလဲမှုတွေ ပါဝင်ပါတယ်။ အဲဒီလို ပြောင်းလဲမှုတွေက server ရဲ့ အတွင်းထဲ နက်နက်ရှိုင်းရှိုင်းမှာ ရှိတဲ့ backend functions တွေကို ရည်ညွှန်း သုံးစွဲနေတဲ့ code တွေကို သက်ရောက်ပါတယ်။

### 18.6.1. Upgrading Data via pg_dumpall (pg_dumpall ဖြင့် data အဆင့်မြှင့်တင်ခြင်း)

အဆင့်မြှင့်တင်နည်း တစ်ခုကတော့ — PostgreSQL ရဲ့ major version တစ်ခုကနေ data တွေကို dump လုပ်ပြီး — နောက် version တစ်ခုမှာ restore လုပ်တာပဲ ဖြစ်ပါတယ် — ဒါလုပ်ဖို့ဆိုရင် — pg_dumpall လို *logical* backup tool (ယုတ္တိ အရန် ကိရိယာ) တစ်ခုကို သုံးရပါမယ်; file system အဆင့် backup နည်းလမ်းတွေကတော့ အလုပ်မလုပ်ပါဘူး။ (PostgreSQL ရဲ့ incompatible version တစ်ခုနဲ့ data directory တစ်ခုကို သုံးမိခြင်းကနေ ကာကွယ်ပေးတဲ့ စစ်ဆေးမှုတွေ ရှိတာမို့ — data directory တစ်ခုပေါ်မှာ မှားယွင်းတဲ့ server version တစ်ခုကို စတင်ဖို့ ကြိုးစားခြင်းက ကြီးမားတဲ့ ထိခိုက်မှု ဘာမှ မဖြစ်စေနိုင်ပါဘူး။)

PostgreSQL ရဲ့ version အသစ်ကနေ လာတဲ့ pg_dump နဲ့ pg_dumpall programs တွေကို သုံးဖို့ အကြံပြုပါတယ် — အကြောင်းကတော့ ဒီ programs တွေမှာ ပြုလုပ်ထားနိုင်တဲ့ တိုးတက်ကောင်းမွန်မှုတွေရဲ့ အကျိုးကို ရယူနိုင်ဖို့ပါ။ Dump programs တွေရဲ့ လက်ရှိ releases တွေက — server version 9.2 အထိ နောက်ကြောင်း ပြန်သွားတဲ့ — ဘယ် server version ကနေမဆို data တွေကို ဖတ်နိုင်ပါတယ်။

ဒီ ညွှန်ကြားချက်တွေက သင့် လက်ရှိ installation က `/usr/local/pgsql` directory အောက်မှာ ရှိပြီး — data area က `/usr/local/pgsql/data` ထဲမှာ ရှိတယ်လို့ ယူဆထားပါတယ်။ သင့်ရဲ့ paths တွေနဲ့ သင့်တော်သလို အစားထိုးပါ။

1. Backup လုပ်မယ်ဆိုရင် — သင့် database ကို update (မွမ်းမံ) လုပ်နေခြင်း မရှိဘူးဆိုတာ သေချာ စစ်ဆေးပါ။ ဒါက backup ရဲ့ ခိုင်မာမှု (integrity) ကို မထိခိုက်စေပေမယ့် — ပြောင်းလဲသွားတဲ့ data တွေကတော့ ပါဝင်မှာ မဟုတ်တာ သေချာပါတယ်။ လိုအပ်ရင် — သင့်ကလွဲလို့ လူတိုင်းရဲ့ access ကို ခွင့်မပြုအောင် /usr/local/pgsql/data/pg_hba.conf (သို့မဟုတ် ညီမျှသော ဖိုင်) ထဲက permissions တွေကို တည်းဖြတ်ပါ။ Access control အကြောင်း နောက်ထပ် အချက်အလက်အတွက် အခန်း 20 ကို ကြည့်ပါ။
   သင့် database installation ကို backup လုပ်ဖို့ — အောက်ပါအတိုင်း ရိုက်ထည့်ပါ:
  
  pg_dumpall > outputfile
  
  Backup လုပ်ဖို့အတွက် — သင်လက်ရှိ run နေတဲ့ version ကနေ ရတဲ့ pg_dumpall command ကို သုံးနိုင်ပါတယ်; အသေးစိတ်အတွက် အပိုင်း 25.1.2 ကို ကြည့်ပါ။ ဒါပေမယ့် — အကောင်းဆုံး ရလဒ်အတွက်တော့ — PostgreSQL 18.6 ကနေ ရတဲ့ pg_dumpall command ကို သုံးဖို့ ကြိုးစားပါ — အကြောင်းကတော့ ဒီ version က version အဟောင်းတွေထက် bug fixes (ချွတ်ယွင်းချက် ပြင်ဆင်မှုများ) နဲ့ တိုးတက်ကောင်းမွန်မှုတွေ ပါဝင်လို့ပါ။ ဒီ အကြံပြုချက်က — version အသစ်ကို မတပ်ဆင်ရသေးတဲ့အတွက် — ထူးဆန်းပုံ ရနိုင်ပေမယ့် — version အသစ်ကို version အဟောင်းနဲ့ အပြိုင် (parallel) တပ်ဆင်ဖို့ စီစဉ်နေတယ်ဆိုရင် ဒါကို လိုက်နာဖို့ အကြံပြုလိုပါတယ်။ အဲဒီလိုဆိုရင် — installation ကို ပုံမှန်အတိုင်း အပြီးသတ်ပြီး — data တွေကို နောက်မှ လွှဲပြောင်းနိုင်ပါတယ်။ ဒါက downtime (ရပ်နားချိန်) ကိုလည်း လျှော့ချပေးပါလိမ့်မယ်။
2. Server အဟောင်းကို ရပ်တန့်ပါ:
  
  pg_ctl stop
  
  PostgreSQL ကို boot (စတင် တက်လာချိန်) အချိန်မှာ စတင်တဲ့ systems တွေမှာ — အလားတူ လုပ်ဆောင်ပေးမယ့် start-up ဖိုင် တစ်ခု ရှိနိုင်ပါတယ်။ ဥပမာ — Red Hat Linux system တစ်ခုမှာဆိုရင် အောက်ပါအတိုင်း အလုပ်ဖြစ်တာ တွေ့နိုင်ပါတယ်:
  
  /etc/rc.d/init.d/postgresql stop
  
  Server စတင်ခြင်းနဲ့ ရပ်တန့်ခြင်း အသေးစိတ်အတွက် အခန်း 18 ကို ကြည့်ပါ။
3. Backup ကနေ restore လုပ်မယ်ဆိုရင် — version-specific မဟုတ်တဲ့ installation directory အဟောင်းကို — အမည် ပြောင်းပါ ဒါမှမဟုတ် ဖျက်ပါ။ Directory ကို ဖျက်လိုက်တာထက် အမည် ပြောင်းထားတာက ပိုကောင်းပါတယ် — ပြဿနာ တစ်ခုခု ကြုံရပြီး ပြန်သုံးစရာ လိုလာရင် ရတဲ့အတွက်ပါ။ Directory က disk space (disk နေရာလွတ်) အများအပြား သုံးစွဲနိုင်တာ သတိပြုပါ။ Directory ကို အမည် ပြောင်းဖို့ဆိုရင် အောက်ပါလို command မျိုး သုံးပါ:
  
  mv /usr/local/pgsql /usr/local/pgsql.old
  
  (Relative paths တွေ မပြောင်းလဲဘဲ ရှိနေစေဖို့ — directory ကို တစ်ခုတည်း ယူနစ် (single unit) အနေနဲ့ ရွှေ့ဖို့ သေချာ လုပ်ပါ။)
4. အခန်း 17 မှာ ဖော်ပြထားတဲ့အတိုင်း — PostgreSQL ရဲ့ version အသစ်ကို တပ်ဆင်ပါ။
5. လိုအပ်ရင် database cluster အသစ် တစ်ခု ဖန်တီးပါ။ ဒီ commands တွေကို — အထူး database user account နဲ့ log in ဝင်ထားစဉ်မှာ လုပ်ဆောင်ရမယ်ဆိုတာ သတိရပါ (အဆင့်မြှင့်တင်နေတယ်ဆိုရင် အဲဒီ account က သင့်မှာ ရှိပြီးသားပါ)။
  
  /usr/local/pgsql/bin/initdb -D /usr/local/pgsql/data
6. သင့် ယခင် pg_hba.conf နဲ့ postgresql.conf ပြုပြင် မွမ်းမံမှုတွေ အားလုံးကို ပြန်လည် ထည့်သွင်းပါ။
7. Database server ကို — အထူး database user account ကိုပဲ ထပ်သုံးပြီး — စတင်ပါ:
  
  /usr/local/pgsql/bin/postgres -D /usr/local/pgsql/data
8. နောက်ဆုံးအနေနဲ့ — backup ကနေ သင့် data တွေကို အောက်ပါ command ဖြင့် restore လုပ်ပါ:
  
  /usr/local/pgsql/bin/psql -d postgres -f outputfile
  
  psql အသစ်ကို သုံးပြီး ပေါ့။

Downtime အနည်းဆုံး ဖြစ်အောင်တော့ — server အသစ်ကို မတူညီတဲ့ directory တစ်ခုမှာ တပ်ဆင်ပြီး — server အဟောင်းနဲ့ အသစ် နှစ်ခုလုံးကို — port မတူညီတဲ့ နေရာတွေမှာ — အပြိုင် run လုပ်ခြင်းအားဖြင့် ရနိုင်ပါတယ်။ အဲဒါဆိုရင် သင့် data တွေကို လွှဲပြောင်းဖို့ အောက်ပါလို တစ်ခုခုကို သုံးနိုင်ပါတယ်:

```sql
pg_dumpall -p 5432 | psql -d postgres -p 5433
```

### 18.6.2. Upgrading Data via pg_upgrade (pg_upgrade ဖြင့် data အဆင့်မြှင့်တင်ခြင်း)

[pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html) module က installation တစ်ခုကို — PostgreSQL ရဲ့ major version တစ်ခုကနေ နောက်တစ်ခုဆီကို — in-place (နေရာတွင်း ရွှေ့ပြောင်းခြင်း မရှိဘဲ) migrate (ရွှေ့ပြောင်း) လုပ်ခွင့် ပေးပါတယ်။ အထူးသဖြင့် `--link` mode နဲ့ဆိုရင် — အဆင့်မြှင့်တင်မှုတွေကို မိနစ်ပိုင်းအတွင်း လုပ်ဆောင်နိုင်ပါတယ်။ ဒါက အပေါ်က pg_dumpall နဲ့ ဆင်တူတဲ့ အဆင့်တွေ လိုအပ်ပါတယ် — ဥပမာ — server စတင်ခြင်း/ရပ်တန့်ခြင်း၊ initdb run လုပ်ခြင်း စသဖြင့်ပါ။ လိုအပ်တဲ့ အဆင့်တွေကို pg_upgrade ရဲ့ [documentation (မှတ်တမ်း)](https://www.postgresql.org/docs/current/pgupgrade.html) မှာ ဖော်ပြထားပါတယ်။

### 18.6.3. Upgrading Data via Replication (replication ဖြင့် data အဆင့်မြှင့်တင်ခြင်း)

PostgreSQL ရဲ့ အဆင့်မြှင့်ပြီးသား version နဲ့ standby server တစ်ခု ဖန်တီးဖို့ — logical replication နည်းလမ်းတွေကို သုံးဖို့လည်း ဖြစ်နိုင်ပါတယ်။ Logical replication က — PostgreSQL ရဲ့ မတူညီတဲ့ major versions တွေကြားမှာ replication လုပ်တာကို ထောက်ပံ့ပေးလို့ ဒါ ဖြစ်နိုင်တာပါ။ Standby က ကွန်ပျူတာ တစ်လုံးတည်းပေါ်မှာ ဒါမှမဟုတ် မတူညီတဲ့ ကွန်ပျူတာ တစ်ခုပေါ်မှာ ဖြစ်နိုင်ပါတယ်။ သူက primary server (PostgreSQL ရဲ့ version အဟောင်းကို run နေတဲ့) နဲ့ sync (ထပ်တူကျအောင် ချိန်ကိုက်) လုပ်ပြီးတာနဲ့ — primaries တွေကို ပြောင်းလဲပြီး — standby ကို primary ဖြစ်စေကာ — database instance အဟောင်းကို ရပ်တန့်နိုင်ပါတယ်။ ဒီလို switch-over (အဓိက ပြောင်းလဲမှု) က အဆင့်မြှင့်တင်မှုတစ်ခုအတွက် downtime စက္ကန့် အနည်းငယ်ပဲ ဖြစ်စေပါတယ်။

ဒီ အဆင့်မြှင့်တင်နည်းကို — built-in logical replication စွမ်းဆောင်ချက်တွေ သုံးပြီးတော့ရော — pglogical, Slony, Londiste နဲ့ Bucardo လို ပြင်ပ logical replication systems တွေ သုံးပြီးတော့ပါ လုပ်ဆောင်နိုင်ပါတယ်။
