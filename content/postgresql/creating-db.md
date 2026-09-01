---
title: "Database ဖန်တီးခြင်း"
description: "createdb command နဲ့ database အသစ် ဖန်တီးနည်း — အဖြစ်များတဲ့ error တွေနဲ့ ဖြေရှင်းနည်း၊ dropdb နဲ့ database ဖျက်ခြင်း"
order: 7
source: "https://www.postgresql.org/docs/current/tutorial-createdb.html"
status: translated
updated: 2026-09-01
---

## Database တစ်ခု ဖန်တီးခြင်း (Creating a Database)

Database server ကို access လုပ်နိုင်လားဆိုတာ စစ်ဆေးဖို့ ပထမဆုံး စမ်းကြည့်တာက — database တစ်ခု ဖန်တီးတာပဲ ဖြစ်ပါတယ်။ Run နေတဲ့ PostgreSQL server တစ်ခုက database အများကြီးကို manage လုပ်နိုင်ပြီး — ပုံမှန်အားဖြင့် project တစ်ခုစီ သို့မဟုတ် user တစ်ယောက်စီအတွက် database တစ်ခုစီ သီးသန့် သုံးလေ့ရှိပါတယ်။

ဖြစ်နိုင်ခြေ တစ်ခုက — site ရဲ့ administrator က သင့်အတွက် database တစ်ခု အဆင်သင့် ဖန်တီးပေးထားပြီးသား ဖြစ်နိုင်ပါတယ်။ ဒီလိုဆိုရင် ဒီ step ကို ကျော်ပြီး နောက် section ကို သွားလို့ရပါတယ်။

Command line ကနေ database အသစ် ဖန်တီးဖို့ — ဒီဥပမာမှာတော့ `mydb` ဆိုပြီး — အောက်ပါ command ကို သုံးပါတယ်:

```bash
createdb mydb
```

ဒီ command က response ဘာမှ ပြန်မလာဘူးဆိုရင် — အောင်မြင်ပြီလို့ ဆိုလိုတာမို့ ဒီ section ရဲ့ ကျန်တဲ့ အပိုင်းတွေကို ကျော်လို့ရပါတယ်။

ဒီလိုမျိုး message တွေ့ရင်တော့:

```
createdb: command not found
```

ဒါဆို PostgreSQL ကို မှန်ကန်စွာ install မလုပ်ထားဘူးလို့ ဆိုလိုပါတယ် — လုံးဝ install မလုပ်ထားတာလည်း ဖြစ်နိုင်သလို — shell ရဲ့ search path ထဲမှာ မပါတာလည်း ဖြစ်နိုင်ပါတယ်။ Absolute path နဲ့ command ကို ခေါ်ကြည့်ပါ:

```bash
/usr/local/pgsql/bin/createdb mydb
```

ဒီ path က site တစ်ခုနဲ့တစ်ခု မတူနိုင်ပါတယ် — site administrator ကို ဆက်သွယ်ပြီး သို့မဟုတ် installation ညွှန်ကြားချက်တွေ စစ်ပြီး အခြေအနေကို ပြင်ဆင်ပါ။

နောက်ထပ် response တစ်ခုကတော့ ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```
createdb: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory
        Is the server running locally and accepting connections on that socket?
```

ဒါက server ကို မစတင်ရသေးဘူး သို့မဟုတ် — `createdb` က ဆက်သွယ်ဖို့ မျှော်လင့်ထားတဲ့ နေရာမှာ server က listen မလုပ်နေဘူးလို့ ဆိုလိုပါတယ်။ ဒီမှာလည်း installation ညွှန်ကြားချက်တွေ ပြန်စစ်ပြီး administrator နဲ့ တိုင်ပင်ပါ။

နောက်ထပ် response တစ်ခုကတော့ ဒီလိုမျိုး:

```
createdb: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  role "joe" does not exist
```

ဒီနေရာမှာ သင့်ရဲ့ login name ကိုယ်တိုင် ပါလာပါလိမ့်မယ်။ ဒါက administrator က သင့်အတွက် PostgreSQL user account တစ်ခု မဖန်တီးပေးရသေးဘူးဆိုရင် ဖြစ်တတ်ပါတယ်။ (PostgreSQL ရဲ့ user account တွေက operating system ရဲ့ user account တွေနဲ့ သီးခြားစီ ဖြစ်ပါတယ်။) သင်ကိုယ်တိုင် administrator ဆိုရင် — account တွေ ဖန်တီးနည်း အတွက် [Chapter 21](https://www.postgresql.org/docs/current/user-manag.html) ကို ကြည့်ပါ။ ပထမဆုံး user account ဖန်တီးဖို့ PostgreSQL ကို install လုပ်ခဲ့တဲ့ operating system user (များသောအားဖြင့် `postgres`) အနေနဲ့ login လုပ်ဖို့ လိုပါတယ်။ ဒါမှမဟုတ် — သင့်ကို ပေးထားတဲ့ PostgreSQL user name က operating system user name နဲ့ မတူတာလည်း ဖြစ်နိုင်ပါတယ် — ဒီလိုဆိုရင် `-U` switch ကို သုံးပြီး ဒါမှမဟုတ် `PGUSER` environment variable ကို သတ်မှတ်ပြီး သင့် PostgreSQL user name ကို ဖော်ပြပေးရပါတယ်။

User account ရှိပေမယ့် database ဖန်တီးဖို့ လိုအပ်တဲ့ ခွင့်ပြုချက် မရှိဘူးဆိုရင် ဒီလို မြင်ရပါလိမ့်မယ်:

```
createdb: error: database creation failed: ERROR:  permission denied to create database
```

User တိုင်းက database အသစ်တွေ ဖန်တီးခွင့် ရှိတာတော့ မဟုတ်ပါဘူး။ PostgreSQL က database ဖန်တီးဖို့ ငြင်းဆိုနေတယ်ဆိုရင် — site administrator က သင့်ကို database ဖန်တီးခွင့် ပေးဖို့ လိုပါတယ်။ ဒီလိုဖြစ်ရင် site administrator နဲ့ တိုင်ပင်ပါ။ သင်ကိုယ်တိုင် PostgreSQL ကို install လုပ်ထားတယ်ဆိုရင် — ဒီ tutorial အတွက် server ကို ဘယ် user account နဲ့ စတင်ခဲ့တာလဲ အဲဒီ user account နဲ့ပဲ login လုပ်သင့်ပါတယ်။[1]

> **[1] မှတ်စု:** ဒါက ဘာကြောင့် အလုပ်လုပ်လဲဆိုတဲ့ ရှင်းလင်းချက်ပါ: PostgreSQL user name တွေက operating system user account တွေနဲ့ သီးခြားစီ ဖြစ်ပါတယ်။ Database တစ်ခုကို ချိတ်ဆက်တဲ့အခါ — ဘယ် PostgreSQL user name နဲ့ ချိတ်ဆက်မလဲ ကိုယ်တိုင် ရွေးလို့ရပြီး — မရွေးရင် သင့်ရဲ့ လက်ရှိ operating system account ရဲ့ နာမည်အတိုင်း default ဖြစ်ပါတယ်။ ဖြစ်ချင်တော့ — server ကို စတင်ခဲ့တဲ့ operating system user နဲ့ နာမည်တူတဲ့ PostgreSQL user account က အမြဲ ရှိနေပြီး — အဲဒီ user က database တွေ ဖန်တီးခွင့် အမြဲ ရှိပါတယ်။ အဲဒီ user အနေနဲ့ login မလုပ်ချင်ရင် — ချိတ်ဆက်ဖို့ PostgreSQL user name ကို ရွေးဖို့ နေရာတိုင်းမှာ `-U` option ကို သုံးနိုင်ပါတယ်။

Database တွေကို နာမည်တခြားနဲ့လည်း ဖန်တီးလို့ရပြီး — site တစ်ခုမှာ database အရေအတွက် ဘယ်လောက်ပဲ ဖြစ်ဖြစ် ဖန်တီးလို့ရပါတယ်။ Database name က စာလုံး (alphabetic) နဲ့ စရပြီး အရှည်ဆုံး 63 bytes အထိ ဖြစ်နိုင်ပါတယ်။ အဆင်ပြေဆုံး ရွေးချယ်မှုက — သင့်ရဲ့ လက်ရှိ user name နဲ့ နာမည်တူတဲ့ database ကို ဖန်တီးတာပါ — tool အများကြီးက အဲဒီ database name ကို default အနေနဲ့ ယူဆထားလို့ စာရိုက်ရတာ သက်သာပါတယ်။ အဲဒီ database ကို ဖန်တီးဖို့ ရိုးရိုးရိုက်ရုံပါပဲ:

```bash
createdb
```

Database ကို မလိုတော့ဘူးဆိုရင် ဖျက်လို့ရပါတယ် — ဥပမာ သင် ကိုယ်တိုင် ပိုင်ဆိုင် (ဖန်တီး) ထားတဲ့ `mydb` database ဆိုရင် အောက်ပါ command နဲ့ ဖျက်နိုင်ပါတယ်:

```bash
dropdb mydb
```

(ဒီ command မှာတော့ database name က user account နာမည်ကို default မယူပါဘူး — နာမည်ကို အမြဲ သတ်မှတ်ပေးရပါတယ်။) ဒီလုပ်ဆောင်ချက်က database နဲ့ ဆက်စပ်တဲ့ file တွေ အားလုံးကို ရုပ်ပိုင်းဆိုင်ရာအရ ဖျက်ပစ်ပြီး — ပြန်ပြောင်းလို့ မရတာမို့ — ကောင်းကောင်း ကြိုတင် စဉ်းစားပြီးမှသာ လုပ်သင့်ပါတယ်။

`createdb` နဲ့ `dropdb` အကြောင်း ထပ်ပြီး လေ့လာချင်ရင် [createdb](https://www.postgresql.org/docs/current/app-createdb.html) နဲ့ [dropdb](https://www.postgresql.org/docs/current/app-dropdb.html) reference page တွေကို အသီးသီး ကြည့်ပါ။

## နောက်တစ်ဆင့်တွေ

- [Table အသစ် ဖန်တီးခြင်း](/docs/postgresql/creating-table) — database ထဲမှာ table တွေ ဘယ်လို ဖန်တီးမလဲ ဆက်လေ့လာပါ
- [PostgreSQL မိတ်ဆက်](/docs/postgresql/getting-started) — psql နဲ့ database ဖန်တီးတာတွေ ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-createdb.html
