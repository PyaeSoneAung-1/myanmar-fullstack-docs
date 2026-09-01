---
title: "Data ပြင်ဆင်ခြင်း (UPDATE)"
description: "UPDATE command နဲ့ ရှိပြီးသား row တွေရဲ့ တန်ဖိုးတွေ ပြောင်းလဲနည်း — နိုဝင်ဘာ ၂၈ ရက်နောက်ပိုင်း အပူချိန် တိုင်းတာချက်တွေ ပြင်တဲ့ ဥပမာ"
order: 11
source: "https://www.postgresql.org/docs/current/tutorial-update.html"
status: translated
updated: 2026-09-01
---

## Data ပြင်ဆင်ခြင်း (UPDATE)

ရှိပြီးသား row တွေကို `UPDATE` command နဲ့ ပြင်လို့ရပါတယ်။ နိုဝင်ဘာ ၂၈ ရက်နောက်ပိုင်း အပူချိန် တိုင်းတာချက်တွေက ၂ ဒီဂရီ လွဲနေတယ်လို့ သိလိုက်ရတယ်ဆိုပါစို့ — data ကို အောက်ပါအတိုင်း ပြင်လို့ရပါတယ်:

```sql
UPDATE weather
    SET temp_hi = temp_hi - 2,  temp_lo = temp_lo - 2
    WHERE date > '1994-11-28';
```

Data ရဲ့ အခြေအနေ အသစ်ကို ကြည့်ရအောင်:

```sql
SELECT * FROM weather;
```

```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      41 |      55 |    0 | 1994-11-29
 Hayward       |      35 |      52 |      | 1994-11-29
(3 rows)
```

## နောက်တစ်ဆင့်တွေ

- [Data ဖျက်ခြင်း (DELETE)](/docs/postgresql/deleting-data) — row တွေ ဖျက်နည်း ဆက်လေ့လာပါ
- [Table တစ်ခုကို Query လုပ်ခြင်း](/docs/postgresql/querying-table) — SELECT နဲ့ data ပြန်ကြည့်တာ ပြန်လေ့ကျင့်ချင်ရင်
- [Transactions (အရောင်းအဝယ်)](/docs/postgresql/transactions) — data ပြင်ဆင်မှုတွေ ယုံကြည်စိတ်ချရအောင် transaction အကြောင်း ဆက်လေ့လာပါ
- Official docs: https://www.postgresql.org/docs/current/tutorial-update.html
