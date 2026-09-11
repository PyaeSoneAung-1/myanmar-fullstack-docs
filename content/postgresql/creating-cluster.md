---
title: "Creating a Database Cluster (database cluster တစ်ခု ဖန်တီးခြင်း)"
description: "Database cluster ဆိုတာ ဘာလဲ — data directory ကို `initdb` ဖြင့် initialize လုပ်ခြင်း (`-D` option, `PGDATA` environment variable, `pg_ctl initdb`), data directory ၏ access permissions နှင့် mode များ (`0700`/`0600`, `0750`/`0640`), superuser အတွက် password သတ်မှတ်ခြင်း, default locale နှင့် character set encoding များ, secondary file systems နှင့် NFS အသုံးပြုမှု အကြောင်း ရှင်းလင်းချက်"
order: 145
source: "https://www.postgresql.org/docs/current/creating-cluster.html"
status: translated
updated: 2026-09-06
---

## 18.2. Creating a Database Cluster (database cluster တစ်ခု ဖန်တီးခြင်း)

- **18.2.1. Use of Secondary File Systems (ဒုတိယ file systems များ အသုံးပြုခြင်း)**
- **18.2.2. File Systems (file systems များ)**

ဘာမှ မလုပ်ခင် — disk ပေါ်မှာ database သိုလှောင်မှု ဧရိယာ (database storage area) တစ်ခုကို ဦးစွာ initialize (ကနဦး ပြင်ဆင်) လုပ်ထားရပါမယ်။ ဒါကို *database cluster* လို့ ခေါ်ပါတယ်။ (SQL standard ကတော့ catalog cluster ဆိုတဲ့ ဝေါဟာရကို သုံးပါတယ်။) Database cluster ဆိုတာ — run နေတဲ့ database server instance တစ်ခုတည်းက စီမံခန့်ခွဲတဲ့ databases တွေရဲ့ အစုတစ်ခု ဖြစ်ပါတယ်။ Initialize လုပ်ပြီးတာနဲ့ — database cluster တစ်ခုထဲမှာ `postgres` လို့ နာမည်ပေးထားတဲ့ database တစ်ခု ပါဝင်မှာ ဖြစ်ပြီး — အဲဒါက utilities, users (သုံးစွဲသူများ) နဲ့ third-party applications (ပြင်ပ application များ) တွေအတွက် default database အဖြစ် သုံးဖို့ ရည်ရွယ်ထားပါတယ်။ Database server ကိုယ်တိုင်ကတော့ `postgres` database တည်ရှိဖို့ မလိုအပ်ပါဘူး — ဒါပေမယ့် ပြင်ပ utility program အများအပြားက အဲဒါ တည်ရှိတယ်လို့ ယူဆထားကြပါတယ်။ Initialize လုပ်ချိန်အတွင်း cluster တစ်ခုစီထဲမှာ `template1` နဲ့ `template0` လို့ နာမည်ပေးထားတဲ့ database နှစ်ခုကို ထပ်မံ ဖန်တီးပါတယ်။ နာမည်တွေ ညွှန်ပြနေသလိုပဲ — ဒါတွေက နောက်ပိုင်းမှာ ဖန်တီးမယ့် databases တွေအတွက် templates (ပုံစံပြား) အဖြစ် သုံးမှာ ဖြစ်ပြီး — တကယ့် အလုပ်တွေအတွက်တော့ မသုံးသင့်ပါဘူး။ (Cluster တစ်ခုအတွင်းမှာ database အသစ်တွေ ဖန်တီးခြင်းအကြောင်း အချက်အလက်အတွက် [အခန်း 22](https://www.postgresql.org/docs/current/managing-databases.html) ကို ကြည့်ပါ။)

File system အရ ပြောရရင် — database cluster ဆိုတာ data တွေ အားလုံးကို သိုလှောင်မယ့် directory (လမ်းညွှန် ဖိုင်တွဲ) တစ်ခုတည်း ဖြစ်ပါတယ်။ ဒါကို *data directory* ဒါမှမဟုတ် *data area* လို့ ခေါ်ပါတယ်။ သင့် data တွေကို ဘယ်နေရာမှာ သိုလှောင်မလဲဆိုတာက — သင့်အပေါ်မှာပဲ လုံးဝ မူတည်ပါတယ်။ Default ဆိုတာ မရှိပါဘူး — ဒါပေမယ့် `/usr/local/pgsql/data` ဒါမှမဟုတ် `/var/lib/pgsql/data` လို နေရာတွေကတော့ လူကြိုက်များပါတယ်။ Data directory ကို မသုံးခင် — PostgreSQL နဲ့အတူ တပ်ဆင်လာတဲ့ [initdb](https://www.postgresql.org/docs/current/app-initdb.html) program ကို သုံးပြီး — ဦးစွာ initialize လုပ်ထားရပါမယ်။

Pre-packaged PostgreSQL version တစ်ခုကို သုံးနေတယ်ဆိုရင် — data directory ကို ဘယ်နေရာမှာ ထားရမလဲဆိုတဲ့ သီးခြား convention (စံနှုန်း လုပ်ထုံး) တစ်ခု ရှိနိုင်သလို — data directory ဖန်တီးဖို့ script တစ်ခုကိုလည်း ပါ ပေးထားနိုင်ပါတယ်။ အဲဒီလို ဆိုရင် — `initdb` ကို တိုက်ရိုက် run လုပ်တာထက် — အဲဒီ script ကိုပဲ ဦးစားပေး သုံးသင့်ပါတယ်။ အသေးစိတ်အတွက် package-level documentation (package နဲ့အတူ ပါလာတဲ့ စာရွက်စာတမ်း) ကို ကြည့်ပါ။

Database cluster တစ်ခုကို ကိုယ်တိုင် initialize လုပ်ဖို့ဆိုရင် — `initdb` ကို run လုပ်ပြီး — database cluster ရဲ့ လိုချင်တဲ့ file system တည်နေရာကို `-D` option နဲ့ သတ်မှတ်ပေးပါ — ဥပမာ:

```
$ initdb -D /usr/local/pgsql/data
```

ဒီ command ကို — အရင် section မှာ ဖော်ပြခဲ့တဲ့ PostgreSQL user account အနေနဲ့ log in ဝင်ထားစဉ်မှာ run လုပ်ရမယ်ဆိုတာ သတိပြုပါ။

> **အကြံပြုချက်:** `-D` option ရဲ့ အစားထိုး တစ်မျိုးအနေနဲ့ — `PGDATA` ဆိုတဲ့ environment variable (ပတ်ဝန်းကျင် variable) ကိုလည်း သတ်မှတ်ထားလို့ ရပါတယ်။

တနည်းအားဖြင့် — `initdb` ကို [pg_ctl](https://www.postgresql.org/docs/current/app-pg-ctl.html) program ကနေလည်း run လုပ်နိုင်ပါတယ် — ဒီလိုမျိုး:

```
$ pg_ctl -D /usr/local/pgsql/data initdb
```

Server ကို စတင်ခြင်းနဲ့ ရပ်တန့်ခြင်းအတွက် `pg_ctl` ကို သုံးနေတယ်ဆိုရင် ([အပိုင်း 18.3](/docs/postgresql/server-start) ကို ကြည့်ပါ) — ဒီနည်းလမ်းက ပိုပြီး အလိုလို သိလွယ်စေနိုင်ပါတယ် — အကြောင်းကတော့ database server instance ကို စီမံခန့်ခွဲဖို့ သင်သုံးရမယ့် တစ်ခုတည်းသော command က `pg_ctl` တစ်ခုတည်း ဖြစ်သွားလို့ပါ။

`initdb` က — သင်သတ်မှတ်လိုက်တဲ့ directory မရှိသေးဘူးဆိုရင် — အဲဒါကို ဖန်တီးဖို့ ကြိုးစားပါလိမ့်မယ်။ ဒါပေမယ့် — `initdb` မှာ parent directory (မိခင် directory) ထဲ ရေးသားဖို့ permission (ခွင့်ပြုချက်) မရှိဘူးဆိုရင် — ဒါ ကျရှုံးမှာ ဖြစ်ပါတယ်။ PostgreSQL user က data directory တင် မကဘဲ — သူ့ရဲ့ parent directory ကိုပါ ပိုင်ဆိုင်ထားတာက ယေဘုယျအားဖြင့် အကြံပြုလိုပါတယ် — ဒါဆိုရင် ဒီပြဿနာ မဖြစ်တော့ပါဘူး။ လိုချင်တဲ့ parent directory ကိုယ်တိုင်လည်း မရှိသေးဘူးဆိုရင် — grandparent directory (အဘိုး directory) က ရေးလို့ မရတဲ့ (not writable) နေရာ ဖြစ်နေရင် root privileges (root အခွင့်ထူးများ) တွေကို သုံးပြီး — အဲဒါကို အရင်ဆုံး ဖန်တီးဖို့ လိုပါလိမ့်မယ်။ ဒါကြောင့် ဖြစ်စဉ်က ဒီလို ပုံစံ မျိုး ဖြစ်နိုင်ပါတယ်:

```sql
root# mkdir /usr/local/pgsql
root# chown postgres /usr/local/pgsql
root# su postgres
postgres$ initdb -D /usr/local/pgsql/data
```

Data directory ရှိပြီးသား ဖြစ်ပြီး — ဖိုင်တွေ ပါ ပါဝင်နေပြီဆိုရင် — `initdb` က run လုပ်ဖို့ ငြင်းပယ်ပါလိမ့်မယ်; ဒါက ရှိပြီးသား installation တစ်ခုကို မတော်တဆ ပြန်လည် ရေးသား ဖျက်ဆီးမိခြင်း (overwriting) မဖြစ်အောင် ကာကွယ်ဖို့ ဖြစ်ပါတယ်။

Data directory ထဲမှာ database ထဲ သိမ်းဆည်းထားတဲ့ data တွေ အားလုံး ပါဝင်တာမို့ — ခွင့်ပြုချက် မရှိဘဲ ဝင်ရောက်မှု (unauthorized access) ကနေ လုံခြုံအောင် ထားဖို့က မရှိမဖြစ် လိုအပ်ပါတယ်။ ဒါကြောင့် — `initdb` က — PostgreSQL user နဲ့ optional (ထည့်သွင်း ရွေးချယ်နိုင်သော) အနေနဲ့ group ကလွဲလို့ — တခြား လူတိုင်းရဲ့ access permissions တွေကို ရုပ်သိမ်း (revoke) လိုက်ပါတယ်။ Group access ကို enable (ဖွင့်) ထားရင် — read-only (ဖတ်ရုံသက်သက်) ဖြစ်ပါတယ်။ ဒါက — cluster owner နဲ့ group တူတဲ့ — privilege မရှိတဲ့ (unprivileged) user တစ်ယောက်ကို — cluster data တွေရဲ့ backup (အရန် မိတ္တူ) တစ်ခု ယူခွင့် ဒါမှမဟုတ် read access ပဲ လိုအပ်တဲ့ တခြား လုပ်ဆောင်ချက်တွေ လုပ်ခွင့် ပေးပါတယ်။

ရှိပြီးသား cluster တစ်ခုမှာ group access ကို enable ဒါမှမဟုတ် disable (ပိတ်) လုပ်တာက — cluster ကို ဦးစွာ ရပ်တန့်ပြီး — PostgreSQL ကို ပြန်မစတင်ခင် — directory တွေနဲ့ ဖိုင်တွေ အားလုံးပေါ်မှာ သင့်လျော်တဲ့ mode (ခွင့်ပြုချက် ပုံစံ) ကို သတ်မှတ်ဖို့ လိုအပ်တာ သတိပြုပါ။ မဟုတ်ရင် — data directory ထဲမှာ mode အမျိုးမျိုး ရောထွေး နေနိုင်ပါတယ်။ Owner တစ်ယောက်တည်းပဲ ဝင်ရောက်ခွင့် ရှိတဲ့ clusters တွေအတွက် — သင့်လျော်တဲ့ modes တွေက directories တွေအတွက် `0700` ဖြစ်ပြီး — files တွေအတွက် `0600` ဖြစ်ပါတယ်။ Group က ဖတ်ခွင့်လည်း ရှိတဲ့ clusters တွေအတွက်တော့ — သင့်လျော်တဲ့ modes တွေက directories တွေအတွက် `0750` ဖြစ်ပြီး — files တွေအတွက် `0640` ဖြစ်ပါတယ်။

ဒါပေမယ့် — directory ရဲ့ ပါဝင်စရာတွေ (contents) က လုံခြုံပေမယ့် — default client authentication setup ကတော့ ဘယ် local user ကိုမဆို database ဆီ connect လုပ်ခွင့် — database superuser (database ၏ အကြီးအကဲ user) ဖြစ်လာခွင့်တောင် ပေးပါတယ်။ တခြား local users တွေကို မယုံကြည်ဘူးဆိုရင် — database superuser ကို စကားဝှက် သတ်မှတ်ပေးဖို့ — `initdb` ရဲ့ `-W`, `--pwprompt` ဒါမှမဟုတ် `--pwfile` options တွေထဲက တစ်ခုကို သုံးဖို့ အကြံပြုပါတယ်။ ထို့အပြင် — default `trust` authentication mode ကို အသုံးမပြုမိအောင် — `-A scram-sha-256` ကိုလည်း သတ်မှတ်ပါ; ဒါမှမဟုတ် — `initdb` run လုပ်ပြီး — server ကို ပထမဆုံး အကြိမ် မစတင်ခင် — ဖန်တီး ထုတ်ပေးလိုက်တဲ့ `pg_hba.conf` ဖိုင်ကို ပြုပြင် မွမ်းမံပါ။ (တခြား ကျိုးကြောင်းဆီလျော်တဲ့ နည်းလမ်းတွေထဲမှာ — connections တွေကို ကန့်သတ်ဖို့ `peer` authentication ဒါမှမဟုတ် file system permissions တွေကို သုံးတာ ပါဝင်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အခန်း 20](https://www.postgresql.org/docs/current/client-authentication.html) ကို ကြည့်ပါ။)

`initdb` က database cluster အတွက် default locale (ဒေသသုံး ဘာသာစကား/နိုင်ငံ သတ်မှတ်ချက်) ကိုလည်း initialize လုပ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် — environment (ပတ်ဝန်းကျင်) ထဲက locale settings တွေကို ယူပြီး — initialize လုပ်ထားတဲ့ database ပေါ်ကို သက်ရောက်စေမှာ ဖြစ်ပါတယ်။ Database အတွက် မတူညီတဲ့ locale တစ်ခုကို သတ်မှတ်ဖို့လည်း ဖြစ်နိုင်ပါတယ်; အဲဒီအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အပိုင်း 23.1](https://www.postgresql.org/docs/current/locale.html) မှာ တွေ့နိုင်ပါတယ်။ သီးခြား database cluster တစ်ခုအတွင်းမှာ သုံးတဲ့ default sort order (စီစဉ်မှု အစီအစဉ်) ကို `initdb` က သတ်မှတ်ပြီး — မတူညီတဲ့ sort order သုံးပြီး database အသစ်တွေ ဖန်တီးလို့ ရနိုင်ပေမယ့် — initdb က ဖန်တီးလိုက်တဲ့ template databases တွေမှာ သုံးထားတဲ့ order ကတော့ — အဲဒါတွေကို drop (ဖျက်) ပြီး ပြန်လည် ဖန်တီးခြင်း မရှိဘဲ — ပြောင်းလဲလို့ မရပါဘူး။ ဒါ့အပြင် — `C` ဒါမှမဟုတ် `POSIX` ကလွဲလို့ တခြား locales တွေကို သုံးတာက performance (စွမ်းဆောင်ရည်) အပေါ် သက်ရောက်မှု ရှိပါတယ်။ ဒါကြောင့် — ဒီ ရွေးချယ်မှုကို ပထမအကြိမ်မှာတင် မှန်ကန်စွာ လုပ်ဖို့ အရေးကြီးပါတယ်။

`initdb` က database cluster ရဲ့ default character set encoding (စာလုံးအစု ကုဒ်ပြောင်းခြင်း) ကိုလည်း သတ်မှတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် — ဒါက locale setting နဲ့ ကိုက်ညီအောင် ရွေးချယ်သင့်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 23.3](https://www.postgresql.org/docs/current/multibyte.html) ကို ကြည့်ပါ။

`C` မဟုတ်တဲ့ နဲ့ `POSIX` မဟုတ်တဲ့ locales တွေက — character set စီစဉ်မှုအတွက် operating system ရဲ့ collation library (စာလုံးများ နှိုင်းယှဉ် စီစဉ်မှု စာကြည့်တိုက်) ကို မှီခိုပါတယ်။ ဒါက indexes တွေထဲမှာ သိမ်းဆည်းထားတဲ့ keys တွေရဲ့ အစီအစဉ်ကို ထိန်းချုပ်ပါတယ်။ ဒီအကြောင်းကြောင့် — cluster တစ်ခုက — snapshot restore (snapshot ပြန်ယူခြင်း)၊ binary streaming replication (binary streaming ပုံတူပွားခြင်း)၊ မတူညီတဲ့ operating system တစ်ခု ဒါမှမဟုတ် operating system upgrade (အဆင့်မြှင့်တင်ခြင်း) ကနေတစ်ဆင့် ဖြစ်ဖြစ် — လိုက်ဖက်မှု မရှိတဲ့ collation library version တစ်ခုဆီကို ပြောင်းလို့ မရပါဘူး။

### 18.2.1. Use of Secondary File Systems (ဒုတိယ file systems များ အသုံးပြုခြင်း)

Installation အများအပြားက — machine ရဲ့ “root” volume (အခြေခံ disk ခွဲ) မဟုတ်ဘဲ — တခြား file systems (volumes — disk ခွဲများ) ပေါ်မှာ သူတို့ရဲ့ database clusters တွေကို ဖန်တီးကြပါတယ်။ ဒီလို လုပ်ဖို့ ရွေးချယ်မယ်ဆိုရင် — secondary volume (ဒုတိယ disk ခွဲ) ရဲ့ အပေါ်ဆုံး directory (mount point — တပ်ဆင်မှု အမှတ်) ကို data directory အဖြစ် သုံးဖို့ မကြိုးစားတာက ပိုကောင်းပါတယ်။ အကောင်းဆုံး နည်းလမ်း (best practice) ကတော့ — mount-point directory အတွင်းမှာ — PostgreSQL user က ပိုင်ဆိုင်တဲ့ directory တစ်ခုကို ဖန်တီးပြီး — အဲဒီအတွင်းမှာ data directory ကို ဖန်တီးတာ ဖြစ်ပါတယ်။ ဒါက — အထူးသဖြင့် pg_upgrade လို လုပ်ဆောင်ချက်တွေအတွက် — permissions ပြဿနာတွေကို ရှောင်ရှားပေးပြီး — secondary volume ကို အော့ဖ်လိုင်း (offline) ချလိုက်ရင်လည်း — သန့်ရှင်းတဲ့ ကျရှုံးမှု (clean failure) ဖြစ်စေဖို့ သေချာ စေပါတယ်။

### 18.2.2. File Systems (file systems များ)

ယေဘုယျအားဖြင့် — POSIX semantics (အပြုအမူ စည်းမျဉ်းများ) ရှိတဲ့ file system ဘယ်ခုကိုမဆို PostgreSQL အတွက် သုံးလို့ ရပါတယ်။ Users တွေက — vendor support (ရောင်းချသူရဲ့ ထောက်ပံ့မှု)၊ performance နဲ့ အကျွမ်းဝင်မှု အပါအဝင် — အကြောင်းပြချက် အမျိုးမျိုးနဲ့ file system မတူညီတာတွေကို နှစ်သက်ကြပါတယ်။ အတွေ့အကြုံတွေအရ — တခြား အခြေအနေတွေ အားလုံး တူညီနေရင် — file systems တွေ ပြောင်းလဲရုံ ဒါမှမဟုတ် file system configuration ကို အနည်းငယ် ပြောင်းလဲရုံနဲ့ — ကြီးမားတဲ့ performance ဒါမှမဟုတ် အပြုအမူ ပြောင်းလဲမှုတွေကို မျှော်လင့်လို့ မရပါဘူး။

#### 18.2.2.1. NFS (Network File System)

PostgreSQL data directory ကို သိုလှောင်ဖို့ NFS file system တစ်ခုကို သုံးလို့ ရပါတယ်။ PostgreSQL က NFS file systems တွေအတွက် အထူး ဘာမှ လုပ်ပေးတာ မရှိပါဘူး — ဆိုလိုတာက — NFS က local နဲ့ တိုက်ရိုက် ချိတ်ဆက်ထားတဲ့ drives တွေလိုပဲ ပြုမူမယ်လို့ ယူဆထားတာပါ။ PostgreSQL က NFS ပေါ်မှာ စံမမီတဲ့ အပြုအမူ ရှိတယ်လို့ သိထားတဲ့ — file locking (ဖိုင် သော့ခတ်ခြင်း) လို လုပ်ဆောင်ချက် တစ်ခုခုကိုလည်း အသုံးမပြုပါဘူး။

PostgreSQL နဲ့ NFS သုံးဖို့အတွက် တစ်ခုတည်းသော ခိုင်မာတဲ့ လိုအပ်ချက်ကတော့ — file system ကို `hard` option နဲ့ mount (တပ်ဆင်) ထားဖို့ပါ။ `hard` option နဲ့ဆိုရင် — network ပြဿနာတွေ ရှိနေရင် — processes တွေက အကန့်အသတ် မရှိ “hang” (ရပ်တန့် သွားခြင်း) ဖြစ်နိုင်လို့ — ဒီ configuration က ဂရုတစိုက် စောင့်ကြည့်မှု စနစ်တစ်ခု လိုအပ်ပါလိမ့်မယ်။ `soft` option ကတော့ — network ပြဿနာ ဖြစ်ရင် system calls တွေကို ကြားဖြတ် ရပ်တန့်စေမှာ ဖြစ်ပေမယ့် — PostgreSQL က ဒီလို ကြားဖြတ် ရပ်တန့်ခံရတဲ့ system calls တွေကို ပြန်လုပ်မှာ မဟုတ်ပါဘူး — ဒါကြောင့် ဒီလို ကြားဖြတ် ရပ်တန့်မှု တစ်ခုခုက I/O error (I/O အမှား) တစ်ခုကို အစီရင်ခံတာနဲ့ အဆုံးသတ်ပါလိမ့်မယ်။

`sync` mount option ကို သုံးဖို့တော့ မလိုအပ်ပါဘူး။ `async` option ရဲ့ အပြုအမူက လုံလောက်ပါတယ် — အကြောင်းကတော့ PostgreSQL က write caches (ရေးသားမှု ကက်ရှ်များ) တွေကို ရှင်းထုတ်ဖို့ သင့်လျော်တဲ့ အချိန်တွေမှာ `fsync` calls တွေ ထုတ်ပေးလို့ပါ။ (ဒါက local file system တစ်ခုပေါ်မှာ အလုပ်လုပ်ပုံနဲ့ ဆင်တူပါတယ်။) ဒါပေမယ့် — အဲဒီ option ရှိတဲ့ systems တွေမှာ (အဓိကအားဖြင့် Linux) — NFS server ပေါ်မှာ `sync` export option ကို သုံးဖို့ အခိုင်အမာ အကြံပြုပါတယ်။ မဟုတ်ရင် — NFS client ပေါ်က `fsync` ဒါမှမဟုတ် ၎င်းနဲ့ ညီမျှတဲ့ အရာက — server ပေါ်က အမြဲတမ်း သိုလှောင်မှု (permanent storage) ဆီကို တကယ် ရောက်ရှိဖို့ အာမခံချက် မရှိနိုင်ပါဘူး — အဲဒါက [fsync](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-FSYNC) parameter ကို ပိတ်ထားပြီး run လုပ်နေတာနဲ့ ဆင်တဲ့ corruption (data ပျက်စီးမှု) ကို ဖြစ်စေနိုင်ပါတယ်။ ဒီ mount နဲ့ export options တွေရဲ့ defaults တွေက vendor တွေနဲ့ version တွေကြားမှာ ကွဲပြားတာမို့ — မရေရာမှု (ambiguity) တွေ ရှောင်ရှားဖို့ — ဘယ်လို အခြေအနေမှာမဆို စစ်ဆေးပြီး ဖြစ်နိုင်ရင် အတိအကျ သတ်မှတ်ထားဖို့ အကြံပြုပါတယ်။

ကိစ္စ တချို့မှာ — ပြင်ပ storage product (ပြင်ပ သိုလှောင်မှု ထုတ်ကုန်) တစ်ခုကို NFS ကနေလည်း ဝင်ရောက်လို့ ရသလို — iSCSI လို ပိုနိမ့်တဲ့ အဆင့် protocol (ဆက်သွယ်ရေး စည်းမျဉ်း) တစ်ခုကနေလည်း ဝင်ရောက်လို့ ရနိုင်ပါတယ်။ နောက်ဆုံး ကိစ္စမှာဆိုရင် — storage က block device (block ယူနစ် စက်ပစ္စည်း) တစ်ခုအနေနဲ့ ပေါ်လာပြီး — ရနိုင်တဲ့ file system ဘယ်ခုကိုမဆို အဲဒီပေါ်မှာ ဖန်တီးလို့ ရပါတယ်။ အဲဒီ နည်းလမ်းက — DBA ကို NFS ရဲ့ ထူးခြားချက်တချို့ (idiosyncrasies) ကို ကိုင်တွယ်ရတာကနေ သက်သာစေနိုင်ပေမယ့် — ဝေးလံတဲ့ storage (remote storage) ကို စီမံခန့်ခွဲရတဲ့ ရှုပ်ထွေးမှုက အခြား အဆင့်တွေမှာ ဖြစ်ပေါ်လာတာ သေချာပါတယ်။
