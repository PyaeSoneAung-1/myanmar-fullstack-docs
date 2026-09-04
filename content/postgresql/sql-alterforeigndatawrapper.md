---
title: "ALTER FOREIGN DATA WRAPPER (foreign-data wrapper တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Foreign-data wrapper တစ်ခုရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးသော command — handler function, validator function, generic options များ သို့မဟုတ် owner ကို ပြောင်းလဲနိုင်ပြီး နာမည် ပြန်လည် မှည့်ခေါ်နိုင်သော command — superusers များသာ ပြောင်းလဲနိုင်သော command"
order: 270
source: "https://www.postgresql.org/docs/current/sql-alterforeigndatawrapper.html"
status: translated
updated: 2026-09-04
---

## ALTER FOREIGN DATA WRAPPER (foreign-data wrapper တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER FOREIGN DATA WRAPPER — foreign-data wrapper တစ်ခုရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER FOREIGN DATA WRAPPER name
    [ HANDLER handler_function | NO HANDLER ]
    [ VALIDATOR validator_function | NO VALIDATOR ]
    [ OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ]) ]
ALTER FOREIGN DATA WRAPPER name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER FOREIGN DATA WRAPPER name RENAME TO new_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER FOREIGN DATA WRAPPER` က foreign-data wrapper တစ်ခုရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးပါတယ်။ Command ရဲ့ ပထမ ပုံစံ (form) က foreign-data wrapper ရဲ့ support functions တွေ သို့မဟုတ် generic options တွေကို ပြောင်းလဲပါတယ် (clause အနည်းဆုံး တစ်ခု လိုအပ်ပါတယ်)။ ဒုတိယ ပုံစံက foreign-data wrapper ရဲ့ owner ကို ပြောင်းလဲပါတယ်။

Foreign-data wrappers တွေကို superusers တွေပဲ ပြောင်းလဲလို့ ရပါတယ်။ ထို့အပြင် — foreign-data wrappers တွေရဲ့ owner ဖြစ်ခွင့်ကိုလည်း superusers တွေပဲ ရှိနိုင်ပါတယ်။

## Parameters (parameter များ)

- **name** — ရှိပြီးသား foreign-data wrapper တစ်ခုရဲ့ နာမည်။
- **HANDLER handler_function** — Foreign-data wrapper အတွက် handler function အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။
- **NO HANDLER** — Foreign-data wrapper မှာ handler function မရှိတော့အောင် သတ်မှတ်ဖို့ သုံးပါတယ်။
Handler မရှိတဲ့ foreign-data wrapper တစ်ခုကို သုံးထားတဲ့ foreign tables တွေကို ဝင်ရောက် (access) လုပ်လို့ မရဘူးဆိုတာ သတိပြုပါ။
- **VALIDATOR validator_function** — Foreign-data wrapper အတွက် validator function အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။
Foreign-data wrapper ရဲ့ ရှိပြီးသား options တွေ ဒါမှမဟုတ် — မှီခိုနေတဲ့ (dependent) servers, user mappings သို့မဟုတ် foreign tables တွေရဲ့ options တွေက — validator အသစ်အရ မမှန်ကန်ဘဲ ဖြစ်နေနိုင်တယ်ဆိုတာ သတိပြုပါ။ PostgreSQL က ဒါကို စစ်ဆေးပေးခြင်း မရှိပါဘူး။ ပြုပြင်ပြီးသား foreign-data wrapper ကို မသုံးခင် — ဒီ options တွေ မှန်ကန်ကြောင်း သေချာအောင် လုပ်ဖို့မှာ user ရဲ့ တာဝန် ဖြစ်ပါတယ်။ ဒါပေမယ့် — ဒီ `ALTER FOREIGN DATA WRAPPER` command ထဲမှာ သတ်မှတ်ထားတဲ့ options တွေကတော့ — validator အသစ်ကို သုံးပြီး စစ်ဆေးခံရမှာ ဖြစ်ပါတယ်။
- **NO VALIDATOR** — Foreign-data wrapper မှာ validator function မရှိတော့အောင် သတ်မှတ်ဖို့ သုံးပါတယ်။
- **OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )** — Foreign-data wrapper အတွက် options တွေကို ပြောင်းလဲပါတယ်။ ADD, SET နဲ့ DROP တို့က လုပ်ဆောင်ရမယ့် လုပ်ဆောင်ချက်ကို သတ်မှတ်ပါတယ်။ Operation တစ်ခုကို အတိအကျ သတ်မှတ်မထားဘူးဆိုရင် ADD လို့ ယူဆပါတယ်။ Option names တွေက unique ဖြစ်ရပါမယ်; names နဲ့ values တွေကိုလည်း — ရှိရင် — foreign data wrapper ရဲ့ validator function ကို သုံးပြီး စစ်ဆေးပါတယ်။
- **new_owner** — Foreign-data wrapper ရဲ့ owner အသစ် ဖြစ်လာမယ့် user ရဲ့ နာမည်။
- **new_name** — Foreign-data wrapper အတွက် နာမည် အသစ်။

## Examples (ဥပမာများ)

Foreign-data wrapper `dbi` တစ်ခုကို ပြောင်းလဲပြီး — option `foo` ကို ထပ်ပေါင်းကာ — `bar` ကို ဖယ်ရှားဖို့:

```sql
ALTER FOREIGN DATA WRAPPER dbi OPTIONS (ADD foo '1', DROP bar);
```

Foreign-data wrapper `dbi` ရဲ့ validator ကို `bob.myvalidator` အဖြစ် ပြောင်းလဲဖို့:

```sql
ALTER FOREIGN DATA WRAPPER dbi VALIDATOR bob.myvalidator;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER FOREIGN DATA WRAPPER` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ် — ခြွင်းချက်ကတော့ `HANDLER`, `VALIDATOR`, `OWNER TO` နဲ့ `RENAME` clauses တွေက extensions တွေ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FOREIGN DATA WRAPPER](/docs/postgresql/sql-createforeigndatawrapper), [DROP FOREIGN DATA WRAPPER](/docs/postgresql/sql-dropforeigndatawrapper)
