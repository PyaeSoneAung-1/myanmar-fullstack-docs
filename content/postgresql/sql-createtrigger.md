---
title: "CREATE TRIGGER (trigger အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Trigger အသစ်တစ်ခုကို ဖန်တီးပေးသော သို့မဟုတ် ရှိပြီးသား trigger တစ်ခုကို အစားထိုးပေးသော command — BEFORE, AFTER နှင့် INSTEAD OF trigger အမျိုးအစားများ၊ constraint triggers များ၊ transition relations (OLD TABLE/NEW TABLE) များ၊ WHEN conditions များနှင့် tables/views/foreign tables များပေါ်တွင် trigger အမျိုးအစား သင့်လျော်မှု အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 227
source: "https://www.postgresql.org/docs/current/sql-createtrigger.html"
status: translated
updated: 2026-09-04
---

## CREATE TRIGGER (trigger အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE TRIGGER — trigger အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] [ CONSTRAINT ] TRIGGER name { BEFORE | AFTER | INSTEAD OF } { event [ OR ... ] }
    ON table_name
    [ FROM referenced_table_name ]
    [ NOT DEFERRABLE | [ DEFERRABLE ] [ INITIALLY IMMEDIATE | INITIALLY DEFERRED ] ]
    [ REFERENCING { { OLD | NEW } TABLE [ AS ] transition_relation_name } [ ... ] ]
    [ FOR [ EACH ] { ROW | STATEMENT } ]
    [ WHEN ( condition ) ]
    EXECUTE { FUNCTION | PROCEDURE } function_name ( arguments )

where event can be one of:

    INSERT
    UPDATE [ OF column_name [, ... ] ]
    DELETE
    TRUNCATE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TRIGGER` က trigger အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ `CREATE OR REPLACE TRIGGER` ကတော့ — trigger အသစ်တစ်ခုကို ဖန်တီးပေးတာ ဒါမှမဟုတ် — ရှိပြီးသား trigger တစ်ခုကို အစားထိုး (replace) ပေးပါတယ်။ Trigger က — သတ်မှတ်ထားတဲ့ table, view သို့မဟုတ် foreign table တစ်ခုနဲ့ ဆက်စပ်နေပြီး — အဲဒီ table ပေါ်မှာ သတ်မှတ်ထားတဲ့ operations တချို့ လုပ်ဆောင်တဲ့အခါ — သတ်မှတ်ထားတဲ့ function ဖြစ်တဲ့ `function_name` ကို execute (လုပ်ဆောင်) ပေးပါတယ်။

ရှိပြီးသား trigger တစ်ခုရဲ့ လက်ရှိ definition (သတ်မှတ်ချက်) ကို အစားထိုးဖို့ဆိုရင် — ရှိပြီးသား trigger ရဲ့ နာမည်နဲ့ ၎င်း၏ parent table ကို သတ်မှတ်ပြီး `CREATE OR REPLACE TRIGGER` ကို သုံးပါ။ ကျန် properties တွေ အားလုံးကို အစားထိုးလိုက်ပါတယ်။

Trigger ကို — row တစ်ခုအပေါ် operation မလုပ်ဆောင်ခင် (constraints တွေ စစ်ဆေးပြီး `INSERT`, `UPDATE` သို့မဟုတ် `DELETE` ကို မကြိုးစားခင်) fire လုပ်ဖို့ ဖြစ်စေ; operation ပြီးဆုံးသွားပြီးတဲ့ နောက်မှာ (constraints တွေ စစ်ဆေးပြီး `INSERT`, `UPDATE` သို့မဟုတ် `DELETE` ပြီးဆုံးသွားတဲ့ နောက်) fire လုပ်ဖို့ ဖြစ်စေ; ဒါမှမဟုတ် — operation အစား (view တစ်ခုပေါ်က inserts, updates သို့မဟုတ် deletes တွေရဲ့ ကိစ္စမှာ) fire လုပ်ဖို့ ဖြစ်စေ — သတ်မှတ်နိုင်ပါတယ်။ Trigger က event မတိုင်ခင် ဒါမှမဟုတ် event အစား fire လုပ်တဲ့အခါ — လက်ရှိ row အတွက် operation ကို ကျော်လိုက်နိုင်သလို — ထည့်သွင်းခံရမယ့် row ကိုလည်း ပြောင်းလဲနိုင်ပါတယ် (`INSERT` နဲ့ `UPDATE` operations တွေအတွက်သာ)။ Trigger က event ပြီးမှ fire လုပ်တဲ့အခါမှာတော့ — တခြား triggers တွေရဲ့ သက်ရောက်မှုတွေ အပါအဝင် — ပြောင်းလဲမှုတွေ အားလုံးက trigger ဆီ “visible” (မြင်နိုင်) ပါတယ်။

`FOR EACH ROW` လို့ အမှတ်အသား လုပ်ထားတဲ့ trigger တစ်ခုကို — operation က ပြုပြင်မွမ်းမံလိုက်တဲ့ row တိုင်းအတွက် — တစ်ကြိမ်စီ ခေါ်ပါတယ်။ ဥပမာ — rows 10 ခုကို သက်ရောက်တဲ့ `DELETE` တစ်ခုက — target relation ပေါ်က `ON DELETE` triggers တွေကို — ဖျက်လိုက်တဲ့ row တစ်ခုစီအတွက် — သီးခြား အကြိမ် 10 ကြိမ် ခေါ်စေပါလိမ့်မယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — `FOR EACH STATEMENT` လို့ အမှတ်အသား လုပ်ထားတဲ့ trigger တစ်ခုကိုတော့ — ပေးထားတဲ့ operation တစ်ခုအတွက် — rows ဘယ်နှစ်ခု ပြုပြင်မွမ်းမံခဲ့လဲ မသက်ဆိုင်ဘဲ — တစ်ကြိမ်တည်းပဲ execute လုပ်ပါတယ် (အထူးသဖြင့် — rows သုညခု ပြုပြင်မွမ်းမံတဲ့ operation တစ်ခုက — သက်ဆိုင်တဲ့ `FOR EACH STATEMENT` triggers တွေ execute ဖြစ်စေဆဲပါ)။

Trigger event ရဲ့ `INSTEAD OF` အနေနဲ့ fire လုပ်ဖို့ သတ်မှတ်ထားတဲ့ triggers တွေက `FOR EACH ROW` လို့ အမှတ်အသား လုပ်ရပြီး — views တွေပေါ်မှာသာ သတ်မှတ်လို့ ရပါတယ်။ View တစ်ခုပေါ်က `BEFORE` နဲ့ `AFTER` triggers တွေကတော့ `FOR EACH STATEMENT` လို့ အမှတ်အသား လုပ်ရပါမယ်။

ထို့ပြင် — triggers တွေကို `TRUNCATE` အတွက် fire လုပ်ဖို့လည်း သတ်မှတ်နိုင်ပေမယ့် — `FOR EACH STATEMENT` အနေနဲ့သာ ဖြစ်ပါတယ်။

အောက်ပါ table က — tables, views နဲ့ foreign tables တွေပေါ်မှာ ဘယ် trigger အမျိုးအစားတွေကို သုံးနိုင်လဲဆိုတာကို အကျဉ်းချုပ် ဖော်ပြပါတယ်:

| When (ဘယ်အချိန်) | Event (ဖြစ်ရပ်) | Row-level (row အဆင့်) | Statement-level (statement အဆင့်) |
| --- | --- | --- | --- |
| `BEFORE` | `INSERT`/`UPDATE`/`DELETE` | Tables နှင့် foreign tables | Tables, views နှင့် foreign tables |
| `BEFORE` | `TRUNCATE` | — | Tables နှင့် foreign tables |
| `AFTER` | `INSERT`/`UPDATE`/`DELETE` | Tables နှင့် foreign tables | Tables, views နှင့် foreign tables |
| `AFTER` | `TRUNCATE` | — | Tables နှင့် foreign tables |
| `INSTEAD OF` | `INSERT`/`UPDATE`/`DELETE` | Views | — |
| `INSTEAD OF` | `TRUNCATE` | — | — |

ဒါ့အပြင် — trigger definition တစ်ခုက Boolean `WHEN` condition တစ်ခုကို သတ်မှတ်နိုင်ပြီး — trigger ကို fire သင့်လားဆိုတာ အဲဒီ condition နဲ့ စမ်းသပ်ပါတယ်။ Row-level triggers တွေထဲမှာ `WHEN` condition က — row ရဲ့ columns တွေရဲ့ ရှေးတန်ဖိုးနဲ့/သို့မဟုတ် အသစ်တန်ဖိုးတွေကို စစ်ဆေးနိုင်ပါတယ်။ Statement-level triggers တွေမှာလည်း `WHEN` conditions တွေ ရှိနိုင်ပေမယ့် — condition က table ထဲက ဘယ် တန်ဖိုးကိုမှ ရည်ညွှန်းလို့ မရတာကြောင့် — ဒီ feature က သူတို့အတွက် အသုံးမဝင်လှပါဘူး။

Event တစ်ခုတည်းအတွက် အမျိုးအစား တူညီတဲ့ triggers အများအပြား သတ်မှတ်ထားရင် — သူတို့ကို နာမည် အက္ခရာစဉ် (alphabetical order) အလိုက် fire လုပ်ပါတယ်။

`CONSTRAINT` option ကို သတ်မှတ်ထားတဲ့အခါ — ဒီ command က *constraint trigger* (constraint ဆိုင်ရာ trigger) တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဒါက — trigger ကို fire လုပ်တဲ့ အချိန်ကို [`SET CONSTRAINTS`](/docs/postgresql/sql-set-constraints) သုံးပြီး ချိန်ညှိနိုင်တာကလွဲလို့ — သာမန် trigger တစ်ခုနဲ့ အတူတူပါပဲ။ Constraint triggers တွေက — သာမန် tables (foreign tables တွေ မဟုတ်တဲ့) တွေပေါ်က `AFTER ROW` triggers တွေ ဖြစ်ရပါမယ်။ သူတို့ကို — trigger event ကို ဖြစ်စေတဲ့ statement ရဲ့ အဆုံးမှာ ဖြစ်စေ — ဒါမှမဟုတ် — ပါဝင်နေတဲ့ transaction ရဲ့ အဆုံးမှာ ဖြစ်စေ fire လုပ်နိုင်ပြီး — နောက်ပိုင်း အခြေအနေမှာတော့ သူတို့ကို *deferred* (ရွှေ့ဆိုင်းထားသည်) လို့ ဆိုပါတယ်။ ဆိုင်းငံ့ထားတဲ့ (pending) deferred-trigger firing တစ်ခုကို — `SET CONSTRAINTS` သုံးပြီး ချက်ချင်း ဖြစ်ပေါ်အောင်လည်း အတင်းအကျပ် လုပ်လို့ ရပါတယ်။ Constraint triggers တွေက — သူတို့ implement (အကောင်အထည်ဖော်) ထားတဲ့ constraints တွေ ချိုးဖောက်ခံရတဲ့အခါ — exception တစ်ခု ထုတ်ပေးဖို့ မျှော်လင့်ထားပါတယ်။

`REFERENCING` option က *transition relations* (အသွင်ကူးပြောင်း relation များ) တွေ စုဆောင်းမှုကို enable လုပ်ပါတယ် — transition relation ဆိုတာ — လက်ရှိ SQL statement က ထည့်သွင်း၊ ဖျက် သို့မဟုတ် ပြုပြင်မွမ်းမံလိုက်တဲ့ rows တွေ အားလုံး ပါဝင်တဲ့ row sets တွေ ဖြစ်ပါတယ်။ ဒီ feature က — trigger ကို — row တစ်ခုချင်းစီ မဟုတ်ဘဲ — statement က ဘာတွေ လုပ်လိုက်လဲဆိုတာရဲ့ ခြုံငုံသော မြင်ကွင်း (global view) တစ်ခုကို မြင်နိုင်စေပါတယ်။ ဒီ option ကို — သာမန် table (foreign table မဟုတ်တဲ့) တစ်ခုပေါ်က `AFTER` trigger တစ်ခုအတွက်သာ ခွင့်ပြုပါတယ်။ Trigger က constraint trigger လည်း မဖြစ်ရပါဘူး။ ထို့ပြင် — trigger က `UPDATE` trigger တစ်ခုဆိုရင် — ဒီ option ကို သုံးတဲ့အခါ `column_name` list တစ်ခု သတ်မှတ်လို့ မရပါဘူး။ `OLD TABLE` ကို တစ်ကြိမ်တည်းသာ သတ်မှတ်လို့ ရပြီး — `UPDATE` ဒါမှမဟုတ် `DELETE` ပေါ်မှာ fire လုပ်နိုင်တဲ့ trigger တစ်ခုအတွက်သာ ဖြစ်ပါတယ်; ၎င်းက — statement က update ဒါမှမဟုတ် delete လုပ်လိုက်တဲ့ rows တွေ အားလုံးရဲ့ *before-images* (မပြောင်းလဲမီ ပုံရိပ်များ) တွေ ပါဝင်တဲ့ transition relation တစ်ခုကို ဖန်တီးပေးပါတယ်။ အလားတူပဲ — `NEW TABLE` ကိုလည်း တစ်ကြိမ်တည်းသာ သတ်မှတ်လို့ ရပြီး — `UPDATE` ဒါမှမဟုတ် `INSERT` ပေါ်မှာ fire လုပ်နိုင်တဲ့ trigger တစ်ခုအတွက်သာ ဖြစ်ပါတယ်; ၎င်းက — statement က update ဒါမှမဟုတ် insert လုပ်လိုက်တဲ့ rows တွေ အားလုံးရဲ့ *after-images* (ပြောင်းလဲပြီး ပုံရိပ်များ) တွေ ပါဝင်တဲ့ transition relation တစ်ခုကို ဖန်တီးပေးပါတယ်။

`SELECT` က rows တွေကို ပြုပြင်မွမ်းမံမှာ မဟုတ်တာမို့ — `SELECT` triggers တွေ ဖန်တီးလို့ မရပါဘူး။ `SELECT` triggers တွေ လိုအပ်ပုံ ရတဲ့ ပြဿနာတွေအတွက် — rules နဲ့ views တွေက အလုပ်ဖြစ်တဲ့ အဖြေတွေ ပေးနိုင်ပါတယ်။

Triggers အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 37](https://www.postgresql.org/docs/current/triggers.html) ကို ရည်ညွှန်းပါ။

## Parameters (parameter များ)

- **name** — Trigger အသစ်အတွက် ပေးရမယ့် နာမည်။ ဒီ နာမည်က — table တစ်ခုတည်းအတွက် တခြား trigger တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။ နာမည်ကို schema-qualified လုပ်လို့ မရပါဘူး — trigger က သူ့ရဲ့ table ရဲ့ schema ကို အမွေဆက်ခံပါတယ်။ Constraint trigger တစ်ခုအတွက်ဆိုရင် — ဒါက — SET CONSTRAINTS သုံးပြီး trigger ရဲ့ အပြုအမူကို ပြုပြင်မွမ်းမံတဲ့အခါ သုံးရမယ့် နာမည်လည်း ဖြစ်ပါတယ်။
- **BEFORE** / **AFTER** / **INSTEAD OF** — Function ကို event မတိုင်ခင်၊ event ပြီးမှ ဒါမှမဟုတ် event အစား ခေါ်မလားဆိုတာ ဆုံးဖြတ်ပါတယ်။ Constraint trigger တစ်ခုကို AFTER အနေနဲ့ပဲ သတ်မှတ်လို့ ရပါတယ်။
- **event** — Trigger ကို fire စေမယ့် event ကို သတ်မှတ်ပေးတဲ့ — INSERT, UPDATE, DELETE သို့မဟုတ် TRUNCATE ထဲက တစ်ခု။ Transition relations တွေ တောင်းဆိုထားတဲ့အခါ ကလွဲလို့ — OR ကို သုံးပြီး events အများအပြားကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

  UPDATE events တွေအတွက်ဆိုရင် — ဒီ syntax ကို သုံးပြီး columns တစ်စုကို သတ်မှတ်နိုင်ပါတယ်:

  UPDATE OF column_name1 [, column_name2 ... ]

  စာရင်းထဲက column အနည်းဆုံး တစ်ခုက — `UPDATE` command ရဲ့ target အဖြစ် ဖော်ပြခံရရင် ဒါမှမဟုတ် — စာရင်းထဲက column တစ်ခုက — `UPDATE` ရဲ့ target ဖြစ်တဲ့ column တစ်ခုအပေါ် မှီခိုနေတဲ့ generated column တစ်ခု ဖြစ်နေရင် — trigger က fire လုပ်မှာ ဖြစ်ပါတယ်။

  `INSTEAD OF UPDATE` events တွေကတော့ columns စာရင်းတစ်ခုကို ခွင့်မပြုပါဘူး။ Transition relations တွေ တောင်းဆိုတဲ့အခါမှာလည်း column စာရင်းတစ်ခုကို သတ်မှတ်လို့ မရပါဘူး။
- **table_name** — Trigger အတွက် ရည်ရွယ်ထားတဲ့ table, view သို့မဟုတ် foreign table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်ပါတယ်)။
- **referenced_table_name** — Constraint က ရည်ညွှန်းတဲ့ တခြား table တစ်ခုရဲ့ (ဖြစ်နိုင်ရင် schema-qualified) နာမည်။ ဒီ option ကို foreign-key constraints တွေအတွက် သုံးပြီး — ယေဘုယျ အသုံးပြုမှုအတွက် အကြံပြုမထားပါဘူး။ ဒါကို constraint triggers တွေအတွက်သာ သတ်မှတ်လို့ ရပါတယ်။
- **DEFERRABLE** / **NOT DEFERRABLE** / **INITIALLY IMMEDIATE** / **INITIALLY DEFERRED** — Trigger ရဲ့ default timing (ပုံသေ အချိန်)။ ဒီ constraint options တွေရဲ့ အသေးစိတ်အတွက် CREATE TABLE documentation ကို ကြည့်ပါ။ ဒါကို constraint triggers တွေအတွက်သာ သတ်မှတ်လို့ ရပါတယ်။
- **REFERENCING** — ဒီ keyword က — trigger event ရဲ့ transition relations တွေဆီ ဝင်ရောက်ခွင့် ပေးတဲ့ relation names တစ်ခု သို့မဟုတ် နှစ်ခုရဲ့ ကြေညာချက်ရဲ့ ရှေ့မှာ ချက်ချင်း လာပါတယ်။
- **OLD TABLE** / **NEW TABLE** — ဒီ clause က — နောက်က relation name က before-image transition relation အတွက်လား after-image transition relation အတွက်လားဆိုတာ ညွှန်ပြပါတယ်။
- **transition_relation_name** — Trigger အတွင်းမှာ ဒီ transition relation ကို ရည်ညွှန်းဖို့ သုံးမယ့် (unqualified) နာမည်။
- **FOR EACH ROW** / **FOR EACH STATEMENT** — ဒါက — trigger function ကို trigger event ကြောင့် သက်ရောက်တဲ့ row တိုင်းအတွက် တစ်ကြိမ်စီ fire လုပ်မလား၊ SQL statement တစ်ခုအတွက် တစ်ကြိမ်တည်းပဲ fire လုပ်မလားဆိုတာ သတ်မှတ်ပါတယ်။ ဘယ်ဟာမှ မသတ်မှတ်ထားဘူးဆိုရင် — FOR EACH STATEMENT က default ဖြစ်ပါတယ်။ Constraint triggers တွေကို FOR EACH ROW အနေနဲ့ပဲ သတ်မှတ်လို့ ရပါတယ်။
- **condition** — Trigger function ကို တကယ် execute လုပ်မလားဆိုတာ ဆုံးဖြတ်ပေးတဲ့ Boolean expression တစ်ခု။ WHEN သတ်မှတ်ထားရင် — condition က true ပြန်ပေးမှသာ function ကို ခေါ်ပါလိမ့်မယ်။ FOR EACH ROW triggers တွေထဲမှာ — WHEN condition က — OLD.column_name သို့မဟုတ် NEW.column_name လို့ အသီးသီး ရေးပြီး — row တန်ဖိုးဟောင်းနဲ့/သို့မဟုတ် အသစ်ရဲ့ columns တွေကို ရည်ညွှန်းနိုင်ပါတယ်။ သေချာတာကတော့ — INSERT triggers တွေက OLD ကို ရည်ညွှန်းလို့ မရသလို — DELETE triggers တွေကလည်း NEW ကို ရည်ညွှန်းလို့ မရပါဘူး။

  INSTEAD OF triggers တွေက WHEN conditions တွေကို ထောက်ပံ့မပေးပါဘူး။

  လောလောဆယ် — WHEN expressions တွေထဲမှာ subqueries တွေ ပါဝင်လို့ မရပါဘူး။

  Constraint triggers တွေအတွက်ဆိုရင် — WHEN condition ရဲ့ အကဲဖြတ်မှုကို ရွှေ့ဆိုင်းမထားဘဲ — row update operation လုပ်ဆောင်ပြီးတာနဲ့ ချက်ချင်း ဖြစ်ပေါ်တယ်ဆိုတာ သတိပြုပါ။ Condition က true လို့ အကဲဖြတ်မပေးနိုင်ရင် — trigger ကို deferred execution အတွက် queue (တန်းစီ) မလုပ်ပါဘူး။
- **function_name** — arguments တွေ မယူဘဲ — trigger type ကို ပြန်ပေးတဲ့ function တစ်ခုအဖြစ် ကြေညာထားတဲ့ — user က ထောက်ပံ့ပေးတဲ့ function တစ်ခု ဖြစ်ပြီး — trigger fire လုပ်တဲ့အခါ execute လုပ်ပါတယ်။

  CREATE TRIGGER ရဲ့ syntax ထဲမှာ — FUNCTION နဲ့ PROCEDURE keywords တွေက ညီမျှပေမယ့် — ရည်ညွှန်းထားတဲ့ function က ဘယ်အခြေအနေမှာမဆို procedure မဟုတ်ဘဲ function တစ်ခု ဖြစ်ရပါမယ်။ ဒီနေရာမှာ PROCEDURE keyword ကို သုံးတာက သမိုင်းကြောင်းအရ ဖြစ်ပြီး — deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) ဖြစ်ပါတယ်။
- **arguments** — Trigger execute လုပ်တဲ့အခါ function ဆီ ထောက်ပံ့ပေးရမယ့် — optional ဖြစ်တဲ့ comma နဲ့ ခွဲထားတဲ့ arguments စာရင်းတစ်ခု။ Arguments တွေက literal string constants (စာသားအတိုင်း ကိန်းသေ string များ) တွေ ဖြစ်ပါတယ်။ ရိုးရှင်းတဲ့ နာမည်တွေနဲ့ ကိန်းဂဏန်း (numeric) constants တွေကိုလည်း ဒီမှာ ရေးလို့ ရပေမယ့် — အားလုံးကို strings တွေအဖြစ် ပြောင်းလဲပါလိမ့်မယ်။ ဒီ arguments တွေကို function အတွင်းမှာ ဘယ်လို ဝင်ရောက် ယူနိုင်လဲဆိုတာ သိဖို့ — trigger function ရဲ့ implementation language ရဲ့ ဖော်ပြချက်ကို စစ်ဆေးပါ; ၎င်းက သာမန် function arguments တွေနဲ့ ကွဲပြားနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုပေါ်မှာ trigger တစ်ခု ဖန်တီးဖို့ ဒါမှမဟုတ် အစားထိုးဖို့ — user က table ပေါ်မှာ `TRIGGER` privilege ရှိရပါမယ်။ ထို့ပြင် — user က trigger function ပေါ်မှာ `EXECUTE` privilege လည်း ရှိရပါမယ်။

Trigger တစ်ခုကို ဖယ်ရှားဖို့ [`DROP TRIGGER`](/docs/postgresql/sql-droptrigger) ကို သုံးပါ။

Partitioned table တစ်ခုပေါ်မှာ row-level trigger တစ်ခု ဖန်တီးတာက — ရှိပြီးသား partitions တွေ တစ်ခုချင်းစီပေါ်မှာပါ — ထပ်တူညီတဲ့ “clone” trigger (trigger ပုံတူပွား) တစ်ခုကို ဖန်တီးစေပြီး — နောက်မှာ ဖန်တီးခံရတဲ့ ဒါမှမဟုတ် attach လုပ်ခံရတဲ့ partitions တွေပေါ်မှာလည်း ထပ်တူညီတဲ့ trigger တစ်ခု ရှိစေပါတယ်။ Child partition တစ်ခုပေါ်မှာ နာမည် ပဋိပက္ခ ဖြစ်နေတဲ့ trigger တစ်ခု ရှိပြီးသား ဆိုရင် — `CREATE OR REPLACE TRIGGER` ကို သုံးထားတာ မဟုတ်ဘူးဆိုရင် — error တစ်ခု ဖြစ်ပေါ်ပြီး — အဲဒီလို သုံးထားရင်တော့ — အဲဒီ trigger ကို clone trigger တစ်ခုနဲ့ အစားထိုးပါတယ်။ Partition တစ်ခုကို သူ့ရဲ့ parent ကနေ detach လုပ်တဲ့အခါ — သူ့ရဲ့ clone triggers တွေကို ဖယ်ရှားပါတယ်။

Column-specific trigger တစ်ခု (`UPDATE OF column_name` syntax နဲ့ သတ်မှတ်ထားတဲ့ဟာ) က — သူ့ရဲ့ columns တွေထဲက တစ်ခုခုကို `UPDATE` command ရဲ့ `SET` list ထဲမှာ targets အဖြစ် စာရင်းသွင်းထားရင် fire လုပ်ပါလိမ့်မယ်။ `BEFORE UPDATE` triggers တွေက row ရဲ့ အကြောင်းအရာတွေကို ပြောင်းလဲလိုက်တာတွေကို ထည့်သွင်း စဉ်းစားမထားတာမို့ — trigger က fire မလုပ်ဘဲနဲ့လည်း column တစ်ခုရဲ့ တန်ဖိုး ပြောင်းလဲဖို့ ဖြစ်နိုင်ပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — `UPDATE ... SET x = x ...` လို command တစ်ခုက — column ရဲ့ တန်ဖိုး မပြောင်းလဲခဲ့ဘူးဆိုရင်တောင် — column `x` ပေါ်က trigger တစ်ခုကို fire စေပါလိမ့်မယ်။

`BEFORE` trigger တစ်ခုထဲမှာ — `WHEN` condition ကို function ကို execute လုပ်မယ့် အချိန်မတိုင်ခင် တစ်ခဏအလိုမှာ အကဲဖြတ်ပါတယ် — ဒါကြောင့် — `WHEN` သုံးတာက trigger function ရဲ့ အစမှာ condition တစ်ခုတည်းကို စမ်းသပ်တာနဲ့ သိသိသာသာ ကွာခြားမှု မရှိပါဘူး။ အထူးသဖြင့် — condition က မြင်ရတဲ့ `NEW` row က — ရှေ့က triggers တွေက ပြုပြင်မွမ်းမံထားနိုင်တဲ့ — လက်ရှိ တန်ဖိုး ဖြစ်တယ်ဆိုတာ သတိပြုပါ။ ထို့ပြင် — `BEFORE` trigger တစ်ခုရဲ့ `WHEN` condition က `NEW` row ရဲ့ system columns တွေ (ဥပမာ — `ctid`) ကို စစ်ဆေးခွင့် မရှိပါဘူး — ဘာလို့လဲဆိုတော့ — အဲဒါတွေကို သတ်မှတ်ပြီး မဖြစ်သေးလို့ပါ။

`AFTER` trigger တစ်ခုထဲမှာ — `WHEN` condition ကို row update ဖြစ်ပွားပြီးတာနဲ့ ချက်ချင်း အကဲဖြတ်ပြီး — statement ရဲ့ အဆုံးမှာ trigger ကို fire ဖို့ event တစ်ခုကို queue (တန်းစီ) လုပ်မလားဆိုတာ ဆုံးဖြတ်ပါတယ်။ ဒါကြောင့် — `AFTER` trigger တစ်ခုရဲ့ `WHEN` condition က true ပြန်မပေးတဲ့အခါ — event တစ်ခုကို queue လုပ်ဖို့ရော — statement ရဲ့ အဆုံးမှာ row ကို ပြန်ယူဖို့ရော မလိုအပ်ပါဘူး။ ဒါက — trigger ကို rows အနည်းငယ်အတွက်ပဲ fire လုပ်ဖို့ လိုအပ်တဲ့ — rows အများအပြားကို ပြုပြင်မွမ်းမံတဲ့ statements တွေမှာ — သိသိသာသာ မြန်ဆန်မှုတွေ ရစေနိုင်ပါတယ်။

ကိစ္စအချို့မှာ — SQL command တစ်ခုတည်းက trigger အမျိုးအစား တစ်ခုထက်ပိုကို fire စေနိုင်ပါတယ်။ ဥပမာ — `ON CONFLICT DO UPDATE` clause ပါတဲ့ `INSERT` တစ်ခုက insert ရော update ရော နှစ်မျိုးလုံး ဖြစ်စေနိုင်တာမို့ — လိုအပ်သလို trigger အမျိုးအစား နှစ်မျိုးလုံးကိုပါ fire စေပါလိမ့်မယ်။ Triggers တွေဆီ ထောက်ပံ့ပေးတဲ့ transition relations တွေက သူတို့ရဲ့ event type နဲ့ပဲ သီးသန့် ဆိုင်ပါတယ်; ဒါကြောင့် — `INSERT` trigger တစ်ခုက ထည့်သွင်းလိုက်တဲ့ rows တွေကိုပဲ မြင်ရမှာ ဖြစ်ပြီး — `UPDATE` trigger တစ်ခုကတော့ update လုပ်လိုက်တဲ့ rows တွေကိုပဲ မြင်ရမှာ ဖြစ်ပါတယ်။

`ON UPDATE CASCADE` ဒါမှမဟုတ် `ON DELETE SET NULL` လို — foreign-key enforcement actions တွေကြောင့် ဖြစ်ပေါ်တဲ့ row updates ဒါမှမဟုတ် deletions တွေကို — သူတို့ကို ဖြစ်စေတဲ့ SQL command ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ သဘောထားပါတယ် (ဒီလို actions တွေက ဘယ်တော့မှ deferred မလုပ်ဘူးဆိုတာ သတိပြုပါ)။ သက်ရောက်ခံရတဲ့ table ပေါ်က သက်ဆိုင်ရာ triggers တွေကို fire လုပ်မှာ ဖြစ်တာကြောင့် — ဒါက — SQL command တစ်ခုက — သူ့ရဲ့ type နဲ့ တိုက်ရိုက် မကိုက်ညီတဲ့ triggers တွေကိုပါ fire စေနိုင်တဲ့ — နောက်ထပ် နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။ ရိုးရှင်းတဲ့ ကိစ္စတွေမှာ — transition relations တွေ တောင်းဆိုထားတဲ့ triggers တွေက — SQL command မူရင်းတစ်ခုတည်းက သူတို့ရဲ့ table ထဲမှာ ဖြစ်စေတဲ့ ပြောင်းလဲမှုတွေ အားလုံးကို transition relation တစ်ခုတည်းအနေနဲ့ မြင်ရပါလိမ့်မယ်။ ဒါပေမယ့် — transition relations တွေ တောင်းဆိုထားတဲ့ `AFTER ROW` trigger တစ်ခု ရှိနေတာက — SQL command တစ်ခုတည်းကြောင့် ဖြစ်ပေါ်တဲ့ foreign-key enforcement actions တွေကို — တစ်ဆင့်ချင်းစီမှာ ကိုယ်ပိုင် transition relation(s) တွေနဲ့ — အဆင့်များစွာ ခွဲလိုက်စေနိုင်တဲ့ ကိစ္စတွေလည်း ရှိပါတယ်။ ဒီလို ကိစ္စတွေမှာ — ရှိနေတဲ့ statement-level triggers တွေကို transition relation set တစ်ခု ဖန်တီးမှု တစ်ကြိမ်ချင်းစီမှာ fire လုပ်ပြီး — triggers တွေက သက်ရောက်ခံရတဲ့ row တစ်ခုချင်းစီကို transition relation တစ်ခုထဲမှာ တစ်ကြိမ်တည်းနဲ့ တစ်ခုတည်းသာ မြင်ရတယ်ဆိုတာ သေချာစေပါတယ်။

View တစ်ခုပေါ်က statement-level triggers တွေကို — view ပေါ်က action ကို row-level `INSTEAD OF` trigger တစ်ခုက ကိုင်တွယ်မှသာ fire လုပ်ပါတယ်။ Action ကို `INSTEAD` rule တစ်ခုက ကိုင်တွယ်မယ်ဆိုရင် — rule က ထုတ်လွှတ်လိုက်တဲ့ statements တွေ ဘယ်လိုပဲ ဖြစ်ပါစေ — view ကို နာမည်ပေးထားတဲ့ မူရင်း statement ရဲ့ နေရာမှာ execute လုပ်ခံရတာမို့ — fire လုပ်ခံရမယ့် triggers တွေက — အစားထိုး statements တွေထဲမှာ နာမည်ပေးထားတဲ့ tables တွေပေါ်က ဟာတွေ ဖြစ်ပါလိမ့်မယ်။ အလားတူပဲ — view က automatically updatable (အလိုအလျောက် update လုပ်လို့ရတဲ့) ဆိုရင် — action ကို — view ရဲ့ base table ပေါ်က action တစ်ခုအဖြစ် statement ကို အလိုအလျောက် ပြန်ရေးသားခြင်းအားဖြင့် ကိုင်တွယ်ပြီး — fire လုပ်ခံရတာတွေက base table ရဲ့ statement-level triggers တွေ ဖြစ်ပါတယ်။

Partitioned table တစ်ခု ဒါမှမဟုတ် inheritance children တွေ ရှိတဲ့ table တစ်ခုကို ပြုပြင်မွမ်းမံတာက — ထင်ထင်ရှားရှား နာမည်ပေးထားတဲ့ table ပေါ်ကို ချိတ်ထားတဲ့ statement-level triggers တွေကို fire စေပေမယ့် — သူ့ရဲ့ partitions ဒါမှမဟုတ် child tables တွေအတွက်တော့ statement-level triggers တွေ fire မလုပ်ပါဘူး။ ဆန့်ကျင်ဘက်အနေနဲ့ — row-level triggers တွေကို — query ထဲမှာ ထင်ထင်ရှားရှား နာမည်မပေးထားရင်တောင် — သက်ရောက်ခံရတဲ့ partitions ဒါမှမဟုတ် child tables တွေထဲက rows တွေပေါ်မှာ fire လုပ်ပါတယ်။ Statement-level trigger တစ်ခုကို `REFERENCING` clause တစ်ခုနဲ့ နာမည်ပေးထားတဲ့ transition relations တွေနဲ့ သတ်မှတ်ထားရင် — rows တွေရဲ့ before နဲ့ after images တွေကို သက်ရောက်ခံရတဲ့ partitions ဒါမှမဟုတ် child tables တွေ အားလုံးကနေ မြင်ရပါတယ်။ Inheritance children တွေရဲ့ ကိစ္စမှာ — row images တွေမှာ — trigger ကို ချိတ်ထားတဲ့ table ထဲမှာ ရှိနေတဲ့ columns တွေပဲ ပါဝင်ပါတယ်။

လောလောဆယ် — transition relations ပါတဲ့ row-level triggers တွေကို partitions ဒါမှမဟုတ် inheritance child tables တွေပေါ်မှာ သတ်မှတ်လို့ မရပါဘူး။ ထို့ပြင် — partitioned tables တွေပေါ်မှာ `INSTEAD OF` triggers တွေ မဖြစ်နိုင်ပါဘူး။

လောလောဆယ် — `OR REPLACE` option ကို constraint triggers တွေအတွက် ထောက်ပံ့မထားပါဘူး။

Trigger ရဲ့ table ပေါ်မှာ updating actions တွေကို လုပ်ဆောင်ပြီးသား ဖြစ်နေတဲ့ transaction တစ်ခုအတွင်းမှာ ရှိပြီးသား trigger တစ်ခုကို အစားထိုးတာကို အကြံပြုမထားပါဘူး။ Trigger firing ဆုံးဖြတ်ချက်တွေ ဒါမှမဟုတ် firing ဆုံးဖြတ်ချက်တွေရဲ့ အစိတ်အပိုင်းတွေကို ပြန်လည် ဆင်ခြင်မှာ မဟုတ်တာမို့ — သက်ရောက်မှုတွေက အံ့အားသင့်စရာ ဖြစ်နိုင်ပါတယ်။

ကိုယ်ပိုင် trigger code တွေ မရေးဘဲ — အသုံးများတဲ့ ပြဿနာတွေကို ဖြေရှင်းဖို့ သုံးနိုင်တဲ့ built-in trigger functions အနည်းငယ် ရှိပါတယ်; [အပိုင်း 9.29](/docs/postgresql/functions-trigger) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`accounts` table ရဲ့ row တစ်ခုကို update လုပ်တော့မယ့် အချိန်တိုင်းမှာ `check_account_update` function ကို execute လုပ်ဖို့:

```sql
CREATE TRIGGER check_update
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION check_account_update();
```

အဲဒီ trigger definition ကို — `balance` column က `UPDATE` command ရဲ့ target အဖြစ် သတ်မှတ်ထားမှသာ function ကို execute လုပ်အောင် — ပြုပြင်ဖို့:

```sql
CREATE OR REPLACE TRIGGER check_update
    BEFORE UPDATE OF balance ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION check_account_update();
```

ဒီ ပုံစံက — `balance` column ရဲ့ တန်ဖိုးက တကယ်ပဲ ပြောင်းလဲသွားမှသာ function ကို execute လုပ်ပါတယ်:

```sql
CREATE TRIGGER check_update
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
    EXECUTE FUNCTION check_account_update();
```

`accounts` ရဲ့ updates တွေကို log (မှတ်တမ်း) တင်ဖို့ function တစ်ခုကို — တစ်ခုခု ပြောင်းလဲမှသာ — ခေါ်ယူဖို့:

```sql
CREATE TRIGGER log_update
    AFTER UPDATE ON accounts
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION log_account_update();
```

View တစ်ခုရဲ့ အောက်ခံ tables တွေထဲကို rows တွေ ထည့်သွင်းဖို့ — row တစ်ခုစီအတွက် `view_insert_row` function ကို execute လုပ်ဖို့:

```sql
CREATE TRIGGER view_insert
    INSTEAD OF INSERT ON my_view
    FOR EACH ROW
    EXECUTE FUNCTION view_insert_row();
```

`transfer` rows တွေက အသားတင် သုည (net of zero) ဖြစ်အောင် offset (ချိန်ညှိ) ဖြစ်ကြောင်း အတည်ပြုဖို့ — statement တစ်ခုစီအတွက် `check_transfer_balances_to_zero` function ကို execute လုပ်ဖို့:

```sql
CREATE TRIGGER transfer_insert
    AFTER INSERT ON transfer
    REFERENCING NEW TABLE AS inserted
    FOR EACH STATEMENT
    EXECUTE FUNCTION check_transfer_balances_to_zero();
```

အပြောင်းအလဲတွေကို ကိုက်ညီတဲ့ အတွဲတွေဆီ — တစ်ပြိုင်နက်တည်း (statement တစ်ခုတည်းနဲ့) — ပြုလုပ်ကြောင်း အတည်ပြုဖို့ — row တစ်ခုစီအတွက် `check_matching_pairs` function ကို execute လုပ်ဖို့:

```sql
CREATE TRIGGER paired_items_update
    AFTER UPDATE ON paired_items
    REFERENCING NEW TABLE AS newtab OLD TABLE AS oldtab
    FOR EACH ROW
    EXECUTE FUNCTION check_matching_pairs();
```

C နဲ့ ရေးထားတဲ့ trigger function တစ်ခုရဲ့ အပြည့်အစုံ ဥပမာတစ်ခုကို [အပိုင်း 37.4](https://www.postgresql.org/docs/current/trigger-example.html) မှာ ကြည့်ရှုနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

PostgreSQL ရဲ့ `CREATE TRIGGER` statement က SQL standard ရဲ့ subset တစ်ခုကို implement (အကောင်အထည်ဖော်) ပါတယ်။ အောက်ပါ လုပ်ဆောင်ချက်တွေက လောလောဆယ် ချို့တဲ့နေပါတယ်:

- AFTER triggers တွေအတွက် transition table နာမည်တွေကို standard နည်းအတိုင်း REFERENCING clause သုံးပြီး သတ်မှတ်ပေးပေမယ့် — FOR EACH ROW triggers တွေထဲမှာ သုံးတဲ့ row variables တွေကိုတော့ REFERENCING clause တစ်ခုထဲမှာ သတ်မှတ်လို့ မရပါဘူး။ သူတို့ကို — trigger function ကို ရေးထားတဲ့ language ပေါ် မူတည်တဲ့ — ဒါပေမယ့် language တစ်ခုတည်းအတွက် ပုံသေ ဖြစ်နေတဲ့ — နည်းလမ်းတစ်ခုနဲ့ ရနိုင်ပါတယ်။ Language အချို့က — OLD ROW AS OLD NEW ROW AS NEW ပါဝင်တဲ့ REFERENCING clause တစ်ခု ရှိနေသလိုမျိုး — ထိရောက်စွာ ပြုမူပါတယ်။
- Standard က transition tables တွေကို column-specific UPDATE triggers တွေနဲ့ တွဲသုံးခွင့် ပြုပေမယ့် — အဲဒီအခါ transition tables တွေထဲမှာ မြင်ရသင့်တဲ့ rows အစုက trigger ရဲ့ column list ပေါ်မှာ မူတည်ပါတယ်။ ဒါကို PostgreSQL က လောလောဆယ် implement မထားပါဘူး။
- PostgreSQL က triggered action အနေနဲ့ user-defined function တစ်ခုကိုပဲ execute လုပ်ခွင့် ပြုပါတယ်။ Standard ကတော့ triggered action အနေနဲ့ — CREATE TABLE လို — တခြား SQL commands အများအပြား execute လုပ်ခွင့် ပြုပါတယ်။ လိုချင်တဲ့ commands တွေကို execute လုပ်တဲ့ user-defined function တစ်ခု ဖန်တီးခြင်းအားဖြင့် ဒီ ကန့်သတ်ချက်ကို ကျော်လွှားဖို့ မခက်ပါဘူး။

SQL က — triggers အများအပြားကို ဖန်တီးချိန် အစဉ်လိုက် (time-of-creation order) နဲ့ fire လုပ်သင့်တယ်လို့ သတ်မှတ်ပါတယ်။ PostgreSQL ကတော့ — ပိုပြီး အဆင်ပြေတယ်လို့ ယူဆထားတဲ့ — နာမည် အစဉ်လိုက်ကို သုံးပါတယ်။

SQL က — cascade လုပ်တဲ့ deletes တွေပေါ်က `BEFORE DELETE` triggers တွေကို — cascade `DELETE` ပြီးဆုံးပြီးမှ fire လုပ်သင့်တယ်လို့ သတ်မှတ်ပါတယ်။ PostgreSQL ရဲ့ အပြုအမူကတော့ — `BEFORE DELETE` ကို — cascade လုပ်တဲ့ တစ်ခု ဖြစ်ရင်တောင် — delete action မတိုင်ခင် အမြဲတမ်း fire လုပ်တာ ဖြစ်ပါတယ်။ ဒါက ပိုပြီး ညီညွတ်တယ်လို့ ယူဆပါတယ်။ Referential action တစ်ခုကြောင့် ဖြစ်ပေါ်တဲ့ update တစ်ခုအတွင်း — `BEFORE` triggers တွေက rows တွေကို ပြုပြင်မွမ်းမံတာ ဒါမှမဟုတ် updates တွေကို တားဆီးတာမျိုး လုပ်ရင် — standard မဟုတ်တဲ့ အပြုအမူတွေလည်း ရှိပါတယ်။ ဒါက — constraint violations တွေ ဒါမှမဟုတ် referential constraint ကို လေးစားမှု မရှိတဲ့ သိမ်းဆည်းထားတဲ့ data တွေကို ဖြစ်စေနိုင်ပါတယ်။

Trigger တစ်ခုတည်းအတွက် OR သုံးပြီး actions အများအပြား သတ်မှတ်နိုင်တာက — SQL standard ရဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

`TRUNCATE` အတွက် triggers တွေ fire လုပ်နိုင်တာရော — views တွေပေါ်မှာ statement-level triggers တွေ သတ်မှတ်နိုင်တာရော — SQL standard ရဲ့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

`CREATE CONSTRAINT TRIGGER` က SQL standard ရဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ `OR REPLACE` option ကလည်း ဒီလိုပါပဲ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TRIGGER](/docs/postgresql/sql-altertrigger), [DROP TRIGGER](/docs/postgresql/sql-droptrigger), [CREATE FUNCTION](/docs/postgresql/sql-createfunction), [SET CONSTRAINTS](/docs/postgresql/sql-set-constraints)
