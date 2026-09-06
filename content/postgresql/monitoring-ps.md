---
title: "Standard Unix Tools (စံ Unix tools များ)"
description: "`ps` command ၏ output ဖြင့် PostgreSQL server processes များကို ခွဲခြား သိရှိခြင်း — PostgreSQL က `ps` အတွက် ပြုပြင် ပေးထားတဲ့ command title ဖြင့် process တစ်ခုချင်းစီ (primary server process, background worker processes, client connection တစ်ခုချင်းစီကို ကိုင်တွယ်တဲ့ server processes) ကို ဖော်ပြပုံ၊ activity indicator (idle, idle in transaction, SELECT စသော command types) နှင့် waiting state တို့၏ အဓိပ္ပာယ်၊ cluster_name သတ်မှတ်ထားပါက `ps` output ထဲတွင် cluster name ပါဝင်လာခြင်း၊ update_process_title ပိတ်ထားခြင်း၏ သက်ရောက်မှု နှင့် Solaris တွင် `/usr/ucb/ps` အသုံးပြုရန် အထူး လိုအပ်ချက်များအကြောင်း ရှင်းလင်းချက်"
order: 193
source: "https://www.postgresql.org/docs/current/monitoring-ps.html"
status: translated
updated: 2026-09-06
---

## 27.1. Standard Unix Tools (စံ Unix tools များ)

Unix platform အများစုမှာ — PostgreSQL က `ps` က ဖော်ပြတဲ့အတိုင်း — သူ့ရဲ့ command title (command ၏ ခေါင်းစဉ်) ကို ပြုပြင် ပြောင်းလဲပေးပါတယ် — ဒါမှသာ server process (server လုပ်ငန်းစဉ်) တစ်ခုချင်းစီကို လွယ်ကူစွာ ခွဲခြား သိရှိနိုင်မှာ ဖြစ်ပါတယ်။ နမူနာ display (ဖန်သားပြင် ပြသမှု) တစ်ခုကတော့:

```
$ ps auxww | grep ^postgres
postgres  15551  0.0  0.1  57536  7132 pts/0    S    18:02   0:00 postgres -i
postgres  15554  0.0  0.0  57536  1184 ?        Ss   18:02   0:00 postgres: background writer
postgres  15555  0.0  0.0  57536   916 ?        Ss   18:02   0:00 postgres: checkpointer
postgres  15556  0.0  0.0  57536   916 ?        Ss   18:02   0:00 postgres: walwriter
postgres  15557  0.0  0.0  58504  2244 ?        Ss   18:02   0:00 postgres: autovacuum launcher
postgres  15582  0.0  0.0  58772  3080 ?        Ss   18:04   0:00 postgres: joe runbug 127.0.0.1 idle
postgres  15606  0.0  0.0  58772  3052 ?        Ss   18:07   0:00 postgres: tgl regression [local] SELECT waiting
postgres  15610  0.0  0.0  58772  3056 ?        Ss   18:07   0:00 postgres: tgl regression [local] idle in transaction
```

(`ps` ရဲ့ သင့်လျော်တဲ့ invocation (ခေါ်ယူ အသုံးပြုမှု) က platform အမျိုးမျိုးမှာ ကွဲပြားသလို — ပြသလိုက်တဲ့ အသေးစိတ် အချက်အလက်တွေလည်း ကွဲပြားပါတယ်။ ဒီဥပမာက မကြာသေးမီက Linux system တစ်ခုကနေ လာတာပါ။) ဒီမှာ စာရင်းပြုထားတဲ့ ပထမ process ကတော့ primary server process (ပင်မ server လုပ်ငန်းစဉ်) ဖြစ်ပါတယ်။ ၎င်းအတွက် ပြသထားတဲ့ command arguments တွေက ၎င်းကို စတင်ခဲ့တဲ့အခါ သုံးခဲ့တဲ့ arguments တွေနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။ နောက် process လေးခုကတော့ primary process က ကိုယ်တိုင် အလိုအလျောက် စတင်ပေးတဲ့ background worker processes (နောက်ခံ worker လုပ်ငန်းစဉ်များ) တွေ ဖြစ်ပါတယ်။ (System ကို autovacuum run မလုပ်စေရန် သတ်မှတ်ထားရင် “autovacuum launcher” process က ရှိမှာ မဟုတ်ပါဘူး။) ကျန်ရှိတဲ့ process တစ်ခုချင်းစီကတော့ — client connection (client ချိတ်ဆက်မှု) တစ်ခုကို ကိုင်တွယ်နေတဲ့ — server process တစ်ခုစီ ဖြစ်ပါတယ်။ Process တစ်ခုချင်းစီက သူ့ရဲ့ command line display ကို အောက်ပါ ပုံစံနဲ့ သတ်မှတ်ပါတယ်:

```sql
postgres: user database host activity
```

User, database နဲ့ (client) host item တွေကတော့ — client connection ရဲ့ သက်တမ်း တစ်လျှောက်လုံး — တူညီနေပေမယ့် — activity indicator (လုပ်ဆောင်မှု အခြေအနေ ညွှန်ပြချက်) ကတော့ ပြောင်းလဲပါတယ်။ Activity က `idle` (ဆိုလိုတာက client command တစ်ခုကို စောင့်ဆိုင်းနေခြင်း)၊ `idle in transaction` (`BEGIN` block တစ်ခု အတွင်းမှာ client ကို စောင့်ဆိုင်းနေခြင်း) ဒါမှမဟုတ် `SELECT` လို command type name (command အမျိုးအစား နာမည်) တစ်ခု ဖြစ်နိုင်ပါတယ်။ ထို့အပြင် — server process က လောလောဆယ် — အခြား session တစ်ခုက ကိုင်ထားတဲ့ lock (lock — လော့ခ်) တစ်ခုကို စောင့်ဆိုင်းနေရရင် — `waiting` ကို ထပ်ဆင့် ထည့်သွင်း ဖော်ပြပါတယ်။ အပေါ်က ဥပမာမှာ — process 15606 က process 15610 ရဲ့ transaction ပြီးမြောက်ပြီး — အဲဒီကနေတစ်ဆင့် lock တချို့ လွှတ်ပေးဖို့ — စောင့်ဆိုင်းနေတယ်လို့ မှန်းဆ နိုင်ပါတယ်။ (Process 15610 က blocker (ပိတ်ဆို့ထားသူ) ဖြစ်ရမှာ သေချာပါတယ် — အကြောင်းကတော့ တခြား active session မရှိလို့ပါ။ ပိုရှုပ်ထွေးတဲ့ အခြေအနေတွေမှာတော့ — ဘယ်သူက ဘယ်သူ့ကို ပိတ်ဆို့ (block) နေလဲ ဆုံးဖြတ်ဖို့ — [`pg_locks`](https://www.postgresql.org/docs/current/view-pg-locks.html) system view (system မြင်ကွင်း) ထဲကို ကြည့်ဖို့ လိုအပ်ပါလိမ့်မယ်။)

[cluster_name](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-CLUSTER-NAME) ကို configure (ပြင်ဆင် သတ်မှတ်) လုပ်ထားရင် — cluster name ကိုလည်း `ps` output (ထွက်ပေါ် ရလဒ်) ထဲမှာ ပြသမှာ ဖြစ်ပါတယ်:

```
$ psql -c 'SHOW cluster_name'
 cluster_name
--------------
 server1
(1 row)

$ ps aux|grep server1
postgres   27093  0.0  0.0  30096  2752 ?        Ss   11:34   0:00 postgres: server1: background writer
...
```

[update_process_title](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-UPDATE-PROCESS-TITLE) ကို ပိတ်ထားရင် — activity indicator ကို update (ပြင်ဆင် မွမ်းမံ) လုပ်မှာ မဟုတ်ပါဘူး; process title ကို — process အသစ်တစ်ခု စတင်လိုက်တဲ့အခါ — တစ်ကြိမ်တည်းပဲ သတ်မှတ်ပါတယ်။ Platform တချို့မှာ ဒါက command တစ်ခုချင်းစီရဲ့ overhead (ထပ်ဆောင်း ကုန်ကျမှု) ကို တိုင်းတာလို့ ရလောက်တဲ့ ပမာဏနဲ့ သက်သာစေပြီး — တခြားနေရာတွေမှာတော့ မထင်မသား ဖြစ်ပါတယ်။

> **အကြံပြုချက်:** Solaris က အထူး ကိုင်တွယ်မှု လိုအပ်ပါတယ်။ `/bin/ps` အစား `/usr/ucb/ps` ကို သုံးရပါမယ်။ ပြီးတော့ — `w` flag တစ်ခုတည်း မဟုတ်ဘဲ — `w` flag နှစ်ခုလုံးကိုပါ သုံးရပါမယ်။ ထို့အပြင် — `postgres` command ကို သင့်ရဲ့ မူလ invocation က — server process တစ်ခုချင်းစီက ပေးအပ်တဲ့ `ps` status display ထက် — ပိုတိုတဲ့ `ps` status display ရှိရပါမယ်။ ဒီအချက် သုံးခုလုံးကို လိုက်နာရန် ပျက်ကွက်ခဲ့ရင် — server process တစ်ခုချင်းစီအတွက် `ps` output က — မူရင်း `postgres` command line ဖြစ်နေမှာ ဖြစ်ပါတယ်။
