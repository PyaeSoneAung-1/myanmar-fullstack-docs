---
title: "VALUES Lists (VALUES စာရင်းများ)"
description: "VALUES list ဆိုတာနဲ့ constant table (ပုံသေတန်ဖိုး table) အနေနဲ့ သုံးနည်း — column နာမည် သတ်မှတ်ခြင်းအပြင် SELECT သုံးလို့ရတဲ့ နေရာတိုင်းမှာ သုံးနိုင်ပုံ အကြောင်း"
order: 46
source: "https://www.postgresql.org/docs/current/queries-values.html"
status: translated
updated: 2026-09-03
---

## 7.7. `VALUES` Lists (VALUES စာရင်းများ)

`VALUES` က — disk ပေါ်မှာ table တစ်ခုကို အမှန်တကယ် ဖန်တီးပြီး data တွေ ဖြည့်စရာ မလိုဘဲ — query တစ်ခုထဲမှာ သုံးလို့ရတဲ့ constant table (ပုံသေ တန်ဖိုးတွေ ပါဝင်တဲ့ table) တစ်ခုကို ထုတ်လုပ်ဖို့ နည်းလမ်းတစ်ခု ပေးပါတယ်။ Syntax ကတော့:

```sql
VALUES ( expression [, ...] ) [, ...]
```

Parenthesis နဲ့ ဝိုင်းထားတဲ့ expression စာရင်းတစ်ခုချင်းစီက — table ထဲမှာ row တစ်ခုကို ထုတ်လုပ်ပါတယ်။ စာရင်းတွေအားလုံးမှာ — element အရေအတွက် အတူတူ ရှိရပါမယ် (ဆိုလိုတာက — table ထဲက column အရေအတွက်နဲ့ ညီရပါမယ်) — ပြီးတော့ စာရင်းတစ်ခုစီထဲက တစ်နေရာချင်းစီ ကိုက်ညီတဲ့ entry တွေမှာ — လိုက်ဖက်ညီတဲ့ (compatible) data type တွေ ရှိရပါမယ်။ ရလဒ်ရဲ့ column တစ်ခုချင်းစီအတွက် သတ်မှတ်ပေးမယ့် တကယ့် data type ကိုတော့ — `UNION` အတွက် သုံးတဲ့ စည်းမျဉ်း အတိုင်းပဲ ဆုံးဖြတ်ပါတယ် ([အပိုင်း 10.5](https://www.postgresql.org/docs/current/typeconv-union-case.html) ကို ကြည့်ပါ)။

ဥပမာအနေနဲ့:

```sql
VALUES (1, 'one'), (2, 'two'), (3, 'three');
```

ဒီ query က column နှစ်ခုနဲ့ row သုံးခု ပါတဲ့ table တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ၎င်းက အောက်ပါအတိုင်း ရေးသားတာနဲ့ တကယ်တော့ ညီမျှပါတယ်:

```sql
SELECT 1 AS column1, 'one' AS column2
UNION ALL
SELECT 2, 'two'
UNION ALL
SELECT 3, 'three';
```

Default အနေနဲ့ — PostgreSQL က `VALUES` table ရဲ့ column တွေကို `column1`, `column2`, စသဖြင့် နာမည်တွေ သတ်မှတ်ပေးပါတယ်။ Column နာမည်တွေကို SQL standard က သတ်မှတ်ပေးထားခြင်း မရှိဘဲ — database system အမျိုးမျိုးမှာ မတူညီတဲ့ နည်းတွေနဲ့ လုပ်ဆောင်တတ်လို့ — default နာမည်တွေကို table alias စာရင်း (alias list) တစ်ခုနဲ့ ကျော်လွှားပြီး သတ်မှတ်လိုက်တာက များသောအားဖြင့် ပိုကောင်းပါတယ် — ဒီလိုမျိုး:

```
=> SELECT * FROM (VALUES (1, 'one'), (2, 'two'), (3, 'three')) AS t (num,letter);
 num | letter
-----+--------
   1 | one
   2 | two
   3 | three
(3 rows)
```

Syntax (ဝါကျဖွဲ့စည်းပုံ) အရ — expression list တွေ နောက်မှာ လိုက်တဲ့ `VALUES` ကို အောက်ပါနဲ့ ညီမျှတယ်လို့ သတ်မှတ် ဆက်ဆံပါတယ်:

```sql
SELECT select_list FROM table_expression
```

ပြီးတော့ ၎င်းကို `SELECT` ပေါ်လာနိုင်တဲ့ နေရာတိုင်းမှာ သုံးလို့ ရပါတယ်။ ဥပမာ — `UNION` တစ်ခုရဲ့ အစိတ်အပိုင်း အနေနဲ့ ဖြစ်စေ — `sort_specification` (`ORDER BY`, `LIMIT`, နဲ့/သို့မဟုတ် `OFFSET`) တစ်ခုကို တွဲဆက်ပြီး ဖြစ်စေ — သုံးနိုင်ပါတယ်။ `VALUES` ကို အသုံးအများဆုံး နေရာကတော့ — `INSERT` command တစ်ခုထဲမှာ data source (ဒေတာ ရင်းမြစ်) အနေနဲ့ ဖြစ်ပြီး — ဒုတိယ အသုံးအများဆုံးကတော့ subquery တစ်ခုအနေနဲ့ ဖြစ်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [VALUES](https://www.postgresql.org/docs/current/sql-values.html) command ရဲ့ reference page ကို ကြည့်ပါ။
