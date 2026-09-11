---
title: "Quick Setup (အမြန် setup ပြုလုပ်ခြင်း)"
description: "Logical replication ကို အမြန် စတင်ရန် လမ်းညွှန် — postgresql.conf တွင် wal_level သတ်မှတ်ခြင်း၊ pg_hba.conf ချိန်ညှိခြင်း၊ publisher တွင် publication ဖန်တီးခြင်းနှင့် subscriber တွင် subscription ဖန်တီးခြင်း"
order: 240
source: "https://www.postgresql.org/docs/current/logical-replication-quick-setup.html"
status: translated
updated: 2026-09-11
---

## 29.14. Quick Setup (အမြန် setup ပြုလုပ်ခြင်း)

ပထမဆုံး `postgresql.conf` ထဲမှာ configuration option တွေကို set လုပ်ပါ။

```sql
wal_level = logical
```

ကျန်တဲ့ လိုအပ်တဲ့ setting တွေမှာ — အခြေခံ setup တစ်ခုအတွက် လုံလောက်တဲ့ default တန်ဖိုးတွေ ရှိပါတယ်။

`pg_hba.conf` ကို replication ခွင့်ပြုဖို့ ချိန်ညှိရပါမယ် (ဒီနေရာက တန်ဖိုးတွေက သင့်ရဲ့ တကယ့် network configuration နဲ့ connect လုပ်ဖို့ သုံးချင်တဲ့ user ပေါ်မှာ မူတည်ပါတယ်)။

```sql
host     all     repuser     0.0.0.0/0     scram-sha-256
```

ပြီးရင် publisher database ပေါ်မှာ —

```sql
CREATE PUBLICATION mypub FOR TABLE users, departments;
```

ပြီးတော့ subscriber database ပေါ်မှာ —

```sql
CREATE SUBSCRIPTION mysub CONNECTION 'dbname=foo host=bar user=repuser' PUBLICATION mypub;
```

အထက်ပါအရာက replication process ကို စတင်ပါလိမ့်မယ်။ ၎င်းက `users` နဲ့ `departments` table တွေရဲ့ အစပိုင်း table အကြောင်းအရာကို synchronize လုပ်ပြီး — ထို့နောက် အဲဒီ table တွေဆီ incremental change တွေကို replicate လုပ်ဖို့ စတင်ပါလိမ့်မယ်။
