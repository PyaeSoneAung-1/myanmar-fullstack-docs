---
title: "SELECT (table သို့မဟုတ် view တစ်ခုမှ rows များ ပြန်လည် ရယူခြင်း)"
description: "Table သို့မဟုတ် view တစ်ခုမှ rows များ ပြန်လည် ရယူပေးသော SELECT command (TABLE နှင့် WITH အပါအဝင်) — WITH clause (RECURSIVE, SEARCH, CYCLE)၊ FROM items (joins, TABLESAMPLE, LATERAL, ROWS FROM)၊ WHERE၊ GROUP BY (GROUPING SETS, ROLLUP, CUBE)၊ HAVING၊ WINDOW၊ SELECT list၊ DISTINCT ON၊ UNION/INTERSECT/EXCEPT၊ ORDER BY၊ LIMIT/OFFSET/FETCH၊ FOR UPDATE/SHARE locking clauses တို့၏ အသေးစိတ် ရှင်းလင်းချက်၊ ဥပမာများနှင့် SQL standard နှင့် လိုက်ဖက်ညီမှု အကြောင်း ဖော်ပြချက်များ ပါဝင်သည်"
order: 215
source: "https://www.postgresql.org/docs/current/sql-select.html"
status: translated
updated: 2026-09-04
---

## SELECT (table သို့မဟုတ် view တစ်ခုမှ rows များ ပြန်လည် ရယူခြင်း)

SELECT, TABLE, WITH — table တစ်ခု သို့မဟုတ် view တစ်ခုမှ rows များကို ပြန်လည် ရယူပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
[ WITH [ RECURSIVE ] with_query [, ...] ]
SELECT [ ALL | DISTINCT [ ON ( expression [, ...] ) ] ]
    [ { * | expression [ [ AS ] output_name ] } [, ...] ]
    [ FROM from_item [, ...] ]
    [ WHERE condition ]
    [ GROUP BY [ ALL | DISTINCT ] grouping_element [, ...] ]
    [ HAVING condition ]
    [ WINDOW window_name AS ( window_definition ) [, ...] ]
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] select ]
    [ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
    [ LIMIT { count | ALL } ]
    [ OFFSET start [ ROW | ROWS ] ]
    [ FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } { ONLY | WITH TIES } ]
    [ FOR { UPDATE | NO KEY UPDATE | SHARE | KEY SHARE } [ OF from_reference [, ...] ] [ NOWAIT | SKIP LOCKED ] [...] ]

where from_item can be one of:

    [ ONLY ] table_name [ * ] [ [ AS ] alias [ ( column_alias [, ...] ) ] ]
                [ TABLESAMPLE sampling_method ( argument [, ...] ) [ REPEATABLE ( seed ) ] ]
    [ LATERAL ] ( select ) [ [ AS ] alias [ ( column_alias [, ...] ) ] ]
    with_query_name [ [ AS ] alias [ ( column_alias [, ...] ) ] ]
    [ LATERAL ] function_name ( [ argument [, ...] ] )
                [ WITH ORDINALITY ] [ [ AS ] alias [ ( column_alias [, ...] ) ] ]
    [ LATERAL ] function_name ( [ argument [, ...] ] ) [ AS ] alias ( column_definition [, ...] )
    [ LATERAL ] function_name ( [ argument [, ...] ] ) AS ( column_definition [, ...] )
    [ LATERAL ] ROWS FROM( function_name ( [ argument [, ...] ] ) [ AS ( column_definition [, ...] ) ] [, ...] )
                [ WITH ORDINALITY ] [ [ AS ] alias [ ( column_alias [, ...] ) ] ]
    from_item join_type from_item { ON join_condition | USING ( join_column [, ...] ) [ AS join_using_alias ] }
    from_item NATURAL join_type from_item
    from_item CROSS JOIN from_item

and grouping_element can be one of:

    ( )
    expression
    ( expression [, ...] )
    ROLLUP ( { expression | ( expression [, ...] ) } [, ...] )
    CUBE ( { expression | ( expression [, ...] ) } [, ...] )
    GROUPING SETS ( grouping_element [, ...] )

and with_query is:

    with_query_name [ ( column_name [, ...] ) ] AS [ [ NOT ] MATERIALIZED ] ( select | values | insert | update | delete | merge )
        [ SEARCH { BREADTH | DEPTH } FIRST BY column_name [, ...] SET search_seq_col_name ]
        [ CYCLE column_name [, ...] SET cycle_mark_col_name [ TO cycle_mark_value DEFAULT cycle_mark_default ] USING cycle_path_col_name ]

TABLE [ ONLY ] table_name [ * ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SELECT` က table သုညခု ဒါမှမဟုတ် သုညထက် ပိုတဲ့ tables တွေကနေ rows တွေကို ပြန်လည် ရယူပေးပါတယ်။ `SELECT` ရဲ့ ယေဘုယျ processing (လုပ်ဆောင်မှု) က အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

1. WITH list ထဲက queries တွေ အားလုံးကို တွက်ချက်ပါတယ်။ ဒါတွေက FROM list ထဲမှာ ရည်ညွှန်းလို့ ရနိုင်တဲ့ temporary tables (ယာယီ tables) တွေအနေနဲ့ ထိရောက်စွာ ဆောင်ရွက်ပေးပါတယ်။ FROM ထဲမှာ တစ်ကြိမ်ထက်ပိုပြီး ရည်ညွှန်းခံရတဲ့ WITH query တစ်ခုကို — `NOT MATERIALIZED` နဲ့ တခြားနည်း သတ်မှတ်မထားရင် — တစ်ကြိမ်ပဲ တွက်ချက်ပါတယ်။ (အောက်က WITH Clause ကို ကြည့်ပါ။)
2. FROM list ထဲက elements တွေ အားလုံးကို တွက်ချက်ပါတယ်။ (FROM list ထဲက element တစ်ခုချင်းစီက real (အစစ်အမှန်) ဒါမှမဟုတ် virtual (စိတ်ကူးယဉ်) table တစ်ခု ဖြစ်ပါတယ်။) FROM list ထဲမှာ element တစ်ခုထက်ပိုပြီး သတ်မှတ်ထားရင် — သူတို့ကို အတူတကွ cross-join လုပ်ပါတယ်။ (အောက်က FROM Clause ကို ကြည့်ပါ။)
3. WHERE clause သတ်မှတ်ထားရင် — condition ကို မကျေနပ်တဲ့ rows တွေ အားလုံးကို output ကနေ ဖယ်ရှားပါတယ်။ (အောက်က WHERE Clause ကို ကြည့်ပါ။)
4. GROUP BY clause သတ်မှတ်ထားရင် — ဒါမှမဟုတ် — aggregate function calls (စုစည်း တွက်ချက်မှု function ခေါ်ယူမှုများ) တွေ ရှိနေရင် — output ကို တန်ဖိုး တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပေါ်မှာ ကိုက်ညီတဲ့ rows တွေရဲ့ groups တွေအဖြစ် ပေါင်းစပ်ပြီး — aggregate functions တွေရဲ့ ရလဒ်တွေကို တွက်ချက်ပါတယ်။ HAVING clause ပါရှိနေရင် — ပေးထားတဲ့ condition ကို မကျေနပ်တဲ့ groups တွေကို ဖယ်ရှားပါတယ်။ (အောက်က GROUP BY Clause နဲ့ HAVING Clause တို့ကို ကြည့်ပါ။) Query ရဲ့ output columns တွေကို နောက်တစ်ဆင့်မှာ တွက်ချက်မယ်လို့ သတ်မှတ်ထားပေမယ့် — GROUP BY clause ထဲမှာလည်း သူတို့ကို (နာမည် ဒါမှမဟုတ် ordinal number (စဉ်နံပါတ်) အားဖြင့်) ရည်ညွှန်းလို့ ရပါတယ်။
5. ရွေးချယ်ထားတဲ့ row တစ်ခုချင်းစီ ဒါမှမဟုတ် row group တစ်ခုချင်းစီအတွက် — SELECT output expressions တွေကို သုံးပြီး — တကယ့် output rows တွေကို တွက်ချက်ပါတယ်။ (အောက်က SELECT List ကို ကြည့်ပါ။)
6. SELECT DISTINCT က result ထဲက duplicate rows (ထပ်နေသော rows) တွေကို ဖယ်ရှားပါတယ်။ SELECT DISTINCT ON က သတ်မှတ်ထားတဲ့ expressions တွေ အားလုံးပေါ်မှာ ကိုက်ညီနေတဲ့ rows တွေကို ဖယ်ရှားပါတယ်။ SELECT ALL (default) ကတော့ duplicate တွေ အပါအဝင် candidate rows တွေ အားလုံးကို ပြန်ပေးပါလိမ့်မယ်။ (အောက်က DISTINCT Clause ကို ကြည့်ပါ။)
7. UNION, INTERSECT နဲ့ EXCEPT operators တွေကို သုံးပြီး — SELECT statement တစ်ခုထက်ပိုရဲ့ output တွေကို ပေါင်းစပ်ပြီး result set တစ်ခုတည်း ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ UNION operator က result sets တစ်ခု ဒါမှမဟုတ် နှစ်ခုလုံးထဲမှာ ရှိနေတဲ့ rows တွေ အားလုံးကို ပြန်ပေးပါတယ်။ INTERSECT operator က result sets နှစ်ခုလုံးထဲမှာ အတိအကျ ရှိနေတဲ့ rows တွေ အားလုံးကို ပြန်ပေးပါတယ်။ EXCEPT operator က ပထမ result set ထဲမှာ ရှိပြီး — ဒုတိယ result set ထဲမှာ မရှိတဲ့ rows တွေကို ပြန်ပေးပါတယ်။ ကိစ္စ သုံးမျိုးစလုံးမှာ — ALL သတ်မှတ်မထားရင် — duplicate rows တွေကို ဖယ်ရှားပါတယ်။ Noise word (အဓိပ္ပာယ် သက်ရောက်မှု မရှိတဲ့ စကားလုံး) ဖြစ်တဲ့ DISTINCT ကို ထည့်ပြီး duplicate rows တွေ ဖယ်ရှားတာကို အတိအကျ သတ်မှတ်လို့လည်း ရပါတယ်။ ဒီနေရာမှာ — SELECT ကိုယ်တိုင်အတွက် ALL က default ဖြစ်ပေမယ့် — ဒီနေရာတွေမှာတော့ DISTINCT က default အပြုအမူ ဖြစ်တာကို သတိပြုပါ။ (အောက်က UNION Clause, INTERSECT Clause နဲ့ EXCEPT Clause တို့ကို ကြည့်ပါ။)
8. ORDER BY clause သတ်မှတ်ထားရင် — ပြန်ပေးလိုက်တဲ့ rows တွေကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း sort (စီစဉ်) လုပ်ပါတယ်။ ORDER BY မပေးထားဘူးဆိုရင် — system က အမြန်ဆုံး ထုတ်လုပ်နိုင်တဲ့ ဘယ်အစဉ်နဲ့မဆို rows တွေကို ပြန်ပေးပါတယ်။ (အောက်က ORDER BY Clause ကို ကြည့်ပါ။)
9. LIMIT (ဒါမှမဟုတ် FETCH FIRST) ဒါမှမဟုတ် OFFSET clause သတ်မှတ်ထားရင် — SELECT statement က result rows တွေရဲ့ subset (အခွဲ) တစ်ခုကိုပဲ ပြန်ပေးပါတယ်။ (အောက်က LIMIT Clause ကို ကြည့်ပါ။)
10. FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE ဒါမှမဟုတ် FOR KEY SHARE သတ်မှတ်ထားရင် — SELECT statement က ရွေးချယ်လိုက်တဲ့ rows တွေကို concurrent updates (တစ်ပြိုင်နက် update လုပ်မှုများ) တွေကနေ ကာကွယ်ဖို့ lock လုပ်ပါတယ်။ (အောက်က The Locking Clause ကို ကြည့်ပါ။)

`SELECT` command တစ်ခုထဲမှာ သုံးထားတဲ့ column တိုင်းပေါ်မှာ `SELECT` privilege ရှိရပါမယ်။ `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` ဒါမှမဟုတ် `FOR KEY SHARE` ကို သုံးတာက — (ဒီလို ရွေးချယ်ခံရတဲ့ table တစ်ခုချင်းစီရဲ့ column အနည်းဆုံး တစ်ခုပေါ်မှာ) `UPDATE` privilege လည်း လိုအပ်ပါတယ်။

## Parameters (parameter များ)

### `WITH` Clause (WITH clause အကြောင်း)

`WITH` clause က — primary query ထဲမှာ နာမည်နဲ့ ရည်ညွှန်းလို့ရတဲ့ subqueries တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို သတ်မှတ်ခွင့် ပြုပါတယ်။ ဒီ subqueries တွေက primary query ရဲ့ ကြာချိန် အတွင်းမှာ temporary tables ဒါမှမဟုတ် views တွေအနေနဲ့ ထိရောက်စွာ ဆောင်ရွက်ပါတယ်။ Subquery တစ်ခုချင်းစီက `SELECT`, `TABLE`, `VALUES`, `INSERT`, `UPDATE`, `DELETE` ဒါမှမဟုတ် `MERGE` statement တစ်ခု ဖြစ်နိုင်ပါတယ်။ `WITH` ထဲမှာ data-modifying statement (`INSERT`, `UPDATE`, `DELETE` ဒါမှမဟုတ် `MERGE`) တစ်ခုကို ရေးတဲ့အခါ — `RETURNING` clause တစ်ခု ထည့်သွင်းတာ ပုံမှန် ဖြစ်ပါတယ်။ Primary query က ဖတ်ရှုတဲ့ temporary table ကို ဖွဲ့စည်းပေးတာက — statement က ပြုပြင်မွမ်းမံတဲ့ အောက်ခံ table မဟုတ်ဘဲ — `RETURNING` ရဲ့ output ပဲ ဖြစ်ပါတယ်။ `RETURNING` ကို ချန်လိုက်ရင် — statement ကို ဆက်လက် လုပ်ဆောင်ဆဲ ဖြစ်ပေမယ့် — output တစ်စုံတစ်ရာ မထုတ်လုပ်တာမို့ — primary query က table တစ်ခုအနေနဲ့ ၎င်းကို ရည်ညွှန်းလို့ မရပါဘူး။

`WITH` query တစ်ခုချင်းစီအတွက် (schema qualification မပါတဲ့) နာမည် တစ်ခုကို သတ်မှတ်ပေးရပါမယ်။ Optional အနေနဲ့ — column နာမည်တွေရဲ့ စာရင်းတစ်ခုကိုလည်း သတ်မှတ်နိုင်ပြီး — ဒါကို ချန်လိုက်ရင် — column နာမည်တွေကို subquery ကနေ မှန်းဆ (infer) ပါတယ်။

`RECURSIVE` ကို သတ်မှတ်ထားရင် — `SELECT` subquery တစ်ခုက သူ့ကိုယ်သူ နာမည်နဲ့ ရည်ညွှန်းခွင့် ရှိပါတယ်။ ဒီလို subquery တစ်ခုက အောက်ပါ ပုံစံ ရှိရပါမယ်:

```sql
non_recursive_term UNION [ ALL | DISTINCT ] recursive_term
```

ဒီမှာ recursive self-reference (မိမိကိုယ်ကို ပြန်ညွှန်းမှု) က `UNION` ရဲ့ ညာဘက်ခြမ်းမှာ ပေါ်ရပါမယ်။ Query တစ်ခုအတွက် recursive self-reference တစ်ခုတည်းကိုပဲ ခွင့်ပြုပါတယ်။ Recursive data-modifying statements တွေကိုတော့ ထောက်ပံ့မထားပါဘူး — ဒါပေမယ့် — recursive `SELECT` query တစ်ခုရဲ့ ရလဒ်တွေကို data-modifying statement တစ်ခုထဲမှာ သုံးလို့တော့ ရပါတယ်။ ဥပမာတစ်ခုအတွက် [အပိုင်း 7.8](/docs/postgresql/queries-with) ကို ကြည့်ပါ။

`RECURSIVE` ရဲ့ နောက်ထပ် သက်ရောက်မှုတစ်ခုက — `WITH` queries တွေကို အစဉ်လိုက် ရှိစရာ မလိုတော့တာ ဖြစ်ပါတယ်: query တစ်ခုက list ထဲမှာ နောက်ကျမှ ရှိတဲ့ တခြား query တစ်ခုကို ရည်ညွှန်းနိုင်ပါတယ်။ (ဒါပေမယ့် — circular references (စက်ဝိုင်း သဘော ပြန်ညွှန်းမှုများ) ဒါမှမဟုတ် mutual recursion (အချင်းချင်း အပြန်အလှန် ပြန်ခေါ်မှု) တွေကိုတော့ implement မလုပ်ထားပါဘူး။) `RECURSIVE` မပါဘဲ — `WITH` queries တွေက `WITH` list ထဲမှာ ရှေ့ကျတဲ့ sibling `WITH` queries တွေကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။

`WITH` clause ထဲမှာ queries အများအပြား ရှိနေတဲ့အခါ — `RECURSIVE` ကို `WITH` ရဲ့ နောက်မှာ ချက်ချင်း — တစ်ကြိမ်ပဲ — ရေးရပါတယ်။ ၎င်းက `WITH` clause ထဲက queries တွေ အားလုံးကို သက်ရောက်ပေမယ့် — recursion ဒါမှမဟုတ် forward references (ရှေ့ကို ညွှန်းတဲ့ ကိုးကားမှုများ) မသုံးတဲ့ queries တွေအပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။

Optional ဖြစ်တဲ့ `SEARCH` clause က *search sequence column* တစ်ခုကို တွက်ချက်ပေးပြီး — recursive query တစ်ခုရဲ့ ရလဒ်တွေကို breadth-first (အကျယ်ကို ဦးစားပေး) ဒါမှမဟုတ် depth-first (အနက်ကို ဦးစားပေး) အစဉ်နဲ့ စီစဉ်ဖို့ သုံးနိုင်ပါတယ်။ ပေးထားတဲ့ column နာမည် စာရင်းက — လည်ပတ်ပြီးသား (visited) rows တွေကို ခြေရာခံဖို့ သုံးမယ့် row key ကို သတ်မှတ်ပါတယ်။ `search_seq_col_name` လို့ နာမည်ပေးထားတဲ့ column တစ်ခုကို `WITH` query ရဲ့ result column စာရင်းထဲကို ထည့်သွင်းပါလိမ့်မယ်။ ဒီ column ကို outer query ထဲမှာ order လုပ်ပြီး သက်ဆိုင်ရာ အစဉ်ကို ရရှိနိုင်ပါတယ်။ ဥပမာတွေအတွက် [အပိုင်း 7.8.2.1](/docs/postgresql/queries-with) ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `CYCLE` clause က recursive queries တွေထဲမှာ cycles (စက်ဝိုင်း လည်မှုများ) တွေကို ရှာဖွေ ဖော်ထုတ်ဖို့ သုံးပါတယ်။ ပေးထားတဲ့ column နာမည် စာရင်းက — လည်ပတ်ပြီးသား rows တွေကို ခြေရာခံဖို့ သုံးမယ့် row key ကို သတ်မှတ်ပါတယ်။ `cycle_mark_col_name` လို့ နာမည်ပေးထားတဲ့ column တစ်ခုကို `WITH` query ရဲ့ result column စာရင်းထဲကို ထည့်သွင်းပါလိမ့်မယ်။ Cycle တစ်ခု ရှာတွေ့ပြီဆိုရင် ဒီ column ကို `cycle_mark_value` လို့ သတ်မှတ်ပြီး — မဟုတ်ရင် `cycle_mark_default` လို့ သတ်မှတ်ပါလိမ့်မယ်။ ထို့ပြင် — cycle တစ်ခု ရှာတွေ့ပြီဆိုရင် recursive union ရဲ့ processing ကိုလည်း ရပ်တန့်လိုက်ပါလိမ့်မယ်။ `cycle_mark_value` နဲ့ `cycle_mark_default` တို့က constants တွေ ဖြစ်ရပြီး — ၎င်းတို့ကို common data type တစ်ခုဆီ coercible (အလိုအလျောက် ပြောင်းလဲလို့ရသော) ဖြစ်ရမှာ ဖြစ်ပြီး — အဲဒီ data type မှာ inequality operator တစ်ခု ရှိရပါမယ်။ (SQL standard က ၎င်းတို့ဟာ Boolean constants ဒါမှမဟုတ် character strings တွေ ဖြစ်ရမယ်လို့ လိုအပ်ပေမယ့် — PostgreSQL ကတော့ အဲဒါကို မလိုအပ်ပါဘူး။) Default အနေနဲ့ — (`boolean` type ရှိတဲ့) `TRUE` နဲ့ `FALSE` တို့ကို သုံးပါတယ်။ ထို့ပြင် — `cycle_path_col_name` လို့ နာမည်ပေးထားတဲ့ column တစ်ခုကိုလည်း `WITH` query ရဲ့ result column စာရင်းထဲကို ထည့်သွင်းပါလိမ့်မယ်။ ဒီ column ကို လည်ပတ်ပြီးသား rows တွေကို ခြေရာခံဖို့ အတွင်းပိုင်းမှာ သုံးပါတယ်။ ဥပမာတွေအတွက် [အပိုင်း 7.8.2.2](/docs/postgresql/queries-with) ကို ကြည့်ပါ။

`SEARCH` ရော `CYCLE` clause ရော နှစ်ခုလုံးက recursive `WITH` queries တွေအတွက်သာ သက်ရောက်မှု ရှိပါတယ်။ `with_query` က (nested `UNION`s မပါဘဲ) `SELECT` (ဒါမှမဟုတ် ညီမျှသော) commands နှစ်ခုရဲ့ `UNION` (ဒါမှမဟုတ် `UNION ALL`) တစ်ခု ဖြစ်ရပါမယ်။ Clause နှစ်ခုလုံး သုံးထားရင် — `SEARCH` clause က ထည့်သွင်းတဲ့ column က `CYCLE` clause က ထည့်သွင်းတဲ့ columns တွေရဲ့ ရှေ့မှာ ပေါ်ပါတယ်။

Primary query ရော `WITH` queries တွေရော အားလုံးကို (သဘောတရားအရ) တစ်ချိန်တည်းမှာ execute လုပ်ပါတယ်။ ဒါက ဆိုလိုတာက — `WITH` ထဲက data-modifying statement တစ်ခုရဲ့ သက်ရောက်မှုတွေကို — သူ့ရဲ့ `RETURNING` output ကို ဖတ်ခြင်းကလွဲလို့ — query ရဲ့ တခြား အစိတ်အပိုင်းတွေကနေ မြင်နိုင်မှာ မဟုတ်ပါဘူး။ ဒီလို data-modifying statements နှစ်ခုက row တစ်ခုတည်းကို ပြုပြင်မွမ်းမံဖို့ ကြိုးစားရင် — ရလဒ်တွေက unspecified (ကြိုတင် သတ်မှတ်မထား) ဖြစ်ပါတယ်။

`WITH` queries တွေရဲ့ အဓိက ဂုဏ်သတ္တိတစ်ခုက — primary query က ၎င်းတို့ကို တစ်ကြိမ်ထက်ပိုပြီး ရည်ညွှန်းနေရင်တောင် — primary query ရဲ့ execution တစ်ခုအတွက် ပုံမှန်အားဖြင့် တစ်ကြိမ်ပဲ အကဲဖြတ်တာ ဖြစ်ပါတယ်။ အထူးသဖြင့် — data-modifying statements တွေက — primary query က သူတို့ရဲ့ output အားလုံး ဒါမှမဟုတ် တစ်စိတ်တစ်ပိုင်းကို ဖတ်သည်ဖြစ်စေ မဖတ်သည်ဖြစ်စေ — အတိအကျ တစ်ကြိမ်ပဲ execute လုပ်တာ အာမခံပါတယ်။

ဒါပေမယ့် — `WITH` query တစ်ခုကို ဒီ အာမခံချက် ဖယ်ရှားဖို့ `NOT MATERIALIZED` လို့ အမှတ်အသား လုပ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမှာ — `WITH` query ကို primary query ရဲ့ `FROM` clause ထဲမှာ ရိုးရှင်းတဲ့ sub-`SELECT` တစ်ခုလိုပဲ — primary query ထဲကို ခေါက်သွင်း (fold) လုပ်နိုင်ပါတယ်။ Primary query က အဲဒီ `WITH` query ကို တစ်ကြိမ်ထက်ပိုပြီး ရည်ညွှန်းရင် ဒါက duplicate computations တွေ ဖြစ်စေပေမယ့် — အသုံးပြုမှု တစ်ခုချင်းစီအတွက် `WITH` query ရဲ့ စုစုပေါင်း output ထဲက rows အနည်းငယ်ပဲ လိုအပ်တယ်ဆိုရင် — queries တွေကို အတူတကွ optimize လုပ်ခွင့် ပြုခြင်းအားဖြင့် `NOT MATERIALIZED` က အသားတင် သက်သာမှု (net savings) တစ်ခု ပေးနိုင်ပါတယ်။ `NOT MATERIALIZED` ကို — recursive ဖြစ်တဲ့ ဒါမှမဟုတ် side-effect-free (ဘေးထွက် သက်ရောက်မှု မရှိသော — ဆိုလိုတာက volatile functions တွေ မပါတဲ့ သာမန် `SELECT` တစ်ခု မဟုတ်တဲ့) `WITH` query တစ်ခုနဲ့ တွဲထားရင် — လျစ်လျူရှုပါတယ်။

Default အနေနဲ့ — side-effect-free `WITH` query တစ်ခုကို primary query ရဲ့ `FROM` clause ထဲမှာ အတိအကျ တစ်ကြိမ်ပဲ သုံးထားရင် — primary query ထဲကို ခေါက်သွင်းပါတယ်။ ဒါက semantic အရ မမြင်ရသင့်တဲ့ အခြေအနေတွေမှာ query အဆင့် နှစ်ခုကို အတူတကွ optimize လုပ်နိုင်စေပါတယ်။ ဒါပေမယ့် — `WITH` query ကို `MATERIALIZED` လို့ အမှတ်အသား လုပ်ခြင်းအားဖြင့် ဒီလို ခေါက်သွင်းတာကို တားဆီးနိုင်ပါတယ်။ ဥပမာ — `WITH` query ကို planner က မကောင်းတဲ့ plan တစ်ခု ရွေးချယ်တာကနေ တားဆီးဖို့ optimization fence (optimization ကာရံမှု) အနေနဲ့ သုံးထားရင် အဲဒါ အသုံးဝင်နိုင်ပါတယ်။ PostgreSQL version 12 မတိုင်ခင် ဗားရှင်းတွေက ဒီလို ခေါက်သွင်းခြင်းကို ဘယ်တော့မှ မလုပ်ခဲ့လို့ — အဟောင်း ဗားရှင်းတွေအတွက် ရေးထားတဲ့ queries တွေက optimization fence အနေနဲ့ ဆောင်ရွက်ဖို့ `WITH` ကို မှီခိုနေနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 7.8](/docs/postgresql/queries-with) ကို ကြည့်ပါ။

### `FROM` Clause (FROM clause အကြောင်း)

`FROM` clause က `SELECT` အတွက် source tables တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို သတ်မှတ်ပါတယ်။ Sources အများအပြား သတ်မှတ်ထားရင် — ရလဒ်က sources အားလုံးရဲ့ Cartesian product (ဖြစ်နိုင်သမျှ ပေါင်းစပ် ရလဒ်စုံ) (cross join) ဖြစ်ပါတယ်။ ဒါပေမယ့် — ပုံမှန်အားဖြင့် — ပြန်ပေးတဲ့ rows တွေကို Cartesian product ရဲ့ subset (အခွဲ) ငယ်တစ်ခုဆီ ကန့်သတ်ဖို့ — (`WHERE` ကနေတစ်ဆင့်) qualification conditions တွေကို ထည့်လေ့ ရှိပါတယ်။

`FROM` clause ထဲမှာ အောက်ပါ elements တွေ ပါဝင်နိုင်ပါတယ်:

- **table_name** — ရှိပြီးသား table ဒါမှမဟုတ် view တစ်ခုရဲ့ နာမည် (optionally schema-qualified (schema နာမည်နဲ့ ရှေ့ဆွဲထားသော))။ Table နာမည် မတိုင်ခင် ONLY သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုကိုပဲ scan လုပ်ပါတယ်။ ONLY မသတ်မှတ်ရင် — table ရော သူ့ရဲ့ descendant tables (မျိုးဆက် tables) (ရှိရင်) အားလုံးပါ scan လုပ်ပါတယ်။ Optional အနေနဲ့ — descendant tables တွေ ပါဝင်တယ်ဆိုတာကို အတိအကျ ညွှန်ပြဖို့ — table နာမည် နောက်မှာ * ကို သတ်မှတ်နိုင်ပါတယ်။
- **alias** — alias ပါဝင်တဲ့ FROM item အတွက် အစားထိုး နာမည်တစ်ခု။ Alias ကို အတိုကောက် ရေးသားဖို့ ဒါမှမဟုတ် — self-joins (table တစ်ခုတည်းကို အကြိမ်များစွာ scan လုပ်တဲ့နေရာ) တွေမှာ မရှင်းလင်းမှု (ambiguity) တွေကို ဖယ်ရှားဖို့ သုံးပါတယ်။ Alias တစ်ခု ပေးလိုက်တဲ့အခါ — ၎င်းက table ဒါမှမဟုတ် function ရဲ့ တကယ့် နာမည်ကို လုံးဝ ဖုံးကွယ်လိုက်ပါတယ်; ဥပမာ — FROM foo AS f လို့ ပေးထားရင် — SELECT ရဲ့ ကျန်တဲ့ အပိုင်းတွေက ဒီ FROM item ကို foo လို့ မဟုတ်ဘဲ f လို့ပဲ ရည်ညွှန်းရပါမယ်။ Alias ရေးထားရင် — table ရဲ့ column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုအတွက် အစားထိုး နာမည်တွေ ပေးဖို့ — column alias စာရင်းတစ်ခုကိုလည်း ရေးနိုင်ပါတယ်။
- **TABLESAMPLE sampling_method ( argument [, ...] ) [ REPEATABLE ( seed ) ]** — table_name ရဲ့ နောက်မှာ လာတဲ့ TABLESAMPLE clause က — အဲဒီ table ထဲက rows တွေရဲ့ subset တစ်ခုကို ပြန်လည် ရယူဖို့ သတ်မှတ်ထားတဲ့ sampling_method ကို သုံးသင့်တယ်လို့ ညွှန်ပြပါတယ်။ ဒီ sampling က WHERE clauses တွေလို တခြား filters တွေ ဘယ်ဟာကိုမဆို သက်ရောက်ခြင်းထက် ရှေ့က ဖြစ်ပါတယ်။ Standard PostgreSQL distribution ထဲမှာ sampling methods နှစ်ခု ပါဝင်ပါတယ် — BERNOULLI နဲ့ SYSTEM — ပြီးတော့ — extensions တွေကနေတစ်ဆင့် တခြား sampling methods တွေကို database ထဲမှာ install လုပ်နိုင်ပါတယ်။
BERNOULLI နဲ့ SYSTEM sampling methods တွေ နှစ်ခုစလုံးက — 0 ကနေ 100 ကြားက ရာခိုင်နှုန်းတစ်ခုအနေနဲ့ ဖော်ပြတဲ့ — sample လုပ်ရမယ့် table ရဲ့ အချိုးအစား ဖြစ်တဲ့ argument တစ်ခုတည်းကို လက်ခံပါတယ်။ ဒီ argument က real-valued expression (ကိန်းစစ် တန်ဖိုး expression) တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ (တခြား sampling methods တွေက argument တွေ ပိုလက်ခံနိုင်သလို — မတူတဲ့ argument တွေလည်း လက်ခံနိုင်ပါတယ်။) ဒီ method နှစ်ခုစလုံးက — table ရဲ့ rows တွေရဲ့ သတ်မှတ်ထားတဲ့ ရာခိုင်နှုန်း ခန့်မှန်းခြေပမာဏ ပါဝင်မယ့် — ကျပန်း ရွေးချယ်ထားတဲ့ နမူနာ (randomly-chosen sample) တစ်ခုကို ပြန်ပေးပါတယ်။ BERNOULLI method က table တစ်ခုလုံးကို scan လုပ်ပြီး — row တစ်ခုချင်းစီကို သတ်မှတ်ထားတဲ့ probability နဲ့ သီးခြား ရွေးချယ် ဒါမှမဟုတ် လျစ်လျူရှုပါတယ်။ SYSTEM method က block-level sampling ကို လုပ်ပြီး — block တစ်ခုချင်းစီကို ရွေးချယ်ခံရဖို့ သတ်မှတ်ထားတဲ့ အခွင့်အလမ်း ရှိပါတယ်; ရွေးချယ်ခံရတဲ့ block တစ်ခုချင်းစီထဲက rows တွေ အားလုံးကို ပြန်ပေးပါတယ်။ Sampling ရာခိုင်နှုန်း ငယ်တဲ့အခါ SYSTEM method က BERNOULLI method ထက် သိသိသာသာ ပိုမြန်ပေမယ့် — clustering effects တွေကြောင့် — table ရဲ့ ပိုပြီး ကျပန်းဆန်မှု နည်းတဲ့ နမူနာတစ်ခုကို ပြန်ပေးနိုင်ပါတယ်။
Optional ဖြစ်တဲ့ REPEATABLE clause က sampling method အတွင်းမှာ ကျပန်း ဂဏန်းတွေ ထုတ်လုပ်ဖို့ သုံးမယ့် seed နံပါတ် ဒါမှမဟုတ် expression တစ်ခုကို သတ်မှတ်ပါတယ်။ Seed တန်ဖိုးက non-null floating-point တန်ဖိုး တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ တူညီတဲ့ seed နဲ့ argument တန်ဖိုးတွေ သတ်မှတ်ထားတဲ့ queries နှစ်ခုက — table က ဒီကြားထဲ မပြောင်းလဲခဲ့ဘူးဆိုရင် — table ရဲ့ တူညီတဲ့ နမူနာတစ်ခုကို ရွေးချယ်ပါလိမ့်မယ်။ ဒါပေမယ့် — မတူတဲ့ seed တန်ဖိုးတွေကတော့ ပုံမှန်အားဖြင့် မတူတဲ့ နမူနာတွေကို ထုတ်ပေးပါလိမ့်မယ်။ REPEATABLE မပေးထားရင် — system က ထုတ်လုပ်ပေးတဲ့ seed တစ်ခုကို အခြေခံပြီး — query တစ်ခုချင်းစီအတွက် ကျပန်း နမူနာအသစ် တစ်ခုကို ရွေးချယ်ပါတယ်။ Add-on sampling methods တချို့က REPEATABLE ကို လက်မခံဘဲ — အသုံးပြုမှု တစ်ခုချင်းစီမှာ နမူနာအသစ်တွေကို အမြဲတမ်း ထုတ်ပေးတယ်ဆိုတာ သတိပြုပါ။
- **select** — FROM clause ထဲမှာ sub-SELECT တစ်ခု ပေါ်လာနိုင်ပါတယ်။ ဒါက — ဒီ SELECT command တစ်ခုတည်းရဲ့ ကြာချိန် အတွင်းမှာ — သူ့ရဲ့ output ကို temporary table တစ်ခုအနေနဲ့ ဖန်တီးထားသလို ဆောင်ရွက်ပါတယ်။ Sub-SELECT ကို parentheses တွေနဲ့ ဝန်းရံထားရမယ်ဆိုတာ သတိပြုပါ — ပြီးတော့ — table တစ်ခုအတွက် လုပ်သလိုမျိုး alias တစ်ခုကိုလည်း ပေးနိုင်ပါတယ်။ ဒီနေရာမှာ VALUES command တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။
- **with_query_name** — WITH query တစ်ခုကို — သူ့ရဲ့ နာမည်က table နာမည်တစ်ခုလိုပဲ — ရေးပြီး ရည်ညွှန်းပါတယ်။ (တကယ်တော့ — primary query ရဲ့ ရည်ရွယ်ချက်တွေအတွက် WITH query က နာမည်တူ ရှိတဲ့ real table တစ်ခုကို ဖုံးကွယ်လိုက်ပါတယ်။ လိုအပ်ရင် — table ရဲ့ နာမည်ကို schema-qualify လုပ်ပြီး နာမည်တူ real table တစ်ခုကို ရည်ညွှန်းနိုင်ပါတယ်။) Table တစ်ခုအတွက် လုပ်သလိုမျိုး alias တစ်ခုကိုလည်း ပေးနိုင်ပါတယ်။
- **function_name** — FROM clause ထဲမှာ function calls တွေ ပေါ်လာနိုင်ပါတယ်။ (Result sets တွေ ပြန်ပေးတဲ့ functions တွေအတွက် ဒါက အထူး အသုံးဝင်ပေမယ့် — function တိုင်းကို သုံးလို့ ရပါတယ်။) ဒါက — ဒီ SELECT command တစ်ခုတည်းရဲ့ ကြာချိန် အတွင်းမှာ — function ရဲ့ output ကို temporary table တစ်ခုအနေနဲ့ ဖန်တီးထားသလို ဆောင်ရွက်ပါတယ်။ Function ရဲ့ result type က composite (ပေါင်းစပ် — function မှာ OUT parameters အများအပြား ရှိတဲ့ ကိစ္စ အပါအဝင်) ဖြစ်နေရင် — attribute တစ်ခုချင်းစီက implicit table ထဲမှာ သီးခြား column တစ်ခု ဖြစ်လာပါတယ်။
Function call မှာ optional ဖြစ်တဲ့ WITH ORDINALITY clause ကို ထည့်လိုက်တဲ့အခါ — `bigint` type ရှိတဲ့ column ထပ်တစ်ခုကို function ရဲ့ result column(များ) ရဲ့ နောက်မှာ ထည့်သွင်းပါလိမ့်မယ်။ ဒီ column က function ရဲ့ result set ထဲက rows တွေကို 1 ကစပြီး နံပါတ်စဉ် သတ်မှတ်ပေးပါတယ်။ Default အနေနဲ့ ဒီ column ကို ordinality လို့ နာမည်ပေးထားပါတယ်။
Table တစ်ခုအတွက် လုပ်သလိုမျိုး alias တစ်ခုကိုလည်း ပေးနိုင်ပါတယ်။ Alias ရေးထားရင် — function ရဲ့ composite return type ထဲက attribute တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုအတွက် (ရှိရင် ordinality column အပါအဝင်) အစားထိုး နာမည်တွေ ပေးဖို့ — column alias စာရင်းတစ်ခုကိုလည်း ရေးနိုင်ပါတယ်။
Function calls အများအပြားကို ROWS FROM( ... ) နဲ့ ဝန်းရံပြီး FROM-clause item တစ်ခုတည်းအဖြစ် ပေါင်းစပ်နိုင်ပါတယ်။ ဒီလို item တစ်ခုရဲ့ output က — function တစ်ခုချင်းစီကနေ ပထမ row တွေရဲ့ ဆက်စပ်မှု၊ ပြီးတော့ function တစ်ခုချင်းစီကနေ ဒုတိယ row တွေရဲ့ ဆက်စပ်မှု၊ စသဖြင့် ဖြစ်ပါတယ်။ Functions တချို့က တခြားဟာတွေထက် rows နည်းနည်းပဲ ထုတ်လုပ်ရင် — ပျောက်နေတဲ့ data တွေအတွက် null values တွေကို အစားထိုး ထည့်သွင်းပြီး — ပြန်ပေးတဲ့ စုစုပေါင်း rows အရေအတွက်က rows အများဆုံး ထုတ်လုပ်တဲ့ function နဲ့ အမြဲတမ်း တူညီနေပါတယ်။
Function ကို record data type ပြန်ပေးတာလို့ သတ်မှတ်ထားရင် — alias ဒါမှမဟုတ် AS ဆိုတဲ့ key word က မဖြစ်မနေ ရှိရပြီး — ( column_name data_type [, ... ]) ပုံစံ column definition list (column သတ်မှတ်ချက် စာရင်း) တစ်ခု နောက်ကနေ လိုက်ရပါမယ်။ Column definition list က function က ပြန်ပေးတဲ့ columns တွေရဲ့ တကယ့် အရေအတွက်နဲ့ types တွေနဲ့ ကိုက်ညီရပါမယ်။
ROWS FROM( ... ) syntax ကို သုံးတဲ့အခါ — functions တစ်ခုခုက column definition list တစ်ခု လိုအပ်ရင် — column definition list ကို ROWS FROM( ... ) ရဲ့ အတွင်းဘက် — function call ရဲ့ နောက်မှာ — ထားတာ ပိုနှစ်သက်စရာ ကောင်းပါတယ်။ Column definition list တစ်ခုကို ROWS FROM( ... ) construct ရဲ့ နောက်မှာ ထားလို့ ရတာက — function တစ်ခုတည်းပဲ ရှိပြီး WITH ORDINALITY clause မရှိတဲ့အခါမှသာ ဖြစ်ပါတယ်။
ORDINALITY ကို column definition list တစ်ခုနဲ့ အတူ သုံးဖို့ — ROWS FROM( ... ) syntax ကို သုံးပြီး — column definition list ကို ROWS FROM( ... ) ရဲ့ အတွင်းမှာ ထားရပါမယ်။
- **join_type** — အောက်ပါတို့ထဲက တစ်ခု

[ INNER ] JOIN

LEFT [ OUTER ] JOIN

RIGHT [ OUTER ] JOIN

FULL [ OUTER ] JOIN

INNER နဲ့ OUTER join types တွေအတွက် — join condition တစ်ခု သတ်မှတ်ရပါမယ် — ဆိုလိုတာက — ON join_condition, USING (join_column [, ...]) ဒါမှမဟုတ် NATURAL ထဲက အတိအကျ တစ်ခုပါ။ အဓိပ္ပာယ်တွေအတွက် အောက်မှာ ကြည့်ပါ။
JOIN clause တစ်ခုက FROM items နှစ်ခုကို ပေါင်းစပ်ပေးပါတယ် — အဆင်ပြေအောင် ဒီ FROM items နှစ်ခုကို “tables” လို့ ကျွန်တော်တို့ ခေါ်ပါမယ် — တကယ်တော့ သူတို့ဟာ ဘယ်လို FROM item အမျိုးအစားမဆို ဖြစ်နိုင်ပါတယ်။ Nesting (အထပ်လိုက် မြှုပ်နှံမှု) ရဲ့ အစဉ်ကို သတ်မှတ်ဖို့ လိုအပ်ရင် parentheses တွေကို သုံးပါ။ Parentheses မရှိရင် JOINs တွေက left-to-right အစဉ်နဲ့ nest လုပ်ပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — JOIN က FROM-list items တွေကို ခြားပေးတဲ့ commas တွေထက် ပိုတင်းကျပ်စွာ bind လုပ်ပါတယ်။ JOIN options တွေ အားလုံးက notation အရ အဆင်ပြေအောင် လုပ်ပေးတာမျှသာ ဖြစ်ပြီး — သာမန် FROM နဲ့ WHERE သုံးပြီး မလုပ်နိုင်တဲ့ အရာ တစ်စုံတစ်ရာ မဟုတ်ပါဘူး။
LEFT OUTER JOIN က qualified Cartesian product ထဲက rows တွေ အားလုံး (ဆိုလိုတာက — သူ့ရဲ့ join condition ကို ကျေနပ်တဲ့ ပေါင်းစပ်ထားတဲ့ rows တွေ အားလုံး) ကို ပြန်ပေးပြီး — join condition ကို ကျေနပ်တဲ့ right-hand row တစ်ခုမှ မရှိခဲ့တဲ့ — left-hand table ထဲက row တစ်ခုချင်းစီရဲ့ copy တစ်ခုစီကိုပါ ထပ်ပြီး ပြန်ပေးပါတယ်။ ဒီ left-hand row ကို right-hand columns တွေအတွက် null values တွေ ထည့်သွင်းပြီး — joined table ရဲ့ အကျယ်အပြည့် (full width) အထိ ချဲ့ပေးပါတယ်။ ဘယ် rows တွေမှာ matches (ကိုက်ညီမှုများ) ရှိလဲ ဆုံးဖြတ်တဲ့အခါ — JOIN clause ရဲ့ ကိုယ်ပိုင် condition ကိုပဲ ထည့်သွင်း စဉ်းစားတယ်ဆိုတာ သတိပြုပါ။ Outer conditions တွေကို နောက်မှ သက်ရောက်ပါတယ်။
အပြန်အလှန်အားဖြင့် — RIGHT OUTER JOIN က joined rows တွေ အားလုံးကို ပြန်ပေးပြီး — match မဖြစ်တဲ့ right-hand row တစ်ခုချင်းစီအတွက် row တစ်ခုစီ (ဘယ်ဘက်မှာ nulls တွေနဲ့ ချဲ့ထားတဲ့) ကိုပါ ထပ်ပြီး ပြန်ပေးပါတယ်။ ဒါက notation အရ အဆင်ပြေအောင် လုပ်ပေးတာမျှသာ ဖြစ်ပြီး — left နဲ့ right tables တွေကို လဲလှယ်လိုက်ရင် LEFT OUTER JOIN အဖြစ် ပြောင်းလဲလို့ ရလို့ပါ။
FULL OUTER JOIN က joined rows တွေ အားလုံးကို ပြန်ပေးပြီး — match မဖြစ်တဲ့ left-hand row တစ်ခုချင်းစီအတွက် row တစ်ခုစီ (ညာဘက်မှာ nulls တွေနဲ့ ချဲ့ထားတဲ့) နဲ့ — match မဖြစ်တဲ့ right-hand row တစ်ခုချင်းစီအတွက် row တစ်ခုစီ (ဘယ်ဘက်မှာ nulls တွေနဲ့ ချဲ့ထားတဲ့) ကိုပါ ထပ်ပြီး ပြန်ပေးပါတယ်။
- **ON join_condition** — join_condition က (WHERE clause တစ်ခုနဲ့ ဆင်တူတဲ့) boolean type တန်ဖိုးတစ်ခုကို ရလဒ်အဖြစ် ပေးတဲ့ expression တစ်ခု ဖြစ်ပြီး — join တစ်ခုထဲမှာ ဘယ် rows တွေကို match ဖြစ်တယ်လို့ ယူဆမလဲ သတ်မှတ်ပါတယ်။
- **USING ( join_column [, ...] ) [ AS join_using_alias ]** — USING ( a, b, ... ) ပုံစံ clause တစ်ခုက ON left_table.a = right_table.a AND left_table.b = right_table.b .... အတွက် အတိုကောက် ဖြစ်ပါတယ်။ ထို့ပြင် — USING က ညီမျှတဲ့ columns တစ်စုံချင်းစီကနေ တစ်ခုကိုပဲ join output ထဲမှာ ထည့်သွင်းမယ်လို့ ဆိုလိုပြီး — နှစ်ခုလုံး မဟုတ်ပါဘူး။
join_using_alias နာမည် တစ်ခု သတ်မှတ်ထားရင် — ၎င်းက join columns တွေအတွက် table alias တစ်ခုကို ပေးပါတယ်။ USING clause ထဲမှာ စာရင်းပြုထားတဲ့ join columns တွေကိုပဲ ဒီ နာမည်နဲ့ ရည်ညွှန်းလို့ ရပါတယ်။ သာမန် alias တစ်ခုနဲ့ မတူတာက — ဒါက query ရဲ့ ကျန်တဲ့ အပိုင်းတွေကနေ joined tables တွေရဲ့ နာမည်တွေကို ဖုံးကွယ်မထားပါဘူး။ သာမန် alias တစ်ခုနဲ့ မတူတဲ့ နောက်ထပ် အချက်က — column alias စာရင်းတစ်ခုကို ရေးလို့ မရတာပါ — join columns တွေရဲ့ output နာမည်တွေက USING list ထဲမှာ ပေါ်နေသလိုပဲ အတူတူ ဖြစ်ပါတယ်။
- **NATURAL** — NATURAL က — tables နှစ်ခုလုံးထဲမှာ နာမည်တူ ရှိတဲ့ columns တွေ အားလုံးကို ဖော်ပြတဲ့ — USING list တစ်ခုရဲ့ အတိုကောက် ဖြစ်ပါတယ်။ Common column နာမည်တွေ မရှိဘူးဆိုရင် — NATURAL က ON TRUE နဲ့ ညီမျှပါတယ်။
- **CROSS JOIN** — CROSS JOIN က INNER JOIN ON (TRUE) နဲ့ ညီမျှပါတယ် — ဆိုလိုတာက — qualification ကြောင့် ဖယ်ရှားခံရတဲ့ rows တွေ မရှိပါဘူး။ သူတို့က — FROM ရဲ့ ထိပ်ဆုံးအဆင့်မှာ tables နှစ်ခုကို စာရင်းပြုလုပ်ထားရာကနေ ရလာတဲ့ ရလဒ်နဲ့ အတူတူဖြစ်တဲ့ — ရိုးရှင်းတဲ့ Cartesian product တစ်ခုကို ထုတ်လုပ်ပေးပြီး — join condition (ရှိရင်) နဲ့ ကန့်သတ်ချက် မရှိပါဘူး။
- **LATERAL** — LATERAL key word က sub-SELECT FROM item တစ်ခုရဲ့ ရှေ့မှာ လာနိုင်ပါတယ်။ ဒါက sub-SELECT ကို — FROM list ထဲမှာ သူ့ရဲ့ ရှေ့မှာ ပေါ်နေတဲ့ FROM items တွေရဲ့ columns တွေကို ရည်ညွှန်းခွင့် ပြုပါတယ်။ (LATERAL မရှိရင် — sub-SELECT တစ်ခုချင်းစီကို သီးခြား အကဲဖြတ်ပြီး — တခြား FROM item တစ်ခုခုကို cross-reference လုပ်လို့ မရပါဘူး။)
LATERAL က function-call FROM item တစ်ခုရဲ့ ရှေ့မှာလည်း လာနိုင်ပေမယ့် — ဒီကိစ္စမှာတော့ function expression က ဘယ်လိုပဲ ဖြစ်ဖြစ် အရင် FROM items တွေကို ရည်ညွှန်းလို့ ရနေလို့ — ၎င်းက noise word တစ်ခုသာ ဖြစ်ပါတယ်။
LATERAL item တစ်ခုက FROM list ရဲ့ ထိပ်ဆုံးအဆင့်မှာ ဒါမှမဟုတ် — JOIN tree တစ်ခုရဲ့ အတွင်းမှာ ပေါ်လာနိုင်ပါတယ်။ နောက်ပိုင်း အခြေအနေမှာ — ၎င်းက သူ ညာဘက်ခြမ်းမှာ ရှိနေတဲ့ JOIN တစ်ခုရဲ့ ဘယ်ဘက်ခြမ်းမှာ ရှိတဲ့ items တွေကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။
FROM item တစ်ခုမှာ LATERAL cross-references တွေ ပါဝင်နေရင် — အကဲဖြတ်မှုက အောက်ပါအတိုင်း ဆက်လက် ဖြစ်ပေါ်ပါတယ်: cross-reference လုပ်ခံရတဲ့ column(များ) ကို ထောက်ပံ့ပေးတဲ့ FROM item ရဲ့ row တစ်ခုချင်းစီအတွက် — ဒါမှမဟုတ် — columns တွေကို ထောက်ပံ့ပေးတဲ့ FROM items အများအပြားရဲ့ row set တစ်ခုချင်းစီအတွက် — LATERAL item ကို အဲဒီ row ဒါမှမဟုတ် row set ရဲ့ column တန်ဖိုးတွေနဲ့ အကဲဖြတ်ပါတယ်။ ရလဒ် row(များ) ကို သူတို့ တွက်ချက်ခဲ့တဲ့ rows တွေနဲ့ ပုံမှန်အတိုင်း join လုပ်ပါတယ်။ ဒါကို column source table(s) ကနေ row တစ်ခုချင်းစီ ဒါမှမဟုတ် row set တစ်ခုချင်းစီအတွက် ထပ်ခါထပ်ခါ လုပ်ပါတယ်။
Column source table(s) တွေက LATERAL item နဲ့ INNER ဒါမှမဟုတ် LEFT join ဖြစ်ရပါမယ် — မဟုတ်ရင် LATERAL item အတွက် row set တစ်ခုချင်းစီကို တွက်ချက်ဖို့ ကောင်းမွန်စွာ သတ်မှတ်ထားတဲ့ (well-defined) rows အစု ရှိမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — X RIGHT JOIN LATERAL Y လို construct တစ်ခုက syntactic အရ valid ဖြစ်ပေမယ့် — Y က X ကို ရည်ညွှန်းတာကိုတော့ တကယ်တော့ ခွင့်မပြုပါဘူး။

### `WHERE` Clause (WHERE clause အကြောင်း)

Optional ဖြစ်တဲ့ `WHERE` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
WHERE condition
```

ဒီမှာ `condition` က `boolean` type ရလဒ်တစ်ခုအဖြစ် အကဲဖြတ်နိုင်တဲ့ expression တစ်ခုခု ဖြစ်ပါတယ်။ ဒီ condition ကို မကျေနပ်တဲ့ row တစ်ခုခုကို output ကနေ ဖယ်ရှားပါလိမ့်မယ်။ တကယ့် row တန်ဖိုးတွေကို variable references (variable ရည်ညွှန်းမှုများ) အတွက် အစားထိုး ထည့်သွင်းလိုက်တဲ့အခါ true ပြန်ပေးရင် — row တစ်ခုက condition ကို ကျေနပ်တယ်လို့ ဆိုပါတယ်။

### `GROUP BY` Clause (GROUP BY clause အကြောင်း)

Optional ဖြစ်တဲ့ `GROUP BY` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
GROUP BY [ ALL | DISTINCT ] grouping_element [, ...]
```

`GROUP BY` က — grouped expressions တွေအတွက် တူညီတဲ့ တန်ဖိုးတွေ မျှဝေထားတဲ့ — ရွေးချယ်ထားတဲ့ rows တွေ အားလုံးကို row တစ်ခုတည်းအဖြစ် ကျုံ့စေပါတယ်။ `grouping_element` တစ်ခုအတွင်းမှာ သုံးထားတဲ့ `expression` တစ်ခုက input column နာမည် တစ်ခု ဖြစ်နိုင်သလို — output column (`SELECT` list item) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် ordinal number (စဉ်နံပါတ်) လည်း ဖြစ်နိုင်ပြီး — input-column တန်ဖိုးတွေကနေ ဖွဲ့စည်းထားတဲ့ arbitrary expression တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ မရှင်းလင်းတဲ့ (ambiguous) အခြေအနေမှာ — `GROUP BY` နာမည်တစ်ခုကို output column နာမည်တစ်ခုထက် — input-column နာမည်တစ်ခုအနေနဲ့ အဓိပ္ပာယ် ကောက်ယူပါလိမ့်မယ်။

`GROUPING SETS`, `ROLLUP` ဒါမှမဟုတ် `CUBE` တွေထဲက တစ်ခုခုကို grouping elements အဖြစ် ထည့်သွင်းထားရင် — `GROUP BY` clause တစ်ခုလုံးက grouping sets (အုပ်စု သတ်မှတ်ချက်များ) အများအပြားကို သတ်မှတ်ပေးပါတယ်။ ဒီရဲ့ သက်ရောက်မှုက — တစ်ခုချင်းစီရဲ့ `GROUP BY` clauses တွေအနေနဲ့ သီးခြား grouping sets တွေ ပါဝင်တဲ့ — subqueries တွေကြားမှာ `UNION ALL` တစ်ခု တည်ဆောက်တာနဲ့ ညီမျှပါတယ်။ Optional ဖြစ်တဲ့ `DISTINCT` clause က processing မလုပ်ခင် duplicate sets တွေကို ဖယ်ရှားပါတယ်; ၎င်းက `UNION ALL` ကို `UNION DISTINCT` အဖြစ် ပြောင်းလဲပေးတာ မဟုတ်ပါဘူး။ Grouping sets တွေရဲ့ ကိုင်တွယ်မှုအကြောင်း နောက်ထပ် အသေးစိတ်အတွက် [အပိုင်း 7.2.4](/docs/postgresql/queries-table-expressions) ကို ကြည့်ပါ။

Aggregate functions တွေ — သုံးထားရင် — group တစ်ခုချင်းစီကို ဖွဲ့စည်းထားတဲ့ rows တွေ အားလုံးအပေါ်မှာ တွက်ချက်ပြီး — group တစ်ခုချင်းစီအတွက် သီးခြား တန်ဖိုးတစ်ခု ထုတ်လုပ်ပါတယ်။ (Aggregate functions တွေ ရှိပေမယ့် `GROUP BY` clause မရှိရင် — query ကို ရွေးချယ်ထားတဲ့ rows တွေ အားလုံး ပါဝင်တဲ့ group တစ်ခုတည်း ရှိတယ်လို့ သတ်မှတ်ပါတယ်။) Aggregate function တစ်ခုချင်းစီဆီ ကျွေးမွေးတဲ့ rows အစုကို — aggregate function call မှာ `FILTER` clause တစ်ခု ထည့်သွင်းခြင်းအားဖြင့် ထပ်ပြီး စစ်ထုတ်နိုင်ပါတယ်; နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 4.2.7](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ။ `FILTER` clause တစ်ခု ရှိနေရင် — ၎င်းနဲ့ ကိုက်ညီတဲ့ rows တွေကိုပဲ အဲဒီ aggregate function ရဲ့ input ထဲမှာ ထည့်သွင်းပါတယ်။

`GROUP BY` ရှိနေတဲ့အခါ — ဒါမှမဟုတ် — aggregate functions တွေ ရှိနေတဲ့အခါ — `SELECT` list expressions တွေက ungrouped columns တွေကို — aggregate functions တွေရဲ့ အတွင်းမှာ ကလွဲလို့ — ဒါမှမဟုတ် — ungrouped column က grouped columns တွေအပေါ်မှာ functionally dependent (လုပ်ဆောင်ချက် မှီခိုမှု ရှိတာ) ဖြစ်နေတဲ့အခါ ကလွဲလို့ — ရည်ညွှန်းတာ valid မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ — ဒီလိုမဟုတ်ရင် ungrouped column တစ်ခုအတွက် ပြန်ပေးဖို့ တန်ဖိုးတစ်ခုထက်ပို ဖြစ်နိုင်နေလို့ပါ။ Grouped columns တွေ (ဒါမှမဟုတ် သူတို့ရဲ့ subset တစ်ခု) က ungrouped column ပါဝင်တဲ့ table ရဲ့ primary key ဖြစ်နေရင် — functional dependency တစ်ခု တည်ရှိပါတယ်။

Aggregate functions တွေ အားလုံးကို — `HAVING` clause ဒါမှမဟုတ် `SELECT` list ထဲက “scalar” expressions တွေ ဘယ်ဟာကိုမဆို အကဲဖြတ်ခြင်းထက် ရှေ့က — အကဲဖြတ်တယ်ဆိုတာ သတိရပါ။ ဒါက ဆိုလိုတာက — ဥပမာ — aggregate function တစ်ခုရဲ့ အကဲဖြတ်မှုကို ကျော်လိုက်ဖို့ `CASE` expression တစ်ခုကို သုံးလို့ မရပါဘူး; [အပိုင်း 4.2.14](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `GROUP BY` နဲ့တွဲပြီး သတ်မှတ်လို့ မရပါဘူး။

### `HAVING` Clause (HAVING clause အကြောင်း)

Optional ဖြစ်တဲ့ `HAVING` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
HAVING condition
```

ဒီမှာ `condition` က `WHERE` clause အတွက် သတ်မှတ်ထားတာနဲ့ အတူတူပါပဲ။

`HAVING` က condition ကို မကျေနပ်တဲ့ group rows တွေကို ဖယ်ရှားပါတယ်။ `HAVING` က `WHERE` နဲ့ ကွဲပြားပါတယ်: `WHERE` က `GROUP BY` ကို သက်ရောက်ခြင်း မတိုင်ခင် — row တစ်ခုချင်းစီကို စစ်ထုတ်ပေးပြီး — `HAVING` ကတော့ `GROUP BY` က ဖန်တီးလိုက်တဲ့ group rows တွေကို စစ်ထုတ်ပါတယ်။ `condition` ထဲမှာ ရည်ညွှန်းထားတဲ့ column တစ်ခုချင်းစီက — အဲဒီ reference က aggregate function တစ်ခုရဲ့ အတွင်းမှာ ပေါ်နေတာ ဒါမှမဟုတ် — ungrouped column က grouping columns တွေအပေါ်မှာ functionally dependent ဖြစ်နေတာ မဟုတ်ရင် — grouping column တစ်ခုကို မရှင်းလင်းမှု မရှိဘဲ (unambiguously) ရည်ညွှန်းရပါမယ်။

`GROUP BY` clause မရှိတောင် — `HAVING` ရှိနေတာက query တစ်ခုကို grouped query တစ်ခု ဖြစ်စေပါတယ်။ ဒါက query ထဲမှာ aggregate functions တွေ ရှိပေမယ့် `GROUP BY` clause မရှိတဲ့အခါ ဖြစ်ပျက်တာနဲ့ အတူတူပါပဲ။ ရွေးချယ်ထားတဲ့ rows တွေ အားလုံးကို group တစ်ခုတည်း ဖွဲ့စည်းတယ်လို့ ယူဆပြီး — `SELECT` list နဲ့ `HAVING` clause တို့က table columns တွေကို aggregate functions တွေရဲ့ အတွင်းကနေပဲ ရည်ညွှန်းလို့ ရပါတယ်။ ဒီလို query တစ်ခုက `HAVING` condition က true ဆိုရင် row တစ်ခုတည်းကို ထုတ်လွှတ်ပြီး — true မဟုတ်ရင် rows သုညခု ထုတ်လွှတ်ပါတယ်။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `HAVING` နဲ့တွဲပြီး သတ်မှတ်လို့ မရပါဘူး။

### `WINDOW` Clause (WINDOW clause အကြောင်း)

Optional ဖြစ်တဲ့ `WINDOW` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
WINDOW window_name AS ( window_definition ) [, ...]
```

ဒီမှာ `window_name` က `OVER` clauses တွေ ဒါမှမဟုတ် နောက် window definitions တွေကနေ ရည်ညွှန်းလို့ရတဲ့ နာမည်တစ်ခု ဖြစ်ပြီး — `window_definition` ကတော့:

```sql
[ existing_window_name ]
[ PARTITION BY expression [, ...] ]
[ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ frame_clause ]
```

`existing_window_name` တစ်ခု သတ်မှတ်ထားရင် — ၎င်းက `WINDOW` list ထဲက အစောပိုင်း entry တစ်ခုကို ရည်ညွှန်းရပါမယ်; window အသစ်က သူ့ရဲ့ partitioning clause ကို အဲဒီ entry ကနေ ကူးယူပြီး — ရှိရင် — သူ့ရဲ့ ordering clause ကိုပါ ကူးယူပါတယ်။ ဒီကိစ္စမှာ window အသစ်က သူ့ရဲ့ ကိုယ်ပိုင် `PARTITION BY` clause ကို သတ်မှတ်လို့ မရဘဲ — ကူးယူထားတဲ့ window မှာ မရှိမှသာ `ORDER BY` ကို သတ်မှတ်လို့ ရပါတယ်။ Window အသစ်က သူ့ရဲ့ ကိုယ်ပိုင် frame clause ကိုပဲ အမြဲတမ်း သုံးပါတယ်; ကူးယူထားတဲ့ window မှာ frame clause မပါရပါဘူး။

`PARTITION BY` list ရဲ့ elements တွေကို [`GROUP BY`](/docs/postgresql/sql-select) clause ရဲ့ elements တွေလိုပဲ ဆင်တူတဲ့ နည်းနဲ့ အဓိပ္ပာယ် ကောက်ယူပေမယ့် — သူတို့က အမြဲတမ်း ရိုးရှင်းတဲ့ expressions တွေ ဖြစ်ပြီး — output column တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် နံပါတ် ဘယ်တော့မှ မဟုတ်တာပဲ ကွာပါတယ်။ နောက်ထပ် ကွာခြားချက်တစ်ခုက — ဒီ expressions တွေမှာ aggregate function calls တွေ ပါဝင်နိုင်ပြီး — သာမန် `GROUP BY` clause တစ်ခုမှာတော့ ဒါတွေကို ခွင့်မပြုပါဘူး။ Windowing က grouping နဲ့ aggregation ပြီးမှ ဖြစ်ပေါ်လို့ ဒီနေရာမှာတော့ ခွင့်ပြုပါတယ်။

အလားတူပဲ — `ORDER BY` list ရဲ့ elements တွေကို statement-level [`ORDER BY`](/docs/postgresql/sql-select) clause တစ်ခုရဲ့ elements တွေလိုပဲ ဆင်တူတဲ့ နည်းနဲ့ အဓိပ္ပာယ် ကောက်ယူပေမယ့် — expressions တွေကို အမြဲတမ်း ရိုးရှင်းတဲ့ expressions တွေအနေနဲ့ ယူဆပြီး — output column တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် နံပါတ် ဘယ်တော့မှ မဟုတ်တာပဲ ကွာပါတယ်။

Optional ဖြစ်တဲ့ `frame_clause` က — frame အပေါ်မှာ မှီခိုတဲ့ (အားလုံးက မဟုတ်ပါဘူး) window functions တွေအတွက် *window frame* တစ်ခုကို သတ်မှတ်ပါတယ်။ Window frame ဆိုတာ query ရဲ့ row တစ်ခုချင်းစီအတွက် (*current row* (လက်ရှိ row) လို့ ခေါ်တဲ့) ဆက်စပ်နေတဲ့ rows တွေရဲ့ အစုတစ်ခု ဖြစ်ပါတယ်။ `frame_clause` က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

```sql
{ RANGE | ROWS | GROUPS } frame_start [ frame_exclusion ]
{ RANGE | ROWS | GROUPS } BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

ဒီမှာ `frame_start` နဲ့ `frame_end` တို့က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပြီး:

```sql
UNBOUNDED PRECEDING
offset PRECEDING
CURRENT ROW
offset FOLLOWING
UNBOUNDED FOLLOWING
```

`frame_exclusion` ကတော့ အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

```sql
EXCLUDE CURRENT ROW
EXCLUDE GROUP
EXCLUDE TIES
EXCLUDE NO OTHERS
```

`frame_end` ကို ချန်လိုက်ရင် — ၎င်းက `CURRENT ROW` လို့ default ဖြစ်ပါတယ်။ ကန့်သတ်ချက်တွေကတော့ — `frame_start` က `UNBOUNDED FOLLOWING` မဖြစ်ရဘဲ — `frame_end` က `UNBOUNDED PRECEDING` မဖြစ်ရပါဘူး — ပြီးတော့ — `frame_end` ရဲ့ ရွေးချယ်မှုက အပေါ်က `frame_start` နဲ့ `frame_end` options စာရင်းထဲမှာ `frame_start` ရဲ့ ရွေးချယ်မှုထက် ရှေ့ကျတဲ့ နေရာမှာ ပေါ်မနေရပါဘူး — ဥပမာ — `RANGE BETWEEN CURRENT ROW AND offset PRECEDING` ကို ခွင့်မပြုပါဘူး။

Default framing option က `RANGE UNBOUNDED PRECEDING` ဖြစ်ပြီး — ၎င်းက `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` နဲ့ အတူတူပါပဲ; ၎င်းက frame ကို partition ရဲ့ အစကနေ current row ရဲ့ နောက်ဆုံး *peer* (window ရဲ့ `ORDER BY` clause က current row နဲ့ ညီမျှတယ်လို့ ယူဆတဲ့ row; `ORDER BY` မရှိရင် rows တွေ အားလုံးက peers ဖြစ်ကြပါတယ်) အထိ — rows တွေ အားလုံး ဖြစ်အောင် သတ်မှတ်ပါတယ်။ ယေဘုယျအားဖြင့် — `UNBOUNDED PRECEDING` ဆိုတာ frame က partition ရဲ့ ပထမ row ကနေ စတင်တယ်လို့ ဆိုလိုပြီး — အလားတူ — `UNBOUNDED FOLLOWING` က frame က partition ရဲ့ နောက်ဆုံး row မှာ ဆုံးတယ်လို့ ဆိုလိုပါတယ် — `RANGE`, `ROWS` ဒါမှမဟုတ် `GROUPS` mode ဘယ်ဟာပဲ ဖြစ်ဖြစ် မသက်ဆိုင်ပါဘူး။ `ROWS` mode မှာ — `CURRENT ROW` က frame က current row နဲ့ စတင် ဒါမှမဟုတ် ဆုံးတယ်လို့ ဆိုလိုပေမယ့် — `RANGE` ဒါမှမဟုတ် `GROUPS` mode တွေမှာတော့ — ၎င်းက frame က `ORDER BY` အစဉ်အရ current row ရဲ့ ပထမ ဒါမှမဟုတ် နောက်ဆုံး peer နဲ့ စတင် ဒါမှမဟုတ် ဆုံးတယ်လို့ ဆိုလိုပါတယ်။ `offset` `PRECEDING` နဲ့ `offset` `FOLLOWING` options တွေက frame mode ပေါ်မူတည်ပြီး အဓိပ္ပာယ် ကွဲပြားပါတယ်။ `ROWS` mode မှာ — `offset` က current row ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက် rows အရေအတွက် ဘယ်လောက်မှာ frame စတင် ဒါမှမဟုတ် ဆုံးတယ်ဆိုတာ ညွှန်ပြတဲ့ integer တစ်ခု ဖြစ်ပါတယ်။ `GROUPS` mode မှာ — `offset` က current row ရဲ့ peer group ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက် peer groups အရေအတွက် ဘယ်လောက်မှာ frame စတင် ဒါမှမဟုတ် ဆုံးတယ်ဆိုတာ ညွှန်ပြတဲ့ integer တစ်ခု ဖြစ်ပြီး — ဒီမှာ *peer group* ဆိုတာ window ရဲ့ `ORDER BY` clause အရ ညီမျှတယ်လို့ ယူဆရတဲ့ rows တွေရဲ့ အုပ်စုတစ်ခု ဖြစ်ပါတယ်။ `RANGE` mode မှာ — `offset` option တစ်ခု သုံးတာက window definition ထဲမှာ `ORDER BY` column အတိအကျ တစ်ခု ရှိရန် လိုအပ်ပါတယ်။ ဒါဆိုရင် frame ထဲမှာ — (for `PRECEDING`) current row ရဲ့ ordering column တန်ဖိုးထက် `offset` ထက် မပိုတဲ့ ပမာဏ လျော့နည်းတဲ့ — ဒါမှမဟုတ် (for `FOLLOWING`) ပိုများတဲ့ — ordering column တန်ဖိုး ရှိတဲ့ rows တွေ ပါဝင်ပါတယ်။ ဒီကိစ္စတွေမှာ `offset` expression ရဲ့ data type က ordering column ရဲ့ data type အပေါ်မှာ မူတည်ပါတယ်။ Numeric ordering columns တွေအတွက် ၎င်းက ပုံမှန်အားဖြင့် ordering column နဲ့ type တူညီပေမယ့် — datetime ordering columns တွေအတွက်တော့ `interval` တစ်ခု ဖြစ်ပါတယ်။ ဒီကိစ္စတွေ အားလုံးမှာ — `offset` ရဲ့ တန်ဖိုးက non-null ဖြစ်ပြီး non-negative (အနုတ်မဟုတ်သော) ဖြစ်ရပါမယ်။ ထို့ပြင် — `offset` က ရိုးရှင်းတဲ့ constant တစ်ခု ဖြစ်စရာ မလိုပေမယ့် — variables, aggregate functions ဒါမှမဟုတ် window functions တွေ ပါဝင်လို့တော့ မရပါဘူး။

`frame_exclusion` option က — frame start နဲ့ frame end options တွေအရ ပါဝင်စရာ ရှိနေရင်တောင် — current row ရဲ့ ပတ်ဝန်းကျင်က rows တွေကို frame ကနေ ဖယ်ထုတ်ခွင့် ပြုပါတယ်။ `EXCLUDE CURRENT ROW` က current row ကို frame ကနေ ဖယ်ထုတ်ပါတယ်။ `EXCLUDE GROUP` က current row ရော သူ့ရဲ့ ordering peers တွေပါ frame ကနေ ဖယ်ထုတ်ပါတယ်။ `EXCLUDE TIES` က current row ရဲ့ peers တွေ အားလုံးကို frame ကနေ ဖယ်ထုတ်ပေမယ့် — current row ကိုယ်တိုင်ကတော့ မဖယ်ထုတ်ပါဘူး။ `EXCLUDE NO OTHERS` ကတော့ — current row ဒါမှမဟုတ် သူ့ရဲ့ peers တွေကို မဖယ်ထုတ်တဲ့ default အပြုအမူကို ရိုးရိုးရှင်းရှင်း အတိအကျ သတ်မှတ်ပေးတာပါ။

`ORDER BY` အစဉ်က rows တွေကို ထူးခြားစွာ (uniquely) မစီစဉ်ပေးဘူးဆိုရင် — `ROWS` mode က ကြိုတင်ခန့်မှန်းလို့ မရတဲ့ ရလဒ်တွေကို ထုတ်ပေးနိုင်တယ်ဆိုတာ သတိထားပါ။ `RANGE` နဲ့ `GROUPS` modes တွေကို — `ORDER BY` အစဉ်ထဲမှာ peers တွေ ဖြစ်နေတဲ့ rows တွေကို တူညီစွာ ဆက်ဆံကြောင်း သေချာစေဖို့ ဒီဇိုင်း လုပ်ထားပါတယ်: ပေးထားတဲ့ peer group တစ်ခုရဲ့ rows တွေ အားလုံးက frame ထဲမှာ ရှိမယ် ဒါမှမဟုတ် frame ကနေ ဖယ်ထုတ်ခံရမယ်။

`WINDOW` clause တစ်ခုရဲ့ ရည်ရွယ်ချက်က — query ရဲ့ [`SELECT` list](/docs/postgresql/sql-select) ဒါမှမဟုတ် [`ORDER BY`](/docs/postgresql/sql-select) clause ထဲမှာ ပေါ်လာတဲ့ *window functions* တွေရဲ့ အပြုအမူကို သတ်မှတ်ဖို့ ဖြစ်ပါတယ်။ ဒီ functions တွေက သူတို့ရဲ့ `OVER` clauses တွေထဲမှာ `WINDOW` clause entries တွေကို နာမည်နဲ့ ရည်ညွှန်းနိုင်ပါတယ်။ ဒါပေမယ့် — `WINDOW` clause entry တစ်ခုက ဘယ်နေရာမှာမဆို ရည်ညွှန်းခံစရာ မလိုပါဘူး; query ထဲမှာ အသုံးမပြုရင် လျစ်လျူရှုလိုက်ရုံပါပဲ။ `WINDOW` clause လုံးဝ မပါဘဲလည်း window functions တွေကို သုံးလို့ ရပါတယ် — ဘာလို့လဲဆိုတော့ — window function call တစ်ခုက သူ့ရဲ့ window definition ကို သူ့ရဲ့ `OVER` clause ထဲမှာ တိုက်ရိုက် သတ်မှတ်နိုင်လို့ပါ။ ဒါပေမယ့် — window definition တစ်ခုတည်းကို window function တစ်ခုထက်ပိုအတွက် လိုအပ်တဲ့အခါ — `WINDOW` clause က စာရိုက်ရတာ သက်သာစေပါတယ်။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `WINDOW` နဲ့တွဲပြီး သတ်မှတ်လို့ မရပါဘူး။

Window functions တွေကို [အပိုင်း 3.5](/docs/postgresql/window-functions), [အပိုင်း 4.2.8](/docs/postgresql/sql-expressions) နဲ့ [အပိုင်း 7.2.5](/docs/postgresql/queries-table-expressions) တွေမှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

### `SELECT` List (SELECT list အကြောင်း)

`SELECT` list က (`SELECT` နဲ့ `FROM` ဆိုတဲ့ key words တွေကြားက) `SELECT` statement ရဲ့ output rows တွေကို ဖွဲ့စည်းပေးတဲ့ expressions တွေကို သတ်မှတ်ပါတယ်။ ဒီ expressions တွေက (ပုံမှန်အားဖြင့်) `FROM` clause ထဲမှာ တွက်ချက်ထားတဲ့ columns တွေကို ရည်ညွှန်းနိုင်ပါတယ်။

Table တစ်ခုထဲမှာလိုပဲ — `SELECT` တစ်ခုရဲ့ output column တိုင်းမှာ နာမည်တစ်ခု ရှိပါတယ်။ ရိုးရှင်းတဲ့ `SELECT` တစ်ခုမှာ ဒီ နာမည်က column ကို ပြသမှုအတွက် label တပ်ဖို့ပဲ သုံးပေမယ့် — `SELECT` က ပိုကြီးတဲ့ query တစ်ခုရဲ့ sub-query ဖြစ်နေတဲ့အခါ — ဒီ နာမည်ကို larger query က sub-query က ထုတ်လုပ်တဲ့ virtual table ရဲ့ column နာမည်အနေနဲ့ မြင်ရပါတယ်။ Output column တစ်ခုအတွက် သုံးမယ့် နာမည်ကို သတ်မှတ်ဖို့ — column ရဲ့ expression နောက်မှာ `AS` `output_name` လို့ ရေးပါ။ (`AS` ကို ချန်လိုက်လို့ ရပေမယ့် — လိုချင်တဲ့ output နာမည်က PostgreSQL keyword ([နောက်ဆက်တွဲ C](https://www.postgresql.org/docs/current/sql-keywords-appendix.html) ကို ကြည့်ပါ) တစ်ခုခုနဲ့ မကိုက်ညီမှသာ ဖြစ်ပါတယ်။ နောက်ပိုင်းမှာ keywords အသစ်တွေ ထပ်ပေါင်းလာနိုင်တာကနေ ကာကွယ်ဖို့ — `AS` ကို အမြဲတမ်း ရေးတာ ဒါမှမဟုတ် output နာမည်ကို double-quote လုပ်တာ နှစ်မျိုးထဲက တစ်ခုခုကို အမြဲ လုပ်ဖို့ အကြံပြုပါတယ်။) Column နာမည် မသတ်မှတ်ဘူးဆိုရင် — PostgreSQL က နာမည်တစ်ခုကို အလိုအလျောက် ရွေးချယ်ပေးပါတယ်။ Column ရဲ့ expression က ရိုးရှင်းတဲ့ column reference တစ်ခု ဖြစ်နေရင် — ရွေးချယ်လိုက်တဲ့ နာမည်က အဲဒီ column ရဲ့ နာမည်နဲ့ပဲ တူညီပါတယ်။ ပိုရှုပ်ထွေးတဲ့ ကိစ္စတွေမှာ — function ဒါမှမဟုတ် type နာမည်တစ်ခုကို သုံးနိုင်သလို — system က `?column?` လို generate လုပ်ထားတဲ့ နာမည်တစ်ခုအထိ ကျသွားနိုင်ပါတယ်။

Output column တစ်ခုရဲ့ နာမည်ကို `ORDER BY` နဲ့ `GROUP BY` clauses တွေထဲမှာ column ရဲ့ တန်ဖိုးကို ရည်ညွှန်းဖို့ သုံးလို့ရပေမယ့် — `WHERE` ဒါမှမဟုတ် `HAVING` clauses တွေထဲမှာတော့ မရပါဘူး; အဲဒီနေရာတွေမှာ expression ကို ရေးထုတ်ရပါမယ်။

Expression တစ်ခုရဲ့ အစား — output list ထဲမှာ `*` ကို ရွေးချယ်ထားတဲ့ rows တွေရဲ့ columns တွေ အားလုံးရဲ့ အတိုကောက်အဖြစ် ရေးနိုင်ပါတယ်။ ထို့ပြင် — အဲဒီ table တစ်ခုတည်းကနေ လာတဲ့ columns တွေရဲ့ အတိုကောက်အဖြစ် `table_name.*` လို့လည်း ရေးနိုင်ပါတယ်။ ဒီကိစ္စတွေမှာ `AS` နဲ့ နာမည်အသစ်တွေ သတ်မှတ်လို့ မဖြစ်နိုင်ပါဘူး; output column နာမည်တွေက table columns တွေရဲ့ နာမည်တွေနဲ့ပဲ တူညီပါလိမ့်မယ်။

SQL standard အရ — output list ထဲက expressions တွေကို `DISTINCT`, `ORDER BY` ဒါမှမဟုတ် `LIMIT` ကို သက်ရောက်ခြင်းထက် ရှေ့က — တွက်ချက်သင့်ပါတယ်။ `DISTINCT` သုံးတဲ့အခါ ဒါက သိသာစွာ လိုအပ်ပါတယ် — မဟုတ်ရင် ဘယ်တန်ဖိုးတွေ distinct ဖြစ်နေတယ်ဆိုတာ မရှင်းလင်းလို့ပါ။ ဒါပေမယ့် — အခြေအနေ အများအပြားမှာ — output expressions တွေကို `ORDER BY` နဲ့ `LIMIT` ပြီးမှ တွက်ချက်တာက အဆင်ပြေစေပါတယ်; အထူးသဖြင့် output list ထဲမှာ volatile ဒါမှမဟုတ် စရိတ်ကြီးတဲ့ functions တွေ ပါနေရင် ဖြစ်ပါတယ်။ အဲဒီ အပြုအမူနဲ့ဆိုရင် — function အကဲဖြတ်မှုတွေရဲ့ အစဉ်က ပိုပြီး အလိုလို သိနိုင်ပြီး — output ထဲမှာ ဘယ်တော့မှ မပေါ်တဲ့ rows တွေနဲ့ ကိုက်ညီတဲ့ အကဲဖြတ်မှုတွေ ရှိမှာ မဟုတ်ပါဘူး။ ဒီ expressions တွေကို `DISTINCT`, `ORDER BY` ဒါမှမဟုတ် `GROUP BY` ထဲမှာ ရည်ညွှန်းမထားသရွေ့ — PostgreSQL က output expressions တွေကို sorting နဲ့ limiting ပြီးတဲ့ နောက်မှာ ထိရောက်စွာ အကဲဖြတ်ပါလိမ့်မယ်။ (ဆန့်ကျင်ဘက် ဥပမာအနေနဲ့ — `SELECT f(x) FROM tab ORDER BY 1` ဆိုတာ sorting မလုပ်ခင် `f(x)` ကို အတိအကျ အကဲဖြတ်ရမှာ သေချာပါတယ်။) Set-returning functions (row sets ပြန်ပေးတဲ့ functions) တွေ ပါဝင်တဲ့ output expressions တွေကို — sorting ပြီးနောက်မှာ ဖြစ်ပြီး — limiting မလုပ်ခင် — ထိရောက်စွာ အကဲဖြတ်တာမို့ — `LIMIT` က set-returning function တစ်ခုရဲ့ output ကို ဖြတ်တောက်ဖို့ လုပ်ဆောင်နိုင်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL version 9.6 မတိုင်ခင် ဗားရှင်းတွေက output expressions တွေကို sorting နဲ့ limiting တို့နဲ့ ယှဉ်ပြီး ဘယ်အချိန်မှာ အကဲဖြတ်မလဲဆိုတဲ့ အာမခံချက် တစ်စုံတစ်ရာ မပေးခဲ့ပါဘူး; ၎င်းက ရွေးချယ်လိုက်တဲ့ query plan ရဲ့ ပုံစံပေါ်မှာ မူတည်ခဲ့ပါတယ်။

### `DISTINCT` Clause (DISTINCT clause အကြောင်း)

`SELECT DISTINCT` သတ်မှတ်ထားရင် — duplicate rows တွေ အားလုံးကို result set ကနေ ဖယ်ရှားပါတယ် (duplicates တစ်ခုချင်းစီရဲ့ group ကနေ row တစ်ခုစီကို သိမ်းထားပါတယ်)။ `SELECT ALL` က ဆန့်ကျင်ဘက်ကို သတ်မှတ်ပါတယ်: rows တွေ အားလုံးကို သိမ်းထားပါတယ်; ဒါကတော့ default ဖြစ်ပါတယ်။

`SELECT DISTINCT ON ( expression [, ...] )` က ပေးထားတဲ့ expressions တွေ တူညီတယ်လို့ အကဲဖြတ်ရတဲ့ rows အစုတစ်ခုချင်းစီထဲက ပထမ row ကိုပဲ သိမ်းထားပါတယ်။ `DISTINCT ON` expressions တွေကို `ORDER BY` အတွက် သုံးတဲ့ စည်းမျဉ်းတွေနဲ့ပဲ အဓိပ္ပာယ် ကောက်ယူပါတယ် (အပေါ်မှာ ကြည့်ပါ)။ လိုချင်တဲ့ row က ပထမ ပေါ်လာကြောင်း သေချာစေဖို့ `ORDER BY` ကို မသုံးထားရင် — group တစ်ခုချင်းစီရဲ့ “ပထမ row” က ကြိုတင်ခန့်မှန်းလို့ မရဘူးဆိုတာ သတိပြုပါ။ ဥပမာ:

```sql
SELECT DISTINCT ON (location) location, time, report
    FROM weather_reports
    ORDER BY location, time DESC;
```

ဒါက location တစ်ခုချင်းစီအတွက် နောက်ဆုံး (အသစ်ဆုံး) ရာသီဥတု အစီရင်ခံစာကို ပြန်လည် ရယူပေးပါတယ်။ ဒါပေမယ့် — location တစ်ခုချင်းစီအတွက် time တန်ဖိုးတွေရဲ့ descending (ကြီးစဉ်ငယ်လိုက်) အစဉ်ကို အတင်းအကျပ် လုပ်ဖို့ `ORDER BY` ကို မသုံးခဲ့ဘူးဆိုရင် — location တစ်ခုချင်းစီအတွက် ကြိုတင်ခန့်မှန်းလို့ မရတဲ့ အချိန်တစ်ခုက အစီရင်ခံစာ ရလာမှာ ဖြစ်ပါတယ်။

`DISTINCT ON` expression(s) တွေက ဘယ်ဘက်အကျဆုံး `ORDER BY` expression(s) တွေနဲ့ ကိုက်ညီရပါမယ်။ `ORDER BY` clause က ပုံမှန်အားဖြင့် — `DISTINCT ON` group တစ်ခုချင်းစီအတွင်းမှာ rows တွေရဲ့ လိုချင်တဲ့ ဦးစားပေး အစဉ်ကို ဆုံးဖြတ်ပေးတဲ့ — expression(s) အပိုတွေ ပါဝင်ပါလိမ့်မယ်။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `DISTINCT` နဲ့တွဲပြီး သတ်မှတ်လို့ မရပါဘူး။

### `UNION` Clause (UNION clause အကြောင်း)

`UNION` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
select_statement UNION [ ALL | DISTINCT ] select_statement
```

`select_statement` ဆိုတာ — `ORDER BY`, `LIMIT`, `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` ဒါမှမဟုတ် `FOR KEY SHARE` clause မပါတဲ့ — ဘယ် `SELECT` statement မဆို ဖြစ်ပါတယ်။ (`ORDER BY` နဲ့ `LIMIT` တို့ကို subexpression တစ်ခုကို parentheses တွေနဲ့ ဝန်းရံထားရင် အဲဒီ subexpression နဲ့ တွဲထားလို့ ရပါတယ်။ Parentheses မရှိရင် — ဒီ clauses တွေကို `UNION` ရဲ့ right-hand input expression မဟုတ်ဘဲ — `UNION` ရဲ့ ရလဒ်အပေါ်မှာ သက်ရောက်တာလို့ ယူဆပါလိမ့်မယ်။)

`UNION` operator က ပါဝင်တဲ့ `SELECT` statements တွေ ပြန်ပေးတဲ့ rows တွေရဲ့ set union ကို တွက်ချက်ပါတယ်။ Result sets နှစ်ခုထဲက အနည်းဆုံး တစ်ခုထဲမှာ ပေါ်နေရင် — row တစ်ခုက result sets နှစ်ခုရဲ့ set union ထဲမှာ ရှိပါတယ်။ `UNION` ရဲ့ တိုက်ရိုက် operands တွေကို ကိုယ်စားပြုတဲ့ `SELECT` statements နှစ်ခုက column အရေအတွက် တူညီစွာ ထုတ်လုပ်ရပြီး — သက်ဆိုင်ရာ columns တွေက data types လိုက်ဖက်ညီ (compatible) ရပါမယ်။

`ALL` option ကို သတ်မှတ်မထားရင် — `UNION` ရဲ့ ရလဒ်ထဲမှာ duplicate rows တွေ မပါဝင်ပါဘူး။ `ALL` က duplicates တွေ ဖယ်ရှားခံရတာကို တားဆီးပါတယ်။ (ဒါကြောင့် — `UNION ALL` က ပုံမှန်အားဖြင့် `UNION` ထက် သိသိသာသာ ပိုမြန်ပါတယ်; တတ်နိုင်ရင် `ALL` ကို သုံးပါ။) `DISTINCT` ကို — duplicate rows တွေ ဖယ်ရှားတဲ့ default အပြုအမူကို အတိအကျ သတ်မှတ်ဖို့ ရေးနိုင်ပါတယ်။

SELECT statement တစ်ခုတည်းထဲမှာ `UNION` operators အများအပြားကို — parentheses တွေက တခြားနည်း မညွှန်ပြရင် — left ကနေ right ကို အစဉ်လိုက် အကဲဖြတ်ပါတယ်။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `UNION` ရလဒ်တစ်ခုအတွက်ရော `UNION` တစ်ခုရဲ့ input တစ်ခုခုအတွက်ပါ သတ်မှတ်လို့ မရပါဘူး။

### `INTERSECT` Clause (INTERSECT clause အကြောင်း)

`INTERSECT` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
select_statement INTERSECT [ ALL | DISTINCT ] select_statement
```

`select_statement` ဆိုတာ — `ORDER BY`, `LIMIT`, `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` ဒါမှမဟုတ် `FOR KEY SHARE` clause မပါတဲ့ — ဘယ် `SELECT` statement မဆို ဖြစ်ပါတယ်။

`INTERSECT` operator က ပါဝင်တဲ့ `SELECT` statements တွေ ပြန်ပေးတဲ့ rows တွေရဲ့ set intersection ကို တွက်ချက်ပါတယ်။ Result sets နှစ်ခုလုံးထဲမှာ ပေါ်နေရင် — row တစ်ခုက result sets နှစ်ခုရဲ့ intersection ထဲမှာ ရှိပါတယ်။

`ALL` option ကို သတ်မှတ်မထားရင် — `INTERSECT` ရဲ့ ရလဒ်ထဲမှာ duplicate rows တွေ မပါဝင်ပါဘူး။ `ALL` နဲ့ဆိုရင် — ဘယ်ဘက် table ထဲမှာ duplicates `m` ခု ရှိပြီး — ညာဘက် table ထဲမှာ duplicates `n` ခု ရှိတဲ့ row တစ်ခုက result set ထဲမှာ min(`m`,`n`) ကြိမ် ပေါ်ပါလိမ့်မယ်။ `DISTINCT` ကို — duplicate rows တွေ ဖယ်ရှားတဲ့ default အပြုအမူကို အတိအကျ သတ်မှတ်ဖို့ ရေးနိုင်ပါတယ်။

SELECT statement တစ်ခုတည်းထဲမှာ `INTERSECT` operators အများအပြားကို — parentheses တွေက တခြားနည်း မညွှန်ပြရင် — left ကနေ right ကို အစဉ်လိုက် အကဲဖြတ်ပါတယ်။ `INTERSECT` က `UNION` ထက် ပိုတင်းကျပ်စွာ bind လုပ်ပါတယ်။ ဆိုလိုတာက — `A UNION B INTERSECT C` ကို `A UNION (B INTERSECT C)` အနေနဲ့ ဖတ်ပါလိမ့်မယ်။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `INTERSECT` ရလဒ်တစ်ခုအတွက်ရော `INTERSECT` တစ်ခုရဲ့ input တစ်ခုခုအတွက်ပါ သတ်မှတ်လို့ မရပါဘူး။

### `EXCEPT` Clause (EXCEPT clause အကြောင်း)

`EXCEPT` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
select_statement EXCEPT [ ALL | DISTINCT ] select_statement
```

`select_statement` ဆိုတာ — `ORDER BY`, `LIMIT`, `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` ဒါမှမဟုတ် `FOR KEY SHARE` clause မပါတဲ့ — ဘယ် `SELECT` statement မဆို ဖြစ်ပါတယ်။

`EXCEPT` operator က ဘယ်ဘက် `SELECT` statement ရဲ့ ရလဒ်ထဲမှာ ရှိပြီး — ညာဘက် statement ရဲ့ ရလဒ်ထဲမှာ မရှိတဲ့ — rows တွေရဲ့ set ကို တွက်ချက်ပါတယ်။

`ALL` option ကို သတ်မှတ်မထားရင် — `EXCEPT` ရဲ့ ရလဒ်ထဲမှာ duplicate rows တွေ မပါဝင်ပါဘူး။ `ALL` နဲ့ဆိုရင် — ဘယ်ဘက် table ထဲမှာ duplicates `m` ခု ရှိပြီး — ညာဘက် table ထဲမှာ duplicates `n` ခု ရှိတဲ့ row တစ်ခုက result set ထဲမှာ max(`m`-`n`,0) ကြိမ် ပေါ်ပါလိမ့်မယ်။ `DISTINCT` ကို — duplicate rows တွေ ဖယ်ရှားတဲ့ default အပြုအမူကို အတိအကျ သတ်မှတ်ဖို့ ရေးနိုင်ပါတယ်။

SELECT statement တစ်ခုတည်းထဲမှာ `EXCEPT` operators အများအပြားကို — parentheses တွေက တခြားနည်း မညွှန်ပြရင် — left ကနေ right ကို အစဉ်လိုက် အကဲဖြတ်ပါတယ်။ `EXCEPT` က `UNION` နဲ့ အဆင့်တူ bind လုပ်ပါတယ်။

လောလောဆယ် — `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့ကို `EXCEPT` ရလဒ်တစ်ခုအတွက်ရော `EXCEPT` တစ်ခုရဲ့ input တစ်ခုခုအတွက်ပါ သတ်မှတ်လို့ မရပါဘူး။

### `ORDER BY` Clause (ORDER BY clause အကြောင်း)

Optional ဖြစ်တဲ့ `ORDER BY` clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...]
```

`ORDER BY` clause က result rows တွေကို သတ်မှတ်ထားတဲ့ expression(s) အရ sort လုပ်စေပါတယ်။ Rows နှစ်ခုက ဘယ်ဘက်အကျဆုံး expression အရ တူညီနေရင် — နောက် expression အရ နှိုင်းယှဉ်ပြီး — စသဖြင့် ဆက်သွားပါတယ်။ သတ်မှတ်ထားတဲ့ expressions တွေ အားလုံးအရ တူညီနေရင် — implementation-dependent (အကောင်အထည်ဖော်မှုပေါ် မူတည်တဲ့) အစဉ်တစ်ခုနဲ့ ပြန်ပေးပါတယ်။

`expression` တစ်ခုချင်းစီက output column (`SELECT` list item) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် ordinal number (စဉ်နံပါတ်) ဖြစ်နိုင်သလို — input-column တန်ဖိုးတွေကနေ ဖွဲ့စည်းထားတဲ့ arbitrary expression တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။

Ordinal number က output column ရဲ့ ordinal (left-to-right) အနေအထားကို ရည်ညွှန်းပါတယ်။ ဒီ feature က ထူးခြားတဲ့ (unique) နာမည်တစ်ခု မရှိတဲ့ column တစ်ခုကို အခြေခံပြီး ordering တစ်ခုကို သတ်မှတ်နိုင်စေပါတယ်။ Output column တစ်ခုကို `AS` clause သုံးပြီး နာမည်တစ်ခု သတ်မှတ်ပေးတာ အမြဲတမ်း ဖြစ်နိုင်လို့ — ဒါက လုံးဝ မဖြစ်မနေ လိုအပ်တာ မဟုတ်ပါဘူး။

`ORDER BY` clause ထဲမှာ — `SELECT` output list ထဲမှာ မပေါ်တဲ့ columns တွေ အပါအဝင် — arbitrary expressions တွေကိုလည်း သုံးနိုင်ပါတယ်။ ဒါကြောင့် အောက်ပါ statement က valid ဖြစ်ပါတယ်:

```sql
SELECT name FROM distributors ORDER BY code;
```

ဒီ feature ရဲ့ ကန့်သတ်ချက်တစ်ခုက — `UNION`, `INTERSECT` ဒါမှမဟုတ် `EXCEPT` clause တစ်ခုရဲ့ ရလဒ်ကို သက်ရောက်တဲ့ `ORDER BY` clause တစ်ခုက output column နာမည် ဒါမှမဟုတ် နံပါတ်ကိုပဲ သတ်မှတ်နိုင်ပြီး — expression တစ်ခုကို မသတ်မှတ်နိုင်တာပါ။

`ORDER BY` expression တစ်ခုက output column နာမည်တစ်ခုနဲ့ရော input column နာမည်တစ်ခုနဲ့ပါ ကိုက်ညီနေတဲ့ ရိုးရှင်းတဲ့ နာမည်တစ်ခု ဖြစ်နေရင် — `ORDER BY` က ၎င်းကို output column နာမည်အနေနဲ့ အဓိပ္ပာယ် ကောက်ယူပါလိမ့်မယ်။ ဒါက အလားတူ အခြေအနေမှာ `GROUP BY` က လုပ်မယ့် ရွေးချယ်မှုရဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။ ဒီ မညီညွတ်မှုကို SQL standard နဲ့ လိုက်ဖက်စေဖို့ လုပ်ထားတာပါ။

Optional အနေနဲ့ — `ORDER BY` clause ထဲမှာ expression တစ်ခုခုရဲ့ နောက်မှာ `ASC` (ascending — ငယ်စဉ်ကြီးလိုက်) ဒါမှမဟုတ် `DESC` (descending — ကြီးစဉ်ငယ်လိုက်) ဆိုတဲ့ key word ကို ထည့်နိုင်ပါတယ်။ မသတ်မှတ်ရင် — default အနေနဲ့ `ASC` လို့ ယူဆပါတယ်။ တနည်းအားဖြင့် — `USING` clause ထဲမှာ တိကျတဲ့ ordering operator နာမည်တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ Ordering operator တစ်ခုက B-tree operator family တစ်ခုခုရဲ့ less-than ဒါမှမဟုတ် greater-than member တစ်ခု ဖြစ်ရပါမယ်။ `ASC` က ပုံမှန်အားဖြင့် `USING <` နဲ့ ညီမျှပြီး — `DESC` က ပုံမှန်အားဖြင့် `USING >` နဲ့ ညီမျှပါတယ်။ (ဒါပေမယ့် — user-defined data type တစ်ခုရဲ့ ဖန်တီးသူက default sort ordering ဆိုတာ အတိအကျ ဘာလဲဆိုတာ သတ်မှတ်နိုင်ပြီး — ၎င်းက တခြား နာမည်တွေရှိတဲ့ operators တွေနဲ့ ကိုက်ညီနေနိုင်ပါတယ်။)

`NULLS LAST` သတ်မှတ်ထားရင် — null values တွေက non-null values တွေ အားလုံးရဲ့ နောက်မှာ sort လုပ်ပြီး — `NULLS FIRST` သတ်မှတ်ထားရင် — null values တွေက non-null values တွေ အားလုံးရဲ့ ရှေ့မှာ sort လုပ်ပါတယ်။ တစ်ခုမှ မသတ်မှတ်ရင် — `ASC` သတ်မှတ်ထားတဲ့အခါ ဒါမှမဟုတ် implied (ဆိုလိုရင်း ပါနေတဲ့)အခါ default အပြုအမူက `NULLS LAST` ဖြစ်ပြီး — `DESC` သတ်မှတ်ထားတဲ့အခါ `NULLS FIRST` ဖြစ်ပါတယ် (ဒါကြောင့် — default အနေနဲ့ nulls တွေက non-nulls တွေထက် ပိုကြီးတယ်လို့ ယူဆပါတယ်)။ `USING` သတ်မှတ်ထားတဲ့အခါ — default nulls ordering က operator က less-than လား greater-than လားပေါ်မှာ မူတည်ပါတယ်။

Ordering options တွေက သူတို့ နောက်မှာ လိုက်တဲ့ expression ကိုပဲ သက်ရောက်တယ်ဆိုတာ သတိပြုပါ; ဥပမာ — `ORDER BY x, y DESC` က `ORDER BY x DESC, y DESC` နဲ့ အဓိပ္ပာယ် မတူပါဘူး။

Character-string data တွေကို — sort လုပ်နေတဲ့ column အတွက် သက်ရောက်နေတဲ့ collation အရ sort လုပ်ပါတယ်။ ၎င်းကို — expression ထဲမှာ `COLLATE` clause တစ်ခု ထည့်သွင်းခြင်းအားဖြင့် လိုအပ်ရင် override လုပ်နိုင်ပါတယ် — ဥပမာ — `ORDER BY mycolumn COLLATE "en_US"`။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 4.2.10](/docs/postgresql/sql-expressions) နဲ့ [အပိုင်း 23.2](https://www.postgresql.org/docs/current/collation.html) ကို ကြည့်ပါ။

### `LIMIT` Clause (LIMIT clause အကြောင်း)

`LIMIT` clause က သီးခြား sub-clauses နှစ်ခု ပါဝင်ပါတယ်:

```sql
LIMIT { count | ALL }
OFFSET start
```

`count` parameter က ပြန်ပေးရမယ့် rows အများဆုံး အရေအတွက်ကို သတ်မှတ်ပြီး — `start` ကတော့ rows တွေ စတင် ပြန်ပေးခြင်းမတိုင်ခင် ကျော်လိုက်ရမယ့် rows အရေအတွက်ကို သတ်မှတ်ပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားတဲ့အခါ — ပြန်ပေးရမယ့် `count` rows တွေကို စတင် ရေတွက်ခြင်းမတိုင်ခင် `start` rows တွေကို ကျော်လိုက်ပါတယ်။

`count` expression က NULL အဖြစ် အကဲဖြတ်ရင် — ၎င်းကို `LIMIT ALL` လို့ သတ်မှတ်ပြီး — ဆိုလိုတာက limit မရှိဘူးလို့ ဆိုပါတယ်။ `start` က NULL အဖြစ် အကဲဖြတ်ရင် — ၎င်းကို `OFFSET 0` နဲ့ အတူတူပဲ သတ်မှတ်ပါတယ်။

SQL:2008 က ရလဒ်တစ်ခုတည်းကို ရဖို့ မတူညီတဲ့ syntax တစ်ခုကို မိတ်ဆက်ပေးခဲ့ပြီး — PostgreSQL ကလည်း ၎င်းကို ထောက်ပံ့ပါတယ်။ ၎င်းကတော့:

```sql
OFFSET start { ROW | ROWS }
FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } { ONLY | WITH TIES }
```

ဒီ syntax ထဲမှာ — `start` ဒါမှမဟုတ် `count` တန်ဖိုးကို standard အရ literal constant တစ်ခု၊ parameter တစ်ခု ဒါမှမဟုတ် variable နာမည်တစ်ခု ဖြစ်ရန် လိုအပ်ပြီး — PostgreSQL extension တစ်ခုအနေနဲ့တော့ တခြား expressions တွေကိုလည်း ခွင့်ပြုပေမယ့် — မရှင်းလင်းမှုတွေ ရှောင်ဖို့ ယေဘုယျအားဖြင့် parentheses တွေနဲ့ ဝန်းရံထားရန် လိုအပ်ပါလိမ့်မယ်။ `FETCH` clause တစ်ခုထဲမှာ `count` ကို ချန်လိုက်ရင် — ၎င်းက 1 လို့ default ဖြစ်ပါတယ်။ `WITH TIES` option ကို — `ORDER BY` clause အရ result set ထဲမှာ နောက်ဆုံး နေရာအတွက် ချိတ်ဆွဲနေတဲ့ (tie) rows တွေ ဖြစ်တဲ့ rows အပိုတွေ ပြန်ပေးဖို့ သုံးပါတယ်; ဒီကိစ္စမှာ `ORDER BY` က မဖြစ်မနေ လိုအပ်ပြီး — `SKIP LOCKED` ကို ခွင့်မပြုပါဘူး။ `ROW` နဲ့ `ROWS` ရော — `FIRST` နဲ့ `NEXT` ရောက ဒီ clauses တွေရဲ့ သက်ရောက်မှုတွေကို မလွှမ်းမိုးတဲ့ — noise words (အဓိပ္ပာယ် သက်ရောက်မှု မရှိတဲ့ စကားလုံးများ) တွေ ဖြစ်ပါတယ်။ Standard အရ — `OFFSET` clause နဲ့ `FETCH` clause နှစ်ခုလုံး ရှိနေရင် `OFFSET` clause က `FETCH` clause ရဲ့ ရှေ့မှာ လာရပါမယ်; ဒါပေမယ့် — PostgreSQL ကတော့ ပိုပြီး လျော့ရဲပြီး — အစဉ်တစ်ခုခုကို ခွင့်ပြုပါတယ်။

`LIMIT` သုံးတဲ့အခါ — result rows တွေကို ထူးခြားတဲ့ (unique) အစဉ်တစ်ခုအဖြစ် ကန့်သတ်ပေးတဲ့ `ORDER BY` clause တစ်ခုကို သုံးတာ ကောင်းပါတယ်။ မဟုတ်ရင် — query ရဲ့ rows တွေထဲက ကြိုတင်ခန့်မှန်းလို့ မရတဲ့ subset တစ်ခုကို ရပါလိမ့်မယ် — မင်း ဆယ်ခုမြောက်ကနေ နှစ်ဆယ်ခုမြောက် rows တွေကို တောင်းနေပေမယ့် — ဘယ် ordering ရဲ့ ဆယ်ခုမြောက်ကနေ နှစ်ဆယ်ခုမြောက်လဲ? `ORDER BY` ကို မသတ်မှတ်ရင် ဘယ် ordering ဆိုတာ မင်း မသိနိုင်ပါဘူး။

Query planner က query plan တစ်ခု ထုတ်လုပ်တဲ့အခါ `LIMIT` ကို ထည့်သွင်း စဉ်းစားပြီး — ဒါကြောင့် — `LIMIT` နဲ့ `OFFSET` အတွက် မင်း သုံးတဲ့အရာပေါ်မူတည်ပြီး (မတူညီတဲ့ row order တွေ ထွက်စေနိုင်တဲ့) plans အမျိုးမျိုး ရဖို့ အလွန် ဖြစ်နိုင်ခြေ ရှိပါတယ်။ ဒါကြောင့် — `ORDER BY` နဲ့ ကြိုတင်ခန့်မှန်းလို့ရတဲ့ result ordering တစ်ခုကို အတင်းအကျပ် မလုပ်ထားရင် — query result တစ်ခုရဲ့ မတူညီတဲ့ subsets တွေကို ရွေးဖို့ `LIMIT`/`OFFSET` တန်ဖိုး အမျိုးမျိုး သုံးတာက မတသမတ် ရလဒ်တွေ ပေးပါလိမ့်မယ်။ ဒါက bug မဟုတ်ပါဘူး; SQL က `ORDER BY` နဲ့ အစဉ်ကို ကန့်သတ်မထားရင် query တစ်ခုရဲ့ ရလဒ်တွေကို ဘယ် အထူး အစဉ်တစ်ခုနဲ့မဆို ပေးပါမယ်လို့ ကတိမထားဘူးဆိုတဲ့ အချက်ရဲ့ မွေးရာပါ အကျိုးဆက် ဖြစ်ပါတယ်။

Deterministic (ကြိုတင် ခန့်မှန်းလို့ရတဲ့) subset တစ်ခုကို ရွေးချယ်တာကို အတင်းအကျပ် လုပ်ဖို့ `ORDER BY` မရှိဘူးဆိုရင် — LIMIT query တစ်ခုတည်းကို ထပ်ခါထပ်ခါ execute လုပ်တာတောင် — table တစ်ခုရဲ့ rows တွေထဲက မတူညီတဲ့ subsets တွေ ပြန်ပေးဖို့ ဖြစ်နိုင်ပါတယ်။ ဒါလည်း bug မဟုတ်ပါဘူး; ဒီလို အခြေအနေမျိုးမှာ ရလဒ်တွေရဲ့ determinism ကို ရိုးရိုးရှင်းရှင်း အာမခံမထားပါဘူး။

### The Locking Clause (locking clause အကြောင်း)

`FOR UPDATE`, `FOR NO KEY UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` တို့က *locking clauses* တွေ ဖြစ်ပြီး — table ကနေ rows တွေကို ရယူတဲ့အခါ `SELECT` က rows တွေကို ဘယ်လို lock လုပ်လဲဆိုတာကို သက်ရောက်မှု ရှိပါတယ်။

Locking clause ရဲ့ ယေဘုယျ ပုံစံက:

```sql
FOR lock_strength [ OF from_reference [, ...] ] [ NOWAIT | SKIP LOCKED ]
```

ဒီမှာ `lock_strength` က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပြီး:

```sql
UPDATE
NO KEY UPDATE
SHARE
KEY SHARE
```

`from_reference` က `FROM` clause ထဲမှာ ရည်ညွှန်းထားတဲ့ table `alias` တစ်ခု ဒါမှမဟုတ် hidden မဟုတ်တဲ့ (non-hidden) `table_name` တစ်ခု ဖြစ်ရပါမယ်။ Row-level lock mode တစ်ခုချင်းစီအကြောင်း နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 13.3.2](/docs/postgresql/explicit-locking) ကို ရည်ညွှန်း ကြည့်ပါ။

Operation က တခြား transactions တွေ commit လုပ်တာကို စောင့်ဆိုင်းတာ မဖြစ်စေဖို့ — `NOWAIT` ဒါမှမဟုတ် `SKIP LOCKED` option နှစ်ခုထဲက တစ်ခုကို သုံးပါ။ `NOWAIT` နဲ့ဆိုရင် — ရွေးချယ်ထားတဲ့ row တစ်ခုကို ချက်ချင်း lock လုပ်လို့ မရဘူးဆိုရင် — statement က စောင့်ဆိုင်းမယ့်အစား error တစ်ခု အစီရင်ခံပါတယ်။ `SKIP LOCKED` နဲ့ဆိုရင် — ချက်ချင်း lock လုပ်လို့ မရတဲ့ ရွေးချယ်ထားတဲ့ rows တွေကို ကျော်လိုက်ပါတယ်။ Locked rows တွေကို ကျော်လိုက်တာက data ရဲ့ မတသမတ် ရှုမြင်မှု (inconsistent view) တစ်ခုကို ပေးတာမို့ — ယေဘုယျ ရည်ရွယ်ချက် အလုပ်တွေအတွက် မသင့်လျော်ပေမယ့် — queue ပုံစံ table တစ်ခုကို ဝင်ရောက်နေတဲ့ consumers အများအပြားနဲ့ lock contention (lock ပြိုင်ဆိုင်မှု) ကို ရှောင်ဖို့တော့ သုံးနိုင်ပါတယ်။ `NOWAIT` နဲ့ `SKIP LOCKED` တို့က row-level lock(s) တွေကိုပဲ သက်ရောက်တယ်ဆိုတာ သတိပြုပါ — လိုအပ်တဲ့ `ROW SHARE` table-level lock ကိုတော့ သာမန် နည်းအတိုင်း ဆက်လက် ယူဆဲ ဖြစ်ပါတယ် ([အခန်း 13](https://www.postgresql.org/docs/current/mvcc.html) ကို ကြည့်ပါ)။ Table-level lock ကို မစောင့်ဘဲ ရယူဖို့ လိုအပ်ရင် — `NOWAIT` option ပါတဲ့ [`LOCK`](/docs/postgresql/sql-lock) ကို အရင်ဆုံး သုံးနိုင်ပါတယ်။

Locking clause တစ်ခုထဲမှာ တိကျတဲ့ tables တွေကို နာမည်ပေးထားရင် — အဲဒီ tables တွေကနေ လာတဲ့ rows တွေကိုပဲ lock လုပ်ပြီး — `SELECT` ထဲမှာ သုံးထားတဲ့ တခြား tables တွေကိုတော့ သာမန်အတိုင်း ဖတ်ရုံသာ ဖတ်ပါတယ်။ Table list မပါတဲ့ locking clause တစ်ခုက statement ထဲမှာ သုံးထားတဲ့ tables တွေ အားလုံးကို သက်ရောက်ပါတယ်။ Locking clause တစ်ခုကို view ဒါမှမဟုတ် sub-query တစ်ခုအပေါ်မှာ သက်ရောက်စေရင် — view ဒါမှမဟုတ် sub-query ထဲမှာ သုံးထားတဲ့ tables တွေ အားလုံးကို သက်ရောက်ပါတယ်။ ဒါပေမယ့် — ဒီ clauses တွေက primary query က ရည်ညွှန်းထားတဲ့ `WITH` queries တွေကိုတော့ သက်ရောက်မှု မရှိပါဘူး။ `WITH` query တစ်ခုအတွင်းမှာ row locking ဖြစ်ပေါ်စေချင်ရင် — `WITH` query ရဲ့ အတွင်းမှာ locking clause တစ်ခုကို သတ်မှတ်ပါ။

မတူညီတဲ့ tables တွေအတွက် မတူညီတဲ့ locking အပြုအမူတွေ သတ်မှတ်ဖို့ လိုအပ်ရင် — locking clauses အများအပြားကို ရေးနိုင်ပါတယ်။ Table တစ်ခုတည်းကို locking clause တစ်ခုထက်ပိုနဲ့ ဖော်ပြထား (ဒါမှမဟုတ် သွယ်ဝိုက်၍ သက်ရောက်ခံရ) ရင် — ၎င်းကို အပြင်းထန်ဆုံး (strongest) clause တစ်ခုနဲ့ပဲ သတ်မှတ်ထားသလို process လုပ်ပါတယ်။ အလားတူ — table တစ်ခုကို ၎င်းကို သက်ရောက်တဲ့ clauses တစ်ခုခုထဲမှာ `NOWAIT` သတ်မှတ်ထားရင် `NOWAIT` နဲ့ process လုပ်ပြီး — မဟုတ်ရင် — ၎င်းကို သက်ရောက်တဲ့ clauses တစ်ခုခုထဲမှာ `SKIP LOCKED` သတ်မှတ်ထားရင် `SKIP LOCKED` နဲ့ process လုပ်ပါတယ်။

Locking clauses တွေကို — ပြန်ပေးတဲ့ rows တွေကို table row တစ်ခုချင်းစီနဲ့ ရှင်းလင်းစွာ ခွဲခြားသတ်မှတ်လို့ မရတဲ့ contexts တွေမှာ သုံးလို့ မရပါဘူး; ဥပမာ — aggregation တွေနဲ့ သုံးလို့ မရပါဘူး။

Locking clause တစ်ခု `SELECT` query တစ်ခုရဲ့ ထိပ်ဆုံးအဆင့်မှာ ပေါ်တဲ့အခါ — lock လုပ်ခံရတဲ့ rows တွေက query က ပြန်ပေးတဲ့ rows တွေနဲ့ အတိအကျ တူညီပြီး — join query တစ်ခုရဲ့ ကိစ္စမှာ — lock လုပ်ခံရတဲ့ rows တွေက ပြန်ပေးတဲ့ join rows တွေကို ပံ့ပိုးပေးတဲ့ rows တွေ ဖြစ်ပါတယ်။ ထို့ပြင် — query snapshot အရ query conditions တွေကို ကျေနပ်ခဲ့တဲ့ rows တွေကိုလည်း lock လုပ်ပါလိမ့်မယ် — ဒါပေမယ့် — snapshot ပြီးနောက်မှာ update လုပ်ခံခဲ့ရပြီး — query conditions တွေကို နောက်ထပ် မကျေနပ်တော့ဘူးဆိုရင် သူတို့ကို ပြန်ပေးမှာ မဟုတ်ပါဘူး။ `LIMIT` သုံးထားရင် — limit ကို ကျေနပ်စေဖို့ rows အလုံအလောက် ပြန်ပေးလိုက်တာနဲ့ locking ရပ်တန့်ပါတယ် (ဒါပေမယ့် — `OFFSET` က ကျော်သွားတဲ့ rows တွေကိုတော့ lock လုပ်ခံရမယ်ဆိုတာ သတိပြုပါ)။ အလားတူ — locking clause တစ်ခုကို cursor တစ်ခုရဲ့ query ထဲမှာ သုံးထားရင် — cursor က တကယ် fetch လုပ်တဲ့ ဒါမှမဟုတ် ကျော်ဖြတ်သွားတဲ့ rows တွေကိုပဲ lock လုပ်ပါလိမ့်မယ်။

Locking clause တစ်ခု sub-`SELECT` တစ်ခုထဲမှာ ပေါ်တဲ့အခါ — lock လုပ်ခံရတဲ့ rows တွေက sub-query က outer query ဆီ ပြန်ပေးတဲ့ rows တွေ ဖြစ်ပါတယ်။ Outer query ကနေ လာတဲ့ conditions တွေကို sub-query ရဲ့ execution ကို optimize လုပ်ဖို့ သုံးနိုင်လို့ — ဒါက sub-query တစ်ခုတည်းကို စစ်ဆေးကြည့်ရုံနဲ့ ထင်ရမယ့်ထက် rows နည်းနည်းပဲ ပါဝင်စေနိုင်ပါတယ်။ ဥပမာ:

```sql
SELECT * FROM (SELECT * FROM mytable FOR UPDATE) ss WHERE col1 = 5;
```

ဒါက — အဲဒီ condition က sub-query ရဲ့ အတွင်းမှာ စာသားအတိုင်း (textually) မပါဝင်ပေမယ့် — `col1 = 5` ရှိတဲ့ rows တွေကိုပဲ lock လုပ်ပါလိမ့်မယ်။

အရင် releases တွေက နောက်ပိုင်း savepoint တစ်ခုက upgrade လုပ်တဲ့ lock တစ်ခုကို ထိန်းသိမ်းရန် ပျက်ကွက်ခဲ့ပါတယ်။ ဥပမာ — ဒီ code:

```sql
BEGIN;
SELECT * FROM mytable WHERE key = 1 FOR UPDATE;
SAVEPOINT s;
UPDATE mytable SET ... WHERE key = 1;
ROLLBACK TO s;
```

ဆိုတာက `ROLLBACK TO` ပြီးနောက်မှာ `FOR UPDATE` lock ကို ထိန်းသိမ်းရန် ပျက်ကွက်ပါလိမ့်မယ်။ ဒါကို release 9.3 မှာ ပြုပြင်ပြီးပါပြီ။

> **သတိထားရန်:** `READ COMMITTED` transaction isolation level မှာ run နေပြီး — `ORDER BY` နဲ့ locking clause တစ်ခုကို သုံးထားတဲ့ — `SELECT` command တစ်ခုက rows တွေကို အစဉ်လွဲ (out of order) ပြန်ပေးဖို့ ဖြစ်နိုင်ပါတယ်။ အကြောင်းကတော့ `ORDER BY` ကို အရင်ဆုံး သက်ရောက်လို့ပါ။ Command က ရလဒ်ကို sort လုပ်ပေမယ့် — rows တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပေါ်မှာ lock တစ်ခု ရယူဖို့ ကြိုးစားရာမှာ ပိတ်ဆို့သွားနိုင်ပါတယ်။ `SELECT` က unblock ဖြစ်သွားတာနဲ့ — ordering column တန်ဖိုး တချို့ကို ပြုပြင်မွမ်းမံခံထားရပြီး ဖြစ်နိုင်လို့ — အဲဒီ rows တွေ အစဉ်လွဲ ပေါ်နေသလို ဖြစ်စေနိုင်ပါတယ် (မူလ column တန်ဖိုးတွေရဲ့ သွင်ပြင်အရတော့ အစဉ်လိုက် ရှိနေဆဲပါ)။ ဒါကို လိုအပ်ရင် — `FOR UPDATE/SHARE` clause ကို sub-query တစ်ခုထဲမှာ ထားခြင်းအားဖြင့် ရှောင်ကွင်းနိုင်ပါတယ် — ဥပမာ:
> 
> ```sql
> SELECT * FROM (SELECT * FROM mytable FOR UPDATE) ss ORDER BY column1;
> ```
> 
> ဒါက `mytable` ရဲ့ rows တွေ အားလုံးကို lock လုပ်ရာရောက်မယ်ဆိုတာ သတိပြုပါ — `FOR UPDATE` ကို ထိပ်ဆုံးအဆင့်မှာ သုံးရင် တကယ် ပြန်ပေးတဲ့ rows တွေကိုပဲ lock လုပ်မှာ ဖြစ်ပါတယ်။ အထူးသဖြင့် `ORDER BY` ကို `LIMIT` ဒါမှမဟုတ် တခြား ကန့်သတ်ချက်တွေနဲ့ ပေါင်းစပ်ထားရင် — ဒါက သိသာတဲ့ performance ကွာခြားချက် ဖြစ်စေနိုင်ပါတယ်။ ဒါကြောင့် — ordering columns တွေအပေါ်မှာ concurrent updates တွေ မျှော်လင့်ထားပြီး — တင်းကျပ်စွာ sort လုပ်ထားတဲ့ ရလဒ်တစ်ခု လိုအပ်တဲ့အခါမှသာ ဒီ technique ကို အကြံပြုပါတယ်။
> 
> `REPEATABLE READ` ဒါမှမဟုတ် `SERIALIZABLE` transaction isolation level တွေမှာတော့ — ဒါက serialization failure (serialization မအောင်မြင်မှု — `SQLSTATE` `'40001'` နဲ့) တစ်ခုကို ဖြစ်စေပြီး — ဒီ isolation levels တွေအောက်မှာ rows တွေကို အစဉ်လွဲ လက်ခံရရှိဖို့ ဖြစ်နိုင်ခြေ မရှိပါဘူး။

### `TABLE` Command (TABLE command အကြောင်း)

ဒီ command က:

```sql
TABLE name
```

အောက်ပါနဲ့ ညီမျှပါတယ်:

```sql
SELECT * FROM name
```

ဒါကို top-level command တစ်ခုအနေနဲ့ ဒါမှမဟုတ် — ရှုပ်ထွေးတဲ့ queries တွေရဲ့ အစိတ်အပိုင်းတွေထဲမှာ space သက်သာတဲ့ syntax variant တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။ `TABLE` နဲ့တွဲပြီး `WITH`, `UNION`, `INTERSECT`, `EXCEPT`, `ORDER BY`, `LIMIT`, `OFFSET`, `FETCH` နဲ့ `FOR` locking clauses တွေကိုပဲ သုံးလို့ ရပြီး — `WHERE` clause ရော — aggregation ရဲ့ ဘယ်ပုံစံမဆို — သုံးလို့ မရပါဘူး။

## Examples (ဥပမာများ)

`films` table ကို `distributors` table နဲ့ join လုပ်ဖို့:

```sql
SELECT f.title, f.did, d.name, f.date_prod, f.kind
    FROM distributors d JOIN films f USING (did);

       title       | did |     name     | date_prod  |   kind
-------------------+-----+--------------+------------+----------
 The Third Man     | 101 | British Lion | 1949-12-23 | Drama
 The African Queen | 101 | British Lion | 1951-08-11 | Romantic
 ...
```

`films` တွေ အားလုံးရဲ့ `len` column ကို စုစည်း (sum) ပြီး — ရလဒ်တွေကို `kind` နဲ့ group လုပ်ဖို့:

```sql
SELECT kind, sum(len) AS total FROM films GROUP BY kind;

   kind   | total
----------+-------
 Action   | 07:34
 Comedy   | 02:58
 Drama    | 14:28
 Musical  | 06:42
 Romantic | 04:38
```

`films` တွေ အားလုံးရဲ့ `len` column ကို စုစည်း ပြီး — ရလဒ်တွေကို `kind` နဲ့ group လုပ်ကာ — 5 နာရီထက် နည်းတဲ့ group စုစုပေါင်းတွေကိုပဲ ပြသဖို့:

```sql
SELECT kind, sum(len) AS total
    FROM films
    GROUP BY kind
    HAVING sum(len) < interval '5 hours';

   kind   | total
----------+-------
 Comedy   | 02:58
 Romantic | 04:38
```

အောက်က ဥပမာ နှစ်ခုက — ဒုတိယ column (`name`) ရဲ့ ပါဝင်ပစ္စည်းတွေအရ ရလဒ်တစ်ခုချင်းစီကို sort လုပ်တဲ့ — နည်းလမ်းတူ ဥပမာ နှစ်ခု ဖြစ်ပါတယ်:

```sql
SELECT * FROM distributors ORDER BY name;
SELECT * FROM distributors ORDER BY 2;

 did |       name
-----+------------------
 109 | 20th Century Fox
 110 | Bavaria Atelier
 101 | British Lion
 107 | Columbia
 102 | Jean Luc Godard
 113 | Luso films
 104 | Mosfilm
 103 | Paramount
 106 | Toho
 105 | United Artists
 111 | Walt Disney
 112 | Warner Bros.
 108 | Westward
```

နောက် ဥပမာက — table တစ်ခုချင်းစီထဲမှာ W စာလုံးနဲ့ စတင်တဲ့ ရလဒ်တွေကိုပဲ ကန့်သတ်ပြီး — `distributors` နဲ့ `actors` tables တွေရဲ့ union ကို ဘယ်လို ရယူမလဲဆိုတာ ပြသပါတယ်။ Distinct rows တွေကိုပဲ လိုချင်တာမို့ — `ALL` ဆိုတဲ့ key word ကို ချန်လိုက်ပါတယ်။

```sql
distributors:               actors:
 did |     name              id |     name
-----+--------------        ----+----------------
 108 | Westward               1 | Woody Allen
 111 | Walt Disney            2 | Warren Beatty
 112 | Warner Bros.           3 | Walter Matthau
 ...                         ...

SELECT distributors.name
    FROM distributors
    WHERE distributors.name LIKE 'W%'
UNION
SELECT actors.name
    FROM actors
    WHERE actors.name LIKE 'W%';

      name
----------------
 Walt Disney
 Walter Matthau
 Warner Bros.
 Warren Beatty
 Westward
 Woody Allen
```

ဒီ ဥပမာက — `FROM` clause ထဲမှာ function တစ်ခုကို column definition list တစ်ခု ပါပါစေ မပါပါစေ — ဘယ်လို သုံးမလဲဆိုတာ ပြသပါတယ်:

```
CREATE FUNCTION distributors(int) RETURNS SETOF distributors AS $$
    SELECT * FROM distributors WHERE did = $1;
$$ LANGUAGE SQL;

SELECT * FROM distributors(111);
 did |    name
-----+-------------
 111 | Walt Disney

CREATE FUNCTION distributors_2(int) RETURNS SETOF record AS $$
    SELECT * FROM distributors WHERE did = $1;
$$ LANGUAGE SQL;

SELECT * FROM distributors_2(111) AS (f1 int, f2 text);
 f1  |     f2
-----+-------------
 111 | Walt Disney
```

ဒီမှာတော့ ordinality column တစ်ခု ထပ်ထည့်ထားတဲ့ function တစ်ခုရဲ့ ဥပမာ ဖြစ်ပါတယ်:

```sql
SELECT * FROM unnest(ARRAY['a','b','c','d','e','f']) WITH ORDINALITY;
 unnest | ordinality
--------+----------
 a      |        1
 b      |        2
 c      |        3
 d      |        4
 e      |        5
 f      |        6
(6 rows)
```

ဒီ ဥပမာက ရိုးရှင်းတဲ့ `WITH` clause တစ်ခုကို ဘယ်လို သုံးမလဲဆိုတာ ပြသပါတယ်:

```sql
WITH t AS (
    SELECT random() as x FROM generate_series(1, 3)
  )
SELECT * FROM t
UNION ALL
SELECT * FROM t;
         x
--------------------
  0.534150459803641
  0.520092216785997
 0.0735620250925422
  0.534150459803641
  0.520092216785997
 0.0735620250925422
```

`WITH` query ကို တစ်ကြိမ်ပဲ အကဲဖြတ်ခဲ့တာမို့ — တူညီတဲ့ random တန်ဖိုး သုံးခုရဲ့ sets နှစ်စုံ ရလိုက်တာကို သတိပြုပါ။

ဒီ ဥပမာက — တိုက်ရိုက် subordinates တွေကိုပဲ ပြသထားတဲ့ table တစ်ခုကနေ — အလုပ်သမား Mary ရဲ့ subordinates (တိုက်ရိုက် ဖြစ်စေ သွယ်ဝိုက်၍ ဖြစ်စေ) တွေ အားလုံးကို သူတို့ရဲ့ indirectness အဆင့်နဲ့အတူ ရှာဖွေဖို့ `WITH RECURSIVE` ကို သုံးပါတယ်:

```sql
WITH RECURSIVE employee_recursive(distance, employee_name, manager_name) AS (
    SELECT 1, employee_name, manager_name
    FROM employee
    WHERE manager_name = 'Mary'
  UNION ALL
    SELECT er.distance + 1, e.employee_name, e.manager_name
    FROM employee_recursive er, employee e
    WHERE er.employee_name = e.manager_name
  )
SELECT distance, employee_name FROM employee_recursive;
```

Recursive queries တွေရဲ့ ပုံမှန် ပုံစံကို သတိပြုပါ: ကနဦး condition တစ်ခု၊ နောက်မှာ `UNION`၊ ပြီးတော့ query ရဲ့ recursive အပိုင်း။ Query ရဲ့ recursive အပိုင်းက နောက်ဆုံးမှာ tuples ဘာမှ မပြန်တော့ဘူးဆိုတာ သေချာစေပါ — မဟုတ်ရင် query က အကန့်အသတ် မရှိ loop ဖြစ်နေပါလိမ့်မယ်။ (နောက်ထပ် ဥပမာတွေအတွက် [အပိုင်း 7.8](/docs/postgresql/queries-with) ကို ကြည့်ပါ။)

ဒီ ဥပမာက — `manufacturers` table ရဲ့ row တစ်ခုချင်းစီအတွက် — set-returning function တစ်ခုဖြစ်တဲ့ `get_product_names()` ကို သက်ရောက်ဖို့ `LATERAL` ကို သုံးပါတယ်:

```sql
SELECT m.name AS mname, pname
FROM manufacturers m, LATERAL get_product_names(m.id) pname;
```

လောလောဆယ် ထုတ်ကုန် (product) တစ်ခုမှ မရှိသေးတဲ့ manufacturers တွေက — ဒါက inner join ဖြစ်လို့ — result ထဲမှာ ပေါ်လာမှာ မဟုတ်ပါဘူး။ ဒီလို manufacturers တွေရဲ့ နာမည်တွေကိုပါ result ထဲမှာ ထည့်သွင်းချင်တယ်ဆိုရင် — အောက်ပါအတိုင်း လုပ်နိုင်ပါတယ်:

```sql
SELECT m.name AS mname, pname
FROM manufacturers m LEFT JOIN LATERAL get_product_names(m.id) pname ON true;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဟုတ်ပါတယ် — `SELECT` statement က SQL standard နဲ့ လိုက်ဖက်ညီပါတယ်။ ဒါပေမယ့် — extension တွေရော — ပျောက်နေတဲ့ features တချို့ရော ရှိပါတယ်။

### Omitted `FROM` Clauses (FROM clause ကို ချန်လိုက်ခြင်း)

PostgreSQL က `FROM` clause ကို ချန်လိုက်ခွင့် ပြုပါတယ်။ ရိုးရှင်းတဲ့ expressions တွေရဲ့ ရလဒ်တွေကို တွက်ချက်ဖို့ ၎င်းမှာ တိုက်ရိုက် အသုံးပြုမှု တစ်ခု ရှိပါတယ်:

```sql
SELECT 2+2;

 ?column?
----------
        4
```

တခြား SQL databases တချို့က — `SELECT` လုပ်ဖို့ dummy one-row table တစ်ခုကို မိတ်ဆက်ပြီးမှသာ ဒါကို လုပ်နိုင်ပါတယ်။

### Empty `SELECT` Lists (SELECT list အလွတ် ဖြစ်ခြင်း)

`SELECT` ရဲ့ နောက်မှာ ရှိတဲ့ output expressions စာရင်းက အလွတ် ဖြစ်နိုင်ပြီး — column သုညခု ပါတဲ့ result table တစ်ခုကို ထုတ်လုပ်ပါတယ်။ SQL standard အရ ဒါက valid syntax မဟုတ်ပါဘူး။ PostgreSQL က column သုညခု ပါတဲ့ tables တွေကို ခွင့်ပြုတာနဲ့ ညီညွတ်စေဖို့ ဒါကို ခွင့်ပြုပါတယ်။ ဒါပေမယ့် — `DISTINCT` သုံးထားတဲ့အခါ အလွတ် စာရင်းတစ်ခုကိုတော့ ခွင့်မပြုပါဘူး။

### Omitting the `AS` Key Word (AS key word ကို ချန်လိုက်ခြင်း)

SQL standard ထဲမှာ — optional ဖြစ်တဲ့ `AS` key word ကို — output column နာမည် အသစ်က valid column နာမည်တစ်ခု (ဆိုလိုတာက — reserved keyword တစ်ခုခုနဲ့ မတူညီတာ) ဖြစ်နေတဲ့အခါတိုင်း — column နာမည်တစ်ခုရဲ့ ရှေ့မှာ ချန်လိုက်လို့ ရပါတယ်။ PostgreSQL ကတော့ နည်းနည်း ပိုတင်းကျပ်ပါတယ်: column နာမည် အသစ်က keyword တစ်ခုခုနဲ့ — reserved ဖြစ်ဖြစ် မဖြစ်ဖြစ် — ကိုက်ညီနေရင် `AS` က လိုအပ်ပါတယ်။ နောက်ပိုင်းမှာ keywords အသစ်တွေ ထပ်ပေါင်းလာနိုင်တာကနေ ဖြစ်နိုင်တဲ့ conflict တွေကို ကာကွယ်ဖို့ — `AS` ကို သုံးတာ ဒါမှမဟုတ် output column နာမည်တွေကို double-quote လုပ်တာ ပြုလုပ်ဖို့ အကြံပြုထားပါတယ်။

`FROM` items တွေထဲမှာ — standard ရော PostgreSQL ရောက alias တစ်ခု မတိုင်ခင် `AS` ကို — alias က unreserved keyword တစ်ခု ဖြစ်နေရင် — ချန်လိုက်ခွင့် ပြုပါတယ်။ ဒါပေမယ့် — syntactic ambiguities (ဝါကျ တည်ဆောက်ပုံ အဓိပ္ပာယ် ကွဲလွဲမှုများ) တွေကြောင့် — output column နာမည်တွေအတွက်တော့ ဒါက လက်တွေ့ မကျတာပါ။

### Omitting Sub-`SELECT` Aliases in `FROM` (FROM ထဲက sub-SELECT alias များကို ချန်လိုက်ခြင်း)

SQL standard အရ — `FROM` list ထဲက sub-`SELECT` တစ်ခုမှာ alias တစ်ခု ရှိရပါမယ်။ PostgreSQL မှာတော့ — ဒီ alias ကို ချန်လိုက်လို့ ရပါတယ်။

### `ONLY` and Inheritance (ONLY နှင့် inheritance)

`ONLY` ရေးတဲ့အခါ — SQL standard က table နာမည် ပတ်လည်မှာ parentheses တွေ လိုအပ်ပါတယ် — ဥပမာ — `SELECT * FROM ONLY (tab1), ONLY (tab2) WHERE ...`။ PostgreSQL ကတော့ ဒီ parentheses တွေကို optional လို့ ယူဆပါတယ်။

PostgreSQL က — child tables တွေ ပါဝင်တဲ့ non-`ONLY` အပြုအမူကို အတိအကျ သတ်မှတ်ဖို့ — နောက်ကလိုက်တဲ့ `*` တစ်ခုကို ရေးခွင့် ပြုပါတယ်။ Standard ကတော့ ဒါကို ခွင့်မပြုပါဘူး။

(ဒီ အချက်တွေက `ONLY` option ကို ထောက်ပံ့တဲ့ SQL commands တွေ အားလုံးအတွက် အညီအမျှ သက်ရောက်ပါတယ်။)

### `TABLESAMPLE` Clause Restrictions (TABLESAMPLE clause ၏ ကန့်သတ်ချက်များ)

`TABLESAMPLE` clause ကို လောလောဆယ် — သာမန် tables နဲ့ materialized views တွေပေါ်မှာပဲ လက်ခံပါတယ်။ SQL standard အရ ဆိုရင် ၎င်းကို FROM item တစ်ခုခုအပေါ်မှာ သက်ရောက်နိုင်စေရမှာ ဖြစ်ပါတယ်။

### Function Calls in `FROM` (FROM ထဲက function ခေါ်ယူမှုများ)

PostgreSQL က function call တစ်ခုကို `FROM` list ရဲ့ member တစ်ခုအနေနဲ့ တိုက်ရိုက် ရေးခွင့် ပြုပါတယ်။ SQL standard ထဲမှာတော့ — ဒီလို function call တစ်ခုကို sub-`SELECT` တစ်ခုထဲမှာ ထုပ်ပိုးဖို့ လိုအပ်ပါလိမ့်မယ်; ဆိုလိုတာက — `FROM func(...) alias` ဆိုတဲ့ syntax က `FROM LATERAL (SELECT func(...)) alias` နဲ့ အကြမ်းဖျင်း ညီမျှပါတယ်။ `LATERAL` ကို implicit (သွယ်ဝိုက်) လို့ ယူဆတယ်ဆိုတာ သတိပြုပါ; အကြောင်းကတော့ — standard က `FROM` ထဲက `UNNEST()` item တစ်ခုအတွက် `LATERAL` semantics တွေ လိုအပ်လို့ပါ။ PostgreSQL က `UNNEST()` ကို တခြား set-returning functions တွေလိုပဲ ဆက်ဆံပါတယ်။

### Namespace Available to `GROUP BY` and `ORDER BY` (GROUP BY နှင့် ORDER BY တို့အတွက် ရနိုင်သော namespace)

SQL-92 standard ထဲမှာ — `ORDER BY` clause တစ်ခုက output column နာမည်တွေ ဒါမှမဟုတ် နံပါတ်တွေကိုပဲ သုံးနိုင်ပြီး — `GROUP BY` clause တစ်ခုကတော့ input column နာမည်တွေကို အခြေခံတဲ့ expressions တွေကိုပဲ သုံးနိုင်ပါတယ်။ PostgreSQL က ဒီ clauses တစ်ခုချင်းစီကို တစ်မျိုးစီကိုပါ ခွင့်ပြုဖို့ ချဲ့ထွင်ပေးပါတယ် (ဒါပေမယ့် — ambiguity ရှိနေရင်တော့ standard ရဲ့ အဓိပ္ပာယ် ကောက်ယူမှုကိုပဲ သုံးပါတယ်)။ PostgreSQL က clauses နှစ်ခုလုံးကို arbitrary expressions တွေ သတ်မှတ်ခွင့်လည်း ပြုပါတယ်။ Expression တစ်ခုထဲမှာ ပေါ်တဲ့ နာမည်တွေကို output-column နာမည်တွေ မဟုတ်ဘဲ — input-column နာမည်တွေအနေနဲ့ အမြဲတမ်း ယူဆမယ်ဆိုတာ သတိပြုပါ။

SQL:1999 နဲ့ နောက်ပိုင်း ဗားရှင်းတွေက — SQL-92 နဲ့ လုံးဝ upward compatible မဟုတ်တဲ့ — နည်းနည်း ကွဲပြားတဲ့ definition တစ်ခုကို သုံးပါတယ်။ ဒါပေမယ့် — အခြေအနေ အများစုမှာ — PostgreSQL က `ORDER BY` ဒါမှမဟုတ် `GROUP BY` expression တစ်ခုကို SQL:1999 က အဓိပ္ပာယ် ကောက်ယူတဲ့ နည်းအတိုင်းပဲ အဓိပ္ပာယ် ကောက်ယူပါလိမ့်မယ်။

### Functional Dependencies (functional dependency များ)

PostgreSQL က functional dependency (columns တွေကို `GROUP BY` ကနေ ချန်လိုက်ခွင့် ပြုခြင်း) ကို — table တစ်ခုရဲ့ primary key က `GROUP BY` list ထဲမှာ ပါဝင်နေတဲ့အခါမှသာ — အသိအမှတ် ပြုပါတယ်။ SQL standard ကတော့ အသိအမှတ် ပြုသင့်တဲ့ နောက်ထပ် conditions တွေကို သတ်မှတ်ပေးပါတယ်။

### `LIMIT` and `OFFSET` (LIMIT နှင့် OFFSET)

`LIMIT` နဲ့ `OFFSET` clauses တွေက PostgreSQL-specific syntax တွေ ဖြစ်ပြီး — MySQL ကလည်း သုံးပါတယ်။ SQL:2008 standard က အလားတူ လုပ်ဆောင်နိုင်စွမ်းအတွက် — အပေါ်က [LIMIT Clause](/docs/postgresql/sql-select) မှာ ပြထားသလို — `OFFSET ... FETCH {FIRST|NEXT} ...` clauses တွေကို မိတ်ဆက်ပေးထားပါတယ်။ ဒီ syntax ကို IBM DB2 ကလည်း သုံးပါတယ်။ (Oracle အတွက် ရေးထားတဲ့ applications တွေက ဒီ clauses တွေရဲ့ သက်ရောက်မှုတွေကို implement လုပ်ဖို့ — PostgreSQL မှာ မရနိုင်တဲ့ — အလိုအလျောက် generate လုပ်တဲ့ `rownum` column တစ်ခု ပါဝင်တဲ့ workaround တစ်ခုကို မကြာခဏ သုံးကြပါတယ်။)

### `FOR NO KEY UPDATE`, `FOR UPDATE`, `FOR SHARE`, `FOR KEY SHARE` (row-lock clause variants အကြောင်း)

`FOR UPDATE` က SQL standard ထဲမှာ ပေါ်ပေမယ့် — standard က ၎င်းကို `DECLARE CURSOR` ရဲ့ option တစ်ခုအနေနဲ့ပဲ ခွင့်ပြုပါတယ်။ PostgreSQL က ၎င်းကို sub-`SELECT`s တွေမှာရော — `SELECT` query တစ်ခုခုထဲမှာပါ ခွင့်ပြုပေမယ့် — ဒါက extension တစ်ခု ဖြစ်ပါတယ်။ `FOR NO KEY UPDATE`, `FOR SHARE` နဲ့ `FOR KEY SHARE` variants တွေရော — `NOWAIT` နဲ့ `SKIP LOCKED` options တွေရောက standard ထဲမှာ မပါဝင်ပါဘူး။

### Data-Modifying Statements in `WITH` (WITH ထဲက data-modifying statements)

PostgreSQL က `INSERT`, `UPDATE`, `DELETE` နဲ့ `MERGE` တို့ကို `WITH` queries တွေအနေနဲ့ သုံးခွင့် ပြုပါတယ်။ ဒါက SQL standard ထဲမှာ မတွေ့ရပါဘူး။

### Nonstandard Clauses (စံမဟုတ်သော clauses)

`DISTINCT ON ( ... )` က SQL standard ရဲ့ extension တစ်ခု ဖြစ်ပါတယ်။

`ROWS FROM( ... )` က SQL standard ရဲ့ extension တစ်ခု ဖြစ်ပါတယ်။

`WITH` ရဲ့ `MATERIALIZED` နဲ့ `NOT MATERIALIZED` options တွေက SQL standard ရဲ့ extensions တွေ ဖြစ်ပါတယ်။
