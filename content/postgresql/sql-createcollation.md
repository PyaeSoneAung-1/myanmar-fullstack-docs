---
title: "CREATE COLLATION (collation အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "သတ်မှတ်ထားသော operating system locale settings များကို သုံးပြီး သို့မဟုတ် ရှိပြီးသား collation တစ်ခုကို copy လုပ်ပြီး collation အသစ်တစ်ခုကို define လုပ်ခြင်း — IF NOT EXISTS, LOCALE, PROVIDER, DETERMINISTIC, RULES, VERSION option များ — destination schema ပေါ်တွင် CREATE privilege လိုအပ်သော command"
order: 245
source: "https://www.postgresql.org/docs/current/sql-createcollation.html"
status: translated
updated: 2026-09-04
---

## CREATE COLLATION (collation အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE COLLATION — collation အသစ်တစ်ခုကို define (သတ်မှတ်) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE COLLATION [ IF NOT EXISTS ] name (
    [ LOCALE = locale, ]
    [ LC_COLLATE = lc_collate, ]
    [ LC_CTYPE = lc_ctype, ]
    [ PROVIDER = provider, ]
    [ DETERMINISTIC = boolean, ]
    [ RULES = rules, ]
    [ VERSION = version ]
)
CREATE COLLATION [ IF NOT EXISTS ] name FROM existing_collation
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE COLLATION` က — သတ်မှတ်ထားတဲ့ operating system locale settings တွေကို သုံးပြီး ဒါမှမဟုတ် — ရှိပြီးသား collation တစ်ခုကို copy လုပ်ပြီး — collation အသစ်တစ်ခုကို define လုပ်ပေးပါတယ်။

Collation တစ်ခုကို ဖန်တီးနိုင်ဖို့ — destination schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။

## Parameters (parameter များ)

- **IF NOT EXISTS** — နာမည်တူတဲ့ collation တစ်ခု ရှိပြီးသားဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။ ရှိပြီးသား collation က — ဖန်တီးခံရမယ့် collation နဲ့ ဘယ်လိုမှ မတူညီနိုင်ဘူးဆိုတဲ့ အာမခံချက် မရှိကြောင်း သတိပြုပါ။
- **name** — Collation ရဲ့ နာမည်။ Collation နာမည်ကို schema-qualified လုပ်နိုင်ပါတယ်။ မလုပ်ထားဘူးဆိုရင် — collation ကို လက်ရှိ schema ထဲမှာ define လုပ်ပါတယ်။ Collation နာမည်က အဲဒီ schema အတွင်းမှာ ထူးခြား (unique) ရပါမယ်။ (System catalogs တွေမှာ — တခြား encodings တွေအတွက် နာမည်တူတဲ့ collations တွေ ပါဝင်နိုင်ပေမယ့် — database encoding နဲ့ မကိုက်ညီရင် အဲဒါတွေကို လျစ်လျူရှုပါတယ်။)
- **locale** — ဒီ collation အတွက် locale နာမည်။ အသေးစိတ်အတွက် အပိုင်း 23.2.2.3.1 နဲ့ အပိုင်း 23.2.2.3.2 ကို ကြည့်ပါ။
Provider က libc ဆိုရင် — ဒါက LC_COLLATE နဲ့ LC_CTYPE တွေကို တစ်ပြိုင်နက် သတ်မှတ်ပေးတဲ့ အတိုကောက် (shortcut) တစ်ခု ဖြစ်ပါတယ်။ locale ကို သတ်မှတ်ထားရင် — အဲဒီ parameter နှစ်ခုထဲက တစ်ခုကိုမှ သတ်မှတ်လို့ မရပါဘူး။
Provider က builtin ဆိုရင် — locale ကို သတ်မှတ်ပေးရမှာ ဖြစ်ပြီး — C, C.UTF-8 ဒါမှမဟုတ် PG_UNICODE_FAST ထဲက တစ်ခုခု ဖြစ်ရပါမယ်။
- **lc_collate** — Provider က libc ဆိုရင် — LC_COLLATE locale category အတွက် သတ်မှတ်ထားတဲ့ operating system locale ကို သုံးပါ။
- **lc_ctype** — Provider က libc ဆိုရင် — LC_CTYPE locale category အတွက် သတ်မှတ်ထားတဲ့ operating system locale ကို သုံးပါ။
- **provider** — ဒီ collation နဲ့ ဆက်စပ်တဲ့ locale services တွေအတွက် သုံးရမယ့် provider ကို သတ်မှတ်ပေးပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက builtin, icu (server ကို ICU support နဲ့ build လုပ်ထားရင်) ဒါမှမဟုတ် libc တို့ ဖြစ်ပါတယ်။ libc က default ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 23.1.4 ကို ကြည့်ပါ။
- **DETERMINISTIC** — Collation က deterministic comparisons (ပြတ်သားသော နှိုင်းယှဉ်မှုများ) ကို သုံးသင့်လားဆိုတာ သတ်မှတ်ပေးပါတယ်။ Default က true ဖြစ်ပါတယ်။ Deterministic comparison တစ်ခုက — byte-wise (byte အလိုက်) တူညီမှု မရှိတဲ့ strings တွေကို — နှိုင်းယှဉ်ချက်အရ ယုတ္တိကျကျ ညီမျှတယ်လို့ ယူဆရင် တောင်မှ — မညီမျှဘူးလို့ သဘောထားပါတယ်။ PostgreSQL က tie (သရေကျမှု) တွေကို byte-wise comparison တစ်ခုနဲ့ ဖြေရှင်းပေးပါတယ်။ Deterministic မဟုတ်တဲ့ comparison က collation ကို — ဥပမာ — case- သို့မဟုတ် accent-insensitive (စာလုံးအကြီး/အသေး သို့မဟုတ် လေယူလေသိမ်း အာရုံမခံသော) ဖြစ်စေနိုင်ပါတယ်။ အဲဒါအတွက် — သင့်လျော်တဲ့ LOCALE setting တစ်ခုကို ရွေးချယ်ပြီး — collation ကို ဒီနေရာမှာ deterministic မဟုတ်အောင် သတ်မှတ်ဖို့ လိုပါတယ်။
Nondeterministic collations တွေကို ICU provider နဲ့သာ ထောက်ပံ့ပါတယ်။
- **rules** — Collation ရဲ့ အပြုအမူကို စိတ်ကြိုက်ပြင်ဆင်ဖို့ ထပ်ဆောင်း collation rules တွေကို သတ်မှတ်ပေးပါတယ်။ ဒါကို ICU အတွက်သာ ထောက်ပံ့ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 23.2.3.4 ကို ကြည့်ပါ။
- **version** — Collation နဲ့အတူ သိမ်းဆည်းရမယ့် version string ကို သတ်မှတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် — ဒါကို ချန်လိုက်သင့်ပြီး — အဲဒီအခါ version ကို — operating system က ထောက်ပံ့ပေးတဲ့ collation ရဲ့ တကယ့် version ကနေ တွက်ချက်ပါလိမ့်မယ်။ ဒီ option က — ရှိပြီးသား installation တစ်ခုကနေ version ကို copy လုပ်ဖို့ — pg_upgrade က သုံးဖို့ ရည်ရွယ်ထားတာပါ။
Collation version mismatches (မကိုက်ညီမှုများ) တွေကို ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာအတွက် — ALTER COLLATION ကိုလည်း ကြည့်ပါ။
- **existing_collation** — Copy လုပ်ရမယ့် ရှိပြီးသား collation တစ်ခုရဲ့ နာမည်။ Collation အသစ်က — ရှိပြီးသား တစ်ခုရဲ့ ဂုဏ်ရည်တွေ (properties) အတိုင်း ရှိပါလိမ့်မယ် — ဒါပေမယ့် — ၎င်းက သီးခြား (independent) object တစ်ခု ဖြစ်ပါလိမ့်မယ်။

## Notes (မှတ်စုများ)

`CREATE COLLATION` က — self-conflicting (မိမိကိုယ်နှင့် ဆန့်ကျင်သော) ဖြစ်တဲ့ — `SHARE ROW EXCLUSIVE` lock တစ်ခုကို `pg_collation` system catalog ပေါ်မှာ ယူပါတယ် — ဒါကြောင့် — `CREATE COLLATION` command တစ်ခုတည်းကိုပဲ တစ်ကြိမ်မှာ run လို့ ရပါတယ်။

User-defined collations တွေကို ဖယ်ရှားဖို့ `DROP COLLATION` ကို သုံးပါ။

Collations တွေကို ဘယ်လို ဖန်တီးရမလဲဆိုတဲ့ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 23.2.2.3](https://www.postgresql.org/docs/current/collation.html#COLLATION-CREATE) ကို ကြည့်ပါ။

`libc` collation provider ကို သုံးတဲ့အခါ — locale က လက်ရှိ database encoding နဲ့ သက်ဆိုင်နိုင်ရပါမယ်။ တိကျတဲ့ စည်းမျဉ်းတွေအတွက် [CREATE DATABASE](/docs/postgresql/sql-createdatabase) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

Operating system locale `fr_FR.utf8` ကနေ collation တစ်ခု ဖန်တီးဖို့ (လက်ရှိ database encoding က `UTF8` လို့ ယူဆပြီး):

```sql
CREATE COLLATION french (locale = 'fr_FR.utf8');
```

German phone book sort order ကို သုံးပြီး — ICU provider နဲ့ collation တစ်ခု ဖန်တီးဖို့:

```sql
CREATE COLLATION german_phonebook (provider = icu, locale = 'de-u-co-phonebk');
```

Root ICU locale ကို အခြေခံပြီး — custom rules တွေနဲ့အတူ — ICU provider ကို သုံးပြီး collation တစ်ခု ဖန်တီးဖို့:

```sql
CREATE COLLATION custom (provider = icu, locale = 'und', rules = '&V << w <<< W');
```

Rules syntax အကြောင်း နောက်ထပ် အသေးစိတ်နဲ့ ဥပမာတွေအတွက် [အပိုင်း 23.2.3.4](https://www.postgresql.org/docs/current/collation.html#ICU-TAILORING-RULES) ကို ကြည့်ပါ။

ရှိပြီးသား collation တစ်ခုကနေ collation တစ်ခု ဖန်တီးဖို့:

```sql
CREATE COLLATION german FROM "de_DE";
```

ဒါက — applications တွေထဲမှာ operating-system-independent (operating system ပေါ် မမှီခိုသော) collation names တွေကို သုံးနိုင်ဖို့ — အဆင်ပြေစေပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE COLLATION` statement ဆိုတာ ရှိပါတယ် — ဒါပေမယ့် — ၎င်းက ရှိပြီးသား collation တစ်ခုကို copy လုပ်တာနဲ့သာ ကန့်သတ်ထားပါတယ်။ Collation အသစ်တစ်ခုကို ဖန်တီးဖို့ syntax ကတော့ PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER COLLATION](/docs/postgresql/sql-altercollation), [DROP COLLATION](/docs/postgresql/sql-dropcollation)
