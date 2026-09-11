---
title: "When Can Parallel Query Be Used? (parallel query ကို ဘယ်အခါ သုံးနိုင်သလဲ)"
description: "Parallel query ကို ဘယ်အခါ သုံးနိုင်သည် — parallel plan ဖြစ်ပေါ်စေရန် လိုအပ်သော setting များ, parallel plan မထုတ်ပေးသော အခြေအနေများ (data write/lock, ရပ်ဆိုင်းနိုင်သော query, PARALLEL UNSAFE function, nested query) နှင့် execution အချိန်တွင် parallel မလုပ်နိုင်သော အခြေအနေများ အကြောင်း ရှင်းလင်းချက်"
order: 141
source: "https://www.postgresql.org/docs/current/when-can-parallel-query-be-used.html"
status: translated
updated: 2026-09-11
---

## 15.2. When Can Parallel Query Be Used? (parallel query ကို ဘယ်အခါ သုံးနိုင်သလဲ)

Query planner က parallel query plan ကို ဘယ်အခြေအနေမှာမှ မထုတ်ပေးအောင် ဖြစ်စေနိုင်တဲ့ setting (သတ်မှတ်ချက်) အများအပြား ရှိပါတယ်။ Parallel query plan တစ်ခုမှ မဖြစ်ပေါ်စေဖို့ — အောက်ပါ setting တွေကို ဖော်ပြထားတဲ့အတိုင်း configure လုပ်ထားရပါမယ်။

- `max_parallel_workers_per_gather` ကို သုညထက် ကြီးတဲ့ တန်ဖိုး တစ်ခုအဖြစ် သတ်မှတ်ရပါမယ်။ ဒါက — `max_parallel_workers_per_gather` မှတစ်ဆင့် configure လုပ်ထားတဲ့ အရေအတွက်ထက် worker ပိုမသုံးသင့်ဘူးဆိုတဲ့ ယေဘုယျ မူဝါဒရဲ့ အထူးကိစ္စ တစ်ခု ဖြစ်ပါတယ်။

ဒါ့အပြင် — system က single-user mode (တစ်ဦးတည်း အသုံးပြုသူ မုဒ်) နဲ့ လည်ပတ်နေတာ မဖြစ်ရပါဘူး။ ဒီအခြေအနေမှာ database system တစ်ခုလုံးက process တစ်ခုတည်းအနေနဲ့ လည်ပတ်နေတာမို့ — background worker တွေ ရရှိနိုင်မှာ မဟုတ်ပါဘူး။

ယေဘုယျအားဖြင့် parallel query plan တွေ ဖြစ်ပေါ်နိုင်ပေမယ့် — အောက်ပါ အချက်တစ်ခုခု မှန်နေရင် planner က သတ်မှတ်ထားတဲ့ query တစ်ခုအတွက် အဲဒါတွေကို ထုတ်ပေးမှာ မဟုတ်ပါဘူး:

- Query က data တစ်ခုခုကို ရေးသွင်း (write) ခြင်း ဒါမှမဟုတ် database row တစ်ခုခုကို lock (သော့ခတ်) ခြင်း လုပ်တယ်။ Query တစ်ခုမှာ ထိပ်တန်းအဆင့်မှာ ဖြစ်စေ CTE အထဲမှာ ဖြစ်စေ data-modifying (ဒေတာ ပြောင်းလဲသည့်) လုပ်ဆောင်ချက် ပါဝင်ရင် — အဲဒီ query အတွက် parallel plan တွေ ထုတ်ပေးမှာ မဟုတ်ပါဘူး။ ခြွင်းချက်အနေနဲ့ — table အသစ်တစ်ခု ဖန်တီးပြီး populate လုပ်ပေးတဲ့ အောက်ပါ command တွေက — query ရဲ့ အောက်ခံ SELECT အပိုင်းအတွက် parallel plan ကို သုံးနိုင်ပါတယ်:
  - `CREATE TABLE ... AS`
  - `SELECT INTO`
  - `CREATE MATERIALIZED VIEW`
  - `REFRESH MATERIALIZED VIEW`
- Query က လုပ်ဆောင်နေစဉ်အတွင်း ရပ်ဆိုင်းသွားနိုင်တယ်။ System က တစ်စိတ်တစ်ပိုင်း ဒါမှမဟုတ် အဆင့်ဆင့် လုပ်ဆောင်မှု ဖြစ်နိုင်တယ်လို့ ထင်တဲ့ ဘယ်အခြေအနေမှာမဆို parallel plan ကို ထုတ်ပေးမှာ မဟုတ်ပါဘူး။ ဥပမာ — `DECLARE CURSOR` နဲ့ ဖန်တီးထားတဲ့ cursor က parallel plan ကို ဘယ်တော့မှ သုံးမှာ မဟုတ်ပါဘူး။ အလားတူ — `FOR x IN query LOOP .. END LOOP` ပုံစံ PL/pgSQL loop ကလည်း parallel plan ကို ဘယ်တော့မှ သုံးမှာ မဟုတ်ပါဘူး — အကြောင်းကတော့ parallel query system က parallel query active ဖြစ်နေချိန်မှာ loop ထဲက code ကို run လုပ်ဖို့ ဘေးကင်းကြောင်း အတည်ပြုနိုင်စွမ်း မရှိလို့ပါ။
- Query က `PARALLEL UNSAFE` လို့ သတ်မှတ်ထားတဲ့ function တစ်ခုခုကို သုံးတယ်။ System က သတ်မှတ်ထားတဲ့ function အများစုက `PARALLEL SAFE` ဖြစ်ပါတယ် — ဒါပေမယ့် user-defined function တွေကတော့ default အားဖြင့် `PARALLEL UNSAFE` လို့ သတ်မှတ်ထားပါတယ်။ [အပိုင်း 15.4](/docs/postgresql/parallel-safety) ရဲ့ ဆွေးနွေးချက်ကို ကြည့်ပါ။
- Query က parallel ဖြစ်နေပြီးသား အခြား query တစ်ခုရဲ့ အတွင်းမှာ run လုပ်နေတယ်။ ဥပမာ — parallel query က ခေါ်ယူတဲ့ function တစ်ခုက သူကိုယ်တိုင် SQL query တစ်ခုကို ထုတ်လွှတ်ရင် — အဲဒီ query က parallel plan ကို ဘယ်တော့မှ သုံးမှာ မဟုတ်ပါဘူး။ ဒါက လက်ရှိ implementation ရဲ့ ကန့်သတ်ချက် တစ်ခု ဖြစ်ပေမယ့် — query တစ်ခုတည်းက process အလွန်များတဲ့ အရေအတွက်ကို သုံးတာမျိုး ဖြစ်စေနိုင်တာမို့ — ဒီကန့်သတ်ချက်ကို ဖယ်ရှားဖို့ အလိုရှိချင်မှ ရှိပါလိမ့်မယ်။

သတ်မှတ်ထားတဲ့ query တစ်ခုအတွက် parallel query plan တစ်ခု ဖြစ်ပေါ်လာပေမယ့်လည်း — execution အချိန်မှာ အဲဒီ plan ကို parallel နဲ့ လုပ်ဆောင်ဖို့ မဖြစ်နိုင်တဲ့ အခြေအနေ အများအပြား ရှိပါတယ်။ ဒါ ဖြစ်လာရင် — `Gather` node မရှိသလိုပဲ — leader က `Gather` node အောက်က plan အပိုင်းကို သူကိုယ်တိုင် လုံးလုံးလျားလျား လုပ်ဆောင်ပါလိမ့်မယ်။ အောက်ပါ အခြေအနေတွေ ပြည့်မီရင် ဒါ ဖြစ်ပါလိမ့်မယ်:

- Background worker စုစုပေါင်း အရေအတွက်က `max_worker_processes` ကို မကျော်ရဘူးဆိုတဲ့ ကန့်သတ်ချက်ကြောင့် background worker တွေ ရရှိနိုင်မှာ မဟုတ်ပါဘူး။
- Parallel query အတွက် စတင်လွှတ်တဲ့ background worker စုစုပေါင်း အရေအတွက်က `max_parallel_workers` ကို မကျော်ရဘူးဆိုတဲ့ ကန့်သတ်ချက်ကြောင့် background worker တွေ ရရှိနိုင်မှာ မဟုတ်ပါဘူး။
- Client က သုည မဟုတ်တဲ့ fetch count နဲ့အတူ Execute message တစ်ခုကို ပို့တယ်။ Extended query protocol ရဲ့ ဆွေးနွေးချက်ကို ကြည့်ပါ။ libpq က လက်ရှိမှာ ဒီလို message ပို့ဖို့ နည်းလမ်း မပေးထားတာမို့ — libpq ကို အမှီမပြုတဲ့ client ကို သုံးတဲ့အခါမှာသာ ဒါ ဖြစ်နိုင်ပါတယ်။ ဒါ အများအပြား ဖြစ်တတ်ရင် — serial (အစဉ်လိုက်) run လုပ်တဲ့အခါ ကောင်းနိုင်ခြေ နည်းတဲ့ query plan တွေ ဖြစ်ပေါ်တာကို ရှောင်ရှားဖို့ — ဒါ ဖြစ်နိုင်ခြေ များတဲ့ session တွေမှာ `max_parallel_workers_per_gather` ကို သုည သတ်မှတ်ထားတာ ကောင်းပါတယ်။
