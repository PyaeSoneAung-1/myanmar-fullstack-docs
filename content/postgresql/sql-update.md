---
title: "UPDATE (table ထဲရှိ rows များ၏ တန်ဖိုးများကို ပြောင်းလဲခြင်း)"
description: "Table ထဲရှိ rows များ၏ တန်ဖိုးများကို ပြောင်းလဲပေးတဲ့ command — SET, FROM, WHERE, WHERE CURRENT OF နှင့် RETURNING clause များအသေးစိတ်၊ partitioned table များတွင် row ရွှေ့ပြောင်းခြင်း"
order: 153
source: "https://www.postgresql.org/docs/current/sql-update.html"
status: translated
updated: 2026-09-04
---

## UPDATE (table ထဲရှိ rows များ၏ တန်ဖိုးများကို ပြောင်းလဲခြင်း)

UPDATE — table တစ်ခုရဲ့ rows များကို update လုပ်ပေးတဲ့ command ဖြစ်ပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
[ WITH [ RECURSIVE ] with_query [, ...] ]
UPDATE [ ONLY ] table_name [ * ] [ [ AS ] alias ]
    SET { column_name = { expression | DEFAULT } |
          ( column_name [, ...] ) = [ ROW ] ( { expression | DEFAULT } [, ...] ) |
          ( column_name [, ...] ) = ( sub-SELECT )
        } [, ...]
    [ FROM from_item [, ...] ]
    [ WHERE condition | WHERE CURRENT OF cursor_name ]
    [ RETURNING [ WITH ( { OLD | NEW } AS output_alias [, ...] ) ]
                { * | output_expression [ [ AS ] output_name ] } [, ...] ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`UPDATE` က — အခြေအနေ (condition) ကို ကျေနပ်စေတဲ့ rows တွေ အားလုံးထဲမှာ — သတ်မှတ်ထားတဲ့ columns တွေရဲ့ တန်ဖိုးတွေကို ပြောင်းလဲပေးပါတယ်။ `SET` clause ထဲမှာ — ပြုပြင်မွမ်းမံမယ့် columns တွေကိုပဲ ဖော်ပြဖို့ လိုပါတယ်; explicit ပြောင်းလဲမထားတဲ့ columns တွေက — သူတို့ရဲ့ အရင် တန်ဖိုးတွေကို ဆက်ထိန်းထားပါတယ်။

Database ထဲက တခြား tables တွေမှာ ပါဝင်တဲ့ အချက်အလက်တွေကို သုံးပြီး table တစ်ခုကို ပြုပြင်မွမ်းမံဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်: sub-selects တွေ သုံးတာ၊ ဒါမှမဟုတ် `FROM` clause ထဲမှာ tables အပိုတွေ သတ်မှတ်တာပါ။ ဘယ် technique က ပိုသင့်လျော်လဲဆိုတာ — တိကျတဲ့ အခြေအနေတွေပေါ်မှာ မူတည်ပါတယ်။

Optional ဖြစ်တဲ့ `RETURNING` clause က — `UPDATE` ကို — တကယ် update လုပ်လိုက်တဲ့ row တစ်ခုစီကို အခြေခံပြီး တန်ဖိုး(များ) တွက်ချက် ပြန်ပေးစေပါတယ်။ Table ရဲ့ columns တွေရော — `FROM` ထဲမှာ ဖော်ပြထားတဲ့ တခြား tables တွေရဲ့ columns တွေပါ — သုံးထားတဲ့ ဘယ် expression ကိုမဆို တွက်ချက်နိုင်ပါတယ်။ Default အနေနဲ့ — table ရဲ့ columns တွေရဲ့ အသစ် (update ပြီးနောက်) တန်ဖိုးတွေကို သုံးပေမယ့် — ရှေး (update မလုပ်မီ) တန်ဖိုးတွေကိုလည်း တောင်းဆိုလို့ ရပါတယ်။ `RETURNING` စာရင်းရဲ့ syntax က `SELECT` ရဲ့ output list နဲ့ အတူတူပါပဲ။

Table ပေါ်မှာ — ဒါမှမဟုတ် အနည်းဆုံး — update လုပ်ဖို့ စာရင်းထည့်ထားတဲ့ column(များ) ပေါ်မှာ `UPDATE` privilege ရှိရပါမယ်။ `expressions` ဒါမှမဟုတ် `condition` ထဲမှာ တန်ဖိုးတွေ ဖတ်ရှုခံရတဲ့ column တိုင်းပေါ်မှာလည်း `SELECT` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **with_query** — `WITH` clause က — `UPDATE` query ထဲမှာ နာမည်နဲ့ ရည်ညွှန်းလို့ရတဲ့ subquery တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို သတ်မှတ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 7.8 နဲ့ SELECT ကို ကြည့်ပါ။

- **table_name** — Update လုပ်ရမယ့် table ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။ Table နာမည် ရှေ့မှာ `ONLY` ကို သတ်မှတ်ထားရင် — နာမည်ပေးထားတဲ့ table ထဲမှာပဲ — ကိုက်ညီတဲ့ rows တွေကို update လုပ်ပါတယ်။ `ONLY` သတ်မှတ်မထားရင် — နာမည်ပေးထားတဲ့ table ကနေ ဆင်းသက် (inherit) လာတဲ့ tables တစ်ခုခုထဲမှာပါ — ကိုက်ညီတဲ့ rows တွေကို update လုပ်ပါတယ်။ Optional အနေနဲ့ — descendant tables တွေ ပါဝင်တယ်ဆိုတာ ရှင်းရှင်းလင်းလင်း ဖော်ပြဖို့ — table နာမည် နောက်မှာ `*` ကို သတ်မှတ်နိုင်ပါတယ်။

- **alias** — Target table အတွက် အစားထိုး နာမည်တစ်ခု။ Alias ပေးထားရင် — table ရဲ့ တကယ့် နာမည်ကို လုံးဝ ဖုံးကွယ်လိုက်ပါတယ်။ ဥပမာ — `UPDATE foo AS f` ဆိုရင် — ကျန် `UPDATE` statement တစ်လျှောက်လုံးမှာ — ဒီ table ကို foo အနေနဲ့ မဟုတ်ဘဲ — f အနေနဲ့သာ ရည်ညွှန်းရပါမယ်။

- **column_name** — `table_name` နဲ့ နာမည်ပေးထားတဲ့ table ထဲက column တစ်ခုရဲ့ နာမည်။ လိုအပ်ရင် — column နာမည်ကို subfield နာမည် ဒါမှမဟုတ် array subscript နဲ့ qualified လုပ်နိုင်ပါတယ်။ Target column ရဲ့ သတ်မှတ်ချက်ထဲမှာ table ရဲ့ နာမည် မထည့်ပါနဲ့ — ဥပမာ — `UPDATE table_name SET table_name.col = 1` ဆိုတာ invalid ပါ။

- **expression** — Column ကို သတ်မှတ်ပေးဖို့ expression တစ်ခု။ Expression က — table ထဲက ဒီ column ရော တခြား columns တွေရဲ့ ရှေးတန်ဖိုးတွေကိုပါ သုံးနိုင်ပါတယ်။

- **DEFAULT** — Column ကို သူ့ရဲ့ default တန်ဖိုးနဲ့ သတ်မှတ်ပါ (သူ့အတွက် တိကျတဲ့ default expression သတ်မှတ်မထားရင် NULL ဖြစ်ပါလိမ့်မယ်)။ Identity column တစ်ခုဆိုရင် — ဆက်စပ်နေတဲ့ sequence ကနေ ထုတ်ပေးလိုက်တဲ့ တန်ဖိုးအသစ်တစ်ခုနဲ့ သတ်မှတ်ပါလိမ့်မယ်။ Generated column တစ်ခုအတွက် — ဒါကို သတ်မှတ်ပေးတာ ခွင့်ပြုပေမယ့် — column ကို သူ့ရဲ့ generation expression ကနေ တွက်ချက်တဲ့ သာမန် အပြုအမူကိုပဲ သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်။

- **sub-SELECT** — ၎င်းရှေ့မှာ parenthesized လုပ်ထားတဲ့ column စာရင်းထဲမှာ စာရင်းပြထားသလောက် — output columns အများအပြား ထုတ်ပေးတဲ့ SELECT sub-query တစ်ခု။ Sub-query က execute လုပ်တဲ့အခါ — row တစ်ခုထက် ပိုထုတ်လို့ မရပါဘူး။ Row တစ်ခု ထုတ်ပေးရင် — သူ့ရဲ့ column တန်ဖိုးတွေကို target columns တွေကို သတ်မှတ်ပေးပါတယ်; row ဘာမှ မထုတ်ပေးရင် — NULL တန်ဖိုးတွေကို target columns တွေကို သတ်မှတ်ပေးပါတယ်။ Sub-query က — update လုပ်ခံနေရတဲ့ table ရဲ့ လက်ရှိ row ရဲ့ ရှေးတန်ဖိုးတွေကို ရည်ညွှန်းနိုင်ပါတယ်။

- **from_item** — တခြား tables တွေရဲ့ columns တွေကို — `WHERE` condition နဲ့ update expressions တွေထဲမှာ ပေါ်ခွင့် ပြုပေးတဲ့ table expression တစ်ခု။ ဒါက — SELECT statement တစ်ခုရဲ့ FROM clause နဲ့ syntax အတူတူကို သုံးပါတယ်; ဥပမာ — table နာမည်အတွက် alias တစ်ခု သတ်မှတ်နိုင်ပါတယ်။ Self-join (ကိုယ့် table ကိုယ် join) လုပ်ဖို့ ရည်ရွယ်တာ မဟုတ်ရင် — target table ကို from_item အဖြစ် ထပ်မထည့်ပါနဲ့ (self-join လုပ်ရင် — from_item ထဲမှာ alias တစ်ခုနဲ့ ပေါ်ရပါမယ်)။

- **condition** — Boolean type တန်ဖိုးတစ်ခု ပြန်ပေးတဲ့ expression တစ်ခု။ ဒီ expression က true ပြန်ပေးတဲ့ rows တွေကိုပဲ update လုပ်ပါလိမ့်မယ်။

- **cursor_name** — `WHERE CURRENT OF` condition တစ်ခုထဲမှာ သုံးရမယ့် cursor ရဲ့ နာမည်။ Update လုပ်ရမယ့် row က — ဒီ cursor ကနေ နောက်ဆုံး fetch လုပ်ထားတဲ့ row ဖြစ်ပါတယ်။ Cursor က — `UPDATE` ရဲ့ target table ပေါ်မှာ — grouping မလုပ်တဲ့ query တစ်ခု ဖြစ်ရပါမယ်။ `WHERE CURRENT OF` ကို Boolean condition တစ်ခုနဲ့အတူ သတ်မှတ်လို့ မရဘူးဆိုတာ သတိပြုပါ။ `WHERE CURRENT OF` နဲ့ cursors တွေ သုံးတာအကြောင်း နောက်ထပ် အချက်အလက်အတွက် DECLARE ကို ကြည့်ပါ။

- **output_alias** — `RETURNING` စာရင်းထဲမှာ OLD ဒါမှမဟုတ် NEW rows တွေအတွက် optional အစားထိုး နာမည်တစ်ခု။
Default အနေနဲ့ — target table ကနေ ရှေးတန်ဖိုးတွေကို OLD.column_name ဒါမှမဟုတ် OLD.* လို့ ရေးပြီး ပြန်ယူလို့ ရပြီး — တန်ဖိုးအသစ်တွေကို NEW.column_name ဒါမှမဟုတ် NEW.* လို့ ရေးပြီး ပြန်ယူလို့ ရပါတယ်။ Alias ပေးထားရင် — ဒီနာမည်တွေက ဖုံးကွယ်ခံရပြီး — ရှေး ဒါမှမဟုတ် အသစ် rows တွေကို alias ကို သုံးပြီးသာ ရည်ညွှန်းရပါမယ်။ ဥပမာ — RETURNING WITH (OLD AS o, NEW AS n) o.*, n.* လို့ ရေးရပါတယ်။

- **output_expression** — Row တစ်ခုစီ update လုပ်ပြီးနောက် — `UPDATE` command က တွက်ချက် ပြန်ပေးမယ့် expression တစ်ခု။ Expression က — `table_name` နဲ့ နာမည်ပေးထားတဲ့ table ဒါမှမဟုတ် `FROM` ထဲမှာ စာရင်းပြထားတဲ့ table(များ) ရဲ့ column နာမည် တစ်ခုခုကို သုံးနိုင်ပါတယ်။ Column တွေ အားလုံးကို ပြန်ပေးဖို့ `*` လို့ ရေးပါ။
Column နာမည် ဒါမှမဟုတ် `*` ကို — OLD ဒါမှမဟုတ် NEW၊ ဒါမှမဟုတ် OLD နဲ့ NEW အတွက် သက်ဆိုင်ရာ output_alias နဲ့ qualified လုပ်ပြီး — ရှေး ဒါမှမဟုတ် အသစ် တန်ဖိုးတွေ ပြန်ပေးဖို့ လုပ်နိုင်ပါတယ်။ Qualified မလုပ်ထားတဲ့ column နာမည် ဒါမှမဟုတ် `*`၊ ဒါမှမဟုတ် — target table ရဲ့ နာမည် ဒါမှမဟုတ် alias နဲ့ qualified လုပ်ထားတဲ့ column နာမည် ဒါမှမဟုတ် `*` ကတော့ — တန်ဖိုးအသစ်တွေကို ပြန်ပေးပါလိမ့်မယ်။

- **output_name** — ပြန်ပေးလိုက်တဲ့ column တစ်ခုအတွက် သုံးမယ့် နာမည်တစ်ခု။

## Outputs (ရလဒ်များ)

အောင်မြင်စွာ ပြီးဆုံးချိန်မှာ — `UPDATE` command တစ်ခုက အောက်ပါပုံစံ command tag တစ်ခုကို ပြန်ပေးပါတယ်:

```sql
UPDATE count
```

`count` ဆိုတာ — update လုပ်လိုက်တဲ့ rows အရေအတွက် ဖြစ်ပြီး — တန်ဖိုးတွေ မပြောင်းလဲခဲ့တဲ့ ကိုက်ညီတဲ့ rows တွေလည်း ပါဝင်ပါတယ်။ `BEFORE UPDATE` trigger တစ်ခုက updates တွေကို ဖိနှိပ် (suppress) လိုက်တဲ့အခါ — ဒီနံပါတ်က — `condition` နဲ့ ကိုက်ညီတဲ့ rows အရေအတွက်ထက် နည်းနေနိုင်တယ်ဆိုတာ သတိပြုပါ။ `count` က 0 ဆိုရင် — query က rows ဘာမှ update မလုပ်ခဲ့ဘူးလို့ ဆိုလိုပါတယ် (ဒါက error အဖြစ် မယူဆပါဘူး)။

`UPDATE` command မှာ `RETURNING` clause ပါဝင်ရင် — ရလဒ်က — `RETURNING` စာရင်းထဲမှာ သတ်မှတ်ထားတဲ့ columns နဲ့ တန်ဖိုးတွေ ပါဝင်ပြီး — command က update လုပ်လိုက်တဲ့ row(များ) အပေါ်မှာ တွက်ချက်ထားတဲ့ — `SELECT` statement တစ်ခုရဲ့ ရလဒ်နဲ့ ဆင်တူပါလိမ့်မယ်။

## Notes (မှတ်စုများ)

`FROM` clause ပါဝင်နေတဲ့အခါ — အခြေခံအားဖြင့် ဖြစ်ပျက်တာက — target table ကို `from_item` စာရင်းထဲမှာ ဖော်ပြထားတဲ့ tables တွေနဲ့ join လုပ်ပြီး — join ရဲ့ output row တစ်ခုစီက — target table အတွက် update လုပ်ဆောင်ချက်တစ်ခုကို ကိုယ်စားပြုပါတယ်။ `FROM` သုံးတဲ့အခါ — join က — ပြုပြင်မွမ်းမံရမယ့် row တစ်ခုစီအတွက် — output row တစ်ခုထက် ပိုထုတ်မပေးဘူးဆိုတာ သေချာအောင် လုပ်သင့်ပါတယ်။ တစ်နည်းပြောရရင် — target row တစ်ခုက — တခြား table(များ) ကနေ row တစ်ခုထက်ပိုနဲ့ join မဖြစ်သင့်ပါဘူး။ ဖြစ်ခဲ့ရင် — join rows တွေထဲက တစ်ခုကိုပဲ target row ကို update လုပ်ဖို့ သုံးမှာ ဖြစ်ပေမယ့် — ဘယ်ဟာကို သုံးမလဲဆိုတာကတော့ — ကြိုတင် ခန့်မှန်းလို့ မလွယ်ပါဘူး။

ဒီ indeterminacy (ခန့်မှန်းမရတဲ့ သဘော) ကြောင့် — တခြား tables တွေကို sub-selects တွေထဲမှာပဲ ရည်ညွှန်းတာက ပိုလုံခြုံပါတယ် — ဒါပေမယ့် — join သုံးတာထက် ဖတ်ရခက်ပြီး မကြာခဏ နှေးကွေးတတ်ပါတယ်။

Partitioned table တစ်ခုရဲ့ ကိစ္စမှာ — row တစ်ခုကို update လုပ်တာက — ၎င်းပါဝင်နေတဲ့ partition ရဲ့ partition constraint ကို နောက်တော့ မကျေနပ်တော့ဘူးဆိုတဲ့ အခြေအနေ ဖြစ်စေနိုင်ပါတယ်။ အဲဒီလို အခြေအနေမှာ — partition tree ထဲမှာ ဒီ row ရဲ့ partition constraint ကို ကျေနပ်စေတဲ့ တခြား partition တစ်ခု ရှိရင် — row ကို အဲဒီ partition ဆီ ရွှေ့ပြောင်းပါတယ်။ အဲဒီလို partition မရှိဘူးဆိုရင် — error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။ နောက်ကွယ်မှာတော့ — row ရွှေ့ပြောင်းမှုက တကယ်တော့ `DELETE` နဲ့ `INSERT` လုပ်ဆောင်ချက်တစ်ခုပါ။

ရွှေ့ပြောင်းခံနေရတဲ့ row အပေါ်မှာ — concurrent `UPDATE` ဒါမှမဟုတ် `DELETE` တစ်ခုက — serialization failure error ရနိုင်ခြေ ရှိပါတယ်။ Session 1 က partition key တစ်ခုပေါ်မှာ `UPDATE` လုပ်နေပြီး — တစ်ချိန်တည်းမှာပဲ — ဒီ row ကို မြင်နိုင်တဲ့ concurrent session 2 က — ဒီ row အပေါ်မှာ `UPDATE` ဒါမှမဟုတ် `DELETE` လုပ်ဆောင်ချက်တစ်ခု လုပ်ဆောင်နေတယ်လို့ ယူဆကြည့်ပါ။ အဲဒီလို အခြေအနေမှာ — session 2 ရဲ့ `UPDATE` ဒါမှမဟုတ် `DELETE` က — row ရွှေ့ပြောင်းမှုကို ထောက်လှမ်းမိပြီး — serialization failure error တစ်ခု (အမြဲတမ်း SQLSTATE code '40001' နဲ့ ပြန်လာတဲ့) ထွက်ပေါ်စေပါလိမ့်မယ်။ ဒါ ဖြစ်လာရင် — applications တွေက transaction ကို ပြန်ကြိုးစား (retry) ချင်စရာ ဖြစ်ပါတယ်။ Table က partitioned မဟုတ်တဲ့ သာမန် အခြေအနေမှာ ဒါမှမဟုတ် row ရွှေ့ပြောင်းမှု မရှိတဲ့ အခြေအနေမှာတော့ — session 2 က — update လုပ်ပြီးသား row အသစ်ကို ဖော်ထုတ်ပြီး — ဒီ row version အသစ်ပေါ်မှာ `UPDATE`/`DELETE` ကို ဆောင်ရွက်နိုင်မှာ ဖြစ်ပါတယ်။

Rows တွေကို local partitions တွေကနေ — foreign-table partition တစ်ခုဆီ (foreign data wrapper က tuple routing ကို ထောက်ပံ့ပေးတယ်ဆိုရင်) ရွှေ့ပြောင်းလို့ ရနိုင်ပေမယ့် — foreign-table partition တစ်ခုကနေ တခြား partition တစ်ခုဆီတော့ ရွှေ့ပြောင်းလို့ မရဘူးဆိုတာ သတိပြုပါ။

Row တစ်ခုကို partition တစ်ခုကနေ တစ်ခုဆီ ရွှေ့ပြောင်းဖို့ ကြိုးစားမှုတစ်ခုက — foreign key တစ်ခုက — `UPDATE` query ထဲမှာ ဖော်ပြထားတဲ့ ancestor မဟုတ်ဘဲ — source partition ရဲ့ ancestor တစ်ခုကို တိုက်ရိုက် ရည်ညွှန်းနေတာကို တွေ့ရှိရရင် — မအောင်မြင်ပါဘူး။

## Examples (ဥပမာများ)

`films` table ရဲ့ `kind` column ထဲမှာ `Drama` ဆိုတဲ့ စကားလုံးကို `Dramatic` အဖြစ် ပြောင်းလဲခြင်း:

```sql
UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
```

`weather` table ရဲ့ row တစ်ခုထဲမှာ — temperature entries တွေကို ချိန်ညှိပြီး — precipitation ကို သူ့ရဲ့ default တန်ဖိုးဆီ ပြန်သတ်မှတ်ခြင်း:

```sql
UPDATE weather SET temp_lo = temp_lo+1, temp_hi = temp_lo+15, prcp = DEFAULT
  WHERE city = 'San Francisco' AND date = '2003-07-03';
```

အလားတူ လုပ်ဆောင်ချက်ကိုပဲ — update လုပ်လိုက်တဲ့ entries တွေရော — ရှေးဟောင်း precipitation တန်ဖိုးပါ ပြန်ပေးခြင်း:

```sql
UPDATE weather SET temp_lo = temp_lo+1, temp_hi = temp_lo+15, prcp = DEFAULT
  WHERE city = 'San Francisco' AND date = '2003-07-03'
  RETURNING temp_lo, temp_hi, prcp, old.prcp AS old_prcp;
```

အလားတူ update ကိုပဲ — တခြားရွေးစရာ column-list syntax ကို သုံးပြီး လုပ်ဆောင်ခြင်း:

```sql
UPDATE weather SET (temp_lo, temp_hi, prcp) = (temp_lo+1, temp_lo+15, DEFAULT)
  WHERE city = 'San Francisco' AND date = '2003-07-03';
```

Acme Corporation ရဲ့ အကောင့်ကို စီမံခန့်ခွဲနေတဲ့ salesperson ရဲ့ sales count ကို — `FROM` clause syntax သုံးပြီး မြှင့်တင်ခြင်း:

```sql
UPDATE employees SET sales_count = sales_count + 1 FROM accounts
  WHERE accounts.name = 'Acme Corporation'
  AND employees.id = accounts.sales_person;
```

အလားတူ လုပ်ဆောင်ချက်ကိုပဲ — `WHERE` clause ထဲမှာ sub-select တစ်ခု သုံးပြီး လုပ်ဆောင်ခြင်း:

```sql
UPDATE employees SET sales_count = sales_count + 1 WHERE id =
  (SELECT sales_person FROM accounts WHERE name = 'Acme Corporation');
```

Accounts table ထဲက contact names တွေကို — လက်ရှိ တာဝန်ပေးထားတဲ့ salespeople တွေနဲ့ ကိုက်ညီအောင် update လုပ်ခြင်း:

```sql
UPDATE accounts SET (contact_first_name, contact_last_name) =
    (SELECT first_name, last_name FROM employees
     WHERE employees.id = accounts.sales_person);
```

Join တစ်ခုနဲ့လည်း — အလားတူ ရလဒ်ကို ရနိုင်ပါတယ်:

```sql
UPDATE accounts SET contact_first_name = first_name,
                    contact_last_name = last_name
  FROM employees WHERE employees.id = accounts.sales_person;
```

ဒါပေမယ့် — `employees`.`id` က unique key မဟုတ်ဘူးဆိုရင် — ဒုတိယ query က မထင်မှတ်တဲ့ ရလဒ်တွေ ပေးနိုင်ပြီး — ပထမ query ကတော့ — `id` matches တွေ အများကြီး ရှိနေရင် error တစ်ခု ထွက်ပေါ်စေတာ အာမခံပါတယ်။ ဒါ့အပြင် — `accounts`.`sales_person` entry တစ်ခုအတွက် match တစ်ခုခု မရှိဘူးဆိုရင် — ပထမ query က သက်ဆိုင်ရာ name fields တွေကို NULL အဖြစ် သတ်မှတ်ပေးမှာ ဖြစ်ပြီး — ဒုတိယ query ကတော့ — အဲဒီ row ကို လုံးဝ update လုပ်မှာ မဟုတ်ပါဘူး။

Summary table တစ်ခုထဲက statistics တွေကို — လက်ရှိ data တွေနဲ့ ကိုက်ညီအောင် update လုပ်ခြင်း:

```sql
UPDATE summary s SET (sum_x, sum_y, avg_x, avg_y) =
    (SELECT sum(x), sum(y), avg(x), avg(y) FROM data d
     WHERE d.group_id = s.group_id);
```

Stock item အသစ်တစ်ခုကို — stock ပမာဏနဲ့အတူ ထည့်သွင်းဖို့ ကြိုးစားခြင်း။ Item က ရှိပြီးသားဆိုရင် — အဲဒီအစား — ရှိပြီးသား item ရဲ့ stock count ကို update လုပ်ခြင်း။ Transaction တစ်ခုလုံး မအောင်မြင်အောင် မလုပ်ဘဲ ဒါကို လုပ်ဆောင်ဖို့ — savepoints တွေကို သုံးပါ:

```sql
BEGIN;
-- other operations
SAVEPOINT sp1;
INSERT INTO wines VALUES('Chateau Lafite 2003', '24');
-- Assume the above fails because of a unique key violation,
-- so now we issue these commands:
ROLLBACK TO sp1;
UPDATE wines SET stock = stock + 24 WHERE winename = 'Chateau Lafite 2003';
-- continue with other operations, and eventually
COMMIT;
```

Cursor `c_films` က လက်ရှိ နေရာချထားတဲ့ row ထဲမှာ — `films` table ရဲ့ `kind` column ကို ပြောင်းလဲခြင်း:

```sql
UPDATE films SET kind = 'Dramatic' WHERE CURRENT OF c_films;
```

Rows အများကြီးကို သက်ရောက်တဲ့ updates တွေက — table bloat၊ replica lag တိုးလာတာ၊ lock contention တိုးလာတာ လိုမျိုး — system performance အပေါ် ဆိုးကျိုး သက်ရောက်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေတွေမှာ — လုပ်ဆောင်ချက်ကို သေးငယ်တဲ့ batches တွေနဲ့ လုပ်ဆောင်တာ အဓိပ္ပါယ် ရှိနိုင်ပြီး — batches တွေကြားမှာ table ပေါ်မှာ `VACUUM` လုပ်ဆောင်ချက်တစ်ခု ထည့်သွင်းနိုင်ပါတယ်။ `UPDATE` အတွက် `LIMIT` clause ဆိုတာ မရှိပေမယ့် — [Common Table Expression](/docs/postgresql/queries-with) တစ်ခုနဲ့ self-join တစ်ခုကို သုံးပြီး — အလားတူ အာနိသင် (effect) ရနိုင်ပါတယ်။ စံ PostgreSQL table access method နဲ့ဆိုရင် — system column [ctid](/docs/postgresql/ddl-system-columns) ပေါ်မှာ self-join လုပ်တာက အလွန် ထိရောက်ပါတယ်:

```sql
WITH exceeded_max_retries AS (
  SELECT w.ctid FROM work_item AS w
    WHERE w.status = 'active' AND w.num_retries > 10
    ORDER BY w.retry_timestamp
    FOR UPDATE
    LIMIT 5000
)
UPDATE work_item SET status = 'failed'
  FROM exceeded_max_retries AS emr
  WHERE work_item.ctid = emr.ctid;
```

ဒီ command ကို — update လုပ်ဖို့ ကျန် rows တွေ မရှိတော့တဲ့အထိ — ထပ်ခါထပ်ခါ run လုပ်ဖို့ လိုပါလိမ့်မယ်။ (`ctid` ကို ဒီလိုသုံးတာက — query ကို ထပ်ခါထပ်ခါ run လုပ်လို့သာ ဘေးကင်းတာပါ — `ctid` တွေ ပြောင်းသွားတဲ့ ပြဿနာကို ရှောင်နိုင်လို့ပါ။) `ORDER BY` clause တစ်ခု သုံးခြင်းက — ဘယ် rows တွေကို အရင် update လုပ်မလဲ ဦးစားပေးဖို့ command ကို ခွင့်ပြုပြီး — တခြား update လုပ်ဆောင်ချက်တွေကလည်း အလားတူ အစဉ်ကို သုံးနေရင် — သူတို့နဲ့ deadlock ဖြစ်တာကိုလည်း တားဆီးနိုင်ပါတယ်။ Lock contention က စိုးရိမ်စရာဆိုရင် — commands အများကြီး တစ်ခုတည်းသော row တစ်ခုကို update မလုပ်မိအောင် — CTE ထဲကို `SKIP LOCKED` ထပ်ထည့်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒါဆိုရင် — ကိုက်ညီတဲ့ rows တွေ လွတ်သွားလို့ မရှိဘူးဆိုတာ သေချာစေဖို့ — `SKIP LOCKED` ဒါမှမဟုတ် `LIMIT` မပါတဲ့ နောက်ဆုံး `UPDATE` တစ်ခု လိုအပ်ပါလိမ့်မယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — ဒါပေမယ့် — `FROM` နဲ့ `RETURNING` clauses တွေက PostgreSQL extensions တွေ ဖြစ်ပြီး — `UPDATE` နဲ့တွဲပြီး `WITH` သုံးနိုင်တာလည်း ပါပါတယ်။

တခြား database systems တချို့မှာ — target table ကို `FROM` ထဲမှာ နောက်တစ်ခါ ထပ်စာရင်းပြရမယ်လို့ ယူဆရတဲ့ `FROM` option တစ်ခု ပေးထားပါတယ်။ PostgreSQL ကတော့ `FROM` ကို အဲဒီလို အဓိပ္ပါယ် မဖွင့်ပါဘူး။ ဒီ extension ကို သုံးထားတဲ့ applications တွေ port (ပြောင်းရွှေ့) လုပ်တဲ့အခါ သတိထားပါ။

Standard အရ — parenthesized လုပ်ထားတဲ့ target column name စာရင်းတစ်ခုရဲ့ sub-list တစ်ခုအတွက် source တန်ဖိုးက — မှန်ကန်တဲ့ column အရေအတွက်ကို ထုတ်ပေးတဲ့ row-valued expression တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ PostgreSQL ကတော့ — source တန်ဖိုးကို [row constructor](/docs/postgresql/sql-expressions) တစ်ခု ဒါမှမဟုတ် sub-`SELECT` တစ်ခုသာ ဖြစ်ခွင့် ပြုပါတယ်။ Column တစ်ခုချင်းစီရဲ့ update လုပ်ထားတဲ့ တန်ဖိုးကို — row-constructor ကိစ္စမှာ `DEFAULT` အဖြစ် သတ်မှတ်နိုင်ပေမယ့် — sub-`SELECT` တစ်ခုရဲ့ အတွင်းမှာတော့ မရပါဘူး။
