---
title: "Parallel Safety (parallel ဘေးကင်းလုံခြုံမှု)"
description: "Parallel safety — operation များကို parallel safe/restricted/unsafe အဖြစ် ခွဲခြား သတ်မှတ်ခြင်း, အမြဲတမ်း parallel restricted ဖြစ်သော operation များ, function နှင့် aggregate များအတွက် PARALLEL SAFE/RESTRICTED/UNSAFE တံဆိပ် သတ်မှတ်ခြင်းနှင့် လိုက်နာရမည့် စည်းမျဉ်းများ အကြောင်း ရှင်းလင်းချက်"
order: 143
source: "https://www.postgresql.org/docs/current/parallel-safety.html"
status: translated
updated: 2026-09-11
---

## 15.4. Parallel Safety (parallel ဘေးကင်းလုံခြုံမှု)

- **15.4.1. Parallel Labeling for Functions and Aggregates (function နှင့် aggregate များအတွက် parallel တံဆိပ် သတ်မှတ်ခြင်း)**

Planner က query တစ်ခုမှာ ပါဝင်တဲ့ operation တွေကို *parallel safe*၊ *parallel restricted* ဒါမှမဟုတ် *parallel unsafe* အဖြစ် ခွဲခြား သတ်မှတ်ပါတယ်။ Parallel safe operation (parallel ဘေးကင်းသော လုပ်ဆောင်ချက်) ဆိုတာ parallel query အသုံးပြုမှုနဲ့ မကွဲလွဲတဲ့ operation ဖြစ်ပါတယ်။ Parallel restricted operation (parallel ကန့်သတ်ထားသော လုပ်ဆောင်ချက်) ဆိုတာ parallel worker ထဲမှာ လုပ်ဆောင်လို့ မရပေမယ့် — parallel query သုံးနေချိန်မှာ leader ထဲမှာ လုပ်ဆောင်နိုင်တဲ့ operation ဖြစ်ပါတယ်။ ဒါကြောင့် — parallel restricted operation တွေက `Gather` ဒါမှမဟုတ် `Gather Merge` node အောက်မှာ ဘယ်တော့မှ ဖြစ်ပေါ်နိုင်မှာ မဟုတ်ပေမယ့် — အဲဒီလို node ပါဝင်တဲ့ plan ထဲက တခြားနေရာတွေမှာ ဖြစ်ပေါ်နိုင်ပါတယ်။ Parallel unsafe operation (parallel ဘေးမကင်းသော လုပ်ဆောင်ချက်) ဆိုတာ parallel query သုံးနေချိန်မှာ leader ထဲမှာတောင် လုပ်ဆောင်လို့ မရတဲ့ operation ဖြစ်ပါတယ်။ Query တစ်ခုမှာ parallel unsafe ဖြစ်တဲ့ အရာတစ်ခုခု ပါဝင်ရင် — အဲဒီ query အတွက် parallel query ကို လုံးလုံးလျားလျား disable လုပ်လိုက်ပါတယ်။

အောက်ပါ operation တွေက အမြဲတမ်း parallel restricted ဖြစ်ပါတယ်:

- Common table expression (CTE) များကို scan လုပ်ခြင်း။
- Temporary table များကို scan လုပ်ခြင်း။
- Foreign table များကို scan လုပ်ခြင်း — foreign data wrapper တွင် ဆန့်ကျင်ဘက် ညွှန်ပြချက် ပေးသော `IsForeignScanParallelSafe` API မရှိသည့် အခြေအနေတွင်။
- Correlated SubPlan ကို ရည်ညွှန်းတဲ့ plan node များ။

### 15.4.1. Parallel Labeling for Functions and Aggregates (function နှင့် aggregate များအတွက် parallel တံဆိပ် သတ်မှတ်ခြင်း)

User-defined function ဒါမှမဟုတ် aggregate တစ်ခုက parallel safe၊ parallel restricted ဒါမှမဟုတ် parallel unsafe ဖြစ်၊ မဖြစ် ဆိုတာကို planner က အလိုအလျောက် ဆုံးဖြတ်နိုင်စွမ်း မရှိပါဘူး — အကြောင်းကတော့ အဲဒါက function လုပ်ဆောင်နိုင်တဲ့ operation တိုင်းကို ကြိုတင် ခန့်မှန်းဖို့ လိုအပ်လို့ပါ။ ယေဘုယျအားဖြင့် ဒါက Halting Problem (ရပ်တန့်မှု ပြဿနာ) နဲ့ ညီမျှပြီး — ဒါကြောင့် မဖြစ်နိုင်ပါဘူး။ လုပ်နိုင်နိုင်ခဲ့တောင် ရိုးရှင်းတဲ့ function တွေအတွက်တောင် ကျွန်တော်တို့ မကြိုးစားပါဘူး — အကြောင်းကတော့ ဒါက ကုန်ကျစရိတ် များပြီး အမှား လွယ်လို့ပါ။ အဲဒီအစား user-defined function အားလုံးကို — အခြားနည်းနဲ့ သတ်မှတ်ထားခြင်း မရှိပါက — parallel unsafe လို့ ယူဆပါတယ်။ [CREATE FUNCTION](/docs/postgresql/sql-createfunction) ဒါမှမဟုတ် [ALTER FUNCTION](/docs/postgresql/sql-alterfunction) ကို သုံးတဲ့အခါ — သင့်လျော်သလို `PARALLEL SAFE`၊ `PARALLEL RESTRICTED` ဒါမှမဟုတ် `PARALLEL UNSAFE` ကို သတ်မှတ်ခြင်းအားဖြင့် အမှတ်အသားတွေ ထည့်နိုင်ပါတယ်။ [CREATE AGGREGATE](/docs/postgresql/sql-createaggregate) ကို သုံးတဲ့အခါ — `PARALLEL` option ကို သက်ဆိုင်ရာ တန်ဖိုးအဖြစ် `SAFE`၊ `RESTRICTED` ဒါမှမဟုတ် `UNSAFE` နဲ့အတူ သတ်မှတ်နိုင်ပါတယ်။

Function နဲ့ aggregate တွေက database ကို write လုပ်ခြင်း၊ transaction state ကို ပြောင်းလဲခြင်း (error recovery အတွက် subtransaction သုံးခြင်းက လွဲ၍)၊ sequence တွေကို access လုပ်ခြင်း ဒါမှမဟုတ် setting တွေကို အမြဲတမ်း ပြောင်းလဲခြင်း လုပ်ရင် — `PARALLEL UNSAFE` လို့ သတ်မှတ်ရပါမယ်။ အလားတူ — function တွေက temporary table၊ client connection state၊ cursor၊ prepared statement ဒါမှမဟုတ် worker တွေကြား system က synchronize လုပ်နိုင်စွမ်းမရှိတဲ့ အထွေထွေ backend-local state တွေကို access လုပ်ရင် — `PARALLEL RESTRICTED` လို့ သတ်မှတ်ရပါမယ်။ ဥပမာ — `setseed` နဲ့ `random` က ဒီနောက်ဆုံး အကြောင်းရင်းကြောင့် parallel restricted ဖြစ်ပါတယ်။

ယေဘုယျအားဖြင့် — function တစ်ခုက restricted ဒါမှမဟုတ် unsafe ဖြစ်နေပေမယ့် safe လို့ တံဆိပ် ကပ်မိရင်၊ ဒါမှမဟုတ် တကယ်တမ်း unsafe ဖြစ်နေပေမယ့် restricted လို့ တံဆိပ် ကပ်မိရင် — parallel query မှာ သုံးတဲ့အခါ error တွေ ထုတ်နိုင်တယ် ဒါမှမဟုတ် အဖြေ မှားတွေ ထွက်နိုင်ပါတယ်။ C-language function တွေကို မှားယွင်း တံဆိပ် ကပ်မိရင် — သီအိုရီအရ လုံးဝ အနက်အဓိပ္ပာယ် မရှိတဲ့ အပြုအမူတွေ ပြနိုင်ပါတယ် — အကြောင်းကတော့ system က စိတ်ကြိုက် C code ကနေ ကာကွယ်ဖို့ နည်းလမ်း မရှိလို့ပါ — ဒါပေမယ့် ဖြစ်နိုင်ခြေ အများစုမှာတော့ ရလဒ်က တခြား function မျိုးတွေထက် ပိုဆိုးမှာ မဟုတ်ပါဘူး။ သံသယ ရှိရင် — function တွေကို `UNSAFE` လို့ တံဆိပ် ကပ်တာ အကောင်းဆုံး ဖြစ်ပါလိမ့်မယ်။

Parallel worker အတွင်းမှာ လုပ်ဆောင်တဲ့ function တစ်ခုက — leader ကို မကိုင်ထားတဲ့ lock တွေကို ရယူမိရင် (ဥပမာ — query မှာ ရည်ညွှန်း မထားတဲ့ table တစ်ခုကို query လုပ်ခြင်းအားဖြင့်) — အဲဒီ lock တွေကို transaction အဆုံးမှာ မဟုတ်ဘဲ worker exit (worker ထွက်ခွာချိန်) မှာ ပြန်လွှတ်ပါတယ်။ ဒီလို လုပ်တဲ့ function တစ်ခုကို သင် ရေးပြီး — ဒီ အပြုအမူ ကွာခြားချက်က သင့်အတွက် အရေးကြီးရင် — အဲဒီလို function တွေကို `PARALLEL RESTRICTED` လို့ သတ်မှတ်ပြီး leader ထဲမှာပဲ run လုပ်ကြောင်း သေချာစေပါ။

ပိုကောင်းတဲ့ plan ရဖို့ — query မှာ ပါဝင်တဲ့ parallel-restricted function ဒါမှမဟုတ် aggregate တွေရဲ့ evaluation ကို ရွှေ့ဆိုင်းဖို့ query planner က စဉ်းစားတာ မရှိဘူးဆိုတာ သတိပြုပါ။ ဒါကြောင့် ဥပမာ — သတ်မှတ် table တစ်ခုပေါ် အသုံးပြုတဲ့ `WHERE` clause တစ်ခုက parallel restricted ဖြစ်ရင် — query planner က အဲဒီ table ကို plan ရဲ့ parallel အပိုင်းမှာ scan လုပ်ဖို့ စဉ်းစားမှာ မဟုတ်ပါဘူး။ အချို့အခြေအနေတွေမှာ — အဲဒီ table ရဲ့ scan ကို query ရဲ့ parallel အပိုင်းမှာ ထည့်ပြီး — `WHERE` clause ရဲ့ evaluation ကို `Gather` node အထက်မှာ ဖြစ်အောင် ရွှေ့ဆိုင်းထားတာ ဖြစ်နိုင်ပါတယ် (ပြီးတော့ ထိရောက်တောင် ထိရောက်နိုင်ပါတယ်)။ ဒါပေမယ့် planner က ဒါကို လုပ်တာ မရှိပါဘူး။
