---
title: "ALTER USER (user တစ်ခုရဲ့ သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း)"
description: "User (database role) တစ်ခုရဲ့ သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း — ALTER USER သည် ALTER ROLE ၏ alias ဖြစ်ပြီး PASSWORD, SUPERUSER/CREATEDB စသည့် attribute များ၊ RENAME ဖြင့် နာမည် ပြောင်းလဲခြင်းနှင့် role-level configuration parameters များ SET/RESET ပြုလုပ်ခြင်း တို့ကို ထောက်ပံ့ပေးသည်"
order: 168
source: "https://www.postgresql.org/docs/current/sql-alteruser.html"
status: translated
updated: 2026-09-04
---

## ALTER USER (user တစ်ခုရဲ့ သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း)

ALTER USER — database role တစ်ခုကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER USER role_specification [ WITH ] option [ ... ]

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

ALTER USER name RENAME TO new_name

ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] SET configuration_parameter { TO | = } { value | DEFAULT }
ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] SET configuration_parameter FROM CURRENT
ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] RESET configuration_parameter
ALTER USER { role_specification | ALL } [ IN DATABASE database_name ] RESET ALL

where role_specification can be:

    role_name
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER USER` က ယခုအခါ [`ALTER ROLE`](/docs/postgresql/sql-alterrole) အတွက် alias (နာမည်တစ်မျိုးဖြင့် ခေါ်နိုင်သော ပုံစံ) တစ်ခု ဖြစ်နေပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER USER` statement က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ကတော့ users တွေရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို implementation (အကောင်အထည်ဖော်မှု) တစ်ခုချင်းစီဆီ ချန်ထားပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER ROLE](/docs/postgresql/sql-alterrole)
