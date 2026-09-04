---
title: "CREATE ROLE (role အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Role အသစ်တစ်ခုကို ဖန်တီးပေးတဲ့ command — attributes (SUPERUSER, CREATEDB, CREATEROLE, LOGIN, REPLICATION, BYPASSRLS, CONNECTION LIMIT, PASSWORD, VALID UNTIL စသည်) နှင့် role membership သတ်မှတ်ခြင်း (IN ROLE, ROLE, ADMIN) အကြောင်း အသေးစိတ်"
order: 164
source: "https://www.postgresql.org/docs/current/sql-createrole.html"
status: translated
updated: 2026-09-04
---

## CREATE ROLE (role အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE ROLE — database role အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE ROLE name [ [ WITH ] option [ ... ] ]

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
    | ROLE role_name [, ...]
    | ADMIN role_name [, ...]
    | SYSID uid
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE ROLE` က PostgreSQL database cluster တစ်ခုထဲသို့ role အသစ်တစ်ခုကို ပေါင်းထည့် (add) ပေးပါတယ်။ Role ဆိုတာက — database objects တွေကို ပိုင်ဆိုင်နိုင်ပြီး database privileges တွေ ရနိုင်တဲ့ entity တစ်ခု ဖြစ်ပါတယ်; role တစ်ခုကို — ဘယ်လို သုံးသလဲပေါ် မူတည်ပြီး — "user" တစ်ယောက်၊ "group" တစ်ခု ဒါမှမဟုတ် နှစ်မျိုးလုံးအဖြစ်ပါ သတ်မှတ်နိုင်ပါတယ်။ Users နဲ့ authentication ကို စီမံခန့်ခွဲခြင်းအကြောင်း အချက်အလက်တွေအတွက် [အခန်း 21](https://www.postgresql.org/docs/current/user-manag.html) နဲ့ [အခန်း 20](https://www.postgresql.org/docs/current/client-authentication.html) ကို ကြည့်ပါ။ ဒီ command ကို သုံးဖို့ — သင်မှာ `CREATEROLE` privilege ရှိရမယ် ဒါမှမဟုတ် database superuser ဖြစ်ရပါမယ်။

Roles တွေကို database cluster အဆင့်မှာ သတ်မှတ်ထားလို့ — cluster ထဲက database တွေ အားလုံးမှာ အကျုံးဝင် (valid) တယ်ဆိုတာ သတိပြုပါ။

Role ဖန်တီးနေစဉ်အတွင်းမှာပဲ — role အသစ်ကို ရှိပြီးသား role တစ်ခုရဲ့ member အဖြစ် ချက်ချင်း သတ်မှတ်ပေးနိုင်သလို — ရှိပြီးသား roles တွေကို role အသစ်ရဲ့ members တွေအဖြစ်လည်း သတ်မှတ်ပေးနိုင်ပါတယ်။ ဘယ် initial role membership options တွေကို enable လုပ်ထားလဲဆိုတဲ့ စည်းမျဉ်းတွေကို အောက်မှာ ဖော်ပြထားတဲ့ `IN ROLE`, `ROLE` နဲ့ `ADMIN` clauses တွေမှာ ဖော်ပြထားပါတယ်။ [GRANT](/docs/postgresql/sql-grant) command ကတော့ membership တည်ဆောက်နေစဉ်မှာ fine-grained (အသေးစိတ် အဆင့်) option ထိန်းချုပ်မှုကို ပေးစွမ်းပြီး — role အသစ် ဖန်တီးပြီးနောက်မှာ ဒီ options တွေကို ပြုပြင်နိုင်စွမ်းလည်း ရှိပါတယ်။

## Parameters (parameter များ)

- **name** — Role အသစ်ရဲ့ နာမည်။
- **SUPERUSER** / **NOSUPERUSER** — ဒီ clauses တွေက role အသစ်ဟာ — database အတွင်းက access ကန့်သတ်ချက်တွေ အားလုံးကို override (ကျော်လွန်) လုပ်နိုင်တဲ့ — "superuser" ဟုတ်/မဟုတ်ကို ဆုံးဖြတ်ပေးပါတယ်။ Superuser status က အန္တရာယ် ရှိပြီး — တကယ် လိုအပ်မှသာ သုံးသင့်ပါတယ်။ Superuser အသစ်တစ်ခု ဖန်တီးဖို့ — သင်ကိုယ်တိုင် superuser ဖြစ်ရပါမယ်။ သတ်မှတ်မထားရင် — NOSUPERUSER က default ဖြစ်ပါတယ်။
- **CREATEDB** / **NOCREATEDB** — ဒီ clauses တွေက role တစ်ခုရဲ့ database တွေ ဖန်တီးနိုင်စွမ်းကို သတ်မှတ်ပေးပါတယ်။ CREATEDB ကို သတ်မှတ်ထားရင် — သတ်မှတ်နေတဲ့ role က database အသစ်တွေ ဖန်တီးခွင့် ရပါလိမ့်မယ်။ NOCREATEDB ကို သတ်မှတ်ရင်တော့ — role ရဲ့ database တွေ ဖန်တီးနိုင်စွမ်းကို ငြင်းပယ်ပါလိမ့်မယ်။ သတ်မှတ်မထားရင် — NOCREATEDB က default ဖြစ်ပါတယ်။ CREATEDB ကို superuser roles တွေ ဒါမှမဟုတ် CREATEDB ရှိတဲ့ roles တွေကပဲ သတ်မှတ်နိုင်ပါတယ်။
- **CREATEROLE** / **NOCREATEROLE** — ဒီ clauses တွေက role တစ်ခုဟာ တခြား roles တွေကို create (ဖန်တီး)၊ alter (ပြောင်းလဲ)၊ drop (ဖျက်)၊ comment ပေးခြင်းနဲ့ — သူတို့ရဲ့ security label ကို ပြောင်းလဲခြင်း ပြုလုပ်ခွင့် ရှိ/မရှိကို ဆုံးဖြတ်ပေးပါတယ်။ ဒီ privilege က ဘယ်လို စွမ်းဆောင်နိုင်စွမ်းတွေ ပေးအပ်သလဲဆိုတဲ့ အသေးစိတ်အတွက် role creation ကို ကြည့်ပါ။ သတ်မှတ်မထားရင် — NOCREATEROLE က default ဖြစ်ပါတယ်။
- **INHERIT** / **NOINHERIT** — ဒါက — ဒီ role ကို တခြား role တစ်ခုရဲ့ member အဖြစ် ထည့်လိုက်တဲ့အခါ — ဒီ command ထဲမှာရော နောက် commands တွေမှာပါ — membership ရဲ့ inheritance status ကို သက်ရောက်ပါတယ်။ အတိအကျ ဆိုရရင် — ၎င်းက ဒီ command နဲ့ `IN ROLE` clause ကို သုံးပြီး ပေါင်းထည့်လိုက်တဲ့ memberships တွေရဲ့ inheritance status ကိုရော — နောက်ပိုင်း commands တွေမှာ `ROLE` clause နဲ့ ပေါင်းထည့်လိုက်တဲ့ memberships တွေရဲ့ inheritance status ကိုပါ ထိန်းချုပ်ပါတယ်။ ဒါ့အပြင် — `GRANT` command ကို သုံးပြီး ဒီ role ကို member အဖြစ် ထည့်တဲ့အခါမှာလည်း default inheritance status အဖြစ် သုံးပါတယ်။ သတ်မှတ်မထားရင် — INHERIT က default ဖြစ်ပါတယ်။
PostgreSQL version 16 မတိုင်ခင် — inheritance က role-level attribute တစ်ခု ဖြစ်ပြီး — အဲဒီ role အတွက် runtime membership checks တွေ အားလုံးကို ထိန်းချုပ်ခဲ့ပါတယ်။
- **LOGIN** / **NOLOGIN** — ဒီ clauses တွေက role တစ်ခု login ဝင်ခွင့် ရှိ/မရှိကို ဆုံးဖြတ်ပေးပါတယ်; ဆိုလိုတာက — client connection ပြုလုပ်နေစဉ်မှာ role ကို initial session authorization name အဖြစ် ပေးနိုင်သလားဆိုတာပါ။ LOGIN attribute ရှိတဲ့ role တစ်ခုကို user တစ်ယောက်လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ attribute မရှိတဲ့ roles တွေက database privileges တွေကို စီမံခန့်ခွဲရာမှာ အသုံးဝင်ပေမယ့် — စကားလုံးရဲ့ ပုံမှန် အဓိပ္ပါယ်အရတော့ users တွေ မဟုတ်ပါဘူး။ သတ်မှတ်မထားရင် — NOLOGIN က default ဖြစ်ပါတယ် — CREATE ROLE ကို ၎င်းရဲ့ အခြားစာလုံးပေါင်း (alternative spelling) ဖြစ်တဲ့ CREATE USER ကနေ ခေါ်လိုက်တဲ့အခါမှသာ ချွင်းချက် ဖြစ်ပါတယ်။
- **REPLICATION** / **NOREPLICATION** — ဒီ clauses တွေက role တစ်ခုဟာ replication role ဟုတ်/မဟုတ်ကို ဆုံးဖြတ်ပေးပါတယ်။ Role တစ်ခုဟာ — replication mode (physical ဒါမှမဟုတ် logical replication) နဲ့ server ဆီ ချိတ်ဆက်နိုင်ဖို့ရော — replication slots တွေကို create/drop လုပ်နိုင်ဖို့ပါ — ဒီ attribute (ဒါမှမဟုတ် superuser ဖြစ်ခြင်း) ရှိရပါမယ်။ REPLICATION attribute ရှိတဲ့ role က အလွန် အထူးအခွင့်အရေး မြင့်မားတဲ့ (highly privileged) role တစ်ခု ဖြစ်ပြီး — တကယ် replication အတွက် သုံးနေတဲ့ roles တွေပေါ်မှာသာ သုံးသင့်ပါတယ်။ သတ်မှတ်မထားရင် — NOREPLICATION က default ဖြစ်ပါတယ်။ REPLICATION ကို superuser roles တွေ ဒါမှမဟုတ် REPLICATION ရှိတဲ့ roles တွေကပဲ သတ်မှတ်နိုင်ပါတယ်။
- **BYPASSRLS** / **NOBYPASSRLS** — ဒီ clauses တွေက role တစ်ခုဟာ row-level security (RLS) policy တိုင်းကို bypass (ကျော်လွန်) လုပ်နိုင်သလားဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။ NOBYPASSRLS က default ဖြစ်ပါတယ်။ BYPASSRLS ကို superuser roles တွေ ဒါမှမဟုတ် BYPASSRLS ရှိတဲ့ roles တွေကပဲ သတ်မှတ်နိုင်ပါတယ်။
pg_dump က table တစ်ခုရဲ့ အကြောင်းအရာတွေ အားလုံး dump ထွက်အောင် သေချာစေဖို့ — row_security ကို default အနေနဲ့ OFF လုပ်ထားတယ်ဆိုတာ သတိပြုပါ။ pg_dump ကို run နေတဲ့ user မှာ သင့်လျော်တဲ့ permissions မရှိရင် — error တစ်ခု ပြန်ပေးခံရပါလိမ့်မယ်။ ဒါပေမယ့် — superusers တွေရော — dump လုပ်ခံနေရတဲ့ table ရဲ့ owner ပါ — RLS ကို အမြဲ bypass လုပ်ပါတယ်။
- **CONNECTION LIMIT connlimit** — Role က login လုပ်နိုင်ရင် — ဒါက role က တစ်ပြိုင်နက် connection ဘယ်နှစ်ခု ပြုလုပ်နိုင်လဲ သတ်မှတ်ပေးပါတယ်။ -1 (default) က ကန့်သတ်ချက် မရှိဘူးလို့ ဆိုလိုပါတယ်။ သာမန် (normal) connections တွေကိုပဲ ဒီ limit ဆီ ရေတွက်တယ်ဆိုတာ သတိပြုပါ။ Prepared transactions တွေရော background worker connections တွေပါ ဒီ limit ထဲ ရေတွက်မခံပါဘူး။
- **[ ENCRYPTED ] PASSWORD 'password'** / **PASSWORD NULL** — Role ရဲ့ password ကို သတ်မှတ်ပေးပါတယ်။ (Password က LOGIN attribute ရှိတဲ့ roles တွေအတွက်ပဲ အသုံးဝင်ပေမယ့် — မရှိတဲ့ roles တွေအတွက်လည်း သတ်မှတ်ပေးလို့ ရပါတယ်။) Password authentication သုံးဖို့ အစီအစဉ် မရှိရင် — ဒီ option ကို ချန်လိုက်နိုင်ပါတယ်။ Password သတ်မှတ်မထားရင် — password ကို null အဖြစ် သတ်မှတ်ပြီး — အဲဒီ user အတွက် password authentication က အမြဲ မအောင်မြင်ပါဘူး။ Null password ကို PASSWORD NULL လို့ ရေးပြီး explicit အနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်။

> **မှတ်ချက်:** Empty string (စာလုံးမပါတဲ့ string) တစ်ခုကို သတ်မှတ်ရင်လည်း password ကို null အဖြစ် သတ်မှတ်ပေးပါတယ် — ဒါပေမယ့် PostgreSQL version 10 မတိုင်ခင်တုန်းကတော့ ဒီလို မဟုတ်ပါဘူး။ အစောပိုင်း versions တွေမှာ — empty string ကို authentication method နဲ့ version အတိအကျပေါ် မူတည်ပြီး သုံးလို့ ရတာရော မရတာရော နှစ်မျိုးလုံး ရှိခဲ့ပြီး — libpq က ဘယ်အခြေအနေမှာမဆို သုံးဖို့ ငြင်းပယ်ပါလိမ့်မယ်။ ဒီ မရေရာမှုကို ရှောင်ရှားဖို့ — empty string သတ်မှတ်တာကို ရှောင်သင့်ပါတယ်။

Password ကို system catalogs တွေထဲမှာ အမြဲတမ်း encrypt (ကုဒ်ဝှက်) လုပ်ပြီး သိမ်းဆည်းပါတယ်။ ENCRYPTED keyword က ဘယ် သက်ရောက်မှုမှ မရှိပေမယ့် — backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် လက်ခံထားပါတယ်။ Encryption နည်းလမ်းကို configuration parameter ဖြစ်တဲ့ password_encryption က ဆုံးဖြတ်ပါတယ်။ တင်ပြလိုက်တဲ့ password string က MD5-encrypted ဒါမှမဟုတ် SCRAM-encrypted format နဲ့ ဖြစ်နေပြီးသားဆိုရင် — password_encryption ဘယ်လိုပဲ ရှိရှိ — အဲဒီအတိုင်းပဲ သိမ်းဆည်းပါတယ် (system က သတ်မှတ်ထားတဲ့ encrypted password string ကို decrypt (ကုဒ်ဖြေ) လုပ်ပြီး တခြား format နဲ့ encrypt လုပ်ဖို့ မဖြစ်နိုင်လို့ပါ)။ ဒါက dump/restore လုပ်နေစဉ်မှာ encrypted passwords တွေကို ပြန်တင် (reload) လုပ်နိုင်စေပါတယ်။

> **သတိပေးချက်:** MD5-encrypted passwords တွေအတွက် support က deprecated (ခေတ်ကုန်) ဖြစ်ပြီး — PostgreSQL ရဲ့ နောင်ထွက်ရှိမယ့် release တစ်ခုမှာ ဖယ်ရှားသွားမှာ ဖြစ်ပါတယ်။ တခြား password type တစ်ခုဆီ ပြောင်းရွှေ့ခြင်းအကြောင်း အသေးစိတ်အတွက် အပိုင်း 20.5 ကို ကြည့်ပါ။

- **VALID UNTIL 'timestamp'** — VALID UNTIL clause က role ရဲ့ password နောက်ပိုင်းမှာ မသက်ဝင်တော့မယ့် နေ့ရက်နဲ့ အချိန်ကို သတ်မှတ်ပေးပါတယ်။ ဒီ clause ကို ချန်လိုက်ရင် — password က အချိန် အားလုံးမှာ သက်ဝင်နေပါလိမ့်မယ်။
- **IN ROLE role_name** — IN ROLE clause က role အသစ်ကို သတ်မှတ်ထားတဲ့ ရှိပြီးသား roles တွေရဲ့ member အဖြစ် အလိုအလျောက် ပေါင်းထည့်စေပါတယ်။ Membership အသစ်မှာ SET option က enable ဖြစ်ပြီး — ADMIN option က disable ဖြစ်ပါလိမ့်မယ်။ NOINHERIT option ကို သတ်မှတ်မထားရင် — INHERIT option က enable ဖြစ်ပါလိမ့်မယ်။
- **ROLE role_name** — ROLE clause က သတ်မှတ်ထားတဲ့ ရှိပြီးသား roles တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကို — SET option enable ဖြစ်ပြီး — member တွေအဖြစ် အလိုအလျောက် ပေါင်းထည့်စေပါတယ်။ ဒါက လက်တွေ့မှာ role အသစ်ကို "group" တစ်ခု ဖြစ်စေပါတယ်။ ဒီ clause ထဲမှာ နာမည်ပေးထားပြီး role-level INHERIT attribute ရှိတဲ့ roles တွေမှာ — membership အသစ်ထဲမှာ INHERIT option က enable ဖြစ်ပါလိမ့်မယ်။ Membership အသစ်တွေမှာ ADMIN option က disable ဖြစ်ပါလိမ့်မယ်။
- **ADMIN role_name** — ADMIN clause က ROLE နဲ့ သက်ရောက်မှု အတူတူပါပဲ — ဒါပေမယ့် နာမည်ပေးထားတဲ့ roles တွေကို ADMIN option enable ဖြစ်ပြီး role အသစ်ရဲ့ members တွေအဖြစ် ထည့်ပေးတာမို့ — သူတို့ကို role အသစ်ထဲမှာ တခြားသူတွေကို membership ပေးအပ်ခွင့် (grant) ရှိစေပါတယ်။
- **SYSID uid** — SYSID clause ကို လျစ်လျူရှုထားပေမယ့် — backwards compatibility အတွက် လက်ခံထားပါတယ်။

## Notes (မှတ်စုများ)

[`ALTER ROLE`](/docs/postgresql/sql-alterrole) ကို သုံးပြီး role တစ်ခုရဲ့ attributes တွေကို ပြောင်းလဲနိုင်သလို — [`DROP ROLE`](/docs/postgresql/sql-droprole) ကို သုံးပြီး role တစ်ခုကို ဖယ်ရှားနိုင်ပါတယ်။ `CREATE ROLE` က သတ်မှတ်ပေးတဲ့ attributes တွေ အားလုံးကို နောက်ပိုင်း `ALTER ROLE` commands တွေနဲ့ ပြုပြင်နိုင်ပါတယ်။

Group တွေအနေနဲ့ သုံးနေတဲ့ roles တွေရဲ့ members တွေကို ပေါင်းထည့်ခြင်း/ဖယ်ရှားခြင်း လုပ်ဖို့ နှစ်သက်ရာ နည်းလမ်းကတော့ [`GRANT`](/docs/postgresql/sql-grant) နဲ့ [`REVOKE`](/docs/postgresql/sql-revoke) ကို သုံးတာ ဖြစ်ပါတယ်။

`VALID UNTIL` clause က password တစ်ခုအတွက်ပဲ သက်တမ်းကုန်ဆုံးချိန် (expiration time) ကို သတ်မှတ်ပေးတာပါ — role ကိုယ်တိုင်အတွက် မဟုတ်ပါဘူး။ အထူးသဖြင့် — password-based မဟုတ်တဲ့ authentication method တစ်ခုနဲ့ login လုပ်နေတဲ့အခါ — ဒီ expiration time ကို ကျင့်သုံးမထားပါဘူး။

ဒီမှာ သတ်မှတ်ထားတဲ့ role attributes တွေက non-inheritable (အမွေမဆက်ခံနိုင်) ပါ — ဥပမာ — `CREATEDB` ရှိတဲ့ role တစ်ခုရဲ့ member ဖြစ်နေတာက — membership grant မှာ `INHERIT` option ရှိနေရင်တောင် — အဲဒီ member ကို database အသစ်တွေ ဖန်တီးခွင့် မပေးပါဘူး။ တကယ်လို့ membership grant မှာ `SET` option ရှိရင်တော့ — member role က createdb role ဆီ [`SET ROLE`](/docs/postgresql/sql-set-role) လုပ်ပြီး — database အသစ်တစ်ခု ဖန်တီးနိုင်မှာ သေချာပါတယ်။

`IN ROLE`, `ROLE` နဲ့ `ADMIN` clauses တွေက ဖန်တီးပေးတဲ့ membership grants တွေမှာ — ဒီ command ကို execute လုပ်နေတဲ့ role က grantor (ပေးအပ်သူ) အနေနဲ့ ပါဝင်ပါတယ်။

`INHERIT` attribute က backwards compatibility အကြောင်းပြချက်တွေနဲ့ default ဖြစ်နေပါတယ်: PostgreSQL ရဲ့ အရင် releases တွေမှာ — users တွေက သူတို့ member ဖြစ်နေတဲ့ groups တွေရဲ့ privileges တွေ အားလုံးကို အမြဲ ဝင်ရောက်ခွင့် ရှိခဲ့ပါတယ်။ ဒါပေမယ့် — `NOINHERIT` ကတော့ SQL standard မှာ သတ်မှတ်ထားတဲ့ semantics တွေနဲ့ ပိုနီးစပ်တဲ့ ကိုက်ညီမှုကို ပေးပါတယ်။

PostgreSQL မှာ [createuser](https://www.postgresql.org/docs/current/app-createuser.html) ဆိုတဲ့ program တစ်ခု ပါဝင်ပြီး — ၎င်းက `CREATE ROLE` နဲ့ လုပ်ဆောင်ချက် အတူတူပဲ (တကယ်တော့ ဒီ command ကို ခေါ်ပါတယ်) ဖြစ်ပေမယ့် — command shell ကနေ run လို့ ရပါတယ်။

`CONNECTION LIMIT` option ကို ခန့်မှန်းခြေအားဖြင့်သာ (approximately) ကျင့်သုံးပါတယ်; role အတွက် connection “slot” တစ်ခုပဲ ကျန်နေချိန်မှာ session အသစ် နှစ်ခု တစ်ချိန်တည်း လောက်နီးပါး စတင်ရင် — နှစ်ခုလုံး မအောင်မြင်တာ ဖြစ်နိုင်ပါတယ်။ ဒါ့အပြင် — ဒီ limit ကို superusers တွေအတွက်တော့ ဘယ်တော့မှ ကျင့်သုံးမထားပါဘူး။

> **သတိပြုရန်:** ဒီ command နဲ့ unencrypted password တစ်ခုကို သတ်မှတ်တဲ့အခါ သတိထား ဆောင်ရွက်ရပါမယ်။ Password က server ဆီကို cleartext (ကုဒ်မဝှက်ထား) အနေနဲ့ ပို့ဆောင်ခံရပြီး — client ရဲ့ command history ဒါမှမဟုတ် server log ထဲမှာလည်း မှတ်တမ်းဝင်သွားနိုင်ပါတယ်။ ဒါပေမယ့် — [createuser](https://www.postgresql.org/docs/current/app-createuser.html) command ကတော့ password ကို encrypt လုပ်ပြီး ပို့ဆောင်ပါတယ်။ ဒါ့အပြင် — [psql](https://www.postgresql.org/docs/current/app-psql.html) မှာ `\password` ဆိုတဲ့ command တစ်ခု ပါဝင်ပြီး — နောက်ပိုင်းမှာ password ကို လုံခြုံစွာ ပြောင်းလဲဖို့ သုံးနိုင်ပါတယ်။

## Examples (ဥပမာများ)

Login ဝင်လို့ရတဲ့ role တစ်ခု ဖန်တီးဖို့ — ဒါပေမယ့် password မပေးဘဲ:

```sql
CREATE ROLE jonathan LOGIN;
```

Password ပါတဲ့ role တစ်ခု ဖန်တီးဖို့:

```sql
CREATE USER davide WITH PASSWORD 'jw8s0F4';
```

(`CREATE USER` က `CREATE ROLE` နဲ့ အတူတူပါပဲ — `LOGIN` ကို ပါဝင်စေတာကလွဲလို့။)

2004 ခုနှစ် ကုန်ဆုံးချိန်အထိ သက်ဝင်မယ့် password ပါတဲ့ role တစ်ခု ဖန်တီးဖို့။ 2005 မှာ တစ်စက္ကန့် ကုန်လွန်ပြီးတာနဲ့ — password က မသက်ဝင်တော့ပါဘူး။

```sql
CREATE ROLE miriam WITH LOGIN PASSWORD 'jw8s0F4' VALID UNTIL '2005-01-01';
```

Database တွေ ဖန်တီးနိုင်ပြီး roles တွေကို စီမံခန့်ခွဲနိုင်တဲ့ role တစ်ခု ဖန်တီးဖို့:

```sql
CREATE ROLE admin WITH CREATEDB CREATEROLE;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE ROLE` statement က SQL standard ထဲမှာ ပါဝင်ပါတယ် — ဒါပေမယ့် standard က syntax ကို ဒီလောက်ပဲ လိုအပ်ပါတယ်:

```sql
CREATE ROLE name [ WITH ADMIN role_name ]
```

Initial administrators အများအပြား သတ်မှတ်နိုင်တာရော — `CREATE ROLE` ရဲ့ တခြား options တွေ အားလုံးပါ — PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

SQL standard က users နဲ့ roles ဆိုတဲ့ concepts တွေကို သတ်မှတ်ထားပေမယ့် — သူတို့ကို သီးခြား concepts တွေအဖြစ် မှတ်ယူပြီး — users တွေကို သတ်မှတ်တဲ့ commands တွေ အားလုံးကို database implementation တစ်ခုချင်းစီအလိုက် သတ်မှတ်ဖို့ ချန်ထားခဲ့ပါတယ်။ PostgreSQL မှာတော့ — users နဲ့ roles တွေကို entity တစ်မျိုးတည်းအဖြစ် ပေါင်းစည်းဖို့ ရွေးချယ်ထားပါတယ်။ ဒါကြောင့် roles တွေမှာ — standard ထဲကထက် — optional attributes တွေ အများကြီး ပိုပြီး ရှိပါတယ်။

SQL standard က သတ်မှတ်ထားတဲ့ အပြုအမူနဲ့ အနီးစပ်ဆုံး ကိုက်ညီမှုကို — SQL-standard users တွေကို `NOINHERIT` option ပါတဲ့ PostgreSQL roles အဖြစ်လည်းကောင်း — SQL-standard roles တွေကို `INHERIT` option ပါတဲ့ PostgreSQL roles အဖြစ်လည်းကောင်း ဖန်တီးခြင်းဖြင့် ရရှိနိုင်ပါတယ်။

`USER` clause က `ROLE` နဲ့ အပြုအမူ အတူတူပါပဲ — ဒါပေမယ့် deprecated (ခေတ်ကုန်) ဖြစ်ပါတယ်:

```sql
USER role_name [, ...]
```

`IN GROUP` clause က `IN ROLE` နဲ့ အပြုအမူ အတူတူပါပဲ — ဒါပေမယ့် deprecated (ခေတ်ကုန်) ဖြစ်ပါတယ်:

```sql
IN GROUP role_name [, ...]
```

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[SET ROLE](/docs/postgresql/sql-set-role), [ALTER ROLE](/docs/postgresql/sql-alterrole), [DROP ROLE](/docs/postgresql/sql-droprole), [GRANT](/docs/postgresql/sql-grant), [REVOKE](/docs/postgresql/sql-revoke), [createuser](https://www.postgresql.org/docs/current/app-createuser.html), [createrole_self_grant](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-CREATEROLE-SELF-GRANT)
