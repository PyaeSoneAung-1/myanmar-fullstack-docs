---
title: "ALTER SUBSCRIPTION (subscription တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "Subscription (စာရင်းသွင်းမှု) တစ်ခုရဲ့ သတ်မှတ်ချက်များကို ပြောင်းလဲပေးသည့် command — CONNECTION ပြောင်းလဲခြင်း၊ SET/ADD/DROP PUBLICATION နှင့် REFRESH PUBLICATION၊ ENABLE/DISABLE၊ subscription parameters (slot_name, two_phase, failover အပါအဝင်) သတ်မှတ်ခြင်း၊ SKIP နှင့် OWNER/RENAME တို့အကြောင်း — PostgreSQL extension တစ်ခုဖြစ်သည်"
order: 311
source: "https://www.postgresql.org/docs/current/sql-altersubscription.html"
status: translated
updated: 2026-09-04
---

## ALTER SUBSCRIPTION (subscription တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER SUBSCRIPTION — subscription တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER SUBSCRIPTION name CONNECTION 'conninfo'
ALTER SUBSCRIPTION name SET PUBLICATION publication_name [, ...] [ WITH ( publication_option [= value] [, ... ] ) ]
ALTER SUBSCRIPTION name ADD PUBLICATION publication_name [, ...] [ WITH ( publication_option [= value] [, ... ] ) ]
ALTER SUBSCRIPTION name DROP PUBLICATION publication_name [, ...] [ WITH ( publication_option [= value] [, ... ] ) ]
ALTER SUBSCRIPTION name REFRESH PUBLICATION [ WITH ( refresh_option [= value] [, ... ] ) ]
ALTER SUBSCRIPTION name ENABLE
ALTER SUBSCRIPTION name DISABLE
ALTER SUBSCRIPTION name SET ( subscription_parameter [= value] [, ... ] )
ALTER SUBSCRIPTION name SKIP ( skip_option = value )
ALTER SUBSCRIPTION name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER SUBSCRIPTION name RENAME TO new_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER SUBSCRIPTION` က — [CREATE SUBSCRIPTION](/docs/postgresql/sql-createsubscription) မှာ သတ်မှတ်လို့ ရတဲ့ subscription properties တွေထဲက အများစုကို ပြောင်းလဲပေးနိုင်ပါတယ်။

`ALTER SUBSCRIPTION` ကို သုံးဖို့ — subscription ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Subscription တစ်ခုကို rename လုပ်ဖို့ သို့မဟုတ် owner ကို ပြောင်းလဲဖို့ဆိုရင် — database ပေါ်မှာ `CREATE` permission ရှိရပါမယ်။ ထို့အပြင် — owner ကို ပြောင်းလဲဖို့ — owner အသစ် ဖြစ်လာမယ့် role ဆီ `SET ROLE` လုပ်နိုင်စွမ်း ရှိရပါမယ်။ Subscription မှာ `password_required=false` ရှိနေရင် — superusers တွေပဲ ဒါကို ပြုပြင် (modify) လို့ ရပါတယ်။

Publication တစ်ခုကို refresh လုပ်တဲ့အခါ — publication ရဲ့ အစိတ်အပိုင်း မဟုတ်တော့တဲ့ relations တွေကို ဖယ်ရှားပြီး — table synchronization slots တွေ ရှိရင်လည်း ဖယ်ရှားပါတယ်။ Remote host (အဝေး host) ပေါ်မှာ subscription အတွက် ခွဲဝေထားတဲ့ resources (အရင်းအမြစ်များ) တွေ လွှတ်ပေးနိုင်ဖို့ — ဒီ slots တွေကို ဖယ်ရှားဖို့ လိုအပ်ပါတယ်။ Network ပြတ်တောက်မှု သို့မဟုတ် တခြား error တစ်ခုခုကြောင့် — PostgreSQL က slots တွေကို ဖယ်ရှားနိုင်ခြင်း မရှိဘူးဆိုရင် — error တစ်ခု အစီရင်ခံပါလိမ့်မယ်။ ဒီလို အခြေအနေမှာ ဆက်လုပ်ဖို့ဆိုရင် — user က operation ကို ပြန်ကြိုးစားရမှာ ဖြစ်သလို — [DROP SUBSCRIPTION](/docs/postgresql/sql-dropsubscription) မှာ ရှင်းပြထားတဲ့အတိုင်း — slot ကို subscription ကနေ ခွဲထုတ် (disassociate) လုပ်ပြီး — subscription ကို drop လုပ်ရမှာလည်း ဖြစ်ပါတယ်။

`ALTER SUBSCRIPTION ... REFRESH PUBLICATION`, `refresh` option က `true` ဖြစ်တဲ့ `ALTER SUBSCRIPTION ... {SET|ADD|DROP} PUBLICATION ...`, `ALTER SUBSCRIPTION ... SET (failover = true|false)` နဲ့ `ALTER SUBSCRIPTION ... SET (two_phase = false)` ဆိုတဲ့ commands တွေကို — transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

`ALTER SUBSCRIPTION ... REFRESH PUBLICATION` နဲ့ — `refresh` option က `true` ဖြစ်တဲ့ `ALTER SUBSCRIPTION ... {SET|ADD|DROP} PUBLICATION ...` ဆိုတဲ့ commands တွေကို — subscription မှာ [`two_phase`](/docs/postgresql/sql-createsubscription) commit ကို enable လုပ်ထားတဲ့အခါ — [`copy_data`](/docs/postgresql/sql-createsubscription) က `false` မဟုတ်ဘူးဆိုရင် — execute လုပ်လို့လည်း မရပါဘူး။ တကယ့် two-phase state ကို သိရဖို့ [`pg_subscription`](https://www.postgresql.org/docs/current/catalog-pg-subscription.html) ရဲ့ `subtwophasestate` column ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — Properties တွေကို ပြောင်းလဲမယ့် subscription တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **CONNECTION 'conninfo'** — ဒီ clause က — CREATE SUBSCRIPTION က မူလ သတ်မှတ်ခဲ့တဲ့ connection string ကို အစားထိုးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် အဲဒီမှာ ကြည့်ပါ။
- **SET PUBLICATION publication_name [, ...]** — ဒီ form က — စာရင်းသွင်းထားတဲ့ (subscribed) publications စာရင်း တစ်ခုလုံးကို — စာရင်းအသစ်တစ်ခုနဲ့ အစားထိုးပါတယ်။
- **ADD PUBLICATION publication_name [, ...]** — ဒီ form က — publications စာရင်းထဲကို — publications အပိုတွေ ထပ်ဖြည့်ပေးပါတယ်။
- **DROP PUBLICATION publication_name [, ...]** — ဒီ form က — publications တွေကို — publications စာရင်းကနေ ဖယ်ရှားပေးပါတယ်။
User တွေ နောက်မှ ထပ်ဖြည့်နိုင်အောင် — တည်ရှိခြင်း မရှိတဲ့ publications တွေကို ADD နဲ့ SET variants တွေမှာ သတ်မှတ်ခွင့် ပြုထားပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် CREATE SUBSCRIPTION ကို ကြည့်ပါ။ Default အနေနဲ့ — ဒီ command က REFRESH PUBLICATION လိုပါ ပြုမူ လုပ်ဆောင်ပါတယ်။
publication_option က ဒီ operation အတွက် ထပ်ဆောင်း options တွေကို သတ်မှတ်ပေးပါတယ်။ ထောက်ပံ့ပေးထားတဲ့ options တွေကတော့:

refresh (boolean)

false ဆိုရင် — command က table information တွေကို refresh လုပ်ဖို့ မကြိုးစားပါဘူး။ REFRESH PUBLICATION ကို အဲဒီအခါမှာ သီးခြား execute လုပ်ရပါမယ်။ Default ကတော့ true ဖြစ်ပါတယ်။

ထို့အပြင် — implicit refresh operation ကို ထိန်းချုပ်ဖို့ — REFRESH PUBLICATION အောက်မှာ ဖော်ပြထားတဲ့ options တွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။
- **REFRESH PUBLICATION** — Publisher ဆီကနေ ပျောက်ဆုံးနေတဲ့ (missing) table information တွေကို ယူဆောင်ပေးပါတယ်။ ဒါက — CREATE SUBSCRIPTION ဒါမှမဟုတ် REFRESH PUBLICATION ရဲ့ နောက်ဆုံး ခေါ်ယူမှု နောက်ပိုင်းမှာ — စာရင်းသွင်းထားတဲ့ publications တွေဆီ ထပ်ဖြည့်လိုက်တဲ့ tables တွေရဲ့ replication ကို စတင်ပေးပါလိမ့်မယ်။
refresh_option က refresh operation အတွက် ထပ်ဆောင်း options တွေကို သတ်မှတ်ပေးပါတယ်။ ထောက်ပံ့ပေးထားတဲ့ options တွေကတော့:

copy_data (boolean)

Replication စတင်တဲ့အခါ — စာရင်းသွင်းထားတဲ့ publications တွေထဲက — ကြိုတင် ရှိပြီးသား data တွေကို copy လုပ်မလားဆိုတာကို သတ်မှတ်ပါတယ်။ Default ကတော့ true ဖြစ်ပါတယ်။
အရင်က စာရင်းသွင်းပြီးသား (previously subscribed) tables တွေကိုတော့ — table တစ်ခုရဲ့ row filter WHERE clause က နောက်ပိုင်းမှာ ပြုပြင်ခဲ့ရင်တောင် — copy လုပ်မှာ မဟုတ်ပါဘူး။
copy_data = true က origin parameter နဲ့ ဘယ်လို ဆက်စပ် သက်ရောက်မှု ရှိနိုင်လဲဆိုတဲ့ အသေးစိတ်အတွက် Notes ကို ကြည့်ပါ။
ကြိုတင် ရှိပြီးသား data တွေကို binary format နဲ့ copy လုပ်ခြင်းအကြောင်း အသေးစိတ်အတွက် CREATE SUBSCRIPTION ရဲ့ binary parameter ကို ကြည့်ပါ။
- **ENABLE** — အရင် disable လုပ်ထားတဲ့ subscription တစ်ခုကို enable လုပ်ပြီး — transaction ရဲ့ အဆုံးမှာ logical replication worker ကို စတင်ပေးပါတယ်။
- **DISABLE** — လည်ပတ်နေတဲ့ (running) subscription တစ်ခုကို disable လုပ်ပြီး — transaction ရဲ့ အဆုံးမှာ logical replication worker ကို ရပ်တန့်ပေးပါတယ်။
- **SET ( subscription_parameter [= value] [, ... ] )** — ဒီ clause က — CREATE SUBSCRIPTION က မူလ သတ်မှတ်ခဲ့တဲ့ parameters တွေကို ပြောင်းလဲပေးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် အဲဒီမှာ ကြည့်ပါ။ ပြောင်းလဲလို့ ရတဲ့ parameters တွေကတော့ slot_name, synchronous_commit, binary, streaming, disable_on_error, password_required, run_as_owner, origin, failover နဲ့ two_phase တို့ ဖြစ်ပါတယ်။ password_required = false ကို သတ်မှတ်နိုင်တာ superuser တစ်ယောက်ပဲ ဖြစ်ပါတယ်။
slot_name ကို ပြောင်းလဲတဲ့အခါ — နာမည်တပ်ထားတဲ့ slot ရဲ့ failover နဲ့ two_phase property တန်ဖိုးတွေက — subscription ထဲမှာ သတ်မှတ်ထားတဲ့ counterpart failover နဲ့ two_phase parameters တွေနဲ့ ကွဲပြားနေနိုင်ပါတယ်။ Slot ကို ဖန်တီးတဲ့အခါ — slot ရဲ့ failover နဲ့ two_phase properties တွေက subscription ရဲ့ counterpart parameters တွေနဲ့ ကိုက်ညီနေအောင် သေချာစေပါ။ မဟုတ်ရင် — publisher ပေါ်က slot က ဒီ subscription options တွေ ဖော်ပြထားတာနဲ့ မတူညီတဲ့ အပြုအမူ ရှိနိုင်ပါတယ်: ဥပမာ — subscription ရဲ့ failover option က disabled ဖြစ်နေတာတောင် publisher ပေါ်က slot က standbys တွေဆီ sync လုပ်ခံရနိုင်သလို — subscription ရဲ့ failover option က enabled ဖြစ်နေတာတောင် sync အတွက် disabled ဖြစ်နေနိုင်ပါတယ်။
failover နဲ့ two_phase parameters တွေကို — subscription က disabled ဖြစ်နေတဲ့အခါမှသာ ပြောင်းလဲလို့ ရပါတယ်။
two_phase ကို true ကနေ false အဖြစ် ပြောင်းလဲတဲ့အခါ — logical replication worker က လုပ်ဆောင်ခဲ့တဲ့ (two_phase parameter က true ဖြစ်နေတုန်း အချိန်က) prepared transactions တွေ တစ်ခုခု တွေ့ရှိရရင် — backend process က error တစ်ခုကို အစီရင်ခံပါတယ်။ Publisher node ပေါ်မှာ prepared transactions တွေကို ဖြေရှင်းနိုင်သလို — subscriber ပေါ်မှာ လက်နဲ့ ကိုယ်တိုင် roll back လုပ်ပြီး — နောက်တစ်ကြိမ် ပြန်ကြိုးစားနိုင်ပါတယ်။ Subscription တစ်ခုနဲ့ သက်ဆိုင်တဲ့ logical replication worker က prepare လုပ်တဲ့ transactions တွေက အောက်ပါ ပုံစံ (pattern) ရှိပါတယ်: “pg_gid_%u_%u” (parameters: subscription oid, remote transaction id xid)။ ဒီလို transactions တွေကို လက်နဲ့ ဖြေရှင်းဖို့ဆိုရင် — သူတို့ရဲ့ နာမည်တွေထဲမှာ သက်ဆိုင်တဲ့ subscription IDs တွေ ပါဝင်တဲ့ prepared transactions တွေ အားလုံးကို roll back လုပ်ရပါမယ်။ Applications တွေက လိုအပ်တဲ့ prepared transactions တွေကို ရှာဖွေဖို့ pg_prepared_xacts ကို စစ်ဆေးနိုင်ပါတယ်။ two_phase option ကို true ကနေ false အဖြစ် ပြောင်းလဲပြီးတဲ့ နောက်မှာ — transactions တွေ commit ဖြစ်တဲ့အခါ — publisher က အဲဒီ transactions တွေကို နောက်တစ်ကြိမ် replicate လုပ်ပါလိမ့်မယ်။
- **SKIP ( skip_option = value )** — Remote transaction တစ်ခုရဲ့ changes တွေ အားလုံးကို apply လုပ်တာကို ကျော်လိုက် (skip) ပါတယ်။ ဝင်လာတဲ့ data က constraints တစ်ခုခုကို ချိုးဖောက်နေရင် — logical replication က — အဲဒါကို ဖြေရှင်းပြီးသည်အထိ ရပ်တန့်သွားပါတယ်။ ALTER SUBSCRIPTION ... SKIP command ကို သုံးခြင်းအားဖြင့် — logical replication worker က transaction အတွင်းက data modification changes တွေ အားလုံးကို ကျော်လိုက်ပါတယ်။ ဒီ option က — subscriber ပေါ်မှာ two_phase ကို enable လုပ်ခြင်းအားဖြင့် ကြိုတင် prepare လုပ်ပြီးသား (already prepared) transactions တွေအပေါ်မှာတော့ ဘာ အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ Logical replication worker က transaction ကို အောင်မြင်စွာ skip လုပ်ပြီးတဲ့ နောက် သို့မဟုတ် — transaction တစ်ခုကို ပြီးဆုံးအောင် လုပ်ပြီးတဲ့ နောက်မှာ — LSN (pg_subscription.subskiplsn ထဲမှာ သိမ်းထားတဲ့) ကို ရှင်းလင်းပစ်ပါတယ်။ Logical replication conflicts (ပဋိပက္ခများ) အကြောင်း အသေးစိတ်အတွက် အပိုင်း 29.7 ကို ကြည့်ပါ။
skip_option က ဒီ operation အတွက် options တွေကို သတ်မှတ်ပေးပါတယ်။ ထောက်ပံ့ပေးထားတဲ့ option ကတော့:

lsn (pg_lsn)

Logical replication worker က ဘယ် remote transaction ရဲ့ changes တွေကို skip ရမလဲဆိုတဲ့ — အဲဒီ remote transaction ရဲ့ finish LSN ကို သတ်မှတ်ပါတယ်။ Finish LSN ဆိုတာ — transaction က commit ဖြစ်တဲ့ ဒါမှမဟုတ် prepare ဖြစ်တဲ့ အချိန်မှာ ရှိတဲ့ LSN ပါ။ Subtransactions တစ်ခုချင်းစီကို skip လုပ်တာကိုတော့ ထောက်ပံ့မထားပါဘူး။ NONE လို့ သတ်မှတ်လိုက်ရင် — LSN ကို reset လုပ်ပါတယ်။
- **new_owner** — Subscription ရဲ့ owner အသစ် ဖြစ်လာမယ့် user ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **new_name** — Subscription အတွက် နာမည်အသစ် ဖြစ်ပါတယ်။

`boolean` type ရဲ့ parameter တစ်ခုကို သတ်မှတ်တဲ့အခါ — `=` `value` အပိုင်းကို ချန်လိုက်လို့ ရပြီး — အဲဒါက `TRUE` ကို သတ်မှတ်တာနဲ့ ညီမျှပါတယ်။

## Examples (ဥပမာများ)

Subscription တစ်ခုက စာရင်းသွင်းထားတဲ့ publication ကို `insert_only` အဖြစ် ပြောင်းလဲခြင်း:

```sql
ALTER SUBSCRIPTION mysub SET PUBLICATION insert_only;
```

Subscription ကို disable (ရပ်တန့်) လုပ်ခြင်း:

```sql
ALTER SUBSCRIPTION mysub DISABLE;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER SUBSCRIPTION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SUBSCRIPTION](/docs/postgresql/sql-createsubscription), [DROP SUBSCRIPTION](/docs/postgresql/sql-dropsubscription), [CREATE PUBLICATION](/docs/postgresql/sql-createpublication), [ALTER PUBLICATION](/docs/postgresql/sql-alterpublication)
