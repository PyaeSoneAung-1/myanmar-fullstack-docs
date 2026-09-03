---
title: "Foreign Data (ပြင်ပ data များ)"
description: "PostgreSQL အပြင်ဘက်မှာ ရှိတဲ့ data တွေကို SQL query နဲ့ ဝင်ရောက်နိုင်အောင် လုပ်ပေးတဲ့ SQL/MED — foreign data wrapper, foreign server, foreign table, user mapping တွေအကြောင်း"
order: 31
source: "https://www.postgresql.org/docs/current/ddl-foreign-data.html"
status: translated
updated: 2026-09-03
---

## 5.13. Foreign Data (ပြင်ပ data များ)

PostgreSQL က SQL/MED specification ရဲ့ အစိတ်အပိုင်း တချို့ကို အကောင်အထည် ဖော်ထားပါတယ် — ဒါကြောင့် PostgreSQL အပြင်ဘက်မှာ ရှိနေတဲ့ data တွေကို သာမန် SQL query တွေနဲ့ပဲ ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်။ ဒီလို data တွေကို *foreign data* (ပြင်ပ data) လို့ ခေါ်ပါတယ်။ (ဒီအသုံးအနှုန်းက database အတွင်းက constraint အမျိုးအစား တစ်ခုဖြစ်တဲ့ foreign keys နဲ့ မရောထွေးဖို့ သတိပြုပါ။)

Foreign data ကို *foreign data wrapper* ရဲ့ အကူအညီနဲ့ ဝင်ရောက်ပါတယ်။ Foreign data wrapper ဆိုတာ — ပြင်ပ data source (ဒေတာ အရင်းအမြစ်) တစ်ခုနဲ့ ဆက်သွယ်နိုင်တဲ့ library တစ်ခု ဖြစ်ပြီး — data source နဲ့ ချိတ်ဆက်ခြင်း နဲ့ အဲဒီကနေ data ရယူခြင်းရဲ့ အသေးစိတ် အချက်အလက်တွေကို ဖုံးကွယ်ပေးပါတယ်။ `contrib` module တွေအနေနဲ့ ရနိုင်တဲ့ foreign data wrapper တချို့လည်း ရှိပါတယ် — [နောက်ဆက်တွဲ F](https://www.postgresql.org/docs/current/contrib.html) ကို ကြည့်ပါ။ တခြား foreign data wrapper အမျိုးအစားတွေကို third-party product တွေအနေနဲ့လည်း တွေ့ရှိနိုင်ပါတယ်။ ရှိပြီးသား foreign data wrapper တွေထဲက တစ်ခုမှ သင့်လိုအပ်ချက်နဲ့ မကိုက်ညီဘူးဆိုရင် — ကိုယ်ပိုင် wrapper တစ်ခုကို ကိုယ်တိုင် ရေးသားနိုင်ပါတယ်; [အခန်း 58](https://www.postgresql.org/docs/current/fdwhandler.html) ကို ကြည့်ပါ။

Foreign data ကို ဝင်ရောက်ဖို့ဆိုရင် — *foreign server* object တစ်ခုကို ဖန်တီးဖို့ လိုပါတယ်။ ဒါက သူ့ကို ထောက်ပံ့တဲ့ foreign data wrapper က သုံးတဲ့ option အစုအဝေးအတိုင်း — သတ်မှတ်ထားတဲ့ ပြင်ပ data source တစ်ခုနဲ့ ဘယ်လို ချိတ်ဆက်ရမလဲဆိုတာကို သတ်မှတ်ပေးပါတယ်။ ပြီးရင် — အဝေးက (remote) data ရဲ့ တည်ဆောက်ပုံကို သတ်မှတ်ပေးတဲ့ *foreign table* တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတာကို ဖန်တီးဖို့ လိုပါတယ်။ Foreign table ကို သာမန် table တစ်ခုလိုပဲ query တွေမှာ သုံးလို့ရပါတယ် — ဒါပေမယ့် foreign table မှာ PostgreSQL server ထဲမှာ storage (သိုလှောင်မှု) မရှိပါဘူး။ သူ့ကို သုံးတိုင်း — PostgreSQL က foreign data wrapper ကို ပြင်ပ source ကနေ data ယူဆောင်ဖို့ ဒါမှမဟုတ် — update command တွေရဲ့ အခြေအနေမှာဆိုရင် — ပြင်ပ source ဆီကို data ပို့ဆောင်ဖို့ တောင်းဆိုပါတယ်။

အဝေးက data ကို ဝင်ရောက်တဲ့အခါ — ပြင်ပ data source ဆီမှာ authentication (ခွင့်ပြုချက် စစ်ဆေးခြင်း) လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။ ဒီအချက်အလက်ကို *user mapping* ကနေ ထောက်ပံ့ပေးနိုင်ပါတယ် — လက်ရှိ PostgreSQL role ပေါ် မူတည်ပြီး user name တွေ၊ password တွေလို အပိုအချက်အလက်တွေကို ပေးနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [CREATE FOREIGN DATA WRAPPER](https://www.postgresql.org/docs/current/sql-createforeigndatawrapper.html), [CREATE SERVER](https://www.postgresql.org/docs/current/sql-createserver.html), [CREATE USER MAPPING](https://www.postgresql.org/docs/current/sql-createusermapping.html), [CREATE FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-createforeigntable.html) နဲ့ [IMPORT FOREIGN SCHEMA](https://www.postgresql.org/docs/current/sql-importforeignschema.html) တို့ကို ကြည့်ပါ။
