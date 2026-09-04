---
title: "GRANT (privileges များ ပေးအပ်ခြင်း)"
description: "Database objects (table, column, view, sequence, database, function, schema, type စသည်) များပေါ်က privileges များကို roles များဆီ ပေးအပ်ခြင်းနှင့် role membership ပေးအပ်ခြင်း — object type အလိုက် GRANT syntax များ၊ WITH GRANT OPTION, GRANTED BY, ADMIN/INHERIT/SET option များအကြောင်း ရှင်းလင်းချက်"
order: 172
source: "https://www.postgresql.org/docs/current/sql-grant.html"
status: translated
updated: 2026-09-04
---

## GRANT (privileges များ ပေးအပ်ခြင်း)

GRANT — access privileges (ဝင်ရောက် အသုံးပြုခွင့်များ) ကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
GRANT { { SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES | TRIGGER | MAINTAIN }
    [, ...] | ALL [ PRIVILEGES ] }
    ON { [ TABLE ] table_name [, ...]
         | ALL TABLES IN SCHEMA schema_name [, ...] }
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { { SELECT | INSERT | UPDATE | REFERENCES } ( column_name [, ...] )
    [, ...] | ALL [ PRIVILEGES ] ( column_name [, ...] ) }
    ON [ TABLE ] table_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { { USAGE | SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON { SEQUENCE sequence_name [, ...]
         | ALL SEQUENCES IN SCHEMA schema_name [, ...] }
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { { CREATE | CONNECT | TEMPORARY | TEMP } [, ...] | ALL [ PRIVILEGES ] }
    ON DATABASE database_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON DOMAIN domain_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON FOREIGN DATA WRAPPER fdw_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON FOREIGN SERVER server_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { EXECUTE | ALL [ PRIVILEGES ] }
    ON { { FUNCTION | PROCEDURE | ROUTINE } routine_name [ ( [ [ argmode ] [ arg_name ] arg_type [, ...] ] ) ] [, ...]
         | ALL { FUNCTIONS | PROCEDURES | ROUTINES } IN SCHEMA schema_name [, ...] }
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON LANGUAGE lang_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { { SELECT | UPDATE } [, ...] | ALL [ PRIVILEGES ] }
    ON LARGE OBJECT loid [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { { SET | ALTER SYSTEM } [, ... ] | ALL [ PRIVILEGES ] }
    ON PARAMETER configuration_parameter [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { { CREATE | USAGE } [, ...] | ALL [ PRIVILEGES ] }
    ON SCHEMA schema_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { CREATE | ALL [ PRIVILEGES ] }
    ON TABLESPACE tablespace_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON TYPE type_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]
    [ GRANTED BY role_specification ]

GRANT role_name [, ...] TO role_specification [, ...]
    [ WITH { ADMIN | INHERIT | SET } { OPTION | TRUE | FALSE } ]
    [ GRANTED BY role_specification ]

where role_specification can be:

    [ GROUP ] role_name
  | PUBLIC
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`GRANT` command မှာ အခြေခံ variant (ပုံစံကွဲ) နှစ်မျိုး ရှိပါတယ်: တစ်မျိုးက database object (table, column, view, foreign table, sequence, database, foreign-data wrapper, foreign server, function, procedure, procedural language, large object, configuration parameter, schema, tablespace ဒါမှမဟုတ် type) တစ်ခုပေါ်မှာ privileges တွေ ပေးအပ်တာ ဖြစ်ပြီး — နောက်တစ်မျိုးက role တစ်ခုထဲမှာ membership (အဖွဲ့ဝင် ဖြစ်မှု) ပေးအပ်တာ ဖြစ်ပါတယ်။ ဒီ variant နှစ်မျိုးက နည်းလမ်းများစွာနဲ့ ဆင်တူပေမယ့် — သီးခြားစီ ဖော်ပြသင့်လောက်အောင် ကွဲပြားပါတယ်။

### GRANT on Database Objects (database objects များပေါ်တွင် GRANT ပြုလုပ်ခြင်း)

`GRANT` command ရဲ့ ဒီ variant က database object တစ်ခုပေါ်က သီးခြား privileges တွေကို role တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေဆီ ပေးအပ်ပါတယ်။ ဒီ privileges တွေက — ရှိပြီးသား ပေးအပ်ထားတဲ့ privileges တွေ ရှိခဲ့ရင် — အဲဒါတွေအပေါ်ကို ထပ်ပေါင်း ထည့်သွင်းလိုက်တာ ဖြစ်ပါတယ်။

`PUBLIC` ဆိုတဲ့ key word က — နောက်ပိုင်းမှာ ဖန်တီးခံရမယ့် roles တွေ အပါအဝင် — roles အားလုံးဆီ privileges တွေကို ပေးအပ်ရမယ်လို့ ညွှန်ပြပါတယ်။ `PUBLIC` ကို roles တွေ အားလုံးကို အမြဲ ပါဝင်စေတဲ့ — သွယ်ဝိုက်၍ သတ်မှတ်ထားတဲ့ (implicitly defined) group တစ်ခုလို မှတ်ယူနိုင်ပါတယ်။ Role တစ်ခုခုမှာ — သူ့ဆီ တိုက်ရိုက် ပေးအပ်ထားတဲ့ privileges တွေ၊ သူ လက်ရှိ အဖွဲ့ဝင် ဖြစ်နေတဲ့ role တစ်ခုခုဆီ ပေးအပ်ထားတဲ့ privileges တွေ နဲ့ `PUBLIC` ဆီ ပေးအပ်ထားတဲ့ privileges တွေရဲ့ ပေါင်းလဒ် အားလုံးကို ရရှိပါလိမ့်မယ်။

`WITH GRANT OPTION` ကို သတ်မှတ်ထားရင် — privilege ရရှိသူ (recipient) က အဲဒီ privilege ကို တခြားသူတွေဆီ ထပ်ဆင့် ပေးအပ်နိုင်ပါတယ်။ Grant option မပါရင် — recipient က အဲဒီလို မလုပ်နိုင်ပါဘူး။ Grant options တွေကိုတော့ `PUBLIC` ဆီ ပေးအပ်လို့ မရပါဘူး။

`GRANTED BY` ကို သတ်မှတ်ထားရင် — သတ်မှတ်ထားတဲ့ grantor (privilege ပေးအပ်သူ) က current user ဖြစ်ရပါမယ်။ ဒီ clause က လောလောဆယ် — SQL နဲ့ လိုက်ဖက်ညီမှု (compatibility) အတွက်ပဲ — ဒီပုံစံနဲ့ ပါဝင်နေတာ ဖြစ်ပါတယ်။

Object တစ်ခုရဲ့ owner (ပိုင်ရှင် — ပုံမှန်အားဖြင့် အဲဒါကို ဖန်တီးခဲ့တဲ့ user) ဆီ privileges တွေ ပေးအပ်ဖို့ မလိုအပ်ပါဘူး — အကြောင်းကတော့ owner မှာ default အနေနဲ့ privileges တွေ အားလုံး ရှိပြီးသားမို့ပါ။ (ဒါပေမယ့် owner က လုံခြုံရေး အတွက် — သူ့ရဲ့ privileges တချို့ကို revoke (ပြန်ရုတ်သိမ်း) လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။)

Object တစ်ခုကို drop လုပ်ပိုင်ခွင့် ဒါမှမဟုတ် သူ့ရဲ့ definition (သတ်မှတ်ချက်) ကို ဘယ်နည်းနဲ့မဆို ပြောင်းလဲပိုင်ခွင့်ကိုတော့ grant လုပ်လို့ရတဲ့ privilege အဖြစ် မသတ်မှတ်ပါဘူး; အဲဒါက owner မှာ မွေးရာပါ (inherent) ရှိတာဖြစ်ပြီး — grant လည်း လုပ်လို့ မရသလို revoke လည်း လုပ်လို့ မရပါဘူး။ (ဒါပေမယ့် — object ကို ပိုင်ဆိုင်တဲ့ role ထဲက membership ကို grant ဒါမှမဟုတ် revoke လုပ်ခြင်းအားဖြင့် — အလားတူ သက်ရောက်မှုတစ်ခုကို ရရှိနိုင်ပါတယ်; အောက်မှာ ကြည့်ပါ။) Owner မှာ object အတွက် grant options တွေ အားလုံးလည်း သွယ်ဝိုက်၍ ရှိပါတယ်။

ဖြစ်နိုင်တဲ့ privileges တွေကတော့:

- **SELECT**, **INSERT**, **UPDATE**, **DELETE**, **TRUNCATE**, **REFERENCES**, **TRIGGER**, **CREATE**, **CONNECT**, **TEMPORARY**, **EXECUTE**, **USAGE**, **SET**, **ALTER SYSTEM**, **MAINTAIN** — အပိုင်း 5.8 မှာ သတ်မှတ်ထားတဲ့အတိုင်း — တိကျတဲ့ privilege အမျိုးအစားများ ဖြစ်ပါတယ်။
- **TEMP** — TEMPORARY အတွက် အခြား စာလုံးပေါင်း တစ်မျိုး။
- **ALL PRIVILEGES** — Object ရဲ့ type အတွက် ရရှိနိုင်တဲ့ privileges တွေ အားလုံးကို ပေးအပ်ပါတယ်။ PostgreSQL မှာ `PRIVILEGES` key word က optional ဖြစ်ပေမယ့် — တင်းကျပ်တဲ့ SQL မှာတော့ မဖြစ်မနေ လိုအပ်ပါတယ်။

`FUNCTION` syntax က plain functions, aggregate functions နဲ့ window functions တွေအတွက် အလုပ်လုပ်ပြီး — procedures တွေအတွက်တော့ မဟုတ်ပါဘူး; အဲဒါတွေအတွက် `PROCEDURE` ကို သုံးပါ။ တနည်းအားဖြင့် — function, aggregate function, window function ဒါမှမဟုတ် procedure တစ်ခုခုကို — သူ့ရဲ့ တိကျတဲ့ type မသက်ဆိုင်ဘဲ ရည်ညွှန်းဖို့ဆိုရင် — `ROUTINE` ကို သုံးနိုင်ပါတယ်။

Schema တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ schemas တွေအတွင်းမှာ — type တူညီတဲ့ objects တွေ အားလုံးပေါ်ကို privileges တွေ ပေးအပ်ဖို့ option တစ်ခုလည်း ရှိပါတယ်။ ဒီ လုပ်ဆောင်ချက်ကို လောလောဆယ် — tables, sequences, functions နဲ့ procedures တွေအတွက်ပဲ ထောက်ပံ့ပါတယ်။ `ALL TABLES` က — specific-object `GRANT` command လိုပဲ — views နဲ့ foreign tables တွေကိုပါ သက်ရောက်ပါတယ်။ `ALL FUNCTIONS` ကလည်း — specific-object `GRANT` command လိုပဲ — aggregate နဲ့ window functions တွေကို သက်ရောက်ပေမယ့် — procedures တွေကိုတော့ မသက်ရောက်ပါဘူး။ Procedures တွေ ပါဝင်စေချင်ရင် `ALL ROUTINES` ကို သုံးပါ။

### GRANT on Roles (role membership ပေးအပ်ခြင်း)

`GRANT` command ရဲ့ ဒီ variant က — role တစ်ခုထဲမှာ membership ကို တခြား role တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေဆီ ပေးအပ်ပြီး — membership options တွေဖြစ်တဲ့ `SET`, `INHERIT` နဲ့ `ADMIN` တွေကိုလည်း ပြုပြင်မွမ်းမံပေးပါတယ်; အသေးစိတ်အတွက် [အပိုင်း 21.3](https://www.postgresql.org/docs/current/role-membership.html) ကို ကြည့်ပါ။ Role တစ်ခုထဲမှာ membership ရှိတာက — အဲဒီ role ဆီ ပေးအပ်ထားတဲ့ privileges တွေကို အဖွဲ့ဝင် တစ်ဦးစီက ဝင်ရောက် သုံးစွဲနိုင်ခြေ ရှိစေပြီး — role ကိုယ်တိုင်ကိုလည်း ပြောင်းလဲမှုတွေ လုပ်နိုင်ခြေ ရှိစေလို့ — အရေးပါပါတယ်။ ဒါပေမယ့် — တကယ်တမ်း ပေးအပ်ခံရတဲ့ permissions တွေက grant နဲ့ ဆက်စပ်နေတဲ့ options တွေပေါ်မှာ မူတည်ပါတယ်။ ရှိပြီးသား membership တစ်ခုရဲ့ options တွေကို ပြုပြင်ဖို့ဆိုရင် — updated option values တွေနဲ့အတူ membership ကို ရိုးရိုး သတ်မှတ်ပေးရုံပါပဲ။

အောက်မှာ ဖော်ပြထားတဲ့ options တစ်ခုချင်းစီကို `TRUE` ဒါမှမဟုတ် `FALSE` ဆိုပြီး သတ်မှတ်နိုင်ပါတယ်။ `OPTION` ဆိုတဲ့ keyword ကို `TRUE` ရဲ့ synonym (ထပ်တူ စကားလုံး) အဖြစ် လက်ခံပါတယ် — ဒါကြောင့် `WITH ADMIN OPTION` က `WITH ADMIN TRUE` ရဲ့ synonym ဖြစ်ပါတယ်။ ရှိပြီးသား membership တစ်ခုကို ပြုပြင်တဲ့အခါ — option တစ်ခုကို ချန်လိုက်တာက — လက်ရှိ တန်ဖိုးကို ဆက်ထိန်းထားတယ်လို့ ဆိုလိုပါတယ်။

`ADMIN` option က — အဖွဲ့ဝင်ကို role ထဲမှာ membership ကို တခြားသူတွေဆီ ထပ်ဆင့် ပေးအပ်နိုင်သလို — role ထဲက membership ကိုလည်း revoke လုပ်နိုင်စေပါတယ်။ Admin option မရှိရင် — သာမန် user တွေ အဲဒီလို မလုပ်နိုင်ပါဘူး။ Role တစ်ခုက သူ့ကိုယ်သူအပေါ်မှာ `WITH ADMIN OPTION` ကိုင်ထားတာအဖြစ်တော့ မသတ်မှတ်ပါဘူး။ Database superusers တွေကတော့ ဘယ် role ထဲမှာမဆို membership ကို ဘယ်သူ့ကိုမဆို grant ဒါမှမဟုတ် revoke လုပ်နိုင်ပါတယ်။ ဒီ option က default အနေနဲ့ `FALSE` ဖြစ်ပါတယ်။

`INHERIT` option က membership အသစ်ရဲ့ inheritance (အမွေဆက်ခံမှု) အခြေအနေကို ထိန်းချုပ်ပါတယ်; inheritance အကြောင်း အသေးစိတ်အတွက် [အပိုင်း 21.3](https://www.postgresql.org/docs/current/role-membership.html) ကို ကြည့်ပါ။ `TRUE` လို့ သတ်မှတ်ထားရင် — အဖွဲ့ဝင်အသစ်က grant လုပ်ထားတဲ့ role ကနေ inherit လုပ်စေပါတယ်။ `FALSE` လို့ သတ်မှတ်ထားရင် — အဖွဲ့ဝင်အသစ်က inherit မလုပ်ပါဘူး။ Role membership အသစ်တစ်ခု ဖန်တီးတဲ့အခါ — မသတ်မှတ်ထားဘူးဆိုရင် — အဖွဲ့ဝင်အသစ်ရဲ့ inheritance attribute ကို default အဖြစ် သုံးပါတယ်။

`SET` option က — `TRUE` လို့ သတ်မှတ်ထားရင် — အဖွဲ့ဝင်ကို [`SET ROLE`](/docs/postgresql/sql-set-role) command သုံးပြီး grant လုပ်ထားတဲ့ role အဖြစ် ပြောင်းလဲခွင့် ပေးပါတယ်။ Role တစ်ခုက တခြား role တစ်ခုရဲ့ indirect member (သွယ်ဝိုက် အဖွဲ့ဝင်) ဖြစ်နေရင် — grant တစ်ခုချင်းစီတိုင်းမှာ `SET TRUE` ပါဝင်တဲ့ grant ကွင်းဆက် (chain) တစ်ခု ရှိနေမှသာ — `SET ROLE` ကို သုံးပြီး အဲဒီ role အဖြစ် ပြောင်းလဲနိုင်ပါတယ်။ ဒီ option က default အနေနဲ့ `TRUE` ဖြစ်ပါတယ်။

တခြား role တစ်ခုက ပိုင်ဆိုင်တဲ့ object တစ်ခုကို ဖန်တီးဖို့ ဒါမှမဟုတ် ရှိပြီးသား object တစ်ခုရဲ့ ပိုင်ဆိုင်မှုကို တခြား role တစ်ခုဆီ ပေးအပ်ဖို့ဆိုရင် — အဲဒီ role အဖြစ် `SET ROLE` လုပ်နိုင်စွမ်း ရှိရပါမယ်; မရှိရင် — `ALTER ... OWNER TO` ဒါမှမဟုတ် `CREATE DATABASE ... OWNER` လို commands တွေ မအောင်မြင်ပါဘူး။ ဒါပေမယ့် — role တစ်ခုရဲ့ privileges တွေကို inherit လုပ်ပေမယ့် — အဲဒီ role အဖြစ် `SET ROLE` လုပ်နိုင်စွမ်း မရှိတဲ့ user တစ်ယောက်က — အဲဒီ role က ပိုင်ဆိုင်ထားတဲ့ ရှိပြီးသား objects တွေကို ကြိုးကိုင် ခြယ်လှယ်ခြင်းအားဖြင့် (ဥပမာ — ရှိပြီးသား function တစ်ခုကို Trojan horse အဖြစ် ပြန်လည် သတ်မှတ်နိုင်တာ) — role ရဲ့ အပြည့်အဝ ဝင်ရောက်ခွင့်ကို ရရှိသွားနိုင်ပါတယ်။ ဒါကြောင့် — role တစ်ခုရဲ့ privileges တွေကို inherit လုပ်စေချင်ပေမယ့် — `SET ROLE` ကနေတစ်ဆင့် ဝင်ရောက်လို့ မရစေချင်ဘူးဆိုရင် — အဲဒီ role က SQL objects တွေကို ဘာမှ မပိုင်ဆိုင်သင့်ပါဘူး။

`GRANTED BY` ကို သတ်မှတ်ထားရင် — grant ကို သတ်မှတ်ထားတဲ့ role က လုပ်ခဲ့တာလို့ မှတ်တမ်းတင်ပါတယ်။ User တစ်ယောက်က — အဲဒီ role ရဲ့ privileges တွေကို ကိုင်ထားမှသာ — grant တစ်ခုကို တခြား role တစ်ခုရဲ့ အမည်နဲ့ မှတ်တမ်းတင်နိုင်ပါတယ်။ Grantor အဖြစ် မှတ်တမ်းတင်တဲ့ role က — bootstrap superuser မဟုတ်ရင် — target role အပေါ်မှာ `ADMIN OPTION` ရှိရပါမယ်။ Grant တစ်ခုကို bootstrap superuser မဟုတ်တဲ့ grantor တစ်ယောက်ရဲ့ အမည်နဲ့ မှတ်တမ်းတင်တဲ့အခါ — grantor က role အပေါ်မှာ `ADMIN OPTION` ဆက်ပြီး ကိုင်ထားတာပေါ်မှာ မှီခိုပါတယ်; ဒါကြောင့် — `ADMIN OPTION` ကို revoke လုပ်လိုက်ရင် — မှီခိုနေတဲ့ (dependent) grants တွေကိုပါ revoke လုပ်ရပါမယ်။

Privileges တွေနဲ့ မတူတာက — role တစ်ခုထဲမှာ membership ကိုတော့ `PUBLIC` ဆီ grant လုပ်လို့ မရပါဘူး။ ဒီ command ရဲ့ ဒီပုံစံမှာ `role_specification` ထဲမှာ noise word (အဓိပ္ပါယ် မသက်ရောက်တဲ့ စကားလုံး) ဖြစ်တဲ့ `GROUP` ကို ခွင့်မပြုဘူးဆိုတာလည်း သတိပြုပါ။

## Notes (မှတ်စုများ)

Access privileges တွေကို revoke လုပ်ဖို့ [`REVOKE`](/docs/postgresql/sql-revoke) command ကို သုံးပါတယ်။

PostgreSQL 8.1 ကစပြီး — users နဲ့ groups တွေရဲ့ concept တွေကို role လို့ ခေါ်တဲ့ entity အမျိုးအစား တစ်ခုတည်းအဖြစ် ပေါင်းစည်းလိုက်ပါပြီ။ ဒါကြောင့် — grantee (privilege လက်ခံရရှိသူ) က user လား group လား ခွဲခြားဖို့ `GROUP` keyword ကို သုံးဖို့ မလိုအပ်တော့ပါဘူး။ `GROUP` ကို command ထဲမှာ ခွင့်ပြုနေဆဲ ဖြစ်ပေမယ့် — noise word တစ်ခုပဲ ဖြစ်ပါတယ်။

User တစ်ယောက်က — သီးခြား column တစ်ခုအတွက် ဒါမှမဟုတ် အဲဒီ column ပါတဲ့ table တစ်ခုလုံးအတွက် privilege တစ်ခုကို ကိုင်ထားရင် — အဲဒီ column ပေါ်မှာ `SELECT`, `INSERT` စတာတွေကို လုပ်ဆောင်နိုင်ပါတယ်။ Table အဆင့်မှာ privilege ကို grant လုပ်ပြီး — နောက်မှ column တစ်ခုအတွက် revoke လုပ်တာက — လူတွေ မျှော်လင့်သလို အလုပ်လုပ်မှာ မဟုတ်ပါဘူး: table-level grant က column-level operation တစ်ခုရဲ့ သက်ရောက်မှု မခံရပါဘူး။

Object တစ်ခုရဲ့ owner မဟုတ်တဲ့သူတစ်ယောက်က အဲဒီ object ပေါ်မှာ privileges တွေ `GRANT` လုပ်ဖို့ ကြိုးစားတဲ့အခါ — အဲဒီ user မှာ object အပေါ်မှာ privilege လုံးဝ မရှိဘူးဆိုရင် — command က ချက်ချင်း မအောင်မြင်ပါဘူး။ Privilege တစ်ခုခု ရနေသရွေ့တော့ — command က ဆက်လုပ်ပါတယ် — ဒါပေမယ့် user မှာ grant options ရှိတဲ့ privileges တွေကိုပဲ ပေးအပ်ပါလိမ့်မယ်။ `GRANT ALL PRIVILEGES` ပုံစံတွေက — grant options တွေ ဘာမှ မကိုင်ထားဘူးဆိုရင် — warning message တစ်ခု ထုတ်ပေးပြီး — တခြား ပုံစံတွေကတော့ — command ထဲမှာ နာမည် ပေးထားတဲ့ privileges တွေထဲက တစ်ခုခုအတွက် grant options တွေ မကိုင်ထားဘူးဆိုရင် — warning တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။ (သဘောတရားအရ ဒီ ဖော်ပြချက်တွေက object owner အတွက်လည်း သက်ရောက်ပေမယ့် — owner ကို grant options တွေ အားလုံး ကိုင်ထားတာအဖြစ် အမြဲ သတ်မှတ်လို့ — ဒီ ဖြစ်ရပ်တွေ ဘယ်တော့မှ မဖြစ်နိုင်ပါဘူး။)

Database superusers တွေက object privilege settings တွေ ဘယ်လိုပဲ ရှိရှိ — objects တွေ အားလုံးကို ဝင်ရောက် သုံးစွဲနိုင်တယ်ဆိုတာ သတိပြုသင့်ပါတယ်။ ဒါက Unix system ထဲက `root` ရဲ့ အခွင့်အရေးတွေနဲ့ နှိုင်းယှဉ်လို့ ရပါတယ်။ `root` လိုပဲ — တကယ် လိုအပ်တဲ့ အချိန်ကလွဲလို့ — superuser အဖြစ် လည်ပတ်တာက မလိမ္မာပါဘူး။

Superuser တစ်ယောက်က `GRANT` ဒါမှမဟုတ် `REVOKE` command တစ်ခုကို ထုတ်ပြန်ဖို့ ရွေးချယ်ရင် — command ကို — သက်ရောက်ခံရတဲ့ object ရဲ့ owner က ထုတ်ပြန်လိုက်သလိုမျိုး — လုပ်ဆောင်ပါတယ်။ အထူးသဖြင့် — ဒီလို command တစ်ခုကနေတစ်ဆင့် ပေးအပ်လိုက်တဲ့ privileges တွေက object owner က ပေးအပ်လိုက်တာလို့ ပေါ်လာပါလိမ့်မယ်။ (Role membership အတွက်ကတော့ — membership ကို bootstrap superuser က ပေးအပ်လိုက်တာလို့ ပေါ်လာပါတယ်။)

`GRANT` နဲ့ `REVOKE` တွေကို — သက်ရောက်ခံရတဲ့ object ရဲ့ owner မဟုတ်ပေမယ့် — object ကို ပိုင်ဆိုင်တဲ့ role ရဲ့ အဖွဲ့ဝင် ဒါမှမဟုတ် — object အပေါ်မှာ `WITH GRANT OPTION` နဲ့ privileges တွေ ကိုင်ထားတဲ့ role တစ်ခုရဲ့ အဖွဲ့ဝင် ဖြစ်နေတဲ့ role တစ်ခုကလည်း လုပ်ဆောင်နိုင်ပါတယ်။ ဒီကိစ္စမှာ — privileges တွေကို — object ကို တကယ် ပိုင်ဆိုင်တဲ့ role ဒါမှမဟုတ် `WITH GRANT OPTION` နဲ့ privileges တွေ ကိုင်ထားတဲ့ role က ပေးအပ်လိုက်တာလို့ မှတ်တမ်းတင်ပါလိမ့်မယ်။ ဥပမာ — table `t1` ကို role `g1` က ပိုင်ဆိုင်ပြီး — `u1` က `g1` ရဲ့ အဖွဲ့ဝင် ဖြစ်နေရင် — `u1` က `t1` အပေါ်က privileges တွေကို `u2` ဆီ grant လုပ်နိုင်ပါတယ် — ဒါပေမယ့် အဲဒီ privileges တွေက `g1` က တိုက်ရိုက် ပေးအပ်လိုက်တာလို့ ပေါ်လာပါလိမ့်မယ်။ `g1` role ရဲ့ တခြား အဖွဲ့ဝင် တစ်ယောက်ယောက်က နောက်ပိုင်းမှာ အဲဒါတွေကို revoke လုပ်နိုင်ပါတယ်။

`GRANT` ကို execute လုပ်နေတဲ့ role က — လိုအပ်တဲ့ privileges တွေကို role membership path တစ်ခုထက်ပိုတဲ့ နည်းလမ်းတွေကနေတစ်ဆင့် သွယ်ဝိုက်၍ ကိုင်ထားရင် — ဘယ် ပါဝင်နေတဲ့ (containing) role က grant လုပ်လိုက်တာလို့ မှတ်တမ်းတင်မလဲဆိုတာ သတ်မှတ်မထားပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ — `GRANT` ကို ဘယ် သီးခြား role အနေနဲ့ လုပ်ချင်တယ်ဆိုရင် — အဲဒီ role ဖြစ်ဖို့ `SET ROLE` ကို သုံးတာက အကောင်းဆုံး လုပ်ရိုးလုပ်စဉ် (best practice) ဖြစ်ပါတယ်။

Table တစ်ခုပေါ်မှာ permission ပေးအပ်တာက — `SERIAL` columns တွေနဲ့ ချိတ်ဆက်ထားတဲ့ sequences တွေ အပါအဝင် — table က သုံးနေတဲ့ sequences တွေဆီကိုပါ အလိုအလျောက် သက်ရောက်မှု မရှိပါဘူး။ Sequences တွေပေါ်က permissions တွေကို သီးခြားစီ သတ်မှတ်ရပါမယ်။

သီးခြား privilege အမျိုးအစားတွေအကြောင်း နဲ့ objects တွေရဲ့ privileges တွေကို ဘယ်လို စစ်ဆေးရမလဲဆိုတဲ့ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 5.8](/docs/postgresql/ddl-priv) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`films` table ပေါ်မှာ insert privilege ကို user အားလုံးဆီ grant လုပ်ဖို့:

```sql
GRANT INSERT ON films TO PUBLIC;
```

`kinds` view ပေါ်မှာ ရရှိနိုင်တဲ့ privileges တွေ အားလုံးကို user `manuel` ဆီ grant လုပ်ဖို့:

```sql
GRANT ALL PRIVILEGES ON kinds TO manuel;
```

အပေါ်က command က — superuser ဒါမှမဟုတ် `kinds` ရဲ့ owner က execute လုပ်ရင် — privileges တွေ အားလုံးကို တကယ် ပေးအပ်မှာ ဖြစ်ပေမယ့် — တခြားသူတစ်ယောက်က execute လုပ်ရင်တော့ — အဲဒီသူမှာ grant options ရှိတဲ့ permissions တွေကိုပဲ ပေးအပ်မယ်ဆိုတာ သတိပြုပါ။

Role `admins` ထဲမှာ membership ကို user `joe` ဆီ grant လုပ်ဖို့:

```sql
GRANT admins TO joe;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard အရ — `ALL PRIVILEGES` ထဲက `PRIVILEGES` key word က မဖြစ်မနေ လိုအပ်ပါတယ်။ SQL standard က command တစ်ခုမှာ object တစ်ခုထက်ပိုပေါ်ကို privileges တွေ သတ်မှတ်တာကို ထောက်ပံ့မထားပါဘူး။

PostgreSQL က object owner တစ်ယောက်ကို — သူ့ရဲ့ ကိုယ်ပိုင် သာမန် privileges တွေကို revoke လုပ်ခွင့် ပြုပါတယ်: ဥပမာ — table owner တစ်ယောက်က — သူ့ရဲ့ ကိုယ်ပိုင် `INSERT`, `UPDATE`, `DELETE` နဲ့ `TRUNCATE` privileges တွေကို revoke လုပ်ခြင်းအားဖြင့် — table ကို ကိုယ့်အတွက် read-only ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ SQL standard အရတော့ ဒါ မဖြစ်နိုင်ပါဘူး။ အကြောင်းကတော့ PostgreSQL က owner ရဲ့ privileges တွေကို — owner က သူ့ကိုယ်သူ ပေးအပ်ထားတာလို့ သတ်မှတ်လို့ပါ; ဒါကြောင့် — သူတို့ကိုလည်း revoke လုပ်နိုင်ပါတယ်။ SQL standard မှာတော့ owner ရဲ့ privileges တွေကို “_SYSTEM” လို့ ယူဆရတဲ့ entity တစ်ခုက ပေးအပ်ပါတယ်။ “_SYSTEM” မဟုတ်တဲ့အတွက် — owner က ဒီ အခွင့်အရေးတွေကို revoke လုပ်လို့ မရပါဘူး။

SQL standard အရ — grant options တွေကို `PUBLIC` ဆီ grant လုပ်နိုင်ပေမယ့် — PostgreSQL ကတော့ roles တွေဆီကိုပဲ grant options တွေ ပေးအပ်တာကို ထောက်ပံ့ပါတယ်။

SQL standard က `GRANTED BY` option မှာ `CURRENT_USER` ဒါမှမဟုတ် `CURRENT_ROLE` ကိုပဲ သတ်မှတ်ခွင့် ပြုပါတယ်။ တခြား variant တွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

SQL standard က တခြား object အမျိုးအစားတွေဖြစ်တဲ့ character sets, collations နဲ့ translations တွေပေါ်မှာ `USAGE` privilege တစ်ခု ပြဋ္ဌာန်းထားပါတယ်။

SQL standard မှာ — sequences တွေမှာ `USAGE` privilege တစ်ခုပဲ ရှိပြီး — အဲဒါက PostgreSQL မှာ `nextval` function နဲ့ ညီမျှတဲ့ `NEXT VALUE FOR` expression ရဲ့ အသုံးပြုမှုကို ထိန်းချုပ်ပါတယ်။ Sequence privileges တွေဖြစ်တဲ့ `SELECT` နဲ့ `UPDATE` တွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။ Sequence ရဲ့ `USAGE` privilege ကို `currval` function မှာ သက်ရောက်စေတာကလည်း PostgreSQL extension တစ်ခု ဖြစ်ပါတယ် (function ကိုယ်တိုင်လိုပဲ)။

Databases, tablespaces, schemas, languages နဲ့ configuration parameters တွေပေါ်က privileges တွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[REVOKE](/docs/postgresql/sql-revoke), [ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html)
