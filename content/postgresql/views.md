---
title: "Views (မြင်ကွင်းများ)"
description: "View ဆိုတာ ဘာလဲ — CREATE VIEW နဲ့ query ကို နာမည်ပေးခြင်း၊ view တွေက table structure ကို encapsulate လုပ်နည်း"
order: 15
source: "https://www.postgresql.org/docs/current/tutorial-views.html"
status: translated
updated: 2026-09-01
---

## Views (မြင်ကွင်းများ)

[Section 2.6](/docs/postgresql/joins) က query တွေကို ပြန်ကြည့်ပါ။ ရာသီဥတု record တွေနဲ့ city ရဲ့ တည်နေရာ ပေါင်းစပ်ထားတဲ့ listing က သင့် application အတွက် အထူး အရေးပါတယ်ဆိုပါစို့ — ဒါပေမယ့် လိုအပ်တိုင်း query ကို ပြန်မရိုက်ချင်ပါဘူး။ Query အပေါ်မှာ *view* တစ်ခု ဖန်တီးလို့ရပါတယ် — ဒါက query ကို နာမည်ပေးလိုက်ပြီး — သာမန် table တစ်ခုလို ရည်ညွှန်းလို့ရတဲ့ နာမည် ဖြစ်ပါတယ်:

```sql
CREATE VIEW myview AS
    SELECT name, temp_lo, temp_hi, prcp, date, location
        FROM weather, cities
        WHERE city = name;

SELECT * FROM myview;
```

View တွေကို ကျယ်ကျယ်ပြန့်ပြန့် သုံးတာက SQL database design ကောင်းတစ်ခုရဲ့ အဓိက လက္ခဏာပါ။ View တွေက သင့် table တွေရဲ့ ဖွဲ့စည်းပုံ အသေးစိတ်တွေကို — application ကြီးထွားလာတာနဲ့အမျှ ပြောင်းလဲနိုင်တဲ့ အရာတွေကို — တသမတ်တည်း ရှိတဲ့ interface တွေရဲ့ နောက်မှာ ထုပ်ပိုး (encapsulate) လုပ်နိုင်စေပါတယ်။

View တွေကို တကယ့် table သုံးလို့ရတဲ့ နေရာ နီးပါးတိုင်းမှာ သုံးလို့ရပါတယ်။ View တွေအပေါ်မှာ တခြား view တွေ ဆောက်တာကလည်း မဆန်းပါဘူး။

## နောက်တစ်ဆင့်တွေ

- [Foreign Keys (နိုင်ငံခြား သော့များ)](/docs/postgresql/foreign-keys) — နောက် topic ဖြစ်တဲ့ foreign key အကြောင်း ဆက်လေ့လာပါ
- [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) — view ထဲက query ရဲ့ အခြေခံဖြစ်တဲ့ join ကို ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-views.html
