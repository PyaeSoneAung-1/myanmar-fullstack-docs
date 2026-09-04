---
title: "CALL (procedure တစ်ခုကို ခေါ်ယူခြင်း)"
description: "Procedure တစ်ခုကို invoke (ခေါ်ယူ) လုပ်ဆောင်ပေးတဲ့ command — procedure မှာ output parameters များ ပါဝင်ပါက သက်ဆိုင်ရာ တန်ဖိုးများ ပါဝင်တဲ့ result row ကို ပြန်ပေးပြီး — argument ပေးပုံ၊ EXECUTE privilege လိုအပ်ချက်၊ transaction control ကန့်သတ်ချက်များနှင့် SQL standard နဲ့ လိုက်ဖက်မှုအကြောင်း ဖော်ပြထားသည်"
order: 199
source: "https://www.postgresql.org/docs/current/sql-call.html"
status: translated
updated: 2026-09-04
---

## CALL (procedure တစ်ခုကို ခေါ်ယူခြင်း)

CALL — procedure တစ်ခုကို ခေါ်ယူ (invoke) လုပ်ပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CALL name ( [ argument ] [, ...] )
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CALL` က procedure တစ်ခုကို execute လုပ်ပါတယ်။

Procedure မှာ output parameters တွေ ရှိမယ်ဆိုရင် — အဲဒီ parameters တွေရဲ့ တန်ဖိုးတွေ ပါဝင်တဲ့ result row (ရလဒ် အတန်း) တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

## Parameters (parameter များ)

- **name** — procedure ရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။
- **argument** — procedure call အတွက် argument expression တစ်ခု။ Arguments တွေမှာ — name => value ဆိုတဲ့ syntax ကို သုံးပြီး — parameter names တွေ ပါဝင်နိုင်ပါတယ်။ ဒါက သာမန် function call တွေမှာလိုပဲ အလုပ်လုပ်ပါတယ်; အသေးစိတ်အတွက် [အပိုင်း 4.3](/docs/postgresql/sql-syntax-calling-funcs) ကို ကြည့်ပါ။
Arguments တွေကို — defaults မရှိတဲ့ procedure parameters တွေ အားလုံးအတွက် — OUT parameters တွေ အပါအဝင် — ပေးအပ်ရပါမယ်။ ဒါပေမယ့် — OUT parameters တွေနဲ့ ကိုက်ညီတဲ့ arguments တွေကိုတော့ evaluate လုပ်မှာ မဟုတ်ပါဘူး — ဒါကြောင့် — အဲဒါတွေအတွက် `NULL` ပဲ ရေးတာက ထုံးစံ ဖြစ်ပါတယ်။ (OUT parameter တစ်ခုအတွက် တခြားတစ်ခုခု ရေးမိရင် — နောင် PostgreSQL versions တွေနဲ့ — compatibility ပြဿနာတွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။)

## Notes (မှတ်စုများ)

User က — procedure ကို invoke လုပ်ခွင့် ရရှိဖို့အတွက် — procedure အပေါ်မှာ `EXECUTE` privilege ရှိရပါမယ်။

Function တစ်ခုကို (procedure မဟုတ်ဘဲ) ခေါ်ယူဖို့ဆိုရင် — `SELECT` ကို သုံးပါ။

`CALL` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်ရင် — ခေါ်ယူလိုက်တဲ့ procedure ထဲမှာ transaction control statements တွေကို execute လုပ်လို့ မရပါဘူး။ `CALL` ကို ကိုယ်ပိုင် transaction တစ်ခုအနေနဲ့ execute လုပ်မှသာ — transaction control statements တွေကို ခွင့်ပြုပါတယ်။

PL/pgSQL ကတော့ `CALL` commands တွေထဲမှာ output parameters တွေကို မတူညီတဲ့ နည်းလမ်းနဲ့ ကိုင်တွယ်ပါတယ်; [အပိုင်း 41.6.3](https://www.postgresql.org/docs/current/plpgsql-control-structures.html#PLPGSQL-STATEMENTS-CALLING-PROCEDURE) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

```sql
CALL do_db_maintenance();
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CALL` က — output parameters တွေရဲ့ ကိုင်တွယ်မှု ကလွဲပြီး — SQL standard နဲ့ ကိုက်ညီပါတယ်။ Standard အရ — users တွေက output parameters တွေရဲ့ တန်ဖိုးတွေကို လက်ခံရယူဖို့ variables တွေ ရေးသားသင့်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE PROCEDURE](https://www.postgresql.org/docs/current/sql-createprocedure.html)
