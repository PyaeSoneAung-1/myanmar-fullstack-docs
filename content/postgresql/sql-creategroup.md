---
title: "CREATE GROUP (database role အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Database role အသစ်တစ်ခု ဖန်တီးခြင်း — CREATE GROUP သည် CREATE ROLE ၏ alias ဖြစ်ပြီး SUPERUSER, CREATEDB, CREATEROLE, LOGIN, REPLICATION, PASSWORD, VALID UNTIL, IN ROLE, ADMIN စသည့် option အပြည့်အစုံကို ထောက်ပံ့ပေးသည်"
order: 284
source: "https://www.postgresql.org/docs/current/sql-creategroup.html"
status: translated
updated: 2026-09-04
---

## CREATE GROUP (database role အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE GROUP — database role အသစ်တစ်ခုကို define (သတ်မှတ်) လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE GROUP name [ [ WITH ] option [ ... ] ]

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

`CREATE GROUP` က ယခုအခါ [`CREATE ROLE`](/docs/postgresql/sql-createrole) အတွက် alias (နာမည်တစ်မျိုးဖြင့် ခေါ်နိုင်သော ပုံစံ) တစ်ခု ဖြစ်နေပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE GROUP` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE ROLE](/docs/postgresql/sql-createrole)
