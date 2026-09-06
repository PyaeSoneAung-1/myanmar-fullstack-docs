---
title: "SQL Dump (SQL dump ထုတ်ယူခြင်း)"
description: "PostgreSQL database များကို SQL dump ဖြင့် backup ပြုလုပ်ခြင်း — pg_dump ၏ အခြေခံ အသုံးပြုမှုနှင့် လုပ်ဆောင်ပုံ (SQL commands ဖိုင် ထုတ်လုပ်ခြင်း, standard output, client application အဖြစ် လုပ်ဆောင်ခြင်း, `-h`/`-p`/`-U` options များ, `PGHOST`/`PGPORT`/`PGUSER` environment variables များ, internally consistent snapshot, version/architecture အသစ်များဆီ ပြန်လည် load လုပ်နိုင်ခြင်း), dump restore ပြုလုပ်ခြင်း (psql, `-X`, `ON_ERROR_STOP`, `-1`/`--single-transaction`, pg_restore, pipe ဖြင့် server တစ်ခုမှ တစ်ခုဆီ တိုက်ရိုက် ကူးပြောင်းခြင်း, template0 ဆိုင်ရာ သတိပြုချက်), pg_dumpall ဖြင့် cluster တစ်ခုလုံး၏ dump နှင့် `--globals-only` option, ကြီးမားသော databases များအတွက် gzip/split/custom dump format/parallel dump နည်းလမ်းများ အကြောင်း ရှင်းလင်းချက်"
order: 183
source: "https://www.postgresql.org/docs/current/backup-dump.html"
status: translated
updated: 2026-09-06
---

## 25.1. SQL Dump (SQL dump ထုတ်ယူခြင်း)

- **25.1.1. Restoring the Dump (dump ကို ပြန်လည် ထည့်သွင်းခြင်း)**
- **25.1.2. Using pg_dumpall (pg_dumpall အသုံးပြုခြင်း)**
- **25.1.3. Handling Large Databases (ကြီးမားသော databases များကို ကိုင်တွယ်ခြင်း)**

ဒီ dump နည်းလမ်းရဲ့ နောက်ကွယ်က အယူအဆကတော့ — server ဆီ ပြန်လည် ထည့်သွင်း (feed back) လုပ်လိုက်တဲ့အခါ — dump လုပ်ခဲ့တဲ့ အချိန်က ရှိခဲ့တဲ့ အခြေအနေ အတိုင်း database ကို ပြန်လည် ဖန်တီးပေးမယ့် — SQL commands တွေ ပါဝင်တဲ့ ဖိုင်တစ်ခုကို ထုတ်လုပ်ဖို့ ဖြစ်ပါတယ်။ ဒီရည်ရွယ်ချက်အတွက် PostgreSQL က utility program တစ်ခုဖြစ်တဲ့ [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) ကို ထောက်ပံ့ပေးပါတယ်။ ဒီ command ရဲ့ အခြေခံ အသုံးပြုပုံကတော့:

```sql
pg_dump dbname > dumpfile
```

မြင်တဲ့အတိုင်းပဲ — pg_dump က သူ့ရဲ့ ရလဒ်ကို standard output (standard output — ပုံမှန် ထုတ်ပေးမှု) ဆီ ရေးသားပါတယ်။ ဒါက ဘယ်လို အသုံးဝင်လဲဆိုတာကို အောက်မှာ တွေ့ရမှာ ဖြစ်ပါတယ်။ အပေါ်က command က text ဖိုင် တစ်ခုကို ဖန်တီးပေးပေမယ့် — pg_dump က object များ ပြန်လည် ထည့်သွင်းခြင်းကို parallelism (အပြိုင် လုပ်ဆောင်မှု) နဲ့ ပိုမို သေးစိတ် ထိန်းချုပ်မှု (more fine-grained control) ခွင့်ပြုပေးတဲ့ — အခြား formats တွေနဲ့လည်း ဖိုင်တွေ ဖန်တီးနိုင်ပါတယ်။

pg_dump က သာမန် PostgreSQL client application (client application — client ဘက်က application) တစ်ခုပဲ ဖြစ်ပါတယ် (အထူးသဖြင့် ထက်မြက်တဲ့ တစ်ခု ဖြစ်ပေမယ့်)။ ဒါက ဆိုလိုတာက — database ကို ဝင်ရောက်ခွင့် ရှိတဲ့ — ဘယ် remote host (ဝေးလံသော host) ကနေမဆို ဒီ backup လုပ်ငန်းစဉ်ကို လုပ်ဆောင်နိုင်ပါတယ်။ ဒါပေမယ့် pg_dump က အထူး permissions (အခွင့်ထူး ခွင့်ပြုချက်များ) တွေနဲ့ အလုပ်လုပ်တာ မဟုတ်ဘူးဆိုတာ သတိရပါ။ အထူးသဖြင့် — backup လုပ်ချင်တဲ့ tables တွေ အားလုံးအပေါ် ဖတ်ခွင့် (read access) ရှိရမှာ ဖြစ်လို့ — database တစ်ခုလုံးကို backup လုပ်ဖို့ဆိုရင် — database superuser (database ၏ အကြီးအကဲ user) အနေနဲ့ run လုပ်ရလေ့ ရှိပါတယ်။ (Database တစ်ခုလုံးကို backup လုပ်ဖို့ လုံလောက်တဲ့ အခွင့်ထူးတွေ မရှိဘူးဆိုရင် — `-n schema` ဒါမှမဟုတ် `-t table` လို options တွေကို သုံးပြီး — သင့်မှာ ဝင်ရောက်ခွင့် ရှိတဲ့ database ရဲ့ အစိတ်အပိုင်း တွေကိုတော့ backup လုပ်နိုင်ပါသေးတယ်။)

pg_dump က ဘယ် database server ကို ဆက်သွယ်ရမလဲ သတ်မှတ်ဖို့ဆိုရင် — `-h host` နဲ့ `-p port` ဆိုတဲ့ command line options တွေကို သုံးပါ။ Default host ကတော့ local host (ပြည်တွင်း host) ဒါမှမဟုတ် သင့် `PGHOST` environment variable (ပတ်ဝန်းကျင် variable) က သတ်မှတ်တဲ့ host ပဲ ဖြစ်ပါတယ်။ အလားတူပဲ — default port ကို `PGPORT` environment variable က ညွှန်ပြပြီး — အဲဒါ မရှိဘူးဆိုရင်တော့ — compiled-in default (program ထဲ ကြိုတင် ထည့်သွင်းထားသော default) က ညွှန်ပြပါတယ်။ (အဆင်ပြေစွာပဲ — server မှာလည်း ပုံမှန်အားဖြင့် တူညီတဲ့ compiled-in default ရှိပါတယ်။)

တခြား PostgreSQL client application တွေလိုပဲ — pg_dump က default အနေနဲ့ — လက်ရှိ operating system user name နဲ့ တူညီတဲ့ — database user name နဲ့ connect လုပ်ပါတယ်။ ဒါကို ကျော်လွှားဖို့ဆိုရင် — `-U` option ကို သတ်မှတ်ပါ ဒါမှမဟုတ် `PGUSER` environment variable ကို သတ်မှတ်ပါ။ pg_dump ရဲ့ connections တွေက ပုံမှန် client authentication (client စစ်မှန်ကြောင်း စိစစ်ခြင်း) ယန္တရားတွေရဲ့ ဘာသာရပ် ဖြစ်တယ်ဆိုတာ သတိရပါ (အဲဒီ ယန္တရားတွေကို [အခန်း 20](https://www.postgresql.org/docs/current/client-authentication.html) မှာ ဖော်ပြထားပါတယ်)။

နောက်ပိုင်းမှာ ဖော်ပြမယ့် တခြား backup နည်းလမ်းတွေထက် pg_dump ရဲ့ အရေးပါတဲ့ အားသာချက် တစ်ခုကတော့ — file-level backups တွေရော continuous archiving (စဉ်ဆက်မပြတ် မှတ်တမ်း သိမ်းဆည်းခြင်း) ရောက server version ပေါ်မှာ အလွန် အထူး မှီခိုနေပေမယ့် — pg_dump ရဲ့ output ကိုတော့ ယေဘုယျအားဖြင့် PostgreSQL ရဲ့ ပိုအသစ်တဲ့ version တွေထဲကို ပြန်လည် load လုပ်နိုင်တာ ဖြစ်ပါတယ်။ pg_dump က — 32-bit server ကနေ 64-bit server ဆီ ပြောင်းတာလို — database တစ်ခုကို မတူညီတဲ့ machine architecture (စက်၏ တည်ဆောက်ပုံ) တစ်ခုဆီ လွှဲပြောင်းတဲ့အခါ အလုပ်လုပ်နိုင်တဲ့ တစ်ခုတည်းသော နည်းလမ်းလည်း ဖြစ်ပါတယ်။

pg_dump က ဖန်တီးတဲ့ dumps တွေက internally consistent (အတွင်းပိုင်း ကိုက်ညီမှု ရှိသော) ဖြစ်ပါတယ် — ဆိုလိုတာက — dump က pg_dump စတင် run လုပ်တဲ့ အချိန်က database ရဲ့ snapshot (ထိုအခိုက် မြင်ရသော ပုံရိပ်) တစ်ခုကို ကိုယ်စားပြုပါတယ်။ pg_dump က အလုပ်လုပ်နေတဲ့ အချိန်အတွင်း database ပေါ်က တခြား လုပ်ဆောင်မှုတွေကို ပိတ်ဆို့ (block) လုပ်တာ မဟုတ်ပါဘူး။ (ခြွင်းချက်တွေကတော့ — exclusive lock (သီးသန့် lock) တစ်ခုနဲ့ လုပ်ဆောင်ရတဲ့ — `ALTER TABLE` ပုံစံ အများစုလို — လုပ်ဆောင်မှုတွေပဲ ဖြစ်ပါတယ်။)

### 25.1.1. Restoring the Dump (dump ကို ပြန်လည် ထည့်သွင်းခြင်း)

pg_dump က ဖန်တီးတဲ့ text ဖိုင်တွေကို — psql program က သူ့ရဲ့ default settings တွေကို သုံးပြီး ဖတ်ဖို့ ရည်ရွယ်ထားပါတယ်။ Text dump တစ်ခုကို restore (ပြန်လည် ထည့်သွင်း) လုပ်ဖို့ ယေဘုယျ command ပုံစံကတော့

```sql
psql -X dbname < dumpfile
```

ဒီမှာ `dumpfile` က pg_dump command ရဲ့ output ဖိုင် ဖြစ်ပါတယ်။ `dbname` database ကို ဒီ command က ဖန်တီးပေးမှာ မဟုတ်လို့ — psql ကို run လုပ်ခင် `template0` ကနေ ကိုယ်တိုင် ဖန်တီးထားရပါမယ် (ဥပမာ — `createdb -T template0 dbname` နဲ့)။ psql က သူ့ရဲ့ default settings တွေနဲ့ run ဖြစ်အောင် သေချာစေဖို့ — `-X` (`--no-psqlrc`) option ကို သုံးပါ။ ဆက်သွယ်ရမယ့် database server နဲ့ သုံးရမယ့် user name ကို သတ်မှတ်ဖို့ — psql က pg_dump နဲ့ ဆင်တူတဲ့ options တွေကို ထောက်ပံ့ပါတယ်။ အသေးစိတ်အတွက် [psql](https://www.postgresql.org/docs/current/app-psql.html) reference page (ရည်ညွှန်း စာမျက်နှာ) ကို ကြည့်ပါ။

Text မဟုတ်တဲ့ ဖိုင် dumps တွေကိုတော့ [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) utility ကို သုံးပြီး restore လုပ်ရပါမယ်။

SQL dump တစ်ခုကို restore မလုပ်ခင် — dump လုပ်ထားတဲ့ database ထဲမှာ objects တွေကို ပိုင်ဆိုင်တဲ့ ဒါမှမဟုတ် objects တွေပေါ်မှာ permissions (ခွင့်ပြုချက်များ) ပေးအပ်ခံရတဲ့ users တွေ အားလုံး — ရှိပြီးသား ဖြစ်ရပါမယ်။ မရှိဘူးဆိုရင် — restore က objects တွေကို မူရင်း ပိုင်ဆိုင်မှု (ownership) နဲ့/သို့မဟုတ် permissions တွေနဲ့ ပြန်လည် ဖန်တီးဖို့ ကျရှုံးပါလိမ့်မယ်။ (တခါတရံ ဒါက သင်လိုချင်တဲ့ အရာပဲ ဖြစ်ပေမယ့် — များသောအားဖြင့်တော့ မဟုတ်ပါဘူး။)

Default အနေနဲ့ — psql script က SQL error (SQL အမှား) တစ်ခု ကြုံတွေ့ပြီးနောက်မှာလည်း ဆက်လက် execute (လုပ်ဆောင်) လုပ်ပါတယ်။ အဲဒီ အပြုအမူကို ပြောင်းလဲဖို့ — psql ကို `ON_ERROR_STOP` variable သတ်မှတ်ထားပြီး run လုပ်ချင်နိုင်ပြီး — SQL error တစ်ခု ဖြစ်ရင် psql က exit status (ထွက်ပေါက် အခြေအနေ) 3 နဲ့ ထွက်သွားစေနိုင်ပါတယ်:

```sql
psql -X --set ON_ERROR_STOP=on dbname < dumpfile
```

ဘယ်လိုပဲ ဖြစ်ဖြစ် — သင့်မှာ တစ်စိတ်တစ်ပိုင်းပဲ restore လုပ်ပြီးတဲ့ database တစ်ခု ရှိမှာ ဖြစ်ပါတယ်။ တနည်းအားဖြင့် — dump တစ်ခုလုံးကို transaction တစ်ခုတည်း (single transaction) အနေနဲ့ restore လုပ်ဖို့ သတ်မှတ်နိုင်ပြီး — အဲဒါဆိုရင် restore က လုံးဝ ပြီးမြောက်တာ ဒါမှမဟုတ် လုံးဝ roll back (ပြန်ရုပ်သိမ်း) ဖြစ်တာ နှစ်မျိုးထဲက တစ်မျိုးပဲ ဖြစ်ပါတယ်။ ဒီ mode ကို psql ဆီ `-1` ဒါမှမဟုတ် `--single-transaction` command-line options တွေ ပေးပို့ခြင်းအားဖြင့် သတ်မှတ်နိုင်ပါတယ်။ ဒီ mode ကို သုံးတဲ့အခါ — နာရီ ပေါင်းများစွာ run နေပြီးသား restore တစ်ခုကို — နည်းနည်းလေး error ကတောင် roll back ဖြစ်စေနိုင်တာ သတိပြုပါ။ ဒါပေမယ့် — တစ်စိတ်တစ်ပိုင်း restore လုပ်ပြီးတဲ့ dump တစ်ခုပြီးနောက် ရှုပ်ထွေးတဲ့ database တစ်ခုကို လက်နဲ့ သန့်ရှင်းရေး လုပ်ရတာထက်တော့ — ဒါက ပိုပြီး နှစ်သက်စရာ ဖြစ်နေနိုင်ပါသေးတယ်။

pg_dump နဲ့ psql တို့ရဲ့ pipes (ပိုက်လိုင်းများ) ဆီ ရေးသားနိုင်/ဖတ်နိုင်တဲ့ စွမ်းရည်က — database တစ်ခုကို server တစ်ခုကနေ နောက်တစ်ခုဆီ တိုက်ရိုက် dump လုပ်ဖို့ ဖြစ်နိုင်စေပါတယ် — ဥပမာ:

```sql
pg_dump -h host1 dbname | psql -X -h host2 dbname
```

> **အရေးကြီး:** pg_dump က ထုတ်လုပ်တဲ့ dumps တွေက `template0` နဲ့ ဆက်စပ် (relative) နေပါတယ်။ ဒါက ဆိုလိုတာက — `template1` ကနေတစ်ဆင့် ထည့်သွင်းထားတဲ့ languages (ဘာသာစကားများ), procedures (လုပ်ဆောင်မှု စနစ်များ) စတာတွေ အားလုံးကိုပါ pg_dump က dump လုပ်မှာ ဖြစ်ပါတယ်။ ရလဒ်အနေနဲ့ — restore လုပ်တဲ့အခါ — customize (စိတ်ကြိုက် ပြင်ဆင်) လုပ်ထားတဲ့ `template1` တစ်ခုကို သုံးနေတယ်ဆိုရင် — အပေါ်က ဥပမာထဲကလိုပဲ — empty database (ဗလာ database) ကို `template0` ကနေ ဖန်တီးရပါမယ်။

Backup တစ်ခုကို restore လုပ်ပြီးတဲ့နောက် — query optimizer (query များကို အကောင်းဆုံး ရွေးချယ် လုပ်ဆောင်ပေးသူ) မှာ အသုံးဝင်တဲ့ statistics (စာရင်းအင်းများ) ရှိစေဖို့ — database တစ်ခုချင်းစီပေါ်မှာ [`ANALYZE`](/docs/postgresql/sql-analyze) ကို run လုပ်တာ ပညာရှိရာ ရောက်ပါတယ်; အသေးစိတ်အတွက် [အပိုင်း 24.1.3](/docs/postgresql/routine-vacuuming) နဲ့ [အပိုင်း 24.1.6](/docs/postgresql/routine-vacuuming) ကို ကြည့်ပါ။ Data အမြောက်အများကို PostgreSQL ထဲ ထိရောက်စွာ load လုပ်ပုံအတွက် နောက်ထပ် အကြံပြုချက်တွေကို [အပိုင်း 14.4](/docs/postgresql/populate) မှာ ကိုးကား ကြည့်ရှုပါ။

### 25.1.2. Using pg_dumpall (pg_dumpall အသုံးပြုခြင်း)

pg_dump က တစ်ကြိမ်မှာ database တစ်ခုတည်းကိုပဲ dump လုပ်ပြီး — roles (အခန်းကဏ္ဍများ) ဒါမှမဟုတ် tablespaces (tablespace များ) အကြောင်း အချက်အလက်တွေကိုတော့ dump မလုပ်ပါဘူး (အကြောင်းကတော့ အဲဒါတွေက database တစ်ခုချင်းစီနဲ့ ဆိုင်တာ မဟုတ်ဘဲ — cluster တစ်ခုလုံးနဲ့ ဆိုင်လို့ပါ)။ Database cluster တစ်ခုရဲ့ ပါဝင်မှု တစ်ခုလုံးကို အဆင်ပြေစွာ dump လုပ်နိုင်ဖို့ — [pg_dumpall](https://www.postgresql.org/docs/current/app-pg-dumpall.html) program ကို ထောက်ပံ့ပေးပါတယ်။ pg_dumpall က cluster တစ်ခုထဲက database တစ်ခုချင်းစီကို backup လုပ်ပြီး — role နဲ့ tablespace definitions (သတ်မှတ်ချက်များ) လို — cluster တစ်ခုလုံးနဲ့ ဆိုင်တဲ့ data တွေကိုလည်း ထိန်းသိမ်း ပေးပါတယ်။ ဒီ command ရဲ့ အခြေခံ အသုံးပြုပုံကတော့:

```sql
pg_dumpall > dumpfile
```

ရလဒ် dump ကို psql နဲ့ restore လုပ်နိုင်ပါတယ်:

```sql
psql -X -f dumpfile postgres
```

(တကယ်တော့ — စတင်ဖို့ ရှိပြီးသား database နာမည် ဘယ်ခုကိုမဆို သတ်မှတ်နိုင်ပေမယ့် — empty cluster (ဗလာ cluster) တစ်ခုထဲကို load လုပ်နေတယ်ဆိုရင် `postgres` ကို သုံးလေ့ ရှိပါတယ်။) pg_dumpall dump တစ်ခုကို restore လုပ်တဲ့အခါ — role နဲ့ tablespace အချက်အလက်တွေကို restore လုပ်ဖို့ လိုအပ်လို့ — database superuser access (database superuser ဝင်ရောက်ခွင့်) အမြဲတမ်း ရှိရန် လိုအပ်ပါတယ်။ Tablespaces တွေ သုံးနေတယ်ဆိုရင် — dump ထဲက tablespace paths တွေက installation အသစ်အတွက် သင့်လျော်ကြောင်း သေချာ စစ်ဆေးပါ။

pg_dumpall က — roles, tablespaces နဲ့ empty databases တွေကို ပြန်လည် ဖန်တီးဖို့ commands တွေ ထုတ်လွှတ်ပြီး — database တစ်ခုချင်းစီအတွက် pg_dump ကို ခေါ်ယူခြင်းအားဖြင့် အလုပ်လုပ်ပါတယ်။ ဒါက ဆိုလိုတာက — database တစ်ခုချင်းစီဟာ internally consistent ဖြစ်မယ် ဆိုပေမယ့် — database အမျိုးမျိုးရဲ့ snapshots တွေကတော့ sync (ထပ်တူကျမှု) မဖြစ်ကြပါဘူး။

Cluster တစ်ခုလုံးနဲ့ ဆိုင်တဲ့ data တွေကို — pg_dumpall ရဲ့ `--globals-only` option ကို သုံးပြီး တစ်ခုတည်း သီးသန့် dump လုပ်နိုင်ပါတယ်။ Database တစ်ခုချင်းစီပေါ်မှာ pg_dump command ကို run လုပ်နေတယ်ဆိုရင် — cluster ကို အပြည့်အဝ backup လုပ်ဖို့ ဒါ လိုအပ်ပါတယ်။

### 25.1.3. Handling Large Databases (ကြီးမားသော databases များကို ကိုင်တွယ်ခြင်း)

Operating systems တချို့မှာ — ကြီးမားတဲ့ pg_dump output ဖိုင်တွေ ဖန်တီးတဲ့အခါ ပြဿနာ ဖြစ်စေတတ်တဲ့ — file size အများဆုံး ကန့်သတ်ချက်တွေ ရှိပါတယ်။ ကံကောင်းစွာပဲ — pg_dump က standard output ဆီ ရေးသားလို့ ရတာမို့ — ဒီ ဖြစ်နိုင်ခြေ ရှိတဲ့ ပြဿနာကို ရှောင်ရှားဖို့ standard Unix tools တွေကို သုံးနိုင်ပါတယ်။ ဖြစ်နိုင်တဲ့ နည်းလမ်း အများအပြား ရှိပါတယ်:

**Compressed dumps သုံးခြင်း** — သင်ကြိုက်နှစ်သက်ရာ compression program (ချုံ့မှု program) ကို သုံးနိုင်ပါတယ် — ဥပမာ — gzip:

```sql
pg_dump dbname | gzip > filename.gz
```

ပြန်လည် load လုပ်ဖို့:

```sql
gunzip -c filename.gz | psql dbname
```

သို့မဟုတ်:

```sql
cat filename.gz | gunzip | psql dbname
```

**`split` သုံးခြင်း** — `split` command က output ကို — အောက်ခံ file system အတွက် လက်ခံနိုင်လောက်တဲ့ အရွယ်အစား ရှိတဲ့ — ဖိုင်ငယ်တွေအဖြစ် ပိုင်းခြားနိုင်စေပါတယ်။ ဥပမာ — 2 gigabyte အပိုင်း (chunk) တွေ ဖြစ်အောင်လုပ်ဖို့ဆိုရင်:

```sql
pg_dump dbname | split -b 2G - filename
```

ပြန်လည် load လုပ်ဖို့:

```sql
cat filename* | psql dbname
```

GNU split ကို သုံးနေတယ်ဆိုရင် — အဲဒါနဲ့ gzip ကို တွဲပြီး သုံးဖို့ ဖြစ်နိုင်ပါတယ်:

```sql
pg_dump dbname | split -b 2G --filter='gzip > $FILE.gz'
```

အဲဒါကို `zcat` သုံးပြီး restore လုပ်နိုင်ပါတယ်။

**pg_dump ၏ custom dump format ကို သုံးခြင်း** — PostgreSQL ကို zlib compression library (ချုံ့မှု စာကြည့်တိုက်) တပ်ဆင်ထားတဲ့ system ပေါ်မှာ တည်ဆောက်ထားတယ်ဆိုရင် — custom dump format က output ဖိုင်ထဲကို ရေးသားတဲ့အခါ data တွေကို ချုံ့ (compress) ပေးပါလိမ့်မယ်။ ဒါက `gzip` သုံးတာနဲ့ ဆင်တူတဲ့ dump ဖိုင် အရွယ်အစားတွေကို ထုတ်ပေးပေမယ့် — tables တွေကို ရွေးချယ်ပြီး (selectively) restore လုပ်နိုင်တဲ့ ထပ်ဆောင်း အားသာချက် ရှိပါတယ်။ အောက်ပါ command က custom dump format ကို သုံးပြီး database တစ်ခုကို dump လုပ်ပါတယ်:

```sql
pg_dump -Fc dbname > filename
```

Custom-format dump တစ်ခုက psql အတွက် script တစ်ခု မဟုတ်ဘဲ — pg_restore နဲ့ပဲ restore လုပ်ရပါတယ် — ဥပမာ:

```sql
pg_restore -d dbname filename
```

အသေးစိတ်အတွက် [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) နဲ့ [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) reference pages တွေကို ကြည့်ပါ။

အလွန် ကြီးမားတဲ့ databases တွေအတွက် — `split` ကို အခြား နည်းလမ်း နှစ်ခုထဲက တစ်ခုနဲ့ ပေါင်းစပ် သုံးဖို့ လိုအပ်နိုင်ပါတယ်။

**pg_dump ၏ parallel dump feature ကို သုံးခြင်း** — ကြီးမားတဲ့ database တစ်ခုရဲ့ dump ကို အရှိန်မြှင့်ဖို့ — pg_dump ရဲ့ parallel mode (အပြိုင် ပုံစံ) ကို သုံးနိုင်ပါတယ်။ ဒါက tables အများအပြားကို တစ်ပြိုင်နက် dump လုပ်ပေးပါလိမ့်မယ်။ Parallelism ရဲ့ အတိုင်းအတာကို `-j` parameter နဲ့ ထိန်းချုပ်နိုင်ပါတယ်။ Parallel dumps တွေကို “directory” archive format အတွက်ပဲ ထောက်ပံ့ပါတယ်။

```sql
pg_dump -j num -F d -f out.dir dbname
```

Dump တစ်ခုကို အပြိုင် restore လုပ်ဖို့ `pg_restore -j` ကို သုံးနိုင်ပါတယ်။ ဒါက — `pg_dump -j` နဲ့ ဖန်တီးထားတာ ဟုတ်သည် ဖြစ်စေ မဟုတ်သည် ဖြစ်စေ — “custom” ဒါမှမဟုတ် “directory” archive mode ဘယ်ဟာပဲ ဖြစ်ဖြစ် — archive တစ်ခုခုအတွက် အလုပ်လုပ်ပါလိမ့်မယ်။
