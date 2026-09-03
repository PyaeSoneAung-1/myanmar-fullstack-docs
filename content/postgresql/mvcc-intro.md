---
title: "Introduction (နိဒါန်း)"
description: "PostgreSQL ရဲ့ MVCC (Multiversion Concurrency Control) သဘောတရား မိတ်ဆက် — concurrent access ကို စီမံခန့်ခွဲပုံ၊ transaction isolation နဲ့ locking ထက် MVCC ရဲ့ အားသာချက်များ"
order: 97
source: "https://www.postgresql.org/docs/current/mvcc-intro.html"
status: translated
updated: 2026-09-03
---

## 13.1. Introduction (နိဒါန်း)

PostgreSQL က developer တွေအတွက် — data ကို တစ်ပြိုင်နက် ဝင်ရောက် လုပ်ဆောင်မှု (concurrent access) ကို စီမံခန့်ခွဲဖို့ — tools အစုံအလင် ပံ့ပိုးပေးထားပါတယ်။ အတွင်းပိုင်းမှာတော့ — data consistency (ဒေတာ တစ်သမတ်တည်း ဖြစ်နေမှု) ကို — version အမျိုးမျိုးပေါ်မှာ အခြေခံတဲ့ model — Multiversion Concurrency Control (MVCC) — ကို သုံးပြီး ထိန်းသိမ်းပါတယ်။ ဆိုလိုတာက — SQL statement တစ်ခုချင်းစီဟာ နောက်ခံ data ရဲ့ လက်ရှိ အခြေအနေ ဘယ်လိုပဲ ရှိနေနေ — အတိတ်က အချိန်တစ်ခုမှာ ရှိခဲ့တဲ့အတိုင်း data ရဲ့ snapshot တစ်ခု (*database version* တစ်ခု) ကိုပဲ မြင်ရပါတယ်။ ဒါက — row တစ်တန်းတည်းကို update လုပ်နေတဲ့ concurrent transaction တွေကြောင့် ဖြစ်ပေါ်လာနိုင်တဲ့ — မကိုက်ညီတဲ့ (inconsistent) data တွေကို statement တွေ မြင်ရခြင်းကနေ ကာကွယ်ပေးပြီး — database session တစ်ခုချင်းစီအတွက် *transaction isolation* (transaction များ သီးခြားခွဲထားမှု) ကို ပေးအပ်ပါတယ်။ ရိုးရာ database system တွေရဲ့ locking နည်းလမ်းတွေကို ရှောင်လွှဲထားတဲ့ MVCC က — user အများ (multiuser) သုံးတဲ့ ပတ်ဝန်းကျင်မှာ ကျေနပ်လောက်တဲ့ performance ရရှိစေဖို့ — lock contention (lock ရယူမှု ပြိုင်ဆိုင်မှု) ကို အနည်းဆုံး ဖြစ်အောင် လျှော့ချပေးပါတယ်။

Concurrency control ရဲ့ MVCC model ကို locking ထက် သုံးခြင်းရဲ့ အဓိက အားသာချက်ကတော့ — MVCC မှာ data ဖတ်ခြင်း (querying) အတွက် ရယူလိုက်တဲ့ lock တွေက data ရေးခြင်း (writing) အတွက် ရယူလိုက်တဲ့ lock တွေနဲ့ ထိပ်တိုက် (conflict) မဖြစ်တာပဲ ဖြစ်ပါတယ်။ အဲဒါကြောင့် — reading က writing ကို ဘယ်တော့မှ မပိတ်ဆို့သလို — writing ကလည်း reading ကို ဘယ်တော့မှ မပိတ်ဆို့ပါဘူး။ PostgreSQL က ဒီအာမခံချက်ကို — ဆန်းသစ်တဲ့ *Serializable Snapshot Isolation* (SSI) level ကို သုံးပြီး အပြင်းထန်ဆုံး transaction isolation level ကို ပေးအပ်နေချိန်မှာတောင် ထိန်းသိမ်းထားပါတယ်။

Transaction isolation အပြည့်အဝ မလိုအပ်ဘဲ — conflict ဖြစ်နိုင်တဲ့ နေရာတစ်ခုချင်းစီကို ကိုယ်တိုင် ရှင်းလင်းစွာ စီမံချင်တဲ့ application တွေအတွက်လည်း — table-level နဲ့ row-level locking ယန္တရားတွေကို PostgreSQL မှာ ရနိုင်ပါသေးတယ်။ ဒါပေမယ့် — ယေဘုယျအားဖြင့်တော့ — MVCC ကို မှန်ကန်စွာ အသုံးပြုတာက lock တွေထက် performance ပိုကောင်းစေပါတယ်။ ဒါ့အပြင် — application က ကိုယ်တိုင် သတ်မှတ်တဲ့ advisory lock (application က ကိုယ်တိုင် သတ်မှတ်သုံးနိုင်တဲ့ lock) တွေက — transaction တစ်ခုတည်းနဲ့ ချည်နှောင်မထားတဲ့ lock တွေကို ရယူဖို့ ယန္တရားတစ်ခုကို ပေးပါတယ်။
