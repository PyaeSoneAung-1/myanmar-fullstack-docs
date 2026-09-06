---
title: "Shutting Down the Server (server ကို ပိတ်ခြင်း)"
description: "Database server ကို ပိတ်ခြင်း — shutdown mode သုံးမျိုး (SIGTERM / Smart Shutdown, SIGINT / Fast Shutdown, SIGQUIT / Immediate Shutdown) ၏ အပြုအမူများ၊ pg_ctl နှင့် kill ဖြင့် signal ပို့နည်း၊ postmaster.pid ဖိုင်မှ PID ရှာနည်း၊ SIGKILL မသုံးသင့်ကြောင်း သတိပေးချက် နှင့် pg_terminate_backend() ဖြင့် session တစ်ခုတည်း အဆုံးသတ်ခြင်းအကြောင်း ရှင်းလင်းချက်"
order: 144
source: "https://www.postgresql.org/docs/current/server-shutdown.html"
status: translated
updated: 2026-09-06
---

## 18.5. Shutting Down the Server (server ကို ပိတ်ခြင်း)

Database server ကို ပိတ်ဖို့ နည်းလမ်း အများအပြား ရှိပါတယ်။ အတွင်းပိုင်း ယန္တရားအရကတော့ — အားလုံးက — ကြီးကြပ်ကွပ်ကဲပေးတဲ့ (supervisor) `postgres` process ဆီ signal တစ်ခု ပို့တာချည်းပဲ ဖြစ်ပါတယ်။

ကြိုတင် package လုပ်ထားတဲ့ (pre-packaged) PostgreSQL version တစ်ခုကို သုံးပြီး — server စတင်ဖို့ ၎င်းရဲ့ စီစဉ်ပေးမှုတွေကို သုံးခဲ့တယ်ဆိုရင် — server ရပ်တန့်ဖို့အတွက်လည်း ၎င်းရဲ့ စီစဉ်ပေးမှုတွေကိုပဲ သုံးသင့်ပါတယ်။ အသေးစိတ်အတွက် package-level documentation (package အဆင့် မှတ်တမ်း) ကို တိုင်ပင်ကြည့်ပါ။

Server ကို တိုက်ရိုက် စီမံခန့်ခွဲတဲ့အခါ — `postgres` process ဆီ signal အမျိုးမျိုး ပို့ခြင်းအားဖြင့် shutdown အမျိုးအစားကို ထိန်းချုပ်နိုင်ပါတယ်:

- **SIGTERM** — ဒါက Smart Shutdown (စမတ် ပိတ်ခြင်း) mode ပါ။ SIGTERM ကို လက်ခံရရှိပြီးနောက် — server က connection အသစ်တွေကို ခွင့်မပြုတော့ဘဲ — ရှိနေတဲ့ sessions တွေကို သူတို့ရဲ့ အလုပ်တွေကို ပုံမှန်အတိုင်း အဆုံးသတ်ခွင့် ပြုပါတယ်။ Session တွေ အားလုံး အဆုံးသတ်ပြီးမှသာ — server က ပိတ်ပါတယ်။ Smart shutdown တစ်ခုကို တောင်းဆိုတဲ့အခါ server က recovery (ပြန်လည် ဆယ်တင်ခြင်း) လုပ်နေတုန်း ဖြစ်နေရင် — recovery နဲ့ streaming replication တွေကို ပုံမှန် sessions တွေ အားလုံး အဆုံးသတ်ပြီးမှသာ ရပ်တန့်ပါလိမ့်မယ်။
- **SIGINT** — ဒါက Fast Shutdown (မြန် ပိတ်ခြင်း) mode ပါ။ Server က connection အသစ်တွေကို ခွင့်မပြုတော့ဘဲ — ရှိနေတဲ့ server processes တွေ အားလုံးဆီ SIGTERM ပို့ပြီး — အဲဒါက သူတို့ရဲ့ လက်ရှိ transactions တွေကို abort (ဖျက်သိမ်း) လုပ်ပြီး ချက်ချင်း ထွက်သွားစေပါလိမ့်မယ်။ ပြီးတော့ — server processes တွေ အားလုံး ထွက်သွားတဲ့အထိ စောင့်ပြီး — နောက်ဆုံးမှာ ပိတ်ပါတယ်။
- **SIGQUIT** — ဒါက Immediate Shutdown (ချက်ချင်း ပိတ်ခြင်း) mode ပါ။ Server က child processes တွေ အားလုံးဆီ SIGQUIT ပို့ပြီး — သူတို့ အဆုံးသတ်တဲ့အထိ စောင့်ပါလိမ့်မယ်။ တစ်ခုခုက 5 စက္ကန့် အတွင်း အဆုံးသတ်မသွားဘူးဆိုရင် — သူတို့ဆီ SIGKILL ပို့ပါလိမ့်မယ်။ Supervisor server process က — ပုံမှန် database shutdown processing မလုပ်ဘဲ — child processes တွေ အားလုံး ထွက်သွားတာနဲ့ ချက်ချင်း ထွက်သွားပါတယ်။ ဒါက နောက် start-up (ပြန်စတင်) ချိန်မှာ (WAL log ကို ပြန်ဖွင့် ဖတ်ခြင်းအားဖြင့်) recovery ဆီ ဦးတည်သွားပါလိမ့်မယ်။ ဒါကို အရေးပေါ် အခြေအနေတွေမှာပဲ အကြံပြုပါတယ်။

[pg_ctl](https://www.postgresql.org/docs/current/app-pg-ctl.html) program က — server ကို ပိတ်ဖို့ ဒီ signals တွေ ပို့ဖို့အတွက် အဆင်ပြေတဲ့ interface တစ်ခု ထောက်ပံ့ပေးပါတယ်။ တနည်းအားဖြင့် — Windows မဟုတ်တဲ့ system တွေမှာ `kill` ကို သုံးပြီး signal ကို တိုက်ရိုက် ပို့နိုင်ပါတယ်။ `postgres` process ရဲ့ PID ကို `ps` program သုံးပြီး ဖြစ်စေ — data directory ထဲက `postmaster.pid` ဖိုင်ကနေ ဖြစ်စေ — ရှာတွေ့နိုင်ပါတယ်။ ဥပမာ — fast shutdown တစ်ခု လုပ်ဖို့ဆိုရင်:

```
$ kill -INT `head -1 /usr/local/pgsql/data/postmaster.pid`
```

> **အရေးကြီး:** Server ကို ပိတ်ဖို့ SIGKILL ကို သုံးတာ မကောင်းပါဘူး။ အဲဒီလို လုပ်ရင် — server က shared memory နဲ့ semaphores တွေကို ပြန်လွှတ်ပေးနိုင်မှာ မဟုတ်ပါဘူး။ ထို့အပြင် — SIGKILL က `postgres` process ကို — သူ့ရဲ့ subprocesses တွေဆီ signal ကို ဆင့်ပွား ပို့ပေးခွင့် မပြုဘဲ သတ်ပစ်လိုက်တာမို့ — subprocess တစ်ခုချင်းစီကိုပါ လက်နဲ့ သတ်ဖို့ လိုအပ်လာနိုင်ပါတယ်။

တခြား sessions တွေ ဆက်လက် လည်ပတ်နေစေရင်း — session တစ်ခုတည်းကို အဆုံးသတ်ချင်ရင် — `pg_terminate_backend()` ကို သုံးပါ ([ဇယား 9.96](/docs/postgresql/functions-admin) ကို ကြည့်ပါ) — ဒါမှမဟုတ် — အဲဒီ session နဲ့ ဆက်စပ်နေတဲ့ child process ဆီ SIGTERM signal တစ်ခု ပို့ပါ။
