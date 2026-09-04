---
title: "NOTIFY (notification တစ်ခု ပို့ပေးခြင်း)"
description: "LISTEN channel ကို လုပ်ဆောင်ထားပြီးသား client application များဆီသို့ optional payload string နှင့်အတူ notification event တစ်ခု ပို့ပေးသည့် command — interprocess communication အတွက် အသုံးပြုမှု၊ SQL transactions နှင့် အပြန်အလှန် သက်ရောက်မှု (deferred delivery)၊ duplicate notifications စည်းမျဉ်းများ၊ pg_notify function နှင့် notification queue အကြောင်း ပါဝင်သည်"
order: 196
source: "https://www.postgresql.org/docs/current/sql-notify.html"
status: translated
updated: 2026-09-04
---

## NOTIFY (notification တစ်ခု ပို့ပေးခြင်း)

NOTIFY — notification တစ်ခုကို ထုတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
NOTIFY channel [ , payload ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`NOTIFY` command က — current database ထဲမှာ သတ်မှတ်ထားတဲ့ channel နာမည်အတွက် `LISTEN channel` ကို အရင်က execute လုပ်ထားတဲ့ client application တစ်ခုချင်းစီဆီ — optional “payload” string နဲ့အတူ — notification event တစ်ခုကို ပို့ပေးပါတယ်။ Notifications တွေက users အားလုံးအတွက် မြင်နိုင်ပါတယ်။

`NOTIFY` က — တူညီတဲ့ PostgreSQL database တစ်ခုကို ဝင်ရောက် အသုံးပြုနေတဲ့ processes အစုတစ်ခုအတွက် — ရိုးရှင်းတဲ့ interprocess communication (process အချင်းချင်း ဆက်သွယ်ရေး) ယန္တရား တစ်ခုကို ပေးပါတယ်။ Payload string တစ်ခုကို notification နဲ့အတူ ပို့လို့ရပြီး — notifier ကနေ listener(s) ဆီ နောက်ထပ် data တွေ ဖြတ်သန်းပေးဖို့ database ထဲက tables တွေကို အသုံးပြုကာ — structured data (စနစ်ကျ ဖွဲ့စည်းထားသော ဒေတာ) တွေ ပို့ဆောင်ပေးတဲ့ — ပိုမြင့်မားတဲ့ အဆင့် ယန္တရားတွေကိုလည်း တည်ဆောက်နိုင်ပါတယ်။

Notification event တစ်ခုအတွက် client ဆီ ပေးပို့တဲ့ အချက်အလက်တွေထဲမှာ — notification channel နာမည်၊ notify လုပ်တဲ့ session ရဲ့ server process PID နဲ့ payload string တို့ ပါဝင်ပါတယ်; payload string ကို သတ်မှတ်မထားဘူးဆိုရင် အဲဒါက empty string (ဗလာ string) ဖြစ်ပါတယ်။

ပေးထားတဲ့ database တစ်ခုထဲမှာ သုံးမယ့် channel နာမည်တွေနဲ့ — channel တစ်ခုချင်းစီ ဘာကို ဆိုလိုတယ်ဆိုတာကို — database designer (ဒေတာဘေ့စ် ဒီဇိုင်နာ) က သတ်မှတ်ရမှာ ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — channel နာမည်က database ထဲက table တစ်ခုခုရဲ့ နာမည်နဲ့ တူညီပြီး — notify event က အနှစ်သာရအားဖြင့် — “ဒီ table ကို ပြောင်းလဲလိုက်ပြီ၊ အသစ်တွေ ဘာတွေ ရှိလဲဆိုတာ ကြည့်လိုက်ပါ” လို့ ဆိုလိုတာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — `NOTIFY` နဲ့ `LISTEN` commands တွေက အဲဒီလို ဆက်စပ်မှုမျိုးကို ပြဋ္ဌာန်း (enforce) မလုပ်ပါဘူး။ ဥပမာ — database designer တစ်ယောက်က table တစ်ခုတည်းဆီ ပြောင်းလဲမှု အမျိုးအစား အမျိုးမျိုးကို အချက်ပြဖို့ — channel နာမည် အမျိုးမျိုးကို သုံးနိုင်ပါတယ်။ တနည်းအားဖြင့် — payload string ကို သုံးပြီး ကိစ္စရပ် အမျိုးမျိုးကို ခွဲခြားနိုင်ပါတယ်။

`NOTIFY` ကို သတ်မှတ်ထားတဲ့ table တစ်ခုဆီ ပြောင်းလဲမှုတွေ ဖြစ်ပေါ်တာကို အချက်ပြဖို့ သုံးတဲ့အခါ — အသုံးဝင်တဲ့ programming နည်းစနစ် တစ်ခုက — table updates တွေကြောင့် trigger ဖြစ်ပေါ်တဲ့ statement trigger တစ်ခုရဲ့ အတွင်းမှာ `NOTIFY` ကို ထည့်ထားဖို့ ဖြစ်ပါတယ်။ ဒီနည်းနဲ့ဆိုရင် — table ပြောင်းလဲတိုင်း notification က အလိုအလျောက် ဖြစ်ပေါ်ပြီး — application programmer က အမှတ်တမဲ့ မေ့ကျန်သွားစရာ မလိုတော့ပါဘူး။

`NOTIFY` က SQL transactions တွေနဲ့ အရေးကြီးတဲ့ နည်းလမ်းတချို့နဲ့ အပြန်အလှန် သက်ရောက်ပါတယ်။ ပထမဦးစွာ — `NOTIFY` တစ်ခုကို transaction တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်ခဲ့ရင် — transaction commit ဖြစ်တဲ့အခါမှသာ (ဖြစ်မယ်ဆိုရင်သာ) — notify events တွေကို ပို့ပေးပါတယ်။ ဒါက သင့်လျော်ပါတယ် — transaction aborted (ဖျက်သိမ်း) ဖြစ်သွားရင် — `NOTIFY` အပါအဝင် — အတွင်းက commands တွေ အားလုံးက သက်ရောက်မှု မရှိခဲ့ဘူးလို့ ဆိုလိုတာမို့ပါ။ ဒါပေမယ့် — notification events တွေကို ချက်ချင်း ပို့ပေးလိမ့်မယ်လို့ မျှော်လင့်နေတယ်ဆိုရင်တော့ ဒါက စိတ်မသက်မသာ ဖြစ်စရာ ကောင်းနိုင်ပါတယ်။ ဒုတိယအနေနဲ့ — နားထောင်နေတဲ့ session တစ်ခုက transaction တစ်ခုရဲ့ အတွင်းမှာ ရှိနေချိန် notification signal တစ်ခု လက်ခံရရှိခဲ့ရင် — notification event ကို transaction ပြီးဆုံးသွားပြီးနောက်မှသာ (committed ဖြစ်ဖြစ် aborted ဖြစ်ဖြစ်) — သူ့ရဲ့ ချိတ်ဆက်ထားတဲ့ client ဆီ ပို့ပေးမှာ ဖြစ်ပါတယ်။ ဒီမှာလည်း — ဆင်ခြင်ရတဲ့ အကြောင်းပြချက်က — notification တစ်ခုကို နောက်ပိုင်းမှာ aborted ဖြစ်သွားတဲ့ transaction တစ်ခုရဲ့ အတွင်းမှာ ပို့ပေးလိုက်ခဲ့ရင် — notification ကို တစ်နည်းနည်းနဲ့ ပြန်ရုတ်သိမ်း (undo) စေချင်လိမ့်မယ် — ဒါပေမယ့် server က notification တစ်ခုကို client ဆီ ပို့လိုက်ပြီးတာနဲ့ “ပြန်သိမ်း” (take back) လုပ်လို့ မရတာမို့ပါ။ ဒါကြောင့် notification events တွေကို transactions တွေကြားမှာပဲ ပို့ပေးပါတယ်။ ဒီအချက်ရဲ့ နောက်ဆက်တွဲ ရလဒ်ကတော့ — real-time signaling (အချိန်နှင့်တပြေးညီ အချက်ပြမှု) အတွက် `NOTIFY` ကို သုံးတဲ့ applications တွေက သူတို့ရဲ့ transactions တွေကို တိုတိုလေးတွေ ထားဖို့ ကြိုးစားသင့်တယ် ဆိုတာပါ။

Channel နာမည် တူညီတဲ့ဟာကို — transaction တစ်ခုတည်းရဲ့ အတွင်းမှာ — payload string ချင်း တူညီတဲ့ဟာနဲ့ အကြိမ်များစွာ အချက်ပြခဲ့ရင် — notification event ရဲ့ instance တစ်ခုတည်းကိုပဲ listeners တွေဆီ ပို့ပေးပါတယ်။ အခြားတစ်ဖက်မှာ — payload strings မတူညီတဲ့ notifications တွေကတော့ — ကွဲပြားတဲ့ notifications တွေအနေနဲ့ အမြဲ ပို့ပေးမှာ ဖြစ်ပါတယ်။ အလားတူပဲ — transactions မတူညီတဲ့ဟာတွေကနေ လာတဲ့ notifications တွေက — notification တစ်ခုတည်းအဖြစ် ဘယ်တော့မှ ပေါင်းစည်း (fold) ခံရမှာ မဟုတ်ပါဘူး။ Duplicate notifications တွေရဲ့ နောက်ပိုင်း instances တွေကို ဖယ်လိုက်တာကလွဲပြီး — `NOTIFY` က transaction တစ်ခုတည်းကနေ လာတဲ့ notifications တွေကို — ပို့ခဲ့တဲ့ အစီအစဉ်အတိုင်း — ပို့ပေးမယ်လို့ အာမခံပါတယ်။ Transactions မတူညီတဲ့ဟာတွေကနေ လာတဲ့ messages တွေကိုလည်း — transactions တွေ commit ဖြစ်ခဲ့တဲ့ အစီအစဉ်အတိုင်း — ပို့ပေးမယ်လို့ အာမခံပါတယ်။

`NOTIFY` ကို execute လုပ်တဲ့ client တစ်ခုက — notification channel တစ်ခုတည်းပေါ်မှာ ကိုယ်တိုင် နားထောင်နေတာက ပုံမှန် ဖြစ်ပါတယ်။ အဲဒီလိုဆိုရင် — တခြား နားထောင်နေတဲ့ sessions တွေ အားလုံးလိုပဲ — သူလည်း notification event တစ်ခု ပြန်လက်ခံရရှိပါလိမ့်မယ်။ Application logic ပေါ်မူတည်ပြီး — ဒါက အလဟသ လုပ်အား (useless work) ဖြစ်စေနိုင်ပါတယ် — ဥပမာ — အဲဒီ session က ကိုယ်တိုင် ရေးထုတ်လိုက်တဲ့ updates တွေကိုပဲ ပြန်ရှာဖွေဖို့ database table တစ်ခုကို ဖတ်နေရတာမျိုးပါ။ Notify လုပ်တဲ့ session ရဲ့ server process PID (notification event message ထဲမှာ ပါလာတဲ့) က — ကိုယ့် session ရဲ့ PID (libpq ကနေ ရနိုင်တဲ့) နဲ့ — တူညီမှု ရှိမရှိ သတိထား ကြည့်ရှုခြင်းအားဖြင့် — အဲဒီလို အပို လုပ်အားတွေကို ရှောင်ရှားနိုင်ပါတယ်။ သူတို့ တူညီနေတဲ့အခါ — notification event က ကိုယ့်ကိုယ်ပိုင် အလုပ်က ပြန်ကန့်လန့်ဖြတ် (bounce back) လာတာ ဖြစ်လို့ — လျစ်လျူရှုလိုက်လို့ ရပါတယ်။

## Parameters (parameter များ)

- **channel** — အချက်ပြရမယ့် notification channel ရဲ့ နာမည် (identifier မည်သည်မဆို)။
- **payload** — notification နဲ့အတူ ဆက်သွယ်ပေးရမယ့် “payload” string။ ဒါကို ရိုးရှင်းတဲ့ string literal အနေနဲ့သာ သတ်မှတ်ရပါမယ်။ Default configuration မှာ ဒါက bytes 8000 ထက် ပိုတိုရပါမယ်။ (Binary data ဒါမှမဟုတ် အချက်အလက် အမြောက်အများကို ဆက်သွယ်ပေးဖို့ လိုအပ်ရင် — အဲဒါတွေကို database table တစ်ခုထဲမှာ ထည့်ပြီး — record ရဲ့ key ကို ပို့ပေးတာက အကောင်းဆုံး ဖြစ်ပါတယ်။)

## Notes (မှတ်စုများ)

ပို့ပြီး ဖြစ်ပေမယ့် — နားထောင်နေတဲ့ sessions တွေ အားလုံးက သေချာပေါက် process မလုပ်ရသေးတဲ့ — notifications တွေကို ထားရှိတဲ့ queue တစ်ခု ရှိပါတယ်။ ဒီ queue က ပြည့်သွားခဲ့ရင် — `NOTIFY` ကို ခေါ်တဲ့ transactions တွေက commit မှာ မအောင်မြင်ဘဲ ဖြစ်သွားပါလိမ့်မယ်။ Queue က အတော်လေး ကြီးပြီး (standard installation တစ်ခုမှာ 8GB) — use case (အသုံးပြုမှု ကိစ္စရပ်) တိုင်းနီးပါးအတွက် လုံလောက်တဲ့ အရွယ်အစား ရှိသင့်ပါတယ်။ ဒါပေမယ့် — session တစ်ခုက `LISTEN` ကို execute လုပ်ပြီး — အချိန် အလွန်ကြာမြင့်တဲ့ transaction တစ်ခုထဲ ဝင်သွားခဲ့ရင် — cleanup (ရှင်းလင်းမှု) ဘာမှ မဖြစ်နိုင်တော့ပါဘူး။ Queue တစ်ဝက် ပြည့်သွားတာနဲ့ — cleanup ကို တားဆီးနေတဲ့ session ဆီ ညွှန်ပြတဲ့ warnings တွေကို log file ထဲမှာ တွေ့ရပါလိမ့်မယ်။ ဒီကိစ္စမှာ — cleanup ရှေ့ဆက် လုပ်ဆောင်နိုင်အောင် — အဲဒီ session က သူ့ရဲ့ လက်ရှိ transaction ကို အဆုံးသတ်လိုက်ကြောင်း သေချာအောင် လုပ်သင့်ပါတယ်။

`pg_notification_queue_usage` function က — queue ထဲမှာ လက်ရှိ pending notifications (စောင့်ဆိုင်း ဆောင်ရွက်ရန် ကျန်နေသော notification များ) တွေ သိမ်းပိုက်ထားတဲ့ — queue ရဲ့ အချိုးအစား (fraction) ကို ပြန်ပေးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 9.27](/docs/postgresql/functions-info) ကို ကြည့်ပါ။

`NOTIFY` ကို execute လုပ်ခဲ့တဲ့ transaction တစ်ခုကို two-phase commit အတွက် prepare လုပ်လို့ မရပါဘူး။

### pg_notify (pg_notify function ဖြင့် notification ပို့ပေးခြင်း)

Notification တစ်ခု ပို့ဖို့ — `pg_notify(text, text)` function ကိုလည်း သုံးနိုင်ပါတယ်။ Function က channel နာမည်ကို ပထမ argument အနေနဲ့ လက်ခံပြီး — payload ကို ဒုတိယ argument အနေနဲ့ လက်ခံပါတယ်။ Constant (ပုံသေ) မဟုတ်တဲ့ channel နာမည်တွေနဲ့ payloads တွေနဲ့ အလုပ်လုပ်ဖို့ လိုအပ်ရင် — `NOTIFY` command ထက် ဒီ function က သုံးရတာ ပိုပြီး လွယ်ကူပါတယ်။

## Examples (ဥပမာများ)

psql ကနေ listen/notify sequence တစ်ခုကို configure လုပ်ပြီး execute လုပ်ခြင်း:

```sql
LISTEN virtual;
NOTIFY virtual;
Asynchronous notification "virtual" received from server process with PID 8448.
NOTIFY virtual, 'This is the payload';
Asynchronous notification "virtual" with payload "This is the payload" received from server process with PID 8448.

LISTEN foo;
SELECT pg_notify('fo' || 'o', 'pay' || 'load');
Asynchronous notification "foo" with payload "payload" received from server process with PID 14728.
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `NOTIFY` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[LISTEN](/docs/postgresql/sql-listen), [UNLISTEN](/docs/postgresql/sql-unlisten), [max_notify_queue_pages](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-NOTIFY-QUEUE-PAGES)
