---
title: "Architecture (ဗိသုကာ တည်ဆောက်ပုံ)"
description: "Logical replication ၏ ဗိသုကာ — walsender နှင့် apply process၊ logical decoding နှင့် pgoutput plugin၊ session_replication_role၊ trigger များ၊ အစပိုင်း snapshot နှင့် table synchronization worker များအကြောင်း"
order: 217
source: "https://www.postgresql.org/docs/current/logical-replication-architecture.html"
status: translated
updated: 2026-09-11
---

## 29.9. Architecture (ဗိသုကာ တည်ဆောက်ပုံ)

- **29.9.1. Initial Snapshot**

Logical replication က physical streaming replication နဲ့ ဆင်တူတဲ့ ဗိသုကာ (architecture) နဲ့ တည်ဆောက်ထားပါတယ် ([အပိုင်း 26.2.5](/docs/postgresql/warm-standby) ကို ကြည့်ပါ)။ ဒါကို `walsender` နဲ့ `apply` process တွေက အကောင်အထည်ဖော်ပါတယ်။ `walsender` process က WAL ရဲ့ logical decoding ([အခန်း 47](https://www.postgresql.org/docs/current/logicaldecoding.html) မှာ ဖော်ပြထားပါတယ်) ကို စတင်ပြီး — standard logical decoding output plugin (`pgoutput`) ကို load လုပ်ပါတယ်။ Plugin က WAL ကနေ ဖတ်လိုက်တဲ့ ပြောင်းလဲမှုတွေကို logical replication protocol ([အပိုင်း 54.5](https://www.postgresql.org/docs/current/protocol-logical-replication.html) ကို ကြည့်ပါ) အဖြစ် ပြောင်းလဲပြီး — publication သတ်မှတ်ချက်နဲ့ အညီ data ကို စစ်ထုတ်ပါတယ်။ ပြီးရင် data ကို streaming replication protocol သုံးပြီး apply worker ဆီ စဉ်ဆက်မပြတ် ပို့ဆောင်ပါတယ်။ Apply worker က data ကို local table တွေဆီ ချိတ်ဆက်ပေးပြီး — ရရှိတဲ့ ပြောင်းလဲမှုတစ်ခုချင်းစီကို မှန်ကန်တဲ့ transactional အစီအစဉ်အတိုင်း သက်ရောက်စေပါတယ်။

Subscriber database ပေါ်က apply process က [`session_replication_role`](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE) ကို `replica` သတ်မှတ်ပြီး အမြဲတမ်း run လုပ်ပါတယ်။ ဆိုလိုတာက — default အားဖြင့် — subscriber မှာ trigger တွေနဲ့ rule တွေ ဖြစ်ပေါ်မှာ မဟုတ်ပါဘူး။ အသုံးပြုသူတွေက — [`ALTER TABLE`](/docs/postgresql/sql-altertable) command နဲ့ `ENABLE TRIGGER`, `ENABLE RULE` clause တွေကို သုံးပြီး — table တစ်ခုပေါ်မှာ trigger တွေနဲ့ rule တွေကို enable လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။

Logical replication apply process က လက်ရှိမှာ row trigger တွေကိုသာ ဖြစ်ပေါ်စေပြီး — statement trigger တွေကို မဖြစ်ပေါ်စေပါဘူး။ ဒါပေမယ့် — အစပိုင်း table synchronization ကို `COPY` command လိုမျိုး အကောင်အထည်ဖော်ထားတာကြောင့် — `INSERT` အတွက် row trigger ရော statement trigger ပါ ဖြစ်ပေါ်စေပါတယ်။

### 29.9.1. Initial Snapshot (အစပိုင်း snapshot)

ရှိပြီးသား subscribed table တွေထဲက အစပိုင်း data ကို snapshot ရိုက်ပြီး — အထူး apply process အမျိုးအစားတစ်ခုရဲ့ parallel instance တွေမှာ copy လုပ်ပါတယ်။ ဒီ အထူး apply process တွေက — synchronize လုပ်ရမယ့် table တစ်ခုချင်းစီအတွက် ဖန်တီးပေးတဲ့ — သီးသန့် table synchronization worker တွေ ဖြစ်ပါတယ်။ Table synchronization process တစ်ခုချင်းစီက သူ့ကိုယ်ပိုင် replication slot တစ်ခု ဖန်တီးပြီး ရှိပြီးသား data ကို copy လုပ်ပါတယ်။ Copy ပြီးသွားတာနဲ့ — table ရဲ့ အကြောင်းအရာတွေက အခြား backend တွေအတွက် မြင်နိုင်လာပါပြီ။ ရှိပြီးသား data ကို copy ပြီးတာနဲ့ — worker က synchronization mode ထဲ ဝင်ရောက်ပြီး — အစပိုင်း data copy လုပ်နေစဉ်အတွင်း ဖြစ်ပေါ်ခဲ့တဲ့ ပြောင်းလဲမှုတွေကို standard logical replication သုံးပြီး stream လုပ်ခြင်းအားဖြင့် — table ကို main apply process နဲ့ synchronized အခြေအနေသို့ ရောက်စေဖို့ သေချာစေပါတယ်။ ဒီ synchronization အဆင့်အတွင်း — ပြောင်းလဲမှုတွေကို publisher မှာ ဖြစ်ပေါ်ခဲ့တဲ့ အစီအစဉ်အတိုင်း သက်ရောက်စေပြီး commit လုပ်ပါတယ်။ Synchronization ပြီးသွားတာနဲ့ — table ရဲ့ replication ကို ထိန်းချုပ်မှုကို main apply process ဆီ ပြန်လည် ပေးအပ်ပြီး — replication က ပုံမှန်အတိုင်း ဆက်လက် လုပ်ဆောင်ပါတယ်။

> **မှတ်ချက်:** Publication ရဲ့ [`publish`](/docs/postgresql/sql-createpublication) parameter က ဘယ် DML operation တွေကို replicate လုပ်မလဲ ဆိုတာကိုသာ သက်ရောက်ပါတယ်။ အစပိုင်း data synchronization က ရှိပြီးသား table data ကို copy လုပ်တဲ့အခါ ဒီ parameter ကို ထည့်သွင်း စဉ်းစားမထားပါဘူး။

> **မှတ်ချက်:** Copy လုပ်နေစဉ်အတွင်း table synchronization worker တစ်ခု ကျရှုံးသွားရင် — apply worker က ကျရှုံးမှုကို ဖော်ထုတ်ပြီး — synchronization လုပ်ငန်းစဉ် ဆက်လုပ်ဖို့ table synchronization worker ကို ပြန်လည် ဖန်တီး (respawn) ပေးပါတယ်။ ဒီ အပြုအမူက — ယာယီ error တွေက replication setup ကို အမြဲတမ်း အနှောင့်အယှက် မဖြစ်စေကြောင်း သေချာစေပါတယ်။ [`wal_retrieve_retry_interval`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-RETRIEVE-RETRY-INTERVAL) ကိုလည်း ကြည့်ပါ။
