---
title: "ALTER SERVER (foreign server တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Foreign server တစ်ခုရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးသော command — server version string, generic options များ သို့မဟုတ် owner ကို ပြောင်းလဲနိုင်ပြီး နာမည် ပြန်လည် မှည့်ခေါ်နိုင်သော command"
order: 274
source: "https://www.postgresql.org/docs/current/sql-alterserver.html"
status: translated
updated: 2026-09-04
---

## ALTER SERVER (foreign server တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER SERVER — foreign server တစ်ခုရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER SERVER name [ VERSION 'new_version' ]
    [ OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] ) ]
ALTER SERVER name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER SERVER name RENAME TO new_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER SERVER` က foreign server တစ်ခုရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးပါတယ်။ ပထမ ပုံစံ (form) က server ရဲ့ version string သို့မဟုတ် generic options တွေကို ပြောင်းလဲပါတယ် (clause အနည်းဆုံး တစ်ခု လိုအပ်ပါတယ်)။ ဒုတိယ ပုံစံက server ရဲ့ owner ကို ပြောင်းလဲပါတယ်။

Server တစ်ခုကို ပြောင်းလဲဖို့ဆိုရင် — သင် က server ရဲ့ owner ဖြစ်ရပါမယ်။ ထို့အပြင် — owner ကို ပြောင်းလဲဖို့ဆိုရင် — သင် က owner အသစ် ဖြစ်လာမယ့် role ဆီကို `SET ROLE` လုပ်နိုင်ရမှာ ဖြစ်သလို — server ရဲ့ foreign-data wrapper ပေါ်မှာလည်း `USAGE` privilege ရှိရပါမယ်။ (Superusers တွေက ဒီ သတ်မှတ်ချက်တွေ အားလုံးကို အလိုအလျောက် ပြည့်မီတယ်ဆိုတာ သတိပြုပါ။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား server တစ်ခုရဲ့ နာမည်။
- **new_version** — Server version အသစ်။
- **OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )** — Server အတွက် options တွေကို ပြောင်းလဲပါတယ်။ ADD, SET နဲ့ DROP တို့က လုပ်ဆောင်ရမယ့် လုပ်ဆောင်ချက်ကို သတ်မှတ်ပါတယ်။ Operation တစ်ခုကို အတိအကျ သတ်မှတ်မထားဘူးဆိုရင် ADD လို့ ယူဆပါတယ်။ Option names တွေက unique ဖြစ်ရပါမယ်; names နဲ့ values တွေကိုလည်း server ရဲ့ foreign-data wrapper library ကို သုံးပြီး စစ်ဆေးပါတယ်။
- **new_owner** — Foreign server ရဲ့ owner အသစ် ဖြစ်လာမယ့် user ရဲ့ နာမည်။
- **new_name** — Foreign server အတွက် နာမည် အသစ်။

## Examples (ဥပမာများ)

Server `foo` ကို ပြောင်းလဲပြီး connection options တွေ ထပ်ပေါင်းဖို့:

```sql
ALTER SERVER foo OPTIONS (host 'foo', dbname 'foodb');
```

Server `foo` ကို ပြောင်းလဲပြီး — version ကို ပြောင်းကာ — `host` option ကို ပြောင်းလဲဖို့:

```sql
ALTER SERVER foo VERSION '8.4' OPTIONS (SET host 'baz');
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER SERVER` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။ `OWNER TO` နဲ့ `RENAME` ပုံစံတွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SERVER](/docs/postgresql/sql-createserver), [DROP SERVER](/docs/postgresql/sql-dropserver)
