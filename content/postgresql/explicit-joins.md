---
title: "Controlling the Planner with Explicit JOIN Clauses (explicit JOIN clause များဖြင့် planner ထိန်းချုပ်ခြင်း)"
description: "Explicit JOIN syntax သုံးပြီး query planner ကို ထိန်းချုပ်ခြင်း — join order နှင့် join_collapse_limit, from_collapse_limit run-time parameter များ"
order: 106
source: "https://www.postgresql.org/docs/current/explicit-joins.html"
status: translated
updated: 2026-09-03
---

## 14.3. Controlling the Planner with Explicit `JOIN` Clauses (explicit JOIN clause များဖြင့် planner ထိန်းချုပ်ခြင်း)

Explicit `JOIN` syntax (ရှင်းလင်းစွာ ဖော်ပြသော JOIN ရေးသားပုံ) ကို သုံးပြီး — query planner (query အတွက် အစီအစဉ် ရေးဆွဲသူ) ကို အတိုင်းအတာ တစ်ခုအထိ ထိန်းချုပ်နိုင်ပါတယ်။ ဒါက ဘာကြောင့် အရေးပါလဲဆိုတာ နားလည်ဖို့ — အရင်ဆုံး နောက်ခံ အချက်အလက် အနည်းငယ် လိုပါတယ်။

ရိုးရှင်းတဲ့ join query တစ်ခုမှာ — ဥပမာ —

```sql
SELECT * FROM a, b, c WHERE a.id = b.id AND b.ref = c.id;
```

planner က ပေးထားတဲ့ table တွေကို ဘယ်အစဉ်နဲ့မဆို join လုပ်ဖို့ လွတ်လပ်ခွင့် ရှိပါတယ်။ ဥပမာ — `WHERE` condition `a.id = b.id` ကို သုံးပြီး A ကို B နဲ့ join လုပ်ကာ — ကျန်တဲ့ `WHERE` condition ကို သုံးပြီး C ကို အဲဒီ join ဖြစ်ပြီးသား table နဲ့ ထပ်ချိတ်တဲ့ query plan တစ်ခုကို ထုတ်လုပ်နိုင်ပါတယ်။ ဒါမှမဟုတ် B ကို C နဲ့ အရင် join လုပ်ပြီးမှ — A ကို အဲဒီရလဒ်နဲ့ ချိတ်လို့လည်း ရပါတယ်။ ဒါမှမဟုတ် A ကို C နဲ့ join လုပ်ပြီးမှ — သူတို့ကို B နဲ့ ထပ်ပေါင်းလို့လည်း ရပါတယ် — ဒါပေမယ့် အဲဒါက ထိရောက်မှု မရှိပါဘူး — အကြောင်းကတော့ `WHERE` clause ထဲမှာ join ရဲ့ optimization (ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ခြင်း) ကို ခွင့်ပြုနိုင်တဲ့ သက်ဆိုင်တဲ့ condition မရှိတာကြောင့် — A နဲ့ C ရဲ့ Cartesian product (ဖြစ်နိုင်သမျှ ပေါင်းစပ် ရလဒ်စုံ) အပြည့်အစုံကို တည်ဆောက်ရမှာ ဖြစ်လို့ပါ။ (PostgreSQL executor ထဲက join တွေ အားလုံးက input table နှစ်ခုကြားမှာပဲ ဖြစ်ပွားတာမို့ — ရလဒ်ကို ဒီနည်းတစ်မျိုးမျိုးနဲ့ ဖြည်းဖြည်းချင်း တည်ဆောက်ရတာ မလွှဲမရှောင်သာပါ။) အရေးကြီးတဲ့ အချက်ကတော့ — ဒီမတူညီတဲ့ join ဖြစ်နိုင်ခြေတွေက — အဓိပ္ပာယ် (semantic) အရ ညီမျှတဲ့ ရလဒ်တွေကို ပေးပေမယ့် — execution cost (လုပ်ဆောင်စရိတ်) တွေကတော့ အလွန် ကွာခြားနိုင်တာ ဖြစ်ပါတယ်။ ဒါကြောင့် — planner က အကောင်းဆုံး query plan ကို ရှာဖို့ — အဲဒီ ဖြစ်နိုင်ခြေတွေ အားလုံးကို စူးစမ်းပါတယ်။

Query တစ်ခုမှာ table နှစ်ခု ဒါမှမဟုတ် သုံးခုပဲ ပါဝင်ရင် — စဉ်းစားစရာ join order (join လုပ်သည့် အစီအစဉ်) တွေ သိပ်မများပါဘူး။ ဒါပေမယ့် — table အရေအတွက် များလာတာနဲ့အမျှ — ဖြစ်နိုင်တဲ့ join order အရေအတွက်က exponential (ထပ်ကိန်း) ပုံစံနဲ့ ကြီးထွားသွားပါတယ်။ Input table ဆယ်ခုလောက် ကျော်သွားရင် — ဖြစ်နိုင်ခြေ အားလုံးကို exhaustive search (အကုန်အစင် စူးစမ်းရှာဖွေခြင်း) လုပ်တာက လက်တွေ့ မဖြစ်နိုင်တော့ဘဲ — table ခြောက်ခု ဒါမှမဟုတ် ခုနစ်ခုတောင် ဆိုရင်ကို — planning (အစီအစဉ် ရေးဆွဲခြင်း) က စိတ်ညစ်စရာ အချိန် ကြာနိုင်ပါတယ်။ Input table တွေ အလွန် များလွန်းတဲ့အခါ — PostgreSQL planner က exhaustive search ကနေ — ဖြစ်နိုင်ခြေ အကန့်အသတ် ရှိတဲ့ အရေအတွက်ကိုသာ စူးစမ်းတဲ့ *genetic* probabilistic search (မျိုးရိုးဗီဇ နည်းစနစ် အခြေပြု ဖြစ်နိုင်ခြေ ရှာဖွေမှု) ဆီ ပြောင်းလဲသွားပါတယ်။ (ဒီအပြောင်းအလဲ ဖြစ်ပေါ်တဲ့ အတိုင်းအတာ (switch-over threshold) ကို [geqo_threshold](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-THRESHOLD) run-time parameter က သတ်မှတ်ပါတယ်။) Genetic search က အချိန် ပိုသက်သာပေမယ့် — ဖြစ်နိုင်တဲ့ plan တွေထဲက အကောင်းဆုံးကို သေချာပေါက် တွေ့မယ်တော့ မဟုတ်ပါဘူး။

Query ထဲမှာ outer join တွေ ပါဝင်နေရင် — planner မှာ သာမန် (inner) join တွေအတွက် ရှိသလောက် လွတ်လပ်ခွင့် မရှိတော့ပါဘူး။ ဥပမာ — အောက်ပါ query ကို ကြည့်ပါ:

```sql
SELECT * FROM a LEFT JOIN (b JOIN c ON (b.ref = c.id)) ON (a.id = b.id);
```

ဒီ query ရဲ့ ကန့်သတ်ချက်တွေက ပထမ ဥပမာနဲ့ အပေါ်ယံအားဖြင့် ဆင်တူနေပေမယ့် — semantics (အဓိပ္ပာယ်) ကတော့ ကွဲပြားပါတယ် — အကြောင်းကတော့ B နဲ့ C ရဲ့ join ထဲမှာ ကိုက်ညီတဲ့ row မရှိတဲ့ A ရဲ့ row တစ်ခုချင်းစီအတွက် — row တစ်ခုစီ ထုတ်ပေးရမှာ ဖြစ်လို့ပါ။ ဒါကြောင့် — ဒီနေရာမှာ planner မှာ join order ရွေးချယ်စရာ မရှိပါဘူး: B ကို C နဲ့ အရင် join လုပ်ပြီးမှ — A ကို အဲဒီရလဒ်နဲ့ join လုပ်ရပါမယ်။ အကျိုးဆက်အနေနဲ့ — ဒီ query က ပထမ query ထက် plan ရေးဆွဲဖို့ အချိန် ပိုသက်သာပါတယ်။ တခြား အခြေအနေတွေမှာတော့ — planner က join order တစ်ခုထက်ပိုပြီး အန္တရာယ် ကင်းကြောင်း ဆုံးဖြတ်နိုင်ပါတယ်။ ဥပမာ — အောက်ပါအတိုင်း ပေးထားရင်:

```sql
SELECT * FROM a LEFT JOIN b ON (a.bid = b.id) LEFT JOIN c ON (a.cid = c.id);
```

A ကို B ဒါမှမဟုတ် C — ဘယ်ဟာကို အရင်မဆို join လုပ်တာ မှန်ကန်ပါတယ်။ လောလောဆယ် — join order ကို လုံးဝ ချုပ်ချယ်နိုင်တာက `FULL JOIN` ပဲ ဖြစ်ပါတယ်။ `LEFT JOIN` ဒါမှမဟုတ် `RIGHT JOIN` ပါဝင်တဲ့ လက်တွေ့ကျတဲ့ ကိစ္စ အများစုကိုတော့ အတိုင်းအတာ တစ်ခုအထိ ပြန်လည် စီစဉ်လို့ ရပါတယ်။

Explicit inner join syntax (`INNER JOIN`, `CROSS JOIN` ဒါမှမဟုတ် modifier မပါတဲ့ `JOIN` သက်သက်) က — input relation တွေကို `FROM` ထဲမှာ စာရင်းပြုစုထားတာနဲ့ အဓိပ္ပာယ် တူညီတာမို့ — join order ကို ချုပ်ချယ်မှု မရှိပါဘူး။

`JOIN` အမျိုးအစား အများစုက join order ကို လုံးဝ ချုပ်ချယ်ထားတာ မဟုတ်ပေမယ့် — PostgreSQL query planner ကို `JOIN` clause တွေ အားလုံးကို join order ချုပ်ချယ်မှု အနေနဲ့ပဲ သဘောထားဖို့ ညွှန်ကြားလို့တော့ ရပါတယ်။ ဥပမာ — အောက်ပါ query သုံးခုက ယုတ္တိအရ ညီမျှပါတယ်:

```sql
SELECT * FROM a, b, c WHERE a.id = b.id AND b.ref = c.id;
SELECT * FROM a CROSS JOIN b CROSS JOIN c WHERE a.id = b.id AND b.ref = c.id;
SELECT * FROM a JOIN (b JOIN c ON (b.ref = c.id)) ON (a.id = b.id);
```

ဒါပေမယ့် — planner ကို `JOIN` order ကို လိုက်နာဖို့ ပြောထားရင် — ဒုတိယနဲ့ တတိယ query တွေက ပထမ query ထက် plan ရေးဆွဲဖို့ အချိန် ပိုသက်သာပါတယ်။ ဒီအကျိုးသက်ရောက်မှုက table သုံးခုတည်းအတွက်တော့ စိုးရိမ်စရာ မလိုပေမယ့် — table အများကြီး ရှိတဲ့အခါမှာတော့ အသက်ကယ်ဆေးတစ်ခုလို ဖြစ်လာနိုင်ပါတယ်။

Planner ကို explicit `JOIN` တွေနဲ့ ချမှတ်ထားတဲ့ join order အတိုင်း လိုက်နာစေဖို့ — [join_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JOIN-COLLAPSE-LIMIT) run-time parameter ကို 1 လို့ သတ်မှတ်ပါ။ (ဖြစ်နိုင်တဲ့ တခြား တန်ဖိုးတွေကို အောက်မှာ ဆွေးနွေးထားပါတယ်။)

Search (ရှာဖွေမှု) အချိန် လျှော့ချဖို့အတွက် join order ကို လုံးဝ ချုပ်ချယ်ထားဖို့တော့ မလိုပါဘူး — သာမန် `FROM` list ရဲ့ ပစ္စည်း (item) တွေအတွင်းမှာ `JOIN` operator တွေကို သုံးတာ ရပါတယ်။ ဥပမာ — အောက်ပါအတိုင်း ဆိုပါစို့:

```sql
SELECT * FROM a CROSS JOIN b, c, d, e WHERE ...;
```

`join_collapse_limit` = 1 ဆိုရင် — ဒါက A ကို B နဲ့ — တခြား table တွေနဲ့ မချိတ်ခင် — အရင် join လုပ်ဖို့ planner ကို အတင်း ဖြစ်စေပေမယ့် — ကျန်တဲ့ ရွေးချယ်မှုတွေကိုတော့ မချုပ်ချယ်ပါဘူး။ ဒီဥပမာမှာ — ဖြစ်နိုင်တဲ့ join order အရေအတွက်က 5 ဆ လျော့ကျသွားပါတယ်။

Planner ရဲ့ search ကို ဒီလိုမျိုး ချုပ်ချယ်တာက — planning အချိန် လျှော့ချဖို့ရော — planner ကို ကောင်းတဲ့ query plan တစ်ခုဆီ ညွှန်ကြားဖို့ပါ အသုံးဝင်တဲ့ နည်းပညာ တစ်ခု ဖြစ်ပါတယ်။ Planner က ပုံမှန်အားဖြင့် မကောင်းတဲ့ join order တစ်ခုကို ရွေးမိရင် — `JOIN` syntax ကနေတစ်ဆင့် ပိုကောင်းတဲ့ order တစ်ခုကို ရွေးဖို့ အတင်း လုပ်နိုင်ပါတယ် — ပိုကောင်းတဲ့ order ကို သင်ကိုယ်တိုင် သိထားတယ်ဆိုရင်ပေါ့။ စမ်းသပ် ကြည့်ဖို့ အကြံပြုလိုပါတယ်။

Planning အချိန်ကို သက်ရောက်တဲ့ အနီးကပ် ဆက်စပ်နေတဲ့ နောက် ကိစ္စတစ်ခုကတော့ — subquery တွေကို သူတို့ရဲ့ parent query ထဲကို collapse (ထည့်ပေါင်း) လုပ်ခြင်း ဖြစ်ပါတယ်။ ဥပမာ — အောက်ပါအတိုင်း ဆိုပါစို့:

```sql
SELECT *
FROM x, y,
    (SELECT * FROM a, b, c WHERE something) AS ss
WHERE somethingelse;
```

ဒီအခြေအနေမျိုးက join တစ်ခု ပါဝင်တဲ့ view တစ်ခုကို သုံးလို့ ဖြစ်ပေါ်လာနိုင်ပါတယ် — view ရဲ့ `SELECT` rule က view reference ရဲ့ နေရာမှာ အစားထိုး ထည့်သွင်းခံရလို့ — အပေါ်ကလိုမျိုး query တစ်ခု ထွက်ပေါ်လာပါတယ်။ ပုံမှန်အားဖြင့် — planner က subquery ကို parent ထဲ collapse လုပ်ဖို့ ကြိုးစားပြီး — အောက်ပါအတိုင်း ဖြစ်လာပါတယ်:

```sql
SELECT * FROM x, y, a, b, c WHERE something AND somethingelse;
```

ဒါက ပုံမှန်အားဖြင့် — subquery ကို သီးခြား plan လုပ်တာထက် ပိုကောင်းတဲ့ plan ကို ရစေပါတယ်။ (ဥပမာ — outer `WHERE` condition တွေက — X ကို A နဲ့ အရင် join လုပ်တာ A ရဲ့ row အများကြီးကို ဖယ်ရှားပစ်လို့ — subquery ရဲ့ logical output အပြည့်အစုံကို တည်ဆောက်စရာ မလိုတော့ဘူးဆိုတဲ့ သဘောမျိုး ဖြစ်နိုင်ပါတယ်။) ဒါပေမယ့် — တစ်ချိန်တည်းမှာပဲ — planning အချိန်က ပိုများသွားပါတယ် — ဒီနေရာမှာ — သီးခြား three-way join ပြဿနာ နှစ်ခုအစား — five-way join ပြဿနာ တစ်ခု အစားထိုး ဖြစ်လာလို့ပါ။ ဖြစ်နိုင်ခြေ အရေအတွက်က exponential ပုံစံ ကြီးထွားတာကြောင့် — ဒါက ကြီးမားတဲ့ ကွာခြားချက်ကို ဖြစ်စေပါတယ်။ Planner က — subquery တစ်ခုကို collapse လုပ်လိုက်ရင် parent query ထဲမှာ `from_collapse_limit` ထက်ပိုတဲ့ `FROM` items တွေ ဖြစ်လာမယ်ဆိုရင် — အဲဒီ subquery ကို collapse မလုပ်ဘဲ — ဧရာမ join search ပြဿနာတွေထဲမှာ နစ်မြုပ်မသွားအောင် ရှောင်ရှားပါတယ်။ ဒီ run-time parameter ကို အပေါ် ဒါမှမဟုတ် အောက် ချိန်ညှိပြီး — planning အချိန်နဲ့ plan ရဲ့ အရည်အသွေးကြားမှာ အပေးအယူ (trade-off) လုပ်နိုင်ပါတယ်။

[from_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-FROM-COLLAPSE-LIMIT) နဲ့ [join_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JOIN-COLLAPSE-LIMIT) တို့က — လုပ်ဆောင်ချက် ချင်း ဆင်တူလို့ — နာမည်တွေကိုလည်း ဆင်တူ ပေးထားတာ ဖြစ်ပါတယ်: တစ်ခုက planner က subquery တွေကို ဘယ်အချိန်မှာ “ဖြန့်ချ” (flatten out) လုပ်မလဲဆိုတာကို ထိန်းချုပ်ပြီး — နောက်တစ်ခုကတော့ explicit join တွေကို ဘယ်အချိန်မှာ ဖြန့်ချမလဲဆိုတာကို ထိန်းချုပ်ပါတယ်။ ပုံမှန်အားဖြင့် — `join_collapse_limit` ကို `from_collapse_limit` နဲ့ တန်းတူ ထားမယ် (explicit join တွေနဲ့ subquery တွေ တစ်ပုံစံတည်း ပြုမူစေဖို့) ဒါမှမဟုတ် — `join_collapse_limit` ကို 1 လို့ ထားမယ် (explicit join တွေနဲ့ join order ကို ထိန်းချုပ်ချင်ရင်) — ဆိုပြီး နှစ်မျိုးထဲက တစ်မျိုးကို ရွေးလေ့ ရှိပါတယ်။ ဒါပေမယ့် — planning အချိန်နဲ့ run time (လည်ပတ်ချိန်) ကြားက အပေးအယူကို သေချာ ချိန်ညှိ (fine-tune) လုပ်ချင်နေရင်တော့ — သူတို့ကို မတူညီအောင် သတ်မှတ်ထားလို့လည်း ရပါတယ်။
