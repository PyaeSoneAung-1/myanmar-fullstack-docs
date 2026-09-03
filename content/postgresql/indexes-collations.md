---
title: "Indexes and Collations (index နဲ့ collation များ)"
description: "Index column တစ်ခုစီအတွက် collation တစ်ခုတည်းကိုပဲ ထောက်ပံ့နိုင်တာကြောင့် — collation အမျိုးမျိုး လိုအပ်ရင် index အများအပြား လိုအပ်ပုံနဲ့ index က အောက်ခံ column ရဲ့ collation ကို အလိုအလျောက် သုံးပုံ"
order: 78
source: "https://www.postgresql.org/docs/current/indexes-collations.html"
status: translated
updated: 2026-09-03
---

## 11.11. Indexes and Collations (index နဲ့ collation များ)

Index တစ်ခုက index column တစ်ခုစီအတွက် collation (စာလုံးများကို စီစဉ် နှိုင်းယှဉ်သည့် စည်းမျဉ်း) တစ်ခုတည်းကိုပဲ ထောက်ပံ့နိုင်ပါတယ်။ Collation အများအပြား အရေးပါတယ်ဆိုရင် — index အများအပြား လိုအပ်နိုင်ပါတယ်။

ဒီ statement တွေကို ကြည့်ပါ —

```sql
CREATE TABLE test1c (
    id integer,
    content varchar COLLATE "x"
);

CREATE INDEX test1c_content_index ON test1c (content);
```

Index က အောက်ခံ column ရဲ့ collation ကို အလိုအလျောက် သုံးပါတယ်။ ဒါကြောင့် ဒီပုံစံရဲ့ query တစ်ခုက

```sql
SELECT * FROM test1c WHERE content > constant;
```

index ကို သုံးနိုင်ပါတယ် — အကြောင်းကတော့ comparison (နှိုင်းယှဉ်မှု) က ပုံမှန်အားဖြင့် column ရဲ့ collation ကို သုံးမှာ ဖြစ်လို့ပါ။ ဒါပေမယ့် — ဒီ index က တခြား collation တစ်ခုခု ပါဝင်တဲ့ query တွေကိုတော့ အရှိန်မြှင့် မပေးနိုင်ပါဘူး။ ဒါကြောင့် — ဥပမာ —

```sql
SELECT * FROM test1c WHERE content > constant COLLATE "y";
```

ဆိုတဲ့ ပုံစံ query တွေလည်း အရေးပါနေတယ်ဆိုရင် — `"y"` collation ကို ထောက်ပံ့တဲ့ နောက်ထပ် index တစ်ခုကို ဒီလို ဖန်တီးနိုင်ပါတယ်:

```sql
CREATE INDEX test1c_content_y_index ON test1c (content COLLATE "y");
```
