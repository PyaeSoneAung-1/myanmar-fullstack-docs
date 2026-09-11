---
title: "Database Configuration (database configuration ချိန်ညှိခြင်း)"
description: "ALTER DATABASE ... SET/RESET သုံးပြီး run-time configuration variable များအတွက် database-specific default values (database အလိုက် ပုံမှန် တန်ဖိုးများ) သတ်မှတ်ခြင်း — GEQO optimizer ကို database တစ်ခုအတွက် disable လုပ်ခြင်း ဥပမာ အပါအဝင်"
order: 199
source: "https://www.postgresql.org/docs/current/manage-ag-config.html"
status: translated
updated: 2026-09-06
---

## 22.4. Database Configuration (database configuration ချိန်ညှိခြင်း)

[အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) မှာ ပြန်လည် သတိရစေချင်တာက — PostgreSQL server က run-time configuration variables (လည်ပတ်နေစဉ် ချိန်ညှိနိုင်သော ဖွဲ့စည်းမှု variable များ) အများအပြားကို ပံ့ပိုးပေးပါတယ်။ ဒီ settings (ချိန်ညှိချက်များ) တွေထဲက အများအပြားအတွက် — database တစ်ခုချင်းစီ အလိုက် (database-specific) ပုံမှန် တန်ဖိုး (default value) တွေကို သင်သတ်မှတ်နိုင်ပါတယ်။

ဥပမာ — တစ်စုံတစ်ရာ အကြောင်းကြောင့် ပေးထားတဲ့ database တစ်ခုအတွက် GEQO optimizer (အကောင်းဆုံး query လမ်းကြောင်း ရှာဖွေပေးသည့် ကိရိယာ) ကို disable (ပိတ်ထား) လုပ်ချင်တယ်ဆိုရင် — ပုံမှန်အားဖြင့် database အားလုံးအတွက် disable လုပ်ရမယ် ဒါမှမဟုတ် — connect လုပ်တဲ့ client တိုင်းက `SET geqo TO off` ကို ဂရုတစိုက် ထုတ်ပြန်ဖို့ သေချာစေရမှာ ဖြစ်ပါတယ်။ ဒီ setting ကို သီးခြား database တစ်ခုအတွင်း default ဖြစ်စေချင်ရင် — အောက်ပါ command ကို execute လုပ်နိုင်ပါတယ်:

```sql
ALTER DATABASE mydb SET geqo TO off;
```

ဒါက setting ကို သိမ်းဆည်းပေးပါလိမ့်မယ် (ချက်ချင်း set လုပ်ပေးတာ မဟုတ်ပါဘူး)။ ဒီ database ဆီ နောက်ပိုင်း connection တွေမှာ — session မစတင်ခင် ခဏမှာ `SET geqo TO off;` ကို execute လုပ်ခဲ့သလိုမျိုး ဖြစ်ပေါ်ပါလိမ့်မယ်။ User တွေက သူတို့ရဲ့ session တွေအတွင်းမှာ ဒီ setting ကို ပြောင်းလဲလို့ ရနေဆဲ ဖြစ်တာ သတိပြုပါ; အဲဒါက default တန်ဖိုးပဲ ဖြစ်ပါတယ်။ ဒီလို setting တစ်ခုခုကို ပြန်ဖျက်သိမ်းဖို့ဆိုရင် — `ALTER DATABASE dbname RESET varname` ကို သုံးပါ။
