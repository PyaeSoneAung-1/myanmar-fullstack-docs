---
title: "ALTER SEQUENCE (sequence generator တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)"
description: "တည်ရှိပြီးသား sequence generator တစ်ခုရဲ့ parameters များကို ပြောင်းလဲပေးသည့် command — AS data_type, INCREMENT, MINVALUE/MAXVALUE, CYCLE, START, RESTART, CACHE, OWNED BY, SET LOGGED/UNLOGGED, OWNER TO, RENAME TO, SET SCHEMA ပုံစံများ၊ လိုအပ်ချက်များနှင့် သတိပြုရန် အချက်များ"
order: 149
source: "https://www.postgresql.org/docs/current/sql-altersequence.html"
status: translated
updated: 2026-09-04
---

## ALTER SEQUENCE (sequence generator တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)

ALTER SEQUENCE — sequence generator တစ်ခုရဲ့ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER SEQUENCE [ IF EXISTS ] name
    [ AS data_type ]
    [ INCREMENT [ BY ] increment ]
    [ MINVALUE minvalue | NO MINVALUE ] [ MAXVALUE maxvalue | NO MAXVALUE ]
    [ [ NO ] CYCLE ]
    [ START [ WITH ] start ]
    [ RESTART [ [ WITH ] restart ] ]
    [ CACHE cache ]
    [ OWNED BY { table_name.column_name | NONE } ]
ALTER SEQUENCE [ IF EXISTS ] name SET { LOGGED | UNLOGGED }
ALTER SEQUENCE [ IF EXISTS ] name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER SEQUENCE [ IF EXISTS ] name RENAME TO new_name
ALTER SEQUENCE [ IF EXISTS ] name SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER SEQUENCE` က တည်ရှိပြီးသား sequence generator တစ်ခုရဲ့ parameters တွေကို ပြောင်းလဲပေးပါတယ်။ `ALTER SEQUENCE` command ထဲမှာ ရှင်းလင်းစွာ သတ်မှတ်မထားတဲ့ parameters တွေက — အရင် setting တွေအတိုင်း ဆက်လက် ထိန်းသိမ်းထားပါတယ်။

`ALTER SEQUENCE` ကို အသုံးပြုဖို့ — သင်က sequence ရဲ့ ပိုင်ရှင် (owner) ဖြစ်ရပါမယ်။ Sequence တစ်ခုရဲ့ schema ကို ပြောင်းဖို့ — schema အသစ်ပေါ်မှာ `CREATE` privilege လည်း ရှိရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ဆိုရင် — `SET ROLE` နဲ့ ပိုင်ရှင်အသစ် role ဆီ ပြောင်းနိုင်ရပြီး — အဲဒီ role က sequence ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက sequence ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် သင်လုပ်နိုင်တာထက် ပိုတဲ့ ဘာကိုမှ မလုပ်နိုင်အောင် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် sequence ရဲ့ ownership ကိုမဆို ပြောင်းလဲလို့ ရပါတယ်။)

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် sequence တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်သည်)။
- **IF EXISTS** — Sequence မရှိဘူးဆိုရင် error တစ်ခု မထုတ်တော့ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **data_type** — AS data_type ဆိုတဲ့ optional clause က sequence ရဲ့ data type ကို ပြောင်းလဲပေးပါတယ်။ Valid type တွေကတော့ smallint, integer နဲ့ bigint ဖြစ်ပါတယ်။
Data type ကို ပြောင်းလိုက်တာက — အရင် minimum နဲ့ maximum တန်ဖိုးတွေက data type အဟောင်းရဲ့ minimum ဒါမှမဟုတ် maximum တန်ဖိုး ဖြစ်ခဲ့မယ်ဆိုရင်သာ (တနည်းအားဖြင့် — sequence ကို NO MINVALUE ဒါမှမဟုတ် NO MAXVALUE သုံးပြီး — သွယ်ဝိုက် (implicitly) ဖြစ်စေ ရှင်းလင်းစွာ (explicitly) ဖြစ်စေ — ဖန်တီးထားခဲ့တယ်ဆိုရင်) — sequence ရဲ့ minimum နဲ့ maximum တန်ဖိုးတွေကို အလိုအလျောက် ပြောင်းလဲပေးပါတယ်။ မဟုတ်ရင်တော့ — အဲဒီ command ထဲမှာကိုပဲ တန်ဖိုးအသစ်တွေ သတ်မှတ်မပေးထားဘူးဆိုရင် — ရှိပြီးသား minimum နဲ့ maximum တန်ဖိုးတွေကို ထိန်းသိမ်းထားပါတယ်။ Minimum နဲ့ maximum တန်ဖိုးတွေက data type အသစ်ထဲမှာ မဆံ့ဘူးဆိုရင် — error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။
- **increment** — INCREMENT BY increment clause က optional ဖြစ်ပါတယ်။ Positive (အပေါင်း) တန်ဖိုး ဆိုရင် ascending sequence (တန်ဖိုးတွေ တက်သွားသည့် sequence) ဖြစ်စေပြီး — negative (အနုတ်) တန်ဖိုး ဆိုရင် descending sequence (တန်ဖိုးတွေ ဆင်းသွားသည့် sequence) ဖြစ်စေပါတယ်။ သတ်မှတ်မပေးထားဘူးဆိုရင် — increment တန်ဖိုးအဟောင်းကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။
- **minvalueNO MINVALUE** — MINVALUE minvalue ဆိုတဲ့ optional clause က sequence တစ်ခု ထုတ်လုပ်နိုင်တဲ့ အနိမ့်ဆုံး တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ NO MINVALUE လို့ သတ်မှတ်ထားရင် — ascending နဲ့ descending sequence တွေအတွက် အသီးသီး 1 နဲ့ data type ရဲ့ minimum တန်ဖိုး ဆိုတဲ့ default တန်ဖိုးတွေကို သုံးပါလိမ့်မယ်။ Option နှစ်ခုလုံး သတ်မှတ်မထားဘူးဆိုရင် — လက်ရှိ minimum တန်ဖိုးကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။
- **maxvalueNO MAXVALUE** — MAXVALUE maxvalue ဆိုတဲ့ optional clause က sequence အတွက် အမြင့်ဆုံး တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ NO MAXVALUE လို့ သတ်မှတ်ထားရင် — ascending နဲ့ descending sequence တွေအတွက် အသီးသီး data type ရဲ့ maximum တန်ဖိုးနဲ့ -1 ဆိုတဲ့ default တန်ဖိုးတွေကို သုံးပါလိမ့်မယ်။ Option နှစ်ခုလုံး သတ်မှတ်မထားဘူးဆိုရင် — လက်ရှိ maximum တန်ဖိုးကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။
- **CYCLE** — CYCLE ဆိုတဲ့ optional key word ကို သုံးရင် — ascending sequence တစ်ခုက maxvalue ကို ဖြစ်စေ descending sequence တစ်ခုက minvalue ကို ဖြစ်စေ ရောက်ရှိပြီးတဲ့အခါ — sequence ကို ပြန်လည် ရစ်ပတ်သွားစေဖို့ (wrap around) ခွင့်ပြုပါတယ်။ ကန့်သတ်ချက် (limit) ကို ရောက်ရှိသွားရင် — နောက်ထုတ်ပေးလိုက်တဲ့ နံပါတ်က — ascending ဆိုရင် minvalue၊ descending ဆိုရင် maxvalue — ဖြစ်သွားပါလိမ့်မယ်။
- **NO CYCLE** — NO CYCLE ဆိုတဲ့ optional key word ကို သတ်မှတ်ထားရင် — sequence က ၎င်းရဲ့ maximum တန်ဖိုးကို ရောက်ရှိပြီးနောက် nextval ခေါ်ဆိုမှု တစ်ခုခုက error တစ်ခု ပြန်ပေးပါလိမ့်မယ်။ CYCLE ရော NO CYCLE ရော နှစ်ခုလုံး သတ်မှတ်မထားဘူးဆိုရင် — cycle အပြုအမူအဟောင်းကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။
- **start** — START WITH start ဆိုတဲ့ optional clause က sequence ရဲ့ မှတ်တမ်းတင်ထားတဲ့ (recorded) start တန်ဖိုးကို ပြောင်းလဲပေးပါတယ်။ ဒါက sequence ရဲ့ လက်ရှိ တန်ဖိုးအပေါ် သက်ရောက်မှု မရှိပါဘူး; နောင်မှာ ALTER SEQUENCE RESTART command တွေ အသုံးပြုမယ့် တန်ဖိုးကိုပဲ ရိုးရိုး သတ်မှတ်ပေးတာပါ။
- **restart** — RESTART [ WITH restart ] ဆိုတဲ့ optional clause က sequence ရဲ့ လက်ရှိ တန်ဖိုးကို ပြောင်းလဲပေးပါတယ်။ ဒါက is_called = false နဲ့ setval function ကို ခေါ်တာနဲ့ ဆင်တူပါတယ်: သတ်မှတ်ထားတဲ့ တန်ဖိုးကို နောက် nextval ခေါ်ဆိုမှုက ပြန်ပေးပါလိမ့်မယ်။ restart တန်ဖိုး မပါဘဲ RESTART လို့ ရေးလိုက်ရင် — CREATE SEQUENCE က မှတ်တမ်းတင်ခဲ့တဲ့ ဒါမှမဟုတ် ALTER SEQUENCE START WITH က နောက်ဆုံး သတ်မှတ်ခဲ့တဲ့ start တန်ဖိုးကို ပေးလိုက်တာနဲ့ ညီမျှပါတယ်။
setval ခေါ်ဆိုမှုနဲ့ ဆန့်ကျင်ဘက်အနေနဲ့ — sequence တစ်ခုပေါ်မှာ RESTART လုပ်ဆောင်ချက်က transactional ဖြစ်ပြီး — တစ်ပြိုင်နက် (concurrent) transaction တွေက အဲဒီ sequence ကနေ နံပါတ်တွေ ရယူခြင်းကို ပိတ်ဆို့ပါတယ်။ အဲဒီလို လည်ပတ်မှုပုံစံ မလိုချင်ဘူးဆိုရင် — setval ကို အသုံးပြုသင့်ပါတယ်။
- **cache** — CACHE cache clause က — ပိုမြန်တဲ့ ဝင်ရောက်မှုအတွက် — sequence နံပါတ်တွေကို ကြိုတင် ခွဲဝေပြီး (preallocated) memory ထဲမှာ သိမ်းထားနိုင်အောင် လုပ်ပေးပါတယ်။ အနည်းဆုံး တန်ဖိုးက 1 ဖြစ်ပြီး (တစ်ကြိမ်မှာ တန်ဖိုးတစ်ခုတည်းပဲ ထုတ်လုပ်နိုင်တယ် — ဆိုလိုတာက cache မရှိဘူး)။ သတ်မှတ်မပေးထားဘူးဆိုရင် — cache တန်ဖိုးအဟောင်းကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။
- **SET { LOGGED | UNLOGGED }** — ဒီပုံစံက sequence ကို unlogged ကနေ logged အဖြစ် ဒါမှမဟုတ် အပြန်အလှန်အားဖြင့် ပြောင်းလဲပေးပါတယ် (CREATE SEQUENCE ကို ကြည့်ပါ)။ Temporary sequence တစ်ခုပေါ်မှာတော့ ဒါကို အသုံးပြုလို့ မရပါဘူး။
- **OWNED BY table_name.column_nameOWNED BY NONE** — OWNED BY option က sequence ကို သတ်မှတ်ထားတဲ့ table column တစ်ခုနဲ့ ဆက်စပ်ပေးလိုက်တာဖြစ်ပြီး — အဲဒီ column (ဒါမှမဟုတ် ၎င်းရဲ့ table တစ်ခုလုံး) ကို drop လုပ်လိုက်ရင် — sequence ကိုပါ အလိုအလျောက် drop လုပ်သွားပါလိမ့်မယ်။ သတ်မှတ်ပေးလိုက်ရင် — ဒီဆက်စပ်မှုက sequence အတွက် အရင် သတ်မှတ်ထားခဲ့တဲ့ ဆက်စပ်မှု တစ်ခုခုကို အစားထိုးလိုက်ပါတယ်။ သတ်မှတ်လိုက်တဲ့ table က sequence နဲ့ owner အတူတူ ရှိပြီး schema လည်း အတူတူ ဖြစ်ရပါမယ်။ OWNED BY NONE လို့ သတ်မှတ်လိုက်ရင် — ရှိပြီးသား ဆက်စပ်မှု တစ်ခုခုကို ဖယ်ရှားပြီး — sequence ကို “free-standing” (ဘာနဲ့မှ မချိတ်ဆက်သော) ဖြစ်စေပါတယ်။
- **new_owner** — Sequence ရဲ့ ပိုင်ရှင်အသစ်ရဲ့ user name ဖြစ်ပါတယ်။
- **new_name** — Sequence အတွက် နာမည်အသစ် ဖြစ်ပါတယ်။
- **new_schema** — Sequence အတွက် schema အသစ် ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`ALTER SEQUENCE` က — လက်ရှိ backend တစ်ခုကလွဲပြီး — sequence တန်ဖိုးတွေကို ကြိုတင် ခွဲဝေ (preallocate) ပြီး cache လုပ်ထားတဲ့ တခြား backends တွေရဲ့ `nextval` ရလဒ်တွေကို ချက်ချင်း သက်ရောက်မှာ မဟုတ်ပါဘူး။ ၎င်းတို့က ပြောင်းလဲသွားတဲ့ sequence generation parameters တွေကို သတိထားမိခင် — cache လုပ်ထားတဲ့ တန်ဖိုးတွေ အကုန်လုံးကို အရင် အသုံးပြုပါလိမ့်မယ်။ လက်ရှိ backend ကတော့ ချက်ချင်း သက်ရောက်ခံရပါတယ်။

`ALTER SEQUENCE` က sequence ရဲ့ `currval` state ကို သက်ရောက်မှု မရှိပါဘူး။ (PostgreSQL 8.3 မတိုင်ခင် — တစ်ခါတစ်ရံ သက်ရောက်မှု ရှိခဲ့ပါတယ်။)

`ALTER SEQUENCE` က တစ်ပြိုင်နက် (concurrent) `nextval`, `currval`, `lastval` နဲ့ `setval` ခေါ်ဆိုမှုတွေကို ပိတ်ဆို့ပါတယ်။

သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် — `ALTER TABLE` ကိုလည်း sequences တွေနဲ့ တွဲသုံးလို့ ရပါတယ်; ဒါပေမယ့် sequences တွေနဲ့ ခွင့်ပြုထားတဲ့ `ALTER TABLE` variants တွေက အပေါ်မှာ ပြထားတဲ့ ပုံစံတွေနဲ့ ညီမျှတာတွေပဲ ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`serial` လို့ ခေါ်တဲ့ sequence တစ်ခုကို 105 မှာ restart လုပ်ပါ:

```sql
ALTER SEQUENCE serial RESTART WITH 105;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER SEQUENCE` က — PostgreSQL extensions တွေ ဖြစ်တဲ့ `AS`, `START WITH`, `OWNED BY`, `OWNER TO`, `RENAME TO` နဲ့ `SET SCHEMA` clauses တွေကလွဲပြီး — SQL standard နဲ့ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SEQUENCE](/docs/postgresql/sql-createsequence), [DROP SEQUENCE](/docs/postgresql/sql-dropsequence)
