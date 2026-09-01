---
title: "Aggregate Functions များ"
description: "Aggregate function တွေနဲ့ data အကျဉ်းချုပ် တွက်ချက်နည်း — COUNT, SUM, AVG, MAX, MIN, GROUP BY, HAVING"
order: 4
source: "https://www.postgresql.org/docs/current/tutorial-agg.html"
status: translated
updated: 2026-09-01
---

## Aggregate Functions ဆိုတာ ဘာလဲ

**Aggregate function** က input row အများကြီးကနေ — ရလဒ် တစ်ခုတည်း တွက်ထုတ်ပေးတဲ့ function ပါ။ Row အစုတစ်ခုအပေါ်မှာ ရေတွက်တဲ့ `count`, ပေါင်းတဲ့ `sum`, ပျမ်းမျှ တွက်တဲ့ `avg` (average), အများဆုံး ရှာတဲ့ `max` (maximum), အနည်းဆုံး ရှာတဲ့ `min` (minimum) စတာတွေ ပါဝင်ပါတယ်။ ဥပမာ — `weather` table ထဲက အနိမ့်ဆုံး အပူချိန် တိုင်းတာချက်တွေထဲ အမြင့်ဆုံးကို ရှာကြည့်ရအောင်:

```sql
SELECT max(temp_lo) FROM weather;
```

ရလဒ်က `46` ပါ — row အားလုံးရဲ့ `temp_lo` တန်ဖိုးတွေထဲက အကြီးဆုံးပါ။

## Aggregate တွေကို WHERE မှာ သုံးလို့ မရဘူး

အဲဒီ အပူချိန် ဖြစ်ပွားခဲ့တဲ့ city ကို သိချင်ရင် ဒီလို ရေးချင်စိတ် ဖြစ်နိုင်ပါတယ်:

```sql
-- ဒီ query က မှားပါတယ် — WHERE ထဲမှာ aggregate သုံးလို့ မရပါဘူး
SELECT city FROM weather WHERE temp_lo = max(temp_lo);

-- Subquery နဲ့ ပြန်ရေးတဲ့အခါ အလုပ်လုပ်ပါတယ်
SELECT city FROM weather
    WHERE temp_lo = (SELECT max(temp_lo) FROM weather);
```

ပထမ query က အလုပ်မလုပ်ပါဘူး — `WHERE` clause က ဘယ် row တွေ aggregate တွက်ချက်မှုထဲ ပါဝင်မလဲ ဆုံးဖြတ်တာမို့ — aggregate တွေ တွက်ချိန်မတိုင်ခင် အရင်ဆုံး အကဲဖြတ်ရတဲ့အတွက်ပါ။ ဒါကြောင့် ဒုတိယ query လိုမျိုး **subquery** နဲ့ ပြန်ရေးလေ့ရှိပါတယ် — subquery က သီးခြား တွက်ချက်မှုတစ်ခုမို့ outer query နဲ့ သီးခြား ကိုယ်ပိုင် aggregate ကို တွက်နိုင်ပါတယ်။

## GROUP BY နဲ့ HAVING — အုပ်စုလိုက် တွက်ပြီး စစ်ထုတ်ခြင်း

Aggregate တွေက `GROUP BY` clause နဲ့ တွဲသုံးတဲ့အခါ အလွန် အသုံးဝင်ပါတယ်။ ဥပမာ — city တစ်ခုချင်းစီအတွက် တိုင်းတာချက် အရေအတွက် နဲ့ အမြင့်ဆုံး အနိမ့်ဆုံး အပူချိန်ကို ရယူကြည့်ရအောင် — ပြီးတော့ `temp_lo` တန်ဖိုး အားလုံး ၄၀ အောက်ရှိတဲ့ city တွေကိုပဲ ထားချင်ရင် `HAVING` နဲ့ ပြန်စစ်ထုတ်ပါမယ်:

```sql
SELECT city, count(*), max(temp_lo)
    FROM weather
    GROUP BY city;

-- HAVING နဲ့ ပြန်စစ်ထုတ်တဲ့အခါ
SELECT city, count(*), max(temp_lo)
    FROM weather
    GROUP BY city
    HAVING max(temp_lo) < 40;
```

ပထမ query က city တစ်ခုစီအတွက် output row တစ်ကြောင်းစီ ပြန်ပေးပြီး — aggregate တစ်ခုချင်းစီရဲ့ ရလဒ်ကို အဲဒီ city နဲ့ ကိုက်ညီတဲ့ row တွေပေါ်မှာ တွက်ပါတယ်။

`WHERE` နဲ့ `HAVING` ရဲ့ အခြေခံကွာခြားချက်က: `WHERE` က group/aggregate တွေ မတွက်ခင် input row တွေကို ရွေးပြီး (ဘယ် row တွေ aggregate ထဲ ဝင်မလဲ ထိန်းချုပ်တယ်) — `HAVING` ကတော့ group/aggregate တွေ တွက်ပြီးမှ group row တွေကို ရွေးပါတယ်။ ဒါကြောင့် `WHERE` ထဲမှာ aggregate function မပါရဘဲ — `HAVING` ထဲမှာတော့ aggregate ပါလေ့ရှိပါတယ်။ City နာမည်နဲ့ စစ်ချင်တာမျိုး aggregate မလိုတဲ့ အခြေအနေကို `WHERE` မှာ ထားတာက ပိုထိရောက်ပါတယ် — `WHERE city LIKE 'S%'` လိုမျိုးပေါ့ (`LIKE` က pattern matching အတွက်ပါ)။ ဒါဆိုရင် မလိုတဲ့ row တွေအတွက် group လုပ်တာ၊ aggregate တွက်တာ မလုပ်ရတော့လို့ ပိုမြန်ပါတယ်။

## COUNT DISTINCT နဲ့ FILTER — ရွေးပြီး ရေတွက်ခြင်း

Aggregate တစ်ခုရဲ့ input ကိုပဲ ရွေးချင်ရင် **FILTER** option ကို သုံးနိုင်ပါတယ် — ဥပမာ `count(*) FILTER (WHERE temp_lo < 45)` ဆိုရင် ၄၅ အောက် `temp_lo` ရှိတဲ့ row တွေကိုပဲ ရေတွက်ပြီး — တခြား aggregate တွေကတော့ row အားလုံးအပေါ် ဆက်တွက်နေပါတယ်။ နောက်တစ်နည်း — တန်ဖိုး ထပ်နေတာတွေကို ဖယ်ပြီး မတူတဲ့ တန်ဖိုး အရေအတွက်ကိုပဲ လိုချင်ရင် `COUNT(DISTINCT ...)` ကို သုံးပါတယ်: `SELECT count(DISTINCT city) FROM weather;` ဆိုရင် city ထပ်နေတာတွေ မရေတွက်ဘဲ — မတူညီတဲ့ city အရေအတွက်ကို ပြန်ပေးပါတယ်။

## GROUP BY ကို JOIN နဲ့ ပေါင်းသုံးခြင်း

Group by ကို join လုပ်ပြီးတဲ့ ရလဒ်တွေအပေါ်မှာလည်း သုံးလို့ရပါတယ် — [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) က `weather`/`cities` ဥပမာကို ပြန်သုံးပြီး city တစ်ခုချင်းစီရဲ့ တိုင်းတာချက် အရေအတွက်ကို တွက်ကြည့်ရအောင်:

```sql
SELECT cities.name, count(*)
    FROM weather JOIN cities ON weather.city = cities.name
    GROUP BY cities.name;
```

ဒါဆို join မှာ ကိုက်ညီမှု ရှိတဲ့ row တွေ အနည်းဆုံး တစ်ခုနဲ့ city တစ်ခုချင်းစီအတွက် — ကိုက်ညီတဲ့ row အရေအတွက်ကို ရပါမယ်။ GROUP BY က column မျိုးစုံနဲ့လည်း လုပ်လို့ရပြီး — `GROUP BY city, date` ဆိုရင် city နဲ့ date ပေါင်းစပ်မှု တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ရပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Transactions (အရောင်းအဝယ်)](/docs/postgresql/transactions) — data တွေ ယုံကြည်စိတ်ချရအောင် လုပ်ပေးတဲ့ transaction ကို ဆက်လေ့လာပါ
- [Indexes (အညွှန်း)](/docs/postgresql/indexes) — query တွေ မြန်အောင် index သုံးတာကို ဆက်လေ့လာပါ
- [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) — table တွေ ပေါင်းပြီး query လုပ်တာ ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-agg.html
