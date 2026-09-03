---
title: "Sorting Rows (row များ စီခြင်း)"
description: "Query ရလဒ် row များကို ORDER BY နဲ့ စီခြင်း — sort expression (များ), ASC/DESC (စီစဉ်မှု ဦးတည်ချက်), NULLS FIRST/LAST (null value ရှေ့/နောက် နေရာချခြင်း), output column name သို့မဟုတ် နံပါတ်ဖြင့် စီခြင်း"
order: 44
source: "https://www.postgresql.org/docs/current/queries-order.html"
status: translated
updated: 2026-09-03
---

## 7.5. Sorting Rows (row များ စီခြင်း)

Query တစ်ခုက output table (ရလဒ် table) တစ်ခုကို ထုတ်လုပ်ပြီးသွားပြီဆိုရင် (select list ကို လုပ်ဆောင်ပြီးနောက်) — ၎င်းကို စီထားဖို့ ရွေးချယ်နိုင်ပါတယ်။ စီခြင်းကို ရွေးချယ်မထားရင် — row တွေကို ကြိုတင် သတ်မှတ်ထားခြင်း မရှိတဲ့ အစဉ်နဲ့ ပြန်ပေးမှာ ဖြစ်ပါတယ်။ အဲဒီအခါမှာ တကယ့် အစဉ်က — scan နဲ့ join plan အမျိုးအစားတွေ၊ disk ပေါ်က အစဉ်ပေါ်မှာ မူတည်ပါတယ် — ဒါပေမယ့် — အဲဒါကို အားကိုးလို့ မရပါဘူး။ သတ်မှတ်ထားတဲ့ output အစဉ် တစ်ခုကို အာမခံနိုင်တာက — sort step (စီခြင်း အဆင့်) ကို ရှင်းရှင်းလင်းလင်း ရွေးချယ်မှသာ ဖြစ်ပါတယ်။

`ORDER BY` clause က sort order (စီစဉ်မှု အစဉ်) ကို သတ်မှတ်ပေးပါတယ်:

```sql
SELECT select_list
    FROM table_expression
    ORDER BY sort_expression1 [ASC | DESC] [NULLS { FIRST | LAST }]
             [, sort_expression2 [ASC | DESC] [NULLS { FIRST | LAST }] ...]
```

Sort expression (စီရန် expression) (များ) က — query ရဲ့ select list ထဲမှာ တရားဝင် (valid) ဖြစ်နိုင်မယ့် ဘယ် expression မဆို ဖြစ်နိုင်ပါတယ်။ ဥပမာ တစ်ခုကတော့:

```sql
SELECT a, b FROM table1 ORDER BY a + b, c;
```

Expression တစ်ခုထက်ပိုပြီး သတ်မှတ်ထားတဲ့အခါ — အစောပိုင်း expression တွေအရ တူညီနေတဲ့ row တွေကို နောက်ပိုင်း expression တန်ဖိုးတွေက ဆက်ပြီး စီပေးပါတယ်။ Expression တစ်ခုချင်းစီရဲ့ နောက်မှာ — sort direction (စီစဉ်မှု ဦးတည်ချက်) ကို ascending (ငယ်စဉ်ကြီးလိုက်) ဒါမှမဟုတ် descending (ကြီးစဉ်ငယ်လိုက်) ဖြစ်အောင် သတ်မှတ်ဖို့ — ချန်လိုက်လို့လည်း ရတဲ့ (optional) `ASC` ဒါမှမဟုတ် `DESC` key word တစ်ခုကို ထည့်နိုင်ပါတယ်။ `ASC` order က ပုံမှန် (default) ဖြစ်ပါတယ်။ Ascending order မှာ — “smaller” (ပိုငယ်သည်) ဆိုတာကို `<` operator နဲ့ သတ်မှတ်ပြီး — တန်ဖိုးငယ်တွေက ရှေ့မှာ ရောက်ပါတယ်။ အလားတူ — descending order ကိုတော့ `>` operator နဲ့ ဆုံးဖြတ်ပါတယ်။ [6]

`NULLS FIRST` နဲ့ `NULLS LAST` option တွေက — sort ordering ထဲမှာ null value တွေကို non-null value တွေရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ ပေါ်စေမလဲ ဆုံးဖြတ်ဖို့ သုံးနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — null value တွေကို non-null value အားလုံးထက် ကြီးသလို မှတ်ယူပြီး စီပါတယ် — ဆိုလိုတာက — `DESC` order မှာ `NULLS FIRST` က default ဖြစ်ပြီး — တခြား အခြေအနေတွေမှာတော့ `NULLS LAST` က default ဖြစ်ပါတယ်။

Ordering option တွေကို sort column (စီရန် column) တစ်ခုချင်းစီအတွက် — တစ်ခုနဲ့တစ်ခု သီးခြားစီ (independently) သက်ရောက်တယ်ဆိုတာ သတိပြုပါ။ ဥပမာ — `ORDER BY x, y DESC` ဆိုတာ `ORDER BY x ASC, y DESC` ကို ဆိုလိုပြီး — `ORDER BY x DESC, y DESC` နဲ့တော့ အတူတူ မဟုတ်ပါဘူး။

`sort_expression` က — output column (ရလဒ် column) တစ်ခုရဲ့ column label ဒါမှမဟုတ် နံပါတ် လည်း ဖြစ်နိုင်ပါတယ် — ဥပမာ:

```sql
SELECT a + b AS sum, c FROM table1 ORDER BY sum;
SELECT a, max(b) FROM table1 GROUP BY a ORDER BY 1;
```

အပေါ်က ဥပမာ နှစ်ခုလုံးက — ပထမဆုံး output column နဲ့ စီတာပါ။ Output column ရဲ့ နာမည်က တစ်ခုတည်း သီးသန့် ရပ်တည်ရတယ်ဆိုတာ သတိပြုပါ — ဆိုလိုတာက — expression တစ်ခုရဲ့ အတွင်းမှာ သုံးလို့ မရပါဘူး — ဥပမာ — အောက်က ပုံစံက မှားပါတယ်:

```sql
SELECT a + b AS sum, c FROM table1 ORDER BY sum + c;          -- wrong
```

ဒီ restriction (ကန့်သတ်ချက်) က — မရှင်းလင်းမှု (ambiguity) တွေ နည်းအောင် လုပ်ထားတာပါ။ `ORDER BY` item တစ်ခုက — output column ရဲ့ နာမည် ဒါမှမဟုတ် table expression ထဲက column တစ်ခုရဲ့ နာမည် — နှစ်ခုလုံးနဲ့ ကိုက်ညီနိုင်တဲ့ ရိုးရှင်းတဲ့ နာမည် (simple name) တစ်ခု ဖြစ်နေရင် — မရှင်းလင်းမှု ကျန်ရှိနေပါသေးတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ output column ကိုပဲ သုံးပါတယ်။ Output column တစ်ခုကို — တခြား table column တစ်ခုရဲ့ နာမည်နဲ့ ကိုက်ညီအောင် `AS` သုံးပြီး နာမည်ပြောင်းထားရင် — ဒါက ရှုပ်ထွေးမှု ဖြစ်စေနိုင်ပါတယ်။

`ORDER BY` ကို `UNION`, `INTERSECT` ဒါမှမဟုတ် `EXCEPT` ပေါင်းစပ်မှုရဲ့ ရလဒ်ကိုလည်း သက်ရောက်စေလို့ ရပါတယ် — ဒါပေမယ့် — အဲဒီအခြေအနေမှာ output column ရဲ့ နာမည် ဒါမှမဟုတ် နံပါတ်နဲ့ပဲ စီခွင့်ပြုပြီး — expression တွေနဲ့တော့ စီလို့ မရပါဘူး။

---

[6] တကယ်တော့ — PostgreSQL က expression ရဲ့ data type အတွက် *default B-tree operator class* ကို သုံးပြီး — `ASC` နဲ့ `DESC` အတွက် sort ordering ကို ဆုံးဖြတ်ပါတယ်။ သမားရိုးကျအားဖြင့် — `<` နဲ့ `>` operator တွေက ဒီ sort ordering နဲ့ ကိုက်ညီအောင် data type တွေကို တည်ဆောက်ထားလေ့ ရှိပါတယ် — ဒါပေမယ့် — user-defined data type (သုံးစွဲသူ သတ်မှတ်သည့် data type) တစ်ခုရဲ့ designer (ဒီဇိုင်နာ) က မတူညီတဲ့ ပုံစံမျိုးကို ရွေးချယ်ဖို့လည်း ဖြစ်နိုင်ပါသေးတယ်။
