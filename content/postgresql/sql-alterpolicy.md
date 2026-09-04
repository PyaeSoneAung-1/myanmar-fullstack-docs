---
title: "ALTER POLICY (row-level security policy တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား row-level security policy (row အဆင့် လုံခြုံရေး မူဝါဒ) တစ်ခု၏ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးသည့် command — policy သက်ရောက်သည့် roles အစုနှင့် USING/WITH CHECK expressions များကိုသာ ပြုပြင်နိုင်ပြီး policy ရှိသည့် table ၏ owner ဖြစ်ရန် လိုအပ်သည်; PostgreSQL extension တစ်ခုဖြစ်သည်"
order: 297
source: "https://www.postgresql.org/docs/current/sql-alterpolicy.html"
status: translated
updated: 2026-09-04
---

## ALTER POLICY (row-level security policy တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER POLICY — row-level security policy (row အဆင့် လုံခြုံရေး မူဝါဒ) တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER POLICY name ON table_name RENAME TO new_name

ALTER POLICY name ON table_name
    [ TO { role_name | PUBLIC | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] ]
    [ USING ( using_expression ) ]
    [ WITH CHECK ( check_expression ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER POLICY` က — တည်ရှိပြီးသား row-level security policy တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်။ `ALTER POLICY` က — policy သက်ရောက်တဲ့ roles အစုနဲ့ `USING` နဲ့ `WITH CHECK` expressions တွေကိုပဲ ပြုပြင်ခွင့် ပြုတာ သတိပြုပါ။ Policy တစ်ခုရဲ့ တခြား properties တွေကို ပြောင်းလဲဖို့ဆိုရင် — ဥပမာ သူ သက်ရောက်တဲ့ command ဒါမှမဟုတ် သူက permissive (ခွင့်ပြုတတ်သော) လား restrictive (တင်းကျပ်သော) လားဆိုတာ — policy ကို drop လုပ်ပြီး ပြန်လည် ဖန်တီးရပါမယ်။

`ALTER POLICY` ကို သုံးဖို့ — သင်ဟာ policy သက်ရောက်တဲ့ table ကို ပိုင်ဆိုင်ရပါမယ်။

`ALTER POLICY` ရဲ့ ဒုတိယ ပုံစံမှာ — role list, `using_expression` နဲ့ `check_expression` တွေကို — သတ်မှတ်ပေးထားရင် — တစ်ခုချင်းစီ အလွတ်သဘော (independently) အစားထိုးပါတယ်။ ဒီ clauses တွေထဲက တစ်ခုကို ချန်လှပ်လိုက်ရင် — policy ရဲ့ သက်ဆိုင်ရာ အပိုင်းက မပြောင်းလဲဘဲ ရှိနေပါတယ်။

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် တည်ရှိပြီးသား policy တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **table_name** — policy ရှိနေတဲ့ table ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **new_name** — policy အတွက် နာမည်အသစ် ဖြစ်ပါတယ်။
- **role_name** — policy သက်ရောက်မယ့် role(s) တွေ ဖြစ်ပါတယ်။ Role အများအပြားကို တစ်ပြိုင်နက် သတ်မှတ်နိုင်ပါတယ်။ Policy ကို roles အားလုံးကို သက်ရောက်စေဖို့ PUBLIC ကို သုံးပါ။
- **using_expression** — Policy အတွက် USING expression ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် CREATE POLICY ကို ကြည့်ပါ။
- **check_expression** — Policy အတွက် WITH CHECK expression ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် CREATE POLICY ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER POLICY` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html), [DROP POLICY](/docs/postgresql/sql-droppolicy)
