---
title: "Character Set Support (Character set ထောက်ပံ့မှု)"
description: "PostgreSQL ၏ character set (encoding) ထောက်ပံ့မှုအကြောင်း — character set ဆိုသည်မှာ ဘာလဲ, ရရှိနိုင်သော character sets များ (single-byte/multiple-byte encodings များ, server/ICU ထောက်ပံ့မှု, bytes-per-character နှင့် aliases အပါအဝင်), initdb ဖြင့် default character set သတ်မှတ်ခြင်း နှင့် database ဖန်တီးချိန်တွင် encoding သတ်မှတ်ခြင်း (LC_CTYPE/LC_COLLATE လိုက်ဖက်မှု, template0 ကူးယူမှု), server နှင့် client အကြား character set အလိုအလျောက် ပြောင်းလဲခြင်း (psql ၏ \\encoding command, libpq, SET client_encoding/SET NAMES, PGCLIENTENCODING, client_encoding configuration variable), ရရှိနိုင်သော character set conversions များ (built-in client/server character set conversions ဇယား နှင့် built-in character set conversions အားလုံး၏ စာရင်းဇယား) နှင့် encoding စနစ်များအကြောင်း ထပ်ဆင့် လေ့လာရန် အရင်းအမြစ်များ အကြောင်း ရှင်းလင်းချက်"
order: 204
source: "https://www.postgresql.org/docs/current/multibyte.html"
status: translated
updated: 2026-09-06
---

## 23.3. Character Set Support (Character set ထောက်ပံ့မှု)

- **23.3.1. Supported Character Sets (ထောက်ပံ့ပေးထားသော character sets များ)**
- **23.3.2. Setting the Character Set (Character set သတ်မှတ်ခြင်း)**
- **23.3.3. Automatic Character Set Conversion Between Server and Client (Server နှင့် client အကြား character set အလိုအလျောက် ပြောင်းလဲခြင်း)**
- **23.3.4. Available Character Set Conversions (ရရှိနိုင်သော character set conversions များ)**
- **23.3.5. Further Reading (ထပ်ဆင့် ဖတ်ရှုရန်)**

PostgreSQL ရဲ့ character set ထောက်ပံ့မှုက — text (စာသား) တွေကို character set အမျိုးမျိုး (အဲဒါတွေကို encodings — encoding များ — လို့လည်း ခေါ်ပါတယ်) နဲ့ သိမ်းဆည်းနိုင်အောင် ခွင့်ပြုပေးပါတယ် — ISO 8859 စီးရီးလို single-byte character sets (byte တစ်ခုတည်း ပါဝင်တဲ့ character sets) တွေကအစ — EUC (Extended Unix Code), UTF-8 နဲ့ Mule internal code လို multiple-byte character sets (byte အများအပြား ပါဝင်တဲ့ character sets) တွေအထိ ပါဝင်ပါတယ်။ Character sets အားလုံးကို clients တွေက transparently (ပွင့်လင်းမြင်သာစွာ) အသုံးပြုနိုင်ပေမယ့် — အနည်းငယ်ကတော့ server အတွင်းမှာ အသုံးပြုဖို့ (ဆိုလိုတာက server-side encoding — server ဘက်က encoding — အဖြစ်) ထောက်ပံ့မထားပါဘူး။ Default character set ကို — သင့် PostgreSQL database cluster ကို `initdb` သုံးပြီး initialize (ကနဦး ပြင်ဆင်) လုပ်တဲ့အခါ ရွေးချယ်ပါတယ်။ Database တစ်ခု ဖန်တီးတဲ့အခါ အဲဒါကို override (ပြောင်းလဲ အစားထိုး) လုပ်နိုင်တာမို့ — database တစ်ခုချင်းစီမှာ မတူညီတဲ့ character set တစ်ခုစီ ရှိနေတဲ့ databases အများအပြားကို သင်ရရှိနိုင်ပါတယ်။

ဒါပေမယ့် အရေးကြီးတဲ့ ကန့်သတ်ချက် တစ်ခုကတော့ — database တစ်ခုချင်းစီရဲ့ character set က database ရဲ့ `LC_CTYPE` (character classification — စာလုံး အမျိုးအစား ခွဲခြားမှု) နဲ့ `LC_COLLATE` (string sort order — string စီစဉ်မှု အစဉ်) locale settings တွေနဲ့ ကိုက်ညီရပါမယ် ဆိုတာပဲ ဖြစ်ပါတယ်။ `C` ဒါမှမဟုတ် `POSIX` locale အတွက်ဆိုရင် character set ဘယ်ခုကိုမဆို ခွင့်ပြုပေမယ့် — libc က ထောက်ပံ့တဲ့ တခြား locales တွေအတွက်တော့ — မှန်ကန်စွာ အလုပ်လုပ်မယ့် character set က တစ်ခုတည်းပဲ ရှိပါတယ်။ (ဒါပေမယ့် Windows မှာတော့ — UTF-8 encoding ကို locale ဘယ်ခုနဲ့မဆို သုံးနိုင်ပါတယ်။) ICU support ကို configure (ပြင်ဆင်သတ်မှတ်) လုပ်ထားရင် — ICU က ထောက်ပံ့တဲ့ locales တွေကို server-side encodings အများစုနဲ့ သုံးနိုင်ပေမယ့် — အားလုံးနဲ့တော့ မဟုတ်ပါဘူး။

### 23.3.1. Supported Character Sets (ထောက်ပံ့ပေးထားသော character sets များ)

PostgreSQL မှာ အသုံးပြုရန် ရရှိနိုင်တဲ့ character sets တွေကို [ဇယား 23.3](https://www.postgresql.org/docs/current/multibyte.html#CHARSET-TABLE) မှာ ပြထားပါတယ်။

**ဇယား 23.3. PostgreSQL Character Sets (PostgreSQL ၏ character sets များ)**

| Name | ဖော်ပြချက် | ဘာသာစကား | Server? | ICU? | Bytes/​Char | Aliases |
| --- | --- | --- | --- | --- | --- | --- |
| `BIG5` | Big Five | တရုတ် (ရိုးရာ) | No | No | 1–2 | `WIN950`, `Windows950` |
| `EUC_CN` | Extended UNIX Code-CN | တရုတ် (ရိုးရှင်း) | Yes | Yes | 1–3 |  |
| `EUC_JP` | Extended UNIX Code-JP | ဂျပန် | Yes | Yes | 1–3 |  |
| `EUC_JIS_2004` | Extended UNIX Code-JP, JIS X 0213 | ဂျပန် | Yes | No | 1–3 |  |
| `EUC_KR` | Extended UNIX Code-KR | ကိုရီးယား | Yes | Yes | 1–3 |  |
| `EUC_TW` | Extended UNIX Code-TW | တရုတ် (ရိုးရာ), ထိုင်ဝမ် | Yes | Yes | 1–4 |  |
| `GB18030` | National Standard (အမျိုးသား စံနှုန်း) | တရုတ် | No | No | 1–4 |  |
| `GBK` | Extended National Standard (တိုးချဲ့ အမျိုးသား စံနှုန်း) | တရုတ် (ရိုးရှင်း) | No | No | 1–2 | `WIN936`, `Windows936` |
| `ISO_8859_5` | ISO 8859-5, ECMA 113 | လက်တင်/စီရီလစ် | Yes | Yes | 1 |  |
| `ISO_8859_6` | ISO 8859-6, ECMA 114 | လက်တင်/အာရပ် | Yes | Yes | 1 |  |
| `ISO_8859_7` | ISO 8859-7, ECMA 118 | လက်တင်/ဂရိ | Yes | Yes | 1 |  |
| `ISO_8859_8` | ISO 8859-8, ECMA 121 | လက်တင်/ဟီဘရူး | Yes | Yes | 1 |  |
| `JOHAB` | JOHAB | ကိုရီးယား (Hangul) | No | No | 1–3 |  |
| `KOI8R` | KOI8-R | စီရီလစ် (ရုရှား) | Yes | Yes | 1 | `KOI8` |
| `KOI8U` | KOI8-U | စီရီလစ် (ယူကရိန်း) | Yes | Yes | 1 |  |
| `LATIN1` | ISO 8859-1, ECMA 94 | အနောက် ဥရောပ | Yes | Yes | 1 | `ISO88591` |
| `LATIN2` | ISO 8859-2, ECMA 94 | ဗဟို ဥရောပ | Yes | Yes | 1 | `ISO88592` |
| `LATIN3` | ISO 8859-3, ECMA 94 | တောင် ဥရောပ | Yes | Yes | 1 | `ISO88593` |
| `LATIN4` | ISO 8859-4, ECMA 94 | မြောက် ဥရောပ | Yes | Yes | 1 | `ISO88594` |
| `LATIN5` | ISO 8859-9, ECMA 128 | တူရကီ | Yes | Yes | 1 | `ISO88599` |
| `LATIN6` | ISO 8859-10, ECMA 144 | နော်ဒစ် | Yes | Yes | 1 | `ISO885910` |
| `LATIN7` | ISO 8859-13 | ဘောလ်တစ် | Yes | Yes | 1 | `ISO885913` |
| `LATIN8` | ISO 8859-14 | ဆဲလ်တစ် | Yes | Yes | 1 | `ISO885914` |
| `LATIN9` | ISO 8859-15 | Euro နှင့် accent စာလုံးများ ပါဝင်သော LATIN1 | Yes | Yes | 1 | `ISO885915` |
| `LATIN10` | ISO 8859-16, ASRO SR 14111 | ရိုမေးနီးယား | Yes | No | 1 | `ISO885916` |
| `MULE_INTERNAL` | Mule internal code | ဘာသာစကား စုံ (multilingual) Emacs | Yes | No | 1–4 |  |
| `SJIS` | Shift JIS | ဂျပန် | No | No | 1–2 | `Mskanji`, `ShiftJIS`, `WIN932`, `Windows932` |
| `SHIFT_JIS_2004` | Shift JIS, JIS X 0213 | ဂျပန် | No | No | 1–2 |  |
| `SQL_ASCII` | သတ်မှတ်မထား (စာသားကို ကြည့်ပါ) | မည်သည့် ဘာသာစကားမဆို | Yes | No | 1 |  |
| `UHC` | Unified Hangul Code | ကိုရီးယား | No | No | 1–2 | `WIN949`, `Windows949` |
| `UTF8` | Unicode, 8-bit | အားလုံး | Yes | Yes | 1–4 | `Unicode` |
| `WIN866` | Windows CP866 | စီရီလစ် | Yes | Yes | 1 | `ALT` |
| `WIN874` | Windows CP874 | ထိုင်း | Yes | No | 1 |  |
| `WIN1250` | Windows CP1250 | ဗဟို ဥရောပ | Yes | Yes | 1 |  |
| `WIN1251` | Windows CP1251 | စီရီလစ် | Yes | Yes | 1 | `WIN` |
| `WIN1252` | Windows CP1252 | အနောက် ဥရောပ | Yes | Yes | 1 |  |
| `WIN1253` | Windows CP1253 | ဂရိ | Yes | Yes | 1 |  |
| `WIN1254` | Windows CP1254 | တူရကီ | Yes | Yes | 1 |  |
| `WIN1255` | Windows CP1255 | ဟီဘရူး | Yes | Yes | 1 |  |
| `WIN1256` | Windows CP1256 | အာရပ် | Yes | Yes | 1 |  |
| `WIN1257` | Windows CP1257 | ဘောလ်တစ် | Yes | Yes | 1 |  |
| `WIN1258` | Windows CP1258 | ဗီယက်နမ် | Yes | Yes | 1 | `ABC`, `TCVN`, `TCVN5712`, `VSCII` |

Client APIs (client ဘက်က API များ) အားလုံးက စာရင်းပြုထားတဲ့ character sets တွေ အားလုံးကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ ဥပမာ — PostgreSQL JDBC driver က `MULE_INTERNAL`, `LATIN6`, `LATIN8` နဲ့ `LATIN10` တို့ကို ထောက်ပံ့မထားပါဘူး။

`SQL_ASCII` setting က တခြား settings တွေနဲ့ ယှဉ်ရင် သိသိသာသာ ကွဲပြားတဲ့ အပြုအမူ ရှိပါတယ်။ Server character set က `SQL_ASCII` ဖြစ်နေတဲ့အခါ — server က byte values (byte တန်ဖိုးများ) 0–127 ကို ASCII standard (ASCII စံနှုန်း) အတိုင်း အဓိပ္ပာယ် ကောက်ယူပြီး — byte values 128–255 ကိုတော့ အဓိပ္ပာယ် မကောက်ယူရသေးတဲ့ characters တွေအဖြစ် သဘောထားပါတယ်။ Setting က `SQL_ASCII` ဖြစ်နေရင် encoding conversion (encoding ပြောင်းလဲခြင်း) ကို လုံးဝ လုပ်ဆောင်မှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — ဒီ setting က တိကျတဲ့ encoding တစ်ခု သုံးနေတယ်ဆိုတဲ့ ကြေညာချက် တစ်ခုထက် — encoding အကြောင်းကို မသိကြောင်း ကြေညာချက် တစ်ခုနဲ့ ပိုတူပါတယ်။ Non-ASCII data (ASCII မဟုတ်တဲ့ data) တွေနဲ့ အလုပ်လုပ်နေရင် — ကိစ္စ အများစုမှာ `SQL_ASCII` setting ကို သုံးတာ မပညာရှိရာပါဘူး — အကြောင်းကတော့ non-ASCII characters တွေကို convert (ပြောင်းလဲ) လုပ်ပေးတာ ဒါမှမဟုတ် validate (စစ်ဆေး အတည်ပြု) လုပ်ပေးတာမျိုးနဲ့ — PostgreSQL က သင့်ကို ကူညီနိုင်မှာ မဟုတ်လို့ပါ။

### 23.3.2. Setting the Character Set (Character set သတ်မှတ်ခြင်း)

`initdb` က PostgreSQL cluster တစ်ခုအတွက် default character set (encoding) ကို သတ်မှတ်ပေးပါတယ်။ ဥပမာ:

```sql
initdb -E EUC_JP
```

ဒါက default character set ကို `EUC_JP` (ဂျပန် အတွက် Extended Unix Code) အဖြစ် သတ်မှတ်ပေးပါတယ်။ Option string (option စာလုံးကြိုး) တွေ ပိုရှည်တာကို နှစ်သက်ရင် — `-E` အစား `--encoding` ကို သုံးနိုင်ပါတယ်။ `-E` ဒါမှမဟုတ် `--encoding` option ဘာမှ မပေးထားဘူးဆိုရင် — `initdb` က သတ်မှတ်ထားတဲ့ ဒါမှမဟုတ် default locale ကို အခြေခံပြီး — သုံးသင့်တဲ့ သင့်လျော်တဲ့ encoding ကို ဆုံးဖြတ်ဖို့ ကြိုးစားပါတယ်။

Encoding က ရွေးချယ်ထားတဲ့ locale နဲ့ ကိုက်ညီနေမယ်ဆိုရင် — database ဖန်တီးချိန်မှာ default မဟုတ်တဲ့ encoding တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်:

```sql
createdb -E EUC_KR -T template0 --lc-collate=ko_KR.euckr --lc-ctype=ko_KR.euckr korean
```

ဒါက `korean` လို့ နာမည်ရှိတဲ့ — character set `EUC_KR` နဲ့ locale `ko_KR` ကို သုံးမယ့် — database တစ်ခုကို ဖန်တီးပေးပါလိမ့်မယ်။ ဒါကို အောင်မြင်အောင် လုပ်ဖို့ နောက်ထပ် နည်းလမ်း တစ်ခုကတော့ ဒီ SQL command ကို သုံးတာပါ:

```sql
CREATE DATABASE korean WITH ENCODING 'EUC_KR' LC_COLLATE='ko_KR.euckr' LC_CTYPE='ko_KR.euckr' TEMPLATE=template0;
```

အပေါ်က commands တွေက `template0` database ကို ကူးယူ (copy) ဖို့ သတ်မှတ်ထားတာ သတိပြုပါ။ တခြား database တစ်ခုခုကို ကူးယူတဲ့အခါ — encoding နဲ့ locale settings တွေကို source database (မူရင်း database) ရဲ့ settings တွေကနေ ပြောင်းလဲလို့ မရပါဘူး — အကြောင်းကတော့ အဲဒါက data တွေ ပျက်စီး (corrupt) သွားစေနိုင်လို့ပါ။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 22.3](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html) ကို ကြည့်ပါ။

Database တစ်ခုရဲ့ encoding ကို `pg_database` system catalog (system ၏ catalog) ထဲမှာ သိမ်းဆည်းပါတယ်။ `psql` ရဲ့ `-l` option ဒါမှမဟုတ် `\l` command ကို သုံးပြီး ၎င်းကို ကြည့်ရှုနိုင်ပါတယ်:

```
$ psql -l
                                         List of databases
   Name    |  Owner   | Encoding  |  Collation  |    Ctype    |          Access Privileges
-----------+----------+-----------+-------------+-------------+-------------------------------------
 clocaledb | hlinnaka | SQL_ASCII | C           | C           |
 englishdb | hlinnaka | UTF8      | en_GB.UTF8  | en_GB.UTF8  |
 japanese  | hlinnaka | UTF8      | ja_JP.UTF8  | ja_JP.UTF8  |
 korean    | hlinnaka | EUC_KR    | ko_KR.euckr | ko_KR.euckr |
 postgres  | hlinnaka | UTF8      | fi_FI.UTF8  | fi_FI.UTF8  |
 template0 | hlinnaka | UTF8      | fi_FI.UTF8  | fi_FI.UTF8  | {=c/hlinnaka,hlinnaka=CTc/hlinnaka}
 template1 | hlinnaka | UTF8      | fi_FI.UTF8  | fi_FI.UTF8  | {=c/hlinnaka,hlinnaka=CTc/hlinnaka}
(7 rows)
```

> **အရေးကြီး:** ခေတ်မီ operating systems (လည်ပတ်စနစ်များ) အများစုမှာ — PostgreSQL က `LC_CTYPE` setting က ညွှန်ပြနေတဲ့ character set က ဘယ်ဟာလဲ ဆုံးဖြတ်နိုင်ပြီး — ကိုက်ညီတဲ့ database encoding ကိုပဲ သုံးရမယ်လို့ အတင်းအကျပ် လုပ်ဆောင်ပါတယ်။ အသက်ကြီးတဲ့ systems တွေမှာတော့ — သင်ရွေးချယ်ထားတဲ့ locale က မျှော်လင့်ထားတဲ့ encoding ကို သင်သုံးနေကြောင်း သေချာ စစ်ဆေးရတာက သင့်တာဝန် ဖြစ်ပါတယ်။ ဒီနေရာမှာ အမှား လုပ်မိရင် — sorting (စီစဉ်ခြင်း) လို locale ပေါ် မူတည်တဲ့ လုပ်ဆောင်မှုတွေရဲ့ ထူးဆန်းတဲ့ အပြုအမူတွေကို ဖြစ်စေနိုင်ခြေ များပါတယ်။
>
> PostgreSQL က — `LC_CTYPE` က `C` ဒါမှမဟုတ် `POSIX` မဟုတ်ဘူးဆိုရင်တောင် — superusers (အကြီးအကဲ users) တွေကို `SQL_ASCII` encoding နဲ့ databases တွေ ဖန်တီးခွင့် ပြုပါတယ်။ အပေါ်မှာ မှတ်ချက်ပြုခဲ့သလို — `SQL_ASCII` က database ထဲမှာ သိမ်းဆည်းထားတဲ့ data က တိကျတဲ့ encoding တစ်ခုခု ရှိရမယ်လို့ အတင်းအကျပ် မလုပ်ပါဘူး — ဒါကြောင့် ဒီရွေးချယ်မှုက locale ပေါ် မူတည်တဲ့ မှားယွင်းတဲ့ အပြုအမူ (misbehavior) တွေရဲ့ အန္တရာယ်တွေ ဖြစ်စေနိုင်ပါတယ်။ Settings တွေရဲ့ ဒီပေါင်းစပ်မှုကို သုံးတာက deprecated (ရပ်ဆိုင်းရန် စီစဉ်ထားသော) ဖြစ်ပြီး — တစ်နေ့မှာ လုံးဝ တားမြစ်ခံရနိုင်ပါတယ်။

### 23.3.3. Automatic Character Set Conversion Between Server and Client (Server နှင့် client အကြား character set အလိုအလျောက် ပြောင်းလဲခြင်း)

PostgreSQL က server နဲ့ client အကြား character set conversion (character set ပြောင်းလဲခြင်း) ကို character sets တွေရဲ့ ပေါင်းစပ်မှု (combination) အများအပြားအတွက် အလိုအလျောက် ထောက်ပံ့ပါတယ် (ဘယ်ပေါင်းစပ်မှုတွေလဲဆိုတာကို [အပိုင်း 23.3.4](https://www.postgresql.org/docs/current/multibyte.html#MULTIBYTE-CONVERSIONS-SUPPORTED) မှာ ပြထားပါတယ်)။

Automatic character set conversion ကို enable (ဖွင့်) လုပ်ဖို့ — client မှာ သင်သုံးချင်တဲ့ character set (encoding) ကို PostgreSQL ကို ပြောပြရပါတယ်။ ဒါကို လုပ်ဆောင်ဖို့ နည်းလမ်း အများအပြား ရှိပါတယ်:

- **\encoding command ကို psql မှာ သုံးခြင်း** — \encoding က client encoding ကို on the fly (လုပ်ဆောင်နေစဉ် ချက်ချင်း) ပြောင်းလဲခွင့် ပြုပါတယ်။ ဥပမာ — encoding ကို SJIS အဖြစ် ပြောင်းချင်ရင် ဒီလို ရိုက်ထည့်ပါ:
  
  \encoding SJIS
- **libpq** (အပိုင်း 32.11) — client encoding ကို ထိန်းချုပ်ဖို့ functions တွေ ရှိပါတယ်။
- **SET client_encoding TO ကို သုံးခြင်း** — client encoding ကို ဒီ SQL command နဲ့ သတ်မှတ်နိုင်ပါတယ်:
  
  SET CLIENT_ENCODING TO 'value';
  
  ဒါ့အပြင် — ဒီရည်ရွယ်ချက်အတွက် standard SQL syntax ဖြစ်တဲ့ SET NAMES ကိုလည်း သုံးနိုင်ပါတယ်:
  
  SET NAMES 'value';
  
  လက်ရှိ client encoding ကို query လုပ်ဖို့:
  
  SHOW client_encoding;
  
  Default encoding ဆီ ပြန်သွားဖို့:
  
  RESET client_encoding;
- **PGCLIENTENCODING ကို သုံးခြင်း** — client ရဲ့ environment (လုပ်ဆောင်မှု ပတ်ဝန်းကျင်) မှာ PGCLIENTENCODING environment variable (ပတ်ဝန်းကျင် variable) ကို သတ်မှတ်ထားရင် — server ဆီ connection တစ်ခု ပြုလုပ်တဲ့အခါ အဲဒီ client encoding ကို အလိုအလျောက် ရွေးချယ်ပါတယ်။ (ဒါကို နောက်ပိုင်းမှာ အပေါ်က ဖော်ပြခဲ့တဲ့ တခြား နည်းလမ်း တစ်ခုခုနဲ့ ပြန်လည် override လုပ်နိုင်ပါတယ်။)
- **client_encoding configuration variable ကို သုံးခြင်း** — client_encoding variable ကို သတ်မှတ်ထားရင် — server ဆီ connection တစ်ခု ပြုလုပ်တဲ့အခါ အဲဒီ client encoding ကို အလိုအလျောက် ရွေးချယ်ပါတယ်။ (ဒါကို နောက်ပိုင်းမှာ အပေါ်က ဖော်ပြခဲ့တဲ့ တခြား နည်းလမ်း တစ်ခုခုနဲ့ ပြန်လည် override လုပ်နိုင်ပါတယ်။)

Character တစ်ခုခုရဲ့ conversion မဖြစ်နိုင်ဘူးဆိုရင် — ဥပမာ — server အတွက် `EUC_JP` ကို ရွေးပြီး client အတွက် `LATIN1` ကို ရွေးထားကာ — `LATIN1` မှာ ကိုယ်စားပြုမှု (representation) မရှိတဲ့ ဂျပန် characters တချို့ ပြန်ပို့ခံရတယ် ဆိုပါစို့ — error (အမှား) တစ်ခု report (သတင်းပို့) လုပ်ပါတယ်။

Client character set ကို `SQL_ASCII` အဖြစ် သတ်မှတ်ထားရင် — server ရဲ့ character set ဘယ်လိုပဲ ဖြစ်ဖြစ် — encoding conversion ကို disable (ပိတ်) ထားပါတယ်။ (ဒါပေမယ့် server ရဲ့ character set က `SQL_ASCII` မဟုတ်ဘူးဆိုရင် — server က ဝင်လာတဲ့ data က အဲဒီ encoding အတွက် valid (တရားဝင်) ဟုတ်မဟုတ် ဆက်လက် စစ်ဆေးပါသေးတယ်; ဒါကြောင့် အသားတင် (net) ရလဒ်ကတော့ — client character set က server ရဲ့ character set နဲ့ အတူတူ ဖြစ်နေသလိုပဲ ခံစားရမှာ ဖြစ်ပါတယ်။) Server အတွက် ဆိုသလိုပဲ — all-ASCII data တွေနဲ့ပဲ အလုပ်လုပ်နေတာ မဟုတ်ရင် — `SQL_ASCII` သုံးတာ မပညာရှိရာပါဘူး။

### 23.3.4. Available Character Set Conversions (ရရှိနိုင်သော character set conversions များ)

PostgreSQL က — [`pg_conversion`](https://www.postgresql.org/docs/current/catalog-pg-conversion.html) system catalog ထဲမှာ conversion function (conversion လုပ်ဆောင်ချက်) စာရင်းပြုထားတဲ့ — character sets နှစ်ခု ဘယ်နှစ်ခုကြားမဆို conversion လုပ်ခွင့် ပြုပါတယ်။ PostgreSQL မှာ predefined (ကြိုတင် သတ်မှတ်ထားသော) conversions တချို့ ပါဝင်ပြီး — [ဇယား 23.4](https://www.postgresql.org/docs/current/multibyte.html#MULTIBYTE-TRANSLATION-TABLE) မှာ အကျဉ်းချုပ် ဖော်ပြထားကာ — [ဇယား 23.5](https://www.postgresql.org/docs/current/multibyte.html#BUILTIN-CONVERSIONS-TABLE) မှာ ပိုပြီး အသေးစိတ် ပြထားပါတယ်။ [CREATE CONVERSION](https://www.postgresql.org/docs/current/sql-createconversion.html) SQL command ကို သုံးပြီး conversion အသစ် တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ (Automatic client/server conversions တွေအတွက် သုံးနိုင်ဖို့ဆိုရင် — conversion တစ်ခုက သူ့ရဲ့ character set တွဲ (pair) အတွက် “default” အဖြစ် မှတ်သားထားရပါမယ်။)

**ဇယား 23.4. Built-in Client/Server Character Set Conversions (Built-in client/server character set conversions များ)**

| Server Character Set | Available Client Character Sets |
| --- | --- |
| `BIG5` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `EUC_CN` | EUC_CN, `MULE_INTERNAL`, `UTF8` |
| `EUC_JP` | EUC_JP, `MULE_INTERNAL`, `SJIS`, `UTF8` |
| `EUC_JIS_2004` | EUC_JIS_2004, `SHIFT_JIS_2004`, `UTF8` |
| `EUC_KR` | EUC_KR, `MULE_INTERNAL`, `UTF8` |
| `EUC_TW` | EUC_TW, `BIG5`, `MULE_INTERNAL`, `UTF8` |
| `GB18030` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `GBK` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `ISO_8859_5` | ISO_8859_5, `KOI8R`, `MULE_INTERNAL`, `UTF8`, `WIN866`, `WIN1251` |
| `ISO_8859_6` | ISO_8859_6, `UTF8` |
| `ISO_8859_7` | ISO_8859_7, `UTF8` |
| `ISO_8859_8` | ISO_8859_8, `UTF8` |
| `JOHAB` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `KOI8R` | KOI8R, `ISO_8859_5`, `MULE_INTERNAL`, `UTF8`, `WIN866`, `WIN1251` |
| `KOI8U` | KOI8U, `UTF8` |
| `LATIN1` | LATIN1, `MULE_INTERNAL`, `UTF8` |
| `LATIN2` | LATIN2, `MULE_INTERNAL`, `UTF8`, `WIN1250` |
| `LATIN3` | LATIN3, `MULE_INTERNAL`, `UTF8` |
| `LATIN4` | LATIN4, `MULE_INTERNAL`, `UTF8` |
| `LATIN5` | LATIN5, `UTF8` |
| `LATIN6` | LATIN6, `UTF8` |
| `LATIN7` | LATIN7, `UTF8` |
| `LATIN8` | LATIN8, `UTF8` |
| `LATIN9` | LATIN9, `UTF8` |
| `LATIN10` | LATIN10, `UTF8` |
| `MULE_INTERNAL` | MULE_INTERNAL, `BIG5`, `EUC_CN`, `EUC_JP`, `EUC_KR`, `EUC_TW`, `ISO_8859_5`, `KOI8R`, `LATIN1` to `LATIN4`, `SJIS`, `WIN866`, `WIN1250`, `WIN1251` |
| `SJIS` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `SHIFT_JIS_2004` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `SQL_ASCII` | မည်သည့်ခုမဆို (conversion လုပ်ဆောင်မှာ မဟုတ်ပါ) |
| `UHC` | server encoding အဖြစ် ထောက်ပံ့မထားပါ |
| `UTF8` | ထောက်ပံ့ထားသော encodings အားလုံး |
| `WIN866` | WIN866, `ISO_8859_5`, `KOI8R`, `MULE_INTERNAL`, `UTF8`, `WIN1251` |
| `WIN874` | WIN874, `UTF8` |
| `WIN1250` | WIN1250, `LATIN2`, `MULE_INTERNAL`, `UTF8` |
| `WIN1251` | WIN1251, `ISO_8859_5`, `KOI8R`, `MULE_INTERNAL`, `UTF8`, `WIN866` |
| `WIN1252` | WIN1252, `UTF8` |
| `WIN1253` | WIN1253, `UTF8` |
| `WIN1254` | WIN1254, `UTF8` |
| `WIN1255` | WIN1255, `UTF8` |
| `WIN1256` | WIN1256, `UTF8` |
| `WIN1257` | WIN1257, `UTF8` |
| `WIN1258` | WIN1258, `UTF8` |

**ဇယား 23.5. All Built-in Character Set Conversions (Built-in character set conversions များ အားလုံး)**

| Conversion Name [a] | Source Encoding | Destination Encoding |
| --- | --- | --- |
| `big5_to_euc_tw` | `BIG5` | `EUC_TW` |
| `big5_to_mic` | `BIG5` | `MULE_INTERNAL` |
| `big5_to_utf8` | `BIG5` | `UTF8` |
| `euc_cn_to_mic` | `EUC_CN` | `MULE_INTERNAL` |
| `euc_cn_to_utf8` | `EUC_CN` | `UTF8` |
| `euc_jp_to_mic` | `EUC_JP` | `MULE_INTERNAL` |
| `euc_jp_to_sjis` | `EUC_JP` | `SJIS` |
| `euc_jp_to_utf8` | `EUC_JP` | `UTF8` |
| `euc_kr_to_mic` | `EUC_KR` | `MULE_INTERNAL` |
| `euc_kr_to_utf8` | `EUC_KR` | `UTF8` |
| `euc_tw_to_big5` | `EUC_TW` | `BIG5` |
| `euc_tw_to_mic` | `EUC_TW` | `MULE_INTERNAL` |
| `euc_tw_to_utf8` | `EUC_TW` | `UTF8` |
| `gb18030_to_utf8` | `GB18030` | `UTF8` |
| `gbk_to_utf8` | `GBK` | `UTF8` |
| `iso_8859_10_to_utf8` | `LATIN6` | `UTF8` |
| `iso_8859_13_to_utf8` | `LATIN7` | `UTF8` |
| `iso_8859_14_to_utf8` | `LATIN8` | `UTF8` |
| `iso_8859_15_to_utf8` | `LATIN9` | `UTF8` |
| `iso_8859_16_to_utf8` | `LATIN10` | `UTF8` |
| `iso_8859_1_to_mic` | `LATIN1` | `MULE_INTERNAL` |
| `iso_8859_1_to_utf8` | `LATIN1` | `UTF8` |
| `iso_8859_2_to_mic` | `LATIN2` | `MULE_INTERNAL` |
| `iso_8859_2_to_utf8` | `LATIN2` | `UTF8` |
| `iso_8859_2_to_windows_1250` | `LATIN2` | `WIN1250` |
| `iso_8859_3_to_mic` | `LATIN3` | `MULE_INTERNAL` |
| `iso_8859_3_to_utf8` | `LATIN3` | `UTF8` |
| `iso_8859_4_to_mic` | `LATIN4` | `MULE_INTERNAL` |
| `iso_8859_4_to_utf8` | `LATIN4` | `UTF8` |
| `iso_8859_5_to_koi8_r` | `ISO_8859_5` | `KOI8R` |
| `iso_8859_5_to_mic` | `ISO_8859_5` | `MULE_INTERNAL` |
| `iso_8859_5_to_utf8` | `ISO_8859_5` | `UTF8` |
| `iso_8859_5_to_windows_1251` | `ISO_8859_5` | `WIN1251` |
| `iso_8859_5_to_windows_866` | `ISO_8859_5` | `WIN866` |
| `iso_8859_6_to_utf8` | `ISO_8859_6` | `UTF8` |
| `iso_8859_7_to_utf8` | `ISO_8859_7` | `UTF8` |
| `iso_8859_8_to_utf8` | `ISO_8859_8` | `UTF8` |
| `iso_8859_9_to_utf8` | `LATIN5` | `UTF8` |
| `johab_to_utf8` | `JOHAB` | `UTF8` |
| `koi8_r_to_iso_8859_5` | `KOI8R` | `ISO_8859_5` |
| `koi8_r_to_mic` | `KOI8R` | `MULE_INTERNAL` |
| `koi8_r_to_utf8` | `KOI8R` | `UTF8` |
| `koi8_r_to_windows_1251` | `KOI8R` | `WIN1251` |
| `koi8_r_to_windows_866` | `KOI8R` | `WIN866` |
| `koi8_u_to_utf8` | `KOI8U` | `UTF8` |
| `mic_to_big5` | `MULE_INTERNAL` | `BIG5` |
| `mic_to_euc_cn` | `MULE_INTERNAL` | `EUC_CN` |
| `mic_to_euc_jp` | `MULE_INTERNAL` | `EUC_JP` |
| `mic_to_euc_kr` | `MULE_INTERNAL` | `EUC_KR` |
| `mic_to_euc_tw` | `MULE_INTERNAL` | `EUC_TW` |
| `mic_to_iso_8859_1` | `MULE_INTERNAL` | `LATIN1` |
| `mic_to_iso_8859_2` | `MULE_INTERNAL` | `LATIN2` |
| `mic_to_iso_8859_3` | `MULE_INTERNAL` | `LATIN3` |
| `mic_to_iso_8859_4` | `MULE_INTERNAL` | `LATIN4` |
| `mic_to_iso_8859_5` | `MULE_INTERNAL` | `ISO_8859_5` |
| `mic_to_koi8_r` | `MULE_INTERNAL` | `KOI8R` |
| `mic_to_sjis` | `MULE_INTERNAL` | `SJIS` |
| `mic_to_windows_1250` | `MULE_INTERNAL` | `WIN1250` |
| `mic_to_windows_1251` | `MULE_INTERNAL` | `WIN1251` |
| `mic_to_windows_866` | `MULE_INTERNAL` | `WIN866` |
| `sjis_to_euc_jp` | `SJIS` | `EUC_JP` |
| `sjis_to_mic` | `SJIS` | `MULE_INTERNAL` |
| `sjis_to_utf8` | `SJIS` | `UTF8` |
| `windows_1258_to_utf8` | `WIN1258` | `UTF8` |
| `uhc_to_utf8` | `UHC` | `UTF8` |
| `utf8_to_big5` | `UTF8` | `BIG5` |
| `utf8_to_euc_cn` | `UTF8` | `EUC_CN` |
| `utf8_to_euc_jp` | `UTF8` | `EUC_JP` |
| `utf8_to_euc_kr` | `UTF8` | `EUC_KR` |
| `utf8_to_euc_tw` | `UTF8` | `EUC_TW` |
| `utf8_to_gb18030` | `UTF8` | `GB18030` |
| `utf8_to_gbk` | `UTF8` | `GBK` |
| `utf8_to_iso_8859_1` | `UTF8` | `LATIN1` |
| `utf8_to_iso_8859_10` | `UTF8` | `LATIN6` |
| `utf8_to_iso_8859_13` | `UTF8` | `LATIN7` |
| `utf8_to_iso_8859_14` | `UTF8` | `LATIN8` |
| `utf8_to_iso_8859_15` | `UTF8` | `LATIN9` |
| `utf8_to_iso_8859_16` | `UTF8` | `LATIN10` |
| `utf8_to_iso_8859_2` | `UTF8` | `LATIN2` |
| `utf8_to_iso_8859_3` | `UTF8` | `LATIN3` |
| `utf8_to_iso_8859_4` | `UTF8` | `LATIN4` |
| `utf8_to_iso_8859_5` | `UTF8` | `ISO_8859_5` |
| `utf8_to_iso_8859_6` | `UTF8` | `ISO_8859_6` |
| `utf8_to_iso_8859_7` | `UTF8` | `ISO_8859_7` |
| `utf8_to_iso_8859_8` | `UTF8` | `ISO_8859_8` |
| `utf8_to_iso_8859_9` | `UTF8` | `LATIN5` |
| `utf8_to_johab` | `UTF8` | `JOHAB` |
| `utf8_to_koi8_r` | `UTF8` | `KOI8R` |
| `utf8_to_koi8_u` | `UTF8` | `KOI8U` |
| `utf8_to_sjis` | `UTF8` | `SJIS` |
| `utf8_to_windows_1258` | `UTF8` | `WIN1258` |
| `utf8_to_uhc` | `UTF8` | `UHC` |
| `utf8_to_windows_1250` | `UTF8` | `WIN1250` |
| `utf8_to_windows_1251` | `UTF8` | `WIN1251` |
| `utf8_to_windows_1252` | `UTF8` | `WIN1252` |
| `utf8_to_windows_1253` | `UTF8` | `WIN1253` |
| `utf8_to_windows_1254` | `UTF8` | `WIN1254` |
| `utf8_to_windows_1255` | `UTF8` | `WIN1255` |
| `utf8_to_windows_1256` | `UTF8` | `WIN1256` |
| `utf8_to_windows_1257` | `UTF8` | `WIN1257` |
| `utf8_to_windows_866` | `UTF8` | `WIN866` |
| `utf8_to_windows_874` | `UTF8` | `WIN874` |
| `windows_1250_to_iso_8859_2` | `WIN1250` | `LATIN2` |
| `windows_1250_to_mic` | `WIN1250` | `MULE_INTERNAL` |
| `windows_1250_to_utf8` | `WIN1250` | `UTF8` |
| `windows_1251_to_iso_8859_5` | `WIN1251` | `ISO_8859_5` |
| `windows_1251_to_koi8_r` | `WIN1251` | `KOI8R` |
| `windows_1251_to_mic` | `WIN1251` | `MULE_INTERNAL` |
| `windows_1251_to_utf8` | `WIN1251` | `UTF8` |
| `windows_1251_to_windows_866` | `WIN1251` | `WIN866` |
| `windows_1252_to_utf8` | `WIN1252` | `UTF8` |
| `windows_1256_to_utf8` | `WIN1256` | `UTF8` |
| `windows_866_to_iso_8859_5` | `WIN866` | `ISO_8859_5` |
| `windows_866_to_koi8_r` | `WIN866` | `KOI8R` |
| `windows_866_to_mic` | `WIN866` | `MULE_INTERNAL` |
| `windows_866_to_utf8` | `WIN866` | `UTF8` |
| `windows_866_to_windows_1251` | `WIN866` | `WIN` |
| `windows_874_to_utf8` | `WIN874` | `UTF8` |
| `euc_jis_2004_to_utf8` | `EUC_JIS_2004` | `UTF8` |
| `utf8_to_euc_jis_2004` | `UTF8` | `EUC_JIS_2004` |
| `shift_jis_2004_to_utf8` | `SHIFT_JIS_2004` | `UTF8` |
| `utf8_to_shift_jis_2004` | `UTF8` | `SHIFT_JIS_2004` |
| `euc_jis_2004_to_shift_jis_2004` | `EUC_JIS_2004` | `SHIFT_JIS_2004` |
| `shift_jis_2004_to_euc_jis_2004` | `SHIFT_JIS_2004` | `EUC_JIS_2004` |
| [a] Conversion နာမည်တွေက စံသတ်မှတ်ထားတဲ့ naming scheme (နာမည်ပေးစနစ်) တစ်ခုကို လိုက်နာပါတယ်: source encoding ရဲ့ တရားဝင် နာမည်ထဲက alphanumeric (စာလုံး/ဂဏန်း) မဟုတ်တဲ့ စာလုံးတွေ အားလုံးကို underscores တွေနဲ့ အစားထိုးပြီး — ၎င်းနောက်မှာ _to_ — ပြီးတော့ အလားသဏ္ဌာန် တူညီစွာ ပြုပြင်ထားတဲ့ destination encoding နာမည် ဆိုပြီး လိုက်ပါပါတယ်။ ဒါကြောင့် — ဒီ နာမည်တွေက ဇယား 23.3 မှာ ပြထားတဲ့ ထုံးစံ (customary) encoding နာမည်တွေကနေ တခါတရံ သွေဖည် ကွဲပြားနေတတ်ပါတယ်။ |  |  |

### 23.3.5. Further Reading (ထပ်ဆင့် ဖတ်ရှုရန်)

ဒီအရင်းအမြစ်တွေက encoding စနစ် အမျိုးမျိုးအကြောင်း စတင် လေ့လာဖို့ ကောင်းမွန်တဲ့ ရင်းမြစ်တွေ ဖြစ်ပါတယ်။

- **CJKV Information Processing: Chinese, Japanese, Korean & Vietnamese Computing** — EUC_JP, EUC_CN, EUC_KR, EUC_TW တို့ရဲ့ အသေးစိတ် ရှင်းလင်းချက်တွေ ပါဝင်ပါတယ်။
- **https://www.unicode.org/** — Unicode Consortium (Unicode အဖွဲ့အစည်း) ရဲ့ website ဖြစ်ပါတယ်။
- **RFC 3629** — UTF-8 (8-bit UCS/Unicode Transformation Format) ကို ဒီမှာ သတ်မှတ် ဖော်ပြထားပါတယ်။
