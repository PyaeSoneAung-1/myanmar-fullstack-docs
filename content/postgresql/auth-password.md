---
title: "Password Authentication (စကားဝှက်ဖြင့် စစ်ဆေး အတည်ပြုခြင်း)"
description: "Password အခြေပြု authentication methods များ — scram-sha-256, md5 နဲ့ password — တို့၏ လုပ်ဆောင်ပုံ၊ user စကားဝှက်များ server တွင် encrypt/သိမ်းဆည်းပုံပေါ် မူတည်သော ရရှိနိုင်မှု နှင့် md5 မှ scram-sha-256 သို့ ပြောင်းရွှေ့နည်း"
order: 178
source: "https://www.postgresql.org/docs/current/auth-password.html"
status: translated
updated: 2026-09-06
---

## 20.5. Password Authentication (စကားဝှက်ဖြင့် စစ်ဆေး အတည်ပြုခြင်း)

Password အခြေပြု authentication method (စကားဝှက်အခြေပြု စစ်ဆေး အတည်ပြုနည်းလမ်း) အများအပြား ရှိပါတယ်။ ဒီ method တွေက လုပ်ဆောင်ပုံ ဆင်တူပေမယ့် — user တွေရဲ့ စကားဝှက်တွေကို server ပေါ်မှာ ဘယ်လို သိမ်းဆည်းထားလဲ ဆိုတာနဲ့ — client တစ်ခုက ပေးပို့လိုက်တဲ့ စကားဝှက်ကို connection (ချိတ်ဆက်မှု) တစ်လျှောက် ဘယ်လို ပို့ပေးလဲ ဆိုတာတွေမှာတော့ ကွာခြားပါတယ်။

- **scram-sha-256** — scram-sha-256 method က RFC 7677 မှာ ဖော်ပြထားတဲ့အတိုင်း SCRAM-SHA-256 authentication ကို လုပ်ဆောင်ပါတယ်။ ဒါက challenge-response (စိန်ခေါ်မှု-တုံ့ပြန်မှု) စနစ် တစ်မျိုး ဖြစ်ပြီး — ယုံကြည်စိတ်ချရမှု မရှိတဲ့ connection တွေပေါ်မှာ password sniffing (စကားဝှက် ခိုးကြည့်ခြင်း) ကို တားဆီးပေးကာ — server ပေါ်မှာ စကားဝှက်တွေကို လုံခြုံတယ်လို့ ယူဆရတဲ့ cryptographic နည်းဖြင့် hash ပြုလုပ်ထားတဲ့ ပုံစံနဲ့ သိမ်းဆည်းတာကိုလည်း ထောက်ပံ့ပါတယ်။

  ဒါက လောလောဆယ် ပံ့ပိုးပေးထားတဲ့ method တွေထဲမှာ အလုံခြုံဆုံး ဖြစ်ပါတယ် — ဒါပေမယ့် — client library အဟောင်းတွေကတော့ မထောက်ပံ့ပါဘူး။
- **md5** — md5 method က စိတ်ကြိုက် ပြုလုပ်ထားတဲ့ လုံခြုံမှု နည်းပါးတဲ့ challenge-response ယန္တရား တစ်ခုကို သုံးပါတယ်။ ဒါက password sniffing ကို တားဆီးပေးပြီး — server ပေါ်မှာ စကားဝှက်တွေကို plain text (ရိုးရိုး စာသားပုံစံ) နဲ့ သိမ်းဆည်းတာကိုလည်း ရှောင်ကြဉ်ပေးပါတယ် — ဒါပေမယ့် — တိုက်ခိုက်သူ (attacker) တစ်ယောက်က server ပေါ်က password hash ကို ခိုးယူနိုင်ခဲ့ရင်တော့ ဘာအကာအကွယ်မှ မပေးပါဘူး။ ဒါ့အပြင် MD5 hash algorithm ကို ယနေ့ခေတ်မှာ ဇွဲမလျှော့ဘဲ ဆောင်ရွက်တဲ့ (determined) တိုက်ခိုက်မှုတွေကို ခံနိုင်ရည် ရှိတယ်လို့လည်း မယူဆတော့ပါဘူး။

  md5 method ကနေ SCRAM method အသစ်ဆီ ကူးပြောင်းတာ လွယ်ကူစေဖို့ — `pg_hba.conf` မှာ method အဖြစ် md5 ကို သတ်မှတ်ထားပေမယ့် — server ပေါ်က user ရဲ့ စကားဝှက်ကို SCRAM အတွက် encrypt လုပ်ထားရင် (အောက်မှာ ကြည့်ပါ) — SCRAM အခြေပြု authentication ကို အလိုအလျောက် ရွေးချယ် သုံးစွဲမှာ ဖြစ်ပါတယ်။

> **သတိပေးချက်:** MD5 နဲ့ encrypt လုပ်ထားတဲ့ စကားဝှက်တွေအတွက် ပံ့ပိုးမှုက deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) ဖြစ်ပြီး — PostgreSQL ရဲ့ နောင် release (ထုတ်ပြန်မှု) တစ်ခုမှာ ဖယ်ရှားခံရမှာ ဖြစ်ပါတယ်။ တခြား စကားဝှက် အမျိုးအစား တစ်ခုဆီ ပြောင်းရွှေ့ခြင်းအတွက် အသေးစိတ်ကို အောက်က စာသားမှာ ကြည့်ပါ။
- **password** — password method က စကားဝှက်ကို clear-text (ကုဒ်ဝှက်မထားသော ရိုးရိုး စာသား) ပုံစံနဲ့ ပို့ပေးလို့ — password “sniffing” (စကားဝှက် ခိုးကြည့်ခြင်း) တိုက်ခိုက်မှုတွေကို ခံနိုင်ရည် အားနည်းပါတယ်။ ဖြစ်နိုင်ရင် ဒါကို အမြဲတမ်း ရှောင်ကြဉ်သင့်ပါတယ်။ ဒါပေမယ့် connection ကို SSL encryption နဲ့ ကာကွယ်ထားရင်တော့ password ကို လုံခြုံစွာ သုံးနိုင်ပါတယ်။ (SSL ကို အားထားပြီး သုံးမယ်ဆိုရင် SSL certificate authentication က ပိုကောင်းတဲ့ ရွေးချယ်မှု ဖြစ်နိုင်ပေမယ့်)။

PostgreSQL database ရဲ့ စကားဝှက်တွေက operating system user တွေရဲ့ စကားဝှက်တွေနဲ့ သီးခြား ဖြစ်ပါတယ်။ Database user တစ်ဦးချင်းစီရဲ့ စကားဝှက်ကို `pg_authid` system catalog (စနစ် catalog) ထဲမှာ သိမ်းဆည်းထားပါတယ်။ စကားဝှက်တွေကို [CREATE ROLE](/docs/postgresql/sql-createrole) နဲ့ [ALTER ROLE](/docs/postgresql/sql-alterrole) ဆိုတဲ့ SQL commands တွေနဲ့ စီမံခန့်ခွဲနိုင်ပါတယ် — ဥပမာ — **CREATE ROLE foo WITH LOGIN PASSWORD 'secret'** ဒါမှမဟုတ် psql ရဲ့ `\password` command နဲ့ ဖြစ်ပါတယ်။ User တစ်ယောက်အတွက် စကားဝှက် သတ်မှတ်မထားဘူးဆိုရင် — သိမ်းဆည်းထားတဲ့ စကားဝှက်က null ဖြစ်ပြီး — အဲဒီ user အတွက် password authentication က အမြဲတမ်း မအောင်မြင်ပါဘူး။

Password အခြေပြု authentication method အမျိုးမျိုးရဲ့ ရရှိနိုင်မှုက — server ပေါ်မှာ user တစ်ယောက်ရဲ့ စကားဝှက်ကို ဘယ်လို encrypt လုပ်ထားလဲ (ပိုတိကျပြောရရင် hash လုပ်ထားလဲ) ဆိုတာအပေါ် မူတည်ပါတယ်။ ဒါကို စကားဝှက် သတ်မှတ်တဲ့ အချိန်မှာ [password_encryption](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-PASSWORD-ENCRYPTION) configuration parameter က ထိန်းချုပ်ပါတယ်။ စကားဝှက် တစ်ခုကို `scram-sha-256` setting နဲ့ encrypt လုပ်ထားရင် — `scram-sha-256` နဲ့ `password` ဆိုတဲ့ authentication methods တွေအတွက် သုံးလို့ ရပါတယ် (နောက်ဆုံး တစ်ခုမှာတော့ စကားဝှက် ပို့လွှတ်မှုက plain text နဲ့ ဖြစ်မှာပါ)။ ဒီကိစ္စမှာ `md5` ဆိုတဲ့ authentication method specification က — အပေါ်မှာ ရှင်းပြခဲ့သလို — `scram-sha-256` method ကို အလိုအလျောက် ပြောင်းသုံးမှာ ဖြစ်လို့ — အလုပ်လုပ်နေဦးမှာပါ။ စကားဝှက် တစ်ခုကို `md5` setting နဲ့ encrypt လုပ်ထားရင်တော့ — `md5` နဲ့ `password` authentication method specifications တွေအတွက်ပဲ သုံးလို့ ရပါတယ် (ဒီမှာလည်း နောက်ဆုံး တစ်ခုမှာ စကားဝှက်ကို plain text နဲ့ ပို့လွှတ်ရမှာ ဖြစ်ပါတယ်)။ (PostgreSQL ရဲ့ အရင် release တွေမှာတော့ စကားဝှက်ကို server ပေါ်မှာ plain text နဲ့ သိမ်းဆည်းတာကို ထောက်ပံ့ခဲ့ပါတယ် — အခုတော့ အဲဒါ မဖြစ်နိုင်တော့ပါဘူး။) လောလောဆယ် သိမ်းဆည်းထားတဲ့ password hash တွေကို စစ်ဆေးဖို့ဆိုရင် — `pg_authid` system catalog ကို ကြည့်ပါ။

လက်ရှိ installation တစ်ခုကို `md5` ကနေ `scram-sha-256` ဆီ upgrade လုပ်ဖို့ဆိုရင် — သုံးနေတဲ့ client library တွေ အားလုံးက SCRAM ကို ထောက်ပံ့နိုင်လောက်အောင် လုံလောက်စွာ အသစ်ဖြစ်ကြောင်း သေချာစေပြီးမှ — `postgresql.conf` ထဲမှာ `password_encryption = 'scram-sha-256'` လို့ သတ်မှတ်ပါ၊ user တွေ အားလုံး စကားဝှက်အသစ်တွေ သတ်မှတ်အောင် လုပ်ပါ၊ ပြီးတော့ `pg_hba.conf` ထဲက authentication method specifications တွေကို `scram-sha-256` အဖြစ် ပြောင်းလဲပါ။
