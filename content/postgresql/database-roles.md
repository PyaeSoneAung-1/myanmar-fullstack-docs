---
title: "Database Roles (database roles များ)"
description: "Database roles များအကြောင်း — operating system users များနှင့် သဘောတရားအရ သီးခြားဖြစ်ပုံ၊ role ဖန်တီး/ဖျက်နည်း (CREATE ROLE / DROP ROLE / createuser / dropuser)၊ pg_roles catalog ဖြင့် စာရင်းကြည့်နည်း၊ ကနဦး superuser role နှင့် connection တစ်ခုစီတွင် role ၏ အခန်းကဏ္ဍ"
order: 172
source: "https://www.postgresql.org/docs/current/database-roles.html"
status: translated
updated: 2026-09-06
---

## 21.1. Database Roles (database roles များ)

Database roles တွေက — operating system users (လည်ပတ်စနစ် အသုံးပြုသူများ) တွေနဲ့ — သဘောတရားအရ လုံးဝ သီးခြားစီ ဖြစ်ပါတယ်။ လက်တွေ့မှာ နှစ်ခုကြား ကိုက်ညီမှု (correspondence) တစ်ခု ထိန်းသိမ်းထားတာက အဆင်ပြေစေနိုင်ပေမယ့် — မဖြစ်မနေတော့ မလိုအပ်ပါဘူး။ Database roles တွေက database cluster installation (database cluster တပ်ဆင်မှု) တစ်ခုလုံးမှာ အကျုံးဝင်တဲ့ global entity တွေ ဖြစ်ပါတယ် (database တစ်ခုချင်းစီအတွက် သီးခြား မဟုတ်ပါဘူး)။ Role တစ်ခု ဖန်တီးဖို့ — [`CREATE ROLE`](/docs/postgresql/sql-createrole) SQL command ကို သုံးပါ:

```sql
CREATE ROLE name;
```

`name` က SQL identifiers (SQL သင်္ကေတ နာမည်များ) ရဲ့ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်: အထူး စာလုံးတွေ မပါဘဲ ရိုးရိုးနဲ့ ဖြစ်စေ — double-quoted (နှစ်ထပ် quote နဲ့ ပတ်ထား) ပြီး ဖြစ်စေ ရေးနိုင်ပါတယ်။ (လက်တွေ့မှာ — command ထဲမှာ `LOGIN` လို ထပ်ဆောင်း option တွေ ထည့်ချင်လေ့ ရှိပါတယ်။ အသေးစိတ်ကို အောက်မှာ ဖော်ပြပါမယ်။) ရှိပြီးသား role တစ်ခုကို ဖယ်ရှားဖို့ — အလားတူ [`DROP ROLE`](/docs/postgresql/sql-droprole) command ကို သုံးပါ:

```sql
DROP ROLE name;
```

အဆင်ပြေစေဖို့အတွက် — [createuser](https://www.postgresql.org/docs/current/app-createuser.html) နဲ့ [dropuser](https://www.postgresql.org/docs/current/app-dropuser.html) program တွေကို — shell command line (shell ကွန်မန်း စာကြောင်း) ကနေ ခေါ်ယူလို့ရတဲ့ — ဒီ SQL commands တွေရဲ့ wrapper (ထုပ်ပိုး ခေါ်ယူပေးသော ကိရိယာ) တွေအနေနဲ့ ပေးအပ်ထားပါတယ်:

```sql
createuser name
dropuser name
```

ရှိပြီးသား roles တွေရဲ့ အစုကို သိရှိဖို့ — `pg_roles` system catalog (စနစ် ကက်တလောက်) ကို စစ်ဆေးပါ — ဥပမာ:

```sql
SELECT rolname FROM pg_roles;
```

ဒါမှမဟုတ် — log in လုပ်နိုင်စွမ်း ရှိတဲ့ဟာတွေကိုပဲ ကြည့်ချင်ရင်:

```sql
SELECT rolname FROM pg_roles WHERE rolcanlogin;
```

[psql](https://www.postgresql.org/docs/current/app-psql.html) program ရဲ့ `\du` meta-command (ကိုယ်ပိုင် အမိန့်ပေးစာကြောင်း) ကလည်း — ရှိပြီးသား roles တွေကို စာရင်းပြဖို့ အသုံးဝင်ပါတယ်။

Database system ကို bootstrap (စတင် တည်ဆောက်) လုပ်ဖို့အတွက် — အသစ် initialize (စတင် ပြင်ဆင်) လုပ်ထားတဲ့ system တစ်ခုမှာ — log in ဝင်လို့ရတဲ့ (login-capable) ကြိုတင် သတ်မှတ်ထားတဲ့ role တစ်ခု အမြဲတမ်း ပါဝင်ပါတယ်။ ဒီ role က အမြဲတမ်း “superuser” တစ်ယောက် ဖြစ်ပြီး — မတူညီတဲ့ နာမည် တစ်ခု သတ်မှတ်မထားရင် — `initdb` နဲ့ database cluster ကို initialize လုပ်ခဲ့တဲ့ operating system user ရဲ့ နာမည်အတိုင်းပဲ ရှိပါလိမ့်မယ်။ ဒီ role ကို မကြာခဏ `postgres` လို့ နာမည် ပေးလေ့ ရှိပါတယ်။ နောက်ထပ် roles တွေ ဖန်တီးဖို့ဆိုရင် — ဒီကနဦး role အဖြစ် အရင်ဆုံး connect လုပ်ရပါတယ်။

Database server ဆီ connection တိုင်းကို — သီးခြား role တစ်ခုခုရဲ့ နာမည်နဲ့ပဲ လုပ်ဆောင်ပြီး — အဲဒီ role က အဲဒီ connection အတွင်း ထုတ်ပြန်တဲ့ commands တွေအတွက် ကနဦး access privileges (ဝင်ရောက်ခွင့် အခွင့်အရေးများ) တွေကို သတ်မှတ်ပေးပါတယ်။ Database connection တစ်ခုအတွက် သုံးရမယ့် role name ကို — connection request (ချိတ်ဆက်မှု တောင်းဆိုချက်) ကို စတင်နေတဲ့ client က — application တစ်ခုချင်းစီရဲ့ ကိုယ်ပိုင် နည်းလမ်းနဲ့ ညွှန်ပြပါတယ်။ ဥပမာ — `psql` program က ဘယ် role အဖြစ် connect လုပ်မလဲ ညွှန်ပြဖို့ `-U` command line option ကို သုံးပါတယ်။ Application အများအပြားက လက်ရှိ operating system user ရဲ့ နာမည်ကိုပဲ ပုံမှန် default အနေနဲ့ ယူဆပါတယ် (`createuser` နဲ့ `psql` အပါအဝင်)။ ဒါကြောင့် — roles တွေနဲ့ operating system users တွေကြားမှာ နာမည် ကိုက်ညီမှု တစ်ခု ထိန်းသိမ်းထားတာက မကြာခဏ အဆင်ပြေပါတယ်။

Client connection တစ်ခုက ဘယ် database roles တွေအနေနဲ့ connect လုပ်နိုင်လဲဆိုတာကို — [အခန်း 20](https://www.postgresql.org/docs/current/client-authentication.html) မှာ ရှင်းပြထားတဲ့အတိုင်း — client authentication setup (client အထောက်အထား စိစစ်မှု စနစ်) က သတ်မှတ်ပါတယ်။ (ဒါကြောင့် — client တစ်ခုက သူ့ရဲ့ operating system user နဲ့ ကိုက်ညီတဲ့ role အဖြစ်ပဲ connect လုပ်ရတာ မဟုတ်ပါဘူး — လူတစ်ယောက်ရဲ့ login name (ဝင်ရောက်ရန် အမည်) က သူ့ရဲ့ နာမည်အရင်းနဲ့ မကိုက်ညီစရာ မလိုသလိုပါပဲ။) Role ရဲ့ အထောက်အထား (identity) က connect လုပ်ထားတဲ့ client တစ်ယောက်အတွက် ရရှိနိုင်တဲ့ privileges အစုကို သတ်မှတ်ပေးတာမို့ — multiuser environment (အသုံးပြုသူ အများ သုံးသော ပတ်ဝန်းကျင်) တစ်ခု တည်ဆောက်တဲ့အခါ — privileges တွေကို ဂရုတစိုက် configure (စနစ်တကျ သတ်မှတ်) လုပ်ထားဖို့ အရေးကြီးပါတယ်။
