---
title: "Authentication Problems (authentication ပြဿနာများ)"
description: "Authentication မအောင်မြင်မှုနှင့် ဆက်စပ် ပြဿနာများ ဖော်ပြလေ့ ရှိသည့် error messages များအကြောင်း — no pg_hba.conf entry, password authentication failed, user/database does not exist စသည့် message များ၏ အဓိပ္ပာယ်နှင့် server log စစ်ဆေးရန် အကြံပြုချက်"
order: 171
source: "https://www.postgresql.org/docs/current/client-authentication-problems.html"
status: translated
updated: 2026-09-06
---

## 20.16. Authentication Problems (authentication ပြဿနာများ)

Authentication မအောင်မြင်မှုတွေနဲ့ ဆက်စပ်တဲ့ ပြဿနာတွေက ယေဘုယျအားဖြင့် အောက်ပါလို error messages (အမှား message များ) တွေကနေတစ်ဆင့် ပေါ်လာတတ်ပါတယ်:

```sql
FATAL:  no pg_hba.conf entry for host "123.123.123.123", user "andym", database "testdb"
```

Server ဆီ ဆက်သွယ်လို့ ရပေမယ့် — server က သင့်နဲ့ စကားပြောချင်စိတ် မရှိဘူးဆိုရင် ရနိုင်ခြေ အများဆုံး message က ဒါပဲ ဖြစ်ပါတယ်။ Message ထဲမှာ ဖော်ပြထားသလို — server က connection request (ချိတ်ဆက်မှု တောင်းဆိုချက်) ကို ငြင်းပယ်လိုက်တာ ဖြစ်ပြီး — အကြောင်းက သူ့ရဲ့ `pg_hba.conf` configuration file ထဲမှာ ကိုက်ညီတဲ့ entry (စာရင်းသွင်းချက်) တစ်ခုကို ရှာမတွေ့လို့ပါ။

```sql
FATAL:  password authentication failed for user "andym"
```

ဒီလို messages တွေက သင် server ဆီ ဆက်သွယ်လို့ ရပြီး — `pg_hba.conf` file ထဲမှာ သတ်မှတ်ထားတဲ့ authorization method (ခွင့်ပြုချက် နည်းလမ်း) ကို မကျော်ဖြတ်နိုင်မချင်း — server က သင့်နဲ့ စကားပြောဖို့ ဆန္ဒ ရှိတယ်ဆိုတာ ညွှန်ပြပါတယ်။ သင်ပေးနေတဲ့ password ကို စစ်ဆေးကြည့်ပါ — ဒါမှမဟုတ် — ပြစ်တင် ညွှန်ပြချက် (complaint) ထဲမှာ အဲဒီ authentication types တွေထဲက တစ်ခုခုကို ဖော်ပြထားရင် — သင့်ရဲ့ Kerberos ဒါမှမဟုတ် ident software တွေကို စစ်ဆေးပါ။

```sql
FATAL:  user "andym" does not exist
```

ညွှန်ပြထားတဲ့ database user name ကို ရှာမတွေ့ပါဘူး။

```sql
FATAL:  database "testdb" does not exist
```

သင်ချိတ်ဆက်ဖို့ ကြိုးစားနေတဲ့ database က မရှိပါဘူး။ Database name တစ်ခုကို သတ်မှတ်မပေးရင် — database user name ကို default အနေနဲ့ သုံးတယ်ဆိုတာ သတိပြုပါ။

> **အကြံပြုချက်:** Server log ထဲမှာ — client ဆီ အစီရင်ခံပေးတာထက် — authentication မအောင်မြင်မှု တစ်ခုအကြောင်း အချက်အလက် ပိုများများ ပါဝင်နိုင်ပါတယ်။ မအောင်မြင်မှုရဲ့ အကြောင်းရင်းကြောင့် ရှုပ်ထွေးနေရင် — server log ကို စစ်ဆေးကြည့်ပါ။
