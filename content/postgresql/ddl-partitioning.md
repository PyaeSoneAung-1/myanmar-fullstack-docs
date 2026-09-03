---
title: "Table Partitioning (table ခွဲဝေခြင်း)"
description: "ကြီးမားတဲ့ table တစ်ခုကို partition အသေးများအဖြစ် ခွဲဝေသိမ်းဆည်းခြင်း (table partitioning) — declarative partitioning, inheritance နည်းဖြင့် partitioning, partition pruning, constraint exclusion နဲ့ အကောင်းဆုံး လုပ်နည်းများ"
order: 30
source: "https://www.postgresql.org/docs/current/ddl-partitioning.html"
status: translated
updated: 2026-09-03
---

## 5.12. Table Partitioning (table ခွဲဝေခြင်း)

- **5.12.1. Overview (ခြုံငုံသုံးသပ်ချက်)**
- **5.12.2. Declarative Partitioning (ကြေညာနည်းဖြင့် ခွဲဝေခြင်း)**
- **5.12.3. Partitioning Using Inheritance (Inheritance သုံးပြီး ခွဲဝေခြင်း)**
- **5.12.4. Partition Pruning (partition များ ဖယ်ထုတ်ခြင်း)**
- **5.12.5. Partitioning and Constraint Exclusion (partitioning နှင့် constraint exclusion)**
- **5.12.6. Best Practices for Declarative Partitioning (Declarative partitioning အတွက် အကောင်းဆုံး နည်းလမ်းများ)**

PostgreSQL က basic table partitioning (table ခွဲဝေခြင်း) ကို ထောက်ပံ့ပေးပါတယ်။ ဒီ section မှာ — partitioning ကို သင့်ရဲ့ database design ရဲ့ အစိတ်အပိုင်း တစ်ခုအဖြစ် ဘာကြောင့် အကောင်အထည် ဖော်သင့်လဲ၊ ဘယ်လို အကောင်အထည် ဖော်ရမလဲဆိုတာကို ဖော်ပြထားပါတယ်။

### 5.12.1. Overview (ခြုံငုံသုံးသပ်ချက်)

Partitioning ဆိုတာ — ယုတ္တိအရ (logically) ကြီးမားတဲ့ table တစ်ခုတည်းကို ရုပ်ပိုင်းဆိုင်ရာ (physically) သေးငယ်တဲ့ အပိုင်းအစတွေ အဖြစ် ခွဲလိုက်တာကို ဆိုလိုပါတယ်။ Partitioning က အကျိုးကျေးဇူး အများအပြား ပေးနိုင်ပါတယ်:

- အချို့သော အခြေအနေတွေမှာ query ရဲ့ စွမ်းဆောင်ရည်ကို သိသိသာသာ တိုးတက်စေနိုင်ပါတယ် — အထူးသဖြင့် table ရဲ့ မကြာခဏ အသုံးပြုနေတဲ့ (heavily accessed) rows အများစုက partition တစ်ခုတည်း ဒါမှမဟုတ် partition အနည်းငယ်ထဲမှာ ရှိနေတဲ့အခါမျိုးမှာပါ။ Partitioning က index တွေရဲ့ အပေါ်ဆုံး tree levels တွေနေရာမှာ ထိရောက်စွာ အစားထိုး လုပ်ဆောင်ပေးလို့ — index တွေရဲ့ အသုံးများတဲ့ အစိတ်အပိုင်းတွေ memory ထဲမှာ ဝင်ဆံ့နိုင်ဖို့ ပိုပြီး ဖြစ်နိုင်ခြေ များပါတယ်။
- Queries ဒါမှမဟုတ် updates တွေက partition တစ်ခုတည်းရဲ့ ရာခိုင်နှုန်း ကြီးကြီးတစ်ခုကို ဝင်ရောက် လုပ်ဆောင်တဲ့အခါ — table တစ်ခုလုံး အနှံ့ ပြန့်ကျဲနေတဲ့ random-access reads တွေ လိုအပ်စေမယ့် index ကို သုံးမယ့်အစား — အဲဒီ partition ကို sequential scan နဲ့ သုံးခြင်းအားဖြင့် စွမ်းဆောင်ရည် မြှင့်တင်နိုင်ပါတယ်။
- Bulk loads နဲ့ deletes တွေကို — partitions တွေ ထည့်ခြင်း ဒါမှမဟုတ် ဖယ်ရှားခြင်းအားဖြင့် ပြီးမြောက်စေနိုင်ပါတယ် — အသုံးပြုမှုပုံစံ (usage pattern) ကို partitioning design ထဲမှာ ထည့်သွင်း စဉ်းစားထားရင် ဖြစ်ပါတယ်။ Partition တစ်ခုချင်းစီကို DROP TABLE သုံးပြီး ဖျက်ချတာ ဒါမှမဟုတ် ALTER TABLE DETACH PARTITION လုပ်တာက — bulk operation တစ်ခုထက် အဆများစွာ ပိုမြန်ပါတယ်။ ဒီ commands တွေက bulk DELETE တစ်ခုကြောင့် ဖြစ်ပေါ်လာတဲ့ VACUUM overhead ကိုပါ လုံးဝ ရှောင်ရှားပေးပါတယ်။
- သိပ်မသုံးတော့တဲ့ data တွေကို ပိုပြီး စျေးသက်သာပြီး နှေးကွေးတဲ့ storage media တွေဆီ ရွှေ့ပြောင်း သိမ်းဆည်းနိုင်ပါတယ်။

ဒီ အကျိုးကျေးဇူးတွေက — table တစ်ခုက တခြားနည်းဆိုရင် အလွန်ကြီးမားနေမယ့် အခြေအနေမျိုးမှာသာ ယေဘုယျအားဖြင့် အကျိုးရှိပါတယ်။ Table တစ်ခုက partitioning ကနေ အကျိုးအမြတ် ရမယ့် အတိအကျ နေရာကတော့ application အပေါ်မှာ မူတည်ပြီး — လက်မ-စည်းမျဉ်း (rule of thumb) တစ်ခုအနေနဲ့ကတော့ table ရဲ့ အရွယ်အစားက database server ရဲ့ physical memory ထက် ကျော်လွန်နေသင့်ပါတယ်။

PostgreSQL က အောက်ပါ partitioning ပုံစံတွေအတွက် built-in ထောက်ပံ့မှု ပေးထားပါတယ်:

- **Range Partitioning** — Partition key column (သို့မဟုတ် column အုပ်စု တစ်ခု) နဲ့ သတ်မှတ်ထားတဲ့ "ranges" (အပိုင်းအခြားများ) အလိုက် table ကို ခွဲထားပါတယ် — partition အမျိုးမျိုးကို သတ်မှတ်ပေးတဲ့ value ranges တွေကြားမှာ ထပ်နေမှု (overlap) မရှိပါဘူး။ ဥပမာ — date ranges တွေနဲ့ ခွဲတာမျိုး၊ ဒါမှမဟုတ် သီးခြား business objects တွေရဲ့ identifier ranges တွေနဲ့ ခွဲတာမျိုး လုပ်နိုင်ပါတယ်။ Range တစ်ခုချင်းစီရဲ့ နယ်နိမိတ်တွေကို — အောက်စွန်းမှာ အကျုံးဝင် (inclusive) ပြီး — အပေါ်စွန်းမှာတော့ အကျုံးမဝင် (exclusive) အဖြစ် နားလည်ရပါတယ်။ ဥပမာ — partition တစ်ခုရဲ့ range က 1 ကနေ 10 အထိ ဖြစ်ပြီး — နောက်တစ်ခုရဲ့ range က 10 ကနေ 20 အထိ ဆိုရင် — value 10 က ပထမ partition မဟုတ်ဘဲ ဒုတိယ partition ထဲမှာ ပါဝင်ပါတယ်။
- **List Partitioning** — Partition တစ်ခုချင်းစီမှာ ဘယ် key value (တွေ) ပါဝင်မလဲဆိုတာကို ထင်ရှားစွာ စာရင်းပြုပြီး table ကို ခွဲထားပါတယ်။
- **Hash Partitioning** — Partition တစ်ခုချင်းစီအတွက် modulus (စားကိန်း) တစ်ခုနဲ့ remainder (အကြွင်း) တစ်ခုကို သတ်မှတ်ပြီး table ကို ခွဲထားပါတယ်။ Partition တစ်ခုချင်းစီက — partition key ရဲ့ hash value ကို သတ်မှတ်ထားတဲ့ modulus နဲ့ စားလိုက်တဲ့အခါ သတ်မှတ်ထားတဲ့ remainder ထွက်လာတဲ့ rows တွေကို သိမ်းဆည်းပါလိမ့်မယ်။

သင့်ရဲ့ application က အပေါ်မှာ စာရင်းပြုထားတာ မဟုတ်တဲ့ တခြား partitioning ပုံစံတွေ လိုအပ်ရင် — inheritance နဲ့ `UNION ALL` views တို့လို အစားထိုး နည်းလမ်းတွေကို သုံးနိုင်ပါတယ်။ ဒီနည်းလမ်းတွေက ပြောင်းလွယ်ပြင်လွယ် (flexibility) ရှိပေမယ့် — built-in declarative partitioning ရဲ့ စွမ်းဆောင်ရည် အကျိုးကျေးဇူး တချို့တော့ မပါဝင်ပါဘူး။

### 5.12.2. Declarative Partitioning (ကြေညာနည်းဖြင့် ခွဲဝေခြင်း)

PostgreSQL က table တစ်ခုကို partitions တွေ အဖြစ် ပိုင်းခြားထားကြောင်း ကြေညာ (declare) လုပ်ခွင့် ပေးပါတယ်။ ဒီလို ပိုင်းခြားထားတဲ့ table ကို *partitioned table* (ခွဲဝေထားသော table) လို့ ခေါ်ပါတယ်။ ဒီကြေညာချက်ထဲမှာ — အပေါ်မှာ ဖော်ပြခဲ့တဲ့ *partitioning method* နဲ့အတူ — *partition key* အဖြစ် သုံးမယ့် columns ဒါမှမဟုတ် expressions တွေရဲ့ စာရင်း တစ်ခုလည်း ပါဝင်ပါတယ်။

Partitioned table ကိုယ်တိုင်က ကိုယ်ပိုင် storage လုံးဝ မရှိတဲ့ "virtual" table တစ်ခုပါ။ ဒါအစား — storage က partitioned table နဲ့ ဆက်စပ်ထားတဲ့ သာမန် (otherwise-ordinary) tables တွေဖြစ်တဲ့ *partitions* တွေဆီမှာ ရှိပါတယ်။ Partition တစ်ခုချင်းစီက သူ့ရဲ့ *partition bounds* (partition နယ်နိမိတ်များ) နဲ့ သတ်မှတ်ထားတဲ့အတိုင်း data ရဲ့ အစုခွဲ (subset) တစ်ခုကို သိမ်းဆည်းပါတယ်။ Partitioned table ထဲကို insert လုပ်တဲ့ rows အားလုံးက — partition key column (တွေ) ရဲ့ values တွေအပေါ် မူတည်ပြီး — သင့်လျော်တဲ့ partition တစ်ခုဆီကို ပို့ဆောင်ခံရပါတယ်။ Row တစ်ခုရဲ့ partition key ကို update လုပ်တဲ့အခါ — အဲဒီ row က မူရင်း partition ရဲ့ partition bounds တွေကို မကျေနပ်တော့ဘူးဆိုရင် — တခြား partition တစ်ခုဆီကို ရွှေ့ပြောင်းသွားစေပါတယ်။

Partitions တွေကိုယ်တိုင်ကိုလည်း partitioned tables အဖြစ် သတ်မှတ်လို့ရပြီး — ဒါကို *sub-partitioning* (ထပ်ဆင့် ခွဲဝေခြင်း) လို့ ခေါ်ပါတယ်။ Partitions တိုင်းက သူတို့ရဲ့ partitioned parent နဲ့ column တွေ အတူတူပဲ ရှိရမယ်ဆိုပေမယ့် — partitions တွေမှာ ကိုယ်ပိုင် indexes, constraints နဲ့ default values တွေ ရှိနိုင်ပြီး — တခြား partitions တွေနဲ့ မတူညီဘဲ ဖြစ်နိုင်ပါတယ်။ Partitioned tables နဲ့ partitions တွေ ဖန်တီးခြင်းအကြောင်း နောက်ထပ် အသေးစိတ်အတွက် [CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) ကို ကြည့်ပါ။

သာမန် table တစ်ခုကို partitioned table အဖြစ် ပြောင်းလဲလို့ မရသလို — အပြန်အလှန်လည်း မရပါဘူး။ ဒါပေမယ့် — ရှိပြီးသား သာမန် table ဒါမှမဟုတ် partitioned table တစ်ခုကို partitioned table တစ်ခုရဲ့ partition အဖြစ် ထည့်လို့ရပြီး — ဒါမှမဟုတ် partitioned table တစ်ခုကနေ partition တစ်ခုကို ဖယ်ရှားပြီး သီးခြား (standalone) table တစ်ခု ဖြစ်အောင် လုပ်လို့လည်း ရပါတယ်။ ဒါက maintenance လုပ်ငန်းစဉ် အများအပြားကို ရိုးရှင်းစေပြီး မြန်ဆန်စေနိုင်ပါတယ်။ `ATTACH PARTITION` နဲ့ `DETACH PARTITION` sub-commands တွေအကြောင်း ပိုသိရဖို့ [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) ကို ကြည့်ပါ။

Partitions တွေက [foreign tables](/docs/postgresql/ddl-foreign-data) တွေလည်း ဖြစ်နိုင်ပါတယ် — ဒါပေမယ့် ဒီအခါမှာ foreign table ရဲ့ contents တွေက partitioning စည်းမျဉ်းကို ကျေနပ်စေဖို့ဆိုတာ user ရဲ့ တာဝန် ဖြစ်လာလို့ — သိသိသာသာ ဂရုစိုက်မှု လိုအပ်ပါတယ်။ တခြား ကန့်သတ်ချက်တချို့လည်း ရှိပါသေးတယ်။ နောက်ထပ် အချက်အလက်အတွက် [CREATE FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-createforeigntable.html) ကို ကြည့်ပါ။

#### 5.12.2.1. Example (ဥပမာ)

ရေခဲမုန့် (ice cream) ကုမ္ပဏီကြီး တစ်ခုအတွက် database တစ်ခု တည်ဆောက်နေတယ် ဆိုပါစို့။ ကုမ္ပဏီက နေ့စဉ် အမြင့်ဆုံး အပူချိန် (peak temperatures) တွေအပြင် — ဒေသ တစ်ခုချင်းစီမှာရှိတဲ့ ရေခဲမုန့် ရောင်းအား (sales) တွေကိုပါ တိုင်းတာပါတယ်။ သဘောတရားအရ — ကျွန်ုပ်တို့ ဒီလို table တစ်ခု လိုချင်ပါတယ်:

```sql
CREATE TABLE measurement (
    city_id         int not null,
    logdate         date not null,
    peaktemp        int,
    unitsales       int
);
```

ဒီ table ရဲ့ အဓိက အသုံးက management အတွက် online reports တွေ ပြင်ဆင်ဖို့ ဖြစ်လို့ — queries အများစုက ပြီးခဲ့တဲ့ ရက်သတ္တပတ်၊ လ ဒါမှမဟုတ် သုံးလပတ် (quarter) ရဲ့ data တွေကိုပဲ ဝင်ရောက်မယ်ဆိုတာ ကျွန်ုပ်တို့ သိပါတယ်။ သိမ်းဆည်းစရာ လိုအပ်တဲ့ data အဟောင်း ပမာဏကို လျှော့ချဖို့ — နောက်ဆုံး ၃ နှစ်စာ data ကိုပဲ သိမ်းထားဖို့ ဆုံးဖြတ်လိုက်ပါတယ်။ လတစ်လရဲ့ အစမှာ — နောက်အကျဆုံး (အသက်အကြီးဆုံး) လရဲ့ data ကို ဖယ်ရှားပါမယ်။ ဒီအခြေအနေမှာ ကျွန်ုပ်တို့ရဲ့ measurements table အတွက် လိုအပ်ချက် အမျိုးမျိုးကို ပြည့်မီအောင် — partitioning ကို သုံးနိုင်ပါတယ်။

ဒီကိစ္စမှာ declarative partitioning ကို သုံးဖို့ အောက်ပါ အဆင့်တွေ လုပ်ဆောင်ပါ:

1. PARTITION BY clause ကို သတ်မှတ်ပြီး measurement table ကို partitioned table တစ်ခုအနေနဲ့ ဖန်တီးပါ — ဒီ clause မှာ partitioning method (ဒီနေရာမှာ RANGE) နဲ့ partition key အဖြစ် သုံးမယ့် column (တစ်ခု သို့မဟုတ် အများ) ရဲ့ စာရင်း ပါဝင်ပါတယ်။
  
  CREATE TABLE measurement (
      city_id         int not null,
      logdate         date not null,
      peaktemp        int,
      unitsales       int
  ) PARTITION BY RANGE (logdate);
2. Partitions တွေကို ဖန်တီးပါ။ Partition တစ်ခုချင်းစီရဲ့ definition မှာ — parent ရဲ့ partitioning method နဲ့ partition key နဲ့ ကိုက်ညီတဲ့ bounds တွေကို သတ်မှတ်ပေးရပါတယ်။ New partition ရဲ့ values တွေက ရှိပြီးသား partition တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ partitions တွေနဲ့ ထပ်နေစေမယ့် bounds တွေကို သတ်မှတ်မိရင် error တစ်ခု ဖြစ်စေမယ်ဆိုတာ သတိပြုပါ။
  ဒီလို ဖန်တီးလိုက်တဲ့ partitions တွေက — ဘယ်နည်းနဲ့မဆို သာမန် PostgreSQL tables (ဒါမှမဟုတ် ဖြစ်နိုင်ရင် foreign tables) တွေပါပဲ။ Partition တစ်ခုချင်းစီအတွက် tablespace နဲ့ storage parameters တွေကို သီးခြားစီ သတ်မှတ်လို့ရပါတယ်။
  ကျွန်ုပ်တို့ရဲ့ ဥပမာမှာ — တစ်လစာ data တွေကို တစ်ခါတည်း ဖျက်ပစ်ရမယ့် လိုအပ်ချက်နဲ့ ကိုက်ညီဖို့ — partition တစ်ခုချင်းစီက တစ်လစာ data ကို သိမ်းထားသင့်ပါတယ်။ ဒါကြောင့် commands တွေက ဒီလို မြင်ရနိုင်ပါတယ်:
  
  CREATE TABLE measurement_y2006m02 PARTITION OF measurement
      FOR VALUES FROM ('2006-02-01') TO ('2006-03-01');
  
  CREATE TABLE measurement_y2006m03 PARTITION OF measurement
      FOR VALUES FROM ('2006-03-01') TO ('2006-04-01');
  
  ...
  CREATE TABLE measurement_y2007m11 PARTITION OF measurement
      FOR VALUES FROM ('2007-11-01') TO ('2007-12-01');
  
  CREATE TABLE measurement_y2007m12 PARTITION OF measurement
      FOR VALUES FROM ('2007-12-01') TO ('2008-01-01')
      TABLESPACE fasttablespace;
  
  CREATE TABLE measurement_y2008m01 PARTITION OF measurement
      FOR VALUES FROM ('2008-01-01') TO ('2008-02-01')
      WITH (parallel_workers = 4)
      TABLESPACE fasttablespace;
  
  (ကပ်လျက် (adjacent) partitions တွေက bound value တစ်ခုကို မျှဝေသုံးနိုင်တယ်ဆိုတာ သတိရပါ — အကြောင်းက range ရဲ့ အပေါ်စွန်း bounds တွေကို exclusive bounds အဖြစ် သဘောထားလို့ပါ။)
  Sub-partitioning ကို အကောင်အထည် ဖော်ချင်ရင် — partition တစ်ခုချင်းစီကို ဖန်တီးတဲ့ commands တွေမှာ PARTITION BY clause ကို ထပ်သတ်မှတ်ပါ — ဥပမာ:
  
  CREATE TABLE measurement_y2006m02 PARTITION OF measurement
      FOR VALUES FROM ('2006-02-01') TO ('2006-03-01')
      PARTITION BY RANGE (peaktemp);
  
  measurement_y2006m02 ရဲ့ partitions တွေ ဖန်တီးပြီးတာနဲ့ — measurement ထဲကို insert လုပ်ပြီး measurement_y2006m02 ဆီကို ပို့ဆောင်ခံရတဲ့ data တွေ (ဒါမှမဟုတ် သူ့ရဲ့ partition constraint ကို ကျေနပ်သရွေ့ ခွင့်ပြုထားတဲ့ measurement_y2006m02 ထဲကို တိုက်ရိုက် insert လုပ်တဲ့ data တွေ) က — peaktemp column အပေါ် မူတည်ပြီး သူ့ရဲ့ partitions တစ်ခုခုဆီကို ထပ်ဆင့် ပို့ဆောင်ခံရပါလိမ့်မယ်။ သတ်မှတ်ထားတဲ့ partition key က parent ရဲ့ partition key နဲ့ ထပ်နေလို့လည်း ရပါတယ် — ဒါပေမယ့် sub-partition တစ်ခုရဲ့ bounds တွေကို သတ်မှတ်တဲ့အခါ — သူ လက်ခံတဲ့ data အစုက partition ကိုယ်တိုင်ရဲ့ bounds တွေ ခွင့်ပြုတာရဲ့ အစုခွဲ (subset) တစ်ခု ဖြစ်အောင် သတိထားသင့်ပါတယ်; system က အဲဒါ တကယ်ဟုတ်မဟုတ် စစ်ဆေးဖို့ မကြိုးစားပါဘူး။
  ရှိပြီးသား partitions တစ်ခုခုဆီကိုမှ မပို့ဆောင်နိုင်တဲ့ data ကို parent table ထဲ insert လုပ်ရင် error တစ်ခု ဖြစ်ပါတယ်; သင့်လျော်တဲ့ partition တစ်ခုကို လက်နဲ့ ထပ်ထည့်ပေးရပါမယ်။
  Partitions တွေအတွက် partition နယ်နိမိတ် အခြေအနေတွေကို ဖော်ပြတဲ့ table constraints တွေကို လက်နဲ့ ဖန်တီးစရာ မလိုပါဘူး။ ဒီလို constraints တွေကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။
3. Partitioned table ပေါ်မှာ — key column (တွေ) အတွက် index တစ်ခုအပြင် သင်လိုချင်တဲ့ တခြား indexes တွေကိုပါ ဖန်တီးပါ။ (Key index က မဖြစ်မနေ မလိုအပ်ပါဘူး — ဒါပေမယ့် အခြေအနေ အများစုမှာတော့ အသုံးဝင်ပါတယ်။) ဒါက partition တစ်ခုချင်းစီပေါ်မှာ ကိုက်ညီတဲ့ (matching) index တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပြီး — နောက်ပိုင်း သင်ဖန်တီးတဲ့ ဒါမှမဟုတ် attach လုပ်တဲ့ partitions တွေမှာလည်း ဒီလို index ရှိစေပါတယ်။ Partitioned table ပေါ်မှာ ကြေညာထားတဲ့ index ဒါမှမဟုတ် unique constraint က — partitioned table ကိုယ်တိုင်လိုပဲ "virtual" ဖြစ်ပါတယ်: တကယ့် data က partition table တစ်ခုချင်းစီပေါ်မှာရှိတဲ့ child indexes တွေထဲမှာ ရှိပါတယ်။
  
  CREATE INDEX ON measurement (logdate);
4. postgresql.conf ထဲမှာ enable_partition_pruning configuration parameter ကို disabled (ပိတ်ထား) မဖြစ်အောင် သေချာပါစေ။ ပိတ်ထားရင် queries တွေက လိုချင်တဲ့အတိုင်း optimize လုပ်ခံရမှာ မဟုတ်ပါဘူး။

အပေါ်က ဥပမာမှာ လတိုင်း partition အသစ်တစ်ခု ဖန်တီးနေရမှာ ဖြစ်လို့ — လိုအပ်တဲ့ DDL တွေကို အလိုအလျောက် ထုတ်ပေးတဲ့ script တစ်ခု ရေးထားတာက ပညာရှိရာ ရောက်ပါတယ်။

#### 5.12.2.2. Partition Maintenance (partition ထိန်းသိမ်းခြင်း)

သာမန်အားဖြင့် table ကို ကနဦး သတ်မှတ်တဲ့အခါ ထူထောင်ထားတဲ့ partitions အစုက ပုံသေ ရှိနေဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ Data အဟောင်းတွေ သိမ်းထားတဲ့ partitions တွေကို ဖယ်ရှားပြီး — data အသစ်တွေအတွက် partitions အသစ်တွေကို အခါအားလျော်စွာ ထပ်ထည့်ချင်တာ သာမာန်ပါ။ Partitioning ရဲ့ အရေးအကြီးဆုံး အားသာချက်တွေထဲက တစ်ခုက — ဒီလိုမဟုတ်ရင် အတော်လေး ပင်ပန်းစေမယ့် ဒီလုပ်ငန်းကို — data အမြောက်အမြားကို ရုပ်ပိုင်းဆိုင်ရာ ရွှေ့ပြောင်းစရာ မလိုဘဲ — partition structure ကို ကိုင်တွယ်ခြင်းအားဖြင့် ချက်ချင်းနီးပါး လုပ်ဆောင်နိုင်စေတာ ဖြစ်ပါတယ်။

Data အဟောင်း ဖယ်ရှားခြင်းအတွက် အရိုးရှင်းဆုံး ရွေးစရာက — မလိုအပ်တော့တဲ့ partition ကို drop လုပ်ပစ်တာပါ:

```sql
DROP TABLE measurement_y2006m02;
```

ဒါက record တစ်ခုချင်းစီကို သီးခြားစီ ဖျက်စရာ မလိုလို့ — သန်းနဲ့ချီတဲ့ records တွေကို အလွန် လျင်မြန်စွာ ဖျက်ပစ်နိုင်ပါတယ်။ ဒါပေမယ့် အပေါ်က command က parent table ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခု ယူဖို့ လိုအပ်တယ်ဆိုတာကိုတော့ သတိပြုပါ။

မကြာခဏ ပိုနှစ်သက်စရာ ဖြစ်တဲ့ နောက်ထပ် ရွေးစရာတစ်ခုက — partition ကို partitioned table ကနေ ဖယ်ရှားပေမယ့် — သီးခြား table တစ်ခုအနေနဲ့ အသုံးပြုခွင့်ကိုတော့ ထိန်းသိမ်းထားတာပါ။ ဒါက ပုံစံ နှစ်မျိုး ရှိပါတယ်:

```sql
ALTER TABLE measurement DETACH PARTITION measurement_y2006m02;
ALTER TABLE measurement DETACH PARTITION measurement_y2006m02 CONCURRENTLY;
```

ဒါတွေက — data ကို မဖျက်ခင် အဲဒီ data အပေါ်မှာ နောက်ထပ် လုပ်ဆောင်ချက်တွေ လုပ်ဆောင်ခွင့် ပေးပါတယ်။ ဥပမာ — ဒါက `COPY`, pg_dump ဒါမှမဟုတ် အလားတူ tools တွေသုံးပြီး data ကို backup လုပ်ဖို့ အသုံးဝင်တဲ့ အချိန် မကြာခဏ ဖြစ်ပါတယ်။ Data တွေကို ပိုသေးငယ်တဲ့ ပုံစံတွေအဖြစ် စုစည်း (aggregate) ဖို့၊ တခြား data manipulations တွေ လုပ်ဆောင်ဖို့ ဒါမှမဟုတ် reports တွေ run ဖို့အတွက်လည်း အသုံးဝင်တဲ့ အချိန် ဖြစ်နိုင်ပါတယ်။ Command ရဲ့ ပထမ ပုံစံက parent table ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခု လိုအပ်ပါတယ်။ ဒုတိယ ပုံစံမှာလိုပဲ `CONCURRENTLY` qualifier ကို ထည့်လိုက်တာက detach လုပ်ဆောင်ချက်က parent table ပေါ်မှာ `SHARE UPDATE EXCLUSIVE` lock ကိုပဲ လိုအပ်စေပါတယ် — ဒါပေမယ့် ကန့်သတ်ချက်တွေရဲ့ အသေးစိတ်အတွက် [`ALTER TABLE ... DETACH PARTITION`](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION) ကို ကြည့်ပါ။

အလားတူပဲ — data အသစ်တွေ ကိုင်တွယ်ဖို့ partition အသစ် တစ်ခုကိုလည်း ထည့်နိုင်ပါတယ်။ အပေါ်မှာ မူရင်း partitions တွေကို ဖန်တီးခဲ့သလိုပဲ — partitioned table ထဲမှာ empty partition တစ်ခုကို ဖန်တီးနိုင်ပါတယ်:

```sql
CREATE TABLE measurement_y2008m02 PARTITION OF measurement
    FOR VALUES FROM ('2008-02-01') TO ('2008-03-01')
    TABLESPACE fasttablespace;
```

Partition အသစ် ဖန်တီးခြင်းရဲ့ အစားထိုး နည်းလမ်းတစ်ခုအနေနဲ့ — partition structure နဲ့ သီးခြား table အသစ်တစ်ခုကို ဖန်တီးပြီး — နောက်မှ partition တစ်ခုအနေနဲ့ attach လုပ်တာက တခါတရံ ပိုအဆင်ပြေပါတယ်။ ဒါက data အသစ်တွေကို partitioned table ထဲမှာ မပေါ်ခင် — load လုပ်၊ စစ်ဆေးပြီး ပြောင်းလဲ (transform) လုပ်ခွင့် ပေးပါတယ်။ ဒါ့အပြင် — `ATTACH PARTITION` လုပ်ဆောင်ချက်က `CREATE TABLE ... PARTITION OF` မှာ လိုအပ်တဲ့ `ACCESS EXCLUSIVE` lock အစား — partitioned table ပေါ်မှာ `SHARE UPDATE EXCLUSIVE` lock ကိုပဲ လိုအပ်လို့ — partitioned table အပေါ်မှာ တစ်ပြိုင်နက် လုပ်ဆောင်နေတဲ့ (concurrent) operations တွေအတွက် ပိုပြီး အဆင်ပြေပါတယ်; နောက်ထပ် အသေးစိတ်အတွက် [`ALTER TABLE ... ATTACH PARTITION`](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-ATTACH-PARTITION) ကို ကြည့်ပါ။ Parent table ရဲ့ definition ကို ငြီးငွေ့ဖွယ် ထပ်ခါထပ်ခါ ရေးနေစရာ မလိုအောင် [`CREATE TABLE ... LIKE`](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-PARMS-LIKE) option က အထောက်အကူ ဖြစ်နိုင်ပါတယ်; ဥပမာ:

```sql
CREATE TABLE measurement_y2008m02
  (LIKE measurement INCLUDING DEFAULTS INCLUDING CONSTRAINTS)
  TABLESPACE fasttablespace;

ALTER TABLE measurement_y2008m02 ADD CONSTRAINT y2008m02
   CHECK ( logdate >= DATE '2008-02-01' AND logdate < DATE '2008-03-01' );

\copy measurement_y2008m02 from 'measurement_y2008m02'
-- possibly some other data preparation work

ALTER TABLE measurement ATTACH PARTITION measurement_y2008m02
    FOR VALUES FROM ('2008-02-01') TO ('2008-03-01' );
```

`ATTACH PARTITION` command ကို run တဲ့အခါ — အဲဒီ partition ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခု ကိုင်ထားရင်း — partition constraint ကို အတည်ပြုဖို့ table ကို scan လုပ်မယ်ဆိုတာ သတိပြုပါ။ အပေါ်မှာ ပြထားသလို — table ကို attach မလုပ်ခင် အဲဒီ table ပေါ်မှာ မျှော်လင့်ထားတဲ့ partition constraint နဲ့ ကိုက်ညီတဲ့ `CHECK` constraint တစ်ခုကို ဖန်တီးထားခြင်းအားဖြင့် ဒီ scan ကို ရှောင်ရှားဖို့ အကြံပြုပါတယ်။ `ATTACH PARTITION` ပြီးမြောက်သွားတာနဲ့ — အခု ထပ်နေတော့တဲ့ (redundant) `CHECK` constraint ကို drop လုပ်ဖို့ အကြံပြုပါတယ်။ Attach လုပ်နေတဲ့ table ကိုယ်တိုင်က partitioned table တစ်ခုဆိုရင် — သင့်လျော်တဲ့ `CHECK` constraint တစ်ခု မတွေ့မချင်း ဒါမှမဟုတ် leaf partitions တွေဆီ မရောက်မချင်း — သူ့ရဲ့ sub-partitions တစ်ခုချင်းစီကို ထပ်ခါထပ်ခါ (recursively) lock လုပ်ပြီး scan လုပ်ပါလိမ့်မယ်။

အလားတူပဲ — partitioned table မှာ `DEFAULT` partition တစ်ခု ရှိနေရင် — attach လုပ်မယ့် partition ရဲ့ constraint ကို ချန်လှပ်ထားတဲ့ (exclude) `CHECK` constraint တစ်ခုကို ဖန်တီးထားဖို့ အကြံပြုပါတယ်။ ဒါ မလုပ်ထားရင် — attach လုပ်နေတဲ့ partition ထဲမှာ ရှိသင့်တဲ့ records တွေ မပါဝင်ဘူးဆိုတာ အတည်ပြုဖို့ — `DEFAULT` partition ကို scan လုပ်ပါလိမ့်မယ်။ ဒီလုပ်ဆောင်ချက်က `DEFAULT` partition ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခုကို ကိုင်ထားရင်းနဲ့ လုပ်ဆောင်မှာ ဖြစ်ပါတယ်။ `DEFAULT` partition ကိုယ်တိုင်က partitioned table တစ်ခုဆိုရင် — အပေါ်မှာ ဖော်ပြခဲ့သလို — attach လုပ်နေတဲ့ table အတိုင်းပဲ — သူ့ရဲ့ partitions တစ်ခုချင်းစီကို ထပ်ခါထပ်ခါ (recursively) စစ်ဆေးပါလိမ့်မယ်။

အစောပိုင်းမှာ ဖော်ပြခဲ့သလို — partitioned tables တွေပေါ်မှာ indexes တွေကို ဖန်တီးနိုင်ပြီး — အဲဒါတွေက hierarchy တစ်ခုလုံးကို အလိုအလျောက် သက်ရောက်စေပါတယ်။ ဒါက အလွန် အဆင်ပြေပါတယ် — ရှိပြီးသား partitions အားလုံးကိုသာမက — အနာဂတ် partitions တွေကိုပါ index လုပ်ပေးမှာမို့ပါ။ ဒါပေမယ့် — partitioned tables တွေပေါ်မှာ index အသစ်တွေ ဖန်တီးတဲ့အခါမှာ `CONCURRENTLY` qualifier ကို မသုံးနိုင်တာ ကန့်သတ်ချက်တစ်ခု ဖြစ်ပြီး — ဒါက lock အချိန် ကြာမြင့်စေနိုင်ပါတယ်။ ဒါကို ရှောင်ဖို့ — partitioned table ပေါ်မှာ `CREATE INDEX ON ONLY` ကို သုံးနိုင်ပါတယ် — ဒါက invalid အဖြစ် မှတ်သားထားတဲ့ index အသစ်တစ်ခုကို ဖန်တီးပေးပြီး — ရှိပြီးသား partitions တွေဆီကို အလိုအလျောက် သက်ရောက်ခြင်းကနေ တားဆီးပါတယ်။ ဒါအစား — partition တစ်ခုချင်းစီပေါ်မှာ `CONCURRENTLY` သုံးပြီး indexes တွေကို တစ်ခုချင်းစီ ဖန်တီးပြီးမှ — parent ပေါ်မှာရှိတဲ့ partitioned index ဆီကို `ALTER INDEX ... ATTACH PARTITION` သုံးပြီး *attach* လုပ်နိုင်ပါတယ်။ Partitions အားလုံးရဲ့ indexes တွေ parent index ဆီကို attach ဖြစ်သွားတာနဲ့ — parent index ကို အလိုအလျောက် valid အဖြစ် မှတ်သားပါလိမ့်မယ်။ ဥပမာ:

```sql
CREATE INDEX measurement_usls_idx ON ONLY measurement (unitsales);

CREATE INDEX CONCURRENTLY measurement_usls_200602_idx
    ON measurement_y2006m02 (unitsales);
ALTER INDEX measurement_usls_idx
    ATTACH PARTITION measurement_usls_200602_idx;
...
```

ဒီနည်းစနစ်ကို `UNIQUE` နဲ့ `PRIMARY KEY` constraints တွေမှာပါ သုံးနိုင်ပါတယ်; indexes တွေကို constraint ဖန်တီးတဲ့အခါ သွယ်ဝိုက်စွာ (implicitly) ဖန်တီးပေးပါတယ်။ ဥပမာ:

```sql
ALTER TABLE ONLY measurement ADD UNIQUE (city_id, logdate);

ALTER TABLE measurement_y2006m02 ADD UNIQUE (city_id, logdate);
ALTER INDEX measurement_city_id_logdate_key
    ATTACH PARTITION measurement_y2006m02_city_id_logdate_key;
...
```

#### 5.12.2.3. Limitations (ကန့်သတ်ချက်များ)

အောက်ပါ ကန့်သတ်ချက်တွေက partitioned tables တွေကို သက်ရောက်ပါတယ်:

- Partitioned table တစ်ခုပေါ်မှာ unique ဒါမှမဟုတ် primary key constraint တစ်ခု ဖန်တီးဖို့ဆိုရင် — partition keys တွေမှာ expressions ဒါမှမဟုတ် function calls တွေ မပါဝင်ရဘဲ — constraint ရဲ့ columns တွေက partition key columns အားလုံးကို ပါဝင်စေရပါမယ်။ ဒီကန့်သတ်ချက် ရှိတာက — constraint ကို ဖွဲ့စည်းထားတဲ့ index တစ်ခုချင်းစီက သူ့ကိုယ်ပိုင် partitions အတွင်းမှာပဲ uniqueness ကို တိုက်ရိုက် အတင်းအကျပ် လုပ်ဆောင်နိုင်လို့ပါ; ဒါကြောင့် — partition structure ကိုယ်တိုင်က partition အမျိုးမျိုးကြားမှာ duplicates တွေ မရှိဘူးဆိုတာကို အာမခံပေးရပါတယ်။
- အလားတူပဲ — exclusion constraint တစ်ခုက partition key columns အားလုံးကို ပါဝင်စေရပါမယ်။ ဒါ့အပြင် — constraint က အဲဒီ columns တွေကို equality အတွက် နှိုင်းယှဉ်ရပါမယ် (ဥပမာ && လို မဟုတ်ဘဲ)။ ဒီကန့်သတ်ချက်ကလည်း — partition အချင်းချင်း ဖြတ်ကျော်တဲ့ (cross-partition) ကန့်သတ်မှုတွေကို အတင်းအကျပ် လုပ်ဆောင်နိုင်စွမ်း မရှိတာကြောင့် ဖြစ်ပါတယ်။ Constraint မှာ partition key ရဲ့ အစိတ်အပိုင်း မဟုတ်တဲ့ နောက်ထပ် columns တွေ ပါဝင်နိုင်ပြီး — အဲဒီ columns တွေကို သင်ကြိုက်တဲ့ ဘယ် operators နဲ့မဆို နှိုင်းယှဉ်နိုင်ပါတယ်။
- INSERT ပေါ်မှာရှိတဲ့ BEFORE ROW triggers တွေက — row အသစ်တစ်ခုအတွက် နောက်ဆုံး ဦးတည်ရာ (destination) partition ဖြစ်မယ့်အရာကို ပြောင်းလဲလို့ မရပါဘူး။
- Partition tree တစ်ခုတည်းထဲမှာ temporary နဲ့ permanent relations တွေ ရောနှောတာ မခွင့်ပြုပါဘူး။ ဒါကြောင့် — partitioned table က permanent ဆိုရင် သူ့ရဲ့ partitions တွေလည်း permanent ဖြစ်ရမှာ ဖြစ်ပြီး — partitioned table က temporary ဆိုရင်လည်း အလားတူပါပဲ။ Temporary relations တွေ သုံးတဲ့အခါ — partition tree ရဲ့ အဖွဲ့ဝင်အားလုံးက session တစ်ခုတည်းကပဲ ဖြစ်ရပါမယ်။

Partition တစ်ခုချင်းစီကို သူတို့ရဲ့ partitioned table နဲ့ ချိတ်ဆက်ထားတာက — နောက်ကွယ်မှာ inheritance ကို သုံးပြီး ဖြစ်ပါတယ်။ ဒါပေမယ့် — declaratively partitioned tables တွေ ဒါမှမဟုတ် သူတို့ရဲ့ partitions တွေနဲ့ဆိုရင် inheritance ရဲ့ generic features အားလုံးကို သုံးလို့ မရပါဘူး — အောက်မှာ ဆွေးနွေးထားပါတယ်။ ထူးခြားစွာပဲ — partition တစ်ခုက သူ partition ဖြစ်နေတဲ့ partitioned table ကလွဲပြီး တခြား parents တွေ မရှိနိုင်သလို — table တစ်ခုက partitioned table တစ်ခုနဲ့ သာမန် table တစ်ခု နှစ်ခုလုံးကနေ inherit လုပ်လို့လည်း မရပါဘူး။ ဆိုလိုတာက — partitioned tables တွေနဲ့ သူတို့ရဲ့ partitions တွေက သာမန် tables တွေနဲ့ inheritance hierarchy တစ်ခုကို ဘယ်တော့မှ မမျှဝေပါဘူး။

Partitioned table နဲ့ သူ့ရဲ့ partitions တွေ ပါဝင်တဲ့ partition hierarchy တစ်ခုက inheritance hierarchy တစ်ခု ဖြစ်နေဆဲမို့ — `tableoid` နဲ့ inheritance ရဲ့ ပုံမှန် စည်းမျဉ်း အားလုံးက [အပိုင်း 5.11](/docs/postgresql/ddl-inherit) မှာ ဖော်ပြထားတဲ့အတိုင်း သက်ရောက်ပါတယ် — ခြွင်းချက် အနည်းငယ်နဲ့ပေါ့:

- Partitions တွေမှာ parent ထဲမှာ မပါဝင်တဲ့ columns တွေ ရှိလို့ မရပါဘူး။ CREATE TABLE နဲ့ partitions တွေ ဖန်တီးတဲ့အခါ columns တွေ သတ်မှတ်လို့ မရသလို — နောက်မှ ALTER TABLE သုံးပြီး partitions တွေဆီကို columns တွေ ထပ်ထည့်လို့လည်း မရပါဘူး။ ALTER TABLE ... ATTACH PARTITION နဲ့ table တစ်ခုကို partition အဖြစ် ထည့်တာက — သူ့ရဲ့ columns တွေ parent နဲ့ အတိအကျ ကိုက်ညီမှသာ ခွင့်ပြုပါတယ်။
- Partitioned table တစ်ခုရဲ့ CHECK နဲ့ NOT NULL constraints နှစ်မျိုးလုံးက သူ့ရဲ့ partitions အားလုံးဆီကို အမြဲတမ်း အမွေဆက်ခံပါတယ်; ဒီအမျိုးအစားတွေရဲ့ NO INHERIT constraints တွေ ဖန်တီးတာ မခွင့်ပြုပါဘူး။ ဒီအမျိုးအစား constraint တစ်ခုကို — အဲဒီ constraint က parent table ထဲမှာလည်း ရှိနေရင် — drop လုပ်လို့ မရပါဘူး။
- ONLY ကို သုံးပြီး partitioned table ပေါ်မှာပဲ constraint တစ်ခုကို ထည့်တာ ဒါမှမဟုတ် drop လုပ်တာက — partitions တွေ မရှိသေးသရွေ့တော့ ထောက်ပံ့ပေးပါတယ်။ Partitions တွေ တည်ရှိလာတာနဲ့ — UNIQUE နဲ့ PRIMARY KEY ကလွဲပြီး တခြား constraints တွေအတွက် ONLY သုံးရင် error ရလိမ့်မယ်။ ဒါအစား — partitions ကိုယ်တိုင်ပေါ်မှာရှိတဲ့ constraints တွေကို ထည့်နိုင် ပြီး — (parent table ထဲမှာ မရှိဘူးဆိုရင်) drop လုပ်နိုင်ပါတယ်။
- Partitioned table တစ်ခုမှာ data ကိုယ်တိုင် မရှိတာမို့ — partitioned table တစ်ခုပေါ်မှာ TRUNCATE ONLY သုံးဖို့ ကြိုးစားရင် အမြဲတမ်း error တစ်ခု ပြန်ရပါလိမ့်မယ်။

### 5.12.3. Partitioning Using Inheritance (Inheritance သုံးပြီး ခွဲဝေခြင်း)

Built-in declarative partitioning က အသုံးများတဲ့ use cases အများစုအတွက် သင့်လျော်ပေမယ့် — ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ရှိတဲ့ နည်းလမ်း တစ်ခု အသုံးဝင်နိုင်တဲ့ အခြေအနေ တချို့လည်း ရှိပါတယ်။ Partitioning ကို table inheritance သုံးပြီး အကောင်အထည် ဖော်နိုင်ပြီး — ဒါက declarative partitioning မှာ မထောက်ပံ့တဲ့ features တချို့ကို ခွင့်ပြုပေးပါတယ် — ဥပမာ:

- Declarative partitioning မှာ partitions တွေက partitioned table နဲ့ column အစုအတိအကျ တူညီရပါတယ် — table inheritance မှာတော့ child tables တွေမှာ parent မှာ မရှိတဲ့ နောက်ထပ် columns တွေ ရှိနိုင်ပါတယ်။
- Table inheritance က multiple inheritance (parents အများအပြားကနေ အမွေဆက်ခံခြင်း) ကို ခွင့်ပြုပါတယ်။
- Declarative partitioning က range, list နဲ့ hash partitioning တွေကိုပဲ ထောက်ပံ့ပြီး — table inheritance ကတော့ user ရွေးချယ်တဲ့ နည်းလမ်းနဲ့ data ကို ခွဲဝေခွင့် ပေးပါတယ်။ (ဒါပေမယ့် — constraint exclusion က child tables တွေကို ထိရောက်စွာ ဖယ်ထုတ်နိုင်ခြင်း မရှိရင် — query ရဲ့ စွမ်းဆောင်ရည် ညံ့ဖျင်းနိုင်တယ်ဆိုတာ သတိပြုပါ။)

#### 5.12.3.1. Example (ဥပမာ)

ဒီဥပမာက အပေါ်မှာ ဖော်ပြခဲ့တဲ့ declarative partitioning ဥပမာနဲ့ ညီမျှတဲ့ partitioning structure တစ်ခုကို တည်ဆောက်ပါတယ်။ အောက်ပါ အဆင့်တွေကို သုံးပါ:

1. "child" tables အားလုံး inherit လုပ်မယ့် "root" table ကို ဖန်တီးပါ။ ဒီ table ထဲမှာ data ဘာမှ ပါဝင်မှာ မဟုတ်ပါဘူး။ ဒီ table ပေါ်မှာ check constraints တွေကို မသတ်မှတ်ပါနဲ့ — သူတို့ကို child tables အားလုံးဆီကို တူညီစွာ သက်ရောက်စေချင်မှသာလျှင် သတ်မှတ်ပါ။ Indexes ဒါမှမဟုတ် unique constraints တွေကို သူ့ပေါ်မှာ သတ်မှတ်တာကလည်း အကျိုးမရှိပါဘူး။ ကျွန်ုပ်တို့ရဲ့ ဥပမာမှာ root table က မူလ သတ်မှတ်ခဲ့တဲ့ measurement table ပါ:
  
  CREATE TABLE measurement (
      city_id         int not null,
      logdate         date not null,
      peaktemp        int,
      unitsales       int
  );
2. Root table ကနေ တစ်ခုချင်းစီ inherit လုပ်တဲ့ "child" tables တွေ အများအပြားကို ဖန်တီးပါ။ သာမန်အားဖြင့် ဒီ tables တွေက root ကနေ အမွေဆက်ခံရတဲ့ column အစုထဲကို ဘယ် columns မှ ထပ်ထည့်မှာ မဟုတ်ပါဘူး။ Declarative partitioning လိုပဲ — ဒီ tables တွေက ဘယ်နည်းနဲ့မဆို သာမန် PostgreSQL tables (ဒါမှမဟုတ် foreign tables) တွေပါပဲ။
  
  CREATE TABLE measurement_y2006m02 () INHERITS (measurement);
  CREATE TABLE measurement_y2006m03 () INHERITS (measurement);
  ...
  CREATE TABLE measurement_y2007m11 () INHERITS (measurement);
  CREATE TABLE measurement_y2007m12 () INHERITS (measurement);
  CREATE TABLE measurement_y2008m01 () INHERITS (measurement);
3. Child table တစ်ခုချင်းစီမှာ ခွင့်ပြုထားတဲ့ key values တွေကို သတ်မှတ်ဖို့ — တစ်ခုနဲ့တစ်ခု မထပ်တဲ့ (non-overlapping) table constraints တွေကို ထည့်ပါ။
  ပုံမှန် ဥပမာတွေက ဒီလိုပါ:
  
  CHECK ( x = 1 )
  CHECK ( county IN ( 'Oxfordshire', 'Buckinghamshire', 'Warwickshire' ))
  CHECK ( outletID >= 100 AND outletID < 200 )
  
  Constraints တွေက — child tables အမျိုးမျိုးမှာ ခွင့်ပြုထားတဲ့ key values တွေကြားမှာ ထပ်နေမှု (overlap) မရှိဘူးဆိုတာ အာမခံပေးပါစေ။ အဖြစ်များတဲ့ အမှားတစ်ခုက — ဒီလို range constraints တွေကို တည်ဆောက်မိတာပါ:
  
  CHECK ( outletID BETWEEN 100 AND 200 )
  CHECK ( outletID BETWEEN 200 AND 300 )
  
  ဒါက မှားပါတယ် — အကြောင်းက key value 200 က ဘယ် child table ထဲမှာ ပါဝင်သင့်လဲဆိုတာ မရှင်းလင်းလို့ပါ။ ဒါအစား — ranges တွေကို ဒီပုံစံမျိုးနဲ့ သတ်မှတ်သင့်ပါတယ်:
  
  CREATE TABLE measurement_y2006m02 (
      CHECK ( logdate >= DATE '2006-02-01' AND logdate < DATE '2006-03-01' )
  ) INHERITS (measurement);
  
  CREATE TABLE measurement_y2006m03 (
      CHECK ( logdate >= DATE '2006-03-01' AND logdate < DATE '2006-04-01' )
  ) INHERITS (measurement);
  
  ...
  CREATE TABLE measurement_y2007m11 (
      CHECK ( logdate >= DATE '2007-11-01' AND logdate < DATE '2007-12-01' )
  ) INHERITS (measurement);
  
  CREATE TABLE measurement_y2007m12 (
      CHECK ( logdate >= DATE '2007-12-01' AND logdate < DATE '2008-01-01' )
  ) INHERITS (measurement);
  
  CREATE TABLE measurement_y2008m01 (
      CHECK ( logdate >= DATE '2008-01-01' AND logdate < DATE '2008-02-01' )
  ) INHERITS (measurement);
4. Child table တစ်ခုချင်းစီအတွက် — key column (တွေ) ပေါ်မှာ index တစ်ခုအပြင် သင်လိုချင်တဲ့ တခြား indexes တွေကိုပါ ဖန်တီးပါ။
  
  CREATE INDEX measurement_y2006m02_logdate ON measurement_y2006m02 (logdate);
  CREATE INDEX measurement_y2006m03_logdate ON measurement_y2006m03 (logdate);
  CREATE INDEX measurement_y2007m11_logdate ON measurement_y2007m11 (logdate);
  CREATE INDEX measurement_y2007m12_logdate ON measurement_y2007m12 (logdate);
  CREATE INDEX measurement_y2008m01_logdate ON measurement_y2008m01 (logdate);
5. ကျွန်ုပ်တို့ရဲ့ application က INSERT INTO measurement ... လို့ ပြောနိုင်ပြီး — data ကို သင့်လျော်တဲ့ child table ဆီကို ပြန်ညွှန်း (redirect) လုပ်စေချင်ပါတယ်။ Root table ပေါ်မှာ သင့်လျော်တဲ့ trigger function တစ်ခုကို တွဲပေးခြင်းအားဖြင့် ဒါကို စီစဉ်နိုင်ပါတယ်။ Data တွေကို နောက်ဆုံး child ထဲကိုပဲ ထည့်မယ်ဆိုရင် — အလွန် ရိုးရှင်းတဲ့ trigger function တစ်ခုကို သုံးနိုင်ပါတယ်:
  
  CREATE OR REPLACE FUNCTION measurement_insert_trigger()
  RETURNS TRIGGER AS $$
  BEGIN
      INSERT INTO measurement_y2008m01 VALUES (NEW.*);
      RETURN NULL;
  END;
  $$
  LANGUAGE plpgsql;
  
  Function ကို ဖန်တီးပြီးတာနဲ့ — အဲဒီ trigger function ကို ခေါ်ယူတဲ့ trigger တစ်ခုကို ဖန်တီးပါတယ်:
  
  CREATE TRIGGER insert_measurement_trigger
      BEFORE INSERT ON measurement
      FOR EACH ROW EXECUTE FUNCTION measurement_insert_trigger();
  
  Trigger function က အမြဲတမ်း လက်ရှိ child table ထဲကို insert လုပ်နိုင်ဖို့ — လတိုင်း ဒီ function ကို ပြန်သတ်မှတ် (redefine) ပေးရပါမယ်။ Trigger definition ကတော့ update လုပ်စရာ မလိုပါဘူး။
  Data တွေကို ထည့်လိုက်တာနဲ့ — row ကို ဘယ် child table ထဲမှာ ထည့်သင့်လဲဆိုတာကို server က အလိုအလျောက် ရှာဖွေစေချင်ရင်လည်း ဖြစ်နိုင်ပါတယ်။ ဒါကို ပိုရှုပ်ထွေးတဲ့ trigger function တစ်ခုနဲ့ လုပ်နိုင်ပါတယ် — ဥပမာ:
  
  CREATE OR REPLACE FUNCTION measurement_insert_trigger()
  RETURNS TRIGGER AS $$
  BEGIN
      IF ( NEW.logdate >= DATE '2006-02-01' AND
           NEW.logdate < DATE '2006-03-01' ) THEN
          INSERT INTO measurement_y2006m02 VALUES (NEW.*);
      ELSIF ( NEW.logdate >= DATE '2006-03-01' AND
              NEW.logdate < DATE '2006-04-01' ) THEN
          INSERT INTO measurement_y2006m03 VALUES (NEW.*);
      ...
      ELSIF ( NEW.logdate >= DATE '2008-01-01' AND
              NEW.logdate < DATE '2008-02-01' ) THEN
          INSERT INTO measurement_y2008m01 VALUES (NEW.*);
      ELSE
          RAISE EXCEPTION 'Date out of range.  Fix the measurement_insert_trigger() function!';
      END IF;
      RETURN NULL;
  END;
  $$
  LANGUAGE plpgsql;
  
  Trigger definition က အရင်ကလိုပဲ အတူတူပါပဲ။ IF test တစ်ခုချင်းစီက — သူ့ child table ရဲ့ CHECK constraint နဲ့ အတိအကျ ကိုက်ညီရမယ်ဆိုတာ သတိပြုပါ။
  ဒီ function က တစ်လတည်း (single-month) ကိစ္စထက် ပိုရှုပ်ထွေးပေမယ့် — branches တွေကို မလိုအပ်ခင် ကြိုတင် ထည့်ထားလို့ရလို့ — မကြာခဏ update လုပ်စရာ မလိုပါဘူး။
  **မှတ်ချက်:** လက်တွေ့မှာတော့ — inserts အများစုက နောက်ဆုံး child ထဲကို ဝင်မယ်ဆိုရင် အဲဒီ child ကို ပထမဆုံး စစ်ဆေးတာက အကောင်းဆုံး ဖြစ်နိုင်ပါတယ်။ ရိုးရှင်းအောင်လို့ — ဒီဥပမာရဲ့ တခြား အပိုင်းတွေမှာ ဖော်ပြထားတဲ့ အစီအစဉ်အတိုင်းပဲ trigger ရဲ့ စစ်ဆေးချက်တွေကို ပြသထားပါတယ်။
  
  Inserts တွေကို သင့်လျော်တဲ့ child table ဆီ ပြန်ညွှန်းဖို့ နောက်ထပ် နည်းလမ်းတစ်ခုက — root table ပေါ်မှာ trigger အစား rules တွေကို တည်ဆောက်တာပါ။ ဥပမာ:
  
  CREATE RULE measurement_insert_y2006m02 AS
  ON INSERT TO measurement WHERE
      ( logdate >= DATE '2006-02-01' AND logdate < DATE '2006-03-01' )
  DO INSTEAD
      INSERT INTO measurement_y2006m02 VALUES (NEW.*);
  ...
  CREATE RULE measurement_insert_y2008m01 AS
  ON INSERT TO measurement WHERE
      ( logdate >= DATE '2008-01-01' AND logdate < DATE '2008-02-01' )
  DO INSTEAD
      INSERT INTO measurement_y2008m01 VALUES (NEW.*);
  
  Rule တစ်ခုက trigger တစ်ခုထက် သိသိသာသာ overhead ပိုများပါတယ် — ဒါပေမယ့် overhead က row တစ်ခုချင်းစီအတွက် မဟုတ်ဘဲ query တစ်ခုအတွက် တစ်ခါပဲ ပေးရတာမို့ — bulk-insert အခြေအနေတွေမှာ ဒီနည်းက အားသာချက် ရှိနိုင်ပါတယ်။ အခြေအနေ အများစုမှာတော့ — trigger နည်းလမ်းက စွမ်းဆောင်ရည် ပိုကောင်းပါလိမ့်မယ်။
  COPY က rules တွေကို လျစ်လျူရှုတယ်ဆိုတာ သတိပြုပါ။ Data တွေထည့်ဖို့ COPY ကို သုံးချင်ရင် — root ထဲကို တိုက်ရိုက် မဟုတ်ဘဲ — မှန်ကန်တဲ့ child table ထဲကို copy လုပ်ဖို့ လိုပါတယ်။ COPY က triggers တွေကိုတော့ fire လုပ်ပေးလို့ — trigger နည်းလမ်းကို သုံးရင် ပုံမှန်အတိုင်း သုံးနိုင်ပါတယ်။
  Rule နည်းလမ်းရဲ့ နောက်ထပ် အားနည်းချက်တစ်ခုက — rules အစုက insert လုပ်တဲ့ ရက်စွဲကို အကျုံးမဝင်ဘူးဆိုရင် error တစ်ခုကို အတင်းအကျပ် ဖြစ်စေဖို့ ရိုးရှင်းတဲ့ နည်းလမ်း မရှိတာပါ; data က တိတ်တဆိတ် root table ထဲကို ရောက်သွားပါလိမ့်မယ်။
6. postgresql.conf ထဲမှာ constraint_exclusion configuration parameter ကို disabled (ပိတ်ထား) မဖြစ်အောင် သေချာပါစေ; မဟုတ်ရင် child tables တွေကို မလိုအပ်ဘဲ ဝင်ရောက်ခံရနိုင်ပါတယ်။

မြင်တွေ့နိုင်သလိုပဲ — ရှုပ်ထွေးတဲ့ table hierarchy တစ်ခုက DDL အတော်များများ လိုအပ်နိုင်ပါတယ်။ အပေါ်က ဥပမာမှာ လတိုင်း child table အသစ်တစ်ခု ဖန်တီးနေရမှာ ဖြစ်လို့ — လိုအပ်တဲ့ DDL တွေကို အလိုအလျောက် ထုတ်ပေးတဲ့ script တစ်ခု ရေးထားတာက ပညာရှိရာ ရောက်ပါတယ်။

#### 5.12.3.2. Maintenance for Inheritance Partitioning (Inheritance partitioning အတွက် ထိန်းသိမ်းခြင်း)

Data အဟောင်းတွေကို လျင်မြန်စွာ ဖယ်ရှားဖို့ — မလိုအပ်တော့တဲ့ child table ကို ရိုးရိုးရှင်းရှင်း drop လုပ်ပစ်ပါ:

```sql
DROP TABLE measurement_y2006m02;
```

Child table ကို inheritance hierarchy table ကနေ ဖယ်ရှားပေမယ့် — သီးခြား table တစ်ခုအနေနဲ့ အသုံးပြုခွင့်ကိုတော့ ထိန်းသိမ်းထားဖို့:

```sql
ALTER TABLE measurement_y2006m02 NO INHERIT measurement;
```

Data အသစ်တွေ ကိုင်တွယ်ဖို့ child table အသစ် တစ်ခု ထည့်ဖို့ — အပေါ်မှာ မူရင်း children တွေကို ဖန်တီးခဲ့သလိုပဲ — empty child table တစ်ခုကို ဖန်တီးပါ:

```sql
CREATE TABLE measurement_y2008m02 (
    CHECK ( logdate >= DATE '2008-02-01' AND logdate < DATE '2008-03-01' )
) INHERITS (measurement);
```

တစ်နည်းအားဖြင့် — child table အသစ်ကို table hierarchy ထဲ မထည့်ခင် ဖန်တီးပြီး populate (data ဖြည့်) လုပ်ထားချင်နိုင်ပါတယ်။ ဒါက data တွေကို parent table ပေါ်မှာရှိတဲ့ queries တွေအတွက် မမြင်ရသေးခင် — load လုပ်၊ စစ်ဆေးပြီး ပြောင်းလဲ (transform) လုပ်ခွင့် ပေးနိုင်ပါတယ်။

```sql
CREATE TABLE measurement_y2008m02
  (LIKE measurement INCLUDING DEFAULTS INCLUDING CONSTRAINTS);
ALTER TABLE measurement_y2008m02 ADD CONSTRAINT y2008m02
   CHECK ( logdate >= DATE '2008-02-01' AND logdate < DATE '2008-03-01' );
\copy measurement_y2008m02 from 'measurement_y2008m02'
-- possibly some other data preparation work
ALTER TABLE measurement_y2008m02 INHERIT measurement;
```

#### 5.12.3.3. Caveats (သတိပြုရမည့် အချက်များ)

အောက်ပါ caveats တွေက inheritance သုံးပြီး အကောင်အထည် ဖော်ထားတဲ့ partitioning ကို သက်ရောက်ပါတယ်:

- CHECK constraints အားလုံး တစ်ခုနဲ့တစ်ခု အပြန်အလှန် သီးသန့် (mutually exclusive) ဖြစ်ကြောင်း အတည်ပြုဖို့ အလိုအလျောက် နည်းလမ်း မရှိပါဘူး။ Child tables တွေကို ထုတ်ပေးပြီး — ဆက်စပ် object တွေကို ဖန်တီး နဲ့/သို့မဟုတ် ပြုပြင်တဲ့ code တစ်ခုကို ရေးတာက — တစ်ခုချင်းစီကို လက်နဲ့ ရေးတာထက် ပိုလုံခြုံပါတယ်။
- Indexes နဲ့ foreign key constraints တွေက table တစ်ခုချင်းစီကိုပဲ သက်ရောက်ပြီး — သူတို့ရဲ့ inheritance children တွေကို မသက်ရောက်ပါဘူး — ဒါကြောင့် သတိထားရမယ့် caveats တချို့ ရှိပါတယ်။
- ဒီမှာ ပြထားတဲ့ ပုံစံတွေက — row တစ်ခုရဲ့ key column (တွေ) ရဲ့ values တွေ ဘယ်တော့မှ မပြောင်းဘူး ဒါမှမဟုတ် — အနည်းဆုံးတော့ — တခြား partition တစ်ခုဆီ ရွှေ့ဖို့ လိုလောက်အောင် မပြောင်းဘူးလို့ ယူဆထားပါတယ်။ အဲဒီလို လုပ်ဖို့ ကြိုးစားတဲ့ UPDATE တစ်ခုက CHECK constraints တွေကြောင့် မအောင်မြင်ပါဘူး။ ဒီလို ကိစ္စတွေကို ကိုင်တွယ်ဖို့ လိုရင် — child tables တွေပေါ်မှာ သင့်လျော်တဲ့ update triggers တွေ ထားနိုင်ပါတယ် — ဒါပေမယ့် ဒါက structure ရဲ့ စီမံခန့်ခွဲမှုကို အများကြီး ပိုရှုပ်ထွေးစေပါတယ်။
- Manual VACUUM နဲ့ ANALYZE commands တွေက inheritance child tables အားလုံးကို အလိုအလျောက် လုပ်ဆောင်ပါလိမ့်မယ်။ ဒါ မလိုချင်ဘူးဆိုရင် — ONLY key word ကို သုံးနိုင်ပါတယ်။ ဒီလို command တစ်ခုက:
  
  ANALYZE ONLY measurement;
  
  root table ကိုပဲ လုပ်ဆောင်မှာ ဖြစ်ပါတယ်။
- ON CONFLICT clauses ပါတဲ့ INSERT statements တွေက မျှော်လင့်ထားသလို အလုပ်မဖြစ်နိုင်ပါဘူး — အကြောင်းက ON CONFLICT action က သတ်မှတ်ထားတဲ့ target relation ပေါ်မှာ unique violations တွေဖြစ်တဲ့အခါမှပဲ လုပ်ဆောင်တာ ဖြစ်ပြီး — သူ့ရဲ့ child relations တွေပေါ်မှာ မဟုတ်လို့ပါ။
- Application က partitioning ပုံစံကို ထင်ရှားစွာ သတိမထားဘူးဆိုရင် — rows တွေကို လိုချင်တဲ့ child table ဆီ ပို့ဆောင်ဖို့ triggers ဒါမှမဟုတ် rules တွေ လိုအပ်ပါလိမ့်မယ်။ Triggers တွေက ရေးရတာ ရှုပ်ထွေးနိုင်ပြီး — declarative partitioning က အတွင်းပိုင်းမှာ လုပ်ဆောင်ပေးတဲ့ tuple routing ထက် အများကြီး ပိုနှေးကွေးပါလိမ့်မယ်။

### 5.12.4. Partition Pruning (partition များ ဖယ်ထုတ်ခြင်း)

*Partition pruning* ဆိုတာ — declaratively partitioned tables တွေရဲ့ စွမ်းဆောင်ရည်ကို တိုးတက်စေတဲ့ query optimization နည်းစနစ် တစ်ခုပါ။ ဥပမာ:

```sql
SET enable_partition_pruning = on;                 -- the default
SELECT count(*) FROM measurement WHERE logdate >= DATE '2008-01-01';
```

Partition pruning မပါဘဲဆိုရင် — အပေါ်က query က `measurement` table ရဲ့ partition တစ်ခုချင်းစီကို scan လုပ်ပါလိမ့်မယ်။ Partition pruning ကို ဖွင့်ထားရင် — planner က partition တစ်ခုချင်းစီရဲ့ definition ကို စစ်ဆေးပြီး — အဲဒီ partition ထဲမှာ query ရဲ့ `WHERE` clause ကို ကျေနပ်စေမယ့် rows တွေ ဘယ်လိုမှ မပါနိုင်လို့ — scan လုပ်စရာ မလိုဘူးဆိုတာကို သက်သေပြပါတယ်။ Planner က ဒါကို သက်သေပြနိုင်တဲ့အခါ — partition ကို query plan ကနေ ဖယ်ထုတ် (*prunes*) ပါတယ်။

EXPLAIN command နဲ့ [enable_partition_pruning](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-PARTITION-PRUNING) configuration parameter ကို သုံးခြင်းအားဖြင့် — partitions တွေကို ဖယ်ထုတ်ထားတဲ့ plan တစ်ခုနဲ့ မဖယ်ထုတ်ထားတဲ့ plan တစ်ခုကြား ခြားနားချက်ကို ပြသနိုင်ပါတယ်။ ဒီလို table setup အမျိုးအစားအတွက် ပုံမှန် unoptimized plan တစ်ခုက:

```sql
SET enable_partition_pruning = off;
EXPLAIN SELECT count(*) FROM measurement WHERE logdate >= DATE '2008-01-01';
                                    QUERY PLAN
-------------------------------------------------------------------​----------------
 Aggregate  (cost=188.76..188.77 rows=1 width=8)
   ->  Append  (cost=0.00..181.05 rows=3085 width=0)
         ->  Seq Scan on measurement_y2006m02  (cost=0.00..33.12 rows=617 width=0)
               Filter: (logdate >= '2008-01-01'::date)
         ->  Seq Scan on measurement_y2006m03  (cost=0.00..33.12 rows=617 width=0)
               Filter: (logdate >= '2008-01-01'::date)
...
         ->  Seq Scan on measurement_y2007m11  (cost=0.00..33.12 rows=617 width=0)
               Filter: (logdate >= '2008-01-01'::date)
         ->  Seq Scan on measurement_y2007m12  (cost=0.00..33.12 rows=617 width=0)
               Filter: (logdate >= '2008-01-01'::date)
         ->  Seq Scan on measurement_y2008m01  (cost=0.00..33.12 rows=617 width=0)
               Filter: (logdate >= '2008-01-01'::date)
```

Partitions တချို့ ဒါမှမဟုတ် အားလုံးက full-table sequential scans အစား index scans တွေ သုံးနိုင်ပါတယ် — ဒါပေမယ့် ဒီနေရာမှာ အဓိက အချက်က — ဒီ query ကို အဖြေပေးဖို့ partition အဟောင်းတွေကို လုံးဝ scan လုပ်စရာ မလိုဘူးဆိုတာပါ။ Partition pruning ကို ဖွင့်လိုက်တဲ့အခါ — အဖြေ အတူတူကို ပေးမယ့် သိသိသာသာ သက်သာတဲ့ (cheaper) plan တစ်ခု ရပါတယ်:

```sql
SET enable_partition_pruning = on;
EXPLAIN SELECT count(*) FROM measurement WHERE logdate >= DATE '2008-01-01';
                                    QUERY PLAN
-------------------------------------------------------------------​----------------
 Aggregate  (cost=37.75..37.76 rows=1 width=8)
   ->  Seq Scan on measurement_y2008m01  (cost=0.00..33.12 rows=617 width=0)
         Filter: (logdate >= '2008-01-01'::date)
```

Partition pruning က partition keys တွေက သွယ်ဝိုက်စွာ (implicitly) သတ်မှတ်ပေးတဲ့ constraints တွေကနေပဲ မောင်းနှင်တာဖြစ်ပြီး — indexes တွေ ရှိနေတာနဲ့ မဆိုင်ဘူးဆိုတာ သတိပြုပါ။ ဒါကြောင့် key columns တွေပေါ်မှာ indexes တွေ သတ်မှတ်စရာ မလိုပါဘူး။ Partition တစ်ခုအတွက် index တစ်ခု ဖန်တီးဖို့ လိုမလိုဆိုတာက — အဲဒီ partition ကို scan လုပ်တဲ့ queries တွေက partition ရဲ့ ကြီးမားတဲ့ အစိတ်အပိုင်း တစ်ခုကို ယေဘုယျအားဖြင့် scan လုပ်မှာလား၊ ဒါမှမဟုတ် သေးငယ်တဲ့ အစိတ်အပိုင်း တစ်ခုကိုပဲ scan လုပ်မှာလားဆိုတာပေါ်မှာ မူတည်ပါတယ်။ Index က နောက်ပိုင်း (သေးငယ်တဲ့ အစိတ်အပိုင်း scan ကိစ္စ) မှာ အထောက်အကူ ဖြစ်ပေမယ့် — ရှေ့ပိုင်း (ကြီးမားတဲ့ အစိတ်အပိုင်း scan ကိစ္စ) မှာတော့ မဖြစ်ပါဘူး။

Partition pruning ကို ပေးထားတဲ့ query တစ်ခုရဲ့ planning အတွင်းမှာသာမက — သူ့ရဲ့ execution အတွင်းမှာပါ လုပ်ဆောင်နိုင်ပါတယ်။ Clauses တွေမှာ query planning အချိန်မှာ တန်ဖိုး မသိရသေးတဲ့ expressions တွေ ပါဝင်နေတဲ့အခါ — ဥပမာ `PREPARE` statement တစ်ခုထဲမှာ သတ်မှတ်ထားတဲ့ parameters တွေ၊ subquery တစ်ခုကနေ ရယူထားတဲ့ value တစ်ခု၊ ဒါမှမဟုတ် nested loop join တစ်ခုရဲ့ အတွင်းဘက် (inner side) မှာ parameterized value တစ်ခုကို သုံးထားတဲ့အခါမျိုးမှာ — partitions တွေ ပိုများများ ဖယ်ထုတ်နိုင်လို့ ဒါက အသုံးဝင်ပါတယ်။ Execution အတွင်း partition pruning ကို အောက်ပါ အချိန်တွေထဲက ဘယ်အချိန်မှာမဆို လုပ်ဆောင်နိုင်ပါတယ်:

- Query plan ရဲ့ initialization အတွင်းမှာ။ Execution ရဲ့ initialization အဆင့်မှာ သိပြီးသား ဖြစ်တဲ့ parameter values တွေအတွက် ဒီနေရာမှာ partition pruning လုပ်ဆောင်နိုင်ပါတယ်။ ဒီအဆင့်မှာ ဖယ်ထုတ်ခံရတဲ့ partitions တွေက query ရဲ့ EXPLAIN ဒါမှမဟုတ် EXPLAIN ANALYZE ထဲမှာ ပေါ်လာမှာ မဟုတ်ပါဘူး။ ဒီအဆင့်အတွင်း ဘယ်နှစ်ခု ဖယ်ရှားခဲ့လဲဆိုတာကို — EXPLAIN output ထဲက "Subplans Removed" property ကို ကြည့်ခြင်းအားဖြင့် ဆုံးဖြတ်နိုင်ပါတယ်။ ဒီအဆင့်မှာ လုပ်တဲ့ partition pruning ကြောင့် ဖယ်ရှားခံရတဲ့ partitions တွေက — execution ရဲ့ အစမှာတော့ lock လုပ်ခံရဆဲ ဖြစ်တယ်ဆိုတာ မှတ်သားဖို့ အရေးကြီးပါတယ်။
- Query plan ရဲ့ တကယ့် execution အတွင်းမှာ။ တကယ့် query execution အတွင်းမှာပဲ သိရတဲ့ values တွေကို သုံးပြီး partitions တွေ ဖယ်ရှားဖို့ ဒီနေရာမှာလည်း partition pruning လုပ်ဆောင်နိုင်ပါတယ်။ ဒီထဲမှာ subqueries တွေကနေ ရလာတဲ့ values တွေနဲ့ parameterized nested loop joins တွေက လာတဲ့ execution-time parameters တွေလို values တွေ ပါဝင်ပါတယ်။ ဒီ parameters တွေရဲ့ value က query ရဲ့ execution အတွင်း အကြိမ်ကြိမ် ပြောင်းလဲနိုင်လို့ — partition pruning က သုံးနေတဲ့ execution parameters တစ်ခုခု ပြောင်းလဲတိုင်း partition pruning ကို လုပ်ဆောင်ပါတယ်။ ဒီအဆင့်အတွင်း partitions တွေ ဖယ်ထုတ်ခံရလားဆိုတာ ဆုံးဖြတ်ဖို့ — EXPLAIN ANALYZE output ထဲက loops property ကို ဂရုတစိုက် စစ်ဆေးဖို့ လိုပါတယ်။ Partition အမျိုးမျိုးနဲ့ ကိုက်ညီတဲ့ subplans တွေက — execution အတွင်း တစ်ခုချင်းစီ ဘယ်နှစ်ကြိမ် ဖယ်ထုတ်ခံခဲ့ရလဲဆိုတာပေါ် မူတည်ပြီး — အဲဒါအတွက် တန်ဖိုး အမျိုးမျိုး ရှိနိုင်ပါတယ်။ တစ်ချို့က အကြိမ်တိုင်း ဖယ်ထုတ်ခံခဲ့ရရင် (never executed) အဖြစ် ပြသခံရနိုင်ပါတယ်။

Partition pruning ကို [enable_partition_pruning](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-PARTITION-PRUNING) setting သုံးပြီး disabled (ပိတ်) လုပ်နိုင်ပါတယ်။

### 5.12.5. Partitioning and Constraint Exclusion (partitioning နှင့် constraint exclusion)

*Constraint exclusion* ဆိုတာ — partition pruning နဲ့ ဆင်တူတဲ့ query optimization နည်းစနစ် တစ်ခုပါ။ သူ့ကို အဓိကအားဖြင့် legacy inheritance နည်းလမ်းနဲ့ အကောင်အထည် ဖော်ထားတဲ့ partitioning အတွက် သုံးပေမယ့် — declarative partitioning အပါအဝင် တခြား ရည်ရွယ်ချက်တွေအတွက်ပါ သုံးနိုင်ပါတယ်။

Constraint exclusion က partition pruning နဲ့ အလွန် ဆင်တူတဲ့ နည်းလမ်းနဲ့ အလုပ်လုပ်ပါတယ် — ခြားနားချက်က သူက table တစ်ခုချင်းစီရဲ့ `CHECK` constraints တွေကို သုံးတာပါ — ဒါကြောင့်လည်း ဒီနာမည် ရလာတာပါ — partition pruning ကတော့ declarative partitioning ရဲ့ ကိစ္စမှာပဲ ရှိနိုင်တဲ့ table ရဲ့ partition bounds တွေကို သုံးပါတယ်။ နောက်ထပ် ခြားနားချက်တစ်ခုက — constraint exclusion က plan time မှာပဲ သက်ရောက်ပြီး — execution time မှာ partitions တွေကို ဖယ်ရှားဖို့ မကြိုးစားပါဘူး။

Constraint exclusion က `CHECK` constraints တွေကို သုံးတာ — partition pruning နဲ့ ယှဉ်ရင် နှေးကွေးစေတယ်ဆိုတဲ့ အချက်ကို တစ်ခါတရံ အားသာချက်တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်: declaratively-partitioned tables တွေပေါ်မှာတောင် — သူတို့ရဲ့ အတွင်းပိုင်း partition bounds တွေအပြင် constraints တွေကိုပါ သတ်မှတ်နိုင်လို့ — constraint exclusion က query plan ကနေ နောက်ထပ် partitions တွေကိုပါ ဖယ်ထုတ်နိုင် (elide) ဖို့ ဖြစ်နိုင်ပါတယ်။

[constraint_exclusion](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CONSTRAINT-EXCLUSION) ရဲ့ ပုံမှန် (နဲ့ အကြံပြုထားတဲ့) setting က `on` လည်း မဟုတ် — `off` လည်း မဟုတ်ဘဲ — `partition` လို့ခေါ်တဲ့ အလယ်အလတ် setting တစ်ခု ဖြစ်ပါတယ် — ဒါက inheritance partitioned tables တွေနဲ့ အလုပ်လုပ်ဖို့ ဖြစ်နိုင်ခြေ များတဲ့ queries တွေကိုပဲ ဒီနည်းစနစ် သက်ရောက်စေပါတယ်။ `on` setting ကတော့ — planner က queries အားလုံးမှာရှိတဲ့ `CHECK` constraints တွေကို စစ်ဆေးစေပါတယ် — အကျိုးရှိဖို့ မဖြစ်နိုင်တဲ့ ရိုးရှင်းတဲ့ queries တွေမှာတောင် ဖြစ်ပါတယ်။

အောက်ပါ caveats တွေက constraint exclusion ကို သက်ရောက်ပါတယ်:

- Constraint exclusion က query planning အတွင်းမှာပဲ သက်ရောက်ပြီး — query execution အတွင်းမှာလည်း သက်ရောက်နိုင်တဲ့ partition pruning နဲ့ မတူပါဘူး။
- Constraint exclusion က query ရဲ့ WHERE clause ထဲမှာ constants (ဒါမှမဟုတ် ပြင်ပကနေ ပေးသွင်းထားတဲ့ parameters) တွေ ပါဝင်မှပဲ အလုပ်လုပ်ပါတယ်။ ဥပမာ — CURRENT_TIMESTAMP လို non-immutable function တစ်ခုနဲ့ နှိုင်းယှဉ်တာမျိုးကို optimize လုပ်လို့ မရပါဘူး — အကြောင်းက run time မှာ function ရဲ့ value က ဘယ် child table ထဲကို ကျရောက်နိုင်လဲဆိုတာကို planner က မသိနိုင်လို့ပါ။
- Partitioning constraints တွေကို ရိုးရှင်းအောင် ထားပါ — မဟုတ်ရင် planner က child tables တွေကို လည်ပတ်စရာ မလိုဘူးဆိုတာကို သက်သေပြနိုင်မှာ မဟုတ်ပါဘူး။ List partitioning အတွက် ရိုးရှင်းတဲ့ equality conditions တွေကို သုံးပါ — ဒါမှမဟုတ် range partitioning အတွက် ရိုးရှင်းတဲ့ range tests တွေကို သုံးပါ — အပေါ်က ဥပမာတွေမှာ ပြထားသလိုပါ။ Partitioning constraints တွေမှာ — partitioning column (တွေ) ကို B-tree-indexable operators တွေသုံးပြီး constants တွေနဲ့ နှိုင်းယှဉ်တာတွေပဲ ပါဝင်သင့်တယ်ဆိုတာ ကောင်းမွန်တဲ့ လက်မ-စည်းမျဉ်းတစ်ခုပါ — အကြောင်းက partition key ထဲမှာ B-tree-indexable column (တွေ) ပဲ ခွင့်ပြုလို့ပါ။
- Constraint exclusion အတွင်း parent table ရဲ့ children အားလုံးပေါ်မှာရှိတဲ့ constraints အားလုံးကို စစ်ဆေးလို့ — children အရေအတွက် များလွန်းရင် query planning အချိန်ကို သိသိသာသာ တိုးစေနိုင်ပါတယ်။ ဒါကြောင့် legacy inheritance အခြေပြု partitioning က child tables ရာဂဏန်း (a hundred) လောက်အထိတော့ ကောင်းကောင်း အလုပ်လုပ်ပါလိမ့်မယ်; children ထောင်ပေါင်း များစွာနဲ့တော့ မကြိုးစားပါနဲ့။

### 5.12.6. Best Practices for Declarative Partitioning (Declarative partitioning အတွက် အကောင်းဆုံး နည်းလမ်းများ)

Table တစ်ခုကို ဘယ်လို partition လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုကို ဂရုတစိုက် ပြုလုပ်သင့်ပါတယ် — အကြောင်းက ဒီဇိုင်း ညံ့ဖျင်းရင် query planning နဲ့ execution ရဲ့ စွမ်းဆောင်ရည်ကို ဆိုးရွားစွာ ထိခိုက်စေနိုင်လို့ပါ။

အရေးအကြီးဆုံး design ဆုံးဖြတ်ချက်တွေထဲက တစ်ခုက — သင့်ရဲ့ data ကို ဘယ် column ဒါမှမဟုတ် columns တွေနဲ့ ခွဲမလဲဆိုတာပါ။ မကြာခဏဆိုသလို အကောင်းဆုံး ရွေးချယ်မှုက — partitioned table ပေါ်မှာ run လုပ်နေတဲ့ queries တွေရဲ့ `WHERE` clauses တွေထဲမှာ အသုံးအများဆုံး ဖြစ်တဲ့ column ဒါမှမဟုတ် column အစုနဲ့ ခွဲတာပါ။ Partition bound constraints တွေနဲ့ ကိုက်ညီတဲ့ `WHERE` clauses တွေကို — မလိုအပ်တဲ့ partitions တွေကို ဖယ်ထုတ် (prune) ဖို့ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — `PRIMARY KEY` ဒါမှမဟုတ် `UNIQUE` constraint တစ်ခုရဲ့ လိုအပ်ချက်တွေကြောင့် တခြား ဆုံးဖြတ်ချက်တွေ ချမှတ်ရတော့မယ့် အခြေအနေမျိုးလည်း ရှိနိုင်ပါတယ်။ မလိုချင်တဲ့ data တွေကို ဖယ်ရှားတာကလည်း သင့်ရဲ့ partitioning strategy ကို စီစဉ်တဲ့အခါ ထည့်သွင်း စဉ်းစားရမယ့် အချက်တစ်ခုပါ။ Partition တစ်ခုလုံးကို အတော်လေး လျင်မြန်စွာ detach လုပ်နိုင်လို့ — တစ်ပြိုင်နက် ဖယ်ရှားရမယ့် data အားလုံးက partition တစ်ခုတည်းထဲမှာ တည်ရှိနေအောင် partition strategy ကို ဒီဇိုင်းဆွဲတာက အကျိုးရှိနိုင်ပါတယ်။

Table ကို ခွဲထားရမယ့် partition အရေအတွက် ပစ်မှတ်ကို ရွေးချယ်တာကလည်း အရေးကြီးတဲ့ ဆုံးဖြတ်ချက် တစ်ခုပါ။ Partitions လုံလောက်စွာ မများရင် — indexes တွေ ကြီးလွန်းနေပြီး data locality က ညံ့ဖျင်းနေနိုင်လို့ — cache hit ratios နိမ့်ကျစေနိုင်ပါတယ်။ ဒါပေမယ့် — table ကို partitions အများကြီး ခွဲလွန်းရင်လည်း ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ်။ Partitions အများကြီး ရှိနေရင် — query planning အချိန် ပိုရှည်စေနိုင်ပြီး — query planning ရော execution ရော အတွင်းမှာပါ memory သုံးစွဲမှု ပိုများစေနိုင်ပါတယ် — အောက်မှာ ထပ်ဖော်ပြထားသလိုပါ။ Table ကို ဘယ်လို partition လုပ်မလဲ ရွေးချယ်တဲ့အခါ — အနာဂတ်မှာ ဘယ်လို ပြောင်းလဲမှုတွေ ဖြစ်လာနိုင်လဲဆိုတာကိုပါ ထည့်သွင်း စဉ်းစားဖို့ အရေးကြီးပါတယ်။ ဥပမာ — customer တစ်ယောက်ကို partition တစ်ခုနှုန်း ရွေးချယ်ထားပြီး — လက်ရှိမှာ ကြီးမားတဲ့ customers အနည်းငယ်ပဲ ရှိတယ်ဆိုရင် — နှစ်အနည်းငယ်ကြာတဲ့အခါ သေးငယ်တဲ့ customers အများအပြား ဖြစ်သွားရင် ဘယ်လို သက်ရောက်မှုတွေ ရှိမလဲဆိုတာ စဉ်းစားကြည့်ပါ။ ဒီကိစ္စမှာ — `LIST` နဲ့ partition လုပ်ဖို့ ကြိုးစားပြီး customer အရေအတွက် — partition လုပ်လို့ အလုပ်ဖြစ်နိုင်တာထက် မကျော်လွန်သွားဖို့ မျှော်လင့်နေမယ့်အစား — `HASH` နဲ့ partition လုပ်ပြီး သင့်လျော်တဲ့ partition အရေအတွက် တစ်ခုကို ရွေးချယ်တာက ပိုကောင်းနိုင်ပါတယ်။

Sub-partitioning က — တခြား partitions တွေထက် ပိုကြီးထွားလာမယ်လို့ မျှော်လင့်ရတဲ့ partitions တွေကို ထပ်ဆင့် ခွဲဝေဖို့ အသုံးဝင်နိုင်ပါတယ်။ နောက်ထပ် ရွေးစရာတစ်ခုက — partition key ထဲမှာ columns အများအပြား ပါဝင်တဲ့ range partitioning ကို သုံးတာပါ။ ဒီနှစ်ခုလုံးက partition အရေအတွက် အလွန်အကျွံ များလာစေနိုင်လို့ — ချုပ်တည်းမှု (restraint) ရှိဖို့ အကြံပြုပါတယ်။

Query planning နဲ့ execution အတွင်း partitioning ရဲ့ overhead ကို ထည့်သွင်း စဉ်းစားဖို့ အရေးကြီးပါတယ်။ Query planner က သာမန်အားဖြင့် — partition hierarchies ထောင်ဂဏန်း (a few thousand) အထိကို အတော်လေး ကောင်းကောင်း ကိုင်တွယ်နိုင်ပါတယ် — ပုံမှန် queries တွေက planner ကို partitions အနည်းငယ်ကလွဲပြီး အားလုံး ဖယ်ထုတ်နိုင်စေတယ်ဆိုရင် ဖြစ်ပါတယ်။ Planner က partition pruning လုပ်ဆောင်ပြီးနောက်မှာ partitions ပိုများများ ကျန်နေလေလေ — planning အချိန် ပိုရှည်လေလေ၊ memory သုံးစွဲမှု ပိုများလေလေ ဖြစ်ပါတယ်။ Partition အရေအတွက် များပြားတာကို စိုးရိမ်ရတဲ့ နောက်ထပ် အကြောင်းရင်းတစ်ခုက — server ရဲ့ memory သုံးစွဲမှုက အချိန်ကြာလာတာနဲ့အမျှ သိသိသာသာ ကြီးထွားလာနိုင်လို့ပါ — အထူးသဖြင့် sessions အများအပြားက partition အရေအတွက် များပြားတာတွေကို ထိတွေ့ (touch) နေရင် ဖြစ်ပါတယ်။ အကြောင်းက partition တစ်ခုချင်းစီအတွက် — သူ့ကို ထိတွေ့တဲ့ session တစ်ခုချင်းစီရဲ့ local memory ထဲကို သူ့ရဲ့ metadata ကို load လုပ်ဖို့ လိုအပ်လို့ပါ။

Data warehouse type workloads တွေနဲ့ဆိုရင် — OLTP type workload တစ်ခုထက် partition အရေအတွက် ပိုများတာကို သုံးတာ အဓိပ္ပာယ် ရှိနိုင်ပါတယ်။ ယေဘုယျအားဖြင့် data warehouses တွေမှာ — processing အချိန် အများစုက query execution အတွင်း ကုန်ဆုံးလို့ — query planning အချိန်က သိပ်ပြီး စိုးရိမ်စရာ မဟုတ်ပါဘူး။ Workload အမျိုးအစား ဒီနှစ်ခုလုံးနဲ့ဆိုရင် — data အမြောက်အမြားကို ပြန်လည် partition လုပ်တာက နာကျင်ဖွယ် နှေးကွေးနိုင်လို့ — မှန်ကန်တဲ့ ဆုံးဖြတ်ချက်တွေကို အစောပိုင်းမှာ ချမှတ်ဖို့ အရေးကြီးပါတယ်။ ရည်ရွယ်ထားတဲ့ workload ရဲ့ simulations တွေက partitioning strategy ကို optimize လုပ်ဖို့ မကြာခဏ အကျိုးရှိပါတယ်။ Partitions များတာက နည်းတာထက် ပိုကောင်းတယ်လို့ ဖြစ်ဖြစ် — အပြန်အလှန်အားဖြင့် ပိုဆိုးတယ်လို့ ဖြစ်ဖြစ် — ဘယ်တော့မှ မရိုးရှင်းစွာ ယူဆလိုက်ပါနဲ့။
