---
title: "Viewing Locks (Locks များကို ကြည့်ရှုခြင်း)"
description: "`pg_locks` system table ကို သုံးပြီး database လုပ်ဆောင်ချက်များကို စောင့်ကြည့်ခြင်းအကြောင်း — lock manager ထဲက outstanding locks (ထွက်ပေါ်နေဆဲ lock များ) များအကြောင်း ကြည့်ရှုနိုင်မှု, ဥပမာ အသုံးပြုမှုများ (လက်ရှိ outstanding lock အားလုံး/ database တစ်ခုချင်းစီရှိ relations များပေါ်က locks/ relation တစ်ခုချင်းစီပေါ်က locks/ PostgreSQL session တစ်ခုချင်းစီ ကိုင်ထားသော locks အားလုံး ကြည့်ရှုခြင်း, ungranted locks အများဆုံးရှိသော relation ဆုံးဖြတ်ခြင်း, lock contention ၏ database performance နှင့် database traffic အပေါ် သက်ရောက်မှု ဆုံးဖြတ်ခြင်း), ထို့ပြင် pg_locks view ၏ အသေးစိတ် အချက်အလက်များ (Section 53.13) နှင့် locking/concurrency စီမံခန့်ခွဲမှုဆိုင်ရာ ရည်ညွှန်းချက်များ (Chapter 13) အကြောင်း"
order: 195
source: "https://www.postgresql.org/docs/current/monitoring-locks.html"
status: translated
updated: 2026-09-06
---

## 27.3. Viewing Locks (Locks များကို ကြည့်ရှုခြင်း)

Database လုပ်ဆောင်ချက်တွေကို စောင့်ကြည့်ခြင်းအတွက် နောက်ထပ် အသုံးဝင်တဲ့ tool တစ်ခုကတော့ `pg_locks` system table (system table — စနစ်နှင့်ဆိုင်သော table) ဖြစ်ပါတယ်။ ၎င်းက database administrator (database စီမံခန့်ခွဲသူ) ကို — lock manager ထဲမှာ ရှိနေတဲ့ outstanding locks (ထွက်ပေါ်နေဆဲ lock များ) တွေအကြောင်း အချက်အလက်တွေကို ကြည့်ရှုနိုင်စေပါတယ်။ ဥပမာ — ဒီ စွမ်းရည်ကို အောက်ပါတို့အတွက် သုံးနိုင်ပါတယ်:

- လက်ရှိ ထွက်ပေါ်နေဆဲ lock တွေ အားလုံး၊ database တစ်ခုချင်းစီ ထဲက relations တွေပေါ်မှာ ရှိတဲ့ lock တွေ အားလုံး၊ relation တစ်ခုချင်းစီပေါ်မှာ ရှိတဲ့ lock တွေ အားလုံး ဒါမှမဟုတ် PostgreSQL session တစ်ခုချင်းစီ ကိုင်ထားတဲ့ lock တွေ အားလုံးကို ကြည့်ရှုခြင်း။
- လက်ရှိ database ထဲမှာ ungranted locks (ပေးအပ်မရသေးတဲ့ lock များ) အများဆုံး ရှိတဲ့ relation ကို ဆုံးဖြတ်ခြင်း (ဒါက database clients တွေကြားမှာ contention (ပြိုင်ဆိုင်မှု) ရဲ့ ရင်းမြစ် (source) တစ်ခု ဖြစ်နိုင်ပါတယ်)။
- Lock contention (lock ပြိုင်ဆိုင်မှု) က database တစ်ခုလုံးရဲ့ performance (လုပ်ဆောင်စွမ်းအား) အပေါ် သက်ရောက်မှုကို ဆုံးဖြတ်ခြင်း၊ ထို့ပြင် — contention က database traffic (database အသွားအလာ) တစ်ခုလုံးနဲ့အလိုက် ဘယ်လောက် အတိုင်းအတာအထိ ကွဲပြား ပြောင်းလဲလဲဆိုတာကိုလည်း ဆုံးဖြတ်ခြင်း။

`pg_locks` view ရဲ့ အသေးစိတ် အချက်အလက်တွေကို [အပိုင်း 53.13](https://www.postgresql.org/docs/current/view-pg-locks.html) မှာ ဖော်ပြထားပါတယ်။ PostgreSQL နဲ့အတူ locking နဲ့ concurrency (တစ်ပြိုင်နက် လုပ်ဆောင်မှု) ကို စီမံခန့်ခွဲခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 13](https://www.postgresql.org/docs/current/mvcc.html) ကို ရည်ညွှန်းပါ။
