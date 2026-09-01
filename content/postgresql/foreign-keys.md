---
title: "Foreign Keys (နိုင်ငံခြား သော့များ)"
description: "Foreign key ဆိုတာ ဘာလဲ — weather/cities ဥပမာ၊ primary key နဲ့ references clause သုံးပြီး referential integrity ထိန်းသိမ်းခြင်း"
order: 14
source: "https://www.postgresql.org/docs/current/tutorial-fk.html"
status: translated
updated: 2026-09-01
---

## Foreign Keys (နိုင်ငံခြား သော့များ)

[Chapter 2](/docs/postgresql/sql-basics) က `weather` နဲ့ `cities` table တွေကို ပြန်သတိရပါ။ ဒီပြဿနာကို စဉ်းစားကြည့်ပါ: `cities` table ထဲမှာ ကိုက်ညီတဲ့ entry မရှိတဲ့ row တွေကို `weather` table ထဲ ဘယ်သူမှ ထည့်လို့မရအောင် သေချာစေချင်တယ်ဆိုပါစို့။ ဒါကို data ရဲ့ *referential integrity* (ရည်ညွှန်း ဆက်စပ်မှု ခိုင်မာခြင်း) ကို ထိန်းသိမ်းတယ်လို့ ခေါ်ပါတယ်။ ရိုးရှင်းတဲ့ database system တွေမှာ ဒါကို (လုပ်မယ်ဆိုရင်) `cities` table ထဲမှာ ကိုက်ညီတဲ့ record ရှိမရှိ အရင်ကြည့်ပြီး — `weather` record အသစ်တွေကို ထည့်မယ် ဒါမှမဟုတ် ပယ်မယ်ဆိုပြီး လုပ်ပါတယ်။ ဒီနည်းလမ်းက ပြဿနာ များစွာ ရှိပြီး အရမ်း အဆင်မပြေပါဘူး — ဒါကြောင့် PostgreSQL က ဒါကို သင့်အတွက် လုပ်ပေးပါတယ်။

Table တွေရဲ့ အသစ် ကြေညာချက် (declaration) က ဒီလို ဖြစ်ပါမယ်:

```sql
CREATE TABLE cities (
        name     varchar(80) primary key,
        location point
);

CREATE TABLE weather (
        city      varchar(80) references cities(name),
        temp_lo   int,
        temp_hi   int,
        prcp      real,
        date      date
);
```

အခု invalid (မမှန်ကန်တဲ့) record တစ်ခု ထည့်ကြည့်ပါ:

```sql
INSERT INTO weather VALUES ('Berkeley', 45, 53, 0.0, '1994-11-28');
```

ရလဒ်က:

```
ERROR:  insert or update on table "weather" violates foreign key constraint "weather_city_fkey"
DETAIL:  Key (city)=(Berkeley) is not present in table "cities".
```

Foreign key တွေရဲ့ အပြုအမူကို သင့် application နဲ့ ကိုက်ညီအောင် သေချာစွာ ချိန်ညှိလို့ရပါတယ်။ ဒီ tutorial မှာ ဒီရိုးရှင်းတဲ့ ဥပမာထက် မပိုတော့ပါဘူး — နောက်ထပ် အချက်အလက်တွေအတွက် [Chapter 5](https://www.postgresql.org/docs/current/ddl.html) ကို ညွှန်းလိုက်ပါတယ်။ Foreign key တွေကို မှန်ကန်စွာ သုံးတာက သင့် database application တွေရဲ့ အရည်အသွေးကို သေချာပေါက် တိုးတက်စေမှာမို့ — အဲဒါတွေကို လေ့လာဖို့ အထူး တိုက်တွန်းပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Transactions (အရောင်းအဝယ်)](/docs/postgresql/transactions) — foreign keys နောက်က နောက် topic ဖြစ်တဲ့ transaction အကြောင်း ဆက်လေ့လာပါ
- [Views (မြင်ကွင်းများ)](/docs/postgresql/views) — အရင် topic ကို ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-fk.html
