---
title: "Locale Support (Locale ထောက်ပံ့မှု)"
description: "Locale (ဒေသသုံး ဘာသာစကား/ယဉ်ကျေးမှု ဆက်တင်) ထောက်ပံ့မှုအကြောင်း — locale ၏ အဓိပ္ပာယ်နှင့် `initdb` ၏ `--locale` option သုံးပြီး database cluster တစ်ခုအတွက် locale သတ်မှတ်ခြင်း၊ locale subcategories များ (`LC_COLLATE`, `LC_CTYPE`, `LC_MESSAGES`, `LC_MONETARY`, `LC_NUMERIC`, `LC_TIME`) ဇယား၊ locale ၏ အပြုအမူ (ORDER BY နှင့် text data စီစဉ်မှု, upper/lower/initcap functions, pattern matching operators, to_char family, LIKE clauses နှင့် indexes)၊ locales ရွေးချယ်နိုင်သည့် scope အဆင့်များ (operating system environment, initdb options, database တစ်ခုချင်း, table column/collation, query တစ်ခုချင်း)၊ locale providers (builtin, icu, libc) အသေးစိတ်၊ ICU locale နာမည်များနှင့် language tags (BCP 47, `-u` extensions, canonicalization/validation)၊ နှင့် locale ပြဿနာများ ရှာဖွေ ဖြေရှင်းခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 184
source: "https://www.postgresql.org/docs/current/locale.html"
status: translated
updated: 2026-09-06
---

## 23.1. Locale Support (Locale ထောက်ပံ့မှု)

- **23.1.1. Overview (ခြုံငုံ သုံးသပ်ချက်)**
- **23.1.2. Behavior (အပြုအမူ)**
- **23.1.3. Selecting Locales (Locales ရွေးချယ်ခြင်း)**
- **23.1.4. Locale Providers (Locale providers များ)**
- **23.1.5. ICU Locales (ICU locales များ)**
- **23.1.6. Problems (ပြဿနာများ)**

*Locale* (ဒေသသုံး ဘာသာစကားနှင့် ယဉ်ကျေးမှု ဆက်တင်) ထောက်ပံ့မှုဆိုတာက — application (အပလီကေးရှင်း) တစ်ခုက အက္ခရာများ (alphabets)၊ စီစဉ်မှု (sorting)၊ နံပါတ် ဖော်မတ်ချခြင်း (number formatting) စတဲ့ — ယဉ်ကျေးမှုဆိုင်ရာ ဦးစားပေး နှစ်သက်မှုတွေကို လေးစား လိုက်နာခြင်းကို ရည်ညွှန်းပါတယ်။ PostgreSQL က server operating system (server ၏ လည်ပတ်စနစ်) က ထောက်ပံ့ပေးတဲ့ — standard ISO C နဲ့ POSIX ရဲ့ locale facilities တွေကို အသုံးပြုပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် သင့်စနစ်ရဲ့ documentation (စာရွက်စာတမ်းများ) ကို ကိုးကား ကြည့်ရှုပါ။

### 23.1.1. Overview (ခြုံငုံ သုံးသပ်ချက်)

Locale support ကို — `initdb` သုံးပြီး database cluster တစ်ခု ဖန်တီးတဲ့အခါ — အလိုအလျောက် initialize (ကနဦး ပြင်ဆင်) လုပ်ပါတယ်။ `initdb` က default အနေနဲ့ — သူ run လုပ်တဲ့ environment (လုပ်ဆောင်မှု ပတ်ဝန်းကျင်) ရဲ့ locale ဆက်တင်နဲ့ပဲ database cluster ကို initialize လုပ်မှာ ဖြစ်လို့ — သင့်စနစ်က သင့် database cluster မှာ လိုချင်တဲ့ locale ကို သုံးဖို့ သတ်မှတ်ထားပြီးသား ဖြစ်နေရင် — နောက်ထပ် ဘာမှ လုပ်စရာ မလိုပါဘူး။ မတူညီတဲ့ locale တစ်ခုကို သုံးချင်တယ်ဆိုရင် (ဒါမှမဟုတ် သင့်စနစ်က ဘယ် locale နဲ့ သတ်မှတ်ထားလဲ မသေချာဘူးဆိုရင်) — `--locale` option ကို သတ်မှတ်ပြီး — `initdb` ကို ဘယ် locale ကို သုံးရမလဲ အတိအကျ ညွှန်ကြားနိုင်ပါတယ်။ ဥပမာ:

```sql
initdb --locale=sv_SE
```

Unix စနစ်တွေအတွက် ဒီဥပမာက locale ကို — ဆွီဒင်နိုင်ငံ (`SE`) မှာ ပြောဆိုတဲ့ ဆွီဒင် (`sv`) ဘာသာစကားအဖြစ် သတ်မှတ်ပါတယ်။ တခြား ဖြစ်နိုင်ခြေတွေကတော့ `en_US` (U.S. အင်္ဂလိပ်) နဲ့ `fr_CA` (ကနေဒါ ပြင်သစ်) တို့ ပါဝင်နိုင်ပါတယ်။ Locale တစ်ခုအတွက် character set (စာလုံး အစုအဝေး) တစ်ခုထက် ပိုပြီး သုံးလို့ရတယ်ဆိုရင် — သတ်မှတ်ချက်တွေက `language_territory.codeset` ပုံစံ ရှိနိုင်ပါတယ်။ ဥပမာ — `fr_BE.UTF-8` က ဘယ်လ်ဂျီယံနိုင်ငံ (BE) မှာ ပြောဆိုတဲ့ ပြင်သစ် (fr) ဘာသာစကားကို — UTF-8 character set encoding နဲ့ ကိုယ်စားပြုပါတယ်။

သင့်စနစ်မှာ ဘယ် locales တွေ ဘယ်နာမည်တွေနဲ့ ရနိုင်လဲဆိုတာက — operating system vendor (လည်ပတ်စနစ် ထုတ်လုပ်သူ) က ဘာတွေ ထောက်ပံ့ပေးလဲ ဆိုတာနဲ့ ဘာတွေ install (တပ်ဆင်) ထားလဲဆိုတာပေါ်မှာ မူတည်ပါတယ်။ Unix စနစ် အများစုမှာ `locale -a` command က ရရှိနိုင်တဲ့ locales စာရင်း တစ်ခုကို ပေးပါတယ်။ Windows ကတော့ `German_Germany` ဒါမှမဟုတ် `Swedish_Sweden.1252` လို — ပိုပြီး ရှည်လျားတဲ့ locale နာမည်တွေကို သုံးပေမယ့် — အခြေခံ မူတွေကတော့ အတူတူပါပဲ။

ရံဖန်ရံခါ — locale အများအပြားရဲ့ စည်းမျဉ်းတွေကို ရောနှော သုံးတာ အသုံးဝင်ပါတယ် — ဥပမာ — အင်္ဂလိပ် collation စည်းမျဉ်းတွေကို သုံးပေမယ့် messages တွေကိုတော့ စပိန်ဘာသာနဲ့ ပြစေချင်တာမျိုးပါ။ ဒါကို ထောက်ပံ့ဖို့ — localization (ဒေသသုံး ပြောင်းလဲခြင်း) စည်းမျဉ်းတွေရဲ့ အချို့ သွင်ပြင်တွေကိုပဲ ထိန်းချုပ်ပေးတဲ့ — locale subcategories (အမျိုးအစားခွဲများ) အစုတစ်ခု ရှိပါတယ်:

| `LC_COLLATE` | String sort order (စာသား string များ စီစဉ်မှု အစဉ်) |
| --- | --- |
| `LC_CTYPE` | Character classification (စာလုံး အမျိုးအစား ခွဲခြားမှု — စာလုံးတစ်လုံးဆိုတာ ဘာလဲ? ၎င်းရဲ့ စာလုံးအကြီး (upper-case) နှင့် ညီမျှသော ပုံစံက ဘာလဲ?) |
| `LC_MESSAGES` | Language of messages (messages — သတင်းစကားများ — ၏ ဘာသာစကား) |
| `LC_MONETARY` | Formatting of currency amounts (ငွေကြေး ပမာဏများကို ဖော်မတ်ချခြင်း) |
| `LC_NUMERIC` | Formatting of numbers (နံပါတ်များကို ဖော်မတ်ချခြင်း) |
| `LC_TIME` | Formatting of dates and times (ရက်စွဲများနှင့် အချိန်များကို ဖော်မတ်ချခြင်း) |

ဒီ category နာမည်တွေက — သီးခြား category တစ်ခုအတွက် locale ရွေးချယ်မှုကို ပြောင်းလဲ (override) လုပ်ဖို့ သုံးတဲ့ — `initdb` options တွေရဲ့ နာမည်တွေနဲ့ ကိုက်ညီပါတယ်။ ဥပမာ — locale ကို ကနေဒါ ပြင်သစ်လို သတ်မှတ်ပေမယ့် ငွေကြေး ဖော်မတ်ချခြင်းအတွက်တော့ U.S. စည်းမျဉ်းတွေကို သုံးချင်တယ်ဆိုရင် — `initdb --locale=fr_CA --lc-monetary=en_US` ကို သုံးပါ။

စနစ်က locale support မရှိသလိုမျိုး အပြုအမူ ရှိစေချင်တယ်ဆိုရင် — `C` ဆိုတဲ့ အထူး locale နာမည် (သို့မဟုတ် ညီမျှတဲ့ `POSIX`) ကို သုံးပါ။

Locale category တချို့ကို database ဖန်တီးတဲ့အခါမှာကိုပဲ တန်ဖိုးတွေ ပုံသေ (fixed) သတ်မှတ်ထားရပါတယ်။ Database အမျိုးမျိုးအတွက် မတူညီတဲ့ ဆက်တင်တွေကို သုံးလို့ ရပေမယ့် — database တစ်ခု ဖန်တီးပြီးသွားရင် — အဲဒီ database အတွက် အဲဒါတွေကို နောက်ထပ် ပြောင်းလဲလို့ မရတော့ပါဘူး။ `LC_COLLATE` နဲ့ `LC_CTYPE` တို့က ဒီလို category တွေ ဖြစ်ပါတယ်။ ၎င်းတို့က indexes တွေရဲ့ sort order (စီစဉ်မှု အစဉ်) ကို သက်ရောက်မှု ရှိလို့ — သူတို့ကို ပုံသေ ထားရပါမယ် — မဟုတ်ရင် text columns တွေပေါ်က indexes တွေ corrupt (ပျက်စီး) သွားနိုင်ပါတယ်။ (ဒါပေမယ့် — collations တွေကို သုံးပြီး ဒီကန့်သတ်ချက်ကို သက်သာစေနိုင်ပါတယ် — [အပိုင်း 23.2](https://www.postgresql.org/docs/current/collation.html) မှာ ဆွေးနွေးထားသလိုပါ။) ဒီ category တွေရဲ့ default တန်ဖိုးတွေကို `initdb` run လုပ်တဲ့အခါ ဆုံးဖြတ်ပြီး — `CREATE DATABASE` command မှာ သီးခြား သတ်မှတ်မထားဘူးဆိုရင် — database အသစ်တွေ ဖန်တီးတဲ့အခါ အဲဒီ တန်ဖိုးတွေကို သုံးပါတယ်။

ကျန် locale category တွေကိုတော့ — locale category တွေနဲ့ နာမည်တူတဲ့ server configuration parameters တွေကို သတ်မှတ်ပြီး — အလိုရှိတဲ့အခါ ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ် (အသေးစိတ်အတွက် [အပိုင်း 19.11.2](https://www.postgresql.org/docs/current/runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT) ကို ကြည့်ပါ)။ `initdb` က ရွေးချယ်လိုက်တဲ့ တန်ဖိုးတွေက တကယ်တော့ — server စတင်တဲ့အခါ defaults တွေအဖြစ် ဆောင်ရွက်ဖို့ — configuration ဖိုင် `postgresql.conf` ထဲကိုပဲ ရေးသွင်းတာ ဖြစ်ပါတယ်။ ဒီ assignments (သတ်မှတ်ချက်များ) တွေကို `postgresql.conf` ကနေ ဖယ်ရှားလိုက်ရင် — server က သူ့ရဲ့ execution environment (လုပ်ဆောင်မှု ပတ်ဝန်းကျင်) ကနေ ဆက်တင်တွေကို အမွေရယူ (inherit) ပါလိမ့်မယ်။

Server ရဲ့ locale အပြုအမူကို — client ဘယ်သူ့ရဲ့ environment ကမှ မဟုတ်ဘဲ — server က မြင်ရတဲ့ environment variables တွေက ဆုံးဖြတ်တယ်ဆိုတာ သတိပြုပါ။ ဒါကြောင့် — server ကို မစတင်ခင် — မှန်ကန်တဲ့ locale ဆက်တင်တွေကို configure (ပြင်ဆင်သတ်မှတ်) ထားဖို့ ဂရုစိုက်ပါ။ ဒီအချက်ရဲ့ အကျိုးဆက် တစ်ခုကတော့ — client နဲ့ server တို့ကို မတူညီတဲ့ locales တွေနဲ့ သတ်မှတ်ထားရင် — messages တွေ ဘယ်က စတင်တယ်ဆိုတာပေါ် မူတည်ပြီး — မတူညီတဲ့ ဘာသာစကားတွေနဲ့ ပေါ်လာနိုင်ပါတယ်။

> **မှတ်ချက်:** execution environment (လုပ်ဆောင်မှု ပတ်ဝန်းကျင်) ကနေ locale ကို အမွေရယူတယ်လို့ ပြောတဲ့အခါ — operating system အများစုမှာ ဒီလို ဆိုလိုပါတယ်: locale category တစ်ခုအတွက် — ဥပမာ collation လို့ ဆိုပါစို့ — အောက်ပါ environment variables တွေကို — တစ်ခုခု set (သတ်မှတ်) ထားတာ တွေ့သည်အထိ — ဒီအစဉ်အတိုင်း စစ်ဆေးပါတယ်: `LC_ALL`, `LC_COLLATE` (ဒါမှမဟုတ် သက်ဆိုင်ရာ category နဲ့ ကိုက်ညီတဲ့ variable)၊ `LANG`။ ဒီ environment variables တွေ ဘာမှ set မထားဘူးဆိုရင် — locale က `C` ကို default ပြုပါတယ်။
>
> Message localization (message ဘာသာပြန်) library တချို့က `LANGUAGE` environment variable ကိုလည်း ကြည့်ပါတယ် — ဒါက messages တွေရဲ့ ဘာသာစကားကို သတ်မှတ်ရာမှာ — တခြား locale ဆက်တင်တွေ အားလုံးကို ကျော်လွှား (override) ပါတယ်။ မသေချာရင် သင့် operating system ရဲ့ documentation — အထူးသဖြင့် gettext အကြောင်း documentation — ကို ကိုးကား ကြည့်ရှုပါ။

Messages တွေကို user နှစ်သက်ရာ ဘာသာစကားနဲ့ ပြန်ဆိုနိုင်ဖို့ဆိုရင် — NLS ကို build လုပ်ချိန်မှာ ရွေးချယ်ထားရပါမယ် (`configure --enable-nls`)။ ကျန် locale support အားလုံးကတော့ အလိုအလျောက် built in (တည်ဆောက်ပြီးသား ပါဝင်) ဖြစ်ပါတယ်။

### 23.1.2. Behavior (အပြုအမူ)

Locale ဆက်တင်တွေက အောက်ပါ SQL features တွေကို သက်ရောက်ပါတယ်:

- Textual data (စာသား data) တွေပေါ်မှာ ORDER BY ဒါမှမဟုတ် standard comparison operators (စံ နှိုင်းယှဉ်မှု operator များ) တွေကို သုံးတဲ့ queries တွေထဲက sort order (စီစဉ်မှု အစဉ်)
- upper, lower နဲ့ initcap functions တွေ
- Pattern matching operators (ပုံစံ ကိုက်ညီမှု operator များ) — LIKE, SIMILAR TO နဲ့ POSIX-style regular expressions တို့ ဖြစ်ပါတယ်; locales တွေက case insensitive (စာလုံးအကြီးအသေး ခွဲခြားမှု မရှိသော) matching ကိုရော — character-class regular expressions တွေအားဖြင့် character တွေကို အမျိုးအစား ခွဲခြားမှုကိုပါ သက်ရောက်ပါတယ်
- to_char function မိသားစု (family)
- LIKE clauses တွေနဲ့ indexes တွေကို သုံးနိုင်စွမ်း

PostgreSQL မှာ `C` ဒါမှမဟုတ် `POSIX` ကလွဲပြီး တခြား locales တွေကို သုံးခြင်းရဲ့ အားနည်းချက်ကတော့ performance (စွမ်းဆောင်ရည်) အပေါ် သက်ရောက်မှုပါ။ Character handling (စာလုံး ကိုင်တွယ်မှု) ကို နှေးကွေးစေပြီး — သာမန် indexes တွေကို `LIKE` က သုံးနိုင်တာကိုလည်း တားဆီးပါတယ်။ ဒါကြောင့် — တကယ် လိုအပ်မှသာ locales တွေကို သုံးပါ။

C မဟုတ်တဲ့ locale တစ်ခုအောက်မှာ PostgreSQL က `LIKE` clauses တွေနဲ့ indexes တွေကို သုံးနိုင်စေဖို့ — workaround (အစားထိုး နည်းလမ်း) အနေနဲ့ — custom operator classes အများအပြား ရှိပါတယ်။ ဒါတွေက locale ရဲ့ နှိုင်းယှဉ်မှု စည်းမျဉ်းတွေကို လျစ်လျူရှုပြီး — တင်းကြပ်တဲ့ character-by-character (character တစ်လုံးချင်းစီ) နှိုင်းယှဉ်မှုကို လုပ်ဆောင်တဲ့ index တစ်ခု ဖန်တီးနိုင်စေပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 11.10](https://www.postgresql.org/docs/current/indexes-opclass.html) ကို ကိုးကား ကြည့်ရှုပါ။ နောက်ထပ် နည်းလမ်းတစ်ခုကတော့ — [အပိုင်း 23.2](https://www.postgresql.org/docs/current/collation.html) မှာ ဆွေးနွေးထားသလို — `C` collation ကို သုံးပြီး indexes တွေ ဖန်တီးတာ ဖြစ်ပါတယ်။

### 23.1.3. Selecting Locales (Locales ရွေးချယ်ခြင်း)

Locales တွေကို လိုအပ်ချက်တွေပေါ် မူတည်ပြီး — scope (နယ်ပယ်) အမျိုးမျိုးမှာ ရွေးချယ်နိုင်ပါတယ်။ အပေါ်က ခြုံငုံ သုံးသပ်ချက်မှာ — cluster တစ်ခုလုံးအတွက် defaults တွေ သတ်မှတ်ဖို့ `initdb` ကို သုံးပြီး locales တွေကို ဘယ်လို သတ်မှတ်လဲ ပြခဲ့ပါတယ်။ အောက်ပါ စာရင်းက locales တွေကို ဘယ်နေရာတွေမှာ ရွေးချယ်လို့ရလဲ ပြပါတယ်။ Item တစ်ခုချင်းစီက နောက်ဆက်တွဲ items တွေအတွက် defaults တွေကို ထောက်ပံ့ပေးပြီး — အောက်ဘက် item တစ်ခုချင်းစီက defaults တွေကို ပိုမို သေးငယ်တဲ့ granularity (အသေးစိတ် အတိုင်းအတာ) နဲ့ ပြောင်းလဲ (override) လုပ်ခွင့် ပေးပါတယ်။

1. အပေါ်မှာ ရှင်းပြခဲ့သလို — operating system ရဲ့ environment က — အသစ် initialize လုပ်လိုက်တဲ့ database cluster တစ်ခုရဲ့ locales တွေအတွက် defaults တွေကို ထောက်ပံ့ပါတယ်။ အများစုမှာ ဒါက လုံလောက်ပါတယ်: operating system ကို လိုချင်တဲ့ ဘာသာစကား/ဒေသအတွက် configure လုပ်ထားရင် — PostgreSQL ကလည်း default အနေနဲ့ အဲဒီ locale အတိုင်း အပြုအမူ ရှိပါလိမ့်မယ်။
2. အပေါ်မှာ ပြခဲ့သလို — initdb အတွက် command-line options တွေက — အသစ် initialize လုပ်လိုက်တဲ့ database cluster တစ်ခုအတွက် locale ဆက်တင်တွေကို သတ်မှတ်ပါတယ်။ Operating system မှာ သင့် database system အတွက် လိုချင်တဲ့ locale configuration မရှိဘူးဆိုရင် ဒါကို သုံးပါ။
3. Locale တစ်ခုကို database တစ်ခုချင်းစီအတွက် သီးခြား ရွေးချယ်နိုင်ပါတယ်။ SQL command ဖြစ်တဲ့ CREATE DATABASE နဲ့ ၎င်းနဲ့ ညီမျှတဲ့ command-line tool ဖြစ်တဲ့ createdb တို့မှာ ဒီအတွက် options တွေ ရှိပါတယ်။ ဥပမာ — database cluster တစ်ခုထဲမှာ — လိုအပ်ချက် မတူညီတဲ့ tenants (ငှားရမ်း အသုံးပြုသူများ) အများအပြားအတွက် databases တွေ ထားရှိတဲ့အခါ ဒါကို သုံးပါ။
4. Locale ဆက်တင်တွေကို table column တစ်ခုချင်းစီအတွက် ပြုလုပ်နိုင်ပါတယ်။ ဒါက collation လို့ခေါ်တဲ့ SQL object တစ်ခုကို သုံးပြီး — အပိုင်း 23.2 မှာ ရှင်းပြထားပါတယ်။ ဥပမာ — data တွေကို ဘာသာစကား အမျိုးမျိုးနဲ့ စီရာမှာ ဒါမှမဟုတ် table တစ်ခုရဲ့ sort order ကို စိတ်ကြိုက် ပြင်ဆင်ရာမှာ ဒါကို သုံးပါ။
5. နောက်ဆုံးအနေနဲ့ — locales တွေကို query တစ်ခုချင်းစီအတွက် ရွေးချယ်နိုင်ပါတယ်။ ဒါကလည်း SQL collation objects တွေကိုပဲ သုံးပါတယ်။ Run-time (လည်ပတ်ချိန်) ရွေးချယ်မှုတွေအပေါ် အခြေခံပြီး sort order ကို ပြောင်းလဲဖို့ ဒါမှမဟုတ် — လက်တန်း စမ်းသပ်မှု (ad-hoc experimentation) တွေအတွက် ဒါကို သုံးနိုင်ပါတယ်။

### 23.1.4. Locale Providers (Locale providers များ)

Locale provider (locale ထောက်ပံ့ပေးသူ) တစ်ခုက — collations တွေနဲ့ character classifications တွေအတွက် locale အပြုအမူကို ဘယ် library က သတ်မှတ်လဲဆိုတာ သတ်မှတ်ပါတယ်။

အပေါ်မှာ ဖော်ပြခဲ့တဲ့အတိုင်း locale ဆက်တင်တွေကို ရွေးချယ်တဲ့ commands နဲ့ tools တွေ တစ်ခုချင်းစီမှာ — locale provider ကို ရွေးချယ်ဖို့ option တစ်ခုစီ ရှိပါတယ်။ ICU provider ကို သုံးပြီး database cluster တစ်ခုကို initialize လုပ်တဲ့ ဥပမာကတော့:

```sql
initdb --locale-provider=icu --icu-locale=en
```

သက်ဆိုင်ရာ commands နဲ့ programs တွေရဲ့ ဖော်ပြချက်တွေမှာ အသေးစိတ်ကို ကြည့်ပါ။ Locale providers တွေကို granularity (အတိုင်းအတာ) အမျိုးမျိုးမှာ ရောနှော သုံးနိုင်တာ သတိပြုပါ — ဥပမာ — cluster အတွက် default အနေနဲ့ `libc` ကို သုံးပေမယ့် database တစ်ခုကတော့ `icu` provider ကို သုံးပြီး — အဲဒီ databases တွေအတွင်းမှာတော့ provider နှစ်မျိုးလုံးထဲက တစ်ခုခုကို သုံးတဲ့ collation objects တွေ ထားရှိနိုင်ပါတယ်။

Locale provider ဘယ်လိုပဲ ဖြစ်ဖြစ် — messages တွေလို locale-aware အပြုအမူ အချို့ကို ထောက်ပံ့ဖို့ operating system ကို အသုံးပြုနေဆဲ ဖြစ်ပါတယ် (ကြည့်ပါ — [lc_messages](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-MESSAGES))။

ရရှိနိုင်တဲ့ locale providers တွေကတော့ အောက်မှာ ဖော်ပြထားပါတယ်:

- **builtin** — builtin provider က built-in operations (ကြိုတင် တည်ဆောက်ပြီးသား လုပ်ဆောင်မှုများ) တွေကို သုံးပါတယ်။ ဒီ provider အတွက်တော့ C, C.UTF-8 နဲ့ PG_UNICODE_FAST locales တွေကိုပဲ ထောက်ပံ့ပါတယ်။

C locale ရဲ့ အပြုအမူက libc provider ထဲက C locale နဲ့ တူညီပါတယ်။ ဒီ locale ကို သုံးတဲ့အခါ — အပြုအမူက database encoding (database ၏ encoding) ပေါ်မှာ မူတည်နိုင်ပါတယ်။

C.UTF-8 locale က database encoding က UTF-8 ဖြစ်တဲ့အခါမှပဲ ရနိုင်ပြီး — အပြုအမူက Unicode ကို အခြေခံပါတယ်။ Collation က code point (စာလုံး ကုဒ်မှတ်) တန်ဖိုးတွေကိုပဲ သုံးပါတယ်။ Regular expression character classes တွေက “POSIX Compatible” semantics (အဓိပ္ပါယ် သတ်မှတ်ချက်များ) ကို အခြေခံပြီး — case mapping ကတော့ “simple” variant (မူကွဲ) ဖြစ်ပါတယ်။

PG_UNICODE_FAST locale က database encoding က UTF-8 ဖြစ်တဲ့အခါမှပဲ ရနိုင်ပြီး — အပြုအမူက Unicode ကို အခြေခံပါတယ်။ Collation က code point တန်ဖိုးတွေကိုပဲ သုံးပါတယ်။ Regular expression character classes တွေက “Standard” semantics ကို အခြေခံပြီး — case mapping ကတော့ “full” variant ဖြစ်ပါတယ်။

- **icu** — icu provider က external ICU library (ပြင်ပ ICU စာကြည့်တိုက်) ကို သုံးပါတယ်။ PostgreSQL ကို support နဲ့ configure လုပ်ထားရပါမယ်။

ICU က — operating system နဲ့ database encoding တို့နဲ့ မသက်ဆိုင်တဲ့ (independent) collation နဲ့ character classification အပြုအမူတွေကို ထောက်ပံ့ပါတယ် — ရလဒ်တွေမှာ ဘာမှ မပြောင်းလဲဘဲ တခြား platform တွေဆီ ကူးပြောင်းဖို့ မျှော်လင့်ထားရင် ဒါက ပိုနှစ်သက်စရာ ဖြစ်ပါတယ်။ LC_COLLATE နဲ့ LC_CTYPE တို့ကို ICU locale နဲ့ မသက်ဆိုင်ဘဲ သီးခြား သတ်မှတ်နိုင်ပါတယ်။

> **မှတ်ချက်:** ICU provider အတွက်တော့ — ရလဒ်တွေက သုံးထားတဲ့ ICU library ရဲ့ version ပေါ်မှာ မူတည်နိုင်ပါတယ် — အကြောင်းကတော့ ICU library က သဘာဝ ဘာသာစကားတွေထဲက အပြောင်းအလဲတွေကို ထင်ဟပ်စေဖို့ အချိန်နဲ့အမျှ update လုပ်ခံရလို့ပါ။

- **libc** — libc provider က operating system ရဲ့ C library ကို သုံးပါတယ်။ Collation နဲ့ character classification အပြုအမူကို `LC_COLLATE` နဲ့ `LC_CTYPE` ဆက်တင်တွေက ထိန်းချုပ်လို့ — ၎င်းတို့ကို သီးခြား သတ်မှတ်လို့ မရပါဘူး။

> **မှတ်ချက်:** libc provider ကို သုံးတဲ့အခါ — locale နာမည် အတူတူပဲ ဖြစ်ပေမယ့် platform အမျိုးမျိုးမှာ အပြုအမူ ကွဲပြားနိုင်ပါတယ်။

### 23.1.5. ICU Locales (ICU locales များ)

#### 23.1.5.1. ICU Locale Names (ICU locale နာမည်များ)

ICU ရဲ့ locale name အတွက် format ကတော့ [Language Tag](https://www.postgresql.org/docs/current/locale.html#ICU-LANGUAGE-TAG) (ဘာသာစကား tag) တစ်ခု ဖြစ်ပါတယ်။

```sql
CREATE COLLATION mycollation1 (provider = icu, locale = 'ja-JP');
CREATE COLLATION mycollation2 (provider = icu, locale = 'fr');
```

#### 23.1.5.2. Locale Canonicalization and Validation (Locale ၏ စံပုံစံ ပြောင်းလဲခြင်းနှင့် စိစစ်ခြင်း)

ICU ကို provider အဖြစ် သုံးပြီး ICU collation object အသစ် ဒါမှမဟုတ် database အသစ် တစ်ခုကို သတ်မှတ်တဲ့အခါ — ပေးထားတဲ့ locale နာမည်ကို ခုနက ပုံစံ မဟုတ်သေးဘူးဆိုရင် — language tag တစ်ခုအဖြစ် “canonicalize” (စံပုံစံ ပြောင်းလဲ) လုပ်ပါတယ်။ ဥပမာ —

```sql
CREATE COLLATION mycollation3 (provider = icu, locale = 'en-US-u-kn-true');
NOTICE:  using standard form "en-US-u-kn" for locale "en-US-u-kn-true"
CREATE COLLATION mycollation4 (provider = icu, locale = 'de_DE.utf8');
NOTICE:  using standard form "de-DE" for locale "de_DE.utf8"
```

ဒီ notice (အသိပေးစာ) ကို မြင်ရရင် — `provider` နဲ့ `locale` တို့က မျှော်လင့်ထားတဲ့ ရလဒ် ဟုတ်မဟုတ် သေချာ စစ်ဆေးပါ။ ICU provider ကို သုံးတဲ့အခါ တသမတ်တည်း ရလဒ်တွေ ရဖို့ဆိုရင် — အသွင်ပြောင်းခြင်းကို အားကိုးနေမည့်အစား — canonical [language tag](https://www.postgresql.org/docs/current/locale.html#ICU-LANGUAGE-TAG) တစ်ခုကို သတ်မှတ်ပါ။

ဘာသာစကား နာမည် မပါတဲ့ locale တစ်ခု ဒါမှမဟုတ် `root` ဆိုတဲ့ အထူး ဘာသာစကား နာမည် တစ်ခုကို — `und` (“undefined” — မသတ်မှတ်ရသေး) ဆိုတဲ့ ဘာသာစကားရှိတဲ့ ပုံစံဆီ အသွင်ပြောင်းပါတယ်။

ICU က libc locale နာမည် အများစုကိုရော — တခြား format တချို့ကိုပါ — ICU ဆီ ပိုလွယ်ကူစွာ ကူးပြောင်းနိုင်ဖို့ — language tags တွေအဖြစ် အသွင်ပြောင်းနိုင်ပါတယ်။ libc locale နာမည် တစ်ခုကို ICU ထဲမှာ သုံးမယ်ဆိုရင် — libc ထဲမှာ ရှိသလို အတိအကျ တူညီတဲ့ အပြုအမူတော့ မရှိနိုင်ပါဘူး။

Locale နာမည်ကို အဓိပ္ပာယ် ကောက်ယူရာမှာ ပြဿနာ ရှိနေရင် ဒါမှမဟုတ် — locale နာမည်က ICU မသိတဲ့ ဘာသာစကား ဒါမှမဟုတ် ဒေသတစ်ခုကို ကိုယ်စားပြုနေရင် — အောက်ပါ warning (သတိပေးချက်) ကို မြင်ရပါလိမ့်မယ်:

```sql
CREATE COLLATION nonsense (provider = icu, locale = 'nonsense');
WARNING:  ICU locale "nonsense" has unknown language "nonsense"
HINT:  To disable ICU locale validation, set parameter icu_validation_level to DISABLED.
CREATE COLLATION
```

[icu_validation_level](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-ICU-VALIDATION-LEVEL) က ဒီ message ကို ဘယ်လို အစီရင်ခံမလဲ ထိန်းချုပ်ပါတယ်။ `ERROR` အဖြစ် သတ်မှတ်မထားဘူးဆိုရင် — collation ကို ဖန်တီးနေဆဲ ဖြစ်ပေမယ့် — အပြုအမူကတော့ user ရည်ရွယ်ထားတဲ့အတိုင်း မဖြစ်နိုင်ပါဘူး။

#### 23.1.5.3. Language Tag (Language tag)

BCP 47 မှာ သတ်မှတ်ထားတဲ့ language tag (ဘာသာစကား tag) ဆိုတာက — ဘာသာစကားတွေ၊ ဒေသတွေနဲ့ locale တစ်ခုအကြောင်း တခြား အချက်အလက်တွေကို ခွဲခြား သတ်မှတ်ဖို့ သုံးတဲ့ — စံသတ်မှတ်ထားတဲ့ (standardized) identifier တစ်ခု ဖြစ်ပါတယ်။

အခြေခံ language tags တွေက ရိုးရိုးလေး `language``-``region` (ဒါမှမဟုတ် `language` တစ်ခုတည်း) ပုံစံပဲ ဖြစ်ပါတယ်။ `language` က ဘာသာစကား code တစ်ခု (ဥပမာ — ပြင်သစ်အတွက် `fr`) ဖြစ်ပြီး — `region` က ဒေသ code တစ်ခု (ဥပမာ — ကနေဒါအတွက် `CA`) ဖြစ်ပါတယ်။ ဥပမာတွေကတော့: `ja-JP`, `de`, ဒါမှမဟုတ် `fr-CA` တို့ ဖြစ်ပါတယ်။

Collation ဆက်တင်တွေကို language tag ထဲမှာ ထည့်သွင်းပြီး — collation အပြုအမူကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။ ICU က — accents (အသံအတိုအကျယ် အမှတ်အသားများ)၊ case နဲ့ punctuation (ပုဒ်ဖြတ် အမှတ်အသားများ) တို့အပေါ် sensitivity (အာရုံခံ နှိုင်းယှဉ်မှု) (သို့မဟုတ် insensitivity)၊ text အတွင်းက ဂဏန်းတွေကို ဆက်ဆံပုံ ပြီးတော့ — အသုံးပြုမှု အမျိုးမျိုးကို ဖြည့်ဆည်းပေးနိုင်တဲ့ တခြား option များစွာ စတာတွေကို ကျယ်ကျယ်ပြန့်ပြန့် customize (စိတ်ကြိုက် ပြင်ဆင်) လုပ်ခွင့် ပေးပါတယ်။

ဒီ ထပ်ဆောင်း collation အချက်အလက်တွေကို language tag တစ်ခုထဲမှာ ထည့်သွင်းဖို့ — နောက်ထပ် collation ဆက်တင်တွေ ရှိတယ်လို့ ညွှန်ပြတဲ့ `-u` ကို နောက်ကပ် ထည့်ပြီး — `-``key``-``value` pair တစ်ခု ဒါမှမဟုတ် အများအပြားကို ဆက်ထည့်ပါ။ `key` က [collation setting](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-SETTINGS) တစ်ခုအတွက် key (သော့) ဖြစ်ပြီး — `value` က အဲဒီ setting အတွက် မှန်ကန်တဲ့ တန်ဖိုး တစ်ခု ဖြစ်ပါတယ်။ Boolean ဆက်တင်တွေအတွက်ဆိုရင် — `true` တန်ဖိုး ရှိတယ်လို့ ဆိုလိုတဲ့အနေနဲ့ — သက်ဆိုင်ရာ `-``value` မပါဘဲ `-``key` တစ်ခုတည်းကို သတ်မှတ်နိုင်ပါတယ်။

ဥပမာ — `en-US-u-kn-ks-level2` language tag က — collation ဆက်တင်တွေဖြစ်တဲ့ `kn` ကို `true` အဖြစ် သတ်မှတ်ပြီး `ks` ကို `level2` အဖြစ် သတ်မှတ်ထားတဲ့ — US ဒေသမှာ အင်္ဂလိပ် ဘာသာစကား ရှိတဲ့ locale ကို ဆိုလိုပါတယ်။ အဲဒီ ဆက်တင်တွေရဲ့ အဓိပ္ပာယ်က — collation က case insensitive (စာလုံးအကြီးအသေး ခွဲခြားမှု မရှိ) ဖြစ်ပြီး — ဂဏန်း အစုအဝေး (digit sequence) တစ်ခုကို နံပါတ် တစ်လုံးတည်း (single number) အနေနဲ့ သဘောထားမယ်ဆိုတာ ဖြစ်ပါတယ်:

```sql
CREATE COLLATION mycollation5 (provider = icu, deterministic = false, locale = 'en-US-u-kn-ks-level2');
SELECT 'aB' = 'Ab' COLLATE mycollation5 as result;
 result
--------
 t
(1 row)

SELECT 'N-45' < 'N-123' COLLATE mycollation5 as result;
 result
--------
 t
(1 row)
```

Locale အတွက် custom collation အချက်အလက်တွေနဲ့ language tags တွေ သုံးခြင်းရဲ့ အသေးစိတ်နဲ့ နောက်ထပ် ဥပမာတွေအတွက် [အပိုင်း 23.2.3](https://www.postgresql.org/docs/current/collation.html#ICU-CUSTOM-COLLATIONS) ကို ကြည့်ပါ။

### 23.1.6. Problems (ပြဿနာများ)

Locale support က အပေါ်က ရှင်းပြချက်အတိုင်း အလုပ်မလုပ်ဘူးဆိုရင် — သင့် operating system ထဲမှာ locale support ကို မှန်ကန်စွာ configure လုပ်ထားကြောင်း စစ်ဆေးပါ။ သင့်စနစ်မှာ ဘယ် locales တွေ install လုပ်ထားလဲ စစ်ဆေးဖို့ — သင့် operating system က ထောက်ပံ့ပေးမယ်ဆိုရင် — `locale -a` command ကို သုံးနိုင်ပါတယ်။

PostgreSQL က သင်ထင်ထားတဲ့ locale ကိုပဲ တကယ် သုံးနေကြောင်း စစ်ဆေးပါ။ `LC_COLLATE` နဲ့ `LC_CTYPE` ဆက်တင်တွေကို database တစ်ခု ဖန်တီးတဲ့အခါ ဆုံးဖြတ်ပြီး — database အသစ် တစ်ခု ဖန်တီးတာကလွဲလို့ ပြောင်းလဲလို့ မရပါဘူး။ `LC_MESSAGES` နဲ့ `LC_MONETARY` အပါအဝင် တခြား locale ဆက်တင်တွေကို — server စတင်တဲ့ environment က ကနဦး ဆုံးဖြတ်ပေမယ့် — လည်ပတ်နေချိန်မှာ (on-the-fly) ပြောင်းလဲနိုင်ပါတယ်။ Active ဖြစ်နေတဲ့ locale ဆက်တင်တွေကို `SHOW` command နဲ့ စစ်ဆေးနိုင်ပါတယ်။

Source distribution (source ဖြန့်ချီမှု) ထဲက `src/test/locale` directory ထဲမှာ PostgreSQL ရဲ့ locale support အတွက် test suite (စမ်းသပ်မှု အစုအဝေး) တစ်ခု ပါဝင်ပါတယ်။

Server-side errors (server ဘက်က error များ) တွေကို — error message ရဲ့ စာသားကို parse (ခွဲခြမ်း စိတ်ဖြာ) လုပ်ပြီး ကိုင်တွယ်တဲ့ client applications တွေက — server ရဲ့ messages တွေ မတူညီတဲ့ ဘာသာစကားနဲ့ ဖြစ်နေရင် — သိသာစွာပဲ ပြဿနာ ရှိပါလိမ့်မယ်။ ဒီလို applications တွေကို ရေးသားသူတွေကို — error code (error ကုဒ်) စနစ်ကို အသုံးပြုဖို့ အကြံပြုပါတယ်။

Message translation (message ဘာသာပြန်) catalog တွေကို ထိန်းသိမ်းဖို့ဆိုရင် — PostgreSQL က သူတို့ နှစ်သက်ရာ ဘာသာစကားနဲ့ ကောင်းကောင်း ပြောဆိုနိုင်တာကို မြင်ချင်တဲ့ — volunteer (စေတနာ့ဝန်ထမ်း) အများအပြားရဲ့ ဆက်လက် လုပ်ဆောင်နေတဲ့ အားထုတ်မှုတွေ လိုအပ်ပါတယ်။ သင့်ဘာသာစကားနဲ့ messages တွေ လောလောဆယ် မရနိုင်သေးဘူး ဒါမှမဟုတ် အပြည့်အဝ ဘာသာမပြန်ရသေးဘူးဆိုရင် — သင့်ရဲ့ အကူအညီကို ကျေးဇူးတင်စွာဖြင့် လက်ခံပါတယ်။ ကူညီချင်တယ်ဆိုရင် — [အခန်း 56](https://www.postgresql.org/docs/current/nls.html) ကို ကိုးကား ကြည့်ရှုပါ ဒါမှမဟုတ် developers တွေရဲ့ mailing list ဆီ စာရေးပါ။
