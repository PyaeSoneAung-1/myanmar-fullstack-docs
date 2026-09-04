---
title: "ALTER SYSTEM (server configuration parameter တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Database cluster တစ်ခုလုံးအတွက် server configuration parameters များကို ပြောင်းလဲပေးသည့် command — postgresql.auto.conf file ထဲသို့ ရေးသားပြီး configuration reload သို့မဟုတ် server restart ပြီးနောက် အကျိုးသက်ရောက်သည် — superuser သို့မဟုတ် ALTER SYSTEM privilege ရရှိထားသူများသာ သုံးနိုင်ပြီး transaction block သို့မဟုတ် function အတွင်းတွင် ခွင့်မပြုပါ"
order: 303
source: "https://www.postgresql.org/docs/current/sql-altersystem.html"
status: translated
updated: 2026-09-04
---

## ALTER SYSTEM (server configuration parameter တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER SYSTEM — server configuration parameter (ဆာဗာ ပြင်ဆင်မှု parameter) တစ်ခုကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER SYSTEM SET configuration_parameter { TO | = } { value [, ...] | DEFAULT }

ALTER SYSTEM RESET configuration_parameter
ALTER SYSTEM RESET ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER SYSTEM` ကို — database cluster (database အစုအဝေး) တစ်ခုလုံးအတွက် server configuration parameters တွေကို ပြောင်းလဲဖို့ သုံးပါတယ်။ ဒါက `postgresql.conf` file ကို လက်နဲ့ ကိုယ်တိုင် ပြင်ဆင်တဲ့ ရိုးရာ နည်းလမ်းထက် ပိုပြီး အဆင်ပြေနိုင်ပါတယ်။ `ALTER SYSTEM` က — ပေးထားတဲ့ parameter setting ကို — `postgresql.conf` အပြင် ထပ်ဆောင်း ဖတ်ရှုတဲ့ — `postgresql.auto.conf` file ထဲကို ရေးသားပါတယ်။ Parameter တစ်ခုကို `DEFAULT` လို့ သတ်မှတ်တာ ဒါမှမဟုတ် `RESET` ပုံစံကို သုံးတာက — အဲဒီ configuration entry ကို `postgresql.auto.conf` file ထဲကနေ ဖယ်ရှားပေးပါတယ်။ ဒီလို configuration entries တွေ အားလုံးကို ဖယ်ရှားဖို့ `RESET ALL` ကို သုံးပါ။

`ALTER SYSTEM` နဲ့ သတ်မှတ်ထားတဲ့ values တွေက — နောက် server configuration reload တစ်ခု ပြီးနောက် — ဒါမှမဟုတ် server start ချိန်မှာပဲ ပြောင်းလဲလို့ရတဲ့ parameters တွေဆိုရင် — နောက် server restart တစ်ခု ပြီးနောက်မှာ အကျိုးသက်ရောက်မှု ရှိပါလိမ့်မယ်။ Server configuration reload တစ်ခုကို — `pg_reload_conf()` SQL function ကို call လုပ်ခြင်း၊ `pg_ctl reload` ကို run လုပ်ခြင်း ဒါမှမဟုတ် main server process ဆီ SIGHUP signal တစ်ခု ပို့ခြင်းအားဖြင့် — ညွှန်ကြားနိုင်ပါတယ်။

Superusers တွေနဲ့ — parameter တစ်ခုပေါ်မှာ `ALTER SYSTEM` privilege ရရှိထားတဲ့ users တွေပဲ — `ALTER SYSTEM` ကို သုံးပြီး အဲဒါကို ပြောင်းလဲနိုင်ပါတယ်။ ဒါ့အပြင် — ဒီ command က file system ပေါ်မှာ တိုက်ရိုက် သက်ရောက်ပြီး rollback လုပ်လို့ မရတာမို့ — transaction block ဒါမှမဟုတ် function တစ်ခုရဲ့ အတွင်းမှာ ခွင့်မပြုပါဘူး။

## Parameters (parameter များ)

- **configuration_parameter** — သတ်မှတ်လို့ရတဲ့ configuration parameter တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ ရရှိနိုင်တဲ့ parameters တွေကို အခန်း 19 မှာ မှတ်တမ်းတင်ထားပါတယ်။
- **value** — parameter ရဲ့ တန်ဖိုး အသစ် ဖြစ်ပါတယ်။ Values တွေကို — parameter တစ်ခုချင်းစီအတွက် သင့်လျော်သလို — string constants, identifiers, numbers ဒါမှမဟုတ် ဒီတွေရဲ့ comma ခွဲထားတဲ့ စာရင်းတွေအနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ Numbers မဟုတ်တဲ့ ဒါမှမဟုတ် valid identifiers မဟုတ်တဲ့ values တွေကို quote လုပ်ရပါမယ်။ Parameter နဲ့ သူ့ရဲ့ value ကို postgresql.auto.conf ကနေ ဖယ်ရှားဖို့အတွက် DEFAULT လို့ ရေးသားနိုင်ပါတယ်။
List တွေ လက်ခံတဲ့ parameters တချို့အတွက် — quoted values တွေက whitespace နဲ့ commas တွေကို ထိန်းသိမ်းဖို့ double-quoted output ကို ထုတ်ပေးပါတယ်; တခြား parameters တွေအတွက်တော့ — ဒီ အကျိုးသက်ရောက်မှု ရရှိဖို့ — single-quoted strings တွေရဲ့ အတွင်းမှာ double-quotes တွေကို သုံးရပါတယ်။

## Notes (မှတ်စုများ)

ဒီ command ကို [data_directory](https://www.postgresql.org/docs/current/runtime-config-file-locations.html#GUC-DATA-DIRECTORY), [allow_alter_system](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-ALLOW-ALTER-SYSTEM) နဲ့ — `postgresql.conf` ထဲမှာ ခွင့်မပြုထားတဲ့ parameters တွေ (ဥပမာ — [preset options](https://www.postgresql.org/docs/current/runtime-config-preset.html)) ကို သတ်မှတ်ဖို့ သုံးလို့ မရပါဘူး။

Parameters တွေကို သတ်မှတ်ဖို့ တခြား နည်းလမ်းတွေအတွက် [အပိုင်း 19.1](https://www.postgresql.org/docs/current/config-setting.html) ကို ကြည့်ပါ။

`ALTER SYSTEM` ကို — [allow_alter_system](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-ALLOW-ALTER-SYSTEM) ကို `off` လို့ သတ်မှတ်ခြင်းအားဖြင့် disable လုပ်နိုင်ပါတယ် — ဒါပေမယ့် ဒါက လုံခြုံရေး ယန္တရား (security mechanism) တစ်ခု မဟုတ်ပါဘူး (ဒီ parameter ရဲ့ documentation မှာ အသေးစိတ် ရှင်းပြထားသလိုပါ)။

## Examples (ဥပမာများ)

`wal_level` ကို သတ်မှတ်ခြင်း:

```sql
ALTER SYSTEM SET wal_level = replica;
```

အဲဒါကို ပြန်ဖျက်ပြီး — `postgresql.conf` ထဲမှာ အကျိုးသက်ရောက်နေတဲ့ setting ကို ပြန်လည် ရယူခြင်း:

```sql
ALTER SYSTEM RESET wal_level;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER SYSTEM` statement က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[SET](/docs/postgresql/sql-set), [SHOW](/docs/postgresql/sql-show)
