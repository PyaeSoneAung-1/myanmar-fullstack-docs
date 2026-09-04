---
title: "Window Functions (Window လုပ်ဆောင်ချက်များ)"
description: "PostgreSQL ၏ built-in window functions များအကြောင်း — row_number, rank, dense_rank, percent_rank, cume_dist, ntile, lag, lead, first_value, last_value, nth_value စာရင်းနှင့် OVER clause, window frame, peer သဘောတရားများ"
order: 89
source: "https://www.postgresql.org/docs/current/functions-window.html"
status: translated
updated: 2026-09-04
---

## 9.22. Window Functions (Window လုပ်ဆောင်ချက်များ)

*Window functions* (window လုပ်ဆောင်ချက်များ) တွေက — လက်ရှိ query row နဲ့ တစ်နည်းနည်းနဲ့ ဆက်စပ်နေတဲ့ row အစုတွေအပေါ်မှာ တွက်ချက်မှုတွေ လုပ်ဆောင်နိုင်စွမ်းကို ပေးပါတယ်။ ဒီ feature အကြောင်း နိဒါန်းအတွက် [အပိုင်း 3.5](/docs/postgresql/window-functions) ကို လည်းကောင်း — syntax အသေးစိတ်အတွက် [အပိုင်း 4.2.8](/docs/postgresql/sql-expressions) ကို လည်းကောင်း ကြည့်ရှုပါ။

Built-in window functions တွေကို ဇယား 9.67 မှာ စာရင်းပြုထားပါတယ်။ ဒီ function တွေကို window function syntax နဲ့သာ ခေါ်ယူရမယ်ဆိုတာ သတိပြုပါ — ဆိုလိုတာက `OVER` clause တစ်ခု မဖြစ်မနေ လိုအပ်ပါတယ်။

ဒီ function တွေအပြင် — built-in ဖြစ်စေ user-defined ဖြစ်စေ — သာမန် aggregate (ဆိုလိုတာက ordered-set သို့မဟုတ် hypothetical-set aggregate မဟုတ်တဲ့) တစ်ခုခုကိုလည်း window function အဖြစ် သုံးနိုင်ပါတယ်; built-in aggregates စာရင်းအတွက် [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) ကို ကြည့်ရှုပါ။ Aggregate functions တွေက — ခေါ်ယူမှုရဲ့ နောက်မှာ `OVER` clause တစ်ခု လိုက်ပါမှသာ — window functions အဖြစ် ဆောင်ရွက်ပါတယ်; မဟုတ်ရင် — သာမန် aggregates အဖြစ် ဆောင်ရွက်ပြီး — set တစ်ခုလုံးအတွက် row တစ်ခုတည်းကို ပြန်ပေးပါတယ်။

**ဇယား 9.67. General-Purpose Window Functions (အထွေထွေ သုံးနိုင်သော window လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| row_number () → bigint partition အတွင်းက လက်ရှိ row ရဲ့ နံပါတ်စဉ်ကို — 1 ကနေ စရေတွက်ပြီး — ပြန်ပေးပါတယ်။ |
| rank () → bigint လက်ရှိ row ရဲ့ rank ကို — gap (ကွာဟချက်) တွေနဲ့အတူ — ပြန်ပေးပါတယ်; ဆိုလိုတာက — သူ့ရဲ့ peer group ထဲက ပထမဆုံး row ရဲ့ row_number ဖြစ်ပါတယ်။ |
| dense_rank () → bigint လက်ရှိ row ရဲ့ rank ကို — gap မရှိဘဲ — ပြန်ပေးပါတယ်; ဒီ function က peer groups တွေကို ရေတွက်တာနဲ့ ညီမျှပါတယ်။ |
| percent_rank () → double precision လက်ရှိ row ရဲ့ relative rank (နှိုင်းရ rank) ကို ပြန်ပေးပါတယ် — ဆိုလိုတာက (rank - 1) / (total partition rows - 1) ဖြစ်ပါတယ်။ ဒါကြောင့် တန်ဖိုးက 0 ကနေ 1 အထိ — နှစ်ဖက်စလုံး အပါအဝင် — ရှိနိုင်ပါတယ်။ |
| cume_dist () → double precision cumulative distribution (စုစည်း ဖြန့်ဝေမှု) ကို ပြန်ပေးပါတယ် — ဆိုလိုတာက (number of partition rows preceding or peers with current row) / (total partition rows) ဖြစ်ပါတယ်။ ဒါကြောင့် တန်ဖိုးက 1/N ကနေ 1 အထိ ရှိနိုင်ပါတယ်။ |
| ntile ( num_buckets integer ) → integer partition ကို တတ်နိုင်သမျှ အညီအမျှ ပိုင်းခြားပြီး — 1 ကနေ argument တန်ဖိုးအထိ ရှိတဲ့ integer တစ်ခုကို ပြန်ပေးပါတယ်။ |
| lag ( value anycompatible [, offset integer [, default anycompatible ]] ) → anycompatible partition အတွင်းမှာ လက်ရှိ row ရဲ့ ရှေ့ဘက် offset rows အကွာက row မှာ အကဲဖြတ်ထားတဲ့ value ကို ပြန်ပေးပါတယ်; အဲဒီလို row မရှိရင်တော့ — `value` နဲ့ type လိုက်ဖက်ရမယ့် — `default` ကို အစားထိုး ပြန်ပေးပါတယ်။ `offset` ရော `default` ရော နှစ်ခုလုံးကို လက်ရှိ row နဲ့ ဆက်စပ်၍ အကဲဖြတ်ပါတယ်။ ချန်လိုက်ရင် `offset` က 1 ဖြစ်ပြီး — `default` က NULL ဖြစ်ပါတယ်။ |
| lead ( value anycompatible [, offset integer [, default anycompatible ]] ) → anycompatible partition အတွင်းမှာ လက်ရှိ row ရဲ့ နောက်ဘက် offset rows အကွာက row မှာ အကဲဖြတ်ထားတဲ့ value ကို ပြန်ပေးပါတယ်; အဲဒီလို row မရှိရင်တော့ — `value` နဲ့ type လိုက်ဖက်ရမယ့် — `default` ကို အစားထိုး ပြန်ပေးပါတယ်။ `offset` ရော `default` ရော နှစ်ခုလုံးကို လက်ရှိ row နဲ့ ဆက်စပ်၍ အကဲဖြတ်ပါတယ်။ ချန်လိုက်ရင် `offset` က 1 ဖြစ်ပြီး — `default` က NULL ဖြစ်ပါတယ်။ |
| first_value ( value anyelement ) → anyelement window frame ရဲ့ ပထမဆုံး row မှာ အကဲဖြတ်ထားတဲ့ value ကို ပြန်ပေးပါတယ်။ |
| last_value ( value anyelement ) → anyelement window frame ရဲ့ နောက်ဆုံး row မှာ အကဲဖြတ်ထားတဲ့ value ကို ပြန်ပေးပါတယ်။ |
| nth_value ( value anyelement, n integer ) → anyelement window frame ရဲ့ n မြောက် row (1 ကနေ စရေတွက်) မှာ အကဲဖြတ်ထားတဲ့ value ကို ပြန်ပေးပါတယ်; အဲဒီလို row မရှိရင် NULL ကို ပြန်ပေးပါတယ်။ |

ဇယား 9.67 မှာ စာရင်းပြုထားတဲ့ function တွေ အားလုံးက — ဆက်စပ်နေတဲ့ window definition ရဲ့ `ORDER BY` clause က သတ်မှတ်ပေးတဲ့ sort ordering (စီစဉ်မှု အစဉ်) အပေါ်မှာ မူတည်ပါတယ်။ `ORDER BY` column တွေကိုပဲ ထည့်သွင်း စဉ်းစားတဲ့အခါ — တစ်ခုနဲ့တစ်ခု ခွဲခြားလို့ မရတဲ့ row တွေကို *peers* (တန်းတူ row များ) လို့ ခေါ်ပါတယ်။ Ranking function လေးခု (`cume_dist` အပါအဝင်) ကို — peer group တစ်ခုထဲက row တွေ အားလုံးအတွက် အဖြေ အတူတူပဲ ပေးနိုင်အောင် — သတ်မှတ်ထားပါတယ်။

`first_value`, `last_value` နဲ့ `nth_value` တွေက “window frame” အတွင်းက row တွေကိုပဲ ထည့်သွင်း စဉ်းစားတာကို သတိပြုပါ — default အရ window frame မှာ partition ရဲ့ အစကနေ လက်ရှိ row ရဲ့ နောက်ဆုံး peer အထိ row တွေ ပါဝင်ပါတယ်။ ဒါက `last_value` အတွက် — တစ်ခါတစ်ရံ `nth_value` အတွက်ပါ — အသုံးမဝင်တဲ့ ရလဒ်တွေ ထွက်နိုင်ခြေ ရှိပါတယ်။ `OVER` clause ထဲမှာ သင့်လျော်တဲ့ frame specification (`RANGE`, `ROWS` သို့မဟုတ် `GROUPS`) တစ်ခု ထည့်သွင်းပြီး frame ကို ပြန်လည် သတ်မှတ်နိုင်ပါတယ်။ Frame specification တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 4.2.8](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ။

Aggregate function တစ်ခုကို window function အဖြစ် သုံးတဲ့အခါ — လက်ရှိ row ရဲ့ window frame အတွင်းက row တွေအပေါ်မှာ aggregate လုပ်ပါတယ်။ `ORDER BY` နဲ့အတူ — default window frame definition ကို သုံးထားတဲ့ aggregate တစ်ခုက “running sum” (ဆက်တိုက် ပေါင်းလဒ်) ပုံစံ အပြုအမူမျိုး ထုတ်ပေးပါတယ် — ဒါက လိုချင်တဲ့ ရလဒ်မျိုး ဖြစ်လည်း ဖြစ်နိုင်သလို — မဖြစ်လည်း ဖြစ်နိုင်ပါတယ်။ Partition တစ်ခုလုံးအပေါ် aggregation ရဖို့ဆိုရင် — `ORDER BY` ကို ချန်လိုက်ပါ၊ ဒါမှမဟုတ် `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` ကို သုံးပါ။ တခြား ရလဒ်တွေ ရဖို့ frame specifications တခြားပုံစံတွေကိုလည်း သုံးနိုင်ပါတယ်။

> **မှတ်ချက်:** SQL standard က `lead`, `lag`, `first_value`, `last_value` နဲ့ `nth_value` တို့အတွက် `RESPECT NULLS` သို့မဟုတ် `IGNORE NULLS` option တစ်ခုကို သတ်မှတ်ထားပါတယ်။ ဒါကို PostgreSQL မှာတော့ implement မလုပ်ထားပါဘူး: အပြုအမူက standard ရဲ့ default ဖြစ်တဲ့ `RESPECT NULLS` အတိုင်းပဲ အမြဲ ဖြစ်နေပါတယ်။ အလားတူပဲ — `nth_value` အတွက် standard ရဲ့ `FROM FIRST` သို့မဟုတ် `FROM LAST` option ကိုလည်း implement မလုပ်ထားပါဘူး: default ဖြစ်တဲ့ `FROM FIRST` အပြုအမူကိုပဲ ထောက်ပံ့ပါတယ်။ (`ORDER BY` ordering ကို ပြောင်းပြန်လှန်ပြီး `FROM LAST` ရဲ့ ရလဒ်ကို ရယူနိုင်ပါတယ်။)
