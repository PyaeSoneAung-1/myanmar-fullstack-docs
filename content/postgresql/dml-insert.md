---
title: "Inserting Data (ဒေတာ ထည့်သွင်းခြင်း)"
description: "Table ထဲ row အသစ် ထည့်နည်း — INSERT command, column တန်ဖိုး သတ်မှတ်ခြင်း, default value သုံးခြင်း, command တစ်ခုထဲ row အများကြီး ထည့်ခြင်း, query result ထည့်ခြင်း"
order: 37
source: "https://www.postgresql.org/docs/current/dml-insert.html"
status: translated
updated: 2026-09-03
---

## 6.1. Inserting Data (ဒေတာ ထည့်သွင်းခြင်း)

Table တစ်ခုကို ဖန်တီးလိုက်ချိန်မှာ အဲဒီထဲမှာ data ဘာမှ မပါသေးပါဘူး။ Database တစ်ခု တကယ် အသုံးဝင်လာဖို့ ပထမဆုံး လုပ်ရမှာက data တွေ ထည့်သွင်းဖို့ပါ။ Data တွေကို row တစ်ခုချင်းစီအလိုက် ထည့်ပါတယ်။ Command တစ်ခုတည်းနဲ့ row အများကြီးကိုလည်း ထည့်လို့ရပါတယ် — ဒါပေမယ့် row တစ်ခုလုံး မပြည့်တဲ့အရာကိုတော့ ထည့်လို့ မရပါဘူး။ Column တချို့ရဲ့ တန်ဖိုးတွေပဲ သိရင်တောင် — row တစ်ခုလုံး ပြည့်ပြည့်စုံစုံ ဖန်တီးပေးရပါတယ်။

Row အသစ် တစ်ခု ဖန်တီးဖို့ [INSERT](https://www.postgresql.org/docs/current/sql-insert.html) command ကို သုံးပါတယ်။ ဒီ command မှာ table name နဲ့ column တန်ဖိုးတွေ လိုအပ်ပါတယ်။ ဥပမာ — [အခန်း 5](https://www.postgresql.org/docs/current/ddl.html) ထဲက products table ကို ကြည့်ရအောင်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric
);
```

Row တစ်ခု ထည့်သွင်းဖို့ ဥပမာ command ကတော့:

```sql
INSERT INTO products VALUES (1, 'Cheese', 9.99);
```

Data တန်ဖိုးတွေကို table ထဲမှာ column တွေ ပေါ်နေတဲ့ အစဉ်အတိုင်း — comma တွေနဲ့ ခြားပြီး — စာရင်းပေးရပါတယ်။ များသောအားဖြင့် data တန်ဖိုးတွေက literals (constant) တွေ ဖြစ်ကြပေမယ့် — scalar expression တွေကိုလည်း ခွင့်ပြုပါတယ်။

အပေါ်က syntax ရဲ့ အားနည်းချက်က — table ထဲက column တွေရဲ့ အစဉ်ကို သင်သိထားရတာပါ။ ဒါကို ရှောင်ဖို့ column တွေကို ရှင်းရှင်းလင်းလင်း စာရင်းထည့်ပြီးလည်း ရေးလို့ရပါတယ်။ ဥပမာ — အောက်က command နှစ်ခုလုံးက အပေါ်က command နဲ့ ရလဒ် အတူတူပါ:

```sql
INSERT INTO products (product_no, name, price) VALUES (1, 'Cheese', 9.99);
INSERT INTO products (name, price, product_no) VALUES ('Cheese', 9.99, 1);
```

User တော်တော်များများက column name တွေကို အမြဲတမ်း စာရင်းထည့်တာကို ကောင်းတဲ့ အလေ့အထတစ်ခုအဖြစ် မှတ်ယူပါတယ်။

Column အားလုံးအတွက် တန်ဖိုးတွေ မရှိဘူးဆိုရင် — တချို့ column တွေကို ချန်လိုက်လို့ရပါတယ်။ အဲဒီအခါ ချန်လိုက်တဲ့ column တွေကို သူတို့ရဲ့ default value (ပုံသေ တန်ဖိုး) တွေနဲ့ ဖြည့်ပေးပါတယ်။ ဥပမာ:

```sql
INSERT INTO products (product_no, name) VALUES (1, 'Cheese');
INSERT INTO products VALUES (1, 'Cheese');
```

ဒုတိယ ပုံစံက PostgreSQL extension (PostgreSQL မှာပဲ ပါတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခုပါ။ ဒီပုံစံက ဘယ်ဘက်ကစပြီး ပေးထားတဲ့ တန်ဖိုး အရေအတွက်အတိုင်း column တွေကို ဖြည့်ပေးပြီး — ကျန်တဲ့ column တွေကို default value တွေနဲ့ ဖြည့်ပါတယ်။

ရှင်းလင်းပြတ်သားစေဖို့ — column တစ်ခုချင်းစီ အတွက်ဖြစ်စေ၊ row တစ်ခုလုံး အတွက်ဖြစ်စေ — default value တွေကို ရှင်းရှင်းလင်းလင်း တောင်းဆိုလို့လည်း ရပါတယ်:

```sql
INSERT INTO products (product_no, name, price) VALUES (1, 'Cheese', DEFAULT);
INSERT INTO products DEFAULT VALUES;
```

Command တစ်ခုတည်းနဲ့ row အများကြီး ထည့်လို့လည်း ရပါတယ်:

```sql
INSERT INTO products (product_no, name, price) VALUES
    (1, 'Cheese', 9.99),
    (2, 'Bread', 1.99),
    (3, 'Milk', 2.99);
```

Query တစ်ခုရဲ့ ရလဒ် (row မရှိတာ၊ row တစ်ခု ဒါမှမဟုတ် row အများကြီး ဖြစ်နိုင်ပါတယ်) ကိုလည်း ထည့်လို့ ရပါတယ်:

```sql
INSERT INTO products (product_no, name, price)
  SELECT product_no, name, price FROM new_products
    WHERE release_date = 'today';
```

ဒါက ထည့်သွင်းရမယ့် row တွေကို တွက်ချက်ရာမှာ SQL query ယန္တရားရဲ့ စွမ်းအား အပြည့်ကို ([အခန်း 7](https://www.postgresql.org/docs/current/queries.html)) ရရှိစေပါတယ်။

> **အကြံပြုချက်:** Data အများကြီးကို တစ်ပြိုင်နက် ထည့်တဲ့အခါ — [COPY](https://www.postgresql.org/docs/current/sql-copy.html) command ကို သုံးဖို့ စဉ်းစားကြည့်ပါ။ [INSERT](https://www.postgresql.org/docs/current/sql-insert.html) command လောက် ပြောင်းလွယ်ပြင်လွယ် မရှိပေမယ့် — ပိုပြီး ထိရောက်ပါတယ်။ Bulk loading (data အမြောက်အများ တင်ခြင်း) ရဲ့ စွမ်းဆောင်ရည် မြှင့်တင်နည်း အသေးစိတ်ကို [အပိုင်း 14.4](https://www.postgresql.org/docs/current/populate.html) မှာ ကြည့်ပါ။
