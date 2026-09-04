---
title: "CREATE DOMAIN (domain အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Domain အသစ်တစ်ခုကို သတ်မှတ်ပေးသည့် command — underlying data type ပေါ်တွင် optional constraints (NOT NULL, CHECK) များ၊ COLLATE နှင့် DEFAULT expression များ ထည့်သွင်း သတ်မှတ်နိုင်သည်; domain constraints များ၏ စစ်ဆေးပုံနှင့် null တန်ဖိုးများ ကိုင်တွယ်ပုံ အသေးစိတ်"
order: 236
source: "https://www.postgresql.org/docs/current/sql-createdomain.html"
status: translated
updated: 2026-09-04
---

## CREATE DOMAIN (domain အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE DOMAIN — domain အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE DOMAIN name [ AS ] data_type
    [ COLLATE collation ]
    [ DEFAULT expression ]
    [ domain_constraint [ ... ] ]

where domain_constraint is:

[ CONSTRAINT constraint_name ]
{ NOT NULL | NULL | CHECK (expression) }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE DOMAIN` က domain အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Domain ဆိုတာ — ခွင့်ပြုထားတဲ့ တန်ဖိုးအစုအပေါ် ကန့်သတ်ချက်တွေ ဖြစ်တဲ့ optional constraints (ထည့်သွင်းနိုင်သော ကန့်သတ်ချက်များ) ပါဝင်တဲ့ data type (ဒေတာ အမျိုးအစား) တစ်မျိုး အခြေခံအားဖြင့် ဖြစ်ပါတယ်။ Domain တစ်ခုကို သတ်မှတ်တဲ့ user က ၎င်းရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

Schema နာမည် ပေးထားရင် (ဥပမာ — `CREATE DOMAIN myschema.mydomain ...`) — domain ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မဟုတ်ရင် — current schema ထဲမှာ ဖန်တီးပါတယ်။ Domain နာမည်က — ၎င်းရဲ့ schema ထဲမှာ ရှိနေတဲ့ types နဲ့ domains တွေကြားမှာ ထူးခြား (unique) ဖြစ်ရပါမယ်။

Domains တွေက — fields (column နယ်ပယ်များ) တွေပေါ်မှာ အသုံးများတဲ့ constraints တွေကို — ထိန်းသိမ်းမှု (maintenance) လုပ်ရလွယ်ကူဖို့ နေရာတစ်ခုတည်းဆီ စုစည်းနိုင်လို့ အသုံးဝင်ပါတယ်။ ဥပမာ — table အများအပြားမှာ email address columns တွေ ပါဝင်နိုင်ပြီး — အားလုံးက address ရဲ့ syntax ကို စစ်ဆေးဖို့ CHECK constraint တစ်ခုတည်း လိုအပ်ပါတယ်။ Table တစ်ခုချင်းစီမှာ constraint ကို သပ်သပ်စီ သတ်မှတ်နေမယ့်အစား — domain တစ်ခုကို သတ်မှတ်လိုက်ပါ။

Domain တစ်ခု ဖန်တီးနိုင်ဖို့ — underlying type (အခြေခံ type) ပေါ်မှာ `USAGE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် domain တစ်ခုရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **data_type** — Domain ရဲ့ underlying data type (အခြေခံ data type)။ ဒီထဲမှာ array specifiers (array သတ်မှတ်ကိန်းများ) တွေ ပါဝင်နိုင်ပါတယ်။
- **collation** — Domain အတွက် optional collation (စဉ်စီနှိုင်းယှဉ်မှု စနစ်) တစ်ခု။ Collation မသတ်မှတ်ထားဘူးဆိုရင် — domain က ၎င်းရဲ့ underlying data type ရဲ့ collation အပြုအမူအတိုင်း ဖြစ်ပါတယ်။ `COLLATE` ကို သတ်မှတ်ထားရင် — underlying type က collatable (collation သုံးနိုင်သော) ဖြစ်ရပါမယ်။
- **DEFAULT expression** — `DEFAULT` clause က domain data type ရဲ့ columns တွေအတွက် default value (ပုံသေ တန်ဖိုး) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ အဲဒီ တန်ဖိုးက variable-free (variable မပါတဲ့) expression တစ်ခု ဖြစ်ရပါတယ် (ဒါပေမယ့် subqueries တွေ ခွင့်မပြုပါဘူး)။ Default expression ရဲ့ data type က domain ရဲ့ data type နဲ့ ကိုက်ညီရပါမယ်။ Default value မသတ်မှတ်ထားဘူးဆိုရင် — default value က null value ဖြစ်ပါတယ်။

  Default expression ကို — column အတွက် တန်ဖိုး မသတ်မှတ်တဲ့ — insert operation တိုင်းမှာ သုံးပါလိမ့်မယ်။ Column တစ်ခုအတွက် default value တစ်ခု သတ်မှတ်ထားရင် — အဲဒါက domain နဲ့ ဆက်စပ်နေတဲ့ default ကို ကျော်လွန် (override) လုပ်ပါတယ်။ နောက်ပြန်အနေနဲ့ — domain ရဲ့ default က — underlying data type နဲ့ ဆက်စပ်နေတဲ့ default value ကို ကျော်လွန် လုပ်ပါတယ်။

- **CONSTRAINT constraint_name** — Constraint တစ်ခုအတွက် optional နာမည်တစ်ခု။ မသတ်မှတ်ထားဘူးဆိုရင် — system က နာမည်တစ်ခု ထုတ်ပေးပါတယ်။
- **NOT NULL** — ဒီ domain ရဲ့ တန်ဖိုးတွေကို null မဖြစ်စေရန် တားဆီးပါတယ် (ဒါပေမယ့် အောက်က Notes ကို ကြည့်ပါ)။
- **NULL** — ဒီ domain ရဲ့ တန်ဖိုးတွေက null ဖြစ်ခွင့် ပြုပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

  ဒီ clause ကို nonstandard SQL databases တွေနဲ့ လိုက်ဖက်ညီမှု ရှိစေဖို့အတွက်သာ ရည်ရွယ်ပါတယ်။ Application အသစ်တွေမှာ ဒါကို သုံးတာကို အားမပေးပါဘူး။

- **CHECK (expression)** — `CHECK` clauses တွေက domain ရဲ့ တန်ဖိုးတွေ ကျေနပ်စေရမယ့် — integrity constraints (တည်မြဲမှု ကန့်သတ်ချက်များ) ဒါမှမဟုတ် စစ်ဆေးမှုများကို သတ်မှတ်ပေးပါတယ်။ Constraint တစ်ခုချင်းစီက Boolean ရလဒ် ထုတ်ပေးတဲ့ expression တစ်ခု ဖြစ်ရပါမယ်။ စစ်ဆေးနေတဲ့ တန်ဖိုးကို ရည်ညွှန်းဖို့ key word (သော့ချက် စကားလုံး) `VALUE` ကို သုံးသင့်ပါတယ်။ `TRUE` ဒါမှမဟုတ် `UNKNOWN` လို့ အကဲဖြတ်လို့ ရတဲ့ expressions တွေက အောင်မြင်ပါတယ်။ Expression က `FALSE` ရလဒ် ထုတ်ပေးခဲ့ရင် — error တစ်ခု အစီရင်ခံပြီး — အဲဒီ တန်ဖိုးကို domain type အဖြစ် ပြောင်းလဲဖို့ ခွင့်မပြုပါဘူး။

  လောလောဆယ် — `CHECK` expressions တွေထဲမှာ subqueries တွေ ပါဝင်လို့ မရသလို — `VALUE` ကလွဲလို့ တခြား variables တွေကိုလည်း ရည်ညွှန်းလို့ မရပါဘူး။

  Domain တစ်ခုမှာ `CHECK` constraints အများအပြား ရှိနေရင် — သူတို့ကို နာမည် အက္ခရာစဉ် (alphabetical order) အတိုင်း စမ်းသပ်ပါလိမ့်မယ်။ (PostgreSQL version 9.5 မတိုင်ခင်က — `CHECK` constraints တွေအတွက် တိကျတဲ့ firing order (စစ်ဆေးသည့် အစဉ်) တစ်ခုကို လေးစားမှု မရှိခဲ့ပါဘူး။)

## Notes (မှတ်စုများ)

Domain constraints တွေ — အထူးသဖြင့် `NOT NULL` — ကို တန်ဖိုးတစ်ခုကို domain type အဖြစ် ပြောင်းလဲတဲ့အခါ စစ်ဆေးပါတယ်။ အမည်ခံအားဖြင့် (nominally) domain type ဖြစ်တဲ့ column တစ်ခုက — ဒီလို constraint တစ်ခု ရှိနေပေမယ့် — null အဖြစ် ဖတ်လို့ ရနိုင်ပါတယ်။ ဥပမာ — outer-join query တစ်ခုမှာ — domain column က outer join ရဲ့ nullable side (null ဖြစ်နိုင်သည့် ဘက်) မှာ ရှိနေရင် ဒီလို ဖြစ်ပွားနိုင်ပါတယ်။ ပိုပြီး သိမ်မွေ့တဲ့ ဥပမာတစ်ခုကတော့:

```sql
INSERT INTO tab (domcol) VALUES ((SELECT domcol FROM tab WHERE false));
```

အလွတ် (empty) scalar sub-SELECT က — domain type ရဲ့ တန်ဖိုးလို့ ယူဆရတဲ့ null value တစ်ခုကို ထုတ်ပေးလို့ — နောက်ထပ် constraint စစ်ဆေးမှုတွေကို သူ့အပေါ်မှာ မလုပ်တော့ဘဲ — insertion က အောင်မြင်သွားပါလိမ့်မယ်။

null value တစ်ခုက data type တိုင်းရဲ့ တရားဝင် (valid) တန်ဖိုးတစ်ခု ဖြစ်တယ်ဆိုတဲ့ SQL ရဲ့ ယေဘုယျ ယူဆချက်ကြောင့် — ဒီလို ပြဿနာတွေကို ရှောင်ရှားဖို့က အရမ်း ခက်ခဲပါတယ်။ ဒါကြောင့် — အကောင်းဆုံး လေ့ကျင့်မှု (best practice) ကတော့ — domain တစ်ခုရဲ့ constraints တွေကို null value ခွင့်ပြုတဲ့ပုံစံမျိုး ဒီဇိုင်းဆွဲထားပြီး — domain type ပေါ်မှာ တိုက်ရိုက် သက်ရောက်စေမယ့်အစား — လိုအပ်သလို — domain type ရဲ့ columns တွေပေါ်မှာ column `NOT NULL` constraints တွေကို သက်ရောက်စေတာ ဖြစ်ပါတယ်။

PostgreSQL က `CHECK` constraints တွေရဲ့ conditions တွေက immutable (မပြောင်းလဲနိုင်သော) ဖြစ်တယ်လို့ ယူဆပါတယ် — ဆိုလိုတာက — input တန်ဖိုး တူညီနေရင် ရလဒ် တူညီတာကို အမြဲတမ်း ပေးမယ်လို့ ဆိုလိုပါတယ်။ ဒီ ယူဆချက်က — `CHECK` constraints တွေကို တန်ဖိုးတစ်ခုကို domain type အဖြစ် ပထမဆုံး ပြောင်းလဲတဲ့အခါမှာပဲ စစ်ဆေးပြီး — တခြား အချိန်တွေမှာ မစစ်ဆေးတာကို — တရားမျှတစေပါတယ်။ (ဒါက — [အပိုင်း 5.5.1](/docs/postgresql/ddl-constraints) မှာ ဖော်ပြထားတဲ့အတိုင်း — table `CHECK` constraints တွေကို ကိုင်တွယ်ပုံနဲ့ အခြေခံအားဖြင့် အတူတူပါပဲ။)

ဒီ ယူဆချက်ကို ချိုးဖောက်လေ့ရှိတဲ့ နည်းလမ်းတစ်ခုက — `CHECK` expression တစ်ခုထဲမှာ user-defined function (အသုံးပြုသူ သတ်မှတ်သည့် function) တစ်ခုကို ရည်ညွှန်းပြီး — နောက်ပိုင်းမှာ အဲဒီ function ရဲ့ အပြုအမူကို ပြောင်းလဲလိုက်တာမျိုး ဖြစ်ပါတယ်။ PostgreSQL က ဒါကို တားမြစ်မထားပါဘူး — ဒါပေမယ့် — အခု `CHECK` constraint ကို ချိုးဖောက်နေတဲ့ domain type ရဲ့ သိမ်းဆည်းထားတဲ့ တန်ဖိုးတွေ ရှိနေရင် — PostgreSQL က သတိထားမိမှာ မဟုတ်ပါဘူး။ ဒါက နောက်ပိုင်း database dump နဲ့ restore တစ်ခုကို မအောင်မြင်စေနိုင်ပါတယ်။ ဒီလို ပြောင်းလဲမှုမျိုးကို ကိုင်တွယ်ဖို့ အကြံပြုထားတဲ့ နည်းလမ်းက — constraint ကို drop လုပ်ပြီး (`ALTER DOMAIN` ကို သုံးပြီး) — function definition ကို ချိန်ညှိပြီး — constraint ကို ပြန်ပေါင်းတာပါ — ဒီနည်းနဲ့ — သိမ်းထားတဲ့ data တွေကို ပြန်လည် စစ်ဆေးစေပါလိမ့်မယ်။

Domain `CHECK` expressions တွေ error ပစ်မချစေဖို့လည်း သေချာအောင် လုပ်ထားတာက ကောင်းမွန်တဲ့ လေ့ကျင့်မှုတစ်ခု ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

ဒီ ဥပမာက `us_postal_code` ဆိုတဲ့ data type ကို ဖန်တီးပြီး — နောက်ပိုင်းမှာ အဲဒီ type ကို table definition တစ်ခုထဲမှာ သုံးပါတယ်။ Regular expression test (ပုံမှန် expression စမ်းသပ်မှု) တစ်ခုကို — တန်ဖိုးက တရားဝင် US postal code (စာတိုက် သင်္ကေတ နံပါတ်) တစ်ခု ပုံစံကျကျ ဟုတ်မဟုတ် စစ်ဆေးဖို့ သုံးပါတယ်:

```sql
CREATE DOMAIN us_postal_code AS TEXT
CHECK(
   VALUE ~ '^\d{5}$'
OR VALUE ~ '^\d{5}-\d{4}$'
);

CREATE TABLE us_snail_addy (
  address_id SERIAL PRIMARY KEY,
  street1 TEXT NOT NULL,
  street2 TEXT,
  street3 TEXT,
  city TEXT NOT NULL,
  postal us_postal_code NOT NULL
);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE DOMAIN` command က SQL standard နဲ့ ကိုက်ညီပါတယ်။

ဒီ command ထဲက `NOT NULL` syntax က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ (Standard နဲ့ ကိုက်ညီတဲ့ နည်းနဲ့ non-composite data types တွေအတွက် အလားတူ အရာကို ရေးရမယ်ဆိုရင် — `CHECK (VALUE IS NOT NULL)` လို့ ရေးရပါမယ်။ ဒါပေမယ့် — [“Notes” လို့ ခေါ်တဲ့ section](/docs/postgresql/sql-createdomain) မှာ ဖော်ပြထားသလို — ဒီလို constraints မျိုးတွေကို လက်တွေ့မှာ ရှောင်ကြဉ်တာက ပိုကောင်းပါတယ်။) `NULL` “constraint” က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ် (ထို့ပြင် — [Compatibility](/docs/postgresql/sql-createtable) ကိုလည်း ကြည့်ပါ)။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER DOMAIN](/docs/postgresql/sql-alterdomain), [DROP DOMAIN](/docs/postgresql/sql-dropdomain)
