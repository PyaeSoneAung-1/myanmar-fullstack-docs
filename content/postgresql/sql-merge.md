---
title: "MERGE (rows များကို ထည့်သွင်း/ပြောင်းလဲ/ဖျက်ရန် တစ်ပြိုင်နက် လုပ်ဆောင်ခြင်း)"
description: "Data source တစ်ခုကို အခြေခံပြီး target table ထဲက rows များကို insert/update/delete — တစ်ပြိုင်နက် လုပ်ဆောင်နိုင်သည့် MERGE command အကြောင်း — syntax နှင့် parameters (WHEN MATCHED, WHEN NOT MATCHED [BY SOURCE/TARGET], RETURNING စသည်)၊ trigger အပြုအမူ မှတ်စုများ နှင့် ဥပမာများ"
order: 156
source: "https://www.postgresql.org/docs/current/sql-merge.html"
status: translated
updated: 2026-09-04
---

## MERGE (rows များကို ထည့်သွင်း/ပြောင်းလဲ/ဖျက်ရန် တစ်ပြိုင်နက် လုပ်ဆောင်ခြင်း)

MERGE — table တစ်ခုရဲ့ rows တွေကို အခြေအနေအရ (conditionally) insert, update ဒါမှမဟုတ် delete လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
[ WITH with_query [, ...] ]
MERGE INTO [ ONLY ] target_table_name [ * ] [ [ AS ] target_alias ]
    USING data_source ON join_condition
    when_clause [...]
    [ RETURNING [ WITH ( { OLD | NEW } AS output_alias [, ...] ) ]
                { * | output_expression [ [ AS ] output_name ] } [, ...] ]

where data_source is:

    { [ ONLY ] source_table_name [ * ] | ( source_query ) } [ [ AS ] source_alias ]

and when_clause is:

    { WHEN MATCHED [ AND condition ] THEN { merge_update | merge_delete | DO NOTHING } |
      WHEN NOT MATCHED BY SOURCE [ AND condition ] THEN { merge_update | merge_delete | DO NOTHING } |
      WHEN NOT MATCHED [ BY TARGET ] [ AND condition ] THEN { merge_insert | DO NOTHING } }

and merge_insert is:

    INSERT [( column_name [, ...] )]
        [ OVERRIDING { SYSTEM | USER } VALUE ]
        { VALUES ( { expression | DEFAULT } [, ...] ) | DEFAULT VALUES }

and merge_update is:

    UPDATE SET { column_name = { expression | DEFAULT } |
                 ( column_name [, ...] ) = [ ROW ] ( { expression | DEFAULT } [, ...] ) |
                 ( column_name [, ...] ) = ( sub-SELECT )
               } [, ...]

and merge_delete is:

    DELETE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`MERGE` က — `data_source` ကို သုံးပြီး — `target_table_name` အဖြစ် သတ်မှတ်ထားတဲ့ target table ထဲက rows တွေကို ပြုပြင်မွမ်းမံတဲ့ actions တွေကို လုပ်ဆောင်ပါတယ်။ `MERGE` က — rows တွေကို conditional ပုံစံနဲ့ `INSERT`, `UPDATE` ဒါမှမဟုတ် `DELETE` လုပ်နိုင်တဲ့ SQL statement တစ်ခုတည်းကို ပေးပါတယ် — ဒါက တခြားနည်းဆိုရင် procedural language statements တွေ အများကြီး လိုအပ်မယ့် အလုပ်တစ်ခု ဖြစ်ပါတယ်။

ပထမဦးစွာ — `MERGE` command က `data_source` ကနေ target table ဆီ join တစ်ခု လုပ်ဆောင်ပြီး — candidate change rows (ပြောင်းလဲမှု အတွက် လျာထားသည့် rows) သုည သို့မဟုတ် ထိုထက်ပိုတာတွေကို ထုတ်ပေးပါတယ်။ Candidate change row တစ်ခုချင်းစီအတွက် — `MATCHED`, `NOT MATCHED BY SOURCE` ဒါမှမဟုတ် `NOT MATCHED [BY TARGET]` ရဲ့ အခြေအနေ (status) ကို တစ်ကြိမ်ပဲ သတ်မှတ်ပြီး — အဲဒီနောက်မှာ `WHEN` clauses တွေကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း အကဲဖြတ်ပါတယ်။ Candidate change row တစ်ခုချင်းစီအတွက် — true အဖြစ် အကဲဖြတ်လို့ ရတဲ့ ပထမ clause ကို execute လုပ်ပါတယ်။ Candidate change row တစ်ခုအတွက် `WHEN` clause တစ်ခုထက်ပိုပြီး execute လုပ်တာ မရှိပါဘူး။

`MERGE` actions တွေက — နာမည်တူတဲ့ ပုံမှန် `UPDATE`, `INSERT` ဒါမှမဟုတ် `DELETE` commands တွေနဲ့ ရလဒ် အတူတူပဲ ဖြစ်ပါတယ်။ အဲဒီ commands တွေရဲ့ syntax ကတော့ ကွဲပြားပါတယ် — အထူးသဖြင့် `WHERE` clause မရှိတာနဲ့ table နာမည် မသတ်မှတ်ရတာပါ။ Actions တွေ အားလုံးက target table ကိုပဲ ရည်ညွှန်းပါတယ် — ဒါပေမယ့် — triggers တွေကို သုံးပြီး တခြား tables တွေကိုတော့ ပြုပြင်မွမ်းမံမှုတွေ လုပ်နိုင်ပါတယ်။

`DO NOTHING` ကို သတ်မှတ်ထားတဲ့အခါ — source row ကို ကျော်လိုက်ပါတယ်။ Actions တွေကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း အကဲဖြတ်တာမို့ — ပိုပြီး ချဲ့ထွင်တဲ့ (fine-grained) ကိုင်တွယ်မှု မလုပ်ခင် — စိတ်မဝင်စားစရာ source rows တွေကို ကျော်ဖို့ `DO NOTHING` က အဆင်ပြေပါတယ်။

Optional ဖြစ်တဲ့ `RETURNING` clause က `MERGE` ကို — insert, update ဒါမှမဟုတ် delete လုပ်လိုက်တဲ့ row တစ်ခုချင်းစီကို အခြေခံပြီး — value(s) တွေကို တွက်ချက် ပြန်ပေးစေပါတယ်။ Source ဒါမှမဟုတ် target table ရဲ့ columns တွေ၊ ဒါမှမဟုတ် [`merge_action()`](/docs/postgresql/functions-merge-support) function ကို သုံးတဲ့ expression မှန်သမျှကို တွက်ချက်လို့ ရပါတယ်။ Default အနေနဲ့ — `INSERT` ဒါမှမဟုတ် `UPDATE` action တစ်ခု လုပ်ဆောင်တဲ့အခါ — target table ရဲ့ columns တွေရဲ့ အသစ် တန်ဖိုးတွေကို သုံးပြီး — `DELETE` တစ်ခု လုပ်ဆောင်တဲ့အခါ — target table ရဲ့ columns တွေရဲ့ အဟောင်း တန်ဖိုးတွေကို သုံးပါတယ် — ဒါပေမယ့် — အဟောင်း နဲ့ အသစ် တန်ဖိုးတွေကို ရှင်းရှင်းလင်းလင်း တောင်းဆိုလို့လည်း ရပါသေးတယ်။ `RETURNING` list ရဲ့ syntax က `SELECT` ရဲ့ output list ရဲ့ syntax နဲ့ တူညီပါတယ်။

သီးခြား `MERGE` privilege ဆိုတာ မရှိပါဘူး။ Update action တစ်ခု သတ်မှတ်ရင် — `SET` clause ထဲမှာ ရည်ညွှန်းထားတဲ့ target table ရဲ့ column(s) တွေပေါ်မှာ `UPDATE` privilege ရှိရပါမယ်။ Insert action တစ်ခု သတ်မှတ်ရင် — target table ပေါ်မှာ `INSERT` privilege ရှိရပါမယ်။ Delete action တစ်ခု သတ်မှတ်ရင် — target table ပေါ်မှာ `DELETE` privilege ရှိရပါမယ်။ `DO NOTHING` action တစ်ခု သတ်မှတ်ရင် — target table ရဲ့ column တစ်ခုမဟုတ်တစ်ခုပေါ်မှာ `SELECT` privilege ရှိရပါမယ်။ ထို့အပြင် — `condition` (ဒါမှမဟုတ် `join_condition`) ဒါမှမဟုတ် `expression` တစ်ခုခုထဲမှာ ရည်ညွှန်းထားတဲ့ `data_source` ရဲ့ ဒါမှမဟုတ် target table ရဲ့ column(s) တွေပေါ်မှာလည်း `SELECT` privilege လိုအပ်ပါတယ်။ Privileges တွေကို statement စတင်ချိန်မှာ တစ်ကြိမ် စမ်းသပ်ပြီး — တိကျတဲ့ `WHEN` clauses တွေ execute ဖြစ်သည်ဖြစ်စေ၊ မဖြစ်သည်ဖြစ်စေ — စစ်ဆေးပါတယ်။

Target table က materialized view တစ်ခု၊ foreign table တစ်ခု ဖြစ်နေရင် ဒါမှမဟုတ် ၎င်းပေါ်မှာ rules တွေ သတ်မှတ်ထားရင် — `MERGE` ကို ထောက်ပံ့မပေးပါဘူး။

## Parameters (parameter များ)

- **with_query** — `WITH` clause က — `MERGE` query ထဲမှာ နာမည်နဲ့ ရည်ညွှန်းလို့ရတဲ့ subquery တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတာတွေကို သတ်မှတ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 7.8 နဲ့ SELECT ကို ကြည့်ပါ။ `WITH RECURSIVE` ကိုတော့ `MERGE` က ထောက်ပံ့မပေးဘူးဆိုတာ သတိပြုပါ။
- **target_table_name** — Merge လုပ်ရမယ့် target table ဒါမှမဟုတ် view ရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လုပ်ထားနိုင်ပါတယ်)။ `ONLY` ကို table နာမည် ရှေ့မှာ သတ်မှတ်ထားရင် — ကိုက်ညီတဲ့ rows တွေကို နာမည်ပေးထားတဲ့ table ထဲမှာပဲ update ဒါမှမဟုတ် delete လုပ်ပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — ကိုက်ညီတဲ့ rows တွေကို သတ်မှတ်ထားတဲ့ table ကနေ inherit လုပ်ထားတဲ့ table တွေထဲကပါ update ဒါမှမဟုတ် delete လုပ်ပါတယ်။ Optional အနေနဲ့ — table နာမည် နောက်မှာ `*` ကို သတ်မှတ်ပြီး — descendant tables တွေလည်း ပါဝင်တယ်ဆိုတာကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်ပါတယ်။ `ONLY` keyword နဲ့ `*` option တွေက insert actions တွေကို သက်ရောက်မှု မရှိပါဘူး — insert actions တွေက နာမည်ပေးထားတဲ့ table ထဲကိုပဲ အမြဲ insert လုပ်ပါတယ်။
`target_table_name` က view တစ်ခု ဆိုရင် — `INSTEAD OF` triggers တွေ မရှိဘဲ အလိုအလျောက် update လုပ်လို့ရတဲ့ (automatically updatable) view တစ်ခု ဖြစ်ရမယ် ဒါမှမဟုတ် — `WHEN` clauses တွေထဲမှာ သတ်မှတ်ထားတဲ့ action အမျိုးအစား (INSERT, UPDATE နဲ့ DELETE) တိုင်းအတွက် `INSTEAD OF` triggers တွေ ရှိရပါမယ်။ Rules တွေ ပါတဲ့ views တွေကိုတော့ ထောက်ပံ့မပေးပါဘူး။
- **target_alias** — Target table အတွက် အစားထိုး နာမည် တစ်ခု ဖြစ်ပါတယ်။ Alias ပေးထားတဲ့အခါ — table ရဲ့ တကယ့် နာမည်ကို လုံးဝ ဖုံးကွယ်လိုက်ပါတယ်။ ဥပမာ — `MERGE INTO foo AS f` ဆိုရင် — ကျန် `MERGE` statement ရဲ့ အပိုင်းတွေမှာ ဒီ table ကို foo အနေနဲ့ မဟုတ်ဘဲ f အနေနဲ့ပဲ ရည်ညွှန်းရပါမယ်။
- **source_table_name** — Source table၊ view ဒါမှမဟုတ် transition table ရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လုပ်ထားနိုင်ပါတယ်)။ `ONLY` ကို table နာမည် ရှေ့မှာ သတ်မှတ်ထားရင် — ကိုက်ညီတဲ့ rows တွေကို နာမည်ပေးထားတဲ့ table ကနေပဲ ထည့်သွင်းပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — ကိုက်ညီတဲ့ rows တွေကို သတ်မှတ်ထားတဲ့ table ကနေ inherit လုပ်ထားတဲ့ table တွေထဲကပါ ထည့်သွင်းပါတယ်။ Optional အနေနဲ့ — table နာမည် နောက်မှာ `*` ကို သတ်မှတ်ပြီး — descendant tables တွေလည်း ပါဝင်တယ်ဆိုတာကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်ပါတယ်။
- **source_query** — Target table ထဲကို merge လုပ်ဖို့ rows တွေကို ထောက်ပံ့ပေးတဲ့ query တစ်ခု (`SELECT` statement ဒါမှမဟုတ် `VALUES` statement) ဖြစ်ပါတယ်။ Syntax ၏ ဖော်ပြချက်အတွက် `SELECT` statement ဒါမှမဟုတ် `VALUES` statement ကို ကိုးကားပါ။
- **source_alias** — Data source အတွက် အစားထိုး နာမည် တစ်ခု ဖြစ်ပါတယ်။ Alias ပေးထားတဲ့အခါ — table ရဲ့ တကယ့် နာမည် ဒါမှမဟုတ် query တစ်ခု ထုတ်ပြန်လိုက်တယ်ဆိုတဲ့ အချက်ကို လုံးဝ ဖုံးကွယ်လိုက်ပါတယ်။
- **join_condition** — `join_condition` က — `data_source` ထဲက ဘယ် rows တွေက target table ထဲက rows တွေနဲ့ ကိုက်ညီလဲဆိုတာကို သတ်မှတ်ပေးတဲ့ — `boolean` အမျိုးအစား တန်ဖိုး ရလဒ်ထွက်တဲ့ expression တစ်ခု (`WHERE` clause တစ်ခုနဲ့ ဆင်တူပါတယ်) ဖြစ်ပါတယ်။

> **သတိပေးချက်:** `data_source` rows တွေနဲ့ ကိုက်ညီအောင် ကြိုးစားတဲ့ target table ရဲ့ columns တွေပဲ `join_condition` ထဲမှာ ပါဝင်သင့်ပါတယ်။ Target table ရဲ့ columns တွေကိုပဲ ရည်ညွှန်းတဲ့ `join_condition` subexpressions တွေက — ဘယ် action ကို လုပ်ဆောင်မယ်ဆိုတာကို — မကြာခဏဆိုသလို အံ့အားသင့်စရာ နည်းလမ်းတွေနဲ့ — သက်ရောက်နိုင်ပါတယ်။
> 
> `WHEN NOT MATCHED BY SOURCE` ရော `WHEN NOT MATCHED [BY TARGET]` clauses တွေပါ သတ်မှတ်ထားရင် — `MERGE` command က `data_source` နဲ့ target table ကြားမှာ FULL join တစ်ခုကို လုပ်ဆောင်ပါလိမ့်မယ်။ ဒါ အလုပ်ဖြစ်ဖို့အတွက် — join_condition subexpression အနည်းဆုံး တစ်ခုက hash join တစ်ခုကို ထောက်ပံ့နိုင်တဲ့ operator တစ်ခုကို သုံးရမယ် — ဒါမှမဟုတ် subexpressions အားလုံးက merge join တစ်ခုကို ထောက်ပံ့နိုင်တဲ့ operators တွေကို သုံးရပါမယ်။
- **when_clause** — `WHEN` clause အနည်းဆုံး တစ်ခု လိုအပ်ပါတယ်။
`WHEN` clause က `WHEN MATCHED`, `WHEN NOT MATCHED BY SOURCE` ဒါမှမဟုတ် `WHEN NOT MATCHED [BY TARGET]` ကို သတ်မှတ်နိုင်ပါတယ်။ SQL standard မှာ `WHEN MATCHED` နဲ့ `WHEN NOT MATCHED` (ကိုက်ညီတဲ့ target row မရှိဘူးလို့ အဓိပ္ပာယ် ရတဲ့) တွေပဲ သတ်မှတ်ထားတာ ဖြစ်ပြီး — `WHEN NOT MATCHED BY SOURCE` က SQL standard ရဲ့ extension တစ်ခု ဖြစ်သလို — အဓိပ္ပာယ်ကို ပိုရှင်းလင်းစေဖို့ `WHEN NOT MATCHED` နောက်မှာ `BY TARGET` ကို ဆက်ထည့်နိုင်တာကလည်း extension တစ်ခု ဖြစ်ပါတယ်။
`WHEN` clause က `WHEN MATCHED` ကို သတ်မှတ်ပြီး — candidate change row က `data_source` ထဲက row တစ်ခုနဲ့ target table ထဲက row တစ်ခုကို ကိုက်ညီနေရင် — condition မရှိဘူးဆိုရင် ဒါမှမဟုတ် condition က true အဖြစ် အကဲဖြတ်ရင် — အဲဒီ `WHEN` clause ကို execute လုပ်ပါတယ်။
`WHEN` clause က `WHEN NOT MATCHED BY SOURCE` ကို သတ်မှတ်ပြီး — candidate change row က `data_source` ထဲက row တစ်ခုနဲ့ မကိုက်ညီတဲ့ target table ထဲက row တစ်ခုကို ကိုယ်စားပြုနေရင် — condition မရှိဘူးဆိုရင် ဒါမှမဟုတ် condition က true အဖြစ် အကဲဖြတ်ရင် — အဲဒီ `WHEN` clause ကို execute လုပ်ပါတယ်။
`WHEN` clause က `WHEN NOT MATCHED [BY TARGET]` ကို သတ်မှတ်ပြီး — candidate change row က target table ထဲက row တစ်ခုနဲ့ မကိုက်ညီတဲ့ `data_source` ထဲက row တစ်ခုကို ကိုယ်စားပြုနေရင် — condition မရှိဘူးဆိုရင် ဒါမှမဟုတ် condition က true အဖြစ် အကဲဖြတ်ရင် — အဲဒီ `WHEN` clause ကို execute လုပ်ပါတယ်။
- **condition** — `boolean` အမျိုးအစား တန်ဖိုး တစ်ခု ပြန်ပေးတဲ့ expression တစ်ခု ဖြစ်ပါတယ်။ `WHEN` clause တစ်ခုအတွက် ဒီ expression က true ပြန်လာရင် — အဲဒီ clause ရဲ့ action ကို အဲဒီ row အတွက် execute လုပ်ပါတယ်။
`WHEN MATCHED` clause တစ်ခုပေါ်က condition က source ရော target relation နှစ်ခုလုံးရဲ့ columns တွေကိုပါ ရည်ညွှန်းနိုင်ပါတယ်။ `WHEN NOT MATCHED BY SOURCE` clause တစ်ခုပေါ်က condition ကတော့ — အဓိပ္ပာယ် ဖွင့်ဆိုချက်အရ ကိုက်ညီတဲ့ source row မရှိလို့ — target relation ရဲ့ columns တွေကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။ `WHEN NOT MATCHED [BY TARGET]` clause တစ်ခုပေါ်က condition ကတော့ — အဓိပ္ပာယ် ဖွင့်ဆိုချက်အရ ကိုက်ညီတဲ့ target row မရှိလို့ — source relation ရဲ့ columns တွေကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။ Target table ကနေ system attributes တွေကိုပဲ ဝင်ရောက်ကြည့်ရှုလို့ ရပါတယ်။
- **merge_insert** — Target table ထဲကို row တစ်ခု ထည့်သွင်းတဲ့ `INSERT` action တစ်ခုရဲ့ သတ်မှတ်ချက် ဖြစ်ပါတယ်။ Target column နာမည်တွေကို ဘယ် အစဉ်နဲ့မဆို စာရင်းပြုလို့ ရပါတယ်။ Column နာမည် စာရင်း လုံးဝ မပေးရဘူးဆိုရင် — default ကတော့ — table ထဲက columns အားလုံးကို သူတို့ ကြေညာထားတဲ့ (declared) အစဉ်အတိုင်း ယူပါတယ်။
Explicit ဒါမှမဟုတ် implicit column list ထဲမှာ မပါဝင်တဲ့ column တစ်ခုချင်းစီကို default တန်ဖိုး တစ်ခုနဲ့ ဖြည့်ပေးပါတယ် — ၎င်းရဲ့ ကြေညာထားတဲ့ default တန်ဖိုး ဒါမှမဟုတ် မရှိရင် null ဖြစ်ပါတယ်။
Target table က partitioned table တစ်ခု ဆိုရင် — row တစ်ခုချင်းစီကို သင့်လျော်တဲ့ partition ဆီ ပို့ဆောင်ပြီး — အဲဒီထဲကို insert လုပ်ပါတယ်။ Target table က partition တစ်ခု ဆိုရင် — input row တစ်ခုခုက partition constraint ကို ချိုးဖောက်ရင် error တစ်ခု ဖြစ်ပါလိမ့်မယ်။
Column နာမည်တွေကို တစ်ကြိမ်ထက်ပိုပြီး သတ်မှတ်လို့ မရပါဘူး။ `INSERT` actions တွေမှာ sub-selects တွေ မပါဝင်နိုင်ပါဘူး။
`VALUES` clause တစ်ခုပဲ သတ်မှတ်လို့ ရပါတယ်။ `VALUES` clause က — အဓိပ္ပာယ် ဖွင့်ဆိုချက်အရ ကိုက်ညီတဲ့ target row မရှိလို့ — source relation ရဲ့ columns တွေကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။
- **merge_update** — Target table ရဲ့ လက်ရှိ row ကို update လုပ်တဲ့ `UPDATE` action တစ်ခုရဲ့ သတ်မှတ်ချက် ဖြစ်ပါတယ်။ Column နာမည်တွေကို တစ်ကြိမ်ထက်ပိုပြီး သတ်မှတ်လို့ မရပါဘူး။
Table နာမည် ရော `WHERE` clause ပါ ခွင့်မပြုပါဘူး။
- **merge_delete** — Target table ရဲ့ လက်ရှိ row ကို ဖျက်တဲ့ `DELETE` action တစ်ခုကို သတ်မှတ်ပါတယ်။ ပုံမှန် `DELETE` command တစ်ခုနဲ့ လုပ်သလို — table နာမည် ဒါမှမဟုတ် တခြား clauses တွေ မထည့်ပါနဲ့။
- **column_name** — Target table ထဲက column တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ လိုအပ်ရင် — column နာမည်ကို subfield နာမည် ဒါမှမဟုတ် array subscript တစ်ခုနဲ့ qualify လုပ်နိုင်ပါတယ်။ (Composite column တစ်ခုရဲ့ fields တချို့ထဲကိုပဲ insert လုပ်တာက — ကျန် fields တွေကို null အဖြစ် ချန်ထားပါတယ်။) Target column တစ်ခုရဲ့ သတ်မှတ်ချက်ထဲမှာ table ရဲ့ နာမည်ကို မထည့်ပါနဲ့။
- **OVERRIDING SYSTEM VALUE** — ဒီ clause မပါဘဲ — `GENERATED ALWAYS` ဆိုပြီး သတ်မှတ်ထားတဲ့ identity column တစ်ခုအတွက် — explicit တန်ဖိုး (`DEFAULT` ကလွဲပြီး) တစ်ခု သတ်မှတ်တာက error တစ်ခု ဖြစ်ပါတယ်။ ဒီ clause က အဲဒီ ကန့်သတ်ချက်ကို override လုပ်ပါတယ်။
- **OVERRIDING USER VALUE** — ဒီ clause ကို သတ်မှတ်ထားရင် — `GENERATED BY DEFAULT` ဆိုပြီး သတ်မှတ်ထားတဲ့ identity columns တွေအတွက် ထောက်ပံ့ပေးထားတဲ့ တန်ဖိုး မှန်သမျှကို လျစ်လျူရှုပြီး — default ဖြစ်တဲ့ sequence-generated တန်ဖိုးတွေကို ကျင့်သုံးပါတယ်။
- **DEFAULT VALUES** — Columns တွေ အားလုံးကို သူတို့ရဲ့ default တန်ဖိုးတွေနဲ့ ဖြည့်ပေးပါတယ်။ (ဒီ ပုံစံမှာ `OVERRIDING` clause တစ်ခုကို ခွင့်မပြုပါဘူး။)
- **expression** — Column တစ်ခုကို assign လုပ်ဖို့ expression တစ်ခု ဖြစ်ပါတယ်။ `WHEN MATCHED` clause တစ်ခုမှာ သုံးရင် — expression က target table ထဲက မူရင်း row ရဲ့ တန်ဖိုးတွေရော `data_source` row ရဲ့ တန်ဖိုးတွေပါ သုံးနိုင်ပါတယ်။ `WHEN NOT MATCHED BY SOURCE` clause တစ်ခုမှာ သုံးရင် — expression က target table ထဲက မူရင်း row ရဲ့ တန်ဖိုးတွေကိုပဲ သုံးနိုင်ပါတယ်။ `WHEN NOT MATCHED [BY TARGET]` clause တစ်ခုမှာ သုံးရင် — expression က `data_source` row ရဲ့ တန်ဖိုးတွေကိုပဲ သုံးနိုင်ပါတယ်။
- **DEFAULT** — Column ကို ၎င်းရဲ့ default တန်ဖိုးနဲ့ သတ်မှတ်ပါ (တိကျတဲ့ default expression တစ်ခုကို assign မလုပ်ထားရင် NULL ဖြစ်ပါလိမ့်မယ်)။
- **sub-SELECT** — ရှေ့မှာ ပါဝင်တဲ့ ကွင်းစကွင်းပိတ် column list ထဲမှာ စာရင်းပြုထားသလောက် output columns အများအပြား ထုတ်ပေးတဲ့ `SELECT` sub-query တစ်ခု ဖြစ်ပါတယ်။ Sub-query က execute လုပ်တဲ့အခါ row တစ်ခုထက်ပိုပြီး မထုတ်ရပါဘူး။ Row တစ်ခု ထုတ်ရင် — ၎င်းရဲ့ column တန်ဖိုးတွေကို target columns တွေကို assign လုပ်ပြီး — row ဘာမှ မထုတ်ရင် — NULL တန်ဖိုးတွေကို target columns တွေကို assign လုပ်ပါတယ်။ `WHEN MATCHED` clause တစ်ခုမှာ သုံးရင် — sub-query က target table ထဲက မူရင်း row ရဲ့ တန်ဖိုးတွေရော `data_source` row ရဲ့ တန်ဖိုးတွေပါ ရည်ညွှန်းနိုင်ပါတယ်။ `WHEN NOT MATCHED BY SOURCE` clause တစ်ခုမှာ သုံးရင် — sub-query က target table ထဲက မူရင်း row ရဲ့ တန်ဖိုးတွေကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။
- **output_alias** — `RETURNING` list ထဲမှာ OLD ဒါမှမဟုတ် NEW rows တွေအတွက် optional အစားထိုး နာမည် တစ်ခု ဖြစ်ပါတယ်။
Default အနေနဲ့ — `OLD.column_name` ဒါမှမဟုတ် `OLD.*` လို့ ရေးခြင်းဖြင့် target table ကနေ အဟောင်း တန်ဖိုးတွေကို ပြန်ယူနိုင်ပြီး — `NEW.column_name` ဒါမှမဟုတ် `NEW.*` လို့ ရေးခြင်းဖြင့် အသစ် တန်ဖိုးတွေကို ပြန်ယူနိုင်ပါတယ်။ Alias ပေးထားတဲ့အခါ — ဒီ နာမည်တွေ ဖုံးကွယ်ခံရပြီး — အဟောင်း ဒါမှမဟုတ် အသစ် rows တွေကို alias သုံးပြီးသာ ရည်ညွှန်းရပါတယ်။ ဥပမာ — `RETURNING WITH (OLD AS o, NEW AS n) o.*, n.*`
- **output_expression** — `MERGE` command က row တစ်ခုချင်းစီ ပြောင်းလဲပြီးတိုင်း (insert, update ဒါမှမဟုတ် delete ဖြစ်ဖြစ်) — တွက်ချက်ပြီး ပြန်ပေးဖို့ expression တစ်ခု ဖြစ်ပါတယ်။ Expression က source ဒါမှမဟုတ် target tables တွေရဲ့ columns တွေ မှန်သမျှ ဒါမှမဟုတ် — execute လုပ်လိုက်တဲ့ action အကြောင်း ထပ်ဆောင်း အချက်အလက်တွေ ပြန်ပေးဖို့ — `merge_action()` function ကို သုံးနိုင်ပါတယ်။
`*` လို့ ရေးရင် — source table ကနေ columns တွေ အားလုံး၊ ပြီးတော့မှ target table ကနေ columns တွေ အားလုံးကို ပြန်ပေးပါလိမ့်မယ်။ Source နဲ့ target tables တွေမှာ column တူတွေ အများကြီး ရှိတတ်လို့ — ဒါက မကြာခဏဆိုသလို duplicate (ထပ်နေတဲ့) ရလဒ်တွေ အများကြီး ဖြစ်ပေါ်စေပါတယ်။ Source ဒါမှမဟုတ် target table ရဲ့ နာမည် ဒါမှမဟုတ် alias နဲ့ `*` ကို qualify လုပ်ခြင်းဖြင့် ဒါကို ရှောင်ရှားနိုင်ပါတယ်။
Column နာမည် တစ်ခု ဒါမှမဟုတ် `*` ကို — target table ကနေ အဟောင်း ဒါမှမဟုတ် အသစ် တန်ဖိုးတွေ ပြန်ပေးဖို့ — OLD ဒါမှမဟုတ် NEW၊ ဒါမှမဟုတ် OLD ဒါမှမဟုတ် NEW အတွက် သက်ဆိုင်တဲ့ output_alias နဲ့လည်း qualify လုပ်နိုင်ပါတယ်။ Target table ကနေ qualify မလုပ်ထားတဲ့ column နာမည် တစ်ခု ဒါမှမဟုတ် target table ရဲ့ နာမည် ဒါမှမဟုတ် alias နဲ့ qualify လုပ်ထားတဲ့ column နာမည် ဒါမှမဟုတ် `*` က — `INSERT` နဲ့ `UPDATE` actions တွေအတွက် အသစ် တန်ဖိုးတွေကို ပြန်ပေးပြီး — `DELETE` actions တွေအတွက်တော့ အဟောင်း တန်ဖိုးတွေကို ပြန်ပေးပါလိမ့်မယ်။
- **output_name** — ပြန်ပေးတဲ့ column တစ်ခုအတွက် သုံးမယ့် နာမည် တစ်ခု ဖြစ်ပါတယ်။

## Outputs (ရလဒ်များ)

အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ — `MERGE` command က အောက်ပါ ပုံစံ ရှိတဲ့ command tag တစ်ခုကို ပြန်ပေးပါတယ်

```sql
MERGE total_count
```

`total_count` က — ပြောင်းလဲလိုက်တဲ့ rows တွေ (insert, update ဒါမှမဟုတ် delete ဖြစ်ဖြစ်) ရဲ့ စုစုပေါင်း အရေအတွက် ဖြစ်ပါတယ်။ `total_count` က 0 ဆိုရင် — rows တွေကို ဘယ်လိုမှ မပြောင်းလဲခဲ့ဘူးလို့ ဆိုလိုပါတယ်။

`MERGE` command ထဲမှာ `RETURNING` clause ပါရင် — ရလဒ်က — command က insert, update ဒါမှမဟုတ် delete လုပ်လိုက်တဲ့ row(s) တွေပေါ်မှာ တွက်ချက်ထားပြီး — `RETURNING` list ထဲမှာ သတ်မှတ်ထားတဲ့ columns တွေနဲ့ တန်ဖိုးတွေ ပါဝင်တဲ့ — `SELECT` statement တစ်ခုရဲ့ ရလဒ်နဲ့ ဆင်တူပါလိမ့်မယ်။

## Notes (မှတ်စုများ)

အောက်ပါ အဆင့်တွေက `MERGE` ကို execute လုပ်နေစဉ်အတွင်း ဖြစ်ပေါ်ပါတယ်။

1. သတ်မှတ်ထားတဲ့ actions တွေ အားလုံးအတွက် — သူတို့ရဲ့ `WHEN` clauses တွေ ကိုက်ညီမှု ရှိသည်ဖြစ်စေ မရှိသည်ဖြစ်စေ — `BEFORE STATEMENT` triggers တွေကို လုပ်ဆောင်ပါ။
2. Source ကနေ target table ဆီ join တစ်ခုကို လုပ်ဆောင်ပါ။ ရလာတဲ့ query ကို ပုံမှန်အတိုင်း optimize လုပ်ပြီး — candidate change rows အစုတစ်စုကို ထုတ်ပေးပါလိမ့်မယ်။ Candidate change row တစ်ခုချင်းစီအတွက်:
   
   1. Row တစ်ခုချင်းစီဟာ `MATCHED`, `NOT MATCHED BY SOURCE` ဒါမှမဟုတ် `NOT MATCHED [BY TARGET]` ထဲက ဘယ်ဟာလဲ အကဲဖြတ်ပါ။
   2. `WHEN` condition တစ်ခုချင်းစီကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း — တစ်ခု true ပြန်မလာမချင်း — စမ်းသပ်ပါ။
   3. Condition တစ်ခု true ပြန်လာတဲ့အခါ — အောက်ပါ လုပ်ဆောင်ချက်တွေကို လုပ်ဆောင်ပါ:
   
      1. Action ရဲ့ event type အတွက် fire ဖြစ်တဲ့ `BEFORE ROW` triggers တွေ မှန်သမျှကို လုပ်ဆောင်ပါ။
      2. Target table ပေါ်က check constraints တွေကို invoke လုပ်ပြီး — သတ်မှတ်ထားတဲ့ action ကို လုပ်ဆောင်ပါ။
      3. Action ရဲ့ event type အတွက် fire ဖြစ်တဲ့ `AFTER ROW` triggers တွေ မှန်သမျှကို လုပ်ဆောင်ပါ။
      
      Target relation က action ရဲ့ event type အတွက် `INSTEAD OF ROW` triggers တွေ ပါတဲ့ view တစ်ခု ဆိုရင် — action ကို လုပ်ဆောင်ဖို့ အဲဒီ triggers တွေကို အစားထိုး သုံးပါတယ်။
3. သတ်မှတ်ထားတဲ့ actions တွေအတွက် — တကယ် ဖြစ်ပျက်သည်ဖြစ်စေ မဖြစ်သည်ဖြစ်စေ — `AFTER STATEMENT` triggers တွေကို လုပ်ဆောင်ပါ။ ဒါက — rows တွေကို ဘာမှ မပြုပြင်တဲ့ `UPDATE` statement တစ်ခုရဲ့ အပြုအမူနဲ့ ဆင်တူပါတယ်။

အနှစ်ချုပ်အနေနဲ့ — event type တစ်ခု (ဥပမာ `INSERT`) အတွက် statement triggers တွေက — အဲဒီလို action မျိုး သတ်မှတ်ထားတိုင်း fire လုပ်ပါလိမ့်မယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — row-level triggers တွေကတော့ — တကယ် execute ဖြစ်နေတဲ့ တိကျတဲ့ event type အတွက်ပဲ fire လုပ်ပါတယ်။ ဒါကြောင့် — `MERGE` command တစ်ခုက — `UPDATE` row triggers တွေပဲ fire လုပ်ခဲ့ရင်တောင် — `UPDATE` ရော `INSERT` အတွက်ပါ statement triggers တွေကို fire လုပ်နိုင်ပါတယ်။

Join က target row တစ်ခုချင်းစီအတွက် — candidate change row တစ်ခုထက် ပိုပြီး မထုတ်ဖို့ သေချာအောင် လုပ်သင့်ပါတယ်။ တစ်နည်းပြောရရင် — target row တစ်ခုက data source row တစ်ခုထက်ပိုပြီး join မလုပ်သင့်ပါဘူး။ ဒီလို ဖြစ်သွားရင် — candidate change rows တွေထဲက တစ်ခုပဲ target row ကို ပြုပြင်ဖို့ သုံးမှာ ဖြစ်ပြီး — နောက်ပိုင်း row ကို ပြုပြင်ဖို့ ကြိုးစားမှုတွေက error တစ်ခု ဖြစ်စေပါလိမ့်မယ်။ Row triggers တွေက target table ကို ပြောင်းလဲမှုတွေ လုပ်ပြီး — ဒီလို ပြုပြင်ထားတဲ့ rows တွေကို နောက်ပိုင်းမှာ `MERGE` က ထပ်ပြီး ပြုပြင်မိရင်လည်း ဒါ ဖြစ်နိုင်ပါတယ်။ ထပ်ခါထပ်ခါ လုပ်တဲ့ action က `INSERT` ဆိုရင် — uniqueness violation (ထူးခြားမှု ချိုးဖောက်မှု) တစ်ခု ဖြစ်စေပြီး — ထပ်ခါထပ်ခါ လုပ်တဲ့ `UPDATE` ဒါမှမဟုတ် `DELETE` ဆိုရင် — cardinality violation (အရေအတွက် ဆိုင်ရာ ချိုးဖောက်မှု) တစ်ခု ဖြစ်စေပါတယ်; နောက်ဆုံး အပြုအမူကို SQL standard က လိုအပ်ပါတယ်။ ဒါက — row တစ်ခုတည်းကို ပြုပြင်ဖို့ ဒုတိယ နဲ့ နောက်ဆက်တွဲ ကြိုးစားမှုတွေကို ရိုးရိုး လျစ်လျူရှုခဲ့တဲ့ — `UPDATE` နဲ့ `DELETE` statements တွေထဲက joins တွေရဲ့ သမိုင်းဝင် PostgreSQL အပြုအမူနဲ့ ကွဲပြားပါတယ်။

`WHEN` clause တစ်ခုက `AND` sub-clause တစ်ခုကို ချန်လိုက်ရင် — အဲဒီ clause က အဲဒီ အမျိုးအစား (`MATCHED`, `NOT MATCHED BY SOURCE` ဒါမှမဟုတ် `NOT MATCHED [BY TARGET]`) ရဲ့ နောက်ဆုံး ရောက်ရှိနိုင်တဲ့ (reachable) clause ဖြစ်လာပါတယ်။ အဲဒီ အမျိုးအစားရဲ့ နောက်ပိုင်း `WHEN` clause တစ်ခုကို သတ်မှတ်ထားရင် — အဲဒါက သက်သေပြနိုင်လောက်အောင် ရောက်ရှိလို့ မရနိုင်တဲ့ဟာ ဖြစ်ပြီး — error တစ်ခု တက်ပါတယ်။ အမျိုးအစား တစ်ခုခုရဲ့ နောက်ဆုံး ရောက်ရှိနိုင်တဲ့ clause ကို လုံးဝ မသတ်မှတ်ထားဘူးဆိုရင် — candidate change row တစ်ခုအတွက် action ဘာမှ မလုပ်ဘဲ ဖြစ်နေနိုင်ပါတယ်။

Data source ကနေ rows တွေ ထုတ်ပေးတဲ့ အစဉ်က default အနေနဲ့ သေချာမှု မရှိပါဘူး (indeterminate)။ လိုအပ်ရင် — တစ်ပြိုင်နက် transactions တွေကြားက deadlocks တွေကို ရှောင်ဖို့ လိုအပ်နိုင်တဲ့ — တသမတ်တည်း အစဉ် (consistent ordering) တစ်ခုကို သတ်မှတ်ဖို့ `source_query` တစ်ခုကို သုံးနိုင်ပါတယ်။

`MERGE` ကို target table ကို ပြုပြင်တဲ့ တခြား commands တွေနဲ့ တစ်ပြိုင်နက် run တဲ့အခါ — ပုံမှန် transaction isolation rules တွေ ကျင့်သုံးပါတယ်; isolation level တစ်ခုချင်းစီမှာ ဘယ်လို အပြုအမူ ရှိလဲဆိုတဲ့ ရှင်းလင်းချက်အတွက် [အပိုင်း 13.2](/docs/postgresql/transaction-iso) ကို ကြည့်ပါ။ ထို့အပြင် — တစ်ပြိုင်နက် `INSERT` တစ်ခု ဖြစ်လာရင် `UPDATE` တစ်ခုကို run နိုင်စွမ်း ပေးတဲ့ — အစားထိုး statement တစ်ခုအနေနဲ့ `INSERT ... ON CONFLICT` ကို သုံးဖို့လည်း စဉ်းစားချင်စရာ ဖြစ်ပါတယ်။ Statement အမျိုးအစား နှစ်ခုကြားမှာ ကွဲပြားမှုတွေရော ကန့်သတ်ချက်တွေရော အမျိုးမျိုး ရှိပြီး — ၎င်းတို့က အပြန်အလှန် အစားထိုးလို့ မရပါဘူး။

## Examples (ဥပမာများ)

`recent_transactions` အသစ်တွေကို အခြေခံပြီး `customer_accounts` ပေါ်မှာ maintenance (ပြုပြင်ထိန်းသိမ်းမှု) လုပ်ဆောင်ရန်:

```sql
MERGE INTO customer_account ca
USING recent_transactions t
ON t.customer_id = ca.customer_id
WHEN MATCHED THEN
  UPDATE SET balance = balance + transaction_value
WHEN NOT MATCHED THEN
  INSERT (customer_id, balance)
  VALUES (t.customer_id, t.transaction_value);
```

ပစ္စည်း အသစ်တစ်ခုကို stock ပမာဏနဲ့အတူ insert လုပ်ဖို့ ကြိုးစားပါ။ ပစ္စည်းက အရင်ကတည်းက ရှိပြီးသားဆိုရင် — အဲဒီအစား ရှိပြီးသား ပစ္စည်းရဲ့ stock အရေအတွက်ကို update လုပ်ပါ။ Stock သုည ရှိတဲ့ entries တွေကို ခွင့်မပြုပါနဲ့။ ပြုလုပ်လိုက်တဲ့ ပြောင်းလဲမှုတွေ အားလုံးရဲ့ အသေးစိတ်တွေကို ပြန်ပေးပါ။

```sql
MERGE INTO wines w
USING wine_stock_changes s
ON s.winename = w.winename
WHEN NOT MATCHED AND s.stock_delta > 0 THEN
  INSERT VALUES(s.winename, s.stock_delta)
WHEN MATCHED AND w.stock + s.stock_delta > 0 THEN
  UPDATE SET stock = w.stock + s.stock_delta
WHEN MATCHED THEN
  DELETE
RETURNING merge_action(), w.winename, old.stock AS old_stock, new.stock AS new_stock;
```

`wine_stock_changes` table က ဥပမာအနေနဲ့ — database ထဲကို မကြာသေးမီက load လုပ်ထားတဲ့ temporary table တစ်ခု ဖြစ်နိုင်ပါတယ်။

အစားထိုး wine list တစ်ခုကို အခြေခံပြီး `wines` ကို update လုပ်ရန် — stock အသစ်တွေအတွက် rows တွေ ထည့်သွင်းပြီး — ပြောင်းလဲထားတဲ့ stock entries တွေကို update လုပ်ကာ — list အသစ်ထဲမှာ မပါတော့တဲ့ wines တွေကို ဖျက်ပါ။

```sql
MERGE INTO wines w
USING new_wine_list s
ON s.winename = w.winename
WHEN NOT MATCHED BY TARGET THEN
  INSERT VALUES(s.winename, s.stock)
WHEN MATCHED AND w.stock != s.stock THEN
  UPDATE SET stock = s.stock
WHEN NOT MATCHED BY SOURCE THEN
  DELETE;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ်။

`WITH` clause၊ `WHEN NOT MATCHED` အတွက် `BY SOURCE` နဲ့ `BY TARGET` qualifiers တွေ၊ `DO NOTHING` action နဲ့ `RETURNING` clause တို့က SQL standard ရဲ့ extensions တွေ ဖြစ်ပါတယ်။
