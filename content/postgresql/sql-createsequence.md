---
title: "CREATE SEQUENCE (sequence အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Sequence number generator (auto-increment ဂဏန်းထုတ်ပေးသည့် object) အသစ်တစ်ခုကို ဖန်တီးပေးသည့် command — TEMPORARY/UNLOGGED, AS data_type, INCREMENT, MINVALUE/MAXVALUE, CYCLE, START, CACHE, OWNED BY စသည့် option များနှင့် sequence သုံးစွဲမှုဆိုင်ရာ မှတ်စုများ"
order: 148
source: "https://www.postgresql.org/docs/current/sql-createsequence.html"
status: translated
updated: 2026-09-04
---

## CREATE SEQUENCE (sequence အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE SEQUENCE — sequence number generator (sequence နံပါတ်များ ထုတ်လုပ်ပေးသည့် ကိရိယာ) အသစ်တစ်ခုကို သတ်မှတ်ဖန်တီးပေးခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ { TEMPORARY | TEMP } | UNLOGGED ] SEQUENCE [ IF NOT EXISTS ] name
    [ AS data_type ]
    [ INCREMENT [ BY ] increment ]
    [ MINVALUE minvalue | NO MINVALUE ] [ MAXVALUE maxvalue | NO MAXVALUE ]
    [ [ NO ] CYCLE ]
    [ START [ WITH ] start ]
    [ CACHE cache ]
    [ OWNED BY { table_name.column_name | NONE } ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE SEQUENCE` က sequence number generator အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဒါမှာ `name` ဆိုတဲ့ နာမည်နဲ့ အထူး single-row table (စာကြောင်းတစ်ကြောင်းတည်း ပါဝင်သည့် ဇယား) အသစ်တစ်ခုကို ဖန်တီးပြီး အစပြု သတ်မှတ်ခြင်း ပါဝင်ပါတယ်။ အဲဒီ generator ကို command ကို ထုတ်ပေးလိုက်တဲ့ user က ပိုင်ဆိုင်သွားပါလိမ့်မယ်။

Schema နာမည် ပေးထားရင် — sequence ကို အဲဒီ သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပေးထားရင် လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ Temporary sequence တွေက အထူး schema တစ်ခုထဲမှာ တည်ရှိလို့ — temporary sequence ဖန်တီးတဲ့အခါ schema နာမည် ပေးလို့ မရပါဘူး။ Sequence ရဲ့ နာမည်က — တူညီတဲ့ schema ထဲမှာ ရှိတဲ့ တခြား relation (table, sequence, index, view, materialized view ဒါမှမဟုတ် foreign table) တွေရဲ့ နာမည်တွေနဲ့ မတူညီရပါဘူး (distinct ဖြစ်ရပါမယ်)။

Sequence ဖန်တီးပြီးတာနဲ့ — `nextval`, `currval` နဲ့ `setval` functions တွေကို သုံးပြီး sequence ပေါ်မှာ လည်ပတ်လို့ ရပါတယ်။ ဒီ functions တွေကို [အပိုင်း 9.17](/docs/postgresql/functions-sequence) မှာ ဖော်ပြထားပါတယ်။

Sequence တစ်ခုကို တိုက်ရိုက် update လုပ်လို့ မရပေမယ့် — အောက်ပါအတိုင်း query တစ်ခုကို သုံးပြီး — sequence တစ်ခုရဲ့ parameters တွေနဲ့ လက်ရှိ state ကို စစ်ဆေးကြည့်ရှုနိုင်ပါတယ်:

```sql
SELECT * FROM name;
```

အထူးသဖြင့် — sequence ရဲ့ `last_value` field က session တစ်ခုခုက နောက်ဆုံး ခွဲဝေပေးခဲ့တဲ့ (allocated) တန်ဖိုးကို ပြသပါတယ်။ (တခြား session တွေက `nextval` ခေါ်ဆိုမှုတွေကို တက်ကြွစွာ လုပ်ဆောင်နေတယ်ဆိုရင် — ဒီတန်ဖိုးက ပြသလိုက်တဲ့ အချိန်မှာတော့ ခေတ်မမီတော့တာ (obsolete) ဖြစ်နေနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **TEMPORARY or TEMP** — သတ်မှတ်ပေးထားရင် — sequence object ကို ဒီ session အတွက်ပဲ ဖန်တီးပြီး — session ပြီးဆုံးသွားတာနဲ့ အလိုအလျောက် ဖျက်ပစ်ပါတယ်။ နာမည်တူရှိတဲ့ permanent sequence တွေက temporary sequence တည်ရှိနေတဲ့ ကာလအတွင်း (ဒီ session ထဲမှာ) မမြင်ရပါဘူး — schema-qualified names (schema ပါဝင်တဲ့ နာမည်များ) နဲ့ ရည်ညွှန်းထားရင်ကလွဲလို့ပါ။
- **UNLOGGED** — သတ်မှတ်ပေးထားရင် — sequence ကို unlogged sequence အဖြစ် ဖန်တီးပါတယ်။ Unlogged sequence တွေရဲ့ အပြောင်းအလဲတွေကို write-ahead log (WAL) ထဲကို ရေးသွင်းခြင်း မရှိပါဘူး။ ၎င်းတို့က crash-safe (crash ဖြစ်မှုဒဏ် ခံနိုင်သော) မဟုတ်ပါဘူး: crash ဖြစ်ပြီးနောက် ဒါမှမဟုတ် သန့်ရှင်းစွာ မဟုတ်တဲ့ shutdown (ပိတ်သိမ်းမှု) ဖြစ်ပြီးနောက် unlogged sequence ကို ၎င်းရဲ့ ကနဦး state ဆီ အလိုအလျောက် ပြန်လည် သတ်မှတ်ပါတယ်။ Unlogged sequence တွေကို standby servers တွေဆီလည်း replicate (ပုံတူပွား) လုပ်ပေးခြင်း မရှိပါဘူး။
Unlogged table တွေနဲ့ မတူဘဲ — unlogged sequence တွေက သိသာထင်ရှားတဲ့ performance အကျိုးကျေးဇူး တစ်ခုကို ပေးစွမ်းခြင်း မရှိပါဘူး။ ဒီ option က အဓိကအားဖြင့် — identity columns ဒါမှမဟုတ် serial columns တွေကတစ်ဆင့် unlogged tables တွေနဲ့ ဆက်စပ်ထားတဲ့ sequences တွေအတွက် ရည်ရွယ်ထားတာပါ။ အဲဒီလို ကိစ္စတွေမှာ — sequence ကိုတော့ WAL-logged လုပ်ပြီး replicate လုပ်ပေမယ့် — ဆက်စပ်နေတဲ့ table ကိုတော့ မလုပ်ဘဲ ထားတာမျိုးက အဓိပ္ပာယ် ရှိလေ့ မရှိလို့ပါ။
- **IF NOT EXISTS** — နာမည်တူရှိတဲ့ relation တစ်ခု ရှိနှင့်ပြီးသား ဆိုရင် error တစ်ခု မထုတ်တော့ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။ ရှိပြီးသား relation က ဖန်တီးခဲ့မယ့် sequence နဲ့ ပုံစံတူ ဖြစ်မယ်လို့တော့ အာမခံချက် မရှိဘူးဆိုတာ သတိပြုပါ — အဲဒါက sequence တစ်ခုတောင် မဟုတ်ဘဲ ဖြစ်နိုင်ပါတယ်။
- **name** — ဖန်တီးရမယ့် sequence ရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်သည်)။
- **data_type** — AS data_type ဆိုတဲ့ optional clause က sequence ရဲ့ data type ကို သတ်မှတ်ပေးပါတယ်။ Valid type တွေကတော့ smallint, integer နဲ့ bigint ဖြစ်ပါတယ်။ Default ကတော့ bigint ပါ။ Data type က sequence ရဲ့ default minimum နဲ့ maximum တန်ဖိုးတွေကို ဆုံးဖြတ်ပေးပါတယ်။
- **increment** — INCREMENT BY increment ဆိုတဲ့ optional clause က — လက်ရှိ sequence တန်ဖိုးကို ပေါင်းပြီး တန်ဖိုးအသစ်တစ်ခု ဖန်တီးဖို့ ဘယ်တန်ဖိုးကို ထည့်ရမယ်ဆိုတာ သတ်မှတ်ပါတယ်။ Positive (အပေါင်း) တန်ဖိုး ဆိုရင် ascending sequence (တန်ဖိုးတွေ တက်သွားသည့် sequence) ဖြစ်စေပြီး — negative (အနုတ်) တန်ဖိုး ဆိုရင် descending sequence (တန်ဖိုးတွေ ဆင်းသွားသည့် sequence) ဖြစ်စေပါတယ်။ Default တန်ဖိုးကတော့ 1 ပါ။
- **minvalueNO MINVALUE** — MINVALUE minvalue ဆိုတဲ့ optional clause က sequence တစ်ခု ထုတ်လုပ်နိုင်တဲ့ အနိမ့်ဆုံး တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ ဒီ clause ကို မပေးထားဘူးဆိုရင် ဒါမှမဟုတ် NO MINVALUE လို့ သတ်မှတ်ထားရင် — default တန်ဖိုးတွေကို သုံးပါလိမ့်မယ်။ Ascending sequence အတွက် default က 1 ဖြစ်ပြီး — descending sequence အတွက် default က data type ရဲ့ minimum တန်ဖိုး ဖြစ်ပါတယ်။
- **maxvalueNO MAXVALUE** — MAXVALUE maxvalue ဆိုတဲ့ optional clause က sequence အတွက် အမြင့်ဆုံး တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ ဒီ clause ကို မပေးထားဘူးဆိုရင် ဒါမှမဟုတ် NO MAXVALUE လို့ သတ်မှတ်ထားရင် — default တန်ဖိုးတွေကို သုံးပါလိမ့်မယ်။ Ascending sequence အတွက် default က data type ရဲ့ maximum တန်ဖိုး ဖြစ်ပြီး — descending sequence အတွက် default က -1 ဖြစ်ပါတယ်။
- **CYCLENO CYCLE** — CYCLE option က — ascending sequence တစ်ခုက maxvalue ကို ဖြစ်စေ descending sequence တစ်ခုက minvalue ကို ဖြစ်စေ ရောက်ရှိပြီးတဲ့အခါ — sequence ကို ပြန်လည် ရစ်ပတ်သွားစေဖို့ (wrap around) ခွင့်ပြုပါတယ်။ ကန့်သတ်ချက် (limit) ကို ရောက်ရှိသွားရင် — နောက်ထုတ်ပေးလိုက်တဲ့ နံပါတ်က — ascending ဆိုရင် minvalue၊ descending ဆိုရင် maxvalue — ဖြစ်သွားပါလိမ့်မယ်။
NO CYCLE လို့ သတ်မှတ်ထားရင် — sequence က ၎င်းရဲ့ maximum တန်ဖိုးကို ရောက်ရှိပြီးနောက် nextval ခေါ်ဆိုမှု တစ်ခုခုက error တစ်ခု ပြန်ပေးပါလိမ့်မယ်။ CYCLE ရော NO CYCLE ရော နှစ်ခုလုံး သတ်မှတ်မထားရင် — NO CYCLE က default ဖြစ်ပါတယ်။
- **start** — START WITH start ဆိုတဲ့ optional clause က sequence ကို ဘယ်နေရာကမဆို စတင်ခွင့် ပြုပါတယ်။ Default စတင်တန်ဖိုးက — ascending sequence တွေအတွက် minvalue ဖြစ်ပြီး — descending sequence တွေအတွက် maxvalue ဖြစ်ပါတယ်။
- **cache** — CACHE cache ဆိုတဲ့ optional clause က — ပိုမြန်တဲ့ ဝင်ရောက်မှုအတွက် — sequence နံပါတ် ဘယ်နှစ်ခုကို ကြိုတင် ခွဲဝေပြီး (preallocated) memory ထဲမှာ သိမ်းထားရမယ်ဆိုတာ သတ်မှတ်ပါတယ်။ အနည်းဆုံး တန်ဖိုးက 1 ဖြစ်ပြီး (တစ်ကြိမ်မှာ တန်ဖိုးတစ်ခုတည်းပဲ ထုတ်လုပ်နိုင်တယ် — ဆိုလိုတာက cache မရှိဘူး) — ဒါပဲ default လည်း ဖြစ်ပါတယ်။
- **OWNED BY table_name.column_nameOWNED BY NONE** — OWNED BY option က sequence ကို သတ်မှတ်ထားတဲ့ table column တစ်ခုနဲ့ ဆက်စပ်ပေးလိုက်တာဖြစ်ပြီး — အဲဒီ column (ဒါမှမဟုတ် ၎င်းရဲ့ table တစ်ခုလုံး) ကို drop လုပ်လိုက်ရင် — sequence ကိုပါ အလိုအလျောက် drop လုပ်သွားပါလိမ့်မယ်။ သတ်မှတ်လိုက်တဲ့ table က sequence နဲ့ owner အတူတူ ရှိပြီး schema လည်း အတူတူ ဖြစ်ရပါမယ်။ Default ဖြစ်တဲ့ OWNED BY NONE ကတော့ — အဲဒီလို ဆက်စပ်မှု ဘာမှ မရှိဘူးလို့ သတ်မှတ်ပါတယ်။

## Notes (မှတ်စုများ)

Sequence တစ်ခုကို ဖယ်ရှားဖို့ `DROP SEQUENCE` ကို သုံးပါ။

Sequences တွေက `bigint` arithmetic (ဂဏန်းသင်္ချာ) ပေါ်မှာ အခြေခံထားလို့ — ၎င်းတို့ရဲ့ အကွာအဝေးက eight-byte integer (8-byte ကိန်းပြည့်) ရဲ့ အကွာအဝေး (-9223372036854775808 ကနေ 9223372036854775807) ကို ကျော်လွန်လို့ မရပါဘူး။

`nextval` နဲ့ `setval` ခေါ်ဆိုမှုတွေက ဘယ်တော့မှ roll back မလုပ်လို့ — sequence နံပါတ်တွေကို “gapless” (ကွက်လပ် ကင်းစင်သော) အစဉ်အတိုင်း ခွဲဝေပေးဖို့ လိုအပ်တယ်ဆိုရင် — sequence objects တွေကို သုံးလို့ မရပါဘူး။ Counter တစ်ခု ပါဝင်တဲ့ table တစ်ခုကို exclusive locking (သီးသန့် သော့ခတ်ခြင်း) နဲ့ သုံးပြီး gapless assignment ကို တည်ဆောက်လို့တော့ ရပါတယ်; ဒါပေမယ့် ဒီနည်းလမ်းက sequence objects တွေထက် ကုန်ကျစရိတ် အများကြီး ပိုကြီးပါတယ် — အထူးသဖြင့် transaction အများအပြားက sequence နံပါတ်တွေကို တစ်ပြိုင်နက် (concurrently) လိုအပ်နေတဲ့အခါမှာ ဖြစ်ပါတယ်။

Session အများအပြားက တစ်ပြိုင်နက် သုံးမယ့် sequence object တစ်ခုအတွက် `cache` setting ကို 1 ထက် ကြီးအောင် သတ်မှတ်ထားရင် — မမျှော်လင့်တဲ့ ရလဒ်တွေ ရနိုင်ပါတယ်။ Session တစ်ခုချင်းစီက sequence object ကို တစ်ကြိမ် ဝင်ရောက်လိုက်တဲ့အခါ — ဆက်တိုက်ဖြစ်တဲ့ sequence တန်ဖိုးတွေကို ခွဲဝေပြီး cache ထဲ ထည့်ကာ — sequence object ရဲ့ `last_value` ကိုလည်း အဲဒီအတိုင်း တိုးမြှင့်ပေးပါတယ်။ ပြီးတော့ အဲဒီ session ထဲမှာ နောက် `nextval` အသုံးပြုမှု `cache`-1 ခုက — sequence object ကို ထိစရာမလိုဘဲ — ကြိုတင် ခွဲဝေထားတဲ့ တန်ဖိုးတွေကိုပဲ ရိုးရိုး ပြန်ပေးပါတယ်။ ဒါကြောင့် — session တစ်ခုအတွင်း ခွဲဝေထားပေမယ့် အသုံးမပြုဖြစ်တဲ့ နံပါတ်တွေက အဲဒီ session ပြီးဆုံးတဲ့အခါ ပျောက်ဆုံးသွားပြီး — sequence ထဲမှာ “holes” (ကွက်လပ်များ) ဖြစ်ပေါ်စေပါတယ်။

ဒါ့အပြင် — session အများအပြားက မတူညီတဲ့ (distinct) sequence တန်ဖိုးတွေကို ရရှိဖို့ အာမခံထားပေးပေမယ့် — session တွေ အားလုံးကို တစ်ပေါင်းတည်း သုံးသပ်ကြည့်ရင် — တန်ဖိုးတွေက အစဉ်လိုက် မဟုတ်ဘဲ ထွက်နေနိုင်ပါတယ်။ ဥပမာ — `cache` setting က 10 ဆိုရင် — session A က တန်ဖိုး 1..10 ကို reserve လုပ်ပြီး `nextval`=1 ကို ပြန်ပေးကောင်း ပေးနိုင်ပြီး — session A က `nextval`=2 ကို မထုတ်လုပ်ရသေးခင် — session B က တန်ဖိုး 11..20 ကို reserve လုပ်ပြီး `nextval`=11 ကို ပြန်ပေးနိုင်ပါတယ်။ ဒါကြောင့် — `cache` setting က 1 ဆိုရင် `nextval` တန်ဖိုးတွေကို အစဉ်လိုက် (sequentially) ထုတ်ပေးတယ်လို့ လုံခြုံစွာ ယူဆနိုင်ပြီး — `cache` setting က 1 ထက် ကြီးရင်တော့ `nextval` တန်ဖိုးတွေ အားလုံး distinct (တစ်ခုနှင့်တစ်ခု မတူညီ) ဖြစ်တယ်လို့ပဲ ယူဆသင့်ပြီး — သန့်ရှင်းတဲ့ အစဉ်လိုက် ထုတ်ပေးမှုတော့ မဟုတ်ဘူးဆိုတာ သတိထားရပါမယ်။ ဒါ့အပြင် — `last_value` က session တစ်ခုခုက နောက်ဆုံး reserve လုပ်ထားတဲ့ တန်ဖိုးကို ထင်ဟပ်ပြသပါလိမ့်မယ် — အဲဒီတန်ဖိုးကို `nextval` က ပြန်ပေးပြီးသား ဖြစ်ဖြစ် မဟုတ်သေးဘူး ဖြစ်ဖြစ်ပါ။

နောက်ထပ် သတိထားစရာ တစ်ခုကတော့ — အဲဒီလို sequence တစ်ခုပေါ်မှာ execute လုပ်လိုက်တဲ့ `setval` တစ်ခုက — တခြား session တွေက သူတို့ cache လုပ်ထားတဲ့ ကြိုတင်ခွဲဝေထားသော တန်ဖိုးတွေ အကုန်လုံး သုံးကုန်သည်အထိ — သူတို့ သတိထားမိမှာ မဟုတ်ပါဘူး။

## Examples (ဥပမာများ)

`serial` လို့ ခေါ်ပြီး 101 ကနေ စတင်မယ့် ascending sequence တစ်ခုကို ဖန်တီးပါ:

```sql
CREATE SEQUENCE serial START 101;
```

ဒီ sequence ကနေ နောက် နံပါတ်ကို ရွေးထုတ်ပါ:

```sql
SELECT nextval('serial');

 nextval
---------
     101
```

ဒီ sequence ကနေ နောက် နံပါတ်ကို ရွေးထုတ်ပါ:

```sql
SELECT nextval('serial');

 nextval
---------
     102
```

ဒီ sequence ကို `INSERT` command တစ်ခုထဲမှာ အသုံးပြုပါ:

```sql
INSERT INTO distributors VALUES (nextval('serial'), 'nothing');
```

`COPY FROM` လုပ်ပြီးနောက် sequence တန်ဖိုးကို update လုပ်ပါ:

```sql
BEGIN;
COPY distributors FROM 'input_file';
SELECT setval('serial', max(id)) FROM distributors;
END;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE SEQUENCE` က အောက်ပါ ခြွင်းချက်တွေနဲ့အတူ SQL standard နဲ့ ကိုက်ညီပါတယ်:

- နောက် တန်ဖိုးကို ရယူတာက standard ရဲ့ NEXT VALUE FOR expression အစား — nextval() function ကို သုံးပြီး လုပ်ပါတယ်။
- OWNED BY clause က PostgreSQL extension (PostgreSQL မှာပဲ ပါဝင်သည့် ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER SEQUENCE](/docs/postgresql/sql-altersequence), [DROP SEQUENCE](/docs/postgresql/sql-dropsequence)
