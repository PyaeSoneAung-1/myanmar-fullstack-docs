---
title: "Table ကို Row တွေနဲ့ ဖြည့်ခြင်း"
description: "INSERT နဲ့ table ထဲ data ထည့်နည်း — column စာရင်း သတ်မှတ်ခြင်း၊ column ချန်လှပ်ခြင်း၊ COPY နဲ့ data အမြောက်အများ ထည့်ခြင်း"
order: 9
source: "https://www.postgresql.org/docs/current/tutorial-populate.html"
status: translated
updated: 2026-09-01
---

## Table ကို Row တွေနဲ့ ဖြည့်ခြင်း (INSERT)

Table ကို row တွေနဲ့ ဖြည့်ဖို့ `INSERT` statement ကို သုံးပါတယ်:

```sql
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');
```

Data type အားလုံးက အတော်လေး ထင်ရှားတဲ့ input format တွေကို သုံးတာ သတိပြုပါ။ ရိုးရိုး ဂဏန်း (numeric) တန်ဖိုး မဟုတ်တဲ့ constant တွေက — ဥပမာထဲမှာ ပြထားသလို — single quote (`'`) နဲ့ ဝိုင်းရံထားဖို့ များသောအားဖြင့် လိုပါတယ်။ `date` type က လက်ခံတဲ့ ပုံစံတွေ အတော် ပြောင်းလွယ်ပါတယ် — ဒါပေမယ့် ဒီ tutorial မှာတော့ ဒီမှာ ပြထားတဲ့ ရှင်းလင်းပြတ်သားတဲ့ format ကိုပဲ သုံးသွားပါမယ်။

`point` type က coordinate အတွဲကို input အဖြစ် လိုပါတယ် — ဒီမှာ ပြထားသလိုပါ:

```sql
INSERT INTO cities VALUES ('San Francisco', '(-194.0, 53.0)');
```

အခုထိ သုံးခဲ့တဲ့ syntax က column တွေရဲ့ အစဉ်လိုက်ကို မှတ်ထားဖို့ လိုပါတယ်။ တခြား syntax တစ်ခုကတော့ column တွေကို ရှင်းရှင်းလင်းလင်း စာရင်းထည့်ပြီး ရေးလို့ရပါတယ်:

```sql
INSERT INTO weather (city, temp_lo, temp_hi, prcp, date)
    VALUES ('San Francisco', 43, 57, 0.0, '1994-11-29');
```

Column တွေကို အစဉ်လိုက် မတူအောင် စီပြီးလည်း ရေးလို့ရသလို — column တချို့ကို ချန်လည်း ထားလို့ရပါတယ် — ဥပမာ မိုးရွာသွန်းမှု (precipitation) ကို မသိဘူးဆိုရင်:

```sql
INSERT INTO weather (date, city, temp_hi, temp_lo)
    VALUES ('1994-11-29', 'Hayward', 54, 37);
```

Developer အများစုက column တွေကို ရှင်းရှင်းလင်းလင်း စာရင်းထည့်တာကို — column အစဉ်ကို သွယ်ဝိုက် မှီခိုတာထက် — ပိုကောင်းတဲ့ style အဖြစ် သတ်မှတ်ပါတယ်။

အပေါ်က command တွေ အားလုံးကို ရိုက်ထည့်ပြီး — နောက် section တွေမှာ သုံးဖို့ data တချို့ အဆင်သင့် ရှိအောင် ပြင်ဆင်ထားပါ။

ပြီးတော့ — flat-text file တွေကနေ data အမြောက်အများ ထည့်ဖို့ `COPY` ကိုလည်း သုံးလို့ရပါတယ်။ `COPY` command က ဒီလို အလုပ်မျိုးအတွက် optimize လုပ်ထားလို့ — များသောအားဖြင့် ပိုမြန်ပြီး — `INSERT` လောက် ပြောင်းလွယ်မှု မရှိပါဘူး။ ဥပမာ:

```sql
COPY weather FROM '/home/user/weather.txt';
```

Source file ရဲ့ file name က — client မဟုတ်ဘဲ — backend process run နေတဲ့ machine ပေါ်မှာ ရှိရပါမယ် — backend process က file ကို တိုက်ရိုက် ဖတ်လို့ပါ။ အပေါ်မှာ weather table ထဲ ထည့်ထားတဲ့ data တွေကိုလည်း — (တန်ဖိုးတွေကို tab character နဲ့ ခြားထားတဲ့) file တစ်ခုကနေ ထည့်လို့ရပါတယ်:

```
San Francisco	46	50	0.25	1994-11-27
San Francisco	43	57	0.0	1994-11-29
Hayward	37	54	\N	1994-11-29
```

`COPY` command အကြောင်း ထပ်ပြီး လေ့လာချင်ရင် [COPY](https://www.postgresql.org/docs/current/sql-copy.html) reference page ကို ကြည့်ပါ။

## နောက်တစ်ဆင့်တွေ

- [Table တစ်ခုကို Query လုပ်ခြင်း](/docs/postgresql/querying-table) — ထည့်ထားတဲ့ data တွေကို ပြန်ဖတ်နည်း ဆက်လေ့လာပါ
- [Table အသစ် ဖန်တီးခြင်း](/docs/postgresql/creating-table) — table ဆောက်တာ ပြန်ကြည့်ချင်ရင်
- [SQL အခြေခံ](/docs/postgresql/sql-basics) — INSERT အကြောင်း အကျဉ်းချုပ် ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-populate.html
