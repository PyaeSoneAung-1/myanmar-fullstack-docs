---
title: "DELETE (table ထဲမှ rows များကို ဖယ်ရှားခြင်း)"
description: "WHERE clause နဲ့ ကိုက်ညီတဲ့ rows တွေကို table တစ်ခုကနေ ဖယ်ရှားပေးတဲ့ DELETE command အကြောင်း — syntax နှင့် parameters (USING, RETURNING, WHERE CURRENT OF စသည်)၊ privilege လိုအပ်ချက်များ၊ မှတ်စုများ နှင့် ဥပမာများ"
order: 154
source: "https://www.postgresql.org/docs/current/sql-delete.html"
status: translated
updated: 2026-09-04
---

## DELETE (table ထဲမှ rows များကို ဖယ်ရှားခြင်း)

DELETE — table တစ်ခုရဲ့ rows တွေကို ဖျက်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
[ WITH [ RECURSIVE ] with_query [, ...] ]
DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
    [ USING from_item [, ...] ]
    [ WHERE condition | WHERE CURRENT OF cursor_name ]
    [ RETURNING [ WITH ( { OLD | NEW } AS output_alias [, ...] ) ]
                { * | output_expression [ [ AS ] output_name ] } [, ...] ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DELETE` က သတ်မှတ်ထားတဲ့ table ထဲကနေ — `WHERE` clause နဲ့ ကိုက်ညီတဲ့ rows တွေကို ဖျက်ပေးပါတယ်။ `WHERE` clause မပါဘူးဆိုရင် — table ထဲက rows တွေ အားလုံး ဖျက်ခံရမှာ ဖြစ်ပါတယ်။ ရလဒ်ကတော့ — တရားဝင် (valid) ဖြစ်ပေမယ့် — ဗလာ (empty) ဖြစ်နေတဲ့ table တစ်ခုပါ။

> **အကြံပြုချက်:** [`TRUNCATE`](/docs/postgresql/sql-truncate) က table တစ်ခုထဲက rows တွေ အားလုံးကို ဖယ်ရှားဖို့ ပိုမြန်တဲ့ ယန္တရား တစ်ခုကို ပေးပါတယ်။

Database ထဲက တခြား tables တွေမှာ ပါဝင်တဲ့ အချက်အလက်တွေကို သုံးပြီး — table တစ်ခုထဲက rows တွေကို ဖျက်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်: sub-selects တွေကို သုံးတာ ဒါမှမဟုတ် `USING` clause ထဲမှာ ထပ်ဆောင်း tables တွေကို သတ်မှတ်တာပါ။ ဘယ် technique က ပိုသင့်လျော်လဲဆိုတာ — တိကျတဲ့ အခြေအနေတွေအပေါ် မူတည်ပါတယ်။

Optional ဖြစ်တဲ့ `RETURNING` clause က `DELETE` ကို — တကယ် ဖျက်လိုက်တဲ့ row တစ်ခုချင်းစီကို အခြေခံပြီး — value(s) တွေကို တွက်ချက် ပြန်ပေးစေပါတယ်။ Table ရဲ့ columns တွေ နဲ့/သို့မဟုတ် `USING` ထဲမှာ ဖော်ပြထားတဲ့ တခြား tables တွေရဲ့ columns တွေကို သုံးတဲ့ expression မှန်သမျှကို တွက်ချက်လို့ ရပါတယ်။ `RETURNING` list ရဲ့ syntax က `SELECT` ရဲ့ output list ရဲ့ syntax နဲ့ တူညီပါတယ်။

ဖျက်မယ့် table ပေါ်မှာ `DELETE` privilege ရှိရမှာ ဖြစ်သလို — `USING` clause ထဲမှာ ပါဝင်တဲ့ ဒါမှမဟုတ် `condition` ထဲမှာ တန်ဖိုးတွေကို ဖတ်ရတဲ့ table တိုင်းပေါ်မှာလည်း `SELECT` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **with_query** — `WITH` clause က — `DELETE` query ထဲမှာ နာမည်နဲ့ ရည်ညွှန်းလို့ရတဲ့ subquery တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတာတွေကို သတ်မှတ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 7.8 နဲ့ SELECT ကို ကြည့်ပါ။
- **table_name** — Rows တွေ ဖျက်ရမယ့် table ရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လုပ်ထားနိုင်ပါတယ်)။ `ONLY` ကို table နာမည် ရှေ့မှာ သတ်မှတ်ထားရင် — ကိုက်ညီတဲ့ rows တွေကို နာမည်ပေးထားတဲ့ table ထဲမှာပဲ ဖျက်ပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — ကိုက်ညီတဲ့ rows တွေကို သတ်မှတ်ထားတဲ့ table ကနေ inherit လုပ်ထားတဲ့ table တွေထဲကပါ ဖျက်ပါတယ်။ Optional အနေနဲ့ — table နာမည် နောက်မှာ `*` ကို သတ်မှတ်ပြီး — descendant (ဆင်းသက်လာသော) tables တွေလည်း ပါဝင်တယ်ဆိုတာကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်ပါတယ်။
- **alias** — Target table အတွက် အစားထိုး နာမည် တစ်ခု ဖြစ်ပါတယ်။ Alias ကို ပေးထားတဲ့အခါ — table ရဲ့ တကယ့် နာမည်ကို လုံးဝ ဖုံးကွယ်လိုက်ပါတယ်။ ဥပမာ — `DELETE FROM foo AS f` ဆိုရင် — ကျန် `DELETE` statement ရဲ့ အပိုင်းတွေမှာ ဒီ table ကို foo အနေနဲ့ မဟုတ်ဘဲ f အနေနဲ့ပဲ ရည်ညွှန်းရပါမယ်။
- **from_item** — တခြား tables တွေရဲ့ columns တွေကို `WHERE` condition ထဲမှာ ပါဝင်ခွင့် ပြုတဲ့ table expression တစ်ခု ဖြစ်ပါတယ်။ ဒါက `SELECT` statement တစ်ခုရဲ့ `FROM` clause နဲ့ syntax အတူတူပဲ ဖြစ်ပါတယ်; ဥပမာ — table နာမည်အတွက် alias တစ်ခု သတ်မှတ်နိုင်ပါတယ်။ Self-join (table ကိုယ်တိုင် ချိတ်ဆက်ခြင်း) တစ်ခု ပြုလုပ်ချင်တာ မဟုတ်ရင် — target table ကို from_item အဖြစ် ထပ်ခါထပ်ခါ မရေးပါနဲ့ (အဲဒီကိစ္စမှာတော့ from_item ထဲမှာ alias တစ်ခုနဲ့ ပါဝင်ရပါမယ်)။
- **condition** — `boolean` အမျိုးအစား တန်ဖိုး တစ်ခု ပြန်ပေးတဲ့ expression တစ်ခု ဖြစ်ပါတယ်။ ဒီ expression က true ပြန်ပေးတဲ့ rows တွေကိုပဲ ဖျက်မှာ ဖြစ်ပါတယ်။
- **cursor_name** — `WHERE CURRENT OF` condition တစ်ခုထဲမှာ သုံးဖို့ cursor ရဲ့ နာမည် ဖြစ်ပါတယ်။ ဖျက်ရမယ့် row က — ဒီ cursor ကနေ နောက်ဆုံး ဆွဲယူခဲ့တဲ့ (fetched) row ဖြစ်ပါတယ်။ Cursor က `DELETE` ရဲ့ target table ပေါ်က non-grouping query တစ်ခု ဖြစ်ရပါမယ်။ `WHERE CURRENT OF` ကို Boolean condition တစ်ခုနဲ့အတူ တွဲသတ်မှတ်လို့ မရဘူးဆိုတာ သတိပြုပါ။ Cursors တွေကို `WHERE CURRENT OF` နဲ့ သုံးတာအကြောင်း နောက်ထပ် အချက်အလက်အတွက် DECLARE ကို ကြည့်ပါ။
- **output_alias** — `RETURNING` list ထဲမှာ OLD ဒါမှမဟုတ် NEW rows တွေအတွက် optional အစားထိုး နာမည် တစ်ခု ဖြစ်ပါတယ်။
Default အနေနဲ့ — `OLD.column_name` ဒါမှမဟုတ် `OLD.*` လို့ ရေးခြင်းဖြင့် target table ကနေ အဟောင်း တန်ဖိုးတွေကို ပြန်ယူနိုင်ပြီး — `NEW.column_name` ဒါမှမဟုတ် `NEW.*` လို့ ရေးခြင်းဖြင့် အသစ် တန်ဖိုးတွေကို ပြန်ယူနိုင်ပါတယ်။ Alias ပေးထားတဲ့အခါ — ဒီ နာမည်တွေ ဖုံးကွယ်ခံရပြီး — အဟောင်း ဒါမှမဟုတ် အသစ် rows တွေကို alias သုံးပြီးသာ ရည်ညွှန်းရပါတယ်။ ဥပမာ — `RETURNING WITH (OLD AS o, NEW AS n) o.*, n.*`
- **output_expression** — `DELETE` command က row တစ်ခုချင်းစီ ဖျက်ပြီးတိုင်း — တွက်ချက်ပြီး ပြန်ပေးဖို့ expression တစ်ခု ဖြစ်ပါတယ်။ Expression က table_name နဲ့ သတ်မှတ်ထားတဲ့ table ရဲ့ column နာမည် မှန်သမျှ ဒါမှမဟုတ် `USING` ထဲမှာ စာရင်းပြုထားတဲ့ table(s) တွေရဲ့ column နာမည်တွေကို သုံးနိုင်ပါတယ်။ Columns တွေ အားလုံး ပြန်ပေးဖို့ `*` လို့ ရေးပါ။
Column နာမည် တစ်ခု ဒါမှမဟုတ် `*` ကို — အဟောင်း ဒါမှမဟုတ် အသစ် တန်ဖိုးတွေ ပြန်ပေးဖို့ — OLD ဒါမှမဟုတ် NEW၊ ဒါမှမဟုတ် OLD ဒါမှမဟုတ် NEW အတွက် သက်ဆိုင်တဲ့ output_alias နဲ့ qualify လုပ်နိုင်ပါတယ်။ Qualify မလုပ်ထားတဲ့ column နာမည် တစ်ခု၊ `*` ဒါမှမဟုတ် target table ရဲ့ နာမည် ဒါမှမဟုတ် alias နဲ့ qualify လုပ်ထားတဲ့ column နာမည် ဒါမှမဟုတ် `*` က အဟောင်း တန်ဖိုးတွေကို ပြန်ပေးပါလိမ့်မယ်။
ရိုးရိုး `DELETE` တစ်ခုအတွက်ဆိုရင် — အသစ် တန်ဖိုးတွေ အားလုံးက NULL ဖြစ်ပါလိမ့်မယ်။ ဒါပေမယ့် — `ON DELETE` rule တစ်ခုက အဲဒီအစား `INSERT` ဒါမှမဟုတ် `UPDATE` တစ်ခုကို execute ဖြစ်စေရင်တော့ — အသစ် တန်ဖိုးတွေက NULL မဟုတ်တာ ဖြစ်နိုင်ပါတယ်။
- **output_name** — ပြန်ပေးတဲ့ column တစ်ခုအတွက် သုံးမယ့် နာမည် တစ်ခု ဖြစ်ပါတယ်။

## Outputs (ရလဒ်များ)

အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ — `DELETE` command က အောက်ပါ ပုံစံ ရှိတဲ့ command tag တစ်ခုကို ပြန်ပေးပါတယ်

```sql
DELETE count
```

`count` က ဖျက်လိုက်တဲ့ rows အရေအတွက် ဖြစ်ပါတယ်။ `BEFORE DELETE` trigger တစ်ခုက deletes တွေကို ဖိနှိပ် (suppress) လိုက်တဲ့အခါ — အရေအတွက်က `condition` နဲ့ ကိုက်ညီတဲ့ rows အရေအတွက်ထက် နည်းနိုင်တယ်ဆိုတာ သတိပြုပါ။ `count` က 0 ဆိုရင် — query က rows ဘာမှ မဖျက်ခဲ့ဘူးလို့ ဆိုလိုပါတယ် (ဒါက error တစ်ခုအဖြစ် မယူဆပါဘူး)။

`DELETE` command ထဲမှာ `RETURNING` clause ပါရင် — ရလဒ်က — command က ဖျက်လိုက်တဲ့ row(s) တွေပေါ်မှာ တွက်ချက်ထားပြီး — `RETURNING` list ထဲမှာ သတ်မှတ်ထားတဲ့ columns တွေနဲ့ တန်ဖိုးတွေ ပါဝင်တဲ့ — `SELECT` statement တစ်ခုရဲ့ ရလဒ်နဲ့ ဆင်တူပါလိမ့်မယ်။

## Notes (မှတ်စုများ)

PostgreSQL က — `USING` clause ထဲမှာ တခြား tables တွေကို သတ်မှတ်ခြင်းဖြင့် — `WHERE` condition ထဲမှာ အဲဒီ tables တွေရဲ့ columns တွေကို ရည်ညွှန်းခွင့် ပြုပါတယ်။ ဥပမာ — producer တစ်ယောက် ထုတ်လုပ်ထားတဲ့ films တွေ အားလုံးကို ဖျက်ချင်ရင် ဒီလို လုပ်နိုင်ပါတယ်:

```sql
DELETE FROM films USING producers
  WHERE producer_id = producers.id AND producers.name = 'foo';
```

ဒီမှာ အခြေခံအားဖြင့် ဖြစ်ပျက်နေတာက — `films` နဲ့ `producers` ကြား join တစ်ခု ဖြစ်ပြီး — အောင်မြင်စွာ join ဖြစ်တဲ့ `films` rows တွေ အားလုံးကို ဖျက်ဖို့ မှတ်သားလိုက်တာ ဖြစ်ပါတယ်။ ဒီ syntax က standard မဟုတ်ပါဘူး။ ပိုပြီး standard ဖြစ်တဲ့ နည်းလမ်းကတော့:

```sql
DELETE FROM films
  WHERE producer_id IN (SELECT id FROM producers WHERE name = 'foo');
```

အချို့ ကိစ္စတွေမှာ join ပုံစံက sub-select ပုံစံထက် ရေးရ ပိုလွယ်ပြီး — execute ဖို့ ပိုမြန်ပါတယ်။

## Examples (ဥပမာများ)

Musicals တွေကလွဲပြီး films တွေ အားလုံးကို ဖျက်ရန်:

```sql
DELETE FROM films WHERE kind <> 'Musical';
```

`films` table ကို ရှင်းလင်းရန်:

```sql
DELETE FROM films;
```

ပြီးစီးသွားတဲ့ tasks တွေကို ဖျက်ပြီး — ဖျက်လိုက်တဲ့ rows တွေရဲ့ အသေးစိတ် အချက်အလက်တွေ အပြည့်အစုံ ပြန်ပေးရန်:

```sql
DELETE FROM tasks WHERE status = 'DONE' RETURNING *;
```

Cursor `c_tasks` က လက်ရှိ ရောက်နေတဲ့ `tasks` ရဲ့ row ကို ဖျက်ရန်:

```sql
DELETE FROM tasks WHERE CURRENT OF c_tasks;
```

`DELETE` အတွက် `LIMIT` clause ဆိုတာ မရှိပေမယ့် — [`UPDATE` ၏ documentation](/docs/postgresql/sql-update) မှာ ဖော်ပြထားတဲ့ နည်းလမ်းကိုပဲ သုံးပြီး — အလားတူ ရလဒ်မျိုး ရရှိနိုင်ပါတယ်:

```sql
WITH delete_batch AS (
  SELECT l.ctid FROM user_logs AS l
    WHERE l.status = 'archived'
    ORDER BY l.creation_date
    FOR UPDATE
    LIMIT 10000
)
DELETE FROM user_logs AS dl
  USING delete_batch AS del
  WHERE dl.ctid = del.ctid;
```

`ctid` ကို ဒီလို သုံးတာက — query ကို ထပ်ခါထပ်ခါ run တာကြောင့်သာ ဘေးကင်းပြီး — ပြောင်းလဲသွားတဲ့ `ctid` တွေရဲ့ ပြဿနာကို ရှောင်ရှားနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — ဒါပေမယ့် — `USING` နဲ့ `RETURNING` clauses တွေက PostgreSQL extensions တွေ ဖြစ်သလို — `DELETE` နဲ့အတူ `WITH` ကို သုံးနိုင်တာကလည်း PostgreSQL extension တစ်ခုပဲ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[TRUNCATE](/docs/postgresql/sql-truncate)
