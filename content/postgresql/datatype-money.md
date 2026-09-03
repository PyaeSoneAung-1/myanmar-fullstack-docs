---
title: "Monetary Types (ငွေကြေး type များ)"
description: "PostgreSQL ရဲ့ money type — ငွေကြေး ပမာဏ သိမ်းဆည်းမှု; locale အလိုက် input/output ပြောင်းလဲခြင်း နှင့် rounding (ပတ်ဖြတ်ခြင်း)"
order: 49
source: "https://www.postgresql.org/docs/current/datatype-money.html"
status: translated
updated: 2026-09-03
---

## 8.2. Monetary Types (ငွေကြေး type များ)

`money` type က — ပုံသေ ဒသမ ဂဏန်း အရေအတွက် (fixed fractional precision) ရှိတဲ့ ငွေကြေး ပမာဏ (currency amount) တစ်ခုကို သိမ်းဆည်းပေးပါတယ်; [ဇယား 8.3](/docs/postgresql/datatype-money) ကို ကြည့်ပါ။ ဒသမ ဂဏန်း အရေအတွက်ကို database ရဲ့ [lc_monetary](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-MONETARY) setting က ဆုံးဖြတ်ပါတယ်။ ဇယားထဲမှာ ပြထားတဲ့ range (အကွာအဝေး) က ဒသမ ဂဏန်း နှစ်လုံး ရှိတယ်လို့ ယူဆထားတာပါ။ Input ကို — integer နဲ့ floating-point literal တွေ အပြင် — `'$1,000.00'` လို သာမန် ငွေကြေး ပုံစံချမှု (currency formatting) အပါအဝင် — ပုံစံ အမျိုးမျိုးနဲ့ လက်ခံပါတယ်။ Output ကတော့ ယေဘုယျအားဖြင့် ဒီနောက်ဆုံး ပုံစံမျိုးနဲ့ ထွက်ပေမယ့် — locale (ဒေသဆိုင်ရာ သတ်မှတ်ချက်) အပေါ်မှာ မူတည်ပါတယ်။

**ဇယား 8.3. Monetary Types (ငွေကြေး type များ)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် | Range (အကွာအဝေး) |
| --- | --- | --- | --- |
| `money` | 8 bytes | ငွေကြေး ပမာဏ | -92233720368547758.08 မှ +92233720368547758.07 |

ဒီ data type ရဲ့ output က locale အပေါ် မူတည်တဲ့ (locale-sensitive) ဖြစ်လို့ — `lc_monetary` setting မတူညီတဲ့ database တစ်ခုထဲကို `money` data တွေ load (တင်) လုပ်တာက အလုပ် မဖြစ်နိုင်ပါဘူး။ ပြဿနာတွေ ရှောင်ဖို့ — dump (database မိတ္တူ) တစ်ခုကို database အသစ် တစ်ခုထဲ restore (ပြန်သွင်း) မလုပ်ခင် — `lc_monetary` ရဲ့ တန်ဖိုးက dump လုပ်ခဲ့တဲ့ database ထဲက တန်ဖိုးနဲ့ တူညီသော သို့မဟုတ် ညီမျှသော (equivalent) တန်ဖိုး ဖြစ်မဖြစ် သေချာ စစ်ဆေးပါ။

`numeric`, `int` နဲ့ `bigint` data types တွေရဲ့ တန်ဖိုးတွေကို `money` အဖြစ် cast (type ပြောင်းခြင်း) လုပ်လို့ ရပါတယ်။ `real` နဲ့ `double precision` data types တွေကနေ ပြောင်းချင်ရင်တော့ — အရင်ဆုံး `numeric` အဖြစ် cast ပြီးမှ ပြောင်းလို့ ရပါတယ်၊ ဥပမာ:

```sql
SELECT '12.34'::float8::numeric::money;
```

ဒါပေမယ့် — ဒီနည်းကို အကြံ မပြုပါဘူး။ Floating point ဂဏန်းတွေက rounding error (ပတ်ဖြတ်ချိန် ကွာလွဲမှု) ဖြစ်နိုင်ခြေ ရှိလို့ — ငွေကြေး ကိုင်တွယ်ရာမှာ သုံးစရာ မသင့်ပါဘူး။

`money` တန်ဖိုး တစ်ခုကို precision (တိကျမှု) မဆုံးရှုံးဘဲ `numeric` အဖြစ် cast လုပ်လို့ ရပါတယ်။ တခြား type တွေအဖြစ် ပြောင်းတာကတော့ precision ဆုံးရှုံးနိုင်ပြီး — အဆင့် နှစ်ဆင့် ခွဲပြီးလည်း လုပ်ရပါတယ်:

```sql
SELECT '52093.89'::money::numeric::float8;
```

`money` တန်ဖိုး တစ်ခုကို integer တန်ဖိုး တစ်ခုနဲ့ စားတဲ့အခါ — ဒသမ အပိုင်းကို သုညဘက်ဆီ ဖြတ်တောက် (truncate) ပြီး စားပါတယ်။ Round လုပ်ထားတဲ့ ရလဒ် ရချင်ရင် — floating-point တန်ဖိုး တစ်ခုနဲ့ စားပါ၊ ဒါမှမဟုတ် `money` တန်ဖိုးကို မစားခင် `numeric` အဖြစ် cast ပြီး — စားပြီးမှ `money` အဖြစ် ပြန် cast ပါ။ (နောက်နည်းက precision ဆုံးရှုံးမှု အန္တရာယ် ရှောင်ဖို့ ပိုပြီး သင့်တော်ပါတယ်။) `money` တန်ဖိုး တစ်ခုကို နောက် `money` တန်ဖိုး တစ်ခုနဲ့ စားတဲ့အခါ — ရလဒ်က `double precision` ဖြစ်ပါတယ် (ဆိုလိုတာက — ငွေကြေး မဟုတ်ဘဲ စင်ကြယ်တဲ့ ဂဏန်း တစ်ခု); စားလိုက်တဲ့အခါ ငွေကြေး ယူနစ်တွေက တစ်ခုနဲ့တစ်ခု ပျက်ပြယ် (cancel) သွားလို့ပါ။
