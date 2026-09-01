---
title: "Inheritance (အမွေဆက်ခံခြင်း)"
description: "Table inheritance ဆိုတာ ဘာလဲ — INHERITS clause နဲ့ parent/child table၊ ONLY keyword သုံးပြီး query လုပ်နည်း"
order: 17
source: "https://www.postgresql.org/docs/current/tutorial-inheritance.html"
status: translated
updated: 2026-09-01
---

## Inheritance (အမွေဆက်ခံခြင်း)

Inheritance က object-oriented database တွေကနေ လာတဲ့ သဘောတရား တစ်ခုပါ။ ဒါက database design အတွက် စိတ်ဝင်စားစရာ ဖြစ်နိုင်ခြေ အသစ်တွေ ဖွင့်ပေးပါတယ်။

Table နှစ်ခု ဖန်တီးကြည့်ရအောင်: `cities` table တစ်ခုနဲ့ `capitals` table တစ်ခု။ သဘာဝအရ capitals တွေဟာလည်း cities တွေ ဖြစ်လို့ — city အားလုံး စာရင်းပြတဲ့အခါ capitals တွေကိုပါ implicit (သွယ်ဝိုက်) အနေနဲ့ ပြစေချင်ပါတယ်။ သင်က တော်တယ်ဆိုရင် ဒီလိုမျိုး scheme တစ်ခု တီထွင်မိနိုင်ပါတယ်:

```sql
CREATE TABLE capitals (
  name       text,
  population real,
  elevation  int,    -- (ပေဖြင့်)
  state      char(2)
);

CREATE TABLE non_capitals (
  name       text,
  population real,
  elevation  int     -- (ပေဖြင့်)
);

CREATE VIEW cities AS
  SELECT name, population, elevation FROM capitals
    UNION
  SELECT name, population, elevation FROM non_capitals;
```

ဒါက query လုပ်ရတာနဲ့ ပတ်သက်ရင် အဆင်ပြေပါတယ် — ဒါပေမယ့် row တွေ အများကြီးကို update လုပ်ရတဲ့အခါမျိုးမှာ ရှုပ်ထွေးလာပါတယ် — ဒါက အချက်တစ်ချက်ပါ။

ဒီထက် ပိုကောင်းတဲ့ အဖြေကတော့ ဒီလိုပါ:

```sql
CREATE TABLE cities (
  name       text,
  population real,
  elevation  int     -- (ပေဖြင့်)
);

CREATE TABLE capitals (
  state      char(2) UNIQUE NOT NULL
) INHERITS (cities);
```

ဒီအခြေအနေမှာ `capitals` ရဲ့ row တစ်ခုက column အားလုံး (`name`, `population`, `elevation`) ကို သူ့ရဲ့ *parent* ဖြစ်တဲ့ `cities` ကနေ *အမွေရယူ* (inherit) ပါတယ်။ `name` column ရဲ့ type က `text` ဖြစ်ပြီး — variable length စာလုံး string တွေအတွက် PostgreSQL ရဲ့ native type တစ်ခုပါ။ `capitals` table မှာ `state` ဆိုတဲ့ နောက်ထပ် column တစ်ခု ရှိပြီး — ဒါက state ရဲ့ အတိုကောက်ကို ပြပါတယ်။ PostgreSQL မှာ table တစ်ခုက တခြား table သုညခု ဒါမှမဟုတ် အများကြီးကနေ အမွေရယူလို့ရပါတယ်။

ဥပမာ — အောက်ပါ query က ပေ ၅၀၀ အထက် မြင့်တဲ့နေရာမှာ တည်ရှိတဲ့ city အားလုံး — state capital တွေ အပါအဝင် — ရဲ့ နာမည်တွေကို ရှာပေးပါတယ်:

```sql
SELECT name, elevation
  FROM cities
  WHERE elevation > 500;
```

ဒါက ပြန်ပေးတာက:

```
   name    | elevation
-----------+-----------
 Las Vegas |      2174
 Mariposa  |      1953
 Madison   |       845
(3 rows)
```

တဖက်မှာတော့ အောက်ပါ query က state capital မဟုတ်တဲ့ — ပေ ၅၀၀ အထက် မြင့်တဲ့ — city တွေ အားလုံးကို ရှာပါတယ်:

```sql
SELECT name, elevation
    FROM ONLY cities
    WHERE elevation > 500;
```

ဒါက ပြန်ပေးတာက:

```
   name    | elevation
-----------+-----------
 Las Vegas |      2174
 Mariposa  |      1953
(2 rows)
```

ဒီမှာ `cities` ရဲ့ ရှေ့က `ONLY` က — query ကို `cities` table ပေါ်မှာပဲ run စေပြီး — inheritance အဆင့်ဆင့်မှာ `cities` ရဲ့ အောက်က table တွေအပေါ်မှာ မဟုတ်ဘူးဆိုတာ ညွှန်ပြပါတယ်။ အပေါ်မှာ ဆွေးနွေးပြီးသား command တွေ အများကြီး — `SELECT`, `UPDATE`, `DELETE` — က ဒီ `ONLY` notation ကို ထောက်ပံ့ပါတယ်။

> **မှတ်စု:** Inheritance က မကြာခဏ အသုံးဝင်ပေမယ့် — unique constraint တွေ ဒါမှမဟုတ် foreign key တွေနဲ့တော့ ပေါင်းစပ်မထားလို့ — သူ့ရဲ့ အသုံးဝင်မှုကို ကန့်သတ်ထားပါတယ်။ အသေးစိတ်အတွက် [Section 5.11](https://www.postgresql.org/docs/current/ddl-inherit.html) ကို ကြည့်ပါ။

## နောက်တစ်ဆင့်တွေ

- [Conclusion (နိဂုံး)](/docs/postgresql/conclusion) — tutorial ရဲ့ နောက်ဆုံး ပိုင်းကို ဆက်လေ့လာပါ
- [Window Functions (ဝင်းဒိုး လုပ်ဆောင်ချက်များ)](/docs/postgresql/window-functions) — အရင် topic ကို ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-inheritance.html
