---
title: "ALTER VIEW (view တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "view တစ်ခုရဲ့ အရန် (auxiliary) ဂုဏ်သတ္တိများကို ပြောင်းလဲပေးတဲ့ command — column default သတ်မှတ်/ဖယ်ရှားခြင်း (SET/DROP DEFAULT)၊ owner ပြောင်းခြင်း၊ column/view နာမည်ပြောင်းခြင်း (RENAME)၊ schema ပြောင်းခြင်း (SET SCHEMA) နဲ့ view options (check_option, security_barrier, security_invoker) သတ်မှတ်/ပြန်သတ်ခြင်း (SET/RESET)"
order: 146
source: "https://www.postgresql.org/docs/current/sql-alterview.html"
status: translated
updated: 2026-09-04
---

## ALTER VIEW (view တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER VIEW — view တစ်ခုရဲ့ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER VIEW [ IF EXISTS ] name ALTER [ COLUMN ] column_name SET DEFAULT expression
ALTER VIEW [ IF EXISTS ] name ALTER [ COLUMN ] column_name DROP DEFAULT
ALTER VIEW [ IF EXISTS ] name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER VIEW [ IF EXISTS ] name RENAME [ COLUMN ] column_name TO new_column_name
ALTER VIEW [ IF EXISTS ] name RENAME TO new_name
ALTER VIEW [ IF EXISTS ] name SET SCHEMA new_schema
ALTER VIEW [ IF EXISTS ] name SET ( view_option_name [= view_option_value] [, ... ] )
ALTER VIEW [ IF EXISTS ] name RESET ( view_option_name [, ... ] )
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER VIEW` က view တစ်ခုရဲ့ auxiliary (အရန်) ဂုဏ်သတ္တိ အမျိုးမျိုးကို ပြောင်းလဲပေးပါတယ်။ (View ရဲ့ defining query ကို ပြုပြင်ချင်တယ်ဆိုရင်တော့ — `CREATE OR REPLACE VIEW` ကို သုံးပါ။)

`ALTER VIEW` ကို သုံးဖို့ — သင်က view ကို ပိုင်ဆိုင်ရပါမယ်။ View ရဲ့ schema ကို ပြောင်းဖို့ဆိုရင် — schema အသစ်ပေါ်မှာလည်း `CREATE` ထူးခွင့် ရှိရပါမယ်။ Owner ကို ပြောင်းဖို့ဆိုရင် — သင်က `SET ROLE` ကို သုံးပြီး owner role အသစ်ဆီ ပြောင်းနိုင်ရမယ် — ပြီးတော့ အဲဒီ role က view ရဲ့ schema ပေါ်မှာ `CREATE` ထူးခွင့် ရှိရပါမယ်။ (ဒီကန့်သတ်ချက်တွေက — owner ကို ပြောင်းတာက view ကို drop ပြီး ပြန် create လုပ်ရင် လုပ်လို့ ရနိုင်တာထက် ပိုပြီး ဘာမှ မလုပ်နိုင်အောင် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် view ရဲ့ ownership ကိုမဆို ပြောင်းလို့ ရပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား view တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။
- **column_name** — ရှိပြီးသား column တစ်ခုရဲ့ နာမည်။
- **new_column_name** — ရှိပြီးသား column တစ်ခုအတွက် နာမည် အသစ်။
- **IF EXISTS** — View မရှိရင် error တစ်ခု မထုတ်ပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **SET/DROP DEFAULT** — ဒီ forms တွေက column တစ်ခုရဲ့ default တန်ဖိုးကို သတ်မှတ်ပေး ဒါမှမဟုတ် ဖယ်ရှားပေးပါတယ်။ View column တစ်ခုရဲ့ default တန်ဖိုးကို — view အတွက် rules ဒါမှမဟုတ် triggers တွေ မသက်ရောက်ခင် — target က view ဖြစ်တဲ့ `INSERT` ဒါမှမဟုတ် `UPDATE` command တစ်ခုခုထဲမှာ အစားထိုး ထည့်သွင်းပါတယ်။ ဒါကြောင့် — view ရဲ့ default က အောက်ခံ relations တွေကနေ လာတဲ့ default တန်ဖိုးတွေထက် ဦးစားပေး ရပါလိမ့်မယ်။
- **new_owner** — View ရဲ့ ပိုင်ရှင် အသစ်ရဲ့ user name။
- **new_name** — View အတွက် နာမည် အသစ်။
- **new_schema** — View အတွက် schema အသစ်။
- **SET ( view_option_name [= view_option_value] [, ... ] )RESET ( view_option_name [, ... ] )** — View option တစ်ခုကို သတ်မှတ်ပေး ဒါမှမဟုတ် ပြန်သတ် (reset) ပါတယ်။ လောလောဆယ် ထောက်ပံ့ထားတဲ့ options တွေကတော့:

check_option (enum)

View ရဲ့ check option ကို ပြောင်းလဲပါတယ်။ တန်ဖိုးက local ဒါမှမဟုတ် cascaded ဖြစ်ရပါမယ်။

security_barrier (boolean)

View ရဲ့ security-barrier property ကို ပြောင်းလဲပါတယ်။ တန်ဖိုးက — true ဒါမှမဟုတ် false လိုမျိုး — Boolean တန်ဖိုး တစ်ခု ဖြစ်ရပါမယ်။

security_invoker (boolean)

View ရဲ့ security-invoker property ကို ပြောင်းလဲပါတယ်။ တန်ဖိုးက — true ဒါမှမဟုတ် false လိုမျိုး — Boolean တန်ဖိုး တစ်ခု ဖြစ်ရပါမယ်။

## Notes (မှတ်စုများ)

သမိုင်းကြောင်း အရ — `ALTER TABLE` ကို view တွေနဲ့တွဲလည်း သုံးလို့ ရပါတယ်; ဒါပေမယ့် — view တွေနဲ့တွဲ ခွင့်ပြုထားတဲ့ `ALTER TABLE` ရဲ့ ပုံစံကွဲ (variant) တွေက အပေါ်မှာ ပြထားတာတွေနဲ့ ညီမျှတာတွေပဲ ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`foo` view ကို `bar` လို့ နာမည်ပြောင်းဖို့:

```sql
ALTER VIEW foo RENAME TO bar;
```

Updatable view တစ်ခုဆီ column default တန်ဖိုး တစ်ခု ချိတ်တွဲဖို့:

```sql
CREATE TABLE base_table (id int, ts timestamptz);
CREATE VIEW a_view AS SELECT * FROM base_table;
ALTER VIEW a_view ALTER COLUMN ts SET DEFAULT now();
INSERT INTO base_table(id) VALUES(1);  -- ts will receive a NULL
INSERT INTO a_view(id) VALUES(2);  -- ts will receive the current time
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER VIEW` က SQL standard ရဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE VIEW](/docs/postgresql/sql-createview), [DROP VIEW](/docs/postgresql/sql-dropview)
