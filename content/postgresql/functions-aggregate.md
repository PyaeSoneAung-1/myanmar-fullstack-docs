---
title: "Aggregate Functions (Aggregate လုပ်ဆောင်ချက်များ)"
description: "PostgreSQL ၏ aggregate functions များ — general-purpose နှင့် statistical aggregates စာရင်းများ၊ ordered-set နှင့် hypothetical-set aggregates များ၊ grouping operations နှင့် Partial Mode အကြောင်း ဖော်ပြချက်များ"
order: 88
source: "https://www.postgresql.org/docs/current/functions-aggregate.html"
status: translated
updated: 2026-09-04
---

## 9.21. Aggregate Functions (Aggregate လုပ်ဆောင်ချက်များ)

*Aggregate functions* (aggregate လုပ်ဆောင်ချက်များ) တွေက input values အစုတစ်စုကနေ ရလဒ် တစ်ခုတည်းကို တွက်ချက်ပေးပါတယ်။ Built-in general-purpose aggregate functions တွေကို ဇယား 9.62 မှာ လည်းကောင်း — statistical aggregates တွေကို ဇယား 9.63 မှာ လည်းကောင်း — စာရင်းပြုထားပါတယ်။ Built-in within-group ordered-set aggregate functions တွေကို ဇယား 9.64 မှာ လည်းကောင်း — built-in within-group hypothetical-set aggregate functions တွေကို ဇယား 9.65 မှာ လည်းကောင်း — ဖော်ပြထားပါတယ်။ Aggregate functions တွေနဲ့ နီးကပ်စွာ ဆက်စပ်နေတဲ့ grouping operations တွေကိုတော့ ဇယား 9.66 မှာ စာရင်းပြုထားပါတယ်။ Aggregate functions တွေအတွက် အထူး syntax ဆိုင်ရာ ထည့်သွင်း စဉ်းစားချက်တွေကို [အပိုင်း 4.2.7](/docs/postgresql/sql-expressions) မှာ ရှင်းပြထားပြီး — နောက်ထပ် နိဒါန်း အချက်အလက်တွေအတွက် [အပိုင်း 2.7](/docs/postgresql/aggregate) ကို ကြည့်ရှုနိုင်ပါတယ်။

Aggregate functions တွေထဲမှာ *Partial Mode* (တစ်စိတ်တစ်ပိုင်း mode) ကို ထောက်ပံ့တဲ့ function တွေက — parallel aggregation (အပြိုင် စုစည်းခြင်း) လိုမျိုး — optimization (ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ခြင်း) အမျိုးမျိုးမှာ ပါဝင်ဖို့ အရည်အချင်း ရှိပါတယ်။

အောက်မှာ ဖော်ပြထားတဲ့ aggregate တွေ အားလုံးက optional `ORDER BY` clause ကို လက်ခံကြပေမယ့် ([အပိုင်း 4.2.7](/docs/postgresql/sql-expressions) မှာ အကျဉ်းချုပ် ဖော်ပြထားသလို) — ဒီ clause ကို output က ordering ရဲ့ သက်ရောက်မှု ခံရတဲ့ aggregate တွေမှာပဲ ထည့်သွင်းထားပါတယ်။

**ဇယား 9.62. General-Purpose Aggregate Functions (အထွေထွေ သုံးနိုင်သော aggregate လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် | Partial Mode |
| --- | --- |
| any_value ( anyelement ) → same as input type non-null input values တွေထဲကနေ စိတ်ကြိုက် (arbitrary) တန်ဖိုး တစ်ခုကို ပြန်ပေးပါတယ်။ | Yes |
| array_agg ( anynonarray ORDER BY input_sort_columns ) → anyarray input values တွေ အားလုံးကို — null တန်ဖိုးတွေ အပါအဝင် — array တစ်ခုထဲကို စုစည်းပါတယ်။ | Yes |
| array_agg ( anyarray ORDER BY input_sort_columns ) → anyarray input array တွေ အားလုံးကို dimension (အတိုင်းအတာ) တစ်ဆင့် ပိုမြင့်တဲ့ array တစ်ခုအဖြစ် ဆက်စပ် ပေါင်းစပ်ပါတယ်။ (Input တွေ အားလုံးက dimension တူညီရမှာ ဖြစ်ပြီး — empty ဒါမှမဟုတ် null ဖြစ်လို့ မရပါဘူး။) | Yes |
| avg ( smallint ) → numeric avg ( integer ) → numeric avg ( bigint ) → numeric avg ( numeric ) → numeric avg ( real ) → double precision avg ( double precision ) → double precision avg ( interval ) → interval non-null input values တွေ အားလုံးရဲ့ average (arithmetic mean — ပျမ်းမျှ) ကို တွက်ချက်ပါတယ်။ | Yes |
| bit_and ( smallint ) → smallint bit_and ( integer ) → integer bit_and ( bigint ) → bigint bit_and ( bit ) → bit non-null input values တွေ အားလုံးရဲ့ bitwise AND ကို တွက်ချက်ပါတယ်။ | Yes |
| bit_or ( smallint ) → smallint bit_or ( integer ) → integer bit_or ( bigint ) → bigint bit_or ( bit ) → bit non-null input values တွေ အားလုံးရဲ့ bitwise OR ကို တွက်ချက်ပါတယ်။ | Yes |
| bit_xor ( smallint ) → smallint bit_xor ( integer ) → integer bit_xor ( bigint ) → bigint bit_xor ( bit ) → bit non-null input values တွေ အားလုံးရဲ့ bitwise exclusive OR (XOR) ကို တွက်ချက်ပါတယ်။ အစဉ်လိုက် မဟုတ်တဲ့ (unordered) value set တစ်ခုအတွက် checksum အနေနဲ့လည်း အသုံးဝင်နိုင်ပါတယ်။ | Yes |
| bool_and ( boolean ) → boolean non-null input values တွေ အားလုံး true ဖြစ်ရင် true ပြန်ပေးပြီး — မဟုတ်ရင် false ပြန်ပေးပါတယ်။ | Yes |
| bool_or ( boolean ) → boolean non-null input values တွေထဲက တစ်ခုခု true ဖြစ်ရင် true ပြန်ပေးပြီး — မဟုတ်ရင် false ပြန်ပေးပါတယ်။ | Yes |
| count ( * ) → bigint input rows အရေအတွက်ကို တွက်ချက်ပါတယ်။ | Yes |
| count ( "any" ) → bigint input value က null မဟုတ်တဲ့ input rows အရေအတွက်ကို တွက်ချက်ပါတယ်။ | Yes |
| every ( boolean ) → boolean ဒါဟာ SQL standard မှာ `bool_and` နဲ့ ညီမျှတဲ့ ပုံစံ ဖြစ်ပါတယ်။ | Yes |
| json_agg ( anyelement ORDER BY input_sort_columns ) → json  jsonb_agg ( anyelement ORDER BY input_sort_columns ) → jsonb input values တွေ အားလုံးကို — null တန်ဖိုးတွေ အပါအဝင် — JSON array တစ်ခုထဲကို စုစည်းပါတယ်။ Values တွေကို to_json ဒါမှမဟုတ် to_jsonb အတိုင်း JSON အဖြစ် ပြောင်းလဲပါတယ်။ | No |
| json_agg_strict ( anyelement ) → json  jsonb_agg_strict ( anyelement ) → jsonb input values တွေ အားလုံးကို — null တွေကို ကျော်လိုက်ပြီး — JSON array တစ်ခုထဲကို စုစည်းပါတယ်။ Values တွေကို to_json ဒါမှမဟုတ် to_jsonb အတိုင်း JSON အဖြစ် ပြောင်းလဲပါတယ်။ | No |
| json_arrayagg ( [ value_expression ] [ ORDER BY sort_expression ] [ { NULL \| ABSENT } ON NULL ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ]) json_array နဲ့ ပုံစံတူ ပြုမူပါတယ် — ဒါပေမယ့် aggregate function ဖြစ်တာမို့ value_expression parameter တစ်ခုတည်းကိုပဲ ယူပါတယ်။ ABSENT ON NULL လို့ သတ်မှတ်ထားရင် NULL တန်ဖိုးတွေကို ချန်လှပ်လိုက်ပါတယ်။ ORDER BY သတ်မှတ်ထားရင် element တွေက input order အတိုင်း မဟုတ်ဘဲ အဲဒီ order အတိုင်း array ထဲမှာ ပေါ်လာပါတယ်။ SELECT json_arrayagg(v) FROM (VALUES(2),(1)) t(v) → [2, 1] | No |
| json_objectagg ( [ { key_expression { VALUE \| ':' } value_expression } ] [ { NULL \| ABSENT } ON NULL ] [ { WITH \| WITHOUT } UNIQUE [ KEYS ] ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ]) json_object လိုပဲ ပြုမူပါတယ် — ဒါပေမယ့် aggregate function ဖြစ်တာမို့ key_expression တစ်ခုနဲ့ value_expression parameter တစ်ခုစီပဲ ယူပါတယ်။ SELECT json_objectagg(k:v) FROM (VALUES ('a'::text,current_date),('b',current_date + 1)) AS t(k,v) → { "a" : "2022-05-10", "b" : "2022-05-11" } | No |
| json_object_agg ( key "any", value "any" ORDER BY input_sort_columns ) → json  jsonb_object_agg ( key "any", value "any" ORDER BY input_sort_columns ) → jsonb key/value အတွဲတွေ အားလုံးကို JSON object တစ်ခုထဲကို စုစည်းပါတယ်။ Key arguments တွေကို text အဖြစ် အတင်းပြောင်း (coerce) လုပ်ပြီး — value arguments တွေကိုတော့ to_json ဒါမှမဟုတ် to_jsonb အတိုင်း ပြောင်းလဲပါတယ်။ Values တွေ null ဖြစ်လို့ ရပေမယ့် — keys တွေကတော့ မဖြစ်ရပါဘူး။ | No |
| json_object_agg_strict ( key "any", value "any" ) → json  jsonb_object_agg_strict ( key "any", value "any" ) → jsonb key/value အတွဲတွေ အားလုံးကို JSON object တစ်ခုထဲကို စုစည်းပါတယ်။ Key arguments တွေကို text အဖြစ် အတင်းပြောင်း လုပ်ပြီး — value arguments တွေကိုတော့ to_json ဒါမှမဟုတ် to_jsonb အတိုင်း ပြောင်းလဲပါတယ်။ Key က null မဖြစ်ရပါဘူး။ Value က null ဖြစ်ရင်တော့ entry ကို ကျော်လိုက်ပါတယ်၊ | No |
| json_object_agg_unique ( key "any", value "any" ) → json  jsonb_object_agg_unique ( key "any", value "any" ) → jsonb key/value အတွဲတွေ အားလုံးကို JSON object တစ်ခုထဲကို စုစည်းပါတယ်။ Key arguments တွေကို text အဖြစ် အတင်းပြောင်း လုပ်ပြီး — value arguments တွေကိုတော့ to_json ဒါမှမဟုတ် to_jsonb အတိုင်း ပြောင်းလဲပါတယ်။ Values တွေ null ဖြစ်လို့ ရပေမယ့် — keys တွေကတော့ မဖြစ်ရပါဘူး။ Duplicate key ရှိနေရင် error ပစ်ပါတယ်။ | No |
| json_object_agg_unique_strict ( key "any", value "any" ) → json  jsonb_object_agg_unique_strict ( key "any", value "any" ) → jsonb key/value အတွဲတွေ အားလုံးကို JSON object တစ်ခုထဲကို စုစည်းပါတယ်။ Key arguments တွေကို text အဖြစ် အတင်းပြောင်း လုပ်ပြီး — value arguments တွေကိုတော့ to_json ဒါမှမဟုတ် to_jsonb အတိုင်း ပြောင်းလဲပါတယ်။ Key က null မဖြစ်ရပါဘူး။ Value က null ဖြစ်ရင် entry ကို ကျော်လိုက်ပါတယ်။ Duplicate key ရှိနေရင် error ပစ်ပါတယ်။ | No |
| max ( see text ) → same as input type non-null input values တွေထဲက အမြင့်ဆုံး (maximum) တန်ဖိုးကို တွက်ချက်ပါတယ်။ Numeric, string, date/time ဒါမှမဟုတ် enum type အားလုံးအတွက် ရနိုင်ပြီး — bytea, inet, interval, money, oid, pg_lsn, tid, xid8 တွေအပြင် — sortable data types (စီလို့ရတဲ့ data types) တွေ ပါဝင်တဲ့ array နဲ့ composite types တွေအတွက်လည်း ရပါတယ်။ | Yes |
| min ( see text ) → same as input type non-null input values တွေထဲက အနိမ့်ဆုံး (minimum) တန်ဖိုးကို တွက်ချက်ပါတယ်။ Numeric, string, date/time ဒါမှမဟုတ် enum type အားလုံးအတွက် ရနိုင်ပြီး — bytea, inet, interval, money, oid, pg_lsn, tid, xid8 တွေအပြင် — sortable data types (စီလို့ရတဲ့ data types) တွေ ပါဝင်တဲ့ array နဲ့ composite types တွေအတွက်လည်း ရပါတယ်။ | Yes |
| range_agg ( value anyrange ) → anymultirange range_agg ( value anymultirange ) → anymultirange non-null input values တွေရဲ့ union (ပေါင်းစည်းမှု) ကို တွက်ချက်ပါတယ်။ | No |
| range_intersect_agg ( value anyrange ) → anyrange range_intersect_agg ( value anymultirange ) → anymultirange non-null input values တွေရဲ့ intersection (ဖြတ်ဆုံမှု) ကို တွက်ချက်ပါတယ်။ | No |
| string_agg ( value text, delimiter text ) → text string_agg ( value bytea, delimiter bytea ORDER BY input_sort_columns ) → bytea non-null input values တွေကို string တစ်ခုတည်းအဖြစ် ဆက်စပ်ပါတယ်။ ပထမဆုံး value နောက်က value တစ်ခုချင်းစီရဲ့ ရှေ့မှာ — သက်ဆိုင်တဲ့ delimiter (null မဟုတ်ရင်) ကို ထည့်ပေးပါတယ်။ | Yes |
| sum ( smallint ) → bigint sum ( integer ) → bigint sum ( bigint ) → numeric sum ( numeric ) → numeric sum ( real ) → real sum ( double precision ) → double precision sum ( interval ) → interval sum ( money ) → money non-null input values တွေ အားလုံးရဲ့ sum (ပေါင်းလဒ်) ကို တွက်ချက်ပါတယ်။ | Yes |
| xmlagg ( xml ORDER BY input_sort_columns ) → xml non-null XML input values တွေကို ဆက်စပ် ပေါင်းစပ်ပါတယ် (အပိုင်း 9.15.1.8 ကို ကြည့်ပါ)။ | No |

`count` ကလွဲပြီး ဒီ function တွေက row ဘာမှ မရွေးချယ်မိတဲ့အခါ null တန်ဖိုး ပြန်ပေးတာကို သတိပြုသင့်ပါတယ်။ အထူးသဖြင့် — row မရှိတဲ့ `sum` က မျှော်လင့်ထားသလို သုည မဟုတ်ဘဲ null ပြန်ပေးပြီး — `array_agg` ကလည်း input rows မရှိရင် empty array အစား null ပြန်ပေးပါတယ်။ လိုအပ်ရင် `coalesce` function ကို သုံးပြီး null နေရာမှာ သုည ဒါမှမဟုတ် empty array ကို အစားထိုးလို့ ရပါတယ်။

Aggregate functions ဖြစ်တဲ့ `array_agg`, `json_agg`, `jsonb_agg`, `json_agg_strict`, `jsonb_agg_strict`, `json_object_agg`, `jsonb_object_agg`, `json_object_agg_strict`, `jsonb_object_agg_strict`, `json_object_agg_unique`, `jsonb_object_agg_unique`, `json_object_agg_unique_strict`, `jsonb_object_agg_unique_strict`, `string_agg`, `xmlagg` တွေနဲ့ — ဆင်တူတဲ့ user-defined aggregate functions တွေက — input values တွေရဲ့ အစဉ် (order) ပေါ် မူတည်ပြီး သိသိသာသာ ကွဲပြားတဲ့ ရလဒ်တန်ဖိုးတွေ ထုတ်ပေးပါတယ်။ ဒီ ordering က default အားဖြင့် သတ်မှတ်မထားပေမယ့် — [အပိုင်း 4.2.7](/docs/postgresql/sql-expressions) မှာ ပြထားသလို — aggregate call အတွင်းမှာ `ORDER BY` clause ရေးခြင်းဖြင့် ထိန်းချုပ်နိုင်ပါတယ်။ တနည်းအားဖြင့် — sorted subquery တစ်ခုကနေ input values တွေကို ပေးပို့တာကလည်း ပုံမှန်အားဖြင့် အလုပ်ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT xmlagg(x) FROM (SELECT x FROM test ORDER BY y DESC) AS tab;
```

ဒီနည်းလမ်းက outer query level မှာ join လိုမျိုး နောက်ထပ် processing တွေ ပါနေရင် မအောင်မြင်နိုင်တာ သတိပြုပါ — အကြောင်းကတော့ အဲဒါတွေက aggregate မတွက်ခင် subquery ရဲ့ output ကို ပြန်စီစဉ် (reorder) လုပ်မိနိုင်လို့ပါ။

> **မှတ်ချက်:** Boolean aggregate တွေဖြစ်တဲ့ `bool_and` နဲ့ `bool_or` တို့ဟာ standard SQL aggregate တွေဖြစ်တဲ့ `every` နဲ့ `any` သို့မဟုတ် `some` တို့နဲ့ သက်ဆိုင်ပါတယ်။ PostgreSQL က `every` ကို ထောက်ပံ့ပေမယ့် — `any` သို့မဟုတ် `some` ကိုတော့ မထောက်ပံ့ပါဘူး — အကြောင်းကတော့ standard syntax ထဲမှာ မူလကတည်းက ပါနေတဲ့ ambiguity (မရေရာမှု) တစ်ခု ရှိနေလို့ပါ:
> 
> ```sql
> SELECT b1 = ANY((SELECT b2 FROM t2 ...)) FROM t1 ...;
> ```
> 
> ဒီမှာ `ANY` ကို — subquery တစ်ခုကို မိတ်ဆက်နေတာလို့ ဖြစ်စေ — subquery က Boolean value ပါတဲ့ row တစ်ခုကို ပြန်ပေးရင် aggregate function တစ်ခုအနေနဲ့ ဖြစ်စေ — ယူဆနိုင်ပါတယ်။ ဒါကြောင့် ဒီ aggregate တွေကို standard ရဲ့ နာမည်တွေ ပေးလို့ မရပါဘူး။

> **မှတ်ချက်:** တခြား SQL database management system တွေနဲ့ အလုပ်လုပ်ရ ကျင့်သားရနေတဲ့ user တွေအနေနဲ့ — `count` aggregate ကို table တစ်ခုလုံးအပေါ်မှာ သုံးတဲ့အခါ — performance ကို စိတ်ပျက်စရာ ကောင်းနိုင်ပါတယ်။ ဒီလိုမျိုး query တစ်ခု:
> 
> ```sql
> SELECT count(*) FROM sometable;
> ```
> 
> က table ရဲ့ အရွယ်အစား အချိုးကျတဲ့ အားထုတ်မှု (effort) လိုအပ်ပါလိမ့်မယ်: PostgreSQL က table တစ်ခုလုံးကို ဖြစ်စေ — table ထဲက row တွေ အားလုံး ပါဝင်တဲ့ index တစ်ခုလုံးကို ဖြစ်စေ — scan လုပ်ဖို့ လိုအပ်လို့ပါ။

ဇယား 9.63 မှာ statistical analysis (စာရင်းအင်း ခွဲခြမ်းစိတ်ဖြာမှု) တွေမှာ ပုံမှန်အားဖြင့် သုံးလေ့ရှိတဲ့ aggregate functions တွေကို ပြသထားပါတယ်။ (ဒါတွေကို သီးခြား ခွဲထားတာက — ပိုအသုံးများတဲ့ aggregate တွေရဲ့ စာရင်းကို မရှုပ်အောင် ရှောင်ရှားဖို့ပဲ ဖြစ်ပါတယ်။) `numeric_type` ကို လက်ခံတယ်လို့ ပြထားတဲ့ function တွေက `smallint`, `integer`, `bigint`, `numeric`, `real`, `double precision` type တွေ အားလုံးအတွက် ရနိုင်ပါတယ်။ ဖော်ပြချက်ထဲမှာ *N* လို့ ဆိုထားရင် — input expressions တွေ အားလုံး non-null ဖြစ်တဲ့ input rows အရေအတွက်ကို ဆိုလိုပါတယ်။ ကိစ္စ အားလုံးမှာ — တွက်ချက်မှုက အဓိပ္ပာယ် မရှိဘူးဆိုရင် (ဥပမာ *N* က သုည ဖြစ်ရင်) null ပြန်ပေးပါတယ်။

**ဇယား 9.63. Aggregate Functions for Statistics (စာရင်းအင်း aggregate လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် | Partial Mode |
| --- | --- |
| corr ( Y double precision, X double precision ) → double precision correlation coefficient (ဆက်စပ်မှု ကိန်းဂဏန်း) ကို တွက်ချက်ပါတယ်။ | Yes |
| covar_pop ( Y double precision, X double precision ) → double precision population covariance (ဒေတာ တစ်စုလုံးအပေါ် တွက်ချက်သော covariance) ကို တွက်ချက်ပါတယ်။ | Yes |
| covar_samp ( Y double precision, X double precision ) → double precision sample covariance (နမူနာ ဒေတာအပေါ် တွက်ချက်သော covariance) ကို တွက်ချက်ပါတယ်။ | Yes |
| regr_avgx ( Y double precision, X double precision ) → double precision independent variable (လွတ်လပ်သော variable) ရဲ့ average ကို တွက်ချက်ပါတယ် — sum(X)/N ဖြစ်ပါတယ်။ | Yes |
| regr_avgy ( Y double precision, X double precision ) → double precision dependent variable (မှီခိုသော variable) ရဲ့ average ကို တွက်ချက်ပါတယ် — sum(Y)/N ဖြစ်ပါတယ်။ | Yes |
| regr_count ( Y double precision, X double precision ) → bigint input နှစ်ခုလုံး non-null ဖြစ်တဲ့ rows အရေအတွက်ကို တွက်ချက်ပါတယ်။ | Yes |
| regr_intercept ( Y double precision, X double precision ) → double precision (X, Y) အတွဲတွေနဲ့ ဆုံးဖြတ်တဲ့ least-squares-fit (အနည်းဆုံး နှစ်ထပ်ကိန်း ကိုက်ညီမှု) linear equation ရဲ့ y-intercept (y-ဝင်ရိုး ဖြတ်မှတ်) ကို တွက်ချက်ပါတယ်။ | Yes |
| regr_r2 ( Y double precision, X double precision ) → double precision correlation coefficient ရဲ့ နှစ်ထပ်ကိန်း (square) ကို တွက်ချက်ပါတယ်။ | Yes |
| regr_slope ( Y double precision, X double precision ) → double precision (X, Y) အတွဲတွေနဲ့ ဆုံးဖြတ်တဲ့ least-squares-fit linear equation ရဲ့ slope (စောင်း) ကို တွက်ချက်ပါတယ်။ | Yes |
| regr_sxx ( Y double precision, X double precision ) → double precision independent variable ရဲ့ “sum of squares” (နှစ်ထပ်ကိန်းများ ပေါင်းလဒ်) ကို တွက်ချက်ပါတယ် — sum(X^2) - sum(X)^2/N ဖြစ်ပါတယ်။ | Yes |
| regr_sxy ( Y double precision, X double precision ) → double precision independent နဲ့ dependent variable တွေ မြောက်ထားတဲ့ “sum of products” (မြောက်လဒ်များ ပေါင်းလဒ်) ကို တွက်ချက်ပါတယ် — sum(X*Y) - sum(X) * sum(Y)/N ဖြစ်ပါတယ်။ | Yes |
| regr_syy ( Y double precision, X double precision ) → double precision dependent variable ရဲ့ “sum of squares” (နှစ်ထပ်ကိန်းများ ပေါင်းလဒ်) ကို တွက်ချက်ပါတယ် — sum(Y^2) - sum(Y)^2/N ဖြစ်ပါတယ်။ | Yes |
| stddev ( numeric_type ) → double precision for real or double precision, otherwise numeric ဒါဟာ stddev_samp အတွက် သမိုင်းအရ သုံးခဲ့တဲ့ alias (နာမည်ပြောင်) တစ်ခု ဖြစ်ပါတယ်။ | Yes |
| stddev_pop ( numeric_type ) → double precision for real or double precision, otherwise numeric input values တွေရဲ့ population standard deviation (စုစုပေါင်း စံသွေဖည်မှု) ကို တွက်ချက်ပါတယ်။ | Yes |
| stddev_samp ( numeric_type ) → double precision for real or double precision, otherwise numeric input values တွေရဲ့ sample standard deviation (နမူနာ စံသွေဖည်မှု) ကို တွက်ချက်ပါတယ်။ | Yes |
| variance ( numeric_type ) → double precision for real or double precision, otherwise numeric ဒါဟာ var_samp အတွက် သမိုင်းအရ သုံးခဲ့တဲ့ alias (နာမည်ပြောင်) တစ်ခု ဖြစ်ပါတယ်။ | Yes |
| var_pop ( numeric_type ) → double precision for real or double precision, otherwise numeric input values တွေရဲ့ population variance (စုစုပေါင်း ကွဲလွဲမှု — population standard deviation ရဲ့ နှစ်ထပ်ကိန်း) ကို တွက်ချက်ပါတယ်။ | Yes |
| var_samp ( numeric_type ) → double precision for real or double precision, otherwise numeric input values တွေရဲ့ sample variance (နမူနာ ကွဲလွဲမှု — sample standard deviation ရဲ့ နှစ်ထပ်ကိန်း) ကို တွက်ချက်ပါတယ်။ | Yes |

ဇယား 9.64 မှာ *ordered-set aggregate* syntax ကို သုံးတဲ့ aggregate functions တချို့ကို ပြသထားပါတယ်။ ဒီ function တွေကို “inverse distribution” (ပြောင်းပြန် ဖြန့်ဖြူးမှု) functions လို့ တခါတရံ ရည်ညွှန်းလေ့ ရှိပါတယ်။ သူတို့ရဲ့ aggregated input ကို `ORDER BY` နဲ့ မိတ်ဆက်ပြီး — aggregate လုပ်မခံရဘဲ တစ်ခါပဲ တွက်ချက်တဲ့ *direct argument* (တိုက်ရိုက် argument) တစ်ခုကိုလည်း ယူနိုင်ပါတယ်။ ဒီ function တွေ အားလုံးက သူတို့ရဲ့ aggregated input ထဲက null values တွေကို လျစ်လျူရှုပါတယ်။ *fraction* parameter ယူတဲ့ function တွေအတွက် — fraction တန်ဖိုးက 0 နဲ့ 1 ကြားမှာ ရှိရမှာ ဖြစ်ပြီး — မဟုတ်ရင် error ပစ်ပါတယ်။ ဒါပေမယ့် — null *fraction* တန်ဖိုးကတော့ ရိုးရိုး null ရလဒ်ကိုပဲ ထုတ်ပေးပါတယ်။

**ဇယား 9.64. Ordered-Set Aggregate Functions (ordered-set aggregate လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် | Partial Mode |
| --- | --- |
| mode () WITHIN GROUP ( ORDER BY anyelement ) → anyelement aggregated argument ရဲ့ mode (အကြိမ်ရေ အများဆုံး တန်ဖိုး) ကို တွက်ချက်ပါတယ် — အကြိမ်ရေ တူညီတဲ့ တန်ဖိုး အများအပြား ရှိနေရင် ပထမဆုံး တစ်ခုကို စိတ်ကြိုက် ရွေးချယ်ပါတယ်။ Aggregated argument က sortable type (စီလို့ရတဲ့ type) ဖြစ်ရပါမယ်။ | No |
| percentile_cont ( fraction double precision ) WITHIN GROUP ( ORDER BY double precision ) → double precision percentile_cont ( fraction double precision ) WITHIN GROUP ( ORDER BY interval ) → interval continuous percentile ကို တွက်ချက်ပါတယ် — aggregated argument values တွေရဲ့ စီထားပြီးသား အစုထဲမှာ သတ်မှတ်ထားတဲ့ fraction နဲ့ ကိုက်ညီတဲ့ တန်ဖိုး ဖြစ်ပါတယ်။ လိုအပ်ရင် ကပ်လျက် (adjacent) input item တွေကြားမှာ interpolate (ကြားဖြတ် တွက်ချက်) လုပ်ပေးပါလိမ့်မယ်။ | No |
| percentile_cont ( fractions double precision[] ) WITHIN GROUP ( ORDER BY double precision ) → double precision[] percentile_cont ( fractions double precision[] ) WITHIN GROUP ( ORDER BY interval ) → interval[] continuous percentile အများအပြားကို တွက်ချက်ပါတယ်။ ရလဒ်က fractions parameter ရဲ့ dimensions အတိုင်းပဲ ရှိတဲ့ array တစ်ခု ဖြစ်ပြီး — non-null element တစ်ခုချင်းစီကို အဲဒီ percentile နဲ့ ကိုက်ညီတဲ့ (interpolate လုပ်ထားနိုင်တဲ့) တန်ဖိုးနဲ့ အစားထိုးထားပါတယ်။ | No |
| percentile_disc ( fraction double precision ) WITHIN GROUP ( ORDER BY anyelement ) → anyelement discrete percentile ကို တွက်ချက်ပါတယ် — aggregated argument values တွေရဲ့ စီထားပြီးသား အစုထဲမှာ သတ်မှတ်ထားတဲ့ fraction ထက် ညီသည် သို့မဟုတ် ကျော်လွန်တဲ့ အနေအထား (position) မှာ ရှိတဲ့ ပထမဆုံး တန်ဖိုး ဖြစ်ပါတယ်။ Aggregated argument က sortable type ဖြစ်ရပါမယ်။ | No |
| percentile_disc ( fractions double precision[] ) WITHIN GROUP ( ORDER BY anyelement ) → anyarray discrete percentile အများအပြားကို တွက်ချက်ပါတယ်။ ရလဒ်က fractions parameter ရဲ့ dimensions အတိုင်း ရှိတဲ့ array တစ်ခု ဖြစ်ပြီး — non-null element တစ်ခုချင်းစီကို အဲဒီ percentile နဲ့ ကိုက်ညီတဲ့ input value နဲ့ အစားထိုးထားပါတယ်။ Aggregated argument က sortable type ဖြစ်ရပါမယ်။ | No |

ဇယား 9.65 မှာ စာရင်းပြုထားတဲ့ “hypothetical-set” (စိတ်ကူးယဉ် အစု) aggregate တစ်ခုချင်းစီဟာ — [အပိုင်း 9.22](/docs/postgresql/functions-window) မှာ သတ်မှတ်ထားတဲ့ — နာမည်တူ window function တစ်ခုနဲ့ ဆက်စပ်နေပါတယ်။ ကိစ္စ တစ်ခုချင်းစီမှာ — aggregate ရဲ့ ရလဒ်က `sorted_args` တွေနဲ့ ကိုယ်စားပြုထားတဲ့ စီထားပြီးသား row group ထဲကို အဲဒီလို row တစ်ခု ထည့်လိုက်ရင် — `args` ကနေ တည်ဆောက်ထားတဲ့ “hypothetical” row အတွက် — ဆက်စပ်နေတဲ့ window function က ပြန်ပေးမယ့် တန်ဖိုး ဖြစ်ပါတယ်။ ဒီ function တစ်ခုချင်းစီအတွက် — `args` ထဲမှာ ပေးထားတဲ့ direct arguments စာရင်းက `sorted_args` ထဲက aggregated arguments တွေရဲ့ အရေအတွက်နဲ့ type တွေနဲ့ ကိုက်ညီရပါမယ်။ Built-in aggregate အများစုနဲ့ မတူဘဲ — ဒီ aggregate တွေက strict မဟုတ်ပါဘူး — ဆိုလိုတာ null တွေ ပါဝင်တဲ့ input rows တွေကို ဖယ်ပစ်မှာ မဟုတ်ပါဘူး။ Null values တွေကို `ORDER BY` clause ထဲမှာ သတ်မှတ်ထားတဲ့ စည်းမျဉ်းအတိုင်း စီပါတယ်။

**ဇယား 9.65. Hypothetical-Set Aggregate Functions (hypothetical-set aggregate လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် | Partial Mode |
| --- | --- |
| rank ( args ) WITHIN GROUP ( ORDER BY sorted_args ) → bigint hypothetical row ရဲ့ rank ကို — gaps (ကွာဟချက်များ) ပါဝင်လျက် — တွက်ချက်ပါတယ်; ဆိုလိုတာ ၎င်းရဲ့ peer group ထဲက ပထမဆုံး row ရဲ့ row number ပဲ ဖြစ်ပါတယ်။ | No |
| dense_rank ( args ) WITHIN GROUP ( ORDER BY sorted_args ) → bigint hypothetical row ရဲ့ rank ကို — gaps မပါဘဲ — တွက်ချက်ပါတယ်; ဒီ function က peer groups အရေအတွက်ကို ထိရောက်စွာ ရေတွက်ပေးတာပါ။ | No |
| percent_rank ( args ) WITHIN GROUP ( ORDER BY sorted_args ) → double precision hypothetical row ရဲ့ relative rank (နှိုင်းရ rank) ကို တွက်ချက်ပါတယ် — ဆိုလိုတာ (rank - 1) / (total rows - 1) ပါ။ ဒါကြောင့် တန်ဖိုးက 0 ကနေ 1 အထိ (1 ပါဝင်သည်) ရှိပါတယ်။ | No |
| cume_dist ( args ) WITHIN GROUP ( ORDER BY sorted_args ) → double precision cumulative distribution (စုစည်း ဖြန့်ဖြူးမှု) ကို တွက်ချက်ပါတယ် — ဆိုလိုတာ (hypothetical row ရဲ့ ရှေ့က ဒါမှမဟုတ် peer ဖြစ်တဲ့ rows အရေအတွက်) / (total rows) ပါ။ ဒါကြောင့် တန်ဖိုးက 1/N ကနေ 1 အထိ ရှိပါတယ်။ | No |

**ဇယား 9.66. Grouping Operations (grouping လုပ်ဆောင်မှုများ)**

| Function ဖော်ပြချက် |
| --- |
| GROUPING ( group_by_expression(s) ) → integer လက်ရှိ grouping set ထဲမှာ မပါဝင်တဲ့ GROUP BY expressions တွေကို ညွှန်ပြတဲ့ bit mask (bit ပုံစံ အလံ) တစ်ခုကို ပြန်ပေးပါတယ်။ Bits တွေကို ညာဘက်ဆုံး argument က အနည်းဆုံး အရေးပါတဲ့ bit (least-significant bit) နဲ့ ကိုက်ညီအောင် သတ်မှတ်ပါတယ်; bit တစ်ခုချင်းစီက — သက်ဆိုင်တဲ့ expression က လက်ရှိ result row ကို ထုတ်လုပ်ပေးတဲ့ grouping set ရဲ့ grouping criteria ထဲမှာ ပါဝင်ရင် 0 — မပါဝင်ရင် 1 ဖြစ်ပါတယ်။ |

ဇယား 9.66 မှာ ပြထားတဲ့ grouping operations တွေကို — result rows တွေကို ခွဲခြား သိရှိနိုင်ဖို့ — grouping sets တွေနဲ့ တွဲဖက် အသုံးပြုပါတယ် (grouping sets အကြောင်း [အပိုင်း 7.2.4](/docs/postgresql/queries-table-expressions) မှာ ကြည့်ပါ)။ `GROUPING` function ရဲ့ arguments တွေကို တကယ် အကဲဖြတ်တာ မဟုတ်ပေမယ့် — ဆက်စပ်နေတဲ့ query level ရဲ့ `GROUP BY` clause ထဲမှာ ပေးထားတဲ့ expressions တွေနဲ့ အတိအကျ ကိုက်ညီရပါမယ်။ ဥပမာ:

```
=> SELECT * FROM items_sold;
 make  | model | sales
-------+-------+-------
 Foo   | GT    |  10
 Foo   | Tour  |  20
 Bar   | City  |  15
 Bar   | Sport |  5
(4 rows)

=> SELECT make, model, GROUPING(make,model), sum(sales) FROM items_sold GROUP BY ROLLUP(make,model);
 make  | model | grouping | sum
-------+-------+----------+-----
 Foo   | GT    |        0 | 10
 Foo   | Tour  |        0 | 20
 Bar   | City  |        0 | 15
 Bar   | Sport |        0 | 5
 Foo   |       |        1 | 30
 Bar   |       |        1 | 20
       |       |        3 | 50
(7 rows)
```

ဒီမှာ — ပထမ row လေးတန်းထဲက `grouping` တန်ဖိုး `0` က group column နှစ်ခုလုံးအပေါ်မှာ ပုံမှန်အတိုင်း group လုပ်ထားတာကို ပြပါတယ်။ `1` ဆိုတဲ့ တန်ဖိုးက — နောက်ဆုံး row ရဲ့ အရှေ့က နှစ်တန်းမှာ `model` ကို group လုပ်မထားဘူးဆိုတာကို ညွှန်ပြပြီး — `3` ဆိုတဲ့ တန်ဖိုးက — နောက်ဆုံး row မှာ `make` ရော `model` ရော group လုပ်မထားဘူးဆိုတာကို ညွှန်ပြပါတယ် (ဒါကြောင့် အဲဒီ row က input rows အားလုံးအပေါ်မှာ တွက်ချက်ထားတဲ့ aggregate တစ်ခု ဖြစ်ပါတယ်)။
