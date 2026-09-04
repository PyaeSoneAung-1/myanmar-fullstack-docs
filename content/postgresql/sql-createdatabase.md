---
title: "CREATE DATABASE (database အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Database အသစ်တစ်ခု ဖန်တီးခြင်း — CREATE DATABASE ၏ syntax နှင့် parameters (OWNER, TEMPLATE, ENCODING, LOCALE, STRATEGY, TABLESPACE, CONNECTION LIMIT, OID စသည်)၊ template database cloning အကြောင်းနှင့် သတိပြုရန် အချက်များ"
order: 140
source: "https://www.postgresql.org/docs/current/sql-createdatabase.html"
status: translated
updated: 2026-09-04
---

## CREATE DATABASE (database အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE DATABASE — database အသစ်တစ်ခု ဖန်တီးပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE DATABASE name
    [ WITH ] [ OWNER [=] user_name ]
           [ TEMPLATE [=] template ]
           [ ENCODING [=] encoding ]
           [ STRATEGY [=] strategy ]
           [ LOCALE [=] locale ]
           [ LC_COLLATE [=] lc_collate ]
           [ LC_CTYPE [=] lc_ctype ]
           [ BUILTIN_LOCALE [=] builtin_locale ]
           [ ICU_LOCALE [=] icu_locale ]
           [ ICU_RULES [=] icu_rules ]
           [ LOCALE_PROVIDER [=] locale_provider ]
           [ COLLATION_VERSION = collation_version ]
           [ TABLESPACE [=] tablespace_name ]
           [ ALLOW_CONNECTIONS [=] allowconn ]
           [ CONNECTION LIMIT [=] connlimit ]
           [ IS_TEMPLATE [=] istemplate ]
           [ OID [=] oid ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE DATABASE` က PostgreSQL database အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

Database တစ်ခု ဖန်တီးဖို့ — သင်ဟာ superuser ဖြစ်ရမယ် ဒါမှမဟုတ် အထူး `CREATEDB` privilege ရှိရပါမယ်။ [CREATE ROLE](https://www.postgresql.org/docs/current/sql-createrole.html) ကို ကြည့်ပါ။

Default အနေနဲ့ — database အသစ်ကို စံ system database ဖြစ်တဲ့ `template1` ကို clone (ပွားယူ) လုပ်ခြင်းဖြင့် ဖန်တီးပါတယ်။ `TEMPLATE name` လို့ ရေးပြီး မတူညီတဲ့ template တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ အထူးသဖြင့် — `TEMPLATE template0` လို့ ရေးခြင်းဖြင့် — user သတ်မှတ်ထားတဲ့ object တွေ မရှိသေးဘဲ system objects တွေကိုလည်း မပြုပြင်ရသေးတဲ့ — သင့် PostgreSQL version က ကြိုသတ်မှတ်ထားတဲ့ စံ objects တွေပဲ သီးသန့် ပါဝင်တဲ့ — pristine (မူလအတိုင်း သန့်ရှင်းနေတဲ့) database တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ `template1` ထဲမှာ ထပ်ဖြည့်ထားနိုင်တဲ့ installation-local object တွေကို ကူးယူခြင်းမှ ရှောင်ရှားချင်ရင် ဒါက အသုံးဝင်ပါတယ်။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် database ရဲ့ နာမည်။
- **user_name** — database အသစ်ကို ပိုင်ဆိုင်မယ့် user ရဲ့ role name၊ ဒါမှမဟုတ် DEFAULT ဆိုရင် default (ဆိုလိုတာက command ကို run နေတဲ့ user ကိုယ်တိုင်) ကို သုံးပါတယ်။ တခြား role တစ်ခုက ပိုင်ဆိုင်တဲ့ database တစ်ခု ဖန်တီးဖို့ — အဲဒီ role ဆီ `SET ROLE` လုပ်နိုင်စွမ်း ရှိရပါမယ်။
- **template** — database အသစ်ကို ဘယ် template ကနေ ဖန်တီးရမယ်ဆိုတဲ့ template နာမည်၊ ဒါမှမဟုတ် DEFAULT ဆိုရင် default template (template1) ကို သုံးပါတယ်။
- **encoding** — database အသစ်ထဲမှာ သုံးမယ့် character set encoding။ String constant (ဥပမာ 'SQL_ASCII') တစ်ခု၊ integer encoding နံပါတ်တစ်ခု ဒါမှမဟုတ် DEFAULT (ဆိုလိုတာက template database ရဲ့ encoding) ကို သတ်မှတ်နိုင်ပါတယ်။ PostgreSQL server က ထောက်ပံ့တဲ့ character sets တွေကို အပိုင်း 23.3.1 မှာ ဖော်ပြထားပါတယ်။ နောက်ထပ် ကန့်သတ်ချက်တွေအတွက် အောက်မှာ ကြည့်ပါ။
- **strategy** — database အသစ် ဖန်တီးရာမှာ သုံးမယ့် strategy။ WAL_LOG strategy ကို သုံးရင် — database ကို block-by-block ကူးယူပြီး — block တစ်ခုချင်းစီကို write-ahead log ထဲကို သီးခြားစီ ရေးသွင်းပါတယ်။ Template database က သေးငယ်တဲ့ ကိစ္စတွေမှာ ဒါက အနိမ့်ဆုံး အကျိုးရှိဆုံး (အထိရောက်ဆုံး) strategy ဖြစ်လို့ default အဖြစ် သုံးပါတယ်။ အသက်ကြီး (အရင်) FILE_COPY strategy ကိုလည်း ရနိုင်ပါသေးတယ်။ ဒီ strategy က target database အတွက် သုံးတဲ့ tablespace တစ်ခုချင်းစီအတွက် write-ahead log ထဲကို record ငယ်တစ်ခု ရေးပါတယ်။ Record တစ်ခုစီက — directory တစ်ခုလုံးကို filesystem အဆင့်မှာ နေရာသစ်တစ်ခုဆီ ကူးယူနေတာကို ကိုယ်စားပြုပါတယ်။ ဒါက write-ahead log ရဲ့ ပမာဏကို သိသိသာသာ လျှော့ချပေးနိုင်ပေမယ့် — အထူးသဖြင့် template database က ကြီးမားရင် — system ကို database အသစ် မဖန်တီးခင် ရော ဖန်တီးပြီးနောက်မှာပါ checkpoint လုပ်ရန် အတင်းဖြစ်စေပါတယ်။ အခြေအနေ အချို့မှာ ဒါက system တစ်ခုလုံးရဲ့ performance အပေါ် သိသာတဲ့ ဆိုးကျိုး သက်ရောက်နိုင်ပါတယ်။ FILE_COPY strategy ကို file_copy_method setting က သက်ရောက်ပါတယ်။
- **locale** — database အသစ်ထဲမှာ default collation order (စီစဉ်မှု အစဉ်) နဲ့ character classification (စာလုံး အမျိုးအစား ခွဲခြားမှု) ကို သတ်မှတ်ပေးပါတယ်။ Collation က string တွေပေါ် သက်ရောက်တဲ့ sort order ကို သက်ရောက်ပါတယ် — ဥပမာ ORDER BY ပါတဲ့ queries တွေ၊ text columns တွေပေါ်က indexes တွေရဲ့ အစဉ် စသည်ဖြင့်ပါ။ Character classification က character တွေရဲ့ အမျိုးအစား ခွဲခြားမှုကို သက်ရောက်ပါတယ် — ဥပမာ lower, upper နဲ့ digit စသည်ဖြင့်ပါ။ Operating system environment ရဲ့ ဆက်စပ်နေတဲ့ ရှုထောင့်တွေ ဖြစ်တဲ့ LC_COLLATE နဲ့ LC_CTYPE ကိုလည်း သတ်မှတ်ပေးပါတယ်။ Default ကတော့ template database ရဲ့ setting အတိုင်း ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 23.2.2.3.1 နဲ့ အပိုင်း 23.2.2.3.2 ကို ကြည့်ပါ။
lc_collate, lc_ctype, builtin_locale ဒါမှမဟုတ် icu_locale တွေကို တစ်ခုချင်းစီ သတ်မှတ်ခြင်းဖြင့် override လုပ်နိုင်ပါတယ်။
locale_provider က builtin ဖြစ်ရင် — locale ဒါမှမဟုတ် builtin_locale ကို သတ်မှတ်ပြီး C, C.UTF-8 ဒါမှမဟုတ် PG_UNICODE_FAST ထဲက တစ်ခုခုအဖြစ် သတ်မှတ်ရပါမယ်။

> **အကြံပြုချက်:** ကျန် locale settings တွေဖြစ်တဲ့ lc_messages, lc_monetary, lc_numeric နဲ့ lc_time တို့က database တစ်ခုချင်းစီအတွက် ပုံသေ သတ်မှတ်ထားတာ မဟုတ်ဘဲ — ဒီ command က သတ်မှတ်ပေးတာလည်း မဟုတ်ပါဘူး။ သီးခြား database တစ်ခုအတွက် သူတို့ကို default ဖြစ်စေချင်ရင် — `ALTER DATABASE ... SET` ကို သုံးနိုင်ပါတယ်။

- **lc_collate** — database server ရဲ့ operating system environment ထဲမှာ LC_COLLATE ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ — locale ကို သတ်မှတ်ထားရင် အဲဒီ locale ရဲ့ setting၊ မဟုတ်ရင် template database ရဲ့ setting အတိုင်း ဖြစ်ပါတယ်။ နောက်ထပ် ကန့်သတ်ချက်တွေအတွက် အောက်မှာ ကြည့်ပါ။
locale_provider က libc ဖြစ်ရင် — database အသစ်ထဲမှာ သုံးမယ့် default collation order ကိုလည်း သတ်မှတ်ပေးပြီး — locale setting ကို override လုပ်ပါတယ်။
- **lc_ctype** — database server ရဲ့ operating system environment ထဲမှာ LC_CTYPE ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ — locale ကို သတ်မှတ်ထားရင် အဲဒီ locale ရဲ့ setting၊ မဟုတ်ရင် template database ရဲ့ setting အတိုင်း ဖြစ်ပါတယ်။ နောက်ထပ် ကန့်သတ်ချက်တွေအတွက် အောက်မှာ ကြည့်ပါ။
locale_provider က libc ဖြစ်ရင် — database အသစ်ထဲမှာ သုံးမယ့် default character classification ကိုလည်း သတ်မှတ်ပေးပြီး — locale setting ကို override လုပ်ပါတယ်။
- **builtin_locale** — locale setting ကို override လုပ်ပြီး — database ရဲ့ default collation order နဲ့ character classification အတွက် builtin provider locale ကို သတ်မှတ်ပေးပါတယ်။ Locale provider က builtin ဖြစ်ရပါမယ်။ Default ကတော့ — locale ကို သတ်မှတ်ထားရင် အဲဒီ locale ရဲ့ setting၊ မဟုတ်ရင် template database ရဲ့ setting အတိုင်း ဖြစ်ပါတယ်။
builtin provider အတွက် ရနိုင်တဲ့ locales တွေကတော့ C, C.UTF-8 နဲ့ PG_UNICODE_FAST ဖြစ်ပါတယ်။
- **icu_locale** — locale setting ကို override လုပ်ပြီး — database ရဲ့ default collation order နဲ့ character classification အတွက် ICU locale (အပိုင်း 23.2.2.3.2 ကို ကြည့်ပါ) ကို သတ်မှတ်ပေးပါတယ်။ Locale provider က ICU ဖြစ်ရပါမယ်။ Default ကတော့ — locale ကို သတ်မှတ်ထားရင် အဲဒီ locale ရဲ့ setting၊ မဟုတ်ရင် template database ရဲ့ setting အတိုင်း ဖြစ်ပါတယ်။
- **icu_rules** — ဒီ database ရဲ့ default collation ရဲ့ အပြုအမူကို customize (စိတ်ကြိုက် ပြုပြင်) လုပ်ဖို့ — နောက်ထပ် collation rules တွေကို သတ်မှတ်ပေးပါတယ်။ ဒါကို ICU အတွက်သာ ထောက်ပံ့ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 23.2.3.4 ကို ကြည့်ပါ။
- **locale_provider** — ဒီ database ထဲက default collation အတွက် သုံးမယ့် provider ကို သတ်မှတ်ပေးပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့ builtin, icu (server ကို ICU support နဲ့ တည်ဆောက်ထားရင်) ဒါမှမဟုတ် libc ဖြစ်ပါတယ်။ Default အနေနဲ့ — provider က template ရဲ့ provider အတိုင်း ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 23.1.4 ကို ကြည့်ပါ။
- **collation_version** — database နဲ့အတူ သိမ်းဆည်းရမယ့် collation version string ကို သတ်မှတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် — ဒါကို ချန်လိုက်သင့်ပြီး — အဲဒီအခါ version ကို operating system က ပေးတဲ့ database collation ရဲ့ တကယ့် version ကနေ တွက်ချက်ပါတယ်။ ဒီ option က ရှိပြီးသား installation တစ်ခုကနေ version ကို ကူးယူဖို့ pg_upgrade က သုံးရန် ရည်ရွယ်ထားပါတယ်။
Database collation version မကိုက်ညီမှုတွေကို ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာအတွက် `ALTER DATABASE` ကိုလည်း ကြည့်ပါ။
- **tablespace_name** — database အသစ်နဲ့ ဆက်စပ်ထားမယ့် tablespace ရဲ့ နာမည်၊ ဒါမှမဟုတ် DEFAULT ဆိုရင် template database ရဲ့ tablespace ကို သုံးပါတယ်။ ဒီ tablespace က ဒီ database ထဲမှာ ဖန်တီးတဲ့ objects တွေအတွက် default tablespace ဖြစ်လာပါမယ်။ နောက်ထပ် အချက်အလက်အတွက် `CREATE TABLESPACE` ကို ကြည့်ပါ။
- **allowconn** — false ဆိုရင် ဘယ်သူမှ ဒီ database ဆီ ချိတ်ဆက်လို့ မရပါဘူး။ Default ကတော့ true ဖြစ်ပြီး — ချိတ်ဆက်မှုတွေကို ခွင့်ပြုပါတယ် (GRANT/REVOKE CONNECT လိုမျိုး တခြား ယန္တရားတွေက ကန့်သတ်ထားတာကလွဲလို့)။
- **connlimit** — ဒီ database ဆီ တစ်ပြိုင်နက် ချိတ်ဆက်မှု ဘယ်လောက် လုပ်နိုင်လဲ။ -1 (default) က ကန့်သတ်ချက် မရှိဘူးလို့ ဆိုလိုပါတယ်။
- **istemplate** — true ဆိုရင် — CREATEDB privilege ရှိတဲ့ user တိုင်း ဒီ database ကို clone လုပ်နိုင်ပါတယ်; false (default) ဆိုရင် — superusers တွေ ဒါမှမဟုတ် database ရဲ့ owner တွေပဲ clone လုပ်နိုင်ပါတယ်။
- **oid** — database အသစ်အတွက် သုံးမယ့် object identifier။ ဒီ parameter ကို သတ်မှတ်မထားရင် — PostgreSQL က သင့်လျော်တဲ့ OID တစ်ခုကို အလိုအလျောက် ရွေးချယ်ပါတယ်။ ဒီ parameter က အဓိကအားဖြင့် pg_upgrade ရဲ့ အတွင်းပိုင်း သုံးစွဲမှုအတွက် ရည်ရွယ်ထားပြီး — 16384 ထက် ငယ်တဲ့ တန်ဖိုးတစ်ခုကို pg_upgrade ကပဲ သတ်မှတ်နိုင်ပါတယ်။

Optional parameters တွေကို အပေါ်မှာ ပြထားတဲ့ အစဉ်အတိုင်းပဲ မဟုတ်ဘဲ — ဘယ်အစဉ်နဲ့မဆို ရေးနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

`CREATE DATABASE` ကို transaction block ထဲမှာ execute လုပ်လို့ မရပါဘူး။

“could not initialize database directory” ဆိုတဲ့ ပုံစံမျိုးက အမှားတွေက — data directory ပေါ်က ခွင့်ပြုချက် (permissions) မလုံလောက်တာ၊ disk ပြည့်နေတာ ဒါမှမဟုတ် တခြား file system ပြဿနာတွေနဲ့ ဆက်စပ်နေနိုင်ခြေ အများဆုံးပါ။

Database တစ်ခုကို ဖယ်ရှားဖို့ [`DROP DATABASE`](/docs/postgresql/sql-dropdatabase) ကို သုံးပါ။

[createdb](https://www.postgresql.org/docs/current/app-createdb.html) program က ဒီ command ကို ပတ်ပြီး အဆင်ပြေစေဖို့ ထောက်ပံ့ထားတဲ့ wrapper program တစ်ခု ဖြစ်ပါတယ်။

Database-level configuration parameters တွေ ([`ALTER DATABASE`](/docs/postgresql/sql-alterdatabase) ကနေ သတ်မှတ်တဲ့) နဲ့ database-level permissions တွေ ([`GRANT`](https://www.postgresql.org/docs/current/sql-grant.html) ကနေ သတ်မှတ်တဲ့) ကို template database ကနေ ကူးယူမပေးပါဘူး။

`template1` မဟုတ်တဲ့ database တစ်ခုကို template အနေနဲ့ နာမည် သတ်မှတ်ပြီး ကူးယူလို့ ရနိုင်ပေမယ့် — ဒါက (လောလောဆယ်) general-purpose “COPY DATABASE” ဆိုတဲ့ စွမ်းဆောင်ချက်အနေနဲ့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ အဓိက ကန့်သတ်ချက်က — template database ကို ကူးယူနေစဉ်မှာ တခြား session တွေ အဲဒီ template database ဆီ ချိတ်ဆက်လို့ မရပါဘူး။ `CREATE DATABASE` စတင်ချိန်မှာ တခြား connection တစ်ခုခု ရှိနေရင် အဲဒီ command က မအောင်မြင်ပါဘူး; မဟုတ်ရင် — `CREATE DATABASE` ပြီးဆုံးတဲ့အထိ template database ဆီ connection အသစ်တွေ ပိတ်ပင်ခံရပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 22.3](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html) ကို ကြည့်ပါ။

Database အသစ်အတွက် သတ်မှတ်ထားတဲ့ character set encoding က ရွေးချယ်ထားတဲ့ locale settings (`LC_COLLATE` နဲ့ `LC_CTYPE`) တွေနဲ့ ကိုက်ညီရပါမယ်။ Locale က `C` (သို့မဟုတ် `POSIX` နဲ့ ညီမျှ) ဆိုရင် — encoding အားလုံး ခွင့်ပြုပါတယ်၊ ဒါပေမယ့် တခြား locale settings တွေမှာတော့ မှန်မှန်ကန်ကန် အလုပ်လုပ်မယ့် encoding တစ်ခုတည်းပဲ ရှိပါတယ်။ (Windows မှာတော့ UTF-8 encoding ကို locale မရွေး သုံးနိုင်ပါတယ်။) `CREATE DATABASE` က superuser တွေကို — locale settings မသက်ဆိုင်ဘဲ `SQL_ASCII` encoding သတ်မှတ်ခွင့် ပြုပါတယ် — ဒါပေမယ့် ဒီရွေးချယ်မှုက deprecated (ခေတ်ကုန်) ဖြစ်ပြီး — locale နဲ့ encoding-ကိုက်ညီမှု မရှိတဲ့ data တွေကို database ထဲမှာ သိမ်းထားရင် character-string functions တွေ မှားယွင်းစွာ အပြုအမူ လုပ်တတ်ပါတယ်။

Encoding နဲ့ locale settings တွေက template database ရဲ့ settings တွေနဲ့ ကိုက်ညီရပါမယ် — `template0` ကို template အဖြစ် သုံးတဲ့အခါကလွဲလို့ပါ။ ဒါက — တခြား database တွေမှာ သတ်မှတ်ထားတဲ့ encoding နဲ့ မကိုက်ညီတဲ့ data တွေ ဒါမှမဟုတ် `LC_COLLATE` နဲ့ `LC_CTYPE` ရဲ့ သက်ရောက်မှု ခံရတဲ့ sort ordering ပါတဲ့ indexes တွေ ပါဝင်နေနိုင်လို့ပါ။ အဲဒီလို data တွေကို ကူးယူမိရင် — setting အသစ်တွေအရ ပျက်စီးနေတဲ့ (corrupt) database တစ်ခု ဖြစ်ပေါ်စေနိုင်ပါတယ်။ ဒါပေမယ့် `template0` မှာတော့ သက်ရောက်မှု ခံရနိုင်တဲ့ data ဒါမှမဟုတ် index တွေ မရှိတာ သေချာပါတယ်။

လောလောဆယ် — nondeterministic comparisons (ခန့်မှန်းမရတဲ့ နှိုင်းယှဉ်မှုများ) နဲ့ database locale တစ်ခုကို သုံးဖို့ option မရှိပါဘူး (ရှင်းလင်းချက်အတွက် [`CREATE COLLATION`](https://www.postgresql.org/docs/current/sql-createcollation.html) ကို ကြည့်ပါ)။ ဒါ လိုအပ်ရင်တော့ — per-column collations တွေကို သုံးဖို့ လိုပါလိမ့်မယ်။

`CONNECTION LIMIT` option ကို ခန့်မှန်းခြေအားဖြင့်သာ ကျင့်သုံးပါတယ်; database အတွက် connection “slot” တစ်ခုပဲ ကျန်နေချိန်မှာ session အသစ် နှစ်ခု တစ်ပြိုင်နက် စတင်ရင် — နှစ်ခုလုံး မအောင်မြင်တာ ဖြစ်နိုင်ပါတယ်။ ဒါ့အပြင် — ဒီ ကန့်သတ်ချက်ကို superusers တွေ ဒါမှမဟုတ် background worker processes တွေအပေါ်မှာတော့ ကျင့်သုံးမထားပါဘူး။

## Examples (ဥပမာများ)

Database အသစ်တစ်ခု ဖန်တီးဖို့:

```sql
CREATE DATABASE lusiadas;
```

`salesapp` user က ပိုင်ဆိုင်ပြီး default tablespace က `salesspace` ဖြစ်တဲ့ `sales` database တစ်ခု ဖန်တီးဖို့:

```sql
CREATE DATABASE sales OWNER salesapp TABLESPACE salesspace;
```

မတူညီတဲ့ locale တစ်ခုနဲ့ `music` database တစ်ခု ဖန်တီးဖို့:

```sql
CREATE DATABASE music
    LOCALE 'sv_SE.utf8'
    TEMPLATE template0;
```

ဒီဥပမာမှာ — သတ်မှတ်ထားတဲ့ locale က `template1` ထဲက locale နဲ့ မတူညီရင် `TEMPLATE template0` clause က လိုအပ်ပါတယ်။ (မတူညီတာ မဟုတ်ရင် — locale ကို explicit သတ်မှတ်တာက ထပ်နေတဲ့ အလုပ်ပဲ ဖြစ်ပါတယ်။)

မတူညီတဲ့ locale တစ်ခုနဲ့ မတူညီတဲ့ character set encoding တစ်ခု ပါတဲ့ `music2` database တစ်ခု ဖန်တီးဖို့:

```sql
CREATE DATABASE music2
    LOCALE 'sv_SE.iso885915'
    ENCODING LATIN9
    TEMPLATE template0;
```

သတ်မှတ်ထားတဲ့ locale နဲ့ encoding settings တွေ ကိုက်ညီရမှာ ဖြစ်ပြီး — မကိုက်ညီရင် error အစီရင်ခံပါလိမ့်မယ်။

Locale နာမည်တွေက operating system တစ်ခုချင်းစီအလိုက် သီးခြားစီ ဖြစ်လို့ — အပေါ်က command တွေက နေရာတိုင်းမှာ တစ်ပုံစံတည်း အလုပ်လုပ်ချင်မှ လုပ်ပါလိမ့်မယ်ဆိုတာ သတိပြုပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `CREATE DATABASE` statement ဆိုတာ မရှိပါဘူး။ Databases တွေက catalogs တွေနဲ့ ညီမျှပြီး — အဲဒါတွေရဲ့ ဖန်တီးမှုက implementation-defined (အကောင်အထည်ဖော်မှု တစ်ခုချင်းစီအလိုက် သတ်မှတ်) ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER DATABASE](/docs/postgresql/sql-alterdatabase), [DROP DATABASE](/docs/postgresql/sql-dropdatabase)
