---
title: "Tablespaces (tablespace များ)"
description: "Tablespace (database object ဖိုင်များ သိမ်းဆည်းရန် file system အတွင်း နေရာ သတ်မှတ်ချက်များ) များဖြင့် PostgreSQL installation တစ်ခု၏ disk layout ကို ထိန်းချုပ်ခြင်း — CREATE TABLESPACE, CREATE privilege, default_tablespace/temp_tablespaces, database ၏ tablespace, pg_global/pg_default, pg_tablespace catalog နှင့် $PGDATA/pg_tblspc"
order: 183
source: "https://www.postgresql.org/docs/current/manage-ag-tablespaces.html"
status: translated
updated: 2026-09-06
---

## 22.6. Tablespaces (tablespace များ)

PostgreSQL ထဲက tablespace (database object တွေကို ကိုယ်စားပြုတဲ့ ဖိုင်တွေ သိမ်းဆည်းရန် file system အတွင်းမှာ သတ်မှတ်ထားတဲ့ နေရာများ) တွေက database administrator (database စီမံခန့်ခွဲသူ) တွေကို — database object တွေကို ကိုယ်စားပြုတဲ့ ဖိုင်တွေ သိမ်းဆည်းနိုင်မယ့် — file system (ဖိုင် စနစ်) အတွင်းက နေရာတွေကို သတ်မှတ်ခွင့် ပြုပါတယ်။ Tablespace တစ်ခု ဖန်တီးပြီးတာနဲ့ — database object တွေ ဖန်တီးတဲ့အခါ ၎င်းကို နာမည်နဲ့ ရည်ညွှန်း သုံးစွဲလို့ ရပါတယ်။

Tablespace တွေကို သုံးခြင်းအားဖြင့် — administrator တစ်ယောက်က PostgreSQL installation (တပ်ဆင်မှု) တစ်ခုရဲ့ disk layout (disk ပေါ်မှာ data ဖြန့်ကျက် သိမ်းဆည်းမှု ပုံစံ) ကို ထိန်းချုပ်နိုင်ပါတယ်။ ဒါက နည်းလမ်း အနည်းဆုံး နှစ်မျိုး အသုံးဝင်ပါတယ်။ ပထမ တစ်ချက်က — cluster ကို initialize (ကနဦး ပြင်ဆင်) လုပ်ခဲ့တဲ့ partition (disk အပိုင်းခွဲ) ဒါမှမဟုတ် volume က နေရာ ကုန်သွားပြီး — ထပ်တိုး ချဲ့ထွင်လို့ မရတော့ဘူးဆိုရင် — တခြား partition တစ်ခုပေါ်မှာ tablespace တစ်ခု ဖန်တီးပြီး — system ကို ပြန်လည် ဖွဲ့စည်း ပြင်ဆင်နိုင်တဲ့အထိ သုံးနိုင်လို့ပါ။

ဒုတိယ တစ်ချက်က — tablespace တွေက administrator တွေကို — database object တွေရဲ့ အသုံးပြုမှု ပုံစံ (usage pattern) အကြောင်း ဗဟုသုတကို သုံးပြီး performance (စွမ်းဆောင်ရည်) ကို အကောင်းဆုံး ဖြစ်အောင် လုပ်ခွင့် ပြုလို့ပါ။ ဥပမာ — အသုံးအများဆုံး index တစ်ခုကို — စျေးကြီးတဲ့ solid state device (SSD) လိုမျိုး — အလွန် မြန်ဆန်ပြီး ရရှိနိုင်မှု မြင့်မားတဲ့ disk ပေါ်မှာ ထားရှိနိုင်ပါတယ်။ တစ်ချိန်တည်းမှာပဲ — archive (မှတ်တမ်း) data တွေ သိမ်းထားတဲ့ — အသုံးနည်းပြီး performance အရ အရေးပါမှု မရှိတဲ့ table တစ်ခုကိုတော့ — စျေးပိုသက်သာပြီး ပိုနှေးတဲ့ disk စနစ် တစ်ခုပေါ်မှာ သိမ်းဆည်းထားနိုင်ပါတယ်။

> **သတိပေးချက်:** Tablespace တွေက အဓိက PostgreSQL data directory ရဲ့ အပြင်ဘက်မှာ တည်ရှိနေပေမယ့် — database cluster ရဲ့ မခွဲခြားနိုင်တဲ့ (integral) အစိတ်အပိုင်း တစ်ခု ဖြစ်ပြီး — data file တွေရဲ့ သီးခြား လွတ်လပ်တဲ့ အစုအဝေး တစ်ခုအနေနဲ့ သဘောထားလို့ မရပါဘူး။ ၎င်းတို့က အဓိက data directory ထဲမှာ ပါဝင်တဲ့ metadata (data အကြောင်း အချက်အလက်) အပေါ်မှာ မှီခိုနေလို့ — တခြား database cluster တစ်ခုဆီ ချိတ်ဆွဲလို့ မရသလို — တစ်ခုချင်းစီ သီးခြား backup လုပ်လို့လည်း မရပါဘူး။ အလားတူပဲ — tablespace တစ်ခု ဆုံးရှုံးသွားရင် (ဖိုင် ဖျက်လိုက်တာ၊ disk ချို့ယွင်းမှု စသည်) — database cluster က ဖတ်၍ မရတော့ဘဲ ဒါမှမဟုတ် စတင် မလည်ပတ်နိုင်တော့ဘဲ ဖြစ်သွားနိုင်ပါတယ်။ RAM disk လိုမျိုး ယာယီ file system ပေါ်မှာ tablespace တစ်ခု ထားရှိတာက — cluster တစ်ခုလုံးရဲ့ ယုံကြည်စိတ်ချရမှုကို အန္တရာယ် ဖြစ်စေပါတယ်။

Tablespace တစ်ခု သတ်မှတ်ဖို့ဆိုရင် — [CREATE TABLESPACE](/docs/postgresql/sql-createtablespace) command ကို သုံးပါ — ဥပမာ:

```sql
CREATE TABLESPACE fastspace LOCATION '/ssd1/postgresql/data';
```

Location က PostgreSQL operating system user (လည်ပတ်စနစ် အသုံးပြုသူ) က ပိုင်ဆိုင်တဲ့ — ရှိပြီးသား၊ အလွတ် directory တစ်ခု ဖြစ်ရပါမယ်။ Tablespace အတွင်းမှာ နောက်ပိုင်း ဖန်တီးတဲ့ object တွေ အားလုံးကို — ဒီ directory ရဲ့ အောက်က ဖိုင်တွေထဲမှာ သိမ်းဆည်းပါလိမ့်မယ်။ Location က ဖယ်ရှားလို့ရတဲ့ (removable) ဒါမှမဟုတ် ယာယီ (transient) သိုလှောင်မှု ပေါ်မှာ မဖြစ်ရပါဘူး — အကြောင်းကတော့ tablespace ပျောက်ဆုံး ဒါမှမဟုတ် ဆုံးရှုံးသွားရင် cluster က လုပ်ဆောင်ချက် ပျက်ကွက်သွားနိုင်လို့ပါ။

> **မှတ်ချက်:** Logical file system (ယုတ္တိ ဖိုင် စနစ်) တစ်ခုအတွင်းမှာ — ဖိုင်တစ်ခုချင်းစီရဲ့ တည်နေရာကို ထိန်းချုပ်လို့ မရတာမို့ — logical file system တစ်ခုကို tablespace တစ်ခုထက်ပိုပြီး ဖန်တီးတာက များသောအားဖြင့် အကျိုးမရှိပါဘူး။ ဒါပေမယ့် — PostgreSQL က အဲဒီလို ကန့်သတ်ချက်မျိုး အတင်းအကျပ် မလုပ်ဆောင်ပါဘူး — တကယ်တော့ ၎င်းက သင့်စနစ်ရဲ့ file system နယ်နိမိတ်တွေကို တိုက်ရိုက် သတိမပြုမိပါဘူး။ ၎င်းက သင်အသုံးပြုဖို့ ပြောလိုက်တဲ့ directory တွေထဲမှာ ဖိုင်တွေကို ရိုးရိုးရှင်းရှင်း သိမ်းဆည်းပေးတာပါ။

Tablespace ကိုယ်တိုင် ဖန်တီးတာကို database superuser အဖြစ်နဲ့သာ လုပ်ရပါမယ် — ဒါပေမယ့် အဲဒီနောက်မှာတော့ သာမန် database user တွေကို ၎င်းကို အသုံးပြုခွင့် ပေးလို့ ရပါတယ်။ အဲဒါ လုပ်ဖို့ဆိုရင် — user တွေကို tablespace အပေါ်မှာ `CREATE` privilege (ဖန်တီးခွင့်) ပေးအပ်ပါ။

Table တွေ၊ index တွေနဲ့ database တစ်ခုလုံးကိုပါ — သီးခြား tablespace တွေဆီ သတ်မှတ်ပေးနိုင်ပါတယ်။ အဲဒါ လုပ်ဖို့ — ပေးထားတဲ့ tablespace တစ်ခုအပေါ်မှာ `CREATE` privilege ရှိတဲ့ user တစ်ယောက်က သက်ဆိုင်ရာ command ဆီ tablespace နာမည်ကို parameter (ကန့်သတ်တန်ဖိုး) အနေနဲ့ ပေးရပါတယ်။ ဥပမာ — အောက်ပါက `space1` ဆိုတဲ့ tablespace ထဲမှာ table တစ်ခုကို ဖန်တီးပါတယ်:

```sql
CREATE TABLE foo(i int) TABLESPACE space1;
```

တနည်းအားဖြင့် — [default_tablespace](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TABLESPACE) parameter ကို သုံးပါ:

```sql
SET default_tablespace = space1;
CREATE TABLE foo(i int);
```

`default_tablespace` ကို အလွတ် string (empty string) မဟုတ်တဲ့ ဘာတစ်ခုခုကိုမဆို set လုပ်ထားရင် — ဒီ parameter က — ကိုယ်ပိုင် TABLESPACE clause ကို အတိအကျ (explicitly) ဖော်ပြမထားတဲ့ `CREATE TABLE` နဲ့ `CREATE INDEX` command တွေအတွက် — သွယ်ဝိုက်သော (implicit) `TABLESPACE` clause တစ်ခုကို ဖြည့်ပေးပါတယ်။

ဒါ့အပြင် — temporary tables (ယာယီ table) တွေနဲ့ index တွေ၊ ပြီးတော့ data အစုကြီးတွေကို စီခြင်း (sorting) လိုမျိုး ရည်ရွယ်ချက်တွေအတွက် သုံးတဲ့ temporary files (ယာယီ ဖိုင်များ) တွေရဲ့ နေရာချထားမှုကို ဆုံးဖြတ်ပေးတဲ့ — [temp_tablespaces](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TEMP-TABLESPACES) parameter တစ်ခုလည်း ရှိပါတယ်။ ဒါက tablespace နာမည် တစ်ခုတည်း မဟုတ်ဘဲ — စာရင်း (list) တစ်ခုလည်း ဖြစ်နိုင်လို့ — temporary object တွေနဲ့ ဆက်စပ်တဲ့ ဝန်ထုပ် (load) ကို tablespace အများအပြားပေါ်မှာ ပြန့်ကျဲ ခွဲဝေနိုင်ပါတယ်။ Temporary object တစ်ခုကို ဖန်တီးရတော့မယ့် အချိန်တိုင်းမှာ — စာရင်းထဲက အဖွဲ့ဝင် တစ်ခုကို ကျပန်း (random) ရွေးချယ်ပါတယ်။

Database တစ်ခုနဲ့ ဆက်စပ်ထားတဲ့ tablespace ကို — အဲဒီ database ရဲ့ system catalogs (စနစ်၏ metadata ဇယားများ) သိမ်းဆည်းဖို့ သုံးပါတယ်။ ဒါ့အပြင် — `TABLESPACE` clause ဘာမှ မပေးရဘဲ — `default_tablespace` ဒါမှမဟုတ် `temp_tablespaces` (သင့်လျော်သလို) က တခြား ရွေးချယ်မှု တစ်ခုခုကို သတ်မှတ်မထားဘူးဆိုရင် — အဲဒီ database အတွင်းမှာ ဖန်တီးတဲ့ table တွေ၊ index တွေနဲ့ temporary files တွေအတွက် — ဒါကပဲ default tablespace ဖြစ်ပါတယ်။ Database တစ်ခုကို tablespace သတ်မှတ်မပေးဘဲ ဖန်တီးရင် — ၎င်းကို copy လုပ်ထားတဲ့ template database သုံးတဲ့ tablespace ကိုပဲ သုံးပါတယ်။

Database cluster ကို initialize (ကနဦး ပြင်ဆင်) လုပ်တဲ့အခါ — tablespace နှစ်ခုကို အလိုအလျောက် ဖန်တီးပါတယ်။ `pg_global` tablespace ကို shared system catalogs (မျှဝေသုံးသော စနစ် catalog များ) အတွက်ပဲ သုံးပါတယ်။ `pg_default` tablespace ကတော့ — `template1` နဲ့ `template0` database တွေရဲ့ default tablespace ဖြစ်ပါတယ် (ဒါကြောင့် — `CREATE DATABASE` မှာ `TABLESPACE` clause နဲ့ ကျော်လွှား (override) မလုပ်ထားရင် — တခြား database တွေအတွက်ပါ default tablespace ဖြစ်မှာပါ)။

ဖန်တီးပြီးတာနဲ့ — တောင်းဆိုတဲ့ user မှာ လုံလောက်တဲ့ privilege (အခွင့်ထူး) ရှိနေရင် — tablespace တစ်ခုကို database ဘယ်ခုကနေမဆို သုံးစွဲလို့ ရပါတယ်။ ဆိုလိုတာက — အဲဒီ tablespace ကို သုံးနေတဲ့ database တွေ အားလုံးထဲက object တွေ အားလုံးကို ဖယ်ရှားပြီးမှသာ — tablespace တစ်ခုကို drop လုပ်လို့ ရမယ်ဆိုတာပါ။

အလွတ် tablespace တစ်ခုကို ဖယ်ရှားဖို့ဆိုရင် — [DROP TABLESPACE](/docs/postgresql/sql-droptablespace) command ကို သုံးပါ။

ရှိပြီးသား tablespace တွေရဲ့ အစုကို သိရှိဖို့ဆိုရင် — [`pg_tablespace`](https://www.postgresql.org/docs/current/catalog-pg-tablespace.html) system catalog (စနစ် catalog) ကို စစ်ဆေးပါ — ဥပမာ

```sql
SELECT spcname, spcowner::regrole, pg_tablespace_location(oid) FROM pg_tablespace;
```

ဘယ် database တွေက ဘယ် tablespace တွေကို သုံးနေလဲဆိုတာ ရှာဖွေလို့ ရပါတယ် — [ဇယား 9.76](/docs/postgresql/functions-info) ကို ကြည့်ပါ။ [psql](https://www.postgresql.org/docs/current/app-psql.html) program ရဲ့ `\db` meta-command ကလည်း — ရှိပြီးသား tablespace တွေကို စာရင်းပြဖို့ အသုံးဝင်ပါတယ်။

`$PGDATA/pg_tblspc` directory ထဲမှာ — cluster အတွင်းမှာ သတ်မှတ်ထားတဲ့ built-in မဟုတ်တဲ့ (non-built-in) tablespace တစ်ခုချင်းစီဆီ ညွှန်ပြတဲ့ symbolic links (သင်္ကေတ ချိတ်ဆက်ဖိုင်များ) တွေ ပါဝင်ပါတယ်။ အကြံပြုလောက်စရာ မဟုတ်ပေမယ့် — ဒီ link တွေကို ပြန်လည် သတ်မှတ်ခြင်းအားဖြင့် — tablespace layout ကို လက်နဲ့ ချိန်ညှိလို့ ရပါတယ်။ Server လည်ပတ်နေစဉ်မှာတော့ — ဒီလုပ်ဆောင်ချက်ကို ဘယ်အခြေအနေမှာမှ မလုပ်ပါနဲ့။
