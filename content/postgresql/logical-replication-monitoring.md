---
title: "Monitoring (စောင့်ကြည့် စစ်ဆေးခြင်း)"
description: "Logical replication ကို စောင့်ကြည့် စစ်ဆေးခြင်း — publication node ပေါ်က monitoring သည် physical replication primary နှင့် ဆင်တူခြင်း၊ pg_stat_subscription view တွင် subscription worker တစ်ခုချင်းစီအတွက် row များ၊ apply worker၊ table synchronization worker နှင့် parallel apply worker များ အကြောင်း"
order: 236
source: "https://www.postgresql.org/docs/current/logical-replication-monitoring.html"
status: translated
updated: 2026-09-11
---

## 29.10. Monitoring (စောင့်ကြည့် စစ်ဆေးခြင်း)

Logical replication က physical streaming replication (ရုပ်ပိုင်းဆိုင်ရာ streaming replication) နဲ့ ဆင်တူတဲ့ architecture (ဗိသုကာ) ကို အခြေခံထားတာကြောင့် — publication node တစ်ခုပေါ်က monitoring က physical replication primary တစ်ခုကို monitoring လုပ်တာနဲ့ ဆင်တူပါတယ် ([အပိုင်း 26.2.5.2](/docs/postgresql/warm-standby) ကို ကြည့်ပါ)။

Subscription အတွက် monitoring information ကို [`pg_stat_subscription`](/docs/postgresql/monitoring-stats) မှာ တွေ့မြင်နိုင်ပါတယ်။ ဒီ view မှာ subscription worker တစ်ခုချင်းစီအတွက် row တစ်ခု ပါဝင်ပါတယ်။ Subscription တစ်ခုမှာ သူ့ရဲ့ state ပေါ် မူတည်ပြီး active subscription worker သုည ဒါမှမဟုတ် ထို့ထက် ပိုရှိနိုင်ပါတယ်။

ပုံမှန်အားဖြင့် — enable လုပ်ထားတဲ့ subscription တစ်ခုအတွက် apply process တစ်ခုတည်း run နေပါတယ်။ Disable လုပ်ထားတဲ့ subscription ဒါမှမဟုတ် ပျက်ကျသွားတဲ့ subscription တစ်ခုမှာတော့ ဒီ view ထဲမှာ row သုည ရှိပါလိမ့်မယ်။ Table တစ်ခုခုရဲ့ initial data synchronization လုပ်နေဆဲဆိုရင် — synchronize လုပ်နေတဲ့ table တွေအတွက် အပိုဆောင်း worker တွေ ရှိပါလိမ့်မယ်။ ဒါ့အပြင် — [`streaming`](/docs/postgresql/sql-createsubscription) transaction ကို parallel နဲ့ apply လုပ်နေတယ်ဆိုရင် — အပိုဆောင်း parallel apply worker တွေလည်း ရှိနိုင်ပါတယ်။
