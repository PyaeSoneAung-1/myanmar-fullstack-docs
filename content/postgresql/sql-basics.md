---
title: "SQL အခြေခံ"
description: "SQL ဆိုတာ ဘာလဲ — CREATE TABLE, INSERT, SELECT, UPDATE, DELETE — psql နဲ့ လက်တွေ့ စမ်းကြည့်မယ်"
order: 2
source: "https://www.postgresql.org/docs/current/tutorial-sql.html"
status: translated
updated: 2026-09-01
---

## SQL ဆိုတာ ဘာလဲ

**SQL** (Structured Query Language) က relational database တွေနဲ့ ပြောဆို
ဆက်သွယ်ဖို့ သုံးတဲ့ standard language ပါ — data တွေ ဖန်တီး, ဖတ်, ပြင်, ဖျက်ဖို့
အားလုံး SQL command တွေနဲ့ပဲ လုပ်ရပါတယ်။ PostgreSQL က SQL standard ကို
ကျယ်ကျယ်ပြန့်ပြန့် ထောက်ပံ့ထားလို့ — ဒီမှာ လေ့လာတဲ့ command တွေက
database အမျိုးမျိုးမှာလည်း အလားတူ အလုပ်လုပ်ပါတယ်။

psql ထဲမှာ SQL command တစ်ခုကို semicolon (`;`) နဲ့ အဆုံးသတ်ရပါတယ် —
semicolon မရောက်မချင်း psql က command ကို မလုပ်ဆောင်ပါဘူး။ SQL မှာ
keyword တွေက case-insensitive (အကြီး/အသေး မရွေး) ဖြစ်ပြီး `--` နဲ့
comment ရေးလို့ရပါတယ်။

## Table ဖန်တီးခြင်း (CREATE TABLE)

Table အသစ် ဖန်တီးဖို့ `CREATE TABLE` ကို သုံးပြီး — table name, column
name နဲ့ column တစ်ခုချင်းစီရဲ့ data type ကို သတ်မှတ်ရပါတယ်။ ဥပမာ
မိုးလေဝသ data တွေ သိမ်းမယ့် `weather` table:

```sql
CREATE TABLE weather (
    city    varchar(80),
    temp_lo int,    -- အနိမ့်ဆုံး အပူချိန်
    temp_hi int,    -- အမြင့်ဆုံး အပူချိန်
    prcp    real,   -- မိုးရွာသွန်းမှု ပမာဏ
    date    date
);
```

ဒီမှာ `varchar(80)` က စာလုံးရေ 80 အထိ သိမ်းလို့ရတဲ့ text type, `int` က
ကိန်းပြည့်, `real` က ဒသမကိန်း (floating point), `date` က ရက်စွဲ ဖြစ်ပါတယ်။
ဒါတွေက standard SQL type တွေဖြစ်ပြီး PostgreSQL မှာ `smallint`, `double
precision`, `timestamp`, `interval` စတဲ့ type တွေလည်း ရှိပါသေးတယ်။
Table ကို မလိုတော့ရင် `DROP TABLE weather;` နဲ့ ဖျက်လို့ရပါတယ်။

## Row တွေ ထည့်ခြင်း (INSERT)

Table ထဲကို data (row) တွေ ထည့်ဖို့ `INSERT INTO` ကို သုံးပါတယ်:

```sql
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');
```

String တန်ဖိုးတွေကို single quote (`'...'`) နဲ့ ရေးရပါတယ်။ Column တွေကို
သီးသန့်စာရင်း ထည့်ပြီး ရေးချင်ရင် (ဒါက ပိုရှင်းပြီး ပိုကောင်းတဲ့ style ပါ):

```sql
INSERT INTO weather (city, temp_lo, temp_hi, prcp, date)
    VALUES ('San Francisco', 43, 57, 0.0, '1994-11-29');
```

ဒီနည်းနဲ့ column အစဉ်လိုက် မမှတ်မိရဘဲ — ထည့်ချင်တဲ့ column တွေကို
ရွေးထည့်လို့ရပါတယ်။

## Query လုပ်ခြင်း (SELECT)

Data တွေကို ပြန်ဖတ်ဖို့ `SELECT` ကို သုံးပါတယ်။ Table တစ်ခုလုံးရဲ့
column အားလုံးကို ကြည့်ချင်ရင် `*` (all columns အတွက် shorthand) ကို
သုံးပါတယ်:

```sql
SELECT * FROM weather;
```

Column တချို့ပဲ ရွေးဖို့ ဒါမှမဟုတ် column တွေကြား တွက်ချက်ပြီး `AS` နဲ့
အမည်ပေးဖို့လည်း ရပါတယ် — ဥပမာ ပျမ်းမျှ အပူချိန် တွက်ကြည့်ရအောင်:

```sql
SELECT city, (temp_hi+temp_lo)/2 AS temp_avg, date FROM weather;
```

`WHERE` clause က လိုချင်တဲ့ row တွေကိုပဲ ရွေးဖို့ သုံးပြီး — comparison
operator (`=`, `>`, `<` စသည်) တွေနဲ့ `AND`, `OR`, `NOT` ဆိုတဲ့ Boolean
operator တွေကို ပေါင်းသုံးလို့ရပါတယ်:

```sql
SELECT * FROM weather
    WHERE city = 'San Francisco' AND prcp > 0.0;
```

ဒါက San Francisco မှာ မိုးရွာခဲ့တဲ့ row တွေကိုပဲ ပြန်ပေးပါတယ်။

## Data ပြင်ဆင်ခြင်း (UPDATE)

ရှိပြီးသား row တွေရဲ့ တန်ဖိုးတွေကို ပြောင်းဖို့ `UPDATE` ကို သုံးပါတယ် —
ဥပမာ နိုဝင်ဘာ ၂၈ ရက်နောက်ပိုင်း အပူချိန် တိုင်းတာချက်တွေက ၂ ဒီဂရီ
လွဲနေတယ်လို့ သိလို့ပြင်တာမျိုး:

```sql
UPDATE weather
    SET temp_hi = temp_hi - 2,  temp_lo = temp_lo - 2
    WHERE date > '1994-11-28';
```

`WHERE` မထည့်မိရင် table ထဲက row အားလုံးကို ပြောင်းပစ်မှာမို့ — သတိထားပြီး
သုံးရပါမယ်။

## Row ဖျက်ခြင်း (DELETE)

Row တွေကို ဖျက်ဖို့ `DELETE` ကို သုံးပါတယ်:

```sql
DELETE FROM weather WHERE city = 'Hayward';
```

ဒါက Hayward ရဲ့ weather row တွေ အားလုံးကို ဖျက်ပါတယ်။ ဒီမှာလည်း
`WHERE` မပါရင် row အားလုံး ဖျက်ခံရမှာ ဖြစ်ပြီး — system က မေးခွန်းထုတ်
မပေးပါဘူး။ Table ကိုယ်တိုင်ကတော့ ကျန်နေမှာမို့ — table တစ်ခုလုံး ဖျက်ချင်ရင်
`DELETE` အစား `DROP TABLE` ကို သုံးရပါမယ်။

## နောက်တစ်ဆင့်တွေ

- Joins (table နှစ်ခု ပေါင်းပြီး query လုပ်တာ) နဲ့ aggregate function တွေ
  (`COUNT`, `AVG` စသည်) — official docs မှာ ဆက်လေ့လာပါ
- [PostgreSQL မိတ်ဆက်](/docs/postgresql/getting-started) — psql နဲ့ database
  ဖန်တီးတာတွေ ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-sql.html
