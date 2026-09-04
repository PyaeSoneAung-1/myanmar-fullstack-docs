---
title: "REVOKE (privileges များ ပြန်ရုပ်သိမ်းခြင်း)"
description: "ပေးအပ်ထားပြီးသား access privileges တွေကို role တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေဆီကနေ ပြန်ရုပ်သိမ်းပေးတဲ့ command — GRANT OPTION FOR (grant option ကိုပဲ revoke လုပ်ခြင်း)၊ CASCADE/RESTRICT (dependent privileges များအထိ ဆင့်ပွား revoke လုပ်ခြင်း)၊ PUBLIC နဲ့ role membership revoke ခြင်း စတာတွေ ပါဝင်"
order: 173
source: "https://www.postgresql.org/docs/current/sql-revoke.html"
status: translated
updated: 2026-09-04
---

## REVOKE (privileges များ ပြန်ရုပ်သိမ်းခြင်း)

REVOKE — access privileges တွေကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
REVOKE [ GRANT OPTION FOR ]
    { { SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES | TRIGGER | MAINTAIN }
    [, ...] | ALL [ PRIVILEGES ] }
    ON { [ TABLE ] table_name [, ...]
         | ALL TABLES IN SCHEMA schema_name [, ...] }
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { SELECT | INSERT | UPDATE | REFERENCES } ( column_name [, ...] )
    [, ...] | ALL [ PRIVILEGES ] ( column_name [, ...] ) }
    ON [ TABLE ] table_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { USAGE | SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON { SEQUENCE sequence_name [, ...]
         | ALL SEQUENCES IN SCHEMA schema_name [, ...] }
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { CREATE | CONNECT | TEMPORARY | TEMP } [, ...] | ALL [ PRIVILEGES ] }
    ON DATABASE database_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { USAGE | ALL [ PRIVILEGES ] }
    ON DOMAIN domain_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { USAGE | ALL [ PRIVILEGES ] }
    ON FOREIGN DATA WRAPPER fdw_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { USAGE | ALL [ PRIVILEGES ] }
    ON FOREIGN SERVER server_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { EXECUTE | ALL [ PRIVILEGES ] }
    ON { { FUNCTION | PROCEDURE | ROUTINE } function_name [ ( [ [ argmode ] [ arg_name ] arg_type [, ...] ] ) ] [, ...]
         | ALL { FUNCTIONS | PROCEDURES | ROUTINES } IN SCHEMA schema_name [, ...] }
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { USAGE | ALL [ PRIVILEGES ] }
    ON LANGUAGE lang_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { SELECT | UPDATE } [, ...] | ALL [ PRIVILEGES ] }
    ON LARGE OBJECT loid [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { SET | ALTER SYSTEM } [, ...] | ALL [ PRIVILEGES ] }
    ON PARAMETER configuration_parameter [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { { CREATE | USAGE } [, ...] | ALL [ PRIVILEGES ] }
    ON SCHEMA schema_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { CREATE | ALL [ PRIVILEGES ] }
    ON TABLESPACE tablespace_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ GRANT OPTION FOR ]
    { USAGE | ALL [ PRIVILEGES ] }
    ON TYPE type_name [, ...]
    FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

REVOKE [ { ADMIN | INHERIT | SET } OPTION FOR ]
    role_name [, ...] FROM role_specification [, ...]
    [ GRANTED BY role_specification ]
    [ CASCADE | RESTRICT ]

where role_specification can be:

    [ GROUP ] role_name
  | PUBLIC
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`REVOKE` command က ယခင် grant လုပ်ထားခဲ့တဲ့ privileges တွေကို role တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေဆီကနေ revoke (ပြန်ရုပ်သိမ်း) လုပ်ပေးပါတယ်။ `PUBLIC` ဆိုတဲ့ အဓိကစကားလုံး (key word) က — roles တွေ အားလုံးရဲ့ implicit (အလိုအလျောက် သတ်မှတ်ပြီးသား) group ကို ရည်ညွှန်းပါတယ်။

Privilege အမျိုးအစားတွေရဲ့ အဓိပ္ပာယ်အတွက် [`GRANT`](/docs/postgresql/sql-grant) command ရဲ့ ဖော်ပြချက်ကို ကြည့်ပါ။

သတိပြုရမှာက — role တစ်ခုခုဟာ — သူ့ဆီ တိုက်ရိုက် grant လုပ်ထားတဲ့ privileges တွေ၊ သူ လက်ရှိ member (အဖွဲ့ဝင်) ဖြစ်နေတဲ့ role တွေဆီ grant လုပ်ထားတဲ့ privileges တွေ၊ ပြီးတော့ `PUBLIC` ဆီ grant လုပ်ထားတဲ့ privileges တွေ — အားလုံးရဲ့ ပေါင်းလဒ်ကို ပိုင်ဆိုင်မှာ ဖြစ်ပါတယ်။ ဒါကြောင့် ဥပမာ — `PUBLIC` ဆီကနေ `SELECT` privilege ကို revoke လုပ်လိုက်တာက — object ပေါ်က `SELECT` privilege ကို roles တိုင်း ဆုံးရှုံးသွားပြီလို့ မဆိုလိုပါဘူး: တိုက်ရိုက် ဒါမှမဟုတ် တခြား role တစ်ခုကတစ်ဆင့် grant ရထားသူတွေမှာ အဲဒီ privilege ရှိနေဦးမှာ ဖြစ်ပါတယ်။ အလားတူပဲ — user တစ်ယောက်ဆီကနေ `SELECT` ကို revoke လုပ်တာက — `PUBLIC` ဒါမှမဟုတ် တခြား membership role တစ်ခုမှာ `SELECT` အခွင့်အရေး ရှိနေသေးရင် — အဲဒီ user က `SELECT` သုံးတာကို တားဆီးနိုင်မှာ မဟုတ်ပါဘူး။

`GRANT OPTION FOR` ကို သတ်မှတ်ထားရင် — privilege ကိုယ်တိုင် မဟုတ်ဘဲ — အဲဒီ privilege အတွက် grant option ကိုပဲ revoke လုပ်ပါတယ်။ သတ်မှတ်မထားရင်တော့ — privilege ရော grant option ပါ နှစ်ခုလုံး revoke လုပ်ခံရပါတယ်။

User တစ်ယောက်က grant option ပါတဲ့ privilege တစ်ခုကို ကိုင်ထားပြီး — အဲဒါကို တခြား users တွေဆီ grant လုပ်ထားရင် — အဲဒီ တခြား users တွေ ကိုင်ထားတဲ့ privileges တွေကို dependent privileges (မှီခို privileges) လို့ ခေါ်ပါတယ်။ ပထမ user က ကိုင်ထားတဲ့ privilege ဒါမှမဟုတ် grant option ကို revoke လုပ်နေပြီး — dependent privileges တွေ ရှိနေရင် — `CASCADE` ကို သတ်မှတ်ထားတယ်ဆိုရင် အဲဒီ dependent privileges တွေကိုပါ revoke လုပ်ပါတယ်; သတ်မှတ်မထားရင်တော့ — revoke လုပ်မှုက မအောင်မြင်ပါဘူး။ ဒီလို recursion သဘောမျိုး revoke လုပ်တာက — ဒီ `REVOKE` command ရဲ့ လက်အောက်ခံ (subject) ဖြစ်တဲ့ user အထိ ခြေရာခံလို့ ရတဲ့ users ကွင်းဆက် (chain) တစ်ခုကတစ်ဆင့် grant လုပ်ခဲ့တဲ့ privileges တွေကိုပဲ သက်ရောက်ပါတယ်။ ဒါကြောင့် — တခြား users တွေကတစ်ဆင့်လည်း grant လုပ်ထားခဲ့ရင် — သက်ရောက်မှု ခံရတဲ့ users တွေမှာ အဲဒီ privilege လက်တွေ့မှာ ကျန်ရှိနေနိုင်ပါတယ်။

Table တစ်ခုပေါ်က privileges တွေကို revoke လုပ်တဲ့အခါ — သက်ဆိုင်ရာ column privileges တွေ (ရှိရင်) ကိုလည်း — table ရဲ့ column တစ်ခုချင်းစီပေါ်ကနေ အလိုအလျောက် revoke လုပ်ပါတယ်။ တဖက်မှာလည်း — role တစ်ခုကို table တစ်ခုပေါ်မှာ privileges တွေ grant လုပ်ထားပြီးဆိုရင် — column တစ်ခုချင်းစီကနေ အဲဒီ privilege အမျိုးတူတွေကို revoke လုပ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

Role တစ်ခုထဲက membership (အဖွဲ့ဝင်ခြင်း) ကို revoke လုပ်တဲ့အခါ — `GRANT OPTION` ကို `ADMIN OPTION` လို့ ခေါ်ပါတယ် — ဒါပေမယ့် အပြုအမူ (behavior) ကတော့ ဆင်တူပါတယ်။ PostgreSQL 16 မတိုင်ခင် release တွေမှာ — role membership ရဲ့ grants တွေအတွက် dependent privileges တွေကို ခြေရာခံ (track) မလုပ်ခဲ့တာမို့ — role membership အတွက် `CASCADE` က ဘာအကျိုးမှ မရှိခဲ့ဘူးဆိုတာ သတိပြုပါ။ အခုတော့ အဲဒီလို မဟုတ်တော့ပါဘူး။ ဒါ့အပြင် — command ရဲ့ ဒီပုံစံမှာ `role_specification` ထဲက noise word (အဓိပ္ပာယ် သက်ရောက်မှု မရှိတဲ့ အလှဆင် စကားလုံး) ဖြစ်တဲ့ `GROUP` ကို ခွင့်မပြုဘူးဆိုတာလည်း သတိပြုပါ။

ရှိပြီးသား role grant တစ်ခုကနေ `ADMIN OPTION` ကို ဖယ်ရှားလို့ ရသလိုပဲ — `INHERIT OPTION` ဒါမှမဟုတ် `SET OPTION` ကိုလည်း revoke လုပ်နိုင်ပါတယ်။ ဒါက သက်ဆိုင်ရာ option ရဲ့ တန်ဖိုးကို `FALSE` လို့ သတ်မှတ်လိုက်တာနဲ့ ညီမျှပါတယ်။

## Notes (မှတ်စုများ)

User တစ်ယောက်က — သူကိုယ်တိုင် တိုက်ရိုက် grant လုပ်ခဲ့တဲ့ privileges တွေကိုပဲ revoke လုပ်နိုင်ပါတယ်။ ဥပမာ — user A က grant option ပါတဲ့ privilege တစ်ခုကို user B ဆီ grant လုပ်ခဲ့ပြီး — user B က အဲဒါကို user C ဆီ ထပ်ဆင့် grant လုပ်ခဲ့မယ်ဆိုရင် — A က C ဆီကနေ အဲဒီ privilege ကို တိုက်ရိုက် revoke လုပ်လို့ မရပါဘူး။ အဲဒီအစား — A က B ဆီကနေ grant option ကို revoke လုပ်ပြီး — `CASCADE` option ကို သုံးလိုက်ရင် — privilege က C ဆီကနေ ဆင့်ပွား revoke လုပ်ခံရမှာ ဖြစ်ပါတယ်။ နောက်ဥပမာတစ်ခုအနေနဲ့ — A ရော B ရော နှစ်ယောက်လုံးက C ဆီ တူညီတဲ့ privilege ကို grant လုပ်ထားရင် — A က ကိုယ့်ရဲ့ grant ကိုတော့ revoke လုပ်နိုင်ပေမယ့် — B ရဲ့ grant ကိုတော့ revoke လုပ်လို့ မရတာမို့ — C မှာ အဲဒီ privilege လက်တွေ့မှာ ရှိနေဦးမှာ ဖြစ်ပါတယ်။

Object တစ်ခုရဲ့ owner မဟုတ်သူတစ်ယောက်က အဲဒီ object ပေါ်က privileges တွေကို `REVOKE` လုပ်ဖို့ ကြိုးစားရင် — user မှာ အဲဒီ object ပေါ်မှာ privilege လုံးဝ မရှိဘူးဆိုရင် command က ချက်ချင်း မအောင်မြင်ပါဘူး။ Privilege တစ်ခုခု ရှိနေသရွေ့တော့ command က ဆက်လုပ်ပါတယ် — ဒါပေမယ့် user မှာ grant options ရှိတဲ့ privileges တွေကိုပဲ revoke လုပ်မှာ ဖြစ်ပါတယ်။ `REVOKE ALL PRIVILEGES` ပုံစံတွေကတော့ — grant options ဘာမှ မကိုင်ထားရင် warning message တစ်ခု ထုတ်ပေးပြီး — တခြား ပုံစံတွေကတော့ — command ထဲမှာ နာမည်တပ်ပြီး အတိအကျ သတ်မှတ်ထားတဲ့ privileges တွေထဲက တစ်ခုခုအတွက် grant options မရှိရင် warning တစ်ခု ထုတ်ပေးပါတယ်။ (သဘောတရားအရတော့ ဒီဖော်ပြချက်တွေက object owner ကိုပါ သက်ရောက်ပါတယ် — ဒါပေမယ့် owner ကို grant options တွေ အားလုံး ကိုင်ထားသူအဖြစ် အမြဲ သတ်မှတ်လို့ — ဒီလို ကိစ္စတွေက ဘယ်တော့မှ မဖြစ်နိုင်ပါဘူး။)

Superuser တစ်ယောက်က `GRANT` ဒါမှမဟုတ် `REVOKE` command တစ်ခုကို ထုတ်ပြန်ဖို့ ရွေးချယ်ရင် — command ကို သက်ရောက်မှု ခံရတဲ့ object ရဲ့ owner က ထုတ်ပြန်လိုက်သလိုမျိုး လုပ်ဆောင်ပါတယ်။ (Roles တွေမှာ owners တွေ မရှိတာမို့ — role membership ရဲ့ `GRANT` ကိစ္စမှာတော့ — command ကို bootstrap superuser က ထုတ်ပြန်လိုက်သလိုမျိုး လုပ်ဆောင်ပါတယ်။) Privileges တွေ အားလုံးက နောက်ဆုံးမှာတော့ object owner ဆီကနေ (grant options ရဲ့ ကွင်းဆက်တွေကတစ်ဆင့် သွယ်ဝိုက်ပြီး ဖြစ်နိုင်တယ်) လာတာမို့ — superuser တစ်ယောက်က privileges တွေ အားလုံးကို revoke လုပ်နိုင်ပေမယ့် — အပေါ်မှာ ဖော်ပြခဲ့သလို — `CASCADE` ကို သုံးဖို့ လိုအပ်နိုင်ပါတယ်။

`REVOKE` ကို — သက်ရောက်မှု ခံရတဲ့ object ရဲ့ owner မဟုတ်ပေမယ့် — object ကို ပိုင်ဆိုင်တဲ့ role ရဲ့ member ဖြစ်တဲ့ role တစ်ခု၊ ဒါမှမဟုတ် object ပေါ်မှာ privileges တွေကို `WITH GRANT OPTION` နဲ့ ကိုင်ထားတဲ့ role တစ်ခုရဲ့ member ဖြစ်တဲ့ role တစ်ခုကလည်း လုပ်ဆောင်နိုင်ပါတယ်။ ဒီလိုကိစ္စမှာ — command ကို object ကို တကယ် ပိုင်ဆိုင်တဲ့ ဒါမှမဟုတ် privileges တွေကို `WITH GRANT OPTION` နဲ့ ကိုင်ထားတဲ့ — containing role (အဖွဲ့ဝင်တွေ ပါဝင်နေတဲ့ role) က ထုတ်ပြန်လိုက်သလိုမျိုး လုပ်ဆောင်ပါတယ်။ ဥပမာ — table `t1` ကို role `g1` က ပိုင်ဆိုင်ပြီး — `u1` က `g1` ရဲ့ member ဖြစ်ရင် — `u1` က `g1` က grant လုပ်ထားတယ်လို့ မှတ်တမ်းတင်ထားတဲ့ `t1` ပေါ်က privileges တွေကို revoke လုပ်နိုင်ပါတယ်။ ဒါမှာ `u1` ကိုယ်တိုင် လုပ်ထားတဲ့ grants တွေရော — role `g1` ရဲ့ တခြား members တွေ လုပ်ထားတဲ့ grants တွေပါ ပါဝင်ပါတယ်။

`REVOKE` ကို execute လုပ်နေတဲ့ role က — role membership path တစ်ခုထက်ပိုပြီးကတစ်ဆင့် privileges တွေကို သွယ်ဝိုက် ကိုင်ထားရင် — command ကို လုပ်ဆောင်ဖို့ ဘယ် containing role ကို သုံးမလဲဆိုတာ သတ်မှတ်မထားပါဘူး။ အဲဒီလို ကိစ္စမျိုးမှာ — သင်က `REVOKE` ကို ဘယ် role အနေနဲ့ လုပ်ချင်လဲ — အဲဒီ တိကျတဲ့ role အဖြစ် ပြောင်းဖို့ `SET ROLE` ကို သုံးတာက အကောင်းဆုံး နည်းလမ်း (best practice) ဖြစ်ပါတယ်။ အဲဒီလို မလုပ်မိရင် — သင်ရည်ရွယ်ထားတာတွေ မဟုတ်ဘဲ တခြား privileges တွေကို revoke မိသွားတာ ဒါမှမဟုတ် ဘာမှ လုံးဝ revoke မဖြစ်တာ ဖြစ်နိုင်ပါတယ်။

Specific privilege အမျိုးအစားတွေအကြောင်း နဲ့ — objects တွေရဲ့ privileges တွေကို ဘယ်လို စစ်ဆေးရမလဲဆိုတဲ့ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 5.8](/docs/postgresql/ddl-priv) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`films` table ပေါ်မှာ public အတွက် insert privilege ကို revoke လုပ်ဖို့:

```sql
REVOKE INSERT ON films FROM PUBLIC;
```

`kinds` view ပေါ်က user `manuel` ဆီက privileges တွေ အားလုံးကို revoke လုပ်ဖို့:

```sql
REVOKE ALL PRIVILEGES ON kinds FROM manuel;
```

ဒါက တကယ်တော့ “ကိုယ် grant လုပ်ခဲ့တဲ့ privileges တွေ အားလုံးကို revoke လုပ်လိုက်တာ” လို့ အဓိပ္ပာယ် ရတယ်ဆိုတာ သတိပြုပါ။

User `joe` ဆီကနေ `admins` role ထဲက membership ကို revoke လုပ်ဖို့:

```sql
REVOKE admins FROM joe;
```

## Compatibility (လိုက်ဖက်ညီမှု)

[`GRANT`](/docs/postgresql/sql-grant) command ရဲ့ compatibility (လိုက်ဖက်ညီမှု) မှတ်စုတွေက `REVOKE` အတွက်ပါ အလားတူ သက်ရောက်ပါတယ်။ Standard အရတော့ `RESTRICT` ဒါမှမဟုတ် `CASCADE` keyword က မဖြစ်မနေ လိုအပ်ပေမယ့် — PostgreSQL ကတော့ default အနေနဲ့ `RESTRICT` လို့ ယူဆပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[GRANT](/docs/postgresql/sql-grant), [ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html)
