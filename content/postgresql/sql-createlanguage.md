---
title: "CREATE LANGUAGE (procedural language အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "PostgreSQL database တစ်ခုနှင့်အတူ procedural language အသစ်တစ်ခုကို register လုပ်ခြင်း — TRUSTED, PROCEDURAL, HANDLER, INLINE, VALIDATOR option များနှင့် CREATE OR REPLACE ပုံစံများ — superuser privilege လိုအပ်သော command"
order: 253
source: "https://www.postgresql.org/docs/current/sql-createlanguage.html"
status: translated
updated: 2026-09-04
---

## CREATE LANGUAGE (procedural language အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE LANGUAGE — procedural language အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] [ TRUSTED ] [ PROCEDURAL ] LANGUAGE name
    HANDLER call_handler [ INLINE inline_handler ] [ VALIDATOR valfunction ]
CREATE [ OR REPLACE ] [ TRUSTED ] [ PROCEDURAL ] LANGUAGE name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE LANGUAGE` က PostgreSQL database တစ်ခုနဲ့အတူ procedural language အသစ်တစ်ခုကို register (မှတ်ပုံတင်) လုပ်ပေးပါတယ်။ နောက်ပိုင်းမှာ ဒီ language အသစ်နဲ့ functions တွေနဲ့ procedures တွေကို define လုပ်လို့ ရပါတယ်။

`CREATE LANGUAGE` က language ရဲ့ နာမည်ကို — ဒီ language နဲ့ ရေးထားတဲ့ functions တွေကို execute လုပ်ဖို့ တာဝန်ရှိတဲ့ — handler function(s) တွေနဲ့ ထိရောက်စွာ ချိတ်ဆက်ပေးပါတယ်။ Language handlers တွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် [အခန်း 57](https://www.postgresql.org/docs/current/plhandler.html) ကို ကိုးကားကြည့်ပါ။

`CREATE OR REPLACE LANGUAGE` က language အသစ်တစ်ခုကို ဖန်တီးပေးမယ် ဒါမှမဟုတ် — ရှိပြီးသား definition တစ်ခုကို အစားထိုးပေးပါလိမ့်မယ်။ Language က ရှိပြီးသားဆိုရင် — command အရ ၎င်းရဲ့ parameters တွေကို update လုပ်ပေးပေမယ့် — language ရဲ့ ပိုင်ဆိုင်မှု (ownership) နဲ့ permissions settings တွေကတော့ မပြောင်းလဲပါဘူး၊ ပြီးတော့ ဒီ language နဲ့ ရေးထားတဲ့ ရှိပြီးသား functions တွေကို — ဆက်လက် တရားဝင် (valid) အဖြစ် ယူဆပါတယ်။

Language အသစ်တစ်ခုကို register လုပ်ဖို့ ဒါမှမဟုတ် — ရှိပြီးသား language တစ်ခုရဲ့ parameters တွေကို ပြောင်းလဲဖို့ — PostgreSQL superuser privilege ရှိရပါမယ်။ ဒါပေမယ့် — language ကို ဖန်တီးပြီးတာနဲ့ — ၎င်းရဲ့ ပိုင်ဆိုင်မှုကို superuser မဟုတ်သူတစ်ဦးဆီ ပေးအပ်တာက တရားဝင်ပြီး — အဲဒီလူက ၎င်းကို drop လုပ်ခြင်း၊ ၎င်းရဲ့ permissions တွေကို ပြောင်းလဲခြင်း၊ နာမည်ပြောင်းခြင်း ဒါမှမဟုတ် ပိုင်ရှင်အသစ်တစ်ဦးဆီ ပေးအပ်ခြင်းတွေ လုပ်နိုင်ပါတယ်။ (ဒါပေမယ့် — နောက်ခံ C functions တွေရဲ့ ပိုင်ဆိုင်မှုကိုတော့ superuser မဟုတ်သူတစ်ဦးဆီ မပေးအပ်ပါနဲ့ — အဲဒါက အဲဒီ user အတွက် privilege escalation (အခွင့်အရေး မြှင့်တင်ခြင်း) လမ်းကြောင်းတစ်ခု ဖန်တီးပေးသလို ဖြစ်သွားလို့ပါ။)

Handler function တစ်ခုကိုမှ ထောက်ပံ့မပေးတဲ့ `CREATE LANGUAGE` ပုံစံကတော့ obsolete (အသုံးမပြုတော့ပြီ) ဖြစ်ပါတယ်။ နောက်ကျကျန် dump files တွေနဲ့ နောက်ပြန် လိုက်ဖက်ညီမှုအတွက် — ၎င်းကို `CREATE EXTENSION` အဖြစ် အဓိပ္ပာယ် ကောက်ယူပါတယ်။ Language ကို — နာမည်တူတဲ့ extension တစ်ခုအဖြစ် package လုပ်ထားရင် — အဲဒါ အလုပ်ဖြစ်ပါလိမ့်မယ် — အဲဒါကပဲ procedural languages တွေကို တပ်ဆင်ဖို့ သမားရိုးကျ နည်းလမ်း ဖြစ်ပါတယ်။

## Parameters (parameter များ)

- **TRUSTED** — TRUSTED က — language က — user မှာ တခြားနည်းနဲ့ မရှိနိုင်တဲ့ data တွေဆီ access ပေးမှာ မဟုတ်ဘူးလို့ သတ်မှတ်ပေးပါတယ်။ Language ကို register လုပ်တဲ့အခါ ဒီ key word ကို ချန်လိုက်ရင် — PostgreSQL superuser privilege ရှိတဲ့ users တွေကပဲ ဒီ language ကို သုံးပြီး functions အသစ်တွေ ဖန်တီးနိုင်ပါတယ်။
- **PROCEDURAL** — ဒါက noise word (အဓိပ္ပာယ် မဆောင်သော စကားလုံး) တစ်ခု ဖြစ်ပါတယ်။
- **name** — Procedural language အသစ်ရဲ့ နာမည်။ နာမည်က database ထဲက languages တွေကြားမှာ ထူးခြား (unique) ရပါမယ်။
- **HANDLER call_handler** — call_handler ဆိုတာက — procedural language ရဲ့ functions တွေကို execute လုပ်ဖို့ ခေါ်ယူမယ့် — အရင် register လုပ်ထားပြီးသား function တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ Procedural language တစ်ခုရဲ့ call handler ကို — version 1 call convention ပါတဲ့ C လို compiled language တစ်ခုနဲ့ ရေးသားပြီး — arguments ဘာမှ မယူဘဲ language_handler type ကို ပြန်ပေးတဲ့ function တစ်ခုအနေနဲ့ PostgreSQL မှာ register လုပ်ထားရပါမယ် — language_handler ဆိုတာက function ကို call handler တစ်ခုအဖြစ် ခွဲခြားသတ်မှတ်ဖို့ပဲ သုံးတဲ့ placeholder type တစ်ခု ဖြစ်ပါတယ်။
- **INLINE inline_handler** — inline_handler ဆိုတာက — ဒီ language ထဲမှာ anonymous code block (နာမည်မဲ့ code block) တစ်ခု (`DO` command) ကို execute လုပ်ဖို့ ခေါ်ယူမယ့် — အရင် register လုပ်ထားပြီးသား function တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ inline_handler function ကို သတ်မှတ်မထားဘူးဆိုရင် — language က anonymous code blocks တွေကို ထောက်ပံ့မပေးပါဘူး။ Handler function က — `DO` command ရဲ့ internal representation ဖြစ်မယ့် — internal type ရဲ့ argument တစ်ခုကို ယူရပြီး — ပုံမှန်အားဖြင့် void ကို ပြန်ပေးပါလိမ့်မယ်။ Handler ရဲ့ return value ကိုတော့ ဂရုမစိုက်ပါဘူး။
- **VALIDATOR valfunction** — valfunction ဆိုတာက — language ထဲမှာ function အသစ်တစ်ခုကို ဖန်တီးတဲ့အခါ — အဲဒီ function အသစ်ကို validate (စိစစ်) လုပ်ဖို့ ခေါ်ယူမယ့် — အရင် register လုပ်ထားပြီးသား function တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ Validator function ကို သတ်မှတ်မထားဘူးဆိုရင် — function အသစ်တစ်ခုကို ဖန်တီးတဲ့အခါ စစ်ဆေးမှု မလုပ်ပါဘူး။ Validator function က — ဖန်တီးခံရမယ့် function ရဲ့ OID ဖြစ်မယ့် — oid type ရဲ့ argument တစ်ခုကို ယူရပြီး — ပုံမှန်အားဖြင့် void ကို ပြန်ပေးပါလိမ့်မယ်။
Validator function တစ်ခုက ပုံမှန်အားဖြင့် — function body ကို syntactical (ဝါကျတည်ဆောက်ပုံအရ) မှန်ကန်မှုရှိမရှိ စစ်ဆေးပေမယ့် — function ရဲ့ တခြား ဂုဏ်ရည်တွေကိုလည်း ကြည့်နိုင်ပါတယ် — ဥပမာ language က argument types အချို့ကို မကိုင်တွယ်နိုင်ဘူးဆိုရင်ပေါ့။ Error တစ်ခုကို အချက်ပြဖို့ — validator function က ereport() function ကို သုံးသင့်ပါတယ်။ Function ရဲ့ return value ကိုတော့ ဂရုမစိုက်ပါဘူး။

## Notes (မှတ်စုများ)

Procedural languages တွေကို drop လုပ်ဖို့ [`DROP LANGUAGE`](/docs/postgresql/sql-droplanguage) ကို သုံးပါ။

System catalog ဖြစ်တဲ့ `pg_language` ([အပိုင်း 52.29](https://www.postgresql.org/docs/current/catalog-pg-language.html)) က — လောလောဆယ် install လုပ်ထားတဲ့ languages တွေအကြောင်း အချက်အလက်တွေကို မှတ်တမ်းတင်ထားပါတယ်။ ဒါ့အပြင် — psql command `\dL` က install လုပ်ထားတဲ့ languages တွေကို စာရင်းပြပေးပါတယ်။

Procedural language တစ်ခုနဲ့ functions တွေ ဖန်တီးဖို့ — user တစ်ယောက်က language အတွက် `USAGE` privilege ရှိရပါမယ်။ Default အနေနဲ့ — trusted languages တွေအတွက် `USAGE` ကို `PUBLIC` (ဆိုလိုတာက လူတိုင်း) ဆီ ပေးအပ်ထားပါတယ်။ လိုချင်ရင် ဒါကို revoke (ပြန်ရုတ်သိမ်း) လုပ်လို့ ရပါတယ်။

Procedural languages တွေက database တစ်ခုချင်းစီအတွင်းမှာပဲ သီးသန့် (local) ဖြစ်ပါတယ်။ ဒါပေမယ့် — language တစ်ခုကို `template1` database ထဲမှာ install လုပ်ထားရင် — နောက်ပိုင်း ဖန်တီးတဲ့ database တွေ အားလုံးမှာ အလိုအလျောက် ရရှိနိုင်စေပါတယ်။

## Examples (ဥပမာများ)

Procedural language အသစ်တစ်ခုကို ဖန်တီးဖို့ အနည်းဆုံး လုပ်ရမယ့် အစီအစဉ် (sequence) တစ်ခုက:

```sql
CREATE FUNCTION plsample_call_handler() RETURNS language_handler
    AS '$libdir/plsample'
    LANGUAGE C;
CREATE LANGUAGE plsample
    HANDLER plsample_call_handler;
```

ပုံမှန်အားဖြင့် အဲဒါကို extension တစ်ခုရဲ့ creation script ထဲမှာ ရေးသားမှာ ဖြစ်ပြီး — users တွေက extension ကို install လုပ်ဖို့ ဒီလို လုပ်ကြပါလိမ့်မယ်:

```sql
CREATE EXTENSION plsample;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE LANGUAGE` က PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER LANGUAGE](/docs/postgresql/sql-alterlanguage), [CREATE FUNCTION](/docs/postgresql/sql-createfunction), [DROP LANGUAGE](/docs/postgresql/sql-droplanguage), [GRANT](/docs/postgresql/sql-grant), [REVOKE](/docs/postgresql/sql-revoke)
