---
title: "Overview (database စီမံခန့်ခွဲမှု ခြုံငုံ သုံးသပ်ချက်)"
description: "PostgreSQL cluster တစ်ခုအတွင်း object အဆင့်ဆင့် (cluster → database → schema → table) ဖွဲ့စည်းပုံ၊ database-level security ၏ အစိတ်အပိုင်းများ (access control နှင့် authorization control) နှင့် database များ ဖန်တီး/ဖျက်ခြင်း၏ ခြုံငုံ သုံးသပ်ချက်"
order: 174
source: "https://www.postgresql.org/docs/current/manage-ag-overview.html"
status: translated
updated: 2026-09-06
---

## 22.1. Overview (ခြုံငုံ သုံးသပ်ချက်)

Object အနည်းငယ်က — role, database နဲ့ tablespace နာမည်တွေလိုမျိုး — cluster အဆင့်မှာ သတ်မှတ်ပြီး — `pg_global` tablespace ထဲမှာ သိမ်းဆည်းထားပါတယ်။ Cluster တစ်ခုရဲ့ အတွင်းမှာ database အများအပြား ရှိပြီး — ၎င်းတို့ဟာ တစ်ခုနဲ့တစ်ခု သီးခြားခွဲထားပေမယ့် — cluster အဆင့် object တွေကိုတော့ ဝင်ရောက် သုံးစွဲနိုင်ပါတယ်။ Database တစ်ခုချင်းစီရဲ့ အတွင်းမှာ schema အများအပြား ရှိပြီး — အဲဒီ schema တွေထဲမှာ table နဲ့ function လိုမျိုး object တွေ ပါဝင်ပါတယ်။ ဒါကြောင့် အပြည့်အစုံ hierarchy (အဆင့်ဆင့် ဖွဲ့စည်းပုံ) ကတော့ — cluster, database, schema, table (ဒါမှမဟုတ် function လို အခြား object အမျိုးအစား တစ်မျိုးမျိုး) ဖြစ်ပါတယ်။

Database server ဆီ connection လုပ်တဲ့အခါ — client က သူ့ရဲ့ connection request (ချိတ်ဆက်မှု တောင်းဆိုချက်) ထဲမှာ database နာမည်ကို သတ်မှတ်ပေးရပါတယ်။ Connection တစ်ခုနဲ့ database တစ်ခုထက်ပိုပြီး ဝင်ရောက်လို့ မရပါဘူး။ ဒါပေမယ့် — client တွေက database တစ်ခုတည်းဆီ ဖြစ်စေ၊ database အမျိုးမျိုးဆီ ဖြစ်စေ — connection အများအပြား ဖွင့်နိုင်ပါတယ်။ Database-level security (database အဆင့် လုံခြုံရေး) မှာ အစိတ်အပိုင်း နှစ်ခု ပါဝင်ပါတယ်: connection အဆင့်မှာ စီမံခန့်ခွဲတဲ့ access control (ဝင်ရောက်ခွင့် ထိန်းချုပ်မှု — [အပိုင်း 20.1](/docs/postgresql/auth-pg-hba-conf) ကို ကြည့်ပါ) နဲ့ — grant system (privilege ပေးအပ်သည့် စနစ်) ကနေတစ်ဆင့် စီမံခန့်ခွဲတဲ့ authorization control (လုပ်ပိုင်ခွင့် ထိန်းချုပ်မှု — [အပိုင်း 5.8](/docs/postgresql/ddl-priv) ကို ကြည့်ပါ) တို့ ဖြစ်ပါတယ်။ Foreign data wrappers (ပြင်ပ data wrapper များ — [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) ကို ကြည့်ပါ) က database တစ်ခုအတွင်းက object တွေကို — တခြား database ဒါမှမဟုတ် cluster တွေထဲက object တွေအတွက် proxy (ကိုယ်စားလှယ်) အဖြစ် ဆောင်ရွက်ခွင့် ပြုပါတယ်။ အစောပိုင်း dblink module ([dblink](https://www.postgresql.org/docs/current/dblink.html) ကို ကြည့်ပါ) ကလည်း အလားတူ စွမ်းဆောင်ရည် တစ်ခုကို ပေးပါတယ်။ Default အနေနဲ့ — user အားလုံးက connection နည်းလမ်း အားလုံးကို သုံးပြီး database အားလုံးဆီ connect လုပ်နိုင်ပါတယ်။

PostgreSQL server cluster တစ်ခုမှာ — အများစုအားဖြင့် တစ်ခုနဲ့တစ်ခု သတိမထားမိသင့်တဲ့ — မသက်ဆိုင်တဲ့ project တွေ ဒါမှမဟုတ် user တွေ ပါဝင်ဖို့ စီစဉ်ထားရင် — ၎င်းတို့ကို database သီးခြားစီတွေထဲ ထည့်ပြီး — authorization နဲ့ access control တွေကို လိုက်လျောညီထွေ ချိန်ညှိဖို့ အကြံပြုပါတယ်။ Project တွေ ဒါမှမဟုတ် user တွေက အပြန်အလှန် ဆက်စပ်နေပြီး — တစ်ဦးရဲ့ resource တွေကို တစ်ဦးက သုံးစွဲနိုင်သင့်တယ်ဆိုရင် — ၎င်းတို့ကို database တစ်ခုတည်းထဲ ထည့်သင့်ပေမယ့် — schema သီးခြားစီတွေထဲ ထည့်ဖို့ များပါတယ်; ဒါက namespace သီးခြားခွဲထားမှု (namespace isolation) နဲ့ authorization control ပါတဲ့ — modular (အစိတ်အပိုင်း သီးသန့်) ဖွဲ့စည်းပုံ တစ်ခုကို ပေးပါတယ်။ Schema တွေကို စီမံခန့်ခွဲခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အပိုင်း 5.10](/docs/postgresql/ddl-schemas) မှာ ကြည့်ပါ။

Cluster တစ်ခုတည်းအတွင်းမှာ database အများအပြား ဖန်တီးလို့ ရနိုင်ပေမယ့် — အကျိုးကျေးဇူးတွေက အန္တရာယ်နဲ့ ကန့်သတ်ချက်တွေထက် သာမသာကို ဂရုတစိုက် စဉ်းစားဖို့ အကြံပြုထားပါတယ်။ အထူးသဖြင့် — WAL တစ်ခုကို မျှဝေသုံးစွဲခြင်း ([အခန်း 28](https://www.postgresql.org/docs/current/wal.html) ကို ကြည့်ပါ) ရှိတာက backup နဲ့ recovery ရွေးချယ်စရာတွေအပေါ် သက်ရောက်မှု ရှိနိုင်တာကို သတိပြုပါ။ Cluster ထဲက database တစ်ခုချင်းစီဟာ — user တွေရဲ့ ရှုထောင့်ကကြည့်ရင် သီးခြား ခွဲထားပေမယ့် — database administrator (database စီမံခန့်ခွဲသူ) ရဲ့ ရှုထောင့်ကကြည့်ရင်တော့ — တစ်ခုနဲ့တစ်ခု နီးကပ်စွာ ဆက်စပ်နေပါတယ်။

Database တွေကို `CREATE DATABASE` command နဲ့ ([အပိုင်း 22.2](/docs/postgresql/manage-ag-createdb) ကို ကြည့်ပါ) ဖန်တီးပြီး — `DROP DATABASE` command နဲ့ ([အပိုင်း 22.5](/docs/postgresql/manage-ag-dropdb) ကို ကြည့်ပါ) ဖျက်ဆီးပါတယ်။ ရှိပြီးသား database တွေရဲ့ အစုကို သိရှိဖို့ဆိုရင် — `pg_database` system catalog ကို စစ်ဆေးပါ — ဥပမာ

```sql
SELECT datname FROM pg_database;
```

[psql](https://www.postgresql.org/docs/current/app-psql.html) program ရဲ့ `\l` meta-command နဲ့ `-l` command-line option တွေကလည်း — ရှိပြီးသား database တွေကို စာရင်းပြဖို့ အသုံးဝင်ပါတယ်။

> **မှတ်ချက်:** SQL standard က database တွေကို “catalogs” လို့ ခေါ်ပါတယ် — ဒါပေမယ့် လက်တွေ့မှာတော့ ကွာခြားချက် မရှိပါဘူး။
