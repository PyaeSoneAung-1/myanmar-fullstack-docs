---
title: "SHOW (run-time parameter တစ်ခု၏ တန်ဖိုးကို ပြသခြင်း)"
description: "Run-time parameter တစ်ခု၏ လက်ရှိ setting တန်ဖိုးကို ပြသပေးသည့် command — SHOW name နှင့် SHOW ALL ပုံစံများ ပါဝင်ပြီး SERVER_VERSION, SERVER_ENCODING, IS_SUPERUSER ကဲ့သို့ ပြသနိုင်သော်လည်း သတ်မှတ်၍ မရသည့် parameters များကိုလည်း ဖော်ပြထားသည်"
order: 185
source: "https://www.postgresql.org/docs/current/sql-show.html"
status: translated
updated: 2026-09-04
---

## SHOW (run-time parameter တစ်ခု၏ တန်ဖိုးကို ပြသခြင်း)

SHOW — run-time parameter (runtime သတ်မှတ်ချက်) တစ်ခုရဲ့ တန်ဖိုးကို ပြသပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SHOW name
SHOW ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SHOW` က run-time parameters တွေရဲ့ လက်ရှိ setting (လက်ရှိ သတ်မှတ်ချက်) တွေကို ပြသပေးပါလိမ့်မယ်။ ဒီ variables တွေကို — `SET` statement ကို သုံးပြီးဖြစ်စေ၊ `postgresql.conf` configuration file ကို တည်းဖြတ်ပြီးဖြစ်စေ၊ `PGOPTIONS` environment variable (libpq ဒါမှမဟုတ် libpq-based application တစ်ခုကို သုံးတဲ့အခါ) ကတစ်ဆင့်ဖြစ်စေ၊ `postgres` server ကို စတင်တဲ့အခါ command-line flags (command line အလံများ) ကတစ်ဆင့်ဖြစ်စေ — သတ်မှတ်လို့ ရပါတယ်။ အသေးစိတ်တွေအတွက် [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — Run-time parameter တစ်ခုရဲ့ နာမည်။ ရရှိနိုင်တဲ့ parameters တွေကို အခန်း 19 နဲ့ SET reference page (SET ကိုးကားစာမျက်နှာ) ပေါ်မှာ ဖော်ပြထားပါတယ်။ ဒါ့အပြင် — ပြသနိုင်ပေမယ့် သတ်မှတ်လို့ မရတဲ့ parameters အနည်းငယ်လည်း ရှိပါသေးတယ်:

SERVER_VERSION

Server ရဲ့ version နံပါတ်ကို ပြသပါတယ်။

SERVER_ENCODING

Server-side character set encoding (server ဘက်က စာလုံးအစု ကုဒ်ပြောင်းခြင်း) ကို ပြသပါတယ်။ လက်ရှိမှာ — ဒီ parameter ကို ပြသနိုင်ပေမယ့် သတ်မှတ်လို့ မရပါဘူး; အကြောင်းကတော့ — encoding ကို database ဖန်တီးချိန်မှာ ဆုံးဖြတ်ပြီးသား ဖြစ်လို့ပါ။

IS_SUPERUSER

လက်ရှိ role မှာ superuser privileges (superuser အခွင့်အရေးများ) ရှိရင် true ဖြစ်ပါတယ်။
- **ALL** — Configuration parameters တွေ အားလုံးရဲ့ တန်ဖိုးတွေကို — ဖော်ပြချက် (descriptions) တွေနဲ့အတူ — ပြသပေးပါတယ်။

## Notes (မှတ်စုများ)

`current_setting` ဆိုတဲ့ function ကလည်း — ညီမျှတဲ့ output (တူညီသော ရလဒ်) တစ်ခုကို ထုတ်ပေးပါတယ်; [အပိုင်း 9.28.1](/docs/postgresql/functions-admin) ကို ကြည့်ပါ။ ဒါ့အပြင် — [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html) system view ကလည်း အလားတူ အချက်အလက်တွေကို ထုတ်ပေးပါတယ်။

## Examples (ဥပမာများ)

`DateStyle` parameter ရဲ့ လက်ရှိ setting ကို ပြသခြင်း:

```sql
SHOW DateStyle;
 DateStyle
-----------
 ISO, MDY
(1 row)
```

`geqo` parameter ရဲ့ လက်ရှိ setting ကို ပြသခြင်း:

```sql
SHOW geqo;
 geqo
------
 on
(1 row)
```

Settings အားလုံးကို ပြသခြင်း:

```sql
SHOW ALL;
            name         | setting |                description
-------------------------+---------+-------------------------------------------------
 allow_system_table_mods | off     | Allows modifications of the structure of ...
    .
    .
    .
 xmloption               | content | Sets whether XML data in implicit parsing ...
 zero_damaged_pages      | off     | Continues processing past damaged page headers.
(196 rows)
```

## Compatibility (လိုက်ဖက်ညီမှု)

`SHOW` command က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[SET](/docs/postgresql/sql-set), [RESET](/docs/postgresql/sql-reset)
