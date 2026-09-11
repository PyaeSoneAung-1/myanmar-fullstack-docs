---
title: "Column Lists (column စာရင်းများ)"
description: "Logical replication column list များအကြောင်း — publish လုပ်မည့် column များ ရွေးချယ်ခြင်း၊ replica identity လိုအပ်ချက်၊ generated column များ၊ partitioned table နှင့် publish_via_partition_root၊ ကနဦး data synchronization နှင့် ဥပမာများ"
order: 231
source: "https://www.postgresql.org/docs/current/logical-replication-col-lists.html"
status: translated
updated: 2026-09-11
---

## 29.5. Column Lists (column စာရင်းများ)

- **29.5.1. Examples (ဥပမာများ)**

Publication တစ်ခုချင်းစီက — table တစ်ခုချင်းစီရဲ့ ဘယ် column များကို subscriber များဆီ replicate လုပ်မလဲ ဆိုတာကို ရွေးချယ် သတ်မှတ်နိုင်ပါတယ်။ Subscriber ဘက်က table မှာ publish လုပ်ထားတဲ့ column အားလုံး အနည်းဆုံး ရှိရပါမယ်။ Column list သတ်မှတ်မထားရင် publisher ပေါ်က column အားလုံးကို replicate လုပ်ပါတယ်။ Syntax အသေးစိတ်အတွက် [CREATE PUBLICATION](/docs/postgresql/sql-createpublication) ကို ကြည့်ပါ။

Column များ ရွေးချယ်တာက behavioral (အပြုအမူဆိုင်ရာ) ဒါမှမဟုတ် performance (စွမ်းဆောင်ရည်) အကြောင်းပြချက်များအပေါ် အခြေခံနိုင်ပါတယ်။ ဒါပေမယ့် — ဒီ feature ကို လုံခြုံရေးအတွက် အားကိုးတာမျိုး မလုပ်ပါနဲ့; malicious (မကောင်းကြံ) subscriber တစ်ခုက — အထူး publish မလုပ်ထားတဲ့ column များဆီကနေ data ကို ရယူနိုင်ပါတယ်။ လုံခြုံရေးကို ထည့်သွင်း စဉ်းစားရင် — publisher ဘက်မှာ အကာအကွယ်များ ချမှတ်နိုင်ပါတယ်။

Column list သတ်မှတ်မထားရင် — နောက်ပိုင်းမှာ table ဆီ ထည့်လိုက်တဲ့ column များကို အလိုအလျောက် replicate လုပ်ပါတယ်။ ဆိုလိုတာက — column အားလုံးကို နာမည် ဖော်ပြထားတဲ့ column list တစ်ခု ရှိတာက — column list လုံးဝ မရှိတာနဲ့ မတူပါဘူး။

Column list တစ်ခုမှာ simple column reference များကိုပဲ ထည့်နိုင်ပါတယ်။ List ထဲက column များရဲ့ အစီအစဉ်ကို မထိန်းသိမ်းပါဘူး။

Generated column များကိုလည်း column list ထဲမှာ သတ်မှတ်နိုင်ပါတယ်။ ဒါက publication parameter [`publish_generated_columns`](/docs/postgresql/sql-createpublication) ဘယ်လိုပါစေ — generated column များကို publish လုပ်နိုင်စေပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 29.6](/docs/postgresql/logical-replication-gencols) ကို ကြည့်ပါ။

Publication က [`FOR TABLES IN SCHEMA`](/docs/postgresql/sql-createpublication) ကိုပါ publish လုပ်တဲ့အခါ column list သတ်မှတ်တာကို ထောက်ပံ့ခြင်း မရှိပါဘူး။

Partition ခွဲထားတဲ့ table များအတွက် — publication parameter [`publish_via_partition_root`](/docs/postgresql/sql-createpublication) က ဘယ် column list ကို သုံးမလဲ ဆုံးဖြတ်ပါတယ်။ `publish_via_partition_root` က `true` ဖြစ်ရင် root partitioned table ရဲ့ column list ကို သုံးပါတယ်။ မဟုတ်ရင် — `publish_via_partition_root` က `false` (default) ဖြစ်တဲ့အခါ — partition တစ်ခုချင်းစီရဲ့ column list ကို သုံးပါတယ်။

Publication တစ်ခုက `UPDATE` ဒါမှမဟုတ် `DELETE` operation များကို publish လုပ်ရင် — column list တစ်ခုခုမှာ table ရဲ့ replica identity column များ ပါဝင်ရပါမယ် ([`REPLICA IDENTITY`](/docs/postgresql/sql-altertable) ကို ကြည့်ပါ)။ Publication တစ်ခုက `INSERT` operation များကိုပဲ publish လုပ်ရင်တော့ — column list မှာ replica identity column များကို ချန်လှပ်နိုင်ပါတယ်။

Column list များက `TRUNCATE` command အတွက် အကျိုး မသက်ရောက်ပါဘူး။

ကနဦး data synchronization လုပ်တဲ့အခါ publish လုပ်ထားတဲ့ column များကိုပဲ copy လုပ်ပါတယ်။ ဒါပေမယ့် subscriber က version 15 မတိုင်မီ release တစ်ခုကဆိုရင် — column list များကို လျစ်လျူရှုပြီး — ကနဦး data synchronization လုပ်တဲ့အခါ table ထဲက column အားလုံးကို copy လုပ်ပါတယ်။ Subscriber က version 18 မတိုင်မီ release တစ်ခုကဆိုရင် — publisher မှာ generated column များ သတ်မှတ်ထားရင်တောင် — ကနဦး table synchronization က generated column များကို copy မလုပ်ပါဘူး။

> **သတိပေးချက်:** လက်ရှိမှာ — table တူတူကို မတူညီတဲ့ column list များနဲ့ publish လုပ်ထားတဲ့ publication အများအပြား ပါဝင်တဲ့ subscription များအတွက် ထောက်ပံ့မှု မရှိပါဘူး။ [CREATE SUBSCRIPTION](/docs/postgresql/sql-createsubscription) က ဒီလို subscription များ ဖန်တီးတာကို ခွင့်မပြုပါဘူး — ဒါပေမယ့် subscription တစ်ခု ဖန်တီးပြီးနောက် publication ဘက်မှာ column list များကို ထည့်တာ ဒါမှမဟုတ် ပြောင်းလဲတာ လုပ်ခြင်းအားဖြင့် အဲဒီအခြေအနေမျိုးထဲ ရောက်နိုင်ပါသေးတယ်။
> 
> ဆိုလိုတာက — subscribe လုပ်ပြီးသား publication များပေါ်က table များရဲ့ column list များကို ပြောင်းလဲတာက subscriber ဘက်မှာ error များ ဖြစ်ပေါ်စေနိုင်ပါတယ်။
> 
> Subscription တစ်ခုက ဒီပြဿနာနဲ့ သက်ဆိုင်နေရင် — replication ပြန်လည် စတင်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက — publication ဘက်မှာ column list တစ်ခုကို အားလုံး ကိုက်ညီသွားတဲ့အထိ ချိန်ညှိပြီး — ပြီးရင် subscription ကို ပြန်လည် ဖန်တီးတာ ဒါမှမဟုတ် [`ALTER SUBSCRIPTION ... DROP PUBLICATION`](/docs/postgresql/sql-altersubscription) ကို သုံးပြီး ပြဿနာ ဖြစ်စေတဲ့ publication တစ်ခုကို ဖယ်ရှားပြီး ပြန်ထည့်တာ ဖြစ်ပါတယ်။

### 29.5.1. Examples (ဥပမာများ)

အောက်ပါ ဥပမာမှာ သုံးဖို့ table `t1` တစ်ခု ဖန်တီးပါ။

```sql
/* pub # */ CREATE TABLE t1(id int, a text, b text, c text, d text, e text, PRIMARY KEY(id));
```

Publication `p1` တစ်ခု ဖန်တီးပါ။ Replicate လုပ်မယ့် column အရေအတွက် လျှော့ချဖို့ table `t1` အတွက် column list တစ်ခု သတ်မှတ်ထားပါတယ်။ Column list ထဲက column နာမည်များရဲ့ အစီအစဉ်က အရေးမကြီးတာ သတိပြုပါ။

```sql
/* pub # */ CREATE PUBLICATION p1 FOR TABLE t1 (id, b, a, d);
```

Publication တစ်ခုချင်းစီအတွက် column list များ (သတ်မှတ်ထားရင်) ပြသဖို့ `psql` ကို သုံးနိုင်ပါတယ်။

```sql
/* pub # */ \dRp+
                                         Publication p1
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Generated columns | Via root
----------+------------+---------+---------+---------+-----------+-------------------+----------
 postgres | f          | t       | t       | t       | t         | none              | f
Tables:
    "public.t1" (id, a, b, d)
```

Table တစ်ခုချင်းစီအတွက် column list များ (သတ်မှတ်ထားရင်) ပြသဖို့ `psql` ကို သုံးနိုင်ပါတယ်။

```sql
/* pub # */ \d t1
                 Table "public.t1"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 id     | integer |           | not null |
 a      | text    |           |          |
 b      | text    |           |          |
 c      | text    |           |          |
 d      | text    |           |          |
 e      | text    |           |          |
Indexes:
    "t1_pkey" PRIMARY KEY, btree (id)
Publications:
    "p1" (id, a, b, d)
```

Subscriber node ပေါ်မှာ — publisher table `t1` မှာ ရှိခဲ့တဲ့ column များရဲ့ အစုအပိုင်း (subset) တစ်ခုကိုသာ လိုအပ်တဲ့ table `t1` တစ်ခု ဖန်တီးပါ — ပြီးရင် publication `p1` ကို subscribe လုပ်တဲ့ subscription `s1` ကိုလည်း ဖန်တီးပါ။

```sql
/* sub # */ CREATE TABLE t1(id int, b text, a text, d text, PRIMARY KEY(id));
/* sub # */ CREATE SUBSCRIPTION s1
/* sub - */ CONNECTION 'host=localhost dbname=test_pub application_name=s1'
/* sub - */ PUBLICATION p1;
```

Publisher node ပေါ်မှာ table `t1` ဆီ row အချို့ ထည့်ပါ။

```sql
/* pub # */ INSERT INTO t1 VALUES(1, 'a-1', 'b-1', 'c-1', 'd-1', 'e-1');
/* pub # */ INSERT INTO t1 VALUES(2, 'a-2', 'b-2', 'c-2', 'd-2', 'e-2');
/* pub # */ INSERT INTO t1 VALUES(3, 'a-3', 'b-3', 'c-3', 'd-3', 'e-3');
/* pub # */ SELECT * FROM t1 ORDER BY id;
 id |  a  |  b  |  c  |  d  |  e
----+-----+-----+-----+-----+-----
  1 | a-1 | b-1 | c-1 | d-1 | e-1
  2 | a-2 | b-2 | c-2 | d-2 | e-2
  3 | a-3 | b-3 | c-3 | d-3 | e-3
(3 rows)
```

Publication `p1` ရဲ့ column list ထဲက data များကိုပဲ replicate လုပ်ပါတယ်။

```sql
/* sub # */ SELECT * FROM t1 ORDER BY id;
 id |  b  |  a  |  d
----+-----+-----+-----
  1 | b-1 | a-1 | d-1
  2 | b-2 | a-2 | d-2
  3 | b-3 | a-3 | d-3
(3 rows)
```
