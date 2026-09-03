---
title: "Partial Indexes (partial index များ)"
description: "Partial index — table ရဲ့ အစိတ်အပိုင်း တစ်ခုပေါ်မှာသာ တည်ဆောက်တဲ့ index — အဖြစ်များတဲ့ တန်ဖိုးတွေကို index လုပ်ခြင်းမှ ရှောင်ရှားခြင်း၊ စိတ်မဝင်စားစရာ တန်ဖိုးတွေကို ချန်လှပ်ခြင်း၊ partial unique index နဲ့ predicate ကိုက်ညီမှု စည်းမျဉ်းများ"
order: 75
source: "https://www.postgresql.org/docs/current/indexes-partial.html"
status: translated
updated: 2026-09-03
---

## 11.8. Partial Indexes (partial index များ)

*Partial index* ဆိုတာ — table တစ်ခုရဲ့ subset (အစိတ်အပိုင်း) တစ်ခုအပေါ်မှာ တည်ဆောက်ထားတဲ့ index တစ်ခုပါ။ ဒီ subset ကို conditional expression (အခြေအနေအလိုက် ဖော်ပြချက်) နဲ့ သတ်မှတ်ပြီး — အဲဒီ expression ကို partial index ရဲ့ *predicate* (ကြိုတင်သတ်မှတ် အခြေအနေ) လို့ ခေါ်ပါတယ်။ Index ထဲမှာ — predicate ကို ကျေနပ်တဲ့ table row တွေအတွက်ပဲ entry တွေ ပါဝင်ပါတယ်။ Partial index က အထူးပြုလုပ်ထားတဲ့ (specialized) feature တစ်ခု ဖြစ်ပေမယ့် — အသုံးဝင်တဲ့ အခြေအနေ အများအပြား ရှိပါတယ်။

Partial index ကို သုံးရတဲ့ အဓိက အကြောင်းရင်း တစ်ခုကတော့ — အဖြစ်များတဲ့ (common) တန်ဖိုးတွေကို index လုပ်ခြင်းကနေ ရှောင်ရှားဖို့ ဖြစ်ပါတယ်။ အဖြစ်များတဲ့ တန်ဖိုး တစ်ခုကို ရှာတဲ့ query (ဆိုလိုတာက — table ရဲ့ row အားလုံးရဲ့ ရာခိုင်နှုန်း အနည်းငယ်ထက် ပိုပြီး ပါဝင်နေတဲ့ တန်ဖိုးမျိုး) က ဘယ်လိုပဲဖြစ်ဖြစ် index ကို သုံးမှာ မဟုတ်တာကြောင့် — အဲဒီ row တွေကို index ထဲမှာ ထားစရာ လုံးဝ မလိုပါဘူး။ ဒါက index ရဲ့ အရွယ်အစားကို လျှော့ချပေးပြီး — index ကို တကယ် သုံးတဲ့ query တွေကို မြန်ဆန်စေပါတယ်။ Index ကို ကိစ္စတိုင်းမှာ update လုပ်စရာ မလိုတော့တဲ့အတွက် — table update operation အများအပြားကိုလည်း မြန်ဆန်စေပါတယ်။ ဒီအကြံကို အသုံးချနိုင်တဲ့ နည်းလမ်း တစ်ခုကို [ဥပမာ 11.1](/docs/postgresql/indexes-partial) မှာ ပြထားပါတယ်။

**ဥပမာ 11.1. အဖြစ်များတဲ့ တန်ဖိုးတွေကို ချန်လှပ်ဖို့ Partial Index တစ်ခု တည်ဆောက်ခြင်း**

web server ရဲ့ access log (ဝင်ရောက်မှု မှတ်တမ်း) တွေကို database တစ်ခုထဲမှာ သိမ်းထားတယ် ဆိုပါစို့။ Access အများစုက သင့် အဖွဲ့အစည်း (organization) ရဲ့ IP address အကွာအဝေး (range) ကနေ လာပေမယ့် — တချို့ကတော့ တခြားနေရာတွေကနေ လာပါတယ် (ဥပမာ — dial-up connection (တယ်လီဖုန်းလိုင်းကနေ ချိတ်ဆက်မှု) သုံးတဲ့ ဝန်ထမ်းတွေလိုမျိုး)။ IP နဲ့ ရှာဖွေမှုတွေက အဓိကအားဖြင့် ပြင်ပ ဝင်ရောက်မှုတွေအတွက်ဆိုရင် — သင့် organization ရဲ့ subnet (ကွန်ရက်ခွဲ) နဲ့ ကိုက်ညီတဲ့ IP range ကို index လုပ်စရာ မလိုနိုင်ပါဘူး။

ဒီလိုပုံစံ table တစ်ခု ရှိတယ် ဆိုပါစို့ —

```sql
CREATE TABLE access_log (
    url varchar,
    client_ip inet,
    ...
);
```

ဒီဥပမာနဲ့ ကိုက်ညီတဲ့ partial index တစ်ခု ဖန်တီးဖို့ဆိုရင် — ဒီလိုမျိုး command တစ်ခုကို သုံးပါ —

```sql
CREATE INDEX access_log_client_ip_ix ON access_log (client_ip)
WHERE NOT (client_ip > inet '192.168.100.0' AND
           client_ip < inet '192.168.100.255');
```

ဒီ index ကို သုံးလို့ရတဲ့ ပုံမှန် query တစ်ခုကတော့ —

```sql
SELECT *
FROM access_log
WHERE url = '/index.html' AND client_ip = inet '212.78.10.32';
```

ဒီနေရာမှာ — query ရဲ့ IP address က partial index ရဲ့ လွှမ်းခြုံမှုအောက်မှာ ရှိပါတယ်။ အောက်က query ကတော့ — index ကနေ ချန်လှပ်ထားတဲ့ IP address တစ်ခုကို သုံးထားတာကြောင့် — partial index ကို သုံးလို့ မရပါဘူး —

```sql
SELECT *
FROM access_log
WHERE url = '/index.html' AND client_ip = inet '192.168.100.23';
```

ဒီလို partial index အမျိုးအစားက အဖြစ်များတဲ့ တန်ဖိုးတွေကို ကြိုတင် သတ်မှတ်ထားဖို့ လိုအပ်တာ သတိပြုပါ — ဒါကြောင့် ဒီလို partial index တွေက မပြောင်းလဲတဲ့ data distribution (ဒေတာ ဖြန့်ဖြူးမှုပုံစံ) တွေအတွက်သာ အသင့်တော်ဆုံး ဖြစ်ပါတယ်။ ဒီလို index တွေကို data distribution အသစ်တွေနဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် ရံဖန်ရံခါ ပြန်လည် ဖန်တီးလို့ရပေမယ့် — ဒါက maintenance (ထိန်းသိမ်းမှု) အားထုတ်မှု ထပ်တိုးစေပါတယ်။

Partial index ရဲ့ နောက်ထပ် အသုံးတစ်ခုကတော့ — ပုံမှန် query workload (လုပ်ငန်းဝန်) က စိတ်မဝင်စားတဲ့ တန်ဖိုးတွေကို index ကနေ ချန်လှပ်ဖို့ ဖြစ်ပါတယ် — ဒါကို [ဥပမာ 11.2](/docs/postgresql/indexes-partial) မှာ ပြထားပါတယ်။ ဒါက အထက်မှာ ဖော်ပြခဲ့တဲ့ အားသာချက်တွေကို ရရှိစေပေမယ့် — အဲဒီလို ကိစ္စမှာ index scan က အကျိုးရှိနိုင်ရင်တောင် — "စိတ်မဝင်စားစရာ" တန်ဖိုးတွေကို အဲဒီ index ကနေ တစ်ဆင့် ဝင်ရောက် ကြည့်ရှုခြင်းကနေ တားဆီးပေးပါတယ်။ သိသာတာကတော့ — ဒီလို အခြေအနေမျိုးအတွက် partial index တွေ တည်ဆောက်တာက ဂရုစိုက်မှုနဲ့ စမ်းသပ်မှု (experimentation) အများကြီး လိုအပ်ပါတယ်။

**ဥပမာ 11.2. စိတ်မဝင်စားစရာ တန်ဖိုးတွေကို ချန်လှပ်ဖို့ Partial Index တစ်ခု တည်ဆောက်ခြင်း**

billed (ငွေတောင်းခံပြီးသား) နဲ့ unbilled (ငွေမတောင်းခံရသေး) order တွေ နှစ်မျိုးလုံး ပါတဲ့ table တစ်ခု ရှိတယ် ဆိုပါစို့ — unbilled order တွေက table တစ်ခုလုံးရဲ့ အပိုင်းအစ အနည်းငယ်သာ ပါဝင်ပေမယ့် — အဲဒီ row တွေက ဝင်ရောက် ကြည့်ရှုမှု အများဆုံး row တွေ ဖြစ်နေပါတယ်။ ဒီလိုဆိုရင် — unbilled row တွေပေါ်မှာပဲ index တစ်ခု ဖန်တီးပြီး performance (စွမ်းဆောင်ရည်) ကို မြှင့်တင်နိုင်ပါတယ်။ Index ဖန်တီးဖို့ command က ဒီလိုပုံ ဖြစ်ပါမယ် —

```sql
CREATE INDEX orders_unbilled_index ON orders (order_nr)
    WHERE billed is not true;
```

ဒီ index ကို သုံးလို့ရတဲ့ query တစ်ခုကတော့ —

```sql
SELECT * FROM orders WHERE billed is not true AND order_nr < 10000;
```

ဒါပေမယ့် — `order_nr` နဲ့ လုံးဝ မသက်ဆိုင်တဲ့ query တွေမှာလည်း ဒီ index ကို သုံးလို့ရပါတယ် — ဥပမာ —

```sql
SELECT * FROM orders WHERE billed is not true AND amount > 5000.00;
```

ဒါက system က index တစ်ခုလုံးကို scan လုပ်ရတာကြောင့် — `amount` column ပေါ်က partial index လောက်တော့ ထိရောက်မှု မရှိပါဘူး။ ဒါပေမယ့် — unbilled order တွေ အတော်လေး နည်းနေတယ်ဆိုရင် — unbilled order တွေကို ရှာဖွေဖို့အတွက်သာ ဒီ partial index ကို သုံးတာက အကျိုးရှိနိုင်ပါတယ်။

ဒီ query ကတော့ ဒီ index ကို သုံးလို့ မရတာ သတိပြုပါ —

```sql
SELECT * FROM orders WHERE order_nr = 3501;
```

Order 3501 က billed order တွေထဲမှာလည်း ပါနိုင်သလို — unbilled order တွေထဲမှာလည်း ပါနိုင်ပါတယ်။

[ဥပမာ 11.2](/docs/postgresql/indexes-partial) က index လုပ်ထားတဲ့ column နဲ့ predicate ထဲမှာ သုံးထားတဲ့ column တွေဟာ တူညီစရာ မလိုဘူးဆိုတာကိုလည်း ဖော်ပြပါတယ်။ PostgreSQL က arbitrary predicate တွေ ပါတဲ့ partial index တွေကို ထောက်ပံ့ပါတယ် — index လုပ်နေတဲ့ table ရဲ့ column တွေပဲ ပါဝင်နေသရွေ့ပေါ့။ ဒါပေမယ့် — predicate က index ကနေ အကျိုးခံစားရမယ့် query တွေထဲမှာ သုံးထားတဲ့ အခြေအနေတွေနဲ့ ကိုက်ညီရမယ်ဆိုတာ သတိရပါ။ အတိအကျ ပြောရရင် — partial index တစ်ခုကို query တစ်ခုမှာ သုံးလို့ရဖို့အတွက် — query ရဲ့ `WHERE` အခြေအနေက index ရဲ့ predicate ကို သင်္ချာနည်းအရ imply (သက်ရောက်မှု ရှိ) လုပ်တယ်ဆိုတာကို system က မှတ်မိနိုင်မှသာ ဖြစ်ပါတယ်။ PostgreSQL မှာ ပုံစံချင်း မတူပေမယ့် သင်္ချာနည်းအရ ညီမျှတဲ့ expression တွေကို မှတ်မိနိုင်တဲ့ ဆန်းပြားတဲ့ theorem prover (သက်သေပြ ယန္တရား) မျိုး မပါဝင်ပါဘူး။ (ဒီလို ယေဘုယျ theorem prover မျိုးက ဖန်တီးဖို့ အလွန် ခက်ခဲရုံသာမက — လက်တွေ့ အသုံးဝင်ဖို့အတွက်လည်း နှေးကွေးလွန်းနိုင်ခြေ ရှိပါတယ်။) System က ရိုးရှင်းတဲ့ inequality implication တွေကိုတော့ မှတ်မိနိုင်ပါတယ် — ဥပမာ "x < 1" က "x < 2" ကို imply လုပ်တာမျိုးပါ — ဒါမှမဟုတ်ရင် predicate အခြေအနေက query ရဲ့ `WHERE` အခြေအနေရဲ့ အစိတ်အပိုင်း တစ်ခုနဲ့ အတိအကျ ကိုက်ညီနေရမှာ ဖြစ်ပြီး — ဒါမှသာ index ကို အသုံးပြုလို့ရတဲ့အဖြစ် မှတ်မိမှာ ဖြစ်ပါတယ်။ ဒီလို ကိုက်ညီမှုကို စစ်ဆေးတာက query planning အချိန်မှာ ဖြစ်ပြီး — run time (လည်ပတ်ချိန်) မှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — parameter ပါတဲ့ query clause တွေက partial index နဲ့ အလုပ်မဖြစ်ပါဘူး။ ဥပမာ — parameter တစ်ခု ပါတဲ့ prepared query (ကြိုတင် ပြင်ဆင်ထားတဲ့ query) က "x < ?" လို့ သတ်မှတ်ထားမယ်ဆိုရင် — အဲဒါက parameter ရဲ့ ဖြစ်နိုင်တဲ့ တန်ဖိုး အားလုံးအတွက် "x < 2" ကို ဘယ်တော့မှ imply လုပ်နိုင်မှာ မဟုတ်ပါဘူး။

Partial index တွေရဲ့ တတိယမြောက် အသုံးတစ်ခုကတော့ — index ကို query တွေမှာ လုံးဝ မသုံးဘဲနဲ့လည်း အလုပ်ဖြစ်ပါတယ်။ ဒီနေရာက အကြံကတော့ — [ဥပမာ 11.3](/docs/postgresql/indexes-partial) မှာ ပြထားသလို — table ရဲ့ subset တစ်ခုအပေါ်မှာ unique index (ထပ်တူညီမှု မရှိအောင် ထိန်းပေးတဲ့ index) တစ်ခု ဖန်တီးဖို့ ဖြစ်ပါတယ်။ ဒါက index ရဲ့ predicate ကို ကျေနပ်တဲ့ row တွေကြားမှာ uniqueness (ထူးခြားမှု) ကို အတည်ပြုပေးပြီး — အဲဒီ predicate ကို မကျေနပ်တဲ့ row တွေကိုတော့ ကန့်သတ်မထားပါဘူး။

**ဥပမာ 11.3. Partial Unique Index တစ်ခု တည်ဆောက်ခြင်း**

စမ်းသပ်မှု ရလဒ်တွေကို ဖော်ပြတဲ့ table တစ်ခု ရှိတယ် ဆိုပါစို့။ ပေးထားတဲ့ subject နဲ့ target ပေါင်းစပ်မှု တစ်ခုအတွက် — "အောင်မြင် (successful)" entry တစ်ခုပဲ ရှိစေချင်ပေမယ့် — "မအောင်မြင် (unsuccessful)" entry တွေကတော့ ဘယ်နှစ်ခုမဆို ရှိခွင့် ပေးချင်ပါတယ်။ အဲဒါကို လုပ်ဖို့ နည်းလမ်း တစ်ခုကတော့ —

```sql
CREATE TABLE tests (
    subject text,
    target text,
    success boolean,
    ...
);

CREATE UNIQUE INDEX tests_success_constraint ON tests (subject, target)
    WHERE success;
```

ဒါက successful test တွေ နည်းပြီး — unsuccessful test တွေ အများကြီး ရှိတဲ့အခါ အထူး ထိရောက်တဲ့ နည်းလမ်း တစ်ခု ဖြစ်ပါတယ်။ `IS NULL` restriction (ကန့်သတ်ချက်) ပါတဲ့ unique partial index တစ်ခုကို ဖန်တီးပြီး — column တစ်ခုမှာ null တစ်ခုပဲ ရှိခွင့် ပြုတာမျိုးလည်း လုပ်နိုင်ပါတယ်။

နောက်ဆုံးအနေနဲ့ — partial index ကို system ရဲ့ query plan (query စီစဉ်မှု) ရွေးချယ်ချက်တွေကို လွှမ်းမိုး ပြောင်းလဲဖို့ (override) လည်း သုံးနိုင်ပါတယ်။ ဒါ့အပြင် — ထူးဆန်းတဲ့ distribution ရှိတဲ့ data set တွေက — system က index ကို တကယ် မသုံးသင့်တဲ့ နေရာမှာ သုံးမိစေတတ်ပါတယ်။ အဲဒီလို အခြေအနေမှာ — index ကို ပြဿနာ ဖြစ်စေတဲ့ (offending) query အတွက် မရနိုင်အောင် စီစဉ်ထားလို့ရပါတယ်။ ပုံမှန်အားဖြင့် PostgreSQL က index အသုံးပြုမှုနဲ့ ပတ်သက်ပြီး ကျိုးကြောင်းဆီလျော်တဲ့ ရွေးချယ်မှုတွေ ပြုလုပ်ပါတယ် (ဥပမာ — အဖြစ်များတဲ့ တန်ဖိုးတွေကို ပြန်ယူတဲ့အခါ index တွေကို ရှောင်ပါတယ် — ဒါကြောင့် အထက်က ဥပမာက index အရွယ်အစားကိုပဲ တကယ် သက်သာစေတာဖြစ်ပြီး — index မသုံးဖို့အတွက် မလိုအပ်ပါဘူး) — ပြီးတော့ လုံးဝ မှားနေတဲ့ plan ရွေးချယ်မှုတွေကတော့ bug report (ချွတ်ယွင်းချက် အစီရင်ခံစာ) တင်ရမယ့် အကြောင်းရင်း ဖြစ်ပါတယ်။

Partial index တစ်ခု တည်ဆောက်တာက — query planner (query စီစဉ်ပေးတဲ့ ယန္တရား) သိထားတာနဲ့ အနည်းဆုံး အလားတူလောက် သင်ကိုယ်တိုင် သိထားတယ်လို့ ဆိုလိုတာ ဖြစ်ကြောင်း — အထူးသဖြင့် index တစ်ခုက ဘယ်အချိန်မှာ အကျိုးရှိနိုင်လဲဆိုတာကို သင်သိထားတယ်လို့ ဆိုလိုတာ ဖြစ်ကြောင်း သတိရပါ။ ဒီလို အသိပညာကို တည်ဆောက်ဖို့အတွက် — PostgreSQL မှာ index တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ အတွေ့အကြုံနဲ့ နားလည်မှု လိုအပ်ပါတယ်။ အများစုမှာတော့ — ပုံမှန် index တစ်ခုနဲ့ ယှဉ်ရင် partial index ရဲ့ အားသာချက်က အနည်းငယ်မျှသာ ဖြစ်ပါတယ်။ [ဥပမာ 11.4](/docs/postgresql/indexes-partial) မှာ ပြထားသလို — တချို့ အခြေအနေတွေမှာတော့ လုံးဝကို ဆိုးကျိုးထုတ်တဲ့ (counterproductive) ဖြစ်နိုင်ပါတယ်။

**ဥပမာ 11.4. Partitioning ရဲ့ အစားထိုးအဖြစ် Partial Index တွေကို မသုံးပါနဲ့**

တစ်ခုနဲ့တစ်ခု ထပ်နေမှု မရှိတဲ့ (non-overlapping) partial index အများအပြားကို ဖန်တီးချင်စိတ် ပေါ်လာနိုင်ပါတယ် — ဥပမာ —

```sql
CREATE INDEX mytable_cat_1 ON mytable (data) WHERE category = 1;
CREATE INDEX mytable_cat_2 ON mytable (data) WHERE category = 2;
CREATE INDEX mytable_cat_3 ON mytable (data) WHERE category = 3;
...
CREATE INDEX mytable_cat_N ON mytable (data) WHERE category = N;
```

ဒါက မကောင်းတဲ့ အကြံတစ်ခုပါ! ဒီလိုမျိုး မလုပ်ဘဲ — ဒီလို ကြေညာထားတဲ့ partial မဟုတ်တဲ့ index တစ်ခုတည်း (single non-partial index) နဲ့ဆိုရင် ပိုကောင်းပါတယ် —

```sql
CREATE INDEX mytable_cat_data ON mytable (category, data);
```

(category column ကို ရှေ့ဆုံးမှာ ထားပါ — အကြောင်းရင်းတွေကို [အပိုင်း 11.3](/docs/postgresql/indexes-multicolumn) မှာ ဖော်ပြထားပါတယ်။) ဒီလို ပိုကြီးတဲ့ index ထဲမှာ ရှာဖွေတာက — သေးငယ်တဲ့ index တစ်ခုထဲမှာ ရှာတာထက် tree level (သစ်ပင် အဆင့်) နှစ်ခုလောက် ပိုပြီး ဆင်းရနိုင်ပေမယ့် — partial index တွေထဲက သင့်လျော်တဲ့ တစ်ခုကို ရွေးချယ်ဖို့ planner လိုအပ်တဲ့ အားထုတ်မှုထက်တော့ သေချာပေါက် သက်သာပါတယ်။ ပြဿနာရဲ့ အနှစ်သာရကတော့ — system က partial index တွေကြားက ဆက်စပ်မှုကို နားမလည်တာကြောင့် — လက်ရှိ query နဲ့ သက်ဆိုင်မှု ရှိမရှိ သိဖို့ index တစ်ခုချင်းစီကို အင်တိုက်အားတိုက် (laboriously) စမ်းသပ်ရတာ ဖြစ်ပါတယ်။

သင့် table က index တစ်ခုတည်းနဲ့ တကယ်ပဲ မကောင်းလောက်အောင် ကြီးနေတယ်ဆိုရင် — ဒီအစား partitioning (ခွဲခြမ်း သိမ်းဆည်းခြင်း) ကို သုံးဖို့ စဉ်းစားသင့်ပါတယ် ([အပိုင်း 5.12](/docs/postgresql/ddl-partitioning) ကို ကြည့်ပါ)။ အဲဒီ ယန္တရားနဲ့ဆိုရင် — system က table တွေနဲ့ index တွေဟာ တစ်ခုနဲ့တစ်ခု ထပ်နေမှု မရှိဘူးဆိုတာကို နားလည်တာကြောင့် — သိသိသာသာ ပိုကောင်းတဲ့ performance ကို ရရှိနိုင်ပါတယ်။

Partial index တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [[ston89b]](https://www.postgresql.org/docs/current/biblio.html#STON89B), [[olson93]](https://www.postgresql.org/docs/current/biblio.html#OLSON93) နဲ့ [[seshadri95]](https://www.postgresql.org/docs/current/biblio.html#SESHADRI95) တို့မှာ တွေ့နိုင်ပါတယ်။
