---
title: "ALTER TYPE (type တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား type တစ်ခု၏ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးသည့် command — owner/နာမည်/schema ပြောင်းခြင်း၊ composite type များ၏ attribute ထပ်ပေါင်း/ဖျက်/ပြောင်းခြင်း၊ enum type ၏ တန်ဖိုးများ ထပ်ပေါင်းခြင်း (ADD VALUE) နှင့် နာမည်ပြောင်းခြင်း (RENAME VALUE)၊ base type ၏ property (RECEIVE, SEND, TYPMOD_IN, TYPMOD_OUT, ANALYZE, SUBSCRIPT, STORAGE) များ ပြောင်းလဲခြင်း စသည့် ပုံစံကွဲများ ပါဝင်သည်"
order: 234
source: "https://www.postgresql.org/docs/current/sql-altertype.html"
status: translated
updated: 2026-09-04
---

## ALTER TYPE (type တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)

ALTER TYPE — type တစ်ခုရဲ့ definition (သတ်မှတ်ချက်) ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TYPE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER TYPE name RENAME TO new_name
ALTER TYPE name SET SCHEMA new_schema
ALTER TYPE name RENAME ATTRIBUTE attribute_name TO new_attribute_name [ CASCADE | RESTRICT ]
ALTER TYPE name action [, ... ]
ALTER TYPE name ADD VALUE [ IF NOT EXISTS ] new_enum_value [ { BEFORE | AFTER } neighbor_enum_value ]
ALTER TYPE name RENAME VALUE existing_enum_value TO new_enum_value
ALTER TYPE name SET ( property = value [, ... ] )

where action is one of:

    ADD ATTRIBUTE attribute_name data_type [ COLLATE collation ] [ CASCADE | RESTRICT ]
    DROP ATTRIBUTE [ IF EXISTS ] attribute_name [ CASCADE | RESTRICT ]
    ALTER ATTRIBUTE attribute_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER TYPE` က — ရှိပြီးသား type တစ်ခုရဲ့ definition (သတ်မှတ်ချက်) ကို ပြောင်းလဲပေးပါတယ်။ ပုံစံကွဲ (subform) တွေ အများအပြား ရှိပါတယ်:

- **OWNER** — ဒီ ပုံစံက type ရဲ့ owner (ပိုင်ရှင်) ကို ပြောင်းလဲပေးပါတယ်။
- **RENAME** — ဒီ ပုံစံက type ရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။
- **SET SCHEMA** — ဒီ ပုံစံက type ကို တခြား schema တစ်ခုဆီ ရွှေ့ပေးပါတယ်။
- **RENAME ATTRIBUTE** — ဒီ ပုံစံကို composite types (ပေါင်းစပ် type များ) တွေမှာပဲ သုံးလို့ ရပါတယ်။ Type ရဲ့ attribute (ဝိသေသလက္ခဏာ) တစ်ခုချင်းစီရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။
- **ADD ATTRIBUTE** — ဒီ ပုံစံက `CREATE TYPE` နဲ့ syntax တူညီတဲ့ ပုံစံအတိုင်း — composite type တစ်ခုဆီ attribute အသစ်တစ်ခု ထပ်ပေါင်းပေးပါတယ်။
- **DROP ATTRIBUTE [ IF EXISTS ]** — ဒီ ပုံစံက composite type တစ်ခုကနေ attribute တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ `IF EXISTS` ကို သတ်မှတ်ထားပြီး attribute မရှိဘူးဆိုရင် — error ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေးမှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **ALTER ATTRIBUTE ... SET DATA TYPE** — ဒီ ပုံစံက composite type တစ်ခုရဲ့ attribute တစ်ခုရဲ့ type ကို ပြောင်းလဲပေးပါတယ်။
- **ADD VALUE [ IF NOT EXISTS ] [ BEFORE | AFTER ]** — ဒီ ပုံစံက enum type တစ်ခုဆီ တန်ဖိုး (value) အသစ်တစ်ခု ထပ်ပေါင်းပေးပါတယ်။ တန်ဖိုးအသစ်ရဲ့ enum ရဲ့ စီစဉ်မှု (ordering) ထဲမှာ နေရာကို — ရှိပြီးသား တန်ဖိုးတစ်ခုရဲ့ `BEFORE` ဒါမှမဟုတ် `AFTER` အနေနဲ့ — သတ်မှတ်နိုင်ပါတယ်။ မဟုတ်ရင် — item အသစ်ကို တန်ဖိုးတွေရဲ့ စာရင်းရဲ့ အဆုံးမှာ ထပ်ပေါင်းပါတယ်။

  `IF NOT EXISTS` ကို သတ်မှတ်ထားရင် — type ထဲမှာ တန်ဖိုးအသစ် ရှိပြီးသား ဖြစ်နေတာက error မဟုတ်ပါဘူး: notice တစ်ခု ထုတ်ပေးပြီး — တခြား ဘာ action မှ မလုပ်ပါဘူး။ မဟုတ်ရင် — တန်ဖိုးအသစ် ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

- **RENAME VALUE** — ဒီ ပုံစံက enum type တစ်ခုရဲ့ တန်ဖိုးတစ်ခုကို နာမည် ပြောင်းပေးပါတယ်။ တန်ဖိုးရဲ့ enum စီစဉ်မှုထဲမှာ နေရာကိုတော့ သက်ရောက်မှု မရှိပါဘူး။ သတ်မှတ်ထားတဲ့ တန်ဖိုး မရှိဘူးဆိုရင် ဒါမှမဟုတ် — နာမည်အသစ် ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။
- **SET ( property = value [, ... ] )** — ဒီ ပုံစံက base types (အခြေခံ type များ) တွေမှာပဲ သက်ရောက်ပါတယ်။ `CREATE TYPE` မှာ သတ်မှတ်လို့ရတဲ့ base-type properties တွေထဲက အစိတ်အပိုင်း (subset) တစ်ခုကို ချိန်ညှိခွင့် ပေးပါတယ်။ အထူးသဖြင့် — ဒီ properties တွေကို ပြောင်းလဲလို့ ရပါတယ်:

  `RECEIVE` ကို binary input function (binary ပုံစံဖြင့် ထည့်သွင်းသည့် function) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် — type ရဲ့ binary input function ကို ဖယ်ရှားဖို့ — `NONE` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို သုံးတာက superuser privilege (စူပါအသုံးပြုသူ အခွင့်အရေး) လိုအပ်ပါတယ်။

  `SEND` ကို binary output function (binary ပုံစံဖြင့် ထုတ်ယူသည့် function) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် — type ရဲ့ binary output function ကို ဖယ်ရှားဖို့ — `NONE` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို သုံးတာက superuser privilege လိုအပ်ပါတယ်။

  `TYPMOD_IN` ကို type modifier input function (type modifier ထည့်သွင်းသည့် function) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် — type ရဲ့ type modifier input function ကို ဖယ်ရှားဖို့ — `NONE` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို သုံးတာက superuser privilege လိုအပ်ပါတယ်။

  `TYPMOD_OUT` ကို type modifier output function (type modifier ထုတ်ယူသည့် function) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် — type ရဲ့ type modifier output function ကို ဖယ်ရှားဖို့ — `NONE` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို သုံးတာက superuser privilege လိုအပ်ပါတယ်။

  `ANALYZE` ကို type-specific statistics collection function (type အလိုက် သီးသန့် စာရင်းအင်း စုဆောင်းသည့် function) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် — type ရဲ့ statistics collection function ကို ဖယ်ရှားဖို့ — `NONE` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို သုံးတာက superuser privilege လိုအပ်ပါတယ်။

  `SUBSCRIPT` ကို type-specific subscripting handler function (type အလိုက် subscripting ကိုင်တွယ်သည့် function) တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် — type ရဲ့ subscripting handler function ကို ဖယ်ရှားဖို့ — `NONE` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ option ကို သုံးတာက superuser privilege လိုအပ်ပါတယ်။

  `STORAGE` ကို plain, extended, external ဒါမှမဟုတ် main လို့ သတ်မှတ်နိုင်ပါတယ် (ဒီတန်ဖိုးတွေ ဘာကို ဆိုလိုလဲဆိုတာအကြောင်း ပိုမို သိရှိရန် အပိုင်း 66.2 ကို ကြည့်ပါ)။ ဒါပေမယ့် — plain ကနေ တခြား setting တစ်ခုဆီ ပြောင်းတာက superuser privilege လိုအပ်ပါတယ် (type ရဲ့ C functions တွေ အားလုံး TOAST-ready ဖြစ်နေဖို့ လိုအပ်လို့ပါ) — ပြီးတော့ — တခြား setting တစ်ခုကနေ plain ဆီ ပြောင်းတာကိုတော့ လုံးဝ ခွင့်မပြုပါဘူး (type မှာ TOASTed values တွေ database ထဲမှာ ရှိပြီးသား ဖြစ်နေနိုင်လို့ပါ)။ ဒီ option ကို ပြောင်းလဲတာက — သိမ်းဆည်းထားပြီးသား data တွေကို သူ့ဘာသာသူ ပြောင်းလဲမပေးဘူးဆိုတာ သတိပြုပါ; အဲဒါက — အနာဂတ်မှာ ဖန်တီးမယ့် table columns တွေအတွက် သုံးရမယ့် default TOAST strategy (နည်းဗျူဟာ) ကိုပဲ သတ်မှတ်ပေးတာပါ။ ရှိပြီးသား table columns တွေရဲ့ TOAST strategy ကို ပြောင်းလဲဖို့ကတော့ `ALTER TABLE` ကို ကြည့်ပါ။

  ဒီ type properties တွေအကြောင်း အသေးစိတ် ပိုမို သိရှိရန် `CREATE TYPE` ကို ကြည့်ပါ။ သင့်လျော်တဲ့ နေရာတွေမှာ — base type တစ်ခုအတွက် ဒီ properties တွေရဲ့ ပြောင်းလဲမှုက — အဲဒီ type ပေါ်မှာ အခြေခံထားတဲ့ domains တွေဆီ အလိုအလျောက် ပျံ့နှံ့ (propagate) သွားမယ်ဆိုတာ သတိပြုပါ။

`ADD ATTRIBUTE`, `DROP ATTRIBUTE` နဲ့ `ALTER ATTRIBUTE` actions တွေကို — တစ်ပြိုင်နက် (in parallel) လုပ်ဆောင်ဖို့ — ပြောင်းလဲမှု အများအပြားပါတဲ့ စာရင်းတစ်ခုအဖြစ် ပေါင်းစပ်နိုင်ပါတယ်။ ဥပမာ — attribute အများအပြား ထပ်ပေါင်းတာ ဒါမှမဟုတ် — attribute အများအပြားရဲ့ types တွေကို ပြောင်းတာမျိုးကို command တစ်ခုတည်းနဲ့ လုပ်နိုင်ပါတယ်။

`ALTER TYPE` ကို သုံးနိုင်ဖို့ type ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Type တစ်ခုရဲ့ schema ကို ပြောင်းဖို့ — schema အသစ်ပေါ်မှာလည်း `CREATE` privilege ရှိရပါမယ်။ Owner ကို ပြောင်းဖို့ — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role က type ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက type ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် သင်မလုပ်နိုင်တဲ့ ဘာ action မှ မလုပ်နိုင်ဘူးဆိုတာကို အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser ကတော့ ဘယ် type ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။) Attribute တစ်ခု ထပ်ပေါင်းဖို့ ဒါမှမဟုတ် attribute type တစ်ခု ပြောင်းဖို့ — attribute ရဲ့ data type ပေါ်မှာလည်း `USAGE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် ရှိပြီးသား type တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **new_name** — Type အတွက် နာမည်အသစ်။
- **new_owner** — Type ရဲ့ owner အသစ်ရဲ့ user နာမည်။
- **new_schema** — Type အတွက် schema အသစ်။
- **attribute_name** — ထပ်ပေါင်း၊ ပြောင်းလဲ ဒါမှမဟုတ် ဖယ်ရှားရမယ့် attribute ရဲ့ နာမည်။
- **new_attribute_name** — နာမည် ပြောင်းလဲရမယ့် attribute ရဲ့ နာမည်အသစ်။
- **data_type** — ထပ်ပေါင်းရမယ့် attribute ရဲ့ data type (ဒေတာ အမျိုးအစား)၊ ဒါမှမဟုတ် ပြောင်းလဲရမယ့် attribute ရဲ့ type အသစ်။
- **new_enum_value** — Enum type တစ်ခုရဲ့ တန်ဖိုးစာရင်းထဲကို ထပ်ပေါင်းရမယ့် တန်ဖိုးအသစ်၊ ဒါမှမဟုတ် ရှိပြီးသား တန်ဖိုးတစ်ခုကို ပေးရမယ့် နာမည်အသစ်။ Enum literals (enum တန်ဖိုး စာသားများ) တွေ အားလုံးလိုပဲ — ဒါကို quote သွင်းပေးရပါမယ်။
- **neighbor_enum_value** — Enum type ရဲ့ sort ordering (စဉ်စီသည့် အစီအစဉ်) ထဲမှာ — တန်ဖိုးအသစ်ကို ၎င်းရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ ချက်ချင်း ထည့်သွင်းသင့်တဲ့ — ရှိပြီးသား enum တန်ဖိုး။ Enum literals တွေ အားလုံးလိုပဲ — ဒါကို quote သွင်းပေးရပါမယ်။
- **existing_enum_value** — နာမည် ပြောင်းလဲသင့်တဲ့ ရှိပြီးသား enum တန်ဖိုး။ Enum literals တွေ အားလုံးလိုပဲ — ဒါကို quote သွင်းပေးရပါမယ်။
- **property** — ပြုပြင်မွမ်းမံရမယ့် base-type property တစ်ခုရဲ့ နာမည်; ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေအတွက် အထက်မှာ ကြည့်ပါ။
- **CASCADE** — ပြောင်းလဲနေတဲ့ type ရဲ့ typed tables (type ကို အခြေခံထားသော tables) နဲ့ သူတို့ရဲ့ descendants (ဆင်းသက်လာသော tables) တွေဆီ operation ကို အလိုအလျောက် ပျံ့နှံ့စေပါတယ်။
- **RESTRICT** — ပြောင်းလဲနေတဲ့ type က typed table တစ်ခုရဲ့ type ဖြစ်နေရင် operation ကို ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`ALTER TYPE ... ADD VALUE` (enum type တစ်ခုဆီ တန်ဖိုးအသစ် ထပ်ပေါင်းပေးတဲ့ ပုံစံ) ကို transaction block တစ်ခုအတွင်းမှာ execute လုပ်ရင် — transaction ကို commit လုပ်ပြီးတဲ့ နောက်မှသာ — တန်ဖိုးအသစ်ကို သုံးလို့ ရပါတယ်။

Enum type တစ်ခုဆီ ထပ်ပေါင်းလိုက်တဲ့ တန်ဖိုးတစ်ခု ပါဝင်တဲ့ နှိုင်းယှဉ်မှုတွေက — enum type ရဲ့ မူလ အဖွဲ့ဝင် (original member) တွေပဲ ပါဝင်တဲ့ နှိုင်းယှဉ်မှုတွေထက် — တစ်ခါတစ်ရံ ပိုနှေးကွေးနိုင်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် — `BEFORE` ဒါမှမဟုတ် `AFTER` ကို သုံးပြီး — တန်ဖိုးအသစ်ရဲ့ sort position ကို စာရင်းရဲ့ အဆုံးကလွဲလို့ တခြား နေရာတစ်ခုမှာ သတ်မှတ်ထားတဲ့အခါမျိုးမှာပဲ ဖြစ်ပေါ်တတ်ပါတယ်။ ဒါပေမယ့် — တန်ဖိုးအသစ်ကို အဆုံးမှာ ထပ်ပေါင်းထားရင်တောင် — တစ်ခါတစ်ရံ ဖြစ်ပွားနိုင်ပါသေးတယ် (enum type ကို မူလ ဖန်တီးကတည်းက OID counter က “wrapped around” (ပတ်ပတ်လည် ပြန်ရောက်ခဲ့) ရင် ဒီလို ဖြစ်တတ်ပါတယ်)။ ဒီ နှေးကွေးမှုက ပုံမှန်အားဖြင့် ထင်ရှားလောက်စရာ မရှိပါဘူး; ဒါပေမယ့် — အရေးပါတယ်ဆိုရင်တော့ — enum type ကို drop ပြီး ပြန်ဖန်တီးခြင်း ဒါမှမဟုတ် — database ကို dump ပြီး restore လုပ်ခြင်းအားဖြင့် — အကောင်းဆုံး စွမ်းဆောင်ရည်ကို ပြန်လည် ရရှိနိုင်ပါတယ်။

## Examples (ဥပမာများ)

Data type တစ်ခုကို နာမည် ပြောင်းလဲဖို့:

```sql
ALTER TYPE electronic_mail RENAME TO email;
```

`email` type ရဲ့ owner ကို `joe` ဆီ ပြောင်းလဲဖို့:

```sql
ALTER TYPE email OWNER TO joe;
```

`email` type ရဲ့ schema ကို `customers` ဆီ ပြောင်းလဲဖို့:

```sql
ALTER TYPE email SET SCHEMA customers;
```

Composite type တစ်ခုဆီ attribute အသစ်တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TYPE compfoo ADD ATTRIBUTE f3 int;
```

Enum type တစ်ခုဆီ တိကျတဲ့ sort position တစ်ခုမှာ တန်ဖိုးအသစ်တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER TYPE colors ADD VALUE 'orange' AFTER 'red';
```

Enum တန်ဖိုးတစ်ခုကို နာမည် ပြောင်းလဲဖို့:

```sql
ALTER TYPE colors RENAME VALUE 'purple' TO 'mauve';
```

ရှိပြီးသား base type တစ်ခုအတွက် binary I/O functions တွေ ဖန်တီးဖို့:

```sql
CREATE FUNCTION mytypesend(mytype) RETURNS bytea ...;
CREATE FUNCTION mytyperecv(internal, oid, integer) RETURNS mytype ...;
ALTER TYPE mytype SET (
    SEND = mytypesend,
    RECEIVE = mytyperecv
);
```

## Compatibility (လိုက်ဖက်ညီမှု)

Attributes တွေကို ထပ်ပေါင်းပြီး ဖယ်ရှားတဲ့ ပုံစံကွဲတွေက SQL standard ရဲ့ အစိတ်အပိုင်း ဖြစ်ပြီး — ကျန် ပုံစံကွဲတွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TYPE](/docs/postgresql/sql-createtype), [DROP TYPE](/docs/postgresql/sql-droptype)
