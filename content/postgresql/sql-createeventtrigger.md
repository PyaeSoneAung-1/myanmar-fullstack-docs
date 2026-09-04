---
title: "CREATE EVENT TRIGGER (event trigger အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Event trigger အသစ်တစ်ခုကို ဖန်တီးပေးသော command — သတ်မှတ်ထားသော database event တစ်ခု ဖြစ်ပေါ်ပြီး WHEN filter condition (လောလောဆယ် TAG ကိုသာ ထောက်ပံ့သည်) ကျေနပ်သည့်အခါ trigger function ကို execute လုပ်ပေးသည် — superusers များသာ ဖန်တီးနိုင်ခြင်း၊ single-user mode နှင့် event_triggers ကို false သတ်မှတ်ထားချိန်တွင် event triggers များ disable ဖြစ်နေခြင်း အကြောင်း ဖော်ပြထားသည်"
order: 230
source: "https://www.postgresql.org/docs/current/sql-createeventtrigger.html"
status: translated
updated: 2026-09-04
---

## CREATE EVENT TRIGGER (event trigger အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE EVENT TRIGGER — event trigger အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE EVENT TRIGGER name
    ON event
    [ WHEN filter_variable IN (filter_value [, ... ]) [ AND ... ] ]
    EXECUTE { FUNCTION | PROCEDURE } function_name()
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE EVENT TRIGGER` က event trigger (database event ဖြစ်ရပ်များပေါ်တွင် fire လုပ်သော trigger အမျိုးအစား) အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ သတ်မှတ်ထားတဲ့ event (ဖြစ်ရပ်) တစ်ခု ဖြစ်ပေါ်ပြီး — trigger နဲ့ ဆက်စပ်ထားတဲ့ `WHEN` condition (ရှိရင်) ကျေနပ်တဲ့အခါတိုင်း — trigger function ကို execute (လုပ်ဆောင်) ပါလိမ့်မယ်။ Event triggers တွေရဲ့ ယေဘုယျ မိတ်ဆက် (general introduction) အတွက် [အခန်း 38](https://www.postgresql.org/docs/current/event-triggers.html) ကို ကြည့်ပါ။ Event trigger တစ်ခုကို ဖန်တီးတဲ့ user က ၎င်းရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

## Parameters (parameter များ)

- **name** — Trigger အသစ်အတွက် ပေးရမယ့် နာမည်။ ဒီ နာမည်က database ထဲမှာ ထူးခြား (unique) ဖြစ်ရပါမယ်။
- **event** — ပေးထားတဲ့ function ကို ခေါ်ယူခြင်း ဖြစ်ပေါ်စေတဲ့ event ရဲ့ နာမည်။ Event names တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် အပိုင်း 38.1 ကို ကြည့်ပါ။
- **filter_variable** — Events တွေကို စစ်ထုတ်ဖို့ သုံးတဲ့ variable တစ်ခုရဲ့ နာမည်။ ဒါက — trigger ကို fire လုပ်တာ ထောက်ပံ့ထားတဲ့ ကိစ္စရပ်များရဲ့ အစိတ်အပိုင်း (subset) တစ်ခုအတွင်းကိုပဲ ကန့်သတ်နိုင်စေပါတယ်။ လောလောဆယ် — ထောက်ပံ့ထားတဲ့ filter_variable တစ်ခုတည်းကတော့ TAG ပဲ ဖြစ်ပါတယ်။
- **filter_value** — Trigger က fire လုပ်သင့်တဲ့ ဆက်စပ် filter_variable အတွက် တန်ဖိုးတွေရဲ့ စာရင်း။ TAG အတွက်ဆိုရင် — ဒါက command tags (command တံဆိပ်များ) တွေရဲ့ စာရင်းကို ဆိုလိုပါတယ် (ဥပမာ — 'DROP FUNCTION')။
- **function_name** — arguments တွေ မယူဘဲ — `event_trigger` type ကို ပြန်ပေးတဲ့ function တစ်ခုအဖြစ် ကြေညာထားတဲ့ — user က ထောက်ပံ့ပေးတဲ့ function တစ်ခု။
CREATE EVENT TRIGGER ရဲ့ syntax ထဲမှာ — FUNCTION နဲ့ PROCEDURE keywords တွေက ညီမျှပေမယ့် — ရည်ညွှန်းထားတဲ့ function က ဘယ်အခြေအနေမှာမဆို procedure မဟုတ်ဘဲ function တစ်ခု ဖြစ်ရပါမယ်။ ဒီနေရာမှာ PROCEDURE keyword ကို သုံးတာက သမိုင်းကြောင်းအရ ဖြစ်ပြီး — deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော) ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

Superusers တွေပဲ event triggers တွေကို ဖန်တီးလို့ ရပါတယ်။

Event triggers တွေကို single-user mode (တစ်ဦးတည်း သုံးစွဲမှု mode) မှာ ([postgres](https://www.postgresql.org/docs/current/app-postgres.html) ကို ကြည့်ပါ) — ပြီးတော့ [event_triggers](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-EVENT-TRIGGERS) ကို `false` လို့ သတ်မှတ်ထားတဲ့အခါမှာလည်း — disable လုပ်ထားပါတယ်။ မှားယွင်းနေတဲ့ event trigger တစ်ခုက database ကို — trigger ကိုတောင် drop လုပ်လို့ မရတော့လောက်အောင် — အသုံးမရအောင် ဖြစ်စေခဲ့ရင် — [event_triggers](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-EVENT-TRIGGERS) ကို `false` လို့ သတ်မှတ်ပြီး ဒါမှမဟုတ် single-user mode နဲ့ restart (ပြန်လည် စတင်) လုပ်ပါ — ဒါဆိုရင် — event triggers တွေကို ယာယီ disable လုပ်ထားလို့ — trigger ကို drop လုပ်နိုင်ပါလိမ့်မယ်။

## Examples (ဥပမာများ)

ဘယ် [DDL](https://www.postgresql.org/docs/current/ddl.html) command ကိုမဆို execute လုပ်တာကို တားမြစ်ဖို့:

```
CREATE OR REPLACE FUNCTION abort_any_command()
  RETURNS event_trigger
 LANGUAGE plpgsql
  AS $$
BEGIN
  RAISE EXCEPTION 'command % is disabled', tg_tag;
END;
$$;

CREATE EVENT TRIGGER abort_ddl ON ddl_command_start
   EXECUTE FUNCTION abort_any_command();
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE EVENT TRIGGER` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER EVENT TRIGGER](/docs/postgresql/sql-altereventtrigger), [DROP EVENT TRIGGER](/docs/postgresql/sql-dropeventtrigger), [CREATE FUNCTION](/docs/postgresql/sql-createfunction)
