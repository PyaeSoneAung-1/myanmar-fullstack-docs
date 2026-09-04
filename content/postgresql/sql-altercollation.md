---
title: "ALTER COLLATION (collation တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Collation တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း — version ကို refresh လုပ်ခြင်း (REFRESH VERSION)၊ နာမည်ပြောင်းခြင်း (RENAME TO)၊ ပိုင်ရှင် ပြောင်းလဲခြင်း (OWNER TO) နှင့် schema ရွှေ့ပြောင်းခြင်း (SET SCHEMA) — collation ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သော command"
order: 246
source: "https://www.postgresql.org/docs/current/sql-altercollation.html"
status: translated
updated: 2026-09-04
---

## ALTER COLLATION (collation တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER COLLATION — collation တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER COLLATION name REFRESH VERSION

ALTER COLLATION name RENAME TO new_name
ALTER COLLATION name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER COLLATION name SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER COLLATION` က collation တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER COLLATION` ကို သုံးဖို့ — collation ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ — ပိုင်ရှင်အသစ် ဖြစ်မယ့် role ဆီ `SET ROLE` လုပ်နိုင်ရပါမယ်၊ ပြီးတော့ အဲဒီ role က collation ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ကို ပြောင်းလဲတာက — collation ကို drop လုပ်ပြီး ပြန်ဖန်တီးခြင်းဖြင့် သင်လုပ်နိုင်တာထက် ပိုတဲ့ ဘာမှ မလုပ်နိုင်ဘူးဆိုတာ အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် collation ရဲ့ ပိုင်ဆိုင်မှုကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား collation တစ်ခုရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။
- **new_name** — Collation ရဲ့ နာမည် အသစ်။
- **new_owner** — Collation ရဲ့ ပိုင်ရှင် အသစ်။
- **new_schema** — Collation အတွက် schema အသစ်။
- **REFRESH VERSION** — Collation ရဲ့ version ကို update လုပ်ပေးပါတယ်။ အောက်က Notes (မှတ်စုများ) ကို ကြည့်ပါ။

## Notes (မှတ်စုများ)

Collation object တစ်ခုကို ဖန်တီးတဲ့အခါ — collation ရဲ့ provider-specific version ကို system catalog ထဲမှာ မှတ်တမ်းတင်ပါတယ်။ Collation ကို သုံးတဲ့အခါ — လက်ရှိ version ကို မှတ်တမ်းတင်ထားတဲ့ version နဲ့ စစ်ဆေးပြီး — မကိုက်ညီမှု (mismatch) ရှိနေရင် — သတိပေးချက် (warning) တစ်ခု ထုတ်ပေးပါတယ် — ဥပမာ:

```sql
WARNING:  collation "xx-x-icu" has version mismatch
DETAIL:  The collation in the database was created using version 1.2.3.4, but the operating system provides version 2.3.4.5.
HINT:  Rebuild all objects affected by this collation and run ALTER COLLATION pg_catalog."xx-x-icu" REFRESH VERSION, or build PostgreSQL with the right library version.
```

Collation definitions တွေမှာ ပြောင်းလဲမှုတစ်ခုက — corrupt indexes တွေနဲ့ တခြား ပြဿနာတွေကို ဖြစ်စေနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ database system က သိမ်းဆည်းထားတဲ့ objects တွေမှာ သတ်မှတ်ထားတဲ့ sort order (စီစဉ်မှု အစီအစဉ်) တစ်ခု ရှိတယ်လို့ အားထားလို့ပါ။ ယေဘုယျအားဖြင့် — ဒါကို ရှောင်ရှားသင့်ပေမယ့် — operating system ကို major version အသစ်တစ်ခုဆီ upgrade လုပ်တာ ဒါမှမဟုတ် — ICU ရဲ့ version အသစ်တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ server binaries တွေဆီ upgrade လုပ်ဖို့ `pg_upgrade` ကို သုံးတာလို — တရားဝင် (legitimate) အခြေအနေတွေမှာ ဖြစ်ပွားနိုင်ပါတယ်။ ဒီလို ဖြစ်လာတဲ့အခါ — collation ပေါ် မှီခိုနေတဲ့ objects တွေ အားလုံးကို — ဥပမာ `REINDEX` ကို သုံးပြီး — ပြန်လည် တည်ဆောက် (rebuild) သင့်ပါတယ်။ အဲဒါ ပြီးသွားတဲ့အခါ — `ALTER COLLATION ... REFRESH VERSION` command ကို သုံးပြီး collation version ကို refresh လုပ်နိုင်ပါတယ်။ ဒါက — လက်ရှိ collation version ကို မှတ်တမ်းတင်ဖို့ system catalog ကို update လုပ်ပေးပြီး — warning ကို ပျောက်ကွယ်စေပါလိမ့်မယ်။ ဒါက — သက်ရောက်မှုရှိတဲ့ objects တွေ အားလုံးကို မှန်ကန်စွာ rebuild လုပ်ပြီးလား ဆိုတာကို တကယ်တော့ မစစ်ဆေးဘူးဆိုတာ သတိပြုပါ။

`libc` က ထောက်ပံ့ပေးတဲ့ collations တွေကို သုံးတဲ့အခါ — version information တွေကို GNU C library ကို သုံးတဲ့ system တွေ (Linux systems အများစု), FreeBSD နဲ့ Windows တွေမှာ မှတ်တမ်းတင်ပါတယ်။ ICU က ထောက်ပံ့ပေးတဲ့ collations တွေကို သုံးတဲ့အခါ — version information ကို ICU library က ထောက်ပံ့ပေးပြီး — platform အားလုံးမှာ ရရှိနိုင်ပါတယ်။

> **မှတ်ချက်:** Collations တွေအတွက် GNU C library ကို သုံးတဲ့အခါ — C library ရဲ့ version ကို collation version အတွက် proxy (ကိုယ်စားလှယ်) အဖြစ် သုံးပါတယ်။ Linux distributions အများစုက — C library ကို upgrade လုပ်တဲ့အခါမှသာ — collation definitions တွေကို ပြောင်းလဲကြပါတယ် — ဒါပေမယ့် — maintainers တွေက collation definitions အသစ်တွေကို C library ဗားရှင်း အဟောင်းတွေဆီ back-port (နောက်ကြောင်း ပြန်လည် သယ်ဆောင်) လုပ်ဖို့ လွတ်လပ်လို့ — ဒီနည်းလမ်းက မစုံလင်ပါဘူး။
> 
> Collations တွေအတွက် Windows ကို သုံးတဲ့အခါ — version information တွေကို `en-US` လို BCP 47 language tags တွေနဲ့ define လုပ်ထားတဲ့ collations တွေအတွက်သာ ရရှိနိုင်ပါတယ်။

Database ရဲ့ default collation အတွက် — `ALTER DATABASE ... REFRESH COLLATION VERSION` ဆိုတဲ့ အလားတူ command တစ်ခု ရှိပါတယ်။

လက်ရှိ database ထဲမှာ refresh လုပ်ဖို့ လိုအပ်တဲ့ collations တွေ အားလုံးနဲ့ — သူတို့ပေါ် မှီခိုနေတဲ့ objects တွေကို ခွဲခြားသိရှိဖို့ အောက်ပါ query ကို သုံးနိုင်ပါတယ်:

```sql
SELECT pg_describe_object(refclassid, refobjid, refobjsubid) AS "Collation",
       pg_describe_object(classid, objid, objsubid) AS "Object"
  FROM pg_depend d JOIN pg_collation c
       ON refclassid = 'pg_collation'::regclass AND refobjid = c.oid
  WHERE c.collversion <> pg_collation_actual_version(c.oid)
  ORDER BY 1, 2;
```

## Examples (ဥပမာများ)

`de_DE` collation ကို `german` အဖြစ် နာမည်ပြောင်းဖို့:

```sql
ALTER COLLATION "de_DE" RENAME TO german;
```

`en_US` collation ရဲ့ ပိုင်ရှင်ကို `joe` အဖြစ် ပြောင်းလဲဖို့:

```sql
ALTER COLLATION "en_US" OWNER TO joe;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER COLLATION` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE COLLATION](/docs/postgresql/sql-createcollation), [DROP COLLATION](/docs/postgresql/sql-dropcollation)
