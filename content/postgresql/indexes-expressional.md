---
title: "Indexes on Expressions (expression ပေါ်မှာ index များ)"
description: "Index column က column တစ်ခု သက်သက် မဟုတ်ဘဲ function ဒါမှမဟုတ် scalar expression ရဲ့ ရလဒ်ပေါ်မှာလည်း ဖန်တီးနိုင်ပုံ — case-insensitive ရှာဖွေမှုတွေအတွက် lower(col1) လို expression index သုံးပုံ၊ UNIQUE expression index နဲ့ constraint ချမှတ်နိုင်ပုံနဲ့ expression index ရဲ့ ထိန်းသိမ်းမှု စရိတ် သဘောတရား"
order: 80
source: "https://www.postgresql.org/docs/current/indexes-expressional.html"
status: translated
updated: 2026-09-03
---

## 11.7. Indexes on Expressions (expression ပေါ်မှာ index များ)

Index column ဆိုတာ အောက်ခံ table ရဲ့ column တစ်ခု သက်သက် ဖြစ်စရာ မလိုပါဘူး — table ထဲက column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကနေ တွက်ချက်ယူထားတဲ့ function ဒါမှမဟုတ် scalar expression တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ ဒီ feature က တွက်ချက်မှုတွေရဲ့ ရလဒ်တွေကို အခြေခံပြီး table တွေဆီ မြန်မြန်ဆန်ဆန် ဝင်ရောက်နိုင်ဖို့အတွက် အသုံးဝင်ပါတယ်။

ဥပမာ — case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိတဲ့) နှိုင်းယှဉ်မှုတွေ ပြုလုပ်ဖို့ ပုံမှန် သုံးလေ့ရှိတဲ့ နည်းလမ်းတစ်ခုကတော့ `lower` function ကို သုံးခြင်းပဲ ဖြစ်ပါတယ်:

```sql
SELECT * FROM test1 WHERE lower(col1) = 'value';
```

ဒီ query က — `lower(col1)` function ရဲ့ ရလဒ်ပေါ်မှာ index တစ်ခု သတ်မှတ်ထားမယ်ဆိုရင် — အဲဒီ index ကို သုံးနိုင်ပါတယ်:

```sql
CREATE INDEX test1_lower_col1_idx ON test1 (lower(col1));
```

ဒီ index ကို `UNIQUE` လို့ ကြေညာထားမယ်ဆိုရင် — `col1` တန်ဖိုးတွေ case ချည်းပဲ ကွဲပြားနေတဲ့ row တွေရော၊ `col1` တန်ဖိုးတွေ တကယ်ကို တူညီနေတဲ့ row တွေပါ ဖန်တီးလို့ မရအောင် တားဆီးပေးပါလိမ့်မယ်။ ဒါကြောင့် expression ပေါ်က index တွေကို — ရိုးရိုး unique constraint အနေနဲ့ သတ်မှတ်လို့ မရတဲ့ constraint တွေကို အတင်းအကျပ် လိုက်နာစေဖို့အတွက်လည်း သုံးနိုင်ပါတယ်။

နောက်ထပ် ဥပမာတစ်ခုအနေနဲ့ — ဒီလိုပုံစံ query တွေကို မကြာခဏ လုပ်နေရတယ်ဆိုရင်:

```sql
SELECT * FROM people WHERE (first_name || ' ' || last_name) = 'John Smith';
```

ဒါဆိုရင် ဒီလို index တစ်ခု ဖန်တီးထားတာ တန်ဖိုးရှိပါလိမ့်မယ်:

```sql
CREATE INDEX people_names ON people ((first_name || ' ' || last_name));
```

`CREATE INDEX` command ရဲ့ syntax က ပုံမှန်အားဖြင့် — index expression တွေကို ဒုတိယ ဥပမာမှာ ပြထားသလို — parentheses တွေနဲ့ ဝန်းရံပြီး ရေးဖို့ လိုအပ်ပါတယ်။ Expression က function call တစ်ခု သက်သက် ဖြစ်နေရင်တော့ — ပထမ ဥပမာမှာ ရှိသလို — parentheses တွေကို ချန်လိုက်လို့ ရပါတယ်။

Index expression တွေက ထိန်းသိမ်းဖို့ (maintain လုပ်ဖို့) အတော်လေး စရိတ်ကြီးပါတယ် — အကြောင်းကတော့ row တစ်ခုချင်းစီ ထည့်သွင်းမှု (insertion) တိုင်းနဲ့ [non-HOT update](https://www.postgresql.org/docs/current/storage-hot.html) တိုင်းမှာ derived expression (ဆင်းသက်လာသော expression) တွေကို တွက်ချက်ပေးရလို့ ဖြစ်ပါတယ်။ ဒါပေမယ့် — index expression တွေက index သုံးပြီး ရှာဖွေမှု (indexed search) လုပ်တဲ့အခါမှာတော့ ပြန်လည် တွက်ချက်ခြင်း မရှိပါဘူး — အကြောင်းကတော့ သူတို့ကို index ထဲမှာ သိမ်းဆည်းထားပြီးသား ဖြစ်လို့ပါ။ အထက်က ဥပမာ နှစ်ခုလုံးမှာ — system က query ကို `WHERE indexedcolumn = 'constant'` လို့ပဲ မြင်တာကြောင့် — ရှာဖွေမှုရဲ့ မြန်နှုန်းက တခြား ရိုးရိုး index query တွေနဲ့ တူညီပါတယ်။ ဒါကြောင့် — retrieval (ဒေတာ ပြန်လည်ယူမှု) ရဲ့ မြန်နှုန်းက insertion နဲ့ update ရဲ့ မြန်နှုန်းထက် ပိုအရေးကြီးတဲ့အခါ — expression ပေါ်က index တွေက အသုံးဝင်ပါတယ်။
