---
title: "Schemas (schema များ)"
description: "Schema များအကြောင်း — schema ဖန်တီးခြင်း၊ public schema၊ schema search path (ရှာဖွေရေး လမ်းကြောင်း)၊ schema နှင့် privilege များ၊ system catalog schema နှင့် အသုံးပြုမှု ပုံစံများ"
order: 31
source: "https://www.postgresql.org/docs/current/ddl-schemas.html"
status: translated
updated: 2026-09-03
---

## 5.10. Schemas (schema များ)

- **5.10.1. Creating a Schema (schema တစ်ခု ဖန်တီးခြင်း)**
- **5.10.2. The Public Schema (public schema)**
- **5.10.3. The Schema Search Path (schema ရှာဖွေရေး လမ်းကြောင်း)**
- **5.10.4. Schemas and Privileges (schema များနှင့် ခွင့်ပြုချက်များ)**
- **5.10.5. The System Catalog Schema (system catalog များ ပါဝင်သော schema)**
- **5.10.6. Usage Patterns (အသုံးပြုမှု ပုံစံများ)**
- **5.10.7. Portability (ရွှေ့ပြောင်း အသုံးပြုနိုင်မှု)**

PostgreSQL ရဲ့ database cluster (database အစုအဝေး) တစ်ခုမှာ နာမည် သတ်မှတ်ထားတဲ့ database တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး ပါဝင်ပါတယ်။ Roles တွေနဲ့ အခြား object အမျိုးအစား အနည်းငယ်ကတော့ cluster တစ်ခုလုံးတွင် မျှဝေ အသုံးပြုကြပါတယ်။ Server ဆီ ချိတ်ဆက်ထားတဲ့ client connection တစ်ခုက — connection request ထဲမှာ သတ်မှတ်ထားတဲ့ database တစ်ခုတည်းရဲ့ data တွေကိုပဲ — access လုပ်နိုင်ပါတယ်။

> **မှတ်ချက်:** Cluster တစ်ခုရဲ့ users တွေက — cluster ထဲက database တိုင်းကို access လုပ်ဖို့ privilege ရှိကြပါတယ်လို့ မဆိုလိုပါဘူး။ Role နာမည်တွေ မျှဝေသုံးတာကြောင့် — ဥပမာ — `joe` ဆိုတဲ့ နာမည်နဲ့ role မတူညီတဲ့ နှစ်ခုက cluster တစ်ခုတည်းထဲက database နှစ်ခုမှာ မရှိနိုင်ပါဘူး; ဒါပေမယ့် — `joe` ကို database တချို့ကိုပဲ access ခွင့်ပြုဖို့ system ကို configure လုပ်ထားလို့တော့ ရပါတယ်။

Database တစ်ခုမှာ နာမည်တပ်ထားတဲ့ *schemas* (schema များ) တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး ပါဝင်ပြီး — အဲဒီ schema တွေထဲမှာ table တွေ ပြန်ပါဝင်ပါတယ်။ Schema တွေမှာ data type တွေ၊ function တွေနဲ့ operator တွေ အပါအဝင် — နာမည်တပ်ထားတဲ့ အခြား object အမျိုးအစားတွေလည်း ပါဝင်နိုင်ပါတယ်။ Schema တစ်ခုတည်းအတွင်းမှာ — type တူညီတဲ့ object နှစ်ခုက နာမည်တူလို့ မရပါဘူး။ ဒါ့အပြင် — table တွေ၊ sequence တွေ၊ index တွေ၊ view တွေ၊ materialized view တွေနဲ့ foreign table တွေက namespace တစ်ခုတည်းကို မျှဝေ အသုံးပြုတာမို့ — ဥပမာ — schema တစ်ခုတည်းထဲမှာဆိုရင် index တစ်ခုနဲ့ table တစ်ခုက နာမည် မတူရပါဘူး။ Object နာမည် တစ်ခုတည်းကို schema မတူညီတဲ့ နေရာတွေမှာ ပဋိပက္ခ (conflict) မရှိဘဲ သုံးလို့ရပါတယ်; ဥပမာ — `schema1` ရော `myschema` ရော နှစ်ခုလုံးမှာ `mytable` ဆိုတဲ့ နာမည်နဲ့ table တွေ ရှိနိုင်ပါတယ်။ Database တွေနဲ့ မတူဘဲ — schema တွေက ပြတ်သားစွာ ခွဲခြားထားတာ မဟုတ်ပါဘူး: user တစ်ယောက်က သူ ချိတ်ဆက်ထားတဲ့ database ထဲက schema ဘယ်ခုမဆိုရဲ့ object တွေကို — privilege ရှိမယ်ဆိုရင် — access လုပ်နိုင်ပါတယ်။

Schema တွေကို သုံးချင်စရာ အကြောင်းရင်း အများအပြား ရှိပါတယ်:

- User အများကြီးက တစ်ယောက်ကို တစ်ယောက် အနှောင့်အယှက် မဖြစ်ဘဲ — database တစ်ခုတည်းကို သုံးနိုင်စေဖို့အတွက် ဖြစ်ပါတယ်။
- Database object တွေကို logical အုပ်စုတွေအဖြစ် စုစည်းပြီး — ပိုပြီး စီမံခန့်ခွဲရ လွယ်ကူစေဖို့အတွက် ဖြစ်ပါတယ်။
- Third-party application တွေကို schema သီးခြားတွေထဲ ထည့်ထားလို့ — တခြား object တွေရဲ့ နာမည်တွေနဲ့ မတိုက်မိစေဖို့အတွက် ဖြစ်ပါတယ်။

Schema တွေက operating system အဆင့်မှာ ရှိတဲ့ directory တွေနဲ့ ဆင်တူပါတယ် — schema တွေကို nested (အထပ်လိုက် ထည့်) လုပ်လို့မရတာပဲ ကွာပါတယ်။

### 5.10.1. Creating a Schema (schema တစ်ခု ဖန်တီးခြင်း)

Schema တစ်ခု ဖန်တီးဖို့ — [CREATE SCHEMA](https://www.postgresql.org/docs/current/sql-createschema.html) command ကို သုံးပါတယ်။ Schema အတွက် ကြိုက်တဲ့ နာမည် တစ်ခုကို ပေးလိုက်ပါ။ ဥပမာ —

```sql
CREATE SCHEMA myschema;
```

Schema တစ်ခုထဲမှာ object တွေ ဖန်တီးဖို့ ဒါမှမဟုတ် access လုပ်ဖို့ဆိုရင် — schema နာမည်နဲ့ table နာမည်ကို dot နဲ့ ခြားပြီး ရေးတဲ့ *qualified name* (အရည်အချင်း ပြည့်စုံသော နာမည်) ကို သုံးပါတယ်:

```sql
schema.table
```

ဒါက table နာမည် မျှော်လင့်ရတဲ့ နေရာတိုင်းမှာ အလုပ်လုပ်ပါတယ် — table ပြုပြင်မွမ်းမံတဲ့ command တွေရော — နောက် chapter တွေမှာ ဆွေးနွေးမယ့် data access command တွေရောမှာ ဖြစ်ပါတယ်။ (အတိုချုံးဖို့အတွက် table တွေအကြောင်းပဲ ပြောသွားပါမယ် — ဒါပေမယ့် ဒီအချက်တွေက type တွေ၊ function တွေလို — နာမည်တပ်ထားတဲ့ အခြား object အမျိုးအစားတွေအတွက်လည်း အလားတူ သက်ရောက်ပါတယ်။)

တကယ်တော့ ပိုပြီး ယေဘုယျကျတဲ့ syntax —

```sql
database.schema.table
```

— ကိုလည်း သုံးလို့ရပါတယ် — ဒါပေမယ့် လောလောဆယ်မှာတော့ SQL standard ကို ပုံစံအရ (pro forma) လိုက်နာတာမျိုးအတွက်ပဲ ဖြစ်ပါတယ်။ Database နာမည် ရေးမယ်ဆိုရင် — ကိုယ် ချိတ်ဆက်ထားတဲ့ database နဲ့ တူညီရပါမယ်။

ဒါကြောင့် schema အသစ်ထဲမှာ table တစ်ခု ဖန်တီးဖို့ — ဒီလို သုံးပါတယ်:

```sql
CREATE TABLE myschema.mytable (
 ...
);
```

Schema တစ်ခုကို — အလွတ် (empty) ဖြစ်နေတယ်ဆိုရင် (သူ့ထဲက object အားလုံး drop လုပ်ပြီးသားဆိုရင်) — ဖျက်ဖို့ — ဒီလို သုံးပါတယ်:

```sql
DROP SCHEMA myschema;
```

Schema တစ်ခုကို သူ့ထဲမှာ ပါဝင်တဲ့ object တွေ အားလုံးအပါအဝင် ဖျက်ဖို့ဆိုရင် — ဒီလို သုံးပါတယ်:

```sql
DROP SCHEMA myschema CASCADE;
```

ဒီနောက်ကွယ်က ယေဘုယျ ယန္တရား (mechanism) ရဲ့ ဖော်ပြချက်အတွက် [အပိုင်း 5.15](/docs/postgresql/ddl-depend) ကို ကြည့်ပါ။

မကြာခဏဆိုသလို — တခြားသူ ပိုင်ဆိုင်မယ့် schema တစ်ခုကို ဖန်တီးချင်တတ်ပါတယ် (ဒါက user တွေရဲ့ လုပ်ဆောင်ချက်တွေကို ကောင်းစွာ သတ်မှတ်ထားတဲ့ namespace တွေအတွင်းမှာပဲ ကန့်သတ်ဖို့ နည်းလမ်းတစ်ခု ဖြစ်လို့ပါ)။ အဲဒီအတွက် syntax ကတော့:

```sql
CREATE SCHEMA schema_name AUTHORIZATION user_name;
```

Schema နာမည်ကို ချန်လိုက်လို့လည်း ရပါတယ် — အဲဒီလိုဆိုရင် schema နာမည်က user နာမည်နဲ့ပဲ တူနေမှာ ဖြစ်ပါတယ်။ ဒါက ဘယ်လို အသုံးဝင်နိုင်လဲဆိုတာ အပိုင်း 5.10.6 မှာ ကြည့်ပါ။

`pg_` နဲ့ စတင်တဲ့ schema နာမည်တွေက system ရဲ့ ရည်ရွယ်ချက်တွေအတွက် သိမ်းဆည်းထားပြီး — user တွေ ဖန်တီးလို့ မရပါဘူး။

### 5.10.2. The Public Schema (public schema)

အရင် section တွေမှာ ကျွန်ုပ်တို့ဟာ schema နာမည် တစ်ခုမှ မသတ်မှတ်ဘဲ table တွေ ဖန်တီးခဲ့ပါတယ်။ ပုံမှန်အားဖြင့် — အဲဒီလို table တွေ (နဲ့ တခြား object တွေ) ကို "public" လို့ နာမည်ပေးထားတဲ့ schema တစ်ခုထဲကို အလိုအလျောက် ထည့်ပေးပါတယ်။ Database အသစ်တိုင်းမှာ အဲဒီလို schema တစ်ခု ပါရှိပါတယ်။ ဒါကြောင့် အောက်ပါတို့က တူညီပါတယ်:

```sql
CREATE TABLE products ( ... );
```

နဲ့:

```sql
CREATE TABLE public.products ( ... );
```

### 5.10.3. The Schema Search Path (schema ရှာဖွေရေး လမ်းကြောင်း)

Qualified name တွေက ရေးရတာ ပင်ပန်းပြီး — application တွေထဲမှာ schema နာမည် တစ်ခုကို သီးသန့် မသွင်းထားတာက မကြာခဏဆိုသလို အကောင်းဆုံး ဖြစ်ပါတယ်။ ဒါကြောင့် table တွေကို table နာမည်ပဲ ပါဝင်တဲ့ *unqualified names* (schema ပါဝင်မှု မရှိသော နာမည်များ) တွေနဲ့ ရည်ညွှန်းလေ့ ရှိပါတယ်။ System က ဘယ် table ကို ဆိုလိုတယ်ဆိုတာ — ဘယ် schema တွေထဲမှာ ရှာရမလဲဆိုတဲ့ list တစ်ခု ဖြစ်တဲ့ *search path* (ရှာဖွေရေး လမ်းကြောင်း) ကို လိုက်ပြီး ဆုံးဖြတ်ပါတယ်။ Search path ထဲမှာ ပထမဆုံး ကိုက်ညီတဲ့ table ကို လိုချင်တဲ့ table အဖြစ် သတ်မှတ်ပါတယ်။ Search path ထဲမှာ ကိုက်ညီမှု မရှိဘူးဆိုရင် — database ထဲက တခြား schema တွေမှာ ကိုက်ညီတဲ့ table နာမည်တွေ ရှိနေရင်တောင် — error တစ်ခု အစီရင်ခံပါတယ်။

Schema မတူညီတဲ့ နေရာတွေမှာ နာမည်တူ object တွေ ဖန်တီးနိုင်တာက — အကြိမ်တိုင်း အတိအကျ တူညီတဲ့ object တွေကိုပဲ ရည်ညွှန်းတဲ့ query တစ်ခု ရေးသားခြင်းကို ရှုပ်ထွေးစေပါတယ်။ ဒါ့အပြင် — user တွေက တခြား user တွေရဲ့ query တွေရဲ့ အပြုအမူကို — ရည်ရွယ်ချက်ရှိရှိ ဒါမှမဟုတ် မတော်တဆ — ပြောင်းလဲပစ်နိုင်တဲ့ အလားအလာကိုလည်း ဖွင့်ပေးပါတယ်။ Query တွေမှာ unqualified name တွေ ပျံ့နှံ့နေပြီး — PostgreSQL ရဲ့ အတွင်းပိုင်း (internals) တွေမှာလည်း အသုံးပြုနေတာကြောင့် — schema တစ်ခုကို `search_path` ထဲ ထည့်လိုက်တာက — အဲဒီ schema ပေါ်မှာ `CREATE` privilege ရှိတဲ့ user အားလုံးကို ယုံကြည်လိုက်တာနဲ့ ထိရောက်စွာ ညီမျှပါတယ်။ သာမန် query တစ်ခု run တဲ့အခါ — ကိုယ့်ရဲ့ search path ထဲက schema တစ်ခုထဲမှာ object တွေ ဖန်တီးနိုင်တဲ့ မသမာတဲ့ (malicious) user တစ်ယောက်က — ကိုယ်တိုင် execute လုပ်ခဲ့သလိုမျိုး — ကြိုက်ရာ SQL function တွေကို execute လုပ်ပြီး ထိန်းချုပ်မှု ယူနိုင်ပါတယ်။

Search path ထဲမှာ ပထမဆုံး နာမည်ပါတဲ့ schema ကို current schema (လက်ရှိ schema) လို့ ခေါ်ပါတယ်။ ပထမဆုံး ရှာဖွေခံရတဲ့ schema ဖြစ်တာအပြင် — `CREATE TABLE` command က schema နာမည် မသတ်မှတ်ရင် — table အသစ်တွေ ဖန်တီးခံရမယ့် schema လည်း ဖြစ်ပါတယ်။

လက်ရှိ search path ကို ပြသဖို့ — အောက်ပါ command ကို သုံးပါ:

```sql
SHOW search_path;
```

ပုံမှန် setup မှာ ဒီလို ပြန်ပေးပါတယ်:

```sql
 search_path
--------------
 "$user", public
```

ပထမ element က — လက်ရှိ user ရဲ့ နာမည်နဲ့ တူညီတဲ့ schema တစ်ခုကို ရှာဖွေရမယ်လို့ သတ်မှတ်ပါတယ်။ အဲဒီလို schema မရှိဘူးဆိုရင် — entry ကို လျစ်လျူရှုလိုက်ပါတယ်။ ဒုတိယ element ကတော့ — အရင်က မြင်ခဲ့ရပြီးဖြစ်တဲ့ public schema ကို ရည်ညွှန်းပါတယ်။

Search path ထဲမှာ တည်ရှိတဲ့ ပထမဆုံး schema က object အသစ်တွေ ဖန်တီးဖို့အတွက် ပုံမှန် နေရာ (default location) ဖြစ်ပါတယ်။ ဒါကြောင့်ပဲ ပုံမှန်အားဖြင့် object တွေကို public schema ထဲမှာ ဖန်တီးတာ ဖြစ်ပါတယ်။ Object တွေကို schema qualification မပါဘဲ တခြား context မှန်သမျှ (table modification, data modification ဒါမှမဟုတ် query command တွေ) မှာ ရည်ညွှန်းတဲ့အခါ — ကိုက်ညီတဲ့ object တစ်ခု တွေ့တဲ့အထိ search path ကို ဖြတ်သန်း ရှာဖွေပါတယ်။ ဒါကြောင့် ပုံမှန် configuration မှာ — unqualified access တိုင်းက public schema ကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။

Schema အသစ်ကို path ထဲ ထည့်ဖို့ — ဒီလို သုံးပါတယ်:

```sql
SET search_path TO myschema,public;
```

(ဒီမှာ `$user` ကို ချန်လိုက်ပါတယ် — လောလောဆယ် ဒါ မလိုအပ်လို့ပါ။) ပြီးတော့ — schema qualification မပါဘဲ table ကို access လုပ်လို့ရပါပြီ:

```sql
DROP TABLE mytable;
```

ဒါ့အပြင် — `myschema` က path ထဲက ပထမဆုံး element ဖြစ်တာမို့ — object အသစ်တွေကို ပုံမှန်အားဖြင့် အဲဒီထဲမှာ ဖန်တီးပါလိမ့်မယ်။

ဒီလိုလည်း ရေးလို့ရပါသေးတယ်:

```sql
SET search_path TO myschema;
```

ဒါဆိုရင် — explicit qualification မပါဘဲ public schema ကို နောက်ထပ် access လုပ်လို့ မရတော့ပါဘူး။ Public schema မှာ — ပုံမှန်အားဖြင့် တည်ရှိနေတယ်ဆိုတာကလွဲရင် — ထူးခြားတာ ဘာမှ မရှိပါဘူး။ အဲဒါကိုလည်း drop လုပ်လို့ရပါတယ်။

Schema search path ကို ကိုင်တွယ်ဖို့ တခြား နည်းလမ်းတွေအတွက် [အပိုင်း 9.27](/docs/postgresql/functions-info) ကိုလည်း ကြည့်ပါ။

Search path က data type နာမည်တွေ၊ function နာမည်တွေနဲ့ operator နာမည်တွေအတွက်လည်း — table နာမည်တွေအတွက် လုပ်ဆောင်သလိုပဲ — အလုပ်လုပ်ပါတယ်။ Data type နဲ့ function နာမည်တွေကို table နာမည်တွေလိုပဲ အတိအကျ qualification လုပ်လို့ရပါတယ်။ Expression တစ်ခုထဲမှာ qualified operator နာမည် တစ်ခု ရေးဖို့ လိုအပ်ရင် — အထူး ပြဋ္ဌာန်းချက် (special provision) တစ်ခု ရှိပါတယ်: ဒီလို ရေးရပါတယ်

```sql
OPERATOR(schema.operator)
```

ဒါက syntactic ambiguity (ဝါကျ ဖွဲ့စည်းပုံ အဓိပ္ပာယ် မရှင်းလင်းမှု) ကို ရှောင်ရှားဖို့ လိုအပ်ပါတယ်။ ဥပမာ တစ်ခုကတော့:

```sql
SELECT 3 OPERATOR(pg_catalog.+) 4;
```

လက်တွေ့မှာတော့ — ဒီလောက် ကြည့်ရဆိုးတဲ့ အရာမျိုး မရေးရအောင် — operator တွေအတွက် search path ကို အားကိုးလေ့ ရှိပါတယ်။

### 5.10.4. Schemas and Privileges (schema များနှင့် ခွင့်ပြုချက်များ)

ပုံမှန်အားဖြင့် — user တွေက သူတို့ မပိုင်ဆိုင်တဲ့ schema တွေထဲက object တွေကို access လုပ်လို့ မရပါဘူး။ အဲဒါကို ခွင့်ပြုဖို့ဆိုရင် — schema ရဲ့ owner က schema ပေါ်မှာ `USAGE` privilege ကို grant လုပ်ပေးရပါမယ်။ ပုံမှန်အားဖြင့် — လူတိုင်းမှာ `public` schema ပေါ်မှာ ဒီ privilege ရှိပါတယ်။ Schema တစ်ခုထဲက object တွေကို user တွေ အသုံးပြုနိုင်ဖို့ — object တစ်ခုချင်းစီအတွက် သင့်လျော်သလို — privilege တွေ ထပ်ဖြည့် grant လုပ်ဖို့ လိုအပ်ကောင်း လိုအပ်ပါလိမ့်မယ်။

User တစ်ယောက်ကို တခြားသူရဲ့ schema ထဲမှာ object တွေ ဖန်တီးခွင့်လည်း ပေးလို့ရပါတယ်။ အဲဒါအတွက် — schema ပေါ်မှာ `CREATE` privilege ကို grant လုပ်ပေးရပါတယ်။ PostgreSQL 14 ဒါမှမဟုတ် အစောပိုင်းကနေ upgrade လုပ်ထားတဲ့ database တွေမှာ — လူတိုင်းမှာ `public` schema ပေါ်မှာ ဒီ privilege ရှိပါတယ်။ Usage patterns (အသုံးပြုမှု ပုံစံများ) တချို့က အဲဒီ privilege ကို revoke လုပ်ဖို့ တောင်းဆိုပါတယ်:

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

(ပထမ "public" က schema ဖြစ်ပြီး — ဒုတိယ "public" က "user တိုင်း" လို့ ဆိုလိုပါတယ်။ ပထမ အဓိပ္ပာယ်မှာ identifier တစ်ခု ဖြစ်ပြီး — ဒုတိယ အဓိပ္ပာယ်မှာ key word တစ်ခု ဖြစ်လို့ — capitalization (စာလုံးကြီး/စာလုံးသေး) ကွဲပြားတာပါ; [အပိုင်း 4.1.1](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS) က လမ်းညွှန်ချက်တွေကို ပြန်သတိရပါ။)

### 5.10.5. The System Catalog Schema (system catalog များ ပါဝင်သော schema)

`public` နဲ့ user တွေ ဖန်တီးထားတဲ့ schema တွေအပြင် — database တိုင်းမှာ `pg_catalog` schema တစ်ခု ပါဝင်ပြီး — အဲဒီထဲမှာ system table တွေရော — built-in data type တွေ၊ function တွေနဲ့ operator တွေ အားလုံးရော ပါဝင်ပါတယ်။ `pg_catalog` က search path ရဲ့ အစိတ်အပိုင်း တစ်ခုအနေနဲ့ အမြဲတမ်း ထိရောက်စွာ ပါဝင်နေပါတယ်။ Path ထဲမှာ အတိအကျ နာမည်တပ် မထားရင်တောင် — path ထဲက schema တွေကို မရှာဖွေခင် — အဲဒါကို သွယ်ဝိုက် (implicitly) ရှေ့ဆုံးက ရှာဖွေခံရပါတယ်။ ဒါက built-in နာမည်တွေ အမြဲတမ်း ရှာတွေ့နိုင်စေဖို့ သေချာစေပါတယ်။ ဒါပေမယ့် — user-defined နာမည်တွေက built-in နာမည်တွေကို override (အစားထိုး) လုပ်တာ ပိုကြိုက်တယ်ဆိုရင်တော့ — `pg_catalog` ကို ကိုယ့် search path ရဲ့ အဆုံးမှာ အတိအကျ နေရာချလို့ရပါတယ်။

System table နာမည်တွေက `pg_` နဲ့ စတင်တာမို့ — နောင်ထွက်လာမယ့် version တစ်ခုမှာ ကိုယ့် table နဲ့ နာမည်တူတဲ့ system table တစ်ခု သတ်မှတ်လိုက်ရင် conflict မဖြစ်ရလေအောင် — ဒီလို နာမည်မျိုးတွေကို ရှောင်တာ အကောင်းဆုံး ဖြစ်ပါတယ်။ (ပုံမှန် search path နဲ့ဆိုရင် — ကိုယ့် table နာမည်ကို unqualified ရည်ညွှန်းလိုက်တာက system table အနေနဲ့ ပြန်ဖြေရှင်းခံရတာမျိုး ဖြစ်နိုင်လို့ပါ။) System table တွေက `pg_` နဲ့ စတင်တဲ့ နာမည်တွေ ဆိုတဲ့ convention ကို ဆက်ပြီး လိုက်နာသွားမှာ ဖြစ်လို့ — user တွေက `pg_` prefix ကို ရှောင်ထားသရွေ့ — user table နာမည်တွေနဲ့ unqualified အနေနဲ့ conflict ဖြစ်မှာ မဟုတ်ပါဘူး။

### 5.10.6. Usage Patterns (အသုံးပြုမှု ပုံစံများ)

Schema တွေကို data တွေ စုစည်းဖို့ နည်းလမ်း အမျိုးမျိုးနဲ့ သုံးနိုင်ပါတယ်။ *Secure schema usage pattern* (လုံခြုံသော schema အသုံးပြုမှု ပုံစံ) တစ်ခုက — မယုံကြည်ရတဲ့ (untrusted) user တွေ တခြား user တွေရဲ့ query တွေရဲ့ အပြုအမူကို ပြောင်းလဲပစ်တာကနေ ကာကွယ်ပေးပါတယ်။ Database တစ်ခုက secure schema usage pattern ကို အသုံးမပြုထားတဲ့အခါ — အဲဒီ database ကို လုံခြုံစွာ query လုပ်ချင်တဲ့ users တွေက — session တစ်ခုစီရဲ့ အစမှာ ကာကွယ်မှု ဆိုင်ရာ လုပ်ဆောင်ချက် (protective action) တွေ လုပ်ဆောင်ရပါတယ်။ အတိအကျ ဆိုရရင် — သူတို့က session တစ်ခုစီကို `search_path` ကို empty string အဖြစ် သတ်မှတ်ခြင်း ဒါမှမဟုတ် non-superuser တွေ ရေးသားလို့ရတဲ့ (writable) schema တွေကို `search_path` ကနေ ဖယ်ရှားခြင်းနဲ့ စတင်ကြပါတယ်။ ပုံမှန် configuration နဲ့ အလွယ်တကူ ပံ့ပိုးနိုင်တဲ့ usage pattern အနည်းငယ် ရှိပါတယ်:

- သာမန် user တွေကို user တစ်ဦးချင်းစီရဲ့ ကိုယ်ပိုင် (user-private) schema တွေမှာပဲ ကန့်သတ်ထားခြင်း။ ဒီ pattern ကို အကောင်အထည် ဖော်ဖို့ — ပထမဆုံး — ဘယ် schema မှာမှ public CREATE privileges မရှိဘူးဆိုတာ သေချာစေပါ။ ပြီးရင် — temporary မဟုတ်တဲ့ object တွေ ဖန်တီးဖို့ လိုအပ်တဲ့ user တစ်ယောက်ချင်းစီအတွက် — အဲဒီ user ရဲ့ နာမည်နဲ့ပဲ တူညီတဲ့ schema တစ်ခု ဖန်တီးပါ — ဥပမာ CREATE SCHEMA alice AUTHORIZATION alice လိုမျိုးပါ။ (ပုံမှန် search path က $user နဲ့ စတင်ပြီး — အဲဒါက user နာမည်ကို ဖြေရှင်းပေးတယ်ဆိုတာ သတိရပါ။ ဒါကြောင့် user တစ်ယောက်ချင်းစီမှာ schema သီးခြားစီ ရှိနေရင် — သူတို့က ပုံမှန်အားဖြင့် ကိုယ့် schema တွေကိုပဲ access လုပ်ကြပါတယ်။) ဒီ pattern က — မယုံကြည်ရတဲ့ user တစ်ယောက်က database ရဲ့ owner ဖြစ်နေရင် ဒါမှမဟုတ် သက်ဆိုင်ရာ role တစ်ခုပေါ်မှာ ADMIN OPTION grant ခံထားရရင် — ကလွဲလို့ — secure schema usage pattern တစ်ခု ဖြစ်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာတော့ — secure ဖြစ်တဲ့ schema usage pattern ဆိုတာ မရှိတော့ပါဘူး။
  PostgreSQL 15 နဲ့ နောက်ပိုင်းမှာ — ပုံမှန် configuration က ဒီ usage pattern ကို ပံ့ပိုးပါတယ်။ အရင်က version တွေမှာ ဒါမှမဟုတ် — အရင်က version တစ်ခုကနေ upgrade လုပ်ထားတဲ့ database တစ်ခုကို အသုံးပြုနေရရင် — public schema ကနေ public CREATE privilege ကို ဖယ်ရှားဖို့ လိုအပ်ပါလိမ့်မယ် (REVOKE CREATE ON SCHEMA public FROM PUBLIC ကို ထုတ်ပါ)။ ပြီးရင် — pg_catalog schema ထဲက object တွေနဲ့ နာမည်ဆင်တူတဲ့ object တွေအတွက် public schema ကို audit (စစ်ဆေး) လုပ်ဖို့ စဉ်းစားပါ။
- Public schema ကို default search path ကနေ ဖယ်ရှားခြင်း — postgresql.conf ကို ပြုပြင်ခြင်းအားဖြင့် ဒါမှမဟုတ် ALTER ROLE ALL SET search_path = "$user" ကို ထုတ်ခြင်းအားဖြင့်ပါ။ ပြီးရင် — public schema ထဲမှာ ဖန်တီးဖို့ privileges တွေ grant လုပ်ပါ။ Qualified name တွေကသာ public schema ထဲက object တွေကို ရွေးချယ်ပါလိမ့်မယ်။ Qualified table reference တွေက ကောင်းမွန်ပေမယ့် — public schema ထဲက function တွေကို call လုပ်တာကတော့ မလုံခြုံသလို စိတ်ချရမှုလည်း မရှိနိုင်ပါဘူး။ Public schema ထဲမှာ function တွေ ဒါမှမဟုတ် extension တွေ ဖန်တီးမယ်ဆိုရင် — ပထမ pattern ကိုပဲ သုံးပါ။ ဒါမဟုတ်ရင် — ပထမ pattern လိုပဲ — မယုံကြည်ရတဲ့ user တစ်ယောက်က database ရဲ့ owner ဖြစ်နေရင် ဒါမှမဟုတ် သက်ဆိုင်ရာ role တစ်ခုပေါ်မှာ ADMIN OPTION grant ခံထားရရင် — ကလွဲလို့ — ဒီ pattern က လုံခြုံပါတယ်။
- Default search path ကို ထိန်းထားပြီး — public schema ထဲမှာ ဖန်တီးဖို့ privileges တွေ grant လုပ်ခြင်း။ User အားလုံးက public schema ကို သွယ်ဝိုက် (implicitly) ပြီး access လုပ်ကြပါတယ်။ ဒါက schema တွေ လုံးဝ မရနိုင်တဲ့ အခြေအနေကို အတုယူပြီး — schema ဆိုတဲ့ အယူအဆ မရှိတဲ့ ကမ္ဘာကနေ ချောမွေ့စွာ ကူးပြောင်းနိုင်စေပါတယ်။ ဒါပေမယ့် — ဒါက ဘယ်တော့မှ လုံခြုံတဲ့ pattern မဟုတ်ပါဘူး။ Database မှာ user တစ်ယောက်တည်း ဒါမှမဟုတ် အချင်းချင်း ယုံကြည်မှု ရှိတဲ့ user အနည်းငယ်ပဲ ရှိတဲ့အခါမှသာ လက်ခံနိုင်ပါတယ်။ PostgreSQL 14 ဒါမှမဟုတ် အစောပိုင်းကနေ upgrade လုပ်ထားတဲ့ database တွေမှာ — ဒါက ပုံမှန် ဖြစ်ပါတယ်။

Pattern ဘယ်ခုအတွက်မဆို — shared application တွေ (လူတိုင်း အသုံးပြုရမယ့် table တွေ၊ third parties တွေ ပံ့ပိုးပေးတဲ့ ထပ်ဆောင်း function တွေ စသဖြင့်) တပ်ဆင်ဖို့ဆိုရင် — သူတို့ကို schema သီးခြားတွေထဲ ထည့်ပါ။ တခြား user တွေ access လုပ်နိုင်ဖို့ — သင့်လျော်တဲ့ privileges တွေ grant လုပ်ပေးဖို့ သတိရပါ။ User တွေက ဒီ ထပ်ဆောင်း object တွေကို — နာမည်တွေကို schema နာမည်နဲ့ ပေါင်း၍ qualify လုပ်ပြီး ရည်ညွှန်းလို့ရသလို — ကြိုက်နှစ်သက်သလို — ထပ်ဆောင်း schema တွေကို ကိုယ့် search path ထဲ ထည့်ထားလို့လည်း ရပါတယ်။

### 5.10.7. Portability (ရွှေ့ပြောင်း အသုံးပြုနိုင်မှု)

SQL standard မှာတော့ — schema တစ်ခုတည်းထဲက object တွေကို user မတူညီသူတွေက ပိုင်ဆိုင်တယ်ဆိုတဲ့ အယူအဆ မရှိပါဘူး။ ဒါ့အပြင် — implementation တချို့က owner ရဲ့ နာမည်နဲ့ မတူတဲ့ နာမည်ရှိတဲ့ schema တွေ ဖန်တီးခွင့် မပေးပါဘူး။ တကယ်တော့ — standard မှာ သတ်မှတ်ထားတဲ့ အခြေခံ schema support ကိုပဲ implement လုပ်ထားတဲ့ database system တစ်ခုမှာဆိုရင် — schema နဲ့ user ဆိုတဲ့ အယူအဆတွေက ခပ်ဆင်ဆင် တူညီလုနီးပါး ဖြစ်ပါတယ်။ ဒါကြောင့် — qualified name တွေက တကယ်တော့ `user_name.table_name` ပဲ ဖြစ်တယ်လို့ user အများအပြား ယူဆကြပါတယ်။ User တစ်ယောက်ချင်းစီအတွက် per-user schema တစ်ခုစီ ဖန်တီးပေးမယ်ဆိုရင် — PostgreSQL ကလည်း ဒီလိုပဲ ထိရောက်စွာ ပြုမူမှာ ဖြစ်ပါတယ်။

ဒါ့အပြင် — SQL standard မှာ `public` schema ဆိုတဲ့ အယူအဆလည်း မရှိပါဘူး။ Standard နဲ့ အမြင့်ဆုံး လိုက်လျောညီထွေဖြစ်မှု (conformance) ရှိစေဖို့ဆိုရင် — `public` schema ကို အသုံးမပြုသင့်ပါဘူး။

တချို့ SQL database system တွေမှာ schema တွေ လုံးဝ မပါဝင်တာမျိုး ဒါမှမဟုတ် — (အတိုင်းအတာ တစ်ခုအထိ ဖြစ်နိုင်တဲ့) cross-database access ကို ခွင့်ပြုပြီး namespace support ပေးတာမျိုး ရှိနိုင်ပါတယ်။ အဲဒီလို system တွေနဲ့ အလုပ်လုပ်ရမယ်ဆိုရင် — schema တွေကို လုံးဝ အသုံးမပြုတာက အမြင့်ဆုံး portability (ရွှေ့ပြောင်း အသုံးပြုနိုင်မှု) ကို ရရှိစေမှာ ဖြစ်ပါတယ်။
