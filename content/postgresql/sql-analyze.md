---
title: "ANALYZE (table statistics များ စုဆောင်းခြင်း)"
description: "Table များ၏ အကြောင်းအရာများအကြောင်း statistics (စာရင်းအင်း အချက်အလက်များ) ကို စုဆောင်းပြီး pg_statistic system catalog တွင် သိမ်းဆည်းပေးသော ANALYZE command — VERBOSE, SKIP_LOCKED, BUFFER_USAGE_LIMIT option များအသေးစိတ်၊ query planner က statistics များကို အသုံးပြုပုံနှင့် autovacuum ၏ အလိုအလျောက် analyze ပြုလုပ်မှုအကြောင်း ရှင်းလင်းချက်"
order: 181
source: "https://www.postgresql.org/docs/current/sql-analyze.html"
status: translated
updated: 2026-09-04
---

## ANALYZE (table statistics များ စုဆောင်းခြင်း)

ANALYZE — database တစ်ခုအကြောင်း statistics (စာရင်းအင်း အချက်အလက်များ) ကို စုဆောင်းပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ANALYZE [ ( option [, ...] ) ] [ table_and_columns [, ...] ]

where option can be one of:

    VERBOSE [ boolean ]
    SKIP_LOCKED [ boolean ]
    BUFFER_USAGE_LIMIT size

and table_and_columns is:

    [ ONLY ] table_name [ * ] [ ( column_name [, ...] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ANALYZE` က database ထဲက tables တွေရဲ့ အကြောင်းအရာတွေအကြောင်း statistics (စာရင်းအင်း အချက်အလက်များ) တွေကို စုဆောင်းပြီး — ရလဒ်တွေကို [`pg_statistic`](https://www.postgresql.org/docs/current/catalog-pg-statistic.html) system catalog ထဲမှာ သိမ်းဆည်းပေးပါတယ်။ နောက်ပိုင်းမှာ — query planner က ဒီ statistics တွေကို အသုံးပြုပြီး — queries တွေအတွက် စွမ်းဆောင်ရည် အထိရောက်ဆုံး execution plans (လုပ်ဆောင်မှု အစီအစဉ်များ) တွေကို ဆုံးဖြတ်ရာမှာ အထောက်အကူ ပြုပါတယ်။

`table_and_columns` list မပါဘဲ ဆိုရင် — `ANALYZE` က current database ထဲမှာ — current user က analyze လုပ်ဖို့ permission ရှိတဲ့ — table နဲ့ materialized view တိုင်းကို process လုပ်ပါတယ်။ List တစ်ခုနဲ့ ဆိုရင်တော့ — `ANALYZE` က အဲဒီ table(s) တွေကိုပဲ process လုပ်ပါတယ်။ ထို့ပြင် — table တစ်ခုအတွက် column နာမည်တွေရဲ့ list တစ်ခုကိုလည်း ပေးနိုင်ပြီး — အဲဒီလိုဆိုရင် အဲဒီ columns တွေအတွက်သာ statistics တွေကို စုဆောင်းပါတယ်။

## Parameters (parameter များ)

- **VERBOSE** — INFO level မှာ progress messages (လုပ်ဆောင်မှု အခြေအနေ သတင်းစကားများ) ပြသမှုကို ဖွင့်ပေးပါတယ်။
- **SKIP_LOCKED** — `ANALYZE` က relation တစ်ခုပေါ်မှာ အလုပ် စတင်တဲ့အခါ — conflict ဖြစ်နေတဲ့ locks တွေ လွှတ်ပေးခံရတာကို မစောင့်သင့်ဘူးလို့ သတ်မှတ်ပေးပါတယ်: relation တစ်ခုကို မစောင့်ဘဲ ချက်ချင်း lock လုပ်လို့ မရဘူးဆိုရင် — အဲဒီ relation ကို ကျော်လိုက်ပါတယ်။ ဒီ option နဲ့တောင် — relation ရဲ့ indexes တွေကို ဖွင့်တဲ့အခါ ဒါမှမဟုတ် partitions တွေ၊ table inheritance children တွေနဲ့ foreign tables အမျိုးအစား တချို့ကနေ sample rows တွေ ရယူတဲ့အခါ — `ANALYZE` က ပိတ်ဆို့မှု (block) ဖြစ်နိုင်သေးတယ်ဆိုတာ သတိပြုပါ။ ဒါ့အပြင် — `ANALYZE` က သတ်မှတ်ထားတဲ့ partitioned tables တွေရဲ့ partitions တွေ အားလုံးကို ပုံမှန်အားဖြင့် process လုပ်ပေမယ့် — ဒီ option ကြောင့် — partitioned table ပေါ်မှာ conflict ဖြစ်နေတဲ့ lock တစ်ခု ရှိနေရင် — partitions တွေ အားလုံးကို ကျော်သွားစေပါလိမ့်မယ်။
- **BUFFER_USAGE_LIMIT** — `ANALYZE` အတွက် Buffer Access Strategy ရဲ့ ring buffer size ကို သတ်မှတ်ပေးပါတယ်။ ဒီ size ကို — ဒီ strategy ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ ပြန်လည် အသုံးပြုမယ့် shared buffers အရေအတွက်ကို တွက်ချက်ဖို့ သုံးပါတယ်။ 0 ဆိုရင် Buffer Access Strategy ကို အသုံးပြုမှု ပိတ်လိုက်ပါတယ်။ ဒီ option ကို မသတ်မှတ်ထားရင် — `ANALYZE` က vacuum_buffer_usage_limit ကနေ တန်ဖိုးကို ယူသုံးပါတယ်။ Setting ပိုမြင့်လေလေ — `ANALYZE` ကို ပိုမြန်မြန် run နိုင်လေလေ ဖြစ်ပေမယ့် — သိပ်ကြီးလွန်းတဲ့ setting က — တခြား အသုံးဝင်တဲ့ pages တွေ အများကြီးကို shared buffers ကနေ evict (နှင်ထုတ်) လုပ်ခံရစေနိုင်ပါတယ်။ အနည်းဆုံး တန်ဖိုးက 128 kB ဖြစ်ပြီး — အများဆုံး တန်ဖိုးက 16 GB ဖြစ်ပါတယ်။
- **boolean** — ရွေးချယ်ထားတဲ့ option ကို ဖွင့်မလား ပိတ်မလားဆိုတာ သတ်မှတ်ပေးပါတယ်။ Option ကို ဖွင့်ဖို့ TRUE, ON ဒါမှမဟုတ် 1 ကို ရေးနိုင်ပြီး — ပိတ်ဖို့ FALSE, OFF ဒါမှမဟုတ် 0 ကို ရေးနိုင်ပါတယ်။ Boolean တန်ဖိုးကို ချန်လိုက်လို့လည်း ရပြီး — အဲဒီလိုဆိုရင် TRUE လို့ ယူဆပါတယ်။
- **size** — kilobytes နဲ့ ဖော်ပြတဲ့ memory ပမာဏ တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Sizes တွေကို — ဂဏန်း size နောက်မှာ အောက်ပါ memory units တစ်ခုခု လိုက်တဲ့ string တစ်ခုအနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်: B (bytes), kB (kilobytes), MB (megabytes), GB (gigabytes) ဒါမှမဟုတ် TB (terabytes)။
- **table_name** — Analyze လုပ်ရမယ့် တိကျတဲ့ table တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။ မပေးထားရင် — current database ထဲက သာမန် tables တွေ၊ partitioned tables တွေနဲ့ materialized views တွေ အားလုံးကို analyze လုပ်ပါတယ် (ဒါပေမယ့် foreign tables တွေကိုတော့ မလုပ်ပါဘူး)။ Table နာမည် မတိုင်ခင် `ONLY` ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုကိုပဲ analyze လုပ်ပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — table နဲ့ သူ့ရဲ့ inheritance child tables (သို့မဟုတ် partitions) (ရှိရင်) အားလုံးကို analyze လုပ်ပါတယ်။ Optional အနေနဲ့ — inheritance child tables (သို့မဟုတ် partitions) တွေကိုပါ analyze လုပ်မယ်ဆိုတာကို အတိအကျ ညွှန်ပြဖို့ — table နာမည်ရဲ့ နောက်မှာ * ကို သတ်မှတ်နိုင်ပါတယ်။
- **column_name** — Analyze လုပ်ရမယ့် တိကျတဲ့ column တစ်ခုရဲ့ နာမည်။ Default အနေနဲ့ columns အားလုံးကို သုံးပါတယ်။

## Outputs (output များ)

`VERBOSE` ကို သတ်မှတ်ထားရင် — `ANALYZE` က — ဘယ် table ကို လောလောဆယ် process လုပ်နေတယ်ဆိုတာ ညွှန်ပြဖို့ — progress messages တွေကို ထုတ်ပေးပါတယ်။ Tables တွေအကြောင်း statistics အမျိုးမျိုးကိုလည်း ရိုက်နှိပ် ဖော်ပြပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုကို analyze လုပ်ဖို့ — ပုံမှန်အားဖြင့် — table ပေါ်မှာ `MAINTAIN` privilege ရှိရပါမယ်။ ဒါပေမယ့် — database owners တွေက — shared catalogs တွေ ကလွဲလို့ — သူတို့ရဲ့ databases တွေထဲက tables တွေ အားလုံးကို analyze လုပ်ခွင့် ရှိပါတယ်။ `ANALYZE` က — ခေါ်ယူသုံးစွဲနေတဲ့ user မှာ analyze လုပ်ဖို့ permission မရှိတဲ့ tables တွေကို ကျော်လိုက်ပါလိမ့်မယ်။

Foreign tables တွေကို — အတိအကျ ရွေးချယ်လိုက်မှသာ analyze လုပ်ပါတယ်။ Foreign data wrappers တွေ အားလုံးက `ANALYZE` ကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ Table ရဲ့ wrapper က `ANALYZE` ကို မထောက်ပံ့ဘူးဆိုရင် — command က warning တစ်ခု ရိုက်နှိပ်ပြီး ဘာမှ မလုပ်ပါဘူး။

Default PostgreSQL configuration မှာ — autovacuum daemon (နောက်ခံ လုပ်ငန်းစဉ်) ([အပိုင်း 24.1.6](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) ကို ကြည့်ပါ) က — tables တွေကို data တွေနဲ့ ပထမဆုံး ဖြည့်တင်တဲ့အခါ ရော — ပုံမှန် လည်ပတ်မှု အတွင်း ပြောင်းလဲမှုတွေ ဖြစ်လာတာနဲ့အမျှပါ — အလိုအလျောက် analyze လုပ်ပေးတာကို တာဝန်ယူပါတယ်။ Autovacuum ကို ပိတ်ထားတဲ့အခါ — `ANALYZE` ကို အခါအားလျော်စွာ ဖြစ်စေ၊ table တစ်ခုရဲ့ အကြောင်းအရာတွေမှာ ကြီးမားတဲ့ ပြောင်းလဲမှုတွေ လုပ်ပြီးချိန်မှာ ဖြစ်စေ — run ဖို့ ကောင်းပါတယ်။ တိကျတဲ့ statistics တွေက planner ကို — အသင့်တော်ဆုံး query plan ကို ရွေးချယ်ဖို့ ကူညီပေးပြီး — ဒါအားဖြင့် query processing ရဲ့ မြန်နှုန်းကို တိုးတက်စေပါတယ်။ Read-mostly databases (အများစု ဖတ်ရှုရတဲ့ databases) တွေအတွက် သာမန် နည်းဗျူဟာ တစ်ခုကတော့ — အသုံးပြုမှု နည်းတဲ့ အချိန်ကာလမှာ — [`VACUUM`](https://www.postgresql.org/docs/current/sql-vacuum.html) နဲ့ `ANALYZE` ကို တစ်နေ့ တစ်ကြိမ် run တာပါ။ (Update လုပ်ဆောင်မှု ပြင်းထန်နေရင်တော့ ဒါ မလုံလောက်ပါဘူး။)

`ANALYZE` run နေတုန်းမှာ — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။

`ANALYZE` က target table ပေါ်မှာ read lock တစ်ခုကိုပဲ လိုအပ်တာမို့ — table ပေါ်က တခြား non-DDL လုပ်ဆောင်မှုတွေနဲ့ အပြိုင် run လို့ ရပါတယ်။

`ANALYZE` က စုဆောင်းတဲ့ statistics တွေမှာ ပုံမှန်အားဖြင့် — column တစ်ခုချင်းစီထဲက အဖြစ်အများဆုံး တန်ဖိုး တချို့ရဲ့ စာရင်းတစ်ခုနဲ့ — column တစ်ခုချင်းစီထဲက data ရဲ့ အကြမ်းဖျင်း ဖြန့်ဖြူးမှုကို ပြသပေးတဲ့ histogram တစ်ခု ပါဝင်ပါတယ်။ ဒီနှစ်ခုထဲက တစ်ခု ဒါမှမဟုတ် နှစ်ခုလုံးကို — `ANALYZE` က စိတ်ဝင်စားစရာ မဟုတ်ဘူးလို့ ယူဆရင် (ဥပမာ — unique-key column တစ်ခုမှာ common values တွေ မရှိတတ်ပါဘူး) ဒါမှမဟုတ် — column ရဲ့ data type က သင့်လျော်တဲ့ operators တွေကို မထောက်ပံ့ဘူးဆိုရင် — ချန်လှပ်လိုက်နိုင်ပါတယ်။ Statistics တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အခန်း 24](https://www.postgresql.org/docs/current/maintenance.html) မှာ ရှိပါတယ်။

Table ကြီးတွေအတွက် — `ANALYZE` က row တိုင်းကို စစ်ဆေးမယ့်အစား — table ရဲ့ အကြောင်းအရာတွေထဲက ကျပန်း နမူနာ (random sample) တစ်ခုကို ယူပါတယ်။ ဒါက အလွန် ကြီးမားတဲ့ tables တွေကိုတောင် အချိန် အနည်းငယ်အတွင်း analyze လုပ်နိုင်စေပါတယ်။ ဒါပေမယ့် — statistics တွေက အကြမ်းဖျင်းသာ ဖြစ်ပြီး — table ရဲ့ တကယ့် အကြောင်းအရာတွေ မပြောင်းလဲဘဲ နေတာတောင် — `ANALYZE` run တိုင်း နည်းနည်းစီ ပြောင်းလဲနေမယ်ဆိုတာ သတိပြုပါ။ ဒါက [`EXPLAIN`](/docs/postgresql/sql-explain) က ပြသပေးတဲ့ planner ရဲ့ estimated costs တွေမှာ သေးငယ်တဲ့ ပြောင်းလဲမှုတွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။ ရှားပါးတဲ့ အခြေအနေတွေမှာ — ဒီ non-determinism (ကြိုတင် သတ်မှတ်မရနိုင်မှု) က `ANALYZE` run ပြီးနောက်မှာ planner ရဲ့ query plan ရွေးချယ်မှုတွေကို ပြောင်းလဲစေနိုင်ပါတယ်။ ဒါကို ရှောင်ဖို့ — အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း — `ANALYZE` က စုဆောင်းတဲ့ statistics ပမာဏကို မြှင့်တင်ပါ။

Analysis ရဲ့ အတိုင်းအတာကို — [default_statistics_target](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET) configuration variable ကို ချိန်ညှိခြင်းအားဖြင့် ဖြစ်စေ — column တစ်ခုချင်းစီအလိုက် — [`ALTER TABLE ... ALTER COLUMN ... SET STATISTICS`](https://www.postgresql.org/docs/current/sql-altertable.html) နဲ့ per-column statistics target ကို သတ်မှတ်ခြင်းအားဖြင့် ဖြစ်စေ — ထိန်းချုပ်နိုင်ပါတယ်။ Target တန်ဖိုးက — most-common-value list ထဲက entries အများဆုံး အရေအတွက်နဲ့ histogram ထဲက bins အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Default target တန်ဖိုးက 100 ဖြစ်ပေမယ့် — planner ရဲ့ ခန့်မှန်းချက်တွေရဲ့ တိကျမှုကို `ANALYZE` အတွက် ကြာချိန်နဲ့ `pg_statistic` ထဲမှာ သိမ်းပိုက်တဲ့ နေရာ ပမာဏတို့နဲ့ အပြန်အလှန် အလျှော့အတင်း (trade off) လုပ်ဖို့ — အပေါ် အောက် ချိန်ညှိနိုင်ပါတယ်။ အထူးသဖြင့် — statistics target ကို သုည လို့ သတ်မှတ်လိုက်တာက — အဲဒီ column အတွက် statistics စုဆောင်းမှုကို ပိတ်လိုက်တာ ဖြစ်ပါတယ်။ Queries တွေရဲ့ `WHERE`, `GROUP BY` ဒါမှမဟုတ် `ORDER BY` clauses တွေထဲမှာ ဘယ်တော့မှ အသုံးမပြုတဲ့ columns တွေအတွက် ဒါက အသုံးဝင်နိုင်ပါတယ် — အကြောင်းကတော့ planner က ဒီလို columns တွေပေါ်က statistics တွေကို အသုံးပြုစရာ မလိုလို့ပါ။

Analyze လုပ်နေတဲ့ columns တွေထဲက အကြီးဆုံး statistics target က — statistics တွေ ပြင်ဆင်ဖို့ sample လုပ်တဲ့ table rows အရေအတွက်ကို ဆုံးဖြတ်ပေးပါတယ်။ Target ကို မြှင့်လိုက်တာက — `ANALYZE` လုပ်ဖို့ လိုအပ်တဲ့ အချိန်နဲ့ နေရာကို အချိုးကျ (proportionally) တိုးစေပါတယ်။

`ANALYZE` က ခန့်မှန်းပေးတဲ့ တန်ဖိုးတွေထဲက တစ်ခုက — column တစ်ခုချင်းစီထဲမှာ ပေါ်လာတဲ့ distinct values အရေအတွက်ပါ။ Rows တွေရဲ့ အစိတ်အပိုင်း တစ်ခုကိုပဲ စစ်ဆေးတာမို့ — ဒီခန့်မှန်းချက်က ဖြစ်နိုင်တဲ့ statistics target အကြီးဆုံးနဲ့တောင် တခါတရံ အတော်လေး မတိကျနိုင်ပါဘူး။ ဒီ မတိကျမှုက မကောင်းတဲ့ query plans တွေ ဖြစ်စေတယ်ဆိုရင် — ပိုတိကျတဲ့ တန်ဖိုးတစ်ခုကို လက်နဲ့ ဆုံးဖြတ်ပြီး — [`ALTER TABLE ... ALTER COLUMN ... SET (n_distinct = ...)`](https://www.postgresql.org/docs/current/sql-altertable.html) နဲ့ တပ်ဆင်နိုင်ပါတယ်။

Analyze လုပ်နေတဲ့ table မှာ inheritance children တွေ ရှိရင် — `ANALYZE` က statistics အစု နှစ်စု စုဆောင်းပါတယ်: တစ်စုက parent table ရဲ့ rows တွေပေါ်မှာသာ ဖြစ်ပြီး — ဒုတိယတစ်စုက parent table ရော သူ့ရဲ့ children တွေ အားလုံးရဲ့ rows တွေပါ ပါဝင်ပါတယ်။ ဒီ ဒုတိယ statistics အစုက — inheritance tree တစ်ခုလုံးကို process လုပ်တဲ့ queries တွေကို planning လုပ်တဲ့အခါ လိုအပ်ပါတယ်။ ဒါပေမယ့် — autovacuum daemon ကတော့ — အဲဒီ table အတွက် automatic analyze တစ်ခု trigger လုပ်သင့်လားဆိုတာ ဆုံးဖြတ်တဲ့အခါ — parent table ကိုယ်တိုင်အပေါ်က inserts ဒါမှမဟုတ် updates တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါလိမ့်မယ်။ အဲဒီ table ကို ခဲယဉ်းမှ ထည့်သွင်းတာ ဒါမှမဟုတ် update လုပ်တာ ဆိုရင် — `ANALYZE` ကို လက်နဲ့ run မလုပ်ရင် — inheritance statistics တွေ နောက်ဆုံးပေါ် (up to date) ဖြစ်နေမှာ မဟုတ်ပါဘူး။ Default အနေနဲ့ — `ANALYZE` က inheritance child table တစ်ခုချင်းစီရဲ့ statistics တွေကိုလည်း ထပ်ခါထပ်ခါ (recursively) စုဆောင်း update လုပ်ပါတယ်။ ဒါကို ပိတ်ဖို့ `ONLY` keyword ကို အသုံးပြုနိုင်ပါတယ်။

Partitioned tables တွေအတွက် — `ANALYZE` က partitions အားလုံးကနေ rows တွေကို sample လုပ်ပြီး statistics တွေ စုဆောင်းပါတယ်။ Default အနေနဲ့ — `ANALYZE` က partition တစ်ခုချင်းစီရဲ့ statistics တွေကိုလည်း ထပ်ခါထပ်ခါ (recursively) စုဆောင်း update လုပ်ပါတယ်။ ဒါကို ပိတ်ဖို့ `ONLY` keyword ကို အသုံးပြုနိုင်ပါတယ်။

Autovacuum daemon က partitioned tables တွေကို process မလုပ်သလို — children တွေကိုပဲ အမြဲတမ်း ပြုပြင် (modify) နေတယ်ဆိုရင် — inheritance parents တွေကိုလည်း process မလုပ်ပါဘူး။ Table hierarchy ရဲ့ statistics တွေ နောက်ဆုံးပေါ် ဖြစ်နေဖို့ — manual `ANALYZE` ကို အခါအားလျော်စွာ run ဖို့ ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။

Child tables ဒါမှမဟုတ် partitions တွေထဲက တချို့က — `ANALYZE` ကို မထောက်ပံ့တဲ့ foreign data wrappers တွေ ရှိတဲ့ foreign tables တွေ ဆိုရင် — inheritance statistics တွေ စုဆောင်းနေစဉ် အဲဒီ tables တွေကို လျစ်လျူရှုပါတယ်။

Analyze လုပ်နေတဲ့ table က လုံးဝ အလွတ် (empty) ဖြစ်နေရင် — `ANALYZE` က အဲဒီ table အတွက် statistics အသစ်တွေ မှတ်တမ်းတင်မှာ မဟုတ်ပါဘူး။ ရှိပြီးသား statistics တွေ ရှိရင် အဲဒါတွေကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။

`ANALYZE` run နေတဲ့ backend တစ်ခုချင်းစီက — `pg_stat_progress_analyze` view ထဲမှာ သူ့ရဲ့ progress ကို အစီရင်ခံပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.4.1](https://www.postgresql.org/docs/current/progress-reporting.html#ANALYZE-PROGRESS-REPORTING) ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `ANALYZE` statement ဆိုတာ မရှိပါဘူး။

PostgreSQL version 11 မတိုင်ခင် အောက်ပါ syntax ကို သုံးခဲ့ပြီး — အခုထိ ထောက်ပံ့နေဆဲ ဖြစ်ပါတယ်:

```sql
ANALYZE [ VERBOSE ] [ table_and_columns [, ...] ]
```

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html), [vacuumdb](https://www.postgresql.org/docs/current/app-vacuumdb.html), [အပိုင်း 19.10.2](https://www.postgresql.org/docs/current/runtime-config-vacuum.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST), [အပိုင်း 24.1.6](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM), [အပိုင်း 27.4.1](https://www.postgresql.org/docs/current/progress-reporting.html#ANALYZE-PROGRESS-REPORTING)
