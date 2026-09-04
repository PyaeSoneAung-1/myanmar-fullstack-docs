---
title: "DEALLOCATE (prepared statement တစ်ခုကို ဖျက်သိမ်းခြင်း)"
description: "အရင်က ပြင်ဆင်ထားသော SQL statement (prepared statement) တစ်ခုကို deallocate လုပ်ရန် သုံးသော command — session ပြီးဆုံးချိန်တွင် အလိုအလျောက် deallocate ဖြစ်ခြင်း၊ PREPARE key word ကို လျစ်လျူရှုခြင်း၊ name သို့မဟုတ် ALL ဖြင့် သတ်မှတ်ခြင်း စသည်တို့ ပါဝင်သည်"
order: 194
source: "https://www.postgresql.org/docs/current/sql-deallocate.html"
status: translated
updated: 2026-09-04
---

## DEALLOCATE (prepared statement တစ်ခုကို ဖျက်သိမ်းခြင်း)

DEALLOCATE — prepared statement တစ်ခုကို deallocate (ဖျက်သိမ်း) လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DEALLOCATE [ PREPARE ] { name | ALL }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DEALLOCATE` ကို — အရင်က ပြင်ဆင်ထားတဲ့ (previously prepared) SQL statement တစ်ခုကို deallocate လုပ်ဖို့ အသုံးပြုပါတယ်။ Prepared statement (ကြိုတင် ပြင်ဆင်ထားသော statement) တစ်ခုကို ကိုယ်တိုင် deallocate မလုပ်ထားဘူးဆိုရင် — session က ပြီးဆုံးသွားတဲ့အခါ — အဲဒါကို deallocate လုပ်ပါတယ်။

Prepared statements တွေအကြောင်း ပိုပြီး သိချင်ရင် — [PREPARE](/docs/postgresql/sql-prepare) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **PREPARE** — ဒီ key word ကို လျစ်လျူရှုပါတယ် (ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး)။
- **name** — Deallocate လုပ်ရမယ့် prepared statement ရဲ့ နာမည်။
- **ALL** — Prepared statements တွေ အားလုံးကို deallocate လုပ်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `DEALLOCATE` statement တစ်ခု ပါဝင်ပါတယ် — ဒါပေမယ့် embedded SQL ထဲမှာပဲ အသုံးပြုရန် အတွက်သာ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[EXECUTE](/docs/postgresql/sql-execute), [PREPARE](/docs/postgresql/sql-prepare)
