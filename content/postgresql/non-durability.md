---
title: "Non-Durable Settings (non-durable ဆက်တင်များ)"
description: "Durability အာမခံချက် မလိုအပ်တဲ့ အခြေအနေတွေမှာ PostgreSQL ကို ပိုမြန်အောင် configure လုပ်နိုင်တဲ့ ဆက်တင်များ — RAM disk သုံးခြင်း၊ fsync ပိတ်ခြင်း၊ synchronous_commit စသည်"
order: 108
source: "https://www.postgresql.org/docs/current/non-durability.html"
status: translated
updated: 2026-09-03
---

## 14.5. Non-Durable Settings (non-durable ဆက်တင်များ)

Durability (ဒေတာ ကြာရှည်ခံမှု) ဆိုတာ — server တစ်ခု crash ဖြစ်သွားတာပဲဖြစ်ဖြစ် လျှပ်စစ်မီး ပြတ်သွားတာပဲဖြစ်ဖြစ် — commit လုပ်ပြီးသား transaction တွေကို မှတ်တမ်းတင်ထားမှု သေချာစေတဲ့ database feature တစ်ခု ဖြစ်ပါတယ်။ ဒါပေမယ့် — durability က database ရဲ့ overhead (အပိုဝန်ထုပ်) ကို သိသိသာသာ များစေပါတယ်။ ဒါကြောင့် — သင့် site က ဒီလို အာမခံချက်မျိုး မလိုအပ်ဘူးဆိုရင် — PostgreSQL ကို သိသိသာသာ မြန်မြန်ဆန်ဆန် run နိုင်အောင် configure (ပြင်ဆင်သတ်မှတ်) လုပ်နိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ performance တိုးတက်စေဖို့ သင်လုပ်နိုင်တဲ့ configuration အပြောင်းအလဲတွေကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်။ အောက်မှာ မှတ်သားထားတဲ့ ချွင်းချက်တွေကလွဲလို့ — database software ကိုယ်တိုင် crash ဖြစ်တဲ့အခါမှာတော့ durability ကို ဆက်လက် အာမခံပါသေးတယ်; ဒီဆက်တင်တွေကို သုံးတဲ့အခါ — ရုတ်တရက် operating system crash ဖြစ်မှသာ — data ဆုံးရှုံးမှု ဒါမှမဟုတ် ပျက်စီးမှု (corruption) ဖြစ်နိုင်ခြေ ရှိပါတယ်။

- Database cluster ရဲ့ data directory ကို memory-backed file system (မှတ်ဉာဏ် အခြေပြု file system — ဆိုလိုတာက RAM disk) ပေါ်မှာ ထားပါ။ ဒါက database ရဲ့ disk I/O အားလုံးကို ဖယ်ရှားလိုက်ပေမယ့် — data သိမ်းဆည်းနိုင်မှုကို ရနိုင်တဲ့ memory ပမာဏ (ပြီးတော့ ဖြစ်နိုင်ရင် swap) အတွင်းမှာပဲ ကန့်သတ်လိုက်ပါတယ်။
- fsync ကို ပိတ်ထားပါ; data တွေကို disk ပေါ်ကို flush (ရေးချ) လုပ်ဖို့ မလိုအပ်တော့ပါဘူး။
- synchronous_commit ကို ပိတ်ထားပါ; commit တိုင်းမှာ WAL write တွေကို disk ပေါ်ကို အတင်းအကျပ် ရေးချဖို့ မလိုအပ်တော့ပါဘူး။ ဒီဆက်တင်က — database ကိုယ်တိုင် crash ဖြစ်တဲ့အခါ — transaction တွေ ဆုံးရှုံးနိုင်ခြေ ရှိစေပါတယ် (ဒါပေမယ့် data corruption ဖြစ်နိုင်ခြေတော့ မရှိပါဘူး)။
- full_page_writes ကို ပိတ်ထားပါ; partial page write (စာမျက်နှာ တစ်စိတ်တစ်ပိုင်းပဲ ရေးချမိခြင်း) တွေကို ကာကွယ်ဖို့ မလိုအပ်တော့ပါဘူး။
- max_wal_size နဲ့ checkpoint_timeout တွေကို မြှင့်တင်ပါ; ဒါက checkpoint တွေ ဖြစ်ပေါ်နှုန်းကို လျှော့ချပေးပေမယ့် — /pg_wal ရဲ့ သိုလှောင်မှု (storage) လိုအပ်ချက်ကိုတော့ တိုးစေပါတယ်။
- Unlogged table တွေကို ဖန်တီးပြီး WAL write တွေကို ရှောင်ရှားနိုင်ပါတယ် — ဒါပေမယ့် အဲဒီ table တွေက crash-safe (crash ဖြစ်မှ မပျက်စီးနိုင်သော) မဟုတ်တော့ပါဘူး။
