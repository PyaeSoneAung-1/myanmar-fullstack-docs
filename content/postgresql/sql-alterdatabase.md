---
title: "ALTER DATABASE (database တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Database တစ်ခု၏ ဂုဏ်ရည်များကို ပြောင်းလဲခြင်း — per-database settings, နာမည် (RENAME TO), owner (OWNER TO), default tablespace (SET TABLESPACE), collation version (REFRESH COLLATION VERSION) နှင့် session configuration defaults (SET/RESET) ပြောင်းလဲသည့် ပုံစံများ"
order: 141
source: "https://www.postgresql.org/docs/current/sql-alterdatabase.html"
status: translated
updated: 2026-09-04
---

## ALTER DATABASE (database တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER DATABASE — database တစ်ခုကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER DATABASE name [ [ WITH ] option [ ... ] ]

where option can be:

    ALLOW_CONNECTIONS allowconn
    CONNECTION LIMIT connlimit
    IS_TEMPLATE istemplate

ALTER DATABASE name RENAME TO new_name

ALTER DATABASE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }

ALTER DATABASE name SET TABLESPACE new_tablespace

ALTER DATABASE name REFRESH COLLATION VERSION

ALTER DATABASE name SET configuration_parameter { TO | = } { value | DEFAULT }
ALTER DATABASE name SET configuration_parameter FROM CURRENT
ALTER DATABASE name RESET configuration_parameter
ALTER DATABASE name RESET ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER DATABASE` က database တစ်ခုရဲ့ attributes (ဂုဏ်ရည်များ) တွေကို ပြောင်းလဲပေးပါတယ်။

ပထမ ပုံစံ (form) က per-database settings အချို့ကို ပြောင်းလဲပေးပါတယ်။ (အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ။) ဒီ settings တွေကို database ရဲ့ owner ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ ပြောင်းလဲနိုင်ပါတယ်။

ဒုတိယ ပုံစံက database ရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။ Database တစ်ခုကို နာမည်ပြောင်းဖို့ — database ရဲ့ owner ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ လုပ်နိုင်ပြီး — superuser မဟုတ်တဲ့ owners တွေမှာ `CREATEDB` privilege လည်း ရှိရပါမယ်။ လက်ရှိ database ကို နာမည်ပြောင်းလို့ မရပါဘူး။ (အဲဒါ လုပ်ဖို့ လိုအပ်ရင် တခြား database တစ်ခုဆီ ချိတ်ဆက်ပါ။)

တတိယ ပုံစံက database ရဲ့ owner ကို ပြောင်းလဲပေးပါတယ်။ Owner ကို ပြောင်းဖို့ — သင်ဟာ new owning role ဆီ `SET ROLE` လုပ်နိုင်ရမယ် ပြီးတော့ `CREATEDB` privilege ရှိရပါမယ်။ (Superusers တွေမှာ ဒီ privileges တွေ အားလုံး အလိုအလျောက် ရှိတာ သတိပြုပါ။)

စတုတ္ထ ပုံစံက database ရဲ့ default tablespace ကို ပြောင်းလဲပေးပါတယ်။ ဒါကို database ရဲ့ owner ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ လုပ်နိုင်ပြီး — tablespace အသစ်အတွက် create privilege လည်း ရှိရပါမယ်။ ဒီ command က database ရဲ့ old default tablespace ထဲက tables ဒါမှမဟုတ် indexes တွေ အားလုံးကို ရုပ်ပိုင်းဆိုင်ရာအရ tablespace အသစ်ဆီ ရွှေ့ပေးပါတယ်။ Database အတွက် tablespace အသစ်က ဗလာ (empty) ဖြစ်ရမှာ ဖြစ်ပြီး — ဘယ်သူမှ database ဆီ ချိတ်ဆက်ထားလို့ မရပါဘူး။ Non-default tablespaces တွေထဲက tables နဲ့ indexes တွေကတော့ သက်ရောက်မှု မရှိပါဘူး။ Files တွေကို tablespace အသစ်ဆီ ကူးယူရာမှာ သုံးတဲ့ နည်းလမ်းကို [file_copy_method](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-FILE-COPY-METHOD) setting က သက်ရောက်ပါတယ်။

ကျန် ပုံစံတွေက PostgreSQL database တစ်ခုအတွက် run-time configuration variable တစ်ခုရဲ့ session default ကို ပြောင်းလဲပေးပါတယ်။ နောက်ပိုင်းမှာ အဲဒီ database ထဲမှာ session အသစ်တစ်ခု စတင်တိုင်း — သတ်မှတ်ထားတဲ့ တန်ဖိုးက session default value ဖြစ်လာပါတယ်။ Database-specific default က `postgresql.conf` ထဲမှာ ရှိတဲ့ setting ဒါမှမဟုတ် `postgres` command line ကနေ လက်ခံရရှိထားတဲ့ setting — ဘာပဲဖြစ်ဖြစ် override (ကျော်လွန်) လုပ်ပါတယ်။ Database တစ်ခုအတွက် session defaults တွေကို database ရဲ့ owner ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ ပြောင်းလဲနိုင်ပါတယ်။ Variable အချို့ကို ဒီနည်းလမ်းနဲ့ သတ်မှတ်လို့ မရပါဘူး၊ ဒါမှမဟုတ် superuser တစ်ယောက်ကပဲ သတ်မှတ်နိုင်ပါတယ်။

## Parameters (parameter များ)

- **name** — Attributes တွေ ပြောင်းလဲရမယ့် database ရဲ့ နာမည်။
- **allowconn** — false ဆိုရင် ဘယ်သူမှ ဒီ database ဆီ ချိတ်ဆက်လို့ မရပါဘူး။
- **connlimit** — ဒီ database ဆီ တစ်ပြိုင်နက် ချိတ်ဆက်မှု ဘယ်လောက် လုပ်နိုင်လဲ။ -1 က ကန့်သတ်ချက် မရှိဘူးလို့ ဆိုလိုပါတယ်။
- **istemplate** — true ဆိုရင် — CREATEDB privilege ရှိတဲ့ user တိုင်း ဒီ database ကို clone လုပ်နိုင်ပါတယ်; false ဆိုရင် — superusers တွေ ဒါမှမဟုတ် database ရဲ့ owner တွေပဲ clone လုပ်နိုင်ပါတယ်။
- **new_name** — Database ရဲ့ နာမည် အသစ်။
- **new_owner** — Database ရဲ့ owner အသစ်။
- **new_tablespace** — Database ရဲ့ default tablespace အသစ်။
ဒီ command ပုံစံကို transaction block ထဲမှာ execute လုပ်လို့ မရပါဘူး။
- **REFRESH COLLATION VERSION** — Database ရဲ့ collation version ကို update လုပ်ပေးပါတယ်။ နောက်ခံ အကြောင်းအရာအတွက် Notes (မှတ်စုများ) ကို ကြည့်ပါ။
- **configuration_parameter** / **value** — သတ်မှတ်ထားတဲ့ configuration parameter အတွက် ဒီ database ရဲ့ session default ကို ပေးထားတဲ့ တန်ဖိုးအဖြစ် သတ်မှတ်ပေးပါတယ်။ value က DEFAULT ဖြစ်ရင် ဒါမှမဟုတ် ညီမျှစွာ RESET ကို သုံးထားရင် — database-specific setting ကို ဖယ်ရှားလိုက်လို့ — session အသစ်တွေမှာ system-wide default setting ကို အမွေဆက်ခံပါလိမ့်မယ်။ Database-specific settings အားလုံးကို ရှင်းလင်းဖို့ RESET ALL ကို သုံးပါ။ SET FROM CURRENT က session ရဲ့ လက်ရှိ parameter တန်ဖိုးကို database-specific value အဖြစ် သိမ်းဆည်းပေးပါတယ်။
ခွင့်ပြုထားတဲ့ parameter နာမည်တွေနဲ့ တန်ဖိုးတွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် `SET` နဲ့ အခန်း 19 ကို ကြည့်ပါ။

## Notes (မှတ်စုများ)

Session default တစ်ခုကို database တစ်ခုဆီ မဟုတ်ဘဲ — role တစ်ခု သီးခြားဆီ ချိတ်ထားဖို့လည်း ဖြစ်နိုင်ပါတယ်; [ALTER ROLE](https://www.postgresql.org/docs/current/sql-alterrole.html) ကို ကြည့်ပါ။ Conflict ရှိရင် — role-specific settings တွေက database-specific settings တွေကို override လုပ်ပါတယ်။

## Examples (ဥပမာများ)

`test` database ထဲမှာ index scans တွေကို default အနေနဲ့ disable လုပ်ဖို့:

```sql
ALTER DATABASE test SET enable_indexscan TO off;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER DATABASE` statement က PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE DATABASE](/docs/postgresql/sql-createdatabase), [DROP DATABASE](/docs/postgresql/sql-dropdatabase), [SET](https://www.postgresql.org/docs/current/sql-set.html), [CREATE TABLESPACE](https://www.postgresql.org/docs/current/sql-createtablespace.html)
