---
title: "Data ဖျက်ခြင်း (DELETE)"
description: "DELETE command နဲ့ row တွေ ဖျက်နည်း — WHERE မပါဘဲ သုံးရင် row အားလုံး ဖျက်ခံရမယ့် သတိပေးချက်"
order: 12
source: "https://www.postgresql.org/docs/current/tutorial-delete.html"
status: translated
updated: 2026-09-01
---

## Data ဖျက်ခြင်း (DELETE)

Table ထဲက row တွေကို `DELETE` command နဲ့ ဖျက်လို့ရပါတယ်။ Hayward ရဲ့ ရာသီဥတု (weather) record တွေကို မလိုတော့ဘူးဆိုပါစို့ — table ထဲက အဲဒီ row တွေကို ဖျက်ဖို့ အောက်ပါအတိုင်း လုပ်နိုင်ပါတယ်:

```sql
DELETE FROM weather WHERE city = 'Hayward';
```

Hayward နဲ့ ဆိုင်တဲ့ weather record တွေ အားလုံး ဖယ်ရှားလိုက်ပါပြီ။

```sql
SELECT * FROM weather;
```

```
     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      41 |      55 |    0 | 1994-11-29
(2 rows)
```

အောက်ပါပုံစံ statement တွေကို သတိထားသင့်ပါတယ်:

```sql
DELETE FROM tablename;
```

Qualification (ကန့်သတ်ချက်) မပါဘဲ — `DELETE` က table ထဲက row တွေ *အားလုံးကို* ဖယ်ရှားပြီး table ကို ဗလာ ဖြစ်စေပါတယ်။ ဒါကို မလုပ်ခင် system က အတည်ပြုချက် မေးမှာ မဟုတ်ပါဘူး!

## နောက်တစ်ဆင့်တွေ

- [Aggregate Functions များ](/docs/postgresql/aggregate) — data အကျဉ်းချုပ် တွက်ချက်တာ ဆက်လေ့လာပါ
- [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) — table တွေ ပေါင်းပြီး query လုပ်တာ ဆက်လေ့လာပါ
- [Transactions (အရောင်းအဝယ်)](/docs/postgresql/transactions) — data ဖျက်တာတွေ ဘေးကင်းလုံခြုံအောင် transaction အကြောင်း ဆက်လေ့လာပါ
- Official docs: https://www.postgresql.org/docs/current/tutorial-delete.html
