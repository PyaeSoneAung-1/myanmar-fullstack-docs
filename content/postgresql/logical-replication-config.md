---
title: "Configuration Settings (configuration သတ်မှတ်ချက်များ)"
description: "Logical replication အတွက် configuration setting များ — publisher ဘက်တွင် wal_level၊ max_replication_slots၊ max_wal_senders စသည့် ချိန်ညှိမှုများ၊ subscriber ဘက်တွင် max_active_replication_origins၊ max_logical_replication_workers၊ max_worker_processes စသည့် ချိန်ညှိမှုများ အကြောင်း"
order: 238
source: "https://www.postgresql.org/docs/current/logical-replication-config.html"
status: translated
updated: 2026-09-11
---

## 29.12. Configuration Settings (configuration သတ်မှတ်ချက်များ)

- **29.12.1. Publishers**
- **29.12.2. Subscribers**

Logical replication အတွက် configuration option အများအပြား set လုပ်ဖို့ လိုပါတယ်။ ဒီ option တွေက replication ရဲ့ တစ်ဖက်တစ်ချက်မှာသာ သက်ဆိုင်ပါတယ်။

### 29.12.1. Publishers (ထုတ်ဝေသူများ)

[`wal_level`](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL) ကို `logical` သတ်မှတ်ရပါမယ်။

[`max_replication_slots`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-REPLICATION-SLOTS) ကို — connect လုပ်မယ်လို့ မျှော်လင့်ရတဲ့ subscription အရေအတွက်အပြင် — table synchronization အတွက် အရန်အနေနဲ့ အနည်းငယ် ပေါင်းပြီး — အနည်းဆုံး အဲဒီအရေအတွက် သတ်မှတ်ရပါမယ်။

Logical replication slot တွေကလည်း [`idle_replication_slot_timeout`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-IDLE-REPLICATION-SLOT-TIMEOUT) ရဲ့ သက်ရောက်မှုကို ခံရပါတယ်။

[`max_wal_senders`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS) ကို — `max_replication_slots` နဲ့ အနည်းဆုံး တူညီအောင် — ထို့အပြင် တစ်ချိန်တည်းမှာ connect လုပ်ထားတဲ့ physical replica အရေအတွက်ကိုပါ ပေါင်းပြီး သတ်မှတ်သင့်ပါတယ်။

Logical replication walsender ကလည်း [`wal_sender_timeout`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-SENDER-TIMEOUT) ရဲ့ သက်ရောက်မှုကို ခံရပါတယ်။

### 29.12.2. Subscribers (စာရင်းသွင်းသူများ)

[`max_active_replication_origins`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-ACTIVE-REPLICATION-ORIGINS) ကို — subscriber ဆီ ထည့်မယ့် subscription အရေအတွက်အပြင် — table synchronization အတွက် အရန်အနေနဲ့ အနည်းငယ် ပေါင်းပြီး — အနည်းဆုံး သတ်မှတ်ရပါမယ်။

[`max_logical_replication_workers`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-LOGICAL-REPLICATION-WORKERS) ကို — (leader apply worker တွေအတွက်) subscription အရေအတွက်အပြင် — table synchronization worker တွေနဲ့ parallel apply worker တွေအတွက် အရန်အနေနဲ့ အနည်းငယ် ပေါင်းပြီး — အနည်းဆုံး သတ်မှတ်ရပါမယ်။

[`max_worker_processes`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-WORKER-PROCESSES) ကို — replication worker တွေအတွက် လိုက်လျောညီထွေ ဖြစ်စေဖို့ — အနည်းဆုံး ([`max_logical_replication_workers`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-LOGICAL-REPLICATION-WORKERS) + `1`) ချိန်ညှိဖို့ လိုနိုင်ပါတယ်။ သတိပြုရန် — extension တချို့နဲ့ parallel query တွေကလည်း `max_worker_processes` ကနေ worker slot တွေ ရယူပါတယ်။

[`max_sync_workers_per_subscription`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-SYNC-WORKERS-PER-SUBSCRIPTION) က — subscription initialization လုပ်တဲ့အခါ ဒါမှမဟုတ် table အသစ်တွေ ထည့်တဲ့အခါ — initial data copy ရဲ့ parallelism ပမာဏကို ထိန်းချုပ်ပါတယ်။

[`max_parallel_apply_workers_per_subscription`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-PARALLEL-APPLY-WORKERS-PER-SUBSCRIPTION) က — subscription parameter `streaming = parallel` နဲ့ in-progress transaction တွေကို streaming လုပ်တဲ့ parallelism ပမာဏကို ထိန်းချုပ်ပါတယ်။

Logical replication worker တွေကလည်း [`wal_receiver_timeout`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-RECEIVER-TIMEOUT)၊ [`wal_receiver_status_interval`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-RECEIVER-STATUS-INTERVAL) နဲ့ [`wal_retrieve_retry_interval`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-RETRIEVE-RETRY-INTERVAL) တို့ရဲ့ သက်ရောက်မှုကို ခံရပါတယ်။
