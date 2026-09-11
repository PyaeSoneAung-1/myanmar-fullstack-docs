---
title: "Function Security (function လုံခြုံရေး)"
description: "Functions, triggers နှင့် row-level security policies များမှတစ်ဆင့် users များ backend server ထဲ code ထည့်သွင်း၍ အခြားသူများကို Trojan horse ပြုလုပ်နိုင်သည့် အန္တရာယ်နှင့် ကာကွယ်ရန် နည်းလမ်းများ — untrusted languages များဖြင့် function များ ဖန်တီးခြင်းကို superusers များသာ ခွင့်ပြုခြင်း အကြောင်း"
order: 195
source: "https://www.postgresql.org/docs/current/perm-functions.html"
status: translated
updated: 2026-09-06
---

## 21.6. Function Security (function လုံခြုံရေး)

Functions တွေ၊ triggers တွေနဲ့ row-level security policies တွေက — users တွေကို backend server ထဲကို code တွေ ထည့်သွင်းခွင့် ပြုပါတယ် — အဲဒီ code တွေကို တခြား users တွေက မရည်ရွယ်ဘဲ execute လုပ်မိနိုင်ပါတယ်။ ဒါကြောင့် — ဒီ mechanism တွေက users တွေကို — တခြားသူတွေအပေါ် “Trojan horse” (လှည့်ဖြားသည့် code ထည့်သွင်းမှု) တွေကို အတော်လေး လွယ်ကူစွာ ပြုလုပ်ခွင့် ပေးပါတယ်။ အခိုင်မာဆုံး အကာအကွယ်ကတော့ — objects တွေကို ဘယ်သူတွေ သတ်မှတ် (define) လုပ်နိုင်လဲဆိုတာကို တင်းကျပ်စွာ ထိန်းချုပ်ထားခြင်းပါ။ အဲဒါ မဖြစ်နိုင်တဲ့ နေရာမှာတော့ — ယုံကြည်ရတဲ့ owners (trusted owners) တွေ ပိုင်ဆိုင်တဲ့ objects တွေကိုပဲ ရည်ညွှန်းတဲ့ queries တွေကို ရေးပါ။ ယုံကြည်မှု မရှိတဲ့ (untrusted) users တွေကို objects ဖန်တီးခွင့် ပြုတဲ့ schemas တွေကို `search_path` ကနေ ဖယ်ရှားပါ။

Functions တွေက — backend server process အတွင်းမှာ — database server daemon ရဲ့ operating system permissions တွေနဲ့ run ပါတယ်။ Function အတွက် သုံးတဲ့ programming language က — စစ်ဆေးမှု မရှိတဲ့ (unchecked) memory accesses တွေကို ခွင့်ပြုမယ်ဆိုရင် — server ရဲ့ အတွင်းပိုင်း data structures တွေကို ပြောင်းလဲဖို့ ဖြစ်နိုင်ပါတယ်။ ဒါကြောင့် — အခြား ကိစ္စရပ် အများအပြားတို့တွင် — ဒီလို functions တွေက system access controls တွေ အားလုံးကို ကျော်လွှားနိုင်ပါတယ်။ ဒီလို access တွေကို ခွင့်ပြုတဲ့ function languages တွေကို “untrusted” (ယုံကြည်မှု မရှိသော) အဖြစ် သတ်မှတ်ပြီး — PostgreSQL က အဲဒီ languages တွေနဲ့ ရေးထားတဲ့ functions တွေကို — superusers တွေပဲ ဖန်တီးခွင့် ပြုပါတယ်။
