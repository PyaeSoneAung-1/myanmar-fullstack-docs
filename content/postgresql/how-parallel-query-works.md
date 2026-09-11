---
title: "How Parallel Query Works (parallel query အလုပ်လုပ်ပုံ)"
description: "Parallel query လုပ်ဆောင်ပုံ — Gather နှင့် Gather Merge node များ, leader နှင့် background worker များ၏ အခန်းကဏ္ဍ, worker အရေအတွက် ကန့်သတ်ချက်များ (max_parallel_workers_per_gather, max_worker_processes, max_parallel_workers) နှင့် sorted order merge အကြောင်း ရှင်းလင်းချက်"
order: 140
source: "https://www.postgresql.org/docs/current/how-parallel-query-works.html"
status: translated
updated: 2026-09-11
---

## 15.1. How Parallel Query Works (parallel query အလုပ်လုပ်ပုံ)

Optimizer (အကောင်းဆုံး လမ်းကြောင်း ရွေးချယ်ပေးသည့် အစိတ်အပိုင်း) က သတ်မှတ်ထားတဲ့ query တစ်ခုအတွက် parallel query က အမြန်ဆုံး execution strategy (လုပ်ဆောင်မှု နည်းဗျူဟာ) ဖြစ်တယ်လို့ ဆုံးဖြတ်လိုက်တဲ့အခါ — *Gather* ဒါမှမဟုတ် *Gather Merge* node တစ်ခု ပါဝင်တဲ့ query plan (query အစီအစဉ်) တစ်ခုကို ဖန်တီးပါတယ်။ ရိုးရှင်းတဲ့ ဥပမာ တစ်ခုက ဒီလိုပါ:

```sql
EXPLAIN SELECT * FROM pgbench_accounts WHERE filler LIKE '%x%';
                                     QUERY PLAN
-------------------------------------------------------------------​------------------
 Gather  (cost=1000.00..217018.43 rows=1 width=97)
   Workers Planned: 2
   ->  Parallel Seq Scan on pgbench_accounts  (cost=0.00..216018.33 rows=1 width=97)
         Filter: (filler ~~ '%x%'::text)
(4 rows)
```

အခြေအနေ အားလုံးမှာ `Gather` ဒါမှမဟုတ် `Gather Merge` node မှာ child plan (အခွဲ အစီအစဉ်) ကွက်တိ တစ်ခုပဲ ရှိပြီး — အဲဒါက parallel နဲ့ run လုပ်မယ့် plan ရဲ့ အစိတ်အပိုင်း ဖြစ်ပါတယ်။ `Gather` ဒါမှမဟုတ် `Gather Merge` node က plan tree (အစီအစဉ် သစ်ပင်) ရဲ့ ထိပ်ဆုံးမှာ ရှိရင် — query တစ်ခုလုံးက parallel နဲ့ run လုပ်ပါတယ်။ Plan tree ထဲမှာ တခြားနေရာတစ်ခုမှာ ရှိရင်တော့ — သူ့အောက်က plan အပိုင်းကိုပဲ parallel နဲ့ run လုပ်ပါတယ်။ အပေါ်က ဥပမာမှာ query က table တစ်ခုတည်းကိုပဲ access လုပ်တာမို့ — `Gather` node ကိုယ်တိုင်ကလွဲလို့ plan node တစ်ခုပဲ ရှိပါတယ်; အဲဒီ plan node က `Gather` node ရဲ့ child ဖြစ်တာမို့ — သူက parallel နဲ့ run လုပ်ပါတယ်။

[Using EXPLAIN](/docs/postgresql/using-explain) ကို သုံးပြီး — planner (အစီအစဉ် ရေးဆွဲသူ) ရွေးချယ်လိုက်တဲ့ worker အရေအတွက်ကို မြင်နိုင်ပါတယ်။ Query execution (query လုပ်ဆောင်မှု) အတွင်း `Gather` node ကို ရောက်တဲ့အခါ — user ရဲ့ session ကို လုပ်ဆောင်ပေးနေတဲ့ process က planner ရွေးချယ်လိုက်တဲ့ worker အရေအတွက်နဲ့ ညီမျှတဲ့ [background worker process များ](https://www.postgresql.org/docs/current/bgworker.html) ကို တောင်းဆိုပါတယ်။ Planner က သုံးဖို့ စဉ်းစားမယ့် background worker အရေအတွက်ကို အများဆုံး [max_parallel_workers_per_gather](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS-PER-GATHER) အတွင်းသာ ကန့်သတ်ထားပါတယ်။ တစ်ချိန်တည်းမှာ တည်ရှိနိုင်တဲ့ background worker စုစုပေါင်း အရေအတွက်ကို [max_worker_processes](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-WORKER-PROCESSES) နဲ့ [max_parallel_workers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS) နှစ်ခုလုံးက ကန့်သတ်ထားပါတယ်။ ဒါကြောင့် — parallel query တစ်ခုက စီစဉ်ထားတာထက် worker နည်းနည်းနဲ့ ဖြစ်စေ — worker လုံးဝ မပါဘဲ ဖြစ်စေ run လုပ်နိုင်ပါတယ်။ အကောင်းဆုံး plan က ရရှိနိုင်တဲ့ worker အရေအတွက်ပေါ် မူတည်နိုင်တာမို့ — ဒါက query performance (query စွမ်းဆောင်ရည်) ညံ့ဖျင်းမှုကို ဖြစ်စေနိုင်ပါတယ်။ ဒီအခြေအနေ အများအပြား ဖြစ်လာရင် — worker ပိုများများ တစ်ပြိုင်နက် run နိုင်အောင် `max_worker_processes` နဲ့ `max_parallel_workers` ကို တိုးဖို့ ဒါမှမဟုတ် — planner က worker နည်းနည်းပဲ တောင်းဆိုအောင် `max_parallel_workers_per_gather` ကို လျှော့ဖို့ စဉ်းစားပါ။

သတ်မှတ်ထားတဲ့ parallel query တစ်ခုအတွက် အောင်မြင်စွာ စတင်နိုင်တဲ့ background worker process တိုင်းက plan ရဲ့ parallel အပိုင်းကို လုပ်ဆောင်ပါတယ်။ Leader (ဦးဆောင် process) ကလည်း plan ရဲ့ အဲဒီအပိုင်းကို လုပ်ဆောင်ပါတယ် — ဒါပေမယ့် သူ့မှာ ထပ်ဆောင်း တာဝန် တစ်ခု ရှိပါတယ်: worker တွေ ထုတ်လုပ်တဲ့ tuple အားလုံးကိုလည်း ဖတ်ရပါတယ်။ Plan ရဲ့ parallel အပိုင်းက tuple အနည်းငယ်ပဲ ထုတ်လုပ်တဲ့အခါ — leader က ထပ်ဆောင်း worker တစ်ခုလိုပဲ ပြုမူလေ့ ရှိပြီး — query execution ကို အရှိန်မြှင့်ပေးပါတယ်။ အပြန်အလှန်အားဖြင့် — plan ရဲ့ parallel အပိုင်းက tuple အများအပြား ထုတ်လုပ်တဲ့အခါ — leader က worker တွေ ထုတ်လုပ်တဲ့ tuple တွေကို ဖတ်ခြင်းနဲ့ `Gather` node ဒါမှမဟုတ် `Gather Merge` node အထက် အဆင့်ရှိ plan node တွေ လိုအပ်တဲ့ နောက်ထပ် processing အဆင့်တွေ လုပ်ဆောင်ခြင်းတို့နဲ့ လုံးလုံးလျားလျားနီးပါး အလုပ်များနေနိုင်ပါတယ်။ ဒီလို အခြေအနေတွေမှာ leader က plan ရဲ့ parallel အပိုင်း လုပ်ဆောင်မှုထဲက အလုပ် အနည်းငယ်ပဲ လုပ်ပါတော့တယ်။

Plan ရဲ့ parallel အပိုင်း ထိပ်မှာရှိတဲ့ node က `Gather` မဟုတ်ဘဲ `Gather Merge` ဖြစ်တဲ့အခါ — plan ရဲ့ parallel အပိုင်းကို လုပ်ဆောင်နေတဲ့ process တစ်ခုချင်းစီက tuple တွေကို sorted order (စီစဉ်ထားသော အစီအစဉ်) နဲ့ ထုတ်လုပ်နေပြီး — leader က order-preserving merge (အစီအစဉ်ကို ထိန်းသိမ်းတဲ့ ပေါင်းစည်းမှု) ကို လုပ်ဆောင်နေတယ်ဆိုတာ ဖော်ပြပါတယ်။ ဆန့်ကျင်ဘက်အားဖြင့် — `Gather` ကတော့ worker တွေဆီက tuple တွေကို အဆင်ပြေရာ အစီအစဉ်အတိုင်း ဖတ်ပြီး — ရှိနေနိုင်တဲ့ sort order တစ်ခုခုကို ဖျက်ဆီးပစ်ပါတယ်။
