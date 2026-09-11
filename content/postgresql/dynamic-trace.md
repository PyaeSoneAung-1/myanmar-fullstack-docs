---
title: "Dynamic Tracing (Dynamic tracing — server ၏ လည်ပတ်မှုကို ခြေရာခံခြင်း)"
description: "PostgreSQL ၏ dynamic tracing (အလုပ်လုပ်နေစဉ် ခြေရာခံခြင်း) ထောက်ပံ့မှုအကြောင်း — code အတွင်းရှိ သတ်မှတ် အချက်များတွင် external utility ကို ခေါ်ယူနိုင်သည့် သဘောတရား, ထောက်ပံ့သည့် utilities များ (DTrace, SystemTap), configure တွင် `--enable-dtrace` ဖြင့် compile ပြုလုပ်ခြင်း, built-in probes များ၏ ဇယား (transaction/query/statement/checkpoint/buffer/WAL/sort/LWLock/heavyweight lock/deadlock စသည့် probes ၅၅ ခု၏ parameters နှင့် ဖော်ပြချက်များ), probe parameters များတွင် သုံးသော type definitions ဇယား, DTrace script ဖြင့် probes များကို အသုံးပြုခြင်း (transaction counts ခွဲခြမ်း စိတ်ဖြာသည့် ဥပမာ နှင့် SystemTap ၏ double-underscore notation အကြောင်း မှတ်ချက်), probe အသစ်များ သတ်မှတ်ခြင်း (src/backend/utils/probes.d တွင် ထည့်သွင်းခြင်း, TRACE_POSTGRESQL macros, dtrace -ln ဖြင့် စစ်ဆေးခြင်း ဥပမာ) နှင့် C code တွင် trace macros ထည့်သည့်အခါ သတိထားရမည့် အချက်များအကြောင်း ရှင်းလင်းချက်"
order: 201
source: "https://www.postgresql.org/docs/current/dynamic-trace.html"
status: translated
updated: 2026-09-06
---

## 27.5. Dynamic Tracing (Dynamic tracing — server ၏ လည်ပတ်မှုကို ခြေရာခံခြင်း)

- **27.5.1. Compiling for Dynamic Tracing (Dynamic tracing အတွက် compile ပြုလုပ်ခြင်း)**
- **27.5.2. Built-in Probes (ထည့်သွင်းပြီးသား probes များ)**
- **27.5.3. Using Probes (Probes များကို အသုံးပြုခြင်း)**
- **27.5.4. Defining New Probes (Probe အသစ်များ သတ်မှတ်ခြင်း)**

PostgreSQL က database server ရဲ့ dynamic tracing (အလုပ်လုပ်နေစဉ် ခြေရာခံခြင်း) ကို ထောက်ပံ့ဖို့ နည်းလမ်းတွေ ပံ့ပိုးပေးပါတယ်။ ဒါက သုံးတဲ့အခါ — code ထဲက သတ်မှတ်ထားတဲ့ အချက်တွေမှာ external utility (ပြင်ပ utility) တစ်ခုကို ခေါ်ယူနိုင်ပြီး — အဲဒီကနေတစ်ဆင့် execution (လုပ်ဆောင်မှု) ကို ခြေရာခံ (trace) လုပ်နိုင်ပါတယ်။

Probe (ခြေရာခံ စစ်ဆေးသည့် အချက်) ဒါမှမဟုတ် trace point (ခြေရာခံ အမှတ်) တွေ အများအပြားကို source code ထဲမှာ ကြိုတင် ထည့်သွင်းပြီးသား ဖြစ်ပါတယ်။ ဒီ probes တွေကို database developers တွေနဲ့ administrators (စီမံခန့်ခွဲသူများ) တွေ အသုံးပြုဖို့ ရည်ရွယ်ထားပါတယ်။ Default အနေနဲ့တော့ ဒီ probes တွေကို PostgreSQL ထဲမှာ compile လုပ်ပေးထားတာ မဟုတ်ပါဘူး; probes တွေ ရရှိနိုင်အောင် — configure script ကို အသုံးပြုသူက ကိုယ်တိုင် ရှင်းလင်းစွာ (explicitly) ပြောပြဖို့ လိုအပ်ပါတယ်။

လောလောဆယ်တော့ [DTrace](https://en.wikipedia.org/wiki/DTrace) utility ကို ထောက်ပံ့ထားပြီး — ဒီစာရေးနေတဲ့ အချိန်မှာ — Solaris, macOS, FreeBSD, NetBSD နဲ့ Oracle Linux တွေပေါ်မှာ ရနိုင်ပါတယ်။ Linux အတွက် [SystemTap](https://sourceware.org/systemtap/) project က DTrace နဲ့ ညီမျှတဲ့ လုပ်ဆောင်ချက် တစ်ခုကို ထောက်ပံ့ပေးပြီး — အဲဒါကိုလည်း သုံးနိုင်ပါတယ်။ `src/include/utils/probes.h` ထဲက macros တွေရဲ့ definitions (သတ်မှတ်ချက်များ) ကို ပြောင်းလဲခြင်းအားဖြင့် — တခြား dynamic tracing utilities တွေကို ထောက်ပံ့တာကလည်း သီအိုရီအရ ဖြစ်နိုင်ပါတယ်။

### 27.5.1. Compiling for Dynamic Tracing (Dynamic tracing အတွက် compile ပြုလုပ်ခြင်း)

Default အနေနဲ့ probes တွေ မရနိုင်တာမို့ — PostgreSQL မှာ probes တွေ ရရှိနိုင်အောင် — configure script ကို ကိုယ်တိုင် ရှင်းလင်းစွာ ပြောပြဖို့ လိုအပ်ပါတယ်။ DTrace support ထည့်သွင်းဖို့ဆိုရင် — configure မှာ `--enable-dtrace` ကို သတ်မှတ်ပါ။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 17.3.3.6](https://www.postgresql.org/docs/current/install-make.html#CONFIGURE-OPTIONS-DEVEL) ကို ကြည့်ပါ။

### 27.5.2. Built-in Probes (ထည့်သွင်းပြီးသား probes များ)

Standard probes တွေ အများအပြားကို source code ထဲမှာ ထောက်ပံ့ထားပြီး — [ဇယား 27.49](https://www.postgresql.org/docs/current/dynamic-trace.html#DTRACE-PROBE-POINT-TABLE) မှာ ပြထားပါတယ်; probes တွေမှာ သုံးတဲ့ types တွေကို [ဇယား 27.50](https://www.postgresql.org/docs/current/dynamic-trace.html#TYPEDEFS-TABLE) မှာ ပြထားပါတယ်။ PostgreSQL ရဲ့ observability (စောင့်ကြည့် လေ့လာနိုင်မှု) ကို မြှင့်တင်ဖို့ — probes တွေကို သေချာပေါက် ထပ်ထည့်နိုင်ပါတယ်။

**ဇယား 27.49. Built-in DTrace Probes (ထည့်သွင်းပြီးသား DTrace probes များ)**

| Name | Parameters | ဖော်ပြချက် |
| --- | --- | --- |
| `transaction-start` | `(LocalTransactionId)` | Transaction အသစ် တစ်ခု စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က transaction ID ဖြစ်ပါတယ်။ |
| `transaction-commit` | `(LocalTransactionId)` | Transaction တစ်ခု အောင်မြင်စွာ ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က transaction ID ဖြစ်ပါတယ်။ |
| `transaction-abort` | `(LocalTransactionId)` | Transaction တစ်ခု မအောင်မြင်ဘဲ ပြီးဆုံးတဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က transaction ID ဖြစ်ပါတယ်။ |
| `query-start` | `(const char *)` | Query တစ်ခုရဲ့ လုပ်ဆောင်မှု စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က query string ဖြစ်ပါတယ်။ |
| `query-done` | `(const char *)` | Query တစ်ခုရဲ့ လုပ်ဆောင်မှု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က query string ဖြစ်ပါတယ်။ |
| `query-parse-start` | `(const char *)` | Query တစ်ခုရဲ့ parsing (parse ပြုလုပ်ခြင်း) စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က query string ဖြစ်ပါတယ်။ |
| `query-parse-done` | `(const char *)` | Query တစ်ခုရဲ့ parsing ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က query string ဖြစ်ပါတယ်။ |
| `query-rewrite-start` | `(const char *)` | Query တစ်ခုရဲ့ rewriting (ပြန်လည် ရေးသားခြင်း) စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က query string ဖြစ်ပါတယ်။ |
| `query-rewrite-done` | `(const char *)` | Query တစ်ခုရဲ့ rewriting ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က query string ဖြစ်ပါတယ်။ |
| `query-plan-start` | `()` | Query တစ်ခုရဲ့ planning (plan ရေးဆွဲခြင်း) စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `query-plan-done` | `()` | Query တစ်ခုရဲ့ planning ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `query-execute-start` | `()` | Query တစ်ခုရဲ့ execution (လုပ်ဆောင်မှု) စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `query-execute-done` | `()` | Query တစ်ခုရဲ့ execution ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `statement-status` | `(const char *)` | Server process က သူ့ရဲ့ `pg_stat_activity`.`status` ကို update (ပြင်ဆင် သတ်မှတ်) လုပ်တိုင်း fire ဖြစ်တဲ့ probe။ arg0 က status string အသစ် ဖြစ်ပါတယ်။ |
| `checkpoint-start` | `(int)` | Checkpoint တစ်ခု စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 မှာ — shutdown, immediate ဒါမှမဟုတ် force လို checkpoint type အမျိုးမျိုးကို ခွဲခြားဖို့ သုံးတဲ့ — bitwise flags တွေ ပါဝင်ပါတယ်။ |
| `checkpoint-done` | `(int, int, int, int, int)` | Checkpoint တစ်ခု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ (နောက်မှာ စာရင်းပြုထားတဲ့ probes တွေက checkpoint လုပ်ဆောင်နေစဉ် အစဉ်လိုက် fire ဖြစ်ပါတယ်။) arg0 က ရေးသားခဲ့တဲ့ buffers အရေအတွက် ဖြစ်ပါတယ်။ arg1 က buffers စုစုပေါင်း အရေအတွက် ဖြစ်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — အသီးသီး ထပ်ထည့်ခဲ့တဲ့ (added), ဖယ်ရှားခဲ့တဲ့ (removed) နဲ့ ပြန်လည် သုံးစွဲခဲ့တဲ့ (recycled) — WAL files အရေအတွက်တွေ ပါဝင်ပါတယ်။ |
| `clog-checkpoint-start` | `(bool)` | Checkpoint ရဲ့ CLOG အပိုင်း စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ ပုံမှန် checkpoint ဖြစ်ရင် arg0 က true — shutdown checkpoint ဖြစ်ရင် false ဖြစ်ပါတယ်။ |
| `clog-checkpoint-done` | `(bool)` | Checkpoint ရဲ့ CLOG အပိုင်း ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က `clog-checkpoint-start` မှာလိုပဲ အဓိပ္ပာယ် တူညီပါတယ်။ |
| `subtrans-checkpoint-start` | `(bool)` | Checkpoint ရဲ့ SUBTRANS အပိုင်း စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ ပုံမှန် checkpoint ဖြစ်ရင် arg0 က true — shutdown checkpoint ဖြစ်ရင် false ဖြစ်ပါတယ်။ |
| `subtrans-checkpoint-done` | `(bool)` | Checkpoint ရဲ့ SUBTRANS အပိုင်း ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က `subtrans-checkpoint-start` မှာလိုပဲ အဓိပ္ပာယ် တူညီပါတယ်။ |
| `multixact-checkpoint-start` | `(bool)` | Checkpoint ရဲ့ MultiXact အပိုင်း စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ ပုံမှန် checkpoint ဖြစ်ရင် arg0 က true — shutdown checkpoint ဖြစ်ရင် false ဖြစ်ပါတယ်။ |
| `multixact-checkpoint-done` | `(bool)` | Checkpoint ရဲ့ MultiXact အပိုင်း ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က `multixact-checkpoint-start` မှာလိုပဲ အဓိပ္ပာယ် တူညီပါတယ်။ |
| `buffer-checkpoint-start` | `(int)` | Checkpoint ရဲ့ buffer ရေးသားခြင်း အပိုင်း စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 မှာ — shutdown, immediate ဒါမှမဟုတ် force လို checkpoint type အမျိုးမျိုးကို ခွဲခြားဖို့ သုံးတဲ့ — bitwise flags တွေ ပါဝင်ပါတယ်။ |
| `buffer-sync-start` | `(int, int)` | Checkpoint အတွင်း — ဘယ် buffers တွေ ရေးသားရမယ်ဆိုတာ ဖော်ထုတ်ပြီးနောက် — dirty buffers တွေကို စတင် ရေးသားတဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က buffers စုစုပေါင်း အရေအတွက် ဖြစ်ပါတယ်။ arg1 က လောလောဆယ် dirty ဖြစ်နေပြီး ရေးသားဖို့ လိုအပ်နေတဲ့ အရေအတွက် ဖြစ်ပါတယ်။ |
| `buffer-sync-written` | `(int)` | Checkpoint အတွင်း buffer တစ်ခုချင်းစီ ရေးသားပြီးတိုင်း fire ဖြစ်တဲ့ probe။ arg0 က buffer ရဲ့ ID နံပါတ် ဖြစ်ပါတယ်။ |
| `buffer-sync-done` | `(int, int, int)` | Dirty buffers တွေ အားလုံး ရေးသားပြီးတဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က buffers စုစုပေါင်း အရေအတွက် ဖြစ်ပါတယ်။ arg1 က checkpoint process က တကယ် ရေးသားခဲ့တဲ့ buffers အရေအတွက် ဖြစ်ပါတယ်။ arg2 က ရေးသားဖို့ မျှော်လင့်ထားခဲ့တဲ့ အရေအတွက် (`buffer-sync-start` ရဲ့ arg1) ဖြစ်ပြီး — ကွာခြားမှု ရှိရင် အဲဒါက checkpoint အတွင်း တခြား processes တွေကပါ buffers တွေကို flush (ထုတ်ပစ်) လုပ်နေတာကို ထင်ဟပ်ပါတယ်။ |
| `buffer-checkpoint-sync-start` | `()` | Dirty buffers တွေကို kernel ဆီ ရေးသားပြီးနောက် — fsync requests တွေ စတင် ထုတ်ပေးခြင်း မပြုမီ — fire ဖြစ်တဲ့ probe။ |
| `buffer-checkpoint-done` | `()` | Buffers တွေကို disk ဆီ sync (ထပ်တူကျအောင် ရေးသား) လုပ်ခြင်း ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `twophase-checkpoint-start` | `()` | Checkpoint ရဲ့ two-phase အပိုင်း စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `twophase-checkpoint-done` | `()` | Checkpoint ရဲ့ two-phase အပိုင်း ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `buffer-extend-start` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int, unsigned int)` | Relation တစ်ခုရဲ့ extension (တိုးချဲ့ခြင်း) စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 မှာ တိုးချဲ့ရမယ့် fork ပါဝင်ပါတယ်။ arg1, arg2 နဲ့ arg3 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg4 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ arg5 က caller က တိုးချဲ့ချင်တဲ့ blocks အရေအတွက် ဖြစ်ပါတယ်။ |
| `buffer-extend-done` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int, unsigned int, BlockNumber)` | Relation တစ်ခုရဲ့ extension ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 မှာ တိုးချဲ့လိုက်တဲ့ fork ပါဝင်ပါတယ်။ arg1, arg2 နဲ့ arg3 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg4 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ arg5 က relation ကို တိုးချဲ့လိုက်တဲ့ blocks အရေအတွက် ဖြစ်ပြီး — resource (ရင်းမြစ်) ကန့်သတ်ချက်တွေကြောင့် — `buffer-extend-start` ထဲက အရေအတွက်ထက် နည်းနိုင်ပါတယ်။ arg6 မှာ ပထမဆုံး block အသစ်ရဲ့ BlockNumber ပါဝင်ပါတယ်။ |
| `buffer-read-start` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int)` | Buffer read (ဖတ်ခြင်း) တစ်ခု စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg5 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ |
| `buffer-read-done` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int, bool)` | Buffer read တစ်ခု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg5 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ arg6 က buffer ကို pool ထဲမှာ တွေ့ခဲ့ရင် true — မတွေ့ခဲ့ရင် false ဖြစ်ပါတယ်။ |
| `buffer-flush-start` | `(ForkNumber, BlockNumber, Oid, Oid, Oid)` | Shared buffer တစ်ခုအတွက် write request (ရေးသားရန် တောင်းဆိုချက်) တစ်ခုခု မထုတ်ပေးခင် fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ |
| `buffer-flush-done` | `(ForkNumber, BlockNumber, Oid, Oid, Oid)` | Write request တစ်ခု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ (ဒါက — data တွေကို kernel ဆီ ပေးပို့ဖို့ ကြာတဲ့ အချိန်ကိုပဲ ထင်ဟပ်တာ ဖြစ်ပြီး — ပုံမှန်အားဖြင့် တကယ်ကို disk ပေါ် ရေးသားပြီးသား မဟုတ်သေးပါဘူးဆိုတာ သတိပြုပါ။) Arguments တွေက `buffer-flush-start` မှာလိုပဲ အတူတူပဲ ဖြစ်ပါတယ်။ |
| `wal-buffer-write-dirty-start` | `()` | WAL buffer နေရာ မကျန်တော့လို့ — server process တစ်ခုက dirty WAL buffer တစ်ခုကို စတင် ရေးသားတဲ့အခါ fire ဖြစ်တဲ့ probe။ (ဒါ မကြာခဏ ဖြစ်နေရင် — [wal_buffers](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-BUFFERS) က သိပ်ငယ်နေတာကို ညွှန်ပြပါတယ်။) |
| `wal-buffer-write-dirty-done` | `()` | Dirty WAL buffer တစ်ခုရဲ့ ရေးသားမှု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `wal-insert` | `(unsigned char, unsigned char)` | WAL record တစ်ခု ထည့်သွင်းတဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က record အတွက် resource manager (rmid) ဖြစ်ပါတယ်။ arg1 မှာ info flags တွေ ပါဝင်ပါတယ်။ |
| `wal-switch` | `()` | WAL segment switch (ပြောင်းလဲမှု) တစ်ခု တောင်းဆိုခံရတဲ့အခါ fire ဖြစ်တဲ့ probe။ |
| `smgr-md-read-start` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int)` | Relation တစ်ခုကနေ block တစ်ခုကို စတင် ဖတ်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg5 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ |
| `smgr-md-read-done` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int, int, int)` | Block read တစ်ခု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg5 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ arg6 က တကယ် ဖတ်လိုက်တဲ့ bytes အရေအတွက် ဖြစ်ပြီး — arg7 က တောင်းဆိုထားတဲ့ အရေအတွက် ဖြစ်ပါတယ် (ဒီနှစ်ခု ကွာခြားနေရင် short read (တစ်စိတ်တစ်ပိုင်းသာ ဖတ်နိုင်ခြင်း) တစ်ခု ဖြစ်တာကို ညွှန်ပြပါတယ်)။ |
| `smgr-md-write-start` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int)` | Relation တစ်ခုဆီ block တစ်ခုကို စတင် ရေးသားတဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg5 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ |
| `smgr-md-write-done` | `(ForkNumber, BlockNumber, Oid, Oid, Oid, int, int, int)` | Block write တစ်ခု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 နဲ့ arg1 တွေမှာ page ရဲ့ fork နဲ့ block နံပါတ်တွေ ပါဝင်ပါတယ်။ arg2, arg3 နဲ့ arg4 တွေမှာ — relation ကို ဖော်ထုတ်တဲ့ — tablespace, database နဲ့ relation OIDs တွေ ပါဝင်ပါတယ်။ arg5 က — local buffer တစ်ခုအတွက် temporary relation ကို ဖန်တီးခဲ့တဲ့ backend ရဲ့ ID ဖြစ်ပြီး — shared buffer တစ်ခုအတွက်ဆိုရင် `INVALID_PROC_NUMBER` (-1) ဖြစ်ပါတယ်။ arg6 က တကယ် ရေးသားလိုက်တဲ့ bytes အရေအတွက် ဖြစ်ပြီး — arg7 က တောင်းဆိုထားတဲ့ အရေအတွက် ဖြစ်ပါတယ် (ဒီနှစ်ခု ကွာခြားနေရင် short write (တစ်စိတ်တစ်ပိုင်းသာ ရေးသားနိုင်ခြင်း) တစ်ခု ဖြစ်တာကို ညွှန်ပြပါတယ်)။ |
| `sort-start` | `(int, bool, int, int, bool, int)` | Sort (စီစဉ်မှု) လုပ်ဆောင်ချက် တစ်ခု စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က heap, index ဒါမှမဟုတ် datum sort ကို ညွှန်ပြပါတယ်။ arg1 က unique-value enforcement (တန်ဖိုး ထပ်မဖြစ်စေရေး အတည်ပြုမှု) အတွက်ဆိုရင် true ဖြစ်ပါတယ်။ arg2 က key columns အရေအတွက် ဖြစ်ပါတယ်။ arg3 က ခွင့်ပြုထားတဲ့ work memory (လုပ်ငန်းသုံး မှတ်ဉာဏ်) ရဲ့ kilobytes အရေအတွက် ဖြစ်ပါတယ်။ arg4 က sort ရလဒ်ကို random access (ကျပန်း ဝင်ရောက်မှု) လုပ်ဖို့ လိုအပ်ရင် true ဖြစ်ပါတယ်။ arg5 က `0` ဆိုရင် serial — `1` ဆိုရင် parallel worker — `2` ဆိုရင် parallel leader ဖြစ်တာကို ညွှန်ပြပါတယ်။ |
| `sort-done` | `(bool, long)` | Sort တစ်ခု ပြီးမြောက်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က external sort ဆိုရင် true — internal sort ဆိုရင် false ဖြစ်ပါတယ်။ arg1 က external sort တစ်ခုအတွက် သုံးခဲ့တဲ့ disk blocks အရေအတွက် — ဒါမှမဟုတ် internal sort တစ်ခုအတွက် သုံးခဲ့တဲ့ memory ရဲ့ kilobytes အရေအတွက် — ဖြစ်ပါတယ်။ |
| `lwlock-acquire` | `(char *, LWLockMode)` | LWLock တစ်ခုကို ရယူပြီးတဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က LWLock ရဲ့ tranche (အပိုင်း) ဖြစ်ပါတယ်။ arg1 က တောင်းဆိုထားတဲ့ lock mode — exclusive (သီးသန့်) ဒါမှမဟုတ် shared (မျှဝေသုံး) — ဖြစ်ပါတယ်။ |
| `lwlock-release` | `(char *)` | LWLock တစ်ခုကို လွှတ်ပေးပြီးတဲ့အခါ fire ဖြစ်တဲ့ probe (ဒါပေမယ့် — လွှတ်ပေးလိုက်လို့ နိုးထကြတဲ့ waiters တွေကို နိုးထစေပြီးသား မဟုတ်သေးတာ သတိပြုပါ)။ arg0 က LWLock ရဲ့ tranche ဖြစ်ပါတယ်။ |
| `lwlock-wait-start` | `(char *, LWLockMode)` | LWLock တစ်ခုက ချက်ချင်း မရနိုင်တာကြောင့် — server process တစ်ခုက lock ရရှိနိုင်ဖို့ စောင့်ဆိုင်းမှု စတင်တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က LWLock ရဲ့ tranche ဖြစ်ပါတယ်။ arg1 က တောင်းဆိုထားတဲ့ lock mode — exclusive ဒါမှမဟုတ် shared — ဖြစ်ပါတယ်။ |
| `lwlock-wait-done` | `(char *, LWLockMode)` | Server process တစ်ခုက LWLock တစ်ခုအတွက် သူ့ရဲ့ စောင့်ဆိုင်းမှုကနေ လွတ်မြောက်သွားတဲ့အခါ fire ဖြစ်တဲ့ probe (တကယ်တော့ lock ကို မရရှိသေးပါဘူး)။ arg0 က LWLock ရဲ့ tranche ဖြစ်ပါတယ်။ arg1 က တောင်းဆိုထားတဲ့ lock mode — exclusive ဒါမှမဟုတ် shared — ဖြစ်ပါတယ်။ |
| `lwlock-condacquire` | `(char *, LWLockMode)` | Caller က စောင့်ဆိုင်းမှု မလုပ်ဘူးလို့ သတ်မှတ်ထားချိန်မှာ — LWLock တစ်ခုကို အောင်မြင်စွာ ရယူနိုင်ခဲ့တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က LWLock ရဲ့ tranche ဖြစ်ပါတယ်။ arg1 က တောင်းဆိုထားတဲ့ lock mode — exclusive ဒါမှမဟုတ် shared — ဖြစ်ပါတယ်။ |
| `lwlock-condacquire-fail` | `(char *, LWLockMode)` | Caller က စောင့်ဆိုင်းမှု မလုပ်ဘူးလို့ သတ်မှတ်ထားချိန်မှာ — LWLock တစ်ခုကို အောင်မြင်စွာ မရယူနိုင်ခဲ့တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 က LWLock ရဲ့ tranche ဖြစ်ပါတယ်။ arg1 က တောင်းဆိုထားတဲ့ lock mode — exclusive ဒါမှမဟုတ် shared — ဖြစ်ပါတယ်။ |
| `lock-wait-start` | `(unsigned int, unsigned int, unsigned int, unsigned int, unsigned int, LOCKMODE)` | Heavyweight lock (lmgr lock — လေးလံသော အဆင့် lock) တစ်ခုအတွက် တောင်းဆိုချက်က — lock မရနိုင်လို့ — စောင့်ဆိုင်းမှု စတင်ခဲ့တဲ့အခါ fire ဖြစ်တဲ့ probe။ arg0 ကနေ arg3 အထိက — lock လုပ်ထားတဲ့ object ကို ဖော်ထုတ်တဲ့ — tag fields တွေ ဖြစ်ပါတယ်။ arg4 က lock လုပ်ထားတဲ့ object ရဲ့ type ကို ညွှန်ပြပါတယ်။ arg5 က တောင်းဆိုနေတဲ့ lock type ကို ညွှန်ပြပါတယ်။ |
| `lock-wait-done` | `(unsigned int, unsigned int, unsigned int, unsigned int, unsigned int, LOCKMODE)` | Heavyweight lock (lmgr lock) တစ်ခုအတွက် တောင်းဆိုချက်တစ်ခုရဲ့ စောင့်ဆိုင်းမှု ပြီးဆုံးသွားတဲ့အခါ (ဆိုလိုတာက — lock ကို ရယူလိုက်ပြီ) fire ဖြစ်တဲ့ probe။ Arguments တွေက `lock-wait-start` မှာလိုပဲ အတူတူပဲ ဖြစ်ပါတယ်။ |
| `deadlock-found` | `()` | Deadlock detector (deadlock ရှာဖွေ စစ်ဆေးသူ) က deadlock တစ်ခုကို တွေ့ရှိတဲ့အခါ fire ဖြစ်တဲ့ probe။ |

**ဇယား 27.50. Defined Types Used in Probe Parameters (Probe parameters များတွင် သုံးသည့် type definitions များ)**

| Type | Definition |
| --- | --- |
| `LocalTransactionId` | `unsigned int` |
| `LWLockMode` | `int` |
| `LOCKMODE` | `int` |
| `BlockNumber` | `unsigned int` |
| `Oid` | `unsigned int` |
| `ForkNumber` | `int` |
| `bool` | `unsigned char` |

### 27.5.3. Using Probes (Probes များကို အသုံးပြုခြင်း)

အောက်က ဥပမာက — performance test (စွမ်းဆောင်ရည် စမ်းသပ်မှု) တစ်ခုရဲ့ ရှေ့နဲ့ နောက်မှာ `pg_stat_database` ကို snapshot (ပုံရိပ် ဖမ်းယူ) လုပ်တာရဲ့ အစားထိုး တစ်ခုအနေနဲ့ — system ထဲက transaction counts တွေကို ခွဲခြမ်း စိတ်ဖြာဖို့ DTrace script တစ်ခုကို ပြသပါတယ်:

```sql
#!/usr/sbin/dtrace -qs

postgresql$1:::transaction-start
{
      @start["Start"] = count();
      self->ts  = timestamp;
}

postgresql$1:::transaction-abort
{
      @abort["Abort"] = count();
}

postgresql$1:::transaction-commit
/self->ts/
{
      @commit["Commit"] = count();
      @time["Total time (ns)"] = sum(timestamp - self->ts);
      self->ts=0;
}
```

Run လုပ်တဲ့အခါ — ဒီဥပမာ D script က အောက်ပါအတိုင်း output ထုတ်ပေးပါတယ်:

```sql
# ./txn_count.d `pgrep -n postgres` or ./txn_count.d <PID>
^C

Start                                          71
Commit                                         70
Total time (ns)                        2312105013
```

> **မှတ်ချက်:** SystemTap က trace scripts တွေအတွက် — DTrace သုံးတာနဲ့ မတူတဲ့ notation (သင်္ကေတ စနစ်) တစ်ခုကို သုံးပါတယ် — အောက်ခံ trace points တွေက compatible (လိုက်ဖက်ညီ) ဖြစ်ပေမယ့်လည်း။ သတိပြုသင့်တဲ့ အချက် တစ်ခုကတော့ — ဒီစာရေးနေတဲ့ အချိန်မှာ — SystemTap scripts တွေက probe names တွေကို hyphens တွေရဲ့ နေရာမှာ double underscores (အောက်မျဉ်း နှစ်ခု) တွေ သုံးပြီး ရည်ညွှန်း ဖော်ပြရပါတယ်။ ဒါကို အနာဂတ် SystemTap releases တွေမှာ ပြင်ဆင်ပေးဖို့ မျှော်လင့်ထားပါတယ်။

DTrace scripts တွေကို — ဂရုတစိုက် ရေးသားပြီး debug (အမှား ရှာဖွေ ပြုပြင်) လုပ်ဖို့ လိုအပ်တာ သတိရပါ — မဟုတ်ရင် စုဆောင်းမိတဲ့ trace information တွေက အဓိပ္ပာယ် မရှိတာတွေ ဖြစ်သွားနိုင်ပါတယ်။ ပြဿနာတွေ တွေ့ရတဲ့ ကိစ္စ အများစုမှာ — အပြစ်က အောက်ခံ system ပေါ်မှာ မဟုတ်ဘဲ — instrumentation (ထည့်သွင်းထားတဲ့ တိုင်းတာမှု စနစ်) ပေါ်မှာပဲ ရှိတတ်ပါတယ်။ Dynamic tracing သုံးပြီး တွေ့ရှိတဲ့ အချက်အလက်တွေကို ဆွေးနွေးတဲ့အခါ — သုံးခဲ့တဲ့ script ကိုပါ တွဲ ထည့်ဖော်ပြဖို့ သေချာ လုပ်ပါ — အဲဒါဆိုရင် အဲဒါကိုပါ စစ်ဆေး ဆွေးနွေးနိုင်မှာ ဖြစ်ပါတယ်။

### 27.5.4. Defining New Probes (Probe အသစ်များ သတ်မှတ်ခြင်း)

Probe အသစ်တွေကို — developer က လိုချင်တဲ့ code ထဲက နေရာတွေမှာ သတ်မှတ်နိုင်ပါတယ် — ဒါပေမယ့် ဒါက recompilation (ပြန်လည် compile ပြုလုပ်ခြင်း) တစ်ခု လိုအပ်ပါလိမ့်မယ်။ Probe အသစ်တွေ ထည့်သွင်းဖို့ အဆင့်တွေက အောက်မှာ ဖော်ပြထားပါတယ်:

1. Probe names တွေနဲ့ — probes တွေကနေတစ်ဆင့် ရရှိနိုင်စေချင်တဲ့ data တွေကို ဆုံးဖြတ်ပါ
2. Probe definitions တွေကို src/backend/utils/probes.d ထဲကို ထည့်ပါ
3. Probe points တွေ ပါဝင်တဲ့ module(s) တွေထဲမှာ pg_trace.h မပါသေးရင် ထည့်သွင်းပြီး — source code ထဲက လိုချင်တဲ့ နေရာတွေမှာ TRACE_POSTGRESQL probe macros တွေကို ထည့်သွင်းပါ
4. ပြန်လည် compile လုပ်ပြီး — probe အသစ်တွေ ရရှိနိုင်ကြောင်း စစ်ဆေးပါ

**ဥပမာ:** ဒီမှာ ဖော်ပြမှာက — transaction ID အလိုက် transaction အသစ်တွေ အားလုံးကို ခြေရာခံဖို့ probe တစ်ခု ထည့်သွင်းနည်း ဥပမာ ဖြစ်ပါတယ်။

1. Probe ကို transaction-start လို့ နာမည်ပေးပြီး — LocalTransactionId type ရဲ့ parameter တစ်ခု လိုအပ်မယ်လို့ ဆုံးဖြတ်ပါ
2. Probe definition ကို src/backend/utils/probes.d ထဲကို ထည့်ပါ:
  
  probe transaction__start(LocalTransactionId);
  
  Probe name ထဲမှာ double underline (အောက်မျဉ်း နှစ်ခု) သုံးထားတာကို သတိပြုပါ။ Probe ကို သုံးတဲ့ DTrace script တစ်ခုထဲမှာ — double underline ကို hyphen တစ်ခုနဲ့ အစားထိုးဖို့ လိုအပ်တာမို့ — users တွေအတွက် မှတ်တမ်းတင်ဖို့ နာမည်က transaction-start ပဲ ဖြစ်ပါတယ်။
3. Compile လုပ်ချိန်မှာ — transaction__start ကို TRACE_POSTGRESQL_TRANSACTION_START လို့ ခေါ်တဲ့ macro တစ်ခုအဖြစ် ပြောင်းလဲပေးပါတယ် (ဒီမှာ underscores တွေက single — တစ်ခုတည်း — ဆိုတာ သတိပြုပါ) — ၎င်းကို pg_trace.h ကို ထည့်သွင်းခြင်းအားဖြင့် ရရှိနိုင်ပါတယ်။ Macro call ကို source code ထဲက သင့်လျော်တဲ့ နေရာမှာ ထည့်ပါ။ ဒီကိစ္စမှာဆိုရင် — အောက်ပါအတိုင်း ဖြစ်ပါတယ်:
  
  TRACE_POSTGRESQL_TRANSACTION_START(vxid.localTransactionId);
4. Binary အသစ်ကို ပြန်လည် compile လုပ်ပြီး run လုပ်ပြီးနောက် — အောက်ပါ DTrace command ကို run လုပ်ခြင်းအားဖြင့် — သင် ထပ်ထည့်လိုက်တဲ့ probe ရရှိနိုင်ကြောင်း စစ်ဆေးပါ။ အောက်ပါအတိုင်း ဆင်တူတဲ့ output ကို မြင်ရပါလိမ့်မယ်:
  
  # dtrace -ln transaction-start
     ID    PROVIDER          MODULE           FUNCTION NAME
  18705 postgresql49878     postgres     StartTransactionCommand transaction-start
  18755 postgresql49877     postgres     StartTransactionCommand transaction-start
  18805 postgresql49876     postgres     StartTransactionCommand transaction-start
  18855 postgresql49875     postgres     StartTransactionCommand transaction-start
  18986 postgresql49873     postgres     StartTransactionCommand transaction-start

C code ထဲမှာ trace macros တွေ ထည့်သွင်းတဲ့အခါ သတိထားရမယ့် အချက် အနည်းငယ် ရှိပါတယ်:

- Probe တစ်ခုရဲ့ parameters တွေအတွက် သတ်မှတ်ထားတဲ့ data types တွေက — macro ထဲမှာ သုံးထားတဲ့ variables တွေရဲ့ data types တွေနဲ့ ကိုက်ညီဖို့ ဂရုစိုက်ပါ။ မဟုတ်ရင် — compilation errors (compile အမှားများ) တွေ ရပါလိမ့်မယ်။
- Platform အများစုမှာ — PostgreSQL ကို --enable-dtrace နဲ့ တည်ဆောက်ထားရင် — tracing လုပ်နေတာ မရှိရင်တောင် — control က macro ကို ဖြတ်သွားတိုင်း — trace macro တစ်ခုရဲ့ arguments တွေကို evaluate (တန်ဖိုး သတ်မှတ်) လုပ်ပါလိမ့်မယ်။ Local variables အနည်းငယ်ရဲ့ တန်ဖိုးတွေကိုပဲ အစီရင်ခံနေတယ်ဆိုရင် — ဒါက များသောအားဖြင့် စိုးရိမ်စရာ မလိုပါဘူး။ ဒါပေမယ့် — arguments တွေထဲမှာ စရိတ်ကြီးတဲ့ function calls တွေ ထည့်တာကိုတော့ သတိထားပါ။ အဲဒီလို လုပ်ဖို့ လိုအပ်ရင် — trace တကယ် enable (ဖွင့်) ထားလား စစ်ဆေးတဲ့ check တစ်ခုနဲ့ macro ကို ကာကွယ် (protect) လုပ်ဖို့ စဉ်းစားပါ:
  
  if (TRACE_POSTGRESQL_TRANSACTION_START_ENABLED())
      TRACE_POSTGRESQL_TRANSACTION_START(some_function(...));
  
  Trace macro တစ်ခုချင်းစီတိုင်းမှာ — သက်ဆိုင်တဲ့ ENABLED macro တစ်ခု ရှိပါတယ်။
