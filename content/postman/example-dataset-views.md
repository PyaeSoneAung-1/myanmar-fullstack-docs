---
title: "Postman မှာ ဥပမာ dataset views များ (Example dataset views in Postman)"
description: "Dataset views တွေက SQL ကို သုံးပြီး data တွေကို ဘယ်လို ပြန်ယူလဲဆိုတဲ့ ဥပမာများ — data အားလုံး ရွေးခြင်း၊ rows တွေ စစ်ထုတ်ခြင်း၊ column အသစ်တွေ ဖန်တီးခြင်း၊ data sources အများအပြား join လုပ်ခြင်း (SQLite နဲ့ MySQL syntax နှစ်မျိုးလုံး)"
order: 126
source: "https://learning.postman.com/docs/tests-and-scripts/datasets/example-dataset-views/"
status: translated
updated: 2026-09-03
---

Datasets တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ ပိုမိုသိရှိရန် [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

Views တွေက ကိုယ့် dataset ကနေ data တွေကို ဘယ်လို ပြန်ယူလဲ သတ်မှတ်ဖို့ SQL ကို သုံးပါတယ်။ Default အနေနဲ့ — views တွေက SQLite-compatible syntax နဲ့ functions တွေကို သုံးပါတယ်။ Dataset တစ်ခုမှာ MySQL, Postgres ဒါမှမဟုတ် SQL Server လိုမျိုး external data source type တစ်ခုတည်းသာ ရှိနေရင် — အဲဒီ data source အတွက် သီးသန့်ဖြစ်တဲ့ syntax နဲ့ functions တွေကိုလည်း သုံးနိုင်ပါတယ်။

Custom JDBC data sources တွေကတော့ ချိတ်ဆက်ထားတဲ့ database ရဲ့ native SQL dialect ကိုပဲ အမြဲတမ်း သုံးပါတယ်။ SQLite syntax ကို မရနိုင်ဘဲ — view တစ်ခုစီက JDBC source တစ်ခုတည်းကိုသာ ပစ်မှတ်ထားရပါမယ်။

အောက်က ဥပမာတွေက data sources အမျိုးမျိုးနဲ့ views တွေကို သုံးလေ့ရှိတဲ့ နည်းလမ်းတွေကို ပြသပါတယ်။

## ဥပမာ dataset အကြောင်း (About the example dataset)

အောက်က ဥပမာတွေမှာ — အောက်ပါ data sources တွေ ပါတဲ့ dataset တစ်ခု ရှိတယ်လို့ ယူဆပါ:

* အောက်ပါ data တွေ ပါတဲ့ `users` လို့ အမည်ရတဲ့ local CSV file တစ်ခု:

  ```csv
  userId,firstName,lastName,email
  1,John,Doe,john.doe@example.com
  2,Jane,Smith,jane.smith@example.com
  3,Bob,Johnson,bob.johnson@example.com
  ```
* အောက်ပါ data တွေ ပါတဲ့ `orders` လို့ အမည်ရတဲ့ MySQL database တစ်ခု:

  ```text
  | orderId | userId | amount |
  |---------|--------|--------|
  | 101     | 1      | 50.00  |
  | 102     | 2      | 75.00  |
  | 103     | 3      | 25.00  |
  ```

## Data အားလုံးကို ရွေးခြင်း (Select all data)

Rows နဲ့ columns အားလုံးကို ရွေးယူတဲ့ view တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

```sql
SELECT * FROM source_users;
```

## Rows တွေကို စစ်ထုတ်ခြင်း (Filter rows)

ကိုယ့် workflow အတွက် လိုအပ်တဲ့ data တွေကိုသာ ပြန်ပေးဖို့ rows တွေကို စစ်ထုတ်နိုင်ပါတယ်။

```sql
SELECT email, firstName, lastName
FROM source_users
WHERE userId = '2';
```

## Column အသစ်တွေ ဖန်တီးခြင်း (Create new columns)

ကိုယ့် query ထဲမှာ expressions နဲ့ aliases တွေကို သုံးပြီး column အသစ်တွေ ဖန်တီးနိုင်ပါတယ်။ ကိုယ့် tests ဒါမှမဟုတ် mock servers တွေက ရှိပြီးသား data တွေကနေ ဆင်းသက်လာတဲ့ တန်ဖိုးတွေ လိုအပ်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။

SQLite ဥပမာ:

```sql
SELECT firstName, lastName, firstName || ' ' || lastName AS fullName
FROM source_users;
```

MySQL ဥပမာ:

```sql
SELECT orderId, amount, CONCAT(orderId, ' ', amount) AS orderSummary
FROM source_orders;
```

## Data sources အများအပြားကို join လုပ်ခြင်း (Join multiple data sources)

Local CSV file တစ်ခုနဲ့ MySQL table တစ်ခု လိုမျိုး — data sources အများအပြားကန့် data တွေကို ပေါင်းစပ်နိုင်ပါတယ်။ နေရာအမျိုးမျိုးမှာ သိမ်းထားတဲ့ data တွေရဲ့ ပေါင်းစည်းထားတဲ့ (consolidated) မြင်ကွင်းတစ်ခု လိုချင်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။

Custom JDBC data sources တွေကို view တစ်ခုထဲမှာ တခြား source types တွေနဲ့ ပေါင်းစပ်လို့ မရပါဘူး။ JDBC source တစ်ခုပေါ်က view တစ်ခုစီက အဲဒီ source တစ်ခုတည်းကိုသာ ပစ်မှတ်ထားရပါမယ်။

```sql wordWrap
SELECT source_users.userId, source_users.firstName, source_users.lastName, source_orders.orderId, source_orders.amount
FROM source_users
JOIN source_orders ON source_users.userId = source_orders.userId;
```
