---
title: "DROP FUNCTION (function တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား function တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော functions များ၏ definition ကို ဖယ်ရှားပေးသည့် command — IF EXISTS option၊ argument list ဖြင့် function ရှာဖွေပုံ (input arguments များသာ ဖော်ပြခြင်း လုံလောက်ခြင်း)၊ CASCADE/RESTRICT အပြုအမူများအပြင် SQL standard ၏ extensions များအကြောင်း ဖော်ပြထားသည်"
order: 221
source: "https://www.postgresql.org/docs/current/sql-dropfunction.html"
status: translated
updated: 2026-09-04
---

## DROP FUNCTION (function တစ်ခုကို ဖယ်ရှားခြင်း)

DROP FUNCTION — function တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP FUNCTION [ IF EXISTS ] name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] [, ...]
    [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP FUNCTION` က ရှိပြီးသား function တစ်ခုရဲ့ definition ကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — function ရဲ့ owner ဖြစ်ရပါမယ်။ Function ရဲ့ argument types တွေကို သတ်မှတ်ပေးရပါမယ် — နာမည်တူပြီး argument lists တွေ မတူညီတဲ့ functions အများအပြား တည်ရှိနိုင်လို့ပါ။

## Parameters (parameter များ)

- **IF EXISTS** — Function မရှိဘူးဆိုရင် — error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား function တစ်ခုရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။ Argument list တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — နာမည်က ၎င်းရဲ့ schema ထဲမှာ ထူးခြား (unique) ဖြစ်ရပါမယ်။
- **argmode** — Argument တစ်ခုရဲ့ mode: IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ခဲ့ရင် — default ကတော့ IN ဖြစ်ပါတယ်။ `DROP FUNCTION` က OUT arguments တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ identity (တည်မှတ်) ကို ဆုံးဖြတ်ဖို့ input arguments တွေကိုပဲ လိုအပ်လို့ပါ။ ဒါကြောင့် — IN, INOUT နဲ့ VARIADIC arguments တွေကိုပဲ စာရင်းပြုစုရင် လုံလောက်ပါတယ်။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ `DROP FUNCTION` က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ identity ကို ဆုံးဖြတ်ဖို့ argument data types တွေကိုပဲ လိုအပ်လို့ပါ။
- **argtype** — Function ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်ထားနိုင်သည်) — ရှိရင် ဖြစ်ပါတယ်။
- **CASCADE** — Function အပေါ် dependent ဖြစ်နေတဲ့ objects တွေ (operators ဒါမှမဟုတ် triggers တွေလို) ကို အလိုအလျောက် drop လုပ်ပြီး — ၎င်းတို့အပေါ် dependent ဖြစ်နေတဲ့ objects တွေ အားလုံးကိုပါ — အလှည့်ကျ ဆက်ပြီး drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Function အပေါ် dependent ဖြစ်နေတဲ့ objects တစ်စုံတစ်ရာ ရှိနေရင် — function ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

ဒီ command က square root function ကို ဖယ်ရှားပါတယ်:

```sql
DROP FUNCTION sqrt(integer);
```

Command တစ်ခုတည်းနဲ့ functions အများအပြားကို drop လုပ်ခြင်း:

```sql
DROP FUNCTION sqrt(integer), sqrt(bigint);
```

Function ရဲ့ နာမည်က ၎င်းရဲ့ schema ထဲမှာ unique (ထူးခြား) ဖြစ်နေရင် — argument list မပါဘဲ ရည်ညွှန်းလို့ ရပါတယ်:

```sql
DROP FUNCTION update_employee_salaries;
```

ဒါက အောက်က ပုံစံနဲ့ မတူဘူးဆိုတာ သတိပြုပါ:

```sql
DROP FUNCTION update_employee_salaries();
```

ဒီ နောက်ဆုံး ပုံစံ (argument list ပါတဲ့ဟာ) က — arguments သုညခု ရှိတဲ့ function တစ်ခုကို ရည်ညွှန်းပြီး — ပထမ ပုံစံကတော့ — နာမည်က unique ဖြစ်နေသရွေ့ — arguments သုညခု အပါအဝင် — ဘယ်နှစ်ခုရှိရှိ function တစ်ခုကိုမဆို ရည်ညွှန်းနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — အောက်ပါ PostgreSQL extensions တွေနဲ့အတူ:

- Standard က command တစ်ခုမှာ function တစ်ခုတည်းကိုပဲ drop လုပ်ခွင့် ပြုပါတယ်။
- IF EXISTS option က extension တစ်ခု ဖြစ်ပါတယ်။
- Argument modes နဲ့ names တွေကို သတ်မှတ်နိုင်တာက extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FUNCTION](/docs/postgresql/sql-createfunction), [ALTER FUNCTION](/docs/postgresql/sql-alterfunction), [DROP PROCEDURE](/docs/postgresql/sql-dropprocedure), [DROP ROUTINE](/docs/postgresql/sql-droproutine)
