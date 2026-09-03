---
title: "Multicolumn Indexes (column များစွာ ပါတဲ့ index များ)"
description: "Column တစ်ခုထက်ပိုပြီး သတ်မှတ်နိုင်တဲ့ index — B-tree, GiST, GIN, BRIN type များရဲ့ column မျိုးစုံ ပံ့ပိုးမှု၊ leading column စည်းမျဉ်း၊ skip scan optimization နဲ့ multicolumn index ကို ချွေတာပြီး သုံးသင့်ခြင်း"
order: 70
source: "https://www.postgresql.org/docs/current/indexes-multicolumn.html"
status: translated
updated: 2026-09-03
---

## 11.3. Multicolumn Indexes (column များစွာ ပါတဲ့ index များ)

Index တစ်ခုကို table တစ်ခုရဲ့ column တစ်ခုထက်ပိုပြီး သတ်မှတ်လို့ရပါတယ်။ ဥပမာ — ဒီပုံစံ table တစ်ခု ရှိတယ်ဆိုပါစို့:

```sql
CREATE TABLE test2 (
  major int,
  minor int,
  name varchar
);
```

(ဥပမာ — `/dev` directory ကို database ထဲမှာ သိမ်းထားတယ်ဆိုပါစို့...) ပြီးတော့ — ဒီလိုပုံစံ query တွေကို မကြာခဏ ထုတ်နေတယ်ဆိုရင်:

```sql
SELECT name FROM test2 WHERE major = constant AND minor = constant;
```

အဲဒီအခါ — `major` နဲ့ `minor` column နှစ်ခုလုံးကို ပေါင်းပြီး index တစ်ခု သတ်မှတ်တာ သင့်လျော်ပါတယ် — ဥပမာ:

```sql
CREATE INDEX test2_mm_idx ON test2 (major, minor);
```

လက်ရှိမှာ — B-tree, GiST, GIN နဲ့ BRIN index type လေးမျိုးကသာ key column မျိုးစုံ (multiple-key-column) ပါတဲ့ index တွေကို ထောက်ပံ့ပါတယ်။ Key column မျိုးစုံ ပါဝင်နိုင်လားဆိုတာက — index ထဲကို `INCLUDE` column တွေ ထည့်လို့ရလားဆိုတာနဲ့ သီးခြားစီ (independent) ဖြစ်ပါတယ်။ Index တစ်ခုမှာ `INCLUDE` column တွေ အပါအဝင် column ၃၂ ခုအထိ ပါဝင်နိုင်ပါတယ်။ (PostgreSQL ကို build လုပ်တဲ့အခါ ဒီကန့်သတ်ချက်ကို ပြောင်းလဲနိုင်ပါတယ် — `pg_config_manual.h` ဆိုတဲ့ file ကို ကြည့်ပါ။)

Multicolumn B-tree index တစ်ခုကို — index ရဲ့ column တွေထဲက ဘယ် subset (အစိတ်အပိုင်းအစု) ပဲဖြစ်ဖြစ် ပါဝင်တဲ့ query condition တွေမှာ သုံးလို့ရပါတယ် — ဒါပေမယ့် — leading (leftmost — ဘယ်ဘက်ဆုံး) column တွေပေါ်မှာ constraint တွေ ရှိတဲ့အခါမှာတော့ index က အထိရောက်ဆုံး ဖြစ်ပါတယ်။ တိကျတဲ့ စည်းမျဉ်းကတော့ — leading column တွေပေါ်က equality constraint တွေနဲ့ — equality constraint မရှိတဲ့ ပထမဆုံး column ပေါ်က inequality constraint တွေကို — index ထဲက scan လုပ်ရမယ့် အပိုင်းကို ကန့်သတ်ဖို့ အမြဲတမ်း သုံးပါလိမ့်မယ်။ ဒီ column တွေရဲ့ ညာဘက်မှာ ရှိတဲ့ column တွေပေါ်က constraint တွေကတော့ — index အတွင်းမှာပဲ စစ်ဆေးခံရတာကြောင့် — table ကိုယ်တိုင်ဆီ သွားရောက်မှု (visit) တွေကို အမြဲ သက်သာစေပေမယ့် — index ရဲ့ scan လုပ်ရမယ့် အပိုင်းကိုတော့ မလျှော့ချပေးနိုင်ဘဲ ဖြစ်နေတတ်ပါတယ်။ B-tree index scan တစ်ခုက skip scan optimization ကို ထိထိရောက်ရောက် အသုံးချနိုင်ရင် — index search တွေကို ထပ်ခါထပ်ခါ လုပ်ပြီး index အတွင်း သွားလာစဉ်မှာ column constraint တိုင်းကို အသုံးချပါလိမ့်မယ်။ ဒီနည်းနဲ့ — query predicate ထဲမှာ ပါဝင်တဲ့ index column တွေထဲက အနောက်ဆုံး (ညာဘက်ဆုံး) column ရဲ့ ရှေ့ဘက်က column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုမှာ — သမားရိုးကျ equality constraint မပါဘဲ ဖြစ်နေရင်တောင် — index ထဲက ဖတ်ရမယ့် အပိုင်းကို လျှော့ချပေးနိုင်ပါတယ်။ Skip scan ရဲ့ အလုပ်လုပ်ပုံကတော့ — index column တစ်ခုထဲမှာ ဖြစ်နိုင်တဲ့ တန်ဖိုးတိုင်းနဲ့ ကိုက်ညီမယ့် dynamic equality constraint (ရွေ့လျား ပြောင်းလဲတတ်တဲ့ equality constraint) တစ်ခုကို အတွင်းပိုင်းကနေ ထုတ်လုပ်တာပါ — ဒါပေမယ့် — query predicate ကနေ လာတဲ့ equality constraint မရှိတဲ့ column တစ်ခုအတွက်သာ ဖြစ်ပြီး — ထုတ်လုပ်ထားတဲ့ constraint ကို query predicate ရဲ့ နောက်ပိုင်း column constraint တစ်ခုနဲ့ တွဲသုံးလို့ရမှသာ ဖြစ်ပါတယ်။

ဥပမာ — `(x, y)` ပေါ်မှာ index တစ်ခု ရှိပြီး — query condition က `WHERE y = 7700` ဆိုရင် — B-tree index scan က skip scan optimization ကို အသုံးချနိုင်ဖို့ များပါတယ်။ ဒါက ယေဘုယျအားဖြင့် — query planner က — `N` ရဲ့ ဖြစ်နိုင်တဲ့ တန်ဖိုးတိုင်းအတွက် (ဒါမှမဟုတ် — index ထဲမှာ တကယ် သိမ်းထားတဲ့ `x` တန်ဖိုးတိုင်းအတွက်) `WHERE x = N AND y = 7700` ဆိုတဲ့ search တွေကို ထပ်ခါထပ်ခါ လုပ်တာက — table ပေါ်မှာ ရနိုင်တဲ့ index တွေကို ထည့်သွင်း စဉ်းစားရင် — အမြန်ဆုံး နည်းလမ်း ဖြစ်မယ်လို့ မျှော်မှန်းတဲ့အခါမျိုးမှာ ဖြစ်တတ်ပါတယ်။ `x` ရဲ့ distinct value (ကွဲပြားတဲ့ တန်ဖိုး) တွေ ရှားပါးလွန်းတဲ့အခါမျိုးမှာသာ ဒီနည်းလမ်းကို ယေဘုယျအားဖြင့် သုံးပါတယ် — ဘာကြောင့်လဲဆိုတော့ — index ရဲ့ leaf page အများစုမှာ သက်ဆိုင်တဲ့ tuple တွေ ပါဝင်နိုင်စရာ မရှိတာကြောင့် — scan က index အများစုကို ကျော်သွားနိုင်မယ်လို့ planner က မျှော်လင့်လို့ပါ။ `x` ရဲ့ distinct value တွေ အများကြီး ရှိနေရင်တော့ — index တစ်ခုလုံးကို scan လုပ်ရမှာ ဖြစ်လို့ — အများစုမှာ planner က index သုံးတာထက် sequential table scan (table တစ်ခုလုံး အစဉ်လိုက် ရှာဖွေခြင်း) ကိုပဲ ပိုနှစ်သက်ပါလိမ့်မယ်။

Skip scan optimization ကို — query predicate ကနေ အသုံးဝင်တဲ့ constraint တချို့ အနည်းဆုံး ရှိတဲ့ B-tree scan တွေမှာ — ရွေးချယ်ပြီး (selectively) အသုံးချနိုင်ပါတယ်။ ဥပမာ — `(a, b, c)` ပေါ်မှာ index တစ်ခု ရှိပြီး — query condition က `WHERE a = 5 AND b >= 42 AND c < 77` ဆိုရင် — index ကို `a` = 5 နဲ့ `b` = 42 ရှိတဲ့ ပထမဆုံး entry ကနေ — `a` = 5 ရှိတဲ့ နောက်ဆုံး entry အထိ scan လုပ်ရနိုင်ပါတယ်။ `c` >= 77 ရှိတဲ့ index entry တွေက table အဆင့်မှာ filter (စစ်ထုတ်) လုပ်ဖို့ ဘယ်တော့မှ မလိုအပ်ပေမယ့် — index အတွင်းမှာ အဲဒီ entry တွေကို ကျော်သွားတာက အကျိုးရှိချင်မှ ရှိပါလိမ့်မယ်။ Skip လုပ်တဲ့အခါ — scan က — လက်ရှိ `a` = 5 နဲ့ `b` = N အုပ်စုရဲ့ အဆုံးကနေ (ဆိုလိုတာက — `a = 5 AND b = N AND c >= 77` ဆိုတဲ့ ပထမဆုံး tuple ပေါ်လာတဲ့ index ထဲက နေရာကနေ) — နောက်ထပ် ဒီလိုမျိုး အုပ်စုရဲ့ အစဆီကို (ဆိုလိုတာက — `a = 5 AND b = N + 1` ဆိုတဲ့ ပထမဆုံး tuple ပေါ်လာတဲ့ index ထဲက နေရာကို) ကိုယ့်ကိုယ်ကိုယ် ပြန်နေရာချဖို့ — index search အသစ်တစ်ခုကို စတင်ပါတယ်။

Multicolumn GiST index တစ်ခုကို — index ရဲ့ column တွေထဲက ဘယ် subset ပဲဖြစ်ဖြစ် ပါဝင်တဲ့ query condition တွေမှာ သုံးလို့ရပါတယ်။ နောက်ထပ် column တွေပေါ်က condition တွေက index ပြန်ပေးတဲ့ entry တွေကို ကန့်သတ်ပေမယ့် — index ဘယ်လောက် scan လုပ်ရမလဲဆိုတာကို ဆုံးဖြတ်ရာမှာ ပထမဆုံး column ပေါ်က condition ကသာ အရေးအကြီးဆုံး ဖြစ်ပါတယ်။ GiST index တစ်ခုရဲ့ ပထမဆုံး column မှာ distinct value အနည်းငယ်ပဲ ရှိရင် — ကျန်တဲ့ column တွေမှာ distinct value အများကြီး ရှိနေရင်တောင် — index က အတော်လေး ထိရောက်မှု နည်းပါလိမ့်မယ်။

Multicolumn GIN index တစ်ခုကို — index ရဲ့ column တွေထဲက ဘယ် subset ပဲဖြစ်ဖြစ် ပါဝင်တဲ့ query condition တွေမှာ သုံးလို့ရပါတယ်။ B-tree ဒါမှမဟုတ် GiST နဲ့ မတူဘဲ — query condition တွေက index ရဲ့ ဘယ် column (များ) ကို သုံးလဲဆိုတာ ဘယ်လိုပဲ ဖြစ်ဖြစ် — index search ရဲ့ ထိရောက်မှုက အတူတူပဲ ဖြစ်ပါတယ်။

Multicolumn BRIN index တစ်ခုကိုလည်း — index ရဲ့ column တွေထဲက ဘယ် subset ပဲဖြစ်ဖြစ် ပါဝင်တဲ့ query condition တွေမှာ သုံးလို့ရပါတယ်။ GIN လိုပဲ — B-tree နဲ့ GiST တို့နဲ့ မတူဘဲ — query condition တွေက index ရဲ့ ဘယ် column (များ) ကို သုံးလဲဆိုတာ ဘယ်လိုပဲ ဖြစ်ဖြစ် — index search ရဲ့ ထိရောက်မှုက အတူတူပဲ ဖြစ်ပါတယ်။ Table တစ်ခုတည်းပေါ်မှာ multicolumn BRIN index တစ်ခုတည်း ထားမယ့်အစား — BRIN index အများအပြား ထားရတဲ့ တစ်ခုတည်းသော အကြောင်းရင်းကတော့ — `pages_per_range` storage parameter (သိမ်းဆည်းမှု ကန့်သတ်ချက်) တွေ မတူညီအောင် ထားချင်လို့ပဲ ဖြစ်ပါတယ်။

တကယ်တော့ — column တစ်ခုချင်းစီကို index type နဲ့ လိုက်ဖက်တဲ့ operator တွေနဲ့ပဲ သုံးရမှာ ဖြစ်ပြီး — တခြား operator တွေ ပါဝင်တဲ့ clause တွေကိုတော့ ထည့်သွင်း စဉ်းစားမှာ မဟုတ်ပါဘူး။

Multicolumn index တွေကို ချွေတာပြီးမှ သုံးသင့်ပါတယ်။ အခြေအနေအများစုမှာ — column တစ်ခုတည်းပေါ်က index ကပဲ လုံလောက်ပြီး — နေရာရော အချိန်ပါ သက်သာပါတယ်။ Column ၃ ခုထက်ပိုပါတဲ့ index တွေက — table ရဲ့ အသုံးပြုပုံက အလွန် ပုံစံတကျ (stylized) ဖြစ်နေမှသာ အကျိုးရှိနိုင်ပြီး — မဟုတ်ရင် အကျိုးရှိဖို့ မဖြစ်နိုင်လောက်ပါဘူး။ Index configuration အမျိုးမျိုးရဲ့ ကောင်းကျိုး အားသာချက်တွေအကြောင်း ဆွေးနွေးချက်အတွက် [အပိုင်း 11.5](/docs/postgresql/indexes-bitmap-scans) နဲ့ [အပိုင်း 11.9](/docs/postgresql/indexes-index-only-scans) တို့ကိုလည်း ကြည့်ပါ။
