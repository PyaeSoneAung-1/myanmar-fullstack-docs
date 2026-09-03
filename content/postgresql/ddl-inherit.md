---
title: "Inheritance (table အမွေဆက်ခံခြင်း)"
description: "INHERITS clause နဲ့ table inheritance (အမွေဆက်ခံခြင်း) — child table ဖန်တီးပုံ၊ ONLY keyword နဲ့ descendant table တွေ ပါဝင်မှု ထိန်းချုပ်ပုံ၊ tableoid/regclass သုံးပြီး မူရင်း table ရှာပုံ၊ constraint/column အမွေဆက်ခံမှု စည်းမျဉ်းများနဲ့ caveats"
order: 29
source: "https://www.postgresql.org/docs/current/ddl-inherit.html"
status: translated
updated: 2026-09-03
---

## 5.11. Inheritance (table အမွေဆက်ခံခြင်း)

- **5.11.1. Caveats (သတိထားရန် အချက်များ)**

PostgreSQL က database designer တွေအတွက် အသုံးဝင်တဲ့ tool တစ်ခု ဖြစ်နိုင်တဲ့ table inheritance (table အမွေဆက်ခံခြင်း) ကို ထောက်ပံ့ပေးပါတယ်။ (SQL:1999 နဲ့ ၎င်းနောက်ပိုင်း ဗားရှင်းတွေမှာ type inheritance feature ကို သတ်မှတ်ထားပြီး — ဒါက ဒီမှာ ဖော်ပြထားတဲ့ feature တွေနဲ့ ရှုထောင့် များစွာမှာ ကွဲပြားပါတယ်။)

ဥပမာတစ်ခုနဲ့ စလိုက်ရအောင် — city တွေအတွက် data model တစ်ခု ဆောက်ချင်တယ် ဆိုပါစို့။ State တစ်ခုချင်းစီမှာ city တွေ အများကြီး ရှိပြီး capital (မြို့တော်) တစ်ခုပဲ ရှိပါတယ်။ State တစ်ခုချင်းစီအတွက် capital city ကို မြန်မြန် ရှာထုတ်နိုင်စေချင်ပါတယ်။ ဒါကို table နှစ်ခု ဖန်တီးပြီး လုပ်နိုင်ပါတယ် — တစ်ခုက state capitals တွေအတွက်၊ နောက်တစ်ခုက capital မဟုတ်တဲ့ city တွေအတွက်ပါ။ ဒါပေမယ့် city တစ်ခုရဲ့ data ကို — capital ဖြစ်ဖြစ် မဟုတ်ဘူး ဖြစ်ဖြစ် — မေးမြန်းချင်တဲ့အခါ ဘာဖြစ်မလဲ။ Inheritance feature က ဒီပြဿနာကို ဖြေရှင်းဖို့ ကူညီပေးနိုင်ပါတယ်။ `capitals` table ကို `cities` ကနေ အမွေဆက်ခံ (inherit) တဲ့ပုံစံ သတ်မှတ်ပါတယ်:

```sql
CREATE TABLE cities (
    name            text,
    population      float,
    elevation       int     -- in feet
);

CREATE TABLE capitals (
    state           char(2)
) INHERITS (cities);
```

ဒီအခြေအနေမှာ `capitals` table က သူ့ရဲ့ parent table `cities` ရဲ့ column တွေ အားလုံးကို အမွေဆက်ခံပါတယ်။ State capitals တွေမှာ သူတို့ရဲ့ state ကို ဖော်ပြတဲ့ `state` ဆိုတဲ့ အပို column တစ်ခု ထပ်ရှိပါတယ်။

PostgreSQL မှာ table တစ်ခုက တခြား table သုညခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ table တွေကနေ အမွေဆက်ခံနိုင်ပြီး — query တစ်ခုက table တစ်ခုရဲ့ row အားလုံးကိုပဲ ရည်ညွှန်းနိုင်သလို၊ table တစ်ခုရဲ့ row အားလုံး အပြင် သူ့ရဲ့ descendant table (သားစဉ်မြေးဆက် table) တွေရဲ့ row တွေပါ ရည်ညွှန်းနိုင်ပါတယ်။ နောက်ဆုံးပြောတဲ့ အပြုအမူ (descendant တွေ ပါဝင်တာ) က default ဖြစ်ပါတယ်။ ဥပမာ — အောက်က query က state capitals တွေ အပါအဝင် ပေ 500 ထက် မြင့်တဲ့ နေရာမှာ တည်ရှိတဲ့ city တွေ အားလုံးရဲ့ နာမည်တွေကို ရှာဖွေပေးပါတယ်:

```sql
SELECT name, elevation
    FROM cities
    WHERE elevation > 500;
```

PostgreSQL tutorial ထဲက sample data တွေကို သုံးထားတဲ့အတွက် ([အပိုင်း 2.1](https://www.postgresql.org/docs/current/tutorial-sql-intro.html) ကို ကြည့်ပါ) — ဒါက ဒီအတိုင်း ပြန်ပေးပါတယ်:

```sql
   name    | elevation
-----------+-----------
 Las Vegas |      2174
 Mariposa  |      1953
 Madison   |       845
```

တစ်ဖက်မှာတော့ — အောက်က query က state capital မဟုတ်ဘဲ ပေ 500 ထက် မြင့်တဲ့ နေရာမှာ တည်ရှိတဲ့ city တွေ အားလုံးကို ရှာဖွေပါတယ်:

```sql
SELECT name, elevation
    FROM ONLY cities
    WHERE elevation > 500;

   name    | elevation
-----------+-----------
 Las Vegas |      2174
 Mariposa  |      1953
```

ဒီမှာ `ONLY` keyword က query ကို `cities` ပေါ်မှာပဲ သက်ရောက်စေပြီး — inheritance hierarchy ထဲမှာ `cities` ရဲ့ အောက်မှာ ရှိတဲ့ table တွေအပေါ်ကို သက်ရောက်မခံစေဘူးလို့ ဖော်ပြပါတယ်။ ဒီအထိ ဆွေးနွေးပြီးသား command တွေထဲက အများအပြား — `SELECT`, `UPDATE` နဲ့ `DELETE` — က `ONLY` keyword ကို ထောက်ပံ့ပါတယ်။

Descendant table တွေ ပါဝင်တယ်ဆိုတာကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ချင်ရင် table နာမည်ရဲ့ နောက်မှာ `*` ထည့်ပြီးလည်း ရေးလို့ရပါတယ်:

```sql
SELECT name, elevation
    FROM cities*
    WHERE elevation > 500;
```

`*` ရေးဖို့တော့ မလိုပါဘူး — ဒီအပြုအမူက အမြဲတမ်း default ဖြစ်နေလို့ပါ။ ဒါပေမယ့် default ကို ပြောင်းလဲလို့ရတဲ့ ခေတ်ဟောင်း release တွေနဲ့ လိုက်ဖက်ညီအောင် (compatibility) ဒီ syntax ကို ဆက်လက် ထောက်ပံ့ပေးထားပါတယ်။

တချို့ အခြေအနေတွေမှာ row တစ်ခုက ဘယ် table ကနေ လာတယ်ဆိုတာ သိချင်နိုင်ပါတယ်။ Table တစ်ခုချင်းစီမှာ `tableoid` လို့ ခေါ်တဲ့ system column တစ်ခု ရှိပြီး — ဒါက မူရင်း table ကို ဖော်ပြနိုင်ပါတယ်:

```sql
SELECT c.tableoid, c.name, c.elevation
FROM cities c
WHERE c.elevation > 500;
```

ဒါက ဒီအတိုင်း ပြန်ပေးပါတယ်:

```sql
 tableoid |   name    | elevation
----------+-----------+-----------
   139793 | Las Vegas |      2174
   139793 | Mariposa  |      1953
   139798 | Madison   |       845
```

(ဒီဥပမာကို ကိုယ်တိုင် ပြန်စမ်းကြည့်ရင် numeric OID တွေ မတူတာတွေ ရနိုင်ပါတယ်။) `pg_class` နဲ့ join လုပ်ကြည့်ရင် — စစ်မှန်တဲ့ table နာမည်တွေကို မြင်ရပါတယ်:

```sql
SELECT p.relname, c.name, c.elevation
FROM cities c, pg_class p
WHERE c.elevation > 500 AND c.tableoid = p.oid;
```

ဒါက ဒီအတိုင်း ပြန်ပေးပါတယ်:

```sql
 relname  |   name    | elevation
----------+-----------+-----------
 cities   | Las Vegas |      2174
 cities   | Mariposa  |      1953
 capitals | Madison   |       845
```

အလားတူ ရလဒ်ကို ရဖို့ နောက်တစ်နည်းက `regclass` alias type ကို သုံးခြင်းပါ — ဒါက table OID ကို သင်္ကေတ (symbolic) ပုံစံနဲ့ ပြပါလိမ့်မယ်:

```sql
SELECT c.tableoid::regclass, c.name, c.elevation
FROM cities c
WHERE c.elevation > 500;
```

Inheritance က `INSERT` ဒါမှမဟုတ် `COPY` command တွေကနေ inheritance hierarchy ထဲက တခြား table တွေဆီကို data တွေကို အလိုအလျောက် မပို့ဆောင်ပေးပါဘူး။ ငါတို့ရဲ့ ဥပမာမှာ — အောက်က `INSERT` statement က မအောင်မြင်ပါဘူး:

```sql
INSERT INTO cities (name, population, elevation, state)
VALUES ('Albany', NULL, NULL, 'NY');
```

Data က ဘယ်လိုမျိုးနဲ့မဆို `capitals` table ဆီ ရောက်သွားမလားလို့ မျှော်လင့်မိနိုင်ပေမယ့် — အဲဒီလို မဖြစ်ပါဘူး: `INSERT` က သတ်မှတ်ထားတဲ့ table ထဲကိုပဲ အမြဲ insert လုပ်ပါတယ်။ တချို့ အခြေအနေတွေမှာ rule တစ်ခုကို သုံးပြီး insert လုပ်တာကို လမ်းကြောင်းပြောင်း (redirect) လုပ်နိုင်ပါတယ် ([အခန်း 39](https://www.postgresql.org/docs/current/rules.html) ကို ကြည့်ပါ)။ ဒါပေမယ့် အပေါ်က ကိစ္စအတွက်တော့ အဲဒါက အကူအညီ မဖြစ်ပါဘူး — `cities` table မှာ `state` column မပါလို့ command က rule ကို အသုံးချမရခင် ကြိုပြီး ပယ်ချခံရလို့ပါ။

Parent table ပေါ်က check constraint တွေနဲ့ not-null constraint တွေ အားလုံးကို သူ့ရဲ့ children (child table များ) က အလိုအလျောက် အမွေရပါတယ် — `NO INHERIT` clauses တွေနဲ့ တမင်တကာ တခြားနည်း သတ်မှတ်ထားရင်ကလွဲလို့ပါ။ တခြား constraint type တွေ (unique, primary key နဲ့ foreign key constraints) ကတော့ အမွေမရပါဘူး။

Table တစ်ခုက parent table တစ်ခုထက်ပိုပြီး အမွေဆက်ခံနိုင်ပြီး — အဲဒီအခါ သူ့မှာ parent table တွေက သတ်မှတ်ထားတဲ့ column တွေရဲ့ union (ပေါင်းစု) ရှိပါတယ်။ Child table ရဲ့ definition ထဲမှာ ကြေညာထားတဲ့ column တွေကိုလည်း ဒီထဲကို ထပ်ဖြည့်ပါတယ်။ Column နာမည် တစ်ခုတည်းက parent table အများအပြားမှာ ဖြစ်စေ၊ parent table တစ်ခုရော child ရဲ့ definition ထဲမှာပါ ဖြစ်စေ ပေါ်နေရင် — ဒီ column တွေကို "merged" (ပေါင်းစပ်) လုပ်လိုက်လို့ child table ထဲမှာ အဲဒီ column တစ်ခုတည်းပဲ ရှိတော့ပါတယ်။ Merge လုပ်ဖို့ဆိုရင် column တွေက data type တူညီနေရပါမယ် — မဟုတ်ရင် error တစ်ခု ထွက်ပါတယ်။ အမွေရနိုင်တဲ့ check constraint တွေနဲ့ not-null constraint တွေကိုလည်း အလားတူ ပုံစံမျိုးနဲ့ ပေါင်းစပ်ပါတယ်။ ဒါကြောင့် ဥပမာ — merge လုပ်လိုက်တဲ့ column တစ်ခုက သူလာတဲ့ column definition တွေထဲက တစ်ခုခုက not-null လို့ မှတ်သားထားရင် အဲဒီ column ကိုလည်း not-null အဖြစ် မှတ်သားပါတယ်။ Check constraint တွေက နာမည် တူညီရင် ပေါင်းစပ်ပြီး — သူတို့ရဲ့ conditions တွေ ကွဲပြားနေရင်တော့ merge က မအောင်မြင်ပါဘူး။

Table inheritance က ပုံမှန်အားဖြင့် child table ကို [`CREATE TABLE`](https://www.postgresql.org/docs/current/sql-createtable.html) statement ရဲ့ `INHERITS` clause နဲ့ ဖန်တီးတဲ့အခါ စတင်ပါတယ်။ တနည်းအားဖြင့် — လိုက်ဖက်ညီတဲ့ပုံစံ (compatible way) နဲ့ သတ်မှတ်ပြီးသား table တစ်ခုကို [`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) ရဲ့ `INHERIT` variant ကို သုံးပြီး parent relationship အသစ် ထပ်ထည့်လို့လည်း ရပါတယ်။ ဒီလိုလုပ်ဖို့ — child table အသစ်မှာ parent ရဲ့ column တွေနဲ့ နာမည်တူ၊ type တူတဲ့ column တွေ ကြိုပြီး ပါနေရပါမယ်။ ပြီးတော့ parent မှာ ရှိတဲ့ check constraint တွေနဲ့ နာမည်ရော check expression ပါ တူညီတဲ့ check constraint တွေလည်း ပါနေရပါမယ်။ အလားတူပဲ — `ALTER TABLE` ရဲ့ `NO INHERIT` variant ကို သုံးပြီး child တစ်ခုကနေ inheritance link ကို ဖယ်ရှားလို့လည်း ရပါတယ်။ Inheritance relationship ကို table partitioning အတွက် သုံးနေတဲ့အခါ ([အပိုင်း 5.12](/docs/postgresql/ddl-partitioning) ကို ကြည့်ပါ) — ဒီလို inheritance link တွေကို လိုသလို ထည့်ခြင်း၊ ဖယ်ခြင်းက အသုံးဝင်နိုင်ပါတယ်။

နောက်ပိုင်းမှာ child အသစ် ဖြစ်လာမယ့် လိုက်ဖက်ညီတဲ့ table တစ်ခုကို ဖန်တီးဖို့ အဆင်ပြေတဲ့ နည်းတစ်ခုက `CREATE TABLE` ထဲက `LIKE` clause ကို သုံးခြင်းပါ။ ဒါက source table ရဲ့ column တွေနဲ့ အတူတူ ပါဝင်တဲ့ table အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Source table ပေါ်မှာ `CHECK` constraint တွေ သတ်မှတ်ထားရင် — `LIKE` ရဲ့ `INCLUDING CONSTRAINTS` option ကိုပါ သတ်မှတ်ပေးသင့်ပါတယ် — အကြောင်းက child အသစ်က လိုက်ဖက်ညီ (compatible) လို့ သတ်မှတ်ခံရဖို့ parent နဲ့ တူညီတဲ့ constraint တွေ ရှိရမှာမို့လို့ပါ။

Child table တွေ ကျန်နေသေးသရွေ့ parent table တစ်ခုကို drop လုပ်လို့ မရပါဘူး။ Child table တွေရဲ့ column တွေ ဒါမှမဟုတ် check constraint တွေကို — သူတို့က parent table တစ်ခုခုကနေ အမွေရထားတာဆိုရင် — drop ဖြစ်စေ ပြောင်းလဲဖြစ်စေ လုပ်လို့ မရပါဘူး။ Table တစ်ခုနဲ့ သူ့ရဲ့ descendants အားလုံးကို ဖယ်ရှားချင်ရင် — လွယ်ကူတဲ့ နည်းတစ်ခုက parent table ကို `CASCADE` option နဲ့ drop လုပ်ခြင်းပါ ([အပိုင်း 5.15](/docs/postgresql/ddl-depend) ကို ကြည့်ပါ)။

`ALTER TABLE` က column data definition တွေနဲ့ check constraint တွေရဲ့ ပြောင်းလဲမှုတွေကို inheritance hierarchy တစ်လျှောက် အောက်သို့ ပျံ့နှံ့ (propagate) စေပါတယ်။ တခြား table တွေက မှီခိုနေတဲ့ column တွေကို drop လုပ်တာကလည်း — ဒီတစ်ခါလည်း `CASCADE` option ကို သုံးတဲ့အခါမှပဲ ဖြစ်နိုင်ပါတယ်။ `ALTER TABLE` က `CREATE TABLE` လုပ်တုန်းက သက်ရောက်ခဲ့တဲ့ duplicate column ပေါင်းစပ်မှုနဲ့ ပယ်ချမှု (rejection) စည်းမျဉ်းတွေကိုပဲ လိုက်နာပါတယ်။

Inherited query တွေက access permission စစ်ဆေးမှုကို parent table ပေါ်မှာပဲ လုပ်ပါတယ်။ ဒါကြောင့် ဥပမာ — `cities` table ပေါ်မှာ `UPDATE` permission ပေးထားရင် — `capitals` table ရဲ့ row တွေကို `cities` ကနေတစ်ဆင့် ဝင်ရောက်တဲ့အခါ အဲဒီ row တွေကိုပါ update လုပ်ခွင့် ရှိတယ်လို့ ဆိုလိုပါတယ်။ ဒါက data က (လည်း) parent table ထဲမှာ ရှိတယ်ဆိုတဲ့ ပုံပန်းသဏ္ဌာန်ကို ထိန်းသိမ်းပေးပါတယ်။ ဒါပေမယ့် `capitals` table ကိုတော့ — ထပ်ဆောင်း grant တစ်ခု မရှိဘဲ တိုက်ရိုက် update လုပ်လို့ မရပါဘူး။ အလားတူပဲ — parent table ရဲ့ row security policies တွေ ([အပိုင်း 5.9](/docs/postgresql/ddl-rowsecurity) ကို ကြည့်ပါ) ကို inherited query တစ်ခုအတွင်း child table တွေကနေ လာတဲ့ row တွေအပေါ်မှာလည်း အသုံးချပါတယ်။ Child table တစ်ခုရဲ့ policies တွေက — ရှိခဲ့ရင် — query ထဲမှာ အဲဒီ table ကို နာမည်နဲ့ တိုက်ရိုက် ဖော်ပြထားတဲ့အခါမှပဲ အသုံးချပြီး — အဲဒီအခါမှာ သူ့ရဲ့ parent (များ) ပေါ်မှာ ပူးတွဲထားတဲ့ policies တွေကိုတော့ လျစ်လျူရှုပါတယ်။

Foreign tables တွေက ([အပိုင်း 5.13](/docs/postgresql/ddl-foreign-data) ကို ကြည့်ပါ) — regular table တွေလိုပဲ — inheritance hierarchies တွေရဲ့ အစိတ်အပိုင်း ဖြစ်နိုင်ပြီး parent table ဒါမှမဟုတ် child table အဖြစ် ပါဝင်နိုင်ပါတယ်။ Foreign table တစ်ခုက inheritance hierarchy တစ်ခုရဲ့ အစိတ်အပိုင်း ဖြစ်နေရင် — အဲဒီ foreign table က မထောက်ပံ့တဲ့ operation တွေကို hierarchy တစ်ခုလုံးမှာလည်း မထောက်ပံ့ပါဘူး။

### 5.11.1. Caveats (သတိထားရန် အချက်များ)

SQL command တိုင်းက inheritance hierarchies တွေအပေါ်မှာ အလုပ်လုပ်နိုင်တာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။ Data querying (data မေးမြန်းခြင်း), data modification (data ပြုပြင်ခြင်း) ဒါမှမဟုတ် schema modification (schema ပြုပြင်ခြင်း) အတွက် သုံးတဲ့ command တွေ (ဥပမာ — `SELECT`, `UPDATE`, `DELETE`, `ALTER TABLE` ရဲ့ variant အများစု — ဒါပေမယ့် `INSERT` နဲ့ `ALTER TABLE ... RENAME` မပါဝင်ပါ) က ပုံမှန်အားဖြင့် child table တွေ ပါဝင်တာကို default လုပ်ပြီး — ဖယ်ထုတ်ဖို့ `ONLY` notation ကို ထောက်ပံ့ပါတယ်။ Database maintenance နဲ့ tuning လုပ်တဲ့ command တွေရဲ့ အများစု (ဥပမာ — `REINDEX`) က တစ်ခုချင်းစီရဲ့ physical table တွေအပေါ်မှာပဲ အလုပ်လုပ်ပြီး — inheritance hierarchies တွေအပေါ် recurse လုပ်တာကို မထောက်ပံ့ပါဘူး။ ဒါပေမယ့် `VACUUM` နဲ့ `ANALYZE` command နှစ်ခုလုံးကတော့ child table တွေ ပါဝင်တာကို default လုပ်ပြီး — ဖယ်ထုတ်နိုင်ဖို့ `ONLY` notation ကိုလည်း ထောက်ပံ့ပါတယ်။ Command တစ်ခုချင်းစီရဲ့ သက်ဆိုင်ရာ အပြုအမူတွေကို သူ့ရဲ့ reference page မှာ မှတ်တမ်းတင်ထားပါတယ် ([SQL Commands](https://www.postgresql.org/docs/current/sql-commands.html) ကို ကြည့်ပါ)။

Inheritance feature ရဲ့ အလေးနက် ကန့်သတ်ချက် တစ်ခုက — indexes (unique constraints တွေ အပါအဝင်) နဲ့ foreign key constraints တွေက table တစ်ခုချင်းစီအပေါ်မှာပဲ သက်ရောက်ပြီး — သူတို့ရဲ့ inheritance children တွေအပေါ်ကို သက်ရောက်တာ မဟုတ်ပါဘူး။ ဒါက foreign key constraint တစ်ခုရဲ့ referencing ဘက်ရော referenced ဘက်မှာပါ မှန်ပါတယ်။ ဒါကြောင့် — အပေါ်က ဥပမာရဲ့ သုံးအနှုန်းတွေနဲ့ ဆိုရင်:

- `cities.name` ကို UNIQUE ဒါမှမဟုတ် PRIMARY KEY လို့ ကြေညာထားရင်တောင် — `capitals` table မှာ `cities` ထဲက row တွေနဲ့ နာမည် ထပ်နေတဲ့ row တွေ ရှိနေတာကို မတားဆီးနိုင်ပါဘူး။ အဲဒီ duplicate row တွေကလည်း — default အနေနဲ့ — `cities` ကနေ query လုပ်တဲ့အခါ ပေါ်လာပါလိမ့်မယ်။ တကယ်တော့ — default အနေနဲ့ `capitals` မှာ unique constraint လုံးဝ မရှိနိုင်တာမို့ — နာမည်တူတဲ့ row တွေ အများအပြား ပါဝင်နိုင်ပါတယ်။ `capitals` ကို unique constraint ထည့်လို့လည်း ရပါတယ် — ဒါပေမယ့် `cities` နဲ့ ယှဉ်ရင် ထပ်နေမှုကို မကာကွယ်နိုင်ပါဘူး။
- အလားတူပဲ — `cities.name` က တခြား table တစ်ခုကို REFERENCES လုပ်ဖို့ သတ်မှတ်ရင် — ဒီ constraint က `capitals` ဆီကို အလိုအလျောက် မပျံ့နှံ့ပါဘူး။ ဒီကိစ္စမှာ `capitals` ကို ဒီအတိုင်း REFERENCES constraint ကို ကိုယ်တိုင် ထည့်ပေးပြီး ရှောင်ကွင်းလို့ ရပါတယ်။
- တခြား table တစ်ခုရဲ့ column က `cities(name)` ကို REFERENCES လုပ်ဖို့ သတ်မှတ်ရင် — အဲဒီ table ထဲမှာ city နာမည်တွေ ပါဝင်ခွင့် ရှိမှာဖြစ်ပြီး capital နာမည်တွေကတော့ ပါဝင်ခွင့် မရှိပါဘူး။ ဒီကိစ္စအတွက်တော့ ကောင်းမွန်တဲ့ ရှောင်ကွင်းနည်း (workaround) မရှိပါဘူး။

Inheritance hierarchies တွေအတွက် အကောင်အထည် မဖော်ထားတဲ့ လုပ်ဆောင်ချက် တချို့ကို declarative partitioning မှာ အကောင်အထည် ဖော်ထားပါတယ်။ Legacy inheritance နဲ့ partitioning က သင့် application အတွက် အသုံးဝင်မလားဆိုတာ ဆုံးဖြတ်တဲ့အခါ အလွန် ဂရုစိုက် စဉ်းစားဖို့ လိုပါတယ်။
