---
title: "JOIN နဲ့ Data ပေါင်းခြင်း"
description: "Table နှစ်ခုကို JOIN နဲ့ ပေါင်းပြီး query လုပ်နည်း — INNER/OUTER/CROSS JOIN, ON vs USING, self join နဲ့ alias"
order: 3
source: "https://www.postgresql.org/docs/current/tutorial-join.html"
status: translated
updated: 2026-09-01
---

## JOIN ဆိုတာ ဘာလဲ

အခုထိ ရေးခဲ့တဲ့ query တွေက table တစ်ခုတည်းကိုပဲ တစ်ချိန်မှာ သုံးခဲ့ပါတယ်။ ဒါပေမယ့် query တွေက table အများကြီးကို တစ်ချိန်တည်း သုံးလို့ရသလို — table တစ်ခုတည်းကိုပဲ သူ့ထဲက row အများကြီးကို တစ်ပြိုင်နက် process လုပ်တာမျိုးလည်း ရပါတယ်။ Table တစ်ခုထက်ပိုပြီး သုံးတဲ့ query တွေကို **join query** လို့ ခေါ်ပြီး — table တစ်ခုရဲ့ row တွေကို နောက် table တစ်ခုရဲ့ row တွေနဲ့ ဘယ် row ချင်း တွဲမလဲ သတ်မှတ်တဲ့ expression နဲ့အတူ ပေါင်းပေးပါတယ်။

ဥပမာ — weather record တိုင်းနဲ့အတူ အဲဒီ city ရဲ့ location ကိုပါ ပြန်လိုချင်တယ်ဆိုရင် database က `weather` table ရဲ့ row တစ်ခုချင်းစီမှာက `city` column ကို `cities` table ထဲက row အားလုံးရဲ့ `name` column နဲ့ နှိုင်းယှဉ်ပြီး — တန်ဖိုးချင်း တူတဲ့ row အတွဲတွေကို ရွေးပေးရပါတယ်။ (ဒါက သဘောတရား မြင်သာဖို့ ပြောတာပါ — တကယ်တမ်း join က row တွဲတိုင်း နှိုင်းယှဉ်တာထက် ပိုထိရောက်တဲ့ နည်းနဲ့ လုပ်ဆောင်ပါတယ်။)

## INNER JOIN (JOIN ... ON)

Table နှစ်ခုကို ပေါင်းတဲ့ အခြေခံအကျဆုံး နည်းကတော့ — ဘယ်ဘက်၊ ညာဘက် နှစ်ဖက်စလုံးမှာ ကိုက်ညီတဲ့ row တွေကိုပဲ ပြန်ပေးတဲ့ **INNER JOIN** ပါ။ `weather` နဲ့ `cities` ကို ပေါင်းကြည့်ရအောင်:

```sql
SELECT * FROM weather JOIN cities ON city = name;
```

ဒီ query မှာ `ON` နောက်က expression က join condition ပါ — `weather.city` တန်ဖိုးနဲ့ `cities.name` တန်ဖိုး တူတဲ့ row အတွဲတွေကိုပဲ ရွေးပေးပါတယ်။ ရလဒ်ကို ကြည့်ရင် အချက် နှစ်ချက် သတိထားစရာ ရှိပါတယ်:

- **Hayward ရဲ့ row မပါဘူး** — `cities` table ထဲမှာ Hayward အတွက် ကိုက်ညီတဲ့ row မရှိလို့ပါ။ Inner join က မကိုက်ညီတဲ့ row တွေကို ပစ်ပယ်ပါတယ်။
- **City နာမည်ပါတဲ့ column နှစ်ခု ပေါ်နေတယ်** — `weather` နဲ့ `cities` ရဲ့ column စာရင်းတွေ ဆက်စပ်ပြီး ပါလာလို့ပါ။ လက်တွေ့မှာ ဒါက မလိုလားအပ်တာမို့ column တွေကို သီးသန့် စာရင်းနဲ့ ရွေးတာ ပိုကောင်းပါတယ်:

```sql
SELECT city, temp_lo, temp_hi, prcp, date, location
    FROM weather JOIN cities ON city = name;

SELECT weather.city, weather.temp_lo, weather.temp_hi,
       weather.prcp, weather.date, cities.location
    FROM weather JOIN cities ON weather.city = cities.name;
```

Column နာမည်တွေ အကုန် မတူတဲ့အခါ parser က ဘယ် table က ဘယ် column လဲ အလိုအလျောက် သိပါတယ် — ဒါပေမယ့် table နှစ်ခုစလုံးမှာ နာမည်တူ column ရှိနေရင်တော့ column ကို ဘယ် table ကလဲ ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပေးဖို့လိုပါတယ် (ဒုတိယ query မှာ လုပ်ထားသလို)။ Join query မှာ column နာမည်တိုင်းကို ဒီလို qualify (table name နဲ့ တွဲသတ်မှတ်) လုပ်တာက — နောက်ပိုင်း နာမည်တူ column အသစ် ထပ်ပေါင်းလာရင်တောင် query က မပျက်တဲ့အတွက် — ကောင်းတဲ့ style အဖြစ် ကျယ်ကျယ်ပြန့်ပြန့် လက်ခံထားပါတယ်။

ဒီလို join တွေကို ပိုစောတုန်းက syntax နဲ့လည်း ရေးခဲ့ဖူးပါတယ် — `SELECT * FROM weather, cities WHERE city = name;` လိုမျိုး table တွေကို `FROM` ထဲမှာ စာရင်းထည့်ပြီး condition ကို `WHERE` ထဲ ရောထည့်တာပါ။ ဒီ syntax က `JOIN`/`ON` မပေါ်ခင် (SQL-92 မတိုင်ခင်) ကတည်းက ရှိခဲ့ပြီး — ရလဒ်ကတော့ အတူတူပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် join condition ကိုယ်ပိုင် keyword နဲ့ သီးခြား ပေါ်လွင်နေတဲ့ `JOIN`/`ON` syntax က query ဖတ်ရတာ ပိုရှင်းပါတယ်။

## LEFT / RIGHT OUTER JOIN

Inner join က မကိုက်ညီတဲ့ row တွေကို ပစ်ပယ်လို့ — Hayward ရဲ့ weather record တွေ ပျောက်နေပါတယ်။ ဒါတွေကို ပြန်ပါစေချင်ရင် **outer join** ကို သုံးရပါတယ်။ ဘယ်ဘက်က table ရဲ့ row တိုင်းကို အနည်းဆုံး တစ်ခါ ပြန်ပေးတဲ့ **left outer join** ကို ကြည့်ရအောင်:

```sql
SELECT *
    FROM weather LEFT OUTER JOIN cities ON weather.city = cities.name;
```

ဒီ query မှာ `weather` (ဘယ်ဘက်) ရဲ့ row တိုင်း ပါပြီး — `cities` (ညာဘက်) ကတော့ ကိုက်ညီတဲ့ row တွေပဲ ပါပါတယ်။ ဘယ်ဘက် row နဲ့ ကိုက်ညီတဲ့ ညာဘက် row မရှိရင် — ညာဘက် column တွေအတွက် null (ဗလာ) တန်ဖိုးတွေ အစားထိုးပါတယ်။ ဒါကြောင့် Hayward က `name` နဲ့ `location` ဗလာတွေနဲ့ ပြန်ပေါ်လာပါတယ်။ **RIGHT OUTER JOIN** က ဒီရဲ့ မှန်ဘီလူးပုံစံပါ — ညာဘက် table ရဲ့ row တိုင်း ပါပြီး ဘယ်ဘက်ကတော့ ကိုက်ညီတဲ့ဟာတွေပဲ ပါပါတယ်။ နှစ်ဖက်လုံးရဲ့ row တွေ ထားချင်ရင်တော့ **FULL OUTER JOIN** ကို သုံးနိုင်ပါတယ်။

## CROSS JOIN — ပေါင်းစပ်မှု အားလုံး

Join condition မပါဘဲ table နှစ်ခုကို ပေါင်းရင် — ဘယ်ဘက် row တိုင်းကို ညာဘက် row တိုင်းနဲ့ တွဲပေးတဲ့ **CROSS JOIN** ဖြစ်ပါတယ် (ဥပမာ `SELECT * FROM weather, cities;` ဆိုရင် row တွေရဲ့ ပေါင်းစပ်မှုတိုင်း ပြန်ပေးပါမယ်)။ ရလဒ်က ပေါင်းစပ်မှုအားလုံး ဖြစ်လို့ — row ရေ အလွန်များသွားနိုင်ပြီး အသုံးပြုမှု နည်းပါတယ်။

## ON vs USING — Join condition ရေးနည်း နှစ်မျိုး

`ON` က join condition ကို လွတ်လပ်စွာ ရေးလို့ရပြီး — column နာမည် မတူတဲ့အခါ (`weather.city` နဲ့ `cities.name` လိုမျိုး) မဖြစ်မနေ သုံးရပါတယ်။ ဒါပေမယ့် table နှစ်ခုစလုံးမှာ column နာမည် အတူတူရှိနေရင်တော့ `USING` နဲ့ ပိုတိုတိုရှင်းရှင်း ရေးလို့ရပြီး — အဲဒီ column က output မှာ တစ်ခါပဲ ပါပါတယ်: `FROM table_a JOIN table_b USING (id)` လိုမျိုးပါ။

## Self Join — Table ကို ကိုယ့်နဲ့ကိုယ် join လုပ်ခြင်း

Table တစ်ခုကို သူ့ဘာသာသူနဲ့လည်း join လုပ်လို့ရပါတယ် — ဒါကို **self join** လို့ ခေါ်ပါတယ်။ ဥပမာ — တခြား weather record တွေရဲ့ အပူချိန် အကွာအဝေးထဲ ကျရောက်နေတဲ့ weather record တွေကို ရှာချင်တယ်ဆိုရင် — `weather` row တစ်ခုစီရဲ့ `temp_lo`/`temp_hi` ကို တခြား `weather` row တွေရဲ့ `temp_lo`/`temp_hi` တွေနဲ့ နှိုင်းယှဉ်ရပါမယ်:

```sql
SELECT w1.city, w1.temp_lo AS low, w1.temp_hi AS high,
       w2.city, w2.temp_lo AS low, w2.temp_hi AS high
    FROM weather w1 JOIN weather w2
        ON w1.temp_lo < w2.temp_lo AND w1.temp_hi > w2.temp_hi;
```

ဒီမှာ `weather` table ကို `w1` (ဘယ်ဘက်) နဲ့ `w2` (ညာဘက်) ဆိုပြီး alias နှစ်ခု ခွဲပေးထားလို့ — join ရဲ့ ဘယ်/ညာ ဘယ်ဟာလဲ ခွဲခြားလို့ရပါတယ်။ ဒီလို alias မျိုးက စာရိုက်နည်းအောင် တခြား query တွေမှာလည်း သုံးပါတယ် — `SELECT * FROM weather w JOIN cities c ON w.city = c.name;` လိုမျိုး။ ဒီအတိုကောက် style ကို နေရာတော်တော်များများမှာ တွေ့ရပါလိမ့်မယ်။

## နောက်တစ်ဆင့်တွေ

- [Aggregate Functions များ](/docs/postgresql/aggregate) — GROUP BY နဲ့အတူ join ကို ပေါင်းသုံးတာတွေ ဆက်လေ့လာပါ
- [Transactions (အရောင်းအဝယ်)](/docs/postgresql/transactions) — data တွေ ယုံကြည်စိတ်ချရအောင် transaction အကြောင်း ဆက်လေ့လာပါ
- [SQL အခြေခံ](/docs/postgresql/sql-basics) — weather/cities table တွေ ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-join.html
