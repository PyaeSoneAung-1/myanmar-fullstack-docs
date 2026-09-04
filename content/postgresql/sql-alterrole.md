---
title: "ALTER ROLE (role တစ်ခုရဲ့ သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း)"
description: "Role တစ်ခုရဲ့ attributes (SUPERUSER, CREATEDB, CREATEROLE, LOGIN, REPLICATION, PASSWORD, VALID UNTIL စသည်) များကို ပြောင်းလဲခြင်း၊ role နာမည် ပြောင်းခြင်း (RENAME TO) နှင့် session configuration defaults (SET/RESET) သတ်မှတ်ခြင်း — IN DATABASE ဖြင့် per-database settings များ အပါအဝင်"
order: 165
source: "https://www.postgresql.org/docs/current/sql-alterrole.html"
status: translated
updated: 2026-09-04
---

## ALTER ROLE (role တစ်ခုရဲ့ သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း)

ALTER ROLE — database role တစ်ခုရဲ့ သတ်မှတ်ချက်များကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER ROLE role_specification [ WITH ] option [ ... ]

where option can be:

      SUPERUSER | NOSUPERUSER
    | CREATEDB | NOCREATEDB
    | CREATEROLE | NOCREATEROLE
    | INHERIT | NOINHERIT
    | LOGIN | NOLOGIN
    | REPLICATION | NOREPLICATION
    | BYPASSRLS | NOBYPASSRLS
    | CONNECTION LIMIT connlimit
    | [ ENCRYPTED ] PASSWORD 'password' | PASSWORD NULL
    | VALID UNTIL 'timestamp'

ALTER ROLE name RENAME TO new_name

ALTER ROLE { role_specification | ALL } [ IN DATABASE database_name ] SET configuration_parameter { TO | = } { value | DEFAULT }
ALTER ROLE { role_specification | ALL } [ IN DATABASE database_name ] SET configuration_parameter FROM CURRENT
ALTER ROLE { role_specification | ALL } [ IN DATABASE database_name ] RESET configuration_parameter
ALTER ROLE { role_specification | ALL } [ IN DATABASE database_name ] RESET ALL

where role_specification can be:

    role_name
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER ROLE` က PostgreSQL role တစ်ခုရဲ့ attributes (ဂုဏ်ရည်များ) တွေကို ပြောင်းလဲပေးပါတယ်။

Synopsis မှာ စာရင်းပြထားတဲ့ ဒီ command ရဲ့ ပထမ ပုံစံ (variant) က — [`CREATE ROLE`](/docs/postgresql/sql-createrole) မှာ သတ်မှတ်လို့ရတဲ့ role attributes တွေထဲက အများအပြားကို ပြောင်းလဲနိုင်ပါတယ်။ (Memberships တွေ ပေါင်းထည့်ခြင်း/ဖယ်ရှားခြင်းအတွက် options တွေ မရှိတာကလွဲလို့ — ဖြစ်နိုင်တဲ့ attributes တွေ အားလုံး အကျုံးဝင်ပါတယ်; အဲဒါအတွက် [`GRANT`](/docs/postgresql/sql-grant) နဲ့ [`REVOKE`](/docs/postgresql/sql-revoke) ကို သုံးပါ။) Command ထဲမှာ ဖော်ပြမထားတဲ့ attributes တွေက သူတို့ရဲ့ အရင် settings တွေအတိုင်း ဆက်ရှိနေပါတယ်။ Database superusers တွေက ဘယ် role အတွက်မဆို ဒီ settings တွေထဲက ဘယ်ဟာကိုမဆို ပြောင်းလဲနိုင်ပါတယ် — [bootstrap superuser](https://www.postgresql.org/docs/current/glossary.html#GLOSSARY-BOOTSTRAP-SUPERUSER) ရဲ့ `SUPERUSER` property ကို ပြောင်းလဲတာကလွဲလို့ပါ။ `CREATEROLE` privilege ရှိတဲ့ superuser မဟုတ်တဲ့ roles တွေက — သူတို့ကို `ADMIN OPTION` ပေးအပ်ထားတဲ့ — non-superuser နဲ့ non-replication roles တွေအတွက်သာ — ဒီ properties တွေထဲက အများစုကို ပြောင်းလဲနိုင်ပါတယ်။ Superuser မဟုတ်သူတွေက `SUPERUSER` property ကို ပြောင်းလဲလို့ မရဘဲ — `CREATEDB`, `REPLICATION` နဲ့ `BYPASSRLS` properties တွေကိုတော့ — သူတို့ကိုယ်တိုင် သက်ဆိုင်ရာ property ရှိမှသာ ပြောင်းလဲနိုင်ပါတယ်။ သာမန် (ordinary) roles တွေက သူတို့ရဲ့ ကိုယ်ပိုင် password ကိုပဲ ပြောင်းလဲနိုင်ပါတယ်။

ဒုတိယ ပုံစံက role ရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။ Database superusers တွေက ဘယ် role ကိုမဆို နာမည်ပြောင်းနိုင်ပါတယ်။ `CREATEROLE` privilege ရှိတဲ့ roles တွေက — သူတို့ကို `ADMIN OPTION` ပေးအပ်ထားတဲ့ — non-superuser roles တွေကို နာမည်ပြောင်းနိုင်ပါတယ်။ လက်ရှိ session user ကိုတော့ နာမည်ပြောင်းလို့ မရပါဘူး။ (အဲဒါ လုပ်ဖို့ လိုအပ်ရင် တခြား user တစ်ယောက်အနေနဲ့ ချိတ်ဆက်ပါ။) `MD5`-encrypted passwords တွေက role name ကို cryptographic salt အဖြစ် သုံးတာမို့ — role တစ်ခုကို နာမည်ပြောင်းလိုက်ရင် — password က `MD5`-encrypted ဖြစ်နေရင် — အဲဒီ role ရဲ့ password ကို ရှင်းပစ်လိုက်ပါတယ်။

ကျန် ပုံစံတွေက configuration variable တစ်ခုရဲ့ role ရဲ့ session default ကို ပြောင်းလဲပေးပါတယ် — database တွေ အားလုံးအတွက်ဖြစ်စေ၊ ဒါမှမဟုတ် `IN DATABASE` clause ကို သတ်မှတ်ထားရင် — နာမည်ပေးထားတဲ့ database ထဲက sessions တွေအတွက်သာ ဖြစ်စေပါတယ်။ Role နာမည် တစ်ခုရဲ့အစား `ALL` ကို သတ်မှတ်ရင် — ဒါက setting ကို roles အားလုံးအတွက် ပြောင်းလဲပေးပါတယ်။ `IN DATABASE` နဲ့တွဲပြီး `ALL` ကို သုံးတာက `ALTER DATABASE ... SET ...` command ကို သုံးတာနဲ့ ထိရောက်စွာ အတူတူပါပဲ။

Role က နောက်ပိုင်းမှာ session အသစ်တစ်ခု စတင်တိုင်း — သတ်မှတ်ထားတဲ့ တန်ဖိုးက session default ဖြစ်လာပြီး — `postgresql.conf` ထဲမှာ ရှိနေတဲ့ setting ပဲဖြစ်ဖြစ် — `postgres` command line ကနေ လက်ခံရရှိထားတဲ့ setting ပဲဖြစ်ဖြစ် — ဘာကိုမဆို override (ကျော်လွန်) လုပ်ပါတယ်။ ဒါက login လုပ်ချိန်မှာပဲ ဖြစ်ပျက်ပါတယ်; [`SET ROLE`](/docs/postgresql/sql-set-role) ဒါမှမဟုတ် [`SET SESSION AUTHORIZATION`](/docs/postgresql/sql-set-session-authorization) ကို execute လုပ်တာက configuration တန်ဖိုး အသစ်တွေ သတ်မှတ်ပေးစေတာ မဟုတ်ပါဘူး။ Database အားလုံးအတွက် သတ်မှတ်ထားတဲ့ settings တွေကို — role တစ်ခုဆီ ချိတ်ထားတဲ့ database-specific settings တွေက override လုပ်ပါတယ်။ Database တစ်ခုချင်းစီ ဒါမှမဟုတ် role တစ်ခုချင်းစီအတွက် သတ်မှတ်ထားတဲ့ settings တွေက roles အားလုံးအတွက် သတ်မှတ်ထားတဲ့ settings တွေကို override လုပ်ပါတယ်။

Superusers တွေက ဘယ်သူ့ရဲ့ session defaults တွေကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။ `CREATEROLE` privilege ရှိတဲ့ roles တွေက — သူတို့ကို `ADMIN OPTION` ပေးအပ်ထားတဲ့ — non-superuser roles တွေရဲ့ defaults တွေကို ပြောင်းလဲနိုင်ပါတယ်။ သာမန် roles တွေက သူတို့ ကိုယ်တိုင်အတွက်ပဲ defaults သတ်မှတ်နိုင်ပါတယ်။ Configuration variables တချို့ကို ဒီနည်းနဲ့ သတ်မှတ်လို့ မရပါဘူး — ဒါမှမဟုတ် superuser တစ်ယောက်က command ထုတ်ပြန်မှသာ သတ်မှတ်လို့ ရပါတယ်။ Database အားလုံးထဲက roles အားလုံးအတွက် setting တစ်ခုကို ပြောင်းလဲနိုင်တာ superusers တွေပဲ ဖြစ်ပါတယ်။

## Parameters (parameter များ)

- **name** — Attributes တွေ ပြောင်းလဲရမယ့် role ရဲ့ နာမည်။
- **CURRENT_ROLE** / **CURRENT_USER** — Explicit သတ်မှတ်ထားတဲ့ role တစ်ခုရဲ့အစား — လက်ရှိ user ကို ပြောင်းလဲပါတယ်။
- **SESSION_USER** — Explicit သတ်မှတ်ထားတဲ့ role တစ်ခုရဲ့အစား — လက်ရှိ session user ကို ပြောင်းလဲပါတယ်။
- **SUPERUSER** / **NOSUPERUSER**, **CREATEDB** / **NOCREATEDB**, **CREATEROLE** / **NOCREATEROLE**, **INHERIT** / **NOINHERIT**, **LOGIN** / **NOLOGIN**, **REPLICATION** / **NOREPLICATION**, **BYPASSRLS** / **NOBYPASSRLS**, **CONNECTION LIMIT connlimit**, **[ ENCRYPTED ] PASSWORD 'password'** / **PASSWORD NULL**, **VALID UNTIL 'timestamp'** — ဒီ clauses တွေက `CREATE ROLE` က မူလ သတ်မှတ်ခဲ့တဲ့ attributes တွေကို ပြောင်းလဲပေးပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် CREATE ROLE reference page ကို ကြည့်ပါ။
- **new_name** — Role ရဲ့ နာမည် အသစ်။
- **database_name** — Configuration variable ကို သတ်မှတ်ပေးရမယ့် database ရဲ့ နာမည်။
- **configuration_parameter** / **value** — သတ်မှတ်ထားတဲ့ configuration parameter အတွက် ဒီ role ရဲ့ session default ကို ပေးထားတဲ့ တန်ဖိုးအဖြစ် သတ်မှတ်ပေးပါတယ်။ value က DEFAULT ဖြစ်ရင် ဒါမှမဟုတ် ညီမျှစွာ RESET ကို သုံးထားရင် — role-specific variable setting ကို ဖယ်ရှားလိုက်လို့ — role က session အသစ်တွေမှာ system-wide default setting ကို အမွေဆက်ခံပါလိမ့်မယ်။ Role-specific settings တွေ အားလုံးကို ရှင်းလင်းဖို့ RESET ALL ကို သုံးပါ။ SET FROM CURRENT က parameter ရဲ့ session ထဲက လက်ရှိ တန်ဖိုးကို role-specific value အဖြစ် သိမ်းဆည်းပေးပါတယ်။ IN DATABASE ကို သတ်မှတ်ထားရင် — configuration parameter ကို ပေးထားတဲ့ role နဲ့ database အတွက်သာ သတ်မှတ်ပေး/ဖယ်ရှားပါတယ်။
Role-specific variable settings တွေက login လုပ်ချိန်မှာပဲ သက်ရောက်မှု ရှိပါတယ်; SET ROLE နဲ့ SET SESSION AUTHORIZATION တွေက role-specific variable settings တွေကို process မလုပ်ပါဘူး။
ခွင့်ပြုထားတဲ့ parameter နာမည်တွေနဲ့ တန်ဖိုးတွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် SET နဲ့ အခန်း 19 ကို ကြည့်ပါ။

## Notes (မှတ်စုများ)

Roles အသစ်တွေ ထည့်ဖို့ [`CREATE ROLE`](/docs/postgresql/sql-createrole) ကို သုံးပြီး — role တစ်ခုကို ဖယ်ရှားဖို့ [`DROP ROLE`](/docs/postgresql/sql-droprole) ကို သုံးပါ။

`ALTER ROLE` က role တစ်ခုရဲ့ memberships တွေကို ပြောင်းလဲလို့ မရပါဘူး။ အဲဒါ လုပ်ဖို့ [`GRANT`](/docs/postgresql/sql-grant) နဲ့ [`REVOKE`](/docs/postgresql/sql-revoke) ကို သုံးပါ။

> **သတိပြုရန်:** ဒီ command နဲ့ unencrypted password တစ်ခုကို သတ်မှတ်တဲ့အခါ သတိထား ဆောင်ရွက်ရပါမယ်။ Password က server ဆီကို cleartext (ကုဒ်မဝှက်ထား) အနေနဲ့ ပို့ဆောင်ခံရပြီး — client ရဲ့ command history ဒါမှမဟုတ် server log ထဲမှာလည်း မှတ်တမ်းဝင်သွားနိုင်ပါတယ်။ [psql](https://www.postgresql.org/docs/current/app-psql.html) မှာ `\password` ဆိုတဲ့ command တစ်ခု ပါဝင်ပြီး — cleartext password ကို ဖော်ထုတ်မပြဘဲ — role တစ်ခုရဲ့ password ကို ပြောင်းလဲဖို့ သုံးနိုင်ပါတယ်။

Session default တစ်ခုကို role တစ်ခုဆီ မဟုတ်ဘဲ — database တစ်ခု သီးခြားဆီ ချိတ်ထားဖို့လည်း ဖြစ်နိုင်ပါတယ်; [ALTER DATABASE](/docs/postgresql/sql-alterdatabase) ကို ကြည့်ပါ။ Conflict ရှိရင် — database-role-specific settings တွေက role-specific settings တွေကို override လုပ်ပြီး — ၎င်းတို့ကတစ်ဖန် database-specific settings တွေကို override လုပ်ပါတယ်။

## Examples (ဥပမာများ)

Role တစ်ခုရဲ့ password ကို ပြောင်းလဲဖို့:

```sql
ALTER ROLE davide WITH PASSWORD 'hu8jmn3';
```

Role တစ်ခုရဲ့ password ကို ဖယ်ရှားဖို့:

```sql
ALTER ROLE davide WITH PASSWORD NULL;
```

Password သက်တမ်းကုန်ဆုံးရက် တစ်ခုကို ပြောင်းလဲဖို့ — UTC ထက် တစ်နာရီ ရှေ့ရောက်တဲ့ time zone ကို သုံးပြီး — password က 2015 ခုနှစ် မေလ 4 ရက်နေ့ မွန်းတည့်ချိန်မှာ ကုန်ဆုံးသင့်တယ်လို့ သတ်မှတ်ခြင်း:

```sql
ALTER ROLE chris VALID UNTIL 'May 4 12:00:00 2015 +1';
```

Password တစ်ခုကို အမြဲတမ်း သက်ဝင်နေစေဖို့:

```sql
ALTER ROLE fred VALID UNTIL 'infinity';
```

Role တစ်ခုကို — တခြား roles တွေကို စီမံခန့်ခွဲနိုင်ပြီး database အသစ်တွေ ဖန်တီးနိုင်တဲ့ — စွမ်းရည် ပေးဖို့:

```sql
ALTER ROLE miriam CREATEROLE CREATEDB;
```

Role တစ်ခုကို [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) parameter ရဲ့ non-default setting တစ်ခု ပေးဖို့:

```sql
ALTER ROLE worker_bee SET maintenance_work_mem = 100000;
```

Role တစ်ခုကို [client_min_messages](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-CLIENT-MIN-MESSAGES) parameter ရဲ့ non-default ဖြစ်ပြီး database-specific ဖြစ်တဲ့ setting တစ်ခု ပေးဖို့:

```sql
ALTER ROLE fred IN DATABASE devel SET client_min_messages = DEBUG;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER ROLE` statement က PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE ROLE](/docs/postgresql/sql-createrole), [DROP ROLE](/docs/postgresql/sql-droprole), [ALTER DATABASE](/docs/postgresql/sql-alterdatabase), [SET](https://www.postgresql.org/docs/current/sql-set.html)
