---
title: "Indexes and ORDER BY (index နဲ့ ORDER BY)"
description: "Index က query ရဲ့ ORDER BY ကို သီးခြား sort step မပါဘဲ ဖြည့်ဆည်းပေးနိုင်ခြင်း — B-tree တစ်မျိုးတည်းသာ sorted output ထုတ်ပေးနိုင်မှု၊ ASC/DESC/NULLS FIRST/LAST option များနဲ့ B-tree index ရဲ့ sort ordering ကို ချိန်ညှိခြင်း"
order: 71
source: "https://www.postgresql.org/docs/current/indexes-ordering.html"
status: translated
updated: 2026-09-03
---

## 11.4. Indexes and ORDER BY (index နဲ့ ORDER BY)

Query တစ်ခုက ပြန်ပေးရမယ့် row တွေကို ရှာဖွေပေးရုံတင် မဟုတ်ဘဲ — index က အဲဒီ row တွေကို သတ်မှတ်ထားတဲ့ sort order (စီထားတဲ့ အစဉ်) တစ်ခုနဲ့ပါ ပေးပို့နိုင်ပါတယ်။ ဒါကြောင့် — sort step (စီခြင်း အဆင့်) သပ်သပ် မလိုဘဲ — query ရဲ့ `ORDER BY` သတ်မှတ်ချက်ကို ဖြည့်ဆည်းပေးနိုင်ပါတယ်။ PostgreSQL က လက်ရှိ ထောက်ပံ့ထားတဲ့ index type တွေထဲမှာ — B-tree ကသာ sorted output (စီပြီးသား ရလဒ်) ကို ထုတ်ပေးနိုင်ပြီး — ကျန် index type တွေကတော့ ကိုက်ညီတဲ့ row တွေကို — ကြိုသိနိုင်ခြင်း မရှိတဲ့၊ implementation ပေါ် မူတည်တဲ့ အစဉ်နဲ့ ပြန်ပေးပါတယ်။

Planner က — `ORDER BY` သတ်မှတ်ချက်တစ်ခုကို ဖြည့်ဆည်းဖို့ — သတ်မှတ်ချက်နဲ့ ကိုက်ညီတဲ့ index တစ်ခုကို scan လုပ်တာပဲ ဖြစ်ဖြစ် — table ကို physical order (ရုပ်ပိုင်း အစဉ်) နဲ့ scan လုပ်ပြီး explicit sort (သီးခြား စီခြင်း) လုပ်တာပဲ ဖြစ်ဖြစ် — စဉ်းစားပါလိမ့်မယ်။ Table ရဲ့ ကြီးမားတဲ့ အစိတ်အပိုင်းတစ်ခုကို scan လုပ်ဖို့ လိုတဲ့ query တစ်ခုအတွက်ဆိုရင် — explicit sort က index သုံးတာထက် ပိုမြန်ဖို့ များပါတယ် — ဘာကြောင့်လဲဆိုတော့ — sequential access pattern (အစဉ်လိုက် ဝင်ရောက်မှု ပုံစံ) အတိုင်း လိုက်တာကြောင့် — disk I/O ပိုနည်းလို့ပါ။ Row အနည်းငယ်ပဲ ယူဖို့ လိုတဲ့အခါမှာတော့ index တွေက ပိုအသုံးဝင်ပါတယ်။ အရေးကြီးတဲ့ အထူး အခြေအနေတစ်ခုကတော့ — `LIMIT` `n` နဲ့ တွဲထားတဲ့ `ORDER BY` ပါ — explicit sort က ပထမ `n` row တွေကို ဖော်ထုတ်ဖို့ data အားလုံးကို လုပ်ဆောင်ရမှာ ဖြစ်ပေမယ့် — `ORDER BY` နဲ့ ကိုက်ညီတဲ့ index တစ်ခု ရှိရင်တော့ — ကျန်တဲ့ အပိုင်းကို လုံးဝ scan မလုပ်ဘဲ — ပထမ `n` row တွေကို တိုက်ရိုက် ထုတ်ယူလို့ရပါတယ်။

ပုံမှန်အားဖြင့် — B-tree index တွေက သူတို့ရဲ့ entry တွေကို — null တွေ နောက်ဆုံးမှာ ရှိတဲ့ ascending order (ငယ်စဉ်ကြီးလိုက် အစဉ်) နဲ့ သိမ်းပါတယ် (တခြားအရာတွေ အားလုံး တူညီနေတဲ့ entry တွေကြားမှာ table TID ကို tiebreaker (သရေကျမှု ဖြေရှင်းပေးသည့် ကိန်း) အဖြစ် သဘောထားပါတယ်)။ ဆိုလိုတာက — column `x` ပေါ်က index တစ်ခုကို forward scan (ရှေ့သို့ scan) လုပ်ရင် — `ORDER BY x` (ဒါမှမဟုတ် — ပိုပြီး အသေးစိတ်ကျတဲ့ ပုံစံနဲ့ ဆိုရင် — `ORDER BY x ASC NULLS LAST`) ကို ဖြည့်ဆည်းပေးနိုင်တဲ့ output ကို ထုတ်ပေးပါတယ်။ Index ကို backward scan (နောက်ပြန် scan) လုပ်လည်း ရပြီး — `ORDER BY x DESC` (ဒါမှမဟုတ် — `ORDER BY x DESC NULLS FIRST` — `ORDER BY DESC` အတွက် `NULLS FIRST` က default ဖြစ်လို့) ကို ဖြည့်ဆည်းပေးနိုင်တဲ့ output ကို ထုတ်ပေးပါတယ်။

B-tree index တစ်ခုရဲ့ ordering ကို — index ဖန်တီးတဲ့အခါ `ASC`, `DESC`, `NULLS FIRST` နဲ့/ဒါမှမဟုတ် `NULLS LAST` option တွေကို ထည့်သွင်းပြီး ချိန်ညှိနိုင်ပါတယ် — ဥပမာ:

```sql
CREATE INDEX test2_info_nulls_low ON test2 (info NULLS FIRST);
CREATE INDEX test3_desc_index ON test3 (id DESC NULLS LAST);
```

null တွေ ရှေ့မှာ ရှိတဲ့ ascending order နဲ့ သိမ်းထားတဲ့ index တစ်ခုက — scan လုပ်တဲ့ ဦးတည်ချက် ပေါ် မူတည်ပြီး — `ORDER BY x ASC NULLS FIRST` ဒါမှမဟုတ် `ORDER BY x DESC NULLS LAST` — နှစ်ခုထဲက တစ်ခုခုကို ဖြည့်ဆည်းပေးနိုင်ပါတယ်။

Option လေးခုလုံးကို ဘာကြောင့် ထောက်ပံ့ပေးထားလဲလို့ ခင်ဗျား တွေးမိနိုင်ပါတယ် — option နှစ်ခုနဲ့ backward scan လုပ်နိုင်စွမ်း ရှိရုံနဲ့တင် `ORDER BY` ရဲ့ variant တွေ အားလုံးကို လွှမ်းခြုံနိုင်တာပဲ မဟုတ်လား။ Single-column index (column တစ်ခုတည်း ပါတဲ့ index) တွေမှာတော့ — အဲဒီ option တွေက တကယ်ပဲ redundant (ထပ်နေ) ပါတယ် — ဒါပေမယ့် — multicolumn index တွေမှာတော့ အသုံးဝင်ပါတယ်။ `(x, y)` ပေါ်က column နှစ်ခု ပါတဲ့ index တစ်ခုကို စဉ်းစားကြည့်ပါ — ဒါက — forward scan လုပ်ရင် `ORDER BY x, y` ကို ဖြည့်ဆည်းပေးနိုင်ပြီး — backward scan လုပ်ရင် `ORDER BY x DESC, y DESC` ကို ဖြည့်ဆည်းပေးနိုင်ပါတယ်။ ဒါပေမယ့် — application က `ORDER BY x ASC, y DESC` ကို မကြာခဏ သုံးနေရတာမျိုး ဖြစ်နိုင်ပါတယ်။ သာမန် (plain) index တစ်ခုကနေ အဲဒီအစဉ်ကို ရဖို့ နည်းလမ်း မရှိပါဘူး — ဒါပေမယ့် — index ကို `(x ASC, y DESC)` ဒါမှမဟုတ် `(x DESC, y ASC)` အနေနဲ့ သတ်မှတ်ထားရင်တော့ ရနိုင်ပါတယ်။

သိသာတာကတော့ — default မဟုတ်တဲ့ sort ordering တွေနဲ့ တည်ဆောက်ထားတဲ့ index တွေက အတော်လေး အထူးပြု (specialized) ထားတဲ့ feature တစ်ခုပါ — ဒါပေမယ့် — တချို့ query တွေအတွက်တော့ တစ်ခါတလေ ကြီးမားတဲ့ မြန်နှုန်း မြှင့်တင်မှုတွေ ရစေနိုင်ပါတယ်။ ဒီလို index တစ်ခုကို ထိန်းသိမ်းထားတာ တန်မတန်ဆိုတာက — special sort ordering လိုအပ်တဲ့ query တွေကို ခင်ဗျား ဘယ်နှစ်ကြိမ် သုံးလဲဆိုတာပေါ်မှာ မူတည်ပါတယ်။
