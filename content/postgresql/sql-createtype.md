---
title: "CREATE TYPE (data type အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Data type အသစ်တစ်ခုကို သတ်မှတ်ပေးသည့် command — composite, enum, range, base နှင့် shell type ပုံစံ ငါးမျိုး၊ input/output, receive/send, analyze, subscript စသည့် support functions များ၊ internallength, alignment, storage, ELEMENT, collatable စသည့် parameters များနှင့် user-defined type များအတွက် array types အလိုအလျောက် ဖန်တီးပေးမှုအကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 233
source: "https://www.postgresql.org/docs/current/sql-createtype.html"
status: translated
updated: 2026-09-04
---

## CREATE TYPE (data type အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE TYPE — data type အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE TYPE name AS
    ( [ attribute_name data_type [ COLLATE collation ] [, ... ] ] )

CREATE TYPE name AS ENUM
    ( [ 'label' [, ... ] ] )

CREATE TYPE name AS RANGE (
    SUBTYPE = subtype
    [ , SUBTYPE_OPCLASS = subtype_operator_class ]
    [ , COLLATION = collation ]
    [ , CANONICAL = canonical_function ]
    [ , SUBTYPE_DIFF = subtype_diff_function ]
    [ , MULTIRANGE_TYPE_NAME = multirange_type_name ]
)

CREATE TYPE name (
    INPUT = input_function,
    OUTPUT = output_function
    [ , RECEIVE = receive_function ]
    [ , SEND = send_function ]
    [ , TYPMOD_IN = type_modifier_input_function ]
    [ , TYPMOD_OUT = type_modifier_output_function ]
    [ , ANALYZE = analyze_function ]
    [ , SUBSCRIPT = subscript_function ]
    [ , INTERNALLENGTH = { internallength | VARIABLE } ]
    [ , PASSEDBYVALUE ]
    [ , ALIGNMENT = alignment ]
    [ , STORAGE = storage ]
    [ , LIKE = like_type ]
    [ , CATEGORY = category ]
    [ , PREFERRED = preferred ]
    [ , DEFAULT = default ]
    [ , ELEMENT = element ]
    [ , DELIMITER = delimiter ]
    [ , COLLATABLE = collatable ]
)

CREATE TYPE name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TYPE` က — current database ထဲမှာ အသုံးပြုဖို့ data type အသစ်တစ်ခုကို register (မှတ်ပုံတင်) လုပ်ပေးပါတယ်။ Type ကို သတ်မှတ်လိုက်တဲ့ user က — အဲဒီ type ရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

Schema နာမည် ပေးထားရင် — type ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — current schema ထဲမှာ ဖန်တီးပါတယ်။ Type ရဲ့ နာမည်က — schema တစ်ခုတည်းထဲမှာ ရှိနေတဲ့ — ရှိပြီးသား type သို့မဟုတ် domain တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။ (Tables တွေမှာ ဆက်စပ်နေတဲ့ data types တွေ ရှိတာမို့ — type ရဲ့ နာမည်က — schema တစ်ခုတည်းထဲမှာ ရှိနေတဲ့ — ရှိပြီးသား table တစ်ခုခုရဲ့ နာမည်နဲ့လည်း မတူညီဘဲ သီးခြား ဖြစ်ရပါမယ်။)

အပေါ်က syntax synopsis မှာ ပြထားသလို — `CREATE TYPE` မှာ ပုံစံ (form) ငါးမျိုး ရှိပါတယ်။ သူတို့က အသီးသီး *composite type* (ပေါင်းစပ် type), *enum type*, *range type*, *base type* သို့မဟုတ် *shell type* (နောက်မှ သတ်မှတ်မည့် type အတွက် နေရာစောင့် type) တစ်ခုကို ဖန်တီးပေးပါတယ်။ ပထမ ပုံစံ လေးခုကို အောက်မှာ အစဉ်လိုက် ဆွေးနွေးထားပါတယ်။ Shell type ဆိုတာက — နောက်မှ သတ်မှတ်ရမယ့် type တစ်ခုအတွက် နေရာစောင့် (placeholder) သက်သက် ဖြစ်ပြီး — type နာမည်ကလွဲလို့ တခြား parameter မပါဘဲ `CREATE TYPE` ကို ထုတ်ပေးခြင်းအားဖြင့် ဖန်တီးပါတယ်။ Range types နဲ့ base types တွေ ဖန်တီးတဲ့အခါ — ရှေ့ကနေ ကြိုတင် ရည်ညွှန်းဖို့ (forward references) အတွက် — shell types တွေ လိုအပ်ပါတယ် (အဲဒီ section တွေမှာ ဆွေးနွေးထားပါတယ်)။

### Composite Types (composite type များ)

`CREATE TYPE` ရဲ့ ပထမ ပုံစံက composite type တစ်ခုကို ဖန်တီးပေးပါတယ်။ Composite type ကို — attribute နာမည်တွေနဲ့ data types တွေရဲ့ စာရင်းတစ်ခုနဲ့ သတ်မှတ်ပါတယ်။ Attribute တစ်ခုရဲ့ data type က collatable (collation သုံးနိုင်သော) ဖြစ်နေရင် — attribute ရဲ့ collation ကိုလည်း သတ်မှတ်လို့ ရပါတယ်။ Composite type တစ်ခုက — table တစ်ခုရဲ့ row type နဲ့ အခြေခံအားဖြင့် အတူတူပဲ ဖြစ်ပေမယ့် — လိုချင်တာက type တစ်ခုကို သတ်မှတ်ရုံသက်သက်ဆိုရင် — table အစစ် တစ်ခု ဖန်တီးစရာ မလိုအောင် `CREATE TYPE` က ရှောင်ပေးပါတယ်။ သီးခြား တည်ရှိတဲ့ (stand-alone) composite type တစ်ခုက — ဥပမာ — function တစ်ခုရဲ့ argument ဒါမှမဟုတ် return type အနေနဲ့ — အသုံးဝင်ပါတယ်။

Composite type တစ်ခု ဖန်တီးနိုင်ဖို့ — attribute types တွေ အားလုံးပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

### Enumerated Types (enum type များ)

`CREATE TYPE` ရဲ့ ဒုတိယ ပုံစံက enumerated (enum) type တစ်ခုကို ဖန်တီးပေးပါတယ် — [အပိုင်း 8.7](/docs/postgresql/datatype-enum) မှာ ဖော်ပြထားတဲ့အတိုင်းပါ။ Enum types တွေက quoted labels (quote သွင်းထားသော အညွှန်း စာတန်းများ) တွေရဲ့ စာရင်းတစ်ခုကို ယူပြီး — label တစ်ခုချင်းစီက `NAMEDATALEN` bytes (standard PostgreSQL build တစ်ခုမှာ 64 bytes) ထက် ငယ်ရပါမယ်။ (Label သုညခု ပါတဲ့ enumerated type တစ်ခုကို ဖန်တီးလို့ ရပေမယ့် — [ALTER TYPE](/docs/postgresql/sql-altertype) ကို သုံးပြီး label အနည်းဆုံး တစ်ခု ထပ်ပေါင်းမပေးမချင်း — အဲဒီလို type က တန်ဖိုးတွေ သိုလှောင်ဖို့ သုံးလို့ မရပါဘူး။)

### Range Types (range type များ)

`CREATE TYPE` ရဲ့ တတိယ ပုံစံက range type အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ် — [အပိုင်း 8.17](/docs/postgresql/rangetypes) မှာ ဖော်ပြထားတဲ့အတိုင်းပါ။

Range type ရဲ့ `subtype` က — (range type အတွက် တန်ဖိုးတွေရဲ့ အစီအစဉ် (ordering) ကို ဆုံးဖြတ်ဖို့) ဆက်စပ်နေတဲ့ b-tree operator class တစ်ခု ရှိတဲ့ type မည်သည့်မဆို ဖြစ်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — subtype ရဲ့ default b-tree operator class ကို ordering ဆုံးဖြတ်ဖို့ သုံးပါတယ်; default မဟုတ်တဲ့ operator class တစ်ခုကို သုံးချင်ရင် — `subtype_opclass` နဲ့ သူ့ရဲ့ နာမည်ကို သတ်မှတ်ပါ။ Subtype က collatable ဖြစ်ပြီး — range ရဲ့ ordering မှာ default မဟုတ်တဲ့ collation တစ်ခုကို သုံးချင်ရင် — `collation` option နဲ့ လိုချင်တဲ့ collation ကို သတ်မှတ်ပါ။

Optional ဖြစ်တဲ့ `canonical` function က — သတ်မှတ်နေတဲ့ range type ရဲ့ argument တစ်ခုကို ယူပြီး — type တူညီတဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါမယ်။ သက်ဆိုင်ရာ ကိစ္စတွေမှာ — ဒါကို range တန်ဖိုးတွေကို canonical form (စံ ပုံစံ) တစ်ခုဆီ ပြောင်းလဲဖို့ သုံးပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 8.17.8](/docs/postgresql/rangetypes) ကို ကြည့်ပါ။ `canonical` function တစ်ခု ဖန်တီးတာက နည်းနည်း ရှုပ်ထွေးပါတယ် — ဘာလို့လဲဆိုတော့ — range type ကို မကြေညာနိုင်ခင် — အဲဒီ function ကို အရင်ဆုံး သတ်မှတ်ပြီးသား ဖြစ်ရလို့ပါ။ ဒါကို လုပ်ဖို့ — ပထမဆုံး — နာမည်နဲ့ owner တစ်ခုကလွဲလို့ တခြား property မရှိတဲ့ နေရာစောင့် type တစ်ခုဖြစ်တဲ့ — shell type တစ်ခုကို ဖန်တီးရပါမယ်။ ဒါကို — နောက်ထပ် parameter မပါဘဲ `CREATE TYPE name` ဆိုတဲ့ command ကို ထုတ်ပေးခြင်းအားဖြင့် လုပ်ပါတယ်။ ပြီးတော့ — shell type ကို argument နဲ့ result အဖြစ် သုံးပြီး function ကို ကြေညာနိုင်ပြီး — နောက်ဆုံးမှာ — နာမည် တူညီတဲ့ဟာကို သုံးပြီး range type ကို ကြေညာနိုင်ပါတယ်။ ဒါက — shell type entry ကို — တရားဝင် (valid) range type တစ်ခုနဲ့ အလိုအလျောက် အစားထိုးပေးပါတယ်။

Optional ဖြစ်တဲ့ `subtype_diff` function က — `subtype` type ရဲ့ တန်ဖိုး နှစ်ခုကို argument အဖြစ် ယူပြီး — ပေးထားတဲ့ တန်ဖိုး နှစ်ခုကြားက ကွာခြားချက် (difference) ကို ကိုယ်စားပြုတဲ့ `double precision` တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါမယ်။ ဒါက optional ဖြစ်ပေမယ့် — ပေးထားရင်တော့ — range type ရဲ့ columns တွေပေါ်က GiST indexes တွေရဲ့ ထိရောက်မှုကို သိသိသာသာ ပိုမြင့်စေပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 8.17.8](/docs/postgresql/rangetypes) ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `multirange_type_name` parameter က — သက်ဆိုင်တဲ့ multirange type ရဲ့ နာမည်ကို သတ်မှတ်ပေးပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — ဒီ နာမည်ကို အောက်ပါအတိုင်း အလိုအလျောက် ရွေးချယ်ပါတယ်။ Range type ရဲ့ နာမည်ထဲမှာ `range` ဆိုတဲ့ substring ပါဝင်နေရင် — range type နာမည်ထဲက `range` substring ကို `multirange` နဲ့ အစားထိုးပြီး multirange type နာမည်ကို ဖွဲ့စည်းပါတယ်။ မဟုတ်ရင် — range type နာမည်ရဲ့ နောက်မှာ `_multirange` ဆိုတဲ့ နောက်ဆက်တွဲ (suffix) ကို ထပ်ပေါင်းပြီး multirange type နာမည်ကို ဖွဲ့စည်းပါတယ်။

Range type တစ်ခု ဖန်တီးနိုင်ဖို့ — subtype ပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

### Base Types (base type များ)

`CREATE TYPE` ရဲ့ စတုတ္ထ ပုံစံက base type (အခြေခံ type — scalar type) အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Base type အသစ်တစ်ခု ဖန်တီးဖို့ — superuser ဖြစ်ရပါမယ်။ (မှားယွင်းတဲ့ type definition တစ်ခုက server ကို ရှုပ်ထွေးစေနိုင် ဒါမှမဟုတ် crash ဖြစ်စေနိုင်လို့ — ဒီ ကန့်သတ်ချက်ကို ထားတာပါ။)

Parameters တွေက — အပေါ်မှာ သရုပ်ဖော်ထားတဲ့ အစဉ်အတိုင်းတင် မဟုတ်ဘဲ — ဘယ် အစဉ်လိုက်မဆို ပေါ်လာနိုင်ပြီး — အများစုက optional ပါ။ Type ကို သတ်မှတ်ခင် — function နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပို ရှိနေအောင် register (မှတ်ပုံတင်) လုပ်ထားရပါမယ် (`CREATE FUNCTION` ကို သုံးပြီး)။ Support functions တွေထဲက `input_function` နဲ့ `output_function` တို့က မဖြစ်မနေ လိုအပ်ပြီး — `receive_function`, `send_function`, `type_modifier_input_function`, `type_modifier_output_function`, `analyze_function` နဲ့ `subscript_function` functions တွေကတော့ optional ပါ။ ယေဘုယျအားဖြင့် — ဒီ functions တွေကို C ဒါမှမဟုတ် တခြား low-level language တစ်ခုနဲ့ ရေးရပါတယ်။

`input_function` က — type ရဲ့ ပြင်ပ text ကိုယ်စားပြုပုံ (external textual representation) ကို — အဲဒီ type အတွက် သတ်မှတ်ထားတဲ့ operators တွေနဲ့ functions တွေ သုံးတဲ့ — အတွင်းပိုင်း ကိုယ်စားပြုပုံ (internal representation) ဆီ ပြောင်းပေးပါတယ်။ `output_function` ကတော့ ပြောင်းပြန် ကူးပြောင်းမှုကို လုပ်ပေးပါတယ်။ Input function ကို — `cstring` type ရဲ့ argument တစ်ခု ယူတဲ့ ပုံစံ ဒါမှမဟုတ် — `cstring`, `oid`, `integer` types တွေရဲ့ arguments သုံးခု ယူတဲ့ ပုံစံနဲ့ ကြေညာနိုင်ပါတယ်။ ပထမ argument က — C string အနေနဲ့ ရှိတဲ့ input text; ဒုတိယ argument က — type ကိုယ်တိုင်ရဲ့ OID (array types တွေကလွဲလို့ — သူတို့ကတော့ သူတို့ရဲ့ element type ရဲ့ OID ကို လက်ခံရရှိပါတယ်); တတိယ argument ကတော့ — သိရင် — destination column ရဲ့ `typmod` (မသိရင် -1 ကို ပေးပို့ပါတယ်)။ Input function က data type ကိုယ်တိုင်ရဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါမယ်။ ပုံမှန်အားဖြင့် — input function တစ်ခုကို STRICT လို့ ကြေညာသင့်ပါတယ်; မဟုတ်ရင် — NULL input တန်ဖိုးတစ်ခုကို ဖတ်တဲ့အခါ — NULL ဖြစ်တဲ့ ပထမ parameter တစ်ခုနဲ့ ခေါ်ယူခံရပါလိမ့်မယ်။ ဒီ အခြေအနေမှာ function က — error တစ်ခု ပစ်မလွှတ်မယ်ဆိုရင်လွဲလို့ — NULL ကိုပဲ ပြန်ပေးရပါဦးမယ်။ (ဒီ ကိစ္စကို — NULL inputs တွေကို ငြင်းပယ်ဖို့ လိုအပ်နိုင်တဲ့ — domain input functions တွေကို ထောက်ပံ့ဖို့ အဓိက ရည်ရွယ်ထားတာပါ။) Output function ကို — data type အသစ်ရဲ့ argument တစ်ခု ယူတဲ့ ပုံစံနဲ့ ကြေညာရပါမယ်။ Output function က `cstring` type ကို ပြန်ပေးရပါမယ်။ Output functions တွေကို NULL တန်ဖိုးတွေအတွက်တော့ ခေါ်ယူလို့ မရပါဘူး။

Optional ဖြစ်တဲ့ `receive_function` က — type ရဲ့ ပြင်ပ binary ကိုယ်စားပြုပုံကို အတွင်းပိုင်း ကိုယ်စားပြုပုံဆီ ပြောင်းပေးပါတယ်။ ဒီ function ကို ထောက်ပံ့မထားဘူးဆိုရင် — type က binary input (binary ပုံစံနဲ့ ထည့်သွင်းခြင်း) မှာ ပါဝင်လို့ မရပါဘူး။ Binary ကိုယ်စားပြုပုံကို — ကျိုးကြောင်းဆီလျော်လောက်အောင် portable ဖြစ်နေချိန်မှာ — အတွင်းပိုင်း ပုံစံဆီ ပြောင်းဖို့ စရိတ် သက်သာစေမယ့် ပုံစံမျိုး ရွေးချယ်သင့်ပါတယ်။ (ဥပမာ — standard integer data types တွေက network byte order ကို ပြင်ပ binary ကိုယ်စားပြုပုံအဖြစ် သုံးပြီး — အတွင်းပိုင်း ကိုယ်စားပြုပုံကတော့ machine ရဲ့ ဇာတိ (native) byte order နဲ့ ဖြစ်ပါတယ်။) Receive function က — တန်ဖိုး တရားဝင် (valid) ဖြစ်ကြောင်း သေချာစေဖို့ — လုံလောက်တဲ့ စစ်ဆေးမှုတွေ လုပ်ဆောင်သင့်ပါတယ်။ Receive function ကို — `internal` type ရဲ့ argument တစ်ခု ယူတဲ့ ပုံစံ ဒါမှမဟုတ် — `internal`, `oid`, `integer` types တွေရဲ့ arguments သုံးခု ယူတဲ့ ပုံစံနဲ့ ကြေညာနိုင်ပါတယ်။ ပထမ argument က — လက်ခံရရှိတဲ့ byte string ကို သိုလှောင်ထားတဲ့ `StringInfo` buffer တစ်ခုဆီက pointer; optional arguments တွေကတော့ — text input function အတွက် ရှိတာတွေနဲ့ အတူတူပါပဲ။ Receive function က data type ကိုယ်တိုင်ရဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါမယ်။ ပုံမှန်အားဖြင့် — receive function တစ်ခုကို STRICT လို့ ကြေညာသင့်ပါတယ်; မဟုတ်ရင် — NULL input တန်ဖိုးတစ်ခုကို ဖတ်တဲ့အခါ — NULL ဖြစ်တဲ့ ပထမ parameter တစ်ခုနဲ့ ခေါ်ယူခံရပါလိမ့်မယ်။ ဒီ အခြေအနေမှာ function က — error တစ်ခု ပစ်မလွှတ်မယ်ဆိုရင်လွဲလို့ — NULL ကိုပဲ ပြန်ပေးရပါဦးမယ်။ (ဒီ ကိစ္စကို — NULL inputs တွေကို ငြင်းပယ်ဖို့ လိုအပ်နိုင်တဲ့ — domain receive functions တွေကို ထောက်ပံ့ဖို့ အဓိက ရည်ရွယ်ထားတာပါ။) အလားတူပဲ — optional ဖြစ်တဲ့ `send_function` က အတွင်းပိုင်း ကိုယ်စားပြုပုံကနေ ပြင်ပ binary ကိုယ်စားပြုပုံဆီ ပြောင်းပေးပါတယ်။ ဒီ function ကို ထောက်ပံ့မထားဘူးဆိုရင် — type က binary output (binary ပုံစံနဲ့ ထုတ်ယူခြင်း) မှာ ပါဝင်လို့ မရပါဘူး။ Send function ကို — data type အသစ်ရဲ့ argument တစ်ခု ယူတဲ့ ပုံစံနဲ့ ကြေညာရပါမယ်။ Send function က `bytea` type ကို ပြန်ပေးရပါမယ်။ Send functions တွေကို NULL တန်ဖိုးတွေအတွက်တော့ ခေါ်ယူလို့ မရပါဘူး။

ဒီ အချိန်မှာ — input နဲ့ output functions တွေကို — data type အသစ် မဖန်တီးရသေးခင် ဖန်တီးရတာမို့ — သူတို့ရဲ့ results တွေ ဒါမှမဟုတ် arguments တွေကို type အသစ်နဲ့ ဘယ်လို ကြေညာနိုင်မလဲလို့ သင်တွေးမိနိုင်ပါတယ်။ အဖြေကတော့ — type ကို *shell type* အဖြစ် အရင် သတ်မှတ်ရမှာ ဖြစ်ပြီး — shell type ဆိုတာက — နာမည်နဲ့ owner တစ်ခုကလွဲလို့ တခြား property မရှိတဲ့ နေရာစောင့် type တစ်ခု ဖြစ်ပါတယ်။ ဒါကို — နောက်ထပ် parameter မပါဘဲ `CREATE TYPE name` ဆိုတဲ့ command ကို ထုတ်ပေးခြင်းအားဖြင့် လုပ်ပါတယ်။ ပြီးတော့ — shell type ကို ရည်ညွှန်းပြီး C I/O functions တွေကို သတ်မှတ်နိုင်ပါတယ်။ နောက်ဆုံးမှာ — definition အပြည့်အစုံ ပါတဲ့ `CREATE TYPE` က shell entry ကို — ပြည့်စုံပြီး တရားဝင်တဲ့ type definition တစ်ခုနဲ့ အစားထိုးပြီး — အဲဒီ နောက်မှာ type အသစ်ကို ပုံမှန်အတိုင်း သုံးနိုင်ပါပြီ။

Optional ဖြစ်တဲ့ `type_modifier_input_function` နဲ့ `type_modifier_output_function` တွေက — type က modifiers (type declaration တစ်ခုဆီ ကပ်ထားတဲ့ optional constraints — ဥပမာ `char(5)` သို့မဟုတ် `numeric(30,2)`) တွေကို ထောက်ပံ့တယ်ဆိုရင် — လိုအပ်ပါတယ်။ PostgreSQL က user-defined types တွေကို — modifier အဖြစ် — ရိုးရှင်းတဲ့ constant တစ်ခု ဒါမှမဟုတ် identifiers အများအပြား ယူခွင့် ပြုပါတယ်။ ဒါပေမယ့် — ဒီ အချက်အလက်ကို — system catalogs တွေထဲမှာ သိမ်းဆည်းဖို့ — non-negative integer value တစ်ခုတည်းထဲ ထည့်သွင်းနိုင်ဖို့ လိုအပ်ပါတယ်။ `type_modifier_input_function` ကို — ကြေညာထားတဲ့ modifier(s) တွေကို `cstring` array ပုံစံနဲ့ ပေးပို့ပါတယ်။ သူက — တန်ဖိုးတွေရဲ့ တရားဝင်မှု (validity) ကို စစ်ဆေးပြီး (မှားနေရင် error တစ်ခု ပစ်ချပြီး) — မှန်ကန်နေရင် — column ရဲ့ “typmod” အဖြစ် သိမ်းဆည်းခံရမယ့် — non-negative `integer` တန်ဖိုး တစ်ခုတည်းကို ပြန်ပေးရပါမယ်။ Type မှာ `type_modifier_input_function` မရှိဘူးဆိုရင် — type modifiers တွေကို ငြင်းပယ်ခံရပါလိမ့်မယ်။ `type_modifier_output_function` ကတော့ — အတွင်းပိုင်း integer typmod တန်ဖိုးကို — user display အတွက် မှန်ကန်တဲ့ ပုံစံဆီ ပြန်ပြောင်းပေးပါတယ်။ သူက — type နာမည်ရဲ့ နောက်မှာ ထပ်ပေါင်းရမယ့် string အတိအကျ ဖြစ်တဲ့ — `cstring` တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါတယ်; ဥပမာ — `numeric` ရဲ့ function က `(30,2)` ကို ပြန်ပေးနိုင်ပါတယ်။ `type_modifier_output_function` ကို ချန်လှပ်ထားလို့ ရပြီး — အဲဒီအခါ — default display format က — parentheses တွေထဲမှာ ဝန်းရံထားတဲ့ — သိမ်းဆည်းထားတဲ့ typmod integer တန်ဖိုး သက်သက်ပဲ ဖြစ်ပါတယ်။

Optional ဖြစ်တဲ့ `analyze_function` က — data type ရဲ့ columns တွေအတွက် — type-specific statistics (type အလိုက် သီးသန့် စာရင်းအင်း အချက်အလက်များ) စုဆောင်းမှုကို လုပ်ဆောင်ပါတယ်။ Default အနေနဲ့ — `ANALYZE` က — type အတွက် default b-tree operator class တစ်ခု ရှိနေရင် — type ရဲ့ “equals” နဲ့ “less-than” operators တွေကို သုံးပြီး statistics တွေ စုဆောင်းဖို့ ကြိုးစားပါတယ်။ Non-scalar types တွေအတွက်တော့ — ဒီ အပြုအမူက မသင့်လျော်နိုင်တာမို့ — custom analysis function တစ်ခုကို သတ်မှတ်ခြင်းအားဖြင့် ကျော်လွန် (override) လုပ်လို့ ရပါတယ်။ Analysis function ကို — `internal` type ရဲ့ argument တစ်ခုတည်း ယူပြီး — `boolean` result တစ်ခု ပြန်ပေးတဲ့ ပုံစံနဲ့ ကြေညာရပါမယ်။ Analysis functions တွေအတွက် အသေးစိတ် API က `src/include/commands/vacuum.h` ထဲမှာ ရှိပါတယ်။

Optional ဖြစ်တဲ့ `subscript_function` က — data type ကို SQL commands တွေထဲမှာ subscript (အောက်ညွှန်း နံပါတ်ဖြင့် ဝင်ရောက်သုံးစွဲခြင်း) လုပ်လို့ ရစေပါတယ်။ ဒီ function ကို သတ်မှတ်လိုက်တာက type ကို “true” array type (စစ်မှန်တဲ့ array type) အဖြစ် သတ်မှတ်ပေးတာ မဟုတ်ပါဘူး; ဥပမာ — `ARRAY[]` constructs တွေရဲ့ result type အတွက် candidate တစ်ခု ဖြစ်လာမှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — type တစ်ခုရဲ့ တန်ဖိုးကို subscript လုပ်တာက — အဲဒီထဲက data ထုတ်ယူဖို့ သဘာဝကျတဲ့ notation တစ်ခု ဆိုရင် — အဲဒါ ဘာကို ဆိုလိုလဲဆိုတာ သတ်မှတ်ဖို့ `subscript_function` တစ်ခုကို ရေးနိုင်ပါတယ်။ Subscript function ကို — `internal` type ရဲ့ argument တစ်ခုတည်း ယူပြီး — subscripting ကို implement (အကောင်အထည်ဖော်) လုပ်ပေးတဲ့ methods (functions) တစ်ခုရဲ့ struct ကို ညွှန်ပြတဲ့ — `internal` result တစ်ခုကို ပြန်ပေးတဲ့ ပုံစံနဲ့ ကြေညာရပါမယ်။ Subscript functions တွေအတွက် အသေးစိတ် API က `src/include/nodes/subscripting.h` ထဲမှာ ရှိပါတယ်။ `src/backend/utils/adt/arraysubs.c` ထဲက array implementation ဒါမှမဟုတ် — `contrib/hstore/hstore_subs.c` ထဲက ပိုရိုးရှင်းတဲ့ code ကိုလည်း ဖတ်ကြည့်တာ အသုံးဝင်နိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်ကို အောက်က [Array Types](/docs/postgresql/sql-createtype) မှာ ဖော်ပြထားပါတယ်။

Type အသစ်ရဲ့ အတွင်းပိုင်း ကိုယ်စားပြုပုံရဲ့ အသေးစိတ်တွေကို — I/O functions တွေနဲ့ type နဲ့ တွဲဖက် အလုပ်လုပ်ဖို့ သင်ဖန်တီးတဲ့ တခြား functions တွေကပဲ သိပေမယ့် — အတွင်းပိုင်း ကိုယ်စားပြုပုံရဲ့ property တချို့ကိုတော့ PostgreSQL ဆီ ကြေညာပေးရပါတယ်။ အဲဒီထဲက အဓိက အကျဆုံးက `internallength` ပါ။ Base data types တွေက fixed-length (အလျား ပုံသေ) ဖြစ်နိုင်ပြီး — အဲဒီအခါ `internallength` က positive integer တစ်ခု ဖြစ်ပါတယ် — ဒါမှမဟုတ် — variable-length (အလျား ပြောင်းလဲနိုင်သော) ဖြစ်နိုင်ပြီး — `internallength` ကို `VARIABLE` လို့ သတ်မှတ်ခြင်းအားဖြင့် ညွှန်ပြပါတယ်။ (အတွင်းပိုင်းမှာ ဒါကို `typlen` ကို -1 လို့ သတ်မှတ်ခြင်းအားဖြင့် ကိုယ်စားပြုပါတယ်။) Variable-length types တွေ အားလုံးရဲ့ အတွင်းပိုင်း ကိုယ်စားပြုပုံက — type ရဲ့ ဒီ တန်ဖိုးရဲ့ စုစုပေါင်း အလျားကို ပေးတဲ့ 4-byte integer တစ်ခုနဲ့ စတင်ရပါမယ်။ (Length field ကို [အပိုင်း 66.2](https://www.postgresql.org/docs/current/storage-toast.html) မှာ ဖော်ပြထားသလို — မကြာခဏဆိုသလို encode လုပ်ထားတာမို့ — သူ့ကို တိုက်ရိုက် ဝင်ရောက် ဖတ်ရှုတာက မလိမ္မာပါဘူးဆိုတာ သတိပြုပါ။)

Optional flag ဖြစ်တဲ့ `PASSEDBYVALUE` က — ဒီ data type ရဲ့ တန်ဖိုးတွေကို — reference (ရည်ညွှန်းချက်) အနေနဲ့ မဟုတ်ဘဲ — by value (တန်ဖိုး တိုက်ရိုက်) အနေနဲ့ ပေးပို့တယ်လို့ ညွှန်ပြပါတယ်။ By value ပေးပို့တဲ့ types တွေက fixed-length ဖြစ်ရပြီး — သူတို့ရဲ့ အတွင်းပိုင်း ကိုယ်စားပြုပုံက `Datum` type ရဲ့ အရွယ်အစား (machine တချို့မှာ 4 bytes — တချို့မှာ 8 bytes) ထက် ကြီးလို့ မရပါဘူး။

`alignment` parameter က — data type အတွက် လိုအပ်တဲ့ storage alignment (သိုလှောင် ချိန်ညှိမှု) ကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေက — 1, 2, 4 သို့မဟုတ် 8 byte boundaries တွေပေါ်မှာ alignment လုပ်တာနဲ့ ညီမျှပါတယ်။ Variable-length types တွေက — သူတို့ရဲ့ ပထမ component အဖြစ် `int4` တစ်ခု မဖြစ်မနေ ပါဝင်တာမို့ — alignment အနည်းဆုံး 4 ရှိရပါမယ်ဆိုတာ သတိပြုပါ။

`storage` parameter က — variable-length data types တွေအတွက် storage strategies (သိုလှောင် နည်းဗျူဟာများ) ရွေးချယ်ခွင့် ပေးပါတယ်။ (Fixed-length types တွေအတွက်တော့ `plain` တစ်ခုတည်းကိုပဲ ခွင့်ပြုပါတယ်။) `plain` က — type ရဲ့ data တွေကို အမြဲတမ်း inline (main table row ထဲမှာ တိုက်ရိုက်) သိမ်းပြီး — compress မလုပ်ဘူးလို့ သတ်မှတ်ပါတယ်။ `extended` က — system က ရှည်လျားတဲ့ data value တစ်ခုကို အရင်ဆုံး compress လုပ်ဖို့ ကြိုးစားပြီး — အရမ်း ရှည်နေသေးရင် — တန်ဖိုးကို main table row ရဲ့ အပြင်ဘက်ကို ရွှေ့ပေးမယ်လို့ သတ်မှတ်ပါတယ်။ `external` က — တန်ဖိုးကို main table ရဲ့ အပြင်ဘက်ကို ရွှေ့ခွင့် ပြုပေမယ့် — system က compress လုပ်ဖို့တော့ မကြိုးစားပါဘူး။ `main` က compress လုပ်ခွင့် ပြုပေမယ့် — တန်ဖိုးကို main table ရဲ့ အပြင်ဘက်ကို ရွှေ့တာကိုတော့ တွန့်ဆုတ်ပါတယ်။ (ဒီ storage strategy ရှိတဲ့ data items တွေက — row တစ်ခုကို အံဝင်အောင် လုပ်ဖို့ တခြား နည်းလမ်း မရှိဘူးဆိုရင် — main table ရဲ့ အပြင်ဘက်ကို ရွှေ့ခံရသေးပေမယ့် — `extended` နဲ့ `external` items တွေထက် — main table ထဲမှာ ဦးစားပေး ထိန်းသိမ်းခံရပါတယ်။)

`plain` ကလွဲလို့ တခြား `storage` တန်ဖိုး အားလုံးက — data type ရဲ့ functions တွေက — [အပိုင်း 66.2](https://www.postgresql.org/docs/current/storage-toast.html) နဲ့ [အပိုင်း 36.13.1](https://www.postgresql.org/docs/current/xtypes.html#XTYPES-TOAST) တွေမှာ ဖော်ပြထားသလို — *toasted* (TOAST ပြုလုပ်ထားသော — ရှည်လျားသည့် data ကို သီးခြား သိမ်းဆည်းထားသော) ဖြစ်နေတဲ့ တန်ဖိုးတွေကို ကိုင်တွယ်နိုင်တယ်လို့ ဆိုလိုပါတယ်။ ပေးထားတဲ့ တခြား တိကျတဲ့ တန်ဖိုးက — toastable data type တစ်ခုရဲ့ columns တွေအတွက် default TOAST storage strategy ကို ဆုံးဖြတ်ရုံသက်သက် ဖြစ်ပြီး — users တွေက `ALTER TABLE SET STORAGE` ကို သုံးပြီး — column တစ်ခုချင်းစီအတွက် တခြား strategies တွေ ရွေးချယ်နိုင်ပါတယ်။

`like_type` parameter က — data type တစ်ခုရဲ့ အခြေခံ ကိုယ်စားပြုမှု properties တွေကို သတ်မှတ်ဖို့ — နည်းလမ်း တစ်မျိုး ပေးပါတယ်: သူတို့ကို ရှိပြီးသား type တစ်ခုကနေ ကူးယူပါတယ်။ `internallength`, `passedbyvalue`, `alignment` နဲ့ `storage` တို့ရဲ့ တန်ဖိုးတွေကို — နာမည်ပေးထားတဲ့ type ကနေ ကူးယူပါတယ်။ (ဒီ တန်ဖိုးတချို့ကို `LIKE` clause နဲ့အတူ တခြား သတ်မှတ်ချက်တွေ ပေးပြီး ကျော်လွန် (override) လုပ်လို့ ရပေမယ့် — ပုံမှန်အားဖြင့်တော့ မလိုလားအပ်ပါဘူး။) Type အသစ်ရဲ့ low-level implementation က ရှိပြီးသား type တစ်ခုပေါ်မှာ တစ်နည်းနည်းနဲ့ “piggybacks” (မှီတွယ် အသုံးပြု) လုပ်နေတဲ့အခါ — ဒီ နည်းနဲ့ ကိုယ်စားပြုပုံ သတ်မှတ်တာက အထူး အသုံးဝင်ပါတယ်။

`category` နဲ့ `preferred` parameters တွေကို — ambiguous (မရှင်းလင်းသော) အခြေအနေတွေမှာ ဘယ် implicit cast ကို သုံးမလဲဆိုတာ ထိန်းချုပ်ဖို့ ကူညီဖို့ သုံးနိုင်ပါတယ်။ Data type တိုင်းက — ASCII character တစ်ခုတည်းနဲ့ နာမည်ပေးထားတဲ့ category (အမျိုးအစား အုပ်စု) တစ်ခုထဲမှာ ပါဝင်ပြီး — type တိုင်းက သူ့ရဲ့ category အတွင်းမှာ “preferred” (နှစ်သက်ရာ) ဖြစ်သည် သို့မဟုတ် မဟုတ်ပါဘူး။ Overloaded functions ဒါမှမဟုတ် operators တွေကို ဖြေရှင်းရာမှာ ဒီ စည်းမျဉ်းက အထောက်အကူ ဖြစ်နေတဲ့အခါ — parser က preferred types တွေဆီ cast လုပ်တာကို ဦးစားပေး လုပ်ပါတယ် (category တူညီတဲ့ တခြား types တွေကနေပဲ ဖြစ်ပေမယ့်)။ နောက်ထပ် အသေးစိတ်အတွက် [အခန်း 10](https://www.postgresql.org/docs/current/typeconv.html) ကို ကြည့်ပါ။ တခြား type တစ်ခုခုနဲ့ implicit casts တွေ ရော မရှိတဲ့ types တွေအတွက်တော့ — ဒီ settings တွေကို defaults တွေအတိုင်း ထားလိုက်တာက လုံလောက်ပါတယ်။ ဒါပေမယ့် — implicit casts တွေ ရှိတဲ့ ဆက်စပ် type အုပ်စုတစ်ခုအတွက်တော့ — သူတို့ အားလုံးကို category တစ်ခုထဲမှာ ပါဝင်အောင် အမှတ်အသား လုပ်ပြီး — “အရမ်း ယေဘုယျကျတဲ့” types တစ်ခု ဒါမှမဟုတ် နှစ်ခုကို — category အတွင်းမှာ preferred အဖြစ် ရွေးချယ်တာက မကြာခဏဆိုသလို အထောက်အကူ ဖြစ်ပါတယ်။ `category` parameter က — user-defined type တစ်ခုကို — numeric ဒါမှမဟုတ် string types တွေလို — ရှိပြီးသား built-in category တစ်ခုထဲကို ထည့်တဲ့အခါ အထူး အသုံးဝင်ပါတယ်။ ဒါပေမယ့် — လုံးဝ user-defined အသစ် type categories တွေကိုလည်း ဖန်တီးလို့ ရပါသေးတယ်။ အဲဒီလို category တစ်ခုကို နာမည်ပေးဖို့ — upper-case letter ကလွဲလို့ — ဘယ် ASCII character ကိုမဆို ရွေးချယ်နိုင်ပါတယ်။

User တွေက data type ရဲ့ columns တွေကို null value ကလွဲလို့ တခြား တစ်ခုခုဆီ default ဖြစ်စေချင်တယ်ဆိုရင် — default value တစ်ခုကို သတ်မှတ်လို့ ရပါတယ်။ `DEFAULT` key word နဲ့ default ကို သတ်မှတ်ပါ။ (ဒီလို default တစ်ခုကို — column တစ်ခုချင်းစီဆီ ကပ်ထားတဲ့ explicit `DEFAULT` clause တစ်ခုက ကျော်လွန် (override) လုပ်နိုင်ပါတယ်။)

Type တစ်ခုက fixed-length array type ဖြစ်ကြောင်း ညွှန်ပြဖို့ — `ELEMENT` key word နဲ့ array elements တွေရဲ့ type ကို သတ်မှတ်ပါ။ ဥပမာ — 4-byte integers (`int4`) တွေရဲ့ array တစ်ခုကို သတ်မှတ်ဖို့ — `ELEMENT = int4` လို့ သတ်မှတ်ပါ။ နောက်ထပ် အသေးစိတ်အတွက် အောက်က [Array Types](/docs/postgresql/sql-createtype) ကို ကြည့်ပါ။

ဒီ type ရဲ့ arrays တွေရဲ့ ပြင်ပ ကိုယ်စားပြုပုံထဲမှာ တန်ဖိုးတွေကြားမှာ သုံးရမယ့် delimiter ကို ညွှန်ပြဖို့ — `delimiter` ကို character တစ်ခုခုနဲ့ သတ်မှတ်နိုင်ပါတယ်။ Default delimiter က comma (`,`) ဖြစ်ပါတယ်။ Delimiter က array type ကိုယ်တိုင် မဟုတ်ဘဲ — array element type နဲ့ ဆက်စပ်နေတယ်ဆိုတာ သတိပြုပါ။

Optional Boolean parameter ဖြစ်တဲ့ `collatable` က true ဆိုရင် — type ရဲ့ column definitions တွေနဲ့ expressions တွေက `COLLATE` clause ကို သုံးပြီး collation information တွေ သယ်ဆောင်နိုင်ပါတယ်။ Collation information ကို တကယ် အသုံးချဖို့က — type ပေါ်မှာ လည်ပတ်နေတဲ့ functions တွေရဲ့ implementations တွေရဲ့ တာဝန် ဖြစ်ပြီး — type ကို collatable အဖြစ် အမှတ်အသား လုပ်ရုံနဲ့ — အလိုအလျောက် ဖြစ်မလာပါဘူး။

### Array Types (array type များ)

User-defined type တစ်ခုကို ဖန်တီးလိုက်တိုင်း — PostgreSQL က — ဆက်စပ်နေတဲ့ array type တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ သူ့ရဲ့ နာမည်က — element type ရဲ့ နာမည်ရဲ့ ရှေ့မှာ underscore တစ်ခု ထပ်ပေါင်းထားပြီး — `NAMEDATALEN` bytes ထက် ငယ်နေဖို့ — လိုအပ်ရင် ဖြတ်တောက် (truncate) လုပ်ထားတဲ့ နာမည် ဖြစ်ပါတယ်။ (ဒီလို ထုတ်ပေးလိုက်တဲ့ နာမည်က ရှိပြီးသား type နာမည်တစ်ခုနဲ့ တိုက်မိနေရင် — မတိုက်မိတော့တဲ့ နာမည်တစ်ခု မတွေ့မချင်း — ဒီ လုပ်ငန်းစဉ်ကို ထပ်ခါထပ်ခါ လုပ်ပါတယ်။) ဒီလို သွယ်ဝိုက် (implicitly) ဖန်တီးလိုက်တဲ့ array type က variable length ဖြစ်ပြီး — built-in input နဲ့ output functions တွေဖြစ်တဲ့ `array_in` နဲ့ `array_out` တွေကို သုံးပါတယ်။ ထို့ပြင် — user-defined type ပေါ်မှာ `ARRAY[]` လို constructs တွေအတွက် — system က သုံးတာက ဒီ type ပဲ ဖြစ်ပါတယ်။ Array type က — သူ့ရဲ့ element type ရဲ့ owner ဒါမှမဟုတ် schema ထဲက ပြောင်းလဲမှုတွေကို ခြေရာခံပြီး — element type ကို drop လုပ်ရင် — array type ကိုပါ drop လုပ်ပါတယ်။

System က array type မှန်ကန်တာကို အလိုအလျောက် ဖန်တီးပေးနေတယ်ဆိုရင် — `ELEMENT` option က ဘာလို့ ရှိနေတာလဲလို့ သင်တရားဝင် မေးနိုင်ပါတယ်။ `ELEMENT` ကို သုံးဖို့ အသုံးဝင်တဲ့ အဓိက ကိစ္စကတော့ — သင်ဖန်တီးနေတာက — အတွင်းပိုင်းမှာ — တူညီတဲ့ အရာတွေ အများအပြားရဲ့ array တစ်ခု ဖြစ်နေတဲ့ — fixed-length type တစ်ခု ဖြစ်ပြီး — type တစ်ခုလုံးအတွက် သင်စီစဉ်ထားတဲ့ operations တွေအပြင် — ဒီ အရာတွေကို subscripting နဲ့ တိုက်ရိုက် ဝင်ရောက်ခွင့် ပြုချင်တဲ့အခါမျိုးမှာပါ။ ဥပမာ — `point` type ကို floating-point ဂဏန်း နှစ်ခုနဲ့ပဲ ကိုယ်စားပြုပြီး — `point[0]` နဲ့ `point[1]` တွေနဲ့ ဝင်ရောက်လို့ ရပါတယ်။ ဒီ facility က — အတွင်းပိုင်း ပုံစံက fixed-length field တူညီတဲ့ဟာတွေရဲ့ sequence တစ်ခု အတိအကျ ဖြစ်နေတဲ့ — fixed-length types တွေအတွက်သာ အလုပ်လုပ်တယ်ဆိုတာ သတိပြုပါ။ သမိုင်းကြောင်း အရ (ဆိုလိုတာက — ဒါက ရှင်းရှင်းလင်းလင်း မှားနေပေမယ့် — ပြောင်းဖို့က အခု အရမ်း နောက်ကျနေပါပြီ) — fixed-length array types တွေရဲ့ subscripting က — variable-length arrays တွေမှာ 1 ကနေ စတာနဲ့ မတူဘဲ — 0 ကနေ စပါတယ်။

`SUBSCRIPT` option ကို သတ်မှတ်တာက — system က type ကို array type အဖြစ် တခြားနည်းနဲ့ မမှတ်ယူထားဘူးဆိုရင်တောင် — data type တစ်ခုကို subscript လုပ်လို့ ရစေပါတယ်။ Fixed-length arrays တွေအတွက် အခုနက ဖော်ပြခဲ့တဲ့ အပြုအမူကို — တကယ်တော့ — `raw_array_subscript_handler` ဆိုတဲ့ `SUBSCRIPT` handler function နဲ့ implement လုပ်ထားတာပါ — ပြီးတော့ — fixed-length type တစ်ခုအတွက် `ELEMENT` ကို `SUBSCRIPT` မရေးပဲ သတ်မှတ်ရင် — ဒီ function ကို အလိုအလျောက် သုံးပါတယ်။

Custom `SUBSCRIPT` function တစ်ခုကို သတ်မှတ်တဲ့အခါ — `SUBSCRIPT` handler function က — ဘာကို ပြန်ပေးရမလဲ သိဖို့ — `typelem` ကို တိုင်ပင်ဖို့ လိုအပ်တယ်ဆိုရင်ကလွဲလို့ — `ELEMENT` ကို သတ်မှတ်စရာ မလိုပါဘူး။ `ELEMENT` ကို သတ်မှတ်လိုက်တာက — system က type အသစ်ထဲမှာ element type ပါဝင်တယ် ဒါမှမဟုတ် — element type ပေါ်မှာ တစ်နည်းနည်းနဲ့ ရုပ်ပိုင်းဆိုင်ရာ မှီခိုနေတယ်လို့ ယူဆစေတယ်ဆိုတာ သတိပြုပါ; ဒါကြောင့် — ဥပမာ — မှီခိုနေတဲ့ type ရဲ့ columns တွေ ရှိနေရင် — element type ရဲ့ properties တွေကို ပြောင်းလဲတာကို ခွင့်မပြုတော့ပါဘူး။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် type တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **attribute_name** — Composite type အတွက် attribute (column) တစ်ခုရဲ့ နာမည်။
- **data_type** — Composite type ရဲ့ column တစ်ခု ဖြစ်လာမယ့် — ရှိပြီးသား data type တစ်ခုရဲ့ နာမည်။
- **collation** — Composite type တစ်ခုရဲ့ column တစ်ခု ဒါမှမဟုတ် — range type တစ်ခုနဲ့ ဆက်စပ်ဖို့ — ရှိပြီးသား collation တစ်ခုရဲ့ နာမည်။
- **label** — Enum type တစ်ခုရဲ့ တန်ဖိုးတစ်ခုနဲ့ ဆက်စပ်နေတဲ့ textual label (စာသား အညွှန်း) ကို ကိုယ်စားပြုတဲ့ string literal တစ်ခု။
- **subtype** — Range type က ranges (အကွာအဝေးများ) တွေကို ကိုယ်စားပြုပေးမယ့် element type ရဲ့ နာမည်။
- **subtype_operator_class** — Subtype အတွက် b-tree operator class တစ်ခုရဲ့ နာမည်။
- **canonical_function** — Range type အတွက် canonicalization function (စံ ပုံစံသို့ ပြောင်းပေးသော function) ရဲ့ နာမည်။
- **subtype_diff_function** — Subtype အတွက် difference function (ကွာခြားချက် function) တစ်ခုရဲ့ နာမည်။
- **multirange_type_name** — သက်ဆိုင်တဲ့ multirange type ရဲ့ နာမည်။
- **input_function** — Type ရဲ့ ပြင်ပ text ပုံစံကနေ အတွင်းပိုင်း ပုံစံဆီ data တွေကို ပြောင်းပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **output_function** — Type ရဲ့ အတွင်းပိုင်း ပုံစံကနေ ပြင်ပ text ပုံစံဆီ data တွေကို ပြောင်းပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **receive_function** — Type ရဲ့ ပြင်ပ binary ပုံစံကနေ အတွင်းပိုင်း ပုံစံဆီ data တွေကို ပြောင်းပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **send_function** — Type ရဲ့ အတွင်းပိုင်း ပုံစံကနေ ပြင်ပ binary ပုံစံဆီ data တွေကို ပြောင်းပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **type_modifier_input_function** — Type အတွက် modifier(s) တွေရဲ့ array တစ်ခုကို အတွင်းပိုင်း ပုံစံဆီ ပြောင်းပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **type_modifier_output_function** — Type ရဲ့ modifier(s) တွေရဲ့ အတွင်းပိုင်း ပုံစံကို ပြင်ပ text ပုံစံဆီ ပြောင်းပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **analyze_function** — Data type အတွက် statistical analysis (စာရင်းအင်း ပိုင်းခြား စိတ်ဖြာမှု) လုပ်ဆောင်ပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **subscript_function** — Data type တစ်ခုရဲ့ တန်ဖိုးကို subscript လုပ်တာက ဘာကို လုပ်ပေးလဲဆိုတာ သတ်မှတ်ပေးတဲ့ function တစ်ခုရဲ့ နာမည်။
- **internallength** — Type အသစ်ရဲ့ အတွင်းပိုင်း ကိုယ်စားပြုပုံရဲ့ bytes နဲ့ အလျားကို သတ်မှတ်ပေးတဲ့ numeric constant တစ်ခု။ Default ယူဆချက်ကတော့ variable-length ဖြစ်တာပါ။
- **alignment** — Data type ရဲ့ storage alignment လိုအပ်ချက်။ သတ်မှတ်မယ်ဆိုရင် — char, int2, int4 သို့မဟုတ် double ဖြစ်ရပြီး — default က int4 ဖြစ်ပါတယ်။
- **storage** — Data type အတွက် storage strategy။ သတ်မှတ်မယ်ဆိုရင် — plain, external, extended သို့မဟုတ် main ဖြစ်ရပြီး — default က plain ဖြစ်ပါတယ်။
- **like_type** — Type အသစ်က ကိုယ်စားပြုပုံ တူညီမယ့် — ရှိပြီးသား data type တစ်ခုရဲ့ နာမည်။ internallength, passedbyvalue, alignment နဲ့ storage တို့ရဲ့ တန်ဖိုးတွေကို — ဒီ `CREATE TYPE` command ထဲမှာ တခြား နေရာတွေမှာ explicit သတ်မှတ်ပြီး ကျော်လွန်မထားဘူးဆိုရင် — အဲဒီ type ကနေ ကူးယူပါတယ်။
- **category** — ဒီ type အတွက် category code (ASCII character တစ်ခုတည်း)။ Default က “user-defined type” (user သတ်မှတ် type) အတွက် 'U' ဖြစ်ပါတယ်။ တခြား standard category codes တွေကို ဇယား 52.65 မှာ တွေ့နိုင်ပါတယ်။ Custom categories တွေ ဖန်တီးဖို့ — တခြား ASCII characters တွေကိုလည်း ရွေးချယ်နိုင်ပါတယ်။
- **preferred** — ဒီ type က သူ့ရဲ့ type category အတွင်းမှာ preferred type တစ်ခု ဆိုရင် true — မဟုတ်ရင် false။ Default က false ဖြစ်ပါတယ်။ ရှိပြီးသား type category တစ်ခုအတွင်းမှာ preferred type အသစ်တစ်ခု ဖန်တီးတာက — အံ့အားသင့်စရာ အပြုအမူ ပြောင်းလဲမှုတွေ ဖြစ်စေနိုင်တာမို့ — အရမ်း သတိထားပါ။
- **default** — Data type အတွက် default value။ ချန်လိုက်ရင် — default က null ဖြစ်ပါတယ်။
- **element** — ဖန်တီးနေတဲ့ type က array တစ်ခု ဖြစ်ပြီး — ဒါက array elements တွေရဲ့ type ကို သတ်မှတ်ပေးပါတယ်။
- **delimiter** — ဒီ type နဲ့ လုပ်ထားတဲ့ arrays တွေထဲမှာ တန်ဖိုးတွေကြားမှာ သုံးရမယ့် delimiter character။
- **collatable** — ဒီ type ရဲ့ operations တွေက collation information ကို သုံးနိုင်ရင် true။ Default က false ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

Data type တစ်ခုကို ဖန်တီးပြီးတာနဲ့ — အသုံးပြုမှုအပေါ် ကန့်သတ်ချက် (restriction) တွေ မရှိတော့တာမို့ — base type ဒါမှမဟုတ် range type တစ်ခု ဖန်တီးတာက — type definition ထဲမှာ ဖော်ပြထားတဲ့ functions တွေပေါ်မှာ — public execute permission ပေးအပ်လိုက်တာနဲ့ တူညီပါတယ်။ Type definition တစ်ခုမှာ အသုံးဝင်တဲ့ functions အမျိုးအစားတွေအတွက်တော့ — ဒါက ပုံမှန်အားဖြင့် ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — type တစ်ခုကို — သူ့ကို external form ဆီ ပြောင်းတဲ့အခါ ဒါမှမဟုတ် external form ကနေ ပြောင်းတဲ့အခါ — “လျှို့ဝှက်” information တွေ သုံးစရာ လိုအပ်မယ့် ပုံစံမျိုး ဒီဇိုင်း မလုပ်ခင် — နှစ်ခါလောက် စဉ်းစားသင့်ပါတယ်။

PostgreSQL version 8.3 မတိုင်ခင်က — generated array type တစ်ခုရဲ့ နာမည်က — element type ရဲ့ နာမည်ရဲ့ ရှေ့မှာ underscore character (`_`) တစ်ခု ထပ်ပေါင်းထားတဲ့ နာမည်ပဲ အမြဲတမ်း ဖြစ်ခဲ့ပါတယ်။ (ဒါကြောင့် — type names တွေရဲ့ အလျားကို — တခြား နာမည်တွေထက် — character တစ်လုံး ပိုတိုအောင် ကန့်သတ်ထားခဲ့ရပါတယ်။) ဒါက အခုအချိန်အထိ ယေဘုယျအားဖြင့် ဒီအတိုင်းပဲ ဖြစ်နေပေမယ့် — maximum-length နာမည်တွေ ဒါမှမဟုတ် — underscore နဲ့ စတင်တဲ့ user type နာမည်တွေနဲ့ တိုက်မိမှုတွေ ရှိတဲ့ ကိစ္စတွေမှာ — array type နာမည်က ဒီကနေ သွေဖည်သွားနိုင်ပါတယ်။ ဒါကြောင့် — ဒီ convention ပေါ်မှာ မှီခိုပြီး code တွေ ရေးတာက deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) ဖြစ်ပါတယ်။ အဲဒီအစား — ပေးထားတဲ့ type တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ array type ကို ရှာဖွေဖို့ — `pg_type`.`typarray` ကို သုံးပါ။

Underscore နဲ့ စတင်တဲ့ type နဲ့ table နာမည်တွေကို ရှောင်တာက ပညာရှိရာရောက်နိုင်ပါတယ်။ Server က — user ပေးတဲ့ နာမည်တွေနဲ့ တိုက်မိမှုတွေကို ရှောင်ဖို့ — generated array type နာမည်တွေကို ပြောင်းပေးမှာ ဖြစ်ပေမယ့် — အထူးသဖြင့် — underscore နဲ့ စတင်တဲ့ type နာမည်တွေကို array တွေကို အမြဲတမ်း ကိုယ်စားပြုတယ်လို့ ယူဆနေတတ်တဲ့ — client software အဟောင်းတွေနဲ့ဆိုရင် — ရှုပ်ထွေးမှု ဖြစ်နိုင်ခြေ ရှိနေဆဲပါ။

PostgreSQL version 8.2 မတိုင်ခင်က — `CREATE TYPE name` ဆိုတဲ့ shell-type creation syntax မရှိခဲ့ပါဘူး။ Base type အသစ်တစ်ခု ဖန်တီးဖို့ နည်းလမ်းက — သူ့ရဲ့ input function ကို အရင်ဆုံး ဖန်တီးတာ ဖြစ်ခဲ့ပါတယ်။ ဒီ ချဉ်းကပ်မှုမှာ — PostgreSQL က — input function ရဲ့ return type အဖြစ် — data type အသစ်ရဲ့ နာမည်ကို ပထမဆုံး တွေ့ရပါတယ်။ ဒီ အခြေအနေမှာ shell type ကို သွယ်ဝိုက် (implicitly) ဖန်တီးပြီး — နောက်ပိုင်းမှာ — ကျန် I/O functions တွေရဲ့ definitions တွေထဲမှာ ရည်ညွှန်းလို့ ရပါတယ်။ ဒီ ချဉ်းကပ်မှုက အခုထိ အလုပ်လုပ်နေဆဲ ဖြစ်ပေမယ့် — deprecated ဖြစ်ပြီး — အနာဂတ် release တချို့မှာ ခွင့်မပြုတော့နိုင်ပါဘူး။ ထို့ပြင် — function definitions တွေထဲမှာ ရိုးရိုး စာလုံးပေါင်း အမှားတွေကြောင့် — shell types တွေနဲ့ catalogs တွေကို မတော်တဆ ရှုပ်ပွ မသွားစေဖို့ — input function ကို C နဲ့ ရေးထားတဲ့အခါမှသာ — shell type တစ်ခုကို ဒီ နည်းနဲ့ ဖန်တီးပေးမှာ ဖြစ်ပါတယ်။

PostgreSQL version 16 နဲ့ ၎င်းနောက်ပိုင်းမှာ — base types တွေရဲ့ input functions တွေက — အရင် versions တွေမှာ လိုပဲ `ereport()` exceptions တွေ ပစ်ချတာမျိုး မဟုတ်ဘဲ — `errsave()`/`ereturn()` ဆိုတဲ့ mechanism အသစ်တွေကို သုံးပြီး “soft” errors (ပျော့ပျောင်းသော error များ) တွေကို ပြန်ပေးတာက ပိုနှစ်သက်ဖွယ် ဖြစ်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် `src/backend/utils/fmgr/README` ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

ဒီ ဥပမာက composite type တစ်ခုကို ဖန်တီးပြီး — function definition တစ်ခုထဲမှာ သုံးပြထားပါတယ်:

```
CREATE TYPE compfoo AS (f1 int, f2 text);

CREATE FUNCTION getfoo() RETURNS SETOF compfoo AS $$
    SELECT fooid, fooname FROM foo
$$ LANGUAGE SQL;
```

ဒီ ဥပမာက enumerated type တစ်ခုကို ဖန်တီးပြီး — table definition တစ်ခုထဲမှာ သုံးပြထားပါတယ်:

```sql
CREATE TYPE bug_status AS ENUM ('new', 'open', 'closed');

CREATE TABLE bug (
    id serial,
    description text,
    status bug_status
);
```

ဒီ ဥပမာက range type တစ်ခုကို ဖန်တီးပြထားပါတယ်:

```sql
CREATE TYPE float8_range AS RANGE (subtype = float8, subtype_diff = float8mi);
```

ဒီ ဥပမာက base data type `box` တစ်ခုကို ဖန်တီးပြီး — အဲဒီ type ကို table definition တစ်ခုထဲမှာ သုံးပြထားပါတယ်:

```sql
CREATE TYPE box;

CREATE FUNCTION my_box_in_function(cstring) RETURNS box AS ... ;
CREATE FUNCTION my_box_out_function(box) RETURNS cstring AS ... ;

CREATE TYPE box (
    INTERNALLENGTH = 16,
    INPUT = my_box_in_function,
    OUTPUT = my_box_out_function
);

CREATE TABLE myboxes (
    id integer,
    description box
);
```

`box` ရဲ့ အတွင်းပိုင်း တည်ဆောက်ပုံက `float4` element လေးခုရဲ့ array တစ်ခု ဖြစ်နေမယ်ဆိုရင် — ဒီအစား အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```sql
CREATE TYPE box (
    INTERNALLENGTH = 16,
    INPUT = my_box_in_function,
    OUTPUT = my_box_out_function,
    ELEMENT = float4
);
```

အဲဒါက — box တန်ဖိုးတစ်ခုရဲ့ component ဂဏန်းတွေကို subscripting နဲ့ ဝင်ရောက်လို့ ရစေပါလိမ့်မယ်။ တခြားနည်းနဲ့ကတော့ — type က အရင်ကလိုပဲ ပြုမူပါတယ်။

ဒီ ဥပမာက large object type တစ်ခုကို ဖန်တီးပြီး — table definition တစ်ခုထဲမှာ သုံးပြထားပါတယ်:

```sql
CREATE TYPE bigobj (
    INPUT = lo_filein, OUTPUT = lo_fileout,
    INTERNALLENGTH = VARIABLE
);
CREATE TABLE big_objs (
    id integer,
    obj bigobj
);
```

သင့်လျော်တဲ့ input နဲ့ output functions တွေ အပါအဝင် — နောက်ထပ် ဥပမာတွေကို [အပိုင်း 36.13](https://www.postgresql.org/docs/current/xtypes.html) မှာ ဖော်ပြထားပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE TYPE` command ရဲ့ — composite type တစ်ခုကို ဖန်တီးပေးတဲ့ — ပထမ ပုံစံက SQL standard နဲ့ ကိုက်ညီပါတယ်။ တခြား ပုံစံတွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။ SQL standard ထဲက `CREATE TYPE` statement က — PostgreSQL မှာ implement (အကောင်အထည်ဖော်) မထားတဲ့ — တခြား ပုံစံတွေကိုလည်း သတ်မှတ်ပေးပါသေးတယ်။

Attribute သုညခု ပါတဲ့ composite type တစ်ခုကို ဖန်တီးနိုင်တာက — standard ကနေ သွေဖည်နေတဲ့ PostgreSQL-specific deviation (PostgreSQL အတွက်သာ သီးသန့် သွေဖည်မှု) တစ်ခု ဖြစ်ပါတယ် (`CREATE TABLE` မှာ အလားတူ ကိစ္စနဲ့ ဆင်တူပါတယ်)။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TYPE](/docs/postgresql/sql-altertype), [CREATE DOMAIN](/docs/postgresql/sql-createdomain), [CREATE FUNCTION](/docs/postgresql/sql-createfunction), [DROP TYPE](/docs/postgresql/sql-droptype)
