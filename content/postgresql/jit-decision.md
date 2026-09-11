---
title: "When to JIT? (JIT ကို ဘယ်အချိန် သုံးမလဲ?)"
description: "JIT compilation ကို ဘယ်အချိန် အကျိုးရှိလဲ — long-running CPU-bound query များ၊ estimated cost ကို jit_above_cost, jit_inline_above_cost နှင့် jit_optimize_above_cost တို့နှင့် နှိုင်းယှဉ် ဆုံးဖြတ်ခြင်း၊ prepared statement နှင့် EXPLAIN ဖြင့် JIT အသုံးပြုမှုကို စစ်ဆေးခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 224
source: "https://www.postgresql.org/docs/current/jit-decision.html"
status: translated
updated: 2026-09-11
---

## 30.2. When to JIT? (JIT ကို ဘယ်အချိန် သုံးမလဲ?)

JIT compilation က အချိန်ကြာကြာ run လုပ်တဲ့ CPU-bound query တွေအတွက် အဓိက အကျိုးရှိပါတယ်။ များသောအားဖြင့် ဒါတွေက analytical query တွေ ဖြစ်ကြပါတယ်။ Query တိုတောင်းတွေအတွက်တော့ — JIT compilation လုပ်တဲ့ အပိုဆောင်း overhead က သူ သက်သာစေနိုင်တဲ့ အချိန်ထက် များသောအားဖြင့် ပိုမြင့်ပါလိမ့်မယ်။

JIT compilation ကို သုံးသင့် မသုံးသင့် ဆုံးဖြတ်ဖို့ — query တစ်ခုရဲ့ ခန့်မှန်း ကုန်ကျစရိတ် စုစုပေါင်း (estimated cost) ကို သုံးပါတယ် ([အခန်း 69](https://www.postgresql.org/docs/current/planner-stats-details.html) နဲ့ [အပိုင်း 19.7.2](https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS) ကို ကြည့်ပါ)။ Query ရဲ့ ခန့်မှန်း ကုန်ကျစရိတ်ကို [jit_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-ABOVE-COST) ရဲ့ setting နဲ့ နှိုင်းယှဉ်ပါလိမ့်မယ်။ ကုန်ကျစရိတ် ပိုမြင့်ရင် — JIT compilation ကို လုပ်ဆောင်ပါလိမ့်မယ်။ ပြီးရင် နောက်ထပ် ဆုံးဖြတ်ချက် နှစ်ခု လိုအပ်ပါတယ်။ ပထမအနေနဲ့ — ခန့်မှန်း ကုန်ကျစရိတ်က [jit_inline_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-INLINE-ABOVE-COST) ရဲ့ setting ထက် ပိုမြင့်ရင် — query မှာ သုံးထားတဲ့ function တိုတောင်းတွေ နဲ့ operator တွေကို inline လုပ်ပါလိမ့်မယ်။ ဒုတိယအနေနဲ့ — ခန့်မှန်း ကုန်ကျစရိတ်က [jit_optimize_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-OPTIMIZE-ABOVE-COST) ရဲ့ setting ထက် ပိုမြင့်ရင် — generate လုပ်ထားတဲ့ code ကို ပိုကောင်းစေဖို့ ကုန်ကျစရိတ် များတဲ့ optimization တွေကို ကျင့်သုံးပါတယ်။ ဒီ option တစ်ခုချင်းစီက JIT compilation overhead ကို တိုးစေပေမယ့် — query execution time ကို သိသိသာသာ လျှော့ချနိုင်ပါတယ်။

ဒီ cost-based ဆုံးဖြတ်ချက်တွေကို execution time မှာ မဟုတ်ဘဲ plan time မှာ ချမှတ်ပါလိမ့်မယ်။ ဆိုလိုတာက — prepared statement တွေ သုံးနေပြီး generic plan တစ်ခုကို သုံးတဲ့အခါ ([PREPARE](/docs/postgresql/sql-prepare) ကို ကြည့်ပါ) — execution time မှာ ရှိတဲ့ setting တွေ မဟုတ်ဘဲ — prepare time မှာ အာဏာသက်ရောက်နေတဲ့ configuration parameter တွေရဲ့ တန်ဖိုးတွေက ဆုံးဖြတ်ချက်တွေကို ထိန်းချုပ်ပါတယ်။

> **မှတ်ချက်:** [jit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT) ကို `off` သတ်မှတ်ထားရင် — ဒါမှမဟုတ် JIT implementation တစ်ခုမှ မရနိုင်ရင် (ဥပမာ — server ကို `--with-llvm` မပါဘဲ compile လုပ်ထားလို့) — အထက်က စံနှုန်းတွေအရ အကျိုးရှိမယ် ဆိုရင်တောင် — JIT ကို လုပ်ဆောင်မှာ မဟုတ်ပါဘူး။ [jit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT) ကို `off` သတ်မှတ်ခြင်းက plan time ရော execution time မှာပါ အကျိုးသက်ရောက်မှု ရှိပါတယ်။

[EXPLAIN](/docs/postgresql/sql-explain) ကို သုံးပြီး JIT ကို သုံးသလား မသုံးသလား ကြည့်နိုင်ပါတယ်။ ဥပမာအနေနဲ့ — JIT ကို မသုံးတဲ့ query တစ်ခုက ဒီမှာ ရှိပါတယ်:

```
=# EXPLAIN ANALYZE SELECT SUM(relpages) FROM pg_class;
                                                 QUERY PLAN
-------------------------------------------------------------------​------------------------------------------
 Aggregate  (cost=16.27..16.29 rows=1 width=8) (actual time=0.303..0.303 rows=1.00 loops=1)
   Buffers: shared hit=14
   ->  Seq Scan on pg_class  (cost=0.00..15.42 rows=342 width=4) (actual time=0.017..0.111 rows=356.00 loops=1)
         Buffers: shared hit=14
 Planning Time: 0.116 ms
 Execution Time: 0.365 ms
```

Plan ရဲ့ ကုန်ကျစရိတ်ကို ကြည့်ရင် — JIT ကို လုံးဝ မသုံးခဲ့တာ ကျိုးကြောင်း ညီပါတယ်; JIT ရဲ့ ကုန်ကျစရိတ်က ရနိုင်တဲ့ သက်သာမှုထက် ပိုကြီးမှာမို့ပါ။ Cost limit တွေကို ချိန်ညှိလိုက်ရင် JIT သုံးလာပါလိမ့်မယ်:

```
=# SET jit_above_cost = 10;
SET
=# EXPLAIN ANALYZE SELECT SUM(relpages) FROM pg_class;
                                                 QUERY PLAN
-------------------------------------------------------------------​------------------------------------------
 Aggregate  (cost=16.27..16.29 rows=1 width=8) (actual time=6.049..6.049 rows=1.00 loops=1)
   Buffers: shared hit=14
   ->  Seq Scan on pg_class  (cost=0.00..15.42 rows=342 width=4) (actual time=0.019..0.052 rows=356.00 loops=1)
         Buffers: shared hit=14
 Planning Time: 0.133 ms
 JIT:
   Functions: 3
   Options: Inlining false, Optimization false, Expressions true, Deforming true
   Timing: Generation 1.259 ms (Deform 0.000 ms), Inlining 0.000 ms, Optimization 0.797 ms, Emission 5.048 ms, Total 7.104 ms
 Execution Time: 7.416 ms
```

ဒီမှာ မြင်ရတဲ့အတိုင်း — JIT ကို သုံးခဲ့ပေမယ့် — inlining နဲ့ ကုန်ကျစရိတ်များတဲ့ optimization ကိုတော့ မသုံးခဲ့ပါဘူး။ [jit_inline_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-INLINE-ABOVE-COST) ဒါမှမဟုတ် [jit_optimize_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-OPTIMIZE-ABOVE-COST) ကိုလည်း လျှော့ချလိုက်ရင် — ဒါက ပြောင်းလဲသွားပါလိမ့်မယ်။
