---
title: "ALTER USER MAPPING (user mapping တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "User mapping တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း — OPTIONS clause အတွင်း ADD ၊ SET ၊ DROP လုပ်ဆောင်ချက်များနှင့် user_name ၊ server_name parameter များအကြောင်း — SQL/MED နှင့် ကိုက်ညီမှုနှင့် FOR key word ဆိုင်ရာ syntax ကွာခြားချက် ပါဝင်သည်"
order: 277
source: "https://www.postgresql.org/docs/current/sql-alterusermapping.html"
status: translated
updated: 2026-09-04
---

## ALTER USER MAPPING (user mapping တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER USER MAPPING — user mapping တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER USER MAPPING FOR { user_name | USER | CURRENT_ROLE | CURRENT_USER | SESSION_USER | PUBLIC }
    SERVER server_name
    OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER USER MAPPING` က user mapping တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်။

Foreign server တစ်ခုရဲ့ ပိုင်ရှင်က — အဲဒီ server အတွက် user mappings တွေကို user တိုင်းအတွက် ပြောင်းလဲနိုင်ပါတယ်။ ဒါ့အပြင် — server ပေါ်မှာ `USAGE` privilege ကို ပေးအပ်ခံထားရတဲ့ user တစ်ဦးကလည်း — သူ့ကိုယ်ပိုင် user name အတွက် user mapping တစ်ခုကို ပြောင်းလဲနိုင်ပါတယ်။

## Parameters (parameter များ)

- **user_name** — Mapping ရဲ့ user name ဖြစ်ပါတယ်။ CURRENT_ROLE, CURRENT_USER နဲ့ USER တို့က လက်ရှိ user ရဲ့ နာမည်နဲ့ ကိုက်ညီပါတယ်။ PUBLIC ကို — system ထဲက လက်ရှိ နဲ့ အနာဂတ် user နာမည်တွေ အားလုံးနဲ့ ကိုက်ညီဖို့ သုံးပါတယ်။
- **server_name** — User mapping ရဲ့ server name ဖြစ်ပါတယ်။
- **OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )** — User mapping အတွက် options တွေကို ပြောင်းလဲပေးပါတယ်။ Options အသစ်တွေက အရင် သတ်မှတ်ခဲ့ဖူးတဲ့ options တွေကို ကျော်လွန် အစားထိုး (override) လုပ်ပါတယ်။ ADD, SET နဲ့ DROP တို့က လုပ်ဆောင်ရမယ့် action (လုပ်ဆောင်ချက်) ကို သတ်မှတ်ပေးပါတယ်။ Operation (လုပ်ဆောင်မှု) တစ်ခုကို အတိအကျ သတ်မှတ်မထားရင် ADD ဖြစ်တယ်လို့ ယူဆပါတယ်။ Option နာမည်တွေက တစ်ခုနှင့်တစ်ခု မတူညီ (unique) ရပါမယ်; options တွေကို server ရဲ့ foreign-data wrapper ကလည်း တရားဝင်မှု စစ်ဆေး (validate) လုပ်ပါတယ်။

## Examples (ဥပမာများ)

User mapping `bob` ရဲ့ — server `foo` ပေါ်မှာ — password ကို ပြောင်းလဲရန်:

```sql
ALTER USER MAPPING FOR bob SERVER foo OPTIONS (SET password 'public');
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER USER MAPPING` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။ သိမ်မွေ့တဲ့ syntax ကိစ္စတစ်ခု ရှိပါတယ်: standard က `FOR` key word ကို ချန်လှပ်ထားပါတယ်။ `CREATE USER MAPPING` ရော `DROP USER MAPPING` ရော — သက်ဆိုင်ရာ နေရာတွေမှာ `FOR` ကို သုံးထားတာမို့လို့ — နောက်ထပ် အဓိက SQL/MED implementation တစ်ခုဖြစ်တဲ့ IBM DB2 ကလည်း `ALTER USER MAPPING` အတွက် `FOR` ကို လိုအပ်တာမို့ — PostgreSQL က — ညီညွတ်မှု (consistency) နဲ့ အပြန်အလှန် လုပ်ဆောင်နိုင်မှု (interoperability) အတွက် — ဒီနေရာမှာ standard နဲ့ ကွဲလွဲသွားပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE USER MAPPING](/docs/postgresql/sql-createusermapping), [DROP USER MAPPING](/docs/postgresql/sql-dropusermapping)
