---
title: "VACUUM (database ကို သန့်ရှင်းရေး ပြုလုပ်ပြီး space ပြန်လည် ရယူခြင်း)"
description: "VACUUM command က dead tuples (ဖျက်လိုက်သော သို့မဟုတ် update ကြောင့် အသုံးမလိုတော့သော rows) တွေ သိမ်းပိုက်ထားတဲ့ storage ကို ပြန်လည် ရယူပြီး ရွေးချယ်နိုင်တဲ့ analyze ကိုပါ လုပ်ဆောင်ပေးသည် — FULL, FREEZE, VERBOSE, ANALYZE, DISABLE_PAGE_SKIPPING, SKIP_LOCKED, INDEX_CLEANUP, PROCESS_MAIN, PROCESS_TOAST, TRUNCATE, PARALLEL, SKIP_DATABASE_STATS, ONLY_DATABASE_STATS, BUFFER_USAGE_LIMIT option များ၏ အသေးစိတ် ရှင်းလင်းချက်၊ autovacuum၊ transaction ID wraparound နှင့် parallel vacuum အကြောင်း မှတ်စုများ ပါဝင်သည်"
order: 200
source: "https://www.postgresql.org/docs/current/sql-vacuum.html"
status: translated
updated: 2026-09-04
---

## VACUUM (database ကို သန့်ရှင်းရေး ပြုလုပ်ပြီး space ပြန်လည် ရယူခြင်း)

VACUUM — database တစ်ခုကို garbage-collect (အမှိုက် သန့်ရှင်းရေး) လုပ်ပြီး ရွေးချယ်နိုင်တဲ့ analyze ကိုပါ လုပ်ဆောင်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
VACUUM [ ( option [, ...] ) ] [ table_and_columns [, ...] ]

where option can be one of:

    FULL [ boolean ]
    FREEZE [ boolean ]
    VERBOSE [ boolean ]
    ANALYZE [ boolean ]
    DISABLE_PAGE_SKIPPING [ boolean ]
    SKIP_LOCKED [ boolean ]
    INDEX_CLEANUP { AUTO | ON | OFF }
    PROCESS_MAIN [ boolean ]
    PROCESS_TOAST [ boolean ]
    TRUNCATE [ boolean ]
    PARALLEL integer
    SKIP_DATABASE_STATS [ boolean ]
    ONLY_DATABASE_STATS [ boolean ]
    BUFFER_USAGE_LIMIT size

and table_and_columns is:

    [ ONLY ] table_name [ * ] [ ( column_name [, ...] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`VACUUM` က dead tuples (ဖျက်လိုက်သော သို့မဟုတ် update ကြောင့် အသုံးမလိုတော့သော tuples) တွေ သိမ်းပိုက်ထားတဲ့ storage ကို ပြန်လည် ရယူပေးပါတယ်။ ပုံမှန် PostgreSQL လည်ပတ်မှုမှာ — delete လုပ်လိုက်တဲ့ သို့မဟုတ် update တစ်ခုကြောင့် obsolete (အသုံးမလိုတော့) ဖြစ်သွားတဲ့ tuples တွေကို သူတို့ရဲ့ table ကနေ ရုပ်ပိုင်းဆိုင်ရာအရ ဖယ်ရှားမပေးပါဘူး; `VACUUM` တစ်ခု လုပ်ဆောင်တဲ့အထိ သူတို့ ဆက်လက် တည်ရှိနေပါတယ်။ ဒါကြောင့် — အထူးသဖြင့် မကြာခဏ update လုပ်နေတဲ့ tables တွေမှာ — `VACUUM` ကို အခါအားလျော်စွာ လုပ်ဆောင်ဖို့ လိုအပ်ပါတယ်။

`table_and_columns` list မပါဘဲ ဆိုရင် — `VACUUM` က current database ထဲမှာ — current user က vacuum လုပ်ဖို့ permission ရှိတဲ့ — table နဲ့ materialized view တိုင်းကို process လုပ်ပါတယ်။ List တစ်ခုနဲ့ ဆိုရင်တော့ — `VACUUM` က အဲဒီ table(s) တွေကိုပဲ process လုပ်ပါတယ်။

`VACUUM ANALYZE` က ရွေးချယ်ထားတဲ့ table တစ်ခုချင်းစီအတွက် — `VACUUM` တစ်ခုကို လုပ်ဆောင်ပြီးတော့ — `ANALYZE` တစ်ခုကိုပါ လုပ်ဆောင်ပါတယ်။ ဒါက ပုံမှန် ပြုပြင်ထိန်းသိမ်းမှု (routine maintenance) scripts တွေအတွက် အဆင်ပြေတဲ့ ပေါင်းစပ် ပုံစံ တစ်ခု ဖြစ်ပါတယ်။ သူ့ရဲ့ processing အကြောင်း နောက်ထပ် အသေးစိတ်အတွက် [ANALYZE](/docs/postgresql/sql-analyze) ကို ကြည့်ပါ။

သာမန် `VACUUM` (`FULL` မပါဘဲ) က space ကို ပြန်လည် ရယူပြီး — ပြန်လည် အသုံးပြုဖို့ ရနိုင်အောင် လုပ်ပေးရုံသာ လုပ်ပါတယ်။ ဒီ command ပုံစံက — exclusive lock တစ်ခုကို ရယူထားတာ မဟုတ်တာမို့ — table ရဲ့ သာမန် ဖတ်ရှုခြင်းနဲ့ ရေးသားခြင်း (normal reading and writing) တွေနဲ့ အပြိုင် လည်ပတ်နိုင်ပါတယ်။ ဒါပေမယ့် — (အများစုသော အခြေအနေတွေမှာ) ပိုလျှံနေတဲ့ space ကို operating system ဆီ ပြန်မပို့ပါဘူး; အဲဒါကို တူညီတဲ့ table အတွင်းမှာ ပြန်လည် အသုံးပြုဖို့သာ သိမ်းထားပါတယ်။ ဒါ့အပြင် — indexes တွေကို process လုပ်ဖို့ CPUs အများအပြားကို အသုံးချဖို့လည်း ခွင့်ပြုပါတယ်။ ဒီ feature ကို *parallel vacuum* လို့ ခေါ်ပါတယ်။ ဒီ feature ကို disable လုပ်ချင်ရင် — `PARALLEL` option ကို သုံးပြီး parallel workers အရေအတွက်ကို သုညလို့ သတ်မှတ်နိုင်ပါတယ်။ `VACUUM FULL` ကတော့ — table ရဲ့ အကြောင်းအရာ တစ်ခုလုံးကို — ပိုလျှံ space မရှိတဲ့ disk file အသစ် တစ်ခုထဲကို ပြန်ရေး (rewrite) ပြီး — အသုံးမပြုတော့တဲ့ space ကို operating system ဆီ ပြန်ပို့ဖို့ ခွင့်ပြုပါတယ်။ ဒီ ပုံစံက အများကြီး ပိုနှေးပြီး — process လုပ်နေစဉ်အတွင်း table တစ်ခုချင်းစီပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခု လိုအပ်ပါတယ်။

## Parameters (parameter များ)

- **FULL** — “full” vacuum ကို ရွေးချယ်ပါတယ် — space ကို ပိုပြီး ပြန်လည် ရယူနိုင်ပေမယ့် — အချိန် အများကြီး ပိုကြာပြီး — table ကို exclusively lock လုပ်ပါတယ်။ ဒီ method က table ရဲ့ copy အသစ် တစ်ခုကို ရေးပြီး — operation ပြီးမြောက်တဲ့အထိ copy အဟောင်းကို မလွှတ်ပေးတာမို့ — နောက်ထပ် disk space လည်း လိုအပ်ပါတယ်။ ပုံမှန်အားဖြင့် — table ထဲကနေ သိသာတဲ့ space ပမာဏ တစ်ခုကို ပြန်လည် ရယူဖို့ လိုအပ်တဲ့အခါမှသာ ဒါကို အသုံးပြုသင့်ပါတယ်။
- **FREEZE** — Tuples တွေကို aggressive “freezing” လုပ်တာကို ရွေးချယ်ပါတယ်။ `FREEZE` ကို သတ်မှတ်တာက — `vacuum_freeze_min_age` နဲ့ `vacuum_freeze_table_age` parameters တွေကို သုည လို့ သတ်မှတ်ထားတဲ့ VACUUM တစ်ခုကို လုပ်ဆောင်တာနဲ့ ညီမျှပါတယ်။ Table ကို rewrite လုပ်တဲ့အခါ — aggressive freezing ကို အမြဲတမ်း လုပ်ဆောင်တာမို့ — `FULL` ကို သတ်မှတ်ထားတဲ့အခါ ဒီ option က redundant (ထပ်နေသော) ဖြစ်ပါတယ်။
- **VERBOSE** — Table တစ်ခုချင်းစီအတွက် အသေးစိတ် vacuum activity report (လုပ်ဆောင်မှု အစီရင်ခံစာ) တစ်ခုကို INFO level မှာ ရိုက်နှိပ်ပါတယ်။
- **ANALYZE** — Query တစ်ခုကို execute လုပ်ဖို့ အထိရောက်ဆုံး နည်းလမ်းကို ဆုံးဖြတ်ရာမှာ planner က အသုံးပြုတဲ့ statistics တွေကို update လုပ်ပါတယ်။
- **DISABLE_PAGE_SKIPPING** — ပုံမှန်အားဖြင့် — `VACUUM` က visibility map ကို အခြေခံပြီး pages တွေကို skip လုပ်ပါတယ်။ Tuples အားလုံး frozen ဖြစ်နေတယ်လို့ သိရတဲ့ pages တွေကို အမြဲတမ်း skip လုပ်နိုင်ပြီး — tuples အားလုံးကို transactions အားလုံးအတွက် visible (မြင်နိုင်) တယ်လို့ သိရတဲ့ pages တွေကိုတော့ — aggressive vacuum တစ်ခုကို လုပ်ဆောင်နေတဲ့အခါ ကလွဲလို့ — skip လုပ်နိုင်ပါတယ်။ ထို့ပြင် — aggressive vacuum မလုပ်ဆောင်တဲ့အခါ — တခြား sessions တွေ အဲဒီ pages တွေကို အသုံးပြုပြီးစီးတာကို စောင့်ဆိုင်းနေရတာ ရှောင်ဖို့ — pages တချို့ကို skip လုပ်နိုင်ပါတယ်။ ဒီ option က page-skipping အပြုအမူ အားလုံးကို disable လုပ်ပေးပြီး — visibility map ရဲ့ အကြောင်းအရာတွေ သံသယ ဖြစ်စရာ ရှိတဲ့အခါမှသာ အသုံးပြုဖို့ ရည်ရွယ်ပါတယ် — အဲဒီလိုအခြေအနေမျိုးက database corruption (ဒေတာ ပျက်စီးမှု) ဖြစ်စေတဲ့ hardware ဒါမှမဟုတ် software ပြဿနာ တစ်ခုခု ရှိမှသာ ဖြစ်သင့်ပါတယ်။
- **SKIP_LOCKED** — `VACUUM` က relation တစ်ခုပေါ်မှာ အလုပ် စတင်တဲ့အခါ — conflict ဖြစ်နေတဲ့ locks တွေ လွှတ်ပေးခံရတာကို မစောင့်သင့်ဘူးလို့ သတ်မှတ်ပေးပါတယ်: relation တစ်ခုကို မစောင့်ဘဲ ချက်ချင်း lock လုပ်လို့ မရဘူးဆိုရင် — အဲဒီ relation ကို skip လုပ်လိုက်ပါတယ်။ ဒီ option နဲ့တောင် — relation ရဲ့ indexes တွေကို ဖွင့်တဲ့အခါ `VACUUM` က ပိတ်ဆို့မှု (block) ဖြစ်နိုင်သေးတယ်ဆိုတာ သတိပြုပါ။ ထို့ပြင် — `VACUUM ANALYZE` က partitions တွေ၊ table inheritance children တွေနဲ့ foreign tables အမျိုးအစား တချို့ကနေ sample rows တွေ ရယူတဲ့အခါလည်း ပိတ်ဆို့မှု ဖြစ်နိုင်ပါသေးတယ်။ ဒါ့အပြင် — `VACUUM` က သတ်မှတ်ထားတဲ့ partitioned tables တွေရဲ့ partitions တွေ အားလုံးကို ပုံမှန်အားဖြင့် process လုပ်ပေမယ့် — ဒီ option ကြောင့် — partitioned table ပေါ်မှာ conflict ဖြစ်နေတဲ့ lock တစ်ခု ရှိနေရင် — partitions တွေ အားလုံးကို skip သွားစေပါလိမ့်မယ်။
- **INDEX_CLEANUP** — ပုံမှန်အားဖြင့် — table ထဲမှာ dead tuples အလွန် နည်းနေတဲ့အခါ `VACUUM` က index vacuuming ကို skip လုပ်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ — table ရဲ့ indexes အားလုံးကို process လုပ်တဲ့ ကုန်ကျစရိတ်က — dead index tuples တွေကို ဖယ်ရှားခြင်းရဲ့ အကျိုးအမြတ်ထက် — အများကြီး ပိုများနေမယ်လို့ ခန့်မှန်းရလို့ပါ။ ဒီ option ကို — dead tuples အရေအတွက် သုညထက် ပိုများနေတဲ့အခါ indexes တွေကို process လုပ်ဖို့ `VACUUM` ကို အတင်းအကျပ် (force) လုပ်ဖို့ သုံးနိုင်ပါတယ်။ Default က AUTO ဖြစ်ပြီး — သင့်လျော်တဲ့အခါ `VACUUM` က index vacuuming ကို skip လုပ်ခွင့် ပေးပါတယ်။ `INDEX_CLEANUP` ကို ON လို့ သတ်မှတ်ထားရင် — `VACUUM` က indexes တွေကနေ dead tuples အားလုံးကို ရှေးရိုးစွဲ (conservatively) ဖယ်ရှားပါတယ်။ ဒါဟာ — ပုံမှန် အပြုအမူ ဖြစ်ခဲ့တဲ့ — PostgreSQL ရဲ့ အစောပိုင်း releases (version များ) တွေနဲ့ နောက်ပြန် လိုက်ဖက်မှု (backwards compatibility) အတွက် အသုံးဝင်နိုင်ပါတယ်။ `INDEX_CLEANUP` ကို OFF လို့လည်း သတ်မှတ်နိုင်ပြီး — table ထဲမှာ dead tuples အများကြီး ရှိနေတဲ့အခါတောင် — index vacuuming ကို အမြဲတမ်း skip လုပ်ဖို့ `VACUUM` ကို အတင်းအကျပ် လုပ်ပါတယ်။ မဝေးတော့တဲ့ transaction ID wraparound (transaction ID ပြန်ရစ်ခြင်း) ကို ရှောင်ဖို့ — `VACUUM` ကို တတ်နိုင်သမျှ မြန်မြန် run ဖို့ လိုအပ်တဲ့အခါ ဒါက အသုံးဝင်နိုင်ပါတယ် (အပိုင်း 24.1.5 ကို ကြည့်ပါ)။ ဒါပေမယ့် — `vacuum_failsafe_age` က ထိန်းချုပ်ထားတဲ့ wraparound failsafe ယန္တရား (mechanism) က — transaction ID wraparound failure ကို ရှောင်ဖို့ ယေဘုယျအားဖြင့် အလိုအလျောက် trigger ဖြစ်သွားမှာ ဖြစ်လို့ — အဲဒါကိုပဲ ဦးစားပေး သင့်ပါတယ်။ Index cleanup ကို ပုံမှန် မလုပ်ဆောင်ရင် — table ကို ပြုပြင်မွမ်းမံလိုက်တာနဲ့အမျှ — indexes တွေမှာ dead tuples တွေ စုပုံလာပြီး — table ကိုယ်တိုင်မှာလည်း — index cleanup ပြီးမြောက်တဲ့အထိ ဖယ်ရှားလို့ မရတဲ့ dead line pointers တွေ စုပုံလာတာမို့ — performance ထိခိုက်လာနိုင်ပါတယ်။ ဒီ option က index မရှိတဲ့ tables တွေအတွက် သက်ရောက်မှု မရှိဘဲ — `FULL` option ကို သုံးထားရင်လည်း လျစ်လျူရှုပါတယ်။ Transaction ID wraparound failsafe ယန္တရားအပေါ်မှာလည်း သက်ရောက်မှု မရှိပါဘူး — အဲဒါ trigger ဖြစ်တဲ့အခါ — `INDEX_CLEANUP` ကို ON လို့ သတ်မှတ်ထားရင်တောင် — index vacuuming ကို skip လုပ်ပါလိမ့်မယ်။
- **PROCESS_MAIN** — `VACUUM` က main relation ကို process လုပ်ဖို့ ကြိုးစားသင့်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ ဒါက ပုံမှန်အားဖြင့် လိုချင်တဲ့ အပြုအမူ ဖြစ်ပြီး default လည်း ဖြစ်ပါတယ်။ ဒီ option ကို false လို့ သတ်မှတ်တာက — relation တစ်ခုရဲ့ သက်ဆိုင်ရာ TOAST table ကိုပဲ vacuum လုပ်ဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်နိုင်ပါတယ်။
- **PROCESS_TOAST** — `VACUUM` က relation တစ်ခုချင်းစီအတွက် — ရှိရင် — သက်ဆိုင်ရာ TOAST table ကို process လုပ်ဖို့ ကြိုးစားသင့်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ ဒါက ပုံမှန်အားဖြင့် လိုချင်တဲ့ အပြုအမူ ဖြစ်ပြီး default လည်း ဖြစ်ပါတယ်။ ဒီ option ကို false လို့ သတ်မှတ်တာက — main relation ကိုပဲ vacuum လုပ်ဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်နိုင်ပါတယ်။ `FULL` option ကို သုံးတဲ့အခါ ဒီ option က လိုအပ်ပါတယ် (required)။
- **TRUNCATE** — `VACUUM` က table ရဲ့ အဆုံးမှာ ရှိတဲ့ အလွတ် (empty) pages တွေကို ဖြတ်တောက်ပစ်ဖို့ (truncate) ကြိုးစားပြီး — အဲဒီ truncated pages တွေရဲ့ disk space ကို operating system ဆီ ပြန်ပို့ဖို့ ခွင့်ပြုသင့်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ ဒါက ပုံမှန်အားဖြင့် လိုချင်တဲ့ အပြုအမူ ဖြစ်ပြီး — `vacuum_truncate` ကို false လို့ သတ်မှတ်မထားရင် ဒါမှမဟုတ် vacuum လုပ်ရမယ့် table အတွက် vacuum_truncate option ကို false လို့ သတ်မှတ်မထားရင် — default လည်း ဖြစ်ပါတယ်။ ဒီ option ကို false လို့ သတ်မှတ်တာက — truncation က လိုအပ်တဲ့ table ပေါ်က `ACCESS EXCLUSIVE` lock ကို ရှောင်ဖို့ အသုံးဝင်နိုင်ပါတယ်။ `FULL` option ကို သုံးထားရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။
- **PARALLEL** — `integer` background workers တွေကို သုံးပြီး VACUUM ရဲ့ index vacuum နဲ့ index cleanup အဆင့်တွေကို အပြိုင် (parallel) လုပ်ဆောင်ပါတယ် (vacuum အဆင့် (phase) တစ်ခုချင်းစီရဲ့ အသေးစိတ်အတွက် — Table 27.46 ကို ကိုးကားပါ)။ ဒီ operation ကို လုပ်ဆောင်ဖို့ သုံးတဲ့ workers အရေအတွက်က — parallel vacuum ကို ထောက်ပံ့တဲ့ — relation ပေါ်က indexes အရေအတွက်နဲ့ ညီမျှပြီး — သတ်မှတ်ထားရင် — `PARALLEL` option နဲ့ သတ်မှတ်ထားတဲ့ workers အရေအတွက်အားဖြင့် ကန့်သတ်ခံရပြီး — `max_parallel_maintenance_workers` အားဖြင့်လည်း ထပ်ပြီး ကန့်သတ်ခံရပါတယ်။ Index တစ်ခုက — သူ့ရဲ့ size က `min_parallel_index_scan_size` ထက် ပိုကြီးမှသာ — parallel vacuum မှာ ပါဝင်နိုင်ပါတယ်။ `integer` မှာ သတ်မှတ်ထားတဲ့ parallel workers အရေအတွက်ကိုပဲ execution မှာ သုံးမယ်ဆိုတာ အာမခံချက် မရှိဘူးဆိုတာ သတိပြုပါ။ သတ်မှတ်ထားတာထက် workers နည်းနည်းနဲ့ ဒါမှမဟုတ် — workers လုံးဝ မပါဘဲတောင် — vacuum တစ်ခု run လို့ ရပါတယ်။ Index တစ်ခုစီအတွက် worker တစ်ခုပဲ သုံးနိုင်ပါတယ်။ ဒါကြောင့် — table ထဲမှာ indexes အနည်းဆုံး 2 ခု ရှိမှသာ parallel workers တွေကို launch (စတင်) လုပ်ပါတယ်။ Vacuum အတွက် workers တွေကို — အဆင့် (phase) တစ်ခုချင်းစီ မစတင်ခင် launch လုပ်ပြီး — အဆင့်ရဲ့ အဆုံးမှာ ထွက်ခွာပါတယ်။ ဒီ အပြုအမူတွေက နောက်ထပ် release တစ်ခုမှာ ပြောင်းလဲနိုင်ပါတယ်။ ဒီ option ကို `FULL` option နဲ့တွဲပြီး သုံးလို့ မရပါဘူး။
- **SKIP_DATABASE_STATS** — `VACUUM` က — အသက်အကြီးဆုံး unfrozen XIDs (freeze မလုပ်ရသေးတဲ့ XID များ) အကြောင်း — database တစ်ခုလုံး အတိုင်းအတာ (database-wide) statistics တွေ update လုပ်တာကို skip သင့်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် `VACUUM` က ဒီ statistics တွေကို command ရဲ့ အဆုံးမှာ တစ်ကြိမ် update လုပ်ပါတယ်။ ဒါပေမယ့် — tables အရေအတွက် အလွန် များတဲ့ database တစ်ခုမှာ ဒါက အချိန်အတော်ကြာ ကြာနိုင်ပြီး — အသက်အကြီးဆုံး unfrozen XID ပါဝင်ခဲ့တဲ့ table က vacuum လုပ်လိုက်တဲ့ tables တွေထဲမှာ ပါဝင်မှသာ — အကျိုးရှိမှာ ဖြစ်ပါတယ်။ ထို့ပြင် — `VACUUM` commands အများအပြားကို အပြိုင် ထုတ်ပေးနေရင် — တစ်ကြိမ်မှာ တစ်ခုကပဲ database-wide statistics တွေကို update လုပ်နိုင်ပါတယ်။ ဒါကြောင့် — application တစ်ခုက `VACUUM` commands အများကြီးကို ဆက်တိုက် ထုတ်ပေးဖို့ ရည်ရွယ်ထားရင် — အဲဒီ command တွေထဲက နောက်ဆုံး command ကလွဲလို့ ကျန် command တွေ အားလုံးမှာ ဒီ option ကို သတ်မှတ်ထားတာက အထောက်အကူ ဖြစ်နိုင်ပါတယ်; ဒါမှမဟုတ် — command တွေ အားလုံးမှာ သတ်မှတ်ပြီး — နောက်ပိုင်းမှာ `VACUUM (ONLY_DATABASE_STATS)` ကို သပ်သပ်စီ ထုတ်ပေးလည်း ရပါတယ်။
- **ONLY_DATABASE_STATS** — `VACUUM` က — အသက်အကြီးဆုံး unfrozen XIDs အကြောင်း database-wide statistics တွေ update လုပ်တာကလွဲလို့ — ဘာမှ မလုပ်ဘူးလို့ သတ်မှတ်ပေးပါတယ်။ ဒီ option ကို သတ်မှတ်ထားတဲ့အခါ — table_and_columns list က အလွတ် ဖြစ်ရပြီး — `VERBOSE` ကလွဲလို့ တခြား option ဘယ်ဟာကိုမှ enable လုပ်ထားလို့ မရပါဘူး။
- **BUFFER_USAGE_LIMIT** — `VACUUM` အတွက် Buffer Access Strategy ရဲ့ ring buffer size ကို သတ်မှတ်ပေးပါတယ်။ ဒီ size ကို — ဒီ strategy ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ ပြန်လည် အသုံးပြုမယ့် shared buffers အရေအတွက်ကို တွက်ချက်ဖို့ သုံးပါတယ်။ 0 ဆိုရင် Buffer Access Strategy ကို အသုံးပြုမှု ပိတ်လိုက်ပါတယ်။ `ANALYZE` ကိုပါ သတ်မှတ်ထားရင် — `BUFFER_USAGE_LIMIT` တန်ဖိုးကို vacuum ရော analyze အဆင့် နှစ်ခုလုံးအတွက် သုံးပါတယ်။ `ANALYZE` ကိုပါ သတ်မှတ်ထားတာ ကလွဲလို့ — ဒီ option ကို `FULL` option နဲ့တွဲပြီး သုံးလို့ မရပါဘူး။ ဒီ option ကို မသတ်မှတ်ထားရင် — `VACUUM` က `vacuum_buffer_usage_limit` ကနေ တန်ဖိုးကို ယူသုံးပါတယ်။ Setting ပိုမြင့်လေလေ — `VACUUM` ကို ပိုမြန်မြန် run နိုင်လေလေ ဖြစ်ပေမယ့် — သိပ်ကြီးလွန်းတဲ့ setting က — တခြား အသုံးဝင်တဲ့ pages တွေ အများကြီးကို shared buffers ကနေ evict (နှင်ထုတ်) လုပ်ခံရစေနိုင်ပါတယ်။ အနည်းဆုံး တန်ဖိုးက 128 kB ဖြစ်ပြီး — အများဆုံး တန်ဖိုးက 16 GB ဖြစ်ပါတယ်။
- **boolean** — ရွေးချယ်ထားတဲ့ option ကို ဖွင့်မလား ပိတ်မလားဆိုတာ သတ်မှတ်ပေးပါတယ်။ Option ကို ဖွင့်ဖို့ TRUE, ON ဒါမှမဟုတ် 1 ကို ရေးနိုင်ပြီး — ပိတ်ဖို့ FALSE, OFF ဒါမှမဟုတ် 0 ကို ရေးနိုင်ပါတယ်။ Boolean တန်ဖိုးကို ချန်လိုက်လို့လည်း ရပြီး — အဲဒီလိုဆိုရင် TRUE လို့ ယူဆပါတယ်။
- **integer** — ရွေးချယ်ထားတဲ့ option ဆီ ပို့ပေးတဲ့ အနုတ်မဟုတ်တဲ့ (non-negative) integer တန်ဖိုး တစ်ခုကို သတ်မှတ်ပေးပါတယ်။
- **size** — kilobytes နဲ့ ဖော်ပြတဲ့ memory ပမာဏ တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Sizes တွေကို — ဂဏန်း size နောက်မှာ အောက်ပါ memory units တစ်ခုခု လိုက်တဲ့ string တစ်ခုအနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်: B (bytes), kB (kilobytes), MB (megabytes), GB (gigabytes) ဒါမှမဟုတ် TB (terabytes)။
- **table_name** — Vacuum လုပ်ရမယ့် တိကျတဲ့ table တစ်ခု ဒါမှမဟုတ် materialized view တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။ Table နာမည် မတိုင်ခင် `ONLY` ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုကိုပဲ vacuum လုပ်ပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — table နဲ့ သူ့ရဲ့ inheritance child tables (သို့မဟုတ် partitions) (ရှိရင်) အားလုံးကိုပါ vacuum လုပ်ပါတယ်။ Optional အနေနဲ့ — inheritance child tables (သို့မဟုတ် partitions) တွေကိုပါ vacuum လုပ်မယ်ဆိုတာကို အတိအကျ ညွှန်ပြဖို့ — table နာမည်ရဲ့ နောက်မှာ * ကို သတ်မှတ်နိုင်ပါတယ်။
- **column_name** — Analyze လုပ်ရမယ့် တိကျတဲ့ column တစ်ခုရဲ့ နာမည်။ Default အနေနဲ့ columns အားလုံးကို သုံးပါတယ်။ Column list တစ်ခုကို သတ်မှတ်ထားရင် — `ANALYZE` ကိုပါ သတ်မှတ်ရပါမယ်။

## Outputs (output များ)

`VERBOSE` ကို သတ်မှတ်ထားရင် — `VACUUM` က — ဘယ် table ကို လောလောဆယ် process လုပ်နေတယ်ဆိုတာ ညွှန်ပြဖို့ — progress messages တွေကို ထုတ်ပေးပါတယ်။ Tables တွေအကြောင်း statistics အမျိုးမျိုးကိုလည်း ရိုက်နှိပ် ဖော်ပြပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုကို vacuum လုပ်ဖို့ — ပုံမှန်အားဖြင့် — table ပေါ်မှာ `MAINTAIN` privilege ရှိရပါမယ်။ ဒါပေမယ့် — database owners တွေက — shared catalogs တွေ ကလွဲလို့ — သူတို့ရဲ့ databases တွေထဲက tables တွေ အားလုံးကို vacuum လုပ်ခွင့် ရှိပါတယ်။ `VACUUM` က — ခေါ်ယူသုံးစွဲနေတဲ့ user မှာ vacuum လုပ်ဖို့ permission မရှိတဲ့ tables တွေကို skip လုပ်ပါလိမ့်မယ်။

`VACUUM` run နေတုန်းမှာ — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။

`VACUUM` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

GIN indexes ပါတဲ့ tables တွေအတွက် — `VACUUM` (ဘယ်ပုံစံနဲ့ပဲ ဖြစ်ဖြစ်) က — pending index entries တွေကို main GIN index structure ထဲက သင့်လျော်တဲ့ နေရာတွေဆီ ရွှေ့ပြီး — ဆိုင်းငံ့ထားတဲ့ (pending) index insertions တွေကိုပါ ပြီးမြောက်စေပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 65.4.4.1](https://www.postgresql.org/docs/current/gin.html#GIN-FAST-UPDATE) ကို ကြည့်ပါ။

Dead rows တွေကို ဖယ်ရှားဖို့ — databases တွေ အားလုံးကို ပုံမှန် vacuum လုပ်ဖို့ ကျွန်တော်တို့ အကြံပြုပါတယ်။ PostgreSQL မှာ ပုံမှန် vacuum ပြုပြင်ထိန်းသိမ်းမှုကို အလိုအလျောက် လုပ်ဆောင်ပေးနိုင်တဲ့ “autovacuum” facility (ယန္တရား) တစ်ခု ပါဝင်ပါတယ်။ အလိုအလျောက်နဲ့ လက်နဲ့ vacuum လုပ်ခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 24.1](https://www.postgresql.org/docs/current/routine-vacuuming.html) ကို ကြည့်ပါ။

`FULL` option ကို ပုံမှန် အသုံးပြုဖို့ အကြံမပြုပါဘူး — ဒါပေမယ့် အထူး အခြေအနေတွေမှာတော့ အသုံးဝင်နိုင်ပါတယ်။ ဥပမာ — table တစ်ခုထဲက rows အများစုကို ဖျက်လိုက်တာ ဒါမှမဟုတ် update လုပ်လိုက်ပြီး — table ကို ရုပ်ပိုင်းဆိုင်ရာအရ ကျုံ့သွားစေပြီး — disk space ပိုနည်းနည်းနဲ့ သိမ်းပိုက်ကာ — table scans တွေ ပိုမြန်လာစေချင်တဲ့အခါမျိုး ဖြစ်ပါတယ်။ `VACUUM FULL` က သာမန် `VACUUM` တစ်ခုထက် table ကို ပိုပြီး ကျုံ့စေလေ့ ရှိပါတယ်။

`PARALLEL` option ကို vacuum ရည်ရွယ်ချက်တွေအတွက်ပဲ သုံးပါတယ်။ ဒီ option ကို `ANALYZE` option နဲ့တွဲပြီး သတ်မှတ်ထားရင် — `ANALYZE` ကို သက်ရောက်မှု မရှိပါဘူး။

`VACUUM` က I/O traffic (ဒေတာ ဝင်ထွက် အသွားအလာ) ကို သိသိသာသာ တိုးမြင့်စေတာမို့ — တခြား တက်ကြွနေတဲ့ (active) sessions တွေရဲ့ စွမ်းဆောင်ရည်ကို ထိခိုက်စေနိုင်ပါတယ်။ ဒါကြောင့် — cost-based vacuum delay feature (ကုန်ကျစရိတ် အခြေခံတဲ့ vacuum နှောင့်နှေးမှု လုပ်ဆောင်ချက်) ကို အသုံးပြုဖို့ တခါတရံ အကြံပြုလောက်ပါတယ်။ Parallel vacuum အတွက်ဆိုရင် — worker တစ်ခုချင်းစီက — အဲဒီ worker က လုပ်ဆောင်ခဲ့တဲ့ အလုပ်နဲ့ အချိုးကျ — အိပ်စက် (sleep) ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 19.10.2](https://www.postgresql.org/docs/current/runtime-config-vacuum.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST) ကို ကြည့်ပါ။

`FULL` option မပါဘဲ `VACUUM` run နေတဲ့ backend တစ်ခုချင်းစီက — `pg_stat_progress_vacuum` view ထဲမှာ သူ့ရဲ့ progress ကို အစီရင်ခံပါတယ်။ `VACUUM FULL` run နေတဲ့ backends တွေကတော့ — `pg_stat_progress_cluster` view ထဲမှာ သူတို့ရဲ့ progress ကို အစီရင်ခံပါလိမ့်မယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.4.5](https://www.postgresql.org/docs/current/progress-reporting.html#VACUUM-PROGRESS-REPORTING) နဲ့ [အပိုင်း 27.4.2](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

Table တစ်ခုဖြစ်တဲ့ `onek` ကို သန့်ရှင်းဖို့ — optimizer အတွက် analyze လုပ်ပြီး — အသေးစိတ် vacuum activity report တစ်ခုကို ရိုက်နှိပ်ဖို့:

```sql
VACUUM (VERBOSE, ANALYZE) onek;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `VACUUM` statement ဆိုတာ မရှိပါဘူး။

အောက်ပါ syntax ကို PostgreSQL version 9.0 မတိုင်ခင်က သုံးခဲ့ပြီး — အခုထိ ထောက်ပံ့နေဆဲ ဖြစ်ပါတယ်:

```sql
VACUUM [ FULL ] [ FREEZE ] [ VERBOSE ] [ ANALYZE ] [ table_and_columns [, ...] ]
```

ဒီ syntax မှာ — options တွေကို ပြထားတဲ့ အစဉ်အတိုင်း အတိအကျ သတ်မှတ်ရမယ်ဆိုတာ သတိပြုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[vacuumdb](https://www.postgresql.org/docs/current/app-vacuumdb.html), [အပိုင်း 19.10.2](https://www.postgresql.org/docs/current/runtime-config-vacuum.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST), [အပိုင်း 24.1.6](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM), [အပိုင်း 27.4.5](https://www.postgresql.org/docs/current/progress-reporting.html#VACUUM-PROGRESS-REPORTING), [အပိုင်း 27.4.2](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING)
