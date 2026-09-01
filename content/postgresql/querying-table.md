---
title: "Table တစ်ခုကို Query လုပ်ခြင်း"
description: "SELECT နဲ့ data ပြန်ဖတ်နည်း — select list, expression နဲ့ AS, WHERE စစ်ထုတ်ခြင်း, ORDER BY စီခြင်း, DISTINCT ထပ်နေမှု ဖယ်ခြင်း"
order: 10
source: "https://www.postgresql.org/docs/current/tutorial-select.html"
status: translated
updated: 2026-09-01
---

## Table တစ်ခုကို Query လုပ်ခြင်း (SELECT)

Table ထဲက data တွေကို ပြန်ရဖို့ table ကို *query* လုပ်ပါတယ် — ဒါအတွက် SQL `SELECT` statement ကို သုံးပါတယ်။ Statement ကို — select list (ဘယ် column တွေ ပြန်ပေးမလဲ စာရင်းပြတဲ့ အပိုင်း), table list (ဘယ် table တွေကနေ data ယူမလဲ စာရင်းပြတဲ့ အပိုင်း), နဲ့ optional ဖြစ်တဲ့ qualification (ကန့်သတ်ချက်တွေ သတ်မှတ်တဲ့ အပိုင်း) ဆိုပြီး ပိုင်းခြားထားပါတယ်။ ဥပမာ — `weather` table ရဲ့ row တွေ အားလုံး ပြန်ယူချင်ရင် ဒီလို ရိုက်ထည့်ပါ:

```sql
SELECT * FROM weather;
```

ဒီမှာ `*` က "column အားလုံး" အတွက် shorthand ပါ။[1] ဒါကြောင့် အောက်ပါအတိုင်း ရေးရင်လည်း ရလဒ် အတူတူပါပဲ:

```sql
SELECT city, temp_lo, temp_hi, prcp, date FROM weather;
```

Output ကတော့:

```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      43 |      57 |    0 | 1994-11-29
 Hayward       |      37 |      54 |      | 1994-11-29
(3 rows)
```

Select list ထဲမှာ — column reference အရိုးရိုးတွေ မဟုတ်ဘဲ — expression တွေလည်း ရေးလို့ရပါတယ်။ ဥပမာ ဒီလို လုပ်နိုင်ပါတယ်:

```sql
SELECT city, (temp_hi+temp_lo)/2 AS temp_avg, date FROM weather;
```

ဒါဆို ရလဒ်က:

```
     city      | temp_avg |    date
---------------+----------+------------
 San Francisco |       48 | 1994-11-27
 San Francisco |       50 | 1994-11-29
 Hayward       |       45 | 1994-11-29
(3 rows)
```

`AS` clause က output column ရဲ့ နာမည်ကို ပြောင်းဖို့ သုံးတာ သတိပြုပါ။ (`AS` clause က optional ပါ။)

Query ကို — ဘယ် row တွေ လိုချင်လဲ သတ်မှတ်တဲ့ `WHERE` clause ထည့်ပြီး "qualify" (ကန့်သတ်) လုပ်လို့ရပါတယ်။ `WHERE` clause မှာ Boolean (အမှန်/အမှား တန်ဖိုး) expression ပါပြီး — Boolean expression အမှန် (true) ဖြစ်တဲ့ row တွေကိုပဲ ပြန်ပေးပါတယ်။ ပုံမှန် Boolean operator တွေဖြစ်တဲ့ `AND`, `OR`, `NOT` တွေကို qualification ထဲမှာ သုံးခွင့် ရှိပါတယ်။ ဥပမာ — အောက်ပါ query က San Francisco မှာ မိုးရွာတဲ့ နေ့တွေရဲ့ ရာသီဥတုကို ပြန်ပေးပါတယ်:

```sql
SELECT * FROM weather
    WHERE city = 'San Francisco' AND prcp > 0.0;
```

ရလဒ်:

```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
(1 row)
```

Query ရဲ့ ရလဒ်တွေကို စီထားတဲ့ အစဉ် (sorted order) နဲ့ ပြန်ခိုင်းလို့လည်း ရပါတယ်:

```sql
SELECT * FROM weather
    ORDER BY city;
```

```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 Hayward       |      37 |      54 |      | 1994-11-29
 San Francisco |      43 |      57 |    0 | 1994-11-29
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
```

ဒီဥပမာမှာ sort order က အပြည့်အဝ သတ်မှတ်မထားလို့ — San Francisco ရဲ့ row နှစ်ခုက ဘယ်အစဉ်အတိုင်းမဆို ထွက်လာနိုင်ပါတယ်။ ဒါပေမယ့် အောက်ပါအတိုင်း လုပ်ရင်တော့ အပေါ်က ရလဒ်ကိုပဲ အမြဲ ရပါလိမ့်မယ်:

```sql
SELECT * FROM weather
    ORDER BY city, temp_lo;
```

Query ရဲ့ ရလဒ်ထဲက ထပ်နေတဲ့ row တွေကို ဖယ်ခိုင်းလို့လည်း ရပါတယ်:

```sql
SELECT DISTINCT city
    FROM weather;
```

```
     city
---------------
 Hayward
 San Francisco
(2 rows)
```

ဒီမှာလည်း ရလဒ် row တွေရဲ့ အစဉ်က ပြောင်းလဲနိုင်ပါတယ်။ `DISTINCT` နဲ့ `ORDER BY` ကို အတူတွဲသုံးပြီး တသမတ်တည်း ဖြစ်တဲ့ ရလဒ်ကို ရယူနိုင်ပါတယ်:[2]

```sql
SELECT DISTINCT city
    FROM weather
    ORDER BY city;
```

> **[1] မှတ်စု:** `SELECT *` က လက်တန်း (off-the-cuff) query တွေအတွက် အသုံးဝင်ပေမယ့် — production code မှာတော့ မကောင်းတဲ့ style အဖြစ် ကျယ်ကျယ်ပြန့်ပြန့် သတ်မှတ်ထားပါတယ် — table ထဲ column အသစ် ထပ်ထည့်လိုက်တာနဲ့ ရလဒ်တွေ ပြောင်းသွားလို့ပါ။
>
> **[2] မှတ်စု:** database system တချို့မှာ — PostgreSQL ရဲ့ အဟောင်း version တွေ အပါအဝင် — `DISTINCT` ရဲ့ implementation က row တွေကို အလိုအလျောက် စီပေးလို့ `ORDER BY` မလိုပါဘူး။ ဒါပေမယ့် ဒါက SQL standard အရ မလိုအပ်ပါဘူး — လက်ရှိ PostgreSQL ကလည်း `DISTINCT` ကြောင့် row တွေ စီသွားမယ်လို့ အာမခံချက် မပေးပါဘူး။

## နောက်တစ်ဆင့်တွေ

- [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) — table နှစ်ခုကို ပေါင်းပြီး query လုပ်တာ ဆက်လေ့လာပါ
- [Table ကို Row တွေနဲ့ ဖြည့်ခြင်း](/docs/postgresql/populating-table) — query လုပ်ဖို့ data ထည့်တာ ပြန်ကြည့်ချင်ရင်
- [Aggregate Functions များ](/docs/postgresql/aggregate) — data အကျဉ်းချုပ် တွက်ချက်တာ ဆက်လေ့လာပါ
- Official docs: https://www.postgresql.org/docs/current/tutorial-select.html
