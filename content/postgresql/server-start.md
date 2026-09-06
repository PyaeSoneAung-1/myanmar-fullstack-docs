---
title: "Starting the Database Server (database server ကို စတင်ခြင်း)"
description: "Database server ကို စတင်ခြင်း — postgres program ကို -D option နဲ့ တိုက်ရိုက် run လုပ်ခြင်း၊ PGDATA environment variable၊ background တွင် စတင်ခြင်း၊ pg_ctl wrapper program၊ boot အချိန် autostart scripts များ (FreeBSD, OpenBSD, Linux/systemd, NetBSD, Solaris)၊ postmaster.pid ဖိုင်၊ server စတင်ချိန် မအောင်မြင်မှုများနှင့် client connection ပြဿနာများအကြောင်း ရှင်းလင်းချက်"
order: 142
source: "https://www.postgresql.org/docs/current/server-start.html"
status: translated
updated: 2026-09-06
---

## 18.3. Starting the Database Server (database server ကို စတင်ခြင်း)

- **18.3.1. Server Start-up Failures (server စတင်ချိန် မအောင်မြင်မှုများ)**
- **18.3.2. Client Connection Problems (client ချိတ်ဆက်မှု ပြဿနာများ)**

ဘယ်သူမဆို database ကို ဝင်ရောက် သုံးစွဲနိုင်ဖို့ — database server ကို ဦးစွာ စတင်ရပါမယ်။ Database server ရဲ့ program ကို `postgres` လို့ ခေါ်ပါတယ်။

ကြိုတင် package လုပ်ထားတဲ့ (pre-packaged) PostgreSQL version တစ်ခုကို သုံးနေတယ်ဆိုရင် — အဲဒီ package က သင့် operating system ရဲ့ စည်းမျဉ်း စနစ်တွေနဲ့အညီ server ကို background task (နောက်ခံ လုပ်ငန်းစဉ်) အနေနဲ့ run လုပ်ဖို့ စီစဉ်ပေးထားတာ ပါဝင်လေ့ ရှိပါတယ်။ Server ကို စတင်ဖို့ package ရဲ့ infrastructure (အခြေခံ အဆောက်အအုံ) ကို သုံးတာက — ဒါတွေကို ကိုယ်တိုင် ဘယ်လို လုပ်ရမလဲ ဆိုတာ ရှာဖွေရတာထက် အများကြီး ပိုလွယ်ကူပါတယ်။ အသေးစိတ်အတွက် package-level documentation (package အဆင့် မှတ်တမ်း) ကို တိုင်ပင်ကြည့်ပါ။

Server ကို လက်နဲ့ စတင်ဖို့ အခြေခံအကျဆုံး နည်းကတော့ — `-D` option နဲ့ data directory ရဲ့ တည်နေရာကို သတ်မှတ်ပြီး — `postgres` ကို တိုက်ရိုက် run လုပ်တာပဲ ဖြစ်ပါတယ် — ဥပမာ:

```
$ postgres -D /usr/local/pgsql/data
```

ဒါက server ကို foreground (ရှေ့ဆုံး မျက်နှာပြင်) မှာ run နေတဲ့အတိုင်း ထားပေးပါလိမ့်မယ်။ ဒါကို PostgreSQL user account နဲ့ log in ဝင်ထားစဉ်မှာပဲ လုပ်ရပါမယ်။ `-D` မပါဘူးဆိုရင် — server က `PGDATA` ဆိုတဲ့ environment variable နဲ့ သတ်မှတ်ထားတဲ့ data directory ကို သုံးဖို့ ကြိုးစားပါလိမ့်မယ်။ အဲဒီ variable ကိုပါ မပေးထားဘူးဆိုရင် — မအောင်မြင်ဘဲ ရပ်သွားပါလိမ့်မယ်။

ပုံမှန်အားဖြင့် `postgres` ကို background (နောက်ခံ) မှာ စတင်တာက ပိုကောင်းပါတယ်။ ဒီအတွက် ပုံမှန် Unix shell syntax ကို သုံးပါ:

```
$ postgres -D /usr/local/pgsql/data >logfile 2>&1 &
```

အပေါ်မှာ ပြထားသလို — server ရဲ့ stdout နဲ့ stderr output တွေကို တစ်နေရာရာမှာ သိမ်းဆည်းထားတာ အရေးကြီးပါတယ်။ အဲဒါက စစ်ဆေး မှတ်တမ်းတင်ခြင်း (auditing) ရည်ရွယ်ချက်တွေအတွက်ရော — ပြဿနာတွေကို ရှာဖွေ ဖော်ထုတ်ဖို့အတွက်ပါ အထောက်အကူ ဖြစ်ပါလိမ့်မယ်။ (Log file ကိုင်တွယ်မှုအကြောင်း ပိုပြီး ကျယ်ကျယ်ပြန့်ပြန့် ဆွေးနွေးထားတာကို [အပိုင်း 24.3](/docs/postgresql/logfile-maintenance) မှာ ကြည့်ပါ။)

`postgres` program က command-line options တခြား အများအပြားကိုလည်း လက်ခံပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [postgres](https://www.postgresql.org/docs/current/app-postgres.html) reference page နဲ့ အောက်က [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) ကို ကြည့်ပါ။

ဒီ shell syntax က မကြာခင် ငြီးငွေ့စရာ ဖြစ်လာနိုင်ပါတယ်။ ဒါကြောင့် — လုပ်ဆောင်ချက် တချို့ကို ရိုးရှင်းစေဖို့ — wrapper program (ပတ်ပတ်လည် ကာရံပေးသော program) တစ်ခုဖြစ်တဲ့ [pg_ctl](https://www.postgresql.org/docs/current/app-pg-ctl.html) ကို ထောက်ပံ့ပေးထားပါတယ်။ ဥပမာ:

```sql
pg_ctl start -l logfile
```

ဒါက server ကို background မှာ စတင်ပြီး — output တွေကို သတ်မှတ်ထားတဲ့ log file ထဲ ထည့်ပေးပါလိမ့်မယ်။ ဒီမှာ `-D` option က `postgres` အတွက်ကလိုပဲ — အဓိပ္ပာယ် တူညီပါတယ်။ `pg_ctl` က server ကို ရပ်တန့်ဖို့လည်း လုပ်ဆောင်နိုင်ပါတယ်။

ပုံမှန်အားဖြင့် — ကွန်ပျူတာ boot (စတင် တက်လာချိန်) လုပ်တဲ့အခါ database server ကို စတင်စေချင်ပါလိမ့်မယ်။ Autostart scripts တွေက operating system အလိုက် သီးခြား ဖြစ်ပါတယ်။ PostgreSQL နဲ့အတူ `contrib/start-scripts` directory ထဲမှာ ဥပမာ scripts အနည်းငယ် ဖြန့်ဝေထားပါတယ်။ တစ်ခုကို တပ်ဆင်ဖို့ဆိုရင် root privileges (root အခွင့်အရေးများ) လိုအပ်ပါလိမ့်မယ်။

System တွေက boot အချိန်မှာ daemons (နောက်ခံ ဝန်ဆောင်မှု process များ) တွေကို စတင်တဲ့ စည်းမျဉ်း အမျိုးမျိုး ရှိကြပါတယ်။ System အများအပြားမှာ `/etc/rc.local` ဒါမှမဟုတ် `/etc/rc.d/rc.local` ဖိုင် ရှိပါတယ်။ တချို့က `init.d` ဒါမှမဟုတ် `rc.d` directories တွေကို သုံးပါတယ်။ ဘယ်လိုပဲ လုပ်လုပ် — server ကို root ဒါမှမဟုတ် တခြား user တစ်ယောက်ယောက် မဟုတ်ဘဲ — PostgreSQL user account ကနေပဲ run ရပါမယ်။ ဒါကြောင့် သင့် commands တွေကို `su postgres -c '...'` သုံးပြီး ပုံဖော်သင့်ပါတယ်။ ဥပမာ:

```sql
su postgres -c 'pg_ctl start -D /usr/local/pgsql/data -l serverlog'
```

ဒီမှာ operating system အလိုက် နောက်ထပ် အကြံပြုချက် အနည်းငယ် ရှိပါတယ်။ (ကိစ္စတစ်ခုချင်းစီမှာ ယေဘုယျ တန်ဖိုးတွေ ပြထားတဲ့ နေရာတွေမှာ — သင့်တော်တဲ့ installation directory နဲ့ user name ကို သေချာ သုံးပါ။)

- FreeBSD အတွက်ဆိုရင် — PostgreSQL source distribution ထဲက contrib/start-scripts/freebsd ဖိုင်ကို ကြည့်ပါ။
- OpenBSD မှာဆိုရင် — /etc/rc.local ဖိုင်ထဲကို အောက်ပါ line တွေ ထည့်ပါ: 
  
  if [ -x /usr/local/pgsql/bin/pg_ctl -a -x /usr/local/pgsql/bin/postgres ]; then
      su -l postgres -c '/usr/local/pgsql/bin/pg_ctl start -s -l /var/postgresql/log -D /usr/local/pgsql/data'
      echo -n ' postgresql'
  fi
- Linux system တွေမှာဆိုရင် — အောက်ပါ line ကို 
  
  /usr/local/pgsql/bin/pg_ctl start -l logfile -D /usr/local/pgsql/data
  
  /etc/rc.d/rc.local ဒါမှမဟုတ် /etc/rc.local ထဲကို ထည့်နိုင်သလို — PostgreSQL source distribution ထဲက contrib/start-scripts/linux ဖိုင်ကိုလည်း ကြည့်နိုင်ပါတယ်။
  systemd ကို သုံးနေတယ်ဆိုရင် — အောက်ပါ service unit file ကို သုံးနိုင်ပါတယ် (ဥပမာ — /etc/systemd/system/postgresql.service မှာ):
  
  [Unit]
  Description=PostgreSQL database server
  Documentation=man:postgres(1)
  After=network-online.target
  Wants=network-online.target
  
  [Service]
  Type=notify
  User=postgres
  ExecStart=/usr/local/pgsql/bin/postgres -D /usr/local/pgsql/data
  ExecReload=/bin/kill -HUP $MAINPID
  KillMode=mixed
  KillSignal=SIGINT
  TimeoutSec=infinity
  
  [Install]
  WantedBy=multi-user.target
  
  Type=notify ကို သုံးတာက — server binary ကို configure --with-systemd နဲ့ တည်ဆောက်ထားဖို့ လိုအပ်ပါတယ်။
  Timeout setting ကို သေချာ စဉ်းစားပါ။ ဒီစာ ရေးနေချိန် အထိ systemd ရဲ့ default timeout က 90 စက္ကန့် ဖြစ်ပြီး — အဲဒီ အချိန်အတွင်း readiness (အသင့်ဖြစ်မှု) ကို အစီရင်ခံမပေးတဲ့ process တစ်ခုကို kill လုပ်ပါလိမ့်မယ်။ ဒါပေမယ့် — startup မှာ crash recovery (ပျက်ကျမှု ပြန်လည် ဆယ်တင်ခြင်း) လုပ်ဆောင်ရန် လိုအပ်နိုင်တဲ့ PostgreSQL server တစ်ခုက — အသင့်ဖြစ်ဖို့ အများကြီး ပိုကြာနိုင်ပါတယ်။ infinity ဆိုတဲ့ အကြံပြုထားတဲ့ တန်ဖိုးက timeout logic ကို ပိတ်ထားပေးပါတယ်။
- NetBSD မှာဆိုရင် — ကြိုက်နှစ်သက်ရာ အပေါ်မူတည်ပြီး FreeBSD ဒါမှမဟုတ် Linux start scripts တွေထဲက တစ်ခုကို သုံးပါ။
- Solaris မှာဆိုရင် — /etc/init.d/postgresql လို့ ခေါ်တဲ့ ဖိုင်တစ်ခု ဖန်တီးပြီး — အောက်ပါ line ပါဝင်စေပါ: 
  
  su - postgres -c "/usr/local/pgsql/bin/pg_ctl start -l logfile -D /usr/local/pgsql/data"
  
  ပြီးရင် — /etc/rc3.d ထဲမှာ S99postgresql အနေနဲ့ သူ့ဆီ symbolic link တစ်ခု ဖန်တီးပါ။

Server run နေတဲ့ အချိန်မှာ — ၎င်းရဲ့ PID ကို data directory ထဲက `postmaster.pid` ဖိုင်ထဲမှာ သိမ်းဆည်းပါတယ်။ ဒါက data directory တစ်ခုတည်းထဲမှာ server instances အများအပြား run မဖြစ်အောင် ကာကွယ်ဖို့ သုံးပြီး — server ကို ပိတ်ဖို့အတွက်လည်း သုံးနိုင်ပါတယ်။

### 18.3.1. Server Start-up Failures (server စတင်ချိန် မအောင်မြင်မှုများ)

Server က စတင်ဖို့ မအောင်မြင်ရတဲ့ အကြောင်းရင်း ဖြစ်လေ့ ရှိတဲ့ အချက်တွေ အများအပြား ရှိပါတယ်။ Server ရဲ့ log file ကို စစ်ဆေးကြည့်ပါ — ဒါမှမဟုတ် — (standard output ဒါမှမဟုတ် standard error ကို redirect မလုပ်ဘဲ) လက်နဲ့ စတင်ကြည့်ပြီး ဘယ် error messages တွေ ပေါ်လာလဲ ကြည့်ပါ။ အောက်မှာ အဖြစ်အများဆုံး error messages တချို့ကို အသေးစိတ် ရှင်းပြထားပါတယ်။

```sql
LOG:  could not bind IPv4 address "127.0.0.1": Address already in use
HINT:  Is another postmaster already running on port 5432? If not, wait a few seconds and retry.
FATAL:  could not create any TCP/IP sockets
```

ဒါက ပြောထားတဲ့အတိုင်း အဓိပ္ပာယ် သက်ရောက်လေ့ ရှိပါတယ်: server တစ်ခု ရှိပြီးသား run နေတဲ့ port အပေါ်မှာပဲ — နောက် server တစ်ခုကို စတင်ဖို့ ကြိုးစားခဲ့တာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — kernel error message က `Address already in use` ဒါမှမဟုတ် အဲဒီပုံစံရဲ့ မျိုးကွဲ တစ်ခုခု မဟုတ်ဘူးဆိုရင် — ပြဿနာ တစ်မျိုး ဖြစ်နိုင်ပါတယ်။ ဥပမာ — reserved port number (သီးသန့် သတ်မှတ်ထားသော port နံပါတ်) တစ်ခုပေါ်မှာ server စတင်ဖို့ ကြိုးစားတာက ဒီလိုမျိုး ထွက်လာနိုင်ပါတယ်:

```
$ postgres -p 666
LOG:  could not bind IPv4 address "127.0.0.1": Permission denied
HINT:  Is another postmaster already running on port 666? If not, wait a few seconds and retry.
FATAL:  could not create any TCP/IP sockets
```

ဒီလို message မျိုး:

```sql
FATAL:  could not create shared memory segment: Invalid argument
DETAIL:  Failed system call was shmget(key=5440001, size=4011376640, 03600).
```

ဆိုရင် — သင့် kernel ရဲ့ shared memory (မျှဝေသုံး memory) အရွယ်အစား ကန့်သတ်ချက်က — PostgreSQL က ဖန်တီးဖို့ ကြိုးစားနေတဲ့ work area (ဒီဥပမာမှာ 4011376640 bytes) ထက် သေးငယ်နေတာ ဖြစ်နိုင်ပါတယ်။ ဒါက `shared_memory_type` ကို `sysv` လို့ သတ်မှတ်ထားမှသာ ဖြစ်နိုင်ခြေ ရှိပါတယ်။ အဲဒီအခါမျိုးမှာ — ပုံမှန်ထက် နည်းတဲ့ buffers အရေအတွက်နဲ့ server ကို စတင်ကြည့်နိုင်ပါတယ် ([shared_buffers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS)) — ဒါမှမဟုတ် — ခွင့်ပြုထားတဲ့ shared memory အရွယ်အစားကို မြှင့်တင်ဖို့ kernel ကို ပြန်လည် configure လုပ်နိုင်ပါတယ်။ တူညီတဲ့ machine ပေါ်မှာ server အများအပြား စတင်ဖို့ ကြိုးစားတဲ့အခါ — သူတို့ တောင်းဆိုထားတဲ့ စုစုပေါင်း နေရာက kernel ကန့်သတ်ချက်ကို ကျော်လွန်နေရင်လည်း ဒီ message ကို မြင်ရနိုင်ပါတယ်။

ဒီလို error မျိုး:

```sql
FATAL:  could not create semaphores: No space left on device
DETAIL:  Failed system call was semget(5440126, 17, 03600).
```

ကတော့ disk space (disk နေရာလွတ်) ကုန်သွားပြီလို့ ဆိုလိုတာ မဟုတ်ပါဘူး။ ဆိုလိုတာက — System V semaphores (System V အချက်ပြ ကိရိယာများ) အရေအတွက်အတွက် သင့် kernel ရဲ့ ကန့်သတ်ချက်က — PostgreSQL က ဖန်တီးချင်တဲ့ အရေအတွက်ထက် သေးငယ်နေတာပါ။ အပေါ်မှာလိုပဲ — ခွင့်ပြုထားတဲ့ connections အရေအတွက်ကို လျှော့ချထားတဲ့ server တစ်ခုနဲ့ စတင်ခြင်းအားဖြင့် ပြဿနာကို ရှောင်ရှားနိုင်ကောင်း ရှောင်ရှားနိုင်ပါလိမ့်မယ် ([max_connections](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS)) — ဒါပေမယ့် — နောက်ဆုံးမှာတော့ kernel ကန့်သတ်ချက်ကို မြှင့်တင်ချင်ပါလိမ့်မယ်။

System V IPC facilities တွေကို configure လုပ်ခြင်းအကြောင်း အသေးစိတ်ကို [အပိုင်း 18.4.1](/docs/postgresql/kernel-resources) မှာ ဖော်ပြထားပါတယ်။

### 18.3.2. Client Connection Problems (client ချိတ်ဆက်မှု ပြဿနာများ)

Client ဘက်မှာ ဖြစ်နိုင်တဲ့ error အခြေအနေတွေက အတော် စုံလင်ပြီး — application အလိုက် ကွဲပြားပေမယ့် — အဲဒီထဲက အနည်းငယ်ကတော့ server ကို ဘယ်လို စတင်ခဲ့လဲဆိုတာနဲ့ တိုက်ရိုက် ဆက်စပ်နေနိုင်ပါတယ်။ အောက်မှာ ပြထားတာတွေကလွဲရင် တခြား အခြေအနေတွေကို သက်ဆိုင်ရာ client application နဲ့အတူ မှတ်တမ်းတင်ထားသင့်ပါတယ်။

```sql
psql: error: connection to server at "server.joe.com" (123.123.123.123), port 5432 failed: Connection refused
        Is the server running on that host and accepting TCP/IP connections?
```

ဒါက “ဆက်သွယ်ဖို့ server တစ်ခု ရှာမတွေ့ဘူး” ဆိုတဲ့ ယေဘုယျ ကျရှုံးမှု ဖြစ်ပါတယ်။ TCP/IP communication ကို ကြိုးစားတဲ့အခါ အပေါ်ကလိုပဲ ပေါ်လာပါတယ်။ အဖြစ်များတဲ့ အမှားတစ်ခုကတော့ — server က remote TCP connections တွေကို လက်ခံနိုင်ဖို့ [listen_addresses](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-LISTEN-ADDRESSES) ကို configure လုပ်ဖို့ မေ့နေတာပါ။

တနည်းအားဖြင့် — local server တစ်ခုဆီ Unix-domain socket communication လုပ်ဖို့ ကြိုးစားတဲ့အခါမှာလည်း ဒါမျိုး ရနိုင်ပါတယ်:

```sql
psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory
        Is the server running locally and accepting connections on that socket?
```

Server က တကယ် run နေတယ်ဆိုရင် — client ရဲ့ socket path အပေါ် ထင်မြင်ချက် (ဒီမှာ `/tmp`) က server ရဲ့ [unix_socket_directories](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-UNIX-SOCKET-DIRECTORIES) setting နဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါ။

Connection failure message တစ်ခုက server address ဒါမှမဟုတ် socket path name ကို အမြဲ ပြသပြီး — client က မှန်ကန်တဲ့ နေရာဆီ connect ဖို့ ကြိုးစားနေလားဆိုတာ စစ်ဆေးဖို့ အသုံးဝင်ပါတယ်။ အဲဒီနေရာမှာ တကယ် listen လုပ်နေတဲ့ server မရှိဘူးဆိုရင် — kernel error message က ပုံမှန်အားဖြင့် ပြထားသလို `Connection refused` ဒါမှမဟုတ် `No such file or directory` ထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်။ (ဒီ context ထဲက `Connection refused` က — server က သင့် connection request ကို လက်ခံရရှိပြီး ငြင်းပယ်လိုက်တာလို့ မဆိုလိုဘူးဆိုတာ သိထားဖို့ အရေးကြီးပါတယ်။ အဲဒီကိစ္စမျိုးမှာ — [အပိုင်း 20.16](/docs/postgresql/client-authentication-problems) မှာ ပြထားသလို — မတူညီတဲ့ message တစ်ခု ထွက်လာပါလိမ့်မယ်။) `Connection timed out` လို တခြား error messages တွေက — network connectivity (network ချိတ်ဆက်မှု) မရှိခြင်း ဒါမှမဟုတ် firewall က connection ကို ပိတ်ဆို့နေတာလိုမျိုး — ပိုပြီး အခြေခံကျတဲ့ ပြဿနာတွေကို ညွှန်ပြနိုင်ပါတယ်။
