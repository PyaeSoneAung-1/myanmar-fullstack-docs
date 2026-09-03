---
title: "Enumerated Types (enum type များ)"
description: "Enum type များ — CREATE TYPE AS ENUM ဖြင့် ကြေညာခြင်း, value အစဉ်လိုက် စီခြင်း/နှိုင်းယှဉ်ခြင်း, type safety, ALTER TYPE ဖြင့် label ပြင်ခြင်း"
order: 54
source: "https://www.postgresql.org/docs/current/datatype-enum.html"
status: translated
updated: 2026-09-03
---

## 8.7. Enumerated Types (enum type များ)

- **8.7.1. Declaration of Enumerated Types (enum type များ ကြေညာခြင်း)**
- **8.7.2. Ordering (အစဉ်လိုက် စီခြင်း)**
- **8.7.3. Type Safety (type လုံခြုံမှု)**
- **8.7.4. Implementation Details (အကောင်အထည်ဖော်မှု အသေးစိတ်များ)**

Enumerated (enum) type တွေက — static (ပုံသေ) ဖြစ်ပြီး အစဉ်လိုက် စီထားတဲ့ value အစုအဝေး တစ်ခု ပါဝင်တဲ့ data types တွေ ဖြစ်ပါတယ်။ ၎င်းတို့ဟာ programming language တွေ အများအပြားမှာ ပံ့ပိုးထားတဲ့ `enum` type တွေနဲ့ ညီမျှပါတယ်။ Enum type တစ်ခုရဲ့ ဥပမာကတော့ — တစ်ပတ်ရဲ့ ရက်တွေ (days of the week) ဒါမှမဟုတ် data တစ်ခုအတွက် status value အစုအဝေး တစ်ခု ဖြစ်နိုင်ပါတယ်။

### 8.7.1. Declaration of Enumerated Types (enum type များ ကြေညာခြင်း)

Enum type တွေကို [CREATE TYPE](https://www.postgresql.org/docs/current/sql-createtype.html) command နဲ့ ဖန်တီးပါတယ်။ ဥပမာ:

```sql
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
```

Enum type ကို ဖန်တီးပြီးတာနဲ့ — တခြား type တွေလိုပဲ — table နဲ့ function definition တွေမှာ သုံးနိုင်ပါတယ်:

```sql
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
CREATE TABLE person (
    name text,
    current_mood mood
);
INSERT INTO person VALUES ('Moe', 'happy');
SELECT * FROM person WHERE current_mood = 'happy';
 name | current_mood
------+--------------
 Moe  | happy
(1 row)
```

### 8.7.2. Ordering (အစဉ်လိုက် စီခြင်း)

Enum type တစ်ခုထဲက value တွေရဲ့ အစဉ်က — type ကို ဖန်တီးတုန်းက value တွေကို စာရင်းပြုစုခဲ့တဲ့ အစဉ်အတိုင်း ဖြစ်ပါတယ်။ Standard comparison operator တွေ အားလုံးနဲ့ ဆက်စပ်နေတဲ့ aggregate function တွေကို enum တွေအတွက် ပံ့ပိုးပေးပါတယ်။ ဥပမာ:

```sql
INSERT INTO person VALUES ('Larry', 'sad');
INSERT INTO person VALUES ('Curly', 'ok');
SELECT * FROM person WHERE current_mood > 'sad';
 name  | current_mood
-------+--------------
 Moe   | happy
 Curly | ok
(2 rows)

SELECT * FROM person WHERE current_mood > 'sad' ORDER BY current_mood;
 name  | current_mood
-------+--------------
 Curly | ok
 Moe   | happy
(2 rows)

SELECT name
FROM person
WHERE current_mood = (SELECT MIN(current_mood) FROM person);
 name
-------
 Larry
(1 row)
```

### 8.7.3. Type Safety (type လုံခြုံမှု)

Enumerated data type တစ်ခုစီဟာ သီးခြားစီ ဖြစ်ပြီး — တခြား enumerated type တွေနဲ့ နှိုင်းယှဉ်လို့ မရပါဘူး။ ဒီဥပမာကို ကြည့်ပါ:

```sql
CREATE TYPE happiness AS ENUM ('happy', 'very happy', 'ecstatic');
CREATE TABLE holidays (
    num_weeks integer,
    happiness happiness
);
INSERT INTO holidays(num_weeks,happiness) VALUES (4, 'happy');
INSERT INTO holidays(num_weeks,happiness) VALUES (6, 'very happy');
INSERT INTO holidays(num_weeks,happiness) VALUES (8, 'ecstatic');
INSERT INTO holidays(num_weeks,happiness) VALUES (2, 'sad');
ERROR:  invalid input value for enum happiness: "sad"
SELECT person.name, holidays.num_weeks FROM person, holidays
  WHERE person.current_mood = holidays.happiness;
ERROR:  operator does not exist: mood = happiness
```

အဲဒီလို တစ်ခုခု တကယ် လုပ်ဆောင်ဖို့ လိုအပ်ခဲ့ရင် — custom operator (ကိုယ်ပိုင် operator) တစ်ခု ရေးနိုင်သလို — ဒါမှမဟုတ် ကိုယ့် query ထဲမှာ explicit casts (အတိအကျ သတ်မှတ်သော cast များ) ထည့်သွင်းနိုင်ပါတယ်:

```sql
SELECT person.name, holidays.num_weeks FROM person, holidays
  WHERE person.current_mood::text = holidays.happiness::text;
 name | num_weeks
------+-----------
 Moe  |         4
(1 row)
```

### 8.7.4. Implementation Details (အကောင်အထည်ဖော်မှု အသေးစိတ်များ)

Enum label တွေက case-sensitive (စာလုံးကြီး/ငယ် ခွဲခြားသတ်မှတ်သည်) ဖြစ်လို့ — `'happy'` က `'HAPPY'` နဲ့ မတူပါဘူး။ Label တွေထဲမှာ ပါဝင်တဲ့ white space (နေရာလပ်) တွေကလည်း အဓိပ္ပာယ် ရှိပါတယ်။

Enum type တွေကို အဓိကအားဖြင့် static (ပုံသေ) value အစုအဝေးတွေအတွက် ရည်ရွယ်ထားပေမယ့် — ရှိပြီးသား enum type တစ်ခုထဲကို value အသစ်တွေ ပေါင်းထည့်ခြင်းနဲ့ value တွေကို နာမည်ပြောင်းခြင်းတွေအတွက်တော့ ပံ့ပိုးပေးထားပါတယ် ([ALTER TYPE](https://www.postgresql.org/docs/current/sql-altertype.html) ကို ကြည့်ပါ)။ Enum type တစ်ခုကို drop လုပ်ပြီး ပြန်လည် ဖန်တီးတာကလွဲလို့ — ရှိပြီးသား value တွေကို enum type ထဲကနေ ဖယ်ရှားလို့ မရသလို — အဲဒီ value တွေရဲ့ sort ordering (စီစဉ်မှု အစဉ်) ကိုလည်း ပြောင်းလဲလို့ မရပါဘူး။

Enum value တစ်ခုက disk ပေါ်မှာ 4 bytes နေရာ ယူပါတယ်။ Enum value တစ်ခုရဲ့ textual label (စာသား label) ရဲ့ အလျားကို — PostgreSQL ထဲမှာ compile လုပ်ထည့်သွင်းထားတဲ့ `NAMEDATALEN` setting က ကန့်သတ်ပါတယ်; standard builds တွေမှာ ဒါက အများဆုံး 63 bytes ဖြစ်ပါတယ်။

Internal enum value တွေကနေ textual label တွေကို ပြောင်းလဲပေးတဲ့ (mapping) အချက်အလက်တွေကို system catalog [`pg_enum`](https://www.postgresql.org/docs/current/catalog-pg-enum.html) ထဲမှာ သိမ်းဆည်းထားပါတယ်။ ဒီ catalog ကို တိုက်ရိုက် query လုပ်တာက အသုံးဝင်နိုင်ပါတယ်။
