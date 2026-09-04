---
title: "EXPLAIN (query တစ်ခု၏ execution plan ကို ပြသခြင်း)"
description: "EXPLAIN command က — SELECT, INSERT, UPDATE, DELETE, MERGE စသည့် statement (query) တစ်ခုအတွက် PostgreSQL planner က ထုတ်ပေးသော execution plan ကို ပြသပေးသည် — ANALYZE, VERBOSE, COSTS, SETTINGS, GENERIC_PLAN, BUFFERS, SERIALIZE, WAL, TIMING, SUMMARY, MEMORY, FORMAT စသော options များ၏ အသေးစိတ် ရှင်းလင်းချက်၊ output formats များနှင့် ဥပမာများ ပါဝင်သည်"
order: 182
source: "https://www.postgresql.org/docs/current/sql-explain.html"
status: translated
updated: 2026-09-04
---

## EXPLAIN (query တစ်ခု၏ execution plan ကို ပြသခြင်း)

EXPLAIN — statement တစ်ခုရဲ့ execution plan ကို ပြသပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
EXPLAIN [ ( option [, ...] ) ] statement

where option can be one of:

    ANALYZE [ boolean ]
    VERBOSE [ boolean ]
    COSTS [ boolean ]
    SETTINGS [ boolean ]
    GENERIC_PLAN [ boolean ]
    BUFFERS [ boolean ]
    SERIALIZE [ { NONE | TEXT | BINARY } ]
    WAL [ boolean ]
    TIMING [ boolean ]
    SUMMARY [ boolean ]
    MEMORY [ boolean ]
    FORMAT { TEXT | XML | JSON | YAML }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

ဒီ command က — ပေးထားတဲ့ statement အတွက် PostgreSQL planner (query plan ရေးဆွဲပေးသည့် စီစဉ်မှု အစိတ်အပိုင်း) က ထုတ်ပေးလိုက်တဲ့ execution plan ကို ပြသပါတယ်။ Execution plan က — statement ထဲမှာ ရည်ညွှန်းထားတဲ့ table(s) တွေကို ဘယ်လို scan လုပ်မယ်ဆိုတာ — သာမန် sequential scan, index scan စတာတွေနဲ့ — ပြသပြီး — table တစ်ခုထက်ပိုပြီး ရည်ညွှန်းထားရင် — input table တစ်ခုချင်းစီကနေ လိုအပ်တဲ့ rows တွေကို ပေါင်းစည်းဖို့ join algorithms (ပေါင်းစပ်မှု အယ်ဂိုရီသမ်များ) ဘယ်ဟာတွေ သုံးမယ်ဆိုတာကိုလည်း ပြသပါတယ်။

ပြသမှုရဲ့ အရေးအပါဆုံး အပိုင်းကတော့ statement ရဲ့ ခန့်မှန်း execution cost (လုပ်ဆောင်မှု ကုန်ကျစရိတ်) ဖြစ်ပါတယ် — အဲဒါက planner ရဲ့ “statement ကို run လုပ်ဖို့ ဘယ်လောက်ကြာမလဲ” ဆိုတဲ့ ခန့်မှန်းချက် ဖြစ်ပြီး — (cost units တွေနဲ့ တိုင်းတာပါတယ်; အဲဒီ units တွေက မသတ်မှတ်ထားပေမယ့် — ပုံမှန်အားဖြင့်တော့ disk page fetch (disk ကနေ page ပြန်ယူခြင်း) တွေကို ရည်ညွှန်းပါတယ်)။ တကယ်တော့ ဂဏန်း နှစ်ခု ပြသပါတယ်: ပထမ row ကို ပြန်မပို့မချင်း ကုန်ကျတဲ့ start-up cost နဲ့ — rows အားလုံးကို ပြန်ပို့ဖို့ လိုအပ်တဲ့ total cost တို့ ဖြစ်ပါတယ်။ Query အများစုအတွက် total cost ကသာ အရေးပါပါတယ် — ဒါပေမယ့် `EXISTS` ထဲက subquery လို အခြေအနေမျိုးတွေမှာတော့ — planner က total cost အသေးဆုံး ဟာကို ရွေးမယ့်အစား start-up cost အသေးဆုံး ဟာကို ရွေးချယ်ပါလိမ့်မယ် (executor က row တစ်ခု ရပြီးတာနဲ့ ရပ်လိုက်မှာ ဖြစ်လို့ပါ)။ ဒါ့အပြင် — `LIMIT` clause နဲ့ ပြန်ပို့ရမယ့် rows အရေအတွက်ကို ကန့်သတ်ထားရင်လည်း — planner က ဘယ် plan က တကယ် အသက်သာဆုံးလဲ ခန့်မှန်းဖို့ — endpoint costs နှစ်ခုကြားမှာ သင့်လျော်တဲ့ interpolation (ကြားဖြတ် တွက်ချက်မှု) တစ်ခုကို လုပ်ပါတယ်။

`ANALYZE` option ကတော့ — statement ကို plan ရေးဆွဲရုံမက — တကယ် execute လုပ်စေပါတယ်။ အဲဒီအခါ — plan node တစ်ခုချင်းစီအတွင်းမှာ ကုန်ဆုံးသွားတဲ့ စုစုပေါင်း elapsed time (milliseconds နဲ့) နဲ့ — အဲဒီ node က တကယ် ပြန်ပို့လိုက်တဲ့ rows အရေအတွက် စတဲ့ — တကယ့် run time statistics တွေကို ပြသမှုထဲမှာ ထည့်ပေးပါတယ်။ Planner ရဲ့ ခန့်မှန်းချက်တွေက လက်တွေ့နဲ့ နီးစပ်မှု ရှိမရှိ ကြည့်ဖို့ ဒါက အသုံးဝင်ပါတယ်။

> **အရေးကြီးသည်:** `ANALYZE` option ကို သုံးတဲ့အခါ — statement ကို တကယ် execute လုပ်တယ်ဆိုတာ သတိပြုထားပါ။ `EXPLAIN` က `SELECT` တစ်ခု ပြန်ပို့မယ့် output ကို ဘာပဲဖြစ်ဖြစ် ဖယ်ရှားပစ်မယ်ဆိုပေမယ့် — statement ရဲ့ တခြား side effects (ဘေးထွက် သက်ရောက်မှုများ) တွေကတော့ ပုံမှန်အတိုင်း ဖြစ်ပေါ်ပါလိမ့်မယ်။ `EXPLAIN ANALYZE` ကို `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `CREATE TABLE AS`, ဒါမှမဟုတ် `EXECUTE` statement တစ်ခုပေါ်မှာ — command က သင့် data တွေကို မထိခိုက်စေဘဲ — သုံးချင်တယ်ဆိုရင် — ဒီနည်းလမ်းကို သုံးပါ:
> 
> ```sql
> BEGIN;
> EXPLAIN ANALYZE ...;
> ROLLBACK;
> ```

## Parameters (parameter များ)

- **ANALYZE** — Command ကို လုပ်ဆောင်ပြီး — တကယ့် run times တွေနဲ့ တခြား statistics တွေကို ပြသပါတယ်။ ဒီ parameter က default အနေနဲ့ FALSE ဖြစ်ပါတယ်။
- **VERBOSE** — Plan နဲ့ ပတ်သက်တဲ့ ထပ်ဆောင်း အချက်အလက်တွေကို ပြသပါတယ်။ အသေးစိတ်ဆိုရင် — plan tree ထဲက node တစ်ခုချင်းစီအတွက် output column list ကို ထည့်သွင်းတာ၊ table နဲ့ function နာမည်တွေကို schema နဲ့ အရည်အချင်း ပြည့်စေတာ (schema-qualify)၊ expressions တွေထဲက variables တွေကို သူတို့ရဲ့ range table alias နဲ့ အမြဲတမ်း label လုပ်တာ၊ နဲ့ — statistics ပြသနေတဲ့ trigger တစ်ခုချင်းစီရဲ့ နာမည်ကို အမြဲတမ်း ရိုက်နှိပ်တာ — တို့ ပါဝင်ပါတယ်။ Query identifier တစ်ခု တွက်ချက်ပြီးသား ဖြစ်ရင်လည်း — အဲဒါကိုပါ ပြသပါလိမ့်မယ်; အသေးစိတ်အတွက် compute_query_id ကို ကြည့်ပါ။ ဒီ parameter က default အနေနဲ့ FALSE ဖြစ်ပါတယ်။
- **COSTS** — Plan node တစ်ခုချင်းစီရဲ့ ခန့်မှန်း startup နဲ့ total cost တွေအပြင် — ခန့်မှန်း rows အရေအတွက်နဲ့ row တစ်ခုချင်းစီရဲ့ ခန့်မှန်း width တို့ရဲ့ အချက်အလက်တွေကို ထည့်သွင်းပါတယ်။ ဒီ parameter က default အနေနဲ့ TRUE ဖြစ်ပါတယ်။
- **SETTINGS** — Configuration parameters တွေအကြောင်း အချက်အလက်တွေကို ထည့်သွင်းပါတယ်။ အသေးစိတ်ဆိုရင် — built-in default value နဲ့ မတူညီတဲ့ တန်ဖိုး ရှိနေတဲ့ — query planning ကို သက်ရောက်မှု ရှိတဲ့ options တွေကို ထည့်သွင်းပါတယ်။ ဒီ parameter က default အနေနဲ့ FALSE ဖြစ်ပါတယ်။
- **GENERIC_PLAN** — Statement ထဲမှာ $1 လို parameter placeholders တွေ ပါဝင်ခွင့် ပြုပြီး — အဲဒီ parameters တွေရဲ့ တန်ဖိုးတွေပေါ်မှာ မမှီခိုတဲ့ generic plan တစ်ခုကို ထုတ်ပေးပါတယ်။ Generic plans တွေအကြောင်းနဲ့ — parameters တွေကို ထောက်ပံ့တဲ့ statement အမျိုးအစားတွေအကြောင်း အသေးစိတ်အတွက် PREPARE ကို ကြည့်ပါ။ ဒီ parameter ကို ANALYZE နဲ့တွဲပြီး သုံးလို့ မရပါဘူး။ ဒါက default အနေနဲ့ FALSE ဖြစ်ပါတယ်။
- **BUFFERS** — Buffer အသုံးပြုမှုအကြောင်း အချက်အလက်တွေကို ထည့်သွင်းပါတယ်။ အသေးစိတ်ဆိုရင် — hit, read, dirtied နဲ့ written ဖြစ်ခဲ့တဲ့ shared blocks အရေအတွက်၊ hit, read, dirtied နဲ့ written ဖြစ်ခဲ့တဲ့ local blocks အရေအတွက်၊ read နဲ့ written ဖြစ်ခဲ့တဲ့ temp blocks အရေအတွက်၊ နဲ့ — track_io_timing ကို enable လုပ်ထားရင် — data file blocks, local blocks နဲ့ temporary file blocks တွေကို ဖတ်ရေးရာမှာ ကုန်ဆုံးတဲ့ အချိန် (milliseconds နဲ့) တို့ ပါဝင်ပါတယ်။ Hit ဆိုတာက — လိုအပ်တဲ့အချိန်မှာ block ကို cache ထဲမှာ ရှိပြီးသား တွေ့ရှိလို့ — read (ဖတ်ခြင်း) တစ်ခုကို ရှောင်နိုင်ခဲ့တာကို ဆိုလိုပါတယ်။ Shared blocks တွေက သာမန် tables နဲ့ indexes တွေရဲ့ data တွေကို ပါဝင်စေပြီး — local blocks တွေက temporary tables နဲ့ indexes တွေရဲ့ data တွေကို ပါဝင်စေကာ — temporary blocks တွေကတော့ sorts, hashes, Materialize plan nodes နဲ့ အလားတူ ကိစ္စတွေမှာ သုံးတဲ့ ကာလတို အလုပ်လုပ် data တွေကို ပါဝင်စေပါတယ်။ Dirtied ဖြစ်တဲ့ blocks အရေအတွက်က — ဒီ query က ပြောင်းလဲလိုက်တဲ့ — အရင်က မပြုပြင်ရသေးတဲ့ blocks အရေအတွက်ကို ညွှန်ပြပြီး — written ဖြစ်တဲ့ blocks အရေအတွက်ကတော့ — query လုပ်ဆောင်နေစဉ်အတွင်း ဒီ backend က cache ကနေ ထုတ်ပစ်လိုက်တဲ့ — အရင်က dirtied ဖြစ်ခဲ့တဲ့ blocks အရေအတွက်ကို ညွှန်ပြပါတယ်။ အပေါ်အဆင့် (upper-level) node တစ်ခုအတွက် ပြသထားတဲ့ blocks အရေအတွက်ထဲမှာ — သူ့ရဲ့ child nodes တွေ အားလုံး သုံးခဲ့တဲ့ blocks တွေလည်း ပါဝင်ပါတယ်။ Text format မှာတော့ — zero မဟုတ်တဲ့ (non-zero) တန်ဖိုးတွေကိုပဲ ရိုက်နှိပ်ပါတယ်။ ANALYZE သုံးတဲ့အခါ Buffers အချက်အလက်ကို အလိုအလျောက် ထည့်သွင်းပေးပါတယ်။
- **SERIALIZE** — Query ရဲ့ output data ကို serialize (စာသား ဒါမှမဟုတ် binary format အဖြစ် ပြောင်းလဲပြီး client ဆီ ပို့ဖို့ ပြင်ဆင်ခြင်း) လုပ်ရတဲ့ cost အကြောင်း အချက်အလက်တွေကို ထည့်သွင်းပါတယ်။ Datatype output functions တွေ ကုန်ကျစရိတ် ကြီးတယ်ဆိုရင် ဒါမှမဟုတ် — TOASTed values တွေကို out-of-line storage ကနေ ပြန်ယူရတယ်ဆိုရင် — ဒါက query ကို ပုံမှန် execute လုပ်ရာမှာ လိုအပ်တဲ့ အချိန်ရဲ့ သိသာတဲ့ အစိတ်အပိုင်း တစ်ခု ဖြစ်သွားနိုင်ပါတယ်။ EXPLAIN ရဲ့ default အပြုအမူဖြစ်တဲ့ SERIALIZE NONE ကတော့ ဒီ conversions တွေကို မလုပ်ဆောင်ပါဘူး။ SERIALIZE TEXT ဒါမှမဟုတ် SERIALIZE BINARY ကို သတ်မှတ်ထားရင် — သင့်လျော်တဲ့ conversions တွေကို လုပ်ဆောင်ပြီး — အဲဒါအတွက် ကုန်ဆုံးတဲ့ အချိန်ကိုပါ တိုင်းတာပါတယ် (TIMING OFF လို့ သတ်မှတ်ထားရင်ကလွဲလို့)။ BUFFERS option ကိုပါ သတ်မှတ်ထားရင် — conversions တွေမှာ ပါဝင်တဲ့ buffer accesses တွေကိုပါ ရေတွက်ပါတယ်။ ဒါပေမယ့် — ဘယ်အခြေအနေမှာမဆို — EXPLAIN က ရလာတဲ့ data ကို client ဆီ တကယ် ပို့မပေးပါဘူး; ဒါကြောင့် network transmission costs တွေကိုတော့ ဒီနည်းနဲ့ စူးစမ်းလို့ မရပါဘူး။ Serialization ကို ANALYZE ပါ enable လုပ်ထားမှသာ ခွင့်ပြုပါတယ်။ SERIALIZE ကို argument မပါဘဲ ရေးထားရင် TEXT လို့ ယူဆပါတယ်။
- **WAL** — WAL record ထုတ်လုပ်မှုအကြောင်း အချက်အလက်တွေကို ထည့်သွင်းပါတယ်။ အသေးစိတ်ဆိုရင် — records အရေအတွက်၊ full page images (fpi) အရေအတွက်၊ bytes နဲ့ ထုတ်ပေးလိုက်တဲ့ WAL ပမာဏ နဲ့ — WAL buffers တွေ ပြည့်သွားတဲ့ အကြိမ်အရေအတွက် တို့ ပါဝင်ပါတယ်။ Text format မှာတော့ — zero မဟုတ်တဲ့ တန်ဖိုးတွေကိုပဲ ရိုက်နှိပ်ပါတယ်။ ဒီ parameter ကို ANALYZE ပါ enable လုပ်ထားမှသာ သုံးနိုင်ပါတယ်။ ဒါက default အနေနဲ့ FALSE ဖြစ်ပါတယ်။
- **TIMING** — Output ထဲမှာ တကယ့် startup time နဲ့ node တစ်ခုချင်းစီမှာ ကုန်ဆုံးတဲ့ အချိန်တွေကို ထည့်သွင်းပါတယ်။ System clock ကို ထပ်ခါတလဲလဲ ဖတ်ရတဲ့ overhead က — စနစ်တချို့မှာ query ကို သိသိသာသာ နှေးကွေးစေနိုင်တာမို့ — တိကျတဲ့ အချိန်တွေ မဟုတ်ဘဲ — တကယ့် row counts တွေပဲ လိုအပ်တဲ့အခါ — ဒီ parameter ကို FALSE လို့ သတ်မှတ်တာ အသုံးဝင်နိုင်ပါတယ်။ Statement တစ်ခုလုံးရဲ့ run time ကိုတော့ — node-level timing ကို ဒီ option နဲ့ ပိတ်ထားရင်တောင် — အမြဲတမ်း တိုင်းတာပါတယ်။ ဒီ parameter ကို ANALYZE ပါ enable လုပ်ထားမှသာ သုံးနိုင်ပါတယ်။ ဒါက default အနေနဲ့ TRUE ဖြစ်ပါတယ်။
- **SUMMARY** — Query plan ရဲ့ နောက်မှာ summary အချက်အလက်တွေ (ဥပမာ — စုစုပေါင်း timing အချက်အလက်) ကို ထည့်သွင်းပါတယ်။ Summary အချက်အလက်ကို — ANALYZE သုံးတဲ့အခါ default အနေနဲ့ ထည့်သွင်းပြီး — တခြား အခြေအနေတွေမှာတော့ default အနေနဲ့ မထည့်သွင်းဘဲ — ဒီ option ကို သုံးပြီး enable လုပ်နိုင်ပါတယ်။ EXPLAIN EXECUTE ထဲက planning time မှာ — plan ကို cache ကနေ ယူဖို့ လိုအပ်တဲ့ အချိန်နဲ့ — လိုအပ်ရင် re-planning (ပြန်လည် စီစဉ်ခြင်း) အတွက် လိုအပ်တဲ့ အချိန်တို့ ပါဝင်ပါတယ်။
- **MEMORY** — Query planning phase ရဲ့ memory (မှတ်ဉာဏ်) သုံးစွဲမှုအကြောင်း အချက်အလက်တွေကို ထည့်သွင်းပါတယ်။ အသေးစိတ်ဆိုရင် — planner ရဲ့ in-memory structures တွေက သုံးထားတဲ့ တိကျတဲ့ သိုလှောင်မှု ပမာဏအပြင် — allocation overhead ပါ ထည့်တွက်ထားတဲ့ စုစုပေါင်း memory တို့ ပါဝင်ပါတယ်။ ဒီ parameter က default အနေနဲ့ FALSE ဖြစ်ပါတယ်။
- **FORMAT** — Output format ကို သတ်မှတ်ပါတယ် — TEXT, XML, JSON, ဒါမှမဟုတ် YAML ဖြစ်နိုင်ပါတယ်။ Non-text output တွေမှာ text output format နဲ့ အတူတူပဲ အချက်အလက်တွေ ပါဝင်ပေမယ့် — programs တွေ parse လုပ်ဖို့ ပိုလွယ်ကူပါတယ်။ ဒီ parameter က default အနေနဲ့ TEXT ဖြစ်ပါတယ်။
- **boolean** — ရွေးချယ်ထားတဲ့ option ကို ဖွင့်မလား ပိတ်မလား သတ်မှတ်ပါတယ်။ Option ကို enable လုပ်ဖို့ TRUE, ON, ဒါမှမဟုတ် 1 လို့ ရေးနိုင်ပြီး — disable လုပ်ဖို့ FALSE, OFF, ဒါမှမဟုတ် 0 လို့ ရေးနိုင်ပါတယ်။ Boolean value ကို ချန်လိုက်လို့လည်း ရပါတယ် — အဲဒီအခါ TRUE လို့ ယူဆပါတယ်။
- **statement** — SELECT, INSERT, UPDATE, DELETE, MERGE, VALUES, EXECUTE, DECLARE, CREATE TABLE AS, ဒါမှမဟုတ် CREATE MATERIALIZED VIEW AS statement တစ်ခုခု ဖြစ်ပြီး — ဘယ်ဟာရဲ့ execution plan ကို ကြည့်ချင်တာပဲ ဖြစ်ပါတယ်။

## Outputs (output များ)

Command ရဲ့ ရလဒ်က — `statement` အတွက် ရွေးချယ်လိုက်တဲ့ plan ရဲ့ — execution statistics တွေနဲ့ ဆန္ဒရှိရင် မှတ်ချက်ပြု ထည့်သွင်းထားနိုင်တဲ့ — စာသား ဖော်ပြချက် တစ်ခု ဖြစ်ပါတယ်။ ပေးအပ်လိုက်တဲ့ အချက်အလက်တွေကို [အပိုင်း 14.1](/docs/postgresql/using-explain) မှာ ဖော်ပြထားပါတယ်။

## Notes (မှတ်စုများ)

PostgreSQL query planner က — query တွေကို optimize လုပ်တဲ့အခါ ကျိုးကြောင်းဆီလျော်စွာ အသိပေးချက် ရှိစေဖို့အတွက် — query ထဲမှာ သုံးထားတဲ့ tables တွေ အားလုံးရဲ့ [`pg_statistic`](https://www.postgresql.org/docs/current/catalog-pg-statistic.html) data က up-to-date ဖြစ်နေသင့်ပါတယ်။ ပုံမှန်အားဖြင့် [autovacuum daemon](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) က အဲဒါကို အလိုအလျောက် ဂရုစိုက်ပေးပါလိမ့်မယ်။ ဒါပေမယ့် — table တစ်ခုရဲ့ contents တွေမှာ မကြာသေးခင်က သိသာတဲ့ ပြောင်းလဲမှုတွေ ရှိခဲ့ရင်တော့ — autovacuum က အပြောင်းအလဲတွေနဲ့ လိုက်မီအောင် စောင့်နေမယ့်အစား — [`ANALYZE`](/docs/postgresql/sql-analyze) ကို ကိုယ်တိုင် run လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

Execution plan ထဲက node တစ်ခုချင်းစီရဲ့ run-time cost ကို တိုင်းတာဖို့ — `EXPLAIN ANALYZE` ရဲ့ လက်ရှိ implementation က query execution ပေါ်မှာ profiling overhead ကို ထပ်ဖြည့်ပေးပါတယ်။ ရလဒ်အနေနဲ့ — query တစ်ခုပေါ်မှာ `EXPLAIN ANALYZE` ကို run လုပ်တာက — query ကို ပုံမှန် execute လုပ်တာထက် — တစ်ခါတစ်ရံ သိသိသာသာ ပိုကြာနိုင်ပါတယ်။ Overhead ပမာဏက query ရဲ့ သဘောသဘာဝအပြင် — သုံးနေတဲ့ platform ပေါ်မှာလည်း မူတည်ပါတယ်။ အဆိုးဆုံး အခြေအနေကတော့ — execution တစ်ကြိမ်ချင်းစီအတွက် သူတို့ဘာသာ အချိန် အလွန်နည်းနည်းပဲ လိုအပ်တဲ့ plan nodes တွေမှာ ဖြစ်ပြီး — time of day (နေ့အချိန်) ကို ရယူဖို့ အတော်လေး နှေးကွေးတဲ့ operating system calls တွေ ရှိတဲ့ machines တွေပေါ်မှာ ဖြစ်တတ်ပါတယ်။

## Examples (ဥပမာများ)

`integer` column တစ်ခုတည်းနဲ့ rows 10000 ပါတဲ့ table တစ်ခုပေါ်က ရိုးရှင်းတဲ့ query တစ်ခုရဲ့ plan ကို ပြသဖို့:

```sql
EXPLAIN SELECT * FROM foo;

                       QUERY PLAN
---------------------------------------------------------
 Seq Scan on foo  (cost=0.00..155.00 rows=10000 width=4)
(1 row)
```

ဒီမှာတော့ — တူညီတဲ့ query ကိုပဲ JSON output formatting နဲ့ ပြသထားတာပါ:

```sql
EXPLAIN (FORMAT JSON) SELECT * FROM foo;
           QUERY PLAN
--------------------------------
 [                             +
   {                           +
     "Plan": {                 +
       "Node Type": "Seq Scan",+
       "Relation Name": "foo", +
       "Alias": "foo",         +
       "Startup Cost": 0.00,   +
       "Total Cost": 155.00,   +
       "Plan Rows": 10000,     +
       "Plan Width": 4         +
     }                         +
   }                           +
 ]
(1 row)
```

Index တစ်ခု ရှိပြီး — index သုံးလို့ရတဲ့ (indexable) `WHERE` condition ပါတဲ့ query တစ်ခုကို သုံးမယ်ဆိုရင် — `EXPLAIN` က မတူညီတဲ့ plan တစ်ခုကို ပြသလာနိုင်ပါတယ်:

```sql
EXPLAIN SELECT * FROM foo WHERE i = 4;

                         QUERY PLAN
--------------------------------------------------------------
 Index Scan using fi on foo  (cost=0.00..5.98 rows=1 width=4)
   Index Cond: (i = 4)
(2 rows)
```

ဒီမှာတော့ — တူညီတဲ့ query ကိုပဲ YAML format နဲ့ ပြသထားတာပါ:

```sql
EXPLAIN (FORMAT YAML) SELECT * FROM foo WHERE i='4';
          QUERY PLAN
-------------------------------
 - Plan:                      +
     Node Type: "Index Scan"  +
     Scan Direction: "Forward"+
     Index Name: "fi"         +
     Relation Name: "foo"     +
     Alias: "foo"             +
     Startup Cost: 0.00       +
     Total Cost: 5.98         +
     Plan Rows: 1             +
     Plan Width: 4            +
     Index Cond: "(i = 4)"
(1 row)
```

XML format ကတော့ — စာဖတ်သူ ကိုယ်တိုင် စမ်းသပ် လေ့ကျင့်ကြည့်ဖို့ ချန်ထားလိုက်ပါတယ်။

ဒီမှာတော့ — တူညီတဲ့ plan ကိုပဲ cost estimates တွေ ဖျောက်ထားပြီး ပြသထားတာပါ:

```sql
EXPLAIN (COSTS FALSE) SELECT * FROM foo WHERE i = 4;

        QUERY PLAN
----------------------------
 Index Scan using fi on foo
   Index Cond: (i = 4)
(2 rows)
```

Aggregate function (စုစည်းမှု လုပ်ဆောင်ချက်) တစ်ခုကို သုံးထားတဲ့ query တစ်ခုအတွက် query plan ရဲ့ ဥပမာတစ်ခုပါ:

```sql
EXPLAIN SELECT sum(i) FROM foo WHERE i < 10;

                             QUERY PLAN
-------------------------------------------------------------------​--
 Aggregate  (cost=23.93..23.93 rows=1 width=4)
   ->  Index Scan using fi on foo  (cost=0.00..23.92 rows=6 width=4)
         Index Cond: (i < 10)
(3 rows)
```

Prepared query (ကြိုတင် ပြင်ဆင်ထားတဲ့ query) တစ်ခုရဲ့ execution plan ကို ပြသဖို့ — `EXPLAIN EXECUTE` ကို သုံးထားတဲ့ ဥပမာတစ်ခုပါ:

```sql
PREPARE query(int, int) AS SELECT sum(bar) FROM test
    WHERE id > $1 AND id < $2
    GROUP BY foo;

EXPLAIN ANALYZE EXECUTE query(100, 200);

                                                       QUERY PLAN
-------------------------------------------------------------------​------------------------------------------------------
 HashAggregate  (cost=10.77..10.87 rows=10 width=12) (actual time=0.043..0.044 rows=10.00 loops=1)
   Group Key: foo
   Batches: 1  Memory Usage: 24kB
   Buffers: shared hit=4
   ->  Index Scan using test_pkey on test  (cost=0.29..10.27 rows=99 width=8) (actual time=0.009..0.025 rows=99.00 loops=1)
         Index Cond: ((id > 100) AND (id < 200))
         Index Searches: 1
         Buffers: shared hit=4
 Planning Time: 0.244 ms
 Execution Time: 0.073 ms
(10 rows)
```

ဒီနေရာမှာ ပြထားတဲ့ တိကျတဲ့ ဂဏန်းတွေက — ပါဝင်ပတ်သက်နေတဲ့ tables တွေရဲ့ တကယ့် contents တွေပေါ်မှာ မူတည်တာ သေချာပါတယ်။ ဒါ့အပြင် — planner တိုးတက်မှုတွေကြောင့် — ဂဏန်းတွေတင် မကဘဲ ရွေးချယ်လိုက်တဲ့ query strategy ကိုယ်တိုင်တောင် — PostgreSQL releases (version များ) အကြားမှာ ကွဲပြားနိုင်တာ သတိပြုပါ။ ထို့ပြင် — `ANALYZE` command က data statistics တွေကို ခန့်မှန်းဖို့ random sampling (ကျပန်း နမူနာယူခြင်း) ကို သုံးတာမို့ — table ထဲက data တွေရဲ့ တကယ့် ဖြန့်ဖြူးမှု (distribution) မပြောင်းလဲဘူးဆိုရင်တောင် — `ANALYZE` အသစ် တစ်ခါ run ပြီးတိုင်း cost estimates တွေ ပြောင်းလဲသွားဖို့ ဖြစ်နိုင်ပါတယ်။

အပေါ်က ဥပမာက — `EXECUTE` ထဲမှာ ပေးထားတဲ့ တိကျတဲ့ parameter values တွေအတွက် — “custom” plan တစ်ခုကို ပြသခဲ့တာ သတိပြုပါ။ Parameterized query (parameter တွေ ပါတဲ့ query) တစ်ခုရဲ့ generic plan ကိုလည်း ကြည့်ချင်ပေမည် — `GENERIC_PLAN` ကို သုံးပြီး အဲဒါကို လုပ်နိုင်ပါတယ်:

```sql
EXPLAIN (GENERIC_PLAN)
  SELECT sum(bar) FROM test
    WHERE id > $1 AND id < $2
    GROUP BY foo;

                                  QUERY PLAN
-------------------------------------------------------------------​------------
 HashAggregate  (cost=26.79..26.89 rows=10 width=12)
   Group Key: foo
   ->  Index Scan using test_pkey on test  (cost=0.29..24.29 rows=500 width=8)
         Index Cond: ((id > $1) AND (id < $2))
(4 rows)
```

ဒီကိစ္စမှာ — parser က `$1` နဲ့ `$2` တွေက `id` နဲ့ data type တူညီသင့်တယ်ဆိုတာကို မှန်ကန်စွာ ကောက်ချက်ချနိုင်ခဲ့လို့ — `PREPARE` ကနေ parameter type အချက်အလက် မရရှိတာက ပြဿနာ မဖြစ်ခဲ့ပါဘူး။ တခြား အခြေအနေတွေမှာတော့ — parameter symbols တွေအတွက် types တွေကို အတိအကျ သတ်မှတ်ပေးဖို့ လိုအပ်နိုင်ပါတယ် — ဥပမာ — သူတို့ကို cast (type ပြောင်းလဲခြင်း) လုပ်ခြင်းအားဖြင့် လုပ်နိုင်ပါတယ်:

```sql
EXPLAIN (GENERIC_PLAN)
  SELECT sum(bar) FROM test
    WHERE id > $1::integer AND id < $2::integer
    GROUP BY foo;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာတော့ `EXPLAIN` statement လို့ သတ်မှတ်ထားတာ မရှိပါဘူး။

အောက်ပါ syntax ကို PostgreSQL version 9.0 မတိုင်ခင်က သုံးခဲ့ပြီး — အခုထိ ထောက်ပံ့နေဆဲ ဖြစ်ပါတယ်:

```sql
EXPLAIN [ ANALYZE ] [ VERBOSE ] statement
```

ဒီ syntax မှာ — options တွေကို ပြထားတဲ့ အစဉ်အတိုင်း အတိအကျ သတ်မှတ်ရမယ်ဆိုတာ သတိပြုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ANALYZE](/docs/postgresql/sql-analyze)

