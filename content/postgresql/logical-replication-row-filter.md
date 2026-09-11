---
title: "Row Filters (အတန်း စစ်ထုတ်မှုများ)"
description: "Logical replication row filter များအကြောင်း — WHERE clause ဖြင့် အတန်း စစ်ထုတ်ခြင်း၊ row filter စည်းမျဉ်းများနှင့် expression ကန့်သတ်ချက်များ၊ UPDATE အသွင်ပြောင်းခြင်း၊ partitioned table များ၊ ကနဦး data synchronization၊ row filter အများအပြား ပေါင်းစပ်ခြင်း နှင့် ဥပမာများ"
order: 212
source: "https://www.postgresql.org/docs/current/logical-replication-row-filter.html"
status: translated
updated: 2026-09-11
---

## 29.4. Row Filters (အတန်း စစ်ထုတ်မှုများ)

- **29.4.1. Row Filter Rules (row filter စည်းမျဉ်းများ)**
- **29.4.2. Expression Restrictions (expression ကန့်သတ်ချက်များ)**
- **29.4.3. UPDATE Transformations (UPDATE အသွင်ပြောင်းမှုများ)**
- **29.4.4. Partitioned Tables (partition ခွဲထားသော table များ)**
- **29.4.5. Initial Data Synchronization (ကနဦး data synchronization)**
- **29.4.6. Combining Multiple Row Filters (row filter အများအပြား ပေါင်းစပ်ခြင်း)**
- **29.4.7. Examples (ဥပမာများ)**

Default အားဖြင့် — publish လုပ်ထားတဲ့ table တွေအားလုံးက data အားလုံးကို သက်ဆိုင်ရာ subscriber တွေဆီ replicate လုပ်ပါတယ်။ Replicate လုပ်တဲ့ data ကို *row filter* (အတန်း စစ်ထုတ်မှု) တစ်ခု သုံးပြီး လျှော့ချနိုင်ပါတယ်။ User တစ်ယောက်က row filter တွေကို behavioral (အပြုအမူဆိုင်ရာ)၊ security (လုံခြုံရေး) ဒါမှမဟုတ် performance (စွမ်းဆောင်ရည်) အကြောင်းပြချက်တွေနဲ့ ရွေးချယ် သုံးချင်နိုင်ပါတယ်။ Publish လုပ်ထားတဲ့ table တစ်ခုက row filter တစ်ခု သတ်မှတ်ထားရင် — row တစ်ခုရဲ့ data က row filter expression နဲ့ ကိုက်ညီမှသာ အဲဒီ row ကို replicate လုပ်ပါတယ်။ ဒါက table အစုတစ်ခုကို တစ်စိတ်တစ်ပိုင်း (partially) replicate လုပ်နိုင်စေပါတယ်။ Row filter ကို table တစ်ခုချင်းစီအလိုက် သတ်မှတ်ပါတယ်။ Data ဖယ်ထုတ် (filter out) ဖို့ လိုတဲ့ publish လုပ်ထားတဲ့ table တစ်ခုချင်းစီအတွက် table နာမည်ရဲ့ နောက်မှာ `WHERE` clause တစ်ခု သုံးပါ။ `WHERE` clause ကို parentheses တွေနဲ့ ခြုံရပါမယ်။ အသေးစိတ်အတွက် [CREATE PUBLICATION](/docs/postgresql/sql-createpublication) ကို ကြည့်ပါ။

### 29.4.1. Row Filter Rules (row filter စည်းမျဉ်းများ)

Row filter တွေက ပြောင်းလဲမှုတွေကို publish မလုပ်ခင် အသုံးချပါတယ်။ Row filter က `false` ဒါမှမဟုတ် `NULL` ဖြစ်ထွက်လာရင် — အဲဒီ row ကို replicate မလုပ်ပါဘူး။ `WHERE` clause expression ကို replication connection အတွက် သုံးတဲ့ role နဲ့ပဲ (ဆိုလိုတာက [CREATE SUBSCRIPTION](/docs/postgresql/sql-createsubscription) ရဲ့ [`CONNECTION`](/docs/postgresql/sql-createsubscription) clause မှာ သတ်မှတ်ထားတဲ့ role) အကဲဖြတ်ပါတယ်။ Row filter တွေက `TRUNCATE` command အတွက် အကျိုး မသက်ရောက်ပါဘူး။

### 29.4.2. Expression Restrictions (expression ကန့်သတ်ချက်များ)

`WHERE` clause က simple expression တွေကိုပဲ ခွင့်ပြုပါတယ်။ User-defined functions (user သတ်မှတ် function များ)၊ operators၊ types နဲ့ collations တွေ၊ system column ရည်ညွှန်းချက်များ ဒါမှမဟုတ် immutable မဟုတ်တဲ့ built-in functions တွေ မပါဝင်နိုင်ပါဘူး။

Publication တစ်ခုက `UPDATE` ဒါမှမဟုတ် `DELETE` operation တွေကို publish လုပ်ရင် — row filter `WHERE` clause မှာ replica identity (replica အထောက်အထား) က လွှမ်းခြုံထားတဲ့ column တွေကိုပဲ ထည့်ရပါမယ် ([`REPLICA IDENTITY`](/docs/postgresql/sql-altertable) ကို ကြည့်ပါ)။ Publication တစ်ခုက `INSERT` operation တွေကိုပဲ publish လုပ်ရင်တော့ — row filter `WHERE` clause မှာ column တစ်ခုခုကို သုံးနိုင်ပါတယ်။

### 29.4.3. UPDATE Transformations (UPDATE အသွင်ပြောင်းမှုများ)

`UPDATE` တစ်ခုကို process လုပ်တဲ့အခါတိုင်း — row filter expression ကို row အဟောင်းနဲ့ row အသစ် နှစ်ခုလုံးအတွက် အကဲဖြတ်ပါတယ် (ဆိုလိုတာက update မတိုင်မီနဲ့ ပြီးနောက် data ကို သုံးပြီး)။ အကဲဖြတ်မှု နှစ်ခုလုံးက `true` ဖြစ်ရင် — `UPDATE` ပြောင်းလဲမှုကို replicate လုပ်ပါတယ်။ အကဲဖြတ်မှု နှစ်ခုလုံးက `false` ဖြစ်ရင် — ပြောင်းလဲမှုကို replicate မလုပ်ပါဘူး။ Row အဟောင်း/အသစ်ထဲက တစ်ခုပဲ row filter expression နဲ့ ကိုက်ညီရင် — data မကိုက်ညီမှု (inconsistency) မဖြစ်ရအောင် — `UPDATE` ကို `INSERT` ဒါမှမဟုတ် `DELETE` အဖြစ် အသွင်ပြောင်းပါတယ်။ Subscriber ပေါ်က row က publisher ပေါ်က row filter expression က သတ်မှတ်တဲ့အတိုင်း ထင်ဟပ်နေရပါမယ်။

Row အဟောင်းက row filter expression နဲ့ ကိုက်ညီပေမယ့် (subscriber ဆီ ပို့ခဲ့ပြီးသား) row အသစ်က မကိုက်ညီရင် — data ကိုက်ညီမှု (consistency) ရှုထောင့်ကနေ ကြည့်ရင် row အဟောင်းကို subscriber ဆီကနေ ဖယ်ရှားသင့်ပါတယ်။ ဒါကြောင့် `UPDATE` ကို `DELETE` အဖြစ် အသွင်ပြောင်းပါတယ်။

Row အဟောင်းက row filter expression နဲ့ မကိုက်ညီပေမယ့် (subscriber ဆီ မပို့ခဲ့ရဘူး) row အသစ်က ကိုက်ညီရင် — data ကိုက်ညီမှု ရှုထောင့်ကနေ ကြည့်ရင် row အသစ်ကို subscriber ဆီ ထည့်သင့်ပါတယ်။ ဒါကြောင့် `UPDATE` ကို `INSERT` အဖြစ် အသွင်ပြောင်းပါတယ်။

[ဇယား 29.1](/docs/postgresql/logical-replication-row-filter) က အသုံးချတဲ့ အသွင်ပြောင်းမှုတွေကို အကျဉ်းချုပ် ဖော်ပြပါတယ်။

**ဇယား 29.1. UPDATE Transformation Summary (UPDATE အသွင်ပြောင်းမှု အနှစ်ချုပ်)**

| Old row | New row | Transformation |
| --- | --- | --- |
| မကိုက်ညီ | မကိုက်ညီ | replicate မလုပ်ပါ |
| မကိုက်ညီ | ကိုက်ညီ | `INSERT` |
| ကိုက်ညီ | မကိုက်ညီ | `DELETE` |
| ကိုက်ညီ | ကိုက်ညီ | `UPDATE` |

### 29.4.4. Partitioned Tables (partition ခွဲထားသော table များ)

Publication ထဲမှာ partition ခွဲထားတဲ့ table (partitioned table) တစ်ခု ပါဝင်ရင် — publication parameter ဖြစ်တဲ့ [`publish_via_partition_root`](/docs/postgresql/sql-createpublication) က ဘယ် row filter ကို သုံးမလဲဆိုတာ ဆုံးဖြတ်ပါတယ်။ `publish_via_partition_root` က `true` ဖြစ်ရင် — root partitioned table ရဲ့ row filter ကို သုံးပါတယ်။ မဟုတ်ရင် — `publish_via_partition_root` က `false` (default) ဖြစ်တဲ့အခါ — partition တစ်ခုချင်းစီရဲ့ row filter ကို သုံးပါတယ်။

### 29.4.5. Initial Data Synchronization (ကနဦး data synchronization)

Subscription က ရှိပြီးသား table data ကို copy လုပ်ဖို့ လိုအပ်ပြီး publication တစ်ခုမှာ `WHERE` clause တွေ ပါဝင်ရင် — row filter expression တွေနဲ့ ကိုက်ညီတဲ့ data တွေကိုပဲ subscriber ဆီ copy လုပ်ပါတယ်။

Subscription မှာ table တစ်ခုကို မတူညီတဲ့ `WHERE` clause တွေနဲ့ publish လုပ်ထားတဲ့ publication အများအပြား ရှိရင် — expression တစ်ခုခုနဲ့ ကိုက်ညီတဲ့ row တွေကို copy လုပ်ပါလိမ့်မယ်။ အသေးစိတ်အတွက် [အပိုင်း 29.4.6](/docs/postgresql/logical-replication-row-filter) ကို ကြည့်ပါ။

> **သတိပေးချက်:** Initial data synchronization က ရှိပြီးသား table data ကို copy လုပ်တဲ့အခါ [`publish`](/docs/postgresql/sql-createpublication) parameter ကို ထည့်သွင်း စဉ်းစားခြင်း မရှိတာကြောင့် — DML သုံးပြီး replicate လုပ်မှာ မဟုတ်တဲ့ row တချို့ကို copy လုပ်မိနိုင်ပါတယ်။ [အပိုင်း 29.9.1](/docs/postgresql/logical-replication-architecture) ကို ရည်ညွှန်းပြီး ဥပမာတွေအတွက် [အပိုင်း 29.2.2](/docs/postgresql/logical-replication-subscription) ကို ကြည့်ပါ။

> **မှတ်ချက်:** Subscriber က version 15 မတိုင်မီ release တစ်ခုမှာ ရှိရင် — publication မှာ row filter တွေ သတ်မှတ်ထားရင်တောင် — ရှိပြီးသား data ကို copy လုပ်တဲ့အခါ row filter တွေကို မသုံးပါဘူး။ အကြောင်းကတော့ release အဟောင်းတွေက table data တစ်ခုလုံးကိုပဲ copy လုပ်နိုင်လို့ပါ။

### 29.4.6. Combining Multiple Row Filters (row filter အများအပြား ပေါင်းစပ်ခြင်း)

Subscription မှာ table တူတူကို မတူညီတဲ့ row filter တွေနဲ့ (တူညီတဲ့ [`publish`](/docs/postgresql/sql-createpublication) operation အတွက်) publish လုပ်ထားတဲ့ publication အများအပြား ရှိရင် — အဲဒီ expression တွေကို OR နဲ့ ပေါင်းစပ်ပါတယ် — ဒါကြောင့် expression တစ်ခုခုနဲ့ ကိုက်ညီတဲ့ row တွေကို replicate လုပ်ပါလိမ့်မယ်။ ဆိုလိုတာက — အောက်ပါ အခြေအနေတွေမှာ table တူတူအတွက် ကျန်တဲ့ row filter တွေ အားလုံး ပိုလျှံ (redundant) ဖြစ်သွားပါတယ်:

- Publication တစ်ခုမှာ row filter မရှိခြင်း။
- Publication တစ်ခုကို FOR ALL TABLES သုံးပြီး ဖန်တီးထားခြင်း။ ဒီ clause က row filter တွေကို ခွင့်မပြုပါဘူး။
- Publication တစ်ခုကို FOR TABLES IN SCHEMA သုံးပြီး ဖန်တီးထားပြီး — အဲဒီ table က ရည်ညွှန်းထားတဲ့ schema ထဲမှာ ပါဝင်ခြင်း။ ဒီ clause က row filter တွေကို ခွင့်မပြုပါဘူး။

### 29.4.7. Examples (ဥပမာများ)

အောက်ပါ ဥပမာတွေမှာ သုံးဖို့ table တချို့ ဖန်တီးပါ။

```sql
/* pub # */ CREATE TABLE t1(a int, b int, c text, PRIMARY KEY(a,c));
/* pub # */ CREATE TABLE t2(d int, e int, f int, PRIMARY KEY(d));
/* pub # */ CREATE TABLE t3(g int, h int, i int, PRIMARY KEY(g));
```

Publication တချို့ ဖန်တီးပါ။ Publication `p1` မှာ table တစ်ခု (`t1`) ပါပြီး အဲဒီ table မှာ row filter တစ်ခု ရှိပါတယ်။ Publication `p2` မှာ table နှစ်ခု ပါပါတယ်။ Table `t1` မှာ row filter မရှိဘဲ table `t2` မှာ row filter တစ်ခု ရှိပါတယ်။ Publication `p3` မှာ table နှစ်ခု ပါပြီး နှစ်ခုလုံးမှာ row filter တစ်ခုစီ ရှိပါတယ်။

```sql
/* pub # */ CREATE PUBLICATION p1 FOR TABLE t1 WHERE (a > 5 AND c = 'NSW');
/* pub # */ CREATE PUBLICATION p2 FOR TABLE t1, t2 WHERE (e = 99);
/* pub # */ CREATE PUBLICATION p3 FOR TABLE t2 WHERE (d = 10), t3 WHERE (g = 10);
```

`psql` ကို publication တစ်ခုချင်းစီအတွက် row filter expression တွေ (သတ်မှတ်ထားရင်) ပြသဖို့ သုံးနိုင်ပါတယ်။

```sql
/* pub # */ \dRp+
                                         Publication p1
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Generated columns | Via root
----------+------------+---------+---------+---------+-----------+-------------------+----------
 postgres | f          | t       | t       | t       | t         | none              | f
Tables:
    "public.t1" WHERE ((a > 5) AND (c = 'NSW'::text))

                                         Publication p2
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Generated columns | Via root
----------+------------+---------+---------+---------+-----------+-------------------+----------
 postgres | f          | t       | t       | t       | t         | none              | f
Tables:
    "public.t1"
    "public.t2" WHERE (e = 99)

                                         Publication p3
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Generated columns | Via root
----------+------------+---------+---------+---------+-----------+-------------------+----------
 postgres | f          | t       | t       | t       | t         | none              | f
Tables:
    "public.t2" WHERE (d = 10)
    "public.t3" WHERE (g = 10)
```

`psql` ကို table တစ်ခုချင်းစီအတွက် row filter expression တွေ (သတ်မှတ်ထားရင်) ပြသဖို့ သုံးနိုင်ပါတယ်။ Table `t1` က publication နှစ်ခုရဲ့ အဖွဲ့ဝင် ဖြစ်ပေမယ့် `p1` မှာပဲ row filter ရှိတာကို တွေ့ရပါတယ်။ Table `t2` က publication နှစ်ခုရဲ့ အဖွဲ့ဝင် ဖြစ်ပြီး တစ်ခုချင်းစီမှာ မတူညီတဲ့ row filter ရှိတာကို တွေ့ရပါတယ်။

```sql
/* pub # */ \d t1
                 Table "public.t1"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 a      | integer |           | not null |
 b      | integer |           |          |
 c      | text    |           | not null |
Indexes:
    "t1_pkey" PRIMARY KEY, btree (a, c)
Publications:
    "p1" WHERE ((a > 5) AND (c = 'NSW'::text))
    "p2"

/* pub # */ \d t2
                 Table "public.t2"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 d      | integer |           | not null |
 e      | integer |           |          |
 f      | integer |           |          |
Indexes:
    "t2_pkey" PRIMARY KEY, btree (d)
Publications:
    "p2" WHERE (e = 99)
    "p3" WHERE (d = 10)

/* pub # */ \d t3
                 Table "public.t3"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 g      | integer |           | not null |
 h      | integer |           |          |
 i      | integer |           |          |
Indexes:
    "t3_pkey" PRIMARY KEY, btree (g)
Publications:
    "p3" WHERE (g = 10)
```

Subscriber node ပေါ်မှာ publisher ပေါ်က definition နဲ့ တူတူ table `t1` တစ်ခု ဖန်တီးပြီး publication `p1` ကို subscribe လုပ်တဲ့ subscription `s1` ကိုလည်း ဖန်တီးပါ။

```sql
/* sub # */ CREATE TABLE t1(a int, b int, c text, PRIMARY KEY(a,c));
/* sub # */ CREATE SUBSCRIPTION s1
/* sub - */ CONNECTION 'host=localhost dbname=test_pub application_name=s1'
/* sub - */ PUBLICATION p1;
```

Row တချို့ ထည့်ပါ။ Publication `p1` ရဲ့ `t1 WHERE` clause နဲ့ ကိုက်ညီတဲ့ row တွေကိုပဲ replicate လုပ်ပါတယ်။

```sql
/* pub # */ INSERT INTO t1 VALUES (2, 102, 'NSW');
/* pub # */ INSERT INTO t1 VALUES (3, 103, 'QLD');
/* pub # */ INSERT INTO t1 VALUES (4, 104, 'VIC');
/* pub # */ INSERT INTO t1 VALUES (5, 105, 'ACT');
/* pub # */ INSERT INTO t1 VALUES (6, 106, 'NSW');
/* pub # */ INSERT INTO t1 VALUES (7, 107, 'NT');
/* pub # */ INSERT INTO t1 VALUES (8, 108, 'QLD');
/* pub # */ INSERT INTO t1 VALUES (9, 109, 'NSW');

/* pub # */ SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 2 | 102 | NSW
 3 | 103 | QLD
 4 | 104 | VIC
 5 | 105 | ACT
 6 | 106 | NSW
 7 | 107 | NT
 8 | 108 | QLD
 9 | 109 | NSW
(8 rows)
```

```sql
/* sub # */ SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 6 | 106 | NSW
 9 | 109 | NSW
(2 rows)
```

Row အဟောင်းနဲ့ row အသစ် တန်ဖိုးတွေ နှစ်ခုလုံး publication `p1` ရဲ့ `t1 WHERE` clause နဲ့ ကိုက်ညီတဲ့ data တချို့ကို update လုပ်ပါ။ `UPDATE` က ပြောင်းလဲမှုကို ပုံမှန်အတိုင်း replicate လုပ်ပါတယ်။

```sql
/* pub # */ UPDATE t1 SET b = 999 WHERE a = 6;

/* pub # */ SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 2 | 102 | NSW
 3 | 103 | QLD
 4 | 104 | VIC
 5 | 105 | ACT
 7 | 107 | NT
 8 | 108 | QLD
 9 | 109 | NSW
 6 | 999 | NSW
(8 rows)
```

```sql
/* sub # */ SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 9 | 109 | NSW
 6 | 999 | NSW
(2 rows)
```

Row အဟောင်း တန်ဖိုးတွေက publication `p1` ရဲ့ `t1 WHERE` clause နဲ့ မကိုက်ညီခဲ့ပေမယ့် row အသစ် တန်ဖိုးတွေက ကိုက်ညီတဲ့ data တချို့ကို update လုပ်ပါ။ `UPDATE` ကို `INSERT` အဖြစ် အသွင်ပြောင်းပြီး ပြောင်းလဲမှုကို replicate လုပ်ပါတယ်။ Subscriber ပေါ်က row အသစ်ကို ကြည့်ပါ။

```sql
/* pub # */ UPDATE t1 SET a = 555 WHERE a = 2;

/* pub # */ SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   3 | 103 | QLD
   4 | 104 | VIC
   5 | 105 | ACT
   7 | 107 | NT
   8 | 108 | QLD
   9 | 109 | NSW
   6 | 999 | NSW
 555 | 102 | NSW
(8 rows)
```

```sql
/* sub # */ SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   9 | 109 | NSW
   6 | 999 | NSW
 555 | 102 | NSW
(3 rows)
```

Row အဟောင်း တန်ဖိုးတွေက publication `p1` ရဲ့ `t1 WHERE` clause နဲ့ ကိုက်ညီခဲ့ပေမယ့် row အသစ် တန်ဖိုးတွေက မကိုက်ညီတဲ့ data တချို့ကို update လုပ်ပါ။ `UPDATE` ကို `DELETE` အဖြစ် အသွင်ပြောင်းပြီး ပြောင်းလဲမှုကို replicate လုပ်ပါတယ်။ Row က subscriber ဆီကနေ ဖယ်ရှားခံရတာကို တွေ့ရပါတယ်။

```sql
/* pub # */ UPDATE t1 SET c = 'VIC' WHERE a = 9;

/* pub # */ SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   3 | 103 | QLD
   4 | 104 | VIC
   5 | 105 | ACT
   7 | 107 | NT
   8 | 108 | QLD
   6 | 999 | NSW
 555 | 102 | NSW
   9 | 109 | VIC
(8 rows)
```

```sql
/* sub # */ SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   6 | 999 | NSW
 555 | 102 | NSW
(2 rows)
```

အောက်ပါ ဥပမာတွေက — partitioned table တွေရဲ့ ကိစ္စမှာ — parent table ဒါမှမဟုတ် child table ရဲ့ row filter ကို သုံးမလား ဆိုတာကို publication parameter [`publish_via_partition_root`](/docs/postgresql/sql-createpublication) က ဘယ်လို ဆုံးဖြတ်တယ်ဆိုတာ ပြသပါတယ်။

Publisher ပေါ်မှာ partitioned table တစ်ခု ဖန်တီးပါ။

```sql
/* pub # */ CREATE TABLE parent(a int PRIMARY KEY) PARTITION BY RANGE(a);
/* pub # */ CREATE TABLE child PARTITION OF parent DEFAULT;
```

Subscriber ပေါ်မှာ အလားတူ table တွေ ဖန်တီးပါ။

```sql
/* sub # */ CREATE TABLE parent(a int PRIMARY KEY) PARTITION BY RANGE(a);
/* sub # */ CREATE TABLE child PARTITION OF parent DEFAULT;
```

Publication `p4` တစ်ခု ဖန်တီးပြီး — ပြီးရင် အဲဒါကို subscribe လုပ်ပါ။ Publication parameter `publish_via_partition_root` ကို true လို့ သတ်မှတ်ထားပါတယ်။ Partitioned table (`parent`) နဲ့ partition (`child`) နှစ်ခုလုံးမှာ row filter တွေ သတ်မှတ်ထားပါတယ်။

```sql
/* pub # */ CREATE PUBLICATION p4 FOR TABLE parent WHERE (a < 5), child WHERE (a >= 5)
/* pub - */ WITH (publish_via_partition_root=true);
```

```sql
/* sub # */ CREATE SUBSCRIPTION s4
/* sub - */ CONNECTION 'host=localhost dbname=test_pub application_name=s4'
/* sub - */ PUBLICATION p4;
```

`parent` နဲ့ `child` table တွေဆီ တိုက်ရိုက် တန်ဖိုး တချို့ ထည့်ပါ။ သူတို့က `parent` ရဲ့ row filter ကို သုံးပြီး replicate လုပ်ပါတယ် (`publish_via_partition_root` က true ဖြစ်လို့ပါ)။

```sql
/* pub # */ INSERT INTO parent VALUES (2), (4), (6);
/* pub # */ INSERT INTO child VALUES (3), (5), (7);

/* pub # */ SELECT * FROM parent ORDER BY a;
 a
---
 2
 3
 4
 5
 6
 7
(6 rows)
```

```sql
/* sub # */ SELECT * FROM parent ORDER BY a;
 a
---
 2
 3
 4
(3 rows)
```

အလားတူ စမ်းသပ်မှုကိုပဲ ထပ်လုပ်ပါ — ဒါပေမယ့် `publish_via_partition_root` အတွက် မတူညီတဲ့ တန်ဖိုးနဲ့ပါ။ Publication parameter `publish_via_partition_root` ကို false လို့ သတ်မှတ်ထားပါတယ်။ Row filter တစ်ခုကို partition (`child`) မှာ သတ်မှတ်ထားပါတယ်။

```sql
/* pub # */ DROP PUBLICATION p4;
/* pub # */ CREATE PUBLICATION p4 FOR TABLE parent, child WHERE (a >= 5)
/* pub - */ WITH (publish_via_partition_root=false);
```

```sql
/* sub # */ ALTER SUBSCRIPTION s4 REFRESH PUBLICATION;
```

အရင်တုန်းကလိုပဲ publisher ပေါ်မှာ insert တွေ လုပ်ပါ။ သူတို့က `child` ရဲ့ row filter ကို သုံးပြီး replicate လုပ်ပါတယ် (`publish_via_partition_root` က false ဖြစ်လို့ပါ)။

```sql
/* pub # */ TRUNCATE parent;
/* pub # */ INSERT INTO parent VALUES (2), (4), (6);
/* pub # */ INSERT INTO child VALUES (3), (5), (7);

/* pub # */ SELECT * FROM parent ORDER BY a;
 a
---
 2
 3
 4
 5
 6
 7
(6 rows)
```

```sql
/* sub # */ SELECT * FROM child ORDER BY a;
 a
---
 5
 6
 7
(3 rows)
```
