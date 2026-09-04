---
title: "LISTEN (notification တစ်ခုအတွက် နားထောင်ခြင်း)"
description: "လက်ရှိ session ကို notification channel တစ်ခုရဲ့ listener အဖြစ် မှတ်ပုံတင်ပေးတဲ့ command — NOTIFY command ခေါ်လိုက်တိုင်း နားထောင်နေတဲ့ sessions အားလုံးကို အသိပေးခြင်း၊ UNLISTEN ဖြင့် ရပ်စဲနိုင်ခြင်း၊ session ပြီးဆုံးလျှင် registrations များ အလိုအလျောက် ရှင်းလင်းခြင်းနှင့် transaction commit ဆိုင်ရာ စည်းမျဉ်းများ ပါဝင်သည်"
order: 195
source: "https://www.postgresql.org/docs/current/sql-listen.html"
status: translated
updated: 2026-09-04
---

## LISTEN (notification တစ်ခုအတွက် နားထောင်ခြင်း)

LISTEN — notification တစ်ခုအတွက် နားထောင်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
LISTEN channel
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`LISTEN` က လက်ရှိ session ကို — `channel` လို့ နာမည်ပေးထားတဲ့ notification channel ပေါ်က listener (နားထောင်သူ) တစ်ခုအနေနဲ့ — မှတ်ပုံတင်ပေးပါတယ်။ လက်ရှိ session က ဒီ notification channel အတွက် listener အဖြစ် မှတ်ပုံတင်ပြီးသား ဖြစ်နေပြီဆိုရင်တော့ — ဘာမှ လုပ်ဆောင်မှာ မဟုတ်ပါဘူး။

`NOTIFY channel` command ကို — ဒီ session ကိုယ်တိုင် ဖြစ်စေ၊ database တစ်ခုတည်းဆီ ချိတ်ဆက်ထားတဲ့ တခြား session တစ်ခုက ဖြစ်စေ — ခေါ်လိုက်တိုင်း — အဲဒီ notification channel ပေါ်မှာ လက်ရှိ နားထောင်နေတဲ့ sessions တွေ အားလုံးကို အသိပေးပြီး — session တစ်ခုချင်းစီကလည်း သူ့ရဲ့ ချိတ်ဆက်ထားတဲ့ client application ကို အလှည့်ကျ အသိပေးပါတယ်။

Session တစ်ခုကို သတ်မှတ်ထားတဲ့ notification channel တစ်ခုအတွက် — `UNLISTEN` command နဲ့ — unregister (မှတ်ပုံတင်မှု ဖျက်သိမ်း) လုပ်နိုင်ပါတယ်။ Session တစ်ခုရဲ့ listen registrations (နားထောင်မှု မှတ်ပုံတင်မှုများ) တွေကို — session ပြီးဆုံးသွားတဲ့အခါ — အလိုအလျောက် ရှင်းလင်းပေးပါတယ်။

Client application တစ်ခုက notification events (အသိပေးချက် ဖြစ်ရပ်များ) တွေကို ရှာဖွေ တွေ့ရှိဖို့ သုံးရမယ့် နည်းလမ်းက — သူ အသုံးပြုနေတဲ့ PostgreSQL application programming interface ပေါ်မှာ မူတည်ပါတယ်။ libpq library နဲ့ဆိုရင် — application က `LISTEN` ကို သာမန် SQL command တစ်ခုအနေနဲ့ ထုတ်ပြန်ပြီး — နောက်ပိုင်းမှာ notification events တွေ လက်ခံရရှိခဲ့လားဆိုတာ သိရှိဖို့ — `PQnotifies` function ကို အခါအားလျော်စွာ ခေါ်ပေးရပါတယ်။ libpgtcl လို တခြား interfaces တွေကတော့ — notify events တွေကို ကိုင်တွယ်ဖို့ — ပိုမြင့်မားတဲ့ အဆင့် (higher-level) နည်းလမ်းတွေ ပေးပါတယ်; တကယ်တော့ libpgtcl နဲ့ဆိုရင် — application programmer က `LISTEN` ဒါမှမဟုတ် `UNLISTEN` ကို တိုက်ရိုက် ထုတ်ပြန်ဖို့တောင် မလိုအပ်ပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် ကိုယ် အသုံးပြုနေတဲ့ interface ရဲ့ documentation ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **channel** — notification channel တစ်ခုရဲ့ နာမည် (identifier မည်သည်မဆို)။

## Notes (မှတ်စုများ)

`LISTEN` က transaction commit မှာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ `LISTEN` ဒါမှမဟုတ် `UNLISTEN` ကို — နောက်ပိုင်းမှာ rollback ဖြစ်သွားတဲ့ transaction တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်ခဲ့ရင် — နားထောင်နေတဲ့ notification channels အစုက မပြောင်းလဲဘဲ ရှိနေပါတယ်။

`LISTEN` ကို execute လုပ်ခဲ့တဲ့ transaction တစ်ခုကို two-phase commit အတွက် prepare လုပ်လို့ မရပါဘူး။

နားထောင်တဲ့ session တစ်ခုကို ပထမဆုံး စနစ်ထည့်သွင်းတဲ့အခါ — race condition (ပြိုင်ဆိုင်မှု အခြေအနေ) တစ်ခု ရှိပါတယ်: တစ်ပြိုင်နက် commit ဖြစ်နေတဲ့ transactions တွေက notify events တွေ ပို့နေတယ်ဆိုရင် — အသစ် စတင် နားထောင်တဲ့ session က အဲဒီထဲက ဘယ်ဟာတွေကို အတိအကျ လက်ခံရရှိမှာလဲ? အဖြေကတော့ — session က transaction ရဲ့ commit step အတွင်းက အခိုက်အတန့် တစ်ခုပြီးနောက်မှာ commit ဖြစ်တဲ့ events တွေ အားလုံးကို လက်ခံရရှိမှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် အဲဒီအချိန်က — transaction က queries တွေထဲမှာ လေ့လာ ရှုမြင်နိုင်ခဲ့တဲ့ database state တစ်ခုခုထက်တော့ နည်းနည်း နောက်ကျပါတယ်။ ဒါက `LISTEN` သုံးစွဲမှုအတွက် ဒီလို စည်းမျဉ်း တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်: အရင်ဆုံး အဲဒီ command ကို execute (ပြီးတော့ commit!) လုပ်ပါ၊ ပြီးရင် transaction အသစ်တစ်ခုထဲမှာ application logic လိုအပ်သလို database state ကို စစ်ဆေးပါ၊ ပြီးရင် database state ရဲ့ နောက်ပိုင်း ပြောင်းလဲမှုတွေကို သိရှိဖို့ notifications တွေပေါ်မှာ အားကိုးပါ။ ပထမဆုံး လက်ခံရရှိတဲ့ notifications အနည်းငယ်က — ကနဦး database စစ်ဆေးမှုထဲမှာ မြင်ပြီးသား updates တွေကို ရည်ညွှန်းနေနိုင်ပေမယ့် — ဒါက ပုံမှန်အားဖြင့် အန္တရာယ် မရှိပါဘူး။

[NOTIFY](/docs/postgresql/sql-notify) မှာ `LISTEN` နဲ့ `NOTIFY` အသုံးပြုမှုအကြောင်း ပိုပြီး အကျယ်တဝင့် ဆွေးနွေးထားပါတယ်။

## Examples (ဥပမာများ)

psql ကနေ listen/notify sequence တစ်ခုကို configure လုပ်ပြီး execute လုပ်ခြင်း:

```sql
LISTEN virtual;
NOTIFY virtual;
Asynchronous notification "virtual" received from server process with PID 8448.
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `LISTEN` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[NOTIFY](/docs/postgresql/sql-notify), [UNLISTEN](/docs/postgresql/sql-unlisten), [max_notify_queue_pages](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-NOTIFY-QUEUE-PAGES)
