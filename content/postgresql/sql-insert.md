---
title: "INSERT (table ထဲသို့ rows အသစ်များ ထည့်သွင်းခြင်း)"
description: "Table တစ်ခုထဲသို့ rows အသစ်များ ထည့်သွင်းပေးတဲ့ command — VALUES, DEFAULT VALUES, query များဖြင့် rows ထည့်သွင်းခြင်း၊ ON CONFLICT (UPSERT) clause နှင့် RETURNING clause အသေးစိတ်"
order: 152
source: "https://www.postgresql.org/docs/current/sql-insert.html"
status: translated
updated: 2026-09-04
---

## INSERT (table ထဲသို့ rows အသစ်များ ထည့်သွင်းခြင်း)

INSERT — table တစ်ခုထဲသို့ rows အသစ်များ ဖန်တီး ထည့်သွင်းပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
[ WITH [ RECURSIVE ] with_query [, ...] ]
INSERT INTO table_name [ AS alias ] [ ( column_name [, ...] ) ]
    [ OVERRIDING { SYSTEM | USER } VALUE ]
    { DEFAULT VALUES | VALUES ( { expression | DEFAULT } [, ...] ) [, ...] | query }
    [ ON CONFLICT [ conflict_target ] conflict_action ]
    [ RETURNING [ WITH ( { OLD | NEW } AS output_alias [, ...] ) ]
                { * | output_expression [ [ AS ] output_name ] } [, ...] ]

where conflict_target can be one of:

    ( { index_column_name | ( index_expression ) } [ COLLATE collation ] [ opclass ] [, ...] ) [ WHERE index_predicate ]
    ON CONSTRAINT constraint_name

and conflict_action is one of:

    DO NOTHING
    DO UPDATE SET { column_name = { expression | DEFAULT } |
                    ( column_name [, ...] ) = [ ROW ] ( { expression | DEFAULT } [, ...] ) |
                    ( column_name [, ...] ) = ( sub-SELECT )
                  } [, ...]
              [ WHERE condition ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`INSERT` က table တစ်ခုထဲသို့ rows အသစ်များကို ထည့်သွင်းပေးပါတယ်။ Value expressions (တန်ဖိုး expressions) တွေနဲ့ သတ်မှတ်ထားတဲ့ row တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ rows တွေ၊ ဒါမှမဟုတ် query တစ်ခုကနေ ထွက်လာတဲ့ row သုည ဒါမှမဟုတ် သုညထက် ပိုတဲ့ rows တွေကို ထည့်သွင်းနိုင်ပါတယ်။

Target column နာမည်တွေကို ဘယ်အစဉ်နဲ့မဆို စာရင်းပြုလို့ ရပါတယ်။ Column နာမည် စာရင်း တစ်ခုလုံး မပေးဘူးဆိုရင် — default အနေနဲ့ — table ရဲ့ column တွေ အားလုံးကို သူတို့ ကြေညာထားတဲ့ (declared) အစဉ်အတိုင်း ယူဆပါတယ်; ဒါမှမဟုတ် — `VALUES` clause ဒါမှမဟုတ် `query` ကနေ column `N` ခုပဲ ထောက်ပံ့ပေးထားရင် — ပထမ column နာမည် `N` ခုကိုပဲ ယူဆပါတယ်။ `VALUES` clause ဒါမှမဟုတ် `query` ကနေ ထောက်ပံ့ပေးတဲ့ တန်ဖိုးတွေကို — explicit ဖြစ်စေ implicit ဖြစ်စေ — column စာရင်းနဲ့ ဘယ်မှညာသို့ အစဉ်လိုက် ဆက်စပ်ပေးပါတယ်။

Explicit ဒါမှမဟုတ် implicit column စာရင်းထဲမှာ မပါဝင်တဲ့ column တစ်ခုချင်းစီကို — default တန်ဖိုးတစ်ခုနဲ့ ဖြည့်ပေးပါတယ် — ကြေညာထားတဲ့ default တန်ဖိုး ရှိရင် အဲဒါ၊ မရှိရင် null ဖြစ်ပါတယ်။

Column တစ်ခုခုအတွက် expression က မှန်ကန်တဲ့ data type မဟုတ်ဘူးဆိုရင် — automatic type conversion (အလိုအလျောက် type ပြောင်းလဲခြင်း) ကို ကြိုးစား လုပ်ဆောင်ပါလိမ့်မယ်။

Unique indexes မရှိတဲ့ tables တွေထဲသို့ `INSERT` လုပ်တာကို — concurrent (တစ်ပြိုင်နက်) လုပ်ဆောင်မှုတွေက ပိတ်ဆို့မှာ မဟုတ်ပါဘူး။ Unique indexes ရှိတဲ့ tables တွေမှာတော့ — concurrent sessions တွေက — ထည့်သွင်းနေတဲ့ unique index တန်ဖိုးတွေနဲ့ ကိုက်ညီတဲ့ rows တွေကို lock လုပ်တာ ဒါမှမဟုတ် ပြုပြင်မွမ်းမံတာမျိုး လုပ်ဆောင်နေရင် — ပိတ်ဆို့မှု ဖြစ်နိုင်ပါတယ်; အသေးစိတ်တွေကို [အပိုင်း 63.5](https://www.postgresql.org/docs/current/index-unique-checks.html) မှာ ဖော်ပြထားပါတယ်။ Unique constraint ဒါမှမဟုတ် exclusion constraint violation error တစ်ခု ထွက်ပေါ်စေမယ့်အစား — အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်တစ်ခုကို သတ်မှတ်ဖို့ `ON CONFLICT` ကို သုံးနိုင်ပါတယ် (အောက်မှာ ဖော်ပြထားတဲ့ ON CONFLICT Clause ကို ကြည့်ပါ)။

Optional ဖြစ်တဲ့ `RETURNING` clause က — `INSERT` ကို — တကယ် ထည့်သွင်းလိုက်တဲ့ (ဒါမှမဟုတ် — `ON CONFLICT DO UPDATE` clause သုံးခဲ့ရင် — update လုပ်လိုက်တဲ့) row တစ်ခုစီကို အခြေခံပြီး တန်ဖိုး(များ) တွက်ချက် ပြန်ပေးစေပါတယ်။ Serial sequence number လိုမျိုး — default တန်ဖိုးတွေကနေ ထောက်ပံ့ပေးလိုက်တဲ့ တန်ဖိုးတွေကို ရယူဖို့ ဒါက အဓိက အသုံးဝင်ပါတယ်။ ဒါပေမယ့် — table ရဲ့ columns တွေကို သုံးထားတဲ့ ဘယ် expression ကိုမဆို ခွင့်ပြုပါတယ်။ `RETURNING` စာရင်းရဲ့ syntax က `SELECT` ရဲ့ output list နဲ့ အတူတူပါပဲ။ အောင်မြင်စွာ ထည့်သွင်းခဲ့တဲ့ ဒါမှမဟုတ် update လုပ်ခဲ့တဲ့ rows တွေကိုပဲ ပြန်ပေးမှာ ဖြစ်ပါတယ်။ ဥပမာ — `ON CONFLICT DO UPDATE ... WHERE` clause ရဲ့ `condition` က မကျေနပ်လို့ — row တစ်ခု lock ဖြစ်ခဲ့ပေမယ့် update မလုပ်ခဲ့ရဘူးဆိုရင် — အဲဒီ row ကို ပြန်ပေးမှာ မဟုတ်ပါဘူး။

Table တစ်ခုထဲသို့ ထည့်သွင်းနိုင်ဖို့ — အဲဒီ table ပေါ်မှာ `INSERT` privilege ရှိရပါမယ်။ `ON CONFLICT DO UPDATE` ပါဝင်နေရင် — table ပေါ်မှာ `UPDATE` privilege လည်း လိုအပ်ပါတယ်။

Column စာရင်း သတ်မှတ်ထားရင် — စာရင်းထဲက column တွေပေါ်မှာပဲ `INSERT` privilege လိုအပ်ပါတယ်။ အလားတူပဲ — `ON CONFLICT DO UPDATE` သတ်မှတ်ထားရင် — update လုပ်ဖို့ စာရင်းထည့်ထားတဲ့ column(များ) ပေါ်မှာပဲ `UPDATE` privilege လိုအပ်ပါတယ်။ ဒါပေမယ့် — `ON CONFLICT` ရဲ့ ပုံစံတွေ အားလုံးမှာ — တန်ဖိုးတွေ ဖတ်ရှုခံရတဲ့ column တိုင်းပေါ်မှာ `SELECT` privilege လည်း လိုအပ်ပါတယ်။ ဒီထဲမှာ — `conflict_target` ထဲမှာ ဖော်ပြထားတဲ့ column တိုင်း (arbiter constraint က ရည်ညွှန်းတဲ့ columns တွေ အပါအဝင်) ရော — `ON CONFLICT DO UPDATE` ရဲ့ `expression` ဒါမှမဟုတ် `WHERE` clause ရဲ့ `condition` ထဲမှာ ဖော်ပြထားတဲ့ column တိုင်းပါ ပါဝင်ပါတယ်။

`RETURNING` clause ကို သုံးတာက — `RETURNING` ထဲမှာ ဖော်ပြထားတဲ့ columns တွေ အားလုံးပေါ်မှာ `SELECT` privilege လိုအပ်ပါတယ်။ `query` clause ကို သုံးပြီး query တစ်ခုကနေ rows တွေ ထည့်သွင်းရင် — query ထဲမှာ သုံးထားတဲ့ table ဒါမှမဟုတ် column တိုင်းပေါ်မှာ `SELECT` privilege ရှိဖို့ သေချာပေါက် လိုအပ်ပါတယ်။

## Parameters (parameter များ)

### Inserting (row အသစ်များ ထည့်သွင်းခြင်း)

ဒီ section မှာ — rows အသစ်များကိုသာ ထည့်သွင်းနေတဲ့အခါ သုံးနိုင်တဲ့ parameters တွေကို ဖော်ပြထားပါတယ်။ `ON CONFLICT` clause နဲ့သာ သီးသန့် သုံးတဲ့ parameters တွေကိုတော့ သပ်သပ်စီ ဖော်ပြထားပါတယ်။

- **with_query** — `WITH` clause က — `INSERT` query ထဲမှာ နာမည်နဲ့ ရည်ညွှန်းလို့ရတဲ့ subquery တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို သတ်မှတ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 7.8 နဲ့ SELECT ကို ကြည့်ပါ။
Query (SELECT statement) ထဲမှာလည်း `WITH` clause တစ်ခု ပါဝင်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမှာ — with_query နှစ်စုံလုံးကို query ထဲမှာ ရည်ညွှန်းလို့ ရနိုင်ပေမယ့် — ဒုတိယ တစ်စုံက ပိုပြီး နီးကပ်စွာ nested (အထပ်ထပ် မြှုပ်နှံ) ဖြစ်နေလို့ — ဦးစားပေး ယူပါတယ်။

- **table_name** — ရှိပြီးသား table တစ်ခုရဲ့ နာမည် (schema-qualified (schema နာမည်နဲ့ ရှေ့ဆွဲထား) ဖြစ်လည်း ရပါတယ်)။

- **alias** — `table_name` အတွက် အစားထိုး နာမည်တစ်ခု။ Alias ပေးထားရင် — table ရဲ့ တကယ့် နာမည်ကို လုံးဝ ဖုံးကွယ်လိုက်ပါတယ်။ `ON CONFLICT DO UPDATE` က `excluded` လို့ နာမည်ပေးထားတဲ့ table တစ်ခုကို target လုပ်တဲ့အခါ ဒါက အထူးသဖြင့် အသုံးဝင်ပါတယ် — ဘာလို့လဲဆိုတော့ — မဟုတ်ရင် အဲဒီ နာမည်ကို — ထည့်သွင်းဖို့ အဆိုပြုထားတဲ့ row ကို ကိုယ်စားပြုတဲ့ အထူး table ရဲ့ နာမည်လို့ ယူဆခံရလို့ပါ။

- **column_name** — `table_name` နဲ့ နာမည်ပေးထားတဲ့ table ထဲက column တစ်ခုရဲ့ နာမည်။ လိုအပ်ရင် — column နာမည်ကို subfield နာမည် ဒါမှမဟုတ် array subscript နဲ့ qualified (အသေးစိတ် သတ်မှတ်) လုပ်နိုင်ပါတယ်။ (Composite column တစ်ခုရဲ့ field တချို့ထဲကိုပဲ ထည့်သွင်းတာက — ကျန် field တွေကို null အဖြစ် ချန်ထားပါတယ်။) `ON CONFLICT DO UPDATE` နဲ့ column တစ်ခုကို ရည်ညွှန်းတဲ့အခါ — target column ရဲ့ သတ်မှတ်ချက်ထဲမှာ table ရဲ့ နာမည် မထည့်ပါနဲ့။ ဥပမာ — `INSERT INTO table_name ... ON CONFLICT DO UPDATE SET table_name.col = 1` ဆိုတာ invalid (မမှန်ကန်) ပါ (ဒါက UPDATE အတွက် ယေဘုယျ အပြုအမူအတိုင်း ဖြစ်ပါတယ်)။

- **OVERRIDING SYSTEM VALUE** — ဒီ clause ကို သတ်မှတ်ထားရင် — identity columns တွေအတွက် ထောက်ပံ့ပေးထားတဲ့ တန်ဖိုး တစ်ခုခုက — default အနေနဲ့ sequence ကနေ ထုတ်ပေးတဲ့ တန်ဖိုးတွေကို override (အစားထိုး) လုပ်ပါလိမ့်မယ်။
`GENERATED ALWAYS` အဖြစ် သတ်မှတ်ထားတဲ့ identity column တစ်ခုအတွက် — `OVERRIDING SYSTEM VALUE` ဒါမှမဟုတ် `OVERRIDING USER VALUE` ထဲက တစ်ခုခုကို မသတ်မှတ်ဘဲ — explicit တန်ဖိုး (DEFAULT ကလွဲလို့) တစ်ခု ထည့်သွင်းတာက error ပါ။ (`GENERATED BY DEFAULT` အဖြစ် သတ်မှတ်ထားတဲ့ identity column တစ်ခုအတွက်တော့ — `OVERRIDING SYSTEM VALUE` က သာမန် အပြုအမူ ဖြစ်ပြီး — သတ်မှတ်ပေးရင်လည်း ဘာမှ ထူးခြားမှု မရှိပါဘူး — ဒါပေမယ့် PostgreSQL က extension (ထပ်ဆောင်း လုပ်ဆောင်ချက်) အနေနဲ့ ခွင့်ပြုပါတယ်။)

- **OVERRIDING USER VALUE** — ဒီ clause ကို သတ်မှတ်ထားရင် — identity columns တွေအတွက် ထောက်ပံ့ပေးထားတဲ့ တန်ဖိုး တစ်ခုခုကို လျစ်လျူရှုပြီး — default အနေနဲ့ sequence ကနေ ထုတ်ပေးတဲ့ တန်ဖိုးတွေကို သက်ရောက်စေပါတယ်။
ဥပမာ — tables တွေကြားမှာ တန်ဖိုးတွေ ကူးယူတဲ့အခါ ဒီ clause က အသုံးဝင်ပါတယ်။ `INSERT INTO tbl2 OVERRIDING USER VALUE SELECT * FROM tbl1` လို့ ရေးတာက — `tbl2` ထဲမှာ identity columns မဟုတ်တဲ့ column တွေ အားလုံးကို `tbl1` ကနေ ကူးယူပြီး — `tbl2` ထဲက identity columns တွေရဲ့ တန်ဖိုးတွေကိုတော့ — `tbl2` နဲ့ ဆက်စပ်နေတဲ့ sequences တွေကနေ ထုတ်ပေးပါလိမ့်မယ်။

- **DEFAULT VALUES** — Column တွေ အားလုံးကို သူတို့ရဲ့ default တန်ဖိုးတွေနဲ့ ဖြည့်ပေးပါတယ် — column တစ်ခုချင်းစီအတွက် DEFAULT ကို explicit သတ်မှတ်ထားသလိုပါပဲ။ (ဒီပုံစံမှာ OVERRIDING clause ကို ခွင့်မပြုပါဘူး။)

- **expression** — သက်ဆိုင်ရာ column ကို သတ်မှတ်ပေးဖို့ expression တစ်ခု ဒါမှမဟုတ် တန်ဖိုးတစ်ခု။

- **DEFAULT** — သက်ဆိုင်ရာ column ကို သူ့ရဲ့ default တန်ဖိုးနဲ့ ဖြည့်ပေးပါလိမ့်မယ်။ Identity column တစ်ခုဆိုရင် — ဆက်စပ်နေတဲ့ sequence ကနေ ထုတ်ပေးလိုက်တဲ့ တန်ဖိုးအသစ်တစ်ခုနဲ့ ဖြည့်ပေးပါလိမ့်မယ်။ Generated column တစ်ခုအတွက် — ဒါကို သတ်မှတ်ပေးတာ ခွင့်ပြုပေမယ့် — column ကို သူ့ရဲ့ generation expression ကနေ တွက်ချက်တဲ့ သာမန် အပြုအမူကိုပဲ သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်။

- **query** — ထည့်သွင်းရမယ့် rows တွေကို ထောက်ပံ့ပေးတဲ့ query (SELECT statement) တစ်ခု။ Syntax ရဲ့ ဖော်ပြချက်အတွက် SELECT statement ကို ရည်ညွှန်း ကြည့်ပါ။

- **output_alias** — `RETURNING` စာရင်းထဲမှာ OLD ဒါမှမဟုတ် NEW rows တွေအတွက် optional အစားထိုး နာမည်တစ်ခု။
Default အနေနဲ့ — target table ကနေ ရှေးတန်ဖိုးတွေကို OLD.column_name ဒါမှမဟုတ် OLD.* လို့ ရေးပြီး ပြန်ယူလို့ ရပြီး — တန်ဖိုးအသစ်တွေကို NEW.column_name ဒါမှမဟုတ် NEW.* လို့ ရေးပြီး ပြန်ယူလို့ ရပါတယ်။ Alias ပေးထားရင် — ဒီနာမည်တွေက ဖုံးကွယ်ခံရပြီး — ရှေး ဒါမှမဟုတ် အသစ် rows တွေကို alias ကို သုံးပြီးသာ ရည်ညွှန်းရပါမယ်။ ဥပမာ — RETURNING WITH (OLD AS o, NEW AS n) o.*, n.* လို့ ရေးရပါတယ်။

- **output_expression** — Row တစ်ခုစီ ထည့်သွင်းပြီး ဒါမှမဟုတ် update လုပ်ပြီးနောက် — `INSERT` command က တွက်ချက် ပြန်ပေးမယ့် expression တစ်ခု။ Expression က — `table_name` နဲ့ နာမည်ပေးထားတဲ့ table ရဲ့ column နာမည် တစ်ခုခုကို သုံးနိုင်ပါတယ်။ ထည့်သွင်းလိုက်တဲ့ ဒါမှမဟုတ် update လုပ်လိုက်တဲ့ row(များ) ရဲ့ column တွေ အားလုံးကို ပြန်ပေးဖို့ `*` လို့ ရေးပါ။
Column နာမည် ဒါမှမဟုတ် `*` ကို — OLD ဒါမှမဟုတ် NEW၊ ဒါမှမဟုတ် OLD နဲ့ NEW အတွက် သက်ဆိုင်ရာ output_alias နဲ့ qualified လုပ်ပြီး — ရှေး ဒါမှမဟုတ် အသစ် တန်ဖိုးတွေ ပြန်ပေးဖို့ လုပ်နိုင်ပါတယ်။ Qualified မလုပ်ထားတဲ့ column နာမည် ဒါမှမဟုတ် `*`၊ ဒါမှမဟုတ် — target table ရဲ့ နာမည် ဒါမှမဟုတ် alias နဲ့ qualified လုပ်ထားတဲ့ column နာမည် ဒါမှမဟုတ် `*` ကတော့ — တန်ဖိုးအသစ်တွေကို ပြန်ပေးပါလိမ့်မယ်။
ရိုးရှင်းတဲ့ INSERT အတွက်တော့ — ရှေးတန်ဖိုးတွေ အားလုံးက NULL ဖြစ်ပါလိမ့်မယ်။ ဒါပေမယ့် — `ON CONFLICT DO UPDATE` clause ပါတဲ့ INSERT အတွက်တော့ — ရှေးတန်ဖိုးတွေက NULL မဟုတ်တာ ဖြစ်နိုင်ပါတယ်။

- **output_name** — ပြန်ပေးလိုက်တဲ့ column တစ်ခုအတွက် သုံးမယ့် နာမည်တစ်ခု။

### `ON CONFLICT` Clause (ON CONFLICT clause အကြောင်း)

Optional ဖြစ်တဲ့ `ON CONFLICT` clause က — unique violation ဒါမှမဟုတ် exclusion constraint violation error ထွက်ပေါ်စေမယ့်အစား — အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ထည့်သွင်းဖို့ အဆိုပြုထားတဲ့ row တစ်ခုချင်းစီအတွက် — ထည့်သွင်းမှု ဆက်လုပ်ဖြစ်စေ၊ ဒါမှမဟုတ် — `conflict_target` က သတ်မှတ်ထားတဲ့ arbiter constraint ဒါမှမဟုတ် index တစ်ခု ချိုးဖောက်ခံရရင် — အခြားရွေးချယ်စရာ `conflict_action` ကို လုပ်ဆောင်ဖြစ်စေ ပြုလုပ်ပါတယ်။ `ON CONFLICT DO NOTHING` က — အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်အနေနဲ့ — row တစ်ခုကို ထည့်သွင်းတာကိုပဲ ရှောင်ရှားပေးပါတယ်။ `ON CONFLICT DO UPDATE` ကတော့ — အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်အနေနဲ့ — ထည့်သွင်းဖို့ အဆိုပြုထားတဲ့ row နဲ့ ပဋိပက္ခ ဖြစ်နေတဲ့ ရှိပြီးသား row ကို update လုပ်ပါတယ်။

`conflict_target` က unique index inference (ကောက်ချက်ချ သတ်မှတ်ခြင်း) ကို လုပ်ဆောင်နိုင်ပါတယ်။ Inference လုပ်ဆောင်တဲ့အခါ — ၎င်းမှာ `index_column_name` columns (တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို) ရော၊ `index_expression` expressions (တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို) ရောပါ (and/or) ပါဝင်နိုင်ပြီး — optional `index_predicate` တစ်ခုလည်း ပါဝင်နိုင်ပါတယ်။ အစဉ်လိုက် ထည့်တွက်စရာ မလိုဘဲ — `conflict_target` က သတ်မှတ်ထားတဲ့ columns/expressions တွေကို အတိအကျ ပါဝင်တဲ့ — `table_name` ရဲ့ unique indexes တွေ အားလုံးကို — arbiter indexes အဖြစ် inference (ကောက်ချက်ချ ရွေးချယ်) လုပ်ပါတယ်။ `index_predicate` သတ်မှတ်ထားရင် — inference အတွက် နောက်ထပ် လိုအပ်ချက်အနေနဲ့ — arbiter indexes တွေကို ကျေနပ်စေရပါမယ်။ ဒါက — တခြား စံနှုန်းတွေ အားလုံးကို ကျေနပ်စေတဲ့ index တစ်ခု ရနိုင်ရင် — partial မဟုတ်တဲ့ unique index (predicate မပါတဲ့ unique index) တစ်ခုကိုပါ inference လုပ်လိမ့်မယ် (ဒါကြောင့် `ON CONFLICT` က သုံးလိမ့်မယ်) လို့ ဆိုလိုပါတယ်။ Inference ကြိုးစားမှု မအောင်မြင်ရင် — error တစ်ခု ထွက်ပေါ်ပါတယ်။

`ON CONFLICT DO UPDATE` က — atomic (တစ်ခုလုံး ပေါင်းစပ်) ဖြစ်တဲ့ `INSERT` ဒါမှမဟုတ် `UPDATE` ရလဒ်တစ်ခုကို အာမခံပါတယ်; သီးခြား error တစ်ခုခု မရှိဘူးဆိုရင် — concurrency မြင့်မားနေတဲ့ အခြေအနေမှာတောင် — အဲဒီ ရလဒ် နှစ်ခုထဲက တစ်ခုကို အာမခံပါတယ်။ ဒါကို `UPSERT` — "UPDATE or INSERT" လို့လည်း ခေါ်ပါတယ်။

- **conflict_target** — Arbiter indexes တွေကို ရွေးချယ်ခြင်းအားဖြင့် — `ON CONFLICT` က ဘယ်ပဋိပက္ခတွေအတွက် အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်ကို လုပ်ဆောင်မလဲ သတ်မှတ်ပေးပါတယ်။ Unique index inference ကို လုပ်ဆောင်ဖြစ်စေ၊ constraint တစ်ခုကို နာမည်နဲ့ explicit သတ်မှတ်ဖြစ်စေ ပြုလုပ်ပါတယ်။ `ON CONFLICT DO NOTHING` အတွက်တော့ — conflict_target သတ်မှတ်ပေးတာ optional ပါ; ချန်လိုက်ရင် — သုံးလို့ရတဲ့ constraints (နဲ့ unique indexes) တွေ အားလုံးနဲ့ ပဋိပက္ခတွေကို ကိုင်တွယ်ပါတယ်။ `ON CONFLICT DO UPDATE` အတွက်တော့ — conflict_target တစ်ခု ပေးရပါမယ်။

- **conflict_action** — conflict_action က `ON CONFLICT` ရဲ့ အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ၎င်းက — DO NOTHING ဖြစ်နိုင်သလို — ပဋိပက္ခ ဖြစ်တဲ့အခါ လုပ်ဆောင်ရမယ့် UPDATE လုပ်ဆောင်ချက်ရဲ့ တိကျတဲ့ အသေးစိတ်တွေကို သတ်မှတ်ပေးတဲ့ DO UPDATE clause တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ `ON CONFLICT DO UPDATE` ထဲက SET နဲ့ WHERE clauses တွေက — ရှိပြီးသား row ကို table ရဲ့ နာမည် (ဒါမှမဟုတ် alias) သုံးပြီး၊ ထည့်သွင်းဖို့ အဆိုပြုထားတဲ့ row ကိုတော့ အထူး `excluded` table သုံးပြီး — ဝင်ရောက်နိုင်ပါတယ်။ သက်ဆိုင်ရာ excluded columns တွေ ဖတ်ရှုခံရတဲ့ — target table ထဲက column တိုင်းပေါ်မှာ `SELECT` privilege လိုအပ်ပါတယ်။
Row တစ်ခုချင်းစီအတွက် BEFORE INSERT triggers တွေရဲ့ သက်ရောက်မှုတွေ အားလုံးက — excluded values တွေထဲမှာ ထင်ဟပ်နေတယ်ဆိုတာ သတိပြုပါ — ဘာလို့လဲဆိုတော့ — အဲဒီ သက်ရောက်မှုတွေက — row ကို ထည့်သွင်းမှုကနေ ဖယ်ထုတ်ခံရဖို့ ဖြစ်စေတဲ့နေရာမှာ ပါဝင်နိုင်လို့ပါ။

- **index_column_name** — `table_name` ရဲ့ column တစ်ခုရဲ့ နာမည်။ Arbiter indexes တွေကို inference လုပ်ဖို့ သုံးပါတယ်။ CREATE INDEX format အတိုင်း လိုက်နာပါတယ်။ `index_column_name` ပေါ်မှာ `SELECT` privilege လိုအပ်ပါတယ်။

- **index_expression** — `index_column_name` နဲ့ ဆင်တူပေမယ့် — index definitions တွေထဲမှာ ပေါ်နေတဲ့ (ရိုးရိုး columns မဟုတ်တဲ့) `table_name` columns တွေပေါ်က expressions တွေကို inference လုပ်ဖို့ သုံးပါတယ်။ CREATE INDEX format အတိုင်း လိုက်နာပါတယ်။ `index_expression` ထဲမှာ ပေါ်နေတဲ့ column တိုင်းပေါ်မှာ `SELECT` privilege လိုအပ်ပါတယ်။

- **collation** — သတ်မှတ်ထားရင် — သက်ဆိုင်ရာ `index_column_name` ဒါမှမဟုတ် `index_expression` က — inference လုပ်နေစဉ်မှာ ကိုက်ညီမှု ရှိဖို့ — သီးခြား collation တစ်ခုကို သုံးရမယ်လို့ ပြဌာန်းပါတယ်။ ပုံမှန်အားဖြင့် ဒါကို ချန်လိုက်ပါတယ် — ဘာလို့လဲဆိုတော့ — collations တွေက များသောအားဖြင့် — constraint violation ဖြစ်မဖြစ်ဆိုတာကို သက်ရောက်မှု မရှိလို့ပါ။ CREATE INDEX format အတိုင်း လိုက်နာပါတယ်။

- **opclass** — သတ်မှတ်ထားရင် — သက်ဆိုင်ရာ `index_column_name` ဒါမှမဟုတ် `index_expression` က — inference လုပ်နေစဉ်မှာ ကိုက်ညီမှု ရှိဖို့ — သီးခြား operator class တစ်ခုကို သုံးရမယ်လို့ ပြဌာန်းပါတယ်။ ပုံမှန်အားဖြင့် ဒါကို ချန်လိုက်ပါတယ် — ဘာလို့လဲဆိုတော့ — equality semantics တွေက type တစ်ခုရဲ့ operator classes တွေအနှံ့မှာ မကြာခဏ ညီမျှနေတတ်လို့ ဒါမှမဟုတ် — သတ်မှတ်ထားပြီးသား unique indexes တွေမှာ သင့်လျော်တဲ့ equality အဓိပ္ပါယ် ရှိတယ်ဆိုတာ ယုံကြည်လိုက်ရုံနဲ့ လုံလောက်လို့ပါ။ CREATE INDEX format အတိုင်း လိုက်နာပါတယ်။

- **index_predicate** — Partial unique indexes တွေကို inference လုပ်ခွင့် ပေးဖို့ သုံးပါတယ်။ Predicate ကို ကျေနပ်စေတဲ့ (တကယ်တော့ partial indexes ဖြစ်ဖို့ မလိုတဲ့) indexes တွေ တစ်ခုခုကို inference လုပ်နိုင်ပါတယ်။ CREATE INDEX format အတိုင်း လိုက်နာပါတယ်။ `index_predicate` ထဲမှာ ပေါ်နေတဲ့ column တိုင်းပေါ်မှာ `SELECT` privilege လိုအပ်ပါတယ်။

- **constraint_name** — Constraint ဒါမှမဟုတ် index တစ်ခုကို inference လုပ်မယ့်အစား — arbiter constraint တစ်ခုကို နာမည်နဲ့ explicit သတ်မှတ်ပေးပါတယ်။

- **condition** — Boolean type တန်ဖိုးတစ်ခု ပြန်ပေးတဲ့ expression တစ်ခု။ ဒီ expression က true ပြန်ပေးတဲ့ rows တွေကိုပဲ update လုပ်မှာ ဖြစ်ပေမယ့် — `ON CONFLICT DO UPDATE` လုပ်ဆောင်ချက်ကို လုပ်ဆောင်တဲ့အခါ rows အားလုံးကို lock လုပ်ပါတယ်။ Condition ကို — ပဋိပက္ခတစ်ခုကို update လုပ်ဖို့ ကိုယ်စားလှယ်အဖြစ် ဖော်ထုတ်ပြီးမှ — နောက်ဆုံးမှာ အကဲဖြတ်တယ်ဆိုတာ သတိပြုပါ။

Exclusion constraints တွေကို `ON CONFLICT DO UPDATE` နဲ့ arbiter (ခုံဖြတ် စီရင်ရာမှာ သုံးသော) အဖြစ် ထောက်ပံ့မထားဘူးဆိုတာ သတိပြုပါ။ ကိစ္စအားလုံးမှာ — `NOT DEFERRABLE` constraints တွေနဲ့ unique indexes တွေကိုပဲ arbiter အဖြစ် ထောက်ပံ့ပါတယ်။

`ON CONFLICT DO UPDATE` clause ပါတဲ့ `INSERT` က "deterministic" (ခန့်မှန်းလို့ရတဲ့) statement တစ်ခု ဖြစ်ပါတယ်။ ဆိုလိုတာက — command က — ရှိပြီးသား row တစ်ခုတည်းကို တစ်ကြိမ်ထက်ပိုပြီး သက်ရောက်ခွင့် ရှိမှာ မဟုတ်ပါဘူး; အဲဒီလို အခြေအနေ ဖြစ်လာရင် — cardinality violation error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။ ထည့်သွင်းဖို့ အဆိုပြုထားတဲ့ rows တွေက — arbiter index ဒါမှမဟုတ် constraint တစ်ခုက ကန့်သတ်ထားတဲ့ attributes တွေရဲ့ ပုံစံနဲ့ — အချင်းချင်း duplicate (ထပ်နေ) မဖြစ်သင့်ပါဘူး။

Partitioned table တစ်ခုကို သက်ရောက်တဲ့ `INSERT` ရဲ့ `ON CONFLICT DO UPDATE` clause က — ပဋိပက္ခ ဖြစ်နေတဲ့ row တစ်ခုရဲ့ partition key ကို — အဲဒီ row ကို partition အသစ်တစ်ခုဆီ ရွှေ့ပြောင်းဖို့ လိုအပ်စေမယ့်ပုံစံနဲ့ — update လုပ်တာကို လောလောဆယ် ထောက်ပံ့မထားဘူးဆိုတာ သတိပြုပါ။

> **အကြံပြုချက်:** `ON CONFLICT ON CONSTRAINT` `constraint_name` နဲ့ constraint တစ်ခုကို တိုက်ရိုက် နာမည်ပေးပြီး သုံးမယ့်အစား — unique index inference ကို သုံးတာက မကြာခဏ ပိုနှစ်သက်စရာ ကောင်းပါတယ်။ အောက်ခံ index ကို — တစ်ခုနဲ့တစ်ခု ထပ်နေတဲ့ပုံစံနဲ့ — ပိုသင့်လျော် ဒါမှမဟုတ် ညီမျှလောက်တဲ့ index တစ်ခုနဲ့ အစားထိုးလိုက်ရင်တောင် — inference က မှန်မှန်ကန်ကန် ဆက်အလုပ်လုပ်နေပါလိမ့်မယ် — ဥပမာ — အစားထိုးလိုက်တဲ့ index ကို drop မလုပ်ခင် `CREATE UNIQUE INDEX ... CONCURRENTLY` ကို သုံးတဲ့အခါမျိုးပါ။

> **သတိပေးချက်:** Unique index တစ်ခုပေါ်မှာ `CREATE INDEX CONCURRENTLY` ဒါမှမဟုတ် `REINDEX CONCURRENTLY` run လုပ်နေချိန်မှာ — table တစ်ခုတည်းပေါ်မှာရှိတဲ့ `INSERT ... ON CONFLICT` statements တွေက — မထင်မှတ်ဘဲ unique violation နဲ့ မအောင်မြင်ဘဲ ဖြစ်သွားနိုင်ပါတယ်။

## Outputs (ရလဒ်များ)

အောင်မြင်စွာ ပြီးဆုံးချိန်မှာ — `INSERT` command တစ်ခုက အောက်ပါပုံစံ command tag တစ်ခုကို ပြန်ပေးပါတယ်:

```sql
INSERT oid count
```

`count` ဆိုတာ — ထည့်သွင်းလိုက်တဲ့ ဒါမှမဟုတ် update လုပ်လိုက်တဲ့ rows အရေအတွက် ဖြစ်ပါတယ်။ `oid` က အမြဲတမ်း 0 ပါ (အရင်တုန်းက — `count` က အတိအကျ တစ်ခုဖြစ်ပြီး — target table ကို `WITH OIDS` နဲ့ ကြေညာထားရင် — ထည့်သွင်းလိုက်တဲ့ row ကို သတ်မှတ်ပေးလိုက်တဲ့ OID ဖြစ်ပြီး — မဟုတ်ရင် 0 ဖြစ်ပါတယ် — ဒါပေမယ့် `WITH OIDS` ပါတဲ့ table ဖန်တီးတာကို နောက်တော့ ထောက်ပံ့တော့ မဟုတ်ပါဘူး)။

`INSERT` command မှာ `RETURNING` clause ပါဝင်ရင် — ရလဒ်က — `RETURNING` စာရင်းထဲမှာ သတ်မှတ်ထားတဲ့ columns နဲ့ တန်ဖိုးတွေ ပါဝင်ပြီး — command က ထည့်သွင်းလိုက်တဲ့ ဒါမှမဟုတ် update လုပ်လိုက်တဲ့ row(များ) အပေါ်မှာ တွက်ချက်ထားတဲ့ — `SELECT` statement တစ်ခုရဲ့ ရလဒ်နဲ့ ဆင်တူပါလိမ့်မယ်။

## Notes (မှတ်စုများ)

သတ်မှတ်ထားတဲ့ table က partitioned table တစ်ခုဆိုရင် — row တစ်ခုစီကို သင့်လျော်တဲ့ partition ဆီ လမ်းညွှန် ပို့ဆောင်ပြီး အဲဒီထဲကို ထည့်သွင်းပါတယ်။ သတ်မှတ်ထားတဲ့ table က partition တစ်ခုဆိုရင် — input rows တွေထဲက တစ်ခုက partition constraint ကို ချိုးဖောက်နေရင် — error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

`MERGE` ကို သုံးဖို့လည်း စဉ်းစားချင်စရာ ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ — ၎င်းက `INSERT`၊ `UPDATE` နဲ့ `DELETE` တွေကို statement တစ်ခုတည်းထဲမှာ ရောနှော သုံးခွင့် ပေးလို့ပါ။ [MERGE](/docs/postgresql/sql-merge) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`films` table ထဲသို့ row တစ်ခုတည်း ထည့်သွင်းခြင်း:

```sql
INSERT INTO films VALUES
    ('UA502', 'Bananas', 105, '1971-07-13', 'Comedy', '82 minutes');
```

ဒီဥပမာမှာ — `len` column ကို ချန်လိုက်လို့ — သူ့မှာ default တန်ဖိုး ရှိပါလိမ့်မယ်:

```sql
INSERT INTO films (code, title, did, date_prod, kind)
    VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');
```

ဒီဥပမာက — date columns တွေအတွက် တန်ဖိုး သတ်မှတ်ပေးမယ့်အစား `DEFAULT` clause ကို သုံးထားပါတယ်:

```sql
INSERT INTO films VALUES
    ('UA502', 'Bananas', 105, DEFAULT, 'Comedy', '82 minutes');
INSERT INTO films (code, title, did, date_prod, kind)
    VALUES ('T_601', 'Yojimbo', 106, DEFAULT, 'Drama');
```

Default တန်ဖိုးတွေနဲ့ပဲ လုံးလုံး ပါဝင်တဲ့ row တစ်ခု ထည့်သွင်းဖို့:

```sql
INSERT INTO films DEFAULT VALUES;
```

Multirow `VALUES` syntax သုံးပြီး rows အများကြီး ထည့်သွင်းဖို့:

```sql
INSERT INTO films (code, title, did, date_prod, kind) VALUES
    ('B6717', 'Tampopo', 110, '1985-02-10', 'Comedy'),
    ('HG120', 'The Dinner Game', 140, DEFAULT, 'Comedy');
```

ဒီဥပမာက — `films` နဲ့ column အပြင်အဆင် (layout) အတူတူရှိတဲ့ `tmp_films` table ကနေ — `films` table ထဲသို့ rows တချို့ ထည့်သွင်းပါတယ်:

```sql
INSERT INTO films SELECT * FROM tmp_films WHERE date_prod < '2004-05-07';
```

ဒီဥပမာက array columns တွေထဲသို့ ထည့်သွင်းပါတယ်:

```sql
-- Create an empty 3x3 gameboard for noughts-and-crosses
INSERT INTO tictactoe (game, board[1:3][1:3])
    VALUES (1, '{{" "," "," "},{" "," "," "},{" "," "," "}}');
-- The subscripts in the above example aren't really needed
INSERT INTO tictactoe (game, board)
    VALUES (2, '{{X," "," "},{" ",O," "},{" ",X," "}}');
```

`distributors` table ထဲသို့ row တစ်ခုတည်း ထည့်သွင်းပြီး — `DEFAULT` clause ကနေ ထုတ်ပေးလိုက်တဲ့ sequence နံပါတ်ကို ပြန်ယူခြင်း:

```sql
INSERT INTO distributors (did, dname) VALUES (DEFAULT, 'XYZ Widgets')
   RETURNING did;
```

Acme Corporation ရဲ့ အကောင့်ကို စီမံခန့်ခွဲနေတဲ့ salesperson ရဲ့ sales count ကို မြှင့်တင်ပြီး — update လုပ်လိုက်တဲ့ row တစ်ခုလုံးကို လက်ရှိအချိန် (current time) နဲ့အတူ log table တစ်ခုထဲ မှတ်တမ်းတင်ခြင်း:

```sql
WITH upd AS (
  UPDATE employees SET sales_count = sales_count + 1 WHERE id =
    (SELECT sales_person FROM accounts WHERE name = 'Acme Corporation')
    RETURNING *
)
INSERT INTO employees_log SELECT *, current_timestamp FROM upd;
```

သင့်လျော်သလို — distributors အသစ်တွေ ထည့်သွင်း ဒါမှမဟုတ် update လုပ်ခြင်း။ `did` column ထဲမှာ ပေါ်လာတဲ့ တန်ဖိုးတွေကို ကန့်သတ်ပေးတဲ့ unique index တစ်ခု သတ်မှတ်ထားပြီးသား လို့ ယူဆပါတယ်။ ထည့်သွင်းဖို့ မူလက အဆိုပြုထားတဲ့ တန်ဖိုးတွေကို ရည်ညွှန်းဖို့ အထူး `excluded` table ကို သုံးထားတာကို သတိပြုပါ:

```sql
INSERT INTO distributors (did, dname)
    VALUES (5, 'Gizmo Transglobal'), (6, 'Associated Computing, Inc')
    ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname;
```

အထက်ပါအတိုင်းပဲ — distributors အသစ်တွေ ထည့်သွင်း ဒါမှမဟုတ် update လုပ်ပြီး — update လုပ်ခံလိုက်ရတဲ့ ရှိပြီးသား တန်ဖိုးတွေအကြောင်း သတင်းအချက်အလက်တွေကို — ထည့်သွင်းလိုက်တဲ့ data အသစ်တွေနဲ့အတူ ပြန်ပေးခြင်း။ ပဋိပက္ခ မဖြစ်တဲ့ rows တွေအတွက် — `old_did` နဲ့ `old_dname` ရဲ့ ပြန်ပေးတဲ့ တန်ဖိုးတွေက `NULL` ဖြစ်မယ်ဆိုတာ သတိပြုပါ:

```sql
INSERT INTO distributors (did, dname)
    VALUES (5, 'Gizmo Transglobal'), (6, 'Associated Computing, Inc')
    ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname
    RETURNING old.did AS old_did, old.dname AS old_dname,
              new.did AS new_did, new.dname AS new_dname;
```

Distributor တစ်ခုကို ထည့်သွင်းခြင်း၊ ဒါမှမဟုတ် — ရှိပြီးသား၊ excluded ဖြစ်နေတဲ့ row (before row insert triggers တွေ fire လုပ်ပြီးနောက် — ကိုက်ညီနေတဲ့ constrained column (တွေ) ပါတဲ့ row) တစ်ခု ရှိနေရင် — ထည့်သွင်းဖို့ အဆိုပြုထားတဲ့ rows တွေအတွက် ဘာမှ မလုပ်ဘဲ နေခြင်း။ ဒီဥပမာက — `did` column ထဲမှာ ပေါ်လာတဲ့ တန်ဖိုးတွေကို ကန့်သတ်ပေးတဲ့ unique index တစ်ခု သတ်မှတ်ထားပြီးသား လို့ ယူဆပါတယ်:

```sql
INSERT INTO distributors (did, dname) VALUES (7, 'Redline GmbH')
    ON CONFLICT (did) DO NOTHING;
```

သင့်လျော်သလို — distributors အသစ်တွေ ထည့်သွင်း ဒါမှမဟုတ် update လုပ်ခြင်း။ ဒီဥပမာက — `did` column ထဲမှာ ပေါ်လာတဲ့ တန်ဖိုးတွေကို ကန့်သတ်ပေးတဲ့ unique index တစ်ခု သတ်မှတ်ထားပြီးသား လို့ ယူဆပါတယ်။ တကယ် update လုပ်ရမယ့် rows တွေကို ကန့်သတ်ဖို့ `WHERE` clause ကို သုံးထားပါတယ် (update မလုပ်ရတဲ့ ရှိပြီးသား row တစ်ခုခုကိုတော့ — ဘာပဲဖြစ်ဖြစ် — lock လုပ်ဆဲ ဖြစ်ပါလိမ့်မယ်):

```sql
-- Don't update existing distributors based in a certain ZIP code
INSERT INTO distributors AS d (did, dname) VALUES (8, 'Anvil Distribution')
    ON CONFLICT (did) DO UPDATE
    SET dname = EXCLUDED.dname || ' (formerly ' || d.dname || ')'
    WHERE d.zipcode <> '21201';

-- Name a constraint directly in the statement (uses associated
-- index to arbitrate taking the DO NOTHING action)
INSERT INTO distributors (did, dname) VALUES (9, 'Antwerp Design')
    ON CONFLICT ON CONSTRAINT distributors_pkey DO NOTHING;
```

ဖြစ်နိုင်ရင် distributor အသစ် ထည့်သွင်းပြီး — မဟုတ်ရင် `DO NOTHING` လုပ်ခြင်း။ ဒီဥပမာက — `is_active` Boolean column က `true` ဖြစ်နေတဲ့ rows တစ်စုပေါ်မှာ — `did` column ထဲမှာ ပေါ်လာတဲ့ တန်ဖိုးတွေကို ကန့်သတ်ပေးတဲ့ unique index တစ်ခု သတ်မှတ်ထားပြီးသား လို့ ယူဆပါတယ်:

```sql
-- This statement could infer a partial unique index on "did"
-- with a predicate of "WHERE is_active", but it could also
-- just use a regular unique constraint on "did"
INSERT INTO distributors (did, dname) VALUES (10, 'Conrad International')
    ON CONFLICT (did) WHERE is_active DO NOTHING;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`INSERT` က SQL standard နဲ့ ကိုက်ညီပါတယ် — ဒါပေမယ့် — `RETURNING` clause က PostgreSQL extension တစ်ခု ဖြစ်ပြီး — `INSERT` နဲ့တွဲပြီး `WITH` သုံးနိုင်တာရော — `ON CONFLICT` နဲ့ အခြားရွေးချယ်စရာ လုပ်ဆောင်ချက်တစ်ခု သတ်မှတ်နိုင်တာရောပါ extension တွေ ဖြစ်ပါတယ်။ ဒါ့အပြင် — column name စာရင်း ချန်လိုက်ပေမယ့် — `VALUES` clause ဒါမှမဟုတ် `query` ကနေ columns တွေ အားလုံး မဖြည့်ထားဘူးဆိုတဲ့ ကိစ္စကို — standard က ခွင့်မပြုပါဘူး။ `ON CONFLICT` ထက် — SQL standard နဲ့ ပိုကိုက်ညီတဲ့ statement တစ်ခုကို နှစ်သက်ရင် — [MERGE](/docs/postgresql/sql-merge) ကို ကြည့်ပါ။

SQL standard က — `OVERRIDING SYSTEM VALUE` ကို — always generated ဖြစ်တဲ့ identity column တစ်ခု ရှိမှသာ သတ်မှတ်နိုင်တယ်လို့ သတ်မှတ်ပါတယ်။ PostgreSQL ကတော့ — ဘယ်အခြေအနေမှာမဆို ဒီ clause ကို ခွင့်ပြုပြီး — သက်ရောက်မှု မရှိတဲ့အခါ လျစ်လျူရှုပါတယ်။

`query` clause ရဲ့ ဖြစ်နိုင်ခြေ ကန့်သတ်ချက်တွေကို [SELECT](https://www.postgresql.org/docs/current/sql-select.html) အောက်မှာ မှတ်တမ်းတင်ထားပါတယ်။
