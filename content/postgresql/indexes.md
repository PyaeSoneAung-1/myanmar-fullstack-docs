---
title: "Indexes (အညွှန်း)"
description: "Index ဆိုတာ ဘာလဲ — CREATE INDEX, unique/composite/partial index — query တွေ မြန်အောင် ဘယ်လို သုံးပြီး ဘယ်အချိန် မသုံးသင့်ဘူးလဲ"
order: 6
source: "https://www.postgresql.org/docs/current/indexes.html"
status: translated
updated: 2026-09-01
---

## Index ဆိုတာ ဘာလဲ

**Index** တွေက database performance မြှင့်တင်ဖို့ အသုံးအများဆုံး နည်းလမ်းပါ — index တစ်ခုရှိရင် database server က လိုချင်တဲ့ row တွေကို index မရှိဘဲနဲ့ ထက် အများကြီး မြန်မြန် ရှာဖွေ ထုတ်ယူနိုင်ပါတယ်။ ဒါပေမယ့် index တွေက database system တစ်ခုလုံးကို overhead (အပိုဝန်ထုပ်ဝန်ပိုး) လည်း ဖြစ်စေလို့ — ဆင်ခြင်ဉာဏ်နဲ့ သုံးသင့်ပါတယ်။

ဥပမာ — ဒီလို table တစ်ခု ရှိတယ်ဆိုပါစို့:

```sql
CREATE TABLE test1 (
    id integer,
    content varchar
);

-- application က ဒီပုံစံ query တွေ အများကြီး ထုတ်ပါတယ်
SELECT content FROM test1 WHERE id = 123;
```

ဘာမှ ကြိုတင်ပြင်ဆင်ထားခြင်း မရှိရင် system က `test1` table တစ်ခုလုံးကို row တစ်ခုချင်း ရှာဖွေရပါမယ် — table ထဲမှာ row အများကြီး ရှိပြီး query က ပြန်ပေးမယ့် row က နည်းတယ်ဆိုရင် ဒါက မထိရောက်ပါဘူး။ `id` column ပေါ်မှာ index ထားပေးထားရင်တော့ system က ပိုထိရောက်တဲ့ နည်းနဲ့ ရှာလို့ရပါတယ် — ဥပမာ search tree ထဲ နှစ်ထပ် အနည်းငယ်လောက်ပဲ ဆင်းရတာမျိုးပါ။

ဒါနဲ့ ဆင်တူတာက — စာအုပ်အဆုံးမှာ စာဖတ်သူတွေ မကြာခဏ ရှာတတ်တဲ့ အသုံးအနှုန်းတွေကို အက္ခရာစဉ် index အဖြစ် စုထားပြီး — စာဖတ်သူက စာအုပ်တစ်အုပ်လုံး ဖတ်စရာမလိုဘဲ index ကနေ သက်ဆိုင်ရာ စာမျက်နှာကို လှန်ဖတ်လို့ရပါတယ်။ စာရေးဆရာက ဘာတွေကို လူတွေ ရှာဖွေမလဲ ကြိုမြင်ရသလို — database programmer ကလည်း ဘယ် index တွေ အသုံးဝင်မလဲ ကြိုမြင်ရပါတယ်။

## CREATE INDEX — Index ဖန်တီးခြင်း

`id` column ပေါ်မှာ index ဖန်တီးဖို့ ဒီ command ကို သုံးပါတယ်:

```sql
CREATE INDEX test1_id_index ON test1 (id);
```

`test1_id_index` ဆိုတဲ့ နာမည်က ကိုယ်ကြိုက်တာ ရွေးလို့ရပြီး — နောက်နောင် ဒီ index က ဘာအတွက်လဲ မှတ်မိလွယ်တဲ့ နာမည်မျိုး ရွေးသင့်ပါတယ်။ Index ဖျက်ချင်ရင် `DROP INDEX` ကို သုံးပြီး — index တွေကို ဘယ်အချိန်မဆို ထည့်/ဖျက် လုပ်လို့ရပါတယ်။

## Query Planner က index ကို ဘယ်လို သုံးသလဲ

Index ဖန်တီးပြီးတာနဲ့ ဘာမှ ထပ်လုပ်စရာ မလိုပါဘူး — table ပြောင်းလဲတိုင်း system က index ကို အလိုအလျောက် update လုပ်ပြီး — sequential scan ထက် ပိုထိရောက်မယ်လို့ ထင်ရင် query တွေမှာ သုံးပါတယ်။ ဒီဆုံးဖြတ်ချက်ကို **query planner** က ချပြီး — statistics တွေ မှန်ဖို့ `ANALYZE` command ကို ပုံမှန် run ပေးဖို့ လိုနိုင်ပါတယ်။

Index က `SELECT` တွေတင် မဟုတ်ဘဲ — search condition ပါတဲ့ `UPDATE`/`DELETE` တွေကိုပါ အကျိုးပြုပြီး join query တွေမှာလည်း — join condition ထဲပါတဲ့ column ပေါ်က index က join တွေကို သိသိသာသာ မြန်စေနိုင်ပါတယ်။ ဒါပေမယ့် index ဆောက်ပြီးတာနဲ့ — table နဲ့ index ကို လိုက်လျောညီထွေ ဖြစ်အောင် ထိန်းသိမ်းရတာမို့ — data manipulation (ဒေတာ ပြင်ဆင်ရေးသားမှု) တွေကို overhead ဖြစ်စေပါတယ်။

## Unique Indexes

Index တွေက column တစ်ခုရဲ့ တန်ဖိုး (ဒါမှမဟုတ် column များစွာ ပေါင်းထားတဲ့ တန်ဖိုး) ထပ်မဖြစ်အောင်လည်း သုံးပါတယ် — `CREATE UNIQUE INDEX index_name ON table_name (column_name);` လိုမျိုးပါ။ Unique index ကြေညာထားရင် — index တန်ဖိုး တူညီတဲ့ row များစွာ ရှိခွင့်မရှိပါဘူး။ Default အနေနဲ့ null တွေက တူညီသည်ဟု မသတ်မှတ်လို့ null အများကြီး ထားလို့ရပြီး — `NULLS NOT DISTINCT` option နဲ့ null တွေကိုပါ တူညီသည်ဟု သတ်မှတ်နိုင်ပါတယ်။ Column များစွာပါတဲ့ unique index ကတော့ column အားလုံး တူမှသာ ပယ်ပါတယ်။ မှတ်ထားစရာက — table မှာ primary key ဒါမှမဟုတ် unique constraint သတ်မှတ်လိုက်တာနဲ့ PostgreSQL က unique index ကို အလိုအလျောက် ဖန်တီးပေးပါတယ် — ဒါကြောင့် unique column တွေပေါ်မှာ လက်နဲ့ index ထပ်ဆောက်စရာ မလိုပါဘူး (အလိုအလျောက် ဆောက်ထားတာကို ထပ်နေလို့ပါ)။

## Composite Index — Column မျိုးစုံ ပေါင်းထားတဲ့ index

Index တစ်ခုကို column တစ်ခုထက်ပိုပြီးလည်း သတ်မှတ်လို့ရပါတယ် — ဥပမာ `major` နဲ့ `minor` နှစ်ခုစလုံးနဲ့ ရှာလေ့ရှိတဲ့ table:

```sql
CREATE TABLE test2 (
  major int,
  minor int,
  name varchar
);

CREATE INDEX test2_mm_idx ON test2 (major, minor);
```

`WHERE major = ... AND minor = ...` လို query တွေ မကြာခဏ ထုတ်ရင် — column နှစ်ခုလုံးကို တစ်ပြိုင်နက် index လုပ်ထားတာ အကျိုးရှိပါတယ်။ B-tree, GiST, GIN, BRIN လို index type တချို့က column မျိုးစုံ ထောက်ပံ့ပြီး — index တစ်ခုမှာ column အထိ ၃၂ ခုအထိ ပါနိုင်ပါတယ်။ ဒါပေမယ့် multicolumn B-tree index က column တစ်ချို့ပဲ ပါတဲ့ query တွေမှာလည်း သုံးလို့ရပေမယ့် — ပထမဆုံး (leftmost) column တွေကို စစ်တဲ့အခါ အထိရောက်ဆုံးပါ။ ပြီးတော့ multicolumn index တွေကို ချွေတာပြီး သုံးသင့်ပါတယ် — အများစုမှာ column တစ်ခုတည်းရဲ့ index ကပဲ လုံလောက်ပြီး နေရာလည်း သက်သာပါတယ်။ Column ၃ ခုထက်ပိုတဲ့ index က အသုံးဝင်ခဲပါတယ်။

## Partial Index — Table တစ်စိတ်တစ်ပိုင်းပေါ်က index

**Partial index** က table ရဲ့ အစိတ်အပိုင်းတစ်ခုအပေါ်မှာပဲ တည်ဆောက်တဲ့ index ပါ — ဘယ် row တွေ ပါဝင်မလဲကို predicate (conditional expression) နဲ့ သတ်မှတ်ပါတယ်။ အဓိက အသုံးဝင်တဲ့ နေရာက — အဖြစ်များတဲ့ တန်ဖိုးတွေကို index ထဲ မထည့်တော့တာပါ — အဖြစ်များတဲ့ တန်ဖိုးကို ရှာတဲ့ query က index ကို ဘာပဲဖြစ်ဖြစ် သုံးမှာ မဟုတ်လို့ အဲဒီ row တွေကို index ထဲ ထားစရာ အကြောင်းမရှိပါဘူး။ ဒါဆိုရင် index က သေးသွားပြီး — index သုံးတဲ့ query တွေရော table update တွေပါ မြန်လာပါတယ် (index ကို နေရာတိုင်းမှာ update လုပ်စရာ မလိုတော့လို့)။ ဥပမာ — orders table မှာ billed/unbilled ရော ရှိပြီး unbilled တွေက နည်းပေမယ့် အဝင်အထွက်အများဆုံး row တွေဆိုရင်:

```sql
CREATE INDEX orders_unbilled_index ON orders (order_nr)
    WHERE billed is not true;
```

ဒီလို partial index ကို query က သုံးနိုင်ဖို့ဆိုရင် — query ရဲ့ `WHERE` condition က index ရဲ့ predicate ကို ဆိုလိုတာမျိုး ဖြစ်ရပါတယ် (ဒီစစ်ဆေးမှုက query planning အချိန်မှာ လုပ်ပါတယ်)။ Partial unique index လည်း လုပ်လို့ရပြီး — predicate နဲ့ ကိုက်ညီတဲ့ row တွေကြားမှာပဲ uniqueness ကို သေချာစေပါတယ် — `CREATE UNIQUE INDEX tests_success_constraint ON tests (subject, target) WHERE success;` လိုမျိုးပေါ့။

## ဘယ်အချိန်မှာ index မလုပ်သင့်သလဲ

Index က အမြဲတမ်း အကျိုးရှိတာ မဟုတ်ပါဘူး:

- **Table သေးရင်** — row အနည်းငယ်ပဲ ရှိတဲ့ table မှာ sequential scan ကပဲ လုံလောက်ပြီး index က overhead ပိုဖြစ်စေပါတယ်။
- **Write တွေ များတဲ့ table ဆိုရင်** — row ထည့်/ပြင်/ဖျက် (`INSERT`/`UPDATE`/`DELETE`) လုပ်တိုင်း index ကိုပါ update လုပ်ရလို့ — performance နှေးစေနိုင်ပါတယ်။
- **ခဲခဲယဉ်းယဉ်းပဲ သုံးတဲ့ index ဆိုရင်** — query တွေမှာ မသုံးသလောက် ဖြစ်နေတဲ့ index တွေက overhead ပဲ ဖြစ်စေလို့ — ဖျက်ပစ်သင့်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Transactions (အရောင်းအဝယ်)](/docs/postgresql/transactions) — data integrity အတွက် transaction အကြောင်း ဆက်လေ့လာပါ
- [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) — join query တွေမှာ index တွေ ဘယ်လို အကျိုးပြုလဲ ဆက်ကြည့်ပါ
- [Aggregate Functions များ](/docs/postgresql/aggregate) — GROUP BY, HAVING ဆက်လေ့လာချင်ရင်
- [SQL အခြေခံ](/docs/postgresql/sql-basics) — table ဖန်တီးတာတွေ ပြန်ကြည့်ချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/indexes.html
