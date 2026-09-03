---
title: "Combining Queries (query များ ပေါင်းစပ်ခြင်း)"
description: "Query များကို ပေါင်းစပ်ခြင်း — UNION/INTERSECT/EXCEPT set operations တွေနဲ့ query ပေါင်းနည်း, duplicate row ဖယ်ရှားခြင်း, parentheses နဲ့ တွက်ချက်မှု အစဉ် ထိန်းချုပ်ခြင်း"
order: 43
source: "https://www.postgresql.org/docs/current/queries-union.html"
status: translated
updated: 2026-09-03
---

## 7.4. Combining Queries (query များ ပေါင်းစပ်ခြင်း)

Query နှစ်ခုရဲ့ ရလဒ်တွေကို — set operations (set လုပ်ဆောင်ချက်များ) ဖြစ်တဲ့ union (ပေါင်းစည်းခြင်း), intersection (ထပ်ဆုံခြင်း) နဲ့ difference (ကွာခြားချက်) တို့ကို သုံးပြီး — ပေါင်းစပ်နိုင်ပါတယ်။ Syntax ကတော့ ဒီလိုပါ:

```sql
query1 UNION [ALL] query2
query1 INTERSECT [ALL] query2
query1 EXCEPT [ALL] query2
```

ဒီမှာ `query1` နဲ့ `query2` တို့ဟာ — ဒီအထိ ဆွေးနွေးခဲ့တဲ့ feature (လုပ်ဆောင်ချက်) တွေကို ကြိုက်သလို သုံးနိုင်တဲ့ query တွေ ဖြစ်ပါတယ်။

`UNION` က `query2` ရဲ့ ရလဒ်ကို `query1` ရဲ့ ရလဒ်ရဲ့ နောက်မှာ ထိရောက်စွာ ဆက်တွဲ (append) လုပ်ပေးပါတယ် — ဒါပေမယ့် — row တွေကို တကယ် ပြန်ပေးတဲ့ အစဉ်က အဲဒီအတိုင်း ဖြစ်လိမ့်မယ်လို့တော့ အာမခံချက် မရှိပါဘူး။ ဒါ့အပြင် — `UNION ALL` ကို မသုံးထားဘူးဆိုရင် — `DISTINCT` လိုပဲ — ရလဒ်ထဲက duplicate row (ထပ်နေသော row) တွေကိုလည်း ဖယ်ရှားပေးပါတယ်။

`INTERSECT` က `query1` ရဲ့ ရလဒ်ထဲမှာရော `query2` ရဲ့ ရလဒ်ထဲမှာပါ ပါဝင်နေတဲ့ row အားလုံးကို ပြန်ပေးပါတယ်။ `INTERSECT ALL` ကို မသုံးရင် duplicate row တွေကို ဖယ်ရှားပါတယ်။

`EXCEPT` က `query1` ရဲ့ ရလဒ်ထဲမှာ ပါဝင်ပေမယ့် — `query2` ရဲ့ ရလဒ်ထဲမှာ မပါဝင်တဲ့ row အားလုံးကို ပြန်ပေးပါတယ်။ (ဒါကို query နှစ်ခုကြားရဲ့ *difference* (ကွာခြားချက်) လို့လည်း တခါတရံ ခေါ်ပါတယ်။) အဲဒီမှာလည်း — `EXCEPT ALL` ကို မသုံးရင် — duplicate တွေကို ဖယ်ရှားပါတယ်။

Query နှစ်ခုရဲ့ union, intersection ဒါမှမဟုတ် difference ကို တွက်ချက်နိုင်ဖို့ဆိုရင် — query နှစ်ခုဟာ “union compatible” (union လုပ်ရန် လိုက်ဖက်သော) ဖြစ်ရပါတယ် — ဆိုလိုတာက — column အရေအတွက် အတူတူ ပြန်ပေးပြီး — သက်ဆိုင်ရာ (corresponding) column တွေရဲ့ data type တွေ လိုက်ဖက် (compatible) ရမှာ ဖြစ်ပါတယ် — [အပိုင်း 10.5](https://www.postgresql.org/docs/current/typeconv-union-case.html) မှာ ဖော်ပြထားတဲ့အတိုင်းပါ။

Set operations တွေကို ပေါင်းစပ်ပြီးလည်း သုံးနိုင်ပါတယ် — ဥပမာ:

```sql
query1 UNION query2 EXCEPT query3
```

ဆိုတာ အောက်က ပုံစံနဲ့ ညီမျှပါတယ်:

```sql
(query1 UNION query2) EXCEPT query3
```

ဒီမှာ ပြထားတဲ့အတိုင်း — evaluation (တွက်ချက်ခြင်း) ရဲ့ အစဉ်ကို ထိန်းချုပ်ဖို့ parentheses (ကွင်းစကွင်းပိတ်) တွေကို သုံးနိုင်ပါတယ်။ Parentheses မပါဘဲ ရေးရင် — `UNION` နဲ့ `EXCEPT` တို့က ဘယ်ကနေ ညာဘက်ကို အစဉ်လိုက် စုစည်း (associate) ပေမယ့် — `INTERSECT` ကတော့ အဲဒီ operator နှစ်ခုထက်ပိုပြီး တင်းကျပ်စွာ ချိတ်ဆက် (bind) ပါတယ်။ ဒါကြောင့်:

```sql
query1 UNION query2 INTERSECT query3
```

ဆိုတာ —

```sql
query1 UNION (query2 INTERSECT query3)
```

ကို ဆိုလိုပါတယ်။

`query` တစ်ခုချင်းစီကိုလည်း parentheses တွေနဲ့ ဝန်းရံလို့ ရပါတယ်။ နောက် section တွေမှာ ဆွေးနွေးမယ့် clause တွေထဲက — ဥပမာ — `LIMIT` လိုမျိုးကို `query` က သုံးစရာ လိုအပ်ရင် ဒါက အရေးကြီးပါတယ်။ Parentheses မပါဘဲ ရေးရင် — syntax error ရနိုင်သလို — ဒါမှမဟုတ် — clause ကို set operation ရဲ့ input (ထည့်သွင်းမှု) တစ်ခုခုအတွက် မဟုတ်ဘဲ — set operation ရဲ့ output (ထုတ်ပေးမှု) ကို သက်ရောက်တဲ့အနေနဲ့ မှတ်ယူခံရတာမျိုးလည်း ဖြစ်နိုင်ပါတယ်။ ဥပမာ:

```sql
SELECT a FROM b UNION SELECT x FROM y LIMIT 10
```

ကို လက်ခံပါတယ် — ဒါပေမယ့် — ဒါက:

```sql
(SELECT a FROM b UNION SELECT x FROM y) LIMIT 10
```

ကို ဆိုလိုတာ ဖြစ်ပြီး —

```sql
SELECT a FROM b UNION (SELECT x FROM y LIMIT 10)
```

ကို မဆိုလိုပါဘူး။
