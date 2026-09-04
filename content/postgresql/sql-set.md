---
title: "SET (run-time parameter တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Run-time configuration parameter တစ်ခုကို ပြောင်းလဲပေးသည့် command — SESSION/LOCAL scope များ၊ SCHEMA, NAMES, SEED, TIME ZONE အထူး parameters များ၊ function အတွင်း SET LOCAL အသုံးပြုမှုဆိုင်ရာ စည်းမျဉ်းများနှင့် ဥပမာများ ပါဝင်သည်"
order: 183
source: "https://www.postgresql.org/docs/current/sql-set.html"
status: translated
updated: 2026-09-04
---

## SET (run-time parameter တစ်ခုကို ပြောင်းလဲခြင်း)

SET — run-time parameter (runtime သတ်မှတ်ချက်) တစ်ခုကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SET [ SESSION | LOCAL ] configuration_parameter { TO | = } { value | 'value' | DEFAULT }
SET [ SESSION | LOCAL ] TIME ZONE { value | 'value' | LOCAL | DEFAULT }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SET` command က run-time configuration parameters (runtime configuration သတ်မှတ်ချက်များ) တွေကို ပြောင်းလဲပေးပါတယ်။ [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) မှာ စာရင်းပြုစုထားတဲ့ run-time parameters တွေထဲက အများအပြားကို — `SET` နဲ့ on-the-fly (ပြေးနေဆဲမှာ ချက်ချင်း) ပြောင်းလဲလို့ ရပါတယ်။ (Parameters တချို့ကို superusers တွေနဲ့ — အဲဒီ parameter ပေါ်မှာ `SET` privilege ပေးအပ်ခံထားရတဲ့ users တွေကသာ ပြောင်းလဲနိုင်ပါတယ်။ Server ဒါမှမဟုတ် session စတင်ပြီးနောက်မှာ ပြောင်းလဲလို့ မရတဲ့ parameters တွေလည်း ရှိပါသေးတယ်။) `SET` က လက်ရှိ session ကပဲ သုံးတဲ့ တန်ဖိုးကိုသာ သက်ရောက်မှု ရှိပါတယ်။

`SET` (ဒါမှမဟုတ် ညီမျှတဲ့ `SET SESSION`) ကို — နောက်ပိုင်းမှာ abort (ဖျက်သိမ်း) လုပ်ခံရတဲ့ transaction တစ်ခုရဲ့ အတွင်းမှာ ထုတ်ပြန်ခဲ့ရင် — transaction ကို roll back လုပ်တဲ့အခါ — `SET` command ရဲ့ အကျိုးသက်ရောက်မှုတွေ ပျောက်ကွယ်သွားပါတယ်။ ပတ်ဝန်းကျင်က transaction ကို commit လုပ်လိုက်တာနဲ့ — တခြား `SET` တစ်ခုက ကျော်လွှား မလွှမ်းမိုးဘူးဆိုရင် — အကျိုးသက်ရောက်မှုတွေက session ရဲ့ အဆုံးအထိ တည်မြဲနေပါလိမ့်မယ်။

`SET LOCAL` ရဲ့ အကျိုးသက်ရောက်မှုတွေက — commit လုပ်သည်ဖြစ်စေ၊ မလုပ်သည်ဖြစ်စေ — လက်ရှိ transaction ရဲ့ အဆုံးအထိသာ ကြာမြင့်ပါတယ်။ အထူး ကိစ္စတစ်ခုကတော့ — transaction တစ်ခုတည်း အတွင်းမှာ `SET` ပြီးတော့ `SET LOCAL` ကို ဆက်တိုက် သုံးတာပါ: `SET LOCAL` ရဲ့ တန်ဖိုးကို transaction ရဲ့ အဆုံးအထိ မြင်ရမှာ ဖြစ်ပြီး — နောက်ပိုင်းမှာတော့ (transaction ကို commit လုပ်ခဲ့ရင်) — `SET` ရဲ့ တန်ဖိုးက ပြန် အကျိုးသက်ရောက်ပါလိမ့်မယ်။

`SET` ဒါမှမဟုတ် `SET LOCAL` ရဲ့ အကျိုးသက်ရောက်မှုတွေကို — command ထက် စောတဲ့ savepoint (သိမ်းဆည်းမှတ်) တစ်ခုဆီ roll back လုပ်တာကလည်း ပယ်ဖျက်ပေးပါတယ်။

`SET LOCAL` ကို — တူညီတဲ့ variable အတွက် `SET` option တစ်ခု ပါဝင်တဲ့ function တစ်ခုရဲ့ အတွင်းမှာ သုံးရင် ([CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html) ကို ကြည့်ပါ) — function ကနေ ထွက်လိုက်တာနဲ့ `SET LOCAL` command ရဲ့ အကျိုးသက်ရောက်မှုတွေ ပျောက်ကွယ်သွားပါတယ်; ဆိုလိုတာက — function ကို ခေါ်ခဲ့တဲ့အချိန်မှာ သက်ရောက်နေတဲ့ တန်ဖိုးကို ဘာပဲဖြစ်ဖြစ် ပြန်လည် ရရှိပါတယ်။ ဒါက function တစ်ခုရဲ့ အတွင်းမှာ parameter တစ်ခုကို — dynamic (လှုပ်ရှား ပြောင်းလဲနေသော) ဒါမှမဟုတ် ထပ်ခါတလဲလဲ ပြောင်းလဲမှုတွေအတွက် — `SET LOCAL` ကို သုံးခွင့် ပြုပေးသလို — caller ရဲ့ တန်ဖိုးကို သိမ်းဆည်းပြီး ပြန်လည် ရယူဖို့အတွက် `SET` option ကို သုံးရတဲ့ အဆင်ပြေမှုကိုလည်း ဆက်လက် ထိန်းသိမ်းပေးပါတယ်။ ဒါပေမယ့် — ပုံမှန် `SET` command တစ်ခုကတော့ — ပတ်ဝန်းကျင်က function တစ်ခုရဲ့ `SET` option ကို ကျော်လွှား လွှမ်းမိုးပြီး — roll back မလုပ်ရင် ၎င်းရဲ့ အကျိုးသက်ရောက်မှုတွေ တည်မြဲနေပါမယ်။

> **သတိပြုရန်:** PostgreSQL version 8.0 ကနေ 8.2 အထိတွေမှာ — `SET LOCAL` တစ်ခုရဲ့ အကျိုးသက်ရောက်မှုတွေကို — စောတဲ့ savepoint တစ်ခုကို release (လွှတ်ပေး) လုပ်ခြင်း ဒါမှမဟုတ် PL/pgSQL exception block တစ်ခုကနေ အောင်မြင်စွာ ထွက်ခြင်း အားဖြင့် — ပယ်ဖျက်နိုင်ခဲ့ပါတယ်။ ဒီအပြုအမူကို — သိပ်ပြီး intuitive (အလိုလို နားလည်နိုင်သော) မဟုတ်ဘူးလို့ ယူဆခဲ့လို့ — ပြောင်းလဲလိုက်ပါပြီ။

## Parameters (parameter များ)

- **SESSION** — Command က လက်ရှိ session အတွက် အကျိုးသက်ရောက်မှု ရှိစေတယ်လို့ သတ်မှတ်ပေးပါတယ်။ (SESSION ရော LOCAL ရော မပါဝင်ဘူးဆိုရင် — ဒါကတော့ default ဖြစ်ပါတယ်။)
- **LOCAL** — Command က လက်ရှိ transaction အတွက်သာ အကျိုးသက်ရောက်မှု ရှိစေတယ်လို့ သတ်မှတ်ပေးပါတယ်။ COMMIT ဒါမှမဟုတ် ROLLBACK ပြီးနောက်မှာ — session-level setting က ပြန် အကျိုးသက်ရောက်ပါတယ်။ ဒါကို transaction block တစ်ခုရဲ့ အပြင်ဘက်မှာ ထုတ်ပြန်ရင် — warning (သတိပေးချက်) တစ်ခု ထုတ်ပြီး — ကျန်တဲ့ အကျိုးသက်ရောက်မှု ဘာမှ မရှိပါဘူး။
- **configuration_parameter** — သတ်မှတ်လို့ ရတဲ့ run-time parameter တစ်ခုရဲ့ နာမည်။ ရရှိနိုင်တဲ့ parameters တွေကို အခန်း 19 နဲ့ အောက်မှာ ဖော်ပြထားပါတယ်။
- **value** — Parameter ရဲ့ တန်ဖိုးအသစ်။ တန်ဖိုးတွေကို — သက်ဆိုင်ရာ parameter အတွက် သင့်လျော်သလို — string constants (စာသား ကိန်းသေများ), identifiers, numbers (ဂဏန်းများ), ဒါမှမဟုတ် ဒီဟာတွေရဲ့ comma နဲ့ ခွဲထားတဲ့ စာရင်းတွေအနေနဲ့ သတ်မှတ်လို့ ရပါတယ်။ Parameter ကို ၎င်းရဲ့ default တန်ဖိုးဆီ ပြန်လည် သတ်မှတ်ဖို့အတွက် — (ဆိုလိုတာက — လက်ရှိ session မှာ SET တစ်ခါမှ execute မလုပ်ခဲ့ဘူးဆိုရင် ရှိနေမယ့် တန်ဖိုး ဘာပဲဖြစ်ဖြစ်) — DEFAULT လို့ ရေးသားနိုင်ပါတယ်။

[အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) မှာ ဖော်ပြထားတဲ့ configuration parameters တွေအပြင် — `SET` command နဲ့သာ ချိန်ညှိနိုင်တဲ့ ဒါမှမဟုတ် အထူး syntax ရှိတဲ့ parameters အနည်းငယ်လည်း ရှိပါသေးတယ်:

- **SCHEMA** — `SET SCHEMA 'value'` က `SET search_path TO value` ရဲ့ alias (နာမည်တစ်မျိုးဖြင့် ခေါ်ဆိုခြင်း) တစ်ခု ဖြစ်ပါတယ်။ ဒီ syntax ကို သုံးပြီး schema တစ်ခုတည်းကိုသာ သတ်မှတ်နိုင်ပါတယ်။
- **NAMES** — `SET NAMES 'value'` က `SET client_encoding TO value` ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။
- **SEED** — Random number generator (ကျပန်းဂဏန်း ထုတ်လုပ်ပေးသည့် စနစ်) (function random) အတွက် internal seed (အတွင်းပိုင်း မျိုးစေ့တန်ဖိုး) ကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေက -1 နဲ့ 1 အပါအဝင် ကြားက floating-point numbers (ဒသမ ဂဏန်းများ) တွေ ဖြစ်ပါတယ်။
Seed ကို setseed ဆိုတဲ့ function ကို ခေါ်ပြီးလည်း သတ်မှတ်နိုင်ပါတယ်:

SELECT setseed(value);
- **TIME ZONE** — `SET TIME ZONE 'value'` က `SET timezone TO 'value'` ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။ `SET TIME ZONE` ရဲ့ syntax က time zone သတ်မှတ်ချက်အတွက် အထူး syntax ကို ခွင့်ပြုပေးပါတယ်။ တရားဝင်တဲ့ (valid) တန်ဖိုးတွေရဲ့ ဥပမာတွေက အောက်မှာ ဖြစ်ပါတယ်:

'America/Los_Angeles'

ဒါက Berkeley, California အတွက် time zone ဖြစ်ပါတယ်။

'Europe/Rome'

ဒါက Italy အတွက် time zone ဖြစ်ပါတယ်။

-7

ဒါက UTC ကနေ အနောက်ဘက် 7 နာရီ ကွာဝေးတဲ့ time zone (PDT နဲ့ ညီမျှသည်) ဖြစ်ပါတယ်။ Positive တန်ဖိုးတွေကတော့ UTC ကနေ အရှေ့ဘက်ကို ကွာဝေးပါတယ်။

INTERVAL '-08:00' HOUR TO MINUTE

ဒါက UTC ကနေ အနောက်ဘက် 8 နာရီ ကွာဝေးတဲ့ time zone (PST နဲ့ ညီမျှသည်) ဖြစ်ပါတယ်။

LOCALDEFAULT

Time zone ကို သင့်ရဲ့ local time zone (ဆိုလိုတာက — server ရဲ့ timezone အတွက် default တန်ဖိုး) အဖြစ် သတ်မှတ်ပေးပါတယ်။

Timezone settings တွေကို numbers ဒါမှမဟုတ် intervals အနေနဲ့ ပေးထားရင် — အတွင်းပိုင်းမှာ POSIX timezone syntax အဖြစ် ဘာသာပြန်ဆိုပါတယ်။ ဥပမာ — `SET TIME ZONE -7` ပြီးနောက်မှာ — `SHOW TIME ZONE` က `<-07>+07` လို့ သတင်းပို့ပါလိမ့်မယ်။
Time zone abbreviations (time zone အတိုကောက်များ) တွေကိုတော့ `SET` က ထောက်ပံ့မပေးပါဘူး; time zones တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် အပိုင်း 8.5.3 ကို ကြည့်ပါ။

## Notes (မှတ်စုများ)

`set_config` ဆိုတဲ့ function ကလည်း ညီမျှတဲ့ လုပ်ဆောင်နိုင်စွမ်းကို ပေးပါတယ်; [အပိုင်း 9.28.1](/docs/postgresql/functions-admin) ကို ကြည့်ပါ။ ဒါ့အပြင် — `SET` နဲ့ ညီမျှတာကို လုပ်ဆောင်ဖို့ [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html) system view ကို UPDATE လုပ်ဖို့လည်း ဖြစ်နိုင်ပါတယ်။

## Examples (ဥပမာများ)

Schema search path ကို သတ်မှတ်ခြင်း:

```sql
SET search_path TO my_schema, public;
```

Date ရဲ့ style ကို — “day before month” (ရက် ဦးစွာ ထည့်သွင်းသည့်) input convention နဲ့ — ရိုးရာ POSTGRES အဖြစ် သတ်မှတ်ခြင်း:

```sql
SET datestyle TO postgres, dmy;
```

Berkeley, California အတွက် time zone ကို သတ်မှတ်ခြင်း:

```sql
SET TIME ZONE 'America/Los_Angeles';
```

Italy အတွက် time zone ကို သတ်မှတ်ခြင်း:

```sql
SET TIME ZONE 'Europe/Rome';
```

## Compatibility (လိုက်ဖက်ညီမှု)

`SET TIME ZONE` က SQL standard မှာ သတ်မှတ်ထားတဲ့ syntax ကို တိုးချဲ့ပေးပါတယ်။ Standard က numeric time zone offsets (ဂဏန်း time zone offset များ) တွေကိုသာ ခွင့်ပြုပေမယ့် — PostgreSQL ကတော့ ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ရှိတဲ့ time-zone specifications (time zone သတ်မှတ်ချက်များ) တွေကို ခွင့်ပြုပေးပါတယ်။ ကျန် `SET` features တွေ အားလုံးကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[RESET](/docs/postgresql/sql-reset), [SHOW](/docs/postgresql/sql-show)
