---
title: "DROP ROUTINE (routine တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား routine တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော routines များ၏ definition ကို ဖယ်ရှားပေးသည့် command — routine တွင် aggregate functions, functions နှင့် procedures များ ပါဝင်ပြီး — DROP PROCEDURE ၏ lookup rules များကို အခြေခံ၍ argmode markers မပါသော argument list များတွင် SQL standard ၏ OUT arguments ပါဝင်သည့် အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကိုပါ ထည့်သွင်း စဉ်းစားခြင်း၊ IF EXISTS, CASCADE/RESTRICT နှင့် SQL standard extensions များအကြောင်း ဖော်ပြထားသည်"
order: 226
source: "https://www.postgresql.org/docs/current/sql-droproutine.html"
status: translated
updated: 2026-09-04
---

## DROP ROUTINE (routine တစ်ခုကို ဖယ်ရှားခြင်း)

DROP ROUTINE — routine တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP ROUTINE [ IF EXISTS ] name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] [, ...]
    [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP ROUTINE` က ရှိပြီးသား routine တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော routines တွေရဲ့ definition ကို ဖယ်ရှားပေးပါတယ်။ “routine” ဆိုတဲ့ ဝေါဟာရမှာ aggregate functions, functions (သာမန် functions) နဲ့ procedures တွေ ပါဝင်ပါတယ်။ Parameters တွေရဲ့ ဖော်ပြချက်၊ ဥပမာတွေ ပိုများဖို့နဲ့ နောက်ထပ် အသေးစိတ်အချက်အလက်တွေအတွက် [DROP AGGREGATE](https://www.postgresql.org/docs/current/sql-dropaggregate.html), [DROP FUNCTION](/docs/postgresql/sql-dropfunction) နဲ့ [DROP PROCEDURE](/docs/postgresql/sql-dropprocedure) အောက်မှာ ကြည့်ပါ။

## Notes (မှတ်စုများ)

`DROP ROUTINE` က သုံးတဲ့ lookup rules တွေက `DROP PROCEDURE` အတွက်နဲ့ အခြေခံအားဖြင့် အတူတူပဲ ဖြစ်ပါတယ်; အထူးသဖြင့် — `DROP ROUTINE` က — argmode markers တွေ မပါဝင်တဲ့ argument list တစ်ခုကို — `OUT` arguments တွေက list ထဲမှာ ပါဝင်တယ်ဆိုတဲ့ — SQL standard ရဲ့ definition ကို သုံးနေနိုင်တယ်လို့ ယူဆတဲ့ — အဲဒီ command ရဲ့ အပြုအမူကို မျှဝေသုံးပါတယ်။ (`DROP AGGREGATE` နဲ့ `DROP FUNCTION` ကတော့ ဒီလို မလုပ်ပါဘူး။)

မတူညီတဲ့ မျိုးစိတ် (kinds) တွေရဲ့ routines တွေက နာမည်တစ်ခုတည်းကို မျှဝေသုံးနေတဲ့ ကိစ္စတချို့မှာ — ပိုပြီး တိကျတဲ့ command တစ်ခု (`DROP FUNCTION` စသည်) အလုပ်လုပ်နိုင်မယ့် နေရာမှာ — `DROP ROUTINE` က ambiguity error တစ်ခုနဲ့ မအောင်မြင်ဘဲ ဖြစ်နိုင်ပါတယ်။ Argument type list ကို ပိုပြီး သေချာ သတ်မှတ်ပေးတာကလည်း ဒီလို ပြဿနာတွေကို ဖြေရှင်းပေးပါလိမ့်မယ်။

ဒီ lookup rules တွေကို — ရှိပြီးသား routines တွေအပေါ် လုပ်ဆောင်တဲ့ — `ALTER ROUTINE` နဲ့ `COMMENT ON ROUTINE` လို — တခြား commands တွေမှာလည်း သုံးပါတယ်။

## Examples (ဥပမာများ)

`integer` type အတွက် `foo` ဆိုတဲ့ routine ကို drop လုပ်ဖို့:

```sql
DROP ROUTINE foo(integer);
```

ဒီ command က — `foo` က aggregate တစ်ခု၊ function တစ်ခု ဒါမှမဟုတ် procedure တစ်ခု ဖြစ်ဖြစ် — ဘာဖြစ်ဖြစ် အလုပ်လုပ်ပါလိမ့်မယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — အောက်ပါ PostgreSQL extensions တွေနဲ့အတူ:

- Standard က command တစ်ခုမှာ routine တစ်ခုတည်းကိုပဲ drop လုပ်ခွင့် ပြုပါတယ်။
- IF EXISTS option က extension တစ်ခု ဖြစ်ပါတယ်။
- Argument modes နဲ့ names တွေကို သတ်မှတ်နိုင်တာက extension တစ်ခု ဖြစ်ပြီး — modes တွေ ပေးထားတဲ့အခါ — lookup rules တွေ ကွဲပြားပါတယ်။
- User ကိုယ်တိုင် သတ်မှတ်နိုင်တဲ့ (user-definable) aggregate functions တွေက extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DROP AGGREGATE](https://www.postgresql.org/docs/current/sql-dropaggregate.html), [DROP FUNCTION](/docs/postgresql/sql-dropfunction), [DROP PROCEDURE](/docs/postgresql/sql-dropprocedure), [ALTER ROUTINE](/docs/postgresql/sql-alterroutine)

`CREATE ROUTINE` command ဆိုတာ မရှိဘူးဆိုတာ သတိပြုပါ။
