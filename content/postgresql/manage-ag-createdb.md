---
title: "Creating a Database (database တစ်ခု ဖန်တီးခြင်း)"
description: "CREATE DATABASE command နဲ့ createdb utility သုံးပြီး database အသစ်များ ဖန်တီးခြင်း — ပထမဆုံး database (postgres) နှင့် template databases များအကြောင်း၊ database အသစ်၏ owner သတ်မှတ်ချက်များ"
order: 179
source: "https://www.postgresql.org/docs/current/manage-ag-createdb.html"
status: translated
updated: 2026-09-06
---

## 22.2. Creating a Database (database တစ်ခု ဖန်တီးခြင်း)

Database တစ်ခု ဖန်တီးဖို့ဆိုရင် — PostgreSQL server က စတင် လည်ပတ်နေရပါမယ် ([အပိုင်း 18.3](https://www.postgresql.org/docs/current/server-start.html) ကို ကြည့်ပါ)။

Database တွေကို [CREATE DATABASE](/docs/postgresql/sql-createdatabase) ဆိုတဲ့ SQL command နဲ့ ဖန်တီးပါတယ်:

```sql
CREATE DATABASE name;
```

ဒီမှာ `name` က SQL identifiers တွေအတွက် ပုံမှန် စည်းမျဉ်းတွေကို လိုက်နာပါတယ်။ လက်ရှိ role က database အသစ်ရဲ့ owner (ပိုင်ရှင်) ဖြစ်သွားပါတယ်။ နောက်ပိုင်းမှာ database တစ်ခုကို ဖယ်ရှားပိုင်ခွင့် (အဲဒီထဲက object တွေ အားလုံးကိုပါ ဖယ်ရှားတာ — သူတို့မှာ တခြား owner ရှိနေရင်တောင် ဖြစ်ပါတယ်) က database ရဲ့ owner မှာ ရှိတဲ့ အခွင့်ထူး ဖြစ်ပါတယ်။

Database တွေ ဖန်တီးခြင်းက ကန့်သတ်ထားတဲ့ (restricted) လုပ်ဆောင်ချက် တစ်ခုပါ။ ခွင့်ပြုချက် (permission) ကို ဘယ်လို grant (ပေးအပ်) ရမလဲဆိုတာအတွက် [အပိုင်း 21.2](/docs/postgresql/role-attributes) ကို ကြည့်ပါ။

`CREATE DATABASE` command ကို execute လုပ်ဖို့ဆိုရင် database server ဆီ connect လုပ်ထားဖို့ လိုတာမို့ — ဘယ် site မှာမဆို ပထမဆုံး database ကို ဘယ်လို ဖန်တီးနိုင်မလဲဆိုတဲ့ မေးခွန်း ကျန်နေပါသေးတယ်။ ပထမဆုံး database ကို — data storage area (data သိမ်းဆည်းရာ နေရာ) ကို initialize (ကနဦး ပြင်ဆင်) လုပ်တဲ့အခါ — `initdb` command က အမြဲတမ်း ဖန်တီးပေးပါတယ်။ ([အပိုင်း 18.2](https://www.postgresql.org/docs/current/creating-cluster.html) ကို ကြည့်ပါ။) ဒီ database ကို `postgres` လို့ ခေါ်ပါတယ်။ ဒါကြောင့် ပထမဆုံး “သာမန်” database ကို ဖန်တီးဖို့ဆိုရင် `postgres` ဆီ connect လုပ်နိုင်ပါတယ်။

`template1` နဲ့ `template0` ဆိုတဲ့ database နှစ်ခုကိုလည်း — database cluster initialization (database cluster ကနဦး ပြင်ဆင်မှု) အတွင်းမှာ ဖန်တီးပါတယ်။ Cluster ထဲမှာ database အသစ်တစ်ခု ဖန်တီးတိုင်း — `template1` ကို အခြေခံအားဖြင့် clone (ပုံတူပွား) လုပ်ပါတယ်။ ဆိုလိုတာက — သင် `template1` ထဲမှာ လုပ်တဲ့ ပြောင်းလဲမှုတွေ မှန်သမျှဟာ — နောက်ပိုင်း ဖန်တီးတဲ့ database တွေ အားလုံးဆီ ပျံ့နှံ့ ရောက်ရှိသွားပါတယ်။ ဒါကြောင့် — အဲဒီပြောင်းလဲမှုတွေကို database အသစ်တိုင်းဆီ ပျံ့နှံ့စေချင်မှသာ — `template1` ထဲမှာ object တွေ ဖန်တီးပါ — မဟုတ်ရင် ရှောင်ကြဉ်ပါ။ `template0` ကတော့ `template1` ရဲ့ မူရင်း ပါဝင်မှုတွေရဲ့ — မူလအတိုင်း စင်ကြယ်သော (pristine) မိတ္တူ တစ်ခု ဖြစ်ဖို့ ရည်ရွယ်ထားပါတယ်။ Site ဒေသအလိုက် ထပ်ဖြည့်ချက်တွေ ဘာမှ မပါတဲ့ database တစ်ခု ဖန်တီးဖို့ အရေးကြီးတဲ့အခါ — `template1` အစား `template0` ကို clone လုပ်နိုင်ပါတယ်။ နောက်ထပ် အသေးစိတ်တွေကို [အပိုင်း 22.3](/docs/postgresql/manage-ag-templatedbs) မှာ ဖော်ပြထားပါတယ်။

အဆင်ပြေစေဖို့အတွက် — shell ကနေ execute လုပ်ပြီး database အသစ်တွေ ဖန်တီးနိုင်တဲ့ — `createdb` ဆိုတဲ့ program တစ်ခုလည်း ရှိပါတယ်။

```sql
createdb dbname
```

`createdb` က ဘာ မှော်ဆန်းတာမှ မလုပ်ပါဘူး။ ၎င်းက `postgres` database ဆီ connect ပြီး — အထက်မှာ ဖော်ပြခဲ့တဲ့အတိုင်း အတိအကျ — `CREATE DATABASE` command ကို ထုတ်ပြန်လိုက်တာပါ။ [createdb](https://www.postgresql.org/docs/current/app-createdb.html) reference page မှာ ခေါ်ယူပုံ (invocation) အသေးစိတ်တွေ ပါဝင်ပါတယ်။ `createdb` ကို argument ဘာမှ မပါဘဲ run ရင် — လက်ရှိ user နာမည်နဲ့ database တစ်ခုကို ဖန်တီးမယ်ဆိုတာ သတိပြုပါ။

> **မှတ်ချက်:** [အခန်း 20](https://www.postgresql.org/docs/current/client-authentication.html) မှာ — ပေးထားတဲ့ database တစ်ခုဆီ ဘယ်သူ connect လုပ်နိုင်လဲ ကန့်သတ်နည်းအကြောင်း အချက်အလက်တွေ ပါဝင်ပါတယ်။

တစ်ခါတစ်ရံ — တခြားသူတစ်ယောက်အတွက် database တစ်ခု ဖန်တီးပေးပြီး — သူတို့ ကိုယ်တိုင် configure လုပ်၊ စီမံခန့်ခွဲနိုင်အောင် — အဲဒီသူကို database အသစ်ရဲ့ owner ဖြစ်စေချင်တာ မျိုး ရှိနိုင်ပါတယ်။ ဒါကို ပြီးမြောက်ဖို့ဆိုရင် — အောက်ပါ command တွေထဲက တစ်ခုကို သုံးပါ:

```sql
CREATE DATABASE dbname OWNER rolename;
```

အဲဒါက SQL environment ကနေ သုံးတဲ့ ပုံစံ ဖြစ်ပါတယ်။ ဒါမှမဟုတ်:

```sql
createdb -O rolename dbname
```

ဒါကတော့ shell ကနေ သုံးတဲ့ ပုံစံ ဖြစ်ပါတယ်။ တခြားသူတစ်ယောက်အတွက် (ဆိုလိုတာက — သင်က အဖွဲ့ဝင် မဟုတ်တဲ့ role တစ်ခုအတွက်) database ဖန်တီးခွင့်ကို — superuser တစ်ယောက်တည်းကိုပဲ ခွင့်ပြုထားပါတယ်။
