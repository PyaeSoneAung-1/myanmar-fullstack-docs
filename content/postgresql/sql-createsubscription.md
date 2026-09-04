---
title: "CREATE SUBSCRIPTION (subscription အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Publisher server (ထုတ်ဝေသူ server) တစ်ခုပေါ်ရှိ publication တစ်ခုကို စာရင်းသွင်းမည့် subscription (စာရင်းသွင်းမှု) အသစ်တစ်ခုကို ဖန်တီးပေးသည့် command — CONNECTION နှင့် PUBLICATION clause များ၊ WITH ဖြင့် create_slot, slot_name, enabled, two_phase, streaming, copy_data အပါအဝင် subscription parameters များ သတ်မှတ်ခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 322
source: "https://www.postgresql.org/docs/current/sql-createsubscription.html"
status: translated
updated: 2026-09-04
---

## CREATE SUBSCRIPTION (subscription အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE SUBSCRIPTION — subscription အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE SUBSCRIPTION subscription_name
    CONNECTION 'conninfo'
    PUBLICATION publication_name [, ...]
    [ WITH ( subscription_parameter [= value] [, ... ] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE SUBSCRIPTION` က logical-replication subscription (logical replication အတွက် စာရင်းသွင်းမှု) အသစ်တစ်ခုကို ထပ်ဖြည့် ပေးပါတယ်။ Subscription ကို ဖန်တီးတဲ့ user က subscription ရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။ Subscription ရဲ့ နာမည်က — လက်ရှိ database ထဲက တည်ရှိပြီးသား subscription တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။

Subscription တစ်ခုက publisher (ထုတ်ဝေသူ) ဆီကို ဦးတည်တဲ့ replication connection (replication ချိတ်ဆက်မှု) တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒါကြောင့် — ဒီ command က local catalogs (ပြည်တွင်း catalog များ) တွေထဲမှာ definitions တွေ ထပ်ဖြည့်ပေးတာအပြင် — ပုံမှန်အားဖြင့် — publisher ပေါ်မှာ replication slot (replication လုပ်ငန်းအတွက် နေရာသတ်မှတ်ချက်) တစ်ခုကိုလည်း ဖန်တီးပေးပါတယ်။

ဒီ command ကို run လုပ်တဲ့ transaction က commit ဖြစ်တာနဲ့ — subscription က အစပိုင်းမှာ disabled (ပိတ်ထားခြင်း) မဟုတ်ဘူးဆိုရင် — subscription အသစ်အတွက် data တွေကို replicate (ပုံတူပွား) လုပ်ဖို့ logical replication worker တစ်ခုကို စတင်ပေးပါလိမ့်မယ်။

Subscription တစ်ခုကို ဖန်တီးနိုင်ဖို့ — သင်ဟာ `pg_create_subscription` role ရဲ့ privileges (အခွင့်အရေးများ) တွေ ရှိရမှာ ဖြစ်သလို — လက်ရှိ database ပေါ်မှာ `CREATE` privileges တွေလည်း ရှိရပါမယ်။

Subscriptions တွေနဲ့ logical replication တစ်ခုလုံး အကြောင်း နောက်ထပ် အချက်အလက်တွေက [အပိုင်း 29.2](https://www.postgresql.org/docs/current/logical-replication-subscription.html) နဲ့ [အခန်း 29](https://www.postgresql.org/docs/current/logical-replication.html) မှာ ရနိုင်ပါတယ်။

## Parameters (parameter များ)

- **subscription_name** — Subscription အသစ်ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **CONNECTION 'conninfo'** — Publisher database ဆီ ဘယ်လို ချိတ်ဆက်ရမယ်ဆိုတာကို သတ်မှတ်ပေးတဲ့ libpq connection string ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 32.1.1 ကို ကြည့်ပါ။
- **PUBLICATION publication_name [, ...]** — Publisher ပေါ်မှာ ရှိတဲ့ — စာရင်းသွင်းရမယ့် — publications တွေရဲ့ နာမည်များ ဖြစ်ပါတယ်။
- **WITH ( subscription_parameter [= value] [, ... ] )** — ဒီ clause က subscription တစ်ခုအတွက် optional parameters တွေကို သတ်မှတ်ပေးပါတယ်။
Subscription ကို ဖန်တီးနေစဉ်အတွင်း ဘာတွေ ဖြစ်ပျက်မလဲဆိုတာကို ထိန်းချုပ်ပေးတဲ့ parameters တွေကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

connect (boolean) #

`CREATE SUBSCRIPTION` command က publisher ဆီ ချိတ်ဆက်သင့်/မသင့်ကို သတ်မှတ်ပါတယ်။ Default ကတော့ true ဖြစ်ပါတယ်။ ဒါကို false အဖြစ် သတ်မှတ်လိုက်ရင် — create_slot, enabled နဲ့ copy_data တို့ရဲ့ တန်ဖိုးတွေကို false အဖြစ် အတင်းအကျပ် ဖြစ်စေပါတယ်။ (connect ကို false အဖြစ် သတ်မှတ်တာကို — create_slot, enabled သို့မဟုတ် copy_data တွေကို true အဖြစ် သတ်မှတ်တာနဲ့ ပေါင်းစပ်လို့ မရပါဘူး။)
ဒီ option က false ဖြစ်နေတဲ့အခါ — ဘယ် connection မှ မပြုလုပ်တာကြောင့် — table တွေကို ဘာမှ စာရင်းမသွင်းပါဘူး။ Replication ကို စတင်နိုင်ဖို့ — သင်ကိုယ်တိုင် replication slot ကို ဖန်တီးရပြီး — လိုအပ်ရင် failover ကို enable လုပ်ကာ — subscription ကို enable လုပ်ပြီး — subscription ကို refresh လုပ်ရပါမယ်။ ဥပမာတွေအတွက် အပိုင်း 29.2.3 ကို ကြည့်ပါ။

create_slot (boolean) #

Command က publisher ပေါ်မှာ replication slot ကို ဖန်တီးသင့်/မသင့်ကို သတ်မှတ်ပါတယ်။ Default ကတော့ true ဖြစ်ပါတယ်။
false အဖြစ် သတ်မှတ်ထားရင် — publisher ရဲ့ slot ကို တခြားနည်းလမ်းတစ်ခုနဲ့ ဖန်တီးပေးဖို့မှာ သင့်တာဝန် ဖြစ်ပါတယ်။ ဥပမာတွေအတွက် အပိုင်း 29.2.3 ကို ကြည့်ပါ။

enabled (boolean) #

Subscription က တက်ကြွစွာ (actively) replicate လုပ်နေသင့်လား — ဒါမှမဟုတ် — setup လုပ်ပြီးရုံသာ ထားပြီး မစတင်ရသေးဘဲ နေသင့်လားဆိုတာကို သတ်မှတ်ပါတယ်။ Default ကတော့ true ဖြစ်ပါတယ်။

slot_name (string) #

သုံးရမယ့် publisher ရဲ့ replication slot ရဲ့ နာမည် ဖြစ်ပါတယ်။ Default အနေနဲ့ — slot name အတွက် — subscription ရဲ့ နာမည်ကိုပဲ သုံးပါတယ်။
slot_name ကို NONE အဖြစ် သတ်မှတ်လိုက်ရင် — subscription နဲ့ ဆက်စပ်တဲ့ replication slot ဘယ်တစ်ခုမှ ရှိမှာ မဟုတ်ပါဘူး။ ဒီလို subscriptions တွေမှာ enabled ရော create_slot ပါ false အဖြစ် သတ်မှတ်ထားရပါမယ်။ Replication slot ကို နောက်ပိုင်းမှာ ကိုယ်တိုင် ဖန်တီးမယ့် အခြေအနေမျိုးမှာ ဒါကို သုံးပါ။ ဥပမာတွေအတွက် အပိုင်း 29.2.3 ကို ကြည့်ပါ။
slot_name ကို တရားဝင် (valid) နာမည်တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး — create_slot ကို false အဖြစ် သတ်မှတ်တဲ့အခါ — နာမည်တပ်ထားတဲ့ slot ရဲ့ failover property တန်ဖိုးက — subscription ထဲမှာ သတ်မှတ်ထားတဲ့ counterpart failover parameter နဲ့ ကွဲပြားနေနိုင်ပါတယ်။ Slot ရဲ့ failover property က subscription ရဲ့ counterpart parameter နဲ့ ကိုက်ညီနေတာကို အမြဲတမ်း သေချာစေပါ — အပြန်အလှန်အားဖြင့်လည်း လုပ်ပါ။ မဟုတ်ရင် — publisher ပေါ်က slot က ဒီ subscription options တွေ ဖော်ပြထားတာနဲ့ မတူညီတဲ့ အပြုအမူ ရှိနိုင်ပါတယ်: ဥပမာ — subscription ရဲ့ failover option က disabled ဖြစ်နေတာတောင် publisher ပေါ်က slot က standbys တွေဆီ sync လုပ်ခံရနိုင်သလို — subscription ရဲ့ failover option က enabled ဖြစ်နေတာတောင် sync အတွက် disabled ဖြစ်နေနိုင်ပါတယ်။

Subscription ကို ဖန်တီးပြီးတဲ့ နောက်မှာ — subscription ရဲ့ replication အပြုအမူကို ထိန်းချုပ်ပေးတဲ့ parameters တွေကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

binary (boolean) #

Subscription က publisher ကို — data တွေကို binary format (text format နဲ့ ဆန့်ကျင်ဘက်) နဲ့ ပို့ပေးဖို့ တောင်းဆိုမလားဆိုတာကို သတ်မှတ်ပါတယ်။ Default ကတော့ false ဖြစ်ပါတယ်။ ကနဦး table synchronization copy (copy_data ကို ကြည့်ပါ) တစ်ခုခုကလည်း — အဲဒီ format အတိုင်းပဲ သုံးပါတယ်။ Binary format က text format ထက် ပိုမြန်နိုင်ပေမယ့် — machine architectures (စက် ဗိသုကာ ပုံစံများ) နဲ့ PostgreSQL versions တွေကြားမှာ သယ်ယူ ရွှေ့ပြောင်းနိုင်မှု (portability) အားနည်းပါတယ်။ Binary format က data type တစ်ခုချင်းစီနဲ့ အထူးပြု ဆက်စပ်နေတတ်ပါတယ်; ဥပမာ — text format မှာဆိုရင် အဆင်ပြေစွာ အလုပ်လုပ်နိုင်ပေမယ့် — binary format က smallint column ကနေ integer column ဆီ copy လုပ်တာမျိုးကို ခွင့်မပြုပါဘူး။ ဒီ option ကို enable လုပ်ထားတဲ့အခါမှာတောင် — binary send နဲ့ receive functions တွေ ရှိတဲ့ data types တွေပဲ — binary အနေနဲ့ transfer (ပို့ဆောင်) လုပ်ခံရမှာ ဖြစ်ပါတယ်။ ကနဦး synchronization က — data types အားလုံးမှာ binary send နဲ့ receive functions တွေ ရှိဖို့ လိုအပ်တယ်ဆိုတာ သတိပြုပါ — မဟုတ်ရင် — synchronization က မအောင်မြင်ဘဲ ဖြစ်သွားပါလိမ့်မယ် (send/receive functions တွေအကြောင်း ပိုသိရဖို့ CREATE TYPE ကို ကြည့်ပါ)။
Cross-version replication (version မတူညီတဲ့ ကြားမှာ လုပ်တဲ့ replication) လုပ်တဲ့အခါ — publisher မှာ data type တစ်ခုအတွက် binary send function ရှိနေပေမယ့် — subscriber မှာ အဲဒီ type အတွက် binary receive function မရှိတာမျိုး ဖြစ်နိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ — data transfer က မအောင်မြင်ဘဲ — binary option ကို သုံးလို့ မရနိုင်ပါဘူး။
Publisher က PostgreSQL version 16 ထက် စောတဲ့ version တစ်ခုဆိုရင် — binary = true ဖြစ်နေရင်တောင် — ကနဦး table synchronization တစ်ခုခုက text format ကို သုံးပါလိမ့်မယ်။

copy_data (boolean) #

Replication စတင်တဲ့အခါ — စာရင်းသွင်းထားတဲ့ publications တွေထဲက — ကြိုတင် ရှိပြီးသား (pre-existing) data တွေကို copy လုပ်မလားဆိုတာကို သတ်မှတ်ပါတယ်။ Default ကတော့ true ဖြစ်ပါတယ်။
Publications တွေမှာ WHERE clauses တွေ ပါဝင်နေရင် — ဘယ် data တွေကို copy လုပ်မလဲဆိုတာကို အဲဒါတွေက သက်ရောက်မှု ရှိပါတယ်။ အသေးစိတ်အတွက် Notes ကို ကြည့်ပါ။
copy_data = true က origin parameter နဲ့ ဘယ်လို ဆက်စပ် သက်ရောက်မှု ရှိနိုင်လဲဆိုတဲ့ အသေးစိတ်အတွက် Notes ကို ကြည့်ပါ။

streaming (enum) #

ဒီ subscription အတွက် in-progress transactions (လုပ်ဆောင်ဆဲ transactions) တွေရဲ့ streaming (စီးဆင်း ပို့ဆောင်မှု) ကို enable လုပ်မလားဆိုတာကို သတ်မှတ်ပါတယ်။ Default တန်ဖိုးကတော့ parallel ဖြစ်ပြီး — ဆိုလိုတာက — ဝင်လာတဲ့ changes တွေကို — ရနိုင်ခဲ့ရင် — parallel apply workers တွေထဲက တစ်ခုကနေတစ်ဆင့် တိုက်ရိုက် apply လုပ်တယ် ဆိုတဲ့ သဘောပါ။ Streaming transactions တွေကို ကိုင်တွယ်ဖို့ parallel apply worker တစ်ခုမှ လွတ်လပ်စွာ မရှိဘူးဆိုရင် — changes တွေကို temporary files တွေထဲမှာ ရေးပြီး — transaction က commit ဖြစ်ပြီးတဲ့ နောက်မှာ apply လုပ်ပါတယ်။ Parallel apply worker တစ်ခုမှာ error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — remote transaction ရဲ့ finish LSN က server log ထဲမှာ အစီရင်ခံခြင်း မခံရနိုင်ဘူးဆိုတာ သတိပြုပါ။

**သတိပြုရန်:**

Publisher နဲ့ subscriber ရဲ့ schemas တွေ ကွဲပြားနေတဲ့အခါ — ဒီလို ကိစ္စတွေက ရှားပါးပေမယ့် — deadlock (သေကြောင်းကန်း ပိတ်ဆို့မှု) ဖြစ်နိုင်ခြေ ရှိပါတယ်။ Apply worker က ဒီလို transactions တွေကို အလိုအလျောက် ပြန်လည် ကြိုးစား (retry) လုပ်ဖို့ အသင့် ပြင်ဆင်ထားပါတယ်။

on အဖြစ် သတ်မှတ်ထားရင် — ဝင်လာတဲ့ changes တွေကို temporary files တွေထဲမှာ ရေးပြီး — transaction က publisher ပေါ်မှာ commit ဖြစ်ပြီး — subscriber ဆီ ရောက်ရှိပြီးမှသာ apply လုပ်ပါတယ်။
off အဖြစ် သတ်မှတ်ထားရင် — transactions တွေ အားလုံးကို publisher ပေါ်မှာ အပြည့်အဝ decode လုပ်ပြီးမှသာ — တစ်ခုလုံးအနေနဲ့ subscriber ဆီ ပို့ပေးပါတယ်။

synchronous_commit (enum) #

ဒီ parameter ရဲ့ တန်ဖိုးက — ဒီ subscription ရဲ့ apply worker processes တွေအတွင်းမှာ synchronous_commit setting ကို ကျော်လွန် (override) လုပ်ပါတယ်။ Default တန်ဖိုးကတော့ off ဖြစ်ပါတယ်။
Logical replication အတွက် off ကို သုံးတာ အန္တရာယ် ကင်းပါတယ်: Subscriber က synchronization မရှိလို့ (missing synchronization) transactions တွေ ဆုံးရှုံးသွားခဲ့ရင် — data တွေကို publisher ကနေ နောက်တစ်ကြိမ် ပြန်ပို့ပေးမှာ ဖြစ်ပါတယ်။
Synchronous logical replication လုပ်နေတဲ့အခါမှာတော့ — တခြား setting တစ်ခု ပိုပြီး သင့်လျော်နိုင်ပါတယ်။ Logical replication workers တွေက — writes နဲ့ flushes တွေရဲ့ နေရာများ (positions) ကို publisher ဆီ အစီရင်ခံပြီး — synchronous replication ကို သုံးနေတဲ့အခါ — publisher က တကယ့် flush ဖြစ်တာအတွက် စောင့်ဆိုင်းပါတယ်။ ဒါက ဆိုလိုတာက — subscription ကို synchronous replication အတွက် သုံးနေတဲ့အခါ — subscriber ရဲ့ synchronous_commit ကို off အဖြစ် သတ်မှတ်ထားတာက — publisher ပေါ်က COMMIT ရဲ့ latency (ကြန့်ကြာချိန်) ကို မြင့်တက်စေနိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ — synchronous_commit ကို local ဒါမှမဟုတ် အဲဒါထက် ပိုမြင့်တဲ့ အဆင့် သတ်မှတ်တာက အကျိုးရှိနိုင်ပါတယ်။

two_phase (boolean) #

ဒီ subscription အတွက် two-phase commit (အဆင့်နှစ်ဆင့် commit) ကို enable လုပ်မလားဆိုတာကို သတ်မှတ်ပါတယ်။ Default ကတော့ false ဖြစ်ပါတယ်။
Two-phase commit ကို enable လုပ်ထားတဲ့အခါ — prepared transactions တွေကို PREPARE TRANSACTION အချိန်မှာ subscriber ဆီ ပို့ပေးပြီး — subscriber ပေါ်မှာလည်း two-phase transactions အနေနဲ့ပဲ process လုပ်ပါတယ်။ မဟုတ်ရင် — prepared transactions တွေကို commit ဖြစ်တဲ့အခါမှသာ subscriber ဆီ ပို့ပေးပြီး — subscriber က ချက်ချင်း process လုပ်ပါတယ်။
Two-phase commit ရဲ့ အကောင်အထည်ဖော်မှု (implementation) က — replication က ကနဦး table synchronization phase ကို အောင်မြင်စွာ ပြီးဆုံးထားဖို့ လိုအပ်ပါတယ်။ ဒါကြောင့် — subscription တစ်ခုအတွက် two_phase ကို enable လုပ်ထားရင်တောင် — initialization phase ပြီးဆုံးသည်အထိ — အတွင်းပိုင်း two-phase state က “pending” (ဆိုင်းငံ့ဆဲ) အနေနဲ့ ယာယီ ရှိနေပါတယ်။ တကယ့် two-phase state ကို သိရဖို့ pg_subscription ရဲ့ subtwophasestate column ကို ကြည့်ပါ။

disable_on_error (boolean) #

Publisher ကနေ data replication လုပ်နေစဉ်အတွင်း — subscription workers တွေက error တစ်ခုခု စစ်ဆေးတွေ့ရှိရင် — subscription ကို အလိုအလျောက် disable လုပ်သင့်/မသင့်ကို သတ်မှတ်ပါတယ်။ Default ကတော့ false ဖြစ်ပါတယ်။

password_required (boolean) #

true အဖြစ် သတ်မှတ်ထားရင် — ဒီ subscription ကြောင့် ပြုလုပ်တဲ့ publisher ဆီက connections တွေက password authentication ကို သုံးရပြီး — password ကို connection string ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ သတ်မှတ်ပေးထားရပါမယ်။ Subscription ကို superuser တစ်ယောက်က ပိုင်ဆိုင်ထားတဲ့အခါ ဒီ setting ကို လျစ်လျူရှုပါတယ်။ Default ကတော့ true ဖြစ်ပါတယ်။ ဒီ တန်ဖိုးကို false အဖြစ် သတ်မှတ်နိုင်တာ superusers တွေပဲ ဖြစ်ပါတယ်။

run_as_owner (boolean) #

true ဆိုရင် — replication လုပ်ဆောင်ချက် (actions) တွေ အားလုံးကို subscription owner အနေနဲ့ လုပ်ဆောင်ပါတယ်။ false ဆိုရင် — replication workers တွေက — table တစ်ခုချင်းစီပေါ်မှာ — အဲဒီ table ရဲ့ owner အနေနဲ့ လုပ်ဆောင်ချက်တွေကို လုပ်ဆောင်ပါတယ်။ နောက်ဆုံး ပြောတဲ့ configuration (false) က ယေဘုယျအားဖြင့် အများကြီး ပိုလုံခြုံပါတယ်; အသေးစိတ်အတွက် အပိုင်း 29.11 ကို ကြည့်ပါ။ Default ကတော့ false ဖြစ်ပါတယ်။

origin (string) #

Subscription က — origin မရှိတဲ့ changes တွေကိုပဲ ပို့ပေးဖို့ ဒါမှမဟုတ် — origin ဘယ်လိုပဲ ရှိရှိ changes တွေ အားလုံးကို ပို့ပေးဖို့ — publisher ကို တောင်းဆိုမလားဆိုတာကို သတ်မှတ်ပါတယ်။ origin ကို none အဖြစ် သတ်မှတ်လိုက်ရင် — subscription က publisher ကို — origin မရှိတဲ့ changes တွေကိုပဲ ပို့ပေးဖို့ တောင်းဆိုမယ်လို့ ဆိုလိုပါတယ်။ origin ကို any အဖြစ် သတ်မှတ်လိုက်ရင် — publisher က changes တွေကို သူတို့ရဲ့ origin ဘယ်လိုပဲ ရှိရှိ ပို့ပေးပါတယ်။ Default ကတော့ any ဖြစ်ပါတယ်။
copy_data = true က origin parameter နဲ့ ဘယ်လို ဆက်စပ် သက်ရောက်မှု ရှိနိုင်လဲဆိုတဲ့ အသေးစိတ်အတွက် Notes ကို ကြည့်ပါ။

failover (boolean) #

Subscription နဲ့ ဆက်စပ်နေတဲ့ replication slots တွေကို — failover ဖြစ်ပြီးတဲ့ နောက်မှာ — logical replication ကို primary အသစ်ကနေ ပြန်လည် စတင်နိုင်အောင် — standbys တွေဆီ sync လုပ်ဖို့ enable လုပ်ထားမလားဆိုတာကို သတ်မှတ်ပါတယ်။ Default ကတော့ false ဖြစ်ပါတယ်။

`boolean` type ရဲ့ parameter တစ်ခုကို သတ်မှတ်တဲ့အခါ — `=` `value` အပိုင်းကို ချန်လိုက်လို့ ရပြီး — အဲဒါက `TRUE` ကို သတ်မှတ်တာနဲ့ ညီမျှပါတယ်။

## Notes (မှတ်စုများ)

Subscription နဲ့ publication instance အကြား access control (ဝင်ရောက်ခွင့် ထိန်းချုပ်မှု) ကို ဘယ်လို ပြင်ဆင် သတ်မှတ်ရမလဲဆိုတဲ့ အသေးစိတ်အတွက် [အပိုင်း 29.11](https://www.postgresql.org/docs/current/logical-replication-security.html) ကို ကြည့်ပါ။

Replication slot ကို ဖန်တီးတဲ့အခါ (default အပြုအမူ) — `CREATE SUBSCRIPTION` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

တူညီတဲ့ database cluster (database အစုအဝေး) ဆီ ချိတ်ဆက်တဲ့ subscription တစ်ခုကို ဖန်တီးတာက (ဥပမာ — cluster တစ်ခုတည်းအတွင်းက databases တွေကြား replicate လုပ်ဖို့ ဒါမှမဟုတ် — database တစ်ခုတည်းရဲ့ အတွင်းမှာပဲ replicate လုပ်ဖို့) — replication slot ကို command တစ်ခုတည်းရဲ့ အစိတ်အပိုင်းအနေနဲ့ ဖန်တီးတာမဟုတ်ဘူးဆိုရင်သာ — အောင်မြင်နိုင်ပါတယ်။ မဟုတ်ရင် — `CREATE SUBSCRIPTION` call က ရပ်တည့် (hang) သွားပါလိမ့်မယ်။ ဒါကို အလုပ်ဖြစ်အောင် လုပ်ဖို့ — replication slot ကို သီးခြား ဖန်တီးပြီး (plugin name `pgoutput` နဲ့ `pg_create_logical_replication_slot` function ကို သုံးပြီး) — `create_slot = false` ဆိုတဲ့ parameter နဲ့ subscription ကို ဖန်တီးပါ။ ဥပမာတွေအတွက် [အပိုင်း 29.2.3](https://www.postgresql.org/docs/current/logical-replication-subscription.html#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES-DEFERRED-SLOT) ကို ကြည့်ပါ။ ဒါက — အနာဂတ် release တစ်ခုမှာ ရုတ်သိမ်းပေးနိုင်မယ့် (lifted) implementation restriction (အကောင်အထည်ဖော်မှု ကန့်သတ်ချက်) တစ်ခု ဖြစ်ပါတယ်။

Publication ထဲက table တစ်ခုခုမှာ `WHERE` clause ပါဝင်နေရင် — `expression` က `false` ဒါမှမဟုတ် `NULL` လို့ အကဲဖြတ် (evaluate) ပေးတဲ့ rows တွေကို publish လုပ်မှာ မဟုတ်ပါဘူး။ Subscription မှာ publications အများအပြား ရှိပြီး — အဲဒီထဲမှာ table တစ်ခုတည်းကို `WHERE` clauses အမျိုးမျိုးနဲ့ publish လုပ်ထားရင် — expressions တွေထဲက တစ်ခုခု (အဲဒီ publish operation ကို ရည်ညွှန်းတဲ့) ပြည့်စုံ (satisfied) ဖြစ်နေရင် — row တစ်ခုကို publish လုပ်ပါတယ်။ `WHERE` clauses တွေ ကွဲပြားနေတဲ့ ကိစ္စမှာ — publications တွေထဲက တစ်ခုမှာ (အဲဒီ publish operation ကို ရည်ညွှန်းတဲ့) `WHERE` clause မရှိဘူး ဒါမှမဟုတ် — publication ကို [`FOR ALL TABLES`](/docs/postgresql/sql-createpublication) ဒါမှမဟုတ် [`FOR TABLES IN SCHEMA`](/docs/postgresql/sql-createpublication) အနေနဲ့ ကြေညာထားရင် — တခြား expressions တွေရဲ့ အဓိပ္ပာယ် သတ်မှတ်ချက် ဘယ်လိုပဲ ရှိရှိ — rows တွေကို အမြဲတမ်း publish လုပ်ပါတယ်။ Subscriber က PostgreSQL version 15 ထက် စောတဲ့ version ဖြစ်နေရင် — ကနဦး data synchronization phase အတွင်းမှာ row filtering ကို ဘာမှ ဂရုမစိုက်ဘဲ (ignored) ထားပါတယ်။ ဒီလို ကိစ္စမျိုးအတွက် — user က — နောက်ပိုင်း filtering နဲ့ မလိုက်ဖက်နိုင်မယ့် — ကနဦး copy လုပ်ထားတဲ့ data တစ်ချို့ကို ဖျက်ပစ်ဖို့ စဉ်းစားချင်နိုင်ပါတယ်။ ကနဦး data synchronization က — ရှိပြီးသား table data တွေကို copy လုပ်တဲ့အခါ — publication ရဲ့ [`publish`](/docs/postgresql/sql-createpublication) parameter ကို ထည့်တွက်မှု မရှိတာကြောင့် — DML သုံးပြီး replicate လုပ်မှာ မဟုတ်တဲ့ rows တစ်ချို့ကို copy လုပ်မိနိုင်ပါတယ်။ ဥပမာတွေအတွက် [အပိုင်း 29.2.2](https://www.postgresql.org/docs/current/logical-replication-subscription.html#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES) ကို ကြည့်ပါ။

Column lists တွေ မတူညီဘဲ table တစ်ခုတည်းကို publish လုပ်ထားတဲ့ publications အများအပြား ရှိတဲ့ subscriptions တွေကိုတော့ ထောက်ပံ့မထားပါဘူး။

User တွေ နောက်မှ ထပ်ဖြည့်နိုင်အောင် — တည်ရှိခြင်း မရှိတဲ့ (non-existent) publications တွေကို သတ်မှတ်ခွင့် ပြုထားပါတယ်။ ဒါက ဆိုလိုတာက — [`pg_subscription`](https://www.postgresql.org/docs/current/catalog-pg-subscription.html) မှာ တည်ရှိခြင်း မရှိတဲ့ publications တွေ ရှိနေနိုင်တယ် ဆိုတာပါ။

`copy_data = true` နဲ့ `origin = NONE` ဆိုတဲ့ subscription parameter ပေါင်းစပ်မှုကို သုံးတဲ့အခါ — ကနဦး sync table data ကို publisher ကနေ တိုက်ရိုက် copy လုပ်တာမို့ — အဲဒီ data ရဲ့ တကယ့် (true) origin အကြောင်းကို သိရှိနိုင်ခြင်း မရှိနိုင်ပါဘူး။ Publisher မှာလည်း subscriptions တွေ ရှိနေရင် — copy လုပ်ထားတဲ့ table data က — ပိုအပေါ်ဘက် (further upstream) က နေရာတွေကနေ ဆင်းသက်လာတာ (originated) ဖြစ်နိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးကို စစ်ဆေးတွေ့ရှိပြီး — WARNING တစ်ခုကို user ဆီ log လုပ်ပါတယ် — ဒါပေမယ့် — warning က ဖြစ်နိုင်ခြေ ရှိတဲ့ ပြဿနာတစ်ခုကို ညွှန်ပြချက်တစ်ခုသာ ဖြစ်ပါတယ်; copy လုပ်ထားတဲ့ data တွေရဲ့ origin တွေက တကယ်တမ်း လိုချင်တဲ့အတိုင်း ဟုတ်/မဟုတ် သေချာစေဖို့ လိုအပ်တဲ့ စစ်ဆေးမှုတွေ လုပ်ဖို့မှာ user ရဲ့ တာဝန် ဖြစ်ပါတယ်။

ဘယ် tables တွေမှာ non-local origins တွေ ပါဝင်နိုင်ခြေ ရှိလဲ (publisher ပေါ်မှာ ဖန်တီးထားတဲ့ တခြား subscriptions တွေကြောင့်) ရှာဖွေဖို့ — ဒီ SQL query ကို စမ်းသုံးကြည့်ပါ:

```sql
# substitute <pub-names> below with your publication name(s) to be queried
SELECT DISTINCT PT.schemaname, PT.tablename
FROM pg_publication_tables PT
     JOIN pg_class C ON (C.relname = PT.tablename)
     JOIN pg_namespace N ON (N.nspname = PT.schemaname),
     pg_subscription_rel PS
WHERE C.relnamespace = N.oid AND
      (PS.srrelid = C.oid OR
      C.oid IN (SELECT relid FROM pg_partition_ancestors(PS.srrelid) UNION
                SELECT relid FROM pg_partition_tree(PS.srrelid))) AND
      PT.pubname IN (<pub-names>);
```

## Examples (ဥပမာများ)

`mypublication` နဲ့ `insert_only` publications တွေထဲက tables တွေကို replicate လုပ်ပြီး — commit ဖြစ်တာနဲ့ ချက်ချင်း replicate စတင်မယ့် — remote server (အဝေး server) တစ်ခုဆီ subscription တစ်ခု ဖန်တီးခြင်း:

```sql
CREATE SUBSCRIPTION mysub
         CONNECTION 'host=192.168.1.50 port=5432 user=foo dbname=foodb'
        PUBLICATION mypublication, insert_only;
```

`insert_only` publication ထဲက tables တွေကို replicate လုပ်မယ့် — ဒါပေမယ့် — နောက်ပိုင်းမှာ enable လုပ်တဲ့အထိ replicate မစတင်သေးတဲ့ — remote server တစ်ခုဆီ subscription တစ်ခု ဖန်တီးခြင်း။

```sql
CREATE SUBSCRIPTION mysub
         CONNECTION 'host=192.168.1.50 port=5432 user=foo dbname=foodb'
        PUBLICATION insert_only
               WITH (enabled = false);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE SUBSCRIPTION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER SUBSCRIPTION](/docs/postgresql/sql-altersubscription), [DROP SUBSCRIPTION](/docs/postgresql/sql-dropsubscription), [CREATE PUBLICATION](/docs/postgresql/sql-createpublication), [ALTER PUBLICATION](/docs/postgresql/sql-alterpublication)
