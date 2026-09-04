---
title: "EXECUTE (prepared statement တစ်ခုကို လုပ်ဆောင်ခြင်း)"
description: "အရင်က PREPARE ဖြင့် ပြင်ဆင်ထားသော prepared statement တစ်ခုကို execute လုပ်ရန် သုံးသော command — လိုက်ဖက်ညီသော parameters များ ပေးပို့ရန် လိုအပ်ချက်၊ prepared statement နာမည်၏ uniqueness၊ EXECUTE ၏ output မှာ prepared statement ၏ command tag ပြန်ပေးခြင်း စသည်တို့ ပါဝင်သည်"
order: 193
source: "https://www.postgresql.org/docs/current/sql-execute.html"
status: translated
updated: 2026-09-04
---

## EXECUTE (prepared statement တစ်ခုကို လုပ်ဆောင်ခြင်း)

EXECUTE — prepared statement တစ်ခုကို execute လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
EXECUTE name [ ( parameter [, ...] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`EXECUTE` ကို — အရင်က ပြင်ဆင်ထားတဲ့ (previously prepared) statement တစ်ခုကို execute လုပ်ဖို့ အသုံးပြုပါတယ်။ Prepared statements (ကြိုတင် ပြင်ဆင်ထားသော statements) တွေက session တစ်ခုရဲ့ သက်တမ်း အတွင်းမှာပဲ တည်ရှိတာမို့ — prepared statement ကို — လက်ရှိ session ထဲမှာ အရင်က execute လုပ်ခဲ့တဲ့ `PREPARE` statement တစ်ခုက ဖန်တီးထားတာ ဖြစ်ရပါမယ်။

Statement ကို ဖန်တီးခဲ့တဲ့ `PREPARE` statement က parameters တချို့ သတ်မှတ်ထားခဲ့တယ်ဆိုရင် — `EXECUTE` statement ဆီကို လိုက်ဖက်ညီတဲ့ (compatible) parameters အစုတစ်ခု ပေးပို့ရပါမယ်; မပေးပို့ရင် error (အမှား) တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။ Functions တွေနဲ့ မတူဘဲ — prepared statements တွေက သူတို့ရဲ့ parameters တွေရဲ့ type ဒါမှမဟုတ် အရေအတွက်ပေါ် မူတည်ပြီး overload (လုပ်ဆောင်ချက် ထပ်ဆင့် သတ်မှတ်ခြင်း) လုပ်လို့ မရဘူးဆိုတာ သတိပြုပါ; prepared statement တစ်ခုရဲ့ နာမည်က database session တစ်ခု အတွင်းမှာ unique (ထူးခြားသော) ဖြစ်ရပါမယ်။

Prepared statements တွေရဲ့ ဖန်တီးမှုနဲ့ အသုံးပြုမှုအကြောင်း ပိုပြီး သိချင်ရင် — [PREPARE](/docs/postgresql/sql-prepare) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — Execute လုပ်ရမယ့် prepared statement ရဲ့ နာမည်။
- **parameter** — Prepared statement ရဲ့ parameter တစ်ခုရဲ့ တကယ့် တန်ဖိုး (actual value) ဖြစ်ပါတယ်။ ဒါက — prepared statement ကို ဖန်တီးခဲ့စဉ်က သတ်မှတ်ခဲ့တဲ့အတိုင်း — ဒီ parameter ရဲ့ data type နဲ့ လိုက်ဖက်ညီတဲ့ တန်ဖိုး တစ်ခုကို ထုတ်ပေးတဲ့ expression တစ်ခု ဖြစ်ရပါမယ်။

## Outputs (output များ)

`EXECUTE` က ပြန်ပေးတဲ့ command tag (command တံဆိပ်) က — prepared statement ရဲ့ command tag ဖြစ်ပြီး — `EXECUTE` ကိုယ်တိုင်ရဲ့ မဟုတ်ပါဘူး။

## Examples (ဥပမာများ)

ဥပမာတွေကို [PREPARE](/docs/postgresql/sql-prepare) documentation ထဲက [Examples](/docs/postgresql/sql-prepare) (ဥပမာများ) ကဏ္ဍမှာ ဖော်ပြထားပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `EXECUTE` statement တစ်ခု ပါဝင်ပါတယ် — ဒါပေမယ့် embedded SQL ထဲမှာပဲ အသုံးပြုရန် အတွက်သာ ဖြစ်ပါတယ်။ `EXECUTE` statement ရဲ့ ဒီ version ကလည်း — syntax အနည်းငယ် ကွဲပြားတာကို အသုံးပြုပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DEALLOCATE](/docs/postgresql/sql-deallocate), [PREPARE](/docs/postgresql/sql-prepare)
