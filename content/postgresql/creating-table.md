---
title: "Table အသစ် ဖန်တီးခြင်း"
description: "CREATE TABLE နဲ့ table အသစ် ဆောက်နည်း — column နဲ့ data type သတ်မှတ်ခြင်း၊ varchar/int/real/date, point type, DROP TABLE"
order: 8
source: "https://www.postgresql.org/docs/current/tutorial-table.html"
status: translated
updated: 2026-09-01
---

## Table အသစ် ဖန်တီးခြင်း (CREATE TABLE)

Table အသစ် ဖန်တီးဖို့ — table name, column name အားလုံး နဲ့ column တစ်ခုချင်းစီရဲ့ type တွေကို သတ်မှတ်ပေးရပါတယ်:

```sql
CREATE TABLE weather (
    city            varchar(80),
    temp_lo         int,           -- အနိမ့်ဆုံး အပူချိန်
    temp_hi         int,           -- အမြင့်ဆုံး အပူချိန်
    prcp            real,          -- မိုးရွာသွန်းမှု ပမာဏ
    date            date
);
```

ဒါကို `psql` ထဲမှာ line break တွေနဲ့ ရိုက်ထည့်လို့ရပါတယ် — semicolon မရောက်မချင်း `psql` က command ကို အဆုံးသတ်ပြီလို့ မမှတ်ယူပါဘူး။

SQL command တွေမှာ white space (space, tab, newline) တွေကို လွတ်လပ်စွာ သုံးလို့ရပါတယ် — ဆိုလိုတာက command ကို အပေါ်ကလို မဟုတ်ဘဲ တခြားပုံစံ စီထားလို့ရသလို — line တစ်ကြောင်းတည်းမှာတောင် အကုန် ရေးလို့ရပါတယ်။ Dashes နှစ်ခု (`--`) က comment တွေကို စတင်ပြီး — အဲဒီနောက်က စာတွေကို line အဆုံးအထိ လျစ်လျူရှုပါတယ်။ SQL က keyword တွေနဲ့ identifier တွေအပေါ်မှာ case-insensitive (အကြီး/အသေး မရွေး) ဖြစ်ပြီး — identifier တွေကို double quote နဲ့ ပတ်ပြီး case ကို ထိန်းထားတဲ့အခါမှာတော့ ချွင်းချက် ဖြစ်ပါတယ် (အပေါ်မှာ မလုပ်ထားပါဘူး)။

`varchar(80)` က အရှည် စာလုံးရေ 80 အထိ ရှိတဲ့ စာသား (character string) အတွက် သိမ်းလို့ရတဲ့ data type ကို သတ်မှတ်ပါတယ်။ `int` က ပုံမှန် ကိန်းပြည့် type ပါ။ `real` က single precision floating-point ကိန်းတွေ သိမ်းတဲ့ type ပါ။ `date` ကတော့ ရှင်းပြစရာ မလိုအောင် ထင်ရှားပါတယ်။ (ဟုတ်ပါတယ် — `date` type ရဲ့ column ကိုလည်း `date` လို့ပဲ နာမည်ပေးထားပါတယ်။ ဒါက အဆင်ပြေစေသလို — ရှုပ်ထွေးစေတာလည်း ဖြစ်နိုင်ပါတယ် — သင်ရွေးပါ။)

PostgreSQL က standard SQL type တွေဖြစ်တဲ့ `int`, `smallint`, `real`, `double precision`, `char(N)`, `varchar(N)`, `date`, `time`, `timestamp`, `interval` တွေအပြင် — ယေဘုယျ အသုံးဝင်တဲ့ တခြား type တွေနဲ့ ကြွယ်ဝတဲ့ geometric type အစုတွေကိုပါ ထောက်ပံ့ပါတယ်။ PostgreSQL ကို user-defined data type တွေ မည်မျှမဆို ထပ်ဖန်တီးပြီး customize လုပ်လို့ရပါတယ်။ ဒါကြောင့် type name တွေက syntax ထဲမှာ keyword တွေ မဟုတ်ပါဘူး — SQL standard ထဲက အထူး အခြေအနေတွေ ထောက်ပံ့ဖို့ လိုအပ်တဲ့ နေရာမျိုးမှာပဲ ချွင်းချက် ဖြစ်ပါတယ်။

ဒုတိယ ဥပမာက city တွေနဲ့ သူတို့ရဲ့ ပထဝီဝင် location တွေကို သိမ်းမှာပါ:

```sql
CREATE TABLE cities (
    name            varchar(80),
    location        point
);
```

`point` type က PostgreSQL မှာပဲ ရှိတဲ့ (PostgreSQL-specific) data type ရဲ့ ဥပမာ တစ်ခုပါ။

နောက်ဆုံးအနေနဲ့ — table ကို မလိုတော့ဘူး ဒါမှမဟုတ် ပုံစံပြောင်းပြီး ပြန်ဖန်တီးချင်ရင် — အောက်ပါ command နဲ့ ဖယ်ရှားလို့ရပါတယ်:

```sql
DROP TABLE tablename;
```

## နောက်တစ်ဆင့်တွေ

- [Table ကို Row တွေနဲ့ ဖြည့်ခြင်း](/docs/postgresql/populating-table) — table ထဲ data ထည့်နည်း ဆက်လေ့လာပါ
- [Database ဖန်တီးခြင်း](/docs/postgresql/creating-db) — database မဖန်တီးရသေးရင် အရင်ဆုံး ဒီကနေ စပါ
- [SQL အခြေခံ](/docs/postgresql/sql-basics) — CREATE TABLE အကြောင်း အကျဉ်းချုပ် ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-table.html
