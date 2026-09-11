---
title: "Upgrade (အဆင့်မြှင့်တင်ခြင်း)"
description: "Logical replication cluster များကို အဆင့်မြှင့်တင်ခြင်း — publisher နှင့် subscriber အဆင့်မြှင့်တင်မှုအတွက် ကြိုတင် ပြင်ဆင်ခြင်း၊ logical slots နှင့် subscription dependencies များ migrate လုပ်ခြင်း၏ လိုအပ်ချက်များ၊ two-node, cascaded နှင့် two-node circular logical replication cluster များကို အဆင့်ဆင့် အဆင့်မြှင့်တင်သည့် အဆင့်များ"
order: 221
source: "https://www.postgresql.org/docs/current/logical-replication-upgrade.html"
status: translated
updated: 2026-09-11
---

## 29.13. Upgrade (အဆင့်မြှင့်တင်ခြင်း)

- **29.13.1. Prepare for Publisher Upgrades (publisher များ အဆင့်မြှင့်ရန် ပြင်ဆင်ခြင်း)**
- **29.13.2. Prepare for Subscriber Upgrades (subscriber များ အဆင့်မြှင့်ရန် ပြင်ဆင်ခြင်း)**
- **29.13.3. Upgrading Logical Replication Clusters (logical replication cluster များကို အဆင့်မြှင့်ခြင်း)**

[logical replication clusters](https://www.postgresql.org/docs/current/glossary.html#GLOSSARY-LOGICAL-REPLICATION-CLUSTER) (logical replication cluster များ) ကို migrate လုပ်ခြင်းက — အဟောင်း logical replication cluster များရဲ့ အဖွဲ့ဝင် အားလုံး version 17.0 ဒါမှမဟုတ် ထို့ထက် မြင့်တဲ့ version ဖြစ်မှသာ ဖြစ်နိုင်ပါတယ်။

### 29.13.1. Prepare for Publisher Upgrades (publisher များ အဆင့်မြှင့်ရန် ပြင်ဆင်ခြင်း)

`pg_upgrade` က logical slots များကို migrate လုပ်ဖို့ ကြိုးစားပါတယ်။ ဒါက publisher အသစ်ပေါ်မှာ တူညီတဲ့ logical slots များကို ကိုယ်တိုင် သတ်မှတ်ဖို့ လိုအပ်မှုကို ရှောင်ရှားနိုင်အောင် ကူညီပေးပါတယ်။ Logical slots များ migrate လုပ်ခြင်းကို — အဟောင်း cluster က version 17.0 ဒါမှမဟုတ် ထို့ထက် မြင့်တဲ့အခါမှသာ — support လုပ်ပါတယ်။ Version 17.0 မတိုင်မီ cluster များပေါ်က logical slots များကိုတော့ တိတ်တဆိတ် ignore လုပ်ပါလိမ့်မယ်။

Publisher cluster ကို အဆင့်မြှင့်တင်ခြင်း မစတင်မီ — [`ALTER SUBSCRIPTION ... DISABLE`](/docs/postgresql/sql-altersubscription) ကို execute လုပ်ပြီး — subscription ကို ယာယီ disable လုပ်ထားကြောင်း သေချာပါ။ အဆင့်မြှင့်တင်ပြီးနောက် subscription ကို ပြန်လည် enable လုပ်ပါ။

`pg_upgrade` က logical slots များကို အဆင့်မြှင့်နိုင်ဖို့ ကြိုတင်လိုအပ်ချက် (prerequisites) တချို့ ရှိပါတယ်။ ဒါတွေ မပြည့်မီဘူးဆိုရင် error တစ်ခု ပြသပါလိမ့်မယ်။

- Cluster အသစ်မှာ `wal_level` ကို `logical` အဖြစ် သတ်မှတ်ထားရပါမယ်။
- Cluster အသစ်မှာ `max_replication_slots` ကို — အဟောင်း cluster မှာ ရှိတဲ့ slots အရေအတွက်နဲ့ ညီသည် ဒါမှမဟုတ် ထို့ထက် များတဲ့ တန်ဖိုးတစ်ခုအဖြစ် — configure လုပ်ထားရပါမယ်။
- အဟောင်း cluster ရှိ slots များက ရည်ညွှန်းထားတဲ့ output plugins များကို PostgreSQL အသစ်ရဲ့ executable directory ထဲမှာ install လုပ်ထားရပါမယ်။ ၎င်းတို့ကို cluster အသစ်ရဲ့ `output_plugin_libraries` ထဲမှာလည်း ထည့်သွင်းထားရပါမယ်; လုံခြုံရေး အချက်အလက်အတွက် အဲဒီ parameter ရဲ့ documentation ကို ကြည့်ပါ။
- အဟောင်း cluster က transactions များနဲ့ logical decoding messages များအားလုံးကို subscribers ဆီ replicate လုပ်ပြီးဖြစ်ရပါမယ်။
- အဟောင်း cluster ပေါ်က slots အားလုံး အသုံးပြုနိုင်ရပါမယ် — ဆိုလိုတာက — `pg_replication_slots.conflicting` က true မဟုတ်တဲ့ slots မရှိရပါဘူး။
- Cluster အသစ်မှာ permanent logical slots မရှိရပါဘူး — ဆိုလိုတာက — `pg_replication_slots.temporary` က false ဖြစ်တဲ့ slots မရှိရပါဘူး။

### 29.13.2. Prepare for Subscriber Upgrades (subscriber များ အဆင့်မြှင့်ရန် ပြင်ဆင်ခြင်း)

Subscriber အသစ်မှာ [subscriber configurations](/docs/postgresql/logical-replication-config) (subscriber အတွက် configuration များ) ကို ပြင်ဆင် သတ်မှတ်ပါ။ `pg_upgrade` က subscription dependencies များကို migrate လုပ်ဖို့ ကြိုးစားပြီး — ၎င်းထဲမှာ [pg_subscription_rel](https://www.postgresql.org/docs/current/catalog-pg-subscription-rel.html) system catalog မှာ ရှိတဲ့ subscription ရဲ့ table အချက်အလက်နဲ့ subscription ရဲ့ replication origin တို့ ပါဝင်ပါတယ်။ ဒါက subscriber အသစ်ပေါ်က logical replication ကို — အဟောင်း subscriber ရပ်တန့်ခဲ့တဲ့ နေရာကနေ — ဆက်လက် လုပ်ဆောင်နိုင်စေပါတယ်။ Subscription dependencies များ migrate လုပ်ခြင်းကို — အဟောင်း cluster က version 17.0 ဒါမှမဟုတ် ထို့ထက် မြင့်တဲ့အခါမှသာ — support လုပ်ပါတယ်။ Version 17.0 မတိုင်မီ cluster များပေါ်က subscription dependencies များကိုတော့ တိတ်တဆိတ် ignore လုပ်ပါလိမ့်မယ်။

`pg_upgrade` က subscriptions များကို အဆင့်မြှင့်နိုင်ဖို့ ကြိုတင်လိုအပ်ချက် တချို့ ရှိပါတယ်။ ဒါတွေ မပြည့်မီဘူးဆိုရင် error တစ်ခု ပြသပါလိမ့်မယ်။

- အဟောင်း subscriber ရှိ subscription tables အားလုံးက state `i` (initialize) ဒါမှမဟုတ် `r` (ready) မှာ ရှိသင့်ပါတယ်။ ဒါကို `pg_subscription_rel.srsubstate` ကို စစ်ဆေးခြင်းဖြင့် အတည်ပြုနိုင်ပါတယ်။
- subscription တစ်ခုချင်းစီနဲ့ သက်ဆိုင်တဲ့ replication origin entry က အဟောင်း cluster မှာ ရှိသင့်ပါတယ်။ ဒါကို `pg_subscription` နဲ့ `pg_replication_origin` system tables များကို စစ်ဆေးခြင်းဖြင့် တွေ့ရှိနိုင်ပါတယ်။
- Cluster အသစ်မှာ `max_active_replication_origins` ကို — အဟောင်း cluster မှာ ရှိတဲ့ subscriptions အရေအတွက်နဲ့ ညီသည် ဒါမှမဟုတ် ထို့ထက် များတဲ့ တန်ဖိုးတစ်ခုအဖြစ် — configure လုပ်ထားရပါမယ်။

### 29.13.3. Upgrading Logical Replication Clusters (logical replication cluster များကို အဆင့်မြှင့်ခြင်း)

Subscriber ကို အဆင့်မြှင့်နေစဉ်အတွင်း publisher မှာ write operations များ လုပ်ဆောင်နိုင်ပါတယ်။ Subscriber အဆင့်မြှင့်တင်မှု ပြီးဆုံးတာနဲ့ — ဒီ ပြောင်းလဲမှုများကို subscriber ဆီ replicate လုပ်ပါလိမ့်မယ်။

> **မှတ်ချက်:** Logical replication restrictions များက logical replication cluster အဆင့်မြှင့်တင်ခြင်းများအတွက်လည်း သက်ရောက်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 29.8](/docs/postgresql/logical-replication-restrictions) ကို ကြည့်ပါ။
> 
> Publisher အဆင့်မြှင့်တင်ခြင်းရဲ့ ကြိုတင်လိုအပ်ချက်များက logical replication cluster အဆင့်မြှင့်တင်ခြင်းများအတွက်လည်း သက်ရောက်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 29.13.1](/docs/postgresql/logical-replication-upgrade) ကို ကြည့်ပါ။
> 
> Subscriber အဆင့်မြှင့်တင်ခြင်းရဲ့ ကြိုတင်လိုအပ်ချက်များက logical replication cluster အဆင့်မြှင့်တင်ခြင်းများအတွက်လည်း သက်ရောက်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 29.13.2](/docs/postgresql/logical-replication-upgrade) ကို ကြည့်ပါ။

> **သတိပေးချက်:** Logical replication cluster ကို အဆင့်မြှင့်ခြင်းမှာ node အမျိုးမျိုးပေါ်တွင် လုပ်ဆောင်ရမယ့် အဆင့်များစွာ လိုအပ်ပါတယ်။ Operation အားလုံး transactional မဟုတ်တာကြောင့် — [အပိုင်း 25.3.2](/docs/postgresql/continuous-archiving) မှာ ဖော်ပြထားသည့်အတိုင်း backup များ ယူထားဖို့ အကြံပြုလိုပါတယ်။

အောက်ပါ logical replication cluster များကို အဆင့်မြှင့်တင်ရန် အဆင့်များကို အောက်တွင် အသေးစိတ် ဖော်ပြထားပါတယ်:

- Two-node logical replication cluster ကို အဆင့်မြှင့်ရန် အပိုင်း 29.13.3.1 မှာ ဖော်ပြထားတဲ့ အဆင့်များကို လိုက်နာပါ။
- Cascaded logical replication cluster ကို အဆင့်မြှင့်ရန် အပိုင်း 29.13.3.2 မှာ ဖော်ပြထားတဲ့ အဆင့်များကို လိုက်နာပါ။
- Two-node circular logical replication cluster ကို အဆင့်မြှင့်ရန် အပိုင်း 29.13.3.3 မှာ ဖော်ပြထားတဲ့ အဆင့်များကို လိုက်နာပါ။

#### 29.13.3.1. Steps to Upgrade a Two-node Logical Replication Cluster (two-node logical replication cluster ကို အဆင့်မြှင့်ရန် အဆင့်များ)

publisher က `node1` မှာ ရှိပြီး subscriber က `node2` မှာ ရှိတယ်လို့ ဆိုကြပါစို့။ subscriber `node2` မှာ — `node1` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ — `sub1_node1_node2` ဆိုတဲ့ subscription တစ်ခု ရှိပါတယ်။

1. ALTER SUBSCRIPTION ... DISABLE ကို သုံးပြီး — node2 ပေါ်မှာ node1 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို disable လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 DISABLE;
2. node1 ရှိ publisher server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data1 stop
3. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data1_upgraded instance ကို initialize လုပ်ပါ။
4. publisher node1 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
          --old-datadir "/opt/PostgreSQL/postgres/17/data1"
          --new-datadir "/opt/PostgreSQL/postgres/18/data1_upgraded"
          --old-bindir "/opt/PostgreSQL/postgres/17/bin"
          --new-bindir "/opt/PostgreSQL/postgres/18/bin"
5. node1 မှာ အဆင့်မြှင့်ပြီးသား publisher server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data1_upgraded start -l logfile
6. node2 ရှိ subscriber server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data2 stop
7. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data2_upgraded instance ကို initialize လုပ်ပါ။
8. subscriber node2 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
         --old-datadir "/opt/PostgreSQL/postgres/17/data2"
         --new-datadir "/opt/PostgreSQL/postgres/18/data2_upgraded"
         --old-bindir "/opt/PostgreSQL/postgres/17/bin"
         --new-bindir "/opt/PostgreSQL/postgres/18/bin"
9. node2 မှာ အဆင့်မြှင့်ပြီးသား subscriber server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data2_upgraded start -l logfile
10. node2 ပေါ်မှာ — အဆင့် 1 နဲ့ ယခုအချိန်ကြားတွင် အဆင့်မြှင့်ပြီးသား publisher node1 server မှာ ဖန်တီးခဲ့တဲ့ tables များကို — ဖန်တီးပါ။ ဥပမာ:
  
  /* node2 # */ CREATE TABLE distributors (did integer PRIMARY KEY, name varchar(40));
11. ALTER SUBSCRIPTION ... ENABLE ကို သုံးပြီး — node2 ပေါ်မှာ node1 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို enable လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 ENABLE;
12. ALTER SUBSCRIPTION ... REFRESH PUBLICATION ကို သုံးပြီး node2 subscription ရဲ့ publications များကို refresh လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 REFRESH PUBLICATION;

> **မှတ်ချက်:** အထက်ဖော်ပြပါ အဆင့်များမှာ — publisher ကို အရင် အဆင့်မြှင့်ပြီး — နောက်မှ subscriber ကို အဆင့်မြှင့်ပါတယ်။ တနည်းအားဖြင့် — အသုံးပြုသူဟာ အလားတူ အဆင့်များကို သုံးပြီး — subscriber ကို အရင်၊ ပြီးမှ publisher ကို အဆင့်မြှင့်တဲ့ ပုံစံနဲ့လည်း လုပ်ဆောင်နိုင်ပါတယ်။

#### 29.13.3.2. Steps to Upgrade a Cascaded Logical Replication Cluster (cascaded logical replication cluster ကို အဆင့်မြှင့်ရန် အဆင့်များ)

`node1`->`node2`->`node3` ဆိုတဲ့ cascaded logical replication setup တစ်ခု ရှိတယ်လို့ ဆိုကြပါစို့။ ဒီမှာ `node2` က `node1` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေပြီး — `node3` က `node2` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေပါတယ်။ `node2` မှာ `node1` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ `sub1_node1_node2` ဆိုတဲ့ subscription တစ်ခု ရှိပါတယ်။ `node3` မှာ `node2` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ `sub1_node2_node3` ဆိုတဲ့ subscription တစ်ခု ရှိပါတယ်။

1. ALTER SUBSCRIPTION ... DISABLE ကို သုံးပြီး — node2 ပေါ်မှာ node1 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို disable လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 DISABLE;
2. node1 ရှိ server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data1 stop
3. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data1_upgraded instance ကို initialize လုပ်ပါ။
4. node1 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
          --old-datadir "/opt/PostgreSQL/postgres/17/data1"
          --new-datadir "/opt/PostgreSQL/postgres/18/data1_upgraded"
          --old-bindir "/opt/PostgreSQL/postgres/17/bin"
          --new-bindir "/opt/PostgreSQL/postgres/18/bin"
5. node1 မှာ အဆင့်မြှင့်ပြီးသား server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data1_upgraded start -l logfile
6. ALTER SUBSCRIPTION ... DISABLE ကို သုံးပြီး — node3 ပေါ်မှာ node2 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို disable လုပ်ပါ။ ဥပမာ:
  
  /* node3 # */ ALTER SUBSCRIPTION sub1_node2_node3 DISABLE;
7. node2 ရှိ server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data2 stop
8. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data2_upgraded instance ကို initialize လုပ်ပါ။
9. node2 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
          --old-datadir "/opt/PostgreSQL/postgres/17/data2"
          --new-datadir "/opt/PostgreSQL/postgres/18/data2_upgraded"
          --old-bindir "/opt/PostgreSQL/postgres/17/bin"
          --new-bindir "/opt/PostgreSQL/postgres/18/bin"
10. node2 မှာ အဆင့်မြှင့်ပြီးသား server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data2_upgraded start -l logfile
11. node2 ပေါ်မှာ — အဆင့် 1 နဲ့ ယခုအချိန်ကြားတွင် အဆင့်မြှင့်ပြီးသား publisher node1 server မှာ ဖန်တီးခဲ့တဲ့ tables များကို — ဖန်တီးပါ။ ဥပမာ:
  
  /* node2 # */ CREATE TABLE distributors (did integer PRIMARY KEY, name varchar(40));
12. ALTER SUBSCRIPTION ... ENABLE ကို သုံးပြီး — node2 ပေါ်မှာ node1 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို enable လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 ENABLE;
13. ALTER SUBSCRIPTION ... REFRESH PUBLICATION ကို သုံးပြီး node2 subscription ရဲ့ publications များကို refresh လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 REFRESH PUBLICATION;
14. node3 ရှိ server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data3 stop
15. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data3_upgraded instance ကို initialize လုပ်ပါ။
16. node3 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
          --old-datadir "/opt/PostgreSQL/postgres/17/data3"
          --new-datadir "/opt/PostgreSQL/postgres/18/data3_upgraded"
          --old-bindir "/opt/PostgreSQL/postgres/17/bin"
          --new-bindir "/opt/PostgreSQL/postgres/18/bin"
17. node3 မှာ အဆင့်မြှင့်ပြီးသား server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data3_upgraded start -l logfile
18. node3 ပေါ်မှာ — အဆင့် 6 နဲ့ ယခုအချိန်ကြားတွင် အဆင့်မြှင့်ပြီးသား node2 မှာ ဖန်တီးခဲ့တဲ့ tables များကို — ဖန်တီးပါ။ ဥပမာ:
  
  /* node3 # */ CREATE TABLE distributors (did integer PRIMARY KEY, name varchar(40));
19. ALTER SUBSCRIPTION ... ENABLE ကို သုံးပြီး — node3 ပေါ်မှာ node2 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို enable လုပ်ပါ။ ဥပမာ:
  
  /* node3 # */ ALTER SUBSCRIPTION sub1_node2_node3 ENABLE;
20. ALTER SUBSCRIPTION ... REFRESH PUBLICATION ကို သုံးပြီး node3 subscription ရဲ့ publications များကို refresh လုပ်ပါ။ ဥပမာ:
  
  /* node3 # */ ALTER SUBSCRIPTION sub1_node2_node3 REFRESH PUBLICATION;

#### 29.13.3.3. Steps to Upgrade a Two-node Circular Logical Replication Cluster (two-node circular logical replication cluster ကို အဆင့်မြှင့်ရန် အဆင့်များ)

`node1`->`node2` နဲ့ `node2`->`node1` ဆိုတဲ့ circular logical replication setup တစ်ခု ရှိတယ်လို့ ဆိုကြပါစို့။ ဒီမှာ `node2` က `node1` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေပြီး — `node1` က `node2` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေပါတယ်။ `node1` မှာ `node2` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ `sub1_node2_node1` ဆိုတဲ့ subscription တစ်ခု ရှိပါတယ်။ `node2` မှာ `node1` ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ `sub1_node1_node2` ဆိုတဲ့ subscription တစ်ခု ရှိပါတယ်။

1. ALTER SUBSCRIPTION ... DISABLE ကို သုံးပြီး — node2 ပေါ်မှာ node1 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို disable လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 DISABLE;
2. node1 ရှိ server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data1 stop
3. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data1_upgraded instance ကို initialize လုပ်ပါ။
4. node1 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
          --old-datadir "/opt/PostgreSQL/postgres/17/data1"
          --new-datadir "/opt/PostgreSQL/postgres/18/data1_upgraded"
          --old-bindir "/opt/PostgreSQL/postgres/17/bin"
          --new-bindir "/opt/PostgreSQL/postgres/18/bin"
5. node1 မှာ အဆင့်မြှင့်ပြီးသား server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data1_upgraded start -l logfile
6. ALTER SUBSCRIPTION ... ENABLE ကို သုံးပြီး — node2 ပေါ်မှာ node1 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို enable လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 ENABLE;
7. node1 ပေါ်မှာ — အဆင့် 1 နဲ့ ယခုအချိန်ကြားတွင် node2 မှာ ဖန်တီးခဲ့တဲ့ tables များကို — ဖန်တီးပါ။ ဥပမာ:
  
  /* node1 # */ CREATE TABLE distributors (did integer PRIMARY KEY, name varchar(40));
8. node2 ကနေ ကနဦး table data ကို copy လုပ်နိုင်ဖို့ node1 subscription ရဲ့ publications များကို ALTER SUBSCRIPTION ... REFRESH PUBLICATION ကို သုံးပြီး refresh လုပ်ပါ။ ဥပမာ:
  
  /* node1 # */ ALTER SUBSCRIPTION sub1_node2_node1 REFRESH PUBLICATION;
9. ALTER SUBSCRIPTION ... DISABLE ကို သုံးပြီး — node1 ပေါ်မှာ node2 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို disable လုပ်ပါ။ ဥပမာ:
  
  /* node1 # */ ALTER SUBSCRIPTION sub1_node2_node1 DISABLE;
10. node2 ရှိ server ကို ရပ်တန့်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data2 stop
11. လိုအပ်တဲ့ version အသစ်ကို သုံးပြီး data2_upgraded instance ကို initialize လုပ်ပါ။
12. node2 ရဲ့ server ကို လိုအပ်တဲ့ version အသစ်သို့ အဆင့်မြှင့်ပါ။ ဥပမာ:
  
  pg_upgrade
          --old-datadir "/opt/PostgreSQL/postgres/17/data2"
          --new-datadir "/opt/PostgreSQL/postgres/18/data2_upgraded"
          --old-bindir "/opt/PostgreSQL/postgres/17/bin"
          --new-bindir "/opt/PostgreSQL/postgres/18/bin"
13. node2 မှာ အဆင့်မြှင့်ပြီးသား server ကို စတင်ပါ။ ဥပမာ:
  
  pg_ctl -D /opt/PostgreSQL/data2_upgraded start -l logfile
14. ALTER SUBSCRIPTION ... ENABLE ကို သုံးပြီး — node1 ပေါ်မှာ node2 ကနေ ပြောင်းလဲမှုများကို subscribe လုပ်နေတဲ့ subscriptions အားလုံးကို enable လုပ်ပါ။ ဥပမာ:
  
  /* node1 # */ ALTER SUBSCRIPTION sub1_node2_node1 ENABLE;
15. node2 ပေါ်မှာ — အဆင့် 9 နဲ့ ယခုအချိန်ကြားတွင် အဆင့်မြှင့်ပြီးသား node1 မှာ ဖန်တီးခဲ့တဲ့ tables များကို — ဖန်တီးပါ။ ဥပမာ:
  
  /* node2 # */ CREATE TABLE distributors (did integer PRIMARY KEY, name varchar(40));
16. node1 ကနေ ကနဦး table data ကို copy လုပ်နိုင်ဖို့ node2 subscription ရဲ့ publications များကို ALTER SUBSCRIPTION ... REFRESH PUBLICATION ကို သုံးပြီး refresh လုပ်ပါ။ ဥပမာ:
  
  /* node2 # */ ALTER SUBSCRIPTION sub1_node1_node2 REFRESH PUBLICATION;
