---
title: "ALTER TABLESPACE (tablespace တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "Tablespace တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း — RENAME TO ၊ OWNER TO ၊ SET နှင့် RESET ပုံစံများ ၊ name ၊ new_name ၊ new_owner ၊ tablespace_option parameter များအကြောင်း"
order: 281
source: "https://www.postgresql.org/docs/current/sql-altertablespace.html"
status: translated
updated: 2026-09-04
---

## ALTER TABLESPACE (tablespace တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER TABLESPACE — tablespace တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TABLESPACE name RENAME TO new_name
ALTER TABLESPACE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER TABLESPACE name SET ( tablespace_option = value [, ... ] )
ALTER TABLESPACE name RESET ( tablespace_option [, ... ] )
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER TABLESPACE` ကို tablespace တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲဖို့ သုံးနိုင်ပါတယ်။

Tablespace တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲဖို့ဆိုရင် — သင်က tablespace ကို ပိုင်ဆိုင်ထားရပါမယ်။ ပိုင်ရှင်ကို ပြောင်းလဲဖို့ဆိုရင် — ပိုင်ရှင်အသစ် ဖြစ်လာမယ့် role ဆီကိုလည်း `SET ROLE` လုပ်နိုင်စွမ်း ရှိရပါမယ်။ (Superusers တွေမှာ ဒီ privileges တွေ အလိုအလျောက် ရှိတယ်ဆိုတာ သတိပြုပါ။)

## Parameters (parameter များ)

- **name** — ရှိပြီးသား tablespace တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **new_name** — Tablespace ရဲ့ နာမည်သစ် ဖြစ်ပါတယ်။ နာမည်သစ်က `pg_` နဲ့ စလို့ မရပါဘူး — ဒီလို နာမည်တွေက system tablespaces တွေအတွက် သီးသန့် သတ်မှတ်ထားလို့ပါ။
- **new_owner** — Tablespace ရဲ့ ပိုင်ရှင်အသစ် ဖြစ်ပါတယ်။
- **tablespace_option** — Set လုပ်ရန် သို့မဟုတ် reset လုပ်ရန် tablespace parameter တစ်ခု ဖြစ်ပါတယ်။ လောလောဆယ် — ရနိုင်တဲ့ parameter တွေက seq_page_cost, random_page_cost, effective_io_concurrency နဲ့ maintenance_io_concurrency တို့ပဲ ဖြစ်ပါတယ်။ ဒီတန်ဖိုးတွေကို tablespace တစ်ခုအတွက် သတ်မှတ်လိုက်ရင် — အဲဒီ tablespace ထဲက tables တွေကနေ pages တွေ ဖတ်ရတဲ့ ကုန်ကျစရိတ်နဲ့ — ထုတ်ပေးတဲ့ concurrent I/O အရေအတွက်တို့အတွက် — planner (စီစဉ်သူ) ရဲ့ ပုံမှန် ခန့်မှန်းချက်ကို — နာမည်တူ configuration parameters တွေနဲ့ သတ်မှတ်ထားတဲ့အတိုင်း — override (ကျော်လွန် အစားထိုး) လုပ်ပါလိမ့်မယ် (seq_page_cost, random_page_cost, effective_io_concurrency, maintenance_io_concurrency တို့ကို ကြည့်ပါ)။ Tablespace တစ်ခုက I/O subsystem ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေထက် — ပိုမြန်တဲ့ ဒါမှမဟုတ် ပိုနှေးတဲ့ disk တစ်ခုပေါ်မှာ တည်ရှိနေရင် — ဒါက အသုံးဝင်နိုင်ပါတယ်။

## Examples (ဥပမာများ)

Tablespace `index_space` ကို `fast_raid` အဖြစ် နာမည်ပြောင်းရန်:

```sql
ALTER TABLESPACE index_space RENAME TO fast_raid;
```

Tablespace `index_space` ရဲ့ ပိုင်ရှင်ကို ပြောင်းလဲရန်:

```sql
ALTER TABLESPACE index_space OWNER TO mary;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER TABLESPACE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TABLESPACE](/docs/postgresql/sql-createtablespace), [DROP TABLESPACE](/docs/postgresql/sql-droptablespace)
