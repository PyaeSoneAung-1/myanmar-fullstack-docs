---
title: "Destroying a Database (database တစ်ခုကို ဖျက်ဆီးခြင်း)"
description: "DROP DATABASE command နှင့် dropdb utility သုံးပြီး database များ ဖျက်ဆီးခြင်း — owner သို့မဟုတ် superuser တစ်ဦးသာ ဖျက်နိုင်ခြင်း၊ ဖျက်မှုကို ပြန်ပြင်၍ မရခြင်း၊ ပစ်မှတ် database သို့ connect နေစဉ် မဖျက်နိုင်ခြင်း"
order: 178
source: "https://www.postgresql.org/docs/current/manage-ag-dropdb.html"
status: translated
updated: 2026-09-06
---

## 22.5. Destroying a Database (database တစ်ခုကို ဖျက်ဆီးခြင်း)

Database တွေကို [DROP DATABASE](/docs/postgresql/sql-dropdatabase) command နဲ့ ဖျက်ဆီးပါတယ်:

```sql
DROP DATABASE name;
```

Database ရဲ့ owner (ပိုင်ရှင်) ဒါမှမဟုတ် superuser တစ်ဦးကသာ database တစ်ခုကို drop လုပ်နိုင်ပါတယ်။ Database တစ်ခုကို drop လုပ်တာက — အဲဒီ database အတွင်းမှာ ပါဝင်ခဲ့တဲ့ object တွေ အားလုံးကိုပါ ဖယ်ရှားပါတယ်။ Database တစ်ခုရဲ့ ဖျက်ဆီးမှုကို ပြန်လည် ပြုပြင်လို့ မရပါဘူး။

ပစ်မှတ် (victim) database ဆီ connect လုပ်ထားစဉ်မှာတော့ — `DROP DATABASE` command ကို execute လုပ်လို့ မရပါဘူး။ ဒါပေမယ့် — `template1` database အပါအဝင် — တခြား database ဘယ်ခုကိုမဆို connect လုပ်ထားနိုင်ပါတယ်။ Cluster တစ်ခုရဲ့ နောက်ဆုံး user database ကို drop လုပ်ဖို့ဆိုရင် — `template1` က တစ်ခုတည်းသော ရွေးချယ်စရာ ဖြစ်ပါလိမ့်မယ်။

အဆင်ပြေစေဖို့အတွက် — database တွေကို drop လုပ်ဖို့ [dropdb](https://www.postgresql.org/docs/current/app-dropdb.html) ဆိုတဲ့ shell program တစ်ခုလည်း ရှိပါတယ်:

```sql
dropdb dbname
```

(`createdb` နဲ့ မတူတာက — လက်ရှိ user နာမည်နဲ့ database ကို drop လုပ်တာက default လုပ်ဆောင်ချက် မဟုတ်ပါဘူး။)
