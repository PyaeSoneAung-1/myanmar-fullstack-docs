---
title: "ALTER DEFAULT PRIVILEGES (default privileges များကို ပြောင်းလဲခြင်း)"
description: "အနာဂတ်မှာ ဖန်တီးခံရမယ့် objects တွေအတွက် default access privileges များကို သတ်မှတ် ပြောင်းလဲပေးသည့် command — schemas, tables, sequences, functions, types နှင့် large objects များအတွက် GRANT/REVOKE ပုံစံများ၊ role နှင့် schema အလိုက် scope သတ်မှတ်ပုံများ ပါဝင်သည်"
order: 210
source: "https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html"
status: translated
updated: 2026-09-04
---

## ALTER DEFAULT PRIVILEGES (default privileges များကို ပြောင်းလဲခြင်း)

ALTER DEFAULT PRIVILEGES — default access privileges (မူရင်း ဝင်ရောက် အသုံးပြုခွင့်များ) ကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER DEFAULT PRIVILEGES
    [ FOR { ROLE | USER } target_role [, ...] ]
    [ IN SCHEMA schema_name [, ...] ]
    abbreviated_grant_or_revoke

where abbreviated_grant_or_revoke is one of:

GRANT { { SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES | TRIGGER | MAINTAIN }
    [, ...] | ALL [ PRIVILEGES ] }
    ON TABLES
    TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]

GRANT { { USAGE | SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON SEQUENCES
    TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]

GRANT { EXECUTE | ALL [ PRIVILEGES ] }
    ON { FUNCTIONS | ROUTINES }
    TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON TYPES
    TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]

GRANT { { USAGE | CREATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON SCHEMAS
    TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]

GRANT { { SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON LARGE OBJECTS
    TO { [ GROUP ] role_name | PUBLIC } [, ...] [ WITH GRANT OPTION ]

REVOKE [ GRANT OPTION FOR ]
    { { SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES | TRIGGER | MAINTAIN }
    [, ...] | ALL [ PRIVILEGES ] }
    ON TABLES
    FROM { [ GROUP ] role_name | PUBLIC } [, ...]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { USAGE | SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON SEQUENCES
    FROM { [ GROUP ] role_name | PUBLIC } [, ...]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { EXECUTE | ALL [ PRIVILEGES ] }
    ON { FUNCTIONS | ROUTINES }
    FROM { [ GROUP ] role_name | PUBLIC } [, ...]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { USAGE | ALL [ PRIVILEGES ] }
    ON TYPES
    FROM { [ GROUP ] role_name | PUBLIC } [, ...]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { USAGE | CREATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON SCHEMAS
    FROM { [ GROUP ] role_name | PUBLIC } [, ...]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON LARGE OBJECTS
    FROM { [ GROUP ] role_name | PUBLIC } [, ...]
    [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER DEFAULT PRIVILEGES` က — အနာဂတ်မှာ ဖန်တီးခံရမယ့် objects တွေပေါ်မှာ သက်ရောက်မယ့် privileges တွေကို သတ်မှတ်နိုင်စေပါတယ်။ (ရှိပြီးသား objects တွေပေါ်မှာ ပေးအပ်ထားပြီးသား privileges တွေကိုတော့ သက်ရောက်မှု မရှိပါဘူး။) Privileges တွေကို global အနေနဲ့ (ဆိုလိုတာက — current database ထဲမှာ ဖန်တီးခံရမယ့် objects တွေ အားလုံးအတွက်) ဒါမှမဟုတ် — သတ်မှတ်ထားတဲ့ schemas တွေအတွင်းမှာ ဖန်တီးခံရမယ့် objects တွေအတွက်ပဲ — သတ်မှတ်နိုင်ပါတယ်။

ကိုယ့်ရဲ့ ကိုယ်ပိုင် default privileges တွေကိုရော — ကိုယ် အဖွဲ့ဝင် (member) ဖြစ်နေတဲ့ roles တွေရဲ့ default privileges တွေကိုပါ ပြောင်းလဲနိုင်ပေမယ့် — object တစ်ခု ဖန်တီးချိန်မှာတော့ — object အသစ်ရဲ့ permissions တွေကို current role ရဲ့ default privileges တွေကပဲ သက်ရောက်မှု ရှိပြီး — current role က အဖွဲ့ဝင် ဖြစ်နေတဲ့ ဘယ် roles ကနေမှ inherit (အမွေဆက်ခံ) လုပ်မခံရပါဘူး။

[အပိုင်း 5.8](/docs/postgresql/ddl-priv) မှာ ရှင်းပြထားသလို — object type တစ်ခုခုအတွက် default privileges တွေက ပုံမှန်အားဖြင့် — grant လုပ်လို့ရတဲ့ permissions တွေ အားလုံးကို object ရဲ့ owner (ပိုင်ရှင်) ဆီ ပေးအပ်ပြီး — `PUBLIC` ဆီကိုလည်း privileges တချို့ ပေးအပ်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒီ အပြုအမူကို `ALTER DEFAULT PRIVILEGES` နဲ့ global default privileges တွေကို ပြောင်းလဲခြင်းအားဖြင့် ပြောင်းလဲနိုင်ပါတယ်။

လောလောဆယ် — schemas, tables (views နဲ့ foreign tables တွေ အပါအဝင်), sequences, functions, types (domains တွေ အပါအဝင်) နဲ့ large objects တွေရဲ့ privileges တွေကိုပဲ ပြောင်းလဲလို့ ရပါတယ်။ ဒီ command မှာ functions ဆိုတာထဲမှာ aggregates နဲ့ procedures တွေလည်း ပါဝင်ပါတယ်။ ဒီ command ထဲမှာ `FUNCTIONS` နဲ့ `ROUTINES` ဆိုတဲ့ စကားလုံးတွေက ညီမျှပါတယ်။ (`ROUTINES` ကိုတော့ — functions နဲ့ procedures တွေကို အတူတကွ ခေါ်ဆိုတဲ့ standard term အနေနဲ့ — ရှေ့ဆက်သွားဖို့ ဦးစားပေးပါတယ်။ PostgreSQL ရဲ့ အစောပိုင်း ဗားရှင်းတွေမှာ `FUNCTIONS` ဆိုတဲ့ စကားလုံးကိုပဲ ခွင့်ပြုခဲ့ပါတယ်။ Functions နဲ့ procedures တွေအတွက် default privileges တွေကို သီးခြားစီ သတ်မှတ်လို့တော့ မရပါဘူး။)

Schema အလိုက် (per-schema) သတ်မှတ်ထားတဲ့ default privileges တွေက — သက်ဆိုင်ရာ object type အတွက် ရှိနေတဲ့ global default privileges တွေအပေါ်ကို ထပ်ပေါင်း ထည့်သွင်းလိုက်တာ ဖြစ်ပါတယ်။ ဆိုလိုတာက — သင်က global အနေနဲ့ grant လုပ်ထားတဲ့ privileges တွေကို (default အရ ဖြစ်ဖြစ် — schema တစ်ခုကို သတ်မှတ်မထားတဲ့ အရင် `ALTER DEFAULT PRIVILEGES` command တစ်ခုအရ ဖြစ်ဖြစ်) — schema တစ်ခုအတွက် revoke လုပ်လို့ မရပါဘူး။ Per-schema `REVOKE` က — အရင် per-schema `GRANT` တစ်ခုရဲ့ သက်ရောက်မှုတွေကို ပြန်ပြင် (reverse) ဖို့အတွက်ပဲ အသုံးဝင်ပါတယ်။

### Parameters (parameter များ)

- **target_role** — target_role က ဖန်တီးတဲ့ objects တွေအတွက် default privileges တွေကို ပြောင်းလဲပါတယ်; သတ်မှတ်မထားဘူးဆိုရင် — current role အတွက် ဖြစ်ပါတယ်။
- **schema_name** — ရှိပြီးသား schema တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ သတ်မှတ်ထားရင် — အဲဒီ schema ထဲမှာ နောက်ပိုင်း ဖန်တီးခံရမယ့် objects တွေအတွက် default privileges တွေကို ပြောင်းလဲပါတယ်။ IN SCHEMA ကို ချန်လိုက်ရင် — global default privileges တွေကို ပြောင်းလဲပါတယ်။ Schemas တွေက nested (အထပ်လိုက် ထည့်သွင်းခြင်း) မဖြစ်နိုင်ပြီး — large objects တွေက schema တစ်ခုနဲ့ သက်ဆိုင်မှု မရှိတာမို့ — schemas နဲ့ large objects တွေအတွက် privileges တွေ သတ်မှတ်တဲ့အခါ IN SCHEMA ကို ခွင့်မပြုပါဘူး။
- **role_name** — privileges တွေ grant ဒါမှမဟုတ် revoke လုပ်ရမယ့် ရှိပြီးသား role တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ ဒီ parameter ရော — abbreviated_grant_or_revoke ထဲက တခြား parameters တွေ အားလုံးရော — GRANT ဒါမှမဟုတ် REVOKE အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း ပြုမူပါတယ်; ကွာခြားချက်က — တိကျတဲ့ နာမည်ပေးထားတဲ့ objects တွေ မဟုတ်ဘဲ — object တစ်မျိုးလုံး (a whole class of objects) အတွက် permissions တွေ သတ်မှတ်နေတာ ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

ရှိပြီးသား default privileges သတ်မှတ်ချက်တွေအကြောင်း အချက်အလက် ရယူဖို့ [psql](https://www.postgresql.org/docs/current/app-psql.html) ရဲ့ `\ddp` command ကို သုံးပါ။ Privilege display ရဲ့ အဓိပ္ပါယ်က [အပိုင်း 5.8](/docs/postgresql/ddl-priv) မှာ `\dp` အတွက် ရှင်းပြထားတာနဲ့ အတူတူပါပဲ။

Default privileges တွေကို ပြောင်းလဲထားတဲ့ role တစ်ခုကို drop လုပ်ချင်တယ်ဆိုရင် — သူ့ရဲ့ default privileges တွေထဲက ပြောင်းလဲမှုတွေကို ပြန်ပြင် (reverse) ဖို့ ဒါမှမဟုတ် — role အတွက် default privileges entry ကို ဖယ်ရှားဖို့ `DROP OWNED BY` ကို သုံးဖို့ လိုအပ်ပါတယ်။

## Examples (ဥပမာများ)

မင်း နောက်ပိုင်း `myschema` schema ထဲမှာ ဖန်တီးမယ့် tables (နဲ့ views) တွေ အားလုံးအတွက် SELECT privilege ကို လူတိုင်းဆီ grant လုပ်ပြီး — role `webuser` ကိုလည်း အဲဒီထဲကို INSERT လုပ်ခွင့် ပေးချင်တယ်ဆိုရင်:

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA myschema GRANT SELECT ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA myschema GRANT INSERT ON TABLES TO webuser;
```

အပေါ်က လုပ်ချက်တွေကို ပြန်ဖျက်ပြီး — နောက်ပိုင်း ဖန်တီးခံရမယ့် tables တွေမှာ သာမန်ထက် ပိုတဲ့ permissions တွေ ဘာမှ မရှိတော့အောင် လုပ်ဖို့:

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA myschema REVOKE SELECT ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA myschema REVOKE INSERT ON TABLES FROM webuser;
```

Role `admin` က နောက်ပိုင်း ဖန်တီးမယ့် functions တွေ အားလုံးအတွက် — functions တွေပေါ်မှာ ပုံမှန် grant လုပ်ထားတဲ့ public EXECUTE permission ကို ဖယ်ရှားဖို့:

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE admin REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
```

ဒါပေမယ့် — schema တစ်ခုတည်းကို ကန့်သတ်ထားတဲ့ command တစ်ခုနဲ့တော့ အဲဒီ သက်ရောက်မှုကို မရနိုင်ဘူးဆိုတာ သတိပြုပါ။ ဒီ command က — ကိုက်ညီတဲ့ (matching) `GRANT` တစ်ခုကို ပြန်ဖျက်နေတာ မဟုတ်ရင် — ဘာ အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး:

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
```

အကြောင်းကတော့ per-schema default privileges တွေက global setting ဆီ privileges တွေကို ထပ်ပေါင်းရုံပဲ လုပ်နိုင်ပြီး — အဲဒီကနေ ပေးအပ်ထားတဲ့ privileges တွေကို ဖယ်ရှားလို့ မရလို့ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER DEFAULT PRIVILEGES` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[GRANT](/docs/postgresql/sql-grant), [REVOKE](/docs/postgresql/sql-revoke)
