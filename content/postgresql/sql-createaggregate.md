---
title: "CREATE AGGREGATE (aggregate function အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Aggregate function အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးသော command ဖြစ်ပြီး — ordinary, ordered-set နှင့် hypothetical-set aggregate ပုံစံ သုံးမျိုးလုံးကို ထောက်ပံ့ပေးသည်။ State transition function (SFUNC/STYPE), final function (FINALFUNC), combine function (COMBINEFUNC) ကဲ့သို့သော parameters များဖြင့် moving-aggregate mode နှင့် partial (parallel) aggregation တို့ကိုလည်း ပံ့ပိုးနိုင်ပြီး — OR REPLACE option နှင့် BASETYPE သုံးသော syntax အဟောင်းလည်း ပါဝင်သည်"
order: 312
source: "https://www.postgresql.org/docs/current/sql-createaggregate.html"
status: translated
updated: 2026-09-04
---

## CREATE AGGREGATE (aggregate function အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE AGGREGATE — aggregate function အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] AGGREGATE name ( [ argmode ] [ argname ] arg_data_type [ , ... ] ) (
    SFUNC = sfunc,
    STYPE = state_data_type
    [ , SSPACE = state_data_size ]
    [ , FINALFUNC = ffunc ]
    [ , FINALFUNC_EXTRA ]
    [ , FINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE } ]
    [ , COMBINEFUNC = combinefunc ]
    [ , SERIALFUNC = serialfunc ]
    [ , DESERIALFUNC = deserialfunc ]
    [ , INITCOND = initial_condition ]
    [ , MSFUNC = msfunc ]
    [ , MINVFUNC = minvfunc ]
    [ , MSTYPE = mstate_data_type ]
    [ , MSSPACE = mstate_data_size ]
    [ , MFINALFUNC = mffunc ]
    [ , MFINALFUNC_EXTRA ]
    [ , MFINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE } ]
    [ , MINITCOND = minitial_condition ]
    [ , SORTOP = sort_operator ]
    [ , PARALLEL = { SAFE | RESTRICTED | UNSAFE } ]
)

CREATE [ OR REPLACE ] AGGREGATE name ( [ [ argmode ] [ argname ] arg_data_type [ , ... ] ]
                        ORDER BY [ argmode ] [ argname ] arg_data_type [ , ... ] ) (
    SFUNC = sfunc,
    STYPE = state_data_type
    [ , SSPACE = state_data_size ]
    [ , FINALFUNC = ffunc ]
    [ , FINALFUNC_EXTRA ]
    [ , FINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE } ]
    [ , INITCOND = initial_condition ]
    [ , PARALLEL = { SAFE | RESTRICTED | UNSAFE } ]
    [ , HYPOTHETICAL ]
)

or the old syntax

CREATE [ OR REPLACE ] AGGREGATE name (
    BASETYPE = base_type,
    SFUNC = sfunc,
    STYPE = state_data_type
    [ , SSPACE = state_data_size ]
    [ , FINALFUNC = ffunc ]
    [ , FINALFUNC_EXTRA ]
    [ , FINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE } ]
    [ , COMBINEFUNC = combinefunc ]
    [ , SERIALFUNC = serialfunc ]
    [ , DESERIALFUNC = deserialfunc ]
    [ , INITCOND = initial_condition ]
    [ , MSFUNC = msfunc ]
    [ , MINVFUNC = minvfunc ]
    [ , MSTYPE = mstate_data_type ]
    [ , MSSPACE = mstate_data_size ]
    [ , MFINALFUNC = mffunc ]
    [ , MFINALFUNC_EXTRA ]
    [ , MFINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE } ]
    [ , MINITCOND = minitial_condition ]
    [ , SORTOP = sort_operator ]
)
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE AGGREGATE` က aggregate function အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်။ `CREATE OR REPLACE AGGREGATE` ကတော့ aggregate function အသစ်တစ်ခုကို သတ်မှတ်ပေးမယ် သို့မဟုတ် ရှိပြီးသား definition တစ်ခုကို အစားထိုးပေးပါလိမ့်မယ်။ အခြေခံကျပြီး အသုံးများတဲ့ aggregate functions တချို့ကို distribution (ဖြန့်ချီမှု) နဲ့အတူ ထည့်သွင်း ပံ့ပိုးထားပြီး — သူတို့ကို [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) မှာ မှတ်တမ်း ပြုစုထားပါတယ်။ Data types အသစ်တွေ သတ်မှတ်တဲ့အခါ ဒါမှမဟုတ် မပံ့ပိုးရသေးတဲ့ aggregate function တစ်ခု လိုအပ်လာတဲ့အခါ — လိုချင်တဲ့ လုပ်ဆောင်ချက်တွေ ရရှိဖို့ `CREATE AGGREGATE` ကို သုံးနိုင်ပါတယ်။

ရှိပြီးသား definition တစ်ခုကို အစားထိုးတဲ့အခါ — argument types တွေ၊ result type နဲ့ direct arguments အရေအတွက်ကို ပြောင်းလဲလို့ မရပါဘူး။ ဒါ့အပြင် — definition အသစ်က အဟောင်းနဲ့ အမျိုးအစား တူညီရပါမယ် (ordinary aggregate, ordered-set aggregate ဒါမှမဟုတ် hypothetical-set aggregate ဖြစ်ရမယ်)။

Schema name ပေးထားရင် (ဥပမာ `CREATE AGGREGATE myschema.myagg ...`) — aggregate function ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပေးထားရင်တော့ လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။

Aggregate function တစ်ခုကို — သူ့ရဲ့ နာမည် နဲ့ input data type(s) တွေနဲ့ ခွဲခြား သတ်မှတ်ပါတယ်။ Schema တစ်ခုတည်းထဲမှာ — မတူညီတဲ့ input types တွေပေါ်မှာ လည်ပတ်တဲ့ aggregates နှစ်ခုက နာမည်တူညီနိုင်ပါတယ်။ Aggregate တစ်ခုရဲ့ နာမည်နဲ့ input data type(s) တွေက — schema တစ်ခုတည်းထဲက ordinary function တိုင်းရဲ့ နာမည်နဲ့ input data type(s) တွေနဲ့လည်း သီးခြား (distinct) ဖြစ်ရပါမယ်။ ဒီ အပြုအမူက ordinary function names တွေရဲ့ overloading (နာမည် ထပ်တူညီခြင်းကို ခွင့်ပြုခြင်း) နဲ့ ထပ်တူညီပါတယ် ([CREATE FUNCTION](/docs/postgresql/sql-createfunction) ကို ကြည့်ပါ)။

Aggregate function ရိုးရိုးတစ်ခုကို — ordinary functions တစ်ခု သို့မဟုတ် နှစ်ခုကနေ တည်ဆောက်ပါတယ်: state transition function `sfunc` တစ်ခု နဲ့ — optional ဖြစ်တဲ့ — final calculation function `ffunc` တစ်ခု ဖြစ်ပါတယ်။ သူတို့ကို အောက်ပါအတိုင်း သုံးပါတယ်:

```sql
sfunc( internal-state, next-data-values ) ---> next-internal-state
ffunc( internal-state ) ---> aggregate-value
```

PostgreSQL က aggregate ရဲ့ လက်ရှိ internal state ကို သိမ်းဆည်းဖို့ — `stype` data type ရှိတဲ့ temporary variable တစ်ခုကို ဖန်တီးပါတယ်။ Input row တစ်ခုစီမှာ — aggregate argument value(s) တွေကို တွက်ချက်ပြီး — state transition function ကို — လက်ရှိ state value နဲ့ argument value(s) အသစ်တွေနဲ့ ခေါ်ယူပြီး — internal state value အသစ်တစ်ခုကို တွက်ချက်ပါတယ်။ Rows အားလုံး process လုပ်ပြီးသွားတဲ့ နောက်မှာ — aggregate ရဲ့ return value ကို တွက်ချက်ဖို့ — final function ကို တစ်ကြိမ် ခေါ်ယူပါတယ်။ Final function မရှိဘူးဆိုရင် — ပြီးဆုံးချိန်မှာ ရှိနေတဲ့ state value ကိုပဲ return ပြန်ပါတယ်။

Aggregate function တစ်ခုက initial condition တစ်ခုကို ပံ့ပိုးပေးနိုင်ပါတယ် — ဆိုလိုတာက — internal state value အတွက် ကနဦး တန်ဖိုး (initial value) တစ်ခုပါ။ ၎င်းကို database ထဲမှာ `text` type ရဲ့ တန်ဖိုးတစ်ခုအနေနဲ့ သတ်မှတ် သိမ်းဆည်းပါတယ် — ဒါပေမယ့် — ၎င်းက state value data type ရဲ့ constant တစ်ခုရဲ့ တရားဝင်တဲ့ external representation (ပြင်ပ ကိုယ်စားပြုပုံ) တစ်ခု ဖြစ်ရပါမယ်။ မပံ့ပိုးထားဘူးဆိုရင် — state value က null ကနေ စတင်ပါတယ်။

State transition function ကို “strict” လို့ ကြေညာထားရင် — null inputs တွေနဲ့ ခေါ်ယူလို့ မရပါဘူး။ ဒီလို transition function မျိုးနဲ့ — aggregate ရဲ့ လုပ်ဆောင်မှုက အောက်ပါအတိုင်း ဖြစ်ပါတယ်။ Null input values တစ်ခုခု ပါတဲ့ rows တွေကို လျစ်လျူရှုပါတယ် (function ကို မခေါ်ဘဲ — အရင် state value ကို ဆက်ထိန်းထားပါတယ်)။ Initial state value က null ဖြစ်နေရင် — input values အားလုံး nonnull ဖြစ်တဲ့ ပထမဆုံး row မှာ — ပထမ argument value က state value ကို အစားထိုးလိုက်ပြီး — input values အားလုံး nonnull ဖြစ်နေတဲ့ နောက်ဆက်တွဲ row တစ်ခုစီမှာ — transition function ကို ခေါ်ယူပါတယ်။ ဒါက `max` လို aggregates တွေကို အကောင်အထည် ဖော်ဖို့ အသုံးဝင်ပါတယ်။ ဒီ အပြုအမူက `state_data_type` က ပထမ `arg_data_type` နဲ့ တူညီမှသာ ရနိုင်တယ်ဆိုတာ သတိပြုပါ။ ဒီ types တွေ မတူညီတဲ့အခါ — nonnull initial condition တစ်ခု ပံ့ပိုးပေးရပါမယ် ဒါမှမဟုတ် strict မဟုတ်တဲ့ transition function တစ်ခုကို သုံးရပါမယ်။

State transition function က strict မဟုတ်ဘူးဆိုရင် — input row တိုင်းမှာ ခြွင်းချက် မရှိ ခေါ်ယူခံရပြီး — null inputs တွေနဲ့ null state values တွေကို သူ့ဘာသာသူ ကိုင်တွယ်ရပါမယ်။ ဒါက aggregate ရေးသားသူကို — aggregate ရဲ့ null values ကိုင်တွယ်မှုအပေါ် အပြည့်အဝ ထိန်းချုပ်ခွင့် ပေးပါတယ်။

Final function ကို “strict” လို့ ကြေညာထားရင် — ပြီးဆုံးချိန် state value က null ဖြစ်နေတဲ့အခါ — ၎င်းကို မခေါ်တော့ဘဲ — null result တစ်ခုကို အလိုအလျောက် ပြန်ပေးပါတယ်။ (ဒါက strict functions တွေရဲ့ ပုံမှန် အပြုအမူပါပဲ။) ဘယ်လိုပဲ ဖြစ်ဖြစ် — final function မှာ null value တစ်ခုကို ပြန်ပေးဖို့ option ရှိပါတယ်။ ဥပမာ — `avg` အတွက် final function က — input rows သုည ခု ရှိခဲ့တာကို တွေ့ရင် — null ကို ပြန်ပေးပါတယ်။

တခါတလေ — final function ကို — state value တစ်ခုတည်း မဟုတ်ဘဲ — aggregate ရဲ့ input values တွေနဲ့ ကိုက်ညီတဲ့ — extra parameters တွေပါ လက်ခံတဲ့ပုံစံနဲ့ ကြေညာဖို့ အသုံးဝင်ပါတယ်။ ဒီလို လုပ်ရတဲ့ အဓိက အကြောင်းရင်းကတော့ — final function က polymorphic ဖြစ်ပြီး — state value ရဲ့ data type တစ်ခုတည်းနဲ့ — result type ကို အတိအကျ သတ်မှတ်ဖို့ မလုံလောက်တဲ့ အခြေအနေမျိုးမှာပါ။ ဒီ extra parameters တွေကို NULL အနေနဲ့ပဲ အမြဲတမ်း ပေးပို့ပါတယ် (ဒါကြောင့် — `FINALFUNC_EXTRA` option ကို သုံးတဲ့အခါ — final function က strict မဖြစ်ရပါဘူး) — ဒါပေမယ့် — သူတို့က တရားဝင် parameters တွေ ဖြစ်ပါတယ်။ Final function က ဥပမာ — လက်ရှိ call တစ်ခုထဲမှာ တကယ့် argument type ကို ခွဲခြား သိရှိဖို့ — `get_fn_expr_argtype` ကို သုံးနိုင်ပါတယ်။

Aggregate တစ်ခုက — [အပိုင်း 36.12.1](https://www.postgresql.org/docs/current/xaggr.html#XAGGR-MOVING-AGGREGATES) မှာ ဖော်ပြထားတဲ့အတိုင်း — *moving-aggregate mode* ကို optional အနေနဲ့ ထောက်ပံ့ပေးနိုင်ပါတယ်။ ဒါက `MSFUNC`, `MINVFUNC` နဲ့ `MSTYPE` parameters တွေကို သတ်မှတ်ဖို့ လိုအပ်ပြီး — `MSSPACE`, `MFINALFUNC`, `MFINALFUNC_EXTRA`, `MFINALFUNC_MODIFY` နဲ့ `MINITCOND` parameters တွေကတော့ optional ဖြစ်ပါတယ်။ `MINVFUNC` ကလွဲလို့ — ဒီ parameters တွေက — `M` မပါတဲ့ သက်ဆိုင်ရာ simple-aggregate parameters တွေလို အလုပ်လုပ်ပြီး — inverse transition function တစ်ခု ပါဝင်တဲ့ — aggregate ရဲ့ သီးခြား implementation တစ်ခုကို သတ်မှတ်ပေးပါတယ်။

Parameter list ထဲမှာ `ORDER BY` ပါတဲ့ syntax က — *ordered-set aggregate* လို့ ခေါ်တဲ့ — aggregate အမျိုးအစား အထူးတစ်ခုကို ဖန်တီးပေးပါတယ်; ဒါမှမဟုတ် — `HYPOTHETICAL` ကို သတ်မှတ်ထားရင် — *hypothetical-set aggregate* တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဒီ aggregates တွေက — sorted values တွေရဲ့ groups တွေအပေါ်မှာ — order-dependent (စီစဉ်မှု အပေါ် မူတည်သော) နည်းလမ်းတွေနဲ့ လည်ပတ်တာမို့ — input sort order တစ်ခု သတ်မှတ်ပေးတာက call တစ်ခုရဲ့ မရှိမဖြစ် အစိတ်အပိုင်း ဖြစ်ပါတယ်။ ဒါ့အပြင် — သူတို့မှာ *direct* arguments တွေ ရှိနိုင်ပါတယ် — ဆိုလိုတာက — input row တစ်ခုစီအတွက် မဟုတ်ဘဲ — aggregation တစ်ခုစီအတွက် တစ်ကြိမ်ပဲ အကဲဖြတ်ခံရတဲ့ arguments တွေပါ။ Hypothetical-set aggregates တွေက ordered-set aggregates တွေရဲ့ subclass တစ်ခု ဖြစ်ပြီး — direct arguments တချို့က — အရေအတွက် နဲ့ data types အရ — aggregated argument columns တွေနဲ့ ကိုက်ညီဖို့ လိုအပ်ပါတယ်။ ဒါက ဒီ direct arguments တွေရဲ့ တန်ဖိုးတွေကို — aggregate-input rows တွေရဲ့ collection ထဲ — “hypothetical” row အပိုတစ်ခုအနေနဲ့ ထပ်ပေါင်းခွင့် ပြုပါတယ်။

Aggregate တစ်ခုက — [အပိုင်း 36.12.4](https://www.postgresql.org/docs/current/xaggr.html#XAGGR-PARTIAL-AGGREGATES) မှာ ဖော်ပြထားတဲ့အတိုင်း — *partial aggregation* ကို optional အနေနဲ့ ထောက်ပံ့ပေးနိုင်ပါတယ်။ ဒါက `COMBINEFUNC` parameter ကို သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။ `state_data_type` က `internal` ဖြစ်နေရင် — parallel aggregation ဖြစ်နိုင်ဖို့ — `SERIALFUNC` နဲ့ `DESERIALFUNC` parameters တွေကိုပါ ပံ့ပိုးပေးတာ ပုံမှန်အားဖြင့် သင့်လျော်ပါတယ်။ Parallel aggregation ကို enable လုပ်ဖို့ — aggregate ကို `PARALLEL SAFE` လို့လည်း အမှတ်အသား လုပ်ထားရမယ်ဆိုတာ သတိပြုပါ။

`MIN` ဒါမှမဟုတ် `MAX` လို ပြုမူတဲ့ aggregates တွေကို — input row တိုင်းကို scan လုပ်မယ့်အစား — index တစ်ခုထဲကို ကြည့်ရှုခြင်းအားဖြင့် — တခါတရံ optimize လုပ်နိုင်ပါတယ်။ ဒီ aggregate ကို ဒီလို optimize လုပ်နိုင်ရင် — *sort operator* တစ်ခုကို သတ်မှတ်ခြင်းအားဖြင့် ညွှန်ပြပေးပါ။ အခြေခံ လိုအပ်ချက်ကတော့ — aggregate က — operator က ဖြစ်ပေါ်စေတဲ့ sort ordering ထဲက ပထမဆုံး element ကို ထုတ်ပေးရပါမယ်; တနည်းအားဖြင့်:

```sql
SELECT agg(col) FROM tab;
```

ဟာ အောက်ပါအတိုင်းနဲ့ ညီမျှ (equivalent) ရပါမယ်:

```sql
SELECT col FROM tab ORDER BY col USING sortop LIMIT 1;
```

နောက်ထပ် ယူဆချက်တွေကတော့ — aggregate က null inputs တွေကို လျစ်လျူရှုပြီး — non-null inputs တွေ မရှိခဲ့ရင်သာ null result ကို ပေးတာ ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — data type တစ်ခုရဲ့ `<` operator က `MIN` အတွက် သင့်လျော်တဲ့ sort operator ဖြစ်ပြီး — `>` ကတော့ `MAX` အတွက် သင့်လျော်တဲ့ sort operator ဖြစ်ပါတယ်။ သတ်မှတ်ထားတဲ့ operator က B-tree index operator class တစ်ခုရဲ့ “less than” သို့မဟုတ် “greater than” strategy member တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ optimization က ဘယ်တော့မှ တကယ် အကျိုးသက်ရောက်မှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။

Aggregate function တစ်ခုကို ဖန်တီးနိုင်ဖို့ — argument types တွေ၊ state type(s) တွေနဲ့ return type အပေါ်မှာ `USAGE` privilege ရှိရပြီး — အထောက်အကူပြု functions (supporting functions) တွေအပေါ်မှာ `EXECUTE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် aggregate function ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **argmode** — Argument တစ်ခုရဲ့ mode: IN သို့မဟုတ် VARIADIC။ (Aggregate functions တွေက OUT arguments တွေကို မထောက်ပံ့ပါဘူး။) ချန်လိုက်ရင် default က IN ဖြစ်ပါတယ်။ နောက်ဆုံး argument ကိုပဲ VARIADIC အဖြစ် အမှတ်အသား လုပ်နိုင်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ ဒါက လောလောဆယ် documentation ရည်ရွယ်ချက်တွေအတွက်ပဲ အသုံးဝင်ပါတယ်။ ချန်လိုက်ရင် — argument မှာ နာမည် မရှိပါဘူး။
- **arg_data_type** — ဒီ aggregate function လည်ပတ်မယ့် input data type တစ်ခု။ Argument specifications တွေရဲ့ စာရင်း နေရာမှာ * ကို ရေးပြီး — zero-argument aggregate function တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ (ဒီလို aggregate တစ်ခုရဲ့ ဥပမာက count(*) ဖြစ်ပါတယ်။)
- **base_type** — CREATE AGGREGATE ရဲ့ syntax အဟောင်းမှာ — input data type ကို aggregate name ဘေးမှာ ရေးမယ့်အစား — basetype parameter အနေနဲ့ သတ်မှတ်ပါတယ်။ ဒီ syntax က input parameter တစ်ခုတည်းကိုပဲ ခွင့်ပြုတယ်ဆိုတာ သတိပြုပါ။ ဒီ syntax နဲ့ zero-argument aggregate function တစ်ခုကို သတ်မှတ်ဖို့ — basetype ကို "ANY" ( * မဟုတ်ဘဲ) အဖြစ် သတ်မှတ်ပါ။ Ordered-set aggregates တွေကို syntax အဟောင်းနဲ့ သတ်မှတ်လို့ မရပါဘူး။
- **sfunc** — Input row တစ်ခုစီအတွက် ခေါ်ယူမယ့် state transition function ရဲ့ နာမည်။ ပုံမှန် N-argument aggregate function တစ်ခုအတွက် — sfunc က arguments N+1 ခု ယူရပြီး — ပထမ argument က `state_data_type` type ဖြစ်ကာ — ကျန်တဲ့ argument တွေက aggregate ရဲ့ ကြေညာထားတဲ့ input data type(s) တွေနဲ့ ကိုက်ညီရပါမယ်။ Function က `state_data_type` type ရဲ့ တန်ဖိုးတစ်ခုကို return ပြန်ရပါမယ်။ ဒီ function က — လက်ရှိ state value နဲ့ လက်ရှိ input data value(s) တွေကို ယူပြီး — နောက် state value ကို return ပြန်ပေးပါတယ်။
Ordered-set (hypothetical-set အပါအဝင်) aggregates တွေအတွက်တော့ — state transition function က လက်ရှိ state value နဲ့ aggregated arguments တွေကိုပဲ လက်ခံပြီး — direct arguments တွေကို မရပါဘူး။ ကျန်တဲ့ အပိုင်းတွေကတော့ အတူတူပါပဲ။
- **state_data_type** — Aggregate ရဲ့ state value အတွက် data type။
- **state_data_size** — Aggregate ရဲ့ state value ရဲ့ ခန့်မှန်း ပျမ်းမျှ အရွယ်အစား (bytes နဲ့)။ ဒီ parameter ကို ချန်လိုက်ရင် သို့မဟုတ် သုည ဖြစ်နေရင် — state_data_type ကို အခြေခံတဲ့ default estimate တစ်ခုကို သုံးပါတယ်။ Planner က ဒီ တန်ဖိုးကို — grouped aggregate query တစ်ခုအတွက် လိုအပ်တဲ့ memory ကို ခန့်မှန်းဖို့ သုံးပါတယ်။
- **ffunc** — Input rows အားလုံးကို ဖြတ်ကျော် (traverse) ပြီးတဲ့ နောက်မှာ — aggregate ရဲ့ result ကို တွက်ချက်ဖို့ ခေါ်ယူတဲ့ final function ရဲ့ နာမည်။ ပုံမှန် aggregate တစ်ခုအတွက် — ဒီ function က `state_data_type` type ရဲ့ argument တစ်ခုတည်းကို ယူရပါမယ်။ Aggregate ရဲ့ return data type ကို — ဒီ function ရဲ့ return type အနေနဲ့ သတ်မှတ်ပါတယ်။ ffunc ကို မသတ်မှတ်ထားဘူးဆိုရင် — ပြီးဆုံးချိန် state value ကို aggregate ရဲ့ result အဖြစ် သုံးပြီး — return type က state_data_type ဖြစ်ပါတယ်။
Ordered-set (hypothetical-set အပါအဝင်) aggregates တွေအတွက်တော့ — final function က — နောက်ဆုံး state value တင်မကဘဲ — direct arguments တွေ အားလုံးရဲ့ တန်ဖိုးတွေကိုပါ လက်ခံပါတယ်။
`FINALFUNC_EXTRA` ကို သတ်မှတ်ထားရင် — final function က — နောက်ဆုံး state value နဲ့ direct arguments တွေ အပြင် — aggregate ရဲ့ ပုံမှန် (aggregated) arguments တွေနဲ့ ကိုက်ညီတဲ့ — extra NULL values တွေကိုပါ လက်ခံပါတယ်။ ဒါက — polymorphic aggregate တစ်ခုကို သတ်မှတ်နေတဲ့အခါ — aggregate result type ကို မှန်ကန်စွာ ဆုံးဖြတ်နိုင်ဖို့ — အဓိက အသုံးဝင်ပါတယ်။
- **FINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE }** — ဒီ option က — final function က — သူ့ရဲ့ arguments တွေကို ပြုပြင်ခြင်း မရှိတဲ့ — pure function တစ်ခုလားဆိုတာ သတ်မှတ်ပါတယ်။ READ_ONLY က မပြုပြင်ဘူးလို့ ညွှန်ပြပြီး — ကျန် တန်ဖိုး နှစ်ခုကတော့ — transition state value ကို ပြောင်းလဲနိုင်တယ်လို့ ညွှန်ပြပါတယ်။ အသေးစိတ်အတွက် အောက်က Notes ကို ကြည့်ပါ။ Default ကတော့ READ_ONLY ဖြစ်ပြီး — ordered-set aggregates တွေအတွက်ကတော့ default က READ_WRITE ဖြစ်ပါတယ်။
- **combinefunc** — combinefunc function ကို — aggregate function က partial aggregation ကို ထောက်ပံ့နိုင်အောင် — optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ ပံ့ပိုးပေးထားရင် — combinefunc က — input values တွေရဲ့ subset တစ်ခုခုအပေါ် aggregation ရဲ့ ရလဒ် တစ်ခုစီ ပါဝင်တဲ့ — state_data_type values နှစ်ခုကို ပေါင်းစပ်ပြီး — input sets နှစ်ခုလုံးအပေါ် aggregating လုပ်ခြင်းရဲ့ ရလဒ်ကို ကိုယ်စားပြုတဲ့ — state_data_type အသစ်တစ်ခု ထုတ်လုပ်ရပါမယ်။ ဒီ function ကို sfunc တစ်ခုလို မှတ်ယူနိုင်ပါတယ် — input row တစ်ခုချင်းစီအပေါ် လုပ်ဆောင်ပြီး running aggregate state ထဲ ထပ်ပေါင်းမယ့်အစား — တခြား aggregate state တစ်ခုကို running state ထဲ ထပ်ပေါင်းပေးတာပါ။
combinefunc ကို — state_data_type ရဲ့ arguments နှစ်ခု ယူပြီး — state_data_type ရဲ့ တန်ဖိုးတစ်ခုကို return ပြန်တဲ့ပုံစံနဲ့ ကြေညာရပါမယ်။ ဒီ function က optional အနေနဲ့ “strict” ဖြစ်နိုင်ပါတယ်။ ဒီလိုဆိုရင် — input states တစ်ခုခု null ဖြစ်နေတဲ့အခါ — function ကို မခေါ်တော့ဘဲ — ကျန် state တစ်ခုကို မှန်ကန်တဲ့ ရလဒ်အနေနဲ့ ယူပါတယ်။
state_data_type က internal ဖြစ်တဲ့ aggregate functions တွေအတွက်တော့ — combinefunc က strict မဖြစ်ရပါဘူး။ ဒီကိစ္စမှာ — combinefunc က — null states တွေကို မှန်ကန်စွာ ကိုင်တွယ်ပြီး — return ပြန်တဲ့ state ကို aggregate memory context ထဲမှာ မှန်ကန်စွာ သိမ်းဆည်းထားကြောင်း သေချာစေရပါမယ်။
- **serialfunc** — state_data_type က internal ဖြစ်တဲ့ aggregate function တစ်ခုက — serialfunc function တစ်ခု ရှိမှသာ parallel aggregation မှာ ပါဝင်နိုင်ပါတယ် — ဒီ function က aggregate state ကို — တခြား process တစ်ခုဆီ ပို့လွှတ်နိုင်ဖို့ — bytea value တစ်ခုအဖြစ် serialize လုပ်ရပါမယ်။ ဒီ function က internal type ရဲ့ argument တစ်ခုတည်းကို ယူပြီး bytea type ကို return ပြန်ရပါမယ်။ သက်ဆိုင်တဲ့ deserialfunc တစ်ခုလည်း လိုအပ်ပါတယ်။
- **deserialfunc** — အရင်က serialize လုပ်ထားတဲ့ aggregate state ကို state_data_type အဖြစ် ပြန် deserialize လုပ်ပါတယ်။ ဒီ function က bytea နဲ့ internal types တွေရဲ့ arguments နှစ်ခုကို ယူပြီး — internal type ရဲ့ ရလဒ်တစ်ခု ထုတ်လုပ်ရပါမယ်။ (မှတ်ချက် — ဒုတိယ internal argument ကို အသုံးမပြုရပေမယ့် — type safety အကြောင်းပြချက်တွေကြောင့် လိုအပ်ပါတယ်။)
- **initial_condition** — State value အတွက် ကနဦး setting။ ဒါက state_data_type data type အတွက် လက်ခံနိုင်တဲ့ ပုံစံနဲ့ string constant တစ်ခု ဖြစ်ရပါမယ်။ မသတ်မှတ်ထားရင် — state value က null ကနေ စတင်ပါတယ်။
- **msfunc** — Moving-aggregate mode မှာ — input row တစ်ခုစီအတွက် ခေါ်ယူမယ့် forward state transition function ရဲ့ နာမည်။ ဒါက — ပုံမှန် transition function နဲ့ အတိအကျ တူပြီး — သူ့ရဲ့ ပထမ argument နဲ့ result က state_data_type နဲ့ မတူညီနိုင်တဲ့ — mstate_data_type type ဖြစ်နေတာပဲ ကွာပါတယ်။
- **minvfunc** — Moving-aggregate mode မှာ သုံးမယ့် inverse state transition function ရဲ့ နာမည်။ ဒီ function က msfunc နဲ့ argument နဲ့ result types တွေ တူညီပေမယ့် — state ထဲကို value တစ်ခု ထပ်ပေါင်းဖို့ အစား — လက်ရှိ aggregate state ကနေ value တစ်ခုကို ဖယ်ရှားဖို့ သုံးပါတယ်။ Inverse transition function က forward state transition function ရဲ့ strictness attribute နဲ့ တူညီရပါမယ်။
- **mstate_data_type** — Moving-aggregate mode သုံးတဲ့အခါ — aggregate ရဲ့ state value အတွက် data type။
- **mstate_data_size** — Moving-aggregate mode သုံးတဲ့အခါ — aggregate ရဲ့ state value ရဲ့ ခန့်မှန်း ပျမ်းမျှ အရွယ်အစား (bytes နဲ့)။ ဒါက state_data_size လို အတူတူပဲ အလုပ်လုပ်ပါတယ်။
- **mffunc** — Moving-aggregate mode သုံးတဲ့အခါ — input rows အားလုံးကို ဖြတ်ကျော်ပြီးတဲ့ နောက်မှာ — aggregate ရဲ့ result ကို တွက်ချက်ဖို့ ခေါ်ယူတဲ့ final function ရဲ့ နာမည်။ ဒါက ffunc လို အတူတူပဲ အလုပ်လုပ်ပြီး — သူ့ရဲ့ ပထမ argument ရဲ့ type က mstate_data_type ဖြစ်ကာ — extra dummy arguments တွေကို `MFINALFUNC_EXTRA` ကို ရေးခြင်းအားဖြင့် သတ်မှတ်တာပဲ ကွာပါတယ်။ mffunc ဒါမှမဟုတ် mstate_data_type က ဆုံးဖြတ်တဲ့ aggregate result type က — aggregate ရဲ့ ပုံမှန် implementation က ဆုံးဖြတ်တာနဲ့ ကိုက်ညီရပါမယ်။
- **MFINALFUNC_MODIFY = { READ_ONLY | SHAREABLE | READ_WRITE }** — ဒီ option က FINALFUNC_MODIFY လိုပဲ ဖြစ်ပေမယ့် — moving-aggregate final function ရဲ့ အပြုအမူကို ဖော်ပြပါတယ်။
- **minitial_condition** — Moving-aggregate mode သုံးတဲ့အခါ — state value အတွက် ကနဦး setting။ ဒါက initial_condition လို အတူတူပဲ အလုပ်လုပ်ပါတယ်။
- **sort_operator** — `MIN` သို့မဟုတ် `MAX` ကဲ့သို့သော aggregate တစ်ခုအတွက် ဆက်စပ်တဲ့ sort operator။ ဒါက operator name တစ်ခုပဲ ဖြစ်ပါတယ် (schema-qualified လည်း ဖြစ်နိုင်သည်)။ Operator က aggregate ရဲ့ input data types တွေ အတူတူ ရှိတယ်လို့ ယူဆပါတယ် (single-argument normal aggregate တစ်ခု ဖြစ်ရပါမယ်)။
- **PARALLEL = { SAFE | RESTRICTED | UNSAFE }** — PARALLEL SAFE, PARALLEL RESTRICTED နဲ့ PARALLEL UNSAFE တို့ရဲ့ အဓိပ္ပာယ်တွေက CREATE FUNCTION ထဲမှာလိုပဲ ဖြစ်ပါတယ်။ Aggregate တစ်ခုကို PARALLEL UNSAFE (ဒါက default ပါ!) ဒါမှမဟုတ် PARALLEL RESTRICTED လို့ အမှတ်အသား လုပ်ထားရင် — parallelization အတွက် ထည့်သွင်း စဉ်းစားခံရမှာ မဟုတ်ပါဘူး။ Aggregate ရဲ့ support functions တွေရဲ့ parallel-safety markings တွေကို planner က ထည့်သွင်း စုံစမ်းခြင်း မရှိဘဲ — aggregate ကိုယ်တိုင်ရဲ့ marking ကိုပဲ ကြည့်တယ်ဆိုတာ သတိပြုပါ။
- **HYPOTHETICAL** — Ordered-set aggregates တွေအတွက်ပဲ ဖြစ်ပြီး — ဒီ flag က — aggregate arguments တွေကို hypothetical-set aggregates တွေအတွက် လိုအပ်ချက်တွေနဲ့အညီ process လုပ်ရမယ်လို့ သတ်မှတ်ပါတယ်: ဆိုလိုတာက — နောက်ဆုံး direct arguments အနည်းငယ်က aggregated (WITHIN GROUP) arguments တွေရဲ့ data types တွေနဲ့ ကိုက်ညီရပါမယ်။ HYPOTHETICAL flag က run-time အပြုအမူအပေါ် သက်ရောက်မှု မရှိဘဲ — aggregate ရဲ့ arguments တွေရဲ့ data types နဲ့ collations တွေကို parse-time မှာ ဆုံးဖြတ်ခြင်းအပေါ်မှာပဲ သက်ရောက်မှု ရှိပါတယ်။

`CREATE AGGREGATE` ရဲ့ parameters တွေကို — အပေါ်မှာ သရုပ်ဖော်ထားတဲ့ (illustrate လုပ်ထားတဲ့) အစဉ်လိုက်တင်မက — ဘယ် အစဉ်လိုက်မဆို ရေးနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

Support function names တွေကို သတ်မှတ်တဲ့ parameters တွေထဲမှာ — လိုအပ်ရင် schema name တစ်ခု ရေးနိုင်ပါတယ် — ဥပမာ `SFUNC = public.sum`။ ဒါပေမယ့် — အဲဒီနေရာမှာ argument types တွေကိုတော့ မရေးပါနဲ့ — support functions တွေရဲ့ argument types တွေကို တခြား parameters တွေကနေ ဆုံးဖြတ်ပါတယ်။

ပုံမှန်အားဖြင့် — PostgreSQL functions တွေက — သူတို့ရဲ့ input values တွေကို မပြုပြင်တဲ့ — true functions (စစ်မှန်သော functions) တွေ ဖြစ်ဖို့ မျှော်လင့်ပါတယ်။ ဒါပေမယ့် — aggregate transition function တစ်ခုက — aggregate တစ်ခုရဲ့ context ထဲမှာ သုံးတဲ့အခါ — သူ့ရဲ့ transition-state argument ကို နေရာမှာတင် (in place) ပြုပြင်ခွင့် ရှိပါတယ်။ ဒါက — transition state ရဲ့ ပုံတူအသစ် (fresh copy) တစ်ခုကို အကြိမ်တိုင်း ပြုလုပ်တာနဲ့ ယှဉ်ရင် — သိသာတဲ့ performance အကျိုးကျေးဇူးတွေ ပေးနိုင်ပါတယ်။

အလားတူပဲ — aggregate final function တစ်ခုက ပုံမှန်အားဖြင့် — သူ့ရဲ့ input values တွေကို မပြုပြင်ဖို့ မျှော်လင့်ခံရပေမယ့် — တခါတရံ — transition-state argument ကို ပြုပြင်တာကို ရှောင်ဖို့ မလွယ်ကူပါဘူး။ ဒီလို အပြုအမူမျိုးကို `FINALFUNC_MODIFY` parameter ကို သုံးပြီး ကြေညာရပါမယ်။ `READ_WRITE` တန်ဖိုးက — final function က transition state ကို — သတ်မှတ်မထားတဲ့ နည်းလမ်းတွေနဲ့ ပြုပြင်တယ်လို့ ညွှန်ပြပါတယ်။ ဒီ တန်ဖိုးက — aggregate ကို window function တစ်ခုအနေနဲ့ သုံးတာကို တားဆီးပြီး — input values တွေနဲ့ transition functions တွေ အတူတူ ရှိတဲ့ aggregate calls တွေအတွက် — transition states တွေ ပေါင်းစည်းခြင်း (merging) ကိုလည်း တားဆီးပါတယ်။ `SHAREABLE` တန်ဖိုးက — final function ပြီးတဲ့ နောက်မှာ transition function ကို ထပ်ပြီး အသုံးချလို့ မရဘူးလို့ ညွှန်ပြပေမယ့် — ပြီးဆုံးတဲ့ transition state value အပေါ်မှာ — final-function calls အများအပြားကို လုပ်ဆောင်လို့ ရပါတယ်။ ဒီ တန်ဖိုးက — aggregate ကို window function တစ်ခုအနေနဲ့ သုံးတာကို တားဆီးပေမယ့် — transition states တွေ ပေါင်းစည်းခြင်းကိုတော့ ခွင့်ပြုပါတယ်။ (ဆိုလိုတာက — ဒီနေရာမှာ စိတ်ဝင်စားစရာ optimization က — final function တစ်ခုတည်းကို ထပ်ခါထပ်ခါ အသုံးချတာ မဟုတ်ဘဲ — ပြီးဆုံးတဲ့ transition state value တစ်ခုတည်းအပေါ်မှာ — final functions မတူညီတာတွေကို အသုံးချတာ ဖြစ်ပါတယ်။ Final functions တစ်ခုခုက `READ_WRITE` လို့ အမှတ်အသား လုပ်ထားခြင်း မရှိသရွေ့ — ဒါကို ခွင့်ပြုပါတယ်။)

Aggregate တစ်ခုက moving-aggregate mode ကို ထောက်ပံ့ပေးရင် — aggregate ကို — moving frame start (ဆိုလိုတာက — `UNBOUNDED PRECEDING` ကလွဲလို့ တခြား frame start mode တစ်ခုခု) ရှိတဲ့ window တစ်ခုအတွက် window function အဖြစ် သုံးတဲ့အခါ — တွက်ချက်မှု ထိရောက်မှုကို မြှင့်တင်ပေးပါလိမ့်မယ်။ သဘောတရားအရ — forward transition function က — input values တွေ window frame ထဲကို အောက်ခြေကနေ ဝင်လာတဲ့အခါ — aggregate ရဲ့ state ထဲ ထပ်ပေါင်းပြီး — inverse transition function က — သူတို့ frame ရဲ့ ထိပ်ကနေ ထွက်သွားတဲ့အခါ — ပြန်ဖယ်ရှားပေးပါတယ်။ ဒါကြောင့် — values တွေကို ဖယ်ရှားတဲ့အခါ — ထပ်ပေါင်းခဲ့တဲ့ အစဉ်အတိုင်းပဲ အမြဲတမ်း ဖယ်ရှားပါတယ်။ Inverse transition function ကို ခေါ်ယူလိုက်တိုင်း — ၎င်းဟာ — အစောဆုံး ထပ်ပေါင်းခဲ့ပြီး — မဖယ်ရှားရသေးတဲ့ argument value(s) တွေကို လက်ခံရပါလိမ့်မယ်။ Inverse transition function က — ၎င်း အသက်အကြီးဆုံး row ကို ဖယ်ရှားပြီးတဲ့ နောက်မှာ — လက်ရှိ state ထဲမှာ row အနည်းဆုံး တစ်ခု ကျန်ရှိနေမယ်လို့ ယူဆနိုင်ပါတယ်။ (ဒီလို မဖြစ်နိုင်တဲ့အခါ — window function mechanism က inverse transition function ကို သုံးမယ့်အစား — aggregation အသစ်တစ်ခုကို ရိုးရိုးလေး စတင်ပါတယ်။)

Moving-aggregate mode အတွက် forward transition function က — state value အသစ်အနေနဲ့ NULL ကို return ပြန်ခွင့် မရှိပါဘူး။ Inverse transition function က NULL ကို return ပြန်ရင် — ဒါက — ဒီ input တစ်ခုချင်းစီအတွက် state calculation ကို ပြန်ပြင် (reverse) လုပ်ဖို့ — inverse function က မတတ်နိုင်ဘူးဆိုတဲ့ အရိပ်အယောင် အဖြစ် ယူဆပြီး — ဒါကြောင့် — aggregate calculation ကို — လက်ရှိ frame ရဲ့ စတင်တဲ့ အနေအထားကနေ — အစအဆုံး (from scratch) ပြန်လုပ်ပါလိမ့်မယ်။ ဒီ စည်းမျဉ်းက — running state value ကနေ ပြန်ပြင် ဖယ်ထုတ်ဖို့ မလွယ်ကူတဲ့ — မကြာခဏ မဟုတ်တဲ့ ကိစ္စတချို့ ရှိနေတဲ့ အခြေအနေတွေမှာ — moving-aggregate mode ကို သုံးနိုင်အောင် ခွင့်ပြုပေးပါတယ်။

Moving-aggregate implementation တစ်ခုကို ပံ့ပိုးမထားဘူးဆိုရင်တောင် — aggregate ကို moving frames တွေနဲ့ သုံးနိုင်ပါသေးတယ် — ဒါပေမယ့် — frame ရဲ့ start ရွေ့လျားတိုင်း — PostgreSQL က aggregation တစ်ခုလုံးကို ပြန်လည် တွက်ချက်ရပါလိမ့်မယ်။ Aggregate က moving-aggregate mode ကို ထောက်ပံ့ပေးတာ မပေးတာ မသက်ဆိုင်ဘဲ — PostgreSQL က — moving frame end တစ်ခုကို — ပြန်လည် တွက်ချက်ခြင်း မရှိဘဲ ကိုင်တွယ်နိုင်တယ်ဆိုတာ သတိပြုပါ; ဒါကို — aggregate ရဲ့ state ထဲ value အသစ်တွေ ဆက်ပြီး ထပ်ပေါင်းခြင်းအားဖြင့် လုပ်ဆောင်ပါတယ်။ ဒါကြောင့်ပဲ — aggregate တစ်ခုကို window function အဖြစ် သုံးတာက — final function က read-only ဖြစ်ဖို့ လိုအပ်တာပါ: ၎င်းက aggregate ရဲ့ state value ကို မပျက်စီးစေရပါဘူး — ဒါမှသာ — frame boundaries တစ်စုံအတွက် aggregate result value တစ်ခု ရရှိပြီးသွားပြီးတဲ့ နောက်မှာတောင် — aggregation ကို ဆက်လုပ်နိုင်လို့ပါ။

Ordered-set aggregates တွေအတွက် syntax က — နောက်ဆုံး direct parameter ရော နောက်ဆုံး aggregated (`WITHIN GROUP`) parameter အတွက်ပါ `VARIADIC` ကို သတ်မှတ်ခွင့် ပြုပါတယ်။ ဒါပေမယ့် — လက်ရှိ implementation က `VARIADIC` သုံးစွဲမှုကို နည်းလမ်း နှစ်မျိုးနဲ့ ကန့်သတ်ထားပါတယ်။ ပထမ — ordered-set aggregates တွေက `VARIADIC "any"` ကိုပဲ သုံးနိုင်ပြီး — တခြား variadic array types တွေ မသုံးနိုင်ပါဘူး။ ဒုတိယ — နောက်ဆုံး direct parameter က `VARIADIC "any"` ဖြစ်နေရင် — aggregated parameter တစ်ခုတည်းပဲ ရှိနိုင်ပြီး — ၎င်းကလည်း `VARIADIC "any"` ဖြစ်ရပါမယ်။ (System catalogs တွေထဲမှာ သုံးတဲ့ representation မှာ — ဒီ parameters နှစ်ခုကို `VARIADIC "any"` item တစ်ခုတည်းအဖြစ် ပေါင်းစည်းထားပါတယ် — ဘာလို့လဲဆိုတော့ pg_proc က `VARIADIC` parameter တစ်ခုထက်ပိုတဲ့ functions တွေကို ကိုယ်စားပြု လုပ်နိုင်စွမ်း မရှိလို့ပါ။) Aggregate က hypothetical-set aggregate ဖြစ်နေရင် — `VARIADIC "any"` parameter နဲ့ ကိုက်ညီတဲ့ direct arguments တွေက hypothetical တွေ ဖြစ်ပြီး — သူ့ရှေ့က parameters တွေက — aggregated arguments တွေနဲ့ ကိုက်ညီဖို့ မလိုအပ်တဲ့ — အပို direct arguments တွေကို ကိုယ်စားပြုပါတယ်။

လောလောဆယ် — ordered-set aggregates တွေက moving-aggregate mode ကို ထောက်ပံ့ဖို့ မလိုအပ်ပါဘူး — ဘာလို့လဲဆိုတော့ သူတို့ကို window functions အဖြစ် သုံးလို့ မရလို့ပါ။

Partial (parallel aggregation အပါအဝင်) aggregation ကို လောလောဆယ် — ordered-set aggregates တွေအတွက် ထောက်ပံ့မထားပါဘူး။ ဒါ့အပြင် — `DISTINCT` ဒါမှမဟုတ် `ORDER BY` clauses တွေ ပါဝင်တဲ့ aggregate calls တွေအတွက်လည်း ဘယ်တော့မှ သုံးမှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒီ semantics တွေကို partial aggregation အတွင်းမှာ ထောက်ပံ့လို့ မရလို့ပါ။

## Examples (ဥပမာများ)

[အပိုင်း 36.12](https://www.postgresql.org/docs/current/xaggr.html) ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE AGGREGATE` က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard က user-defined aggregate functions တွေအတွက် ပံ့ပိုး ပေးခြင်း မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER AGGREGATE](/docs/postgresql/sql-alteraggregate), [DROP AGGREGATE](/docs/postgresql/sql-dropaggregate)
