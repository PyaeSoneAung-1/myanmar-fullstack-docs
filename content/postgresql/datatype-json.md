---
title: "JSON Types (JSON type များ)"
description: "JSON data type နှစ်မျိုးဖြစ်တဲ့ json နှင့် jsonb — သိမ်းဆည်းပုံ ကွာခြားချက်၊ input/output syntax၊ jsonb containment/existence နှင့် indexing၊ transforms၊ jsonpath type"
order: 61
source: "https://www.postgresql.org/docs/current/datatype-json.html"
status: translated
updated: 2026-09-03
---

## 8.14. JSON Types (JSON type များ)

- **8.14.1. JSON Input and Output Syntax (JSON input နှင့် output syntax)**
- **8.14.2. Designing JSON Documents (JSON document များ ရေးဆွဲခြင်း)**
- **8.14.3. jsonb Containment and Existence (jsonb containment နှင့် existence)**
- **8.14.4. jsonb Indexing (jsonb index ပြုလုပ်ခြင်း)**
- **8.14.5. jsonb Subscripting (jsonb subscript ပြုလုပ်ခြင်း)**
- **8.14.6. Transforms (jsonb type transforms များ)**
- **8.14.7. jsonpath Type (jsonpath type)**

JSON data types ဆိုတာ — [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159) မှာ သတ်မှတ်ထားတဲ့အတိုင်း — JSON (JavaScript Object Notation) data တွေကို သိမ်းဆည်းဖို့ သုံးတဲ့ data types တွေ ဖြစ်ပါတယ်။ ဒီလို data တွေကို `text` အနေနဲ့လည်း သိမ်းဆည်းလို့ ရပါတယ် — ဒါပေမယ့် JSON data types တွေမှာ သိမ်းဆည်းလိုက်တဲ့ တန်ဖိုးတိုင်းက JSON စည်းမျဉ်းတွေနဲ့အညီ valid (မှန်ကန်သော) ဖြစ်ကြောင်း အတင်းအကျပ် စစ်ဆေးပေးတဲ့ အားသာချက် ရှိပါတယ်။ ဒီ data types တွေထဲမှာ သိမ်းထားတဲ့ data တွေအတွက် JSON-specific function နဲ့ operator အမျိုးမျိုးလည်း ရနိုင်ပါတယ်; [အပိုင်း 9.16](/docs/postgresql/functions-json) ကို ကြည့်ပါ။

JSON data တွေကို သိမ်းဆည်းဖို့ PostgreSQL က type နှစ်မျိုး ပေးထားပါတယ်: `json` နဲ့ `jsonb`။ ဒီ data types တွေအတွက် ထိရောက်တဲ့ query ယန္တရားတွေ (mechanisms) အကောင်အထည်ဖော်နိုင်ဖို့ — PostgreSQL က [အပိုင်း 8.14.7](/docs/postgresql/datatype-json) မှာ ဖော်ပြထားတဲ့ `jsonpath` data type ကိုလည်း ထောက်ပံ့ပေးပါတယ်။

`json` နဲ့ `jsonb` data types နှစ်ခုလုံးက input အဖြစ် လက်ခံတဲ့ တန်ဖိုးအစုတွေကတော့ လုံးလုနီးပါး တူညီပါတယ်။ လက်တွေ့မှာ အဓိက ကွာခြားချက်က ထိရောက်မှု (efficiency) ပိုင်းပါ။ `json` data type က input text ရဲ့ ပုံတူအတိအကျ (exact copy) ကို သိမ်းဆည်းပြီး — processing function တွေက execute တစ်ကြိမ်စီမှာ အဲဒီ text ကို ပြန်ပြီး parse လုပ်ရပါတယ်; `jsonb` data ကတော့ ခွဲခြမ်းစိတ်ဖြာထားတဲ့ (decomposed) binary format နဲ့ သိမ်းဆည်းလို့ — conversion overhead ကြောင့် input လုပ်တာ နည်းနည်း ပိုနှေးပေမယ့် — ပြန်ပြီး parse လုပ်စရာ မလိုတာကြောင့် — process လုပ်တာ သိသိသာသာ မြန်ဆန်ပါတယ်။ `jsonb` က indexing ကိုလည်း ထောက်ပံ့ပြီး — ဒါက သိသာတဲ့ အားသာချက် တစ်ခု ဖြစ်နိုင်ပါတယ်။

`json` type က input text ရဲ့ ပုံတူအတိအကျကို သိမ်းဆည်းတာမို့ — token တွေကြားက အဓိပ္ပာယ် မရှိတဲ့ (semantically-insignificant) white space တွေကိုရော၊ JSON object ထဲက key တွေရဲ့ အစဉ်ကိုပါ ထိန်းသိမ်းပေးပါတယ်။ ပြီးတော့ — JSON object တစ်ခုအတွင်းမှာ key တစ်ခုတည်းကို တစ်ကြိမ်ထက်ပိုပြီး သုံးထားရင်လည်း — key/value pair တွေ အားလုံးကို သိမ်းထားပါတယ်။ (Processing function တွေကတော့ နောက်ဆုံး value ကိုပဲ အလုပ်ဖြစ်တဲ့ဟာ (operative one) အဖြစ် သတ်မှတ်ပါတယ်။) ဆန့်ကျင်ဘက်အနေနဲ့ — `jsonb` ကတော့ white space ကို မထိန်းသိမ်းပါဘူး၊ object key တွေရဲ့ အစဉ်ကိုလည်း မထိန်းသိမ်းပါဘူး၊ duplicate object key တွေကိုလည်း မသိမ်းပါဘူး။ Input မှာ duplicate keys တွေ သတ်မှတ်ထားရင် — နောက်ဆုံး value ကိုပဲ သိမ်းပါတယ်။

ယေဘုယျအားဖြင့် — application အများစုမှာ JSON data တွေကို `jsonb` အနေနဲ့ သိမ်းဆည်းတာ ပိုကောင်းပါတယ် — object keys တွေရဲ့ အစဉ်နဲ့ ပတ်သက်တဲ့ legacy (အမွေဆက်ခံ) ယူဆချက်တွေလို — အထူးပြု လိုအပ်ချက်တွေ ရှိနေမှသာ လွဲပါတယ်။

RFC 7159 က JSON string တွေကို UTF8 နဲ့ encode လုပ်ရမယ်လို့ သတ်မှတ်ပါတယ်။ ဒါကြောင့် — database encoding က UTF8 မဟုတ်ဘူးဆိုရင် — JSON types တွေက JSON specification ကို တင်းတင်းကျပ်ကျပ် လိုက်နာဖို့ မဖြစ်နိုင်ပါဘူး။ Database encoding မှာ ကိုယ်စားပြုလို့ မရတဲ့ character တွေကို တိုက်ရိုက် ထည့်သွင်းဖို့ ကြိုးစားရင် မအောင်မြင်ပါဘူး; အပြန်အလှန်အားဖြင့် — database encoding မှာ ကိုယ်စားပြုလို့ ရပေမယ့် UTF8 မှာ မရတဲ့ character တွေကိုတော့ ခွင့်ပြုပါတယ်။

RFC 7159 က JSON string တွေထဲမှာ `\uXXXX` နဲ့ ဖော်ပြတဲ့ Unicode escape sequence တွေ ပါဝင်ခွင့် ပြုပါတယ်။ `json` type ရဲ့ input function မှာတော့ — database encoding ဘာပဲ ဖြစ်ဖြစ် Unicode escapes တွေကို ခွင့်ပြုပြီး — syntax ပိုင်း မှန်ကန်မှုကိုပဲ စစ်ဆေးပါတယ် (ဆိုလိုတာက `\u` နောက်မှာ hex digit လေးလုံး ပါရမယ်ဆိုတာမျိုးပါ)။ ဒါပေမယ့် `jsonb` ရဲ့ input function ကတော့ ပိုတင်းကျပ်ပါတယ်: database encoding မှာ ကိုယ်စားပြုလို့ မရတဲ့ character တွေအတွက် Unicode escapes တွေကို ခွင့်မပြုပါဘူး။ `jsonb` type က `\u0000` ကိုလည်း ငြင်းပယ်ပါတယ် (PostgreSQL ရဲ့ `text` type မှာ အဲဒါကို ကိုယ်စားပြုလို့ မရလို့ပါ) — ပြီးတော့ Unicode Basic Multilingual Plane အပြင်ဘက်က character တွေကို ရည်ညွှန်းဖို့ Unicode surrogate pairs တွေ သုံးတာဟာလည်း မှန်ကန်ဖို့ တောင်းဆိုပါတယ်။ Valid Unicode escapes တွေကို သိမ်းဆည်းတဲ့အခါ ညီမျှတဲ့ character တစ်လုံးတည်းအဖြစ် ပြောင်းလဲပေးပါတယ်; ဒီထဲမှာ surrogate pairs တွေကို character တစ်လုံးတည်းထဲ ပေါင်းလိုက်တာလည်း ပါဝင်ပါတယ်။

> **မှတ်ချက်:** [အပိုင်း 9.16](/docs/postgresql/functions-json) မှာ ဖော်ပြထားတဲ့ JSON processing functions တွေ အများစုက Unicode escapes တွေကို ပုံမှန် character တွေအဖြစ် ပြောင်းပေးတာမို့ — သူတို့ရဲ့ input က `jsonb` မဟုတ်ဘဲ `json` type ဖြစ်နေရင်တောင် — အပေါ်မှာ ဖော်ပြခဲ့တဲ့ error အမျိုးအစား အတိုင်းပဲ ဖြစ်စေနိုင်ပါတယ်။ `json` input function က ဒီစစ်ဆေးမှုတွေ မလုပ်တာက သမိုင်းကြောင်းအရ ကျန်ရစ်ခဲ့တဲ့ အပြုအမူ (historical artifact) တစ်ခုလို့ ယူဆလို့ ရပေမယ့် — ကိုယ်စားပြုလို့ မရတဲ့ character တွေ ပါဝင်တဲ့ JSON Unicode escapes တွေကို — processing မလုပ်ဘဲ — ရိုးရိုး သိမ်းဆည်းထားရုံအတွက်တော့ ခွင့်ပြုပေးပါတယ်။

Textual JSON input ကို `jsonb` အဖြစ် ပြောင်းတဲ့အခါ — RFC 7159 မှာ ဖော်ပြထားတဲ့ primitive types တွေကို [ဇယား 8.23](/docs/postgresql/datatype-json) မှာ ပြထားတဲ့အတိုင်း — PostgreSQL ရဲ့ ဇာတိ (native) types တွေအပေါ်ကို ထိရောက်စွာ (effectively) မြေပုံဆွဲ (map) လုပ်ပါတယ်။ ဒါကြောင့် — အောက်ခံ data type ရဲ့ ကိုယ်စားပြုနိုင်မှု ကန့်သတ်ချက်တွေနဲ့ ဆက်စပ်ပြီး — `jsonb` မှာ valid ဖြစ်တဲ့ data ဆိုတာကို သတ်မှတ်ရာတွင် `json` type မှာရော သဘောတရားအရ JSON မှာပါ မရှိတဲ့ — အသေးစား ထပ်ဆောင်း ကန့်သတ်ချက်တချို့ ရှိပါတယ်။ အထူးသဖြင့် — `jsonb` က PostgreSQL `numeric` data type ရဲ့ အကွာအဝေး (range) အပြင်ဘက်က ဂဏန်းတွေကို ငြင်းပယ်ပြီး — `json` ကတော့ မငြင်းပါဘူး။ ဒီလို implementation-defined (အကောင်အထည်ဖော်မှုအလိုက် သတ်မှတ်သော) ကန့်သတ်ချက်တွေကို RFC 7159 က ခွင့်ပြုထားပါတယ်။ ဒါပေမယ့် — လက်တွေ့မှာတော့ ဒီလို ပြဿနာတွေက တခြား implementation တွေမှာ ဖြစ်နိုင်ခြေ အများကြီး ပိုများပါတယ် — JSON ရဲ့ `number` primitive type ကို IEEE 754 double precision floating point အနေနဲ့ ကိုယ်စားပြုတာ အသုံးများလို့ပါ (RFC 7159 က ဒါကို ကြိုမြင်၍ ခွင့်ပြုထားပါတယ်)။ ဒီလို system တွေနဲ့ JSON ကို interchange format (အပြန်အလှန် ဖလှယ်ရေး ပုံစံ) အနေနဲ့ သုံးတဲ့အခါ — PostgreSQL က မူလ သိမ်းဆည်းထားတဲ့ data နဲ့ ယှဉ်ရင် numeric precision (ဂဏန်း တိကျမှု) ဆုံးရှုံးနိုင်တဲ့ အန္တရာယ်ကို ထည့်စဉ်းစားသင့်ပါတယ်။

အပြန်အလှန်အားဖြင့် — ဇယားထဲမှာ မှတ်ချက်ပြုထားသလို — JSON primitive types တွေရဲ့ input format မှာလည်း သက်ဆိုင်ရာ PostgreSQL types တွေမှာ မရှိတဲ့ အသေးစား ကန့်သတ်ချက်တချို့ ရှိပါတယ်။

**ဇယား 8.23. JSON Primitive Types များနှင့် သက်ဆိုင်ရာ PostgreSQL Types**

| JSON primitive type | PostgreSQL type | Notes |
| --- | --- | --- |
| `string` | `text` | `\u0000` ကို ခွင့်မပြုသလို — database encoding မှာ မရနိုင်တဲ့ character တွေကို ကိုယ်စားပြုတဲ့ Unicode escapes တွေကိုလည်း ခွင့်မပြုပါ |
| `number` | `numeric` | `NaN` နဲ့ `infinity` တန်ဖိုးတွေကို ခွင့်မပြုပါ |
| `boolean` | `boolean` | lowercase `true` နဲ့ `false` စာလုံးပေါင်းတွေကိုပဲ လက်ခံပါတယ် |
| `null` | (none) | SQL ရဲ့ `NULL` က မတူညီတဲ့ concept (အယူအဆ) တစ်ခုပါ |

### 8.14.1. JSON Input and Output Syntax (JSON input နှင့် output အတွက် syntax)

JSON data types တွေရဲ့ input/output syntax က RFC 7159 မှာ သတ်မှတ်ထားတဲ့အတိုင်း ဖြစ်ပါတယ်။

အောက်ပါတွေက valid ဖြစ်တဲ့ `json` (သို့မဟုတ် `jsonb`) expressions တွေ အားလုံးပါ:

```sql
-- Simple scalar/primitive value
-- Primitive values can be numbers, quoted strings, true, false, or null
SELECT '5'::json;

-- Array of zero or more elements (elements need not be of same type)
SELECT '[1, 2, "foo", null]'::json;

-- Object containing pairs of keys and values
-- Note that object keys must always be quoted strings
SELECT '{"bar": "baz", "balance": 7.77, "active": false}'::json;

-- Arrays and objects can be nested arbitrarily
SELECT '{"foo": [true, "bar"], "tags": {"a": 1, "b": null}}'::json;
```

အပေါ်မှာ ဖော်ပြခဲ့သလို — JSON တန်ဖိုးတစ်ခုကို input လုပ်ပြီး ဘာ processing မှ မလုပ်ဘဲ ပြန်ထုတ်လိုက်ရင် — `json` က input လုပ်လိုက်တဲ့ text အတိုင်းပဲ ထုတ်ပေးပြီး — `jsonb` ကတော့ white space လိုမျိုး အဓိပ္ပာယ် မရှိတဲ့ အသေးစိတ် အချက်တွေကို မထိန်းသိမ်းပါဘူး။ ဥပမာ — ဒီမှာ ကွာခြားချက်တွေကို သတိပြုပါ:

```sql
SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::json;
                      json
-------------------------------------------------
 {"bar": "baz", "balance": 7.77, "active":false}
(1 row)

SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::jsonb;
                      jsonb
--------------------------------------------------
 {"bar": "baz", "active": false, "balance": 7.77}
(1 row)
```

အဓိပ္ပာယ် မရှိတဲ့ အသေးစိတ် တစ်ခုကို မှတ်သားစရာက — `jsonb` မှာ ဂဏန်းတွေကို အောက်ခံ `numeric` type ရဲ့ အပြုအမူအတိုင်း ထုတ်ပေးတာ ဖြစ်ပါတယ်။ လက်တွေ့မှာ ဆိုလိုတာက — `E` notation နဲ့ ထည့်လိုက်တဲ့ ဂဏန်းတွေကို အဲဒီ notation မပါဘဲ ထုတ်ပေးတာ ဖြစ်ပြီး — ဥပမာ:

```sql
SELECT '{"reading": 1.230e-5}'::json, '{"reading": 1.230e-5}'::jsonb;
         json          |          jsonb
-----------------------+-------------------------
 {"reading": 1.230e-5} | {"reading": 0.00001230}
(1 row)
```

ဒါပေမယ့် — ဒီဥပမာမှာ မြင်ရတဲ့အတိုင်း — `jsonb` က trailing fractional zeroes (ဂဏန်း၏ နောက်ဆုံးမှာ ပါတဲ့ သုညများ) တွေကိုတော့ ထိန်းသိမ်းပါတယ် — equality checks လိုမျိုး ရည်ရွယ်ချက်တွေအတွက် အဓိပ္ပာယ် မရှိတဲ့ဟာတွေ ဖြစ်နေပေမယ့်ပေါ့။

JSON တန်ဖိုးတွေကို တည်ဆောက်ဖို့နဲ့ process လုပ်ဖို့ ရနိုင်တဲ့ built-in functions နဲ့ operators တွေရဲ့ စာရင်းအတွက် — [အပိုင်း 9.16](/docs/postgresql/functions-json) ကို ကြည့်ပါ။

### 8.14.2. Designing JSON Documents (JSON document များ ရေးဆွဲခြင်း)

Data တွေကို JSON အနေနဲ့ ကိုယ်စားပြုတာက ရိုးရာ relational data model ထက် သိသိသာသာ ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် (flexible) ဖြစ်နိုင်ပြီး — လိုအပ်ချက်တွေ မတည်ငြိမ်တဲ့ (fluid) environments တွေမှာ ဆွဲဆောင်မှု ရှိပါတယ်။ ချဉ်းကပ်နည်း နှစ်ခုစလုံးက application တစ်ခုတည်းထဲမှာ အတူယှဉ်တွဲ ရှိနေပြီး — တစ်ခုကို တစ်ခု ဖြည့်စွက်ပေးနိုင်တာ လုံးဝ ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် — အမြင့်ဆုံး flexibility လိုချင်တဲ့ applications တွေမှာတောင် — JSON documents တွေက တစ်သမတ်တည်း ပုံသေ (somewhat fixed) structure ရှိဖို့ အကြံပြုထားပါတယ်။ အဲဒီ structure ကို ပုံမှန်အားဖြင့် အတင်းအကျပ် စစ်ဆေးပေးမထားပါဘူး (business rules တချို့ကို declaratively စစ်ဆေးဖို့တော့ ဖြစ်နိုင်ပါတယ်) — ဒါပေမယ့် ကြိုတင်ခန့်မှန်းလို့ ရတဲ့ structure ရှိနေရင် — table ထဲက “documents” (datums) အစုတစ်စုကို အသုံးဝင်အောင် အကျဉ်းချုပ်ပေးတဲ့ queries တွေ ရေးဖို့ ပိုလွယ်ကူစေပါတယ်။

JSON data တွေကို table ထဲမှာ သိမ်းတဲ့အခါ — တခြား data types တွေလိုပဲ — concurrency-control (တစ်ပြိုင်နက် ဝင်ရောက်မှု ထိန်းချုပ်ခြင်း) ဆိုင်ရာ ထည့်သွင်းစဉ်းစားမှုတွေ သက်ရောက်ပါတယ်။ Document ကြီးကြီးတွေ သိမ်းဆည်းတာ လုပ်လို့ ရပေမယ့် — update တစ်ခုခုက row တစ်ခုလုံးအပေါ် row-level lock တစ်ခု ရယူတယ်ဆိုတာ သတိရပါ။ Update လုပ်နေတဲ့ transactions တွေကြားက lock contention (lock ပြိုင်ဆိုင်မှု) ကို လျှော့ချဖို့ — JSON documents တွေကို စီမံနိုင်လောက်တဲ့ (manageable) အရွယ်အစားထဲမှာ ထားဖို့ စဉ်းစားပါ။ အကောင်းဆုံးကတော့ — JSON document တစ်ခုချင်းစီက — business rules အရ သီးခြား ပြုပြင်လို့ ရတဲ့ ပိုသေးငယ်တဲ့ datums တွေအဖြစ် ထပ်ခွဲလို့ မရနိုင်တဲ့ — atomic datum (ခွဲမရအောင် တစ်ခုတည်း ဖြစ်သော datum) တစ်ခုကို ကိုယ်စားပြုသင့်ပါတယ်။

### 8.14.3. `jsonb` Containment and Existence (`jsonb` containment နှင့် existence)

*Containment* (အထဲမှာ ပါဝင်မှု ရှိ/မရှိ) ကို စမ်းသပ်ခြင်းက `jsonb` ရဲ့ အရေးပါတဲ့ စွမ်းဆောင်နိုင်မှု တစ်ခုပါ။ `json` type အတွက်တော့ အလားတူ စွမ်းဆောင်နိုင်မှု အစုံ မရှိပါဘူး။ Containment က `jsonb` document တစ်ခုအတွင်းမှာ နောက် document တစ်ခု ပါဝင်မှု ရှိမရှိ စမ်းသပ်တာပါ။ အောက်ပါ ဥပမာတွေက မှတ်ချက်ပြုထားတဲ့ နေရာတွေ ကလွဲလို့ true ပြန်ပါတယ်:

```sql
-- Simple scalar/primitive values contain only the identical value:
SELECT '"foo"'::jsonb @> '"foo"'::jsonb;

-- The array on the right side is contained within the one on the left:
SELECT '[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb;

-- Order of array elements is not significant, so this is also true:
SELECT '[1, 2, 3]'::jsonb @> '[3, 1]'::jsonb;

-- Duplicate array elements don't matter either:
SELECT '[1, 2, 3]'::jsonb @> '[1, 2, 2]'::jsonb;

-- The object with a single pair on the right side is contained
-- within the object on the left side:
SELECT '{"product": "PostgreSQL", "version": 9.4, "jsonb": true}'::jsonb @> '{"version": 9.4}'::jsonb;

-- The array on the right side is not considered contained within the
-- array on the left, even though a similar array is nested within it:
SELECT '[1, 2, [1, 3]]'::jsonb @> '[1, 3]'::jsonb;  -- yields false

-- But with a layer of nesting, it is contained:
SELECT '[1, 2, [1, 3]]'::jsonb @> '[[1, 3]]'::jsonb;

-- Similarly, containment is not reported here:
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"bar": "baz"}'::jsonb;  -- yields false

-- A top-level key and an empty object is contained:
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"foo": {}}'::jsonb;
```

ယေဘုယျ နိယာမကတော့ — ပါဝင်ရမယ့် (contained) object က — ပါဝင်နေတဲ့ (containing) object ထဲက မကိုက်ညီတဲ့ array elements တွေ ဒါမှမဟုတ် object key/value pairs တချို့ကို ဖယ်ပစ်လိုက်ပြီးနောက်မှာ — structure ရော data ပါ အတူတူ ဖြစ်နေရမယ်ဆိုတာပါ။ ဒါပေမယ့် containment match လုပ်တဲ့အခါ array elements တွေရဲ့ အစဉ်က အရေးမပါသလို — duplicate array elements တွေကိုလည်း တစ်ခါပဲ ထည့်တွက်တယ်ဆိုတာ သတိရပါ။

Structures တွေ ကိုက်ညီရမယ်ဆိုတဲ့ ယေဘုယျ နိယာမအတွက် ခြွင်းချက် သီးသန့်တစ်ခုအနေနဲ့ — array တစ်ခုထဲမှာ primitive value တစ်ခု ပါဝင်နိုင်ပါတယ်:

```sql
-- This array contains the primitive string value:
SELECT '["foo", "bar"]'::jsonb @> '"bar"'::jsonb;

-- This exception is not reciprocal -- non-containment is reported here:
SELECT '"bar"'::jsonb @> '["bar"]'::jsonb;  -- yields false
```

`jsonb` မှာ *existence* operator လည်း ရှိပါတယ် — ဒါက containment ရဲ့ မူကွဲတစ်မျိုးပါ: string တစ်ခု (`text` တန်ဖိုးအနေနဲ့ ပေးထားတဲ့) က `jsonb` တန်ဖိုးရဲ့ ထိပ်ဆုံးအဆင့် (top level) မှာ object key ဒါမှမဟုတ် array element အနေနဲ့ ပေါ်နေလားဆိုတာ စမ်းသပ်တာပါ။ အောက်ပါ ဥပမာတွေက မှတ်ချက်ပြုထားတဲ့ နေရာတွေ ကလွဲလို့ true ပြန်ပါတယ်:

```sql
-- String exists as array element:
SELECT '["foo", "bar", "baz"]'::jsonb ? 'bar';

-- String exists as object key:
SELECT '{"foo": "bar"}'::jsonb ? 'foo';

-- Object values are not considered:
SELECT '{"foo": "bar"}'::jsonb ? 'bar';  -- yields false

-- As with containment, existence must match at the top level:
SELECT '{"foo": {"bar": "baz"}}'::jsonb ? 'bar'; -- yields false

-- A string is considered to exist if it matches a primitive JSON string:
SELECT '"foo"'::jsonb ? 'foo';
```

Keys တွေ ဒါမှမဟုတ် elements တွေ အများကြီး ပါဝင်တဲ့အခါ containment ဒါမှမဟုတ် existence စမ်းသပ်ဖို့ — arrays တွေထက် JSON objects တွေက ပိုသင့်တော်ပါတယ် — arrays တွေနဲ့ မတူဘဲ objects တွေက ရှာဖွေမှုအတွက် အတွင်းပိုင်း optimize လုပ်ထားပြီး — linear (တစ်ကြောင်းစီ စီစဉ်) ရှာဖွေစရာ မလိုလို့ပါ။

> **အကြံပြုချက်:** JSON containment က nested (အသိုက်လိုက်) ဖြစ်တာမို့ — သင့်တော်တဲ့ query တစ်ခုက sub-objects တွေကို သီးခြား ရွေးထုတ်စရာ မလိုဘဲ ရှောင်ကျော်နိုင်ပါတယ်။ ဥပမာအနေနဲ့ — `doc` column တစ်ခုမှာ top level objects တွေ ရှိနေပြီး — objects အများစုမှာ sub-objects တွေရဲ့ arrays တွေ ပါဝင်တဲ့ `tags` fields တွေ ပါတယ်ဆိုပါစို့။ ဒီ query က `tags` array ရဲ့ အပြင်ဘက်က ဒီလို keys တွေကို လျစ်လျူရှုပြီး — `"term":"paris"` ရော `"term":"food"` ရော နှစ်ခုလုံး ပါဝင်တဲ့ sub-objects တွေ ရှိနေတဲ့ entries တွေကို ရှာပေးပါတယ်:
> 
> ```sql
> SELECT doc->'site_name' FROM websites
>   WHERE doc @> '{"tags":[{"term":"paris"}, {"term":"food"}]}';
> ```
> 
> ဥပမာ — ဒီလိုမျိုး ရေးပြီးလည်း အလားတူ ရလဒ်ကို ရနိုင်ပါတယ် —
> 
> ```sql
> SELECT doc->'site_name' FROM websites
>   WHERE doc->'tags' @> '[{"term":"paris"}, {"term":"food"}]';
> ```
> 
> ဒါပေမယ့် အဲဒီ နည်းလမ်းက ပြောင်းလွယ်ပြင်လွယ် နည်းပါးပြီး — ထိရောက်မှုလည်း မကြာခဏ ပိုနည်းပါတယ်။
> 
> တဖက်မှာတော့ — JSON existence operator က nested မဟုတ်ပါဘူး: သတ်မှတ်ထားတဲ့ key ဒါမှမဟုတ် array element ကို JSON တန်ဖိုးရဲ့ top level မှာပဲ ရှာဖွေပေးမှာ ဖြစ်ပါတယ်။

ဒီ containment နဲ့ existence operators တွေ အပြင် — တခြား JSON operators နဲ့ functions တွေ အားလုံးကို [အပိုင်း 9.16](/docs/postgresql/functions-json) မှာ မှတ်တမ်းပြုထားပါတယ်။

### 8.14.4. `jsonb` Indexing (`jsonb` index ပြုလုပ်ခြင်း)

GIN indexes တွေက `jsonb` documents (datums) အများအပြားထဲမှာ keys တွေ ဒါမှမဟုတ် key/value pairs တွေ ဖြစ်ပေါ်နေမှုကို ထိရောက်စွာ ရှာဖွေဖို့ သုံးနိုင်ပါတယ်။ Performance နဲ့ flexibility ကြားက မတူညီတဲ့ trade-offs တွေ ပေးတဲ့ — GIN “operator classes” နှစ်ခုကို ထောက်ပံ့ထားပါတယ်။

`jsonb` အတွက် default GIN operator class က — key-exists operators `?`, `?|` နဲ့ `?&`၊ containment operator `@>`၊ ပြီးတော့ `jsonpath` match operators `@?` နဲ့ `@@` ပါတဲ့ queries တွေကို ထောက်ပံ့ပါတယ်။ (ဒီ operators တွေ အကောင်အထည်ဖော်တဲ့ အဓိပ္ပာယ် (semantics) အသေးစိတ်အတွက် [ဇယား 9.48](/docs/postgresql/functions-json) ကို ကြည့်ပါ။) ဒီ operator class နဲ့ index တစ်ခု ဖန်တီးတဲ့ ဥပမာက:

```sql
CREATE INDEX idxgin ON api USING GIN (jdoc);
```

Default မဟုတ်တဲ့ GIN operator class `jsonb_path_ops` က key-exists operators တွေကို မထောက်ပံ့ပေမယ့် — `@>`, `@?` နဲ့ `@@` တွေကိုတော့ ထောက်ပံ့ပါတယ်။ ဒီ operator class နဲ့ index တစ်ခု ဖန်တီးတဲ့ ဥပမာက:

```sql
CREATE INDEX idxginp ON api USING GIN (jdoc jsonb_path_ops);
```

Third-party web service တစ်ခုကနေ ထုတ်ယူထားတဲ့ — schema definition မှတ်တမ်းပြုထားတဲ့ — JSON documents တွေကို သိမ်းဆည်းထားတဲ့ table တစ်ခုရဲ့ ဥပမာကို စဉ်းစားကြည့်ပါ။ ပုံမှန် document တစ်ခုက:

```sql
{
    "guid": "9c36adc1-7fb5-4d5b-83b4-90356a46061a",
    "name": "Angela Barton",
    "is_active": true,
    "company": "Magnafone",
    "address": "178 Howard Place, Gulf, Washington, 702",
    "registered": "2009-11-07T08:53:22 +08:00",
    "latitude": 19.793713,
    "longitude": 86.513373,
    "tags": [
        "enim",
        "aliquip",
        "qui"
    ]
}
```

ဒီ documents တွေကို `api` ဆိုတဲ့ table ထဲက `jdoc` ဆိုတဲ့ `jsonb` column တစ်ခုထဲမှာ သိမ်းထားပါတယ်။ ဒီ column ပေါ်မှာ GIN index တစ်ခု ဖန်တီးထားရင် — အောက်ပါလို queries တွေက index ကို အသုံးချနိုင်ပါတယ်:

```sql
-- Find documents in which the key "company" has value "Magnafone"
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc @> '{"company": "Magnafone"}';
```

ဒါပေမယ့် — `?` operator က index သုံးလို့ ရတယ်ဆိုပေမယ့် — index လုပ်ထားတဲ့ column `jdoc` ပေါ်ကို တိုက်ရိုက် အသုံးချတာ မဟုတ်လို့ — အောက်ပါလို queries တွေအတွက်တော့ index ကို မသုံးနိုင်ပါဘူး:

```sql
-- Find documents in which the key "tags" contains key or array element "qui"
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc -> 'tags' ? 'qui';
```

ဒါပေမယ့် — expression indexes တွေကို သင့်လျော်စွာ သုံးခြင်းဖြင့် — အပေါ်က query က index ကို သုံးနိုင်ပါတယ်။ `"tags"` key ထဲက particular items တွေကို query လုပ်နေရတာ အများသားဆိုရင် — ဒီလို index တစ်ခု သတ်မှတ်တာ အကျိုးရှိနိုင်ပါတယ်:

```sql
CREATE INDEX idxgintags ON api USING GIN ((jdoc -> 'tags'));
```

အခုဆိုရင် — `jdoc -> 'tags' ? 'qui'` ဆိုတဲ့ `WHERE` clause ကို — index လုပ်ထားတဲ့ expression `jdoc -> 'tags'` ပေါ်မှာ indexable operator `?` ကို အသုံးချတာအဖြစ် အသိအမှတ်ပြုပါလိမ့်မယ်။ (Expression indexes အကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အပိုင်း 11.7](https://www.postgresql.org/docs/current/indexes-expressional.html) မှာ တွေ့နိုင်ပါတယ်။)

Query လုပ်တဲ့ နောက်တစ်နည်းက containment ကို အသုံးချတာပါ — ဥပမာ:

```sql
-- Find documents in which the key "tags" contains array element "qui"
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc @> '{"tags": ["qui"]}';
```

`jdoc` column ပေါ်က ရိုးရှင်းတဲ့ GIN index တစ်ခုက ဒီ query ကို ထောက်ပံ့နိုင်ပါတယ်။ ဒါပေမယ့် — ဒီလို index က `jdoc` column ထဲက key နဲ့ value တိုင်းရဲ့ ပုံတူတွေကို သိမ်းဆည်းပေးမှာ ဖြစ်ပြီး — အရင် ဥပမာက expression index ကတော့ `tags` key အောက်က data တွေကိုပဲ သိမ်းပါတယ်။ ရိုးရှင်းတဲ့-index ချဉ်းကပ်နည်းက ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်ပေမယ့် (ဘယ် key အကြောင်းမဆို queries တွေကို ထောက်ပံ့လို့) — targeted expression indexes တွေက ရိုးရှင်းတဲ့ index ထက် ပိုသေးငယ်ပြီး ရှာဖွေဖို့ ပိုမြန်နိုင်ခြေ များပါတယ်။

GIN indexes တွေက `jsonpath` matching လုပ်ဆောင်ပေးတဲ့ `@?` နဲ့ `@@` operators တွေကိုလည်း ထောက်ပံ့ပါတယ်။ ဥပမာတွေက:

```sql
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc @? '$.tags[*] ? (@ == "qui")';
```

```sql
SELECT jdoc->'guid', jdoc->'name' FROM api WHERE jdoc @@ '$.tags[*] == "qui"';
```

ဒီ operators တွေအတွက် — GIN index တစ်ခုက `jsonpath` pattern ထဲကနေ `accessors_chain == constant` ပုံစံ clauses တွေကို ထုတ်ယူပြီး — အဲဒီ clauses တွေထဲမှာ ဖော်ပြထားတဲ့ keys နဲ့ values တွေအပေါ် အခြေခံကာ index search လုပ်ပေးပါတယ်။ Accessors chain မှာ `.key`, `[*]` နဲ့ `[index]` accessors တွေ ပါဝင်နိုင်ပါတယ်။ `jsonb_ops` operator class က `.*` နဲ့ `.**` accessors တွေကိုလည်း ထောက်ပံ့ပေးပေမယ့် — `jsonb_path_ops` operator class ကတော့ မထောက်ပံ့ပါဘူး။

`jsonb_path_ops` operator class က `@>`, `@?` နဲ့ `@@` operators တွေ ပါဝင်တဲ့ queries တွေကိုပဲ ထောက်ပံ့ပေးပေမယ့် — default operator class `jsonb_ops` ထက် ထင်ရှားတဲ့ performance အားသာချက်တွေ ရှိပါတယ်။ `jsonb_path_ops` index တစ်ခုက data အတူတူအပေါ်က `jsonb_ops` index တစ်ခုထက် ပုံမှန်အားဖြင့် အများကြီး ပိုသေးငယ်ပြီး — အထူးသဖြင့် queries တွေထဲမှာ data ထဲ မကြာခဏ ပေါ်နေတဲ့ keys တွေ ပါဝင်တဲ့အခါ — searches တွေရဲ့ specificity (တိကျမှု) က ပိုကောင်းပါတယ်။ ဒါကြောင့် — search operations တွေက default operator class နဲ့ ဆိုရထက် ပုံမှန်အားဖြင့် ပိုကောင်းမွန်စွာ လုပ်ဆောင်ပါတယ်။

`jsonb_ops` နဲ့ `jsonb_path_ops` GIN index တစ်ခုကြားက နည်းပညာအရ ကွာခြားချက်က — ရှေ့ဟာက data ထဲက key နဲ့ value တိုင်းအတွက် သီးခြား index items တွေ ဖန်တီးပြီး — နောက်ဟာက data ထဲက value တိုင်းအတွက်ပဲ index items တွေ ဖန်တီးတာ ဖြစ်ပါတယ်။ [7] အခြေခံအားဖြင့် — `jsonb_path_ops` index item တစ်ခုစီက value နဲ့ ၎င်းဆီ ဦးတည်တဲ့ key(s) တွေရဲ့ hash တစ်ခု ဖြစ်ပါတယ်; ဥပမာ `{"foo": {"bar": "baz"}}` ကို index လုပ်ဖို့ဆိုရင် — `foo`, `bar`, `baz` သုံးခုလုံးကို hash value ထဲ ထည့်သွင်းထားတဲ့ index item တစ်ခုတည်း ဖန်တီးပေးမှာ ဖြစ်ပါတယ်။ ဒါကြောင့် ဒီ structure ကို ရှာနေတဲ့ containment query တစ်ခုက အလွန် တိကျတဲ့ index search ကို ဖြစ်စေပါတယ်; ဒါပေမယ့် `foo` က key တစ်ခုအနေနဲ့ ပေါ်နေလားဆိုတာကိုတော့ ဘယ်နည်းနဲ့မှ ရှာဖွေလို့ မရပါဘူး။ တဖက်မှာ — `jsonb_ops` index ကတော့ `foo`, `bar`, `baz` တွေကို သီးခြားစီ ကိုယ်စားပြုတဲ့ index items သုံးခု ဖန်တီးပြီး — containment query လုပ်ဖို့ဆိုရင် — ဒီ items သုံးခုလုံး ပါဝင်တဲ့ rows တွေကို ရှာရပါတယ်။ GIN indexes တွေက ဒီလို AND search ကို ကျေကျေနပ်နပ် လုပ်ဆောင်နိုင်ပေမယ့် — အထူးသဖြင့် ဒီ index items သုံးခုထဲက တစ်ခုခု တစ်ခုတည်း ပါဝင်တဲ့ rows တွေ အများကြီး ရှိနေရင် — ညီမျှတဲ့ `jsonb_path_ops` search ထက် တိကျမှု နည်းပြီး ပိုနှေးနေဦးမှာ ဖြစ်ပါတယ်။

`jsonb_path_ops` ချဉ်းကပ်နည်းရဲ့ အားနည်းချက်က — value လုံးဝ မပါဝင်တဲ့ JSON structures (ဥပမာ `{"a": {}}` လိုမျိုး) အတွက် index entries တွေ မထုတ်လုပ်ပေးတာပါ။ ဒီလို structure ပါဝင်တဲ့ documents တွေကို ရှာတဲ့ search တစ်ခု လုပ်ရင် — full-index scan တစ်ခု လိုအပ်ပြီး — အဲဒါက အတော်လေး နှေးပါတယ်။ ဒါကြောင့် `jsonb_path_ops` က ဒီလို searches တွေကို မကြာခဏ လုပ်နေရတဲ့ applications တွေအတွက်တော့ မသင့်တော်ပါဘူး။

`jsonb` က `btree` နဲ့ `hash` indexes တွေကိုလည်း ထောက်ပံ့ပါတယ်။ ဒါတွေက JSON documents အပြည့်အစုံရဲ့ equality (တူညီမှု) ကို စစ်ဆေးဖို့ အရေးကြီးတဲ့ ကိစ္စမျိုးမှာသာ ပုံမှန်အားဖြင့် အသုံးဝင်ပါတယ်။ `jsonb` datums တွေရဲ့ `btree` ordering က သိပ်ပြီး စိတ်ဝင်စားစရာ မကောင်းပေမယ့် — ပြည့်စုံမှုအတွက် ဆိုရရင်:

```sql
Object > Array > Boolean > Number > String > null

Object with n pairs > object with n - 1 pairs

Array with n elements > array with n - 1 elements
```

ခြွင်းချက်တစ်ခုကတော့ — (သမိုင်းကြောင်းအရ) top level မှာ ဗလာ (empty) ဖြစ်တဲ့ array တစ်ခုက `null` ထက် ငယ်စဉ် (sorts less) လုပ်ပါတယ်။ Pair အရေအတွက် တူညီတဲ့ Objects တွေကို ဒီအစဉ်အတိုင်း နှိုင်းယှဉ်ပါတယ်:

```sql
key-1, value-1, key-2 ...
```

Object keys တွေကို သူတို့ သိမ်းဆည်းထားတဲ့ အစဉ်အတိုင်း နှိုင်းယှဉ်တာကို သတိပြုပါ; အထူးသဖြင့် — ပိုတိုတဲ့ keys တွေကို ပိုရှည်တဲ့ keys တွေထက် အရင် သိမ်းတာမို့ — ဒါက မမျှော်လင့်စရာ ဖြစ်နိုင်တဲ့ ရလဒ်တွေ ဖြစ်စေနိုင်ပါတယ် — ဥပမာ:

```sql
{ "aa": 1, "c": 1} > {"b": 1, "d": 1}
```

အလားတူပဲ — element အရေအတွက် တူညီတဲ့ arrays တွေကို ဒီအစဉ်အတိုင်း နှိုင်းယှဉ်ပါတယ်:

```sql
element-1, element-2 ...
```

Primitive JSON values တွေကို သက်ဆိုင်ရာ အောက်ခံ PostgreSQL data type ရဲ့ နှိုင်းယှဉ်မှု စည်းမျဉ်းတွေအတိုင်းပဲ နှိုင်းယှဉ်ပါတယ်။ Strings တွေကို default database collation သုံးပြီး နှိုင်းယှဉ်ပါတယ်။

### 8.14.5. `jsonb` Subscripting (`jsonb` subscript ပြုလုပ်ခြင်း)

`jsonb` data type က elements တွေကို ထုတ်ယူဖို့ရော ပြုပြင်ဖို့ပါ — array-style subscripting expressions တွေကို ထောက်ပံ့ပါတယ်။ Subscripting expressions တွေကို ဆက်တိုက် (chaining) ချိတ်ပြီး nested values တွေကို ညွှန်ပြနိုင်ပါတယ် — `jsonb_set` function ထဲက `path` argument အတွက် သုံးတဲ့ စည်းမျဉ်းတွေအတိုင်းပဲ ဖြစ်ပါတယ်။ `jsonb` တန်ဖိုးက array တစ်ခုဆိုရင် — numeric subscripts တွေက သုညကနေ စတင်ပြီး — negative integers တွေက array ရဲ့ နောက်ဆုံး element ကနေ နောက်ပြန် ရေတွက်ပါတယ်။ Slice expressions တွေကိုတော့ ထောက်ပံ့မထားပါဘူး။ Subscripting expression တစ်ခုရဲ့ ရလဒ်က အမြဲတမ်း jsonb data type ဖြစ်ပါတယ်။

`UPDATE` statements တွေက `SET` clause ထဲမှာ subscripting ကို သုံးပြီး `jsonb` တန်ဖိုးတွေကို ပြုပြင်နိုင်ပါတယ်။ သက်ရောက်မှု ရှိတဲ့ တန်ဖိုးတွေ အားလုံးအတွက် subscript paths တွေက traverse (ဖြတ်သန်း) လို့ ရနိုင်တဲ့ အနေအထားမှာ ရှိရပါမယ်။ ဥပမာ — `val['a']['b']['c']` ဆိုတဲ့ path ကို `c` အထိ ဖြတ်သန်းနိုင်ဖို့ — `val`, `val['a']`, `val['a']['b']` တိုင်းက object ဖြစ်ရပါမယ်။ `val['a']` ဒါမှမဟုတ် `val['a']['b']` တစ်ခုခု သတ်မှတ်မထားရင် — အဲဒါတွေကို empty object အဖြစ် ဖန်တီးပြီး လိုအပ်သလို ဖြည့်ပေးပါတယ်။ ဒါပေမယ့် — `val` ကိုယ်တိုင် ဒါမှမဟုတ် အလယ်အလတ် (intermediary) တန်ဖိုးတွေထဲက တစ်ခုခုက — string, number ဒါမှမဟုတ် `jsonb` `null` လိုမျိုး — object မဟုတ်တဲ့အရာအဖြစ် သတ်မှတ်ထားရင်တော့ — traverse လုပ်လို့ မရတော့ဘဲ error တက်ပြီး transaction က abort (ရပ်တန့်) ခံရပါတယ်။

Subscripting syntax ရဲ့ ဥပမာတစ်ခု:

```sql
-- Extract object value by key
SELECT ('{"a": 1}'::jsonb)['a'];

-- Extract nested object value by key path
SELECT ('{"a": {"b": {"c": 1}}}'::jsonb)['a']['b']['c'];

-- Extract array element by index
SELECT ('[1, "2", null]'::jsonb)[1];

-- Update object value by key. Note the quotes around '1': the assigned
-- value must be of the jsonb type as well
UPDATE table_name SET jsonb_field['key'] = '1';

-- This will raise an error if any record's jsonb_field['a']['b'] is something
-- other than an object. For example, the value {"a": 1} has a numeric value
-- of the key 'a'.
UPDATE table_name SET jsonb_field['a']['b']['c'] = '1';

-- Filter records using a WHERE clause with subscripting. Since the result of
-- subscripting is jsonb, the value we compare it against must also be jsonb.
-- The double quotes make "value" also a valid jsonb string.
SELECT * FROM table_name WHERE jsonb_field['key'] = '"value"';
```

`jsonb_set` နဲ့ မတူဘဲ — subscripting ကနေတစ်ဆင့် `jsonb` assignment လုပ်တာက edge cases တချို့ကို ကွဲပြားစွာ ကိုင်တွယ်ပါတယ်။ Source `jsonb` တန်ဖိုးက `NULL` ဖြစ်နေရင် — subscripting ကနေ assignment လုပ်တာက — subscript key ကနေ ညွှန်ပြတဲ့ အမျိုးအစား (object ဒါမှမဟုတ် array) ရဲ့ empty JSON တန်ဖိုးတစ်ခု ဖြစ်နေသလိုမျိုး ဆက်လုပ်သွားပါတယ်:

```sql
-- Where jsonb_field was NULL, it is now {"a": 1}
UPDATE table_name SET jsonb_field['a'] = '1';

-- Where jsonb_field was NULL, it is now [1]
UPDATE table_name SET jsonb_field[0] = '1';
```

Element အရေအတွက် နည်းလွန်းတဲ့ array တစ်ခုအတွက် index တစ်ခု သတ်မှတ်ထားရင် — index ကို ရောက်ရှိပြီး တန်ဖိုး သတ်မှတ်လို့ ရတဲ့အထိ — `NULL` elements တွေကို နောက်ကနေ ဆက်ဖြည့်ပေးပါတယ်။

```sql
-- Where jsonb_field was [], it is now [null, null, 2];
-- where jsonb_field was [0], it is now [0, null, 2]
UPDATE table_name SET jsonb_field[2] = '2';
```

`jsonb` တန်ဖိုးတစ်ခုက — subscript path ထဲမှာ နောက်ဆုံး traverse လုပ်ရမယ့် ရှိပြီးသား element က — သက်ဆိုင်ရာ subscript အရ — object ဒါမှမဟုတ် array ဖြစ်နေသရွေ့ (path ထဲက နောက်ဆုံး subscript က ညွှန်ပြတဲ့ element ကိုတော့ traverse မလုပ်ဘဲ ဘာဖြစ်ဖြစ် ဖြစ်နိုင်ပါတယ်) — မရှိသေးတဲ့ subscript paths တွေဆီ assignment တွေကို လက်ခံပါတယ်။ Nested array နဲ့ object structures တွေကို — assign လုပ်တဲ့ တန်ဖိုး နေရာချလို့ ရတဲ့အထိ subscript path မှာ သတ်မှတ်ထားတဲ့အတိုင်း — ဖန်တီးပေးပြီး (array ဆိုရင် `null`-padded ဖြစ်အောင်) ပြုလုပ်ပေးပါတယ်။

```sql
-- Where jsonb_field was {}, it is now {"a": [{"b": 1}]}
UPDATE table_name SET jsonb_field['a'][0]['b'] = '1';

-- Where jsonb_field was [], it is now [null, {"a": 1}]
UPDATE table_name SET jsonb_field[1]['a'] = '1';
```

### 8.14.6. Transforms (jsonb type transforms များ)

Procedural languages အမျိုးမျိုးအတွက် `jsonb` type ရဲ့ transforms တွေကို အကောင်အထည်ဖော်ပေးတဲ့ ထပ်ဆောင်း extensions တွေ ရနိုင်ပါတယ်။

PL/Perl အတွက် extensions တွေက `jsonb_plperl` နဲ့ `jsonb_plperlu` လို့ ခေါ်ပါတယ်။ ဒါတွေကို သုံးရင် — `jsonb` တန်ဖိုးတွေကို သင့်လျော်သလို Perl arrays, hashes နဲ့ scalars တွေအဖြစ် map (မြေပုံဆွဲ) လုပ်ပါတယ်။

PL/Python အတွက် extension က `jsonb_plpython3u` လို့ ခေါ်ပါတယ်။ ဒါကို သုံးရင် — `jsonb` တန်ဖိုးတွေကို Python dictionaries, lists နဲ့ scalars တွေအဖြစ် map လုပ်ပါတယ်။

ဒီ extensions တွေထဲမှာ `jsonb_plperl` ကို “trusted” (ယုံကြည်စိတ်ချရသော) အဖြစ် သတ်မှတ်ထားပါတယ် — ဆိုလိုတာက လက်ရှိ database အပေါ် `CREATE` privilege ရှိတဲ့ non-superusers တွေကလည်း install လုပ်နိုင်ပါတယ်။ ကျန်တဲ့ဟာတွေကတော့ install လုပ်ဖို့ superuser privilege လိုအပ်ပါတယ်။

### 8.14.7. jsonpath Type (jsonpath type)

`jsonpath` type က PostgreSQL ထဲမှာ SQL/JSON path language အတွက် ထောက်ပံ့မှုကို အကောင်အထည်ဖော်ပေးပြီး — JSON data တွေကို ထိရောက်စွာ query လုပ်နိုင်ဖို့ ဖြစ်ပါတယ်။ ၎င်းက — path engine က JSON data ထဲကနေ ထုတ်ယူရမယ့် items တွေကို သတ်မှတ်ပေးတဲ့ — parse လုပ်ပြီးသား SQL/JSON path expression ရဲ့ binary representation (ကိုယ်စားပြုပုံ) တစ်ခုကို ထောက်ပံ့ပေးပြီး — SQL/JSON query functions တွေနဲ့ ထပ်ဆင့် process လုပ်ဖို့ ဖြစ်ပါတယ်။

SQL/JSON path predicates နဲ့ operators တွေရဲ့ အဓိပ္ပာယ် (semantics) က ယေဘုယျအားဖြင့် SQL ကို လိုက်နာပါတယ်။ တစ်ချိန်တည်းမှာပဲ — JSON data တွေနဲ့ အလုပ်လုပ်ဖို့ သဘာဝကျတဲ့ နည်းလမ်းတစ်ခု ပေးနိုင်ဖို့ — SQL/JSON path syntax က JavaScript conventions တချို့ကို သုံးပါတယ်:

- Member access အတွက် Dot (.) ကို သုံးပါတယ်။
- Array access အတွက် Square brackets ([]) တွေကို သုံးပါတယ်။
- SQL/JSON arrays တွေက 0-relative ဖြစ်ပြီး — 1 ကနေ စတင်တဲ့ သာမန် SQL arrays တွေနဲ့ မတူပါဘူး။

SQL/JSON path expressions တွေထဲက Numeric literals တွေက JavaScript rules တွေကို လိုက်နာပြီး — အဲဒါတွေက SQL ရော JSON နဲ့ပါ အသေးစိတ် တချို့မှာ ကွဲပြားပါတယ်။ ဥပမာ — SQL/JSON path က `.1` နဲ့ `1.` တို့ကို ခွင့်ပြုပါတယ် — JSON မှာတော့ ဒါတွေက invalid ပါ။ Non-decimal integer literals တွေနဲ့ underscore separators တွေကိုလည်း ထောက်ပံ့ပါတယ် — ဥပမာ `1_000_000`, `0x1EEE_FFFF`, `0o273`, `0b100101` စသဖြင့်ပါ။ SQL/JSON path မှာ (JavaScript မှာရော — ဒါပေမယ့် SQL သက်သက်မှာတော့ မဟုတ်ဘဲ) radix prefix ရဲ့ နောက်မှာ underscore separator ကို တိုက်ရိုက် ထားလို့ မရပါဘူး။

SQL/JSON path expression တစ်ခုကို SQL query တစ်ခုထဲမှာ ပုံမှန်အားဖြင့် SQL character string literal အနေနဲ့ ရေးပါတယ် — ဒါကြောင့် single quotes ထဲမှာ ထည့်ရမှာ ဖြစ်ပြီး — တန်ဖိုးထဲမှာ ထည့်ချင်တဲ့ single quotes တွေကို double (နှစ်ထပ်) လုပ်ပေးရပါမယ် ([အပိုင်း 4.1.2.1](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ)။ Path expression ပုံစံတချို့မှာ သူ့အတွင်းမှာ string literals တွေ လိုအပ်ပါတယ်။ ဒီ embedded string literals တွေက JavaScript/ECMAScript conventions တွေကို လိုက်နာပါတယ်: double quotes တွေနဲ့ ဝန်းရံရမှာ ဖြစ်ပြီး — ရိုက်ဖို့ ခက်တဲ့ characters တွေကို ကိုယ်စားပြုဖို့ backslash escapes တွေကို သုံးနိုင်ပါတယ်။ အထူးသဖြင့် — embedded string literal တစ်ခုထဲမှာ double quote တစ်ခုကို ရေးတဲ့ နည်းက `\"` ဖြစ်ပြီး — backslash ကိုယ်တိုင် ရေးဖို့ဆိုရင် `\\` လို့ ရေးရပါတယ်။ တခြား အထူး backslash sequences တွေကတော့ JavaScript strings တွေမှာ အသိအမှတ်ပြုထားတဲ့ဟာတွေ ပါဝင်ပါတယ်: ASCII control characters အမျိုးမျိုးအတွက် `\b`, `\f`, `\n`, `\r`, `\t`, `\v`၊ hex digit နှစ်လုံးတည်းနဲ့ ရေးတဲ့ character code အတွက် `\xNN`၊ 4-hex-digit code point နဲ့ ခွဲခြားသတ်မှတ်တဲ့ Unicode character အတွက် `\uNNNN`၊ ပြီးတော့ hex digits 1 ကနေ 6 လုံးနဲ့ ရေးတဲ့ Unicode character code point အတွက် `\u{N...}` တို့ ဖြစ်ပါတယ်။

Path expression တစ်ခုက path elements တွေရဲ့ sequence (အစီအစဉ်) တစ်ခု ပါဝင်ပြီး — element တစ်ခုချင်းစီက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

- JSON primitive types တွေရဲ့ Path literals: Unicode text, numeric, true, false ဒါမှမဟုတ် null။
- ဇယား 8.24 မှာ စာရင်းပြုထားတဲ့ Path variables တွေ။
- ဇယား 8.25 မှာ စာရင်းပြုထားတဲ့ Accessor operators တွေ။
- အပိုင်း 9.16.2.3 မှာ စာရင်းပြုထားတဲ့ jsonpath operators နဲ့ methods တွေ။
- Filter expressions တွေ ပေးဖို့ ဒါမှမဟုတ် path evaluation ရဲ့ အစဉ်ကို သတ်မှတ်ဖို့ သုံးနိုင်တဲ့ Parentheses တွေ။

SQL/JSON query functions တွေနဲ့ `jsonpath` expressions တွေ သုံးပုံ အသေးစိတ်အတွက် — [အပိုင်း 9.16.2](/docs/postgresql/functions-json) ကို ကြည့်ပါ။

**ဇယား 8.24. jsonpath Variables**

| Variable | Description |
| --- | --- |
| `$` | Query လုပ်နေတဲ့ JSON တန်ဖိုး (ခေါ် *context item*) ကို ကိုယ်စားပြုတဲ့ variable |
| `$varname` | Named variable တစ်ခု။ သူ့ရဲ့ တန်ဖိုးကို JSON processing functions အများအပြားရဲ့ *vars* parameter ကနေ သတ်မှတ်နိုင်ပါတယ်; အသေးစိတ်အတွက် [ဇယား 9.51](/docs/postgresql/functions-json) ကို ကြည့်ပါ။ |
| `@` | Filter expressions တွေထဲမှာ path evaluation ရဲ့ ရလဒ်ကို ကိုယ်စားပြုတဲ့ variable |

**ဇယား 8.25. jsonpath Accessors**

| Accessor Operator | Description |
| --- | --- |
| .key ."$varname" | သတ်မှတ်ထားတဲ့ key ပါတဲ့ object member တစ်ခုကို ပြန်ပေးတဲ့ member accessor။ Key နာမည်က `$` နဲ့ စတင်တဲ့ named variable တစ်ခုခုနဲ့ ကိုက်ညီနေရင် ဒါမှမဟုတ် JavaScript ရဲ့ identifier စည်းမျဉ်းတွေနဲ့ မကိုက်ညီရင် — string literal တစ်ခု ဖြစ်အောင် double quotes ထဲမှာ ထည့်ရပါမယ်။ |
| .* | လက်ရှိ object ရဲ့ top level မှာ ရှိတဲ့ members တွေ အားလုံးရဲ့ တန်ဖိုးတွေကို ပြန်ပေးတဲ့ wildcard member accessor |
| .** | လက်ရှိ object ရဲ့ JSON hierarchy အဆင့်တွေ အားလုံးကို လုပ်ဆောင်ပြီး — nesting level ဘယ်လောက်ပဲ ရှိရှိ — member values တွေ အားလုံးကို ပြန်ပေးတဲ့ recursive wildcard member accessor။ ဒါက SQL/JSON standard ရဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ |
| .**{level} .**{start_level to end_level} | .** လိုပဲ — ဒါပေမယ့် JSON hierarchy ရဲ့ သတ်မှတ်ထားတဲ့ အဆင့်တွေကိုပဲ ရွေးချယ်ပါတယ်။ Nesting levels တွေကို integers အနေနဲ့ သတ်မှတ်ပါတယ်။ Level zero က လက်ရှိ object နဲ့ သက်ဆိုင်ပါတယ်။ အနိမ့်ဆုံး nesting level ကို ဝင်ရောက်ဖို့ `last` keyword ကို သုံးနိုင်ပါတယ်။ ဒါက SQL/JSON standard ရဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ |
| [subscript, ...] | Array element accessor။ subscript ကို ပုံစံ နှစ်မျိုးနဲ့ ပေးနိုင်ပါတယ်: index ဒါမှမဟုတ် start_index to end_index။ ပထမ ပုံစံက သူ့ရဲ့ index အတိုင်း array element တစ်ခုတည်းကို ပြန်ပေးပါတယ်။ ဒုတိယ ပုံစံကတော့ — ပေးထားတဲ့ start_index နဲ့ end_index တွေနဲ့ ကိုက်ညီတဲ့ elements တွေ အပါအဝင် — indexes ရဲ့ range တစ်ခုအလိုက် array slice တစ်ခုကို ပြန်ပေးပါတယ်။ သတ်မှတ်တဲ့ index က integer တစ်ခု ဖြစ်နိုင်သလို — numeric တန်ဖိုး တစ်ခုတည်း ပြန်ပေးပြီး integer အဖြစ် အလိုအလျောက် cast လုပ်ခံရတဲ့ expression တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ Index zero က ပထမ array element နဲ့ သက်ဆိုင်ပါတယ်။ အရှည် မသိတဲ့ (unknown length) arrays တွေကို ကိုင်တွယ်ရာမှာ အသုံးဝင်တဲ့ — နောက်ဆုံး array element ကို ညွှန်ပြဖို့ `last` keyword ကိုလည်း သုံးနိုင်ပါတယ်။ |
| [*] | Array elements တွေ အားလုံးကို ပြန်ပေးတဲ့ wildcard array element accessor |

---

[7] ဒီရည်ရွယ်ချက်အတွက် “value” ဆိုတဲ့ အသုံးအနှုန်းမှာ array elements တွေ ပါဝင်ပါတယ် — JSON terminology (ဝေါဟာရ) မှာတော့ array elements တွေကို objects တွေအတွင်းက values တွေနဲ့ မတူတဲ့အရာအဖြစ် တခါတရံ သဘောထားတတ်ပါတယ်။
