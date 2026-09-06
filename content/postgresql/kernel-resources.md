---
title: "Managing Kernel Resources (kernel resources များကို စီမံခန့်ခွဲခြင်း)"
description: "PostgreSQL server အတွက် kernel resources များ စီမံခန့်ခွဲခြင်း — System V/POSIX shared memory နှင့် semaphores (SHMMAX, SEMMNS စသည့် kernel parameters များ၊ platform အလိုက် sysctl ဆက်တင်များ) ၊ systemd RemoveIPC ၊ resource limits (ulimit, maxproc, openfiles, datasize) ၊ Linux memory overcommit (OOM killer ကို ရှောင်ရှားခြင်း) နှင့် Linux huge pages အကြောင်း ရှင်းလင်းချက်"
order: 143
source: "https://www.postgresql.org/docs/current/kernel-resources.html"
status: translated
updated: 2026-09-06
---

## 18.4. Managing Kernel Resources (kernel resources — kernel အရင်းအမြစ်များ — ကို စီမံခန့်ခွဲခြင်း)

- **18.4.1. Shared Memory and Semaphores (shared memory — မျှဝေထားသော memory — နဲ့ semaphores — အချက်ပြ ကောင်တာများ)**
- **18.4.2. systemd RemoveIPC (systemd ရဲ့ RemoveIPC ဆက်တင်)**
- **18.4.3. Resource Limits (resource limits — အရင်းအမြစ် ကန့်သတ်ချက်များ)**
- **18.4.4. Linux Memory Overcommit (Linux memory overcommit — memory ကတိပေးချက်ထက် ကျော်လွန် ခွင့်ပြုခြင်း)**
- **18.4.5. Linux Huge Pages (Linux huge pages — ကြီးမားသော memory page များ)**

PostgreSQL က — အထူးသဖြင့် server မိတ္တူပေါင်းများစွာ (multiple copies) ကို system တစ်ခုတည်းပေါ်မှာ run လုပ်နေတဲ့အခါ ဒါမှမဟုတ် — အလွန် ကြီးမားတဲ့ တပ်ဆင်မှုတွေမှာဆိုရင် — operating system ရဲ့ resource limits (အရင်းအမြစ် ကန့်သတ်ချက်များ) အမျိုးမျိုးကို တစ်ခါတရံ ကုန်ဆုံးစေနိုင်ပါတယ်။ ဒီ section က — PostgreSQL အသုံးပြုတဲ့ kernel resources တွေနဲ့ — kernel resource သုံးစွဲမှုနဲ့ ဆက်စပ်တဲ့ ပြဿနာတွေကို ဖြေရှင်းဖို့ သင်လုပ်ဆောင်နိုင်တဲ့ အဆင့်တွေကို ရှင်းပြပါတယ်။

### 18.4.1. Shared Memory and Semaphores (shared memory — မျှဝေထားသော memory — နှင့် semaphores — အချက်ပြ ကောင်တာများ)

PostgreSQL က operating system အနေနဲ့ inter-process communication (IPC — process များကြား အပြန်အလှန် ဆက်သွယ်ရေး) feature များ — အထူးသဖြင့် shared memory (မျှဝေ အသုံးပြုသော memory) နဲ့ semaphores (process များကို ထပ်တူပြု ညှိနှိုင်းပေးသော အချက်ပြ ကောင်တာများ) — ကို ထောက်ပံ့ပေးဖို့ လိုအပ်ပါတယ်။ Unix ကနေ ဆင်းသက်လာတဲ့ system တွေက ပုံမှန်အားဖြင့် “System V” IPC ၊ “POSIX” IPC ဒါမှမဟုတ် — နှစ်မျိုးလုံးကို ထောက်ပံ့ပေးပါတယ်။ Windows မှာတော့ ဒီ feature တွေရဲ့ ကိုယ်ပိုင် implementation တစ်ခု ရှိပြီး — ဒီမှာ ဆွေးနွေးမှာ မဟုတ်ပါဘူး။

Default အနေနဲ့ PostgreSQL က System V shared memory ကို အလွန် နည်းတဲ့ ပမာဏ တစ်ခုသာ ခွဲဝေပေးပြီး — anonymous `mmap` shared memory ကိုတော့ ပိုကြီးမားတဲ့ ပမာဏ တစ်ခု ခွဲဝေပေးပါတယ်။ တနည်းအားဖြင့် — System V shared memory region ကြီး တစ်ခုတည်းကိုလည်း သုံးနိုင်ပါတယ် ([shared_memory_type](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-MEMORY-TYPE) ကို ကြည့်ပါ)။ ထို့အပြင် — System V ဒါမှမဟုတ် POSIX ပုံစံ ဖြစ်နိုင်တဲ့ — semaphore အများအပြားကိုလည်း server စတင်ချိန်မှာ ဖန်တီးပါတယ်။ လက်ရှိမှာ — Linux နဲ့ FreeBSD system တွေမှာ POSIX semaphores တွေကို သုံးပြီး — တခြား platform တွေမှာတော့ System V semaphores တွေကို သုံးပါတယ်။

System V IPC feature တွေကို ပုံမှန်အားဖြင့် system တစ်ခုလုံးဆိုင်ရာ ခွဲဝေမှု ကန့်သတ်ချက်တွေက ချုပ်ချယ်ထားပါတယ်။ PostgreSQL က ဒီ limits တွေထဲက တစ်ခုကို ကျော်လွန်တဲ့အခါ — server က စတင်ရန် ငြင်းဆန်ပြီး — ပြဿနာကို ဖော်ပြပြီး ဘာလုပ်ရမယ်ဆိုတာကို ညွှန်ပြတဲ့ — အသိပညာပေး error message တစ်ခုကို ချန်ထားခဲ့သင့်ပါတယ်။ ([အပိုင်း 18.3.1](/docs/postgresql/server-start) ကိုလည်း ကြည့်ပါ။) သက်ဆိုင်ရာ kernel parameters တွေကို system အမျိုးမျိုးမှာ တသမတ်တည်း နာမည် တပ်ထားပြီး — [ဇယား 18.1](/docs/postgresql/kernel-resources) က ခြုံငုံ သုံးသပ်ချက် ပေးထားပါတယ်။ ဒါပေမယ့် — ၎င်းတို့ကို သတ်မှတ်တဲ့ နည်းလမ်းတွေကတော့ ကွဲပြားပါတယ်။ Platform အချို့အတွက် အကြံပြုချက်တွေကို အောက်မှာ ပေးထားပါတယ်။

**ဇယား 18.1. System V IPC Parameters (System V IPC parameters များ)**

| Name | Description | Values needed to run one PostgreSQL instance |
| --- | --- | --- |
| `SHMMAX` | Shared memory segment တစ်ခု၏ အများဆုံး အရွယ်အစား (bytes) | အနည်းဆုံး 1kB — သို့သော် default သည် ပုံမှန်အားဖြင့် ထိုထက် အများကြီး မြင့်သည် |
| `SHMMIN` | Shared memory segment တစ်ခု၏ အနည်းဆုံး အရွယ်အစား (bytes) | 1 |
| `SHMALL` | ရရှိနိုင်သော shared memory စုစုပေါင်း ပမာဏ (bytes သို့မဟုတ် pages) | bytes ဖြစ်လျှင် `SHMMAX` နှင့် အတူတူ — pages ဖြစ်လျှင် `ceil(SHMMAX/PAGE_SIZE)` — အခြား applications များအတွက် နေရာ ထပ်ထည့်ပါ |
| `SHMSEG` | Process တစ်ခုလျှင် shared memory segments အများဆုံး အရေအတွက် | segment ၁ ခုသာ လိုအပ်သည် — သို့သော် default သည် အများကြီး ပိုမြင့်သည် |
| `SHMMNI` | System တစ်ခုလုံးရှိ shared memory segments အများဆုံး အရေအတွက် | `SHMSEG` ကဲ့သို့ — အခြား applications များအတွက် နေရာ ထပ်ထည့်ပါ |
| `SEMMNI` | Semaphore identifiers (ဆိုလိုသည်မှာ sets) အများဆုံး အရေအတွက် | အနည်းဆုံး `ceil(num_os_semaphores / 16)` — အခြား applications များအတွက် နေရာ ထပ်ထည့်ပါ |
| `SEMMNS` | System တစ်ခုလုံးရှိ semaphores အများဆုံး အရေအတွက် | `ceil(num_os_semaphores / 16) * 17` — အခြား applications များအတွက် နေရာ ထပ်ထည့်ပါ |
| `SEMMSL` | Set တစ်ခုလျှင် semaphores အများဆုံး အရေအတွက် | အနည်းဆုံး 17 |
| `SEMMAP` | Semaphore map ထဲရှိ entries အရေအတွက် | စာသားကို ကြည့်ပါ |
| `SEMVMX` | Semaphore တစ်ခု၏ အများဆုံး တန်ဖိုး | အနည်းဆုံး 1000 (Default သည် မကြာခဏ 32767 ဖြစ်သည်; မလိုအပ်ဘဲ မပြောင်းပါနှင့်) |

PostgreSQL က server မိတ္တူတစ်ခုစီအတွက် System V shared memory ရဲ့ bytes အနည်းငယ် (64-bit platform များတွင် ပုံမှန်အားဖြင့် 48 bytes) လိုအပ်ပါတယ်။ ခေတ်မီ operating system အများစုမှာ — ဒီပမာဏကို လွယ်ကူစွာ ခွဲဝေပေးနိုင်ပါတယ်။ ဒါပေမယ့် — server မိတ္တူ အများအပြား run နေတာ ဒါမှမဟုတ် — System V shared memory အများအပြား သုံးဖို့ server ကို အတိအကျ configure လုပ်ထားတာဆိုရင် ([shared_memory_type](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-MEMORY-TYPE) နဲ့ [dynamic_shared_memory_type](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-DYNAMIC-SHARED-MEMORY-TYPE) ကို ကြည့်ပါ) — system တစ်ခုလုံးရှိ System V shared memory စုစုပေါင်း ပမာဏ ဖြစ်တဲ့ `SHMALL` ကို တိုးပေးဖို့ လိုအပ်လာနိုင်ပါတယ်။ System အများအပြားမှာ `SHMALL` ကို bytes တွေနဲ့ မဟုတ်ဘဲ pages တွေနဲ့ တိုင်းတာတယ်ဆိုတာ သတိပြုပါ။

ပြဿနာ ဖြစ်စေနိုင်ခြေ ပိုနည်းတာကတော့ shared memory segments တွေရဲ့ အနည်းဆုံး အရွယ်အစား (`SHMMIN`) ဖြစ်ပြီး — PostgreSQL အတွက် အများဆုံး ခန့်မှန်းခြေ 32 bytes လောက်သာ ရှိသင့်ပါတယ် (ပုံမှန်အားဖြင့် 1 ပဲ ရှိပါတယ်)။ System တစ်ခုလုံးဆိုင်ရာ segments အများဆုံး အရေအတွက် (`SHMMNI`) ဒါမှမဟုတ် process တစ်ခုလျှင် (`SHMSEG`) တွေကတော့ — သင့် system မှာ ၎င်းတို့ကို zero လို့ သတ်မှတ်ထားရင်ကလွဲလို့ — ပြဿနာ ဖြစ်စေနိုင်ခြေ မရှိပါဘူး။

System V semaphores သုံးတဲ့အခါ — PostgreSQL က ခွင့်ပြုထားတဲ့ connection တစ်ခုစီ ([max_connections](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS))၊ ခွင့်ပြုထားတဲ့ autovacuum worker process တစ်ခုစီ ([autovacuum_worker_slots](https://www.postgresql.org/docs/current/runtime-config-vacuum.html#GUC-AUTOVACUUM-WORKER-SLOTS))၊ ခွင့်ပြုထားတဲ့ WAL sender process တစ်ခုစီ ([max_wal_senders](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS))၊ ခွင့်ပြုထားတဲ့ background process တစ်ခုစီ ([max_worker_processes](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-WORKER-PROCESSES)) စသည်တို့အတွက် — set တစ်ခုလျှင် ၁၆ ခုနှုန်းနဲ့ — semaphore တစ်ခုစီ သုံးပါတယ်။ Runtime မှာ တွက်ချက်ပေးတဲ့ parameter ဖြစ်တဲ့ [num_os_semaphores](https://www.postgresql.org/docs/current/runtime-config-preset.html#GUC-NUM-OS-SEMAPHORES) က လိုအပ်တဲ့ semaphores အရေအတွက်ကို အစီရင်ခံပါတယ်။ ဒီ parameter ကို — server မစတင်ခင်မှာ — ဒီလို `postgres` command တစ်ခုနဲ့ ကြည့်နိုင်ပါတယ်:

```
$ postgres -D $PGDATA -C num_os_semaphores
```

Semaphore ၁၆ ခု ပါတဲ့ set တစ်ခုစီမှာ — တခြား applications တွေ သုံးနေတဲ့ semaphore sets တွေနဲ့ ထိပ်တိုက် ဆုံမိမှု (collision) ကို ရှာဖွေဖို့ “magic number” (မှော်ဂဏန်း) တစ်ခု ပါဝင်တဲ့ — ၁၇ ခုမြောက် semaphore တစ်ခုလည်း ပါဝင်ပါလိမ့်မယ်။ System ထဲမှာ semaphores အများဆုံး အရေအတွက်ကို `SEMMNS` က သတ်မှတ်ပြီး — အကျိုးဆက်အနေနဲ့ ၎င်းက `num_os_semaphores` ထက် — လိုအပ်တဲ့ semaphore set ၁၆ ခု တစ်ခုစီအတွက် တစ်ခုစီ ပိုလျှံအောင် — အနည်းဆုံး မြင့်နေရပါမယ် ([ဇယား 18.1](/docs/postgresql/kernel-resources) ထဲက ဖော်မြူလာကို ကြည့်ပါ)။ `SEMMNI` parameter က — system ပေါ်မှာ တစ်ပြိုင်နက် တည်ရှိနိုင်တဲ့ semaphore sets အရေအတွက်ရဲ့ ကန့်သတ်ချက်ကို ဆုံးဖြတ်ပါတယ်။ ဒါကြောင့် ဒီ parameter က အနည်းဆုံး `ceil(num_os_semaphores / 16)` ဖြစ်ရပါမယ်။ ခွင့်ပြုထားတဲ့ connections အရေအတွက်ကို လျှော့ချတာက — `semget` function ကနေ လာတတ်ပြီး — ပုံမှန်အားဖြင့် “No space left on device” လို့ ရှုပ်ထွေးစွာ စကားလုံးတပ်ထားတတ်တဲ့ — failures တွေအတွက် ယာယီ ဖြေရှင်းနည်း တစ်ခု ဖြစ်ပါတယ်။

အချို့သော ကိစ္စများမှာ `SEMMAP` ကိုလည်း — `SEMMNS` ၏ အရွယ်အစား အနီးစပ်ဆုံး အနည်းဆုံး ရှိအောင် — တိုးပေးဖို့ လိုအပ်နိုင်ပါတယ်။ System မှာ ဒီ parameter ရှိရင် (အများစုမှာ မရှိပါဘူး) — ၎င်းက semaphore resource map ရဲ့ အရွယ်အစားကို သတ်မှတ်ပေးပြီး — map ထဲမှာ ရရှိနိုင်တဲ့ semaphores တွေရဲ့ ကပ်လျက် (contiguous) block တစ်ခုစီအတွက် entry တစ်ခု လိုအပ်ပါတယ်။ Semaphore set တစ်ခုကို လွှတ်ပေးလိုက်တဲ့အခါ — ၎င်းကို လွှတ်ပေးလိုက်တဲ့ block နဲ့ ကပ်လျက် ရှိတဲ့ ရှိပြီးသား entry တစ်ခုထဲကို ပေါင်းထည့်လိုက်တာ ဒါမှမဟုတ် — map entry အသစ်တစ်ခုအောက်မှာ မှတ်ပုံတင်လိုက်တာ ဖြစ်ပါတယ်။ Map ပြည့်နေရင် — လွှတ်ပေးလိုက်တဲ့ semaphores တွေ ဆုံးရှုံးသွားပါတယ် (reboot လုပ်သည့်အထိ)။ Semaphore နေရာရဲ့ fragmentation (အပိုင်းပိုင်း ကွဲအက်မှု) က အချိန်ကြာလာသည်နှင့်အမျှ — ရှိသင့်သည်ထက် ရရှိနိုင်တဲ့ semaphores တွေ နည်းပါးလာစေနိုင်ပါတယ်။

“Semaphore undo” နဲ့ ဆက်စပ်နေတဲ့ — `SEMMNU` နဲ့ `SEMUME` လို — အခြား ဆက်တင်မျိုးစုံကတော့ PostgreSQL ကို မထိခိုက်ပါဘူး။

POSIX semaphores သုံးတဲ့အခါ — လိုအပ်တဲ့ semaphores အရေအတွက်က System V အတွက် နဲ့ အတူတူပါပဲ — ဆိုလိုတာက ခွင့်ပြုထားတဲ့ connection တစ်ခုစီ ([max_connections](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS))၊ ခွင့်ပြုထားတဲ့ autovacuum worker process တစ်ခုစီ ([autovacuum_worker_slots](https://www.postgresql.org/docs/current/runtime-config-vacuum.html#GUC-AUTOVACUUM-WORKER-SLOTS))၊ ခွင့်ပြုထားတဲ့ WAL sender process တစ်ခုစီ ([max_wal_senders](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS))၊ ခွင့်ပြုထားတဲ့ background process တစ်ခုစီ ([max_worker_processes](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-WORKER-PROCESSES)) စသည်တို့အတွက် semaphore တစ်ခုနှုန်း ဖြစ်ပါတယ်။ ဒီ option ကို ဦးစားပေးသုံးတဲ့ platform တွေမှာ — POSIX semaphores အရေအတွက်အတွက် တိကျတဲ့ kernel limit ဆိုတာ မရှိပါဘူး။

- **FreeBSD** — Default shared memory ဆက်တင်တွေက ပုံမှန်အားဖြင့် လုံလောက်ပါတယ် — shared_memory_type ကို sysv လို့ သတ်မှတ်ထားရင်ကလွဲလို့ပါ။ System V semaphores တွေကို ဒီ platform မှာ မသုံးပါဘူး။

Default IPC ဆက်တင်တွေကို sysctl ဒါမှမဟုတ် loader interfaces တွေသုံးပြီး ပြောင်းလဲနိုင်ပါတယ်။ အောက်ပါ parameters တွေကို sysctl သုံးပြီး သတ်မှတ်နိုင်ပါတယ်:

```
# sysctl kern.ipc.shmall=32768
# sysctl kern.ipc.shmmax=134217728
```

ဒီဆက်တင်တွေ reboots တွေကြားမှာ တည်မြဲနေစေဖို့ /etc/sysctl.conf ကို ပြုပြင်ပါ။

shared_memory_type ကို sysv လို့ သတ်မှတ်ထားရင် — System V shared memory ကို RAM ထဲမှာ lock လုပ်ပြီး swap ဆီ page out (ပြင်ပသို့ ရွှေ့ပြောင်းခြင်း) မဖြစ်အောင် တားဆီးဖို့လည်း သင့် kernel ကို configure လုပ်ချင်နိုင်ပါတယ်။ ဒါကို kern.ipc.shm_use_phys ဆိုတဲ့ sysctl setting သုံးပြီး လုပ်ဆောင်နိုင်ပါတယ်။

FreeBSD jail တစ်ခုထဲမှာ run နေရင် — ၎င်းရဲ့ sysvshm parameter ကို new လို့ သတ်မှတ်သင့်ပါတယ် — ဒါမှ သူ့မှာ ကိုယ်ပိုင် သီးခြား System V shared memory namespace တစ်ခု ရှိမှာ ဖြစ်ပါတယ်။ (FreeBSD 11.0 မတိုင်ခင်က — jails တွေကနေ host ရဲ့ IPC namespace ကို shared access ရနိုင်အောင် လုပ်ပြီး — collisions တွေ မဖြစ်အောင် ဆောင်ရွက်ရန် လိုအပ်ခဲ့ပါတယ်။)

- **NetBSD** — Default shared memory ဆက်တင်တွေက ပုံမှန်အားဖြင့် လုံလောက်ပါတယ် — shared_memory_type ကို sysv လို့ သတ်မှတ်ထားရင်ကလွဲလို့ပါ။ ဒါပေမယ့် — kern.ipc.semmni နဲ့ kern.ipc.semmns တွေကို တိုးပေးဖို့ လိုအပ်ပါလိမ့်မယ် — အကြောင်းကတော့ ဒီအတွက် NetBSD ရဲ့ default ဆက်တင်တွေက လက်တွေ့ အလုပ်မဖြစ်လောက်အောင် သေးလွန်းလို့ပါ။

IPC parameters တွေကို sysctl သုံးပြီး ချိန်ညှိနိုင်ပါတယ်၊ ဥပမာ:

```
# sysctl -w kern.ipc.semmni=100
```

ဒီဆက်တင်တွေ reboots တွေကြားမှာ တည်မြဲနေစေဖို့ /etc/sysctl.conf ကို ပြုပြင်ပါ။

shared_memory_type ကို sysv လို့ သတ်မှတ်ထားရင် — System V shared memory ကို RAM ထဲမှာ lock လုပ်ပြီး swap ဆီ page out မဖြစ်အောင် တားဆီးဖို့လည်း သင့် kernel ကို configure လုပ်ချင်နိုင်ပါတယ်။ ဒါကို kern.ipc.shm_use_phys ဆိုတဲ့ sysctl setting သုံးပြီး လုပ်ဆောင်နိုင်ပါတယ်။

- **OpenBSD** — Default shared memory ဆက်တင်တွေက ပုံမှန်အားဖြင့် လုံလောက်ပါတယ် — shared_memory_type ကို sysv လို့ သတ်မှတ်ထားရင်ကလွဲလို့ပါ။ ဒါပေမယ့် — kern.seminfo.semmni နဲ့ kern.seminfo.semmns တွေကို တိုးပေးဖို့ လိုအပ်ပါလိမ့်မယ် — အကြောင်းကတော့ ဒီအတွက် OpenBSD ရဲ့ default ဆက်တင်တွေက လက်တွေ့ အလုပ်မဖြစ်လောက်အောင် သေးလွန်းလို့ပါ။

IPC parameters တွေကို sysctl သုံးပြီး ချိန်ညှိနိုင်ပါတယ်၊ ဥပမာ:

```
# sysctl kern.seminfo.semmni=100
```

ဒီဆက်တင်တွေ reboots တွေကြားမှာ တည်မြဲနေစေဖို့ /etc/sysctl.conf ကို ပြုပြင်ပါ။

- **Linux** — Default shared memory ဆက်တင်တွေက ပုံမှန်အားဖြင့် လုံလောက်ပါတယ် — shared_memory_type ကို sysv လို့ သတ်မှတ်ထားပြီး — default တန်ဖိုး နိမ့်တွေနဲ့ ပို့ဆောင်ခဲ့ဖူးတဲ့ kernel version အဟောင်းတွေပေါ်မှာသာ ဖြစ်ရင်တောင် — ကလွဲလို့ပါ။ System V semaphores တွေကို ဒီ platform မှာ မသုံးပါဘူး။

Shared memory အရွယ်အစား ဆက်တင်တွေကို sysctl interface ကနေတစ်ဆင့် ပြောင်းလဲနိုင်ပါတယ်။ ဥပမာ — 16 GB ခွင့်ပြုဖို့ဆိုရင်:

```
$ sysctl -w kernel.shmmax=17179869184
$ sysctl -w kernel.shmall=4194304
```

ဒီဆက်တင်တွေ reboots တွေကြားမှာ တည်မြဲနေစေဖို့ /etc/sysctl.conf ကို ကြည့်ပါ။

- **macOS** — Default shared memory နဲ့ semaphore ဆက်တင်တွေက ပုံမှန်အားဖြင့် လုံလောက်ပါတယ် — shared_memory_type ကို sysv လို့ သတ်မှတ်ထားရင်ကလွဲလို့ပါ။

macOS မှာ shared memory ကို configure လုပ်ဖို့ အကြံပြုထားတဲ့ နည်းလမ်းက — /etc/sysctl.conf လို့ အမည်ရတဲ့ ဖိုင်တစ်ခုကို ဖန်တီးပြီး — အောက်ပါလို variable assignments (variable တန်ဖိုး သတ်မှတ်ချက်များ) တွေ ထည့်သွင်းတာ ဖြစ်ပါတယ်:

```
kern.sysv.shmmax=4194304
kern.sysv.shmmin=1
kern.sysv.shmmni=32
kern.sysv.shmseg=8
kern.sysv.shmall=1024
```

macOS version အချို့မှာ — shared-memory parameters ငါးခုလုံးကို /etc/sysctl.conf ထဲမှာ သတ်မှတ်ထားရမှာ ဖြစ်ပြီး — မဟုတ်ရင် တန်ဖိုးတွေကို လျစ်လျူရှုခံရမှာ ဖြစ်ကြောင်း သတိပြုပါ။

SHMMAX ကို 4096 ရဲ့ မြှောက်ဖော်ကိန်း (multiple) တစ်ခုအနေနဲ့ပဲ သတ်မှတ်နိုင်ပါတယ်။

SHMALL ကို ဒီ platform မှာ 4 kB pages တွေနဲ့ တိုင်းတာပါတယ်။

SHMMNI ကလွဲလို့ ကျန်တာ အားလုံးကို sysctl သုံးပြီး လည်ပတ်နေချိန်မှာတင် (on the fly) ပြောင်းလဲနိုင်ပါတယ်။ ဒါပေမယ့် — တန်ဖိုးတွေ reboots တွေကြားမှာ ထိန်းသိမ်းခံရအောင် — သင့်နှစ်သက်ရာ တန်ဖိုးတွေကို /etc/sysctl.conf ကနေတစ်ဆင့် သတ်မှတ်ထားတာက အကောင်းဆုံး ဖြစ်နေဆဲပါ။

- **Solaris/illumos** — Default shared memory နဲ့ semaphore ဆက်တင်တွေက PostgreSQL applications အများစုအတွက် ပုံမှန်အားဖြင့် လုံလောက်ပါတယ်။ Solaris က SHMMAX ကို system RAM ရဲ့ လေးပုံတစ်ပုံ အဖြစ် default သတ်မှတ်ပါတယ်။ ဒီဆက်တင်ကို ထပ်ပြီး ချိန်ညှိချင်ရင် — postgres user နဲ့ ဆက်စပ်တဲ့ project setting တစ်ခုကို သုံးပါ။ ဥပမာ — root အဖြစ်နဲ့ အောက်ပါတို့ကို run ပါ:

```
projadd -c "PostgreSQL DB User" -K "project.max-shm-memory=(privileged,8GB,deny)" -U postgres -G postgres user.postgres
```

ဒီ command က user.postgres project ကို ထည့်သွင်းပြီး — postgres user အတွက် shared memory အများဆုံး ပမာဏကို 8GB အဖြစ် သတ်မှတ်ပေးကာ — နောက်တစ်ကြိမ် အဲဒီ user log in လုပ်တဲ့အခါ ဒါမှမဟုတ် — PostgreSQL ကို restart လုပ်တဲ့အခါ (reload မဟုတ်ပါ) — အကျိုးသက်ရောက်မှု ရှိပါတယ်။ အပေါ်က ဥပမာက PostgreSQL ကို postgres group ထဲက postgres user က run တယ်လို့ ယူဆထားပါတယ်။ Server reboot မလိုအပ်ပါဘူး။

Connections အများအပြား ရှိမယ့် database servers တွေအတွက် အကြံပြုထားတဲ့ အခြား kernel setting ပြောင်းလဲမှုတွေကတော့:

```
project.max-shm-ids=(priv,32768,deny)
project.max-sem-ids=(priv,4096,deny)
project.max-msg-ids=(priv,4096,deny)
```

ထို့အပြင် — PostgreSQL ကို zone တစ်ခုထဲမှာ run နေရင် — zone ရဲ့ resource usage limits တွေကိုပါ မြှင့်တင်ဖို့ လိုအပ်နိုင်ပါတယ်။ Projects နဲ့ prctl တွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် System Administrator's Guide ထဲက “Chapter2: Projects and Tasks” ကို ကြည့်ပါ။

### 18.4.2. systemd RemoveIPC (systemd ရဲ့ RemoveIPC ဆက်တင်)

systemd ကို သုံးနေရင် — IPC resources တွေ (shared memory အပါအဝင်) ကို operating system က အချိန်မတန်ဘဲ ဖယ်ရှားမခံရအောင် သတိထား ဆောင်ရွက်ရပါမယ်။ ဒါက PostgreSQL ကို source ကနေ install (တပ်ဆင်) လုပ်တဲ့အခါ အထူး သက်ဆိုင်ပါတယ်။ PostgreSQL ရဲ့ distribution packages တွေကို သုံးသူတွေကတော့ ထိခိုက်နိုင်ခြေ နည်းပါတယ် — အကြောင်းကတော့ အဲဒီအခါ `postgres` user ကို ပုံမှန်အားဖြင့် system user တစ်ယောက်အနေနဲ့ ဖန်တီးထားလို့ပါ။

`logind.conf` ထဲက `RemoveIPC` ဆက်တင်က — user တစ်ယောက် လုံးဝ log out လုပ်လိုက်တဲ့အခါ IPC objects တွေကို ဖယ်ရှားမလား မဖယ်ရှားဘူးလားဆိုတာကို ထိန်းချုပ်ပါတယ်။ System users တွေကတော့ ကင်းလွတ်ခွင့် ရှိပါတယ်။ ဒီဆက်တင်က stock systemd မှာ default အနေနဲ့ on ဖြစ်ပေမယ့် — operating system distribution အချို့ကတော့ off ကို default လုပ်ပါတယ်။

ဒီဆက်တင် on ဖြစ်နေချိန်မှာ ပုံမှန် သတိထားမိတတ်တဲ့ အကျိုးသက်ရောက်မှုကတော့ — parallel query execution (အပြိုင် query လုပ်ဆောင်မှု) အတွက် သုံးတဲ့ shared memory objects တွေကို ထင်ရင် ထင်သလို အချိန်တွေမှာ ဖယ်ရှားခံရပြီး — ၎င်းတို့ကို ဖွင့်ပြီး ဖယ်ရှားဖို့ ကြိုးစားတဲ့အခါ — အောက်ပါလို errors နဲ့ warnings တွေ ဖြစ်ပေါ်စေတာပါ:

```sql
WARNING:  could not remove shared memory segment "/PostgreSQL.1450751626": No such file or directory
```

IPC object အမျိုးအစား အမျိုးမျိုး (shared memory နဲ့ semaphores ၊ System V နဲ့ POSIX) ကို systemd က နည်းနည်း ခြားနားစွာ ဆက်ဆံတာမို့ — IPC resources တချို့က တခြားဟာတွေလို မဟုတ်ဘဲ ဖယ်ရှားခံရတာမျိုးကို သတိထားမိနိုင်ပါတယ်။ ဒါပေမယ့် — ဒီလို သိမ်မွေ့တဲ့ ကွာခြားချက်တွေကို အားကိုးတာ မသင့်ပါဘူး။

“User တစ်ယောက် log out လုပ်တာ” က maintenance job တစ်ခုရဲ့ အစိတ်အပိုင်း အနေနဲ့ ဒါမှမဟုတ် — administrator တစ်ယောက်က `postgres` user အဖြစ် ဒါမျိုး log in လုပ်တဲ့အခါ ကိုယ်တိုင် ဖြစ်တတ်တာမို့ — ယေဘုယျအားဖြင့် တားဆီးဖို့ ခက်ပါတယ်။

“System user” ဆိုတာ ဘာလဲဆိုတာကို systemd compile လုပ်ချိန်မှာ — `/etc/login.defs` ထဲက `SYS_UID_MAX` ဆက်တင်ကနေတစ်ဆင့် ဆုံးဖြတ်ပါတယ်။

Packaging နဲ့ deployment scripts တွေက — `useradd -r` ၊ `adduser --system` ဒါမှမဟုတ် အလားတူ တစ်ခုခုကို သုံးပြီး — `postgres` user ကို system user တစ်ယောက်အနေနဲ့ ဖန်တီးဖို့ သတိထား ရပါမယ်။

တနည်းအားဖြင့် — user account ကို မှားယွင်းစွာ ဖန်တီးခဲ့ရင် ဒါမှမဟုတ် ပြောင်းလဲလို့ မရဘူးဆိုရင် — `/etc/systemd/logind.conf` ဒါမှမဟုတ် အခြား သင့်လျော်တဲ့ configuration ဖိုင်တစ်ခုထဲမှာ — အောက်ပါအတိုင်း သတ်မှတ်ဖို့ အကြံပြုပါတယ်:

```sql
RemoveIPC=no
```

> **သတိပြုရန်:** ဒီအချက် နှစ်ချက်ထဲက အနည်းဆုံး တစ်ချက် သေချာပေါက် ရှိနေရပါမယ် — မဟုတ်ရင် PostgreSQL server က အလွန် စိတ်ချရမှု မရှိတော့ပါဘူး။

### 18.4.3. Resource Limits (resource limits — အရင်းအမြစ် ကန့်သတ်ချက်များ)

Unix နဲ့ ဆင်တူတဲ့ operating systems တွေက — သင့် PostgreSQL server ရဲ့ လည်ပတ်မှုကို အနှောင့်အယှက် ဖြစ်စေနိုင်တဲ့ — resource limit (အရင်းအမြစ် ကန့်သတ်ချက်) အမျိုးမျိုးကို ပြဋ္ဌာန်းပေးပါတယ်။ အထူး အရေးကြီးတာကတော့ — user တစ်ဦးလျှင် processes အရေအတွက် ၊ process တစ်ခုလျှင် ဖွင့်ထားနိုင်တဲ့ files အရေအတွက် နဲ့ — process တစ်ခုစီအတွက် ရရှိနိုင်တဲ့ memory ပမာဏ တို့ရဲ့ limits တွေပါ။ ဒါတွေ တစ်ခုချင်းစီမှာ “hard” limit နဲ့ “soft” limit ဆိုပြီး ရှိပါတယ်။ တကယ် အကျုံးဝင်တာက soft limit ဖြစ်ပေမယ့် — user က hard limit အထိတော့ ပြောင်းလဲနိုင်ပါတယ်။ Hard limit ကို root user ကပဲ ပြောင်းလဲနိုင်ပါတယ်။ ဒီ parameters တွေကို သတ်မှတ်ပေးတာက `setrlimit` ဆိုတဲ့ system call ရဲ့ တာဝန် ဖြစ်ပါတယ်။ Command line ကနေ resource limits တွေကို ထိန်းချုပ်ဖို့ — shell ရဲ့ built-in command ဖြစ်တဲ့ `ulimit` (Bourne shells) ဒါမှမဟုတ် `limit` (csh) ကို သုံးပါတယ်။ BSD ကနေ ဆင်းသက်လာတဲ့ system တွေပေါ်မှာ — `/etc/login.conf` ဖိုင်က login လုပ်ချိန်မှာ သတ်မှတ်ပေးတဲ့ resource limits အမျိုးမျိုးကို ထိန်းချုပ်ပါတယ်။ အသေးစိတ်အတွက် operating system documentation ကို ကြည့်ပါ။ သက်ဆိုင်ရာ parameters တွေကတော့ `maxproc` ၊ `openfiles` နဲ့ `datasize` တို့ ဖြစ်ပါတယ်။ ဥပမာ:

```sql
default:\
...
        :datasize-cur=256M:\
        :maxproc-cur=256:\
        :openfiles-cur=256:\
...
```

(`-cur` က soft limit ဖြစ်ပါတယ်။ Hard limit သတ်မှတ်ဖို့ `-max` ကို ထပ်ဖြည့်ပါ။)

Kernels တွေမှာလည်း — resource တချို့အတွက် system တစ်ခုလုံးဆိုင်ရာ limits တွေ ရှိနိုင်ပါတယ်။

- Linux မှာ kernel parameter ဖြစ်တဲ့ fs.file-max က — kernel က ထောက်ပံ့ပေးနိုင်တဲ့ ဖွင့်ထားတဲ့ files အများဆုံး အရေအတွက်ကို ဆုံးဖြတ်ပါတယ်။ ၎င်းကို sysctl -w fs.file-max=N နဲ့ ပြောင်းလဲနိုင်ပါတယ်။ ဒီဆက်တင် reboots တွေကြားမှာ တည်မြဲနေစေဖို့ — /etc/sysctl.conf ထဲမှာ assignment တစ်ခု ထည့်ပါ။ Process တစ်ခုလျှင် files အများဆုံး ကန့်သတ်ချက်ကို kernel compile လုပ်ချိန်မှာ သတ်မှတ်ပြီးသား ဖြစ်ပါတယ်; အသေးစိတ်အတွက် /usr/src/linux/Documentation/proc.txt ကို ကြည့်ပါ။

PostgreSQL server က connection တစ်ခုစီအတွက် process တစ်ခု သုံးပါတယ် — ဒါကြောင့် သင့် system ရဲ့ ကျန် အစိတ်အပိုင်းတွေအတွက် လိုအပ်တာတွေအပြင် — ခွင့်ပြုထားတဲ့ connections အရေအတွက်လောက် အနည်းဆုံး processes အရေအတွက်ကိုပါ ထောက်ပံ့ပေးထားသင့်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် ပြဿနာ မဟုတ်ပေမယ့် — machine တစ်လုံးပေါ်မှာ server အများအပြား run မယ်ဆိုရင် — အခြေအနေ တင်းကျပ်လာနိုင်ပါတယ်။

Open files တွေအတွက် factory default limit ကို မကြာခဏဆိုသလို — “socially friendly” (လူမှုရေးအရ သင့်လျော်သော) တန်ဖိုးတွေနဲ့ သတ်မှတ်ထားတတ်ပြီး — အဲဒါက user အများအပြားကို — system resources တွေရဲ့ မသင့်လျော်တဲ့ အချိုးအစားတစ်ခုကို အသုံးမပြုမိဘဲ — machine တစ်လုံးပေါ်မှာ အတူယှဉ်တွဲ နေထိုင်နိုင်စေပါတယ်။ Machine တစ်လုံးပေါ်မှာ server အများအပြား run နေရင် ဒါက သင်လိုချင်တာ ဖြစ်နိုင်ပေမယ့် — dedicated servers (သီးသန့် server များ) တွေပေါ်မှာတော့ ဒီ limit ကို မြှင့်တင်ချင်နိုင်ပါတယ်။

တစ်ဖက်မှာလည်း — system အချို့က process တစ်ခုချင်းစီကို files အများအပြား ဖွင့်ခွင့် ပြုပါတယ်; process အနည်းငယ်ထက်ပိုပြီး အဲဒီလို လုပ်လိုက်ရင် — system တစ်ခုလုံးဆိုင်ရာ limit ကို လွယ်ကူစွာ ကျော်လွန်သွားနိုင်ပါတယ်။ ဒီလို ဖြစ်နေတာကို တွေ့ရပြီး — system တစ်ခုလုံးဆိုင်ရာ limit ကို မပြောင်းလဲချင်ဘူးဆိုရင် — open files သုံးစွဲမှုကို ကန့်သတ်ဖို့ PostgreSQL ရဲ့ [max_files_per_process](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-FILES-PER-PROCESS) configuration parameter ကို သတ်မှတ်နိုင်ပါတယ်။

Client connections အများအပြားကို ထောက်ပံ့ပေးရာမှာ သက်ဆိုင်နိုင်တဲ့ နောက်ထပ် kernel limit တစ်ခုကတော့ — socket connection queue (ဆက်သွယ်မှု တန်းစီ) ရဲ့ အများဆုံး အလျား ဖြစ်ပါတယ်။ အလွန် တိုတောင်းတဲ့ အချိန်အတွင်းမှာ အဲဒီထက် ပိုများတဲ့ connection requests တွေ ရောက်လာရင် — PostgreSQL server က requests တွေကို မဆောင်ရွက်နိုင်ခင် — တချို့ ငြင်းပယ်ခံရနိုင်ပြီး — အဲဒီ clients တွေက “Resource temporarily unavailable” ဒါမှမဟုတ် “Connection refused” လို — အသုံးမကျတဲ့ connection failure errors တွေ ရရှိတတ်ပါတယ်။ Platform အများစုမှာ default queue length limit က 128 ဖြစ်ပါတယ်။ ၎င်းကို မြှင့်တင်ဖို့ — sysctl ကနေတစ်ဆင့် သင့်လျော်တဲ့ kernel parameter ကို ချိန်ညှိပြီး — PostgreSQL server ကို restart လုပ်ပါ။ ဒီ parameter ကို Linux မှာ `net.core.somaxconn` ၊ FreeBSD အသစ်များမှာ `kern.ipc.soacceptqueue` နဲ့ — macOS နဲ့ တခြား BSD variants တွေမှာ `kern.ipc.somaxconn` ဆိုပြီး အမျိုးမျိုး နာမည် တပ်ထားပါတယ်။

### 18.4.4. Linux Memory Overcommit (Linux memory overcommit — memory ကတိပေးချက်ထက် ကျော်လွန် ခွင့်ပြုခြင်း)

Linux ပေါ်မှာ default virtual memory အပြုအမူက PostgreSQL အတွက် အကောင်းဆုံး မဟုတ်ပါဘူး။ Kernel က memory overcommit ကို အကောင်အထည် ဖော်ပုံကြောင့် — PostgreSQL ဒါမှမဟုတ် တခြား process တစ်ခုရဲ့ memory တောင်းဆိုမှုတွေက system ရဲ့ virtual memory ကို ကုန်ဆုံးစေရင် — kernel က PostgreSQL ရဲ့ postmaster (ကြီးကြပ် စီမံသည့် server process) ကို သတ်ပစ်နိုင်ပါတယ်။

ဒီလို ဖြစ်ခဲ့ရင် — အောက်ပါလို ပုံရှိတဲ့ kernel message တစ်ခု တွေ့ရပါလိမ့်မယ် (ဒီလို message မျိုးကို ဘယ်နေရာမှာ ရှာရမလဲဆိုတာအတွက် သင့် system ရဲ့ documentation နဲ့ configuration ကို တိုင်ပင်ပါ):

```sql
Out of Memory: Killed process 12345 (postgres).
```

ဒါက `postgres` process ကို memory pressure (memory ဖိအား) ကြောင့် ရပ်စဲလိုက်တယ်လို့ ညွှန်ပြပါတယ်။ ရှိပြီးသား database connections တွေက ပုံမှန်အတိုင်း ဆက်လက် လုပ်ဆောင်နေဦးမယ် ဆိုပေမယ့် — connection အသစ်တွေကိုတော့ လက်ခံမှာ မဟုတ်ပါဘူး။ ပြန်လည် ကောင်းမွန်လာဖို့ — PostgreSQL ကို restart လုပ်ဖို့ လိုအပ်ပါတယ်။

ဒီပြဿနာကို ရှောင်ဖို့ နည်းလမ်းတစ်ခုက — တခြား processes တွေက machine ရဲ့ memory ကို ကုန်အောင် မသုံးနိုင်ဘူးလို့ သေချာနိုင်တဲ့ machine တစ်လုံးပေါ်မှာ PostgreSQL ကို run လုပ်တာ ဖြစ်ပါတယ်။ Memory ကျပ်နေရင် — operating system ရဲ့ swap space ကို တိုးပေးတာက ပြဿနာကို ရှောင်ရှားဖို့ အထောက်အကူ ပြုနိုင်ပါတယ် — အကြောင်းကတော့ out-of-memory (OOM — memory ကုန်ခမ်းမှု) killer ကို physical memory ရော swap space ပါ ကုန်ဆုံးမှသာ ခေါ်ယူ အသုံးပြုလို့ပါ။

System ရဲ့ memory ကုန်ဆုံးမှုရဲ့ အကြောင်းရင်းက PostgreSQL ကိုယ်တိုင် ဖြစ်နေရင် — သင့် configuration ကို ပြောင်းလဲခြင်းအားဖြင့် ပြဿနာကို ရှောင်ရှားနိုင်ပါတယ်။ ကိစ္စအချို့မှာ — memory နဲ့ ဆက်စပ်တဲ့ configuration parameters တွေ — အထူးသဖြင့် [`shared_buffers`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS) ၊ [`work_mem`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM) နဲ့ [`hash_mem_multiplier`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-HASH-MEM-MULTIPLIER) — ကို လျှော့ချတာ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ တခြား ကိစ္စများမှာ — ပြဿနာက database server ကိုယ်တိုင်ဆီ connections အများအပြား ခွင့်ပြုထားတာကြောင့် ဖြစ်နိုင်ပါတယ်။ ကိစ္စ အများအပြားမှာ — [`max_connections`](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS) ကို လျှော့ချပြီး — အဲဒီအစား external connection-pooling software (ပြင်ပ connection စုစည်းမှု ဆော့ဖ်ဝဲ) ကို အသုံးပြုတာက ပိုကောင်းနိုင်ပါတယ်။

Kernel ရဲ့ အပြုအမူကို — memory “overcommit” (ကတိပြုထားသည်ထက် ပို၍ ခွဲဝေပေးခြင်း) မလုပ်တော့အောင် ပြုပြင်မွမ်းမံလို့ ရပါတယ်။ ဒီဆက်တင်က [OOM killer](https://lwn.net/Articles/104179/) ကို လုံးဝ မခေါ်ယူရအောင် မကာကွယ်နိုင်ပေမယ့် — ဖြစ်နိုင်ခြေကို သိသိသာသာ လျှော့ချပေးပြီး — အကျိုးဆက်အနေနဲ့ system ရဲ့ အပြုအမူ ပိုခိုင်မာလာစေပါတယ်။ ဒါကို — `sysctl` ကနေတစ်ဆင့် strict overcommit mode (တင်းကျပ်သော overcommit mode) ကို ရွေးချယ်ခြင်းအားဖြင့် လုပ်ဆောင်ပါတယ်:

```sql
sysctl -w vm.overcommit_memory=2
```

ဒါမှမဟုတ် — `/etc/sysctl.conf` ထဲမှာ ညီမျှတဲ့ entry တစ်ခု ထည့်ပါ။ ဆက်စပ်နေတဲ့ `vm.overcommit_ratio` ဆက်တင်ကိုလည်း ပြုပြင်ချင်နိုင်ပါတယ်။ အသေးစိတ်အတွက် kernel documentation ဖိုင် ဖြစ်တဲ့ [https://www.kernel.org/doc/Documentation/vm/overcommit-accounting](https://www.kernel.org/doc/Documentation/vm/overcommit-accounting) ကို ကြည့်ပါ။

`vm.overcommit_memory` ကို ပြောင်းသည်ဖြစ်စေ မပြောင်းသည်ဖြစ်စေ — တွဲဖက် သုံးနိုင်တဲ့ နောက်ထပ် နည်းလမ်းတစ်ခုက — postmaster process အတွက် process-specific *OOM score adjustment* (OOM ရမှတ် ချိန်ညှိမှု) တန်ဖိုးကို `-1000` အဖြစ် သတ်မှတ်ပြီး — ၎င်းကို OOM killer ရဲ့ ပစ်မှတ် ဖြစ်မှာ မဟုတ်ဘူးလို့ အာမခံတာ ဖြစ်ပါတယ်။ ဒါကို လုပ်ဖို့ အရိုးရှင်းဆုံး နည်းလမ်းက — PostgreSQL startup script ထဲမှာ `postgres` ကို မခေါ်ခင် အောက်ပါတို့ကို execute လုပ်တာ ဖြစ်ပါတယ်:

```sql
echo -1000 > /proc/self/oom_score_adj
```

ဒီလုပ်ဆောင်ချက်ကို root အဖြစ်နဲ့ လုပ်ရမယ်ဆိုတာ သတိပြုပါ — မဟုတ်ရင် အကျိုးသက်ရောက်မှု ဘာမှ ရှိမှာ မဟုတ်ပါဘူး; ဒါကြောင့် root ပိုင်ဆိုင်တဲ့ startup script တစ်ခုက ဒါကို လုပ်ဖို့ အလွယ်ဆုံး နေရာ ဖြစ်ပါတယ်။ ဒီလို လုပ်မယ်ဆိုရင် — `postgres` ကို မခေါ်ခင် startup script ထဲမှာ ဒီ environment variables တွေကိုပါ သတ်မှတ်ထားသင့်ပါတယ်:

```sql
export PG_OOM_ADJUST_FILE=/proc/self/oom_score_adj
export PG_OOM_ADJUST_VALUE=0
```

ဒီဆက်တင်တွေက postmaster ရဲ့ child processes တွေကို — သာမန် OOM score adjustment ဖြစ်တဲ့ zero နဲ့ run စေမှာ ဖြစ်ပြီး — ဒါကြောင့် OOM killer က လိုအပ်လာရင် ၎င်းတို့ကို ပစ်မှတ်ထား သတ်နိုင်ဆဲ ဖြစ်ပါတယ်။ Child processes တွေကို တခြား OOM score adjustment တန်ဖိုးတစ်ခုခုနဲ့ run စေချင်ရင် — `PG_OOM_ADJUST_VALUE` အတွက် တခြား တန်ဖိုးတစ်ခုကို သုံးနိုင်ပါတယ်။ (`PG_OOM_ADJUST_VALUE` ကို ချန်လိုက်ရင်လည်း ရပါတယ် — အဲဒီအခါ zero ကို default အဖြစ် ယူပါတယ်။) `PG_OOM_ADJUST_FILE` ကို မသတ်မှတ်ထားရင် — child processes တွေက postmaster နဲ့ အတူတူ OOM score adjustment နဲ့ပဲ run ပါလိမ့်မယ် — ဒါက မလိမ္မာပါဘူး — အကြောင်းကတော့ ဒီလုပ်ဆောင်မှုတစ်ခုလုံးရဲ့ ရည်ရွယ်ချက်က postmaster မှာ ဦးစားပေး ဆက်တင် (preferential setting) တစ်ခု ရှိစေဖို့ သေချာစေတာ ဖြစ်လို့ပါ။

### 18.4.5. Linux Huge Pages (Linux huge pages — ကြီးမားသော memory pages)

Huge pages တွေကို သုံးတာက — PostgreSQL လိုပဲ — memory ရဲ့ ကြီးမားပြီး ဆက်တိုက် (contiguous) အပိုင်းအစကြီးတွေကို သုံးတဲ့အခါ — အထူးသဖြင့် [shared_buffers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS) ရဲ့ တန်ဖိုး ကြီးတွေကို သုံးတဲ့အခါ — overhead (ထပ်ဆောင်း စရိတ်) ကို လျှော့ချပေးပါတယ်။ PostgreSQL မှာ ဒီ feature ကို သုံးဖို့ — `CONFIG_HUGETLBFS=y` နဲ့ `CONFIG_HUGETLB_PAGE=y` ပါတဲ့ kernel တစ်ခု လိုအပ်ပါတယ်။ ထို့အပြင် — လိုချင်တဲ့ အရွယ်အစား ရှိတဲ့ huge pages အလုံအလောက် ထောက်ပံ့ပေးဖို့ operating system ကိုပါ configure လုပ်ရပါမယ်။ Runtime မှာ တွက်ချက်ပေးတဲ့ parameter ဖြစ်တဲ့ [shared_memory_size_in_huge_pages](https://www.postgresql.org/docs/current/runtime-config-preset.html#GUC-SHARED-MEMORY-SIZE-IN-HUGE-PAGES) က လိုအပ်တဲ့ huge pages အရေအတွက်ကို အစီရင်ခံပါတယ်။ ဒီ parameter ကို — server မစတင်ခင် — ဒီလို `postgres` command တစ်ခုနဲ့ ကြည့်နိုင်ပါတယ်:

```
$ postgres -D $PGDATA -C shared_memory_size_in_huge_pages
3170
$ grep ^Hugepagesize /proc/meminfo
Hugepagesize:       2048 kB
$ ls /sys/kernel/mm/hugepages
hugepages-1048576kB  hugepages-2048kB
```

ဒီဥပမာမှာ default က 2MB ဖြစ်ပြီး — ဒါပေမယ့် [huge_page_size](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-HUGE-PAGE-SIZE) နဲ့ 2MB ဒါမှမဟုတ် 1GB ကို အတိအကျ တောင်းဆိုပြီး — `shared_memory_size_in_huge_pages` က တွက်ချက်ပေးတဲ့ pages အရေအတွက်ကို လိုက်လျောညီထွေ ဖြစ်အောင် ပြောင်းလဲနိုင်ပါတယ်။ ဒီဥပမာမှာ ကျွန်ုပ်တို့ အနည်းဆုံး huge pages `3170` ခု လိုအပ်ပေမယ့် — machine ပေါ်က တခြား programs တွေကပါ huge pages လိုအပ်နေရင် — ပိုမြင့်တဲ့ ဆက်တင်တစ်ခုက ပိုသင့်လျော်ပါလိမ့်မယ်။ ဒါကို အောက်ပါအတိုင်း သတ်မှတ်နိုင်ပါတယ်:

```sql
# sysctl -w vm.nr_hugepages=3170
```

ဒီဆက်တင်ကို `/etc/sysctl.conf` ထဲမှာပါ ထည့်ဖို့ မမေ့ပါနဲ့ — ဒါမှ reboots တွေပြီးတိုင်း ပြန်လည် အသုံးပြုနိုင်မှာ ဖြစ်ပါတယ်။ Default မဟုတ်တဲ့ huge page အရွယ်အစားတွေအတွက်တော့ — အဲဒီအစား အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```sql
# echo 3170 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

ဒီဆက်တင်တွေကို boot အချိန်မှာလည်း — `hugepagesz=2M hugepages=3170` လို kernel parameters တွေကို သုံးပြီး ထောက်ပံ့ပေးနိုင်ပါတယ်။

Kernel က fragmentation (အပိုင်းပိုင်း ကွဲအက်မှု) ကြောင့် လိုချင်တဲ့ huge pages အရေအတွက်ကို ချက်ချင်း ခွဲဝေပေးနိုင်ဖို့ တစ်ခါတစ်ရံ မဖြစ်နိုင်တာမို့ — command ကို ထပ်ခါထပ်ခါ run ဖို့ ဒါမှမဟုတ် reboot လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။ (Reboot လုပ်ပြီး ချက်ချင်းဆို — machine ရဲ့ memory အများစုက huge pages အဖြစ် ပြောင်းလဲဖို့ ရရှိနိုင်သင့်ပါတယ်။) အရွယ်အစား တစ်ခုအတွက် huge page ခွဲဝေမှု အခြေအနေကို စစ်ဆေးဖို့ — အောက်ပါအတိုင်း သုံးပါ:

```
$ cat /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

Database server ရဲ့ operating system user ကို — sysctl ကနေတစ်ဆင့် `vm.hugetlb_shm_group` ကို သတ်မှတ်ပြီး huge pages တွေ သုံးခွင့် ပေးဖို့ ဒါမှမဟုတ် — `ulimit -l` နဲ့ memory lock လုပ်ခွင့် ပေးဖို့လည်း လိုအပ်နိုင်ပါတယ်။

PostgreSQL မှာ huge pages တွေရဲ့ default အပြုအမူကတော့ — ဖြစ်နိုင်ရင် system ရဲ့ default huge page အရွယ်အစားနဲ့ ၎င်းတို့ကို သုံးပြီး — မအောင်မြင်ခဲ့ရင် သာမန် pages တွေဆီ ပြန်ကျ (fall back) တာ ဖြစ်ပါတယ်။ Huge pages တွေ သုံးတာကို အတင်းအကျပ် သေချာစေချင်ရင် — `postgresql.conf` ထဲမှာ [huge_pages](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-HUGE-PAGES) ကို `on` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီဆက်တင်နဲ့ဆို — huge pages အလုံအလောက် မရရှိနိုင်ရင် PostgreSQL က စတင်ရန် ပျက်ကွက်မယ်ဆိုတာ သတိပြုပါ။

Linux huge pages feature အကြောင်း အသေးစိတ် ဖော်ပြချက်အတွက် [https://www.kernel.org/doc/Documentation/vm/hugetlbpage.txt](https://www.kernel.org/doc/Documentation/vm/hugetlbpage.txt) ကို ကြည့်ပါ။
