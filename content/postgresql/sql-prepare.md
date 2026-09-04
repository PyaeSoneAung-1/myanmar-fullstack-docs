---
title: "PREPARE (statement တစ်ခုကို ပြင်ဆင်ခြင်း)"
description: "Prepared statement (ကြိုတင် ပြင်ဆင်ထားသော statement) တစ်ခုကို ဖန်တီးရန် သုံးသော command — $1, $2 ဖြင့် parameters ရည်ညွှန်းပုံ၊ data type သတ်မှတ်ပုံ၊ session သက်တမ်းအတွင်းသာ တည်ရှိခြင်းနှင့် DEALLOCATE ဖြင့် ရှင်းလင်းခြင်း၊ generic plan နှင့် custom plan ရွေးချယ်မှု ယန္တရားတို့ အပြင် ဥပမာများ ပါဝင်သည်"
order: 192
source: "https://www.postgresql.org/docs/current/sql-prepare.html"
status: translated
updated: 2026-09-04
---

## PREPARE (statement တစ်ခုကို ပြင်ဆင်ခြင်း)

PREPARE — statement တစ်ခုကို execute လုပ်ဖို့ ပြင်ဆင်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
PREPARE name [ ( data_type [, ...] ) ] AS statement
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`PREPARE` က prepared statement (ကြိုတင် ပြင်ဆင်ထားသော statement) တစ်ခုကို ဖန်တီးပေးပါတယ်။ Prepared statement ဆိုတာ — performance (စွမ်းဆောင်ရည်) ကို optimize လုပ်ဖို့ အသုံးပြုနိုင်တဲ့ — server-side object တစ်ခု ဖြစ်ပါတယ်။ `PREPARE` statement ကို execute လုပ်တဲ့အခါ — သတ်မှတ်ထားတဲ့ statement ကို parse လုပ်ပြီး analyze လုပ်ကာ rewrite (ပြန်လည် ရေးသားခြင်း) လုပ်ပါတယ်။ နောက်ပိုင်းမှာ `EXECUTE` command တစ်ခုကို ထုတ်ပြန်လိုက်တဲ့အခါ — prepared statement ကို plan ရေးဆွဲပြီး execute လုပ်ပါတယ်။ ဒီလို အလုပ်တာဝန် ခွဲဝေမှုက — ထပ်ခါထပ်ခါ parse analysis (parse လုပ်ငန်းစဉ်) အလုပ်တွေ လုပ်နေရခြင်းကို ရှောင်ရှားနိုင်စေသလို — execution plan က ထောက်ပံ့ပေးလိုက်တဲ့ သီးခြား parameter values (parameter တန်ဖိုးများ) တွေပေါ်မှာ မှီခိုနေဖို့ကိုလည်း ခွင့်ပြုပါတယ်။

Prepared statements တွေက parameter တွေ လက်ခံနိုင်ပါတယ် — ဆိုလိုတာက — statement ကို execute လုပ်တဲ့အခါ statement ထဲကို အစားထိုး ထည့်သွင်းပေးတဲ့ တန်ဖိုးတွေ ဖြစ်ပါတယ်။ Prepared statement ကို ဖန်တီးတဲ့အခါ — `$1`, `$2` စသဖြင့် သုံးပြီး — parameters တွေကို ၎င်းတို့ရဲ့ နေရာအလိုက် (by position) ရည်ညွှန်းပါတယ်။ ဆက်စပ်နေတဲ့ parameter data types စာရင်းတစ်ခုကိုလည်း ဆန္ဒရှိရင် သတ်မှတ်နိုင်ပါတယ်။ Parameter တစ်ခုရဲ့ data type ကို မသတ်မှတ်ထားရင် ဒါမှမဟုတ် `unknown` လို့ ကြေညာထားရင် — type ကို (ဖြစ်နိုင်ရင်) အဲဒီ parameter ကို ပထမဆုံး ရည်ညွှန်းတဲ့ context (အခြေအနေ) ကနေ ခန့်မှန်း ဆုံးဖြတ်ပါတယ်။ Statement ကို execute လုပ်တဲ့အခါ — ဒီ parameters တွေအတွက် တကယ့် တန်ဖိုးတွေကို `EXECUTE` statement ထဲမှာ သတ်မှတ်ပေးရပါတယ်။ အဲဒီအကြောင်း ပိုပြီး သိချင်ရင် [EXECUTE](/docs/postgresql/sql-execute) ကို ကြည့်ပါ။

Prepared statements တွေက လက်ရှိ database session ရဲ့ သက်တမ်း အတွင်းမှာပဲ တည်ရှိပါတယ်။ Session က ပြီးဆုံးသွားတဲ့အခါ — prepared statement ကို မေ့ပစ်လိုက်လို့ — ပြန်လည် အသုံးမပြုခင် အဲဒါကို အသစ် ပြန်ဖန်တီးပေးရပါတယ်။ ဒါက ဆိုလိုတာက — prepared statement တစ်ခုတည်းကို တစ်ပြိုင်နက် ချိတ်ဆက်နေတဲ့ database clients အများအပြားက သုံးလို့ မရဘူးဆိုတာပါ; ဒါပေမယ့် — client တစ်ခုချင်းစီကတော့ ကိုယ်ပိုင် prepared statement တွေကို ဖန်တီးပြီး သုံးနိုင်ပါတယ်။ Prepared statements တွေကို [`DEALLOCATE`](/docs/postgresql/sql-deallocate) command နဲ့ ကိုယ်တိုင် ရှင်းလင်း (clean up) လုပ်နိုင်ပါတယ်။

Prepared statements တွေက — session တစ်ခုတည်းကို သုံးပြီး ပုံစံတူ statement တွေ အများအပြားကို execute လုပ်နေတဲ့အခါ — performance အတွက် အကြီးမားဆုံး အားသာချက်ကို ရနိုင်ပါတယ်။ Statements တွေက plan ရေးဆွဲဖို့ ဒါမှမဟုတ် rewrite လုပ်ဖို့ ရှုပ်ထွေးတယ်ဆိုရင် — ဥပမာ — query က table အများအပြားရဲ့ join (ပေါင်းစပ်မှု) တစ်ခု ပါဝင်တာ ဒါမှမဟုတ် rules အများအပြားကို အသုံးချဖို့ လိုအပ်တာမျိုးဆိုရင် — performance ကွာခြားမှုက အထူးသဖြင့် သိသာပါလိမ့်မယ်။ Statement က plan ရေးဆွဲဖို့နဲ့ rewrite လုပ်ဖို့ အတော်လေး ရိုးရှင်းပေမယ့် — execute လုပ်ဖို့ အတော်လေး စရိတ်ကြီးတယ်ဆိုရင်တော့ — prepared statements တွေရဲ့ performance အားသာချက်က သိပ်ပြီး သိသာမှာ မဟုတ်ပါဘူး။

## Parameters (parameter များ)

- **name** — ဒီ prepared statement တစ်ခုချင်းစီအတွက် ပေးလိုက်တဲ့ နာမည် တစ်ခု ဖြစ်ပါတယ်။ ၎င်းက session တစ်ခုတည်း အတွင်းမှာ unique (ထူးခြားသော) နာမည် ဖြစ်ရမှာ ဖြစ်ပြီး — နောက်ပိုင်းမှာ အရင်က ပြင်ဆင်ထားတဲ့ (previously prepared) statement တစ်ခုကို execute လုပ်ဖို့ ဒါမှမဟုတ် deallocate လုပ်ဖို့ သုံးပါတယ်။
- **data_type** — Prepared statement ရဲ့ parameter တစ်ခုရဲ့ data type ဖြစ်ပါတယ်။ သီးခြား parameter တစ်ခုရဲ့ data type ကို မသတ်မှတ်ထားဘူးဆိုရင် ဒါမှမဟုတ် unknown လို့ သတ်မှတ်ထားရင် — အဲဒီ parameter ကို ပထမဆုံး ရည်ညွှန်းတဲ့ context ကနေ ခန့်မှန်း ဆုံးဖြတ်ပါလိမ့်မယ်။ Prepared statement ထဲမှာကိုယ်တိုင် parameters တွေကို ရည်ညွှန်းဖို့ — `$1`, `$2` စသဖြင့် သုံးပါ။
- **statement** — SELECT, INSERT, UPDATE, DELETE, MERGE, ဒါမှမဟုတ် VALUES statement တစ်ခုခု ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

Prepared statement တစ်ခုကို *generic plan* (ယေဘုယျ plan) ဒါမှမဟုတ် *custom plan* (စိတ်ကြိုက် plan) — နှစ်မျိုးထဲက တစ်ခုခုနဲ့ execute လုပ်နိုင်ပါတယ်။ Generic plan က execute လုပ်မှု အားလုံးမှာ တူညီတဲ့ plan ဖြစ်ပြီး — custom plan ကတော့ အဲဒီ call တစ်ခုချင်းစီမှာ ပေးလိုက်တဲ့ parameter values တွေကို အသုံးပြုပြီး — သီးခြား execution တစ်ခုအတွက် ထုတ်ပေးတဲ့ plan ဖြစ်ပါတယ်။ Generic plan ကို သုံးတာက planning overhead (plan ရေးဆွဲမှု ထပ်ဆောင်း ကုန်ကျစရိတ်) ကို ရှောင်ရှားပေးပေမယ့် — အခြေအနေတချို့မှာတော့ planner က parameter values တွေအကြောင်း သိရှိမှုကို အသုံးချနိုင်လို့ — custom plan က execute လုပ်ဖို့ ပိုပြီး ထိရောက်မှု ရှိနိုင်ပါတယ်။ (ဟုတ်ပါတယ် — prepared statement မှာ parameters မရှိဘူးဆိုရင်တော့ ဒီကိစ္စက အဓိပ္ပာယ် မရှိတော့ဘဲ — generic plan ကိုပဲ အမြဲတမ်း သုံးပါတယ်။)

Default အနေနဲ့ (ဆိုလိုတာက [plan_cache_mode](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-PLAN-CACHE-MODE) ကို `auto` လို့ သတ်မှတ်ထားတဲ့အခါ) — server က parameters ပါဝင်တဲ့ prepared statement တစ်ခုအတွက် — generic plan လား custom plan လား သုံးမယ်ဆိုတာကို အလိုအလျောက် ရွေးချယ်ပေးပါတယ်။ ဒီအတွက် လက်ရှိ စည်းမျဉ်းကတော့ — ပထမဆုံး executions ငါးခုကို custom plans တွေနဲ့ လုပ်ဆောင်ပြီး — အဲဒီ plans တွေရဲ့ ပျမ်းမျှ estimated cost (ခန့်မှန်း ကုန်ကျစရိတ်) ကို တွက်ချက်ပါတယ်။ ပြီးတော့ — generic plan တစ်ခုကို ဖန်တီးပြီး — သူ့ရဲ့ estimated cost ကို ပျမ်းမျှ custom-plan cost နဲ့ နှိုင်းယှဉ်ပါတယ်။ နောက်ပိုင်း executions တွေမှာတော့ — generic plan ရဲ့ cost က — ထပ်ခါထပ်ခါ replanning (ပြန်လည် plan ရေးဆွဲခြင်း) လုပ်တာ ပိုကောင်းလောက်အောင် — ပျမ်းမျှ custom-plan cost ထက် သိပ်ပြီး မမြင့်ဘူးဆိုရင် — အဲဒီ generic plan ကို သုံးပါတယ်။

ဒီ heuristic (စမ်းသပ် ဆုံးဖြတ်မှု နည်းလမ်း) ကို ကျော်လွန်၍ သတ်မှတ်နိုင်ပါတယ် — `plan_cache_mode` ကို `force_generic_plan` ဒါမှမဟုတ် `force_custom_plan` လို့ အသီးသီး သတ်မှတ်ခြင်းအားဖြင့် — server ကို generic plans ဒါမှမဟုတ် custom plans တွေပဲ သုံးဖို့ အတင်းအကျပ် လုပ်နိုင်ပါတယ်။ ဒီ setting က — generic plan ရဲ့ cost estimate က တစ်စုံတစ်ရာသော အကြောင်းကြောင့် အတော်ကြီး လွဲနေတဲ့အခါမျိုးမှာ — အဓိက အသုံးဝင်ပါတယ်; ဒါက — သူ့ရဲ့ တကယ့် (actual) cost က custom plan ရဲ့ cost ထက် အများကြီး ပိုများနေရင်တောင် — generic plan ကို ရွေးချယ်ခံရဖို့ ခွင့်ပြုပေးပါတယ်။

Prepared statement တစ်ခုအတွက် PostgreSQL က သုံးနေတဲ့ query plan ကို စစ်ဆေးကြည့်ဖို့ — [`EXPLAIN`](/docs/postgresql/sql-explain) ကို သုံးပါ၊ ဥပမာ:

```sql
EXPLAIN EXECUTE name(parameter_values);
```

Generic plan တစ်ခုကို သုံးနေတယ်ဆိုရင် — အဲဒီ plan ထဲမှာ `$n` လို parameter symbols (parameter သင်္ကေတများ) တွေ ပါဝင်မှာ ဖြစ်ပြီး — custom plan မှာတော့ ထောက်ပံ့ပေးလိုက်တဲ့ parameter values တွေကို အစားထိုး ထည့်သွင်းပြီးသား ဖြစ်ပါလိမ့်မယ်။

Query planning (query plan ရေးဆွဲခြင်း) နဲ့ — အဲဒီရည်ရွယ်ချက်အတွက် PostgreSQL က စုဆောင်းထားတဲ့ statistics (စာရင်းအင်း အချက်အလက်များ) အကြောင်း ပိုပြီး သိချင်ရင် — [ANALYZE](/docs/postgresql/sql-analyze) documentation ကို ကြည့်ပါ။

Prepared statement တစ်ခုရဲ့ အဓိက ရည်ရွယ်ချက်က statement ကို ထပ်ခါထပ်ခါ parse analysis နဲ့ planning လုပ်ရတာကို ရှောင်ရှားဖို့ ဖြစ်ပေမယ့် — statement ထဲမှာ အသုံးပြုထားတဲ့ database objects တွေက — ဒီ prepared statement ကို နောက်ဆုံး အသုံးပြုခဲ့ပြီးကတည်းက — definitional (DDL) ပြောင်းလဲမှုတွေ ဖြစ်ခဲ့တယ် ဒါမှမဟုတ် သူတို့ရဲ့ planner statistics တွေ update လုပ်ခံထားရတယ်ဆိုရင် — PostgreSQL က statement ကို မသုံးခင် re-analysis နဲ့ re-planning (ပြန်လည် analyze နှင့် plan ရေးဆွဲခြင်း) ကို အတင်းအကျပ် လုပ်ဆောင်ပါတယ်။ ဒါ့အပြင် — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ရဲ့ တန်ဖိုးက — အသုံးပြုမှု တစ်ကြိမ်ကနေ နောက်တစ်ကြိမ် ပြောင်းလဲသွားခဲ့ရင်လည်း — statement ကို `search_path` အသစ်ကို သုံးပြီး re-parse (ပြန်လည် parse) လုပ်ပါလိမ့်မယ်။ (ဒီနောက်ဆုံး အပြုအမူက PostgreSQL 9.3 ကစပြီး အသစ် ဖြစ်ပါတယ်။) ဒီစည်းမျဉ်းတွေက — prepared statement တစ်ခုကို အသုံးပြုခြင်းက — တူညီတဲ့ query text ကိုပဲ ထပ်ခါထပ်ခါ ပြန်လည် တင်သွင်းနေတာနဲ့ — semantic (အဓိပ္ပာယ်) အရ အတော်လေး ညီမျှလုနီးပါး ဖြစ်စေပေမယ့် — object definitions တွေ မပြောင်းလဲဘူးဆိုရင် — အထူးသဖြင့် အကောင်းဆုံး plan က အသုံးပြုမှုတိုင်းမှာ အတူတူပဲ ကျန်နေတယ်ဆိုရင် — performance အကျိုးအမြတ် ရှိစေပါတယ်။ Semantic ညီမျှမှု က အကောင်းဆုံး မဟုတ်တဲ့ ကိစ္စ ဥပမာ တစ်ခုကတော့ — statement က table တစ်ခုကို unqualified name (schema အရည်အချင်း မပါတဲ့ နာမည်) နဲ့ ရည်ညွှန်းထားပြီး — နောက်ပိုင်းမှာ `search_path` ထဲမှာ ရှေ့ပိုင်းက ပေါ်နေတဲ့ schema တစ်ခုထဲမှာ — နာမည်တူ table အသစ်တစ်ခု ဖန်တီးလိုက်တယ်ဆိုရင် — statement ထဲမှာ အသုံးပြုထားတဲ့ object တစ်ခုမှ မပြောင်းလဲခဲ့လို့ — အလိုအလျောက် re-parse ဖြစ်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — တခြား ပြောင်းလဲမှုတစ်ခုခုက re-parse တစ်ခုကို အတင်းအကျပ် ဖြစ်စေခဲ့ရင်တော့ — နောက်ပိုင်း အသုံးပြုမှုတွေမှာ table အသစ်ကို ရည်ညွှန်းပါလိမ့်မယ်။

Session ထဲမှာ ရရှိနိုင်တဲ့ prepared statements တွေ အားလုံးကို — [`pg_prepared_statements`](https://www.postgresql.org/docs/current/view-pg-prepared-statements.html) system view (စနစ် view) ကို query လုပ်ပြီး ကြည့်ရှုနိုင်ပါတယ်။

## Examples (ဥပမာများ)

`INSERT` statement တစ်ခုအတွက် prepared statement တစ်ခုကို ဖန်တီးပြီး — execute လုပ်ကြည့်ပါ:

```sql
PREPARE fooplan (int, text, bool, numeric) AS
    INSERT INTO foo VALUES($1, $2, $3, $4);
EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);
```

`SELECT` statement တစ်ခုအတွက် prepared statement တစ်ခုကို ဖန်တီးပြီး — execute လုပ်ကြည့်ပါ:

```sql
PREPARE usrrptplan (int) AS
    SELECT * FROM users u, logs l WHERE u.usrid=$1 AND u.usrid=l.usrid
    AND l.date = $2;
EXECUTE usrrptplan(1, current_date);
```

ဒီဥပမာမှာ — ဒုတိယ parameter ရဲ့ data type ကို မသတ်မှတ်ထားလို့ — `$2` ကို အသုံးပြုထားတဲ့ context ကနေ ခန့်မှန်း ဆုံးဖြတ်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `PREPARE` statement တစ်ခု ပါဝင်ပါတယ် — ဒါပေမယ့် embedded SQL ထဲမှာပဲ အသုံးပြုရန် အတွက်သာ ဖြစ်ပါတယ်။ `PREPARE` statement ရဲ့ ဒီ version ကလည်း — syntax အနည်းငယ် ကွဲပြားတာကို အသုံးပြုပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DEALLOCATE](/docs/postgresql/sql-deallocate), [EXECUTE](/docs/postgresql/sql-execute)
