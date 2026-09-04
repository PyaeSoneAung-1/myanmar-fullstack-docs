---
title: "JSON Functions and Operators (JSON လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "JSON data များကို process လုပ်ခြင်းနှင့် ဖန်တီးခြင်းအတွက် functions နှင့် operators များ — SQL/JSON path language၊ SQL/JSON query functions (JSON_EXISTS, JSON_QUERY, JSON_VALUE) နှင့် JSON_TABLE တို့အကြောင်း"
order: 83
source: "https://www.postgresql.org/docs/current/functions-json.html"
status: translated
updated: 2026-09-04
---

## 9.16. JSON Functions and Operators (JSON လုပ်ဆောင်ချက်များနှင့် operator များ)

- **9.16.1. Processing and Creating JSON Data (JSON data များကို process လုပ်ခြင်းနှင့် ဖန်တီးခြင်း)**
- **9.16.2. The SQL/JSON Path Language (SQL/JSON path language)**
- **9.16.3. SQL/JSON Query Functions (SQL/JSON query functions များ)**
- **9.16.4. JSON_TABLE (JSON_TABLE)**

ဒီ section မှာ အောက်ပါတို့ကို ဖော်ပြထားပါတယ်:

- JSON data တွေကို process လုပ်ခြင်းနဲ့ ဖန်တီးခြင်းအတွက် functions နဲ့ operators များ
- SQL/JSON path language
- SQL/JSON query functions များ

SQL environment ထဲမှာ JSON data types တွေကို native (ဇာတိ) အနေနဲ့ ထောက်ပံ့ပေးနိုင်ဖို့ — PostgreSQL က *SQL/JSON data model* ကို အကောင်အထည် ဖော်ထားပါတယ်။ ဒီ model မှာ items တွေရဲ့ sequence (အစီအစဉ်) တွေ ပါဝင်ပါတယ်။ Item တစ်ခုချင်းစီမှာ — ထပ်ဆောင်း SQL/JSON null value တစ်ခုနဲ့အတူ — SQL scalar values တွေကို သိမ်းထားနိုင်သလို — JSON arrays နဲ့ objects တွေကို သုံးတဲ့ composite data structures (စုပေါင်း data structure များ) တွေလည်း ဖြစ်နိုင်ပါတယ်။ ဒီ model က — JSON specification [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159) ထဲမှာ ရည်ညွှန်းထားတဲ့ (implied) data model ကို တရားဝင် ပုံစံသွင်းထားခြင်း (formalization) တစ်ခု ဖြစ်ပါတယ်။

SQL/JSON က — transaction ထောက်ပံ့မှုနဲ့အတူ — JSON data တွေကို သာမန် SQL data တွေနဲ့ ယှဉ်တွဲ ကိုင်တွယ်နိုင်စေပြီး — အောက်ပါတို့ ပါဝင်ပါတယ်:

- JSON data တွေကို database ထဲကို upload လုပ်ပြီး — character သို့မဟုတ် binary strings အဖြစ် သာမန် SQL columns တွေထဲမှာ သိမ်းဆည်းခြင်း။
- Relational data တွေကနေ JSON objects နဲ့ arrays တွေကို ထုတ်လုပ်ခြင်း (generating)။
- SQL/JSON query functions နဲ့ SQL/JSON path language expressions တွေကို သုံးပြီး JSON data တွေကို query လုပ်ခြင်း။

SQL/JSON standard အကြောင်း ပိုပြီး လေ့လာချင်ရင် [sqltr-19075-6](https://www.postgresql.org/docs/current/biblio.html#SQLTR-19075-6) ကို ကြည့်ပါ။ PostgreSQL မှာ ထောက်ပံ့ထားတဲ့ JSON types တွေရဲ့ အသေးစိတ်အတွက် [အပိုင်း 8.14](/docs/postgresql/datatype-json) ကို ကြည့်ပါ။

### 9.16.1. Processing and Creating JSON Data (JSON data များကို process လုပ်ခြင်းနှင့် ဖန်တီးခြင်း)

JSON data types တွေနဲ့ တွဲသုံးလို့ ရတဲ့ operators တွေကို ဇယား 9.47 မှာ ပြထားပါတယ် ([အပိုင်း 8.14](/docs/postgresql/datatype-json) ကိုလည်း ကြည့်ပါ)။ ဒါတွေအပြင် — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ သာမန် comparison operators တွေကိုလည်း `json` အတွက် မဟုတ်ဘဲ — `jsonb` အတွက်တော့ သုံးလို့ ရပါတယ်။ ဒီ comparison operators တွေက [အပိုင်း 8.14.4](/docs/postgresql/datatype-json) မှာ ဖော်ပြထားတဲ့ B-tree operations အတွက် ordering rules (စီစဉ်မှု စည်းမျဉ်းများ) အတိုင်း လိုက်နာပါတယ်။ Record values တွေကို JSON အဖြစ် စုစည်းပေးတဲ့ aggregate function `json_agg`၊ value pair တွေကို JSON object တစ်ခုအဖြစ် စုစည်းပေးတဲ့ aggregate function `json_object_agg` နဲ့ သူတို့ရဲ့ `jsonb` နဲ့ ညီမျှတဲ့ `jsonb_agg` နဲ့ `jsonb_object_agg` တို့အတွက် [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) ကိုလည်း ကြည့်ပါ။

**ဇယား 9.47. json နှင့် jsonb Operators**

| Operator | Description | Example(s) |
| --- | --- | --- |
|  json -> integer → json jsonb -> integer → jsonb | JSON array ရဲ့ n မြောက် element ကို ထုတ်ယူပါတယ် (array elements တွေကို သုညကနေ စတင် index လုပ်ပြီး — negative integers တွေကတော့ နောက်ဆုံးကနေ ရေတွက်ပါတယ်)။ | '[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> 2 → {"c":"baz"} '[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> -3 → {"a":"foo"} |
|  json -> text → json jsonb -> text → jsonb | ပေးထားတဲ့ key ပါတဲ့ JSON object field ကို ထုတ်ယူပါတယ်။ | '{"a": {"b":"foo"}}'::json -> 'a' → {"b":"foo"} |
|  json ->> integer → text jsonb ->> integer → text | JSON array ရဲ့ n မြောက် element ကို text အဖြစ် ထုတ်ယူပါတယ်။ | '[1,2,3]'::json ->> 2 → 3 |
|  json ->> text → text jsonb ->> text → text | ပေးထားတဲ့ key ပါတဲ့ JSON object field ကို text အဖြစ် ထုတ်ယူပါတယ်။ | '{"a":1,"b":2}'::json ->> 'b' → 2 |
|  json #> text[] → json jsonb #> text[] → jsonb | သတ်မှတ်ထားတဲ့ path မှာရှိတဲ့ JSON sub-object ကို ထုတ်ယူပါတယ် — path elements တွေက field keys ဖြစ်စေ၊ array indexes တွေ ဖြစ်စေ နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။ | '{"a": {"b": ["foo","bar"]}}'::json #> '{a,b,1}' → "bar" |
|  json #>> text[] → text jsonb #>> text[] → text | သတ်မှတ်ထားတဲ့ path မှာရှိတဲ့ JSON sub-object ကို text အဖြစ် ထုတ်ယူပါတယ်။ | '{"a": {"b": ["foo","bar"]}}'::json #>> '{a,b,1}' → bar |

> **မှတ်ချက်:** Field/element/path extraction operators တွေက — JSON input မှာ request နဲ့ ကိုက်ညီမယ့် structure မရှိဘူးဆိုရင် (ဥပမာ — အဲဒီလို key သို့မဟုတ် array element မရှိဘူးဆိုရင်) — error တက်စေမယ့်အစား NULL ကို ပြန်ပေးပါတယ်။

ဇယား 9.48 မှာ ပြထားတဲ့အတိုင်း — `jsonb` အတွက်ပဲ ရှိတဲ့ operators နောက်ထပ် တချို့လည်း ရှိပါသေးတယ်။ Index လုပ်ထားတဲ့ `jsonb` data တွေကို ထိရောက်စွာ ရှာဖွေဖို့ ဒီ operators တွေကို ဘယ်လို သုံးနိုင်တယ်ဆိုတာကို [အပိုင်း 8.14.4](/docs/postgresql/datatype-json) မှာ ဖော်ပြထားပါတယ်။

**ဇယား 9.48. ထပ်ဆောင်း jsonb Operators**

| Operator | Description | Example(s) |
| --- | --- | --- |
|  jsonb @> jsonb → boolean | ပထမ JSON value ထဲမှာ ဒုတိယ JSON value ပါဝင်နေသလား? (Containment — အထဲမှာ ပါဝင်မှု — အကြောင်း အသေးစိတ်အတွက် Section 8.14.3 ကို ကြည့်ပါ။) | '{"a":1, "b":2}'::jsonb @> '{"b":2}'::jsonb → t |
|  jsonb <@ jsonb → boolean | ပထမ JSON value က ဒုတိယ JSON value ထဲမှာ ပါဝင်နေသလား? | '{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb → t |
|  jsonb ? text → boolean | ဒီ text string က JSON value ထဲမှာ top-level key သို့မဟုတ် array element အနေနဲ့ တည်ရှိနေသလား? | '{"a":1, "b":2}'::jsonb ? 'b' → t '["a", "b", "c"]'::jsonb ? 'b' → t |
|  jsonb ?\| text[] → boolean | Text array ထဲက string တွေထဲမှာ တစ်ခုခုက top-level key သို့မဟုတ် array element အနေနဲ့ တည်ရှိနေသလား? | '{"a":1, "b":2, "c":3}'::jsonb ?\| array['b', 'd'] → t |
|  jsonb ?& text[] → boolean | Text array ထဲက string တွေ အားလုံးက top-level key သို့မဟုတ် array element အနေနဲ့ တည်ရှိနေသလား? | '["a", "b", "c"]'::jsonb ?& array['a', 'b'] → t |
|  jsonb \|\| jsonb → jsonb | jsonb values နှစ်ခုကို ဆက်စပ်ပေါင်းစည်းပါတယ် (concatenate)။ Arrays နှစ်ခုကို ဆက်စပ်ရင် — input တစ်ခုချင်းစီရဲ့ elements တွေ အားလုံး ပါဝင်တဲ့ array တစ်ခု ထွက်လာပါတယ်။ Objects နှစ်ခုကို ဆက်စပ်ရင် — သူတို့ရဲ့ keys တွေရဲ့ ပေါင်းစည်းမှု (union) ပါဝင်တဲ့ object တစ်ခု ထွက်လာပြီး — duplicate keys တွေ ရှိနေရင် ဒုတိယ object ရဲ့ value ကို ယူပါတယ်။ ကျန်တဲ့ ကိစ္စတွေမှာတော့ — array မဟုတ်တဲ့ input ကို element တစ်ခုတည်းပါတဲ့ array အဖြစ် ပြောင်းပြီး — array နှစ်ခုအတွက် စည်းမျဉ်းအတိုင်း ဆက်လုပ်ပါတယ်။ Recursive (ထပ်ခါထပ်ခါ) အလုပ်မလုပ်ပါဘူး: top-level array သို့မဟုတ် object structure ကိုပဲ ပေါင်းစည်းပေးတာပါ။ Array တစ်ခုကို နောက် array တစ်ခုထဲ entry တစ်ခုတည်းအနေနဲ့ ထည့်ချင်ရင်တော့ — array ကို နောက်ထပ် array layer တစ်ခုနဲ့ ပတ်ပြီး ဥပမာ: '[1, 2]'::jsonb \|\| jsonb_build_array('[3, 4]'::jsonb) → [1, 2, [3, 4]] | '["a", "b"]'::jsonb \|\| '["a", "d"]'::jsonb → ["a", "b", "a", "d"] '{"a": "b"}'::jsonb \|\| '{"c": "d"}'::jsonb → {"a": "b", "c": "d"} '[1, 2]'::jsonb \|\| '3'::jsonb → [1, 2, 3] '{"a": "b"}'::jsonb \|\| '42'::jsonb → [{"a": "b"}, 42] |
|  jsonb - text → jsonb | JSON object တစ်ခုကနေ key (နဲ့ ၎င်းရဲ့ value) တစ်ခုကို ဖျက်ပစ်တာ ဒါမှမဟုတ် — JSON array တစ်ခုကနေ ကိုက်ညီတဲ့ string value(s) တွေကို ဖျက်ပစ်တာပါ။ | '{"a": "b", "c": "d"}'::jsonb - 'a' → {"c": "d"} '["a", "b", "c", "b"]'::jsonb - 'b' → ["a", "c"] |
|  jsonb - text[] → jsonb | Left operand ကနေ ကိုက်ညီတဲ့ keys သို့မဟုတ် array elements တွေ အားလုံးကို ဖျက်ပစ်ပါတယ်။ | '{"a": "b", "c": "d"}'::jsonb - '{a,c}'::text[] → {} |
|  jsonb - integer → jsonb | သတ်မှတ်ထားတဲ့ index ရှိတဲ့ array element ကို ဖျက်ပစ်ပါတယ် (negative integers တွေက နောက်ဆုံးကနေ ရေတွက်ပါတယ်)။ JSON value က array မဟုတ်ဘူးဆိုရင် error တက်ပါတယ်။ | '["a", "b"]'::jsonb - 1 → ["a"] |
|  jsonb #- text[] → jsonb | သတ်မှတ်ထားတဲ့ path မှာရှိတဲ့ field သို့မဟုတ် array element ကို ဖျက်ပစ်ပါတယ် — path elements တွေက field keys ဖြစ်စေ၊ array indexes တွေ ဖြစ်စေ နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။ | '["a", {"b":1}]'::jsonb #- '{1,b}' → ["a", {}] |
|  jsonb @? jsonpath → boolean | ဒီ JSON path က သတ်မှတ်ထားတဲ့ JSON value အတွက် item တစ်ခုခုကို ပြန်ပေးသလား? (ဒါက SQL-standard JSON path expressions တွေအတွက်ပဲ အသုံးဝင်ပါတယ် — predicate check expressions တွေက တန်ဖိုးတစ်ခုကို အမြဲ ပြန်ပေးလို့ သူတို့အတွက် မဟုတ်ပါဘူး။) | '{"a":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ > 2)' → t |
|  jsonb @@ jsonpath → boolean | သတ်မှတ်ထားတဲ့ JSON value အတွက် JSON path predicate check ရဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။ (ဒါက predicate check expressions တွေအတွက်ပဲ အသုံးဝင်ပါတယ် — SQL-standard JSON path expressions တွေအတွက် မဟုတ်ပါဘူး — path ရဲ့ ရလဒ်က boolean value တစ်ခုတည်း မဟုတ်ဘူးဆိုရင် NULL ပြန်ပေးလို့ပါ။) | '{"a":[1,2,3,4,5]}'::jsonb @@ '$.a[*] > 2' → t |

> **မှတ်ချက်:** `jsonpath` operators `@?` နဲ့ `@@` တွေက အောက်ပါ error တွေကို ဖိနှိပ်ပေးပါတယ်: object field သို့မဟုတ် array element ပျောက်ဆုံးနေခြင်း၊ မမျှော်လင့်ထားတဲ့ JSON item type၊ datetime နဲ့ numeric errors တွေပါ။ အောက်မှာ ဖော်ပြမယ့် `jsonpath` ဆိုင်ရာ functions တွေကိုလည်း ဒီလို error အမျိုးအစားတွေကို ဖိနှိပ်ဖို့ ပြောလို့ ရပါတယ်။ Structure အမျိုးမျိုး ပြောင်းလဲနေတဲ့ JSON document collections တွေကို ရှာဖွေတဲ့အခါ ဒီအပြုအမူက အသုံးဝင်နိုင်ပါတယ်။


ဇယား 9.49 က `json` နဲ့ `jsonb` values တွေကို တည်ဆောက်ဖို့ ရနိုင်တဲ့ functions တွေကို ပြထားပါတယ်။ ဒီဇယားထဲက function တချို့မှာ `RETURNING` clause ပါဝင်ပြီး — အဲဒါက ပြန်ပေးမယ့် data type ကို သတ်မှတ်ပါတယ်။ ၎င်းက `json`, `jsonb`, `bytea`, character string type တစ်ခု (`text`, `char`, ဒါမှမဟုတ် `varchar`) ဒါမှမဟုတ် `json` ဆီ cast လုပ်လို့ ရတဲ့ type တစ်ခု ဖြစ်ရပါမယ်။ Default အနေနဲ့တော့ `json` type ကို ပြန်ပေးပါတယ်။

**ဇယား 9.49. JSON Creation Functions**

| Operator | Description | Example(s) |
| --- | --- | --- |
|  to_json ( anyelement ) → json  to_jsonb ( anyelement ) → jsonb | မည်သည့် SQL value ကိုမဆို json သို့မဟုတ် jsonb အဖြစ် ပြောင်းပေးပါတယ်။ Arrays နဲ့ composites တွေကို recursive (ထပ်ခါထပ်ခါ) အနေနဲ့ arrays နဲ့ objects တွေအဖြစ် ပြောင်းပေးပါတယ် (multidimensional arrays တွေက JSON ထဲမှာ arrays တွေရဲ့ array တွေ ဖြစ်သွားပါတယ်)။ မဟုတ်ရင် — SQL data type ကနေ json ကို cast ရှိနေရင် — အဲဒီ cast function ကို သုံးပြီး conversion လုပ်ပါတယ်;[a] မရှိဘူးဆိုရင်တော့ scalar JSON value တစ်ခု ထုတ်လုပ်ပေးပါတယ်။ ဂဏန်း၊ Boolean ဒါမှမဟုတ် null value မဟုတ်တဲ့ ဘယ် scalar အတွက်မဆို — valid JSON string value ဖြစ်အောင် လိုအပ်သလို escaping လုပ်ပြီး — text representation ကို သုံးပါတယ်။ | to_json('Fred said "Hi."'::text) → "Fred said \"Hi.\"" to_jsonb(row(42, 'Fred said "Hi."'::text)) → {"f1": 42, "f2": "Fred said \"Hi.\""} |
|  array_to_json ( anyarray [, boolean ] ) → json | SQL array တစ်ခုကို JSON array အဖြစ် ပြောင်းပေးပါတယ်။ Optional boolean parameter က true ဆိုရင် top-level array elements တွေကြားမှာ line feeds တွေ ထည့်ပေးတာကလွဲလို့ — အပြုအမူက to_json နဲ့ အတူတူပါပဲ။ | array_to_json('{{1,5},{99,100}}'::int[]) → [[1,5],[99,100]] |
|  json_array ( [ { value_expression [ FORMAT JSON ] } [, ...] ] [ { NULL \| ABSENT } ON NULL ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ]) json_array ( [ query_expression ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ]) | value_expression parameters တစ်စု ဒါမှမဟုတ် — column တစ်ခုတည်း ပြန်ပေးတဲ့ SELECT query တစ်ခု ဖြစ်ရမယ့် — query_expression ရဲ့ ရလဒ်တွေကနေ JSON array တစ်ခုကို တည်ဆောက်ပါတယ်။ ABSENT ON NULL သတ်မှတ်ထားရင် NULL values တွေကို လျစ်လျူရှုပါတယ်။ query_expression သုံးထားရင် အမြဲတမ်း ဒီလိုပဲ ဖြစ်ပါတယ်။ | json_array(1,true,json '{"a":null}') → [1, true, {"a":null}] json_array(SELECT * FROM (VALUES(1),(2)) t) → [1, 2] |
|  row_to_json ( record [, boolean ] ) → json | SQL composite value တစ်ခုကို JSON object အဖြစ် ပြောင်းပေးပါတယ်။ Optional boolean parameter က true ဆိုရင် top-level elements တွေကြားမှာ line feeds တွေ ထည့်ပေးတာကလွဲလို့ — အပြုအမူက to_json နဲ့ အတူတူပါပဲ။ | row_to_json(row(1,'foo')) → {"f1":1,"f2":"foo"} |
|  json_build_array ( VARIADIC "any" ) → json  jsonb_build_array ( VARIADIC "any" ) → jsonb | Variadic argument list တစ်ခုကနေ — type အမျိုးမျိုး ရောနှောနိုင်တဲ့ (possibly-heterogeneously-typed) — JSON array တစ်ခုကို တည်ဆောက်ပါတယ်။ Argument တစ်ခုချင်းစီကို to_json သို့မဟုတ် to_jsonb အတိုင်း ပြောင်းပါတယ်။ | json_build_array(1, 2, 'foo', 4, 5) → [1, 2, "foo", 4, 5] |
|  json_build_object ( VARIADIC "any" ) → json  jsonb_build_object ( VARIADIC "any" ) → jsonb | Variadic argument list တစ်ခုကနေ JSON object တစ်ခုကို တည်ဆောက်ပါတယ်။ သဘောတူညီချက်အရ — argument list မှာ keys နဲ့ values တွေ အလှည့်ကျ ပါဝင်ပါတယ်။ Key arguments တွေကို text အဖြစ် အတင်း ပြောင်း (coerce) ပြီး — value arguments တွေကိုတော့ to_json သို့မဟုတ် to_jsonb အတိုင်း ပြောင်းပါတယ်။ | json_build_object('foo', 1, 2, row(3,'bar')) → {"foo" : 1, "2" : {"f1":3,"f2":"bar"}} |
|  json_object ( [ { key_expression { VALUE \| ':' } value_expression [ FORMAT JSON [ ENCODING UTF8 ] ] }[, ...] ] [ { NULL \| ABSENT } ON NULL ] [ { WITH \| WITHOUT } UNIQUE [ KEYS ] ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ]) | ပေးထားတဲ့ key/value pairs တွေ အားလုံး ပါဝင်တဲ့ JSON object တစ်ခုကို တည်ဆောက်ပါတယ် — တစ်ခုမှ မပေးထားရင် empty object ဖြစ်ပါတယ်။ key_expression က JSON key ကို သတ်မှတ်ပေးတဲ့ scalar expression ဖြစ်ပြီး — text type အဖြစ် ပြောင်းပါတယ်။ ၎င်းက NULL ဖြစ်လို့ မရသလို — json type ဆီ cast ရှိတဲ့ type တစ်ခုခုထဲကလည်း ဖြစ်လို့ မရပါဘူး။ WITH UNIQUE KEYS သတ်မှတ်ထားရင် — duplicate key_expression တွေ မရှိရပါဘူး။ ABSENT ON NULL သတ်မှတ်ထားရင် — value_expression က NULL လို့ အကဲဖြတ်တဲ့ pair တိုင်းကို output ကနေ ချန်လှပ်ပစ်ပါတယ်; NULL ON NULL သတ်မှတ်ထားရင် ဒါမှမဟုတ် clause ကို ချန်လိုက်ရင်တော့ — key ကို value NULL နဲ့အတူ ထည့်သွင်းပါတယ်။ | json_object('code' VALUE 'P123', 'title': 'Jaws') → {"code" : "P123", "title" : "Jaws"} |
|  json_object ( text[] ) → json  jsonb_object ( text[] ) → jsonb | Text array တစ်ခုကနေ JSON object တစ်ခုကို တည်ဆောက်ပါတယ်။ Array က — dimension တစ်ခုတည်း ဖြစ်ပြီး member အရေအတွက် ကိန်းဂဏန်း (even) ဖြစ်ရပါမယ် — အဲဒီအခါ အလှည့်ကျ key/value pairs အဖြစ် ယူပါတယ် — ဒါမှမဟုတ် inner array တစ်ခုချင်းစီမှာ element အတိအကျ နှစ်ခု ပါတဲ့ dimension နှစ်ခု ဖြစ်ရပါမယ် — အဲဒီအခါ key/value pair အဖြစ် ယူပါတယ်။ Values တွေ အားလုံးကို JSON strings အဖြစ် ပြောင်းပါတယ်။ | json_object('{a, 1, b, "def", c, 3.5}') → {"a" : "1", "b" : "def", "c" : "3.5"} json_object('{{a, 1}, {b, "def"}, {c, 3.5}}') → {"a" : "1", "b" : "def", "c" : "3.5"} |
|  json_object ( keys text[], values text[] ) → json jsonb_object ( keys text[], values text[] ) → jsonb | ဒီ json_object ပုံစံက keys နဲ့ values တွေကို သီးခြား text arrays နှစ်ခုကနေ တစ်စုံစီ (pairwise) ယူပါတယ်။ ကျန်တဲ့ အချက်တွေကတော့ argument တစ်ခုတည်း ပုံစံနဲ့ အတူတူပါပဲ။ | json_object('{a,b}', '{1,2}') → {"a": "1", "b": "2"} |
|  json ( expression [ FORMAT JSON [ ENCODING UTF8 ]] [ { WITH \| WITHOUT } UNIQUE [ KEYS ]] ) → json | text ဒါမှမဟုတ် bytea string (UTF8 encoding နဲ့) အနေနဲ့ သတ်မှတ်ထားတဲ့ expression တစ်ခုကို JSON value အဖြစ် ပြောင်းပေးပါတယ်။ expression က NULL ဆိုရင် SQL null value ကို ပြန်ပေးပါတယ်။ WITH UNIQUE သတ်မှတ်ထားရင် — expression ထဲမှာ duplicate object keys တွေ မပါဝင်ရပါဘူး။ | json('{"a":123, "b":[true,"foo"], "a":"bar"}') → {"a":123, "b":[true,"foo"], "a":"bar"} |
|  json_scalar ( expression ) | ပေးထားတဲ့ SQL scalar value တစ်ခုကို JSON scalar value အဖြစ် ပြောင်းပေးပါတယ်။ Input က NULL ဆိုရင် SQL null ကို ပြန်ပေးပါတယ်။ Input က ဂဏန်း သို့မဟုတ် boolean value ဆိုရင် — သက်ဆိုင်တဲ့ JSON number သို့မဟုတ် boolean value ကို ပြန်ပေးပါတယ်။ တခြား value တစ်ခုခုအတွက်တော့ JSON string ကို ပြန်ပေးပါတယ်။ | json_scalar(123.45) → 123.45 json_scalar(CURRENT_TIMESTAMP) → "2022-05-10T10:51:04.62128-04:00" |
|  json_serialize ( expression [ FORMAT JSON [ ENCODING UTF8 ] ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ] ) | SQL/JSON expression တစ်ခုကို character သို့မဟုတ် binary string အဖြစ် ပြောင်းပေးပါတယ်။ Expression က JSON type တစ်ခုခု၊ character string type တစ်ခုခု ဒါမှမဟုတ် UTF8 encoding ရဲ့ bytea ဖြစ်နိုင်ပါတယ်။ RETURNING ထဲမှာ သုံးတဲ့ ပြန်ပေးတဲ့ type က character string type တစ်ခုခု ဒါမှမဟုတ် bytea ဖြစ်နိုင်ပါတယ်။ Default ကတော့ text ပါ။ | json_serialize('{ "a" : 1 } ' RETURNING bytea) → \x7b20226122203a2031207d20 |

---

[a] ဥပမာ — hstore extension မှာ hstore ကနေ json ကို cast တစ်ခု ရှိလို့ — JSON creation functions တွေကနေတစ်ဆင့် ပြောင်းလိုက်တဲ့ hstore values တွေကို — primitive string values အဖြစ် မဟုတ်ဘဲ — JSON objects အဖြစ် ကိုယ်စားပြုပါတယ်။

JSON ကို စမ်းသပ်ခြင်းအတွက် SQL/JSON ထောက်ပံ့မှုတွေကို ဇယား 9.50 မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

**ဇယား 9.50. SQL/JSON Testing Functions**

| Operator | Description | Example(s) |
| --- | --- | --- |
|  expression IS [ NOT ] JSON [ { VALUE \| SCALAR \| ARRAY \| OBJECT } ] [ { WITH \| WITHOUT } UNIQUE [ KEYS ] ] | ဒီ predicate က expression ကို — သတ်မှတ်ထားတဲ့ type တစ်ခုခုနဲ့ ဖြစ်နိုင်တဲ့ — JSON အဖြစ် parse လုပ်လို့ ရ/မရ စမ်းသပ်ပါတယ်။ SCALAR, ARRAY ဒါမှမဟုတ် OBJECT သတ်မှတ်ထားရင် — JSON က အဲဒီ type တစ်မျိုးမျိုးနဲ့ ကိုက်ညီမှု ရှိ/မရှိ စမ်းသပ်တာပါ။ WITH UNIQUE KEYS သတ်မှတ်ထားရင် — expression ထဲက object တိုင်းကို duplicate keys ရှိ/မရှိပါ စစ်ဆေးပါတယ်။ | SELECT js,   js IS JSON "json?",   js IS JSON SCALAR "scalar?",   js IS JSON OBJECT "object?",   js IS JSON ARRAY "array?" FROM (VALUES       ('123'), ('"abc"'), ('{"a": "b"}'), ('[1,2]'),('abc')) foo(js);      js     \| json? \| scalar? \| object? \| array? ------------+-------+---------+---------+--------  123        \| t     \| t       \| f       \| f  "abc"      \| t     \| t       \| f       \| f  {"a": "b"} \| t     \| f       \| t       \| f  [1,2]      \| t     \| f       \| f       \| t  abc        \| f     \| f       \| f       \| f   SELECT js,   js IS JSON OBJECT "object?",   js IS JSON ARRAY "array?",   js IS JSON ARRAY WITH UNIQUE KEYS "array w. UK?",   js IS JSON ARRAY WITHOUT UNIQUE KEYS "array w/o UK?" FROM (VALUES ('[{"a":"1"},  {"b":"2","b":"3"}]')) foo(js); -[ RECORD 1 ]-+-------------------- js            \| [{"a":"1"},        +               \|  {"b":"2","b":"3"}] object?       \| f array?        \| t array w. UK?  \| f array w/o UK? \| t |

`json` နဲ့ `jsonb` values တွေကို process လုပ်ဖို့ ရနိုင်တဲ့ functions တွေကို ဇယား 9.51 မှာ ပြထားပါတယ်။

**ဇယား 9.51. JSON Processing Functions**

| Operator | Description | Example(s) |
| --- | --- | --- |
|  json_array_elements ( json ) → setof json  jsonb_array_elements ( jsonb ) → setof jsonb | Top-level JSON array ကို JSON values အစုတစ်ခု (set) အနေနဲ့ ချဲ့ထွက်ပါတယ်။ | select * from json_array_elements('[1,true, [2,false]]') →     value -----------  1  true  [2,false] |
|  json_array_elements_text ( json ) → setof text  jsonb_array_elements_text ( jsonb ) → setof text | Top-level JSON array ကို text values အစုတစ်ခု အနေနဲ့ ချဲ့ထွက်ပါတယ်။ | select * from json_array_elements_text('["foo", "bar"]') →     value -----------  foo  bar |
|  json_array_length ( json ) → integer  jsonb_array_length ( jsonb ) → integer | Top-level JSON array ထဲက element အရေအတွက်ကို ပြန်ပေးပါတယ်။ | json_array_length('[1,2,3,{"f1":1,"f2":[5,6]},4]') → 5 jsonb_array_length('[]') → 0 |
|  json_each ( json ) → setof record ( key text, value json )  jsonb_each ( jsonb ) → setof record ( key text, value jsonb ) | Top-level JSON object ကို key/value pairs အစုတစ်ခု အနေနဲ့ ချဲ့ထွက်ပါတယ်။ | select * from json_each('{"a":"foo", "b":"bar"}') →   key \| value -----+-------  a   \| "foo"  b   \| "bar" |
|  json_each_text ( json ) → setof record ( key text, value text )  jsonb_each_text ( jsonb ) → setof record ( key text, value text ) | Top-level JSON object ကို key/value pairs အစုတစ်ခု အနေနဲ့ ချဲ့ထွက်ပါတယ်။ ပြန်ပေးတဲ့ values တွေက text type ဖြစ်ပါလိမ့်မယ်။ | select * from json_each_text('{"a":"foo", "b":"bar"}') →   key \| value -----+-------  a   \| foo  b   \| bar |
|  json_extract_path ( from_json json, VARIADIC path_elems text[] ) → json  jsonb_extract_path ( from_json jsonb, VARIADIC path_elems text[] ) → jsonb | သတ်မှတ်ထားတဲ့ path မှာရှိတဲ့ JSON sub-object ကို ထုတ်ယူပါတယ်။ (ဒါက #> operator နဲ့ လုပ်ဆောင်ချက်အရ ညီမျှပါတယ် — ဒါပေမယ့် path ကို variadic list အနေနဲ့ ရေးတာက ကိစ္စတချို့မှာ ပိုအဆင်ပြေနိုင်ပါတယ်။) | json_extract_path('{"f2":{"f3":1},"f4":{"f5":99,"f6":"foo"}}', 'f4', 'f6') → "foo" |
|  json_extract_path_text ( from_json json, VARIADIC path_elems text[] ) → text  jsonb_extract_path_text ( from_json jsonb, VARIADIC path_elems text[] ) → text | သတ်မှတ်ထားတဲ့ path မှာရှိတဲ့ JSON sub-object ကို text အဖြစ် ထုတ်ယူပါတယ်။ (ဒါက #>> operator နဲ့ လုပ်ဆောင်ချက်အရ ညီမျှပါတယ်။) | json_extract_path_text('{"f2":{"f3":1},"f4":{"f5":99,"f6":"foo"}}', 'f4', 'f6') → foo |
|  json_object_keys ( json ) → setof text  jsonb_object_keys ( jsonb ) → setof text | Top-level JSON object ထဲက keys အစုကို ပြန်ပေးပါတယ်။ | select * from json_object_keys('{"f1":"abc","f2":{"f3":"a", "f4":"b"}}') →   json_object_keys ------------------  f1  f2 |
|  json_populate_record ( base anyelement, from_json json ) → anyelement  jsonb_populate_record ( base anyelement, from_json jsonb ) → anyelement | Top-level JSON object ကို — base argument ရဲ့ composite type ရှိတဲ့ — row တစ်တန်းအဖြစ် ချဲ့ထွက်ပါတယ်။ JSON object ထဲမှာ — output row type ရဲ့ column names တွေနဲ့ နာမည်ကိုက်ညီတဲ့ fields တွေကို ရှာဖွေပြီး — သူတို့ရဲ့ values တွေကို အဲဒီ output columns တွေထဲ ထည့်သွင်းပါတယ်။ (ဘယ် output column name နဲ့မှ မကိုက်ညီတဲ့ fields တွေကို လျစ်လျူရှုပါတယ်။) ပုံမှန် အသုံးပြုမှုမှာ base ရဲ့ တန်ဖိုးက NULL ဖြစ်ပြီး — အဲဒီအခါ object field တစ်ခုခုနဲ့ မကိုက်ညီတဲ့ output columns တွေကို nulls တွေနဲ့ ဖြည့်ပေးပါတယ်။ ဒါပေမယ့် base က NULL မဟုတ်ဘူးဆိုရင် — သူ့ထဲမှာ ပါဝင်တဲ့ values တွေကို မကိုက်ညီတဲ့ columns တွေအတွက် သုံးပါလိမ့်မယ်။ JSON value တစ်ခုကို output column ရဲ့ SQL type အဖြစ် ပြောင်းဖို့ — အောက်ပါ စည်းမျဉ်းတွေကို အစဉ်လိုက် အသုံးချပါတယ်: (1) JSON null value ကို ကိစ္စအားလုံးမှာ SQL null အဖြစ် ပြောင်းပါတယ်။ (2) Output column က json သို့မဟုတ် jsonb type ဆိုရင် — JSON value ကို အတိအကျ ပြန်ထုတ်ပေးရုံပဲ လုပ်ပါတယ်။ (3) Output column က composite (row) type ဖြစ်ပြီး JSON value က JSON object ဆိုရင် — object ရဲ့ fields တွေကို ဒီစည်းမျဉ်းတွေကို recursive အသုံးချပြီး output row type ရဲ့ columns တွေအဖြစ် ပြောင်းပါတယ်။ (4) အလားတူပဲ — output column က array type ဖြစ်ပြီး JSON value က JSON array ဆိုရင် — JSON array ရဲ့ elements တွေကို ဒီစည်းမျဉ်းတွေကို recursive အသုံးချပြီး output array ရဲ့ elements တွေအဖြစ် ပြောင်းပါတယ်။ (5) မဟုတ်ရင် — JSON value က string ဆိုရင် — string ရဲ့ ပါဝင်မှုကို column ရဲ့ data type အတွက် input conversion function ဆီ ပို့ပါတယ်။ (6) မဟုတ်ရင် — JSON value ရဲ့ သာမန် text representation ကို column ရဲ့ data type အတွက် input conversion function ဆီ ပို့ပါတယ်။ အောက်က ဥပမာမှာ constant JSON value ကို သုံးထားပေမယ့် — ပုံမှန် အသုံးပြုမှုကတော့ query ရဲ့ FROM clause ထဲက တခြား table တစ်ခုကနေ json သို့မဟုတ် jsonb column တစ်ခုကို laterally ရည်ညွှန်းတာပါ။ json_populate_record ကို FROM clause ထဲမှာ ရေးတာက အကောင်းဆုံး အလေ့အကျင့်ပါ — ထုတ်ယူထားတဲ့ columns တွေ အားလုံးကို function call တွေ ထပ်ခါထပ်ခါ မလုပ်ရဘဲ သုံးလို့ ရလို့ပါ။ | create type subrowtype as (d int, e text); create type myrowtype as (a int, b text[], c subrowtype); select * from json_populate_record(null::myrowtype, '{"a": 1, "b": ["2", "a b"], "c": {"d": 4, "e": "a b c"}, "x": "foo"}') →   a \|   b       \|      c ---+-----------+-------------  1 \| {2,"a b"} \| (4,"a b c") |
|  jsonb_populate_record_valid ( base anyelement, from_json json ) → boolean | jsonb_populate_record ကို စမ်းသပ်ဖို့ function တစ်ခုပါ။ ပေးထားတဲ့ input JSON object အတွက် jsonb_populate_record က error မတက်ဘဲ ပြီးဆုံးမယ်ဆိုရင် true ပြန်ပေးပါတယ် — ဆိုလိုတာက input က valid ဖြစ်တယ်၊ မဟုတ်ရင် false ပါ။ | create type jsb_char2 as (a char(2)); select jsonb_populate_record_valid(NULL::jsb_char2, '{"a": "aaa"}'); →   jsonb_populate_record_valid -----------------------------  f (1 row)  select * from jsonb_populate_record(NULL::jsb_char2, '{"a": "aaa"}') q; →  ERROR:  value too long for type character(2)  select jsonb_populate_record_valid(NULL::jsb_char2, '{"a": "aa"}'); →   jsonb_populate_record_valid -----------------------------  t (1 row)  select * from jsonb_populate_record(NULL::jsb_char2, '{"a": "aa"}') q; →   a ----  aa (1 row) |
|  json_populate_recordset ( base anyelement, from_json json ) → setof anyelement  jsonb_populate_recordset ( base anyelement, from_json jsonb ) → setof anyelement | Top-level JSON array of objects ကို — base argument ရဲ့ composite type ရှိတဲ့ — rows အစုတစ်ခုအဖြစ် ချဲ့ထွက်ပါတယ်။ JSON array ရဲ့ element တစ်ခုချင်းစီကို အပေါ်မှာ json[b]_populate_record အတွက် ဖော်ပြခဲ့တဲ့အတိုင်း process လုပ်ပါတယ်။ | create type twoints as (a int, b int); select * from json_populate_recordset(null::twoints, '[{"a":1,"b":2}, {"a":3,"b":4}]') →   a \| b ---+---  1 \| 2  3 \| 4 |
|  json_to_record ( json ) → record  jsonb_to_record ( jsonb ) → record | Top-level JSON object ကို — AS clause နဲ့ သတ်မှတ်ထားတဲ့ composite type ရှိတဲ့ — row တစ်တန်းအဖြစ် ချဲ့ထွက်ပါတယ်။ (record ပြန်ပေးတဲ့ function တွေ အားလုံးမှာ ရှိသလိုပဲ — ခေါ်ယူတဲ့ query က AS clause တစ်ခုနဲ့ record ရဲ့ structure ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပေးရပါမယ်။) Output record ကို — အပေါ်မှာ json[b]_populate_record အတွက် ဖော်ပြခဲ့တဲ့ နည်းအတိုင်းပဲ — JSON object ရဲ့ fields တွေကနေ ဖြည့်ပါတယ်။ Input record value မရှိတာမို့ — မကိုက်ညီတဲ့ columns တွေကို အမြဲတမ်း nulls တွေနဲ့ ဖြည့်ပါတယ်။ | create type myrowtype as (a int, b text); select * from json_to_record('{"a":1,"b":[1,2,3],"c":[1,2,3],"e":"bar","r": {"a": 123, "b": "a b c"}}') as x(a int, b text, c int[], d text, r myrowtype) →   a \|    b    \|    c    \| d \|       r ---+---------+---------+---+---------------  1 \| [1,2,3] \| {1,2,3} \|   \| (123,"a b c") |
|  json_to_recordset ( json ) → setof record  jsonb_to_recordset ( jsonb ) → setof record | Top-level JSON array of objects ကို — AS clause နဲ့ သတ်မှတ်ထားတဲ့ composite type ရှိတဲ့ — rows အစုတစ်ခုအဖြစ် ချဲ့ထွက်ပါတယ်။ (record ပြန်ပေးတဲ့ function တွေ အားလုံးမှာ ရှိသလိုပဲ — ခေါ်ယူတဲ့ query က AS clause တစ်ခုနဲ့ record ရဲ့ structure ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပေးရပါမယ်။) JSON array ရဲ့ element တစ်ခုချင်းစီကို အပေါ်မှာ json[b]_populate_record အတွက် ဖော်ပြခဲ့တဲ့အတိုင်း process လုပ်ပါတယ်။ | select * from json_to_recordset('[{"a":1,"b":"foo"}, {"a":"2","c":"bar"}]') as x(a int, b text) →   a \|  b ---+-----  1 \| foo  2 \| |
|  jsonb_set ( target jsonb, path text[], new_value jsonb [, create_if_missing boolean ] ) → jsonb | target ကို — path က သတ်မှတ်တဲ့ item နေရာမှာ new_value နဲ့ အစားထိုးပြီး — ပြန်ပေးပါတယ်။ create_if_missing က true (default ဒီအတိုင်း) ဖြစ်ပြီး path က သတ်မှတ်တဲ့ item မရှိဘူးဆိုရင်တော့ — new_value ကို ထည့်ပေးပါတယ်။ Path ထဲက ရှေ့ပိုင်း steps တွေ အားလုံး တည်ရှိနေရပါမယ် — မဟုတ်ရင် target ကို မပြောင်းလဲဘဲ ပြန်ပေးပါတယ်။ Path-oriented operators တွေမှာလိုပဲ — path ထဲမှာ ပေါ်လာတဲ့ negative integers တွေက JSON arrays ရဲ့ နောက်ဆုံးကနေ ရေတွက်ပါတယ်။ နောက်ဆုံး path step က range အပြင်ဘက်က array index တစ်ခု ဖြစ်ပြီး create_if_missing က true ဆိုရင် — index က negative ဆိုရင် array ရဲ့ အစမှာ၊ positive ဆိုရင် array ရဲ့ အဆုံးမှာ — new value ကို ထည့်ပါတယ်။ | jsonb_set('[{"f1":1,"f2":null},2,null,3]', '{0,f1}', '[2,3,4]', false) → [{"f1": [2, 3, 4], "f2": null}, 2, null, 3] jsonb_set('[{"f1":1,"f2":null},2]', '{0,f3}', '[2,3,4]') → [{"f1": 1, "f2": null, "f3": [2, 3, 4]}, 2] |
|  jsonb_set_lax ( target jsonb, path text[], new_value jsonb [, create_if_missing boolean [, null_value_treatment text ]] ) → jsonb | new_value က NULL မဟုတ်ဘူးဆိုရင် — jsonb_set နဲ့ အတိအကျ တူညီစွာ ပြုမူပါတယ်။ မဟုတ်ရင်တော့ null_value_treatment ရဲ့ တန်ဖိုးအတိုင်း ပြုမူပြီး — အဲဒီတန်ဖိုးက 'raise_exception', 'use_json_null', 'delete_key' ဒါမှမဟုတ် 'return_target' တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။ Default ကတော့ 'use_json_null' ပါ။ | jsonb_set_lax('[{"f1":1,"f2":null},2,null,3]', '{0,f1}', null) → [{"f1": null, "f2": null}, 2, null, 3] jsonb_set_lax('[{"f1":99,"f2":null},2]', '{0,f3}', null, true, 'return_target') → [{"f1": 99, "f2": null}, 2] |
|  jsonb_insert ( target jsonb, path text[], new_value jsonb [, insert_after boolean ] ) → jsonb | target ကို new_value ထည့်သွင်းပြီး ပြန်ပေးပါတယ်။ Path က သတ်မှတ်တဲ့ item က array element တစ်ခု ဆိုရင် — insert_after က false (default) ဖြစ်နေရင် အဲဒီ item ရဲ့ ရှေ့မှာ၊ true ဖြစ်နေရင် နောက်မှာ — new_value ကို ထည့်ပါတယ်။ Path က သတ်မှတ်တဲ့ item က object field တစ်ခု ဆိုရင် — object ထဲမှာ အဲဒီ key မရှိသေးမှသာ new_value ကို ထည့်ပါတယ်။ Path ထဲက ရှေ့ပိုင်း steps တွေ အားလုံး တည်ရှိနေရပါမယ် — မဟုတ်ရင် target ကို မပြောင်းလဲဘဲ ပြန်ပေးပါတယ်။ Path-oriented operators တွေမှာလိုပဲ — path ထဲမှာ ပေါ်လာတဲ့ negative integers တွေက JSON arrays ရဲ့ နောက်ဆုံးကနေ ရေတွက်ပါတယ်။ နောက်ဆုံး path step က range အပြင်ဘက်က array index တစ်ခု ဆိုရင် — index က negative ဆိုရင် array ရဲ့ အစမှာ၊ positive ဆိုရင် array ရဲ့ အဆုံးမှာ — new value ကို ထည့်ပါတယ်။ | jsonb_insert('{"a": [0,1,2]}', '{a, 1}', '"new_value"') → {"a": [0, "new_value", 1, 2]} jsonb_insert('{"a": [0,1,2]}', '{a, 1}', '"new_value"', true) → {"a": [0, 1, "new_value", 2]} |
|  json_strip_nulls ( target json [,strip_in_arrays boolean ] ) → json  jsonb_strip_nulls ( target jsonb [,strip_in_arrays boolean ] ) → jsonb | ပေးထားတဲ့ JSON value ထဲက null values ရှိတဲ့ object fields တွေ အားလုံးကို recursive အနေနဲ့ ဖျက်ပစ်ပါတယ်။ strip_in_arrays က true ဆိုရင် (default က false) — null array elements တွေကိုပါ ဖြတ်ထုတ်ပါတယ်။ မဟုတ်ရင်တော့ သူတို့ကို မဖြတ်ပါဘူး။ Bare null values တွေကိုတော့ ဘယ်တော့မှ မဖြတ်ပါဘူး။ | json_strip_nulls('[{"f1":1, "f2":null}, 2, null, 3]') → [{"f1":1},2,null,3] jsonb_strip_nulls('[1,2,null,3,4]', true) → [1,2,3,4] |
|  jsonb_path_exists ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean | ဒီ JSON path က သတ်မှတ်ထားတဲ့ JSON value အတွက် item တစ်ခုခုကို ပြန်ပေးလား စစ်ဆေးပါတယ်။ (ဒါက SQL-standard JSON path expressions တွေအတွက်ပဲ အသုံးဝင်ပါတယ် — predicate check expressions တွေက တန်ဖိုးတစ်ခုကို အမြဲ ပြန်ပေးလို့ သူတို့အတွက် မဟုတ်ပါဘူး။) vars argument သတ်မှတ်ထားရင် — ၎င်းက JSON object တစ်ခု ဖြစ်ရပြီး — သူ့ရဲ့ fields တွေက jsonpath expression ထဲကို အစားထိုးဖို့ named values တွေ ထောက်ပံ့ပေးပါတယ်။ silent argument သတ်မှတ်ပြီး true ဖြစ်နေရင် — function က @? နဲ့ @@ operators တွေ ဖိနှိပ်တဲ့ error တွေကို အတူတူ ဖိနှိပ်ပါတယ်။ | jsonb_path_exists('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') → t |
|  jsonb_path_match ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean | သတ်မှတ်ထားတဲ့ JSON value အတွက် JSON path predicate check ရဲ့ SQL boolean ရလဒ်ကို ပြန်ပေးပါတယ်။ (ဒါက predicate check expressions တွေအတွက်ပဲ အသုံးဝင်ပါတယ် — SQL-standard JSON path expressions တွေအတွက် မဟုတ်ပါဘူး — path ရဲ့ ရလဒ်က boolean value တစ်ခုတည်း မဟုတ်ဘူးဆိုရင် fail ဖြစ်မယ် ဒါမှမဟုတ် NULL ပြန်ပေးလို့ပါ။) Optional ဖြစ်တဲ့ vars နဲ့ silent arguments တွေက jsonb_path_exists မှာလိုပဲ အလုပ်လုပ်ပါတယ်။ | jsonb_path_match('{"a":[1,2,3,4,5]}', 'exists($.a[*] ? (@ >= $min && @ <= $max))', '{"min":2, "max":4}') → t |
|  jsonb_path_query ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → setof jsonb | သတ်မှတ်ထားတဲ့ JSON value အတွက် JSON path က ပြန်ပေးတဲ့ JSON items တွေ အားလုံးကို ပြန်ပေးပါတယ်။ SQL-standard JSON path expressions တွေအတွက်ဆိုရင် — target ကနေ ရွေးထုတ်ထားတဲ့ JSON values တွေကို ပြန်ပေးပါတယ်။ Predicate check expressions တွေအတွက်ဆိုရင် — predicate check ရဲ့ ရလဒ်: true, false ဒါမှမဟုတ် null ကို ပြန်ပေးပါတယ်။ Optional ဖြစ်တဲ့ vars နဲ့ silent arguments တွေက jsonb_path_exists မှာလိုပဲ အလုပ်လုပ်ပါတယ်။ | select * from jsonb_path_query('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') →   jsonb_path_query ------------------  2  3  4 |
|  jsonb_path_query_array ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb | သတ်မှတ်ထားတဲ့ JSON value အတွက် JSON path က ပြန်ပေးတဲ့ JSON items တွေ အားလုံးကို — JSON array တစ်ခုအနေနဲ့ — ပြန်ပေးပါတယ်။ Parameters တွေက jsonb_path_query နဲ့ အတူတူပါပဲ။ | jsonb_path_query_array('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') → [2, 3, 4] |
|  jsonb_path_query_first ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb | သတ်မှတ်ထားတဲ့ JSON value အတွက် JSON path က ပြန်ပေးတဲ့ ပထမဆုံး JSON item ကို ပြန်ပေးပါတယ် — ရလဒ် မရှိဘူးဆိုရင် NULL ပါ။ Parameters တွေက jsonb_path_query နဲ့ အတူတူပါပဲ။ | jsonb_path_query_first('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') → 2 |
|  jsonb_path_exists_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean  jsonb_path_match_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean  jsonb_path_query_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → setof jsonb  jsonb_path_query_array_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb  jsonb_path_query_first_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb | ဒီ functions တွေက — _tz suffix မပါတဲ့ အပေါ်မှာ ဖော်ပြခဲ့တဲ့ သူတို့ရဲ့ အမြွှာ (counterpart) functions တွေလိုပဲ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် ဒီ functions တွေက timezone-aware conversions လိုအပ်တဲ့ date/time values တွေရဲ့ နှိုင်းယှဉ်မှုကို ထောက်ပံ့ပေးပါတယ်။ အောက်က ဥပမာမှာ date-only value 2015-08-02 ကို timestamp with time zone အဖြစ် အဓိပ္ပာယ်ဖွင့်ဖို့ လိုအပ်လို့ — ရလဒ်က လက်ရှိ TimeZone setting ပေါ်မှာ မူတည်ပါတယ်။ ဒီမှီခိုမှုကြောင့် — ဒီ functions တွေကို stable အဖြစ် မှတ်သားထားပြီး — indexes တွေမှာ သုံးလို့ မရပါဘူး။ သူတို့ရဲ့ အမြွှာတွေကတော့ immutable ဖြစ်လို့ indexes တွေမှာ သုံးလို့ ရပါတယ်; ဒါပေမယ့် ဒီလို နှိုင်းယှဉ်မှုမျိုး လုပ်ဖို့ တောင်းဆိုခံရရင် error တက်ပါလိမ့်မယ်။ | jsonb_path_exists_tz('["2015-08-01 12:00:00-05"]', '$[*] ? (@.datetime() < "2015-08-02".datetime())') → t |
|  jsonb_pretty ( jsonb ) → text | ပေးထားတဲ့ JSON value ကို pretty-printed, indented text အဖြစ် ပြောင်းပေးပါတယ်။ | jsonb_pretty('[{"f1":1,"f2":null}, 2]') →  [     {         "f1": 1,         "f2": null     },     2 ] |
|  json_typeof ( json ) → text  jsonb_typeof ( jsonb ) → text | Top-level JSON value ရဲ့ type ကို text string အဖြစ် ပြန်ပေးပါတယ်။ ဖြစ်နိုင်တဲ့ types တွေကတော့ object, array, string, number, boolean နဲ့ null ပါ။ (null ရလဒ်ကို SQL NULL နဲ့ မရောထွေးသင့်ပါဘူး; ဥပမာတွေကို ကြည့်ပါ။) | json_typeof('-123.4') → number json_typeof('null'::json) → null json_typeof(NULL::json) IS NULL → t |

### 9.16.2. The SQL/JSON Path Language (SQL/JSON path language)

SQL/JSON path expressions တွေက — XML content တွေကို ဝင်ရောက်ဖို့ သုံးတဲ့ XPath expressions တွေနဲ့ ဆင်တူစွာ — JSON value တစ်ခုကနေ ထုတ်ယူရမယ့် item(s) တွေကို သတ်မှတ်ပေးပါတယ်။ PostgreSQL မှာ path expressions တွေကို `jsonpath` data type အနေနဲ့ အကောင်အထည် ဖော်ထားပြီး — [အပိုင်း 8.14.7](/docs/postgresql/datatype-json) မှာ ဖော်ပြထားတဲ့ elements တွေ အားလုံးကို သုံးနိုင်ပါတယ်။

JSON query functions နဲ့ operators တွေက ပေးထားတဲ့ path expression ကို evaluation (အကဲဖြတ်) လုပ်ဖို့ *path engine* ဆီ ပို့ပေးပါတယ်။ Expression က query လုပ်ထားတဲ့ JSON data နဲ့ ကိုက်ညီမယ်ဆိုရင် — သက်ဆိုင်တဲ့ JSON item (သို့မဟုတ် items အစု) ကို ပြန်ပေးပါတယ်။ မကိုက်ညီဘူးဆိုရင် — function ပေါ်မူတည်ပြီး — ရလဒ်က `NULL`, `false` ဒါမှမဟုတ် error တစ်ခု ဖြစ်ပါလိမ့်မယ်။ Path expressions တွေကို SQL/JSON path language နဲ့ ရေးပြီး — arithmetic expressions နဲ့ functions တွေလည်း ပါဝင်နိုင်ပါတယ်။

Path expression တစ်ခုမှာ — `jsonpath` data type က ခွင့်ပြုထားတဲ့ elements တွေရဲ့ sequence (အစီအစဉ်) တစ်ခု ပါဝင်ပါတယ်။ Path expression ကို ပုံမှန်အားဖြင့် ဘယ်ကနေ ညာ (left to right) အကဲဖြတ်ပေမယ့် — operations တွေရဲ့ အစဉ်ကို ပြောင်းဖို့ parentheses တွေ သုံးနိုင်ပါတယ်။ Evaluation အောင်မြင်ခဲ့ရင် — JSON items တွေရဲ့ sequence တစ်ခု ထွက်လာပြီး — evaluation ရလဒ်ကို သတ်မှတ်ထားတဲ့ တွက်ချက်မှုကို အပြီးသတ်ပေးတဲ့ JSON query function ဆီ ပြန်ပို့ပါတယ်။

Query လုပ်နေတဲ့ JSON value (ခေါ် *context item*) ကို ရည်ညွှန်းဖို့ — path expression ထဲမှာ `$` variable ကို သုံးပါတယ်။ Path တစ်ခုရဲ့ ပထမဆုံး element က အမြဲတမ်း `$` ဖြစ်ရပါတယ်။ ၎င်းနောက်မှာ — context item ရဲ့ sub-items တွေကို ထုတ်ယူဖို့ JSON structure ကို အဆင့်တစ်ဆင့်ချင်း ဆင်းသွားတဲ့ — [accessor operators](/docs/postgresql/datatype-json) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို လိုက်နိုင်ပါတယ်။ Accessor operator တစ်ခုချင်းစီက အရင် evaluation step ရဲ့ ရလဒ်(များ)ပေါ်မှာ အလုပ်လုပ်ပြီး — input item တစ်ခုချင်းစီကနေ output items သုည၊ တစ် ဒါမှမဟုတ် တစ်ခုထက်ပို ထုတ်ပေးပါတယ်။

ဥပမာ — parse လုပ်ချင်တဲ့ GPS tracker တစ်ခုကနေ ရလာတဲ့ JSON data တချို့ ရှိတယ်ဆိုပါစို့ — ဥပမာ:

```sql
SELECT '{
  "track": {
    "segments": [
      {
        "location":   [ 47.763, 13.4034 ],
        "start time": "2018-10-14 10:05:14",
        "HR": 73
      },
      {
        "location":   [ 47.706, 13.2635 ],
        "start time": "2018-10-14 10:39:21",
        "HR": 135
      }
    ]
  }
}' AS json \gset
```

(အပေါ်က ဥပမာကို psql ထဲ copy-and-paste လုပ်ပြီး အောက်က ဥပမာတွေအတွက် အဆင်သင့် ပြင်ဆင်နိုင်ပါတယ်။ ဒီနောက် psql က `:'json'` ကို — JSON value ပါဝင်တဲ့ သင့်လျော်စွာ quote လုပ်ထားတဲ့ string constant အဖြစ် — ချဲ့ပေးပါလိမ့်မယ်။)

ရနိုင်တဲ့ track segments တွေကို ထုတ်ယူဖို့ — ဝန်းရံထားတဲ့ JSON objects တွေကို ဖြတ်ဆင်းဖို့ `.key` accessor operator ကို သုံးရပါတယ် — ဥပမာ:

```
=> select jsonb_path_query(:'json', '$.track.segments');
                                                                         jsonb_path_query
-----------------------------------------------------------​-----------------------------------------------------------​---------------------------------------------
 [{"HR": 73, "location": [47.763, 13.4034], "start time": "2018-10-14 10:05:14"}, {"HR": 135, "location": [47.706, 13.2635], "start time": "2018-10-14 10:39:21"}]
```

Array တစ်ခုရဲ့ ပါဝင်မှုတွေကို ထုတ်ယူဖို့ဆိုရင် — `[*]` operator ကို ပုံမှန်အားဖြင့် သုံးပါတယ်။ အောက်က ဥပမာက ရနိုင်တဲ့ track segments တွေ အားလုံးအတွက် location coordinates တွေကို ပြန်ပေးပါလိမ့်မယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments[*].location');
 jsonb_path_query
-------------------
 [47.763, 13.4034]
 [47.706, 13.2635]
```

ဒီနေရာမှာ — JSON input value တစ်ခုလုံး (`$`) ကနေ စပြီး — `.track` accessor က `"track"` object key နဲ့ ဆက်စပ်နေတဲ့ JSON object ကို ရွေးချယ်ခဲ့ပြီး — `.segments` accessor က အဲဒီ object ထဲက `"segments"` key နဲ့ ဆက်စပ်နေတဲ့ JSON array ကို ရွေးချယ်ခဲ့ပါတယ် — ဒီနောက် `[*]` accessor က အဲဒီ array ရဲ့ element တစ်ခုချင်းစီကို ရွေးချယ်ခဲ့ပြီး (items တွေရဲ့ series တစ်ခု ထုတ်ပေးခဲ့ပါတယ်) — နောက်ဆုံးမှာ `.location` accessor က အဲဒီ objects တစ်ခုချင်းစီထဲက `"location"` key နဲ့ ဆက်စပ်နေတဲ့ JSON array ကို ရွေးချယ်ခဲ့ပါတယ်။ ဒီဥပမာထဲမှာ — အဲဒီ objects တစ်ခုချင်းစီမှာ `"location"` key ရှိခဲ့ပါတယ်; ဒါပေမယ့် တစ်ခုခုမှာ မရှိခဲ့ဘူးဆိုရင် — `.location` accessor က အဲဒီ input item အတွက် output ဘာမှ မထုတ်ပေးဘဲ နေမှာပါ။

ပထမ segment ရဲ့ coordinates တွေကိုပဲ ပြန်ယူချင်ရင် — `[]` accessor operator ထဲမှာ သက်ဆိုင်တဲ့ subscript ကို သတ်မှတ်နိုင်ပါတယ်။ JSON array indexes တွေက 0-relative ဖြစ်တာ သတိရပါ:

```
=> select jsonb_path_query(:'json', '$.track.segments[0].location');
 jsonb_path_query
-------------------
 [47.763, 13.4034]
```

Path evaluation step တစ်ခုချင်းစီရဲ့ ရလဒ်ကို — Section 9.16.2.3 မှာ စာရင်းပြုထားတဲ့ `jsonpath` operators နဲ့ methods တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုနဲ့ process လုပ်နိုင်ပါတယ်။ Method name တစ်ခုချင်းစီရဲ့ ရှေ့မှာ dot တစ်ခု ထည့်ရပါမယ်။ ဥပမာ — array တစ်ခုရဲ့ size ကို ရနိုင်ပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments.size()');
 jsonb_path_query
------------------
 2
```

Path expressions တွေထဲမှာ `jsonpath` operators နဲ့ methods တွေ သုံးတဲ့ နောက်ထပ် ဥပမာတွေကို အောက်က Section 9.16.2.3 မှာ တွေ့ရပါမယ်။

Path တစ်ခုမှာ — SQL ထဲက `WHERE` clause လိုမျိုး အလုပ်လုပ်တဲ့ *filter expressions* တွေလည်း ပါဝင်နိုင်ပါတယ်။ Filter expression တစ်ခုက question mark နဲ့ စပြီး — parentheses ထဲမှာ condition တစ်ခု ပေးပါတယ်:

```sql
? (condition)
```

Filter expressions တွေကို — သူတို့ သက်ရောက်စေချင်တဲ့ path evaluation step ရဲ့ နောက်မှာ ချက်ချင်း ရေးရပါမယ်။ အဲဒီ step ရဲ့ ရလဒ်ကို — ပေးထားတဲ့ condition ကို ကျေနပ်စေတဲ့ items တွေပဲ ပါဝင်အောင် — filter လုပ်ပါတယ်။ SQL/JSON က three-valued logic (တန်ဖိုးသုံးမျိုး ယုတ္တိ) ကို သတ်မှတ်လို့ — condition က `true`, `false` ဒါမှမဟုတ် `unknown` ထွက်နိုင်ပါတယ်။ `unknown` value က SQL `NULL` ရဲ့ အခန်းကဏ္ဍ အတိုင်းပဲ ဖြစ်ပြီး — `is unknown` predicate နဲ့ စမ်းသပ်လို့ ရပါတယ်။ နောက်ထပ် path evaluation steps တွေမှာတော့ — filter expression က `true` ပြန်ပေးခဲ့တဲ့ items တွေကိုပဲ သုံးပါတယ်။

Filter expressions တွေထဲမှာ သုံးလို့ ရတဲ့ functions နဲ့ operators တွေကို Table 9.53 မှာ စာရင်းပြုထားပါတယ်။ Filter expression တစ်ခုအတွင်းမှာ — `@` variable က ထည့်စဉ်းစားနေတဲ့ တန်ဖိုး (ဆိုလိုတာက အရင် path step ရဲ့ ရလဒ်တစ်ခု) ကို ကိုယ်စားပြုပါတယ်။ Component items တွေကို ထုတ်ယူဖို့ `@` ရဲ့ နောက်မှာ accessor operators တွေ ရေးလို့ ရပါတယ်။

ဥပမာ — 130 ထက် မြင့်တဲ့ heart rate values တွေ အားလုံးကို ထုတ်ယူချင်တယ်ဆိုပါစို့။ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments[*].HR ? (@ > 130)');
 jsonb_path_query
------------------
 135
```

ဒီလို values တွေရှိတဲ့ segments တွေရဲ့ start times တွေကို ရဖို့ဆိုရင် — start times တွေကို မရွေးချယ်ခင် မသက်ဆိုင်တဲ့ segments တွေကို အရင် filter ထုတ်ပစ်ရပါမယ် — ဒါကြောင့် filter expression ကို အရင် step ပေါ်မှာ အသုံးချပြီး — condition ထဲမှာ သုံးတဲ့ path က မတူတော့ပါဘူး:

```
=> select jsonb_path_query(:'json', '$.track.segments[*] ? (@.HR > 130)."start time"');
   jsonb_path_query
-----------------------
 "2018-10-14 10:39:21"
```

လိုအပ်ရင် filter expressions တွေကို ဆက်တိုက် အများအပြားလည်း သုံးနိုင်ပါတယ်။ အောက်က ဥပမာက — သက်ဆိုင်တဲ့ coordinates နဲ့ မြင့်မားတဲ့ heart rate values တွေ ပါဝင်တဲ့ locations တွေ ရှိတဲ့ segments တွေ အားလုံးရဲ့ start times တွေကို ရွေးချယ်ပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments[*] ? (@.location[1] < 13.4) ? (@.HR > 130)."start time"');
   jsonb_path_query
-----------------------
 "2018-10-14 10:39:21"
```

Nesting level အမျိုးမျိုးမှာ filter expressions တွေ သုံးတာကိုလည်း ခွင့်ပြုပါတယ်။ အောက်က ဥပမာက — အရင် segments တွေ အားလုံးကို location အလိုက် filter လုပ်ပြီး — ဒီနောက် အဲဒီ segments တွေအတွက် high heart rate values တွေကို ရှိရင် ပြန်ပေးပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments[*] ? (@.location[1] < 13.4).HR ? (@ > 130)');
 jsonb_path_query
------------------
 135
```

Filter expressions တွေကို တစ်ခုထဲမှာ တစ်ခု အသိုက်လိုက် (nest) ထည့်လို့လည်း ရပါတယ်။ ဒီဥပမာက — high heart rate values ရှိတဲ့ segments တစ်ခုခု ပါဝင်နေရင် track ရဲ့ size ကို ပြန်ပေးပြီး — မဟုတ်ရင် empty sequence ကို ပြန်ပေးပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track ? (exists(@.segments[*] ? (@.HR > 130))).segments.size()');
 jsonb_path_query
------------------
 2
```

#### 9.16.2.1. Deviations from the SQL Standard (SQL standard မှ သွေဖည်ချက်များ)

PostgreSQL ရဲ့ SQL/JSON path language အကောင်အထည်ဖော်မှုမှာ — SQL/JSON standard နဲ့ မတူညီတဲ့ အောက်ပါ သွေဖည်ချက်တွေ (deviations) ရှိပါတယ်။

**9.16.2.1.1. Boolean Predicate Check Expressions (Boolean predicate check expression များ)**

SQL standard ရဲ့ extension တစ်ခုအနေနဲ့ — PostgreSQL ရဲ့ path expression တစ်ခုက Boolean predicate တစ်ခု ဖြစ်နိုင်ပါတယ် — SQL standard ကတော့ predicates တွေကို filters တွေထဲမှာပဲ ခွင့်ပြုပါတယ်။ SQL-standard path expressions တွေက query လုပ်ထားတဲ့ JSON value ရဲ့ သက်ဆိုင်ရာ element(s) တွေကို ပြန်ပေးပေမယ့် — predicate check expressions တွေကတော့ predicate ရဲ့ three-valued `jsonb` ရလဒ် တစ်ခုတည်း: `true`, `false` ဒါမှမဟုတ် `null` ကို ပြန်ပေးပါတယ်။ ဥပမာ — ဒီ SQL-standard filter expression ကို ရေးလို့ ရပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments ?(@[*].HR > 130)');
                                jsonb_path_query
-----------------------------------------------------------​----------------------
 {"HR": 135, "location": [47.706, 13.2635], "start time": "2018-10-14 10:39:21"}
```

ဆင်တူတဲ့ predicate check expression ကတော့ — match တစ်ခု တည်ရှိကြောင်း ဖော်ပြတဲ့ `true` ကိုပဲ ရိုးရိုး ပြန်ပေးပါတယ်:

```
=> select jsonb_path_query(:'json', '$.track.segments[*].HR > 130');
 jsonb_path_query
------------------
 true
```

> **မှတ်ချက်:** Predicate check expressions တွေကို `@@` operator (နဲ့ `jsonb_path_match` function) ထဲမှာ လိုအပ်ပြီး — `@?` operator (နဲ့ `jsonb_path_exists` function) နဲ့တော့ မသုံးသင့်ပါဘူး။

**9.16.2.1.2. Regular Expression Interpretation (Regular expression အနက်ဖွင့်ဆိုမှု)**

`like_regex` filters တွေထဲမှာ သုံးတဲ့ regular expression patterns တွေကို အနက်ဖွင့်ရာမှာ အသေးစား ကွဲပြားချက်တွေ ရှိပါတယ် — Section 9.16.2.4 မှာ ဖော်ပြထားပါတယ်။

#### 9.16.2.2. Strict and Lax Modes (strict နှင့် lax mode များ)

JSON data တွေကို query လုပ်တဲ့အခါ — path expression က တကယ့် JSON data structure နဲ့ မကိုက်ညီနိုင်ပါဘူး။ Object တစ်ခုရဲ့ မရှိတဲ့ member တစ်ခုကို ဒါမှမဟုတ် array တစ်ခုရဲ့ element တစ်ခုကို ဝင်ရောက်ဖို့ ကြိုးစားတာကို structural error (structure ဆိုင်ရာ error) အဖြစ် သတ်မှတ်ပါတယ်။ SQL/JSON path expressions တွေမှာ structural errors တွေကို ကိုင်တွယ်တဲ့ mode နှစ်မျိုး ရှိပါတယ်:

- lax (default) — path engine က query လုပ်ထားတဲ့ data ကို သတ်မှတ်ထားတဲ့ path နဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် သွယ်ဝိုက်၍ (implicitly) ပြုပြင်ပေးပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း ပြုပြင်၍ မရတဲ့ structural errors တွေ အားလုံးကို ဖိနှိပ်ပြီး — match မရှိဘူးလို့ သတ်မှတ်ပါတယ်။
- strict — structural error တစ်ခု ဖြစ်ပေါ်ရင် — error တစ်ခု တက်စေပါတယ်။

Lax mode က — JSON data က မျှော်လင့်ထားတဲ့ schema နဲ့ မကိုက်ညီတဲ့အခါ — JSON document နဲ့ path expression တစ်ခုကို လိုက်ဖက်အောင် လုပ်ရာမှာ လွယ်ကူစေပါတယ်။ Operand တစ်ခုက သီးခြား operation တစ်ခုရဲ့ လိုအပ်ချက်တွေနဲ့ မကိုက်ညီဘူးဆိုရင် — ၎င်းကို SQL/JSON array အဖြစ် အလိုအလျောက် ပတ် (wrap) ပေးတာ ဒါမှမဟုတ် — operation မလုပ်ခင် သူ့ရဲ့ elements တွေကို SQL/JSON sequence အဖြစ် ပြောင်းပြီး ဖြေလျှော့ (unwrap) ပေးနိုင်ပါတယ်။ ဒါ့အပြင် — comparison operators တွေက lax mode မှာ သူတို့ရဲ့ operands တွေကို အလိုအလျောက် unwrap လုပ်လို့ — SQL/JSON arrays တွေကို ဘာမှ ထပ်စရာမလိုဘဲ ချက်ချင်း နှိုင်းယှဉ်လို့ ရပါတယ်။ Size 1 ရှိတဲ့ array တစ်ခုကို သူ့ရဲ့ တစ်ခုတည်းသော element နဲ့ ညီမျှတယ်လို့ သတ်မှတ်ပါတယ်။ အလိုအလျောက် unwrapping ကို အောက်ပါအခါတွေမှာ မလုပ်ပါဘူး:

- Path expression ထဲမှာ — array ရဲ့ type နဲ့ element အရေအတွက်ကို အသီးသီး ပြန်ပေးတဲ့ — type() ဒါမှမဟုတ် size() methods တွေ ပါဝင်နေရင်။
- Query လုပ်ထားတဲ့ JSON data ထဲမှာ nested arrays တွေ ပါဝင်နေရင်။ ဒီကိစ္စမှာ — အပြင်ဘက်ဆုံး array ကိုပဲ unwrap လုပ်ပြီး — အတွင်းဘက် arrays တွေ အားလုံးကိုတော့ မပြောင်းလဲဘဲ ထားပါတယ်။ ဒါကြောင့် — path evaluation step တစ်ခုချင်းစီမှာ implicit unwrapping က အဆင့်တစ်ဆင့်ထဲကိုပဲ ဆင်းနိုင်ပါတယ်။

ဥပမာ — အပေါ်မှာ ဖော်ပြထားတဲ့ GPS data တွေကို query လုပ်တဲ့အခါ — lax mode သုံးရင် segments တွေရဲ့ array တစ်ခုအနေနဲ့ သိမ်းထားတယ်ဆိုတဲ့ အချက်ကို ဘေးဖယ်ထားလို့ ရပါတယ်:

```
=> select jsonb_path_query(:'json', 'lax $.track.segments.location');
 jsonb_path_query
-------------------
 [47.763, 13.4034]
 [47.706, 13.2635]
```

Strict mode မှာတော့ — သတ်မှတ်ထားတဲ့ path က query လုပ်ထားတဲ့ JSON document ရဲ့ structure နဲ့ အတိအကျ ကိုက်ညီရပါမယ် — ဒါကြောင့် ဒီ path expression ကို သုံးရင် error တက်ပါလိမ့်မယ်:

```
=> select jsonb_path_query(:'json', 'strict $.track.segments.location');
ERROR:  jsonpath member accessor can only be applied to an object
```

Lax mode မှာ ရတဲ့အတိုင်း ရလဒ်ကို ရဖို့ဆိုရင် — `segments` array ကို ရှင်းရှင်းလင်းလင်း (explicitly) unwrap လုပ်ပေးရပါမယ်:

```
=> select jsonb_path_query(:'json', 'strict $.track.segments[*].location');
 jsonb_path_query
-------------------
 [47.763, 13.4034]
 [47.706, 13.2635]
```

Lax mode ရဲ့ unwrapping အပြုအမူက မမျှော်လင့်စရာ ရလဒ်တွေ ဖြစ်စေနိုင်ပါတယ်။ ဥပမာ — `.**` accessor ကို သုံးထားတဲ့ အောက်က query က `HR` value တိုင်းကို နှစ်ခါစီ ရွေးချယ်ပါတယ်:

```
=> select jsonb_path_query(:'json', 'lax $.**.HR');
 jsonb_path_query
------------------
 73
 135
 73
 135
```

ဒါဖြစ်ရတဲ့ အကြောင်းက — `.**` accessor က `segments` array ရော — သူ့ရဲ့ element တစ်ခုချင်းစီကိုပါ ရွေးချယ်လို့ ဖြစ်ပြီး — `.HR` accessor က lax mode မှာ arrays တွေကို အလိုအလျောက် unwrap လုပ်လို့ပါ။ မမျှော်လင့်စရာ ရလဒ်တွေ ရှောင်ဖို့ — `.**` accessor ကို strict mode မှာပဲ သုံးဖို့ အကြံပြုပါတယ်။ အောက်က query က `HR` value တစ်ခုချင်းစီကို တစ်ခါပဲ ရွေးချယ်ပါတယ်:

```
=> select jsonb_path_query(:'json', 'strict $.**.HR');
 jsonb_path_query
------------------
 73
 135
```

Arrays တွေကို unwrap လုပ်တာက မမျှော်လင့်စရာ ရလဒ်တွေလည်း ဖြစ်စေနိုင်ပါတယ်။ `location` arrays တွေ အားလုံးကို ရွေးချယ်တဲ့ ဒီဥပမာကို ကြည့်ပါ:

```
=> select jsonb_path_query(:'json', 'lax $.track.segments[*].location');
 jsonb_path_query
-------------------
 [47.763, 13.4034]
 [47.706, 13.2635]
(2 rows)
```

မျှော်လင့်ထားတဲ့အတိုင်း — array အပြည့်အစုံတွေကို ပြန်ပေးပါတယ်။ ဒါပေမယ့် filter expression တစ်ခု အသုံးချလိုက်တဲ့အခါ — item တစ်ခုချင်းစီကို အကဲဖြတ်ဖို့ arrays တွေကို unwrap လုပ်ခံရပြီး — expression နဲ့ ကိုက်ညီတဲ့ items တွေကိုပဲ ပြန်ပေးပါတယ်:

```
=> select jsonb_path_query(:'json', 'lax $.track.segments[*].location ?(@[*] > 15)');
 jsonb_path_query
------------------
 47.763
 47.706
(2 rows)
```

Path expression က array အပြည့်အစုံတွေကို ရွေးချယ်ထားပေမယ့် ဒီလိုပဲ ဖြစ်ပါတယ်။ Arrays တွေကို ရွေးချယ်တဲ့ ပုံစံ ပြန်ရဖို့ strict mode ကို သုံးပါ:

```
=> select jsonb_path_query(:'json', 'strict $.track.segments[*].location ?(@[*] > 15)');
 jsonb_path_query
-------------------
 [47.763, 13.4034]
 [47.706, 13.2635]
(2 rows)
```

#### 9.16.2.3. SQL/JSON Path Operators and Methods (SQL/JSON path operators နှင့် methods များ)

`jsonpath` ထဲမှာ ရနိုင်တဲ့ operators နဲ့ methods တွေကို ဇယား 9.52 မှာ ပြထားပါတယ်။ Unary operators နဲ့ methods တွေကို — အရင် path step ကနေ ထွက်လာတဲ့ တန်ဖိုး အများအပြားပေါ်မှာ အသုံးချလို့ ရပေမယ့် — binary operators တွေ (addition စသည်) ကိုတော့ တန်ဖိုးတစ်ခုတည်းပေါ်မှာပဲ အသုံးချလို့ ရတယ်ဆိုတာ သတိပြုပါ။ Lax mode မှာ — array တစ်ခုပေါ်မှာ အသုံးချတဲ့ methods တွေကို array ထဲက value တစ်ခုချင်းစီအတွက် execute လုပ်ပါတယ်။ ခြွင်းချက်ကတော့ array ကိုယ်တိုင်ပေါ်မှာ အသုံးချတဲ့ `.type()` နဲ့ `.size()` တွေပါ။

**ဇယား 9.52. jsonpath Operators နှင့် Methods**

| Operator/Method | Description | Example(s) |
| --- | --- | --- |
|  number + number → number | ပေါင်းခြင်း (addition) | jsonb_path_query('[2]', '$[0] + 3') → 5 |
|  + number → number | Unary plus (operation ဘာမှ မလုပ်ပါ); addition နဲ့ မတူဘဲ — ဒါက တန်ဖိုး အများအပြားပေါ်မှာ iterate လုပ်နိုင်ပါတယ် | jsonb_path_query_array('{"x": [2,3,4]}', '+ $.x') → [2, 3, 4] |
|  number - number → number | နုတ်ခြင်း (subtraction) | jsonb_path_query('[2]', '7 - $[0]') → 5 |
|  - number → number | အနုတ်လက္ခဏာ ပြောင်းခြင်း (negation); subtraction နဲ့ မတူဘဲ — ဒါက တန်ဖိုး အများအပြားပေါ်မှာ iterate လုပ်နိုင်ပါတယ် | jsonb_path_query_array('{"x": [2,3,4]}', '- $.x') → [-2, -3, -4] |
|  number * number → number | မြှောက်ခြင်း (multiplication) | jsonb_path_query('[4]', '2 * $[0]') → 8 |
|  number / number → number | စားခြင်း (division) | jsonb_path_query('[8.5]', '$[0] / 2') → 4.2500000000000000 |
|  number % number → number | Modulo (အကြွင်း — remainder) | jsonb_path_query('[32]', '$[0] % 10') → 2 |
|  value . type() → string | JSON item ရဲ့ type (json_typeof ကို ကြည့်ပါ) | jsonb_path_query_array('[1, "2", {}]', '$[*].type()') → ["number", "string", "object"] |
|  value . size() → number | JSON item ရဲ့ size (array elements အရေအတွက် — array မဟုတ်ရင် 1) | jsonb_path_query('{"m": [11, 15]}', '$.m.size()') → 2 |
|  value . boolean() → boolean | JSON boolean, number ဒါမှမဟုတ် string ကနေ ပြောင်းထားတဲ့ Boolean value | jsonb_path_query_array('[1, "yes", false]', '$[*].boolean()') → [true, true, false] |
|  value . string() → string | JSON boolean, number, string ဒါမှမဟုတ် datetime ကနေ ပြောင်းထားတဲ့ String value | jsonb_path_query_array('[1.23, "xyz", false]', '$[*].string()') → ["1.23", "xyz", "false"] jsonb_path_query('"2023-08-15 12:34:56"', '$.timestamp().string()') → "2023-08-15T12:34:56" |
|  value . double() → number | JSON number ဒါမှမဟုတ် string ကနေ ပြောင်းထားတဲ့ အကြမ်းဖျင်း (approximate) floating-point number | jsonb_path_query('{"len": "1.9"}', '$.len.double() * 2') → 3.8 |
|  number . ceiling() → number | ပေးထားတဲ့ ဂဏန်းထက် ကြီးသော သို့မဟုတ် ညီမျှသော အနီးဆုံး integer | jsonb_path_query('{"h": 1.3}', '$.h.ceiling()') → 2 |
|  number . floor() → number | ပေးထားတဲ့ ဂဏန်းထက် ငယ်သော သို့မဟုတ် ညီမျှသော အနီးဆုံး integer | jsonb_path_query('{"h": 1.7}', '$.h.floor()') → 1 |
|  number . abs() → number | ပေးထားတဲ့ ဂဏန်းရဲ့ အကြွင်းမဲ့တန်ဖိုး (absolute value) | jsonb_path_query('{"z": -0.3}', '$.z.abs()') → 0.3 |
|  value . bigint() → bigint | JSON number ဒါမှမဟုတ် string ကနေ ပြောင်းထားတဲ့ Big integer value | jsonb_path_query('{"len": "9876543219"}', '$.len.bigint()') → 9876543219 |
|  value . decimal( [ precision [ , scale ] ] ) → decimal | JSON number ဒါမှမဟုတ် string ကနေ ပြောင်းထားတဲ့ ပတ်ဖြတ်ထားသော (rounded) decimal value (precision နဲ့ scale တွေက integer values တွေ ဖြစ်ရပါမယ်) | jsonb_path_query('1234.5678', '$.decimal(6, 2)') → 1234.57 |
|  value . integer() → integer | JSON number ဒါမှမဟုတ် string ကနေ ပြောင်းထားတဲ့ Integer value | jsonb_path_query('{"len": "12345"}', '$.len.integer()') → 12345 |
|  value . number() → numeric | JSON number ဒါမှမဟုတ် string ကနေ ပြောင်းထားတဲ့ Numeric value | jsonb_path_query('{"len": "123.45"}', '$.len.number()') → 123.45 |
|  string . datetime() → datetime_type (see note) | String တစ်ခုကနေ ပြောင်းထားတဲ့ Date/time value | jsonb_path_query('["2015-8-1", "2015-08-12"]', '$[*] ? (@.datetime() < "2015-08-2".datetime())') → "2015-8-1" |
|  string . datetime(template) → datetime_type (see note) | String တစ်ခုကနေ — သတ်မှတ်ထားတဲ့ to_timestamp template ကို သုံးပြီး — ပြောင်းထားတဲ့ Date/time value | jsonb_path_query_array('["12:30", "18:40"]', '$[*].datetime("HH24:MI")') → ["12:30:00", "18:40:00"] |
|  string . date() → date | String တစ်ခုကနေ ပြောင်းထားတဲ့ Date value | jsonb_path_query('"2023-08-15"', '$.date()') → "2023-08-15" |
|  string . time() → time without time zone | String တစ်ခုကနေ ပြောင်းထားတဲ့ Time without time zone value | jsonb_path_query('"12:34:56"', '$.time()') → "12:34:56" |
|  string . time(precision) → time without time zone | String တစ်ခုကနေ — fractional seconds တွေကို ပေးထားတဲ့ precision နဲ့ ချိန်ညှိပြီး — ပြောင်းထားတဲ့ Time without time zone value | jsonb_path_query('"12:34:56.789"', '$.time(2)') → "12:34:56.79" |
|  string . time_tz() → time with time zone | String တစ်ခုကနေ ပြောင်းထားတဲ့ Time with time zone value | jsonb_path_query('"12:34:56 +05:30"', '$.time_tz()') → "12:34:56+05:30" |
|  string . time_tz(precision) → time with time zone | String တစ်ခုကနေ — fractional seconds တွေကို ပေးထားတဲ့ precision နဲ့ ချိန်ညှိပြီး — ပြောင်းထားတဲ့ Time with time zone value | jsonb_path_query('"12:34:56.789 +05:30"', '$.time_tz(2)') → "12:34:56.79+05:30" |
|  string . timestamp() → timestamp without time zone | String တစ်ခုကနေ ပြောင်းထားတဲ့ Timestamp without time zone value | jsonb_path_query('"2023-08-15 12:34:56"', '$.timestamp()') → "2023-08-15T12:34:56" |
|  string . timestamp(precision) → timestamp without time zone | String တစ်ခုကနေ — fractional seconds တွေကို ပေးထားတဲ့ precision နဲ့ ချိန်ညှိပြီး — ပြောင်းထားတဲ့ Timestamp without time zone value | jsonb_path_query('"2023-08-15 12:34:56.789"', '$.timestamp(2)') → "2023-08-15T12:34:56.79" |
|  string . timestamp_tz() → timestamp with time zone | String တစ်ခုကနေ ပြောင်းထားတဲ့ Timestamp with time zone value | jsonb_path_query('"2023-08-15 12:34:56 +05:30"', '$.timestamp_tz()') → "2023-08-15T12:34:56+05:30" |
|  string . timestamp_tz(precision) → timestamp with time zone | String တစ်ခုကနေ — fractional seconds တွေကို ပေးထားတဲ့ precision နဲ့ ချိန်ညှိပြီး — ပြောင်းထားတဲ့ Timestamp with time zone value | jsonb_path_query('"2023-08-15 12:34:56.789 +05:30"', '$.timestamp_tz(2)') → "2023-08-15T12:34:56.79+05:30" |
|  object . keyvalue() → array | Object ရဲ့ key-value pairs တွေ — field သုံးခု: "key", "value" နဲ့ "id" ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခုအနေနဲ့ ကိုယ်စားပြုထားပါတယ်; "id" က key-value pair ပါဝင်တဲ့ object ရဲ့ unique identifier ဖြစ်ပါတယ် | jsonb_path_query_array('{"x": "20", "y": 32}', '$.keyvalue()') → [{"id": 0, "key": "x", "value": "20"}, {"id": 0, "key": "y", "value": 32}] |

> **မှတ်ချက်:** `datetime()` နဲ့ `datetime(template)` methods တွေရဲ့ ရလဒ် type က `date`, `timetz`, `time`, `timestamptz` ဒါမှမဟုတ် `timestamp` ဖြစ်နိုင်ပါတယ်။ Method နှစ်ခုလုံးက သူတို့ရဲ့ ရလဒ် type ကို dynamic အနေနဲ့ ဆုံးဖြတ်ပါတယ်။
>
> `datetime()` method က သူ့ရဲ့ input string ကို `date`, `timetz`, `time`, `timestamptz` နဲ့ `timestamp` တို့အတွက် ISO formats တွေနဲ့ အစဉ်လိုက် ကိုက်ညီအောင် စမ်းကြည့်ပါတယ်။ ပထမဆုံး ကိုက်ညီတဲ့ format မှာ ရပ်ပြီး — သက်ဆိုင်တဲ့ data type ကို ထုတ်ပေးပါတယ်။
>
> `datetime(template)` method ကတော့ — ပေးထားတဲ့ template string ထဲမှာ သုံးထားတဲ့ fields တွေအလိုက် ရလဒ် type ကို ဆုံးဖြတ်ပါတယ်။
>
> `datetime()` နဲ့ `datetime(template)` methods တွေက — `to_timestamp` SQL function သုံးတဲ့ parsing rules အတိုင်းပဲ သုံးပါတယ် ([အပိုင်း 9.8](/docs/postgresql/functions-formatting)) — ခြွင်းချက် သုံးခုနဲ့ပါ။ ပထမ — ဒီ methods တွေက မကိုက်ညီတဲ့ template patterns တွေကို ခွင့်မပြုပါဘူး။ ဒုတိယ — template string ထဲမှာ အောက်ပါ separators တွေကိုပဲ ခွင့်ပြုပါတယ်: minus sign, period, solidus (slash), comma, apostrophe, semicolon, colon နဲ့ space။ တတိယ — template string ထဲက separators တွေက input string နဲ့ အတိအကျ ကိုက်ညီရပါမယ်။
>
> Date/time type မတူညီတဲ့ဟာတွေကို နှိုင်းယှဉ်ဖို့ လိုအပ်ရင် — implicit cast တစ်ခုကို အသုံးချပါတယ်။ `date` value တစ်ခုကို `timestamp` သို့မဟုတ် `timestamptz` ဆီ cast လုပ်နိုင်ပြီး — `timestamp` ကို `timestamptz` ဆီ၊ `time` ကို `timetz` ဆီ cast လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် ဒီ conversions တွေထဲက ပထမတစ်ခု ကလွဲလို့ ကျန်တာ အားလုံးက လက်ရှိ [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) setting ပေါ်မှာ မူတည်လို့ — timezone-aware `jsonpath` functions တွေထဲမှာပဲ လုပ်ဆောင်လို့ ရပါတယ်။ အလားတူပဲ — strings တွေကို date/time types တွေအဖြစ် ပြောင်းပေးတဲ့ တခြား date/time ဆိုင်ရာ methods တွေကလည်း — လက်ရှိ [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) setting ပါဝင်နိုင်တဲ့ — ဒီ casting ကို လုပ်ပေးပါတယ်။ ဒါကြောင့် ဒီ conversions တွေကိုလည်း timezone-aware `jsonpath` functions တွေထဲမှာပဲ လုပ်ဆောင်လို့ ရပါတယ်။

ရနိုင်တဲ့ filter expression elements တွေကို ဇယား 9.53 မှာ ပြထားပါတယ်။

**ဇယား 9.53. jsonpath Filter Expression Elements**

| Predicate/Value | Description | Example(s) |
| --- | --- | --- |
|  value == value → boolean | တန်းတူညီမျှမှု နှိုင်းယှဉ်ခြင်း (equality comparison) — ဒါနဲ့ တခြား comparison operators တွေက JSON scalar values တွေ အားလုံးပေါ်မှာ အလုပ်လုပ်ပါတယ် | jsonb_path_query_array('[1, "a", 1, 3]', '$[*] ? (@ == 1)') → [1, 1] jsonb_path_query_array('[1, "a", 1, 3]', '$[*] ? (@ == "a")') → ["a"] |
|  value != value → boolean value <> value → boolean | မညီမျှမှု နှိုင်းယှဉ်ခြင်း (non-equality comparison) | jsonb_path_query_array('[1, 2, 1, 3]', '$[*] ? (@ != 1)') → [2, 3] jsonb_path_query_array('["a", "b", "c"]', '$[*] ? (@ <> "b")') → ["a", "c"] |
|  value < value → boolean | ငယ်သည် နှိုင်းယှဉ်ခြင်း (less-than comparison) | jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ < 2)') → [1] |
|  value <= value → boolean | ငယ်သည် သို့မဟုတ် ညီမျှသည် နှိုင်းယှဉ်ခြင်း (less-than-or-equal-to comparison) | jsonb_path_query_array('["a", "b", "c"]', '$[*] ? (@ <= "b")') → ["a", "b"] |
|  value > value → boolean | ကြီးသည် နှိုင်းယှဉ်ခြင်း (greater-than comparison) | jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ > 2)') → [3] |
|  value >= value → boolean | ကြီးသည် သို့မဟုတ် ညီမျှသည် နှိုင်းယှဉ်ခြင်း (greater-than-or-equal-to comparison) | jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ >= 2)') → [2, 3] |
|  true → boolean | JSON constant true | jsonb_path_query('[{"name": "John", "parent": false}, {"name": "Chris", "parent": true}]', '$[*] ? (@.parent == true)') → {"name": "Chris", "parent": true} |
|  false → boolean | JSON constant false | jsonb_path_query('[{"name": "John", "parent": false}, {"name": "Chris", "parent": true}]', '$[*] ? (@.parent == false)') → {"name": "John", "parent": false} |
|  null → value | JSON constant null (SQL နဲ့ မတူဘဲ — null နဲ့ နှိုင်းယှဉ်တာက ပုံမှန်အတိုင်း အလုပ်လုပ်တယ်ဆိုတာ သတိပြုပါ) | jsonb_path_query('[{"name": "Mary", "job": null}, {"name": "Michael", "job": "driver"}]', '$[*] ? (@.job == null) .name') → "Mary" |
|  boolean && boolean → boolean | Boolean AND | jsonb_path_query('[1, 3, 7]', '$[*] ? (@ > 1 && @ < 5)') → 3 |
|  boolean \|\| boolean → boolean | Boolean OR | jsonb_path_query('[1, 3, 7]', '$[*] ? (@ < 1 \|\| @ > 5)') → 7 |
|  ! boolean → boolean | Boolean NOT | jsonb_path_query('[1, 3, 7]', '$[*] ? (!(@ < 5))') → 7 |
|  boolean is unknown → boolean | Boolean condition တစ်ခု unknown ဖြစ်မဖြစ် စမ်းသပ်ပါတယ်။ | jsonb_path_query('[-1, 2, 7, "foo"]', '$[*] ? ((@ > 0) is unknown)') → "foo" |
|  string like_regex string [ flag string ] → boolean | ပထမ operand က — ဒုတိယ operand က ပေးထားတဲ့ regular expression နဲ့ — flag characters တွေရဲ့ string တစ်ခုက ဖော်ပြတဲ့ ပြုပြင်မှုတွေ ထည့်သွင်းပြီး (optional) — ကိုက်ညီမှု ရှိမရှိ စမ်းသပ်ပါတယ် (Section 9.16.2.4 ကို ကြည့်ပါ) | jsonb_path_query_array('["abc", "abd", "aBdC", "abdacb", "babc"]', '$[*] ? (@ like_regex "^ab.*c")') → ["abc", "abdacb"] jsonb_path_query_array('["abc", "abd", "aBdC", "abdacb", "babc"]', '$[*] ? (@ like_regex "^ab.*c" flag "i")') → ["abc", "aBdC", "abdacb"] |
|  string starts with string → boolean | ဒုတိယ operand က ပထမ operand ရဲ့ အစပိုင်း substring (initial substring) ဟုတ်မဟုတ် စမ်းသပ်ပါတယ်။ | jsonb_path_query('["John Smith", "Mary Stone", "Bob Johnson"]', '$[*] ? (@ starts with "John")') → "John Smith" |
|  exists ( path_expression ) → boolean | Path expression တစ်ခုက SQL/JSON item အနည်းဆုံး တစ်ခုနဲ့ ကိုက်ညီမှု ရှိမရှိ စမ်းသပ်ပါတယ်။ Path expression က error ဖြစ်စေမယ်ဆိုရင် unknown ကို ပြန်ပေးပါတယ်; ဒုတိယ ဥပမာက strict mode မှာ no-such-key error ကို ရှောင်ဖို့ ဒါကို သုံးထားပါတယ်။ | jsonb_path_query('{"x": [1, 2], "y": [2, 4]}', 'strict $.* ? (exists (@ ? (@[*] > 2)))') → [2, 4] jsonb_path_query_array('{"value": 41}', 'strict $ ? (exists (@.name)) .name') → [] |

#### 9.16.2.4. SQL/JSON Regular Expressions (SQL/JSON regular expression များ)

SQL/JSON path expressions တွေက — `like_regex` filter နဲ့ — text တစ်ခုကို regular expression တစ်ခုနဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးခွင့် ပြုပါတယ်။ ဥပမာ — အောက်က SQL/JSON path query က array တစ်ခုထဲက — English vowel (သရ) တစ်ခုနဲ့ စတင်တဲ့ strings တွေ အားလုံးကို — case-insensitively (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိဘဲ) ကိုက်ညီစေပါတယ်:

```
$[*] ? (@ like_regex "^[aeiou]" flag "i")
```

Optional ဖြစ်တဲ့ `flag` string ထဲမှာ — case-insensitive match အတွက် `i`၊ newlines တွေမှာ `^` နဲ့ `$` တွေ ကိုက်ညီခွင့် ပြုဖို့ `m`၊ `.` ကို newline တစ်ခုနဲ့ ကိုက်ညီခွင့် ပြုဖို့ `s`၊ ပြီးတော့ pattern တစ်ခုလုံးကို quote လုပ်ဖို့ (အပြုအမူကို ရိုးရှင်းတဲ့ substring match တစ်ခုအဖြစ် လျှော့ချပေးတဲ့) `q` — ဆိုတဲ့ characters တွေထဲက တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို ပါဝင်နိုင်ပါတယ်။

SQL/JSON standard က regular expressions အတွက် သူ့ရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို `LIKE_REGEX` operator ကနေ ငှားယူထားပြီး — အဲဒီ operator ကလည်း XQuery standard ကို သုံးပါတယ်။ PostgreSQL က `LIKE_REGEX` operator ကို လောလောဆယ် မထောက်ပံ့ပါဘူး။ ဒါကြောင့် — `like_regex` filter ကို [အပိုင်း 9.7.3](/docs/postgresql/functions-matching) မှာ ဖော်ပြထားတဲ့ POSIX regular expression engine ကို သုံးပြီး အကောင်အထည် ဖော်ထားပါတယ်။ ဒါက standard SQL/JSON အပြုအမူကနေ အသေးစား ကွဲလွဲချက်တွေ အမျိုးမျိုး ဖြစ်စေပြီး — [အပိုင်း 9.7.3.8](/docs/postgresql/functions-matching) မှာ စာရင်းပြုထားပါတယ်။ ဒါပေမယ့် — အဲဒီမှာ ဖော်ပြထားတဲ့ flag-letter မကိုက်ညီမှုတွေက SQL/JSON နဲ့တော့ မသက်ဆိုင်ဘူးဆိုတာ သတိပြုပါ — SQL/JSON က XQuery flag letters တွေကို POSIX engine မျှော်လင့်တဲ့ ပုံစံနဲ့ ကိုက်ညီအောင် ပြောင်းပေးလို့ပါ။

`like_regex` ရဲ့ pattern argument က — [အပိုင်း 8.14.7](/docs/postgresql/datatype-json) မှာ ပေးထားတဲ့ စည်းမျဉ်းတွေအတိုင်း ရေးထားတဲ့ — JSON path string literal တစ်ခု ဖြစ်တာ သတိရပါ။ ဆိုလိုတာက — regular expression ထဲမှာ သုံးချင်တဲ့ backslash တိုင်းကို နှစ်ဆ (double) လုပ်ပေးရပါမယ်။ ဥပမာ — root document ရဲ့ string values တွေထဲက ဂဏန်းတွေပဲ ပါဝင်တဲ့ဟာတွေကို ကိုက်ညီစေဖို့:

```
$.* ? (@ like_regex "^\\d+$")
```

### 9.16.3. SQL/JSON Query Functions (SQL/JSON query functions များ)

JSON documents တွေကို query လုပ်ဖို့ — ဇယား 9.54 မှာ ဖော်ပြထားတဲ့ SQL/JSON functions `JSON_EXISTS()`, `JSON_QUERY()` နဲ့ `JSON_VALUE()` တွေကို သုံးနိုင်ပါတယ်။ Function တစ်ခုချင်းစီက `path_expression` (SQL/JSON path query တစ်ခု) ကို `context_item` (document) တစ်ခုပေါ်မှာ အသုံးချပါတယ်။ `path_expression` ထဲမှာ ဘာတွေ ပါဝင်နိုင်တယ်ဆိုတဲ့ အသေးစိတ်အတွက် Section 9.16.2 ကို ကြည့်ပါ။ `path_expression` က variables တွေကိုလည်း ရည်ညွှန်းနိုင်ပြီး — function တစ်ခုချင်းစီမှာ ထောက်ပံ့ထားတဲ့ `PASSING` clause ထဲမှာ သူတို့ရဲ့ နာမည်တွေနဲ့ တန်ဖိုးတွေကို သတ်မှတ်ပေးပါတယ်။ `context_item` က `jsonb` value တစ်ခု ဒါမှမဟုတ် `jsonb` ဆီ အောင်မြင်စွာ cast လုပ်လို့ ရတဲ့ character string တစ်ခု ဖြစ်နိုင်ပါတယ်။

**ဇယား 9.54. SQL/JSON Query Functions**

| Function signature | Description | Example(s) |
| --- | --- | --- |
|  JSON_EXISTS ( context_item, path_expression [ PASSING { value AS varname } [, ...]] [{ TRUE \| FALSE \| UNKNOWN \| ERROR } ON ERROR ]) → boolean | `context_item` ပေါ်မှာ အသုံးချလိုက်တဲ့ SQL/JSON `path_expression` က items တစ်ခုခု ထွက်ပေးရင် true ကို ပြန်ပေးပြီး — မဟုတ်ရင် false ကို ပြန်ပေးပါတယ်။ `ON ERROR` clause က path_expression evaluation အတွင်း error တစ်ခု ဖြစ်ပေါ်ရင် ဘယ်လို ပြုမူမယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ ERROR သတ်မှတ်ထားရင် — သင့်လျော်တဲ့ message နဲ့ error တစ်ခု တက်စေပါတယ်။ တခြား options တွေကတော့ boolean values FALSE ဒါမှမဟုတ် TRUE — ဒါမှမဟုတ် တကယ်တော့ SQL NULL ဖြစ်တဲ့ UNKNOWN value — တွေကို ပြန်ပေးတာတွေ ပါဝင်ပါတယ်။ `ON ERROR` clause မသတ်မှတ်ထားရင် default က boolean value FALSE ကို ပြန်ပေးတာပါ။ | JSON_EXISTS(jsonb '{"key1": [1,2,3]}', 'strict $.key1[*] ? (@ > $x)' PASSING 2 AS x) → t JSON_EXISTS(jsonb '{"a": [1,2,3]}', 'lax $.a[5]' ERROR ON ERROR) → f JSON_EXISTS(jsonb '{"a": [1,2,3]}', 'strict $.a[5]' ERROR ON ERROR) →  ERROR:  jsonpath array subscript is out of bounds |
|  JSON_QUERY ( context_item, path_expression [ PASSING { value AS varname } [, ...]] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ] [ { WITHOUT \| WITH { CONDITIONAL \| [UNCONDITIONAL] } } [ ARRAY ] WRAPPER ] [ { KEEP \| OMIT } QUOTES [ ON SCALAR STRING ] ] [ { ERROR \| NULL \| EMPTY { [ ARRAY ] \| OBJECT } \| DEFAULT expression } ON EMPTY ] [ { ERROR \| NULL \| EMPTY { [ ARRAY ] \| OBJECT } \| DEFAULT expression } ON ERROR ]) → jsonb | `context_item` ပေါ်မှာ SQL/JSON `path_expression` ကို အသုံးချလိုက်တဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။ Default အနေနဲ့ — ရလဒ်ကို jsonb type တန်ဖိုးတစ်ခုအနေနဲ့ ပြန်ပေးပြီး — RETURNING clause ကို သုံးပြီး အောင်မြင်စွာ coerce လုပ်လို့ ရတဲ့ တခြား type တစ်ခုခုအနေနဲ့လည်း ပြန်ပေးလို့ ရပါတယ်။ Path expression က တန်ဖိုး အများအပြား ပြန်ပေးနိုင်ရင် — အဲဒီ values တွေကို valid JSON string တစ်ခု ဖြစ်အောင် WITH WRAPPER clause နဲ့ ပတ်ဖို့ (wrap) လိုအပ်နိုင်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ default အပြုအမူက WITHOUT WRAPPER သတ်မှတ်ထားသလိုမျိုး — သူတို့ကို မပတ်ဘဲ ထားလို့ပါ။ WITH WRAPPER clause ကို default အနေနဲ့ WITH UNCONDITIONAL WRAPPER လို့ ယူဆပြီး — အဲဒါက ရလဒ် တစ်ခုတည်း ဖြစ်နေရင်တောင် ပတ်ပေးတာကို ဆိုလိုပါတယ်။ တန်ဖိုး အများအပြား ရှိနေမှပဲ wrapper ကို အသုံးချချင်ရင် WITH CONDITIONAL WRAPPER ကို သတ်မှတ်ပါ။ WITHOUT WRAPPER သတ်မှတ်ထားရင် — ရလဒ်ထဲမှာ တန်ဖိုး အများအပြား ပါလာတာကို error အဖြစ် သဘောထားပါတယ်။ ရလဒ်က scalar string တစ်ခု ဆိုရင် — default အနေနဲ့ — ပြန်ပေးတဲ့ တန်ဖိုးကို quotes တွေနဲ့ ဝန်းရံပြီး — valid JSON value ဖြစ်အောင် လုပ်ပါတယ်။ KEEP QUOTES သတ်မှတ်ပြီး ဒါကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်ပါတယ်။ အပြန်အလှန်အနေနဲ့ — OMIT QUOTES သတ်မှတ်ပြီး quotes တွေကို ချန်လှပ်နိုင်ပါတယ်။ ရလဒ်က valid JSON value ဖြစ်ကြောင်း သေချာစေဖို့ — WITH WRAPPER ပါ သတ်မှတ်ထားတဲ့အခါ OMIT QUOTES ကို သတ်မှတ်လို့ မရပါဘူး။ `ON EMPTY` clause က path_expression evaluation က empty set တစ်ခု ထွက်ပေးရင် ဘယ်လို ပြုမူမယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ `ON ERROR` clause ကတော့ — path_expression ကို အကဲဖြတ်တဲ့အခါ၊ ရလဒ် တန်ဖိုးကို RETURNING type ဆီ coerce လုပ်တဲ့အခါ၊ ဒါမှမဟုတ် path_expression evaluation က empty set ပြန်ပေးတဲ့အခါ ON EMPTY expression ကို အကဲဖြတ်တဲ့အခါ — error တစ်ခု ဖြစ်ပေါ်ရင် ဘယ်လို ပြုမူမယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ ON EMPTY ရော ON ERROR နှစ်ခုလုံးအတွက် — ERROR သတ်မှတ်ထားရင် သင့်လျော်တဲ့ message နဲ့ error တစ်ခု တက်စေပါတယ်။ တခြား options တွေကတော့ SQL NULL တစ်ခု၊ empty array တစ်ခု (EMPTY [ARRAY])၊ empty object တစ်ခု (EMPTY OBJECT) ဒါမှမဟုတ် — jsonb ဒါမှမဟုတ် RETURNING မှာ သတ်မှတ်ထားတဲ့ type ဆီ coerce လုပ်လို့ ရတဲ့ — user သတ်မှတ်ထားတဲ့ expression (DEFAULT expression) တစ်ခုကို ပြန်ပေးတာတွေ ပါဝင်ပါတယ်။ ON EMPTY ဒါမှမဟုတ် ON ERROR မသတ်မှတ်ထားရင် default က SQL NULL value တစ်ခုကို ပြန်ပေးတာပါ။ | JSON_QUERY(jsonb '[1,[2,3],null]', 'lax $[*][$off]' PASSING 1 AS off WITH CONDITIONAL WRAPPER) → 3 JSON_QUERY(jsonb '{"a": "[1, 2]"}', 'lax $.a' OMIT QUOTES) → [1, 2] JSON_QUERY(jsonb '{"a": "[1, 2]"}', 'lax $.a' RETURNING int[] OMIT QUOTES ERROR ON ERROR) →  ERROR:  malformed array literal: "[1, 2]" DETAIL:  Missing "]" after array dimensions. |
|  JSON_VALUE ( context_item, path_expression [ PASSING { value AS varname } [, ...]] [ RETURNING data_type ] [ { ERROR \| NULL \| DEFAULT expression } ON EMPTY ] [ { ERROR \| NULL \| DEFAULT expression } ON ERROR ]) → text | `context_item` ပေါ်မှာ SQL/JSON `path_expression` ကို အသုံးချလိုက်တဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။ ထုတ်ယူလိုက်တဲ့ တန်ဖိုးက SQL/JSON scalar item တစ်ခုတည်း ဖြစ်မယ်လို့ မျှော်လင့်ရမှသာ `JSON_VALUE()` ကို သုံးပါ — တန်ဖိုး အများအပြား ရလာရင် error အဖြစ် သဘောထားပါတယ်။ ထုတ်ယူလိုက်တဲ့ တန်ဖိုးက object ဒါမှမဟုတ် array ဖြစ်နိုင်မယ်လို့ မျှော်လင့်ရင် — `JSON_QUERY` function ကို အဲဒီအစား သုံးပါ။ Default အနေနဲ့ — scalar value တစ်ခုတည်း ဖြစ်ရမယ့် — ရလဒ်ကို text type တန်ဖိုးတစ်ခုအနေနဲ့ ပြန်ပေးပြီး — RETURNING clause ကို သုံးပြီး အောင်မြင်စွာ coerce လုပ်လို့ ရတဲ့ တခြား type တစ်ခုခုအနေနဲ့လည်း ပြန်ပေးလို့ ရပါတယ်။ `ON ERROR` နဲ့ `ON EMPTY` clauses တွေက — error တစ်ခု တက်စေမယ့်အစား ပြန်ပေးတဲ့ တန်ဖိုးအစုက မတူတာကလွဲလို့ — JSON_QUERY ရဲ့ ဖော်ပြချက်ထဲမှာ ဖော်ပြခဲ့တဲ့အတိုင်း — semantics ဆင်တူပါတယ်။ `JSON_VALUE` က ပြန်ပေးတဲ့ scalar strings တွေရဲ့ quotes တွေကို အမြဲတမ်း ဖယ်ရှားပေးတယ်ဆိုတာ သတိပြုပါ — JSON_QUERY မှာ OMIT QUOTES သတ်မှတ်တာနဲ့ ညီမျှပါတယ်။ | JSON_VALUE(jsonb '"123.45"', '$' RETURNING float) → 123.45 JSON_VALUE(jsonb '"03:04 2015-02-01"', '$.datetime("HH24:MI YYYY-MM-DD")' RETURNING date) → 2015-02-01 JSON_VALUE(jsonb '[1,2]', 'strict $[$off]' PASSING 1 as off) → 2 JSON_VALUE(jsonb '[1,2]', 'strict $[*]' DEFAULT 9 ON ERROR) → 9 |

> **မှတ်ချက်:** `context_item` expression က jsonb type မဟုတ်သေးဘူးဆိုရင် — implicit cast တစ်ခုနဲ့ `jsonb` အဖြစ် ပြောင်းပါတယ်။ ဒါပေမယ့် — အဲဒီ conversion အတွင်း ဖြစ်ပေါ်တဲ့ parsing errors တွေကို (သတ်မှတ်ထားတဲ့ ဒါမှမဟုတ် implicit) `ON ERROR` clause အတိုင်း ကိုင်တွယ်တာ မဟုတ်ဘဲ — ခြွင်းချက် မရှိ လွှင့်ပစ်ခံရတယ်ဆိုတာ သတိပြုပါ။

> **မှတ်ချက်:** `path_expression` က JSON `null` တစ်ခုကို ပြန်ပေးရင် `JSON_VALUE()` က SQL NULL တစ်ခုကို ပြန်ပေးပြီး — `JSON_QUERY()` ကတော့ JSON `null` ကို မူလအတိုင်း ပြန်ပေးပါတယ်။

### 9.16.4. JSON_TABLE (JSON_TABLE)

`JSON_TABLE` က — JSON data တွေကို query လုပ်ပြီး — ရလဒ်တွေကို relational view တစ်ခုအနေနဲ့ တင်ပြပေးတဲ့ SQL/JSON function တစ်ခုပါ — အဲဒီ view ကို သာမန် SQL table တစ်ခုလို ဝင်ရောက်လို့ ရပါတယ်။ `JSON_TABLE` ကို `SELECT`, `UPDATE` ဒါမှမဟုတ် `DELETE` တစ်ခုရဲ့ `FROM` clause ထဲမှာ သုံးနိုင်သလို — `MERGE` statement တစ်ခုထဲမှာ data source အဖြစ်လည်း သုံးနိုင်ပါတယ်။

JSON data ကို input အနေနဲ့ ယူပြီး — `JSON_TABLE` က JSON path expression တစ်ခုကို သုံးပြီး — တည်ဆောက်မယ့် view အတွက် *row pattern* တစ်ခုအနေနဲ့ သုံးဖို့ — ပေးထားတဲ့ data ရဲ့ အစိတ်အပိုင်းတစ်ခုကို ထုတ်ယူပါတယ်။ Row pattern က ပေးတဲ့ SQL/JSON value တစ်ခုချင်းစီက — တည်ဆောက်ထားတဲ့ view ထဲက သီးခြား row တစ်တန်းစီအတွက် source အဖြစ် ဆောင်ရွက်ပါတယ်။

Row pattern ကို columns တွေအဖြစ် ခွဲဖို့ — `JSON_TABLE` က ဖန်တီးလိုက်တဲ့ view ရဲ့ schema ကို သတ်မှတ်ပေးတဲ့ `COLUMNS` clause ကို ထောက်ပံ့ပေးပါတယ်။ Column တစ်ခုချင်းစီအတွက် — row pattern ပေါ်မှာ အကဲဖြတ်ပြီး — output row တစ်တန်းထဲက သတ်မှတ်ထားတဲ့ column အတွက် တန်ဖိုး ဖြစ်လာမယ့် SQL/JSON value တစ်ခုကို ရဖို့ — သီးခြား JSON path expression တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။

Row pattern ရဲ့ nested level တစ်ခုမှာ သိမ်းထားတဲ့ JSON data တွေကို `NESTED PATH` clause သုံးပြီး ထုတ်ယူနိုင်ပါတယ်။ `NESTED PATH` clause တစ်ခုချင်းစီကို — row pattern ရဲ့ nested level တစ်ခုကနေ data သုံးပြီး — column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို ထုတ်လုပ်ဖို့ သုံးနိုင်ပါတယ်။ အဲဒီ columns တွေကို top-level COLUMNS clause နဲ့ ဆင်တူတဲ့ `COLUMNS` clause တစ်ခုနဲ့ သတ်မှတ်နိုင်ပါတယ်။ NESTED COLUMNS တွေကနေ တည်ဆောက်ထားတဲ့ rows တွေကို *child rows* လို့ ခေါ်ပြီး — နောက်ဆုံး view ထဲက row ကို ရဖို့ — parent `COLUMNS` clause ထဲမှာ သတ်မှတ်ထားတဲ့ columns တွေကနေ တည်ဆောက်ထားတဲ့ row နဲ့ join လုပ်ပါတယ်။ Child columns တွေကိုယ်တိုင်မှာလည်း `NESTED PATH` specification ပါဝင်နိုင်ပြီး — ဒါကြောင့် ကြိုက်ရာ nesting levels တွေမှာ ရှိတဲ့ data တွေကို ထုတ်ယူလို့ ရပါတယ်။ အဆင့်တူ `NESTED PATH` အများအပြားက ထုတ်လုပ်တဲ့ columns တွေကို တစ်ခုနဲ့တစ်ခု *siblings* အဖြစ် သတ်မှတ်ပြီး — parent row နဲ့ join လုပ်ပြီးနောက် သူတို့ရဲ့ rows တွေကို UNION သုံးပြီး ပေါင်းစည်းပါတယ်။

`JSON_TABLE` က ထုတ်လုပ်တဲ့ rows တွေကို — သူတို့ကို ထုတ်လုပ်ပေးတဲ့ row နဲ့ — laterally join လုပ်ပါတယ် — ဒါကြောင့် တည်ဆောက်ထားတဲ့ view ကို JSON data သိမ်းထားတဲ့ မူရင်း table နဲ့ ကိုယ်တိုင် join လုပ်စရာ မလိုပါဘူး။

Syntax ကတော့:

```sql
JSON_TABLE (
    context_item, path_expression [ AS json_path_name ] [ PASSING { value AS varname } [, ...] ]
    COLUMNS ( json_table_column [, ...] )
    [ { ERROR | EMPTY [ARRAY]} ON ERROR ]
)

where json_table_column is:

  name FOR ORDINALITY
  | name type
        [ FORMAT JSON [ENCODING UTF8]]
        [ PATH path_expression ]
        [ { WITHOUT | WITH { CONDITIONAL | [UNCONDITIONAL] } } [ ARRAY ] WRAPPER ]
        [ { KEEP | OMIT } QUOTES [ ON SCALAR STRING ] ]
        [ { ERROR | NULL | EMPTY { [ARRAY] | OBJECT } | DEFAULT expression } ON EMPTY ]
        [ { ERROR | NULL | EMPTY { [ARRAY] | OBJECT } | DEFAULT expression } ON ERROR ]
  | name type EXISTS [ PATH path_expression ]
        [ { ERROR | TRUE | FALSE | UNKNOWN } ON ERROR ]
  | NESTED [ PATH ] path_expression [ AS json_path_name ] COLUMNS ( json_table_column [, ...] )
```

Syntax element တစ်ခုချင်းစီကို အောက်မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

- **context_item, path_expression [ AS json_path_name ] [ PASSING { value AS varname } [, ...]]** — context_item က query လုပ်ရမယ့် input document ကို သတ်မှတ်ပြီး — path_expression က query ကို သတ်မှတ်ပေးတဲ့ SQL/JSON path expression ဖြစ်ပြီး — json_path_name ကတော့ path_expression အတွက် optional name တစ်ခု ဖြစ်ပါတယ်။ Optional PASSING clause က path_expression ထဲမှာ ဖော်ပြထားတဲ့ variables တွေအတွက် data values တွေ ထောက်ပံ့ပေးပါတယ်။ အထက်ပါ elements တွေကို သုံးပြီး input data ကို အကဲဖြတ်တဲ့ ရလဒ်ကို row pattern လို့ ခေါ်ပြီး — တည်ဆောက်ထားတဲ့ view ထဲက row values တွေအတွက် source အဖြစ် သုံးပါတယ်။
- **COLUMNS ( json_table_column [, ...] )** — တည်ဆောက်ထားတဲ့ view ရဲ့ schema ကို သတ်မှတ်ပေးတဲ့ COLUMNS clause ဖြစ်ပါတယ်။ ဒီ clause ထဲမှာ — column တစ်ခုချင်းစီကို row pattern ပေါ်မှာ JSON path expression တစ်ခု အသုံးချပြီး ရလာတဲ့ SQL/JSON value တစ်ခုနဲ့ ဖြည့်ဖို့ သတ်မှတ်နိုင်ပါတယ်။ json_table_column မှာ အောက်ပါ မူကွဲတွေ (variants) ရှိပါတယ်:

name FOR ORDINALITY

1 ကနေ စတင်တဲ့ sequential row numbering တွေ ထောက်ပံ့ပေးတဲ့ ordinality column တစ်ခုကို ထည့်ပေးပါတယ်။ NESTED PATH တစ်ခုချင်းစီ (အောက်မှာ ကြည့်ပါ) က nested ordinality columns တွေအတွက် သူ့ပိုင် counter တစ်ခုစီ ရပါတယ်။

name type [FORMAT JSON [ENCODING UTF8]] [ PATH path_expression ]

Row pattern ပေါ်မှာ path_expression ကို အသုံးချပြီး ရလာတဲ့ SQL/JSON value တစ်ခုကို — သတ်မှတ်ထားတဲ့ type ဆီ coerce လုပ်ပြီး — view ရဲ့ output row ထဲ ထည့်သွင်းပါတယ်။ FORMAT JSON သတ်မှတ်တာက — value က valid json object တစ်ခု ဖြစ်မယ်လို့ မျှော်လင့်ကြောင်း ရှင်းရှင်းလင်းလင်း ဖော်ပြတာပါ။ type က bpchar, bytea, character varying, name, json, jsonb, text ဒါမှမဟုတ် ဒီ types တွေအပေါ်က domain တစ်ခု ဖြစ်မှသာ FORMAT JSON သတ်မှတ်တာ အဓိပ္ပာယ် ရှိပါတယ်။ Output ကို ပုံစံချဖို့ WRAPPER နဲ့ QUOTES clauses တွေကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ OMIT QUOTES ကို FORMAT JSON နဲ့အတူ ပါ သတ်မှတ်ထားရင် — OMIT QUOTES က FORMAT JSON ကို ကျော်လွန် သက်ရောက်တယ်ဆိုတာ သတိပြုပါ — quote မလုပ်ထားတဲ့ literals တွေက valid json values တွေ မဖြစ်လို့ပါ။ JSON path evaluation ရဲ့ ရလဒ် က empty ဖြစ်နေတဲ့အခါ ဒါမှမဟုတ် — JSON path evaluation ဒါမှမဟုတ် SQL/JSON value ကို သတ်မှတ်ထားတဲ့ type ဆီ coerce လုပ်တဲ့အခါ error ဖြစ်ပေါ်တဲ့အခါ — error ကို လွှင့်ပစ်မလား ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ တန်ဖိုးကို ပြန်ပေးမလားဆိုတာ ON EMPTY နဲ့ ON ERROR clauses တွေနဲ့ optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ နှစ်ခုလုံးအတွက် default က NULL value တစ်ခု ပြန်ပေးတာပါ။

> **မှတ်ချက်:** ဒီ clause က အတွင်းပိုင်းမှာ JSON_VALUE သို့မဟုတ် JSON_QUERY အဖြစ် ပြောင်းလဲပြီး — သူတို့နဲ့ semantics အတူတူ ရှိပါတယ်။ သတ်မှတ်ထားတဲ့ type က scalar type မဟုတ်ဘူးဆိုရင် ဒါမှမဟုတ် FORMAT JSON, WRAPPER, QUOTES clause တစ်ခုခု ပါဝင်နေရင်တော့ နောက်တစ်ခု (JSON_QUERY) ကို သုံးပါတယ်။

name type EXISTS [ PATH path_expression ]

Row pattern ပေါ်မှာ path_expression ကို အသုံးချပြီး ရလာတဲ့ boolean value တစ်ခုကို — သတ်မှတ်ထားတဲ့ type ဆီ coerce လုပ်ပြီး — view ရဲ့ output row ထဲ ထည့်သွင်းပါတယ်။ ဒီ value က — PATH expression ကို row pattern ပေါ်မှာ အသုံးချတာက values တစ်ခုခု ထွက်ပေးသလားဆိုတာနဲ့ ကိုက်ညီပါတယ်။ သတ်မှတ်ထားတဲ့ type မှာ boolean type ကနေ cast တစ်ခု ရှိသင့်ပါတယ်။ JSON path evaluation ဒါမှမဟုတ် SQL/JSON value ကို သတ်မှတ်ထားတဲ့ type ဆီ coerce လုပ်တဲ့အခါ error ဖြစ်ပေါ်ရင် — error ကို လွှင့်ပစ်မလား ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ တန်ဖိုးကို ပြန်ပေးမလားဆိုတာ ON ERROR နဲ့ optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ Default က boolean value FALSE ကို ပြန်ပေးတာပါ။

> **မှတ်ချက်:** ဒီ clause က အတွင်းပိုင်းမှာ JSON_EXISTS အဖြစ် ပြောင်းလဲပြီး — semantics အတူတူ ရှိပါတယ်။

NESTED [ PATH ] path_expression [ AS json_path_name ] COLUMNS ( json_table_column [, ...] )

Row pattern ရဲ့ nested levels တွေကနေ SQL/JSON values တွေကို ထုတ်ယူပြီး — COLUMNS subclause က သတ်မှတ်ထားတဲ့အတိုင်း column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို ထုတ်လုပ်ပြီး — ထုတ်ယူထားတဲ့ SQL/JSON values တွေကို အဲဒီ columns တွေထဲ ထည့်သွင်းပါတယ်။ COLUMNS subclause ထဲက json_table_column expression က parent COLUMNS clause ထဲမှာ သုံးတဲ့ syntax အတိုင်းပဲ ဖြစ်ပါတယ်။ NESTED PATH syntax က recursive ဖြစ်လို့ — NESTED PATH subclauses တွေကို တစ်ခုထဲမှာ တစ်ခု သတ်မှတ်ပြီး — nested levels အများအပြား ဆင်းနိုင်ပါတယ်။ ဒါက SQL statement တစ်ခုထဲမှာ JSON_TABLE expressions တွေ အများအပြားကို ဆက်တိုက် ချိတ်စရာ မလိုဘဲ — JSON objects နဲ့ arrays တွေရဲ့ hierarchy တစ်ခုလုံးကို function invocation တစ်ခုတည်းနဲ့ unnest လုပ်ခွင့် ပြုပါတယ်။

> **မှတ်ချက်:** အပေါ်မှာ ဖော်ပြထားတဲ့ json_table_column မူကွဲတိုင်းမှာ — PATH clause ကို ချန်လိုက်ရင် — path expression `$.name` ကို သုံးပြီး — name က ပေးထားတဲ့ column name ဖြစ်ပါတယ်။
- **AS json_path_name** — Optional ဖြစ်တဲ့ json_path_name က ပေးထားတဲ့ path_expression ရဲ့ identifier တစ်ခုအနေနဲ့ ဆောင်ရွက်ပါတယ်။ နာမည်က unique ဖြစ်ပြီး — column names တွေနဲ့ မတူညီရပါဘူး။
- **{ ERROR | EMPTY } ON ERROR** — Optional ON ERROR ကို — top-level path_expression ကို အကဲဖြတ်တဲ့အခါ errors တွေကို ဘယ်လို ကိုင်တွယ်မယ်ဆိုတာ သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်။ Errors တွေ တက်စေချင်ရင် ERROR ကို သုံးပြီး — row 0 ပါတဲ့ table (empty table) ကို ပြန်ပေးချင်ရင် EMPTY ကို သုံးပါ။ ဒီ clause က columns တွေကို အကဲဖြတ်တဲ့အခါ ဖြစ်ပေါ်တဲ့ errors တွေကိုတော့ မသက်ရောက်ဘူးဆိုတာ သတိပြုပါ — အဲဒီအပြုအမူက ပေးထားတဲ့ column တစ်ခုအပေါ်မှာ ON ERROR clause သတ်မှတ်ထားခြင်း ရှိ/မရှိပေါ်မှာ မူတည်ပါတယ်။

**ဥပမာများ**

အောက်က ဥပမာတွေမှာ — JSON data ပါဝင်တဲ့ အောက်ပါ table ကို သုံးပါလိမ့်မယ်:

```sql
CREATE TABLE my_films ( js jsonb );

INSERT INTO my_films VALUES (
'{ "favorites" : [
   { "kind" : "comedy", "films" : [
     { "title" : "Bananas",
       "director" : "Woody Allen"},
     { "title" : "The Dinner Game",
       "director" : "Francis Veber" } ] },
   { "kind" : "horror", "films" : [
     { "title" : "Psycho",
       "director" : "Alfred Hitchcock" } ] },
   { "kind" : "thriller", "films" : [
     { "title" : "Vertigo",
       "director" : "Alfred Hitchcock" } ] },
   { "kind" : "drama", "films" : [
     { "title" : "Yojimbo",
       "director" : "Akira Kurosawa" } ] }
  ] }');
```

အောက်က query က — `my_films` table ထဲက JSON objects တွေကို — မူရင်း JSON ထဲမှာ ပါဝင်တဲ့ `kind`, `title` နဲ့ `director` keys တွေအတွက် columns တွေ ပါဝင်ပြီး ordinality column တစ်ခုပါတဲ့ — view တစ်ခုအဖြစ် ပြောင်းဖို့ `JSON_TABLE` ကို ဘယ်လို သုံးတယ်ဆိုတာ ပြထားပါတယ်:

```sql
SELECT jt.* FROM
 my_films,
 JSON_TABLE (js, '$.favorites[*]' COLUMNS (
   id FOR ORDINALITY,
   kind text PATH '$.kind',
   title text PATH '$.films[*].title' WITH WRAPPER,
   director text PATH '$.films[*].director' WITH WRAPPER)) AS jt;
```

```sql
 id |   kind   |             title              |             director
----+----------+--------------------------------+----------------------------------
  1 | comedy   | ["Bananas", "The Dinner Game"] | ["Woody Allen", "Francis Veber"]
  2 | horror   | ["Psycho"]                     | ["Alfred Hitchcock"]
  3 | thriller | ["Vertigo"]                    | ["Alfred Hitchcock"]
  4 | drama    | ["Yojimbo"]                    | ["Akira Kurosawa"]
(4 rows)
```

အောက်က ဥပမာက — အပေါ်က query ရဲ့ ပြုပြင်ထားတဲ့ မူကွဲတစ်ခု ဖြစ်ပြီး — top-level JSON path expression ထဲမှာ သတ်မှတ်ထားတဲ့ filter ထဲမှာ `PASSING` arguments တွေ သုံးပုံနဲ့ — column တစ်ခုချင်းစီအတွက် option အမျိုးမျိုး သုံးပုံတွေကို ပြထားပါတယ်:

```sql
SELECT jt.* FROM
 my_films,
 JSON_TABLE (js, '$.favorites[*] ? (@.films[*].director == $filter)'
   PASSING 'Alfred Hitchcock' AS filter
     COLUMNS (
     id FOR ORDINALITY,
     kind text PATH '$.kind',
     title text FORMAT JSON PATH '$.films[*].title' OMIT QUOTES,
     director text PATH '$.films[*].director' KEEP QUOTES)) AS jt;
```

```sql
 id |   kind   |  title  |      director
----+----------+---------+--------------------
  1 | horror   | Psycho  | "Alfred Hitchcock"
  2 | thriller | Vertigo | "Alfred Hitchcock"
(2 rows)
```

အောက်က ဥပမာက — title နဲ့ director columns တွေကို ဖြည့်ဖို့ `NESTED PATH` သုံးပုံကို ပြထားတဲ့ အပေါ်က query ရဲ့ ပြုပြင်ထားတဲ့ မူကွဲတစ်ခု ဖြစ်ပြီး — သူတို့ကို parent columns ဖြစ်တဲ့ id နဲ့ kind နဲ့ ဘယ်လို join လုပ်လဲဆိုတာကို သရုပ်ပြပါတယ်:

```sql
SELECT jt.* FROM
 my_films,
 JSON_TABLE ( js, '$.favorites[*] ? (@.films[*].director == $filter)'
   PASSING 'Alfred Hitchcock' AS filter
   COLUMNS (
    id FOR ORDINALITY,
    kind text PATH '$.kind',
    NESTED PATH '$.films[*]' COLUMNS (
      title text FORMAT JSON PATH '$.title' OMIT QUOTES,
      director text PATH '$.director' KEEP QUOTES))) AS jt;
```

```sql
 id |   kind   |  title  |      director
----+----------+---------+--------------------
  1 | horror   | Psycho  | "Alfred Hitchcock"
  2 | thriller | Vertigo | "Alfred Hitchcock"
(2 rows)
```

အောက်က ဥပမာက — root path ထဲမှာ filter မပါတဲ့ — အပေါ်က query နဲ့ အတူတူပါပဲ:

```sql
SELECT jt.* FROM
 my_films,
 JSON_TABLE ( js, '$.favorites[*]'
   COLUMNS (
    id FOR ORDINALITY,
    kind text PATH '$.kind',
    NESTED PATH '$.films[*]' COLUMNS (
      title text FORMAT JSON PATH '$.title' OMIT QUOTES,
      director text PATH '$.director' KEEP QUOTES))) AS jt;
```

```sql
 id |   kind   |      title      |      director
----+----------+-----------------+--------------------
  1 | comedy   | Bananas         | "Woody Allen"
  1 | comedy   | The Dinner Game | "Francis Veber"
  2 | horror   | Psycho          | "Alfred Hitchcock"
  3 | thriller | Vertigo         | "Alfred Hitchcock"
  4 | drama    | Yojimbo         | "Akira Kurosawa"
(5 rows)
```

အောက်က ဥပမာက — input အနေနဲ့ မတူညီတဲ့ `JSON` object တစ်ခုကို သုံးထားတဲ့ နောက် query တစ်ခု ဖြစ်ပါတယ်။ `NESTED` paths `$.movies[*]` နဲ့ `$.books[*]` တွေကြားက UNION “sibling join” ကိုရော — `NESTED` levels တွေမှာ `FOR ORDINALITY` column သုံးပုံ (columns `movie_id`, `book_id` နဲ့ `author_id`) ကိုပါ ပြထားပါတယ်:

```sql
SELECT * FROM JSON_TABLE (
'{"favorites":
    [{"movies":
      [{"name": "One", "director": "John Doe"},
       {"name": "Two", "director": "Don Joe"}],
     "books":
      [{"name": "Mystery", "authors": [{"name": "Brown Dan"}]},
       {"name": "Wonder", "authors": [{"name": "Jun Murakami"}, {"name":"Craig Doe"}]}]
}]}'::json, '$.favorites[*]'
COLUMNS (
  user_id FOR ORDINALITY,
  NESTED '$.movies[*]'
    COLUMNS (
    movie_id FOR ORDINALITY,
    mname text PATH '$.name',
    director text),
  NESTED '$.books[*]'
    COLUMNS (
      book_id FOR ORDINALITY,
      bname text PATH '$.name',
      NESTED '$.authors[*]'
        COLUMNS (
          author_id FOR ORDINALITY,
          author_name text PATH '$.name'))));
```

```sql
 user_id | movie_id | mname | director | book_id |  bname  | author_id | author_name
---------+----------+-------+----------+---------+---------+-----------+--------------
       1 |        1 | One   | John Doe |         |         |           |
       1 |        2 | Two   | Don Joe  |         |         |           |
       1 |          |       |          |       1 | Mystery |         1 | Brown Dan
       1 |          |       |          |       2 | Wonder  |         1 | Jun Murakami
       1 |          |       |          |       2 | Wonder  |         2 | Craig Doe
(5 rows)
```
