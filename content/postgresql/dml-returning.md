---
title: "Returning Data from Modified Rows (ပြင်ဆင်ထားသော row များမှ ဒေတာ ပြန်ထုတ်ခြင်း)"
description: "RETURNING clause နဲ့ ပြင်ဆင်လိုက်တဲ့ row ဆီက data တွေ ပြန်ယူနည်း — INSERT/UPDATE/DELETE/MERGE မှာ သုံးပုံ, old/new value ပြန်ထုတ်ခြင်း"
order: 40
source: "https://www.postgresql.org/docs/current/dml-returning.html"
status: translated
updated: 2026-09-03
---

## 6.4. Returning Data from Modified Rows (ပြင်ဆင်ထားသော row များမှ ဒေတာ ပြန်ထုတ်ခြင်း)

တချို့ အခြေအနေမျိုးမှာ — row တွေကို ပြင်ဆင်နေတုန်း အဲဒီ row တွေဆီက data တွေကို ရယူတာ အသုံးဝင်ပါတယ်။ `INSERT`, `UPDATE`, `DELETE` နဲ့ `MERGE` command တွေ အားလုံးမှာ ဒါကို ထောက်ပံ့ပေးတဲ့ optional `RETURNING` clause ပါပါတယ်။ `RETURNING` ကို သုံးခြင်းက — data စုဖို့ database query တစ်ခု ထပ်လုပ်တာကို ရှောင်ရှားပေးပြီး — တခြားနည်းနဲ့ဆို ပြင်ဆင်လိုက်တဲ့ row တွေကို စိတ်ချရစွာ ခွဲခြားသိဖို့ ခက်ခဲမယ့် အခြေအနေမျိုးမှာ အထူး အဖိုးတန်ပါတယ်။

`RETURNING` clause ထဲမှာ ထည့်လို့ရတဲ့ အကြောင်းအရာတွေက `SELECT` command ရဲ့ output list (ထုတ်ပြစာရင်း) နဲ့ အတူတူပါ ([အပိုင်း 7.3](https://www.postgresql.org/docs/current/queries-select-lists.html) မှာ ကြည့်ပါ)။ ဒီထဲမှာ command ရဲ့ target table ရဲ့ column name တွေ ဒါမှမဟုတ် အဲဒီ column တွေကို သုံးထားတဲ့ value expression တွေ ပါဝင်နိုင်ပါတယ်။ အတိုကောက် နည်းတစ်ခုကတော့ `RETURNING *` ပါ — ဒါက target table ရဲ့ column တွေ အားလုံးကို အစဉ်လိုက် ရွေးထုတ်ပေးပါတယ်။

`INSERT` တစ်ခုမှာ — `RETURNING` အတွက် ရနိုင်တဲ့ ပုံသေ data က insert လုပ်လိုက်တဲ့အတိုင်း row ပါ။ ရိုးရှင်းတဲ့ insert တွေမှာတော့ ဒါက သိပ် အသုံးမဝင်ပါဘူး — client က ပေးလိုက်တဲ့ data ကိုပဲ ထပ်ပြန်နေလို့ပါ။ ဒါပေမယ့် computed default value (တွက်ချက်ထားတဲ့ ပုံသေ တန်ဖိုး) တွေကို အားကိုးနေရတဲ့အခါ — အရမ်း အဆင်ပြေပါတယ်။ ဥပမာ — unique identifier တွေ ထောက်ပံ့ဖို့ [`serial`](https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL) column ကို သုံးတဲ့အခါ — `RETURNING` က row အသစ်တစ်ခုအတွက် သတ်မှတ်လိုက်တဲ့ ID ကို ပြန်ပေးနိုင်ပါတယ်:

```sql
CREATE TABLE users (firstname text, lastname text, id serial primary key);

INSERT INTO users (firstname, lastname) VALUES ('Joe', 'Cool') RETURNING id;
```

`RETURNING` clause က `INSERT ... SELECT` နဲ့ တွဲသုံးတဲ့အခါမှာလည်း အရမ်း အသုံးဝင်ပါတယ်။

`UPDATE` တစ်ခုမှာ — `RETURNING` အတွက် ရနိုင်တဲ့ ပုံသေ data က ပြင်ဆင်လိုက်တဲ့ row ရဲ့ အကြောင်းအရာ အသစ်ပါ။ ဥပမာ:

```sql
UPDATE products SET price = price * 1.10
  WHERE price <= 99.99
  RETURNING name, price AS new_price;
```

`DELETE` တစ်ခုမှာ — `RETURNING` အတွက် ရနိုင်တဲ့ ပုံသေ data က ဖျက်လိုက်တဲ့ row ရဲ့ အကြောင်းအရာပါ။ ဥပမာ:

```sql
DELETE FROM products
  WHERE obsoletion_date = 'today'
  RETURNING *;
```

`MERGE` တစ်ခုမှာ — `RETURNING` အတွက် ရနိုင်တဲ့ ပုံသေ data က source row ရဲ့ အကြောင်းအရာ အပြင် — insert၊ update ဒါမှမဟုတ် delete လုပ်လိုက်တဲ့ target row ရဲ့ အကြောင်းအရာပါ ပါဝင်ပါတယ်။ Source နဲ့ target မှာ column တူတွေ အများကြီး ရှိတတ်တာ အတော် အဖြစ်များလို့ — `RETURNING *` လို့ သတ်မှတ်လိုက်ရင် column တွေ ထပ်နေတာ အများကြီး ဖြစ်လာနိုင်ပါတယ်။ ဒါကြောင့် source row ဒါမှမဟုတ် target row တစ်ခုတည်းကိုပဲ ပြန်ထုတ်ဖို့ — qualify (column name တွေကို table name နဲ့ ရှေ့ဆွဲ သတ်မှတ်ခြင်း) လုပ်တာက ပိုပြီး အသုံးဝင်တတ်ပါတယ်။ ဥပမာ:

```sql
MERGE INTO products p USING new_products n ON p.product_no = n.product_no
  WHEN NOT MATCHED THEN INSERT VALUES (n.product_no, n.name, n.price)
  WHEN MATCHED THEN UPDATE SET name = n.name, price = n.price
  RETURNING p.*;
```

ဒီ command တစ်ခုချင်းစီမှာလည်း — ပြင်ဆင်လိုက်တဲ့ row ရဲ့ အကြောင်းအရာ အဟောင်း နဲ့ အသစ် နှစ်မျိုးလုံးကို ရှင်းရှင်းလင်းလင်း ပြန်ထုတ်လို့လည်း ရပါတယ်။ ဥပမာ:

```sql
UPDATE products SET price = price * 1.10
  WHERE price <= 99.99
  RETURNING name, old.price AS old_price, new.price AS new_price,
            new.price - old.price AS price_change;
```

ဒီဥပမာမှာ — `new.price` လို့ ရေးတာက `price` လို့ပဲ ရေးတာနဲ့ အတူတူပါ — ဒါပေမယ့် အဓိပ္ပာယ်ကို ပိုရှင်းလင်းစေပါတယ်။

အဟောင်း နဲ့ အသစ် တန်ဖိုးတွေကို ပြန်ထုတ်တဲ့ ဒီ syntax က `INSERT`, `UPDATE`, `DELETE` နဲ့ `MERGE` command တွေမှာ ရနိုင်ပေမယ့် — `INSERT` တစ်ခုအတွက်တော့ old value တွေက `NULL` ဖြစ်လေ့ရှိပြီး — `DELETE` တစ်ခုအတွက်တော့ new value တွေက `NULL` ဖြစ်လေ့ရှိပါတယ်။ ဒါပေမယ့် — ဒီ command တွေမှာ အဲဒါက အသုံးဝင်နိုင်တဲ့ အခြေအနေတွေလည်း ရှိပါတယ်။ ဥပမာ — [`ON CONFLICT DO UPDATE`](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT) clause ပါတဲ့ `INSERT` တစ်ခုမှာ — conflict ဖြစ်နေတဲ့ row တွေအတွက် old value တွေက `NULL` မဟုတ်ပါဘူး။ အလားတူပဲ — [rewrite rule](https://www.postgresql.org/docs/current/sql-createrule.html) တစ်ခုက `DELETE` ကို `UPDATE` အဖြစ် ပြောင်းလိုက်ရင် — new value တွေက `NULL` မဟုတ်တာ ဖြစ်နိုင်ပါတယ်။

Target table ပေါ်မှာ triggers ([အခန်း 37](https://www.postgresql.org/docs/current/triggers.html)) တွေ ရှိနေရင် — `RETURNING` အတွက် ရနိုင်တဲ့ data က triggers တွေရဲ့ ပြင်ဆင်မှုတွေ ပြီးသွားတဲ့ row ပါ။ ဒါကြောင့် — triggers တွေက တွက်ချက်ပေးတဲ့ column တွေကို စစ်ဆေးကြည့်တာက `RETURNING` ရဲ့ နောက်ထပ် သုံးလေ့ရှိတဲ့ use-case တစ်ခုပါ။
