---
title: "CREATE PUBLICATION (publication အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Logical replication (ယုတ္တိ ပုံတူပွားမှု) အတွက် publication (ထုတ်ဝေမှု) အသစ်တစ်ခုကို သတ်မှတ်ပေးသည့် command — FOR TABLE / FOR ALL TABLES / FOR TABLES IN SCHEMA ဖြင့် publish လုပ်မည့် table များကို ရွေးချယ်နိုင်ပြီး column list နှင့် row filter (WHERE clause) များပါ သတ်မှတ်နိုင်; WITH clause ဖြင့် publish လုပ်မည့် DML operations များ (insert/update/delete/truncate) အပါအဝင် publish_generated_columns, publish_via_partition_root စသော publication parameters များကိုလည်း သတ်မှတ်နိုင်"
order: 319
source: "https://www.postgresql.org/docs/current/sql-createpublication.html"
status: translated
updated: 2026-09-04
---

## CREATE PUBLICATION (publication အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE PUBLICATION — publication (ထုတ်ဝေမှု) အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE PUBLICATION name
    [ FOR ALL TABLES
      | FOR publication_object [, ... ] ]
    [ WITH ( publication_parameter [= value] [, ... ] ) ]

where publication_object is one of:

    TABLE table_and_columns [, ... ]
    TABLES IN SCHEMA { schema_name | CURRENT_SCHEMA } [, ... ]

and table_and_columns is:

    [ ONLY ] table_name [ * ] [ ( column_name [, ... ] ) ] [ WHERE ( expression ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE PUBLICATION` က — လက်ရှိ database ထဲကို publication အသစ်တစ်ခု ထပ်ပေါင်းပေးပါတယ်။ Publication ရဲ့ နာမည်က — လက်ရှိ database ထဲက တည်ရှိပြီးသား publication တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။

Publication ဆိုတာ — အခြေခံအားဖြင့် — data အပြောင်းအလဲတွေကို logical replication (ယုတ္တိ ပုံတူပွားမှု) ကနေတစ်ဆင့် replicate (ပုံတူပွား) လုပ်ဖို့ ရည်ရွယ်ထားတဲ့ — table တစ်စု ဖြစ်ပါတယ်။ Publications တွေ logical replication setup ထဲမှာ ဘယ်လို နေရာယူလဲဆိုတဲ့ အသေးစိတ်တွေအတွက် [အပိုင်း 29.1](https://www.postgresql.org/docs/current/logical-replication-publication.html) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — Publication အသစ်ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **FOR TABLE** — Publication ထဲကို ထပ်ပေါင်းမယ့် tables တွေရဲ့ စာရင်းကို သတ်မှတ်ပါတယ်။ Table နာမည် ရှေ့မှာ ONLY ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုတည်းကိုပဲ publication ထဲကို ထပ်ပေါင်းပါတယ်။ ONLY ကို မသတ်မှတ်ထားရင် — table ရော ၎င်းရဲ့ descendant tables (ဆင်းသက်လာသော tables) အားလုံးပါ (ရှိရင်) ထပ်ပေါင်းပါတယ်။ Optional အနေနဲ့ — table နာမည် နောက်မှာ * ကို သတ်မှတ်ပြီး — descendant tables တွေ ပါဝင်တယ်ဆိုတာကို ရှင်းလင်းစွာ ညွှန်ပြနိုင်ပါတယ်။ ဒါပေမယ့် — ဒါက partitioned table တစ်ခုအတွက်တော့ သက်ရောက်မှု မရှိပါဘူး။ Partitioned table တစ်ခုရဲ့ partitions တွေကို — publication ရဲ့ အစိတ်အပိုင်းအဖြစ် — အမြဲတမ်း သွယ်ဝိုက် (implicitly) ယူဆတာကြောင့် — သူတို့ကို publication ထဲကို ဘယ်တော့မှ ရှင်းလင်းစွာ (explicitly) ထပ်ပေါင်းစရာ မလိုပါဘူး။
Optional ဖြစ်တဲ့ WHERE clause ကို သတ်မှတ်ထားရင် — ၎င်းက row filter expression (row စစ်ထုတ်မှု ဖော်ပြချက်) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Expression က false သို့မဟုတ် null လို့ အကဲဖြတ်တဲ့ rows တွေကို publish (ထုတ်ဝေ) လုပ်မှာ မဟုတ်ပါဘူး။ Expression ပတ်လည်မှာ parentheses တွေ လိုအပ်တာ သတိပြုပါ။ ၎င်းက TRUNCATE commands တွေအပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။
Column list တစ်ခု သတ်မှတ်ထားတဲ့အခါ — နာမည်ပေးထားတဲ့ columns တွေကိုပဲ replicate လုပ်ပါတယ်။ Column list ထဲမှာ stored generated columns တွေလည်း ပါဝင်နိုင်ပါတယ်။ Column list ကို ချန်လိုက်ရင် — publication က — non-generated columns (generated မဟုတ်တဲ့ columns) အားလုံးကို (နောင်မှာ ထပ်ပေါင်းလာမယ့်တွေ အပါအဝင်) default အနေနဲ့ replicate လုပ်ပါလိမ့်မယ်။ publish_generated_columns ကို stored လို့ သတ်မှတ်ထားရင် — stored generated columns တွေကိုလည်း replicate လုပ်နိုင်ပါတယ်။ Column list တစ်ခု သတ်မှတ်တာက TRUNCATE commands တွေအပေါ်မှာ သက်ရောက်မှု မရှိပါဘူး။ Column lists တွေအကြောင်း အသေးစိတ်အတွက် အပိုင်း 29.5 ကို ကြည့်ပါ။
Persistent base tables (အမြဲတည်မြဲနေသော base tables) နဲ့ partitioned tables တွေပဲ publication ရဲ့ အစိတ်အပိုင်း ဖြစ်နိုင်ပါတယ်။ Temporary tables, unlogged tables, foreign tables, materialized views နဲ့ regular views တွေကတော့ publication ရဲ့ အစိတ်အပိုင်း ဖြစ်လို့ မရပါဘူး။
Publication က FOR TABLES IN SCHEMA ကိုပါ publish လုပ်နေချိန်မှာ column list တစ်ခု သတ်မှတ်တာကိုတော့ ထောက်ပံ့မထားပါဘူး။
Partitioned table တစ်ခုကို publication ထဲကို ထပ်ပေါင်းလိုက်တဲ့အခါ — ၎င်းရဲ့ ရှိပြီးသား partitions တွေ ရော နောင်မှာ ဖန်တီးလာမယ့် partitions တွေရောကို — publication ရဲ့ အစိတ်အပိုင်းအဖြစ် သွယ်ဝိုက် (implicitly) ယူဆပါတယ်။ ဒါကြောင့် — partition တစ်ခုပေါ်မှာ တိုက်ရိုက် လုပ်ဆောင်တဲ့ operations တွေတောင် — ၎င်းရဲ့ ancestors တွေ ပါဝင်နေတဲ့ publications တွေကနေတစ်ဆင့် — publish လုပ်ခံရပါတယ်။
- **FOR ALL TABLES** — Publication ကို — database ထဲက tables တွေ အားလုံးအတွက် — နောင်မှာ ဖန်တီးလာမယ့် tables တွေ အပါအဝင် — အပြောင်းအလဲတွေကို replicate လုပ်မယ့်အရာအဖြစ် အမှတ်အသား လုပ်ပါတယ်။
- **FOR TABLES IN SCHEMA** — Publication ကို — သတ်မှတ်ထားတဲ့ schemas စာရင်းထဲက tables တွေ အားလုံးအတွက် — နောင်မှာ ဖန်တီးလာမယ့် tables တွေ အပါအဝင် — အပြောင်းအလဲတွေကို replicate လုပ်မယ့်အရာအဖြစ် အမှတ်အသား လုပ်ပါတယ်။
Publication က column list တစ်ခုပါတဲ့ table တစ်ခုကိုပါ publish လုပ်နေချိန်မှာ schema တစ်ခု သတ်မှတ်တာကိုတော့ ထောက်ပံ့မထားပါဘူး။
Schema ထဲမှာ ရှိနေတဲ့ persistent base tables နဲ့ partitioned tables တွေပဲ publication ရဲ့ အစိတ်အပိုင်းအဖြစ် ပါဝင်ပါလိမ့်မယ်။ Schema ထဲက temporary tables, unlogged tables, foreign tables, materialized views နဲ့ regular views တွေကတော့ publication ရဲ့ အစိတ်အပိုင်း ဖြစ်မှာ မဟုတ်ပါဘူး။
Partitioned table တစ်ခုကို schema-level publication တစ်ခုကနေတစ်ဆင့် publish လုပ်တဲ့အခါ — ၎င်းရဲ့ ရှိပြီးသား partitions တွေ ရော နောင်မှာ ဖန်တီးလာမယ့် partitions တွေရောကို — သူတို့က publication ရဲ့ schema ကနေ လာတာလား မလာဘူးလား မသက်ဆိုင်ဘဲ — publication ရဲ့ အစိတ်အပိုင်းအဖြစ် သွယ်ဝိုက် (implicitly) ယူဆပါတယ်။ ဒါကြောင့် — partition တစ်ခုပေါ်မှာ တိုက်ရိုက် လုပ်ဆောင်တဲ့ operations တွေတောင် — ၎င်းရဲ့ ancestors တွေ ပါဝင်နေတဲ့ publications တွေကနေတစ်ဆင့် — publish လုပ်ခံရပါတယ်။
- **WITH ( publication_parameter [= value] [, ... ] )** — ဒီ clause က publication တစ်ခုအတွက် optional parameters တွေကို သတ်မှတ်ပါတယ်။ အောက်ပါ parameters တွေကို ထောက်ပံ့ပါတယ်:

- **publish (string)** — ဒီ parameter က — publication အသစ်က subscribers (စာရင်းသွင်းသူများ) တွေဆီ ဘယ် DML operations တွေကို publish လုပ်မလဲဆိုတာ ဆုံးဖြတ်ပါတယ်။ တန်ဖိုးက — comma နဲ့ ခွဲထားတဲ့ operations စာရင်း ဖြစ်ပါတယ်။ ခွင့်ပြုထားတဲ့ operations တွေကတော့ insert, update, delete နဲ့ truncate ဖြစ်ပါတယ်။ Default ကတော့ — actions အားလုံးကို publish လုပ်တာ ဖြစ်လို့ — ဒီ option ရဲ့ default တန်ဖိုးက 'insert, update, delete, truncate' ဖြစ်ပါတယ်။
ဒီ parameter က DML operations တွေကိုပဲ သက်ရောက်ပါတယ်။ အထူးသဖြင့် — logical replication အတွက် ကနဦး data synchronization (data ချိန်ကိုက် ညှိယူမှု) (အပိုင်း 29.9.1 ကို ကြည့်ပါ) က — ရှိပြီးသား table data တွေကို ကူးယူနေတဲ့အခါ — ဒီ parameter ကို ထည့်တွက်ခြင်း မရှိပါဘူး။
- **publish_generated_columns (enum)** — Publication နဲ့ ဆက်စပ်နေတဲ့ tables တွေထဲမှာ ရှိနေတဲ့ generated columns တွေကို replicate လုပ်သင့်လားဆိုတာ သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့ none နဲ့ stored ဖြစ်ပါတယ်။
Default ကတော့ none ဖြစ်ပြီး — publication နဲ့ ဆက်စပ်နေတဲ့ tables တွေထဲက generated columns တွေကို replicate လုပ်မှာ မဟုတ်ပါဘူး။
stored လို့ သတ်မှတ်ထားရင် — publication နဲ့ ဆက်စပ်နေတဲ့ tables တွေထဲက stored generated columns တွေကို replicate လုပ်ပါလိမ့်မယ်။

> **မှတ်ချက်:** Subscriber က release 18 ထက် စောတဲ့ release တစ်ခုကနေ ဖြစ်နေရင် — publisher မှာ publish_generated_columns parameter က stored ဖြစ်နေတာတောင် — ကနဦး table synchronization က generated columns တွေကို ကူးယူမှာ မဟုတ်ပါဘူး။

Generated columns တွေရဲ့ logical replication အကြောင်း နောက်ထပ် အသေးစိတ်အတွက် အပိုင်း 29.6 ကို ကြည့်ပါ။

- **publish_via_partition_root (boolean)** — ဒီ parameter က — partitioned table တစ်ခု (သို့မဟုတ် ၎င်းရဲ့ partitions တစ်ခုခု) ပေါ်က အပြောင်းအလဲတွေကို ဘယ်လို publish လုပ်မလဲဆိုတာ ထိန်းချုပ်ပါတယ်။ true လို့ သတ်မှတ်ထားတဲ့အခါ — အပြောင်းအလဲတွေကို root partitioned table ရဲ့ identity နဲ့ schema ကို သုံးပြီး publish လုပ်ပါတယ်။ false (default) လို့ သတ်မှတ်ထားတဲ့အခါ — အပြောင်းအလဲတွေ တကယ် ဖြစ်ပွားခဲ့တဲ့ partition တစ်ခုချင်းစီရဲ့ identity နဲ့ schema ကို သုံးပြီး publish လုပ်ပါတယ်။ ဒီ option ကို enable လုပ်တာက — အပြောင်းအလဲတွေကို — non-partitioned table တစ်ခု သို့မဟုတ် — publisher ရဲ့ partition structure နဲ့ မတူညီတဲ့ partitioned table တစ်ခုထဲကို replicate လုပ်ခွင့် ပေးပါတယ်။
Subscription တစ်ခုက publication အများအပြားကို ပေါင်းစပ်ထားတဲ့ အခြေအနေ ရှိနိုင်ပါတယ်။ Partitioned table တစ်ခုကို — publish_via_partition_root = true လို့ သတ်မှတ်ထားတဲ့ subscribed publications တစ်ခုခုက publish လုပ်နေရင် — ဒီ partitioned table (သို့မဟုတ် ၎င်းရဲ့ partitions) ပေါ်က အပြောင်းအလဲတွေကို — partition တစ်ခုချင်းစီရဲ့ identity နဲ့ schema အစား — ဒီ partitioned table ရဲ့ identity နဲ့ schema ကို သုံးပြီး publish လုပ်ပါလိမ့်မယ်။
ဒီ parameter က partitions တွေအတွက် row filters နဲ့ column lists တွေကို ဘယ်လို ရွေးချယ်မလဲဆိုတာကိုလည်း သက်ရောက်ပါတယ်; အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ။
ဒါကို enable လုပ်ထားရင် — partitions တွေပေါ်မှာ တိုက်ရိုက် လုပ်ဆောင်တဲ့ TRUNCATE operations တွေကို replicate လုပ်မှာ မဟုတ်ပါဘူး။

`boolean` အမျိုးအစား parameter တစ်ခုကို သတ်မှတ်တဲ့အခါ — `=` `value` အပိုင်းကို ချန်လိုက်လို့ ရပြီး — ၎င်းက `TRUE` လို့ သတ်မှတ်တာနဲ့ ညီမျှပါတယ်။

## Notes (မှတ်စုများ)

`FOR TABLE`, `FOR ALL TABLES` သို့မဟုတ် `FOR TABLES IN SCHEMA` တွေကို မသတ်မှတ်ထားဘူးဆိုရင် — publication က — tables တစ်ခုမှ မပါဝင်တဲ့ အစုတစ်ခုနဲ့ စတင်ပါတယ်။ နောက်ပိုင်းမှာ tables သို့မဟုတ် schemas တွေ ထပ်ပေါင်းမယ်ဆိုရင် အဲဒါက အသုံးဝင်ပါတယ်။

Publication တစ်ခု ဖန်တီးတာက replication ကို စတင်ပေးတာ မဟုတ်ပါဘူး။ ၎င်းက — နောင်မှာ လာမယ့် subscribers တွေအတွက် — grouping နဲ့ filtering logic (အုပ်စုဖွဲ့ခြင်းနှင့် စစ်ထုတ်ခြင်း ယုတ္တိ) တစ်ခုကိုပဲ သတ်မှတ်ပေးပါတယ်။

Publication တစ်ခု ဖန်တီးဖို့ — command ကို run လုပ်တဲ့ user က — လက်ရှိ database အတွက် `CREATE` privilege ရှိရပါမယ်။ (Superusers တွေကတော့ ဒီ check ကို ကျော်လွှားပါတယ်။)

Publication ထဲကို table တစ်ခု ထပ်ပေါင်းဖို့ — command ကို run လုပ်တဲ့ user က — အဲဒီ table အပေါ်မှာ ownership rights (ပိုင်ဆိုင်မှု အခွင့်အရေးများ) ရှိရပါမယ်။ `FOR ALL TABLES` နဲ့ `FOR TABLES IN SCHEMA` clauses တွေကတော့ — command ကို run လုပ်တဲ့ user က superuser ဖြစ်ဖို့ လိုအပ်ပါတယ်။

`UPDATE` နဲ့/သို့မဟုတ် `DELETE` operations တွေကို publish လုပ်တဲ့ publication တစ်ခုထဲကို ထပ်ပေါင်းထားတဲ့ tables တွေမှာ `REPLICA IDENTITY` သတ်မှတ်ထားရပါမယ်။ မဟုတ်ရင် — အဲဒီ tables တွေပေါ်မှာ အဲဒီ operations တွေကို ခွင့်မပြုပါဘူး။

`UPDATE` သို့မဟုတ် `DELETE` operations တွေကို publish လုပ်နိုင်ဖို့ — column list တိုင်းမှာ `REPLICA IDENTITY` columns တွေ ပါဝင်ရပါမယ်။ Publication က `INSERT` operations တွေကိုပဲ publish လုပ်မယ်ဆိုရင် — column list နဲ့ ပတ်သက်တဲ့ ကန့်သတ်ချက်တွေ မရှိပါဘူး။

`UPDATE` နဲ့ `DELETE` operations တွေကို publish လုပ်နိုင်ဖို့ — row filter expression တစ်ခု (ဆိုလိုတာက `WHERE` clause) ထဲမှာ — `REPLICA IDENTITY` က လွှမ်းခြုံထားတဲ့ (covered) columns တွေပဲ ပါဝင်ရပါမယ်။ `INSERT` operations တွေရဲ့ publication အတွက်တော့ — `WHERE` expression ထဲမှာ ဘယ် column ကိုမဆို သုံးလို့ ရပါတယ်။ Row filter က — user-defined functions, user-defined operators, user-defined types, user-defined collations, non-immutable built-in functions တွေ သို့မဟုတ် system columns တွေဆီ ရည်ညွှန်းမှုတွေ မပါတဲ့ — ရိုးရှင်းတဲ့ expressions တွေကိုပဲ ခွင့်ပြုပါတယ်။

`REPLICA IDENTITY` ရဲ့ အစိတ်အပိုင်း ဖြစ်နေတဲ့ generated columns တွေကို — `UPDATE` နဲ့ `DELETE` operations တွေ publish လုပ်နိုင်ဖို့အတွက် — column list ထဲမှာ စာရင်းပြုခြင်းအားဖြင့်ဖြစ်စေ — `publish_generated_columns` option ကို enable လုပ်ခြင်းအားဖြင့်ဖြစ်စေ — ရှင်းလင်းစွာ (explicitly) publish လုပ်ထားရပါမယ်။

`FOR TABLES IN SCHEMA` ကို သတ်မှတ်ထားပြီး — table က ရည်ညွှန်းထားတဲ့ schema ထဲမှာ ပါဝင်နေရင် — အဲဒီ table ပေါ်က row filter က မလိုအပ်တော့ဘဲ ဖြစ်သွားပါတယ်။

Publish လုပ်ထားတဲ့ partitioned tables တွေအတွက် — publication parameter `publish_via_partition_root` က true ဖြစ်ရင် — partition တစ်ခုချင်းစီအတွက် row filter ကို publish လုပ်ထားတဲ့ partitioned table ကနေ ယူပြီး — false (default) ဖြစ်ရင်တော့ — partition ကိုယ်တိုင်ကနေ ယူပါတယ်။ Row filters တွေအကြောင်း အသေးစိတ်အတွက် [အပိုင်း 29.4](https://www.postgresql.org/docs/current/logical-replication-row-filter.html) ကို ကြည့်ပါ။ အလားတူပဲ — publish လုပ်ထားတဲ့ partitioned tables တွေအတွက် — publication parameter `publish_via_partition_root` က true ဖြစ်ရင် — partition တစ်ခုချင်းစီအတွက် column list ကို publish လုပ်ထားတဲ့ partitioned table ကနေ ယူပြီး — false ဖြစ်ရင်တော့ — partition ကိုယ်တိုင်ကနေ ယူပါတယ်။

`INSERT ... ON CONFLICT` command တစ်ခုအတွက် — publication က — command ကနေ ရလဒ် ထွက်လာတဲ့ operation ကို publish လုပ်ပါလိမ့်မယ်။ ရလဒ် ပေါ် မူတည်ပြီး — ၎င်းကို `INSERT` သို့မဟုတ် `UPDATE` အနေနဲ့ publish လုပ်နိုင်သလို — လုံးဝ publish လုပ်ခြင်း မရှိဘဲလည်း ဖြစ်နိုင်ပါတယ်။

`MERGE` command တစ်ခုအတွက် — publication က — insert, update သို့မဟုတ် delete လုပ်လိုက်တဲ့ row တစ်ခုချင်းစီအတွက် `INSERT`, `UPDATE` သို့မဟုတ် `DELETE` တစ်ခုကို publish လုပ်ပါလိမ့်မယ်။

Root ကို `publish_via_partition_root` ကို `true` လို့ သတ်မှတ်ထားတဲ့ publication တစ်ခုနဲ့ publish လုပ်ထားတဲ့ partition tree တစ်ခုထဲကို table တစ်ခု `ATTACH` လုပ်တာက — table ရဲ့ ရှိပြီးသား contents တွေကို replicate လုပ်ခြင်း မရှိပါဘူး။

`COPY ... FROM` commands တွေကို `INSERT` operations အဖြစ် publish လုပ်ပါတယ်။

DDL operations တွေကို publish လုပ်မှာ မဟုတ်ပါဘူး။

`WHERE` clause ရဲ့ expression ကို — replication connection အတွက် သုံးတဲ့ role နဲ့ execute လုပ်ပါတယ်။

## Examples (ဥပမာများ)

Table နှစ်ခုထဲက အပြောင်းအလဲ အားလုံးကို publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION mypublication FOR TABLE users, departments;
```

Active departments တွေကနေ အပြောင်းအလဲ အားလုံးကို publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION active_departments FOR TABLE departments WHERE (active IS TRUE);
```

Table အားလုံးထဲက အပြောင်းအလဲ အားလုံးကို publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION alltables FOR ALL TABLES;
```

Table တစ်ခုထဲမှာ `INSERT` operations တွေကိုပဲ publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION insert_only FOR TABLE mydata
    WITH (publish = 'insert');
```

`users`, `departments` tables တွေနဲ့ — `production` schema ထဲက tables အားလုံးရဲ့ အပြောင်းအလဲ အားလုံးကို publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION production_publication FOR TABLE users, departments, TABLES IN SCHEMA production;
```

`marketing` နဲ့ `sales` schemas တွေထဲက tables အားလုံးရဲ့ အပြောင်းအလဲ အားလုံးကို publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION sales_publication FOR TABLES IN SCHEMA marketing, sales;
```

`users` table ရဲ့ အပြောင်းအလဲ အားလုံးကို publish လုပ်ပေမယ့် — `user_id` နဲ့ `firstname` columns တွေကိုပဲ replicate လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့:

```sql
CREATE PUBLICATION users_filtered FOR TABLE users (user_id, firstname);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE PUBLICATION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER PUBLICATION](/docs/postgresql/sql-alterpublication), [DROP PUBLICATION](/docs/postgresql/sql-droppublication), [CREATE SUBSCRIPTION](/docs/postgresql/sql-createsubscription), [ALTER SUBSCRIPTION](/docs/postgresql/sql-altersubscription)
