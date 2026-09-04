---
title: "CREATE TABLESPACE (tablespace အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "Cluster တစ်ခုလုံးအတွက် သက်ရောက်မည့် tablespace အသစ်တစ်ခုကို မှတ်ပုံတင်ခြင်း — tablespace_name ၊ user_name ၊ directory ၊ tablespace_option စသည့် parameter များနှင့် ဥပမာများ — PostgreSQL extension command"
order: 280
source: "https://www.postgresql.org/docs/current/sql-createtablespace.html"
status: translated
updated: 2026-09-04
---

## CREATE TABLESPACE (tablespace အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE TABLESPACE — tablespace အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE TABLESPACE tablespace_name
    [ OWNER { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER } ]
    LOCATION 'directory'
    [ WITH ( tablespace_option = value [, ... ] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TABLESPACE` က cluster တစ်ခုလုံးအတွက် သက်ရောက်မယ့် tablespace အသစ်တစ်ခုကို မှတ်ပုံတင် (register) လုပ်ပေးပါတယ်။ Tablespace နာမည်က — database cluster ထဲမှာ ရှိပြီးသား tablespace တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီရပါမယ်။

Tablespace တစ်ခုက superusers တွေကို — database objects တွေ (ဥပမာ — tables နဲ့ indexes) ပါဝင်တဲ့ data files တွေ နေရာချနိုင်တဲ့ — file system ပေါ်က အခြားနေရာ (alternative location) တစ်ခုကို သတ်မှတ်နိုင်စေပါတယ်။

သင့်လျော်တဲ့ privileges ရှိတဲ့ user တစ်ဦးက — ဒီ objects တွေအတွက် data files တွေကို သတ်မှတ်ထားတဲ့ tablespace ထဲမှာ သိမ်းဆည်းစေဖို့ — `CREATE DATABASE`, `CREATE TABLE`, `CREATE INDEX` ဒါမှမဟုတ် `ADD CONSTRAINT` တွေဆီကို `tablespace_name` ကို ပေးပို့နိုင်ပါတယ်။

> **သတိပေးချက်:** Tablespace တစ်ခုကို — ၎င်းကို သတ်မှတ်ထားတဲ့ cluster နဲ့ သီးခြား လွတ်လပ်စွာ သုံးလို့ မရပါဘူး; [အပိုင်း 22.6](https://www.postgresql.org/docs/current/manage-ag-tablespaces.html) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **tablespace_name** — ဖန်တီးရမယ့် tablespace တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ ဒီလို နာမည်တွေက system tablespaces တွေအတွက် သီးသန့် သတ်မှတ်ထားလို့ — နာမည်က `pg_` နဲ့ စလို့ မရပါဘူး။
- **user_name** — Tablespace ကို ပိုင်ဆိုင်မယ့် user ရဲ့ နာမည် ဖြစ်ပါတယ်။ ချန်လှပ်ထားရင် — command ကို execute လုပ်နေတဲ့ user ကို default အနေနဲ့ သတ်မှတ်ပါတယ်။ Tablespaces တွေကို superusers တွေကပဲ ဖန်တီးနိုင်ပေမယ့် — tablespaces တွေရဲ့ ပိုင်ဆိုင်မှုကိုတော့ non-superusers တွေဆီကို ပေးအပ်နိုင်ပါတယ်။
- **directory** — Tablespace အတွက် သုံးမယ့် directory ဖြစ်ပါတယ်။ Directory က ရှိပြီးသား ဖြစ်ရမယ် (`CREATE TABLESPACE` က ၎င်းကို ဖန်တီးပေးမှာ မဟုတ်ပါဘူး)၊ ဗလာ (empty) ဖြစ်သင့်ပြီး — PostgreSQL system user က ပိုင်ဆိုင်ထားရပါမယ်။ Directory ကို absolute path name (လမ်းကြောင်း အပြည့်အစုံ) နဲ့ သတ်မှတ်ရပါမယ်။
- **tablespace_option** — Set လုပ်ရန် သို့မဟုတ် reset လုပ်ရန် tablespace parameter တစ်ခု ဖြစ်ပါတယ်။ လောလောဆယ် — ရနိုင်တဲ့ parameter တွေက seq_page_cost, random_page_cost, effective_io_concurrency နဲ့ maintenance_io_concurrency တို့ပဲ ဖြစ်ပါတယ်။ ဒီတန်ဖိုးတွေကို tablespace တစ်ခုအတွက် သတ်မှတ်လိုက်ရင် — အဲဒီ tablespace ထဲက tables တွေကနေ pages တွေ ဖတ်ရတဲ့ ကုန်ကျစရိတ်နဲ့ — ထုတ်ပေးတဲ့ concurrent I/O အရေအတွက်တို့အတွက် — planner (စီစဉ်သူ) ရဲ့ ပုံမှန် ခန့်မှန်းချက်ကို — နာမည်တူ configuration parameters တွေနဲ့ သတ်မှတ်ထားတဲ့အတိုင်း — override (ကျော်လွန် အစားထိုး) လုပ်ပါလိမ့်မယ် (seq_page_cost, random_page_cost, effective_io_concurrency, maintenance_io_concurrency တို့ကို ကြည့်ပါ)။ Tablespace တစ်ခုက I/O subsystem ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေထက် — ပိုမြန်တဲ့ ဒါမှမဟုတ် ပိုနှေးတဲ့ disk တစ်ခုပေါ်မှာ တည်ရှိနေရင် — ဒါက အသုံးဝင်နိုင်ပါတယ်။

## Notes (မှတ်စုများ)

`CREATE TABLESPACE` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

## Examples (ဥပမာများ)

`dbspace` tablespace ကို file system နေရာ `/data/dbs` မှာ ဖန်တီးဖို့ — ပထမဆုံး operating system facilities တွေကို သုံးပြီး directory ကို ဖန်တီးပြီး — မှန်ကန်တဲ့ ownership (ပိုင်ဆိုင်မှု) ကို သတ်မှတ်ပါ:

```sql
mkdir /data/dbs
chown postgres:postgres /data/dbs
```

ပြီးရင် PostgreSQL အတွင်းမှာ tablespace ဖန်တီးခြင်း command ကို ထုတ်ပြန်ပါ:

```sql
CREATE TABLESPACE dbspace LOCATION '/data/dbs';
```

တခြား database user တစ်ဦးက ပိုင်ဆိုင်တဲ့ tablespace တစ်ခုကို ဖန်တီးဖို့ — အောက်ပါအတိုင်း command တစ်ခုကို သုံးပါ:

```sql
CREATE TABLESPACE indexspace OWNER genevieve LOCATION '/data/indexes';
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE TABLESPACE` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE DATABASE](/docs/postgresql/sql-createdatabase), [CREATE TABLE](/docs/postgresql/sql-createtable), [CREATE INDEX](/docs/postgresql/sql-createindex), [DROP TABLESPACE](/docs/postgresql/sql-droptablespace), [ALTER TABLESPACE](/docs/postgresql/sql-altertablespace)
