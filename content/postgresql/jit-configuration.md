---
title: "Configuration (JIT configuration / ပြင်ဆင် ချိန်ညှိခြင်း)"
description: "PostgreSQL ၏ JIT compilation ကို ထိန်းချုပ်သော configuration variable များ — jit, jit_above_cost, jit_inline_above_cost, jit_optimize_above_cost နှင့် jit_provider အကြောင်း ရှင်းလင်းချက်"
order: 243
source: "https://www.postgresql.org/docs/current/jit-configuration.html"
status: translated
updated: 2026-09-11
---

## 30.3. Configuration (configuration / ပြင်ဆင် ချိန်ညှိခြင်း)

Configuration variable ဖြစ်တဲ့ [jit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT) က JIT compilation ကို enable လုပ်မလား disable လုပ်မလား ဆုံးဖြတ်ပါတယ်။ ဒါကို enable လုပ်ထားရင် — configuration variable တွေ ဖြစ်တဲ့ [jit_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-ABOVE-COST), [jit_inline_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-INLINE-ABOVE-COST), နဲ့ [jit_optimize_above_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JIT-OPTIMIZE-ABOVE-COST) တို့က query တစ်ခုအတွက် JIT compilation ကို လုပ်ဆောင်မလား မလုပ်ဘူးလား နဲ့ — လုပ်ဆောင်ရင် ဘယ်လောက် အားထုတ်မလဲ ဆိုတာကို ဆုံးဖြတ်ပါတယ်။

[jit_provider](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-JIT-PROVIDER) က ဘယ် JIT implementation ကို သုံးမလဲ ဆိုတာကို ဆုံးဖြတ်ပါတယ်။ ဒါကို ပြောင်းလဲဖို့ လိုအပ်တာ ရှားပါတယ်။ [အပိုင်း 30.4.2](/docs/postgresql/jit-extensibility) ကို ကြည့်ပါ။

Development နဲ့ debugging ရည်ရွယ်ချက်တွေအတွက် configuration parameter အပိုတချို့ ရှိပြီး — [အပိုင်း 19.17](https://www.postgresql.org/docs/current/runtime-config-developer.html) မှာ ဖော်ပြထားပါတယ်။
