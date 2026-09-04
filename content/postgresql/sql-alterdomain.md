---
title: "ALTER DOMAIN (domain တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား domain တစ်ခု၏ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးသည့် command — default value သတ်မှတ်/ဖယ်ရှားခြင်း၊ NOT NULL သတ်မှတ်/ဖယ်ရှားခြင်း၊ constraint ထပ်ပေါင်းခြင်း (NOT VALID အပါအဝင်) နှင့် ဖျက်ခြင်း၊ constraint နာမည် ပြောင်းခြင်း၊ VALIDATE CONSTRAINT၊ owner/နာမည်/schema ပြောင်းခြင်း စသည့် ပုံစံကွဲများ ပါဝင်သည်"
order: 237
source: "https://www.postgresql.org/docs/current/sql-alterdomain.html"
status: translated
updated: 2026-09-04
---

## ALTER DOMAIN (domain တစ်ခုရဲ့ သတ်မှတ်ချက် ပြောင်းလဲခြင်း)

ALTER DOMAIN — domain တစ်ခုရဲ့ definition (သတ်မှတ်ချက်) ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER DOMAIN name
    { SET DEFAULT expression | DROP DEFAULT }
ALTER DOMAIN name
    { SET | DROP } NOT NULL
ALTER DOMAIN name
    ADD domain_constraint [ NOT VALID ]
ALTER DOMAIN name
    DROP CONSTRAINT [ IF EXISTS ] constraint_name [ RESTRICT | CASCADE ]
ALTER DOMAIN name
     RENAME CONSTRAINT constraint_name TO new_constraint_name
ALTER DOMAIN name
    VALIDATE CONSTRAINT constraint_name
ALTER DOMAIN name
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER DOMAIN name
    RENAME TO new_name
ALTER DOMAIN name
    SET SCHEMA new_schema

where domain_constraint is:

[ CONSTRAINT constraint_name ]
{ NOT NULL | CHECK (expression) }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER DOMAIN` က ရှိပြီးသား domain တစ်ခုရဲ့ definition (သတ်မှတ်ချက်) ကို ပြောင်းလဲပေးပါတယ်။ ပုံစံကွဲ (sub-form) တွေ အများအပြား ရှိပါတယ်:

- **SET/DROP DEFAULT** — ဒီ ပုံစံတွေက domain တစ်ခုအတွက် default value (ပုံသေ တန်ဖိုး) ကို သတ်မှတ်ခြင်း ဒါမှမဟုတ် ဖယ်ရှားခြင်း လုပ်ပေးပါတယ်။ Defaults တွေက နောက်ပိုင်း `INSERT` commands တွေကိုပဲ သက်ရောက်ပြီး — domain ကို သုံးထားတဲ့ table တစ်ခုထဲမှာ ရှိပြီးသား rows တွေကိုတော့ သက်ရောက်မှု မရှိဘူးဆိုတာ သတိပြုပါ။
- **SET/DROP NOT NULL** — ဒီ ပုံစံတွေက domain တစ်ခုကို NULL values တွေ ခွင့်ပြုတဲ့အနေနဲ့ အမှတ်အသား လုပ်မလား ဒါမှမဟုတ် NULL values တွေကို ငြင်းပယ်တဲ့အနေနဲ့ အမှတ်အသား လုပ်မလားဆိုတာ ပြောင်းလဲပေးပါတယ်။ Domain ကို သုံးနေတဲ့ columns တွေထဲမှာ null values တွေ မပါဝင်တဲ့အခါမှသာ `SET NOT NULL` ကို လုပ်လို့ ရပါတယ်။
- **ADD domain_constraint [ NOT VALID ]** — ဒီ ပုံစံက domain တစ်ခုဆီ constraint အသစ်တစ်ခု ထပ်ပေါင်းပေးပါတယ်။ Domain တစ်ခုဆီ constraint အသစ်တစ်ခု ထပ်ပေါင်းတဲ့အခါ — အဲဒီ domain ကို သုံးနေတဲ့ columns တွေ အားလုံးကို constraint အသစ်နဲ့ ဆန့်ကျင် စစ်ဆေးပါတယ်။ ဒီ စစ်ဆေးမှုတွေကို — constraint အသစ်ကို `NOT VALID` option နဲ့ ထပ်ပေါင်းခြင်းအားဖြင့် — ဖိနှိပ် (suppress) လုပ်လို့ ရပြီး — constraint ကို နောက်ပိုင်းမှာ `ALTER DOMAIN ... VALIDATE CONSTRAINT` ကို သုံးပြီး valid ဖြစ်အောင် လုပ်လို့ ရပါတယ်။ အသစ် insert လုပ်တဲ့ ဒါမှမဟုတ် update လုပ်တဲ့ rows တွေကို — `NOT VALID` အမှတ်အသား လုပ်ထားတာတွေတောင် အပါအဝင် — constraints တွေ အားလုံးနဲ့ အမြဲတမ်း စစ်ဆေးပါတယ်။ `NOT VALID` ကို `CHECK` constraints တွေအတွက်ပဲ လက်ခံပါတယ်။
- **DROP CONSTRAINT [ IF EXISTS ]** — ဒီ ပုံစံက domain တစ်ခုပေါ်က constraints တွေကို ဖယ်ရှားပေးပါတယ်။ `IF EXISTS` ကို သတ်မှတ်ထားပြီး constraint မရှိဘူးဆိုရင် — error ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေးမှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **RENAME CONSTRAINT** — ဒီ ပုံစံက domain တစ်ခုပေါ်က constraint တစ်ခုရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။
- **VALIDATE CONSTRAINT** — ဒီ ပုံစံက အရင်က `NOT VALID` အဖြစ် ထပ်ပေါင်းထားတဲ့ constraint တစ်ခုကို validate (တရားဝင်မှု စိစစ်) လုပ်ပေးပါတယ် — ဆိုလိုတာက — domain type ရဲ့ table columns တွေထဲက တန်ဖိုး အားလုံးက သတ်မှတ်ထားတဲ့ constraint ကို ကျေနပ်ပြည့်စုံစေကြောင်း စစ်ဆေးပေးတာပါ။
- **OWNER** — ဒီ ပုံစံက domain ရဲ့ owner (ပိုင်ရှင်) ကို သတ်မှတ်ထားတဲ့ user ဆီ ပြောင်းလဲပေးပါတယ်။
- **RENAME** — ဒီ ပုံစံက domain ရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။
- **SET SCHEMA** — ဒီ ပုံစံက domain ရဲ့ schema ကို ပြောင်းလဲပေးပါတယ်။ Domain နဲ့ ဆက်စပ်နေတဲ့ constraints တွေ မှန်သမျှကိုလည်း schema အသစ်ဆီ အတူတကွ ရွှေ့ပါတယ်။

`ALTER DOMAIN` ကို သုံးနိုင်ဖို့ domain ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Domain တစ်ခုရဲ့ schema ကို ပြောင်းဖို့ — schema အသစ်ပေါ်မှာလည်း `CREATE` privilege ရှိရပါမယ်။ Owner ကို ပြောင်းဖို့ — owner role အသစ်ဆီ `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role က domain ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက domain ကို drop ပြီး ပြန်ဖန်တီးခြင်းအားဖြင့် သင်မလုပ်နိုင်တဲ့ ဘာ action မှ မလုပ်နိုင်ဘူးဆိုတာကို အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser ကတော့ ဘယ် domain ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် ရှိပြီးသား domain တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။
- **domain_constraint** — Domain အတွက် domain constraint အသစ်။
- **constraint_name** — Drop ဒါမှမဟုတ် နာမည် ပြောင်းလဲရမယ့် ရှိပြီးသား constraint တစ်ခုရဲ့ နာမည်။
- **NOT VALID** — ရှိပြီးသား သိမ်းဆည်းထားတဲ့ data တွေကို constraint validity (ကန့်သတ်ချက် တရားဝင်မှု) အတွက် စစ်ဆေးမလုပ်ပါဘူး။
- **CASCADE** — Constraint ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — မှီခိုနေတဲ့ (dependent) objects တွေ တစ်ခုခု ရှိနေရင် constraint ကို drop လုပ်တာကို ငြင်းပယ်ပါတယ်။ ဒါက default အပြုအမူ ဖြစ်ပါတယ်။
- **new_name** — Domain အတွက် နာမည်အသစ်။
- **new_constraint_name** — Constraint အတွက် နာမည်အသစ်။
- **new_owner** — Domain ရဲ့ owner အသစ်ရဲ့ user နာမည်။
- **new_schema** — Domain အတွက် schema အသစ်။

## Notes (မှတ်စုများ)

`ALTER DOMAIN ADD CONSTRAINT` က — ရှိပြီးသား သိမ်းဆည်းထားတဲ့ data တွေက constraint အသစ်ကို ကျေနပ်ပြည့်စုံစေကြောင်း စစ်ဆေးဖို့ ကြိုးစားပေမယ့် — ဒီ စစ်ဆေးမှုက လုံးဝ ချွတ်ချော်မှု မရှိတဲ့ (bulletproof) မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ — command က အသစ် insert လုပ်ပြီး commit မဖြစ်သေးတဲ့ ဒါမှမဟုတ် update လုပ်ထားပြီး commit မဖြစ်သေးတဲ့ table rows တွေကို “မမြင်နိုင်” (see) လို့ မရလို့ပါ။ Concurrent operations တွေက data ဆိုးတွေ (bad data) insert လုပ်မိနိုင်တဲ့ အန္တရာယ် ရှိနေရင် — ရှေ့ဆက် လုပ်ရမယ့် နည်းလမ်းက — constraint ကို `NOT VALID` option နဲ့ ထပ်ပေါင်းပြီး — အဲဒီ command ကို commit လုပ်ပြီး — အဲဒီ commit မတိုင်ခင် စတင်ခဲ့တဲ့ transactions တွေ အားလုံး ပြီးဆုံးသည်အထိ စောင့်ပြီး — နောက်မှ `ALTER DOMAIN VALIDATE CONSTRAINT` ကို ထုတ်ပြန်ပြီး — constraint ကို ချိုးဖောက်နေတဲ့ data တွေ ရှာဖွေဖို့ ဖြစ်ပါတယ်။ ဒီ နည်းလမ်းက ယုံကြည်စိတ်ချရပါတယ် — ဘာလို့လဲဆိုတော့ — constraint ကို commit လုပ်ပြီးတာနဲ့ — transactions အသစ်တွေ အားလုံးက domain type ရဲ့ တန်ဖိုးအသစ်တွေအပေါ်မှာ အဲဒီ constraint ကို အတင်းအကျပ် လုပ်ဆောင်မယ်လို့ အာမခံထားလို့ပါ။

လောလောဆယ် — `ALTER DOMAIN ADD CONSTRAINT`, `ALTER DOMAIN VALIDATE CONSTRAINT` နဲ့ `ALTER DOMAIN SET NOT NULL` တွေက — နာမည်ပေးထားတဲ့ domain ဒါမှမဟုတ် ၎င်းကနေ ဆင်းသက်လာတဲ့ (derived) domain တစ်ခုခုကို database ထဲက table တစ်ခုခုရဲ့ container-type column (composite, array ဒါမှမဟုတ် range column) တစ်ခုအတွင်းမှာ သုံးထားရင် — မအောင်မြင်ပါဘူး။ ဒီလို nested values (အထပ်လိုက် တန်ဖိုးများ) တွေအတွက် constraint အသစ်ကို စစ်ဆေးနိုင်စေဖို့ — သူတို့ကို နောက်ဆုံးမှာ တိုးတက် ကောင်းမွန်အောင် လုပ်သင့်ပါတယ်။

## Examples (ဥပမာများ)

Domain တစ်ခုဆီ `NOT NULL` constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER DOMAIN zipcode SET NOT NULL;
```

Domain တစ်ခုကနေ `NOT NULL` constraint တစ်ခုကို ဖယ်ရှားဖို့:

```sql
ALTER DOMAIN zipcode DROP NOT NULL;
```

Domain တစ်ခုဆီ check constraint တစ်ခု ထပ်ပေါင်းဖို့:

```sql
ALTER DOMAIN zipcode ADD CONSTRAINT zipchk CHECK (char_length(VALUE) = 5);
```

Domain တစ်ခုကနေ check constraint တစ်ခုကို ဖယ်ရှားဖို့:

```sql
ALTER DOMAIN zipcode DROP CONSTRAINT zipchk;
```

Domain တစ်ခုပေါ်က check constraint တစ်ခုကို နာမည် ပြောင်းလဲဖို့:

```sql
ALTER DOMAIN zipcode RENAME CONSTRAINT zipchk TO zip_check;
```

Domain ကို တခြား schema တစ်ခုဆီ ရွှေ့ဖို့:

```sql
ALTER DOMAIN zipcode SET SCHEMA customers;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER DOMAIN` က — PostgreSQL extensions တွေ ဖြစ်တဲ့ `OWNER`, `RENAME`, `SET SCHEMA` နဲ့ `VALIDATE CONSTRAINT` ပုံစံကွဲတွေ ကလွဲလို့ — SQL standard နဲ့ ကိုက်ညီပါတယ်။ `ADD CONSTRAINT` ပုံစံကွဲရဲ့ `NOT VALID` clause ကလည်း PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE DOMAIN](/docs/postgresql/sql-createdomain), [DROP DOMAIN](/docs/postgresql/sql-dropdomain)
