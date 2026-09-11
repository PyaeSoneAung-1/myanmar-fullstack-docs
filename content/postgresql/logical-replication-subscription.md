---
title: "Subscription (စာရင်းသွင်း ချိတ်ဆက်မှု)"
description: "Logical replication ၏ subscription အကြောင်း — subscriber, publication များနှင့် ချိတ်ဆက်မှု၊ replication slot မှ ပြောင်းလဲမှုများ လက်ခံခြင်း၊ synchronous replication အတွက် standby အဖြစ် အသုံးပြုနိုင်ခြင်း၊ pg_dump နှင့် subscription များ၊ table/column တွဲဖက်မှုစည်းမျဉ်းများ၊ replication slot စီမံခန့်ခွဲမှုနှင့် အဆင့်ဆင့် ဥပမာများ"
order: 210
source: "https://www.postgresql.org/docs/current/logical-replication-subscription.html"
status: translated
updated: 2026-09-11
---

## 29.2. Subscription (စာရင်းသွင်း ချိတ်ဆက်မှု)

- **29.2.1. Replication Slot Management (replication slot စီမံခန့်ခွဲမှု)**
- **29.2.2. Examples: Set Up Logical Replication (ဥပမာများ — logical replication စတင် စီစဉ်ခြင်း)**
- **29.2.3. Examples: Deferred Replication Slot Creation (ဥပမာများ — replication slot ဖန်တီးမှုကို ရွှေ့ဆိုင်းခြင်း)**

*subscription* (စာရင်းသွင်း ချိတ်ဆက်မှု) ဆိုတာ logical replication ရဲ့ အောက်ပိုင်း (downstream) အခြမ်း ဖြစ်ပါတယ်။ subscription တစ်ခုကို သတ်မှတ်ထားတဲ့ node ကို *subscriber* (စာရင်းသွင်း လက်ခံသူ) လို့ ခေါ်ပါတယ်။ subscription တစ်ခုက — အခြား database တစ်ခုနဲ့ ချိတ်ဆက်မှု (connection) ကိုလည်းကောင်း — သူ subscribe လုပ်လိုတဲ့ publication (တစ်ခု သို့မဟုတ် တစ်ခုထက် ပို) အစုကိုလည်းကောင်း သတ်မှတ်ပါတယ်။

Subscriber database က အခြား PostgreSQL instance တစ်ခုလိုပဲ အလုပ်လုပ်ပြီး — ကိုယ်ပိုင် publication များ သတ်မှတ်ခြင်းအားဖြင့် — အခြား database များအတွက် publisher အဖြစ်လည်း သုံးနိုင်ပါတယ်။

Subscriber node တစ်ခုမှာ လိုချင်ရင် subscription အများအပြား ရှိနိုင်ပါတယ်။ publisher-subscriber အတွဲ တစ်တွဲတည်းကြားမှာ subscription အများအပြား သတ်မှတ်နိုင်ပြီး — အဲဒီလို လုပ်တဲ့အခါ — subscribe လုပ်ထားတဲ့ publication object များ ထပ်နေခြင်း (overlap) မဖြစ်အောင် ဂရုစိုက်ရပါမယ်။

Subscription တစ်ခုချင်းစီက replication slot တစ်ခု ([အပိုင်း 26.2.6](/docs/postgresql/warm-standby) ကို ကြည့်ပါ) မှတစ်ဆင့် ပြောင်းလဲမှုများကို လက်ခံရရှိပါတယ်။ ရှိပြီးသား table data များကို ကနဦး data synchronization လုပ်ဖို့ အပို replication slot များ လိုအပ်နိုင်ပြီး — အဲဒါတွေကို data synchronization အဆုံးမှာ ဖျက်ပစ်ပါလိမ့်မယ်။

Logical replication subscription တစ်ခုက synchronous replication အတွက် standby အဖြစ် လုပ်ဆောင်နိုင်ပါတယ် ([အပိုင်း 26.2.8](/docs/postgresql/warm-standby) ကို ကြည့်ပါ)။ standby နာမည်က ပုံမှန်အားဖြင့် subscription နာမည်ပဲ ဖြစ်ပါတယ်။ subscription ရဲ့ connection information ထဲမှာ `application_name` အနေနဲ့ အခြား နာမည် တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။

Subscriptions များကို — လက်ရှိ user က superuser ဖြစ်ရင် — `pg_dump` က dump လုပ်ပါတယ်။ မဟုတ်ရင်တော့ warning တစ်ခု ရေးပြီး subscriptions များကို ကျော်လွှားပါတယ် — အကြောင်းကတော့ non-superuser များက `pg_subscription` catalog ထဲက subscription အချက်အလက် အားလုံးကို ဖတ်လို့ မရလို့ပါ။

Subscription ကို [`CREATE SUBSCRIPTION`](/docs/postgresql/sql-createsubscription) နဲ့ ထည့်သွင်းပြီး — [`ALTER SUBSCRIPTION`](/docs/postgresql/sql-altersubscription) command နဲ့ အချိန်မရွေး ရပ်ဆိုင်း/ပြန်လည် စတင်နိုင်၊ [`DROP SUBSCRIPTION`](/docs/postgresql/sql-dropsubscription) နဲ့ ဖယ်ရှားနိုင်ပါတယ်။

Subscription တစ်ခုကို ဖျက်ပြီး ပြန်ဖန်တီးတဲ့အခါ synchronization အချက်အလက် ဆုံးရှုံးသွားပါတယ်။ ဆိုလိုတာက — နောက်ပိုင်းမှာ data ကို ပြန်လည် resynchronize လုပ်ရပါမယ်။

Schema definition များကို replicate မလုပ်ပါဘူး; publish လုပ်ထားတဲ့ table များက subscriber ပေါ်မှာ ရှိရပါမယ်။ Replication ရဲ့ target ဖြစ်နိုင်တာက regular table များသာ ဖြစ်ပါတယ်။ ဥပမာ — view တစ်ခုဆီ replicate လုပ်လို့ မရပါဘူး။

Table များကို publisher နဲ့ subscriber ကြားမှာ fully qualified table name သုံးပြီး တွဲဖက် (match) ပါတယ်။ Subscriber ပေါ်မှာ နာမည် မတူတဲ့ table များဆီ replication လုပ်တာကို ထောက်ပံ့ခြင်း မရှိပါဘူး။

Table တစ်ခုရဲ့ column များကိုလည်း နာမည်နဲ့ တွဲဖက်ပါတယ်။ Subscriber table ထဲက column အစီအစဉ်က publisher ရဲ့ အစီအစဉ်နဲ့ တူညီဖို့ မလိုပါဘူး။ Data ရဲ့ text representation ကို target type ဆီ ပြောင်းလဲနိုင်သရွေ့ — column များရဲ့ data type များ တူညီဖို့ မလိုပါဘူး။ ဥပမာ — `integer` type column ကနေ `bigint` type column ဆီ replicate လုပ်နိုင်ပါတယ်။ Target table မှာ published table က မပေးတဲ့ column အပိုများလည်း ရှိနိုင်ပါတယ်။ အဲဒီလို column များကို target table ရဲ့ definition မှာ သတ်မှတ်ထားတဲ့ default value နဲ့ ဖြည့်ပါလိမ့်မယ်။ ဒါပေမယ့် — binary format နဲ့ logical replication လုပ်တာကတော့ ပိုပြီး ကန့်သတ်ချက် ရှိပါတယ်။ အသေးစိတ်အတွက် `CREATE SUBSCRIPTION` ရဲ့ [`binary`](/docs/postgresql/sql-createsubscription) option ကို ကြည့်ပါ။

### 29.2.1. Replication Slot Management (replication slot စီမံခန့်ခွဲမှု)

အပေါ်မှာ ဖော်ပြခဲ့သလို — (active) subscription တစ်ခုချင်းစီက remote (publishing) ဘက်မှာရှိတဲ့ replication slot တစ်ခုကနေ ပြောင်းလဲမှုများကို လက်ခံရရှိပါတယ်။

အပို table synchronization slot များက ပုံမှန်အားဖြင့် ယာယီ (transient) ဖြစ်ပြီး — ကနဦး table synchronization လုပ်ဖို့ internal အနေနဲ့ ဖန်တီးကာ — မလိုအပ်တော့တဲ့အခါ အလိုအလျောက် ဖျက်ပစ်ပါတယ်။ ဒီ table synchronization slot များမှာ ဖန်တီးပေးထားတဲ့ နာမည်များ ရှိပါတယ် — “pg_%u_sync_%u_%llu” (parameters — Subscription *oid*, Table *relid*, system identifier *sysid*)

ပုံမှန်အားဖြင့် — remote replication slot ကို [`CREATE SUBSCRIPTION`](/docs/postgresql/sql-createsubscription) နဲ့ subscription ဖန်တီးတဲ့အခါ အလိုအလျောက် ဖန်တီးပြီး — [`DROP SUBSCRIPTION`](/docs/postgresql/sql-dropsubscription) နဲ့ subscription ဖျက်တဲ့အခါ အလိုအလျောက် ဖျက်ပစ်ပါတယ်။ ဒါပေမယ့် — အချို့ အခြေအနေများမှာ subscription နဲ့ သူ့အောက်ခံ replication slot ကို သီးခြား စီမံခန့်ခွဲဖို့ အသုံးဝင်နိုင် ဒါမှမဟုတ် လိုအပ်နိုင်ပါတယ်။ ဒီမှာ အခြေအနေ တချို့ ဖော်ပြထားပါတယ်:

- Subscription တစ်ခု ဖန်တီးတဲ့အခါ replication slot က အလျင်ရှိနေပြီးသား။ အဲဒီအခါ — ရှိပြီးသား slot နဲ့ ချိတ်ဆက်ဖို့ create_slot = false option သုံးပြီး subscription ကို ဖန်တီးနိုင်ပါတယ်။
- Subscription တစ်ခု ဖန်တီးတဲ့အခါ remote host ကို ဆက်သွယ်လို့ မရ ဒါမှမဟုတ် အခြေအနေ မရှင်းလင်း။ အဲဒီအခါ — connect = false option သုံးပြီး subscription ကို ဖန်တီးနိုင်ပါတယ်။ ဒါဆိုရင် remote host ကို လုံးဝ ဆက်သွယ်တော့မှာ မဟုတ်ပါဘူး။ ဒါက pg_dump သုံးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။ ဒါဆိုရင် subscription ကို activate မလုပ်ခင် remote replication slot ကို ကိုယ်တိုင် ဖန်တီးရပါလိမ့်မယ်။
- Subscription တစ်ခု ဖျက်တဲ့အခါ replication slot ကို ထိန်းထားချင်တာ။ Subscriber database ကို အခြား host တစ်ခုဆီ ရွှေ့ပြီး အဲဒီကနေ activate လုပ်မယ့်အခါ အသုံးဝင်နိုင်ပါတယ်။ အဲဒီအခါ — subscription ကို မဖျက်ခင် ALTER SUBSCRIPTION နဲ့ slot ကို subscription ကနေ disassociate လုပ်ပါ။
- Subscription တစ်ခု ဖျက်တဲ့အခါ remote host ကို ဆက်သွယ်လို့ မရ။ အဲဒီအခါ — subscription ကို မဖျက်ခင် ALTER SUBSCRIPTION နဲ့ slot ကို subscription ကနေ disassociate လုပ်ပါ။ Remote database instance က မရှိတော့ဘူးဆိုရင် နောက်ထပ် လုပ်ဆောင်ရန် မလိုပါဘူး။ ဒါပေမယ့် — remote database instance က ဆက်သွယ်လို့ မရတာမျိုးပဲ ဖြစ်ရင်တော့ — replication slot (နဲ့ ကျန်ရှိနေတဲ့ table synchronization slot များ) ကို ကိုယ်တိုင် ဖျက်သင့်ပါတယ်; မဟုတ်ရင် — အဲဒါ(တွေ)က WAL ကို ဆက်လက် သိမ်းဆည်းထားပြီး — နောက်ဆုံးမှာ disk ပြည့်သည်အထိ ဖြစ်စေနိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးကို သေသေချာချာ စစ်ဆေးသင့်ပါတယ်။

### 29.2.2. Examples: Set Up Logical Replication (ဥပမာများ — logical replication စတင် စီစဉ်ခြင်း)

Publisher ပေါ်မှာ test table အချို့ ဖန်တီးပါ။

```sql
/* pub # */ CREATE TABLE t1(a int, b text, PRIMARY KEY(a));
/* pub # */ CREATE TABLE t2(c int, d text, PRIMARY KEY(c));
/* pub # */ CREATE TABLE t3(e int, f text, PRIMARY KEY(e));
```

Subscriber ပေါ်မှာ အလားတူ table များ ဖန်တီးပါ။

```sql
/* sub # */ CREATE TABLE t1(a int, b text, PRIMARY KEY(a));
/* sub # */ CREATE TABLE t2(c int, d text, PRIMARY KEY(c));
/* sub # */ CREATE TABLE t3(e int, f text, PRIMARY KEY(e));
```

Publisher ဘက်မှာ table များဆီ data ထည့်ပါ။

```sql
/* pub # */ INSERT INTO t1 VALUES (1, 'one'), (2, 'two'), (3, 'three');
/* pub # */ INSERT INTO t2 VALUES (1, 'A'), (2, 'B'), (3, 'C');
/* pub # */ INSERT INTO t3 VALUES (1, 'i'), (2, 'ii'), (3, 'iii');
```

Table များအတွက် publication များ ဖန်တီးပါ။ `pub2` နဲ့ `pub3a` publication များက [`publish`](/docs/postgresql/sql-createpublication) operation တချို့ကို ခွင့်မပြုပါဘူး။ `pub3b` publication မှာ row filter တစ်ခု ရှိပါတယ် ([အပိုင်း 29.4](/docs/postgresql/logical-replication-row-filter) ကို ကြည့်ပါ)။

```sql
/* pub # */ CREATE PUBLICATION pub1 FOR TABLE t1;
/* pub # */ CREATE PUBLICATION pub2 FOR TABLE t2 WITH (publish = 'truncate');
/* pub # */ CREATE PUBLICATION pub3a FOR TABLE t3 WITH (publish = 'truncate');
/* pub # */ CREATE PUBLICATION pub3b FOR TABLE t3 WHERE (e > 5);
```

Publication များအတွက် subscription များ ဖန်တီးပါ။ `sub3` subscription က `pub3a` နဲ့ `pub3b` နှစ်ခုလုံးကို subscribe လုပ်ပါတယ်။ Subscription အားလုံးက ပုံမှန်အားဖြင့် ကနဦး data ကို copy လုပ်ပါလိမ့်မယ်။

```sql
/* sub # */ CREATE SUBSCRIPTION sub1
/* sub - */ CONNECTION 'host=localhost dbname=test_pub application_name=sub1'
/* sub - */ PUBLICATION pub1;
/* sub # */ CREATE SUBSCRIPTION sub2
/* sub - */ CONNECTION 'host=localhost dbname=test_pub application_name=sub2'
/* sub - */ PUBLICATION pub2;
/* sub # */ CREATE SUBSCRIPTION sub3
/* sub - */ CONNECTION 'host=localhost dbname=test_pub application_name=sub3'
/* sub - */ PUBLICATION pub3a, pub3b;
```

Publication ရဲ့ `publish` operation ဘယ်လိုပါစေ — ကနဦး table data ကို copy လုပ်တယ်ဆိုတာ သတိပြုပါ။

```sql
/* sub # */ SELECT * FROM t1;
 a |   b
---+-------
 1 | one
 2 | two
 3 | three
(3 rows)

/* sub # */ SELECT * FROM t2;
 c | d
---+---
 1 | A
 2 | B
 3 | C
(3 rows)
```

ထို့အပြင် — ကနဦး data copy က `publish` operation ကို လျစ်လျူရှုတာကြောင့်လည်းကောင်း — `pub3a` publication မှာ row filter မရှိတာကြောင့်လည်းကောင်း — copy လုပ်ထားတဲ့ `t3` table မှာ `pub3b` publication ရဲ့ row filter နဲ့ မကိုက်ညီတဲ့အခါမှာတောင် row အားလုံး ပါဝင်ပါတယ်။

```sql
/* sub # */ SELECT * FROM t3;
 e |  f
---+-----
 1 | i
 2 | ii
 3 | iii
(3 rows)
```

Publisher ဘက်မှာ table များဆီ data ထပ်ထည့်ပါ။

```sql
/* pub # */ INSERT INTO t1 VALUES (4, 'four'), (5, 'five'), (6, 'six');
/* pub # */ INSERT INTO t2 VALUES (4, 'D'), (5, 'E'), (6, 'F');
/* pub # */ INSERT INTO t3 VALUES (4, 'iv'), (5, 'v'), (6, 'vi');
```

အခု publisher ဘက်က data က ဒီလို ဖြစ်ပါတယ်:

```sql
/* pub # */ SELECT * FROM t1;
 a |   b
---+-------
 1 | one
 2 | two
 3 | three
 4 | four
 5 | five
 6 | six
(6 rows)

/* pub # */ SELECT * FROM t2;
 c | d
---+---
 1 | A
 2 | B
 3 | C
 4 | D
 5 | E
 6 | F
(6 rows)

/* pub # */ SELECT * FROM t3;
 e |  f
---+-----
 1 | i
 2 | ii
 3 | iii
 4 | iv
 5 | v
 6 | vi
(6 rows)
```

ပုံမှန် replication လုပ်တဲ့အခါ သင့်လျော်တဲ့ `publish` operation များကို သုံးတယ်ဆိုတာ သတိပြုပါ။ ဆိုလိုတာက — `pub2` နဲ့ `pub3a` publication များက `INSERT` ကို replicate လုပ်မှာ မဟုတ်ပါဘူး။ ထို့အပြင် — `pub3b` publication က `pub3b` ရဲ့ row filter နဲ့ ကိုက်ညီတဲ့ data ကိုပဲ replicate လုပ်ပါလိမ့်မယ်။ အခု subscriber ဘက်က data က ဒီလို ဖြစ်ပါတယ်:

```sql
/* sub # */ SELECT * FROM t1;
 a |   b
---+-------
 1 | one
 2 | two
 3 | three
 4 | four
 5 | five
 6 | six
(6 rows)

/* sub # */ SELECT * FROM t2;
 c | d
---+---
 1 | A
 2 | B
 3 | C
(3 rows)

/* sub # */ SELECT * FROM t3;
 e |  f
---+-----
 1 | i
 2 | ii
 3 | iii
 6 | vi
(4 rows)
```

### 29.2.3. Examples: Deferred Replication Slot Creation (ဥပမာများ — replication slot ဖန်တီးမှုကို ရွှေ့ဆိုင်းခြင်း)

အချို့ အခြေအနေများမှာ (ဥပမာ — [အပိုင်း 29.2.1](/docs/postgresql/logical-replication-subscription)) remote replication slot ကို အလိုအလျောက် မဖန်တီးခဲ့ဘူးဆိုရင် — subscription ကို activate မလုပ်ခင် user က ကိုယ်တိုင် ဖန်တီးရပါတယ်။ Slot ဖန်တီးပြီး subscription ကို activate လုပ်တဲ့ အဆင့်များကို အောက်ပါ ဥပမာများမှာ ပြထားပါတယ်။ ဒီဥပမာများက — built-in logical replication သုံးတဲ့ — standard logical decoding output plugin (`pgoutput`) ကို သတ်မှတ်ထားပါတယ်။

ပထမဆုံး — ဥပမာများ သုံးဖို့ publication တစ်ခု ဖန်တီးပါ။

```sql
/* pub # */ CREATE PUBLICATION pub1 FOR ALL TABLES;
```

ဥပမာ ၁: subscription က `connect = false` လို့ ဆိုတဲ့အခါ

- Subscription ကို ဖန်တီးပါ။

  /* sub # */ CREATE SUBSCRIPTION sub1
  /* sub - */ CONNECTION 'host=localhost dbname=test_pub'
  /* sub - */ PUBLICATION pub1
  /* sub - */ WITH (connect=false);
  WARNING:  subscription was created, but is not connected
  HINT:  To initiate replication, you must manually create the replication slot, enable the subscription, and refresh the subscription.

- Publisher ပေါ်မှာ slot တစ်ခုကို ကိုယ်တိုင် ဖန်တီးပါ။ CREATE SUBSCRIPTION လုပ်တဲ့အခါ နာမည် မသတ်မှတ်ခဲ့တာမို့ — ဖန်တီးရမယ့် slot ရဲ့ နာမည်က subscription နာမည်နဲ့ တူညီပါတယ် — ဥပမာ “sub1”။

  /* pub # */ SELECT * FROM pg_create_logical_replication_slot('sub1', 'pgoutput');
   slot_name |    lsn
  -----------+-----------
   sub1      | 0/19404D0
  (1 row)

- Subscriber ပေါ်မှာ subscription ရဲ့ activation ကို အပြီးသတ်ပါ။ ဒီနောက်မှာ pub1 ရဲ့ table များ replicate စပါလိမ့်မယ်။

  /* sub # */ ALTER SUBSCRIPTION sub1 ENABLE;
  /* sub # */ ALTER SUBSCRIPTION sub1 REFRESH PUBLICATION;

ဥပမာ ၂: subscription က `connect = false` လို့ ဆိုပြီး [`slot_name`](/docs/postgresql/sql-createsubscription) option ကိုပါ သတ်မှတ်တဲ့အခါ

- Subscription ကို ဖန်တီးပါ။

  /* sub # */ CREATE SUBSCRIPTION sub1
  /* sub - */ CONNECTION 'host=localhost dbname=test_pub'
  /* sub - */ PUBLICATION pub1
  /* sub - */ WITH (connect=false, slot_name='myslot');
  WARNING:  subscription was created, but is not connected
  HINT:  To initiate replication, you must manually create the replication slot, enable the subscription, and refresh the subscription.

- Publisher ပေါ်မှာ CREATE SUBSCRIPTION လုပ်တဲ့အခါ သတ်မှတ်ခဲ့တဲ့ နာမည်တူ (ဥပမာ “myslot”) နဲ့ slot တစ်ခုကို ကိုယ်တိုင် ဖန်တီးပါ။

  /* pub # */ SELECT * FROM pg_create_logical_replication_slot('myslot', 'pgoutput');
   slot_name |    lsn
  -----------+-----------
   myslot    | 0/19059A0
  (1 row)

- Subscriber ပေါ်မှာ ကျန်တဲ့ subscription activation အဆင့်များက အရင်နဲ့ တူညီပါတယ်။

  /* sub # */ ALTER SUBSCRIPTION sub1 ENABLE;
  /* sub # */ ALTER SUBSCRIPTION sub1 REFRESH PUBLICATION;

ဥပမာ ၃: subscription က `slot_name = NONE` လို့ သတ်မှတ်တဲ့အခါ

- Subscription ကို ဖန်တီးပါ။ slot_name = NONE ဖြစ်တဲ့အခါ enabled = false နဲ့ create_slot = false လည်း လိုအပ်ပါတယ်။

  /* sub # */ CREATE SUBSCRIPTION sub1
  /* sub - */ CONNECTION 'host=localhost dbname=test_pub'
  /* sub - */ PUBLICATION pub1
  /* sub - */ WITH (slot_name=NONE, enabled=false, create_slot=false);

- Publisher ပေါ်မှာ ဘယ်နာမည်မဆို (ဥပမာ “myslot”) သုံးပြီး slot တစ်ခုကို ကိုယ်တိုင် ဖန်တီးပါ။

  /* pub # */ SELECT * FROM pg_create_logical_replication_slot('myslot', 'pgoutput');
   slot_name |    lsn
  -----------+-----------
   myslot    | 0/1905930
  (1 row)

- Subscriber ပေါ်မှာ ခုနက ဖန်တီးလိုက်တဲ့ slot နာမည်နဲ့ subscription ကို ချိတ်ဆက်ပါ။

  /* sub # */ ALTER SUBSCRIPTION sub1 SET (slot_name='myslot');

- ကျန်တဲ့ subscription activation အဆင့်များက အရင်နဲ့ တူညီပါတယ်။

  /* sub # */ ALTER SUBSCRIPTION sub1 ENABLE;
  /* sub # */ ALTER SUBSCRIPTION sub1 REFRESH PUBLICATION;
