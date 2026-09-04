---
title: "CREATE USER (database user အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Database user (login ဝင်နိုင်သော database role) အသစ်တစ်ခု ဖန်တီးခြင်း — CREATE USER သည် CREATE ROLE ၏ alias ဖြစ်ပြီး CREATE USER ဖြင့် ရေးသားသည့်အခါ LOGIN ကို default အဖြစ် ယူဆသည်; SUPERUSER, CREATEDB, REPLICATION, PASSWORD, VALID UNTIL, IN ROLE စသည့် option များကို ထောက်ပံ့ပေးသည်"
order: 167
source: "https://www.postgresql.org/docs/current/sql-createuser.html"
status: translated
updated: 2026-09-04
---

## CREATE USER (database user အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE USER — database role အသစ်တစ်ခုကို define (သတ်မှတ်) လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE USER name [ [ WITH ] option [ ... ] ]

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
    | IN ROLE role_name [, ...]
    | IN GROUP role_name [, ...]
    | ROLE role_name [, ...]
    | ADMIN role_name [, ...]
    | USER role_name [, ...]
    | SYSID uid
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE USER` က ယခုအခါ [`CREATE ROLE`](/docs/postgresql/sql-createrole) အတွက် alias (နာမည်တစ်မျိုးဖြင့် ခေါ်နိုင်သော ပုံစံ) တစ်ခု ဖြစ်နေပါတယ်။ တစ်ခုတည်းသော ကွာခြားချက်ကတော့ — command ကို `CREATE USER` လို့ ရေးသားတဲ့အခါ `LOGIN` ကို default အနေနဲ့ ယူဆပြီး — `CREATE ROLE` လို့ ရေးသားတဲ့အခါမှာတော့ `NOLOGIN` ကို default အနေနဲ့ ယူဆပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE USER` statement က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ကတော့ users တွေရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို implementation (အကောင်အထည်ဖော်မှု) တစ်ခုချင်းစီဆီ ချန်ထားပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE ROLE](/docs/postgresql/sql-createrole)
